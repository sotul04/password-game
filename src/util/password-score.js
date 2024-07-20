import PASSWORD from "../model/Password";
import RULES from "../model/Rule";
import SCORE from "../model/Score";

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
    let index = 0;
    while (prefix.length >= pattern.length) {
        let first = stringMatch(prefix, pattern);
        if (first !== -1) {
            position[first+index] = true;
            prefix = prefix.substring(first+1, prefix.length);
            index += first+1;
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
        if (!position[i]) {
            if (!lastWas) {
                lastIndex = i;
            }
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

export function eatWorm() {
    const pass = PASSWORD.currentPassword;
    const position = getMatchPosition(pass, '🐛');
    const noWorms = RULES.rules[13].x[SCORE.level];

    const plength = pass.length;
    const pos = [];
    for (let i = 0; i < plength; i++) {
        if (position[i]) {
            pos.push(i);
        }
    }
    if (pos.length < noWorms) {
        return false;
    } else {
        let prefix = '';
        let index = 0;
        for (let i = 0; i < noWorms; i++) {
            prefix += pass.substring(index, pos[i]);
            index = pos[i]+2;
        }
        if (index < pass.length) {
            prefix += pass.substring(index, plength);
        }
        PASSWORD.currentPassword = prefix;
        return true;
    }
}