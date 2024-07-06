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



const LoadGraph = async (month, year) => {
  var dataLow = [];
  var dataHigh = [];
  var dataAvg = [];
  for(let i = 1; i <= 30; i++){
    let ranHigh = Math.random();
    let ranLow = ranHigh * Math.random();
    let ranAvg = (ranLow + ranHigh)/2;
    dataHigh.push({ x: new Date(year, MonthToNumber(month)-1, i), y: (ranHigh * (26.0 - 19.0)) + 19.0 });
    dataLow.push( { x: new Date(year, MonthToNumber(month)-1, i), y: (ranLow *  (26.0 - 19.0)) + 19.0 });
    dataAvg.push( { x: new Date(year, MonthToNumber(month)-1, i), y: (ranAvg *  (26.0 - 19.0)) + 19.0 });
  }
  var chart = new CanvasJS.Chart("chartContainer",
  {
    title:{
      text: "Temperature History for " + month + " " + year
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

const MonthToNumber = month => {
  switch (month){
    case "January":
      return 1;
    case "February":
      return 2;
    case "March":
      return 3;
    case "April":
      return 4;
    case "May":
      return 5;
    case "June":
      return 6;
    case "July":
      return 7;
    case "August":
      return 8;
    case "September":
      return 9;
    case "October":
      return 10;
    case "November":
      return 11;
    case "December":
      return 12;
  }
}

document.addEventListener("DOMContentLoaded", async() => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
});

document.getElementById("month").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
}
document.getElementById("year").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
}