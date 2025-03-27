// export { showError, hideError, isValidEmail, formatDate, setupValidation, validateForm }; 
// Form Validation for CV Generator

// Function to show error message
function showError(inputId, message) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement && inputElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }
}

// Function to hide error message
function hideError(inputId) {
    const errorElement = document.getElementById(`${inputId}-error`);
    const inputElement = document.getElementById(inputId);
    
    if (errorElement && inputElement) {
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
    }
}

// Function to validate email
function isValidEmail(email) {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
}

// Format date to "Month DD, YYYY" with leading zeros for days
function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'long', day: '2-digit', year: 'numeric' });
}

// Setup field validations
function setupValidation() {
    const fields = ['fullName', 'ugHty', 'institute', 'dob', 'email', 'enrollmentNo', 'branch', 'specialization', 'mobile'];
    
    fields.forEach(field => {
        const inputElement = document.getElementById(field);
        if (!inputElement) return; // Skip if the field is missing

        inputElement.addEventListener('input', function (e) {
            hideError(field);
        });
    });

    document.getElementById('fullName')?.addEventListener('input', function(e) {
        const fullName = e.target.value.trim();
        hideError('fullName');
        if (fullName.split(' ').length < 2) {
            showError('fullName', 'Please enter both first and last name');
        } else {
            e.target.value = fullName.replace(/\b\w/g, char => char.toUpperCase());
        }
    });

    document.getElementById('email')?.addEventListener('input', function(e) {
        const value = e.target.value.trim();
        hideError('email');
        if (!isValidEmail(value)) {
            showError('email', 'Please enter a valid email address');
        }
    });

    document.getElementById('mobile')?.addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('mobile');

        value = value.replace(/\D/g, ''); // Remove non-numeric characters
        if (value.startsWith('91')) value = '+91 ' + value.slice(2);
        else if (!value.startsWith('+91 ')) value = '+91 ' + value;

        if (value.replace(/\D/g, '').length !== 12) {
            showError('mobile', 'Mobile number should be 10 digits after +91');
        }

        e.target.value = value;
    });

    document.getElementById('dob')?.addEventListener('change', function(e) {
        const date = new Date(e.target.value);
        const now = new Date();
        hideError('dob');
        if (date > now) showError('dob', 'Date of birth cannot be in the future');
        else if (now.getFullYear() - date.getFullYear() < 15) showError('dob', 'Age should be at least 15 years');
    });
}
document.getElementById('branch')?.addEventListener('input', function (e) {
    let value = e.target.value.trim();
    hideError('branch');

    if (value.length > 0) {
        const originalValue = value;

        // Capitalize first letter of each word while keeping spaces
        value = value.replace(/\b\w/g, match => match.toUpperCase());

        // Replace abbreviated forms of "Engineering"
        value = value.replace(/\bEng\b/i, 'Engineering').replace(/\bEngg\b/i, 'Engineering');

        // Ensure technical branches include "Engineering"
        const technicalBranches = ['Computer Science', 'Information Technology', 'Electronics', 'Electrical', 'Mechanical', 'Civil'];
        for (const branch of technicalBranches) {
            if (value.toLowerCase().includes(branch.toLowerCase()) && !value.includes('Engineering')) {
                value += ' Engineering';
                break;
            }
        }

        e.target.value = value;

        // Show error if we made modifications
        if (originalValue !== value) {
            showError('branch', 'Branch name formatted correctly.');
        }
    }
});

// Validate form before submission
function validateForm() {
    let hasErrors = false;
    const requiredFields = ['fullName', 'email', 'dob', 'mobile'];

    requiredFields.forEach(field => {
        const value = document.getElementById(field)?.value.trim();
        if (!value) {
            showError(field, `${field.replace(/([A-Z])/g, ' $1')} is required`);
            hasErrors = true;
        }
    });

    return !hasErrors;
}

export { showError, hideError, isValidEmail, formatDate, setupValidation, validateForm };
