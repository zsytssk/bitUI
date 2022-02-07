import style from './style.module.less';

export default () => {
  return (
    <div className={style['loading-content']}>
      <div className="loading">
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};
