import { useState, useEffect, KeyboardEvent } from 'react'
import styles from './Home.module.scss'
import { words } from '../data/words'
import { BsXLg } from 'react-icons/bs'

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
    // positions.push({ x: 10, y: 0 })
    // positions.push({ x: 18, y: 1 })
    // positions.push({ x: 18, y: 2 })
    // positions.push({ x: 18, y: 3 })
    // positions.push({ x: 18, y: 4 })
    // positions.push({ x: 18, y: 5 })
    // positions.push({ x: 18, y: 6 })
    // positions.push({ x: 18, y: 7 })
    // positions.push({ x: 18, y: 8 })
    // positions.push({ x: 18, y: 9 })
    // positions.push({ x: 18, y: 10 })
    // positions.push({ x: 18, y: 11 })
    // positions.push({ x: 18, y: 12 })
    // positions.push({ x: 18, y: 13 })
    // positions.push({ x: 18, y: 14 })
    // positions.push({ x: 18, y: 15 })
    // positions.push({ x: 18, y: 16 })
    // positions.push({ x: 18, y: 17 })
    // positions.push({ x: 18, y: 18 })
    // positions.push({ x: 18, y: 19 })
    // positions.push({ x: 18, y: 20 })
    // positions.push({ x: 18, y: 21 })
    // positions.push({ x: 18, y: 22 })
    // positions.push({ x: 18, y: 23 })
    // positions.push({ x: 18, y: 24 })
    // positions.push({ x: 18, y: 25 })
    // positions.push({ x: 18, y: 26 })
    // positions.push({ x: 18, y: 27 })
    // positions.push({ x: 18, y: 28 })
    // positions.push({ x: 18, y: 29 })
    for (let i = 0; i < words.length; i++) {
      // 예: 모든 단어를 x=10에 배치하고, y 좌표는 단어의 인덱스에 따라 증가
      positions.push({ x: 10, y: i }) // 각 단어마다 y 좌표를 다르게 설정
    }
    return positions
  }

  const [gridPositions] = useState(createGridPositions())
  const [wordObjects, setWordObjects] = useState<WordObject[]>([])
  const [score, setScore] = useState(0)
  const [currentInputValue, setCurrentInputValue] = useState('')

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
        let lostWords = 0 // 화면 하단에 도달한 단어의 수를 추적
        let showAlert = false // 경고 표시 여부

        const updatedWords = currentWords
          .map((word) => {
            // Y좌표를 업데이트 (예: 매 초마다 0.3씩 증가)
            return { ...word, position: { ...word.position, y: word.position.y + 0.3 } }
          })
          .filter((word) => {
            // 단어가 화면 하단에 도달했는지 확인
            if (word.position.y >= 10000) {
              lostWords++ // 화면 하단에 도달한 단어 수 증가
              if (score === 0) {
                // 점수가 0인 경우 경고 표시
                showAlert = true
              }
              return false // 화면 하단에 도달한 단어는 필터링
            }
            return true
          })

        if (showAlert) {
          // alert('단어를 놓쳤습니다! 게임 오버!') // 경고 메시지 표시
        }

        if (lostWords > 0) {
          // 화면 하단에 도달한 단어가 있으면 점수 감소
          setScore((prevScore) => Math.max(0, prevScore - lostWords)) // 점수는 음수가 되지 않도록 함
        }

        return updatedWords
      })
    }, 200) // 1초마다 업데이트

    return () => clearInterval(interval) // 컴포넌트 제거 시 인터벌 정리
  }, [score]) // score 의존성 추가

  return (
    <div className={styles.container}>
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
        <div className={styles.scoreBoard}>
          {/* <div className={styles.score}>점수: {score}</div> */}
        </div>
        {wordObjects.map((wordObject, index) => (
          <div
            key={index}
            className={styles.word}
            style={{
              left: `${wordObject.position.x * 4}%`,
              top: `calc(${wordObject.position.y * (100 / 30)}% - 674rem)`,
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
    </div>
  )
}

export default Home
