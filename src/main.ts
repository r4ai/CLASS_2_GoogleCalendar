import {
  Document,
  DOMParser,
  Element,
} from "https://deno.land/x/deno_dom@v0.1.45/deno-dom-wasm.ts";
import { brightGreen, gray, underline } from "jsr:@std/fmt@0.223.0/colors";
import * as fs from "node:fs/promises";
import {
  addDay,
  dayStart,
  diffDays,
  isAfter,
  parse,
} from "npm:@formkit/tempo@0.1.1";
import { input, select } from "npm:@inquirer/prompts@5.0.1";
import { events2csv } from "./csv.ts";
import { Events } from "./events.ts";
import { createEmptyTimeTable, getScheduleOf, TimeTable } from "./timetable.ts";
import { date, dbg, entries, setTime } from "./utils.ts";
import { timetable2iCal } from "./ical.ts";

const parseHtml = async (filePath: string) => {
  const html = await fs.readFile(filePath, { encoding: "utf-8" });
  const doc = new DOMParser().parseFromString(html, "text/html");
  if (!doc) {
    throw new Error(
      `HTMLのパースに失敗しました。HTMLファイルが${filePath}に存在するか確認してください。`,
    );
  }
  return doc;
};

type WeekdayNumber = 1 | 2 | 3 | 4 | 5 | 6;

const getWeekday = (i: WeekdayNumber) => {
  switch (i) {
    case 1:
      return "monday";
    case 2:
      return "tuesday";
    case 3:
      return "wednesday";
    case 4:
      return "thursday";
    case 5:
      return "friday";
    case 6:
      return "saturday";
    default:
      throw new Error("曜日のインデックスが不正です。");
  }
};

const parseCredits = (creditsStr?: string) => {
  if (!creditsStr) return undefined;
  return parseInt(creditsStr.replace("単位", ""));
};

type ClassPeriod = 1 | 2 | 3 | 4 | 5 | 6 | 7;

const getTimeTable = (doc: Document) => {
  const timetable = createEmptyTimeTable();

  const timeTableEl = doc.querySelector("table.classTable > tbody");
  if (!timeTableEl) {
    throw new Error(
      "時間割のテーブル要素が見つかりませんでした。HTMLの構造が変わっていないか確認してください。",
    );
  }

  const rows = timeTableEl.querySelectorAll("tr");

  let classPeriod: ClassPeriod = 1;
  for (const row of rows) {
    const isLunchBreak = (row as Element).querySelector(".colLunch") != null;
    if (isLunchBreak) continue;

    const cells = (row as Element).querySelectorAll("td.colYobi");
    let weekdayNum: WeekdayNumber = 1;
    for (const cell of cells) {
      const weekday = getWeekday(weekdayNum);
      const classInfo = (cell as Element).querySelector(".jugyo-info");
      dbg(weekday, classPeriod, classInfo?.children[0]?.textContent?.trim());

      const isNoClass = classInfo?.classList.contains("noClass");
      if (isNoClass) {
        timetable[weekday][classPeriod] = undefined;
      } else {
        const subject = classInfo?.children[0].textContent.trim();
        const professor = classInfo?.children[1].textContent.trim();
        const location = classInfo?.children[2].textContent.trim();
        const id = classInfo?.children[3].textContent.trim();
        const credits = classInfo?.children[4].textContent.trim();
        timetable[weekday][classPeriod] = {
          subject,
          professor,
          location,
          id,
          credits: parseCredits(credits),
        };
      }

      if (weekdayNum >= 6) break;
      weekdayNum = (weekdayNum + 1) as WeekdayNumber;
    }

    if (classPeriod >= 7) break;
    classPeriod = (classPeriod + 1) as WeekdayNumber;
  }

  return timetable;
};

const timetable2events = (
  timetable: TimeTable,
  startDate: Date,
  endDate: Date,
) => {
  const events: Events = [];

  const days = diffDays(endDate, startDate);
  for (let i = 0; i < days; i++) {
    const date = dayStart(addDay(startDate, i));
    if (isAfter(date, endDate)) break;
    if (date.getDay() === 0) continue; // Skip Sunday

    const weekday = getWeekday(date.getDay() as WeekdayNumber);
    for (const [classPeriod, classInfo] of entries(timetable[weekday])) {
      if (classInfo == null) continue;
      const schedule = getScheduleOf(classPeriod);
      const start = setTime(date, schedule.start.hour, schedule.start.minute);
      const end = setTime(date, schedule.end.hour, schedule.end.minute);
      events.push({
        subject: classInfo.subject ?? "NULL",
        description:
          `授業コード: ${classInfo.id}\n教員名: ${classInfo.professor}\n単位数: ${classInfo.credits}単位`,
        location: classInfo.location,
        start,
        end,
      });
    }
  }

  return events;
};

const validateDate = (input: string) => {
  try {
    parse(input);
  } catch (e) {
    return e.message as string;
  }
  return true;
};

if (import.meta.main) {
  const filePath = await input({
    message: `学生時間割表のHTMLファイルのパスを入力してください\n  ${
      gray(
        'Edge ならば適当なところを右クリックし、"名前を付けて保存" から保存できる',
      )
    }`,
    default: "input.html",
  }).catch(() => Deno.exit(1));
  const doc = await parseHtml(filePath);
  const timetable = getTimeTable(doc);

  const startDate = date(
    await input({
      message: "授業開始日を入力してください",
      default: "2024-04-01",
      validate: validateDate,
    }).catch(() => Deno.exit(1)),
  );
  const endDate = date(
    await input({
      message: "授業終了日を入力してください",
      default: "2024-08-05",
      validate: (input) => {
        const res = validateDate(input);
        if (res !== true) return res;

        const endDate = date(input);
        if (isAfter(startDate, endDate)) {
          return "授業終了日は授業開始日より後の日付を指定してください";
        }
        return true;
      },
    }).catch(() => Deno.exit(1)),
  );
  const events = timetable2events(timetable, startDate, endDate);

  const calendarName = await input({
    message: "カレンダーの名前を入力してください",
    default: "時間割/学部1年-前期",
  }).catch(() => Deno.exit(1));

  const format = await select({
    message: "出力形式を選択してください",
    choices: [
      {
        name: "iCalender",
        value: "ics",
        description: "iCalender形式で出力します",
      },
      {
        name: "CSV",
        value: "csv",
        description: "CSV形式で出力します",
      },
    ],
  }).catch(() => Deno.exit(1));
  const outputFilePath = await input({
    message: "出力ファイルのパスを指定してください",
    default: `output.${format}`,
  }).catch(() => Deno.exit(1));
  switch (format) {
    case "csv": {
      const csv = events2csv(events);
      await fs.writeFile(outputFilePath, csv);
      break;
    }
    case "ics": {
      const ics = timetable2iCal(timetable, calendarName, startDate, endDate);
      await fs.writeFile(outputFilePath, ics);
      break;
    }
  }
  console.log();
  console.log(
    ` ${brightGreen("Success!")} ${
      underline(
        outputFilePath,
      )
    } に時間割のカレンダーデータを出力しました。`,
  );
  Deno.exit(0);
}
