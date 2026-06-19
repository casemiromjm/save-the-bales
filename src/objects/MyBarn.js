import { MyUnitCubeQuad } from "../geometry/MyUnitCubeQuad.js";
import { MyHalfPrism } from "../geometry/MyHalfPrism.js";
import { MyHalfCircle } from "../geometry/MyHalfCircle.js";
import { CGFobject, CGFappearance } from "../lib/CGF.js";

export class MyBarn extends CGFobject {
    constructor(scene, woodTexture, frontTexture, sideTexture, roofTexture) {
        super(scene);

        this.base = new MyUnitCubeQuad(
            scene,
            woodTexture,        // roof
            frontTexture,       // front
            sideTexture,        // right
            woodTexture,        // back
            sideTexture,        // left
            woodTexture,        // bottom
        );

        this.roof = new MyHalfPrism(
            scene,
            6,
            1,
        );

        this.roofCap = new MyHalfCircle(scene, 6)

        this.roofMaterial = new CGFappearance(scene);
        this.roofMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.roofMaterial.setDiffuse(0.7, 0.7, 0.7, 1.0);
        this.roofMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.roofMaterial.setTexture(roofTexture);
        this.roofMaterial.setTextureWrap('REPEAT', 'REPEAT');

        // material for the caps (in our case, it is the same as the side of the barn for a seamless effect )
        this.capMaterial = new CGFappearance(scene);
        this.capMaterial.setAmbient(0.8, 0.8, 0.8, 1.0);
        this.capMaterial.setDiffuse(0.9, 0.9, 0.9, 1.0);
        this.capMaterial.setSpecular(0.1, 0.1, 0.1, 1.0);
        this.capMaterial.setTexture(woodTexture);
    }

    display() {
        // base
        this.scene.pushMatrix();

        // bigger cube; (length x height x width)
        this.scene.scale(6, 4, 6); 
        
        this.scene.translate(0, 0.5, 0); 
        this.base.display();
        this.scene.popMatrix()

        // roof
        this.scene.pushMatrix();
        // place in the top of the cube
        this.scene.translate(0, 4, 0); 
        
        // MyPrism builds along the Z axis, need to orient it to sit on top of the cube
        this.scene.rotate(0, 0, 1, 0); 
        
        // scale the radius and length to match the base
        this.scene.scale(3, 3, 6); 
        this.scene.translate(0, 0, -0.5);          // center the prism on the cube
        
        // shell only
        this.roofMaterial.apply();
        this.roof.display();
        
        // front cap
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 1); // Move to the front edge of the arch
        this.capMaterial.apply();
        this.roofCap.display();
        this.scene.popMatrix();

        // back cap
        this.scene.pushMatrix();
        this.scene.translate(0, 0, 0); // Move to the front edge of the arch
        this.scene.rotate(Math.PI, 0, 1, 0);
        //this.capMaterial.apply();
        this.roofCap.display();
        this.scene.popMatrix();

        this.scene.popMatrix();
    }
}

// complex barn stays in backlog for now