function sendMail(contactForm) {
  emailjs.send("gmail", "Pizza-berra", {
      "from_name": contactForm.name.value,
      "from_email": contactForm.emailaddress.value,
      "booking_request": contactForm.booking_request.value
    })
    .then(
      function (response) {
        console.log("SUCCESS", response);
      },
      function (error) {
        console.log("FAILED", error);
      }
    );
  return false; // To block from loading a new page
}

async function login(loginForm) {
  const requestData = {
    email: loginForm.email.value,
    password: loginForm.password.value
  };

  try {
    const response = await fetch('https://bookingsystem2-9ca46070b498.herokuapp.com/login', { // Replace with your login endpoint URL
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Login successful:', data);
    console.log('IsAdmin:', data);
    localStorage.setItem('loggedIn', true);
    localStorage.setItem('email', requestData.email);
    localStorage.setItem('isAdmin', data.isAdmin);

    return true; // Return true if login is successful
  } catch (error) {
    console.error('There was a problem with the login:', error);
    return false; // Return false if login fails
  }
}

async function checkAvailability() {
  const requestData = {
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    number_of_people: document.getElementById('numberofpeople').value,
  };

  try {
    const response = await fetch('https://bookingsystem2-9ca46070b498.herokuapp.com/checkAvailability', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('data', data.message);
    if (!data.available) {
      alert(data.message);
      return;
    } else {
      book();
    }
  } catch (error) {
    console.error('There was a problem checking availability:', error);
    return false;
  }
}

async function book() {
  const data = {
    name: document.getElementById('fullname').value,
    email: document.getElementById('emailaddress').value,
    number_of_people: document.getElementById('numberofpeople').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    booking_information: document.getElementById('bookinginfomation').value
  };

  fetch('https://bookingsystem2-9ca46070b498.herokuapp.com/insert', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('Insert operation successful:', data);
      document.getElementById('fullname').value = '';
      document.getElementById('emailaddress').value = '';
      document.getElementById('numberofpeople').value = '';
      document.getElementById('date').value = '';
      document.getElementById('time').value = '';
      document.getElementById('bookinginfomation').value = '';
      alert('Booking successful!');
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function logout() {
  localStorage.clear(); // Clear all items from localStorage
  window.location.href = 'index.html'; // Redirect to the login page
}


async function checkAuthentication() {
  try {
    const currentPage = window.location.pathname.split('/').pop(); // Get current page URL

    if (currentPage !== 'login.html') { // Check if the current page is not login.html
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

document.addEventListener('DOMContentLoaded', function () {
  updateLinkText();

  const form = document.getElementById('myForm');
  if (form) {
    /* checkAuthentication();*/
    form.addEventListener('submit', function (event) {
      event.preventDefault();
      checkAvailability();
    });
  }

  const loginForm = document.getElementById('loginForm');
  if (loginForm) {
    loginForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const loggedIn = await login(loginForm);
      if (loggedIn) {
        window.location.href = 'contact.html';
      } else {
        // Handle unsuccessful login, display an error message, etc.
        alert('Login failed. Please try again.');
      }
    });
  }

  const toggleButton = document.getElementById("signInBtn");

  // Function to update the link text based on loggedIn status
  const updateLinkText = () => {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      toggleButton.textContent = "Sign Out";
    } else {
      toggleButton.textContent = "Sign In";
    }
  };


  toggleButton.addEventListener("click", function () {
    const loggedIn = localStorage.getItem("loggedIn");

    if (loggedIn === "true") {
      logout();
    } else {
      window.location.href = 'login.html';
    }

    // Update link text after toggling loggedIn status
    updateLinkText();
  });
});