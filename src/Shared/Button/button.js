import React from "react";
import PropTypes from "prop-types";
import { Button as BootstrapButton } from "react-bootstrap";

const Button = ({
  label,
  onClick,
  variant = "primary",
  size = "md",
  disabled = false,
  type = "button",
  ...rest
}) => {
  return (
    <BootstrapButton
      type={type}
      onClick={onClick}
      variant={variant}
      size={size}
      disabled={disabled}
      {...rest}
    >
      {label}
    </BootstrapButton>
  );
};

Button.propTypes = {
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func,
  variant: PropTypes.oneOf([
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
    "info",
    "light",
    "dark",
    "link",
  ]),
  size: PropTypes.oneOf(["sm", "md", "lg"]),
  disabled: PropTypes.bool,
  type: PropTypes.string,
};

export default Button;
