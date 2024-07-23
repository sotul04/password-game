/**
 * @param maxNum must greater than 1 
 * return number between 0 to maxNum - 1
 */
export default function intervalRandom(maxNum) {
    return Math.floor(Math.random()*maxNum);
}

function isContains(array, val) {
    for (const el of array) {
        if (el === val) {
            return true;
        }
    }
    return false;
}

export function getListIndexRandomly(max, num) {
    const array = [];
    for (let i = 0; i < num; i++) {
        let idx = 0;
        do {
            idx = intervalRandom(max);
        } while (isContains(array, idx));
        array.push(idx);
    }
    return array;
}