import FLAG_CAPTCHA from "./FlagCaptcha";
import PASSWORD from "./Password";
import SCORE from "./Score";
import { extractNumber, extractRomanNumber, extractDigit } from "../util/extract";
import { countDigits, countSpecialCharacters, countUppercaseLetters } from "../util/password-score";
import stringMatch from "../util/kmp";
import { addNumberHighlight, addRomanHighlight, clearNumberHighlight, clearRomanHighlight } from "../util/highlight";
import romanToDecimal from "../util/roman-parse";

const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const RULES = {
    currentRuleNumber: 0,
    refreshRules: function(satisfied, number) {
        if (number === 1 && !satisfied && this.currentRuleNumber === 0) {
            this.currentRuleNumber = 1;
            return;
        }
        if (satisfied && this.currentRuleNumber <= number) {
            this.currentRuleNumber = number+1;
        }
    },
    indexCheat: -1,
    reset: function(){
        this.currentRuleNumber = 0;
        this.indexCheat = -1;
        for (const rule of this.rules) {
            rule.reset();
        }
    },
    rules: [
        {
            number: 1,
            description: function() {
                return `Your password must be at least ${this.x[SCORE.level]} characters`;
            }, 
            type: 'plain',
            check: function () {
                const satisfied = PASSWORD.currentPassword.length >= this.x[SCORE.level];
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat+5, PASSWORD.currentPassword.length);
                let remainChars = this.x[SCORE.level] - (prefix.length + suffix.length);
                let remain = '0';
                if (remainChars > 0){
                    remain = remain.repeat(remainChars);
                }
                PASSWORD.currentPassword = prefix + remain + suffix;
            },
            x: [5, 10, 20],
            point: [10, 20, 30],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 2,
            description: function() {
                return 'Your password must include a number';
            },
            type: 'plain',
            check: function() {
                const satisfied = countDigits(PASSWORD.currentPassword) > 0;
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 3,
            description: function() {
                return 'Your password must include an uppercase letter';
            },
            type: 'plain',
            check: function() { 
                const satisfied = countUppercaseLetters(PASSWORD.currentPassword) > 0;
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 4,
            description: function(){
                return 'Your password must include a special character';
            },
            type: 'plain',
            check: function() { 
                const satisfied = countSpecialCharacters(PASSWORD.currentPassword) > 0;
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 5,
            description: function() {
                return `The digits in your password must add up to ${this.x[SCORE.level]}`
            },
            type: 'plain',
            check: function() { 
                const sumNumber = extractDigit(PASSWORD.currentPassword).reduce((acc, val) => acc + val, 0);
                const satisfied = sumNumber === this.x[SCORE.level];
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
            cheat: function() {

            },
            x: [25, 50, 100],
            point: [10, 20, 30],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 6,
            description: function() {
                return 'Your password must include a month of the year';
            },
            type: 'plain',
            check: function() {
                let satisfied = false;
                for (const month of months) {
                    if (stringMatch(PASSWORD.currentPassword, month) !== -1) {
                        satisfied = true;
                        break;
                    }
                }
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [20, 20, 20],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 7,
            description: function() {
                return 'Your password must include a Roman numeral';
            },
            type: 'plain',
            check: function() {
                const satisfied = extractRomanNumber(PASSWORD.currentPassword).length > 0;
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            /**
             * (Anda harus mencari minimal 10 gambar bendera negara. 
             * Tampilkan X bendera saja pada 1 sesi permainan)
             */
            number: 8,
            description: function() {
                return 'Your password must include one of this country:';
            },
            type: 'country',
            check: function() {
                let satisfied = false;
                for (const flag of FLAG_CAPTCHA.currentFlags) {
                    const strings = PASSWORD.currentPassword.match(new RegExp(`${flag.title}`, 'gi')) || [];
                    if (strings.filter(string => string !== '').length > 0) {
                        satisfied = true;
                        break;
                    }
                }
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 9,
            description: function() { 
                return `The Roman numerals in your password should multiply to ${this.x[SCORE.level]}`;
            },
            type: 'plain',
            check: function() {
                const satisfied = extractRomanNumber(PASSWORD.currentPassword).reduce((acc, val) => acc * romanToDecimal(val), 1) === this.x[SCORE.level];
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
            cheat: function() {

            },
            x: [35, 70, 140],
            point: [20, 40, 60],
            satisfies: false,
            reset: function() {
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
            description: function() {
                return 'Oh no! Your password is on fire 🔥. Quick, put it out!';
            },
            type: 'plain',
            check: function() {
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
            cheat: function() {
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat+5, PASSWORD.currentPassword.length);
                this.isActive = false;
                PASSWORD.currentPassword = prefix + suffix;
            },
            isActive: false,
            firstTime: true,
            isFirstTime: true,
            point: [20, 20, 20],
            satisfies: false,
            reset: function() {
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
            description: function() {
                return '🥚 This is my chicken Paul. He hasn\'t hatched yet. Please put him in your password and keep him safe';
            },
            type: 'plain',
            check: function() {
                const satisfied = stringMatch(PASSWORD.currentPassword, '🥚') > -1;
                if (this.wasPut && !satisfied && !this.cheatOn) {
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
            cheat: function() {
                RULES.rules[9].isActive = false;
                let prefix = PASSWORD.currentPassword.substring(0, RULES.indexCheat);
                let suffix = PASSWORD.currentPassword.substring(RULES.indexCheat+5, PASSWORD.currentPassword.length);
                this.cheatOn = true;
                PASSWORD.currentPassword = '🥚'+prefix+suffix;
            },
            point: [10, 10, 10],
            cheatOn: false,
            wasPut: false,
            satisfies: false,
            reset: function() {
                this.cheatOn = false;
                this.wasPut = false;
                this.satisfies = false;
            }
        },
        {
            /**
             * (Anda harus mencari minimal 7 gambar CAPTCHA. 
             * Tampilkan 1 gambar CAPTCHA saja pada 1 sesi permainan. 
             * Gambar CAPTCHA dapat seolah-olah di-refresh untuk mengganti gambar CAPTCHA)
             */
            number: 12,
            description: function() {
                return 'Your password must include this CAPTCHA:';
            },
            type: 'captcha',
            check: function() {
                const satisfied = stringMatch(PASSWORD.currentPassword, FLAG_CAPTCHA.currentCaptcha.title) > -1;
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {
            },
            point: [15, 15, 15],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 13,
            description: function() {
                return 'Your password must include a leap year';
            },
            type: 'plain',
            check: function() {
                let satisfied = false;
                const extractedNumberString = extractNumber(PASSWORD.currentPassword);
                const extractedNumber = extractedNumberString.map(Number);
                for (const number of extractedNumber) {
                    if ((number%4 === 0 && number%100 !== 0) || number%400 === 0) {
                        satisfied = true;
                        break;
                    }
                }
                if (!this.satisfies && satisfied) {
                    SCORE.score += this.point[SCORE.level];
                } else if (this.satisfies && !satisfied) {
                    SCORE.score -= this.point[SCORE.level];
                }
                RULES.refreshRules(satisfied, this.number);
                this.satisfies = satisfied;
            },
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
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
            description: function(){
                return `🐔 Paul has hatched ! Please don\'t forget to feed him. He eats ${this.x[SCORE.level]} 🐛 every ${this.y[SCORE.level]} second`;
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            x: [5, 8, 16],
            y: [40, 30, 20],
            point: [20, 20, 20],
            satisfies: false,
            cheatOn: false,
            isActive: false,
            isFirstTime: true,
            firstTime: true,
            reset: function() {
                this.satisfies = false;
                this.cheatOn = false;
                this.isActive = false;
                this.isFirstTime = true;
                this.firstTime = true;
            }
        },
        {
            number: 15,
            description: function(){
                return `A sacrifice must be made. Pick ${this.x[SCORE.level]} letters that you will no longer be able to use`;
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            x: [5, 10, 20],
            point: [10, 20, 30],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 16,
            description: function() {
                return 'Your password must contain one of the following words: I want IRK | I need IRK | I love IRK';
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            point: [10, 10, 10],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 17,
            description: function() {
                return `At least ${this.x[SCORE.level]}% of your password must be in digits`
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            x: [5, 15, 25],
            point: [10, 20, 30],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 18,
            description: function() {
                return 'Your password must include the length of your password';
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            point: [20, 20, 20],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 19,
            description: function(){
                return 'The length of your password must be a prime number';
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            point: [30, 30, 30],
            satisfies: false,
            reset: function() {
                this.satisfies = false;
            }
        },
        {
            number: 20,
            description: function() {
                return 'Your password must include the current time';
            },
            type: 'plain',
            check: null,
            cheat: function() {

            },
            point: [40, 40, 40],
            satisfies: false,
            reset: function() {
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
        while (index < RULES.currentRuleNumber && index < 13) {
            RULES.rules[index].check();
            // console.log('cheking number', index+1, RULES.rules[index].satisfies);
            // console.log('number reached now:', RULES.currentRuleNumber);
            index++;
        }
    }
}