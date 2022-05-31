import { Box, LinearProgress, Stack, Typography } from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
import "@fontsource/open-sans"

export default function LoadingReviews(props) {
    let router = useRouter()
    useEffect(() => {
        router.push({ pathname: '/review', query: { state: props.state } })

    }, [])
    return (
        <Box sx={{ color: "#3c0008" }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: '40vh', ml: '15%' }}>
                <Typography sx={{ fontFamily: 'Open Sans', fontWeight: 900 }} variant='h4'>Loading...</Typography>
            </Box>
            <Stack justifyContent="center" alignItems="center" sx={{ display: 'flex' }}>
                <LinearProgress color="inherit" sx={{ height: '15px', width: '70%', mt: '3vh' }} />
            </Stack>
        </Box >
    )
}

export async function getServerSideProps(context) {
    console.log(context.query)
    return {
        props: context.query, // will be passed to the page component as props
    }
}