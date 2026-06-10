import { CGFobject } from "../lib/CGF.js";

export class MyCircle extends CGFobject {
  constructor(scene, slices) {
    super(scene);
    this.slices = slices;
    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    /*
     * Front center vertex.
     */
    this.vertices.push(0, 0, 0);
    this.normals.push(0, 0, 1);
    this.texCoords.push(0.5, 0.5);

    /*
     * Front boundary vertices.
     */
    for (let i = 0; i <= this.slices; i++) {
      const angle = (2 * Math.PI * i) / this.slices;

      const x = Math.cos(angle);
      const y = Math.sin(angle);

      this.vertices.push(x, y, 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push((x + 1) / 2, (y + 1) / 2);
    }

    /*
     * Front face.
     */
    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i, i + 1);
    }

    /*
     * Back face.
     * Same geometry, reversed winding.
     * This makes the circle visible from both sides even with CULL_FACE enabled.
     */
    for (let i = 1; i <= this.slices; i++) {
      this.indices.push(0, i + 1, i);
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
}