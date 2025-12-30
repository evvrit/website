let coins = [];
let coinImg;
const gravity = 0.5;
const bounce = 0.7;
let jarX = 100;
let jarY = 100;
let jarWidth = 100;
let jarHeight = 200;
let bottomJarY = jarY + jarHeight;

function preload() {
  coinImg = loadImage('/assets/penny.png');
}

function setup() {
  createCanvas(800, 600);
  jarX = width / 3;
  jarY = 100;
  jarWidth = width / 3;
  jarHeight = height / 2;
  bottomJarY = jarY + jarHeight;
}

function draw() {
  background(135, 206, 235); // Sky blue background

  rect(jarX, jarY, jarWidth, jarHeight);

  // Update and draw all coins
  for (let i = coins.length - 1; i >= 0; i--) {
    let coin = coins[i];

    // Apply gravity
    coin.velocity.y += gravity;

    // Update position
    coin.x += coin.velocity.x;
    coin.y += coin.velocity.y;

    // Check collision with bottom
    if (coin.y + coin.radius > bottomJarY) {
      coin.isSinking = true
//       coin.y = bottomJarY - coin.radius;
//       coin.velocity.y *= -bounce;

//       // Stop very small bounces
//       if (abs(coin.velocity.y) < 2) {
//         coin.velocity.y = 0;
//       }
    }

    // Check collision with sides
    if (coin.x - coin.radius < 0 || coin.x + coin.radius > width) {
      coin.velocity.x *= -0.8;
      coin.x = constrain(coin.x, coin.radius, width - coin.radius);
    }

    // Apply friction when past the bottom
    if (coin.y >= bottomJarY - coin.radius - 1) {
      coin.velocity.y = 0.25;
      coin.velocity.x = map(noise(frameCount / 20), 0, 1, -1, 1)
    }

    // Draw coin
    drawCoin(coin.x, coin.y, coin.radius);
  }

  // Instructions
  fill(255);
  textAlign(CENTER);
  textSize(18);
  text("Click anywhere to drop a coin!", width / 2, 30);
}

// function mouseClicked(x, y, radius) {
//   push();
//   translate(x, y);

//   image(coinImage, 0, 0, radius * 2, radius * 2);
//   if (coinImg) {
//     // imageMode(CENTER);
//   } else {
//       // Outer rim
//       fill(255, 215, 0); // Gold
//       stroke(218, 165, 32); // Dark gold
//       strokeWeight(3);
//       ellipse(0, 0, radius * 2, radius * 2);

//       // Inner circle
//       fill(255, 223, 0); // Lighter gold
//       stroke(255, 215, 0);
//       strokeWeight(1);
//       ellipse(0, 0, radius * 1.5, radius * 1.5);

//       // Center design
//       fill(218, 165, 32);
//       noStroke();
//       ellipse(0, 0, radius * 0.8, radius * 0.8);

//       // Dollar sign
//       fill(255, 215, 0);
//       textAlign(CENTER, CENTER);
//       textSize(radius * 0.8);
//       text("$", 0, 0);

//       pop();
//   }
// }

function mouseClicked() {
  // Create new coin at mouse position
  let newCoin = {
    x: mouseX,
    y: mouseY,
    velocity: {
      x: random(-3, 3),
      y: random(-2, 1),
    },
    radius: random(15, 25),
    rotation: 0,
    isSinking: false
  };

  coins.push(newCoin);
}

// Optional: Clear coins with spacebar
function keyPressed() {
  if (key === " ") {
    coins = [];
  }
}
