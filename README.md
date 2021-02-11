# Facebook Group Posts Scraper 
​​
Facebook Group Posts Scraper is a package which is used for scraping facebook groups by their group ids (names).
It scrapes posts, comments, replies and the number of reactions int oa single json-file.
So far tested with groups with 900+ posts. 
​
## Getting Started - Installation
​
`npm i facebook-group-posts-scraper -g --unsafe-perm`
​
## Usage
 
- `fgps -h/--help`     - Shows the help page.
- `fgps -v/--version`  - Shows the CLI version.
- `fgps  --output`     - Specify the output folder destination.
- `fgps  --headful`    - Disable headless mode.
- `fgps  init`         - Initialize user configuration.
- `fgps  --group-ids`  - Indicates which groups ids that we want to scrape (seperated by commas).
