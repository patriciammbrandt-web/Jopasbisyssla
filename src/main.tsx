import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Honey from "./pages/Honey/Honey";
import Products from "./pages/Products/Products";
import Retailers from "./pages/Retailers/Retailers";
import Contact from "./pages/Contact/Contact";
import NotFound from "./pages/NotFound/NotFound";
import MarketsAdmin from "./pages/Admin/MarketsAdmin";
import "./styles/globals.css";

const router = createBrowserRouter([
  {
    path: "/admin/marknader",
    element: <MarketsAdmin />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: "om-oss", element: <About /> },
      { path: "honungen", element: <Honey /> },
      { path: "produkter", element: <Products /> },
      { path: "aterforsaljare", element: <Retailers /> },
      { path: "kontakt", element: <Contact /> },
      { path: "*", element: <NotFound /> },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
