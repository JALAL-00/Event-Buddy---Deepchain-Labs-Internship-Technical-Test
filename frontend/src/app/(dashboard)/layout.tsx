// src/app/(dashboard)/layout.tsx
import DashboardNavbar from "@/components/shared/DashboardNavbar";
import Footer from "@/components/shared/Footer";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardNavbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  )
}