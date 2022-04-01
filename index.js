import React, { useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import 'antd/dist/antd.css';
import './index.css';
import {
  Form,
  Input,
  Button,
  Form,
  Switch,
  DatePicker,
  Cascader,
  Select,
  InputNumber,
  Radio,
} from 'antd';
const weight = [
  { label: '称重', value: 1 },
  { label: '非称重', value: 0 },
];
const standard = [
  {
    value: '1',
    label: '辣度',
    children: [
      {
        value: '0',
        label: '微辣',
      },
    ],
  },
];
const origin = [
  {
    value: 'sichuan',
    label: 'SiChuan',
    children: [
      {
        value: 'chengdu',
        label: 'ChengDu',
      },
    ],
  },
];
const Data = (values) => {
  const newStandard = values.standard[0] + values.standard[1];
  const newOrigin = values.origin[0] + '-' + values.origin[1];
  return { newStandard, newOrigin };
};
const Demo = () => {
  const onFinish = (values) => {
    const { newStandard, newOrigin } = Data(values);
    console.log(newStandard, newOrigin);
    console.log('Success:', values);
  };

  const onFinishFailed = (values, errorFields, outOfData) =>
    console.log('Failed:', values, errorFields, outOfData);
  const form = Form.useForm();
  const [state, setState] = useState(1);
  return (
    <>
      <Form
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{ unit: '1', discount: false, weight: 1 }}
        onValuesChange={(changedValues, _allValues) => {
          switch (changedValues) {
            case weight:
              form.setFieldsValue(changedValues);
              break;
            default:
              break;
          }
        }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 8 }}
      >
        <Form.Item label="商品类型" name="weight">
          <Radio.Group
            options={weight}
            optionType="button"
            buttonStyle="solid"
          />
        </Form.Item>
        <Form.Item
          label="名称"
          name="name"
          rules={[
            { required: true, message: '请输入名称!' },
            { max: 10, min: 1, type: 'string', message: '长度在1~10之间' },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="售卖价格"
          name="salePrice"
          dependencies={['costPrice']}
          rules={[
            {
              required: true,
              message: '请输入售卖价格!',
            },
            {
              max: 99,
              min: 1,
              type: 'number',
              message: '长度在1~99之间，且必须为数字',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  !getFieldValue('costPrice') ||
                  getFieldValue('costPrice') < value
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('售卖价格必须大于成本价格!'));
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>
        <Form.Item
          label="成本价格"
          name="costPrice"
          dependencies={['salePrice']}
          rules={[
            {
              required: true,
              message: '请输入成本价格!',
            },
            {
              min: 1,
              max: 99,
              type: 'number',
              message: '长度在1~99之间，且必须为数字',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (
                  !value ||
                  !getFieldValue('salePrice') ||
                  getFieldValue('salePrice') > value
                ) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('成本价格必须小于售卖价格!'));
              },
            }),
          ]}
        >
          <InputNumber />
        </Form.Item>
        {state === 1 ? (
          <Form.Item label="单位" name="unit">
            <Select defaultValue="1" value="1">
              <Option value="1">克</Option>
              <Option value="2">份</Option>
            </Select>
          </Form.Item>
        ) : null}
        <Form.Item label="多级规格" name="standard">
          <Cascader options={standard} placeholder="Please select" />
        </Form.Item>
        <Form.Item label="生产地" name="origin">
          <Cascader options={origin} placeholder="Please select" />
        </Form.Item>
        <Form.Item label="生产日期" name="date">
          <DatePicker picker="time" />
        </Form.Item>
        <Form.Item label="打包个数" name="count">
          <InputNumber />
        </Form.Item>
        <Form.Item label="参与优惠" name="discount" valuePropName="checked">
          <Switch />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 11, span: 20 }}>
          <Button type="primary" htmlType="submit">
            提交信息
          </Button>
        </Form.Item>
      </Form>
    </>
  );
};

ReactDOM.render(<Demo />, document.getElementById('container'));
