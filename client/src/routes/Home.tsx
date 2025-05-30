import AppHome from '@/components/AppHome'
import { useTelegram } from '@/hooks/useTelegram'
import { useEffect } from 'react'
import axios from '../axios.js'

const Home = () => {
  const { tg, user } = useTelegram()

  useEffect(() => {
    if (!user?.id) return

    axios
      .post(`/api/login?id=${user.id}`)
      .then(() => tg.ready())
      .catch(err => {
        console.log(err)

        tg.ready()
      })
  }, [user])

  return (
    <div className="flex justify-center items-center h-screen p-[20px]">
      <AppHome />
    </div>
  )
}

export default Home
