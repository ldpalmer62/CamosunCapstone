//document.addEventListener("DOMContentLoaded", function() {
//  // Retrieve previous temperature records from localStorage or initialize an empty array
//  let previousTemperatures = JSON.parse(localStorage.getItem("previousTemperatures")) || [];
//  let tableBody = document.getElementById("temperature-table-body");
//
//  // Iterate through each record and create table rows
//  previousTemperatures.forEach(function(record) {
//    let row = document.createElement("tr");
//    let timeCell = document.createElement("td");
//    let tempCell = document.createElement("td");
//
//    // Display time and pressure in the table cells
//    timeCell.textContent = record.time;
//    tempCell.textContent = record.temperature + " °C";
//
//    // Append cells to the row and row to the table body
//    row.appendChild(timeCell);
//    row.appendChild(tempCell);
//    tableBody.appendChild(row);
//  });
//});



const LoadGraph = async (month) => {
  var dataLow = [];
  var dataHigh = [];
  var dataAvg = [];
  for(let i = 1; i <= 30; i++){
    let ranHigh = Math.random();
    let ranLow = ranHigh * Math.random();
    let ranAvg = (ranLow + ranHigh)/2;
    dataHigh.push({ x: new Date(2024, 6, i), y: (ranHigh * (26.0 - 19.0)) + 19.0 });
    dataLow.push({ x: new Date(2024, 6, i), y: (ranLow * (26.0 - 19.0)) + 19.0 });
    dataAvg.push({ x: new Date(2024, 6, i), y: (ranAvg * (26.0 - 19.0)) + 19.0 });
  }
  var chart = new CanvasJS.Chart("chartContainer",
  {
    title:{
      text: "Temperature History for " + month + " 2024"
    },
      data: [
    {
      type: "line",
      dataPoints: dataLow
    },
    {
      type: "line",
      dataPoints: dataHigh
    },
    {
      type: "line",
      dataPoints: dataAvg
    }
    ]
  });
  chart.render();
}

document.addEventListener("DOMContentLoaded", async() => {
  LoadGraph("June");
});

document.getElementById("month").onchange = () => {
  LoadGraph(document.getElementById("month").value)
}