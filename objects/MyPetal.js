import { CGFobject } from "../lib/CGF.js";

export class MyPetal extends CGFobject {
  constructor(scene, slices) {
    super(scene);
    this.slices = slices;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];

    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    for (let i = 0; i <= this.slices; i++) {
      let angle = (2 * Math.PI * i) / this.slices;

      let x = Math.cos(angle);
      let y = Math.sin(angle);

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
    }
    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
      this.indices.push(0, i + 1, i);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}