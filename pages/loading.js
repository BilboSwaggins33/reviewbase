import { Box, styled, Typography, IconButton, InputBase, AppBar, Toolbar, Button, Stack, Paper, Divider, Card, Rating, Chip } from "@mui/material"
import { useRouter } from 'next/router'
import { useState, useEffect } from "react"
export default function Loading(props) {
    let router = useRouter()
    useEffect(() => {
        router.push({ pathname: '/results', query: { q: props.q, l: props.l } })
    }, [])
    return (<Box>
        Loading
    </Box>)
}

export async function getServerSideProps(context) {
    console.log(context.query)
    return {
        props: context.query, // will be passed to the page component as props
    }
}