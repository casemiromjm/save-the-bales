import { CGFobject, CGFappearance, CGFtexture } from "../../lib/CGF.js";
import { MyCylinder } from "../geometry/MyCylinder.js";
import { MyWheel } from "./MyWheel.js";
import { MyWagonBed } from "./MyWagonBed.js";
import { MyWagonCover } from "./MyWagonCover.js";
import { MyWagonTongue } from "./MyWagonTongue.js";
import { MyHorse } from "./MyHorse.js";

export class MyWagon extends CGFobject{
    constructor(scene,opts){
        super(scene);

        opts = opts || {};
        this.wagonLength = opts.wagonLength || 4;
        this.wagonWidth = opts.wagonWidth || 2;
        this.bedHeight = opts.bedHeight || 1.0;
        this.wheelRadius = opts.wheelRadius || 0.8;
        this.spokeCount = opts.spokeCount || 8;
        this.coverHeight = opts.coverHeight || 1.5;

        this.wheelRotation = 0;
        this.steerAngle = 0;
        
        this._initMaterials();
        this._initComponents();
    }

    _initMaterials(){
        const s = this.scene;

        this.woodMat = new CGFappearance(s);
        this.woodMat.setAmbient(0.35,0.20,0.08,1);
        this.woodMat.setDiffuse(0.55,0.30,0.10,1);
        this.woodMat.setSpecular(0.10,0.06,0.02,1);
        this.woodMat.setShininess(20);

        this.rimMat = new CGFappearance(s);
        this.rimMat.setAmbient(0.10,0.10,0.10,1);
        this.rimMat.setDiffuse(0.25,0.25,0.25,1);
        this.rimMat.setSpecular(0.50,0.50,0.50,1);
        this.rimMat.setShininess(80);

        this.canvasMat = new CGFappearance(s);
        this.canvasMat.setAmbient(0.75,0.72,0.60,1);
        this.canvasMat.setDiffuse(0.85,0.82,0.70,1);
        this.canvasMat.setSpecular(0.05,0.05,0.05,1);
        this.canvasMat.setShininess(5);
    }

    _initComponents(){
        const s = this.scene;
        const L = this.wagonLength;
        const W = this.wagonWidth;

        this.bed = new MyWagonBed(s, L, W, this.bedHeight, this.woodMat);

        const coverLength = L * 0.95;
        const archRadius = W * 0.5;
        const archHeight = this.coverHeight;
        this.cover = new MyWagonCover(s,coverLength,archRadius,archHeight,this.canvasMat);

        const tongueLength = L * 0.75;
        this.tongue = new MyWagonTongue(s,tongueLength, 0.07,this.woodMat);

        this.wheel = new MyWheel(s,this.spokeCount, this.woodMat, this.rimMat);

        this.axle = new MyCylinder(s,10,1);

        this.horseLeft = new MyHorse(s, [0.55, 0.35, 0.15], 0);
        this.horseRight = new MyHorse(s, [0.20, 0.15, 0.10], Math.PI);
    }

    update(dt, speed, maxSpeed){
        this.horseLeft.update(dt, speed, maxSpeed);
        this.horseRight.update(dt, speed, maxSpeed);
    }

    display(){
        const L = this.wagonLength;
        const W = this.wagonWidth;
        const H = this.bedHeight;
        const R = this.wheelRadius;

        const wheelY = R;
        const frontAxleX = L/2 - 0.3;
        const rearAxleX = -L/2 + 0.3;
        const wheelZ = W/2 + 0.05;

        this.scene.pushMatrix();
        this.scene.translate(0,wheelY,0);
        this.bed.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(0,wheelY + H, 0);
        this.cover.display();
        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(frontAxleX,wheelY,0);
        this.scene.rotate(this.steerAngle, 0, 1, 0);

            this.scene.pushMatrix()
            this.tongue.display();
            this.scene.popMatrix();

            this._drawAxleLocal(W);

            this._drawWheelLocal(wheelZ, R, false);
            this._drawWheelLocal(-wheelZ, R, true);

            const tongueLen = L * 0.75;
            const horseScale = 2.0;
            const horseSeparation = W * 0.3;
            const horseOffset = tongueLen - 0.6;

            this.scene.pushMatrix();
            this.scene.translate(horseOffset, -wheelY, horseSeparation);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.scale(horseScale, horseScale, horseScale);
            this.horseLeft.display();
            this.scene.popMatrix();

            this.scene.pushMatrix();
            this.scene.translate(horseOffset, -wheelY, -horseSeparation);
            this.scene.rotate(Math.PI / 2, 0, 1, 0);
            this.scene.scale(horseScale, horseScale, horseScale);
            this.horseRight.display();
            this.scene.popMatrix();

        this.scene.popMatrix();

        this.scene.pushMatrix();
        this.scene.translate(rearAxleX, wheelY, 0);
        this.scene.rotate(-this.steerAngle * 0.4, 0, 1, 0);

            this._drawAxleLocal(W);
            this._drawWheelLocal(wheelZ, R, false);
            this._drawWheelLocal(-wheelZ, R, true);

        this.scene.popMatrix();
    }

    _drawAxleLocal(wagonWidth){
        const axleRadius = 0.06;

        this.woodMat.apply();
        this.scene.pushMatrix();
        this.scene.translate(0, 0 , -wagonWidth/2);
        this.scene.scale(axleRadius, axleRadius, wagonWidth);
        this.axle.display();
        this.scene.popMatrix();
    }

    _drawWheelLocal(z, radius, mirror){
        this.scene.pushMatrix();
        this.scene.translate(0,0,z);

        if(mirror){
            this.scene.rotate(Math.PI,0,1,0);
        }

        this.scene.rotate(mirror ? -this.wheelRotation : this.wheelRotation, 0, 0, 1);

        this.scene.scale(radius,radius,radius);
        this.wheel.display();
        this.scene.popMatrix();
    }
}