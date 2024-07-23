import { useCallback, useEffect, useRef, useState } from "react";

// game components
import Input from "./components/Input/Input";
import Level from "./components/Level/Level";
import Header from "./components/Header/Header";
import RuleBox from "./components/RuleBox/RuleBox";
import Result from "./components/Result/Result";
import LevelDialog from "./components/LevelDialog/LevelDialog";

//utils
import { clearNumberHighlight, clearRomanHighlight, highlight } from "./util/highlight";
import arrayBufferToUrl from "./util/image-decoder";
import intervalRandom, { getListIndexRandomly } from "./util/random";
import getPasswordScore, { eatWorm, eraseLastOnePassword } from "./util/password-score";
import stringMatch from "./util/kmp";
import isFire from "./util/probs";

//models
import PASSWORD from "./model/Password";
import SCORE, { LEVEL } from "./model/Score";
import RULES, { checkPassword } from "./model/Rule";
import FLAG_CAPTCHA from "./model/FlagCaptcha";

//local-storage
const localGameName = 'bestPasswordGameScore';
const bestScore = JSON.parse(localStorage.getItem(localGameName)) || 0;
let initState = true;

export default function App() {

  const timer = useRef(null);
  const fireRule = useRef(null);
  const chickenRule = useRef(null);
  const dialogResult = useRef();
  const dialogLevel = useRef();

  const [currentPassword, setCurrentPassword] = useState(PASSWORD.currentPassword);
  const [flags, setFlags] = useState([]);
  const [captchas, setCaptchas] = useState([]);

  const [currentCaptcha, setCurrentCaptcha] = useState({
    title: 'loading...',
    description: 'loading-description...',
    image: null
  });
  const [currentFlags, setCurrentFlags] = useState([]);
  const [level, setLevel] = useState('Easy');
  const [score, setScore] = useState({
    score: 0,
    bestScore: bestScore
  });
  const [ruleSatisfied, setRuleSatisfied] = useState({
    ...RULES
  });
  const [inputHighlight, setInputHighlight] = useState([...highlight]);
  const [userWin, setUserWin] = useState(null);

  // loading flags and captchas
  useEffect(() => {
    async function fetchFlags() {
      try {
        const response = await fetch('https://bepassword-game.vercel.app/flags');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const dataFetched = data.map(item => {
          return {
            title: item.title,
            description: item.description,
            image: arrayBufferToUrl(item.image.data.data, item.image.contentType)
          }
        });
        setFlags(dataFetched);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    async function fetchCaptchas() {
      try {
        const response = await fetch('https://bepassword-game.vercel.app/captchas');
        if (!response.ok) {
          throw new Error('Failed to fetch images');
        }
        const data = await response.json();
        const dataFetched = data.map(item => {
          return {
            title: item.title,
            description: item.description,
            image: arrayBufferToUrl(item.image.data.data, item.image.contentType)
          }
        });
        setCaptchas(dataFetched);
      } catch (error) {
        console.error('Error fetching images:', error);
      }
    }

    fetchCaptchas();
    fetchFlags();
  }, []);

  //trigger current flags
  useEffect(() => {
    const array = getListIndexRandomly(flags.length, Math.min(4, flags.length));
    let newFlags = array.map(elm => flags[elm]);
    FLAG_CAPTCHA.currentFlags = newFlags;
    setCurrentFlags(newFlags);
  }, [flags]);

  //trigger current captcha
  useEffect(() => {
    if (captchas.length === 0) return;
    const selectedCaptcha = captchas[intervalRandom(captchas.length)];
    FLAG_CAPTCHA.currentCaptcha = selectedCaptcha;
    setCurrentCaptcha(selectedCaptcha);
  }, [captchas]);

  function handleRefreshFlags() {
    const array = getListIndexRandomly(flags.length, Math.min(4, flags.length));
    let newFlags = array.map(elm => flags[elm]);
    FLAG_CAPTCHA.currentFlags = newFlags;
    setCurrentFlags(newFlags);
  }

  function handleRefreshCaptcha() {
    let captchaLength = captchas.length;
    if (captchaLength === 0) return;
    let newIndex;
    do {
      newIndex = intervalRandom(captchaLength);
    } while (captchas[newIndex].title === currentCaptcha.title);
    FLAG_CAPTCHA.currentCaptcha = captchas[newIndex];
    setCurrentCaptcha(captchas[newIndex]);
  }

  function handleLevelChange(newLevel) {
    if (SCORE.level !== LEVEL[newLevel]) {
      SCORE.newLevel = newLevel;
      dialogLevel.current.changeNewLevel(newLevel);
      dialogLevel.current.open();
    }
  }

  function changeLevel(newLevel) {
    handleResetGame();
    SCORE.level = LEVEL[newLevel];
    setLevel(newLevel);
  }

  function handlePasswordChange(newPassword) {
    PASSWORD.currentPassword = newPassword;
    setCurrentPassword(newPassword);
  }

  const handleFireRule = useCallback(() => {
    if (fireRule.current === null) {
      console.log("Fire is try to attack your password.");
      fireRule.current = setInterval(() => {
        if (RULES.rules[9].isActive) {
          if (isFire() || RULES.rules[9].isFirstTime) {
            const newPassword = PASSWORD.currentPassword + '🔥';
            console.log(newPassword);
            RULES.rules[9].isFirstTime = false;
            handlePasswordChange(newPassword);
          }
          const indexFire = stringMatch(PASSWORD.currentPassword, '🔥');
          if (indexFire !== -1) {
            const newPassword = eraseLastOnePassword(PASSWORD.currentPassword);
            handlePasswordChange(newPassword);
          }
        }
      }, 8000);
    }
  }, []);

  const handleChickenRule = useCallback(() => {
    if (chickenRule.current === null) {
      console.log("Chicken Rule is activated.");
      chickenRule.current = setInterval(() => {
        if (RULES.rules[13].isActive) {
          if (eatWorm()) {
            handlePasswordChange(PASSWORD.currentPassword);
          } else {
            SCORE.lose = true;
            setUserWin(SCORE.win);
            clearRuleInterval();
            dialogResult.current.open();
          }
        }
      }, RULES.rules[13].y[SCORE.level] * 1000);
    }
  }, []);

  function clearRuleInterval() {
    // clear rule interval
    if (fireRule.current !== null) {
      clearInterval(fireRule.current);
    }
    if (chickenRule.current !== null) {
      clearInterval(chickenRule.current);
    }
  }

  function handleResetGame() {
    //reset the rules
    RULES.reset();

    // reset the password
    PASSWORD.reset();

    // reset the Score
    SCORE.reset();

    
    // reset the captcha
    if (captchas.length !== 0) {
      const selectedCaptcha = captchas[intervalRandom(captchas.length)];
      FLAG_CAPTCHA.currentCaptcha = selectedCaptcha;
    }
    
    initState = true;
    
    //clear highlight
    clearNumberHighlight();
    clearRomanHighlight();

    // reset the flags
    handleRefreshFlags();

    // reset State
    handlePasswordChange("");
    setCurrentCaptcha(FLAG_CAPTCHA.currentCaptcha);
    handleLevelChange('Easy');
    const newBestScore = JSON.parse(localStorage.getItem(localGameName)) || 0;
    setScore({
      score: 0,
      bestScore: newBestScore
    });
    setRuleSatisfied({ ...RULES });
    setInputHighlight([...highlight]);
  }

  // For password change reevaluation
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      RULES.indexCheat = stringMatch(PASSWORD.currentPassword, 'cheat');
      if (RULES.indexCheat !== -1) {
        let rulecheat = RULES.currentRuleNumber - 1;
        if (rulecheat < 0) {
          rulecheat = 0;
        }
        RULES.rules[rulecheat].cheat();
        if (PASSWORD.currentPassword !== currentPassword) {
          handlePasswordChange(PASSWORD.currentPassword);
        }
      }

      // checking password
      if (!initState) {
        checkPassword();
        if (PASSWORD.currentPassword !== currentPassword) {
          handlePasswordChange(PASSWORD.currentPassword);
        }
      } else {
        initState = false;
      }

      if (SCORE.lose || SCORE.win) {
        setUserWin(SCORE.win);
        clearRuleInterval();
        dialogResult.current.open();
        return;
      }

      // activate password fire rule
      if (RULES.currentRuleNumber >= 10) {
        if (RULES.rules[9].isActive && RULES.rules[9].isFirstTime) {
          handleFireRule();
        } else if (!RULES.rules[9].isActive && fireRule.current !== null) {
          clearInterval(fireRule.current);
        }
        if (RULES.currentRuleNumber >= 13) {
          if (RULES.rules[13].isActive && RULES.rules[13].isFirstTime) {
            handleChickenRule();
            RULES.rules[13].isFirstTime = false;
          } else if (!RULES.rules[13].isActive && chickenRule.current !== null) {
            clearInterval(chickenRule.current);
          }
        }
      }

      // reevaluate the state
      SCORE.addition = getPasswordScore(currentPassword);
      const newScore = SCORE.addition + SCORE.score;
      setScore(prevScore => {
        return {
          score: newScore,
          bestScore: prevScore.bestScore
        }
      });
      setRuleSatisfied({ ...RULES });
      setInputHighlight([...highlight]);
    }, 200);
  }, [currentPassword, handleChickenRule, handleFireRule]);

  return (
    <>
      <Result ref={dialogResult} userWin={userWin} score={score.score} onReset={handleResetGame} />
      <LevelDialog ref={dialogLevel} onChangeLevel={changeLevel} />
      <Header score={score} />
      <Input value={currentPassword} onChange={handlePasswordChange} highlight={inputHighlight} />
      <Level level={level} onChange={handleLevelChange} />
      <RuleBox rulesState={ruleSatisfied} flags={currentFlags} captcha={currentCaptcha} onCaptchaRefresh={handleRefreshCaptcha} />
    </>
  );
}

