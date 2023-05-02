import React from 'react';
import { IBooleanType } from '../types';

interface BooleanTypeViewProps {
  item: IBooleanType;
  onClose: (value: boolean) => void;
}

export const BooleanTypeView: React.FC<BooleanTypeViewProps> = ({ item, onClose }) => {
  return (
    <div>
      <h5>Task: {item.name}</h5>
      <p>Status: {item.value ? 'True' : 'False'}</p>
      <button onClick={() => onClose(!item.value)}>Toggle</button>
    </div>
  );
};
