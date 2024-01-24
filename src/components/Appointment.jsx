import React from 'react';
import {
    HomeOutlined,
    FileAddOutlined,
    SolutionOutlined
} from '@ant-design/icons';
import { Button, Card, Select, Form, Input, notification, Menu, Col, Row, Modal } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getDoctorList, BookAppointment, getAppointmentList, deleteAppointment } from '../services/api';
import { Header } from 'antd/es/layout/layout';

const Appointment = () => {
    const location = useLocation();
    console.log("loc", location.state);
    const navigate = useNavigate();
    const [doctorForm] = Form.useForm();
    const [docList, setDocList] = useState([]);
    const [appntList, setappntList] = useState([]);
    const [modalDetail,setModalDetail] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState("book");
    const [content, setContent] = useState("2");
    const [api, contextHolder] = notification.useNotification();
    const openNotificationWithIcon = (type, notification_message) => {
        api[type]({
            message: 'Success',
            description: notification_message,
        });
    };
    const onFinish = async (values) => {
        values["user_name"] = location.state["username"]
        if (action === "book") {
            await BookAppointment(values).then((data) => {
                openNotificationWithIcon('success', data.data);
                doctorForm.resetFields()
            })
        }


    };
    const filterOption = (input, option) =>
        (option?.label ?? '').toLowerCase().includes(input.toLowerCase());
        const showModal = () => {
            setIsModalOpen(true);
          };
          const handleOk = () => {
            setIsModalOpen(false);
          };
          const handleCancel = () => {
            setIsModalOpen(false);
          };
    return (
        <>
            {contextHolder}
            <div className='bg-background h-auto position-absolute w-100'>
                <Header>
                    <Menu theme="dark" mode="horizontal" onSelect={(event) => {
                        if (event.key !== "1") {
                            doctorForm.resetFields()
                            setContent(event.key)
                        }
                    }} >
                        <Menu.Item key="1" icon={<HomeOutlined />} onClick={() => {
                            navigate("/", { state: location.state });
                        }}>
                            Home
                        </Menu.Item>
                        <Menu.Item key="2" icon={<FileAddOutlined />}>Book A Doctor</Menu.Item>
                        <Menu.Item key="3" icon={<SolutionOutlined />} onClick={async () => {
                            var param_val = {
                                user: location.state.username,
                                usertype: location.state.usertype
                            }
                            await getAppointmentList(param_val).then((data) => {
                                setappntList(data);
                                console.log("appntList", appntList);
                            })
                        }}>View Appointments</Menu.Item >
                    </Menu>
                </Header>
                {content === "2" &&
                    <div className='d-flex justify-content-center mt-5 w-100 mb-5'>

                        <Card title="Doctors" bordered={true} style={{ width: 700, height: 700 }}>
                            <Form
                                form={doctorForm}
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}

                            >

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
                                            doctorForm.setFieldValue("id", formval["doctor_id"]);
                                            doctorForm.setFieldValue("fullname", formval["name"]);
                                            doctorForm.setFieldValue("address", formval["address"]);
                                            doctorForm.setFieldValue("phone", formval["phone"]);
                                            doctorForm.setFieldValue("timing", formval["timing"]);
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

                                <Form.Item
                                    name="fullname"
                                    label="Fullname"

                                >
                                    <Input disabled={true} placeholder="Fullname" />
                                </Form.Item>
                                <Form.Item
                                    name="address"
                                    label="Address"
                                >
                                    <Input disabled={true} placeholder="Address" />
                                </Form.Item>
                                <Form.Item
                                    name="phone"
                                    label="Phone"
                                >
                                    <Input disabled={true} placeholder="Phone" />
                                </Form.Item>
                                <Form.Item
                                    name="timing"
                                    label="Timing"
                                >
                                    <Input disabled={true} placeholder="eg: Mon - Fri 9am to 10 am" />
                                </Form.Item>

                                <Form.Item
                                    name="booking_date"
                                    label="Booking Day"
                                    rules={[{ required: true, message: 'Please input your Booking Day/Date!' }]}
                                >
                                    <Input placeholder="MM/DD/YYYY" />
                                </Form.Item>

                                <Form.Item
                                    name="customer_phone"
                                    label="Customer Phone"
                                    rules={[{ required: true, message: 'Please input your Phone!' }]}
                                >
                                    <Input placeholder="eg:2232567890" />
                                </Form.Item>
                                <Form.Item
                                    name="customer_issue"
                                    label="Customer Issue"
                                    rules={[{ required: true, message: 'Please input your issue!' }]}
                                >
                                    <Input placeholder="eg: Nausea, Headache" />
                                </Form.Item>
                                <Form.Item className='d-flex justify-content-center'>

                                    <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => {
                                        setAction("book")
                                    }}>
                                        Book
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Card>
                    </div>
                }
                {
                    content === "3" && (

                        appntList.length != 0 &&
                        <>
                            <div className='d-flex justify-content-center mt-5 w-100 mb-5'>
                            <Row gutter={16}>
                                {
                                appntList.map((appnt,index) => 
                                    <Col span={appntList.length === 2 ? 12 : 8}>
                                    <Card
                                        title= {`Appointment No :  ${index+1}`}
                                        bordered={true}
                                        hoverable
                                        style={{
                                            width: 300,
                                        }}
                                        onClick={async () => {
                                            await getDoctorList(appnt.doctor_id).then((docdata) => { 
                                                var modalParam = {
                                                    ...docdata[0],
                                                    ...appnt
                                                }
                                                setModalDetail(modalParam);
                                                console.log("modalDetail",modalDetail);
                                                showModal();
                                            })
                                            
                                        }}
                                    >
                                        <p>Booking Date : {appnt.booking_day}</p>
                                        <p>Booking Phone : {appnt.customer_phone}</p>
                                    </Card>
                                    </Col>
                                )

                                }
                                </Row>
                                <Modal title="Appointment Details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[<div className='d-flex justify-content-center'>
      
          <Button type="primary" className="login-form-button ms-5" onClick={
            async () => {
                var param_val = {
                    user: location.state.username,
                    usertype: location.state.usertype
                }
                var del_param = {
                    "id" : modalDetail.appointment_id
                }
                await deleteAppointment(del_param).then(async () => {
                await getAppointmentList(param_val).then((data) => {
                    setappntList(data);
                    setIsModalOpen(false)
                    console.log("appntList", appntList);
                })
            })
            }
          }> 
            Cancel Appointment
          </Button>
          </div>
        ]}>
                                        <p>Appointment No : {modalDetail.appointment_id}</p>
                                        <p>Doctor Name : {modalDetail.name}</p>
                                        <p>Doctor Phone Number : {modalDetail.phone}</p>
                                        <p>Doctor Address : {modalDetail.address}</p>
                                        <p>Doctor Timing : {modalDetail.timing}</p>
                                        <p>Booking Date : {modalDetail.booking_day}</p>
                                        <p>Booking Phone : {modalDetail.customer_phone}</p>
                                </Modal>
                            </div>
                        </>

                    )
                }
            </div>
        </>
    );
};
export default Appointment;