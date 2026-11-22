import { useState } from 'react';
import { ArrowUpRight, MoreHorizontal, PanelsTopLeft } from 'lucide-react';

export default function BoardCard({ board, onOpen, onEdit, onDelete }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const updated = board.updatedAt ? new Date(board.updatedAt) : null;
  const updatedLabel = updated && !Number.isNaN(updated.getTime())
    ? updated.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })
    : 'Sem atualizações';

  return (
    <article className="group relative flex min-h-[162px] flex-col rounded-xl border border-line bg-white p-[18px] shadow-[0_1px_1px_rgba(25,35,26,0.02)] transition-all duration-150 hover:-translate-y-[2px] hover:border-[#d4ddd5] hover:shadow-panel">
      <button type="button" onClick={onOpen} aria-label={`Abrir quadro ${board.name}`} className="absolute inset-0 z-0 rounded-xl" />
      <div className="relative z-10 flex items-start justify-between">
        <span className="grid h-9 w-9 place-items-center rounded-[10px] bg-[#eef2ed] text-[#58715d]"><PanelsTopLeft size={17} strokeWidth={1.7} /></span>
        <div className="relative flex items-center gap-1">
          <button type="button" onClick={(event) => { event.stopPropagation(); onOpen(); }} aria-label="Abrir quadro" className="rounded-md p-1.5 text-[#a0a7a0] opacity-0 transition-all hover:bg-stone-100 hover:text-ink group-hover:opacity-100"><ArrowUpRight size={15} /></button>
          <div className="relative">
            <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen((open) => !open); }} aria-label="Opções do quadro" aria-expanded={menuOpen} className="rounded-md p-1.5 text-muted transition-colors hover:bg-stone-100"><MoreHorizontal size={17} /></button>
            {menuOpen && <>
              <button type="button" className="fixed inset-0 z-20 cursor-default" aria-label="Fechar opções" onClick={(event) => { event.stopPropagation(); setMenuOpen(false); }} />
              <div className="absolute right-0 top-full z-30 mt-1 w-36 rounded-lg border border-line bg-white p-1 shadow-panel">
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onEdit(); }} className="w-full rounded-md px-2.5 py-2 text-left text-xs text-ink hover:bg-stone-50">Editar nome</button>
                <button type="button" onClick={(event) => { event.stopPropagation(); setMenuOpen(false); onDelete(); }} className="w-full rounded-md px-2.5 py-2 text-left text-xs text-[#9a5149] hover:bg-[#fbf2f0]">Excluir quadro</button>
              </div>
            </>}
          </div>
        </div>
      </div>
      <div className="relative z-10 mt-5 pointer-events-none">
        <h3 className="truncate text-[14px] font-semibold tracking-[-0.02em] text-ink">{board.name}</h3>
        <p className="mt-1 line-clamp-2 min-h-[36px] text-xs leading-[18px] text-muted">{board.description || 'Sem descrição'}</p>
      </div>
      <div className="relative z-10 mt-auto flex items-center justify-between border-t border-[#f0f2ef] pt-3 text-[10px] text-[#8b938c] pointer-events-none">
        <span>Atualizado em {updatedLabel}</span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#9aaa9b]" />
      </div>
    </article>
  );
}
