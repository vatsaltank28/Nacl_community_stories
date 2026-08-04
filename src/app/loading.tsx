export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="text-xs font-bold uppercase tracking-widest text-accent animate-pulse">
          Loading NaCl Experience...
        </span>
      </div>
    </div>
  );
}
