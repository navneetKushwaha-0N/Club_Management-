import { MainNav } from "@/components/main-nav"
import { UserNav } from "@/components/user-nav"
import { ClubSwitcher } from "@/components/club-switcher"
import { ModeToggle } from "@/components/mode-toggle"

export function AppShell({ children }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 flex h-16 items-center gap-4 border-b bg-background px-6">
        <ClubSwitcher />
        <div className="flex flex-1 items-center justify-between space-x-4">
          <div className="flex-1 md:flex md:justify-end md:space-x-4">
            <div className="ml-auto flex items-center space-x-4">
              <ModeToggle />
              <UserNav />
            </div>
          </div>
        </div>
      </header>
      <div className="grid flex-1 md:grid-cols-[220px_1fr]">
        <aside className="hidden border-r bg-background md:block">
          <div className="flex h-full max-h-screen flex-col gap-2 py-4">
            <MainNav />
            <div className="mt-auto p-4">
              <h3 className="mb-2 text-xs font-medium">Club Info</h3>
              <div className="text-xs text-muted-foreground">
                <p>Tennis Club</p>
                <p>Members: 42</p>
                <p>Founded: 2020</p>
              </div>
            </div>
          </div>
        </aside>
        <main className="flex flex-col p-6">{children}</main>
      </div>
    </div>
  )
}
