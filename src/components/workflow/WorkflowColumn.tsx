import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import type { WorkflowStep, Patient } from "@/types/workflow";
import { PatientCard } from "./PatientCard";

type Props = {
    step: WorkflowStep;
    patients: Patient[];
};

export const WorkflowColumn = ({ step, patients }: Props) => {
    return (
        <div className="w-72 flex-shrink-0">
            <h3 className="font-semibold mb-3 text-slate-700">{step.name}</h3>

            <div className="space-y-3 min-h-[100px] bg-slate-100 p-3 rounded-lg border border-slate-200">
                <SortableContext
                    items={patients.map((p) => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    {patients.map((patient) => (
                        <PatientCard key={patient.id} patient={patient} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};
