import { Link } from "react-router-dom"

function TicketCard({ ticket }) {
  const statusStyles = {
    Open: "bg-emerald-50 text-emerald-700",
    "In Progress": "bg-amber-50 text-amber-700",
    Closed: "bg-slate-100 text-slate-600",
  }

  return (
    <Link to={`/tickets/${ticket.ticket_id}`}>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">

        <div className="flex items-start justify-between">

          <div>
            <p className="text-xs font-semibold text-slate-400">
              {ticket.ticket_id}
            </p>

            <h3 className="mt-1 text-base font-semibold text-slate-900">
              {ticket.subject}
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              {ticket.customer_name} · {ticket.customer_email}
            </p>
          </div>

          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[ticket.status]}`}
          >
            {ticket.status}
          </span>

        </div>

        <div className="mt-4 border-t border-slate-100 pt-3">
          <p className="text-xs text-slate-400">
            Created {ticket.created_at}
          </p>
        </div>

      </div>

    </Link>
  )
}

export default TicketCard