import {CGFinterface, dat} from './lib/CGF.js';

/**
* MyInterface
* @constructor
*/
export class MyInterface extends CGFinterface {
    constructor() {
        super();
    }

    init(application) {
        // call CGFinterface init
        super.init(application);
        
        // init GUI. For more information on the methods, check:
        // https://github.com/dataarts/dat.gui/blob/master/API.md
        this.gui = new dat.GUI();
        this.gui.add(this.scene, 'scaleFactor', 0.1 , 5).name('Scale');

        const gameFolder = this.gui.addFolder("Save The Bales! - Game Stats");
        gameFolder.open();

        // function to avoid user tampering
        const readOnly = (controller) => {
            controller.domElement.style.pointerEvents = "none";

            return controller;
        }

        readOnly(gameFolder.add(this.scene, "health", 0, 100, 1).name("HP").listen());

        // instantaneous taken damage
        gameFolder.add(this.scene, 'lastDamage').name('Last Damage').listen();

        gameFolder.add(this.scene, 'collisionCount').name('Collisions').listen();

        // instantaneous healed health
        gameFolder.add(this.scene, 'lastHeal').name('Last Heal').listen();

        gameFolder.add(this.scene, "totalBalesDropped").name("Saved Bales").listen();

        gameFolder.add(this.scene, 'gameScore').name('Score').listen();

        this.initKeys();

        return true;
    };

    initKeys(){
        this.scene.gui = this;
        this.processKeyboard = function(){};
        this.activeKeys = {};
    }

    processKeyDown(event){
        this.activeKeys[event.code] = true;
    }

    processKeyUp(event){
        this.activeKeys[event.code] = false;
    }

    isKeyPressed(keyCode){
        return this.activeKeys[keyCode] === true;
    }
}
