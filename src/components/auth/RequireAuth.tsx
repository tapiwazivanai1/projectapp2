import { ReactNode } from "react";
import { useAuth } from "../../hooks/useAuth";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";

interface RequireAuthProps {
  children: ReactNode;
  fallback?: ReactNode;
}

const RequireAuth = ({ children, fallback }: RequireAuthProps) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-red-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      fallback || (
        <div className="flex flex-col items-center justify-center p-8 space-y-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            Authentication Required
          </h3>
          <p className="text-gray-600 text-center max-w-md">
            You need to be signed in to access this feature. Please sign in or
            create an account to continue.
          </p>
          <AuthModal
            trigger={
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Sign In / Create Account
              </Button>
            }
          />
        </div>
      )
    );
  }

  return <>{children}</>;
};

export default RequireAuth;
