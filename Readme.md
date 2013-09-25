# slidedeck-pdf.js

Renders Keynote generated PDF-Slidedecks in your browser, with a focus on 
speakernotes - An experimental javascript project based on pdf.js

## A story
When Christophe came back from MobX conference where he gave a talk he
promised to publish his slidedeck online. Existing tools like slideshare or
speakerdeck did not match our needs. Though we like the simplicity of uploading
just one file, we where not happy with how these plattforms treat the speakernotes - 
which are important bits of information, especially on image-rich presentations.
Also, we wanted a more integrated way to embed slidedeck content on our website.

# Usage

Check out the [live demo](http://preciousforever.github.io/slidedeck-pdf.js/)

# Next up

- [x] scaling
- [x] loading incator  
  could be realized via a callback
- [ ] remove jquery and History.js dependency
- [ ] better API
- [ ] links on slides (as seen in pdf.js viewer code)
- [ ] SpeakerNoteParser should anaylse and keep line breaks


# Development

## Dependencies

- node
- npm
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
node vendor/pdf.js/make generic
```

## Watch

to update the example on the fly

```
grunt watch
```

## Build

```
grunt build
```
