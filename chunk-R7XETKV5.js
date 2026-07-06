import{a as bn,b as Ut}from"./chunk-DJUNN3JF.js";import{b as Yt,c as hn}from"./chunk-EJTJJZWI.js";import{a as fn}from"./chunk-ZBZ7Z4UH.js";import{a as dt}from"./chunk-GL3Q3Y6W.js";import{d as pn}from"./chunk-CHBJKDPS.js";import{b as dn,g as mn}from"./chunk-IT3GR6N4.js";import{h as un}from"./chunk-3G3VZDDF.js";import{$a as nn,Ab as vt,C as At,Cb as rn,Da as en,Db as _e,E as It,Eb as ge,F as Ge,Gb as W,H as st,Ha as c,Ib as sn,Jb as m,Kb as g,Lb as v,M as _,Ma as tt,Na as Pt,Oa as K,P as w,Pa as Bt,Q as qe,R as r,Sa as pe,Ta as he,U as ct,W as A,Wa as B,Wb as p,X as I,Xb as h,Y as P,Ya as V,Z as M,_a as et,a as He,aa as lt,ac as G,ba as R,c as Ye,d as S,db as Ft,e as Ue,eb as Nt,fa as H,fb as Y,fc as cn,gb as U,h as Mt,hc as nt,ib as on,ic as ln,jb as Lt,jc as Ht,ka as ue,kb as Vt,m as X,ma as L,mb as jt,n as We,nb as gt,oa as Qe,ob as an,pb as l,q as Xe,qa as Je,qb as d,ra as Tt,rb as E,sa as tn,sb as $,tb as zt,u as Ot,w as $e,wb as fe,x as Ze,xb as D,y as Ke,yb as y,zb as be}from"./chunk-BIVB43NZ.js";import{a as C,b as ze}from"./chunk-EQDQRRRY.js";function yt(i){return i.buttons===0||i.detail===0}function xt(i){let n=i.touches&&i.touches[0]||i.changedTouches&&i.changedTouches[0];return!!n&&n.identifier===-1&&(n.radiusX==null||n.radiusX===1)&&(n.radiusY==null||n.radiusY===1)}var ve;function _n(){if(ve==null){let i=typeof document<"u"?document.head:null;ve=!!(i&&(i.createShadowRoot||i.attachShadow))}return ve}function ye(i){if(_n()){let n=i.getRootNode?i.getRootNode():null;if(typeof ShadowRoot<"u"&&ShadowRoot&&n instanceof ShadowRoot)return n}return null}function F(i){return i.composedPath?i.composedPath()[0]:i.target}var xe;try{xe=typeof Intl<"u"&&Intl.v8BreakIterator}catch(i){xe=!1}var N=(()=>{class i{_platformId=r(Je);isBrowser=this._platformId?mn(this._platformId):typeof document=="object"&&!!document;EDGE=this.isBrowser&&/(edge)/i.test(navigator.userAgent);TRIDENT=this.isBrowser&&/(msie|trident)/i.test(navigator.userAgent);BLINK=this.isBrowser&&!!(window.chrome||xe)&&typeof CSS<"u"&&!this.EDGE&&!this.TRIDENT;WEBKIT=this.isBrowser&&/AppleWebKit/i.test(navigator.userAgent)&&!this.BLINK&&!this.EDGE&&!this.TRIDENT;IOS=this.isBrowser&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!("MSStream"in window);FIREFOX=this.isBrowser&&/(firefox|minefield)/i.test(navigator.userAgent);ANDROID=this.isBrowser&&/android/i.test(navigator.userAgent)&&!this.TRIDENT;SAFARI=this.isBrowser&&/safari/i.test(navigator.userAgent)&&this.WEBKIT;constructor(){}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var wt;function gn(){if(wt==null&&typeof window<"u")try{window.addEventListener("test",null,Object.defineProperty({},"passive",{get:()=>wt=!0}))}finally{wt=wt||!1}return wt}function mt(i){return gn()?i:!!i.capture}function q(i){return i instanceof L?i.nativeElement:i}var vn=new w("cdk-input-modality-detector-options"),yn={ignoreKeys:[18,17,224,91,16]},xn=650,we={passive:!0,capture:!0},wn=(()=>{class i{_platform=r(N);_listenerCleanups;modalityDetected;modalityChanged;get mostRecentModality(){return this._modality.value}_mostRecentTarget=null;_modality=new Ue(null);_options;_lastTouchMs=0;_onKeydown=t=>{this._options?.ignoreKeys?.some(e=>e===t.keyCode)||(this._modality.next("keyboard"),this._mostRecentTarget=F(t))};_onMousedown=t=>{Date.now()-this._lastTouchMs<xn||(this._modality.next(yt(t)?"keyboard":"mouse"),this._mostRecentTarget=F(t))};_onTouchstart=t=>{if(xt(t)){this._modality.next("keyboard");return}this._lastTouchMs=Date.now(),this._modality.next("touch"),this._mostRecentTarget=F(t)};constructor(){let t=r(R),e=r(M),o=r(vn,{optional:!0});if(this._options=C(C({},yn),o),this.modalityDetected=this._modality.pipe(It(1)),this.modalityChanged=this.modalityDetected.pipe(Ke()),this._platform.isBrowser){let a=r(K).createRenderer(null,null);this._listenerCleanups=t.runOutsideAngular(()=>[a.listen(e,"keydown",this._onKeydown,we),a.listen(e,"mousedown",this._onMousedown,we),a.listen(e,"touchstart",this._onTouchstart,we)])}}ngOnDestroy(){this._modality.complete(),this._listenerCleanups?.forEach(t=>t())}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Et=(function(i){return i[i.IMMEDIATE=0]="IMMEDIATE",i[i.EVENTUAL=1]="EVENTUAL",i})(Et||{}),En=new w("cdk-focus-monitor-default-options"),Wt=mt({passive:!0,capture:!0}),Ee=(()=>{class i{_ngZone=r(R);_platform=r(N);_inputModalityDetector=r(wn);_origin=null;_lastFocusOrigin=null;_windowFocused=!1;_windowFocusTimeoutId;_originTimeoutId;_originFromTouchInteraction=!1;_elementInfo=new Map;_monitoredElementCount=0;_rootNodeFocusListenerCount=new Map;_detectionMode;_windowFocusListener=()=>{this._windowFocused=!0,this._windowFocusTimeoutId=setTimeout(()=>this._windowFocused=!1)};_document=r(M);_stopInputModalityDetector=new S;constructor(){let t=r(En,{optional:!0});this._detectionMode=t?.detectionMode||Et.IMMEDIATE}_rootNodeFocusAndBlurListener=t=>{let e=F(t);for(let o=e;o;o=o.parentElement)t.type==="focus"?this._onFocus(t,o):this._onBlur(t,o)};monitor(t,e=!1){let o=q(t);if(!this._platform.isBrowser||o.nodeType!==1)return Mt();let a=ye(o)||this._document,s=this._elementInfo.get(o);if(s)return e&&(s.checkChildren=!0),s.subject;let u={checkChildren:e,subject:new S,rootNode:a};return this._elementInfo.set(o,u),this._registerGlobalListeners(u),u.subject}stopMonitoring(t){let e=q(t),o=this._elementInfo.get(e);o&&(o.subject.complete(),this._setClasses(e),this._elementInfo.delete(e),this._removeGlobalListeners(o))}focusVia(t,e,o){let a=q(t),s=this._document.activeElement;a===s?this._getClosestElementsInfo(a).forEach(([u,f])=>this._originChanged(u,e,f)):(this._setOrigin(e),typeof a.focus=="function"&&a.focus(o))}ngOnDestroy(){this._elementInfo.forEach((t,e)=>this.stopMonitoring(e))}_getWindow(){return this._document.defaultView||window}_getFocusOrigin(t){return this._origin?this._originFromTouchInteraction?this._shouldBeAttributedToTouch(t)?"touch":"program":this._origin:this._windowFocused&&this._lastFocusOrigin?this._lastFocusOrigin:t&&this._isLastInteractionFromInputLabel(t)?"mouse":"program"}_shouldBeAttributedToTouch(t){return this._detectionMode===Et.EVENTUAL||!!t?.contains(this._inputModalityDetector._mostRecentTarget)}_setClasses(t,e){t.classList.toggle("cdk-focused",!!e),t.classList.toggle("cdk-touch-focused",e==="touch"),t.classList.toggle("cdk-keyboard-focused",e==="keyboard"),t.classList.toggle("cdk-mouse-focused",e==="mouse"),t.classList.toggle("cdk-program-focused",e==="program")}_setOrigin(t,e=!1){this._ngZone.runOutsideAngular(()=>{if(this._origin=t,this._originFromTouchInteraction=t==="touch"&&e,this._detectionMode===Et.IMMEDIATE){clearTimeout(this._originTimeoutId);let o=this._originFromTouchInteraction?xn:1;this._originTimeoutId=setTimeout(()=>this._origin=null,o)}})}_onFocus(t,e){let o=this._elementInfo.get(e),a=F(t);!o||!o.checkChildren&&e!==a||this._originChanged(e,this._getFocusOrigin(a),o)}_onBlur(t,e){let o=this._elementInfo.get(e);!o||o.checkChildren&&t.relatedTarget instanceof Node&&e.contains(t.relatedTarget)||(this._setClasses(e),this._emitOrigin(o,null))}_emitOrigin(t,e){t.subject.observers.length&&this._ngZone.run(()=>t.subject.next(e))}_registerGlobalListeners(t){if(!this._platform.isBrowser)return;let e=t.rootNode,o=this._rootNodeFocusListenerCount.get(e)||0;o||this._ngZone.runOutsideAngular(()=>{e.addEventListener("focus",this._rootNodeFocusAndBlurListener,Wt),e.addEventListener("blur",this._rootNodeFocusAndBlurListener,Wt)}),this._rootNodeFocusListenerCount.set(e,o+1),++this._monitoredElementCount===1&&(this._ngZone.runOutsideAngular(()=>{this._getWindow().addEventListener("focus",this._windowFocusListener)}),this._inputModalityDetector.modalityDetected.pipe(st(this._stopInputModalityDetector)).subscribe(a=>{this._setOrigin(a,!0)}))}_removeGlobalListeners(t){let e=t.rootNode;if(this._rootNodeFocusListenerCount.has(e)){let o=this._rootNodeFocusListenerCount.get(e);o>1?this._rootNodeFocusListenerCount.set(e,o-1):(e.removeEventListener("focus",this._rootNodeFocusAndBlurListener,Wt),e.removeEventListener("blur",this._rootNodeFocusAndBlurListener,Wt),this._rootNodeFocusListenerCount.delete(e))}--this._monitoredElementCount||(this._getWindow().removeEventListener("focus",this._windowFocusListener),this._stopInputModalityDetector.next(),clearTimeout(this._windowFocusTimeoutId),clearTimeout(this._originTimeoutId))}_originChanged(t,e,o){this._setClasses(t,e),this._emitOrigin(o,e),this._lastFocusOrigin=e}_getClosestElementsInfo(t){let e=[];return this._elementInfo.forEach((o,a)=>{(a===t||o.checkChildren&&a.contains(t))&&e.push([a,o])}),e}_isLastInteractionFromInputLabel(t){let{_mostRecentTarget:e,mostRecentModality:o}=this._inputModalityDetector;if(o!=="mouse"||!e||e===t||t.nodeName!=="INPUT"&&t.nodeName!=="TEXTAREA"||t.disabled)return!1;let a=t.labels;if(a){for(let s=0;s<a.length;s++)if(a[s].contains(e))return!0}return!1}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Xt=new WeakMap,Q=(()=>{class i{_appRef;_injector=r(P);_environmentInjector=r(ct);load(t){let e=this._appRef=this._appRef||this._injector.get(Ft),o=Xt.get(e);o||(o={loaders:new Set,refs:[]},Xt.set(e,o),e.onDestroy(()=>{Xt.get(e)?.refs.forEach(a=>a.destroy()),Xt.delete(e)})),o.loaders.has(t)||(o.loaders.add(t),o.refs.push(Ht(t,{environmentInjector:this._environmentInjector})))}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var $t;function ti(){if($t===void 0&&($t=null,typeof window<"u")){let i=window;i.trustedTypes!==void 0&&($t=i.trustedTypes.createPolicy("angular#components",{createHTML:n=>n}))}return $t}function ei(i){return ti()?.createHTML(i)||i}function kn(i,n,t){let e=t.sanitize(en.HTML,n);i.innerHTML=ei(e||"")}function kt(i){return Array.isArray(i)?i:[i]}var Cn=new Set,it,Zt=(()=>{class i{_platform=r(N);_nonce=r(tn,{optional:!0});_matchMedia;constructor(){this._matchMedia=this._platform.isBrowser&&window.matchMedia?window.matchMedia.bind(window):ii}matchMedia(t){return(this._platform.WEBKIT||this._platform.BLINK)&&ni(t,this._nonce),this._matchMedia(t)}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function ni(i,n){if(!Cn.has(i))try{it||(it=document.createElement("style"),n&&it.setAttribute("nonce",n),it.setAttribute("type","text/css"),document.head.appendChild(it)),it.sheet&&(it.sheet.insertRule(`@media ${i} {body{ }}`,0),Cn.add(i))}catch(t){console.error(t)}}function ii(i){return{matches:i==="all"||i==="",media:i,addListener:()=>{},removeListener:()=>{}}}var ke=(()=>{class i{_mediaMatcher=r(Zt);_zone=r(R);_queries=new Map;_destroySubject=new S;constructor(){}ngOnDestroy(){this._destroySubject.next(),this._destroySubject.complete()}isMatched(t){return Sn(kt(t)).some(o=>this._registerQuery(o).mql.matches)}observe(t){let o=Sn(kt(t)).map(s=>this._registerQuery(s).observable),a=We(o);return a=Xe(a.pipe(Ze(1)),a.pipe(It(1),$e(0))),a.pipe(X(s=>{let u={matches:!1,breakpoints:{}};return s.forEach(({matches:f,query:k})=>{u.matches=u.matches||f,u.breakpoints[k]=f}),u}))}_registerQuery(t){if(this._queries.has(t))return this._queries.get(t);let e=this._mediaMatcher.matchMedia(t),a={observable:new Ye(s=>{let u=f=>this._zone.run(()=>s.next(f));return e.addListener(u),()=>{e.removeListener(u)}}).pipe(Ge(e),X(({matches:s})=>({query:t,matches:s})),st(this._destroySubject)),mql:e};return this._queries.set(t,a),a}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function Sn(i){return i.map(n=>n.split(",")).reduce((n,t)=>n.concat(t)).map(n=>n.trim())}var Rn=new w("liveAnnouncerElement",{providedIn:"root",factory:()=>null}),Dn=new w("LIVE_ANNOUNCER_DEFAULT_OPTIONS"),ai=0,Ce=(()=>{class i{_ngZone=r(R);_defaultOptions=r(Dn,{optional:!0});_liveElement;_document=r(M);_sanitizer=r(pn);_previousTimeout;_currentPromise;_currentResolve;constructor(){let t=r(Rn,{optional:!0});this._liveElement=t||this._createLiveElement()}announce(t,...e){let o=this._defaultOptions,a,s;return e.length===1&&typeof e[0]=="number"?s=e[0]:[a,s]=e,this.clear(),clearTimeout(this._previousTimeout),a||(a=o&&o.politeness?o.politeness:"polite"),s==null&&o&&(s=o.duration),this._liveElement.setAttribute("aria-live",a),this._liveElement.id&&this._exposeAnnouncerToModals(this._liveElement.id),this._ngZone.runOutsideAngular(()=>(this._currentPromise||(this._currentPromise=new Promise(u=>this._currentResolve=u)),clearTimeout(this._previousTimeout),this._previousTimeout=setTimeout(()=>{!t||typeof t=="string"?this._liveElement.textContent=t:kn(this._liveElement,t,this._sanitizer),typeof s=="number"&&(this._previousTimeout=setTimeout(()=>this.clear(),s)),this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0},100),this._currentPromise))}clear(){this._liveElement&&(this._liveElement.textContent="")}ngOnDestroy(){clearTimeout(this._previousTimeout),this._liveElement?.remove(),this._liveElement=null,this._currentResolve?.(),this._currentPromise=this._currentResolve=void 0}_createLiveElement(){let t="cdk-live-announcer-element",e=this._document.getElementsByClassName(t),o=this._document.createElement("div");for(let a=0;a<e.length;a++)e[a].remove();return o.classList.add(t),o.classList.add("cdk-visually-hidden"),o.setAttribute("aria-atomic","true"),o.setAttribute("aria-live","polite"),o.id=`cdk-live-announcer-${ai++}`,this._document.body.appendChild(o),o}_exposeAnnouncerToModals(t){let e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<e.length;o++){let a=e[o],s=a.getAttribute("aria-owns");s?s.indexOf(t)===-1&&a.setAttribute("aria-owns",s+" "+t):a.setAttribute("aria-owns",t)}}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Se={},ot=class i{_appId=r(Qe);static _infix=`a${Math.floor(Math.random()*1e5).toString()}`;getId(n,t=!1){return this._appId!=="ng"&&(n+=this._appId),Se.hasOwnProperty(n)||(Se[n]=0),`${n}${t?i._infix+"-":""}${Se[n]++}`}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})};var Mn={XSmall:"(max-width: 599.98px)",Small:"(min-width: 600px) and (max-width: 959.98px)",Medium:"(min-width: 960px) and (max-width: 1279.98px)",Large:"(min-width: 1280px) and (max-width: 1919.98px)",XLarge:"(min-width: 1920px)",Handset:"(max-width: 599.98px) and (orientation: portrait), (max-width: 959.98px) and (orientation: landscape)",Tablet:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait), (min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",Web:"(min-width: 840px) and (orientation: portrait), (min-width: 1280px) and (orientation: landscape)",HandsetPortrait:"(max-width: 599.98px) and (orientation: portrait)",TabletPortrait:"(min-width: 600px) and (max-width: 839.98px) and (orientation: portrait)",WebPortrait:"(min-width: 840px) and (orientation: portrait)",HandsetLandscape:"(max-width: 959.98px) and (orientation: landscape)",TabletLandscape:"(min-width: 960px) and (max-width: 1279.98px) and (orientation: landscape)",WebLandscape:"(min-width: 1280px) and (orientation: landscape)"};function Re(){return typeof __karma__<"u"&&!!__karma__||typeof jasmine<"u"&&!!jasmine||typeof jest<"u"&&!!jest||typeof Mocha<"u"&&!!Mocha}function at(i){return i==null?"":typeof i=="string"?i:`${i}px`}var ri=new w("cdk-dir-doc",{providedIn:"root",factory:()=>r(M)}),si=/^(ar|ckb|dv|he|iw|fa|nqo|ps|sd|ug|ur|yi|.*[-_](Adlm|Arab|Hebr|Nkoo|Rohg|Thaa))(?!.*[-_](Latn|Cyrl)($|-|_))($|-|_)/i;function ci(i){let n=i?.toLowerCase()||"";return n==="auto"&&typeof navigator<"u"&&navigator?.language?si.test(navigator.language)?"rtl":"ltr":n==="rtl"?"rtl":"ltr"}var On=(()=>{class i{get value(){return this.valueSignal()}valueSignal=H("ltr");change=new lt;constructor(){let t=r(ri,{optional:!0});if(t){let e=t.body?t.body.dir:null,o=t.documentElement?t.documentElement.dir:null;this.valueSignal.set(ci(e||o||"ltr"))}}ngOnDestroy(){this.change.complete()}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var Ct=class{_attachedHost=null;attach(n){return this._attachedHost=n,n.attach(this)}detach(){let n=this._attachedHost;n!=null&&(this._attachedHost=null,n.detach())}get isAttached(){return this._attachedHost!=null}setAttachedHost(n){this._attachedHost=n}},ut=class extends Ct{component;viewContainerRef;injector;projectableNodes;bindings;constructor(n,t,e,o,a){super(),this.component=n,this.viewContainerRef=t,this.injector=e,this.projectableNodes=o,this.bindings=a||null}},pt=class extends Ct{templateRef;viewContainerRef;context;injector;constructor(n,t,e,o){super(),this.templateRef=n,this.viewContainerRef=t,this.context=e,this.injector=o}get origin(){return this.templateRef.elementRef}attach(n,t=this.context){return this.context=t,super.attach(n)}detach(){return this.context=void 0,super.detach()}},De=class extends Ct{element;constructor(n){super(),this.element=n instanceof L?n.nativeElement:n}},ht=class{_attachedPortal=null;_disposeFn=null;_isDisposed=!1;hasAttached(){return!!this._attachedPortal}attach(n){if(n instanceof ut)return this._attachedPortal=n,this.attachComponentPortal(n);if(n instanceof pt)return this._attachedPortal=n,this.attachTemplatePortal(n);if(this.attachDomPortal&&n instanceof De)return this._attachedPortal=n,this.attachDomPortal(n)}attachDomPortal=null;detach(){this._attachedPortal&&(this._attachedPortal.setAttachedHost(null),this._attachedPortal=null),this._invokeDisposeFn()}dispose(){this.hasAttached()&&this.detach(),this._invokeDisposeFn(),this._isDisposed=!0}setDisposeFn(n){this._disposeFn=n}_invokeDisposeFn(){this._disposeFn&&(this._disposeFn(),this._disposeFn=null)}},qt=class extends ht{outletElement;_appRef;_defaultInjector;constructor(n,t,e){super(),this.outletElement=n,this._appRef=t,this._defaultInjector=e}attachComponentPortal(n){let t;if(n.viewContainerRef){let e=n.injector||n.viewContainerRef.injector,o=e.get(he,null,{optional:!0})||void 0;t=n.viewContainerRef.createComponent(n.component,{index:n.viewContainerRef.length,injector:e,ngModuleRef:o,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0}),this.setDisposeFn(()=>t.destroy())}else{let e=this._appRef,o=n.injector||this._defaultInjector||P.NULL,a=o.get(ct,e.injector);t=Ht(n.component,{elementInjector:o,environmentInjector:a,projectableNodes:n.projectableNodes||void 0,bindings:n.bindings||void 0}),e.attachView(t.hostView),this.setDisposeFn(()=>{e.viewCount>0&&e.detachView(t.hostView),t.destroy()})}return this.outletElement.appendChild(this._getComponentRootNode(t)),this._attachedPortal=n,t}attachTemplatePortal(n){let t=n.viewContainerRef,e=t.createEmbeddedView(n.templateRef,n.context,{injector:n.injector});return e.rootNodes.forEach(o=>this.outletElement.appendChild(o)),e.detectChanges(),this.setDisposeFn(()=>{let o=t.indexOf(e);o!==-1&&t.remove(o)}),this._attachedPortal=n,e}attachDomPortal=n=>{let t=n.element;t.parentNode;let e=this.outletElement.ownerDocument.createComment("dom-portal");t.parentNode.insertBefore(e,t),this.outletElement.appendChild(t),this._attachedPortal=n,super.setDisposeFn(()=>{e.parentNode&&e.parentNode.replaceChild(t,e)})};dispose(){super.dispose(),this.outletElement.remove()}_getComponentRootNode(n){return n.hostView.rootNodes[0]}};var Me=(()=>{class i extends ht{_moduleRef=r(he,{optional:!0});_document=r(M);_viewContainerRef=r(pe);_isInitialized=!1;_attachedRef=null;constructor(){super()}get portal(){return this._attachedPortal}set portal(t){this.hasAttached()&&!t&&!this._isInitialized||(this.hasAttached()&&super.detach(),t&&super.attach(t),this._attachedPortal=t||null)}attached=new lt;get attachedRef(){return this._attachedRef}ngOnInit(){this._isInitialized=!0}ngOnDestroy(){super.dispose(),this._attachedRef=this._attachedPortal=null}attachComponentPortal(t){t.setAttachedHost(this);let e=t.viewContainerRef!=null?t.viewContainerRef:this._viewContainerRef,o=e.createComponent(t.component,{index:e.length,injector:t.injector||e.injector,projectableNodes:t.projectableNodes||void 0,ngModuleRef:this._moduleRef||void 0,bindings:t.bindings||void 0});return e!==this._viewContainerRef&&this._getRootNode().appendChild(o.hostView.rootNodes[0]),super.setDisposeFn(()=>o.destroy()),this._attachedPortal=t,this._attachedRef=o,this.attached.emit(o),o}attachTemplatePortal(t){t.setAttachedHost(this);let e=this._viewContainerRef.createEmbeddedView(t.templateRef,t.context,{injector:t.injector});return super.setDisposeFn(()=>this._viewContainerRef.clear()),this._attachedPortal=t,this._attachedRef=e,this.attached.emit(e),e}attachDomPortal=t=>{let e=t.element;e.parentNode;let o=this._document.createComment("dom-portal");t.setAttachedHost(this),e.parentNode.insertBefore(o,e),this._getRootNode().appendChild(e),this._attachedPortal=t,super.setDisposeFn(()=>{o.parentNode&&o.parentNode.replaceChild(e,o)})};_getRootNode(){let t=this._viewContainerRef.element.nativeElement;return t.nodeType===t.ELEMENT_NODE?t:t.parentNode}static \u0275fac=function(e){return new(e||i)};static \u0275dir=V({type:i,selectors:[["","cdkPortalOutlet",""]],inputs:{portal:[0,"cdkPortalOutlet","portal"]},outputs:{attached:"attached"},exportAs:["cdkPortalOutlet"],features:[et]})}return i})();var Qt=class{enable(){}disable(){}attach(){}};var ft=class{positionStrategy;scrollStrategy=new Qt;panelClass="";hasBackdrop=!1;backdropClass="cdk-overlay-dark-backdrop";disableAnimations;width;height;minWidth;minHeight;maxWidth;maxHeight;direction;disposeOnNavigation=!1;usePopover;eventPredicate;constructor(n){if(n){let t=Object.keys(n);for(let e of t)n[e]!==void 0&&(this[e]=n[e])}}};var Tn=(()=>{class i{_attachedOverlays=[];_document=r(M);_isAttached=!1;constructor(){}ngOnDestroy(){this.detach()}add(t){this.remove(t),this._attachedOverlays.push(t)}remove(t){let e=this._attachedOverlays.indexOf(t);e>-1&&this._attachedOverlays.splice(e,1),this._attachedOverlays.length===0&&this.detach()}canReceiveEvent(t,e,o){return o.observers.length<1?!1:t.eventPredicate?t.eventPredicate(e):!0}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Pn=(()=>{class i extends Tn{_ngZone=r(R);_renderer=r(K).createRenderer(null,null);_cleanupKeydown;add(t){super.add(t),this._isAttached||(this._ngZone.runOutsideAngular(()=>{this._cleanupKeydown=this._renderer.listen("body","keydown",this._keydownListener)}),this._isAttached=!0)}detach(){this._isAttached&&(this._cleanupKeydown?.(),this._isAttached=!1)}_keydownListener=t=>{let e=this._attachedOverlays;for(let o=e.length-1;o>-1;o--){let a=e[o];if(this.canReceiveEvent(a,t,a._keydownEvents)){this._ngZone.run(()=>a._keydownEvents.next(t));break}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=ue(i)))(o||i)}})();static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Bn=(()=>{class i extends Tn{_platform=r(N);_ngZone=r(R);_renderer=r(K).createRenderer(null,null);_cursorOriginalValue;_cursorStyleIsSet=!1;_pointerDownEventTarget=null;_cleanups;add(t){if(super.add(t),!this._isAttached){let e=this._document.body,o={capture:!0},a=this._renderer;this._cleanups=this._ngZone.runOutsideAngular(()=>[a.listen(e,"pointerdown",this._pointerDownListener,o),a.listen(e,"click",this._clickListener,o),a.listen(e,"auxclick",this._clickListener,o),a.listen(e,"contextmenu",this._clickListener,o)]),this._platform.IOS&&!this._cursorStyleIsSet&&(this._cursorOriginalValue=e.style.cursor,e.style.cursor="pointer",this._cursorStyleIsSet=!0),this._isAttached=!0}}detach(){this._isAttached&&(this._cleanups?.forEach(t=>t()),this._cleanups=void 0,this._platform.IOS&&this._cursorStyleIsSet&&(this._document.body.style.cursor=this._cursorOriginalValue,this._cursorStyleIsSet=!1),this._isAttached=!1)}_pointerDownListener=t=>{this._pointerDownEventTarget=F(t)};_clickListener=t=>{let e=F(t),o=t.type==="click"&&this._pointerDownEventTarget?this._pointerDownEventTarget:e;this._pointerDownEventTarget=null;let a=this._attachedOverlays.slice();for(let s=a.length-1;s>-1;s--){let u=a[s],f=u._outsidePointerEvents;if(!(!u.hasAttached()||!this.canReceiveEvent(u,t,f))){if(An(u.overlayElement,e)||An(u.overlayElement,o))break;this._ngZone?this._ngZone.run(()=>f.next(t)):f.next(t)}}};static \u0275fac=(()=>{let t;return function(o){return(t||(t=ue(i)))(o||i)}})();static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();function An(i,n){let t=typeof ShadowRoot<"u"&&ShadowRoot,e=n;for(;e;){if(e===i)return!0;e=t&&e instanceof ShadowRoot?e.host:e.parentNode}return!1}var Fn=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["ng-component"]],hostAttrs:["cdk-overlay-style-loader",""],decls:0,vars:0,template:function(e,o){},styles:[`.cdk-overlay-container, .cdk-global-overlay-wrapper {
  pointer-events: none;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
}

.cdk-overlay-container {
  position: fixed;
}
@layer cdk-overlay {
  .cdk-overlay-container {
    z-index: 1000;
  }
}
.cdk-overlay-container:empty {
  display: none;
}

.cdk-global-overlay-wrapper {
  display: flex;
  position: absolute;
}
@layer cdk-overlay {
  .cdk-global-overlay-wrapper {
    z-index: 1000;
  }
}

.cdk-overlay-pane {
  position: absolute;
  pointer-events: auto;
  box-sizing: border-box;
  display: flex;
  max-width: 100%;
  max-height: 100%;
}
@layer cdk-overlay {
  .cdk-overlay-pane {
    z-index: 1000;
  }
}

.cdk-overlay-backdrop {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  pointer-events: auto;
  -webkit-tap-highlight-color: transparent;
  opacity: 0;
  touch-action: manipulation;
}
@layer cdk-overlay {
  .cdk-overlay-backdrop {
    z-index: 1000;
    transition: opacity 400ms cubic-bezier(0.25, 0.8, 0.25, 1);
  }
}
@media (prefers-reduced-motion) {
  .cdk-overlay-backdrop {
    transition-duration: 1ms;
  }
}

.cdk-overlay-backdrop-showing {
  opacity: 1;
}
@media (forced-colors: active) {
  .cdk-overlay-backdrop-showing {
    opacity: 0.6;
  }
}

@layer cdk-overlay {
  .cdk-overlay-dark-backdrop {
    background: rgba(0, 0, 0, 0.32);
  }
}

.cdk-overlay-transparent-backdrop {
  transition: visibility 1ms linear, opacity 1ms linear;
  visibility: hidden;
  opacity: 1;
}
.cdk-overlay-transparent-backdrop.cdk-overlay-backdrop-showing, .cdk-high-contrast-active .cdk-overlay-transparent-backdrop {
  opacity: 0;
  visibility: visible;
}

.cdk-overlay-backdrop-noop-animation {
  transition: none;
}

.cdk-overlay-connected-position-bounding-box {
  position: absolute;
  display: flex;
  flex-direction: column;
  min-width: 1px;
  min-height: 1px;
}
@layer cdk-overlay {
  .cdk-overlay-connected-position-bounding-box {
    z-index: 1000;
  }
}

.cdk-global-scrollblock {
  position: fixed;
  width: 100%;
  overflow-y: scroll;
}

.cdk-overlay-popover {
  background: none;
  border: none;
  padding: 0;
  outline: 0;
  overflow: visible;
  position: fixed;
  pointer-events: none;
  white-space: normal;
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  inset: auto;
  top: 0;
  left: 0;
}
.cdk-overlay-popover::backdrop {
  display: none;
}
.cdk-overlay-popover .cdk-overlay-backdrop {
  position: fixed;
  z-index: auto;
}
`],encapsulation:2,changeDetection:0})}return i})(),di=(()=>{class i{_platform=r(N);_containerElement;_document=r(M);_styleLoader=r(Q);constructor(){}ngOnDestroy(){this._containerElement?.remove()}getContainerElement(){return this._loadStyles(),this._containerElement||this._createContainer(),this._containerElement}_createContainer(){let t="cdk-overlay-container";if(this._platform.isBrowser||Re()){let o=this._document.querySelectorAll(`.${t}[platform="server"], .${t}[platform="test"]`);for(let a=0;a<o.length;a++)o[a].remove()}let e=this._document.createElement("div");e.classList.add(t),Re()?e.setAttribute("platform","test"):this._platform.isBrowser||e.setAttribute("platform","server"),this._document.body.appendChild(e),this._containerElement=e}_loadStyles(){this._styleLoader.load(Fn)}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})(),Oe=class{_renderer;_ngZone;element;_cleanupClick;_cleanupTransitionEnd;_fallbackTimeout;constructor(n,t,e,o){this._renderer=t,this._ngZone=e,this.element=n.createElement("div"),this.element.classList.add("cdk-overlay-backdrop"),this._cleanupClick=t.listen(this.element,"click",o)}detach(){this._ngZone.runOutsideAngular(()=>{let n=this.element;clearTimeout(this._fallbackTimeout),this._cleanupTransitionEnd?.(),this._cleanupTransitionEnd=this._renderer.listen(n,"transitionend",this.dispose),this._fallbackTimeout=setTimeout(this.dispose,500),n.style.pointerEvents="none",n.classList.remove("cdk-overlay-backdrop-showing")})}dispose=()=>{clearTimeout(this._fallbackTimeout),this._cleanupClick?.(),this._cleanupTransitionEnd?.(),this._cleanupClick=this._cleanupTransitionEnd=this._fallbackTimeout=void 0,this.element.remove()}};function Nn(i){return i&&i.nodeType===1}var Jt=class{_portalOutlet;_host;_pane;_config;_ngZone;_keyboardDispatcher;_document;_location;_outsideClickDispatcher;_animationsDisabled;_injector;_renderer;_backdropClick=new S;_attachments=new S;_detachments=new S;_positionStrategy;_scrollStrategy;_locationChanges=He.EMPTY;_backdropRef=null;_detachContentMutationObserver;_detachContentAfterRenderRef;_disposed=!1;_previousHostParent;_keydownEvents=new S;_outsidePointerEvents=new S;_afterNextRenderRef;constructor(n,t,e,o,a,s,u,f,k,b=!1,x,z){this._portalOutlet=n,this._host=t,this._pane=e,this._config=o,this._ngZone=a,this._keyboardDispatcher=s,this._document=u,this._location=f,this._outsideClickDispatcher=k,this._animationsDisabled=b,this._injector=x,this._renderer=z,o.scrollStrategy&&(this._scrollStrategy=o.scrollStrategy,this._scrollStrategy.attach(this)),this._positionStrategy=o.positionStrategy}get overlayElement(){return this._pane}get backdropElement(){return this._backdropRef?.element||null}get hostElement(){return this._host}get eventPredicate(){return this._config?.eventPredicate||null}attach(n){if(this._disposed)return null;this._attachHost();let t=this._portalOutlet.attach(n);return this._positionStrategy?.attach(this),this._updateStackingOrder(),this._updateElementSize(),this._updateElementDirection(),this._scrollStrategy&&this._scrollStrategy.enable(),this._afterNextRenderRef?.destroy(),this._afterNextRenderRef=tt(()=>{this.hasAttached()&&this.updatePosition()},{injector:this._injector}),this._togglePointerEvents(!0),this._config.hasBackdrop&&this._attachBackdrop(),this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!0),this._attachments.next(),this._completeDetachContent(),this._keyboardDispatcher.add(this),this._config.disposeOnNavigation&&(this._locationChanges=this._location.subscribe(()=>this.dispose())),this._outsideClickDispatcher.add(this),typeof t?.onDestroy=="function"&&t.onDestroy(()=>{this.hasAttached()&&this._ngZone.runOutsideAngular(()=>Promise.resolve().then(()=>this.detach()))}),t}detach(){if(!this.hasAttached())return;this.detachBackdrop(),this._togglePointerEvents(!1),this._positionStrategy&&this._positionStrategy.detach&&this._positionStrategy.detach(),this._scrollStrategy&&this._scrollStrategy.disable();let n=this._portalOutlet.detach();return this._detachments.next(),this._completeDetachContent(),this._keyboardDispatcher.remove(this),this._detachContentWhenEmpty(),this._locationChanges.unsubscribe(),this._outsideClickDispatcher.remove(this),n}dispose(){if(this._disposed)return;let n=this.hasAttached();this._positionStrategy&&this._positionStrategy.dispose(),this._disposeScrollStrategy(),this._backdropRef?.dispose(),this._locationChanges.unsubscribe(),this._keyboardDispatcher.remove(this),this._portalOutlet.dispose(),this._attachments.complete(),this._backdropClick.complete(),this._keydownEvents.complete(),this._outsidePointerEvents.complete(),this._outsideClickDispatcher.remove(this),this._host?.remove(),this._afterNextRenderRef?.destroy(),this._previousHostParent=this._pane=this._host=this._backdropRef=null,n&&this._detachments.next(),this._detachments.complete(),this._completeDetachContent(),this._disposed=!0}hasAttached(){return this._portalOutlet.hasAttached()}backdropClick(){return this._backdropClick}attachments(){return this._attachments}detachments(){return this._detachments}keydownEvents(){return this._keydownEvents}outsidePointerEvents(){return this._outsidePointerEvents}getConfig(){return this._config}updatePosition(){this._positionStrategy&&this._positionStrategy.apply()}updatePositionStrategy(n){n!==this._positionStrategy&&(this._positionStrategy&&this._positionStrategy.dispose(),this._positionStrategy=n,this.hasAttached()&&(n.attach(this),this.updatePosition()))}updateSize(n){this._config=C(C({},this._config),n),this._updateElementSize()}setDirection(n){this._config=ze(C({},this._config),{direction:n}),this._updateElementDirection()}addPanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!0)}removePanelClass(n){this._pane&&this._toggleClasses(this._pane,n,!1)}getDirection(){let n=this._config.direction;return n?typeof n=="string"?n:n.value:"ltr"}updateScrollStrategy(n){n!==this._scrollStrategy&&(this._disposeScrollStrategy(),this._scrollStrategy=n,this.hasAttached()&&(n.attach(this),n.enable()))}_updateElementDirection(){this._host.setAttribute("dir",this.getDirection())}_updateElementSize(){if(!this._pane)return;let n=this._pane.style;n.width=at(this._config.width),n.height=at(this._config.height),n.minWidth=at(this._config.minWidth),n.minHeight=at(this._config.minHeight),n.maxWidth=at(this._config.maxWidth),n.maxHeight=at(this._config.maxHeight)}_togglePointerEvents(n){this._pane.style.pointerEvents=n?"":"none"}_attachHost(){if(!this._host.parentElement){let n=this._config.usePopover?this._positionStrategy?.getPopoverInsertionPoint?.():null;Nn(n)?n.after(this._host):n?.type==="parent"?n.element.appendChild(this._host):this._previousHostParent?.appendChild(this._host)}if(this._config.usePopover)try{this._host.showPopover()}catch(n){}}_attachBackdrop(){let n="cdk-overlay-backdrop-showing";this._backdropRef?.dispose(),this._backdropRef=new Oe(this._document,this._renderer,this._ngZone,t=>{this._backdropClick.next(t)}),this._animationsDisabled&&this._backdropRef.element.classList.add("cdk-overlay-backdrop-noop-animation"),this._config.backdropClass&&this._toggleClasses(this._backdropRef.element,this._config.backdropClass,!0),this._config.usePopover?this._host.prepend(this._backdropRef.element):this._host.parentElement.insertBefore(this._backdropRef.element,this._host),!this._animationsDisabled&&typeof requestAnimationFrame<"u"?this._ngZone.runOutsideAngular(()=>{requestAnimationFrame(()=>this._backdropRef?.element.classList.add(n))}):this._backdropRef.element.classList.add(n)}_updateStackingOrder(){!this._config.usePopover&&this._host.nextSibling&&this._host.parentNode.appendChild(this._host)}detachBackdrop(){this._animationsDisabled?(this._backdropRef?.dispose(),this._backdropRef=null):this._backdropRef?.detach()}_toggleClasses(n,t,e){let o=kt(t||[]).filter(a=>!!a);o.length&&(e?n.classList.add(...o):n.classList.remove(...o))}_detachContentWhenEmpty(){let n=!1;try{this._detachContentAfterRenderRef=tt(()=>{n=!0,this._detachContent()},{injector:this._injector})}catch(t){if(n)throw t;this._detachContent()}globalThis.MutationObserver&&this._pane&&(this._detachContentMutationObserver||=new globalThis.MutationObserver(()=>{this._detachContent()}),this._detachContentMutationObserver.observe(this._pane,{childList:!0}))}_detachContent(){(!this._pane||!this._host||this._pane.children.length===0)&&(this._pane&&this._config.panelClass&&this._toggleClasses(this._pane,this._config.panelClass,!1),this._host&&this._host.parentElement&&(this._previousHostParent=this._host.parentElement,this._host.remove()),this._completeDetachContent())}_completeDetachContent(){this._detachContentAfterRenderRef?.destroy(),this._detachContentAfterRenderRef=void 0,this._detachContentMutationObserver?.disconnect()}_disposeScrollStrategy(){let n=this._scrollStrategy;n?.disable(),n?.detach?.()}};var In="cdk-global-overlay-wrapper";function Ae(i){return new te}var te=class{_overlayRef;_cssPosition="static";_topOffset="";_bottomOffset="";_alignItems="";_xPosition="";_xOffset="";_width="";_height="";_isDisposed=!1;attach(n){let t=n.getConfig();this._overlayRef=n,this._width&&!t.width&&n.updateSize({width:this._width}),this._height&&!t.height&&n.updateSize({height:this._height}),n.hostElement.classList.add(In),this._isDisposed=!1}top(n=""){return this._bottomOffset="",this._topOffset=n,this._alignItems="flex-start",this}left(n=""){return this._xOffset=n,this._xPosition="left",this}bottom(n=""){return this._topOffset="",this._bottomOffset=n,this._alignItems="flex-end",this}right(n=""){return this._xOffset=n,this._xPosition="right",this}start(n=""){return this._xOffset=n,this._xPosition="start",this}end(n=""){return this._xOffset=n,this._xPosition="end",this}width(n=""){return this._overlayRef?this._overlayRef.updateSize({width:n}):this._width=n,this}height(n=""){return this._overlayRef?this._overlayRef.updateSize({height:n}):this._height=n,this}centerHorizontally(n=""){return this.left(n),this._xPosition="center",this}centerVertically(n=""){return this.top(n),this._alignItems="center",this}apply(){if(!this._overlayRef||!this._overlayRef.hasAttached())return;let n=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement.style,e=this._overlayRef.getConfig(),{width:o,height:a,maxWidth:s,maxHeight:u}=e,f=(o==="100%"||o==="100vw")&&(!s||s==="100%"||s==="100vw"),k=(a==="100%"||a==="100vh")&&(!u||u==="100%"||u==="100vh"),b=this._xPosition,x=this._xOffset,z=this._overlayRef.getConfig().direction==="rtl",J="",Z="",T="";f?T="flex-start":b==="center"?(T="center",z?Z=x:J=x):z?b==="left"||b==="end"?(T="flex-end",J=x):(b==="right"||b==="start")&&(T="flex-start",Z=x):b==="left"||b==="start"?(T="flex-start",J=x):(b==="right"||b==="end")&&(T="flex-end",Z=x),n.position=this._cssPosition,n.marginLeft=f?"0":J,n.marginTop=k?"0":this._topOffset,n.marginBottom=this._bottomOffset,n.marginRight=f?"0":Z,t.justifyContent=T,t.alignItems=k?"flex-start":this._alignItems}dispose(){if(this._isDisposed||!this._overlayRef)return;let n=this._overlayRef.overlayElement.style,t=this._overlayRef.hostElement,e=t.style;t.classList.remove(In),e.justifyContent=e.alignItems=n.marginTop=n.marginBottom=n.marginLeft=n.marginRight=n.position="",this._overlayRef=null,this._isDisposed=!0}};var Ln=new w("OVERLAY_DEFAULT_CONFIG");function Ie(i,n){i.get(Q).load(Fn);let t=i.get(di),e=i.get(M),o=i.get(ot),a=i.get(Ft),s=i.get(On),u=i.get(Bt,null,{optional:!0})||i.get(K).createRenderer(null,null),f=new ft(n),k=i.get(Ln,null,{optional:!0})?.usePopover??!0;f.direction=f.direction||s.value,"showPopover"in e.body?f.usePopover=n?.usePopover??k:f.usePopover=!1;let b=e.createElement("div"),x=e.createElement("div");b.id=o.getId("cdk-overlay-"),b.classList.add("cdk-overlay-pane"),x.appendChild(b),f.usePopover&&(x.setAttribute("popover","manual"),x.classList.add("cdk-overlay-popover"));let z=f.usePopover?f.positionStrategy?.getPopoverInsertionPoint?.():null;return Nn(z)?z.after(x):z?.type==="parent"?z.element.appendChild(x):t.getContainerElement().appendChild(x),new Jt(new qt(b,a,i),x,b,f,i.get(R),i.get(Pn),e,i.get(dn),i.get(Bn),n?.disableAnimations??i.get(Tt,null,{optional:!0})==="NoopAnimations",i.get(ct),u)}var ui=new w("MATERIAL_ANIMATIONS"),Vn=null;function pi(){return r(ui,{optional:!0})?.animationsDisabled||r(Tt,{optional:!0})==="NoopAnimations"?"di-disabled":(Vn??=r(Zt).matchMedia("(prefers-reduced-motion)").matches,Vn?"reduced-motion":"enabled")}function rt(){return pi()!=="enabled"}var j=(function(i){return i[i.FADING_IN=0]="FADING_IN",i[i.VISIBLE=1]="VISIBLE",i[i.FADING_OUT=2]="FADING_OUT",i[i.HIDDEN=3]="HIDDEN",i})(j||{}),Te=class{_renderer;element;config;_animationForciblyDisabledThroughCss;state=j.HIDDEN;constructor(n,t,e,o=!1){this._renderer=n,this.element=t,this.config=e,this._animationForciblyDisabledThroughCss=o}fadeOut(){this._renderer.fadeOutRipple(this)}},jn=mt({passive:!0,capture:!0}),Pe=class{_events=new Map;addHandler(n,t,e,o){let a=this._events.get(t);if(a){let s=a.get(e);s?s.add(o):a.set(e,new Set([o]))}else this._events.set(t,new Map([[e,new Set([o])]])),n.runOutsideAngular(()=>{document.addEventListener(t,this._delegateEventHandler,jn)})}removeHandler(n,t,e){let o=this._events.get(n);if(!o)return;let a=o.get(t);a&&(a.delete(e),a.size===0&&o.delete(t),o.size===0&&(this._events.delete(n),document.removeEventListener(n,this._delegateEventHandler,jn)))}_delegateEventHandler=n=>{let t=F(n);t&&this._events.get(n.type)?.forEach((e,o)=>{(o===t||o.contains(t))&&e.forEach(a=>a.handleEvent(n))})}},St={enterDuration:225,exitDuration:150},hi=800,zn=mt({passive:!0,capture:!0}),Hn=["mousedown","touchstart"],Yn=["mouseup","mouseleave","touchend","touchcancel"],fi=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["ng-component"]],hostAttrs:["mat-ripple-style-loader",""],decls:0,vars:0,template:function(e,o){},styles:[`.mat-ripple {
  overflow: hidden;
  position: relative;
}
.mat-ripple:not(:empty) {
  transform: translateZ(0);
}

.mat-ripple.mat-ripple-unbounded {
  overflow: visible;
}

.mat-ripple-element {
  position: absolute;
  border-radius: 50%;
  pointer-events: none;
  transition: opacity, transform 0ms cubic-bezier(0, 0, 0.2, 1);
  transform: scale3d(0, 0, 0);
  background-color: var(--mat-ripple-color, color-mix(in srgb, var(--mat-sys-on-surface) 10%, transparent));
}
@media (forced-colors: active) {
  .mat-ripple-element {
    display: none;
  }
}
.cdk-drag-preview .mat-ripple-element, .cdk-drag-placeholder .mat-ripple-element {
  display: none;
}
`],encapsulation:2,changeDetection:0})}return i})(),ee=class i{_target;_ngZone;_platform;_containerElement;_triggerElement=null;_isPointerDown=!1;_activeRipples=new Map;_mostRecentTransientRipple=null;_lastTouchStartEvent;_pointerUpEventsRegistered=!1;_containerRect=null;static _eventManager=new Pe;constructor(n,t,e,o,a){this._target=n,this._ngZone=t,this._platform=o,o.isBrowser&&(this._containerElement=q(e)),a&&a.get(Q).load(fi)}fadeInRipple(n,t,e={}){let o=this._containerRect=this._containerRect||this._containerElement.getBoundingClientRect(),a=C(C({},St),e.animation);e.centered&&(n=o.left+o.width/2,t=o.top+o.height/2);let s=e.radius||bi(n,t,o),u=n-o.left,f=t-o.top,k=a.enterDuration,b=document.createElement("div");b.classList.add("mat-ripple-element"),b.style.left=`${u-s}px`,b.style.top=`${f-s}px`,b.style.height=`${s*2}px`,b.style.width=`${s*2}px`,e.color!=null&&(b.style.backgroundColor=e.color),b.style.transitionDuration=`${k}ms`,this._containerElement.appendChild(b);let x=window.getComputedStyle(b),z=x.transitionProperty,J=x.transitionDuration,Z=z==="none"||J==="0s"||J==="0s, 0s"||o.width===0&&o.height===0,T=new Te(this,b,e,Z);b.style.transform="scale3d(1, 1, 1)",T.state=j.FADING_IN,e.persistent||(this._mostRecentTransientRipple=T);let Dt=null;return!Z&&(k||a.exitDuration)&&this._ngZone.runOutsideAngular(()=>{let Ve=()=>{Dt&&(Dt.fallbackTimer=null),clearTimeout(je),this._finishRippleTransition(T)},me=()=>this._destroyRipple(T),je=setTimeout(me,k+100);b.addEventListener("transitionend",Ve),b.addEventListener("transitioncancel",me),Dt={onTransitionEnd:Ve,onTransitionCancel:me,fallbackTimer:je}}),this._activeRipples.set(T,Dt),(Z||!k)&&this._finishRippleTransition(T),T}fadeOutRipple(n){if(n.state===j.FADING_OUT||n.state===j.HIDDEN)return;let t=n.element,e=C(C({},St),n.config.animation);t.style.transitionDuration=`${e.exitDuration}ms`,t.style.opacity="0",n.state=j.FADING_OUT,(n._animationForciblyDisabledThroughCss||!e.exitDuration)&&this._finishRippleTransition(n)}fadeOutAll(){this._getActiveRipples().forEach(n=>n.fadeOut())}fadeOutAllNonPersistent(){this._getActiveRipples().forEach(n=>{n.config.persistent||n.fadeOut()})}setupTriggerEvents(n){let t=q(n);!this._platform.isBrowser||!t||t===this._triggerElement||(this._removeTriggerEvents(),this._triggerElement=t,Hn.forEach(e=>{i._eventManager.addHandler(this._ngZone,e,t,this)}))}handleEvent(n){n.type==="mousedown"?this._onMousedown(n):n.type==="touchstart"?this._onTouchStart(n):this._onPointerUp(),this._pointerUpEventsRegistered||(this._ngZone.runOutsideAngular(()=>{Yn.forEach(t=>{this._triggerElement.addEventListener(t,this,zn)})}),this._pointerUpEventsRegistered=!0)}_finishRippleTransition(n){n.state===j.FADING_IN?this._startFadeOutTransition(n):n.state===j.FADING_OUT&&this._destroyRipple(n)}_startFadeOutTransition(n){let t=n===this._mostRecentTransientRipple,{persistent:e}=n.config;n.state=j.VISIBLE,!e&&(!t||!this._isPointerDown)&&n.fadeOut()}_destroyRipple(n){let t=this._activeRipples.get(n)??null;this._activeRipples.delete(n),this._activeRipples.size||(this._containerRect=null),n===this._mostRecentTransientRipple&&(this._mostRecentTransientRipple=null),n.state=j.HIDDEN,t!==null&&(n.element.removeEventListener("transitionend",t.onTransitionEnd),n.element.removeEventListener("transitioncancel",t.onTransitionCancel),t.fallbackTimer!==null&&clearTimeout(t.fallbackTimer)),n.element.remove()}_onMousedown(n){let t=yt(n),e=this._lastTouchStartEvent&&Date.now()<this._lastTouchStartEvent+hi;!this._target.rippleDisabled&&!t&&!e&&(this._isPointerDown=!0,this.fadeInRipple(n.clientX,n.clientY,this._target.rippleConfig))}_onTouchStart(n){if(!this._target.rippleDisabled&&!xt(n)){this._lastTouchStartEvent=Date.now(),this._isPointerDown=!0;let t=n.changedTouches;if(t)for(let e=0;e<t.length;e++)this.fadeInRipple(t[e].clientX,t[e].clientY,this._target.rippleConfig)}}_onPointerUp(){this._isPointerDown&&(this._isPointerDown=!1,this._getActiveRipples().forEach(n=>{let t=n.state===j.VISIBLE||n.config.terminateOnPointerUp&&n.state===j.FADING_IN;!n.config.persistent&&t&&n.fadeOut()}))}_getActiveRipples(){return Array.from(this._activeRipples.keys())}_removeTriggerEvents(){let n=this._triggerElement;n&&(Hn.forEach(t=>i._eventManager.removeHandler(t,n,this)),this._pointerUpEventsRegistered&&(Yn.forEach(t=>n.removeEventListener(t,this,zn)),this._pointerUpEventsRegistered=!1))}};function bi(i,n,t){let e=Math.max(Math.abs(i-t.left),Math.abs(i-t.right)),o=Math.max(Math.abs(n-t.top),Math.abs(n-t.bottom));return Math.sqrt(e*e+o*o)}var Un=new w("mat-ripple-global-options");var _i={capture:!0},gi=["focus","mousedown","mouseenter","touchstart"],Be="mat-ripple-loader-uninitialized",Fe="mat-ripple-loader-class-name",Wn="mat-ripple-loader-centered",ne="mat-ripple-loader-disabled",Xn=(()=>{class i{_document=r(M);_animationsDisabled=rt();_globalRippleOptions=r(Un,{optional:!0});_platform=r(N);_ngZone=r(R);_injector=r(P);_eventCleanups;_hosts=new Map;constructor(){let t=r(K).createRenderer(null,null);this._eventCleanups=this._ngZone.runOutsideAngular(()=>gi.map(e=>t.listen(this._document,e,this._onInteraction,_i)))}ngOnDestroy(){let t=this._hosts.keys();for(let e of t)this.destroyRipple(e);this._eventCleanups.forEach(e=>e())}configureRipple(t,e){t.setAttribute(Be,this._globalRippleOptions?.namespace??""),(e.className||!t.hasAttribute(Fe))&&t.setAttribute(Fe,e.className||""),e.centered&&t.setAttribute(Wn,""),e.disabled&&t.setAttribute(ne,"")}setDisabled(t,e){let o=this._hosts.get(t);o?(o.target.rippleDisabled=e,!e&&!o.hasSetUpEvents&&(o.hasSetUpEvents=!0,o.renderer.setupTriggerEvents(t))):e?t.setAttribute(ne,""):t.removeAttribute(ne)}_onInteraction=t=>{let e=F(t);if(e instanceof HTMLElement){let o=e.closest(`[${Be}="${this._globalRippleOptions?.namespace??""}"]`);o&&this._createRipple(o)}};_createRipple(t){if(!this._document||this._hosts.has(t))return;t.querySelector(".mat-ripple")?.remove();let e=this._document.createElement("span");e.classList.add("mat-ripple",t.getAttribute(Fe)),t.append(e);let o=this._globalRippleOptions,a=this._animationsDisabled?0:o?.animation?.enterDuration??St.enterDuration,s=this._animationsDisabled?0:o?.animation?.exitDuration??St.exitDuration,u={rippleDisabled:this._animationsDisabled||o?.disabled||t.hasAttribute(ne),rippleConfig:{centered:t.hasAttribute(Wn),terminateOnPointerUp:o?.terminateOnPointerUp,animation:{enterDuration:a,exitDuration:s}}},f=new ee(u,this._ngZone,e,this._platform,this._injector),k=!u.rippleDisabled;k&&f.setupTriggerEvents(t),this._hosts.set(t,{target:u,renderer:f,hasSetUpEvents:k}),t.removeAttribute(Be)}destroyRipple(t){let e=this._hosts.get(t);e&&(e.renderer._removeTriggerEvents(),this._hosts.delete(t))}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var $n=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["structural-styles"]],decls:0,vars:0,template:function(e,o){},styles:[`.mat-focus-indicator {
  position: relative;
}
.mat-focus-indicator::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  box-sizing: border-box;
  pointer-events: none;
  display: var(--mat-focus-indicator-display, none);
  border-width: var(--mat-focus-indicator-border-width, 3px);
  border-style: var(--mat-focus-indicator-border-style, solid);
  border-color: var(--mat-focus-indicator-border-color, transparent);
  border-radius: var(--mat-focus-indicator-border-radius, 4px);
}
.mat-focus-indicator:focus-visible::before {
  content: "";
}

@media (forced-colors: active) {
  html {
    --mat-focus-indicator-display: block;
  }
}
`],encapsulation:2,changeDetection:0})}return i})();var vi=new w("MAT_BUTTON_CONFIG");function Zn(i){return i==null?void 0:ln(i)}var Kn=(()=>{class i{_elementRef=r(L);_ngZone=r(R);_animationsDisabled=rt();_config=r(vi,{optional:!0});_focusMonitor=r(Ee);_cleanupClick;_renderer=r(Bt);_rippleLoader=r(Xn);_isAnchor;_isFab=!1;color;get disableRipple(){return this._disableRipple}set disableRipple(t){this._disableRipple=t,this._updateRippleDisabled()}_disableRipple=!1;get disabled(){return this._disabled}set disabled(t){this._disabled=t,this._updateRippleDisabled()}_disabled=!1;ariaDisabled;disabledInteractive;tabIndex;set _tabindex(t){this.tabIndex=t}constructor(){r(Q).load($n);let t=this._elementRef.nativeElement;this._isAnchor=t.tagName==="A",this.disabledInteractive=this._config?.disabledInteractive??!1,this.color=this._config?.color??null,this._rippleLoader?.configureRipple(t,{className:"mat-mdc-button-ripple"})}ngAfterViewInit(){this._focusMonitor.monitor(this._elementRef,!0),this._isAnchor&&this._setupAsAnchor()}ngOnDestroy(){this._cleanupClick?.(),this._focusMonitor.stopMonitoring(this._elementRef),this._rippleLoader?.destroyRipple(this._elementRef.nativeElement)}focus(t="program",e){t?this._focusMonitor.focusVia(this._elementRef.nativeElement,t,e):this._elementRef.nativeElement.focus(e)}_getAriaDisabled(){return this.ariaDisabled!=null?this.ariaDisabled:this._isAnchor?this.disabled||null:this.disabled&&this.disabledInteractive?!0:null}_getDisabledAttribute(){return this.disabledInteractive||!this.disabled?null:!0}_updateRippleDisabled(){this._rippleLoader?.setDisabled(this._elementRef.nativeElement,this.disableRipple||this.disabled)}_getTabIndex(){return this._isAnchor?this.disabled&&!this.disabledInteractive?-1:this.tabIndex:this.tabIndex}_setupAsAnchor(){this._cleanupClick=this._ngZone.runOutsideAngular(()=>this._renderer.listen(this._elementRef.nativeElement,"click",t=>{this.disabled&&(t.preventDefault(),t.stopImmediatePropagation())}))}static \u0275fac=function(e){return new(e||i)};static \u0275dir=V({type:i,hostAttrs:[1,"mat-mdc-button-base"],hostVars:13,hostBindings:function(e,o){e&2&&(Nt("disabled",o._getDisabledAttribute())("aria-disabled",o._getAriaDisabled())("tabindex",o._getTabIndex()),sn(o.color?"mat-"+o.color:""),W("mat-mdc-button-disabled",o.disabled)("mat-mdc-button-disabled-interactive",o.disabledInteractive)("mat-unthemed",!o.color)("_mat-animation-noopable",o._animationsDisabled))},inputs:{color:"color",disableRipple:[2,"disableRipple","disableRipple",nt],disabled:[2,"disabled","disabled",nt],ariaDisabled:[2,"aria-disabled","ariaDisabled",nt],disabledInteractive:[2,"disabledInteractive","disabledInteractive",nt],tabIndex:[2,"tabIndex","tabIndex",Zn],_tabindex:[2,"tabindex","_tabindex",Zn]}})}return i})();var yi=["matButton",""],xi=[[["",8,"material-icons",3,"iconPositionEnd",""],["mat-icon",3,"iconPositionEnd",""],["","matButtonIcon","",3,"iconPositionEnd",""]],"*",[["","iconPositionEnd","",8,"material-icons"],["mat-icon","iconPositionEnd",""],["","matButtonIcon","","iconPositionEnd",""]]],wi=[".material-icons:not([iconPositionEnd]), mat-icon:not([iconPositionEnd]), [matButtonIcon]:not([iconPositionEnd])","*",".material-icons[iconPositionEnd], mat-icon[iconPositionEnd], [matButtonIcon][iconPositionEnd]"];var Gn=new Map([["text",["mat-mdc-button"]],["filled",["mdc-button--unelevated","mat-mdc-unelevated-button"]],["elevated",["mdc-button--raised","mat-mdc-raised-button"]],["outlined",["mdc-button--outlined","mat-mdc-outlined-button"]],["tonal",["mat-tonal-button"]]]),qn=(()=>{class i extends Kn{get appearance(){return this._appearance}set appearance(t){this.setAppearance(t||this._config?.defaultAppearance||"text")}_appearance=null;constructor(){super();let t=Ei(this._elementRef.nativeElement);t&&this.setAppearance(t)}setAppearance(t){if(t===this._appearance)return;let e=this._elementRef.nativeElement.classList,o=this._appearance?Gn.get(this._appearance):null,a=Gn.get(t);o&&e.remove(...o),e.add(...a),this._appearance=t}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["button","matButton",""],["a","matButton",""],["button","mat-button",""],["button","mat-raised-button",""],["button","mat-flat-button",""],["button","mat-stroked-button",""],["a","mat-button",""],["a","mat-raised-button",""],["a","mat-flat-button",""],["a","mat-stroked-button",""]],hostAttrs:[1,"mdc-button"],inputs:{appearance:[0,"matButton","appearance"]},exportAs:["matButton","matAnchor"],features:[et],attrs:yi,ngContentSelectors:wi,decls:7,vars:4,consts:[[1,"mat-mdc-button-persistent-ripple"],[1,"mdc-button__label"],[1,"mat-focus-indicator"],[1,"mat-mdc-button-touch-target"]],template:function(e,o){e&1&&(be(xi),E(0,"span",0),vt(1),l(2,"span",1),vt(3,1),d(),vt(4,2),E(5,"span",2)(6,"span",3)),e&2&&W("mdc-button__ripple",!o._isFab)("mdc-fab__ripple",o._isFab)},styles:[`.mat-mdc-button-base {
  text-decoration: none;
}
.mat-mdc-button-base .mat-icon {
  min-height: fit-content;
  flex-shrink: 0;
}
@media (hover: none) {
  .mat-mdc-button-base:hover > span.mat-mdc-button-persistent-ripple::before {
    opacity: 0;
  }
}

.mdc-button {
  -webkit-user-select: none;
  user-select: none;
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  min-width: 64px;
  border: none;
  outline: none;
  line-height: inherit;
  -webkit-appearance: none;
  overflow: visible;
  vertical-align: middle;
  background: transparent;
  padding: 0 8px;
}
.mdc-button::-moz-focus-inner {
  padding: 0;
  border: 0;
}
.mdc-button:active {
  outline: none;
}
.mdc-button:hover {
  cursor: pointer;
}
.mdc-button:disabled {
  cursor: default;
  pointer-events: none;
}
.mdc-button[hidden] {
  display: none;
}
.mdc-button .mdc-button__label {
  position: relative;
}

.mat-mdc-button {
  padding: 0 var(--mat-button-text-horizontal-padding, 12px);
  height: var(--mat-button-text-container-height, 40px);
  font-family: var(--mat-button-text-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-text-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-text-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-text-label-text-transform);
  font-weight: var(--mat-button-text-label-text-weight, var(--mat-sys-label-large-weight));
}
.mat-mdc-button, .mat-mdc-button .mdc-button__ripple {
  border-radius: var(--mat-button-text-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-button:not(:disabled) {
  color: var(--mat-button-text-label-text-color, var(--mat-sys-primary));
}
.mat-mdc-button[disabled], .mat-mdc-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-text-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
}
.mat-mdc-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-mdc-button:has(.material-icons, mat-icon, [matButtonIcon]) {
  padding: 0 var(--mat-button-text-with-icon-horizontal-padding, 16px);
}
.mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
[dir=rtl] .mat-mdc-button > .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
.mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-offset, -4px);
  margin-left: var(--mat-button-text-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-text-icon-spacing, 8px);
  margin-left: var(--mat-button-text-icon-offset, -4px);
}
.mat-mdc-button .mat-ripple-element {
  background-color: var(--mat-button-text-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-text-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-text-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-text-touch-target-size, 48px);
  display: var(--mat-button-text-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-unelevated-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-filled-container-height, 40px);
  font-family: var(--mat-button-filled-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-filled-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-filled-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-filled-label-text-transform);
  font-weight: var(--mat-button-filled-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-filled-horizontal-padding, 24px);
}
.mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-unelevated-button > .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
.mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-offset, -8px);
  margin-left: var(--mat-button-filled-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-unelevated-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-filled-icon-spacing, 8px);
  margin-left: var(--mat-button-filled-icon-offset, -8px);
}
.mat-mdc-unelevated-button .mat-ripple-element {
  background-color: var(--mat-button-filled-ripple-color, color-mix(in srgb, var(--mat-sys-on-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-state-layer-color, var(--mat-sys-on-primary));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-filled-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-unelevated-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-unelevated-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-unelevated-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-filled-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-unelevated-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-filled-touch-target-size, 48px);
  display: var(--mat-button-filled-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-unelevated-button:not(:disabled) {
  color: var(--mat-button-filled-label-text-color, var(--mat-sys-on-primary));
  background-color: var(--mat-button-filled-container-color, var(--mat-sys-primary));
}
.mat-mdc-unelevated-button, .mat-mdc-unelevated-button .mdc-button__ripple {
  border-radius: var(--mat-button-filled-container-shape, var(--mat-sys-corner-full));
}
.mat-mdc-unelevated-button[disabled], .mat-mdc-unelevated-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-unelevated-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-raised-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--mat-button-protected-container-elevation-shadow, var(--mat-sys-level1));
  height: var(--mat-button-protected-container-height, 40px);
  font-family: var(--mat-button-protected-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-protected-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-protected-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-protected-label-text-transform);
  font-weight: var(--mat-button-protected-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-protected-horizontal-padding, 24px);
}
.mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-raised-button > .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
.mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-offset, -8px);
  margin-left: var(--mat-button-protected-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-raised-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-protected-icon-spacing, 8px);
  margin-left: var(--mat-button-protected-icon-offset, -8px);
}
.mat-mdc-raised-button .mat-ripple-element {
  background-color: var(--mat-button-protected-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-raised-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-protected-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-raised-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-raised-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-raised-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-raised-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-protected-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-raised-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-protected-touch-target-size, 48px);
  display: var(--mat-button-protected-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-raised-button:not(:disabled) {
  color: var(--mat-button-protected-label-text-color, var(--mat-sys-primary));
  background-color: var(--mat-button-protected-container-color, var(--mat-sys-surface));
}
.mat-mdc-raised-button, .mat-mdc-raised-button .mdc-button__ripple {
  border-radius: var(--mat-button-protected-container-shape, var(--mat-sys-corner-full));
}
@media (hover: hover) {
  .mat-mdc-raised-button:hover {
    box-shadow: var(--mat-button-protected-hover-container-elevation-shadow, var(--mat-sys-level2));
  }
}
.mat-mdc-raised-button:focus {
  box-shadow: var(--mat-button-protected-focus-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button:active, .mat-mdc-raised-button:focus:active {
  box-shadow: var(--mat-button-protected-pressed-container-elevation-shadow, var(--mat-sys-level1));
}
.mat-mdc-raised-button[disabled], .mat-mdc-raised-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-protected-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-protected-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-raised-button[disabled].mat-mdc-button-disabled, .mat-mdc-raised-button.mat-mdc-button-disabled.mat-mdc-button-disabled {
  box-shadow: var(--mat-button-protected-disabled-container-elevation-shadow, var(--mat-sys-level0));
}
.mat-mdc-raised-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-mdc-outlined-button {
  border-style: solid;
  transition: border 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-outlined-container-height, 40px);
  font-family: var(--mat-button-outlined-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-outlined-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-outlined-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-outlined-label-text-transform);
  font-weight: var(--mat-button-outlined-label-text-weight, var(--mat-sys-label-large-weight));
  border-radius: var(--mat-button-outlined-container-shape, var(--mat-sys-corner-full));
  border-width: var(--mat-button-outlined-outline-width, 1px);
  padding: 0 var(--mat-button-outlined-horizontal-padding, 24px);
}
.mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
[dir=rtl] .mat-mdc-outlined-button > .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
.mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-offset, -8px);
  margin-left: var(--mat-button-outlined-icon-spacing, 8px);
}
[dir=rtl] .mat-mdc-outlined-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-outlined-icon-spacing, 8px);
  margin-left: var(--mat-button-outlined-icon-offset, -8px);
}
.mat-mdc-outlined-button .mat-ripple-element {
  background-color: var(--mat-button-outlined-ripple-color, color-mix(in srgb, var(--mat-sys-primary) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-state-layer-color, var(--mat-sys-primary));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-outlined-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-mdc-outlined-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-mdc-outlined-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-mdc-outlined-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-mdc-outlined-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-outlined-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-mdc-outlined-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-outlined-touch-target-size, 48px);
  display: var(--mat-button-outlined-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}
.mat-mdc-outlined-button:not(:disabled) {
  color: var(--mat-button-outlined-label-text-color, var(--mat-sys-primary));
  border-color: var(--mat-button-outlined-outline-color, var(--mat-sys-outline));
}
.mat-mdc-outlined-button[disabled], .mat-mdc-outlined-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  border-color: var(--mat-button-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-mdc-outlined-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}

.mat-tonal-button {
  transition: box-shadow 280ms cubic-bezier(0.4, 0, 0.2, 1);
  height: var(--mat-button-tonal-container-height, 40px);
  font-family: var(--mat-button-tonal-label-text-font, var(--mat-sys-label-large-font));
  font-size: var(--mat-button-tonal-label-text-size, var(--mat-sys-label-large-size));
  letter-spacing: var(--mat-button-tonal-label-text-tracking, var(--mat-sys-label-large-tracking));
  text-transform: var(--mat-button-tonal-label-text-transform);
  font-weight: var(--mat-button-tonal-label-text-weight, var(--mat-sys-label-large-weight));
  padding: 0 var(--mat-button-tonal-horizontal-padding, 24px);
}
.mat-tonal-button:not(:disabled) {
  color: var(--mat-button-tonal-label-text-color, var(--mat-sys-on-secondary-container));
  background-color: var(--mat-button-tonal-container-color, var(--mat-sys-secondary-container));
}
.mat-tonal-button, .mat-tonal-button .mdc-button__ripple {
  border-radius: var(--mat-button-tonal-container-shape, var(--mat-sys-corner-full));
}
.mat-tonal-button[disabled], .mat-tonal-button.mat-mdc-button-disabled {
  cursor: default;
  pointer-events: none;
  color: var(--mat-button-tonal-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent));
  background-color: var(--mat-button-tonal-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent));
}
.mat-tonal-button.mat-mdc-button-disabled-interactive {
  pointer-events: auto;
}
.mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
[dir=rtl] .mat-tonal-button > .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
.mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-offset, -8px);
  margin-left: var(--mat-button-tonal-icon-spacing, 8px);
}
[dir=rtl] .mat-tonal-button .mdc-button__label + .mat-icon {
  margin-right: var(--mat-button-tonal-icon-spacing, 8px);
  margin-left: var(--mat-button-tonal-icon-offset, -8px);
}
.mat-tonal-button .mat-ripple-element {
  background-color: var(--mat-button-tonal-ripple-color, color-mix(in srgb, var(--mat-sys-on-secondary-container) calc(var(--mat-sys-pressed-state-layer-opacity) * 100%), transparent));
}
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-state-layer-color, var(--mat-sys-on-secondary-container));
}
.mat-tonal-button.mat-mdc-button-disabled .mat-mdc-button-persistent-ripple::before {
  background-color: var(--mat-button-tonal-disabled-state-layer-color, var(--mat-sys-on-surface-variant));
}
.mat-tonal-button:hover > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity));
}
.mat-tonal-button.cdk-program-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.cdk-keyboard-focused > .mat-mdc-button-persistent-ripple::before, .mat-tonal-button.mat-mdc-button-disabled-interactive:focus > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity));
}
.mat-tonal-button:active > .mat-mdc-button-persistent-ripple::before {
  opacity: var(--mat-button-tonal-pressed-state-layer-opacity, var(--mat-sys-pressed-state-layer-opacity));
}
.mat-tonal-button .mat-mdc-button-touch-target {
  position: absolute;
  top: 50%;
  height: var(--mat-button-tonal-touch-target-size, 48px);
  display: var(--mat-button-tonal-touch-target-display, block);
  left: 0;
  right: 0;
  transform: translateY(-50%);
}

.mat-mdc-button,
.mat-mdc-unelevated-button,
.mat-mdc-raised-button,
.mat-mdc-outlined-button,
.mat-tonal-button {
  -webkit-tap-highlight-color: transparent;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple,
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  pointer-events: none;
  border-radius: inherit;
}
.mat-mdc-button .mat-mdc-button-ripple,
.mat-mdc-unelevated-button .mat-mdc-button-ripple,
.mat-mdc-raised-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-tonal-button .mat-mdc-button-ripple {
  overflow: hidden;
}
.mat-mdc-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-unelevated-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-raised-button .mat-mdc-button-persistent-ripple::before,
.mat-mdc-outlined-button .mat-mdc-button-persistent-ripple::before,
.mat-tonal-button .mat-mdc-button-persistent-ripple::before {
  content: "";
  opacity: 0;
}
.mat-mdc-button .mdc-button__label,
.mat-mdc-button .mat-icon,
.mat-mdc-unelevated-button .mdc-button__label,
.mat-mdc-unelevated-button .mat-icon,
.mat-mdc-raised-button .mdc-button__label,
.mat-mdc-raised-button .mat-icon,
.mat-mdc-outlined-button .mdc-button__label,
.mat-mdc-outlined-button .mat-icon,
.mat-tonal-button .mdc-button__label,
.mat-tonal-button .mat-icon {
  z-index: 1;
  position: relative;
}
.mat-mdc-button .mat-focus-indicator,
.mat-mdc-unelevated-button .mat-focus-indicator,
.mat-mdc-raised-button .mat-focus-indicator,
.mat-mdc-outlined-button .mat-focus-indicator,
.mat-tonal-button .mat-focus-indicator {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  position: absolute;
  border-radius: inherit;
}
.mat-mdc-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-unelevated-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-raised-button:focus-visible > .mat-focus-indicator::before,
.mat-mdc-outlined-button:focus-visible > .mat-focus-indicator::before,
.mat-tonal-button:focus-visible > .mat-focus-indicator::before {
  content: "";
  border-radius: inherit;
}
.mat-mdc-button._mat-animation-noopable,
.mat-mdc-unelevated-button._mat-animation-noopable,
.mat-mdc-raised-button._mat-animation-noopable,
.mat-mdc-outlined-button._mat-animation-noopable,
.mat-tonal-button._mat-animation-noopable {
  transition: none !important;
  animation: none !important;
}
.mat-mdc-button > .mat-icon,
.mat-mdc-unelevated-button > .mat-icon,
.mat-mdc-raised-button > .mat-icon,
.mat-mdc-outlined-button > .mat-icon,
.mat-tonal-button > .mat-icon {
  display: inline-block;
  position: relative;
  vertical-align: top;
  font-size: 1.125rem;
  height: 1.125rem;
  width: 1.125rem;
}

.mat-mdc-outlined-button .mat-mdc-button-ripple,
.mat-mdc-outlined-button .mdc-button__ripple {
  top: -1px;
  left: -1px;
  bottom: -1px;
  right: -1px;
}

.mat-mdc-unelevated-button .mat-focus-indicator::before,
.mat-tonal-button .mat-focus-indicator::before,
.mat-mdc-raised-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px) * -1);
}

.mat-mdc-outlined-button .mat-focus-indicator::before {
  margin: calc(calc(var(--mat-focus-indicator-border-width, 3px) + 3px) * -1);
}
`,`@media (forced-colors: active) {
  .mat-mdc-button:not(.mdc-button--outlined),
  .mat-mdc-unelevated-button:not(.mdc-button--outlined),
  .mat-mdc-raised-button:not(.mdc-button--outlined),
  .mat-mdc-outlined-button:not(.mdc-button--outlined),
  .mat-mdc-button-base.mat-tonal-button,
  .mat-mdc-icon-button.mat-mdc-icon-button,
  .mat-mdc-outlined-button .mdc-button__ripple {
    outline: solid 1px;
  }
}
`],encapsulation:2,changeDetection:0})}return i})();function Ei(i){return i.hasAttribute("mat-raised-button")?"elevated":i.hasAttribute("mat-stroked-button")?"outlined":i.hasAttribute("mat-flat-button")?"filled":i.hasAttribute("mat-button")?"text":null}function ki(i,n){if(i&1){let t=$();jt(0,"div",1)(1,"button",2),fe("click",function(){A(t);let o=y();return I(o.action())}),m(2),gt()()}if(i&2){let t=y();c(2),v(" ",t.data.action," ")}}var Ci=["label"];function Si(i,n){}var Ri=Math.pow(2,31)-1,Rt=class{_overlayRef;instance;containerInstance;_afterDismissed=new S;_afterOpened=new S;_onAction=new S;_durationTimeoutId;_dismissedByAction=!1;constructor(n,t){this._overlayRef=t,this.containerInstance=n,n._onExit.subscribe(()=>this._finishDismiss())}dismiss(){this._afterDismissed.closed||this.containerInstance.exit(),clearTimeout(this._durationTimeoutId)}dismissWithAction(){this._onAction.closed||(this._dismissedByAction=!0,this._onAction.next(),this._onAction.complete(),this.dismiss()),clearTimeout(this._durationTimeoutId)}closeWithAction(){this.dismissWithAction()}_dismissAfter(n){this._durationTimeoutId=setTimeout(()=>this.dismiss(),Math.min(n,Ri))}_open(){this._afterOpened.closed||(this._afterOpened.next(),this._afterOpened.complete())}_finishDismiss(){this._overlayRef.dispose(),this._onAction.closed||this._onAction.complete(),this._afterDismissed.next({dismissedByAction:this._dismissedByAction}),this._afterDismissed.complete(),this._dismissedByAction=!1}afterDismissed(){return this._afterDismissed}afterOpened(){return this.containerInstance._onEnter}onAction(){return this._onAction}},Qn=new w("MatSnackBarData"),bt=class{politeness="polite";announcementMessage="";viewContainerRef;duration=0;panelClass;direction;data=null;horizontalPosition="center";verticalPosition="bottom"},Di=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275dir=V({type:i,selectors:[["","matSnackBarLabel",""]],hostAttrs:[1,"mat-mdc-snack-bar-label","mdc-snackbar__label"]})}return i})(),Mi=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275dir=V({type:i,selectors:[["","matSnackBarActions",""]],hostAttrs:[1,"mat-mdc-snack-bar-actions","mdc-snackbar__actions"]})}return i})(),Oi=(()=>{class i{static \u0275fac=function(e){return new(e||i)};static \u0275dir=V({type:i,selectors:[["","matSnackBarAction",""]],hostAttrs:[1,"mat-mdc-snack-bar-action","mdc-snackbar__action"]})}return i})(),Ai=(()=>{class i{snackBarRef=r(Rt);data=r(Qn);constructor(){}action(){this.snackBarRef.dismissWithAction()}get hasAction(){return!!this.data.action}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["simple-snack-bar"]],hostAttrs:[1,"mat-mdc-simple-snack-bar"],exportAs:["matSnackBar"],decls:3,vars:2,consts:[["matSnackBarLabel",""],["matSnackBarActions",""],["matButton","","matSnackBarAction","",3,"click"]],template:function(e,o){e&1&&(jt(0,"div",0),m(1),gt(),Y(2,ki,3,1,"div",1)),e&2&&(c(),v(" ",o.data.message,`
`),c(),U(o.hasAction?2:-1))},dependencies:[qn,Di,Mi,Oi],styles:[`.mat-mdc-simple-snack-bar {
  display: flex;
}
.mat-mdc-simple-snack-bar .mat-mdc-snack-bar-label {
  max-height: 50vh;
  overflow: auto;
}
`],encapsulation:2,changeDetection:0})}return i})(),Ne="_mat-snack-bar-enter",Le="_mat-snack-bar-exit",Ii=(()=>{class i extends ht{_ngZone=r(R);_elementRef=r(L);_changeDetectorRef=r(cn);_platform=r(N);_animationsDisabled=rt();snackBarConfig=r(bt);_document=r(M);_trackedModals=new Set;_enterFallback;_exitFallback;_injector=r(P);_announceDelay=150;_announceTimeoutId;_destroyed=!1;_portalOutlet;_onAnnounce=new S;_onExit=new S;_onEnter=new S;_animationState="void";_live;_label;_role;_liveElementId=r(ot).getId("mat-snack-bar-container-live-");constructor(){super();let t=this.snackBarConfig;t.politeness==="assertive"&&!t.announcementMessage?this._live="assertive":t.politeness==="off"?this._live="off":this._live="polite",this._platform.FIREFOX&&(this._live==="polite"&&(this._role="status"),this._live==="assertive"&&(this._role="alert"))}attachComponentPortal(t){this._assertNotAttached();let e=this._portalOutlet.attachComponentPortal(t);return this._afterPortalAttached(),e}attachTemplatePortal(t){this._assertNotAttached();let e=this._portalOutlet.attachTemplatePortal(t);return this._afterPortalAttached(),e}attachDomPortal=t=>{this._assertNotAttached();let e=this._portalOutlet.attachDomPortal(t);return this._afterPortalAttached(),e};onAnimationEnd(t){t===Le?this._completeExit():t===Ne&&(clearTimeout(this._enterFallback),this._ngZone.run(()=>{this._onEnter.next(),this._onEnter.complete()}))}enter(){this._destroyed||(this._animationState="visible",this._changeDetectorRef.markForCheck(),this._changeDetectorRef.detectChanges(),this._screenReaderAnnounce(),this._animationsDisabled?tt(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(Ne)))},{injector:this._injector}):(clearTimeout(this._enterFallback),this._enterFallback=setTimeout(()=>{this._elementRef.nativeElement.classList.add("mat-snack-bar-fallback-visible"),this.onAnimationEnd(Ne)},200)))}exit(){return this._destroyed?Mt(void 0):(this._ngZone.run(()=>{this._animationState="hidden",this._changeDetectorRef.markForCheck(),this._elementRef.nativeElement.setAttribute("mat-exit",""),clearTimeout(this._announceTimeoutId),this._animationsDisabled?tt(()=>{this._ngZone.run(()=>queueMicrotask(()=>this.onAnimationEnd(Le)))},{injector:this._injector}):(clearTimeout(this._exitFallback),this._exitFallback=setTimeout(()=>this.onAnimationEnd(Le),200))}),this._onExit)}ngOnDestroy(){this._destroyed=!0,this._clearFromModals(),this._completeExit()}_completeExit(){clearTimeout(this._exitFallback),queueMicrotask(()=>{this._onExit.next(),this._onExit.complete()})}_afterPortalAttached(){let t=this._elementRef.nativeElement,e=this.snackBarConfig.panelClass;e&&(Array.isArray(e)?e.forEach(s=>t.classList.add(s)):t.classList.add(e)),this._exposeToModals();let o=this._label.nativeElement,a="mdc-snackbar__label";o.classList.toggle(a,!o.querySelector(`.${a}`))}_exposeToModals(){let t=this._liveElementId,e=this._document.querySelectorAll('body > .cdk-overlay-container [aria-modal="true"]');for(let o=0;o<e.length;o++){let a=e[o],s=a.getAttribute("aria-owns");this._trackedModals.add(a),s?s.indexOf(t)===-1&&a.setAttribute("aria-owns",s+" "+t):a.setAttribute("aria-owns",t)}}_clearFromModals(){this._trackedModals.forEach(t=>{let e=t.getAttribute("aria-owns");if(e){let o=e.replace(this._liveElementId,"").trim();o.length>0?t.setAttribute("aria-owns",o):t.removeAttribute("aria-owns")}}),this._trackedModals.clear()}_assertNotAttached(){this._portalOutlet.hasAttached()}_screenReaderAnnounce(){this._announceTimeoutId||this._ngZone.runOutsideAngular(()=>{this._announceTimeoutId=setTimeout(()=>{if(this._destroyed)return;let t=this._elementRef.nativeElement,e=t.querySelector("[aria-hidden]"),o=t.querySelector("[aria-live]");if(e&&o){let a=null;this._platform.isBrowser&&document.activeElement instanceof HTMLElement&&e.contains(document.activeElement)&&(a=document.activeElement),e.removeAttribute("aria-hidden"),o.appendChild(e),a?.focus(),this._onAnnounce.next(),this._onAnnounce.complete()}},this._announceDelay)})}static \u0275fac=function(e){return new(e||i)};static \u0275cmp=B({type:i,selectors:[["mat-snack-bar-container"]],viewQuery:function(e,o){if(e&1&&rn(Me,7)(Ci,7),e&2){let a;_e(a=ge())&&(o._portalOutlet=a.first),_e(a=ge())&&(o._label=a.first)}},hostAttrs:[1,"mdc-snackbar","mat-mdc-snack-bar-container"],hostVars:6,hostBindings:function(e,o){e&1&&fe("animationend",function(s){return o.onAnimationEnd(s.animationName)})("animationcancel",function(s){return o.onAnimationEnd(s.animationName)}),e&2&&W("mat-snack-bar-container-enter",o._animationState==="visible")("mat-snack-bar-container-exit",o._animationState==="hidden")("mat-snack-bar-container-animations-enabled",!o._animationsDisabled)},features:[et],decls:6,vars:3,consts:[["label",""],[1,"mdc-snackbar__surface","mat-mdc-snackbar-surface"],[1,"mat-mdc-snack-bar-label"],["aria-hidden","true"],["cdkPortalOutlet",""]],template:function(e,o){e&1&&(jt(0,"div",1)(1,"div",2,0)(3,"div",3),nn(4,Si,0,0,"ng-template",4),gt(),an(5,"div"),gt()()),e&2&&(c(5),Nt("aria-live",o._live)("role",o._role)("id",o._liveElementId))},dependencies:[Me],styles:[`@keyframes _mat-snack-bar-enter {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
@keyframes _mat-snack-bar-exit {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
}
.mat-mdc-snack-bar-container {
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  margin: 8px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snack-bar-container {
  width: 100vw;
}

.mat-snack-bar-container-animations-enabled {
  opacity: 0;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-fallback-visible {
  opacity: 1;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-enter {
  animation: _mat-snack-bar-enter 150ms cubic-bezier(0, 0, 0.2, 1) forwards;
}
.mat-snack-bar-container-animations-enabled.mat-snack-bar-container-exit {
  animation: _mat-snack-bar-exit 75ms cubic-bezier(0.4, 0, 1, 1) forwards;
}

.mat-mdc-snackbar-surface {
  box-shadow: 0px 3px 5px -1px rgba(0, 0, 0, 0.2), 0px 6px 10px 0px rgba(0, 0, 0, 0.14), 0px 1px 18px 0px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  padding-left: 0;
  padding-right: 8px;
}
[dir=rtl] .mat-mdc-snackbar-surface {
  padding-right: 0;
  padding-left: 8px;
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  min-width: 344px;
  max-width: 672px;
}
.mat-mdc-snack-bar-handset .mat-mdc-snackbar-surface {
  width: 100%;
  min-width: 0;
}
@media (forced-colors: active) {
  .mat-mdc-snackbar-surface {
    outline: solid 1px;
  }
}
.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface {
  color: var(--mat-snack-bar-supporting-text-color, var(--mat-sys-inverse-on-surface));
  border-radius: var(--mat-snack-bar-container-shape, var(--mat-sys-corner-extra-small));
  background-color: var(--mat-snack-bar-container-color, var(--mat-sys-inverse-surface));
}

.mdc-snackbar__label {
  width: 100%;
  flex-grow: 1;
  box-sizing: border-box;
  margin: 0;
  padding: 14px 8px 14px 16px;
}
[dir=rtl] .mdc-snackbar__label {
  padding-left: 8px;
  padding-right: 16px;
}
.mat-mdc-snack-bar-container .mdc-snackbar__label {
  font-family: var(--mat-snack-bar-supporting-text-font, var(--mat-sys-body-medium-font));
  font-size: var(--mat-snack-bar-supporting-text-size, var(--mat-sys-body-medium-size));
  font-weight: var(--mat-snack-bar-supporting-text-weight, var(--mat-sys-body-medium-weight));
  line-height: var(--mat-snack-bar-supporting-text-line-height, var(--mat-sys-body-medium-line-height));
}

.mat-mdc-snack-bar-actions {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  box-sizing: border-box;
}

.mat-mdc-snack-bar-handset,
.mat-mdc-snack-bar-container,
.mat-mdc-snack-bar-label {
  flex: 1 1 auto;
}

.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled).mat-unthemed {
  color: var(--mat-snack-bar-button-color, var(--mat-sys-inverse-primary));
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) {
  --mat-button-text-state-layer-color: currentColor;
  --mat-button-text-ripple-color: currentColor;
}
.mat-mdc-snack-bar-container .mat-mdc-button.mat-mdc-snack-bar-action:not(:disabled) .mat-ripple-element {
  opacity: 0.1;
}
`],encapsulation:2})}return i})(),Ti=new w("mat-snack-bar-default-options",{providedIn:"root",factory:()=>new bt}),ie=(()=>{class i{_live=r(Ce);_injector=r(P);_breakpointObserver=r(ke);_parentSnackBar=r(i,{optional:!0,skipSelf:!0});_defaultConfig=r(Ti);_animationsDisabled=rt();_snackBarRefAtThisLevel=null;simpleSnackBarComponent=Ai;snackBarContainerComponent=Ii;handsetCssClass="mat-mdc-snack-bar-handset";get _openedSnackBarRef(){let t=this._parentSnackBar;return t?t._openedSnackBarRef:this._snackBarRefAtThisLevel}set _openedSnackBarRef(t){this._parentSnackBar?this._parentSnackBar._openedSnackBarRef=t:this._snackBarRefAtThisLevel=t}constructor(){}openFromComponent(t,e){return this._attach(t,e)}openFromTemplate(t,e){return this._attach(t,e)}open(t,e="",o){let a=C(C({},this._defaultConfig),o);return a.data={message:t,action:e},a.announcementMessage===t&&(a.announcementMessage=void 0),this.openFromComponent(this.simpleSnackBarComponent,a)}dismiss(){this._openedSnackBarRef&&this._openedSnackBarRef.dismiss()}ngOnDestroy(){this._snackBarRefAtThisLevel&&this._snackBarRefAtThisLevel.dismiss()}_attachSnackBarContainer(t,e){let o=e&&e.viewContainerRef&&e.viewContainerRef.injector,a=P.create({parent:o||this._injector,providers:[{provide:bt,useValue:e}]}),s=new ut(this.snackBarContainerComponent,e.viewContainerRef,a),u=t.attach(s);return u.instance.snackBarConfig=e,u.instance}_attach(t,e){let o=C(C(C({},new bt),this._defaultConfig),e),a=this._createOverlay(o),s=this._attachSnackBarContainer(a,o),u=new Rt(s,a);if(t instanceof Pt){let f=new pt(t,null,{$implicit:o.data,snackBarRef:u});u.instance=s.attachTemplatePortal(f)}else{let f=this._createInjector(o,u),k=new ut(t,void 0,f),b=s.attachComponentPortal(k);u.instance=b.instance}return this._breakpointObserver.observe(Mn.HandsetPortrait).pipe(st(a.detachments())).subscribe(f=>{a.overlayElement.classList.toggle(this.handsetCssClass,f.matches)}),o.announcementMessage&&s._onAnnounce.subscribe(()=>{this._live.announce(o.announcementMessage,o.politeness)}),this._animateSnackBar(u,o),this._openedSnackBarRef=u,this._openedSnackBarRef}_animateSnackBar(t,e){t.afterDismissed().subscribe(()=>{this._openedSnackBarRef==t&&(this._openedSnackBarRef=null),e.announcementMessage&&this._live.clear()}),e.duration&&e.duration>0&&t.afterOpened().subscribe(()=>t._dismissAfter(e.duration)),this._openedSnackBarRef?(this._openedSnackBarRef.afterDismissed().subscribe(()=>{t.containerInstance.enter()}),this._openedSnackBarRef.dismiss()):t.containerInstance.enter()}_createOverlay(t){let e=new ft;e.direction=t.direction;let o=Ae(this._injector),a=t.direction==="rtl",s=t.horizontalPosition==="left"||t.horizontalPosition==="start"&&!a||t.horizontalPosition==="end"&&a,u=!s&&t.horizontalPosition!=="center";return s?o.left("0"):u?o.right("0"):o.centerHorizontally(),t.verticalPosition==="top"?o.top("0"):o.bottom("0"),e.positionStrategy=o,e.disableAnimations=this._animationsDisabled,Ie(this._injector,e)}_createInjector(t,e){let o=t&&t.viewContainerRef&&t.viewContainerRef.injector;return P.create({parent:o||this._injector,providers:[{provide:Rt,useValue:e},{provide:Qn,useValue:t.data}]})}static \u0275fac=function(e){return new(e||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})}return i})();var _t=class{_id;_userId;_plan;_status;_renewalDate;_price;constructor(n){this._id=n.id,this._userId=n.userId,this._plan=n.plan,this._status=n.status,this._renewalDate=n.renewalDate,this._price=n.price}get id(){return this._id}get userId(){return this._userId}get plan(){return this._plan}get status(){return this._status}get renewalDate(){return this._renewalDate}get price(){return this._price}};var oe=class{toEntityFromResource(n){return new _t({id:n.id,userId:n.userId,plan:n.plan,status:n.status,renewalDate:n.renewalDate,price:n.price})}toResourceFromEntity(n){return{id:n.id,userId:n.userId,plan:n.plan,status:n.status,renewalDate:n.renewalDate,price:n.price}}toEntitiesFromResponse(n){return n.subscriptions?n.subscriptions.map(t=>this.toEntityFromResource(t)):[]}};var ae=class extends Ut{constructor(n){super(n,`${dt.platformProviderApiBaseUrl}${dt.platformProviderSubscriptionsEndpointPath}`,new oe)}getByUserId(n){return this.http.get(`${this.endpointUrl}/user/${n}`).pipe(X(t=>t?this.assembler.toEntityFromResource(t):null),Ot(this.handleError("Failed to fetch subscription by userId")))}activate(n,t,e,o){return this.http.post(this.endpointUrl,{userId:n,planTier:t,billingCycle:"MONTHLY",paymentMethodToken:e,amount:o}).pipe(X(a=>this.assembler.toEntityFromResource(a)))}upgradePlan(n,t,e,o){return this.http.put(`${this.endpointUrl}/${n}/upgrade`,{userId:t,newTier:e,paymentMethodToken:o}).pipe(X(a=>this.assembler.toEntityFromResource(a)))}};var re=class{_id;_userId;_date;_plan;_amount;_status;constructor(n){this._id=n.id,this._userId=n.userId,this._date=n.date,this._plan=n.plan,this._amount=n.amount,this._status=n.status}get id(){return this._id}get userId(){return this._userId}get date(){return this._date}get plan(){return this._plan}get amount(){return this._amount}get status(){return this._status}};var se=class{toEntityFromResource(n){return new re({id:n.id,userId:n.userId,date:n.date,plan:n.plan,amount:n.amount,status:n.status})}toResourceFromEntity(n){return{id:n.id,userId:n.userId,date:n.date,plan:n.plan,amount:n.amount,status:n.status}}toEntitiesFromResponse(n){return n.billingRecords?n.billingRecords.map(t=>this.toEntityFromResource(t)):[]}};var ce=class extends Ut{constructor(n){super(n,`${dt.platformProviderApiBaseUrl}${dt.platformProviderBillingRecordsEndpointPath}`,new se)}getByUserId(n){return this.http.get(`${this.endpointUrl}/user/${n}`).pipe(X(t=>t.map(e=>this.assembler.toEntityFromResource(e))),Ot(this.handleError("Failed to fetch billing records by userId")))}};var le=class i extends bn{constructor(t){super();this.http=t;this.subscriptionsEndpoint=new ae(t),this.billingRecordsEndpoint=new ce(t)}subscriptionsEndpoint;billingRecordsEndpoint;getSubscriptionByUser(t){return this.subscriptionsEndpoint.getByUserId(t)}activateSubscription(t,e,o,a){return this.subscriptionsEndpoint.activate(t,e,o,a)}upgradeSubscription(t,e,o,a){return this.subscriptionsEndpoint.upgradePlan(t,e,o,a)}updateSubscription(t){return this.subscriptionsEndpoint.update(t,t.id)}getBillingRecordsByUser(t){return this.billingRecordsEndpoint.getByUserId(t)}createBillingRecord(t){return this.billingRecordsEndpoint.create(t)}static \u0275fac=function(e){return new(e||i)(qe(un))};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})};var de=class i{api=r(le);iamStore=r(fn);snackBar=r(ie);translate=r(Yt);subscriptionSignal=H(null);billingHistorySignal=H([]);upgradeLoading=H(!1);currentPlan=G(()=>this.subscriptionSignal()?.plan??null);isActive=G(()=>this.subscriptionSignal()?.status==="ACTIVE");activePlan=G(()=>this.iamStore.currentPlan());segment=G(()=>this.iamStore.currentSegment());billingHistory=G(()=>{let n=this.iamStore.currentUser()?.id,t=this.billingHistorySignal();if(n==null)return t;let e=t.filter(o=>o.userId===n);return e.length>0?e:[]});constructor(){this.loadSubscription()}loadSubscription(){let n=this.iamStore.currentUser()?.id;n&&(this.api.getSubscriptionByUser(n).pipe(At(2)).subscribe({next:t=>{t&&this.subscriptionSignal.set(t)},error:()=>{}}),this.api.getBillingRecordsByUser(n).pipe(At(2)).subscribe({next:t=>this.billingHistorySignal.set(t),error:()=>{}}))}upgradePlan(n,t="tok_visa"){let e=this.iamStore.currentUser();if(!e)return;let o=this.subscriptionSignal(),a=this.tierPrice(n);this.upgradeLoading.set(!0),o?.id?this.api.upgradeSubscription(o.id,e.id,n,t).subscribe({next:s=>{this.subscriptionSignal.set(s),this.iamStore.upgradePlan(n),this.upgradeLoading.set(!1),this.showSnack("subscription.upgrade-success")},error:s=>{this.upgradeLoading.set(!1),this.handlePaymentError(s)}}):this.api.activateSubscription(e.id,n,t,a).subscribe({next:s=>{this.subscriptionSignal.set(s),this.iamStore.upgradePlan(n),this.upgradeLoading.set(!1),this.showSnack("subscription.upgrade-success")},error:s=>{this.upgradeLoading.set(!1),this.handlePaymentError(s)}})}cancelPlan(){let n=new Date;n.setMonth(n.getMonth()+1);let t=n.toLocaleDateString("es-PE"),e=this.subscriptionSignal();if(e){let o=new _t({id:e.id,userId:e.userId,plan:e.plan,status:"CANCELLED",renewalDate:e.renewalDate,price:e.price});this.api.updateSubscription(o).pipe(At(2)).subscribe({next:a=>this.subscriptionSignal.set(a),error:()=>this.subscriptionSignal.set(o)})}return{cancelDate:t,readOnlyDays:30}}handlePaymentError(n){if(n.status===422){if((n.error?.code??"")==="PLAN_TIER_INSUFFICIENT"){this.showSnack("subscription.plan-limit-exceeded");return}this.showSnack("subscription.payment-failed");return}if(n.status===402){this.showSnack("subscription.payment-failed");return}this.showSnack("subscription.payment-failed")}showSnack(n){let t=this.translate.instant(n),e=this.translate.instant("common.close");this.snackBar.open(t,e,{duration:5e3,panelClass:["ot-snack"]})}tierPrice(n){return n==="PLATINUM"?149:n==="GOLD"?79:15}static \u0275fac=function(t){return new(t||i)};static \u0275prov=_({token:i,factory:i.\u0275fac,providedIn:"root"})};var Pi=(i,n)=>n.id,Bi=(i,n)=>n.date;function Fi(i,n){i&1&&(l(0,"div",16)(1,"span",24),m(2),p(3,"translate"),d()()),i&2&&(c(2),g(h(3,1,"subscription.current-plan")))}function Ni(i,n){if(i&1&&(l(0,"div",20),E(1,"i",25),m(2),p(3,"translate"),d()),i&2){let t=n.$implicit;c(2),v(" ",h(3,1,t))}}function Li(i,n){if(i&1&&(l(0,"div",26),E(1,"i",27),m(2),p(3,"translate"),d(),l(4,"button",28),m(5),p(6,"translate"),d()),i&2){let t=y().$implicit;c(2),v(" ",h(3,2,t.lockedMsgKey)),c(3),g(h(6,4,"subscription.btn-unavailable"))}}function Vi(i,n){i&1&&(l(0,"button",21),m(1),p(2,"translate"),d()),i&2&&(c(),g(h(2,1,"subscription.btn-current")))}function ji(i,n){if(i&1){let t=$();l(0,"button",29),D("click",function(){A(t);let o=y().$implicit,a=y();return I(a.openUpgrade(o.id))}),E(1,"i",30),m(2),p(3,"translate"),d()}i&2&&(c(2),v(" ",h(3,1,"subscription.btn-upgrade")," "))}function zi(i,n){if(i&1){let t=$();l(0,"button",31),D("click",function(){A(t);let o=y().$implicit,a=y();return I(a.openDowngrade(o.id))}),E(1,"i",32),m(2),p(3,"translate"),d()}i&2&&(c(2),v(" ",h(3,1,"subscription.btn-downgrade")," "))}function Hi(i,n){if(i&1&&(l(0,"div",15),Y(1,Fi,4,3,"div",16),l(2,"div",17),m(3),p(4,"translate"),d(),l(5,"div",18),m(6),l(7,"span",19),m(8),p(9,"translate"),d()(),Lt(10,Ni,4,3,"div",20,on),Y(12,Li,7,6)(13,Vi,3,3,"button",21)(14,ji,4,3,"button",22)(15,zi,4,3,"button",23),d()),i&2){let t=n.$implicit,e=y();W("current",e.isCurrent(t.id))("disabled",t.locked),c(),U(e.isCurrent(t.id)?1:-1),c(2),g(h(4,9,t.nameKey)),c(3),v("$",t.price),c(2),g(h(9,11,"subscription.per-month")),c(2),Vt(t.featureKeys),c(2),U(t.locked?12:e.isCurrent(t.id)?13:e.store.activePlan()==="GOLD"&&t.id==="PLATINUM"?14:e.store.activePlan()==="PLATINUM"&&t.id==="GOLD"?15:-1)}}function Yi(i,n){i&1&&(l(0,"p",9),m(1),p(2,"translate"),d()),i&2&&(c(),g(h(2,1,"subscription.no-payments")))}function Ui(i,n){if(i&1){let t=$();l(0,"tr")(1,"td"),m(2),d(),l(3,"td"),m(4),d(),l(5,"td"),m(6),d(),l(7,"td")(8,"span",33),m(9),p(10,"translate"),d()(),l(11,"td")(12,"button",34),D("click",function(){A(t);let o=y(2);return I(o.confirmDownload())}),E(13,"i",35),d()()()}if(i&2){let t=n.$implicit;c(2),g(t.date),c(2),g(t.plan),c(2),v("$",t.amount),c(2),W("badge-green",t.status==="COMPLETED")("badge-amber",t.status==="PENDING")("badge-red",t.status==="FAILED"),c(),g(h(10,10,"subscription.status-"+t.status))}}function Wi(i,n){if(i&1&&(l(0,"table")(1,"thead")(2,"tr")(3,"th"),m(4),p(5,"translate"),d(),l(6,"th"),m(7),p(8,"translate"),d(),l(9,"th"),m(10),p(11,"translate"),d(),l(12,"th"),m(13),p(14,"translate"),d(),l(15,"th"),m(16),p(17,"translate"),d()()(),l(18,"tbody"),Lt(19,Ui,14,12,"tr",null,Bi),d()()),i&2){let t=y();c(4),g(h(5,5,"subscription.date")),c(3),g(h(8,7,"subscription.plan")),c(3),g(h(11,9,"subscription.amount")),c(3),g(h(14,11,"subscription.status")),c(3),g(h(17,13,"subscription.receipt")),c(3),Vt(t.store.billingHistory())}}function Xi(i,n){i&1&&(E(0,"i",52),m(1),p(2,"translate")),i&2&&(c(),v(" ",h(2,1,"subscription.payment-processing")," "))}function $i(i,n){i&1&&(E(0,"i",53),m(1),p(2,"translate")),i&2&&(c(),v(" ",h(2,1,"subscription.btn-confirm-payment")," "))}function Zi(i,n){if(i&1){let t=$();l(0,"div",36),D("click",function(){A(t);let o=y();return I(o.closeModals())}),l(1,"div",37),D("click",function(o){return o.stopPropagation()}),l(2,"h3",38),E(3,"i",39),m(4),p(5,"translate"),d(),l(6,"p",40),m(7),p(8,"translate"),d(),l(9,"div",41)(10,"div",42)(11,"span",43),m(12,"+"),d(),m(13),p(14,"translate"),d(),l(15,"div",42)(16,"span",43),m(17,"+"),d(),m(18),p(19,"translate"),d(),l(20,"div",44)(21,"span",43),m(22,"+"),d(),m(23),p(24,"translate"),d()(),l(25,"div",45)(26,"label",46),m(27),p(28,"translate"),d(),l(29,"input",47),D("input",function(o){A(t);let a=y();return I(a.cardToken.set(o.target.value))}),d(),l(30,"div",48),m(31),p(32,"translate"),d()(),l(33,"div",49)(34,"button",50),D("click",function(){A(t);let o=y();return I(o.closeModals())}),m(35),p(36,"translate"),d(),l(37,"button",51),D("click",function(){A(t);let o=y();return I(o.confirmUpgrade())}),Y(38,Xi,3,3)(39,$i,3,3),d()()()()}if(i&2){let t=y();c(4),v(" ",h(5,12,"layout.upgrade-title")),c(3),g(h(8,14,"layout.upgrade-features")),c(6),v(" ",h(14,16,"layout.feature-refinery")," "),c(5),v(" ",h(19,18,"layout.feature-esg")," "),c(5),v(" ",h(24,20,"layout.feature-analytics")," "),c(4),g(h(28,22,"onboarding.card-number")),c(2),zt("value",t.cardToken()),c(2),g(h(32,24,"subscription.test-card-hint")),c(3),zt("disabled",t.store.upgradeLoading()),c(),g(h(36,26,"layout.cancel")),c(2),zt("disabled",t.store.upgradeLoading()),c(),U(t.store.upgradeLoading()?38:39)}}function Ki(i,n){if(i&1){let t=$();l(0,"div",36),D("click",function(){A(t);let o=y();return I(o.closeModals())}),l(1,"div",37),D("click",function(o){return o.stopPropagation()}),l(2,"h3",54),E(3,"i",32),m(4),p(5,"translate"),d(),l(6,"div",41)(7,"div",55),m(8),p(9,"translate"),d(),l(10,"div",55),m(11),p(12,"translate"),d()(),l(13,"div",49)(14,"button",56),D("click",function(){A(t);let o=y();return I(o.closeModals())}),m(15),p(16,"translate"),d(),l(17,"button",57),D("click",function(){A(t);let o=y();return I(o.confirmDowngrade())}),m(18),p(19,"translate"),d()()()()}i&2&&(c(4),v(" ",h(5,5,"subscription.downgrade")),c(4),g(h(9,7,"subscription.downgrade-w1")),c(3),g(h(12,9,"subscription.downgrade-w2")),c(4),g(h(16,11,"layout.cancel")),c(3),v(" ",h(19,13,"common.confirm")," "))}function Gi(i,n){if(i&1){let t=$();l(0,"div",36),D("click",function(){A(t);let o=y();return I(o.closeModals())}),l(1,"div",37),D("click",function(o){return o.stopPropagation()}),l(2,"h3",54),E(3,"i",11),m(4),p(5,"translate"),d(),l(6,"div",58),m(7),p(8,"translate"),d(),l(9,"div",59)(10,"button",56),D("click",function(){A(t);let o=y();return I(o.closeModals())}),m(11),p(12,"translate"),d(),l(13,"button",57),D("click",function(){A(t);let o=y();return I(o.confirmCancel())}),m(14),p(15,"translate"),d()()()()}i&2&&(c(4),v(" ",h(5,4,"subscription.cancel")),c(3),v(" ",h(8,6,"subscription.cancel-warning")," "),c(4),g(h(12,8,"layout.cancel")),c(3),v(" ",h(15,10,"subscription.cancel")," "))}var Jn=class i{store=r(de);translate=r(Yt);snackBar=r(ie);cancelModal=H(!1);upgradeModal=H(null);downgradeModal=H(null);cardToken=H("tok_visa");planCards=G(()=>{let n=this.store.segment(),t=n==="CONSUMER";return[{id:"SILVER",nameKey:"subscription.plan-silver",price:15,featureKeys:["subscription.plan-silver-f1","subscription.plan-silver-f2","subscription.plan-silver-f3"],locked:!t,lockedMsgKey:t?void 0:"subscription.locked-companies"},{id:"GOLD",nameKey:t?"subscription.plan-gold":n==="MINING"?"subscription.plan-gold-mining":"subscription.plan-gold-jewelry",price:79,featureKeys:n==="MINING"?["subscription.plan-gold-mining-f1","subscription.plan-gold-mining-f2","subscription.plan-gold-mining-f3","subscription.plan-gold-mining-f4"]:n==="JEWELRY"?["subscription.plan-gold-jewelry-f1","subscription.plan-gold-jewelry-f2","subscription.plan-gold-jewelry-f3","subscription.plan-gold-jewelry-f4"]:["subscription.plan-gold-consumer-f1","subscription.plan-gold-consumer-f2"],locked:t,lockedMsgKey:t?"subscription.locked-consumers":void 0},{id:"PLATINUM",nameKey:t?"subscription.plan-platinum":n==="MINING"?"subscription.plan-platinum-mining":"subscription.plan-platinum-jewelry",price:149,featureKeys:n==="MINING"?["subscription.plan-plat-mining-f1","subscription.plan-plat-mining-f2","subscription.plan-plat-mining-f3","subscription.plan-plat-mining-f4"]:n==="JEWELRY"?["subscription.plan-plat-jewelry-f1","subscription.plan-plat-jewelry-f2","subscription.plan-plat-jewelry-f3"]:["subscription.plan-plat-consumer-f1","subscription.plan-plat-consumer-f2"],locked:t,lockedMsgKey:t?"subscription.locked-consumers":void 0}]});openUpgrade(n){this.upgradeModal.set(n)}openDowngrade(n){this.downgradeModal.set(n)}closeModals(){this.upgradeModal.set(null),this.downgradeModal.set(null),this.cancelModal.set(!1)}confirmUpgrade(){let n=this.upgradeModal();if(!n)return;let t=this.cardToken().trim()||"tok_visa";this.store.upgradePlan(n,t),this.closeModals()}confirmDowngrade(){this.closeModals();let n=this.translate.instant("subscription.downgrade-scheduled"),t=this.translate.instant("common.close");this.snackBar.open(n,t,{duration:4e3})}confirmCancel(){let n=this.store.cancelPlan();this.closeModals();let t=this.translate.instant("subscription.cancel-confirmed",{date:n.cancelDate}),e=this.translate.instant("common.close");this.snackBar.open(t,e,{duration:5e3})}confirmDownload(){let n=this.translate.instant("subscription.download-receipt"),t=this.translate.instant("common.close");this.snackBar.open(n,t,{duration:3e3})}isCurrent(n){return this.store.activePlan()===n}isConsumer(){return this.store.segment()==="CONSUMER"}static \u0275fac=function(t){return new(t||i)};static \u0275cmp=B({type:i,selectors:[["app-subscription-view"]],decls:33,vars:22,consts:[[1,"page-title"],[1,"ti","ti-credit-card"],[1,"page-sub"],[1,"plan-cards-3"],[1,"plan-card",3,"current","disabled"],[1,"ot-card"],[1,"ot-card-title"],[1,"ti","ti-receipt"],[1,"table-wrap"],[2,"color","#999","text-align","center","padding","20px 0"],[1,"ot-card-title",2,"color","#791F1F"],[1,"ti","ti-ban"],[2,"font-size","13px","color","#666","margin-bottom","12px"],[1,"ot-btn","ot-btn-danger","ot-btn-sm",3,"click"],[1,"modal-overlay"],[1,"plan-card"],[2,"margin-bottom","8px"],[1,"plan-name"],[1,"plan-price"],[1,"plan-freq"],[1,"plan-feature"],["disabled","",1,"ot-btn","ot-btn-sm",2,"margin-top","12px","width","100%","opacity",".55"],[1,"ot-btn","ot-btn-primary","ot-btn-sm",2,"margin-top","12px","width","100%"],[1,"ot-btn","ot-btn-sm",2,"margin-top","12px","width","100%"],[1,"badge","badge-blue"],[1,"ti","ti-check",2,"color","#639922"],[1,"disabled-note"],[1,"ti","ti-lock"],["disabled","",1,"ot-btn","ot-btn-sm",2,"margin-top","12px","width","100%","opacity",".45"],[1,"ot-btn","ot-btn-primary","ot-btn-sm",2,"margin-top","12px","width","100%",3,"click"],[1,"ti","ti-arrow-up"],[1,"ot-btn","ot-btn-sm",2,"margin-top","12px","width","100%",3,"click"],[1,"ti","ti-arrow-down"],[1,"badge"],[1,"ot-btn","ot-btn-sm",3,"click"],[1,"ti","ti-download"],[1,"modal-overlay",3,"click"],[1,"modal-box",3,"click"],[1,"modal-title"],[1,"ti","ti-crown"],[2,"font-size","13px","color","#555","margin-bottom","14px"],[2,"margin-bottom","14px"],[2,"display","flex","align-items","center","gap","6px","margin-bottom","6px"],[1,"badge","badge-green"],[2,"display","flex","align-items","center","gap","6px"],[1,"form-group"],[1,"form-label"],["type","text","placeholder","4242 4242 4242 4242","maxlength","19",3,"input","value"],[2,"font-size","11px","color","#888","margin-top","4px"],[2,"display","flex","gap","10px","margin-top","16px"],[1,"ot-btn",3,"click","disabled"],[1,"ot-btn","ot-btn-primary",2,"flex","1","justify-content","center",3,"click","disabled"],[1,"ti","ti-loader-2",2,"animation","spin 1s linear infinite"],[1,"ti","ti-check"],[1,"modal-title",2,"color","#791F1F"],[1,"alert-box","alert-danger"],[1,"ot-btn",3,"click"],[1,"ot-btn","ot-btn-danger",2,"flex","1","justify-content","center",3,"click"],[1,"alert-box","alert-warning",2,"margin-bottom","14px"],[2,"display","flex","gap","10px"]],template:function(t,e){t&1&&(l(0,"div",0),E(1,"i",1),m(2),p(3,"translate"),d(),l(4,"p",2),m(5),p(6,"translate"),d(),l(7,"div",3),Lt(8,Hi,16,13,"div",4,Pi),d(),l(10,"div",5)(11,"div",6),E(12,"i",7),m(13),p(14,"translate"),d(),l(15,"div",8),Y(16,Yi,3,3,"p",9)(17,Wi,21,15,"table"),d()(),l(18,"div",5)(19,"div",10),E(20,"i",11),m(21),p(22,"translate"),d(),l(23,"p",12),m(24),p(25,"translate"),d(),l(26,"button",13),D("click",function(){return e.cancelModal.set(!0)}),E(27,"i",11),m(28),p(29,"translate"),d()(),Y(30,Zi,40,28,"div",14),Y(31,Ki,20,15,"div",14),Y(32,Gi,16,12,"div",14)),t&2&&(c(2),v(" ",h(3,10,"subscription.title")),c(3),g(h(6,12,"subscription.sub")),c(3),Vt(e.planCards()),c(5),v(" ",h(14,14,"subscription.billing-history")),c(3),U(e.store.billingHistory().length===0?16:17),c(5),v(" ",h(22,16,"subscription.cancel")),c(3),g(h(25,18,"subscription.cancel-desc")),c(4),v(" ",h(29,20,"subscription.cancel")," "),c(2),U(e.upgradeModal()?30:-1),c(),U(e.downgradeModal()?31:-1),c(),U(e.cancelModal()?32:-1))},dependencies:[hn],styles:[".plan-cards-3[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:20px}.plan-cards-2[_ngcontent-%COMP%]{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;margin-bottom:20px}@media(max-width:700px){.plan-cards-3[_ngcontent-%COMP%], .plan-cards-2[_ngcontent-%COMP%]{grid-template-columns:1fr}}.plan-card[_ngcontent-%COMP%]{border:.5px solid #e0e0e0;border-radius:10px;padding:16px;background:#fff;transition:box-shadow .15s}.plan-card[_ngcontent-%COMP%]:hover{box-shadow:0 2px 10px #0000000f}.plan-card.current[_ngcontent-%COMP%]{border:2px solid var(--ot-primary)}.plan-card.disabled[_ngcontent-%COMP%]{opacity:.65}.plan-name[_ngcontent-%COMP%]{font-size:15px;font-weight:700;margin-bottom:4px}.plan-price[_ngcontent-%COMP%]{font-size:22px;font-weight:700;color:var(--ot-primary);margin-bottom:10px}.plan-freq[_ngcontent-%COMP%]{font-size:12px;font-weight:400;color:#888}.plan-feature[_ngcontent-%COMP%]{font-size:12px;color:#555;margin-bottom:4px;display:flex;align-items:center;gap:5px}.disabled-note[_ngcontent-%COMP%]{font-size:11px;color:#888;margin-top:8px;text-align:center}.toast-msg[_ngcontent-%COMP%]{position:fixed;bottom:24px;right:24px;background:#eaf3de;color:#27500a;border:.5px solid #C0DD97;padding:10px 16px;border-radius:8px;font-size:13px;font-weight:500;z-index:9999;animation:_ngcontent-%COMP%_slideIn .2s ease}@keyframes _ngcontent-%COMP%_slideIn{0%{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.table-wrap[_ngcontent-%COMP%]{overflow-x:auto}.modal-overlay[_ngcontent-%COMP%]{position:fixed;inset:0;background:#0006;display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}.modal-box[_ngcontent-%COMP%]{background:#fff;border-radius:12px;padding:28px;width:100%;max-width:460px;box-shadow:0 8px 32px #00000026}.modal-title[_ngcontent-%COMP%]{font-size:18px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:6px}"]})};export{Jn as SubscriptionView};
