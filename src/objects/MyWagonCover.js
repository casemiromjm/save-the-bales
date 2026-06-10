import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyHalfPrismOpen } from "../geometry/MyHalfPrismOpen.js";

export class MyWagonCover extends CGFobject{
    constructor(scene, coverLength, archRadius, archHeight, canvasMaterial){
        super(scene);
        this.coverLength = coverLength || 2;
        this.archRadius = archRadius || 1;
        this.archHeight = archHeight || 1;
        this.canvasMaterial = canvasMaterial;

        this.arch = new MyHalfPrismOpen(scene,12,1);
    }

    display(){
        const Rz = this.archRadius;
        const Ry = this.archHeight;
        const L = this.coverLength;

        this.canvasMaterial.apply();

        this.scene.pushMatrix();
        this.scene.translate(L/2, 0, 0);
        this.scene.rotate(-Math.PI/2,0,1,0);
        this.scene.scale(Rz,Ry,L);
        this.arch.display();
        this.scene.popMatrix();
    }
}