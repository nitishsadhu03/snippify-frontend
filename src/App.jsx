
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Activation from "./pages/Activation";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";


const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage/>,
  },
  {
    path: "/register",
    element: <Register/>,
  },
  {
    path: "/login",
    element: <Login/>,
  },
  {
    path: "/activate/:uid/:token",
    element: <Activation/>,
  },
  {
    path: "/home",
    element: <Home/>,
  },
]);

export default function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  )
}
