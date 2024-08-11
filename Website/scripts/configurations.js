const BASE_URL = "http://205.250.221.237:8080";

async function deleteData() {
  const deleteDate = document.getElementById('delete-date').value;

  if (!deleteDate) {
      alert('Please enter a date.');
      return;
  }

  try {
      const response = await fetch(`${BASE_URL}/delete_sensor_readings_by_date/${encodeURIComponent(deleteDate)}`, {
          method: 'DELETE',
      });

      if (response.ok) {
        alert('Data deleted successfully');
    } else {
        const error = await response.json();
        alert(`Error: ${error.error}`);
    }
  } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while deleting data.');
  }
}

