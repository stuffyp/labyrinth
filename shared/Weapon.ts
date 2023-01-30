import { AllyProjectile, Position, Vector } from "./GameTypes";

enum WeaponState {
    Shoot,
    Ready,
    Reload,
    Charge,
}

type WeaponUpdateReturn = null|{
    projectiles : AllyProjectile[];
}

type WeaponContext = {
    position : Position,
    shootDir : Vector,
}

interface Weapon {
    frameCount : number,
    state : WeaponState,
    update : (context : WeaponContext)=>WeaponUpdateReturn,
}

export {WeaponState, WeaponContext, WeaponUpdateReturn};
export default Weapon;