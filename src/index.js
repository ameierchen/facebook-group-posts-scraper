#!/usr/bin/env node

const puppeteer = require('puppeteer');
const selectors = require('./selectors/facebook');
const fs = require('fs');
const inquirer = require('inquirer');
const minimist = require('minimist');
const chalk = require('chalk');
const Configstore = require('configstore');
const package = require('../package.json');
const config = new Configstore(
    package.name,
    {},
);
const arguments = minimist(
    process.argv.slice(2),
    {
      string: ['group-ids', 'output', 'start', 'end'],
      boolean: ['version', 'help', 'debug', 'headful', 'screenshot'],
      _: ['init'],
      default: {'output': './'},
      alias: {h: 'help', v: 'version', g: 'group-ids', o: 'output', s: 'start', e: 'end'},
      stopEarly: true, /* populate _ with first non-option */
    },
);

/**
* Function handles the validation of a string.
* @namespace validator
* @param {string} input the input parameter to validate
* @return {bool} returns true if the given input is valid
**/
function validator(input) {
  return input.length !== 0;
}

/**
  * This callback type is called `validatorCallback` and
  * is displayed as a global symbol.
  * @callback validatorCallback
  * @param {string} input
  * @return {boolean} returns true if the input is valid
 */

/**
  * Function gets the user configuration information by asking
  *  related questions to user.
  * @namespace askConfigQuestions
  * @param {validatorCallback} validator function to validate the user input
  * @return {Object} returns answer object got from the user
**/
async function askConfigQuestions(validator) {
  const answers = await inquirer.prompt([
    {
      name: 'facebook-username',
      type: 'input',
      message: 'facebook username:',
      validate: validator,
    },
    {
      name: 'facebook-password',
      type: 'password',
      message: 'password:',
      validate: validator,
    },
  ]);
  return answers;
}

/**
 * This callback type is called askQuestionsFunction callback and
 * is displayed as a global symbol
 * @callback askQuestionsFunction
 * @param {validatorCallback} validator
 * @return {Object} returns answer object got from the user
 */

/**
* Function handles the user configuration in CLI
* @namespace userConfig
* @param {askQuestionsFunction} askQuestionsFunction
* @param {validatorCallback} validator
* @return {void} reutrns nothing but handles the user configuration acton
**/
async function userConfig(askQuestionsFunction, validator) {
  const answers = await askConfigQuestions(validator);
  config.set({
    username: answers['facebook-username'],
    password: answers['facebook-password'],
  });
}

/**
* Function show a help page line on the console.
* @namespace helpPageLine
* @param {string} command command name to show
* @param {string} description command description to show
* @return {void} returns nothing but shows the help page line on the console
**/
function helpPageLine(command, description) {
  const magenta = chalk.magenta;
  console.info('  ' + magenta(command) + ':  ' + description);
}

/**
 * This callback type is called 'helpPageLineCallback and
 * is displayeed as global symbol
 * @callback helpPageLineCallback
 * @param {string} command command name to show
 * @param {string} description command description to show
 * @return {void} returns nothing but shows the help line on the console
 */

/**
* Function shows help page.
* @namespace help
* @param {helpPageLineCallback} helpPageLine Function that logs a help
 page line with given parameters
* @return {void} returns nothing but shows help page on the console.
**/
function help(helpPageLine) {
  console.info('Available options:');
  helpPageLine(
      '-g, --group-ids',
      '  Indicates which groups ids that we want to' +
      ' scrape (seperated by commas)',
  );
  helpPageLine('-h, --help', '    Shows the help page');
  helpPageLine('-v, --version', ' Shows the CLI version');
  helpPageLine('-o ,--output', '  Specify the output folder destination');
  helpPageLine('--debug', '       Turn on (debugging) messages');
  helpPageLine('--headful', '     Disable headless mode');
  helpPageLine('-s, --start', '   Number of first post to scrape (optional)');
  helpPageLine('-e, --end', '     Number of last post to scrape (optional)');
  helpPageLine('--screenshot', '  Take screenshot of every post and save it to the outputfolder (optional)');
  console.info('Available commands:');
  helpPageLine('init', '          Initialize user configuration');

}

/**
* Function shows error message.
* @namespace error
* @param {string} message message to display.
$ @return {void} returns nothing but shows an error message on the console
**/
function error(message) {
  console.error(
      chalk.bold.red('ERROR:') +
        ' ' +
        message,
  );
}

/**
* function shows the version of CLI.
* @namespace version
* @return {void} returns nothing but shows CLI version on console
**/
function version() {
  console.log(package.version);
}

/**
* function shows if user configured or not.
* @namespace isUserConfigured
* @return {bool} returns if user configured or not.
**/
function isUserConfigured() {
  return (
    config.get('username') !== undefined &&
    config.get('username') !== null &&
    config.get('password') !== undefined &&
    config.get('password') !== null
  );
}

/**
* Function sleeps the current process for given number of milliseconds
* @namespace sleep
* @param {int} time parameter description
* @return {void} returns nothing but sleeps for time ms
**/
async function sleep(time) {
  return new Promise(function(resolve) {
    setTimeout(resolve, time);
  });
}

/**
 * This callback type is called 'sleepFunctionCallback' and
 * displayed as a global type
 * @callback sleepFunctionCallback
 * @param {int} time The number of ms that we want to sleep for
 * @return {void} returns nothing but sleeps the current process for
 * given number of milliseconds
 */

/**
* function scrolls the page.
* @namespace autoScroll
* @param {Page} page the current page opened on browser
* @param {sleepFunctionCallback} sleep The function used for
sleeping the current process
* @return {void} returns nothing but scrolls the page.
**/
async function autoScroll(page, sleep) {
  await page.evaluate(async () => {
    /**
    * Function sleeps the current process for given number of milliseconds
    * @namespace sleep
    * @param {int} time parameter description
    * @return {void} returns nothing but sleeps for time ms
    **/
    async function sleep(time) {
      return new Promise(function(resolve) {
        setTimeout(resolve, time);
      });
    }

    for (let i = 0; i < Math.round((Math.random() * 10) + 10); i++) {
      window.scrollBy(0, document.body.scrollHeight);
      await sleep(
          Math.round(
              (Math.random() * 4000) + 1000,
          ),
      );
    }
    Promise.resolve();
  });
}

/**
* function scrolls the page faster.
* @namespace fastAutoScroll
* @param {Page} page the current page opened on browser
* @param {sleepFunctionCallback} sleep The function used for
sleeping the current process
* @return {void} returns nothing but scrolls the page.
**/
async function fastAutoScroll(page, sleep) {
  await page.evaluate(async () => {
    /**
    * Function sleeps the current process for given number of milliseconds
    * @namespace sleep
    * @param {int} time parameter description
    * @return {void} returns nothing but sleeps for time ms
    **/
    async function sleep(time) {
      return new Promise(function(resolve) {
        setTimeout(resolve, time);
      });
    }

    for (let i = 0; i < Math.round((Math.random() * 10) + 10); i++) {
      window.scrollBy(0, document.body.scrollHeight);
      await sleep(
          Math.round(
              (Math.random() * 40) + 1000,
          ),
      );
    }
    Promise.resolve();
  });
}

/**
* Funciton generates the Facebook group URL from the given group id.
* @namespace generateFacebookGroupUrlFromId
* @param {string} groupId facebook group id
* @return {string} returns the Facebook group url
* related to the given Facebook group id
**/
function generateFacebookGroupUrlFromId(groupId) {
  return 'https://m.facebook.com/groups/' + groupId + '/';
}

/**
* function creates a browser instance.
* @namespace createBrowser
* @param {Object} arguments Comamnd line arguments parsed from user input
* @return {Browser} returns the Browser object
**/
async function createBrowser(arguments) {
  const browserOptions = {
    headless: arguments['headful'] === false,
    args: [
      '--no-sandbox',
      '--disable-setuid-sendbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
    ],
  };

  if (process.arch === 'arm' || process.arch === 'arm64') {
    // If processor architecture is arm or arm64 we need to use chromium browser
    browserOptions.executablePath = 'chromium-browser';
  }

  const browser = await puppeteer.launch(browserOptions);
  return browser;
}

/**
* Function creates an incognito page from the given browser instance.
* @namespace incognitoMode
* @param {Browser} browser The browser object that we want to create
 the incognito page
* @return {Page} returns the page in the incognito mode
**/
async function incognitoMode(browser) {
  /**
   * We need an incognito browser to avoid notification
   *  and location permissions of Facebook
   **/
  const incognitoContext = await browser.createIncognitoBrowserContext();
  // Creates a new browser tab
  const page = await incognitoContext.newPage();
  return page;
}

/**
* Funciton sets the listeners to avoid to load unnecessary content.
* @namespace setPageListeners
* @param {Page} page The current page of the browser
* @return {void} returns nothing but configures listeners on the given
 page to avoid to load
* unnecessart content
**/
async function setPageListeners(page) {
  await page.setRequestInterception(true);
  const blockResources = [
    'image', 'media', 'font', 'textrack', 'object',
    'beacon', 'csp_report', 'imageset',
  ];
  page.on('request', (request) => {
    const rt = request.resourceType();
    if (
      blockResources.indexOf(rt) > 0 ||
            request.url().match(/\.((jpe?g)|png|gif)/) != null
    ) {
      request.abort();
    } else {
      request.continue();
    }
  });
}

/**
* Funciton sets the listeners to avoid to load unnecessary content.
* @namespace setPageListenersComments
* @param {Page} page The current page of the browser
* @return {void} returns nothing but configures listeners on the given
 page to avoid to load
* unnecessart content
**/
async function setPageListenersComments(page) {
  //await page.setRequestInterception(true);
  /**const blockResources = [
    'media', 'font', 'textrack', 'object',
    'beacon', 'csp_report',
  ]; 
  page.on('request', (request) => {
    const rt = request.resourceType();
    request.continue();
  });*/
}

/**
 * The callback function called 'setPageListenersCallback and
 * displayed as a global type
 * @callback setPageListenersCallback
 * @param {Page} page The page that we set our listeners on
 * @return {void} Returns nothing but sets the listeners on the given page
 */

/**
* Function handles the Frabook login of the user.
* @namespace facebookLogin
* @param {Object} arguments command line arguments parsed with minimist
* @param {Page} page the incognito page that we are using for login
* @param {setPageListenersCallback} setPageListeners the function that
 sets the page listeners to speed up
* @return {Page} returns the page when the user logged in
**/
async function facebookLogIn(arguments, page, setPageListeners) {
  // Goes to base facebook url
  await page.goto('https://facebook.com');
  await page.waitForXPath('//button[@data\-cookiebanner="accept_button"]');
  var acceptCookiesButton = (await page.$x('//button[@data\-cookiebanner="accept_button"]'))[0];
  await page.evaluate(el => {
    el.focus();
    el.click();
  }, acceptCookiesButton)
  /**
   * Waiting for login form JQuery selector to avoid
   * that forms elements to be not found
  **/
  await page.waitForSelector(selectors.login_form.parent);
  // Focusing to the email input
  await page.focus(selectors.login_form.email);
  // Clicking on the email form input to be able to type on input
  await page.focus(selectors.login_form.email);
  // Typing on the email input the email address
  await page.keyboard.type(config.get('username'));
  // Focusing on the password input
  await page.focus(selectors.login_form.password);
  // Typing the facebook password on password input
  await page.keyboard.type(config.get('password'));
  // Clicking on the submit button
  await page.waitForXPath('//button[@data\-testid="royal_login_button"]')
  const [loginButton] = await page.$x('//button[@data\-testid="royal_login_button"]');
  await page.evaluate((el) => {
    el.click();
  }, loginButton);
  await page.waitForXPath('//div[@data\-pagelet="Stories"]');
  await setPageListeners(page);
  return page;
}

/**
* function gets old publications.
* @namespace getOldPublications
* @param {type} fileName name of the file
* @return {Object[]} returns the list of all publications.
**/
function getOldPublications(fileName) {
  let allPublicationsList;
  if (fs.existsSync(fileName) === true) {
    // If file exists
    allPublicationsList = JSON.parse(
        fs.readFileSync(fileName, {encoding: 'utf8'}),
    );
  } else {
    // If file does not exists
    allPublicationsList = [];
  }
  return allPublicationsList;
}


/**
* function gets comments and replies belonging to a post
* @namespace getComments
* @param {Object} arguments Command line arguments parsed with minimist
* @param {string} link Permalink to the post
* @param {import('puppeteer').Page} page Browserpage used for scraping the comments and replies
* @param {sleepFunctionCallback} sleep name of the file
* @param {number} postNumber internal number of the post
* @param {string} folder the used folder for saving the screenshot
* @return {String[]} returns the list of comments and replies.
**/
async function getComments(arguments, link, page, sleep, postNumber, folder) {
  await page.goto(
      link,
      {timeout: 600000},
  );
  const commentsList = [];
  await page.waitForXPath(
    '//div[@data\-sigil="m-mentions-expand"]',
  );
  await fastAutoScroll(page, sleep);
  const commentsHtmlElements = await page.$$(
    '[data\-sigil="comment"]',
  );
  const commentsPostsHtmlElements = await page.$$(
    '[data\-sigil="comment-body"]',
  );
  const commentsPostsAuthorHtmlElements = await page.$$(
    '[class="_2b05"] > a',
  );
  const commentsPostsRelDateHtmlElements = await page.$$(
    '[data\-sigil="ufi-inline-comment-actions"] > abbr',
  );
  const additionalCommentsLinksElements = await page.$$(
    '[data\-sigil="replies-see-more"] > a',
  );
  const commentsReactionsHtmlElements = await page.$$(
    '[data\-sigil="comment"] > [class="_2b04"] > [class="_14v5"]',
  );
  // if there are replies this condition is true and starts the reply scraping process
  if ( additionalCommentsLinksElements !== null ) {
    if (arguments['debug'] === true) {
      console.log(`klicking ${additionalCommentsLinksElements.length} elements for replies`);
    };
    for ( let i = 0; i < additionalCommentsLinksElements.length; i++ ) {
      //if we scrape to fast fb will recognize us as a bot. Therefore we scroll every 10th comment with a reply
	    if ( ( i % 10 === 0 ) && ( i != "0") ) {
	      await fastAutoScroll(page, sleep);
	    };
      //click every reply announcement to publish the replies
      try {
        const [clicked] = await Promise.all([
          await additionalCommentsLinksElements[i].click(),
        ]);
      } catch (err) {
        console.log(`WARNING: I failed to click :(`);
      }
    };
  };
  await fastAutoScroll(page, sleep);
  if (arguments['screenshot'] === true) {
    try{
      if (arguments['debug'] === true) {
        console.log(`taking screenshot of post ${postNumber}`);
      };
      let screenshotFile = folder + postNumber + '.pdf';
      await page.emulateMediaType('screen');
      const height = await page.evaluate(() => document.body.scrollHeight);
      await page.pdf({ path: screenshotFile, height: height, printBackground: true });
    } catch (err) {
      console.log(`screenshot failed ${err}`)
    };
  };
  //scraping the comments - works mostly like in the main function with posts
  if (arguments['debug'] === true) {
    console.log(`found ${commentsPostsHtmlElements.length} comments`);
  };
  for ( let i = 0; i < commentsPostsHtmlElements.length; i++ ) {
    let repliesList = [];
    let commentReaction = "0";
    try {
        // get replies for the comment
        if (arguments['debug'] === true) {
          console.log(`getting replies for comment ${i}`);
        };
        repliesList = await getReplies(arguments, commentsHtmlElements[i]);
    } catch (err) {
        console.log(`WARNING: failed on scraping replies. Continuing...`);
        console.log(`${err}`);
    };
    try {
      // get number of reactions (likes, ...) for the comment
      commentReaction = await commentsReactionsHtmlElements[i].$eval('[class="_14va"]', node => node.innerText);
    } catch (err) {
        console.log(`WARNING: failed on getting reactions. Continuing...`);
        console.log(`${err}`);
    };
    if ( commentReaction === "" ) {
      commentReaction = "0";
    };
    const [commentAuthorName, commentTextContent, commentRelDate] = await page.evaluate(
        (el,eb,ef) => {
          return [el.textContent, eb.textContent, ef.textContent];
        },
        commentsPostsAuthorHtmlElements[i],
        commentsPostsHtmlElements[i],
        commentsPostsRelDateHtmlElements[i],
    );
    if (arguments['debug'] === true) {
      console.log(`finalising comment ${i} by ${commentAuthorName}`);
    };
    const comment = {
        author: commentAuthorName,
        post: commentTextContent,
        date: commentRelDate,
        reactions: commentReaction,
        replies: repliesList,
        };
    commentsList.push(comment);
  };
  return commentsList;
}



/**
* function gets replies belonging to a comment
* @namespace getReplies
* @param {Object} arguments Command line arguments parsed with minimist
* @param {import('puppeteer').ElementHandle} replyElement Element containig the comment whose replies are supposed to be scraped
* @return {string[]} returns the list of comments and replies. Returns empty array if there are no replies.
**/
async function getReplies(arguments, replyElement) {
  //scraping the comments - works mostly like in the main function with posts but uses an element instead of a page
  const repliesList = [];
  const replyReactionsHtmlElements = await replyElement.$$(
    '[data\-sigil="comment inline-reply"]',
  );
  const replyAuthorHtmlElements = await replyElement.$$(
    '[class="_2b05"] > a._4kk6',
  );
  const replyPostsHtmlElements = await replyElement.$$(
    '[data\-sigil="comment-body"]',
  );
  const replyRelDateHtmlElements = await replyElement.$$(
    '[data\-sigil="ufi-inline-comment-actions"] > abbr',
  );
  if (arguments['debug'] === true) {
    console.log(`found ${replyReactionsHtmlElements.length} replies`)
  };

  if ( replyReactionsHtmlElements.length > 0 ) {
    for ( let i = 0; i < replyReactionsHtmlElements.length; i++ ) {
      let replyReactions = "0";
      try {
        // get number of reactions (likes, ...) for the comment
        replyReactions = await replyReactionsHtmlElements[i].$eval('[class="_14va"]', node => node.innerText);
      } catch (err) {
          replyReactions = "0";
          console.log(`WARNING: failed on getting reactions. Continuing...`);
          console.log(`${err}`);
      };
      if ( replyReactions === "" ) {
        replyReactions = "0";
      };
      const [replyRelDate2, replyAuthorName, replyTextContent, replyRelDate] = await replyElement.evaluate(
        (al,ab,af,ah) => {
          return [al.innerText, ab.innerText, af.innerText, ah.innerText];
        },
        replyAuthorHtmlElements[i],
        replyPostsHtmlElements[i+1],
        replyRelDateHtmlElements[i],
      );
      const reply = {
        author: replyAuthorName,
        post: replyTextContent,
        date: replyRelDate,
        reactions: replyReactions,
      };
    repliesList.push(reply);
    };
  };
  if (arguments['debug'] === true) {
    console.log(`finished scraping replies. Continuing...`);
  };
  return repliesList;
};


/**
 * The callback function called getOldPublicationsCallback and
 * displayed as a global type
 * @callback getAllPublicationsCallback
 * @param {string} fileName The file name that we want to load
 * old publications from
 * @return {Object[]} The list of old publications loaded from
 *  the given fileName
 */

/**
  * The callback function called autoScrollFunction and
  * displayed as a global type
  * @callback getAutoScrollFunction
  * @param {Page} page The page that we want to scroll
  * @param {sleepFunctionCallback} sleep The sleep function that
  * we are using for waiting before scroll
  * @return {Page} The scrolled page
  */

/**
* Function handles the main execution of the Facebook bot.
* @namespace facebookMain
* @param {Object} arguments Command line arguments parsed with minimist
* @param {string} groupUrl The url of the Facebook group
* @param {Page} page The actual page of browser
* @param {string} id The id of the facebook group
* @param {getOldPublicationsCallback} getOldPublications The function used for
loading the older publications
* @param {autoScrollFunction} autoScroll The function used for
scrolling automatically
* @param {sleepFunctionCallback} sleep The sleep function that we use in autoScroll
* @param {number} start Number of first post we are supposed to scrape
* @param {number} end Number of last post we are supposed to scrape
* @return {void} returns nothing but scrape all questions from specific groups
**/
async function facebookMain(
    arguments,
    groupUrl,
    page1,
    page2,
    id,
    getOldPublications,
    autoScroll,
    sleep,
    start,
    end,
) {
  // Navigates to the first facebook group
  await page1.goto(
      groupUrl,
      {timeout: 600000},
  );
  // initialize start in case it's empty
  if ( typeof start != 'string' ) {
    start = "0";
  };
  if ( typeof end != 'string' ) {
    end = "0";
  };



  /**
   * Waiting for the group stories container to continue
   * and to avoid the selector not found error
  **/
  // Getting all Facebook group posts

  const groupNameHtmlElement = (await page1.$x('/html/head/title'))[0];
  let groupName = await page1.evaluate(
      (el)=> {
        return el.textContent;
      },
      groupNameHtmlElement,
  );
  if (arguments['debug'] === true) {
    console.log('Group title ' + groupName);
  }

  //save file into subfolder. Create new folder for every run by naming it by date with a number
  const today = new Date().toISOString().slice(0, 10)
  groupName = groupName.replace(/\//g, '_');
  const  folder = arguments['output']  + groupName + '/';
  const fileName = folder + groupName + '.json';
  fs.mkdir( folder, (err) => { 
    if (err) { 
        return console.log(`Directory ${folder} already exists!`); 
    }
    if (arguments['debug'] === true) {
      console.log(`Directory ${folder} created successfully!`); 
    };
  });
  let pdfFolder = folder + today + '-' + "0" + '/';
  let numberedRun = "0";
  do {
    numberedRun++;
    pdfFolder = arguments['output'] + groupName + '/' + today + '-' + numberedRun + '/';
  } while ( fs.existsSync(pdfFolder) )
  fs.mkdir( pdfFolder, (err) => { 
      if (err) { 
          return console.error(err); 
      }
      if (arguments['debug'] === true) {
        console.log(`Directory ${pdfFolder} created successfully!`); 
      };
  });


  // we are scrolling trough the entire page until it is completely loaded into cache (not sure if this works for very big groups, tested with ~ 900 posts)
  await page1.waitForXPath(
    '//article/div[@class="story_body_container"]',
  );
  do {
    let groupPostsHtmlElements = await page1.$$(
      'article[data\-store\-id]',
    );
    pre = groupPostsHtmlElements.length;
    if ( ( end != "0" ) && ( pre > end ) ) {
      await fastAutoScroll(page1, sleep);
      break;
    };
    if (arguments['debug'] === true) {
      console.log(`Initial scrapeing. Found ${pre} posts so far. Continuing`);
    };
    await autoScroll(page1, sleep);
    groupPostsHtmlElements = await page1.$$(
      'article[data\-store\-id]',
    );
    post = groupPostsHtmlElements.length;
    if ( end != "0" ) {
      post = end;
      if (arguments['debug'] === true) {
        console.log(`upperBound set to ${post}`)
      };
    };
    if (arguments['debug'] === true) {
      console.log(`${pre} to ${post}`);
    };
  } while (pre < post);
    const allPublicationsList = getOldPublications(fileName);
    // List contains all publications

    if (arguments['debug'] === true) {
      console.log(`Total posts before scraping ${allPublicationsList.length}`);
    }
    // eslint-disable-next-line no-var

    // Variable indicates if any new posts found on the page
    var isAnyNewPosts = false;
    const groupPostsHtmlElements = await page1.$$(
      'article[data\-store\-id]',
    );
        
    // Looping on each group post html element to get text and author
    
    let run = 0;
    let pos = 0; 
    // run is used for debugging/error catching
    if ( ( end === "0" ) || ( end > groupPostsHtmlElements.length ) ) {
      end = groupPostsHtmlElements.length;
    };
    if (arguments['debug'] === true) {
      console.log(`found ${groupPostsHtmlElements.length} posts. Beginning to scrape from ${start} to ${end}`);
    };
    try {
      for (let i = Number(start); i < end; i++) {

        const groupPostsAuthorHtmlElements = await groupPostsHtmlElements[i].$(
          ':scope div[class="story_body_container"] > header strong:first-child > a'
        );
        const groupPostsRelDateHtmlElements = await groupPostsHtmlElements[i].$(
          ':scope div[class="story_body_container"] > header div[data\-sigil="m-feed-voice-subtitle"] a'
        );
        const groupPostsLinkHtmlElements = await groupPostsHtmlElements[i].$(
          ':scope div[class="story_body_container"] > header div[data\-sigil="m-feed-voice-subtitle"] a',
        );
        const groupPostsStoryHtmlElements = await groupPostsHtmlElements[i].$(
          ':scope div[class="story_body_container"] > div',
        );
        const groupPostReactionHtmlElements = await groupPostsHtmlElements[i].$(
          ':scope > footer div[data\-sigil="reactions-sentence-container"] > div',
        );
        run = i;
        pos = i + 1;
        if (arguments['debug'] === true) {
          console.log(`Scraping Post ${pos}/${end}`);
        };
        // some posts only contain picture. Trying to scrape text from them results in undefined elements.
        // Therefore we grep the links from the pic(s) if it failed to get textcontent
        let postTextContent = "";
        try {
          if (arguments['debug'] === true) {
            console.log(`getting text from post`);
          };
          postTextContent = await page1.evaluate(
            eb => { 
            return eb.textContent;
            },
            groupPostsStoryHtmlElements,
          );
          if ( postTextContent === "") {
            if (arguments['debug'] === true) {
              console.log(`no text in post, getting link`);
            };
            const groupPostsStoryLinkHtmlElements = await groupPostsStoryHtmlElements[i].$(
              'a',
            );
            postTextContent = await page1.evaluate(
              eb => { 
              return [ eb.getAttribute("href") ];
              },
              groupPostsStoryLinkHtmlElements,
            );
          };
        } catch (err) {
          console.log(`WARNING: Something didn't work out at postText scraping\n${err}`);
        };

        let postReactions = "0";
        if ( groupPostReactionHtmlElements != null ) {
          try {
            if (arguments['debug'] === true) {
              console.log(`getting post reactions`);
            };
            postReactions = await page1.evaluate(
              ej => { 
              return ej.textContent;
              },
              groupPostReactionHtmlElements,
            );
          } catch (err) {
            console.log(`WARNING: no reactions in post`);
            postReactions = "0";
          };
        };
        if ( postReactions === "") {
          postReactions = "0";
        };
        //console.log(`${postReactions}`);
        let [postAuthorName, postRelDate, postLinkAdress]  = ("","","");
        try {
          if (arguments['debug'] === true) {
            console.log(`getting author, date and link from post`);
          };
          [postAuthorName, postRelDate, postLinkAdress] = await page1.evaluate(
              (el,ef,eh) => {
                return [el.textContent, ef.textContent, eh.getAttribute("href")];
              },
              groupPostsAuthorHtmlElements,
              groupPostsRelDateHtmlElements,
              groupPostsLinkHtmlElements,
          );
          } catch (err) {
            console.log(`WARNING: Scraping post failed on ${run} with ${err}`);
          }
          if ( !postLinkAdress.startsWith("http") ) {
            postLinkAdress = "https://m.facebook.com" + postLinkAdress;
          }
        //const postContent = await groupPostsAuthorHtmlElements[i].$x('//article/div[@class="story_body_container"]//span[1]/p');
        // creates a preliminary publication object which contains author and text of our publication
        const publicationPre = {
          author: postAuthorName,
          post: postTextContent,
        };

        // variable indicates if publication exists in allPublicationsList
        let isPublicationExists = false;

        // Check if publication exists in allPublicationsList
        for (let a = 0; a<allPublicationsList.length; a++) {
          const otherPublication = allPublicationsList[a];
          if (
            (publicationPre.post === otherPublication.post) &&
                      (publicationPre.author === otherPublication.author)
          ) {
            // If publication exists in allPublictationList
            isPublicationExists = true;
            break;
          } else {
            exists = 0;
            // if publication does not exists in allPublicationList
            isPublicationExists = false;
          }
        }
        let postComments = "{}";
        // scrapes all comments and replies belonging to our current post (if there are any)
        if ( postLinkAdress !== null ) {
            try {
                if (arguments['debug'] === true) {
                  console.log(`getting comments from post`);
                };
                postComments = await getComments(arguments, postLinkAdress, page2, sleep, pos, pdfFolder);
            } catch (err) {
                postComments = "{}";
                console.log(`WARNING: failed on scraping comments at post ${run}. Continuing...`);
                console.log(`${err}`);
            }
        } else {
          postComments = "{}";
        };
        // creates a publication object which contains our publication including comments
        const publication = {
          number: pos,
          author: postAuthorName,
          post: postTextContent,
          date: postRelDate,
          link: postLinkAdress,
          reactions: postReactions,
          comments: postComments,
        };

        /**
         * Once we got the response from the check
         * publication in allPublicationsList
        **/
        if (isPublicationExists === false) {
          allPublicationsList.push(publication);
          isAnyNewPosts = true;
        }
      }
    } catch (err) {
         console.log(`ERROR: failed on post ${run} with ${err}`)
    };

    /**
     * All html group post elements are added on
     * global publictions list (allPublictionList)
     **/
    if (arguments['debug'] === true) {
      console.log('Total posts before scrolling' + allPublicationsList.length);
    }
    /**
     *  console.log(`Total posts before
     * scrolling ${allPublicationsList.length}`);
    **/
    // Both console.log statement above are same

//    await autoScroll(page1, sleep);
//  } while (isAnyNewPosts === true);
  if (arguments['debug'] === true) {
    console.info(
        groupName +
        ' Facebook group\'s posts scraped: ' +
        allPublicationsList.length +
        ' posts found',
    );
  };
  fs.writeFileSync(
      fileName,
      JSON.stringify(allPublicationsList, undefined, 4),
      {encoding: 'utf8'},
  );
  if (arguments['debug'] === true) {
    console.log('File successfully! written'); 
  };
// await browser.close();
}

/**
* Function handles the main process of the scraper
* @namespace main
* @param {Object} arguments arguments parsed from command line with minimist
* @param {askQuestionsFunctionCallback} askQuestionsFunction
The function used for asking questions to user configuration
* @param {validatorFunctionCallback} validator The function used for
validate user answsers
* @param {createBrowserCallback} createBrowser function that creates the browser
* @param {incognitoModeCallback} incognitoMode function creates an
incognito mode from the given browser
* @param {setPageListenersCallback} setPageListeners function sets the page
* listeners on the given page
* @param {generateFacebookGroupUrlFromIdCallback} generateFacebookGroupUrlFromId
function sets the page
* listeners on the given page
* @param {facebookMainCallback} facebookMain The main function used for
 scraping data from facebook
* @param {getOldPublicationsCallback} getOldPublications The function
 used for loading old publications
* @param {autoScrollCallback} autoScroll The function used for auto scrolling
* @param {sleepFunctionCallback} sleep The function used for
sleeping the current process
* @return {void} returns nothing but calls the FacebookMain
* function for each groupId once logged in
**/
async function main(
    arguments,
    askQuestionsFunction,
    validator,
    createBrowser,
    incognitoMode,
    setPageListeners,
    generateFacebookGroupUrlFromId,
    facebookMain,
    getOldPublications,
    autoScroll,
    sleep,
) {
  if (isUserConfigured() === false) {
    await userConfig(askQuestionsFunction, validator);
  }
  if (arguments['debug'] === true) {
    console.log(`fgps is starting`);
  };

  const facebookGroupIdList = arguments['group-ids'].split(',');
  const upperBound = arguments['start'];
  const lowerBound = arguments['end'];
  if (arguments['debug'] === true) {
    console.log(`opening browser windows and logging in`);
  };
  const browser = await createBrowser(arguments);
  let page1 = await incognitoMode(browser);
  await page1.setUserAgent("User agent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36");
  page1 = await facebookLogIn(arguments, page1, setPageListeners);
  let page2 = await incognitoMode(browser);
  await page2.setUserAgent("User agent Mozilla/5.0 (Macintosh; Intel Mac OS X 10_16_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.0 Safari/537.36");
  page2 = await facebookLogIn(arguments, page2, setPageListenersComments);
  // for (var i = 0; i < facebookGroupIdList.length; i++) {
  for (let i = 0; i < facebookGroupIdList.length; i++) {
    const id = facebookGroupIdList[i];
    const groupUrl = generateFacebookGroupUrlFromId(id);
    await facebookMain(
        arguments,
        groupUrl,
        page1,
        page2,
        id,
        getOldPublications,
        autoScroll,
        sleep,
        upperBound,
        lowerBound,
    );
  }
  await browser.close();
}

if (
  fs.existsSync(arguments['output']) === false ||
    fs.lstatSync(arguments['output']).isDirectory() === false
) {
  // output is not exists or not a directory
  error(
      arguments['output'] +
      'does not exists or is not a directory. '+
      'Please retry with an existing directory path',
  );
  process.exit(1);
}

if (arguments['help'] === true) {
  help(helpPageLine);
  process.exit(0);
}

if (arguments['version'] === true) {
  version();
  process.exit(0);
}

// if (arguments['_'].includes('init')) {
if (arguments['_'].indexOf('init') !== -1) {
  userConfig(askConfigQuestions, validator).then(() => {
    process.exit(0);
  });
} else {
  if (arguments['group-ids'] !== undefined && arguments['group-ids'] !== null) {
    main(
        arguments,
        askConfigQuestions,
        validator,
        createBrowser,
        incognitoMode,
        setPageListeners,
        generateFacebookGroupUrlFromId,
        facebookMain,
        getOldPublications,
        autoScroll,
        sleep,
    ).then(() => {
      if (arguments['debug'] === true) {
        console.log('Facebook group scraping done');
      };
    });
  } else {
    error('No argument specified. Please check help page for valid arguments');
    help(helpPageLine);
    process.exit(1);
  }
}
