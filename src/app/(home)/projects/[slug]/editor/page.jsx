import { ProjectServices } from "@/system/Services/ProjectServices";
import ProjectEditorShell from "./ProjectEditorShell";
import { SectionServices } from "@/system/Services/SectionServices";
import { canReadSectionAuth } from "@/authorization/SectionAuthGuard";
export default async function ProjectEditorPage({ params }) {
  const canReadPermission = await canReadSectionAuth();

  console.log(canReadPermission, "page edit page section read");

  const { slug } = await params;
  const project = await ProjectServices.getResource({ where: { slug } });
  const hasSection = await SectionServices.hasResource({
    where: { projectId: project.id },
  });
  const getAllSections = await SectionServices.getAllSectionWithPages({
    projectId: project.id,
  });

  return (
    <ProjectEditorShell
      canReadPermission={canReadPermission}
      project={project}
      hasSection={hasSection}
      sections={getAllSections}
    />
  );
}
