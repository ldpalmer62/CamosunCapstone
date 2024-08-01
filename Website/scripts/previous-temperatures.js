var ProcessedData;//Declared here to keep public
const BASE_URL = "http://205.250.221.237:8080";

// For tracking current unit(default C)
var currentUnit = "C";

//Fetches all data of a sensor from the database
//Params: sensorID
//Returns: array of data point objects
const FetchData = async sensorID =>{
  try {
    const response = await fetch(`${BASE_URL}/get_sensor_data_list?id=${sensorID}&&time_period=all`);
    const data = await response.json();
    return data.sensor_data;
  }catch (error) {
    console.error('Error fetching historical data:', error);
    return null;
  }
}

//Compile all the fetched data into low/avg/high datapoints for each day
//Params: datapoints from database
//Returns: object containing each array
const ProcessData = data => {
  //Declare object with empty arrays
  let ProcessedData = {
    dataLow: [],
    dataAvg: [],
    dataHigh:[]
  }
  //Declare needed variables
  var low;
  var avg;
  var numPoints;
  var high;
  var previous = data[0];

  data.forEach(dataPoint => {
    //If the day of this datapoint is not the same as the previous datapoint
    //  Put the previous days data into the associated arrays in the object
    if((new Date(dataPoint.date)).getDate() != (new Date(previous.date)).getDate()){
      let day = new Date(previous.date);//get the date of the previous day
      day.setHours(0, 0, 0, 0);//To make sure the datapoints align with the graph
      ProcessedData.dataLow.push({x: day, y: low});
      ProcessedData.dataAvg.push({x: day, y: avg/numPoints});
      ProcessedData.dataHigh.push({x: day, y: high});

      //Reset the variables to prepare for the next datapoints
      low = null;
      avg = 0;
      numPoints = 0;
      high = null;
    }
    
    if(low == null || dataPoint.temperature < low )
      low = dataPoint.temperature;

    if(high == null || dataPoint.temperature > high )
      high = dataPoint.temperature;

    avg += dataPoint.temperature;
    numPoints++;
    previous = dataPoint;
  });
  //Put the last days datapoints into arrays
  let day = new Date(previous.date);
  ProcessedData.dataLow.push({x: day, y: low});
  ProcessedData.dataAvg.push({x: day, y: avg/numPoints});
  ProcessedData.dataHigh.push({x: day, y: high});

  return ProcessedData;
}

// Convert temperature from C to F
const convertToUnit = (value, unit) => {
  return unit === "F" ? (value * 9/5) + 32 : (value - 32) * 5/9;
};

// Convert all data points to the selected unit
const convertDataPoints = (data, unit) => {
  return data.map(point => ({ x: point.x, y: convertToUnit(point.y, unit) }));
};


//Loads the graph for the user
//Params: Month: String, Year: int, data: processedData
const LoadGraph = async (month, year, data) => {
  var dataLow = [];
  var dataHigh = [];
  var dataAvg = [];

  //Get all the datapoints for the month/year the user specified
  for(let i = 0; i < data.dataLow.length; i++){
    if((new Date(data.dataLow[i].x)).getUTCMonth() == MonthToNumber(month) - 1 && (new Date(data.dataLow[i].x)).getUTCFullYear() == year){
      dataLow.push(data.dataLow[i]);
      dataHigh.push(data.dataHigh[i]);
      dataAvg.push(data.dataAvg[i]);
    }
  }

  // Convert data points if the current unit is F
  if (currentUnit === "F") {
    dataLow = convertDataPoints(dataLow, currentUnit);
    dataHigh = convertDataPoints(dataHigh, currentUnit);
    dataAvg = convertDataPoints(dataAvg, currentUnit);
  }

  //Color theme
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


//Converts a string of a month to the number of a month
//Params: month: String
//Returns: int
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
  var data = await FetchData(2);
  ProcessedData = ProcessData(data);
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value, ProcessedData);
});

//When user selects month and year, update the graph to reflect it
document.getElementById("month").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value, ProcessedData);
}
document.getElementById("year").onchange = () => {
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value, ProcessedData);
}

// Toggle between C and F
const toggleUnit = () => {
  currentUnit = currentUnit === "C" ? "F" : "C";
  LoadGraph(document.getElementById("month").value, document.getElementById("year").value, ProcessedData);
};
document.getElementById("unitToggle").addEventListener("click", toggleUnit);
