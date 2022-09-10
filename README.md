# QuickStart


## GoogleCalenderAPIの設定

1. [GoogleCloud](https://cloud.google.com/)からプロジェクトを作成。

2. Google Calendar APIを有効化する。

3. APIとサービス > 認証情報 を開き、画面上部の"認証情報を作成"からサービスアカウントを作成。

4. メールアドレスをコピーしておく。  
  ![サービスアカウントの作成画面](https://user-images.githubusercontent.com/96561881/189483388-ae1828c6-2cdd-44e5-8db2-ea16c99c9ec6.png)

5. サービスアカウントの編集画面を開く。
![サービスアカウントを編集](https://user-images.githubusercontent.com/96561881/189483977-87d59729-31f3-449c-9a63-5f3bdf706b32.png)

6. 鍵(`credentials.json`)を生成する。キーのタイプはJSONを選択する。  
  ![鍵の生成](https://user-images.githubusercontent.com/96561881/189483727-15b9cb84-c3ba-4940-acde-c4ef7536454f.png)

7. 生成したファイルの名前を`credentials.json`に変更し、envフォルダ下に配置する(`env/credentials.json`)。

### GoogleCalenderの設定

1. 新しいカレンダーを作成する。

2. カレンダーの設定を開き、"特定のユーザーとの共有"から先ほどコピーしたサービスアカウントのメールアドレスを追加し、"予定の変更"が行えるようにする。  
  ![サービスアカウントをカレンダーへのアクセスへ許可する](https://user-images.githubusercontent.com/96561881/189484124-8ad3462a-3db7-4bcf-84a1-13686dfe82c8.png)

3. 同じくカレンダーの設定にある、"カレンダーの統合"から、カレンダーID(例: `hogefej3i24@group.calendar.google.com`)をコピーしておく。

## .envに必要情報を書き込む

1. `.env`を作成する

2. `CALENDAR_ID=`に続く形で、先ほどコピーしたカレンダーIDを記入する  
  例: `CALENDAR_ID=fugaefjieaj3i4ejw32@group.calendar.google.com`

3. `LETUS_USERNAME=`に続く形で、LETUSのユーザー名を記入する  
  例: `LETUS_USERNAME=0000000`

4. `LETUS_PASSWORD=`に続く形で、LETUSのパスワードを記入する  
  例: `LETUS_PASSWORD=my_paSsword_2022`

## data/calendar.htmlを生成する

1. CLASSにアクセスし、学生時間割表を表示する。

2. 学生時間割表のHTMLファイルを、`data/calendar.html`に保存する。  
  (Edgeならば、適当なところを右クリックし、名前を付けて保存から保存できる)

## 授業期間を設定する

1. `main.py`を開き、`CLASS_START_DATE`の値を授業開始日に、`CLASS_END_DATE`の値を授業終了日にする。

## コマンドを実行する

1. 以下がインストールされていることを前提とする。インストールしてない場合は、適宜インストールしてください。  
  - python3.10^
  - poetry

2. `poetry shell`を実行する。（仮想環境を立ち上げて、依存ライブラリをインストールする。）  
  (poetryが無い場合は、適宜`pyproject.toml`のdependenciesに書いてあるライブラリを`pip install`してください)

3. `python3 main.py`を実行する。（実行結果は`logs/20XX-XX-XX-XX-XX.log`に保存される。）

# 付録

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
