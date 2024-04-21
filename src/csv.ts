import { Events } from "./events.ts"
import { format } from "npm:@formkit/tempo@0.1.1"
import { stringify } from "jsr:@std/csv@0.223.0"

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
  ]
  const dateFormat = "MM/DD/YYYY" // e.g. 05/30/2020
  const timeFormat = "hh:mm A" // e.g. 10:00 AM
  const body = events.map((event) => [
    event.subject,
    format(event.start, dateFormat),
    format(event.start, timeFormat),
    format(event.end, dateFormat),
    format(event.end, timeFormat),
    "False",
    event.description,
    event.location,
    "True",
  ])
  return stringify([header, ...body])
}
