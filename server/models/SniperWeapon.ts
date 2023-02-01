import { Vector } from "../../shared/GameTypes";
import { add, mult, rotate } from "../../shared/vector-util";
import Weapon, {WeaponContext, WeaponState, WeaponUpdateReturn} from "../../shared/Weapon";
import { randInt } from "../random";
import BigAllyProjectile from "./BigAllyProjectile";
import StraightAllyProjectile from "./StraightAllyProjectile";

const RELOAD = 48;
const OFFSET = 6;
class SniperWeapon implements Weapon {
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
                const offsetOne = add(context.position, mult(OFFSET, rotate(this.shootDir, 90)));
                const offsetTwo = add(context.position, mult(OFFSET, rotate(this.shootDir, -90)));
                return {
                    projectiles : [
                        new BigAllyProjectile(offsetOne, this.shootDir),
                        new BigAllyProjectile(offsetOne, this.shootDir, 12),
                        new BigAllyProjectile(offsetOne, this.shootDir, 8),
                        new BigAllyProjectile(offsetTwo, this.shootDir),
                        new BigAllyProjectile(offsetTwo, this.shootDir, 12),
                        new BigAllyProjectile(offsetTwo, this.shootDir, 8),
                    ]
                };
            default:
                break;
        }
        return null;
    }

}

export default SniperWeapon;