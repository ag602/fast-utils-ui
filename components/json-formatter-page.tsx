"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { FileJson, Copy, Check, Download, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent } from "@/components/ui/card"

interface JsonFormatterPageProps {
  className?: string
}

const SAMPLE_JSON = {
  name: "FastUtils",
  version: "1.0.0",
  description: "An all-in-one utility hub",
  features: ["JSON formatting", "File conversion", "Image editing"],
  settings: {
    theme: "dark",
    indentation: 2,
    sortKeys: false
  }
}

export function JsonFormatterPage({ className }: JsonFormatterPageProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [indentation, setIndentation] = useState("2")
  const [sortKeys, setSortKeys] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [jsonStats, setJsonStats] = useState({ characters: 0, lines: 0, keys: 0 })

  useEffect(() => {
    // Auto-format if valid JSON is pasted
    const handlePaste = async (e: ClipboardEvent) => {
      const text = e.clipboardData?.getData("text")
      if (!text) return

      try {
        JSON.parse(text)
        formatJson(text)
      } catch {
        // Invalid JSON, just let them paste it normally
      }
    }

    document.addEventListener("paste", handlePaste)
    return () => document.removeEventListener("paste", handlePaste)
  }, [])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(output)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy:", err)
    }
  }

  const downloadJson = () => {
    const blob = new Blob([output], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "formatted.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatJson = (text = input) => {
    setIsProcessing(true)
    setError(null)

    try {
      if (!text.trim()) {
        setOutput("")
        setJsonStats({ characters: 0, lines: 0, keys: 0 })
        return
      }

      let parsed = JSON.parse(text)

      if (sortKeys) {
        parsed = sortObjectKeys(parsed)
      }

      const spaces = Number.parseInt(indentation)
      const formatted = JSON.stringify(parsed, null, spaces)
      setOutput(formatted)

      // Calculate stats
      const stats = {
        characters: formatted.length,
        lines: formatted.split("\n").length,
        keys: countKeys(parsed)
      }
      setJsonStats(stats)
    } catch (err) {
      if (err instanceof Error) {
        setError(`Invalid JSON: ${err.message}`)
      } else {
        setError("Invalid JSON")
      }
      setOutput("")
      setJsonStats({ characters: 0, lines: 0, keys: 0 })
    } finally {
      setIsProcessing(false)
    }
  }

  const minifyJson = () => {
    setIsProcessing(true)
    setError(null)

    try {
      if (!input.trim()) {
        setOutput("")
        setJsonStats({ characters: 0, lines: 0, keys: 0 })
        return
      }

      let parsed = JSON.parse(input)

      if (sortKeys) {
        parsed = sortObjectKeys(parsed)
      }

      const minified = JSON.stringify(parsed)
      setOutput(minified)

      // Calculate stats
      const stats = {
        characters: minified.length,
        lines: 1,
        keys: countKeys(parsed)
      }
      setJsonStats(stats)
    } catch (err) {
      if (err instanceof Error) {
        setError(`Invalid JSON: ${err.message}`)
      } else {
        setError("Invalid JSON")
      }
      setOutput("")
      setJsonStats({ characters: 0, lines: 0, keys: 0 })
    } finally {
      setIsProcessing(false)
    }
  }

  const countKeys = (obj: any): number => {
    if (typeof obj !== "object" || obj === null) {
      return 0
    }

    let count = Array.isArray(obj) ? 0 : Object.keys(obj).length

    for (const key in obj) {
      if (typeof obj[key] === "object" && obj[key] !== null) {
        count += countKeys(obj[key])
      }
    }

    return count
  }

  const sortObjectKeys = (obj: any): any => {
    if (obj === null || typeof obj !== "object") {
      return obj
    }

    if (Array.isArray(obj)) {
      return obj.map(sortObjectKeys)
    }

    const sorted: any = {}
    Object.keys(obj)
      .sort()
      .forEach((key) => {
        sorted[key] = sortObjectKeys(obj[key])
      })

    return sorted
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <FileJson className="h-6 w-6" />
          </div>
          <div className="flex flex-1 items-center">
            <div>
              <h1 className="text-lg font-bold">JSON Formatter</h1>
              <p className="text-sm text-muted-foreground">Format, validate and beautify your JSON data</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left panel - Editor */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Editor</h2>
                <Button variant="ghost" size="sm" onClick={() => setInput("")}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
              <Textarea
                placeholder="Paste your JSON here..."
                className="font-mono min-h-[400px] resize-none"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="indentation">Indentation Spaces</Label>
                  <Select value={indentation} onValueChange={setIndentation}>
                    <SelectTrigger id="indentation">
                      <SelectValue placeholder="Select indentation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="2">2 Spaces</SelectItem>
                      <SelectItem value="4">4 Spaces</SelectItem>
                      <SelectItem value="8">8 Spaces</SelectItem>
                      <SelectItem value="0">No Indentation</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="sort-keys" className="cursor-pointer">
                    Sort Object Keys
                  </Label>
                  <Switch id="sort-keys" checked={sortKeys} onCheckedChange={setSortKeys} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Button onClick={() => formatJson()} disabled={isProcessing} className="flex-1">
                  Format
                </Button>
                <Button onClick={minifyJson} disabled={isProcessing} variant="secondary" className="flex-1">
                  Minify
                </Button>
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {/* Right panel - Result */}
          <Card>
            <CardContent className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-medium">Result</h2>
                {output && (
                  <div className="flex items-center gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={copyToClipboard}>
                            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                            {copied ? "Copied" : "Copy"}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Copy to clipboard</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button size="sm" variant="ghost" onClick={downloadJson}>
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Download JSON file</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                )}
              </div>
              {output ? (
                <pre className="font-mono text-sm min-h-[400px] overflow-auto whitespace-pre p-4 border rounded-md">
                  {output}
                </pre>
              ) : (
                <div className="flex flex-col items-center justify-center min-h-[400px] text-muted-foreground border rounded-md">
                  <FileJson className="h-12 w-12 mb-4" />
                  <p>Format or minify your JSON to see the result here</p>
                </div>
              )}
              {output && (
                <div className="flex flex-wrap gap-4">
                  <Badge variant="outline" className="text-xs">
                    Characters: {jsonStats.characters}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Lines: {jsonStats.lines}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    Keys: {jsonStats.keys}
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
