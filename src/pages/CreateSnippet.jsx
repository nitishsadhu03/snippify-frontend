import CreateSnippetSection from "@/components/CreateSnippetSection"
import Leftbar from "@/components/Leftbar"
import Topbar from "@/components/Topbar"
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateSnippet = () => {
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
        <Topbar/>
        <div className="flex flex-row">
            <Leftbar/>
            <CreateSnippetSection/>
        </div>
        <ToastContainer/>
    </section>
  )
}

export default CreateSnippet