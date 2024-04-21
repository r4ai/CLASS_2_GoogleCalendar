export type TimeTable = {
  monday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
  tuesday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
  wednesday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
  thursday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
  friday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
  saturday: {
    1: TimeSlot;
    2: TimeSlot;
    3: TimeSlot;
    4: TimeSlot;
    5: TimeSlot;
    6: TimeSlot;
    7: TimeSlot;
  };
};

export type TimeSlot =
  | {
    subject?: string;
    id?: string;
    location?: string;
    credits?: number;
    professor?: string;
  }
  | undefined;

export type Time = {
  hour: number;
  minute: number;
};

export type Schedule = {
  1: {
    start: Time;
    end: Time;
  };
  2: {
    start: Time;
    end: Time;
  };
  3: {
    start: Time;
    end: Time;
  };
  4: {
    start: Time;
    end: Time;
  };
  5: {
    start: Time;
    end: Time;
  };
  6: {
    start: Time;
    end: Time;
  };
  7: {
    start: Time;
    end: Time;
  };
};

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type ParseInt<T> = T extends `0${infer R}` ? ParseInt<R>
  : T extends `${infer N extends number}` ? N
  : never;

export const createEmptyTimeTable = (): TimeTable => ({
  monday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
  tuesday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
  wednesday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
  thursday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
  friday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
  saturday: {
    1: undefined,
    2: undefined,
    3: undefined,
    4: undefined,
    5: undefined,
    6: undefined,
    7: undefined,
  },
});

const time = <
  Hour extends `${Digit}${Digit}`,
  Minute extends `${Digit}${Digit}`,
>(
  timeStr: `${Hour}:${Minute}`,
) => {
  const [hour, minute] = timeStr.split(":").map((v) => parseInt(v)) as [
    ParseInt<Hour>,
    ParseInt<Minute>,
  ];
  return { hour, minute };
};

const schedule = {
  1: {
    start: time("08:50"),
    end: time("10:20"),
  },
  2: {
    start: time("10:30"),
    end: time("12:00"),
  },
  3: {
    start: time("13:00"),
    end: time("14:30"),
  },
  4: {
    start: time("14:40"),
    end: time("16:10"),
  },
  5: {
    start: time("16:20"),
    end: time("17:50"),
  },
  6: {
    start: time("18:10"),
    end: time("19:40"),
  },
  7: {
    start: time("19:50"),
    end: time("21:20"),
  },
} as const satisfies Schedule;

export const getScheduleOf = <Period extends keyof typeof schedule>(
  period: Period,
) => schedule[period];
