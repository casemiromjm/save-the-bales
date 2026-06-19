import {CGFobject} from '../../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyHalfPrism extends CGFobject {
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
        this.texCoords = [];

        var alphaAng = Math.PI/this.slices;
        
        for (let j = 0; j < this.stacks; j++) {
            let z1 = j / this.stacks;
            let z2 = (j+1) / this.stacks;

            for (let i = 0; i < this.slices; i++) {

                let initial_ang = i * alphaAng;
                let next_ang = (i+1) * alphaAng;

                // vertices

                // o z initial
                this.vertices.push(Math.cos(initial_ang) , Math.sin(initial_ang) , z1 )
                this.vertices.push(Math.cos(next_ang) , Math.sin(next_ang) , z1 )
                // o z seguinte
                this.vertices.push(Math.cos(initial_ang) , Math.sin(initial_ang) , z2 )
                this.vertices.push(Math.cos(next_ang) , Math.sin(next_ang) , z2 )

                let halfAng = (initial_ang + next_ang) / 2;

                // normais
                for (let vertice = 0; vertice < 4; vertice++) {
                    this.normals.push(Math.cos(halfAng), Math.sin(halfAng), 0);
                }

                // tex coords
                let u1 = i / this.slices;
                let u2 = (i+1) / this.slices;
                let v1 = j / this.stacks;
                let v2 = (j + 1) / this.stacks;

                this.texCoords.push(u1, 1 - v1);
                this.texCoords.push(u2, 1 - v1);
                this.texCoords.push(u1, 1 - v2);
                this.texCoords.push(u2, 1 - v2);

                // indices
                let base = (j * this.slices + i) * 4;
                this.indices.push(
                    base, base+1, base+2,
                    base+1, base+3, base+2
                );

            }
        
        }

        // "tampa" do prisma

        // back face
        // let backCenter = this.vertices.length / 3;
        // this.vertices.push(0, 0, 0);
        // this.normals.push(0, 0, -1);
        // this.texCoords.push(0.5, 1);

        // let backStart = this.vertices.length / 3;

        // for (let i = 0; i <= this.slices; i++) {
        //     let ang = i * alphaAng;

        //     this.vertices.push(Math.cos(ang), Math.sin(ang), 0);
        //     this.normals.push(0, 0, -1);
        //     this.texCoords.push(0.5 + 0.5 * Math.sin(ang), 1.0 - Math.sin(ang));
        // }

        // // front face
        // let frontCenter = this.vertices.length / 3;
        // this.vertices.push(0, 0, 1);
        // this.normals.push(0, 0, 1);
        // this.texCoords.push(0.5, 1);

        // let frontStart = this.vertices.length / 3;

        // for (let i = 0; i <= this.slices; i++) {
        //     let ang = i * alphaAng;

        //     this.vertices.push(Math.cos(ang), Math.sin(ang), 1);
        //     this.normals.push(0, 0, 1);
        //     this.texCoords.push(0.5 + 0.5 * Math.sin(ang), 1.0 - Math.sin(ang));
        // }

        // // back indexes
        // for (let i = 0; i < this.slices; i++) {
        //     let init = backStart + i;
        //     let next = backStart + (i + 1);

        //     this.indices.push(backCenter, next, init);
        // }
        
        // // front indexes
        // for (let i = 0; i < this.slices; i++) {
        //     let init = frontStart + i;
        //     let next = frontStart + (i + 1);
                
        //     this.indices.push(frontCenter, init, next);
        // }

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

