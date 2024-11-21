import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(1500);
  const [playClock, setPlayClock] = useState(false);
  const intervalRef: any = useRef(null);
  const [clockState, setClockState] = useState("SESSION");
  const [color, setColor] = useState("white");


  useEffect(() => {
    if (timeLeft && playClock) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000)
    }

    return () => {
      clearInterval(intervalRef.current);
    }
  }, [playClock, timeLeft])

  useEffect(() => {
    setTimeout(() => {
      breakTime();
      sessionTime();
      alarm();
    }, 1000)
  }, [timeLeft])

  useEffect(() => {
    if (timeFormat() === "00:59") {
      setColor("red");
    }
  })

  const playTimer = () => {
    setPlayClock(!playClock);
  }

  const breakTime = () => {
    if (!timeLeft) {
      setClockState("BREAK");
      setTimeLeft(breakLength * 60);
    }
  }

  const sessionTime = () => {
    if (clockState === "BREAK" && !timeLeft) {
      setClockState("SESSION");
    }
  }

  const alarm = () => {
    if (!timeLeft) {
      const audio: any = document.getElementById("beep");
      audio.play();
    }
  }

  const resetTimer = () => {
    const audio: any = document.getElementById("beep");
    setPlayClock(false);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(1500);
    setClockState("SESSION");
    setColor("white");
    audio.pause();
    audio.currentTime = 0;
  }

  const breakDecrement = () => {
    if (playClock) {
      setBreakLength(breakLength);
    } else if (breakLength > 1) {
      setBreakLength(prev => prev -1);
    } else if (clockState === "BREAK") {
      setBreakLength(prev => prev - 1);
      setTimeLeft(() => (breakLength - 1) * 60);
    }
  }

  const breakIncrement = () => {
    if (playClock) {
      setBreakLength(breakLength);
    } else if (breakLength < 60) {
      setBreakLength(prev => prev + 1);
    } else if (clockState === "BREAK") {
      setBreakLength(prev => prev + 1);
      setTimeLeft(() => (breakLength + 1) * 60);
    }
  }

  const sessionDecrement = () => {
    if (playClock) {
      setSessionLength(sessionLength);
    } else if (sessionLength > 1) {
      setSessionLength(prev => prev -1);
      setTimeLeft(() => (sessionLength - 1) * 60);
    } else if (clockState === "BREAK") {
      setSessionLength(sessionLength);
    }
  }

  const sessionIncrement = () => {
    if (playClock) {
      setSessionLength(sessionLength);
    } else if (sessionLength < 60) {
      setSessionLength(prev => prev + 1);
      setTimeLeft(() => (sessionLength + 1) * 60);
    } else if (clockState === "BREAK") {
      setSessionLength(sessionLength);
    }
  }

  const timeFormat = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft - minutes * 60;
    const mins = minutes < 10 ? "0" + minutes : minutes;
    const secs = seconds < 10 ? "0" + seconds : seconds;

    return `${mins}:${secs}`;
  }

  const title = clockState === "SESSION" ? "Session" : "Break";

  return (
    <>
      <h2 id="main-title">25 + 5 Clock</h2>
        <div id="arw-control">
          <div id="break-label">Break Length</div>
            <div className="arrows"> 
              <button id="break-decrement" className="btn-level" onClick={breakDecrement}><i className='fa fa-arrow-down'></i></button>
              <div id="break-length">{breakLength}</div>
              <button id="break-increment" className="btn-level" onClick={breakIncrement}><i className='fa fa-arrow-up'></i></button>
            </div>
        </div>
        <div id="arw-control">
          <div id="session-label">Session Length</div>
            <div className="arrows">
              <button id="session-decrement" className="btn-level" onClick={sessionDecrement}><i className='fa fa-arrow-down'></i></button>
              <div id="session-length">{sessionLength}</div>
              <button id="session-increment" className="btn-level" onClick={sessionIncrement}><i className='fa fa-arrow-up'></i></button>
            </div>
        </div>
      <div id="timer">
        <div id="timer-label" style={{color: color}}>{title}</div>
        <div id="time-left" style={{color: color}}>{timeFormat()}</div>
        <button id="start_stop" onClick={playTimer}><i className="fa fa-play"></i><i className="fa fa-pause"></i></button>
        <button id="reset" onClick={resetTimer}><i className="fa fa-refresh"></i></button>
        <audio id="beep" preload="auto" src="https://cdn.freecodecamp.org/testable-projects-fcc/audio/BeepSound.wav"></audio>
      </div>
    </>
  )
}

export default App
