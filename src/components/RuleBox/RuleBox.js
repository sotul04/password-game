import GameRule from "../GameRule/GameRule";

export default function RuleBox({ rulesState, flags, captcha, onCaptchaRefresh }) {

    let reachedNumber = rulesState.currentRuleNumber;
    const rules = rulesState.rules.slice(0, reachedNumber);

    const okRules = rules.filter(rule => rule.satisfies).reverse();
    const notOkRules = rules.filter(rule => !rule.satisfies).reverse();

    return (
        <section key='rule-box' className="w-screen">
            <div className="max-w-3xl p-5 mr-auto ml-auto">
                {notOkRules.map(rule => {
                    if (rule.type === 'country') {
                        return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} images={flags} key={`${rule.number}${rule.satisfies}`} />
                    }
                    if (rule.type === 'captcha') {
                        return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} images={captcha} onRefresh={onCaptchaRefresh} key={`${rule.number}${rule.satisfies}`} />
                    }
                    return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} key={`${rule.number}${rule.satisfies}`}/>
                })}
                {okRules.map(rule => {
                    if (rule.type === 'country') {
                        return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} images={flags} key={`${rule.number}${rule.satisfies}`}/>
                    }
                    if (rule.type === 'captcha') {
                        return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} images={captcha} onRefresh={onCaptchaRefresh} key={`${rule.number}${rule.satisfies}`} />
                    }
                    return <GameRule number={rule.number} description={rule.description()} type={rule.type} isSatisfied={rule.satisfies} key={`${rule.number}${rule.satisfies}`} />
                })}
            </div>
        </section>
    );
}