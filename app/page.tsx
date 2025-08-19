import { getCurrentUser } from "@/lib/auth";
import AdminLayout from "@/components/AdminLayout";
import UserLayout from "@/components/UserLayout";

export default async function HomePage() {
  const user = await getCurrentUser();

  if (!user) {
    return <div>Please login to access the dashboard</div>;
  }

  if (user.role === "admin") {
    return <AdminLayout user={user} />;
  } else {
    return <UserLayout user={user} />;
  }
}
