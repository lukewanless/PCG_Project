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
var rooms = [];
var mission = "Start Room Room Room Enemy Room Key Room Room Room Room Lock Room Enemy Room Room Key Enemy Room Lock Room Room Key Lock Room Key Lock Room Room Key Room Room Room Lock End";

//class to define the room type from string 
class Room {
  constructor(roomString) {
    this.roomString = roomString;
    this.used = false;
    this.floorplanIndex = 0;
  } 
  colour() {
    if (this.roomString == "Start") {return color(0,255,0)}
    else if (this.roomString == "Room") {return color(255,255,255)}
    else if (this.roomString == "Key") {return color(0,0,255)}
    else if (this.roomString == "Lock") {return color(255,0,0)}
    else if (this.roomString == "End") {return color(255,255,0)}
    else {return color(255,0,0)};
    }
  }

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
     for (var j = 0; j < structure.length; j++) {
      if (rooms[j].used) {
        print(rooms[j].roomString);
        fill(rooms[j].colour());
        rect(30*(rooms[j].floorplanIndex % 10), 30*floor((rooms[j].floorplanIndex/10)), 30, 30);
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
  structure = mission.split(' ');
  started = true;
  startText = "";
  images = [];
  floorplan = [];
  for (var i = 0; i <= 100; i++){
    floorplan[i] = 0;
  }
  for (var i = 0; i <= structure.length; i++){
    rooms[i] = new Room(structure[i]);
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

    if (floorplanCount >= structure.length) {
      return false;
    }
    
    if (Math.random() < 0.5 && i != 45) {
        return false;
    }
    cellQueue.push(i);
    rooms[floorplanCount].floorplanIndex = i;
    rooms[floorplanCount].used = true;
    floorplan[i] = 1;
    floorplanCount += 1;

    return true;
}

function ncount(i) {
  return floorplan[i-10] + floorplan[i-1] + floorplan[i+1] + floorplan[i+10];
}
