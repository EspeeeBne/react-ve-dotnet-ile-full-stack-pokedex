import React from 'react';
import { useTheme } from '@mui/material/styles';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const Footer = () => {
const theme = useTheme();
const { t } = useTranslation();

return (
    <motion.footer
    animate={{
        backgroundColor: theme.palette.background.paper,
        color: theme.palette.text.primary,
    }}
    transition={{ duration: 0.5 }}
    style={{
        textAlign: 'center',
        padding: '10px 0',
        fontSize: '14px',
        fontWeight: 'bold',
        position: 'static',
        bottom: 0,
        width: '100%',
    }}
    >
    {t('createdBy')}
    </motion.footer>
);
};

export default Footer;
