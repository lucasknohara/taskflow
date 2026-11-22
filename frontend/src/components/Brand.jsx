export default function Brand({ compact = false, light = false }) {
  return (
    <div className="flex items-center gap-2.5">
      <span
        className={`grid h-8 w-8 shrink-0 place-items-center rounded-[10px] ${light ? 'bg-white/10' : 'bg-ink'}`}
      >
        <img
          src="/taskflow-symbol.svg"
          alt={compact ? 'Taskflow' : ''}
          aria-hidden={!compact}
          draggable="false"
          className="h-[23px] w-[23px] object-contain"
        />
      </span>
      {!compact && (
        <span className={`text-[15px] font-semibold tracking-[-0.04em] ${light ? 'text-white' : 'text-ink'}`}>
          taskflow
        </span>
      )}
    </div>
  );
}
