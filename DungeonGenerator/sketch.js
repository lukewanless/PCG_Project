var startText;
var started;
var images = [];
var floorplanCount = []; // a global 2D array to store the floorplancount of each level 
var cellQueue;
var endrooms;
var maxrooms = 15;
var minrooms = 7;
var bossl;
var rooms; //temp array used in initialising the allRooms array 
var floors; //temp array used in initialising the floorplan array 
var floorplan = []; // a global 2D array that stores the occupancy status {0,1} of all rooms in all levels 
var allRooms = []; // A global 2D array that stores the rooms (object) array for all levels
var levels = []; // global 2D array that stores the string separated into levels and rooms 
var numLevels = 0;
//var mission = "Start Room Room Room Enemy Room Key Room Room Room Room Lock Room Enemy Room Room Key Enemy Room Lock Room Room Key Lock Room Key Lock Room Room Key Room Room Room Lock End";
var mission = "Start Room Room Enemy Level Room Key Room Room Level Room Room Lock End";
var numRooms;
var rowSize;
var levelCounter = 0; 

class Room {
  //replace the rooms array by this completely 
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
  //import the various assets and images 
  font = loadFont("assets/Fipps-Regular.otf")
}

function setup() {
  //frameRate(1);
  createCanvas(1500, 300);
  background(220);
  structure = mission.split(' ');
  numLevels = countLevels(structure);
  numRooms = structure.length;

  //create separate structures split at the different levels and append to levels array
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
    if (levelCounter < levels.length && floorplanCount[levelCounter] < levels[levelCounter].length) { //cellQueue.length > 0
      var i = cellQueue.shift();
      if (levelCounter == 1) {
        print("Now im pushing cell i =",i);
      }
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
    // must also ensure it isnt placed before one of its previous cells so we dont get gaps in levels 
    else if (allRooms[levelCounter][floorplanCount[levelCounter]-1].roomString == "Level") { //else if 
      levelCounter++;
      //print(allRooms[levelCounter-1][floorplanCount[levelCounter-1]].floorplanIndex)
      visit(allRooms[levelCounter-1][floorplanCount[levelCounter-1]-1].floorplanIndex); //SHOULDNT BE -1 (AT VERY END)!!!
      print("We are calling visit on cell", allRooms[levelCounter-1][floorplanCount[levelCounter-1]-1].floorplanIndex);
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
  images = [];
  allRooms = [];
  floorplan = [];
  floorplanCount = [];
  cellQueue = []; 
  levelCounter = 0;
  //2D floorplan array initialisation
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
  }
  cellQueue = [];
  visit(45); 
}

function visit(i) {

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
  print("Level",levelCounter, "pushing cell", i);
  cellQueue.push(i);
  floorplanCount[levelCounter] += 1;
  allRooms[levelCounter][floorplanCount[levelCounter]-1].used = 1;
  allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex = i;
  floorplan[levelCounter][i] = 1;
  //floorplanCount[levelCounter] += 1;
  print(allRooms);

  return true;
}

function ncount(level, i) {
  return floorplan[level][i-10] + floorplan[level][i+10] +
        floorplan[level][i-1] + floorplan[level][i+1];
}

function countLevels(structure) {
  var levels = 1;
  for (var i = 0; i < structure.length; i++) {
    if (structure[i] == "Level") {
      levels++;
    }
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
        //if its the first level ignore the front spacing 
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