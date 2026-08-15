function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <div>
          <h1 className="text-xl font-bold text-slate-900">
            Support CRM
          </h1>

          <p className="text-sm text-slate-500">
            Customer support management
          </p>
        </div>

        <button className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800">
          + New Ticket
        </button>

      </div>
    </header>
  )
}

export default Navbar