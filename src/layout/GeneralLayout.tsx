type GeneralLayoutProps = {
  children: React.ReactNode
}

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  return <div>{children}</div> // 또는 다른 유효한 JSX 요소
}
