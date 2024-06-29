// Temperature
// Add event listener to the temp-button for updating the temperature value
document.getElementById("temp-button").addEventListener("click", function() {
  // Generate a random temperature value between 10 and 39
  var newTemperature = Math.floor(Math.random() * 30) + 10;
  // Update the text content of the element with id 'temp-value' to the new temperature value
  document.getElementById("temp-value").innerText = newTemperature + " °C";
});

// Prev-Temperature
// Create an array to store previous temperature values with timestamps
let previousTemperatures = [];

// Add event listener to the temp-button for recording the temperature value with timestamp
document.getElementById("temp-button").addEventListener("click", function() {
    // Generate a random temperature value between 10 and 39
    let newTemperature = Math.floor(Math.random() * 30) + 10;
    // Update the text content of the element with id 'temp-value' to the new temperature value
    document.getElementById("temp-value").innerText = newTemperature + " °C";
    // Get the current timestamp in a readable format
    let timestamp = new Date().toLocaleString();
    // Add the new temperature and timestamp to the previousTemperatures array
    previousTemperatures.push({ time: timestamp, temperature: newTemperature });
    // Store the updated previousTemperatures array in localStorage
    localStorage.setItem("previousTemperatures", JSON.stringify(previousTemperatures));
});

// Add event listener to the prev-temp-button for navigating to the previous-temperatures.html page
document.getElementById("prev-temp-button").addEventListener("click", function() {
    // Redirect to the previous-temperatures.html page
    window.location.href = "previous-temperatures.html";
});


// Humidity
// Add event listener to the humd-button for updating the humidity value
document.getElementById("humd-button").addEventListener("click", function() {
    // Generate a random humidity value between 20 and 90
    var newHumidity = Math.floor(Math.random() * 71) + 20;
    // Update the text content of the element with id 'humd-value' to the new humidity value
    document.getElementById("humd-value").innerText = newHumidity + " %";
});

// Prev-Humidity
let previousHumidities = [];

document.getElementById("humd-button").addEventListener("click", function() {
  
  let newHumidities = Math.floor(Math.random() * 71) + 20;
  document.getElementById("humd-value").innerText = newHumidities + " %";
  let timestamp = new Date().toLocaleString();
  previousHumidities.push({ time: timestamp, humidity: newHumidities });
  localStorage.setItem("previousHumidities", JSON.stringify(previousHumidities));
});

document.getElementById("prev-humd-button").addEventListener("click", function() {
  window.location.href = "previous-humidities.html";
});



// Pressure
// Add event listener to the pres-button for updating the pressure value
document.getElementById("pres-button").addEventListener("click", function() {
  // Generate a random pressure value (assuming pressure is in millibars)
  var newPressure = Math.floor(Math.random() * 50) + 950; 
  // Update the text content of the element with id 'humd-value' to the new pressure value
  document.getElementById("pres-value").innerText = newPressure + " hPa";
});

// Prev-Pressure
let previousPressures = [];

document.getElementById("pres-button").addEventListener("click", function() {
  
  let newPressures = Math.floor(Math.random() * 50) + 950; ;
  document.getElementById("pres-value").innerText = newPressures + " hPa";
  let timestamp = new Date().toLocaleString();
  previousPressures.push({ time: timestamp, pressure: newPressures });
  localStorage.setItem("previousPressures", JSON.stringify(previousPressures));
});

document.getElementById("prev-pres-button").addEventListener("click", function() {
  window.location.href = "previous-pressures.html";
});




// Altitude
// Add event listener to the alt-button for updating the altitude value
document.getElementById("alt-button").addEventListener("click", function() {
  // Define minimum and maximum altitude values
  var minAltitude = 0; 
  var maxAltitude = 10000; 
  var newAltitude = Math.floor(Math.random() * (maxAltitude - minAltitude + 1)) + minAltitude;
  document.getElementById("alt-value").innerText = newAltitude + " meters";
});

// Prev-Altitudes
let previousAltitudes= [];

document.getElementById("alt-button").addEventListener("click", function() {
  
  // Define minimum and maximum altitude values
  var minAltitude = 0; 
  var maxAltitude = 10000; 
  var newAltitudes = Math.floor(Math.random() * (maxAltitude - minAltitude + 1)) + minAltitude;
  document.getElementById("alt-value").innerText = newAltitudes + " meters";
  let timestamp = new Date().toLocaleString();
  previousAltitudes.push({ time: timestamp, altitude: newAltitudes });
  localStorage.setItem("previousAltitudes", JSON.stringify(previousAltitudes));
});

document.getElementById("prev-alt-button").addEventListener("click", function() {
  window.location.href = "previous-altitudes.html";
});