import dayjs from "dayjs";

/** Returns ["MMM-YYYY", …] for the last 3 full months. */
export function getRecent3MonthsKeys() {
  const now = dayjs();
  return [1, 2, 3].map((i) =>
    now.subtract(i, "month").format("MMM-YYYY")
  );
}

/** Given an array of month‑keys ["Jan-2025", …], returns unique sorted DESC. */
export function sortMonthKeysDesc(keys = []) {
  return Array.from(new Set(keys)).sort((a, b) =>
    dayjs(b, "MMM-YYYY").diff(dayjs(a, "MMM-YYYY"))
  );
}



