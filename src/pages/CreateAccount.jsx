import {
  Button,
  Form,
  Select,
  Card,
  Col,
  Row,
  Layout,
  notification
} from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { CreateAccountApi } from '../services/api';
import { useState } from 'react';
import UserLoginDetails from '../components/UserLoginDetails';
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 8,
    },
  },
  wrapperCol: {
    xs: {
      span: 24,
    },
    sm: {
      span: 16,
    },
  },
};
const { Header, Footer, Sider, Content } = Layout;
const CreateAccount = () => {
  const navigate = useNavigate();
  const [api,contextHolder] = notification.useNotification();
  const openNotificationWithIcon = (type,notification_message) => {
    api[type]({
      message: 'Error',
      description: notification_message,
    });
  };
  const [isPage, setIsPage] = useState(1)
  const [form] = Form.useForm();
  const onFinish = async (values) => {
    await CreateAccountApi(form.getFieldsValue(true)).then((data) => {
      if(data.statusCode === 500)
      {
        openNotificationWithIcon('error',data.data)
      }
      else{
        navigate("/login")
      }
    })
    .catch((error) => {
      console.log("err",error);
    })

  };


  return (
    <Row gutter={16} className='m-0 justify-content-center main-bg-img'>
      <Col span={8} className='d-flex align-items-center vh-100'>
        {contextHolder}
        <Card
          title={
            <Row>
              <Col span={8}>
                <span></span>
              </Col>
              <Col span={8}>
                <div className='d-flex justify-content-center'>
                  <div className='fs-3 fw-bold'>
                    REGISTER
                  </div>
                </div>
              </Col>
              <Col span={8} className='pt-3 text-end'>
                <Link to="/login">
                  Login
                </Link>
              </Col>
            </Row>} className='w-570 h-550 overflow-auto rounded-4'>

          <Form 
            form={form}
            onFinish={onFinish}
            name="register"
            scrollToFirstError
          >
            <Layout className='bg-transparent'>
              <Content>
                <UserLoginDetails form={form} />
              </Content>
              <Footer className='bg-transparent'>
                    <Form.Item >
                    <Row className='d-flex'>
                      <Col span={24} className='ps-2 d-flex justify-content-center'>
                      <Button type="primary" htmlType='submit'>
                        Register
                      </Button>
                      </Col>
                      </Row>
                    </Form.Item>
              </Footer>
            </Layout>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};
export default CreateAccount;
