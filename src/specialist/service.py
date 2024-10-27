import requests

def send_to_crm(specialist_data):
    crm_url = "https://your-crm-endpoint.com/api/specialists"
    response = requests.post(crm_url, json=specialist_data)
    if response.status_code == 201:
        return True
    else:
        return False