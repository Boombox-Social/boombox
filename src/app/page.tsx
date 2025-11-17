"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthContext as useAuth } from "./contexts/AuthContext";

export default function RootPage() {
  const router = useRouter();
  const { authState } = useAuth();

  useEffect(() => {
    // If user is authenticated, redirect to dashboard
    if (authState.user) {
      router.push("/dashboard");
    } else {
      // If not authenticated, redirect to signin
      router.push("/signin");
    }
  }, [authState.user, router]);

  // Show loading while redirecting
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--primary)",
            margin: "0 auto 16px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "24px",
            fontWeight: "bold",
            color: "var(--primary-foreground)",
          }}
        >
          B
        </div>
        <div>Loading...</div>
      </div>
    </div>
  );
}