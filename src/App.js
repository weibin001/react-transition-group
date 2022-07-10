import React, { useMemo, useRef, useEffect, Suspense } from 'react';
import { useLocation, useHistory, Route, Switch } from 'react-router-dom';
import { TransitionGroup, CSSTransition } from 'react-transition-group';
import { RouterConfig } from './RouteConfig';
import './App.css';

const DEFAULT_SCENE_CONFIG = {
  enter: 'from-right',
  exit: 'to-exit',
};

const getSceneConfig = (location) => {
  const matchedRoute = RouterConfig.find((config) => new RegExp(`^${config.path}$`).test(location.pathname));
  return (matchedRoute && matchedRoute.sceneConfig) || DEFAULT_SCENE_CONFIG;
};

function App() {
  const history = useHistory();
  const location = useLocation();
  const oldLocation = useRef(null);

  const classNames = useMemo(() => {
    if (history.action === 'PUSH') return 'forward-' + getSceneConfig(location).enter;
    else if (history.action === 'POP' && oldLocation.current) return 'back-' + getSceneConfig(oldLocation.current).exit;
    return '';
  }, [history.action, location]);

  useEffect(() => {
    oldLocation.current = location;
  }, [location]);

  return (
    <Suspense fallback={<div></div>}>
      <TransitionGroup className='router-wrapper' childFactory={(child) => React.cloneElement(child, { classNames })}>
        <CSSTransition timeout={500} key={location.pathname}>
          <Switch location={location}>
            {RouterConfig.map((config, index) => (
              <Route exact key={index} {...config} />
            ))}
          </Switch>
        </CSSTransition>
      </TransitionGroup>
    </Suspense>
  );
}

export default App;
