#!/usr/bin/env python3
"""
JLK Transservice - Python Flask Backend
บริการโลจิสติกส์ระดับมืออาชีพ

This is the main Python backend application that handles:
- Quote form submissions
- Contact form processing
- Data storage and retrieval
- API endpoints for the frontend
- Email notifications with improved formatting
- Image upload and hosting
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
import json
import datetime
import os
import logging
import smtplib
import uuid
import base64
from email.mime.text import MimeText
from email.mime.multipart import MimeMultipart
from email.mime.image import MimeImage
from email.utils import formataddr
import requests
import mimetypes


# Initialize Flask application
app = Flask(__name__, static_folder='static', template_folder='.')
CORS(app)  # Enable CORS for all routes

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database configuration
DATABASE = 'jlktran.db'

# Email configuration
EMAIL_CONFIG = {
    'smtp_server': 'smtp.gmail.com',
    'smtp_port': 587,
    'email': os.environ.get('EMAIL_ADDRESS', 'jlktransservice@gmail.com'),
    'password': os.environ.get('EMAIL_PASSWORD', ''),  # Use app password for Gmail
    'from_name': 'JLK Transservice'
}

# Image hosting configuration (using a simple service like imgbb or similar)
IMAGE_UPLOAD_CONFIG = {
    'max_size': 5 * 1024 * 1024,  # 5MB
    'allowed_extensions': {'png', 'jpg', 'jpeg', 'gif', 'webp'},
    'upload_dir': 'static/uploads'
}

# Ensure upload directory exists
os.makedirs(IMAGE_UPLOAD_CONFIG['upload_dir'], exist_ok=True)

def init_database():
    """Initialize the SQLite database with required tables"""
    conn = sqlite3.connect(DATABASE)
    cursor = conn.cursor()
    
    # Create quotes table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS quotes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            company_name TEXT NOT NULL,
            contact_name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            service_type TEXT NOT NULL,
            origin TEXT,
            destination TEXT,
            cargo_type TEXT,
            weight TEXT,
            dimensions TEXT,
            urgency TEXT,
            additional_services TEXT,
            description TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'pending'
        )
    ''')
    
    # Create contacts table for contact form submissions
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS contacts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            status TEXT DEFAULT 'new'
        )
    ''')
    
    conn.commit()
    conn.close()

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in IMAGE_UPLOAD_CONFIG['allowed_extensions']

def save_uploaded_image(file):
    """Save uploaded image and return URL"""
    if file and allowed_file(file.filename):
        # Generate unique filename
        file_extension = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{file_extension}"
        file_path = os.path.join(IMAGE_UPLOAD_CONFIG['upload_dir'], unique_filename)
        
        # Save file
        file.save(file_path)
        
        # Return URL for accessing the image
        return f"/static/uploads/{unique_filename}"
    return None

def format_quote_email(data, image_url=None):
    """Format quote data into a nice HTML email"""
    html_template = """
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background-color: #f5f5f5; }
            .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); overflow: hidden; }
            .header { background: linear-gradient(135deg, #1e3a8a, #3b82f6); color: white; padding: 30px; text-align: center; }
            .header h1 { margin: 0; font-size: 24px; }
            .header p { margin: 10px 0 0 0; opacity: 0.9; }
            .content { padding: 30px; }
            .section { margin-bottom: 25px; }
            .section h2 { color: #1e3a8a; border-bottom: 2px solid #3b82f6; padding-bottom: 5px; margin-bottom: 15px; font-size: 18px; }
            .field { margin-bottom: 12px; }
            .field-label { font-weight: bold; color: #555; margin-bottom: 5px; }
            .field-value { background: #f8f9ff; padding: 8px 12px; border-radius: 5px; border-left: 3px solid #3b82f6; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
            .image-section { text-align: center; margin: 20px 0; }
            .image-section img { max-width: 100%; height: auto; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
            .footer { background: #f1f5f9; padding: 20px; text-align: center; color: #666; font-size: 14px; }
            .urgent { background: #fef3c7; border-left-color: #f59e0b; }
            .important { background: #fecaca; border-left-color: #ef4444; }
            @media (max-width: 600px) {
                .grid { grid-template-columns: 1fr; }
                .container { margin: 10px; }
                .header, .content { padding: 20px; }
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🚛 คำขอใบเสนอราคาใหม่</h1>
                <p>JLK Transservice - บริการโลจิสติกส์มืออาชีพ</p>
            </div>
            
            <div class="content">
                <div class="section">
                    <h2>📋 ข้อมูลผู้ติดต่อ</h2>
                    <div class="grid">
                        <div class="field">
                            <div class="field-label">🏢 ชื่อบริษัท</div>
                            <div class="field-value">{company_name}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">👤 ชื่อผู้ติดต่อ</div>
                            <div class="field-value">{contact_name}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">✉️ อีเมล</div>
                            <div class="field-value"><a href="mailto:{email}">{email}</a></div>
                        </div>
                        <div class="field">
                            <div class="field-label">📞 เบอร์โทรศัพท์</div>
                            <div class="field-value"><a href="tel:{phone}">{phone}</a></div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>🚚 ข้อมูลบริการ</h2>
                    <div class="grid">
                        <div class="field">
                            <div class="field-label">🎯 ประเภทบริการ</div>
                            <div class="field-value">{service_type_text}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">⚡ ความเร่งด่วน</div>
                            <div class="field-value {urgency_class}">{urgency_text}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">📍 จุดต้นทาง</div>
                            <div class="field-value">{origin}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">📍 จุดปลายทาง</div>
                            <div class="field-value">{destination}</div>
                        </div>
                    </div>
                </div>

                <div class="section">
                    <h2>📦 ข้อมูลสินค้า</h2>
                    <div class="grid">
                        <div class="field">
                            <div class="field-label">📋 ประเภทสินค้า</div>
                            <div class="field-value">{cargo_type}</div>
                        </div>
                        <div class="field">
                            <div class="field-label">⚖️ น้ำหนัก</div>
                            <div class="field-value">{weight}</div>
                        </div>
                    </div>
                    <div class="field">
                        <div class="field-label">📏 ขนาด</div>
                        <div class="field-value">{dimensions}</div>
                    </div>
                </div>

                {additional_services_section}

                {image_section}

                {description_section}
            </div>

            <div class="footer">
                <p><strong>JLK Transservice</strong> - บริการโลจิสติกส์ นำเข้า-ส่งออก และพิธีการทางศุลกากร</p>
                <p>📧 jlktransservice@gmail.com | 📱 ติดต่อกลับภายใน 24 ชั่วโมง</p>
                <p><em>วันที่ส่งคำขอ: {date_time}</em></p>
            </div>
        </div>
    </body>
    </html>
    """

    # Service type mapping
    service_types = {
        'export': '📤 บริการส่งออก',
        'import': '📥 บริการนำเข้า', 
        'customs': '🏛️ พิธีการศุลกากร',
        'domestic': '🚛 ขนส่งภายในประเทศ',
        'consulting': '💼 ที่ปรึกษาโลจิสติกส์',
        'other': '🔄 อื่นๆ'
    }

    # Urgency mapping and classes
    urgency_types = {
        'standard': 'ปกติ (7-14 วัน)',
        'urgent': 'เร่งด่วน (3-7 วัน)',
        'express': 'ด่วนพิเศษ (1-3 วัน)',
        'same-day': 'ภายในวันเดียว'
    }

    urgency_classes = {
        'express': 'important',
        'same-day': 'important',
        'urgent': 'urgent'
    }

    # Additional services section
    additional_services_section = ""
    if data.get('additionalServices'):
        services_list = json.loads(data.get('additionalServices', '[]'))
        if services_list:
            services_html = "<ul>" + "".join([f"<li>{service}</li>" for service in services_list]) + "</ul>"
            additional_services_section = f"""
                <div class="section">
                    <h2>➕ บริการเพิ่มเติม</h2>
                    <div class="field">
                        <div class="field-value">{services_html}</div>
                    </div>
                </div>
            """

    # Image section
    image_section = ""
    if image_url:
        image_section = f"""
            <div class="section">
                <h2>🖼️ รูปภาพประกอบ</h2>
                <div class="image-section">
                    <img src="{request.url_root.rstrip('/')}{image_url}" alt="รูปภาพประกอบคำขอใบเสนอราคา" />
                    <p style="margin-top: 10px; color: #666; font-size: 14px;">
                        <a href="{request.url_root.rstrip('/')}{image_url}" target="_blank">ดูรูปภาพขนาดเต็ม</a>
                    </p>
                </div>
            </div>
        """

    # Description section
    description_section = ""
    if data.get('description'):
        description_section = f"""
            <div class="section">
                <h2>💬 รายละเอียดเพิ่มเติม</h2>
                <div class="field">
                    <div class="field-value">{data.get('description', '').replace('\n', '<br>')}</div>
                </div>
            </div>
        """

    return html_template.format(
        company_name=data.get('companyName', '-'),
        contact_name=data.get('contactName', '-'),
        email=data.get('email', '-'),
        phone=data.get('phone', '-'),
        service_type_text=service_types.get(data.get('serviceType', ''), data.get('serviceType', '-')),
        urgency_text=urgency_types.get(data.get('urgency', ''), data.get('urgency', '-') if data.get('urgency') else 'ไม่ระบุ'),
        urgency_class=urgency_classes.get(data.get('urgency', ''), ''),
        origin=data.get('origin', 'ไม่ระบุ'),
        destination=data.get('destination', 'ไม่ระบุ'),
        cargo_type=data.get('cargoType', 'ไม่ระบุ'),
        weight=f"{data.get('weight', 'ไม่ระบุ')} กก." if data.get('weight') else 'ไม่ระบุ',
        dimensions=f"{data.get('dimensions', 'ไม่ระบุ')} ซม." if data.get('dimensions') else 'ไม่ระบุ',
        additional_services_section=additional_services_section,
        image_section=image_section,
        description_section=description_section,
        date_time=datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')
    )

def send_quote_email(data, image_url=None):
    """Send formatted quote email"""
    try:
        # Create message
        msg = MimeMultipart('alternative')
        msg['Subject'] = f"คำขอใบเสนอราคา - {data.get('companyName', 'Unknown')} | JLK Transservice"
        msg['From'] = formataddr((EMAIL_CONFIG['from_name'], EMAIL_CONFIG['email']))
        msg['To'] = EMAIL_CONFIG['email']
        msg['Reply-To'] = data.get('email', '')

        # Create HTML content
        html_content = format_quote_email(data, image_url)
        html_part = MimeText(html_content, 'html', 'utf-8')
        msg.attach(html_part)

        # Send email
        if EMAIL_CONFIG['password']:  # Only send if password is configured
            with smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port']) as server:
                server.starttls()
                server.login(EMAIL_CONFIG['email'], EMAIL_CONFIG['password'])
                server.send_message(msg)
            return True
        else:
            logger.warning("Email password not configured, skipping email send")
            return False
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        return False

@app.route('/')
def index():
    """Serve the main index page"""
    return render_template('index.html')

@app.route('/<path:filename>')
def serve_pages(filename):
    """Serve HTML pages"""
    if filename.endswith('.html'):
        return render_template(filename)
    return send_from_directory('.', filename)

@app.route('/static/<path:filename>')
def serve_static(filename):
    """Serve static files"""
    return send_from_directory('static', filename)

@app.route('/api/quote', methods=['POST'])
def submit_quote():
    """Handle quote form submission with image upload and improved email formatting"""
    try:
        # Handle both JSON and form data
        if request.content_type and 'application/json' in request.content_type:
            data = request.get_json()
            image_file = None
        else:
            # Form data with possible file upload
            data = request.form.to_dict()
            image_file = request.files.get('attachment')
        
        # Validate required fields
        required_fields = ['companyName', 'contactName', 'email', 'phone', 'serviceType']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'กรุณากรอก {field} ให้ครบถ้วน'
                }), 400
        
        # Handle image upload
        image_url = None
        if image_file and image_file.filename:
            # Validate file size
            image_file.seek(0, 2)  # Seek to end
            file_size = image_file.tell()
            image_file.seek(0)  # Reset to beginning
            
            if file_size > IMAGE_UPLOAD_CONFIG['max_size']:
                return jsonify({
                    'success': False,
                    'message': 'ไฟล์รูปภาพใหญ่เกินไป (สูงสุด 5MB)'
                }), 400
            
            if not allowed_file(image_file.filename):
                return jsonify({
                    'success': False,
                    'message': 'รูปแบบไฟล์ไม่ถูกต้อง (รองรับเฉพาะ jpg, png, gif, webp)'
                }), 400
            
            # Save image
            image_url = save_uploaded_image(image_file)
        
        # Convert additional services list to JSON string
        additional_services = data.get('additionalServices', [])
        if isinstance(additional_services, str):
            try:
                additional_services = json.loads(additional_services)
            except:
                additional_services = []
        additional_services_json = json.dumps(additional_services)
        
        # Insert into database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO quotes (
                company_name, contact_name, email, phone, service_type,
                origin, destination, cargo_type, weight, dimensions,
                urgency, additional_services, description
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        ''', (
            data['companyName'],
            data['contactName'],
            data['email'],
            data['phone'],
            data['serviceType'],
            data.get('origin', ''),
            data.get('destination', ''),
            data.get('cargoType', ''),
            data.get('weight', ''),
            data.get('dimensions', ''),
            data.get('urgency', ''),
            additional_services_json,
            data.get('description', '')
        ))
        
        quote_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        # Send formatted email
        email_sent = send_quote_email(data, image_url)
        
        response_message = 'ส่งคำขอใบเสนอราคาสำเร็จ'
        if not email_sent:
            response_message += ' (บันทึกข้อมูลแล้ว แต่ไม่สามารถส่งอีเมลได้)'
        
        return jsonify({
            'success': True,
            'message': response_message,
            'quote_id': quote_id,
            'image_url': image_url
        })
        
    except Exception as e:
        logger.error(f"Error submitting quote: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'เกิดข้อผิดพลาดในการส่งข้อมูล'
        }), 500

@app.route('/api/contact', methods=['POST'])
def submit_contact():
    """Handle contact form submission - saves to database"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['name', 'email', 'message']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'กรุณากรอก {field} ให้ครบถ้วน'
                }), 400
        
        # Insert into database
        conn = sqlite3.connect(DATABASE)
        cursor = conn.cursor()
        
        cursor.execute('''
            INSERT INTO contacts (name, email, subject, message)
            VALUES (?, ?, ?, ?)
        ''', (
            data['name'],
            data['email'],
            data.get('subject', ''),
            data['message']
        ))
        
        contact_id = cursor.lastrowid
        conn.commit()
        conn.close()
        
        return jsonify({
            'success': True,
            'message': 'ส่งข้อความสำเร็จ',
            'contact_id': contact_id
        })
        
    except Exception as e:
        logger.error(f"Error submitting contact: {str(e)}")
        return jsonify({
            'success': False,
            'message': 'เกิดข้อผิดพลาดในการส่งข้อมูล'
        }), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.datetime.now().isoformat(),
        'service': 'JLK Transservice Backend'
    })

@app.errorhandler(404)
def not_found(error):
    """Handle 404 errors"""
    return render_template('404.html'), 404

@app.errorhandler(500)
def internal_error(error):
    """Handle 500 errors"""
    logger.error(f"Internal server error: {str(error)}")
    return jsonify({
        'success': False,
        'message': 'เกิดข้อผิดพลาดภายในเซิร์ฟเวอร์'
    }), 500

if __name__ == '__main__':
    # Initialize database
    init_database()
    
    # Start the Flask development server
    print("🚀 Starting JLK Transservice Backend Server...")
    print("📋 Available endpoints:")
    print("   - Homepage: http://localhost:5000/")
    print("   - Services: http://localhost:5000/services.html")
    print("   - About: http://localhost:5000/about.html")
    print("   - Quote: http://localhost:5000/quote.html")
    print("   - Contact: http://localhost:5000/contact.html")
    print("   - API Health: http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
