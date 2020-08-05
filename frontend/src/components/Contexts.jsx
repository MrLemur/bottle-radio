import React from "react";

const ModalContext = React.createContext({});
const VisualiserContext = React.createContext({});

export const ModalProvider = ModalContext.Provider;
export const ModalConsumer = ModalContext.Consumer;

export const VisualiserProvider = VisualiserContext.Provider;
export const VisualiserConsumer = VisualiserContext.Consumer;

export { ModalContext, VisualiserContext };
