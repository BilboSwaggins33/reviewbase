// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');


export default async function handler(req, res) {
  console.log('server received data', JSON.parse(req.body).q, JSON.parse(req.body).l)

  let results = await fetch('https://maps.googleapis.com/maps/api/place/textsearch/json?fields=formatted_address&input=' + JSON.parse(req.body).q + ' ' + JSON.parse(req.body).l + '&inputtype=textquery&key=AIzaSyD6HHEoQxMf4DdO3jQizp82PsqSZLCvysk').then((res) => { return res.json() })
  //console.log(results)
  res.status(200).json({ results: results })
}
/*
async function getResults(query, loc) {
  console.log(query, loc)

  let driver = await new Builder().forBrowser('chrome').build()
  //let driver = await new Builder().forBrowser('chrome').build()


  try {
    // Navigate to Url
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
    /*
    let ntemp = await driver.findElements(By.css('.css-1uq0cfn > .css-1422juy'));
    let atemp = await driver.findElements(By.css('.css-1gfe39a > span.css-1e4fdj9'))
    let itemp = await driver.findElements(By.css('.css-xlzvdl'))
    for (let i = 0; i < ntemp.length; i++) {
      let address = await atemp[i].getText()

      results.push({
        "Name": await ntemp[i].getText(),
        "Address": address,
        "Link": await ntemp[i].getAttribute('href'),
        "Image": await itemp[i].getAttribute('src')
      })

    }
    
return results
  }
  finally {
  await driver.quit();
}
}
*/

