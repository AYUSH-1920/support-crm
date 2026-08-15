import { useEffect, useState } from "react"
import { useParams, useNavigate, Link } from "react-router-dom"

function TicketDetail() {

  const { ticket_id } = useParams()
  const navigate = useNavigate()

  const [ticket, setTicket] = useState(null)
  const [status, setStatus] = useState("")
  const [noteText, setNoteText] = useState("")
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState("")

  const [confirmModal, setConfirmModal] = useState(null)
  // confirmModal will hold: { title, description, confirmLabel, onConfirm } or null

  const loadTicket = () => {
    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticket_id}`)
      .then((response) => response.json())
      .then((data) => {
        setTicket(data)
        setStatus(data.status)
      })
      .catch((error) => {
        console.error("Error fetching ticket:", error)
      })
  }

  useEffect(() => {
    loadTicket()
  }, [ticket_id])

  const performUpdate = () => {

    setSaving(true)
    setMessage("")
    setConfirmModal(null)

    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticket_id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        status,
        notes: noteText.trim() !== "" ? noteText.trim() : undefined
      })
    })
      .then((response) => response.json())
      .then(() => {
        setMessage("Ticket updated successfully!")

        setTimeout(() => {
          navigate("/")
        }, 1200)
      })
      .catch((error) => {
        console.error("Error updating ticket:", error)
        setMessage("Error updating ticket. Please try again.")
        setSaving(false)
      })
  }

  const handleUpdate = () => {

    if (status === "Closed") {
      setConfirmModal({
        title: "Close this ticket?",
        description: "Once closed, this ticket can no longer be edited.",
        confirmLabel: "Close Ticket",
        onConfirm: performUpdate
      })
      return
    }

    performUpdate()
  }

  const performDelete = () => {

    setConfirmModal(null)

    fetch(`${import.meta.env.VITE_API_URL}/api/tickets/${ticket_id}`, {
      method: "DELETE"
    })
      .then((response) => response.json())
      .then(() => {
        navigate("/")
      })
      .catch((error) => {
        console.error("Error deleting ticket:", error)
      })
  }

  const handleDelete = () => {
    setConfirmModal({
      title: "Delete this ticket?",
      description: "This action cannot be undone.",
      confirmLabel: "Delete Ticket",
      onConfirm: performDelete
    })
  }

  if (!ticket) {
    return (
      <div className="mx-auto max-w-3xl px-6 py-8">
        <p className="text-sm text-slate-500">Loading ticket...</p>
      </div>
    )
  }

  const isClosed = ticket.status === "Closed"

  return (
    <div className="min-h-screen bg-slate-50">

      <main className="mx-auto max-w-3xl px-6 py-8">

        <Link to="/" className="text-sm text-slate-500 hover:text-slate-700">
          ← Back to tickets
        </Link>

        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-xs font-semibold text-slate-400">
            {ticket.ticket_id}
          </p>

          <h2 className="mt-1 text-xl font-bold text-slate-900">
            {ticket.subject}
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            {ticket.customer_name} · {ticket.customer_email}
          </p>

          <p className="mt-4 text-sm text-slate-700">
            {ticket.description}
          </p>

          {isClosed ? (

            <div className="mt-6 border-t border-slate-100 pt-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                <p className="text-sm font-medium text-slate-600">
                  This ticket is closed and can no longer be updated.
                </p>
              </div>
            </div>

          ) : (

            <>
              <div className="mt-6 border-t border-slate-100 pt-4">

                <label className="text-xs font-semibold text-slate-500">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(event) => setStatus(event.target.value)}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
                >
                  <option value="Open">Open</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Closed">Closed</option>
                </select>

              </div>

              <div className="mt-4">

                <label className="text-xs font-semibold text-slate-500">
                  Add a note
                </label>

                <textarea
                  value={noteText}
                  onChange={(event) => setNoteText(event.target.value)}
                  rows={3}
                  className="mt-1 block w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 outline-none focus:border-slate-400"
                  placeholder="Write a note..."
                />

              </div>

              {message && (
                <p className={`mt-3 text-sm ${message.includes("successfully") ? "text-emerald-600" : "text-red-600"}`}>
                  {message}
                </p>
              )}

              <button
                onClick={handleUpdate}
                disabled={saving}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
              >
                {saving ? "Saving..." : "Update Ticket"}
              </button>
            </>

          )}

          <button
            onClick={handleDelete}
            className="mt-4 ml-3 rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-100"
          >
            Delete Ticket
          </button>

        </div>

        <div className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-sm font-semibold text-slate-900">
            Notes
          </h3>

          {ticket.notes.length === 0 ? (
            <p className="mt-2 text-sm text-slate-400">
              No notes yet.
            </p>
          ) : (
            <ul className="mt-3 space-y-3">
              {ticket.notes.map((note, index) => (
                <li key={index} className="border-t border-slate-100 pt-3 first:border-t-0 first:pt-0">
                  <p className="text-sm text-slate-700">{note.note_text}</p>
                  <p className="mt-1 text-xs text-slate-400">{note.created_at}</p>
                </li>
              ))}
            </ul>
          )}

        </div>

      </main>

      {confirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg">

            <h3 className="text-base font-semibold text-slate-900">
              {confirmModal.title}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {confirmModal.description}
            </p>

            <div className="mt-6 flex justify-end gap-3">

              <button
                onClick={() => setConfirmModal(null)}
                className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>

              <button
                onClick={confirmModal.onConfirm}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {confirmModal.confirmLabel}
              </button>

            </div>

          </div>
        </div>
      )}

    </div>
  )
}

export default TicketDetail