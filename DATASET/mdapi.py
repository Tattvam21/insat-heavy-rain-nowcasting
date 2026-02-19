import paramiko
import os

# CONFIG
HOST = "download.mosdac.gov.in"
PORT = 22
USERNAME = "s230090107053@ckpcet.ac.in"
PASSWORD = "Bishop@196"

REMOTE_ROOT = "/Order/Feb26_170570"
LOCAL_ROOT = "./mosdac_download"

os.makedirs(LOCAL_ROOT, exist_ok=True)

transport = paramiko.Transport((HOST, PORT))
transport.connect(username=USERNAME, password=PASSWORD)
sftp = paramiko.SFTPClient.from_transport(transport)

def download_dir(remote, local):
    os.makedirs(local, exist_ok=True)
    for f in sftp.listdir_attr(remote):
        remote_path = f"{remote}/{f.filename}"
        local_path = os.path.join(local, f.filename)
        if f.st_mode & 0o40000:
            download_dir(remote_path, local_path)
        else:
            if not os.path.exists(local_path):
                print(f"Downloading {remote_path}")
                sftp.get(remote_path, local_path)
            else:
                print(f"Already exists: {local_path}")

download_dir(REMOTE_ROOT, LOCAL_ROOT)
print("Download complete")

sftp.close()
transport.close()



