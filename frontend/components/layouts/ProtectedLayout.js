"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { isRoleAllowed } from "@/utils/routeGuard";

export default function ProtectedLayout({ children, allowedRoles = [] }) {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // Not logged in, redirect to login
        router.push(`/login?returnUrl=${encodeURIComponent(pathname)}`);
        return;
      }

      console.log("ProtectedLayout Check:", { role, allowedRoles, allowed: isRoleAllowed(role, allowedRoles) });

      // Check role permission
      if (!isRoleAllowed(role, allowedRoles)) {
        console.log("Access Denied for role:", role, "Redirecting...");
        // Redirect to appropriate dashboard based on actual role
        switch (role) {
          case "buyer":
            router.push("/dashboard/buyer");
            break;
          case "seller":
            router.push("/dashboard/seller");
            break;
          case "admin":
            router.push("/admin/dashboard");
            break;
          default:
            router.push("/");
        }
      }
    }
  }, [user, role, loading, router, allowedRoles, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  // Double check before rendering children to prevent content flash
  if (!user || !isRoleAllowed(role, allowedRoles)) {
    return null; // Don't render anything while redirecting
  }

  return <>{children}</>;
}
