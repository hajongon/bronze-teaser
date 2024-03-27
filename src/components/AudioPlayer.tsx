import { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  src: string
  play: boolean
  isGameEnded: boolean
}

function AudioPlayer({ src, play, isGameEnded }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (play) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [play])

  useEffect(() => {
    if (isGameEnded) {
      if (audioRef.current) {
        audioRef.current.pause() // 음악을 일시 중지
        audioRef.current.currentTime = 0 // 재생 위치를 처음으로 설정
      }
    }
  }, [isGameEnded]) // isGameEnded에 대한 의존성 추가

  return <audio ref={audioRef} src={src} loop />
}

export default AudioPlayer
