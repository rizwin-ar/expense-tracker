import React, { useState } from 'react';
import { Form, Input, Button, Select, DatePicker, message, Radio } from 'antd';
import dayjs from 'dayjs';

const { Option } = Select;

export interface Entry {
  key?: number;
  date: dayjs.Dayjs;
  type: 'income' | 'expense';
  category?: string;
  amount?: number;
}

const predefinedIncomeTypes = ['Salary', 'Bonus', 'Investment', 'Rental Income', 'Other'];
const predefinedExpenseTypes = ['Rent', 'Food', 'Travel', 'Cosmetics', 'Bills', 'Other'];

interface AddEntryFormProps {
  onAdd: (entry: Entry) => void;
}

const AddEntryForm: React.FC<AddEntryFormProps> = ({ onAdd }) => {
  const [form] = Form.useForm();
  const [entryType, setEntryType] = useState<'income' | 'expense'>('income');

  const onFinish = (values: any) => {
    if (!values.amount) {
      message.error('Please provide an amount');
      return;
    }

    onAdd({
      date: values.date,
      type: entryType,
      category: entryType === 'income' ? values.incomeType : values.expenseType,
      amount: Number(values.amount),
    });

    form.resetFields();
  };

  return (
    <Form form={form} onFinish={onFinish} layout="vertical">
      <Form.Item>
        <Radio.Group
          onChange={e => setEntryType(e.target.value)}
          value={entryType}
        >
          <Radio value="income">Income</Radio>
          <Radio value="expense">Expense</Radio>
        </Radio.Group>
      </Form.Item>

      <Form.Item name="date" label="Date" rules={[{ required: true, message: 'Please select the date!' }]}>
        <DatePicker />
      </Form.Item>

      {entryType === 'income' && (
        <>
          <Form.Item name="incomeType" label="Income Type" rules={[{ required: true, message: 'Please select an income type!' }]}>
            <Select placeholder="Select income type">
              {predefinedIncomeTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Income Amount" rules={[{ required: true, message: 'Please enter income amount!' }]}>
            <Input placeholder="Enter amount" type="number" />
          </Form.Item>
        </>
      )}

      {entryType === 'expense' && (
        <>
          <Form.Item name="expenseType" label="Expense Type" rules={[{ required: true, message: 'Please select an expense type!' }]}>
            <Select placeholder="Select expense type">
              {predefinedExpenseTypes.map(type => <Option key={type} value={type}>{type}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="amount" label="Expense Amount" rules={[{ required: true, message: 'Please enter expense amount!' }]}>
            <Input placeholder="Enter amount" type="number" />
          </Form.Item>
        </>
      )}

      <Form.Item>
        <Button type="primary" htmlType="submit">Add Entry</Button>
      </Form.Item>
    </Form>
  );
};

export default AddEntryForm;
