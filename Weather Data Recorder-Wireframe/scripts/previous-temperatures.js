document.addEventListener("DOMContentLoaded", function() {
  // Retrieve previous temperature records from localStorage or initialize an empty array
  let previousTemperatures = JSON.parse(localStorage.getItem("previousTemperatures")) || [];
  let tableBody = document.getElementById("temperature-table-body");

  // Iterate through each record and create table rows
  previousTemperatures.forEach(function(record) {
    let row = document.createElement("tr");
    let timeCell = document.createElement("td");
    let tempCell = document.createElement("td");

    // Display time and pressure in the table cells
    timeCell.textContent = record.time;
    tempCell.textContent = record.temperature + " °C";

    // Append cells to the row and row to the table body
    row.appendChild(timeCell);
    row.appendChild(tempCell);
    tableBody.appendChild(row);
  });
});
