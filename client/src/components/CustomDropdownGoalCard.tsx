import React, { useState, useEffect } from "react";
import { IGoal } from "../types";
import { FaTrash, FaEllipsisV } from "react-icons/fa";
import Form from 'react-bootstrap/Form';


import "../styles/CustomDropdown.css";

interface CustomDropdownGoalCardProps {
  goal: IGoal;
  handleDeleteGoal: (goalId: string) => void;
  handleGoalAchievedChange: (goalId: string, goalAchieved: boolean) => void;
  onEditGoal: (goal: IGoal) => void;
}

export const CustomDropdownGoalCard: React.FC<CustomDropdownGoalCardProps> = ({
  goal,
  handleDeleteGoal,
  onEditGoal,
  handleGoalAchievedChange,
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
      <FaEllipsisV />
      {showDropdown && (
        <div className="custom-dropdown-menu">
          <div
            className="custom-dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              handleDeleteGoal(goal.goalId);
              setShowDropdown(false);
            }}
          >
            Delete
          </div>
          <div
            className="custom-dropdown-item"
            onClick={(e) => {
              e.stopPropagation();
              onEditGoal(goal);
              setShowDropdown(false);
            }}
          >
            Edit
          </div>
          <div
            className="custom-dropdown-item"
            onClick={(e) => {
                e.stopPropagation();
                if ((e.target as HTMLElement).tagName !== "INPUT") {
                    const checkbox = document.getElementById(`goalAchievedCheckbox-${goal.goalId}`);
                    if (checkbox) {
                      checkbox.click();
                    }
                }
            }}>
            <Form.Check
                type="checkbox"
                id={`goalAchievedCheckbox-${goal.goalId}`}
                checked={goal.goalAchieved}
                onChange={(e) => {
                    e.stopPropagation();
                    handleGoalAchievedChange(goal.goalId, e.target.checked);
                }}
                className="mr-1"
                label="Achieved"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomDropdownGoalCard;
