import { Box, styled, InputAdornment, Paper, Typography, IconButton, Divider, InputBase, AppBar, Toolbar, Button, Stack, alpha } from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import ArticleSharpIcon from '@mui/icons-material/Article';
import "@fontsource/open-sans"
import "@fontsource/baskervville"
export default function About() {
    let router = useRouter()
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const handleSubmit = async (e) => {
        e.preventDefault()
        router.push({ pathname: '/loading', query: { q: query, l: location } })
    }
    /*
    display restaurant reviews and ratings from different sources, providing
    insightful information on a restaurant's quality
    Quality at a glance
    ratings and reviews from multiple sources allows for cross-checking and 
    overarching opinions, vastly improving accuarcy
    All in one place
    from popular to bland, everything you need to know about a restaurant is
    brought together into a single source
    */
    return (
        <Box>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static" sx={{ backgroundColor: '#ded6d0', height: '5vh', minHeight: '75px' }}>
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                            onClick={() => { router.push({ pathname: '/home' }) }}
                        >
                            <ArticleSharpIcon sx={{ color: '#3c0008', fontSize: '50px' }} />
                        </IconButton>
                        <form id="inputs" autoComplete='off' onSubmit={handleSubmit} spellCheck="false">
                            <Paper elevation={0} className="App-search" sx={{ backgroundColor: '#fff', height: '50px', alignItems: 'center', display: 'flex' }}>
                                <SearchTextField variant="standard" placeholder="Find a Restaurant..." sx={{ width: '250px', marginX: '25px' }} name="query" onChange={(event) => setQuery(event.target.value)} />
                                <Divider orientation='vertical' flexItem variant='middle' color='#fff' />

                                <SearchTextField variant="standard" placeholder="Location..." sx={{ width: '250px', marginX: '25px' }} name="queryLoc" onChange={(event) => setLocation(event.target.value)} />

                                <Divider orientation='vertical' flexItem variant='middle' color='#fff' />
                                <IconButton type="submit" sx={{ color: '#303030', marginX: '15px' }}><SearchIcon /></IconButton>
                            </Paper>
                        </form>
                        <Typography variant="h6" component="div" sx={{ color: '#303030', fontFamily: 'Open Sans', flexGrow: 1 }}></Typography>
                        <Stack direction='row' spacing='40px'>
                            <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/home' }) }}>home</Button>
                            <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/about' }) }}>about</Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box sx={{ backgroundColor: '#ded6d0' }}>
                <Box sx={{ padding: '40px', color: '#3c0008' }}>
                    <Typography variant='h2' sx={{ fontFamily: 'Baskervville', fontWeight: 700 }}>About</Typography>
                    <Box sx={{ mt: '30px' }}>
                        <Typography variant='h3' sx={{ fontFamily: 'Open Sans' }}>Review base grabs reviews from different sources,</Typography>
                        <Typography variant='h3' sx={{ fontFamily: 'Open Sans' }}>providing an overall view of a restaurant.</Typography>
                    </Box>
                    <Typography variant='h3' sx={{ fontFamily: 'Baskervville', fontWeight: 700, mt: '40px' }}>How to use?</Typography>
                    <Box sx={{ display: 'flex' }}>
                        <img src="/reviewbaseex.jpg" width="800px" height="auto" style={{ marginTop: '50px' }} />
                        <Box sx={{ margin: '50px' }}>
                            <Box>
                                <Typography variant="h4" style={{ fontFamily: 'Open Sans' }}>An important thing to mention is that the data displayed in the charts
                                    is taken from a smaller sample size. It does not use all of the review data.
                                </Typography>
                            </Box>
                            <Box sx={{ mt: '50px' }}>
                                <Typography variant="h4" style={{ fontFamily: 'Open Sans' }}>The circlular graph displays overall attitudes about a restaurant,
                                    while the bar graph gives more in-depth details based on three categories: Customer Service, Facilities, and Food Quality.
                                    It also shows the most mentioned topics in the restaurant's reviews.</Typography>
                            </Box>
                            <Box sx={{ mt: '50px' }}>
                                <Typography variant="h4" style={{ fontFamily: 'Open Sans' }}>The line graph displays attitudes over time; a score of 1 represents positive, a score of -1
                                    represents negative, and a score of 0 represents a neutral feeling.</Typography>
                            </Box>
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Box>
    )
}

const SearchTextField = styled(InputBase)({
    '& .MuiInputBase-input': {
        color: '#303030',
        padding: '5px',
        fontSize: '20px',
        fontFamily: 'Open Sans'

    },
})

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.25),
    },
    marginLeft: 0,
    width: '100%',
    [theme.breakpoints.up('sm')]: {
        marginLeft: theme.spacing(1),
        width: 'auto',
    },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
        padding: theme.spacing(1, 1, 1, 0),
        color: '#0c0c42',
        fontSize: '20px',
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            width: '30ch',
            '&:focus': {
                width: '35ch',
            },
        },
    },
}));

/*
<Box sx={{ paddingX: '10vw', pb: '10vh', pt: '5vh' }}>
                    <Typography variant='h3' sx={{ fontFamily: 'Open Sans' }}>rauntrview provides</Typography>
                    <Typography variant='h2' sx={{ fontFamily: 'Open Sans' }}>insight & information.</Typography>
                    <Typography variant='h6' sx={{ fontFamily: 'Open Sans', marginY: '5px' }}>display restaurant reviews and ratings from different sources,</Typography>
                    <Typography variant='h6' sx={{ fontFamily: 'Open Sans' }}>presenting comprehensive details on a restaurant's quality.</Typography>
                </Box>
                <Divider color='#303030' />
                <Box sx={{ display: 'flex' }}>
                    <Box sx={{ paddingX: '10vw', paddingY: '10vh' }}>
                        <Typography variant='h3' sx={{ fontFamily: 'Open Sans' }}>quality,</Typography>
                        <Typography variant='h2' sx={{ fontFamily: 'Open Sans' }}>at a glance.</Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Open Sans', mt: '30px' }}>having multiple sources grants a bounty of benefits;
                            it allows for cross-checking opinions, experiences,
                            and perspectives, vastly improving accuarcy in judgement.
                        </Typography>
                        <img src="https://cdn.dribbble.com/users/883236/screenshots/12005607/media/094847e469772d6ae2b68691155df04d.png?compress=1&resize=1200x900" style={{ width: '600px', height: '450px', marginTop: '50px' }} />
                    </Box>
                    <Divider orientation='vertical' flexItem color='#303030' />
                    <Box sx={{ paddingX: '10vw', paddingY: '10vh' }}>
                        <Typography variant='h3' sx={{ fontFamily: 'Open Sans' }}>all in</Typography>
                        <Typography variant='h2' sx={{ fontFamily: 'Open Sans' }}>one place</Typography>
                        <Typography variant='h6' sx={{ fontFamily: 'Open Sans', mt: '30px' }}>from popular to bland, everything you need
                            to know about a restaurant is brought together into a single source.
                        </Typography>
                        <img src="https://cdn.dribbble.com/users/883236/screenshots/12005607/media/094847e469772d6ae2b68691155df04d.png?compress=1&resize=1200x900" style={{ width: '600px', height: '450px', marginTop: '50px' }} />
                    </Box>
                </Box>

*/