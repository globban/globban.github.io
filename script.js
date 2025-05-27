var root = {
  wavecolor: {  
    r: 125,
    g: 52,
    b: 253
    },
    rainbowSpeed: 0.2,
    rainbow: true,
    matrixspeed: 50
};

// Reference settings menu inputs
const matrixColorInput = document.getElementById('matrixColor');
const rainbowEffectInput = document.getElementById('rainBow');
const rainbowSpeedInput = document.getElementById('rainbowSpeed');
const matrixSpeedInput = document.getElementById('matrixspeed');

// Update Matrix Color
matrixColorInput.addEventListener('input', (e) => {
  root.wavecolor = hexToRgb(e.target.value); // Convert HEX to RGB
});

// Toggle Rainbow Effect
rainbowEffectInput.addEventListener('change', (e) => {
  root.rainbow = e.target.checked;
});

// Adjust Rainbow Speed
rainbowSpeedInput.addEventListener('input', (e) => {
  root.rainbowSpeed = parseFloat(e.target.value);
});

// Adjust Matrix Speed
matrixSpeedInput.addEventListener('input', (e) => {
  root.matrixspeed = parseInt(e.target.value, 10);

  // Clear and restart the interval with the new speed
  clearInterval(intervalID);
  intervalID = setInterval(draw, root.matrixspeed);
});

// Start initial draw interval
let intervalID = setInterval(draw, root.matrixspeed);


var c = document.getElementById("c");
var ctx = c.getContext("2d");

var hueFw = false;
var hue = -0.01;

// making the canvas full screen
c.height = window.innerHeight;
c.width = window.innerWidth;

// the characters
var konkani  = "゠アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレワヰヱヲンヺ・ーヽヿ0123456789"
// converting the string into an array of single characters
var characters = konkani.split("");
var font_size = 25;
var columns = c.width/font_size;    // number of columns for the rain
var gradient = ctx.createLinearGradient(0,10, 0,200);
// an array of drops - one per column
var drops = [];
// x below is the x coordinate
// 1 = y-coordinate of the drop (same for every drop initially)
for (var x = 0; x < columns; x++)
    drops[x] = 1;

// drawing the characters
function draw() {
    // Get the BG color based on the current time i.e. rgb(hh, mm, ss)
    // translucent BG to show trail

    ctx.fillStyle = "rgba(0,0,0, 0.05)";
    ctx.fillRect(0, 0, c.width, c.height);

    ctx.fillStyle = "#BBB"; // grey text
    ctx.font = font_size + "px arial";

    // looping over drops
    for (var i = 0; i < drops.length; i++)
    {
        // background color
        ctx.fillStyle = "rgba(10,10,10, 1)";
        ctx.fillRect(i * font_size, drops[i] * font_size,font_size,font_size);
        // a random chinese character to print
        var text = characters[Math.floor(Math.random() * characters.length)];
        // x = i * font_size, y = value of drops[i] * font_size

        if (root.rainbow) {
          hue += (hueFw) ? 0.01 : -0.01;
          var rr = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 0) + 128);
          var rg = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 2) + 128);
          var rb = Math.floor(127 * Math.sin(root.rainbowSpeed * hue + 4) + 128);
          ctx.fillStyle = 'rgba(' + rr + ',' + rg + ',' + rb + ')';
        } else {
          ctx.fillStyle = 'rgba(' + root.wavecolor.r + ',' + root.wavecolor.g + ',' + root.wavecolor.b + ')';
        }

        ctx.fillText(text, i * font_size, drops[i] * font_size);
        // Incrementing Y coordinate
        drops[i]++;
        // sending the drop back to the top randomly after it has crossed the screen
        // adding randomness to the reset to make the drops scattered on the Y axis
       if (drops[i] * font_size > c.height && Math.random() > 0.975)
			      drops[i] = 0;
    }
}

setInterval(draw, root.matrixspeed);


function livelyPropertyListener(name, val)
{
  switch(name) {
    case "matrixColor":
      root.wavecolor =  hexToRgb(val);
      break;
    case "rainBow":
      root.rainbow = val;
      break;   
    case "rainbowSpeed":
      root.rainbowSpeed = val/100;
      break;     
  }
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function add_zero(digit)
            {
               if(digit < 10)
               {
                  digit = "0" + digit;
               }
               else
               {
                  digit = digit.toString();
               }
               
               return digit
            }
            
            function clock()
            {
               const now = new Date();
               
               let hours = now.getHours();
               let minutes = now.getMinutes();
               let seconds = now.getSeconds();
               
               document.getElementById("digits").innerHTML = add_zero(hours) + ":" + add_zero(minutes);
            }
            
            setInterval(clock, 1000);



// Customizable colors with default values
let customColors = {
  blockColor: "#007bff", // block fill and glow
  gridColor: "#a3b1c6",  // grid borders
  bgColor: "#e0e5ec"     // background
};

document.getElementById("blockColor").addEventListener("change", (e) => {
  customColors.blockColor = e.target.value;
  drawGrid();
  drawShapes();
});
document.getElementById("gridColor").addEventListener("change", (e) => {
  customColors.gridColor = e.target.value;
  drawGrid();
});
document.getElementById("bgColor").addEventListener("change", (e) => {
  customColors.bgColor = e.target.value;
  document.body.style.background = customColors.bgColor;
  drawGrid();
});

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const restartButton = document.getElementById("restartButton");
const scoreDisplay = document.getElementById("score");

const GRID_WIDTH = 9;
const GRID_HEIGHT = 7;
const CELL_SIZE = 50;
const SHAPE_COUNT = 3;

// Set canvas dimensions (responsive for mobile)
canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = (GRID_HEIGHT + 2) * CELL_SIZE; // Extra space for shapes below the grid

let score = 0;
let grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
let shapes = [];
let currentShape = null;
let offsetX, offsetY;

// Variables for flash effect when lines clear
let flashCells = [];
let flashAlpha = 1;
let flashing = false;

// Shape templates (1's represent filled cells)
const shapeTemplates = [
    [[1]],
    [[1, 1]],
    [[1], [1]],
    [[1, 1], [1, 0]],
    [[1, 1], [0, 1]],
    [[1, 1], [1, 1]],
    [[1, 1, 1]],
    [[1], [1], [1]],
    [[1, 1, 0], [0, 1, 1]]
];

// Generate shapes to choose from
function generateShapes() {
    shapes = [];
    for (let i = 0; i < SHAPE_COUNT; i++) {
        let pattern = shapeTemplates[Math.floor(Math.random() * shapeTemplates.length)];
        shapes.push({
            pattern,
            x: i * 150 + 50, // Horizontal positioning at bottom
            y: GRID_HEIGHT * CELL_SIZE + 20, // Position shapes below the grid
            width: pattern[0].length * CELL_SIZE,
            height: pattern.length * CELL_SIZE
        });
    }
}

// Draw the game grid and placed blocks
function drawGrid() {
    // Fill background with custom bg color
    ctx.fillStyle = customColors.bgColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw grid cells and their borders
    for (let row = 0; row < GRID_HEIGHT; row++) {
        for (let col = 0; col < GRID_WIDTH; col++) {
            const x = col * CELL_SIZE;
            const y = row * CELL_SIZE;
            ctx.strokeStyle = customColors.gridColor;
            ctx.lineWidth = 1;
            ctx.strokeRect(x, y, CELL_SIZE, CELL_SIZE);
            
            // Draw filled block with glow effect
            if (grid[row][col] === 1) {
                ctx.save();
                ctx.shadowColor = customColors.blockColor;
                ctx.shadowBlur = 10;
                ctx.fillStyle = customColors.blockColor;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
                ctx.restore();
            }
            
            // Draw flash overlay if needed
            if (flashCells.some(cell => cell.row === row && cell.col === col)) {
                ctx.fillStyle = `rgba(255,255,255,${flashAlpha})`;
                ctx.fillRect(x, y, CELL_SIZE, CELL_SIZE);
            }
        }
    }
}

// Draw the draggable shapes available to place
function drawShapes() {
    shapes.forEach(shape => {
        ctx.save();
        ctx.shadowColor = customColors.blockColor;
        ctx.shadowBlur = 8;
        shape.pattern.forEach((row, rIdx) => {
            row.forEach((cell, cIdx) => {
                if (cell) {
                    ctx.fillStyle = customColors.blockColor;
                    ctx.fillRect(shape.x + cIdx * CELL_SIZE, shape.y + rIdx * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                }
            });
        });
        ctx.restore();
    });
}

// Animate flash effect for cleared cells
function animateFlash() {
    if (!flashing) return;
    flashAlpha -= 0.05;
    if (flashAlpha <= 0) {
        flashAlpha = 1;
        flashCells = [];
        flashing = false;
        drawGrid();
        drawShapes();
        return;
    }
    drawGrid();
    drawShapes();
    requestAnimationFrame(animateFlash);
}

// Convert page coordinates to canvas coordinates
function getCanvasCoords(e) {
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (e.touches) {
        x = e.touches[0].clientX - rect.left;
        y = e.touches[0].clientY - rect.top;
    } else {
        x = e.offsetX;
        y = e.offsetY;
    }
    return { x, y };
}

// Handle drag start for both mouse and touch
function startDrag(e) {
    e.preventDefault();
    const { x: mouseX, y: mouseY } = getCanvasCoords(e);
    for (let shape of shapes) {
        if (mouseX >= shape.x && mouseX <= shape.x + shape.width &&
            mouseY >= shape.y && mouseY <= shape.y + shape.height) {
            currentShape = shape;
            offsetX = mouseX - shape.x;
            offsetY = mouseY - shape.y;
            return;
        }
    }
}

// Handle drag move for both mouse and touch
function moveDrag(e) {
    if (!currentShape) return;
    e.preventDefault();
    const { x: mouseX, y: mouseY } = getCanvasCoords(e);
    currentShape.x = mouseX - offsetX;
    currentShape.y = mouseY - offsetY;
    drawGrid();
    drawShapes();
}

// Handle drag end for both mouse and touch
function endDrag(e) {
    if (!currentShape) return;
    let snappedX = Math.round(currentShape.x / CELL_SIZE) * CELL_SIZE;
    let snappedY = Math.round(currentShape.y / CELL_SIZE) * CELL_SIZE;

    let gridX = snappedX / CELL_SIZE;
    let gridY = snappedY / CELL_SIZE;

    // Check if shape fits within grid bounds
    if (
        gridX < 0 ||
        gridX + currentShape.pattern[0].length > GRID_WIDTH ||
        gridY < 0 ||
        gridY + currentShape.pattern.length > GRID_HEIGHT
    ) {
        currentShape = null;
        drawGrid();
        drawShapes();
        return;
    }

    // Check for collision with already placed blocks
    let collision = false;
    for (let r = 0; r < currentShape.pattern.length; r++) {
        for (let c = 0; c < currentShape.pattern[0].length; c++) {
            if (currentShape.pattern[r][c] === 1) {
                if (grid[gridY + r][gridX + c] === 1) {
                    collision = true;
                    break;
                }
            }
        }
        if (collision) break;
    }
    if (collision) {
        // On collision, trigger a shake effect
        canvas.classList.add("shake");
        setTimeout(() => canvas.classList.remove("shake"), 300);
        currentShape = null;
        drawGrid();
        drawShapes();
        return;
    }

    // Place the shape onto the grid and mark cells for flash effect
    for (let r = 0; r < currentShape.pattern.length; r++) {
        for (let c = 0; c < currentShape.pattern[0].length; c++) {
            if (currentShape.pattern[r][c] === 1) {
                grid[gridY + r][gridX + c] = 1;
                flashCells.push({ row: gridY + r, col: gridX + c });
            }
        }
    }

    shapes = shapes.filter(shape => shape !== currentShape);
    currentShape = null;

    clearLines();
    if (shapes.length === 0) generateShapes();

    if (flashCells.length > 0) {
        flashing = true;
        flashAlpha = 1;
        requestAnimationFrame(animateFlash);
    } else {
        drawGrid();
        drawShapes();
    }
}

// Check and clear complete rows and columns, update score accordingly
function clearLines() {
    let cleared = 0;
    let cellsToFlash = [];

    // Clear full rows
    for (let row = 0; row < GRID_HEIGHT; row++) {
        if (grid[row].every(cell => cell === 1)) {
            for (let col = 0; col < GRID_WIDTH; col++) {
                cellsToFlash.push({ row, col });
            }
            grid[row] = Array(GRID_WIDTH).fill(0);
            cleared++;
        }
    }

    // Clear full columns
    for (let col = 0; col < GRID_WIDTH; col++) {
        if (grid.every(row => row[col] === 1)) {
            for (let row = 0; row < GRID_HEIGHT; row++) {
                cellsToFlash.push({ row, col });
                grid[row][col] = 0;
            }
            cleared++;
        }
    }

    if (cleared > 0) {
        score += cleared * 10;
        scoreDisplay.textContent = `Score: ${score}`;
        flashCells = flashCells.concat(cellsToFlash);
        flashing = true;
        flashAlpha = 1;
        requestAnimationFrame(animateFlash);
    }
}

// Restart the game
restartButton.addEventListener("click", () => {
    grid = Array.from({ length: GRID_HEIGHT }, () => Array(GRID_WIDTH).fill(0));
    score = 0;
    scoreDisplay.textContent = "Score: 0";
    generateShapes();
    drawGrid();
    drawShapes();
});

// Set up event listeners for both mouse and touch interactions
canvas.addEventListener("mousedown", startDrag);
canvas.addEventListener("mousemove", moveDrag);
canvas.addEventListener("mouseup", endDrag);
canvas.addEventListener("touchstart", startDrag);
canvas.addEventListener("touchmove", moveDrag);
canvas.addEventListener("touchend", endDrag);

// Add shake effect CSS via JavaScript
const style = document.createElement('style');
style.textContent = `
@keyframes shake {
  0% { transform: translate(0px, 0px); }
  25% { transform: translate(5px, 0px); }
  50% { transform: translate(-5px, 0px); }
  75% { transform: translate(5px, 0px); }
  100% { transform: translate(0px, 0px); }
}
.shake {
  animation: shake 0.3s;
}
`;
document.head.appendChild(style);

// Initialize and draw game
generateShapes();
drawGrid();
drawShapes();


