"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import Image from "next/image";

export default function LoginPage() {
  const { authState } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      router.push("/dashboard");
    }
  }, [authState.user, authState.isLoading, router]);

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div className="min-h-screen bg-[#181A20] flex items-center justify-center p-5">
        <div className="bg-[#23262F] rounded-xl p-10 w-full max-w-[420px] border border-[#2D3142] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]">
          <div className="flex flex-col justify-center items-center text-center py-10">
           <Image src="/assets/images/boombox-logo.webp" alt="Logo" width={80} height={80} className="mb-2" style={{"borderRadius":"50px","alignSelf":"center"}} />
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
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <Image src="/assets/images/boombox-logo.webp" alt="Logo" width={80} height={80} className="mb-2" style={{"borderRadius":"50px","alignSelf":"center"}} />
          <h1 className="text-[28px] font-bold text-[#F1F5F9] mb-2 tracking-[-0.5px]">
            Welcome Back
          </h1>
          <p className="text-[#94A3B8] text-base">
            Sign in to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}
