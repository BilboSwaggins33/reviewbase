import { Box, styled, Typography, IconButton, InputBase, AppBar, Toolbar, Button, Stack, Paper, Divider, Card, Rating, Tab, CardContent, Chip, Select, MenuItem, FormControl } from "@mui/material"
import { PieChart, Pie, Cell, Sector, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line } from 'recharts'
import { useRouter } from 'next/router'
import { useState, useEffect, useCallback } from "react"
import InfiniteScroll from "react-infinite-scroll-component";
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
const util = require('util')


export default function Review(props) {
  const router = useRouter()
  const [pageIsMounted, setPageIsMounted] = useState(false)
  const [query, setQuery] = useState("")
  const [location, setLocation] = useState("")
  const [value, setValue] = useState("1");
  const [averageRating, setAverageRating] = useState(0)
  const [totalReviews, setTotalReviews] = useState(0)
  const [activeIndex, setActiveIndex] = useState(0)
  const [sort, setSort] = useState("")

  let googleData = props.googleResults.result
  let yelpData = props.yelpResults
  let fsqData = props.fsqResults

  const classifications = props.classifications
  /*
    const classifications = [[
      {
        score: -0.30000001192092896,
        magnitude: 7.900000095367432,
        time: '6/12/2021'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999654 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.24645072 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.014171346 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.10000000149011612,
        magnitude: 4.199999809265137,
        time: '3/16/2021'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99999976 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99992514 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000002342877 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: -0.6000000238418579,
        magnitude: 4.599999904632568,
        time: '8/02/2021'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 1 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000044607972 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 1.923965e-8 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 1.7999999523162842,
        time: '2/08/2021'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999999 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.00011094974 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000044258737 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: -0.5, magnitude: 2.5999999046325684, time: '4/29/2021' },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99999964 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.00048940396 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.000003933188 },
        displayName: 'Customer_Service'
      }
    ],
    [
      {
        score: -0.30000001192092896,
        magnitude: 1.7999999523162842,
        time: '7/07/2020'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 1 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.000017129758 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 4.1633727e-10 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: -0.6000000238418579,
        magnitude: 6.699999809265137,
        time: '10/30/2021'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999999 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.99970156 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 4.8272716e-7 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: -0.699999988079071,
        magnitude: 8.699999809265137,
        time: '7/14/2020'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999998 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9998127 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000002016246 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 5.699999809265137,
        time: '4/23/2019'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 1 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9999971 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.9999492 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: -0.699999988079071,
        magnitude: 5.099999904632568,
        time: '2/27/2021'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999946 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.0052254098 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0017584849 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: 0.5, magnitude: 8.199999809265137, time: '7/03/2019' },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999934 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99999917 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0000021692474 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: 0.5, magnitude: 7.599999904632568, time: '7/11/2018' },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999998 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.999996 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.00012923108 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.699999988079071,
        magnitude: 1.399999976158142,
        time: '6/23/2020'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999963 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.99999326 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.00008343809 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: 0.4000000059604645,
        magnitude: 4.099999904632568,
        time: '2/16/2019'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99997705 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.9944359 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9611427 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 4.800000190734863,
        time: '1/27/2022'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999684 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9998571 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.99916404 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 0.8999999761581421,
        time: '9/07/2020'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9997571 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.84498596 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0017529266 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 0.8999999761581421,
        time: '9/16/2020'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9968154 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.17350243 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.00278939 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 0.8999999761581421,
        time: '9/10/2020'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.956513 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.75289506 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.23818335 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: -0.5, magnitude: 5, time: '12/30/2021' },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999999 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.7430058 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.0009940682 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: 0.699999988079071,
        magnitude: 2.799999952316284,
        time: '1/29/2014'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999241 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.8961324 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.56325436 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: 0.699999988079071,
        magnitude: 2.299999952316284,
        time: '4/13/2015'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99999994 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.0055715498 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 1.4340381e-8 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.6000000238418579,
        magnitude: 1.899999976158142,
        time: '11/23/2013'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999993 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.999871 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.017511895 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.800000011920929,
        magnitude: 1.7000000476837158,
        time: '11/19/2013'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 1 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.0002173464 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 1.0408884e-9 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 1.899999976158142,
        time: '11/12/2013'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99995244 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.0004394385 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0000033925724 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.30000001192092896,
        magnitude: 2.5999999046325684,
        time: '11/23/2013'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9999953 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.9994483 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9944641 },
        displayName: 'Customer_Service'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 1.7999999523162842,
        time: '11/15/2013'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999994 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9852565 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0006325326 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.800000011920929,
        magnitude: 0.800000011920929,
        time: '11/14/2013'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999976 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99890697 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.81421834 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: 0.5, magnitude: 1, time: '12/06/2013' },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9999978 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.034683418 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000044457935 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.800000011920929,
        magnitude: 1.600000023841858,
        time: '11/22/2013'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999982 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.6650199 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.2029715 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: -0.30000001192092896,
        magnitude: 0.699999988079071,
        time: '11/21/2013'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99841964 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.0035539933 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.00027218316 },
        displayName: 'Facilities'
      }
    ],
    [
      { score: 0, magnitude: 0, time: '5/30/2015' },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99939454 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.6619712 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.49131146 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.8999999761581421,
        magnitude: 0.8999999761581421,
        time: '6/28/2017'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9862545 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.31240663 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.0011193127 },
        displayName: 'Customer_Service'
      }
    ],
    [
      {
        score: 0.30000001192092896,
        magnitude: 0.30000001192092896,
        time: '11/21/2013'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.85894537 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.6975048 },
        displayName: 'Facilities'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.03181697 },
        displayName: 'Food'
      }
    ],
    [
      {
        score: -0.30000001192092896,
        magnitude: 0.30000001192092896,
        time: '2/28/2014'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.99999964 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99537194 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.000008604977 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.800000011920929,
        magnitude: 1.7000000476837158,
        time: '5/26/2015'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.9999907 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.9985414 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 0.0000010036466 },
        displayName: 'Facilities'
      }
    ],
    [
      {
        score: 0.6000000238418579,
        magnitude: 1.2000000476837158,
        time: '1/18/2014'
      },
      {
        annotationSpecId: '1702374403041394688',
        classification: { score: 0.99995834 },
        displayName: 'Food'
      },
      {
        annotationSpecId: '8314019295835193344',
        classification: { score: 0.002708186 },
        displayName: 'Customer_Service'
      },
      {
        annotationSpecId: '2126917832758263808',
        classification: { score: 8.978228e-7 },
        displayName: 'Facilities'
      }
    ]]
  */
  let scoreThreshHold = 0.3
  let magnitudeThreshHold = 1
  const ovrSentiment = [
    { name: 'positive', value: classifications.filter((obj) => obj[0].score > scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold) },
    { name: 'negative', value: classifications.filter((obj) => obj[0].score < -scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold) },
    { name: 'neutral', value: classifications.filter((obj) => obj[0].magnitude < magnitudeThreshHold || (obj[0].score <= scoreThreshHold && obj[0].score >= -scoreThreshHold)) }
  ]
  const fc = classifications.filter(function (element) {
    if (element.filter((element, index) => index > 0).filter((obj) => obj.displayName == "Facilities").filter((obj) => obj.classification.score > 0.7).length == 0) { return false }
    else { return true }
  })
  const cs = classifications.filter(function (element) {
    if (element.filter((element, index) => index > 0).filter((obj) => obj.displayName == "Customer_Service").filter((obj) => obj.classification.score > 0.7).length == 0) { return false }
    else { return true }
  })
  const fq = classifications.filter(function (element) {
    if (element.filter((element, index) => index > 0).filter((obj) => obj.displayName == "Food").filter((obj) => obj.classification.score > 0.7).length == 0) { return false }
    else { return true }
  })
  //console.log('fc: ', util.inspect(fc, { showHidden: false, depth: null, colors: true }))
  console.log('fc', fc.length, 'cs', cs.length, 'fq', fq.length)
  const topicSentiment = [
    {
      topic: 'Facilities',
      positive: fc.filter((obj) => obj[0].score > scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      negative: fc.filter((obj) => obj[0].score < -scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      neutral: fc.filter((obj) => obj[0].magnitude < magnitudeThreshHold || (obj[0].score <= scoreThreshHold && obj[0].score >= -scoreThreshHold)).length,
    },
    {
      topic: 'Customer Service',
      positive: cs.filter((obj) => obj[0].score > scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      negative: cs.filter((obj) => obj[0].score < -scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      neutral: cs.filter((obj) => obj[0].magnitude < magnitudeThreshHold || (obj[0].score <= scoreThreshHold && obj[0].score >= -scoreThreshHold)).length,
    },
    {
      topic: 'Food Quality',
      positive: fq.filter((obj) => obj[0].score > scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      negative: fq.filter((obj) => obj[0].score < -scoreThreshHold && obj[0].magnitude >= magnitudeThreshHold).length,
      neutral: fq.filter((obj) => obj[0].magnitude < magnitudeThreshHold || (obj[0].score <= scoreThreshHold && obj[0].score >= -scoreThreshHold)).length,
    }
  ]

  const sortOptions = [
    'Highest rated',
    'Lowest rated',
    'Newest',
    'Oldest',
  ];

  mapboxgl.accessToken = "pk.eyJ1IjoiYmkxYjBiYWciLCJhIjoiY2t4dHFzNGFrNjBwaDMwcGZuMmRtamZ2MiJ9.8Bcuj6FepvrA8HxIaNw2wQ"
  useEffect(() => {
    //mapbox://styles/bi1b0bag/ckxtv7l1l2pq814lkacy57lsb
    setPageIsMounted(true)
    //const nav = new mapboxgl.NavigationControl();
    const map = new mapboxgl.Map({
      container: "my-map",
      style: "mapbox://styles/bi1b0bag/ckxwhatjp14lb16l79ue09yv5",
      center: [googleData.geometry.location.lng, googleData.geometry.location.lat],
      maxZoom: 17.5,
      minZoom: 13,
      zoom: 15,
      pitch: 0,
      interactive: false,
      attributionControl: false
    });
    //map.addControl(nav, 'top-right');
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
  const handleSortChange = (event) => {
    setSort(event.target.value)

    if (event.target.value == "Highest") {
      yelpData.reviews = [...yelpData.reviews].sort((a, b) => b.rating.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] - a.rating.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0])
      googleData.reviews = [...googleData.reviews].sort((a, b) => b.rating - a.rating)

    } else if (event.target.value == "Lowest") {
      yelpData.reviews = [...yelpData.reviews].sort((a, b) => a.rating.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0] - b.rating.match(/[+-]?\d+(\.\d+)?/g).map(function (v) { return parseFloat(v); })[0])
      googleData.reviews = [...googleData.reviews].sort((a, b) => a.rating - b.rating)

    } else if (event.target.value == "Newest") {
      googleData.reviews = [...googleData.reviews].sort(
        function (a, b) {
          if (a.relative_time_description.includes("week") && b.relative_time_description.includes("month")) {
            //console.log(parseInt(a.relative_time_description) - parseInt(b.relative_time_description))
            return -1
            //return (parseInt(a.relative_time_description) - parseInt(b.relative_time_description))
          } else if ((a.relative_time_description.includes("month") && b.relative_time_description.includes("week"))) {
            return 1
          } else if ((a.relative_time_description.includes("month") && b.relative_time_description.includes("year"))) {
            return -1
          } else if ((a.relative_time_description.includes("year") && b.relative_time_description.includes("month"))) {
            return 1
          } else if ((a.relative_time_description.includes("week") && b.relative_time_description.includes("year"))) {
            return -1
          } else if ((a.relative_time_description.includes("year") && b.relative_time_description.includes("week"))) {
            return 1
          } else {
            let x = parseInt(a.relative_time_description[0]) || 0
            let y = parseInt(b.relative_time_description[0]) || 0
            return (x - y)
          }
        }
      )
      yelpData.reviews = [...yelpData.reviews].sort((a, b) => new Date(b.date) - new Date(a.date))
      fsqData.tips = [...fsqData.tips].sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

    } else if (event.target.value == "Oldest") {
      googleData.reviews = [...googleData.reviews].sort(
        function (a, b) {
          if (a.relative_time_description.includes("week") && b.relative_time_description.includes("month")) {
            //console.log(parseInt(a.relative_time_description) - parseInt(b.relative_time_description))
            return 1
            //return (parseInt(a.relative_time_description) - parseInt(b.relative_time_description))
          } else if ((a.relative_time_description.includes("month") && b.relative_time_description.includes("week"))) {
            return -1
          } else if ((a.relative_time_description.includes("month") && b.relative_time_description.includes("year"))) {
            return 1
          } else if ((a.relative_time_description.includes("year") && b.relative_time_description.includes("month"))) {
            return -1
          } else if ((a.relative_time_description.includes("week") && b.relative_time_description.includes("year"))) {
            return 1
          } else if ((a.relative_time_description.includes("year") && b.relative_time_description.includes("week"))) {
            return -1
          } else {
            let x = parseInt(a.relative_time_description[0]) || 0
            let y = parseInt(b.relative_time_description[0]) || 0
            return (y - x)
          }
        }
      )
      yelpData.reviews = [...yelpData.reviews].sort((a, b) => new Date(a.date) - new Date(b.date))
      fsqData.tips = [...fsqData.tips].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    }

  }


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
        <Sector cx={cx} cy={cy} innerRadius={innerRadius} outerRadius={outerRadius} startAngle={startAngle} endAngle={endAngle} fill={fill} />
        <Sector cx={cx} cy={cy} startAngle={startAngle} endAngle={endAngle} innerRadius={outerRadius + 6} outerRadius={outerRadius + 10} fill={fill} />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={8} textAnchor={textAnchor} fill="#999">
          {`(${(percent * 100).toFixed(2)}%)`}
        </text>
      </g>
    );
  };

  const CustomTooltip = ({ active, payload, label }) => {
    //console.log(dayjs("12/02/2014").valueOf())
    if (active && payload) {
      return (
        <div className="custom-tooltip" style={{ backgroundColor: '#f3f3f3', opacity: '0.75', color: '#171717', padding: '5px' }}>
          <p className="label" style={{ paddingLeft: '10px', paddingRight: '10px' }}>{`${dayjs(label).format('DD MMM YYYY')}`}</p>
          <p className="desc" style={{ paddingLeft: '10px', paddingRight: '10px' }}> {`Sentiment: ${payload[0].value} `}</p>
        </div>
      );
    }

    return null;
  };

  const onMouseEnter = useCallback((data, index) => {
    //console.log(util.inspect(classifications, { showHidden: false, depth: null, colors: true }))
    setActiveIndex(index);
  }, []);
  //TODO:  Facebook review, Custom Tooltip for line chart
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
                        <Box>
                          <Stack direction='row' spacing='10px'>
                            {googleData.types.slice(0, 4).map((r) => (
                              <Chip label={r.split('_').join(' ')} variant="outlined" />
                            ))}
                          </Stack>
                        </Box>
                      </Box>
                      <Box>
                        <Box sx={{ marginX: '60px' }}>
                          {googleData.opening_hours.weekday_text.map((r, i) => (
                            <Typography variant='body2' sx={{ fontFamily: 'Open Sans', color: '#888888' }}>{r}</Typography>
                          ))}
                        </Box>
                        <Box sx={{ marginY: '10px', marginX: '60px' }}>
                          <Box sx={{ mt: '20px', display: 'flex' }}>
                            <Typography variant='h6' sx={{ fontFamily: 'Open Sans', color: '#777777' }}>Price:</Typography>
                            <Rating sx={{ m: '5px' }} readOnly value={googleData.price_level} max={3} icon={<AttachMoneyIcon fontSize='inherit' sx={{ color: '#777777' }} />} emptyIcon={<AttachMoneyIcon fontSize='inherit' />} precision={1} />
                          </Box>
                          <Typography variant='h6' sx={{ fontFamily: 'Open Sans', color: '#777777' }}>Phone: {googleData.formatted_phone_number}</Typography>
                        </Box>
                      </Box>
                    </Box>

                    <Divider variant="middle" sx={{ marginY: '30px' }} />

                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <BarChart width={500} height={300} data={topicSentiment}
                        margin={{ top: 20, right: 30, left: 20, bottom: 5, }}>
                        <XAxis dataKey="topic" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="positive" stackId="a" fill="#82ca9d" />
                        <Bar dataKey="neutral" stackId="a" fill="#FFBB28" />
                        <Bar dataKey="negative" stackId="a" fill="#FF7F7F" />
                      </BarChart>
                      <PieChart width={400} height={300}>
                        <Pie data={ovrSentiment} dataKey="value.length" outerRadius={80} innerRadius={50} activeIndex={activeIndex} activeShape={renderActiveShape} onMouseEnter={onMouseEnter}>
                          {ovrSentiment.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                      </PieChart>
                    </Box>
                    <Box sx={{ marginY: '40px' }}>
                      <LineChart width={900} height={400} data={classifications.map(function (element) {
                        element[0].score = Math.round(element[0].score * 10) / 10
                        element[0].time = dayjs(element[0].time).valueOf()
                        return element
                      }).sort(function (a, b) { return new Date(a[0].time) - new Date(b[0].time) })} margin={{ top: 5, right: 30, left: 20, bottom: 5, }}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="[0].time" height={75} hide type="number" domain={['dataMin', 'dataMax']} />
                        <Tooltip content={CustomTooltip} />
                        <YAxis domain={[-1, 1]} ticks={[-1, -0.5, 0, 0.5, 1]} />
                        <Line type="monotone" dataKey="[0].score" dot={false} name="Sentiment" stroke="#4a76a5" />
                      </LineChart>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </Box>


        <Box sx={{ margin: '40px' }}>
          <Typography variant="h5" sx={{ fontFamily: 'Open Sans', color: '#666666' }}>Reviews</Typography>
          <Box sx={{ display: 'flex', mb: '20px' }}>
            <Typography variant="h6" sx={{ fontFamily: 'Open Sans', color: '#666666' }}>Sort by:</Typography>
            <FormControl sx={{ minWidth: 120, marginX: '10px' }}>
              <Select
                value={sort}
                onChange={handleSortChange}
                sx={{ fontFamily: 'Open Sans', height: '35px', color: '#555555' }}
                variant="outlined"
              >
                <MenuItem value="Highest" sx={{ fontFamily: 'Open Sans' }}>Highest Rated</MenuItem>
                <MenuItem value="Lowest" sx={{ fontFamily: 'Open Sans' }}>Lowest Rated</MenuItem>
                <MenuItem value="Newest" sx={{ fontFamily: 'Open Sans' }}>Newest</MenuItem>
                <MenuItem value="Oldest" sx={{ fontFamily: 'Open Sans' }}>Oldest</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <TabContext value={value}>
            <StyledTabList onChange={handleChange} sx={{ '&:hover': { color: '#000' } }}>
              <StyledTab disableRipple={true} label="Yelp" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="1" />
              <StyledTab disableRipple={true} label="Google" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="2" />
              <StyledTab disableRipple={true} label="FourSquare" sx={{ fontFamily: 'Open Sans', fontSize: '20px', '&:hover': { color: '#40a9ff', opacity: 1 } }} value="3" />
            </StyledTabList>
            <TabPanel value="1" >
              <Box>
                <InfiniteScroll dataLength={1}>
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
                </InfiniteScroll>
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
                      <Typography variant='body2' sx={{ fontFamily: 'Open Sans' }}>{dayjs(r.created_at).format('DD MMM YYYY')}</Typography>
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
  color: '#999999',
  backgroundColor: 'none',
  '&.Mui-selected': {
    color: '#444444',
  },
  '&.Mui-focusVisible': {
    backgroundColor: 'rgba(100, 95, 228, 0.32)',
  },
  '&.MuiTab-root:hover': {
    color: '#666666',
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
                  */

