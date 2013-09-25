(function() {

var SpeakerNotesParser = function(settings) {
  this.init(settings);
};
SpeakerNotesParser.prototype = {

  parsed: false,
  layoutDone: false,
  init: function(settings) {
    this.cb = settings.cb || function noop() {};
    this.size = settings.size || {width: 0, height: 0};
    this.scale = settings.scale || 1;
  },

  beginLayout: function speakerNoteParserBeginLayout() {
    this.geoms = [];
    this.textContent = false;
  },

  endLayout: function speakerNoteParserEndLayout() {
    this.layoutDone = true;
    this.analyseGeomsAndTextContent();
  },

  appendText: function speakerNoteParserAppendText(geom) {
    this.geoms.push(geom);
  },

  setTextContent: function speakerNoteParserSetTextContent(textContent) {
    this.textContent = textContent;
    this.analyseGeomsAndTextContent();
  },

  analyseGeomsAndTextContent: function speakerNoteParserAnalyseGeomsAndTextContent() {
    if(this.parsed) {
      return;
    }
    if(!this.textContent || !this.layoutDone) {
      return;
    }
    this.parsed = true;

    var bidiTexts = this.textContent.bidiTexts;
    var geoms = this.geoms;
    var speakerNotes = '';

    for (var i = 0; i < bidiTexts.length; i++) {
      var bidiText = bidiTexts[i];
      var geom = geoms[i];

      if (!/\S/.test(bidiText.str)) {
        continue;
      }

      if(geom.y > this.size.height * this.scale) {
        //@todo: 
        speakerNotes += bidiText.str + "\n";
      }
    }

    this.cb(speakerNotes);
  }

};

window.SlidedeckPdfJs = SlidedeckPdfJs = function(settings) {
  this.init(settings);
};

SlidedeckPdfJs.prototype = {
  current: 0,
  total: 0,
  init: function(settings) {

    this.$presentation = settings.slidedeck;
    this.$speakernotes = settings.speakernotes;

    this.pdfUrl = settings.file;
    this.size = settings.size;
    this.scale = settings.scale || 1;

    this.markdown = (settings.markdown && (typeof(markdown) != 'undefined')) || false;
    this.afterRender = settings.afterRender || function noop() {};

    this.buildViewer();

  },

  nextSlide: function() {

    this.gotoSlide(this.current + 1);
  },

  previousSlide: function() {
    this.gotoSlide(this.current - 1);
  },

  buildViewer: function() {

    var self = this;
    // create dom for slideshow
    this.$slidedeck = $('<div class="slidedeck"><div class="slide"><canvas></canvas></div></div>');
    this.$presentation.html('').append(this.$slidedeck);

    this.$presentation.find('.slide').click(function(e) {
      e.preventDefault();
      if(e.pageX > $(window).width() / 2) {
        self.gotoSlide(self.current + 1);
      } else {
        self.gotoSlide(self.current - 1);
      }
      
    });

    function resovleState() {
      var State = History.getState();
      var pageNum = State.data.state || 1;
      self.showSlide(pageNum);
    }
    History.Adapter.bind(window,'statechange', resovleState);
    // download pdf
    PDFJS.getDocument(this.pdfUrl).then(function gotPdf(_pdfDoc) {
      self.pdfDoc = _pdfDoc;
      resovleState();
    });
  },

  gotoSlide: function(num) {
    History.pushState({state: num}, "Slide " + num, "?slide=" + num);
  },

  showSlide: function(num) {
    this.current = num;
    
    //render current,
    //this.renderSlide(num, this.$presentation.find('.slide').eq(num - 1));
    this.renderSlide(num, this.$presentation.find('.slide').eq(0));
    // then next

    // the previous page

  },

  rerender: function() {
    this.showSlide(this.current);
  },

  renderSlide: function(num, $el) {
    // render function
    var self = this;
    this.total = this.pdfDoc.pdfInfo.numPages;
    this.pdfDoc.getPage(num).then(function(page) {

      var canvas = $el.find('canvas')[0];
      var viewport = page.getViewport(self.scale);
      var ctx = canvas.getContext('2d');
      canvas.height = self.size.height * self.scale;
      canvas.width = self.size.width * self.scale;

      var speakerNotesParser = new SpeakerNotesParser({
        size: self.size,
        scale: self.scale,
        cb: function(text) {
          self.renderSpeakerNotes(text);
        }
      });

      var renderContext = {
          canvasContext: ctx,
          textLayer: speakerNotesParser,
          viewport: viewport
      };

      var rendered = false;
      var gotTextContent = false;
      function onceRenderedAndTextContent() {
        console.log('onceRenderedAndTextContent');
        if(!rendered || !gotTextContent) {
          console.log("chj", rendered, gotTextContent);
          return;
        }
        self.afterRender();
      };
      page.render(renderContext).then(function afterRender() {
        rendered = true;
        onceRenderedAndTextContent();
      });;

      page.getTextContent().then(function textContentResolved(textContent) {
        speakerNotesParser.setTextContent(textContent);
        gotTextContent = true;
        onceRenderedAndTextContent();
      });
    });
  },

  renderSpeakerNotes: function(notes) {
    if(this.markdown) {
      this.$speakernotes.html(markdown.toHTML(notes));
    } else {
      this.$speakernotes.text(notes);
    }
  }

};

}());