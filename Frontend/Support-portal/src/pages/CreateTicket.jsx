import { useState } from "react"
import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"


function CreateTicket() {

  const navigate = useNavigate()

  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [subject, setSubject] = useState("")
  const [description, setDescription] = useState("")

  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)


  const handleSubmit = async (event) => {

    event.preventDefault()

    setLoading(true)
    setMessage("")


    try {

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/tickets`, {

        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          customer_name: customerName,
          customer_email: customerEmail,
          subject: subject,
          description: description
        })

      })


      const data = await response.json()


      if (!response.ok) {
        throw new Error(data.message || "Failed to create ticket")
      }


      console.log("Ticket created:", data)

      setMessage(`Ticket ${data.ticket_id} created successfully!`)

      setTimeout(() => {
        navigate("/")
      }, 1500)


    } catch (error) {

      console.error("Error creating ticket:", error)

      setMessage("Error creating ticket. Please try again.")

      setLoading(false)

    }
  }


  return (
    <div className="min-h-screen bg-black">

      <Navbar />


      <main className="mx-auto max-w-4xl px-6 py-10">

        {/* Heading */}

        <div className="mb-8">

          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-red-500">
            Support Desk
          </p>

          <h2 className="text-3xl font-bold text-white">
            Create New Ticket
          </h2>

          <p className="mt-2 text-sm text-zinc-400">
            Enter the details below to create a support request.
          </p>

        </div>


        {/* Form Card */}

        <div className="border border-zinc-800 bg-zinc-950 p-7">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >


            {/* Customer Name */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Customer Name
              </label>

              <input
                type="text"
                value={customerName}
                onChange={(event) => setCustomerName(event.target.value)}
                placeholder="e.g. John Smith"
                required
                className="w-full border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
              />

            </div>


            {/* Customer Email */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Customer Email
              </label>

              <input
                type="email"
                value={customerEmail}
                onChange={(event) => setCustomerEmail(event.target.value)}
                placeholder="e.g. john@gmail.com"
                required
                className="w-full border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
              />

            </div>


            {/* Issue Title */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Issue Title
              </label>

              <input
                type="text"
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Briefly describe the issue"
                required
                className="w-full border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
              />

            </div>


            {/* Description */}

            <div>

              <label className="mb-2 block text-sm font-medium text-zinc-300">
                Description
              </label>

              <textarea
                rows="7"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="Describe the customer's problem in detail..."
                required
                className="w-full resize-none border border-zinc-800 bg-black px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-red-500"
              />

            </div>


            {/* Success / Error Message */}

            {message && (
              <p className={`text-sm ${message.includes("successfully") ? "text-emerald-400" : "text-red-400"}`}>
                {message}
              </p>
            )}


            {/* Bottom */}

            <div className="flex items-center justify-between border-t border-zinc-800 pt-6">

              <p className="text-xs text-zinc-600">
                Ticket ID will be generated automatically.
              </p>


              <div className="flex gap-3">

                <button
                  type="button"
                  onClick={() => {
                    setCustomerName("")
                    setCustomerEmail("")
                    setSubject("")
                    setDescription("")
                    setMessage("")
                  }}
                  className="border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-300 transition hover:border-zinc-500 hover:text-white"
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  disabled={loading}
                  className="bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {loading ? "Creating..." : "Create Ticket"}
                </button>

              </div>

            </div>

          </form>

        </div>

      </main>

    </div>
  )
}


export default CreateTicket