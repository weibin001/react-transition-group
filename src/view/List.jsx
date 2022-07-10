import React from 'react';
import { Button, Space, List as AntdList } from 'antd-mobile';

const List = ({ history }) => {
  const goBack = () => history.goBack();

  const onClickListItem = () => history.push({ pathname: 'detail' });

  return (
    <div className='container' style={{ backgroundColor: '#9A4538' }}>
      <h1 className='title'>This is ListPage</h1>
      <AntdList mode='card'>
        <AntdList.Item title='oooo' onClick={onClickListItem}>
          1
        </AntdList.Item>
        <AntdList.Item title='oooo' onClick={onClickListItem}>
          2
        </AntdList.Item>
      </AntdList>
      <Space justify='center' style={{ marginTop: 20 }}>
        <Button type='primary' onClick={goBack}>
          return
        </Button>
      </Space>
    </div>
  );
};

export default List;
