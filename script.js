// SCREENING QUESTIONS DATABASE
const screeningQuestions = {
  mammogram: [
    "First time having a mammogram?",
    "When was your last mammogram?",
    "Where was your last mammogram?",
    "Breast implants?",
    "Any symptoms of pain, lumps or discharge on breasts?",
    "Any family history of breast cancer?",
    "Weight",
    "Height",
  ],
  xray: [
    "Have you had any previous x-rays or imaging of this area?",
    "Are you pregnant or possibly pregnant?",
    "Weight",
    "Height",
  ],
  bonedensity: [
    "First time having a bone density scan?",
    "Are you currently taking any calcium supplements or medications for bone loss?",
    "Have you ever been diagnosed with osteoporosis or osteopenia?",
    "Weight",
    "Height",
  ],
  mri: [
    "First time having an MRI?",
    "Do you have any metal implants, pacemaker, or medical devices?",
    "Do you have claustrophobia?",
    "Are you able to lie still for 30–60 minutes?",
    "Are you pregnant or possibly pregnant?",
    "Are you allergic to contrast?",
    "Weight",
    "Height",
  ],
  ctscan: [
    "First time having a CT scan?",
    "Do you have any allergies, especially to contrast dye or iodine?",
    "Do you have kidney disease or diabetes?",
    "Have you had a CT scan with contrast before? Any reactions?",
    "Do you have any metal implants or hardware?",
    "Are you pregnant or possibly pregnant?",
    "Weight",
    "Height",
  ],
  fluoroscopy: [
    "First time having a fluoroscopy?",
    "Do you have any allergies to contrast dye or barium?",
    "Are you able to follow instructions during the exam (swallow, hold breath, etc.)?",
    "When was your last meal or drink?",
    "Are you pregnant or possibly pregnant?",
    "Weight",
    "Height",
  ],
  nuclearmedicine: [
    "Have you had any nuclear medicine scans before?",
    "Do you have any allergies to medications or contrast agents?",
    "Are you diabetic? If so, what medications are you taking?",
    "Have you had any recent imaging with contrast in the last 48 hours?",
    "Are you pregnant or possibly pregnant?",
    "Are you currently breastfeeding?",
    "Weight",
    "Height",
  ],
};

// RENDER SCREENING QUESTIONS
function renderScreeningQuestions(examType) {
  const content = document.getElementById("screening-content");
  content.innerHTML = "";

  const questions = screeningQuestions[examType];
  if (!questions) return;

  questions.forEach((question, index) => {
    const field = document.createElement("div");
    field.className = "accordion-field";

    const label = document.createElement("label");
    label.setAttribute("for", `sq-${index}`);
    label.textContent = question;

    const input = document.createElement("input");
    input.id = `sq-${index}`;
    input.type = "text";
    input.dataset.sqIndex = index;

    input.addEventListener("input", checkScreeningComplete);

    field.appendChild(label);
    field.appendChild(input);
    content.appendChild(field);
  });

  // Add actions row with Save button (disabled by default)
  const actions = document.createElement("div");
  actions.className = "accordion-actions";
  actions.innerHTML = `
    <div class="primary-actions">
      <button class="save-button" id="save-screening-btn" disabled
        style="background:#e5e7eb; color:#9ca3af; cursor: auto;">
        Save
      </button>
    </div>
  `;
  content.appendChild(actions);

  // Store which exam is currently loaded
  content.dataset.currentExam = examType;

  // Attach save handler
  document
    .getElementById("save-screening-btn")
    .addEventListener("click", saveScreeningQuestions);
}

// SAVE SCREENING QUESTIONS
function saveScreeningQuestions() {
  const content = document.getElementById("screening-content");
  const inputs = content.querySelectorAll("input[data-sq-index]");
  const badge = document.getElementById("badge-screening");

  // Collect answers
  const answers = [];
  inputs.forEach((input) => {
    answers.push({
      question: input.previousElementSibling.textContent,
      answer: input.value.trim(),
    });
  });

  // Clear content
  content.innerHTML = "";

  // Build summary view
  const summary = document.createElement("div");
  summary.className = "screening-summary";
  summary.id = "screening-summary";

  answers.forEach(({ question, answer }) => {
    const field = document.createElement("div");
    field.className = "physician-view-field";

    const lbl = document.createElement("label");
    lbl.textContent = question;

    const val = document.createElement("span");
    val.textContent = answer;

    field.appendChild(lbl);
    field.appendChild(val);
    summary.appendChild(field);
  });

  // Edit button
  const actions = document.createElement("div");
  actions.className = "accordion-actions";
  actions.innerHTML = `
    <div class="primary-actions">
      <button class="edit-button" id="edit-screening-btn">Edit</button>
    </div>
  `;

  summary.appendChild(actions);
  content.appendChild(summary);

  // Update badge
  badge.textContent = "Complete";
  badge.className = "section-status-badge complete";

  // Edit button — restore inputs with saved answers
  document
    .getElementById("edit-screening-btn")
    .addEventListener("click", () => {
      const currentExam = content.dataset.currentExam || "mammogram";
      renderScreeningQuestions(currentExam);

      // Re-fill answers
      const newInputs = content.querySelectorAll("input[data-sq-index]");
      newInputs.forEach((input, i) => {
        input.value = answers[i]?.answer || "";
      });

      // Re-check completion so Save button state is correct
      checkScreeningComplete();
    });
}

// CHECK IF ALL SCREENING QUESTIONS ARE ANSWERED
function checkScreeningComplete() {
  const content = document.getElementById("screening-content");
  const inputs = content.querySelectorAll("input[data-sq-index]");
  const saveBtn = document.getElementById("save-screening-btn");
  const badge = document.getElementById("badge-screening");

  if (!saveBtn) return;

  const allFilled = Array.from(inputs).every(
    (input) => input.value.trim() !== "",
  );

  if (allFilled) {
    saveBtn.disabled = false;
    saveBtn.style.background = "#2563eb";
    saveBtn.style.color = "#ffffff";
    saveBtn.style.cursor = "pointer";
    badge.textContent = "Complete";
    badge.className = "section-status-badge complete";
  } else {
    saveBtn.disabled = true;
    saveBtn.style.background = "#e5e7eb";
    saveBtn.style.color = "#9ca3af";
    saveBtn.style.cursor = "not-allowed";
    badge.textContent = "Incomplete";
    badge.className = "section-status-badge incomplete";
  }
}

// For now, load mammogram questions by default
renderScreeningQuestions("mammogram");

// DOCTOR DATABASE
const doctors = [
  {
    id: "dr1",
    name: "Salazar Slytherin",
    npi: "1234567890",
    offices: [
      {
        label: "Main Office",
        address: "0110 Sneaky St, Miami, FL 33101",
        phone: "305-111-2222",
        fax: "305-111-2223",
      },
      {
        label: "North Office",
        address: "500 Brickell Ave, Miami, FL 33131",
        phone: "305-333-4444",
        fax: "305-333-4445",
      },
    ],
  },
  {
    id: "dr2",
    name: "Helga Hufflepuff",
    npi: "0987654321",
    offices: [
      {
        label: "Downtown Clinic",
        address: "200 Flagler St, Miami, FL 33130",
        phone: "305-555-6666",
        fax: "305-555-6667",
      },
    ],
  },
  {
    id: "dr3",
    name: "Rowena Ravenclaw",
    npi: "1122334455",
    offices: [
      {
        label: "West Office",
        address: "800 NW 7th Ave, Miami, FL 33136",
        phone: "305-777-8888",
        fax: "305-777-8889",
      },
      {
        label: "South Office",
        address: "1200 SW 27th Ave, Miami, FL 33145",
        phone: "305-999-0000",
        fax: "305-999-0001",
      },
    ],
  },
  {
    id: "dr4",
    name: "Godric Gryffindor",
    npi: "2233445566",
    offices: [
      {
        label: "Coral Gables Office",
        address: "2525 Ponce de Leon Blvd, Coral Gables, FL 33134",
        phone: "305-222-3333",
        fax: "305-222-3334",
      },
    ],
  },
  {
    id: "dr5",
    name: "Poppy Pomfrey",
    npi: "3344556677",
    offices: [
      {
        label: "Kendall Office",
        address: "11200 SW 88th St, Miami, FL 33176",
        phone: "305-444-5555",
        fax: "305-444-5556",
      },
      {
        label: "Doral Office",
        address: "3400 NW 87th Ave, Doral, FL 33172",
        phone: "305-666-7777",
        fax: "305-666-7778",
      },
    ],
  },
];

// ZOOM VARIABLES
let currentScale = 1;
const SCALE_STEP = 0.2;

// DRAG VARIABLES (for click + hold panning)
let isDragging = false;
let startX = 0;
let startY = 0;
let scrollLeft = 0;
let scrollTop = 0;

// DELETE FILE
let fileToDelete = null;

// CLINICS ''DATABASE''

const clinics = [
  {
    id: "clinic1",
    name: "Tejones Medical Center",
    rooms: ["Yellow Room", "Black Room"],
  },
  {
    id: "clinic2",
    name: "Culebras Diagnostics",
    rooms: ["Green Room", "Silver Room"],
  },
  {
    id: "clinic3",
    name: "Aguilas Imaging",
    rooms: ["Blue Room", "Bronze Room"],
  },
  {
    id: "clinic4",
    name: "Leones Clinics",
    rooms: ["Red Room", "Gold Room"],
  },
];

// GENERATE TIME SLOTS FOR EXAMS
let selectedDate = null;
let selectedTime = null;

// POPULATING CLINICS
const clinicSelect = document.getElementById("clinic");
const roomSelect = document.getElementById("room");
const timeSelect = document.getElementById("select-time");

// Populate clinic dropdown
clinics.forEach((clinic) => {
  const option = document.createElement("option");
  option.value = clinic.id;
  option.textContent = clinic.name;
  clinicSelect.appendChild(option);
});

// UPDATE ROOM WHEN DIFFERENT CLINIC IS SELECTED

// CALENDAR GATING — unlock when clinic + room are both selected
function updateCalendarLock() {
  const calendarBody = document.querySelector(".calendar-panel-body");
  const lockedMessage = document.querySelector(".calendar-locked-message");
  const clinicChosen = clinicSelect.value !== "";
  const roomChosen = roomSelect.value !== "";

  if (clinicChosen && roomChosen) {
    calendarBody.classList.remove("calendar-locked");
    if (lockedMessage) lockedMessage.style.display = "none";
  } else {
    calendarBody.classList.add("calendar-locked");
    if (lockedMessage) lockedMessage.style.display = "block";
  }
}

roomSelect.addEventListener("change", updateCalendarLock);

clinicSelect.addEventListener("change", () => {
  const selectedClinicId = clinicSelect.value;

  // Reset room dropdown
  roomSelect.innerHTML = `<option value="">Select room</option>`;

  if (!selectedClinicId) return;

  const selectedClinic = clinics.find(
    (clinic) => clinic.id === selectedClinicId,
  );

  if (!selectedClinic) return;

  selectedClinic.rooms.forEach((room) => {
    const option = document.createElement("option");
    option.value = room;
    option.textContent = room;
    roomSelect.appendChild(option);
  });

  updateCalendarLock();
});

// TOGGLE ACCORDEON

const accordionHeaders = document.querySelectorAll(".accordion-header");

accordionHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const section = header.parentElement;
    section.classList.toggle("open");
  });
});

// NOTES SECTION (INLINE, APPEND-ONLY)

function sortNotes(container, order = "newest") {
  const notes = Array.from(container.querySelectorAll(".note-card"));

  notes.sort((a, b) => {
    const timeA = Number(a.dataset.timestamp);
    const timeB = Number(b.dataset.timestamp);

    return order === "newest" ? timeB - timeA : timeA - timeB;
  });

  notes.forEach((note) => container.appendChild(note));
}

function noteIsTruncated(noteContentEl) {
  return noteContentEl.scrollHeight > noteContentEl.clientHeight;
}

const addNoteBtn = document.querySelector(".add-note-btn");
const notesList = document.querySelector(".notes-list");

const placeholderNote = document.querySelector(".note-content[data-note]");

if (placeholderNote) {
  placeholderNote.textContent =
    "Pt requested later appointment due to work.\n\nWill call back if availability changes.";
}

const notesSort = document.querySelector(".notes-sort");
const modalNotesSort = document.getElementById("modalNotesSort");

if (notesSort) {
  notesSort.addEventListener("change", () => {
    sortNotes(notesList, notesSort.value);

    if (modalNotesSort) {
      modalNotesSort.value = notesSort.value;
    }
  });
}

if (modalNotesSort) {
  modalNotesSort.addEventListener("change", () => {
    notesSort.value = modalNotesSort.value;
    sortNotes(notesList, modalNotesSort.value);
    viewAllBtn.click();
  });
}

addNoteBtn.addEventListener("click", () => {
  // Prevent multiple editors
  if (document.querySelector(".note-editor")) return;

  addNoteBtn.disabled = true;

  const editor = document.createElement("div");
  editor.className = "note-card note-editor";

  editor.innerHTML = `
    <div class="note-meta">
      <span class="note-author">Scheduler – Cozy Badger</span>
      <span class="note-time">New note</span>
    </div>

    <textarea class="note-editor-text" rows="4"
      placeholder="Type your note here..."></textarea>

    <div class="note-actions">
      <button class="save-inline-note">Save</button>
      <button class="cancel-inline-note">Cancel</button>
    </div>
  `;

  notesList.prepend(editor);
  editor.querySelector(".note-editor-text").focus();
});

document.addEventListener("click", (e) => {
  // SAVE note
  if (e.target.classList.contains("save-inline-note")) {
    const editor = e.target.closest(".note-editor");
    const textarea = editor.querySelector(".note-editor-text");
    const text = textarea.value.trim();

    if (!text) return;

    const now = new Date();
    const timestamp = now.getTime();

    const formattedDate = now.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    const formattedTime = now.toLocaleTimeString([], {
      hour: "numeric",
      minute: "2-digit",
    });

    const noteCard = document.createElement("div");
    noteCard.className = "note-card";
    noteCard.dataset.timestamp = timestamp;

    noteCard.innerHTML = `
  <div class="note-meta">
    <span class="note-author">Scheduler – Cozy Badger</span>
    <span class="note-time">${formattedDate} · ${formattedTime}</span>
  </div>

 <div class="note-content">${text}</div>


  <div class="note-actions">
    <button class="delete-note-btn">Delete</button>
  </div>
`;

    editor.replaceWith(noteCard);
    addNoteBtn.disabled = false;
    sortNotes(notesList, notesSort.value);

    //  CHECK IF NOTE IS TRUNCATED
    const noteContent = noteCard.querySelector(".note-content");
    requestAnimationFrame(() => {
      if (noteIsTruncated(noteContent)) {
        const toggleBtn = document.createElement("button");
        toggleBtn.className = "toggle-note-btn";
        toggleBtn.textContent = "View more";

        noteCard.querySelector(".note-actions").prepend(toggleBtn);
      }
    });

    // Replace editor ONCE
    editor.replaceWith(noteCard);
    addNoteBtn.disabled = false;
  }

  // CANCEL note
  if (e.target.classList.contains("cancel-inline-note")) {
    e.target.closest(".note-editor").remove();
    addNoteBtn.disabled = false;
  }

  // DELETE note (training only)
  if (e.target.classList.contains("delete-note-btn")) {
    e.target.closest(".note-card").remove();
  }

  // EXPAND / COLLAPSE note
  if (e.target.classList.contains("toggle-note-btn")) {
    // 🚫 Do nothing if click is inside "View All Notes" modal
    if (e.target.closest("#viewAllNotesModal")) return;

    const noteCard = e.target.closest(".note-card");
    const isExpanded = noteCard.classList.toggle("expanded");

    e.target.textContent = isExpanded ? "View less" : "View more";
  }
});

// ==========================
// VIEW ALL NOTES MODAL
// ==========================

const viewAllBtn = document.querySelector(".view-all-notes-btn");
const viewAllModal = document.getElementById("viewAllNotesModal");
const viewAllBody = viewAllModal.querySelector(".notes-modal-body");
const closeViewAllBtn = viewAllModal.querySelector(".close-view-notes");

viewAllBtn.addEventListener("click", () => {
  if (modalNotesSort) {
    modalNotesSort.value = notesSort.value;
  }

  viewAllBody.innerHTML = "";

  const notes = Array.from(
    document.querySelectorAll(".notes-list .note-card"),
  ).sort((a, b) => {
    const timeA = Number(a.dataset.timestamp);
    const timeB = Number(b.dataset.timestamp);
    return notesSort.value === "newest" ? timeB - timeA : timeA - timeB;
  });

  notes.forEach((note) => {
    const clone = note.cloneNode(true);
    clone.classList.remove("expanded");

    // Remove note action buttons (View more / Delete)
    const actions = clone.querySelector(".note-actions");
    if (actions) actions.remove();
    const toggleBtn = clone.querySelector(".toggle-note-btn");
    if (toggleBtn) toggleBtn.remove();

    // Ensure full content display
    const content = clone.querySelector(".note-content");
    if (content) {
      content.style.maxHeight = "none";
      content.style.overflow = "visible";
      content.style.display = "block";
      content.style.webkitLineClamp = "unset";
    }

    viewAllBody.appendChild(clone);
  });

  viewAllModal.classList.add("active");
  document.body.classList.add("modal-open");
});

closeViewAllBtn.addEventListener("click", () => {
  viewAllModal.classList.remove("active");
  document.body.classList.remove("modal-open");
});

// CALENDAR

let currentDate = new Date();
const today = new Date();
today.setHours(0, 0, 0, 0);

function renderCalendar(date) {
  const grid = document.getElementById("calendar-grid");
  const label = document.getElementById("month-label");

  grid.innerHTML = "";

  const year = date.getFullYear();
  const month = date.getMonth();

  // Month title
  label.textContent = date.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  // First day of month (0 = Sunday)
  const firstDay = new Date(year, month, 1).getDay();

  // Number of days in month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  //  Always render 6 weeks (42 cells)
  const totalCells = 42;
  let dayCounter = 1;
  let nextMonthDay = 1;

  for (let i = 0; i < totalCells; i++) {
    const btn = document.createElement("button");
    btn.classList.add("calendar-day");

    // Valid days of the current month
    if (i >= firstDay && dayCounter <= daysInMonth) {
      btn.textContent = dayCounter;

      const thisDay = new Date(year, month, dayCounter);
      thisDay.setHours(0, 0, 0, 0);

      //  Disable past dates
      if (thisDay < today) {
        btn.disabled = true;
        btn.classList.add("disabled");
      } else {
        btn.addEventListener("click", () => {
          document
            .querySelectorAll(".calendar-day.selected")
            .forEach((d) => d.classList.remove("selected"));

          btn.classList.add("selected");

          selectedDate = thisDay;
          updateTimeSlots(selectedDate);
        });
      }

      // 🔹 Highlight today
      if (thisDay.getTime() === today.getTime()) {
        btn.classList.add("today");
      }

      dayCounter++;
    } else {
      // Days from previous or next month
      btn.disabled = true;
      btn.classList.add("outside-month");

      if (i < firstDay) {
        // Previous month days
        const prevMonth = new Date(year, month, 0);
        const prevMonthDays = prevMonth.getDate();
        btn.textContent = prevMonthDays - (firstDay - 1 - i);
      } else {
        // Next month days
        btn.textContent = nextMonthDay;
        nextMonthDay++;
      }
    }

    grid.appendChild(btn);
  }
}
renderCalendar(currentDate);

document.getElementById("prev-month").addEventListener("click", () => {
  const prevMonth = new Date(currentDate);
  prevMonth.setMonth(prevMonth.getMonth() - 1);

  // Prevent navigating to past months
  if (
    prevMonth.getFullYear() < today.getFullYear() ||
    (prevMonth.getFullYear() === today.getFullYear() &&
      prevMonth.getMonth() < today.getMonth())
  ) {
    return;
  }

  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar(currentDate);
});

document.getElementById("next-month").addEventListener("click", () => {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar(currentDate);
});

// TIME SLOT GENERATOR
function updateTimeSlots(date) {
  timeSelect.innerHTML = `<option value="" disabled selected></option>`;
  timeSelect.disabled = true;
  selectedTime = null;

  if (!date) return;

  const now = new Date();
  now.setSeconds(0, 0);

  const isToday =
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate();

  const startHour = 8;
  const endHour = 22;
  const intervalMinutes = 15;

  const slotTime = new Date(date);
  slotTime.setHours(startHour, 0, 0, 0);

  const endTime = new Date(date);
  endTime.setHours(endHour, 0, 0, 0);

  while (slotTime < endTime) {
    if (!isToday || slotTime > now) {
      const option = document.createElement("option");

      const hours = slotTime.getHours();
      const minutes = slotTime.getMinutes();
      const ampm = hours >= 12 ? "PM" : "AM";
      const displayHour = hours % 12 || 12;
      const displayMinutes = minutes.toString().padStart(2, "0");

      option.value = slotTime.toISOString();
      option.textContent = `${displayHour}:${displayMinutes} ${ampm}`;

      timeSelect.appendChild(option);
    }

    slotTime.setMinutes(slotTime.getMinutes() + intervalMinutes);
  }

  timeSelect.disabled = false;
  timeSelect.addEventListener("change", updateSaveSlotBtn);
}

// SAVE SLOT GATING
function updateSaveSlotBtn() {
  const saveSlotBtn = document.getElementById("save-slot-btn");
  const timeChosen = timeSelect.value !== "";
  saveSlotBtn.disabled = !timeChosen;
}

// PHONE FORMATTING UTILITY

function formatPhone(input) {
  // Strip everything except digits
  let digits = input.value.replace(/\D/g, "");

  // Limit to 10 digits
  if (digits.length > 10) digits = digits.slice(0, 10);

  // Format as 000-000-0000
  if (digits.length <= 3) {
    input.value = digits;
  } else if (digits.length <= 6) {
    input.value = digits.slice(0, 3) + "-" + digits.slice(3);
  } else {
    input.value =
      digits.slice(0, 3) + "-" + digits.slice(3, 6) + "-" + digits.slice(6);
  }
}

// Attach formatter to main physician phone and fax fields
["physician-phone", "physician-fax"].forEach((id) => {
  const field = document.getElementById(id);
  field.addEventListener("input", () => formatPhone(field));
});

// REFERRING PHYSICIAN TYPEAHEAD

const physicianInput = document.getElementById("ref-physician");
const physicianDropdown = document.getElementById("physician-dropdown");
const officeField = document.getElementById("office-field");
const officeSelect = document.getElementById("physician-office-select");

let selectedDoctor = null;
let isNewDoctor = false;

function setPhysicianFields(editable) {
  ["physician-phone", "physician-fax"].forEach((id) => {
    const field = document.getElementById(id);
    field.readOnly = !editable;
    field.style.background = editable ? "#ffffff" : "#f3f4f6";
    if (!editable) field.value = "";
  });

  const npi = document.getElementById("npi");
  npi.readOnly = !editable;
  npi.style.background = editable ? "#ffffff" : "#f3f4f6";
}

function clearPhysicianFields() {
  // Unlock and clear the name input
  physicianInput.readOnly = false;
  physicianInput.style.background = "#ffffff";
  physicianInput.value = "";

  setPhysicianFields(false);
  document.getElementById("npi").value = "";
  officeField.style.display = "none";
  officeSelect.innerHTML = `<option value="">Select office</option>`;
  selectedDoctor = null;
  isNewDoctor = false;
  checkPhysicianComplete();
}

function fillPhysicianFields(office) {
  document.getElementById("physician-phone").value = office.phone;
  document.getElementById("physician-fax").value = office.fax;
  checkPhysicianComplete();
}

function renderDropdown(query) {
  physicianDropdown.innerHTML = "";

  const matches = doctors.filter((dr) =>
    dr.name.toLowerCase().startsWith(query.toLowerCase()),
  );

  matches.forEach((dr) => {
    const li = document.createElement("li");
    li.textContent = dr.name;
    li.addEventListener("mousedown", () => {
      selectDoctor(dr);
    });
    physicianDropdown.appendChild(li);
  });

  const unknownLi = document.createElement("li");
  unknownLi.textContent = "Unknown / Will call back";
  unknownLi.className = "typeahead-provisional";
  unknownLi.addEventListener("mousedown", () => {
    selectProvisional();
  });
  physicianDropdown.appendChild(unknownLi);

  const addNewLi = document.createElement("li");
  addNewLi.textContent = "+ Add new doctor";
  addNewLi.className = "typeahead-special";
  addNewLi.addEventListener("mousedown", () => {
    selectAddNew();
  });
  physicianDropdown.appendChild(addNewLi);

  physicianDropdown.classList.add("open");
}

function selectDoctor(dr) {
  selectedDoctor = dr;
  isNewDoctor = false;

  // Lock name — but clicking it will unlock and re-open search
  physicianInput.value = dr.name;
  physicianInput.readOnly = true;
  physicianInput.style.background = "#f3f4f6";

  physicianDropdown.classList.remove("open");

  // Lock phone/fax, fill NPI
  setPhysicianFields(false);
  document.getElementById("npi").value = dr.npi;

  // Build office dropdown
  officeSelect.innerHTML = `<option value="">Select office</option>`;
  dr.offices.forEach((office, index) => {
    const option = document.createElement("option");
    option.value = index;
    option.textContent = office.label + " — " + office.address;
    officeSelect.appendChild(option);
  });

  // Add new office option at the bottom
  const addOfficeOption = document.createElement("option");
  addOfficeOption.value = "new-office";
  addOfficeOption.textContent = "+ Add new office";
  addOfficeOption.style.color = "#2563eb";
  addOfficeOption.style.fontWeight = "600";
  officeSelect.appendChild(addOfficeOption);

  officeField.style.display = "block";

  // Auto-select if only one real office
  if (dr.offices.length === 1) {
    officeSelect.value = "0";
    fillPhysicianFields(dr.offices[0]);
  }

  checkPhysicianComplete();
}

function selectProvisional() {
  physicianInput.value = "Unknown / Will call back";
  physicianInput.readOnly = true;
  physicianInput.style.background = "#f3f4f6";
  physicianDropdown.classList.remove("open");
  officeField.style.display = "none";
  setPhysicianFields(false);
  document.getElementById("npi").value = "";
  selectedDoctor = null;
  isNewDoctor = false;
  checkPhysicianComplete();
}

function selectAddNew() {
  physicianInput.value = "";
  physicianInput.readOnly = false;
  physicianInput.style.background = "#ffffff";
  physicianDropdown.classList.remove("open");
  officeField.style.display = "none";
  selectedDoctor = null;
  isNewDoctor = true;
  setPhysicianFields(false);
  document.getElementById("npi").value = "";
  checkPhysicianComplete();
  buildNewDoctorForm();
}
// Clicking the locked name field unlocks it for a new search
physicianInput.addEventListener("click", () => {
  if (physicianInput.readOnly) {
    // Don't unlock if the new doctor form is open
    if (physicianInput.dataset.formOpen === "true") return;
    clearPhysicianFields();
    physicianInput.focus();
    renderDropdown("");
  }
});

physicianInput.addEventListener("input", () => {
  if (physicianInput.readOnly) return;
  const query = physicianInput.value.trim();
  if (query.length === 0) {
    physicianDropdown.classList.remove("open");
    return;
  }
  renderDropdown(query);
});

physicianInput.addEventListener("focus", () => {
  if (physicianInput.readOnly) return;
  if (physicianInput.value.trim().length > 0) {
    renderDropdown(physicianInput.value.trim());
  }
});

physicianInput.addEventListener("blur", () => {
  setTimeout(() => {
    physicianDropdown.classList.remove("open");
  }, 150);
});

officeSelect.addEventListener("change", () => {
  const index = officeSelect.value;

  // No office selected — clear phone, fax, and remove new office form if open
  if (index === "") {
    document.getElementById("physician-phone").value = "";
    document.getElementById("physician-fax").value = "";
    setPhysicianFields(false);

    const existingForm = document.getElementById("new-office-form");
    if (existingForm) existingForm.remove();

    const existingSaveBtn = document.getElementById("save-new-office-btn");
    if (existingSaveBtn) existingSaveBtn.remove();

    checkPhysicianComplete();
    return;
  }

  // Add new office — show address/phone/fax inputs and a Save button
  if (index === "new-office") {
    document.getElementById("physician-phone").value = "";
    document.getElementById("physician-fax").value = "";

    const phone = document.getElementById("physician-phone");
    const fax = document.getElementById("physician-fax");
    phone.readOnly = false;
    phone.style.background = "#ffffff";
    fax.readOnly = false;
    fax.style.background = "#ffffff";

    // Show address field if not already there
    let newOfficeForm = document.getElementById("new-office-form");
    if (!newOfficeForm) {
      newOfficeForm = document.createElement("div");
      newOfficeForm.id = "new-office-form";
      newOfficeForm.style.cssText = `
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-top: 0.6rem;
      `;

      // Build elements directly instead of using innerHTML
      const addressInput = document.createElement("input");
      addressInput.id = "new-office-address";
      addressInput.type = "text";
      addressInput.placeholder = "Office address";
      addressInput.style.cssText = `
        font-size: 1.3rem;
        padding: 0.6rem 0.75rem;
        border-radius: 8px;
        border: 1px solid #d1d5db;
        background: #ffffff;
      `;

      const saveOfficeBtn = document.createElement("button");
      saveOfficeBtn.id = "save-new-office-btn";
      saveOfficeBtn.type = "button";
      saveOfficeBtn.disabled = true;
      saveOfficeBtn.textContent = "Save office";
      saveOfficeBtn.style.cssText = `
        align-self: flex-start;
        padding: 0.5rem 1.2rem;
        border-radius: 8px;
        border: none;
        background: #e5e7eb;
        color: #9ca3af;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: not-allowed;
      `;

      const addressLabel = document.createElement("label");
      addressLabel.textContent = "Office Address";
      addressLabel.style.cssText = `
        font-size: 1.1rem;
        font-weight: 600;
        color: #6b7280;
      `;

      newOfficeForm.appendChild(addressLabel);
      newOfficeForm.appendChild(addressInput);

      const phoneField = document.getElementById("physician-phone");
      const faxField = document.getElementById("physician-fax");
      const phoneWrapper = phoneField.closest(".accordion-field");
      const faxWrapper = faxField.closest(".accordion-field");

      function updateSaveOfficeBtn() {
        const address = addressInput.value.trim();
        const phone = phoneField.value.replace(/\D/g, "");
        const fax = faxField.value.replace(/\D/g, "");

        const isReady =
          address.length > 0 && phone.length === 10 && fax.length === 10;

        saveOfficeBtn.disabled = !isReady;
        saveOfficeBtn.style.background = isReady ? "#2563eb" : "#e5e7eb";
        saveOfficeBtn.style.color = isReady ? "#ffffff" : "#9ca3af";
        saveOfficeBtn.style.cursor = isReady ? "pointer" : "not-allowed";
      }

      addressInput.addEventListener("input", updateSaveOfficeBtn);
      phoneField.addEventListener("input", updateSaveOfficeBtn);
      faxField.addEventListener("input", updateSaveOfficeBtn);

      // Insert address form before phone field
      phoneWrapper.before(newOfficeForm);

      // Insert Save Office button after fax field
      saveOfficeBtn.style.marginTop = "0.8rem";
      faxWrapper.after(saveOfficeBtn);

      saveOfficeBtn.addEventListener("click", () => {
        const address = addressInput.value.trim();
        const newPhone = phoneField.value.trim();
        const newFax = faxField.value.trim();

        const summary =
          `Address: ${address}\n` + `Phone: ${newPhone}\n` + `Fax: ${newFax}`;

        showConfirmModal("Add new office?", summary, () => {
          // Build new office object
          const newOffice = {
            label: "New Office",
            address,
            phone: newPhone,
            fax: newFax,
          };

          // Add to the doctor's offices array in memory
          selectedDoctor.offices.push(newOffice);
          const newIndex = selectedDoctor.offices.length - 1;

          // Add to dropdown before the "+ Add new office" option
          const addOfficeOption = officeSelect.querySelector(
            "[value='new-office']",
          );
          const newOption = document.createElement("option");
          newOption.value = newIndex;
          newOption.textContent = newOffice.label + " — " + newOffice.address;
          officeSelect.insertBefore(newOption, addOfficeOption);

          // Select the new office
          officeSelect.value = newIndex;

          // Lock fields again
          phoneField.readOnly = true;
          phoneField.style.background = "#f3f4f6";
          faxField.readOnly = true;
          faxField.style.background = "#f3f4f6";

          // Remove form and button
          newOfficeForm.remove();
          saveOfficeBtn.remove();

          checkPhysicianComplete();
        }); // end showConfirmModal
      });
    }

    phone.focus();
    checkPhysicianComplete();
    return;
  }

  // Remove new office form and save button if they exist
  const existingForm = document.getElementById("new-office-form");
  if (existingForm) existingForm.remove();

  const existingSaveBtn = document.getElementById("save-new-office-btn");
  if (existingSaveBtn) existingSaveBtn.remove();

  // Existing office selected
  if (!selectedDoctor) return;
  setPhysicianFields(false);
  fillPhysicianFields(selectedDoctor.offices[index]);
});

// SECTION COMPLETION TRACKING

function checkPhysicianComplete() {
  const badge = document.getElementById("badge-physician");
  if (!badge) return;

  const isProvisional =
    physicianInput.value.trim() === "Unknown / Will call back";

  if (isProvisional) {
    badge.textContent = "Provisional";
    badge.className = "section-status-badge provisional";
    const saveBtn = document.getElementById("save-physician-btn");
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.style.background = "#2563eb";
      saveBtn.style.color = "#ffffff";
      saveBtn.style.cursor = "pointer";
    }
    return;
  }

  const name = physicianInput.value.trim();
  const npi = document.getElementById("npi").value.trim();
  const phone = document.getElementById("physician-phone").value.trim();
  const fax = document.getElementById("physician-fax").value.trim();

  const isComplete = name && npi && phone && fax;
  const saveBtn = document.getElementById("save-physician-btn");

  if (isComplete) {
    badge.textContent = "Complete";
    badge.className = "section-status-badge complete";
    if (saveBtn) {
      saveBtn.disabled = false;
      saveBtn.style.background = "#2563eb";
      saveBtn.style.color = "#ffffff";
      saveBtn.style.cursor = "pointer";
    }
  } else {
    badge.textContent = "Incomplete";
    badge.className = "section-status-badge incomplete";
    if (saveBtn) {
      saveBtn.disabled = true;
      saveBtn.style.background = "#e5e7eb";
      saveBtn.style.color = "#9ca3af";
      saveBtn.style.cursor = "not-allowed";
    }
  }
}

// CONFIRMATION MODAL UTILITY

function showConfirmModal(title, body, onConfirm) {
  const modal = document.getElementById("confirmModal");
  document.getElementById("confirmModalTitle").textContent = title;
  // Convert newlines to <br> so each field appears on its own line
  document.getElementById("confirmModalBody").innerHTML = body
    .split("\n")
    .map(
      (line) =>
        `<span style="display:block; padding: 0.15rem 0;">${line}</span>`,
    )
    .join("");
  modal.classList.add("active");
  document.body.classList.add("modal-open");

  const confirmBtn = document.getElementById("confirmModalConfirm");
  const cancelBtn = document.getElementById("confirmModalCancel");

  // Clone buttons to remove any previous listeners
  const newConfirm = confirmBtn.cloneNode(true);
  const newCancel = cancelBtn.cloneNode(true);
  confirmBtn.replaceWith(newConfirm);
  cancelBtn.replaceWith(newCancel);

  newConfirm.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
    onConfirm();
  });

  newCancel.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.classList.remove("modal-open");
  });
}

// NEW DOCTOR FORM

function buildNewDoctorForm() {
  // Remove any existing form first
  const existing = document.getElementById("new-doctor-form");
  if (existing) existing.remove();

  const content = document
    .getElementById("save-physician-btn")
    .closest(".accordion-content");

  // Disable main Save button while form is open
  const saveBtn = document.getElementById("save-physician-btn");
  saveBtn.disabled = true;
  saveBtn.style.background = "#e5e7eb";
  saveBtn.style.color = "#9ca3af";
  saveBtn.style.cursor = "not-allowed";

  // Build the form container
  const form = document.createElement("div");
  form.id = "new-doctor-form";
  form.style.cssText = `
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 0.8rem;
    padding: 1.2rem;
    background: #f9fafb;
    border-radius: 10px;
    border: 1px solid #e5e7eb;
  `;

  function makeField(labelText, inputId, type = "text", placeholder = "") {
    const wrapper = document.createElement("div");
    wrapper.style.cssText = "display:flex; flex-direction:column; gap:0.4rem;";

    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    lbl.style.cssText = "font-size:1.1rem; font-weight:600; color:#6b7280;";

    const input = document.createElement("input");
    input.id = inputId;
    input.type = type;
    input.placeholder = placeholder;
    input.style.cssText = `
      font-size: 1.3rem;
      padding: 0.6rem 0.75rem;
      border-radius: 8px;
      border: 1px solid #d1d5db;
      background: #ffffff;
    `;

    wrapper.appendChild(lbl);
    wrapper.appendChild(input);
    return { wrapper, input };
  }

  const { wrapper: nameWrapper, input: nameInput } = makeField(
    "Doctor Name",
    "new-dr-name",
    "text",
    "Full name",
  );
  const { wrapper: npiWrapper, input: npiInput } = makeField(
    "NPI",
    "new-dr-npi",
    "text",
    "10-digit NPI",
  );
  const { wrapper: addressWrapper, input: addressInput } = makeField(
    "Office Address",
    "new-dr-address",
    "text",
    "Full address",
  );
  const { wrapper: phoneWrapper, input: phoneInput } = makeField(
    "Phone",
    "new-dr-phone",
    "tel",
    "000-000-0000",
  );
  const { wrapper: faxWrapper, input: faxInput } = makeField(
    "Fax",
    "new-dr-fax",
    "tel",
    "000-000-0000",
  );

  // Attach phone formatter
  phoneInput.addEventListener("input", () => formatPhone(phoneInput));
  faxInput.addEventListener("input", () => formatPhone(faxInput));

  // Save Doctor button (disabled until all fields filled)
  const saveDrBtn = document.createElement("button");
  saveDrBtn.type = "button";
  saveDrBtn.textContent = "Save Doctor";
  saveDrBtn.disabled = true;
  saveDrBtn.style.cssText = `
    align-self: flex-start;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    border: none;
    background: #e5e7eb;
    color: #9ca3af;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: not-allowed;
  `;

  // Cancel button
  const cancelDrBtn = document.createElement("button");
  cancelDrBtn.type = "button";
  cancelDrBtn.textContent = "Cancel";
  cancelDrBtn.style.cssText = `
    align-self: flex-start;
    padding: 0.5rem 1.2rem;
    border-radius: 8px;
    border: 1px solid #d1d5db;
    background: #ffffff;
    color: #374151;
    font-size: 1.2rem;
    font-weight: 600;
    cursor: pointer;
  `;

  const btnRow = document.createElement("div");
  btnRow.style.cssText = "display:flex; gap:0.6rem; margin-top:0.4rem;";
  btnRow.appendChild(saveDrBtn);
  btnRow.appendChild(cancelDrBtn);

  form.appendChild(nameWrapper);
  form.appendChild(npiWrapper);
  form.appendChild(addressWrapper);
  form.appendChild(phoneWrapper);
  form.appendChild(faxWrapper);
  form.appendChild(btnRow);

  // Lock the typeahead input while form is open
  physicianInput.readOnly = true;
  physicianInput.style.background = "#f3f4f6";
  physicianInput.placeholder = "Filling in new doctor...";
  physicianInput.style.cursor = "not-allowed";
  physicianInput.style.opacity = "0.6";

  // Store flag to block dropdown interactions
  physicianInput.dataset.formOpen = "true";

  // Hide all other fields except the typeahead
  const typeaheadField = physicianInput.closest(".accordion-field");
  content
    .querySelectorAll(".accordion-field, .accordion-actions")
    .forEach((el) => {
      if (el !== typeaheadField) el.style.display = "none";
    });

  // Insert form after the typeahead field
  typeaheadField.after(form);

  // Validation — enable Save Doctor only when all fields are filled
  function updateSaveDrBtn() {
    const name = nameInput.value.trim();
    const npi = npiInput.value.trim();
    const address = addressInput.value.trim();
    const phone = phoneInput.value.replace(/\D/g, "");
    const fax = faxInput.value.replace(/\D/g, "");

    const isReady =
      name.length > 0 &&
      npi.length > 0 &&
      address.length > 0 &&
      phone.length === 10 &&
      fax.length === 10;

    saveDrBtn.disabled = !isReady;
    saveDrBtn.style.background = isReady ? "#2563eb" : "#e5e7eb";
    saveDrBtn.style.color = isReady ? "#ffffff" : "#9ca3af";
    saveDrBtn.style.cursor = isReady ? "pointer" : "not-allowed";
  }

  [nameInput, npiInput, addressInput, phoneInput, faxInput].forEach((inp) =>
    inp.addEventListener("input", updateSaveDrBtn),
  );

  // Cancel — remove form, restore fields, unlock typeahead
  cancelDrBtn.addEventListener("click", () => {
    form.remove();

    // Restore all hidden fields
    content
      .querySelectorAll(".accordion-field, .accordion-actions")
      .forEach((el) => {
        el.style.display = "";
      });

    // Re-hide office field until a doctor is selected
    document.getElementById("office-field").style.display = "none";

    physicianInput.readOnly = false;
    physicianInput.style.background = "#ffffff";
    physicianInput.placeholder = "Type doctor name...";
    physicianInput.style.cursor = "";
    physicianInput.style.opacity = "";
    physicianInput.value = "";
    delete physicianInput.dataset.formOpen;
    checkPhysicianComplete();
  });

  // Save Doctor — show confirmation modal first
  saveDrBtn.addEventListener("click", () => {
    const name = nameInput.value.trim();
    const npi = npiInput.value.trim();
    const address = addressInput.value.trim();
    const phone = phoneInput.value.trim();
    const fax = faxInput.value.trim();

    const summary =
      `Name: ${name}\n` +
      `NPI: ${npi}\n` +
      `Address: ${address}\n` +
      `Phone: ${phone}\n` +
      `Fax: ${fax}`;

    showConfirmModal("Add new doctor?", summary, () => {
      // Build new doctor object
      const newDoctor = {
        id: "dr-new-" + Date.now(),
        name,
        npi,
        offices: [{ label: "Main Office", address, phone, fax }],
      };

      // Add to in-memory database
      doctors.push(newDoctor);

      // Restore all hidden fields
      content
        .querySelectorAll(".accordion-field, .accordion-actions")
        .forEach((el) => {
          el.style.display = "";
        });

      // Re-hide office field — selectDoctor will show it when needed
      document.getElementById("office-field").style.display = "none";

      // Unlock typeahead, remove form, select new doctor
      physicianInput.readOnly = false;
      physicianInput.style.background = "#ffffff";
      physicianInput.placeholder = "Type doctor name...";
      physicianInput.style.cursor = "";
      physicianInput.style.opacity = "";
      delete physicianInput.dataset.formOpen;
      form.remove();
      selectDoctor(newDoctor);
    });
  });

  nameInput.focus();
}

// INSURANCE INFO — COMPLETION CHECK & SAVE/EDIT

function checkPrimaryInsuranceComplete() {
  const carrier = document.getElementById("prim-carrier").value;
  const memberId = document.getElementById("prim-member-id").value.trim();
  const relationship = document.getElementById("prim-relationship").value;
  const firstname = document
    .getElementById("prim-holder-firstname")
    .value.trim();
  const lastname = document.getElementById("prim-holder-lastname").value.trim();
  const dob = document.getElementById("prim-holder-dob").value;
  const saveBtn = document.getElementById("save-primary-insurance-btn");

  const isProvisional = carrier === "unknown";
  const isComplete =
    carrier &&
    memberId &&
    relationship &&
    firstname &&
    lastname &&
    dob.length === 10 &&
    !dob.startsWith("000") &&
    new Date(dob).getFullYear() > 999;

  if (isProvisional || isComplete) {
    saveBtn.disabled = false;
    saveBtn.style.background = "#2563eb";
    saveBtn.style.color = "#ffffff";
    saveBtn.style.cursor = "pointer";
  } else {
    saveBtn.disabled = true;
    saveBtn.style.background = "#e5e7eb";
    saveBtn.style.color = "#9ca3af";
    saveBtn.style.cursor = "not-allowed";
  }
}

// Attach listeners to all primary insurance fields
["prim-carrier", "prim-relationship"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("change", checkPrimaryInsuranceComplete);
});
[
  "prim-member-id",
  "prim-holder-firstname",
  "prim-holder-lastname",
  "prim-holder-dob",
].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", checkPrimaryInsuranceComplete);
});

function applyProvisionalToggle() {
  const isProvisional =
    document.getElementById("prim-carrier").value === "unknown";
  const fieldsToToggle = [
    "prim-member-id",
    "prim-relationship",
    "prim-holder-firstname",
    "prim-holder-lastname",
    "prim-holder-dob",
  ];

  fieldsToToggle.forEach((id) => {
    const field = document.getElementById(id);
    field.disabled = isProvisional;
    field.style.background = isProvisional ? "#f3f4f6" : "#ffffff";
    field.style.color = isProvisional ? "#9ca3af" : "#111827";
    if (isProvisional) field.value = "";
  });
}

document
  .getElementById("prim-carrier")
  .addEventListener("change", applyProvisionalToggle);

function checkSecondaryInsuranceComplete() {
  const carrier = document.getElementById("sec-carrier").value;
  const memberId = document.getElementById("sec-member-id").value.trim();
  const relationship = document.getElementById("sec-relationship").value;
  const firstname = document
    .getElementById("sec-holder-firstname")
    .value.trim();
  const lastname = document.getElementById("sec-holder-lastname").value.trim();
  const dob = document.getElementById("sec-holder-dob").value;
  const saveBtn = document.getElementById("save-secondary-insurance-btn");

  const isComplete =
    carrier &&
    memberId &&
    relationship &&
    firstname &&
    lastname &&
    dob.length === 10 &&
    !dob.startsWith("000") &&
    new Date(dob).getFullYear() > 999;

  if (isComplete) {
    saveBtn.disabled = false;
    saveBtn.style.background = "#2563eb";
    saveBtn.style.color = "#ffffff";
    saveBtn.style.cursor = "pointer";
  } else {
    saveBtn.disabled = true;
    saveBtn.style.background = "#e5e7eb";
    saveBtn.style.color = "#9ca3af";
    saveBtn.style.cursor = "not-allowed";
  }
}

// Attach listeners to all secondary insurance fields
["sec-carrier", "sec-relationship"].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("change", checkSecondaryInsuranceComplete);
});
[
  "sec-member-id",
  "sec-holder-firstname",
  "sec-holder-lastname",
  "sec-holder-dob",
].forEach((id) => {
  document
    .getElementById(id)
    .addEventListener("input", checkSecondaryInsuranceComplete);
});

// SAVE PRIMARY INSURANCE
function savePrimaryInsurance() {
  const carrier = document.getElementById("prim-carrier");
  const memberId = document.getElementById("prim-member-id");
  const relationship = document.getElementById("prim-relationship");
  const firstname = document.getElementById("prim-holder-firstname");
  const lastname = document.getElementById("prim-holder-lastname");
  const dob = document.getElementById("prim-holder-dob");
  const badge = document.getElementById("badge-insurance");

  const isProvisional = carrier.value === "unknown";
  const carrierText = carrier.options[carrier.selectedIndex].text;
  const relationshipText = isProvisional
    ? ""
    : relationship.options[relationship.selectedIndex].text;

  const primarySection = document.getElementById("primary-insurance-fields");
  primarySection.innerHTML = "";

  const summary = document.createElement("div");
  summary.id = "primary-insurance-summary";

  function makeViewField(labelText, valueText) {
    const wrapper = document.createElement("div");
    wrapper.className = "physician-view-field";
    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    const val = document.createElement("span");
    val.textContent = valueText;
    wrapper.appendChild(lbl);
    wrapper.appendChild(val);
    return wrapper;
  }

  const title = document.createElement("h5");
  title.className = "insurance-subsection-title";
  title.textContent = "Primary Insurance";
  summary.appendChild(title);

  if (isProvisional) {
    summary.appendChild(
      makeViewField("Insurance Carrier", "Unknown / Will sort later"),
    );
  } else {
    summary.appendChild(makeViewField("Insurance Carrier", carrierText));
    summary.appendChild(makeViewField("Member ID", memberId.value.trim()));
    summary.appendChild(makeViewField("Relationship", relationshipText));
    summary.appendChild(
      makeViewField(
        "Holder Name",
        `${firstname.value.trim()} ${lastname.value.trim()}`,
      ),
    );
    summary.appendChild(makeViewField("Holder DOB", dob.value));
  }

  const actions = document.createElement("div");
  actions.className = "accordion-actions";
  const primaryActions = document.createElement("div");
  primaryActions.className = "primary-actions";
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-button";
  editBtn.id = "edit-primary-insurance-btn";
  primaryActions.appendChild(editBtn);
  actions.appendChild(primaryActions);
  summary.appendChild(actions);
  primarySection.appendChild(summary);

  if (isProvisional) {
    badge.textContent = "Provisional";
    badge.className = "section-status-badge provisional";
  } else {
    badge.textContent = "Complete";
    badge.className = "section-status-badge complete";
  }

  // Show "Add Secondary Insurance" button only for valid carriers
  const noSecondaryCarriers = ["unknown", "selfpay", ""];
  const existingSecBtn = document.getElementById("add-secondary-btn");
  if (existingSecBtn) existingSecBtn.remove();

  if (!noSecondaryCarriers.includes(carrier.value)) {
    const addSecBtn = document.createElement("button");
    addSecBtn.id = "add-secondary-btn";
    addSecBtn.textContent = "+ Add Secondary Insurance";
    addSecBtn.className = "add-secondary-btn";

    addSecBtn.addEventListener("click", () => {
      // Show divider
      document.getElementById("insurance-divider").style.display = "block";

      // Show secondary wrapper with animation
      const wrapper = document.getElementById("secondary-insurance-wrapper");
      wrapper.classList.add("visible");

      // Hide the add button
      addSecBtn.style.display = "none";
    });

    // Insert button after the primary summary actions
    primarySection.appendChild(addSecBtn);
  }

  editBtn.addEventListener("click", () => {
    primarySection.innerHTML = `
      <h5 class="insurance-subsection-title">Primary Insurance</h5>
      <div class="accordion-field">
        <label for="prim-carrier">Insurance Carrier</label>
        <select id="prim-carrier">
          <option value="">Select carrier</option>
          <option value="unknown">Unknown / Will sort later</option>
          <option value="selfpay">Self-Pay</option>
          <option value="aetna">Aetna</option>
          <option value="bcbs">Blue Cross Blue Shield</option>
          <option value="health-choice">Health Choice</option>
          <option value="kaiser">Kaiser</option>
          <option value="medicare">Medicare</option>
          <option value="medicaid">Medicaid</option>
          <option value="oscar">Oscar</option>
          <option value="uhc">United Health Care</option>
          <option value="veterans">Veterans Administration</option>
          <option value="workcomp">Worker's Compensation</option>
        </select>
      </div>
      <div class="accordion-field">
        <label for="prim-member-id">Member ID</label>
        <input id="prim-member-id" type="text" placeholder="Member ID" />
      </div>
      <div class="accordion-field">
        <label for="prim-relationship">Relationship</label>
        <select id="prim-relationship">
          <option value="">Select relationship</option>
          <option value="self">Self</option>
          <option value="mother">Mother</option>
          <option value="father">Father</option>
          <option value="sibling">Sibling</option>
          <option value="spouse">Spouse</option>
          <option value="daughter">Daughter</option>
          <option value="son">Son</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="accordion-field">
        <label for="prim-holder-firstname">Holder First Name</label>
        <input id="prim-holder-firstname" type="text" placeholder="First Name" />
      </div>
      <div class="accordion-field">
        <label for="prim-holder-lastname">Holder Last Name</label>
        <input id="prim-holder-lastname" type="text" placeholder="Last Name" />
      </div>
      <div class="accordion-field">
        <label for="prim-holder-dob">Holder DOB</label>
        <input id="prim-holder-dob" type="date" />
      </div>
      <div class="accordion-actions">
        <div class="primary-actions">
          <button class="save-button" id="save-primary-insurance-btn" disabled
            style="background:#e5e7eb; color:#9ca3af; cursor:not-allowed;">
            Save Primary
          </button>
        </div>
      </div>
    `;

    // Restore saved values
    document.getElementById("prim-carrier").value = carrier.value;
    document.getElementById("prim-member-id").value = memberId.value;
    document.getElementById("prim-relationship").value = relationship.value;
    document.getElementById("prim-holder-firstname").value = firstname.value;
    document.getElementById("prim-holder-lastname").value = lastname.value;
    document.getElementById("prim-holder-dob").value = dob.value;

    // Reset badge
    badge.textContent = "Incomplete";
    badge.className = "section-status-badge incomplete";

    // Re-attach listeners
    ["prim-carrier", "prim-relationship"].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("change", checkPrimaryInsuranceComplete);
    });

    document
      .getElementById("prim-carrier")
      .addEventListener("change", applyProvisionalToggle);
    // Re-attach save button
    document
      .getElementById("save-primary-insurance-btn")
      .addEventListener("click", savePrimaryInsurance);
    applyProvisionalToggle();
    checkPrimaryInsuranceComplete();
  });
}

document
  .getElementById("save-primary-insurance-btn")
  .addEventListener("click", savePrimaryInsurance);

// SAVE SECONDARY INSURANCE
function saveSecondaryInsurance() {
  const carrier = document.getElementById("sec-carrier");
  const memberId = document.getElementById("sec-member-id");
  const relationship = document.getElementById("sec-relationship");
  const firstname = document.getElementById("sec-holder-firstname");
  const lastname = document.getElementById("sec-holder-lastname");
  const dob = document.getElementById("sec-holder-dob");

  // Guard: if fields don't exist, abort
  if (!carrier || !memberId || !relationship || !firstname || !lastname || !dob)
    return;

  const carrierText = carrier.options[carrier.selectedIndex].text;
  const relationshipText =
    relationship.options[relationship.selectedIndex].text;
  const secondarySection = document.getElementById(
    "secondary-insurance-fields",
  );
  secondarySection.innerHTML = "";

  const summary = document.createElement("div");
  summary.id = "secondary-insurance-summary";

  function makeViewField(labelText, valueText) {
    const wrapper = document.createElement("div");
    wrapper.className = "physician-view-field";
    const lbl = document.createElement("label");
    lbl.textContent = labelText;
    const val = document.createElement("span");
    val.textContent = valueText;
    wrapper.appendChild(lbl);
    wrapper.appendChild(val);
    return wrapper;
  }

  const title = document.createElement("h5");
  title.className = "insurance-subsection-title";
  title.textContent = "Secondary Insurance";
  summary.appendChild(title);

  summary.appendChild(makeViewField("Insurance Carrier", carrierText));
  summary.appendChild(makeViewField("Member ID", memberId.value.trim()));
  summary.appendChild(makeViewField("Relationship", relationshipText));
  summary.appendChild(
    makeViewField(
      "Holder Name",
      `${firstname.value.trim()} ${lastname.value.trim()}`,
    ),
  );
  summary.appendChild(makeViewField("Holder DOB", dob.value));

  // Edit and Delete buttons
  const actions = document.createElement("div");
  actions.className = "accordion-actions";
  const primary = document.createElement("div");
  primary.className = "primary-actions";

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Remove Secondary";
  deleteBtn.className = "delete-note-btn";
  deleteBtn.id = "delete-secondary-insurance-btn";

  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-button";
  editBtn.id = "edit-secondary-insurance-btn";

  primary.appendChild(deleteBtn);
  primary.appendChild(editBtn);
  actions.appendChild(primary);
  summary.appendChild(actions);

  secondarySection.appendChild(summary);

  // DELETE secondary insurance
  deleteBtn.addEventListener("click", () => {
    showConfirmModal(
      "Remove secondary insurance?",
      "This will delete the secondary insurance information.",
      () => {
        // Clear the secondary section back to original form
        secondarySection.innerHTML = `
        <h5 class="insurance-subsection-title">Secondary Insurance</h5>
        <div class="accordion-field">
          <label for="sec-carrier">Insurance Carrier</label>
          <select id="sec-carrier">
            <option value="">Select carrier</option>
            <option value="selfpay">Self-Pay</option>
            <option value="aetna">Aetna</option>
            <option value="bcbs">Blue Cross Blue Shield</option>
            <option value="health-choice">Health Choice</option>
            <option value="kaiser">Kaiser</option>
            <option value="medicare">Medicare</option>
            <option value="medicaid">Medicaid</option>
            <option value="oscar">Oscar</option>
            <option value="uhc">United Health Care</option>
            <option value="veterans">Veterans Administration</option>
            <option value="workcomp">Worker's Compensation</option>
          </select>
        </div>
        <div class="accordion-field">
          <label for="sec-member-id">Member ID</label>
          <input id="sec-member-id" type="text" placeholder="Member ID" />
        </div>
        <div class="accordion-field">
          <label for="sec-relationship">Relationship</label>
          <select id="sec-relationship">
            <option value="">Select relationship</option>
            <option value="self">Self</option>
            <option value="mother">Mother</option>
            <option value="father">Father</option>
            <option value="sibling">Sibling</option>
            <option value="spouse">Spouse</option>
            <option value="daughter">Daughter</option>
            <option value="son">Son</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="accordion-field">
          <label for="sec-holder-firstname">Holder First Name</label>
          <input id="sec-holder-firstname" type="text" placeholder="First Name" />
        </div>
        <div class="accordion-field">
          <label for="sec-holder-lastname">Holder Last Name</label>
          <input id="sec-holder-lastname" type="text" placeholder="Last Name" />
        </div>
        <div class="accordion-field">
          <label for="sec-holder-dob">Holder DOB</label>
          <input id="sec-holder-dob" type="date" />
        </div>
        <div class="accordion-actions">
          <div class="primary-actions">
            <button class="edit-button" id="cancel-secondary-btn">Cancel</button>
            <button class="save-button" id="save-secondary-insurance-btn" disabled
              style="background:#e5e7eb; color:#9ca3af; cursor:not-allowed;">
              Save Secondary
            </button>
          </div>
        </div>
      `;

        // Hide wrapper and divider
        const wrapper = document.getElementById("secondary-insurance-wrapper");
        wrapper.classList.remove("visible");
        document.getElementById("insurance-divider").style.display = "none";

        // Show Add Secondary button again
        const addSecBtn = document.getElementById("add-secondary-btn");
        if (addSecBtn) addSecBtn.style.display = "";

        // Re-attach listeners for next time
        ["sec-carrier", "sec-relationship"].forEach((id) => {
          document
            .getElementById(id)
            .addEventListener("change", checkSecondaryInsuranceComplete);
        });
        [
          "sec-member-id",
          "sec-holder-firstname",
          "sec-holder-lastname",
          "sec-holder-dob",
        ].forEach((id) => {
          document
            .getElementById(id)
            .addEventListener("input", checkSecondaryInsuranceComplete);
        });
        document
          .getElementById("cancel-secondary-btn")
          .addEventListener("click", () => {
            const wrapper = document.getElementById(
              "secondary-insurance-wrapper",
            );
            wrapper.classList.remove("visible");
            document.getElementById("insurance-divider").style.display = "none";
            const addSecBtn = document.getElementById("add-secondary-btn");
            if (addSecBtn) addSecBtn.style.display = "";
          });
        document
          .getElementById("save-secondary-insurance-btn")
          .addEventListener("click", saveSecondaryInsurance);
      },
    );
  });

  // EDIT button — restore secondary fields
  editBtn.addEventListener("click", () => {
    secondarySection.innerHTML = `
      <h5 class="insurance-subsection-title">Secondary Insurance</h5>
      <div class="accordion-field">
        <label for="sec-carrier">Insurance Carrier</label>
        <select id="sec-carrier">
          <option value="">Select carrier</option>
          <option value="selfpay">Self-Pay</option>
          <option value="aetna">Aetna</option>
          <option value="bcbs">Blue Cross Blue Shield</option>
          <option value="health-choice">Health Choice</option>
          <option value="kaiser">Kaiser</option>
          <option value="medicare">Medicare</option>
          <option value="medicaid">Medicaid</option>
          <option value="oscar">Oscar</option>
          <option value="uhc">United Health Care</option>
          <option value="veterans">Veterans Administration</option>
          <option value="workcomp">Worker's Compensation</option>
        </select>
      </div>
      <div class="accordion-field">
        <label for="sec-member-id">Member ID</label>
        <input id="sec-member-id" type="text" placeholder="Member ID" />
      </div>
      <div class="accordion-field">
        <label for="sec-relationship">Relationship</label>
        <select id="sec-relationship">
          <option value="">Select relationship</option>
          <option value="self">Self</option>
          <option value="mother">Mother</option>
          <option value="father">Father</option>
          <option value="sibling">Sibling</option>
          <option value="spouse">Spouse</option>
          <option value="daughter">Daughter</option>
          <option value="son">Son</option>
          <option value="other">Other</option>
        </select>
      </div>
      <div class="accordion-field">
        <label for="sec-holder-firstname">Holder First Name</label>
        <input id="sec-holder-firstname" type="text" placeholder="First Name" />
      </div>
      <div class="accordion-field">
        <label for="sec-holder-lastname">Holder Last Name</label>
        <input id="sec-holder-lastname" type="text" placeholder="Last Name" />
      </div>
      <div class="accordion-field">
        <label for="sec-holder-dob">Holder DOB</label>
        <input id="sec-holder-dob" type="date" />
      </div>
      <div class="accordion-actions">
        <div class="primary-actions">
          <button class="edit-button" id="cancel-secondary-btn">Cancel</button>
          <button class="save-button" id="save-secondary-insurance-btn" disabled
            style="background:#e5e7eb; color:#9ca3af; cursor:not-allowed;">
            Save Secondary
          </button>
        </div>
      </div>
    `;

    // Restore saved values
    document.getElementById("sec-carrier").value = carrier.value;
    document.getElementById("sec-member-id").value = memberId.value;
    document.getElementById("sec-relationship").value = relationship.value;
    document.getElementById("sec-holder-firstname").value = firstname.value;
    document.getElementById("sec-holder-lastname").value = lastname.value;
    document.getElementById("sec-holder-dob").value = dob.value;

    // Re-attach listeners
    ["sec-carrier", "sec-relationship"].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("change", checkSecondaryInsuranceComplete);
    });
    [
      "sec-member-id",
      "sec-holder-firstname",
      "sec-holder-lastname",
      "sec-holder-dob",
    ].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("input", checkSecondaryInsuranceComplete);
    });

    // Re-attach cancel button
    document
      .getElementById("cancel-secondary-btn")
      .addEventListener("click", () => {
        const wrapper = document.getElementById("secondary-insurance-wrapper");
        wrapper.classList.remove("visible");
        document.getElementById("insurance-divider").style.display = "none";
        const addSecBtn = document.getElementById("add-secondary-btn");
        if (addSecBtn) addSecBtn.style.display = "";
      });

    // Re-attach save button
    document
      .getElementById("save-secondary-insurance-btn")
      .addEventListener("click", saveSecondaryInsurance);

    [
      "sec-member-id",
      "sec-holder-firstname",
      "sec-holder-lastname",
      "sec-holder-dob",
    ].forEach((id) => {
      document
        .getElementById(id)
        .addEventListener("input", checkSecondaryInsuranceComplete);
    });
    checkSecondaryInsuranceComplete();
  });
}

// CANCEL SECONDARY INSURANCE
document
  .getElementById("cancel-secondary-btn")
  .addEventListener("click", () => {
    // Hide the secondary wrapper
    const wrapper = document.getElementById("secondary-insurance-wrapper");
    wrapper.classList.remove("visible");

    // Hide the divider
    document.getElementById("insurance-divider").style.display = "none";

    // Show the Add Secondary button again
    const addSecBtn = document.getElementById("add-secondary-btn");
    if (addSecBtn) addSecBtn.style.display = "";
  });

document
  .getElementById("save-secondary-insurance-btn")
  .addEventListener("click", saveSecondaryInsurance);

// PHYSICIAN SAVE / EDIT MODE

document.getElementById("save-physician-btn").addEventListener("click", () => {
  // Collect current values
  const name = physicianInput.value.trim();
  const npi = document.getElementById("npi").value.trim();
  const phone = document.getElementById("physician-phone").value.trim();
  const fax = document.getElementById("physician-fax").value.trim();
  const isProvisional = name === "Unknown / Will call back";

  // Get the office label if one is selected
  const officeSelectEl = document.getElementById("physician-office-select");
  const officeLabel =
    officeSelectEl.options[officeSelectEl.selectedIndex]?.text || "";

  // Find the accordion content to work inside
  const content = document
    .getElementById("save-physician-btn")
    .closest(".accordion-content");

  // Hide all edit-mode fields
  content
    .querySelectorAll(".accordion-field, .accordion-actions")
    .forEach((el) => {
      el.style.display = "none";
    });

  // Build view mode block
  const viewBlock = document.createElement("div");
  viewBlock.className = "physician-view-mode";
  viewBlock.id = "physician-view-block";

  function makeViewField(labelText, valueText) {
    const wrapper = document.createElement("div");
    wrapper.className = "physician-view-field";

    const lbl = document.createElement("label");
    lbl.textContent = labelText;

    const val = document.createElement("span");
    val.textContent = valueText;

    wrapper.appendChild(lbl);
    wrapper.appendChild(val);
    return wrapper;
  }

  viewBlock.appendChild(makeViewField("Referring Physician", name));
  if (!isProvisional) {
    viewBlock.appendChild(makeViewField("NPI", npi));
    viewBlock.appendChild(makeViewField("Office", officeLabel));
    viewBlock.appendChild(makeViewField("Phone", phone));
    viewBlock.appendChild(makeViewField("Fax", fax));
  }

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.className = "edit-button";
  editBtn.id = "edit-physician-btn";

  const actionsWrapper = document.createElement("div");
  actionsWrapper.className = "accordion-actions";
  const primaryWrapper = document.createElement("div");
  primaryWrapper.className = "primary-actions";
  primaryWrapper.appendChild(editBtn);
  actionsWrapper.appendChild(primaryWrapper);

  viewBlock.appendChild(actionsWrapper);
  content.appendChild(viewBlock);

  // EDIT button — restore edit mode
  editBtn.addEventListener("click", () => {
    // Remove view block
    viewBlock.remove();

    // Restore all edit-mode fields
    content
      .querySelectorAll(".accordion-field, .accordion-actions")
      .forEach((el) => {
        el.style.display = "";
      });

    // Restore office field visibility if a doctor was selected
    if (selectedDoctor) {
      document.getElementById("office-field").style.display = "block";
    }
  });
});

// UPLOADS SECTION

function isSingleFileCategory(category) {
  // Solo limitar uploads en la sección "Uploads"
  // Las categorías de Report / Images tienen data-report-type
  return !category.dataset.reportType;
}

document
  .querySelectorAll('.upload-category input[type="file"]')
  .forEach((input) => {
    input.addEventListener("change", () => {
      const category = input.closest(".upload-category");
      const fileList = category.querySelector(".file-list");
      const uploadBtn = category.querySelector(".upload-btn");

      const singleFileOnly = isSingleFileCategory(category);

      // 🚫 If only one file allowed and one already exists
      if (singleFileOnly && fileList.children.length > 0) {
        input.value = "";
        return;
      }

      for (const file of input.files) {
        // Safety check (in case multiple files were selected)
        if (singleFileOnly && fileList.children.length > 0) break;

        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

        const li = document.createElement("li");
        li.className = "file-item";
        li.file = file;

        li.innerHTML = `
      <div class="file-main">
        <span class="file-name">${file.name}</span>

        <div class="file-actions">
          <button class="view-btn" title="View">
            <ion-icon name="eye-outline"></ion-icon>
          </button>
          <button class="download-btn" title="Download">
            <ion-icon name="download-outline"></ion-icon>
          </button>
          <button class="delete-btn" title="Delete">
            <ion-icon name="trash-outline"></ion-icon>
          </button>
        </div>
      </div>

      <div class="file-uploader">
        Uploaded by Cozy Badger on ${formattedDate} at ${formattedTime}
      </div>
    `;

        fileList.appendChild(li);
      }

      // 🚫 Disable upload button if single-file category now has a file
      if (singleFileOnly) {
        uploadBtn.style.display =
          fileList.children.length > 0 ? "none" : "inline-flex";
      }

      //  Show send button if files exist (Report section only)
      const sendBtn = category.querySelector(".send-btn");
      if (sendBtn) {
        sendBtn.style.display =
          fileList.children.length > 0 ? "inline-block" : "none";
      }

      input.value = "";
    });
  });

// VIEW BUTTON FOR IMAGES

const modal = document.getElementById("imageModal");
const modalImage = document.getElementById("modalImage");

// DELETE FILE MODAL

const deleteModal = document.getElementById("deleteModal");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");
const deleteFileNameEl = document.getElementById("deleteFileName");

// Disable native browser image dragging
modalImage.setAttribute("draggable", "false");

modalImage.addEventListener("mousedown", (e) => {
  e.preventDefault();
});

const zoomInBtn = document.getElementById("zoomIn");
const zoomOutBtn = document.getElementById("zoomOut");
const zoomResetBtn = document.getElementById("zoomReset");
const closeModalBtn = document.getElementById("closeModal");

// Reset zoom when opening
function resetZoom() {
  currentScale = 1;
  modalImage.style.transform = "scale(1)";
  imageContainer.scrollTop = 0;
  imageContainer.scrollLeft = 0;
  imageContainer.style.cursor = "default";
}

// Zoom buttons
zoomInBtn.addEventListener("click", () => {
  currentScale += SCALE_STEP;
  modalImage.style.transform = `scale(${currentScale})`;
});

zoomOutBtn.addEventListener("click", () => {
  currentScale = Math.max(0.2, currentScale - SCALE_STEP);
  modalImage.style.transform = `scale(${currentScale})`;
});

zoomResetBtn.addEventListener("click", resetZoom);

// Ctrl + mouse wheel zoom (regular wheel scroll stays normal)
modalImage.addEventListener("wheel", (e) => {
  // Only zoom if Ctrl is pressed
  if (!e.ctrlKey) return;

  e.preventDefault(); // stop browser zoom

  if (e.deltaY < 0) {
    currentScale += SCALE_STEP;
  } else {
    currentScale = Math.max(0.2, currentScale - SCALE_STEP);
  }

  modalImage.style.transform = `scale(${currentScale})`;
});

// Keyboard zoom (Ctrl + / Ctrl -)
document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("active")) return;

  if (e.ctrlKey && (e.key === "+" || e.key === "=")) {
    e.preventDefault();
    currentScale += SCALE_STEP;
    modalImage.style.transform = `scale(${currentScale})`;
  }

  if (e.ctrlKey && e.key === "-") {
    e.preventDefault();
    currentScale = Math.max(0.2, currentScale - SCALE_STEP);
    modalImage.style.transform = `scale(${currentScale})`;
  }
});

const imageContainer = document.querySelector(".image-container");

// Mouse down → start dragging
imageContainer.addEventListener("mousedown", (e) => {
  // Only allow dragging if zoomed in
  if (currentScale <= 1) return;

  isDragging = true;
  imageContainer.style.cursor = "grabbing";

  startX = e.pageX - imageContainer.offsetLeft;
  startY = e.pageY - imageContainer.offsetTop;

  scrollLeft = imageContainer.scrollLeft;
  scrollTop = imageContainer.scrollTop;
});

// Mouse move → drag while holding
imageContainer.addEventListener("mousemove", (e) => {
  if (!isDragging) return;

  e.preventDefault();

  const x = e.pageX - imageContainer.offsetLeft;
  const y = e.pageY - imageContainer.offsetTop;

  const walkX = x - startX;
  const walkY = y - startY;

  imageContainer.scrollLeft = scrollLeft - walkX;
  imageContainer.scrollTop = scrollTop - walkY;
});

// Mouse up → stop dragging
imageContainer.addEventListener("mouseup", () => {
  isDragging = false;
  imageContainer.style.cursor = "grab";
});

// Mouse leaves container → stop dragging
imageContainer.addEventListener("mouseleave", () => {
  isDragging = false;
  imageContainer.style.cursor = "grab";
});

// Global mouse release safety net
document.addEventListener("mouseup", () => {
  isDragging = false;
  imageContainer.style.cursor = "grab";
});

//Keyboard arrow scrolling with limits
document.addEventListener("keydown", (e) => {
  if (!modal.classList.contains("active")) return;
  if (!e.ctrlKey) return;

  const container = imageContainer;
  const maxScrollTop = container.scrollHeight - container.clientHeight;

  const SCROLL_STEP = 40;

  switch (e.key) {
    case "ArrowDown":
      e.preventDefault();
      container.scrollTop = Math.min(
        maxScrollTop,
        container.scrollTop + SCROLL_STEP,
      );
      break;

    case "ArrowUp":
      e.preventDefault();
      container.scrollTop = Math.max(0, container.scrollTop - SCROLL_STEP);
      break;
  }
});

// Close modal
closeModalBtn.addEventListener("click", () => {
  modal.classList.remove("active");
  document.body.classList.remove("modal-open");
});

/// View + Download button logic

document.addEventListener("click", (e) => {
  const viewBtn = e.target.closest(".view-btn");
  const downloadBtn = e.target.closest(".download-btn");

  if (!viewBtn && !downloadBtn) return;

  const fileItem = e.target.closest(".file-item");
  const file = fileItem?.file;
  if (!file) return;

  const fileURL = URL.createObjectURL(file);

  // VIEW
  if (viewBtn) {
    if (file.type.startsWith("image/")) {
      modalImage.src = fileURL;
      resetZoom();
      modal.classList.add("active");
      document.body.classList.add("modal-open");
    } else if (file.type === "application/pdf") {
      window.open(fileURL, "_blank");
    }
    return;
  }

  // DOWNLOAD
  if (downloadBtn) {
    const a = document.createElement("a");
    a.href = fileURL;
    a.download = file.name;
    document.body.appendChild(a);
    a.click();
    a.remove();

    URL.revokeObjectURL(fileURL);
  }
});
// DELETE button (open modal)
document.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return;

  fileToDelete = deleteBtn.closest(".file-item");

  // 🔹 Get file name
  const fileName = fileToDelete.querySelector(".file-name")?.textContent || "";

  // 🔹 Inject file name into modal
  deleteFileNameEl.textContent = `"${fileName}"`;

  deleteModal.classList.add("active");
});

// CONFIRM delete
confirmDeleteBtn.addEventListener("click", () => {
  if (!fileToDelete) return;

  const category = fileToDelete.closest(".upload-category");
  const fileList = category.querySelector(".file-list");
  const sendBtn = category.querySelector(".send-btn");

  // Remove the file
  fileToDelete.remove();
  fileToDelete = null;

  // If no files remain → hide send button
  if (fileList.children.length === 0 && sendBtn) {
    sendBtn.style.display = "none";
  }

  // ✅ Restore upload button if this is a single-file Upload category
  if (isSingleFileCategory(category)) {
    const uploadBtn = category.querySelector(".upload-btn");
    if (uploadBtn && fileList.children.length === 0) {
      uploadBtn.style.display = "inline-flex";
    }
  }

  deleteModal.classList.remove("active");
});

// CANCEL delete
cancelDeleteBtn.addEventListener("click", () => {
  fileToDelete = null;
  deleteModal.classList.remove("active");
  deleteFileNameEl.textContent = "";
});

//FILTERING PER DOCUMENT TYPE
const filterSelect = document.getElementById("docFilter");
const categories = document.querySelectorAll(".upload-category[data-type]");
filterSelect.addEventListener("change", () => {
  const value = filterSelect.value;

  const container = filterSelect.closest(".accordion-content");
  const actionsEl = container.querySelector(".accordion-actions");

  const allCategories = Array.from(
    container.querySelectorAll(".upload-category[data-type]"),
  );

  if (value === "all") {
    const withFiles = [];
    const withoutFiles = [];

    allCategories.forEach((category) => {
      const fileList = category.querySelector(".file-list");

      category.style.display = "block";

      if (fileList && fileList.children.length > 0) {
        withFiles.push(category);
      } else {
        withoutFiles.push(category);
      }
    });

    [...withFiles, ...withoutFiles].forEach((category) => {
      container.insertBefore(category, actionsEl);
    });

    return;
  }

  // Normal filtering behavior
  allCategories.forEach((category) => {
    if (category.dataset.type === value) {
      category.style.display = "block";
    } else {
      category.style.display = "none";
    }
  });
});

// SEND REPORT MODAL
const sendModal = document.getElementById("sendModal");
const sendFaxInput = document.getElementById("sendFax");
const sendEmailInput = document.getElementById("sendEmail");
const sendError = document.getElementById("sendError");

let fileToSend = null;

// Open send modal
document.addEventListener("click", (e) => {
  const sendBtn = e.target.closest(".send-btn");
  if (!sendBtn) return;

  fileToSend = sendBtn.closest(".file-item");

  sendError.textContent = "";
  sendFaxInput.value = "";
  sendEmailInput.value = "";

  sendModal.classList.add("active");
});

// Confirm send
document.getElementById("confirmSend").addEventListener("click", () => {
  const fax = sendFaxInput.value.trim();
  const email = sendEmailInput.value.trim();

  if (!fax && !email) {
    sendError.textContent = "Please enter a fax number or email.";
    return;
  }

  // Simulation success
  sendModal.classList.remove("active");
  fileToSend = null;
});

// Cancel send
document.getElementById("cancelSend").addEventListener("click", () => {
  sendModal.classList.remove("active");
  fileToSend = null;
});
