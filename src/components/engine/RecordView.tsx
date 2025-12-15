
import React from 'react';
import { RecordPage, Block, DatabaseProperty, PropertyType } from '@/types/engine';
import { BlockRenderer } from './BlockRenderer';
import { Button } from '@/components/ui/button';
import { Calendar, User, Tag, FileText, MoreHorizontal, Clock, Plus } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface RecordViewProps {
    record: RecordPage;
    propertiesSchema: Record<string, DatabaseProperty>;
    onUpdate?: (updates: Partial<RecordPage>) => void;
}

export const RecordView: React.FC<RecordViewProps> = ({ record, propertiesSchema, onUpdate }) => {
    const handleUpdateBlock = (blockId: string, updates: Partial<Block>) => {
        if (!onUpdate) return;
        const newBlocks = record.blocks.map(b =>
            b.id === blockId ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
        );
        onUpdate({ blocks: newBlocks });
    };

    const handleAddBlock = () => {
        if (!onUpdate) return;
        const newBlock: Block = {
            id: `blk_${Date.now()}`,
            type: 'text',
            content: '',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        onUpdate({ blocks: [...record.blocks, newBlock] });
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-[#191919] text-slate-900 dark:text-slate-50 relative animate-in fade-in duration-300">

            {/* Cover Image ... */}
            <div className="h-48 w-full bg-gradient-to-r from-pink-200 via-purple-200 to-indigo-200 dark:from-pink-900/40 dark:via-purple-900/40 dark:to-indigo-900/40 relative group">
                {record.cover && (
                    <img src={record.cover} alt="Cover" className="w-full h-full object-cover opacity-80" />
                )}
                <Button variant="secondary" size="sm" className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                    Change Cover
                </Button>
            </div>

            <ScrollArea className="flex-1">
                <div className="max-w-4xl mx-auto px-12 pb-24">

                    {/* Header Icon & Title */}
                    <div className="-mt-10 relative mb-8 group">
                        <div className="text-7xl mb-4 hover:scale-105 transition-transform origin-bottom-left cursor-pointer inline-block shadow-sm">
                            {record.icon || '📄'}
                        </div>
                        <div className="group/title">
                            <input
                                className="text-4xl font-bold text-slate-900 dark:text-slate-100 bg-transparent border-none outline-none w-full placeholder:text-slate-300"
                                value={(record.properties.name as string) || ''} // Using 'name' as title based on our previous schema
                                onChange={(e) => onUpdate?.({ properties: { ...record.properties, name: e.target.value } })}
                                placeholder="Untitled"
                            />
                        </div>
                    </div>

                    {/* Properties Grid */}
                    <div className="grid grid-cols-[160px_1fr] gap-y-3 gap-x-4 mb-8 text-sm">
                        {Object.entries(propertiesSchema).map(([key, schema]) => {
                            const value = record.properties[key];
                            if (!value && key !== 'status') return null; // Hide empty non-essential props for demo

                            return (
                                <React.Fragment key={key}>
                                    <div className="flex items-center text-slate-500 dark:text-slate-400 gap-2 h-8">
                                        {getIconForType(schema.type)}
                                        <span className="truncate">{schema.name}</span>
                                    </div>
                                    <div className="flex items-center min-h-[32px]">
                                        <PropertyValueRenderer type={schema.type} value={value} options={schema.options} />
                                    </div>
                                </React.Fragment>
                            );
                        })}

                        {/* Add Property Button */}
                        <div className="col-span-2 pt-2">
                            <Button variant="ghost" size="sm" className="text-slate-400 hover:text-slate-600 pl-0 gap-1 h-6 text-xs">
                                <Plus className="h-3 w-3" /> Add property
                            </Button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-200 dark:bg-slate-800 my-6" />

                    {/* Page Content (Blocks) */}
                    <div className="space-y-px min-h-[300px]">
                        {record.blocks.length > 0 ? (
                            record.blocks.map((block) => (
                                <BlockRenderer
                                    key={block.id}
                                    block={block}
                                    onUpdate={handleUpdateBlock}
                                />
                            ))
                        ) : (
                            <div className="text-slate-400 italic p-2" onClick={handleAddBlock}>Click to add content...</div>
                        )}

                        {/* New Block Placeholder */}
                        <div className="opacity-0 hover:opacity-100 transition-opacity" onClick={handleAddBlock}>
                            <div className="flex items-center gap-2 text-slate-300 p-1 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800/50 rounded mt-2">
                                <Plus className="h-4 w-4" />
                                <span className="text-sm">Click to add a block</span>
                            </div>
                        </div>
                    </div>

                </div>
            </ScrollArea>
        </div>
    );
};

// Helper components for property rendering
interface PropertyValueRendererProps {
    type: PropertyType;
    value: unknown;
    options?: { id: string; name: string; color?: string }[];
}

const PropertyValueRenderer = ({ type, value, options }: PropertyValueRendererProps) => {
    switch (type) {
        case 'status':
        case 'select': {
            const option = options?.find((o) => o.name === (value as string));
            const color = option?.color || 'gray';
            return (
                <Badge variant="secondary" className={`bg-${color}-100 text-${color}-800 dark:bg-${color}-900/30 dark:text-${color}-300 hover:bg-${color}-200 border-0 font-normal px-2 py-0.5`}>
                    {String(value)}
                </Badge>
            );
        }
        case 'multi_select':
            return (
                <div className="flex flex-wrap gap-1">
                    {Array.isArray(value) && (value as string[]).map((v) => (
                        <Badge key={v} variant="outline" className="font-normal text-xs">{v}</Badge>
                    ))}
                </div>
            );
        case 'person':
            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${value as string}`} />
                        <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <span>{value as string}</span>
                </div>
            );
        case 'date':
            return <span className="text-slate-700 dark:text-slate-300">{value as string}</span>;
        case 'url':
            return <a href={value as string} className="text-blue-500 hover:underline decoration-blue-500/30 underline-offset-4">{value as string}</a>;
        default:
            return <span className="text-slate-900 dark:text-slate-100">{String(value)}</span>;
    }
};

const getIconForType = (type: string) => {
    switch (type) {
        case 'text': return <FileText className="h-4 w-4" />;
        case 'number': return <span className="text-xs font-bold w-4 text-center">#</span>;
        case 'select':
        case 'status': return <Tag className="h-4 w-4" />;
        case 'date': return <Calendar className="h-4 w-4" />;
        case 'person': return <User className="h-4 w-4" />;
        case 'created_time': return <Clock className="h-4 w-4" />;
        default: return <MoreHorizontal className="h-4 w-4" />;
    }
};
