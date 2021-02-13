# Facebook Group Posts Scraper 
​​
Facebook Group Posts Scraper is a package which is used for scraping facebook groups by their group ids (names).
It scrapes posts, comments, replies and the number of reactions into a single json-file.
So far tested with groups with 10000+ posts. It might crash with higher values.

Because facebook has a bot-detection the script tries to mimic human beheaviour. Therefore it is slow (on purpose).
It takes around 30-45 seconds per post including affiliated comments and replies. Scraping only the posts without comments would be MUCH faster (like 60-90 seconds for 1000 posts).

This is a crappy script but it works. I took early works of the original fgps, added comment and reply scraping and added some other features like error catching and reaction counting. But i changed a lot and it is kind of a mess now. The code should be completely rewritten (as the original authors are currently doing).
I never wrote javascript before hence it is not my finest work ;-)
​
## Getting Started - Installation
Install current version nodejs (https://nodejs.org/en/download/)
​
```
git clone https://github.com/ameierchen/facebook-group-posts-scraper.git
cd facebook-group-posts-scraper/
cd src/
chmod +x index.js
# start with (see usage below)
./index.js
```
​
## Usage
 
- `./index.js -h/--help`       - Shows the help page.
- `./index.js -v/--version`    - Shows the CLI version.
- `./index.js -s/--start`      - Number of first post to scrape (optional).
- `./index.js -e/--end`        - Number of last post to scrape (optional).
- `./index.js --debug`         - Turn on (debugging) messages. Otherwise only warnings and errors (silent if none).
- `./index.js -o/--output`     - Specify the output folder destination.
- `./index.js --headful`       - Disable headless mode.
- `./index.js init`            - Initialize user configuration.
- `./index.js -g/--group-ids`  - Indicates which groups ids that we want to scrape (seperated by commas).
