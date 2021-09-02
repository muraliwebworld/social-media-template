import React, { useContext, useEffect, useState } from 'react';
import { getApolloContext } from '@apollo/client';
import AWSAppSyncClient from 'aws-appsync';

const Rehydrated = ({ children }) => {
  const { client } = useContext(getApolloContext());
  const [rehydrated, setState] = useState(false);

  useEffect(() => {
    if (client.clientpublic instanceof AWSAppSyncClient) {
      (async () => {
        await client.clientpublic.hydrated();
        setState(true);
      })();
    }
    else
    {
        console.log('client not available')
    }
  }, [client.clientpublic]);
  return rehydrated ? <>{children}</> : null;
};

export default Rehydrated;