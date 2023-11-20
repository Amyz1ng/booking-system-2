import os
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)

# Configure SQLAlchemy to use the Heroku PostgreSQL database URL
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')

# Initialize SQLAlchemy
db = SQLAlchemy(app)

# Define your models and perform database operations using 'db'
# Example:
# class User(db.Model):
#     id = db.Column(db.Integer, primary_key=True)
#     username = db.Column(db.String(80), unique=True, nullable=False)

if __name__ == '__main__':
    app.run()
