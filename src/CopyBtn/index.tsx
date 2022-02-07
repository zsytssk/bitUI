import classNames from "classnames";
import React, { useState, CSSProperties, ReactNode } from "react";
import SVG from "react-inlinesvg";

import { Tooltip } from "../Tooltip/Tooltip";
import { useUITranslate } from "../useUITranslate";

import { copy } from "./utils";

import separate from "./separate.svg";
import style from "./style.module.less";

export interface CopyBtnPropsType {
  children?: ReactNode | ReactNode[];
  copyValue: any;
  className?: string;
  icon?: false | string;
  iconStyle?: React.CSSProperties;
  hideTitle?: boolean;
  customizeStyles?: React.CSSProperties;
  disabled?: boolean;
  onCopy?: () => void;
}

export const CopyBtn = ({
  children,
  copyValue,
  className,
  icon,
  iconStyle,
  hideTitle = false,
  customizeStyles = {},
  disabled = false,
  onCopy,
}: CopyBtnPropsType) => {
  const langInfo = useUITranslate();
  const [visibleTips, setVisibleTips] = useState(false);

  return (
    <Tooltip
      title={langInfo.copy_success}
      visible={visibleTips}
      className={style.tooltip}
    >
      {children ? (
        <div
          className={classNames({
            [style.disabled]: !copyValue,
            [className as string]: Boolean(className),
          })}
          onClick={() => {
            if (disabled) {
              return;
            }
            copy(copyValue).then(() => {
              onCopy?.();
              setVisibleTips(true);
              setTimeout(() => setVisibleTips(false), 1500);
            });
          }}
        >
          {children}
        </div>
      ) : (
        <a
          className={classNames(style.copyButton, {
            [style.disabled]: !copyValue,
            [className as string]: Boolean(className),
          })}
          style={customizeStyles}
          onClick={() => {
            if (disabled) {
              return;
            }

            copy(copyValue).then(() => {
              onCopy?.();
              setVisibleTips(true);
              setTimeout(() => setVisibleTips(false), 1500);
            });
          }}
        >
          {icon !== false && (
            <SVG
              src={icon || separate}
              style={{
                marginRight: hideTitle ? "0" : "6px",
                ...iconStyle,
              }}
            />
          )}
          {!hideTitle && langInfo.copy}
        </a>
      )}
    </Tooltip>
  );
};
