import requests
import pdfplumber
import json
import os


# try to convince the site that this is a legitimate user
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0',
    'Referer': 'https://science.osti.gov/wdts/nsb/Regional-Competitions/Resources/HS-Sample-Questions',
    'Connection': 'keep-alive'
}


FILE = "packet.pdf"

def parsepdf(url, file, result):
    response = requests.get(url, headers=HEADERS)
    if response.status_code == 200:
        with open(file, 'wb') as f:
            f.write(response.content)
    else:
        print("Request Blocked")
        #raise Exception("Request Blocked")


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
    inans = False
    for line in content.splitlines():
        if ("TOSS-UP" in line):
            next = {}
            next["type"] = "Toss-up"
            inans = False
            inmult = False
        elif ("BONUS" in line):
            next = {}
            next["type"] = "Bonus"
            inans = False
            inmult = False
        if (inans):
            # slowhand to prevent KeyError
            next["answer"] = next["answer"] + line # no \n intentionally
        elif ("ANSWER:" in line):
            after = line.rsplit("ANSWER:", 1)[1]
            next["answer"] = after
            data.append(next)
            inmult = False
            inans = True
        if (inmult):
            next["content"] += "\n" + line
        elif ("Short Answer" in line):
            inmult = True
            next["answertype"] = "Short Answer"
            after = line.rsplit("Short Answer", 1)[1]
            before = line.rsplit("Short Answer", 1)[0].rsplit(".", 1)[1]
            next["content"] = after
            next["subject"] = before
        elif ("Multiple Choice" in line):
            inmult = True
            next["answertype"] = "Multiple Choice"
            after = line.rsplit("Multiple Choice", 1)[1]
            before = line.rsplit("Multiple Choice", 1)[0].rsplit(".", 1)[1]
            next["content"] = after
            next["subject"] = before

    with open(result, "w") as file:
        json.dump(data, file, indent=4)

    print(f"Wrote json for \"{url}\"")
        
####

for round in range(1, 18):
    #URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round{round}.pdf"
    #URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-2/round{round}.pdf"
    URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/./HS-Sample-Questions/Sample-Set-3/round{round}C.pdf"
    RESULT = f"../packets/set2/round{round}.json"
    parsepdf(URL, FILE, RESULT)
