import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { AlertTriangle } from "lucide-react";
import type { Patient } from "@/types/workflow";

type Props = {
    patient: Patient;
};

export const PatientCard = ({ patient }: Props) => {
    const { attributes, listeners, setNodeRef, transform, transition } =
        useSortable({ id: patient.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="p-3 cursor-grab bg-white border rounded shadow-sm hover:shadow-md transition-shadow"
        >
            <div className="flex justify-between items-center">
                <span className="font-medium text-slate-800">{patient.fullName}</span>
                {patient.critical && (
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                )}
            </div>
        </div>
    );
};
