import { CGFobject, CGFappearance  } from '../../lib/CGF.js';
import { MyQuad } from './MyQuad.js';
/**
 * MyDiamond
 * @constructor
 * @param scene - Reference to MyScene object
 */
export class MyUnitCubeQuad extends CGFobject {
    constructor(scene, top, front, right, back, left, bottom){
        super(scene);
        this.quad = new MyQuad(scene);

        this.texTop = top;
        this.texFront = front;
        this.texRight = right;
        this.texBack = back;
        this.texLeft = left;
        this.texBottom = bottom;    

        this.mat = new CGFappearance(scene);
        this.mat.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.mat.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.mat.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.mat.setShininess(10.0);
    }

    display(){

    //front
    this.scene.pushMatrix();
    this.mat.setTexture(this.texFront);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();
    

    //back
    this.scene.pushMatrix();
    this.mat.setTexture(this.texBack);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.rotate(Math.PI,0,1,0);
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();

    // right
    this.scene.pushMatrix();
    this.mat.setTexture(this.texRight);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.rotate(Math.PI/2,0,1,0);
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();

    // left
    this.scene.pushMatrix();
    this.mat.setTexture(this.texLeft);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.rotate(-Math.PI/2,0,1,0);
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();


    //top
    this.scene.pushMatrix();
    this.mat.setTexture(this.texTop);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.rotate(-Math.PI/2,1,0,0);
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();

    //bottom
    this.scene.pushMatrix();
    this.mat.setTexture(this.texBottom);
    this.mat.apply();
    if (this.scene.useNearest) {
        this.activate_nearFilter();
    }
    else {
        this.activate_linearFilter();
    }
    this.scene.rotate(Math.PI/2,1,0,0);
    this.scene.translate(0,0,0.5);
    this.quad.display();
    this.scene.popMatrix();

    }

    activate_nearFilter(){
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.NEAREST);
    }

    activate_linearFilter(){
        this.scene.gl.texParameteri(this.scene.gl.TEXTURE_2D, this.scene.gl.TEXTURE_MAG_FILTER, this.scene.gl.LINEAR);
    }
}