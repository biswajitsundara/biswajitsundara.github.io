const printButton = document.getElementById('printResume');
if (printButton) printButton.addEventListener('click', () => window.print());
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();
