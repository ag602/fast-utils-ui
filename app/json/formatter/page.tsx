"use client"

import { JsonEditor } from "@/components/json-editor"

export default function JsonFormatterPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">JSON Formatter</h1>
        <p className="text-muted-foreground">
          Format, validate, and beautify your JSON with our powerful JSON editor.
        </p>
      </div>
      <JsonEditor />
    </div>
  )
}
