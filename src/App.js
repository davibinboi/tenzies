import React from "react"
import "./style.css"
import Die from "./Components/Die"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App() {
  const [die, setDie] = React.useState(RollAllDie())
  const [tenzies, setTenzies] = React.useState(false)
  const [rolls, setRolls] = React.useState(0)
  const [startTime, setStartTime] = React.useState(Date.now())
  const [elapsed, setElapsed] = React.useState(null)


  function RollAllDie() {
    const numArr = []
    for (let i = 0; i < 10; i++) {
      const a = Math.floor(Math.random() * 6) + 1
      numArr.push({
        id: nanoid(),
        value: a,
        isHeld: false,
      })
    }
    return numArr
  }

  React.useState(() => {
    localStorage.setItem("bestTime", `${0}`)
  }, [])

  function changeColor(id) {
    setDie(prevDie => prevDie.map(die => {
      return die.id === id ? {...die, isHeld: !die.isHeld}: die;
    }))
  }

  React.useEffect(() => {
    const allHeld = die.every(die => die.isHeld)
    const first = die[0].value
    const allSameValue = die.every(die => die.value === first)
    if (allHeld && allSameValue) {
      const elapsedTime = Date.now() - startTime
      setElapsed(elapsedTime)
      if (localStorage.getItem("bestTime") == 0) {
        localStorage.setItem("bestTime", elapsedTime)
      } else if (elapsedTime < localStorage.getItem("bestTime")) {
        localStorage.setItem("bestTime", elapsedTime)
      }
      setTenzies(true)
    }
  }, [die])

  function RollSelect() {
    if (tenzies) {
      setDie(RollAllDie())
      setTenzies(false)
      setRolls(0)
      setStartTime(Date.now())
    } else {
      setDie(prevDie => prevDie.map(die => {
        const a = Math.floor(Math.random() * 6) + 1
        return die.isHeld ? die : {...die, value: a}
      }));
      setRolls(rolls => rolls + 1)
    }
  }
  const dieArr = die.map(obj => <Die 
    id={obj.id}
    className="die-box" 
    value={obj.value}
    isHeld={obj.isHeld}
    changeColor={() => changeColor(obj.id)}/>)
  return (
    <main className="main">
      {tenzies && <Confetti />}
      <h1>Tenzies</h1>
      <p>Roll until all dice are the same.
        Click each die to freeze it at its current value between rolls.</p>
      <div className="number-grid">
      {dieArr}
      </div>
      <button 
      className="button"
      onClick={RollSelect}>{tenzies ? "Start New Game" : "Roll Die!"}</button>
      <p className="rolls-name">Number of Rolls: {rolls}</p>
      {tenzies && <p className="time">Elapsed Time: {Math.floor(elapsed/1000)} seconds</p>}
      <p className="bestTime">Best Time: {localStorage.getItem("bestTime") == 0 ? 
      "You have no best time" : 
      `${Math.floor(localStorage.getItem("bestTime")/1000)} seconds`}</p>
    </main>
  );
}
