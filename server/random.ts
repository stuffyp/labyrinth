const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const randInt = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
}

const randLetter = () => {
    return ALPHABET[randInt(0, 26)];
}

const randString = (length: number) => {
    let str = "";
    for(let i = 0; i<length; i++){
        str += randLetter();
    }
    return str;
}

export {randString};