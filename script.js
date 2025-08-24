const app = new PIXI.Application();
await app.init({
  backgroundColor: "#3398b9",
  width: 800,
  height: 500,
});

/* -------------------------------------------------------------------------- */
/*                             Add PIXIJS to div                             */
/* -------------------------------------------------------------------------- */
const pongTable = document.getElementById("the-pong-table");
pongTable.appendChild(app.canvas);

/* -------------------------------------------------------------------------- */
/*                            Add bg & text to the page                       */
/* -------------------------------------------------------------------------- */
// bg image by https://pixabay.com/users/prawny-162579/
const bgTexture = await PIXI.Assets.load("./background.jpg");
// add tiling affect
const tiling = new PIXI.TilingSprite({
  texture: bgTexture,
  width: 800,
  height: 800,
});
app.stage.addChild(tiling);
// add a filter to reduce brightness
const brightnessFilter = new PIXI.ColorMatrixFilter();
brightnessFilter.brightness(0.5);
tiling.filters = [brightnessFilter];
// add movement to the tiling to move left
app.ticker.add(() => {
  tiling.tilePosition.x -= 1;
});
// create styling for text
const style = new PIXI.TextStyle({
  fill: "rgba(73, 65, 57, 0.5)",
  fontSize: 72,
  fontFamily: "Inter",
});
// create text
const text = new PIXI.Text({ text: "PIXI Pong!", style });
// set anchor to the middle of the text
text.anchor.set(0.5);
// place the text in the middle of the canvas
text.position.set(app.renderer.width / 2, app.renderer.height / 2);
app.stage.addChild(text);

/* -------------------------------------------------------------------------- */
/*                           create rectangle edges                           */
/* -------------------------------------------------------------------------- */
// delcare helper variable for the rectangles
const THICKNESS = 10;
const WIDTH = app.renderer.width;
const HEIGHT = app.renderer.height;

// left
const left = new PIXI.Graphics()
  .rect(0, 0, THICKNESS, HEIGHT)
  .fill({ color: 0xffffff });

// top
const top = new PIXI.Graphics()
  .rect(0, 0, WIDTH, THICKNESS)
  .fill({ color: 0xffffff });

// right - use the thickness variable to dynamically say its position
const right = new PIXI.Graphics()
  .rect(WIDTH - THICKNESS, 0, THICKNESS, HEIGHT)
  .fill({ color: 0xffffff });

// bottom - use the thickness variable to dynamically say its position
const bottom = new PIXI.Graphics()
  .rect(0, HEIGHT - THICKNESS, WIDTH, THICKNESS)
  .fill({ color: 0xffffff });
// add to stage
app.stage.addChild(left, top, right, bottom);

/* -------------------------------------------------------------------------- */
/*                 create circle with the .circle chain method                */
/* -------------------------------------------------------------------------- */
const circle = new PIXI.Graphics().circle(10, 10, 10).fill({ color: 0xf5ef42 });

// set circle's random position
circle.position.set(
  Math.floor(Math.random() * 700),
  Math.floor(Math.random() * 400)
);

// circle's velocity
let xv = 5;
let yv = 5;

// add circle to stage
app.stage.addChild(circle);

/* -------------------------------------------------------------------------- */
/*                     HERE'S WHERE THE REAL FUN BEGINS 🎉                    */
/* -------------------------------------------------------------------------- */
// create variables to hold bounce boolean
let leftBounce = false;
let topBounce = false;
let rightBounce = false;
let bottomBounce = false;
// grab tags from html
const img = document.querySelector("img");
const btn = document.getElementById("start");
const msg = document.getElementById("game-over-text");

// ticker for movement and adding functions
const ticker = new PIXI.Ticker();
ticker.add(() => {
  if (circle.x >= 800 || circle.x <= 0) {
    xv = -xv;
    onBounce();
    checkBounce();
  }
  if (circle.y >= 500 || circle.y <= 0) {
    yv = -yv;
    onBounce();
    checkBounce();
  }
  circle.x += xv;
  circle.y += yv;
});

// Add eventlistner and functionality to play button
btn.addEventListener("click", () => {
  msg.style.display = "none";
  btn.style.display = "none";
  ticker.start();
  img.style.display = "none";
  pongTable.style.display = "block";
});

// function to redraw rectangles upon hit
function redraw(side, x, y, width, height, color) {
  side.clear().rect(x, y, width, height).fill({ color });
}

// function bounce = true, call redraw function
function onBounce() {
  if (circle.x <= 0) {
    leftBounce = true;
    redraw(left, 0, 0, THICKNESS, HEIGHT, 0xff0000);
  }
  if (circle.y <= 0) {
    topBounce = true;
    redraw(top, 0, 0, WIDTH, THICKNESS, 0xff0000);
  }
  if (circle.x >= WIDTH) {
    rightBounce = true;
    redraw(right, WIDTH - THICKNESS, 0, THICKNESS, HEIGHT, 0xff0000);
  }
  if (circle.y >= HEIGHT) {
    bottomBounce = true;
    redraw(bottom, 0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0xff0000);
  }
}

// function to reset the borders to white
function reset() {
  left.clear().rect(0, 0, THICKNESS, HEIGHT).fill(0xffffff);
  top.clear().rect(0, 0, WIDTH, THICKNESS).fill(0xffffff);
  right
    .clear()
    .rect(WIDTH - THICKNESS, 0, THICKNESS, HEIGHT)
    .fill(0xffffff);
  bottom
    .clear()
    .rect(0, HEIGHT - THICKNESS, WIDTH, THICKNESS)
    .fill(0xffffff);
}

// Promise to end the game
const checkBounce = () => {
  return new Promise((resolve, reject) => {
    if (leftBounce && topBounce && rightBounce && bottomBounce) {
      resolve(
        (msg.style.display = "block"),
        (pongTable.style.display = "none"),
        (img.style.display = "block"),
        (btn.style.display = "block"),
        (leftBounce = topBounce = rightBounce = bottomBounce = false),
        ticker.stop(),
        reset()
      );
    }
  });
};
