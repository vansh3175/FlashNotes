"use client"
import React, { useState } from "react";
import { Mail, Eye, EyeOff,NotepadText } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function Login (){
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  const router = useRouter();


  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

 const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setProcessing(true);

  if (!email || !password) {
    setError("Please enter both email and password.");
    setProcessing(false);
    return;
  }

  const response = await authClient.signIn.email({
    email,
    password,
  });

  if (!response || response.error) {
    if (response) setError(response.error.message!);
    else setError("Login failed. Please try again.");
    setProcessing(false);
    return;
  } else {
    toast.success("Welcome back")
    setTimeout(() => {
      router.push("/dashboard");
    }, 1000);
    setProcessing(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <NotepadText size={64} className="text-blue-500 t"/>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FlashNotes</h1>
          <p className="text-gray-500 mt-2 dark:text-neutral-50">Welcome back</p>
          <p className="text-gray-400 text-sm dark:text-neutral-50">Log in to FlashNotes</p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-50">Email</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-md outline-none text-gray-900 text-sm dark:placeholder:text-neutral-100 dark:caret-white dark:text-white"
              />
              <div className="px-3 text-gray-400">
                <Mail size={18} />
              </div>
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-50">
              Password
            </label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-md outline-none text-gray-900 text-sm dark:placeholder:text-neutral-100 dark:caret-white dark:text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="px-3 text-gray-400"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            
          </div>

          <div className="flex justify-end">
            <p className="text-blue-600 text-sm font-medium hover:underline cursor-pointer">
              Forgot password?
            </p>
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium -mt-2">{error}</p>
          )}

          <Button
            type="submit"
            className="cursor-pointer w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md transition-colors"
          >
            {processing && (<Spinner/>)}
            Log in
          </Button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Don’t have an account?{" "}
            <a href="signup" className="text-blue-600 font-medium hover:underline">
              Sign up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
};
