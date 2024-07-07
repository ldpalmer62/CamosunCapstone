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





const fetchHistoricalData = async (sensorID, month, year) => {
  // Read from local storage
  try {
      const data = localStorage.getItem('latest_sensor_data');
      if (data) {
          return JSON.parse(data);
      }
  } catch (error) {
      console.error('Error fetching historical data:', error);
      return null;
  }
};



// const LoadGraph = async (sensorID, month, year) => {
//   const data = await fetchHistoricalData(sensorID, month, year);
//   if (!data) {
//       console.error('No data available');
//       return;
//   }

//   const dataLow = [];
//   const dataHigh = [];
//   const dataAvg = [];
  

//   // Assuming we only have one data point for the latest data
//   const date = new Date(data.timestamp);
//   dataHigh.push({ x: date, y: data.temperature });
//   dataLow.push({ x: date, y: data.temperature });
//   dataAvg.push({ x: date, y: data.temperature });

  
// };


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


  // const data = await fetchHistoricalData(sensorID, month, year);
  // if (!data) {
  //     console.error('No data available');
  //     return;
  // }

  // const dataLow = [];
  // const dataHigh = [];
  // const dataAvg = [];
  

  // // Assuming we only have one data point for the latest data
  // const date = new Date(data.timestamp);
  // dataHigh.push({ x: date, y: data.temperature });
  // dataLow.push({ x: date, y: data.temperature });
  // dataAvg.push({ x: date, y: data.temperature });


  CanvasJS.addColorSet(
    "Temperature",
    [
      "#CC0000",//High
      "#00CC00",//Avg
      "#0000CC",//Low
      "#3CB371",
      "#90EE90"                
    ]
  );
  var chart = new CanvasJS.Chart("chartContainer",
  {
    backgroundColor: "#ddddFF",
    colorSet: "Temperature",

    legend: {
      horizontalAlign: "left", // "center" , "right"
      verticalAlign: "center",  // "top" , "bottom"
      fontSize: 15
    },

    title:{
      text: "Temperature History for " + month + " " + year
    },

    data: [
      {
        showInLegend: true,
        legendText: "High",
        type: "line",
        dataPoints: dataHigh
      },
      {
        showInLegend: true,
        legendText: "Average",
        type: "line",
        dataPoints: dataAvg
      },
      {
        showInLegend: true,
        type: "line",
        legendText: "Low",
        dataPoints: dataLow
      }
    ]
  });
  chart.render();
}


///Converts a string of a month to the number of a month
///EX: MonthToNumber("July") returns 7
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

//When page loads, load a default graph
document.addEventListener("DOMContentLoaded", async() => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
});

//When user selects month and year, update the graph to reflect it
document.getElementById("month").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
}
document.getElementById("year").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value);
}









