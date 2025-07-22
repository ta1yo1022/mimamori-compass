import NotProtectHeader from "@/components/NotProtectHeader";

export default function NotProtectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NotProtectHeader />
      <main>{children}</main>
    </>
  );
}
