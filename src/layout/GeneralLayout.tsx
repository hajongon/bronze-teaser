import styles from './GeneralLayout.module.scss'

type GeneralLayoutProps = {
  children: React.ReactNode
}

export default function GeneralLayout({ children }: GeneralLayoutProps) {
  return <div className={styles.container}>{children}</div> // 또는 다른 유효한 JSX 요소
}
