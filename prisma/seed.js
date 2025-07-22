import { PrismaClient } from "@/generated/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting seeding process...");

  // Create nishat user
  const nishat = await prisma.user.create({
    data: {
      username: "nishat",
      email: "nishatislam3108@gmail.com",
      password: "$2b$10$NFBfr4vxrvrJ3BI7.Bqdge55rOXWwl6lYCaeUGKzEtfNB9MxaT8BO",
      status: "ACTIVE",
      isSuperAdmin: true,
      isWorkspaceOwner: true,
    },
  });
  console.log("✅ Created nishat user");

  // Create workspace for Admin
  const workspace = await prisma.workspace.create({
    data: {
      name: "Admin Workspace",
      slug: "admin-workspace",
      description: "A demo workspace for testing",
      ownerId: nishat.id,
      status: "ACTIVE",
    },
  });
  console.log("✅ Created workspace");

  // assign workspace to admin user
  await prisma.user.update({
    where: {
      id: nishat.id,
    },
    data: {
      workspaceId: workspace.id,
    },
  });

  // Create two projects
  await Promise.all([
    prisma.project.create({
      data: {
        name: "Admin Project1",
        slug: "admin-project-1",
        description: "Admin project 1",
        workspaceId: workspace.id,
        ownerId: nishat.id,
        status: "ACTIVE",
      },
    }),
    prisma.project.create({
      data: {
        name: "Admin Project2",
        slug: "admin-project-2",
        description: "Admin project 2",
        workspaceId: workspace.id,
        ownerId: nishat.id,
        status: "ACTIVE",
      },
    }),
  ]);

  console.log("✅ Created projects");

  // Create project-scoped permissions
  const projectPermissions = [
    // School Demo Project Permissions
    {
      name: "create:page",
      description: "Create a page",
      scope: "admin-project-1",
    },
    {
      name: "read:page",
      description: "Read a page",
      scope: "admin-project-1",
    },
    {
      name: "update:page",
      description: "Update a page",
      scope: "admin-project-1",
    },
    {
      name: "delete:page",
      description: "Delete a page",
      scope: "admin-project-1",
    },
    // Radius Directory Project Permissions
    {
      name: "create:page",
      description: "Create a page",
      scope: "admin-project-2",
    },
    {
      name: "read:page",
      description: "Read a page",
      scope: "admin-project-2",
    },
    {
      name: "update:page",
      description: "Update a page",
      scope: "admin-project-2",
    },
    {
      name: "delete:page",
      description: "Delete a page",
      scope: "admin-project-2",
    },
  ];

  await prisma.permission.createMany({
    data: projectPermissions,
    skipDuplicates: true,
  });

  console.log("✅ Created project-scoped permissions");

  // Create system roles
  const systemRoles = [
    {
      name: "ADMIN",
      description: "Full access to all settings and data",
      isSystem: true,
    },
    {
      name: "DEVELOPER",
      description: "Can access and modify development resources",
      isSystem: true,
    },
    {
      name: "VIEWER",
      description: "Can view data but cannot make changes",
      isSystem: true,
    },
    {
      name: "PROJECT_MANAGER",
      description: "Manages project timelines and members",
      isSystem: true,
    },
    {
      name: "SUPPORT",
      description: "Handles user queries and support tickets",
      isSystem: true,
    },
  ];

  await prisma.role.createMany({
    data: systemRoles,
    skipDuplicates: true,
  });

  console.log("✅ Created system roles");
}

main()
  .catch((err) => {
    console.error("❌ Seeding failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
