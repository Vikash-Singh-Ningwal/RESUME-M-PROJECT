
// Function to print the CV
function printCV() {
    window.print();
}

// Setup print button
function setupPrintButton() {
    const printButton = document.getElementById('print-cv');
    if (printButton) {
        printButton.addEventListener('click', printCV);
    }
}

export { printCV, setupPrintButton }; 