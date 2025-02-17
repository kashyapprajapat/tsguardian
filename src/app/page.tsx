"use client";

import { useState } from "react";
import AceEditor from "react-ace";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";

// Ace Editor imports
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/theme-dracula";
import "ace-builds/src-noconflict/ext-language_tools";

// TypeScript type for error response
type ErrorResponse = {
    message?: string;
};

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
            console.log("API called");

            const response = await axios.post(
                "https://tsguardianbackend.onrender.com/analyze-code",
                { code }
            );

            // Improved type checking for response
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
                    height="70%"
                    className="rounded-lg border border-gray-700"
                    setOptions={{
                        enableBasicAutocompletion: true,
                        enableLiveAutocompletion: true,
                        showLineNumbers: true,
                        tabSize: 2,
                    }}
                />
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
                <Card className="p-4 bg-white border border-blue-500">
                    <CardContent className="prose max-h-[500px] overflow-y-auto text-blue-700">
                        {analysis ? (
                            <ReactMarkdown>{analysis}</ReactMarkdown>
                        ) : (
                            <p className="text-blue-700">
                                {loading ? "Analyzing your code..." : "Analysis results will appear here"}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

