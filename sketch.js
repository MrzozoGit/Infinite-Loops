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

var bgColor = {
  r: 0,
  g: 0,
  b: 0
}
var bgColorGradient = {
  positive: {
    1: {
      r: 0,
      g: 0,
      b: 0
    },
    2: {
      r: 46,
      g: 137,
      b: 255
    }
  },
  negative: {
    1: {
      r: 0,
      g: 0,
      b: 0
    },
    2: {
      r: 199,
      g: 128,
      b: 45
    }
  },
  current: {
    1: {
      r: 0,
      g: 0,
      b: 0
    },
    2: {
      r: 199,
      g: 128,
      b: 45
    }
  }
}
var boidsColors = {
  positive: {
    r: 46,
    g: 137,
    b: 255
  },
  negative: {
    r: 242,
    g: 63,
    b: 44
  },
  current: {
    r: 242,
    g: 63,
    b: 44
  }
}

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

// Scenario variable
var totalTime = 30;


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
  let scenarTime = currentTime%totalTime;

  if(0 < scenarTime && scenarTime < totalTime/3) {
    avoidMultiplier += 0.01;
    cohesionMultiplier -= 0.01;
    alignMultiplier -=0.01;
    wordsSize -= 0.03;
    wordsShadowVisibility -= 0.9;
    wordsShadowBlur -= 0.03;
    bgColor.r += 0.2;
    bgColor.g += 0.2;
    bgColor.b += 0.2;
    boidsColors.current.r -= (boidsColors.negative.r-boidsColors.positive.r)/(fps*10);
    boidsColors.current.g -= (boidsColors.negative.g-boidsColors.positive.g)/(fps*10);
    boidsColors.current.b -= (boidsColors.negative.b-boidsColors.positive.b)/(fps*10);
    bgColorGradient.current[2].r -= (bgColorGradient.negative[2].r-bgColorGradient.positive[2].r)/(fps*10);
    bgColorGradient.current[2].g -= (bgColorGradient.negative[2].g-bgColorGradient.positive[2].g)/(fps*10);
    bgColorGradient.current[2].b -= (bgColorGradient.negative[2].b-bgColorGradient.positive[2].b)/(fps*10);
    
  } else if (totalTime/3 < scenarTime && scenarTime < (totalTime/3)*2) {
    avoidMultiplier -= 0.01;
    cohesionMultiplier += 0.01;
    alignMultiplier +=0.01;
    wordsSize += 0.03;
    wordsShadowVisibility += 0.9;
    wordsShadowBlur += 0.03;
    bgColor.r -= 0.2;
    bgColor.g -= 0.2;
    bgColor.b -= 0.2;
    boidsColors.current.r += (boidsColors.negative.r-boidsColors.positive.r)/(fps*10);
    boidsColors.current.g += (boidsColors.negative.g-boidsColors.positive.g)/(fps*10);
    boidsColors.current.b += (boidsColors.negative.b-boidsColors.positive.b)/(fps*10);
    bgColorGradient.current[2].r += (bgColorGradient.negative[2].r-bgColorGradient.positive[2].r)/(fps*10);
    bgColorGradient.current[2].g += (bgColorGradient.negative[2].g-bgColorGradient.positive[2].g)/(fps*10);
    bgColorGradient.current[2].b += (bgColorGradient.negative[2].b-bgColorGradient.positive[2].b)/(fps*10);
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
  // background(color(bgColor.r, bgColor.g, bgColor.b));
  setGradient(0, 0, canvasWidth, canvasHeight*2, color(bgColorGradient.current[1].r, bgColorGradient.current[1].g, bgColorGradient.current[1].b), color(bgColorGradient.current[2].r, bgColorGradient.current[2].g, bgColorGradient.current[2].b), Y_AXIS);
  blendMode(OVERLAY);
  image(backgroundNoise, 0, 0);
  blendMode(BLEND);

  swarm.play();
  playScenario();
}