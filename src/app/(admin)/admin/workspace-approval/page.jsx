import { protectAdmin } from "@/authorization/AdminAuthGuard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { WorkspaceServices } from "@/system/Services/WorkspaceServices";
import { Calendar, CheckCircle, Clock, Eye, Mail, User, XCircle } from "lucide-react";
import WorkspaceApprovalDialog from "./components/WorkspaceApprovalDialog";
import WorkspaceDetailsDialog from "./components/WorkspaceDetailsDialog";
import WorkspaceRejectionDialog from "./components/WorkspaceRejectionDialog";

export default async function WorkspaceApprovalPage() {
  await protectAdmin();

  const pendingWorkspaces = await WorkspaceServices.getPendingWorkspaces();

  return (
    <div className="space-y-8 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight">Workspace Approval</h1>
          <p className="text-muted-foreground text-lg">
            Review and manage pending workspace requests
          </p>
        </div>
        <Badge variant="secondary" className="px-4 py-2 text-base">
          {pendingWorkspaces.length} Pending
        </Badge>
      </div>

      <div className="space-y-6">
        {pendingWorkspaces.length === 0 ? (
          <Card className="p-8">
            <CardContent className="flex items-center justify-center py-16">
              <div className="space-y-4 text-center">
                <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
                <h3 className="text-2xl font-semibold">All caught up!</h3>
                <p className="text-muted-foreground text-lg">
                  No pending workspace requests at the moment.
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          pendingWorkspaces.map((workspace) => (
            <Card key={workspace.id} className="p-4 transition-shadow hover:shadow-lg">
              <div className="flex gap-6">
                <div className="w-[95%]">
                  <CardHeader className="p-0 pb-3">
                    <div className="space-y-3">
                      <CardTitle className="flex items-center gap-3 text-2xl">
                        {workspace.name}
                        <Badge
                          variant="outline"
                          className="border-yellow-600 px-3 py-1 text-sm text-yellow-600"
                        >
                          <Clock className="mr-2 h-4 w-4" />
                          Pending
                        </Badge>
                      </CardTitle>
                      <CardDescription className="min-h-20 text-base leading-relaxed">
                        {workspace.description || "No description provided"}
                      </CardDescription>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0">
                    <div className="text-muted-foreground flex items-center gap-6 text-base">
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        <span>{workspace.owner?.username}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5" />
                        <span>{workspace.owner?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-5 w-5" />
                        <span>{new Date(workspace.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <div className="flex w-[15%] flex-col items-center justify-center gap-4">
                  {/* Approve Button with Dialog */}
                  <WorkspaceApprovalDialog
                    workspace={workspace}
                    trigger={
                      <Button
                        size="xl"
                        className="flex w-full transform items-center justify-center bg-green-600 px-6 py-3 text-base shadow-lg transition-all duration-200 hover:scale-105 hover:bg-green-700 hover:shadow-xl"
                      >
                        <CheckCircle className="mr-1 h-5 w-5 translate-x-2" />
                        <span className="ml-1 font-medium">Approve</span>
                      </Button>
                    }
                  />

                  {/* Reject Button with Dialog */}
                  <WorkspaceRejectionDialog
                    workspace={workspace}
                    trigger={
                      <Button
                        size="xl"
                        variant="destructive"
                        className="flex w-full transform items-center justify-center px-6 py-3 text-base shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl"
                      >
                        <XCircle className="mr-0 h-5 w-5" />
                        <span className="mr-2 font-medium">Reject</span>
                      </Button>
                    }
                  />

                  {/* Details Button with Dialog */}
                  <WorkspaceDetailsDialog
                    workspace={workspace}
                    trigger={
                      <Button
                        size="xl"
                        variant="outline"
                        className="flex w-full transform items-center justify-center border-2 bg-white px-6 py-3 text-base shadow-md transition-all duration-200 hover:scale-105 hover:bg-gray-50 hover:shadow-lg"
                      >
                        <Eye className="mr-0 h-5 w-5" />
                        <span className="mr-2 font-medium">Details</span>
                      </Button>
                    }
                  />
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
