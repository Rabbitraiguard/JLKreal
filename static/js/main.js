// Main JavaScript file for JLK Transservice website

// Global variables
let currentPage = window.location.pathname;
let isMobile = window.innerWidth <= 768;
let isTouch = 'ontouchstart' in window;

// Initialize the application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadPageContent();
    setupMobileMenu();
    setupMobileInteractions();
    setupResponsiveHandlers();
});

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    if (wasMobile !== isMobile) {
        handleResponsiveChange();
    }
});

// Initialize navigation and set active states
function initializeNavigation() {
    loadNavbar();
    setActiveNavItem();
}

// Load navbar into containers
function loadNavbar() {
    const navbarHTML = `
        <nav class="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b sticky top-0 z-50">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex justify-between h-16">
                    <!-- โลโก้บริษัท -->
                    <div class="flex items-center">
                        <a href="index.html" class="flex items-center space-x-2">
                            <i class="fas fa-box h-8 w-8 text-primary text-2xl"></i>
                            <span class="font-bold text-xl text-primary">JLK Transservice</span>
                        </a>
                    </div>

                    <!-- เมนูสำหรับคอมพิวเตอร์ -->
                    <div class="hidden md:flex items-center space-x-8">
                        <a href="index.html" class="nav-link flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                            <i class="fas fa-home h-4 w-4"></i>
                            <span>หน้าแรก</span>
                        </a>
                        <a href="services.html" class="nav-link flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                            <i class="fas fa-truck h-4 w-4"></i>
                            <span>บริการ</span>
                        </a>
                        <a href="about.html" class="nav-link flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                            <i class="fas fa-user h-4 w-4"></i>
                            <span>เกี่ยวกับเรา</span>
                        </a>
                        <a href="quote.html" class="nav-link flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                            <i class="fas fa-file-text h-4 w-4"></i>
                            <span>ขอใบเสนอราคา</span>
                        </a>
                        <a href="contact.html" class="nav-link flex items-center space-x-1 px-3 py-2 text-sm font-medium transition-colors hover:text-primary">
                            <i class="fas fa-phone h-4 w-4"></i>
                            <span>ติดต่อเรา</span>
                        </a>
                        
                        <!-- ปุ่มขอใบเสนอราคา -->
                        <a href="quote.html">
                            <button class="btn btn-secondary">
                                ขอใบเสนอราคา
                            </button>
                        </a>
                    </div>

                    <!-- ปุ่มเมนูมือถือ -->
                    <div class="md:hidden flex items-center">
                        <button id="mobile-menu-button" class="btn btn-ghost" aria-label="เปิดเมนู" aria-expanded="false">
                            <i id="menu-icon" class="fas fa-bars h-6 w-6"></i>
                        </button>
                    </div>
                </div>

                <!-- เมนูสำหรับมือถือ -->
                <div id="mobile-menu" class="md:hidden hidden" role="menu">
                    <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-background border-t">
                        <a href="index.html" class="mobile-nav-link flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors" role="menuitem">
                            <i class="fas fa-home h-5 w-5"></i>
                            <span>หน้าแรก</span>
                        </a>
                        <a href="services.html" class="mobile-nav-link flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors" role="menuitem">
                            <i class="fas fa-truck h-5 w-5"></i>
                            <span>บริการ</span>
                        </a>
                        <a href="about.html" class="mobile-nav-link flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors" role="menuitem">
                            <i class="fas fa-user h-5 w-5"></i>
                            <span>เกี่ยวกับเรา</span>
                        </a>
                        <a href="quote.html" class="mobile-nav-link flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors" role="menuitem">
                            <i class="fas fa-file-text h-5 w-5"></i>
                            <span>ขอใบเสนอราคา</span>
                        </a>
                        <a href="contact.html" class="mobile-nav-link flex items-center space-x-2 px-3 py-2 text-base font-medium transition-colors" role="menuitem">
                            <i class="fas fa-phone h-5 w-5"></i>
                            <span>ติดต่อเรา</span>
                        </a>
                        
                        <!-- ปุ่มขอใบเสนอราคาสำหรับมือถือ -->
                        <a href="quote.html">
                            <button class="btn btn-secondary w-full mt-4">
                                ขอใบเสนอราคา
                            </button>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    `;

    const navbarContainer = document.getElementById('navbar-container');
    if (navbarContainer) {
        navbarContainer.innerHTML = navbarHTML;
        setupMobileMenu();
    }
}

// Set active navigation item based on current page
function setActiveNavItem() {
    const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if ((currentPage === '/' || currentPage === '/index.html' || currentPage.endsWith('index.html')) && (href === '/' || href === 'index.html')) {
            link.classList.add('active');
        } else if (currentPage.includes(href) && href !== '/' && href !== 'index.html') {
            link.classList.add('active');
        }
    });
}

// Enhanced mobile menu setup with better touch interactions
function setupMobileMenu() {
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileMenuButton && mobileMenu && menuIcon) {
        // Remove existing event listeners to prevent duplicates
        mobileMenuButton.removeEventListener('click', handleMobileMenuToggle);
        
        // Add click event listener
        mobileMenuButton.addEventListener('click', handleMobileMenuToggle);
        
        // Add touch event listeners for better mobile experience
        if (isTouch) {
            mobileMenuButton.addEventListener('touchstart', function(e) {
                e.preventDefault();
                handleMobileMenuToggle();
            }, { passive: false });
        }
        
        // Close mobile menu when clicking outside
        document.addEventListener('click', function(e) {
            if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
                closeMobileMenu();
            }
        });
        
        // Close mobile menu when clicking on a nav link
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(closeMobileMenu, 100); // Small delay for better UX
            });
        });
    }
}

// Handle mobile menu toggle
function handleMobileMenuToggle() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && menuIcon && mobileMenuButton) {
        const isHidden = mobileMenu.classList.contains('hidden');
        
        if (isHidden) {
            openMobileMenu();
        } else {
            closeMobileMenu();
        }
    }
}

// Open mobile menu
function openMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && menuIcon && mobileMenuButton) {
        mobileMenu.classList.remove('hidden');
        menuIcon.classList.remove('fa-bars');
        menuIcon.classList.add('fa-times');
        mobileMenuButton.setAttribute('aria-expanded', 'true');
        mobileMenuButton.setAttribute('aria-label', 'ปิดเมนู');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = 'hidden';
    }
}

// Close mobile menu
function closeMobileMenu() {
    const mobileMenu = document.getElementById('mobile-menu');
    const menuIcon = document.getElementById('menu-icon');
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    
    if (mobileMenu && menuIcon && mobileMenuButton) {
        mobileMenu.classList.add('hidden');
        menuIcon.classList.remove('fa-times');
        menuIcon.classList.add('fa-bars');
        mobileMenuButton.setAttribute('aria-expanded', 'false');
        mobileMenuButton.setAttribute('aria-label', 'เปิดเมนู');
        
        // Restore body scroll
        document.body.style.overflow = '';
    }
}

// Setup mobile-specific interactions
function setupMobileInteractions() {
    // Add touch feedback to buttons
    const buttons = document.querySelectorAll('.btn');
    buttons.forEach(button => {
        if (isTouch) {
            button.addEventListener('touchstart', function() {
                this.style.transform = 'scale(0.98)';
            });
            
            button.addEventListener('touchend', function() {
                setTimeout(() => {
                    this.style.transform = '';
                }, 100);
            });
        }
    });
    
    // Improve form interactions on mobile
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        // Add focus styles for better mobile UX
        input.addEventListener('focus', function() {
            this.style.borderColor = 'hsl(var(--primary))';
            this.style.boxShadow = '0 0 0 3px hsl(var(--primary) / 0.1)';
        });
        
        input.addEventListener('blur', function() {
            this.style.borderColor = '';
            this.style.boxShadow = '';
        });
        
        // Prevent zoom on iOS for certain input types
        if (input.type === 'email' || input.type === 'tel' || input.type === 'number') {
            input.style.fontSize = '16px';
        }
    });
    
    // Add swipe gesture support for mobile menu
    if (isTouch) {
        let touchStartX = 0;
        let touchEndX = 0;
        
        document.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        });
        
        document.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipeGesture();
        });
        
        function handleSwipeGesture() {
            const swipeThreshold = 50;
            const swipeDistance = touchEndX - touchStartX;
            
            // Swipe from left edge to open menu
            if (touchStartX < 50 && swipeDistance > swipeThreshold) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && mobileMenu.classList.contains('hidden')) {
                    openMobileMenu();
                }
            }
            
            // Swipe right to close menu
            if (swipeDistance > swipeThreshold) {
                const mobileMenu = document.getElementById('mobile-menu');
                if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
                    closeMobileMenu();
                }
            }
        }
    }
}

// Setup responsive handlers
function setupResponsiveHandlers() {
    // Handle orientation change
    window.addEventListener('orientationchange', function() {
        setTimeout(function() {
            // Close mobile menu on orientation change
            closeMobileMenu();
            
            // Trigger resize event
            window.dispatchEvent(new Event('resize'));
        }, 100);
    });
    
    // Handle responsive images
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        img.style.maxWidth = '100%';
        img.style.height = 'auto';
    });
    
    // Setup intersection observer for animations on mobile
    if ('IntersectionObserver' in window) {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Observe cards and sections for mobile animations
        const animateElements = document.querySelectorAll('.card, .service-card, section');
        animateElements.forEach(element => {
            observer.observe(element);
        });
    }
}

// Handle responsive changes
function handleResponsiveChange() {
    // Close mobile menu when switching to desktop
    if (!isMobile) {
        closeMobileMenu();
    }
    
    // Re-setup mobile interactions
    setupMobileInteractions();
}

// Load page-specific content
function loadPageContent() {
    loadFooter();
}

// Load footer into all pages
function loadFooter() {
    const footerHTML = `
        <footer class="bg-primary text-white py-16">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <!-- Company Info -->
                    <div class="col-span-1 md:col-span-2">
                        <div class="flex items-center space-x-2 mb-4">
                            <i class="fas fa-box h-8 w-8 text-secondary text-2xl"></i>
                            <span class="font-bold text-xl">JLK Transservice</span>
                        </div>
                        <p class="text-white/80 mb-4">
                            ผู้เชี่ยวชาญด้านโลจิสติกส์ในประเทศไทย ให้บริการส่งออก นำเข้า และพิธีการศุลกากร
                            ด้วยประสบการณ์กว่า 10 ปี
                        </p>
                    </div>
                    
                    <!-- Quick Links -->
                    <div>
                        <h3 class="font-semibold mb-4">เมนูหลัก</h3>
                        <ul class="space-y-2">
                            <li><a href="index.html" class="text-white/80 hover:text-secondary transition-colors">หน้าแรก</a></li>
                            <li><a href="services.html" class="text-white/80 hover:text-secondary transition-colors">บริการ</a></li>
                            <li><a href="about.html" class="text-white/80 hover:text-secondary transition-colors">เกี่ยวกับเรา</a></li>
                            <li><a href="quote.html" class="text-white/80 hover:text-secondary transition-colors">ขอใบเสนอราคา</a></li>
                        </ul>
                    </div>
                    
                    <!-- Contact Info -->
                    <div>
                        <h3 class="font-semibold mb-4">ติดต่อเรา</h3>
                        <ul class="space-y-2 text-white/80">
                            <li class="flex items-center">
                                <i class="fas fa-phone h-4 w-4 mr-2"></i>
                                <a href="tel:0868889745" class="hover:text-secondary transition-colors">0868889745</a>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-envelope h-4 w-4 mr-2"></i>
                                <a href="mailto:jlktransservice@gmail.com" class="hover:text-secondary transition-colors">jlktransservice@gmail.com</a>
                            </li>
                            <li class="flex items-start">
                                <i class="fas fa-map-marker-alt h-4 w-4 mr-2 mt-1"></i>
                                <span>1589/137 หมู่ที่ 10 ตำบลสำโรงเหนือ<br>อำเภอเมืองสมุทรปราการ จ.สมุทรปราการ 10270</span>
                            </li>
                            <li class="flex items-center">
                                <i class="fas fa-clock h-4 w-4 mr-2"></i>
                                <span>จันทร์-ศุกร์ 9:00-18:00</span>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div class="border-t border-white/20 mt-12 pt-8 text-center">
                    <p class="text-white/60">
                        © 2024 JLK Transservice. สงวนลิขสิทธิ์ทุกประการ.
                    </p>
                </div>
            </div>
        </footer>
    `;

    // Check if footer already exists to prevent duplication
    let existingFooter = document.querySelector('footer');
    if (!existingFooter) {
        document.body.insertAdjacentHTML('beforeend', footerHTML);
    }
}

// Utility functions for mobile
function isMobileDevice() {
    return window.innerWidth <= 768;
}

function isTouchDevice() {
    return 'ontouchstart' in window;
}

// Toast notification system
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type === 'success' ? 'toast-success' : 'toast-error'}`;
    toast.innerHTML = `
        <div class="flex items-center justify-between">
            <div class="flex items-center">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'} mr-2"></i>
                <span>${message}</span>
            </div>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-4">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (toast.parentElement) {
            toast.remove();
        }
    }, 5000);
}

// Contact modal functionality
function showContactModal() {
    showToast('กรุณาติดต่อเราที่ 0868889745 หรือ jlktransservice@gmail.com', 'success');
}

// Form validation helpers
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validatePhone(phone) {
    const re = /^[0-9]{8,10}$/;
    return re.test(phone.replace(/[-\s]/g, ''));
}

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle navigation clicks - removed custom routing for static HTML files
// Navigation now works with standard HTML links

// Export functions for global use
window.showToast = showToast;
window.showContactModal = showContactModal;
window.validateEmail = validateEmail;
window.validatePhone = validatePhone;

// Add CSS animation class for mobile
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
document.head.appendChild(style);