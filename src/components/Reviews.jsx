import React from 'react';
import {
    HomeOutlined} from '@ant-design/icons';
import { Button, Card, Select, Form, Input, notification, Menu, Modal } from 'antd';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../public/Public.css'
import { useNavigate, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { getDoctorList, reviewEditor } from '../services/api';
import { Header } from 'antd/es/layout/layout';
import TextArea from 'antd/es/input/TextArea';

const Reviews = () => {
    const location = useLocation();
    console.log("loc", location.state);
    const navigate = useNavigate();
    const [reviewForm] = Form.useForm();
    const [docList, setDocList] = useState([]);
    const [isDocRegistered, setIsDocRegistered] = useState(sessionStorage.getItem('isDocRegistered') == null || false ? false : true);
    const [appntList, setappntList] = useState([]);
    const [modalDetail, setModalDetail] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
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
        values["user_name"] = location.state["username"];
        values["type"] = "write";

        if (action === "add") {
            await reviewEditor(values).then(async (data) => {
                console.log("dat", data);
                openNotificationWithIcon('success', "Written Successfully");
                reviewForm.resetFields();
                // sessionStorage.setItem('isDocRegistered',true);

                // setIsDocRegistered(true);
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
                                reviewForm.resetFields()
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
                    <div>

                        <div className='d-flex justify-content-center mt-5 w-100'>
                            <Card title="Review" bordered={true} style={{ width: 700, height: 480 }}>
                                <Form
                                    form={reviewForm}
                                    name="normal_login"
                                    className="login-form"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}

                                >

                                    <Form.Item
                                        name="select"
                                        label="Search Your Name Here"
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
                                                reviewForm.setFieldValue("id", formval["doctor_id"]);
                                                reviewForm.setFieldValue("fullname", formval["name"]);
                                                reviewForm.setFieldValue("address", formval["address"]);
                                                reviewForm.setFieldValue("phone", formval["phone"]);
                                                reviewForm.setFieldValue("timing", formval["timing"]);
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
                                        name="review"
                                        label="Review"
                                        rules={[{ required: true, message: 'Please input your Review!' }]}
                                    >
                                        <TextArea placeholder="Write Your Review" />
                                    </Form.Item>
                                    <Form.Item className='d-flex justify-content-center'>
                                        <Button type="primary" htmlType="submit" className="login-form-button" onClick={() => {
                                            setAction("add")
                                        }}>
                                            Write Review
                                        </Button>

                                        <Button type="primary" className="ms-2 login-form-button" onClick={async () => {
                                            var values = {};
                                            values["doctor_id"] = reviewForm.getFieldValue("id");
                                            values["type"] = "read";
                                            console.log("va", values);

                                            await reviewEditor(values).then(async (data) => {
                                                var modalarr = [];
                                                data.data.map((rev) => {
                                                    var modalobj = {};
                                                    modalobj["username"] = rev.username;
                                                    modalobj["reviewtext"] = rev.review;
                                                    modalarr.push(modalobj);
                                                })
                                                setModalDetail(modalarr);
                                                setIsModalOpen(true)
                                            })

                                        }}>
                                            View Reviews
                                        </Button>
                                    </Form.Item>
                                </Form>
                            </Card> 

                            <Modal title="Review Details" className='d-flex'  open={isModalOpen} bodyStyle={{overflow: 'auto',width:'600px',height:'450px'}} onOk={handleOk} onCancel={handleCancel}>
                  
                                {modalDetail.map((revdet) => <>
                                
                                    <Card bordered={true} style={{ width: 300 }}>
                                        <p>Written By : {revdet.username}</p>
                                        <p>Review : {revdet.reviewtext}</p>
                                    </Card>

                                </>
                                )
                                }
                        
                            </Modal>

                        </div>
                    </div>

                </div>
            </>

        </>
    );
};
export default Reviews;