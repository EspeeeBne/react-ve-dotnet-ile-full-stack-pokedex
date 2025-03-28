import Header from '../Header/Navbar';
import Footer from '../Footer/Footer';
import { styled } from '@mui/material/styles';
import { GlobalStyles } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Wrapper = styled('div')(({ theme }) => ({
display: 'flex',
width: '100%',
flexDirection: 'column',
height: '100vh',
borderRadius: '16px',
overflow: 'hidden',
}));

const ScrollNode = styled('div')(({ theme }) => ({
    flex: 1,
    overflowY: 'auto',
    transform: 'translateZ(0)',
    borderRadius: '16px',
    boxSizing: 'border-box',
    paddingTop: 'auto',
    paddingBottom: 'auto',
    [theme.breakpoints.down('sm')]: {
    paddingTop: 'auto',
    },
}));

const PaddingDiv = styled('div')(({ theme }) => ({
    boxSizing: 'border-box',
    padding: 'auto',
    width: '100%',
    borderRadius: '16px',
    [theme.breakpoints.down('sm')]: {
    padding: '8px',
    },
}));

const MainContainer = styled('section')({
isolation: 'isolate',
borderRadius: '16px',
});

const globalStyles = (
<GlobalStyles
    styles={(theme) => ({
    '*::-webkit-scrollbar': {
        width: 8,
        borderRadius: '16px',
    },
    '*::-webkit-scrollbar-track': {
        backgroundColor: theme.palette.background.paper,
        borderRadius: '16px',
    },
    '*::-webkit-scrollbar-thumb': {
        backgroundColor: theme.palette.primary.main,
        borderRadius: '16px',
    },
    })}
/>
);

export default function HOC(props) {

return (
    <>
    {globalStyles}
    <Wrapper>
        <Header />
        <ScrollNode id="scroll-node">
        <PaddingDiv>
            <MainContainer>
            <Outlet />
            </MainContainer>
        </PaddingDiv>
        </ScrollNode>
        <Footer />
    </Wrapper>
    </>
);
}
