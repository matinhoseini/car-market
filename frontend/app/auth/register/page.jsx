// app/auth/register/page.jsx
"use client";

import Link from "next/link";
import RegisterForm from "../../../components/forms/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-12 px-4">
      <div className="card w-full max-w-md p-8">
        <div className="text-center mb-8">
          <h1 className="text-2xl md:text-3xl font-bold font-heading">
            Create Account 🚀
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Join CarMarket today
          </p>
        </div>

        <RegisterForm />

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{" "}
          <Link
            href="/auth/login"
            className="text-blue-500 hover:text-blue-600 font-medium transition"
          >
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
