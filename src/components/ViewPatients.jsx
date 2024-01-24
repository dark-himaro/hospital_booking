import React from 'react';
import {
    HomeOutlined} from '@ant-design/icons';
import { Button, Card, Select, Form, Input, notification, Menu, Col, Row, Modal } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { AddDoctor, getDoctorList, getAppointmentList, deleteAppointment, getDoctorId, getPatient } from '../services/api';
import { Header } from 'antd/es/layout/layout';

const ViewPatients = () => {
    const location = useLocation();
    console.log("loc", location.state);
    const navigate = useNavigate();
    const [docform] = Form.useForm();
    const [docList, setDocList] = useState([]);
    const [isDocRegistered,setIsDocRegistered] = useState(sessionStorage.getItem('isDocRegistered') == null || false ? false : true);
    const [appntList, setappntList] = useState([]);
    const [modalDetail,setModalDetail] = useState({});
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [action, setAction] = useState("add");
    const [content, setContent] = useState("2");
    const [api, contextHolder] = notification.useNotification();

    useEffect( () => {
        
        getDoctorId(location.state.username).then((dataColl) => {
            console.log("dataColl",dataColl);
            if(dataColl.statusCode == 200)
            {
                var param_val = {
                    user: dataColl.data[0].doctor_id,
                    usertype: location.state.usertype
                }
                setIsDocRegistered(true);
                sessionStorage.setItem('isDocRegistered',true);
            getAppointmentList(param_val).then((data) => {
                
                setappntList(data);
                
            })
            }
           })
        
    },[]);
    const openNotificationWithIcon = (type, notification_message) => {
        api[type]({
            message: 'Success',
            description: notification_message,
        });
    };
    const onFinish = async (values) => {
        values["user_name"] = location.state["username"];
        console.log("log",values);
        if (action === "add") {
            await AddDoctor(values).then(async (data) => {
                openNotificationWithIcon('success', data.data);
                docform.resetFields()
                sessionStorage.setItem('isDocRegistered',true);
                
                setIsDocRegistered(true);
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
        
        <>
            {contextHolder}
            <div className='bg-background h-auto position-absolute w-100'>
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
                        
                    </Menu>
                </Header> 
                {isDocRegistered === true ?               

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
                                            await getPatient(appnt.username).then((docdata) => { 
                                                console.log("pa",docdata);
                                                var modalParam = {
                                                    ...docdata,
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
                                        <p>Patient Name : {modalDetail.fullname}</p>
                                        <p>Booking Date : {modalDetail.booking_day}</p>
                                        <p>Booking Phone : {modalDetail.customer_phone}</p>
                                </Modal>
                            </div>
                        </>

:
<div>
    
    <div className='d-flex justify-content-center mt-5 w-100'>
                        <Card title="Register Yourself to Health Hub to View Patients" bordered={true} style={{ width: 700, height: 480 }}>
                            <Form
                                form={docform}
                                name="normal_login"
                                className="login-form"
                                initialValues={{ remember: true }}
                                onFinish={onFinish}

                            >
                               
                                    <Form.Item 
                                    name="select"
                                    label = "Search Your Name Here"
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
                                    <div className='d-flex '>
                                    <h5> Enter your details </h5>
                                    </div>
                                    <Form.Item
                                        name="id"
                                        label="ID number"
                                    >
                                        <Input disabled={true} placeholder="id" />
                                    </Form.Item>
                                
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
                                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => {
                                            setAction("add")
                                        }}>
                                            Add
                                        </Button>

                                    
                                </Form.Item>
                            </Form>
                        </Card>
                        </div>
</div>
}
            </div>
            </>

        </>
    );
};
export default ViewPatients;