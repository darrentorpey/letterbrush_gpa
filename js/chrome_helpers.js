window.GPA = {}

GPA.readFile = function(onRead, opts) {
  opts = opts || {};

  errorHandler = opts.onError || function(e) {
    console.log('Error on file read:', e);
  };

  onRead = onRead || function(e) {
    console.log('Result', e.target.result);
  };

  var roe;
  chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
    roe = readOnlyEntry;
    Editor.current_file = readOnlyEntry;
    // window.last_readOnlyEntry = readOnlyEntry;
    readOnlyEntry.file(function(file) {
      var reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onloadend = onRead;

      reader.readAsText(file);
    });
  });
  return roe;
}

GPA.overwriteFile = function(chosenFileEntry, content) {

  errorHandler = opts.onError || function(e) {
    console.log('Error on file overwrite:', e);
  };
  
  chrome.fileSystem.getWritableEntry(chosenFileEntry, function(writableFileEntry) {
    writableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function() {
        console.log('done truncating!')
      };

      writer.truncate(content.length);
    }, errorHandler);

    writableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function() {
        console.log('done overwriting!')
      };

      writer.write(new Blob([content], {type: 'text/plain'}));
      // chosenFileEntry.file(function(file) {
      //   writer.write(file);
      // });   
    }, errorHandler);
  });
}

GPA.writeNewFile = function(text, opts) {
  opts = opts || {};
  _.defaults(opts, {
    verbose: false
  });

  errorHandler = opts.onError || function(e) {
    console.log('Error on file write:', e);
  }

  chrome.fileSystem.chooseEntry({type: 'saveFile'}, function(writableFileEntry) {
    writableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function(e) {
        if (opts.verbose) console.log('File write complete', e);
      };
      writer.write(new Blob([text], {type: 'text/plain'}));  
    }, errorHandler);
  });
};
