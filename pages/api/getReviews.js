const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');
const language = require('@google-cloud/language')

const dayjs = require('dayjs')
const client = new language.LanguageServiceClient();



async function getYelp(link) {
  let driver = await new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options()
      .headless())
    .build()
  //let driver = await new Builder().forBrowser('chrome').build()
  console.log(link)
  try {
    // Navigate to Url
    await driver.get(link)
    await driver.wait(until.elementLocated(By.css('img.css-xlzvdl')))
    let overall = await driver.findElement(By.css('.i-stars__09f24__foihJ'))
    let exists = await driver.findElement(By.css('.css-1yy09vp')).then(function (state) { return true }, function (err) { return false })

    let numreviews = exists ? await driver.findElement(By.css('.css-1yy09vp')) : await driver.findElement(By.css('.css-1h7ysrc'))

    let results = {
      reviews: [],
      info: {
        'overall': await overall.getAttribute('aria-label'),
        'numreviews': await numreviews.getText()
      }
    }
    let pgnum = 0;
    while (pgnum < 3) {
      if ((await driver.findElements(By.css('a.css-1pxws0l > span.icon--24-chevron-right-v2')))
        .length > 0) {
        let r = await driver.findElements(By.css('section.margin-t4__09f24__G0VVf > div.css-79elbk > div.border-color--default__09f24__NPAKY > ul.list__09f24__ynIEd > li.margin-b5__09f24__pTvws'))
        for (let i = 0; i < r.length; i++) {
          let rtemp = await r[i].findElement(By.css('.css-1sufhje > .raw__09f24__T4Ezm'));
          let stemp = await r[i].findElement(By.css('div.margin-t1__09f24__w96jn > div.arrange__09f24__LDfbs > div.arrange-unit__09f24__rqHTg > span.display--inline__09f24__c6N_k > div.i-stars__09f24__foihJ'))
          let dtemp = await r[i].findElement(By.css('div.margin-b1-5__09f24__NHcQi > div.arrange__09f24__LDfbs > div.arrange-unit__09f24__rqHTg > span.css-1e4fdj9'))
          let itemp = await r[i].findElement(By.css('img.css-xlzvdl'))
          let utemp = await r[i].findElement(By.css('span.css-1iikwpv > a.css-1422juy'))
          results.reviews.push({
            'review': await rtemp.getText(),
            'rating': await stemp.getAttribute("aria-label"),
            'date': await dtemp.getText(),
            'img': await itemp.getAttribute('src'),
            'user': await utemp.getText()
          })
        }
        pgnum++
        let button = await driver.findElement(By.css('a.css-1pxws0l > span.icon--24-chevron-right-v2'))
        await button.click()
        await new Promise(resolve => setTimeout(resolve, 750));
      } else {
        break
      }
    }
    return results
  } finally {
    await driver.quit();
  }
}

async function getFacebook(id) {
  let driver = await new Builder().forBrowser('chrome').build()
  try {
    await driver.get('https://facebook.com/' + id)
    let button = await driver.findElement(By.css('.d2edcug0'))
    console.log('hello', await button.getText())
  } finally {
    await driver.quit()
  }
}
//foursquare key
//fsq37lF3n3HWYpUL0ukhkohgL9TvX+iTqIarshXqsTzc6NQ=

async function getSentiments(text, data) {
  let token = "ya29.c.b0AXv0zTNM4WJ-8jAtmZw1-QWziHcecWNyWPXVNpfVS2S2TYZ60nuBTfl5Gw8xOuXj9AApg1U1BpRxUus7wYiF8WzK_HePTVW4TZBNk4Vrex3Vme_KJ5a8VmaOOG0dshEISZXitkrtq5TmfqsKF9fMiaTuKMJihwvc3e5p6p4NhRxwXpyHUSlwX5nE7evvilNDpfJrYit944dc3Y-kOETBw2gVL46Wk-0"
  let r = []


  for (let t in text) {
    let request = {
      payload: {
        "textSnippet": {
          "content": text[t],
          "mime_type": "text/plain"
        }
      }
    }
    const document = {
      content: text[t],
      type: 'PLAIN_TEXT'
    }
    const [result] = await client.analyzeSentiment({ document });
    const sentiment = result.documentSentiment;

    await r.push(await fetch("https://automl.googleapis.com/v1/projects/648327630208/locations/us-central1/models/TCN8723223988588773376:predict", {
      body: JSON.stringify(request),
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json"
      },
      method: "POST"
    }).then((res) => res.json()).then((res) => { return res.payload }))
    //console.log(JSON.stringify(r))
    r[t].unshift({
      'score': sentiment.score, 'magnitude': sentiment.magnitude,
      'time': 'date' in data[t] ? dayjs(dayjs(data[t].date, "M/DD/YYYY")).format('M/DD/YYYY')
        : 'created_at' in data[t] ? dayjs(dayjs(data[t].created_at, 'YYYY-MM-DD HH:mm:ss.SSS')).format('M/DD/YYYY')
          : dayjs(dayjs.unix(data[t].time)).format('M/DD/YYYY')
    })

  }
  /*
  const sentences = result.sentences;
  sentences.forEach(sentence => {
    console.log(`Sentence: ${sentence.text.content}`);
    console.log(`  Score: ${sentence.sentiment.score}`);
    console.log(`  Magnitude: ${sentence.sentiment.magnitude}`);
  })
  */
  return r
  //console.log('results', r)
}

export default async function handler(req, res) {
  console.log('server received data', JSON.parse(req.body))
  let r = JSON.parse(req.body)

  let googleResults = await fetch('https://maps.googleapis.com/maps/api/place/details/json?&place_id=' + r.id + '&key=AIzaSyD6HHEoQxMf4DdO3jQizp82PsqSZLCvysk')
    .then((res) => { return res.json() })
  let fsqkey = 'fsq37lF3n3HWYpUL0ukhkohgL9TvX+iTqIarshXqsTzc6NQ='
  let fsqQ = await fetch('https://api.foursquare.com/v3/places/nearby?query=' + r.name + '&ll=' + r.coord.lat + '%2C' + r.coord.lng,
    { headers: { Authorization: fsqkey, Accept: 'application/json' } })
    .then((res) => { return res.json() })
  let fsqID = fsqQ.results[0].fsq_id
  let fsqDetails = await fetch('https://api.foursquare.com/v3/places/' + fsqID + '?fields=stats%2Csocial_media%2Crating%2Ctastes',
    { headers: { Authorization: fsqkey, Accept: 'application/json' } })
    .then((res) => { return res.json() })
  let fsqReviews = await fetch('https://api.foursquare.com/v3/places/' + fsqID + '/tips?limit=20', {
    headers: { Authorization: fsqkey, Accept: 'application/json' }
  }).then((res) => { return res.json() })
  fsqDetails.tips = fsqReviews
  //console.log(fsqID, fsqDetails)
  //C:\Users\aaron\OneDrive\Documents\Code\reviewbase\basrview-d63272a48197.json
  //let fbID = fsqDetails.social_media.facebook_id
  //let fbResults = await getFacebook(fbID)


  let yelpKey = 'NWPuMipO3e0zELe4ezzvSoNWOrU2iQSOlBheu3vrWYclXhFGd2YpM5KH0dVZD-FzvyssUvFZKm6gsRRYj8r0QPriySJPghc3pGDteL_8aSLbSROZvxm5gOqUJaTbYXYx'
  let yelpQ = await fetch('https://api.yelp.com/v3/businesses/search?&term=' + r.name + '&location=' + r.address, {
    headers: {
      Authorization: 'Bearer ' + yelpKey
    }
  })
    .then((res) => {
      return res.json()
    })
  let yelpID = yelpQ.businesses[0].id
  let yelpLink = await fetch('https://api.yelp.com/v3/businesses/' + yelpID, {
    headers: {
      Authorization: 'Bearer ' + yelpKey
    }
  }).then((res) => { return res.json() })
  console.log('yelp url', yelpLink.url)
  let yelpResults = await getYelp(yelpLink.url)

  let textData = [
    ...yelpResults.reviews.map(function (A) { return A.review.replace(/\r?\n|\r/g, " ") }),
    ...googleResults.result.reviews.map(function (A) { return A.text.replace(/\r?\n|\r/g, " ") }),
    ...fsqReviews.map(function (A) { return A.text.replace(/\r?\n|\r/g, " ") })
  ]
  let data = [...yelpResults.reviews, ...googleResults.result.reviews, ...fsqReviews]

  let classifications = await getSentiments(textData, data)
  //console.log(data)

  res.status(200).json({ yelpResults: yelpResults, googleResults: googleResults, fsqResults: fsqDetails, classifications: classifications })
}
/*
const ml = new MonkeyLearn('7d1ae28483506d069e793c1268546a172206b45a')
let classify_id = 'cl_2GjdFLSK'
let sentiment_id = 'cl_pi3C7JiL'
let classifications = await ml.classifiers.classify(classify_id, textData).then(res => {
return res.body.map(function (A) { return A.classifications })
})
let sentiments = await ml.classifiers.classify(sentiment_id, textData).then(res => {
return res.body.map(function (A) { return A.classifications })
})
for (let i = 0; i < classifications.length; i++) {
classifications[i].unshift({
sent: sentiments[i][0].tag_name,
sent_confidence: sentiments[i][0].confidence,
time: 'date' in data[i] ? dayjs(dayjs(data[i].date, "M/DD/YYYY")).format('M/DD/YYYY') : 'created_at' in data[i] ? dayjs(dayjs(data[i].created_at, 'YYYY-MM-DD HH:mm:ss.SSS')).format('M/DD/YYYY') : dayjs(dayjs.unix(data[i].time)).format('M/DD/YYYY')
})
}
console.log(classifications, { 'maxArrayLength': null })

console.log(dayjs(dayjs(data[i].date, "M/DD/YYYY")).format('M/DD/YYYY'))
console.log(dayjs(dayjs(data[i].created_at, 'YYYY-MM-DD HH:mm:ss.SSS')).format('M/DD/YYYY'))
console.log(dayjs(dayjs.unix(data[i].time)).format('M/DD/YYYY'))
*/
/*
async function getYelpReviews(link) {
    console.log(link)
    let driver = await new Builder().forBrowser('chrome').setChromeOptions(new chrome.Options().headless()).build()
    try {
        // Navigate to Url
        await driver.get(link);
        // div.i-stars__373c0___sZu0
        await driver.wait(until.elementLocated(By.css('span.raw__09f24__T4Ezm')))
        let rtemp = await driver.findElements(By.css('p.comment__09f24__gu0rG > span.raw__09f24__T4Ezm'));
        let stemp = await driver.findElements(By.css('div.margin-t1__09f24__w96jn > div.arrange__09f24__LDfbs > div.arrange-unit__09f24__rqHTg > span.display--inline__09f24__c6N_k > div.i-stars__09f24__foihJ'))
        let dtemp = await driver.findElements(By.css('div.margin-b1-5__09f24__NHcQi > div.arrange__09f24__LDfbs > div.arrange-unit__09f24__rqHTg > span.css-1e4fdj9'))
        let results = []
        for (let i = 0; i < rtemp.length; i++) {
            results.push({
                'review': await rtemp[i].getText(),
                'rating': await stemp[i].getAttribute("aria-label"),
                'date': await dtemp[i].getText()
            })
        }
        return results
    }
    finally {
        await driver.quit();
    }
}
*/

/*
await driver.get('https://www.yelp.com');

await driver.findElement(By.id('find_desc')).sendKeys(query);
await driver.findElement(By.id("dropperText_Mast")).clear()
await driver.findElement(By.id("dropperText_Mast")).sendKeys(loc, Key.ENTER)
let results = []
await driver.wait(until.elementLocated(By.css('.css-1422juy')))
let links = await driver.findElements(By.css('.container__09f24__mpR8_'))

for (let i = 0; i < links.length; i++) {
    await driver.wait(until.elementLocated(By.css('.css-1422juy')))
    let links = await driver.findElements(By.css('.container__09f24__mpR8_'))
    links[i].click()
    await driver.wait(until.elementLocated(By.css('.css-1x9iesk')))
    let name = await driver.findElement(By.css('.css-1x9iesk'))
    let a = await driver.findElement(By.css('p.css-1ccncw'))
    let address = await a.getText()
    var c = await fetch("https://api.opencagedata.com/geocode/v1/json?key=a6084a15eb6f4502812f8e5f1dcac9ff&q=" + address.split(' ').join('+') + "&pretty=1")
        .then(response => response.json())
        .catch((error) => { console.log(error) })
        .then((result) => { return result })

    let link = await driver.getCurrentUrl()
    let rating = await driver.findElement(By.css('.i-stars__09f24__foihJ')).getAttribute("aria-label")
    let image = await driver.findElement(By.css('.photo-header-media-image__09f24__A1WR_')).getAttribute("src")
    results.push({
        name: await name.getText(),
        address: address,
        link: link,
        rating: rating,
        image: image,
        lat: c.results[0].geometry.lat,
        lng: c.results[0].geometry.lng
    })
    await driver.navigate().back()
}
return results
*/