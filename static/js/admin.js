// Admin Panel JavaScript
let currentQuotes = [];
let currentQuoteId = null;
let fieldOrder = [
    { id: 'customer_info', label: '📋 ข้อมูลลูกค้า', enabled: true },
    { id: 'service_info', label: '🚚 รายละเอียดบริการ', enabled: true },
    { id: 'cargo_info', label: '📦 ข้อมูลสินค้า', enabled: true },
    { id: 'additional_info', label: '📝 รายละเอียดเพิ่มเติม', enabled: true },
    { id: 'urgency_info', label: '⏰ ความเร่งด่วน', enabled: true }
];

document.addEventListener('DOMContentLoaded', function() {
    initializeAdmin();
});

function initializeAdmin() {
    setupNavigation();
    setupEventListeners();
    loadDashboard();
    loadFieldOrder();
    updateEmailPreview();
}

function setupNavigation() {
    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.getElementById('admin-sidebar');
    const content = document.getElementById('admin-content');

    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('hidden');
        content.classList.toggle('expanded');
    });

    // Tab navigation
    const navItems = document.querySelectorAll('.nav-item');
    const tabContents = document.querySelectorAll('.tab-content');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');
            
            // Show corresponding tab content
            tabContents.forEach(tab => tab.classList.remove('active'));
            document.getElementById(tabId + '-tab').classList.add('active');
            
            // Load tab-specific data
            switch(tabId) {
                case 'dashboard':
                    loadDashboard();
                    break;
                case 'quotes':
                    loadQuotes();
                    break;
                case 'email-layout':
                    loadFieldOrder();
                    updateEmailPreview();
                    break;
                case 'settings':
                    loadSettings();
                    break;
            }
        });
    });
}

function setupEventListeners() {
    // Refresh quotes button
    document.getElementById('refresh-quotes').addEventListener('click', loadQuotes);
    
    // Status filter
    document.getElementById('status-filter').addEventListener('change', function() {
        filterQuotes(this.value);
    });
    
    // Modal controls
    document.getElementById('close-modal').addEventListener('click', closeModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('update-status').addEventListener('click', updateQuoteStatus);
    
    // Email layout controls
    document.getElementById('save-field-order').addEventListener('click', saveFieldOrder);
    document.getElementById('reset-field-order').addEventListener('click', resetFieldOrder);
    document.getElementById('preview-email').addEventListener('click', updateEmailPreview);
    document.getElementById('save-email-settings').addEventListener('click', saveEmailSettings);
    
    // Settings
    document.getElementById('save-settings').addEventListener('click', saveSettings);
    
    // Close modal when clicking outside
    document.getElementById('quote-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closeModal();
        }
    });
}

// Dashboard Functions
function loadDashboard() {
    fetch('/api/quotes')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentQuotes = data.quotes;
                updateDashboardStats(data.quotes);
                loadRecentQuotes(data.quotes.slice(0, 5));
            }
        })
        .catch(error => {
            console.error('Error loading dashboard:', error);
            showToast('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'error');
        });
}

function updateDashboardStats(quotes) {
    const stats = {
        new: quotes.filter(q => {
            const createdDate = new Date(q.created_at);
            const today = new Date();
            const diffTime = Math.abs(today - createdDate);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 1;
        }).length,
        pending: quotes.filter(q => q.status === 'pending').length,
        completed: quotes.filter(q => q.status === 'completed').length,
        total: quotes.length
    };

    document.getElementById('new-quotes-count').textContent = stats.new;
    document.getElementById('pending-quotes-count').textContent = stats.pending;
    document.getElementById('completed-quotes-count').textContent = stats.completed;
    document.getElementById('total-quotes-count').textContent = stats.total;
}

function loadRecentQuotes(quotes) {
    const container = document.getElementById('recent-quotes');
    
    if (quotes.length === 0) {
        container.innerHTML = '<p class="text-gray-500 text-center py-4">ไม่มีใบเสนอราคาล่าสุด</p>';
        return;
    }
    
    container.innerHTML = quotes.map(quote => `
        <div class="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div class="flex-1">
                <div class="flex items-center space-x-3">
                    <span class="font-medium text-gray-900">#${quote.id.toString().padStart(6, '0')}</span>
                    <span class="text-gray-600">${quote.company_name}</span>
                    <span class="status-badge status-${quote.status}">${getStatusText(quote.status)}</span>
                </div>
                <div class="text-sm text-gray-500 mt-1">
                    ${quote.contact_name} • ${formatDate(quote.created_at)}
                </div>
            </div>
            <button onclick="viewQuoteDetails(${quote.id})" class="btn btn-outline btn-sm">
                <i class="fas fa-eye mr-1"></i>
                ดู
            </button>
        </div>
    `).join('');
}

// Quotes Management Functions
function loadQuotes() {
    fetch('/api/quotes')
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                currentQuotes = data.quotes;
                displayQuotes(data.quotes);
            }
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
            showToast('เกิดข้อผิดพลาดในการโหลดใบเสนอราคา', 'error');
        });
}

function displayQuotes(quotes) {
    const tbody = document.getElementById('quotes-table-body');
    
    if (quotes.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="px-6 py-4 text-center text-gray-500">ไม่มีใบเสนอราคา</td></tr>';
        return;
    }
    
    tbody.innerHTML = quotes.map(quote => `
        <tr class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #${quote.id.toString().padStart(6, '0')}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${quote.company_name}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <div>${quote.contact_name}</div>
                <div class="text-xs text-gray-500">${quote.email}</div>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                ${getServiceTypeText(quote.service_type)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
                <span class="status-badge status-${quote.status}">
                    ${getStatusText(quote.status)}
                </span>
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                ${formatDate(quote.created_at)}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                <button onclick="viewQuoteDetails(${quote.id})" class="text-blue-600 hover:text-blue-900">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="editQuoteStatus(${quote.id})" class="text-green-600 hover:text-green-900">
                    <i class="fas fa-edit"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function filterQuotes(status) {
    if (!status) {
        displayQuotes(currentQuotes);
        return;
    }
    
    const filteredQuotes = currentQuotes.filter(quote => quote.status === status);
    displayQuotes(filteredQuotes);
}

function viewQuoteDetails(quoteId) {
    const quote = currentQuotes.find(q => q.id === quoteId);
    if (!quote) return;
    
    currentQuoteId = quoteId;
    
    document.getElementById('modal-title').textContent = `รายละเอียดใบเสนอราคา #${quote.id.toString().padStart(6, '0')}`;
    document.getElementById('modal-status-select').value = quote.status;
    
    const modalContent = document.getElementById('modal-content');
    modalContent.innerHTML = `
        <div class="space-y-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <h4 class="font-semibold text-gray-900 mb-2">ข้อมูลบริษัท</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>บริษัท:</strong> ${quote.company_name}</div>
                        <div><strong>ผู้ติดต่อ:</strong> ${quote.contact_name}</div>
                        <div><strong>อีเมล:</strong> <a href="mailto:${quote.email}" class="text-blue-600">${quote.email}</a></div>
                        <div><strong>โทรศัพท์:</strong> <a href="tel:${quote.phone}" class="text-blue-600">${quote.phone}</a></div>
                    </div>
                </div>
                
                <div>
                    <h4 class="font-semibold text-gray-900 mb-2">ข้อมูลบริการ</h4>
                    <div class="space-y-2 text-sm">
                        <div><strong>ประเภทบริการ:</strong> ${getServiceTypeText(quote.service_type)}</div>
                        <div><strong>จุดต้นทาง:</strong> ${quote.origin || 'ไม่ระบุ'}</div>
                        <div><strong>จุดปลายทาง:</strong> ${quote.destination || 'ไม่ระบุ'}</div>
                        <div><strong>ความเร่งด่วน:</strong> ${getUrgencyText(quote.urgency)}</div>
                    </div>
                </div>
            </div>
            
            <div>
                <h4 class="font-semibold text-gray-900 mb-2">ข้อมูลสินค้า</h4>
                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div><strong>ประเภทสินค้า:</strong> ${quote.cargo_type || 'ไม่ระบุ'}</div>
                    <div><strong>น้ำหนัก:</strong> ${quote.weight ? quote.weight + ' กก.' : 'ไม่ระบุ'}</div>
                    <div><strong>ขนาด:</strong> ${quote.dimensions ? quote.dimensions + ' ซม.' : 'ไม่ระบุ'}</div>
                </div>
            </div>
            
            ${quote.description ? `
            <div>
                <h4 class="font-semibold text-gray-900 mb-2">รายละเอียดเพิ่มเติม</h4>
                <div class="bg-gray-50 p-3 rounded text-sm">${quote.description}</div>
            </div>
            ` : ''}
            
            <div class="text-xs text-gray-500 pt-4 border-t">
                <div><strong>วันที่สร้าง:</strong> ${formatDateTime(quote.created_at)}</div>
                <div><strong>สถานะปัจจุบัน:</strong> <span class="status-badge status-${quote.status}">${getStatusText(quote.status)}</span></div>
            </div>
        </div>
    `;
    
    document.getElementById('quote-modal').classList.remove('hidden');
}

function editQuoteStatus(quoteId) {
    viewQuoteDetails(quoteId);
}

function updateQuoteStatus() {
    if (!currentQuoteId) return;
    
    const newStatus = document.getElementById('modal-status-select').value;
    
    fetch(`/api/quotes/${currentQuoteId}/status`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showToast('อัปเดตสถานะสำเร็จ', 'success');
            closeModal();
            loadQuotes();
            loadDashboard();
        } else {
            showToast(data.message || 'เกิดข้อผิดพลาดในการอัปเดตสถานะ', 'error');
        }
    })
    .catch(error => {
        console.error('Error updating status:', error);
        showToast('เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์', 'error');
    });
}

function closeModal() {
    document.getElementById('quote-modal').classList.add('hidden');
    currentQuoteId = null;
}

// Email Layout Functions
function loadFieldOrder() {
    const container = document.getElementById('field-order-list');
    container.innerHTML = fieldOrder.map((field, index) => `
        <div class="field-order-item flex items-center justify-between p-3 bg-white border rounded-lg" 
             draggable="true" data-field-id="${field.id}" data-index="${index}">
            <div class="flex items-center">
                <i class="fas fa-grip-vertical text-gray-400 mr-3 cursor-move"></i>
                <div>
                    <div class="font-medium">${field.label}</div>
                    <div class="text-sm text-gray-500">ลำดับที่ ${index + 1}</div>
                </div>
            </div>
            <div class="flex items-center space-x-2">
                <label class="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" ${field.enabled ? 'checked' : ''} 
                           class="sr-only peer" onchange="toggleField('${field.id}', this.checked)">
                    <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
            </div>
        </div>
    `).join('');
    
    setupDragAndDrop();
}

function setupDragAndDrop() {
    const container = document.getElementById('field-order-list');
    let draggedElement = null;
    
    container.addEventListener('dragstart', function(e) {
        draggedElement = e.target.closest('.field-order-item');
        draggedElement.classList.add('dragging');
    });
    
    container.addEventListener('dragend', function(e) {
        if (draggedElement) {
            draggedElement.classList.remove('dragging');
            draggedElement = null;
        }
    });
    
    container.addEventListener('dragover', function(e) {
        e.preventDefault();
        const afterElement = getDragAfterElement(container, e.clientY);
        if (afterElement == null) {
            container.appendChild(draggedElement);
        } else {
            container.insertBefore(draggedElement, afterElement);
        }
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.field-order-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function toggleField(fieldId, enabled) {
    const field = fieldOrder.find(f => f.id === fieldId);
    if (field) {
        field.enabled = enabled;
        updateEmailPreview();
    }
}

function saveFieldOrder() {
    const items = document.querySelectorAll('.field-order-item');
    const newOrder = [];
    
    items.forEach((item, index) => {
        const fieldId = item.getAttribute('data-field-id');
        const field = fieldOrder.find(f => f.id === fieldId);
        if (field) {
            newOrder.push({ ...field, order: index });
        }
    });
    
    fieldOrder = newOrder.sort((a, b) => a.order - b.order);
    
    // Here you would typically save to backend
    localStorage.setItem('emailFieldOrder', JSON.stringify(fieldOrder));
    
    showToast('บันทึกลำดับฟิลด์สำเร็จ', 'success');
    loadFieldOrder();
    updateEmailPreview();
}

function resetFieldOrder() {
    fieldOrder = [
        { id: 'customer_info', label: '📋 ข้อมูลลูกค้า', enabled: true },
        { id: 'service_info', label: '🚚 รายละเอียดบริการ', enabled: true },
        { id: 'cargo_info', label: '📦 ข้อมูลสินค้า', enabled: true },
        { id: 'additional_info', label: '📝 รายละเอียดเพิ่มเติม', enabled: true },
        { id: 'urgency_info', label: '⏰ ความเร่งด่วน', enabled: true }
    ];
    
    localStorage.removeItem('emailFieldOrder');
    loadFieldOrder();
    updateEmailPreview();
    showToast('รีเซ็ตลำดับฟิลด์สำเร็จ', 'success');
}

function updateEmailPreview() {
    const sampleData = {
        quote_id: '000001',
        companyName: 'บริษัท ตัวอย่าง จำกัด',
        contactName: 'คุณตัวอย่าง',
        email: 'example@company.com',
        phone: '02-123-4567',
        serviceType: 'export',
        origin: 'กรุงเทพฯ, ประเทศไทย',
        destination: 'โตเกียว, ญี่ปุ่น',
        cargoType: 'อุปกรณ์อิเล็กทรอนิกส์',
        weight: '1000',
        dimensions: '100×80×60',
        urgency: 'urgent',
        description: 'ต้องการบริการขนส่งสินค้าอิเล็กทรอนิกส์ไปยังญี่ปุ่น กรุณาจัดการเอกสารศุลกากรด้วย'
    };
    
    const preview = document.getElementById('email-preview');
    const enabledFields = fieldOrder.filter(f => f.enabled);
    
    let emailContent = `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
                <h1>JLK Transservice</h1>
                <h2>คำขอใบเสนอราคาใหม่ #${sampleData.quote_id}</h2>
                <p style="margin: 0; opacity: 0.9;">วันที่: ${new Date().toLocaleDateString('th-TH')}</p>
            </div>
    `;
    
    enabledFields.forEach(field => {
        switch(field.id) {
            case 'customer_info':
                emailContent += `
                    <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">${field.label}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">บริษัท:</td><td style="padding: 8px;">${sampleData.companyName}</td></tr>
                            <tr style="background-color: #f1f5f9;"><td style="padding: 8px; font-weight: bold;">ผู้ติดต่อ:</td><td style="padding: 8px;">${sampleData.contactName}</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold;">อีเมล:</td><td style="padding: 8px;"><a href="mailto:${sampleData.email}">${sampleData.email}</a></td></tr>
                            <tr style="background-color: #f1f5f9;"><td style="padding: 8px; font-weight: bold;">โทรศัพท์:</td><td style="padding: 8px;"><a href="tel:${sampleData.phone}">${sampleData.phone}</a></td></tr>
                        </table>
                    </div>
                `;
                break;
            case 'service_info':
                emailContent += `
                    <div style="padding: 20px; background-color: #fff7ed; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #ea580c; border-bottom: 2px solid #fed7aa; padding-bottom: 10px;">${field.label}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ประเภทบริการ:</td><td style="padding: 8px;">${getServiceTypeText(sampleData.serviceType)}</td></tr>
                            <tr style="background-color: #fef3e2;"><td style="padding: 8px; font-weight: bold;">จุดต้นทาง:</td><td style="padding: 8px;">${sampleData.origin}</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold;">จุดปลายทาง:</td><td style="padding: 8px;">${sampleData.destination}</td></tr>
                        </table>
                    </div>
                `;
                break;
            case 'cargo_info':
                emailContent += `
                    <div style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #16a34a; border-bottom: 2px solid #bbf7d0; padding-bottom: 10px;">${field.label}</h3>
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ประเภทสินค้า:</td><td style="padding: 8px;">${sampleData.cargoType}</td></tr>
                            <tr style="background-color: #ecfdf5;"><td style="padding: 8px; font-weight: bold;">น้ำหนัก:</td><td style="padding: 8px;">${sampleData.weight} กก.</td></tr>
                            <tr><td style="padding: 8px; font-weight: bold;">ขนาด:</td><td style="padding: 8px;">${sampleData.dimensions} ซม.</td></tr>
                        </table>
                    </div>
                `;
                break;
            case 'urgency_info':
                emailContent += `
                    <div style="padding: 20px; background-color: #fef7ff; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #a21caf; border-bottom: 2px solid #f3e8ff; padding-bottom: 10px;">${field.label}</h3>
                        <p style="margin: 0; padding: 8px;">${getUrgencyText(sampleData.urgency)}</p>
                    </div>
                `;
                break;
            case 'additional_info':
                emailContent += `
                    <div style="padding: 20px; background-color: #fef7ff; border-radius: 8px; margin-bottom: 20px;">
                        <h3 style="color: #a21caf; border-bottom: 2px solid #f3e8ff; padding-bottom: 10px;">${field.label}</h3>
                        <p style="line-height: 1.6; margin: 0;">${sampleData.description}</p>
                    </div>
                `;
                break;
        }
    });
    
    emailContent += `
            <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0;">⏰ การดำเนินการ</h3>
                <p style="margin: 0; font-size: 16px;">กรุณาติดต่อลูกค้าภายใน 24 ชั่วโมง</p>
            </div>
        </div>
    `;
    
    preview.innerHTML = emailContent;
}

function saveEmailSettings() {
    const emails = document.getElementById('company-emails').value;
    const subject = document.getElementById('email-subject').value;
    
    const settings = {
        company_emails: emails.split(',').map(email => email.trim()),
        email_subject: subject
    };
    
    // Here you would typically save to backend
    localStorage.setItem('emailSettings', JSON.stringify(settings));
    
    showToast('บันทึกการตั้งค่าอีเมลสำเร็จ', 'success');
}

// Settings Functions
function loadSettings() {
    // Load settings from localStorage or backend
    const settings = JSON.parse(localStorage.getItem('companySettings') || '{}');
    
    document.getElementById('company-name').value = settings.company_name || 'JLK Transservice';
    document.getElementById('company-phone').value = settings.company_phone || '02-123-4567';
    document.getElementById('business-hours').value = settings.business_hours || 'จันทร์-ศุกร์ 8:00-18:00 น.';
    document.getElementById('response-time').value = settings.response_time || '24';
}

function saveSettings() {
    const settings = {
        company_name: document.getElementById('company-name').value,
        company_phone: document.getElementById('company-phone').value,
        business_hours: document.getElementById('business-hours').value,
        response_time: document.getElementById('response-time').value
    };
    
    localStorage.setItem('companySettings', JSON.stringify(settings));
    showToast('บันทึกการตั้งค่าสำเร็จ', 'success');
}

// Utility Functions
function getStatusText(status) {
    const statusMap = {
        'pending': 'รอดำเนินการ',
        'processing': 'กำลังดำเนินการ',
        'quoted': 'ส่งใบเสนอราคาแล้ว',
        'completed': 'เสร็จสิ้น',
        'cancelled': 'ยกเลิก'
    };
    return statusMap[status] || status;
}

function getServiceTypeText(serviceType) {
    const serviceMap = {
        'export': 'บริการส่งออก',
        'import': 'บริการนำเข้า',
        'customs': 'พิธีการศุลกากร',
        'domestic': 'ขนส่งภายในประเทศ',
        'consulting': 'ที่ปรึกษาโลจิสติกส์',
        'other': 'อื่นๆ'
    };
    return serviceMap[serviceType] || serviceType;
}

function getUrgencyText(urgency) {
    const urgencyMap = {
        'standard': 'ปกติ (7-14 วัน)',
        'urgent': 'เร่งด่วน (3-7 วัน)',
        'express': 'ด่วนพิเศษ (1-3 วัน)',
        'same-day': 'ภายในวันเดียว'
    };
    return urgencyMap[urgency] || urgency || 'ไม่ระบุ';
}

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('th-TH');
}

function formatDateTime(dateString) {
    return new Date(dateString).toLocaleString('th-TH');
}

// Load saved field order on initialization
document.addEventListener('DOMContentLoaded', function() {
    const savedOrder = localStorage.getItem('emailFieldOrder');
    if (savedOrder) {
        fieldOrder = JSON.parse(savedOrder);
    }
});