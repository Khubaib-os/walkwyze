import React, { createContext, useContext, useState } from 'react';

const DetailPageContext = createContext();

export const useDetailPage = () => {
  return useContext(DetailPageContext);
};

export const DetailPageProvider = ({ children }) => {
  const [isDetailPageOpen, setIsDetailPageOpen] = useState(false);

  return (
    <DetailPageContext.Provider value={{ isDetailPageOpen, setIsDetailPageOpen }}>
      {children}
    </DetailPageContext.Provider>
  );
};