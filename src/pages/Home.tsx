import { useState, useEffect, KeyboardEvent } from 'react'
import styles from './Home.module.scss'
import { words } from '../data/words'

// 단어 객체의 타입 정의
interface WordObject {
  text: string
  position: {
    x: number
    y: number
  }
}

function Home() {
  // 격자의 각 셀 위치 생성
  const createGridPositions = () => {
    // const notCenterPositionArr = [3, 6, 9, 18, 21]
    const positions = []

    // for (let x = 0; x < 25; x = x + 3) {
    //   for (let y = 0; y < 25; y = y + 3) {
    //     if ((x > 10 && x < 15) || x === 0 || x === 24) {
    //       const randomIndex = Math.floor(Math.random() * notCenterPositionArr.length)
    //       const subX = notCenterPositionArr[randomIndex]
    //       positions.push({ x: subX, y: y + 50 })
    //     } else {
    //       positions.push({ x, y })
    //     }
    //   }
    // }

    // for (let y = 0; y < words.length; y++) {
    //   // 예: 모든 단어를 같은 X좌표에 배치하고 Y좌표만 증가시킵니다.
    //   // 요소 하나하나마다 원하는 position을 push해주면 됨 -> 이러면 끝
    //   positions.push({ x: 10, y: y })
    // }
    positions.push({ x: 10, y: 0 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    positions.push({ x: 18, y: 1 })
    return positions // 위치를 무작위로 섞음
  }

  const [gridPositions] = useState(createGridPositions())
  const [wordObjects, setWordObjects] = useState<WordObject[]>([])
  const [score, setScore] = useState(0)
  const [currentInputValue, setCurrentInputValue] = useState('')

  useEffect(() => {
    setScore(0)
  }, [])

  useEffect(() => {
    const newWordObjects = words.map((word, index) => {
      const position = gridPositions[index] // 무작위로 섞인 위치 중 하나를 선택
      console.log('Words count:', words.length)
      console.log('Grid positions count:', gridPositions.length)
      return { text: word, position }
    })
    setWordObjects(newWordObjects)
  }, [])

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value
      const index = wordObjects.findIndex((wordObject) => wordObject.text === value)
      if (index > -1) {
        setWordObjects(wordObjects.filter((_, i) => i !== index))
        setScore(score + 1)
        event.currentTarget.value = '' // 입력 필드 초기화
      }
      setCurrentInputValue('')
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setWordObjects((currentWords) => {
        return currentWords
          .map((word) => {
            // Y좌표를 업데이트 (예: 매 초마다 1씩 증가)
            return { ...word, position: { ...word.position, y: word.position.y + 0.3 } }
          })
          .filter((word) => {
            // 경계 조건 확인 (여기서는 Y좌표가 40보다 작은 경우만 남김)
            return word.position.y < 44
          })
      })
    }, 1000) // 1초마다 업데이트

    return () => clearInterval(interval) // 컴포넌트 제거 시 인터벌 정리
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.navbar}>
          <div>1</div>
          <div>타자 연습 게임</div>
          <div>1</div>
        </div>
        <div className={styles.headerContent}>1</div>
      </div>

      <div className={styles.gameContent}>
        <div className={styles.scoreBoard}>
          {/* <div className={styles.score}>점수: {score}</div> */}
        </div>
        {wordObjects.map((wordObject, index) => (
          <div
            key={index}
            className={styles.word}
            style={{
              left: `${wordObject.position.x * 4}%`,
              top: `calc(${wordObject.position.y * (100 / 30)}% - 6rem)`,
            }}
          >
            {wordObject.text}
          </div>
        ))}
        <div className={styles.typingControl}>
          <input
            type="text"
            onKeyDown={handleKeyDown}
            value={currentInputValue}
            onChange={(e) => setCurrentInputValue(e.target.value)}
          />
        </div>
      </div>
      <div className={styles.footer}>4</div>
      {/* <div className={styles.wavesBox}>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
        <div className={styles.waves}></div>
      </div> */}
    </div>
  )
}

export default Home
