import React from 'react';
import { Card, Form, Button, Input } from 'antd';
import SpyIcon from '../icons/spy';

interface JoinPendingGameFormProps {
  user?: firebase.User;
}

const JoinPendingGameForm: React.FC<JoinPendingGameFormProps> = () => {
  const onFinish = (values: any) => {
    console.log('Received values from form: ', values);
  };
  const onFinishFailed = (values: any) => {
    console.log('Form failure:', values);
  };

  const checkShortCode = (rule: any, value: string) => {
    if (!(value && value.length && value.length > 4)) {
      return Promise.reject('The id should be 5 letters & numbers');
    }
    if (value.length > 6) {
      return Promise.reject(
        'Too many characters. The id should only be 5 letters & numbers',
      );
    }
    if (value.match(/[^a-zA-Z0-9]/)) {
      return Promise.reject(
        'The id should be letters & numbers only, no special characters',
      );
    }
    return Promise.resolve();
  };

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  };
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  };

  return (
    <Card title="Join Existing Game">
      <Form
        {...formItemLayout}
        name="customized_form_controls"
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          shortCode: '',
        }}
      >
        <Form.Item
          name="shortCode"
          label="Game Code"
          rules={[{ required: true, validator: checkShortCode }]}
        >
          <Input type="text" placeholder="ab012" style={{ width: 100 }} />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button icon={<SpyIcon />} type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default JoinPendingGameForm;
