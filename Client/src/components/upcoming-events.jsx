import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, Clock } from "lucide-react"

const events = [
  {
    id: 1,
    title: "Weekly Tennis Practice",
    date: "Apr 22, 2025",
    time: "6:00 PM - 8:00 PM",
    location: "Main Tennis Court",
    status: "Confirmed",
  },
  {
    id: 2,
    title: "Club Tournament",
    date: "Apr 25, 2025",
    time: "9:00 AM - 5:00 PM",
    location: "City Sports Complex",
    status: "Registration Open",
  },
  {
    id: 3,
    title: "Annual Club Meeting",
    date: "Apr 30, 2025",
    time: "7:00 PM - 9:00 PM",
    location: "Community Center",
    status: "Planning",
  },
]

export function UpcomingEvents() {
  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Upcoming Events</CardTitle>
        <CardDescription>Next events scheduled for your club</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col space-y-2 border-b pb-4 last:border-0">
              <div className="flex justify-between items-start">
                <h3 className="font-medium">{event.title}</h3>
                <Badge variant={event.status === "Confirmed" ? "default" : "outline"}>{event.status}</Badge>
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <CalendarDays className="mr-1 h-4 w-4" />
                {event.date}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <Clock className="mr-1 h-4 w-4" />
                {event.time}
              </div>
              <div className="flex items-center text-sm text-muted-foreground">
                <MapPin className="mr-1 h-4 w-4" />
                {event.location}
              </div>
              <div className="flex space-x-2 pt-1">
                <Button size="sm" variant="outline">
                  Details
                </Button>
                <Button size="sm">RSVP</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
