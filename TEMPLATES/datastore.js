// Data Storage for CV Generator

// Store for all CV data
const dataStore = {
    // Arrays to store different sections
    educationEntries: [],
    achievements: [],
    projectDetails: {},
    projects: [],
    coreCourses: [],
    breadthCourses: [],
    responsibilities: [],
    activities: [],
    currentProjectId: 'main',
    
    // Initialize data store
    init() {
        this.projectDetails[this.currentProjectId] = [];
        return this;
    },
    
    // Education entries methods
    addEducationEntry(entry) {
        this.educationEntries.push(entry);
        return this.educationEntries.length - 1; // Return index
    },
    
    removeEducationEntry(index) {
        if (index > -1 && index < this.educationEntries.length) {
            this.educationEntries.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Achievement methods
    addAchievement(achievement) {
        this.achievements.push(achievement);
        return this.achievements.length - 1;
    },
    
    removeAchievement(achievement) {
        const index = this.achievements.indexOf(achievement);
        if (index > -1) {
            this.achievements.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Project methods
    addProjectDetail(detail) {
        this.projectDetails[this.currentProjectId].push(detail);
        return this.projectDetails[this.currentProjectId].length - 1;
    },
    
    removeProjectDetail(detail) {
        const index = this.projectDetails[this.currentProjectId].indexOf(detail);
        if (index > -1) {
            this.projectDetails[this.currentProjectId].splice(index, 1);
            return true;
        }
        return false;
    },
    
    saveProject(title) {
        if (this.projectDetails[this.currentProjectId].length > 0) {
            const project = {
                title: title || 'Untitled Project',
                details: [...this.projectDetails[this.currentProjectId]]
            };
            this.projects.push(project);
            
            // Create a new project ID and reset details
            this.currentProjectId = 'project_' + Date.now();
            this.projectDetails[this.currentProjectId] = [];
            
            return this.projects.length - 1;
        }
        return -1;
    },
    
    removeProject(index) {
        if (index > -1 && index < this.projects.length) {
            this.projects.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Course methods
    addCoreCourse(course) {
        this.coreCourses.push(course);
        return this.coreCourses.length - 1;
    },
    
    removeCoreCourse(course) {
        const index = this.coreCourses.indexOf(course);
        if (index > -1) {
            this.coreCourses.splice(index, 1);
            return true;
        }
        return false;
    },
    
    addBreadthCourse(course) {
        this.breadthCourses.push(course);
        return this.breadthCourses.length - 1;
    },
    
    removeBreadthCourse(course) {
        const index = this.breadthCourses.indexOf(course);
        if (index > -1) {
            this.breadthCourses.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Responsibility methods
    addResponsibility(responsibility) {
        this.responsibilities.push(responsibility);
        return this.responsibilities.length - 1;
    },
    
    removeResponsibility(index) {
        if (index > -1 && index < this.responsibilities.length) {
            this.responsibilities.splice(index, 1);
            return true;
        }
        return false;
    },
    
    // Activity methods
    addActivity(activity) {
        this.activities.push(activity);
        return this.activities.length - 1;
    },
    
    removeActivity(index) {
        if (index > -1 && index < this.activities.length) {
            this.activities.splice(index, 1);
            return true;
        }
        return false;
    }
};

// Initialize the data store
export default dataStore.init(); 