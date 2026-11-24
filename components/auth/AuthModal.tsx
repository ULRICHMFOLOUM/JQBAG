"use client";

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Lock, Mail, User, Phone, ShieldCheck, AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { BorderBeam } from "@/components/ui/border-beam";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: "login" | "register" | "forgot";
  onSuccess?: () => void;
}

export function AuthModal({
  isOpen,
  onClose,
  initialTab = "login",
  onSuccess,
}: AuthModalProps) {
  const [tab, setTab] = useState<"login" | "register" | "forgot">(initialTab);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  if (!isOpen) return null;

  const resetForm = () => {
    setErrorMsg(null);
    setEmail("");
    setPassword("");
    setName("");
    setPhone("");
    setConfirmPassword("");
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      // Si les clés Google ne sont pas configurées, on informe poliment l'utilisateur
      await signIn("google", { callbackUrl: window.location.href });
    } catch (err: any) {
      console.error(err);
      toast.error("Erreur lors de l'authentification Google.");
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setErrorMsg(res.error);
      toast.error(res.error);
    } else {
      toast.success("Ravi de vous revoir chez JQ BAGS ! ✨");
      resetForm();
      onClose();
      if (onSuccess) onSuccess();
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (password !== confirmPassword) {
      setErrorMsg("Les mots de passe ne correspondent pas.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Le mot de passe doit comporter au moins 6 caractères.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Échec de l'inscription");
      }

      toast.success("Compte créé avec succès ! Connexion automatique...");

      // Connexion immédiate
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (!res?.error) {
        resetForm();
        onClose();
        if (onSuccess) onSuccess();
      }
    } catch (err: any) {
      setErrorMsg(err.message);
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simuler l'envoi d'un lien de réinitialisation
    setTimeout(() => {
      setLoading(false);
      toast.success("Si cet email existe, un lien de réinitialisation vous a été envoyé.");
      setTab("login");
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full max-w-md bg-gradient-to-b from-obsidian-900 via-obsidian-950 to-black border border-gold-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-gold-500/10 overflow-hidden"
      >
        <BorderBeam size={220} duration={12} colorFrom="#d4af37" colorTo="#fde047" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold mb-3">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>ESPACE CLIENT PRIVILÈGE</span>
          </div>
          <h3 className="font-serif text-2xl font-bold text-white tracking-wide">
            {tab === "login" && "Bienvenue dans l'Atelier"}
            {tab === "register" && "Rejoignez l'Excellence"}
            {tab === "forgot" && "Mot de passe oublié"}
          </h3>
          <p className="text-xs text-zinc-400 mt-1">
            {tab === "login" && "Accédez à vos commandes et avantages personnalisés."}
            {tab === "register" && "Créez votre compte client en moins d'une minute."}
            {tab === "forgot" && "Entrez votre email pour recevoir les instructions."}
          </p>
        </div>

        {/* Error Notification */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Google Authentication Button */}
        {tab !== "forgot" && (
          <div className="mb-5">
            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white font-medium text-sm transition-all duration-200 hover:border-gold-500/50 hover:shadow-lg hover:shadow-gold-500/5"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuer avec Google</span>
            </button>

            <div className="relative my-5 text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <span className="relative bg-obsidian-950 px-3 text-xs uppercase tracking-wider text-zinc-500">
                ou avec email
              </span>
            </div>
          </div>
        )}

        {/* Tab switchers */}
        {tab !== "forgot" && (
          <div className="flex rounded-xl bg-obsidian-850 p-1 mb-5 border border-white/10 text-xs">
            <button
              onClick={() => {
                setTab("login");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 font-medium rounded-lg transition-all ${
                tab === "login"
                  ? "bg-gold-500 text-obsidian-950 font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Connexion
            </button>
            <button
              onClick={() => {
                setTab("register");
                setErrorMsg(null);
              }}
              className={`flex-1 py-2 font-medium rounded-lg transition-all ${
                tab === "register"
                  ? "bg-gold-500 text-obsidian-950 font-bold shadow-md"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              Créer un compte
            </button>
          </div>
        )}

        {/* Forms */}
        {tab === "login" && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-300">Mot de passe</label>
                <button
                  type="button"
                  onClick={() => setTab("forgot")}
                  className="text-xs text-gold-400 hover:underline"
                >
                  Oublié ?
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Connexion en cours..." : "Accéder à mon compte"}
            </button>
          </form>
        )}

        {tab === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Nom complet
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex : Marie Claire"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Numéro WhatsApp / Téléphone
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Ex : +237 6 00 00 00 00"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1">
                Adresse Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Mot de passe
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1">
                  Confirmation
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-9 pr-3 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm tracking-wide hover:shadow-lg hover:shadow-gold-500/25 transition-all disabled:opacity-50 mt-2"
            >
              {loading ? "Création du compte..." : "Valider mon Inscription"}
            </button>
          </form>
        )}

        {tab === "forgot" && (
          <form onSubmit={handleForgotPassword} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Votre email d'inscription
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@exemple.com"
                  className="w-full bg-obsidian-850 border border-gold-500/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-gold-400"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-amber-500 text-obsidian-950 font-bold text-sm hover:shadow-lg transition-all"
            >
              Envoyer le lien de réinitialisation
            </button>

            <button
              type="button"
              onClick={() => setTab("login")}
              className="w-full text-center text-xs text-zinc-400 hover:text-gold-400 pt-2"
            >
              ← Retour à la connexion
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}

