# This file generates the tokens.

import jwt
import datetime
from dotenv import load_dotenv
import os

load_dotenv() # loads .env credentials

SECRET_KEY = os.getenv("JWT_SECRET", "supersecretkey")  # fallback if not in .env. This means that it will create a default secret key called "supersecretkey" if not found in .env file.
ALGORITHM = "HS256"
TOKEN_EXPIRE_MINUTES = 60  # 1 hour expiry

def create_token(user_id: int):
    """
    Generates a JWT token with user ID and expiry
    """
    payload = {
        "user_id": user_id,
        "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=TOKEN_EXPIRE_MINUTES),
        "iat": datetime.datetime.utcnow()
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm=ALGORITHM)
    return token

def decode_token(token: str):
    """
    Decodes a JWT token and returns payload
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None  # token expired
    except jwt.InvalidTokenError:
        return None  # invalid token
