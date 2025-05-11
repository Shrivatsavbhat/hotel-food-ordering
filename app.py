from flask import Flask, jsonify, request, render_template
import sqlite3
import webbrowser
from threading import Timer

app = Flask(__name__)

# Database setup
DATABASE = 'menu.db'

def get_db_connection():
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    return conn

# API to fetch menu items
@app.route('/menu', methods=['GET'])
def get_menu():
    conn = get_db_connection()
    menu_items = conn.execute('SELECT * FROM menu').fetchall()
    conn.close()
    return jsonify([dict(item) for item in menu_items])

# Order submission endpoint
@app.route('/order', methods=['POST'])
def place_order():
    data = request.get_json()
    items = data.get('items', [])
    total = data.get('total', 0)
    if items and total > 0:
        return jsonify({"message": f"Order placed successfully for ₹{total}!"})
    return jsonify({"message": "Invalid order!"}), 400

# Serve the main page
@app.route('/')
def index():
    return render_template('hotel1.html')

# Open the web browser after server starts
def open_browser():
    webbrowser.open_new('http://127.0.0.1:5000/')

if __name__ == '__main__':
    Timer(1, open_browser).start()  # Open the browser after 1 second
    app.run(debug=True)
