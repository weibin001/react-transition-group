import React from 'react';
import About from './view/About';
import Detail from './view/Detail';
import List from './view/List';

const Home = React.lazy(() => import('./view/Home'));
const SliderVertical = React.lazy(() => import('./view/SliderVertical'));

export const RouterConfig = [
  {
    path: '/',
    component: Home,
  },
  {
    path: '/about',
    component: About,
    sceneConfig: {
      enter: 'from-bottom',
      exit: 'to-bottom',
    },
  },
  {
    path: '/list',
    component: List,
    sceneConfig: {
      enter: 'from-right',
      exit: 'to-right',
    },
  },
  {
    path: '/detail',
    component: Detail,
    sceneConfig: {
      enter: 'from-right',
      exit: 'to-right',
    },
  },
  {
    path: '/slider-vertical',
    component: SliderVertical,
    sceneConfig: {
      enter: 'from-right',
      exit: 'to-right',
    },
  },
];
