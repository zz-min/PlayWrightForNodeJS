const express = require('express');
const router = express.Router();

const playwright = require('playwright');
const brand = "삼성";

// /samsung
router.get('/', async function(req, res) {
  // 1.Browser 객체 생성 (chromium, firefox, webkit )
  let browser = await playwright.firefox.launch(); // headlessMode(O) - Default
  // let browser = await playwright.webkit.launch({headless: false}); // headlessMode(X)

  // 2. Page 객체 생성
  let page = await browser.newPage();

  // 3. Page 객체 내 기능들 
  // (1) 페이지 이동 
  await page.goto("https://search.shopping.naver.com/search/category/100000580"); // 가전>TV
  // await page.goto("https://search.shopping.naver.com/search/category/100000582"); // 가전>냉장고
  // await page.goto("https://search.shopping.naver.com/search/category/100000584"); // 가전>세탁기/건조기
            
  // 브랜드 지정 
  let element = await page.waitForSelector("//span[text()='"+brand+"']"); // XPath로 경로 지정 
  await element.click();

  // (2) 페이지 타이틀 가져오기
  console.log(`* title : ${await page.title()}`);
  
  // (3) 페이지 스크린샷 이미지 저장하기 
  await page.screenshot({ path: 'samsung.png' });
  
  // (5) 페이지별 리스트
  await page.evaluate(() => window.scrollBy(0, 2000));//스크롤 2000px 아래로 이동
  await sleep(2000);

  const products = await page.$$(".product_item__MDtDF");
  console.log("products count : " + products.length);

  console.log(" ============================== " );
  let resultData = new Object() ;
  resultData.brand = brand;
  // resultData.list

  let i=0;
  let listData = new Array() ;
  for (const product of products) {
    const text = await product.innerText();
    const lines = text.split("\n");
    if (lines.length > 3) {
      let obj = new Object() ;
      let price, name;
      if(lines[0].length >1){
        name = lines[0];
        price = lines[1].split("원",1);
      }else{
        name = lines[1];
        price = lines[2].split("원",1);
      }

      obj.index=i;
      obj.name=name;
      obj.price=price+'원';
      listData.push(obj);
      i++;
    } else {
      console.log("ERROR : 데이터를 가져오는데 실패했습니다. " );
    }
  }
  resultData.list=listData;
  //var jsonData = JSON.stringify(resultData) ;
  
  browser.close();
  res.send(resultData); //json 결과 반환
});

// /samsung/about
router.get('/about', function(req, res) {
    res.send('삼성 about');
});

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

module.exports = router;
