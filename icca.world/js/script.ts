import * as L from 'leaflet';

document.addEventListener('DOMContentLoaded', () => {
    function toggleSidebar(): void {
        document.body.classList.toggle('sidebar-open');
    }

    document.querySelectorAll<HTMLAnchorElement>('.sidebar-nav a').forEach(link => {
        link.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            
            const sectionToShowId: string | null = this.getAttribute('data-section');
            
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            if (sectionToShowId) {
                const section: HTMLElement | null = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
            
            document.body.classList.remove('sidebar-open');
        });
    });

    // Event page navigation
    document.querySelectorAll<HTMLAnchorElement>('.event-card').forEach(card => {
        card.addEventListener('click', function(e: Event): void {
            const targetElement = e.target as Element;
            // Only trigger if not clicking the register button
            if (targetElement instanceof Element && !targetElement.closest('.event-register-btn')) {
                e.preventDefault();
            
                const sectionToShowId: string | null = this.getAttribute('data-event');
                
                document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                
                if (sectionToShowId) {
                    const section: HTMLElement | null = document.getElementById(sectionToShowId);
                    if (section) {
                        section.classList.add('active');
                    }
                }
            }
        });
    });

    // News page navigation
    document.querySelectorAll<HTMLAnchorElement>('.news-updates-container a').forEach(link => {
        link.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            
            const sectionToShowId: string | null = this.getAttribute('data-news-link');
            
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            if (sectionToShowId) {
                const section: HTMLElement | null = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
        });
    });

    // Main back button functionality
    document.querySelectorAll<HTMLButtonElement>('.back-btn').forEach(btn => {
        btn.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            
            const sectionToShowId: string | null = btn.getAttribute('data-back-to');
            
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            
            if (sectionToShowId) {
                const section: HTMLElement | null = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
        });
    });


    // Image Swap for Leadership Section
    document.querySelectorAll<HTMLDivElement>('.board-member').forEach(member => {
        const photo: HTMLImageElement | null = member.querySelector<HTMLImageElement>('.bio-photo');
        if (!photo) return;
        const headshotSrc: string = photo.src;
        const actionshotSrc: string | null = photo.getAttribute('data-alt-src');

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
    const rotatorImg: HTMLImageElement | null = document.getElementById('rotator-img') as HTMLImageElement;
    const prevBtn: HTMLButtonElement | null = document.getElementById('prev-btn') as HTMLButtonElement;
    const nextBtn: HTMLButtonElement | null = document.getElementById('next-btn') as HTMLButtonElement;

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
            
            const newImageSrc: string | undefined = images[currentImageIndex];
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

    // Map Pin functionality (now interactive with Leaflet)
    const mapDiv: HTMLElement | null = document.getElementById('interactive-map');
    if (mapDiv) {
        const map = L.map('interactive-map').setView([43.6532, -79.3832], 4);
        
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map);

        const communities = [
            { name: "Archery Games Boston", lat: 42.385, lng: -71.018, content: "<p>Chelsea, MA</p>" },
            { name: "Archery Games Ottawa", lat: 45.421, lng: -75.698, content: "<p>Ottawa, ON</p>" },
            { name: "Archery Games Denver", lat: 39.805, lng: -105.087, content: "<p>Arvada, CO</p>" },
            { name: "Combat d'Archers", lat: 45.501, lng: -73.567, content: "<p>Montréal, QC</p>" },
            { name: "Combat d'Archers Sherbrooke", lat: 45.405, lng: -71.880, content: "<p>Sherbrooke, QC</p>" },
            { name: "Archers Arena", lat: 43.700, lng: -79.412, content: "<p>Toronto, ON</p>" }
        ];

        communities.forEach(community => {
            const marker = L.marker([community.lat, community.lng]).addTo(map);
            marker.bindPopup(`<b>${community.name}</b><br>${community.content}`);
        });
    }


    // Main Alliance Registration Form Logic
    const form: HTMLFormElement | null = document.getElementById('registration-form') as HTMLFormElement;
    const regTypeSelect: HTMLSelectElement | null = document.getElementById('reg-type') as HTMLSelectElement;
    const groupNameLabel: HTMLElement | null = document.getElementById('group-name-label');
    const groupNameInput: HTMLInputElement | null = document.getElementById('group-name') as HTMLInputElement;
    const registrationsTableBody: HTMLTableSectionElement | null = document.querySelector('#registrations-table tbody') as HTMLTableSectionElement;

    // Conditional input logic
    if (regTypeSelect) {
        regTypeSelect.addEventListener('change', () => {
            if (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') {
                if (groupNameLabel) groupNameLabel.style.display = 'block';
                if (groupNameInput) groupNameInput.style.display = 'block';
            } else {
                if (groupNameLabel) groupNameLabel.style.display = 'none';
                if (groupNameInput) groupNameInput.style.display = 'none';
            }
        });
        regTypeSelect.dispatchEvent(new Event('change'));
    }

    // Handle form submission
    if (form) {
        form.addEventListener('submit', (e: Event) => {
            e.preventDefault();

            document.querySelectorAll<HTMLElement>('.registration-section .error-message').forEach(el => el.style.display = 'none');
            document.querySelectorAll<HTMLInputElement>('.registration-form input').forEach(el => el.classList.remove('error-border'));
            
            let isValid: boolean = true;
            
            const nameInput: HTMLInputElement | null = document.getElementById('full-name') as HTMLInputElement;
            const emailInput: HTMLInputElement | null = document.getElementById('email') as HTMLInputElement;

            if (nameInput && nameInput.value.trim() === '') {
                isValid = false;
                const error: HTMLElement | null = document.getElementById('name-error');
                if(error) error.style.display = 'block';
                nameInput.classList.add('error-border');
            }

            if (emailInput && emailInput.value.trim() === '') {
                isValid = false;
                const error: HTMLElement | null = document.getElementById('email-error');
                if(error) error.style.display = 'block';
                emailInput.classList.add('error-border');
            }

            const groupNameError: HTMLElement | null = document.getElementById('group-name-error');
            if (regTypeSelect && (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') && groupNameInput && groupNameInput.value.trim() === '') {
                isValid = false;
                if(groupNameError) groupNameError.style.display = 'block';
                groupNameInput.classList.add('error-border');
            }
            
            if (!isValid) {
                return;
            }

            const newRegistration = {
                name: (form.elements.namedItem('full_name') as HTMLInputElement)?.value,
                email: (form.elements.namedItem('email') as HTMLInputElement)?.value,
                type: regTypeSelect?.options[regTypeSelect.selectedIndex]?.text || 'N/A',
                groupName: (form.elements.namedItem('group_name') as HTMLInputElement)?.value || 'N/A',
                location: (form.elements.namedItem('location') as HTMLInputElement)?.value || 'N/A',
                phone: (form.elements.namedItem('phone') as HTMLInputElement)?.value || 'N/A',
                message: (form.elements.namedItem('message') as HTMLTextAreaElement)?.value || 'N/A'
            };

            let registrations: any[] = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
            registrations.push(newRegistration);
            localStorage.setItem('icaa_registrations', JSON.stringify(registrations));

            form.reset();
            regTypeSelect?.dispatchEvent(new Event('change'));
            if (registrationsTableBody) loadRegistrations();
            
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const tableSection: HTMLElement | null = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }

    function loadRegistrations() {
        if (registrationsTableBody) {
            registrationsTableBody.innerHTML = '';
            const registrations: any[] = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');

            registrations.forEach(reg => {
                const row: HTMLTableRowElement = registrationsTableBody.insertRow();
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

    if (form) {
        loadRegistrations();
    }

    const registrationsLink: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>('.registrations-link a');
    if (registrationsLink) {
        registrationsLink.addEventListener('click', (e: Event) => {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const tableSection: HTMLElement | null = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }


    // Contact Form Submission Confirmation
    const contactForm: HTMLFormElement | null = document.getElementById('contact-form') as HTMLFormElement;
    const contactSection: HTMLElement | null = document.getElementById('contact');

    if (contactForm && contactSection) {
        const confirmationMessage: HTMLDivElement = document.createElement('div');
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
            
            const nameInput: HTMLInputElement | null = contactForm.querySelector('input[name="name"]');
            const emailInput: HTMLInputElement | null = contactForm.querySelector('input[name="email"]');
            const messageTextarea: HTMLTextAreaElement | null = contactForm.querySelector('textarea[name="message"]');

            const name: string = nameInput?.value.trim() || '';
            const email: string = emailInput?.value.trim() || '';
            const message: string = messageTextarea?.value.trim() || '';

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

        const confirmBtn: HTMLButtonElement | null = document.querySelector<HTMLButtonElement>('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                confirmationMessage.style.display = 'none';
                contactForm.style.display = 'block';
                document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                    section.classList.remove('active');
                });
                const heroSection: HTMLElement | null = document.getElementById('hero-section');
                if (heroSection) {
                    heroSection.classList.add('active');
                }
            });
        }
    }

    const ctaButton: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const registrationSection: HTMLElement | null = document.getElementById('registration-section');
            if (registrationSection) {
                registrationSection.classList.add('active');
            }
        });
    }

    // Event Registration Page Logic
    const eventRegistrationForm: HTMLFormElement | null = document.getElementById('event-registration-form') as HTMLFormElement;
    const registrationTypeSelect: HTMLSelectElement | null = document.getElementById('registration-type') as HTMLSelectElement;
    const teamFields: HTMLElement | null = document.getElementById('team-fields');
    const freeAgentFields: HTMLElement | null = document.getElementById('free-agent-fields');

    function generateRosterFields(): void {
        const rosterFields: HTMLElement | null = document.getElementById('roster-fields');
        if (rosterFields) {
            rosterFields.innerHTML = '';
            for (let i = 0; i < 8; i++) {
                const rosterPlayerDiv: HTMLDivElement = document.createElement('div');
                rosterPlayerDiv.className = 'roster-player';
                rosterPlayerDiv.innerHTML = `
                    <label for="player-name-${i}">Player ${i+1}</label>
                    <input type="text" id="player-name-${i}" name="player_name_${i}">
                    <span class="error-message">This field is required</span>
                `;
                rosterFields.appendChild(rosterPlayerDiv);
            }
        }
    }
    const rosterFields: HTMLElement | null = document.getElementById('roster-fields');
    if (rosterFields) generateRosterFields();

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

    document.querySelectorAll<HTMLAnchorElement>('.event-register-btn-top').forEach(button => {
        button.addEventListener('click', function(e: Event): void {
            e.preventDefault();
            document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            const eventRegistration: HTMLElement | null = document.getElementById('event-registration');
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
        
        const eventSelect: HTMLSelectElement | null = document.getElementById('event-select') as HTMLSelectElement;
        const regTypeSelect: HTMLSelectElement | null = document.getElementById('registration-type') as HTMLSelectElement;

        if (eventSelect && eventSelect.value === '') {
            isValid = false;
            eventSelect.classList.add('error-border');
        }

        if (regTypeSelect && regTypeSelect.value === '') {
            isValid = false;
            regTypeSelect.classList.add('error-border');
        }
        
        if (regTypeSelect?.value === 'team') {
            const teamNameInput: HTMLInputElement | null = document.getElementById('team-name') as HTMLInputElement;
            const teamCityInput: HTMLInputElement | null = document.getElementById('team-city') as HTMLInputElement;

            if (teamNameInput && teamNameInput.value.trim() === '') {
                isValid = false;
                teamNameInput.classList.add('error-border');
                const errorSpan: Element | null = teamNameInput.nextElementSibling;
                if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
            }
            if (teamCityInput && teamCityInput.value.trim() === '') {
                isValid = false;
                teamCityInput.classList.add('error-border');
                const errorSpan: Element | null = teamCityInput.nextElementSibling;
                if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
            }
            
            for (let i = 0; i < 6; i++) {
                const input: HTMLElement | null = document.getElementById(`player-name-${i}`);
                if (input && (input as HTMLInputElement).value.trim() === '') {
                    isValid = false;
                    (input as HTMLInputElement).classList.add('error-border');
                    const errorSpan: Element | null = input.nextElementSibling;
                    if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
                }
            }
        }
        
        if (regTypeSelect?.value === 'free-agent') {
            const freeAgentNameInput: HTMLInputElement | null = document.getElementById('free-agent-name') as HTMLInputElement;
            const freeAgentCityInput: HTMLInputElement | null = document.getElementById('free-agent-city') as HTMLInputElement;
            const freeAgentExperienceTextarea: HTMLTextAreaElement | null = document.getElementById('free-agent-experience') as HTMLTextAreaElement;

            if (freeAgentNameInput && freeAgentNameInput.value.trim() === '') {
                isValid = false;
                freeAgentNameInput.classList.add('error-border');
                const errorSpan: Element | null = freeAgentNameInput.nextElementSibling;
                if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
            }
            if (freeAgentCityInput && freeAgentCityInput.value.trim() === '') {
                isValid = false;
                freeAgentCityInput.classList.add('error-border');
                const errorSpan: Element | null = freeAgentCityInput.nextElementSibling;
                if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
            }
            if (freeAgentExperienceTextarea && freeAgentExperienceTextarea.value.trim() === '') {
                isValid = false;
                freeAgentExperienceTextarea.classList.add('error-border');
                const errorSpan: Element | null = freeAgentExperienceTextarea.nextElementSibling;
                if(errorSpan) (errorSpan as HTMLElement).style.display = 'block';
            }
        }
        
        if (!isValid) {
            return;
        }

        alert('Event registration submitted successfully!');
    });
});

// 'Official Rules' button on 'About the Sport' page logic
const rulesBtn: HTMLAnchorElement | null = document.querySelector<HTMLAnchorElement>('.rules-btn');
if (rulesBtn) {
    rulesBtn.addEventListener('click', function(e: Event): void {
        e.preventDefault();
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        const rulesSection: HTMLElement | null = document.getElementById('official-rules');
        if (rulesSection) {
            rulesSection.classList.add('active');
        }
    });
}

// Other event page navigation
document.querySelectorAll<HTMLAnchorElement>('.event-card').forEach(card => {
    card.addEventListener('click', function(e: Event): void {
        e.preventDefault();
    
        const sectionToShowId: string | null = this.getAttribute('data-event');
        
        document.querySelectorAll<HTMLElement>('.content-section').forEach(section => {
            section.classList.remove('active');
        });
        
        if (sectionToShowId) {
            const section: HTMLElement | null = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
    });
});