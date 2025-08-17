"use strict";
function toggleSidebar() {
    document.body.classList.toggle('sidebar-open');
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
        if (e.target instanceof Element && !e.target.closest('.event-register-btn-top')) {
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
        var sectionToShowId = this.getAttribute('data-back-to');
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
var images = [
    'images/Archery Photos/action-1.jpg',
    'images/Archery Photos/action-2.jpg',
    'images/Archery Photos/action-3.jpg',
    'images/Archery Photos/action-4.jpg'
];
var currentImageIndex = 0;
var rotatorImg = document.getElementById('rotator-img');
var prevBtn = document.getElementById('prev-btn');
var nextBtn = document.getElementById('next-btn');
function changeImage(direction) {
    if (!rotatorImg || images.length === 0)
        return;
    rotatorImg.style.opacity = '0';
    setTimeout(function () {
        currentImageIndex += direction;
        if (currentImageIndex < 0) {
            currentImageIndex = images.length - 1;
        }
        else if (currentImageIndex >= images.length) {
            currentImageIndex = 0;
        }
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
// setInterval(() => {
//     changeImage(1);
// }, 5000); // Change image every 5 seconds
// Map Pin functionality
document.querySelectorAll('.map-pin').forEach(function (pin) {
    pin.addEventListener('click', function () {
        var targetId = pin.getAttribute('data-target');
        if (targetId) {
            var targetElement = document.getElementById(targetId);
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
document.addEventListener('DOMContentLoaded', function () {
    var form = document.getElementById('registration-form');
    var regTypeSelect = document.getElementById('reg-type');
    var groupNameLabel = document.getElementById('group-name-label');
    var groupNameInput = document.getElementById('group-name');
    var registrationsTableBody = document.querySelector('#registrations-table tbody');
    // Conditional input logic
    if (regTypeSelect) {
        regTypeSelect.addEventListener('change', function () {
            if (regTypeSelect.value === 'member-class-1' || regTypeSelect.value === 'member-class-2') {
                groupNameLabel.style.display = 'block';
                groupNameInput.style.display = 'block';
            }
            else {
                groupNameLabel.style.display = 'none';
                groupNameInput.style.display = 'none';
            }
        });
    }
    // Handle form submission
    if (form) {
        form.addEventListener('submit', function (e) {
            var _a, _b, _c, _d, _e;
            e.preventDefault();
            // Clear existing errors
            document.querySelectorAll('.registration-section .error-message').forEach(function (el) { return el.style.display = 'none'; });
            document.querySelectorAll('.registration-form input').forEach(function (el) { return el.classList.remove('error-border'); });
            var isValid = true;
            var nameInput = document.getElementById('full-name');
            var emailInput = document.getElementById('email');
            if (nameInput.value.trim() === '') {
                isValid = false;
                var error = document.getElementById('name-error');
                if (error)
                    error.style.display = 'block';
                nameInput.classList.add('error-border');
            }
            if (emailInput.value.trim() === '') {
                isValid = false;
                var error = document.getElementById('email-error');
                if (error)
                    error.style.display = 'block';
                emailInput.classList.add('error-border');
            }
            var groupNameError = document.getElementById('group-name-error');
            if (groupNameLabel.style.display === 'block' && groupNameInput.value.trim() === '') {
                isValid = false;
                if (groupNameError)
                    groupNameError.style.display = 'block';
                groupNameInput.classList.add('error-border');
            }
            if (!isValid) {
                return;
            }
            var newRegistration = {
                name: form.elements.namedItem('full-name').value,
                email: form.elements.namedItem('email').value,
                type: ((_a = regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.options[regTypeSelect.selectedIndex]) === null || _a === void 0 ? void 0 : _a.text) || 'N/A',
                groupName: ((_b = form.elements.namedItem('group-name')) === null || _b === void 0 ? void 0 : _b.value) || 'N/A',
                location: ((_c = form.elements.namedItem('location')) === null || _c === void 0 ? void 0 : _c.value) || 'N/A',
                phone: ((_d = form.elements.namedItem('phone')) === null || _d === void 0 ? void 0 : _d.value) || 'N/A',
                message: ((_e = form.elements.namedItem('message')) === null || _e === void 0 ? void 0 : _e.value) || 'N/A'
            };
            var registrations = JSON.parse(localStorage.getItem('icaa_registrations') || '[]');
            registrations.push(newRegistration);
            localStorage.setItem('icaa_registrations', JSON.stringify(registrations));
            form.reset();
            regTypeSelect === null || regTypeSelect === void 0 ? void 0 : regTypeSelect.dispatchEvent(new Event('change'));
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
    loadRegistrations();
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
});
// Contact Form Submission Confirmation
document.addEventListener('DOMContentLoaded', function () {
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
            var name = nameInput.value.trim();
            var email = emailInput.value.trim();
            var message = messageTextarea.value.trim();
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
});
// Event Registration Page Logic
document.addEventListener('DOMContentLoaded', function () {
    var eventRegistrationForm = document.getElementById('event-registration-form');
    var registrationTypeSelect = document.getElementById('registration-type');
    var teamFields = document.getElementById('team-fields');
    var freeAgentFields = document.getElementById('free-agent-fields');
    var rosterFields = document.getElementById('roster-fields');
    function generateRosterFields() {
        if (rosterFields) {
            rosterFields.innerHTML = '';
            for (var i = 0; i < 8; i++) {
                rosterFields.innerHTML += "\n                    <div class=\"roster-player\">\n                        <label for=\"player-name-".concat(i, "\">Player ").concat(i + 1, "</label>\n                        <input type=\"text\" id=\"player-name-").concat(i, "\" name=\"player_name_").concat(i, "\">\n                        <span class=\"error-message\">This field is required</span>\n                    </div>\n                ");
            }
        }
    }
    generateRosterFields();
    // Show/hide fields based on registration type
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
    // Event Registration Buttons
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
        if (eventSelect.value === '') {
            isValid = false;
            eventSelect.classList.add('error-border');
        }
        if (regTypeSelect.value === '') {
            isValid = false;
            regTypeSelect.classList.add('error-border');
        }
        if (regTypeSelect.value === 'team') {
            var teamNameInput = document.getElementById('team-name');
            var teamCityInput = document.getElementById('team-city');
            if (teamNameInput.value.trim() === '') {
                isValid = false;
                teamNameInput.classList.add('error-border');
                var errorSpan = teamNameInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (teamCityInput.value.trim() === '') {
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
        if (regTypeSelect.value === 'free-agent') {
            var freeAgentNameInput = document.getElementById('free-agent-name');
            var freeAgentCityInput = document.getElementById('free-agent-city');
            var freeAgentExperienceTextarea = document.getElementById('free-agent-experience');
            if (freeAgentNameInput.value.trim() === '') {
                isValid = false;
                freeAgentNameInput.classList.add('error-border');
                var errorSpan = freeAgentNameInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (freeAgentCityInput.value.trim() === '') {
                isValid = false;
                freeAgentCityInput.classList.add('error-border');
                var errorSpan = freeAgentCityInput.nextElementSibling;
                if (errorSpan)
                    errorSpan.style.display = 'block';
            }
            if (freeAgentExperienceTextarea.value.trim() === '') {
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
