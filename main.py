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
CLASS_START_DATE = datetime.date(2023, 4, 11)
CLASS_END_DATE = datetime.date(2023, 8, 6)
###############################################################################


LETUS_LOGIN_URL = "https://letus.ed.tus.ac.jp/login/index.php"
SCOPES = ["https://www.googleapis.com/auth/calendar"]
CREDENTIALS_JSON = load_credentials_from_file(CREDENTIALS_JSON_FILE, SCOPES)[0]
CALENDAR_ID = os.getenv("CALENDAR_ID")

logger.info(f"授業開始日: {CLASS_START_DATE}")
logger.info(f"授業終了日: {CLASS_END_DATE}")


def main():
    service = build("calendar", "v3", credentials=CREDENTIALS_JSON)
    soup = BeautifulSoup(open(INPUT_FILE), "html.parser")
    raw_data = soup.select("table.classTable tbody tr td.colYobi div.jugyo-normal")
    date_list = ["月", "火", "水", "木", "金", "土"]

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


def getClassTime(time: int, class_date: datetime.date) -> dict:
    time = str(time + 1)
    class_time_data = {
        "1": {
            "start": {
                "dateTime": f"{class_date}T09:00:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T10:30:00+09:00",
                "timeZone": "Japan",
            },
        },
        "2": {
            "start": {
                "dateTime": f"{class_date}T10:40:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T12:10:00+09:00",
                "timeZone": "Japan",
            },
        },
        "3": {
            "start": {
                "dateTime": f"{class_date}T13:10:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T14:40:00+09:00",
                "timeZone": "Japan",
            },
        },
        "4": {
            "start": {
                "dateTime": f"{class_date}T14:50:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T16:20:00+09:00",
                "timeZone": "Japan",
            },
        },
        "5": {
            "start": {
                "dateTime": f"{class_date}T16:30:00+09:00",
                "timeZone": "Japan",
            },
            "end": {
                "dateTime": f"{class_date}T18:00:00+09:00",
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
    main()
