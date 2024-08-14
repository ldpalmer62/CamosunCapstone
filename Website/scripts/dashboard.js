// Define threshold temperatures
const HOT_TEMPERATURE_THRESHOLD = 35;
const COLD_TEMPERATURE_THRESHOLD = 10;
const FLASH_CLASS_HOT = 'flashing-background-hot';
const FLASH_CLASS_COLD = 'flashing-background-cold';

const BASE_URL = "http://205.250.221.237:8080";

// Apply flashing effect based on temperature
const checkTemperature = (temperature) => {
    const temperatureWidget = document.querySelector('.temperature');
    temperatureWidget.classList.remove(FLASH_CLASS_HOT, FLASH_CLASS_COLD); // Remove both classes first

    if (temperature > HOT_TEMPERATURE_THRESHOLD) {
        temperatureWidget.classList.add(FLASH_CLASS_HOT);
    } else if (temperature < COLD_TEMPERATURE_THRESHOLD) {
        temperatureWidget.classList.add(FLASH_CLASS_COLD);
    }
};

// Loads/Refreshes all fields on the dashboard with updated data
const LoadData = async (sensorID) => {
    try {
        const response = await fetch(`${BASE_URL}/get_latest_sensor_data?id=${sensorID}`);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        if (data.temperature !== undefined) {
            temperatureInCelsius = data.temperature; // Store the current temperature
            document.getElementById('temp-value').innerText = currentTempUnit == 'C'? temperatureInCelsius.toFixed(3) + ' °C' : ((temperatureInCelsius * 9/5) + 32).toFixed(3) + ' °F';
            document.getElementById('humd-value').innerText = data.humidity.toFixed(3) + ' %';
            document.getElementById('pres-value').innerText = data.pressure.toFixed(3) + ' hPa';
            
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
            document.getElementById('temp-value').innerText = tempInFahrenheit.toFixed(3) + ' °F';
            currentTempUnit = 'F';
        } else {
            document.getElementById('temp-value').innerText = temperatureInCelsius.toFixed(3) + ' °C';
            currentTempUnit = 'C';
        }
    }
}

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

// Every 5 seconds fetch the data to refresh the dashboard values, this is purely for demo purposes and is not intended for general use
setInterval(() => {
    LoadData(document.getElementById("sensorContainer").value);
    console.log("refreshed");
}, 5000);

// Runs needed functions when page is loaded
document.addEventListener("DOMContentLoaded", async () => {
    await GetAndAddSensorIds();
    document.getElementById("sensorContainer").value = 2;
    LoadData(document.getElementById("sensorContainer").value);
    document.getElementById('toggle-temp-unit').addEventListener('click', toggleTemperatureUnit);
});
//When user selects sensor, update all fields and graph
document.getElementById("sensorContainer").onchange = async () => {
    LoadData(document.getElementById("sensorContainer").value);
}