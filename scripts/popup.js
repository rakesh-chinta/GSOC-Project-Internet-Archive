var matched_final = null;
archive_check = "https://archive.org/";
twitter_check = "https://twitter.com/search?q="; 
webarchive_check_1 = "://web.archive.org/web/*/";
webarchive_check_2 = "://web.archive.org";
number_colon_check= ":80";
/**
 * On window load
 */
window.onload = function() 
{
    initEventHandler();
    get_url();
    get_alexa_info();
}
/**
 * @description: save now function
 * @param : no param
 */
function get_url()
{
    sendMessage({message: "geturl"}, function(response){ 
    console.log("Current URL - ", response.url);
    current_url = response.url;
    });
}
/**
 * Event Handler
 */
function initEventHandler() 
{
  document.getElementById('alexa_statistics').onclick = alexa_statistics_function;
  document.getElementById('whois_statistics').onclick = whois_statistics_function;
  document.getElementById('about_support_button').onclick = about_support;
  document.getElementById('twit_share').onclick = shareon_twitter;
  document.getElementById('fb_share').onclick = shareon_facebook;
  document.getElementById('gplus_share').onclick = shareon_googleplus;
  document.getElementById('linkedin_share').onclick = shareon_linkedin;
  document.getElementById('save_now').onclick = save_now_function;
  document.getElementById('recent_capture').onclick = recent_capture_function;
  document.getElementById('first_capture').onclick = first_capture_function;
  document.getElementById('search_tweet').onclick = search_tweet_function;

  document.getElementById('srch_term').onkeyup = search_query_function;  
  document.getElementById('srch_button').onclick = search_button_function;
  
}

function search_button_function(){
   var wb_url_archive_search ="https://web.archive.org/web/*/";
 	 var srch_url = document.getElementById('srch_term').value;
 	chrome.tabs.create({ url: wb_url_archive_search+ srch_url });
}

/**
 * @description: Send message to chrome
 * @param {*} message: {json}, callback: {callback}
 */
function sendMessage(message, callback) 
{
    chrome.runtime.sendMessage(message, function(response) 
    {
        if (callback) 
        {
            callback(response);
        }
    });
}

/**
 * @description: URL finding function
 * @param : text
 */
function findUrls(text)
{
    var source = (text || '').toString();
    var urlArray = [];
    var url;
    var matchArray;
    // Regular expression to find FTP, HTTP(S) and email URLs.
    var regexToken = /(((ftp|https?):\/\/)[\-\w@:%_\+.~#?,&\/\/=]+)|((mailto:)?[_.\w-]+@([\w][\w\-]+\.)+[a-zA-Z]{2,3})/g;
    // Iterate through any URLs in the text.
    while( (matchArray = regexToken.exec( source )) !== null )
    {
        var token = matchArray[0];
        urlArray.push( token );
    }
    return urlArray;
}
/**
 * @description: notify function for archived status
 * @param : msg
 */
function notify(msg)
{
  chrome.notifications.create(
    'wayback-notification',{   
    type: 'basic', 
    iconUrl: '/images/icon@2x.png', 
    title: "Message", 
    message: msg
    },
    function(){} 
  );
}
/**
 * @description: get original URL function
 * @param : no param
 */
function getOriginalURL() {
    var originalURL = null;
    sendMessage({message: "geturl"}, function(response){
    console.log("Current URL - ", response.url);
    current_url = response.url;
    if ((current_url.match(/http/g) || []).length > 1) 
      {
          originalURL = current_url.substr(url.lastIndexOf("http"));
      } 
      else 
        {
            originalURL = current_url;
        }
        return originalURL;
              });
}
 /**
 * @description: save now function
 * @param : no param
 */
function save_now_function(){    
    wb_url = "https://web.archive.org/save/";
    common_primary_function();
 }
/**
 * @description: Recent capture function
 * @param : no param
 */
function recent_capture_function(){
    wb_url = "https://web.archive.org/web/2/";
    common_primary_function();
 }
/**
 * @description: First capture function
 * @param : no param
 */
function first_capture_function(){
  wb_url = "https://web.archive.org/web/0/";
 common_primary_function();
 }
/**
 * @description: Archive Calender function
 * @param : no param
 */
 function archive_calender()
{
  wb_url = "https://web.archive.org/web/*/";
  common_primary_function();
 }
 /**
 * @description: Who_is statistics function
 * @param : no param
 */
 function whois_statistics_function(){
    side_url =  "https://www.whois.com/whois/";
    common_secondary_function();
      
 }
/**
 * @description: alexa statistics function
 * @param : no param
 */
 function alexa_statistics_function(){
     side_url = "http://www.alexa.com/siteinfo/";
     common_secondary_function();

 }
/**
 * @description: get original function 
 * @param : no param
 */
function getOriginalURL() {
    var originalURL = null;
     sendMessage({message: "geturl"}, function(response){
        console.log("Current URL - ", response.url);
    if ((response.url.match(/http/g) || []).length > 1) {
        originalURL = response.url.substr(url.lastIndexOf("http"));
    } 
    else {
        originalURL = response.url;
    }

   return originalURL;
     });
}
/**
 * @description: web search function  
 * @param : no param
 */
function web_search_function(){ 
  var wb_url_archive_search = "https://archive.org/search.php?query=";
 	var url_toSearch = document.getElementById('search_archive').value;
 	chrome.tabs.create({ url: wb_url_archive_search+ url_toSearch });
 }
/**
 * @description: notify version function  
 * @param : no param
 */
function version_function(){
  var vers = "https://chrome.google.com/webstore/detail/wayback-machine/fpnmgdkabkmnadcjpehmlllkndpkmiak";
  chrome.tabs.create({ url: vers });
}
/**
 * @description: view all function  
 * @param : no param
 */
function view_all_function(){
  var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
  url = document.location.href.replace(pattern, "");
  open_url = "https://web.archive.org/web/*/"+encodeURI(url);
  document.location.href = open_url;
}
/**
 * @description: about & support  
 * @param : no param
 */
function about_support()
{  
  var myWindow = window.open("", "", "width=500, height=400");   // Opens a new window
  myWindow.document.write("<p><b>Description about the Extension</b><BR> This chrome extension allows the user to search for the archive history of any URL from within the search box, it also provides the top 5 recommendations. Lets the user save current pages in the archive of the wayback machine, lets the user view the recent and first version of the current URL, lets the user share the current url to 4 social networking websites namely: facebook, twitter, google plus and linkedin. Lets the user view the recent tweets about the current URL. The alexa and whois statistics of the current URL can also be found out.  </p><BR><b>The current verson: 1.7.5</b><Br>Version 1.7.5 includes the updates of: <Br> <p>1.Removed Alexa statistics and Related websites from the bottom of the extension and also removed the scrolling effect, the extension is now fixed in steady <Br> 2.Made the window of the chrome extension much narrower similar to that of the firefox extension<Br>3.Fixed the tweets issues https://web.archive.org/web/*/http://www.iskme.org/about-us <Br>i.e. Should look for tweets to www.iskme.org/about-us https://web.archive.org/web/*/http://www.iskme.org , Should look for tweets to www.iskme.org <Br>4. Fixed the problem with the searchbox <Br> clicking on a result opens https://web.archive.org/web/*/<RESULT>, until a couple of releases earlier, it just populated the search box and didn't open any URL, so then users can click first/last/etc</p>");       
  myWindow.focus();        
}
/**
 * @description: about & support  
 * @param : no param
 */
function support_function()
{         
  var email = "info@archive.org";
  var subject = "";
  var body_message = "";
  var mailto_link = 'mailto:'+email+'?subject='+subject+'&body='+body_message;
  var win = window.open(mailto_link,'emailWindow');
  //win.focus();
  //setTimeout(function () { win.close();}, 3000);    
  win.close();
}
  /**
 * @description:  facebook share function 
 * @param : no param
 */
function shareon_facebook()
{
  social_url = "https://www.facebook.com/sharer/sharer.php?u="
  social_common_function();
 }
  /**
 * @description: twitter share function 
 * @param : no param
 */
function shareon_twitter()
{
social_url = "https://twitter.com/home?status=";
social_common_function();
}
  /**
 * @description:  google+ share function 
 * @param : no param
 */
function shareon_googleplus()
{
  social_url = "https://plus.google.com/share?url="; 
  social_common_function(); 
}        
  /**
 * @description:  linkedin share function 
 * @param : no param
 */
function shareon_linkedin()
 {
   social_url= "https://www.linkedin.com/shareArticle?url="; 
   social_common_function();
 }
  /**
 * @description: get alexa info function 
 * @param : no param
 */
function get_alexa_info(){

  sendMessage({message: "geturl"}, function(response){
    console.log("Response - ", response);
    url_getter(response.url);
    display_alexa_info(response.url);
    display_whois_info(response.url);
  });
  // chrome.runtime.sendMessage({message: "geturl" }, function(response) {
  //   console.log("Response - ", response);
  //   url_getter(response.url);
  //   display_alexa_info(response.url);
  //   display_whois_info(response.url);
  // });
}
  /**
 * @description:  search url function 
 * @param : no param
 */
  function search_function(){
    var wb_url = "https://web.archive.org/web/*/";
    var input = document.getElementById('srch_term').value;
      chrome.tabs.create({ url: wb_url+input });   
  }
  /**
 * @description: URL get function 
 * @param : url
 */
function url_getter(url) {
  var alexa_url = 'http://xml.alexa.com/data?cli=10&dat=n&url=';      
  var host_url = url.replace(/^https{0,1}:\/\//, '').replace(/^www\./, '').replace(/\/.*/, '');      
  var http = new XMLHttpRequest();
  http.open("GET", alexa_url + host_url, true);
  http.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      var html = "<b>"+"<span class='color_code'>"+ host_url +'</span>'+"</b><br/><b>Alexa Rank: </b>";
      var xmldata = http.responseXML.documentElement;          
      if (xmldata.getElementsByTagName("POPULARITY")) 
      {
        html +="<span class='color_code'>"+xmldata.getElementsByTagName("POPULARITY")[0].getAttribute('TEXT')+"</span>";
      } 
      else {
        html += "N/A";
      }          
      if(xmldata.getElementsByTagName("COUNTRY"))
      {
        html += '<br/>'+'<b>Country:</b>' +"<span class='color_code'>"+
                  xmldata.getElementsByTagName('COUNTRY')[0].getAttribute('NAME');
      }
      else{
        html+="N/A";
      }
      document.getElementById("show_alexa_data").innerHTML = html;
      document.getElementById("show_nothing").style.display="block";
    }
  };
  http.send(null);
}
/**
 * @description: search query function 
 * @param : no param
 */
function search_query_function(){
  
    var wb_url = "https://web.archive.org/__wb/search/host?q="; 
    var input = document.getElementById('srch_term');
    var output = document.getElementById('srch-box');
    var datalist = document.getElementById('srch-drop');    
    output.style.display = "none";
    var number_check = input.value.length;
    if(number_check>2){
      console.log("number_check is", number_check);
    var request = new XMLHttpRequest();
    request.onreadystatechange = function(response) {
        if (request.readyState === 4) {
            if (request.status === 200){  
              datalist.innerHTML = "";
              var data=JSON.parse(request.responseText); 
              console.log("Response data - ", data); 
              data.hosts.every(function(element, index){ 
                if (index >= 5) 
                  {
                    return false;
                  }
                    else 
                    {                    
                      var link = element.display_name;
                      var dat = document.createElement('li');                      
                      dat.style.padding  = "3.5px";
                      dat.style.fontSize = "12px";
                      var newElement = document.createElement('a');
                      newElement.style.color="black";
                      newElement.style.fontWeight="bold"
                      newElement.innerHTML = link;
                      newElement.onclick = function(){
                      chrome.tabs.create({ url: "https://web.archive.org/web/*/" + link });
                      
                      }             
                      dat.appendChild(newElement); 
                      datalist.appendChild(dat);
                      return true;                        
                    }
                  });                  
              output.style.display = "block";
            }              
        }
    };    
  request.open('GET', wb_url+input.value, true);
  request.send(null);
    }    
   else{
              return false;
            }
 }
 
 function search_function(){
   var wb_url = "https://web.archive.org/web/*/";
   var input = document.getElementById('srch_term').value;
    chrome.tabs.create({ url: wb_url+input });    
 }

/**
 * @description: alexa,whois  function
 * @param : no param
 */                                   
 function common_secondary_function(){
  sendMessage({message: "geturl"}, function(response){
  var flag = 1;
  var srch_url = document.getElementById('srch_term').value;
    if(srch_url)
      {      
        window.open( side_url +  srch_url  , 'newwindow', 'width=700, height=600');
      }
    if(!srch_url)
    {
      var matched = response.url.match(/\bhttp?:\/\/\S+\.\S+/gi);
      if(matched == null)
        {
          var matched = response.url.match(/\bwww?\.\S+\.\S+/gi);
            if(matched == null)
            {
              matched = response.url.replace(/\bhttps?\:\/\//gi, "");
            }
        }
      if (response.url.indexOf("alexa") >= 0 || response.url.indexOf("whois")>=0)
        {
          var alexa_whois = response.url;
          var alexa_whois_removed = alexa_whois.replace(/\bhttps?\:\/\//gi, "");
          var split_alexa_whois= alexa_whois_removed.split('/');
          var final_a_w_url = split_alexa_whois[2];
          var matched = final_a_w_url;
          window.open( side_url +  matched  , 'newwindow', 'width=700, height=600');
          var flag = 2;
        }                   
      if(response.url.indexOf(archive_check) >= 0)
        {
          window.open( side_url +  response.url  , 'newwindow', 'width=700, height=600');
          var flag =2;
        }    
      var twitter_check = "https://twitter.com/search?q=";
      if(response.url.indexOf(twitter_check) >= 0)
        {
          var matched_twitter_final = response.url.replace("https://twitter.com/search?q=",""); 
          window.open( side_url +  matched_twitter_final  , 'newwindow', 'width=700, height=600');
          var flag =2;
        }                           
 
      if(response.url.indexOf("web.archive.org") >= 0)
        {            
          var final_archive_url_parsed= response.url.split('/*/');
          var final_archive_simple = final_archive_url_parsed[1];
          window.open( side_url +  final_archive_simple  , 'newwindow', 'width=700, height=600');
          var flag = 2;
        }                                          
      if(response.url.indexOf(number_colon_check)>=0)
        {
          var matched_removed_no = response.url.replace(":80","");
          var matched_pre_final_url =  matched_removed_no.split('//');
          var matched_selected_url = matched_pre_final_url[2];
          window.open( side_url +  matched_selected_url  , 'newwindow', 'width=700, height=600');
          var flag = 2;
        } 
      if(flag ==1)
        {  
          window.open( side_url +  matched  , 'newwindow', 'width=700, height=600');
        }
            
    }
 });
}

/**
 * @description: save now,recent version, first version function
 * @param : no param
 */

function common_primary_function()
 {
    sendMessage({message: "geturl"}, function(response){ 
      var flag = 1;
      var srch_url = document.getElementById('srch_term').value;
    

      if(srch_url)
      {  
        console.log("Block-1");        
         chrome.tabs.create({ url: wb_url + srch_url });          
      }
      if(!srch_url)
      {
        var matched = response.url.match(/\bhttp?:\/\/\S+\.\S+/gi);         
        if(matched == null)
        {
          
          var matched = response.url.match(/\bwww?\.\S+\.\S+/gi);
          console.log("Block-2");
         
          if(matched == null)
            {
              matched = response.url.replace(/\bhttps?\:\/\//gi, "");
            }          
        }
        if (response.url.indexOf("alexa") >= 0 || response.url.indexOf("whois")>=0) 
          {
            console.log("Block-3");
              var alexa_whois = response.url;
              var alexa_whois_removed = alexa_whois.replace(/\bhttps?\:\/\//gi, "");
              var split_alexa_whois= alexa_whois_removed.split('/');
              var final_a_w_url = split_alexa_whois[2];
              var matched = final_a_w_url;                
            }
        if(response.url.indexOf(archive_check) >= 0)
          {  
            console.log("Block-4");          
         
                          chrome.tabs.create({ url: wb_url + response.url });
            var flag =2;
          }                                                
        if(response.url.indexOf(twitter_check) >= 0)
          {
            console.log("Block-5");
            var matched_twitter_final = response.url.replace("https://twitter.com/search?q=","");                          
             chrome.tabs.create({ url: wb_url + matched_twitter_final });
            var flag =2;
          }            

             if(response.url.indexOf(webarchive_check_2) >= 0)
          {  
            
            
            var matched_removed_no = response.url.replace(":80","");
            var matched_pre_final_url_ch =  matched_removed_no.split('://');
            var matched_selected_url_ch = matched_pre_final_url_ch[2];
            chrome.tabs.create({ url: wb_url + matched_selected_url_ch });
            var flag =2;
          }                  

        if(response.url.indexOf(webarchive_check_1) >= 0 && response.url.indexOf(number_colon_check) <= -1)
        {   
       
          //var final_archive_url_parsed_new= response.url.split("/*/");
          var final_archive_url_parsed_new = response.url.replace("https://web.archive.org/web/*/", "");
        //  var final_archive_simple_new = final_archive_url_parsed_new[1];
            
            chrome.tabs.create({ url: wb_url + final_archive_url_parsed_new });
          var flag = 2;
        }
        if(response.url.indexOf(number_colon_check)>=0 && response.url.indexOf(webarchive_check_1)>=0) 
          {
            console.log("Block-7");
            var matched_removed_no = response.url.replace(":80","");
            var matched_pre_final_url =  matched_removed_no.split('//');
            var matched_selected_url = matched_pre_final_url[2];
             chrome.tabs.create({ url: wb_url + matched_selected_url });
            var flag = 2;
          } 
        if(flag ==1)
          {
            console.log("Block-9");
            chrome.tabs.create({ url: wb_url + matched });
          }
      }
    });
 }
  /**
 * @description: social share button function 
 * @param : no param
 */
function social_common_function(){
    sendMessage({message: "geturl"}, function(response){    
    var flag = 1;
    var srch_url = document.getElementById('srch_term').value;
    if(srch_url)
      {            
        window.open( social_url    + srch_url , 'newwindow', 'width=800, height=280');      
      }
    if(!srch_url)
      {
        var matched = response.url.match(/\bhttp?:\/\/\S+\.\S+/gi);      
        if(matched == null)
          {
            var matched = response.url.match(/\bwww?\.\S+\.\S+/gi);
              if(matched == null)
              {
                matched = response.url.replace(/\bhttps?\:\/\//gi, "");
              }        
          }
        if (response.url.indexOf("alexa") >= 0 || response.url.indexOf("whois")>=0)
          {
            var alexa_whois = response.url;
            var alexa_whois_removed = alexa_whois.replace(/\bhttps?\:\/\//gi, "");
            var split_alexa_whois= alexa_whois_removed.split('/');
            var final_a_w_url = split_alexa_whois[2];
            var matched = final_a_w_url;        
          }
      var archive_check = "https://archive.org/";            
        if(response.url.indexOf(archive_check) >= 0)
          {                
            window.open( social_url    + response.url , 'newwindow', 'width=800, height=280');
            var flag =2;
          }          
      var twitter_check = "https://twitter.com/search?q=";
        if(response.url.indexOf(twitter_check) >= 0)
          {
            var matched_twitter_final = response.url.replace("https://twitter.com/search?q=",""); 
            window.open( social_url   + matched_twitter_final , 'newwindow', 'width=800, height=280');
            var flag =2;
          }
        if(response.url.indexOf(webarchive_check_1) >= 0)
          {                   
            
               window.open( social_url   + response.url , 'newwindow', 'width=800, height=280');      
          } 
      var number_colon_check= ":80";
      if(response.url.indexOf(number_colon_check)>=0)
        {
          var matched_removed_no = response.url.replace(":80","");
          var matched_pre_final_url =  matched_removed_no.split('//');
          var matched_selected_url = matched_pre_final_url[2];        
          window.open( social_url  + matched_selected_url , 'newwindow', 'width=800, height=280');
          var flag = 2;
        } 
        if(flag ==1)
          {
              window.open( social_url  + matched , 'newwindow', 'width=800, height=280');
          }      
      }
  });
}
/**
 * @description: search tweet function 
 * @param : no param
 */

 function search_tweet_function(){
    var twitter_url = "https://twitter.com/search?q=";   
    sendMessage({message: "geturl"}, function(response){             
    var flag = 1;        
    var srch_url = document.getElementById('srch_term').value;
      if(srch_url)
      {                
        window.open(twitter_url + srch_url ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400','left=100, top = 100');        
      }
      if(!srch_url)
      {              
        if (response.url.indexOf("alexa") >= 0 || response.url.indexOf("whois")>=0)
            {
              var alexa_whois = response.url;
              var alexa_whois_removed = alexa_whois.replace(/\bhttps?\:\/\//gi, "");
              var split_alexa_whois= alexa_whois_removed.split('/');
              var final_a_w_url = split_alexa_whois[2];
              var matched = final_a_w_url;
              var flag = 3;
              window.open(twitter_url + matched ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400', 'left = 100, top=100');                      
            }  
        if(response.url.indexOf(archive_check) >= 0  )
            {
              var matched_archive = "archive.org";                
              window.open(twitter_url + matched_archive ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400','left=100, top = 100');                
              var flag =2;
            }
        if(response.url.indexOf(webarchive_check_1) >= 0)
            {
              var final_archive_url_parsed= response.url.split('/*/');
           
              var final_archive_simple = final_archive_url_parsed[1].replace(/^https?\:\/\//i, "");                  

              window.open(twitter_url + final_archive_simple ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400','left=100, top = 100');                
              var flag = 2;              
            }                        
        if(response.url.indexOf(number_colon_check)>=0)
            {
              var matched_removed_no = response.url.replace(":80","");
              var matched_pre_final_url =  matched_removed_no.split('//');
              var matched_selected_url = matched_pre_final_url[2];
              window.open(twitter_url + matched_selected_url ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400','left=100, top = 100');                
              var flag = 2;
            } 
        if(flag ==1){          
            if (response.url.indexOf("web.archive.org")>=0)
            {
              var matched_final_1 = response.url.match(/\bhttp?:\/\/\w\w\w?\S+\.\S\S\S/gi); 
              var matched_final_2 = matched_final_1[0].replace(/^https?\:\/\//i, "");                  
              window.open(twitter_url + matched_final_2 ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400', 'left = 100, top=100');
            }

        else{
              var final_result =  response.url.replace(/\bhttps?\:\/\//gi, "");
              window.open(twitter_url + final_result ,'targetWindow','toolbar=no','location=no','status=no','menubar=no','scrollbars=no','resizable=no','width=500, height=400', 'left = 100, top=100');
            }
        }                  
      }         
    });
 }
