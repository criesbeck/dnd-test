// https://github.com/asbjornenge/react-drag-and-drop
import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';  
import { Draggable, Droppable } from 'react-drag-and-drop'

const CounterItem = ({type, data}) => (
  <Draggable wrapperComponent={{ type: "button"}} type={type} data={data}>
    {data}
  </Draggable>
);

const inTarget = (e, position) => (
  e.clientX >= position.left
  && e.clientX <= position.right
  && e.clientY >= position.top
  && e.clientY <= position.bottom
);

const SmoothieItem = ({item, removeItem}) => {
  const onDragEnd = (e) => {
    if (!inTarget(e, item.target.current.position)) removeItem(item);
  };

  return (
    <Draggable wrapperComponent={{ type: "button"}} 
      type={item.type}
      data={item.data}
      onDragEnd={ onDragEnd }>
      {item.data}
    </Draggable>
  );
};

const Smoothie = ({items, active, removeItem}) => (
  <div style={{
    border: `2px solid ${active ? 'red' : 'gray'}`,
    height: '2em',
    width: '20em'
  }}>
    {
      items.map(item => <SmoothieItem key={item.ts} item={item} removeItem={removeItem} />)
    }
  </div>
);

const App = () => {
  const [items, setItems] = useState([]);
  const [active, setActive] = useState(false);
  const ref = useRef(null);

  const addItem = (data, target) => {
    const type = Object.keys(data)[0];
    const item = { type: type, data: data[type], target: ref, ts: Date.now() };
    setItems([ ...items, item ]);
  };

  const removeItem = (item) => {
    setItems(items.filter(x => x !== item));
  };

  return (
    <div>
      <div>
        <CounterItem type="fruit" data="Banana" />
        <CounterItem type="fruit" data="Apple" />
        <CounterItem type="utensil" data="Spoon" /> 
      </div>
      <Droppable ref={ref} types={['fruit']} 
        onDrop={ (data, e) => { addItem(data); setActive(false); } }
        onDragEnter={ () => setActive(true) }
        onDragLeave={ () => setActive(false) }>
        <Smoothie items={items} active={active} removeItem={removeItem} />
      </Droppable>
    </div>
  )
};

Smoothie.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape({
    type: PropTypes.string.isRequired,
    data: PropTypes.string.isRequired,
    ts: PropTypes.number.isRequired,
  })).isRequired,
  active: PropTypes.bool.isRequired,
  removeItem: PropTypes.func.isRequired
};
  
export default App;
  