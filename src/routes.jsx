import Layout from "./components/Layout/Layout";
import Dashboard from "./dashboard/dashboard/index.jsx";
import Events from "./dashboard/events/index.jsx";

import Photos from "./dashboard/Photos";
import Home from "./pages/home/index";
import Login from "./pages/login/index";
import SignUp from "./pages/signup/index";
import EmailVerification from "./pages/email-verification/index";
import ForgotPassword from "./pages/forgot-password/index";
import ResetPassword from "./pages/reset-password/index";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import NotFound from "./pages/not-found/index";
import EditProfile from "./dashboard/edit-profile/index.jsx";
import PhotoUpload from "./dashboard/upload/index.jsx";
import Gallery from "./dashboard/gallery/index.jsx";
import PhotoDetailPage from "./dashboard/photo-details/index.jsx";


const routes = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <Login />,
  },
  {
    path: "/sign-up",
    element: <SignUp />,
  },
  {
    path: "/verify-email",
    element: <EmailVerification />,
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />,
  },
  {
    path: "/reset-password",
    element: <ResetPassword />,
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },

      {
        path: "/dashboard/models",
        element: <Events />,
      },

      {
        path: "/dashboard/gallery",
        element: <Gallery />,
      },
       {
        path: "/dashboard/upload",
        element: <PhotoUpload />,
      },
      
      {
        path: "/dashboard/photos",
        element: <Photos />,
      },
       {
        path: "/dashboard/photos/:id",
        element: <PhotoDetailPage />,
      },
      
      {
        path: "/dashboard/edit-profile",
        element: <EditProfile />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
