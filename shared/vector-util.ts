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

const sub = (v1 : Vector, v2 : Vector) : Vector => {
    return {
        x: v1.x-v2.x,
        y: v1.y-v2.y
    }
}

const dot = (v1: Vector, v2: Vector) : number => {
    return v1.x*v2.x+v1.y*v2.y;
}

const moveTowards = (start: Vector, end: Vector, distance: number) : Vector => {
    const dir : Vector = sub(end, start);
    return add(start, mult(distance/magnitude(dir), dir));
}

const distance = (v1 : Vector, v2: Vector) : number => {
    return magnitude(sub(v1, v2));
}

const rotate = (v : Vector, theta: number) : Vector => {
    const angle = theta*Math.PI/180;
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);
    return {
        x: cos*v.x-sin*v.y,
        y: sin*v.x+cos*v.y
    };
}

export {magnitude, normalize, add, sub, mult, moveTowards, distance, rotate};