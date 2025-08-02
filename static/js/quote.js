// Quote page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupForm();
    setupToastContainer();
    checkForSuccessMessage();
    initializeAnimations();
    setupImagePreview();
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
        // Add form validation for Formspree submission
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
        console.log('Quote form setup complete with Formspree integration');
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

// Form validation and submission handling for Formspree

// Reset submit button state
function resetSubmitButton(button) {
    if (button) {
        button.disabled = false;
        button.classList.remove('loading');
        button.innerHTML = '<i class="fas fa-envelope h-5 w-5 mr-2"></i>ส่งคำขอใบเสนอราคา';
    }
}

// Initialize page animations
function initializeAnimations() {
    // Add animation class to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.classList.add('quote-card-enter');
    });
    
    // Add pulse effect to quote button
    const quoteButton = document.querySelector('.btn-secondary');
    if (quoteButton) {
        quoteButton.classList.add('pulse-glow');
    }
    
    // Stagger form field animations on page load
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });
}

// Setup image preview functionality
function setupImagePreview() {
    const fileInput = document.getElementById('attachment');
    if (fileInput) {
        fileInput.addEventListener('change', handleImageSelect);
    }
}

// Handle image selection and preview
function handleImageSelect(event) {
    const file = event.target.files[0];
    if (file) {
        // Validate file size (5MB)
        if (file.size > 5 * 1024 * 1024) {
            showToast('ไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)', 'error');
            event.target.value = '';
            return;
        }
        
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        if (!allowedTypes.includes(file.type)) {
            showToast('รูปแบบไฟล์ไม่ถูกต้อง (รองรับเฉพาะ jpg, png, gif, webp)', 'error');
            event.target.value = '';
            return;
        }
        
        // Create image preview
        createImagePreview(file);
    }
}

// Create image preview
function createImagePreview(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        // Remove existing preview
        removeImagePreview();
        
        // Create preview container
        const previewContainer = document.createElement('div');
        previewContainer.id = 'image-preview';
        previewContainer.className = 'image-preview-container mt-3 p-3 border rounded-lg bg-gray-50';
        
        previewContainer.innerHTML = `
            <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium text-gray-700">ตัวอย่างรูปภาพ:</span>
                <button type="button" onclick="removeImagePreview()" class="text-red-500 hover:text-red-700">
                    <i class="fas fa-times"></i>
                </button>
            </div>
            <div class="text-center">
                <img src="${e.target.result}" alt="Preview" class="max-w-full h-auto max-h-48 rounded-lg shadow-md">
                <p class="text-xs text-gray-500 mt-2">${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)</p>
            </div>
        `;
        
        // Insert after file input
        const fileInput = document.getElementById('attachment');
        fileInput.parentNode.insertBefore(previewContainer, fileInput.nextSibling);
        
        // Add slide-in animation
        setTimeout(() => {
            previewContainer.style.opacity = '0';
            previewContainer.style.transform = 'translateY(-10px)';
            previewContainer.style.transition = 'all 0.3s ease';
            previewContainer.style.opacity = '1';
            previewContainer.style.transform = 'translateY(0)';
        }, 10);
    };
    reader.readAsDataURL(file);
}

// Remove image preview
function removeImagePreview() {
    const existingPreview = document.getElementById('image-preview');
    if (existingPreview) {
        existingPreview.style.transition = 'all 0.3s ease';
        existingPreview.style.opacity = '0';
        existingPreview.style.transform = 'translateY(-10px)';
        setTimeout(() => {
            existingPreview.remove();
        }, 300);
    }
}

// Enhanced clear form function
function clearForm() {
    const form = document.getElementById('quote-form');
    if (form) {
        form.reset();
        removeImagePreview();
        showToast('เคลียร์ฟอร์มเรียบร้อย', 'success');
        
        // Reset any error states
        const inputs = form.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.classList.remove('error');
        });
    }
}

// Add CSS for image preview
const style = document.createElement('style');
style.textContent = `
    .image-preview-container {
        background: linear-gradient(135deg, #f8f9ff, #f1f5f9);
        border: 2px dashed hsl(var(--primary) / 0.3);
        animation: slideInUp 0.3s ease-out;
    }
    
    .image-preview-container img {
        transition: transform 0.3s ease;
    }
    
    .image-preview-container img:hover {
        transform: scale(1.05);
    }
    
    .form-input.error, .form-select.error, .form-textarea.error {
        border-color: hsl(var(--destructive));
        box-shadow: 0 0 0 3px hsl(var(--destructive) / 0.1);
    }
`;
document.head.appendChild(style);

// Export functions for global use
window.clearForm = clearForm;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;
window.removeImagePreview = removeImagePreview;