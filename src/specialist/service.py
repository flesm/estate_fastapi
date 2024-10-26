import requests

def send_to_crm(specialist_data):
    """Отправка данных специалиста в CRM для дальнейшего одобрения"""
    crm_url = "https://your-crm-endpoint.com/api/specialists"  # CRM URL
    response = requests.post(crm_url, json=specialist_data)
    if response.status_code == 201:
        return True
    else:
        # Логировать ошибки для дальнейшего анализа
        return False