class NoteModel {
  constructor() {
    this.notes = [];
    this.observers = [];
  }

  addObserver(observer) {
    this.observers.push(observer);
  }

  notifyObservers() {
    for (let observer of this.observers) {
      observer.update(this.notes);
    }
  }

  addNoteText(noteText) {
    this.notes.push({
      text: noteText,
      completed: false,
    });
    this.notifyObservers();
  }

  toggleNoteCompleted(index) {
    this.notes[index].completed = !this.notes[index].completed;
    this.notifyObservers();
  }

  removeNoteText(index) {
    this.notes.splice(index, 1);
    this.notifyObservers();
  }
}

class NoteView {
  constructor() {
    this.noteInput = document.getElementById("noteInput");
    this.noteList = document.getElementById("noteList");
  }

  clearNoteInput() {
    this.noteInput.value = "";
  }

  createNoteElement(note, index) {
    const li = document.createElement("li");
    li.classList.add("list-group-item");
    li.style.display = 'flex';  // Add this line
    li.style.alignItems = 'center';  // And this line
  
    const checkboxNote = document.createElement("div");
    checkboxNote.className = "checkbox-note";
  
    const completeButton = document.createElement("input");
    completeButton.type = "checkbox";
    completeButton.checked = note.completed;
  
    completeButton.addEventListener("change", () => {
      this.handleToggleNoteCompleted(index);
    });
  
    const noteText = document.createElement("span");
    noteText.textContent = note.text;
    if (note.completed) {
      noteText.classList.add("complete");
    }
  
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("btn", "btn-danger", "btn-sm");
    deleteButton.textContent = "Delete";
  
    deleteButton.addEventListener("click", () => {
      this.handleDeleteNoteClick(index);
    });
  
    checkboxNote.appendChild(completeButton);
    checkboxNote.appendChild(noteText);
  
    li.appendChild(checkboxNote);
    li.appendChild(deleteButton);
  
    this.noteList.appendChild(li);
  }
  
  removeNoteElement(index) {
    this.noteList.removeChild(this.noteList.childNodes[index]);
  }

  toggleNoteCompleted(index) {
    const noteText = this.noteList.childNodes[index].querySelector("span");
    noteText.classList.toggle("complete");
  }

  update(notes) {
    this.clearNoteList();

    for (let i = 0; i < notes.length; i++) {
      this.createNoteElement(notes[i], i);
    }
  }

  clearNoteList() {
    while (this.noteList.firstChild) {
      this.noteList.removeChild(this.noteList.firstChild);
    }
  }

  handleToggleNoteCompleted(index) {
    this.notifyToggleNoteCompleted(index);
  }

  handleDeleteNoteClick(index) {
    this.notifyDeleteNoteClick(index);
  }

  bindAddNoteSubmit(handler) {
    document.getElementById("bookingForm").addEventListener("submit", (event) => {
      event.preventDefault();
      handler(this.noteInput.value.trim());
      this.clearNoteInput();
    });
  }

  bindToggleNoteCompleted(handler) {
    this.notifyToggleNoteCompleted = handler;
  }

  bindDeleteNoteClick(handler) {
    this.notifyDeleteNoteClick = handler;
  }
}

class NoteController {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.view.bindAddNoteSubmit(this.handleAddNoteSubmit.bind(this));
    this.view.bindToggleNoteCompleted(this.handleToggleNoteCompleted.bind(this));
    this.view.bindDeleteNoteClick(this.handleDeleteNoteClick.bind(this));

    this.model.addObserver(this.view);
  }

  handleAddNoteSubmit(noteText) {
    if (noteText !== "") {
      this.model.addNoteText(noteText);
    } else {
      alert("Please enter a note before submitting.");
    }
  }

  handleToggleNoteCompleted(index) {
    this.model.toggleNoteCompleted(index);
  }

  handleDeleteNoteClick(index) {
    this.model.removeNoteText(index);
  }
}

const model = new NoteModel();
const view = new NoteView();
const controller = new NoteController(model, view);

// Function to update date and time
function updateDateTime() {
  let dateTime = document.getElementById('dateTime');
  let now = new Date();
  let formattedDate = now.toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric' });
  dateTime.textContent = formattedDate;
  
}
  
  // Update date and time every second
  setInterval(updateDateTime, 1000);
  