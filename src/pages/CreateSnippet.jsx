import CreateSnippetSection from "@/components/CreateSnippetSection"
import Leftbar from "@/components/Leftbar"
import Topbar from "@/components/Topbar"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateSnippet = () => {
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