import React, { useState } from 'react';
import { Button, Tooltip, Form, Input, Typography, Modal, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Text } = Typography;

// tell this component what you want to do with the new value
export type onChangeType = (val: string) => string;
const onChangeMock: onChangeType = (myVal) => {
  console.log('form entered value', myVal);
  return 'did nothing';
};

interface FormDataInterface {
  val?: string;
}
interface ModalFormProps {
  visible: boolean;
  onChange: onChangeType;
  onCancel: () => void;
  type?: 'textarea' | 'input';
  verb?: string;
  value?: string;
  modalTitle?: string; //  Edit Your Team Name
  label?: string; //  Team Name
  prompt?: string; //  Set your team name
  placeholder?: string; // Team Name
}
const ModalForm: React.FC<ModalFormProps> = ({
  visible,
  onCancel,
  onChange,
  type,
  verb,
  value,
  modalTitle,
  label,
  placeholder,
  prompt,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title={modalTitle}
      okText={verb}
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          // should get the input value from the form data
          .then((values: FormDataInterface) => {
            if (!values.val) throw new Error('Error - no value entered');
            return values.val;
          })
          // should handle results
          .then(onChange)
          // reset the form
          .then((result: string) => {
            // form.resetFields(); this gets kinda wonky on multiple changes
            onCancel();
            message.success(result);
          })
          .catch((info) => {
            console.error('Update failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{ val: value }}
      >
        <Form.Item
          label={label}
          name="val"
          rules={[{ required: true, message: prompt }]}
        >
          {type === 'textarea' ? <TextArea autoSize /> : <Input />}
        </Form.Item>
      </Form>
    </Modal>
  );
};

interface EditInModalInputProps {
  onChange?: onChangeType;
  type?: 'textarea' | 'input';
  verb?: string;
  value?: string;
  modalTitle?: string; //  Edit Your Team Name
  label?: string; //  Team Name
  prompt?: string; //  Set your team name
  placeholder?: string; // Team Name
}
const EditInModalInput: React.FC<EditInModalInputProps> = ({
  onChange = onChangeMock,
  type = 'input',
  verb = 'Submit',
  value,
  modalTitle,
  label,
  prompt = 'You must enter something',
  placeholder,
}) => {
  const [visible, setVisible] = useState(false);
  return (
    <span>
      <Text strong>
        {value && value.length > 0 ? value : <small>No {label}</small>}
      </Text>
      &nbsp;
      <Tooltip title={`Change ${label}`}>
        <Button
          type="ghost"
          icon={<EditOutlined />}
          onClick={() => setVisible(true)}
        />
      </Tooltip>
      <ModalForm
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
        onChange={onChange}
        type={type}
        verb={verb}
        value={value}
        modalTitle={modalTitle}
        label={label}
        prompt={prompt}
        placeholder={placeholder}
      />
    </span>
  );
};

export default EditInModalInput;
