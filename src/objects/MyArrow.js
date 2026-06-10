import { CGFobject } from "../lib/CGF.js";
import { MyQuad } from "../geometry/MyQuad.js";
import { MyTriangle } from "../geometry/MyTriangle.js";

export class MyArrow extends CGFobject {
  constructor(scene) {
    super(scene);

    this.body = new MyQuad(scene);
    this.head = new MyTriangle(scene);
  }

  display() {
    this.scene.pushMatrix();
      this.scene.translate(0, 1.5, 0);
      this.scene.scale(0.25, 2.0, 1.0);
      this.body.display();
    this.scene.popMatrix();

    this.scene.pushMatrix();
      
      this.scene.translate(0, 1.0, 0);
      this.scene.scale(0.7, 0.7, 1.0);
      this.scene.rotate(Math.PI /4,0,0,1);
      this.head.display();
    this.scene.popMatrix();
  }
}