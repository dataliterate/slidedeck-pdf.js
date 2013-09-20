var SlidedeckPdfJs = window.SlidedeckPdfJs = {};

SlidedeckPdfJs = {
  current: 0,
  init: function(settings) {
    PDFJS.workerSrc = Precious.base + 'js/pdf.worker.js';

    // 1. look for elements precious-presentation class
    this.$presentation = $('.precious-presentation');

    // read source of pdf, json (with speakernotes) and poster image
    this.pdfUrl = this.$presentation.find('a').attr('href');

    // show poster image

    // if touch / mobile / slow devices
    // --> display link to pdf download

    // else build slidedeck viewer
    this.buildViewer();

  },

  buildViewer: function() {

    var self = this;
    // create dom for slideshow
    this.$slidedeck = $('<div class="slidedeck"><div class="slide"><canvas></canvas></div></div>');
    this.$presentation.html('').append(this.$slidedeck);

    this.$presentation.find('.slide').click(function(e) {
      e.preventDefault();
      if(e.pageX > $(window).width() / 2) {
        self.gotoPage(self.current + 1);
      } else {
        self.gotoPage(self.current - 1);
      }
      
    });

    function resovleState() {
      var State = History.getState();
      var pageNum = State.data.state || 1;
      self.showPage(pageNum);
    }
    History.Adapter.bind(window,'statechange', resovleState);

    // download pdf
    PDFJS.getDocument(this.pdfUrl).then(function gotPdf(_pdfDoc) {
      self.pdfDoc = _pdfDoc;
      resovleState();
    });
  },

  gotoPage: function(num) {
    History.pushState({state: num}, "Page " + num, "?page=" + num);
  },

  showPage: function(num) {
    this.current = num;
    
    console.log("show page " + num);
    //render current,
    //this.renderSlide(num, this.$presentation.find('.slide').eq(num - 1));
    this.renderSlide(num, this.$presentation.find('.slide').eq(0));
    // then next

    // the previous page

  },

  renderSlide: function(num, $el) {
    // render function
    console.log($el);
    this.pdfDoc.getPage(num).then(function(page) {

      var canvas = $el.find('canvas')[0];
      var viewport = page.getViewport($el.width() / 1280);
      var ctx = canvas.getContext('2d');
      canvas.height = viewport.height;
      canvas.width = viewport.width;

      var renderContext = {
          canvasContext: ctx,
          viewport: viewport
      };
      page.render(renderContext);
    })
  },

  renderSpeakerNotes: function(num) {

  }

}

//  And bind loading
$(document).ready(function() {
  Precious.Presentation.init();
});
