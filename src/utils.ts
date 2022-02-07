import { useEffect } from 'react';

export type PlacementPos = {
  top: number;
  left: number;
};
export type Placement = 'top' | 'left' | 'right' | 'bottom';

export function getPlacementPos(placement: Placement, dom: HTMLElement, localDom: HTMLElement, offset: number) {
  const bounds = dom.getBoundingClientRect();
  const localBounds = localDom.getBoundingClientRect();
  // let { scrollTop, scrollLeft } = document.documentElement;
  const { clientWidth, clientHeight } = document.body;

  const scrollTop = window.scrollY;
  const scrollLeft = window.scrollX;
  let left = 0;
  let top = 0;

  if (placement === 'right') {
    left = scrollLeft + bounds.left + bounds.width + offset;
    top = scrollTop + bounds.top + bounds.height / 2 - localBounds.height / 2;
  } else if (placement === 'top') {
    left = scrollLeft + bounds.left + (bounds.width - localBounds.width) / 2;
    top = scrollTop + bounds.top - localBounds.height - offset;
  } else if (placement === 'left') {
    left = scrollLeft + bounds.left - localBounds.width - offset;
    top = scrollTop + bounds.top + bounds.height / 2 - localBounds.height / 2;
  } else if (placement === 'bottom') {
    left = scrollLeft + bounds.left + (bounds.width - localBounds.width) / 2;
    top = scrollTop + bounds.top + bounds.height + offset;
  }

  if (left < 10) {
    left = 10;
  } else if (left + bounds.width - clientWidth > 10) {
    left = clientWidth - bounds.width - 10;
  }

  if (top < 10) {
    top = 10;
  } else if (top + bounds.height - clientHeight > 10) {
    left = clientHeight - bounds.height - 10;
  }

  return { left, top };
}

//获取url参数方法
export function getUrlParam(name: string) {
  //构造一个含有目标参数的正则表达式对象
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  //匹配目标参数
  const r = window.location.search.substr(1).match(reg);
  //返回参数
  if (r != null) {
    return unescape(r[2]);
  } else {
    return null;
  }
}
