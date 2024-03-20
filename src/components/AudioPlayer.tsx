import { useEffect, useRef } from 'react'

interface AudioPlayerProps {
  src: string
  play: boolean
}

function AudioPlayer({ src, play }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  useEffect(() => {
    if (play) {
      audioRef.current?.play()
    } else {
      audioRef.current?.pause()
    }
  }, [play])

  return <audio ref={audioRef} src={src} />
}

export default AudioPlayer
