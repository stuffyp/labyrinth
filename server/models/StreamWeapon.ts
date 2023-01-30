import Weapon, {WeaponContext, WeaponState, WeaponUpdateReturn} from "../../shared/Weapon";
import StraightAllyProjectile from "./StraightAllyProjectile";

const RELOAD = 15;
class StreamWeapon implements Weapon {
    state : WeaponState;
    frameCount : number;

    constructor(){
        this.state = WeaponState.Reload;
        this.frameCount = RELOAD;
    }

    update(context : WeaponContext){
        switch(this.state){
            case WeaponState.Reload:
                if (--this.frameCount < 0) this.state = WeaponState.Ready;
                break;
            case WeaponState.Ready:
                if (context.shootDir.x!==0 || context.shootDir.y!==0) {
                    this.state = WeaponState.Shoot;
                }
                break;
            case WeaponState.Shoot:
                this.state = WeaponState.Reload;
                this.frameCount = RELOAD;
                return {
                    projectiles : [
                        new StraightAllyProjectile(context.position, context.shootDir)
                    ]
                };
            default:
                break;
        }
        return null;
    }

}

export default StreamWeapon;