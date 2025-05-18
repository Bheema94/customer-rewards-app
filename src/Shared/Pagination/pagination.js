import React from "react";
import PropTypes from "prop-types";
import Button from "../Button/button";

const Pagination = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex justify-center mt-4 space-x-2 flex-wrap">
      <Button
        label="Prev"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        variant="secondary"
        size="sm"
        disabled={currentPage === 1}
      />

      {pages.map((page) => (
        <Button
          key={page}
          label={page.toString()}
          onClick={() => onPageChange(page)}
          variant={page === currentPage ? "primary" : "light"}
          size="sm"
        />
      ))}

      <Button
        label="Next"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        variant="secondary"
        size="sm"
        disabled={currentPage === totalPages}
      />
    </div>
  );
};

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default Pagination;
