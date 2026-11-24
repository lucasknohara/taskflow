import { useMemo, useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus, Trash2, Check, X } from 'lucide-react';
import SortableTaskCard from './SortableTaskCard';

export default function Column({ column, onAddCard, onEditColumn, onDeleteColumn, onOpenCard, disabledActions = false }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(column.name);
  const ids = useMemo(() => column.cards.map((card) => String(card.id)), [column.cards]);
  const { setNodeRef, isOver } = useDroppable({ id: `column-${column.id}`, data: { type: 'column', columnId: column.id } });

  const saveName = async () => {
    if (!name.trim() || name.trim() === column.name) {
      setName(column.name);
      setEditing(false);
      return;
    }
    try {
      await onEditColumn(column.id, { name: name.trim() });
      setEditing(false);
    } catch {
      setName(column.name);
    }
  };

  return (
    <section className="flex w-[286px] shrink-0 flex-col" aria-label={`Lista ${column.name}`}>
      <div className="mb-3 flex h-8 items-center gap-2 px-0.5">
        <span className={`h-2 w-2 shrink-0 rounded-full ${column.name.toLowerCase().includes('feito') || column.name.toLowerCase().includes('conclu') ? 'bg-[#75957a]' : column.name.toLowerCase().includes('andamento') ? 'bg-[#c39355]' : 'bg-[#a8b0a9]'}`} />
        {editing ? (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            <input value={name} onChange={(event) => setName(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveName(); if (event.key === 'Escape') { setName(column.name); setEditing(false); } }} autoFocus className="min-w-0 flex-1 rounded border border-[#cbd5cc] bg-white px-1.5 py-1 text-xs font-semibold outline-none focus:border-accent" />
            <button type="button" onClick={saveName} className="rounded p-1 text-accent hover:bg-accent-soft" aria-label="Salvar nome"><Check size={13} /></button>
            <button type="button" onClick={() => { setName(column.name); setEditing(false); }} className="rounded p-1 text-muted hover:bg-stone-200" aria-label="Cancelar"><X size={13} /></button>
          </div>
        ) : (
          <>
            <h2 className="truncate text-[12px] font-semibold tracking-[0.01em] text-[#414a43]">{column.name}</h2>
            <span className="rounded-md bg-[#e9ece8] px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-[#737c74]">{column.cards.length}</span>
          </>
        )}
        {!editing && <div className="relative ml-auto flex items-center">
          <button type="button" disabled={disabledActions} onClick={() => onAddCard(column.id)} aria-label={`Adicionar cartão em ${column.name}`} className="rounded-md p-1 text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-40"><Plus size={15} /></button>
          <button type="button" disabled={disabledActions} onClick={() => setMenuOpen((open) => !open)} aria-label={`Opções de ${column.name}`} className="rounded-md p-1 text-muted transition-colors hover:bg-white hover:text-ink disabled:opacity-40"><MoreHorizontal size={16} /></button>
          {menuOpen && <>
            <button type="button" className="fixed inset-0 z-20 cursor-default" aria-label="Fechar opções" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-8 z-30 w-40 rounded-lg border border-line bg-white p-1 shadow-panel">
              <button type="button" onClick={() => { setEditing(true); setMenuOpen(false); }} className="w-full rounded-md px-2.5 py-2 text-left text-xs hover:bg-stone-50">Renomear lista</button>
              <button type="button" onClick={() => { setMenuOpen(false); onDeleteColumn(column); }} className="flex w-full items-center gap-2 rounded-md px-2.5 py-2 text-left text-xs text-[#9a5149] hover:bg-[#fbf2f0]"><Trash2 size={13} />Excluir lista</button>
            </div>
          </>}
        </div>}
      </div>

      <div ref={setNodeRef} className={`min-h-[170px] flex-1 rounded-xl px-1.5 pb-2 pt-1 transition-colors duration-150 ${isOver ? 'bg-[#e9efe9] ring-1 ring-inset ring-[#ccd9cd]' : 'bg-[#eff1ee]/75'}`}>
        <SortableContext items={ids} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {column.cards.map((card) => <SortableTaskCard key={card.id} card={card} columnId={column.id} onClick={() => onOpenCard(card, column.id)} disabled={disabledActions} />)}
          </div>
        </SortableContext>
        {column.cards.length === 0 && <div className={`grid min-h-[150px] place-items-center rounded-lg border border-dashed text-center transition-colors ${isOver ? 'border-[#9bb39e] text-accent' : 'border-[#dce1db] text-[#a0a8a0]'}`}><span className="text-[11px]">Solte um cartão aqui</span></div>}
        <button type="button" disabled={disabledActions} onClick={() => onAddCard(column.id)} className="mt-2 flex w-full items-center gap-2 rounded-lg px-2.5 py-2 text-left text-[11px] font-medium text-[#8b948c] transition-colors hover:bg-white hover:text-ink disabled:opacity-40"><Plus size={14} />Adicionar cartão</button>
      </div>
    </section>
  );
}
