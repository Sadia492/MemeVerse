// components/PrivateRoute.js
import { useContext, useEffect } from "react";

import { authContext } from "@/providers/AuthProvider";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(authContext);
  const router = useRouter();

  // Show loading spinner while loading user data
  if (loading) {
    return <LoadingSpinner />;
  }

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!user) {
      router.push("/login");
    }
  }, [user, router]); // Run the effect when `user` changes

  // If the user is not authenticated, return null until redirect
  if (!user) return null;

  return children; // Render children if user is authenticated
};

export default PrivateRoute;
