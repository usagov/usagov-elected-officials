# USA.gov Elected Officials Repo
Find useful information on your local and federal level elected officials by typing in an address. More info to come.

## To Preview
Pull this repository, start a local web server, and then visit `localhost:8000` in your browser.

To start a local web server, run one of the following commands in the working directory:

#### Python 3.x
```python -m http.server 8000
```

#### Python 2.x
```python -m SimpleHTTPServer 8000
```

## Development
If gulp is not installed on your computer, you will have to run this command:

```bash
npm install gulp-cli -g
```

Because we are using node, simply run this command next:
```bash
npm install
```

If you would like to make additions to this project make sure to run:

```bash
gulp watch
```

This ensures that any changes made anywhere are reflected correctly on the page.

