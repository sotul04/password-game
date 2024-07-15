import { useState } from "react";

import Input from "./components/Input/Input";
import GameRule from "./components/GameRule/GameRule";
import Level from "./components/Level/Level";

import { addRomanHighlight, addNumberHighlight, clearHighlight, highlight } from "./util/highlight";

import chaptcha from './assets/captcha/fp3wy.png';
import flag1 from './assets/flags/england.png'
import flag2 from './assets/flags/france.png'
import flag3 from './assets/flags/georgia.png'

export default function App() {

  const [currentPassword, setCurrentPassword] = useState("");
  const [level, setLevel] = useState('Easy');

  function handleLevelChange(newLevel) {
    if (newLevel === 'Easy') {
      clearHighlight();
    } else if (newLevel === 'Medium') {
      addRomanHighlight(currentPassword);
    } else {
      addNumberHighlight(currentPassword);
    }
    setLevel(newLevel);
    console.log('This is the new Level:', newLevel);
  }

  function handlePasswordChange(newPassword) {
    if (level === 'Easy') {
      clearHighlight();
    } else if (level === 'Medium') {
      addRomanHighlight(currentPassword);
    } else {
      addNumberHighlight(currentPassword);
    }
    console.log('New highlight:',highlight);
    setCurrentPassword(newPassword);
  }

  return (
    <>
      <Input value={currentPassword} onChange={handlePasswordChange} highlight={highlight}/>
      <div className="m-auto">
        <Level level={level} onChange={handleLevelChange} />
      </div>
      <section className="w-screen">
        <div className="max-w-3xl p-5 mr-auto ml-auto">
            <GameRule number={1} description={'Password must strong.'} type={'plain'} isSatisfied={true} />
            <GameRule number={2} description={'Password must not strong.'} type={'plain'} isSatisfied={false} />
            <GameRule number={3} description={'Password must include this captcha:'} type={'captcha'} isSatisfied={false} images={chaptcha}/>
            <GameRule number={4} description={'Password must include one of this country:'} type={'country'} isSatisfied={true} images={[flag1,flag2,flag3]}/>
        </div>
      </section>
    </>
  );
}