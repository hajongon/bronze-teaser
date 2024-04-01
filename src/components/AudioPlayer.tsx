import { useEffect, useRef, useState } from 'react'

interface AudioPlayerProps {
  src: string
  play: boolean
  isGameEnded: boolean
}

function AudioPlayer({ src, play, isGameEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [hasEnded, setHasEnded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (audio) {
      const handleEnded = () => {
        setHasEnded(true) // Update state when song ends
        audio.pause()
        audio.currentTime = 0 // Reset to start
      }

      // Add ended event listener
      audio.addEventListener('ended', handleEnded)

      // Return cleanup function to remove event listener
      return () => {
        audio.removeEventListener('ended', handleEnded)
      }
    }
  }, [])

  useEffect(() => {
    if (play && !hasEnded) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [play, hasEnded])

  useEffect(() => {
    if (isGameEnded) {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
        setHasEnded(false) // Reset hasEnded state for next game
      }
    }
  }, [isGameEnded])

  return <audio ref={audioRef} src={src} />
}

export default AudioPlayer
