import { CGFscene, CGFappearance, CGFtexture, CGFcamera, CGFaxis , CGFshader, CGFcameraAxisID  } from "./lib/CGF.js";
import { MyHalfSphere } from "./geometry/MyHalfSphere.js";
import { MyPlane } from "./geometry/MyPlane.js";
import { MyRock } from "./objects/MyRock.js";
import { MyBarn } from "./objects/MyBarn.js";
import { MyFlower } from "./objects/MyFlower.js";
import { MyGrassPatch } from "./objects/MyGrassPatch.js";
import { MyCircle } from "./geometry/MyCircle.js";
import { TerrainSampler } from "./TerrainSampler.js";
import { MyHayBale } from "./objects/MyHayBale.js";
import { MyArrow } from "./objects/MyArrow.js";
import { MyWagon } from "./objects/MyWagon.js";

export class MyScene extends CGFscene {
  constructor() {
    super();
  }

  init(application) {
    super.init(application);

    this.ambientLight = this.lights[0];
    this.sunLight = this.lights[1];

    this.initCameras();
    this.initLights();

    //Background color
    this.gl.clearColor(0.0, 0.0, 0.0, 1.0);

    this.gl.clearDepth(100.0);
    this.gl.enable(this.gl.DEPTH_TEST);
    this.gl.enable(this.gl.CULL_FACE);
    this.gl.depthFunc(this.gl.LEQUAL);
    this.enableTextures(true);

    this.scaleFactor = 1;
    this.heightFactor = 3;

    this.wagonX = 0;
    this.wagonZ = 0;
  
    this.rockCollisionDamage = 10;
    this.rockDamageCooldown = 1000; 
    this.lastRockDamageTime = -Infinity;

    this.hayTouchDistance = 2;
    this.touchingHayBale = null;
    this.hayCollected = 0;

    this.axis = new CGFaxis(this);

    this.skySphere = new MyHalfSphere(this, 50, 50, 50);
    this.ground =  new MyPlane(this, 50);
    this.arrow = new MyArrow(this);
    
    this.rockTexture = new CGFtexture(this, "src/textures/terrain/rock.png");
    this.graniteTexture = new CGFtexture(this, "src/textures/terrain/granite.png");
    this.haywireTexture = new CGFtexture(this, "src/textures/haywire.png");
    this.hayTexture = new CGFtexture(this, "src/textures/hayTexture.png");
    this.hayBaleObject = new MyHayBale(this, this.haywireTexture, this.hayTexture); 
    this.rockMaterial = new CGFappearance(this);
    this.rockMaterial.setAmbient(1, 1, 1, 1.0); 
    this.rockMaterial.setTexture(this.rockTexture);
    this.graniteMaterial = new CGFappearance(this);
    this.graniteMaterial.setAmbient(1, 1, 1, 1.0); 
    this.graniteMaterial.setTexture(this.graniteTexture);
    this.rockTypes = [ this.rockMaterial, this.graniteMaterial  ];

    this.flowers = [];
    this.grassPatches = [];
    this.rocks = [];

    this.flowerZones = [
      { x: -28, z: -28, radius: 6 , count: 8 },
      { x: 30, z: -25, radius: 6 , count: 8 },
      { x: -35, z: 15, radius: 6 , count: 7 },
      { x: 27, z: 33, radius: 5 , count: 5 },
      { x: 0, z: 37, radius: 5 , count: 5 }
    ];

    this.grassZones = [
      { x: -28, z: -28, radius: 5, count: 3 },
      { x: 30, z: -28, radius: 5, count: 3 },
      { x: -30, z: 12, radius: 5, count: 3 },
      { x: 34, z: 5 , radius: 2, count: 3 },
      { x: 0, z: 40, radius: 5, count: 5 }
    ];

    this.rockZones = [
      { x: -5,   z: 5, radius: 1, count: 1, road: true },
      { x: 20,  z: 20, radius: 1, count: 1, road: true },
      { x: -22, z: 38, radius: 1, count: 1, road: true },
      { x: 15,  z: -30, radius: 1, count: 1, road: true },

      { x: 2,  z: -40, radius: 1, count: 1, road: false },
    ];
    
    this.hayBalePositions = [
      { x: 10, z: 5 },
      { x: 12, z: -22 },
      { x: -32, z: -8 },
      { x: 25, z: 20 },
      { x: 5, z: 20 },
      { x: -8, z: 10 },
      { x: 35, z: -13 },
      { x: -13, z: 28 }
    ];

    this.activeHayBales = [];
    this.carriedHayBales = 0;   
    this.maxCarriedHayBales = 2;
    this.pKeyWasPressed = false;
    this.lKeyWasPressed = false;
    this.lastCollectedHayPosition = null;
     
    this.baseSkyTexture = new CGFtexture(this, "src/textures/sky/clearSky.jpg");
    this.skyCloudTexture = new CGFtexture(this, "src/textures/sky/skyCloudNoise.jpg");
    this.sunTexture = new CGFtexture(this, "src/textures/sky/sun.png");
    this.grassTexture = new CGFtexture(this,"src/textures/terrain/grass_official.png");
    this.dirtTexture = new CGFtexture(this, "src/textures/terrain/dirt3.jpg");
    this.roadMaskTexture = new CGFtexture(this, "src/textures/terrain/roadMask6.png");
  
    this.skySphereMaterial = new CGFappearance(this);
    this.skySphereMaterial.setAmbient(1, 1, 1, 1.0); 
    this.skySphereMaterial.setDiffuse(0, 0, 0, 1);
    this.skySphereMaterial.setSpecular(0, 0, 0, 1);
    this.skySphereMaterial.setShininess(10.0);
    this.skySphereMaterial.setTexture(this.baseSkyTexture);
    this.skySphereMaterial.setTextureWrap('REPEAT', 'REPEAT');

    // shaders

    this.skyShader = new CGFshader(this.gl, "src/shaders/sky/sky.vert" , "src/shaders/sky/sky.frag");
    this.terrainShader = new CGFshader(this.gl, "src/shaders/terrain/terrain.vert" , "src/shaders/terrain/terrain.frag");
    this.windShader = new CGFshader(this.gl, "src/shaders/wind/wind.vert" , "src/shaders/wind/wind.frag");
    this.arrowShader = new CGFshader(this.gl, "src/shaders/arrow/arrow.vert" , "src/shaders/arrow/arrow.frag");

    this.skyShader.setUniformsValues({ 
      uSampler1 : 0,
      cloudTexture: 1,
      sunTexture: 2,
      timeFactor: 0,
      uSunCenter: [this.sunU, this.sunV]
    });
    this.terrainSize = 100;
    this.randomOffsetX = Math.random() * 1000.0;
    this.randomOffsetY = Math.random() * 1000.0;
    

    this.terrainSampler = new TerrainSampler(this.terrainSize,this.heightFactor,this.randomOffsetX,this.randomOffsetY);
    this.generateFlowers();
    this.generateGrassPatches();
    this.generateRocks();
    this.generateHayBales();

    this.terrainShader.setUniformsValues({
      uSampler1 : 0,
      dirtTexture: 2,
      roadMask: 3,
      heightFactor: this.heightFactor,
      noiseOffset: [this.randomOffsetX, this.randomOffsetY],
    });

    this.windShader.setUniformsValues({
      timeFactor: 0,
      grassColor: [0.0,0.7,0.0]
    })

    this.arrowShader.setUniformsValues({
      timeFactor: 0,
      arrowColor: [0.0,0.75,0.0]
    })
    this.pulsatingShader = new CGFshader(this.gl, "src/shaders/pulsating/pulsating.vert", "src/shaders/pulsating/pulsating.frag")
    this.pulsatingShader.setUniformsValues({
      timeFactor: 0,
      circleColor: [0.8, 0.8, 0.0, 0.4],
    });

    // barn
    this.woodTexture = new CGFtexture(this, "src/textures/barn/woodPlanks.jpg");
    this.barnFrontTexture = new CGFtexture(this, "src/textures/barn/barnFront.jpg");
    this.barnRoofTexture = new CGFtexture(this, "src/textures/barn/barnRoof.jpg");
    this.barnSideTexture = new CGFtexture(this, "src/textures/barn/barnSide.jpg");
    
    this.barn = new MyBarn(this, this.woodTexture, this.barnFrontTexture, this.barnSideTexture, this.barnRoofTexture);

    // drop zone area
    this.dropZone = new MyCircle(this, 30);

    // wagon
    this.wagon = new MyWagon(this, {
      wagonLength : 4,
      wagonWidth : 2,
      bedHeight : 1.0,
      wheelRadius : 0.8,
      spokeCount : 8,
      coverHeight : 1.5,
    })

    this.wagonX = 0;
    this.wagonZ = 5;
    this.wagonDir = 0;
    this.wagonSpeed = 0;

    const MAX_SPEED = 7.0;
    const ACCEL = 3.0;
    const DECEL = 4.0;
    const FRICTION = 1.5;
    const MAX_STEER = Math.PI / 4;
    const STEER_SPD = 1.5;
    const STEER_RTN = 2.5;

    this.wagonMaxSpeed = MAX_SPEED;
    this.wagonAccel = ACCEL;
    this.wagonDecel = DECEL;
    this.wagonFriction = FRICTION;
    this.wagonMaxSteer = MAX_STEER;
    this.wagonSteerSpd = STEER_SPD;
    this.wagonSteerRtn = STEER_RTN;

    // game mechanics
    this.health = 100;
    this.instantDamage = 0; 
    this.lastDamage = 0;
    this.collisionCount = 0;
    this.instantHeal = 0; 
    this.lastHeal = 0;
    this.totalBalesDropped = 0;
    this.gameScore = 0;
    
    this.startTime = null;
    this.lastTime = null;

    // TODO: WAGON DETECTION IN DROP ZONE
    this.isWagonInDropZone = false;

    this.setUpdatePeriod(50);

    this.pausedAt = null;
    this.totalPausedTime = 0;
    // function to avoid the hp decay going crazy when not focusing the tab
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.lastTime = null; // reset so the next frame doesn't compute a huge delta
        this.pausedAt = performance.now();
      } else if (this.pausedAt) {
        this.totalPausedTime += performance.now() - this.pausedAt;
        this.pausedAt = null;
      }
    });

  }

  initLights() {
    // Fill light (ambient)
    this.ambientLight.setPosition(15, 2, 5, 1);
    this.ambientLight.setAmbient(0.3, 0.3, 0.3, 1);    // low ambient light to show the sun light
    this.ambientLight.setDiffuse(0, 0, 0, 1);
    this.ambientLight.setSpecular(0, 0, 0, 1);
    this.ambientLight.enable();
    this.ambientLight.update();

    // Sun directional light
    // these magic coordinates comes from the sky.frag. sun is drawn at u = 0.75, v = 0.75 on the MyHalfSphere
    this.sunU = 0.75;
    this.sunV = 0.75;

    let sectorAngle = this.sunU * 2 * Math.PI; 
    let stackAngle = Math.PI / 2 - this.sunV * (Math.PI / 2);
    
    // Calculate direction vector towards the sun
    let xz = Math.cos(stackAngle);
    let y = Math.sin(stackAngle);
    let x = xz * Math.cos(sectorAngle);
    let z = xz * Math.sin(sectorAngle);
    
    this.sunLight.setPosition(x, y, z, 0);
    this.sunLight.setAmbient(0, 0, 0, 1);
    this.sunLight.setDiffuse(1.0, 0.95, 0.8, 1.0); // warm sunlight color
    this.sunLight.setSpecular(1.0, 1.0, 1.0, 1.0);
    this.sunLight.enable();
    this.sunLight.update();
  }

  updateSunLight() {
    // Recalculate directional light
    let sectorAngle = this.sunU * 2 * Math.PI; 
    let stackAngle = Math.PI / 2 - this.sunV * (Math.PI / 2);
    let xz = Math.cos(stackAngle);
    let y = Math.sin(stackAngle);
    let x = xz * Math.cos(sectorAngle);
    let z = xz * Math.sin(sectorAngle);
    this.sunLight.setPosition(x, y, z, 0);
  }

  initCameras() {
    this.camera = new CGFcamera(
      0.4,
      0.1,
      500,
      vec3.fromValues(50, 50, 50), 
      vec3.fromValues(0, 0, 0)     
    );
    this._cameraOffset = vec3.fromValues(0,30,50);
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  randomPointInZone(zone) {
    let angle = this.randomBetween(0, Math.PI * 2);
    let distance = Math.sqrt(Math.random()) * zone.radius;
    return { x: zone.x + Math.cos(angle) * distance, z: zone.z + Math.sin(angle) * distance};
  }

  generateFlowers() {
    
    for (let i = 0; i < this.flowerZones.length; i++) {
      let flowerCount = this.flowerZones[i].count;
      for (let j = 0; j < flowerCount; j++) {
        let point = this.randomPointInZone(this.flowerZones[i]);

        let x = point.x;
        let z = point.z;
        let y = this.terrainSampler.getHeightAt(x, z) - 0.2;

        let petalCount = Math.floor(this.randomBetween(4, 8));
        let stemHeight = this.randomBetween(0.8, 1.0);
        let stemRadius = this.randomBetween(0.025, 0.05);
        let petalLength = this.randomBetween(0.25, 0.5);
        let stemColor = [ this.randomBetween(0.05, 0.15), this.randomBetween(0.35, 0.65), this.randomBetween(0.05, 0.15)];
        let petalColor = [ this.randomBetween(0.3, 0.8), this.randomBetween(0.3, 0.8), this.randomBetween(0.3, 0.8)];
        let centerColor = [ this.randomBetween(0.8, 1.0), this.randomBetween(0.5, 1.0), this.randomBetween(0.05, 0.2)];

        let flower = new MyFlower( this, petalCount, stemHeight, stemRadius, petalLength, stemColor, petalColor, centerColor);

        this.flowers.push({ obj: flower, x, y, z, scale: this.randomBetween(0.8, 1.4)
        });
      }
    }
  }

  generateGrassPatches() {    
    for (let i = 0 ; i < this.grassZones.length ; i++) {
      let point = this.randomPointInZone(this.grassZones[i]);
      let x = point.x;
      let z = point.z;
      let y = this.terrainSampler.getHeightAt(x, z);  
      
      let bladeCount = Math.floor(this.randomBetween(25, 50));
      let patchRadius = this.randomBetween(5.0, 8.0);
      
      let isDeadGrass = Math.random() < 0.35;
      let grassColor;

      if (isDeadGrass) {
        grassColor = [ this.randomBetween(0.25, 0.5), this.randomBetween(0.35, 0.8), this.randomBetween(0.10, 0.18)];
      } 
      else {
        grassColor = [ this.randomBetween(0.05, 0.15),this.randomBetween(0.35, 0.8), this.randomBetween(0.05, 0.15)];
      }
      let grassPatch = new MyGrassPatch( this, bladeCount, patchRadius , grassColor);
      
      this.grassPatches.push({ obj: grassPatch, x, y, z, scale: this.randomBetween(0.8, 1.2), color: grassColor});
    
    }
  }

  generateRocks() {
    for (let i = 0; i < this.rockZones.length; i++) {
      let zone = this.rockZones[i];
      for (let j = 0; j < zone.count; j++) {
        let point = this.randomPointInZone(zone);

        let x = point.x;
        let z = point.z;
        let sx = this.randomBetween(0.3, 1.0);
        let sy = this.randomBetween(0.3, 1.0);
        let sz = this.randomBetween(0.8, 1.0);
        let y;
        if (zone.road) {
          y = sy * 0.5;
        } else {
          y = this.terrainSampler.getHeightAt(x, z) + sy * 0.5 - 0.2;
        }
        let material = Math.floor(this.randomBetween(0, this.rockTypes.length));

        this.rocks.push({ obj: new MyRock(this, 16, 8, 1), x, y, z, sx, sy, sz, material});
      }
    }
  }

  generateHayBales() {
    this.activeHayBales = [];
  
    while (this.activeHayBales.length < 2) {
      this.spawnOneHayBale();
    }
  }

  spawnOneHayBale() {
    while (this.activeHayBales.length < 2) {
      let randomIndex = Math.floor(this.randomBetween(0, this.hayBalePositions.length));
      let position = this.hayBalePositions[randomIndex];

      let alreadyUsed = false;

      for (let bale of this.activeHayBales) {
        if (!bale.collected && bale.x == position.x && bale.z == position.z) {
          alreadyUsed = true;
          break;
        }
      }

      if (alreadyUsed) {continue;}

      let x = position.x;
      let z = position.z;
      let y = this.terrainSampler.getHeightAt(x, z);

      this.activeHayBales.push({ x: x, y: y, z: z, rotation: this.randomBetween(0, Math.PI * 2), collected: false});
      return;
    }
  }

  removeCollectedHayBales() {
    let remainingBales = [];

    for (let bale of this.activeHayBales) {
      if (!bale.collected) {
        remainingBales.push(bale);
      }
    }

    this.activeHayBales = remainingBales;
  } 
  displayCarriedHayBales() {
    for (let i = 0; i < this.carriedHayBales; i++) {
      this.pushMatrix();
        let offsetX = 0.0;
        let offsetY = this.wagon.wheelRadius + 0.5;
        let offsetZ;
        if (i == 0){ offsetZ = -0.5;} 
        else { offsetZ = 0.5;}
        this.translate(offsetX, offsetY, offsetZ);
        this.rotate(Math.PI / 2, 0, 1, 0);
        this.scale(0.75, 0.75, 0.75);
        this.hayBaleObject.display();

      this.popMatrix();
    }
  }
  checkRockCollisions(t) {
    for (let rock of this.rocks) {
      let dx = this.wagonX - rock.x;
      let dz = this.wagonZ - rock.z;
      let distance = Math.sqrt(dx * dx + dz * dz);

      // The damage radius is slightly larger (+0.2) than the physical collision radius 
      // used in isCollidingWithAnyRock, ensuring the wagon takes damage when it hits the obstacle.
      let damageRadius = Math.max(rock.sx, rock.sz) * 1.5 + 0.2;

      if (distance <= damageRadius) {
        if (t - this.lastRockDamageTime >= this.rockDamageCooldown) {
          this.health -= this.rockCollisionDamage;
          this.instantDamage = this.rockCollisionDamage;
          this.lastDamage = this.rockCollisionDamage;
          this.collisionCount++;
          this.lastRockDamageTime = t;
        }
        return;
      }
    }

    this.instantDamage = 0;
  }

  checkHayContact() {
    this.touchingHayBale = null;
    this.closestHayBale = this.getClosestHayBale();

    if (this.closestHayBale === null) {
      return;
    }
    let dx = this.wagonX - this.closestHayBale.x;
    let dz = this.wagonZ - this.closestHayBale.z;
    let distance = Math.sqrt(dx * dx + dz * dz);

    if (distance < this.hayTouchDistance) {
      this.touchingHayBale = this.closestHayBale;
    }

  }

  getClosestHayBale() {
    let closest = null;
    let closestDistance = Infinity;
    
    for (let bale of this.activeHayBales) {
    
      let dx = this.wagonX - bale.x;
      let dz = this.wagonZ - bale.z;
      let distance = Math.sqrt(dx * dx + dz * dz);
    
      if (distance < closestDistance) {
        closestDistance = distance;
        closest = bale;
      }
    }
  
    return closest;
  }

  checkHayPickup() {
    if (!this.gui || !this.gui.isKeyPressed) return;

    let pIsPressed = this.gui.isKeyPressed("KeyP");

    if (pIsPressed && !this.pKeyWasPressed) {
      if (this.touchingHayBale !== null && this.carriedHayBales < this.maxCarriedHayBales) {
        let collectedX = this.touchingHayBale.x;
        let collectedZ = this.touchingHayBale.z;
        this.lastCollectedHayPosition = { x: collectedX, z: collectedZ};
        this.touchingHayBale.collected = true;

        this.hayCollected++;
        this.carriedHayBales++;

        this.removeCollectedHayBales();
        this.generateHayBales();

        this.touchingHayBale = null;
        this.closestHayBale = this.getClosestHayBale();
      }
    }

    this.pKeyWasPressed = pIsPressed;
  }

  checkHayDrop() {
    if (!this.gui || !this.gui.isKeyPressed) return;

    let lIsPressed = this.gui.isKeyPressed("KeyL");

    if (lIsPressed && !this.lKeyWasPressed) {
      if (this.isWagonInDropZone && this.carriedHayBales > 0) {
        let deliveredBales = this.carriedHayBales;

        this.totalBalesDropped += deliveredBales;

        this.instantHeal = deliveredBales * 10;
        this.lastHeal = this.instantHeal;
        this.health = Math.min(100, this.health + this.instantHeal);

        this.carriedHayBales = 0;
      }
    }

    this.lKeyWasPressed = lIsPressed;
  }

  handleWagonInput(dt) {
    // Speed Control
    if(this.gui.isKeyPressed("KeyW")){
      this.wagonSpeed = Math.min(this.wagonSpeed + this.wagonAccel * dt, this.wagonMaxSpeed);
    } else if(this.gui.isKeyPressed("KeyS")){
      this.wagonSpeed = Math.max(this.wagonSpeed - this.wagonDecel * dt, 0);
    } else {
      this.wagonSpeed = Math.max(this.wagonSpeed - this.wagonFriction * dt, 0);
    }

    // Steering Control
    if(this.gui.isKeyPressed("KeyA")){
      this.wagon.steerAngle = Math.min(this.wagon.steerAngle + this.wagonSteerSpd * dt, this.wagonMaxSteer);
    } else if(this.gui.isKeyPressed("KeyD")){
      this.wagon.steerAngle = Math.max(this.wagon.steerAngle - this.wagonSteerSpd * dt, -this.wagonMaxSteer);
    } else {
      if(this.wagon.steerAngle > 0)
        this.wagon.steerAngle = Math.max(this.wagon.steerAngle - this.wagonSteerRtn * dt, 0);
      else if (this.wagon.steerAngle < 0)
        this.wagon.steerAngle = Math.min(this.wagon.steerAngle + this.wagonSteerRtn * dt, 0);
    }

    if (this.gui.isKeyPressed("KeyR")) {
      this.resetWagon();
    }
  }

  isCollidingWithAnyRock(x, z) {

    for (let rock of this.rocks) {
      let dx = x - rock.x;
      let dz = z - rock.z;
      let distance = Math.sqrt(dx * dx + dz * dz);

      let rockRadius = Math.max(rock.sx, rock.sz) * 1.5;

      if (distance < rockRadius) {
        return true;
      }
    }
    return false;
  }

  isCollidingWithBarn(x, z) {
    // this solution is kind of sloppy, but works

    // Barn is at (0, 0, -10) with a base scale of (6, 4, 6)
    // We add a padding of ~1.5 to account for the wagon's own width/length
    const minX = -4.5;
    const maxX = 4.5;
    const minZ = -14.5;
    const maxZ = -5.5;

    return (x >= minX && x <= maxX && z >= minZ && z <= maxZ);
  }

  applyWagonPhysics(dt) {
    if(this.wagonSpeed > 0){
      const wheelBase = this.wagon.wagonLength * 0.7;
      const turnRate = this.wagonSpeed * Math.tan(this.wagon.steerAngle) / wheelBase;

      let nextDir = this.wagonDir + turnRate * dt;
      let nextX = this.wagonX + Math.cos(nextDir) * this.wagonSpeed * dt;
      let nextZ = this.wagonZ - Math.sin(nextDir) * this.wagonSpeed * dt;
      // Check if the next position is still on the dirt path and not inside the barn or rocks
      if (this.terrainSampler.isRoadAt(nextX, nextZ) 
          && !this.isCollidingWithBarn(nextX, nextZ) 
          && !this.isCollidingWithAnyRock(nextX, nextZ)) {
        this.wagonDir = nextDir;
        this.wagonX = nextX;
        this.wagonZ = nextZ;
        this.wagon.wheelRotation -= (this.wagonSpeed * dt) / this.wagon.wheelRadius;
      } else {
        // Crash/stop the wagon if trying to leave the path or hitting an obstacle
        this.wagonSpeed = 0;
        this.resetWagon();
      }
    }
  }

  resetWagon() {
    this.wagonX = 0;
    this.wagonZ = 5;
    this.wagonDir = 0;
    this.wagonSpeed = 0;
    this.wagon.steerAngle = 0;
    this.wagon.wheelRotation = 0;
  }

  checkKeys(dt){
    if(this.gui === undefined) return;

    this.handleWagonInput(dt);
    this.applyWagonPhysics(dt);
  }

  checkDropZone() {
    // The drop zone is translated to (0, y, -3) and scaled by 4.
    // Since MyCircle has a unit radius of 1, the world radius is 4.
    let dx = this.wagonX - 0;
    let dz = this.wagonZ - (-3);
    let distance = Math.sqrt(dx * dx + dz * dz);

    this.isWagonInDropZone = (distance <= 4);
  }

  update(t) {
    // used for time-sensitve shader updates
    let time = (t / 100) % 100;

    // Sun Movement
    // A half-orbit (daytime only) takes 60 seconds (60000ms)
    let cycleProgress = (t / 60000) % 1.0; 

    // sunU goes from 0.75 (East) down to 0.25 (West) over the cycle.
    // It resets instantly back to 0.75 when the cycle restarts.
    this.sunU = 0.75 - (cycleProgress * 0.5);

    // sunV uses a sine wave to form an arc:
    // cycleProgress=0.0 -> sunV=1.0 (sunrise, horizon)
    // cycleProgress=0.5 -> sunV=0.0 (noon, zenith)
    // cycleProgress=1.0 -> sunV=1.0 (sunset, opposite horizon)
    this.sunV = 1.0 - Math.sin(cycleProgress * Math.PI);

    this.updateSunLight();

    this.skyShader.setUniformsValues({ 
      timeFactor: time,
      uSunCenter: [this.sunU, this.sunV]
    });
    this.windShader.setUniformsValues({ timeFactor: time });
    this.arrowShader.setUniformsValues({ timeFactor: time });
    this.pulsatingShader.setUniformsValues({ timeFactor: time });

    // game mechanics
    if (!this.startTime) {
      this.startTime = t;
      this.lastTime = t;
    }

    const deltaTime = (t - this.lastTime) / 1000;

    if (this.health > 0) {
      this.gameScore = Math.floor((t-this.startTime - this.totalPausedTime) / 1000);

      // reduce health -> a longer time alive means the player keep healing (taking bales)

      if (!this.lastTime) {
        this.lastTime = t;
      } else {
        let deltaTime = t - this.lastTime;
        deltaTime = Math.min(deltaTime, 200);
        this.checkRockCollisions(t);
        this.checkHayContact();
        this.checkDropZone();
        this.checkHayPickup();
        this.checkHayDrop();
        let hpLossThisFrame = 1 * (deltaTime / 1000);
        this.health -= hpLossThisFrame;

        this.lastTime = t;
      }
    } else {
      this.health = 0;
      
      // game over popup in html
      const gameOverOverlay = document.getElementById('gameOverOverlay');
      if (gameOverOverlay && gameOverOverlay.style.display !== 'flex') {
        document.getElementById('finalScore').innerText = this.gameScore;
        document.getElementById('finalBales').innerText = this.totalBalesDropped;
        gameOverOverlay.style.display = 'flex';
      }

      console.log("game over. score: " + this.gameScore);
    }

    this.lastTime = t;
    this.checkKeys(deltaTime);
    const wy = this.terrainSampler.getHeightAt(this.wagonX, this.wagonZ);
    const target = vec3.fromValues(this.wagonX, wy + 1.5, this.wagonZ);
    const dist = 80;
    const height = 35;
    const eye = vec3.fromValues(
      this.wagonX - Math.cos(this.wagonDir) * dist,
      wy + height,
      this.wagonZ + Math.sin(this.wagonDir) * dist
    );
    this.camera.setTarget(target);
    this.camera.setPosition(eye);
    vec3.sub(this._cameraOffset, eye, target);
    this.wagon.update(deltaTime, this.wagonSpeed, this.wagonMaxSpeed);
  }

  display() {
    // Clear image and depth buffer every time we update the scene
    this.gl.viewport(0, 0, this.gl.canvas.width, this.gl.canvas.height);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    // Initialize Model-View matrix as identity (no transformation)
    this.updateProjectionMatrix();
    this.loadIdentity();

    // Apply transformations corresponding to the camera position relative to the origin
    this.applyViewMatrix();

    // Update all lights used
    this.ambientLight.update();  // ambient
    this.sunLight.update();  // sun

    this.pushMatrix();
      this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
      this.setActiveShader(this.skyShader);
      this.baseSkyTexture.bind(0);
      this.skyCloudTexture.bind(1);
      this.sunTexture.bind(2);
      this.skySphereMaterial.apply();
      this.skySphere.display();
      this.setActiveShader(this.defaultShader);
    this.popMatrix();
    
    this.pushMatrix();
      this.rotate(-Math.PI/2 , 1 , 0 ,0);
      this.scale(this.scaleFactor, this.scaleFactor, this.scaleFactor);
      this.scale(100,100,1);
      this.setActiveShader(this.terrainShader);
      this.grassTexture.bind(0);
      this.dirtTexture.bind(2);
      this.roadMaskTexture.bind(3);
      this.ground.display();
      this.setActiveShader(this.defaultShader);
    this.popMatrix();

    for (let rock of this.rocks) {
      this.pushMatrix();
        this.translate(rock.x, rock.y, rock.z);
        this.scale(rock.sx, rock.sy, rock.sz);
        this.rockTypes[rock.material].apply();
        rock.obj.display();
      this.popMatrix();
    }

    for (let flower of this.flowers) {
      this.pushMatrix();
        this.translate(flower.x, flower.y, flower.z);
        this.scale(flower.scale, flower.scale, flower.scale);
        flower.obj.display();
      this.popMatrix();
    }

    for (let grass of this.grassPatches) {
      this.pushMatrix();
        this.setActiveShader(this.windShader);
        this.windShader.setUniformsValues({ grassColor: grass.color});
        this.translate(grass.x, grass.y, grass.z);
        this.scale(grass.scale, grass.scale *2, grass.scale);
        grass.obj.display();
        this.setActiveShader(this.defaultShader);
      this.popMatrix();
    }

    for (let bale of this.activeHayBales) {
      if (bale.collected) continue;
      this.pushMatrix();
        this.translate(bale.x, 1, bale.z);
        this.rotate(bale.rotation, 0, 1, 0);
        this.hayBaleObject.display();
      this.popMatrix();
    }

    let arrowTarget = this.closestHayBale;
    if (arrowTarget !== null && !arrowTarget.collected) {
      this.pushMatrix();
        this.setActiveShader(this.arrowShader);
        if (this.touchingHayBale == arrowTarget) {
          this.arrowShader.setUniformsValues({ arrowColor: [0.0, 1.0, 0.0]});
        } else {
          this.arrowShader.setUniformsValues({ arrowColor: [1.0, 0.8, 0.0]});
        }
        this.translate(arrowTarget.x, 3.0 , arrowTarget.z);
        this.arrow.display();
        this.setActiveShader(this.defaultShader);
      this.popMatrix();
    }

    // barn
    this.pushMatrix();
      // barn position
      this.translate(0, 0, -10);
      this.barn.display();
    this.popMatrix();

    // drop zone
    this.pushMatrix();
      this.translate(0, 0.02, -3);
      this.rotate(-Math.PI / 2, 1, 0 , 0);
      this.scale(4, 4, 1);
      this.setActiveShader(this.pulsatingShader);

      if (this.isWagonInDropZone) {
        // green color when wagon in drop zone
        this.pulsatingShader.setUniformsValues({ circleColor: [0.0, 1.0, 0.0, 0.4] })
      } else {
        // yellow otherwise
        this.pulsatingShader.setUniformsValues({ circleColor: [0.8, 0.8, 0.0, 0.4] })
      }

      // blending to make drop zone more natural
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);

      this.dropZone.display();
      this.gl.disable(this.gl.BLEND);
      this.setActiveShader(this.defaultShader);
    this.popMatrix();

    this.pushMatrix();
      const wy = this.terrainSampler.getHeightAt(this.wagonX, this.wagonZ);
      this.translate(this.wagonX, wy, this.wagonZ);
      this.rotate(this.wagonDir, 0, 1, 0);
      this.wagon.display();
      this.displayCarriedHayBales();
    this.popMatrix();
  }
}