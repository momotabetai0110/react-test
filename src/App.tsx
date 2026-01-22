import React from 'react';
//import logo from './logo.svg';
import './App.css';
import { useState } from "react";
import { useEffect } from "react";


//デフォルト
// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.tsx</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

function App() {
  console.log("App render");
  useEffect(() => {
    checkOnline();
  }, []);

  const [gender, setGender] = useState<boolean>(true);
  const [birthDate, setBirthDate] = useState("");
  const [job, setJob] = useState("");
  const [earlySociable, setEarlySociable] = useState("5");
  const [midSociable, setMidSociable] = useState("5");
  const [lateSociable, setLateSociable] = useState("5");
  const [result, setResult] = useState("");
  const [isOnline, setIsOnline] = useState<boolean>(false)
  const [viewStatus, setViewStatus] = useState(1) //1:入力フォーム 2:診断結果 3:ローディング

  const payload = {
    gender,
    birthDate,
    job,
    earlySociable: Number(earlySociable),
    midSociable: Number(midSociable),
    lateSociable: Number(lateSociable)
  }

  //入力フォーム送信
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setViewStatus(3)
    if (isOnline) {
      const response = await fetch("http://localhost:5156/api/face", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      setResult(result.response)
    } else {
      let message = "";
      const sociableSum = Number(earlySociable) + Number(midSociable) + Number(lateSociable)
      if (sociableSum >= 15) {
        message = "明るいんですね！";
      }
      else if (sociableSum >= 10) {
        message = "暗いんですね!";
      }
      else {
        message = "きもw";
      }
      setResult(message)
    }
    setViewStatus(2)
  };

  const checkOnline = () => {
    setIsOnline(false)
    console.log("checkOnline")
  }

  return (
    <div className="App">
      <header className='App-header'>
        {isOnline ?
          (
            <div className='App-status'>オンライン</div>
          ) : (
            <div className='App-status'>オフライン</div>
          )}

        <div className='App-title'>高性能性格診断！</div>
      </header>

      <div className='App-body'>
        {viewStatus === 1 && (
          <form onSubmit={handleSubmit}>
            <div className='App-form-list'>

              <div className='App-form-data'>
                <div className='App-description'>↓あなたのことを教えてね↓</div>
                <div className="App-form">
                  <div className='App-form-description'>性　　別</div>
                  <select
                    value={String(gender)}
                    onChange={(e) => setGender(e.target.value === "1")}
                  >
                    <option value="1">男性</option>
                    <option value="2">女性</option>
                  </select>
                </div>

                <div className="App-form">
                  <div className='App-form-description'>生年月日</div>
                  <input
                    type="date"
                    value={birthDate}
                    required
                    onChange={(e) => setBirthDate(e.target.value)}
                  />
                </div>

                <div className="App-form">
                  <div className='App-form-description'>職　　業</div>
                  <input
                    type="text"
                    value={job}
                    onChange={(e) => setJob(e.target.value)}
                  />
                </div>
              </div>
              <div className='App-form-sociable'>
                <div className='App-description'>↓年齢別に社交的だったか教えてね！↓<div>数値が高いほど社交的だよ</div></div>
                <div className="App-form">
                  <div className='App-form-description'>中学時代</div>
                  <input
                    type="range"
                    min="1" max="10"
                    value={earlySociable}

                    onChange={(e) => setEarlySociable(e.target.value)}
                  />
                  <span>{earlySociable}</span>
                </div>
                <div className="App-form">
                  <div className='App-form-description'>高校時代</div>
                  <input
                    type="range"
                    min="1" max="10"
                    value={midSociable}
                    onChange={(e) => setMidSociable(e.target.value)}
                  />
                  <span>{midSociable}</span>
                </div>
                <div className="App-form">
                  <div className='App-form-description'>現　　在</div>
                  <input
                    type="range"
                    min="1" max="10"
                    value={lateSociable}
                    onChange={(e) => setLateSociable(e.target.value)}
                  />
                  <span>{lateSociable}</span>
                </div>
              </div>
              <div><button type="submit">診断スタート!!</button></div>

            </div>
          </form>
        )}

        {viewStatus === 2 && (
          <div>{result}</div>
        )}

        {viewStatus === 3 && (
          <div>ローディング中...</div>
        )}
      </div>

    </div>
  )
}

export default App;
