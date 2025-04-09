// Проверка онлайн-статуса
function updateOnlineStatus() {
    const offlineStatus = document.getElementById('offline-status');
    if (navigator.onLine) {
        offlineStatus.classList.add('hidden');
    } else {
        offlineStatus.classList.remove('hidden');
    }
}

window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
updateOnlineStatus();

// Работа с заметками
document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const addNoteBtn = document.getElementById('add-note-btn');
    const notesList = document.getElementById('notes-list');

    // Загрузка заметок из localStorage
    function loadNotes() {
        const notes = JSON.parse(localStorage.getItem('notes')) || [];
        renderNotes(notes);
    }

    // Отображение заметок
    function renderNotes(notes) {
        notesList.innerHTML = '';
        notes.forEach((note, index) => {
            const noteElement = document.createElement('div');
            noteElement.className = 'note';
            noteElement.innerHTML = `
                <button class="delete-btn" data-index="${index}">×</button>
                <div class="note-content">${note.text}</div>
                <div class="note-date">${new Date(note.date).toLocaleString()}</div>
            `;
            notesList.appendChild(noteElement);
        });

        // Обработчики удаления
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', deleteNote);
        });
    }

    // Добавление заметки
    function addNote() {
        const text = noteInput.value.trim();
        if (text) {
            const notes = JSON.parse(localStorage.getItem('notes')) || [];
            notes.push({
                text: text,
                date: new Date().toISOString()
            });
            localStorage.setItem('notes', JSON.stringify(notes));
            noteInput.value = '';
            renderNotes(notes);
        }
    }

    // Удаление заметки
    function deleteNote(e) {
        const index = e.target.getAttribute('data-index');
        const notes = JSON.parse(localStorage.getItem('notes'));
        notes.splice(index, 1);
        localStorage.setItem('notes', JSON.stringify(notes));
        renderNotes(notes);
    }

    // Обработчики событий
    addNoteBtn.addEventListener('click', addNote);
    noteInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            addNote();
        }
    });

    loadNotes(); // Загружаем заметки при старте
});

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(reg => console.log('✅ Service Worker зарегистрирован'))
            .catch(err => console.log('❌ Ошибка:', err));
    });
}