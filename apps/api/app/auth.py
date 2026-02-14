from datetime import datetime, timedelta, UTC

from jose import jwt, JWTError
from passlib.context import CryptContext

from .config import settings


pwd_context = CryptContext(schemes=["pbkdf2_sha256"], deprecated="auto")


def hash_password(password: str) -> str:
    return pwd_context.hash(password)


def verify_password(password: str, hashed: str) -> bool:
    return pwd_context.verify(password, hashed)


def create_token(subject: str, expires_delta: timedelta) -> str:
    payload = {"sub": subject, "exp": datetime.now(UTC) + expires_delta}
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def create_access_token(user_id: int) -> str:
    return create_token(str(user_id), timedelta(minutes=settings.access_token_minutes))


def create_refresh_token(user_id: int) -> tuple[str, datetime]:
    expiry = datetime.now(UTC) + timedelta(minutes=settings.refresh_token_minutes)
    token = create_token(str(user_id), timedelta(minutes=settings.refresh_token_minutes))
    return token, expiry.replace(tzinfo=None)


def decode_token(token: str) -> int:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return int(payload["sub"])
    except (JWTError, KeyError, ValueError) as exc:
        raise ValueError("invalid token") from exc
