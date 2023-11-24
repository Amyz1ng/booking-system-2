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

function logout() {
  localStorage.clear(); // Clear all items from localStorage
  window.location.href = 'index.html'; // Redirect to the login page
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

async function checkAuthentication() {
  try {
    const currentPage = window.location.pathname.split('/').pop();

    if (currentPage !== 'login.html') {
      // Retrieve authentication status from localStorage
      const loggedIn = localStorage.getItem('loggedIn');
      console.log("loggedIn", loggedIn)

      if (!loggedIn) {
        // User is not logged in, redirect to login page
        window.location.href = 'login.html'; // Change the URL to your login page
      }
    }
  } catch (error) {
    console.error('There was a problem checking authentication:', error);
    // Handle error or redirect to login page if authentication check fails
    window.location.href = 'login.html'; // Change the URL to your login page
  }
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
  checkAuthentication();
  // Fetch booking records from the backend (you need to implement this)
  // For example:
  fetchBookingRecords().then(records => {
    displayBookingRecords(records);
  }).catch(error => {
    console.error('Error fetching booking records:', error);
  });

  let signInBtnWeb = document.getElementById("signInBtn");
  let signInBtnMobile = document.getElementById("signInBtnMobile");


  // Function to update the link text based on loggedIn status
  const updateLinkText = () => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      if (signInBtnWeb) {
        signInBtnWeb.textContent = "Sign Out";
      } else {
        signInBtnWeb.textContent = "Sign In";
      }

      if (signInBtnMobile) {
        signInBtnMobile.textContent = "Sign Out";
      } else {
        signInBtnMobile.textContent = "Sign In";
      }
    }
  };

  updateLinkText();

  if (signInBtnWeb) {
    signInBtnWeb.addEventListener("click", function () {
      const loggedIn = localStorage.getItem("loggedIn");

      if (loggedIn === "true") {
        logout();
      } else {
        window.location.href = 'login.html';
      }

      updateLinkText();
    });
  }

  if (signInBtnMobile) {
    signInBtnMobile.addEventListener("click", function () {
      const loggedIn = localStorage.getItem("loggedIn");
      console.log('loggedIn', loggedIn)
      if (loggedIn === "true") {
        logout();
      } else {
        window.location.href = 'login.html';
      }

      updateLinkText();
    });
  }
});