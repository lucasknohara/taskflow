import { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { ArrowLeft, Plus, RefreshCw, MoreHorizontal, PanelsTopLeft, Check, X } from 'lucide-react';
import AppShell from '../components/AppShell';
import Column from '../components/Column';
import TaskModal from '../components/TaskModal';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { BoardSkeleton } from '../components/Loading';
import { boardsService } from '../services/boards';
import { columnsService } from '../services/columns';
import { cardsService } from '../services/cards';
import { getErrorMessage } from '../lib/api';

function DragPreview({ card }) {
  if (!card) return null;
  return <div className="w-[274px] rotate-[1deg] rounded-[10px] border border-[#d2ddd3] bg-white px-3 py-3 shadow-[0_16px_40px_rgba(25,36,27,0.18)]"><p className="text-[12px] font-semibold text-ink">{card.title}</p>{card.description && <p className="mt-1.5 line-clamp-2 text-[10px] leading-4 text-muted">{card.description}</p>}</div>;
}

function InlineColumnForm({ onCreate, onCancel, busy }) {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const submit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return setError('Informe o nome da lista.');
    try { await onCreate(name.trim()); } catch (requestError) { setError(requestError.message); }
  };
  return (
    <form onSubmit={submit} className="w-[286px] shrink-0 rounded-xl border border-[#dce2db] bg-white p-3 shadow-panel">
      <input autoFocus maxLength={60} value={name} onChange={(event) => setName(event.target.value)} placeholder="Nome da lista" className="field-control" />
      {error && <p className="mt-2 text-[10px] text-[#a14c43]">{error}</p>}
      <div className="mt-2 flex items-center gap-2"><button type="submit" disabled={busy} className="btn-primary px-3 py-1.5 text-[11px]">{busy ? 'Criando...' : 'Adicionar lista'}</button><button type="button" onClick={onCancel} className="rounded-lg p-1.5 text-muted hover:bg-stone-100" aria-label="Cancelar"><X size={15} /></button></div>
    </form>
  );
}

export default function BoardPage() {
  const { boardId } = useParams();
  const navigate = useNavigate();
  const [board, setBoard] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [toast, setToast] = useState(null);
  const [newColumnOpen, setNewColumnOpen] = useState(false);
  const [columnBusy, setColumnBusy] = useState(false);
  const [deleteColumn, setDeleteColumn] = useState(null);
  const [taskModal, setTaskModal] = useState({ open: false, columnId: null, card: null });
  const [taskBusy, setTaskBusy] = useState(false);
  const [activeCard, setActiveCard] = useState(null);
  const [moving, setMoving] = useState(false);
  const [editingTitle, setEditingTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [savingTitle, setSavingTitle] = useState(false);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const loadBoard = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await boardsService.get(boardId);
      const normalized = { ...result, columns: (result.columns || []).map((column) => ({ ...column, cards: column.cards || [] })).sort((a, b) => a.position - b.position) };
      setBoard(normalized);
      setColumns(normalized.columns);
      setTitleDraft(normalized.name || '');
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Não foi possível abrir este quadro.'));
    } finally {
      setLoading(false);
    }
  }, [boardId]);

  useEffect(() => { loadBoard(); }, [loadBoard]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const totalCards = useMemo(() => columns.reduce((total, column) => total + column.cards.length, 0), [columns]);

  const handleCreateColumn = async (name) => {
    setColumnBusy(true);
    try {
      const created = await columnsService.create(boardId, { name });
      setColumns((current) => [...current, { ...created, cards: created.cards || [] }]);
      setNewColumnOpen(false);
      showToast('Lista criada.');
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível criar a lista.'));
    } finally {
      setColumnBusy(false);
    }
  };

  const handleEditColumn = async (columnId, payload) => {
    try {
      const updated = await columnsService.update(columnId, payload);
      setColumns((current) => current.map((column) => column.id === columnId ? { ...column, ...updated, ...payload } : column));
      showToast('Lista atualizada.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Não foi possível atualizar a lista.'), 'error');
      throw error;
    }
  };

  const handleDeleteColumn = async () => {
    if (!deleteColumn) return;
    try {
      await columnsService.remove(deleteColumn.id);
      setColumns((current) => current.filter((column) => column.id !== deleteColumn.id));
      showToast('Lista excluída.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Não foi possível excluir a lista. Verifique se ela está vazia.'), 'error');
    } finally {
      setDeleteColumn(null);
    }
  };

  const openCreateCard = (columnId) => setTaskModal({ open: true, columnId, card: null });
  const openEditCard = (card, columnId) => setTaskModal({ open: true, columnId, card });

  const saveCard = async (payload) => {
    setTaskBusy(true);
    try {
      if (taskModal.card) {
        const updated = await cardsService.update(taskModal.card.id, payload);
        setColumns((current) => current.map((column) => ({
          ...column,
          cards: column.cards.map((card) => card.id === taskModal.card.id ? { ...card, ...updated, ...payload } : card),
        })));
        showToast('Cartão atualizado.');
      } else {
        const created = await cardsService.create(taskModal.columnId, payload);
        setColumns((current) => current.map((column) => column.id === taskModal.columnId ? { ...column, cards: [...column.cards, created] } : column));
        showToast('Cartão criado.');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível salvar o cartão.'));
    } finally {
      setTaskBusy(false);
    }
  };

  const removeCard = async () => {
    if (!taskModal.card) return;
    setTaskBusy(true);
    try {
      await cardsService.remove(taskModal.card.id);
      setColumns((current) => current.map((column) => ({ ...column, cards: column.cards.filter((card) => card.id !== taskModal.card.id) })));
      setTaskModal({ open: false, columnId: null, card: null });
      showToast('Cartão excluído.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Não foi possível excluir o cartão.'), 'error');
    } finally {
      setTaskBusy(false);
    }
  };

  const handleDragStart = (event) => {
    const cardId = event.active.data.current?.cardId ?? event.active.id;
    const card = columns.flatMap((column) => column.cards).find((item) => String(item.id) === String(cardId));
    setActiveCard(card || null);
  };

  const handleDragCancel = () => setActiveCard(null);

  const handleDragEnd = async ({ active, over }) => {
    setActiveCard(null);
    if (!over || moving) return;

    const activeCardId = active.data.current?.cardId ?? active.id;
    const original = columns;
    const next = columns.map((column) => ({ ...column, cards: [...column.cards] }));
    const sourceColumn = next.find((column) => column.cards.some((card) => String(card.id) === String(activeCardId)));
    if (!sourceColumn) return;
    const sourceIndex = sourceColumn.cards.findIndex((card) => String(card.id) === String(activeCardId));

    let targetColumnId = over.data.current?.columnId;
    if (!targetColumnId && String(over.id).startsWith('column-')) targetColumnId = String(over.id).replace('column-', '');
    const overCardId = over.data.current?.cardId ?? over.id;
    if (String(overCardId) === String(activeCardId)) return;

    const targetColumn = targetColumnId
      ? next.find((column) => String(column.id) === String(targetColumnId))
      : next.find((column) => column.cards.some((item) => String(item.id) === String(overCardId)));
    if (!targetColumn) return;

    const sameColumn = String(sourceColumn.id) === String(targetColumn.id);
    const isColumnDrop = over.data.current?.type === 'column' || String(over.id).startsWith('column-');
    const overCardIndex = targetColumn.cards.findIndex((item) => String(item.id) === String(overCardId));
    const [card] = sourceColumn.cards.splice(sourceIndex, 1);
    let targetIndex = isColumnDrop || overCardIndex < 0 ? targetColumn.cards.length : overCardIndex;
    targetIndex = Math.max(0, Math.min(targetIndex, targetColumn.cards.length));
    targetColumn.cards.splice(targetIndex, 0, card);

    if (sameColumn && sourceIndex === targetIndex) return;
    setColumns(next);
    setMoving(true);
    try {
      await cardsService.move(card.id, targetColumn.id, targetIndex);
    } catch (error) {
      setColumns(original);
      showToast(getErrorMessage(error, 'Não foi possível mover o cartão. A posição anterior foi restaurada.'), 'error');
    } finally {
      setMoving(false);
    }
  };

  const saveBoardTitle = async () => {
    if (!titleDraft.trim() || titleDraft.trim() === board.name) {
      setTitleDraft(board.name);
      setEditingTitle(false);
      return;
    }
    setSavingTitle(true);
    try {
      const updated = await boardsService.update(boardId, { name: titleDraft.trim() });
      setBoard((current) => ({ ...current, ...updated, name: updated.name || titleDraft.trim() }));
      setTitleDraft(updated.name || titleDraft.trim());
      setEditingTitle(false);
      showToast('Nome do quadro atualizado.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Não foi possível atualizar o quadro.'), 'error');
    } finally {
      setSavingTitle(false);
    }
  };

  return (
    <AppShell>
      {loading ? <BoardSkeleton /> : loadError ? (
        <div className="mx-auto max-w-[620px] px-6 py-24 text-center"><p className="text-sm font-semibold text-ink">Não foi possível abrir o quadro</p><p className="mt-2 text-xs leading-5 text-muted">{loadError}</p><div className="mt-5 flex justify-center gap-2"><button type="button" onClick={() => navigate('/boards')} className="btn-secondary"><ArrowLeft size={14} />Voltar</button><button type="button" onClick={loadBoard} className="btn-primary"><RefreshCw size={13} />Tentar novamente</button></div></div>
      ) : (
        <>
          <div className="border-b border-line bg-white px-5 pb-5 pt-7 sm:px-8 sm:pt-8">
            <div className="mx-auto max-w-[1500px]">
              <button type="button" onClick={() => navigate('/boards')} className="mb-5 inline-flex items-center gap-1.5 text-[11px] font-medium text-[#89938b] transition-colors hover:text-ink"><ArrowLeft size={13} />Todos os quadros</button>
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-[10px] font-medium uppercase tracking-[0.12em] text-[#919b92]"><PanelsTopLeft size={12} />Quadro</div>
                  {editingTitle ? (
                    <div className="mt-2 flex max-w-[600px] items-center gap-2"><input value={titleDraft} onChange={(event) => setTitleDraft(event.target.value)} onKeyDown={(event) => { if (event.key === 'Enter') saveBoardTitle(); if (event.key === 'Escape') { setTitleDraft(board.name); setEditingTitle(false); } }} autoFocus className="min-w-0 flex-1 border-b border-[#9fb2a1] bg-transparent py-1 text-[25px] font-semibold tracking-[-0.05em] text-ink outline-none" /><button type="button" onClick={saveBoardTitle} disabled={savingTitle} className="rounded-md p-1.5 text-accent hover:bg-accent-soft" aria-label="Salvar nome"><Check size={16} /></button><button type="button" onClick={() => { setTitleDraft(board.name); setEditingTitle(false); }} className="rounded-md p-1.5 text-muted hover:bg-stone-100" aria-label="Cancelar"><X size={16} /></button></div>
                  ) : <button type="button" onClick={() => setEditingTitle(true)} className="mt-1 block max-w-full truncate text-left text-[25px] font-semibold tracking-[-0.05em] text-ink transition-colors hover:text-[#526b57] sm:text-[28px]">{board.name}</button>}
                  {board.description && <p className="mt-1.5 max-w-[620px] text-[12px] leading-5 text-muted">{board.description}</p>}
                </div>
                <div className="flex items-center gap-3 text-[10px] text-[#929b93]"><span>{columns.length} {columns.length === 1 ? 'lista' : 'listas'}</span><span className="h-1 w-1 rounded-full bg-[#c5ccc5]" /><span>{totalCards} {totalCards === 1 ? 'cartão' : 'cartões'}</span><button type="button" onClick={() => setNewColumnOpen(true)} className="btn-primary ml-1"><Plus size={14} />Nova lista</button></div>
              </div>
            </div>
          </div>

          <div className="min-h-[calc(100vh-220px)] overflow-x-auto">
            <div className="mx-auto flex min-h-[calc(100vh-220px)] max-w-[1500px] items-start gap-3.5 px-5 py-7 sm:px-8">
              <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragCancel={handleDragCancel} onDragEnd={handleDragEnd}>
                {columns.map((column) => <Column key={column.id} column={column} onAddCard={openCreateCard} onEditColumn={handleEditColumn} onDeleteColumn={setDeleteColumn} onOpenCard={openEditCard} disabledActions={moving} />)}
                <DragOverlay dropAnimation={{ duration: 160, easing: 'ease' }}><DragPreview card={activeCard} /></DragOverlay>
              </DndContext>
              {newColumnOpen ? <InlineColumnForm onCreate={handleCreateColumn} onCancel={() => setNewColumnOpen(false)} busy={columnBusy} /> : <button type="button" onClick={() => setNewColumnOpen(true)} className="flex h-[42px] w-[286px] shrink-0 items-center gap-2 rounded-xl border border-dashed border-[#d9dfd8] px-3.5 text-left text-xs font-medium text-[#859087] transition-all duration-150 hover:border-[#b7c7b9] hover:bg-white hover:text-ink"><Plus size={15} />Adicionar outra lista</button>}
            </div>
          </div>
        </>
      )}

      <TaskModal open={taskModal.open} onClose={() => setTaskModal({ open: false, columnId: null, card: null })} onSubmit={saveCard} onDelete={removeCard} columnName={columns.find((column) => column.id === taskModal.columnId)?.name} card={taskModal.card} busy={taskBusy} />
      <Modal open={Boolean(deleteColumn)} onClose={() => setDeleteColumn(null)} title="Excluir lista" description={`Deseja excluir “${deleteColumn?.name || ''}”? A lista precisa estar vazia para ser removida.`} size="sm">
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setDeleteColumn(null)} className="btn-secondary">Cancelar</button><button type="button" onClick={handleDeleteColumn} className="btn-danger">Excluir lista</button></div>
      </Modal>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppShell>
  );
}
