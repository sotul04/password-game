import { useState } from "react";
import Input from "./components/Input/Input";

export default function App() {
  
  const [currentPassword, setCurrentPassword] = useState("");

  function handlePasswordChange(newPassword) {
    setCurrentPassword(newPassword);
  }

  return (
    <Input value={currentPassword} onChange={handlePasswordChange}/>
  );
}