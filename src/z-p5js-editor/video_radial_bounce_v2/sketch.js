// https://editor.p5js.org/jht9629-nyu/sketches/pouiEda3o
// video radial bounce v2

let my = {};

function setup() {

  createCanvas(windowWidth, windowHeight);
  
  my_setup();
  my_resize();

  my.capture = createCapture(VIDEO);
  my.capture.size(width, height);
  my.capture.hide();
}

function draw() {
  strokeWeight(my.strokeWeight);
  my.img = my.capture.get();
  let more = 1;
  while (more) {
    more = draw_out();
    if (!my.faster) more = 0;
  }
}

function my_setup() {
  my.faster = 1;

  my.strokeWeight = 10;
  my.rim = 20;
  my.angle = 0;
  my.angleStep = 1;

  my.xstep = 1;
  my.xstepDir = 1;
  my.xstepDownFactor = 4;
  my.xposStart = 0;
  my.xpos = my.xposStart;

  // my.secsPerUpdate = 0.1;
  // my.secsPerUpdate = 0.01;
  my.secsPerUpdate = 0.00;
  my.secsDelta = 0;

  // my.x0;
  // my.y0;
  // my.capture;
  // my.img;
}

function my_resize() {
  // my.width = windowWidth;
  // my.height = windowHeight;
  my.x0 = Math.floor(width / 2);
  my.y0 = Math.floor(height / 2);
  my.xposEnd = Math.max(width,height) ;
}

function draw_out() {
  // colorMode(HSB);

  let r = my.xpos / 2;
  let rang = radians(my.angle);
  let x1 = r * cos(rang);
  let y1 = r * sin(rang);

  let x = my.x0 + x1
  let y =  my.y0 + y1
  let c1 = my.img.get(x, y);
  stroke(c1);
  fill(c1);
  circle(x, y, my.rim);

  let r2 = width;
  let x2 = r2 * cos(rang);
  let y2 = r2 * sin(rang);
  line(x, y, my.x0 + x2, my.y0 + y2);

  my.angle = my.angle + my.angleStep;
  if (my.angle > 360) {
    my.angle = 0;
    next_step();
    return 0;
  }
  return 1;
}

function next_step() {
  my.secsDelta += deltaTime / 1000;
  if (my.secsDelta < my.secsPerUpdate) {
    return;
  }
  my.secsDelta = 0;
  my.xpos += my.xstep;
  if (my.xstep > 0 && my.xpos > my.xposEnd) {
    my.xstepDir *= -1;
    my.xstep = my.xstepDir * my.xstepDownFactor;
    my.xpos += my.xstep;
  } else if (my.xstep < 0 && my.xpos < my.xposStart) {
    my.xstepDir *= -1;
    my.xstep = my.xstepDir;
    my.xpos += my.xstep;
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  my_resize();
}

// https://editor.p5js.org/jht9629-nyu/sketches/OReZ4wOR5
// video scan radial v5

// https://editor.p5js.org/jht9629-nyu/sketches/7vllrM5d5
// video scan radial v4

// https://editor.p5js.org/jht9629-nyu/sketches/WdNVtxQzf
// video scan radial v3

// https://editor.p5js.org/jht9629-nyu/sketches/cKzXO8eUG
// video scan radial v2

// https://editor.p5js.org/jht1900/sketches/-Ypn6ODK_
// video scan radial

// https://editor.p5js.org/jht1493/sketches/mEXETIijv
// video scan gap center

// https://editor.p5js.org/jht1493/sketches/oHVI5tU4BP
// video scan gap

// https://editor.p5js.org/jht1493/sketches/Q9jdcICpW
// video scan mouseY

// https://editor.p5js.org/jht1493/sketches/gnx2IQn1N
// video scan

// https://github.com/processing/p5.js/wiki/Beyond-the-canvas#capture-live-video

// https://editor.p5js.org/jht9629-nyu/sketches/nkw-sZXwN
// video scan radial v6

// https://editor.p5js.org/jht9629-nyu/sketches/hmPJyOAk1
// video scan radial bounce
