export function getTimezoneFromNumber(number) {
    if (number.startsWith('91'))
        return 'Asia/Kolkata';
    if (number.startsWith('62'))
        return 'Asia/Jakarta';
    if (number.startsWith('1'))
        return 'America/New_York';
    if (number.startsWith('44'))
        return 'Europe/London';
    return 'UTC';
}
