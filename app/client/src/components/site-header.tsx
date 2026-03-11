import { SidebarTrigger } from "@/components/ui/sidebar"

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 flex h-[--header-height] shrink-0 items-center border-b bg-white dark:bg-zinc-950 px-4 lg:px-6">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold tracking-tight text-foreground">FIT KAKA</h1>
      </div>
    </header>
  )
}
