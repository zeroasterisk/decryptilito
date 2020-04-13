import React, { useState } from 'react';
import {
  Col,
  Row,
  Card,
  Result,
  // Modal,
  // Form,
  // Input,
} from 'antd';

import { RightOutlined, HomeOutlined } from '@ant-design/icons';

import Btn from '../btn';

import {
  loginWithGoogle,
  loginWithGithub,
  // loginWithEmail,
  // signOut,
  // createUserWithEmail,
  useSession,
} from '../../auth';

// Auth if authenticated
// Auth if anon

interface AuthProps {}

interface AuthAuthenticatedProps {
  user?: firebase.User;
}
const AuthAuthenticated: React.FC<AuthAuthenticatedProps> = ({ user }) => {
  return (
    <div>
      <Result
        status="success"
        title="You are already logged in"
        subTitle="bada boom bada bing"
        extra={
          <div>
            <Btn href="/lobby" type="primary" icon={<RightOutlined />}>
              Game Lobby
            </Btn>
            <Btn href="/" type="primary" icon={<HomeOutlined />}>
              Go Home
            </Btn>
          </div>
        }
      />
    </div>
  );
};

const AuthAnon: React.FC<AuthProps> = () => {
  // login details
  const [error, setError] = useState('');
  const [loading, setLoading] = React.useState(false);
  // created new user
  const [visible, setVisible] = useState(false);
  const openModel = () => setVisible(true);

  // Promise<UserCredential>
  function login(fn: () => Promise<any>) {
    return async () => {
      try {
        setError('');
        setLoading(true);
        await fn();
        // setRedirectToReferrer(true);
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Please try again.');
      }
    };
  }
  console.log('loginWithGoogle');
  console.log(loginWithGoogle);

  return (
    <div>
      <Row justify="space-around">
        <Col xl={6} md={10} sm={12}>
          <Card title="Login">
            <p>
              If you login, we will keep track of your stats, repeat words less,
              and help match you into games.
            </p>
            <p>
              NOTE: We are not hosting ads, not selling or storing your
              information. This is fun only.
            </p>
            <Btn block onClick={login(loginWithGoogle)}>
              Login with Google
            </Btn>
            <Btn block onClick={login(loginWithGithub)}>
              Login with Github
            </Btn>

            <Btn block onClick={openModel}>
              Login with Email/Pass
            </Btn>
            {/* <AuthCreateEmailPass visible={visible} /> */}
          </Card>
        </Col>
        <Col xl={6} md={10} sm={12}>
          <Card title="Guest">
            <p>
              You can continue as a Guest, but will miss out on functionality.
            </p>
            <p>TODO: Enter Your Name</p>
            <p>TODO: Continue as guest</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

/*
interface CreateEmailPassValues {
  email: string;
  password: string;
}
interface AuthCreateEmailPassProps {
  visible: boolean;
}
const AuthCreateEmailPass: React.FC<AuthCreateEmailPassProps> = ({ visible }) => {
  const onCreate = (values: CreateEmailPassValues) => {
    console.log('DEBUG CreateUserWithEmail:', values);
    const created = createUserWithEmail(values.email, values.password);
    console.log('created:', created);

  };

  const onCancel = () => {
    console.log('onCancel');
  };
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create account with Email/Password"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          .then((values: any) => {
            form.resetFields();
            onCreate(values);
          })
          .catch(onFinishFailed);
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ modifier: 'public' }}
      >
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, message: 'Please input a valid email address' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>
      </Form>
    </Modal>
  );
};
*/

const Auth: React.FC<AuthProps> = () => {
  const user = useSession();
  if (!user) {
    return <AuthAnon />;
  }
  return <AuthAuthenticated user={user} />;
};

export default Auth;
