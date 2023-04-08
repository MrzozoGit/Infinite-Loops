// Swarm class
class Swarm {
  constructor() {
    this.boids = [];
  }

  play() {
    this.joinParticles();
    for (let i = 0; i < this.boids.length; i++) {
      this.boids[i].play(this.boids);
    }
  }

  addBoid(boid) {
    this.boids.push(boid);
  }

  addBoids(nb) {
    for (let i = 0; i < nb; i++) {
      let boid = new Boid(random(0, canvasWidth), random(0, canvasHeight));
      this.addBoid(boid);
    }
  }

  popBoid() {
    this.boids.pop();
  }

  joinParticles() {
    for (let i = this.boids.length - 1; i >= 0; i--) {
      for (let j = this.boids.length - 1; j >= 0; j--) {
        let dis = dist(this.boids[i].pos.x, this.boids[i].pos.y, this.boids[j].pos.x, this.boids[j].pos.y);
        if (dis < 100) {
          stroke(255, 100 - dis);
          strokeWeight(1);
          line(this.boids[i].pos.x, this.boids[i].pos.y, this.boids[j].pos.x, this.boids[j].pos.y);
        }
      }
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
    this.textSize = random(10, 20); // random size
    // this.textFont = wordsFonts[0];
    this.textFont = wordsFonts[int(random(0, wordsFonts.length))];
    this.particleSystem = new ParticleSystem(createVector(this.pos.xpos, this.pos.ypos));
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
      this.particleSystem.addParticle(); // Add a particule to the table of particles
      this.particleSystem.run(); // Evolve each particule of the table of particules
      // rotate(theta); // TO HAVE WORDS FACE THE DIRECTION THEYRE GOING TO -> ressource demanding
      
      // First word
      drawingContext.shadowBlur = wordsShadowBlur;
      drawingContext.shadowColor = color(125, 164, 211, wordsShadowVisibility);  
      strokeWeight(wordsBorderWidth);
      fill(color(125, 164, 211, wordsShadowVisibility));
      // fill(random(0, 100), random(0,150), random(100,255)); // stuttering colors
      textSize(wordsSize);
      // textSize(this.textSize);
      textFont(this.textFont);
      var myText = text(this.textContent, 0, 0); 
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
    if (this.pos.x > width + padding) this.pos.x = -padding;
    if (this.pos.y > height + padding) this.pos.y = -padding;
    if (this.pos.x < -padding) this.pos.x = width + padding;
    if (this.pos.y < -padding) this.pos.y = height + padding;
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.pos);
    desired.normalize();
    desired.mult(swarmSpeed);
    let steer = p5.Vector.sub(desired, this.vel);
    steer.limit(seekStrenght);
    return steer;
  }

  avoid(boids) {
    var avoidVec = createVector();

    boids.forEach(neighbour => {
      var nd = this.pos.dist(neighbour.pos);
      if (nd < avoidRadius && nd > 0) {
        var pushVec = p5.Vector.sub(this.pos, neighbour.pos);
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
    let sum = createVector(0, 0);
    let count = 0;

    for (let i = 0; i < boids.length; i++) {
      let d = p5.Vector.dist(this.pos, boids[i].pos);
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
      let d = p5.Vector.dist(this.pos, boids[i].pos);
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

// A simple Particle class
class Particle {
  constructor(position) {
    this.acceleration = createVector(0, 0.05);
    this.velocity = createVector(random(-1, 1), random(-1, 0));
    this.position = position.copy();
    this.lifespan = 255;
  };

  run() {
    this.update();
    this.display();
  };

  // Method to update position
  update() {
    this.velocity.add(this.acceleration);
    this.position.add(this.velocity);
    this.lifespan -= 2;
  };

  // Method to display
  display() {
    // stroke(200, this.lifespan);
    stroke(200, 0);
    strokeWeight(1);
    fill(127, this.lifespan);
    ellipse(this.position.x, this.position.y, 1, 1);
  };

  // Is the particle still useful?
  isDead() {
    return this.lifespan < 0;
  };

}

class ParticleSystem {
  constructor(position) {
    this.origin = position.copy();
    this.particles = [];
    this.delay = 0;
  };

  addParticle() {
    this.delay++;
    if (this.particles.length < 25 && this.delay > 5) {
      this.particles.push(new Particle(this.origin));
      this.delay = 0;
    }
  };

  run() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      let p = this.particles[i];
      p.run();
      if (p.isDead()) {
        this.particles.splice(i, 1);
      }
    }
  };
}