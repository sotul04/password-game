const numberPattern = /\d+/g;
const digitPattern = /\d/g;

const romanNumberPattern = /M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})/g;

export function extractNumber(strings) {
    const numbers = strings.match(numberPattern) || [];
    return numbers;
}

export function extractDigit(strings) {
    const digits = strings.match(digitPattern) || [];
    const intDigits = digits.map(Number);
    return intDigits;
}

export function extractRomanNumber(strings) {
    const numbers = strings.match(romanNumberPattern) || [];
    const romans = numbers.filter(string => string !== '');
    console.log('Roman Number:', romans);
    return romans;
}
