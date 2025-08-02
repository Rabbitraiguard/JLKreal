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

    // Generate email and send
    generateEmailQuote(data);
}

// Generate email with quote data
function generateEmailQuote(data) {
    const submitButton = document.querySelector('button[type="submit"]');
    const originalContent = submitButton.innerHTML;
    
    // Show processing state
    submitButton.disabled = true;
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังเตรียมอีเมล...';

    // Create email content
    const emailSubject = `คำขอใบเสนอราคา - ${data.companyName}`;
    const emailBody = `
เรียน JLK Transservice

ข้าพเจ้าต้องการขอใบเสนอราคาสำหรับบริการโลจิสติกส์ โดยมีรายละเอียดดังนี้:

=== ข้อมูลบริษัท ===
ชื่อบริษัท: ${data.companyName}
ชื่อผู้ติดต่อ: ${data.contactName}
อีเมล: ${data.email}
เบอร์โทรศัพท์: ${data.phone}

=== ข้อมูลบริการ ===
ประเภทบริการ: ${getServiceTypeName(data.serviceType)}
ความเร่งด่วน: ${getUrgencyName(data.urgency)}
จุดต้นทาง: ${data.origin || 'ไม่ระบุ'}
จุดปลายทาง: ${data.destination || 'ไม่ระบุ'}

=== ข้อมูลสินค้า ===
ประเภทสินค้า: ${data.cargoType || 'ไม่ระบุ'}
น้ำหนัก: ${data.weight ? data.weight + ' กก.' : 'ไม่ระบุ'}
ขนาด: ${data.dimensions || 'ไม่ระบุ'}

=== รายละเอียดเพิ่มเติม ===
${data.description || 'ไม่มี'}

---
กรุณาติดต่อกลับที่อีเมลหรือเบอร์โทรศัพท์ข้างต้น

ขอบคุณครับ/ค่ะ
${data.contactName}
${data.companyName}
    `.trim();

    // Create mailto link
    const mailtoLink = `mailto:jlktransservice@gmail.com?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
    
    // Open email client
    window.location.href = mailtoLink;
    
    // Reset button after a short delay
    setTimeout(() => {
        submitButton.disabled = false;
        submitButton.innerHTML = originalContent;
        
        // Show success message
        showToast('เปิดโปรแกรมอีเมลสำเร็จ! กรุณาส่งอีเมลเพื่อขอใบเสนอราคา', 'success');
        
        // Clear form after successful submission
        clearForm();
    }, 1000);
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