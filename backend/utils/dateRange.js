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

function getDateRange(type, customDateStr) {
    const now = new Date();

    switch (type) {
        case "today":
            return {
                $gte: startOfToday(),
                $lte: endOfToday()
            };

        case "custom_day":
            if (!customDateStr) return null;
            const customDate = parseISO(customDateStr);
            return {
                $gte: new Date(customDate.setHours(0, 0, 0, 0)),
                $lte: new Date(customDate.setHours(23, 59, 59, 999))
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

module.exports = { getDateRange };