export function getDaysAndWeekdaysInMonth(year: number, month: number) {
    const days = [];
    const date = new Date(year, month, 1);
    const weekdays = [
        'Chủ nhật',
        'Thứ hai',
        'Thứ ba',
        'Thứ tư',
        'Thứ năm',
        'Thứ sáu',
        'Thứ bảy',
    ];
    while (date.getMonth() === month) {
        days.push({
            day: date.getDate(),
            weekday: weekdays[date.getDay()],
            localDate: date.toLocaleDateString(),
        });
        date.setDate(date.getDate() + 1);
    }
  return days
}

export function getYears() {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 10 }, (_, index) => currentYear - index);
}

export const monthNames = [
    'Tháng 1',
    'Tháng 2',
    'Tháng 3',
    'Tháng 4',
    'Tháng 5',
    'Tháng 6',
    'Tháng 7',
    'Tháng 8',
    'Tháng 9',
    'Tháng 10',
    'Tháng 11',
    'Tháng 12',
]
