// Quote page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupForm();
    setupToastContainer();
    checkForSuccessMessage();
});

// Setup toast container if not exists
function setupToastContainer() {
    if (!document.getElementById('toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.className = 'fixed top-4 right-4 z-50 space-y-2';
        document.body.appendChild(toastContainer);
    }
}

// Check for success message in URL
function checkForSuccessMessage() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('success') === '1') {
        showToast('ส่งคำขอใบเสนอราคาสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง', 'success');
        // Clean up URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

// Setup form functionality
function setupForm() {
    const form = document.getElementById('quote-form');
    const clearButton = document.getElementById('clear-form');

    if (form) {
        // Add basic validation before submission
        form.addEventListener('submit', function(event) {
            if (!validateForm()) {
                event.preventDefault();
                return false;
            }
            
            // Show loading state
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่งคำขอ...';
            }
        });
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearForm);
    }

    // Add real-time validation
    addRealTimeValidation();
}

// Validate form before submission
function validateForm() {
    const form = document.getElementById('quote-form');
    const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'serviceType'];
    let isValid = true;

    // Check required fields
    for (const fieldName of requiredFields) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field || !field.value.trim()) {
            showToast(`กรุณากรอก${getFieldLabel(fieldName)}ให้ครบถ้วน`, 'error');
            if (field) field.focus();
            isValid = false;
            break;
        }
    }

    // Validate email
    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
        showToast('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
        emailField.focus();
        isValid = false;
    }

    // Validate phone
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
        showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง', 'error');
        phoneField.focus();
        isValid = false;
    }

    return isValid;
}

// Get field label for error messages
function getFieldLabel(fieldName) {
    const labels = {
        'companyName': 'ชื่อบริษัท',
        'contactName': 'ชื่อผู้ติดต่อ',
        'email': 'อีเมล',
        'phone': 'เบอร์โทรศัพท์',
        'serviceType': 'ประเภทบริการ'
    };
    return labels[fieldName] || fieldName;
}

// Add real-time validation to form fields
function addRealTimeValidation() {
    const form = document.getElementById('quote-form');
    if (!form) return;

    // Email validation
    const emailField = form.querySelector('[name="email"]');
    if (emailField) {
        emailField.addEventListener('blur', function() {
            if (this.value && !validateEmail(this.value)) {
                showToast('รูปแบบอีเมลไม่ถูกต้อง', 'error');
                this.focus();
            }
        });
    }

    // Phone validation
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField) {
        phoneField.addEventListener('blur', function() {
            if (this.value && !validatePhone(this.value)) {
                showToast('รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง', 'error');
                this.focus();
            }
        });
    }

    // Auto-format phone number
    if (phoneField) {
        phoneField.addEventListener('input', function() {
            // Remove non-digits
            let value = this.value.replace(/\D/g, '');
            
            // Limit to 10 digits for Thai phone numbers
            if (value.length > 10) {
                value = value.slice(0, 10);
            }
            
            this.value = value;
        });
    }

    // Weight field - numeric only
    const weightField = form.querySelector('[name="weight"]');
    if (weightField) {
        weightField.addEventListener('input', function() {
            if (this.value < 0) {
                this.value = 0;
            }
        });
    }
}

// Clear form function
function clearForm() {
    const form = document.getElementById('quote-form');
    if (form) {
        form.reset();
        showToast('เคลียร์ฟอร์มเรียบร้อย', 'success');
    }
}

// Validation helper functions
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{8,10}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

// Toast notification function
function showToast(message, type = 'info') {
    if (typeof window.showToast === 'function') {
        window.showToast(message, type);
    } else {
        // Fallback if main.js toast is not available
        console.log(`[${type.toUpperCase()}] ${message}`);
        alert(message);
    }
}

// Smooth scrolling for form errors
function scrollToField(fieldName) {
    const field = document.querySelector(`[name="${fieldName}"]`);
    if (field) {
        field.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        });
        setTimeout(() => field.focus(), 300);
    }
}

// Export functions for global use
window.clearForm = clearForm;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;