import React from "react";
import Header from "../components/layout/Header";
import BottomNav from "../components/navigation/BottomNav";
import AuthForm from "../components/auth/AuthForm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSearchParams } from "react-router-dom";

const AuthPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const defaultTab =
    searchParams.get("mode") === "signup" ? "signup" : "signin";

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <Header />

      <main className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6 text-center">
            Welcome to Guta Ra Mwari
          </h1>

          <Tabs defaultValue={defaultTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <AuthForm mode="signin" />
            </TabsContent>

            <TabsContent value="signup">
              <AuthForm mode="signup" />
            </TabsContent>
          </Tabs>

          <p className="mt-8 text-center text-sm text-gray-500">
            By signing in or creating an account, you agree to our Terms of
            Service and Privacy Policy.
          </p>
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default AuthPage;
