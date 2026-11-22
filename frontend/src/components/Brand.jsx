import { CheckCheck } from 'lucide-react';

export default function Brand({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={`grid h-8 w-8 place-items-center rounded-[10px] ${light ? 'bg-white/10 text-white' : 'bg-ink text-white'}`}>
        <CheckCheck size={17} strokeWidth={2.25} />
      </span>
      {!compact && <span className={`text-[15px] font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-ink'}`}>taskflow</span>}
    </div>
  );
}
