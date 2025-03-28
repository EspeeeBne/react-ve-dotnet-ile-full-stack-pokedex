import React, { createContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const SiteStatusContext = createContext();

export const SiteStatusProvider = ({ children }) => {
const { t } = useTranslation();
const [siteStatus, setSiteStatus] = useState({
    status: true,
    loading: true,
});

useEffect(() => {
    const fetchSiteStatus = async () => {
    try {
        const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/status`);
        if (!response.ok) {
        throw new Error(t('error.networkNotOk'));
        }
        const data = await response.json();
        if (data.status && data.status.toUpperCase() === 'OK') {
        setSiteStatus({ status: true, loading: false });
        } else {
        setSiteStatus({ status: false, loading: false });
        }
    } catch (error) {
        console.error(t('error.fetchingSiteStatus') + ": ", error);
        setSiteStatus({ status: false, loading: false });
    }
    };

    fetchSiteStatus();
}, [t]);

return (
    <SiteStatusContext.Provider value={[siteStatus, setSiteStatus]}>
    {children}
    </SiteStatusContext.Provider>
);
};

export default SiteStatusContext;
