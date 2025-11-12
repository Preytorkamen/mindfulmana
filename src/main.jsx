import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from "./routes/root.jsx";
import ErrorPage from "./error-page";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

// Routes
import Selection from "./routes/selection.jsx";

const router = createBrowserRouter ([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "selection",
    element: <Selection />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
