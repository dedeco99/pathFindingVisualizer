let canvas;
let ctx;
let particlesEffect;
let particlesEffectAnimation;

class Particle {
  constructor(ctx, x, y, hue) {
    this.ctx = ctx;
    this.x = x;
    this.y = y;
    this.size = Math.random() * 15 + 1;
    this.speedX = Math.random() * 3 - 1.5;
    this.speedY = Math.random() * 3 - 1.5;
    this.color = `hsl(${hue}, 100%, 50%)`;
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.size > 0.2) this.size -= 0.1;
  }

  draw() {
    this.ctx.fillStyle = this.color;
    this.ctx.beginPath();
    this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}

class ParticlesEffect {
  constructor(ctx, width, height) {
    this.ctx = ctx;
    this.width = width;
    this.height = height;
    this.particles = [];
    this.hue = 0;
  }

  generateParticles(x, y) {
    for (let i = 0; i < 5; i++) {
      this.particles.push(new Particle(ctx, x, y, this.hue));
    }
  }

  draw() {
    for (let i = 0; i < this.particles.length; i++) {
      this.particles[i].update();
      this.particles[i].draw();

      for (let j = i; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy); // Pythagorean theorem

        if (distance < 100) {
          this.ctx.beginPath();
          this.ctx.strokeStyle = this.particles[i].color;
          this.ctx.lineWidth = 0.2;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
          this.ctx.closePath();
        }
      }

      if (this.particles[i].size <= 0.3) {
        this.particles.splice(i, 1);
        i--;
      }
    }
  }

  animate() {
    // Clear the whole canvas every animation
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Add a transparent rectangle the size of the canvas with some opacity (trails effect)
    // this.ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
    // this.ctx.fillRect(0, 0, this.width, this.height);

    this.draw();

    this.hue += 5;

    particlesEffectAnimation = requestAnimationFrame(this.animate.bind(this));
  }
}

function init() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  particlesEffect = new ParticlesEffect(ctx, canvas.width, canvas.height);
  particlesEffect.animate();
}

window.onload = () => {
  canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");

  init();

  /*
  function createGrid() {
    ctx.strokeStyle = "white";
    ctx.beginPath();
    ctx.rect(50, 50, 50, 50);
    ctx.stroke();
  }
	*/
};

window.addEventListener("resize", () => {
  cancelAnimationFrame(particlesEffectAnimation);

  init();
});

window.addEventListener("click", ({ x, y }) => {
  particlesEffect.generateParticles(x, y);
});

window.addEventListener("mousemove", ({ x, y }) => {
  particlesEffect.generateParticles(x, y);
});
