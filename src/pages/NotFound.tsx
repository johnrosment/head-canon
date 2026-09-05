import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-lg border-4 border-ink bg-paper p-8 offset-shadow">
        <div className="flex items-end gap-3">
          <span
            className="mb-2 block h-10 w-3 bg-turf"
            aria-hidden="true"
          />
          <h1 className="text-5xl font-black tracking-tighter uppercase">404</h1>
        </div>
        <p className="micro-label mt-4 text-graphite">Broken route</p>
        <p className="mt-2 text-base leading-relaxed font-medium">
          That page does not exist. The generator is one click away.
        </p>
        <Link
          to="/"
          className="mt-6 inline-flex items-center gap-2 border-2 border-ink bg-turf px-5 py-3 text-sm font-black tracking-widest text-paper uppercase offset-shadow-sm"
        >
          <ArrowLeft
            size={16}
            strokeWidth={2.5}
          />
          Back to the generator
        </Link>
      </div>
    </main>
  );
}
