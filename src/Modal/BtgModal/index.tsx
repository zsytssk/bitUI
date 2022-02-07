import classnames from 'classnames';
import SVG from 'react-inlinesvg';

import Modal, { ModalProps } from '@ui/Modal';

import iconClose from './icon-close.svg';
import style from './style.module.less';

type Props = ModalProps & {
  className?: string;
  title: string;
  visible?: boolean;
  onClose?: () => void;
  onCancel?: () => void;
  children: React.ReactNode | React.ReactNode[];
};

const BtgModal: React.FC<Props> = (props) => {
  const { className, title, visible, onClose, onCancel, children } = props;

  return (
    <Modal
      {...props}
      onCancel={onClose || onCancel}
      className={classnames({ [style.seModal]: true, [className as string]: Boolean(className) })}
    >
      <div className="header">
        {title}
        <div className="close" onClick={onClose || onCancel}>
          <SVG src={iconClose} />
        </div>
      </div>
      <div className="con">{children}</div>
    </Modal>
  );
};

export default BtgModal;
