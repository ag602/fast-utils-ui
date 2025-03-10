"use client"

import { useState } from "react"
import { AudioLines, Code2, FileVideo, Search, Settings, Zap } from "lucide-react"
import { AnimatedLogo } from "@/components/animated-logo"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UtilityCard } from "@/components/utility-card"
import { JsonEditor } from "@/components/json-editor"
import { VideoProcessor } from "@/components/video-processor"
import { AudioEditor } from "@/components/audio-editor"

const categories = [
  { id: "all", label: "All Tools" },
  { id: "json", label: "JSON Tools" },
  { id: "video", label: "Video Tools" },
  { id: "audio", label: "Audio Tools" },
]

const utilities = [
  {
    id: "json-formatter",
    title: "JSON Formatter & Validator",
    description: "Format and validate your JSON data with syntax highlighting",
    icon: <Code2 className="h-5 w-5" />,
    category: "json",
    component: <JsonEditor />,
  },
  {
    id: "json-minifier",
    title: "JSON Minifier",
    description: "Minify your JSON data to reduce file size",
    icon: <Zap className="h-5 w-5" />,
    category: "json",
    component: <JsonEditor minify />,
  },
  {
    id: "video-compressor",
    title: "Video Compressor",
    description: "Compress your videos without losing quality",
    icon: <FileVideo className="h-5 w-5" />,
    category: "video",
    component: <VideoProcessor mode="compress" />,
  },
  {
    id: "video-converter",
    title: "Video Converter",
    description: "Convert videos between different formats",
    icon: <FileVideo className="h-5 w-5" />,
    category: "video",
    component: <VideoProcessor mode="convert" />,
  },
  {
    id: "audio-trimmer",
    title: "Audio Trimmer",
    description: "Trim your audio files with precision",
    icon: <AudioLines className="h-5 w-5" />,
    category: "audio",
    component: <AudioEditor mode="trim" />,
  },
  {
    id: "audio-converter",
    title: "Audio Converter",
    description: "Convert audio between different formats",
    icon: <AudioLines className="h-5 w-5" />,
    category: "audio",
    component: <AudioEditor mode="convert" />,
  },
]

export function Utilities() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeUtility, setActiveUtility] = useState<string | null>(null)

  const filteredUtilities = utilities.filter((utility) => {
    const matchesCategory = activeCategory === "all" || utility.category === activeCategory
    const matchesSearch =
      utility.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      utility.description.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const activeUtilityData = utilities.find((utility) => utility.id === activeUtility)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <AnimatedLogo />
            <h1 className="text-xl font-semibold">Fast Utils</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search utilities..."
                className="w-full pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Button>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className="container py-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory} className="mb-6">
            <TabsList>
              {categories.map((category) => (
                <TabsTrigger key={category.id} value={category.id}>
                  {category.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          {activeUtility ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {activeUtilityData?.icon}
                  <h2 className="text-xl font-semibold">{activeUtilityData?.title}</h2>
                </div>
                <Button variant="ghost" onClick={() => setActiveUtility(null)}>
                  Back to all utilities
                </Button>
              </div>
              <div className="rounded-lg border p-6">{activeUtilityData?.component}</div>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {filteredUtilities.map((utility) => (
                <UtilityCard
                  key={utility.id}
                  title={utility.title}
                  description={utility.description}
                  icon={utility.icon}
                  onClick={() => setActiveUtility(utility.id)}
                />
              ))}
              {filteredUtilities.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-lg font-medium">No utilities found</p>
                  <p className="text-muted-foreground">Try adjusting your search or category filter</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
