import FLAG_CAPTCHA from "./FlagCaptcha";
import PASSWORD from "./Password";
import SCORE from "./Score";
import { extractNumber, extractRomanNumber, extractDigit } from "../util/extract";
import { countDigits, countSpecialCharacters, countUppercaseLetters } from "../util/password-score";
import stringMatch from "../util/kmp";
import { addNumberHighlight, addRomanHighlight, clearNumberHighlight, clearRomanHighlight } from "../util/highlight";
import romanToDecimal from "../util/roman-parse";
import PRIME_SET from "./PrimeNumber";
import { satisfiesSumDigits, clearViolateRoman } from "../util/cheat";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RULES = {
    currentRuleNumber: 0,
    refreshRules: function (satisfied, number) {
        if (number === 1 && !satisfied && this.currentRuleNumber === 0) {
            this.currentRuleNumber = 1;
            return;
        }
        if (satisfied && this.currentRuleNumber <= number) {
            this.currentRuleNumber = number + 1;
        }
    },
    indexCheat: -1,
    reset: function () {
        this.currentRuleNumber = 0;
        this.indexCheat = -1;
        for (const rule of this.rules) {
            rule.reset();
        }
    },
    rules: [
        {
            number: 1,
            description: function () {
                return `Your password must be at least ${this.x[SCORE.level]} characters`;
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let remainChars = this.x[SCORE.level] - (prefix.length + suffix.length);
                let remain = '0';
                if (remainChars > 0) {
                    remain = remain.repeat(remainChars);
                }
                PASSWORD.currentPassword = prefix + remain + suffix;
            },
            isSatisfied: function (string) {
                return string.length >= this.x[SCORE.level];
            },
            x: [5, 10, 20],
            point: [10, 20, 30],
            satisfies: false,
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 2,
            description: function () {
                return 'Your password must include a number';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + '0' + suffix;
            },
            isSatisfied: function (string) {
                return countDigits(string) > 0;
            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 3,
            description: function () {
                return 'Your password must include an uppercase letter';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            isSatisfied: function (string) {
                return countUppercaseLetters(string) > 0;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + 'Q' + suffix;
            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 4,
            description: function () {
                return 'Your password must include a special character';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + '@' + suffix;
            },
            point: [10, 10, 10],
            satisfies: false,
            isSatisfied: function (string) {
                return countSpecialCharacters(string) > 0;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 5,
            description: function () {
                return `The digits in your password must add up to ${this.x[SCORE.level]}`
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
                if (!satisfied) {
                    addNumberHighlight(PASSWORD.currentPassword);
                } else {
                    clearNumberHighlight();
                }
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                satisfiesSumDigits(prefix, suffix);
            },
            x: [25, 50, 100],
            point: [10, 20, 30],
            satisfies: false,
            isSatisfied: function (string) {
                return extractDigit(string).reduce((acc, val) => acc + val, 0) === this.x[SCORE.level];
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 6,
            description: function () {
                return 'Your password must include a month of the year';
            },
            type: 'plain',
            check: function () {
                let satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + 'June' + suffix;
            },
            point: [20, 20, 20],
            satisfies: false,
            isSatisfied: function (string) {
                for (const month of months) {
                    if (stringMatch(string, month) !== -1) {
                        return true;
                    }
                }
                return false;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 7,
            description: function () {
                return 'Your password must include a Roman numeral';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + 'V' + suffix;
            },
            point: [10, 10, 10],
            satisfies: false,
            isSatisfied: function (string) {
                return extractRomanNumber(string).length > 0;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            /**
             * (Anda harus mencari minimal 10 gambar bendera negara. 
             * Tampilkan X bendera saja pada 1 sesi permainan)
             */
            number: 8,
            description: function () {
                return 'Your password must include one of this country:';
            },
            type: 'country',
            check: function () {
                let satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + FLAG_CAPTCHA.currentFlags[0].title + suffix;
            },
            point: [10, 10, 10],
            satisfies: false,
            isSatisfied: function (string) {
                for (const flag of FLAG_CAPTCHA.currentFlags) {
                    const strings = string.match(new RegExp(`${flag.title}`, 'gi')) || [];
                    if (strings.filter(string => string !== '').length > 0) {
                        return true;
                    }
                }
                return false;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 9,
            description: function () {
                return `The Roman numerals in your password should multiply to ${this.x[SCORE.level]}`;
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
                if (!satisfied) {
                    addRomanHighlight(PASSWORD.currentPassword);
                } else {
                    clearRomanHighlight();
                }
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                const combination = this.combinations[SCORE.level];
                const found = [false, false];
                prefix = clearViolateRoman(prefix, combination, found);
                suffix = clearViolateRoman(suffix, combination, found);
                let addedChars = '';
                if (!found[0] && !found[1]) {
                    addedChars += '.' + combination[0] + '.' + combination[1] + '.';
                } else {
                    if (!found[0]) {
                        addedChars += '.' + combination[0] + '.';
                    } else {
                        addedChars += '.' + combination[1] + '.';
                    }
                }
                PASSWORD.currentPassword = prefix + addedChars + suffix;
            },
            x: [35, 77, 187],
            point: [20, 40, 60],
            combinations: [
                ['V', 'VII'],
                ['VII', 'XI'],
                ['XI', 'XVII']
            ],
            satisfies: false,
            isSatisfied: function (string) {
                return extractRomanNumber(string).reduce((acc, val) => acc * romanToDecimal(val), 1) === this.x[SCORE.level];
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            /**
             * (Emoji api akan “membakar” 1 huruf (menghapus huruf dan 
             * menggantikannya dengan emoji api) setiap X detik dimulai 
             * dari huruf terakhir. Api tidak akan berhenti membakar 
             * sampai semua emoji api pada textfield sudah dihapus. 
             * Perlu diperhatikan bahwa api dapat secara random muncul 
             * kembali kapanpun dan pemain perlu menghapusnya kembali)
            */
            number: 10,
            description: function () {
                return 'Oh no! Your password is on fire 🔥. Quick, put it out!';
            },
            type: 'plain',
            check: function () {
                if (this.firstTime) {
                    this.firstTime = false;
                    this.isActive = true;
                }
                if (!this.satisfies) {
                    SCORE.score += this.point[SCORE.level];
                }
                this.satisfies = true;
                RULES.refreshRules(this.satisfies, this.number);
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                this.isActive = false;
                PASSWORD.currentPassword = prefix + suffix;
            },
            isActive: false,
            firstTime: true,
            isFirstTime: true,
            point: [20, 20, 20],
            satisfies: false,
            isSatisfied: function (_) {
                return true;
            },
            reset: function () {
                this.isActive = false;
                this.firstTime = true;
                this.isFirstTime = true;
                this.satisfies = false;
            }
        },
        {
            /**
             * (Pastikan emoji telur tidak terhapus. 
             * Kalau terhapus, pemain dinyatakan kalah)
             */
            number: 11,
            description: function () {
                return '🥚 This is my chicken Paul. He hasn\'t hatched yet. Please put him in your password and keep him safe';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (this.wasPut && !satisfied && !this.cheatOn) {
                    console.log("You lose here:", this.item);
                    SCORE.lose = true;
                }
                if (!this.satisfies && satisfied) {
                    this.wasPut = true;
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            item: '🥚',
            cheat: function () {
                RULES.rules[9].isActive = false;
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                this.cheatOn = true;
                PASSWORD.currentPassword = '🥚' + prefix + suffix;
            },
            point: [10, 10, 10],
            cheatOn: false,
            wasPut: false,
            satisfies: false,
            isSatisfied: function (string) {
                return stringMatch(string, this.item) > -1;
            },
            reset: function () {
                this.cheatOn = false;
                this.wasPut = false;
                this.satisfies = false;
                this.item = '🥚';
            }
        },
        {
            /**
             * (Anda harus mencari minimal 7 gambar CAPTCHA. 
             * Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. 
             * Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
             */
            number: 12,
            description: function () {
                return 'Your password must include this CAPTCHA:';
            },
            type: 'captcha',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + FLAG_CAPTCHA.currentCaptcha.title + suffix;
            },
            point: [15, 15, 15],
            satisfies: false,
            isSatisfied: function (string) {
                return stringMatch(string, FLAG_CAPTCHA.currentCaptcha.title) > -1;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 13,
            description: function () {
                return 'Your password must include a leap year';
            },
            type: 'plain',
            check: function () {
                let satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                suffix += '.0.';
                satisfiesSumDigits(prefix, suffix);
            },
            point: [10, 10, 10],
            satisfies: false,
            isSatisfied: function (string) {
                const extractedNumberString = extractNumber(string);
                const extractedNumber = extractedNumberString.map(Number);
                for (const number of extractedNumber) {
                    if ((number % 4 === 0 && number % 100 !== 0) || number % 400 === 0) {
                        return true;
                    }
                }
                return false;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            /**
             * (Emoji telur dari rule 11 digantikan dengan emoji ayam. 
             * Setiap X detik harus terdapat >= Y emoji ulat. 
             * Jika dalam X detik tersebut terdapat < Y ulat, pemain dinyatakan kalah)
             */
            number: 14,
            description: function () {
                return `🐔 Paul has hatched ! Please don't forget to feed him. He eats ${this.x[SCORE.level]} 🐛 every ${this.y[SCORE.level]} seconds`;
            },
            type: 'plain',
            check: function () {
                if (this.firstTime) {
                    this.firstTime = false;
                    this.isActive = true;
                    const idxEgg = stringMatch(PASSWORD.currentPassword, '🥚');
                    let prefix = PASSWORD.currentPassword.substring(0, idxEgg);
                    let suffix = PASSWORD.currentPassword.substring(idxEgg + 2, PASSWORD.currentPassword.length);
                    PASSWORD.currentPassword = prefix + '🐔' + suffix;
                    RULES.rules[10].item = '🐔';
                }
                if (!this.satisfies) {
                    SCORE.score += this.point[SCORE.level];
                    PASSWORD.lengthCut = PASSWORD.currentPassword.length - RULES.rules[14].x[SCORE.level];
                    console.log(`Your must delete ${RULES.rules[14].x[SCORE.level]} characters.`, `Your new password length must be ${PASSWORD.lengthCut}`);
                }
                this.satisfies = true;
                RULES.refreshRules(this.satisfies, this.number);
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                this.isActive = false;
                PASSWORD.currentPassword = prefix + suffix;
            },
            x: [5, 8, 16],
            y: [40, 30, 20],
            point: [20, 40, 60],
            satisfies: false,
            isSatisfied: function (_) {
                return true;
            },
            cheatOn: false,
            isActive: false,
            isFirstTime: true,
            firstTime: true,
            reset: function () {
                this.satisfies = false;
                this.cheatOn = false;
                this.isActive = false;
                this.isFirstTime = true;
                this.firstTime = true;
            }
        },
        {
            number: 15,
            description: function () {
                return `A sacrifice must be made. Pick ${this.x[SCORE.level]} letters that you will no longer be able to use`;
            },
            type: 'plain',
            check: function () {
                let satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (this.satisfies) {
                    satisfied = true;
                }
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                const deleteLength = this.x[SCORE.level];
                let check = PASSWORD.currentPassword.substring(0, RULES.indexCheat) + PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let i = 0;
                let count = 0;
                while (i < check.length && count < deleteLength) {
                    let prefix = check.substring(0, i);
                    let suffix = check.substring(i + 1, check.length);
                    let temp = prefix + suffix;
                    let valid = true;
                    for (let i = 0; i < 14; i++) {
                        if (!RULES.rules[i].isSatisfied(temp)) {
                            valid = false;
                            break;
                        }
                    }
                    if (valid) {
                        check = temp;
                        count++;
                        i--;
                    }
                    i++;
                }
                if (count === deleteLength) {
                    PASSWORD.currentPassword = check;
                } else {
                    SCORE.lose = true;
                }
            },
            x: [5, 10, 15],
            point: [10, 20, 30],
            satisfies: false,
            isSatisfied: function (string) {
                return string.length <= PASSWORD.lengthCut;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 16,
            description: function () {
                return 'Your password must contain one of the following words: I want IRK | I need IRK | I love IRK';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                PASSWORD.currentPassword = prefix + 'I want IRK' + suffix;
            },
            point: [10, 10, 10],
            satisfies: false,
            isSatisfied: function (string) {
                return stringMatch(string, 'I want IRK') + stringMatch(string, 'I need IRK') + stringMatch(string, 'I love IRK') > -3;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 17,
            description: function () {
                return `At least ${this.x[SCORE.level]}% of your password must be in digits`
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let remain = '0';
                PASSWORD.currentPassword = prefix + remain.repeat(extractDigit(Math.floor(PASSWORD.currentPassword.length * this.x[SCORE.level] / 100) + 1 - PASSWORD.currentPassword).length) + suffix;
            },
            x: [5, 15, 25],
            point: [10, 20, 30],
            satisfies: false,
            isSatisfied: function (string) {
                return extractDigit(string).length * 100 >= string.length * this.x[SCORE.level];
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 18,
            description: function () {
                return 'Your password must include the length of your password';
            },
            type: 'plain',
            check: function () {
                let satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let plength = prefix.length + suffix.length;
                console.log('Password length:', plength);
                if (plength < 7) {
                    PASSWORD.currentPassword = prefix + suffix + '.' + (plength + 3) + '.';
                } else if (plength < 96) {
                    PASSWORD.currentPassword = prefix + suffix + '.' + (plength + 4) + '.';
                } else if (plength < 995) {
                    PASSWORD.currentPassword = prefix + suffix + '.' + (plength + 5) + '.';
                } else if (plength < 9994) {
                    PASSWORD.currentPassword = prefix + suffix + '.' + (plength + 6) + '.';
                }
                let pref = PASSWORD.currentPassword.substring(0, PASSWORD.currentPassword.length);
                let suff = '';
                satisfiesSumDigits(pref, suff);
                console.log('finished');
            },
            point: [20, 20, 20],
            satisfies: false,
            isSatisfied: function (string) {
                const extractedNumber = extractNumber(string).map(Number);
                for (const number of extractedNumber) {
                    if (number === PASSWORD.currentPassword.length) {
                        return true;
                    }
                }
                return false;
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 19,
            description: function () {
                return 'The length of your password must be a prime number';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let check = prefix + suffix;
                let lengthPass = check.length.toString();
                let index = stringMatch(check, lengthPass);
                let nearestPrime = check.length;
                let i = check.length + 5;
                let found = false;
                while (!found) {
                    if (PRIME_SET.get(i)) {
                        found = true;
                        nearestPrime = i;
                    } else {
                        i++;
                    }
                }
                nearestPrime = i;
                let remain = '0'.repeat(nearestPrime - check.length - 2);
                PASSWORD.currentPassword = check.substring(0, index) + '.' + nearestPrime.toString() + '.' + check.substring(index + lengthPass.length, check.length) + remain;
                let pref = PASSWORD.currentPassword.substring(0, PASSWORD.currentPassword.length);
                let suff = '';
                satisfiesSumDigits(pref, suff);
            },
            point: [30, 30, 30],
            satisfies: false,
            isSatisfied: function (string) {
                return PRIME_SET.get(string.length);
            },
            reset: function () {
                this.satisfies = false;
            }
        },
        {
            number: 20,
            description: function () {
                return 'Your password must include the current time';
            },
            type: 'plain',
            check: function () {
                const satisfied = this.isSatisfied(PASSWORD.currentPassword);
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                if (satisfied) {
                    SCORE.win = true;
                }
                this.satisfies = satisfied;
            },
            cheat: function () {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat + 5, PASSWORD.currentPassword.length);
                let check = prefix + suffix;
                let lengthPass = check.length.toString();
                let index = stringMatch(check, lengthPass);
                let nearestPrime = check.length;
                let i = check.length + 9;
                let found = false;
                while (!found) {
                    if (PRIME_SET.get(i)) {
                        found = true;
                        nearestPrime = i;
                    } else {
                        i++;
                    }
                }
                nearestPrime = i;
                let date = new Date();
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                let currentTime = `${hour}${minute}`;
                let remain = '0'.repeat(nearestPrime - check.length - 6);
                PASSWORD.currentPassword = check.substring(0, index) + '.' + nearestPrime.toString() + '.' + currentTime + check.substring(index + lengthPass.length, check.length) + remain;
                let pref = PASSWORD.currentPassword.substring(0, PASSWORD.currentPassword.length);
                let suff = '';
                satisfiesSumDigits(pref, suff);
            },
            point: [40, 40, 40],
            satisfies: false,
            isSatisfied: function (string) {
                let date = new Date();
                const hour = String(date.getHours()).padStart(2, '0');
                const minute = String(date.getMinutes()).padStart(2, '0');
                const pattern1 = `${hour}:${minute}`;
                const pattern2 = `${hour}${minute}`;
                return stringMatch(string, pattern1) + stringMatch(string, pattern2) > -2;
            },
            reset: function () {
                this.satisfies = false;
            }
        }
    ]
}

export default RULES;

export function checkPassword() {
    if (RULES.currentRuleNumber === 0) {
        RULES.rules[0].check();
    }
    else {
        let index = 0;
        while (index < RULES.currentRuleNumber && index < 20) {
            RULES.rules[index].check();
            index++;
        }
    }
}