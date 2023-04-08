///////////////////
//// VARIABLES ////
///////////////////

// DOM variables
let p5canvas = document.querySelector(".p5canvas");
let saveButton = document.querySelector(".save");

// Canvas variables
var canvasWidth = 720;
var canvasHeight = 576;
var fps = 30;
const Y_AXIS = 1;
const X_AXIS = 2;
var bg_r = 0;
var bg_g = 0;
var bg_b = 0;


// Swarm variables
var swarm;
var swarmCount = 70;
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
var wordsSize = 16;
var wordsBorderWidth = 0;
var wordsShadowBlur = 25;
var wordsShadowVisibility = 255;
var wordsFonts = ['Helvetica'];


////////////////
//// USUALS ////
////////////////

function setGradient(x, y, w, h, c1, c2, axis) {
  noFill();

  if (axis === Y_AXIS) {
    // Top to bottom gradient
    for (let i = y; i <= y + h; i++) {
      let inter = map(i, y, y + h, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(x, i, x + w, i);
    }
  } else if (axis === X_AXIS) {
    // Left to right gradient
    for (let i = x; i <= x + w; i++) {
      let inter = map(i, x, x + w, 0, 1);
      let c = lerpColor(c1, c2, inter);
      stroke(c);
      line(i, y, i, y + h);
    }
  }
}


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
    wordsShadowBlur -= 0.03;
    bg_r += 0.2;
    bg_g += 0.2;
    bg_b += 0.2;
  } else if (10 < scenarTime && scenarTime < 20) {
    avoidMultiplier -= 0.01;
    cohesionMultiplier += 0.01;
    alignMultiplier +=0.01;
    wordsSize += 0.03;
    wordsShadowVisibility += 0.5;
    wordsShadowBlur += 0.03;
    bg_r -= 0.2;
    bg_g -= 0.2;
    bg_b -= 0.2;
  }
}


////////////////////////
//// P5JS FUNCTIONS ////
////////////////////////

function preload() {
  words = loadStrings('assets/keywords.txt');
  backgroundNoise = loadImage('assets/noise.png');
  wordsFonts.push(loadFont('assets/Newon.otf'))
  // wordsFonts.push(loadFont('assets/MBF MODERN REBEL.otf'))
  wordsFonts.push(loadFont('assets/Vaporuz strikes.otf'))
}

function setup() { 
  words = words[0].split(',');

  swarm = new Swarm();
  swarm.addBoids(swarmCount);

  frameRate(fps);
  createCanvas(canvasWidth, canvasHeight);
}

let counter = 0;
let startTime = new Date();

function draw() { 
  background(color(bg_r, bg_g, bg_b));
  // setGradient(0, 0, canvasWidth, canvasHeight*2, color(bg_r, bg_g, bg_b), color(160, 255, 34), Y_AXIS);
  blendMode(OVERLAY);
  image(backgroundNoise, 0, 0);
  blendMode(BLEND);

  swarm.play();
  playScenario();
}