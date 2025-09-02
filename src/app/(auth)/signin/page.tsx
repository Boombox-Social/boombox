"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm, LoginFormData } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { authState } = useAuth();

  // Check if user is already logged in and redirect to dashboard
  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      // Check if there's a redirect parameter in the URL
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTo = urlParams.get("redirect") || "/dashboard";

      // Redirect to the intended page or dashboard
      router.push(redirectTo);
    }
  }, [authState.user, authState.isLoading, router]);

  // Show loading while checking authentication state
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center p-5">
        <div className="bg-[#23262F] rounded-xl p-10 w-full max-w-[420px] border border-[#2D3142] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]">
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#F1F5F9]">
              B
            </div>
            <div className="text-base text-[#94A3B8] mt-4">Loading...</div>
          </div>
        </div>
      </div>
    );
  }

  // If user is already authenticated, show a brief message before redirect
  if (authState.user) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center p-5">
        <div className="bg-[#23262F] rounded-xl p-10 w-full max-w-[420px] border border-[#2D3142] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]">
          <div className="text-center py-10">
            <div className="w-12 h-12 rounded-full bg-[#2563eb] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#F1F5F9]">
              B
            </div>
            <div className="text-base text-[#F1F5F9] mt-4">
              Already signed in. Redirecting...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#181A20] flex items-center justify-center p-5">
      <div className="bg-[#23262F] rounded-xl px-10 py-12 w-full max-w-[420px] border border-[#2D3142] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-full bg-[#2563eb] mx-auto mb-4 flex items-center justify-center text-2xl font-bold text-[#F1F5F9]">
            B
          </div>
          <h1 className="text-[28px] font-bold text-[#F1F5F9] mb-2 tracking-[-0.5px]">
            Welcome Back
          </h1>
          <p className="text-[15px] text-[#94A3B8] m-0">
            Sign in to your Boombox account
          </p>
        </div>

        {/* Use the LoginForm component - remove onSubmit prop to use default behavior */}
        <LoginForm />
      </div>
    </div>
  );
}
