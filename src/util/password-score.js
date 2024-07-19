import stringMatch from "./kmp";

export function countUppercaseLetters(str) {
    return str.split('').filter(char => /[A-Z]/.test(char)).length;
}

export function countDigits(str) {
    return str.split('').filter(char => /\d/.test(char)).length;
}

export function countSpecialCharacters(str) {
    return str.split('').filter(char => /[^a-zA-Z0-9]/.test(char)).length;
}

export default function getPasswordScore(str) {
    const length = str.length; //point 1
    const uppercase = countUppercaseLetters(str); // point 2
    const digits = countDigits(str); //point 3
    const special = countSpecialCharacters(str); //point 2
    return uppercase + digits * 2 + special + length
}

function getMatchPosition(text, pattern) {
    const position = new Array(text.length).fill(false);
    let prefix = text;
    while (prefix.length >= pattern.length) {
        let first = stringMatch(prefix, pattern);
        if (first !== -1) {
            position[first] = true;
            prefix = prefix.substring(first+1, prefix.length);
        } else {
            prefix = '';
        }
    }
    return position;
}

export function eraseLastOnePassword(password) {
    const position = getMatchPosition(password, '🔥');
    let lastIndex = -1;
    let lastWas = false;
    for (let i = 0; i < password.length; i++) {
        if (!position[i] && lastIndex < i && !lastWas) {
            lastIndex = i;
            lastWas = false;
        } else if (position[i]) {
            lastWas = true;
        }
    }
    if (lastIndex != -1) {
        const prefix = password.substring(0, lastIndex);
        const suffix = password.substring(lastIndex+1, password.length);
        return prefix+suffix;
    }
    return password;
}