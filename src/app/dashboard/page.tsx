"use client";
import React from "react";
import { useAuth } from "../hooks/useAuth";
import DashboardContent from "../components/DashboardContent";

export default function DashboardPage() {
  const { authState } = useAuth();

  // Show loading state while checking authentication
  if (authState.isLoading) {
    return (
      <div 
        className="flex items-center justify-center min-h-screen"
        style={{ background: "var(--background)" }}
      >
        <div className="text-center">
          <div 
            className="w-12 h-12 rounded-full animate-spin mx-auto mb-4"
            style={{
              border: "3px solid var(--border)",
              borderTopColor: "var(--primary)",
            }}
          />
          <p style={{ color: "var(--muted)" }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If not authenticated and not loading, the AuthContext will redirect
  if (!authState.user) {
    return null;
  }

  return <DashboardContent />;
}