// https://github.com/v8/v8/wiki/Stack-Trace-API
(function () {

  if (!Error.captureStackTrace) {
  	return;
  }

  var old_prepareStackTrace = Error.prepareStackTrace;

  function module_name(klass) {
    if (klass.$$full_name && klass.$$full_name !== Opal.nil) {
      return klass.$$full_name;
    } else if (klass.$$name && klass.$$name !== Opal.nil) {
      return klass.$$name;
    } else if (klass.displayName && klass.displayName !== Opal.nil) {
      return klass.displayName;
    }
  }

  Error.prepareStackTrace = function (error, frames) {
    var lines = [], frame, line, location, call_name, meth, receiver, i, ii;

    for (i = 0, ii = frames.length; i < ii; i++) {
      frame = frames[i];
      line = []
      line.push("	from")

      location = [
        (frame.getScriptNameOrSourceURL() || (frame.isNative() ? "<native>" : (frame.isEval() ? "(eval)" : "<anonymous>"))),
        frame.getLineNumber(),
        frame.getColumnNumber(),
        'in'
      ].join(':')

      line.push(location);

      meth = frame.getFunction();
      if (meth) {
        call_name = meth.displayName || meth.name;
        var owner = meth.$$owner

        if (call_name && owner) {
          if (owner.$$is_singleton && owner.$$singleton_of.$$is_a_module)
            call_name = [module_name(owner.$$singleton_of), '.', call_name]
          else if (owner.$$is_singleton)
            call_name = [('#<'+module_name(owner.$$singleton_of)+' (singleton)>'), '#', call_name]
          else if (owner.$$is_a_module)
            call_name = [module_name(owner), '#', call_name]

          if (call_name) line.push('`'+call_name.join('')+"'");
        } else {
          if (call_name) line.push('JS<'+frame.getTypeName()+'.'+call_name+">");
        }
      }

      if (!call_name) {
        call_name = frame.getMethodName() || frame.getFunctionName();
        if (call_name) line.push('JS<'+frame.getTypeName()+'.'+call_name+">");
      }

      lines.push(line);
    }

    if (lines.length > 0) {
      lines[0].shift();
      var error_message = (''+error.message) === '' ? error.name : error.message;
      lines[0].push((error.message == null && error.name === 'RuntimeError') ? 'unhandled exception' : ''+error_message+' ('+error.name+')');
    }

    for (i = 0; i < lines.length; i++) {
      lines[i] = lines[i].join(' ');
    }
    return lines.join("\n");
  };

})();

