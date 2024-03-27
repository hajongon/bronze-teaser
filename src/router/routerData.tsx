import Home from '../pages/Home'

type RouterElement = {
  id: number
  path: string
  label: string
  element: React.ReactNode
}

export type TapBarElementType = {
  id: number
  path: string
  label: string
}

export const routerData: RouterElement[] = [
  {
    id: 1,
    path: '/',
    label: '홈',
    element: <Home />,
  },
  {
    id: 2,
    path: '*',
    label: '에러',
    element: (
      <p>
        <div>Page Not Found</div>
        <a href="http://localhost:5173/bronze-teaser/">게임하러 가기</a>
      </p>
    ),
  },
]

export const TapBarContent: TapBarElementType[] = routerData.reduce((prev, router) => {
  return [
    ...prev,
    {
      id: router.id,
      path: router.path,
      label: router.label,
    },
  ]
}, [] as TapBarElementType[])
