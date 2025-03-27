// Main JS file for CV Generator application

// Import modules
import dataStore from './datastore.js';
import { setupValidation, validateForm } from './validation.js';
import { generateCV, addEducationToTable, removeEducationFromTable } from './generator.js';
import { setupPrintButton } from './print.js';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    // Setup form field validation
    setupValidation();
    
    // Setup print button
    setupPrintButton();
    
    // Setup the Generate CV button
    setupGenerateButton();
    
    // Setup section add buttons
    setupAddButtons();
});

// Setup Generate CV button
function setupGenerateButton() {
    const generateButton = document.getElementById('generate-cv');
    if (generateButton) {
        generateButton.addEventListener('click', function() {
            // Validate form first
            if (validateForm()) {
                // Generate the CV
                generateCV();
            }
        });
    }
}

// Setup all Add buttons for form sections
function setupAddButtons() {
    // Add Education button
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
            
            // Add to data store
            const index = dataStore.addEducationEntry(educationEntry);
            
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
                // Remove from data store
                dataStore.removeEducationEntry(index);
                
                // Remove from UI
                itemDiv.remove();
                
                // Remove from CV table
                removeEducationFromTable(index);
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedEducation.appendChild(itemDiv);
            
            // Also add directly to the CV table
            addEducationToTable(educationEntry, index);
            
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

    // Add Achievement button
    document.getElementById('add-achievement').addEventListener('click', function() {
        const achievementInput = document.getElementById('achievement');
        const achievementText = achievementInput.value.trim();
        
        if (achievementText) {
            // Add to data store
            dataStore.addAchievement(achievementText);
            
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
                // Remove from data store
                dataStore.removeAchievement(achievementText);
                
                // Remove from UI
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedAchievements.appendChild(itemDiv);
            
            // Clear the input
            achievementInput.value = '';
        }
    });

    // Add Project Detail button
    document.getElementById('add-project-detail').addEventListener('click', function() {
        const projectDetailInput = document.getElementById('projectDetail');
        const detailText = projectDetailInput.value.trim();
        
        if (detailText) {
            // Add to data store
            dataStore.addProjectDetail(detailText);
            
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
                // Remove from data store
                dataStore.removeProjectDetail(detailText);
                
                // Remove from UI
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedDetails.appendChild(itemDiv);
            
            // Clear the input
            projectDetailInput.value = '';
        }
    });

    // Add Project button
    document.getElementById('add-project').addEventListener('click', function() {
        const projectTitleInput = document.getElementById('projectTitle');
        const projectTitle = projectTitleInput.value.trim();
        
        if (projectTitle && dataStore.projectDetails[dataStore.currentProjectId].length > 0) {
            // Save current project to data store
            const index = dataStore.saveProject(projectTitle);
            
            // Add to the visible list of projects
            const addedProjects = document.getElementById('added-projects');
            const projectDiv = document.createElement('div');
            projectDiv.className = 'added-item';
            
            const text = document.createElement('p');
            text.textContent = projectTitle + ` (${dataStore.projects[index].details.length} details)`;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = function() {
                // Remove from data store
                dataStore.removeProject(index);
                
                // Remove from UI
                projectDiv.remove();
            };
            
            projectDiv.appendChild(text);
            projectDiv.appendChild(deleteBtn);
            addedProjects.appendChild(projectDiv);
            
            // Clear the inputs and project details
            projectTitleInput.value = '';
            document.getElementById('added-project-details').innerHTML = '';
        } else {
            alert('Please add a project title and at least one detail');
        }
    });

    // Add Core Course button
    document.getElementById('add-core-course').addEventListener('click', function() {
        const coreCourseInput = document.getElementById('coreCourse');
        const courseText = coreCourseInput.value.trim();
        
        if (courseText) {
            // Add to data store
            dataStore.addCoreCourse(courseText);
            
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
                // Remove from data store
                dataStore.removeCoreCourse(courseText);
                
                // Remove from UI
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedCourses.appendChild(itemDiv);
            
            // Clear the input
            coreCourseInput.value = '';
        }
    });

    // Add Breadth Course button
    document.getElementById('add-breadth-course').addEventListener('click', function() {
        const breadthCourseInput = document.getElementById('breadthCourse');
        const courseText = breadthCourseInput.value.trim();
        
        if (courseText) {
            // Add to data store
            dataStore.addBreadthCourse(courseText);
            
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
                // Remove from data store
                dataStore.removeBreadthCourse(courseText);
                
                // Remove from UI
                itemDiv.remove();
            };
            
            itemDiv.appendChild(text);
            itemDiv.appendChild(deleteBtn);
            addedCourses.appendChild(itemDiv);
            
            // Clear the input
            breadthCourseInput.value = '';
        }
    });

    // Add Responsibility button
    document.getElementById('add-responsibility').addEventListener('click', function() {
        const titleInput = document.getElementById('responsibility-title');
        const descInput = document.getElementById('responsibility-desc');
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if (title && desc) {
            const responsibility = { title, desc };
            
            // Add to data store
            const index = dataStore.addResponsibility(responsibility);
            
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
                // Remove from data store
                dataStore.removeResponsibility(index);
                
                // Remove from UI
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

    // Add Activity button
    document.getElementById('add-activity').addEventListener('click', function() {
        const titleInput = document.getElementById('activity-title');
        const descInput = document.getElementById('activity-desc');
        const title = titleInput.value.trim();
        const desc = descInput.value.trim();
        
        if (title && desc) {
            const activity = { title, desc };
            
            // Add to data store
            const index = dataStore.addActivity(activity);
            
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
                // Remove from data store
                dataStore.removeActivity(index);
                
                // Remove from UI
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
} 