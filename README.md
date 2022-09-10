# QuickStart

## 必要なファイル

1. .env
```txt
CALENDAR_ID="fuga90324jif90324j@group.calendar.google.com"
LETUS_USERNAME="0000000"
LETUS_PASSWORD="fugahogebarhoge"
```

2. env/credentials.json
```json
{
  "type": "service_account",
  "project_id": "hogehoge",
  "private_key_id": "fugafuga",
  "private_key": "-----BEGIN PRIVATE kEY-----\nfugafuageafjkdlafe....",
  "client_email": "fuga@fuga.iam.gserviceaccount.com",
  "client_id": "324897253429649723",
  "auth_url": "https://accounts.google.com/o/oauth2/auth",
  "token_url": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/fjifjilajsfielji..."
}
```

3. data/calendar.html
  CLASSの学生時間割表のHTMLファイル

## コマンド
```bash
$ poetry shell
$ python3 main.py
```
