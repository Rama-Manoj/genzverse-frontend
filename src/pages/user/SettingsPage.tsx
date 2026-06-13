import React, { useEffect } from 'react';
import { EditProfile } from '../profile/EditProfile';

export const SettingsPage: React.FC = () => {
  useEffect(() => {
    document.title = 'User Settings | GenzVerse';
  }, []);

  return <EditProfile />;
};

export default SettingsPage;
