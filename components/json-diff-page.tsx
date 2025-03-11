"use client"

import type React from "react"

import { useState } from "react"
import { FileJson, Copy, Download, ArrowRightLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"
import { JsonEditor } from "@/components/json-editor"

interface JsonDiffPageProps {
  className?: string
}

interface DiffHighlight {
  line: number
  type: 'added' | 'deleted' | 'changed'
}

interface JsonDiffStats {
  additions: number
  deletions: number
  changes: number
}

interface LineInfo {
  content: string
  path: string[]
  indentation: number
  isValue: boolean
}

const SAMPLE_JSON_LEFT = {
  "name": "FastUtils",
  "version": "1.0.0",
  "description": "An all-in-one utility hub",
  "features": [
    "JSON formatting",
    "File conversion"
  ],
  "settings": {
    "theme": "dark",
    "indentation": 2
  }
}

const SAMPLE_JSON_RIGHT = {
  "name": "FastUtils Pro",
  "version": "1.1.0",
  "description": "An all-in-one utility hub",
  "features": [
    "JSON formatting",
    "File conversion",
    "Image editing"
  ],
  "settings": {
    "theme": "light",
    "indentation": 2,
    "sortKeys": true
  }
}

export function JsonDiffPage({ className }: JsonDiffPageProps) {
  const [leftInput, setLeftInput] = useState("")
  const [rightInput, setRightInput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [showLineNumbers, setShowLineNumbers] = useState(true)
  const [diffStats, setDiffStats] = useState<JsonDiffStats>({ additions: 0, deletions: 0, changes: 0 })
  const [leftHighlights, setLeftHighlights] = useState<DiffHighlight[]>([])
  const [rightHighlights, setRightHighlights] = useState<DiffHighlight[]>([])
  const [indentation, setIndentation] = useState("2")
  const [isProcessing, setIsProcessing] = useState(false)

  const compareJson = (left: string, right: string) => {
    try {
      setError(null)
      const leftObj = JSON.parse(left)
      const rightObj = JSON.parse(right)

      // Convert to formatted strings
      const leftStr = JSON.stringify(leftObj, null, 2)
      const rightStr = JSON.stringify(rightObj, null, 2)

      // Split into lines
      const leftLines = leftStr.split('\n')
      const rightLines = rightStr.split('\n')

      const newLeftHighlights: DiffHighlight[] = []
      const newRightHighlights: DiffHighlight[] = []
      let additions = 0
      let deletions = 0
      let changes = 0

      // Helper function to get the key and value from a line
      const parseLine = (line: string): { key: string | null, value: string | null, path: string[] } => {
        const trimmed = line.trim()
        
        // Skip empty lines, brackets, and commas
        if (!trimmed || trimmed.match(/^[{}\[\],]$/)) {
          return { key: null, value: null, path: [] }
        }
        
        // Handle array items (just strings)
        if (trimmed.startsWith('"') && !trimmed.includes(':')) {
          const match = trimmed.match(/"([^"]+)"/)
          return { 
            key: null,
            value: match ? match[1] : null,
            path: []
          }
        }
        
        // Handle property values
        if (trimmed.includes(':')) {
          const colonIndex = trimmed.indexOf(':')
          const beforeColon = trimmed.slice(0, colonIndex)
          const afterColon = trimmed.slice(colonIndex + 1).trim()
          
          const keyMatch = beforeColon.match(/"([^"]+)"/)
          const key = keyMatch ? keyMatch[1] : null
          
          let value: string | null = null
          if (afterColon.startsWith('"')) {
            const valueMatch = afterColon.match(/"([^"]+)"/)
            value = valueMatch ? valueMatch[1] : afterColon.replace(/,\s*$/, '')
          } else {
            value = afterColon.replace(/,\s*$/, '')
          }
          
          return { key, value, path: key ? [key] : [] }
        }
        
        return { key: null, value: null, path: [] }
      }

      // Helper function to normalize values for comparison
      const normalizeValue = (value: string | null): string => {
        if (!value) return ''
        // Remove any trailing comma and whitespace
        return value.replace(/,\s*$/, '').trim()
      }

      // Helper function to get indentation level
      const getIndentLevel = (line: string): number => {
        const match = line.match(/^\s*/)
        return match ? match[0].length : 0
      }

      // Helper function to build path for a line
      const buildPath = (lines: string[], lineIndex: number): string[] => {
        const path: string[] = []
        const currentIndent = getIndentLevel(lines[lineIndex])
        
        // Look back through previous lines to build the path
        for (let i = lineIndex - 1; i >= 0; i--) {
          const { key } = parseLine(lines[i])
          const indent = getIndentLevel(lines[i])
          
          if (indent < currentIndent && key) {
            path.unshift(key)
            if (indent === 0) break
          }
        }
        
        return path
      }

      // Track which lines have been processed
      const processedLeft = new Set<number>()
      const processedRight = new Set<number>()

      // First pass: match up key-value pairs and find changes
      for (let i = 0; i < leftLines.length; i++) {
        const leftParsed = parseLine(leftLines[i])
        if (!leftParsed.value) continue

        const leftPath = buildPath(leftLines, i)
        let found = false
        let isChanged = false

        // If it's a key-value pair, look for the same key in the same context
        if (leftParsed.key) {
          for (let j = 0; j < rightLines.length; j++) {
            const rightParsed = parseLine(rightLines[j])
            const rightPath = buildPath(rightLines, j)
            
            if (rightParsed.key === leftParsed.key && 
                JSON.stringify(rightPath) === JSON.stringify(leftPath)) {
              found = true
              processedLeft.add(i)
              processedRight.add(j)
              
              // Check if the value changed
              if (normalizeValue(rightParsed.value) !== normalizeValue(leftParsed.value)) {
                newLeftHighlights.push({ line: i, type: 'changed' })
                newRightHighlights.push({ line: j, type: 'changed' })
                changes++
              }
              break
            }
          }
        } else {
          // For array items, look for the same value in the same context
          for (let j = 0; j < rightLines.length; j++) {
            const rightParsed = parseLine(rightLines[j])
            const rightPath = buildPath(rightLines, j)
            
            if (!processedRight.has(j) && 
                !rightParsed.key && 
                JSON.stringify(rightPath) === JSON.stringify(leftPath) &&
                normalizeValue(rightParsed.value) === normalizeValue(leftParsed.value)) {
              found = true
              processedLeft.add(i)
              processedRight.add(j)
              break
            }
          }
        }

        if (!found && !isChanged) {
          // Value was deleted
          newLeftHighlights.push({ line: i, type: 'deleted' })
          deletions++
        }
      }

      // Second pass: find added values
      for (let i = 0; i < rightLines.length; i++) {
        if (processedRight.has(i)) continue

        const rightParsed = parseLine(rightLines[i])
        if (!rightParsed.value) continue

        // If we haven't processed this line and it has a value, it must be new
        newRightHighlights.push({ line: i, type: 'added' })
        additions++
      }

      setLeftHighlights(newLeftHighlights)
      setRightHighlights(newRightHighlights)
      setDiffStats({ additions, deletions, changes })
    } catch (err) {
      console.error('Error in compareJson:', err)
      setError("Invalid JSON format")
      setLeftHighlights([])
      setRightHighlights([])
      setDiffStats({ additions: 0, deletions: 0, changes: 0 })
    }
  }

  const loadSampleData = () => {
    const leftStr = JSON.stringify(SAMPLE_JSON_LEFT, null, 2)
    const rightStr = JSON.stringify(SAMPLE_JSON_RIGHT, null, 2)
    setLeftInput(leftStr)
    setRightInput(rightStr)
    compareJson(leftStr, rightStr)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center gap-4">
          <div className="mr-4 hidden md:flex">
            <FileJson className="mr-2 h-5 w-5" />
            <h1 className="text-lg font-semibold">JSON Diff</h1>
          </div>

          <div className="flex flex-1 items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={loadSampleData}
              className="h-8"
            >
              Load Sample
            </Button>

            <div className="flex items-center gap-2">
              <Label htmlFor="show-line-numbers" className="text-sm">
                Line Numbers
              </Label>
              <Switch
                id="show-line-numbers"
                checked={showLineNumbers}
                onCheckedChange={setShowLineNumbers}
              />
            </div>

            <Select
              value={indentation}
              onValueChange={setIndentation}
            >
              <SelectTrigger className="h-8 w-[130px]">
                <SelectValue placeholder="Select indentation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2">2 spaces</SelectItem>
                <SelectItem value="4">4 spaces</SelectItem>
                <SelectItem value="6">6 spaces</SelectItem>
                <SelectItem value="8">8 spaces</SelectItem>
              </SelectContent>
            </Select>

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    disabled={true}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Download Diff</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          <div className="flex items-center gap-2">
            {diffStats.additions > 0 && (
              <Badge variant="outline" className="bg-green-700/10 text-green-700">
                +{diffStats.additions} additions
              </Badge>
            )}
            {diffStats.deletions > 0 && (
              <Badge variant="outline" className="bg-red-700/10 text-red-700">
                -{diffStats.deletions} deletions
              </Badge>
            )}
            {diffStats.changes > 0 && (
              <Badge variant="outline" className="bg-blue-700/10 text-blue-700">
                ~{diffStats.changes} changes
              </Badge>
            )}
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <Card>
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="left-json">Original JSON</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-red-700/15"></div>
                    Deleted
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-700/15"></div>
                    Changed
                  </span>
                </div>
              </div>
              <JsonEditor
                value={leftInput}
                onChange={(value) => {
                  setLeftInput(value)
                  compareJson(value, rightInput)
                }}
                showLineNumbers={showLineNumbers}
                highlights={leftHighlights}
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3">
              <div className="flex justify-between items-center mb-2">
                <Label htmlFor="right-json">Modified JSON</Label>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-green-700/15"></div>
                    Added
                  </span>
                  <span className="flex items-center gap-1">
                    <div className="w-3 h-3 rounded bg-blue-700/15"></div>
                    Changed
                  </span>
                </div>
              </div>
              <JsonEditor
                value={rightInput}
                onChange={(value) => {
                  setRightInput(value)
                  compareJson(leftInput, value)
                }}
                showLineNumbers={showLineNumbers}
                highlights={rightHighlights}
                className="min-h-[300px]"
              />
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
