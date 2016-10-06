# Whisper.ws
### Easy, secure sharing through one-time URL's

## Intro
Whisper.ws is a service which makes it easy to securely share content through the use of "one-time URL's". A one-time URL is a link that can only be viewed once. This ensures that once the content has been viewed, no one else can view it. This SDK makes it easy to create and read these one-time URL's programmatically.

## FAQ
Read more at https://www.whisper.ws/about 

## Usage
### Developer Token
This whisper.ws SDK comes with a token included. This can be found in the file ./config/whisper.json. This is rate limited by IP address and will allow for basic testing. Scale / production use is coming soon. For more details, contact support@whisper.ws.

### Initializing
Use the following code to initialize the Whisper class:
```
var Whisper = require('whisper-ws');
var whisper = new Whisper(config);
```
config can be set by referencing the already included sample file '/config/whisper.json' in the repo (which contains the free token). Alternatively, just use the following free token:
```
var Whisper = require('whisper-ws')
var whisper = new Whisper({"token": "Ngb1yfg!gbakeIgbE3!ngjqugBhHgfqe"});
```

### API
Once you have your object, you can now call one of the methods:
#### Set
To send a secret to the service and receive a one-time URL:
```
whisper.set('my secret text', (err, result) => {
    if (err) console.log(err);
    console.log(result);
});
```
Sucessful calls will return a result object in the following format:
```
{
    "key": "1uU9sCBogUm3tumxx53mpw" 
    "webUrl": "https://www.whisper.ws/i/1uU9sCBogUm3tumxx53mpw"  
    "apiUrl": "https://www.whisper.ws/v1.0/url/1uU9sCBogUm3tumxx53mpw"
}
```
The meaning of each of these:
- key: the unique one-time secret key (appending to the following URL's)
- webUrl: the one-time URL which you can view the secret at from a web browser
- apiUrl: the one-time URL which you can use to view the secret via the REST API's

#### Get
After setting a secret, you can retreive it from the service by passing in the 'key' value above to the method whisper.get. For example, the following would set a secret and then retrieve it immediately after:
```
whisper.set('my secret text', (err, result) => {
    if (err) console.log(err);
    console.log(result);
    whisper.get(result.key, (err, result) => {
        if (err) console.log(err);
        console.log(result);
    });
});

```
Sucessful calls will return a result object in the following format:
```
{
    "secret":"my secret text"
}
```

#### Erorrs
Errors take the following format:
```
{
    statusCode: 429,
    message: "Developer token limit exceeded. Try again in a short while" 
}
```    
The following are valid errors:

| statusCode  | message | 
| ------------- | :-------------: |
| 401 | Incorrect token | 
| 404 | No secret found at this URL | 
| 410 | Expired. Secret already retrieved | 
| 413 | Max content size exceeded | 
| 429 | IP address rate limit exceeded. Try again in a short while | 


### Running tests
To run the tests, go to the root directory of node-whisper and:

1. Ensure you have mocha installed ("npm i mocha -g")
2. From the root directory, run "mocha --debug test"


## Console Line Interface (CLI)
Included in this package is also a console app. To install the console app, run:
```
npm install -g whisper-ws
```

This will install the whisper-ws console app which can then be used to create a one-time URL directly from the command line. For example:

Supported options for the CLI include:

```

  Options:

    -h, --help                 output usage information
    -f, --file [file]          the filename to send to whisper.ws
    -t, --text [text]          provide a string rather than a file
    -u, --url [url]            optional: overrides destination server (developers only)
    -e, --encoding [encoding]  optional: specifies encoding (default is utf-8
```
### Example
```
whisper-ws --file readme.md 
```
would return:
```
https://www.whisper.ws/i/H11Pws7gWOnTRa7EsaCtz3VOesNQ
```

## Terms and Conditions
Before any usage, read the whisper.ws terms and privacy policy at www.whisper.ws


## License

This software is licensed under the Apache 2 license, quoted below.

    Copyright (c) 2016 Rivolv, Inc 

    Licensed under the Apache License, Version 2.0 (the "License");
    you may not use this file except in compliance with the License.
    You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

    Unless required by applicable law or agreed to in writing, software
    distributed under the License is distributed on an "AS IS" BASIS,
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
    See the License for the specific language governing permissions and
    limitations under the License.

