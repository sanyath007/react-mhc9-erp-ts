import { PRIORITIES, DUTIES, EXPENSES, MONTH_NAMES } from "../constants"
import moment from "moment";

export const getPriority = (id: number | string) => {
    if (!id || id === '') return null;

    return PRIORITIES.find(priority => priority.id === parseInt(id.toString(), 10));
};

export const getDuty = (id: number | string) => {
    if (!id || id === '') return null;

    return DUTIES.find(duty => duty.id === parseInt(id.toString(), 10));
};

export const getExpense = (id: number | string) => {
    if (!id || id === '') return null;

    return EXPENSES.find(expense => expense.id === parseInt(id.toString(), 10));
};

export const calcAgeY = (birthdate: string) => {
    if (!birthdate) return 0

    return moment().diff(moment(birthdate), "years") 
};

export const calcUsedAgeY = (firstYear: number) => {
    return moment().year() - (firstYear - 543);
};

export const calculateTotal = (price: number, amount: number) => {
    return price * amount;
};

export const calculateNetTotal = (items: any[] = [], condition: (args: any) => boolean = (args) => false) => {
    return items.reduce((sum: number = 0, item: any) => {
        return (condition(item.removed)) ? sum + 0 : sum + parseFloat(item.total);
    }, 0);
};

export const calculateVat = function(netTotal: number, vatRate: number) {
    return (netTotal * vatRate) / (100 + vatRate);
};

export const currency = Intl.NumberFormat('th-TH', {maximumFractionDigits:2});

export const currencyToNumber = function(currency: string | number): number {
    if (typeof currency === 'number') return currency;
    if (currency == '') return 0;

    return parseFloat(currency.replaceAll(',', ''));
};

export const toShortTHDate = (dateStr: string) => {
    if (!dateStr || dateStr === '') return '';

    const [year, month, day] = dateStr.split('-');

    return `${day}/${month}/${parseInt(year, 10) + 543}`;
};

export const toLongTHDate = (date: Date) => {
    return date.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

export const toLongTHDateWithBE = (dateStr: string) => {
    if (!dateStr || dateStr === '') return '';

    const [year, month, day] = dateStr.split('-');

    return `${parseInt(day, 10)} ${MONTH_NAMES[parseInt(month) - 1]} พ.ศ. ${parseInt(year, 10) + 543}`;
}

export const toShortTHDateRange = (startDate: string, endDate?: string) => {
    if (!startDate || startDate === '') return '';

    const [syear, smonth, sday] = startDate.split('-');
    
    if (!endDate) {
        return `${sday}/${smonth}/${parseInt(syear, 10) + 543}`;
    } else {
        const [eyear, emonth, eday] = endDate.split('-');

        if (syear === eyear && smonth === emonth) {
            return `${sday}-${eday}/${smonth}/${parseInt(syear, 10) + 543}`;
        } else {
            return `${sday}/${smonth}/${parseInt(syear, 10) + 543}-${eday}/${emonth}/${parseInt(eyear, 10) + 543}`;
        }
    }
};

export const toLongTHDateRange = (startDate: string, endDate?: string) => {
    if (!startDate || startDate === '') return '';

    const [syear, smonth, sday] = startDate.split('-');

    /** ถ้าวันที่สิ้นสุดไม่ได้ระบุ หรือ วันที่เริ่มกับวันที่สิ้นสุดเป็นวันเดียวกัน */
    if (!endDate || (endDate && moment(endDate).diff(moment(startDate), "day")) === 0) {
        return `${parseInt(sday, 10)} ${MONTH_NAMES[parseInt(smonth) - 1]} ${parseInt(syear, 10) + 543}`;
    } else {
        const [eyear, emonth, eday] = endDate.split('-');

        if (syear === eyear && smonth === emonth) {
            return `${parseInt(sday, 10)}-${parseInt(eday, 10)} ${MONTH_NAMES[parseInt(smonth) - 1]} ${parseInt(syear, 10) + 543}`;
        } else {
            return `${parseInt(sday, 10)} ${MONTH_NAMES[parseInt(smonth) - 1]} ${parseInt(syear, 10) + 543}-${parseInt(eday, 10)} ${MONTH_NAMES[parseInt(emonth) - 1]} ${parseInt(eyear, 10) + 543}`;
        }
    }
};

export const filterAmphursByChangwat = (changwat: string | number, amphurs: any[] = []) => {
    return amphurs.filter(amp => amp.chw_id === changwat);
};

export const filterTambonsByAmphur = (amphur: string | number, tambons: any[] = []) => {
    return tambons.filter(tam => tam.amp_id === amphur);
};

export const generateQueryString = (inputs: Record<string, string | number | boolean>) => {
    let queryStr = '';

    for (const [key, val] of Object.entries(inputs)) {
        queryStr += `&${key}=${val}`;
    }

    return queryStr;
};

export const isExisted = (items: any[], fieldName = 'id', id: any) => {
    return items.some(item => item[fieldName] === id);
};

export const replaceExpensePattern = (pattern: string = '', replacement: string = '') => {
    const [p_amount, p_time, p_price] = pattern.split('X');
    const [r_amount, r_time, r_price] = replacement.split('*');

    return `${p_amount.replace('...', r_amount)}X${p_time.replace('...', r_time)}X${p_price.replace('...', r_price)}`;
};

export const replaceExpensePatternFromDesc = (pattern: string = '', replacement: string = '') => {
    if (replacement.includes('+')) {
        const groups = replacement.split('+').map(group => replaceExpensePattern(pattern, group));

        return groups.join('+');
    } else {
        return replaceExpensePattern(pattern, replacement);
    }
};

export const calculateWithPattern = (pattern: string) => {
    const [amount, time, price] = pattern.split('*');

    return parseFloat(amount) * parseFloat(time) * parseFloat(price);
};

export const calculateTotalFromDescription = (desc: string = '') => {
    if (desc.includes('+')) {
        const groups = desc.split('+');

        return groups.reduce((sum, curVal) => sum + calculateWithPattern(curVal), 0);
    } else {
        return calculateWithPattern(desc);
    }
};

export const getPatternOfExpense = (expenses: any[], id: string | number) => {
    return expenses?.find(exp => exp.id === parseInt(id.toString(), 10))?.pattern;
};

export const getFormDataItem = (data: any, dataName: string, id: any) => {
    if (!data) return null;

    return data[dataName].find((item: any) => item.id === id);
}

export const isOverRefundDate = (refundDate: string) => {
    return moment().diff(moment(refundDate), "days") > 0;
};

export const sortObjectByDate = (a: any, b: any, type: string = 'ASC') => {
    if (type === 'ASC') {
        return moment(a).toDate().getTime() - moment(b).toDate().getTime();
    } else {
        return moment(b).toDate().getTime() - moment(a).toDate().getTime();
    }
}

export const removeItemWithFlag = (items: any[], id: any, isNew: boolean) => {
    if (isNew) {
        return items.filter(item => item.id !== id);
    } else {
        /** Create new items array by setting removed flag if item is removed by user */
        return items.map(item => {
            if (item.id === id) return { ...item, removed: true };

            return item;
        });
    }
};

export const getUrlParam = (url: string, paramName: string) => {
    const params = new URLSearchParams(url);

    return params.get(paramName);
};

export const setFieldTouched = (formik: any, fieldName: string) => {
    setTimeout(() => formik.setFieldTouched(fieldName, true));
}

export const filesizes = (bytes: number, decimals: number = 2) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
};
