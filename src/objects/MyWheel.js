import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { MyCylinder } from "../geometry/MyCylinder.js";
import { MyCircle } from "../geometry/MyCircle.js";
import { MyWheelSpoke } from "./MyWheelSpoke.js";

export class MyWheel extends CGFobject{
    constructor(scene, spokeCount, woodMaterial, rimMaterial){
        super(scene);
        this.spokeCount = spokeCount || 8;
        this.woodMaterial = woodMaterial;
        this.rimMaterial = rimMaterial;

        this.hub = new MyCylinder(scene, 16, 1);
        this.rim = new MyCylinder(scene, 32, 1);
        this.face = new MyCircle(scene, 32);
        this.spoke = new MyWheelSpoke(scene);
    }

    display(){
        const rimInner = 0.88;
        const rimOuter = 1.0;
        const wheelDepth = 0.15;
        const hubRadius = 0.14;
        const hubDepth = wheelDepth * 1.4;
        const spokeLenFrac = rimInner - hubRadius;

        this.rimMaterial.apply();
        this.scene.pushMatrix();
        this.scene.scale(rimOuter, rimOuter, wheelDepth);
        this.rim.display();
        this.scene.popMatrix();

        const hd = 0.02;
        const spokeZScale = wheelDepth / (2 * hd);

        this.woodMaterial.apply();
        for(let i = 0; i < this.spokeCount; i++){
            const angle = (2 * Math.PI * i) / this.spokeCount;

            this.scene.pushMatrix();
            this.scene.translate(0, 0, wheelDepth / 2);
            this.scene.rotate(angle, 0, 0, 1);
            this.scene.translate(0, hubRadius, 0);
            this.scene.scale(1, spokeLenFrac, spokeZScale);
            this.spoke.display();
            this.scene.popMatrix();
        }

        this.woodMaterial.apply();

        const hubZ = (wheelDepth - hubDepth) / 2;

        this.scene.pushMatrix();
        this.scene.translate(0, 0, hubZ);
        this.scene.scale(hubRadius, hubRadius, hubDepth);
        this.hub.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, hubZ + hubDepth);
        this.scene.scale(hubRadius, hubRadius, 1);
        this.face.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0, 0, hubZ);
        this.scene.rotate(Math.PI, 0, 1, 0);
        this.scene.scale(hubRadius, hubRadius, 1);
        this.face.display();
        this.scene.popMatrix();
    }
}