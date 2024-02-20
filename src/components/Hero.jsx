import { Link } from "react-router-dom"


const Hero = () => {
  return (
    <div className="mx-auto max-w-4xl py-32 lg:py-38">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-rose-600 sm:text-6xl">
              Organize. Share. Suceed.
            </h1>
            <p className="mt-6 text-lg leading-8 text-white">
              A fully-featured, intuitive code snippet manager designed to
              streamline, organize, and accelerate your development workflow.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link to="/"
                className="rounded-md bg-rose-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-rose-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-600"
                
              >
                Get started →
              </Link>
            </div>
          </div>
          <div className="flex items-center justify-center py-10">
            <img
              src="/assets/hero.jpg"
              alt="logo"
              width={100}
              height={300}
              className="m-0 w-[100%] h-[300%] shadow-xl shadow-gray-300 rounded-xl"
            />
          </div>
        </div>
  )
}

export default Hero