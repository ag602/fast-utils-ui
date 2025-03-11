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
import { JsonConverterSettings, type ConverterSettings } from "@/components/json-converter-settings"

const defaultConverterSettings: ConverterSettings = {
  tidyUp: false,
  attackClones: false,
  explodeType: 'new-lines',
  quotes: 'none',
  delimiter: '',
  tags: {
    openTag: '<li>',
    closeTag: '</li>'
  },
  interval: {
    value: 0,
    openTag: '<ul>',
    closeTag: '</ul>'
  }
}

export default function JsonFormatterPage() {
  const [inputJson, setInputJson] = useState("")
  const [outputJson, setOutputJson] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [settings, setSettings] = useState<ConverterSettings>(defaultConverterSettings)

  // Process JSON based on converter settings
  const processJson = (input: string, settings: ConverterSettings): string => {
    try {
      // Parse the input JSON
      const parsed = JSON.parse(input)
      
      // Convert to array if not already
      const array = Array.isArray(parsed) ? parsed : [parsed]
      
      // Remove duplicates if attackClones is enabled
      const uniqueArray = settings.attackClones 
        ? array.filter((item, index, self) => 
            index === self.findIndex(t => JSON.stringify(t) === JSON.stringify(item)))
        : array

      // Convert each item to string
      let items = uniqueArray.map(item => {
        const str = typeof item === 'object' ? JSON.stringify(item) : String(item)
        
        // Add quotes if specified
        if (settings.quotes === 'double') return `"${str}"`
        if (settings.quotes === 'single') return `'${str}'`
        return str
      })

      // Add tags if specified
      if (settings.tags.openTag && settings.tags.closeTag) {
        items = items.map(item => `${settings.tags.openTag}${item}${settings.tags.closeTag}`)
      }

      // Handle intervals
      if (settings.interval.value > 0) {
        const chunks = []
        for (let i = 0; i < items.length; i += settings.interval.value) {
          const chunk = items.slice(i, i + settings.interval.value)
          if (settings.interval.openTag && settings.interval.closeTag) {
            chunks.push(`${settings.interval.openTag}${chunk.join(settings.delimiter)}${settings.interval.closeTag}`)
          } else {
            chunks.push(chunk.join(settings.delimiter))
          }
        }
        return chunks.join('\n')
      }

      // Join items with delimiter or explode type
      let separator = settings.delimiter
      if (!separator) {
        switch (settings.explodeType) {
          case 'new-lines': separator = '\n'; break
          case 'spaces': separator = ' '; break
          case 'commas': separator = ','; break
          case 'semicolons': separator = ';'; break
        }
      }

      const result = items.join(separator)
      return settings.tidyUp ? result.replace(/\n/g, '') : result

    } catch (err) {
      console.error('Failed to process JSON:', err)
      setError("Failed to process JSON. Please check your input.")
      return input
    }
  }

  // Update formatted output whenever input or settings change
  useEffect(() => {
    if (inputJson) {
      const processed = processJson(inputJson, settings)
      setOutputJson(processed)
    } else {
      setOutputJson("")
      setError(null)
    }
  }, [inputJson, settings])

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

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
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
        <JsonConverterSettings 
          settings={settings}
          onSettingsChange={setSettings}
        />
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
