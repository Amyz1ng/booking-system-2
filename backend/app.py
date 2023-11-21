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

@app.teardown_appcontext
def close_connection(exception):
    connection = getattr(g, '_database', None)
    if connection is not None:
        connection.close()

def create_table():
    print("test")
    connection = get_connection()
    print(connection)
    if connection:
        with connection.cursor() as cursor:
            try:
                create_table_query = '''
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
                cursor.execute(create_table_query)
                connection.commit()
                print("Table created successfully")
                return "Table created successfully"
            except (Exception, Error) as error:
                print("Error creating table:", error)

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
            except (Exception, Error) as error:
                print("Error inserting data:", error)

@app.route('/insert', methods=['POST', 'OPTIONS'])
def insert_data():
    print('testr')
    try:
        data = request.json
        name = data.get('name')
        email = data.get('email')
        number_of_people = data.get('number_of_people')
        date = data.get('date')
        time = data.get('time')
        booking_information = data.get('booking_information')

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
                    return jsonify({'message': 'Insert operation successful'})
                except (Exception, Error) as error:
                    print("Error inserting data:", error)
                    return jsonify({'error': str(error)})
    except Exception as e:
        return jsonify({'error': str(e)})


if __name__ == '__main__':
    create_table()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
