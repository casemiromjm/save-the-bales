import { CGFobject } from "../lib/CGF.js";

export class MyGrass extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
      -0.04, 0.0, 0.0,
       0.04, 0.0, 0.0,
      -0.025, 0.45, 0.04,
       0.025, 0.45, 0.04,
       0.0, 0.8, 0.08
    ];

    this.indices = [
      0, 1, 2,
      1, 3, 2,
      2, 3, 4,
      2, 1, 0,
      2, 3, 1,
      4, 3, 2
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];


    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}