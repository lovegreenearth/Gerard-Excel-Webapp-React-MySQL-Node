import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import Card from 'antd/es/card/Card';
import React from 'react';
import Header from '../../Components/header/header';
import { useState } from 'react';
import { ApiService } from '../../Service/api';
import toast, { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

/* eslint-disable no-template-curly-in-string */
const validateMessages = {
  required: '${label} is required!'
};
/* eslint-enable no-template-curly-in-string */

let notify = null;

const AddProduct = () => {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [values, setValues] = useState({
    code: "",
    description: "",
    group: "",
    subgroup: "",
    price: "",
    weight: "",
    maxDiscount: ""
  });
  const [maingroups, setMaingroups] = useState([]);
  const [subgroups, setSubgroups] = useState([]);
  const [subgroupList, setSubgroupList] = useState([]);
  const [onlyView, setOnlyView] = useState(false);

  useEffect(() => {
    getMaingroup();
    getSubgroups();
    if (id) {
      getProductById(id);
    }
    if (window.location.pathname.includes('/product/view')) {
      setOnlyView(true);
    }
  }, []);

  const getProductById = (id) => {
    ApiService.getProductById(id).then(res => {
      if (res.status === 200) {
        setValues(res.data.data);
        const data = res.data.data;
        form.setFieldValue("code", data.code);
        form.setFieldValue("group", data.group);
        form.setFieldValue("subgroup", data.subGroup);
        form.setFieldValue("price", data.price);
        form.setFieldValue("discount", data.maxDiscount);
        form.setFieldValue("weight", data.weight);
        form.setFieldValue("description", data.description);
      }
    }).catch(err => {
      console.log(err);
    })
  }

  const getMaingroup = () => {
    ApiService.getMaingroups().then(res => {
      if (res.status === 200) {
        if (res.data.data) {
          const tempList = res.data.data.map((item, index) => {
            return {
              value: item.id,
              label: item.name
            };
          });
          setMaingroups(tempList);
          const selectedSubgroups = subgroupList.filter(item => item.mainGroup === res.data.data[0].id);
          const subTempList = selectedSubgroups.map((item, index) => {
            return {
              value: item.id,
              label: item.name
            };
          });
          setSubgroups(subTempList);
        }
      }
    })
  }

  const getSubgroups = () => {
    ApiService.getSubgroups().then(res => {
      if (res.status === 200) {
        const tempList = res.data.data.map((item, index) => {
          return {
            value: item.id,
            label: item.name
          };
        });
        setSubgroupList(res.data.data);
        setSubgroups(tempList);
      }
    })
  }

  const onSubmit = () => {
    notify = toast.loading('Loading...');
    const data = {
      code: form.getFieldValue("code"),
      description: form.getFieldValue("description"),
      group: form.getFieldValue("group"),
      subgroup: form.getFieldValue("subgroup"),
      price: form.getFieldValue("price"),
      weight: form.getFieldValue("weight"),
      discount: form.getFieldValue("discount")
    }
    if (id) {
      editProduct(data);
    } else {
      addProduct(data);
    }
  };

  const addProduct = (values) => {
    ApiService.addProduct(values).then((res) => {
      notify = null;
      if (res.status === 200) {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          notify = toast.dismiss();
          form.resetFields();
        }, 3000);
      } else {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          notify = toast.dismiss();
        }, 3000);
      }
    }).catch(err => {
      notify = null;
      toast("Server Internal Error", {
        position: 'bottom-right',
        id: notify,
      });
      setTimeout(() => {
        notify = toast.dismiss();
      }, 3000);
      console.log(err);
    })
  }

  const editProduct = (values) => {
    ApiService.editProduct(id, values).then((res) => {
      notify = null;
      if (res.status === 200) {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          notify = toast.dismiss();
          window.location.href = "/";
          form.resetFields();
        }, 3000);
      } else {
        toast(res.data.msg, {
          position: 'bottom-right',
          id: notify, // Custom Icon
          icon: '👏',
        });
        setTimeout(() => {
          notify = toast.dismiss();
        }, 3000);
      }
    }).catch(err => {
      notify = null;
      toast("Server Internal Error", {
        position: 'bottom-right',
        id: notify,
      });
      setTimeout(() => {
        notify = toast.dismiss();
      }, 3000);
      console.log(err);
    })
  }

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value
    })
  }

  const handleDiscountChange = (value) => {
    setValues({
      ...values,
      discount: value
    })
  }

  const onGroupChange = (value) => {
    const selectedSubgroups = subgroupList.filter(item => item.mainGroup === value);
    const subTempList = selectedSubgroups.map((item, index) => {
      return {
        value: item.id,
        label: item.name
      };
    });
    setSubgroups(subTempList);
    setValues({
      ...values,
      group: value
    });
  };

  const onSubgroupChange = (value) => {
    setValues({
      ...values,
      subgroup: value
    });
  }

  return (
    <div className="App">
      <div className='content'>
        <Toaster />
        <Card className='main-card'>
          <Header title={id ? "Edit Product" : "Add Product"} />
          <main className='mt-4'>
            <Card>
              <Row>
                <Col span={18} offset={3}>
                  <Form {...layout} form={form} name="nest-messages" onFinish={onSubmit} validateMessages={validateMessages}>
                    <Form.Item
                      name={'code'}
                      label="Code"
                      rules={[{ required: !onlyView }]}
                    >
                      {onlyView ?
                        <label>{values.code}</label> :
                        <Input name="code" onChange={(e) => handleChange(e)} disabled={onlyView} />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'group'}
                      label="Group"
                      rules={[{ required: !onlyView }]}>
                      {onlyView ?
                        <label>
                          {maingroups.filter((main) => main.value === parseInt(values.group))[0]?.label}
                        </label> :
                        <Select
                          showSearch
                          placeholder="Select a group"
                          optionFilterProp="children"
                          onChange={onGroupChange}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={maingroups}
                          disabled={onlyView}
                        />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'subgroup'}
                      label="Subgroup"
                      rules={[{ required: !onlyView }]}>
                      {onlyView ?
                        <label>
                          {subgroupList.filter((sub) => sub.id === parseInt(values.subGroup))[0]?.name}
                        </label> :
                        <Select
                          showSearch
                          placeholder="Select a subgroup"
                          optionFilterProp="children"
                          onChange={onSubgroupChange}
                          filterOption={(input, option) =>
                            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                          }
                          options={subgroups}
                          disabled={onlyView}
                        />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'price'}
                      label="Price"
                      rules={[{ required: !onlyView }]}
                    >
                      {onlyView ?
                        <label>£ {values.price}</label> :
                        <Input prefix="£" name="price" onChange={(e) => handleChange(e)} disabled={onlyView} />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'discount'}
                      label="Discount"
                      rules={[{ required: !onlyView }]}>
                      {onlyView ?
                        <label>{values.maxDiscount} %</label> :
                        <InputNumber max={100} min={0} onChange={(e) => handleDiscountChange(e)}
                          name='discount'
                          value={values.maxDiscount}
                          disabled={onlyView}
                          formatter={(value) => `${value} %`} />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'weight'}
                      label="Weight"
                      rules={[{ required: !onlyView }]}>
                      {onlyView ?
                        <label>{values.weight}</label> :
                        <Input name="weight" onChange={(e) => handleChange(e)} disabled={onlyView} />
                      }
                    </Form.Item>
                    <Form.Item
                      name={'description'}
                      label="Description">
                      {onlyView ?
                        <label>{values.description}</label> :
                        <Input.TextArea name="description" onChange={(e) => handleChange(e)} disabled={onlyView} />
                      }
                    </Form.Item>
                    {
                      onlyView ?
                        <Form.Item className='action-box'>
                          <Button type='default' htmlType='button'
                            onClick={() => { window.location.href = '/'; }}>
                            Go to List
                          </Button>
                        </Form.Item> :
                        <Form.Item className='action-box'>
                          <Button type="primary" htmlType="submit">
                            Submit
                          </Button>
                          <Button type="default" htmlType="button"
                            className='ml-2'
                            onClick={() => { window.location.href = '/'; }}>
                            Cancel
                          </Button>
                        </Form.Item>
                    }
                  </Form>
                </Col>
              </Row>
            </Card>
          </main>
        </Card>
      </div>
    </div>
  );
};
export default AddProduct;