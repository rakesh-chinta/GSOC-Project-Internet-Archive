# GSOC-Project-Internet-Archive
This is the project I helped in building along with several contributors for GSOC 17, Internet archive under the mentorship of Mark Graham.

I worked on several basic features for the base of the various browser extensions, they include :
## The project goals :
- Display Tweets about a URL with auto URL detection(single button search)
- Support for social sharing, including Twitter and Facebook, LinkedIn, Google plus.
- Integration with the Wayback Machine’s Site Search.
- Provide user with visual feedback based on if we have archived a URL or not.
- Provide user with a one-click Summary view of a given site (Alexa statistics, Whois statistics)
- Automatically archive URLs that are not in the Wayback Machine
- Quick access to an overview of all the Archives for a specific URL

## 1.Tweets feature:
The tweets feature was built by parsing the active URL from the omnisearchbox and searching the result on the twitter search platform on the basis of advanced search, there was an optional setting where we can view and set the boundaries of the dates from which the tweets can be viewed by. Now at the current release the tweets button displays the current top 10 tweets made on the current URL.

## 2.Social sharing buttons:
The social sharing buttons are used by the user to share the current active URL to one's social media accounts.They currently support 4 social media platforms, namely: Facebook, Google plus, LinkedIn, and Twitter.

## 3.Integration with Wayback Machine's Site search:
The wayback machine's site search has been integrated within the extension, it works as follows: The user receives recommendation based on their input within the searchbox after typing in 3 characters, they are shown a limit of the top 5 search recommendations.The user has the option to click on one of the search recommendations and is redirected to Internet archives history where the URL is archived, or can continue typing it the URL and search manually based on his criteria for "Save page now", "recent version", "first version" or can use the search button to click and go to the Internet archives's archive history of the URL.

## 4.Alexa Statistics and Whois Statistics:
Alexa and whois Statistics buttons parse the URL for the main part/root part and display the alexa and whois statistics given by alexa.com and whois search API respectively to the user.

## 5.Automatic Archiving of URL's:
The display notifications of the auto-save features are explained as in 3 cases:
displays to the user in 4 different modes based on the progress or current status or the URL.     
### Modes:  
#### Mode1: Displays "CHECKING", which indicates that the current URL is being checked whether if it was already archived in the wayback-machine, it then proceeds to the next steps  
#### Mode2: shows a green signal stating "YES" if the webpage is already archived in the wayback machine.
#### Mode3: shows "NO", meaning the current webpage is not archived in the wayback machine. 
#### Mode4: If "NO", then "SAVING" is shown indicating that the webpage is currently being archived and we get a final message of "YES"

## Other Feature which were not merged due to being not required/unnecessary.
1. Dark Mode button
2. Related Website Feature
3. Quick Overview of current URL's statistics
4. Support Button
5. Internet Archive Integrated SearchBar.
6. Quick Calender View

### Things left to do/complete
1.Williams feedback:
"something minor, but on windows the popups created by the chrome extension appear as small black icons in my task-bar that aren't visible when not selected, can this icon be changed to something more compatible?"
2. Mark's feedback for the "URL selected via Search should be the URL of the page"
3.Testing in more sites for issue no 35(This is the last issue within the bug sheet which needs to be fixed), regarding "Pages blocked with a robot.txt displays null when trying to find a page saved in the wayback machine, whois, or alexa". I need to do more testing and fix the issue and makes sure it is not failing in any case.
4.Porting the chrome extension into the safari extension.


## License

Copyright Internet Archive, 2017
AGPL-3


## Credits

- Richard Caceres, @rchrd2
- Mark Graham, @markjohngraham
- Benjamin Mandel
- Kumar Yoges
- Anton, @
- Abhidhas, @abhidas17695
- Rakesh N Chinta, @rakesh-chinta

## Other resources:
##### Medium post showing all commits and Version-wise release notes:
https://medium.com/@rakeshnchinta/google-summer-of-code-2017-internet-archive-release-s-report-98074a8a166
##### Medium post/blog:
https://medium.com/@rakeshnchinta/et-google-summer-of-code-2017-report-f84fa1b7a294


