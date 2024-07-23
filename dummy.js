// const a = '🔥';
// console.log(a.length);
// console.log(a);
// console.log(JSON.stringify(a));
// const emoji = '🔥';
// const codePoint = emoji.codePointAt(0).toString(16);
// console.log(`\\u{${codePoint}}`); // Outputs: \u{1f95a}

function computeBorder(str) {
    let border = new Array(str.length).fill(0);
    border[0] = 0;

    let m = str.length;
    let j = 0;
    let i = 1;

    while (i < m) {
        if (str[j] === str[i]) {
            border[i] = j + 1;
            i++;
            j++;
        }
        else if (j > 0) {
            j = border[j - 1];
        } else {
            border[i] = 0;
            i++;
        }
    }
    return border;
}

function stringMatch(text, pattern) {
    let n = text.length;
    let m = pattern.length;

    const border = computeBorder(pattern);

    let i = 0;
    let j = 0;

    while (i < n) {
        if (pattern[j] === text[i]) {
            if (j === m - 1) {
                return i - m + 1;
            }
            i++;
            j++;
        }
        else if (j > 0) {
            j = border[j - 1];
        }
        else {
            i++;
        }
    }
    return -1;
}

function getMatchPosition(text, pattern) {
    const position = new Array(text.length).fill(false);
    let prefix = text;
    let index = 0;
    while (prefix.length >= pattern.length) {
        let first = stringMatch(prefix, pattern);
        if (first !== -1) {
            console.log('index:', index, ", first:", first);
            position[first + index] = true;
            prefix = prefix.substring(first + 1, prefix.length);
            index += first + 1;
        } else {
            prefix = '';
        }
    }
    return position;
}

function eatWorm() {
    const pass = '🥚kontol4.45%VfranceJuneVIIgp7c5🐛🐛🐛🐛🐛🐛🐛🐛asdasd.';
    const position = getMatchPosition(pass, '🐛');
    console.log(position);
    const noWorms = 5;

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
            index = pos[i] + 2;
        }
        if (index < pass.length) {
            prefix += pass.substring(index, plength);
        }
        console.log(prefix);
        return true;
    }
}

function eraseLastOnePassword(password) {
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
        const suffix = password.substring(lastIndex + 1, password.length);
        return prefix + suffix;
    }
    return password;
}

// console.log(eraseLastOnePassword("🔥asdasdadasda1🔥"));

// let d = new Date();

// console.log(d.getHours());
// console.log(d.getMinutes());

// console.log([1,2,3]+[4,5,6]);

// let i = 0;
// let count = 10;

// for (let id = 0; id < count; id++) {
//     if (count === 6) {
//         id--;
//     }
//     console.log(id, count);
//     count--;
// }

function isDigit(char) {
    return !isNaN(parseInt(char));
}

function satisfiesSumDigits() {
    let prefix = 'b2bbb';
    let suffix = 'a63aa2a29a6';

    const targetSum = 25;
    let sumNumber = 30;
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
        console.log(prefix + addedChar + suffix);
    } else {
        for (let i = 0; i < prefix.length; i++) {
            if (isDigit(prefix[i])) {
                let parsed = parseInt(prefix[i])
                if (sumNumber - parsed >= targetSum) {
                    sumNumber -= parsed;
                    prefix = prefix.substring(0, i) + prefix.substring(i + 1, prefix.length);
                    i--;
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
                        suffix = suffix.substring(0, i) + suffix.substring(i + 1, suffix.length);
                        i--;
                    } else if (sumNumber - parsed < targetSum) {
                        let newsubs = sumNumber - targetSum;
                        sumNumber -= newsubs;
                        suffix = suffix.substring(0, i) + (parsed - newsubs) + suffix.substring(i + 1, suffix.length);
                        break;
                    }
                }
            }
        }
        console.log(prefix + suffix);
    }
}

function romanToDecimal(roman) {
    const romanMap = {
        'I': 1,
        'V': 5,
        'X': 10,
        'L': 50,
        'C': 100,
        'D': 500,
        'M': 1000
    };

    let total = 0;

    for (let i = 0; i < roman.length; i++) {
        const currentVal = romanMap[roman[i]];
        const nextVal = romanMap[roman[i + 1]];

        if (currentVal < nextVal) {
            total -= currentVal;
        } else {
            total += currentVal;
        }
    }

    return total;
}

const romanNumberPattern = /M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g;

function extractRomanNumber(strings) {
    const numbers = strings.match(romanNumberPattern) || [];
    const romans = numbers.filter(string => string !== '');
    return romans;
}

function extractRoman(strings) {
    const numbers = strings.match(romanNumberPattern) || [];
    return numbers;
}

function clearViolateRoman(string, combination, found) {
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

// let string = '12345VIIIII6789XVIIIIIIIIVVVIIIII';
// const found = [false, false];
// const combination = ['V', 'VII'];
// string = clearViolateRoman(string, combination, found);
// console.log(string);
// console.log(found);
const numberPattern = /\d+/g;

function extractNumber(strings) {
    const numbers = strings.match(numberPattern) || [];
    return numbers;
}

class BitSet {
    constructor(size) {
        this.size = size;
        this.words = new Uint32Array(Math.ceil(size / 32));
    }

    set(bitIndex, value) {
        const wordIndex = Math.floor(bitIndex / 32);
        const bitPosition = bitIndex % 32;
        if (value) {
            this.words[wordIndex] |= (1 << bitPosition);
        } else {
            this.words[wordIndex] &= ~(1 << bitPosition);
        }
    }

    get(bitIndex) {
        const wordIndex = Math.floor(bitIndex / 32);
        const bitPosition = bitIndex % 32;
        return (this.words[wordIndex] & (1 << bitPosition)) !== 0;
    }
}

function sieveOfEratosthenes(limit) {
    const bitSet = new BitSet(limit + 1);
    bitSet.set(0, false); 
    bitSet.set(1, false); 

    for (let i = 2; i <= limit; i++) {
        bitSet.set(i, true);
    }

    for (let p = 2; p * p <= limit; p++) {
        if (bitSet.get(p)) {
            for (let multiple = p * p; multiple <= limit; multiple += p) {
                bitSet.set(multiple, false);
            }
        }
    }

    return bitSet;
}


const limit = 1000000;
const PRIME_SET = sieveOfEratosthenes(limit);

for (let i = 0; i < 1000; i++) {
    console.log(i, 'isPrime:', PRIME_SET.get(i));
}