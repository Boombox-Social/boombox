"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        width: "100%",
        height: "100%",
        maxWidth: 380,
        background: "linear-gradient(135deg, #ffffff 10%, #ADD8E6 100%)",
        borderRadius: 8,
        boxShadow: "0 2px 24px 0 rgba(0,0,0,0.10)",
        padding: "40px 0 32px 0",
        color: "#232428",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        border: "1px solid #e3e5e8",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 280,
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 24,
            fontWeight: 700,
            textAlign: "center",
            color: "#232428",
          }}
        >
          Sign In
        </h2>
        <div
          style={{
            color: "#555",
            fontSize: 16,
            textAlign: "center",
            marginBottom: 10,
          }}
        >
          Welcome back! Please login to continue.
        </div>

        {/* Email */}
        <div style={{ width: "100%" }}>
          <label
            htmlFor="email"
            style={{
              display: "block",
              color: "#555",
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 6,
              letterSpacing: 1,
            }}
          >
            EMAIL
          </label>
          <input
            id="email"
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px 12px",
              background: "#f4f4f5",
              border: "1px solid #e3e5e8",
              borderRadius: 4,
              color: "#232428",
              fontSize: 16,
              outline: "none",
              transition: "border 0.2s",
              marginBottom: 2,
            }}
            onFocus={(e) =>
              (e.currentTarget.style.border = "1.5px solid #5865f2")
            }
            onBlur={(e) =>
              (e.currentTarget.style.border = "1px solid #e3e5e8")
            }
          />
        </div>

        {/* Password */}
        <div style={{ width: "100%" }}>
          <label
            htmlFor="password"
            style={{
              display: "block",
              color: "#555",
              fontWeight: 700,
              fontSize: 12,
              marginBottom: 6,
              letterSpacing: 1,
            }}
          >
            PASSWORD
          </label>
          <div style={{ position: "relative" }}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px 38px 12px 12px",
                background: "#f4f4f5",
                border: "1px solid #e3e5e8",
                borderRadius: 4,
                color: "#232428",
                fontSize: 16,
                outline: "none",
                transition: "border 0.2s",
                marginBottom: 2,
              }}
              onFocus={(e) =>
                (e.currentTarget.style.border = "1.5px solid #5865f2")
              }
              onBlur={(e) =>
                (e.currentTarget.style.border = "1px solid #e3e5e8")
              }
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                color: "#888",
                cursor: "pointer",
                padding: 0,
                fontSize: 18,
              }}
              tabIndex={-1}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M17.94 17.94C16.13 19.25 14.13 20 12 20C7 20 2.73 16.11 1 12C1.73 10.26 2.91 8.71 4.44 7.56M9.53 9.53C10.06 9.19 10.77 9 12 9C14.21 9 16 10.79 16 13C16 13.23 15.97 13.45 15.92 13.66M12 4C16.97 4 21.24 7.89 23 12C22.37 13.44 21.38 14.74 20.11 15.81M1 1L23 23"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 12C2.73 16.11 7 20 12 20C17 20 21.27 16.11 23 12C21.27 7.89 17 4 12 4C7 4 2.73 7.89 1 12Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div
            style={{
              color: "#fa777c",
              fontSize: 14,
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          style={{
            width: "80%",
            padding: 12,
            borderRadius: 4,
            border: "none",
            background: "#5865f2",
            color: "#fff",
            fontWeight: 700,
            fontSize: 16,
            cursor: "pointer",
            marginTop: 8,
            alignSelf: "center",
            boxShadow: "0 2px 8px rgba(88,101,242,0.10)",
            letterSpacing: 1,
            transition: "background 0.2s",
          }}
        >
          Log In
        </button>

        {/* Forgot Password */}
        <div
          style={{
            color: "#888",
            fontSize: 13,
            textAlign: "center",
            marginTop: 8,
          }}
        >
          <a href="#" style={{ color: "#2563eb", textDecoration: "none" }}>
            Forgot your password?
          </a>
        </div>
      </div>
    </form>
  );
}
