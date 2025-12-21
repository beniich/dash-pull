import DetailPane from "@/components/dashboard/DetailPane";
import { FolderOpen } from "lucide-react";

const DocumentsModule = () => {
  return (
    <DetailPane title="Documents" subtitle="Gestion des fichiers">
      <div className="text-center text-muted-foreground py-16">
        <FolderOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
        <p className="text-lg font-medium">Documents</p>
        <p className="text-sm">Les documents seront affichés ici</p>
      </div>
    </DetailPane>
  );
};

export default DocumentsModule;
