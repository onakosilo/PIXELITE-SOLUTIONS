/* Pixelite Computer Solutions — Part 3 JavaScript */
document.addEventListener("DOMContentLoaded", () => {
  // Accessible hamburger navigation
  const menuButton = document.querySelector(".menu-toggle");
  const navigation = document.querySelector(".primary-navigation");
  if (menuButton && navigation) {
    menuButton.addEventListener("click", () => {
      const isOpen = menuButton.getAttribute("aria-expanded") === "true";
      menuButton.setAttribute("aria-expanded", String(!isOpen));
      menuButton.setAttribute("aria-label", isOpen ? "Open navigation menu" : "Close navigation menu");
      navigation.classList.toggle("is-open", !isOpen);
    });
    navigation.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
      menuButton.setAttribute("aria-expanded", "false");
      menuButton.setAttribute("aria-label", "Open navigation menu");
      navigation.classList.remove("is-open");
    }));
  }

  // Dynamic service search and category filtering
  const search = document.getElementById("serviceSearch");
  const category = document.getElementById("serviceCategory");
  const serviceCards = [...document.querySelectorAll(".service-card")];
  const resultText = document.getElementById("serviceResults");
  function filterServices() {
    if (!search || !category) return;
    const term = search.value.trim().toLowerCase();
    const chosen = category.value;
    let visible = 0;
    serviceCards.forEach(card => {
      const matchesText = card.textContent.toLowerCase().includes(term);
      const matchesCategory = chosen === "all" || card.dataset.category === chosen;
      const show = matchesText && matchesCategory;
      card.hidden = !show;
      if (show) visible++;
    });
    if (resultText) resultText.textContent = `${visible} service${visible === 1 ? "" : "s"} found.`;
  }
  search?.addEventListener("input", filterServices);
  category?.addEventListener("change", filterServices);
  if (serviceCards.length) filterServices();

  // Indicative quote calculator
  const serviceSelect = document.getElementById("service");
  const urgencySelect = document.getElementById("urgency");
  const quoteOutput = document.getElementById("quoteEstimate");
  const prices = {
    laptop: [350, 850], pc: [400, 950], upgrade: [250, 600],
    virus: [300, 650], data: [500, 1500], gaming: [250, 500], other: [300, 900]
  };
  function updateQuote() {
    if (!serviceSelect || !quoteOutput) return;
    const range = prices[serviceSelect.value];
    if (!range) { quoteOutput.textContent = "Select a service to view an indicative estimate."; return; }
    const multiplier = urgencySelect?.value === "priority" ? 1.25 : 1;
    const low = Math.round(range[0] * multiplier / 10) * 10;
    const high = Math.round(range[1] * multiplier / 10) * 10;
    quoteOutput.textContent = `Estimated range: R${low.toLocaleString("en-ZA")} – R${high.toLocaleString("en-ZA")}${multiplier > 1 ? " (priority estimate)" : ""}.`;
  }
  serviceSelect?.addEventListener("change", updateQuote);
  urgencySelect?.addEventListener("change", updateQuote);

  // Reusable inline validation helpers
  const setError = (input, message) => {
    const error = document.getElementById(`${input.id}Error`);
    input.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
    return !message;
  };
  const validName = value => value.trim().length >= 2;
  const validPhone = value => /^(\+27|0)[0-9]{9}$/.test(value.replace(/[\s-]/g, ""));
  const validEmail = value => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());

  // Service enquiry: validates and presents a service-specific response.
  const enquiryForm = document.getElementById("enquiryForm");
  enquiryForm?.addEventListener("submit", event => {
    event.preventDefault();
    const fields = [
      [document.getElementById("name"), validName(document.getElementById("name").value) ? "" : "Please enter your full name (at least 2 characters)."],
      [document.getElementById("email"), validEmail(document.getElementById("email").value) ? "" : "Enter a valid email address."],
      [document.getElementById("phone"), validPhone(document.getElementById("phone").value) ? "" : "Enter a valid South African number, e.g. 0821234567 or +27821234567."],
      [document.getElementById("service"), document.getElementById("service").value ? "" : "Please select the service you need."],
      [document.getElementById("message"), document.getElementById("message").value.trim().length >= 10 ? "" : "Please describe your issue in at least 10 characters."]
    ];
    let valid = true;
    fields.forEach(([input, error]) => { if (!setError(input, error)) valid = false; });
    const feedback = document.getElementById("enquiryFeedback");
    if (!valid) { feedback.textContent = "Please correct the highlighted fields and submit again."; fields.find(([input,error]) => error)?.[0].focus(); return; }
    const serviceName = document.getElementById("service").selectedOptions[0].text;
    feedback.textContent = `Thank you, ${document.getElementById("name").value.trim()}. Your ${serviceName.toLowerCase()} enquiry has been checked. ${quoteOutput?.textContent || "Our team can discuss the next steps with you."} This demonstration does not transmit your details; please use the contact details on the Contact page to reach the business.`;
    feedback.classList.add("success-message");
  });

  // General contact message: validate, then open a pre-addressed email draft.
  const contactForm = document.getElementById("contactForm");
  contactForm?.addEventListener("submit", event => {
    event.preventDefault();
    const name = document.getElementById("contactName");
    const email = document.getElementById("contactEmail");
    const phone = document.getElementById("contactPhone");
    const type = document.getElementById("messageType");
    const message = document.getElementById("contactMessage");
    const fields = [
      [name, validName(name.value) ? "" : "Please enter your name (at least 2 characters)."],
      [email, validEmail(email.value) ? "" : "Enter a valid email address."],
      [phone, !phone.value.trim() || validPhone(phone.value) ? "" : "Enter a valid South African phone number or leave this field blank."],
      [type, type.value ? "" : "Please choose a message type."],
      [message, message.value.trim().length >= 10 ? "" : "Your message must contain at least 10 characters."]
    ];
    let valid = true;
    fields.forEach(([input,error]) => { if (!setError(input,error)) valid = false; });
    const feedback = document.getElementById("contactFeedback");
    if (!valid) { feedback.textContent = "Please correct the highlighted fields."; fields.find(([input,error]) => error)?.[0].focus(); return; }
    const subject = encodeURIComponent(`Pixelite website: ${type.value}`);
    const body = encodeURIComponent(`Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\nPhone: ${phone.value.trim() || "Not supplied"}\nMessage type: ${type.value}\n\nMessage:\n${message.value.trim()}`);
    feedback.textContent = "Your details have been validated. Your email application should open with the message ready to review and send.";
    window.location.href = `mailto:info@pixelite.co.za?subject=${subject}&body=${body}`;
  });
});
