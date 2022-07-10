import React from 'react';
import { Button, Space } from 'antd-mobile';

const About = ({ history }) => {
  const goBack = () => history.goBack();

  return (
    <div className='container' style={{ backgroundColor: '#6D4DC2' }}>
      <h1 className='title'>This is AboutPage</h1>
      <Space justify='center' style={{ marginTop: 20 }}>
        <Button type='primary' onClick={goBack}>
          return
        </Button>
      </Space>
    </div>
  );
};

export default About;
