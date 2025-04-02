import React from "react";
import { FiShoppingBag, FiAlertCircle } from "react-icons/fi";

interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
  actionButton?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon = <FiAlertCircle size={40} />,
  actionButton,
  className = "",
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center py-12 px-4 text-center ${className}`}
    >
      <div className="mb-6 text-gray-400">{icon}</div>
      <h3 className="text-xl font-medium text-gray-900 mb-2">{title}</h3>
      {description && (
        <p className="text-gray-500 mb-6 max-w-md">{description}</p>
      )}
      {actionButton && <div className="mt-2">{actionButton}</div>}
    </div>
  );
};

export default EmptyState;
