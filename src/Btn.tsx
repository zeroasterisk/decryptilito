import { Button } from 'antd';
import { setLinkProps } from 'hookrouter';
import React from 'react';

const Btn: React.FC = props => <Button {...setLinkProps(props)} />;

export default Btn;
