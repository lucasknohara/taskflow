import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { CalendarDays, GripVertical } from 'lucide-react';

const priorityLabels = { low: 'Baixa', medium: 'Média', high: 'Alta' };

export default function SortableTaskCard({ card, columnId, onClick }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: String(card.id),
    data: { type: 'card', cardId: card.id, columnId },
  });
  const style = { transform: CSS.Transform.toString(transform), transition };
  const dueDate = card.dueDate ? new Date(`${card.dueDate}T00:00:00`) : null;

  return (
    <article ref={setNodeRef} style={style} className={`task-card group relative rounded-[10px] border border-[#e6e9e5] bg-white px-3 py-3 shadow-[0_1px_1px_rgba(28,38,29,0.025)] transition-all duration-150 hover:-translate-y-[1px] hover:border-[#d3dcd4] hover:shadow-[0_5px_14px_rgba(26,38,28,0.06)] ${isDragging ? 'z-40 opacity-35 shadow-none' : ''}`}>
      <div className="flex items-start gap-1.5">
        <button type="button" {...attributes} {...listeners} aria-label={`Arrastar ${card.title}`} className="-ml-1 mt-0.5 cursor-grab rounded p-0.5 text-[#c2c9c2] opacity-0 transition-opacity hover:text-muted active:cursor-grabbing group-hover:opacity-100 focus:opacity-100"><GripVertical size={14} /></button>
        <button type="button" onClick={onClick} className="min-w-0 flex-1 text-left">
          <span className="block text-[12px] font-medium leading-[18px] tracking-[-0.01em] text-[#303832]">{card.title}</span>
          {card.description && <span className="mt-1.5 line-clamp-2 block text-[10.5px] leading-[16px] text-[#8a938b]">{card.description}</span>}
        </button>
      </div>
      <div className="mt-3 flex items-center justify-between gap-2 pl-4">
        <span className={`inline-flex items-center gap-1.5 text-[9px] font-medium ${card.priority === 'high' ? 'text-[#a65e4c]' : card.priority === 'medium' ? 'text-[#9a794c]' : 'text-[#78867b]'}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${card.priority === 'high' ? 'bg-[#bd7864]' : card.priority === 'medium' ? 'bg-[#c6a06b]' : 'bg-[#9aa99a]'}`} />
          {priorityLabels[card.priority] || 'Normal'}
        </span>
        {dueDate && !Number.isNaN(dueDate.getTime()) && <span className="inline-flex items-center gap-1 text-[9px] text-[#929b93]"><CalendarDays size={11} />{dueDate.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</span>}
      </div>
    </article>
  );
}
