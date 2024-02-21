import { useState, KeyboardEvent } from 'react'
import styles from './Home.module.scss'

function Home() {
  // 가능한 위치들을 나타내는 배열 생성
  const createPositions = () => {
    const positions = []
    for (let i = 3; i < 22; i++) {
      // 4번째(16%)부터 22번째(84%) 위치까지
      positions.push(i * 4)
    }
    return positions
  }

  const [availablePositions, setAvailablePositions] = useState(createPositions())
  const [wordObjects, setWordObjects] = useState(
    ['브론즈', '싱글', '화이팅'].map((word) => {
      const positionIndex = Math.floor(Math.random() * availablePositions.length)
      const position = availablePositions.splice(positionIndex, 1)[0]
      return { text: word, position }
    })
  )
  const [score, setScore] = useState(0)

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      const value = event.currentTarget.value
      const index = wordObjects.findIndex((wordObject) => wordObject.text === value)
      if (index > -1) {
        // 단어 제거 시 해당 위치를 다시 사용 가능한 위치로 추가
        setAvailablePositions([...availablePositions, wordObjects[index].position])
        setWordObjects(wordObjects.filter((_, i) => i !== index))
        setScore(score + 1)
        event.currentTarget.value = '' // 입력 필드 초기화
      }
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div>1</div>
        <div>한메타자교사</div>
        <div>1</div>
      </div>
      <div className={styles.gameContent}>
        <div className={styles.scoreBoard}>
          <div className={styles.score}>점수: {score}</div>
        </div>
        {wordObjects.map((wordObject, index) => (
          <div key={index} className={styles.word} style={{ left: `${wordObject.position}%` }}>
            {wordObject.text}
          </div>
        ))}
      </div>
      <div className={styles.typingControl}>
        <input type="text" onKeyDown={handleKeyDown} />
      </div>
      <div className={styles.footer}>4</div>
    </div>
  )
}

export default Home
