import { Injectable } from '@nestjs/common';

@Injectable()
export class Utils {
    isNotNumber(value: string): boolean {
        return [undefined, null, ''].includes(value) || !isNaN(Number(value));
    }
}