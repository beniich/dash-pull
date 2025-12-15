import { memo } from 'react';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Card } from '@/components/ui/card';
import { CreditCard, Mail, Bell, Zap, Database, FileSpreadsheet, Hash, BadgeDollarSign, Split, Clock, LayoutDashboard, ArrowRightCircle } from 'lucide-react';

const icons = {
    trigger: Zap,
    action: CreditCard,
    email: Mail,
    notification: Bell,
    database: Database,
    sheets: FileSpreadsheet,
    slack: Hash,
    stripe: BadgeDollarSign,
    condition: Split,
    delay: Clock,
    iframe: LayoutDashboard,
    redirect: ArrowRightCircle,
    script: Database,
};

interface CustomNodeData extends Record<string, unknown> {
    label: string;
    icon: string;
    description?: string;
}

export default memo(({ data, isConnectable }: NodeProps) => {
    const nodeData = data as CustomNodeData;
    const Icon = icons[nodeData.icon as keyof typeof icons] || Zap;

    return (
        <Card className="min-w-[200px] border-none shadow-neu bg-background/80 backdrop-blur-sm">
            <div className="p-3">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                        <Icon size={16} />
                    </div>
                    <div className="font-semibold text-sm">{nodeData.label}</div>
                </div>
                {nodeData.description && (
                    <div className="text-xs text-muted-foreground">
                        {nodeData.description}
                    </div>
                )}
            </div>

            <Handle
                type="target"
                position={Position.Top}
                isConnectable={isConnectable}
                className="!bg-muted-foreground !w-3 !h-3"
            />
            <Handle
                type="source"
                position={Position.Bottom}
                isConnectable={isConnectable}
                className="!bg-primary !w-3 !h-3"
            />
        </Card>
    );
});
