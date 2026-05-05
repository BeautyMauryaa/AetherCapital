import React from "react";
import "./StepHeader.css";

const StepHeader = ({ step, total = 6, title, highlight, subtitle }) => {
  const currentStep = String(step).padStart(2, "0");
  const totalSteps = String(total).padStart(2, "0");

  return (
    <div className="step-header-container">
      <div className="step-indicator">
        <div className="step-line" />
        <span className="step-counter">
          Step {currentStep} / {totalSteps}
        </span>
      </div>

      <h1 className="header-title">
        {title}{" "}
        {highlight && (
          <span className="header-highlight">
            {highlight}
          </span>
        )}
      </h1>

      {subtitle && (
        <p className="header-subtitle">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default StepHeader;