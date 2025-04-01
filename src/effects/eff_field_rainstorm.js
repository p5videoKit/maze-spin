//
export default class eff_field_rainstorm {
  static meta_props = [{ prop: 'npoints', selection: [9000, 3000, 2500] }];

  constructor(props) {
    Object.assign(this, props);
    console.log('eff_field_rainstorm props', props);
    this.init();
  }

  prepareOutput() {
    console.log('eff_field_rainstorm prepareOutput');
    this.render(this.output);
  }

  init() {
    this.organic = true; // randomly moves points around
    this.points = [];
    // this.delaunay;
    // this.voronoi;
    // this.video;
    let npoints = this.npoints || 9000;
    this.npoints = npoints;
    // this.layer;
    this.centroids = new Array(npoints);
    this.weights = new Array(npoints);
    this.weightsR = new Array(npoints);
    this.weightsG = new Array(npoints);
    this.weightsB = new Array(npoints);
    this.counts = new Array(npoints);
    this.avgWeights = new Array(npoints);

    let w = this.input.width;
    let h = this.input.height;
    this.output = createGraphics(w, h);

    // much faster to get video pixels as image
    let img = this.input.get();
    let points = this.points;
    for (let i = 0; i < npoints; i++) {
      let x = random(w);
      let y = random(h);
      let col = img.get(x, y);
      if (random(100) > brightness(col)) {
        points.push(createVector(x, y));
        // points.push({ x, y });
      } else {
        i--;
      }
    }
    this.delaunay = this.calculateDelaunay(points);
    this.voronoi = this.delaunay.voronoi([0, 0, w, h]);
  }

  render(layer) {
    if (!layer) return;
    // background(255);
    let video = this.input;
    let w = layer.width;
    let h = layer.height;

    let voronoi = this.voronoi;
    let polygons = voronoi.cellPolygons();
    let cells = Array.from(polygons);

    // console.log('cells.length', cells.length);
    let centroids = this.centroids;
    let weights = this.weights;
    let weightsR = this.weightsR;
    let weightsG = this.weightsG;
    let weightsB = this.weightsB;
    let counts = this.counts;
    let avgWeights = this.avgWeights;
    weights.fill(0);
    weightsR.fill(0);
    weightsG.fill(0);
    weightsB.fill(0);
    counts.fill(0);
    avgWeights.fill(0);
    for (let i = 0; i < centroids.length; i++) {
      centroids[i] = createVector(0, 0);
    }
    video.loadPixels();
    let delaunayIndex = 0;
    let delaunay = this.delaunay;
    for (let i = 0; i < w; i++) {
      for (let j = 0; j < h; j++) {
        let index = (i + j * w) * 4;
        let r = video.pixels[index + 0];
        let g = video.pixels[index + 1];
        let b = video.pixels[index + 2];
        let bright = (r + g + b) / 3;
        let weight = 1 - bright / 255;
        delaunayIndex = delaunay.find(i, j, delaunayIndex);
        centroids[delaunayIndex].x += i * weight;
        centroids[delaunayIndex].y += j * weight;
        weights[delaunayIndex] += weight;
        weightsR[delaunayIndex] += r * r;
        weightsG[delaunayIndex] += g * g;
        weightsB[delaunayIndex] += b * b;
        counts[delaunayIndex]++;
      }
    }
    let points = this.points;
    let maxWeight = 0;
    for (let i = 0; i < centroids.length; i++) {
      if (weights[i] > 0) {
        centroids[i].div(weights[i]);
        avgWeights[i] = weights[i] / (counts[i] || 1);
        if (avgWeights[i] > maxWeight) {
          maxWeight = avgWeights[i];
        }
      } else {
        centroids[i] = points[i].copy();
      }
    }
    for (let i = 0; i < points.length; i++) {
      if (this.organic && random(1) > 0.98) points[i].set(random(w), random(h));
      else points[i].lerp(centroids[i], 1);
    }
    let col = [];
    for (let i = 0; i < points.length; i++) {
      let v = points[i];
      let index = Math.floor(v.x + v.y * w) * 4;
      col[0] = video.pixels[index + 0];
      col[1] = video.pixels[index + 1];
      col[2] = video.pixels[index + 2];
      if (weights[i] > 0) {
        let ra = Math.sqrt(weightsR[i] / weights[i]);
        let ga = Math.sqrt(weightsG[i] / weights[i]);
        let ba = Math.sqrt(weightsB[i] / weights[i]);
        col[0] = ra;
        col[1] = ga;
        col[2] = ba;
      }
      layer.strokeWeight(0.5);
      layer.stroke(0, 0, 0);
      layer.fill(col);
      let poly = cells[i];
      layer.beginShape();
      for (let i = 0; i < poly.length; i++) {
        layer.vertex(poly[i][0], poly[i][1]);
      }
      layer.endShape();
    }
    this.delaunay = calculateDelaunay(points);
    this.voronoi = this.delaunay.voronoi([0, 0, w, h]);
    // image(layer, 0, 0, width, height, 0, 0, w, h);
  }

  calculateDelaunay(points) {
    let pointsArray = [];
    for (let v of points) {
      pointsArray.push(v.x, v.y);
    }
    return new d3.Delaunay(pointsArray);
  }
}

// !!@ Not used - for reference
function setup() {
  createCanvas(windowWidth, windowHeight);
  // createCanvas(640, 480);
  video = createCapture(VIDEO, capture_ready_callback);
  video.hide();
  // video.size(640, 480);

  setup_fullScreenBtn();
}

// !!@ Not used - for reference
function capture_ready_callback() {
  console.log('capture_ready_callback width', video.width, video.height);

  let w = video.width;
  let h = video.height;
  layer = createGraphics(w, h);

  // much faster to get video pixels as image
  let img = video.get();
  for (let i = 0; i < npoints; i++) {
    let x = random(w);
    let y = random(h);
    let col = img.get(x, y);
    if (random(100) > brightness(col)) {
      points.push(createVector(x, y));
      // points.push({ x, y });
    } else {
      i--;
    }
  }
  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, w, h]);
}

// !!@ Not used - for reference
function draw() {
  if (!layer) return;
  background(255);
  let w = video.width;
  let h = video.height;
  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);
  // console.log('cells.length', cells.length);
  weights.fill(0);
  weightsR.fill(0);
  weightsG.fill(0);
  weightsB.fill(0);
  counts.fill(0);
  avgWeights.fill(0);
  for (let i = 0; i < centroids.length; i++) {
    centroids[i] = createVector(0, 0);
  }
  video.loadPixels();
  let delaunayIndex = 0;
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      let index = (i + j * w) * 4;
      let r = video.pixels[index + 0];
      let g = video.pixels[index + 1];
      let b = video.pixels[index + 2];
      let bright = (r + g + b) / 3;
      let weight = 1 - bright / 255;
      delaunayIndex = delaunay.find(i, j, delaunayIndex);
      centroids[delaunayIndex].x += i * weight;
      centroids[delaunayIndex].y += j * weight;
      weights[delaunayIndex] += weight;
      weightsR[delaunayIndex] += r * r;
      weightsG[delaunayIndex] += g * g;
      weightsB[delaunayIndex] += b * b;
      counts[delaunayIndex]++;
    }
  }
  let maxWeight = 0;
  for (let i = 0; i < centroids.length; i++) {
    if (weights[i] > 0) {
      centroids[i].div(weights[i]);
      avgWeights[i] = weights[i] / (counts[i] || 1);
      if (avgWeights[i] > maxWeight) {
        maxWeight = avgWeights[i];
      }
    } else {
      centroids[i] = points[i].copy();
    }
  }
  for (let i = 0; i < points.length; i++) {
    if (organic && random(1) > 0.98) points[i].set(random(w), random(h));
    else points[i].lerp(centroids[i], 1);
  }
  let col = [];
  for (let i = 0; i < points.length; i++) {
    let v = points[i];
    let index = Math.floor(v.x + v.y * w) * 4;
    col[0] = video.pixels[index + 0];
    col[1] = video.pixels[index + 1];
    col[2] = video.pixels[index + 2];
    if (weights[i] > 0) {
      let ra = Math.sqrt(weightsR[i] / weights[i]);
      let ga = Math.sqrt(weightsG[i] / weights[i]);
      let ba = Math.sqrt(weightsB[i] / weights[i]);
      col[0] = ra;
      col[1] = ga;
      col[2] = ba;
    }
    layer.strokeWeight(0.5);
    layer.stroke(0, 0, 0);
    layer.fill(col);
    let poly = cells[i];
    layer.beginShape();
    for (let i = 0; i < poly.length; i++) {
      layer.vertex(poly[i][0], poly[i][1]);
    }
    layer.endShape();
  }

  delaunay = calculateDelaunay(points);
  voronoi = delaunay.voronoi([0, 0, w, h]);

  image(layer, 0, 0, width, height, 0, 0, w, h);

  my.fpsSpan.html(framesPerSecond());
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}

// https://editor.p5js.org/jht9629-nyu/sketches/kmsBYRROJ
// Field rainstorm v1 responsive

// https://editor.p5js.org/jht9629-nyu/sketches/EUYEkY-fV
// Field rainstorm v0

// https://editor.p5js.org/picticon/sketches/Ah-OhNJ-B
// Field rainstorm by picticon

// https://thecodingtrain.com/challenges/181-image-stippling
// Organic Polygon Camera by C. Randall
// https://editor.p5js.org/picticon/sketches/Ah-OhNJ-B
// Field rainstorm by picticon
