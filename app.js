const express = require('express');
const cors=require('cors')
const puppeteer = require('puppeteer');
require('dotenv').config()
const app = express();
app.use(cors())
app.use(express.json())
const port = process.env.PORT||3000;

app.get('/get_video_src', async (req, res) => {
  const websiteLink = req.query.link;
  console.log(websiteLink)
  if (!websiteLink) {
    return res.status(400).json({ error: 'Website link not provided' });
  }

  try {
    req.setTimeout(60000)
    const browser = await puppeteer.launch({headless: true});
    const page = await browser.newPage();

    await page.goto(websiteLink);

    const videoSrc = await page.evaluate(() => {
      const videoElement = document.querySelector('video');
      return videoElement ? videoElement.src : null;
    });

    await browser.close();

    if (videoSrc) {
        console.log("Successfully")
      res.status(200).json({ video_src: videoSrc });
    } else {
        console.log("no video tag")
      res.status(404).json({ error: 'No video tag found on the page' });
    }
  } catch (error) {
    console.log(error.message)
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
