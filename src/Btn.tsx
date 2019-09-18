import { Button } from 'antd';
import { ButtonProps } from 'antd/lib/button/button';

import { setLinkProps } from 'hookrouter';
import React from 'react';

const Btn: React.FC<ButtonProps> = ({ href, onClick, ...props }) => {
  if (href) {
    const btnProps = setLinkProps({ href, onClick });
    return (
      <Button href={btnProps.href} onClick={btnProps.onClick} {...props} />
    );
  }
  return <Button {...props} />;
};

export default Btn;
