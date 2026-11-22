import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import Modal from './Modal';

const emptyTask = { title: '', description: '', priority: 'medium', dueDate: '' };

export default function TaskModal({ open, onClose, onSubmit, onDelete, columnName, card = null, busy = false }) {
  const [form, setForm] = useState(emptyTask);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setForm(card ? {
        title: card.title || '',
        description: card.description || '',
        priority: card.priority || 'medium',
        dueDate: card.dueDate ? String(card.dueDate).slice(0, 10) : '',
      } : emptyTask);
      setError('');
    }
  }, [open, card]);

  const change = (field) => (event) => setForm((current) => ({ ...current, [field]: event.target.value }));
  const submit = async (event) => {
    event.preventDefault();
    if (!form.title.trim()) return setError('O cartão precisa de um título.');
    try {
      await onSubmit({ ...form, title: form.title.trim(), description: form.description.trim(), dueDate: form.dueDate || null });
      onClose();
    } catch (submitError) {
      setError(submitError.message || 'Não foi possível salvar o cartão.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={card ? 'Editar cartão' : 'Novo cartão'} description={card ? 'Atualize os detalhes desta tarefa.' : `A tarefa será adicionada em ${columnName || 'esta lista'}.`}>
      <form onSubmit={submit} className="space-y-4">
        <label className="field-label">Título
          <input autoFocus required maxLength={120} value={form.title} onChange={change('title')} placeholder="O que precisa ser feito?" className="field-control mt-1.5" />
        </label>
        <label className="field-label">Descrição <span className="font-normal text-[#9aa19b]">(opcional)</span>
          <textarea rows={4} maxLength={1500} value={form.description} onChange={change('description')} placeholder="Adicione contexto ou próximos passos..." className="field-control mt-1.5 resize-none" />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <label className="field-label">Prioridade
            <select value={form.priority} onChange={change('priority')} className="field-control mt-1.5">
              <option value="low">Baixa</option>
              <option value="medium">Média</option>
              <option value="high">Alta</option>
            </select>
          </label>
          <label className="field-label">Prazo
            <input type="date" value={form.dueDate} onChange={change('dueDate')} className="field-control mt-1.5" />
          </label>
        </div>
        {error && <p role="alert" className="text-xs text-[#a14c43]">{error}</p>}
        <div className="flex items-center justify-between border-t border-line pt-4">
          {card ? <button type="button" onClick={onDelete} disabled={busy} className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-medium text-[#9a5149] transition-colors hover:bg-[#fbf2f0] disabled:opacity-40"><Trash2 size={14} />Excluir cartão</button> : <span />}
          <div className="flex gap-2">
            <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
            <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Salvando...' : card ? 'Salvar alterações' : 'Adicionar cartão'}</button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
