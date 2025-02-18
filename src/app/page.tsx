"use client";

import { useState } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from 'sonner';
import { Copy } from "lucide-react";

// Ace Editor imports
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

// TypeScript type for error response
type ErrorResponse = {
    message?: string;
};

const CodeBlock = ({ children, className }: { children: string; className?: string }) => {
    // Clean up the code string by removing extra newlines and spaces
    const codeString = typeof children === 'string' 
        ? children.trim()
        : Array.isArray(children) 
            ? children.join('').trim()
            : '';

    const handleCopy = () => {
        if (!codeString) {
            toast.error("No code to copy");
            return;
        }

        // Create a temporary textarea element
        const textarea = document.createElement('textarea');
        textarea.value = codeString;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);

        try {
            // Select and copy the text
            textarea.select();
            document.execCommand('copy');
            toast.success("Code copied to clipboard!");
        } catch (err) {
            toast.error("Failed to copy code");
            console.error('Copy failed:', err);
        } finally {
            // Clean up
            document.body.removeChild(textarea);
        }
    };

    const language = className?.replace(/language-/, '') || 'typescript';

    return (
        <div className="relative group my-4">
            <div className="bg-gray-800 rounded-lg overflow-hidden">
                <div className="flex justify-between items-center px-4 py-2 bg-gray-700">
                    <span className="text-xs text-gray-300">{language}</span>
                    <Button 
                        variant="ghost" 
                        size="sm" 
                        className="h-8 w-8 p-0 hover:bg-gray-600"
                        onClick={handleCopy}
                    >
                        <Copy className="h-4 w-4 text-gray-300" />
                    </Button>
                </div>
                <pre className="p-4 m-0 overflow-x-auto">
                    <code className="text-sm font-mono text-white">{codeString}</code>
                </pre>
            </div>
        </div>
    );
};

export default function Home() {
    const [code, setCode] = useState<string>("");
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateCode = (code: string): boolean => {
        if(!code){
            toast.error('Please enter TypeScript code to analyze');
            return false;
        }
        if (!code.trim()) {
            toast.error("Please enter TypeScript code to analyze");
            return false;
        }

        if (code.length > 10000) {
            toast.error("Code exceeds maximum length of 10,000 characters");
            return false;
        }

        return true;
    };

    const handleAnalyze = async () => {
        if (!validateCode(code)) return;

        setLoading(true);
        setAnalysis(null);

        try {
            const response = await axios.post(
                "https://tsguardianbackend.onrender.com/analyze-code",
                { code }
            );

            const analysisText = response.data?.analysis?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (typeof analysisText === "string") {
                setAnalysis(analysisText);
            } else {
                throw new Error("Invalid analysis response format");
            }
        } catch (error) {
            console.error("Analysis error:", error);

            if (axios.isAxiosError<ErrorResponse>(error)) {
                const serverMessage = error.response?.data?.message;
                toast.error(serverMessage || "Code analysis failed. Please try again.");
            } else if (error instanceof Error) {
                toast.error(error.message);
            } else {
                toast.error("An unexpected error occurred");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen p-6 bg-gray-900 text-white">
            <div className="w-1/2 p-4">
                <h2 className="text-xl font-bold mb-2 text-white">TypeScript Code Editor</h2>
                <AceEditor
                    mode="typescript"
                    theme="dracula"
                    value={code}
                    onChange={setCode}
                    fontSize={16}
                    width="100%"
                    height="70vh"
                    className="rounded-lg border border-gray-700"
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                />
                <Toaster position="bottom-left"/>
                <Button 
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600" 
                    onClick={handleAnalyze} 
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Optimize & Analyze"}
                </Button>
            </div>

            <div className="w-1/2 p-4">
                <h2 className="text-xl font-bold mb-2 text-white">AI Analysis Result</h2>
                <Card className="bg-white border border-blue-500 h-[70vh] relative">
                    <CardContent className="absolute inset-0 p-6 overflow-y-auto overflow-x-hidden">
                        <div className="prose prose-sm text-blue-700 max-w-none">
                            {analysis ? (
                                <ReactMarkdown
                                    components={{
                                        code: ({ children, className }) => (
                                            <CodeBlock className={className}>{children as string}</CodeBlock>
                                        ),
                                        pre: ({ children }) => <>{children}</>,
                                        p: ({ children }) => <p className="mb-4">{children}</p>,
                                        h1: ({ children }) => <h1 className="text-xl font-bold mb-4">{children}</h1>,
                                        h2: ({ children }) => <h2 className="text-lg font-bold mb-3">{children}</h2>,
                                        ul: ({ children }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
                                        li: ({ children }) => <li className="mb-2">{children}</li>,
                                        strong: ({ children }) => <strong className="font-bold text-blue-800">{children}</strong>,
                                    }}
                                >
                                    {analysis}
                                </ReactMarkdown>
                            ) : (
                                <p className="text-blue-700">
                                    {loading ? "Analyzing your code..." : "Analysis results will appear here"}
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}