from fastapi import FastAPI, Security, status, Depends, HTTPException
from fastapi.security import APIKeyHeader
from pydantic import BaseModel, SecretStr, Base64UrlBytes

ALBUMS = [
    {"author": "hello", "picture": "https://link-to-cdn.example.com/my-picture.png"},
    {"author": "hello", "picture": "https://link-to-cdn.example.com/my-other-picture.png"},
]

SUPER_SECRET_CREDENTIALS = {
    "username": "user",
    "password": "secret-password",
}
EXAMPLE_TOKEN = "valid-mock-token"

api_key_header = APIKeyHeader(name="Authorization")

def check_header(api_key_header: str = Security(api_key_header)):
    if api_key_header == f"Bearer {EXAMPLE_TOKEN}":
        return True
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Missing or invalid token"
    )

class LoginRequest(BaseModel):
    username: str
    password: SecretStr


class MediaUpload(BaseModel):
    filetype: str
    data: Base64UrlBytes


app = FastAPI()


@app.post("/login")
def login(authentication: LoginRequest):
    user_credentials = LoginRequest.model_validate(SUPER_SECRET_CREDENTIALS)
    if authentication == user_credentials:
        return {"token": "valid-mock-token", "message": "authenticated!"}
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail='Invalid credentials',
    )


@app.get("/albums")
def get_albums(authenticated = Depends(check_header)):
    return {"albums": ALBUMS}


@app.post("/upload-media")
def upload_file(media: MediaUpload, authenticated = Depends(check_header)):
    return {"status": "processing", "length": len(media.data), "type": media.filetype}
