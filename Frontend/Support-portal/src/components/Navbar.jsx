import { Link } from "react-router-dom"
import datastrawLogo from "../assets/datastraw-logo.png"

function Navbar() {
  return (
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">

        <Link to="/">
          <img
            src={datastrawLogo}
            alt="Datastraw"
            className="h-8 w-auto"
          />
        </Link>

        <Link
          to="/create-ticket"
          className="rounded-lg bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
        >
          + New Ticket
        </Link>

      </div>
    </header>
  )
}

export default Navbar