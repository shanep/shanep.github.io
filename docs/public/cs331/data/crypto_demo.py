#!/usr/bin/env python3
"""Symmetric encryption demonstration for CS 331, Lab 4.

Three demonstrations, in order:

  Part 1 -- Modes of operation.  Encrypts the same picture twice, once in ECB
            mode and once in CTR mode, and writes both out as .bmp files you
            can open and look at.
  Part 2 -- Encryption is not integrity.  Flips one bit of a ciphertext and
            shows what AES-GCM does about it, and what AES-CTR does not.
  Part 3 -- Nonce reuse.  Encrypts two messages under the same key and nonce
            and recovers one of them from the other.

Requires the `cryptography` package (installed in Lab 0):

    pip install cryptography
    python3 crypto_demo.py

Writes three files into whatever directory you run it from:
cs331_original.bmp, cs331_ecb.bmp, cs331_ctr.bmp

CS 331 -- Computer Security and Information Assurance
"""

from __future__ import annotations

import pathlib
import struct
from typing import Final

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers import Cipher, algorithms, modes
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

# ---------------------------------------------------------------------------
# CHANGE THESE and re-run.
# ---------------------------------------------------------------------------

# Part 1: the picture is IMAGE_SIZE x IMAGE_SIZE pixels.  Must be a multiple
# of 16 so the pixel data divides evenly into AES blocks.
IMAGE_SIZE: Final[int] = 256

# Part 3: the two messages sent under the same key and nonce.  Change the
# second one and watch what the "recovered" line does.
MESSAGE_ONE: Final[bytes] = b"TRANSFER $500 TO ACCOUNT 12345678"
MESSAGE_TWO: Final[bytes] = b"TRANSFER $900 TO ACCOUNT 87654321"

# ---------------------------------------------------------------------------

AES_KEY: Final[bytes] = bytes(range(16))       # 16 bytes = AES-128
FIXED_IV: Final[bytes] = bytes(16)             # deliberately fixed, see Part 3
GCM_NONCE: Final[bytes] = bytes(range(12))     # 12 bytes, as GCM expects


# --- a very small BMP writer, so no image library is needed ----------------


def draw_face(size: int) -> bytearray:
    """Return `size` x `size` pixels of BGR data: a white face on black.

    Large blocks of one colour are exactly what ECB mode fails to hide, which
    is the point of Part 1.
    """
    black = (0, 0, 0)
    white = (255, 255, 255)
    pixels = bytearray()
    centre = size // 2
    face_radius = int(size * 0.36)
    eye_radius = int(size * 0.05)

    for y in range(size):
        for x in range(size):
            dx, dy = x - centre, y - centre
            inside_face = dx * dx + dy * dy <= face_radius * face_radius

            eye_dx = abs(dx) - int(size * 0.14)
            eye_dy = dy + int(size * 0.10)
            inside_eye = eye_dx * eye_dx + eye_dy * eye_dy <= eye_radius * eye_radius

            inside_mouth = (
                int(size * 0.10) <= dy <= int(size * 0.16)
                and abs(dx) <= int(size * 0.18)
            )

            colour = white if inside_face and not (inside_eye or inside_mouth) else black
            pixels.extend(colour)

    return pixels


def write_bmp(path: pathlib.Path, size: int, pixel_data: bytes) -> None:
    """Write 24-bit BGR pixel data as an uncompressed BMP file.

    A BMP is a 54-byte header followed by raw pixel bytes, so we can encrypt
    the pixel bytes, glue the original header back on, and still have a file
    an image viewer will open.
    """
    row_bytes = size * 3
    if row_bytes % 4 != 0:
        raise ValueError("choose an IMAGE_SIZE whose width*3 is a multiple of 4")

    file_header = struct.pack("<2sIHHI", b"BM", 54 + len(pixel_data), 0, 0, 54)
    info_header = struct.pack(
        "<IiiHHIIiiII", 40, size, size, 1, 24, 0, len(pixel_data), 2835, 2835, 0, 0
    )
    path.write_bytes(file_header + info_header + pixel_data)


# --- the three demonstrations ----------------------------------------------


def encrypt_ecb(plaintext: bytes) -> bytes:
    """AES-128 in ECB mode: every 16-byte block encrypted independently."""
    encryptor = Cipher(algorithms.AES(AES_KEY), modes.ECB()).encryptor()
    return encryptor.update(plaintext) + encryptor.finalize()


def encrypt_ctr(plaintext: bytes, iv: bytes = FIXED_IV) -> bytes:
    """AES-128 in CTR mode: a keystream is generated and XORed with the data."""
    encryptor = Cipher(algorithms.AES(AES_KEY), modes.CTR(iv)).encryptor()
    return encryptor.update(plaintext) + encryptor.finalize()


def part_one(output_directory: pathlib.Path) -> None:
    print("\n" + "=" * 72)
    print("PART 1 -- Two modes of operation, same cipher, same key")
    print("=" * 72)

    pixels = bytes(draw_face(IMAGE_SIZE))
    print(f"  Picture: {IMAGE_SIZE}x{IMAGE_SIZE}, {len(pixels):,} bytes of pixel data")
    print(f"  That is {len(pixels) // 16:,} AES blocks of 16 bytes each.")

    ecb_pixels = encrypt_ecb(pixels)
    ctr_pixels = encrypt_ctr(pixels)

    distinct_plain = len({pixels[i:i + 16] for i in range(0, len(pixels), 16)})
    distinct_ecb = len({ecb_pixels[i:i + 16] for i in range(0, len(ecb_pixels), 16)})
    distinct_ctr = len({ctr_pixels[i:i + 16] for i in range(0, len(ctr_pixels), 16)})

    print(f"\n  Distinct 16-byte blocks in the plaintext: {distinct_plain:,}")
    print(f"  Distinct 16-byte blocks after ECB:        {distinct_ecb:,}")
    print(f"  Distinct 16-byte blocks after CTR:        {distinct_ctr:,}")
    print("\n  ECB gives exactly as many distinct blocks as the plaintext had.")
    print("  Identical input blocks became identical output blocks, so every")
    print("  repeated patch of colour is still a repeated patch of colour.")

    for name, data in (
        ("cs331_original.bmp", pixels),
        ("cs331_ecb.bmp", ecb_pixels),
        ("cs331_ctr.bmp", ctr_pixels),
    ):
        path = output_directory / name
        write_bmp(path, IMAGE_SIZE, data)
        print(f"  wrote {path}")

    print("\n  Open all three.  One of the two encrypted files still shows you")
    print("  the picture.  Write down which, and why.")


def part_two() -> None:
    print("\n" + "=" * 72)
    print("PART 2 -- Encryption is not integrity")
    print("=" * 72)

    message = b"Balance: $100.00"
    print(f"  Message: {message!r}")

    # CTR mode: confidentiality only.
    ctr_ciphertext = bytearray(encrypt_ctr(message, iv=bytes(15) + b"\x01"))
    ctr_ciphertext[9] ^= 0x01  # flip one bit of the ciphertext
    tampered = encrypt_ctr(bytes(ctr_ciphertext), iv=bytes(15) + b"\x01")
    print("\n  AES-CTR, one bit of the ciphertext flipped in transit:")
    print(f"    decrypts to: {tampered!r}")
    print("    No error.  The receiver has no way to know it was changed.")

    # GCM mode: confidentiality AND integrity.
    gcm = AESGCM(AES_KEY)
    gcm_ciphertext = bytearray(gcm.encrypt(GCM_NONCE, message, None))
    print("\n  AES-GCM, one bit of the ciphertext flipped in transit:")
    gcm_ciphertext[9] ^= 0x01
    try:
        recovered = gcm.decrypt(GCM_NONCE, bytes(gcm_ciphertext), None)
        print(f"    decrypts to: {recovered!r}  <-- this should not happen")
    except InvalidTag:
        print("    decryption REFUSED: InvalidTag")
        print("    GCM carries an authentication tag, so tampering is detected.")

    print("\n  Both modes kept the message secret.  Only one of them noticed")
    print("  that somebody changed it.  Secrecy and integrity are separate")
    print("  properties and you have to ask for each one.")


def part_three() -> None:
    print("\n" + "=" * 72)
    print("PART 3 -- What goes wrong when a nonce is reused")
    print("=" * 72)

    if len(MESSAGE_ONE) != len(MESSAGE_TWO):
        print("  (Make MESSAGE_ONE and MESSAGE_TWO the same length for this part.)")
        return

    # Both encrypted under the SAME key and the SAME counter start.  This is
    # the mistake.
    cipher_one = encrypt_ctr(MESSAGE_ONE)
    cipher_two = encrypt_ctr(MESSAGE_TWO)

    print(f"  Message 1: {MESSAGE_ONE.decode()}")
    print(f"  Message 2: {MESSAGE_TWO.decode()}")
    print(f"\n  Ciphertext 1: {cipher_one.hex()}")
    print(f"  Ciphertext 2: {cipher_two.hex()}")

    # XOR the two ciphertexts.  The keystream cancels out, leaving the XOR of
    # the two plaintexts -- no key required.
    xor_of_ciphertexts = bytes(a ^ b for a, b in zip(cipher_one, cipher_two))
    print(f"\n  C1 XOR C2  = {xor_of_ciphertexts.hex()}")
    print("  The keystream is identical in both, so XORing the ciphertexts")
    print("  cancels it and leaves P1 XOR P2.  No key was used to get here.")

    # An attacker who learns one plaintext gets the other for free.
    recovered = bytes(a ^ b for a, b in zip(xor_of_ciphertexts, MESSAGE_ONE))
    print(f"\n  Attacker already knew message 1. Recovered message 2:")
    print(f"    {recovered.decode(errors='replace')}")
    print("\n  A nonce does not have to be secret, but it must never repeat")
    print("  under the same key.  This is why GCM takes a nonce argument and")
    print("  why you must not hand it the same one twice.")


def main() -> int:
    output_directory = pathlib.Path.cwd()
    print("=" * 72)
    print("SYMMETRIC ENCRYPTION -- CS 331 Lab 4")
    print("=" * 72)
    print(f"Writing image files into: {output_directory}")

    part_one(output_directory)
    part_two()
    part_three()

    print("\n" + "=" * 72)
    print("Done.  Lab 4 asks you about the three .bmp files and about what")
    print("Parts 2 and 3 printed.")
    print("=" * 72)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
