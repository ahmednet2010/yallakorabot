import puppeteer from 'puppeteer';
import fs from "fs"
const main = async (data:string) => {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(`https://www.yallakora.com/match-center/%D9%85%D8%B1%D9%83%D8%B2-%D8%A7%D9%84%D9%85%D8%A8%D8%A7%D8%B1%D9%8A%D8%A7%D8%AA?date=${data}#`,{ waitUntil: 'networkidle2' });
    const matches = await page.evaluate(async() => {
            const matchesList = [...document.querySelectorAll(".matchesList")];
            const matchelist = await matchesList.map((e) => {
                const title = e.querySelector("h2").textContent.trim();
                const matchesdata = [...e.querySelectorAll("div.liItem")]
                const allData = matchesdata.map((b) =>{
                    const type = b.querySelector("div.date").textContent.trim()
                    const status = b.querySelector(".matchStatus").textContent.trim()
                    const teamA = b.querySelector(".teamA > p").textContent.trim()
                    const teamB =  b.querySelector(".teamB > p").textContent.trim()
                    const score = [...b.querySelectorAll(".MResult > .score")];
                    const scoreA = score[0].textContent.trim();
                    const scoreB = score[1].textContent.trim();
                    const time =  b.querySelector(".MResult > .time").textContent.trim()
                    return {title:`* ${title}\n`,type,status,time:`${time}\n`,teamA,scoreA,scoreB,teamB};
                });
                return  [...allData]
            })
            return {matchelist};
        })
    //save in json file
    //await fs.writeFileSync(`matches-${data.replace(/\//g,"-")}.json`, JSON.stringify(matches, null, 2));
    // Close the browser  
    await browser.close();
    return matches;
}
export default main