const TOTAL_GAMES = 49; //must be perfect square
let verboseTimer = 3 //seconds
let AI = true;


let prev = [[], []];
let allSnakes = [];
let paused = false;
let loops = 0;
let mostFit;
let slider;

function setup() {
    slider = createSlider(1, 200, 1);
    frameRate(AI ? 20 : 5);
    createCanvas(640, 640); // width and height must be evenly devisible by snakeWidth
    initGames(TOTAL_GAMES);
    if (AI) {
        setInterval(getReport, verboseTimer * 1000);
    }

}

function draw() {
    if (AI) {
        for (let i = 0; i < slider.value(); i++) {
            allSnakes.forEach(g => {
                g.draw();
            });
            loops++;
        }
    } else {
        allSnakes[0].draw();
    }
}

function getReport() {
    if (!paused) {
        let avgFit = Math.floor(prev[0].reduce((a, b) => a + b, 0) / prev[0].length);
        let avgGen = Math.floor(prev[1].reduce((a, b) => a + b, 0) / prev[1].length);
        let mostFit = Math.max.apply(null, prev[0]);
        console.log('Cycles per second: ' + Math.floor(loops / verboseTimer));
        console.log('Average fit: ' + avgFit);
        console.log('Average gen: ' + avgGen);
        console.log('Most fit: ' + mostFit);
        console.log('');

        prev = [[], []];
        loops = 0
    }
}

function keyPressed() {
    //console.log(keyCode)
    if (keyCode == 27) { // esc stops the game
        paused ? loop() : noLoop()
        paused = !paused;
    }
    if (!AI) {
        if (keyCode == 87) { // w for up
            allSnakes.forEach(s => { s.setDir(0) });
        }
        if (keyCode == 83) { // s for down
            allSnakes.forEach(s => { s.setDir(1) });
        }
        if (keyCode == 65) { // a for left
            allSnakes.forEach(s => { s.setDir(3) });
        }
        if (keyCode == 68) { // d for right
            allSnakes.forEach(s => { s.setDir(2) });
        }
    }
}



function initGames(num) {
    if (!AI) {
        num = 1;
    }

    if (width / snakeWidth % 2 != 0 || height / snakeWidth % 2 != 0) {
        console.error('Width and height must be evenly devisible by snakeWidth');
        return;
    }
    let len = Math.sqrt(num);
    if (((len - Math.floor(len)) != 0)) { // checks for perfect square
        console.error('TOTAL_GAMES must be a perfect square! ' + TOTAL_GAMES + ' is not a perfect square!');
        return;
    }


    let scale = 1 / len;
    for (let row = 0; row < len; row++) {
        for (let col = 0; col < len; col++) {
            allSnakes.push(new Snake(width / len * row, height / len * col, scale));
        }
    }
}
