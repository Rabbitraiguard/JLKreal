#!/usr/bin/env python3
"""
JLK Transservice - Python Flask Backend
บริการโลจิสติกส์ระดับมืออาชีพ

This is the main Python backend application that handles:
- Quote form submissions
- Contact form processing
- Data storage and retrieval
- API endpoints for the frontend
"""

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
import sqlite3
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
    """Handle quote form submission - now just saves to database, email handled by Formspree"""
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
