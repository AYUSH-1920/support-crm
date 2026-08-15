import { useEffect, useState } from "react"

import Navbar from "../components/Navbar"
import SearchBar from "../components/SearchBar"
import StatusFilter from "../components/Statusfilter"
import TicketList from "../components/TicketList"

function Home() {

  const [tickets, setTickets] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("All Status")


  useEffect(() => {

  const params = new URLSearchParams()

  if (selectedStatus !== "All Status") {
    params.append("status", selectedStatus)
  }

  if (searchTerm.trim() !== "") {
    params.append("search", searchTerm.trim())
  }

  const queryString = params.toString()

  const url = `${import.meta.env.VITE_API_URL}/api/tickets${
    queryString ? `?${queryString}` : ""
  }`

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      setTickets(data)
    })
    .catch((error) => {
      console.error("Error fetching tickets:", error)
    })

}, [searchTerm, selectedStatus])

  return (
    <div className="min-h-screen bg-slate-50">

      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-8">

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            Support Tickets
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Manage and track customer support requests.
          </p>
        </div>

        <div className="mb-6 flex gap-4">
          <div className="flex-1">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            />
          </div>

          <StatusFilter
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
          />
        </div>

        <TicketList tickets={tickets} />

      </main>

    </div>
  )
}


export default Home