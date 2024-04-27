// @ts-ignore
/// <reference lib="es2015" />
// Interface för att definiera kursinformation
interface CourseInfo {
    id: string;
    code: string;
    name: string;
    progression: string;
    syllabus: string;
}

// Variabler för att hantera kurser
let courses: CourseInfo[] = [];
let editMode: boolean = false;
let courseToEditId: string = '';

// Funktion för att generera unikt ID för kurs
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

// Funktion för att visa formulär för att lägga till nya kurser
function showAddCourseForm() {
    const addCourseForm = document.getElementById('addCourseForm');
    const editCourseForm = document.getElementById('editCourseForm');
    if (addCourseForm && editCourseForm) {
        addCourseForm.classList.remove('hidden');
        editCourseForm.classList.add('hidden');
    }
}
// Funktion för att visa formulär för att redigera en befintlig kurs
function showEditCourseForm(courseId: string) {
    const editCourseForm = document.getElementById('editCourseForm');
    const addCourseForm = document.getElementById('addCourseForm');
    if (editCourseForm && addCourseForm) {
        editCourseForm.classList.remove('hidden');
        addCourseForm.classList.add('hidden');

        // Hämta den aktuella kursens information
        const courseToEdit = courses.find(course => course.id === courseId);
        if (courseToEdit) {
            // Fyll i formuläret med den aktuella kursens information
            (document.getElementById('editCode') as HTMLInputElement).value = courseToEdit.code;
            (document.getElementById('editName') as HTMLInputElement).value = courseToEdit.name;
            (document.getElementById('editProgression') as HTMLInputElement).value = courseToEdit.progression;
            (document.getElementById('editSyllabus') as HTMLInputElement).value = courseToEdit.syllabus;
            (document.getElementById('editCourseId') as HTMLInputElement).value = courseToEdit.id;
        }
    }
}

// Funktion för att lägga till ny kurs
function addCourse() {
    const code = (document.getElementById('code') as HTMLInputElement).value;
        // Kontrollera om kurskoden redan finns i listan över befintliga kurser
        if (courses.some(course => course.code === code)) {
            alert("Kurskoden måste vara unik. Ange en annan kurskod.");
            return; // Avsluta funktionen om kurskoden redan finns
        }
        // Om kurskoden är unik, fortsätt med att lägga till kursen
    const name = (document.getElementById('name') as HTMLInputElement).value;
    const progression = (document.getElementById('progression') as HTMLInputElement).value;
    // Kontrollera om progressionen är korrekt ('A'eller 'B')
    if (['A', 'B'].indexOf(progression.toUpperCase()) === -1) {
        alert("Progressionen måste vara 'A'eller 'B'. Ange en korrekt progression.");
        return; // Avsluta funktionen om progressionen är felaktig
    }
    const syllabus = (document.getElementById('syllabus') as HTMLInputElement).value;
    const courseId = generateId();

    const newCourse: CourseInfo = { id: courseId, code, name, progression, syllabus };
    courses.push(newCourse);
    saveCoursesToLocalStorage(); // Spara kurslistan i localstorage
    renderCourses();
    clearAddForm(); // Töm formuläret
}
// Eventlyssnare för att redigera en kurs när "Redigera"-knappen klickas
document.addEventListener('click', function(event) {
    const target = event.target as HTMLElement;
    if (target.tagName === 'BUTTON' && target.dataset.courseId) {
        const courseId = target.dataset.courseId;
        showEditCourseForm(courseId);
    }
});// Funktion för att spara redigerad kurs
function saveEditedCourse() {
    const courseId = (document.getElementById('editCourseId') as HTMLInputElement).value;
    const editedCourseIndex = courses.findIndex(course => course.id === courseId);
    if (editedCourseIndex !== -1) {
        const editedCode = (document.getElementById('editCode') as HTMLInputElement).value;
        const editedName = (document.getElementById('editName') as HTMLInputElement).value;
        const editedProgression = (document.getElementById('editProgression') as HTMLInputElement).value;
        const editedSyllabus = (document.getElementById('editSyllabus') as HTMLInputElement).value;

        // Kontrollera om kurskoden redan finns i listan över befintliga kurser
        if (courses.some(course => course.code === editedCode && course.id !== courseId)) {
            alert("Kurskoden måste vara unik. Ange en annan kurskod.");
            return; // Avsluta funktionen om kurskoden redan finns
        }

        // Kontrollera om progressionen är korrekt ('A' eller 'B')
        if (['A', 'B'].indexOf(editedProgression.toUpperCase()) === -1) {
            alert("Progressionen måste vara 'A' eller 'B'. Ange en korrekt progression.");
            return; // Avsluta funktionen om progressionen är felaktig
        }

        // Uppdatera den aktuella kursens information
        courses[editedCourseIndex].code = editedCode;
        courses[editedCourseIndex].name = editedName;
        courses[editedCourseIndex].progression = editedProgression;
        courses[editedCourseIndex].syllabus = editedSyllabus;
        saveCoursesToLocalStorage(); // Spara kurslistan i localstorage
        renderCourses();
        clearEditForm(); // Töm formulärfälten för redigering
    }
}

// Funktion för att avbryta redigering av kurs
function cancelEdit() {
    const editCourseForm = document.getElementById('editCourseForm');
    if (editCourseForm) {
        editCourseForm.classList.add('hidden');
        clearEditForm(); // Töm formulärfälten för redigering
    }
}

// Funktion för att radera kurs
function deleteCourse(courseId: string) {
    courses = courses.filter(course => course.id !== courseId);
    saveCoursesToLocalStorage(); // Spara kurslistan i localstorage
    renderCourses();
}

// Funktion för att rensa formuläret för att lägga till kurs
function clearAddForm() {
    (document.getElementById('code') as HTMLInputElement).value = '';
    (document.getElementById('name') as HTMLInputElement).value = '';
    (document.getElementById('progression') as HTMLInputElement).value = '';
    (document.getElementById('syllabus') as HTMLInputElement).value = '';
}

// Funktion för att rensa formuläret för att redigera kurs
function clearEditForm() {
    (document.getElementById('editCode') as HTMLInputElement).value = '';
    (document.getElementById('editName') as HTMLInputElement).value = '';
    (document.getElementById('editProgression') as HTMLInputElement).value = '';
    (document.getElementById('editSyllabus') as HTMLInputElement).value = '';
    (document.getElementById('editCourseId') as HTMLInputElement).value = '';
}

// Funktion för att spara kurslistan i localstorage
function saveCoursesToLocalStorage() {
    localStorage.setItem('courses', JSON.stringify(courses));
}

// Funktion för att ladda kurslistan från localstorage när sidan laddas
function loadCoursesFromLocalStorage() {
    const storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        courses = JSON.parse(storedCourses);
        renderCourses();
    }
}



// Funktion för att rendera kurslistan
function renderCourses() {
    const courseListElement = document.getElementById("courseList");
    if (courseListElement) {
        courseListElement.innerHTML = ""; // Rensa kurslistan
        courses.forEach(course => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <div class="infoCourse">
                    <div class="courseCode">${course.code}</div> 
                    <div class="courseName">${course.name}</div>  
                    <div class="progression">Progression: ${course.progression}</div> 
                    <div class="syllabus"><a href="${course.syllabus}">Länk</a></div>  
                    <div class="editBtn"><button type="button" data-course-id="${course.id}">Redigera</button></div>
                    <div class="deleteBtn"><button type="button" onclick="deleteCourse('${course.id}')">Radera</button></div>
                </div>
            `;
            courseListElement.appendChild(listItem);
            
        });

        }
       
}

// Anropa funktionen för att ladda kurslistan från localstorage när sidan laddas
window.onload = function() {
    loadCoursesFromLocalStorage();
    
};