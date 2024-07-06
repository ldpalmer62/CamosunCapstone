// // Temperature
// // Add event listener to the temp-button for updating the temperature value
// document.getElementById("temp-button").addEventListener("click", function() {
//   // Generate a random temperature value between 10 and 39
//   var newTemperature = Math.floor(Math.random() * 30) + 10;
//   // Update the text content of the element with id 'temp-value' to the new temperature value
//   document.getElementById("temp-value").innerText = newTemperature + " °C";
// });

// // Prev-Temperature
// // Create an array to store previous temperature values with timestamps
// let previousTemperatures = [];

// // Add event listener to the temp-button for recording the temperature value with timestamp
// document.getElementById("temp-button").addEventListener("click", function() {
//     // Generate a random temperature value between 10 and 39
//     let newTemperature = Math.floor(Math.random() * 30) + 10;
//     // Update the text content of the element with id 'temp-value' to the new temperature value
//     document.getElementById("temp-value").innerText = newTemperature + " °C";
//     // Get the current timestamp in a readable format
//     let timestamp = new Date().toLocaleString();
//     // Add the new temperature and timestamp to the previousTemperatures array
//     previousTemperatures.push({ time: timestamp, temperature: newTemperature });
//     // Store the updated previousTemperatures array in localStorage
//     localStorage.setItem("previousTemperatures", JSON.stringify(previousTemperatures));
// });

// // Add event listener to the prev-temp-button for navigating to the previous-temperatures.html page
// document.getElementById("prev-temp-button").addEventListener("click", function() {
//     // Redirect to the previous-temperatures.html page
//     window.location.href = "previous-temperatures.html";
// });


// // Humidity
// // Add event listener to the humd-button for updating the humidity value
// document.getElementById("humd-button").addEventListener("click", function() {
//     // Generate a random humidity value between 20 and 90
//     var newHumidity = Math.floor(Math.random() * 71) + 20;
//     // Update the text content of the element with id 'humd-value' to the new humidity value
//     document.getElementById("humd-value").innerText = newHumidity + " %";
// });

// // Prev-Humidity
// let previousHumidities = [];

// document.getElementById("humd-button").addEventListener("click", function() {
  
//   let newHumidities = Math.floor(Math.random() * 71) + 20;
//   document.getElementById("humd-value").innerText = newHumidities + " %";
//   let timestamp = new Date().toLocaleString();
//   previousHumidities.push({ time: timestamp, humidity: newHumidities });
//   localStorage.setItem("previousHumidities", JSON.stringify(previousHumidities));
// });

// document.getElementById("prev-humd-button").addEventListener("click", function() {
//   window.location.href = "previous-humidities.html";
// });



// // Pressure
// // Add event listener to the pres-button for updating the pressure value
// document.getElementById("pres-button").addEventListener("click", function() {
//   // Generate a random pressure value (assuming pressure is in millibars)
//   var newPressure = Math.floor(Math.random() * 50) + 950; 
//   // Update the text content of the element with id 'humd-value' to the new pressure value
//   document.getElementById("pres-value").innerText = newPressure + " hPa";
// });

// // Prev-Pressure
// let previousPressures = [];

// document.getElementById("pres-button").addEventListener("click", function() {
  
//   let newPressures = Math.floor(Math.random() * 50) + 950; ;
//   document.getElementById("pres-value").innerText = newPressures + " hPa";
//   let timestamp = new Date().toLocaleString();
//   previousPressures.push({ time: timestamp, pressure: newPressures });
//   localStorage.setItem("previousPressures", JSON.stringify(previousPressures));
// });

// document.getElementById("prev-pres-button").addEventListener("click", function() {
//   window.location.href = "previous-pressures.html";
// });




// // Altitude
// // Add event listener to the alt-button for updating the altitude value
// document.getElementById("alt-button").addEventListener("click", function() {
//   // Define minimum and maximum altitude values
//   var minAltitude = 0; 
//   var maxAltitude = 10000; 
//   var newAltitude = Math.floor(Math.random() * (maxAltitude - minAltitude + 1)) + minAltitude;
//   document.getElementById("alt-value").innerText = newAltitude + " meters";
// });

// // Prev-Altitudes
// let previousAltitudes= [];

// document.getElementById("alt-button").addEventListener("click", function() {
  
//   // Define minimum and maximum altitude values
//   var minAltitude = 0; 
//   var maxAltitude = 10000; 
//   var newAltitudes = Math.floor(Math.random() * (maxAltitude - minAltitude + 1)) + minAltitude;
//   document.getElementById("alt-value").innerText = newAltitudes + " meters";
//   let timestamp = new Date().toLocaleString();
//   previousAltitudes.push({ time: timestamp, altitude: newAltitudes });
//   localStorage.setItem("previousAltitudes", JSON.stringify(previousAltitudes));
// });

// document.getElementById("prev-alt-button").addEventListener("click", function() {
//   window.location.href = "previous-altitudes.html";
// });





//document.getElementById('temp-button').addEventListener('click', async () => {
//    try {
//        const BASE_URL = "http://205.250.221.237:8080";
//        const response = await fetch(BASE_URL + "/get_latest_sensor_data?id=2");
//        if (!response.ok) {
//            throw new Error('Network response was not ok ' + response.statusText);
//        }
//        const data = await response.json();
//        console.log('Data:', data);
//        if (data.temperature !== undefined) {
//            document.getElementById('temp-value').innerText = data.temperature + ' °C';
//        } else {
//            console.error('No temperature data received');
//        }
//    } catch (error) {
//        console.error('Error fetching temperature data:', error);
//    }
//});

/// Loads/Refreshes all fields on the dashboard with updated data
const LoadData = async (sensorID) => {
    try{
        const BASE_URL = "http://205.250.221.237:8080";
        const response = await fetch(BASE_URL + "/get_latest_sensor_data?id=" + sensorID);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        if (data.temperature !== undefined) {
            document.getElementById('temp-value').innerText = data.temperature + ' °C';
            document.getElementById('humd-value').innerText = data.humidity + ' %';
            document.getElementById('pres-value').innerText = data.pressure + ' hPa';
            document.getElementById('alt-value').innerText = data.altitude + ' m';
        } else {
            console.error('No data received');
        }
    }
    catch (error) {
        console.error('Error loading data: ', error);
    }
}

/// Runs needed functions when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
    LoadData(2);
});







// document.addEventListener("DOMContentLoaded", function() {
// const BASE_URL = "http://205.250.221.237:8080";

// function updateTemperature() {
//     fetch(`${BASE_URL}/get_latest_sensor_data?id=temperature`)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("temp-value").innerText = data.value + " °C";
//         })
//         .catch(error => console.error('Error fetching temperature:', error));
// }

// function updateHumidity() {
//     fetch(`${BASE_URL}/get_latest_sensor_data?id=humidity`)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("humd-value").innerText = data.value + " %";
//         })
//         .catch(error => console.error('Error fetching humidity:', error));
// }

// function updatePressure() {
//     fetch(`${BASE_URL}/get_latest_sensor_data?id=pressure`)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("pres-value").innerText = data.value + " hPa";
//         })
//         .catch(error => console.error('Error fetching pressure:', error));
// }

// function updateAltitude() {
//     fetch(`${BASE_URL}/get_latest_sensor_data?id=altitude`)
//         .then(response => response.json())
//         .then(data => {
//             document.getElementById("alt-value").innerText = data.value + " meters";
//         })
//         .catch(error => console.error('Error fetching altitude:', error));
// }

// document.getElementById("temp-button").addEventListener("click", updateTemperature);
// document.getElementById("humd-button").addEventListener("click", updateHumidity);
// document.getElementById("pres-button").addEventListener("click", updatePressure);
// document.getElementById("alt-button").addEventListener("click", updateAltitude);

// // Initial load
// updateTemperature();
// updateHumidity();
// updatePressure();
// updateAltitude();
// });


// // Function to fetch data from the server
// function fetchData(endpoint, updateFunction) {
//     fetch(`http://205.250.221.237:8080${endpoint}`)
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error('Network response was not ok ' + response.statusText);
//             }
//             return response.json();
//         })
//         .then(data => {
//             updateFunction(data);
//         })
//         .catch(error => console.error('Error fetching data:', error));
// }

// // Function to update temperature value
// function updateTemperature(data) {
//     document.getElementById("temp-value").innerText = data.temperature + " °C";
//     // Save to previous temperatures
//     let timestamp = new Date().toLocaleString();
//     previousTemperatures.push({ time: timestamp, temperature: data.temperature });
//     localStorage.setItem("previousTemperatures", JSON.stringify(previousTemperatures));
// }

// // Function to update humidity value
// function updateHumidity(data) {
//     document.getElementById("humd-value").innerText = data.humidity + " %";
//     // Save to previous humidities
//     let timestamp = new Date().toLocaleString();
//     previousHumidities.push({ time: timestamp, humidity: data.humidity });
//     localStorage.setItem("previousHumidities", JSON.stringify(previousHumidities));
// }

// // Function to update pressure value
// function updatePressure(data) {
//     document.getElementById("pres-value").innerText = data.pressure + " hPa";
//     // Save to previous pressures
//     let timestamp = new Date().toLocaleString();
//     previousPressures.push({ time: timestamp, pressure: data.pressure });
//     localStorage.setItem("previousPressures", JSON.stringify(previousPressures));
// }

// // Function to update altitude value
// function updateAltitude(data) {
//     document.getElementById("alt-value").innerText = data.altitude + " meters";
//     // Save to previous altitudes
//     let timestamp = new Date().toLocaleString();
//     previousAltitudes.push({ time: timestamp, altitude: data.altitude });
//     localStorage.setItem("previousAltitudes", JSON.stringify(previousAltitudes));
// }

// // Add event listener to the temp-button for updating the temperature value
// document.getElementById("temp-button").addEventListener("click", function() {
//     fetchData('/get_latest_sensor_data?id=temperature_sensor_id', updateTemperature);
// });

// // Add event listener to the prev-temp-button for navigating to the previous-temperatures.html page
// document.getElementById("prev-temp-button").addEventListener("click", function() {
//     window.location.href = "previous-temperatures.html";
// });

// // Add event listener to the humd-button for updating the humidity value
// document.getElementById("humd-button").addEventListener("click", function() {
//     fetchData('/get_latest_sensor_data?id=humidity_sensor_id', updateHumidity);
// });

// // Add event listener to the prev-humd-button for navigating to the previous-humidities.html page
// document.getElementById("prev-humd-button").addEventListener("click", function() {
//     window.location.href = "previous-humidities.html";
// });



// // Add event listener to the pres-button for updating the pressure value
// document.getElementById("pres-button").addEventListener("click", function() {
//     fetchData('/get_latest_sensor_data?id=pressure_sensor_id', updatePressure);
// });

// // Add event listener to the prev-pres-button for navigating to the previous-pressures.html page
// document.getElementById("prev-pres-button").addEventListener("click", function() {
//     window.location.href = "previous-pressures.html";
// });

// // Add event listener to the alt-button for updating the altitude value
// document.getElementById("alt-button").addEventListener("click", function() {
//     fetchData('/get_latest_sensor_data?id=altitude_sensor_id', updateAltitude);
// });

// // Add event listener to the prev-alt-button for navigating to the previous-altitudes.html page
// document.getElementById("prev-alt-button").addEventListener("click", function() {
//     window.location.href = "previous-altitudes.html";
// });





