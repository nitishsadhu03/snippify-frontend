import Leftbar from "@/components/Leftbar";
import Snippets from "@/components/Snippets";
import Topbar from "@/components/Topbar";



const Home = () => {

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
