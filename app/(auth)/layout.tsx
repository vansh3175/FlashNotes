"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useDispatch, useSelector } from "react-redux";

import { authClient } from "@/lib/auth-client";
import { RootState } from "@/lib/store";
import { setSession, setLoading } from "@/store/authSlice";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { resolvedTheme } = useTheme();

  const { session, loading } = useSelector((state: RootState) => state.auth);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        dispatch(setLoading(true));
        const { data } = await authClient.getSession();

        if (data) {
            router.push('/dashboard');
            toast.warning('You need to logout to login again')
        } 
      } catch (error) {
            console.error("Error fetching session:", error);
            
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (!session) fetchSession();
  }, [router, dispatch, session]);

  // Wait until mounted and theme resolved
  if (!mounted || loading || !resolvedTheme) {
    const loaderSrc =
      '/preloader.gif'

    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50 dark:bg-gray-900">
        <Image
          src={loaderSrc}
          alt="Loading..."
          height={120}
          width={120}
          unoptimized
        />
      </div>
    );
  }

  if (!session) return <>{children}</>;;

  return null;
}
