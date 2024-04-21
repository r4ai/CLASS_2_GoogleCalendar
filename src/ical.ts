import { addDay, dayEnd, isAfter, weekStart } from "npm:@formkit/tempo@0.1.1";
import iCal, { ICalEventRepeatingFreq } from "npm:ical-generator@7.1.0";
import { getScheduleOf, TimeTable } from "./timetable.ts";
import { entries, setTime } from "./utils.ts";

const getDayNumber = (day: keyof TimeTable) => {
  switch (day) {
    case "monday":
      return 1;
    case "tuesday":
      return 2;
    case "wednesday":
      return 3;
    case "thursday":
      return 4;
    case "friday":
      return 5;
    case "saturday":
      return 6;
  }
  throw new Error("Invalid day");
};

const nextDay = (data: Date, day: keyof TimeTable) => {
  const thisWeekDay = weekStart(data, getDayNumber(day));
  if (isAfter(thisWeekDay, data)) {
    return thisWeekDay;
  } else {
    return addDay(thisWeekDay, 7);
  }
};

export const timetable2iCal = (
  timetable: TimeTable,
  name: string,
  startDate: Date,
  endDate: Date,
) => {
  const calendar = iCal({
    name,
    timezone: "Asia/Tokyo",
  });

  for (const [day, lessons] of entries(timetable)) {
    for (const [classPeriod, lesson] of entries(lessons)) {
      if (lesson == null) continue;
      const schedule = getScheduleOf(classPeriod);
      const date = nextDay(startDate, day);
      const start = setTime(date, schedule.start.hour, schedule.start.minute);
      const end = setTime(date, schedule.end.hour, schedule.end.minute);
      calendar.createEvent({
        start,
        end,
        summary: lesson.subject,
        description: `${lesson.id} / ${lesson.professor} / ${lesson.credits}`,
        location: lesson.location,
        repeating: {
          freq: ICalEventRepeatingFreq.WEEKLY,
          until: dayEnd(endDate),
        },
      });
    }
  }

  return calendar.toString();
};
