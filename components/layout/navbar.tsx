"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { 
  Code, 
  FileVideo, 
  Image, 
  FileAudio, 
  FileText, 
  FileIcon,
  ChevronDown,
  Zap
} from "lucide-react"

const tools = [
  {
    name: "Code",
    icon: <Code className="w-4 h-4" />,
    items: [
      { name: "JSON Formatter", href: "/json/formatter" },
      { name: "JSON Delimiter", href: "/json/delimiter" },
      { name: "JSON Stringify", href: "/json/stringify" },
      { name: "JSON Diff", href: "/json/diff" },
    ]
  },
  {
    name: "Video",
    icon: <FileVideo className="w-4 h-4" />,
    items: [
      { name: "Video Editor", href: "/video/editor" },
      { name: "Video Converter", href: "/video/converter" },
    ]
  },
  {
    name: "Image",
    icon: <Image className="w-4 h-4" />,
    items: [
      { name: "Image Editor", href: "/image/editor" },
      { name: "Image Converter", href: "/image/converter" },
    ]
  },
  {
    name: "Audio",
    icon: <FileAudio className="w-4 h-4" />,
    items: [
      { name: "Audio Editor", href: "/audio/editor" },
      { name: "Audio Converter", href: "/audio/converter" },
    ]
  },
  {
    name: "Document",
    icon: <FileText className="w-4 h-4" />,
    items: [
      { name: "Document Editor", href: "/document/editor" },
      { name: "Document Converter", href: "/document/converter" },
    ]
  },
  {
    name: "File",
    icon: <FileIcon className="w-4 h-4" />,
    items: [
      { name: "File Converter", href: "/file/converter" },
      { name: "File Compressor", href: "/file/compressor" },
    ]
  }
]

export function Navbar() {
  const pathname = usePathname()

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link 
          href="/" 
          className="mr-8 flex items-center space-x-2 transition-colors hover:text-foreground/80"
        >
          <Zap className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold">FastUtils</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {tools.map((tool) => (
            <DropdownMenu key={tool.name}>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="h-8 w-full justify-start font-normal"
                >
                  <div className="flex items-center">
                    {tool.icon}
                    <span className="ml-2">{tool.name}</span>
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48">
                {tool.items.map((item) => (
                  <DropdownMenuItem key={item.name} asChild>
                    <Link 
                      href={item.href}
                      className={pathname === item.href ? "bg-accent" : ""}
                    >
                      {item.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          ))}
        </nav>
      </div>
    </div>
  )
}
