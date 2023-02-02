import { Vector } from "../../shared/GameTypes";
import { rotate } from "../../shared/vector-util";
import Weapon, {WeaponContext, WeaponState, WeaponUpdateReturn} from "../../shared/Weapon";
import { randInt } from "../random";
import StraightAllyProjectile from "./StraightAllyProjectile";

const RELOAD = 2;
class StreamWeapon implements Weapon {
    state : WeaponState;
    frameCount : number;
    shootDir : Vector;

    constructor(){
        this.state = WeaponState.Reload;
        this.frameCount = RELOAD;
        this.shootDir = {x : 0, y : 0};
    }

    update(context : WeaponContext){
        switch(this.state){
            case WeaponState.Reload:
                if (--this.frameCount < 0) this.state = WeaponState.Ready;
                break;
            case WeaponState.Ready:
                if (context.shootDir.x!==0 || context.shootDir.y!==0) {
                    this.state = WeaponState.Shoot;
                    this.shootDir = context.shootDir;
                }
                break;
            case WeaponState.Shoot:
                this.state = WeaponState.Reload;
                this.frameCount = RELOAD;
                return {
                    projectiles : [
                        new StraightAllyProjectile(context.position, rotate(this.shootDir, randInt(-5, 5)), undefined, 2)
                    ]
                };
            default:
                break;
        }
        return null;
    }

}

export default StreamWeapon;