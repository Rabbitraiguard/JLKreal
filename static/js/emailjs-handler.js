/**
 * EmailJS Handler for JLK Transservice
 * Handles form submissions using EmailJS instead of Formspree
 */

// EmailJS Configuration
const EMAILJS_CONFIG = {
    publicKey: 'MQj01V11zBf3edqLX',
    privateKey: 'OtbWFwTYDuv3AZHk2-pdm',
    serviceId: 'default_service', // You'll need to set this up in EmailJS dashboard
    contactTemplateId: 'template_contact', // You'll need to create this template
    quoteTemplateId: 'template_quote' // You'll need to create this template
};

// Initialize EmailJS when the page loads
document.addEventListener('DOMContentLoaded', function() {
    // EmailJS is already initialized in the HTML head
    setupContactForm();
    setupQuoteForm();
});

/**
 * Setup Contact Form Handler
 */
function setupContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = contactForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่งข้อความ...';
            
            // Prepare template parameters
            const formData = new FormData(contactForm);
            const templateParams = {
                from_name: formData.get('name'),
                from_email: formData.get('email'),
                subject: formData.get('subject') || 'ข้อความจากเว็บไซต์',
                message: formData.get('message'),
                to_email: 'jlktransservice@gmail.com',
                reply_to: formData.get('email')
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.contactTemplateId,
                templateParams
            );
            
            console.log('Contact form sent successfully:', response);
            showSuccessMessage(contactForm, 'ส่งข้อความเรียบร้อยแล้ว! เราจะติดต่อกลับโดยเร็ว');
            contactForm.reset();
            
        } catch (error) {
            console.error('Error sending contact form:', error);
            showErrorMessage(contactForm, 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

/**
 * Setup Quote Form Handler
 */
function setupQuoteForm() {
    const quoteForm = document.getElementById('quote-form');
    if (!quoteForm) return;

    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validate form first
        if (!validateQuoteForm()) {
            return;
        }
        
        const submitButton = quoteForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton.innerHTML;
        
        try {
            // Show loading state
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>กำลังส่งคำขอ...';
            
            // Prepare template parameters
            const formData = new FormData(quoteForm);
            const templateParams = {
                company_name: formData.get('companyName'),
                contact_name: formData.get('contactName'),
                from_email: formData.get('email'),
                phone: formData.get('phone'),
                service_type: formData.get('serviceType'),
                cargo_type: formData.get('cargoType'),
                origin: formData.get('origin'),
                destination: formData.get('destination'),
                weight: formData.get('weight'),
                volume: formData.get('volume'),
                pickup_date: formData.get('pickupDate'),
                special_requirements: formData.get('specialRequirements'),
                additional_notes: formData.get('additionalNotes'),
                to_email: 'jlktransservice@gmail.com',
                reply_to: formData.get('email')
            };
            
            // Send email using EmailJS
            const response = await emailjs.send(
                EMAILJS_CONFIG.serviceId,
                EMAILJS_CONFIG.quoteTemplateId,
                templateParams
            );
            
            console.log('Quote form sent successfully:', response);
            showSuccessMessage(quoteForm, 'ส่งคำขอใบเสนอราคาเรียบร้อยแล้ว! เราจะติดต่อกลับภายใน 24 ชั่วโมง');
            quoteForm.reset();
            
        } catch (error) {
            console.error('Error sending quote form:', error);
            showErrorMessage(quoteForm, 'เกิดข้อผิดพลาดในการส่งคำขอ กรุณาลองใหม่อีกครั้ง');
        } finally {
            // Reset button state
            submitButton.disabled = false;
            submitButton.innerHTML = originalButtonText;
        }
    });
}

/**
 * Validate Quote Form
 */
function validateQuoteForm() {
    const form = document.getElementById('quote-form');
    const requiredFields = ['companyName', 'contactName', 'email', 'phone', 'serviceType'];
    
    // Check required fields
    for (const fieldName of requiredFields) {
        const field = form.querySelector(`[name="${fieldName}"]`);
        if (!field || !field.value.trim()) {
            showFieldError(field, `กรุณากรอก${getFieldLabel(fieldName)}`);
            field.focus();
            return false;
        }
    }
    
    // Validate email
    const emailField = form.querySelector('[name="email"]');
    if (emailField && emailField.value && !validateEmail(emailField.value)) {
        showFieldError(emailField, 'รูปแบบอีเมลไม่ถูกต้อง');
        emailField.focus();
        return false;
    }
    
    // Validate phone
    const phoneField = form.querySelector('[name="phone"]');
    if (phoneField && phoneField.value && !validatePhone(phoneField.value)) {
        showFieldError(phoneField, 'รูปแบบเบอร์โทรศัพท์ไม่ถูกต้อง');
        phoneField.focus();
        return false;
    }
    
    return true;
}

/**
 * Utility Functions
 */
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9\-\+\s\(\)]{8,}$/;
    return re.test(phone);
}

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

function showFieldError(field, message) {
    // Remove existing error
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Add error class
    field.classList.add('error');
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message text-red-500 text-sm mt-1';
    errorDiv.textContent = message;
    field.parentNode.appendChild(errorDiv);
    
    // Remove error on input
    field.addEventListener('input', function() {
        field.classList.remove('error');
        const errorMsg = field.parentNode.querySelector('.error-message');
        if (errorMsg) {
            errorMsg.remove();
        }
    }, { once: true });
}

function showSuccessMessage(form, message) {
    // Create success message
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4';
    successDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-check-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert before form
    form.parentNode.insertBefore(successDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
    
    // Scroll to message
    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

function showErrorMessage(form, message) {
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4';
    errorDiv.innerHTML = `
        <div class="flex items-center">
            <i class="fas fa-exclamation-circle mr-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Insert before form
    form.parentNode.insertBefore(errorDiv, form);
    
    // Remove after 5 seconds
    setTimeout(() => {
        errorDiv.remove();
    }, 5000);
    
    // Scroll to message
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Export functions for global access
window.EmailJSHandler = {
    validateEmail,
    validatePhone,
    showSuccessMessage,
    showErrorMessage
};