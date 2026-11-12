// Testimonials: show a fixed three-card window on desktop. The selected
// testimonial moves to the right edge of the visible window (when possible).
const testimonialTrack = document.getElementById("testimonial-track");
const testimonialItems = Array.isArray(window.testimonials) ? window.testimonials : [];
const testimonialViewport = document.querySelector(".testimonial-marquee");
const testimonialModal = document.getElementById("testimonial-modal");
const testimonialDots = document.getElementById("testimonial-dots");
let activeTestimonialIndex = 0;

function createTestimonialCard(item) {
  const card = document.createElement("button");
  card.type = "button";
  card.className = "testimonial-card";
  card.setAttribute("aria-label", `Read full recommendation from ${item.name || "colleague"}`);
  const stars = document.createElement("div");
  stars.className = "testimonial-stars";
  stars.textContent = "★★★★★";
  const quote = document.createElement("blockquote");
  const fullQuote = item.quote || "";
  quote.textContent = `“${fullQuote.length > 145 ? fullQuote.slice(0, 145).trimEnd() + "…" : fullQuote}”`;
  quote.className = "testimonial-card-quote";
  const person = document.createElement("div");
  person.className = "testimonial-person";
  const avatar = document.createElement("div");
  avatar.className = "testimonial-avatar";
  avatar.textContent = item.initials || "";
  const details = document.createElement("div");
  const name = document.createElement("strong");
  name.textContent = item.name || "Colleague name";
  const role = document.createElement("span");
  role.textContent = item.role || "Colleague";
  details.append(name, role);
  person.append(avatar, details);
  card.append(stars, quote, person);
  card.addEventListener("click", () => openTestimonial(item));
  return card;
}

function openTestimonial(item) {
  const modalQuote = document.getElementById("testimonial-modal-quote");
  modalQuote.textContent = `“${item.quote || ""}”`;
  document.getElementById("testimonial-modal-name").textContent = item.name || "Colleague name";
  document.getElementById("testimonial-modal-role").textContent = item.role || "Colleague";
  document.getElementById("testimonial-modal-avatar").textContent = item.initials || "";
  testimonialModal.showModal();
}

function visibleTestimonialCount() {
  if (window.matchMedia("(max-width: 560px)").matches) return 1;
  if (window.matchMedia("(max-width: 800px)").matches) return 2;
  return 3;
}

function updateTestimonialDots() {
  if (!testimonialDots) return;
  [...testimonialDots.children].forEach((dot, index) => {
    const active = index === activeTestimonialIndex;
    dot.classList.toggle("active", active);
    dot.setAttribute("aria-current", active ? "true" : "false");
  });
}

function updateTestimonialArrows() {
  const previous = document.getElementById("testimonial-prev");
  const next = document.getElementById("testimonial-next");
  if (previous) previous.disabled = activeTestimonialIndex === 0;
  if (next) next.disabled = activeTestimonialIndex === testimonialItems.length - 1;
}

function positionTestimonialTrack(animate = true) {
  if (!testimonialTrack || !testimonialItems.length) return;
  const visibleCount = visibleTestimonialCount();
  const maxFirstVisible = Math.max(0, testimonialItems.length - visibleCount);
  // Keep the selected card at the right of the visible group, except at the start.
  const firstVisible = Math.min(Math.max(0, activeTestimonialIndex - visibleCount + 1), maxFirstVisible);
  const firstCard = testimonialTrack.children[firstVisible];
  if (!firstCard) return;
  testimonialTrack.classList.toggle("no-transition", !animate);
  const cardOffset = firstCard.getBoundingClientRect().left - testimonialTrack.getBoundingClientRect().left;
  testimonialTrack.style.transform = `translate3d(${-cardOffset}px, 0, 0)`;
  if (!animate) requestAnimationFrame(() => testimonialTrack.classList.remove("no-transition"));
}

function goToTestimonial(index) {
  if (!testimonialTrack || !testimonialViewport || !testimonialItems.length) return;
  activeTestimonialIndex = Math.max(0, Math.min(index, testimonialItems.length - 1));
  positionTestimonialTrack(true);
  updateTestimonialDots();
  updateTestimonialArrows();
}

if (testimonialTrack && testimonialItems.length) {
  testimonialItems.forEach((item, index) => {
    testimonialTrack.appendChild(createTestimonialCard(item));
    const dot = document.createElement("button");
    dot.type = "button";
    dot.className = "testimonial-dot";
    dot.setAttribute("aria-label", `Go to testimonial ${index + 1}`);
    dot.addEventListener("click", () => goToTestimonial(index));
    testimonialDots.appendChild(dot);
  });
  positionTestimonialTrack(false);
  updateTestimonialDots();
  updateTestimonialArrows();
}

document.getElementById("testimonial-prev")?.addEventListener("click", () => goToTestimonial(activeTestimonialIndex - 1));
document.getElementById("testimonial-next")?.addEventListener("click", () => goToTestimonial(activeTestimonialIndex + 1));
window.addEventListener("resize", () => positionTestimonialTrack(false));

document.querySelector(".testimonial-modal-close")?.addEventListener("click", () => testimonialModal.close());
testimonialModal?.addEventListener("click", event => {
  if (event.target === testimonialModal) testimonialModal.close();
});

const menuToggle = document.querySelector(".menu-toggle");
const navLinks = document.querySelector(".nav-links");

menuToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.textContent = isOpen ? "×" : "☰";
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();


// Submit the contact form in a hidden iframe so visitors stay on this page.
const messageForm = document.getElementById("message-form");
const formTarget = document.getElementById("google-form-target");
const sendMessageButton = document.getElementById("send-message-button");
const formStatus = document.getElementById("form-status");

if (messageForm && formTarget && sendMessageButton && formStatus) {
  messageForm.addEventListener("submit", () => {
    messageForm.dataset.submitting = "true";
    sendMessageButton.disabled = true;
    sendMessageButton.textContent = "Sending...";
    formStatus.textContent = "Sending your message...";
  });

  formTarget.addEventListener("load", () => {
    // The iframe's initial about:blank load happens before submission.
    if (messageForm.dataset.submitting !== "true") return;

    delete messageForm.dataset.submitting;
    messageForm.reset();
    sendMessageButton.disabled = false;
    sendMessageButton.innerHTML = 'Send Message <span>↗</span>';
    formStatus.textContent = "Your response has been recorded. Thank you for reaching out!";
    formStatus.classList.add("form-status-success");
  });
}
