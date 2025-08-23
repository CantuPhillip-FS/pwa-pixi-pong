const app = new PIXI.Application();
await app.init({
  backgroundColor: "#3398b9",
  width: 800,
  height: 500,
});

/* -------------------------------------------------------------------------- */
/*                             Add PIXIJS to body                             */
/* -------------------------------------------------------------------------- */
document.getElementById("the-pong-table").appendChild(app.canvas);

/* -------------------------------------------------------------------------- */
/*                            Add text to the page                            */
/* -------------------------------------------------------------------------- */
const style = new PIXI.TextStyle({
  fill: "rgba(49, 44, 39, 0.3)",
  fontSize: 72,
  fontFamily: "Inter",
});
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

app.stage.addChild(left, top, right, bottom);

/* -------------------------------------------------------------------------- */
/*                 create circle with the .circle chain method                */
/* -------------------------------------------------------------------------- */
const circle = new PIXI.Graphics().circle(5, 5, 5).fill({ color: 0xf5ef42 });

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

// ticker for movement and adding functions
app.ticker.add(() => {
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

// function to redraw recctangles
function redraw(side, x, y, width, height, color) {
  side.clear().rect(x, y, width, height).fill({ color });
}

// change bounce = true & change border color
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

// Promise to end the game & reset border colors
const checkBounce = () => {
  return new Promise((resolve, reject) => {
    if (leftBounce && topBounce && rightBounce && bottomBounce) {
      resolve(
        alert("The ball has bounced off all four edges. Game over!"),
        (leftBounce = topBounce = rightBounce = bottomBounce = false),
        redraw(left, 0, 0, THICKNESS, HEIGHT, 0xffffff),
        redraw(top, 0, 0, WIDTH, THICKNESS, 0xffffff),
        redraw(right, WIDTH - THICKNESS, 0, THICKNESS, HEIGHT, 0xffffff),
        redraw(bottom, 0, HEIGHT - THICKNESS, WIDTH, THICKNESS, 0xffffff)
      );
    }
  });
};
