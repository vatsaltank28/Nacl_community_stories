export default function Footer() {
  return (
    <footer className="py-12 border-t border-secondary/15 mt-auto bg-primary text-secondary">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-2xl font-bold tracking-tighter text-white">
            NACL
          </div>
          <div className="text-xs text-additional/40">
            Movement · Community · Culture · Connection
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-additional">
          <a 
            href="https://www.instagram.com/nacl.in?igsh=czB0bGVkdDR6dzN6" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-accent transition-colors min-h-[44px] px-3 flex items-center justify-center font-semibold"
          >
            Instagram
          </a>
          <a href="/admin" className="hover:text-accent transition-colors min-h-[44px] px-3 flex items-center justify-center font-semibold">
            Admin Console
          </a>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center text-xs text-additional/20">
        &copy; {new Date().getFullYear()} NaCl Flowclub Active Private Limited. All rights reserved.
      </div>
    </footer>
  );
}
