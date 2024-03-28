import { useState, useEffect } from 'react'

interface GameState {
  gameStarted: boolean
  isGameEnded: boolean
  score: number
  startGame: () => void
  setScore: React.Dispatch<React.SetStateAction<number>>
}

const useGameState = (): GameState => {
  const [gameStarted, setGameStarted] = useState(false)
  const [isGameEnded, setIsGameEnded] = useState(false)
  const [score, setScore] = useState(0)

  const startGame = () => {
    setGameStarted(true)
    setIsGameEnded(false)
    setScore(0)
  }

  const endGame = () => {
    alert('게임이 종료되었습니다.')
    setIsGameEnded(true)
    setGameStarted(false)
  }

  useEffect(() => {
    if (score < 0) {
      endGame()
    }
  }, [score])

  return { gameStarted, isGameEnded, score, setScore, startGame }
}

export default useGameState
