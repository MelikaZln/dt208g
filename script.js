/// <reference lib="es2015" />
// Variabler för att hantera kurser
var courses = [];
var editMode = false;
var courseToEditId = '';
// Funktion för att generera unikt ID för kurs
function generateId() {
    return '_' + Math.random().toString(36).substr(2, 9);
}
// Funktion för att visa formulär för att lägga till nya kurser
function showAddCourseForm() {
    var addCourseForm = document.getElementById('addCourseForm');
    var editCourseForm = document.getElementById('editCourseForm');
    if (addCourseForm && editCourseForm) {
        addCourseForm.classList.remove('hidden');
        editCourseForm.classList.add('hidden');
    }
}
// Funktion för att visa formulär för att redigera en befintlig kurs
function showEditCourseForm(courseId) {
    var editCourseForm = document.getElementById('editCourseForm');
    var addCourseForm = document.getElementById('addCourseForm');
    if (editCourseForm && addCourseForm) {
        editCourseForm.classList.remove('hidden');
        addCourseForm.classList.add('hidden');
        // Hämta den aktuella kursens information
        var courseToEdit = courses.find(function (course) { return course.id === courseId; });
        if (courseToEdit) {
            // Fyll i formuläret med den aktuella kursens information
            document.getElementById('editCode').value = courseToEdit.code;
            document.getElementById('editName').value = courseToEdit.name;
            document.getElementById('editProgression').value = courseToEdit.progression;
            document.getElementById('editSyllabus').value = courseToEdit.syllabus;
            document.getElementById('editCourseId').value = courseToEdit.id;
        }
    }
}
// Funktion för att lägga till ny kurs
function addCourse() {
    var code = document.getElementById('code').value;
    // Kontrollera om kurskoden redan finns i listan över befintliga kurser
    if (courses.some(function (course) { return course.code === code; })) {
        alert("Kurskoden måste vara unik. Ange en annan kurskod.");
        return; // Avsluta funktionen om kurskoden redan finns
    }
    // Om kurskoden är unik, fortsätt med att lägga till kursen
    var name = document.getElementById('name').value;
    var progression = document.getElementById('progression').value;
    // Kontrollera om progressionen är korrekt ('A'eller 'B')
    if (['A', 'B'].indexOf(progression.toUpperCase()) === -1) {
        alert("Progressionen måste vara 'A'eller 'B'. Ange en korrekt progression.");
        return; // Avsluta funktionen om progressionen är felaktig
    }
    var syllabus = document.getElementById('syllabus').value;
    var courseId = generateId();
    var newCourse = { id: courseId, code: code, name: name, progression: progression, syllabus: syllabus };
    courses.push(newCourse);
    saveCoursesToLocalStorage(); // Spara kurslistan i localstorage
    renderCourses();
    clearAddForm(); // Töm formuläret
}
// Eventlyssnare för att redigera en kurs när "Redigera"-knappen klickas
document.addEventListener('click', function (event) {
    var target = event.target;
    if (target.tagName === 'BUTTON' && target.dataset.courseId) {
        var courseId = target.dataset.courseId;
        showEditCourseForm(courseId);
    }
}); // Funktion för att spara redigerad kurs
function saveEditedCourse() {
    var courseId = document.getElementById('editCourseId').value;
    var editedCourseIndex = courses.findIndex(function (course) { return course.id === courseId; });
    if (editedCourseIndex !== -1) {
        var editedCode_1 = document.getElementById('editCode').value;
        var editedName = document.getElementById('editName').value;
        var editedProgression = document.getElementById('editProgression').value;
        var editedSyllabus = document.getElementById('editSyllabus').value;
        // Kontrollera om kurskoden redan finns i listan över befintliga kurser
        if (courses.some(function (course) { return course.code === editedCode_1 && course.id !== courseId; })) {
            alert("Kurskoden måste vara unik. Ange en annan kurskod.");
            return; // Avsluta funktionen om kurskoden redan finns
        }
        // Kontrollera om progressionen är korrekt ('A' eller 'B')
        if (['A', 'B'].indexOf(editedProgression.toUpperCase()) === -1) {
            alert("Progressionen måste vara 'A' eller 'B'. Ange en korrekt progression.");
            return; // Avsluta funktionen om progressionen är felaktig
        }
        // Uppdatera den aktuella kursens information
        courses[editedCourseIndex].code = editedCode_1;
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
    var editCourseForm = document.getElementById('editCourseForm');
    if (editCourseForm) {
        editCourseForm.classList.add('hidden');
        clearEditForm(); // Töm formulärfälten för redigering
    }
}
// Funktion för att radera kurs
function deleteCourse(courseId) {
    courses = courses.filter(function (course) { return course.id !== courseId; });
    saveCoursesToLocalStorage(); // Spara kurslistan i localstorage
    renderCourses();
}
// Funktion för att rensa formuläret för att lägga till kurs
function clearAddForm() {
    document.getElementById('code').value = '';
    document.getElementById('name').value = '';
    document.getElementById('progression').value = '';
    document.getElementById('syllabus').value = '';
}
// Funktion för att rensa formuläret för att redigera kurs
function clearEditForm() {
    document.getElementById('editCode').value = '';
    document.getElementById('editName').value = '';
    document.getElementById('editProgression').value = '';
    document.getElementById('editSyllabus').value = '';
    document.getElementById('editCourseId').value = '';
}
// Funktion för att spara kurslistan i localstorage
function saveCoursesToLocalStorage() {
    localStorage.setItem('courses', JSON.stringify(courses));
}
// Funktion för att ladda kurslistan från localstorage när sidan laddas
function loadCoursesFromLocalStorage() {
    var storedCourses = localStorage.getItem('courses');
    if (storedCourses) {
        courses = JSON.parse(storedCourses);
        renderCourses();
    }
}
// Funktion för att rendera kurslistan
function renderCourses() {
    var courseListElement = document.getElementById("courseList");
    if (courseListElement) {
        courseListElement.innerHTML = ""; // Rensa kurslistan
        courses.forEach(function (course) {
            var listItem = document.createElement("li");
            listItem.innerHTML = "\n                <div class=\"infoCourse\">\n                    <div class=\"courseCode\">".concat(course.code, "</div> \n                    <div class=\"courseName\">").concat(course.name, "</div>  \n                    <div class=\"progression\">Progression: ").concat(course.progression, "</div> \n                    <div class=\"syllabus\"><a href=\"").concat(course.syllabus, "\">L\u00E4nk</a></div>  \n                    <div class=\"editBtn\"><button type=\"button\" data-course-id=\"").concat(course.id, "\">Redigera</button></div>\n                    <div class=\"deleteBtn\"><button type=\"button\" onclick=\"deleteCourse('").concat(course.id, "')\">Radera</button></div>\n                </div>\n            ");
            courseListElement.appendChild(listItem);
        });
    }
}
// Anropa funktionen för att ladda kurslistan från localstorage när sidan laddas
window.onload = function () {
    loadCoursesFromLocalStorage();
};
