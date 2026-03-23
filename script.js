// --- TAB SWITCHING ---
function showTab(tabId) {
  document.querySelectorAll(".tab").forEach(tab => {
    tab.classList.remove("active");
  });

  document.getElementById(tabId).classList.add("active");
}

// --- PAYMENT TRACKER ---
let total = 0;
let goal = 3600;

function addPayment() {
  const input = document.getElementById("paymentInput");
  const value = Number(input.value);

  if (!value) return;

  total += value;

  document.getElementById("total").textContent = total;
  document.getElementById("remaining").textContent = goal - total;

  let percent = (total / goal) * 100;
  document.getElementById("progressBar").style.width = percent + "%";

  saveData();

  input.value = "";
}

function updateAttendance() {
  const checkboxes = document.querySelectorAll("#calendar input[type='checkbox']");

  let total = 0;
  let checked = 0;

  checkboxes.forEach(box => {
    total++;
    if (box.checked) checked++;
  });

  let percent = total === 0 ? 0 : Math.round((checked / total) * 100);

  document.getElementById("attendancePercent").textContent = percent + "%";
}

function saveData() {
  localStorage.setItem("total", total);
}

function loadData() {
  const saved = localStorage.getItem("total");

  if (saved) {
    total = Number(saved);

    document.getElementById("total").textContent = total;
    document.getElementById("remaining").textContent = goal - total;

    let percent = (total / goal) * 100;
    document.getElementById("progressBar").style.width = percent + "%";
  }
}

// --- CALENDAR ---
function generateCalendar() {
  const calendar = document.getElementById("calendar");
  if (!calendar) return;

  calendar.innerHTML = "";

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  for (let week = 1; week <= 10; week++) {
    // Week label
    const label = document.createElement("div");
    label.className = "week-label";
    label.textContent = "Week " + week;
    calendar.appendChild(label);

    for (let day = 0; day < 7; day++) {
      const dayName = days[day];

      const dayBox = document.createElement("div");
      dayBox.className = "day";

      const title = document.createElement("div");
      title.innerHTML = "<strong>" + dayName + "</strong>";
      dayBox.appendChild(title);

      // Unique ID for saving
      const dayKey = `week${week}-${dayName}`;

      // --- CLASS LOGIC ---
      let classes = [];

      if (["Mon", "Wed", "Fri"].includes(dayName)) {
        classes.push("Music Theory (9am)");
        classes.push("Astronomy (1pm)");
        classes.push("Writing (2pm)");
      }

      if (["Tue", "Thu"].includes(dayName)) {
        classes.push("Music Culture (8:30am)");
      }

      if (dayName === "Fri") {
        classes.push("Music Culture (10am)");
      }

      // --- CREATE CHECKBOXES ---
      classes.forEach((cls, i) => {
        const id = `${dayKey}-class${i}`;

        const wrapper = document.createElement("div");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = id;

        // Load saved state
        checkbox.checked = localStorage.getItem(id) === "true";

       checkbox.addEventListener("change", () => {
        localStorage.setItem(id, checkbox.checked);
        updateAttendance(); // 🔥 update live
        });

        const label = document.createElement("label");
        label.htmlFor = id;
        label.textContent = cls;

        wrapper.appendChild(checkbox);
        wrapper.appendChild(label);

        dayBox.appendChild(wrapper);
      });

      calendar.appendChild(dayBox);
    }
  }
}
function resetTracker() {
  if (!confirm("Are you sure you want to reset your progress?")) return;

  total = 0;

  document.getElementById("total").textContent = 0;
  document.getElementById("remaining").textContent = goal;
  document.getElementById("progressBar").style.width = "0%";

  localStorage.removeItem("total");
}

// --- RUN EVERYTHING AFTER PAGE LOADS ---
document.addEventListener("DOMContentLoaded", () => {
  loadData();
  generateCalendar();
  updateAttendance(); // 🔥 add this
});