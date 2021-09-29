var startText;
var started;
var floorplanCount = []; // a global 2D array to store the floorplancount of each level 
var cellQueue;
var rooms; //temp array used in initialising the allRooms array 
var floors; //temp array used in initialising the floorplan array 
var floorplan = []; // a global 2D array that stores the occupancy status {0,1} of all rooms in all levels 
var allRooms = []; // A global 2D array that stores the rooms (object) array for all levels
var levels = []; // global 2D array that stores the string separated into levels and rooms 
var numLevels = 0;
var mission = "Start Room Room Enemy Level Room Key Room Room Level Room Room Lock Level Room Key Room Room Level Level Room Key Room Room Level Level Room Key Room Room Level Level Room Key Room Room Level Level Room Key Room Room Level Level Room Key Room Room Level Level Room Key Room Room Level End";
var levelCounter = 0; 

class Room {
  constructor(roomString) {
    this.roomString = roomString;
    this.used = 0;
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
  font = loadFont("assets/Fipps-Regular.otf")
}

function setup() {
  createCanvas(1500, 300);
  background(220);
  structure = mission.split(' ');
  numLevels = countLevels(structure);

  //split different levels into levels array
  var start = 0; 
  var count = 0; 
  for (var j = 0; j < structure.length; j++) {
    if (structure[j] == "Level") {
      levels[count] = structure.slice(start, j+1);
      start = j; 
      count++;
    }
    else if (structure[j] == "End") {
      levels[count] = structure.slice(start, j+1);
    }
  }
  print(levels);
  startText = "Click to generate level";
}

function draw() {
  textSize(14);
  if (!started) {
    textFont(font);
    text(startText, 20, 150);
  }
  if (started) {
  if (levelCounter < levels.length && floorplanCount[levelCounter] < levels[levelCounter].length || cellQueue[levelCounter].length > 0) {
      var i = cellQueue[levelCounter].shift();
      var x = i % 10;
      var created  = false;
      if (x > 1) {created = created | visit(i - 1);print("HI",levelCounter);}
      if (x < 9) {created = created | visit(i + 1);print("HI",levelCounter);}
      if (i > 20) {created = created | visit(i - 10);print("HI",levelCounter);}
      if (i < 70) {created = created | visit(i + 10);print("HI",levelCounter);}
      print(cellQueue[levelCounter].length);
      if (!created && floorplanCount[levelCounter] < levels[levelCounter].length) {
        start();
      }
    }    

    // must also ensure it isnt placed before whole level is complete previous cells so we dont get gaps in levels 
    else if (allRooms[levelCounter][floorplanCount[levelCounter]-1].roomString == "Level" 
            && floorplanCount[levelCounter] == levels[levelCounter].length && levelCounter < levels.length-1) {
      nextLevel();
    }
    printRooms();
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
  allRooms = [];
  floorplan = [];
  floorplanCount = [];
  cellQueue = []; 
  levelCounter = 0; 

  for (var i = 0; i < numLevels; i++) {
    floors = [];
    for (var j = 0; j <= 100; j++) {
      floors[j] = 0;
    }
    floorplan[i] = floors; 

    rooms = [];
    for (var j = 0; j < levels[i].length; j++){ 
      rooms[j] = new Room(levels[i][j]);
    }
    allRooms[i] = rooms;
    floorplanCount[i] = 0; 
    cellQueue[i] = [];
  }
  //cellQueue = [];
  visit(45); 
}

function visit(i, first = false) {
  if (first) {
    levelCounter++;
    created = true;
  }
  if (floorplan[levelCounter][i]) {
    return false;
  }
  var neighbours = ncount(levelCounter, i); 
  if (neighbours > 1) { 
    return false;
  }
  if (floorplanCount[levelCounter] >= levels[levelCounter].length) {
    return false;
  }
  if (Math.random() < 0.40 && i != 45) {//<0.5
      return false;
  }
  cellQueue[levelCounter].push(i);
  allRooms[levelCounter][floorplanCount[levelCounter]].used = 1;
  allRooms[levelCounter][floorplanCount[levelCounter]].floorplanIndex = i;
  floorplan[levelCounter][i] = 1;
  floorplanCount[levelCounter] += 1;
  return true;
}

/* function create() {
  if (levelCounter < levels.length && floorplanCount[levelCounter] < levels[levelCounter].length && cellQueue.length > 0) { //cellQueue.length > 0
    var i = cellQueue.shift();
    var x = i % 10;
    var created  = false;
    if (x > 1) {created = created | visit(i - 1);print("HI",levelCounter);}
    if (x < 9) {created = created | visit(i + 1);print("HI",levelCounter);}
    if (i > 20) {created = created | visit(i - 10);print("HI",levelCounter);}
    if (i < 70) {created = created | visit(i + 10);print("HI",levelCounter);}
    print(cellQueue.length);
    if (!created) {
      return false; 
    }
    return true;
  }   
  return false; 
} */

function nextLevel() {
  var previous = allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex;
  if (levels[levelCounter].length == floorplanCount[levelCounter]) {
    print("All rooms", allRooms);
    print(previous); 
  }
  //levelCounter++;
  visit(previous, true);
}

function ncount(level, i) {
  return floorplan[level][i-10] + floorplan[level][i+10] +
        floorplan[level][i-1] + floorplan[level][i+1];
}

function countLevels(structure) {
  var levels = 1;
  for (var i = 0; i < structure.length; i++) {
    if (structure[i] == "Level") {levels++;}
  }
  return levels;
}

function printRooms() {
  // draw grid lines 
  for (var i = 0; i < numLevels; i++) {
    var startWidth = 350*i;
    var endWidth =  startWidth + 300;
    var height = 300; 
    for (var x = startWidth; x <= endWidth ; x += 30) {
      for (var y = 0; y <= height; y += 30) {
        stroke(0);
        strokeWeight(1);
        line(x, 0, x, height);
        line(startWidth, y, endWidth, y);
      }
    }
  } 
  // draw rooms 
  for (var i = 0; i < allRooms.length; i++) {
    for (var j = 0; j < allRooms[i].length; j++) {
      if (allRooms[i][j].used ==1) {
        stroke(0);
        fill(allRooms[i][j].colour()); 
        if (i == 0) {
          rect(30*(allRooms[i][j].floorplanIndex % 10), 30*floor((allRooms[i][j].floorplanIndex/10)), 30, 30);
        }
        else {
          rect(350*i + 30*(allRooms[i][j].floorplanIndex % 10), 30*floor((allRooms[i][j].floorplanIndex/10)), 30, 30); 
        }
      }
    }
  }
}