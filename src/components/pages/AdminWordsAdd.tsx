import React, { useState } from 'react';
import { Form, Input, Button, Modal, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';

import { adminAddWords } from '../../firebase';

const { TextArea } = Input;

interface AddWordsFormData {
  words?: string;
}
interface AddWordsFormProps {
  visible: boolean;
  onCancel: () => void;
}

const AdminWordsAddWordsForm: React.FC<AddWordsFormProps> = ({
  visible,
  onCancel,
}) => {
  const [form] = Form.useForm();
  return (
    <Modal
      visible={visible}
      title="Create a new collection"
      okText="Create"
      cancelText="Cancel"
      onCancel={onCancel}
      onOk={() => {
        form
          .validateFields()
          // should create the words via cloud functions
          .then((values: AddWordsFormData) => {
            if (!values.words) return 'Error - no words entered';
            return adminAddWords(values.words);
          })
          // should handle results and reset the form
          .then((result: string) => {
            if (result.indexOf('Error') !== -1) {
              message.success(result);
              form.resetFields();
            } else {
              message.error(result);
            }
          })
          .catch((info) => {
            console.log('Validate Failed:', info);
          });
      }}
    >
      <Form
        form={form}
        layout="vertical"
        name="form_in_modal"
        initialValues={{}}
      >
        <Form.Item
          label="Words to add"
          name="words"
          rules={[
            {
              required: true,
              message: 'Please enter words (CSV, or line split)',
            },
          ]}
        >
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

const AdminWordsAdd: React.FC = () => {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          setVisible(true);
        }}
      >
        <PlusCircleOutlined />
        Add Words
      </Button>
      <AdminWordsAddWordsForm
        visible={visible}
        onCancel={() => {
          setVisible(false);
        }}
      />
    </div>
  );
};

export default AdminWordsAdd;
