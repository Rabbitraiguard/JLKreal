#!/usr/bin/env python3
"""
JLK Transservice - Python Flask Backend
บริการโลจิสติกส์ระดับมืออาชีพ

This is the main Python backend application that handles:
- Static file serving
- HTML page routing
- Health check endpoint
- Basic web server functionality
"""

from flask import Flask, render_template, send_from_directory, jsonify
import datetime
import os
import logging

# Initialize Flask application
app = Flask(__name__, static_folder='static', template_folder='.')

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

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
    # Start the Flask development server
    print("🚀 Starting JLK Transservice Backend Server...")
    print("📋 Available endpoints:")
    print("   - Homepage: http://localhost:5000/")
    print("   - Services: http://localhost:5000/services.html")
    print("   - About: http://localhost:5000/about.html")
    print("   - Quote: http://localhost:5000/quote.html")
    print("   - Contact: http://localhost:5000/contact.html")
    print("   - API Health: http://localhost:5000/api/health")
    print("📧 Forms now submit via Formspree")
    
    app.run(debug=True, host='0.0.0.0', port=5000)
