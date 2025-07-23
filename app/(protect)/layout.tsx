"use client";
import ProtectHeader from "@/components/ProtectHeader";

export default function ProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <ProtectHeader />
      <main>{children}</main>
    </>
  );
}