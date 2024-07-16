/**
 * @param maxNum must greater than 1 
 * return number between 0 to maxNum - 1
 */
export default function intervalRandom(maxNum) {
    return Math.floor(Math.random()*maxNum);
}