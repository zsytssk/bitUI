import classnames from 'classnames';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import weekday from 'dayjs/plugin/weekday';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import { sleep } from '@libs/utils/snippets';
import SelectMobile from '@ui/SelectMobile';
import { useUITranslateTpl } from '@ui/useUITranslate';

import { Props } from '../';

import style from './style.module.less';

dayjs.extend(localeData);
dayjs.extend(weekday);
// dayjs.extend(timezone);
dayjs.extend(utc);

type Item = {
  label: string | number;
  value: dayjs.Dayjs;
};

export let dayNow = dayjs();
export default function MobileDatePicker({
  value,
  className,
  dropClassName,
  disabledDate,
  onChange,
  customRender,
  tz,
  title,
}: Omit<Props, 'isMobile'>) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [visible, setVisible] = useState(false);
  const [years, setYears] = useState<Item[]>([]);
  const [months, setMonths] = useState<Item[]>([]);
  const [days, setDays] = useState<Item[]>([]);
  const [year, setYear] = useState<dayjs.Dayjs>();
  const [month, setMonth] = useState<dayjs.Dayjs>();
  const [day, setDay] = useState<dayjs.Dayjs>();
  const disableDateRef = useRef<typeof disabledDate>();
  const monthsRef = useRef<typeof months>();
  const daysRef = useRef<typeof days>();
  const onChangeRef = useRef<typeof onChange>();

  const tpl = useUITranslateTpl();

  useEffect(() => {
    disableDateRef.current = disabledDate;
  }, [disabledDate]);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!visible) {
      return;
    }
    dayNow = dayjs(value || dayNow).utcOffset(tz);
    setYear(dayNow.startOf('year'));
    setMonth(dayNow.startOf('month'));
    setDay(dayNow.startOf('day'));
  }, [value, tz, visible]);

  useEffect(() => {
    if (!disableDateRef.current) {
      return;
    }
    const yearStart = dayNow.startOf('year');
    const years: Item[] = [];
    years.push({
      label: yearStart.year(),
      value: yearStart,
    });
    for (let i = 1; i <= 10; i++) {
      const item = yearStart.subtract(i, 'year');
      if (disableDateRef.current?.(item.valueOf()) && disableDateRef.current?.(item.endOf('year').valueOf())) {
        continue;
      }
      years.unshift({
        label: item.year(),
        value: item,
      });
    }
    for (let i = 1; i <= 10; i++) {
      const item = yearStart.add(i, 'year');
      if (disableDateRef.current?.(item.valueOf()) && disableDateRef.current?.(item.endOf('year').valueOf())) {
        continue;
      }
      years.push({
        label: item.year(),
        value: item,
      });
    }

    setYears(years);
  }, []);

  useEffect(() => {
    if (!year || !disableDateRef.current) {
      return;
    }
    const localMonths: Item[] = [];
    for (let i = 0; i < 12; i++) {
      const item = year.add(i, 'month');
      if (monthIsDisabled(item, disableDateRef.current)) {
        continue;
      }
      localMonths.push({
        label: item.month() + 1,
        value: item,
      });
    }
    monthsRef.current = localMonths;
    setMonths(localMonths);
  }, [year]);

  useEffect(() => {
    if (!month || !disableDateRef.current) {
      return;
    }
    const daysInMonth = month.daysInMonth();
    const mStart = month.startOf('month');
    const dayArr: Item[] = [];
    for (let i = 0; i < daysInMonth; i++) {
      const item = mStart.add(i, 'day');
      if (disableDateRef.current) {
        if (disableDateRef.current?.(item.valueOf())) {
          continue;
        }
      }
      dayArr.push({
        label: item.date(),
        value: item,
      });
    }
    daysRef.current = dayArr;
    setDays(dayArr);
  }, [month]);

  const onMultiUpdate = useCallback(
    async (val: dayjs.Dayjs, index: number) => {
      if (index === 0) {
        if (val.year() === year?.year()) {
          return;
        }
        setYear(val);
        // ??????months????????????????????????????????? month??? ??????day??????
        await sleep(0);
        if (monthsRef.current?.[0].value) {
          setMonth(monthsRef.current?.[0].value);
        }
        await sleep(0);
        if (daysRef.current?.[0].value) {
          setDay(daysRef.current?.[0].value);
        }
      } else if (index === 1) {
        if (val.month() === month?.month()) {
          return;
        }
        setMonth(val);
        await sleep(0);
        if (daysRef.current?.[0].value) {
          setDay(daysRef.current?.[0].value);
        }
      } else if (index === 2) {
        if (val.day() === day?.day()) {
          return;
        }
        setDay(val);
      }
    },
    [day, month, year],
  );

  const onMultiChange = useCallback((val: dayjs.Dayjs[]) => {
    onChangeRef.current?.(val[2].valueOf());
  }, []);

  return (
    <>
      <SelectMobile<dayjs.Dayjs>
        className={classnames(dropClassName, style.datePickerModal)}
        visible={visible}
        onClose={() => setVisible(false)}
        title={title || tpl('select_date')}
        mulData={[years, months, days]}
        mulValue={[year as dayjs.Dayjs, month as dayjs.Dayjs, day as dayjs.Dayjs]}
        isEqual={(item, value) => {
          return item.isSame(value);
        }}
        onMultiUpdate={onMultiUpdate}
        onMultiChange={onMultiChange}
      />
      <div
        className={classnames({
          [className as string]: Boolean(className),
          'date-focused': Boolean(visible),
        })}
        onClick={() => setVisible(true)}
      >
        {customRender ? (
          customRender(value as number, visible)
        ) : (
          <input
            ref={inputRef}
            type="text"
            readOnly
            value={value ? dayjs(value).utcOffset(tz).format('YYYY/MM/DD') : ''}
          />
        )}
      </div>
    </>
  );
}

/** ???????????????????????? ????????????????????? ???????????????????????? */
function monthIsDisabled(time: dayjs.Dayjs, disabledDate: (time: number) => boolean) {
  if (!disabledDate?.(time.valueOf()) || !disabledDate?.(time.endOf('month').startOf('day').valueOf())) {
    return false;
  }
  const daysInMonth = time.daysInMonth();
  const mStart = time.startOf('month');
  for (let i = 0; i < daysInMonth; i++) {
    const item = mStart.add(i, 'day');
    if (disabledDate(item.valueOf())) {
      continue;
    }
    return false;
  }
  return true;
}
