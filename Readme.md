# slidedeck-pdf.js

Renders Keynote generated PDF-Slidedecks in your browser, with a focus on 
speakernotes - An experimental javascript glue between pdf.js and swipejs

## A story
When Christophe came back from MobX conferences where he gave a presentation he
promised to publish his slidedeck online. Existing tools like slideshare or
speakerdeck did not match our needs. Though we like the simplicity of uploading
just one file, we where not happy with how these platform treat the speakernotes - 
which are important bits of information, especially on image-rich presentations.
Also, we wanted a more integrated way to embed the content on our website.

# Usage

- not yet usable -

# Development

## Dependencies

- gruntjs
- bower

## Installation

```
git clone ...
cd slidedeck-pdf.js
git submodule init
git submodule update
npm install
bower install
```

## Build

```
node vendor/pdf.js/make generic
grunt build
```