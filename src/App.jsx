import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import ProtectedRoute from '@/components/ui/ProtectedRoute'
import HomePage        from '@/pages/HomePage'
import ExplorePage     from '@/pages/ExplorePage'
import DashboardPage   from '@/pages/DashboardPage'
import ItineraryPage   from '@/pages/ItineraryPage'
import ReviewsPage     from '@/pages/ReviewsPage'
import SignInPage      from '@/pages/SignInPage'
import SignUpPage      from '@/pages/SignUpPage'
import ProfilePage     from '@/pages/ProfilePage'
import NotFoundPage    from '@/pages/NotFoundPage'

const router = createBrowserRouter([
  { path: '/',                element: <HomePage /> },
  { path: '/explore/:city',   element: <ExplorePage /> },
  { path: '/reviews/:city',   element: <ReviewsPage /> },
  { path: '/signin',          element: <SignInPage /> },
  { path: '/signup',          element: <SignUpPage /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: '/dashboard',            element: <DashboardPage /> },
      { path: '/itinerary/:tripId',    element: <ItineraryPage /> },
      { path: '/profile',              element: <ProfilePage /> },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])

export default function App() {
  return <RouterProvider router={router} />
}
