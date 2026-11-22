import { useEffect, useState } from 'react';
import Modal from './Modal';

export default function BoardFormModal({ open, onClose, onSubmit, initialBoard = null, busy = false }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setName(initialBoard?.name || '');
      setDescription(initialBoard?.description || '');
      setError('');
    }
  }, [open, initialBoard]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!name.trim()) return setError('Dê um nome ao quadro para continuar.');
    try {
      await onSubmit({ name: name.trim(), description: description.trim() });
      onClose();
    } catch (submitError) {
      setError(submitError.message || 'Não foi possível salvar o quadro.');
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={initialBoard ? 'Editar quadro' : 'Criar quadro'} description="Um espaço para reunir as tarefas de um projeto.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="field-label">Nome do quadro
          <input autoFocus maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex.: Redesign do site" className="field-control mt-1.5" />
        </label>
        <label className="field-label">Descrição <span className="font-normal text-[#9aa19b]">(opcional)</span>
          <textarea rows={3} maxLength={240} value={description} onChange={(event) => setDescription(event.target.value)} placeholder="O que este projeto pretende alcançar?" className="field-control mt-1.5 resize-none" />
        </label>
        {error && <p className="text-xs text-[#a14c43]">{error}</p>}
        <div className="flex justify-end gap-2 border-t border-line pt-4">
          <button type="button" onClick={onClose} className="btn-secondary">Cancelar</button>
          <button type="submit" disabled={busy} className="btn-primary">{busy ? 'Salvando...' : initialBoard ? 'Salvar alterações' : 'Criar quadro'}</button>
        </div>
      </form>
    </Modal>
  );
}
