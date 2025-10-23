// src/app/router.tsx
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LoginPage from "@/features/auth/pages/LoginPage";
import CustomersPage from "@/features/customers/pages/CustomersPage"; 
import { AuthGuard } from "@/features/auth/components/AuthGuard";

const router = createBrowserRouter([
  { path: "/", element: <LoginPage /> }, 
  { path: "/login", element: <LoginPage /> },
  { path: "/customers", element: <CustomersPage /> },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
