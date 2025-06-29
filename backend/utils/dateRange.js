// utils/dateRange.js or dateRange.ts (if using TypeScript)
const {
    endOfMonth,
    endOfToday,
    endOfWeek,
    startOfMonth,
    startOfToday,
    startOfWeek,
    subMonths,
    subWeeks
} = require("date-fns");

function getDateRange(type) {
  const now = new Date();

  switch (type) {
    case "today":
      return {
        $gte: startOfToday(),
        $lte: endOfToday()
      };

    case "this_week":
      return {
        $gte: startOfWeek(now, { weekStartsOn: 0 }), // Sunday
        $lte: endOfWeek(now, { weekStartsOn: 0 })
      };

    case "last_week":
      return {
        $gte: startOfWeek(subWeeks(now, 1), { weekStartsOn: 0 }),
        $lte: endOfWeek(subWeeks(now, 1), { weekStartsOn: 0 })
      };

    case "this_month":
      return {
        $gte: startOfMonth(now),
        $lte: endOfMonth(now)
      };

    case "last_month":
      return {
        $gte: startOfMonth(subMonths(now, 1)),
        $lte: endOfMonth(subMonths(now, 1))
      };

    default:
      return null;
  }
}

module.exports = {getDateRange};