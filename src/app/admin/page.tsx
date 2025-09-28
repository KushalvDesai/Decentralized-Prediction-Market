import { AdminDashboard } from "@/components/admin-dashboard";
import { Navbar } from "@/components/navbar";

export default function AdminPage() {
  return (
    <main className="container mx-auto p-4">
      <Navbar />
      <AdminDashboard />
    </main>
  );
}