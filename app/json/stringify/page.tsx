"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { JsonEditor } from "@/components/json-editor"
import { DownloadButton } from "@/components/json-editor-buttons/DownloadButton"
import { FileButton } from "@/components/json-editor-buttons/FileButton"
import { UndoButton } from "@/components/json-editor-buttons/UndoButton"
import { 
  ArrowRightLeft,
  Copy,
  AlignJustify
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const escapeJson = (str: string, removeLineBreaks: boolean): string => {
  try {
    // Parse the input as JSON to validate it
    const parsed = JSON.parse(str)
    
    // Get the stringified version with or without formatting
    let stringified = removeLineBreaks 
      ? JSON.stringify(parsed) // No formatting if removing line breaks
      : JSON.stringify(parsed, null, 2)
    
    // Now escape all the special characters
    stringified = stringified
      .replace(/\\/g, '\\\\')  // Must escape backslashes first
      .replace(/"/g, '\\"')    // Then escape quotes
      .replace(/\n/g, '\\n')   // Then escape newlines
      .replace(/\r/g, '\\r')   // Then escape carriage returns
      .replace(/\t/g, '\\t')   // Then escape tabs
    
    // Add quotes around the entire string
    return `"${stringified}"`
  } catch (err) {
    throw new Error("Invalid JSON")
  }
}

const unescapeJson = (str: string): string => {
  try {
    // Remove surrounding quotes if present
    str = str.replace(/^"(.*)"$/, '$1')
    
    // Unescape special characters
    str = str
      .replace(/\\"/g, '"')     // Unescape quotes
      .replace(/\\n/g, '\n')    // Unescape newlines
      .replace(/\\r/g, '\r')    // Unescape carriage returns
      .replace(/\\t/g, '\t')    // Unescape tabs
      .replace(/\\\\/g, '\\')   // Unescape backslashes last
    
    // Parse the string to validate it's proper JSON
    const parsed = JSON.parse(str)
    // Return it formatted
    return JSON.stringify(parsed, null, 2)
  } catch (err) {
    throw new Error("Invalid escaped JSON string")
  }
}

export default function JsonStringifyPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<'escape' | 'unescape'>('escape')
  const [removeLineBreaks, setRemoveLineBreaks] = useState(false)

  // Process the input based on mode
  const processInput = (value: string, newMode = mode) => {
    if (!value.trim()) {
      setOutput("")
      setError(null)
      return
    }

    try {
      if (newMode === 'escape') {
        setOutput(escapeJson(value, removeLineBreaks))
        setError(null)
      } else {
        setOutput(unescapeJson(value))
        setError(null)
      }
    } catch (err) {
      console.error('Failed to process:', err)
      setError(mode === 'escape' 
        ? "Invalid JSON: Please enter valid JSON to escape" 
        : "Invalid string: Please enter a valid escaped JSON string"
      )
      setOutput("")
    }
  }

  // Update output whenever input or settings change
  useEffect(() => {
    processInput(input)
  }, [input, mode, removeLineBreaks])

  // Handle mode toggle
  const toggleMode = () => {
    const newMode = mode === 'escape' ? 'unescape' : 'escape'
    setMode(newMode)
    // Swap input and output when changing modes
    setInput(output)
    processInput(output, newMode)
  }

  // Handle copy to clipboard
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">JSON Stringify-Destringify</h1>
          <p className="text-muted-foreground">
            Convert between JSON and escaped JSON string format
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={removeLineBreaks ? "default" : "outline"}
                size="icon"
                onClick={() => setRemoveLineBreaks(!removeLineBreaks)}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Remove line breaks in input</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={toggleMode}
              >
                <ArrowRightLeft className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Switch between Escape and Unescape</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Copy to clipboard</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-2 divide-x">
            <div className="p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <Label>{mode === 'escape' ? 'JSON' : 'Escaped JSON String'}</Label>
                  <div className="flex items-center gap-2">
                    <FileButton 
                      input={input} 
                      setInput={setInput} 
                      setError={setError}
                    />
                    <UndoButton 
                      input={input} 
                      setInput={setInput}
                    />
                    <DownloadButton 
                      content={input} 
                      filename={mode === 'escape' ? "input.json" : "input.txt"}
                    />
                  </div>
                </div>
              </div>
              <JsonEditor
                value={removeLineBreaks ? input.replace(/\n/g, '').replace(/\r/g, '') : input}
                onChange={(value) => setInput(removeLineBreaks ? value.replace(/\n/g, '').replace(/\r/g, '') : value)}
                showLineNumbers={true}
              />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <Label>{mode === 'escape' ? 'Escaped JSON String' : 'JSON'}</Label>
                  <DownloadButton 
                    content={output} 
                    filename={mode === 'escape' ? "output.txt" : "output.json"}
                  />
                </div>
              </div>
              <JsonEditor
                value={output}
                readOnly
                showLineNumbers={true}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
