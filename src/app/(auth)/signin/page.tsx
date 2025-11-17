"use client";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoginForm } from "../../components/auth/LoginForm";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../contexts/ThemeContext";
import Image from "next/image";

export default function LoginPage() {
  const { authState } = useAuth();
  const { theme, mounted } = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (authState.user && !authState.isLoading) {
      router.push("/dashboard");
    }
  }, [authState.user, authState.isLoading, router]);

  // Determine logo based on theme
  const logoSrc = theme === "dark" 
    ? "/assets/images/boombox-logo.webp" 
    : "/assets/images/boombox-primary-logo.png";

  // Show loading state while checking authentication
  if (authState.isLoading || !mounted) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center p-5"
        style={{ background: "var(--background)" }}
      >
        <div 
          className="rounded-xl p-10 w-full max-w-[420px] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]"
          style={{ 
            background: "var(--card)",
            border: "1px solid var(--border)"
          }}
        >
          <div className="flex flex-col justify-center items-center text-center py-10">
            <Image 
              src={logoSrc}
              alt="Logo" 
              width={80} 
              height={80} 
              className="mb-2" 
              style={{ borderRadius: "50px", alignSelf: "center" }} 
            />
            <div 
              className="text-base mt-4"
              style={{ color: "var(--card-foreground)" }}
            >
              Already signed in. Redirecting...
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-5"
      style={{ background: "var(--background)" }}
    >
      <div 
        className="rounded-xl px-10 py-12 w-full max-w-[420px] shadow-[0_8px_40px_0_rgba(0,0,0,0.15)]"
        style={{ 
          background: "var(--card)",
          border: "1px solid var(--border)"
        }}
      >
        <div className="flex flex-col justify-center items-center text-center mb-8">
          <Image 
            src={logoSrc}
            alt="Logo" 
            width={80} 
            height={80} 
            className="mb-2" 
            style={{ borderRadius: "50px", alignSelf: "center" }} 
          />
          <h1 
            className="text-[28px] font-bold mb-2 tracking-[-0.5px]"
            style={{ color: "var(--card-foreground)" }}
          >
            Welcome Back
          </h1>
          <p 
            className="text-base"
            style={{ color: "var(--muted)" }}
          >
            Sign in to access your dashboard
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}