import {
    DndContext,
    type DragEndEvent,
    closestCorners,
} from "@dnd-kit/core";
import { WorkflowColumn } from "./WorkflowColumn";
import { useState } from "react";
import type { WorkflowStep, Patient } from "@/types/workflow";
import { AutomationEngine } from "@/automation/automationEngine";
import { AUTOMATION_RULES } from "@/automation/rules";

const STEPS: WorkflowStep[] = [
    { id: "admission", name: "Admission" },
    { id: "triage", name: "Triage" },
    { id: "consult", name: "Consultation" },
    { id: "care", name: "Soins" },
    { id: "discharge", name: "Sortie" },
];

const INITIAL_PATIENTS: Patient[] = [
    { id: "p1", fullName: "Ahmed Benali", workflowStepId: "admission" },
    { id: "p2", fullName: "Sara El Idrissi", workflowStepId: "triage", critical: true },
    { id: "p3", fullName: "Jean Martin", workflowStepId: "consult" },
];

const automation = new AutomationEngine(AUTOMATION_RULES);

export const WorkflowKanban = () => {
    const [patients, setPatients] = useState(INITIAL_PATIENTS);

    const onDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        if (!over) return;

        const patientId = active.id as string;
        const targetStepId = over.id as string;

        setPatients((prev) =>
            prev.map((p) =>
                p.id === patientId
                    ? { ...p, workflowStepId: targetStepId }
                    : p
            )
        );

        // 🔥 EVENT METIER (plus tard Supabase EventBus)
        console.log("Event: WorkflowStepChanged", {
            patientId,
            to: targetStepId,
        });

        // Trigger automation (workflow change) -- example only, as rules currently target VitalsRecorded
        // automation.process({ ... })
    };

    const simulateCriticalEvent = () => {
        automation.process({
            id: crypto.randomUUID(),
            type: "VitalsRecorded",
            workspaceId: "workspace-1",
            patientId: "p2",
            payload: {
                heartRate: 180,
                critical: true,
            },
            createdAt: new Date().toISOString(),
        });
    }

    return (
        <div className="p-6">
            <div className="mb-6 flex justify-between items-center">
                <h1 className="text-2xl font-bold">MedFlow Board</h1>
                <button
                    onClick={simulateCriticalEvent}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                >
                    Simulate Critical Event
                </button>
            </div>
            <DndContext
                collisionDetection={closestCorners}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-6 overflow-x-auto pb-4">
                    {STEPS.map((step) => (
                        <WorkflowColumn
                            key={step.id}
                            step={step}
                            patients={patients.filter(
                                (p) => p.workflowStepId === step.id
                            )}
                        />
                    ))}
                </div>
            </DndContext>
        </div>
    );
};
