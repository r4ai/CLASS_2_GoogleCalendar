export type Event = {
  subject: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
};

export type Events = Event[];
