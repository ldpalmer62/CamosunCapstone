document.addEventListener("DOMContentLoaded", function() {
  // Retrieve previous altitudes records from localStorage or initialize an empty array
  let previousAltitudes = JSON.parse(localStorage.getItem("previousAltitudes")) || [];
  let tableBody = document.getElementById("altitudes-table-body");

  // Iterate through each record and create table rows
  previousAltitudes.forEach(function(record) {
    let row = document.createElement("tr");
    let timeCell = document.createElement("td");
    let altCell = document.createElement("td");

    // Display time and pressure in the table cells
    timeCell.textContent = record.time;
    altCell.textContent = record.altitude + " meters";

    // Append cells to the row and row to the table body
    row.appendChild(timeCell);
    row.appendChild(altCell);

    tableBody.appendChild(row);
  });
});
