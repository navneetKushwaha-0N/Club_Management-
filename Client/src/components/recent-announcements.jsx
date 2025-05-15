import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"

const announcements = [
  {
    id: 1,
    title: "New Club Equipment Arrived",
    content: "We've received new tennis rackets and balls for club members to use during practice sessions.",
    date: "Apr 18, 2025",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "SJ",
    },
  },
  {
    id: 2,
    title: "Court Maintenance Schedule",
    content: "The main court will be closed for maintenance on April 23rd. Please plan accordingly.",
    date: "Apr 16, 2025",
    author: {
      name: "Mike Peterson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "MP",
    },
  },
  {
    id: 3,
    title: "Membership Renewal Reminder",
    content: "Don't forget to renew your club membership before the end of the month to avoid late fees.",
    date: "Apr 15, 2025",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "EW",
    },
  },
]

export function RecentAnnouncements() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Announcements</CardTitle>
        <CardDescription>Latest news and updates from your club</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <div key={announcement.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">{announcement.title}</h3>
                <span className="text-xs text-muted-foreground">{announcement.date}</span>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2">{announcement.content}</p>
              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage
                      src={announcement.author.avatar || "/placeholder.svg"}
                      alt={announcement.author.name}
                    />
                    <AvatarFallback>{announcement.author.initials}</AvatarFallback>
                  </Avatar>
                  <span className="text-xs">{announcement.author.name}</span>
                </div>
                <Button size="sm" variant="ghost">
                  Read more
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
