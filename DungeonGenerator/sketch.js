var startText;
var started;
var images = [];
var floorplan;
var floorplanCount;
var cellQueue;
var endrooms;
var maxrooms = 15;
var minrooms = 7;
var bossl;

function preload() {
  //import the various assets and images 
  font = loadFont("assets/Fipps-Regular.otf")
}

function setup() {
  createCanvas(400, 400);
  background(220);
  startText = "Click to generate level";
}

function draw() {
  textSize(18);
  if (!started) {
    textFont(font);
    text(startText, 30, 200);
  }
  if (started) {
    if (cellQueue.length > 0) {
      var i = cellQueue.shift();
      var x = i % 10;
      var created  = false;

      if (x > 1) {
        created = created | visit(i - 1);
      }
      if (x < 9) {
        created = created | visit(i + 1);
      }
      if (i > 20) {
        created = created | visit(i - 10);
      }
      if (i < 70) {
        created = created | visit(i + 10);
      }
    }
    for (var j = 0; j < floorplan.length; j++) {
      if (floorplan[j] != 0) {
        rect(30*(i % 10), 30*floor((i/10)), 30, 30);
      }
    }
  }
}

function mouseClicked() {
  background(220);
  start();
}

function start() {
  background(220);
  started = true;
  startText = "";
  images = [];
  floorplan = [];
  for (var i = 0; i <= 100; i++){
    floorplan[i] = 0;
  }
  floorplanCount = 0;
  cellQueue = [];
  endrooms = [];
  // Our grid is one row lower than isaacs as referencing negative indices isn't a good idea in JS
  visit(45);
}

function visit(i) {
    if (floorplan[i]) {
      return false;
    }

    var neighbours = ncount(i);

    if (neighbours > 1) {
      return false;
    }

    if (floorplanCount >= maxrooms) {
      return false;
    }

    if (Math.random() < 0.5 && i != 45) {
        return false;
    }
    cellQueue.push(i);
    floorplan[i] = 1;
    floorplanCount += 1;

    return true;
}

function ncount(i) {
  return floorplan[i-10] + floorplan[i-1] + floorplan[i+1] + floorplan[i+10];
}
