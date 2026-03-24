import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

const CORRECT_PIN = "2026";
const PIN_KEYS = [0, 1, 2, 3] as const;
type PinIndex = (typeof PIN_KEYS)[number];
type Step = "pin" | "user-select";

export default function LoginPage() {
  const { loginAsUser } = useAuth();
  const [step, setStep] = useState<Step>("pin");
  const [digits, setDigits] = useState<string[]>(["", "", "", ""]);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  function handleDigitChange(index: PinIndex, value: string) {
    const char = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[index] = char;
    setDigits(next);
    if (char && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }
    if (char && index === 3) {
      checkPin([...next.slice(0, 3), char]);
    }
  }

  function handleKeyDown(
    index: PinIndex,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  function checkPin(d: string[]) {
    const pin = d.join("");
    if (pin === CORRECT_PIN) {
      setStatus("success");
      setTimeout(() => setStep("user-select"), 700);
    } else {
      setStatus("error");
      setTimeout(() => {
        setDigits(["", "", "", ""]);
        setStatus("idle");
        inputRefs.current[0]?.focus();
      }, 600);
    }
  }

  function pinInput(index: PinIndex) {
    const d = digits[index];
    const borderColor = d
      ? "oklch(0.64 0.12 180)"
      : status === "error"
        ? "oklch(0.65 0.2 30)"
        : status === "success"
          ? "oklch(0.64 0.15 160)"
          : "oklch(0.88 0.02 220)";
    const bg =
      status === "error"
        ? "oklch(0.97 0.02 30)"
        : status === "success"
          ? "oklch(0.97 0.02 160)"
          : "oklch(0.96 0.012 220)";
    return (
      <input
        ref={(el) => {
          inputRefs.current[index] = el;
        }}
        type="password"
        inputMode="numeric"
        maxLength={1}
        value={d}
        data-ocid={`login.pin.input.${index + 1}`}
        onChange={(e) => handleDigitChange(index, e.target.value)}
        onKeyDown={(e) => handleKeyDown(index, e)}
        className="w-14 h-16 text-2xl font-bold text-center rounded-xl outline-none transition-all duration-150"
        style={{
          background: bg,
          border: `2px solid ${borderColor}`,
          color: "oklch(0.22 0.02 230)",
          boxShadow: d
            ? "0 0 0 3px oklch(0.64 0.12 180 / 0.15)"
            : "inset 0 1px 2px oklch(0.80 0.02 220 / 0.4)",
        }}
      />
    );
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{
        background:
          "linear-gradient(135deg, oklch(0.14 0.03 230) 0%, oklch(0.20 0.04 200) 50%, oklch(0.16 0.03 220) 100%)",
      }}
    >
      <div className="w-full max-w-md mx-4">
        <div
          className="rounded-2xl p-8 shadow-2xl"
          style={{
            background: "oklch(0.98 0.008 220 / 0.97)",
            border: "1px solid oklch(0.64 0.12 180 / 0.3)",
            boxShadow:
              "0 25px 60px oklch(0.10 0.04 230 / 0.6), 0 0 0 1px oklch(0.64 0.12 180 / 0.1)",
          }}
        >
          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-white rounded-2xl p-3 shadow-lg mb-4">
              <img
                src="/assets/uploads/images-019d20b1-f273-77c0-a7b1-6b3517fa9a5b-1.png"
                alt="Ultimate Medical Laboratories"
                className="w-20 h-20 object-contain rounded-lg"
              />
            </div>
            <h1
              className="text-2xl font-bold text-center"
              style={{
                fontFamily: "'Bricolage Grotesque', sans-serif",
                color: "oklch(0.22 0.02 230)",
              }}
            >
              AllerTrack Pro
            </h1>
            <p
              className="text-sm mt-1"
              style={{ color: "oklch(0.55 0.03 220)" }}
            >
              Clinical Sample & Diagnostic Management
            </p>
          </div>

          <AnimatePresence mode="wait">
            {step === "pin" && (
              <motion.div
                key="pin"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <p
                  className="text-center text-sm font-medium mb-6"
                  style={{ color: "oklch(0.35 0.03 230)" }}
                >
                  Enter 4-digit access PIN
                </p>

                <motion.div
                  className="flex justify-center gap-4 mb-6"
                  animate={
                    status === "error"
                      ? { x: [0, -8, 8, -6, 6, -4, 4, 0] }
                      : { x: 0 }
                  }
                  transition={{ duration: 0.4 }}
                >
                  {pinInput(0)}
                  {pinInput(1)}
                  {pinInput(2)}
                  {pinInput(3)}
                </motion.div>

                {status === "success" && (
                  <motion.p
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center text-sm font-semibold mb-4"
                    style={{ color: "oklch(0.45 0.15 160)" }}
                  >
                    ✓ Access granted
                  </motion.p>
                )}

                {status === "error" && (
                  <motion.p
                    key="error-msg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    data-ocid="login.error_state"
                    className="text-center text-sm font-medium mb-4"
                    style={{ color: "oklch(0.55 0.2 30)" }}
                  >
                    Incorrect PIN. Please try again.
                  </motion.p>
                )}

                <p
                  className="text-center text-xs"
                  style={{ color: "oklch(0.72 0.03 220)" }}
                >
                  Authorized personnel only
                </p>
              </motion.div>
            )}

            {step === "user-select" && (
              <motion.div
                key="user-select"
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.3 }}
              >
                <p
                  className="text-center text-base font-semibold mb-6"
                  style={{ color: "oklch(0.28 0.03 230)" }}
                >
                  Who's logging in?
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <motion.button
                    type="button"
                    data-ocid="login.charles.button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => loginAsUser("Charles")}
                    className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl transition-all duration-150 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.94 0.04 240) 0%, oklch(0.92 0.06 210) 100%)",
                      border: "2px solid oklch(0.56 0.10 220 / 0.5)",
                      boxShadow: "0 4px 16px oklch(0.56 0.10 220 / 0.2)",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.56 0.10 220) 0%, oklch(0.46 0.12 240) 100%)",
                        color: "oklch(0.98 0.01 220)",
                      }}
                    >
                      C
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.28 0.06 230)" }}
                    >
                      Charles
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.50 0.05 220)" }}
                    >
                      Gwatumba, MLS
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    data-ocid="login.daisy.button"
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => loginAsUser("Daisy")}
                    className="flex flex-col items-center gap-3 py-6 px-4 rounded-2xl transition-all duration-150 cursor-pointer"
                    style={{
                      background:
                        "linear-gradient(135deg, oklch(0.94 0.04 160) 0%, oklch(0.92 0.07 170) 100%)",
                      border: "2px solid oklch(0.55 0.13 165 / 0.5)",
                      boxShadow: "0 4px 16px oklch(0.55 0.13 165 / 0.2)",
                    }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold"
                      style={{
                        background:
                          "linear-gradient(135deg, oklch(0.55 0.13 165) 0%, oklch(0.47 0.14 155) 100%)",
                        color: "oklch(0.98 0.01 160)",
                      }}
                    >
                      D
                    </div>
                    <span
                      className="text-sm font-bold"
                      style={{ color: "oklch(0.28 0.05 170)" }}
                    >
                      Daisy
                    </span>
                    <span
                      className="text-xs"
                      style={{ color: "oklch(0.48 0.06 165)" }}
                    >
                      Goche, MLS
                    </span>
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <p
            className="text-center text-xs mt-8"
            style={{ color: "oklch(0.60 0.03 220)" }}
          >
            Developed by{" "}
            <span style={{ color: "oklch(0.50 0.10 180)", fontWeight: 600 }}>
              Thabzizi
            </span>
            {" | "}Authorized by{" "}
            <span style={{ color: "oklch(0.50 0.10 180)", fontWeight: 600 }}>
              Daisy
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
