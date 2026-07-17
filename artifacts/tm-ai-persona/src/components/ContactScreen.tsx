import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Send, CheckCircle2, ChevronDown } from 'lucide-react';

const PURPOSE_OPTIONS = [
  'Suggestion',
  'Complaint',
  'Technical Issue',
  'General Inquiry',
  'Collaboration / Partnership',
  'Others',
];

export default function ContactScreen({ onBack }: { onBack: () => void }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [purpose, setPurpose] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [selectOpen, setSelectOpen] = useState(false);

  const canSubmit = name.trim() && email.trim() && purpose && message.trim();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    // Build mailto link
    const subject = encodeURIComponent(`[AiNspire] ${purpose} – from ${name}`);
    const body = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\nPurpose: ${purpose}\n\n${message}`
    );
    window.open(`mailto:ctsoo@tm.com.my?subject=${subject}&body=${body}`, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="w-full max-w-5xl px-6 py-10 flex flex-col items-center">

      {/* Back button */}
      <motion.button
        onClick={onBack}
        initial={{ opacity: 0, x: -12 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="self-start flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Main Page
      </motion.button>

      {/* Page Header */}
      <motion.div
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <p className="text-[10px] font-bold tracking-[0.22em] text-muted-foreground uppercase mb-3">
          // JOIN THE MOVEMENT. LEAD THE AI ERA.
        </p>
        <h1 className="text-5xl md:text-6xl font-bold tracking-tight">
          <span className="text-white">Contact </span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-[#00B4D8] to-secondary drop-shadow-[0_0_30px_rgba(0,212,255,0.35)]">
            Us
          </span>
        </h1>
        <p className="mt-4 text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
          Whether you have a suggestion, a concern, or want to collaborate — we want to hear from you.
        </p>
      </motion.div>

      <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-6 items-start">

        {/* ─── Form Panel ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="md:col-span-3 rounded-2xl border border-card-border/60 bg-card/40 backdrop-blur-sm p-7"
        >
          {/* Section label */}
          <p className="text-[10px] font-bold tracking-[0.2em] text-primary uppercase mb-1">// AINSPIRE</p>
          <h2 className="text-2xl font-bold text-foreground mb-6">Talk to us</h2>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center gap-4 py-12 text-center"
            >
              <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground">Message Sent!</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Your default mail app has opened with your message pre-filled. We'll get back to you shortly.
              </p>
              <button
                onClick={onBack}
                className="mt-2 px-6 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-semibold hover:opacity-90 transition-opacity"
              >
                Back to Main Page
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your full name"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-card-border/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Your Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@tm.com.my"
                  required
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-card-border/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                />
              </div>

              {/* Purpose dropdown */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Purpose of Message</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setSelectOpen((o) => !o)}
                    className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-background/60 border border-card-border/80 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all"
                    style={{ color: purpose ? 'var(--foreground)' : 'rgba(var(--muted-foreground-rgb, 148 163 184) / 0.5)' }}
                  >
                    <span className={purpose ? 'text-foreground' : 'text-muted-foreground/50'}>
                      {purpose || 'Select the purpose of your message'}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform duration-200 ${selectOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {selectOpen && (
                    <motion.ul
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15 }}
                      className="absolute z-20 mt-1 w-full rounded-xl bg-[#0f1f35] border border-card-border/80 shadow-xl overflow-hidden"
                    >
                      {PURPOSE_OPTIONS.map((opt) => (
                        <li
                          key={opt}
                          onClick={() => { setPurpose(opt); setSelectOpen(false); }}
                          className={`px-4 py-3 text-sm cursor-pointer transition-colors hover:bg-primary/10 hover:text-primary ${
                            purpose === opt ? 'text-primary bg-primary/5' : 'text-foreground'
                          }`}
                        >
                          {opt}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Message</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write your message here…"
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl bg-background/60 border border-card-border/80 text-foreground placeholder:text-muted-foreground/50 text-sm focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all resize-none leading-relaxed"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={!canSubmit}
                className="group mt-1 w-full flex items-center justify-center gap-3 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm overflow-hidden relative transition-all hover:shadow-[0_0_40px_rgba(0,212,255,0.4)] disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              >
                <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out rounded-xl" />
                <Send className="relative w-4 h-4" />
                <span className="relative">Send Message</span>
              </button>
            </form>
          )}
        </motion.div>

        {/* ─── Contact Info Panel ─── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.28 }}
          className="md:col-span-2 flex flex-col gap-4"
        >
          {/* Email card */}
          <div className="flex items-start gap-4 p-5 rounded-2xl border border-primary/25 bg-primary/5 backdrop-blur-sm">
            <div className="w-12 h-12 shrink-0 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-1">Email Us</p>
              <a
                href="mailto:ctsoo@tm.com.my"
                className="text-sm font-semibold text-foreground hover:text-primary transition-colors break-all"
              >
                ctsoo@tm.com.my
              </a>
              <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                We typically respond within 1–2 business days.
              </p>
            </div>
          </div>

          {/* Info card */}
          <div className="p-5 rounded-2xl border border-card-border/60 bg-card/40 backdrop-blur-sm">
            <p className="text-xs font-bold tracking-wider text-muted-foreground uppercase mb-3">Purpose Guide</p>
            <ul className="flex flex-col gap-2.5">
              {[
                { label: 'Suggestion', desc: 'Ideas to improve AiNspire' },
                { label: 'Complaint', desc: 'Report a concern or issue' },
                { label: 'Technical Issue', desc: 'App bugs or errors' },
                { label: 'General Inquiry', desc: 'Questions about the platform' },
                { label: 'Collaboration', desc: 'Partner with our team' },
                { label: 'Others', desc: 'Anything else on your mind' },
              ].map((item) => (
                <li key={item.label} className="flex items-start gap-2">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-primary/60 shrink-0" />
                  <span className="text-xs text-muted-foreground">
                    <span className="font-semibold text-foreground/80">{item.label}</span>
                    {' — '}
                    {item.desc}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Back button (secondary) */}
          <button
            onClick={onBack}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl border border-card-border/60 bg-card/30 hover:border-primary/30 hover:bg-card/50 transition-all text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Main Page
          </button>
        </motion.div>

      </div>
    </div>
  );
}
