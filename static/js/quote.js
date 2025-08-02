// Quote page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    setupForm();
});



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

    // Simulate form submission (in real implementation, this would send to backend)
    submitQuoteForm(data);
}

// Simulate form submission
function submitQuoteForm(data) {
    // Show loading state
    const submitButton = document.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่ง...';

    // Simulate API call
    setTimeout(() => {
        // Success
        showToast('ส่งคำขอใบเสนอราคาสำเร็จ! เราจะติดต่อกลับภายใน 24 ชั่วโมง', 'success');
        
        // Reset button
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
        
        // Clear form
        clearForm();
        
        // Log data (in real implementation, this would be sent to backend)
        console.log('Quote Request Data:', data);
        
        // You can also send this data to a Python backend
        sendToPythonBackend(data);
        
    }, 2000);
}

// Send data to Python backend (example)
function sendToPythonBackend(data) {
    // In a real implementation, you would send this to your Python backend
    // Example using fetch API:
    /*
    fetch('/api/quote', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
        console.log('Backend response:', result);
    })
    .catch(error => {
        console.error('Error:', error);
        showToast('เกิดข้อผิดพลาดในการส่งข้อมูล', 'error');
    });
    */
    
    // For now, just log the data
    console.log('Data that would be sent to Python backend:', data);
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
        
        showToast('ฟอร์มถูกเคลียร์แล้ว', 'success');
    }
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