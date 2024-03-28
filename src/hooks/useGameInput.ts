import { useState, KeyboardEvent } from 'react'
import { WordObject } from './useWordObjects'

interface UseGameInputParams {
  gameStarted: boolean
  wordObjects: WordObject[]
  setScore: React.Dispatch<React.SetStateAction<number>>
}

function useGameInput({ gameStarted, wordObjects, setScore }: UseGameInputParams) {
  const [currentInputValue, setCurrentInputValue] = useState('')

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && gameStarted) {
      const value = event.currentTarget.value
      const index = wordObjects.reduce((acc, wordObject, idx) => {
        return wordObject.text === value ? idx : acc
      }, -1)

      if (index > -1) {
        setScore((prevScore) => prevScore + 1)
        setCurrentInputValue('')
      }
    }
  }

  return { currentInputValue, setCurrentInputValue, handleKeyDown }
}

export default useGameInput
