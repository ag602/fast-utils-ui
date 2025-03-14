"use client"

import React, { useEffect, useState } from "react"
import dynamic from 'next/dynamic'
import { configureAceEditor } from "@/config/ace-editor-worker"
import type { Ace } from 'ace-builds'

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
  value: string
  onChange?: (value: string) => void
  showLineNumbers?: boolean
  readOnly?: boolean
  className?: string
  highlights?: {
    line: number
    type: 'added' | 'deleted' | 'changed'
  }[]
  minify?: boolean
}

export function JsonEditor({ 
  value, 
  onChange,
  showLineNumbers = true,
  readOnly = false,
  className = "",
  highlights = [],
  minify = false
}: JsonEditorProps) {
  const [editor, setEditor] = useState<Ace.Editor | null>(null)
  const [markers, setMarkers] = useState<number[]>([])

  // Format the value if it's valid JSON
  const formatJson = (val: string) => {
    try {
      const parsed = JSON.parse(val)
      return JSON.stringify(parsed, null, minify ? 0 : 2)
    } catch {
      return val
    }
  }

  // Handle value changes
  const handleChange = (newValue: string) => {
    if (onChange) {
      onChange(newValue)
    }
  }

  // Format on mount and when minify changes
  useEffect(() => {
    if (value && onChange) {
      const formatted = formatJson(value)
      if (formatted !== value) {
        onChange(formatted)
      }
    }
  }, [value, minify])

  // Apply highlights
  useEffect(() => {
    if (!editor) return;

    const session = editor.getSession();

    // Clear existing markers
    markers.forEach(id => session.removeMarker(id))
    setMarkers([]);

    // Add new markers
    const Range = require('ace-builds').Range
    const newMarkers = highlights.map(highlight => { // highlights is still used inside, but no longer a dependency
        const lineText = session.getLine(highlight.line);
        if (lineText !== undefined) {
            const range = new Range(highlight.line, 0, highlight.line, lineText.length);
            return session.addMarker(range, `diff-${highlight.type}`, "fullLine");
        }
        return -1;
    }).filter(id => id !== -1);

    setMarkers(newMarkers);
}, [editor]);

  const getHighlightStyle = (type: 'added' | 'deleted' | 'changed') => {
    switch (type) {
      case 'added':
        return 'background-color: rgba(22, 163, 74, 0.3); border-radius: 3px;' // Vibrant green
      case 'deleted':
        return 'background-color: rgba(220, 38, 38, 0.3); border-radius: 3px;' // Vibrant red  
      case 'changed':
        return 'background-color: rgba(37, 99, 235, 0.3); border-radius: 3px;' // Vibrant blue
      default:
        return ''
    }
  }

  const editorOptions = {
    enableBasicAutocompletion: true,
    enableLiveAutocompletion: true,
    showGutter: showLineNumbers,
    showLineNumbers: showLineNumbers,
    tabSize: 2,
    useSoftTabs: true,
    showPrintMargin: false,
    readOnly,
    useWorker: false,
    fontSize: 14
  }

  return (
    <div className={`relative border rounded-md ${className}`} style={{ minHeight: "300px" }}>
      <style jsx global>{`
        .diff-added {
          ${getHighlightStyle('added')}
          position: absolute;
          width: 100% !important;
          pointer-events: none;
        }
        .diff-deleted {
          ${getHighlightStyle('deleted')}
          position: absolute;
          width: 100% !important;
          pointer-events: none;
        }
        .diff-changed {
          ${getHighlightStyle('changed')}
          position: absolute;
          width: 100% !important;
          pointer-events: none;
        }
        .ace_gutter {
          background-color: #f5f5f5 !important;
          color: #666 !important;
        }
        .ace_gutter-cell {
          padding-left: 0.5rem !important;
          padding-right: 0.5rem !important;
        }
      `}</style>
      <AceEditor
        mode="json"
        theme="tomorrow"
        value={value}
        onChange={handleChange}
        onLoad={setEditor}
        name={`json-editor-${Math.random()}`}
        width="100%"
        height="300px"
        editorProps={{ $blockScrolling: true }}
        setOptions={editorOptions}
        className="w-full h-full"
      />
    </div>
  )
}