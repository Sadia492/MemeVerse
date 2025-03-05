import { useContext, useEffect } from "react";
import { authContext } from "@/providers/AuthProvider";
import LoadingSpinner from "./LoadingSpinner";
import { useRouter } from "next/navigation";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(authContext);
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page if user is not authenticated
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]); // Run the effect when `user` or `loading` changes

  // Show loading spinner while loading user data
  if (loading) {
    return <LoadingSpinner />;
  }

  // If the user is not authenticated, return null until redirect
  if (!user) return null; // This will happen while the redirect is being processed

  return children; // Render children if user is authenticated
};

export default PrivateRoute;
