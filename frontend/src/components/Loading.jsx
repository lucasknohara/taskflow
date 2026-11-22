export function PageSkeleton() {
  return (
    <div className="animate-pulse space-y-6 p-7 sm:p-10">
      <div className="h-3 w-24 rounded bg-stone-200" />
      <div className="h-8 w-64 rounded bg-stone-200" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {[1, 2, 3].map((item) => <div key={item} className="h-40 rounded-xl border border-line bg-white p-5"><div className="h-4 w-2/3 rounded bg-stone-100" /><div className="mt-5 h-3 w-1/2 rounded bg-stone-100" /></div>)}
      </div>
    </div>
  );
}

export function BoardSkeleton() {
  return (
    <div className="flex gap-4 overflow-hidden px-7 py-6 sm:px-10">
      {[1, 2, 3].map((column) => (
        <div key={column} className="w-[286px] shrink-0 animate-pulse space-y-3">
          <div className="h-5 w-32 rounded bg-stone-200" />
          {[1, 2, 3].map((card) => <div key={card} className="h-28 rounded-xl border border-line bg-white" />)}
        </div>
      ))}
    </div>
  );
}
