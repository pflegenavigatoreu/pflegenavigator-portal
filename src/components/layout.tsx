import { ReactNode } from "react"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground py-4">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl">🧭</span>
            <span className="font-bold text-lg">PflegeNavigator</span>
          </Link>
          <nav className="hidden md:flex gap-4">
            <Link href="/pflegegrad/start" className="hover:underline">Pflegegrad</Link>
            <Link href="/widerspruch/start" className="hover:underline">Widerspruch</Link>
            <Link href="/tagebuch/uebersicht" className="hover:underline">Tagebuch</Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-muted py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 justify-center text-sm text-muted-foreground">
            <Link href="/impressum" className="hover:underline">Impressum</Link>
            <Link href="/datenschutz" className="hover:underline">Datenschutz</Link>
            <Link href="/agb" className="hover:underline">AGB</Link>
            <Link href="/barrierefreiheit" className="hover:underline">Barrierefreiheit</Link>
          </div>
          <p className="text-center text-xs text-muted-foreground mt-4">
            © 2026 PflegeNavigator EU gUG – Alle Rechte vorbehalten
          </p>
        </div>
      </footer>

      <Toaster />
    </div>
  )
}
