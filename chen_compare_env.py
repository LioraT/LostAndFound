import hashlib
import os

# Define file pairs to compare
file_pairs = [
    ("front/package.json", "front/package.json.chen"),
    ("front/.env", "front/env_chen"),
    ("server/package.json", "server/package.json.chen"),
    ("server/.env", "server/env_chen"),
]

def file_md5(filepath):
    """Calculate MD5 checksum of a file."""
    hash_md5 = hashlib.md5()
    try:
        with open(filepath, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except FileNotFoundError:
        return None

print("Comparing file pairs...\n")

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
        all_match = False

    print()

if all_match:
    print("✅ All file pairs are identical.")
else:
    print("❌ Some file pairs are different or missing.")
