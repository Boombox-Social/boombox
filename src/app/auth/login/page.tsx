"use client";

import LoginForm from "@/app/components/auth/loginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        background: "#cbcbcb",
        alignItems: "center",
        justifyContent: "flex-start",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <LoginForm />
      </div>
      {/* Optionally, you can add an illustration or image on the right */}
    </div>
  );
}