"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { JsonEditor } from "@/components/json-editor"
import { DownloadButton } from "@/components/json-editor-buttons/DownloadButton"
import { FileButton } from "@/components/json-editor-buttons/FileButton"
import { UndoButton } from "@/components/json-editor-buttons/UndoButton"
import { MagicFixButton } from "@/components/json-editor-buttons/MagicFixButton"
import { JsonMinifierButton } from "@/components/json-editor-buttons/JsonMinifierButton"

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showLineNumbers, setShowLineNumbers] = useState(true)

  // Update formatted output whenever input changes
  useEffect(() => {
    if (!inputJson.trim()) {
      setOutputJson("")
      setError(null)
      return
    }

    try {
      // Parse and stringify to validate and format
      const parsed = JSON.parse(inputJson)
      setOutputJson(JSON.stringify(parsed, null, 2))
      setError(null)
    } catch (err) {
      console.error('Failed to process JSON:', err)
      setError("Invalid JSON: Please check your input.")
      setOutputJson("")
    }
  }, [inputJson])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">JSON Formatter</h1>
          <p className="text-muted-foreground">
            Format, validate, and beautify your JSON with our powerful JSON editor.
          </p>
        </div>
      </div>

      <div className="flex items-center">
        <div className="flex items-center gap-2">
          <Label htmlFor="show-line-numbers" className="text-sm">
            Show Line Numbers
          </Label>
          <Switch
            id="show-line-numbers"
            checked={showLineNumbers}
            onCheckedChange={setShowLineNumbers}
          />
        </div>
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
                  <Label>Input JSON</Label>
                  <div className="flex items-center gap-2">
                    <FileButton 
                      input={inputJson} 
                      setInput={setInputJson} 
                      setError={setError}
                    />
                    <UndoButton 
                      input={inputJson} 
                      setInput={setInputJson}
                    />
                    <MagicFixButton 
                      input={inputJson}
                      setInput={setInputJson}
                      setOutput={setOutputJson}
                      setError={setError}
                    />
                    <JsonMinifierButton 
                      input={inputJson}
                      setInput={setInputJson}
                      setOutput={setOutputJson}
                      setError={setError}
                    />
                    <DownloadButton 
                      content={inputJson} 
                      filename="input.json" 
                    />
                  </div>
                </div>
              </div>
              <JsonEditor
                value={inputJson}
                onChange={setInputJson}
                showLineNumbers={showLineNumbers}
              />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <Label>Formatted JSON</Label>
                  <DownloadButton 
                    content={outputJson} 
                    filename="formatted.json" 
                  />
                </div>
              </div>
              <JsonEditor
                value={outputJson}
                readOnly
                showLineNumbers={showLineNumbers}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
