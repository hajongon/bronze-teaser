import { useState, useEffect } from 'react'

// 단어 객체 타입 정의
export interface WordObject {
  text: string
  position: {
    x: number
    y: number
  }
  isDanger: boolean
  isFrozen: boolean
  isLost: boolean
}

// useWordObjects 훅 파라미터 타입 정의
interface UseWordObjectsParams {
  gameStarted: boolean
  score: number
  words: string[]
  locations: { x: number; y: number }[]
}

export function useWordObjects({
  gameStarted,
  words,
  locations,
}: UseWordObjectsParams): WordObject[] {
  const [wordObjects, setWordObjects] = useState<WordObject[]>([])

  useEffect(() => {
    if (gameStarted) {
      const newWordObjects: WordObject[] = words.map((word, index) => {
        let position = locations[index] ?? { x: 0, y: 0 }
        if (word.length > 10) {
          position = { x: Math.random() * 500, y: index * 30 }
        }
        return { text: word, position, isDanger: false, isFrozen: false, isLost: false }
      })
      setWordObjects(newWordObjects)
    }
  }, [gameStarted, words, locations])

  return wordObjects
}
