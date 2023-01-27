import {Vector} from "./GameTypes";

const magnitude = (v : Vector) : number => {
    return Math.sqrt(dot(v, v));
}

const normalize = (v : Vector) : Vector => {
    const length = magnitude(v);
    if (length) return mult(1/length, v);
    return v;
}

const mult = (s: number, v : Vector) : Vector => {
    return {
        x: s*v.x,
        y: s*v.y
    };
}

const add = (v1: Vector, v2: Vector) : Vector => {
    return {
        x: v1.x+v2.x,
        y: v1.y+v2.y,
    }
}

const dot = (v1: Vector, v2: Vector) : number => {
    return v1.x*v2.x+v1.y*v2.y;
}

export {magnitude, normalize, add, mult};