import type { AutomationRule } from "@/types/automation";

export const AUTOMATION_RULES: AutomationRule[] = [
    {
        id: "critical-vitals",
        eventType: "VitalsRecorded",
        conditions: [
            {
                field: "critical",
                operator: "equals",
                value: true,
            },
        ],
        actions: [
            {
                type: "NOTIFY_TEAM",
                teamId: "urgence",
            },
            {
                type: "CREATE_TASK",
                title: "Prise en charge patient critique",
            },
        ],
    },
];
