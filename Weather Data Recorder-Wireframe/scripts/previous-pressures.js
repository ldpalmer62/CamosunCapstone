document.addEventListener("DOMContentLoaded", function() {
  // Retrieve previous pressure records from localStorage or initialize an empty array
  let previousPressures = JSON.parse(localStorage.getItem("previousPressures")) || [];
  let tableBody = document.getElementById("pressure-table-body");

  // Iterate through each record and create table rows
  previousPressures.forEach(function(record) {
    let row = document.createElement("tr");
    let timeCell = document.createElement("td");
    let presCell = document.createElement("td");

    // Display time and pressure in the table cells
    timeCell.textContent = record.time;
    presCell.textContent = record.pressure + " hPa"; // Assuming pressure is stored in hPa

    // Append cells to the row and row to the table body
    row.appendChild(timeCell);
    row.appendChild(presCell);
    tableBody.appendChild(row);
  });
});
