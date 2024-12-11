import requests


class CRMController:

    def __init__(self):
        self.BITRIX24_URL = "https://b24-xvphmp.bitrix24.ru/rest/1/4lncr3tgz62qxblf/crm.lead.add"

    def send_to_crm(self, specialist_data):
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
        response = requests.post(self.BITRIX24_URL, json=payload)
        return response.status_code == 200

