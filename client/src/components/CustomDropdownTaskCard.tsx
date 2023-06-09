import React, { useState, useEffect } from "react";
import { ITask } from "../types";
import { FaTrash, FaEllipsisH, FaEdit } from "react-icons/fa";
import Form from 'react-bootstrap/Form';


import "../styles/CustomDropdown.css";

interface CustomDropdownTaskCardProps {
  task: ITask;
  handleDeletion: () => void;
  handlePriorityChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleModalShow: (value: boolean) => void;
}

export const CustomDropdownTaskCard: React.FC<CustomDropdownTaskCardProps> = ({
  task,
  handleDeletion,
  handlePriorityChange,
  handleModalShow,
}) => {
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: any) => {
      if (!e.target.closest(".custom-dropdown")) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  const toggleDropdown = (e: any) => {
    e.stopPropagation();
    setShowDropdown(!showDropdown);
  };

  return (
    <div className="custom-dropdown" onClick={toggleDropdown}>
      <FaEllipsisH />
      {showDropdown && (
        <div className="custom-dropdown-menu">
          <div
              className="custom-dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                handleDeletion();
              }}
            >
              <FaTrash /> Delete
            </div>
          <div 
              className="custom-dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                handleModalShow(true);
              }}
            >
              <FaEdit /> Edit
            </div>
            <div
              className="custom-dropdown-item"
              onClick={(e) => {
                  e.stopPropagation();
                  if ((e.target as HTMLElement).tagName !== "INPUT") {
                      const checkbox = document.getElementById(`priority-${task.taskId}`);
                      if (checkbox) {
                        checkbox.click();
                      }
                  }
              }}>
              <Form.Check
                  type="checkbox"
                  id={`priority-${task.taskId}`}
                  name={`priority-${task.taskId}`}
                  checked={task.priority}
                  onChange={handlePriorityChange}
                  onClick={(e) => e.stopPropagation()}
                  className="mr-1"
                  label="Priority"
              />
            </div>
            {/* <label htmlFor={`priority-${task.taskId}`} className="task-modal-priority-label">
              Priority
            </label>
            <input
              type="checkbox"
              id={`priority-${task.taskId}`}
              name={`priority-${task.taskId}`}
              checked={task.priority}
              onChange={handlePriorityChange}
              onClick={(e) => e.stopPropagation()}
            /> */}

        </div>
        
      )}
    </div>
  );
};

export default CustomDropdownTaskCard;
