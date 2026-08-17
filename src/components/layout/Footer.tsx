import Link from "next/link";

export default function Footer() {
  return (
    <footer className="py-12 border-t border-[#f0f2db]/10 mt-auto bg-[#0A0A0A] text-[#f0f2db] font-body">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="text-2xl font-header font-black tracking-tight text-[#f0f2db]">
            NACL
          </div>
          <div className="text-xs text-[#f0f2db]/60 font-body">
            Movement · <span className="font-highlight text-[#ef542a]">Community</span> · Culture · Connection
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6 text-xs sm:text-sm text-[#f0f2db]/70 font-body">
          <a 
            href="https://www.instagram.com/nacl.in?igsh=czB0bGVkdDR6dzN6" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#ef542a] transition-colors min-h-[44px] px-3 flex items-center justify-center font-semibold"
          >
            Instagram
          </a>
          <a 
            href="https://chat.whatsapp.com/DfBcTNDUwBcCS1OTY73Qxl" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="hover:text-[#ffd139] transition-colors min-h-[44px] px-3 flex items-center justify-center font-semibold"
          >
            WhatsApp
          </a>
          <Link href="/admin" className="hover:text-[#aadeef] transition-colors min-h-[44px] px-3 flex items-center justify-center font-semibold">
            Admin Console
          </Link>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 mt-8 text-center text-xs text-[#f0f2db]/40 font-body">
        &copy; {new Date().getFullYear()} NaCl Flowclub Active Private Limited. All rights reserved.
      </div>
    </footer>
  );
}
