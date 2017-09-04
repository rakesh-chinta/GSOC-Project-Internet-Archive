/*
 * LICENSE: AGPL-3
 * Copyright 2016, Internet Archive
 */

var count_to_link = 1;

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      //alert(request.newIconPath);
      // read `newIconPath` from request and read `tab.id` from sender
      chrome.browserAction.setIcon({
          path: {"32":"/images/logo_high.png"},
          tabId: sender.tab.id
      });

      chrome.browserAction.setBadgeText( { text: String(count_to_link) } );
      chrome.browserAction.setBadgeBackgroundColor({color: [156,39,176,1.0]});
      count_to_link += 1;
  });

function resetDefaultSuggestion() {
    chrome.omnibox.setDefaultSuggestion({
    description: 'Search the Internet Archive for %s'
    });
  }

resetDefaultSuggestion();



function navigate_wayback(url) {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.update(tabs[0].id, {url: url});
    });
  }

chrome.omnibox.onInputEntered.addListener(function(text) {
    navigate_wayback("https://archive.org/search.php?query=" + text);
  });





chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
      
      // read `newIconPath` from request and read `tab.id` from sender
      //alert("good");
      chrome.browserAction.setIcon({
          path: request.newIconPath,
          tabId: sender.tab.id
      });
  });


(function() {
  var enforceBannerInterval;
  var archiveLinkWasClicked = false;
  var bannerWasShown = false;
  var bannerWasClosed = false;

  /**
   * Brute force inline css style reset
   */
  function resetStyesInline(el) {
    el.style.margin = 0;
    el.style.padding = 0;
    el.style.border = 0;
    el.style.fontSize = "100%";
    el.style.font = "inherit";
    el.style.fontFamily = "sans-serif";
    el.style.verticalAlign = "baseline";
    el.style.lineHeight = "1";
    el.style.boxSizing = "content-box";
    el.style.overflow = "unset";
    el.style.fontWeight = "inherit";
    el.style.height = "auto";
    el.style.position = "relative";
    el.style.width = "auto";
    el.style.display = "inline";
    el.style.backgroundColor = "transparent";
    el.style.color = "#333";
    el.style.textAlign = "left";
  }

  /**
   * Communicates with background.js
   * @param action {string}
   * @param complete {function}
   */

  /**
   * @param {string} type
   * @param {function} handler(el)
   * @param remaining args are children
   * @returns {object} DOM element
   */
  function createEl(type, handler) {
    var el = document.createElement(type);
    resetStyesInline(el);
    if (handler !== undefined) {
      handler(el);
    }
    // Append *args to created el
    for (var i = 2; i < arguments.length; i++) {
      el.appendChild(arguments[i]);
    }
    return el;
  }

  function createBanner(wayback_url) {
    if (document.getElementById("no-more-404s-message") !== null) {
      return;
    }
    document.body.appendChild(
      createEl("div",
        function(el) {
          el.id = "no-more-404s-message";
          el.style.background = "rgba(0,0,0,.6)";
          el.style.position = "fixed";
          el.style.top = "0";
          el.style.right = "0";
          el.style.bottom = "0";
          el.style.left = "0";
          el.style.zIndex = "999999999";
          el.style.display = "flex";
          el.style.alignItems = "center";
          el.style.justifyContent ="center";
          },
          createEl("div",
            function(el) {
              el.id = "no-more-404s-message-inner";
              el.style.flex = "0 0 420px";
              el.style.position = "relative";
              el.style.top = "0";
              el.style.padding = "2px";
              el.style.backgroundColor = "#fff";
              el.style.borderRadius = "5px";
              el.style.overflow = "hidden";
              el.style.display = "flex";
              el.style.flexDirection = "column";
              el.style.alignItems = "stretch";
              el.style.justifyContent ="center";
              el.style.boxShadow = "0 4px 20px rgba(0,0,0,.5)";
            },
            createEl("div",
              function(el) {
                el.id = "no-more-404s-header";
                el.style.alignItems = "center";
                el.style.backgroundColor = "#0996f8";
                el.style.borderBottom = "1px solid #0675d3";
                el.style.borderRadius = "4px 4px 0 0";
                el.style.color = "#fff";
                el.style.display = "flex";
                el.style.fontSize = "24px";
                el.style.fontWeight = "700";
                el.style.height = "54px";
                el.style.justifyContent = "center";
                el.appendChild(document.createTextNode("Page not available?"));
              },
              createEl("button",
                function(el) {
                  el.style.position = "absolute";
                  el.style.display = "flex";
                  el.style.alignItems = "center";
                  el.style.justifyContent = "center";
                  el.style.transition = "background-color 150ms";
                  el.style.top = "12px";
                  el.style.right = "16px";
                  el.style.width = "22px";
                  el.style.height = "22px";
                  el.style.borderRadius = "3px";
                  el.style.boxSizing = "border-box";
                  el.style.padding = "0";
                  el.style.border = "none";
                  el.onclick = function() {
                    clearInterval(enforceBannerInterval);
                    document.getElementById("no-more-404s-message").style.display = "none";
                    bannerWasClosed = true;
                  };
                  el.onmouseenter = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.1)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
                  };
                  el.onmousedown = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.2)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.15) inset";
                  };
                  el.onmouseup = function() {
                    el.style.backgroundColor = "rgba(0,0,0,.1)";
                    el.style.boxShadow = "0 1px 0 0 rgba(0,0,0,.1) inset";
                  };
                  el.onmouseleave = function() {
                    el.style.backgroundColor = "transparent";
                    el.style.boxShadow = "";
                  };
                },
                createEl("img",
                  function(el) {
                    el.src = chrome.extension.getURL("images/close.svg");
                    el.alt = "close";
                    el.style.height = "16px";
                    el.style.transition = "background-color 100ms";
                    el.style.width = "16px";
                    el.style.margin = "0 auto";
                  }
                )
              )
            ),
            createEl("p", function(el) {
              el.appendChild(document.createTextNode("View a saved version courtesy of the"));
              el.style.fontSize = "16px";
              el.style.margin = "20px 0 4px 0";
              el.style.textAlign = "center";
            }),
            createEl("img", function(el) {
              el.id = "no-more-404s-image";
              el.src = chrome.extension.getURL("images/logo.gif");
              el.style.height = "auto";
              el.style.position = "relative";
              el.style.width = "100%";
              el.style.boxSizing = "border-box";
              el.style.padding = "10px 22px";
            }),
            createEl("a", function(el) {
              el.id = "no-more-404s-message-link";
              el.href = wayback_url;
              el.style.alignItems = "center";
              el.style.backgroundColor = "#0996f8";
              el.style.border = "1px solid #0675d3";
              el.style.borderRadius = "3px";
              el.style.color = "#fff";
              el.style.display = "flex";
              el.style.fontSize = "19px";
              el.style.height = "52px";
              el.style.justifyContent = "center";
              el.style.margin = "20px";
              el.style.textDecoration = "none";
              el.appendChild(document.createTextNode("Click here to see archived version"));
              el.onmouseenter = function() {
                el.style.backgroundColor = "#0675d3";
                el.style.border = "1px solid #0568ba";
              };
              el.onmousedown = function() {
                el.style.backgroundColor = "#0568ba";
                el.style.border = "1px solid #0568ba";
              };
              el.onmouseup = function() {
                el.style.backgroundColor = "#0675d3";
                el.style.border = "1px solid #0568ba";
              };
              el.onmouseleave = function() {
                el.style.backgroundColor = "#0996f8";
                el.style.border = "1px solid #0675d3";
              };
              el.onclick = function(e) {
                archiveLinkWasClicked = true;

                // Work-around for myspace which hijacks the link
                if (window.location.hostname.indexOf("myspace.com") >= 0) {
                  e.preventDefault();
                  return false;
                } else {
                }
              };
            })
          )
        )
      );
    // Focus the link for accessibility
    document.getElementById("no-more-404s-message-link").focus();

    // Transition element in from top of page
    setTimeout(function() {
      document.getElementById("no-more-404s-message").style.transform = "translate(0, 0%)";
    }, 100);

    bannerWasShown = true;
  }

  function checkIt(wayback_url) {
    // Some pages use javascript to update the dom so poll to ensure
    // the banner gets recreated if it is deleted.
    enforceBannerInterval = setInterval(function() {
      createBanner(wayback_url);
    }, 500);

  }



})();
















var excluded_urls = [
  
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];
var WB_API_URL = "https://archive.org/wayback/available";


function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

function rewriteUserAgentHeader(e) {
  for (var header of e.requestHeaders) {
    if (header.name.toLowerCase() === "user-agent") {
      header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION + "Status-code/" + Finalstatuscode;
      console.log(header);
    }
  }
  return {requestHeaders: e.requestHeaders};
}

/*
 * Add rewriteUserAgentHeader as a listener to onBeforeSendHeaders
 * Make it "blocking" so we can modify the headers.
*/
chrome.webRequest.onBeforeSendHeaders.addListener(
    rewriteUserAgentHeader,
    {urls: [WB_API_URL]},
    ["blocking", "requestHeaders"]
);

/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
    function tabIsReady(isIncognito) {
        var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504, 509, 520, 521, 523, 524, 525, 526];                        

        if (isIncognito === false &&
            details.frameId === 0 &&
            httpFailCodes.indexOf(details.statusCode) >= 0 &&
            isValidUrl(details.url)) {
             
              Finalstatuscode = details.statusCode;

        wmAvailabilityCheck(details.url, function(wayback_url, url) {
         

            chrome.tabs.executeScript(details.tabId, {
                file: "scripts/client.js"
                // file: "public/scripts/client..min.js"
            }, function() {
                chrome.tabs.sendMessage(details.tabId, {
                    type: "SHOW_BANNER",
                    wayback_url: wayback_url
                });
            });
        }, function() {

        });
        }
    }
    if(details.tabId >0 ){
        chrome.tabs.get(details.tabId, function(tab) {
        tabIsReady(tab.incognito);
        });  
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
    function tabIsReady(isIncognito) {
        if(details.error == 'net::ERR_NAME_NOT_RESOLVED' || details.error == 'net::ERR_NAME_RESOLUTION_FAILED'
        || details.error == 'net::ERR_CONNECTION_TIMED_OUT'  || details.error == 'net::ERR_NAME_NOT_RESOLVED' ){
            wmAvailabilityCheck(
                details.url, 
                function(wayback_url, url) {
                    chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?url="+wayback_url});
                }, 
                function() {

                }
            );
        }
    }
    if(details.tabId >0 ){
        chrome.tabs.get(details.tabId, function(tab) {
        tabIsReady(tab.incognito);
        });  
    }
}, {urls: ["<all_urls>"], types: ["main_frame"]});




















chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message.message=='openurl'){
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
            var tab = tabs[0];
            var page_url = tab.url;
            wayback_url = message.wayback_url;
            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
            url = page_url.replace(pattern, "");
            open_url = wayback_url+encodeURI(url);
            
            if(message.method!='save'){
                status = wmAvailabilityCheck(page_url,
                                    function(){ chrome.tabs.create({ url:  open_url});
                                        sendResponse({status:true});
                                    },
                                    function(){
                                        //alert("URL not found in wayback archives!");
                                        sendResponse({status:false});
                                    });
            }
            else{
                chrome.tabs.create({ url:  open_url});
            }
        
        });
    } else if(message.message=='geturl') {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var tab = tabs[0];
            var page_url = tab.url;
            if(isValidSnapshotUrl(page_url)){
                sendResponse({url: page_url});
            }
        });
    }
    return true; 
});

// This event listener is fired whenever a tab is updated
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        if (changeInfo.status == "complete") {
            chrome.tabs.get(tabId, function(tab) {
                var page_url = tab.url;
                if(isValidUrl(page_url)){
                    chrome.browserAction.setBadgeBackgroundColor({tabId: tabId, color:[0,0, 255, 1]});
                    chrome.browserAction.setBadgeText({tabId: tabId, text:"Checking..."});            // checking the archives
                    wmAvailabilityCheck(page_url,function(){
                        chrome.browserAction.setBadgeBackgroundColor({tabId: tab.id, color:[0, 255, 0, 1]});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"YES"});  // webpage is archived
                    },function(){
                        chrome.browserAction.setBadgeBackgroundColor({tabId: tab.id, color:[255, 0, 0, 1]});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"NO"});                 // webpage not archived
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var tab = tabs[0];
                            var page_url = tab.url;
                            var wb_url = "https://web.archive.org/save/";
                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
                            url = page_url.replace(pattern, "");
                            open_url = wb_url+encodeURI(url);
                            var xhr=new XMLHttpRequest();
                            xhr.open('GET',open_url,true);
                            xhr.onload=function(){
                                chrome.browserAction.setBadgeBackgroundColor({tabId: tab.id, color:[0, 255, 255, 1]});                 
                                chrome.browserAction.setBadgeText({tabId: tab.id, text:"SAVED"});
                            };
                            xhr.send();
                        });
                    });
                }
            });
        }
    });
 });




 
/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
    var xhr = new XMLHttpRequest();
    var requestUrl = WB_API_URL;
    var requestParams = "url=" + encodeURI(url);
    xhr.open("POST", requestUrl, true);
    xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhr.setRequestHeader("Wayback-Api-Version", 2);
    xhr.onload = function() {
        var response = JSON.parse(xhr.responseText);
        var wayback_url = getWaybackUrlFromResponse(response);
        if (wayback_url !== null) {
        onsuccess(wayback_url, url);
        } else if (onfail) {
        onfail();
        }
    };
    xhr.send(requestParams);
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
    if (response.results &&
        response.results[0] &&
        response.results[0].archived_snapshots &&
        response.results[0].archived_snapshots.closest &&
        response.results[0].archived_snapshots.closest.available &&
        response.results[0].archived_snapshots.closest.available === true &&
        response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
        isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) {
        return makeHttps(response.results[0].archived_snapshots.closest.url);
    } else {
        return null;
    }
}

/**
 * @description
 * @param {*} url
 * @return {} 
 */
function makeHttps(url) {
    return url.replace(/^http:/, "https:");
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
    return ((typeof url) === "string" && (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}

/**
 * @description 
 * @param  e {}
 * @return {}
 */
function rewriteUserAgentHeader(e) {
    for (var header of e.requestHeaders) {
        if (header.name.toLowerCase() === "user-agent") {
        header.value = header.value  + " Wayback_Machine_Chrome/" + VERSION
        }
    }
    return {requestHeaders: e.requestHeaders};
}

/**
 * @description Makes sure url is valid
 * @param  url {string}
 * @return {bool}
 */
function isValidUrl(url) {
    for (var i = 0; i < excluded_urls.length; i++) {
        if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
        return false;
        }
    }
    return true;
}


// Integration with the Wayback Machine search (showing suggestions)
 // Type in the omnibox "wm [TAB or space] [search query]"
 
 var currReq = null;
 
 chrome.omnibox.onInputChanged.addListener(function(txt, sugg) {
   if (currReq != null) {
     currReq.onreadystatechange = null;
     currReq.abort();
     currReq = null;
   }
   updateDefSugg(txt);
 
   if (txt.length > 0) {
     var currReq = getSugg(txt, function(data) {
       if (data['hosts'].length >= 5) {
         var hosts = [];
         for (var i = 0; i < 5; i++) {
           hosts.push({
             content: data['hosts'][i]['display_name'],
             description: data['hosts'][i]['display_name']
           });
         }
         sugg(hosts);
       }
     });
   }
 });
 
 function getSugg(key, callback) {
   var req = new XMLHttpRequest();
   req.onreadystatechange = function() {
     if (this.readyState == 4 && this.status == 200) {
       callback(JSON.parse(this.responseText));
     }
   };
   req.open('GET', 'https://web-beta.archive.org/__wb/search/host?q=' + key, true);
   req.send();
 };
 
 function resetDefSugg() {
   chrome.omnibox.setDefaultSuggestion({ description: ' ' });
 };
 
 function updateDefSugg(txt) {
   chrome.omnibox.setDefaultSuggestion({ description: 'Search: %s' });
 };
 
 chrome.omnibox.onInputStarted.addListener(function() { updateDefSugg(''); });
 
 chrome.omnibox.onInputCancelled.addListener(function() { resetDefSugg(); });
 
 chrome.omnibox.onInputEntered.addListener(function(txt) {
   chrome.tabs.update(null, { url: 'https://web-beta.archive.org/web/*/' + txt });
 });







 chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      var tab = tabs[0];
      var page_url = tab.url;
      wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      url = page_url.replace(pattern, "");
      open_url = wayback_url+encodeURI(url);
      if(message.method!='save'){
        wmAvailabilityCheck(page_url,function(){
          chrome.tabs.create({ url:  open_url});
        },function(){
          alert("URL not found in wayback archives!");
        })  
      }else{
        chrome.tabs.create({ url:  open_url});
      }
    });
  }
});

/*
 * License: AGPL-3
 * Copyright 2016, Internet Archive
 */
var VERSION = "1.8.1";
Finalstatuscode = "";
var excluded_urls = [
  
  "www.google.co",
  "web.archive.org/web/",
  "localhost",
  "0.0.0.0",
  "127.0.0.1"
];

function isValidUrl(url) {
  for (var i = 0; i < excluded_urls.length; i++) {
    if (url.startsWith("http://" + excluded_urls[i]) || url.startsWith("https://" + excluded_urls[i])) {
      return false;
    }
  }
  return true;
}

/**
 * Header callback
 */
chrome.webRequest.onCompleted.addListener(function(details) {
  function tabIsReady(isIncognito) {
    var httpFailCodes = [404, 408, 410, 451, 500, 502, 503, 504,
                         509, 520, 521, 523, 524, 525, 526];
    if (isIncognito === false &&
        details.frameId === 0 &&
        httpFailCodes.indexOf(details.statusCode) >= 0 &&
        isValidUrl(details.url)) {
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.executeScript(details.tabId, {
          file: "scripts/client.js"
        }, function() {
          chrome.tabs.sendMessage(details.tabId, {
            type: "SHOW_BANNER",
            wayback_url: wayback_url
          });
        });
      }, function() {
        
      });
    }
  }
  chrome.tabs.get(details.tabId, function(tab) {
    tabIsReady(tab.incognito);
  });
}, {urls: ["<all_urls>"], types: ["main_frame"]});



/**
 * Checks Wayback Machine API for url snapshot
 */
function wmAvailabilityCheck(url, onsuccess, onfail) {
  var xhr = new XMLHttpRequest();
  var requestUrl = "https://archive.org/wayback/available";
  var requestParams = "url=" + encodeURI(url);
  xhr.open("POST", requestUrl, true);
  xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhr.setRequestHeader("User-Agent", navigator.userAgent + " Wayback_Machine_Firefox/" + VERSION);
  xhr.setRequestHeader("Wayback-Api-Version", 2);
  xhr.onload = function() {
    var response = JSON.parse(xhr.responseText);
    var wayback_url = getWaybackUrlFromResponse(response);
    if (wayback_url !== null) {
      onsuccess(wayback_url, url);
    } else if (onfail) {
      onfail();
    }
  };
  xhr.send(requestParams);
}

/**
 * @param response {object}
 * @return {string or null}
 */
function getWaybackUrlFromResponse(response) {
    
  if (response.results &&
      response.results[0] &&
      response.results[0].archived_snapshots &&
      response.results[0].archived_snapshots.closest &&
      response.results[0].archived_snapshots.closest.available &&
      response.results[0].archived_snapshots.closest.available === true &&
      response.results[0].archived_snapshots.closest.status.indexOf("2") === 0 &&
      isValidSnapshotUrl(response.results[0].archived_snapshots.closest.url)) {
    return makeHttps(response.results[0].archived_snapshots.closest.url);
  } else {
    return null;
  }
}

function makeHttps(url) {
  return url.replace(/^http:/, "https:");
}

/**
 * Makes sure response is a valid URL to prevent code injection
 * @param url {string}
 * @return {bool}
 */
function isValidSnapshotUrl(url) {
  return ((typeof url) === "string" &&
    (url.indexOf("http://") === 0 || url.indexOf("https://") === 0));
}


chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
  if(message.message=='openurl'){
    
      
      var page_url = message.page_url;
      var wayback_url = message.wayback_url;
      var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
      var url = page_url.replace(pattern, "");
      var open_url = wayback_url+encodeURI(url);
      console.log(open_url);
      if (message.method!='save') {
        wmAvailabilityCheck(url,function(){
          chrome.tabs.create({ url:  open_url});
        },function(){
          chrome.runtime.sendMessage({message:'urlnotfound'},function(response){
          });
        })
      } else {
        chrome.tabs.create({ url:  open_url});
      }
    
  }else if(message.message=='makemodal'){
            
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var tab=tabs[0];
                var url=tabs[0].url;
                if(url.includes('web.archive.org') || url.includes('web-beta.archive.org')){
                    //chrome.tabs.sendMessage(tab.id, {message:'nomodal'});
                    alert("Structure as radial tree not available on archive.org pages");
                }else{
                    chrome.tabs.executeScript(tab.id, {
                  file:"scripts/d3.js"
                });
                chrome.tabs.executeScript(tab.id, {
                  file:"scripts/RTcontent.js"
                });
                chrome.tabs.executeScript(tab.id, {
                  file:"scripts/sequences.js"
                });
                }
                
                
                
            });
                
        }else if(message.message=='sendurl'){
            chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                var url=tabs[0].url;
                chrome.tabs.sendMessage(tabs[0].id, {url:url});
            });
        }
});

chrome.webRequest.onErrorOccurred.addListener(function(details) {
  function tabIsReady(isIncognito) {
    if(details.error == 'NS_ERROR_NET_ON_CONNECTING_TO'  || details.error == 'NS_ERROR_NET_ON_RESOLVED'){
      wmAvailabilityCheck(details.url, function(wayback_url, url) {
        chrome.tabs.update(details.tabId, {url: chrome.extension.getURL('dnserror.html')+"?url="+wayback_url});
      }, function() {
        
      });
    }
  }
  if(details.tabId >0 ){
    chrome.tabs.get(details.tabId, function(tab) {
      tabIsReady(tab.incognito);
    });  
  }

  
}, {urls: ["<all_urls>"], types: ["main_frame"]});

function auto_save(tabId){

            chrome.tabs.get(tabId, function(tab) {
                var page_url = tab.url;
                if(isValidUrl(page_url)){
                    //chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
                    //chrome.browserAction.setBadgeText({tabId: tabId, text:"Checking..."});            // checking the archives

                    wmAvailabilityCheck(page_url,function(){
                        chrome.browserAction.setBadgeBackgroundColor({color:"green",tabId: tabId});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2713"});  // webpage is archived
                        console.error(page_url+'is already saved');
                    },function(){
                        chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2613"});                 // webpage not archived
                        console.error(page_url+'is not already saved');
                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                            var tab = tabs[0];
                            var page_url = tab.url;
                            var wb_url = "https://web.archive.org/save/";
                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
                            url = page_url.replace(pattern, "");
                            open_url = wb_url+encodeURI(url);
                            var xhr=new XMLHttpRequest();
                            xhr.open('GET',open_url,true);
                            xhr.onerror=function(){
                                chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
                                    console.error(page_url+' error unknown');
                            };
                            xhr.onload=function(){
                                console.log(xhr.status);
                                if(xhr.status==200){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"blue", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2713"});
                                    console.error(page_url+'is saved now');
                                }else if(xhr.status==403){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
                                    console.error(page_url+' save is forbidden');
                                }else if(xhr.status==503){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
                                    console.error(page_url+' error unknown');
                                }else if(xhr.status==504){
                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
                                    console.error(page_url+' error unknown');
                                }
                            };
                            xhr.send();
                        });
                    });
                }
            });
}
 chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){    
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs){
        chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
        chrome.browserAction.setBadgeText({tabId: tabId, text:"..."});
                  if (changeInfo.status == "complete" && !(tab.url.startsWith("http://web.archive.org/web") || tab.url.startsWith("https://web.archive.org/web") || tab.url.startsWith("https://web-beta.archive.org/web") || tab.url.startsWith("file:///") )) {
              chrome.storage.sync.get(['as'], function(items) {
                
              if(items.as){
                auto_save(tab.id);
              }
            });
            
          }else{
                    //chrome.browserAction.setBadgeBackgroundColor({color:"",tabId: tabId});
                    chrome.browserAction.setBadgeText({tabId: tabId, text:""});
          }
//        if (changeInfo.status == "complete") {
//            chrome.tabs.get(tabId, function(tab) {
//                var page_url = tab.url;
//                if(isValidUrl(page_url)){
//                    //chrome.browserAction.setBadgeBackgroundColor({color:"yellow",tabId: tabId});
//                    //chrome.browserAction.setBadgeText({tabId: tabId, text:"Checking..."});            // checking the archives
//
//                    wmAvailabilityCheck(page_url,function(){
//                        chrome.browserAction.setBadgeBackgroundColor({color:"green",tabId: tabId});
//                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2713"});  // webpage is archived
//                        console.error(page_url+'is already saved');
//                    },function(){
//                        chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                        chrome.browserAction.setBadgeText({tabId: tab.id, text:"\u2613"});                 // webpage not archived
//                        console.error(page_url+'is not already saved');
//                        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
//                            var tab = tabs[0];
//                            var page_url = tab.url;
//                            var wb_url = "https://web.archive.org/save/";
//                            var pattern = /https:\/\/web\.archive\.org\/web\/(.+?)\//g;
//                            url = page_url.replace(pattern, "");
//                            open_url = wb_url+encodeURI(url);
//                            var xhr=new XMLHttpRequest();
//                            xhr.open('GET',open_url,true);
//                            xhr.onload=function(){
//                                if(xhr.status==200){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"blue", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2713"});
//                                    console.error(page_url+'is saved now');
//                                }else if(xhr.status==403){
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
//                                    console.error(page_url+' save is forbidden');
//                                }else{
//                                    chrome.browserAction.setBadgeBackgroundColor({color:"red", tabId: tabId});
//                                    chrome.browserAction.setBadgeText({tabId: tab.id,text:"\u2613"});
//                                    console.error(page_url+' error unknown');
//                                }
//                            };
//                            xhr.send();
//                        });
//                    });
//                }
//            });
//        }
    });
 });
