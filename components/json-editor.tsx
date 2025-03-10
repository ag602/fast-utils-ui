"use client"

import { useState, useEffect } from "react"
import { Check, Copy } from "lucide-react"
import dynamic from 'next/dynamic'
import { Button } from "@/components/ui/button"
import { ListButton } from "./json-editor-buttons/ListButton"
import { JsonBeautifierButton } from "./json-editor-buttons/JsonBeautifierButton"
import { DownloadButton } from "./json-editor-buttons/DownloadButton"
import { UndoButton } from "./json-editor-buttons/UndoButton"
import { MagicFixButton } from "./json-editor-buttons/MagicFixButton"
import { JsonToolbar } from "./json-editor-buttons/JsonToolbar"
import { configureAceEditor } from "@/config/ace-editor-worker"

// Configure Ace Editor
configureAceEditor()

// Dynamically import AceEditor to avoid SSR issues
const AceEditor = dynamic(
  async () => {
    const ace = await import('react-ace')
    await import('ace-builds/src-noconflict/mode-json')
    await import('ace-builds/src-noconflict/theme-tomorrow')
    await import('ace-builds/src-noconflict/ext-language_tools')
    await import('ace-builds/src-noconflict/ext-searchbox')
    return ace
  },
  { ssr: false }
)

interface JsonEditorProps {
  minify?: boolean
}

export function JsonEditor({ minify = false }: JsonEditorProps) {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [editorHeight, setEditorHeight] = useState("300px")
  const [fontSize, setFontSize] = useState(14)

  useEffect(() => {
    // Update editor height based on window size
    const updateHeight = () => {
      const minHeight = 300
      const maxHeight = window.innerHeight * 0.7
      setEditorHeight(`${Math.max(minHeight, maxHeight)}px`)
    }
    
    updateHeight()
    window.addEventListener('resize', updateHeight)
    return () => window.removeEventListener('resize', updateHeight)
  }, [])

  const formatJson = () => {
    try {
      const parsed = JSON.parse(input)
      const formatted = minify ? JSON.stringify(parsed) : JSON.stringify(parsed, null, 2)
      setOutput(formatted)
      setError(null)
    } catch (err) {
      setError("Invalid JSON: Please check your syntax")
      setOutput("")
    }
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleZoomIn = () => {
    setFontSize(prev => Math.min(prev + 2, 24))
  }

  const handleZoomOut = () => {
    setFontSize(prev => Math.max(prev - 2, 10))
  }

  const handleReset = () => {
    setFontSize(14)
  }

  const handleFilterEmpty = () => {
    try {
      const parsed = JSON.parse(input)
      const filtered = JSON.parse(JSON.stringify(parsed, (key, value) => {
        if (value === "") return undefined
        return value
      }))
      setInput(JSON.stringify(filtered, null, 2))
    } catch (err) {
      setError("Invalid JSON: Cannot filter empty values")
    }
  }

  const handleFilterNulls = () => {
    try {
      const parsed = JSON.parse(input)
      const filtered = JSON.parse(JSON.stringify(parsed, (key, value) => {
        if (value === null) return undefined
        return value
      }))
      setInput(JSON.stringify(filtered, null, 2))
    } catch (err) {
      setError("Invalid JSON: Cannot filter null values")
    }
  }

  const handleExpandAll = () => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed, null, 2))
    } catch (err) {
      setError("Invalid JSON: Cannot expand")
    }
  }

  const handleCollapseAll = () => {
    try {
      const parsed = JSON.parse(input)
      setInput(JSON.stringify(parsed))
    } catch (err) {
      setError("Invalid JSON: Cannot collapse")
    }
  }

  const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    showLineNumbers: true,
    tabSize: 2,
    useSoftTabs: true,
    showPrintMargin: false,
    highlightActiveLine: true,
    showGutter: true,
  }

  const editorStyle = {
    border: '2px solid #94a3b8', // Deeper border color (slate-400)
    borderRadius: '0.5rem',
    fontSize: `${fontSize}px`,
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <ListButton input={input} setInput={setInput} />
        <JsonBeautifierButton
          input={input}
          setInput={setInput}
          setOutput={setOutput}
          setError={setError}
        />
        <DownloadButton output={output} />
        <UndoButton input={input} setInput={setInput} />
        <MagicFixButton
          input={input}
          setInput={setInput}
          setOutput={setOutput}
          setError={setError}
        />
        <JsonToolbar
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleReset}
          onFilterEmpty={handleFilterEmpty}
          onFilterNulls={handleFilterNulls}
          onExpandAll={handleExpandAll}
          onCollapseAll={handleCollapseAll}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Input Editor */}
        <div className="space-y-4">
          <div className="relative" style={{ height: editorHeight }}>
            <AceEditor
              mode="json"
              theme="tomorrow"
              value={input}
              onChange={setInput}
              name="json-input"
              editorProps={{ $blockScrolling: true }}
              setOptions={editorOptions}
              width="100%"
              height="100%"
              style={editorStyle}
              className="shadow-sm"
              placeholder="Paste your JSON here..."
            />
          </div>
          <div className="flex justify-between items-center">
            <Button onClick={formatJson}>{minify ? "Minify JSON" : "Format JSON"}</Button>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        </div>

        {/* Output Editor */}
        <div className="space-y-4">
          <div className="relative" style={{ height: editorHeight }}>
            <AceEditor
              mode="json"
              theme="tomorrow"
              value={output}
              readOnly={true}
              name="json-output"
              editorProps={{ $blockScrolling: true }}
              setOptions={editorOptions}
              width="100%"
              height="100%"
              style={editorStyle}
              className="shadow-sm"
            />
            {output && (
              <Button 
                size="sm" 
                variant="ghost" 
                className="absolute top-2 right-2 bg-white/80 hover:bg-white" 
                onClick={copyToClipboard}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                <span className="sr-only">Copy to clipboard</span>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}