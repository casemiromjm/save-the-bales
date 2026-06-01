import { CGFobject } from "../../lib/CGF.js";

export class MyRock extends CGFobject {
  // could add seed later so each rock has different format
  constructor(scene, sectors, stacks, radius) {
    super(scene);
    this.sectors = sectors;
    this.stacks = stacks;
    this.radius = radius;

    this.initBuffers();
  }

  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords = [];

    for (let stack = 0; stack <= this.stacks; stack++) {
      let stackAngle = Math.PI * stack / this.stacks;
      for (let sector = 0; sector <= this.sectors; sector++) {
        let sectorAngle = 2 * Math.PI * sector / this.sectors;

        let x = Math.sin(stackAngle) * Math.cos(sectorAngle);
        let y = Math.cos(stackAngle);
        let z = Math.sin(stackAngle) * Math.sin(sectorAngle);

        // n between -1 and 1
        let n = this.random(x, y, z) * 2 - 1;

        let noise = 1 + 0.25 * Math.sin(sectorAngle + stackAngle) * n;
        let r = this.radius * noise;

        this.vertices.push(r * x , r * y , r * z);
        this.normals.push(x, y, z);

        this.texCoords.push(sector / this.sectors, stack / this.stacks);
      }
    }

    for (let stack = 0; stack < this.stacks; stack++) {
      for (let sector = 0; sector < this.sectors; sector++) {
        let first = stack * (this.sectors + 1) + sector;
        let second = first + this.sectors  + 1;

        this.indices.push(first, first+1, second);
        this.indices.push(second, first + 1, second + 1);
      }
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }
  random(x, y, z) {
    let value = Math.sin(x * 12.9898 + y * 78.233 + z * 37.719) * 43758.5453;
    return value - Math.floor(value);
  }

}