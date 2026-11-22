import { useCallback, useEffect, useMemo, useState } from 'react';
import { FolderPlus, Plus, Search, RefreshCw, PanelsTopLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AppShell from '../components/AppShell';
import BoardCard from '../components/BoardCard';
import BoardFormModal from '../components/BoardFormModal';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { PageSkeleton } from '../components/Loading';
import { boardsService } from '../services/boards';
import { getErrorMessage } from '../lib/api';

export default function BoardsPage() {
  const navigate = useNavigate();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [search, setSearch] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editingBoard, setEditingBoard] = useState(null);
  const [deletingBoard, setDeletingBoard] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = 'success') => setToast({ message, type }), []);
  const loadBoards = useCallback(async () => {
    setLoading(true);
    setLoadError('');
    try {
      const result = await boardsService.list({ page: 1, limit: 50 });
      setBoards(Array.isArray(result.data) ? result.data : []);
    } catch (error) {
      setLoadError(getErrorMessage(error, 'Não foi possível carregar seus quadros.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadBoards(); }, [loadBoards]);

  const filteredBoards = useMemo(() => {
    const term = search.trim().toLocaleLowerCase('pt-BR');
    if (!term) return boards;
    return boards.filter((board) => `${board.name} ${board.description || ''}`.toLocaleLowerCase('pt-BR').includes(term));
  }, [boards, search]);

  const openCreate = () => { setEditingBoard(null); setFormOpen(true); };
  const openEdit = (board) => { setEditingBoard(board); setFormOpen(true); };

  const saveBoard = async (payload) => {
    setBusy(true);
    try {
      if (editingBoard) {
        const updated = await boardsService.update(editingBoard.id, payload);
        setBoards((current) => current.map((board) => board.id === editingBoard.id ? { ...board, ...updated, ...payload } : board));
        showToast('Quadro atualizado.');
      } else {
        const created = await boardsService.create(payload);
        setBoards((current) => [created, ...current]);
        showToast('Quadro criado.');
      }
    } catch (error) {
      throw new Error(getErrorMessage(error, 'Não foi possível salvar o quadro.'));
    } finally {
      setBusy(false);
    }
  };

  const confirmDelete = async () => {
    if (!deletingBoard) return;
    setBusy(true);
    try {
      await boardsService.remove(deletingBoard.id);
      setBoards((current) => current.filter((board) => board.id !== deletingBoard.id));
      setDeletingBoard(null);
      showToast('Quadro excluído.');
    } catch (error) {
      showToast(getErrorMessage(error, 'Não foi possível excluir o quadro.'), 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <AppShell>
      <div className="mx-auto max-w-[1320px] px-5 pb-12 pt-9 sm:px-8 sm:pt-11">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.11em] text-[#8b958c]">Workspace</p>
            <h1 className="text-[27px] font-semibold tracking-[-0.05em] text-ink sm:text-[30px]">Seus quadros</h1>
            <p className="mt-1.5 text-[13px] text-muted">Um lugar para cada projeto, do primeiro rascunho à entrega.</p>
          </div>
          <button type="button" onClick={openCreate} className="btn-primary self-start sm:self-auto"><Plus size={15} />Novo quadro</button>
        </div>

        <div className="mt-9 flex flex-col gap-3 border-b border-line pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-[12px] font-medium text-[#59635b]"><span className="grid h-6 w-6 place-items-center rounded-md bg-[#e9eee9] text-accent"><PanelsTopLeft size={13} /></span>Todos os quadros <span className="rounded-md bg-[#ecefeb] px-1.5 py-0.5 text-[10px] tabular-nums text-muted">{boards.length}</span></div>
          <div className="relative w-full sm:max-w-[240px]"><Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#99a19a]" /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Buscar quadros..." className="h-9 w-full rounded-lg border border-line bg-white pl-9 pr-3 text-xs text-ink outline-none transition-colors placeholder:text-[#a2aaa3] focus:border-[#aab9ac]" /></div>
        </div>

        {loading ? <PageSkeleton /> : loadError ? (
          <div className="mt-8 rounded-xl border border-[#eadbd7] bg-white px-6 py-10 text-center"><p className="text-sm font-medium text-ink">Não foi possível carregar os quadros</p><p className="mx-auto mt-2 max-w-md text-xs leading-5 text-muted">{loadError}</p><button type="button" onClick={loadBoards} className="btn-secondary mt-4"><RefreshCw size={13} />Tentar novamente</button></div>
        ) : filteredBoards.length > 0 ? (
          <div className="mt-5 grid gap-3.5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {filteredBoards.map((board) => <BoardCard key={board.id} board={board} onOpen={() => navigate(`/boards/${board.id}`)} onEdit={() => openEdit(board)} onDelete={() => setDeletingBoard(board)} />)}
          </div>
        ) : (
          <div className="mt-8 flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-[#dce2db] bg-white/55 px-6 text-center">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-[#edf2ed] text-[#647d68]"><FolderPlus size={20} strokeWidth={1.7} /></span>
            <h2 className="mt-4 text-[14px] font-semibold tracking-[-0.02em] text-ink">{search ? 'Nenhum quadro encontrado' : 'Seu espaço começa aqui'}</h2>
            <p className="mt-1.5 max-w-[300px] text-xs leading-5 text-muted">{search ? 'Tente buscar por outro nome ou descrição.' : 'Crie um quadro para organizar as tarefas do seu próximo projeto.'}</p>
            {!search && <button type="button" onClick={openCreate} className="btn-primary mt-5"><Plus size={14} />Criar primeiro quadro</button>}
          </div>
        )}
      </div>

      <BoardFormModal open={formOpen} onClose={() => setFormOpen(false)} onSubmit={saveBoard} initialBoard={editingBoard} busy={busy} />
      <Modal open={Boolean(deletingBoard)} onClose={() => setDeletingBoard(null)} title="Excluir quadro" description={`Tem certeza de que deseja excluir “${deletingBoard?.name || ''}”? Essa ação não poderá ser desfeita.`} size="sm">
        <div className="flex justify-end gap-2"><button type="button" onClick={() => setDeletingBoard(null)} className="btn-secondary">Cancelar</button><button type="button" onClick={confirmDelete} disabled={busy} className="btn-danger">{busy ? 'Excluindo...' : 'Excluir quadro'}</button></div>
      </Modal>
      <Toast toast={toast} onClose={() => setToast(null)} />
    </AppShell>
  );
}
