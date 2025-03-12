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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  ArrowRightLeft,
  FileJson,
  FileSpreadsheet,
  FileCode,
  FileText,
} from "lucide-react"

// Helper function to flatten JSON object
const flattenObject = (obj: any, prefix = ''): any => {
  return Object.keys(obj).reduce((acc: any, k: string) => {
    const pre = prefix.length ? prefix + '.' : '';
    if (typeof obj[k] === 'object' && obj[k] !== null && !Array.isArray(obj[k])) {
      Object.assign(acc, flattenObject(obj[k], pre + k));
    } else {
      acc[pre + k] = obj[k];
    }
    return acc;
  }, {});
}

// Helper function to convert JSON to CSV
const jsonToCSV = (jsonData: any): string => {
  try {
    // Handle single object vs array of objects
    const array = Array.isArray(jsonData) ? jsonData : [jsonData]
    if (array.length === 0) return ""

    // Flatten nested objects
    const flattenedArray = array.map(item => flattenObject(item))

    // Get all unique keys from all objects
    const headers = Array.from(new Set(
      flattenedArray.flatMap(obj => Object.keys(obj))
    ))

    // Create CSV rows
    const rows = [
      headers.join(','), // Header row
      ...flattenedArray.map(obj =>
        headers.map(header => {
          const value = obj[header]
          // Handle different value types
          if (value === null || value === undefined) {
            return ''
          }
          if (Array.isArray(value)) {
            return `"${value.join('; ')}"`
          }
          if (typeof value === 'object') {
            return `"${JSON.stringify(value)}"`
          }
          if (typeof value === 'string') {
            // Escape quotes and wrap in quotes
            return `"${value.replace(/"/g, '""')}"`
          }
          return value
        }).join(',')
      )
    ]

    return rows.join('\n')
  } catch (err) {
    throw new Error("Failed to convert JSON to CSV")
  }
}

// Helper function to convert CSV to JSON
const csvToJSON = (csvData: string): any => {
  try {
    const lines = csvData.split('\n').filter(line => line.trim())
    if (lines.length === 0) return []

    const headers = lines[0].split(',').map(h => h.trim())
    const result = lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim())
      const obj: any = {}
      headers.forEach((header, i) => {
        let value = values[i] || ''
        // Remove surrounding quotes and unescape double quotes
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1).replace(/""/g, '"')
        }
        // Try to parse numbers and booleans
        if (value === 'true') obj[header] = true
        else if (value === 'false') obj[header] = false
        else if (!isNaN(value as any)) obj[header] = Number(value)
        else obj[header] = value
      })
      return obj
    })

    return result
  } catch (err) {
    throw new Error("Failed to convert CSV to JSON")
  }
}

// Helper function to convert JSON to XML
const jsonToXML = (json: any, indent = ''): string => {
  try {
    const convert = (obj: any, name: string): string => {
      if (obj === null || obj === undefined) return `${indent}<${name}/>`
      
      if (Array.isArray(obj)) {
        return obj.map(item => convert(item, name)).join('\n')
      }
      
      if (typeof obj === 'object') {
        const children = Object.entries(obj)
          .map(([key, value]) => convert(value, key))
          .join('\n')
        return `${indent}<${name}>\n${children}\n${indent}</${name}>`
      }
      
      return `${indent}<${name}>${String(obj)}</${name}>`
    }

    return '<?xml version="1.0" encoding="UTF-8"?>\n' + 
           convert(json, 'root')
  } catch (err) {
    throw new Error("Failed to convert JSON to XML")
  }
}

// Helper function to convert XML to JSON
const xmlToJSON = (xml: string): any => {
  try {
    // Basic XML parser (for demonstration - in production use a proper XML parser)
    const parseXML = (text: string) => {
      const tag = /<\/?([^\s>]+)([^>]*)>/g
      const stack: any[] = [{}]
      let current = stack[0]
      let match

      while ((match = tag.exec(text)) !== null) {
        const [full, name, attrs] = match
        if (full.startsWith('<?')) continue // Skip processing instructions
        
        if (!full.startsWith('</')) {
          const newObj: any = {}
          if (!current[name]) current[name] = newObj
          else if (Array.isArray(current[name])) current[name].push(newObj)
          else current[name] = [current[name], newObj]
          
          stack.push(newObj)
          current = newObj
        } else {
          const content = text.slice(tag.lastIndex, match.index).trim()
          if (content) {
            // Try to parse as number or boolean
            if (content === 'true') current.value = true
            else if (content === 'false') current.value = false
            else if (!isNaN(content as any)) current.value = Number(content)
            else current.value = content
          }
          stack.pop()
          current = stack[stack.length - 1]
        }
      }

      return stack[0]
    }

    return parseXML(xml)
  } catch (err) {
    throw new Error("Failed to convert XML to JSON")
  }
}

// Helper function to convert JSON to YAML
const jsonToYAML = (json: any, indent = ''): string => {
  try {
    const convert = (obj: any, level = 0): string => {
      const spaces = '  '.repeat(level)
      
      if (obj === null || obj === undefined) return 'null'
      
      if (Array.isArray(obj)) {
        return obj.map(item => spaces + '- ' + convert(item, level + 1)).join('\n')
      }
      
      if (typeof obj === 'object') {
        return Object.entries(obj)
          .map(([key, value]) => {
            const valueStr = typeof value === 'object'
              ? '\n' + convert(value, level + 1)
              : ' ' + convert(value, level + 1)
            return spaces + key + ':' + valueStr
          })
          .join('\n')
      }
      
      if (typeof obj === 'string') {
        if (obj.includes('\n')) return '|\n' + obj.split('\n').map(line => spaces + '  ' + line).join('\n')
        if (obj.match(/[:#\[\]{}]/)) return `"${obj.replace(/"/g, '\\"')}"`
        return obj
      }
      
      return String(obj)
    }

    return convert(json)
  } catch (err) {
    throw new Error("Failed to convert JSON to YAML")
  }
}

// Helper function to convert YAML to JSON
const yamlToJSON = (yaml: string): any => {
  try {
    const parse = (lines: string[]): any => {
      const result: any = {}
      let currentArray: any[] | null = null
      let currentIndent = 0
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i]
        if (!line.trim()) continue
        
        const indent = line.search(/\S/)
        const content = line.trim()
        
        if (content.startsWith('- ')) {
          if (!currentArray) currentArray = []
          const value = content.slice(2)
          currentArray.push(parseValue(value))
          continue
        }
        
        const [key, ...valueParts] = content.split(':')
        if (!key) continue
        
        let value = valueParts.join(':').trim()
        if (value.startsWith('|')) {
          // Handle multi-line strings
          value = ''
          i++
          while (i < lines.length && lines[i].startsWith(' '.repeat(indent + 2))) {
            value += (value ? '\n' : '') + lines[i].slice(indent + 2)
            i++
          }
          i--
        }
        
        result[key] = parseValue(value)
      }
      
      return currentArray || result
    }
    
    const parseValue = (value: string): any => {
      if (!value) return null
      if (value === 'null') return null
      if (value === 'true') return true
      if (value === 'false') return false
      if (!isNaN(value as any)) return Number(value)
      if (value.startsWith('"') && value.endsWith('"')) 
        return value.slice(1, -1).replace(/\\"/g, '"')
      return value
    }

    return parse(yaml.split('\n'))
  } catch (err) {
    throw new Error("Failed to convert YAML to JSON")
  }
}

type ConversionType = 'json-csv' | 'csv-json' | 'json-xml' | 'xml-json' | 'json-yaml' | 'yaml-json'

export default function JsonConverterPage() {
  const [input, setInput] = useState("")
  const [output, setOutput] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [conversionType, setConversionType] = useState<ConversionType>('json-csv')

  // Process conversion based on type
  const processConversion = (value: string, type: ConversionType) => {
    if (!value.trim()) {
      setOutput("")
      setError(null)
      return
    }

    try {
      let result = ""
      switch (type) {
        case 'json-csv':
          const jsonData = JSON.parse(value)
          result = jsonToCSV(jsonData)
          break
        case 'csv-json':
          const jsonResult = csvToJSON(value)
          result = JSON.stringify(jsonResult, null, 2)
          break
        case 'json-xml':
          const xmlData = JSON.parse(value)
          result = jsonToXML(xmlData)
          break
        case 'xml-json':
          const parsedXml = xmlToJSON(value)
          result = JSON.stringify(parsedXml, null, 2)
          break
        case 'json-yaml':
          const yamlData = JSON.parse(value)
          result = jsonToYAML(yamlData)
          break
        case 'yaml-json':
          const parsedYaml = yamlToJSON(value)
          result = JSON.stringify(parsedYaml, null, 2)
          break
      }
      setOutput(result)
      setError(null)
    } catch (err) {
      console.error('Failed to convert:', err)
      setError(`Failed to convert ${conversionType.split('-')[0].toUpperCase()} to ${conversionType.split('-')[1].toUpperCase()}. Please check your input.`)
      setOutput("")
    }
  }

  // Update output whenever input or conversion type changes
  useEffect(() => {
    processConversion(input, conversionType)
  }, [input, conversionType])

  // Handle conversion type change
  const handleConversionChange = (value: ConversionType) => {
    setConversionType(value)
    // Swap input and output when changing between inverse conversions
    const currentFrom = conversionType.split('-')[0]
    const currentTo = conversionType.split('-')[1]
    const newFrom = value.split('-')[0]
    const newTo = value.split('-')[1]
    
    if (currentFrom === newTo && currentTo === newFrom) {
      setInput(output)
    }
  }

  // Get file extension based on format
  const getFileExtension = (format: string) => {
    switch (format) {
      case 'json': return '.json'
      case 'csv': return '.csv'
      case 'xml': return '.xml'
      case 'yaml': return '.yml'
      default: return '.txt'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold">JSON Converter</h1>
          <p className="text-muted-foreground">
            Convert between JSON and other popular data formats.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Select
          value={conversionType}
          onValueChange={(value) => handleConversionChange(value as ConversionType)}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select conversion" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="json-csv">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span>JSON to CSV</span>
              </div>
            </SelectItem>
            <SelectItem value="csv-json">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-4 h-4" />
                <span>CSV to JSON</span>
              </div>
            </SelectItem>
            <SelectItem value="json-xml">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span>JSON to XML</span>
              </div>
            </SelectItem>
            <SelectItem value="xml-json">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4" />
                <span>XML to JSON</span>
              </div>
            </SelectItem>
            <SelectItem value="json-yaml">
              <div className="flex items-center gap-2">
                <FileJson className="w-4 h-4" />
                <span>JSON to YAML</span>
              </div>
            </SelectItem>
            <SelectItem value="yaml-json">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                <span>YAML to JSON</span>
              </div>
            </SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          size="icon"
          onClick={() => handleConversionChange(
            conversionType.split('-').reverse().join('-') as ConversionType
          )}
        >
          <ArrowRightLeft className="h-4 w-4" />
        </Button>
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
                  <Label>
                    {conversionType.split('-')[0].toUpperCase()} Input
                  </Label>
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
                      filename={`input${getFileExtension(conversionType.split('-')[0])}`}
                    />
                  </div>
                </div>
              </div>
              <JsonEditor
                value={input}
                onChange={setInput}
                showLineNumbers={true}
              />
            </div>
            <div className="p-4">
              <div className="mb-2">
                <div className="flex items-center justify-between">
                  <Label>
                    {conversionType.split('-')[1].toUpperCase()} Output
                  </Label>
                  <DownloadButton 
                    content={output} 
                    filename={`output${getFileExtension(conversionType.split('-')[1])}`}
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
