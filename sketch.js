///////////////////
//// VARIABLES ////
///////////////////

// DOM variables
let p5canvas = document.querySelector(".p5canvas");

// Canvas variables
var canvasWidth = 720;
var canvasHeight = 576;

// Swarm variables
var swarm;
var swarmCount = 50;
var swarmSpeed = 3;

var avoidRadius = 20;
var avoidStrength = 0.05;
var avoidMultiplier = 1.5;

var alignStrenght = 0.05;
var alignMultiplier = 1;

var seekStrenght = 0.05;

var cohesionMultiplier = 1;

// Words variables
var words;
var wordsSize = 10;
var wordsBorderWidth = 2;
var wordsFonts = ['Helvetica', 'Georgia'];

////////////////////////
//// P5JS FUNCTIONS ////
////////////////////////

function preload() {
  words = loadStrings('keywords.txt');
  // console.log(res.toString());
  // console.log(res['0']);
  // words = res[0].split(',');
  // console.log(words)
}

function setup() { 
  words = words[0].split(',');

  swarm = new Swarm();
  swarm.addBoids(swarmCount);

  createCanvas(canvasWidth, canvasHeight);
}

function draw() { 
  background(0, 50);

  swarm.play();
}