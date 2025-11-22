"use client";
import React, { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Mail, Eye, EyeOff, NotepadText, User } from "lucide-react";
import { toast} from "sonner";
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState(0);
  const [processing,setProcessing] = useState(false);

  
  

  const router = useRouter();
  const handlePasswordChange = (value: string) => {
    setPassword(value);

    // basic strength check
    let s = 0;
    if (value.length > 8) s += 25;
    if (/[A-Z]/.test(value)) s += 25;
    if (/[0-9]/.test(value)) s += 25;
    if (/[^A-Za-z0-9]/.test(value)) s += 25;
    setStrength(s);
  };

const handleSignup = async (e: React.FormEvent) => {
  e.preventDefault();
  let url = process.env.NEXT_PUBLIC_BASE_URL;
  if(url) url=url+"dashboard";
  console.log("URL -------->",url)
  setError("");
  setProcessing(true);

  if (!name || !email || !password) {
    setError("Please fill out all fields.");
    setProcessing(false);
    return;
  }

  if (strength !== 100) {
    setError("Please choose a strong password.");
    setProcessing(false);
    return;
  }
    
    const response = await authClient.signUp.email({
        name,
        email,
        password,
        callbackURL:url
      })

      if(!response || response.error){
        if(response) setError(response.error.message!);
        else setError("Couldn't create account. Please try again");
        setProcessing(false);
        return;
      }
      else{
        toast.success("Account created successfully. Check your inbox for verification")
        setTimeout(()=>{
            router.push('/dashboard');
        },1000)
        setProcessing(false);
      }
    };



  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-sm p-8">
        <div className="flex flex-col items-center mb-8">
          <NotepadText size={64} className="text-blue-500" />
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">FlashNotes</h1>
          <p className="text-gray-500 mt-2 dark:text-neutral-50">Create your account</p>
          <p className="text-gray-400 text-sm dark:text-neutral-50">Sign up to FlashNotes</p>
        </div>

        <form onSubmit={handleSignup} className="flex flex-col gap-5">
          {/* Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-neutral-50">Name</label>
            <div className="mt-1 flex items-center border border-gray-300 rounded-md focus-within:ring-2 focus-within:ring-blue-500 ">
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="flex-1 px-3 py-2 rounded-l-md outline-none text-gray-900 text-sm dark:placeholder:text-neutral-100 dark:caret-white dark:text-white"
              />
              <div className="px-3 text-gray-400">
                <User size={18} />
              </div>
            </div>
          </div>

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
                placeholder="Create a password"
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

            {/* Password Strength */}
            {password && (
              <div className="mt-2">
                <p
                  className={`text-xs font-medium ${
                    strength < 50
                      ? "text-red-500"
                      : strength < 75
                      ? "text-yellow-500"
                      : "text-green-500"
                  }`}
                >
                  {strength < 50
                    ? "Weak"
                    : strength < 75
                    ? "Medium"
                    : "Strong"}
                </p>
                <div className="w-full h-1.5 bg-gray-200 rounded-full mt-1">
                  <div
                    className={`h-1.5 rounded-full ${
                      strength < 50
                        ? "bg-red-500"
                        : strength < 75
                        ? "bg-yellow-500"
                        : "bg-green-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>

          {error && (
            <p className="text-red-500 text-sm font-medium -mt-2">{error}</p>
          )}

          <Button
            type="submit"
            className=" cursor-pointer w-full h-11 bg-blue-600 hover:bg-blue-700 text-white text-base font-medium rounded-md transition-colors"
          >
            {processing && (<Spinner/>)}
            Sign up
          </Button>

          <p className="text-center text-sm text-gray-600 mt-3">
            Already have an account?{" "}
            <a href="login" className="text-blue-600 font-medium hover:underline">
              Log in
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}
