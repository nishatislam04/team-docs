import { canReadPageAuth } from "@/authorization/PageAuthGuard";
import { canReadSectionAuth } from "@/authorization/SectionAuthGuard";
import { ProjectServices } from "@/system/Services/ProjectServices";
import { SectionServices } from "@/system/Services/SectionServices";
import ProjectEditorShell from "./ProjectEditorShell";
export default async function ProjectEditorPage({ params }) {
  const canReadSectionPermission = await canReadSectionAuth();

  const canReadPagePermission = await canReadPageAuth();

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
      canReadSectionPermission={canReadSectionPermission}
      canReadPagePermission={canReadPagePermission}
      project={project}
      hasSection={hasSection}
      sections={getAllSections}
    />
  );
}
