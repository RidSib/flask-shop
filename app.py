# -*- coding: utf-8 -*-
"""Create an application instance."""
from flaskshop.app import create_app
import os
from datetime import datetime
from flask import jsonify, request
import logging

app = create_app()

# Configure logging
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s %(levelname)s: %(message)s',
    handlers=[
        logging.FileHandler('flask_app.log'),
        logging.StreamHandler()
    ]
)

# Add this to your Flask routes
@app.route('/api/save_chat', methods=['POST'])
def save_chat():
    try:
        print('Received request data:', request.json)  # Debug print
        logs_dir = os.path.join(os.path.dirname(__file__), 'chat_logs')
        print('Logs directory:', logs_dir)  # Debug print
        
        # Generate filename with timestamp
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        filename = f'chat_history_{timestamp}.txt'
        filepath = os.path.join(logs_dir, filename)

        # Get messages from request
        messages = request.json.get('messages', [])

        # Write messages to file
        with open(filepath, 'w', encoding='utf-8') as f:
            for msg in messages:
                f.write(f"[{msg['timestamp']}] {msg['type'].upper()}: {msg['content']}\n")

        print(f'Successfully saved to {filepath}')  # Debug print
        return jsonify({'success': True, 'filename': filename}), 200

    except Exception as e:
        print(f'Error occurred: {str(e)}')  # Debug print
        return jsonify({'success': False, 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5001)
