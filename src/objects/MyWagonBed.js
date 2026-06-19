import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyQuadDoubleFace } from "../geometry/MyQuadDoubleFace.js";

export class MyWagonBed extends CGFobject{
    constructor(scene, length, width, height, woodMaterial){
        super(scene);
        this.length = length || 4;
        this.width = width || 2;
        this.height = height || 1.0;
        this.woodMaterial = woodMaterial;

        this.quad = new MyQuadDoubleFace(scene);
    }

    display(){
        const L = this.length;
        const W = this.width;
        const H = this.height;

        this.woodMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(L,W,1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(L/2, H/2, 0);
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(W,H,1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(-L/2, H/2, 0);
        this.scene.rotate(-Math.PI/2, 0, 1, 0);
        this.scene.scale(W,H,1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, H/2, W/2);
        this.scene.scale(L,H,1);
        this.quad.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, H/2, -W/2);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(L,H,1);
        this.quad.display();
        this.scene.popMatrix();
    }
}