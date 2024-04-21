import { Events } from "./events.ts"
import { format } from "npm:@formkit/tempo@0.1.1"
import { stringify } from "jsr:@std/csv@0.223.0"

type GoogleCalendarEvent = {
  Subject: string
  "Start Date": string
  "Start Time": string
  "End Date": string
  "End Time": string
  "All Day Event": "True" | "False"
  Description: string
  Location: string
  Private: "True" | "False"
}

/**
 * イベントの配列をCSV形式の文字列に変換します
 * CSVのフォーマットはGoogle CalendarのImport/Export機能に準拠しています
 * @see https://support.google.com/calendar/answer/37118?hl=en#zippy=%2Ccreate-or-edit-a-csv-file
 */
export const events2csv = (events: Events) => {
  const header = [
    "Subject",
    "Start Date",
    "Start Time",
    "End Date",
    "End Time",
    "All Day Event",
    "Description",
    "Location",
    "Private",
  ] as const satisfies (keyof GoogleCalendarEvent)[]
  const dateFormat = "MM/DD/YYYY" // e.g. 05/30/2020
  const timeFormat = "hh:mm A" // e.g. 10:00 AM
  const body = events.map(
    (event) =>
      ({
        Subject: event.subject,
        "Start Date": format(event.start, dateFormat),
        "Start Time": format(event.start, timeFormat),
        "End Date": format(event.end, dateFormat),
        "End Time": format(event.end, timeFormat),
        "All Day Event": "False",
        Description: event.description ?? "",
        Location: event.location ?? "",
        Private: "False",
      } as const satisfies GoogleCalendarEvent)
  )
  return stringify(body, { columns: header })
}
