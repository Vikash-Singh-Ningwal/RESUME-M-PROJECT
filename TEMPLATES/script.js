document.addEventListener('DOMContentLoaded', function() {
    // References to form and CV template
    const cvForm = document.getElementById('cv-form');
    const cvTemplate = document.getElementById('cv-template');
    const generateButton = document.getElementById('generate-cv');
    const printButton = document.getElementById('print-cv');

    // Store added items
    const educationEntries = [];
    const achievements = [];
    const projectDetails = {};
    const projects = [];
    const coreCourses = [];
    const breadthCourses = [];
    const responsibilities = [];
    const activities = [];
    let currentProjectId = 'main';
    projectDetails[currentProjectId] = [];

    // Function to show error message
    function showError(inputId, message) {
        const errorElement = document.getElementById(`${inputId}-error`);
        const inputElement = document.getElementById(inputId);
        
        errorElement.textContent = message;
        errorElement.style.display = 'block';
        inputElement.classList.add('error');
    }

    // Function to hide error message
    function hideError(inputId) {
        const errorElement = document.getElementById(`${inputId}-error`);
        const inputElement = document.getElementById(inputId);
        
        errorElement.style.display = 'none';
        inputElement.classList.remove('error');
    }

    // Function to validate email
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Function to format date to "Month DD, YYYY" format with leading zeros for single digit days
    function formatDate(dateString) {
        if (!dateString) return '';
        const date = new Date(dateString);
        
        const month = date.toLocaleDateString('en-US', { month: 'long' });
        // Ensure day has leading zero if it's single digit
        const day = date.getDate().toString().padStart(2, '0');
        const year = date.getFullYear();
        
        return `${month} ${day}, ${year}`;
    }

    // Real-time validation for personal details
    
    // Full Name: Space between first and last name, first letter of each capitalized
    document.getElementById('fullName').addEventListener('input', function(e) {
        const fullName = e.target.value.trim();
        const nameArray = fullName.split(' ');
        
        hideError('fullName');
        
        if (fullName.length === 0) {
            showError('fullName', 'Full name is required');
            return;
        }
        
        if (nameArray.length < 2) {
            showError('fullName', 'Please enter both first and last name');
            return;
        }
        
        const formattedName = nameArray.map(name => 
            name.charAt(0).toUpperCase() + name.slice(1).toLowerCase()
        ).join(' ');
        
        e.target.value = formattedName;
    });

    // UG HYT: Capital letters for UG, PG, etc.
    document.getElementById('ugHty').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('ugHty');
        
        // Check if it starts with valid degree type
        const validPrefixes = ['UG', 'PG', 'PHD', 'MTECH', 'BTECH'];
        const matches = value.match(/^(ug|pg|phd|mtech|btech)/i);
        
        if (!matches) {
            showError('ugHty', 'Should start with UG, PG, BTECH, etc.');
        } else {
            const prefix = matches[0].toUpperCase();
            value = prefix + value.substring(matches[0].length);
            e.target.value = value;
        }
    });

    // Institute: All caps for institute names like SGSITS
    document.getElementById('institute').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('institute');
        
        if (value.length > 0) {
            // Check for known institutes
            const knownInstitutes = ['SGSITS', 'IIT', 'NIT', 'IIIT', 'BITS', 'VIT', 'MIT', 'RGPV'];
            const instituteMatches = value.match(/(sgsits|iit|nit|iiit|bits|vit|mit|rgpv)/i);
            
            if (instituteMatches) {
                const institute = instituteMatches[0].toUpperCase();
                value = value.replace(new RegExp(instituteMatches[0], 'i'), institute);
                e.target.value = value;
            } else {
                showError('institute', 'Use capital letters for institute abbreviations');
            }
        }
    });

    // Date of Birth validation
    document.getElementById('dob').addEventListener('change', function(e) {
        const value = e.target.value;
        hideError('dob');
        
        if (value) {
            const date = new Date(value);
            const now = new Date();
            
            if (date > now) {
                showError('dob', 'Date of birth cannot be in the future');
            } else if (now.getFullYear() - date.getFullYear() < 15) {
                showError('dob', 'Age should be at least 15 years');
            }
        }
    });

    // Email validation
    document.getElementById('email').addEventListener('input', function(e) {
        const value = e.target.value.trim();
        hideError('email');
        
        if (value.length > 0 && !isValidEmail(value)) {
            showError('email', 'Please enter a valid email address');
        }
    });

    // Enrollment No: Capital letters and starting with zero if applicable
    document.getElementById('enrollmentNo').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('enrollmentNo');
        
        if (value.length > 0) {
            // Convert any letters to uppercase
            const originalValue = value;
            value = value.replace(/[a-z]/g, match => match.toUpperCase());
            
            // Ensure it starts with 0 if it's numeric and doesn't already start with 0
            if (/^\d+/.test(value) && !value.startsWith('0')) {
                value = '0' + value;
            }
            
            e.target.value = value;
            
            // Check if we made any changes
            if (originalValue !== value) {
                showError('enrollmentNo', 'Enrollment number formatted (capital letters, leading zero)');
            }
        }
    });

    // Branch: First letter capital and "Engineering" in full
    document.getElementById('branch').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('branch');
        
        if (value.length > 0) {
            const originalValue = value;
            
            // Capitalize first letter of each word
            value = value.replace(/\b\w/g, match => match.toUpperCase());
            
            // Replace abbreviated forms of "Engineering"
            value = value.replace(/\bEng\b/i, 'Engineering');
            value = value.replace(/\bEngg\b/i, 'Engineering');
            
            e.target.value = value;
            
            // Check if we made any changes
            if (originalValue !== value) {
                showError('branch', 'Branch name formatted (capitalized, "Engineering" in full)');
            }
            
            // Check if it contains "Engineering" for technical branches
            const technicalBranches = ['Computer', 'Information', 'Electronics', 'Electrical', 'Mechanical', 'Civil'];
            if (technicalBranches.some(branch => value.includes(branch)) && !value.includes('Engineering')) {
                showError('branch', 'Technical branches should include "Engineering"');
            }
        }
    });

    // Specialization: First letter capital
    document.getElementById('specialization').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('specialization');
        
        if (value.length > 0) {
            const originalValue = value;
            
            // Capitalize first letter of each word
            value = value.replace(/\b\w/g, match => match.toUpperCase());
            
            e.target.value = value;
            
            // Check if we made any changes
            if (originalValue !== value) {
                showError('specialization', 'Specialization formatted (capitalized)');
            }
        }
    });

    // Mobile: +91 space and 10 digits
    document.getElementById('mobile').addEventListener('input', function(e) {
        let value = e.target.value.trim();
        hideError('mobile');
        
        if (value.length > 0) {
            const originalValue = value;
            
            // Ensure it starts with +91
            if (!value.startsWith('+91')) {
                if (value.startsWith('+')) {
                    value = '+91' + value.substring(1);
                } else if (value.startsWith('91')) {
                    value = '+' + value;
                } else {
                    value = '+91 ' + value.replace(/^\+91\s*/, '');
                }
            }
            
            // Ensure space after +91
            if (value.startsWith('+91') && value.length > 3 && value.charAt(3) !== ' ') {
                value = '+91 ' + value.substring(3);
            }
            
            // Extract digits
            const digits = value.replace(/\D/g, '');
            
            // Check digit count
            if (digits.length !== 12) { // +91 (2 digits) + 10 digit number
                showError('mobile', 'Mobile number should be 10 digits after +91');
            }
            
            // Limit to 10 digits after +91
            if (digits.length > 12) {
                const formattedDigits = digits.substring(digits.length - 10);
                value = '+91 ' + formattedDigits;
            }
            
            e.target.value = value;
            
            // Check if we made any changes
            if (originalValue !== value) {
                showError('mobile', 'Mobile number formatted (+91 XXXXXXXXXX)');
            }
        }
    });

    // Add education entry button
    document.getElementById('add-education').addEventListener('click', function() {
        const degree = document.getElementById('degree').value.trim();
        const university = document.getElementById('university').value.trim();
        const institute = document.getElementById('institute').value.trim();
        const year = document.getElementById('year').value.trim();
        const percentage = document.getElementById('percentage').value.trim();
        
        // Accept entries even when some fields are empty
        // At least one field should be filled
        if (degree || university || institute || year || percentage) {
            const educationEntry = {
                degree: degree || '-',
                university: university || '-',
                institute: institute || '-',
                year: year || '-',
                percentage: percentage || '-'
            };
            
            educationEntries.push(educationEntry);
            
            // Add to the visible list
            const addedEducation = document.getElementById('added-education');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = `${educationEntry.degree} from ${educationEntry.institute}, ${educationEntry.university} (${educationEntry.year}) - ${educationEntry.percentage}`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = educationEntries.indexOf(educationEntry);
                if (index > -1) {
                    educationEntries.splice(index, 1);
                }
                itemDiv.remove();
                
                // Also remove from the CV table
                document.querySelector(`.academic-table tbody tr[data-index="${index}"]`)?.remove();
                
                // Update indices of remaining rows in the table
                const tableRows = document.querySelectorAll('.academic-table tbody tr');
                tableRows.forEach((row, idx) => {
                    row.setAttribute('data-index', idx);
                });
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedEducation.appendChild(itemDiv);
            
            // Also add directly to the CV table
            const academicTableBody = document.querySelector('.academic-table tbody');
            const row = document.createElement('tr');
            row.setAttribute('data-index', educationEntries.length - 1);
            
            const degreeCell = document.createElement('td');
            degreeCell.textContent = educationEntry.degree;
            
            const universityCell = document.createElement('td');
            universityCell.textContent = educationEntry.university;
            
            const instituteCell = document.createElement('td');
            instituteCell.textContent = educationEntry.institute;
            
            const yearCell = document.createElement('td');
            yearCell.textContent = educationEntry.year;
            
            const percentageCell = document.createElement('td');
            percentageCell.textContent = educationEntry.percentage;
            
            row.appendChild(degreeCell);
            row.appendChild(universityCell);
            row.appendChild(instituteCell);
            row.appendChild(yearCell);
            row.appendChild(percentageCell);
            
            academicTableBody.appendChild(row);
            
            // Make the CV template visible if it's not already
            if (document.getElementById('cv-template').style.display === 'none' || 
                document.getElementById('cv-template').style.display === '') {
                document.getElementById('cv-template').style.display = 'block';
            }
            
            // Clear the inputs
            document.getElementById('degree').value = '';
            document.getElementById('university').value = '';
            document.getElementById('institute').value = '';
            document.getElementById('year').value = '';
            document.getElementById('percentage').value = '';
        } else {
            alert('Please fill in at least one education field');
        }
    });

    // Add achievement button
    document.getElementById('add-achievement').addEventListener('click', function() {
        const achievementInput = document.getElementById('achievement');
        const achievementText = achievementInput.value.trim();
        
        if (achievementText) {
            achievements.push(achievementText);
            
            // Add to the visible list
            const addedAchievements = document.getElementById('added-achievements');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = achievementText;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = achievements.indexOf(achievementText);
                if (index > -1) {
                    achievements.splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedAchievements.appendChild(itemDiv);
            
            // Clear the input
            achievementInput.value = '';
        }
    });

    // Add project detail button
    document.getElementById('add-project-detail').addEventListener('click', function() {
        const projectDetailInput = document.getElementById('projectDetail');
        const detailText = projectDetailInput.value.trim();
        
        if (detailText) {
            projectDetails[currentProjectId].push(detailText);
            
            // Add to the visible list
            const addedDetails = document.getElementById('added-project-details');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = detailText;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = projectDetails[currentProjectId].indexOf(detailText);
                if (index > -1) {
                    projectDetails[currentProjectId].splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedDetails.appendChild(itemDiv);
            
            // Clear the input
            projectDetailInput.value = '';
        }
    });

    // Add project button
    document.getElementById('add-project').addEventListener('click', function() {
        const projectTitleInput = document.getElementById('projectTitle');
        const projectTitle = projectTitleInput.value.trim();
        
        if (projectTitle && projectDetails[currentProjectId].length > 0) {
            // Save current project
            projects.push({
                title: projectTitle,
                details: [...projectDetails[currentProjectId]]
            });
            
            // Add to the visible list of projects
            const addedProjects = document.getElementById('added-projects');
            const projectDiv = document.createElement('div');
            projectDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = projectTitle + ` (${projectDetails[currentProjectId].length} details)`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = projects.findIndex(p => p.title === projectTitle);
                if (index > -1) {
                    projects.splice(index, 1);
                }
                projectDiv.remove();
            };
            
            projectDiv.appendChild(text);
            projectDiv.appendChild(deleteBtn);
            addedProjects.appendChild(projectDiv);
            
            // Clear the inputs and project details
            projectTitleInput.value = '';
            document.getElementById('added-project-details').innerHTML = '';
            
            // Create a new project ID and reset details
            currentProjectId = 'project_' + Date.now();
            projectDetails[currentProjectId] = [];
        } else {
            alert('Please add a project title and at least one detail');
        }
    });

    // Add core course button
    document.getElementById('add-core-course').addEventListener('click', function() {
        const coreCourseInput = document.getElementById('coreCourse');
        const courseText = coreCourseInput.value.trim();
        
        if (courseText) {
            coreCourses.push(courseText);
            
            // Add to the visible list
            const addedCourses = document.getElementById('added-core-courses');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = courseText;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = coreCourses.indexOf(courseText);
                if (index > -1) {
                    coreCourses.splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedCourses.appendChild(itemDiv);
            
            // Clear the input
            coreCourseInput.value = '';
        }
    });

    // Add breadth course button
    document.getElementById('add-breadth-course').addEventListener('click', function() {
        const breadthCourseInput = document.getElementById('breadthCourse');
        const courseText = breadthCourseInput.value.trim();
        
        if (courseText) {
            breadthCourses.push(courseText);
            
            // Add to the visible list
            const addedCourses = document.getElementById('added-breadth-courses');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = courseText;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = breadthCourses.indexOf(courseText);
                if (index > -1) {
                    breadthCourses.splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedCourses.appendChild(itemDiv);
            
            // Clear the input
            breadthCourseInput.value = '';
        }
    });

    // Add responsibility button
    document.getElementById('add-responsibility').addEventListener('click', function() {
        const titleInput = document.getElementById('responsibility-title');
        const descInput = document.getElementById('responsibility-desc');
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if (title && desc) {
            responsibilities.push({ title, desc });
            
            // Add to the visible list
            const addedResponsibilities = document.getElementById('added-responsibilities');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.innerHTML = `<strong>${title}</strong> - ${desc}`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = responsibilities.findIndex(r => r.title === title && r.desc === desc);
                if (index > -1) {
                    responsibilities.splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedResponsibilities.appendChild(itemDiv);
            
            // Clear the inputs
            titleInput.value = '';
            descInput.value = '';
        }
    });

    // Add activity button
    document.getElementById('add-activity').addEventListener('click', function() {
        const titleInput = document.getElementById('activity-title');
        const descInput = document.getElementById('activity-desc');
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if (title && desc) {
            activities.push({ title, desc });
            
            // Add to the visible list
            const addedActivities = document.getElementById('added-activities');
            const itemDiv = document.createElement('div');
            itemDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.innerHTML = `<strong>${title}</strong> - ${desc}`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                const index = activities.findIndex(a => a.title === title && a.desc === desc);
                if (index > -1) {
                    activities.splice(index, 1);
                }
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedActivities.appendChild(itemDiv);
            
            // Clear the inputs
            titleInput.value = '';
            descInput.value = '';
        }
    });

    // Handle Generate CV button click
    generateButton.addEventListener('click', function() {
        // Validate all required fields
        let hasErrors = false;
        
        // Personal Details validation
        const fullName = document.getElementById('fullName').value.trim();
        if (!fullName) {
            showError('fullName', 'Full name is required');
            hasErrors = true;
        } else if (fullName.split(' ').length < 2) {
            showError('fullName', 'Please enter both first and last name');
            hasErrors = true;
        }
        
        const email = document.getElementById('email').value.trim();
        if (!email) {
            showError('email', 'Email is required');
            hasErrors = true;
        } else if (!isValidEmail(email)) {
            showError('email', 'Please enter a valid email address');
            hasErrors = true;
        }
        
        // If there are errors, scroll to the first error and don't generate CV
        if (hasErrors) {
            const firstError = document.querySelector('.error');
            if (firstError) {
                firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }
        
        // Show the CV template
        cvTemplate.style.display = 'block';
        
        // Scroll to the CV template
        cvTemplate.scrollIntoView({ behavior: 'smooth' });

        // Set Personal Details in CV
        document.getElementById('cv-fullName').textContent = fullName;
        document.getElementById('cv-ugHty').textContent = document.getElementById('ugHty').value;
        document.getElementById('cv-institute').textContent = document.getElementById('institute').value ? 'Institute : ' + document.getElementById('institute').value : '';
        
        // Format and set DOB
        const dobValue = document.getElementById('dob').value;
        const formattedDob = dobValue ? 'D.O.B : ' + formatDate(dobValue) : '';
        document.getElementById('cv-dob').textContent = formattedDob;
        
        document.getElementById('cv-email').textContent = email ? 'Email ID : ' + email : '';
        document.getElementById('cv-enrollmentNo').textContent = document.getElementById('enrollmentNo').value ? 'Enrollment No. ' + document.getElementById('enrollmentNo').value : '';
        document.getElementById('cv-branch').textContent = document.getElementById('branch').value;
        document.getElementById('cv-gender').textContent = document.getElementById('gender').value ? 'Gender : ' + document.getElementById('gender').value : '';
        document.getElementById('cv-specialization').textContent = document.getElementById('specialization').value ? 'Specialization: ' + document.getElementById('specialization').value : '';
        document.getElementById('cv-mobile').textContent = document.getElementById('mobile').value ? 'Mobile # :' + document.getElementById('mobile').value : '';

        // Scholastic Achievements
        const achievementsList = document.getElementById('cv-achievements-list');
        achievementsList.innerHTML = '';
        
        achievements.forEach(achievement => {
            const li = document.createElement('li');
            li.textContent = achievement;
            achievementsList.appendChild(li);
        });

        // Projects
        // First display the main project
        if (projectDetails[currentProjectId].length > 0) {
            // Add current project that hasn't been saved yet
            projects.push({
                title: document.getElementById('projectTitle').value.trim() || 'Untitled Project',
                details: [...projectDetails[currentProjectId]]
            });
        }
        
        // Display the first project as main
        if (projects.length > 0) {
            document.getElementById('cv-projectTitle').textContent = projects[0].title;
            
            const projectDetailsList = document.getElementById('cv-projectDetails-list');
            projectDetailsList.innerHTML = '';
            
            projects[0].details.forEach(detail => {
                const li = document.createElement('li');
                li.textContent = detail;
                projectDetailsList.appendChild(li);
            });
            
            // Add additional projects if any
            if (projects.length > 1) {
                for (let i = 1; i < projects.length; i++) {
                    const project = projects[i];
                    
                    // Create a new project section
                    const projectSection = document.createElement('div');
                    projectSection.className = 'cv-section';
                    
                    const projectTitle = document.createElement('h3');
                    projectTitle.textContent = project.title;
                    
                    const detailsList = document.createElement('ul');
                    
                    project.details.forEach(detail => {
                        const li = document.createElement('li');
                        li.textContent = detail;
                        detailsList.appendChild(li);
                    });
                    
                    projectSection.appendChild(projectTitle);
                    projectSection.appendChild(detailsList);
                    
                    // Find the projects section and append after it
                    const projectsSection = document.querySelector('.cv-section:nth-of-type(3)');
                    projectsSection.parentNode.insertBefore(projectSection, projectsSection.nextSibling);
                }
            }
        }

        // Skills & Technologies
        document.getElementById('cv-os').textContent = document.getElementById('os').value;
        document.getElementById('cv-programmingSkills').textContent = document.getElementById('programmingSkills').value;
        document.getElementById('cv-webDesigning').textContent = document.getElementById('webDesigning').value;
        document.getElementById('cv-softwareSkills').textContent = document.getElementById('softwareSkills').value;

        // Courses Undertaken
        const coreCoursesList = document.getElementById('cv-coreCourses-list');
        coreCoursesList.innerHTML = '';
        
        coreCourses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course;
            coreCoursesList.appendChild(li);
        });
        
        const breadthCoursesList = document.getElementById('cv-breadthCourses-list');
        breadthCoursesList.innerHTML = '';
        
        breadthCourses.forEach(course => {
            const li = document.createElement('li');
            li.textContent = course;
            breadthCoursesList.appendChild(li);
        });

        // Positions of Responsibility
        const responsibilitiesList = document.getElementById('cv-responsibilities-list');
        responsibilitiesList.innerHTML = '';
        
        responsibilities.forEach(resp => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${resp.title}</strong> - ${resp.desc}`;
            responsibilitiesList.appendChild(li);
        });

        // Extracurricular Activities
        const activitiesList = document.getElementById('cv-activities-list');
        activitiesList.innerHTML = '';
        
        activities.forEach(activity => {
            const li = document.createElement('li');
            li.innerHTML = `<strong>${activity.title}</strong> - ${activity.desc}`;
            activitiesList.appendChild(li);
        });
    });

    // Handle Print CV button click
    printButton.addEventListener('click', function() {
        window.print();
    });
}); 