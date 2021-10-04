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
var convergenceFactor = 0.60; 
//var mission = "Start Room Room Enemy Room Key Room Room Level Room Key Room Key Room Room Level Room Key Room Room End";
// 5 rooms/lvl = 3 Rooms in between level, then 8 room, then 13 room 
//var mission = "Start Room Room Room End"; //1 lvl 
//var mission = "Start Room Room Room Level Room Room Room End"; //2lvl
var mission = "Start Room Room Room Level Room Room Room Level Room Room Room Level Room Room Room End"; //3lvl 
//var mission =  "Start Room Room Key Room Room Room Room Enemy Room Lock Room Room Room Enemy Room Room Level Room Room Room Enemy Room Key Room Level Lock Enemy Room Room Room Room Key Room Lock Key Enemy Room Lock Room End";
//var mission = 'Start Room Room Level Key Enemy Room Lock Room Room Enemy Room Level Room Room Key Enemy Room Lock Enemy Room Key Room Enemy Room Room Level Lock Room Enemy Room Room End '
//var mission = "Start Room Room Room Key Level Room Key Room Lock Room Enemy Room Room Enemy Room Key Enemy Room Lock Level Room Lock Enemy Room Enemy Room Room End"; 
var levelCounter = 0; 
var trials = 0; 

//testing variables 
var isFinished; 
var restartCount; 
var restartStats = [];


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
  frameRate(10000);
  structure = mission.split(' ');
  numLevels = countLevels(structure);
  createCanvas(650*numLevels, 650);
  background(220);
  restartCount = 0; 
  isFinished = false; 
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
  startText = "Click to generate level";
}

function draw() {
  textSize(14);
  if (!started) {
    textFont(font);
    text(startText, 40, 250);
  }
  if (started) {
  if (levelCounter < levels.length && floorplanCount[levelCounter] < levels[levelCounter].length || cellQueue[levelCounter].length > 0) {
      var i = cellQueue[levelCounter].shift();
      var x = i % 30;
      var created  = false;
      if (x > 3) {created = created | visit(i - 1);}
      if (x < 27) {created = created | visit(i + 1);}
      if (i > 60) {created = created | visit(i - 30);}
      if (i < 780) {created = created | visit(i + 30);}
      /* if (!created && floorplanCount[levelCounter] < levels[levelCounter].length && floorplanCount[levelCounter] != 0) {
        created = created || visit(allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex -1) 
                          || visit(allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex +1)
                          || visit(allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex -30)
                          || visit(allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex +30);
      } */
      else if (!created && floorplanCount[levelCounter] < levels[levelCounter].length) {
        start();
      }
    }    

    // must also ensure it isnt placed before whole level is complete previous cells so we dont get gaps in levels 
    else if (allRooms[levelCounter][floorplanCount[levelCounter]-1].roomString == "Level" 
            && floorplanCount[levelCounter] == levels[levelCounter].length && levelCounter < levels.length-1) {
      nextLevel();
    }
   
    else if (allRooms[levelCounter][floorplanCount[levelCounter]-1].roomString == "End" && !isFinished) {
      isFinished = true;
      trials++;
      restartCount = restartCount-1; 
      append(restartStats,restartCount);
      if (trials < 100) {
        print(trials);
        //mouseClicked(); //uncomment for automated testing open up javaScript console in chrome to see average 
      }
      if (trials == 100) {
        let sum = 0;
        for (let i = 0; i < restartStats.length; i++) {
          sum += restartStats[i];
        }
        let average = sum / restartStats.length;
        print(average)}; 
    }
    printRooms();
  }
}

function mouseClicked() {
  background(220);
  restartCount = 0;
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

  //testing variables 
  restartCount++;
  isFinished = false;  

  for (var i = 0; i < numLevels; i++) {
    floors = [];
    for (var j = 0; j <= 900; j++) {
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
  visit(465); 
}

function visit(i, first = false) {
  if (first) {
    levelCounter++;
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
  if (Math.random() < convergenceFactor && floorplanCount[levelCounter] != 0 && i != 465) { // adjust random parameter to be inversely proportional to numLevels
      return false;
  }
  cellQueue[levelCounter].push(i);
  allRooms[levelCounter][floorplanCount[levelCounter]].used = 1;
  allRooms[levelCounter][floorplanCount[levelCounter]].floorplanIndex = i;
  floorplan[levelCounter][i] = 1;
  floorplanCount[levelCounter] += 1;
  return true;
}

function nextLevel() {
  var previous = allRooms[levelCounter][floorplanCount[levelCounter]-1].floorplanIndex;
  visit(previous, true);
}

function ncount(level, i) {
  return floorplan[level][i-30] + floorplan[level][i+30] +
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
    var startWidth = 650*i;
    var endWidth =  startWidth + 600;
    var height = 600; 
    for (var x = startWidth; x <= endWidth ; x += 20) {
      for (var y = 0; y <= height; y += 20) {
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
          rect(20*(allRooms[i][j].floorplanIndex % 30), 20*floor((allRooms[i][j].floorplanIndex/30)), 20, 20);
        }
        else {
          rect(650*i + 20*(allRooms[i][j].floorplanIndex % 30), 20*floor((allRooms[i][j].floorplanIndex/30)), 20, 20); 
        }
      }
    }
  }
}