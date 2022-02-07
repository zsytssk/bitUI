import React from 'react';
import SVG from 'react-inlinesvg';

import iconLoading from './icon-loading.svg';
import iconSuccess from './icon-success.svg';
import './index.less';

/**
 * 声明
 * @param {boolean} state 状态类型
 * @param {number} styleMode 样式
 * @param {string} className 类名
 * @param {React.ReactNode} children ReactNode
 * @param {"button" | "submit" | "reset" | undefined} type 按钮类型
 */
interface IButtonLoadingProps {
  state?: number;
  styleMode?: number;
  className?: string;
  children: React.ReactNode;
  type?: 'button' | 'submit' | 'reset' | undefined;
}

/**
 * 按钮状态
 * @property DEFAULT 默认
 * @property LOADING 加载
 * @property DISABLE 禁用
 * @property SUCCESS 成功
 */
export const ButtonLoadingState = {
  DEFAULT: 0,
  LOADING: 1,
  DISABLE: 2,
  SUCCESS: 3,
};

/**
 * 获取类名
 * @param {string} name 类名
 * @param {number} mode 样式模式
 * @param {number} state 按钮状态
 */
const getClassName = (name: string, mode: number, state: number) => {
  let classname = `btg-button btg-button_mode${mode}`;

  if (name !== '') {
    classname += name;
  }

  switch (state) {
    case ButtonLoadingState.DEFAULT:
      classname += ' btg-button_default';

      break;
    case ButtonLoadingState.LOADING:
      classname += ' btg-button_loading';

      break;
    case ButtonLoadingState.DISABLE:
      classname += ' btg-button_disable';

      break;
    case ButtonLoadingState.SUCCESS:
      classname += ' btg-button_success';

      break;
  }

  return classname;
};

// 加载按钮
export const ButtonLoading = React.forwardRef(
  (props: IButtonLoadingProps, ref: any): JSX.Element => {
    const { styleMode = 1, type = undefined, className = '', state = ButtonLoadingState.DEFAULT } = props;
    const name = getClassName(className, styleMode, state);

    return (
      <button ref={ref} className={name} type={type} disabled={state !== ButtonLoadingState.DEFAULT}>
        <span>{props.children}</span>
        <i className="loading">
          <SVG src={iconLoading} />
        </i>
        <i className="success">
          <SVG src={iconSuccess} />
        </i>
      </button>
    );
  },
);
