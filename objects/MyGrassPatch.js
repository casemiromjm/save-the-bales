import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyGrass } from "./MyGrass.js";

export class MyGrassPatch extends CGFobject {
  constructor(scene, bladeCount, radius, color) {
    super(scene);

    this.bladeCount = bladeCount;
    this.radius = radius;
    this.color = color;

    this.blade = new MyGrass(scene);
    this.blades = [];

    this.generateBlades();
    this.initMaterial();
  }

  randomBetween(min, max) {
    return min + Math.random() * (max - min);
  }

  generateBlades() {
    for (let i = 0; i < this.bladeCount; i++) {
      let angle = Math.random() * Math.PI * 2;
      let distance = Math.sqrt(Math.random()) * this.radius;
    
      let x = Math.cos(angle) * distance;
      let z = Math.sin(angle) * distance;

      this.blades.push({x: x, z: z,
        rotation: Math.random() * Math.PI * 2,
        height: this.randomBetween(0.6, 1.2),
        width: this.randomBetween(0.7, 1.3),
        inclination: this.randomBetween(-0.25, 0.25)
      });
    }
  }

  initMaterial() {
    this.material = new CGFappearance(this.scene);
    this.material.setAmbient(this.color[0], this.color[1], this.color[2], 1);
    this.material.setDiffuse( this.color[0], this.color[1], this.color[2], 1);
  }

  display() {
    this.material.apply();

    for (let blade of this.blades) {
      this.scene.pushMatrix();

      this.scene.translate(blade.x, 0, blade.z);
      this.scene.rotate(blade.rotation, 0, 1, 0);

      this.scene.rotate(blade.inclination, 1, 0, 0);

      this.scene.scale(blade.width, blade.height, blade.width);
      this.blade.display();

      this.scene.popMatrix();
    }
  }
}