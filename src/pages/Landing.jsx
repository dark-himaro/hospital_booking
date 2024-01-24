import React from 'react';
import { Layout, Space, Modal, Form, Input, Button, Card, Row, Col, Rate  } from 'antd';
import { useState } from 'react';
import {
    HomeOutlined,
    SearchOutlined,
    UserOutlined,
    InfoCircleOutlined,
    PhoneOutlined,
    SubnodeOutlined,
    UnorderedListOutlined,
    FileAddOutlined
  } from '@ant-design/icons';
import { Menu } from 'antd';
import { Link,useNavigate,useLocation } from 'react-router-dom';
import '../public/Public.css';
import Logo from '../public/hhlogo.png';
import { getByZipcode } from '../services/api';

const { Header, Footer, Sider, Content } = Layout;
const headerStyle = {
  textAlign: 'center',
  color: '#fff',
  height: 64,
  paddingInline: 50,
  lineHeight: '64px',
  backgroundColor: '#7dbcea',
};
const contentStyle = {
  textAlign: 'center',
  minHeight: 120,
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#108ee9',
};
const siderStyle = {
  textAlign: 'center',
  lineHeight: '120px',
  color: '#fff',
  backgroundColor: '#3ba0e9',
};
const footerStyle = {
  textAlign: 'center',
  color: '#fff',
  backgroundColor: '#7dbcea',
};
const Landing = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
      setIsModalOpen(true);
    };
    const handleOk = (event) => {

      setIsModalOpen(false);
    };
    const handleCancel = () => {
      setIsModalOpen(false);
    };
    const onFinish = async (values) => {
      if(values.zipcode.toString().toLowerCase() === "near me")
      {
        navigator.geolocation.getCurrentPosition(
           (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
          }
          values["zipcode"] = JSON.stringify(pos)
          values["isnearme"] = true
          
      })
          
      }
      else{
        values["isnearme"] = false
      }
      setTimeout(async () => {
        await getByZipcode(values).then((data) => {
          navigate("/table-data",{state:{
            "tabledata":JSON.stringify(data),
            "homedata": location.state
          }});
        })
      }, 200);
      
  };
    const [isLogin,setIsLogin] = useState(sessionStorage.getItem('isLogin') == null || false ? false : true);
return(
    <Layout className='main-bg-img d-flex w-100 h-100 position-absolute'>
      <Header className='d-flex h-auto justify-content-between'>
      <div className=" d-flex"><img src={Logo} width={250} height={100}></img></div>
        <div className='d-flex pt-4'>
        <Menu className='w-800 justify-content-end' theme="dark" mode="horizontal">
          {isLogin === true ?
        <Menu.Item key="1" disabled={true}>
            Hi {location?.state['fullname']}
          </Menu.Item>
          : null
}
          <Menu.Item key="2" icon={<HomeOutlined />} onClick={() => {
            navigate("/",{state:location.state});
          }}>
            Home
          </Menu.Item>
          {isLogin === true ?
          <>
          { location?.state['usertype'] === 'customer' &&
            <>
          <Menu.Item key="3" icon={<SearchOutlined/>} onClick={showModal}>
            Search By ZipCode
          </Menu.Item>
          <Menu.Item key="4" icon={<FileAddOutlined />} onClick={() => {
            navigate("/appointment",{state:location.state});
          }}>
            Book Appointment
          </Menu.Item>
          <Menu.Item key="4" icon={<UnorderedListOutlined />} onClick={() => {
            navigate("/review",{state:location.state});
          }}>
            Review
          </Menu.Item>
          </>
}
{ location?.state['usertype'] === 'doctor' &&
            <>
          <Menu.Item key="5" icon={<SearchOutlined />} onClick={() => {
            navigate("/view-patients",{state:location.state});
          }}>
          View Patients
        </Menu.Item>
          </>
}
{ location?.state['usertype'] === 'admin' &&
            <>
          <Menu.Item key="4" icon={<SubnodeOutlined />} onClick={() => {
            navigate("/doctor-menu",{state:location.state})
          }}>
          Doctor Menu
        </Menu.Item>
          </>
}
          

</>
          : null
}
          {/* <Menu.Item key="5" icon={<InfoCircleOutlined />}>
            About Us
          </Menu.Item> */}
          {isLogin === false ?
          <Menu.Item key="6" icon={<UserOutlined />} onClick={() => {
            navigate("/login")
          }}>
            Login
          </Menu.Item>
          :
          <Menu.Item key="7" icon={<UserOutlined />} onClick={ () => {
            sessionStorage.removeItem('isLogin')
            sessionStorage.removeItem('isDocRegistered')
            setIsLogin(false) 
            }}>
            Logout
          </Menu.Item>
        }
        </Menu>
        </div>
        </Header>
        <Content className=''>
            <div className='d-flex'>
                Your health is Important to us
            </div>
            <Form
                            id="zipcode_form"
                            name="search_zipcode"
                            className="login-form"
                            initialValues={{ remember: true }}
                            onFinish={onFinish}
                        >
            <Modal title="Search By ZipCode" open={isModalOpen} onOk={handleOk} onCancel={handleCancel} footer={[<div className='d-flex justify-content-end'>
          <Form.Item>
          <Button key="back" onClick={handleCancel}>
            Cancel
          </Button>  
          </Form.Item>  
          <Form.Item>      
          <Button htmlType='submit' form="zipcode_form" key="submit" type="primary" className="login-form-button ms-5">
            Search
          </Button>
          </Form.Item>
          </div>
        ]}>
           
                            <Form.Item
                                name="find"
                                label="Find"
                                rules={[{ required: true, message: 'Please input doctor or hospital!' }]}
                            >
                                <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder="search for doctor, hospital" />
                            </Form.Item>
                            <Form.Item
                                name="zipcode"
                                label="zipcode"
                                rules={[{ required: true, message: 'Please input zipcode' }]}
                            >
                                <Input prefix={<SearchOutlined className="site-form-item-icon" />} placeholder="input zipcode" />
                            </Form.Item>
            
      </Modal>
      </Form>

      </Content>
      <div className='d-flex mb-3 justify-content-evenly'>
      <Row gutter={16}>
    <Col span={8}>
    <Card
    title="Recommended"
      style={{ width: 200, height: 280 }}
      // className = "d-flex"
      cover={<div className='d-flex justify-content-center'><img alt="example" height={100} src="https://s3-media1.fl.yelpcdn.com/bphoto/TDVIU0YeBWMs8rCftV6saA/o.jpg" style={{ borderRadius: '50%', width : '100px' }} /></div>}
    >
      <div style={{ textAlign: 'center' }}>
        Mercy Hospital & Medical Center
        <Rate disabled allowHalf defaultValue={4.5} />
      </div>
    </Card>
    </Col>
    <Col span={8}>
    <Card
    title="Recommended"
      style={{ width: 200, height: 280 }}
      // className = "d-flex"
      cover={<div className='d-flex justify-content-center'><img alt="example" height={100} src="https://s3-media3.fl.yelpcdn.com/bphoto/48kL6I2RibeS91XksU4G8A/o.jpg" style={{ borderRadius: '50%', width : '100px' }} /></div>}
    >
      <div style={{ textAlign: 'center' }}>
      Northwestern Medicine Prentice Women's Hospital
        <Rate disabled allowHalf defaultValue={3.5} />
      </div>
    </Card>
    </Col>
    <Col span={8}>
    <Card
    title="Recommended"
      style={{ width: 200, height: 280 }}
      // className = "d-flex"
      cover={<div className='d-flex justify-content-center'><img alt="example" height={100} src="https://s3-media3.fl.yelpcdn.com/bphoto/2GfT6AAZrUIuvGdvU9Hpzg/o.jpg" style={{ borderRadius: '50%', width : '100px' }} /></div>}
    >
      <div style={{ textAlign: 'center' }}>
      University of Chicago Medicine Center
        <Rate disabled allowHalf defaultValue={4.5} />
      </div>
    </Card>
    </Col>
  </Row>
      </div>
      <Footer style={{ textAlign: 'center' }}>Health Hub ©2023 Created by Your Team</Footer>
    </Layout>
)
        };
export default Landing;