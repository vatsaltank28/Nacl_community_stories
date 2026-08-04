"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, MapPin, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { ReviewItem } from "./ReviewStoryPanel";

interface AddReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReviewAdded: (newReview: ReviewItem) => void;
}

const AVAILABLE_EVENTS = [
  { id: "nacl-flow-club-rawform-lab", title: "NaCl Flow Club: RawForm Lab", city: "Bangalore", coords: [77.5946, 12.9716] as [number, number] },
  { id: "sunset-wellness-circle-cold-plunge", title: "Sunset Wellness Circle & Cold Plunge", city: "Bangalore", coords: [77.6300, 12.9350] as [number, number] },
  { id: "steel-mace-flow-breathwork", title: "Steel Mace Flow & Breathwork", city: "Mumbai", coords: [72.8777, 19.0760] as [number, number] },
  { id: "nacl-coastal-breath-sauna", title: "NaCl Coastal Breath & Sauna Jam", city: "Mumbai", coords: [72.8258, 18.9220] as [number, number] },
  { id: "animal-flow-mobility-intensive", title: "Animal Flow & Mobility Intensive", city: "Coimbatore", coords: [76.9558, 11.0168] as [number, number] },
];

export default function AddReviewModal({
  isOpen,
  onClose,
  onReviewAdded
}: AddReviewModalProps) {
  const [reviewerName, setReviewerName] = useState("");
  const [selectedEventId, setSelectedEventId] = useState(AVAILABLE_EVENTS[0].id);
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState("");
  const [eventImage, setEventImage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const selectedEvent = AVAILABLE_EVENTS.find((e) => e.id === selectedEventId) || AVAILABLE_EVENTS[0];

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setEventImage(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");

    if (!reviewerName.trim() || !reviewText.trim()) {
      setErrorMsg("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          reviewerName,
          eventId: selectedEvent.id,
          eventName: selectedEvent.title,
          city: selectedEvent.city,
          coordinates: selectedEvent.coords,
          rating,
          reviewText,
          eventImage: eventImage.trim(),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      setIsSuccess(true);
      onReviewAdded(data);

      setTimeout(() => {
        setIsSuccess(false);
        setReviewerName("");
        setReviewText("");
        onClose();
      }, 1500);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while submitting review.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-lg bg-primary/95 border border-white/15 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-accent font-bold">
                NaCl Story Map
              </span>
              <h2 className="text-xl font-extrabold text-white">Share Your Experience</h2>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white transition-colors"
            >
              <X size={16} />
            </button>
          </div>

          {isSuccess ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <CheckCircle2 size={48} className="text-emerald-400 animate-bounce" />
              <h3 className="text-xl font-bold text-white">Story Published!</h3>
              <p className="text-xs text-additional/80 max-w-xs">
                Your review pin has been dropped on the NaCl Story Map.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle size={14} className="shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-additional/90 mb-1.5">
                  Your Name *
                </label>
                <input
                  type="text"
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="e.g. Aarav Sharma"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors"
                  required
                />
              </div>

              {/* Event Selector */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-additional/90 mb-1.5">
                  NaCl Experience *
                </label>
                <select
                  value={selectedEventId}
                  onChange={(e) => setSelectedEventId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-primary border border-white/10 text-white text-sm focus:outline-none focus:border-accent transition-colors"
                >
                  {AVAILABLE_EVENTS.map((ev) => (
                    <option key={ev.id} value={ev.id}>
                      {ev.title} ({ev.city})
                    </option>
                  ))}
                </select>
                <div className="mt-1 flex items-center gap-1 text-[11px] text-cyan-400 font-mono">
                  <MapPin size={12} />
                  <span>City Hub: {selectedEvent.city}</span>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-additional/90 mb-1.5">
                  Rating *
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        size={24}
                        className={
                          star <= rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-white/20"
                        }
                      />
                    </button>
                  ))}
                  <span className="ml-2 text-xs font-bold text-amber-400">
                    {rating}.0 / 5.0
                  </span>
                </div>
              </div>

              {/* Review Text */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-additional/90 mb-1.5">
                  Your Review / Experience *
                </label>
                <textarea
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                  placeholder="Share how this movement flow, breathwork, or cold plunge felt..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-accent transition-colors resize-none"
                  required
                />
              </div>

              {/* Optional Photo URL / Upload */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-additional/90 mb-1.5">
                  Experience Photo (Online Link or File Upload)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={eventImage}
                    onChange={(e) => setEventImage(e.target.value)}
                    placeholder="https://... or upload photo file"
                    className="flex-1 px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-white/30 text-xs focus:outline-none focus:border-accent transition-colors"
                  />
                  <label
                    htmlFor="story-photo-upload"
                    className="px-3.5 py-2.5 bg-white/10 hover:bg-accent hover:text-primary text-white text-xs font-bold rounded-xl cursor-pointer transition-colors shrink-0 flex items-center justify-center"
                  >
                    Upload Photo
                  </label>
                  <input
                    type="file"
                    id="story-photo-upload"
                    accept="image/*"
                    onChange={handleImageFileUpload}
                    className="hidden"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-6 rounded-full bg-accent hover:bg-white text-primary font-bold text-sm uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Publishing Pin...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Drop Pin on Story Map</span>
                  </>
                )}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
