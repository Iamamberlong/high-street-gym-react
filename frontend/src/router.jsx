import { createBrowserRouter } from "react-router-dom";
import { RestrictedRoute } from "./common/RestrictedRoute";
import ClassListPage from "./features/classes/ClassListPage";
import ClassFilterPage from "./features/classes/ClassFilterPage";
import LoginPage from "./features/users/LoginPage";
import RegisterPage from "./features/users/RegisterPage";
import BlogListPage from "./features/blogs/BlogListPage";
import MyBlogsPage from "./features/blogs/MyBlogsPage";
import MyBookingsPage from "./features/bookings/MyBookingsPage";
import LocationListPage from "./features/locations/LocationListPage";
import MyProfilePage from "./features/users/MyProfilePage";
import ActivityListPage from "./features/activities/ActivityListPage";
import HomePage from "./features/homepage/HomePage";
import BlogContentPage from "./features/blogs/BlogContentPage"; //
import TrainerListPage from "./features/users/TrainerListPage";
import MyClassesPage from "./features/classes/MyClassesPage";
import CreateBlogPage from "./features/blogs/CreateBlogPage";
import EditBlogPage from "./features/blogs/EditBlogPage";
import CreateClassPage from "./features/classes/CreateClassPage";
import TrainerClassCard from "./features/classes/TrainerClassCard";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/my-profile",
    element: (
      <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
        <MyProfilePage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/blogs",
    element: <BlogListPage />,
  },
  {
    path: "/blogs/create",
    element: <CreateBlogPage />,
  },
  {
    path: "/create-class",
    element: <CreateClassPage />,
  },
  {
    path: "/classes/",
    element: <ClassListPage />,
  },
  {
    path: "/classes/:gymClassName/:classDate",
    element: <ClassFilterPage />,
  },
  {
    path: "/classes/my-classes",
    element: (
      <RestrictedRoute allowedRoles={["admin", "trainer"]}>
        <MyClassesPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/trainers",
    element: <TrainerListPage />,
  },
  {
    path: "/blogs/:id",
    element: <BlogContentPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/activities",
    element: <ActivityListPage />,
  },
  {
    path: "/locations",
    element: <LocationListPage />,
  },
  {
    path: "/my-bookings",
    element: (
      <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
        <MyBookingsPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/bookings/:classId",
    element: <TrainerClassCard />,
  },
  {
    path: "/blogs/my-blogs",
    element: (
      <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
        <MyBlogsPage />
      </RestrictedRoute>
    ),
  },
  {
    path: "/blogs/edit/:id",
    element: (
      <RestrictedRoute allowedRoles={["admin", "member", "trainer"]}>
        <EditBlogPage />
      </RestrictedRoute>
    ),
  },
]);

export default router;
