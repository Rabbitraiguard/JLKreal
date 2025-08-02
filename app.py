#!/usr/bin/env python3
"""
JLK Transservice - Python Flask Backend
บริการโลจิสติกส์ระดับมืออาชีพ

This is the main Python backend application that handles:
- Quote form submissions
- Contact form processing
- Email notifications
- Data storage and retrieval
- API endpoints for the frontend
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
import smtplib
from email.mime.text import MIMEText as MimeText
from email.mime.multipart import MIMEMultipart as MimeMultipart
import json
import datetime
import os
import logging


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
    'username': 'jlktransservice@gmail.com',  # Main company email
    'password': 'beqt ktlo lqje qpgj',  # App password
    'from_email': 'jlktransservice@gmail.com',
    'company_emails': ['jlktransservice@gmail.com']  # Target email
}

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
    

    
    conn.commit()
    conn.close()

def send_email(to_email, subject, body_html, body_text=None):
    """Send email notification"""
    try:
        msg = MimeMultipart('alternative')
        msg['Subject'] = subject
        msg['From'] = EMAIL_CONFIG['from_email']
        msg['To'] = to_email
        
        # Add text and HTML parts
        if body_text:
            text_part = MimeText(body_text, 'plain', 'utf-8')
            msg.attach(text_part)
        
        html_part = MimeText(body_html, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Send email
        server = smtplib.SMTP(EMAIL_CONFIG['smtp_server'], EMAIL_CONFIG['smtp_port'])
        server.starttls()
        server.login(EMAIL_CONFIG['username'], EMAIL_CONFIG['password'])
        server.send_message(msg)
        server.quit()
        
        return True
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
    """Handle quote form submission"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['companyName', 'contactName', 'email', 'phone', 'serviceType']
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'success': False,
                    'message': f'กรุณากรอก {field} ให้ครบถ้วน'
                }), 400
        
        # Convert additional services list to JSON string
        additional_services = json.dumps(data.get('additionalServices', []))
        
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
            additional_services,
            data.get('description', '')
        ))
        
        quote_id = cursor.lastrowid
        conn.commit()
        conn.close()
        

        
        # Send notification to company emails
        company_email_html = f'''
        <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto;">
            <div style="background-color: #1e40af; color: white; padding: 20px; text-align: center; margin-bottom: 20px;">
                <h1>JLK Transservice</h1>
                <h2>คำขอใบเสนอราคาใหม่ #{quote_id:06d}</h2>
                <p style="margin: 0; opacity: 0.9;">วันที่: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
            </div>
            
            <div style="padding: 20px; background-color: #f8fafc; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #1e40af; border-bottom: 2px solid #e5e7eb; padding-bottom: 10px;">📋 ข้อมูลลูกค้า</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 150px;">บริษัท:</td><td style="padding: 8px;">{data['companyName']}</td></tr>
                    <tr style="background-color: #f1f5f9;"><td style="padding: 8px; font-weight: bold;">ผู้ติดต่อ:</td><td style="padding: 8px;">{data['contactName']}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">อีเมล:</td><td style="padding: 8px;"><a href="mailto:{data['email']}">{data['email']}</a></td></tr>
                    <tr style="background-color: #f1f5f9;"><td style="padding: 8px; font-weight: bold;">โทรศัพท์:</td><td style="padding: 8px;"><a href="tel:{data['phone']}">{data['phone']}</a></td></tr>
                </table>
            </div>
            
            <div style="padding: 20px; background-color: #fff7ed; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #ea580c; border-bottom: 2px solid #fed7aa; padding-bottom: 10px;">🚚 รายละเอียดบริการ</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ประเภทบริการ:</td><td style="padding: 8px;">{data['serviceType']}</td></tr>
                    <tr style="background-color: #fef3e2;"><td style="padding: 8px; font-weight: bold;">จุดต้นทาง:</td><td style="padding: 8px;">{data.get('origin', 'ไม่ระบุ')}</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">จุดปลายทาง:</td><td style="padding: 8px;">{data.get('destination', 'ไม่ระบุ')}</td></tr>
                    <tr style="background-color: #fef3e2;"><td style="padding: 8px; font-weight: bold;">ความเร่งด่วน:</td><td style="padding: 8px;">{data.get('urgency', 'ไม่ระบุ')}</td></tr>
                </table>
            </div>
            
            <div style="padding: 20px; background-color: #f0fdf4; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #16a34a; border-bottom: 2px solid #bbf7d0; padding-bottom: 10px;">📦 ข้อมูลสินค้า</h3>
                <table style="width: 100%; border-collapse: collapse;">
                    <tr><td style="padding: 8px; font-weight: bold; width: 150px;">ประเภทสินค้า:</td><td style="padding: 8px;">{data.get('cargoType', 'ไม่ระบุ')}</td></tr>
                    <tr style="background-color: #ecfdf5;"><td style="padding: 8px; font-weight: bold;">น้ำหนัก:</td><td style="padding: 8px;">{data.get('weight', 'ไม่ระบุ')} กก.</td></tr>
                    <tr><td style="padding: 8px; font-weight: bold;">ขนาด:</td><td style="padding: 8px;">{data.get('dimensions', 'ไม่ระบุ')} ซม.</td></tr>
                </table>
            </div>
            
            {f'<div style="padding: 20px; background-color: #fef7ff; border-radius: 8px; margin-bottom: 20px;"><h3 style="color: #a21caf; border-bottom: 2px solid #f3e8ff; padding-bottom: 10px;">📝 รายละเอียดเพิ่มเติม</h3><p style="line-height: 1.6; margin: 0;">{data.get("description", "ไม่มี")}</p></div>' if data.get('description') else ''}
            
            <div style="background-color: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 10px 0;">⏰ การดำเนินการ</h3>
                <p style="margin: 0; font-size: 16px;">กรุณาติดต่อลูกค้าภายใน 24 ชั่วโมง</p>
            </div>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 8px; text-align: center; color: #6b7280; font-size: 14px;">
                <p style="margin: 0;">ระบบจัดการใบเสนอราคา JLK Transservice</p>
                <p style="margin: 5px 0 0 0;">สร้างเมื่อ: {datetime.datetime.now().strftime('%d/%m/%Y %H:%M:%S')}</p>
            </div>
        </body>
        </html>
        '''
        
        # Send to company email
        send_email(
            EMAIL_CONFIG['company_emails'][0],
            f'🔔 คำขอใบเสนอราคาใหม่ #{quote_id:06d} - {data["companyName"]}',
            company_email_html
        )
        
        return jsonify({
            'success': True,
            'message': 'ส่งคำขอใบเสนอราคาสำเร็จ',
            'quote_id': quote_id
        })
        
    except Exception as e:
        logger.error(f"Error submitting quote: {str(e)}")
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
    print("   - API Health: http://localhost:5000/api/health")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
