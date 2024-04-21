import process from "node:process"
import { tzDate } from "npm:@formkit/tempo@0.1.1";

const DEBUG = process.env.DEBUG?.toLocaleLowerCase() === "true"

export const dbg = (...args: unknown[]) => {
  if (DEBUG) console.log(...args)
}

export const entries = <T extends object>(obj: T) =>
  Object.entries(obj) as [keyof T, T[keyof T]][]

export const setTime = (date: Date, hours: number, minutes: number) => {
  const newDate = new Date(date)
  newDate.setHours(hours)
  newDate.setMinutes(minutes)
  return newDate
}

export const date = (input: string) => tzDate(input, "Asia/Tokyo")
