import { CGFobject, CGFappearance } from "../lib/CGF.js";
import { CGFobjModel } from "../../lib/extra/CGFobjModel.js";

const NEUTRAL_SCALE = 1.0 / 78.793;
const NEUTRAL_TRANSLATE = [-8.093, 33.756, -39.572];

const WALKING_SCALE = 1.0 / 75.720;
const WALKING_TRANSLATE = [0.000, 9.121, -38.371];

export class MyHorse extends CGFobject{
    constructor(scene, color, phaseOffset){
        super(scene);

        this.color = color || [0.55, 0.35, 0.15];
        this.phaseOffset = phaseOffset || 0;
        this.animTime = 0;
        this.speed = 0;

        this.modelNeutral = new CGFobjModel(scene, "models/horse_neutral.obj");
        this.modelWalking = new CGFobjModel(scene, "models/horse_walking.obj");
        
        this._initMaterial();
    }

    _initMaterial(){
        this.material = new CGFappearance(this.scene);
        this.material.setAmbient(this.color[0] * 0.4, this.color[1] * 0.4, this.color[2] * 0.4, 1);
        this.material.setDiffuse(this.color[0], this.color[1], this.color[2], 1);
        this.material.setSpecular(0.05, 0.04, 0.02, 1);
        this.material.setShininess(10);
    }

    update(dt, speed, maxSpeed){
        this.speed = maxSpeed > 0 ? speed / maxSpeed : 0;
        const freq = 0.5 + this.speed * 2.5;
        this.animTime += dt * freq * 2 * Math.PI;
    }

    display(){
        const t = this.animTime + this.phaseOffset;
        const spd = this.speed;
        
        const useWalking = spd > 0.05 && Math.sin(t) > 0;
        const activeModel = useWalking ? this.modelWalking : this.modelNeutral;

        const sc = useWalking ? WALKING_SCALE : NEUTRAL_SCALE;
        const tr = useWalking ? WALKING_TRANSLATE : NEUTRAL_TRANSLATE;

        const bounce = Math.sin(t * 2) * 0.04 * spd;

        this.material.apply();
        this.scene.pushMatrix();

        this.scene.translate(0, bounce, 0);

        this.scene.translate(0, 0.5, 0);
        this.scene.rotate(-Math.PI / 2, 1, 0, 0);
        this.scene.scale(sc, sc, sc);
        this.scene.translate(tr[0], tr[1], tr[2]);

        activeModel.display();

        this.scene.popMatrix();
    }
}