import hashlib
import os
import argparse

# === Parse Command Line Argument for Username ===
parser = argparse.ArgumentParser(description="Compare MD5 checksums of file pairs.")
parser.add_argument("username", help="Username to use in file pair suffixes (e.g., chen)")
args = parser.parse_args()
username = args.username

# === Define File Pairs Dynamically ===
file_pairs = [
    ("front/package.json", f"front/package.json.{username}"),
    ("front/.env", f"front/env_{username}"),
    ("server/package.json", f"server/package.json.{username}"),
    ("server/.env", f"server/env_{username}"),
]

# === Function to Calculate MD5 ===
def file_md5(filepath):
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except FileNotFoundError:
        return None
    except PermissionError:
        print(f"    ❌ Permission denied: {filepath}")
        return None

# === Comparison Logic ===
print(f"Comparing file pairs for user '{username}'...\n")
all_match = True

for i, (file1, file2) in enumerate(file_pairs, start=1):
    print(f"Pair {i}:")
    print(f"  File 1: {file1}")
    print(f"  File 2: {file2}")

    hash1 = file_md5(file1)
    hash2 = file_md5(file2)

    if hash1 is None:
        print(f"    ❌ File not found: {file1}")
        all_match = False
    elif hash2 is None:
        print(f"    ❌ File not found: {file2}")
        all_match = False
    elif hash1 == hash2:
        print("    ✅ Files are identical.")
    else:
        print("    ❌ Files are different!")
        print(f"    MD5 File 1: {hash1}")
        print(f"    MD5 File 2: {hash2}")
        all_match = False

    print()

if all_match:
    print("✅ All file pairs are identical.")
else:
    print("❌ Some file pairs are different or missing.")
