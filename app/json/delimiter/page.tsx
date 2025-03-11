"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { JsonEditor } from "@/components/json-editor"
import { DownloadButton } from "@/components/json-editor-buttons/DownloadButton"
import { FileButton } from "@/components/json-editor-buttons/FileButton"
import { UndoButton } from "@/components/json-editor-buttons/UndoButton"
import { 
  Trash2, 
  AlignJustify,
  Quote,
  SplitSquareHorizontal,
  Tag,
  Hash,
  ListOrdered,
  ListTree
} from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface DelimiterSettings {
  tidyUp: boolean
  attackClones: boolean
  explodeType: 'new-lines' | 'spaces' | 'commas' | 'semicolons'
  quotes: 'none' | 'double' | 'single'
  delimiter: string
  tags: {
    openTag: string
    closeTag: string
  }
  interval: {
    value: number
    openTag: string
    closeTag: string
  }
}

const defaultSettings: DelimiterSettings = {
  tidyUp: false,
  attackClones: false,
  explodeType: 'new-lines',
  quotes: 'none',
  delimiter: '',
  tags: {
    openTag: '',
    closeTag: ''
  },
  interval: {
    value: 0,
    openTag: '',
    closeTag: ''
  }
}

export default function JsonDelimiterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [settings, setSettings] = useState<DelimiterSettings>(defaultSettings)
  const [showTagsInput, setShowTagsInput] = useState(false)
  const [showIntervalInput, setShowIntervalInput] = useState(false)
  const [showDelimiterInput, setShowDelimiterInput] = useState(false)

  // Process columnar data based on settings
  const processData = (input: string, settings: DelimiterSettings): string => {
    try {
      // Split input into lines
      const lines = input.split('\n').filter(line => line.trim())
      
      // Remove duplicates if attackClones is enabled
      const uniqueLines = settings.attackClones 
        ? [...new Set(lines)]
        : lines

      // Process each line
      let items = uniqueLines.map(line => {
        const str = line.trim()
        
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
      console.error('Failed to process data:', err)
      setError("Failed to process data. Please check your input.")
      return input
    }
  }

  // Update output whenever input or settings change
  useEffect(() => {
    if (input) {
      const processed = processData(input, settings)
      setOutput(processed)
    } else {
      setOutput("")
      setError(null)
    }
  }, [input, settings])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">Text Delimiter</h1>
          <p className="text-muted-foreground">
            Convert columnar data into delimited text with custom formatting options.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.tidyUp ? "default" : "outline"}
                size="icon"
                onClick={() => setSettings(s => ({ ...s, tidyUp: !s.tidyUp }))}
              >
                <AlignJustify className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tidy Up (Remove new lines)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.attackClones ? "default" : "outline"}
                size="icon"
                onClick={() => setSettings(s => ({ ...s, attackClones: !s.attackClones }))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Attack the clones (Remove duplicates)</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.explodeType === 'new-lines' ? "default" : "outline"}
                size="icon"
                onClick={() => setSettings(s => ({ 
                  ...s, 
                  explodeType: s.explodeType === 'new-lines' ? 'spaces' :
                             s.explodeType === 'spaces' ? 'commas' :
                             s.explodeType === 'commas' ? 'semicolons' : 'new-lines'
                }))}
              >
                <SplitSquareHorizontal className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Explode Type ({settings.explodeType})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={settings.quotes !== 'none' ? "default" : "outline"}
                size="icon"
                onClick={() => setSettings(s => ({ 
                  ...s, 
                  quotes: s.quotes === 'none' ? 'double' :
                         s.quotes === 'double' ? 'single' : 'none'
                }))}
              >
                <Quote className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Quotes ({settings.quotes})</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showDelimiterInput ? "default" : "outline"}
                size="icon"
                onClick={() => setShowDelimiterInput(!showDelimiterInput)}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Custom Delimiter</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showTagsInput ? "default" : "outline"}
                size="icon"
                onClick={() => setShowTagsInput(!showTagsInput)}
              >
                <Tag className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Wrap with Tags</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={showIntervalInput ? "default" : "outline"}
                size="icon"
                onClick={() => setShowIntervalInput(!showIntervalInput)}
              >
                <ListOrdered className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Interval Settings</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {showDelimiterInput && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>Custom Delimiter</Label>
            <Input
              value={settings.delimiter}
              onChange={(e) => setSettings(s => ({ ...s, delimiter: e.target.value }))}
              placeholder="Enter delimiter character"
            />
          </div>
        </div>
      )}

      {showTagsInput && (
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label>Open Tag</Label>
            <Input
              value={settings.tags.openTag}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                tags: { ...s.tags, openTag: e.target.value }
              }))}
              placeholder="e.g., <item>"
            />
          </div>
          <div className="flex-1">
            <Label>Close Tag</Label>
            <Input
              value={settings.tags.closeTag}
              onChange={(e) => setSettings(s => ({ 
                ...s, 
                tags: { ...s.tags, closeTag: e.target.value }
              }))}
              placeholder="e.g., </item>"
            />
          </div>
        </div>
      )}

      {showIntervalInput && (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Interval</Label>
              <Input
                type="number"
                min={0}
                value={settings.interval.value}
                onChange={(e) => setSettings(s => ({ 
                  ...s, 
                  interval: { ...s.interval, value: parseInt(e.target.value) || 0 }
                }))}
                placeholder="Enter number of items per interval"
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <Label>Interval Open Tag</Label>
              <Input
                value={settings.interval.openTag}
                onChange={(e) => setSettings(s => ({ 
                  ...s, 
                  interval: { ...s.interval, openTag: e.target.value }
                }))}
                placeholder="e.g., <group>"
              />
            </div>
            <div className="flex-1">
              <Label>Interval Close Tag</Label>
              <Input
                value={settings.interval.closeTag}
                onChange={(e) => setSettings(s => ({ 
                  ...s, 
                  interval: { ...s.interval, closeTag: e.target.value }
                }))}
                placeholder="e.g., </group>"
              />
            </div>
          </div>
        </div>
      )}

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
                  <Label>Input Data</Label>
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
                      filename="input.txt" 
                    />
                  </div>
                </div>
              </div>
              <JsonEditor
                value={input}
                onChange={setInput}
              />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <Label>Delimited Output</Label>
                  <DownloadButton 
                    content={output} 
                    filename="delimited.txt" 
                  />
                </div>
              </div>
              <JsonEditor
                value={output}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
