 
import { AdminNav } from "@/components/navadmin/navadmin";
export const dynamic = "force-dynamic";
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
   
  return (
    <div className="min-h-screen flex" style={{ backgroundColor: " beige" }}>
      {/* sidebar */}
      <aside
        className="w-64 border-r p-4"
        style={{ backgroundColor: "rgb(245, 182, 130)" }}
      >
       <AdminNav></AdminNav>
      </aside>

      {/* content */}
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
