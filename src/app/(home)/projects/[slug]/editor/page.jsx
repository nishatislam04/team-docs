import { ProjectServices } from "@/system/Services/ProjectServices";
import ProjectEditorShell from "./ProjectEditorShell";
import { SectionServices } from "@/system/Services/SectionServices";
export default async function ProjectEditorPage({ params }) {
  const { slug } = await params;
  const project = await ProjectServices.getResource({ where: { slug } });
  const hasSection = await SectionServices.hasResource({
    where: { projectId: project.id },
  });
  const getAllSections = await SectionServices.getAllSectionWithPages({
    projectId: project.id,
  });

  return <ProjectEditorShell project={project} hasSection={hasSection} sections={getAllSections} />;
}
