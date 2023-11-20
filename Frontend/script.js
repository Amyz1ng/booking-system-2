// document.addEventListener("DOMContentLoaded", function() {
//     // This code will run after the DOM is fully loaded

//     document.querySelector(".bg-color-three-reasons").addEventListener("mousemove", (e) => {
//         const backgroundImage = document.getElementById("background-image");
//         const container = document.querySelector(".bg-color-three-reasons");

//         // Get the mouse position relative to the container
//         const mouseX = e.clientX - container.getBoundingClientRect().left;
//         const mouseY = e.clientY - container.getBoundingClientRect().top;

//         // Calculate the image position based on the mouse position
//         const imageX = (mouseX / container.offsetWidth - 0.5) * 30;
//         const imageY = (mouseY / container.offsetHeight - 0.5) * 30;

//         // Apply the transformation to the background image
//         backgroundImage.style.transform = `translate(${imageX}px, ${imageY}px)`;
//     });

//     document.querySelector(".bg-color-three-reasons").addEventListener("mouseleave", () => {
//         const backgroundImage = document.getElementById("background-image");

//         // Reset the background image's position when the mouse leaves the container
//         backgroundImage.style.transform = "translate(0, 0)";
//     });

//     console.log("mouse moved");
// });

// script.js

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

function book() {
  const data = {
    name: document.getElementById('fullname').value,
    email: document.getElementById('emailaddress').value,
    number_of_people: document.getElementById('numberofpeople').value,
    date: document.getElementById('date').value,
    time: document.getElementById('time').value,
    booking_information: document.getElementById('bookinginfomation').value
  };

  fetch('https://5000-amyz1ng-bookingsystem-mg5nw5674rr.ws-eu106.gitpod.io/insert', {
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
      alert('Booking successful!123');
      // Handle successful response here
    })
    .catch(error => {
      console.error('There was a problem with the fetch operation:', error);
      // Handle error here
    });
}

function script(form) {
  console.log("Form submitted");
  console.log("Name:", form.elements.name.value);

  return false;
}

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('myForm');

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    book();
  });
});





