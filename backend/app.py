from flask import Flask, request, jsonify, g
import psycopg2
from psycopg2 import Error
from flask_cors import CORS
import os

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    allowed_origin = 'https://amyz1ng.github.io'  # Replace with your frontend origin
    response.headers['Access-Control-Allow-Origin'] = allowed_origin
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    # Add other necessary CORS headers as needed

    return response

# Connection parameters for ElephantSQL (replace with your credentials)
dbname = 'cdkgoyuf'
user = 'cdkgoyuf'
password = '5GKhTH6GGnsQPZBS67-WjKZMoIBPqijL'
host = 'tai.db.elephantsql.com'
port = '5432'

def get_connection():
    try:
        return psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)
        return None

# Endpoint to check authentication status
@app.route('/checkauthentication', methods=['GET'])
def check_authentication():
    try:
        if session.get('logged_in'):
            return jsonify({'authenticated': True})
        else:
            return jsonify({'authenticated': False}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.teardown_appcontext
def close_connection(exception):
    connection = getattr(g, '_database', None)
    if connection is not None:
        connection.close()

def create_tables():
    connection = get_connection()
    if connection:
        with connection.cursor() as cursor:
            try:
                # Create Reservation table
                create_reservation_table_query = '''
                CREATE TABLE IF NOT EXISTS Reservation (
                    id SERIAL PRIMARY KEY,
                    name VARCHAR(100),
                    email VARCHAR(254),
                    number_of_people INTEGER,
                    date DATE,
                    time TIME,
                    booking_information TEXT
                )
                '''
                cursor.execute(create_reservation_table_query)
                print("Reservation table created successfully")

                # Create Settings table if not exists
                create_settings_table_query = '''
                CREATE TABLE IF NOT EXISTS Settings (
                    setting_id SERIAL PRIMARY KEY,
                    MaxBookings INTEGER
                )
                '''
                cursor.execute(create_settings_table_query)
                print("Settings table created successfully")

                # Create Users table if not exists
                create_users_table_query = '''
                CREATE TABLE IF NOT EXISTS users (
                    id SERIAL PRIMARY KEY,
                    username VARCHAR(50) UNIQUE NOT NULL,
                    password VARCHAR(100) NOT NULL
                )
                '''
                cursor.execute(create_users_table_query)
                print("Users table created successfully")

                # Insert default value into Settings table if it's empty
                cursor.execute("SELECT COUNT(*) FROM Settings")
                count = cursor.fetchone()[0]

                if count == 0:
                    insert_settings_query = '''
                    INSERT INTO Settings (MaxBookings)
                    VALUES (20)
                    '''
                    cursor.execute(insert_settings_query)
                    print("Default value inserted into Settings table")
                else:
                    print("Settings table already contains data")

                connection.commit()
                print("Table creation and initialization completed")
                return "Tables created and initialized successfully"

            except (Exception, Error) as error:
                print("Error creating tables:", error)
                return str(error)

create_tables()

# Login endpoint
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        if authenticate_user(username, password):
            session['logged_in'] = True
            session['username'] = username
            return jsonify({'message': 'Logged in successfully'})
        else:
            return jsonify({'message': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Registration endpoint
@app.route('/register', methods=['POST'])
def register():
    try:
        data = request.json
        username = data.get('username')
        password = data.get('password')

        connection = get_connection()
        if connection:
            with connection.cursor() as cursor:
                try:
                    insert_user_query = '''
                    INSERT INTO users (username, password)
                    VALUES (%s, %s)
                    '''
                    cursor.execute(insert_user_query, (username, password))
                    connection.commit()
                    return jsonify({'message': 'User registered successfully'})
                except (Exception, Error) as error:
                    print("Error registering user:", error)
                    return jsonify({'error': 'Failed to register user'}), 500
        else:
            return jsonify({'error': 'Failed to connect to the database'}), 500

    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Function to authenticate a user
def authenticate_user(username, password):
    connection = get_connection()
    if connection:
        with connection.cursor() as cursor:
            try:
                select_user_query = '''
                SELECT id FROM users
                WHERE username = %s AND password = %s
                '''
                cursor.execute(select_user_query, (username, password))
                result = cursor.fetchone()
                return result is not None
            except (Exception, Error) as error:
                print("Error authenticating user:", error)
                return False

def check_availability(date, time, number_of_people):
    connection = get_connection()
    if connection:
        with connection.cursor() as cursor:
            try:
                # Query to check if the given date and time are available
                check_availability_query = '''
                SELECT SUM(number_of_people), (SELECT MaxBookings FROM Settings) as max_bookings
                FROM Reservation
                WHERE date = %s AND time = %s
                GROUP BY date
                '''
                cursor.execute(check_availability_query, (date, time))
                result = cursor.fetchone()

                if not result:
                    return False, "No settings found"  # If settings not found

                total_booked = result[0] if result else 0
                max_bookings = result[1] if result else 0

                if total_booked is not None and total_booked + number_of_people > max_bookings:
                    return False, "Booked out"

                # Query to check if there's already a booking for the given time on that day
                check_booking_query = '''
                SELECT COUNT(*)
                FROM Reservation
                WHERE date = %s AND time = %s
                '''
                cursor.execute(check_booking_query, (date, time))
                booking_result = cursor.fetchone()

                if booking_result[0] > 0:
                    return False, "Booking already exists for this time"  # If booking exists

                return True, "Available"  # If available

            except (Exception, Error) as error:
                print("Error checking availability:", error)
                return False, str(error)  # Return False on error


@app.route('/checkAvailability', methods=['POST', 'OPTIONS'])
def check_availability_endpoint():
    try:
        data = request.json
        date = data.get('date')
        time = data.get('time')
        number_of_people = data.get('number_of_people')

        is_available, message = check_availability(date, time, number_of_people)

        response = jsonify({'available': is_available, 'message': message})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        response = jsonify({'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

def insert_data_in_db(name, email, number_of_people, date, time, booking_information):
    connection = get_connection()
    if connection:
        with connection.cursor() as cursor:
            try:
                insert_query = '''
                INSERT INTO Reservation (name, email, number_of_people, date, time, booking_information)
                VALUES (%s, %s, %s, %s, %s, %s)
                '''

                cursor.execute(insert_query, (name, email, number_of_people, date, time, booking_information))
                connection.commit()
                print("Data inserted successfully")
                return True
            except (Exception, Error) as error:
                print("Error inserting data:", error)
                return False


@app.route('/insert', methods=['POST', 'OPTIONS'])
def insert_data():
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        number_of_people = data.get('number_of_people')
        date = data.get('date')
        time = data.get('time')
        booking_information = data.get('booking_information')

        success = insert_data_in_db(name, email, number_of_people, date, time, booking_information)
        if success:
            response = jsonify({'message': 'Insert operation successful'})
        else:
            response = jsonify({'error': 'Failed to insert data'})

        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    except Exception as e:
        response = jsonify({'error': str(e)})
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response


if __name__ == '__main__':
    print("bla123")
    create_table()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
