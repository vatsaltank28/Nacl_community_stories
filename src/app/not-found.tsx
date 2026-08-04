import Link from "next/link";
import { ArrowLeft, Compass } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-6 bg-primary text-secondary text-center">
      <div className="w-full max-w-md bg-secondary/5 border border-secondary/15 rounded-3xl p-8 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="w-16 h-16 bg-accent/15 border border-accent/30 text-accent rounded-2xl flex items-center justify-center mx-auto text-2xl font-bold">
          <Compass className="animate-spin-slow" size={28} />
        </div>

        <div className="space-y-2">
          <span className="text-accent text-xs font-bold uppercase tracking-widest">404 Error</span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white uppercase">Experience Not Found</h1>
          <p className="text-xs text-additional/80 leading-relaxed">
            The page or gathering you are looking for doesn't exist or has moved.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-accent text-primary hover:bg-white font-bold rounded-full text-xs uppercase tracking-wider transition-colors shadow-lg"
          >
            <ArrowLeft size={14} /> Back to NACL Home
          </Link>
        </div>
      </div>
    </div>
  );
}
