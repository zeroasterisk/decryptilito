import React from "react";
import { setLinkProps } from "hookrouter";
import { Button } from "antd";

const Btn: React.FC = props => <Button {...setLinkProps(props)} />;

export default Btn;
