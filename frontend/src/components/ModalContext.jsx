import React from "react";

const ModalContext = React.createContext({});

export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;
export default ModalContext;
