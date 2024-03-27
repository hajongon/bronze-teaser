import { createBrowserRouter } from 'react-router-dom'
import GeneralLayout from '../layout/GeneralLayout'
import { routerData } from './routerData'

// 여기서 basename을 설정. GitHub Pages에 배포하는 경우.
const router = createBrowserRouter(
  routerData.map((routerElement) => ({
    path: routerElement.path,
    element: <GeneralLayout>{routerElement.element}</GeneralLayout>,
  })),
  {
    basename: '/bronze-teaser', // 프로젝트 경로에 맞게 basename 설정
  }
)

export default router
