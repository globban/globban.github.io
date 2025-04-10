export default function randomButton(buttonId) {
    const btn = document.getElementById(buttonId);
    // An array of destination URLs – feel free to adjust with your URLs
    const websites = [
        "https://classic.minecraft.net/",
        "http://eelslap.com/",
        "https://alwaysjudgeabookbyitscover.com/",
        "https://cat-bounce.com/",
        "https://theuselessweb.com/",
        "https://oimo.io",
        "https://thisissand.com",
        "https://www.crazygames.com",
        "https://totaljerkface.com/happy_wheels.tjf",
        "https://orteil.dashnet.org/cookieclicker/",
        "https://www.coolmathgames.com",
        "https://www.crazygames.com/game/drift-hunters",
        "https://itch.io",
        "https://coolbackgrounds.io",
        "https://labs.openai.com",
        "https://libraryofbabel.info",
        "https://starblast.io",
        "https://2050.earth",
        "https://autodraw.com",
        "https://kodub.itch.io/polytrack",
        "https://googlefeud.com",
        "https://classicreload.com",
        "https://noclip.website",
        "https://www.spend-elon-fortune.com",
        "https://mecabricks.com",
        "https://geekprank.com/hacker/",
        "https://quickdraw.withgoogle.com",
        "https://unsplash.com",
        "https://www.geoguessr.com/",
        "https://www.thetruesize.com/",
        "https://neal.fun/space-elevator/",
        "https://neal.fun/wonders-of-street-view/",
        "https://neal.fun/perfect-circle/",
        "https://neal.fun/design-the-next-iphone/",
        "https://neal.fun/absurd-trolley-problems/",
        "https://neal.fun/deep-sea/",
        "https://neal.fun/life-stats/",
        "https://neal.fun/size-of-space/",
        "https://neal.fun/logos-from-memory/",
        "https://neal.fun/speed/",
        "https://neal.fun/auction-game/",
        "https://neal.fun/asteroid-launcher/",
        "https://ncs.io",
        "https://dogeminer2.com",
        "https://framesynthesis.com/drivingsimulator/maps/",
        "http://www.flashbynight.com/drench/",
        "https://www.linerider.com/",
        "https://www.shredsauce.com/"
    ];

    btn.addEventListener("click", (e) => {
        e.preventDefault();
        // Pick a final random website and store it.
        const finalIndex = Math.floor(Math.random() * websites.length);
        const selectedSite = websites[finalIndex];
        const destElement = document.getElementById("destination-url");

        // Start an interval to simulate "deciding" every 100ms.
        const interval = setInterval(() => {
            const tempIndex = Math.floor(Math.random() * websites.length);
            destElement.textContent = `${websites[tempIndex]}`;
            destElement.classList.remove("glow");
        }, 100);

        // After 2 seconds, stop the interval, show the final destination with glow, then redirect.
        setTimeout(() => {
            clearInterval(interval);
            destElement.textContent = `${selectedSite}`;
            destElement.classList.add("glow");
            // Wait a short moment so the user notices the final glowing message, then redirect.
            setTimeout(() => {
                window.location.href = selectedSite;
            }, 800);
        }, 2000);
    });
}