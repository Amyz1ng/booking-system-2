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
    username: loginForm.username.value,
    password: loginForm.password.value
  };

  try {
    const response = await fetch('YOUR_LOGIN_ENDPOINT_URL', { // Replace with your login endpoint URL
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
    // Optionally, you can handle the successful login response here

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
    console.log('data', data);
    if (!data.available) {
      alert('The selected date and time are not available. Please choose another.');
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

async function checkAuthentication() {
  try {
    const currentPage = window.location.pathname.split('/').pop(); // Get current page URL

    if (currentPage !== 'login.html') { // Check if the current page is not login.html
      const response = await fetch('https://bookingsystem2-9ca46070b498.herokuapp.com/checkauthentication', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add your authorization headers if required
        }
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      console.log('Authentication status:', data);

      if (!data.authenticated) {
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
  checkAuthentication();

  const form = document.getElementById('myForm');
  if (form) {
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
        window.location.href = 'index.html';
      } else {
        // Handle unsuccessful login, display an error message, etc.
        alert('Login failed. Please try again.');
      }
    });
  }
});