// Swarm class
class Swarm {
  constructor() {
    this.boids = [];
  }

  play() {
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].play(this.boids);
    }
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  addBoids(nb) {
    for(let i=0; i<nb; i++) {
      let boid = new Boid(random(0,canvasWidth), random(0,canvasHeight));
      this.boids.push(boid);
    }
  }
}

// Boid class
class Boid {
  constructor(xpos, ypos) {
    this.pos = new p5.Vector(xpos, ypos);
    this.vel = new p5.Vector(random(-1, 1), random(-1, 1));
    this.accel = createVector(0, 0);
    this.r = 3.0;
    this.textContent = words[int(random(0, words.length))];
    this.textSize = wordsSize;
    // this.textSize = random(0, wordsSize); // random size
    this.textFont = wordsFonts[0];
    this.textFont = wordsFonts[int(random(0,wordsFonts.length))];
  }

  play(boids) {
    this.flock(boids);
    this.update();
    this.screenBorders();
    this.draw();
  }

  draw() {
    let theta = this.vel.heading();
    fill('#7DA4D3');
    stroke('#6A7B9E');
    push();
      translate(this.pos.x, this.pos.y);
      // rotate(theta); // TO HAVE WORDS FACE THE DIRECTION THEYRE GOING TO -> very ressource demanding
      strokeWeight(wordsBorderWidth);
      fill(255);
      // fill(random(0, 100), random(0,150), random(100,255)); // stuttering colors
      textSize(this.textSize);
      textFont(this.textFont);
      var myText = text(this.textContent, 0, 0); // mots aléatoires
    pop();
  }

  applyForce(force) {
    this.accel.add(force);
  }

  flock(boids) {
    let sep = this.avoid(boids);
    let ali = this.align(boids);
    let coh = this.cohesion(boids); 
    sep.mult(avoidMultiplier);
    ali.mult(alignMultiplier);
    coh.mult(cohesionMultiplier);
    this.applyForce(sep);
    this.applyForce(ali);
    this.applyForce(coh);
  }

  update() {
    this.vel.add(this.accel);
    this.vel.limit(swarmSpeed);
    this.pos.add(this.vel);
    this.accel.mult(0);
  }

  screenBorders() {
    var padding = 20;
    if(this.pos.x > width+padding) this.pos.x = -padding;
    if(this.pos.y > height+padding) this.pos.y = -padding;
    if(this.pos.x < -padding) this.pos.x = width+padding;
    if(this.pos.y < -padding) this.pos.y = height+padding;
  }

  seek(target) {
    let desired = p5.Vector.sub(target,this.pos);
    desired.normalize();
    desired.mult(swarmSpeed);
    let steer = p5.Vector.sub(desired,this.vel);
    steer.limit(seekStrenght);
    return steer;
  }

  avoid(boids) {
    var avoidVec = createVector();

    boids.forEach(neighbour => {
      var nd = this.pos.dist(neighbour.pos);
      if (nd < avoidRadius && nd > 0){
        var pushVec = p5.Vector.sub(this.pos,neighbour.pos);
        pushVec.normalize();
        avoidVec.add(pushVec);
      } 
    })

    avoidVec.normalize();
    avoidVec.mult(avoidStrength);
    return avoidVec;
  }

  align(boids) {
    let neighbordist = 50;
    let sum = createVector(0,0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos,boids[i].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].vel);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      sum.normalize();
      sum.mult(swarmSpeed);
      let steer = p5.Vector.sub(sum, this.vel);
      steer.limit(alignStrenght);
      return steer;
    } else {
      return createVector(0, 0);
    }
  }

  cohesion(boids) {
    let neighbordist = 50;
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos,boids[i].pos);
      if ((d > 0) && (d < neighbordist)) {
        sum.add(boids[i].pos);
        count++;
      }
    }

    if (count > 0) {
      sum.div(count);
      return this.seek(sum);
    } else {
      return createVector(0, 0);
    }
  }
}