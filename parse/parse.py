import pdfplumber
import json
import os


GET = True

# try to convince the site that this is a legitimate user
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.9; rv:50.0) Gecko/20100101 Firefox/50.0',
    'Referer': 'https://science.osti.gov/wdts/nsb/Regional-Competitions/Resources/HS-Sample-Questions',
    'Connection': 'keep-alive',
}

SUBJECTS = [
    "EARTH AND SPACE",
    "EARTH SCIENCE",
    "PHYSICS",
    "MATH",
    "CHEMISTRY",
    "ENERGY",
    "BIOLOGY",
    "GENERAL SCIENCE",
    "ASTRONOMY",
    "COMPUTER SCIENCE",
]


def parsepdf(url, file, result):
    if GET:
        os.system(f"/usr/bin/env wget {url} -O {file}")

    content = ""
    with pdfplumber.open(file) as pdf:
        for page in pdf.pages:
            text = page.extract_text()
            if text:
                content += text + "\n"
    
    # print(content)

    data = []
    next = {}
    # -1: not in question;
    # 0: type;
    # 1: content and types;
    # 1.5: content
    # 2: answer;
    # 2.5: only answer
    stage = -1
    # attributes: type, answer, content, answertype, subject
    for line in content.splitlines():
        old = stage
        # getting stage
        if ("Page" in line):
            stage = -1
        if ("TOSS UP" in line
            or "TOSS-UP" in line
            or "BONUS" in line):
            stage = 0
        if ("Short Answer" in line
            or "Short answer" in line
            or "Multiple Choice" in line
            or "Multiple choice" in line):
            stage = 1
        if ("ANSWER" in line):
            stage = 2

        if ((old == 2.5 or old == 2) and stage != 2.5 and stage != old):
            # checking
            print(next)
            if ("type" not in next
                or "subject" not in next
                or "answertype" not in next
                or "content" not in next
                or "answer" not in next):
                raise Exception("Incomplete")
            data.append(next)
            next = {}

        # reading
        if (stage == 0):
            next["type"] = ("Toss-up" if ("TOSS UP" in line or "TOSS-UP" in line) else "Bonus")
        elif (stage == 1):
            for subject in SUBJECTS:
                if (subject in line):
                    next["subject"] = f" {subject} " # backwards compatibility
                    break
            next["answertype"] = ("Short Answer" if ("Short Answer" in line) else "Multiple Choice")
            next["content"] = line.partition(next["answertype"])[2]
            stage = 1.5
        elif (stage == 1.5):
            next["content"] += "\n" + line
        elif (stage == 2):
            next["answer"] = line.partition("ANSWER:")[2]
            stage = 2.5
        elif (stage == 2.5):
            next["answer"] += "\n" + line

    with open(result, "w") as file:
        json.dump(data, file, indent=4)

    print(f"Wrote json for \"{file}\"")
        
####

for round in range(1, 18):
    # URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round{round}.pdf"
    # URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-2/round{round}.pdf"
    # URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-3/Round-{round}C.pdf"
    URL = f"https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-4/Round{round}.pdf"
    FILE = f"pdfs/round{round}.pdf"
    RESULT = f"../packets/set4/round{round}.json"
    parsepdf(URL, FILE, RESULT)

