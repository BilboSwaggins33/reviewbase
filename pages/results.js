import { Box, styled, Typography, IconButton, InputBase, AppBar, Toolbar, Button, Stack, Paper, Divider, Card, Rating, Chip, CardContent, Select, MenuItem, FormControl } from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import ArticleSharpIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import Head from 'next/head'
import mapboxgl from 'mapbox-gl'
import "@fontsource/open-sans"



export default function Results(props) {
    const [pageIsMounted, setPageIsMounted] = useState(false)
    const [query, setQuery] = useState("")
    const [location, setLocation] = useState("")
    const [sort, setSort] = useState("Relevance")
    const [data, setData] = useState(props.temp.results.results)
    const router = useRouter()
    //const data = props.data
    mapboxgl.accessToken = "pk.eyJ1IjoiYmkxYjBiYWciLCJhIjoiY2t4dHFzNGFrNjBwaDMwcGZuMmRtamZ2MiJ9.8Bcuj6FepvrA8HxIaNw2wQ"

    //const ogdata = props.temp.results.results
    //var data = props.temp.results.results
    const request = props.query
    useEffect(() => {
        //mapbox://styles/bi1b0bag/ckxtv7l1l2pq814lkacy57lsb
        setPageIsMounted(true)
        const nav = new mapboxgl.NavigationControl();
        const map = new mapboxgl.Map({
            container: "my-map",
            style: "mapbox://styles/bi1b0bag/ckxwhatjp14lb16l79ue09yv5",
            center: [data[0].geometry.location.lng, data[0].geometry.location.lat],
            zoom: 13,
            maxZoom: 17.5,
            minZoom: 10,
            pitch: 60,
            attributionControl: false
        });
        map.addControl(nav, 'top-right');
        for (let i = 0; i < data.length; i++) {
            const marker = new mapboxgl.Marker({ color: "#826e60" })
                .setLngLat([data[i].geometry.location.lng, data[i].geometry.location.lat])
                .addTo(map)
        }
    }, [])

    const handleSubmit = async (e) => {
        e.preventDefault()
        router.push({ pathname: '/loading', query: { q: query, l: location } })
    }

    const handleChange = (event) => {
        setSort(event.target.value);
        if (event.target.value == "Relevance") {
            setData(props.temp.results.results)
        } else if (event.target.value == "Highest") {
            setData([...data].sort((a, b) => b.rating - a.rating))
        } else if (event.target.value == "Lowest") {
            setData([...data].sort((a, b) => a.rating - b.rating))
        } else if (event.target.value == "Most") {
            setData([...data].sort((a, b) => b.user_ratings_total - a.user_ratings_total))
        } else if (event.target.value == "Least") {
            setData([...data].sort((a, b) => a.user_ratings_total - b.user_ratings_total))
        }
    };

    return (
        <Box>
            <Head>
                <title>Create Next App</title>
                <link rel="icon" href="/favicon.ico" />
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>
            <Box >
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
                                    <SearchTextField variant="standard" placeholder="Find a Restaurant..." sx={{ width: '50vw', marginX: '25px' }} name="query" onChange={(event) => setQuery(event.target.value)} />
                                    <Divider orientation='vertical' flexItem variant='middle' color='#fff' />

                                    <SearchTextField variant="standard" placeholder="Location..." sx={{ width: '250px', marginX: '25px' }} name="queryLoc" onChange={(event) => setLocation(event.target.value)} />

                                    <Divider orientation='vertical' flexItem variant='middle' color='#fff' />
                                    <IconButton type="submit" sx={{ color: '#303030', marginX: '15px' }}><SearchIcon /></IconButton>
                                </Paper>
                            </form>
                            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
                            <Stack direction='row' spacing='40px'>
                                <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/home' }) }}>home</Button>
                                <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/about' }) }}>about</Button>
                            </Stack>
                        </Toolbar>
                    </AppBar>
                </Box>
                <Box sx={{ backgroundColor: 'white', display: 'flex' }}>
                    <Box sx={{ p: '30px', overflow: 'auto', width: '100vw', height: '94vh', float: 'left' }}>
                        <Box>
                            <Typography variant="h4" component="div" color='#303030' sx={{ fontFamily: 'Open Sans' }}>Search Results</Typography>
                            <Typography variant="h5" component="div" color='#303030' sx={{ fontFamily: 'Open Sans' }}>{request.q}, {request.l != "" ? request.l : "nearby"}</Typography>
                        </Box>
                        <Box sx={{ display: 'flex', mt: '15px' }}>
                            <Typography variant='h6' sx={{ fontFamily: 'Open Sans', color: '#555555' }}>Sort by: </Typography>
                            <FormControl sx={{ minWidth: 120, marginX: '15px' }}>
                                <Select
                                    value={sort}
                                    onChange={handleChange}
                                    sx={{ fontFamily: 'Open Sans', height: '35px', color: '#555555' }}
                                    variant="outlined"
                                >
                                    <MenuItem value="Relevance" sx={{ fontFamily: 'Open Sans' }}>Relevance</MenuItem>
                                    <MenuItem value="Highest" sx={{ fontFamily: 'Open Sans' }}>Highest Rated</MenuItem>
                                    <MenuItem value="Lowest" sx={{ fontFamily: 'Open Sans' }}>Lowest Rated</MenuItem>
                                    <MenuItem value="Most" sx={{ fontFamily: 'Open Sans' }}>Most Reviewed</MenuItem>
                                    <MenuItem value="Least" sx={{ fontFamily: 'Open Sans' }}>Least Reviewed</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        {data.map((r, i) => (
                            <Button variant='outlined' onClick={() => { router.push({ pathname: '/loadingReviews', query: { state: JSON.stringify(r) } }) }}
                                sx={{
                                    marginY: '20px', textTransform: 'none', color: '#d8d8d8', borderColor: '#e0e0e0', borderWidth: '1.5px',
                                    '&:hover': { backgroundColor: '#f8f8f8', borderColor: '#e0e0e0', borderWidth: '1.5px' }
                                }}>
                                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', width: '600px', padding: '15px' }}>
                                    <Typography sx={{ fontFamily: 'Open Sans', color: '#303030' }} color="#1c1d24" variant='h6'>{r.name}</Typography>
                                    <Box sx={{ marginY: '4px', display: 'flex' }}>
                                        <Rating name="read-only" value={r.rating} readOnly precision={0.1} />
                                        <Typography sx={{ fontFamily: 'Open Sans', color: '#777777', marginX: '5px' }} variant='subtitle1'>{r.user_ratings_total} Google Reviews</Typography>
                                    </Box>
                                    <Typography sx={{ fontFamily: 'Open Sans', color: '#303030', mb: '4px' }} color="#1c1d24" variant='subtitle1'>{r.formatted_address}</Typography>
                                    <Stack direction='row' spacing='10px'>
                                        {r.types.slice(0, 4).map((r) => (
                                            <Chip label={r.split('_').join(' ')} variant="outlined" />
                                        ))}
                                    </Stack>
                                </Box>
                            </Button>

                        ))}

                    </Box>
                    <Box sx={{ width: '100%', height: '94vh' }}>
                        <div id="my-map" style={{ width: '100%', height: '100%' }} />
                    </Box>
                </Box>
            </Box>
        </Box >
    )

}
// '&:hover': { boxShadow: '0 3px 10px rgb(0 0 0 / 0.2)' }
const SearchTextField = styled(InputBase)({
    '& .MuiInputBase-input': {
        color: '#303030',
        padding: '5px',
        fontSize: '20px',
        fontFamily: 'Open Sans'

    },
})




export async function getServerSideProps(context) {
    const res = await fetch(`http://localhost:3000/api/search`, {
        body: JSON.stringify(context.query),
        method: 'POST'
    })
    let temp = await res.json()
    if (!temp) {
        return {
            redirect: {
                destination: '/',
                permanent: false,
            },
        }
    }
    //console.log(temp.results.results)
    let data = { temp, query: context.query }
    //console.log('data', data)
    return {
        props: data, // will be passed to the page component as props
    }
}
