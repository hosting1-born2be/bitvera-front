import type { GroupBase, StylesConfig } from "react-select";

/**
 * Select styles copied from ContactForm.tsx (dark theme).
 */
export function getSelectStyles<Option = { value: string; label: string }>(
  hasError: boolean
): StylesConfig<Option, false, GroupBase<Option>> {
  return {
    control: (base, state) => ({
      ...base,
      backgroundColor: "rgba(255, 255, 255, 0.03)",
      borderColor: hasError
        ? "#ff2d30"
        : state.isFocused
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(255, 255, 255, 0.05)",
      boxShadow: "none",
      minHeight: "38px",
      "&:hover": {
        borderColor: hasError
          ? "#ff2d30"
          : "rgba(255, 255, 255, 0.2)",
      },
    }),
    placeholder: (base) => ({
      ...base,
      color: "rgba(255, 255, 255, 0.5)",
      fontSize: "14px",
      fontWeight: 300,
    }),
    singleValue: (base) => ({
      ...base,
      color: "#fff",
      fontSize: "14px",
      fontWeight: 300,
    }),
    menu: (base) => ({
      ...base,
      backgroundColor: "#1a1a1a",
      border: "1px solid rgba(255, 255, 255, 0.1)",
      borderRadius: "8px",
      zIndex: 9999,
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? "rgba(255, 255, 255, 0.1)"
        : state.isFocused
          ? "rgba(255, 255, 255, 0.05)"
          : "transparent",
      color: "#fff",
      fontSize: "14px",
      fontWeight: 300,
      cursor: "pointer",
      "&:active": {
        backgroundColor: "rgba(255, 255, 255, 0.1)",
      },
    }),
    indicatorSeparator: () => ({
      display: "none",
    }),
    dropdownIndicator: (base) => ({
      ...base,
      width: '16px',
      height: '16px',
      padding: '0',
      marginRight: '12px',
      color: 'rgba(204, 204, 204, 0.30)',
      '&:hover': {
        color: 'rgba(255, 255, 255, 0.9)',
      },
      svg: {
        width: '16px',
        height: '16px',
      },
    }),
  };
}
