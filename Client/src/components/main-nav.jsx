"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { CalendarDays, Home, MessageSquare, Settings, Users } from "lucide-react"

const items = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Members",
    href: "/members",
    icon: Users,
  },
  {
    title: "Events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    title: "Announcements",
    href: "/announcements",
    icon: MessageSquare,
  },
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

export function MainNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-2 px-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent transition-colors",
            pathname === item.href ? "bg-accent" : "transparent",
          )}
        >
          <item.icon className="h-5 w-5" />
          {item.title}
        </Link>
      ))}
    </nav>
  )
}
