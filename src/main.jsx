import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Root from "./routes/root.jsx";
import ErrorPage from "./error-page";
import {
  createHashRouter,
  RouterProvider,
} from "react-router-dom";

// Routes
import Selection from "./routes/selection.jsx";
import Session from "./routes/session.jsx";

const router = createHashRouter ([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "selection",
    element: <Selection />,
  },
  {
    path: "session",
    element: <Session />,
  },
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
