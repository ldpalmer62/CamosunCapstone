// The server where ths API is hosted
const BASE_URL = "http://205.250.221.237:8080";

// An async for deleting sensor data based on a specified date
async function deleteData() {
    
    // Get the value of the input element with the ID 'delete-date' (the date to delete data for)
    const deleteDate = document.getElementById('delete-date').value;

    // Check if the 'delete-date' input is empty; if so, alert the user and stop execution
    if (!deleteDate) {
        alert('Please enter a date.');
        return;
    }

    try {
        // Make a DELETE request to the server to delete sensor readings for the specified date
        const response = await fetch(`${BASE_URL}/delete_sensor_readings_by_date/${encodeURIComponent(deleteDate)}`, {
        method: 'DELETE',
        });

        // Check if the server responded with a success status
        if (response.ok) {
        alert('Data deleted successfully');
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
    } catch (error) {
        // Log any network or server errors to the console and alert the user
        console.error('Error:', error);
        alert('An error occurred while deleting data.');
    }
}

