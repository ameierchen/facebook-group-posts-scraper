# Facebook Group Posts Scraper 
​​
Facebook Group Posts Scraper is a package which is used for scraping facebook groups by their group ids (names).
It scrapes posts, comments, replies and the number of reactions int oa single json-file.
So far tested with groups with 900+ posts. 
​
## Getting Started - Installation
Install current version nodejs (https://nodejs.org/en/download/)
​
```
git clone https://github.com/ameierchen/facebook-group-posts-scraper.git
cd facebook-group-posts-scraper/
git checkout grep-subcomments
cd src/
chmod +x index.js
# start with (see usage below)
./index.js
```
​
## Usage
 
- `./index.js -h/--help`     - Shows the help page.
- `./index.js -v/--version`  - Shows the CLI version.
- `./index.js --output`     - Specify the output folder destination.
- `./index.js --headful`    - Disable headless mode.
- `./index.js init`         - Initialize user configuration.
- `./index.js --group-ids`  - Indicates which groups ids that we want to scrape (seperated by commas).
