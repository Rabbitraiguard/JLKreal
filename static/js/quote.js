// Quote page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupForm();
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

// Setup form functionality
function setupForm() {
    const form = document.getElementById('quote-form');
    const clearButton = document.getElementById('clear-form');

    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    if (clearButton) {
        clearButton.addEventListener('click', clearForm);
    }
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = {};
    
    // Collect form data
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }

    // Validate required fields
    const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'serviceType'];
    const missingFields = requiredFields.filter(field => !data[field]);

    if (missingFields.length > 0) {
        showToast('กรุณากรอกข้อมูลให้ครบถ้วน', 'error');
        return;
    }

    // Validate email
    if (!validateEmail(data.email)) {
        showToast('กรุณากรอกอีเมลให้ถูกต้อง', 'error');
        return;
    }

    // Validate phone
    if (!validatePhone(data.phone)) {
        showToast('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง', 'error');
        return;
    }

    // Generate email and send
    generateEmailQuote(data);
}

// Submit quote to API
async function generateEmailQuote(data) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    
    try {
        // Show processing state
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่งคำขอ...';

        // Collect additional services if any
        const additionalServices = [];
        const checkboxes = document.querySelectorAll('input[name="additionalServices"]:checked');
        checkboxes.forEach(checkbox => {
            additionalServices.push(checkbox.value);
        });
        data.additionalServices = additionalServices;

        const response = await fetch('/api/quote', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });

        let result;
        try {
            result = await response.json();
        } catch (parseError) {
            // If JSON parsing fails, the server likely returned HTML (error page)
            const textResponse = await response.text();
            console.error('Server returned non-JSON response:', textResponse);
            throw new Error('เซิร์ฟเวอร์ไม่สามารถประมวลผลข้อมูลได้ กรุณาตรวจสอบการตั้งค่า');
        }

        if (response.ok && result.success) {
            showToast(`ส่งคำขอใบเสนอราคาสำเร็จ! รหัสอ้างอิง: #${result.quote_id.toString().padStart(6, '0')}`, 'success');
            clearForm();
            
            // Show additional success information
            setTimeout(() => {
                showToast('เราจะติดต่อกลับภายใน 24 ชั่วโมง พร้อมใบเสนอราคา', 'info');
            }, 2000);
            
        } else {
            throw new Error(result.message || 'เกิดข้อผิดพลาดในการส่งข้อมูล');
        }

    } catch (error) {
        console.error('Error submitting quote:', error);
        showToast(error.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่อีกครั้ง', 'error');
    } finally {
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
    }
}

// Helper functions for readable names
function getServiceTypeName(type) {
    const serviceTypes = {
        'export': 'บริการส่งออก',
        'import': 'บริการนำเข้า', 
        'customs': 'พิธีการศุลกากร',
        'domestic': 'ขนส่งภายในประเทศ',
        'consulting': 'ที่ปรึกษาโลจิสติกส์',
        'other': 'อื่นๆ'
    };
    return serviceTypes[type] || type;
}

function getUrgencyName(urgency) {
    const urgencyTypes = {
        'standard': 'ปกติ (7-14 วัน)',
        'urgent': 'เร่งด่วน (3-7 วัน)', 
        'express': 'ด่วนพิเศษ (1-3 วัน)',
        'same-day': 'ภายในวันเดียว'
    };
    return urgencyTypes[urgency] || urgency || 'ไม่ระบุ';
}

// Clear form function
function clearForm() {
    const form = document.getElementById('quote-form');
    if (form) {
        form.reset();
        
        // Uncheck all checkboxes
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
        });
        
        // Clear custom validation messages
        const inputs = form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            input.setCustomValidity('');
            input.classList.remove('border-red-500', 'border-green-500');
        });
        
        showToast('ฟอร์มถูกเคลียร์แล้ว', 'success');
    }
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
        if (email && !validateEmail(email)) {
            e.target.setCustomValidity('กรุณากรอกอีเมลให้ถูกต้อง');
        } else {
            e.target.setCustomValidity('');
        }
    }
    
    if (e.target.name === 'phone') {
        const phone = e.target.value;
        if (phone && !validatePhone(phone)) {
            e.target.setCustomValidity('กรุณากรอกเบอร์โทรศัพท์ให้ถูกต้อง (8-10 หลัก)');
        } else {
            e.target.setCustomValidity('');
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
        e.target.style.height = e.target.scrollHeight + 'px';
    }
});