document.addEventListener("DOMContentLoaded", function() {
  // Retrieve previous humidity records from localStorage or initialize an empty array
  let previousHumidities = JSON.parse(localStorage.getItem("previousHumidities")) || [];
  let tableBody = document.getElementById("humidity-table-body");

  // Iterate through each record and create table rows
  previousHumidities.forEach(function(record) {
    let row = document.createElement("tr");
    let timeCell = document.createElement("td");
    let humdCell = document.createElement("td");

    // Display time and humidity in the table cells
    timeCell.textContent = record.time;
    humdCell.textContent = record.humidity + " %";

    // Append cells to the row and row to the table body
    row.appendChild(timeCell);
    row.appendChild(humdCell);

    tableBody.appendChild(row);
  });
});