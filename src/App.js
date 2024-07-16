import { useEffect, useState } from "react";

import Input from "./components/Input/Input";
import GameRule from "./components/GameRule/GameRule";
import Level from "./components/Level/Level";

import { highlight } from "./util/highlight";
import arrayBufferToUrl from "./util/image-decoder";
import intervalRandom from "./util/random";

export default function App() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [level, setLevel] = useState('Easy');
  const [flags, setFlags] = useState([]);
  const [captchas, setCaptchas] = useState([]);

  const [currentCaptcha, setCurrentCaptcha] = useState({
    title: 'loading...',
    description: 'loading-description...',
    image: null
  });
  const [currentFlags, setCurrentFlags] = useState([]); 

  // loading flags and captchas
  useEffect(() => {
    async function fetchFlags() {
      try {
        const response = await fetch('http://localhost:3000/flags');
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
        const response = await fetch('http://localhost:3000/captchas');
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
    setCurrentFlags(flags.slice(0,Math.min(3, flags.length)));
  }, [flags]);

  //trigger current captcha
  useEffect(() => {
    if (captchas.length === 0) return;
    setCurrentCaptcha(captchas[intervalRandom(captchas.length)]);
  }, [captchas]);

  function handleRefreshCaptcha() {
    let captchaLength = captchas.length;
    if (captchaLength === 0) return;
    let newIndex;
    do {
      newIndex = intervalRandom(captchaLength);
    } while (captchas[newIndex].title === currentCaptcha.title);
    console.log("New captcha:", newIndex);
    setCurrentCaptcha(captchas[newIndex]);
  }

  function handleLevelChange(newLevel) {
    setLevel(newLevel);
    console.log('This is the new Level:', newLevel);
  }

  function handlePasswordChange(newPassword) {
    setCurrentPassword(newPassword);
  }

  return (
    <>
      <Input value={currentPassword} onChange={handlePasswordChange} highlight={highlight} />
      <div className="m-auto">
        <Level level={level} onChange={handleLevelChange} />
      </div>
      <section className="w-screen">
        <div className="max-w-3xl p-5 mr-auto ml-auto">
          <GameRule number={1} description={'Password must strong.'} type={'plain'} isSatisfied={true} />
          <GameRule number={2} description={'Password must not strong.'} type={'plain'} isSatisfied={false} />
          <GameRule number={3} description={'Password must include this captcha:'} type={'captcha'} isSatisfied={false} images={currentCaptcha} onRefresh={handleRefreshCaptcha}/>
          <GameRule number={4} description={'Password must include one of this country:'} type={'country'} isSatisfied={true} images={currentFlags} />
        </div>
      </section>
    </>
  );
}

