#!/usr/bin/env node

// Check game destinations in actual iframes. CrazyGames exposes a generic
// `options.disableEmbedding` flag in its game-frame document when a game is
// restricted to CrazyGames.com. X-Frame-Options/CSP are checked for all hosts.
//
// Run from the repository with:
//   node scripts/check-game-embeds.mjs

import express from 'express';
import { chromium } from 'playwright';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const gamesPath = path.join(root, 'games.json');
const games = JSON.parse(await readFile(gamesPath, 'utf8'));
const requestedLimit = Number(process.env.GAME_CHECK_LIMIT ?? Infinity);
const requestedIds = process.env.GAME_CHECK_IDS
  ? new Set(process.env.GAME_CHECK_IDS.split(',').map((id) => id.trim()))
  : null;
const candidates = games.filter((game) => game.direct !== true
  && (!requestedIds || requestedIds.has(game.gameid)))
  .slice(0, Number.isFinite(requestedLimit) ? requestedLimit : undefined);

function cspBlocksFraming(policy, documentUrl, parentOrigin) {
  const directive = policy.split(';').map((part) => part.trim())
    .find((part) => /^frame-ancestors\s/i.test(part));
  if (!directive) return false;

  const sources = directive.replace(/^frame-ancestors\s+/i, '').split(/\s+/);
  const document = new URL(documentUrl);
  const parent = new URL(parentOrigin);
  const allowsParent = sources.some((source) => {
    if (source === "'none'") return false;
    if (source === '*') return true;
    if (source === "'self'") return document.origin === parent.origin;
    if (source === 'http:' || source === 'https:') return parent.protocol === source;

    const match = source.match(/^(?:(https?):\/\/)?(\*\.)?([^/:]+)(?::(\d+|\*))?/i);
    if (!match) return false;
    const [, scheme, wildcard, host, port] = match;
    if (scheme && `${scheme.toLowerCase()}:` !== parent.protocol) return false;
    const hostMatches = wildcard
      ? parent.hostname.endsWith(`.${host.toLowerCase()}`)
      : parent.hostname.toLowerCase() === host.toLowerCase();
    if (!hostMatches) return false;
    return !port || port === '*' || port === parent.port
      || (!parent.port && ((parent.protocol === 'https:' && port === '443')
        || (parent.protocol === 'http:' && port === '80')));
  });
  return !allowsParent;
}

const app = express();
app.use(express.static(root));
const server = app.listen(0, '127.0.0.1');
await new Promise((resolve, reject) => {
  server.once('listening', resolve);
  server.once('error', reject);
});

const origin = `http://127.0.0.1:${server.address().port}`;
const chromePath = process.env.CHROME_PATH
  ?? (existsSync('/opt/google/chrome/chrome') ? '/opt/google/chrome/chrome' : undefined);
const browser = await chromium.launch({
  headless: true,
  ...(chromePath ? { executablePath: chromePath } : {}),
});

try {
  const page = await browser.newPage();
  await page.goto(`${origin}/Games.html`);
  page.on('dialog', (dialog) => dialog.dismiss());

  const findings = [];
  for (let offset = 0; offset < candidates.length; offset += 40) {
    const batch = candidates.slice(offset, offset + 40).map((game, localIndex) => {
      const index = offset + localIndex;
      const id = game.gameid ?? game.title ?? `entry-${index}`;
      const target = game.customurl
        ? new URL(game.customurl, `${origin}/`).href
        : `https://games.crazygames.com/en_US/${encodeURIComponent(game.gameid)}/index.html?skipPrerollFirstSession=true`;
      return { id, target, frameName: `game-check-${index}` };
    });
    const consoleMessages = [];
    const onConsole = (message) => {
      if (/Refused to display .* in a frame because it set/i.test(message.text())) {
        consoleMessages.push(message.text());
      }
    };
    page.on('console', onConsole);

    const responsePromises = batch.map(({ target }) => page.waitForResponse((candidate) =>
      candidate.request().isNavigationRequest() && candidate.url() === target,
    { timeout: 10000 }).catch(() => null));
    await page.evaluate((items) => {
      for (const { frameName, target } of items) {
        const iframe = document.createElement('iframe');
        iframe.name = frameName;
        iframe.src = target;
        iframe.style.cssText = 'position:fixed;left:-10000px;width:1px;height:1px';
        document.body.appendChild(iframe);
      }
    }, batch);
    const frames = await Promise.all(batch.map(async ({ frameName }) => {
      const element = await page.locator(`iframe[name="${frameName}"]`).elementHandle();
      return element ? element.contentFrame() : null;
    }));
    const responses = await Promise.all(responsePromises);

    const batchFindings = await Promise.all(batch.map(async (item, index) => {
      const frameObject = frames[index];
      const response = responses[index];
      try {
        if (frameObject) {
          await frameObject.waitForURL((url) => url.href !== 'about:blank', { timeout: 12000 }).catch(() => {});
          await frameObject.waitForLoadState('domcontentloaded', { timeout: 12000 }).catch(() => {});
        }
        const pageState = frameObject
          ? await frameObject.evaluate(() => ({
            disableEmbedding: window.options?.disableEmbedding === true
              || /["']?disableEmbedding["']?\s*:\s*true/i.test(document.documentElement?.outerHTML ?? ''),
            exclusiveMessage: /This version of .+ can be played exclusively on CrazyGames\.com/i
              .test(document.body?.innerText ?? ''),
            frameUrl: location.href,
          })).catch(() => ({ disableEmbedding: false, exclusiveMessage: false }))
          : { disableEmbedding: false, exclusiveMessage: false, frameUrl: '' };

        const headers = response ? await response.allHeaders() : {};
        const xFrameOptions = headers['x-frame-options'] ?? '';
        const csp = headers['content-security-policy'] ?? '';
        const documentUrl = response?.url() ?? item.target;
        const sameOriginBlocked = /^sameorigin$/i.test(xFrameOptions.trim())
          && new URL(documentUrl).origin !== origin;
        const policyBlocked = /^deny$/i.test(xFrameOptions.trim())
          || sameOriginBlocked
          || cspBlocksFraming(csp, documentUrl, origin);
        const consoleDenial = consoleMessages.find((message) => message.includes(item.target));
        const reasons = [];
        if (policyBlocked) reasons.push('X-Frame-Options/CSP blocks framing');
        if (pageState.disableEmbedding) reasons.push('CrazyGames disableEmbedding=true');
        if (pageState.exclusiveMessage) reasons.push('CrazyGames exclusive-play message');
        if (consoleDenial) reasons.push(consoleDenial);
        return {
          gameid: item.id,
          url: item.target,
          blocked: reasons.length > 0,
          reasons,
          status: response?.status() ?? null,
          ...(process.env.GAME_CHECK_DEBUG ? { frameUrl: pageState.frameUrl } : {}),
          ...(!response && !reasons.length ? { inconclusive: 'No iframe navigation response observed' } : {}),
        };
      } catch (error) {
        return { gameid: item.id, url: item.target, blocked: false, inconclusive: error.message };
      }
    }));
    findings.push(...batchFindings);
    await page.evaluate((names) => {
      for (const name of names) document.querySelector(`iframe[name="${name}"]`)?.remove();
    }, batch.map(({ frameName }) => frameName));
    page.off('console', onConsole);
  }

  const blocked = findings.filter((finding) => finding.blocked);
  const inconclusive = findings.filter((finding) => finding.inconclusive);
  console.log(JSON.stringify({
    checked: findings.length,
    blocked: blocked.length,
    inconclusive: inconclusive.length,
    findings: process.env.GAME_CHECK_DEBUG
      ? findings
      : findings.filter((finding) => finding.blocked || finding.inconclusive),
  }, null, 2));
} finally {
  await browser.close();
  await new Promise((resolve) => server.close(resolve));
}
