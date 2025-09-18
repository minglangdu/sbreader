import requests
import pdfplumber

URL = "https://science.osti.gov/-/media/wdts/nsb/pdf/HS-Sample-Questions/Sample-Set-1/round1.pdf"

# try to convince the site that this is a legitimate user
HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'Accept': 'application/pdf',
    'Referer': 'https://science.osti.gov/wdts/nsb'  # often helps for linking from the legitimate page
}

FILE = "packet.pdf"

response = requests.get(URL, headers=HEADERS)
if response.status_code == 200:
    with open(FILE, 'wb') as f:
        f.write(response.content)
    print("Wrote packet.")
else:
    print("Request blocked.")

