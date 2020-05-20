# Attack Surface

## Simple vulnerability management.

[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m783419130-f522a7c4e60c5abe0ae5318d)](https://stats.uptimerobot.com/RMwRDtvPLw)
[![Discord](https://img.shields.io/discord/653137568740933632)](https://discord.gg/5HWZufA)
[![Subreddit subscribers](https://img.shields.io/reddit/subreddit-subscribers/cstool_io?style=social)](https://www.reddit.com/r/cstool_io)
master: ![Travis (.org) branch](https://img.shields.io/travis/Agh42/attacksrfc/master)
develop: ![Travis (.org) branch](https://img.shields.io/travis/Agh42/attacksrfc/develop)

Uses [cveservice](https://bitbucket.org/Agh42/cveservice) to query a database of CVE entries. 
The database is kept by [cve-search](https://github.com/cve-search/cve-search).
The favicon, site manifest, browserconfig and home screen icons were generated with [realfavicongenerator.net](https://realfavicongenerator.net/).

## Configuration

Edit ".env" in the top-level directory to set the following environment variables in development:
```
- CVESERVICE_URL: "http://cveserver:8080" (the URL of the cveserver REST api)
```
Set environment variables in production to the correct values.



# Fomantic-UI Theming

Changing the fomantic-ui theme is possible by editing
settings in _src/fomantic/src/site/globals/site.variables_ etc.

Don't forget to rebuild fomantic-ui by running _gulp build_ in the fomantic
folder.


# Create-React-App Primer:

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

You can find the most recent version of this guide [here](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-scripts/template/README.md).

