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
