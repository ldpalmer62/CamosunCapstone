// // Temperature
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



// document.addEventListener("DOMContentLoaded", function() {
//     const BASE_URL = "http://205.250.221.237:8080/get_latest_sensor_data?id=2";

//     function updateTemperature() {
//         fetch(BASE_URL)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok: ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!data.hasOwnProperty('temperature')) {
//                     throw new Error('No temperature data received');
//                 }
//                 document.getElementById("temp-value").innerText = data.temperature + " °C";
//             })
//             .catch(error => console.error('Error fetching temperature:', error));
//     }

//     function updateHumidity() {
//         fetch(BASE_URL)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok: ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!data.hasOwnProperty('humidity')) {
//                     throw new Error('No humidity data received');
//                 }
//                 document.getElementById("humd-value").innerText = data.humidity + " %";
//             })
//             .catch(error => console.error('Error fetching humidity:', error));
//     }

//     function updatePressure() {
//         fetch(BASE_URL)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok: ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!data.hasOwnProperty('pressure')) {
//                     throw new Error('No pressure data received');
//                 }
//                 document.getElementById("pres-value").innerText = data.pressure + " %";
//             })
//             .catch(error => console.error('Error fetching pressure:', error));
//     }

//     function updateAltitude() {
//         fetch(BASE_URL)
//             .then(response => {
//                 if (!response.ok) {
//                     throw new Error('Network response was not ok: ' + response.statusText);
//                 }
//                 return response.json();
//             })
//             .then(data => {
//                 if (!data.hasOwnProperty('altitude')) {
//                     throw new Error('No altitude data received');
//                 }
//                 document.getElementById("alt-value").innerText = data.altitude + " %";
//             })
//             .catch(error => console.error('Error fetching altitude:', error));
//     }


//     document.getElementById("temp-button").addEventListener("click", updateTemperature);
//     document.getElementById("humd-button").addEventListener("click", updateHumidity);
//     document.getElementById("pres-button").addEventListener("click", updatePressure);
//     document.getElementById("alt-button").addEventListener("click", updateAltitude);


// });



// Define a threshold temperature
const TEMPERATURE_THRESHOLD = 35;
const FLASH_CLASS = 'flashing-background';

// Apply flashing effect based on temperature
const checkTemperature = (temperature) => {
    const temperatureWidget = document.querySelector('.temperature');
    if (temperature > TEMPERATURE_THRESHOLD) {
        temperatureWidget.classList.add(FLASH_CLASS);
    } else {
        temperatureWidget.classList.remove(FLASH_CLASS);
    }
};

// Loads/Refreshes all fields on the dashboard with updated data
const LoadData = async (sensorID) => {
    try {
        const BASE_URL = "http://205.250.221.237:8080";
        const response = await fetch(`${BASE_URL}/get_latest_sensor_data?id=${sensorID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        if (data.temperature !== undefined) {
            temperatureInCelsius = data.temperature; // Store the current temperature
            document.getElementById('temp-value').innerText = temperatureInCelsius + ' °C';
            document.getElementById('humd-value').innerText = data.humidity + ' %';
            document.getElementById('pres-value').innerText = data.pressure + ' hPa';
            
            // Check temperature and apply flashing effect if needed
            checkTemperature(temperatureInCelsius);
        } else {
            console.error('No data received');
        }
    } catch (error) {
        console.error('Error loading data: ', error);
    }
}

// Store temperature in Celsius
let temperatureInCelsius = null;
// For tracking of the current temperature unit
let currentTempUnit = 'C';

// Toggle the temperature unit
const toggleTemperatureUnit = () => {
    if (temperatureInCelsius !== null) {
        if (currentTempUnit === 'C') {
            const tempInFahrenheit = (temperatureInCelsius * 9/5) + 32;
            document.getElementById('temp-value').innerText = tempInFahrenheit.toFixed(2) + ' °F';
            currentTempUnit = 'F';
        } else {
            document.getElementById('temp-value').innerText = temperatureInCelsius + ' °C';
            currentTempUnit = 'C';
        }
    }
}

// Runs needed functions when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
    LoadData(2);
    document.getElementById('toggle-temp-unit').addEventListener('click', toggleTemperatureUnit);
});
