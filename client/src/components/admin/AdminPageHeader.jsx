
function AdminPageHeader({
  eyebrow = "Eventix administration",
  title,
  description,
  actions,
}) {
  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-600">
          {eyebrow}
        </p>

        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">
          {title}
        </h1>

        {description && (
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {description}
          </p>
        )}
      </div>

      {actions && (
        <div className="flex shrink-0 flex-wrap items-center gap-3">
          {actions}
        </div>
      )}
    </header>
  );
}

export default AdminPageHeader;
