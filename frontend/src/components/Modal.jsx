import { useEffect } from 'react';
import { X } from 'lucide-react';

export default function Modal({ open, onClose, title, description, children, size = 'md' }) {
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#172019]/35 p-4 backdrop-blur-[2px]" onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}>
      <section role="dialog" aria-modal="true" aria-label={title} className={`modal-enter relative my-auto w-full ${size === 'sm' ? 'max-w-[400px]' : 'max-w-[520px]'} rounded-2xl border border-white/70 bg-white p-6 shadow-modal sm:p-7`}>
        <button type="button" onClick={onClose} aria-label="Fechar" className="absolute right-5 top-5 rounded-lg p-1.5 text-muted transition-colors hover:bg-stone-100 hover:text-ink"><X size={18} /></button>
        <div className="mb-6 pr-8">
          <h2 className="text-[19px] font-semibold tracking-[-0.035em] text-ink">{title}</h2>
          {description && <p className="mt-1.5 text-sm leading-6 text-muted">{description}</p>}
        </div>
        {children}
      </section>
    </div>
  );
}
