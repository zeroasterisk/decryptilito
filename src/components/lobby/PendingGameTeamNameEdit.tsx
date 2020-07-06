import React from 'react';
import { Button, Tooltip, Form, Input } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { Store } from 'rc-field-form/lib/interface';

import { PendingGameUser } from '../../logic/pendingGameData';

import { onChangeNameType } from './PendingGameUserLists';

import firebase from '../../firebase';

interface PendingGameTeamNameEditProps {
  onChange: onChangeNameType;
  value: string;
}
const PendingGameTeamNameEdit: React.FC<PendingGameTeamNameEditProps> = ({
  onChange,
  value,
}) => {
  const [isEditMode, setEditMode] = React.useState(false);
  const [form] = Form.useForm();
  // form.setFieldsValue({ name: userInList.name });

  const onFinish = ({ name }: Store) => {
    onChange(name);
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
          initialValues={{ name: value }}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Set your team name' }]}
          >
            <Input placeholder="Team Name" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <span>
          <strong>
            {value && value.length > 0 ? value : <small>No Team Name</small>}
          </strong>
          &nbsp;
          <Tooltip title="Change team name">
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

export default PendingGameTeamNameEdit;
