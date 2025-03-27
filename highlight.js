let students = []; // To store all parsed student data


document.getElementById('csvInput').addEventListener('change', function (e) {
  const reader = new FileReader();
  reader.onload = function () {
    const rows = reader.result.trim().split('\n').map(r => r.split(','));
    const header = rows.shift(); // optional: remove header
    students = rows.map(row => ({
      name: row[0],
      scores: row.slice(1, 7).map(Number),
      deductions: row.slice(7, 13).map(Number)
    }));
    populateDropdown(students);
    renderStudent(0); // Default to first student
  };
  reader.readAsText(e.target.files[0]);
});

function populateDropdown(data) {
  const select = document.getElementById('studentSelector');
  select.innerHTML = '';
  data.forEach((student, index) => {
    const option = document.createElement('option');
    option.value = index;
    option.textContent = student.name;
    select.appendChild(option);
  });

  select.onchange = () => {
    const index = Number(select.value);
    renderStudent(index);
  };
}

function renderStudent(index) {
  const student = students[index];
  document.getElementById('rubric-title').textContent = `Assessment Rubric - ${student.name}`;
  highlightScores(student.scores);
  applyDeductions(student.deductions);
}

function highlightScores(scores) {
  const table = document.getElementById('rubric-table');
  const rows = table.tBodies[0].rows;
  Array.from(table.querySelectorAll('.highlight')).forEach(cell => {
    cell.classList.remove('highlight');
  });

  scores.forEach((score, rowIndex) => {
    const colOffset = 1;
    let colIndexes = [];

    if (Number.isInteger(score)) {
      colIndexes = [colOffset + (5 - score)];
    } else {
      const floor = Math.floor(score);
      const ceil = Math.ceil(score);
      colIndexes = [colOffset + (5 - floor), colOffset + (5 - ceil)];
    }

    colIndexes.forEach(colIndex => {
      const cell = rows[rowIndex].cells[colIndex];
      if (cell) {
        cell.classList.add('highlight');
      }
    });
  });
}

function applyDeductions(flags) {
  const amount = [-2, -2, -2, -2, -2, -2];
  let total = 0;

  flags.forEach((flag, index) => {
    const value = flag ? amount[index] : 0;
    const el = document.querySelector(`.deduction[data-index="${index}"]`);
    if (el) el.textContent = value;
    total += value;
  });

  document.getElementById('total-deduction').textContent = total;
}

function generatePDF(student) {
    updateRubric(student.name, student.scores, student.deductions); // render on page
  
    const rubricContent = document.getElementById('rubric-wrapper');
  
    html2pdf()
      .set({ filename: `${student.name}_rubric.pdf` })
      .from(rubricContent)
      .save();
}

function downloadHtmlForAllStudents() {
    students.forEach(student => {
      const html = generateHtml(student);
      const blob = new Blob([html], { type: 'text/html' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `${student.name}_rubric.html`;
      a.click();
    });
}
  
function generateHtml(student) {
    const scoreCells = student.scores.map((s, i) => `<p>Q${i + 1}: ${s}</p>`).join('');
    const deductionCells = student.deductions.map((d, i) => `<p>D${i + 1}: ${d ? '-2' : '0'}</p>`).join('');
    const total = student.deductions.reduce((t, d) => t + (d ? -2 : 0), 0);
  
    return `
  <!DOCTYPE html>
  <html>
  <head><meta charset="UTF-8"><title>${student.name}'s Rubric</title></head>
  <body>
  <h2>Assessment Rubric - ${student.name}</h2>
  <div>
    <h3>Scores</h3>
    ${scoreCells}
    <h3>Deductions</h3>
    ${deductionCells}
    <strong>Total Deduction: ${total}</strong>
  </div>
  </body>
  </html>
    `;
}

document.getElementById('downloadHtmlBtn').addEventListener('click', () => {
    if (students.length === 0) {
      alert("Please load a CSV file first.");
      return;
    }
    downloadHtmlForAllStudents();
  });
  
  
