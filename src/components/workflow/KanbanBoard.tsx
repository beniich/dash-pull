import React, { useMemo } from 'react';
import { useWorkflowStore, Workflow } from '@/stores/useWorkflowStore';
import { useHospitalStore } from '@/stores/useHospitalStore';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { PatientRiskBadge } from '@/components/patients/PatientRiskBadge';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface KanbanBoardProps {
    workflowId: string;
}

export function KanbanBoard({ workflowId }: KanbanBoardProps) {
    const { getWorkflowById } = useWorkflowStore();
    const { patients, updatePatient } = useHospitalStore();

    const workflow = getWorkflowById(workflowId);


    const patientsByStep = useMemo(() => {
        if (!workflow) return {};

        const grouping: Record<string, typeof patients> = {};
        workflow.steps.forEach(step => {
            grouping[step.id] = [];
        });

        patients.forEach(patient => {
            // If patient has no step assigned, assign to first step (Admission) default
            const stepId = patient.workflowStepId || workflow.steps[0].id;
            if (grouping[stepId]) {
                grouping[stepId].push(patient);
            } else {
                // Fallback if step doesn't exist
                if (grouping[workflow.steps[0].id]) grouping[workflow.steps[0].id].push(patient);
            }
        });
        return grouping;
    }, [patients, workflow]);


    const onDragEnd = (result: DropResult) => {
        const { destination, source, draggableId } = result;

        if (!destination) return;

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const patientId = draggableId;
        const newStepId = destination.droppableId;

        // Optimistic UI update handled by store/react, but here we explicitly call update
        updatePatient(patientId, { workflowStepId: newStepId });

        // TODO: Trigger transition event / automation here
        console.log(`Moved patient ${patientId} to step ${newStepId}`);
    };

    if (!workflow) return <div>Workflow non trouvé</div>;

    return (
        <div className="h-full overflow-x-auto pb-4">
            <DragDropContext onDragEnd={onDragEnd}>
                <div className="flex h-full gap-4 min-w-max">
                    {workflow.steps.map((step) => (
                        <div key={step.id} className="flex flex-col w-80 bg-muted/30 rounded-lg border border-border/50">
                            {/* Column Header */}
                            <div
                                className="p-3 border-b flex justify-between items-center rounded-t-lg"
                                style={{ borderTop: `3px solid ${step.color || 'gray'}` }}
                            >
                                <h3 className="font-semibold text-sm uppercase tracking-wide flex items-center gap-2">
                                    {step.name}
                                    <Badge variant="secondary" className="text-xs h-5 px-1.5 min-w-[1.25rem] justify-center">
                                        {patientsByStep[step.id]?.length || 0}
                                    </Badge>
                                </h3>
                            </div>

                            {/* Column Body (Droppable) */}
                            <Droppable droppableId={step.id}>
                                {(provided, snapshot) => (
                                    <div
                                        ref={provided.innerRef}
                                        {...provided.droppableProps}
                                        className={`flex-1 p-2 space-y-3 overflow-y-auto min-h-[150px] transition-colors ${snapshot.isDraggingOver ? 'bg-muted/50' : ''}`}
                                    >
                                        {patientsByStep[step.id]?.map((patient, index) => (
                                            <Draggable key={patient.id} draggableId={patient.id} index={index}>
                                                {(provided, snapshot) => (
                                                    <div
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        style={{ ...provided.draggableProps.style }}
                                                        className={`group relative ${snapshot.isDragging ? 'z-50 rotate-2 scale-105 shadow-xl' : ''}`}
                                                    >
                                                        <Card className="shadow-sm hover:shadow-md transition-all cursor-grab active:cursor-grabbing border-l-4" style={{ borderLeftColor: step.color || 'transparent' }}>
                                                            <CardContent className="p-3 space-y-3">
                                                                {/* Header: Name & Risk */}
                                                                <div className="flex justify-between items-start">
                                                                    <div className="font-medium truncate pr-2">
                                                                        {patient.firstName} {patient.lastName}
                                                                    </div>
                                                                    <PatientRiskBadge riskScore={patient.riskScore} />
                                                                </div>

                                                                {/* Details */}
                                                                <div className="text-xs text-muted-foreground space-y-1">
                                                                    <div className="flex items-center gap-1">
                                                                        <Avatar className="w-4 h-4">
                                                                            <AvatarFallback className="text-[8px]">Dr</AvatarFallback>
                                                                        </Avatar>
                                                                        <span>Dr. House</span>
                                                                    </div>
                                                                    <div className='truncate max-w-full'>
                                                                        {patient.diagnosis || "Motif d'admission non renseigné"}
                                                                    </div>
                                                                    <div className="text-[10px] pt-1 opacity-70">
                                                                        {/* Dummy time waiting */}
                                                                        En attente depuis 2h
                                                                    </div>
                                                                </div>
                                                            </CardContent>
                                                        </Card>
                                                    </div>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>
                    ))}
                </div>
            </DragDropContext>
        </div>
    );
}
