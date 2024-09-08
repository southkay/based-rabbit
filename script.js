function setup() {
    createCanvas(800, 600); // Sử dụng kích thước cố định của canvas
    startGame();
}

function windowResized() {
    // Không thay đổi kích thước canvas khi cửa sổ thay đổi kích thước
}

let rabbit;
let obstacles = [];
let score = 0;
let gameOver = false;

function startGame() {
    rabbit = new Rabbit();
    obstacles = [new Obstacle()];
    score = 0;
    gameOver = false;
    loop(); // Bắt đầu vòng lặp trò chơi
}

function draw() {
    background(240);

    if (gameOver) {
        fill(0);
        textSize(32);
        textAlign(CENTER, CENTER);
        text('Game Over', width / 2, height / 2);
        textSize(24);
        text(`Score: ${score}`, width / 2, height / 2 + 40);
        textSize(20);
        text('Press Shift + R to Restart', width / 2, height / 2 + 80);
        return;
    }

    // Hiển thị hướng dẫn khi trò chơi đang diễn ra
    if (frameCount < 60) { // Hiển thị hướng dẫn trong 1 giây đầu tiên của trò chơi
        fill(0);
        textSize(24);
        textAlign(CENTER, CENTER);
        text('Press Space to Jump', width / 2, height / 2 - 50);
        text('Press Shift + R to Restart', width / 2, height / 2);
    }

    // Cập nhật và vẽ chướng ngại vật
    for (let i = obstacles.length - 1; i >= 0; i--) {
        obstacles[i].update();
        obstacles[i].display();
        if (obstacles[i].offscreen()) {
            obstacles.splice(i, 1);
            score++;
            obstacles.push(new Obstacle());
        }
    }

    // Cập nhật và vẽ thỏ
    rabbit.update();
    rabbit.display();

    // Kiểm tra va chạm
    for (let obstacle of obstacles) {
        if (rabbit.hits(obstacle)) {
            gameOver = true; // Đặt cờ gameOver
            noLoop(); // Dừng vòng lặp trò chơi
            break; // Dừng vòng lặp kiểm tra va chạm
        }
    }

    // Hiển thị điểm số
    fill(0);
    textSize(24);
    text(`Score: ${score}`, width - 100, 30);
}

function keyPressed() {
    if (key === ' ') {
        rabbit.jump();
    }
    if (keyIsDown(SHIFT) && key === 'R' && gameOver) {
        startGame(); // Khởi động lại trò chơi
    }
}

class Rabbit {
    constructor() {
        this.x = 50;
        this.y = height - 60;
        this.size = 40;
        this.ySpeed = 0;
        this.gravity = 0.6;
        this.lift = -15;
    }

    update() {
        this.y += this.ySpeed;
        this.ySpeed += this.gravity;
        if (this.y > height - 60) {
            this.y = height - 60;
            this.ySpeed = 0;
        }
    }

    jump() {
        if (this.y === height - 60) {
            this.ySpeed = this.lift;
        }
    }

    display() {
        fill(255, 0, 0);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }

    hits(obstacle) {
        let d = dist(this.x, this.y, obstacle.x, obstacle.y);
        return d < this.size / 2 + obstacle.size / 2;
    }
}

class Obstacle {
    constructor() {
        this.x = width;
        this.y = height - 60;
        this.size = 50;
        this.speed = 5;
    }

    update() {
        this.x -= this.speed;
    }

    display() {
        fill(0);
        noStroke();
        rect(this.x, this.y, this.size, this.size);
    }

    offscreen() {
        return this.x < -this.size;
    }
}
