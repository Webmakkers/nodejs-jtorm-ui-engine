/*! (c) jTorm and other contributors | www.jtorm.com/license */

const
  _ = require('lodash'),
  axios = require('axios'),
  util = require('util')
;

// Handlers
const
  {errorHandlerModel} = require('@jtorm/nodejs-error-handler'),
  {jTormHandler} = require('@jtorm/handler'),
  {jTormHandlerWrapper} = require('@jtorm/handler-wrapper')
;

// Methods
const
  {jTormAttrMethod} = require('@jtorm/attr-method'),
  {jTormAttrsMethod} = require('@jtorm/attrs-method'),
  {jTormDataMethod} = require('@jtorm/data-method'),
  {jTormEachMethod} = require('@jtorm/each-method'),
  {jTormFindMethod} = require('@jtorm/find-method'),
  {jTormGetMethod} = require('@jtorm/get-method'),
  {jTormIfMethod} = require('@jtorm/if-method'),
  {jTormInsertMethod} = require('@jtorm/insert-method'),
  {jTormMediaqueryMethod} = require('@jtorm/mediaquery-method'),
  {jTormMediatargetMethod} = require('@jtorm/mediatarget-method'),
  {jTormMoveMethod} = require('@jtorm/move-method'),
  {jTormRemoveMethod} = require('@jtorm/remove-method'),
  {jTormSwapMethod} = require('@jtorm/swap-method'),
  {jTormTextMethod} = require('@jtorm/text-method'),
  {jTormTitleMethod} = require('@jtorm/title-method'),
  {jTormUnwrapMethod} = require('@jtorm/unwrap-method'),
  {jTormWrapMethod} = require('@jtorm/wrap-method'),
  {jTormUiMethod} = require('@jtorm/ui-method')
;

// Method Aliases
class jTormInsertAlias {
  constructor(m) {
    this.m = m;
    this.alias = 'i' + m;
    this.params = ['h', 'd', 'm', 'p', 's', 'cid', 'cs'];
  }

  async handle(v) {
    v.d.m = this.m;
    return await jTormInsertMethod.handle(v);
  }

  validate(v) {
    v.d.m = this.m;
    return jTormInsertMethod.validate(v);
  }
}

const
  jTormAppendMethod = new jTormInsertAlias('a'),
  jTormPrependMethod = new jTormInsertAlias('p'),
  jTormBeforeMethod = new jTormInsertAlias('b'),
  jTormAfterMethod = new jTormInsertAlias('af'),
  jTormReplaceMethod = new jTormInsertAlias('r'),
  jTormInnerMethod = new jTormInsertAlias('i');

// Models
const
  {jTormConfigModel} = require('@jtorm/config-model'),
  {jTormDataModel} = require('@jtorm/data-model'),
  {jTormDocumentModel} = require('@jtorm/document-model'),
  {jTormEventModel} = require('@jtorm/event-model'),
  {jTormHtmlModel} = require('@jtorm/html-model'),
  {jTormLanguageModel} = require('@jtorm/language-model'),
  {jTormRequestModel} = require('@jtorm/request-model'),
  {jTormTssModel} = require('@jtorm/tss-model'),
  {jTormViewModel} = require('@jtorm/view-model'),
  {jTormUiCacheModel} = require('@jtorm/ui-cache-model'),// todo add saveModel
  {JSDOM} = require("jsdom"),
  matchMediaPolyfill = require('mq-polyfill')
;

// Parsers
const
  {jTormTSSParser} = require('@jtorm/tss-parser'),
  {jTormDataParser} = require('@jtorm/data-parser')
;

// Plugins
const
  {jTormUiCachePlugin} = require('@jtorm/ui-cache-plugin')
;

// UI
const
  {jTormHtmlUi} = require("@jtorm/html-ui")
;

const
  handlers = [
    jTormHandler,
    errorHandlerModel,
    jTormHandlerWrapper
  ],
  methods = {
    attr: jTormAttrMethod,
    attrs: jTormAttrsMethod,
    data: jTormDataMethod,
    each: jTormEachMethod,
    find: jTormFindMethod,
    get: jTormGetMethod,
    if: jTormIfMethod,
    insert: jTormInsertMethod,
    append: jTormAppendMethod,
    prepend: jTormPrependMethod,
    replace: jTormReplaceMethod,
    inner: jTormInnerMethod,
    before: jTormBeforeMethod,
    after: jTormAfterMethod,
    mediaquery: jTormMediaqueryMethod,
    mediatarget: jTormMediatargetMethod,
    move: jTormMoveMethod,
    remove: jTormRemoveMethod,
    swap: jTormSwapMethod,
    text: jTormTextMethod,
    title: jTormTitleMethod,
    wrap: jTormWrapMethod,
    unwrap: jTormUnwrapMethod,
    ui: jTormUiMethod
  },
  models = {
    axios: axios,
    config: jTormConfigModel,
    event: jTormEventModel,
    language: jTormLanguageModel,
    tss: jTormTssModel,
    data: jTormDataModel,
    html: jTormHtmlModel,
    document: jTormDocumentModel,
    request: jTormRequestModel,
    view: jTormViewModel,
    uiCache: jTormUiCacheModel
  },
  parsers = [
    jTormTSSParser,
    jTormDataParser
  ],
  plugins = [
    jTormUiCachePlugin
  ]
;


// DI
jTormAttrsMethod.attrMethod = jTormAttrMethod;
jTormViewModel._ = _;
errorHandlerModel.util = util;
jTormDocumentModel.errorHandler = jTormUiMethod.errorHandler = jTormInsertMethod.errorHandler = errorHandlerModel;
jTormViewModel.documentModel = jTormDocumentModel;
jTormAttrsMethod.tssParser = jTormTssModel.tssParser = jTormViewModel.tssParser = jTormDataParser.tssParser = jTormTSSParser;
jTormHandler.dataParser = jTormAttrsMethod.dataParser = jTormDataMethod.dataParser = jTormIfMethod.dataParser = jTormTextMethod.dataParser = jTormDataParser;
jTormEventModel.plugins = plugins;
jTormMediatargetMethod.mediaqueryMethod = jTormMediaqueryMethod;
jTormHandler.eventModel = jTormHandlerWrapper.eventModel = jTormEventModel;
jTormUiMethod.mediatargetMethod = jTormMediatargetMethod;
jTormHandler.methods = jTormEachMethod.methods = jTormMoveMethod.methods = jTormUiMethod.methods = methods;
jTormInsertMethod.viewModel = jTormHandler.viewModel = jTormHandlerWrapper.viewModel = jTormEachMethod.viewModel = jTormAttrsMethod.viewModel = jTormMoveMethod.viewModel = jTormUiMethod.viewModel = jTormViewModel;
jTormHandlerWrapper.handler = jTormEachMethod.handler = jTormIfMethod.handler = jTormSwapMethod.handler = jTormHandler;
jTormInsertMethod.handlerWrapper = jTormEachMethod.handlerWrapper = jTormWrapMethod.handlerWrapper = jTormHandlerWrapper;
jTormGetMethod.models = models;
jTormRequestModel.uiMethod = jTormUiMethod;
jTormRequestModel.axios = axios;
jTormDataModel.requestModel = jTormHtmlModel.requestModel = jTormTssModel.requestModel = jTormRequestModel;
jTormLanguageModel.configModel = jTormConfigModel;
jTormUiCacheModel.saveModel = null;// todo
jTormUiCachePlugin.uiCacheModel = jTormUiCacheModel;

jTormUiMethod.uis = [jTormHtmlUi];

async function jTormInit(url, config, customUiMapper, isDebug) {
  let k, k2;

  if (config) {
    for (k in config) {
      jTormConfigModel.set(k, config[k]);
    }
  }

  if (isDebug) {
    const {jTormDebugPlugin} = require('@jtorm/debug-plugin');
    jTormDebugPlugin.util = errorHandlerModel.util = require('util');
    plugins.push(jTormDebugPlugin);
  }

  jTormHtmlUi.url = url;

  // Window Model
  const {window} = new JSDOM('', {url: url});

  // DI
  models.window = jTormMediaqueryMethod.windowModel = jTormDocumentModel.windowModel = jTormRequestModel.windowModel = window;

  matchMediaPolyfill.default(window);
  window.resizeTo = function resizeTo(width, height) {
    Object.assign(this, {
      innerWidth: width,
      innerHeight: height,
      outerWidth: width,
      outerHeight: height
    });
  };
  window.resizeTo(1366, 768);// set default to most used resolution but not the biggest

  jTormTSSParser.config({});

  // Overrule UI mappers
  jTormUiMethod.ui = {
    mapper: customUiMapper
    // {
    //   typography: {
    //     h1: {
    //       ui: {
    //         c: "@t.h1"
    //       },
    //       t: ['ui/tss/typography/heading-1.tss']
    //     }
    //   }
    // }
  };

  jTormUiMethod.framework = 'html';

  const
    r = [
      handlers,
      methods,
      models,
      parsers,
      plugins
    ]
  ;

  // Init
  for (k in r) {
    for (k2 in r[k]) {
      if (r[k][k2] && typeof r[k][k2].init === 'function') {
        await r[k][k2].init(jTormHandler);
      }
    }
  }
}

module.exports = async (url, config, customUiMapper, isDebug) => {
  await jTormInit(url, config, customUiMapper, isDebug);
};
