export const customStyles = {
    control: (styles) => ({
      ...styles,
      width: "100%",
      maxWidth: "14rem",
      minWidth: "12rem",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "1rem",
      lineHeight: "1.2rem",
      backgroundColor: "#3F3F46",
      cursor: "pointer",
      border: "0px",
      
    }),
    option: (styles) => {
      return {
        ...styles,
        color: "#FFFFFF",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
        width: "100%",
        background: "#3F3F46",
      };
    },
    menu: (styles) => {
      return {
        ...styles,
        backgroundColor: "#fff",
        maxWidth: "14rem",
      };
    },
  
    placeholder: (defaultStyles) => {
      return {
        ...defaultStyles,
        color: "#fff",
        fontSize: "0.8rem",
        lineHeight: "1.75rem",
      };
    },
  };