import { Injectable } from '@nestjs/common';
const moment = require('moment-timezone')

@Injectable()
export class Utils {
    isNotNumber(value: string): boolean {
        return [undefined, null, ''].includes(value) || !isNaN(Number(value));
    }

    getDateTimeZone(date: Date): string {
        try {
            const timezone: string = String(process.env.TIMEZONE) || 'America/Sao_Paulo';
            const format = 'YYYY-MM-DDTHH:mm:ss.SSSZ';
            const localDate = moment.tz(date, timezone);
            const formattedDate = localDate.format(format);
            return formattedDate;
        } catch (error) {
            console.log({
                getDateTimeZone: error,
                timestamp: new Date(),
                error
            })
            return String(date);
        }
    }

}