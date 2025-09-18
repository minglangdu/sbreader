import requests
import pdfplumber
import json
import os


# try to convince the site that this is a legitimate user
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'application/pdf',
    'Referer': 'https://science.osti.gov/wdts/nsb'  # often helps for linking from the legitimate page
}

FILE = "packet.pdf"

def parsepdf(url, file, result):
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        with open(file, 'wb') as f:
            f.write(response.content)
        print("Wrote packet.")
    else:
        print("Request blocked.")
        raise Exception("Request Blocked")


    content = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                content += text + "\n"

    os.remove(file)
    
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
            inmult = True
            next["answertype"] = "Short Answer"
            after = line.rsplit("Short Answer", 1)[1]
            before = line.rsplit("Short Answer", 1)[0].rsplit(")", 1)[1]
            next["content"] = after
            next["subject"] = before
        if ("Multiple Choice" in line):
            inmult = True
            next["answertype"] = "Multiple Choice"
            after = line.rsplit("Multiple Choice", 1)[1]
            before = line.rsplit("Multiple Choice", 1)[0].rsplit(")", 1)[1]
            next["content"] = after
            next["subject"] = before

    with open(result, "w") as file:
        json.dump(data, file, indent=4)



####

for round in range(1, 18):
    URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round{round}.pdf"
    RESULT = f"../packets/set1/round{round}.json"
    parsepdf(URL, FILE, RESULT)
