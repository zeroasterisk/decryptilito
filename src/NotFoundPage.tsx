import React from "react";
import { Result } from "antd";
import { usePath } from "hookrouter";
import Btn from "./Btn";

const NotFoundPage: React.FC = () => {
  const path = usePath();
  return (
    <div>
      <Result
        status="404"
        title="Bad news chum... 404 Not Found"
        subTitle="Sorry, the page does not exist."
        extra={
          <div>
            <Btn href="/" type="primary" icon="home">
              Go Home
            </Btn>
            <p>
              <code>{path}</code>
            </p>
          </div>
        }
      />
    </div>
  );
};

export default NotFoundPage;
