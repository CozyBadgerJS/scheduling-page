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
    name: "Sunrise Medical Center",
    rooms: ["Room Blue", "Room Red"],
  },
  {
    id: "clinic2",
    name: "Green Valley Imaging",
    rooms: ["Room Yellow", "Room Green"],
  },
  {
    id: "clinic3",
    name: "Purple Cross Diagnostics",
    rooms: ["Room Purple"],
  },
];

// POPULATING CLINICS
const clinicSelect = document.getElementById("clinic");
const roomSelect = document.getElementById("room");

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
    (clinic) => clinic.id === selectedClinicId
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

// CALENDAR

let currentDate = new Date();
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
    btn.classList.add("calendar-day");

    grid.appendChild(btn);
  }
}
renderCalendar(currentDate);

document.getElementById("prev-month").addEventListener("click", () => {
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
        container.scrollTop + SCROLL_STEP
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
