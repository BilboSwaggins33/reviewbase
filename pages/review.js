import { Box, styled, Typography, IconButton, InputBase, AppBar, Toolbar, Button, Stack, Paper, Divider, Card, Rating, Tab, CardContent, Chip } from "@mui/material"
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from "react"
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import * as dayjs from 'dayjs'
import ArticleSharpIcon from '@mui/icons-material/Article';
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import StarRoundedIcon from '@mui/icons-material/StarRounded';
import Head from 'next/head'
const mapboxgl = require("mapbox-gl");
import "@fontsource/open-sans"


export default function Review(props) {
  const router = useRouter()
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [value, setValue] = useState("1");
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const googleData = props.googleResults.result
  const yelpData = props.yelpResults
  const fsqData = props.fsqResults

  const classifications = props.classifications
  let scoreThreshHold = 0.25
  let magnitudeThreshHold = 3.5
  const ovrSentiment = [
    { name: 'positive', value: classifications.filter((obj) => obj[0].score > scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold) },
    { name: 'negative', value: classifications.filter((obj) => obj[0].score < -scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold) },
    { name: 'neutral', value: classifications.filter((obj) => obj[0].magnitude < 3.5 && obj[0].score > -scoreThreshHold && obj[0].score < scoreThreshHold) }
  ]

  const fc = classifications.filter(function (element) {
    return element.splice(0, 1).filter((obj) => obj.classification.score > 0.9)
  })
  console.log(fc)
  /*
  const ovrSentiment = [
    { name: 'positive', value: classifications.filter((obj) => obj[0].score === 'Positive' && obj[0].magnitude >= 0.8) },
    { name: 'negative', value: classifications.filter((obj) => obj[0].score === 'Negative' && obj[0].magnitude >= 0.8) },
    { name: 'neutral', value: classifications.filter((obj) => obj[0].score === 'Neutral' || obj[0].magnitude < 0.8) }
  ]
  let fc = classifications.filter((obj) => obj.some(el => el.tag_name === 'Facilities'))
  let cs = classifications.filter((obj) => obj.some(el => el.tag_name === "Customer Service"))
  let fq = classifications.filter((obj) => obj.some(el => el.tag_name === 'Food Quality'))
  const topicSentiment = [
    {
      topic: 'Facilities',
      positive: fc.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
      negative: fc.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
      neutral: fc.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
    },
    {
      topic: 'Customer Service',
      positive: cs.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
      negative: cs.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
      neutral: cs.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
    },
    {
      topic: 'Food Quality',
      positive: fq.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
      negative: fq.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
      neutral: fq.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
    }
  ]*/
  const sortOptions = [
    'Highest rated to lowest',
    'Lowest rated to highest',
    'Most recent',
    'Least recent',
  ];

  mapboxgl.accessToken = "pk.eyJ1IjoiYmkxYjBiYWciLCJhIjoiY2t4dHFzNGFrNjBwaDMwcGZuMmRtamZ2MiJ9.8Bcuj6FepvrA8HxIaNw2wQ"
  useEffect(() => {
    //mapbox://styles/bi1b0bag/ckxtv7l1l2pq814lkacy57lsb
    setPageIsMounted(true)
    const nav = new mapboxgl.NavigationControl();
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/bi1b0bag/ckxwhatjp14lb16l79ue09yv5",
      center: [googleData.geometry.location.lng, googleData.geometry.location.lat],
      maxZoom: 17.5,
      minZoom: 13,
      zoom: 15,
      pitch: 0,
      interactive: true,
      attributionControl: false
    });
    map.addControl(nav, 'top-right');
    const marker = new mapboxgl.Marker({ color: "#826e60" })
      .setLngLat([googleData.geometry.location.lng, googleData.geometry.location.lat])
      .addTo(map)
    getAverage()

  }, [])

  function getAverage() {
    let avg, totalReviews;
    if ('stats' in fsqData) {
      avg = ((yelpData.info.overall.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] + googleData.rating + (fsqData.rating / 2)) / 3).toFixed(2)
      totalReviews = (yelpData.info.numreviews.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] + googleData.user_ratings_total + fsqData.stats.total_ratings)
    } else {
      totalReviews = (yelpData.info.numreviews.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] + googleData.user_ratings_total)
      avg = ((yelpData.info.overall.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] + googleData.rating) / 2).toFixed(2)
    }
    console.log(avg, totalReviews)
    setAverageRating(avg)
    setTotalReviews(totalReviews)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    router.push({ pathname: '/results', query: { q: query, l: location } })
  }
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const COLORS = ['#82ca9d', '#FF7F7F', '#FFBB28'];
  const renderActiveShape = (props) => {
    const RADIAN = Math.PI / 180;
    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
    const sin = Math.sin(-RADIAN * midAngle);
    const cos = Math.cos(-RADIAN * midAngle);
    const sx = cx + (outerRadius + 10) * cos;
    const sy = cy + (outerRadius + 10) * sin;
    const mx = cx + (outerRadius + 30) * cos;
    const my = cy + (outerRadius + 30) * sin;
    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
    const ey = my;
    const textAnchor = cos >= 0 ? 'start' : 'end';
    return (
      <g>
        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill}>
          {payload.name}
        </text>
        <Sector
          cx={cx}
          cy={cy}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
          startAngle={startAngle}
          endAngle={endAngle}
          fill={fill}
        />
        <Sector
          cx={cx}
          cy={cy}
          startAngle={startAngle}
          endAngle={endAngle}
          innerRadius={outerRadius + 6}
          outerRadius={outerRadius + 10}
          fill={fill}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const onMouseEnter = useCallback((data, index) => {
    setActiveIndex(index);
  }, []);

  //TODO:  Facebook review
  /*
   <BarChart
                        width={500}
                        height={300}
                        data={topicSentiment}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 5,
                        }}
                      >
                        <XAxis dataKey="topic" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="positive" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="neutral" stackId="a" fill="#FFBB28" />
                        <Bar dataKey="negative" stackId="a" fill="#FF7F7F" />
                      </BarChart>
                      */
  return (
    <Box>
      <Head>
        <title>rauntrview</title>
        <link rel="icon" href="/favicon.ico" />
        <link
          href="https://api.mapbox.com/mapbox-gl-js/v1.12.0/mapbox-gl.css"
          rel="stylesheet"
        />
      </Head>


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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}></Typography>
            <Stack direction='row' spacing='40px'>
              <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/home' }) }}>home</Button>
              <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { router.push({ pathname: '/about' }) }}>about</Button>
              <Button variant="text" sx={{ fontFamily: 'Open Sans', textTransform: 'none', fontSize: '25px', color: '#3c0008' }} onClick={() => { handleContact }}>contact</Button>
            </Stack>
          </Toolbar>
        </AppBar>
      </Box>


      <Box sx={{ width: '100%', height: '40vh' }}>
        <div id="my-map" style={{ width: '100%', height: '100%' }} />
      </Box>


      <Box sx={{ justifyContent: 'center', display: 'flex', alignContent: 'flex-start' }}>

        <Box sx={{ marginX: '30px' }}>
          <Box sx={{ paddingY: '4vh' }}>
            <Typography variant="h3" sx={{ fontFamily: 'Open Sans', fontWeight: '900' }}>{googleData.name}</Typography>
            <Typography variant="h5" sx={{ fontFamily: 'Open Sans', paddingY: '10px' }}>{googleData.formatted_address}</Typography>
            <Box sx={{ marginY: '20px' }}>
              <Card variant='outlined' sx={{ height: '90%', backgroundColor: '#f8f8f8', borderWidth: '0px' }}>
                <CardContent>
                  <Box sx={{ padding: '20px' }}>
                    <Box sx={{ display: 'flex' }}>
                      <Box>
                        <Box sx={{ display: 'flex' }}>
                          <Typography variant='h3' sx={{ fontFamily: 'Open Sans', fontWeight: '900' }}>{averageRating} </Typography>
                          <Typography variant='h4' sx={{ fontFamily: 'Open Sans', margin: '15px', color: '#666666' }}>/ 5</Typography>
                        </Box>
                        <Rating icon={<StarRoundedIcon fontSize="inherit" />} emptyIcon={<StarRoundedIcon fontSize="inherit" />} name="read-only" size='large' value={averageRating} readOnly precision={0.2} sx={{ ml: '-5px' }} />
                        <Typography variant='h5' sx={{ fontFamily: 'Open Sans', color: '#777777', marginY: '20px' }}>Based on {totalReviews} total ratings</Typography>
                      </Box>
                      <Box sx={{ marginX: '60px' }}>
                        {googleData.opening_hours.weekday_text.map((r, i) => (
                          <Typography variant='body2' sx={{ fontFamily: 'Open Sans', color: '#aeaeae' }}>{r}</Typography>
                        ))}
                      </Box>
                    </Box>
                    <Divider variant="middle" />
                    <Box sx={{ marginY: '20px' }}>
                      <Box>
                        <Stack direction='row' spacing='10px'>
                          {googleData.types.slice(0, 4).map((r) => (
                            <Chip label={r.split('_').join(' ')} variant="outlined" />
                          ))}
                        </Stack>
                      </Box>
                      <Box sx={{ mt: '20px', display: 'flex' }}>
                        <Typography variant='h6' sx={{ fontFamily: 'Open Sans', color: '#777777' }}>Price:</Typography>
                        <Rating sx={{ m: '5px' }} readOnly value={googleData.price_level} max={3} icon={<AttachMoneyIcon fontSize='inherit' sx={{ color: '#777777' }} />} emptyIcon={<AttachMoneyIcon fontSize='inherit' />} precision={1} />
                      </Box>
                      <Typography variant='h6' sx={{ fontFamily: 'Open Sans', color: '#777777' }}>Phone: {googleData.formatted_phone_number}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <PieChart width={400} height={300}>
                        <Pie
                          data={ovrSentiment}
                          dataKey="value.length"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          innerRadius={50}
                          activeIndex={activeIndex}
                          activeShape={renderActiveShape}
                          onMouseOver={onMouseEnter}
                        >
                          {ovrSentiment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>

                    </Box>
                    <Box>
                      <LineChart
                        width={500}
                        height={300}
                        data={ovrSentiment}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5, }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="time" />
                      </LineChart>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>


        <Box sx={{ margin: '40px' }}>
          <TabContext value={value}>
            <StyledTabList onChange={handleChange} sx={{ '&:hover': { color: '#000' } }}>
              <StyledTab disableRipple={true} label="Yelp" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="1" />
              <StyledTab disableRipple={true} label="Google" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="2" />
              <StyledTab disableRipple={true} label="FourSquare" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="3" />
            </StyledTabList>
            <TabPanel value="1" >
              <Box>
                {yelpData.reviews.map((r, i) => (
                  <Card variant='outlined' sx={{ marginY: '3vh', p: '15px', width: '20vw' }} key={i}>
                    <CardContent>
                      <Box sx={{ display: 'flex' }}>
                        <img src={r.img} style={{ width: '45px', height: '45px', borderRadius: '50%' }}></img>
                        <Box sx={{ marginX: '10px' }}>
                          <Typography variant='body1' sx={{ fontFamily: 'Open Sans' }}>{r.user}</Typography>
                          <Typography variant='caption' sx={{ fontFamily: 'Open Sans' }}>{(r.date).slice(0, 10)}</Typography>
                        </Box>
                      </Box>
                      <Rating value={r.rating.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0]} readOnly precision={0.1} sx={{ marginY: '10px' }} />
                      <Typography variant='body2' sx={{ fontFamily: 'Open Sans', marginY: '15px' }}>{r.review}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value="2">
              <Box>
                {googleData.reviews.map((r, i) => (
                  <Card variant='outlined' sx={{ marginY: '3vh', p: '15px', width: '20vw' }} key={i}>
                    <CardContent>
                      <Box sx={{ display: 'flex' }}>
                        <img src={r.profile_photo_url} style={{ width: '45px', height: '45px' }}></img>
                        <Box sx={{ marginX: '10px' }}>
                          <Typography variant='body1' sx={{ fontFamily: 'Open Sans' }}>{r.author_name}</Typography>
                          <Typography variant='caption' sx={{ fontFamily: 'Open Sans' }}>{r.relative_time_description}</Typography>
                        </Box>
                      </Box>
                      <Rating value={r.rating} readOnly precision={0.1} sx={{ marginY: '10px' }} />
                      <Typography variant='body2' sx={{ fontFamily: 'Open Sans', marginY: '20px' }}>{r.text}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>
            <TabPanel value="3">
              <Box>
                {fsqData.tips.map((r, i) => (
                  <Card variant='outlined' sx={{ marginY: '3vh', p: '10px', width: '20vw' }} key={i}>
                    <CardContent>
                      <Typography variant='body2' sx={{ fontFamily: 'Open Sans' }}>{r.created_at}</Typography>
                      <Typography variant='body1' sx={{ fontFamily: 'Open Sans', paddingY: '10px' }}>{r.text}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </TabPanel>
          </TabContext>
        </Box>


      </Box>
    </Box >
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

const StyledTabList = styled(TabList)({
  '& .MuiTabs-indicator': {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: '#e0e0e0'
  },
  '& .MuiTabs-indicatorSpan': {
    maxWidth: 40,
    width: '100%',
  }
})

const StyledTab = styled(Tab)({
  textTransform: 'none',
  color: '#b1b1b1',
  backgroundColor: 'none',
  '&.Mui-selected': {
    color: '#b3b3b3',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
  '&.MuiTab-root:hover': {
    color: '#959595',
    opacity: 1
  }
})

export async function getServerSideProps(context) {
  let r = JSON.parse(context.query.state)
  //console.log('restaurant google data', r)
  const res = await fetch('http://localhost:3000/api/getReviews', {
    body: JSON.stringify({
      address: r.formatted_address,
      id: r.place_id,
      name: r.name,
      coord: r.geometry.location
    }),
    method: 'POST'
  })

  const data = await res.json()
  if (!res) {
    return {
      notFound: true,
    }
  }

  return {
    props: data, // will be passed to the page component as props
  }
}
/*
  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                          <PieChart width={400} height={300}>
                                              <Pie
                                                  data={ovrSentiment}
                                                  dataKey="value.length"
                                                  cx="50%"
                                                  cy="50%"
                                                  outerRadius={80}
                                                  innerRadius={60}
                                                  activeIndex={activeIndex}
                                                  activeShape={renderActiveShape}
                                                  onMouseEnter={onMouseEnter}
                                              >
                                                  {ovrSentiment.map((entry, index) => (
                                                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                  ))}
                                              </Pie>
                                          </PieChart>
                                          <BarChart
                                              width={500}
                                              height={300}
                                              data={topicSentiment}
                                              margin={{
                                                  top: 20,
                                                  right: 30,
                                                  left: 20,
                                                  bottom: 5,
                                              }}
                                          >
                                              <XAxis dataKey="topic" />
                                              <YAxis />
                                              <Tooltip />
                                              <Bar dataKey="positive" stackId="a" fill="#82ca9d" />
                                              <Bar dataKey="neutral" stackId="a" fill="#FFBB28" />
                                              <Bar dataKey="negative" stackId="a" fill="#FF7F7F" />
                                          </BarChart>
                                      </Box>
                                      <Box>
                                          <LineChart
                                              width={500}
                                              height={300}
                                              data={ovrSentiment}
                                              margin={{
                                                  top: 5,
                                                  right: 30,
                                                  left: 20,
                                                  bottom: 5,
                                              }}
                                          >
                                              <CartesianGrid strokeDasharray="3 3" />
                                              <XAxis dataKey="time" />
                                          </LineChart>
                                      </Box>
  const classifications = [
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.969, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.823 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.638
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.891, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.772 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.748
          }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 1, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
          {
              tag_name: 'Customer Service',
              tag_id: 123986274,
              confidence: 0.694
          }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.983, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.959, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.663 },
          { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.617 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.972, time: [M] },
          { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.63 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.998, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Positive', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ],
      [
          { sent: 'Negative', sent_confidence: 0.999, time: [M] },
          { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
      ]
  ]
  const ovrSentiment = [
      { name: 'positive', value: classifications.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8) },
      { name: 'negative', value: classifications.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8) },
      { name: 'neutral', value: classifications.filter((obj) => obj[0].sent === 'Neutral' || obj[0].sent_confidence < 0.8) }
  ]
  let fc = classifications.filter((obj) => obj.some(el => el.tag_name === 'Facilities'))
  let cs = classifications.filter((obj) => obj.some(el => el.tag_name === "Customer Service"))
  let fq = classifications.filter((obj) => obj.some(el => el.tag_name === 'Food Quality'))
  const topicSentiment = [
      {
          topic: 'Facilities',
          positive: fc.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
          negative: fc.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
          neutral: fc.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
      },
      {
          topic: 'Customer Service',
          positive: cs.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
          negative: cs.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
          neutral: cs.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
      },
      {
          topic: 'Food Quality',
          positive: fq.filter((obj) => obj[0].sent === 'Positive' && obj[0].sent_confidence >= 0.8).length,
          negative: fq.filter((obj) => obj[0].sent === 'Negative' && obj[0].sent_confidence >= 0.8).length,
          neutral: fq.filter((obj) => obj[0].sent === 'Neutral' && obj[0].sent_confidence < 0.8).length,
      }
  ]
  /*
      console.log(dayjs("7/24/2021", "M/DD/YYYY"))
      console.log(dayjs('2017-01-29T02:39:58.000Z', 'YYYY-MM-DD HH:mm:ss.SSS'))
      console.log(dayjs.unix('1636165913'))
      //2017-01-29T02:39:58.000Z
      //1636165913
  */
/*
[
  [
    { sent: 'Positive', sent_confidence: 0.999 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.952 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.799
    }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.974 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.595 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.321
    }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.915 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
    { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.601 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.713 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.98 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.829
    }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.985 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.943 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.611 },
    { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.438 }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.994 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.799
    }
  ],
  [
    { sent: 'Negative', sent_confidence: 1 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
    { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.712 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.815 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.318
    }
  ],
  [
    { sent: 'Negative', sent_confidence: 1 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.85 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.817
    }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.648 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.733
    }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.999 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.717 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 },
    { tag_name: 'Facilities', tag_id: 123986276, confidence: 0.647 }
  ],
  [
    { sent: 'Neutral', sent_confidence: 0.557 },
    { tag_name: 'Customer Service', tag_id: 123986274, confidence: 1 }
  ],
  [
    { sent: 'Negative', sent_confidence: 1 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.995 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.892 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.992 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 0.707 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.987 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
  ],
  [
    { sent: 'Positive', sent_confidence: 0.879 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 }
  ],
  [
    { sent: 'Negative', sent_confidence: 0.996 },
    { tag_name: 'Food Quality', tag_id: 123986275, confidence: 1 },
    {
      tag_name: 'Customer Service',
      tag_id: 123986274,
      confidence: 0.271
    }
  ]
]
*/

/*
   const yelpData = [
       {
           review: 'This was my first time at this restaurant & Gina & Angelica made my table & i feel just at home! They were so attentive to us every second we were there unless they were taking care of other tables. I definitely felt at home eating at this restaurant & will definitely come back the food was DELICIOUS & was brought to us very quickly! Thank you again Gina & Angelica for being the best servers ever!!',
           rating: '5 star rating',
           date: '12/12/2021'
       },
       {
           review: 'This place is amazing !\n' +
               'Gina and Angelica were the best servers !! They were so fun and attentive!',
           rating: '5 star rating',
           date: '12/11/2021'
       },
       {
           review: 'Great meal, the food is really nice. Also great service by James. Had a great time here today.',
           rating: '5 star rating',
           date: '12/18/2021'
       },
       {
           review: "Great place and no it's not just bc of the dancing noodle guy. In fact he was actually off on vacation and we just got limp noodles... ok this is starting to sound very weird. Anyways great place and amazing service. They have a nice waiting area on the first floor with free Asian snacks. The seating is very spacious even for a party of 9. They do a lot to try to accommodate the guests from wrapping your coats up to prevent the smell to this very decked out sauce bar with all the toppings you ever dreamed of.  They got chili oil to roasted soybeans to free all you can eat fruits, tripe and seaweed.It is much better than I'm making it sound.\n" +
               '\n' +
               'As for the hot pot, the meat was very fresh and best part was the broth was not salty! We got the bone broth and tomatoe broth and both were perfect and not overwhelming the veggies. Outside of the Kobe beef I would say the actual hot pot dishes were very similar to many ayce places.\n' +
               '\n' +
               'Def would come back here again but keep in mind it is a la cart so it can def add up. I would rec heavy on the meat though very worth it!',
           rating: '5 star rating',
           date: '12/15/2021'
       },
       {
           review: "Ambiance and cleanliness are great- it's very modern, service is amazing. Food quality was very good (meat and seafood very fresh and I loved the broth- especially the tomato broth)\n" +
               '\n' +
               "As others have mentioned the price is pretty steep compared to other hot pot places and I'm not sure it's worth the extra money I paid. So for that reason I probably won't be back.\n" +
               '\n' +
               `The ice cream machine was broken and the dancing noodle guy was not there. And the waitress didn't know any of the "secret words" that made this place famous in Asia`,
           rating: '4 star rating',
           date: '12/23/2021'
       },
       {
           review: '1. If you have the chance I would 100% recommend making a reservation. Luckily my wife did so we did not have to wait at all but they were very busy, for dinner time.\n' +
               '2. You have to order through iPads which has its pros and cons but I liked it bc you got to customize and explore the menu at your own pace.\n' +
               '3. Service was great! Young lady Angelica was super nice and welcoming! Overall great atmosphere from the whole staff.',
           rating: '4 star rating',
           date: '12/17/2021'
       },
       {
           review: 'Welcome to Chicago, Hai Di Lao!! This location opened up in January per our server.\n' +
               '\n' +
               "I've been to locations in China and Los Angeles & this location is right in line with their usual premium quality & service. This location has ROBOTS to bring out your food though. It's impressive and fun. The robot also announces (in Chinese) what it's carrying.\n" +
               '\n' +
               'I also love that you can order up to 4 broths here! But, we opted for the classic duo of spicy and pork bone.\n' +
               '\n' +
               'Great quality meats and fresh/house made fish and meat balls are my go-to. We tried to get their signature noodle dance but the only dancer was unavailable so they brought a side to us for half off.\n' +
               '\n' +
               "I'll definitely be back when I'm in town & need my hot pot fix!\n" +
               '\n' +
               'Highly recommend rezzies - they use minitable, which is great at sending you reminder texts.',
           rating: '5 star rating',
           date: '12/4/2021'
       },
       {
           review: 'Came by for dinner with a large group. Although Haidilao has a reputation for having very long waits, the restaurant was only half occupied for a weekday dinner. They also take reservations online.\n' +
               '\n' +
               "Downstairs there are snacks right when you check in for the hostess stand. The main dining area was upstairs on the second floor and is very spacious. There is a decent sauce and appetizers bar but not nearly as large as some of the other Haidilaos I've been to. Food and ordering is done on the iPads. I personally feel like Haidilao has a pretty weak broth lineup. The spicy options are way too oily, and the non-spicy options can be fairly bland.\n" +
               '\n' +
               "The combo plates are very good deals. It's pretty easy to over order especially since their per plate options are pretty generous serving sizes. Everything is delivered by the robots although there's staff that will come and unload the plates onto the tables for you so the robotic carts felt somewhat pointless.\n" +
               '\n' +
               "Haidilao is probably the most expensive hot pot option in town and it really felt overpriced. Broth base to start was $20-25 and dishes each were $5-15+. The quality wasn't such a huge step up that I felt it was worth it for me, although there's a ton of hype around Haidilao. It seems like all locations are now charging for the sauce bar which seems rather steep given it's pretty much the same as other places in town which still offer complimentary.",
           rating: '4 star rating',
           date: '11/15/2021'
       },
       {
           review: 'OMG this was the first time I had Haidilao in US! Everything was exactly the same as in China. The food and the service! The dance noodle thing and the robot delivery...and use iPad to order food...had some great time with friends there. Will definitely do it again!! Oh, forgot to mention...the restroom is just like a hotel. lol',
           rating: '5 star rating',
           date: '12/20/2021'
       },
       {
           review: '5/5 for food and service, 3/5 for price.\n' +
               '\n' +
               'I was excited to come here as this place is known for its great service. We made a reservation for a weekday evening and got there right on time so we were seated right away (if not, they have a small snack station with crackers and water for while you wait).\n' +
               '\n' +
               'We chose two bases (tomato and mala), chose various items (including a beef set, vegetable set, fish balls with roe, taro, napa, etc. We also opted for the sauce bar (additional $2 a person that comes with sauces and a few side dishes/light soups).\n' +
               '\n' +
               'The bases are DELICIOUS, especially the tomato. It is creamy and adds a nice light flavor to the fresh ingredients. Instead of the veggie dish, I would recommend opting for the specific veggies that you like (it was small and included some veggies that were just OK (such as baby carrots). The beef was also premium quality and beautifully presented. The biggest disappointment of the night is that I was told about the "Dancing Noodle" and mask-changing trick that they do, but it was sold out when we were there. They were also sold out of enoki mushroom and a few other of my favorite things.\n' +
               '\n' +
               "In terms of the sauce bar, everything was clean with lots of options. However, honestly the side dishes (such as soups) were a bit bland and the other sides didn't taste very good personally.\n" +
               '\n' +
               'The service is excellent! Fun aprons, hair ties, cases for your phone and a little baggy of snacks at the end! We even got a Szechuan spice packet.\n' +
               '\n' +
               "For the negatives, this is a very pricey place since it's a la carte and portions are pretty small. I have heard Happy Lamb is an AYCE for $25 and this probably will run you about double the price.",
           rating: '4 star rating',
           date: '10/28/2021'
       }
   ]

   const data = {
       name: 'Haidilao Hot Pot',
       address: '107 E Cermak Rd Fl 2 Chicago, IL 60616',
       numreviews: '121 reviews',
       link: 'https://www.yelp.com/biz/haidilao-hot-pot-chicago?osq=haidilao',
       rating: '4.5 star rating',
       image: 'https://s3-media0.fl.yelpcdn.com/bphoto/-TI7GvboWvsAVEgtwhdyBA/l.jpg',
       lat: 41.8530292,
       lng: -87.6236188
   }
   */
