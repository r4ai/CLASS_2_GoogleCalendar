from asyncio import events
from logging import getLogger
import requests
import os
from dotenv import load_dotenv
from bs4 import BeautifulSoup
import datetime
from googleapiclient.discovery import build
from google.auth import load_credentials_from_file
from pprint import pprint
from pathlib import Path
from log import initLog

logger = initLog()
load_dotenv()

### CHANGE REQUIRED DATA ######################################################
INPUT_FILE = Path("data/calendar.html")
CREDENTIALS_JSON_FILE = Path("env/credentials.json")
CLASS_START_DATE = datetime.date(2023, 9, 11) # 月曜日にすること
CLASS_END_DATE = datetime.date(2024, 1, 28)    # 月曜日にすること
###############################################################################


SCOPES = ["https://www.googleapis.com/auth/calendar"]
CREDENTIALS_JSON = load_credentials_from_file(CREDENTIALS_JSON_FILE, SCOPES)[0]
CALENDAR_ID = os.getenv("CALENDAR_ID")


def main():
    service = build("calendar", "v3", credentials=CREDENTIALS_JSON)
    soup = BeautifulSoup(open(INPUT_FILE), "html.parser")
    raw_data = soup.select("table.classTable tbody tr td.colYobi div.jugyo-normal")
    date_list = ["月", "火", "水", "木", "金", "土"]

    if CLASS_START_DATE.weekday() != 0:
        logger.error("ERROR: 授業開始日は月曜日にしてください。")
        logger.error("ERROR: 例: 開始日が4/11(火)の場合、4/10(月)に変更してください。")
        return

    if len(raw_data) < 1:
        logger.error("ERROR: HTMLが不正です。")
        return

    if CLASS_START_DATE >= CLASS_END_DATE:
        logger.error("ERROR: 授業開始日が授業終了日よりも後になっています。")
        return

    for i, item in enumerate(raw_data):
        date_i = i % 6
        time_i = i // 6
        date = date_list[date_i]
        time = time_i + 1
        logger.debug(f"---{date}:{time}---")
        if len(item) > 1:
            title = (
                item.select("div")[0]
                .text.replace("\r", "")
                .replace("\n", "")
                .replace("\t", "")
            )
            professor_name = item.select("div")[1].text
            location = item.select("div span")[0].text
            class_id = item.select("div")[3].text
            tannisu = item.select("div.taniSu")[0].text

            class_date = CLASS_START_DATE + datetime.timedelta(days=date_i)
            class_time = getClassTime(time_i, class_date)
            start = class_time["start"]
            end = class_time["end"]

            event_content = {
                "summary": title,
                "location": location,
                "description": f"{professor_name} / {class_id} / {tannisu}",
                "start": start,
                "end": end,
                "recurrence": [
                    f"RRULE:FREQ=WEEKLY;UNTIL={str(CLASS_END_DATE).replace('-', '')}T000000Z"
                ],
                "reminders": {
                    "useDefault": True,
                },
            }

            logger.debug(event_content)
            e = createEvent(service, event_content)
            logger.debug(f"calendar_schedule_id: {e}")
            logger.info(f"{date}曜{time}限 の {title} をGoogleカレンダーに登録しました。")
        else:
            logger.debug(f"{date}曜{time}限 には授業が登録されていません。")
    logger.info("Googleカレンダーへの登録が完了しました。")


def getClassTime(time: int, class_date: datetime.date) -> dict:
    time = str(time + 1)
    class_time_data = {
        "1": {
            "start": {
                "dateTime": f"{class_date}T08:50:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T10:20:00+09:00",
                "timeZone": "Japan",
            },
        },
        "2": {
            "start": {
                "dateTime": f"{class_date}T10:30:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T12:00:00+09:00",
                "timeZone": "Japan",
            },
        },
        "3": {
            "start": {
                "dateTime": f"{class_date}T13:00:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T14:30:00+09:00",
                "timeZone": "Japan",
            },
        },
        "4": {
            "start": {
                "dateTime": f"{class_date}T14:40:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T16:10:00+09:00",
                "timeZone": "Japan",
            },
        },
        "5": {
            "start": {
                "dateTime": f"{class_date}T16:20:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T17:50:00+09:00",
                "timeZone": "Japan",
            },
        },
    }
    return class_time_data[time]


def createEvent(service, event_content: dict) -> str:
    create_event = (
        service.events().insert(calendarId=CALENDAR_ID, body=event_content).execute()
    )
    return create_event["id"]


if __name__ == "__main__":
    logger.info(f"授業開始日: {CLASS_START_DATE}")
    logger.info(f"授業終了日: {CLASS_END_DATE}")
    logger.info(f"GoogleカレンダーID: {CALENDAR_ID}")
    shouldStart = input("以上の内容で実行します。よろしいですか？(Y/n) ")
    if shouldStart != "Y" and shouldStart != "y":
        logger.info("処理を中断しました。")
        exit(1)
    logger.info("Googleカレンダーへの登録を開始します。")
    main()
