# &lt;starcounter-debug-aid&gt;

Friendly messages that help to debug Starcounter apps

Currently composed of:

- `fast-json-patch-error-reporter` - shows incorrect JSON-Patches (the incorrect patch and the expanable JSON tree)
- `juicy-error-stacktrace-reporter` - shows uncatched errors (stack traces)
- `puppet-js-listener.js` - subscribes to puppet-client patchreceived & patchsent events. Has shared `getPuppetClient` method.
- `puppet-js-patches.html` - shows JSON-Patches log from PuppetListenter.