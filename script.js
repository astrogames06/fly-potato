let x = 40;
let y = 400 / 2;

let player;
let dead = false;
let pressedKeys = {};

let jumped = false;

let vel = 0;
let ac = 0.1;

let MIN = 100;
let MAX = 160;

let topPipes = [random(MIN, MAX), random(MIN, MAX), random(MIN, MAX), random(MIN, MAX)];
let topPipesX = [];
let topPipesMove = [];

let bottomPipes = [random(MIN, MAX), random(MIN, MAX), random(MIN, MAX), random(MIN, MAX)];
let bottomPipesX = [];
let bottomPipesMove = [];

let img;

let points = 0;
let passed = false;

let best = localStorage.getItem("best");

function checkCollisions(a_x, a_y, a_width, a_height, b_x, b_y, b_width, b_height) {
    return (a_x + a_width > b_x) && (a_x < b_x + b_width) && (a_y + a_height > b_y) && (a_y < b_y + b_height);
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function preload() {
    img = loadImage('potato.png');
}

function setup() {
    createCanvas(400, 400);
    player = new Player(40, height / 2);
    img.resize(30, 48.87);

    for (let i = 0; i < 4; i++) {
        topPipesMove.push(400 + i * 100);
        bottomPipesMove.push(400 + i * 100);
    }
}

function draw() {
    background(220);
    fill(0, 255, 0)

    for (let i = 0; i < topPipes.length; i++) {
        topPipesX[i] = topPipesMove[i] + i;
        rect(topPipesX[i], 0, 50, topPipes[i]);

        if (topPipesMove[i] < player.x && passed === false && dead === false) {
            points += 1;
            passed = true;
        }

        if (topPipesMove[i] < -50) {
            topPipesMove[i] = 400;
            topPipes[i] = random(MIN, MAX);
        }
        topPipesMove[i] -= !dead;

        if (checkCollisions(player.x, player.y, 30, 48.87, topPipesX[i], 0, 50, topPipes[i])) {
            dead = true;
        }
    }
    for (let i = 0; i < 4; i++) {
        bottomPipesX[i] = bottomPipesMove[i] + i;
        rect(bottomPipesX[i], 400 - bottomPipes[i], 50, bottomPipes[i]);

        if (bottomPipesMove[i] < -50) {
            bottomPipesMove[i] = 400;
            bottomPipes[i] = random(MIN, MAX);
            passed = false;
        }
        bottomPipesMove[i] -= !dead;

        if (checkCollisions(player.x, player.y, 30, 48.87, bottomPipesX[i], 400 - bottomPipes[i], 50, bottomPipes[i])) {
            dead = true;
            if (points > localStorage.getItem("best")) {
                localStorage.setItem("best", points);
            }
        }
    }
    player.update();
    player.draw();

    fill(0, 0, 0)
    textSize(40);
    text(points, 400 / 2, 100);
    console.log(localStorage.getItem("best"))

    if (player.y > 400 - 30 || player.y < 0) {
        dead = true;
    }

    if (dead === true) {
        fill(255, 255, 255, 200)
        rect(-10, -10, 500, 500);
        fill(0, 0, 0)
        text("YOU LOSE!", 100, 200);
        text(`BEST: ${localStorage.getItem("best")}`, 140, 300)

        fill(0, 255, 255)
        rect(135, 350, 180, 35);
        fill(0, 0, 0)
        textSize(20);
        text("E TO PLAY AGAIN", 140, 375)
        
    }
}

function keyPressed() {
    pressedKeys[key] = true;
}

function keyReleased() {
    delete pressedKeys[key];
}

class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;

        this.speed = 4;
    }

    update() {
        let mvmt = createVector(0, 0);

        if (pressedKeys.w && dead === false) {
            if (jumped === false) {
                vel = 0;
                vel -= 3;
                jumped = true;
            }
        }

        if (!pressedKeys.w) {
            jumped = false;
        }

        mvmt.setMag(this.speed);

        vel += ac;
        this.y += vel;
    }
    draw() {
        fill(255, 0, 0);
        image(img, this.x, this.y);
    }
}

function keyPressed() {
    if (key === ' ' && dead === false) {
        if (jumped === false) {
            vel = 0;
            vel -= 3;
            jumped = true;
        }
    }

    if (key === 'e' && dead === true)
    {
        dead = false;
        location.reload();
    }
}
