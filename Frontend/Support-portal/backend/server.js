const express = require("express")
const cors = require("cors")
const db = require("./database")

const app = express()

app.use(cors())
app.use(express.json())

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "Support CRM backend is running"
  })
})

// Create ticket
app.post("/api/tickets", (req, res) => {
  const { customer_name, customer_email, subject, description } = req.body

  try {
    const ticketId = "TKT-" + Date.now()

    const insertTicket = db.prepare(`
      INSERT INTO tickets (ticket_id, customer_name, customer_email, subject, description)
      VALUES (?, ?, ?, ?, ?)
    `)

    insertTicket.run(ticketId, customer_name, customer_email, subject, description)

    const newTicket = db.prepare(`
      SELECT ticket_id, created_at FROM tickets WHERE ticket_id = ?
    `).get(ticketId)

    res.status(201).json(newTicket)

  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error creating ticket" })
  }
})

// get all tickets
app.get("/api/tickets", (req, res) => {
  const { status, search } = req.query

  try {
    let query = `
      SELECT ticket_id, customer_name, subject, status, created_at
      FROM tickets
    `
    const conditions = []
    const params = []

    if (status) {
      conditions.push(`status = ?`)
      params.push(status)
    }

    if (search) {
      conditions.push(`customer_name LIKE ?`)
      params.push(`%${search}%`)
    }

    if (conditions.length > 0) {
      query += ` WHERE ` + conditions.join(" AND ")
    }

    query += ` ORDER BY created_at DESC`

    const tickets = db.prepare(query).all(...params)
    res.json(tickets)

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: "error fetching ticket" })
  }
})
//fetch ticket details
app.get("/api/tickets/:ticket_id",(req,res)=>{
    const {ticket_id}= req.params

    try{
        const ticket= db.prepare(`
            SELECT
            ticket_id,
            customer_name,
            customer_email,
            subject,
            description,
            status
            FROM tickets
            WHERE ticket_id=?
            `).get(ticket_id)
            if(!ticket){
                return res.status(404).json({
                    message:"ticket not found"
                })
            }
        const notes = db.prepare(`
            SELECT
            note_text,
            created_at
            FROM notes
            WHERE ticket_id=?
            ORDER BY created_at ASC
            `).all(ticket_id)

             // Send ticket + notes
    res.json({
      ticket_id: ticket.ticket_id,
      customer_name: ticket.customer_name,
      customer_email: ticket.customer_email,
      subject: ticket.subject,
      description: ticket.description,
      status: ticket.status,
      notes: notes
    })
    } catch (error) {

    console.error("Error fetching ticket:", error)

    res.status(500).json({
      message: "Error fetching ticket"
    })
}
})
// update ticket status + add note
app.put("/api/tickets/:ticket_id", (req, res) => {

  const { ticket_id } = req.params
  const { status, notes } = req.body

  console.log("Updating ticket:", ticket_id, req.body)

  try {

    const ticket = db.prepare(`SELECT * FROM tickets WHERE ticket_id=?`).get(ticket_id)

    if(!ticket){
        return res.status(404).json({
            message:"ticket not found"
        })
    }

    if(status){
        db.prepare(`
            UPDATE tickets
            SET status=?, updated_at=CURRENT_TIMESTAMP
            WHERE ticket_id=?
        `).run(status, ticket_id)
    }
    else{
        db.prepare(`
            UPDATE tickets
            SET updated_at=CURRENT_TIMESTAMP
            WHERE ticket_id=?
        `).run(ticket_id)
    }

    if(notes){
        db.prepare(`
            INSERT INTO notes (ticket_id, note_text)
            VALUES (?, ?)
        `).run(ticket_id, notes)
    }

    const updated = db.prepare(`SELECT updated_at FROM tickets WHERE ticket_id=?`).get(ticket_id)

    res.json({
        success:true,
        updated_at:updated.updated_at
    })

  } catch (error) {

    console.error("Error updating ticket:", error)

    res.status(500).json({
        message:"Error updating ticket"
    })
  }
})
// delete ticket
app.delete("/api/tickets/:ticket_id", (req, res) => {

  const { ticket_id } = req.params

  console.log("Deleting ticket:", ticket_id)

  try {

    const ticket = db.prepare(`SELECT * FROM tickets WHERE ticket_id=?`).get(ticket_id)

    if(!ticket){
        return res.status(404).json({
            message:"ticket not found"
        })
    }

    db.prepare(`DELETE FROM notes WHERE ticket_id=?`).run(ticket_id)
    db.prepare(`DELETE FROM tickets WHERE ticket_id=?`).run(ticket_id)

    res.json({
        success:true
    })

  } catch (error) {

    console.error("Error deleting ticket:", error)

    res.status(500).json({
        message:"Error deleting ticket"
    })
  }
})
const PORT = 5000


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})