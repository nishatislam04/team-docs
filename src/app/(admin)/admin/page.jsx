import { protectAdmin } from "@/authorization/AdminAuthGuard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Session } from "@/lib/Session";
import { Activity, Building, Settings, Users } from "lucide-react";

export default async function AdminDashboard() {
  await protectAdmin();

  const user = await Session.getCurrentUser();

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground text-lg">
            Welcome back, {user?.username}. Manage your platform from here.
          </p>
        </div>
      </div>

      {/* Quick Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Total Users</CardTitle>
            <Users className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-muted-foreground mt-2 text-sm">Coming soon</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Pending Workspaces</CardTitle>
            <Building className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-muted-foreground mt-2 text-sm">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">Active Workspaces</CardTitle>
            <Activity className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold">--</div>
            <p className="text-muted-foreground mt-2 text-sm">Currently active</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-base font-semibold">System Status</CardTitle>
            <Settings className="text-muted-foreground h-6 w-6" />
          </CardHeader>
          <CardContent className="p-0">
            <div className="text-3xl font-bold text-green-600">Healthy</div>
            <p className="text-muted-foreground mt-2 text-sm">All systems operational</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">Quick Actions</CardTitle>
            <CardDescription className="text-base">Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 p-0">
            <p className="text-muted-foreground text-base">• Review pending workspace requests</p>
            <p className="text-muted-foreground text-base">• Manage user accounts</p>
            <p className="text-muted-foreground text-base">• System configuration</p>
          </CardContent>
        </Card>

        <Card className="p-6">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">Recent Activity</CardTitle>
            <CardDescription className="text-base">Latest system events</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <p className="text-muted-foreground text-base">Activity feed coming soon...</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
