        // ============ TEXT TO ASCII ============

        class FLFParser {
            constructor(fontData) {
                this.lines = fontData.split('\n');
                this.parseHeader();
                this.parseCharacters();
            }

            parseHeader() {
                const header = this.lines[0];
                const parts = header.split(/\s+/);
                
                if (!parts[0].startsWith('flf2')) {
                    throw new Error('Invalid FLF file format');
                }

                this.hardblank = parts[0][5] || '$';
                this.height = parseInt(parts[1]) || 8;
                this.baseline = parseInt(parts[2]) || 6;
                this.maxLength = parseInt(parts[3]) || 80;
                this.oldLayout = parseInt(parts[4]) || 0;
                this.commentLines = parseInt(parts[5]) || 0;
                this.printDirection = parseInt(parts[6]) || 0;
                this.fullLayout = parseInt(parts[7]) || 0;
                this.codeTagCount = parseInt(parts[8]) || 0;

                this.contentStartLine = 1 + this.commentLines;
            }

            parseCharacters() {
                this.characters = {};
                let currentLine = this.contentStartLine;

                for (let charCode = 32; charCode <= 126; charCode++) {
                    const charLines = [];
                    for (let i = 0; i < this.height; i++) {
                        if (currentLine < this.lines.length) {
                            let line = this.lines[currentLine];
                            line = line.replace(new RegExp(this.escapeRegex(this.hardblank), 'g'), ' ');
                            charLines.push(line);
                            currentLine++;
                        }
                    }
                    this.characters[String.fromCharCode(charCode)] = charLines;
                }
            }

            escapeRegex(str) {
                return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            }

            renderText(text) {
                const result = [];
                for (let i = 0; i < this.height; i++) {
                    let line = '';
                    for (const char of text) {
                        if (this.characters[char]) {
                            line += this.characters[char][i] || ' ';
                        }
                    }
                    result.push(line.trimEnd());
                }
                return result.join('\n');
            }
        }

        const allFonts = [
            "1Row", "3-D", "3D Diagonal", "3D-ASCII", "3d", "3d_diagonal", "3x5", "4Max",
            "5 Line Oblique", "5lineoblique", "AMC 3 Line", "AMC 3 Liv1", "AMC AAA01", "AMC Neko",
            "AMC Razor", "AMC Razor2", "AMC Slash", "AMC Slider", "AMC Thin", "AMC Tubes",
            "AMC Untitled", "ANSI Regular", "ANSI Shadow", "ASCII New Roman", "Acrobatic",
            "Alligator", "Alligator2", "alligator3", "Alpha", "Alphabet", "Arrows", "Avatar",
            "B1FF", "Banner", "Banner3-D", "Banner3", "Banner4", "Barbwire", "Basic", "Bear",
            "Bell", "Benjamin", "Big Chief", "Big Money-ne", "Big Money-nw", "Big Money-se",
            "Big Money-sw", "Big", "Bigfig", "Binary", "Block", "Blocks", "Bloody", "Bolger",
            "Braced", "Bright", "Broadway KB", "Broadway", "Bubble", "Bulbhead", "Caligraphy",
            "Caligraphy2", "Calvin S", "Cards", "Catwalk", "Chiseled", "Chunky", "Coinstak",
            "Cola", "Colossal", "Computer", "Contessa", "Contrast", "Cosmike", "Crawford",
            "Crawford2", "Crazy", "Cricket", "Cursive", "Cyberlarge", "Cybermedium",
            "Cybersmall", "Cygnet", "DANC4", "DOS Rebel", "DWhistled", "Dancing Font",
            "Decimal", "Def Leppard", "Delta Corps Priest 1", "Diamond", "Diet Cola", "Digital",
            "Doh", "Doom", "Dot Matrix", "Double Shorts", "Double", "Dr Pepper", "Efti Chess",
            "Efti Font", "Efti Italic", "Efti Piti", "Efti Robot", "Efti Wall", "Efti Water",
            "Electronic", "Elite", "Epic", "Fender", "Filter", "Fire Font-k", "Fire Font-s",
            "Flipped", "Flower Power", "Four Tops", "Fraktur", "Fun Face", "Fun Faces", "Fuzzy",
            "Georgi16", "Georgia11", "Ghost", "Ghoulish", "Glenyn", "Goofy", "Gothic", "Graceful",
            "Gradient", "Graffiti", "Greek", "Heart Left", "Heart Right", "Henry 3D", "Hex",
            "Hieroglyphs", "Hollywood", "Horizontal Left", "Horizontal Right", "ICL-1900",
            "Impossible", "Invita", "Isometric1", "Isometric2", "Isometric3", "Isometric4",
            "Italic", "Ivrit", "JS Block Letters", "JS Bracket Letters", "JS Capital Curves",
            "JS Cursive", "JS Stick Letters", "Jacky", "Jazmine", "Jerusalem", "Katakana",
            "Kban", "Keyboard", "Knob", "Konto Slant", "Konto", "LCD", "Larry 3D 2", "Larry 3D",
            "Lean", "Letters", "Lil Devil", "Line Blocks", "Linux", "Lockergnome", "Madrid",
            "Marquee", "Maxfour", "Merlin1", "Merlin2", "Mike", "Mini", "Mirror", "Mnemonic",
            "Modular", "Morse", "Morse2", "Moscow", "Mshebrew210", "Muzzle", "NScript",
            "NT Greek", "NV Script", "Nancyj-Fancy", "Nancyj-Improved", "Nancyj-Underlined",
            "Nancyj", "Nipples", "O8", "OS2", "Octal", "Ogre", "Old Banner", "Patorjk's Cheese",
            "Patorjk-HeX", "Pawp", "Peaks Slant", "Peaks", "Pebbles", "Pepper", "Poison", "Puffy",
            "Puzzle", "Pyramid", "Rammstein", "Rectangles", "Red Phoenix", "Relief", "Relief2",
            "Reverse", "Roman", "Rot13", "Rotated", "Rounded", "Rowan Cap", "Rozzo", "Runic",
            "Runyc", "S Blood", "SL Script", "Santa Clara", "Script", "Serifcap", "Shadow",
            "Shimrod", "Short", "Slant Relief", "Slant", "Slide", "Small Caps", "Small Isometric1",
            "Small Keyboard", "Small Poison", "Small Script", "Small Shadow", "Small Slant",
            "Small Tengwar", "Small", "Soft", "Speed", "Spliff", "Stacey", "Stampate",
            "Stampatello", "Standard", "Star Strips", "Star Wars", "Stellar", "Stforek",
            "Stick Letters", "Stop", "Straight", "Stronger Than All", "Sub-Zero", "Swamp Land",
            "Swan", "Sweet", "THIS", "Tanja", "Tengwar", "Term", "Test1", "The Edge", "Thick",
            "Thin", "Thorned", "Three Point", "Ticks Slant", "Ticks", "Tiles", "Tinker-Toy",
            "Tombstone", "Train", "Trek", "Tsalagi", "Tubes-Regular", "Tubes-Smushed", "Tubular",
            "Twisted", "Two Point", "USA Flag", "Univers", "Varsity", "Wavy", "Weird",
            "Wet Letter", "Whimsy", "Wow"
        ];

        let currentFont = null;
        let fontCache = {};

        async function initializeFonts() {
            const select = document.getElementById('fontSelect');
            const status = document.getElementById('status');

            for (const font of allFonts) {
                const option = document.createElement('option');
                option.value = font;
                option.textContent = font;
                select.appendChild(option);
            }

            if (allFonts.length > 0) {
                select.value = allFonts[2];
                await loadFont(allFonts[2]);
                status.textContent = 'Ready';
            }

            select.addEventListener('change', (e) => {
                loadFont(e.target.value);
            });
        }

        async function loadFont(fontName) {
            const status = document.getElementById('status');
            
            if (fontCache[fontName]) {
                currentFont = fontCache[fontName];
                status.textContent = `Font: ${fontName}`;
                return;
            }

            try {
                status.textContent = `Loading ${fontName}...`;
                const response = await fetch(`ascii-fonts/${fontName}.flf`);
                
                if (!response.ok) {
                    throw new Error(`Font not found`);
                }

                const fontData = await response.text();
                currentFont = new FLFParser(fontData);
                fontCache[fontName] = currentFont;
                status.textContent = `Font: ${fontName}`;
            } catch (err) {
                status.textContent = `Error loading font`;
            }
        }

        function generateTextASCII() {
            if (!currentFont) {
                document.getElementById('output').textContent = 'Font is loading...';
                return;
            }

            const text = document.getElementById('textInput').value;
            const output = document.getElementById('output');

            if (!text.trim()) {
                output.textContent = 'Enter some text first!';
                return;
            }

            try {
                const result = currentFont.renderText(text);
                output.textContent = result || 'No output';
                window.lastOutput = result;
            } catch (err) {
                output.textContent = `Error: ${err.message}`;
            }
        }

        // ============ IMAGE TO ASCII ============

        let loadedImage = null;
        let lastAsciiData = null;

        function setupImageHandlers() {
            const imageFile = document.getElementById('imageFile');
            if (imageFile) {
                imageFile.addEventListener('change', (e) => {
                    const file = e.target.files?.[0];
                    if (file) loadFileImage(file);
                });
            }

            const dragDrop = document.getElementById('dragDrop');
            if (dragDrop) {
                ['dragenter', 'dragover'].forEach(ev => {
                    dragDrop.addEventListener(ev, (e) => {
                        e.preventDefault();
                        dragDrop.classList.add('dragover');
                    });
                });
                ['dragleave', 'drop'].forEach(ev => {
                    dragDrop.addEventListener(ev, (e) => {
                        e.preventDefault();
                        dragDrop.classList.remove('dragover');
                    });
                });
                dragDrop.addEventListener('drop', (e) => {
                    const file = e.dataTransfer.files[0];
                    if (file) loadFileImage(file);
                });
            }
        }

        async function loadFileImage(file) {
            if (file.type === 'image/svg+xml') {
                const text = await file.text();
                const svgUrl = URL.createObjectURL(new Blob([text], { type: 'image/svg+xml' }));
                loadImageFromSrc(svgUrl);
            } else {
                const url = URL.createObjectURL(file);
                loadImageFromSrc(url);
            }
        }

        function loadImageFromURL() {
            const url = document.getElementById('imageUrl').value.trim();
            if (!url) return;

            fetch(url).then(r => r.blob()).then(blob => {
                const obj = URL.createObjectURL(blob);
                loadImageFromSrc(obj);
            }).catch(() => loadImageFromSrc(url));
        }

        function loadImageFromSrc(src) {
            const img = new Image();
            img.crossOrigin = 'Anonymous';
            img.onload = () => {
                loadedImage = img;
                document.getElementById('status').textContent = 'Image loaded';
            };
            img.onerror = () => alert('Failed to load image');
            img.src = src;
        }

        function applyBC(v, brightness, contrast) {
            let val = v + (brightness / 100) * 255;
            const c = (contrast / 100);
            val = ((val - 128) * (1 + c)) + 128;
            return Math.max(0, Math.min(255, Math.round(val)));
        }

        function generateImageASCII() {
            if (!loadedImage) {
                document.getElementById('output').textContent = 'Please load an image first';
                return;
            }

            const canvas = document.getElementById('previewCanvas');
            const ctx = canvas.getContext('2d');
            const targetWidth = parseInt(document.getElementById('imageWidth').value);
            const scale = parseFloat(document.getElementById('imageScale').value);
            const aspect = loadedImage.height / loadedImage.width;
            const targetHeight = Math.max(1, Math.round(targetWidth * aspect * scale));
            
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            ctx.drawImage(loadedImage, 0, 0, canvas.width, canvas.height);
            
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

            const charset = document.getElementById('charset').value;
            const invert = document.getElementById('imageInvert').value === 'true';
            const useColor = document.getElementById('imageColor').value === 'true';
            const brightness = parseInt(document.getElementById('imageBrightness').value);
            const contrast = parseInt(document.getElementById('imageContrast').value);

            const lines = [];
            const charMatrix = [];

            for (let y = 0; y < canvas.height; y++) {
                let line = '';
                let lineColors = [];
                let rowChars = [];

                for (let x = 0; x < canvas.width; x++) {
                    const i = (y * canvas.width + x) * 4;
                    let r = imageData[i];
                    let g = imageData[i + 1];
                    let b = imageData[i + 2];

                    r = applyBC(r, brightness, contrast);
                    g = applyBC(g, brightness, contrast);
                    b = applyBC(b, brightness, contrast);

                    const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
                    const t = invert ? 255 - lum : lum;
                    const idx = Math.floor((t / 255) * (charset.length - 1));
                    const ch = charset[idx] || ' ';

                    line += ch;
                    rowChars.push(ch);
                    lineColors.push({ r, g, b });
                }

                lines.push(line);
                charMatrix.push(rowChars);
            }

            lastAsciiData = { lines, charMatrix, useColor, colors: lines.map((_, y) => 
                lines[0].split('').map((_, x) => {
                    const i = (y * canvas.width + x) * 4;
                    return {
                        r: imageData[i],
                        g: imageData[i + 1],
                        b: imageData[i + 2]
                    };
                })
            )};

            const output = document.getElementById('output');
            output.textContent = lines.join('\n');
            window.lastOutput = lines.join('\n');
        }

        // ============ EXPORT FUNCTIONS ============

        function copyToClipboard() {
            const text = document.getElementById('output').textContent;
            if (!text) return;
            navigator.clipboard.writeText(text).then(() => {
                document.getElementById('status').textContent = 'Copied!';
                setTimeout(() => { document.getElementById('status').textContent = 'Ready'; }, 2000);
            });
        }

        function downloadText() {
            const text = document.getElementById('output').textContent;
            if (!text) return;
            const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ascii-wallpaper.txt';
            link.click();
        }

        function downloadHTML() {
            const text = document.getElementById('output').textContent;
            const textColor = document.getElementById('textColor').value;
            const bgColor = document.getElementById('bgColor').value;

            if (!text) return;

            const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>ASCII Wallpaper</title>
    <style>
        body {
            background: ${bgColor};
            color: ${textColor};
            font-family: monospace;
            white-space: pre;
            margin: 0;
            padding: 10px;
            overflow: auto;
        }
    </style>
</head>
<body>${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}</body>
</html>`;

            const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = 'ascii-wallpaper.html';
            link.click();
        }

        function downloadPNG() {
            const text = document.getElementById('output').textContent;
            if (!text) return;

            const lines = text.split('\n');
            const fontSize = 8;
            const lineHeight = 9;

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            ctx.font = `${fontSize}px monospace`;
            
            const charWidth = Math.ceil(ctx.measureText('M').width);
            const cols = Math.max(...lines.map(l => l.length));
            const rows = lines.length;

            canvas.width = cols * charWidth;
            canvas.height = rows * lineHeight;

            const bgColor = document.getElementById('bgColor').value;
            ctx.fillStyle = bgColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            const textColor = document.getElementById('textColor').value;
            ctx.fillStyle = textColor;
            ctx.font = `${fontSize}px monospace`;
            ctx.textBaseline = 'top';

            lines.forEach((line, y) => {
                ctx.fillText(line, 0, y * lineHeight);
            });

            canvas.toBlob(blob => {
                const link = document.createElement('a');
                link.href = URL.createObjectURL(blob);
                link.download = 'ascii-wallpaper.png';
                link.click();
            });
        }

        // ============ TAB SWITCHING ============

        function switchTab(tab) {
            document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
            document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
            
            document.getElementById(tab + '-tab').classList.add('active');
            document.querySelector(`[data-tab="${tab}"]`).classList.add('active');
        }

        // ============ INITIALIZATION ============

        function initializeEventHandlers() {
            // Tab buttons
            document.querySelectorAll('.tab-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    switchTab(e.target.dataset.tab);
                });
            });

            // Text generation
            const btnGenerateText = document.getElementById('btnGenerateText');
            if (btnGenerateText) {
                btnGenerateText.addEventListener('click', () => {
                    if (currentFont) {
                        generateTextASCII();
                    } else {
                        alert('Loading font...');
                    }
                });
            }

            // Image generation
            const btnGenerateImage = document.getElementById('btnGenerateImage');
            if (btnGenerateImage) {
                btnGenerateImage.addEventListener('click', generateImageASCII);
            }

            // Image URL loader
            const btnLoadUrl = document.getElementById('btnLoadUrl');
            if (btnLoadUrl) {
                btnLoadUrl.addEventListener('click', loadImageFromURL);
            }

            // Export buttons
            const btnCopy = document.getElementById('btnCopy');
            if (btnCopy) btnCopy.addEventListener('click', copyToClipboard);

            const btnDownloadTxt = document.getElementById('btnDownloadTxt');
            if (btnDownloadTxt) btnDownloadTxt.addEventListener('click', downloadText);

            const btnDownloadHtml = document.getElementById('btnDownloadHtml');
            if (btnDownloadHtml) btnDownloadHtml.addEventListener('click', downloadHTML);

            const btnDownloadPng = document.getElementById('btnDownloadPng');
            if (btnDownloadPng) btnDownloadPng.addEventListener('click', downloadPNG);

            // Range displays
            const imageWidth = document.getElementById('imageWidth');
            const imageScale = document.getElementById('imageScale');
            const imageBrightness = document.getElementById('imageBrightness');
            const imageContrast = document.getElementById('imageContrast');

            if (imageWidth) imageWidth.addEventListener('input', (e) => {
                document.getElementById('imageWidthVal').textContent = e.target.value;
            });
            if (imageScale) imageScale.addEventListener('input', (e) => {
                document.getElementById('imageScaleVal').textContent = e.target.value;
            });
            if (imageBrightness) imageBrightness.addEventListener('input', (e) => {
                document.getElementById('imageBrightnessVal').textContent = e.target.value;
            });
            if (imageContrast) imageContrast.addEventListener('input', (e) => {
                document.getElementById('imageContrastVal').textContent = e.target.value;
            });

            // Text input
            const textInput = document.getElementById('textInput');
            if (textInput) {
                textInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') generateTextASCII();
                });
            }

            // Image handlers
            setupImageHandlers();
        }

        document.addEventListener('DOMContentLoaded', () => {
            initializeFonts();
            initializeEventHandlers();
        });
