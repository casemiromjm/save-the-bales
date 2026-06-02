import { CGFobject } from "../../lib/CGF.js";

export class MyHalfPrismOpen extends CGFobject{
    constructor(scene, slices, stacks){
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }

    initBuffers(){
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        const alphaAng = Math.PI / this.slices;

        for(let i = 0; i < this.stacks; i++){
            let z1 = i / this.stacks;
            let z2 = (i + 1) / this.stacks;
            for(let j = 0; j < this.slices; j++){
                let a0 = j * alphaAng;
                let a1 = (j + 1) * alphaAng;
                let halfAng = (a0 + a1) / 2;
                let nx = Math.cos(halfAng);
                let ny = Math.sin(halfAng);

                let base = this.vertices.length / 3;

                this.vertices.push(Math.cos(a0), Math.sin(a0), z1);
                this.vertices.push(Math.cos(a1), Math.sin(a1), z1);
                this.vertices.push(Math.cos(a0), Math.sin(a0), z2);
                this.vertices.push(Math.cos(a1), Math.sin(a1), z2);

                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);

                this.indices.push(base, base+1, base+2);
                this.indices.push(base+1, base+3, base+2);
            }
        }

        for(let i = 0; i < this.stacks; i++){
            let z1 = i / this.stacks;
            let z2 = (i + 1) / this.stacks;
            for(let j = 0; j < this.slices; j++){
                let a0 = j * alphaAng;
                let a1 = (j + 1) * alphaAng;
                let halfAng = (a0 + a1) / 2;
                let nx = -Math.cos(halfAng);
                let ny = -Math.sin(halfAng);

                let base = this.vertices.length / 3;

                this.vertices.push(Math.cos(a0), Math.sin(a0), z1);
                this.vertices.push(Math.cos(a1), Math.sin(a1), z1);
                this.vertices.push(Math.cos(a0), Math.sin(a0), z2);
                this.vertices.push(Math.cos(a1), Math.sin(a1), z2);

                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);
                this.normals.push(nx, ny, 0);

                this.indices.push(base, base+2, base+1);
                this.indices.push(base+1, base+2, base+3);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}