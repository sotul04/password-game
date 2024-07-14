import { useState } from "react";
import Input from "./components/Input/Input";
import GameRule from "./components/GameRule/GameRule";

export default function App() {

  const [currentPassword, setCurrentPassword] = useState("");

  function handlePasswordChange(newPassword) {
    setCurrentPassword(newPassword);
  }

  return (
    <>
      <Input value={currentPassword} onChange={handlePasswordChange} />
      <section className="w-screen">
        <div className="max-w-3xl p-5 mr-auto ml-auto">
            <GameRule number={1} description={'Password must strong.'} key={1} isSatisfied={true} />
            <GameRule number={2} description={'Password must not strong.'} key={2} isSatisfied={false} />
        </div>
      </section>
    </>
  );
}