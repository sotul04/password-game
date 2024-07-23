import RULES from "../model/Rule";
import SCORE from "../model/Score";
import PASSWORD from "../model/Password";
import { extractDigit } from "./extract";

function isDigit(char) {
    return !isNaN(parseInt(char));
}

export function satisfiesSumDigits(prefix, suffix) {
    const pass = prefix + suffix;

    const targetSum = RULES.rules[4].x[SCORE.level];
    let sumNumber = extractDigit(pass).reduce((acc, val) => acc + val, 0);
    if (sumNumber === targetSum) {
        return;
    }
    if (targetSum > sumNumber) {
        let satisfied = false;
        const numberAdded = [];
        while (!satisfied) {
            for (let num = 9; num >= 0; num--) {
                if (sumNumber + num <= targetSum) {
                    numberAdded.push(num);
                    sumNumber += num;
                    break;
                }
            }
            if (sumNumber === targetSum) {
                satisfied = true;
            }
        }
        const addedChar = numberAdded.join('');
        PASSWORD.currentPassword = prefix + addedChar + suffix;
    } else {
        for (let i = 0; i < prefix.length; i++) {
            if (isDigit(prefix[i])) {
                let parsed = parseInt(prefix[i])
                if (sumNumber - parsed >= targetSum) {
                    sumNumber -= parsed;
                    prefix = prefix.substring(0, i) + '0' + prefix.substring(i + 1, prefix.length);
                } else if (sumNumber - parsed < targetSum) {
                    let newsubs = sumNumber - targetSum;
                    sumNumber -= newsubs;
                    prefix = prefix.substring(0, i) + (parsed - newsubs) + prefix.substring(i + 1, prefix.length);
                    break;
                }
            }
        }
        if (sumNumber > targetSum) {
            for (let i = 0; i < suffix.length; i++) {
                if (isDigit(suffix[i])) {
                    let parsed = parseInt(suffix[i])
                    if (sumNumber - parsed >= targetSum) {
                        sumNumber -= parsed;
                        suffix = suffix.substring(0, i) + '0' + suffix.substring(i + 1, suffix.length);
                    } else if (sumNumber - parsed < targetSum) {
                        let newsubs = sumNumber - targetSum;
                        sumNumber -= newsubs;
                        suffix = suffix.substring(0, i) + (parsed - newsubs) + suffix.substring(i + 1, suffix.length);
                        break;
                    }
                }
            }
        }
        PASSWORD.currentPassword = prefix + suffix;
    }
}

const romanNumberPattern = /M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g;

function extractRoman(strings) {
    const numbers = strings.match(romanNumberPattern) || [];
    return numbers;
}

export function clearViolateRoman(string, combination, found) {
    let check = string.substring(0, string.length);
    const romans = extractRoman(check);
    let clear = '';
    let relative = 0;
    for (const roman of romans) {
        if (roman === '' || roman === 'I') {
            if (relative < check.length) {
                clear += check[relative];
                relative++;
            }
        } else {
            if (roman === combination[0] || roman === combination[1]) {
                if (roman === combination[0]) {
                    if (!found[0]) {
                        found[0] = true;
                        clear += roman;
                    }
                    relative += roman.length;
                } else if (roman === combination[1]) {
                    if (!found[1]) {
                        found[1] = true;
                        clear += roman;
                    }
                    relative += roman.length;
                }
            } else {
                clear += '.';
                relative += roman.length;
            }
        }
    }
    return clear;
}