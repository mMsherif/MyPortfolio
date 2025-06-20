document.addEventListener('DOMContentLoaded', function() {
    // Check if mobile device
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    // Prevent horizontal scrolling only on mobile
    if (isMobile) {
        document.body.style.overflowX = 'hidden';
        document.body.style.width = '100%';
        document.body.style.position = 'relative';
        
        // Additional prevention for touch events
        document.addEventListener('touchmove', function(e) {
            if (e.touches.length === 1) {
                const x = e.touches[0].pageX;
                const y = e.touches[0].pageY;
                const element = document.elementFromPoint(x, y);
                
                // Check if we should allow horizontal scrolling for specific elements
                const allowHorizontalScroll = element && 
                    (element.classList.contains('allow-horizontal-scroll') || 
                    element.tagName === 'INPUT' || 
                    element.tagName === 'TEXTAREA' ||
                    element.tagName === 'SELECT');
                
                if (!allowHorizontalScroll) {
                    e.preventDefault();
                }
            }
        }, { passive: false });
    }
    
    // Add scroll event to navbar
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Initialize smooth scroll for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const navbarHeight = document.querySelector('.navbar').offsetHeight;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navbarHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }
        });
    });

    // Initialize scroll animations
    initScrollAnimations();
    
    // Load projects dynamically
    fetchProjects();
    
    // Add hover effect to contact items
    setupContactItems();
    
    // Add click handlers for project cards
    setupProjectCards();
});

function initScrollAnimations() {
    const animateOnScroll = () => {
        const elements = document.querySelectorAll('[data-aos]');
        const windowHeight = window.innerHeight;
        
        elements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementPosition < windowHeight - elementVisible) {
                element.classList.add('aos-animate');
            } else {
                element.classList.remove('aos-animate');
            }
        });
    };
    
    window.addEventListener('load', animateOnScroll);
    window.addEventListener('scroll', animateOnScroll);
}

function fetchProjects() {
    // Try to fetch from JSON file first
    fetch('projects.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(projects => {
            displayProjects(projects);
        })
        .catch(error => {
            console.error('Error loading projects:', error);
            // Fallback to hardcoded projects
            const fallbackProjects = [
                {
                    "title": "Logistics Delivery Database and Website",
                    "description": "Developed a full-stack system for logistics management with efficient data handling and APIs for real-time updates.",
                    "image": "logistics.jpg",
                    "githubUrl": "https://github.com/moSherifZC/logistics-system",
                    "technologies": ["C#", ".NET", "SQL", "JavaScript"],
                    "date": "Feb 2024 - May 2024"
                },
                {
                    "title": "Bricks Break Game Development",
                    "description": "Built a desktop game in C++ focusing on OOP principles and user interaction.",
                    "image": "bricks-game.jpg",
                    "githubUrl": "https://github.com/moSherifZC/bricks-break-game",
                    "technologies": ["C++", "OOP", "Game Development"],
                    "date": "Oct 2023 - Jan 2024"
                }
            ];
            displayProjects(fallbackProjects);
        });
}

function displayProjects(projects) {
    const projectsContainer = document.getElementById('projects-container');
    
    projects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'col-md-6';
        projectCard.setAttribute('data-aos', index % 2 === 0 ? 'fade-right' : 'fade-left');
        projectCard.setAttribute('data-aos-delay', (index % 2) * 100);
        
        projectCard.innerHTML = `
            <div class="card project-card h-100">
                <img src="projects/${project.image}" class="card-img-top" alt="${project.title}">
                <div class="card-body">
                    <h5 class="card-title">${project.title}</h5>
                    <p class="card-text">${project.description}</p>
                    <div class="d-flex justify-content-between align-items-center">
                        <div class="btn-group">
                            <a href="${project.githubUrl}" target="_blank" class="btn btn-sm btn-primary view-code-btn">
                                <i class="fab fa-github"></i> View Code
                            </a>
                        </div>
                        <small class="text-muted">${project.technologies.join(', ')}</small>
                    </div>
                </div>
                <div class="card-footer">
                    <small class="text-muted">${project.date}</small>
                </div>
            </div>
        `;
        projectsContainer.appendChild(projectCard);
    });
}

function setupProjectCards() {
    document.addEventListener('click', function(e) {
        if (e.target.closest('.view-code-btn')) {
            e.preventDefault();
            const btn = e.target.closest('.view-code-btn');
            window.open(btn.href, '_blank');
        }
    });
}

function setupContactItems() {
    document.querySelectorAll('.contact-item').forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(5px)';
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1.2)';
            icon.style.color = 'var(--accent-color)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
            const icon = this.querySelector('i');
            icon.style.transform = 'scale(1)';
            icon.style.color = 'var(--primary-color)';
        });
    });
}

function copyToClipboard(text, type) {
    navigator.clipboard.writeText(text).then(function() {
        showCopyNotification(`${type} copied to clipboard!`);
    }, function(err) {
        console.error('Could not copy text: ', err);
    });
}

function showCopyNotification(message) {
    const notification = document.getElementById('copyNotification');
    const textElement = notification.querySelector('.notification-text');
    textElement.textContent = message;
    
    notification.style.display = 'flex';
    notification.classList.add('animate__fadeInUp');
    
    setTimeout(() => {
        notification.classList.remove('animate__fadeInUp');
        notification.classList.add('animate__fadeOutDown');
        
        setTimeout(() => {
            notification.style.display = 'none';
            notification.classList.remove('animate__fadeOutDown');
        }, 500);
    }, 2000);
}