// Creating suggestions for course name
const subjectInput = document.getElementById('subject');
const courseDropdown = document.getElementById('courseDropdown');

const courseSuggestions = [
    { name: "PYTHON", credit: 3 },
    { name: "SOFTWARE TESTING", credit: 4 },
    { name: "VISUAL BASICS", credit: 3 },
    { name: "VISUAL BASICS LAB", credit: 4 },
    { name: "ORACLE", credit: 3 },
    { name: "ORACLE LAB", credit: 4 },
    { name: "TAMIL", credit: 2 },
    { name: "ENGLISH", credit: 2 }
];

function filterCourseSuggestions() {
    const query = subjectInput.value.trim().toLowerCase();
    courseDropdown.innerHTML = '';

    const filtered = courseSuggestions.filter(suggestion =>
        suggestion.name.toLowerCase().includes(query)
    );

    filtered.forEach(suggestion => {
        const item = document.createElement('div');
        item.classList.add('dropdown-item');
        item.textContent = suggestion.name;
        item.addEventListener('mousedown', () => {
            subjectInput.value = suggestion.name;
            creditHours.value = suggestion.credit;
            hideSuggestions();
        });
        courseDropdown.appendChild(item);
    });

    if (filtered.length > 0) {
        courseDropdown.classList.add('show');
    } else {
        courseDropdown.classList.remove('show');
    }
}

function hideSuggestions() {
    courseDropdown.classList.remove('show');
}

subjectInput.addEventListener('input', filterCourseSuggestions);
subjectInput.addEventListener('focus', filterCourseSuggestions);
subjectInput.addEventListener('blur', () => {
    setTimeout(hideSuggestions, 150);
});

// Creating suggestions for grade input
const gradeInput = document.getElementById('grade');
const gradeDropdown = document.getElementById('gradeDropdown');

const gradeSuggestions = {
    "A": { point: 4.0, weight: 1 },
    "A-": { point: 3.7, weight: 1 },
    "B+": { point: 3.3, weight: 1 },
    "B": { point: 3.0, weight: 1 },
    "B-": { point: 2.7, weight: 1 },
    "C+": { point: 2.3, weight: 1 },
    "C": { point: 2.0, weight: 1 },
    "C-": { point: 1.7, weight: 1 },
    "D+": { point: 1.3, weight: 1 },
    "D": { point: 1.0, weight: 1 },
    "D-": { point: 0.7, weight: 1 },
    "F": { point: 0.0, weight: 0 }
};

function showGradeSuggestions() {
    gradeDropdown.innerHTML = '';

    Object.keys(gradeSuggestions).forEach(grade => {
        const item = document.createElement('div');
        item.classList.add('dropdown-item');
        item.textContent = grade;
        item.addEventListener('mousedown', () => {
            gradeInput.value = grade;
            hideGradeSuggestions();
        });
        gradeDropdown.appendChild(item);
    });

    gradeDropdown.classList.add('show');
}

function hideGradeSuggestions() {
    gradeDropdown.classList.remove('show');
}

gradeInput.addEventListener('focus', showGradeSuggestions);
gradeInput.addEventListener('blur', () => {
    setTimeout(hideGradeSuggestions, 150);
});

// Adding inputs to the table
const entryButton = document.getElementById('entry');
const subjectList = document.getElementById('subject-list');
const subjectName = document.getElementById('sname');
const creditHours = document.getElementById('credit');
const gradeScore = document.getElementById('grade-score');

entryButton.addEventListener('click', () => {
    const subject = subjectInput.value.trim();
    const credit = parseInt(creditHours.value.trim());
    const grade = gradeInput.value.trim().toUpperCase();

    if (!subject || !credit || !grade || !gradeSuggestions[grade]) {
        alert("Please fill in all fields correctly.");
        return;
    }

    if (isNaN(credit) || credit <= 0 || credit > 4) {
        alert("Please enter a valid number for credit hours.");
        return;
    }

    if (!subjectList || subjectList.tagName !== 'TBODY') {
        alert("Table body (tbody) with id 'subject-list' not found.");
        return;
    }

    const newRow = document.createElement('tr');
    newRow.innerHTML = `
        <td>${subject}</td>
        <td>${credit}</td>
        <td>${grade}</td>
    `;

    subjectList.appendChild(newRow);

    subjectInput.value = '';
    creditHours.value = '';
    gradeInput.value = '';

    saveTableData();
});

// Resetting the table using button
const resetButton = document.getElementById('reset');
resetButton.addEventListener('click', () => {
    subjectList.innerHTML = '';
    localStorage.removeItem('gpaTableData');
    gpapercentage.textContent = "GPA: 0.00";
    totalCredits.textContent = "Total Credits: 0";
    totalGradePoints.textContent = "Total Grade Points: 0";
    alert("Table has been reset.");
});

// Calculating GPA
const gpaButton = document.getElementById('getGpa');
const gpapercentage = document.getElementById('gpa');
const totalCredits = document.getElementById('tcredits');
const totalGradePoints = document.getElementById('tgp');

gpaButton.addEventListener('click', () => {
    const rows = subjectList.querySelectorAll('tr');
    let totalCreditsValue = 0;
    let totalGradePointsValue = 0;

    rows.forEach(row => {
        const cells = row.querySelectorAll('td');
        if (cells.length < 3) return;

        const credit = parseInt(cells[1].textContent);
        const grade = cells[2].textContent.trim().toUpperCase();

        if (isNaN(credit) || !gradeSuggestions[grade]) return;

        totalCreditsValue += credit;
        totalGradePointsValue += credit * gradeSuggestions[grade].point;
    });

    if (totalCreditsValue === 0) {
        gpapercentage.textContent = "GPA: 0.00";
        totalCredits.textContent = "Total Credits: 0";
        totalGradePoints.textContent = "Total Grade Points: 0";
        return;
    }

    const gpa = (totalGradePointsValue / totalCreditsValue).toFixed(2);

    gpapercentage.textContent = `GPA: ${gpa}`;
    totalCredits.textContent = `Total Credits: ${totalCreditsValue}`;
    totalGradePoints.textContent = `Total Grade Points: ${totalGradePointsValue}`;
});

// Saving and loading table data to/from localStorage
function saveTableData() {
    const rows = Array.from(subjectList.querySelectorAll('tr')).map(row => {
        const cells = row.querySelectorAll('td');
        return {
            subject: cells[0].textContent,
            credit: cells[1].textContent,
            grade: cells[2].textContent
        };
    });
    localStorage.setItem('gpaTableData', JSON.stringify(rows));
}

function loadTableData() {
    const data = JSON.parse(localStorage.getItem('gpaTableData') || '[]');
    subjectList.innerHTML = '';
    data.forEach(item => {
        const newRow = document.createElement('tr');
        newRow.innerHTML = `
            <td>${item.subject}</td>
            <td>${item.credit}</td>
            <td>${item.grade}</td>
        `;
        subjectList.appendChild(newRow);
    });
}

window.addEventListener('DOMContentLoaded', loadTableData);

// Info Modal
document.addEventListener('DOMContentLoaded', function () {
    const infoLi = document.querySelector('.nav-container ul li');
    const modal = document.getElementById('infoModal');
    const closeBtn = document.getElementById('closeInfoModal');
    if (infoLi && modal && closeBtn) {
        infoLi.style.cursor = 'pointer';
        infoLi.onclick = () => { modal.style.display = 'flex'; };
        closeBtn.onclick = () => { modal.style.display = 'none'; };
        modal.onclick = (e) => { if (e.target === modal) modal.style.display = 'none'; };
    }
});
