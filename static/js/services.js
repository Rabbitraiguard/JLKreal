// Services page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadMainServices();
});

// Load main services data
function loadMainServices() {
    const mainServicesData = [
        {
            icon: "fas fa-ship",
            title: "บริการส่งออก",
            description: "บริการส่งออกสินค้าทางเรือและทางอากาศ พร้อมจัดการเอกสารครบถ้วน",
            details: [
                "ให้คำปรึกษาเกี่ยวกับระเบียบการส่งออก",
                "จัดทำเอกสารส่งออกครบถ้วน (Invoice, Packing List, Certificate of Origin)",
                "ประสานงานกับสายการบิน/เรือ",
                "ติดตามสถานะการขนส่งแบบเรียลไทม์",
                "จัดการประกันภัยสินค้า",
                "บริการ Door to Door"
            ],
            benefits: [
                "ลดต้นทุนการขนส่ง",
                "ประหยัดเวลา",
                "ลดความเสี่ยง",
                "เพิ่มความน่าเชื่อถือ"
            ]
        },
        {
            icon: "fas fa-plane",
            title: "บริการนำเข้า",
            description: "บริการนำเข้าสินค้าจากต่างประเทศ จัดการพิธีการศุลกากรครบวงจร",
            details: [
                "ให้คำปรึกษาระเบียบการนำเข้า",
                "ผ่านพิธีการศุลกากรขาเข้า",
                "จัดเก็บสินค้าในคลังสินค้าที่ได้มาตรฐาน",
                "ขนส่งสินค้าถึงปลายทางอย่างปลอดภัย",
                "ตรวจสอบคุณภาพและปริมาณสินค้า",
                "บริการหลังการขาย"
            ],
            benefits: [
                "การนำเข้าที่รวดเร็ว",
                "ปลอดภัยและน่าเชื่อถือ",
                "ต้นทุนที่แข่งขันได้",
                "บริการครบวงจร"
            ]
        },
        {
            icon: "fas fa-book text-white text-2xl", // เปลี่ยนเป็น icon หนังสือ
            title: "พิธีการทางศุลกากร",
            description: "ผู้เชี่ยวชาญด้านพิธีการศุลกากร จัดการเอกสารและภาษีอากรทุกประเภท",
            details: [
                "ยื่นใบขนสินค้าขาเข้า-ขาออก",
                "คำนวณภาษีอากรและค่าธรรมเนียมต่างๆ",
                "ประสานงานการตรวจปล่อยสินค้า",
                "ยื่นขอใบอนุญาตพิเศษ (License)",
                "จัดการเอกสาร FDA, สมอ., กรมประมง",
                "บริการปรึกษาด้านกฎหมายศุลกากร"
            ],
            benefits: [
                "ผ่านศุลกากรรวดเร็ว",
                "ถูกต้องตามกฎหมาย",
                "ประหยัดค่าใช้จ่าย",
                "หลีกเลี่ยงปัญหา"
            ]
        }
    ];

    const mainServicesContainer = document.getElementById('main-services-container');
    if (mainServicesContainer) {
        mainServicesContainer.innerHTML = mainServicesData.map((service, index) => `
            <div class="flex flex-col lg:flex-row items-center gap-12 ${index % 2 === 1 ? 'lg:flex-row-reverse' : ''}">
                <div class="lg:w-1/2">
                    <div class="card p-8 shadow-lg border-l-4 border-l-primary">
                        <div class="card-header p-0 mb-6">
                            <div class="flex flex-col items-center mb-4">
                                <div class="flex items-center justify-center w-24 h-24 bg-primary mb-2 rounded-lg">
                                    <i class="${service.icon} text-white text-4xl"></i>
                                </div>
                                <h3 class="card-title text-2xl mt-2">${service.title}</h3>
                            </div>
                            <p class="card-description text-lg text-center">
                                ${service.description}
                            </p>
                        </div>
                        <div class="card-content p-0">
                            <h4 class="font-semibold mb-4 text-lg">รายละเอียดบริการ:</h4>
                            <ul class="space-y-2 mb-6">
                                ${service.details.map(detail => `
                                    <li class="flex items-start">
                                        <i class="fas fa-check-circle h-5 w-5 text-primary mr-3 mt-0.5 flex-shrink-0"></i>
                                        <span>${detail}</span>
                                    </li>
                                `).join('')}
                            </ul>
                            <a href="/quote.html">
                                <button class="btn w-full lg:w-auto">
                                    ขอใบเสนอราคา
                                </button>
                            </a>
                        </div>
                    </div>
                </div>
                <div class="lg:w-1/2">
                    <div class="bg-primary/5 p-8 rounded-lg">
                        <h4 class="font-semibold mb-4 text-lg">ประโยชน์ที่คุณได้รับ:</h4>
                        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            ${service.benefits.map(benefit => `
                                <div class="flex items-center space-x-3 bg-white p-4 rounded-lg shadow-sm">
                                    <div class="w-2 h-2 bg-secondary rounded-full"></div>
                                    <span class="font-medium">${benefit}</span>
                                </div>
                            `).join('')}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

