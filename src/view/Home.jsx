import React from 'react';
import { Button, Space } from 'antd-mobile';

const Home = ({ history }) => {
  const goToAbout = () => history.push('/about');
  const goToList = () => history.push('/list');
  const goToSliderVertical = () => history.push('/slider-vertical');

  return (
    <div className='container' style={{ backgroundColor: '#F4C272' }}>
      <h1 className='title'>This is HomePage</h1>
      <Space justify='center' style={{ marginTop: 20 }}>
        <Button type='primary' onClick={goToAbout}>
          Go to AboutPage
        </Button>
        <Button type='primary' onClick={goToList}>
          Go to ListPage
        </Button>
        <Button type='primary' onClick={goToSliderVertical}>
          Go to slider vertical
        </Button>
      </Space>
    </div>
  );
};

export default Home;
