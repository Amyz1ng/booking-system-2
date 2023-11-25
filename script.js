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

function displayReservations(reservations) {
  const reservationsTableBody = document.querySelector('#reservations-table tbody');
  console.log("Check", reservations)
  // Clear any existing rows in the table body
  reservationsTableBody.innerHTML = '';

  reservations.forEach(reservation => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${reservation.name}</td>
      <td>${reservation.email}</td>
      <td>${reservation.date}</td>
      <td>${reservation.time}</td>
      <td>${reservation.number_of_people}</td>
      <td>${reservation.booking_information}</td>
    `;

    reservationsTableBody.appendChild(row);
  });
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
    email: localStorage.getItem("email"),
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

async function getBookings(email) {
  try {
    const response = await fetch(`https://bookingsystem2-9ca46070b498.herokuapp.com/reservations/${email}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();

    displayReservations(data.reservations);
  } catch (error) {
    console.error('There was a problem with the fetch operation:', error);
  }
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

async function book() {
  const data = {
    name: document.getElementById('fullname').value,
    email: localStorage.getItem("email"),
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
      document.getElementById('numberofpeople').value = '';
      document.getElementById('date').value = '';
      document.getElementById('time').value = '';
      document.getElementById('bookinginfomation').value = '';
      alert('Booking successful!');
      getBookings(localStorage.getItem("email"));
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function registerUser(email, password) {
  const requestData = {
    email: email,
    password: password
  };

  fetch('/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(requestData)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      alert("User has been registered!")
      window.location.href = 'contact.html';
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
    });
}

function isValidEmail(email) {
  // Basic email validation using a regular expression
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  console.log('Email', emailRegex.test(email))
  return emailRegex.test(email);
}

function logout() {
  localStorage.clear(); // Clear all items from localStorage
  window.location.href = 'index.html'; // Redirect to the login page
}

function validateForm(email, password, repeatPassword) {
  if (!isValidEmail(email)) {
    alert('Please enter a valid email address');
    return false;
  }
  if (password.length < 6) {
    alert('Password should be at least 6 characters long');
    return false;
  }
  if (password !== repeatPassword) {
    alert('Passwords do not match');
    return false;
  }

  return true; // All validations passed
}

function handleRegistration(event) {
  event.preventDefault(); // Prevents the default form submission

  // Fetch form data
  const email = registrationForm.email.value;
  const password = registrationForm.password.value;
  const repeatPassword = registrationForm.repeatPassword.value;

  if (validateForm(email, password, repeatPassword)) {
    registerUser(email, password)
    registrationForm.reset();
  }
}

document.addEventListener('DOMContentLoaded', function () {
  let signInBtnWeb = document.getElementById("signInBtn");
  let signInBtnMobile = document.getElementById("signInBtnMobile");

  const registrationForm = document.getElementById('registrationForm');
  if (registrationForm) {
    registrationForm.removeEventListener('submit', handleRegistration);
    registrationForm.addEventListener('submit', handleRegistration);
  }

  const currentPage = window.location.pathname.split('/').pop();
  const email = localStorage.getItem("email");
  if (currentPage == 'contact.html' && email) {
    console.log('entered');
    getBookings(email);
  }

  if (currentPage == 'contact.html') {
    checkAuthentication();
  }

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
        window.location.href = 'contact.html';
      } else {
        // Handle unsuccessful login, display an error message, etc.
        alert('Login failed. Please try again.');
      }
    });
  }

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