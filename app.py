from flask import Flask, request, jsonify
import psycopg2
from psycopg2 import Error
from flask_cors import CORS

app = Flask(__name__)

@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    # Other CORS headers if needed
    # ...
    return response



# Connection parameters
dbname = 'cdkgoyuf'
user = 'cdkgoyuf'
password = '5GKhTH6GGnsQPZBS67-WjKZMoIBPqijL'
host = 'tai.db.elephantsql.com'
port = '5432'

# Establish a connection to the database
def connect():
    try:
        connection = psycopg2.connect(
            dbname=dbname,
            user=user,
            password=password,
            host=host,
            port=port
        )
        return connection
    except (Exception, Error) as error:
        print("Error while connecting to PostgreSQL", error)

# Close the database connection
def close_connection(connection, cursor):
    if connection:
        cursor.close()
        connection.close()
        print("PostgreSQL connection is closed")

# Create a table if it doesn't exist
def create_table():
    connection = connect()
    cursor = connection.cursor()

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
    except (Exception, Error) as error:
        print("Error creating table:", error)
    finally:
        close_connection(connection, cursor)

# Insert data into the database
def insert_data_in_db(name, email, number_of_people, date, time, booking_information):
    connection = connect()
    cursor = connection.cursor()

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
    finally:
        close_connection(connection, cursor)

@app.route('/insert', methods=['POST'])
def insert_data():
    print('teststuff')
    name = request.json.get('name')
    email = request.json.get('email')
    number_of_people = request.json.get('number_of_people')
    date = request.json.get('date')
    time = request.json.get('time')
    booking_information = request.json.get('booking_information')

    insert_data_in_db(name, email, number_of_people, date, time, booking_information)

    return jsonify({'message': 'Insert operation successful'})

if __name__ == '__main__':
    print(app.url_map)
    create_table()  # Create the table if it doesn't exist
    app.run(debug=True)
    app.run(port=5000)




