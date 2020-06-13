import React, { useState } from 'react';
import { navigate } from 'hookrouter';
import {
  notification,
  PageHeader,
  Button,
  Col,
  Row,
  Card,
  Result,
  // Modal,
  // Form,
  // Input,
} from 'antd';

import { RightOutlined, HomeOutlined } from '@ant-design/icons';

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
            <Button
              onClick={() => navigate('/lobby')}
              type="primary"
              icon={<RightOutlined />}
            >
              Game Lobby
            </Button>
            <Button
              onClick={() => navigate('/')}
              type="dashed"
              icon={<HomeOutlined />}
            >
              Go Home
            </Button>
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
        // navigate('/account');
      } catch (err) {
        setLoading(false);
        setError(err.message || 'Please try again.');
        notification.error({
          message: err.message,
        });
      }
    };
  }

  return (
    <div>
      <PageHeader
        className="site-page-header"
        onBack={() => navigate('/', true)}
        title="Login to Decryptilito"
        subTitle="Decryptilito doesn't really care, but we want to keep track for you"
      />
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
            <Button block loading={loading} onClick={login(loginWithGoogle)}>
              Login with Google
            </Button>
            <Button block loading={loading} onClick={login(loginWithGithub)}>
              Login with Github
            </Button>

            <Button block onClick={openModel}>
              Login with Email/Pass
            </Button>
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
