import React from 'react';
import { IBooleanType } from '../types';
import '../styles/BooleanTypeView.css';

interface BooleanTypeViewProps {
  item: IBooleanType;
  onClose: (value: boolean) => void;
}

export const BooleanTypeView: React.FC<BooleanTypeViewProps> = ({ item, onClose }) => {
  return (
    <div className="wrapper">
      <h5 className="title">Task: {item.name}</h5>
      <p className="status">Status: {item.value ? 'True' : 'False'}</p>
      <button className="button" onClick={() => onClose(!item.value)}>Toggle</button>
    </div>
  );
};
