'use client';
import React from 'react';

interface ContainerProps {
  children: React.ReactNode;
}

const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
    <div className="md:px10 sm:px2 mx-auto max-w-[2520px] px-4 xl:px-20">
      {children}
    </div>
  );
};

export default Container;
