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

  // Empty cells before the 1st
  for (let i = 0; i < firstDay; i++) {
    const empty = document.createElement("div");
    empty.classList.add("empty");
    grid.appendChild(empty);
  }

  // Actual days
  for (let day = 1; day <= daysInMonth; day++) {
    const btn = document.createElement("button");
    btn.textContent = day;
    const thisDay = new Date(year, month, day);
    thisDay.setHours(0, 0, 0, 0);

    // 🔒 Disable past dates
    if (thisDay < today) {
      btn.disabled = true;
      btn.classList.add("disabled");
    } else {
      //  Click only allowed for valid dates
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

// DISABLE PAST DATES
// const today = new Date();
// today.setHours(0, 0, 0, 0);

// const currentDay = new Date(year, month, day);

// if (currentDay < today) {
//   btn.disabled = true;
//   btn.classList.add("disabled");
// }

// if (
//   day === today.getDate() &&
//   month === today.getMonth() &&
//   year === today.getFullYear()
// ) {
//   btn.classList.add("today");
// }

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
}

// UPLOADS SECTION
document
  .querySelectorAll('.upload-category input[type="file"]')
  .forEach((input) => {
    input.addEventListener("change", () => {
      const fileList = input
        .closest(".upload-category")

        .querySelector(".file-list");

      for (const file of input.files) {
        const now = new Date();
        const formattedDate = now.toLocaleDateString();
        const formattedTime = now.toLocaleTimeString([], {
          hour: "numeric",
          minute: "2-digit",
        });

        const li = document.createElement("li");
        li.className = "file-item";

        // store file reference for later (view/download)
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
        const category = input.closest(".upload-category");
        const sendBtn = category.querySelector(".send-btn");
        if (sendBtn) {
          sendBtn.style.display = "inline-block";
        }
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

  categories.forEach((category) => {
    if (value === "all") {
      category.style.display = "block";
    } else if (category.dataset.type === value) {
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
