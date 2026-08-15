function StatusFilter({ selectedStatus, setSelectedStatus }) {

  return (
    <select
      value={selectedStatus}
      onChange={(event) => {

        console.log("Selected status:", event.target.value)

        setSelectedStatus(event.target.value)

      }}
      className="rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-slate-400"
    >

      <option value="All Status">
        All Status
      </option>

      <option value="Open">
        Open
      </option>

      <option value="In Progress">
        In Progress
      </option>

      <option value="Closed">
        Closed
      </option>

    </select>
  )
}


export default StatusFilter