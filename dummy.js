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
            border[i] = j+1;
            i++;
            j++;
        }
        else if (j > 0) {
            j = border[j-1];
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
            j = border[j-1];
        }
        else {
            i++;
        }
    }
    return -1;
}

const text = 'anjing 🥚🔥';
console.log(text.length);
console.log(stringMatch(text, '🔥'));

const string = "Halo🔥🔥🔥";
console.log("Index of:", string.indexOf("🔥"));