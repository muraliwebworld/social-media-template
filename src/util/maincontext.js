import React from 'react';

const defaultVal = {authenticated:false,profile: {},data:{}} //Insert the default value here.
export const MainContext = React.createContext(defaultVal);