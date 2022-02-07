import classnames from "classnames";
import dayjs from "dayjs";
import { useCallback, useEffect, useRef, useState } from "react";
import SVG from "react-inlinesvg";

import { useClickOutside, useRenderTime, useWindowResize } from "../hooks";
import { useUITranslateTpl } from "../useUITranslate";

import { MobileOverlay } from "./MobileOverlay";
import { PcOverlay } from "./PcOverlay";

import iconArrow from "./icon-arrow.svg";
import style from "./style.module.less";

type DefaultValueType = { recentlyDay?: number; start: number; end: number };
export interface PropsType {
  placeHolder?: string;
  defaultValue: DefaultValueType;
  value?: DefaultValueType;
  minDay?: number;
  limitDayRange?: number;
  btnIcon?: string;
  onChange?: (start: number, end: number, recentlyDay?: number) => void;
  onOk?: (start: number, end: number) => void;
  btnStyle?: React.CSSProperties;
  btnClassName?: string;
  dropDownClassName?: string;
  datePickerClassName?: string;
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement | null;
  actRef?: React.MutableRefObject<any>;
  lang?: string;
  tz?: string;
}

export interface FormateDateType {
  start: number;
  end: number;
  recentlyDay: number;
}

export function formateDate({
  recentlyDay,
  start,
  end,
}: {
  recentlyDay: number;
  start?: number;
  end?: number;
}): FormateDateType {
  const endDay = dayjs().endOf("day");
  const startDay = dayjs()
    .subtract(recentlyDay - 1, "day")
    .startOf("day");
  if (recentlyDay) {
  } else if (dayjs().diff(endDay, "days") <= 1) {
  }
  return {
    recentlyDay,
    start: startDay.valueOf(),
    end: endDay.valueOf(),
  };
}

export default function SelectDateBox({
  placeHolder,
  defaultValue,
  value,
  btnStyle,
  onChange,
  limitDayRange,
  minDay,
  btnClassName,
  getPopupContainer,
  actRef,
  lang = "zh-Hans",
  tz = "Asia/Shanghai",
}: PropsType) {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLAnchorElement>(null);
  const renderTime = useRenderTime("MM/DD");
  const onChangeRef = useRef<typeof onChange>();

  const [visible, setVisible] = useState(false);

  const { innerWidth } = useWindowResize();

  const [btnText, setBtnText] = useState<string>(placeHolder || "");
  const [start, setStart] = useState<dayjs.Dayjs>(dayjs(defaultValue.start));
  const [end, setEnd] = useState<dayjs.Dayjs>(dayjs(defaultValue.end));
  const [recently, setRecently] = useState<any>(defaultValue.recentlyDay);
  const langTpl = useUITranslateTpl();

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!recently) {
      const starts = start ? renderTime(start.valueOf()) : "";
      const ends = end ? renderTime(end.valueOf()) : "";

      setBtnText(`${starts}-${ends}`);
    } else {
      setBtnText(langTpl("recently", { recently }));
    }
  }, [start, end, recently, langTpl, renderTime]);

  useEffect(() => {
    onChangeRef.current?.(start.valueOf(), end.valueOf(), recently);
  }, [start, end, recently]);

  const onStartChange = useCallback(
    (val: number) => {
      const date = dayjs(val);
      const endDay = dayjs(end);
      setRecently(null);
      const _start = date.startOf("day");
      setStart(date);

      if (_start.isAfter(endDay)) {
        setEnd(_start);
      } else if (limitDayRange) {
        const day = _start.clone().add(limitDayRange, "days").endOf("day");
        if (endDay.isAfter(day)) {
          setEnd(day);
        }
      }
    },
    [end, limitDayRange]
  );

  const onEndChange = useCallback(
    (val: number) => {
      setRecently(null);
      const date = dayjs(val);
      const startDate = dayjs(start);
      const _end = date.endOf("day");
      setEnd(_end);
      if (_end.isBefore(start)) {
        setStart(_end);
      } else if (limitDayRange) {
        const day = _end.clone().subtract(limitDayRange, "days").startOf("day");
        if (startDate.isBefore(day)) {
          setStart(day);
        }
      }
    },
    [limitDayRange, start]
  );

  const onRecentlyDay = useCallback((day: number) => {
    setRecently(day);
    setEnd(dayjs().endOf("day"));
    setStart(
      dayjs()
        .subtract(day - 1, "day")
        .startOf("day")
    );
    setVisible(false);
  }, []);

  if (actRef && actRef.current) {
    actRef.current = {
      onRecentlyDay,
    };
  }

  useClickOutside(triggerRef, (e) => {
    if (!visible) {
      return;
    }
    if (dropdownRef.current?.contains(e.target as Node)) {
      return;
    }
    setVisible(false);
  });

  return innerWidth >= 768 ? (
    <PcOverlay
      dropdownRef={dropdownRef}
      limitDayRange={limitDayRange}
      onStartChange={onStartChange}
      onRecentlyDay={onRecentlyDay}
      onEndChange={onEndChange}
      minDay={minDay}
      start={start}
      end={end}
      lang={lang}
      visible={visible}
      getPopupContainer={getPopupContainer}
    >
      <a
        className={classnames({
          [style.trigger]: true,
          "picker-focused": visible,
          [btnClassName as string]: Boolean(btnClassName),
        })}
        style={btnStyle}
        onClick={(e) => {
          setVisible(!visible);
        }}
        ref={triggerRef}
      >
        <span className="btnText">{btnText}</span>
        <SVG src={iconArrow} />
      </a>
    </PcOverlay>
  ) : (
    <MobileOverlay
      dropdownRef={dropdownRef}
      limitDayRange={limitDayRange}
      onStartChange={onStartChange}
      onRecentlyDay={onRecentlyDay}
      onEndChange={onEndChange}
      minDay={minDay}
      start={start}
      recently={recently}
      setVisible={setVisible}
      end={end}
      lang={lang}
      visible={visible}
      tz={tz}
    >
      <a
        className={classnames({
          [btnClassName as string]: Boolean(btnClassName),
          [style.trigger]: true,
          "picker-focused": visible,
        })}
        style={btnStyle}
        onClick={(e) => {
          setVisible(!visible);
        }}
        ref={triggerRef}
      >
        <span className="btnText">{btnText}</span>
        <SVG src={iconArrow} />
      </a>
    </MobileOverlay>
  );
}
