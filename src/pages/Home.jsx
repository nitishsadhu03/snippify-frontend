import Leftbar from "@/components/Leftbar";
import Snippets from "@/components/Snippets";
import Topbar from "@/components/Topbar";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";



const Home = () => {
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
        <Snippets/>
      </div>
    </section>
  );
};

export default Home;
