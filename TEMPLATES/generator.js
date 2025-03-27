// CV Generator functionality

import dataStore from './datastore.js';
import { formatDate } from './validation.js';

// Generate the CV using data from the data store
function generateCV() {
    const cvTemplate = document.getElementById('cv-template');
    
    // Show the CV template
    cvTemplate.style.display = 'block';
    
    // Scroll to the CV template
    cvTemplate.scrollIntoView({ behavior: 'smooth' });

    // Set Personal Details in CV
    const fullName = document.getElementById('fullName').value;
    const ugHty = document.getElementById('ugHty').value;
    const institute = document.getElementById('institute').value;
    const dobValue = document.getElementById('dob').value;
    const email = document.getElementById('email').value;
    const enrollmentNo = document.getElementById('enrollmentNo').value;
    const branch = document.getElementById('branch').value;
    const gender = document.getElementById('gender').value;
    const specialization = document.getElementById('specialization').value;
    const mobile = document.getElementById('mobile').value;
    
    document.getElementById('cv-fullName').textContent = fullName;
    document.getElementById('cv-ugHty').textContent = ugHty;
    document.getElementById('cv-institute').textContent = institute ? 'Institute : ' + institute : '';
    
    // Format and set DOB
    const formattedDob = dobValue ? 'D.O.B : ' + formatDate(dobValue) : '';
    document.getElementById('cv-dob').textContent = formattedDob;
    
    document.getElementById('cv-email').textContent = email ? 'Email ID : ' + email : '';
    document.getElementById('cv-enrollmentNo').textContent = enrollmentNo ? 'Enrollment No. ' + enrollmentNo : '';
    document.getElementById('cv-branch').textContent = branch;
    document.getElementById('cv-gender').textContent = gender ? 'Gender : ' + gender : '';
    document.getElementById('cv-specialization').textContent = specialization ? 'Specialization: ' + specialization : '';
    document.getElementById('cv-mobile').textContent = mobile ? 'Mobile # :' + mobile : '';

    // NOTE: Academic details table is already populated as entries are added
    // No need to repopulate here

    // Generate Achievements section
    generateAchievements();
    
    // Generate Projects section
    generateProjects();
    
    // Generate Skills section
    generateSkills();
    
    // Generate Courses section
    generateCourses();
    
    // Generate Responsibilities section
    generateResponsibilities();
    
    // Generate Activities section
    generateActivities();
}

// Generate Achievements section
function generateAchievements() {
    const achievementsList = document.getElementById('cv-achievements-list');
    achievementsList.innerHTML = '';
    
    dataStore.achievements.forEach(achievement => {
        const li = document.createElement('li');
        li.textContent = achievement;
        achievementsList.appendChild(li);
    });
}

// Generate Projects section
function generateProjects() {
    // First check if we have an unsaved project in the current project ID
    if (dataStore.projectDetails[dataStore.currentProjectId].length > 0) {
        // Add current project that hasn't been saved yet
        dataStore.saveProject(document.getElementById('projectTitle').value.trim() || 'Untitled Project');
    }
    
    // Display projects
    if (dataStore.projects.length > 0) {
        // Display the first project as main
        document.getElementById('cv-projectTitle').textContent = dataStore.projects[0].title;
        
        const projectDetailsList = document.getElementById('cv-projectDetails-list');
        projectDetailsList.innerHTML = '';
        
        dataStore.projects[0].details.forEach(detail => {
            const li = document.createElement('li');
            li.textContent = detail;
            projectDetailsList.appendChild(li);
        });
        
        // Add additional projects if any
        if (dataStore.projects.length > 1) {
            // Remove any existing additional project sections
            const existingAdditionalProjects = document.querySelectorAll('.additional-project');
            existingAdditionalProjects.forEach(section => section.remove());
            
            // Add each additional project
            for (let i = 1; i < dataStore.projects.length; i++) {
                const project = dataStore.projects[i];
                
                // Create a new project section
                const projectSection = document.createElement('div');
                projectSection.className = 'cv-section additional-project';
                
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
}

// Generate Skills section
function generateSkills() {
    const os = document.getElementById('os').value;
    const programmingSkills = document.getElementById('programmingSkills').value;
    const webDesigning = document.getElementById('webDesigning').value;
    const softwareSkills = document.getElementById('softwareSkills').value;
    
    document.getElementById('cv-os').textContent = os;
    document.getElementById('cv-programmingSkills').textContent = programmingSkills;
    document.getElementById('cv-webDesigning').textContent = webDesigning;
    document.getElementById('cv-softwareSkills').textContent = softwareSkills;
}

// Generate Courses section
function generateCourses() {
    const coreCoursesList = document.getElementById('cv-coreCourses-list');
    coreCoursesList.innerHTML = '';
    
    dataStore.coreCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course;
        coreCoursesList.appendChild(li);
    });
    
    const breadthCoursesList = document.getElementById('cv-breadthCourses-list');
    breadthCoursesList.innerHTML = '';
    
    dataStore.breadthCourses.forEach(course => {
        const li = document.createElement('li');
        li.textContent = course;
        breadthCoursesList.appendChild(li);
    });
}

// Generate Responsibilities section
function generateResponsibilities() {
    const responsibilitiesList = document.getElementById('cv-responsibilities-list');
    responsibilitiesList.innerHTML = '';
    
    dataStore.responsibilities.forEach(resp => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${resp.title}</strong> - ${resp.desc}`;
        responsibilitiesList.appendChild(li);
    });
}

// Generate Activities section
function generateActivities() {
    const activitiesList = document.getElementById('cv-activities-list');
    activitiesList.innerHTML = '';
    
    dataStore.activities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${activity.title}</strong> - ${activity.desc}`;
        activitiesList.appendChild(li);
    });
}

// Function to add education entry directly to the CV table
function addEducationToTable(entry, index) {
    const academicTableBody = document.querySelector('.academic-table tbody');
    const row = document.createElement('tr');
    row.setAttribute('data-index', index);
    
    const degreeCell = document.createElement('td');
    degreeCell.textContent = entry.degree;
    
    const universityCell = document.createElement('td');
    universityCell.textContent = entry.university;
    
    const instituteCell = document.createElement('td');
    instituteCell.textContent = entry.institute;
    
    const yearCell = document.createElement('td');
    yearCell.textContent = entry.year;
    
    const percentageCell = document.createElement('td');
    percentageCell.textContent = entry.percentage;
    
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
}

// Remove education entry from the table
function removeEducationFromTable(index) {
    document.querySelector(`.academic-table tbody tr[data-index="${index}"]`)?.remove();
    
    // Update indices of remaining rows in the table
    const tableRows = document.querySelectorAll('.academic-table tbody tr');
    tableRows.forEach((row, idx) => {
        row.setAttribute('data-index', idx);
    });
}

export { generateCV, addEducationToTable, removeEducationFromTable }; 