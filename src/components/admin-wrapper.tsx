"use client";

import { UseAdminAuth } from "@/hooks/use-admin-auth";

export function AdminWrapper({ children }: { children: React.ReactNode }) {
  const { AdminLoginModal } = UseAdminAuth();
  return (
    <>
      {children}
      {AdminLoginModal}
    </>
  );
}
