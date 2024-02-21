import Home from '../pages/Home'

type RouterElement = {
  id: number
  path: string
  label: string
  element: React.ReactNode
  //   onTapBar: boolean
  //   showTapBar: boolean
  //   withAuth: boolean
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
    // showTapBar: true,
    // withAuth: false,
  },
]

export const TapBarContent: TapBarElementType[] = routerData.reduce((prev, router) => {
  //   if (!router.onTapBar) return prev
  return [
    ...prev,
    {
      id: router.id,
      path: router.path,
      label: router.label,
    },
  ]
}, [] as TapBarElementType[])
