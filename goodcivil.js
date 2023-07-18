const user = '1929900520084';
const pass = 'GoodCivil1234'; // Enter your password here
const last_module = '1007'; // Enter your last module here (start from 1000)
const domain = "https://learningportal.ocsc.go.th"
function turnpage(){
    let myURL = document.URL;
    var URLarr = myURL.split('=');
    URLarr[1] = (parseInt(URLarr[1]) +1).toString();
    let nextURL = URLarr.join('=');
    window.location.assign(nextURL);
}
function changemodule(){
    let myURL = document.URL; // current URL
    var URLarr = myURL.split('/');
    var URLtail = URLarr[6].split('?');
    let module = parseInt(URLtail[0]); // get current module
    URLtail[0] = (module+1).toString();
    URLarr[6] = URLtail[0];
    window.location.assign(URLarr.join('/')); // go to next module    
}
function beginpage(){
    let myURL = document.URL;
    for(var i=1; i < 1000; i++){
        let tail = '?contentId='.concat(i.toString());
        let nextURL = myURL.concat(tail); // propose first page of the module
        if(find_link_by_href(nextURL)){
            window.location.assign(nextURL); // if found go to that link
            return 1;
        }
    }
}
function find_link_by_href(address){ // find a specific URL
    var links = document.getElementsByTagName("a");

    for(var i = 0; i < links.length; i++) { 
      if( links[i].href === address ) {
        return true; 
        } 
    }
    return false;
}
function login(user, pass){
    document.getElementsByName('userId')[0].setAttribute('value', user);
    document.getElementsByName('password')[0].setAttribute('value', pass);
    document.querySelectorAll('button[type="submit"]')[0].click();
}
function openmodule(last_module){
    window.location.assign(document.URL.concat('/learn/courses/'.concat(last_module)));
}
function pagezone(){
    return document.URL.split('?').length > 1;
}
function modulezone(){
    return document.URL.split('/').length == 7;
}
let headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "en-US,en;q=0.9,th;q=0.8",
    "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Windows\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin"
};
let opensession = async function(user, module, contentId) {
    let session = await fetch(domain+"/learningspaceapi/Users/"+user+"/Sessions", {
        "headers": headers,
        "referrer": domain+"/learningspace/learn/courses/"+module+"?contentId="+contentId,
        "referrerPolicy": "strict-origin-when-cross-origin",
        "body": "{}",
        "method": "POST",
        "mode": "cors",
        "credentials": "include"
    });
    let new_session = await session.json();
    return [new_session.id.toString(), new_session.key]
}
// create work
let sendwork = async function(module, contentId, regisId, contentViews, sessId, key) {
    await fetch(domain+"/learningspaceapi/Users/"+user+"/CourseRegistrations/"+regisId+"/ContentViews/"+contentViews+"?sessionId="+sessId+"&key="+key, {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9,th;q=0.8",
        "authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1bmlxdWVfbmFtZSI6IjE5Mjk5MDA1MjAwODQiLCJyb2xlIjoidXNlciIsIm5iZiI6MTY4OTY2OTE3NywiZXhwIjoxNjg5Njc5OTc3LCJpYXQiOjE2ODk2NjkxNzcsImlzcyI6Im9jc2MiLCJhdWQiOiJwdWJsaWMifQ.TY3p71XKHnVuSg1NqtIgF2JUIuFQfoIwkuLpBN7Pef4",
        "content-type": "application/json;charset=UTF-8",
        "sec-ch-ua": "\"Not.A/Brand\";v=\"8\", \"Chromium\";v=\"114\", \"Google Chrome\";v=\"114\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Windows\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin"
    },
    "referrer": domain+"/learningspace/learn/courses/"+module+"?contentId="+contentId,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"contentSeconds\":60}",
    "method": "PUT",
    "mode": "cors",
    "credentials": "include"
    });
};
let get_regisId = async function(user, module, contentId){
    const registrations = await fetch(domain+"/learningspaceapi/Users/"+user+"/CourseRegistrations/", {
    "headers": headers,
    "referrer": domain+"/learningspace/learn/courses/"+module+"?contentId="+contentId,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
});
    let course_regis = await registrations.json();
    for (let i=0; i< course_regis.length; i++) {
        let obj = course_regis[i];
        if (obj.courseId === parseInt(module)){
        return obj.id.toString();}}
    return 0;
}
let get_content_views = async function(user, module, contentId, regisId){
    const views = await fetch(domain+"/learningspaceapi/Users/"+user+"/CourseRegistrations/"+regisId+"/ContentViews/", {
    "headers": headers,
    "referrer": domain+"/learningspace/learn/courses/"+module+"?contentId="+contentId,
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": null,
    "method": "GET",
    "mode": "cors",
    "credentials": "include"
    });
    let content_views = await views.json();
    for (let i=0; i< content_views.length; i++) {
        let obj = content_views[i];
        if (obj.courseContentId === parseInt(contentId)){
        return obj.id.toString();}}
    return 0;
}
let get_details = async function(){
    const myURL = document.URL.split('/');
    const tail = myURL[6];
    const module = tail.split('?')[0]; // get module number
    const contentId = tail.split('=')[1]; // get contentId
    const regisId = await get_regisId(user, module, contentId); // get regisId
    const contentViews = await get_content_views(user, module, contentId, regisId); // get contentViews
    const [sessId, key] = await opensession(user, module, contentId); // get session ID and key
    return [module, contentId, regisId, contentViews, sessId, key];
}
// get all detail
let send_mini_work = async function(){
    const [module, contentId, regisId, contentViews, sessId, key] = await get_details();
    let random_num = Math.floor(Math.random()*(15-6) +6);
    for (let i=0; i < random_num; i++){
        await sendwork(module, contentId, regisId, contentViews, sessId, key);
    }
    refresh_page();
}
function refresh_page(){
    window.location.assign(document.URL);
}
let run = async function(){
    if(modulezone()){ // in a module page
        if(pagezone()){ // in a page
            if(document.body.innerHTML.search('%')>0){
                if(document.body.innerHTML.search('คุณสะสมเวลาเรียนในหัวข้อนี้ครบตามที่กำหนดแล้ว')>0){
                    turnpage();
                }
                else{
                    await send_mini_work();   
                }
            }
            else{
                if(document.body.innerHTML.search('ส่งแบบประเมิน')<0  || document.body.innerHTML.search('ทำแบบทดสอบ')>0){
                    turnpage(); // just start a module
                }
                else{
                    changemodule(); // completed a module
                }
            }
        }
        else{ // in a module but not in a page
            beginpage();
        }
    }
    else{
        // login page
        if (document.URL === domain+"/learningspace/login"){
            login(user, pass);
        }
        // after logon page
        if (document.URL === domain+"/learningspace"){
            openmodule(last_module);
        }
    }
}
run();
