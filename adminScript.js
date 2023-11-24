async function fetchBookingRecords() {
  try {
    const response = await fetch(`https://bookingsystem2-9ca46070b498.herokuapp.com/getallreservations`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return Promise.resolve(data.reservations);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }

}

function displayBookingRecords(records) {
  const tableBody = document.getElementById('bookingRecords');

  records.forEach(record => {
    const row = document.createElement('tr');

    // Create table cells for each column
    const {
      name,
      email,
      date,
      time,
      numberOfPeople,
      bookingInfo
    } = record;
    row.innerHTML = `
        <td>${name}</td>
        <td>${email}</td>
        <td>${date}</td>
        <td>${time}</td>
        <td>${numberOfPeople}</td>
        <td>${bookingInfo}</td>
        <td><span class="delete-btn" data-id="${record.id}">Delete</span></td>
      `;

    // Add event listener for delete action
    const deleteBtn = row.querySelector('.delete-btn');
    deleteBtn.addEventListener('click', () => {
      const recordId = deleteBtn.getAttribute('data-id');
      deleteBookingRecord(recordId); // Call function to delete the record
      row.remove(); // Remove the row from the table after deletion (optional)
    });

    tableBody.appendChild(row);
  });
}

async function deleteBookingRecord(recordId) {
  console.log('id', recordId)
  try {
    const response = await fetch(`https://bookingsystem2-9ca46070b498.herokuapp.com/deletereservation/${recordId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    return Promise.resolve(data.reservations);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  // Fetch booking records from the backend (you need to implement this)
  // For example:
  fetchBookingRecords().then(records => {
    displayBookingRecords(records);
  }).catch(error => {
    console.error('Error fetching booking records:', error);
  });
});