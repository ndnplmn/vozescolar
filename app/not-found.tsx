import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Home, Search } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="border-b border-crimson-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <Link href="/" className="flex items-center gap-3.5">
            <Image src="/cetis52-logo.svg" alt="CETIS 52" width={36} height={36} />
            <div>
              <p className="text-[10px] font-bold tracking-[0.18em] text-crimson-600 uppercase leading-none mb-0.5">CETIS 52</p>
              <p className="text-xs font-medium text-gray-700 leading-none">Hermenegildo Galeana</p>
            </div>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <span className="block w-8 h-0.5 bg-crimson-600 mx-auto mb-6" />
          <p className="font-mono text-5xl font-bold text-crimson-600 mb-4">404</p>
          <h1 className="font-serif text-xl font-bold text-gray-900 mb-2">Página no encontrada</h1>
          <p className="text-sm text-gray-500 mb-8">
            La dirección que buscas no existe o fue removida.
          </p>
          <div className="flex gap-3 justify-center">
            <Link href="/">
              <Button className="bg-crimson-600 hover:bg-crimson-700 rounded-none text-sm gap-2">
                <Home className="w-4 h-4" /> Ir al inicio
              </Button>
            </Link>
            <Link href="/seguimiento">
              <Button variant="outline" className="rounded-none border-crimson-200 text-crimson-600 hover:bg-crimson-50 text-sm gap-2">
                <Search className="w-4 h-4" /> Buscar folio
              </Button>
            </Link>
          </div>
        </div>
      </main>

      <footer className="border-t border-crimson-100 py-4">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>© {new Date().getFullYear()} CETIS 52 Hermenegildo Galeana</span>
          <span className="text-crimson-600 font-medium">VozEscolar</span>
        </div>
      </footer>
    </div>
  );
}
