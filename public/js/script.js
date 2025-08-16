function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

document.querySelectorAll('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-section');
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionToShowId).classList.add('active');
        
        document.body.classList.remove('sidebar-open');
    });
});

// Event page navigation
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', function(e) {
        // Only trigger if not clicking the register button
        if (!e.target.closest('.event-register-btn')) {
            e.preventDefault();
        
            const sectionToShowId = this.getAttribute('data-event');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            document.getElementById(sectionToShowId).classList.add('active');
        }
    });
});

// News page navigation
document.querySelectorAll('.news-updates-container a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-news-link');
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionToShowId).classList.add('active');
    });
});

// Main back button functionality
document.querySelectorAll('.back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-back-to');
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionToShowId).classList.add('active');
    });
});


// Image Swap for Leadership Section
document.querySelectorAll('.board-member').forEach(member => {
    const photo = member.querySelector('.bio-photo');
    const headshotSrc = photo.src;
    const actionshotSrc = photo.getAttribute('data-alt-src');

    // Desktop Hover functionality
    if (window.innerWidth >= 768) {
        member.addEventListener('mouseover', () => {
            photo.src = actionshotSrc;
        });

        member.addEventListener('mouseout', () => {
            photo.src = headshotSrc;
        });
    }

    // Mobile Tap functionality
    photo.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            if (photo.src.includes(headshotSrc)) {
                photo.src = actionshotSrc;
            } else {
                photo.src = headshotSrc;
            }
        }
    });
});

// Image Rotator for Homepage
const images = [
    'images/Archery Photos/action-1.jpg',
    'images/Archery Photos/action-2.jpg',
    'images/Archery Photos/action-3.jpg',
    'images/Archery Photos/action-4.jpg'
];
let currentImageIndex = 0;
const rotatorImg = document.getElementById('rotator-img');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

function changeImage(direction) {
    rotatorImg.style.opacity = 0; // Start fade out
    setTimeout(() => {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        } else if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
        rotatorImg.src = images[currentImageIndex];
        rotatorImg.style.opacity = 1; // Fade in new image
    }, 500); // Match this with your CSS transition duration
}

prevBtn.addEventListener('click', () => {
    changeImage(-1);
});

nextBtn.addEventListener('click', () => {
    changeImage(1);
});

// Optional: Automatic rotation
// setInterval(() => {
//     changeImage(1);
// }, 5000); // Change image every 5 seconds

// Map Pin functionality
document.querySelectorAll('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
        const targetId = pin.getAttribute('data-target');
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
            // Smoothly scroll to the community card
            window.scrollTo({
                top: targetElement.offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Main Alliance Registration Form Logic
document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('registration-form');
    const regTypeSelect = document.getElementById('reg-type');
    const groupNameLabel = document.getElementById('group-name-label');
    const groupNameInput = document.getElementById('group-name');
    const registrationsTableBody = document.querySelector('#registrations-table tbody');

    // Conditional input logic
    regTypeSelect.addEventListener('change', () => {
        if (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') {
            groupNameLabel.style.display = 'block';
            groupNameInput.style.display = 'block';
        } else {
            groupNameLabel.style.display = 'none';
            groupNameInput.style.display = 'none';
        }
    });

    // Handle form submission
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Clear existing errors
        document.querySelectorAll('.registration-section .error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.registration-form input').forEach(el => el.classList.remove('error-border'));
        
        let isValid = true;
        
        // Basic validation
        const nameInput = document.getElementById('full-name');
        const emailInput = document.getElementById('email');

        if (nameInput.value.trim() === '') {
            isValid = false;
            document.getElementById('name-error').style.display = 'block';
            nameInput.classList.add('error-border');
        }

        if (emailInput.value.trim() === '') {
            isValid = false;
            document.getElementById('email-error').style.display = 'block';
            emailInput.classList.add('error-border');
        }

        const groupNameError = document.getElementById('group-name-error');
        if (groupNameLabel.style.display === 'block' && groupNameInput.value.trim() === '') {
            isValid = false;
            if(groupNameError) groupNameError.style.display = 'block';
            groupNameInput.classList.add('error-border');
        }
        
        if (!isValid) {
            return;
        }

        const newRegistration = {
            name: form.elements['full-name'].value,
            email: form.elements['email'].value,
            type: regTypeSelect.options[regTypeSelect.selectedIndex].text,
            groupName: form.elements['group-name'].value || 'N/A',
            location: form.elements['location'].value || 'N/A',
            phone: form.elements['phone'].value || 'N/A',
            message: form.elements['message'].value || 'N/A'
        };

        let registrations = JSON.parse(localStorage.getItem('icaa_registrations')) || [];
        registrations.push(newRegistration);
        localStorage.setItem('icaa_registrations', JSON.stringify(registrations));

        form.reset();
        loadRegistrations();
        
        // Navigate to the registrations table after submission
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('registrations-table-section').classList.add('active');
    });

    // Function to load registrations from local storage and populate the table
    function loadRegistrations() {
        registrationsTableBody.innerHTML = '';
        const registrations = JSON.parse(localStorage.getItem('icaa_registrations')) || [];

        registrations.forEach(reg => {
            const row = registrationsTableBody.insertRow();
            row.innerHTML = `
                <td>${reg.name}</td>
                <td>${reg.email}</td>
                <td>${reg.type}</td>
                <td>${reg.groupName}</td>
                <td>${reg.location}</td>
                <td>${reg.phone}</td>
                <td>${reg.message}</td>
            `;
        });
    }

    // Load registrations when the page loads
    loadRegistrations();

    // Link "View Registrations" button to the table
    document.querySelector('.registrations-link a').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('registrations-table-section').classList.add('active');
    });
});

// Contact Form Submission Confirmation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('.contact-form');
    const contactSection = document.getElementById('contact');

    // Create the confirmation message div
    const confirmationMessage = document.createElement('div');
    confirmationMessage.className = 'confirmation-message';
    confirmationMessage.style.display = 'none'; // Initially hidden
    confirmationMessage.innerHTML = `
        <h3>Thank you for your message!</h3>
        <p>We will get back to you soon.</p>
        <button class="confirm-btn">Acknowledge</button>
    `;
    contactSection.appendChild(confirmationMessage);
    
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Check if all fields are filled
        const name = contactForm.querySelector('input[name="name"]').value.trim();
        const email = contactForm.querySelector('input[name="email"]').value.trim();
        const message = contactForm.querySelector('textarea[name="message"]').value.trim();

        if (name && email && message) {
            // Simulate form submission
            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'none';
                confirmationMessage.style.display = 'block';
            }, 500); // Wait for a moment before showing confirmation
        } else {
            // Optional: add a more visible error message if needed
            alert('Please fill in all fields.');
        }
    });

    document.querySelector('.confirm-btn').addEventListener('click', () => {
        confirmationMessage.style.display = 'none';
        contactForm.style.display = 'block';
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('hero-section').classList.add('active');
    });

    // CTA button logic
    document.querySelector('.cta-button').addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        document.getElementById('registration-section').classList.add('active');
    });
});

// Event Registration Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const eventRegistrationForm = document.getElementById('event-registration-form');
    const registrationTypeSelect = document.getElementById('registration-type');
    const teamFields = document.getElementById('team-fields');
    const freeAgentFields = document.getElementById('free-agent-fields');
    const rosterFields = document.getElementById('roster-fields');

    function generateRosterFields() {
        rosterFields.innerHTML = '';
        for (let i = 0; i < 8; i++) {
            rosterFields.innerHTML += `
                <div class="roster-player">
                    <label for="player-name-${i}">Player ${i+1}</label>
                    <input type="text" id="player-name-${i}" name="player_name_${i}">
                    <span class="error-message">This field is required</span>
                </div>
            `;
        }
    }
    generateRosterFields();

    // Show/hide fields based on registration type
    registrationTypeSelect.addEventListener('change', () => {
        teamFields.style.display = 'none';
        freeAgentFields.style.display = 'none';

        if (registrationTypeSelect.value === 'team') {
            teamFields.style.display = 'block';
        } else if (registrationTypeSelect.value === 'free-agent') {
            freeAgentFields.style.display = 'block';
        }
    });

    // Event Registration Buttons
    document.querySelectorAll('.event-register-btn-top').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById('event-registration').classList.add('active');
        });
    });

    // Handle form submission
    eventRegistrationForm.addEventListener('submit', (e) => {
        e.preventDefault();

        document.querySelectorAll('.event-registration-form .error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll('.event-registration-form input, .event-registration-form select, .event-registration-form textarea').forEach(el => el.classList.remove('error-border'));
        
        let isValid = true;
        
        const eventSelect = document.getElementById('event-select');
        const regTypeSelect = document.getElementById('registration-type');

        if (eventSelect.value === '') {
            isValid = false;
            eventSelect.classList.add('error-border');
        }

        if (regTypeSelect.value === '') {
            isValid = false;
            regTypeSelect.classList.add('error-border');
        }
        
        if (regTypeSelect.value === 'team') {
            const teamNameInput = document.getElementById('team-name');
            const teamCityInput = document.getElementById('team-city');

            if (teamNameInput.value.trim() === '') {
                isValid = false;
                teamNameInput.classList.add('error-border');
                teamNameInput.nextElementSibling.style.display = 'block';
            }
            if (teamCityInput.value.trim() === '') {
                isValid = false;
                teamCityInput.classList.add('error-border');
                teamCityInput.nextElementSibling.style.display = 'block';
            }
            
            // Validate that at least the first 6 roster players are filled out
            for (let i = 0; i < 6; i++) {
                const input = document.getElementById(`player-name-${i}`);
                if (input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error-border');
                    input.nextElementSibling.style.display = 'block';
                }
            }
        }
        
        if (regTypeSelect.value === 'free-agent') {
            const freeAgentNameInput = document.getElementById('free-agent-name');
            const freeAgentCityInput = document.getElementById('free-agent-city');
            const freeAgentExperienceTextarea = document.getElementById('free-agent-experience');

            if (freeAgentNameInput.value.trim() === '') {
                isValid = false;
                freeAgentNameInput.classList.add('error-border');
                freeAgentNameInput.nextElementSibling.style.display = 'block';
            }
            if (freeAgentCityInput.value.trim() === '') {
                isValid = false;
                freeAgentCityInput.classList.add('error-border');
                freeAgentCityInput.nextElementSibling.style.display = 'block';
            }
            if (freeAgentExperienceTextarea.value.trim() === '') {
                isValid = false;
                freeAgentExperienceTextarea.classList.add('error-border');
                freeAgentExperienceTextarea.nextElementSibling.style.display = 'block';
            }
        }
        
        if (!isValid) {
            return;
        }

        alert('Event registration submitted successfully!');
    });
});

// 'Official Rules' button on 'About the Sport' page logic
document.querySelector('.rules-btn').addEventListener('click', function(e) {
    e.preventDefault();
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.getElementById('official-rules').classList.add('active');
});

// Other event page navigation
document.querySelectorAll('.event-card').forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
    
        const sectionToShowId = this.getAttribute('data-event');
        
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        document.getElementById(sectionToShowId).classList.add('active');
    });
});