// Correo que recibe las solicitudes de cotización. Cámbialo por el correo real del estudio.
const CONTACT_EMAIL = "contacto@zaytencostudios.com";

document.documentElement.classList.add("js");
document.getElementById("year").textContent = new Date().getFullYear();

// Header border on scroll
const header = document.querySelector(".site-header");
const onScroll = () => header.classList.toggle("scrolled", window.scrollY > 8);
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

// Mobile menu
const toggle = document.querySelector(".nav-toggle");
const nav = document.getElementById("nav");
const setMenu = (open) => {
  nav.classList.toggle("open", open);
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Cerrar menú" : "Abrir menú");
};
toggle.addEventListener("click", () => setMenu(!nav.classList.contains("open")));
nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

// Reveal on scroll
const reveals = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add("visible"));
}

// Quote form: validates, then opens the visitor's email app with the request filled in
const form = document.getElementById("quote-form");
const status = document.getElementById("form-status");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const fields = [...form.querySelectorAll("input, select, textarea")];
  fields.forEach((f) => f.classList.toggle("invalid", !f.checkValidity()));
  const firstInvalid = fields.find((f) => !f.checkValidity());

  if (firstInvalid) {
    status.className = "form-status error";
    status.textContent = "Por favor completa todos los campos con datos válidos.";
    firstInvalid.focus();
    return;
  }

  const data = Object.fromEntries(new FormData(form));
  const subject = `Solicitud de cotización — ${data.servicio}`;
  const body =
    `Nombre: ${data.nombre}\n` +
    `Correo: ${data.email}\n` +
    `Tipo de proyecto: ${data.servicio}\n\n` +
    `${data.mensaje}`;

  window.location.href =
    `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  status.className = "form-status ok";
  status.textContent = "Se abrió tu aplicación de correo con la solicitud lista para enviar.";
});

form.addEventListener("input", (e) => e.target.classList.remove("invalid"));
