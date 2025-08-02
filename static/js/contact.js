// Contact page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupContactForm();
    setupToastContainer();
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

// Setup contact form functionality
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const clearButton = document.getElementById('clear-contact-form');

    if (form) {
        form.addEventListener('submit', handleContactFormSubmit);
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearContactForm);
    }
}

// Handle contact form submission
async function handleContactFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        data[key] = value.trim();
    }

    // Validate required fields
    const requiredFields = ['name', 'email', 'subject', 'message'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        showToast('กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน', 'error');
        highlightMissingFields(missingFields);
        return;
    }

    // Validate email
    if (!validateEmail(data.email)) {
        showToast('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
        document.getElementById('contact-email').focus();
        return;
    }

    // Validate phone if provided
    if (data.phone && !validatePhone(data.phone)) {
        showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง', 'error');
        document.getElementById('contact-phone').focus();
        return;
    }

    // Submit form
    await submitContactForm(data);
}

// Submit contact form to API
async function submitContactForm(data) {
    const submitButton = document.querySelector('#contact-form button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    
    try {
        // Show processing state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่งข้อความ...';

        const response = await fetch('/api/contact', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok && result.success) {
            showToast(`ส่งข้อความสำเร็จ! รหัสอ้างอิง: #${result.contact_id.toString().padStart(6, '0')}`, 'success');
            clearContactForm();
            
            // Show additional success information
            setTimeout(() => {
                showToast('เราจะติดต่อกลับภายใน 24 ชั่วโมง', 'info');
            }, 2000);
            
        } else {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }

    } catch (error) {
        console.error('Error submitting contact form:', error);
        showToast(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
    }
}

// Clear contact form
function clearContactForm() {
    const form = document.getElementById('contact-form');
    if (form) {
        form.reset();
        
        // Clear custom validation messages
        const inputs = form.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.setCustomValidity('');
            input.classList.remove('border-red-500', 'border-green-500');
        });
        
        showToast('ฟอร์มถูกเคลียร์แล้ว', 'success');
    }
}

// Highlight missing fields
function highlightMissingFields(missingFields) {
    missingFields.forEach(field => {
        const input = document.querySelector(`input[name="${field}"], textarea[name="${field}"]`);
        if (input) {
            input.classList.add('border-red-500');
            input.focus();
        }
    });
}

// Enhanced toast function with different types
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    const icons = {
        success: 'fa-check-circle text-green-500',
        error: 'fa-exclamation-circle text-red-500',
        info: 'fa-info-circle text-blue-500',
        warning: 'fa-exclamation-triangle text-yellow-500'
    };
    
    const colors = {
        success: 'bg-green-50 border border-green-200 text-green-800',
        error: 'bg-red-50 border border-red-200 text-red-800',
        info: 'bg-blue-50 border border-blue-200 text-blue-800',
        warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800'
    };

    toast.className = `p-4 rounded-lg shadow-lg ${colors[type]} max-w-sm transform transition-all duration-300 translate-x-full opacity-0`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${icons[type]} mr-3 text-lg"></i>
                <span class="font-medium">${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4 text-gray-400 hover:text-gray-600">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.classList.add('translate-x-full', 'opacity-0');
            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Real-time form validation
document.addEventListener('input', function(e) {
    if (e.target.type === 'email') {
        const email = e.target.value;
        if (email && validateEmail(email)) {
            e.target.classList.remove('border-red-500');
            e.target.classList.add('border-green-500');
            e.target.setCustomValidity('');
        } else if (email) {
            e.target.classList.remove('border-green-500');
            e.target.classList.add('border-red-500');
            e.target.setCustomValidity('กรุณากรอกอีเมลให้ถูกต้อง');
        } else {
            e.target.classList.remove('border-red-500', 'border-green-500');
            e.target.setCustomValidity('');
        }
    }
    
    if (e.target.name === 'phone') {
        const phone = e.target.value;
        if (phone && validatePhone(phone)) {
            e.target.classList.remove('border-red-500');
            e.target.classList.add('border-green-500');
            e.target.setCustomValidity('');
        } else if (phone) {
            e.target.classList.remove('border-green-500');
            e.target.classList.add('border-red-500');
            e.target.setCustomValidity('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (8-10 หลัก)');
        } else {
            e.target.classList.remove('border-red-500', 'border-green-500');
            e.target.setCustomValidity('');
        }
    }

    // Real-time validation for required fields
    if (e.target.hasAttribute('required')) {
        if (e.target.value.trim()) {
            e.target.classList.remove('border-red-500');
        }
    }
});

// Auto-format phone number
document.addEventListener('input', function(e) {
    if (e.target.name === 'phone') {
        let value = e.target.value.replace(/\D/g, ''); // Remove non-digits
        if (value.length > 3 && value.length <= 6) {
            value = value.replace(/(\d{3})(\d+)/, '$1-$2');
        } else if (value.length > 6) {
            value = value.replace(/(\d{3})(\d{3})(\d+)/, '$1-$2-$3');
        }
        e.target.value = value;
    }
});

// Auto-resize textarea
document.addEventListener('input', function(e) {
    if (e.target.tagName === 'TEXTAREA') {
        e.target.style.height = 'auto';
        e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
    }
});

// Character counter for message field
document.addEventListener('DOMContentLoaded', function() {
    const messageField = document.getElementById('contact-message');
    if (messageField) {
        const maxLength = 500;
        const counter = document.createElement('div');
        counter.className = 'text-sm text-gray-500 mt-1 text-right';
        counter.id = 'message-counter';
        messageField.parentNode.appendChild(counter);
        
        function updateCounter() {
            const remaining = maxLength - messageField.value.length;
            counter.textContent = `${messageField.value.length}/${maxLength} ตัวอักษร`;
            
            if (remaining < 50) {
                counter.className = 'text-sm text-red-500 mt-1 text-right';
            } else if (remaining < 100) {
                counter.className = 'text-sm text-yellow-500 mt-1 text-right';
            } else {
                counter.className = 'text-sm text-gray-500 mt-1 text-right';
            }
        }
        
        messageField.addEventListener('input', updateCounter);
        messageField.setAttribute('maxlength', maxLength);
        updateCounter();
    }
});