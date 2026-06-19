import { CGFobject, CGFappearance } from "../../lib/CGF.js";
import { MyCylinder } from "../geometry/MyCylinder.js";

export class MyWagonTongue extends CGFobject{
    constructor(scene, tongueLength, tongueRadius, woodMaterial){
        super(scene);
        this.tongueLength = tongueLength || 3;
        this.tongueRadius = tongueRadius || 0.08;
        this.woodMaterial = woodMaterial;

        this.pole = new MyCylinder(scene,10,1);
    }

    display(){
        const L = this.tongueLength;
        const R = this.tongueRadius;

        this.woodMaterial.apply();

        this.scene.pushMatrix();
        this.scene.rotate(Math.PI/2, 0, 1, 0);
        this.scene.scale(R,R,L);
        this.pole.display();
        this.scene.popMatrix();

        const yokeHalfWidth = 0.5;
        const yokeRadius = R * 0.85;

        this.scene.pushMatrix();
        this.scene.translate(L,0,-yokeHalfWidth);
        this.scene.scale(yokeRadius,yokeRadius,yokeHalfWidth*2);
        this.pole.display();
        this.scene.popMatrix();
    }
}