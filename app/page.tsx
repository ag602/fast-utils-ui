"use client"

import Link from "next/link"
import { Code, Video, Music, FileText, Image, FileJson } from "lucide-react"

const tools = [
  {
    title: "JSON Tools",
    description: "Format, validate, and compare JSON data with ease",
    icon: <Code className="w-6 h-6" />,
    items: [
      { name: "JSON Formatter", href: "/json/formatter" },
      { name: "JSON Delimiter", href: "/json/validator" },
      { name: "JSON Diff", href: "/json/diff" },
    ],
  },
  {
    title: "Video Tools",
    description: "Convert, compress, and edit video files",
    icon: <Video className="w-6 h-6" />,
    items: [
      { name: "Video Converter", href: "/video/converter" },
      { name: "Video Compressor", href: "/video/compressor" },
      { name: "Video Trimmer", href: "/video/trimmer" },
    ],
  },
  {
    title: "Audio Tools",
    description: "Process and manipulate audio files",
    icon: <Music className="w-6 h-6" />,
    items: [
      { name: "Audio Converter", href: "/audio/converter" },
      { name: "Audio Compressor", href: "/audio/compressor" },
      { name: "Audio Trimmer", href: "/audio/trimmer" },
    ],
  },
  {
    title: "Document Tools",
    description: "Edit and convert document files",
    icon: <FileText className="w-6 h-6" />,
    items: [
      { name: "Document Editor", href: "/document/editor" },
      { name: "PDF Converter", href: "/document/pdf" },
      { name: "OCR Tool", href: "/document/ocr" },
    ],
  },
  {
    title: "Image Tools",
    description: "Edit and optimize images",
    icon: <Image className="w-6 h-6" />,
    items: [
      { name: "Image Editor", href: "/image/editor" },
      { name: "Image Converter", href: "/image/converter" },
      { name: "Image Compressor", href: "/image/compressor" },
    ],
  },
  {
    title: "File Tools",
    description: "Convert files between different formats",
    icon: <FileJson className="w-6 h-6" />,
    items: [
      { name: "File Converter", href: "/file/converter" },
      { name: "File Compressor", href: "/file/compressor" },
      { name: "File Merger", href: "/file/merger" },
    ],
  },
]

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-4xl font-bold">FastUtils</h1>
        <p className="text-xl text-muted-foreground">
          Your all-in-one utility hub for file processing and data manipulation
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((section) => (
          <div
            key={section.title}
            className="rounded-lg border bg-card text-card-foreground shadow hover:shadow-md transition-shadow"
          >
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3">
                {section.icon}
                <h2 className="text-2xl font-semibold">{section.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
              <ul className="space-y-2">
                {section.items.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-sm hover:underline text-primary"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
