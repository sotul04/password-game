class RuleState {
    constructor(currentRule = 0, rules = []) {
        this.currentRule = currentRule;
        this.rules = [...rules];
    }

    addRule(rule, number) {
        if (number > this.currentRule) {
            this.rules.push(rule);
            this.currentRule++;
        } else {
            this.rules[number-1] = rule;
        }
    }

    clear() {
        this.currentRule = 0;
        this.rules.splice(0, this.rules.length);
    }
}

let array = new Array(10).fill(0);
console.log(array);