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
  return false;  // To block from loading a new page
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
    }else{
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


document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    checkAvailability();
  });
});





