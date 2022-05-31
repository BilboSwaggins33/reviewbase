import { Box, styled, InputAdornment, Paper, Typography, IconButton, Divider, InputBase, AppBar, Toolbar, Button, Stack, alpha } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ArticleSharpIcon from '@mui/icons-material/Article';
import "@fontsource/open-sans"
import { useState } from "react";
import { useRouter } from 'next/router'

export default function Home(props) {
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const router = useRouter()

    const handleSubmit = async (e) => {
        e.preventDefault()
        //const result = await res.json()

        router.push({ pathname: '/loading', query: { q: query, l: location } })
    }
    //#bee1dc
    //<Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/about' }) }}>about</Button>
    //<Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { handleContact }}>contact</Button>
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
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                        <Stack direction='row' spacing='40px'>
                            <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/home' }) }}>home</Button>
                            <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/about' }) }}>about</Button>
                        </Stack>
                    </Toolbar>
                </AppBar>
            </Box>
            <Box className='App-header' sx={{ backgroundColor: '#ded6d0', justifyContent: 'center', height: '50vh', display: 'flex', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h1" component="div" color='#3c0008' sx={{ pb: '30px', textAlign: 'left', fontFamily: 'Open Sans' }}>review base</Typography>
                    <form id="inputs" autoComplete='off' onSubmit={handleSubmit} spellCheck="false">
                        <Paper elevation={0} className="App-search" sx={{ backgroundColor: '#fff', height: '80px', alignItems: 'center', display: 'flex' }}>
                            <SearchTextField startAdornment={<InputAdornment position="start">
                                <RestaurantIcon sx={{ color: '#303030' }} />
                            </InputAdornment>}
                                variant="standard" placeholder="Find a Restaurant..." sx={{ width: '40vw', marginX: '2vw' }} name="query" onChange={(e) => setQuery(e.target.value)} />
                            <Divider orientation='vertical' flexItem variant='middle' color='#fff' />

                            <SearchTextField startAdornment={<InputAdornment position="start">
                                <LocationOnIcon sx={{ color: '#303030' }} />
                            </InputAdornment>}
                                variant="standard" placeholder="Location..." sx={{ width: '40vw', marginX: '2vw' }} name="queryLoc" onChange={(e) => setLocation(e.target.value)} />

                            <Divider orientation='vertical' flexItem variant='middle' color='#fff' />
                            <IconButton type="submit" sx={{ color: '#303030', marginX: '5px' }}><SearchIcon /></IconButton>
                        </Paper>
                    </form>
                </Box>
            </Box>
            <Box sx={{ backgroundColor: "#ded6d0", height: '45vh' }}></Box>
        </ Box>
    )

}


const SearchTextField = styled(InputBase)({
    '& .MuiInputBase-input': {
        color: '#303030',
        padding: '10px',
        fontSize: '20px',
        fontFamily: 'Open Sans'

    },
})

const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.35),
    '&:hover': {
        backgroundColor: alpha(theme.palette.common.white, 0.5),
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
        color: '#303030',
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

