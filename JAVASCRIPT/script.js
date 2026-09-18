/* ==============================
   PIXELITE FORM FUNCTIONS
   ============================== */


// Enquiry Form

const enquiryForm = document.getElementById("enquiryForm");

if (enquiryForm) {

    enquiryForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert(
            "Thank you for your enquiry! " +
            "A Pixelite team member will contact you shortly."
        );

        enquiryForm.reset();

    });

}


// Contact Form

const contactForm = document.getElementById("contactForm");

if (contactForm) {

    contactForm.addEventListener("submit", function(event) {

        event.preventDefault();

        alert(
            "Thank you for contacting Pixelite! " +
            "We will respond to your message as soon as possible."
        );

        contactForm.reset();

    });

}