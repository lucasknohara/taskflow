import { Link } from 'react-router-dom';
import Brand from './Brand';

export default function AuthFrame({ title, subtitle, children, footer, note }) {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f7f8f6] px-5 py-12">
      <div className="absolute left-0 top-0 hidden h-full w-[36%] border-r border-[#e9ece7] bg-[#f1f4f0] lg:block" />
      <div className="absolute left-[8%] top-[13%] hidden w-[250px] lg:block">
        <Brand />
        <div className="mt-16 max-w-[260px]">
          <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-[#859187]">Menos ruído. Mais clareza.</p>
          <h2 className="mt-4 text-[31px] font-semibold leading-[1.13] tracking-[-0.055em] text-[#2b352d]">O trabalho flui melhor quando tudo encontra seu lugar.</h2>
          <p className="mt-4 text-[13px] leading-6 text-[#778078]">Organize projetos, acompanhe o progresso e mantenha o foco no que vem a seguir.</p>
        </div>
        <div className="absolute left-0 top-[420px] flex items-center gap-2 text-[10px] text-[#8e988f]"><span className="h-px w-7 bg-[#b7c3b8]" /> Um espaço de cada vez.</div>
      </div>

      <div className="relative z-10 w-full max-w-[400px] lg:ml-[25%]">
        <div className="mb-9 flex items-center justify-between lg:hidden"><Brand /><span className="text-[10px] text-muted">Seu espaço de trabalho</span></div>
        <div className="rounded-2xl border border-[#e7eae6] bg-white p-7 shadow-[0_10px_40px_rgba(27,36,28,0.055)] sm:p-8">
          <h1 className="text-[23px] font-semibold tracking-[-0.045em] text-ink">{title}</h1>
          <p className="mt-1.5 text-[13px] leading-5 text-muted">{subtitle}</p>
          <div className="mt-7">{children}</div>
          {footer && <div className="mt-6 border-t border-[#eef0ed] pt-5 text-center text-[12px] text-muted">{footer}</div>}
        </div>
        {note && <p className="mt-5 text-center text-[10px] leading-5 text-[#9aa19b]">{note}</p>}
        <div className="mt-8 text-center text-[10px] text-[#a1a8a2]"><Link to="/login" className="hover:text-muted">Taskflow</Link> <span className="mx-1.5">·</span> Organize seu trabalho com clareza</div>
      </div>
    </div>
  );
}
