const { Builder, By, Key, until } = require('selenium-webdriver');
const chrome = require('selenium-webdriver/chrome');

async function getGoogleReviews(query, address) {
    let driver = await new Builder().forBrowser('chrome').build()
    //var actions = driver.actions({ async: true })
    try {
        await driver.get('http://www.google.com/maps');
        await driver.findElement(By.name('q')).sendKeys(query + ' ' + address, Key.RETURN);

        driver.wait(until.elementLocated(By.css("span.ODSEW-ShBeI-text")), 5000).then(async el => {
            console.log(await el.getText())
        })
        //await driver.findElement(By.className('gm2-button-alt'))
        try {
            var results = []
            for (let i = 0; i < 5; i++) {
                driver.wait(until.elementLocated(By.css("span.ODSEW-ShBeI-text")), 5000).then(async el => {
                    await el.getText()
                })

                while (true) {
                    try {
                        var reviews = await driver.findElements(By.css('span.ODSEW-ShBeI-text'))
                        var ratings = await driver.findElements(By.css('span.ODSEW-ShBeI-H1e3jb'))
                    } catch (err) {
                        console.log(err)
                    }
                    if (!reviews.length == 0 && !ratings.length == 0) {
                        // array empty or does not exist
                        //success = true
                        break
                    }
                }

                for (let i = 0; i < reviews.length; i++) {
                    results.push({
                        review: await reviews[i].getText(),
                        rating: await ratings[i].getAttribute('aria-label')
                    })
                    //console.log(results[i])
                }

                driver.executeScript('window.scrollBy(0,250)')
            }
        } catch (err) {
            console.log(err)
        }
        //console.log(results)
        return results
    }
    finally {
        await driver.quit();
    }

}

export default async function handler(req, res) {
    console.log('google server received data', JSON.parse(req.body).id)
    let googleResults = await fetch('https://maps.googleapis.com/maps/api/place/details/json?&place_id=' + JSON.parse(req.body).id + '&key=AIzaSyD6HHEoQxMf4DdO3jQizp82PsqSZLCvysk').then((res) => { return res.json() })
    console.log(googleResults)
    res.status(200).json({ googleResults: googleResults })
}