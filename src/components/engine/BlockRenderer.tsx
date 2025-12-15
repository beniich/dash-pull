
import React, { useState } from 'react';
import { Block, BlockType } from '@/types/engine';
import { cn } from '@/lib/utils';
import { Sparkles, Bot, Play, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface BlockRendererProps {
    block: Block;
    onUpdate?: (id: string, updates: Partial<Block>) => void;
    readOnly?: boolean;
}

const AIBlockRenderer = ({ block, onUpdate }: BlockRendererProps) => {
    const [prompt, setPrompt] = useState(block.content?.prompt || '');
    const [output, setOutput] = useState(block.content?.output || '');
    const [isGenerating, setIsGenerating] = useState(false);

    const handleGenerate = async () => {
        setIsGenerating(true);
        // Mock AI generation for now - this would connect to your AI service
        setTimeout(() => {
            const mockResponse = `Here is a generated analysis based on "${prompt}". \n\nThis would rely on the context of the deal or contact connected to this block.`;
            setOutput(mockResponse);
            onUpdate?.(block.id, {
                content: { ...block.content, prompt, output: mockResponse }
            });
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <Card className="border-purple-200 bg-purple-50/30 dark:bg-purple-950/10 dark:border-purple-800 my-2">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 mb-2">
                    <Bot className="h-5 w-5" />
                    <span className="font-semibold text-sm">AI Assistant</span>
                </div>

                {!output ? (
                    <div className="space-y-2">
                        <Textarea
                            placeholder="Ask AI to analyze, summarize, or draft something..."
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            className="resize-none bg-white dark:bg-zinc-900"
                        />
                        <div className="flex justify-end">
                            <Button
                                size="sm"
                                onClick={handleGenerate}
                                disabled={!prompt || isGenerating}
                                className="bg-purple-600 hover:bg-purple-700 text-white"
                            >
                                {isGenerating ? (
                                    <Sparkles className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                    <Play className="h-4 w-4 mr-2" />
                                )}
                                Generate
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="prose dark:prose-invert max-w-none">
                        <div className="p-3 bg-white dark:bg-zinc-900 rounded-md text-sm border">
                            {output}
                        </div>
                        <div className="flex justify-end mt-2 gap-2">
                            <Button variant="ghost" size="sm" onClick={() => setOutput('')} className="text-xs">
                                Try Again
                            </Button>
                            <Button variant="outline" size="sm" className="text-xs gap-1">
                                <Check className="h-3 w-3" /> Insert as Text
                            </Button>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export const BlockRenderer: React.FC<BlockRendererProps> = ({ block, onUpdate, readOnly }) => {
    // Common container classes based on type
    const containerClass = cn(
        "py-1 px-2 group relative transition-colors duration-200 min-h-[24px]",
        !readOnly && "hover:bg-gray-50 dark:hover:bg-white/5 rounded"
    );

    switch (block.type) {
        case 'heading_1':
            return (
                <div className={containerClass}>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{block.content}</h1>
                </div>
            );
        case 'heading_2':
            return (
                <div className={containerClass}>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mt-4 mb-2">{block.content}</h2>
                </div>
            );
        case 'heading_3':
            return (
                <div className={containerClass}>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mt-2 mb-1">{block.content}</h3>
                </div>
            );
        case 'text':
            if (!readOnly && onUpdate) {
                return (
                    <div className={containerClass}>
                        <input
                            className="w-full bg-transparent border-none outline-none text-base text-gray-700 dark:text-gray-300 placeholder:text-gray-300 padding-0"
                            value={block.content}
                            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                            placeholder="Type something..."
                        />
                    </div>
                );
            }
            return (
                <div className={containerClass}>
                    <p className="text-base text-gray-700 dark:text-gray-300 min-h-[1.5em]">{block.content}</p>
                </div>
            );
        case 'bulleted_list_item':
            return (
                <div className={cn(containerClass, "flex gap-2 items-start")}>
                    <span className="text-xl leading-6">•</span>
                    {!readOnly && onUpdate ? (
                        <input
                            className="w-full bg-transparent border-none outline-none text-base text-gray-700 dark:text-gray-300"
                            value={block.content}
                            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        />
                    ) : (
                        <p className="text-base text-gray-700 dark:text-gray-300">{block.content}</p>
                    )}
                </div>
            );
        case 'to_do':
            return (
                <div className={cn(containerClass, "flex gap-2 items-center")}>
                    <input
                        type="checkbox"
                        checked={block.properties?.checked || false}
                        onChange={() => !readOnly && onUpdate?.(block.id, {
                            properties: { ...block.properties, checked: !block.properties?.checked }
                        })}
                        className="rounded border-gray-300 cursor-pointer"
                        disabled={readOnly}
                    />
                    {!readOnly && onUpdate ? (
                        <input
                            className={cn("w-full bg-transparent border-none outline-none text-base transition-colors", block.properties?.checked && "line-through text-gray-400")}
                            value={block.content}
                            onChange={(e) => onUpdate(block.id, { content: e.target.value })}
                        />
                    ) : (
                        <p className={cn("text-base", block.properties?.checked && "line-through text-gray-400")}>
                            {block.content}
                        </p>
                    )}
                </div>
            );
        case 'callout':
            return (
                <div className={cn(containerClass, "my-2")}>
                    <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg flex gap-3 text-gray-800 dark:text-gray-200 border-l-4 border-blue-500">
                        <span className="text-xl">{block.properties?.icon || '💡'}</span>
                        <div>{block.content}</div>
                    </div>
                </div>
            );
        case 'ai_block':
            return <AIBlockRenderer block={block} onUpdate={onUpdate} />;

        case 'divider':
            return <hr className="my-4 border-gray-200 dark:border-gray-800" />;

        default:
            return (
                <div className={containerClass}>
                    <Badge variant="outline" className="text-xs text-muted-foreground">
                        Unsupported block: {block.type}
                    </Badge>
                </div>
            );
    }
};
