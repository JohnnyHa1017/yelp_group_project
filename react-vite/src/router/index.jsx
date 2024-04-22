import { createBrowserRouter } from 'react-router-dom';
import LoginFormPage from '../components/LoginFormPage';
import SignupFormPage from '../components/SignupFormPage';
import LandingPage from '../components/LandingPage'
import Layout from './Layout';
import { RouterProvider } from "react-router-dom";
import OneBusiness from '../components/BusinessDetails/BusinessDetails';
import CreateBusiness from '../components/CreateBusiness/CreateBusiness';
import UpdateBusiness from '../components/UpdateBusiness/UpdateBusiness';
// import DeleteBusiness from '../components/DeleteBusiness/DeleteBusiness';
import BusinessReviews from '../components/BusinessReviews/BusinessReviews'
import CreateReview from '../components/CreateReview/CreateReview'
import DeleteReview from '../components/DeleteReview/DeleteReview';
import UpdateReview from '../components/UpdateReview/UpdateReview';
import MenusByBusinessId from '../components/Menu/MenusByBusiness';
import CreateMenu from '../components/Menu/CreateMenu';
import ManageBusiness from '../components/ManageBusiness/ManageBusiness';
import CreateAmenity from '../components/CreateAmenities/CreateAmenities';
import Category from '../components/Category/Category'

export const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <LandingPage />,
      },
      {
        path: "login",
        element: <LoginFormPage />,
      },
      {
        path: "signup",
        element: <SignupFormPage />,
      },
      {
        path: "business/:businessId",
        element: <OneBusiness />
      },
      {
        path: "business/new",
        element: <CreateBusiness />
      },
      {
        path: "business/:businessId/edit",
        element: <UpdateBusiness />
      },
      {
        path: 'business/:businessId/reviews',
        element: <BusinessReviews/>
      },
      {
        path: 'business/:businessId/review/new',
        element: <CreateReview />
      },
      {
        path: 'business/:businessId/:reviewId/delete',
        element: <DeleteReview/>
      },
      {
        path: 'business/:businessId/:reviewId/update',
        element: <UpdateReview />
      },
      {
        path: 'business/:businessId/menus',
        element: <MenusByBusinessId isFullPage={true} />
      },
      {
        path: 'business/:businessId/menus/new',
        element: <CreateMenu />
      },
      {
        path: '/user/:userId/business',
        element: <ManageBusiness />
      },
      {
        path: '/business/:businessId/amenities',
        element: <CreateAmenity />
      },
      {
        path:'*',
        element: <h1>Page not found</h1>
      },
      {
        path: 'category/:category',
        element: <Category />
      }
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
