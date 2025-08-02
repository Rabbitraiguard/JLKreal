// About page specific JavaScript

document.addEventListener('DOMContentLoaded', function() {
    loadFounders();
    loadValues();
    loadTimeline();
});

// Load founders data
function loadFounders() {
    const foundersData = [
        {
            name: "คุณภาณุ ไกรวงษ์วณิชรุ่ง",
            position: "Founder & CEO",
            experience: "15+ ปี",
            expertise: "ผู้เชี่ยวชาญด้านการส่งออก-นำเข้า กฎหมายศุลกากร กฎหมายแพ่งและพาณิชย์ กฎหมายอาญา",
            background: "จบการศึกษาที่มหาวิทยาลัยธรรศาสตร์ นิติศาสตรบัณฑิต",
            achievements: [
                "- ผู้รับอนุญาตผู้ผ่านพิธีการศุลกากร -",
                "- ผู้รับอนุญาตทนายความจากสภาทนายความ -",
                
            ]
        }
    ];

    const foundersContainer = document.getElementById('founders-container');
    if (foundersContainer) {
        foundersContainer.innerHTML = foundersData.map(founder => `
            <div class="card p-8 max-w-3xl w-full bg-gradient-to-br from-white to-gray-50 shadow-xl hover:shadow-2xl transition-all duration-500">
                <div class="card-header text-center pb-6">
                    <!-- รูปภาพผู้ก่อตั้ง -->
                    <div class="w-40 h-40 mx-auto mb-6 relative">
                        <img src="https://img5.pic.in.th/file/secure-sv1/IMG_09682.jpg" 
                             alt="${founder.name}" 
                             class="w-full h-full object-cover rounded-full border-4 border-white shadow-2xl transition-transform duration-300 hover:scale-105">
                        <div class="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-secondary/20 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                    
                    <!-- ชื่อและตำแหน่ง -->
                    <h3 class="card-title text-3xl font-bold text-gray-800 mb-2">${founder.name}</h3>
                    <p class="card-description text-lg font-medium text-primary mb-3">
                        ${founder.position}
                    </p>
                    <div class="inline-flex items-center px-4 py-2 bg-secondary/10 rounded-full text-secondary font-semibold text-sm">
                        <i class="fas fa-star mr-2"></i>
                        ประสบการณ์ ${founder.experience}
                    </div>
                </div>
                
                <div class="card-content space-y-8">
                    <!-- ความเชี่ยวชาญ -->
                    <div class="p-6 bg-primary/5 rounded-lg border-l-4 border-primary">
                        <h4 class="font-bold text-lg text-primary mb-3 flex items-center">
                            <i class="fas fa-lightbulb mr-2"></i>
                            ความเชี่ยวชาญ
                        </h4>
                        <p class="text-gray-700 leading-relaxed">${founder.expertise}</p>
                    </div>
                    
                    <!-- ประวัติการศึกษา -->
                    <div class="p-6 bg-secondary/5 rounded-lg border-l-4 border-secondary">
                        <h4 class="font-bold text-lg text-secondary mb-3 flex items-center">
                            <i class="fas fa-graduation-cap mr-2"></i>
                            ประวัติการศึกษาและประสบการณ์
                        </h4>
                        <p class="text-gray-700 leading-relaxed">
                            ${founder.background}
                        </p>
                    </div>

                    <!-- รางวัลและความสำเร็จ -->
                    <div class="p-6 bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg border-l-4 border-yellow-500">
                        <h4 class="font-bold text-lg text-yellow-700 mb-4 flex items-center">
                            <i class="fas fa-trophy mr-2"></i>
                            รางวัลและความสำเร็จ
                        </h4>
                        <ul class="space-y-3">
                            ${founder.achievements.map(achievement => `
                                <li class="flex items-start text-gray-700">
                                    <div class="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                        <i class="fas fa-award text-white text-xs"></i>
                                    </div>
                                    <span class="leading-relaxed">${achievement}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Load company values
function loadValues() {
    const valuesData = [
        {
            icon: "fas fa-bullseye",
            title: "ความแม่นยำ",
            description: "ให้ความสำคัญกับความแม่นยำในทุกขั้นตอน เพื่อให้ลูกค้าได้รับบริการที่ดีที่สุด"
        },
        {
            icon: "fas fa-heart",
            title: "ใส่ใจลูกค้า",
            description: "มุ่งมั่นในการให้บริการที่เกินความคาดหวัง และสร้างความพึงพอใจสูงสุดให้กับลูกค้า"
        },
        {
            icon: "fas fa-award",
            title: "มืออาชีพ",
            description: "ทีมงานที่มีความเชี่ยวชาญและประสบการณ์สูง พร้อมให้คำปรึกษาในทุกด้าน"
        },
        {
            icon: "fas fa-clock",
            title: "ตรงเวลา",
            description: "ให้ความสำคัญกับการส่งมอบตามเวลาที่กำหนด เพื่อสร้างความเชื่อมั่นให้กับลูกค้า"
        }
    ];

    const valuesContainer = document.getElementById('values-container');
    if (valuesContainer) {
        valuesContainer.innerHTML = valuesData.map(value => `
            <div class="card text-center p-6 hover:shadow-lg transition-all duration-300">
                <div class="card-header pb-4">
                    <!-- ไอคอนค่านิยม -->
                    <div class="mx-auto p-4 bg-primary/10 rounded-full w-fit">
                        <i class="${value.icon} h-8 w-8 text-primary text-2xl"></i>
                    </div>
                    <h3 class="card-title text-xl">${value.title}</h3>
                </div>
                <div class="card-content">
                    <p class="text-muted-foreground text-sm leading-relaxed">
                        ${value.description}
                    </p>
                </div>
            </div>
        `).join('');
    }
}


    const timelineContainer = document.getElementById('timeline-container');
    if (timelineContainer) {
        timelineContainer.innerHTML = `
            <!-- เส้นเวลากลาง -->
            <div class="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-primary/20"></div>
            
            <div class="space-y-12">
                ${timelineData.map((milestone, index) => `
                    <div class="flex items-center ${index % 2 === 0 ? 'justify-start' : 'justify-end'}">
                        <!-- การ์ดเหตุการณ์ -->
                        <div class="w-5/12 ${index % 2 === 0 ? 'text-right pr-8' : 'text-left pl-8'}">
                            <div class="card p-6">
                                <div class="text-2xl font-bold text-primary mb-2">${milestone.year}</div>
                                <p class="text-muted-foreground">${milestone.event}</p>
                            </div>
                        </div>
                        
                        <!-- จุดบนเส้นเวลา -->
                        <div class="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full border-4 border-background"></div>
                    </div>
                `).join('')}
            </div>
        `;
    }