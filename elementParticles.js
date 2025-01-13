// Particles class
class Particle{
  x = 0; y = 0;     //Position
  vx = 0; vy = 0;   //Velocity
  size = 0;
  lifetime = -1;    //-1 is infinite
  initailLifetime = 100;
  containerElement; //The container to stay bound in
  element;          //The actual element controlled by particle
  boundToContainer = true;

  constructor(x,y,vx,vy,size,lifetime, containerElement, element, boundToContainer=true){
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.size = size;
    this.lifetime = lifetime;
    this.initailLifetime = lifetime;
    this.containerElement = containerElement;
    this.element = element;
    this.boundToContainer = boundToContainer;
  }
  
  reset(){
    this.x = Math.random() * this.containerElement.clientWidth;
    this.y = Math.random() * this.containerElement.clientHeight;
    this.vx = -1 + Math.random()*2; 
    this.vy = -1 + Math.random()*2;
    this.lifetime = this.initailLifetime;
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    
    // Border Collisions if boundToContainer
    if(this.boundToContainer){
      if(this.x < 0){
        this.vx *= -1;
        this.x = 0;
      }
      if(this.y < 0){
        this.vy *= -1;
        this.y = 0;
      }
      if(this.x > this.containerElement.clientWidth - this.size){
        this.vx *= -1;
        this.x = this.containerElement.clientWidth - this.size;
      }
      if(this.y > this.containerElement.clientHeight - this.size){
        this.vy *= -1;
        this.y = this.containerElement.clientHeight - this.size;
      }
    }
    
    // Lifetime and opacity
    if(this.lifetime > 0)
      this.lifetime--;
    
    if(this.lifetime > 0 && this.lifetime < this.initailLifetime)
      this.element.style.opacity = this.lifetime / this.initailLifetime;

    // Update element
    this.element.style.transform = "translate3d(" + this.x + "px, " + this.y +  "px, 0)";
  }
  
}

// Function to spawn particles in a single DOM element, with particleArray Passed by reference
function spawnParticlesInContainer(particleArray, container, particleClassName, 
                                        amountOfParticles, particleSize, particleMaxLifetime = -1, boundToContainer=true, velocityMultiplier=1){
  
  let particleContainer = container;
  
  // Create Particles for particleContainer
  for(var i=0; i<amountOfParticles; i++){
    // Random size
    const size = particleSize * (1 + Math.random(1));
      
    // Create an element inside particleContainer for each particle
    const element = document.createElement('div');
    element.classList.add(particleClassName);
    element.style.width = size + "px";
    element.style.height = size + "px";
    particleContainer.appendChild(element);

    // Push particle to array with reference to elements
    particleArray.push(
      new Particle(Math.random() * particleContainer.clientWidth, Math.random() * particleContainer.clientHeight,
                    (-1 + Math.random()*2)*velocityMultiplier, (-1 + Math.random()*2)*velocityMultiplier,
                    size, (Math.floor(Math.random() * particleMaxLifetime)+(particleMaxLifetime/4)), particleContainer, element, boundToContainer));
  }
 
}


// ************ USAGE **************

// Create single particle array
var particleArray = [];

// Main update function to update all particles' movement, lifetime and element
function update(){
  for(var i=0; i < particleArray.length; i++){
    particleArray[i].update();

    if(particleArray[i].lifetime == 0){ // Remove particles on death
      particleArray[i].element.remove();
      particleArray.splice(i,1);
    }
  }

}

// Run looped update function
const SPEED = 20;
window.onload = function() {            
  setInterval(update, SPEED);
}
