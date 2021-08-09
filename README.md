# USA.gov Elected Officials Project
Find useful information about your elected officials by typing in your address.

## Credits
This project was created by [Charlie Liu](https://linkedin.com/in/cliu13) and [Jacob Cuomo](https://linkedin.com/in/jacob-cuomo-659937125) as part of the 2021 Civic Digital Fellowship.

Special thanks to [David Stenger](https://github.com/davidstenger) and [Russell O'Neill](https://github.com/smileytech)!

## Deployment Instructions
Pull this repository, start a local web server, and then visit [localhost:8000](http://localhost:8000) in your browser.

To start a local web server, run one of the following commands within the repository's directory:

#### Python 3.x
```bash
python3 -m http.server 8000
```

#### Python 2.x
```bash
python -m SimpleHTTPServer 8000
```

## Development Instructions
First, if gulp is not installed on your computer, run this command:

```bash
npm install gulp-cli -g
```

Because this project uses node, then run this command next:
```bash
npm install
```

And finally, if you make any style-related changes, run this command:

```bash
gulp watch
```

This ensures that all changes are reflected correctly on the website pages.
