// 1. Sample Events Data
const eventsData = [
  {
    id: 1,
    title: "Modern Web Zero-to-Hero",
    category: "web",
    categoryLabel: "Web Dev",
    date: "Nov 22, 2026 • 2:00 PM",
    venue: "CS Seminar Hall",
    description: "Build and deploy your first responsive portfolio website using HTML5, CSS Grid, and vanilla JavaScript.",
    seats: 18
  },
  {
    id: 2,
    title: "Building AI Agents with Python",
    category: "ai",
    categoryLabel: "AI / ML",
    date: "Nov 25, 2026 • 4:00 PM",
    venue: "Innovation Lab 2",
    description: "Hands-on session on connecting large language models to real-world campus tools and APIs.",
    seats: 12
  },
  {
    id: 3,
    title: "Web & Cloud Buildathon 2026",
    category: "hackathon",
    categoryLabel: "Hackathon",
    date: "Nov 28, 2026 • 9:00 AM",
    venue: "Main Auditorium",
    description: "12-hour team sprint to prototype, test, and deploy solutions for local campus challenges.",
    seats: 40
  },
  {
    id: 4,
    title: "Git, GitHub & Open Source 101",
    category: "web",
    categoryLabel: "Web Dev",
    date: "Dec 02, 2026 • 3:30 PM",
    venue: "Lab 1",
    description: "Learn branching, pull requests, and how to make your first open-source contribution.",
    seats: 25
  },
  {
    id: 5,
    title: "Intro to Neural Networks",
    category: "ai",
    categoryLabel: "AI / ML",
    date: "Dec 05, 2026 • 2:00 PM",
    venue: "CS Seminar Hall",
    description: "Understand how image classifiers work under the hood and train a model in your browser.",
    seats: 15
  },
  {
    id: 6,
    title: "Winter UI/UX Design Jam",
    category: "hackathon",
    categoryLabel: "Hackathon",
    date: "Dec 09, 2026 • 10:00 AM",
    venue: "Design Studio",
    description: "Redesign everyday student apps for accessibility, speed, and clean mobile experience.",
    seats: 20
  }
];

// Track registered events in localStorage
let registeredEvents = JSON.parse(localStorage.getItem("nexus_registrations") || "[]");
let activeFilter = "all";
let searchQuery = "";
let currentModalEvent = "";

// 2. Render Events Grid
const eventsGrid = document.getElementById("events-grid");

function renderEvents() {
  const filtered = eventsData.filter((ev) => {
    const matchesCategory = activeFilter === "all" || ev.category === activeFilter;
    const matchesSearch =
      ev.title.toLowerCase().includes(searchQuery) ||
      ev.description.toLowerCase().includes(searchQuery);
    return matchesCategory && matchesSearch;
  });

  if (filtered.length === 0) {
    eventsGrid.innerHTML = `<p style="color: var(--text-muted);">No workshops match your search. Try another keyword.</p>`;
    return;
  }

  eventsGrid.innerHTML = filtered
    .map((ev) => {
      const isRegistered = registeredEvents.includes(ev.title);
      return `
        <div class="card event-card">
          <div>
            <div class="event-category">${ev.categoryLabel}</div>
            <h3>${ev.title}</h3>
            <p class="event-meta">📅 ${ev.date} • 📍 ${ev.venue}</p>
            <p>${ev.description}</p>
          </div>
          <div class="event-footer">
            <span class="seats-left">${isRegistered ? "Pass Reserved" : `${ev.seats} seats left`}</span>
            <button 
              class="btn btn-sm ${isRegistered ? "btn-outline" : "btn-primary"}" 
              onclick="openEventModal('${ev.title}')"
            >
              ${isRegistered ? "Registered ✓" : "Register"}
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// 3. Filter & Search Listeners
document.querySelectorAll(".pill").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".pill").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    activeFilter = btn.dataset.filter;
    renderEvents();
  });
});

document.getElementById("event-search").addEventListener("input", (e) => {
  searchQuery = e.target.value.toLowerCase().trim();
  renderEvents();
});

// 4. Dark Mode Toggle (Persisted)
const themeToggle = document.getElementById("theme-toggle");
if (localStorage.getItem("nexus_theme") === "dark") {
  document.body.classList.add("dark");
}

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  const isDark = document.body.classList.contains("dark");
  localStorage.setItem("nexus_theme", isDark ? "dark" : "light");
});

// 5. Mobile Navigation Toggle
const menuToggle = document.getElementById("menu-toggle");
const navLinks = document.getElementById("nav-links");

menuToggle.addEventListener("click", () => {
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("active"));
});

// 6. FAQ Accordion
document.querySelectorAll(".accordion-header").forEach((header) => {
  header.addEventListener("click", () => {
    const item = header.parentElement;
    item.classList.toggle("open");
    header.querySelector("span").textContent = item.classList.contains("open") ? "−" : "+";
  });
});

// 7. Modal Handling
const modalOverlay = document.getElementById("modal-overlay");
const modalTitle = document.getElementById("modal-title");
const modalSubtitle = document.getElementById("modal-subtitle");
const regForm = document.getElementById("registration-form");
const modalSuccess = document.getElementById("modal-success");

function openEventModal(eventName) {
  currentModalEvent = eventName;
  modalTitle.textContent = `Register: ${eventName}`;
  modalSubtitle.textContent = "Enter your details to reserve your workshop seat.";
  modalSuccess.classList.add("hidden");
  regForm.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
}

function openJoinModal() {
  currentModalEvent = "Club Membership";
  modalTitle.textContent = "Join NexusTech Club";
  modalSubtitle.textContent = "Apply to join our 2026 campus builder cohorts.";
  modalSuccess.classList.add("hidden");
  regForm.classList.remove("hidden");
  modalOverlay.classList.remove("hidden");
}

function closeModal() {
  modalOverlay.classList.add("hidden");
}

modalOverlay.addEventListener("click", (e) => {
  if (e.target === modalOverlay) closeModal();
});

regForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (currentModalEvent && !registeredEvents.includes(currentModalEvent)) {
    registeredEvents.push(currentModalEvent);
    localStorage.setItem("nexus_registrations", JSON.stringify(registeredEvents));
  }
  regForm.classList.add("hidden");
  modalSuccess.classList.remove("hidden");
  regForm.reset();
  renderEvents();
});

// 8. Live Countdown Timer (Target: Nov 28, 2026)
const targetDate = new Date("November 28, 2026 09:00:00").getTime();

function updateCountdown() {
  const now = Date.now();
  const diff = Math.max(0, targetDate - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const mins = Math.floor((diff / (1000 * 60)) % 60);

  document.getElementById("days").textContent = String(days).padStart(2, "0");
  document.getElementById("hours").textContent = String(hours).padStart(2, "0");
  document.getElementById("mins").textContent = String(mins).padStart(2, "0");
}

setInterval(updateCountdown, 1000);
updateCountdown();
renderEvents();