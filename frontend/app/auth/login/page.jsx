// app/auth/login/page.jsx
"use client";

import Link from "next/link";
import LoginForm from "../../../components/forms/LoginFrom";

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        {/* ===== Page Header ===== */}
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Welcome Back! 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Sign in to your account
          </p>
        </div>

        {/* ===== Login Form ===== */}
        <LoginForm />

        {/* ===== Register Link ===== */}
        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{" "}
          <Link
            href="/auth/register"
            className="text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Sign Up
          </Link>
        </div>
      </div>
    </div>
  );
}
