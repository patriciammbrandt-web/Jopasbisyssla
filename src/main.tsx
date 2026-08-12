import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import App from "./App";
import Home from "./pages/Home/Home";
import "./styles/globals.css";

const About = lazy(() => import("./pages/About/About"));
const Honey = lazy(() => import("./pages/Honey/Honey"));
const Products = lazy(() => import("./pages/Products/Products"));
const Retailers = lazy(() => import("./pages/Retailers/Retailers"));
const Contact = lazy(() => import("./pages/Contact/Contact"));
const NotFound = lazy(() => import("./pages/NotFound/NotFound"));
const MarketsAdmin = lazy(() => import("./pages/Admin/MarketsAdmin"));

function LazyPage({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={null}>{children}</Suspense>;
}

const router = createBrowserRouter([
  {
    path: "/admin",
    element: (
      <LazyPage>
        <MarketsAdmin />
      </LazyPage>
    ),
  },
  {
    path: "/admin/marknader",
    element: <Navigate to="/admin" replace />,
  },
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "om-oss",
        element: (
          <LazyPage>
            <About />
          </LazyPage>
        ),
      },
      {
        path: "honungen",
        element: (
          <LazyPage>
            <Honey />
          </LazyPage>
        ),
      },
      {
        path: "produkter",
        element: (
          <LazyPage>
            <Products />
          </LazyPage>
        ),
      },
      {
        path: "aterforsaljare",
        element: (
          <LazyPage>
            <Retailers />
          </LazyPage>
        ),
      },
      {
        path: "kontakt",
        element: (
          <LazyPage>
            <Contact />
          </LazyPage>
        ),
      },
      {
        path: "*",
        element: (
          <LazyPage>
            <NotFound />
          </LazyPage>
        ),
      },
    ],
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
