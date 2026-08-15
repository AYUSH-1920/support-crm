import TicketCard from "./TicketCard"


function TicketList({ tickets }) {

  return (
    <div className="space-y-3">

      {tickets.map((ticket) => (

        <TicketCard
          key={ticket.ticket_id}
          ticket={ticket}
        />

      ))}

    </div>
  )
}


export default TicketList