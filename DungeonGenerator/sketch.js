var startText;
var started;
var images = [];
var floorplanCount = []; // a global 2D array to store the floorplancount of each level 
var cellQueue;
//var cells; //temp array used in initialising the cellQueue array 
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
  frameRate(10);
  createCanvas(1500, 300);
  background(220);
  structure = mission.split(' ');
  numLevels = countLevels(structure);
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
  } 
  //remove the last null value from the last of each list
  for (var i = 0; i < numLevels; i++) {
    var k = levels[i].length;
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
    if (levelCounter < levels.length && cellQueue.length > 0 && floorplanCount[levelCounter] < levels[levelCounter].length) {
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
    if (allRooms[levelCounter][floorplanCount[levelCounter]-1].roomString == "Level") {
      print("Level", levelCounter);
      levelCounter++;
      cellQueue.push(allRooms[levelCounter-1][floorplanCount[levelCounter-1]]);
      //visit(allRooms[levelCounter-1][floorplanCount[levelCounter-1]]);
    }

    //draw the grid 
    //draw one for each level
    for (var i = 0; i < numLevels; i++) {
      var startWidth = 350*i;
      var endWidth =  startWidth + 300;
      var height = 300; 
      for (var x = startWidth; x <= endWidth ; x += 30) {
        for (var y = 0; y <= 300; y += 30) {
          stroke(0);
          strokeWeight(1);
          line(x, 0, x, height);
          line(startWidth, y, endWidth, y);
        }
      }
    } 

    // want to print the all rooms array which will print each level 
    for (var i = 0; i < allRooms.length; i++) {
      for (var j = 0; j < allRooms[i].length; j++) {
        if (allRooms[i][j].used ==1) { //see if binary works instead of true false for used 
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
  //2D cellQueue initialisation 
  for (var i = 0; i < numLevels; i++) {
    cellQueue[i] = [];
  }
  //print(cellQueue); 
  //2D floorplan array initialisation
  for (var i = 0; i < numLevels; i++) {
    floors = [];
    for (var j = 0; j <= 100; j++) {
      floors[j] = 0;
    }
    floorplan[i] = floors; 
  }
  //need an array to store the rooms arrays for each level
  for (var i = 0; i < numLevels; i++) {
    rooms = [];
    for (var j = 0; j <= levels[i].length; j++){ //i <= structure.length
      rooms[j] = new Room(levels[i][j]);
    }
    // initialise an array of 100 rooms for each level and append to global array 
    allRooms[i] = rooms;
  }
  print(allRooms);
  // initialise floorplancount array 
  for (var i = 0; i < numLevels; i++) {
    floorplanCount[i] = 0;  
  }
  cellQueue = []; //not used yet 
  visit(45); //visit is now passed an index pointing to the rooms array 
}

function visit(i) {

  if (floorplan[levelCounter][i]) {
    return false;
  }

  var neighbours = ncount(levelCounter, i); //fix ncount to take in a specific level 

  if (neighbours > 1) { 
    return false;
  }

  if (floorplanCount[levelCounter] >= levels[levelCounter].length) {
    return false;
  }
    
  if (Math.random() < 0.40 && i != 45) {//<0.5
      return false;
  }

  if (allRooms[levelCounter][floorplanCount[levelCounter]].roomString == "Level") {
    cellQueue.push(i);
    allRooms[levelCounter][floorplanCount[levelCounter]].used = 1;
    allRooms[levelCounter][floorplanCount[levelCounter]].floorplanIndex = i;
    floorplan[levelCounter][i] = 1;
    floorplanCount[levelCounter] += 1;
  }
  else {
    cellQueue.push(i);
    allRooms[levelCounter][floorplanCount[levelCounter]].used = 1;
    allRooms[levelCounter][floorplanCount[levelCounter]].floorplanIndex = i;
    floorplan[levelCounter][i] = 1;
    floorplanCount[levelCounter] += 1;
  }
  return true;
}

function ncount(level, i) {
  return floorplan[level][i-10] + floorplan[level][i+10] +
        floorplan[level][i-1] + floorplan[level][i+1];
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
