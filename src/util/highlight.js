import { extractRomanNumber, extractNumber } from "./extract";

export const highlight = [
    {
        highlight: [],
        className: 'roman-number'
    },
    {
        highlight: [],
        className: 'number'
    }
];

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
    
    highlight[0].highlight = regex;
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
    
    highlight[1].highlight = regex;
}

export function clearNumberHighlight() {
    highlight[1].highlight = [];
}

export function clearRomanHighlight() {
    highlight[0].highlight = [];
}