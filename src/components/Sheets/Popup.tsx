import { Fragment } from 'react';
import usePopup from '~/store/usePopup';
const Popup = () => {
  const { state: popup } = usePopup();

  console.log(Array.from(popup));

  return Array.from(popup).map(([i, popup]) => <Fragment key={i}>{popup}</Fragment>);
};

export default Popup;
