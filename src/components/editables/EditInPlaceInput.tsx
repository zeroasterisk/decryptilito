import React from 'react';
import { Button, Tooltip, Form, Input, Typography } from 'antd';
import { EditOutlined } from '@ant-design/icons';

import { Store } from 'rc-field-form/lib/interface';

const { Text } = Typography;
export type onChangeType = (name: string) => void;

interface EditInPlaceInputProps {
  onChange: onChangeType;
  value?: string;
  label?: string; //  Team Name
  message?: string; //  Set your team name
  placeholder?: string; // Team Name
}
const EditInPlaceInput: React.FC<EditInPlaceInputProps> = ({
  onChange,
  value,
  label,
  message,
  placeholder,
}) => {
  const [isEditMode, setEditMode] = React.useState(false);
  const [form] = Form.useForm();
  // form.setFieldsValue({ name: userInList.name });

  const onFinish = ({ name }: Store) => {
    onChange(name);
    setEditMode(false);
  };

  return (
    <span>
      {isEditMode ? (
        <Form
          form={form}
          name="horizontal_login"
          layout="inline"
          onFinish={onFinish}
          initialValues={{ name: value }}
        >
          <Form.Item name="name" rules={[{ required: true, message }]}>
            <Input placeholder={placeholder} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      ) : (
        <span>
          <Text strong>
            {value && value.length > 0 ? value : <small>No {label}</small>}
          </Text>
          &nbsp;
          <Tooltip title={`Change ${label}`}>
            <Button
              type="ghost"
              icon={<EditOutlined />}
              onClick={() => setEditMode(true)}
            />
          </Tooltip>
        </span>
      )}
    </span>
  );
};

export default EditInPlaceInput;
