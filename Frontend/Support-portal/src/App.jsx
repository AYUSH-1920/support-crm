import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "./components/Home"
import CreateTicket from "./pages/CreateTicket"
import TicketDetail from "./pages/TicketDetail"

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />

        <Route path="/create-ticket" element={<CreateTicket />} />
             <Route path="/tickets/:ticket_id" element={<TicketDetail />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App