import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyCylinder extends CGFobject {
    constructor(scene,slices,stacks) {
        super(scene);
        this.slices = slices;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];

        var alphaAng = 2*Math.PI/this.slices;
        // the first loop needed to change because it never reached the front face
        for (let j = 0; j <= this.stacks; j++) {
            let z = j / this.stacks;
            for (let i = 0; i < this.slices; i++) {

                let initial_ang = i * alphaAng;

                // o z initial
                this.vertices.push(Math.cos(initial_ang) , Math.sin(initial_ang) , z )
                this.normals.push(Math.cos(initial_ang), Math.sin(initial_ang), 0);
                
                // mesma logica do back e front
                let nextI = (i + 1) % this.slices;

                let init = j * this.slices + i;
                let next = j * this.slices + nextI;
                let upper = (j + 1) * this.slices + i;
                let upperNext = (j + 1) * this.slices + nextI;
                
                this.indices.push(init, next, upper);
                this.indices.push(next, upperNext, upper);


            }
        
        }

        // back and front face
        let backCenter = this.vertices.length / 3;
        this.vertices.push(0, 0, 0);
        this.normals.push(0, 0, -1);

        let backStart = this.vertices.length / 3;

        for (let i = 0; i < this.slices; i++) {
            let ang = i * alphaAng;
            this.vertices.push(Math.cos(ang), Math.sin(ang), 0);
            this.normals.push(0, 0, -1);
        }

        let frontCenter = this.vertices.length / 3;
        this.vertices.push(0, 0, 1);
        this.normals.push(0, 0, 1);

        let frontStart = this.vertices.length / 3;

        for (let i = 0; i < this.slices; i++) {
            let ang = i * alphaAng;
            this.vertices.push(Math.cos(ang), Math.sin(ang), 1);
            this.normals.push(0, 0, 1);
        }

        // back
        for (let i = 0; i < this.slices; i++) {
            let init = backStart + i;
            let next = backStart + (i + 1) % this.slices; // dar a volta

            this.indices.push(backCenter, next, init);
        }
        // front
        for (let i = 0; i < this.slices; i++) {
            let init = frontStart + i;
            let next = frontStart + (i + 1) % this.slices;
                
            this.indices.push(frontCenter, init, next);
        }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

