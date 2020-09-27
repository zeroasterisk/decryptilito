import React from 'react';
import { Button, Tooltip, Form, Input } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';

import { Store } from 'rc-field-form/lib/interface';

import { PendingGameUser } from '../../logic/pendingGameData';

import { onChangeNameType } from './PendingGameUserLists';

import firebase from '../../firebase';

interface PendingGameUserItemEditableProps {
  onChangeUserDisplayName: onChangeNameType;
  user: firebase.User;
  userInList: PendingGameUser;
}
const PendingGameUserItemEditable: React.FC<PendingGameUserItemEditableProps> = ({
  onChangeUserDisplayName,
  user,
  userInList,
}) => {
  const [isEditMode, setEditMode] = React.useState(false);
  const [form] = Form.useForm();
  // form.setFieldsValue({ name: userInList.name });

  const onFinish = ({ name }: Store) => {
    onChangeUserDisplayName(name);
    setEditMode(false);
  };

  return (
    <div>
      {isEditMode ? (
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
          initialValues={{ name: userInList.name }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Set your name' }]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Agent Alias"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <span>
          <Tooltip title="This is you.">
            <UserOutlined style={{ color: '#08c' }} />
          </Tooltip>{' '}
          <strong>{userInList.name}</strong>
          &nbsp;
          <Tooltip title="Change your name">
            <Button
              type="ghost"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
            />
          </Tooltip>
        </span>
      )}
    </div>
  );
};

export default PendingGameUserItemEditable;
