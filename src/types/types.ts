// words.ts 또는 types.ts 파일 내에 정의

export interface WordObject {
  text: string
  position: Position
  isDanger: boolean
  isFrozen: boolean
  isLost: boolean
}

export interface Position {
  x: number
  y: number
}
