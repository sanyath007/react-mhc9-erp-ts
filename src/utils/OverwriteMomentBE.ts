import DateUtils from "@date-io/moment";
import moment from "moment";
import "moment/locale/th";

export default class OverWriteMomentBE extends DateUtils {
    constructor({ locale, formats, instance }: any = {}) {
        super({ locale, formats, instance } as any);
    }

    date = (value: any = null) => {
        if (value === null) return null;

        const m = this.moment(value);
        m.locale(this.locale);

        return m;
    }

    toBuddhistYear(m: moment.Moment, format: string) {
        var christianYear = m.format('YYYY');
        var buddhishYear = (parseInt(christianYear) + 543).toString();

        return m
                .format(format.replace('YYYY', buddhishYear).replace('YY', buddhishYear.substring(2, 4)))
                .replace(christianYear, buddhishYear);
    }

    format = (date: moment.Moment, formatKey: string) => {
        return this.toBuddhistYear(date, formatKey);
    }
}
