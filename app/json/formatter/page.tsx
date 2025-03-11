"use client"

import { useState } from "react"
import { JsonEditor } from "@/components/json-editor"

export default function JsonFormatterPage() {
  const [jsonValue, setJsonValue] = useState("")

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and beautify your JSON with our powerful JSON editor.
        </p>
      </div>
      <JsonEditor 
        value={jsonValue}
        onChange={setJsonValue}
      />
    </div>
  )
}
