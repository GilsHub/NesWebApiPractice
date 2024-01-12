//뉴스를 갖고 오는 함수 만들기

    //0-category
    let categoryTab={english:`<button id="business">Business</button>
    <button id="entertainment">Entertainment</button>
    <button id="general">General</button>
    <button id="health">Health</button>
    <button id="science">Science</button>
    <button id="sports">Sports</button>
    <button id="technology">technology</button>`,
   chinese:`
   <button id="business">商务</button>
   <button id="entertainment">娱乐</button>
   <button id="general">日常</button>
   <button id="health">健康</button>
   <button id="science">科学</button>
   <button id="sports">健康</button>
   <button id="technology">科技</button>
   `,
  korean:`
  <button id="business">비지니스</button>
 <button id="entertainment">엔터테인먼트</button>
 <button id="general">제너럴</button>
 <button id="health">건강</button>
 <button id="science">과학</button>
 <button id=sports>스포츠</button>
 <button id="technology">테크</button>`,
 japanese:`
 <button id="business">商務</button>
<button id="entertainment">エンタテインメント</button>
<button id="general">一般</button>
<button id="health">健康</button>
<button id="science">科学</button>
<button id=sports>スポーツ</button>
<button id="technology">技術</button>`}
//1-searchbutton
let searchButtons={
    english:`<div>search</div>`,
    chinese:`<div>搜索</div>`,
    korean:`<div>검색</div>`,
    japanese:`<div>検索</div>`
}
//2-titleName
let titleTab={
    english:`<a href="" onclick="getLatestNews()">Soon's NewsTime</a>`,
    chinese:`<a href="" onclick="getLatestNews()">Soon's 新闻时刻</a>`,
    korean:`<a href="" onclick="getLatestNews()">Soon's 뉴스타임</a>`,
    japanese:`<a href="" onclick="getLatestNews()">Soon's ニュースタイム</a>`
}

let languageButtons={
    english:`<div><button class="us" id="us" onclick="moveToCountry(event)">US</button></div>
    <div><button class="cn" id="cn" onclick="moveToCountry(event)">CN</button></div>
    <div><button class="kr" id="kr" onclick="moveToCountry(event)">KR</button></div>
    <div><button class="jp" id="jp" onclick="moveToCountry(event)">JP</button></div>`,
    chinese:`<div><button class="us" id="us" onclick="moveToCountry(event)">美国</button></div>
    <div><button class="cn" id="cn" onclick="moveToCountry(event)">中国</button></div>
    <div><button class="kr" id="kr" onclick="moveToCountry(event)">韩国</button></div>
    <div><button class="jp" id="jp" onclick="moveToCountry(event)">日本</button></div>`,
    korean:`<div><button class="us" id="us" onclick="moveToCountry(event)">미국</button></div>
    <div><button class="cn" id="cn" onclick="moveToCountry(event)">중국</button></div>
    <div><button class="kr" id="kr" onclick="moveToCountry(event)">한국</button></div>
    <div><button class="jp" id="jp" onclick="moveToCountry(event)">일본</button></div>`,
    japanese:`<div><button class="us" id="us" onclick="moveToCountry(event)">アメリカ</button></div>
    <div><button class="cn" id="cn" onclick="moveToCountry(event)">中国</button></div>
    <div><button class="kr" id="kr" onclick="moveToCountry(event)">韓国</button></div>
    <div><button class="jp" id="jp" onclick="moveToCountry(event)">日本</button></div>`
}



const API_KEY='9cc463bd6bfd4cd8846150c8fb82036c';
let newsList=[];
const menus=document.querySelectorAll(".menus");
menus.forEach((menu)=>menu.addEventListener("click",(event)=>getNewsByCategory(event)));
let url=new URL(`https://newsapi.org/v2/everything?q=bitcoin&apiKey=${API_KEY}`);

let totalResults=0;//불러온 뉴스의 총갯수.
let page=1;//지금 머물러있는 페이지수
let pageSize=10;//한 페이지에 보여줄 뉴스의 갯수.
let groupSize=5;//한번에 보여줄 페이지갯수

let country='';
const countryButton=document.querySelectorAll(".nations button");
countryButton.forEach((countrys)=>countrys.addEventListener("click",(countryNames)=>moveToCountry(countryNames)));



const getNews=async()=>{
    try{
        url.searchParams.set("page",page);
        url.searchParams.set("pageSize",pageSize);
        //URL객체는 주소를 세분해 준다.
        //1.URL를 갖고온다.(GET방식으로 API갖고옴);
        const response=await fetch(url);//URL에 있는 정보를 갖고옴.
        const data=await response.json();//갖고온 정보를 json형식으로 전환 즉 이 response
        
        if(response.status===200){
            if(data.articles.length===0){
                throw new Error("No result for this search");
            }
            newsList=data.articles;//데이터 안에 있는 article를 news배열에 할당해줌.
            console.log('data',newsList);
            console.log('ddd',data);
            totalResults=data.totalResults;
            //여기서 articles도 [키]와[값]으로 이루어진 객체이다,즉 news배열은 객체배열이다.
        
            render();
            paginationRender();
        }
        else{
            throw new Error(data.message);
        }
        //안에 있는 body:ReadableStream을 json형식으로 전환해서 우리가 읽을수 있게해줌.
        newsList=data.articles;//데이터 안에 있는 article를 news배열에 할당해줌.
        console.log('data',newsList);
        console.log('ddd',data);
        totalResults=data.totalResults;
        //여기서 articles도 [키]와[값]으로 이루어진 객체이다,즉 news배열은 객체배열이다.
        render();
        paginationRender();
    }catch(error){
        errorRender(error.message);
    }
    
}

//최신 뉴스를 보여준다.
const getLatestNews=()=>{
    url=new URL(`https://newsapi.org/v2/top-headlines?country=${country}&category=general&apiKey=${API_KEY}`);
    
    getNews();
}

//종류별로 뉴스를 보여준다.
const getNewsByCategory=async (event)=>{
    
    let category=event.target.id;
    console.log('category',category);
    url=new URL(`https://newsapi.org/v2/top-headlines?country=${country}&category=${category}&apiKey=${API_KEY}`);
    
    getNews();
  }
  
  //검색한 뉴스를 보여준다.
  const getNewsByKeyword=async()=>{
    const keyword=document.getElementById("search-box").value;
    url=new URL(`https://newsapi.org/v2/top-headlines?country=${country}&q=${keyword}&apiKey=${API_KEY}`);
    getNews();
  }
  const moveToCountry=(countryNames)=>{
    country=countryNames.target.id;
    console.log('country',country);
    languageRender();
    getLatestNews();
}

const render=()=>{
    
    const newsHTML=newsList.map((news)=>`<div class="row news" >
    <div class="col-lg-4">
        <img class="news-img-size" src="${news.urlToImage}" alt="news-img">
    </div>
    <div class="col-lg-8">
        <h2><a class="newstitles" href="${news.url}">${news.title}</a></h2>
        <p>${news.description}</p>
        <div>${news.source.name}</div>
    </div>
</div>`).join('');

    document.getElementById("news-box").innerHTML=newsHTML;

}
const errorRender=(errorMessage)=>{
       const errorHTML= `
       <div class="error-box">
         <div class="alert alert-danger" role="alert">
          ${errorMessage}
         </div>
         </div>
       `;
       document.getElementById("news-box").innerHTML=errorHTML;
}
const languageRender=()=>{
    let language='';
    language=country;
    let languageButton='';
    let categoryTabs='';
    let searchButton='';
    let siteName=''
    
    if(language==='us'){
        categoryTabs=categoryTab.english;
        searchButton=searchButtons.english;
        siteName=titleTab.english;
        languageButton=languageButtons.english;
    }
    else if(language==='cn'){
        categoryTabs=categoryTab.chinese;
        searchButton=searchButtons.chinese;
        siteName=titleTab.chinese;
        languageButton=languageButtons.chinese;
    }
    else if(language==='kr'){
        categoryTabs=categoryTab.korean;
        searchButton=searchButtons.korean;
        siteName=titleTab.korean;
        languageButton=languageButtons.korean;
    }
    else if(language==='jp'){
        categoryTabs=categoryTab.japanese;
        searchButton=searchButtons.japanese;
        siteName=titleTab.japanese;
        languageButton=languageButtons.japanese;
    }
    document.getElementById("nations").innerHTML=languageButton;
    document.getElementById("menus").innerHTML=categoryTabs;
    document.getElementById("search-button").innerHTML=searchButton;
    document.getElementById("title-text").innerHTML=siteName;
}


//페이지 기능추가.
const paginationRender=()=>{
   let paginationHTML=`<li class="page-item" onclick="moveToPage(${page-1})"><a class="page-link" href="#">Previous</a></li>`
   const pageGroup=Math.ceil(page/groupSize);//지금 선택한 페이지가 몇번째 페이지 그룹에 있는지 표시.
   let lastPage=pageGroup*groupSize;//현재 페이지그룹에서의 마지막 페이지
   let totalPages=Math.ceil(totalResults/pageSize);//총 페이지의 갯수.
   if(lastPage>totalPages){
    lastPage=totalPages;
   }
   const firstPage=lastPage-(groupSize-1)<=0?1:lastPage-(groupSize-1);//현재 페이지그룹에서의 첫번째 페이지
   for(let i=firstPage;i<=lastPage;i++){
       paginationHTML+=`<li class="page-item ${i===page?"active":""}" onclick="moveToPage(${i})"><a class="page-link" href="#">${i}</a></li>`;
   }
   paginationHTML+=`<li class="page-item"  onclick="moveToPage(${page+1})"><a class="page-link" href="#">Next</a></li>`;
   document.querySelector(".pagination").innerHTML=paginationHTML;
}
const moveToPage=(pageNum)=>{
    console.log('pagenum',pageNum);
    page=pageNum;
    getNews();
}

getLatestNews();





  
