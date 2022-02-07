import classnames from "classnames";
import dayjs from "dayjs";
import { FunctionComponentElement } from "react";

import DatePicker from "../DatePicker";
import Dropdown from "../Dropdown";
import { useUITranslateTpl } from "../useUITranslate";

import style from "./style.module.less";

type Props = {
  dropdownRef?: React.RefObject<HTMLDivElement>;
  limitDayRange?: number;
  onStartChange: (val: number) => void;
  onEndChange: (val: number) => void;
  onRecentlyDay: (val: number) => void;
  minDay?: number;
  start: dayjs.Dayjs;
  end: dayjs.Dayjs;
  lang: string;
  visible: boolean;
  children: FunctionComponentElement<any>;
  getPopupContainer?: (triggerNode: HTMLElement | null) => HTMLElement | null;
};
export function PcOverlay({
  dropdownRef,
  limitDayRange,
  onStartChange,
  onEndChange,
  onRecentlyDay,
  minDay,
  start,
  end,
  lang,
  visible,
  children,
  getPopupContainer,
}: Props) {
  const langTpl = useUITranslateTpl();

  return (
    <Dropdown
      visible={visible}
      overlayClassName={innerWidth >= 768 ? "" : style.selectDateDropdownH5Wrap}
      offset={innerWidth >= 768 ? 10 : 5}
      getPopupContainer={getPopupContainer}
      overlay={() => {
        return (
          <div className={style.selectDateDropdownBtn} ref={dropdownRef}>
            <p>{langTpl("start_time")}</p>
            <DatePicker
              className="datePicker"
              dropClassName="datePickerDrop"
              isMobile={innerWidth <= 768}
              onChange={onStartChange}
              getPopupContainer={getPopupContainer ? (dom) => dom : undefined}
              disabledDate={(current: number) => {
                const curDate = dayjs(current).startOf("day");
                if (curDate.isAfter(dayjs())) return true;
                return Boolean(minDay && curDate.isBefore(dayjs(minDay)));
              }}
              value={start.valueOf()}
            />
            <p>{langTpl("end_time")}</p>
            <DatePicker
              className="datePicker"
              dropClassName="datePickerDrop"
              isMobile={innerWidth <= 768}
              onChange={onEndChange}
              getPopupContainer={getPopupContainer ? (dom) => dom : undefined}
              disabledDate={(current) => {
                const curDate = dayjs(current).startOf("day");
                if (curDate.isAfter(dayjs())) return true;
                return Boolean(start && curDate.isBefore(start));
              }}
              value={end.valueOf()}
            />
            <div className={classnames("footer", `adaptation-${lang}`)}>
              <a onClick={() => onRecentlyDay(7)}>
                {langTpl("recently", { recently: "7" })}
              </a>
              {(typeof limitDayRange === "undefined" ||
                (limitDayRange && limitDayRange > 7)) && (
                <a onClick={() => onRecentlyDay(30)}>
                  {langTpl("recently", { recently: "30" })}
                </a>
              )}
            </div>
          </div>
        );
      }}
    >
      {children}
    </Dropdown>
  );
}
