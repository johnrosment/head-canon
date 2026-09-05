import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

export default function Auth() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-canvas px-4 py-10">
      <div className="w-full max-w-lg border-4 border-ink bg-paper p-8 offset-shadow">
        <p className="micro-label text-graphite">Route placeholder</p>
        <h1 className="mt-2 text-3xl font-black tracking-tighter uppercase">
          No account needed
        </h1>
        <p className="mt-4 text-base leading-relaxed font-medium">
          Head Canon is a single-page utility. The generator runs entirely in the
          browser and never asks who you are.
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
