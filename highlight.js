// Define the student scores here
const scores = [3, 3, 2.5, 3, 5, 3];

function highlightScores(scores) {
  const table = document.getElementById('rubric-table');
  const rows = table.tBodies[0].rows;

  scores.forEach((score, rowIndex) => {
    const colOffset = 1; // description is at index 0
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

highlightScores(scores);

// Deductions control: 1 = apply penalty, 0 = no deduction
const deductionFlags = [1, 1, 0, 1, 0, 0]; // Example input

function applyDeductions(flags) {
  const amount = [-2, -2, -2, -2, -2, -2]; // base deduction values
  let total = 0;

  flags.forEach((flag, index) => {
    const value = flag ? amount[index] : 0;
    const el = document.querySelector(`.deduction[data-index="${index}"]`);
    if (el) el.textContent = value;
    total += value;
  });

  document.getElementById('total-deduction').textContent = total;
}

// Call function
applyDeductions(deductionFlags);

