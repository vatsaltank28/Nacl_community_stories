"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, Zap, Award, Target, Users } from "lucide-react";
import { getUserSession, saveUserSession } from "@/lib/store";

interface Question {
  id: number;
  question: string;
  options: { text: string; archetype: string }[];
}

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "Select your preferred morning rhythm:",
    options: [
      { text: "Explosive flips, calisthenics & animal movement", archetype: "Mover" },
      { text: "Choreographing a visual project or design flow", archetype: "Creator" },
      { text: "Discovering a hidden trail or new city corner", archetype: "Explorer" },
      { text: "Hosting a group breakfast and circle check-in", archetype: "Connector" }
    ]
  },
  {
    id: 2,
    question: "When faced with a heavy steel mace, you:",
    options: [
      { text: "Focus entirely on joint control & fluid 360 orbits", archetype: "Mover" },
      { text: "Design a creative sequence of transitions and patterns", archetype: "Creator" },
      { text: "Wonder about the historical roots and mechanics of the mace", archetype: "Explorer" },
      { text: "Teach a beginner how to hold it without straining", archetype: "Connector" }
    ]
  },
  {
    id: 3,
    question: "How do you integrate hot & cold sauna recovery?",
    options: [
      { text: "Treat it as vital somatic repair and circulation work", archetype: "Mover" },
      { text: "Meditate on sensory perceptions inside the ice tub", archetype: "Creator" },
      { text: "Examine physical tolerances and try to optimize breathing", archetype: "Explorer" },
      { text: "Share stories, reflect, and joke around in the hot lounge", archetype: "Connector" }
    ]
  }
];

const ARCHETYPES = {
  Mover: {
    name: "Kinetic Mover",
    desc: "You are deeply attuned to physical control, mobility, and flow. You treat movement not as work, but as kinetic self-expression.",
    icon: Zap
  },
  Creator: {
    name: "Flow Creator",
    desc: "You look at movements and communities as canvas options. You love choreographing patterns, visuals, and unique designs.",
    icon: Award
  },
  Explorer: {
    name: "Curious Explorer",
    desc: "You are driven by discovery, historical structures, and testing physical or geographical boundaries.",
    icon: Target
  },
  Connector: {
    name: "Hub Connector",
    desc: "You are the vital energy that links spaces and souls. You notice members in the background and bring everyone together.",
    icon: Users
  }
};

export default function CommunityMatch({ 
  onClose, 
  eventId, 
  onComplete 
}: { 
  onClose: () => void; 
  eventId: string;
  onComplete?: (archetype: string) => void;
}) {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({
    Mover: 0,
    Creator: 0,
    Explorer: 0,
    Connector: 0
  });
  const [result, setResult] = useState<string | null>(null);

  const handleAnswer = (archetype: string) => {
    const nextScores = { ...scores, [archetype]: scores[archetype] + 1 };
    setScores(nextScores);

    if (step < QUESTIONS.length - 1) {
      setStep(step + 1);
    } else {
      // Determine dominant archetype
      let dominant = "Mover";
      let maxScore = -1;
      for (const [key, value] of Object.entries(nextScores)) {
        if (value > maxScore) {
          maxScore = value;
          dominant = key;
        }
      }
      
      setResult(dominant);

      // Save to user session
      const session = getUserSession();
      session.archetype = dominant;
      saveUserSession(session);
      
      // Dispatch event to sync Header
      window.dispatchEvent(new Event("nacl_session_update"));
    }
  };

  const ArchetypeInfo = result ? ARCHETYPES[result as keyof typeof ARCHETYPES] : null;
  const ArchetypeIcon = ArchetypeInfo ? ArchetypeInfo.icon : Sparkles;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-primary/85 backdrop-blur-md"
        onClick={onClose}
      />
      
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="relative bg-primary border border-secondary/15 rounded-3xl w-full max-w-lg p-8 shadow-2xl z-10 text-secondary"
      >
        <button onClick={onClose} className="absolute top-6 right-6 text-additional hover:text-white transition-colors">
          <X size={20} />
        </button>

        {!result ? (
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              className="mt-4"
            >
              <div className="text-accent font-bold uppercase tracking-widest text-xs mb-2">
                Flow Matcher · Quiz {step + 1} of {QUESTIONS.length}
              </div>
              <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-8 text-white">
                {QUESTIONS[step].question}
              </h3>
              
              <div className="space-y-3">
                {QUESTIONS[step].options.map((option, i) => (
                  <button
                    key={i}
                    onClick={() => handleAnswer(option.archetype)}
                    className="w-full p-5 text-left rounded-2xl border border-secondary/10 hover:border-accent hover:bg-accent/5 hover:text-white transition-all text-sm font-medium"
                  >
                    {option.text}
                  </button>
                ))}
              </div>
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-6"
          >
            <div className="w-20 h-20 bg-accent/15 border border-accent/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-accent">
              <ArchetypeIcon size={40} />
            </div>
            <h2 className="text-xs uppercase font-bold tracking-widest text-additional mb-1">Your Archetype Unlocked</h2>
            <h3 className="text-3xl font-extrabold mb-4 text-white tracking-tight">{ArchetypeInfo?.name}</h3>
            <p className="text-sm text-additional leading-relaxed mb-8 max-w-sm mx-auto">{ArchetypeInfo?.desc}</p>
            
            <button 
              onClick={() => {
                if (onComplete) {
                  onComplete(result);
                }
              }}
              className="w-full py-4 bg-accent text-primary hover:bg-white font-bold rounded-xl transition-colors text-sm"
            >
              Unlock Ticket Checkout
            </button>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
