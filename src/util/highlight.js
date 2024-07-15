import { extractRomanNumber, extractNumber } from "./extract";

export const highlight = [];

export function addRomanHighlight(newPassword) {
    let found = -1;
    for (let i = 0; i < highlight.length; i++) {
        if (highlight[i].className === 'roman-number') {
            found = i;
        }
    }
    console.log('Roman highlight');
    const romanNumbers = extractRomanNumber(newPassword);
    const regex = romanNumbers.map((item) => new RegExp(`${item}`,'g'));
    
    if (found === -1) {
        highlight.push({
            highlight: regex,
            className: 'roman-number'
        })
    } else {
        highlight[found].highlight = regex;
    }
}

export function addNumberHighlight(newPassword) {
    let found = -1;
    for (let i = 0; i < highlight.length; i++) {
        if (highlight[i].className === 'number') {
            found = i;
        }
    }
    console.log('Number highlight');

    const numbers = extractNumber(newPassword);
    const regex = numbers.map((item) => new RegExp(`${item}`,'g'));
    
    if (found === -1) {
        highlight.push({
            highlight: regex,
            className: 'number'
        })
    } else {
        highlight[found].highlight = regex;
    }
}

export function clearHighlight() {
    while (highlight.length !== 0) {
        highlight.pop();
    }
}