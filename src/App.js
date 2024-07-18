import { useEffect, useRef, useState } from "react";

// game components
import Input from "./components/Input/Input";
import Level from "./components/Level/Level";
import Header from "./components/Header/Header";
import RuleBox from "./components/RuleBox/RuleBox";

//utils
import { highlight } from "./util/highlight";
import arrayBufferToUrl from "./util/image-decoder";
import intervalRandom from "./util/random";
import getPasswordScore from "./util/password-score";
import stringMatch from "./util/kmp";
import { extractDigit } from "./util/extract";

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
    const selectedFlags = flags.slice(0, Math.min(3, flags.length));
    FLAG_CAPTCHA.currentFlags = selectedFlags;
    setCurrentFlags(selectedFlags);
  }, [flags]);

  //trigger current captcha
  useEffect(() => {
    if (captchas.length === 0) return;
    const selectedCaptcha = captchas[intervalRandom(captchas.length)];
    FLAG_CAPTCHA.currentCaptcha = selectedCaptcha;
    setCurrentCaptcha(selectedCaptcha);
  }, [captchas]);

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
    SCORE.level = LEVEL[newLevel];
    setLevel(newLevel);
  }

  function handlePasswordChange(newPassword) {
    const newPass = newPassword || "";
    PASSWORD.currentPassword = newPass;
    setCurrentPassword(newPass);
  }

  // For password change reevaluation
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      SCORE.addition = getPasswordScore(currentPassword);
      if (!initState){
        checkPassword();
      } else {
        initState = false;
      }
      const newScore = SCORE.addition + SCORE.score;
      console.log(highlight);
      setScore(prevScore => {
        return {
          score: newScore,
          bestScore: prevScore.bestScore
        }
      });
      setRuleSatisfied({ ...RULES });
      setInputHighlight([...highlight]);
    }, 200);
  }, [currentPassword, level]);

  return (
    <>
      <Header score={score} />
      <Input value={currentPassword} onChange={handlePasswordChange} highlight={inputHighlight} />
      <Level level={level} onChange={handleLevelChange} />
      <RuleBox rulesState={ruleSatisfied} flags={currentFlags} captcha={currentCaptcha} onCaptchaRefresh={handleRefreshCaptcha} />
    </>
  );
}

