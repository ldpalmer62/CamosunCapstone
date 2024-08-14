var ProcessedData;//declared here to keep public
var monthsAndYears;
const BASE_URL = "http://205.250.221.237:8080";
console.log(window.location.href);
//Fetches all data of a sensor from the database
//Params: sensorID
//Returns: array of data point objects
const FetchData = async sensorID =>{
  try {
    const response = await fetch(`${BASE_URL}/get_all_sensor_data_since_date?id=${sensorID}&&date=01-01-2024`);
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
    
    if(low == null || dataPoint.pressure < low )
      low = dataPoint.pressure;

    if(high == null || dataPoint.pressure > high )
      high = dataPoint.pressure;

    avg += dataPoint.pressure;
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


  //Color theme
  CanvasJS.addColorSet(
    "Pressure",
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
    colorSet: "Pressure",

    legend: {
      horizontalAlign: "left", // "center" , "right"
      verticalAlign: "center",  // "top" , "bottom"
      fontSize: 15
    },

    title:{
      text: "Pressure History for " + month + " " + year
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

//Converts a number of a month to the string of a month
//Params: month: Int
//Returns: String
const NumberToMonth = month => {
  switch (month){
    case 1:
      return "January";
    case 2:
      return "February";
    case 3:
      return "March";
    case 4:
      return "April";
    case 5:
      return "May";
    case 6:
      return "June";
    case 7:
      return "July";
    case 8:
      return "August";
    case 9:
      return "September";
    case 10:
      return "October";
    case 11:
      return "November";
    case 12:
      return "December";
  }
}

//From the data returned, get all the months and years that the data (ProcessedData) occupies
//Runs AddYearsToDom when completed
const GetMonthsAndYears = async () => {
  var data = ProcessedData.dataLow;

  var previousMonth = (new Date(data[0].x)).getUTCMonth();
  var previousYear = (new Date(data[0].x)).getUTCFullYear();

  monthsAndYears = [{year: previousYear, months: [previousMonth+1]}]
  var index = 0;

  for(let i = 0; i < data.length; i++){
    if((new Date(data[i].x)).getUTCFullYear() != previousYear){
      previousYear = (new Date(data.dataLow[i].x)).getUTCFullYear();
      previousMonth = (new Date(data[i].x)).getUTCMonth();
      monthsAndYears.push({year: previousYear, months: [previousMonth]});
      index++;
    } else if((new Date(data[i].x)).getUTCMonth() != previousMonth){
      previousMonth = (new Date(data[i].x)).getUTCMonth();
      monthsAndYears[index].months.push(previousMonth+1);
    }
  }
  AddYearsToDom(monthsAndYears);
}

// Adds the years the data occupies into the dom
// Runs AddMonthsToDom when complete
const AddYearsToDom = monthsAndYears => {
  var yearContainer = document.getElementById("yearContainer");
  yearContainer.innerHTML = '';
  for(let x = 0; x < monthsAndYears.length; x++){

    var optYear = document.createElement('option');
    optYear.value = monthsAndYears[x].year;
    optYear.innerHTML = monthsAndYears[x].year;
    yearContainer.appendChild(optYear);
  }
  AddMonthsToDom(monthsAndYears[0].year);
}

// Adds the months the data occupies for the given year
const AddMonthsToDom = year => {
  var monthContainer = document.getElementById("monthContainer");
  monthContainer.innerHTML = '';
  var months;
  for(let i = 0; i < monthsAndYears.length; i++){
    if(year == monthsAndYears[i].year)
      months = monthsAndYears[i].months;
  }
  for(let y = 0; y < months.length; y++){

    var optMonth = document.createElement('option');
    optMonth.value = NumberToMonth(months[y]);
    optMonth.innerHTML = NumberToMonth(months[y]);
    monthContainer.appendChild(optMonth);
  }
}

// Gets all sensors hooked to the server and puts them into the dom for the user to select
const GetAndAddSensorIds = async () => {
  var response = await fetch(`${BASE_URL}/get_all_sensors`);
  const data = await response.json();
  var container = document.getElementById('sensorContainer')
  for(let i = 0; i < data.sensors.length; i++){
    var opt = document.createElement('option');
    opt.value = data.sensors[i].id;
    opt.innerHTML = data.sensors[i].name;
    container.appendChild(opt);
  }
}

// Loads the data for a given sensor from the server
// Runs ProcessData and places into a public variable
// Runs GetMonthsAndYears when complete
const LoadSensorData = async sensorID => {
  var data = await FetchData(sensorID);
  ProcessedData = ProcessData(data);
  GetMonthsAndYears();
}

//When page loads, load a default graph
document.addEventListener("DOMContentLoaded", async() => {
  await GetAndAddSensorIds();
  await LoadSensorData(document.getElementById("sensorContainer").value);
  LoadGraph(document.getElementById("monthContainer").value, document.getElementById("yearContainer").value, ProcessedData);
});

//When user selects month and year, update the graph to reflect it
document.getElementById("monthContainer").onchange = () => {
  LoadGraph(document.getElementById("monthContainer").value, document.getElementById("yearContainer").value, ProcessedData);
}
document.getElementById("yearContainer").onchange = () => {
  AddMonthsToDom(document.getElementById("yearContainer").value);
  LoadGraph(document.getElementById("monthContainer").value, document.getElementById("yearContainer").value, ProcessedData);
}
//When user selects sensor, update all fields and graph
document.getElementById("sensorContainer").onchange = async () => {
  await LoadSensorData(document.getElementById("sensorContainer").value);
  LoadGraph(document.getElementById("monthContainer").value, document.getElementById("yearContainer").value, ProcessedData);
}

// Toggle between C and F
const toggleUnit = () => {
  currentUnit = currentUnit === "C" ? "F" : "C";
  LoadGraph(document.getElementById("monthContainer").value, document.getElementById("yearContainer").value, ProcessedData);
};
document.getElementById("unitToggle").addEventListener("click", toggleUnit);
