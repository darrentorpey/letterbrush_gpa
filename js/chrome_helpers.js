window.GPA = {}

GPA.readFile = function(onRead, opts) {
  opts = opts || {};

  errorHandler = opts.onError || function(e) {
    console.log('Error on file read:', e);
  };

  onRead = onRead || function(e) {
    if (opts.verbose) console.log('File reading done', e.target.result);
  };

  var roe;
  chrome.fileSystem.chooseEntry({type: 'openFile'}, function(readOnlyEntry) {
    roe = readOnlyEntry;
    // window.last_readOnlyEntry = readOnlyEntry;
    readOnlyEntry.file(function(file) {
      var reader = new FileReader();

      reader.onerror = errorHandler;
      reader.onloadend = function (e) {
        Editor.current_file = readOnlyEntry;
        onRead(e);
      };

      reader.readAsText(file);
    });
  });
  return roe;
}

GPA.overwriteFile = function(chosenFileEntry, content) {
  opts = opts || {};

  errorHandler = opts.onError || function(e) {
    console.log('Error on file overwrite:', e);
  };
  
  chrome.fileSystem.getWritableEntry(chosenFileEntry, function(writableFileEntry) {
    writableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function() {
        if (opts.verbose) console.log('File truncation complete')
      };

      writer.truncate(content.length);
    }, errorHandler);

    writableFileEntry.createWriter(function(writer) {
      writer.onerror = errorHandler;
      writer.onwriteend = function() {
        if (opts.verbose) console.log('File overwriting complete')
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
        Editor.current_file = writableFileEntry;
      };
      writer.write(new Blob([text], {type: 'text/plain'}));  
    }, errorHandler);
  });
};
