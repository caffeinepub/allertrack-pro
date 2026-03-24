import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";

export function LoginWelcomePopup() {
  const { user, justLoggedIn, clearJustLoggedIn } = useAuth();
  const [visible, setVisible] = useState(false);
  const [animateIn, setAnimateIn] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (justLoggedIn) {
      setVisible(true);
      const t = setTimeout(() => setAnimateIn(true), 20);
      return () => clearTimeout(t);
    }
  }, [justLoggedIn]);

  function close() {
    setAnimateIn(false);
    setTimeout(() => {
      setVisible(false);
      clearJustLoggedIn();
    }, 300);
  }

  if (!visible || !user) return null;

  const isDaisy = user === "Daisy";
  const greeting = isDaisy ? "Welcome back, Daisy!" : "Welcome back, Charles!";
  const subtitle = isDaisy
    ? "Daisy Goche, MLS \u2014 Authorized Laboratory Scientist"
    : "Charles Gwatumba, MLS \u2014 Authorized Laboratory Scientist";
  const avatarInitial = user[0];
  const avatarGrad = isDaisy
    ? "linear-gradient(135deg, oklch(0.58 0.15 310), oklch(0.64 0.12 180))"
    : "linear-gradient(135deg, oklch(0.52 0.15 200), oklch(0.64 0.12 180))";

  return (
    <div
      aria-label="Welcome"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: animateIn
          ? "oklch(0.08 0.02 230 / 0.65)"
          : "oklch(0.08 0.02 230 / 0)",
        transition: "background 0.3s ease",
      }}
      onClick={close}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <dialog
        ref={dialogRef}
        open
        aria-label="Welcome dialog"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
        style={{
          background: "oklch(0.98 0.008 220)",
          borderRadius: "24px",
          padding: "40px 48px",
          maxWidth: "440px",
          width: "calc(100% - 32px)",
          textAlign: "center",
          border: "none",
          boxShadow:
            "0 32px 80px oklch(0.10 0.04 230 / 0.5), 0 0 0 1px oklch(0.64 0.12 180 / 0.15)",
          transform: animateIn
            ? "scale(1) translateY(0)"
            : "scale(0.92) translateY(20px)",
          opacity: animateIn ? 1 : 0,
          transition:
            "transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: "50%",
            background: avatarGrad,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "28px",
            fontWeight: 700,
            color: "white",
          }}
        >
          {avatarInitial}
        </div>

        <h2
          style={{
            fontFamily: "'Bricolage Grotesque', sans-serif",
            fontSize: "26px",
            fontWeight: 700,
            color: "oklch(0.20 0.03 230)",
            margin: "0 0 8px",
          }}
        >
          {greeting}
        </h2>

        <p
          style={{
            fontSize: "14px",
            color: "oklch(0.52 0.06 180)",
            fontWeight: 500,
            margin: "0 0 20px",
          }}
        >
          {subtitle}
        </p>

        <div
          style={{
            height: "1px",
            background: "oklch(0.90 0.015 220)",
            margin: "0 0 20px",
          }}
        />

        <p
          style={{
            fontSize: "13.5px",
            color: "oklch(0.42 0.04 230)",
            lineHeight: 1.6,
            margin: "0 0 28px",
          }}
        >
          You are now logged into <strong>AllerTrack Pro</strong>. All sample
          records, diagnostic results, and referrals are ready for your review.
        </p>

        <button
          type="button"
          onClick={close}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "12px",
            background:
              "linear-gradient(135deg, oklch(0.64 0.12 180) 0%, oklch(0.56 0.1 220) 100%)",
            color: "white",
            fontWeight: 600,
            fontSize: "15px",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 4px 14px oklch(0.64 0.12 180 / 0.4)",
            transition: "opacity 0.15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = "0.88";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = "1";
          }}
        >
          Get Started
        </button>

        <p
          style={{
            marginTop: "18px",
            fontSize: "11px",
            color: "oklch(0.65 0.03 220)",
          }}
        >
          Developed by{" "}
          <strong style={{ color: "oklch(0.50 0.10 180)" }}>Thabzizi</strong>
          {" | "}Authorized by{" "}
          <strong style={{ color: "oklch(0.50 0.10 180)" }}>Daisy</strong>
        </p>
      </dialog>
    </div>
  );
}
