
import React from 'react';
import { useEngineStore } from '@/stores/useEngineStore';
import { DatabaseProperty, RecordPage } from '@/types/engine';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FileText, Plus, MoreHorizontal } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface TableViewProps {
    databaseId: string;
}

export const TableView: React.FC<TableViewProps> = ({ databaseId }) => {
    const database = useEngineStore(state => state.getDatabase(databaseId));
    const records = useEngineStore(state => state.getRecordsByDatabase(databaseId));
    const navigate = useNavigate();

    if (!database) return <div>Database not found</div>;

    // Function to render cell content based on property type
    const renderCell = (property: DatabaseProperty, value: unknown) => {
        if (value === undefined || value === null) return <span className="text-muted-foreground text-xs">-</span>;

        switch (property.type) {
            case 'text':
                return <span className="font-medium">{String(value)}</span>;
            case 'number':
                // Format currency if needed, for now just simple number
                return <span>{typeof value === 'number' ? value.toLocaleString() : String(value)}</span>;
            case 'status': {
                const statusOption = property.options?.find(opt => opt.name === (value as string));
                const color = statusOption?.color || 'gray';
                return (
                    <Badge variant="secondary" className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 hover:bg-${color}-200 border-0`}>
                        {String(value)}
                    </Badge>
                );
            }
            case 'person':
                return (
                    <div className="flex items-center gap-2">
                        <Avatar className="h-5 w-5">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${value}`} />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{String(value)}</span>
                    </div>
                );
            case 'date':
                return <span className="text-sm text-muted-foreground">{String(value)}</span>;
            default:
                return <span className="text-sm">{JSON.stringify(value)}</span>;
        }
    };

    return (
        <div className="rounded-md border bg-white dark:bg-[#191919]">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[50px]"></TableHead>
                        {/* Always show Name/Title first */}
                        <TableHead className="min-w-[200px]">Name</TableHead>
                        {/* Render other properties dynamically */}
                        {Object.entries(database.properties).map(([key, prop]) => {
                            if (key === 'name') return null; // Already handled
                            return <TableHead key={key} className="whitespace-nowrap">{prop.name}</TableHead>;
                        })}
                        <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {records.map((record) => (
                        <TableRow key={record.id} className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50" onClick={() => navigate(`/universal?record=${record.id}`)}>
                            <TableCell className="py-2">
                                <div className="flex items-center justify-center text-xl">{record.icon || '📄'}</div>
                            </TableCell>
                            <TableCell className="font-medium py-2">
                                <div className="flex items-center gap-2">
                                    {(record.properties.name as string) || 'Untitled'}
                                    <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity ml-auto">
                                        <FileText className="h-3 w-3 text-muted-foreground" />
                                    </Button>
                                </div>
                            </TableCell>
                            {Object.entries(database.properties).map(([key, prop]) => {
                                if (key === 'name') return null;
                                return (
                                    <TableCell key={key} className="py-2">
                                        {renderCell(prop, record.properties[key])}
                                    </TableCell>
                                );
                            })}
                            <TableCell>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                    {/* New Row Placeholder */}
                    <TableRow className="hover:bg-transparent">
                        <TableCell colSpan={Object.keys(database.properties).length + 2} className="py-2">
                            <Button variant="ghost" className="text-muted-foreground hover:text-foreground pl-2 gap-2 h-8 w-full justify-start text-sm font-normal">
                                <Plus className="h-4 w-4" /> New
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    );
};
