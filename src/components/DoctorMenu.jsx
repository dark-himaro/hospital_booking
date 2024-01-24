import React from 'react';
import {
    HomeOutlined,
    FileAddOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import { Button, Card, Select, Form, Input, notification, Menu } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { AddDoctor, getDoctorList, DeleteDoctor, UpdateDoctor } from '../services/api';
import { Header } from 'antd/es/layout/layout';

const DoctorMenu = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [docform] = Form.useForm();
    const [docList,setDocList] = useState([]);
    const [action, setAction] = useState("add");
    const [content, setContent] = useState("2");
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, notification_message) => {
        api[type]({
            message: 'Success',
            description: notification_message,
        });
    };
    const onFinish = async (values) => {
        if (action === "add") {
            await AddDoctor(values).then((data) => {
                openNotificationWithIcon('success', data.data);
                docform.resetFields()
            })
        }
        if (action === "modify") {
            await UpdateDoctor(values).then((data) => {
                openNotificationWithIcon('success', data.data);
                docform.resetFields()
            })
        }
        if (action === "delete") {
            await DeleteDoctor(values).then((data) => {
                openNotificationWithIcon('success', data.data);
                docform.resetFields()
            })
        }

    };
    const filterOption = (input, option) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
    return (
        <>
            {contextHolder}
            <div className='bg-background h-100 position-absolute w-100'>
                <Header>
                    <Menu theme="dark" mode="horizontal" onSelect={(event) => {
                        if (event.key !== "1") {
                            docform.resetFields()
                            setContent(event.key)
                        }
                    }} >
                        <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => {
                            navigate("/", { state: location.state });
                        }}>
                            Home
                        </Menu.Item>
                        <Menu.Item key="2" icon={<FileAddOutlined />}>Add Doctor</Menu.Item>
                        <Menu.Item key="3" icon={<SolutionOutlined />}>Modify Doctor</Menu.Item>
                    </Menu>
                </Header>
                {
                    <div className='d-flex justify-content-center mt-5 w-100'>
                        <Card title="Doctors" bordered={true} style={{ width: 700, height: 480 }}>
                            <Form
                                form={docform}
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}

                            >
                                {content === "3" && <>
                                    <Form.Item 
                                    name="select"
                                    >
                                    <Select
                                        showSearch
                                        placeholder="Select a person"
                                        optionFilterProp="children"
                                        onClick={async () => {
                                            //get doctor from db
                                            await getDoctorList("all").then((dataColl) => {
                                                var docArr = [];
                                                dataColl.map((doc) => {
                                                    var docObj = {};
                                                    docObj['value'] = JSON.stringify(doc);
                                                    docObj['label'] = doc.name;
                                                    docArr.push(docObj);
                                                })
                                                setDocList(docArr);
                                            })
                                        }}
                                        onSelect={(value) => {
                                            
                                            var formval = JSON.parse(value);
                                            docform.setFieldValue("id",formval["doctor_id"]);
                                            docform.setFieldValue("fullname",formval["name"]);
                                            docform.setFieldValue("address",formval["address"]);
                                            docform.setFieldValue("phone",formval["phone"]);
                                            docform.setFieldValue("timing",formval["timing"]);
                                        }}
                                        filterOption={filterOption}
                                        options={docList}
                                    />
                                    </Form.Item>
                                    <Form.Item
                                        name="id"
                                        label="ID number"
                                    >
                                        <Input disabled={true} placeholder="id" />
                                    </Form.Item>
                                </>
                                }
                                <Form.Item
                                    name="fullname"
                                    label="Fullname"
                                    rules={[{ required: true, message: 'Please input your Fullname!' }]}
                                >
                                    <Input placeholder="Fullname" />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Address"
                                    rules={[{ required: true, message: 'Please input your Address!' }]}
                                >
                                    <Input placeholder="Address" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Phone"
                                    rules={[{ required: true, message: 'Please input your Phone number!' }]}
                                >
                                    <Input placeholder="Phone" />
                                </Form.Item>
                                <Form.Item
                                    name="timing"
                                    label="Timing"
                                    rules={[{ required: true, message: 'Please input your timing details!' }]}
                                >
                                    <Input placeholder="eg: Mon - Fri 9am to 10 am" />
                                </Form.Item>


                                <Form.Item className='d-flex justify-content-center'>
                                    {content === "2" &&
                                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => {
                                            setAction("add")
                                        }}>
                                            Add
                                        </Button>
                                    }
                                    {content === "3" &&
                                        <>
                                            <Button type="primary" htmlType="submit" className="login-form-button me-5" onClick={() => {
                                                setAction("modify")
                                            }}>
                                                Modify
                                            </Button>
                                            <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => {
                                                setAction("delete")
                                            }}>
                                                Delete
                                            </Button>
                                        </>
                                    }
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                }
            </div>
        </>)
}

export default DoctorMenu;