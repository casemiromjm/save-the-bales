import {CGFobject} from '../../lib/CGF.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCube extends CGFobject {
    constructor(scene) {
        super(scene);
        this.initBuffers();
    }
    
    initBuffers() {
        this.vertices = [
            // Front
            -0.5, -0.5,  0.5, //0
             0.5, -0.5,  0.5, //1
             0.5,  0.5,  0.5, //2
            -0.5,  0.5,  0.5, //3

            // Back
            -0.5, -0.5, -0.5, //4
             0.5, -0.5, -0.5, //5
             0.5,  0.5, -0.5, //6
            -0.5,  0.5, -0.5  //7
        ];

        //Counter-clockwise reference of vertices
        this.indices = [
            // Front
            0,1,2,
            0,2,3,

            // Right
            1,5,6,
            1,6,2,

            // Back
            5,4,7,
            5,7,6,

            // Left
            4,0,3,
            4,3,7,

            // Top
            3,2,6,
            3,6,7,

            // Bottom
            4,5,1,
            4,1,0
        ];

        //The defined indices (and corresponding vertices)
        //will be read in groups of three to draw triangles
        this.primitiveType = this.scene.gl.TRIANGLES;

        this.initGLBuffers();
    }
}

