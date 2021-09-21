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
var levels = [];
var numLevels = 0;
//var mission = "Start Room Room Room Enemy Room Key Room Room Room Room Lock Room Enemy Room Room Key Enemy Room Lock Room Room Key Lock Room Key Lock Room Room Key Room Room Room Lock End";
var mission = "Start Room Room Enemy Level Room Key Room Room Level Room Room Lock End";
var numRooms;
var rowSize;

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
    else if (this.roomString == "Enemy") {return color(0,255,255)}
    else if (this.roomString == "Level") {return color(255,0,255)};
    }
  }

function preload() {
  //import the various assets and images 
  font = loadFont("assets/Fipps-Regular.otf")
}

function setup() {
  createCanvas(300, 300);
  background(220);
  structure = mission.split(' ');
  numLevels = countLevels(structure);
  print(numLevels);
  numRooms = structure.length;
  
  //create separate structures split at the different levels and append to levels array
  var j = 0; 
  for (var i = 0; i < numLevels; i++) {
    var level = [];
    if (!(i == 0)) {
      level[0] =  "Level";
    }
    while (!( (structure[j] == "Level") || (structure[j] == "End"))) {
      append(level, structure[j]);
      j++;
    }
    append(level, structure[j]);
    append(levels,level);
    j++;
    print(levels); 
  } 
  startText = "Click to generate level";
}

function draw() {
  textSize(14);
  if (!started) {
    textFont(font);
    text(startText, 20, 150);
  }
  if (started) {
    if (cellQueue.length > 0 && floorplanCount < structure.length) {
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
      if (i < numRooms - 70) { 
        created = created | visit(i + 10);  
      }
      if (!created) {
        start();
      } 
    }
      for (var j = 0; j < structure.length; j++) {
        if (rooms[j].used) {
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
  visit(45)
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
    
    if (Math.random() < 0.40 && i != 45) {//<0.5
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

function countLevels(structure) {
  var levels = 0;
  for (var i = 0; i < structure.length; i++) {
    if (structure[i] == "Level") {
      levels++;
    }
  }
  //levels = number of dividers + 1
  levels++;
  return levels;
}
