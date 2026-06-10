// geometry/MyTriangle.js

import { CGFobject } from "../lib/CGF.js";

export class MyTriangle extends CGFobject {
  constructor(scene) {
    super(scene);
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [
       -1.0,  -1.0, 0.0,  
      1.0, -1.0, 0.0,  
       -1.0, 1.0, 0.0   
    ];

    this.indices = [
      0, 1, 2,
      0, 2, 1 
    ];

    this.normals = [
      0, 0, 1,
      0, 0, 1,
      0, 0, 1
    ];

    this.texCoords = [
      0.5, 0.0,
      0.0, 1.0,
      1.0, 1.0
    ];

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}