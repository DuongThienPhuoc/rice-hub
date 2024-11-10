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
            localDate: date.toISOString(),
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
    { value: 0, label: 'Tháng 1' },
    { value: 1, label: 'Tháng 2' },
    { value: 2, label: 'Tháng 3' },
    { value: 3, label: 'Tháng 4' },
    { value: 4, label: 'Tháng 5' },
    { value: 5, label: 'Tháng 6' },
    { value: 6, label: 'Tháng 7' },
    { value: 7, label: 'Tháng 8' },
    { value: 8, label: 'Tháng 9' },
    { value: 9, label: 'Tháng 10' },
    { value: 10, label: 'Tháng 11' },
    { value: 11, label: 'Tháng 12' },
]
