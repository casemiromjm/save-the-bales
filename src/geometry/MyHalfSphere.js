import {CGFobject} from '../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 * @param radius
 * @param sectors (longitude divisions)
 * @param stacks (latitude divisions)
 */
export class MyHalfSphere extends CGFobject {
    constructor(scene,radius,sectors,stacks) {
        super(scene);
        this.radius = radius
        this.sectors = sectors;
        this.stacks = stacks;
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];
        
        var sectorNumber = 2 * Math.PI / this.sectors;
        var stackNumber = (Math.PI/2) / this.stacks
        for (let j = 0; j <= this.stacks; j++) {
            let stackAngle = Math.PI /2 - j * stackNumber;
            let xz = this.radius * Math.cos(stackAngle);    
            let y = this.radius * Math.sin(stackAngle);
            for (let i = 0; i <= this.sectors; i++) {

                let sectorAngle = i * sectorNumber;
                let x = xz * Math.cos(sectorAngle);
                let z = xz * Math.sin(sectorAngle);

                this.vertices.push(x, y, z);
                this.normals.push(-x / this.radius, -y / this.radius , -z / this.radius);
                
            
                
            
                let u = i / this.sectors;
                let v = j / this.stacks;
                this.texCoords.push(u, v);

            }
        
        }
        
        for (let j = 0; j < this.stacks; j++) {
            for (let i = 0; i < this.sectors; i++) {
                let upper = j * (this.sectors + 1) + i;
                let lower = upper + this.sectors + 1;
                
                this.indices.push(upper ,lower ,upper + 1);
                this.indices.push(upper + 1, lower ,lower + 1);
            }
        }

    
    
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}

