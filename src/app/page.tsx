"use client";

import { useState } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Toaster, toast } from 'sonner';
import { Copy, RefreshCw } from "lucide-react";

// Ace Editor imports
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

export default function Home() {
    const [code, setCode] = useState<string>("");
    const [analysis, setAnalysis] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const validateCode = (code: string): boolean => {
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
            toast.error("Code analysis failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col md:flex-row min-h-screen p-4 bg-gray-900 text-white gap-4">
            {/* Code Editor Section */}
            <div className="w-full md:w-1/2 p-4">
                <h2 className="text-xl font-bold mb-2">TypeScript Code Editor</h2>
                <AceEditor
                    mode="typescript"
                    theme="dracula"
                    value={code}
                    onChange={setCode}
                    fontSize={16}
                    width="100%"
                    height="50vh"
                    className="rounded-lg border border-gray-700"
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                />
                <Toaster position="bottom-left" />
                <Button 
                    className="mt-4 w-full bg-blue-500 hover:bg-blue-600" 
                    onClick={handleAnalyze} 
                    disabled={loading}
                >
                    {loading ? "Analyzing..." : "Optimize & Analyze"}
                </Button>
            </div>

            {/* Analysis Result Section */}
            <div className="w-full md:w-1/2 p-4">
                <h2 className="text-xl font-bold mb-2">AI Analysis Result</h2>
                <Card className="bg-white border border-blue-500 min-h-[50vh]">
                    <CardContent className="p-6 overflow-y-auto">
                        <div className="prose prose-sm text-blue-700 max-w-none">
                            {analysis ? (
                                <ReactMarkdown>{analysis}</ReactMarkdown>
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
