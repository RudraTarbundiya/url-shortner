import requests
url = "http://localhost:3000/url/" 
data = {
    "OrginalURl": "https://chatgpt.com"
}

response = requests.post(url, json=data)

print("Status Code:", response.status_code)
try:
    print("Response JSON:", response.json())
except Exception as e:
    print("Response Text:", response.text)
    print("Error:", e)    
