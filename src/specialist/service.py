import requests


# рэалізаваць функцыянал адабрэння або адхілення заяўкі ў crm
BITRIX24_URL = "https://b24-8xamtz.bitrix24.by/rest/1/wxcbo48uim8u2rid/crm.lead.add"

def send_to_crm(specialist_data):
    payload = {
        "fields": {
            "TITLE": f"Заявка от специалиста {specialist_data['name']}",
            "NAME": specialist_data["name"],
            "EMAIL": [{"VALUE": specialist_data["email"], "VALUE_TYPE": "WORK"}],
            "PHONE": [{"VALUE": specialist_data["phone_number"], "VALUE_TYPE": "WORK"}],
            "COMMENTS": specialist_data["description"]
        },
        "params": {"REGISTER_SONET_EVENT": "Y"}
    }
    response = requests.post(BITRIX24_URL, json=payload)
    return response.status_code == 200