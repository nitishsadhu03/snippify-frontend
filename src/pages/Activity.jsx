import Leftbar from '@/components/Leftbar'
import Topbar from '@/components/Topbar'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';


const Activity = () => {
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  
  
  useEffect(() => {
    if(!accessToken) {
      console.log(!accessToken)
      navigate("/")
    }

  }, [])

  return (
    <section className="bg-black">
      <Topbar />
      <div className="flex flex-row">
        <Leftbar/>
        <div className="text-white w-[84%] h-screen mt-4 py-9 px-8">
        <h1 className="text-2xl font-bold">Activity</h1>
        </div>
      </div>
    </section>
  )
}

export default Activity