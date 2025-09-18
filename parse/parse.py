import requests
import pdfplumber
import json

URL = "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf"

# try to convince the site that this is a legitimate user
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'application/pdf',
    'Referer': 'https://science.osti.gov/wdts/nsb'  # often helps for linking from the legitimate page
}

FILE = "packet.pdf"

RESULT = "packet.json"

response = requests.get(URL, headers=HEADERS)
if response.status_code == 200:
    with open(FILE, 'wb') as f:
        f.write(response.content)
    print("Wrote packet.")
else:
    print("Request blocked.")
    raise Exception("Request Blocked")


content = ""
with pdfplumber.open(FILE) as pdf:
    for page in pdf.pages:
        text = page.extract_text()
        if text:
            content += text + "\n"

data = []

next = {}
inmult = False
for line in content.splitlines():
    if ("ANSWER: " in line):
        after = line.rsplit("ANSWER: ", 1)[1]
        next["answer"] = after
        data.append(next)
        next = {}
        inmult = False
    if (inmult):
        next["content"] += "\n" + line
    if ("TOSS-UP" in line):
        next["type"] = "Toss-up"
    if ("BONUS" in line):
        next["type"] = "Bonus"
    if ("Short Answer" in line):
        next["answertype"] = "Short Answer"
        after = line.rsplit("Short Answer", 1)[1]
        next["content"] = after
    if ("Multiple Choice" in line):
        inmult = True
        next["answertype"] = "Multiple Choice"
        after = line.rsplit("Multiple Choice", 1)[1]
        next["content"] = after
    
    

with open(RESULT, "w") as file:
    json.dump(data, file, indent=4)
