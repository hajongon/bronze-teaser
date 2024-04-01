import { useState, useEffect, KeyboardEvent, useRef } from 'react'
import styles from './Home.module.scss'
import { words } from '../data/words'
import { BsXLg } from 'react-icons/bs'
import AudioPlayer from '../components/AudioPlayer'
import onlyOne from '../assets/audio/onlyOne.mp3'
import { locations } from '../data/locations'
import * as React from 'react'
import eightBallLogo from '../assets/img/eight-ball-logo.png'
import keyboardLogo from '../assets/img/keyboard-logo.png'

// 단어 객체의 타입 정의
interface WordObject {
  text: string
  position: {
    x: number
    y: number
  }
  isDanger: boolean
  isFrozen: boolean
  isLost: boolean
  ref: React.RefObject<HTMLDivElement> // ref 추가
}

function Home() {
  const [wordObjects, setWordObjects] = useState<WordObject[]>([])
  const [score, setScore] = useState(0)
  const [currentInputValue, setCurrentInputValue] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const [isGameEnded, setIsGameEnded] = useState(false)

  // useRef를 사용하여 interval과 startDelay 참조를 저장
  const intervalRef = useRef<number | null>(null)
  const startDelayRef = useRef<number | null>(null)

  const startGame = () => {
    setGameStarted(true)
    setIsGameEnded(false)
    setScore(0)
    // 게임 시작 시에 이전 게임의 interval과 startDelay를 정리합니다.
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (startDelayRef.current) clearTimeout(startDelayRef.current)
    // setWordObjects(initializeWordObjects()) // 단어 객체들을 초기화하는 로직
  }

  const changeToStartButton = () => {
    setIsGameEnded(false)
    setGameStarted(false)
  }

  // 점수에 따라 gaugeRed의 개수를 계산하는 함수
  const calculateGaugeColors = () => {
    const totalGauges = 17 // 전체 게이지 수
    const redGauges = Math.floor(score / 3) // 3점 당 하나의 gaugeRed
    const grayGauges = redGauges <= 17 ? totalGauges - redGauges : 0 // 나머지는 gaugeGray

    // gaugeRed와 gaugeGray 배열 생성
    const gauges = []
    for (let i = 0; i < redGauges; i++) {
      // 게이지 개수 에러 해결
      if (i >= 17) return gauges
      gauges.push(<div key={`red-${i}`} className={styles.gaugeRed}></div>)
    }
    for (let i = 0; i < grayGauges; i++) {
      // 게이지 개수 에러 해결
      if (i >= 17) return gauges
      gauges.push(<div key={`gray-${i}`} className={styles.gaugeGray}></div>)
    }

    return gauges
  }

  // 중심값 계산 로직
  const calculateCenter = (wordObj: WordObject) => {
    const rect = wordObj.ref.current?.getBoundingClientRect()
    if (rect) {
      const centerX = rect.left + rect.width / 2 // 중심값 계산
      return centerX
    }
  }

  // 게임 시작 시
  useEffect(() => {
    if (gameStarted) {
      setScore(0)
      const newWordObjects = words.map((word, index) => {
        let position: { x: number; y: number } = locations[index]
        if (word.length > 10) {
          position = { x: Math.random() * 500, y: index * 60 }
        }
        return {
          text: word,
          position,
          isDanger: false,
          isFrozen: false,
          isLost: false,
          ref: React.createRef<HTMLDivElement>(),
        }
      })
      setWordObjects(newWordObjects)
    }
  }, [gameStarted])

  // 게임 종료 시
  useEffect(() => {
    if (isGameEnded) {
      // setIsGameEnded(false)
      setScore(0)
      setGameStarted(false)
      setWordObjects([])
    }
  }, [isGameEnded])

  // 단어 입력 시
  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (gameStarted && event.key === 'Enter') {
      const value = event.currentTarget.value // 입력 값

      // 배열의 각 요소를 확인하여 조건에 맞는 가장 높은 인덱스 찾기
      const index = wordObjects.reduce((acc, wordObject, idx) => {
        return wordObject.text === value ? idx : acc
      }, -1)

      if (index > -10) {
        const newArr = wordObjects.filter((_, i) => i !== index)
        setWordObjects([...newArr]) // 해당 단어를 배열에서 제거
        setScore((prevScore) => prevScore + 2)
        event.currentTarget.value = '' // 입력 필드 초기화
      }
      setCurrentInputValue('') // 현재 입력 값 상태 업데이트
    }
  }

  // 단어 위치 조정
  useEffect(() => {
    if (gameStarted) {
      startDelayRef.current = setTimeout(() => {
        intervalRef.current = setInterval(() => {
          setWordObjects((currentWords) => {
            const updatedWords = currentWords
              .map((word) => {
                const centerX = calculateCenter(word) || word.position.x
                // 단어의 y값이 특정 구간에 도달하면
                if (word.position.y >= 15480) {
                  // 위험 is true
                  word.isDanger = true
                }
                // 단어가 최하단에 도착하면 잠깐 멈춘다.
                if (
                  !word.isFrozen &&
                  centerX >= 255 &&
                  centerX <= 710 &&
                  word.position.y >= 15536
                ) {
                  word.isFrozen = true
                  setTimeout(() => {
                    word.isLost = true
                  }, 5000)
                }
                if (!word.isFrozen && word.position.y >= 15583) {
                  word.isFrozen = true
                  // 3초 후, 단어 삭제를 위한 속성 변경
                  setTimeout(() => {
                    word.isLost = true
                  }, 5000)
                }
                // 단어가 frozen 이면 위치 변경 X
                if (word.isFrozen) return word
                return {
                  ...word,
                  position: { ...word.position, y: +(word.position.y + 17) },
                }
              })
              //
              .filter((word) => {
                // lost true면 단어 삭제
                if (word.isLost) {
                  setScore((prevScore) => prevScore - 1)
                  return false
                }
                return true
              })
            return updatedWords
          })
        }, 150) // 매 0.2초마다 단어 위치 업데이트
      }, 14500) // 15초 후 interval 시작

      return () => {
        // 컴포넌트 제거 시 또는 의존성 배열에 포함된 상태가 변경될 때 interval과 startDelay를 정리
        if (intervalRef.current) clearInterval(intervalRef.current)
        if (startDelayRef.current) clearTimeout(startDelayRef.current)
      }
    }
  }, [gameStarted])

  useEffect(() => {
    if (score < -5) {
      // alert('게임이 종료되었습니다.')
      setGameStarted(false)
      setIsGameEnded(true)
    }
  }, [score])

  useEffect(() => {
    // Define the handler function within the effect to ensure it has access to the current state
    const handleKeyPress = (event: KeyboardEvent) => {
      // Check for Enter or Space press
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault() // Prevent default to avoid triggering any unintended behavior
        if (!gameStarted && !isGameEnded) {
          startGame()
        } else if (!gameStarted && isGameEnded) {
          changeToStartButton()
        }
      }
    }

    // Conditionally add the event listener based on game states
    if (!gameStarted) {
      window.addEventListener('keydown', handleKeyPress as any)
    }

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener('keydown', handleKeyPress as any)
    }
  }, [gameStarted, isGameEnded]) // Depend on gameStarted and isGameEnded to re-attach the listener when needed

  return (
    <div className={styles.container}>
      <AudioPlayer src={onlyOne} play={gameStarted} isGameEnded={isGameEnded} />
      <div className={styles.header}>
        <div className={styles.navbar}>
          <div className={styles.logoBox}>
            <img src={eightBallLogo} />
            <img src={keyboardLogo} />
          </div>
          <div>타자 연습 게임</div>
          <div className={styles.xBox}>
            <BsXLg />
          </div>
        </div>
        <div className={styles.headerContent}>
          <div className={styles.songTitle}>Only One (Feat.Hash Swan, punchnello)</div>
          <div className={styles.albumTitle}>브론즈 - 매직스테이션1</div>
          <div className={styles.scoreGauge}>
            <div className={styles.phText}>pH:</div>
            <div className={styles.gaugeBox}>{calculateGaugeColors()} </div>
          </div>
        </div>
      </div>

      <div className={styles.gameContent}>
        <div className={styles.gridLine}></div>
        {/* <div className={styles.scoreBoard}></div> */}
        {gameStarted && !isGameEnded ? (
          <div>
            {wordObjects.map((wordObject, index) => (
              <div
                key={index}
                className={styles.word}
                style={{
                  left: `${wordObject.position.x}px`,
                  top: `calc(${wordObject.position.y}px - 14963px)`,
                  color: wordObject.isDanger ? 'red' : 'black',
                }}
              >
                {wordObject.text}
              </div>
            ))}
          </div>
        ) : !gameStarted && isGameEnded ? (
          <button className={styles.endButton} onClick={changeToStartButton}>
            놀이가 끝났습니다.
          </button>
        ) : !gameStarted && !isGameEnded ? (
          <button className={styles.startButton} onClick={startGame}>
            놀이를 시작합니다.
          </button>
        ) : null}
        <div className={styles.typingControl}>
          <input
            type="text"
            onKeyDown={handleKeyDown}
            value={currentInputValue}
            onChange={(e) => setCurrentInputValue(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.footer}>
        <div className={styles.languageBox}>한글-2</div>
        <div className={styles.footerBox1}></div>
        <div className={styles.footerBox2}></div>
      </div>
    </div>
  )
}

export default Home
