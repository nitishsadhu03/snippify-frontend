import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Activation from "./pages/Activation";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import CreateSnippet from "./pages/CreateSnippet";
import { Provider } from "react-redux";
import store from "./app/store";
import setupAxiosInterceptors from "./utils/setupAxios";
import SnippetPage from "./pages/SnippetPage";
import Profile from "./pages/Profile";
import EditProfile from "./pages/EditProfile";
import Search from "./pages/Search";

setupAxiosInterceptors();

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/activate/:uid/:token",
    element: <Activation />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/create-snippet",
    element: <CreateSnippet />,
  },
  {
    path: "/snippet/:id",
    element: <SnippetPage/>,
  },
  {
    path: "/profile",
    element: <Profile/>,
  },
  {
    path: "/edit-profile/:id",
    element: <EditProfile/>,
  },
  {
    path: "/search",
    element: <Search/>,
  },
]);

export default function App() {
  return (
    <Provider store={store}>
      <div className="App">
        <RouterProvider router={router} />
      </div>
    </Provider>
  );
}
