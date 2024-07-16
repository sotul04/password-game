function countUppercaseLetters(str) {
    return str.split('').filter(char => /[A-Z]/.test(char)).length;
}

function countDigits(str) {
    return str.split('').filter(char => /\d/.test(char)).length;
}

function countSpecialCharacters(str) {
    return str.split('').filter(char => /[^a-zA-Z0-9]/.test(char)).length;
}

export default function getPasswordScore(str) {
    const length = str.length; //point 1
    const uppercase = countUppercaseLetters(str); // point 2
    const digits = countDigits(str); //point 3
    const special = countSpecialCharacters(str); //point 2
    return uppercase + digits * 2 + special + length
}