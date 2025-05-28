import AppHome from '@/components/AppHome'
import { useTelegram } from '@/hooks/useTelegram'
import { useEffect } from 'react'

const Home = () => {
  const { tg, user } = useTelegram()

  useEffect(() => {
    tg.ready()
    alert(`Web App is Loaded!\n${JSON.stringify(user)}`)
  }, [])

  return (
    <div className="flex justify-center items-center h-screen p-[20px]">
      <AppHome />
    </div>
  )
}

export default Home
