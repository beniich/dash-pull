import type { MedEvent } from "@/types/event";
import type { AutomationRule } from "@/types/automation";

export class AutomationEngine {
    private rules: AutomationRule[];

    constructor(rules: AutomationRule[]) {
        this.rules = rules;
    }

    process(event: MedEvent) {
        this.rules
            .filter((r) => r.eventType === event.type)
            .filter((r) => this.matchConditions(r, event))
            .forEach((r) => this.executeActions(r, event));
    }

    private matchConditions(rule: AutomationRule, event: MedEvent) {
        return rule.conditions.every((c) => {
            const value = event.payload[c.field];

            switch (c.operator) {
                case "equals":
                    return value === c.value;
                case "greaterThan":
                    return value > c.value;
                case "lessThan":
                    return value < c.value;
                case "contains":
                    return Array.isArray(value) && value.includes(c.value);
                default:
                    return false;
            }
        });
    }

    private executeActions(rule: AutomationRule, event: MedEvent) {
        rule.actions.forEach((action) => {
            switch (action.type) {
                case "NOTIFY_TEAM":
                    console.log(
                        "🔔 Notify team",
                        action.teamId,
                        "for event",
                        event.type
                    );
                    break;

                case "CREATE_TASK":
                    console.log("📝 Task created:", action.title);
                    break;
            }
        });
    }
}
