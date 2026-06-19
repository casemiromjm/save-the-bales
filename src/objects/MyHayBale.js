import { CGFobject } from "../lib/CGF.js";
import { MyUnitCubeQuad } from "../geometry/MyUnitCubeQuad.js";

export class MyHayBale extends CGFobject {
  constructor(scene, firstHayTexture, secHayTexture) {
    super(scene);

    this.bale = new MyUnitCubeQuad(
      scene,
      firstHayTexture, // top
      firstHayTexture, // front
      secHayTexture, // right
      firstHayTexture, // back
      secHayTexture, // left
      firstHayTexture  // bottom
    );
  }

  display() {
    this.scene.pushMatrix();
    this.scene.scale(1.8, 0.8, 1.0);

    this.bale.display();

    this.scene.popMatrix();
  }
}