import { Avatar, Card, Col, List, PageHeader, Row, Typography } from 'antd';
import {
  LaptopOutlined,
  PhoneOutlined,
  PlaySquareOutlined,
  QuestionOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';
import React from 'react';
import Btn from '../btn';

const { Paragraph } = Typography;

const Home: React.FC = () => {
  const features = [
    {
      desc: 'This is on you... each team should have 2+ people',
      icon: <UsergroupAddOutlined />,
      title: 'You need 2 teams',
    },
    {
      desc: 'Each team needs their own device, laptop, etc. (more=ok)',
      icon: <LaptopOutlined />,
      title: 'You need 2+ devices',
    },
    {
      desc:
        'If your team is not in the same room, you need some way to collaborate with your team (IM, phone, whatever)',
      icon: <PhoneOutlined />,
      title: 'You need to communicate with your team',
    },
  ];
  return (
    <PageHeader title="Decryptilito Homepage">
      <div className="wrap">
        <div className="content">
          <Paragraph>
            Decryptilito is a <i>little</i> web-based copy of{' '}
            <a
              href="https://boardgamegeek.com/boardgame/225694/decrypto"
              rel="noopener"
            >
              Decrypto
            </a>
            .
          </Paragraph>
          <Row gutter={16}>
            <Col sm={24} md={12}>
              <Card
                title="Get Started"
                extra={
                  <Btn
                    href="/lobby"
                    type="primary"
                    size="large"
                    icon={<PlaySquareOutlined />}
                  >
                    Play Now
                  </Btn>
                }
              >
                <List
                  itemLayout="horizontal"
                  dataSource={features}
                  renderItem={(item) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar {...item} />}
                        title={item.title}
                        description={item.desc}
                      />
                    </List.Item>
                  )}
                />
              </Card>
            </Col>
            <Col sm={24} md={12}>
              <Card
                title="Find out more"
                extra={
                  <Btn
                    href="/about"
                    type="link"
                    size="large"
                    icon={<QuestionOutlined />}
                  >
                    About
                  </Btn>
                }
              >
                <p>
                  This is a <i>fun</i> project by{' '}
                  <a href="https://github.com/zeroasterisk" rel="noopener">
                    Alan Blount (zeroasterisk)
                  </a>
                  .
                </p>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </PageHeader>
  );
};

export default Home;
