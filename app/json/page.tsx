"use client"

import Link from "next/link"
import { Code, FileJson, GitCompare } from "lucide-react"

const jsonTools = [
  {
    title: "JSON Formatter",
    description: "Format and beautify your JSON data with syntax highlighting and validation",
    icon: <Code className="w-6 h-6" />,
    href: "/json/formatter",
    features: [
      "Syntax highlighting",
      "Error detection",
      "AI-powered formatting",
      "Copy & download options",
    ],
  },
  {
    title: "JSON Delimiter",
    description: "Delimit JSON data with custom delimiters",
    icon: <FileJson className="w-6 h-6" />,
    href: "/json/delimiter",
    features: [
      "Custom delimiters",
      "Copy & download options"
    ],
  },
  {
    title: "JSON Diff",
    description: "Compare two JSON files and highlight the differences",
    icon: <GitCompare className="w-6 h-6" />,
    href: "/json/diff",
    features: [
      "Side-by-side comparison",
      "Difference highlighting",
      "Structural analysis",
      "Export differences",
    ],
  },
]

export default function JsonToolsPage() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">JSON Tools</h1>
        <p className="text-xl text-muted-foreground">
          A comprehensive suite of tools for working with JSON data
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {jsonTools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="rounded-lg border bg-card text-card-foreground shadow hover:shadow-md transition-all hover:scale-[1.02]"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {tool.icon}
                <h2 className="text-2xl font-semibold">{tool.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {tool.description}
              </p>
              <ul className="space-y-2">
                {tool.features.map((feature) => (
                  <li key={feature} className="text-sm flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
