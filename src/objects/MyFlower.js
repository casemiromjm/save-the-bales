import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyCylinder } from "../geometry/MyCylinder.js";
import { MyCircle } from "../geometry/MyCircle.js";
import { MyPetal } from "./MyPetal.js";

export class MyFlower extends CGFobject {
  constructor(scene, petalCount, stemHeight, stemRadius, petalLength, stemColor, petalColor, centerColor) {
    super(scene);

    this.petalCount = petalCount;
    this.stemHeight = stemHeight;
    this.stemRadius = stemRadius;
    this.petalLength = petalLength;

    this.petalWidth = petalLength * 0.25;
    this.centerRadius = petalLength * 0.5;
    this.petalDistance = this.centerRadius + this.petalLength * 0.01;

    this.stemColor = stemColor;
    this.petalColor = petalColor;
    this.centerColor = centerColor;

    this.stem = new MyCylinder(scene, 12, 1);
    this.petal = new MyPetal(scene, 32);
    this.center = new MyCircle(scene, 32);

    this.initMaterials();
  }

  initMaterials() {
    this.stemMaterial = new CGFappearance(this.scene);
    this.stemMaterial.setAmbient(this.stemColor[0], this.stemColor[1], this.stemColor[2], 1);
    this.stemMaterial.setDiffuse(this.stemColor[0], this.stemColor[1], this.stemColor[2], 1);
    
    this.petalMaterial = new CGFappearance(this.scene);
    this.petalMaterial.setAmbient(this.petalColor[0], this.petalColor[1], this.petalColor[2], 1);
    this.petalMaterial.setDiffuse(this.petalColor[0], this.petalColor[1], this.petalColor[2], 1);

    this.centerMaterial = new CGFappearance(this.scene);
    this.centerMaterial.setAmbient(this.centerColor[0], this.centerColor[1], this.centerColor[2], 1);
    this.centerMaterial.setDiffuse(this.centerColor[0], this.centerColor[1], this.centerColor[2], 1);
  }

  display() {
    
    this.scene.pushMatrix();
    this.scene.rotate(-Math.PI / 2, 1, 0, 0);
    this.scene.scale(this.stemRadius, this.stemRadius, this.stemHeight);
    this.stemMaterial.apply();
    this.stem.display();
    this.scene.popMatrix();

    
    this.scene.pushMatrix();

    this.scene.translate(0, this.stemHeight, 0.0);

    for (let i = 0; i < this.petalCount; i++) {
      let angle = (2 * Math.PI * i) / this.petalCount;

      this.scene.pushMatrix();
      this.scene.rotate(-Math.PI / 2, 1 , 0, 0);
      this.scene.rotate(angle, 0, 0, 1);
      this.scene.translate(0, this.petalDistance, 0);
      this.scene.scale(this.petalWidth, this.petalLength, 1);

      this.petalMaterial.apply();
      this.petal.display();

      this.scene.popMatrix();
    }
    this.scene.pushMatrix();
    this.scene.translate(0,0.01,0);
    this.scene.rotate(-Math.PI / 2, 1 , 0, 0);
    this.scene.scale(this.centerRadius, this.centerRadius,1);

    this.centerMaterial.apply();
    this.center.display();

    this.scene.popMatrix();

    this.scene.popMatrix();
  }
}