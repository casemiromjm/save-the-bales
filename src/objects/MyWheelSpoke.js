import { CGFobject } from "../../lib/CGF.js";

export class MyWheelSpoke extends CGFobject{
    constructor(scene){
        super(scene);
        this.initBuffers();
    }

    initBuffers(){
        const hw = 0.03;  //half-width
        const hd = 0.02; //half-depth

        this.vertices = [
            -hw, 0, hd,
            hw, 0, hd,
            hw, 1, hd,
            -hw, 1, hd,
            -hw, 0, -hd,
            hw, 0, -hd,
            hw, 1, -hd,
            -hw, 1, -hd,
        ];

        this.normals = [
            0,0,1, 0,0,1, 0,0,1, 0,0,1,
            0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1, 
        ];

        this.indices = [
            0,1,2, 0,2,3, //Front
            5,4,7, 5,7,6, //Back
            4,0,3, 4,3,7, //Left
            1,5,6, 1,6,2, //Right
            3,2,6, 3,6,7, //Top
            4,5,1, 4,1,0, //Bottom
        ];

        this.texCoords = [
            0,1, 1,1, 1,0, 0,0,
            0,1, 1,1, 1,0, 0,0,
        ];
        
        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
}