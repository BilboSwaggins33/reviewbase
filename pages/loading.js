import { Box, CircularProgress } from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
export default function Loading(props) {
    let router = useRouter()
    useEffect(() => {
        router.push({ pathname: '/results', query: { q: props.q, l: props.l } })
    }, [])
    return (
        <Box sx={{ display: 'flex', justifyContent: "center", alignItems: "center", color: "#3c0008" }}>
            <Box sx={{ top: '50%', transform: 'translateY(-50%)', position: 'absolute', margin: 0 }}>
                <CircularProgress color="inherit" size={100} />
            </Box>
        </Box>
    )
}

export async function getServerSideProps(context) {
    console.log(context.query)
    return {
        props: context.query, // will be passed to the page component as props
    }
}