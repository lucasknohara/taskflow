import { useEffect } from 'react';
import { CheckCircle2, CircleAlert, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(onClose, 3800);
    return () => window.clearTimeout(timer);
  }, [toast, onClose]);
  if (!toast) return null;
  const success = toast.type === 'success';
  const Icon = success ? CheckCircle2 : CircleAlert;
  return (
    <div className="toast-enter fixed bottom-5 right-5 z-[70] flex max-w-[calc(100vw-40px)] items-start gap-3 rounded-xl border border-line bg-white px-4 py-3.5 shadow-panel">
      <Icon size={18} className={success ? 'mt-0.5 text-accent' : 'mt-0.5 text-amber-600'} />
      <p className="max-w-sm text-sm leading-5 text-ink">{toast.message}</p>
      <button type="button" onClick={onClose} aria-label="Fechar aviso" className="ml-2 text-muted hover:text-ink"><X size={16} /></button>
    </div>
  );
}
