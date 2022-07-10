import React from 'react';
import { Button, Space } from 'antd-mobile';

const Detail = ({ history }) => {
  const goBack = () => history.goBack();

  return (
    <div className='container' style={{ backgroundColor: '#80D4AC' }}>
      <h1 className='title'>This is DetailPage</h1>
      <Space justify='center' style={{ marginTop: 20 }}>
        <Button type='primary' onClick={goBack}>
          return
        </Button>
      </Space>
    </div>
  );
};

export default Detail;
