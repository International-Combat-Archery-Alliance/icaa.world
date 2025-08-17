function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
}

document.querySelectorAll<HTMLAnchorElement>('.sidebar-nav a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-section');
        
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionToShowId) {
            const section = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
        
        document.body.classList.remove('sidebar-open');
    });
});

// Event page navigation
document.querySelectorAll<HTMLAnchorElement>('.event-card').forEach(card => {
    card.addEventListener('click', function(e: Event) {
        if (e.target instanceof Element && !e.target.closest('.event-register-btn-top')) {
            e.preventDefault();
        
            const sectionToShowId = this.getAttribute('data-event');
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            if (sectionToShowId) {
                const section = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
        }
    });
});

// News page navigation
document.querySelectorAll<HTMLAnchorElement>('.news-updates-container a').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-news-link');
        
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionToShowId) {
            const section = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
    });
});

// Main back button functionality
document.querySelectorAll<HTMLButtonElement>('.back-btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        e.preventDefault();
        
        const sectionToShowId = this.getAttribute('data-back-to');
        
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionToShowId) {
            const section = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
    });
});


// Image Swap for Leadership Section
document.querySelectorAll<HTMLDivElement>('.board-member').forEach(member => {
    const photo = member.querySelector('.bio-photo') as HTMLImageElement;
    const headshotSrc = photo.src;
    const actionshotSrc = photo.getAttribute('data-alt-src');

    // Desktop Hover functionality
    if (window.innerWidth >= 768) {
        member.addEventListener('mouseover', () => {
            if (actionshotSrc) {
                photo.src = actionshotSrc;
            }
        });

        member.addEventListener('mouseout', () => {
            photo.src = headshotSrc;
        });
    }

    // Mobile Tap functionality
    photo.addEventListener('click', () => {
        if (window.innerWidth < 768) {
            if (photo.src.includes(headshotSrc)) {
                if (actionshotSrc) {
                    photo.src = actionshotSrc;
                }
            } else {
                photo.src = headshotSrc;
            }
        }
    });
});

// Image Rotator for Homepage
const images: string[] = [
    'images/Archery Photos/action-1.jpg',
    'images/Archery Photos/action-2.jpg',
    'images/Archery Photos/action-3.jpg',
    'images/Archery Photos/action-4.jpg'
];
let currentImageIndex: number = 0;
const rotatorImg = document.getElementById('rotator-img') as HTMLImageElement;
const prevBtn = document.getElementById('prev-btn') as HTMLButtonElement;
const nextBtn = document.getElementById('next-btn') as HTMLButtonElement;

function changeImage(direction: number): void {
    if (!rotatorImg || images.length === 0) return;
    
    rotatorImg.style.opacity = '0';
    setTimeout(() => {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        } else if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
        
        const newImageSrc = images[currentImageIndex];
        if (newImageSrc) {
            rotatorImg.src = newImageSrc;
        }
        
        rotatorImg.style.opacity = '1';
    }, 500);
}

if (prevBtn) {
    prevBtn.addEventListener('click', () => {
        changeImage(-1);
    });
}

if (nextBtn) {
    nextBtn.addEventListener('click', () => {
        changeImage(1);
    });
}

// Optional: Automatic rotation
// setInterval(() => {
//     changeImage(1);
// }, 5000); // Change image every 5 seconds

// Map Pin functionality
document.querySelectorAll<HTMLDivElement>('.map-pin').forEach(pin => {
    pin.addEventListener('click', () => {
        const targetId = pin.getAttribute('data-target');
        if (targetId) {
            const targetElement = document.getElementById(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop,
                    behavior: 'smooth'
                });
            }
        }
    });
});

// Main Alliance Registration Form Logic
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registration-form') as HTMLFormElement;
    const regTypeSelect = document.getElementById('reg-type') as HTMLSelectElement;
    const groupNameLabel = document.getElementById('group-name-label') as HTMLLabelElement;
    const groupNameInput = document.getElementById('group-name') as HTMLInputElement;
    const registrationsTableBody = document.querySelector('#registrations-table tbody') as HTMLTableSectionElement;

    // Conditional input logic
    if (regTypeSelect) {
        regTypeSelect.addEventListener('change', () => {
            if (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') {
                groupNameLabel.style.display = 'block';
                groupNameInput.style.display = 'block';
            } else {
                groupNameLabel.style.display = 'none';
                groupNameInput.style.display = 'none';
            }
        });
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();

            // Clear existing errors
            document.querySelectorAll<HTMLElement>('.registration-section .error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll<HTMLInputElement>('.registration-form input').forEach(el => el.classList.remove('error-border'));
            
            let isValid: boolean = true;
            
            const nameInput = document.getElementById('full-name') as HTMLInputElement;
            const emailInput = document.getElementById('email') as HTMLInputElement;

            if (nameInput.value.trim() === '') {
                isValid = false;
                const error = document.getElementById('name-error');
                if(error) error.style.display = 'block';
                nameInput.classList.add('error-border');
            }

            if (emailInput.value.trim() === '') {
                isValid = false;
                const error = document.getElementById('email-error');
                if(error) error.style.display = 'block';
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
                name: (form.elements.namedItem('full-name') as HTMLInputElement).value,
                email: (form.elements.namedItem('email') as HTMLInputElement).value,
                type: regTypeSelect?.options[regTypeSelect.selectedIndex]?.text || 'N/A',
                groupName: (form.elements.namedItem('group-name') as HTMLInputElement)?.value || 'N/A',
                location: (form.elements.namedItem('location') as HTMLInputElement)?.value || 'N/A',
                phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || 'N/A',
                message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || 'N/A'
            };

            let registrations: any[] = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
            registrations.push(newRegistration);
            localStorage.setItem('icaa_registrations', JSON.stringify(registrations));

            form.reset();
            regTypeSelect?.dispatchEvent(new Event('change'));
            loadRegistrations();
            
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const tableSection = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }

    function loadRegistrations(): void {
        if (registrationsTableBody) {
            registrationsTableBody.innerHTML = '';
            const registrations: any[] = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
    
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
    }

    loadRegistrations();

    const registrationsLink = document.querySelector<HTMLAnchorElement>('.registrations-link a');
    if (registrationsLink) {
        registrationsLink.addEventListener('click', (e: Event) => {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const tableSection = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }
});

// Contact Form Submission Confirmation
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form') as HTMLFormElement;
    const contactSection = document.getElementById('contact') as HTMLElement;
    
    if (contactForm && contactSection) {
        const confirmationMessage = document.createElement('div');
        confirmationMessage.className = 'confirmation-message';
        confirmationMessage.style.display = 'none';
        confirmationMessage.innerHTML = `
            <h3>Thank you for your message!</h3>
            <p>We will get back to you soon.</p>
            <button class="confirm-btn">Acknowledge</button>
        `;
        contactSection.appendChild(confirmationMessage);
        
        contactForm.addEventListener('submit', (e: Event) => {
            e.preventDefault();
            
            const nameInput = contactForm.querySelector('input[name="name"]') as HTMLInputElement;
            const emailInput = contactForm.querySelector('input[name="email"]') as HTMLInputElement;
            const messageTextarea = contactForm.querySelector('textarea[name="message"]') as HTMLTextAreaElement;

            const name = nameInput.value.trim();
            const email = emailInput.value.trim();
            const message = messageTextarea.value.trim();

            if (name && email && message) {
                setTimeout(() => {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    confirmationMessage.style.display = 'block';
                }, 500);
            } else {
                alert('Please fill in all fields.');
            }
        });

        const confirmBtn = document.querySelector<HTMLButtonElement>('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                confirmationMessage.style.display = 'none';
                contactForm.style.display = 'block';
                document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                const heroSection = document.getElementById('hero-section');
                if (heroSection) {
                    heroSection.classList.add('active');
                }
            });
        }
    }

    const ctaButton = document.querySelector<HTMLAnchorElement>('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const registrationSection = document.getElementById('registration-section');
            if (registrationSection) {
                registrationSection.classList.add('active');
            }
        });
    }
});

// Event Registration Page Logic
document.addEventListener('DOMContentLoaded', () => {
    const eventRegistrationForm = document.getElementById('event-registration-form') as HTMLFormElement;
    const registrationTypeSelect = document.getElementById('registration-type') as HTMLSelectElement;
    const teamFields = document.getElementById('team-fields') as HTMLElement;
    const freeAgentFields = document.getElementById('free-agent-fields') as HTMLElement;
    const rosterFields = document.getElementById('roster-fields') as HTMLElement;

    function generateRosterFields(): void {
        if (rosterFields) {
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
    }
    generateRosterFields();

    // Show/hide fields based on registration type
    if (registrationTypeSelect) {
        registrationTypeSelect.addEventListener('change', () => {
            if (teamFields) teamFields.style.display = 'none';
            if (freeAgentFields) freeAgentFields.style.display = 'none';

            if (registrationTypeSelect.value === 'team') {
                if (teamFields) teamFields.style.display = 'flex';
            } else if (registrationTypeSelect.value === 'free-agent') {
                if (freeAgentFields) freeAgentFields.style.display = 'flex';
            }
        });
        registrationTypeSelect.dispatchEvent(new Event('change'));
    }

    // Event Registration Buttons
    document.querySelectorAll<HTMLAnchorElement>('.event-register-btn-top').forEach(button => {
        button.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const eventRegistration = document.getElementById('event-registration');
            if (eventRegistration) {
                eventRegistration.classList.add('active');
            }
        });
    });

    eventRegistrationForm?.addEventListener('submit', (e: Event) => {
        e.preventDefault();

        document.querySelectorAll<HTMLElement>('.event-registration-form .error-message').forEach(el => el.style.display = 'none');
        document.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('.event-registration-form input, .event-registration-form select, .event-registration-form textarea').forEach(el => el.classList.remove('error-border'));
        
        let isValid: boolean = true;
        
        const eventSelect = document.getElementById('event-select') as HTMLSelectElement;
        const regTypeSelect = document.getElementById('registration-type') as HTMLSelectElement;

        if (eventSelect.value === '') {
            isValid = false;
            eventSelect.classList.add('error-border');
        }

        if (regTypeSelect.value === '') {
            isValid = false;
            regTypeSelect.classList.add('error-border');
        }
        
        if (regTypeSelect.value === 'team') {
            const teamNameInput = document.getElementById('team-name') as HTMLInputElement;
            const teamCityInput = document.getElementById('team-city') as HTMLInputElement;

            if (teamNameInput.value.trim() === '') {
                isValid = false;
                teamNameInput.classList.add('error-border');
                const errorSpan = teamNameInput.nextElementSibling as HTMLElement;
                if(errorSpan) errorSpan.style.display = 'block';
            }
            if (teamCityInput.value.trim() === '') {
                isValid = false;
                teamCityInput.classList.add('error-border');
                const errorSpan = teamCityInput.nextElementSibling as HTMLElement;
                if(errorSpan) errorSpan.style.display = 'block';
            }
            
            for (let i = 0; i < 6; i++) {
                const input = document.getElementById(`player-name-${i}`) as HTMLInputElement;
                if (input && input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error-border');
                    const errorSpan = input.nextElementSibling as HTMLElement;
                    if(errorSpan) errorSpan.style.display = 'block';
                }
            }
        }
        
        if (regTypeSelect.value === 'free-agent') {
            const freeAgentNameInput = document.getElementById('free-agent-name') as HTMLInputElement;
            const freeAgentCityInput = document.getElementById('free-agent-city') as HTMLInputElement;
            const freeAgentExperienceTextarea = document.getElementById('free-agent-experience') as HTMLTextAreaElement;

            if (freeAgentNameInput.value.trim() === '') {
                isValid = false;
                freeAgentNameInput.classList.add('error-border');
                const errorSpan = freeAgentNameInput.nextElementSibling as HTMLElement;
                if(errorSpan) errorSpan.style.display = 'block';
            }
            if (freeAgentCityInput.value.trim() === '') {
                isValid = false;
                freeAgentCityInput.classList.add('error-border');
                const errorSpan = freeAgentCityInput.nextElementSibling as HTMLElement;
                if(errorSpan) errorSpan.style.display = 'block';
            }
            if (freeAgentExperienceTextarea.value.trim() === '') {
                isValid = false;
                freeAgentExperienceTextarea.classList.add('error-border');
                const errorSpan = freeAgentExperienceTextarea.nextElementSibling as HTMLElement;
                if(errorSpan) errorSpan.style.display = 'block';
            }
        }
        
        if (!isValid) {
            return;
        }

        alert('Event registration submitted successfully!');
    });
});

// 'Official Rules' button on 'About the Sport' page logic
const rulesBtn = document.querySelector<HTMLAnchorElement>('.rules-btn');
if (rulesBtn) {
    rulesBtn.addEventListener('click', function(e: Event): void {
        e.preventDefault();
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const rulesSection = document.getElementById('official-rules');
        if (rulesSection) {
            rulesSection.classList.add('active');
        }
    });
}

// Other event page navigation
document.querySelectorAll<HTMLAnchorElement>('.event-card').forEach(card => {
    card.addEventListener('click', function(e: Event): void {
        e.preventDefault();
    
        const sectionToShowId = this.getAttribute('data-event');
        
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionToShowId) {
            const section = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
    });
});