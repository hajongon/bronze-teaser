import { useState, useEffect, KeyboardEvent } from 'react'
import styles from './Home.module.scss'
import { words } from '../data/words'
import { BsXLg } from 'react-icons/bs'
import AudioPlayer from '../components/AudioPlayer'
import onlyOne from '../assets/audio/onlyOne.mp3'
import { locations } from '../data/locations'

// 단어 객체의 타입 정의
interface WordObject {
  text: string
  position: {
    x: number
    y: number
  }
}

function Home() {
  // const createGridPositions = () => {
  //   const positions = []
  //   for (let i = 0; i < words.length; i++) {
  //     positions.push({ x: 10, y: i * 30 }) // 각 단어마다 y 좌표를 다르게 설정
  //   }
  //   return positions
  // }

  const [wordObjects, setWordObjects] = useState<WordObject[]>([])
  const [score, setScore] = useState(0)
  const [currentInputValue, setCurrentInputValue] = useState('')
  const [gameStarted, setGameStarted] = useState(false)

  const startGame = () => {
    setGameStarted(true)
  }

  // 점수에 따라 gaugeRed의 개수를 계산하는 함수
  const calculateGaugeColors = () => {
    const totalGauges = 17 // 전체 게이지 수
    const redGauges = Math.floor(score / 3) // 3점 당 하나의 gaugeRed
    const grayGauges = totalGauges - redGauges // 나머지는 gaugeGray

    // gaugeRed와 gaugeGray 배열 생성
    const gauges = []
    for (let i = 0; i < redGauges; i++) {
      gauges.push(<div key={`red-${i}`} className={styles.gaugeRed}></div>)
    }
    for (let i = 0; i < grayGauges; i++) {
      gauges.push(<div key={`gray-${i}`} className={styles.gaugeGray}></div>)
    }

    return gauges
  }

  useEffect(() => {
    setScore(0)
  }, [])

  useEffect(() => {
    const newWordObjects = words.map((word, index) => {
      let position: { x: number; y: number } = locations[index]
      if (word.length > 10) {
        position = { x: Math.random() * 500, y: index * 30 }
      }
      return { text: word, position }
    })
    setWordObjects(newWordObjects)
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (!gameStarted && event.key === 'Enter') {
      setGameStarted(true)
      return
    }
    if (gameStarted && event.key === 'Enter') {
      const value = event.currentTarget.value // 입력 값

      // 배열의 각 요소를 확인하여 조건에 맞는 가장 높은 인덱스 찾기
      const index = wordObjects.reduce((acc, wordObject, idx) => {
        return wordObject.text === value ? idx : acc
      }, -1)

      if (index > -1) {
        console.log(index)
        const newArr = wordObjects.filter((_, i) => i !== index)
        setWordObjects([...newArr]) // 해당 단어를 배열에서 제거
        setScore(score + 1) // 점수 증가
        event.currentTarget.value = '' // 입력 필드 초기화
      }
      setCurrentInputValue('') // 현재 입력 값 상태 업데이트
    }
  }

  useEffect(() => {
    if (gameStarted) {
      // 게임 시작 후 15초를 기다린 후 interval 시작
      const startDelay = setTimeout(() => {
        const interval = setInterval(() => {
          setWordObjects((currentWords) => {
            let lostWords = 0
            let showAlert = false

            const updatedWords = currentWords
              .map((word) => {
                return {
                  ...word,
                  position: { ...word.position, y: +(word.position.y + 16) },
                }
              })
              .filter((word) => {
                if (word.position.y >= 10000) {
                  lostWords++
                  if (score === 0) {
                    showAlert = true
                  }
                  return false
                }
                return true
              })

            if (showAlert) {
              // 경고 메시지 표시 로직 (주석 처리됨)
            }

            if (lostWords > 0) {
              setScore((prevScore) => Math.max(0, prevScore - lostWords * 3))
            }

            return updatedWords
          })
        }, 272) // 매 0.2초마다 단어 위치 업데이트

        return () => clearInterval(interval)
      }, 16000) // 15초 후 interval 시작

      return () => clearTimeout(startDelay) // 컴포넌트 제거 시 timeout 정리
    }
  }, [score, gameStarted]) // 의존성 배열에 score, gameStarted 추가

  return (
    <div className={styles.container}>
      <AudioPlayer src={onlyOne} play={gameStarted} />
      <div className={styles.header}>
        <div className={styles.navbar}>
          <div>{score}</div>
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
        {gameStarted ? (
          <div>
            {wordObjects.map((wordObject, index) => (
              <div
                key={index}
                className={styles.word}
                style={{
                  left: `${wordObject.position.x}px`,
                  top: `calc(${wordObject.position.y}px - 7500px)`,
                }}
              >
                {wordObject.text}
              </div>
            ))}
          </div>
        ) : (
          <button className={styles.startButton} onClick={startGame}>
            놀이를 시작합니다.
          </button>
        )}
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
