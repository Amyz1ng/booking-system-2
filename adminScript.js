function fetchBookingRecords() {
    // Make a backend call to retrieve booking records
    // Replace this with your actual backend API call (e.g., using fetch or Axios)
    // Return a Promise that resolves with the booking records
  
    // Example dummy data
    const dummyRecords = [
      {
        name: 'John Doe',
        email: 'john@example.com',
        date: '2023-11-25',
        time: '15:00',
        numberOfPeople: 4,
        bookingInfo: 'Table for 4'
      },
      // Add more records as needed
    ];
  
    return Promise.resolve(dummyRecords);
  }
  
  function displayBookingRecords(records) {
    const tableBody = document.getElementById('bookingRecords');
  
    records.forEach(record => {
      const row = document.createElement('tr');
  
      // Create table cells for each column
      const { name, email, date, time, numberOfPeople, bookingInfo } = record;
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
  
  function deleteBookingRecord(recordId) {
    // Make a backend call to delete the record by ID
    // Replace this with your actual backend delete API call
    // Use the recordId to identify and delete the record
  }
  
  document.addEventListener('DOMContentLoaded', function() {
    // Fetch booking records from the backend (you need to implement this)
    // For example:
    fetchBookingRecords().then(records => {
      displayBookingRecords(records);
    }).catch(error => {
      console.error('Error fetching booking records:', error);
    });
  });