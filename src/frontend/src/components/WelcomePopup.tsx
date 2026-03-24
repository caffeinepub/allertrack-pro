import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FlaskConical, Quote } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const QUOTES = [
  {
    text: "The goal of medicine is to understand disease well enough to cure it.",
    author: "Paul Ehrlich",
  },
  {
    text: "In the field of observation, chance favors only the prepared mind.",
    author: "Louis Pasteur",
  },
  {
    text: "Science is the father of knowledge, but opinion breeds ignorance.",
    author: "Hippocrates",
  },
  {
    text: "Research is to see what everybody else has seen, and to think what nobody else has thought.",
    author: "Albert Szent-Györgyi",
  },
  {
    text: "The art of medicine consists of amusing the patient while nature cures the disease.",
    author: "Voltaire",
  },
  {
    text: "Wherever the art of medicine is loved, there is also a love of humanity.",
    author: "Hippocrates",
  },
];

export function WelcomePopup() {
  const [open, setOpen] = useState(false);
  const [quoteIdx, setQuoteIdx] = useState(0);

  useEffect(() => {
    const welcomed = localStorage.getItem("allertrack_welcomed");
    if (!welcomed) {
      setOpen(true);
    }
  }, []);

  const handleGetStarted = () => {
    localStorage.setItem("allertrack_welcomed", "true");
    setOpen(false);
  };

  const nextQuote = () => {
    setQuoteIdx((i) => (i + 1) % QUOTES.length);
  };

  const quote = QUOTES[quoteIdx];

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) handleGetStarted();
      }}
    >
      <DialogContent
        data-ocid="welcome.dialog"
        className="max-w-lg p-0 overflow-hidden border-primary/20"
        style={{ borderRadius: "1.25rem" }}
      >
        {/* Header gradient */}
        <div
          className="px-6 pt-6 pb-5 flex flex-col items-center text-center"
          style={{
            background:
              "linear-gradient(135deg, oklch(0.18 0.025 230) 0%, oklch(0.26 0.04 185) 100%)",
          }}
        >
          <div className="bg-white rounded-2xl p-2 shadow-lg mb-4">
            <img
              src="/assets/uploads/images-019d20b1-f273-77c0-a7b1-6b3517fa9a5b-1.png"
              alt="Ultimate Medical Laboratories"
              className="w-20 h-20 object-contain rounded-xl"
            />
          </div>
          <DialogHeader className="gap-1">
            <DialogTitle className="text-white font-display text-xl leading-tight">
              AllerTrack Pro
            </DialogTitle>
            <p className="text-primary/80 text-sm font-medium">
              Clinical Sample & Diagnostic Management
            </p>
          </DialogHeader>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/60 border border-border">
            <FlaskConical
              size={18}
              className="text-primary mt-0.5 flex-shrink-0"
            />
            <p className="text-sm text-foreground leading-relaxed">
              A comprehensive laboratory information system for managing
              clinical samples, diagnostic tests, and referrals. Track samples
              from receipt to results across <strong>Haematology</strong>,{" "}
              <strong>Chemistry</strong>, <strong>Serology</strong>, and{" "}
              <strong>Immunochemistry</strong> departments.
            </p>
          </div>

          {/* Scientific quote */}
          <div
            className="rounded-xl p-4 relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.95 0.015 185) 0%, oklch(0.92 0.02 220) 100%)",
            }}
          >
            <Quote
              size={20}
              className="text-primary/30 absolute top-3 right-3"
            />
            <AnimatePresence mode="wait">
              <motion.div
                key={quoteIdx}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25 }}
              >
                <p className="text-sm text-foreground/80 italic leading-relaxed mb-2">
                  &ldquo;{quote.text}&rdquo;
                </p>
                <p className="text-xs font-semibold text-primary">
                  — {quote.author}
                </p>
              </motion.div>
            </AnimatePresence>
            <button
              type="button"
              onClick={nextQuote}
              className="mt-3 text-xs text-primary/60 hover:text-primary transition-colors underline underline-offset-2"
            >
              Next quote →
            </button>
          </div>

          <div className="flex gap-3 pt-1">
            <Button
              data-ocid="welcome.get_started.button"
              onClick={handleGetStarted}
              className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
            >
              Get Started
            </Button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            Authorized by{" "}
            <span className="font-semibold text-primary">Daisy Goche, MLS</span>{" "}
            &amp;{" "}
            <span className="font-semibold text-primary">
              Charles Gwatumba, MLS
            </span>
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
