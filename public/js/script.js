"use strict";
document.addEventListener('DOMContentLoaded', function () {
    function toggleSidebar() {
        document.body.classList.toggle('sidebar-open');
    }
    var menuToggleBtn = document.getElementById('menu-toggle-btn');
    if (menuToggleBtn) {
        menuToggleBtn.addEventListener('click', toggleSidebar);
    }
    document.querySelectorAll('.sidebar-nav a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionToShowId = this.getAttribute('data-section');
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            if (sectionToShowId) {
                var section = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
            document.body.classList.remove('sidebar-open');
        });
    });
    // Event page navigation
    document.querySelectorAll('.event-card').forEach(function (card) {
        card.addEventListener('click', function (e) {
            var targetElement = e.target;
            // Only trigger if not clicking the register button
            if (targetElement instanceof Element && !targetElement.closest('.event-register-btn')) {
                e.preventDefault();
                var sectionToShowId = this.getAttribute('data-event');
                document.querySelectorAll('.content-section').forEach(function (section) {
                    section.classList.remove('active');
                });
                if (sectionToShowId) {
                    var section = document.getElementById(sectionToShowId);
                    if (section) {
                        section.classList.add('active');
                    }
                }
            }
        });
    });
    // News page navigation
    document.querySelectorAll('.news-updates-container a').forEach(function (link) {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionToShowId = this.getAttribute('data-news-link');
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            if (sectionToShowId) {
                var section = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
        });
    });
    // Main back button functionality
    document.querySelectorAll('.back-btn').forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            var sectionToShowId = btn.getAttribute('data-back-to');
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            if (sectionToShowId) {
                var section = document.getElementById(sectionToShowId);
                if (section) {
                    section.classList.add('active');
                }
            }
        });
    });
    // Image Swap for Leadership Section
    document.querySelectorAll('.board-member').forEach(function (member) {
        var photo = member.querySelector('.bio-photo');
        if (!photo)
            return;
        var headshotSrc = photo.src;
        var actionshotSrc = photo.getAttribute('data-alt-src');
        // Desktop Hover functionality
        if (window.innerWidth >= 768) {
            member.addEventListener('mouseover', function () {
                if (actionshotSrc) {
                    photo.src = actionshotSrc;
                }
            });
            member.addEventListener('mouseout', function () {
                photo.src = headshotSrc;
            });
        }
        // Mobile Tap functionality
        photo.addEventListener('click', function () {
            if (window.innerWidth < 768) {
                if (photo.src.includes(headshotSrc)) {
                    if (actionshotSrc) {
                        photo.src = actionshotSrc;
                    }
                }
                else {
                    photo.src = headshotSrc;
                }
            }
        });
    });
    // Image Rotator for Homepage
    // Image Rotator for Homepage
    var totalImages = 83;
    var images = [];
    for (var i = 1; i <= totalImages; i++) {
        images.push("images/Rotating Archery Photos/".concat(i, ".jpg"));
    }
    var currentImageIndex = 0;
    var rotatorImg = document.getElementById('rotator-img');
    var prevBtn = document.getElementById('prev-btn');
    var nextBtn = document.getElementById('next-btn');
    function changeImage(direction) {
        if (!rotatorImg || images.length === 0)
            return;
        rotatorImg.style.opacity = '0';
        setTimeout(function () {
            var newIndex;
            if (direction === 0) {
                newIndex = Math.floor(Math.random() * images.length);
            }
            else {
                newIndex = currentImageIndex + direction;
                if (newIndex < 0) {
                    newIndex = images.length - 1;
                }
                else if (newIndex >= images.length) {
                    newIndex = 0;
                }
            }
            currentImageIndex = newIndex;
            var newImageSrc = images[currentImageIndex];
            if (newImageSrc) {
                rotatorImg.src = newImageSrc;
            }
            rotatorImg.style.opacity = '1';
        }, 500);
    }
    if (prevBtn) {
        prevBtn.addEventListener('click', function () {
            changeImage(-1);
        });
    }
    if (nextBtn) {
        nextBtn.addEventListener('click', function () {
            changeImage(1);
        });
    }
    // Optional: Automatic rotation
    setInterval(function () {
        changeImage(1);
    }, 10000); // Change image every 5 seconds
    // Map Pin functionality (now interactive with Leaflet)
    var mapDiv = document.getElementById('interactive-map');
    if (mapDiv) {
        var map_1 = L.map('interactive-map').setView([42.385, -71.018], 4);
        map_1.whenReady(function () {
            setTimeout(function () {
                map_1.invalidateSize();
            }, 1000);
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(map_1);
        var communities = [
            { name: "Archery Games Boston", lat: 42.385, lng: -71.018, content: "<p>Chelsea, MA</p>" },
            { name: "Archery Games Ottawa", lat: 45.421, lng: -75.698, content: "<p>Ottawa, ON</p>" },
            { name: "Archery Games Denver", lat: 39.805, lng: -105.087, content: "<p>Arvada, CO</p>" },
            { name: "Combat d'Archers", lat: 45.501, lng: -73.567, content: "<p>Montréal, QC</p>" },
            { name: "Combat d'Archers Sherbrooke", lat: 45.405, lng: -71.880, content: "<p>Sherbrooke, QC</p>" },
            { name: "Archers Arena", lat: 43.700, lng: -79.412, content: "<p>Toronto, ON</p>" }
        ];
        communities.forEach(function (community) {
            var marker = L.marker([community.lat, community.lng]).addTo(map_1);
            marker.bindPopup("<b>".concat(community.name, "</b><br>").concat(community.content));
        });
    }
    // Main Alliance Registration Form Logic
    var form = document.getElementById('registration-form');
    var regTypeSelect = document.getElementById('reg-type');
    var groupNameLabel = document.getElementById('group-name-label');
    var groupNameInput = document.getElementById('group-name');
    var registrationsTableBody = document.querySelector('#registrations-table tbody');
    // Conditional input logic
    if (regTypeSelect) {
        regTypeSelect.addEventListener('change', function () {
            if (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') {
                if (groupNameLabel)
                    groupNameLabel.style.display = 'block';
                if (groupNameInput)
                    groupNameInput.style.display = 'block';
            }
            else {
                if (groupNameLabel)
                    groupNameLabel.style.display = 'none';
                if (groupNameInput)
                    groupNameInput.style.display = 'none';
            }
        });
        regTypeSelect.dispatchEvent(new Event('change'));
    }
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function (e) {
            var _a, _b, _c, _d, _e, _f, _g;
            e.preventDefault();
            document.querySelectorAll('.registration-section .error-message').forEach(function (el) { return el.style.display = 'none'; });
            document.querySelectorAll('.registration-form input').forEach(function (el) { return el.classList.remove('error-border'); });
            var isValid = true;
            var nameInput = document.getElementById('full-name');
            var emailInput = document.getElementById('email');
            if (nameInput && nameInput.value.trim() === '') {
                isValid = false;
                var error = document.getElementById('name-error');
                if (error)
                    error.style.display = 'block';
                nameInput.classList.add('error-border');
            }
            if (emailInput && emailInput.value.trim() === '') {
                isValid = false;
                var error = document.getElementById('email-error');
                if (error)
                    error.style.display = 'block';
                emailInput.classList.add('error-border');
            }
            var groupNameError = document.getElementById('group-name-error');
            if (regTypeSelect && (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') && groupNameInput && groupNameInput.value.trim() === '') {
                isValid = false;
                if (groupNameError)
                    groupNameError.style.display = 'block';
                groupNameInput.classList.add('error-border');
            }
            if (!isValid) {
                return;
            }
            var newRegistration = {
                name: (_a = form.elements.namedItem('full_name')) === null || _a === void 0 ? void 0 : _a.value,
                email: (_b = form.elements.namedItem('email')) === null || _b === void 0 ? void 0 : _b.value,
                type: ((_c = regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.options[regTypeSelect.selectedIndex]) === null || _c === void 0 ? void 0 : _c.text) || 'N/A',
                groupName: ((_d = form.elements.namedItem('group_name')) === null || _d === void 0 ? void 0 : _d.value) || 'N/A',
                location: ((_e = form.elements.namedItem('location')) === null || _e === void 0 ? void 0 : _e.value) || 'N/A',
                phone: ((_f = form.elements.namedItem('phone')) === null || _f === void 0 ? void 0 : _f.value) || 'N/A',
                message: ((_g = form.elements.namedItem('message')) === null || _g === void 0 ? void 0 : _g.value) || 'N/A'
            };
            var registrations = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
            registrations.push(newRegistration);
            localStorage.setItem('icaa_registrations', JSON.stringify(registrations));
            form.reset();
            regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.dispatchEvent(new Event('change'));
            if (registrationsTableBody)
                loadRegistrations();
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            var tableSection = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }
    function loadRegistrations() {
        if (registrationsTableBody) {
            registrationsTableBody.innerHTML = '';
            var registrations = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
            registrations.forEach(function (reg) {
                var row = registrationsTableBody.insertRow();
                row.innerHTML = "\n                    <td>".concat(reg.name, "</td>\n                    <td>").concat(reg.email, "</td>\n                    <td>").concat(reg.type, "</td>\n                    <td>").concat(reg.groupName, "</td>\n                    <td>").concat(reg.location, "</td>\n                    <td>").concat(reg.phone, "</td>\n                    <td>").concat(reg.message, "</td>\n                ");
            });
        }
    }
    if (form) {
        loadRegistrations();
    }
    var registrationsLink = document.querySelector('.registrations-link a');
    if (registrationsLink) {
        registrationsLink.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            var tableSection = document.getElementById('registrations-table-section');
            if (tableSection) {
                tableSection.classList.add('active');
            }
        });
    }
    // Contact Form Submission Confirmation
    var contactForm = document.getElementById('contact-form');
    var contactSection = document.getElementById('contact');
    if (contactForm && contactSection) {
        var confirmationMessage_1 = document.createElement('div');
        confirmationMessage_1.className = 'confirmation-message';
        confirmationMessage_1.style.display = 'none';
        confirmationMessage_1.innerHTML = "\n            <h3>Thank you for your message!</h3>\n            <p>We will get back to you soon.</p>\n            <button class=\"confirm-btn\">Acknowledge</button>\n        ";
        contactSection.appendChild(confirmationMessage_1);
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            var nameInput = contactForm.querySelector('input[name="name"]');
            var emailInput = contactForm.querySelector('input[name="email"]');
            var messageTextarea = contactForm.querySelector('textarea[name="message"]');
            var name = (nameInput === null || nameInput === void 0 ? void 0 : nameInput.value.trim()) || '';
            var email = (emailInput === null || emailInput === void 0 ? void 0 : emailInput.value.trim()) || '';
            var message = (messageTextarea === null || messageTextarea === void 0 ? void 0 : messageTextarea.value.trim()) || '';
            if (name && email && message) {
                setTimeout(function () {
                    contactForm.reset();
                    contactForm.style.display = 'none';
                    confirmationMessage_1.style.display = 'block';
                }, 500);
            }
            else {
                alert('Please fill in all fields.');
            }
        });
        var confirmBtn = document.querySelector('.confirm-btn');
        if (confirmBtn) {
            confirmBtn.addEventListener('click', function () {
                confirmationMessage_1.style.display = 'none';
                contactForm.style.display = 'block';
                document.querySelectorAll('.content-section').forEach(function (section) {
                    section.classList.remove('active');
                });
                var heroSection = document.getElementById('hero-section');
                if (heroSection) {
                    heroSection.classList.add('active');
                }
            });
        }
    }
    var ctaButton = document.querySelector('.cta-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            var registrationSection = document.getElementById('registration-section');
            if (registrationSection) {
                registrationSection.classList.add('active');
            }
        });
    }
    // Event Registration Page Logic
    var eventRegistrationForm = document.getElementById('event-registration-form');
    var registrationTypeSelect = document.getElementById('registration-type');
    var teamFields = document.getElementById('team-fields');
    var freeAgentFields = document.getElementById('free-agent-fields');
    function generateRosterFields() {
        var rosterFields = document.getElementById('roster-fields');
        if (rosterFields) {
            rosterFields.innerHTML = '';
            for (var i = 0; i < 8; i++) {
                var rosterPlayerDiv = document.createElement('div');
                rosterPlayerDiv.className = 'roster-player';
                rosterPlayerDiv.innerHTML = "\n                    <label for=\"player-name-".concat(i, "\">Player ").concat(i + 1, "</label>\n                    <input type=\"text\" id=\"player-name-").concat(i, "\" name=\"player_name_").concat(i, "\">\n                    <span class=\"error-message\">This field is required</span>\n                ");
                rosterFields.appendChild(rosterPlayerDiv);
            }
        }
    }
    var rosterFields = document.getElementById('roster-fields');
    if (rosterFields)
        generateRosterFields();
    if (registrationTypeSelect) {
        registrationTypeSelect.addEventListener('change', function () {
            if (teamFields)
                teamFields.style.display = 'none';
            if (freeAgentFields)
                freeAgentFields.style.display = 'none';
            if (registrationTypeSelect.value === 'team') {
                if (teamFields)
                    teamFields.style.display = 'flex';
            }
            else if (registrationTypeSelect.value === 'free-agent') {
                if (freeAgentFields)
                    freeAgentFields.style.display = 'flex';
            }
        });
        registrationTypeSelect.dispatchEvent(new Event('change'));
    }
    document.querySelectorAll('.event-register-btn-top').forEach(function (button) {
        button.addEventListener('click', function (e) {
            e.preventDefault();
            document.querySelectorAll('.content-section').forEach(function (section) {
                section.classList.remove('active');
            });
            var eventRegistration = document.getElementById('event-registration');
            if (eventRegistration) {
                eventRegistration.classList.add('active');
            }
        });
    });
    eventRegistrationForm === null || eventRegistrationForm === void 0 ? void 0 : eventRegistrationForm.addEventListener('submit', function (e) {
        e.preventDefault();
        document.querySelectorAll('.event-registration-form .error-message').forEach(function (el) { return el.style.display = 'none'; });
        document.querySelectorAll('.event-registration-form input, .event-registration-form select, .event-registration-form textarea').forEach(function (el) { return el.classList.remove('error-border'); });
        var isValid = true;
        var eventSelect = document.getElementById('event-select');
        var regTypeSelect = document.getElementById('registration-type');
        if (eventSelect && eventSelect.value === '') {
            isValid = false;
            eventSelect.classList.add('error-border');
        }
        if (regTypeSelect && regTypeSelect.value === '') {
            isValid = false;
            regTypeSelect.classList.add('error-border');
        }
        if ((regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.value) === 'team') {
            var teamNameInput = document.getElementById('team-name');
            var teamCityInput = document.getElementById('team-city');
            if (teamNameInput && teamNameInput.value.trim() === '') {
                isValid = false;
                teamNameInput.classList.add('error-border');
                var errorSpan = teamNameInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (teamCityInput && teamCityInput.value.trim() === '') {
                isValid = false;
                teamCityInput.classList.add('error-border');
                var errorSpan = teamCityInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            for (var i = 0; i < 6; i++) {
                var input = document.getElementById("player-name-".concat(i));
                if (input && input.value.trim() === '') {
                    isValid = false;
                    input.classList.add('error-border');
                    var errorSpan = input.nextElementSibling;
                    if (errorSpan)
                        errorSpan.style.display = 'block';
                }
            }
        }
        if ((regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.value) === 'free-agent') {
            var freeAgentNameInput = document.getElementById('free-agent-name');
            var freeAgentCityInput = document.getElementById('free-agent-city');
            var freeAgentExperienceTextarea = document.getElementById('free-agent-experience');
            if (freeAgentNameInput && freeAgentNameInput.value.trim() === '') {
                isValid = false;
                freeAgentNameInput.classList.add('error-border');
                var errorSpan = freeAgentNameInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (freeAgentCityInput && freeAgentCityInput.value.trim() === '') {
                isValid = false;
                freeAgentCityInput.classList.add('error-border');
                var errorSpan = freeAgentCityInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (freeAgentExperienceTextarea && freeAgentExperienceTextarea.value.trim() === '') {
                isValid = false;
                freeAgentExperienceTextarea.classList.add('error-border');
                var errorSpan = freeAgentExperienceTextarea.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
        }
        if (!isValid) {
            return;
        }
        alert('Event registration submitted successfully!');
    });
});
// 'Official Rules' button on 'About the Sport' page logic
var rulesBtn = document.querySelector('.rules-btn');
if (rulesBtn) {
    rulesBtn.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelectorAll('.content-section').forEach(function (section) {
            section.classList.remove('active');
        });
        var rulesSection = document.getElementById('official-rules');
        if (rulesSection) {
            rulesSection.classList.add('active');
        }
    });
}
// Other event page navigation
document.querySelectorAll('.event-card').forEach(function (card) {
    card.addEventListener('click', function (e) {
        e.preventDefault();
        var sectionToShowId = this.getAttribute('data-event');
        document.querySelectorAll('.content-section').forEach(function (section) {
            section.classList.remove('active');
        });
        if (sectionToShowId) {
            var section = document.getElementById(sectionToShowId);
            if (section) {
                section.classList.add('active');
            }
        }
    });
});
