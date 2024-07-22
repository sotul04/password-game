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

function getMatchPosition(text, pattern) {
    const position = new Array(text.length).fill(false);
    let prefix = text;
    let index = 0;
    while (prefix.length >= pattern.length) {
        let first = stringMatch(prefix, pattern);
        if (first !== -1) {
            console.log('index:', index, ", first:", first);
            position[first+index] = true;
            prefix = prefix.substring(first+1, prefix.length);
            index += first+1;
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
            index = pos[i]+2;
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
        const suffix = password.substring(lastIndex+1, password.length);
        return prefix+suffix;
    }
    return password;
}

console.log(eraseLastOnePassword("🔥asdasdadasda1🔥"));

let d = new Date();

console.log(d.getHours());
console.log(d.getMinutes());

console.log([1,2,3]+[4,5,6]);
