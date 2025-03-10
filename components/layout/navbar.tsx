"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  Code,
  Video,
  Music,
  Wrench,
  ChevronDown
} from "lucide-react"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"

const tools = {
  "All Tools": {
    icon: <Wrench className="w-4 h-4" />,
    items: [
      { name: "JSON Tools", href: "/json" },
      { name: "Video Tools", href: "/video" },
      { name: "Audio Tools", href: "/audio" },
      // Add more tools as needed
    ]
  },
  "JSON Tools": {
    icon: <Code className="w-4 h-4" />,
    items: [
      { name: "JSON Formatter", href: "/json/formatter" },
      { name: "JSON Validator", href: "/json/validator" },
      { name: "JSON Diff", href: "/json/diff" },
    ]
  },
  "Video Tools": {
    icon: <Video className="w-4 h-4" />,
    items: [
      { name: "Video Converter", href: "/video/converter" },
      { name: "Video Compressor", href: "/video/compressor" },
      { name: "Video Trimmer", href: "/video/trimmer" },
    ]
  },
  "Audio Tools": {
    icon: <Music className="w-4 h-4" />,
    items: [
      { name: "Audio Converter", href: "/audio/converter" },
      { name: "Audio Compressor", href: "/audio/compressor" },
      { name: "Audio Trimmer", href: "/audio/trimmer" },
    ]
  }
}

export function Navbar() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <Wrench className="h-6 w-6" />
          <span className="hidden font-bold sm:inline-block">
            FastUtils
          </span>
        </Link>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuViewport />
            {Object.entries(tools).map(([category, { icon, items }], index) => (
              <NavigationMenuItem key={category}>
                <NavigationMenuTrigger>
                  <div className="flex items-center gap-2">
                    {icon}
                    <span>{category}</span>
                  </div>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 w-[200px]">
                    {items.map((item) => (
                      <li key={item.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={item.href}
                            className={cn(
                              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors",
                              "hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                              pathname === item.href && "bg-accent"
                            )}
                          >
                            <div className="text-sm font-medium leading-none">{item.name}</div>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ))}
          </NavigationMenuList>
          <NavigationMenuViewport />
        </NavigationMenu>
      </div>
    </header>
  )
}
