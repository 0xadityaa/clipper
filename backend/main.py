import os
import pathlib
import uuid
import boto3
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from pydantic import BaseModel
import modal


class ProcessVideoRequest(BaseModel):
    s3_key: str


image = (modal.Image.from_registry(
    "nvidia/cuda:12.4.0-devel-ubuntu22.04", add_python="3.12")
    .apt_install(["ffmpeg", "libgl1-mesa-glx", "wget", "libcudnn8", "libcudnn8-dev"])
    .pip_install_from_requirements("requirements.txt")
    .run_commands(["mkdir -p /usr/share/fonts/truetype/custom",
                   "wget -O /usr/share/fonts/truetype/custom/Anton-Regular.ttf https://github.com/google/fonts/raw/main/ofl/anton/Anton-Regular.ttf",
                   "fc-cache -f -v"])
    .add_local_dir("asd", "/asd", copy=True))

app = modal.App(name="clipper-backend", image=image)

volume = modal.Volume.from_name(
    "clipper-backend-volume-model-cache", create_if_missing=True)
mount_path = "/root/.cache/torch"

auth_scheme = HTTPBearer()


@app.cls(gpu="L40S", timeout=900, retries=0, scaledown_window=20, secrets=[modal.Secret.from_name("clipper-secret")], volumes={mount_path: volume})
class Clipper:
    @modal.enter()
    def load_model(self):
        print("Loading models")
        pass

    @modal.fastapi_endpoint(method="POST")
    def process_video(self, request: ProcessVideoRequest, token: HTTPAuthorizationCredentials = Depends(auth_scheme)):
        s3_key = request.s3_key

        if token.credentials != os.environ["AUTH_TOKEN"]:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                                detail="Incorrect bearer token", headers={"WWW-Authenticate": "Bearer"})
        
        run_id = str(uuid.uuid4())
        base_dir = pathlib.Path("/tmp") / run_id
        base_dir.mkdir(parents=True, exist_ok=True)

        # Download video from s3
        video_path = base_dir / "short.mp4"
        s3_client = boto3.client("s3")
        s3_client.download_file("clipper-bucket01", s3_key, str(video_path))

        print(os.listdir(base_dir))


@app.local_entrypoint()
def main():
    import requests

    clipper = Clipper()
    url = clipper.process_video.web_url

    payload = {
        "s3_key": "test1/short.mp4"
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer 123123"
    }

    response = requests.post(url, json=payload, headers=headers)
    response.raise_for_status()
    result = response.json()
    print(result)
