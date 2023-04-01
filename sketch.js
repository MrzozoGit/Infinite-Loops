///////////////////
//// VARIABLES ////
///////////////////

// DOM variables
let p5canvas = document.querySelector(".p5canvas");
let saveButton = document.querySelector(".save");

// Canvas variables
var canvasWidth = 720;
var canvasHeight = 576;

// Swarm variables
var swarm;
var swarmCount = 40;
var swarmSpeed = 3;

var avoidRadius = 20;
var avoidStrength = .05;
var avoidMultiplier = 1.5;

var alignStrenght = .05;
var alignMultiplier = .8;

var seekStrenght = .05;

var cohesionMultiplier = .7;

// Words variables
var words;
var wordsSize = 14;
var wordsBorderWidth = 2;
var wordsShadowBlur = 16;
var wordsShadowVisibility = 255;
var wordsFonts = ['Helvetica', 'Georgia'];

//////////////////////
//// INTERACTIONS ////
//////////////////////

saveButton.addEventListener('click', saveButtonHandler);

function saveButtonHandler() {
  saveGif('swarmGif', 10);
}
function playScenario() {
  // time managment
  let currentTime = (new Date().getTime() - startTime.getTime()) / 1000;
  let scenarTime = currentTime%30;

  if(0 < scenarTime && scenarTime < 10) {
    avoidMultiplier += 0.01;
    cohesionMultiplier -= 0.01;
    alignMultiplier -=0.01;
    wordsSize -= 0.03;
    wordsShadowVisibility -= 0.5;
  } else if (10 < scenarTime && scenarTime < 20) {
    avoidMultiplier -= 0.01;
    cohesionMultiplier += 0.01;
    alignMultiplier +=0.01;
    wordsSize += 0.03;
    wordsShadowVisibility += 0.5;
  }
}

////////////////////////
//// P5JS FUNCTIONS ////
////////////////////////

function preload() {
  words = loadStrings('keywords.txt');
}

function setup() { 
  words = words[0].split(',');

  swarm = new Swarm();
  swarm.addBoids(swarmCount);
  // swarm.createLifeCycle(swarmCount)

  createCanvas(canvasWidth, canvasHeight);
}

let counter = 0;
let startTime = new Date();

function draw() { 
  background(0);

  swarm.play();
  playScenario();
}