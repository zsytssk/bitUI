import classnames from "classnames";
import dayjs from "dayjs";
import { useState, useRef, useEffect, useCallback } from "react";
import SVG from "react-inlinesvg";

import DatePicker from "../DatePicker";
import Modal, { ModalProps } from "../Modal";
import { useUITranslateTpl } from "../useUITranslate";

import IconArrow from "./icon-arrow.svg";
import IconClose from "./icon-close.svg";
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
  recently: any;
  lang: string;
  setVisible: (visible: boolean) => void;
  children: React.ReactNode;
  visible: boolean;
  tz: string;
};

export function MobileOverlay({
  dropdownRef,
  limitDayRange,
  onStartChange,
  onEndChange,
  onRecentlyDay,
  minDay,
  start,
  end,
  recently,
  lang,
  setVisible,
  visible,
  children,
  tz,
}: Props) {
  const [localStart, setLocalStart] = useState(start);
  const [localEnd, setLocalEnd] = useState(end);
  const [localRecently, setLocalRecently] = useState(recently);
  const tpl = useUITranslateTpl();
  const onStartChangeRef = useRef<typeof onStartChange>();
  const onEndChangeRef = useRef<typeof onEndChange>();
  const oonRecentlyDayRef = useRef<typeof onRecentlyDay>();

  useEffect(() => {
    onStartChangeRef.current = onStartChange;
    onEndChangeRef.current = onEndChange;
    oonRecentlyDayRef.current = onRecentlyDay;
  }, [onStartChange, onEndChange, onRecentlyDay]);

  const onLocalStartChange = useCallback(
    (val: number) => {
      const date = dayjs(val);
      setLocalRecently(null);
      const _start = date.startOf("day");
      setLocalStart(_start);

      if (_start.isAfter(localEnd)) {
        setLocalEnd(_start);
      } else if (limitDayRange) {
        const day = _start.clone().add(limitDayRange, "days").endOf("day");
        if (localEnd.isAfter(day)) {
          setLocalEnd(day);
        }
      }
    },
    [limitDayRange, localEnd]
  );

  const onLocalEndChange = useCallback(
    (val: number) => {
      setLocalRecently(null);
      const date = dayjs(val);
      const _end = date.endOf("day");
      setLocalEnd(_end);
      if (_end.isBefore(localStart)) {
        setLocalStart(_end);
      } else if (limitDayRange) {
        const day = _end.clone().subtract(limitDayRange, "days").startOf("day");
        if (localStart.isBefore(day)) {
          setLocalStart(day);
        }
      }
    },
    [limitDayRange, localStart]
  );

  const onLocalRecentlyChange = useCallback((val: number) => {
    setLocalRecently(val);
    setLocalEnd(dayjs().endOf("day"));
    setLocalStart(
      dayjs()
        .subtract(val - 1, "day")
        .startOf("day")
    );
  }, []);

  const onConfirm = useCallback(() => {
    onStartChangeRef.current?.(localStart.valueOf());
    setTimeout(() => {
      onEndChangeRef.current?.(localEnd.valueOf());
    }, 500);
    if (localRecently) {
      oonRecentlyDayRef.current?.(localRecently);
    }
    setVisible(false);
  }, [localEnd, localRecently, localStart, setVisible]);

  const onCancel = useCallback(() => {
    setLocalStart(start);
    setLocalEnd(end);
    setLocalRecently(recently);
    setVisible(false);
  }, [end, recently, setVisible, start]);

  return (
    <>
      {children}
      <Modal
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        transClass={"selectDateH5"}
        className={style.selectDateDropdownH5Wrap}
      >
        <div className="header">
          <span>{tpl("select_date")}</span>
          <span className="close">
            <SVG src={IconClose} />
          </span>
        </div>
        <div
          className="selectDateDropdownBtnH5"
          ref={dropdownRef}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <div className="top">
            <DatePicker
              className="datePicker"
              isMobile={innerWidth <= 768}
              onChange={onLocalStartChange}
              disabledDate={(current: number) => {
                const curDate = dayjs(current).startOf("day");
                if (curDate.isAfter(dayjs())) return true;
                return Boolean(minDay && curDate.isBefore(dayjs(minDay)));
              }}
              value={localStart.valueOf()}
              customRender={(value, visible) => {
                return (
                  <div
                    className={classnames({
                      inputBox: true,
                      inputBoxOpen: visible,
                    })}
                  >
                    <input
                      type="text"
                      readOnly
                      value={
                        value
                          ? dayjs(value).utcOffset(tz).format("YYYY/MM/DD")
                          : ""
                      }
                    />
                    <SVG src={IconArrow} />
                  </div>
                );
              }}
            />
            <span className="space">/</span>
            <DatePicker
              className="datePicker"
              isMobile={innerWidth <= 768}
              onChange={onLocalEndChange}
              disabledDate={(current) => {
                const curDate = dayjs(current).startOf("day");
                if (curDate.isAfter(dayjs())) return true;
                return Boolean(localStart && curDate.isBefore(localStart));
              }}
              value={localEnd.valueOf()}
              customRender={(value) => {
                return (
                  <div className="inputBox">
                    <input
                      type="text"
                      readOnly
                      value={
                        value
                          ? dayjs(value).utcOffset(tz).format("YYYY/MM/DD")
                          : ""
                      }
                    />
                    <SVG src={IconArrow} />
                  </div>
                );
              }}
            />
          </div>

          <div className={classnames("bottom", `adaptation-${lang}`)}>
            <a
              onClick={() => onLocalRecentlyChange(7)}
              className={classnames({ cur: localRecently == 7 })}
            >
              {tpl("recently", { recently: "7" })}
            </a>
            {(typeof limitDayRange === "undefined" ||
              (limitDayRange && limitDayRange > 7)) && (
              <a
                onClick={() => onLocalRecentlyChange(30)}
                className={classnames({ cur: localRecently == 30 })}
              >
                {tpl("recently", { recently: "30" })}
              </a>
            )}
          </div>
          <div className={classnames("footer")}>
            <a onClick={onCancel} className="confirm">
              {tpl("btn_reset")}
            </a>
            <a onClick={onConfirm} className="confirm">
              {tpl("confirm")}
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
}
