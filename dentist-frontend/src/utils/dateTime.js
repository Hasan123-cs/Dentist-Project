import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(timezone);

const LEBANON_TIME_ZONE = "Asia/Beirut";

export function formatLebanonDateTime(value, format) {
  return dayjs.utc(value).tz(LEBANON_TIME_ZONE).format(format);
}

export function getTomorrowLebanonDate() {
  return dayjs().tz(LEBANON_TIME_ZONE).add(1, "day").format("YYYY-MM-DD");
}
