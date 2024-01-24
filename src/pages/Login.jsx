import React from 'react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import { Button, Card, Select, Checkbox, Form, Input, notification } from 'antd';
import {LoginApi} from '../services/api';
import { Layout, Space } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { Link,useNavigate } from 'react-router-dom';

const { Header, Footer, Sider, Content } = Layout;

const Login = () => {
    const navigate = useNavigate();
    const [api,contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type,notification_message) => {
      api[type]({
        message: 'Error',
        description: notification_message,
      });
    };
    const onFinish = async (values) => {
        await LoginApi(values).then((data) => {
            if(data.statusCode === 500){
                openNotificationWithIcon('error',data.data.msg)
            }
            else{
                sessionStorage.setItem('isLogin',true)
                navigate("/",{state:data.data.person})
            }
        })
    };

    return (<>
        {contextHolder}
        <Layout className='main-bg-img h-100 position-absolute d-flex d-flex h-100 position-absolute w-100 align-items-end'>
            <div className='d-flex justify-content-end h-100 flex-wrap align-content-center white-sider'>
                <div>


                    <Card className='p-2 w-350 me-5 text-center' title="HEALTH HUB" bordered={true}>


                        <Form
                            name="normal_login"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
                            <Form.Item
                                name="username"
                                rules={[{ required: true, message: 'Please input your Username!' }]}
                            >
                                <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
                            </Form.Item>
                            <Form.Item
                                name="password"
                                rules={[{ required: true, message: 'Please input your Password!' }]}
                            >
                                <Input.Password
                                    prefix={<LockOutlined className="site-form-item-icon" />}
                                    type="password"
                                    placeholder="Password"
                                />
                            </Form.Item>
                            <Form.Item
                            name="userType"
                            initialValue={"customer"}
                            >
                                <Select
                                    defaultValue="customer"
                                    className='text-start'
                                    // style={{
                                    //     width: 120,
                                    // }}
                                    options={[
                                        {
                                            value: 'customer',
                                            label: 'Customer',
                                        },
                                        {
                                            value: 'doctor',
                                            label: 'Doctor',
                                        },
                                        {
                                            value: 'admin',
                                            label: 'Admin',
                                        }
                                    ]}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>

                                <a className="login-form-forgot" href="">
                                    Forgot password
                                </a>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" className="login-form-button">
                                    Log in
                                </Button>
                                Or <Link to="/create-account">Create Account</Link>
                            </Form.Item>
                        </Form>
                    </Card>
                </div>
            </div>
        </Layout>
        </>
    );
};

export default Login;