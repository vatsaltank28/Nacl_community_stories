"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShieldCheck, 
  Check, 
  Lock, 
  QrCode, 
  Smartphone, 
  CreditCard, 
  Building2, 
  Wallet, 
  X, 
  Sparkles,
  Loader2,
  ArrowRight
} from "lucide-react";

interface RazorpayModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventTitle: string;
  amount: number;
  userName: string;
  userEmail: string;
  onSuccess: (paymentDetails: { paymentId: string; paymentMethod: string; orderId: string }) => void;
}

type PaymentTab = "upi" | "card" | "netbanking" | "wallet";

export default function RazorpayModal({
  isOpen,
  onClose,
  eventTitle,
  amount,
  userName,
  userEmail,
  onSuccess
}: RazorpayModalProps) {
  const [activeTab, setActiveTab] = useState<PaymentTab>("upi");
  
  // UPI Form state
  const [upiOption, setUpiOption] = useState<"apps" | "qr" | "id">("apps");
  const [upiId, setUpiId] = useState("");
  const [selectedUpiApp, setSelectedUpiApp] = useState("gpay");

  // Card Form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState(userName || "");

  // Netbanking state
  const [selectedBank, setSelectedBank] = useState("HDFC");

  // Wallet state
  const [selectedWallet, setSelectedWallet] = useState("AmazonPay");

  // Payment Execution state
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStage, setProcessingStage] = useState<string>("");
  const [orderId] = useState(() => `order_nacl_${Math.floor(100000 + Math.random() * 900000)}`);

  // QR Timer countdown
  const [qrTimer, setQrTimer] = useState(300);

  useEffect(() => {
    if (!isOpen) {
      setIsProcessing(false);
      setProcessingStage("");
      return;
    }
    setCardName(userName || "");
    const timer = setInterval(() => {
      setQrTimer((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, userName]);

  // Auto-format card number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 16);
    const formatted = raw.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Auto-format expiry
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let raw = e.target.value.replace(/\D/g, "").slice(0, 4);
    if (raw.length >= 3) {
      raw = `${raw.slice(0, 2)}/${raw.slice(2)}`;
    }
    setCardExpiry(raw);
  };

  const executePayment = (methodName: string) => {
    setIsProcessing(true);
    setProcessingStage("Connecting to Razorpay Secure Gateway...");

    setTimeout(() => {
      setProcessingStage("Authorizing ₹" + amount + " with Bank / UPI network...");
    }, 800);

    setTimeout(() => {
      setProcessingStage("Payment Captured Successfully!");
    }, 1700);

    setTimeout(() => {
      const generatedPayId = "pay_" + Math.random().toString(36).substring(2, 12).toUpperCase();
      setIsProcessing(false);
      onSuccess({
        paymentId: generatedPayId,
        paymentMethod: methodName,
        orderId
      });
    }, 2200);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? "0" : ""}${s}`;
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 font-body">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/85 backdrop-blur-md"
          onClick={!isProcessing ? onClose : undefined}
        />

        {/* Razorpay Modal Window */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative bg-[#121212] border border-[#f0f2db]/15 rounded-3xl w-full max-w-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.8)] z-10 text-[#f0f2db]"
        >
          {/* Razorpay Top Header */}
          <div className="bg-[#181818] border-b border-[#f0f2db]/10 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#0c2340] border border-[#3395ff]/40 flex items-center justify-center text-[#3395ff] font-header font-black text-xs shadow-md">
                R
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-header font-black text-white">Razorpay</span>
                  <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#ef542a]/20 text-[#ef542a] border border-[#ef542a]/30">
                    Test Mode
                  </span>
                </div>
                <div className="text-[11px] text-[#f0f2db]/60 truncate max-w-[200px] sm:max-w-xs">
                  {eventTitle}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] uppercase tracking-wider text-[#f0f2db]/50 font-bold">Total Amount</div>
                <div className="text-lg sm:text-xl font-header font-black text-white">
                  ₹{amount.toLocaleString("en-IN")}
                </div>
              </div>
              {!isProcessing && (
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-full bg-[#f0f2db]/10 hover:bg-[#ef542a]/20 hover:text-[#ef542a] transition-colors flex items-center justify-center text-[#f0f2db]/70"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          </div>

          {/* User Contact Strip */}
          <div className="bg-[#141414] px-6 py-2 border-b border-[#f0f2db]/5 flex flex-wrap items-center justify-between text-xs text-[#f0f2db]/70 gap-2">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-white">{userName}</span>
              <span>·</span>
              <span className="text-[#f0f2db]/60">{userEmail}</span>
            </div>
            <div className="text-[10px] text-[#ffd139] font-mono">
              {orderId}
            </div>
          </div>

          {/* Main Payment Section Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 min-h-[360px]">
            {/* Left Method Tabs */}
            <div className="md:col-span-4 bg-[#141414] border-r border-[#f0f2db]/10 p-3 space-y-1">
              {[
                { id: "upi", label: "UPI & QR", icon: Smartphone, badge: "Popular" },
                { id: "card", label: "Cards", icon: CreditCard, badge: "Visa/MC" },
                { id: "netbanking", label: "Netbanking", icon: Building2, badge: "All Banks" },
                { id: "wallet", label: "Wallets", icon: Wallet, badge: "" },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as PaymentTab)}
                    disabled={isProcessing}
                    className={`w-full p-3.5 rounded-2xl flex items-center justify-between text-left transition-all duration-200 ${
                      isActive
                        ? "bg-[#ef542a] text-[#0A0A0A] font-header font-bold shadow-md"
                        : "hover:bg-[#f0f2db]/5 text-[#f0f2db]/80 font-medium"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} className={isActive ? "text-[#0A0A0A]" : "text-[#ef542a]"} />
                      <span className="text-xs font-semibold">{tab.label}</span>
                    </div>
                    {tab.badge && (
                      <span
                        className={`text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full font-bold ${
                          isActive
                            ? "bg-[#0A0A0A]/20 text-[#0A0A0A]"
                            : "bg-[#f0f2db]/10 text-[#ffd139]"
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-6 px-2 text-center space-y-2">
                <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#f0f2db]/50">
                  <Lock size={12} className="text-[#3395ff]" />
                  <span>256-bit SSL Razorpay Encrypted</span>
                </div>
              </div>
            </div>

            {/* Right Method Form Content */}
            <div className="md:col-span-8 p-6 flex flex-col justify-between bg-[#121212]">
              {/* TAB 1: UPI & QR */}
              {activeTab === "upi" && (
                <div className="space-y-5">
                  <div className="flex items-center gap-2 p-1 bg-[#181818] rounded-xl border border-[#f0f2db]/10">
                    {[
                      { id: "apps", label: "UPI Apps" },
                      { id: "qr", label: "Scan QR Code" },
                      { id: "id", label: "UPI ID" },
                    ].map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setUpiOption(opt.id as any)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          upiOption === opt.id
                            ? "bg-[#ef542a] text-[#0A0A0A] shadow"
                            : "text-[#f0f2db]/70 hover:text-white"
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>

                  {upiOption === "apps" && (
                    <div className="space-y-3">
                      <div className="text-xs font-semibold text-[#f0f2db]/80">Select your preferred UPI App:</div>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { id: "gpay", name: "Google Pay", color: "from-blue-500/20 to-blue-600/10 border-blue-500/30" },
                          { id: "phonepe", name: "PhonePe", color: "from-purple-500/20 to-purple-600/10 border-purple-500/30" },
                          { id: "paytm", name: "Paytm UPI", color: "from-sky-500/20 to-sky-600/10 border-sky-500/30" },
                          { id: "cred", name: "CRED UPI", color: "from-amber-500/20 to-amber-600/10 border-amber-500/30" },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setSelectedUpiApp(app.id)}
                            className={`p-3 rounded-2xl border flex items-center justify-between transition-all bg-gradient-to-br ${app.color} ${
                              selectedUpiApp === app.id
                                ? "border-[#ffd139] ring-2 ring-[#ffd139]/40"
                                : "hover:border-[#f0f2db]/30"
                            }`}
                          >
                            <span className="text-xs font-bold text-white">{app.name}</span>
                            {selectedUpiApp === app.id && <Check size={14} className="text-[#ffd139]" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {upiOption === "qr" && (
                    <div className="flex flex-col items-center justify-center p-4 bg-[#181818] rounded-2xl border border-[#f0f2db]/10 space-y-3 text-center">
                      <div className="relative p-3 bg-white rounded-2xl shadow-lg">
                        <QrCode size={110} className="text-black" />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                          <div className="w-8 h-8 rounded-full bg-[#ef542a] flex items-center justify-center text-black font-black text-[10px] shadow">
                            NaCl
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-[#f0f2db]/80 font-medium">
                        Scan with any UPI app · Expires in <span className="text-[#ffd139] font-mono font-bold">{formatTime(qrTimer)}</span>
                      </div>
                    </div>
                  )}

                  {upiOption === "id" && (
                    <div className="space-y-2">
                      <label className="block text-[11px] font-bold text-[#f0f2db]/70 uppercase tracking-wider">
                        Enter UPI VPA / ID
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          placeholder="e.g. mobile@okhdfcbank or user@paytm"
                          value={upiId}
                          onChange={(e) => setUpiId(e.target.value)}
                          className="w-full bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-xl px-4 py-3 text-xs text-white focus:outline-none transition-colors"
                        />
                      </div>
                      <p className="text-[10px] text-[#f0f2db]/50">A collect request will be sent to your UPI app for authorization.</p>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: CREDIT / DEBIT CARDS */}
              {activeTab === "card" && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={19}
                        placeholder="4532 8901 2345 6789"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        className="w-full bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                      <div className="absolute right-3 top-2.5 flex items-center gap-1 text-[10px] font-bold text-[#ffd139]">
                        Visa/RuPay
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        maxLength={5}
                        placeholder="MM/YY"
                        value={cardExpiry}
                        onChange={handleExpiryChange}
                        className="w-full bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ""))}
                        className="w-full bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-xl px-4 py-2.5 text-xs text-white font-mono focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-[#f0f2db]/70 uppercase tracking-wider mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      placeholder="Cardholder Name"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full bg-[#181818] border border-[#f0f2db]/20 focus:border-[#ef542a] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none transition-colors"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: NETBANKING */}
              {activeTab === "netbanking" && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-[#f0f2db]/80">Select Popular Indian Bank:</div>
                  <div className="grid grid-cols-2 gap-2.5">
                    {["HDFC Bank", "ICICI Bank", "State Bank of India", "Axis Bank", "Kotak Mahindra", "Punjab National Bank"].map((bank) => (
                      <button
                        key={bank}
                        type="button"
                        onClick={() => setSelectedBank(bank)}
                        className={`p-3 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                          selectedBank === bank
                            ? "bg-[#ef542a]/15 border-[#ef542a] text-white font-bold"
                            : "bg-[#181818] border-[#f0f2db]/10 text-[#f0f2db]/70 hover:border-[#f0f2db]/30"
                        }`}
                      >
                        <span>{bank}</span>
                        {selectedBank === bank && <Check size={14} className="text-[#ef542a]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 4: WALLETS */}
              {activeTab === "wallet" && (
                <div className="space-y-4">
                  <div className="text-xs font-semibold text-[#f0f2db]/80">Select Digital Wallet:</div>
                  <div className="space-y-2.5">
                    {["Amazon Pay Wallet", "Paytm Wallet", "Mobikwik", "Freecharge"].map((w) => (
                      <button
                        key={w}
                        type="button"
                        onClick={() => setSelectedWallet(w)}
                        className={`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between text-xs transition-all ${
                          selectedWallet === w
                            ? "bg-[#ef542a]/15 border-[#ef542a] text-white font-bold"
                            : "bg-[#181818] border-[#f0f2db]/10 text-[#f0f2db]/70 hover:border-[#f0f2db]/30"
                        }`}
                      >
                        <span>{w}</span>
                        {selectedWallet === w && <Check size={14} className="text-[#ef542a]" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Bottom Payment Action Button */}
              <div className="pt-6 mt-4 border-t border-[#f0f2db]/10 space-y-3">
                <button
                  type="button"
                  disabled={isProcessing}
                  onClick={() => executePayment(
                    activeTab === "upi" ? `UPI (${selectedUpiApp.toUpperCase()})` : 
                    activeTab === "card" ? "Debit/Credit Card" : 
                    activeTab === "netbanking" ? `Netbanking (${selectedBank})` : "Digital Wallet"
                  )}
                  className="w-full min-h-[50px] py-3.5 px-6 rounded-2xl bg-[#ef542a] hover:bg-[#ffd139] text-[#0A0A0A] font-header font-black text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-[0_10px_25px_rgba(239,84,42,0.35)] hover:shadow-[0_12px_30px_rgba(255,209,57,0.4)] disabled:opacity-50"
                >
                  <Lock size={16} />
                  <span>Pay ₹{amount.toLocaleString("en-IN")} via Razorpay</span>
                  <ArrowRight size={16} />
                </button>

                <div className="flex items-center justify-between text-[10px] text-[#f0f2db]/50 px-1 font-body">
                  <span className="flex items-center gap-1">
                    <ShieldCheck size={12} className="text-[#ffd139]" />
                    <span>Instant Automated Verification</span>
                  </span>
                  <span>100% Refundable per event policy</span>
                </div>
              </div>
            </div>
          </div>

          {/* Processing Overlay State */}
          <AnimatePresence>
            {isProcessing && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-[#0A0A0A]/95 backdrop-blur-lg flex flex-col items-center justify-center p-8 z-30 text-center space-y-5"
              >
                <div className="relative">
                  <div className="w-20 h-20 rounded-full border-4 border-[#ef542a]/30 border-t-[#ef542a] animate-spin flex items-center justify-center">
                    <Loader2 size={28} className="text-[#ffd139] animate-pulse" />
                  </div>
                  <Sparkles size={18} className="text-[#ffd139] absolute -top-1 -right-1 animate-ping" />
                </div>

                <div className="space-y-2 max-w-sm">
                  <h3 className="text-xl font-header font-black text-white">Processing Razorpay Payment</h3>
                  <p className="text-xs text-[#ffd139] font-medium animate-pulse">{processingStage}</p>
                  <p className="text-[11px] text-[#f0f2db]/60">Please do not refresh or close this window.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
