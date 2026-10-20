var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function u(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var d={},f=[],p=()=>{},m=()=>!1,h=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),g=e=>e.startsWith(`onUpdate:`),_=Object.assign,v=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},y=Object.prototype.hasOwnProperty,b=(e,t)=>y.call(e,t),x=Array.isArray,S=e=>j(e)===`[object Map]`,C=e=>j(e)===`[object Set]`,w=e=>j(e)===`[object Date]`,T=e=>typeof e==`function`,E=e=>typeof e==`string`,D=e=>typeof e==`symbol`,O=e=>typeof e==`object`&&!!e,k=e=>(O(e)||T(e))&&T(e.then)&&T(e.catch),A=Object.prototype.toString,j=e=>A.call(e),M=e=>j(e).slice(8,-1),N=e=>j(e)===`[object Object]`,P=e=>E(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,F=u(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),I=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},L=/-\w/g,R=I(e=>e.replace(L,e=>e.slice(1).toUpperCase())),ee=/\B([A-Z])/g,z=I(e=>e.replace(ee,`-$1`).toLowerCase()),B=I(e=>e.charAt(0).toUpperCase()+e.slice(1)),V=I(e=>e?`on${B(e)}`:``),te=(e,t)=>!Object.is(e,t),ne=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},re=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},ie=e=>{let t=parseFloat(e);return isNaN(t)?e:t},ae,H=()=>ae||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function oe(e){if(x(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=E(r)?le(r):oe(r);if(i)for(let e in i)t[e]=i[e]}return t}if(E(e)||O(e))return e}var se=/;(?![^(]*\))/g,U=/:([^]+)/,ce=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function le(e){let t={};return e.replace(ce,e=>e.startsWith(`/*`)?``:e).split(se).forEach(e=>{if(e){let n=e.split(U);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function ue(e){let t=``;if(E(e))t=e;else if(x(e))for(let n=0;n<e.length;n++){let r=ue(e[n]);r&&(t+=r+` `)}else if(O(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var de=u(`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly`);function fe(e){return!!e||e===``}function pe(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let i=0;r&&i<e.length;i++)r=_e(e[i],t[i],n);return r}function me(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),i=new Uint8Array(r.length);for(let t of e){let e=-1;for(let a=0;a<r.length;a++)if(!i[a]&&_e(t,r[a],n)){e=a;break}if(e<0)return!1;i[e]=1}return!0}function he(e,t,n){let r=S(e),i=S(t);if(r||i||(r=C(e),i=C(t),r||i))return r&&i?me(e,t,n):!1;if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){let i=e.hasOwnProperty(r),a=t.hasOwnProperty(r);if(i&&!a||!i&&a||!_e(e[r],t[r],n))return!1}return String(e)===String(t)}function ge(e,t,n,r){n||=[new Map,new Map];let[i,a]=n;if(i.has(e)||a.has(t))return i.get(e)===t&&a.get(t)===e;i.set(e,t),a.set(t,e);let o=r(e,t,n);return i.delete(e),a.delete(t),o}function _e(e,t,n){if(e===t)return!0;let r=w(e),i=w(t);return r||i?r&&i?e.getTime()===t.getTime():!1:(r=D(e),i=D(t),r||i?e===t:(r=x(e),i=x(t),r||i?r&&i?ge(e,t,n,pe):!1:(r=O(e),i=O(t),r||i?!r||!i?!1:ge(e,t,n,he):String(e)===String(t))))}function ve(e,t){return e.findIndex(e=>_e(e,t))}var ye=e=>!!(e&&e.__v_isRef===!0),be=e=>E(e)?e:e==null?``:x(e)||O(e)&&(e.toString===A||!T(e.toString))?ye(e)?be(e.value):JSON.stringify(e,xe,2):String(e),xe=(e,t)=>ye(t)?xe(e,t.value):S(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[Se(t,r)+` =>`]=n,e),{})}:C(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>Se(e))}:D(t)?Se(t):O(t)&&!x(t)&&!N(t)?String(t):t,Se=(e,t=``)=>D(e)?`Symbol(${e.description??t})`:e,Ce,we=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&Ce&&(Ce.active?(this.parent=Ce,this.index=(Ce.scopes||(Ce.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=Ce;try{return Ce=this,e()}finally{Ce=t}}}on(){++this._on===1&&(this.prevScope=Ce,Ce=this)}off(){if(this._on>0&&--this._on===0){if(Ce===this)Ce=this.prevScope;else{let e=Ce;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function Te(){return Ce}var Ee,De=new WeakSet,Oe=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Ce&&(Ce.active?Ce.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,De.has(this)&&(De.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Me(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ge(this),Fe(this);let e=Ee,t=Ve;Ee=this,Ve=!0;try{return this.fn()}finally{Ie(this),Ee=e,Ve=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)ze(e);this.deps=this.depsTail=void 0,Ge(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?De.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Le(this)&&this.run()}get dirty(){return Le(this)}},ke=0,Ae,je;function Me(e,t=!1){e.flags|=8,t?(e.next=je,je=e):(e.next=Ae,Ae=e)}function Ne(){ke++}function Pe(){if(--ke>0)return;if(je){let e=je;for(je=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Ae;){let t=Ae;for(Ae=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Fe(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ie(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),ze(r),Be(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Le(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Re(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Re(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ke)||(e.globalVersion=Ke,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Le(e))))return;e.flags|=2;let t=e.dep,n=Ee,r=Ve;Ee=e,Ve=!0;try{Fe(e);let n=e.fn(e._value);(t.version===0||te(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{Ee=n,Ve=r,Ie(e),e.flags&=-3}}function ze(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)ze(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Be(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Ve=!0,He=[];function Ue(){He.push(Ve),Ve=!1}function We(){let e=He.pop();Ve=e===void 0||e}function Ge(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=Ee;Ee=void 0;try{t()}finally{Ee=e}}}var Ke=0,qe=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Je=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Ee||!Ve||Ee===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Ee)t=this.activeLink=new qe(Ee,this),Ee.deps?(t.prevDep=Ee.depsTail,Ee.depsTail.nextDep=t,Ee.depsTail=t):Ee.deps=Ee.depsTail=t,Ye(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=Ee.depsTail,t.nextDep=void 0,Ee.depsTail.nextDep=t,Ee.depsTail=t,Ee.deps===t&&(Ee.deps=e)}return t}trigger(e){this.version++,Ke++,this.notify(e)}notify(e){Ne();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Pe()}}};function Ye(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Ye(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Xe=new WeakMap,Ze=Symbol(``),Qe=Symbol(``),$e=Symbol(``);function et(e,t,n){if(Ve&&Ee){let t=Xe.get(e);t||Xe.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Je),r.map=t,r.key=n),r.track()}}function tt(e,t,n,r,i,a){let o=Xe.get(e);if(!o){Ke++;return}let s=e=>{e&&e.trigger()};if(Ne(),t===`clear`)o.forEach(s);else{let i=x(e),a=i&&P(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===$e||!D(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get($e)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(Ze)),S(e)&&s(o.get(Qe)));break;case`delete`:i||(s(o.get(Ze)),S(e)&&s(o.get(Qe)));break;case`set`:S(e)&&s(o.get(Ze))}}Pe()}function nt(e){let t=W(e);return t===e||(et(t,`iterate`,$e),Ht(e))?t:Vt(e)?Bt(e)?t.map(e=>Kt(Gt(e))):t.map(Kt):t.map(Gt)}function rt(e){return et(e=W(e),`iterate`,$e),e}function it(e,t){return Vt(e)?Kt(Bt(e)?Gt(t):t):Gt(t)}var at={__proto__:null,[Symbol.iterator](){return ot(this,Symbol.iterator,e=>it(this,e))},concat(...e){return nt(this).concat(...e.map(e=>x(e)?nt(e):e))},entries(){return ot(this,`entries`,e=>(e[1]=it(this,e[1]),e))},every(e,t){return lt(this,`every`,e,t,void 0,arguments)},filter(e,t){return lt(this,`filter`,e,t,e=>e.map(e=>it(this,e)),arguments)},find(e,t){return lt(this,`find`,e,t,e=>it(this,e),arguments)},findIndex(e,t){return lt(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return lt(this,`findLast`,e,t,e=>it(this,e),arguments)},findLastIndex(e,t){return lt(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return lt(this,`forEach`,e,t,void 0,arguments)},includes(...e){return dt(this,`includes`,e)},indexOf(...e){return dt(this,`indexOf`,e)},join(e){return nt(this).join(e)},lastIndexOf(...e){return dt(this,`lastIndexOf`,e)},map(e,t){return lt(this,`map`,e,t,void 0,arguments)},pop(){return ft(this,`pop`)},push(...e){return ft(this,`push`,e)},reduce(e,...t){return ut(this,`reduce`,e,t)},reduceRight(e,...t){return ut(this,`reduceRight`,e,t)},shift(){return ft(this,`shift`)},some(e,t){return lt(this,`some`,e,t,void 0,arguments)},splice(...e){return ft(this,`splice`,e)},toReversed(){return nt(this).toReversed()},toSorted(e){return nt(this).toSorted(e)},toSpliced(...e){return nt(this).toSpliced(...e)},unshift(...e){return ft(this,`unshift`,e)},values(){return ot(this,`values`,e=>it(this,e))}};function ot(e,t,n){let r=rt(e),i=r[t],a=i.call(r);if(r!==e&&!Ht(e)){if(a[Symbol.toStringTag]===`Array Iterator`){let e=Object.create(Object.getPrototypeOf(a));return e.next=()=>st(a.next(),n),i!==ct[t]&&Object.defineProperties(e,{return:{get(){let e=a.return;return typeof e==`function`?e.bind(a):e}},throw:{get(){let e=a.throw;return typeof e==`function`?e.bind(a):e}}}),e}a._next=a.next,a.next=()=>st(a._next(),n)}return a}function st(e,t){return e.done||(e.value=t(e.value)),e}var ct=Array.prototype;function lt(e,t,n,r,i,a){let o=rt(e),s=o!==e&&!Ht(e),c=o[t];if(c!==ct[t]){let t=c.apply(e,a);return s?Gt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,it(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function ut(e,t,n,r){let i=rt(e),a=i!==e&&!Ht(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=it(e,t)),n.call(this,t,it(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?it(e,c):c}function dt(e,t,n){let r=W(e);et(r,`iterate`,$e);let i=r[t](...n);return(i===-1||i===!1)&&Ut(n[0])?(n[0]=W(n[0]),r[t](...n)):i}function ft(e,t,n=[]){Ue(),Ne();let r=W(e)[t].apply(e,n);return Pe(),We(),r}var pt=u(`__proto__,__v_isRef,__isVue`),mt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(D));function ht(e){D(e)||(e=String(e));let t=W(this);return et(t,`has`,e),t.hasOwnProperty(e)}var gt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Pt:Nt:i?Mt:jt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=x(e);if(!r){let e;if(a&&(e=at[t]))return e;if(t===`hasOwnProperty`)return ht}let o=Reflect.get(e,t,qt(e)?e:n);if((D(t)?mt.has(t):pt(t))||(r||et(e,`get`,t),i))return o;if(qt(o)){let e=a&&P(t)?o:o.value;return r&&O(e)?Rt(e):e}return O(o)?r?Rt(o):It(o):o}},_t=class extends gt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=x(e)&&P(t);if(!this._isShallow){let e=Vt(i);if(!Ht(n)&&!Vt(n)&&(i=W(i),n=W(n)),!a&&qt(i)&&!qt(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:b(e,t),s=Reflect.set(e,t,n,qt(e)?e:r);return e===W(r)&&s&&(o?te(n,i)&&tt(e,`set`,t,n,i):tt(e,`add`,t,n)),s}deleteProperty(e,t){let n=b(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&tt(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!D(t)||!mt.has(t))&&et(e,`has`,t),n}ownKeys(e){return et(e,`iterate`,x(e)?`length`:Ze),Reflect.ownKeys(e)}},vt=class extends gt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},yt=new _t,bt=new vt,xt=new _t(!0),St=e=>e,Ct=e=>Reflect.getPrototypeOf(e);function wt(e,t,n){return function(...r){let i=this.__v_raw,a=W(i),o=S(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?St:t?Kt:Gt;return!t&&et(a,`iterate`,c?Qe:Ze),_(Object.create(l),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}}})}}function Tt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Et(e,t){let n={get(n){let r=this.__v_raw,i=W(r),a=W(n);e||(te(n,a)&&et(i,`get`,n),et(i,`get`,a));let{has:o}=Ct(i),s=t?St:e?Kt:Gt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&et(W(t),`iterate`,Ze),t.size},has(t){let n=this.__v_raw,r=W(n),i=W(t);return e||(te(t,i)&&et(r,`has`,t),et(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=W(a),s=t?St:e?Kt:Gt;return!e&&et(o,`iterate`,Ze),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return _(n,e?{add:Tt(`add`),set:Tt(`set`),delete:Tt(`delete`),clear:Tt(`clear`)}:{add(e){let n=W(this),r=Ct(n),i=W(e),a=!t&&!Ht(e)&&!Vt(e)?i:e;return r.has.call(n,a)||te(e,a)&&r.has.call(n,e)||te(i,a)&&r.has.call(n,i)||(n.add(a),tt(n,`add`,a,a)),this},set(e,n){!t&&!Ht(n)&&!Vt(n)&&(n=W(n));let r=W(this),{has:i,get:a}=Ct(r),o=i.call(r,e);o||=(e=W(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?te(n,s)&&tt(r,`set`,e,n,s):tt(r,`add`,e,n),this},delete(e){let t=W(this),{has:n,get:r}=Ct(t),i=n.call(t,e);i||=(e=W(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&tt(t,`delete`,e,void 0,a),o},clear(){let e=W(this),t=e.size!==0,n=e.clear();return t&&tt(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=wt(r,e,t)}),n}function Dt(e,t){let n=Et(e,t);return(r,i,a)=>i===`__v_isReactive`?!e:i===`__v_isReadonly`?e:i===`__v_isShallow`?t:i===`__v_raw`?r:Reflect.get(b(n,i)&&i in r?n:r,i,a)}var Ot={get:Dt(!1,!1)},kt={get:Dt(!1,!0)},At={get:Dt(!0,!1)},jt=new WeakMap,Mt=new WeakMap,Nt=new WeakMap,Pt=new WeakMap;function Ft(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function It(e){return Vt(e)?e:zt(e,!1,yt,Ot,jt)}function Lt(e){return zt(e,!1,xt,kt,Mt)}function Rt(e){return zt(e,!0,bt,At,Nt)}function zt(e,t,n,r,i){if(!O(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=Ft(M(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function Bt(e){return Vt(e)?Bt(e.__v_raw):!!(e&&e.__v_isReactive)}function Vt(e){return!!(e&&e.__v_isReadonly)}function Ht(e){return!!(e&&e.__v_isShallow)}function Ut(e){return e?!!e.__v_raw:!1}function W(e){let t=e&&e.__v_raw;return t?W(t):e}function Wt(e){return!b(e,`__v_skip`)&&Object.isExtensible(e)&&re(e,`__v_skip`,!0),e}var Gt=e=>O(e)?It(e):e,Kt=e=>O(e)?Rt(e):e;function qt(e){return e?e.__v_isRef===!0:!1}function Jt(e){return qt(e)?e.value:e}var Yt={get:(e,t,n)=>t===`__v_raw`?e:Jt(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return qt(i)&&!qt(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Xt(e){return Bt(e)?e:new Proxy(e,Yt)}var Zt=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Je(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ke-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&Ee!==this)return Me(this,!0),!0}get value(){let e=this.dep.track();return Re(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function Qt(e,t,n=!1){let r,i;return T(e)?r=e:(r=e.get,i=e.set),new Zt(r,i,n)}var $t={},G=new WeakMap,K=void 0;function en(e,t=!1,n=K){if(n){let t=G.get(n);t||G.set(n,t=[]),t.push(e)}}function tn(e,t,n=d){let{immediate:r,deep:i,once:a,scheduler:o,augmentJob:s,call:c}=n,l=e=>i?e:Ht(e)||i===!1||i===0?nn(e,1):nn(e),u,f,m,h,g=!1,_=!1;if(qt(e)?(f=()=>e.value,g=Ht(e)):Bt(e)?(f=()=>l(e),g=!0):x(e)?(_=!0,g=e.some(e=>Bt(e)||Ht(e)),f=()=>e.map(e=>{if(qt(e))return e.value;if(Bt(e))return l(e);if(T(e))return c?c(e,2):e()})):f=T(e)?t?c?()=>c(e,2):e:()=>{if(m){Ue();try{m()}finally{We()}}let t=K;K=u;try{return c?c(e,3,[h]):e(h)}finally{K=t}}:p,t&&i){let e=f,t=i===!0?1/0:i;f=()=>nn(e(),t)}let y=Te(),b=()=>{u.stop(),y&&y.active&&v(y.effects,u)};if(a&&t){let e=t;t=(...t)=>{try{return e(...t)}finally{b()}}}let S=_?Array(e.length).fill($t):$t,C=e=>{if(u.flags&1&&(u.dirty||e)){if(t){let n=u.run();if(e||i||g||(_?n.some((e,t)=>te(e,S[t])):te(n,S))){let e=K;Ue();try{m&&m(),K=u;let e=[n,S===$t?void 0:_&&S[0]===$t?[]:S,h];S=n,c?c(t,3,e):t(...e)}finally{K=e,We()}}}else u.run()}};return s&&s(C),u=new Oe(f),u.scheduler=o?()=>o(C,!1):C,h=e=>en(e,!1,u),m=u.onStop=()=>{let e=G.get(u);if(e){if(c)c(e,4);else for(let t of e)t();G.delete(u)}},t?r?C(!0):S=u.run():o?o(C.bind(null,!0),!0):u.run(),b.pause=u.pause.bind(u),b.resume=u.resume.bind(u),b.stop=b,b}function nn(e,t=1/0,n){if(t<=0||!O(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,qt(e))nn(e.value,t,n);else if(x(e))for(let r=0;r<e.length;r++)nn(e[r],t,n);else if(C(e)||S(e))e.forEach(e=>{nn(e,t,n)});else if(N(e)){for(let r in e)nn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&nn(e[r],t,n)}return e}function q(e,t,n,r){try{return r?e(...r):e()}catch(e){an(e,t,n)}}function rn(e,t,n,r){if(T(e)){let i=q(e,t,n,r);return i&&k(i)&&i.catch(e=>{an(e,t,n)}),i}if(x(e)){let i=[];for(let a=0;a<e.length;a++)i.push(rn(e[a],t,n,r));return i}}function an(e,t,n,r=!0){let i=t?t.vnode:null,{errorHandler:a,throwUnhandledErrorInProduction:o}=t&&t.appContext.config||d;if(t){let r=t.parent,i=t.proxy,o=`https://vuejs.org/error-reference/#runtime-${n}`;for(;r;){let t=r.ec;if(t){for(let n=0;n<t.length;n++)if(t[n](e,i,o)===!1)return}r=r.parent}if(a){Ue(),q(a,null,10,[e,i,o]),We();return}}J(e,n,i,r,o)}function J(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var on=[],sn=-1,cn=[],ln=null,un=0,dn=Promise.resolve(),Y=null;function fn(e){let t=Y||dn;return e?t.then(this?e.bind(this):e):t}function pn(e){let t=sn+1,n=on.length;for(;t<n;){let r=t+n>>>1,i=on[r],a=xn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function mn(e){if(!(e.flags&1)){let t=xn(e),n=on[on.length-1];!n||!(e.flags&2)&&t>=xn(n)?on.push(e):on.splice(pn(t),0,e),e.flags|=1,hn()}}function hn(){Y||=dn.then(Sn)}function gn(e){if(!x(e))ln&&e.id===-1?ln.splice(un+1,0,e):e.flags&1||(cn.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)cn.push(e[t]);hn()}function _n(e,t,n,r=sn+1){for(;r<on.length;r++){let n=on[r];if(n&&n.flags&2){if(e&&n.id!==e.uid||t!==void 0&&!(n.id>=t))continue;on.splice(r,1),r=e?r-1:sn,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function vn(e,t,n=0){if(cn.length){let e=cn,r=0;if(t){e=[];for(let i=0;i<cn.length;i++){let a=cn[i];(a.i===void 0?t.has(a):!a.i||a.i.uid<n)?cn[r++]=a:e.push(a)}}let i=[...new Set(e)].sort((e,t)=>xn(e)-xn(t));if(cn.length=r,ln){for(let e=0;e<i.length;e++)ln.push(i[e]);return}for(ln=i,un=0;un<ln.length;un++){let e=ln[un];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}ln=null,un=0}}var yn=!1;function bn(e,t){if(yn){e();return}let n=t===void 0?void 0:new Set(cn);e(),yn=!0;try{_n(void 0,t),vn(void 0,n,t)}finally{yn=!1}}var xn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Sn(e){try{for(sn=0;sn<on.length;sn++){let e=on[sn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),q(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;sn<on.length;sn++){let e=on[sn];e&&(e.flags&=-2)}sn=-1,on.length=0,vn(e),Y=null,(on.length||cn.length)&&Sn(e)}}var Cn=null,wn=null;function Tn(e){let t=Cn;return Cn=e,wn=e&&e.type.__scopeId||null,t}function En(e,t=Cn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Hi(-1);let i=Tn(t),a=Ri.length,o;try{o=e(...n)}finally{for(let e=Ri.length;e>a;e--)Bi();Tn(i),r._d&&Hi(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Dn(e,t){if(Cn===null)return e;let n=wa(Cn),r=e.dirs||=[];for(let e=0;e<t.length;e++){let[i,a,o,s=d]=t[e];i&&(T(i)&&(i={mounted:i,updated:i}),i.deep&&nn(a),r.push({dir:i,instance:n,value:a,oldValue:void 0,arg:o,modifiers:s}))}return e}function On(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Ue(),rn(c,n,8,[e.el,s,e,t]),We())}}function kn(e,t){if(ua){let n=ua.provides,r=ua.parent&&ua.parent.provides;r===n&&(n=ua.provides=Object.create(r)),n[e]=t}}function An(e,t,n=!1){let r=da();if(r||Ur){let i=Ur?Ur._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&T(t)?t.call(r&&r.proxy):t}}var jn=Symbol.for(`v-scx`),Mn=()=>An(jn);function Nn(e,t,n){return Pn(e,t,n)}function Pn(e,t,n=d){let{immediate:r,deep:i,flush:a,once:o}=n,s=_({},n),c=t&&r||!t&&a!==`post`,l;if(_a){if(a===`sync`){let e=Mn();l=e.__watcherHandles||=[]}else if(!c){let e=()=>{};return e.stop=p,e.resume=p,e.pause=p,e}}let u=ua;s.call=(e,t,n)=>rn(e,u,t,n);let f=!1;a===`post`?s.scheduler=e=>{e.i=u,xi(e,u&&u.suspense)}:a!==`sync`&&(f=!0,s.scheduler=(e,t)=>{t?e():mn(e)}),s.augmentJob=e=>{t&&(e.flags|=4),f&&(e.flags|=2,u&&(e.id=u.uid,e.i=u))};let m=tn(e,t,s);return _a&&(l?l.push(m):c&&m()),m}function Fn(e,t,n){let r=this.proxy,i=E(e)?e.includes(`.`)?In(r,e):()=>r[e]:e.bind(r,r),a;T(t)?a=t:(a=t.handler,n=t);let o=ma(this),s=Pn(i,a.bind(r),n);return o(),s}function In(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Ln=Symbol(`_vte`),Rn=e=>e.__isTeleport,zn=Symbol(`_leaveCb`);function Bn(e){let t=e[0];if(e.length>1){for(let n of e)if(n.type!==Ii){t=n;break}}return t}function Vn(e){if(!Yn(e))return Rn(e.type)&&e.children?Bn(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&T(n.default))return n.default()}}function Hn(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Hn(Rn(n.type)&&Vn(n)||n,t)}else if(e.shapeFlag&128)e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback);else if(e.transition=t,e.type===Pi&&x(e.children)){let n=Xr(e.children,!1);n&&Hn(n,t)}}function Un(e){if(e.component)return Un(e.component.subTree);if(e.type===Pi){let t=x(e.children)&&Xr(e.children,!1);return t?Un(t):void 0}if(e.type!==Ii)return e}function Wn(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function Gn(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var Kn=new WeakMap;function X(e,t,n,r,i=!1){if(x(e)){e.forEach((e,a)=>X(e,t&&(x(t)?t[a]:t),n,r,i));return}if(Jn(r)&&!i){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&X(e,t,n,r.component.subTree);return}let a=r.shapeFlag&4?wa(r.component):r.el,o=i?null:a,{i:s,r:c}=e,l=t&&t.r,u=s.refs===d?s.refs={}:s.refs,f=s.setupState,p=W(f),h=f===d?m:e=>!Gn(u,e)&&b(p,e),g=(e,t)=>!(t&&Gn(u,t));if(l!=null&&l!==c){if(qn(t),E(l))u[l]=null,h(l)&&(f[l]=null);else if(qt(l)){let e=t;g(l,e.k)&&(l.value=null),e.k&&(u[e.k]=null)}}if(T(c))q(c,s,12,[o,u]);else{let t=E(c),r=qt(c);if(t||r){let s=()=>{if(e.f){let n=t?h(c)?f[c]:u[c]:g(c)||!e.k?c.value:u[e.k];if(i)x(n)&&v(n,a);else if(x(n))n.includes(a)||n.push(a);else if(t)u[c]=[a],h(c)&&(f[c]=u[c]);else{let t=[a];g(c,e.k)&&(c.value=t),e.k&&(u[e.k]=t)}}else t?(u[c]=o,h(c)&&(f[c]=o)):r&&(g(c,e.k)&&(c.value=o),e.k&&(u[e.k]=o))};if(o){let t=()=>{s(),Kn.delete(e)};t.id=-1,Kn.set(e,t),xi(t,n)}else qn(e),s()}}}function qn(e){let t=Kn.get(e);t&&(t.flags|=8,Kn.delete(e))}H().requestIdleCallback,H().cancelIdleCallback;var Jn=e=>!!e.type.__asyncLoader,Yn=e=>e.type.__isKeepAlive;function Xn(e,t){Qn(e,`a`,t)}function Zn(e,t){Qn(e,`da`,t)}function Qn(e,t,n=ua){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(er(t,r,n),n){let e=n.parent;for(;e&&e.parent;)Yn(e.parent.vnode)&&$n(r,t,n,e),e=e.parent}}function $n(e,t,n,r){let i=er(t,e,r,!0);sr(()=>{v(r[t],i)},n)}function er(e,t,n=ua,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Ue();let i=ma(n),a=rn(t,n,e,r);return i(),We(),a};return r?i.unshift(a):i.push(a),a}}var tr=e=>(t,n=ua)=>{(!_a||e===`sp`)&&er(e,(...e)=>t(...e),n)},nr=tr(`bm`),rr=tr(`m`),ir=tr(`bu`),ar=tr(`u`),or=tr(`bum`),sr=tr(`um`),cr=tr(`sp`),lr=tr(`rtg`),ur=tr(`rtc`);function dr(e,t=ua){er(`ec`,e,t)}var fr=`components`;function pr(e,t){return hr(fr,e,!0,t)||e}var mr=Symbol.for(`v-ndc`);function hr(e,t,n=!0,r=!1){let i=Cn||ua;if(i){let n=i.type;if(e===fr){let e=Ta(n,!1);if(e&&(e===t||e===R(t)||e===B(R(t))))return n}let a=gr(i[e]||n[e],t)||gr(i.appContext[e],t);return!a&&r?n:a}}function gr(e,t){return e&&(e[t]||e[R(t)]||e[B(R(t))])}function _r(e,t,n,r){let i,a=n&&n[r],o=x(e);if(o||E(e)){let n=o&&Bt(e),r=!1,s=!1;n&&(r=!Ht(e),s=Vt(e),e=rt(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Kt(Gt(e[n])):Gt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){if(!Number.isInteger(e)||e<0)i=[];else{i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}}else if(O(e)){if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}}else i=[];return n&&(n[r]=i),i}function vr(e,t,n,r,i,a){if(n??={},Cn.ce||Cn.parent&&Jn(Cn.parent)&&Cn.parent.ce){let e=a!=null&&n.key==null?_({},n,{key:a}):n,i=Object.keys(e).length>0;return t!=="default"&&(e.name=t),Z(),Gi(Pi,null,[Xi(`slot`,e,r&&r())],i?-2:64)}let o=e[t];o&&o._c&&(o._d=!1);let s=Ri.length;Z();let c;try{let i=o&&yr(o(n)),s=n.key||a||i&&i.key;c=Gi(Pi,{key:(s&&!D(s)?s:`_${t}`)+(!i&&r?`_fb`:``)},i||(r?r():[]),i&&e._===1?64:-2)}catch(e){for(let e=Ri.length;e>s;e--)Bi();throw e}finally{o&&o._c&&(o._d=!0)}return!i&&c.scopeId&&(c.slotScopeIds=[c.scopeId+`-s`]),c}function yr(e){return e.some(e=>!Ki(e)||!(e.type===Ii||e.type===Pi&&!yr(e.children)))?e:null}var br=e=>e?ga(e)?wa(e):br(e.parent):null,xr=_(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>br(e.parent),$root:e=>br(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Ar(e),$forceUpdate:e=>e.f||=()=>{mn(e.update)},$nextTick:e=>e.n||=fn.bind(e.proxy),$watch:e=>Fn.bind(e)}),Sr=(e,t)=>e!==d&&!e.__isScriptSetup&&b(e,t),Cr={get({_:e},t){if(t===`__v_skip`)return!0;let{ctx:n,setupState:r,data:i,props:a,accessCache:o,type:s,appContext:c}=e;if(t[0]!==`$`){let e=o[t];if(e!==void 0)switch(e){case 1:return r[t];case 2:return i[t];case 4:return n[t];case 3:return a[t]}else if(Sr(r,t))return o[t]=1,r[t];else if(i!==d&&b(i,t))return o[t]=2,i[t];else if(b(a,t))return o[t]=3,a[t];else if(n!==d&&b(n,t))return o[t]=4,n[t];else Tr&&(o[t]=0)}let l=xr[t],u,f;if(l)return t===`$attrs`&&et(e.attrs,`get`,``),l(e);if((u=s.__cssModules)&&(u=u[t]))return u;if(n!==d&&b(n,t))return o[t]=4,n[t];if(f=c.config.globalProperties,b(f,t))return f[t]},set({_:e},t,n){let{data:r,setupState:i,ctx:a}=e;return Sr(i,t)?(i[t]=n,!0):r!==d&&b(r,t)?(r[t]=n,!0):b(e.props,t)||t[0]===`$`&&t.slice(1)in e?!1:(a[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:i,props:a,type:o}},s){let c;return!!(n[s]||e!==d&&s[0]!==`$`&&b(e,s)||Sr(t,s)||b(a,s)||b(r,s)||b(xr,s)||b(i.config.globalProperties,s)||(c=o.__cssModules)&&c[s])},defineProperty(e,t,n){return n.get==null?b(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function wr(e){return x(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Tr=!0;function Er(e){let t=Ar(e),n=e.proxy,r=e.ctx;Tr=!1,t.beforeCreate&&Or(t.beforeCreate,e,`bc`);let{data:i,computed:a,methods:o,watch:s,provide:c,inject:l,created:u,beforeMount:d,mounted:f,beforeUpdate:m,updated:h,activated:g,deactivated:_,beforeDestroy:v,beforeUnmount:y,destroyed:b,unmounted:S,render:C,renderTracked:w,renderTriggered:E,errorCaptured:D,serverPrefetch:k,expose:A,inheritAttrs:j,components:M,directives:N,filters:P}=t;if(l&&Dr(l,r,null),o)for(let e in o){let t=o[e];T(t)&&(r[e]=t.bind(n))}if(i){let t=i.call(n,n);O(t)&&(e.data=It(t))}if(Tr=!0,a)for(let e in a){let t=a[e],i=Da({get:T(t)?t.bind(n,n):T(t.get)?t.get.bind(n,n):p,set:!T(t)&&T(t.set)?t.set.bind(n):p});Object.defineProperty(r,e,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e})}if(s)for(let e in s)kr(s[e],r,n,e);if(c){let e=T(c)?c.call(n):c;Reflect.ownKeys(e).forEach(t=>{kn(t,e[t])})}u&&Or(u,e,`c`);function F(e,t){x(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(F(nr,d),F(rr,f),F(ir,m),F(ar,h),F(Xn,g),F(Zn,_),F(dr,D),F(ur,w),F(lr,E),F(or,y),F(sr,S),F(cr,k),x(A)){if(A.length){let t=e.exposed||={};A.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={}}C&&e.render===p&&(e.render=C),j!=null&&(e.inheritAttrs=j),M&&(e.components=M),N&&(e.directives=N),k&&Wn(e)}function Dr(e,t,n=p){x(e)&&(e=Fr(e));for(let n in e){let r=e[n],i;i=O(r)?`default`in r?An(r.from||n,r.default,!0):An(r.from||n):An(r),qt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function Or(e,t,n){rn(x(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function kr(e,t,n,r){let i=r.includes(`.`)?In(n,r):()=>n[r];if(E(e)){let n=t[e];T(n)&&Nn(i,n)}else if(T(e))Nn(i,e.bind(n));else if(O(e)){if(x(e))e.forEach(e=>kr(e,t,n,r));else{let r=T(e.handler)?e.handler.bind(n):t[e.handler];T(r)&&Nn(i,r,e)}}}function Ar(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>jr(c,e,o,!0)),jr(c,t,o)),O(t)&&a.set(t,c),c}function jr(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&jr(e,a,n,!0),i&&i.forEach(t=>jr(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Mr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Mr={data:Nr,props:Rr,emits:Rr,methods:Lr,computed:Lr,beforeCreate:Ir,created:Ir,beforeMount:Ir,mounted:Ir,beforeUpdate:Ir,updated:Ir,beforeDestroy:Ir,beforeUnmount:Ir,destroyed:Ir,unmounted:Ir,activated:Ir,deactivated:Ir,errorCaptured:Ir,serverPrefetch:Ir,components:Lr,directives:Lr,watch:zr,provide:Nr,inject:Pr};function Nr(e,t){return t?e?function(){return _(T(e)?e.call(this,this):e,T(t)?t.call(this,this):t)}:t:e}function Pr(e,t){return Lr(Fr(e),Fr(t))}function Fr(e){if(x(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Ir(e,t){return e?[...new Set([].concat(e,t))]:t}function Lr(e,t){return e?_(Object.create(null),e,t):t}function Rr(e,t){return e?x(e)&&x(t)?[...new Set([...e,...t])]:_(Object.create(null),wr(e),wr(t??{})):t}function zr(e,t){if(!e)return t;if(!t)return e;let n=_(Object.create(null),e);for(let r in t)n[r]=Ir(e[r],t[r]);return n}function Br(){return{app:null,config:{isNativeTag:m,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Vr=0;function Hr(e,t){return function(n,r=null){T(n)||(n=_({},n)),r!=null&&!O(r)&&(r=null);let i=Br(),a=new WeakSet,o=[],s=!1,c=i.app={_uid:Vr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Oa,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&T(e.install)?(a.add(e),e.install(c,...t)):T(e)&&(a.add(e),e(c,...t))),c},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),c},component(e,t){return t?(i.components[e]=t,c):i.components[e]},directive(e,t){return t?(i.directives[e]=t,c):i.directives[e]},mount(a,o,l){if(!s){let u=c._ceVNode||Xi(n,r);return u.appContext=i,l===!0?l=`svg`:l===!1&&(l=void 0),o&&t?t(u,a):e(u,a,l),s=!0,c._container=a,a.__vue_app__=c,wa(u.component)}},onUnmount(e){o.push(e)},unmount(){s&&(rn(o,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(e,t){return i.provides[e]=t,c},runWithContext(e){let t=Ur;Ur=c;try{return e()}finally{Ur=t}}};return c}}var Ur=null,Wr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${R(t)}Modifiers`]||e[`${z(t)}Modifiers`];function Gr(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||d,i=n,a=t.startsWith(`update:`),o=a&&Wr(r,t.slice(7));o&&(o.trim&&(i=n.map(e=>E(e)?e.trim():e)),o.number&&(i=i.map(ie)));let s,c=r[s=V(t)]||r[s=V(R(t))];!c&&a&&(c=r[s=V(z(t))]),c&&rn(c,e,6,i);let l=r[s+`Once`];if(l){if(!e.emitted)e.emitted={};else if(e.emitted[s])return;e.emitted[s]=!0,rn(l,e,6,i)}}var Kr=new WeakMap;function qr(e,t,n=!1){let r=n?Kr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},s=!1;if(!T(e)){let r=e=>{let n=qr(e,t,!0);n&&(s=!0,_(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!s?(O(e)&&r.set(e,null),null):(x(a)?a.forEach(e=>o[e]=null):_(o,a),O(e)&&r.set(e,o),o)}function Jr(e,t){return!e||!h(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),b(e,t[0].toLowerCase()+t.slice(1))||b(e,z(t))||b(e,t))}function Yr(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:o,attrs:s,emit:c,render:l,renderCache:u,props:d,data:f,setupState:p,ctx:m,inheritAttrs:h}=e,_=Tn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=ta(l.call(t,e,u,d,p,f,m)),y=s}else{let e=t;v=ta(e.length>1?e(d,{attrs:s,slots:o,emit:c}):e(d,null)),y=t.props?s:Zr(s)}}catch(t){Ri.length=0,an(t,e,1),v=Xi(Ii)}let b=v;if(y&&h!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(g)&&(y=Qr(y,a)),b=$i(b,y,!1,!0))}return n.dirs&&(b=$i(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Hn(Rn(b.type)&&Vn(b)||b,n.transition),v=b,Tn(_),v}function Xr(e,t=!0){let n;for(let t=0;t<e.length;t++){let r=e[t];if(Ki(r)){if(r.type!==Ii||r.children===`v-if`){if(n)return;n=r}}else return}return n}var Zr=e=>{let t;for(let n in e)(n===`class`||n===`style`||h(n))&&((t||={})[n]=e[n]);return t},Qr=(e,t)=>{let n={};for(let r in e)(!g(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function $r(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ei(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(ti(o,r,n)&&!Jr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||ei(r,o,l):!!o;return!1}function ei(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(!b(e,a)||ti(t,e,a)&&!Jr(n,a))return!0}return!1}function ti(e,t,n){let r=e[n],i=t[n];return n===`style`&&O(r)&&O(i)?!_e(r,i):r!==i}function ni({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var ri={},ii=()=>Object.create(ri),ai=e=>Object.getPrototypeOf(e)===ri;function oi(e,t,n,r=!1){let i={},a=ii();e.propsDefaults=Object.create(null),ci(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);e.props=n?r?i:Lt(i):e.type.props?i:a,e.attrs=a}function si(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=W(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Jr(e.emitsOptions,o))continue;let u=t[o];if(c){if(b(a,o))u!==a[o]&&(a[o]=u,l=!0);else{let t=R(o);i[t]=li(c,s,t,u,e,!1)}}else u!==a[o]&&(a[o]=u,l=!0)}}}else{ci(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!b(t,a)&&((r=z(a))===a||!b(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=li(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!b(t,e))&&(delete a[e],l=!0)}l&&tt(e.attrs,`set`,``)}function ci(e,t,n,r){let[i,a]=e.propsOptions,o=!1,s;if(t)for(let c in t){if(F(c))continue;let l=t[c],u;i&&b(i,u=R(c))?!a||!a.includes(u)?n[u]=l:(s||={})[u]=l:Jr(e.emitsOptions,c)||(!(c in r)||l!==r[c])&&(r[c]=l,o=!0)}if(a){let t=W(n),r=s||d;for(let o=0;o<a.length;o++){let s=a[o];n[s]=li(i,t,s,r[s],e,!b(r,s))}}return o}function li(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=b(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&T(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=ma(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===z(n))&&(r=!0))}return r}var ui=new WeakMap;function di(e,t,n=!1){let r=n?ui:t.propsCache,i=r.get(e);if(i)return i;let a=e.props,o={},s=[],c=!1;if(!T(e)){let r=e=>{c=!0;let[n,r]=di(e,t,!0);_(o,n),r&&s.push(...r)};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!a&&!c)return O(e)&&r.set(e,f),f;if(x(a))for(let e=0;e<a.length;e++){let t=R(a[e]);fi(t)&&(o[t]=d)}else if(a)for(let e in a){let t=R(e);if(fi(t)){let n=a[e],r=o[t]=x(n)||T(n)?{type:n}:_({},n),i=r.type,c=!1,l=!0;if(x(i))for(let e=0;e<i.length;++e){let t=i[e],n=T(t)&&t.name;if(n===`Boolean`){c=!0;break}n===`String`&&(l=!1)}else c=T(i)&&i.name===`Boolean`;r[0]=c,r[1]=l,(c||b(r,`default`))&&s.push(t)}}let l=[o,s];return O(e)&&r.set(e,l),l}function fi(e){return e[0]!==`$`&&!F(e)}var pi=e=>e===`_`||e===`_ctx`||e===`$stable`,mi=e=>x(e)?e.map(ta):[ta(e)],hi=(e,t,n)=>{if(t._n)return t;let r=En((...e)=>mi(t(...e)),n);return r._c=!1,r},gi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(pi(n))continue;let i=e[n];if(T(i))t[n]=hi(n,i,r);else if(i!=null){let e=mi(i);t[n]=()=>e}}},_i=(e,t)=>{let n=mi(t);e.slots.default=()=>n},vi=(e,t,n)=>{for(let r in t)(n||!pi(r))&&(e[r]=t[r])},yi=(e,t,n)=>{let r=e.slots=ii();if(e.vnode.shapeFlag&32){let e=t._;e?(vi(r,t,n),n&&re(r,`_`,e,!0)):gi(t,r)}else t&&_i(e,t)},bi=(e,t,n)=>{let{vnode:r,slots:i}=e,a=!0,o=d;if(r.shapeFlag&32){let e=t._;e?n&&e===1?a=!1:vi(i,t,n):(a=!t.$stable,gi(t,i)),o=t}else t&&(_i(e,t),o={default:1});if(a)for(let e in i)!pi(e)&&o[e]==null&&delete i[e]},xi=Ni;function Si(e){return Ci(e)}function Ci(e,t){let n=H();n.__VUE__=!0;let{insert:r,remove:i,patchProp:a,createElement:o,createText:s,createComment:c,setText:l,setElementText:u,parentNode:m,nextSibling:h,setScopeId:g=p,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!qi(e,t)&&(r=oe(e),V(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null),t.dynamicChildren&&e&&e.dynamicChildren&&e.dynamicChildren.hasOnce&&(t.dynamicChildren===f&&(t.dynamicChildren=[]),t.dynamicChildren.hasOnce=!0);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Fi:y(e,t,n,r);break;case Ii:b(e,t,n,r);break;case Li:e??x(t,n,r,o);break;case Pi:j(e,t,n,r,i,a,o,s,c);break;default:d&1?w(e,t,n,r,i,a,o,s,c):d&6?M(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,U)}u!=null&&i?X(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&X(e.ref,null,a,e,!0)},y=(e,t,n,i)=>{if(e==null)r(t.el=s(t.children),n,i);else{let n=t.el=e.el;t.children!==e.children&&l(n,t.children)}},b=(e,t,n,i)=>{e==null?r(t.el=c(t.children||``),n,i):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},S=({el:e,anchor:t},n,i)=>{let a;for(;e&&e!==t;)a=h(e),r(e,n,i),e=a;r(t,n,i)},C=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),i(e),e=n;i(t)},w=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)T(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),O(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},T=(e,t,n,i,s,c,l,d)=>{let f,p,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(f=e.el=o(e.type,c,m&&m.is,m),h&8?u(f,e.children):h&16&&D(e.children,f,null,i,s,wi(e,c),l,d),_&&On(e,null,i,`created`),E(f,e,e.scopeId,l,i),m){for(let e in m)e!==`value`&&!F(e)&&a(f,e,null,m[e],c,i);`value`in m&&a(f,`value`,null,m.value,c),(p=m.onVnodeBeforeMount)&&aa(p,i,e)}_&&On(e,null,i,`beforeMount`);let v=Ei(s,g);v&&g.beforeEnter(f),r(f,t,n),((p=m&&m.onVnodeMounted)||v||_)&&xi(()=>{try{p&&aa(p,i,e),v&&g.enter(f),_&&On(e,null,i,`mounted`)}finally{}},s)},E=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Mi(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;E(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},D=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?na(e[l]):ta(e[l]);v(null,c,t,n,r,i,a,o,s)}},O=(e,t,n,r,i,o,s)=>{let c=t.el=e.el,{patchFlag:l,dynamicChildren:f,dirs:p}=t;l|=e.patchFlag&16;let m=e.props||d,h=t.props||d,g;if(n&&Ti(n,!1),(g=h.onVnodeBeforeUpdate)&&aa(g,n,t,e),p&&On(t,e,n,`beforeUpdate`),n&&Ti(n,!0),f&&(!e.dynamicChildren||e.dynamicChildren.length!==f.length)&&(l=0,s=!1,f=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&u(c,``),f?k(e.dynamicChildren,f,c,n,r,wi(t,i),o):s||R(e,t,c,null,n,r,wi(t,i),o,!1),l>0){if(l&16)A(c,m,h,n,i);else if(l&2&&m.class!==h.class&&a(c,`class`,null,h.class,i),l&4&&a(c,`style`,m.style,h.style,i),l&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let r=e[t],o=m[r],s=h[r];(s!==o||r===`value`)&&a(c,r,o,s,i,n)}}l&1&&e.children!==t.children&&u(c,t.children)}else!s&&f==null&&A(c,m,h,n,i);((g=h.onVnodeUpdated)||p)&&xi(()=>{g&&aa(g,n,t,e),p&&On(t,e,n,`updated`)},r)},k=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el||ji(c),d=u&&(c.type===Pi||!qi(c,l)||c.shapeFlag&198)?m(u):n;v(c,l,d,null,r,i,a,o,!0)}},A=(e,t,n,r,i)=>{if(t!==n){if(t!==d)for(let o in t)!F(o)&&!(o in n)&&a(e,o,t[o],null,i,r);for(let o in n){if(F(o))continue;let s=n[o],c=t[o];s!==c&&o!==`value`&&a(e,o,c,s,i,r)}`value`in n&&a(e,`value`,t.value,n.value,i)}},j=(e,t,n,i,a,o,c,l,u)=>{let d=t.el=e?e.el:s(``),f=t.anchor=e?e.anchor:s(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(l=l?l.concat(h):h),e==null?(r(d,n,i),r(f,n,i),D(t.children||[],n,f,a,o,c,l,u)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(k(e.dynamicChildren,m,n,a,o,c,l),(t.key!=null||a&&t===a.subTree)&&Di(e,t,!0)):R(e,t,n,f,a,o,c,l,u)},M=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):N(t,n,r,i,a,o,c):P(e,t,c)},N=(e,t,n,r,i,a,o)=>{let s=e.component=la(e,r,i);if(Yn(e)&&(s.ctx.renderer=U),va(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,I,o,a),!e.el){let r=s.subTree=Xi(Ii);b(null,r,t,n),e.placeholder=r.el}}else I(s,e,t,n,i,a,o)},P=(e,t,n)=>{let r=t.component=e.component;if($r(e,t,n)){if(r.asyncDep&&!r.asyncResolved){t.el=e.el,t.placeholder=e.placeholder,L(r,t,n);return}r.next=t,r.update()}else t.el=e.el,t.placeholder=e.placeholder,r.vnode=t},I=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=ki(e);if(n){t&&(t.el=c.el,L(e,t,o)),n.asyncDep.then(()=>{xi(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;Ti(e,!1),t?(t.el=c.el,L(e,t,o)):t=c,n&&ne(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&aa(d,s,t,c),Ti(e,!0);let f=Yr(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),oe(p),e,i,a),t.el=f.el,u===null&&ni(e,f.el),r&&xi(r,i),(d=t.props&&t.props.onVnodeUpdated)&&xi(()=>aa(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Jn(t);if(Ti(e,!1),l&&ne(l),!m&&(o=c&&c.onVnodeBeforeMount)&&aa(o,d,t),Ti(e,!0),s&&le){let t=()=>{e.subTree=Yr(e),le(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=Yr(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&xi(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;xi(()=>aa(o,d,e),i)}(t.shapeFlag&256||d&&Jn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&xi(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Oe(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>mn(u),Ti(e,!0),l()},L=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,si(e,t.props,r,n),bi(e,t.children,n),Ue(),_n(e),We()},R=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,d=e?e.shapeFlag:0,f=t.children,{patchFlag:p,shapeFlag:m}=t;if(p>0){if(p&128){z(l,f,n,r,i,a,o,s,c);return}if(p&256){ee(l,f,n,r,i,a,o,s,c);return}}m&8?(d&16&&ae(l,i,a),f!==l&&u(n,f)):d&16?m&16?z(l,f,n,r,i,a,o,s,c):ae(l,i,a,!0):(d&8&&u(n,``),m&16&&D(f,n,r,i,a,o,s,c))},ee=(e,t,n,r,i,a,o,s,c)=>{e||=f,t||=f;let l=e.length,u=t.length,d=Math.min(l,u),p=0;for(;p<d;p++){let r=t[p]=c?na(t[p]):ta(t[p]);v(e[p],r,n,null,i,a,o,s,c)}l>u?ae(e,i,a,!0,!1,d):D(t,n,r,i,a,o,s,c,d)},z=(e,t,n,r,i,a,o,s,c)=>{let l=0,u=t.length,d=e.length-1,p=u-1;for(;l<=d&&l<=p;){let r=e[l],u=t[l]=c?na(t[l]):ta(t[l]);if(qi(r,u))v(r,u,n,null,i,a,o,s,c);else break;l++}for(;l<=d&&l<=p;){let r=e[d],l=t[p]=c?na(t[p]):ta(t[p]);if(qi(r,l))v(r,l,n,null,i,a,o,s,c);else break;d--,p--}if(l>d){if(l<=p){let e=p+1,d=e<u?t[e].el:r;for(;l<=p;)v(null,t[l]=c?na(t[l]):ta(t[l]),n,d,i,a,o,s,c),l++}}else if(l>p)for(;l<=d;)V(e[l],i,a,!0),l++;else{let m=l,h=l,g=new Map;for(l=h;l<=p;l++){let e=t[l]=c?na(t[l]):ta(t[l]);e.key!=null&&g.set(e.key,l)}let _,y=0,b=p-h+1,x=!1,S=0,C=Array(b);for(l=0;l<b;l++)C[l]=0;for(l=m;l<=d;l++){let r=e[l];if(y>=b){V(r,i,a,!0);continue}let u;if(r.key!=null)u=g.get(r.key);else for(_=h;_<=p;_++)if(C[_-h]===0&&qi(r,t[_])){u=_;break}u===void 0?V(r,i,a,!0):(C[u-h]=l+1,u>=S?S=u:x=!0,v(r,t[u],n,null,i,a,o,s,c),y++)}let w=x?Oi(C):f;for(_=w.length-1,l=b-1;l>=0;l--){let e=h+l,d=t[e],f=t[e+1],p=e+1<u?f.el||ji(f):r;C[l]===0?v(null,d,n,p,i,a,o,s,c):x&&(_<0||l!==w[_]?B(d,n,p,2):_--)}}},B=(e,t,n,a,o=null)=>{let{el:s,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6)B(e.component.subTree,t,n,a);else if(d&128)e.suspense.move(t,n,a);else if(d&64)c.move(e,t,n,U);else if(c===Pi){r(s,t,n);for(let e=0;e<u.length;e++)B(u[e],t,n,a);r(e.anchor,t,n)}else if(c===Li)S(e,t,n);else if(a!==2&&d&1&&l){if(a===0)l.persisted&&!s[zn]?r(s,t,n):(l.beforeEnter(s),r(s,t,n),xi(()=>l.enter(s),o));else{let{leave:a,delayLeave:o,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?i(s):r(s,t,n)},d=()=>{let e=s._isLeaving||!!s[zn];s._isLeaving&&s[zn](!0),l.persisted&&!e?u():a(s,()=>{u(),c&&c()})};o?o(s,u,d):d()}}else r(s,t,n)},V=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if((d===-2||l&&l.hasOnce)&&(i=!1),s!=null&&(Ue(),X(s,null,n,e,!0),We()),p!=null&&(!e.ctx||e.ctx===t)&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!Jn(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&aa(_,t,e),u&6)ie(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&On(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,U,r):l&&!l.hasOnce&&(a!==Pi||d>0&&d&64)?ae(l,t,n,!1,!0):(a===Pi&&d&384||!i&&u&16)&&ae(c,t,n),r&&te(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&xi(()=>{_&&aa(_,t,e),h&&On(e,null,t,`unmounted`),v&&(e.el=null)},n)},te=e=>{let{type:t,el:n,anchor:r,transition:a}=e,o=t===Pi;if(o&&!a){re(n,r);return}if(t===Li){C(e),a&&!a.persisted&&a.afterLeave&&a.afterLeave();return}let s=o?Un(e):e,c=()=>{o?m(n)&&re(n,r):i(n),a&&!a.persisted&&a.afterLeave&&a.afterLeave()};if(s&&s.shapeFlag&1&&a&&!a.persisted){let{leave:e,delayLeave:t}=a,n=s.el,r=()=>e(n,c);t?t(n,c,r):r()}else c()},re=(e,t)=>{let n;for(;e!==t;)n=h(e),i(e),e=n;i(t)},ie=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Ai(c),Ai(l),r&&ne(r),i.stop(),a?(a.flags|=8,V(o,e,t,n)):e.vnode.el&&o&&(o.transition=e.vnode.transition,V(o,e,t,n)),s&&xi(s,t),xi(()=>{e.isUnmounted=!0},t)},ae=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)V(e[o],t,n,r,i)},oe=e=>{if(e.shapeFlag&6)return oe(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Ln];return n?h(n):t},se=(e,t,n)=>{bn(()=>{e==null?t._vnode&&V(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e},e&&t._vnode?void 0:e&&e.component?e.component.uid:ca())},U={p:v,um:V,m:B,r:te,mt:N,mc:D,pc:R,pbc:k,n:oe,o:e},ce,le;return t&&([ce,le]=t(U)),{render:se,hydrate:ce,createApp:Hr(se,ce)}}function wi({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Ti({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Ei(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Di(e,t,n=!1){let r=e.children,i=t.children;if(x(r)&&x(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=na(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Di(t,a)),a.type===Fi&&(a.patchFlag===-1&&(a=i[e]=na(a)),a.el=t.el),a.type===Ii&&!a.el&&(a.el=t.el)}}function Oi(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function ki(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:ki(t)}function Ai(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function ji(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?ji(t.subTree):null}var Mi=e=>e.__isSuspense;function Ni(e,t){t&&t.pendingBranch?x(e)?t.effects.push(...e):t.effects.push(e):gn(e)}var Pi=Symbol.for(`v-fgt`),Fi=Symbol.for(`v-txt`),Ii=Symbol.for(`v-cmt`),Li=Symbol.for(`v-stc`),Ri=[],zi=null;function Z(e=!1){Ri.push(zi=e?null:[])}function Bi(){Ri.pop(),zi=Ri[Ri.length-1]||null}var Vi=1;function Hi(e,t=!1){Vi+=e,e<0&&zi&&t&&(zi.hasOnce=!0)}function Ui(e){return e.dynamicChildren=Vi>0?zi||f:null,Bi(),Vi>0&&zi&&zi.push(e),e}function Wi(e,t,n,r,i,a){return Ui(Q(e,t,n,r,i,a,!0))}function Gi(e,t,n,r,i){return Ui(Xi(e,t,n,r,i,!0))}function Ki(e){return e?e.__v_isVNode===!0:!1}function qi(e,t){return e.type===t.type&&e.key===t.key}var Ji=({key:e})=>e??null,Yi=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:E(e)||qt(e)||T(e)?{i:Cn,r:e,k:t,f:!!n}:e);function Q(e,t=null,n=null,r=0,i=null,a=e===Pi?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Ji(t),ref:t&&Yi(t),scopeId:wn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Cn};return s?(ra(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=E(n)?8:16),Vi>0&&!o&&zi&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&zi.push(c),c}var Xi=Zi;function Zi(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===mr)&&(e=Ii),Ki(e)){let r=$i(e,t,!0);return n&&ra(r,n),Vi>0&&!a&&zi&&(r.shapeFlag&6?zi[zi.indexOf(e)]=r:zi.push(r)),r.patchFlag=-2,r}if(Ea(e)&&(e=e.__vccOpts),t){t=Qi(t);let{class:e,style:n}=t;e&&!E(e)&&(t.class=ue(e)),O(n)&&(Ut(n)&&!x(n)&&(n=_({},n)),t.style=oe(n))}let o=E(e)?1:Mi(e)?128:Rn(e)?64:O(e)?4:T(e)?2:0;return Q(e,t,n,r,i,o,a,!0)}function Qi(e){return e?Ut(e)||ai(e)?_({},e):e:null}function $i(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?ia(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Ji(l),ref:t&&t.ref?n&&a?x(a)?a.concat(Yi(t)):[a,Yi(t)]:Yi(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Pi?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&$i(e.ssContent),ssFallback:e.ssFallback&&$i(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&Hn(u,c.clone(u)),u}function $(e=` `,t=0){return Xi(Fi,null,e,t)}function ea(e=``,t=!1){return t?(Z(),Gi(Ii,null,e)):Xi(Ii,null,e)}function ta(e){return e==null||typeof e==`boolean`?Xi(Ii):x(e)?Xi(Pi,null,e.slice()):Ki(e)?na(e):Xi(Fi,null,String(e))}function na(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:$i(e)}function ra(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(x(t))n=16;else if(typeof t==`object`){if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),ra(e,n()),n._c&&(n._d=!0));return}{n=32;let r=t._;!r&&!ai(t)?t._ctx=Cn:r===3&&Cn&&(Cn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}}else if(T(t)){if(r&65){ra(e,{default:t});return}t={default:t,_ctx:Cn},n=32}else t=String(t),r&64?(n=16,t=[$(t)]):n=8;e.children=t,e.shapeFlag|=n}function ia(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=ue([t.class,r.class]));else if(e===`style`)t.style=oe([t.style,r.style]);else if(h(e)){let n=t[e],i=r[e];i&&n!==i&&!(x(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!g(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function aa(e,t,n,r=null){rn(e,t,7,[n,r])}var oa=Br(),sa=0;function ca(){return sa}function la(e,t,n){let r=e.type,i=(t?t.appContext:e.appContext)||oa,a={uid:sa++,vnode:e,type:r,parent:t,appContext:i,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new we(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(i.provides),ids:t?t.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:di(r,i),emitsOptions:qr(r,i),emit:null,emitted:null,propsDefaults:d,inheritAttrs:r.inheritAttrs,ctx:d,data:d,props:d,attrs:d,slots:d,refs:d,setupState:d,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return a.ctx={_:a},a.root=t?t.root:a,a.emit=Gr.bind(null,a),e.ce&&e.ce(a),a}var ua=null,da=()=>ua||Cn,fa,pa;{let e=H(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};fa=t(`__VUE_INSTANCE_SETTERS__`,e=>ua=e),pa=t(`__VUE_SSR_SETTERS__`,e=>_a=e)}var ma=e=>{let t=ua;return fa(e),e.scope.on(),()=>{e.scope.off(),fa(t)}},ha=()=>{ua&&ua.scope.off(),fa(null)};function ga(e){return e.vnode.shapeFlag&4}var _a=!1;function va(e,t=!1,n=!1){t&&pa(t);let{props:r,children:i}=e.vnode,a=ga(e);oi(e,r,a,t),yi(e,i,n||t);let o=a?ya(e,t):void 0;return t&&pa(!1),o}function ya(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Cr);let{setup:r}=n;if(r){Ue();let n=e.setupContext=r.length>1?Ca(e):null,i=ma(e),a=q(r,e,0,[e.props,n]),o=k(a);if(We(),i(),(o||e.sp)&&!Jn(e)&&Wn(e),o){if(a.then(ha,ha),t)return a.then(n=>{pa(!0);try{ba(e,n,t)}finally{pa(!1)}}).catch(t=>{an(t,e,0)});e.asyncDep=a}else ba(e,a,t)}else xa(e,t)}function ba(e,t,n){T(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:O(t)&&(e.setupState=Xt(t)),xa(e,n)}function xa(e,t,n){let r=e.type;e.render||=r.render||p;{let t=ma(e);Ue();try{Er(e)}finally{We(),t()}}}var Sa={get(e,t){return et(e,`get`,``),e[t]}};function Ca(e){return{attrs:new Proxy(e.attrs,Sa),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function wa(e){return e.exposed?e.exposeProxy||=new Proxy(Xt(Wt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in xr)return xr[n](e)},has(e,t){return t in e||t in xr}}):e.proxy}function Ta(e,t=!0){return T(e)?e.displayName||e.name:e.name||t&&e.__name}function Ea(e){return T(e)&&`__vccOpts`in e}var Da=(e,t)=>Qt(e,t,_a),Oa=`3.5.44`,ka=void 0,Aa=typeof window<`u`&&window.trustedTypes;if(Aa)try{ka=Aa.createPolicy(`vue`,{createHTML:e=>e})}catch{}var ja=ka?e=>ka.createHTML(e):e=>e,Ma=`http://www.w3.org/2000/svg`,Na=`http://www.w3.org/1998/Math/MathML`,Pa=typeof document<`u`?document:null,Fa=Pa&&Pa.createElement(`template`),Ia={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Pa.createElementNS(Ma,e):t===`mathml`?Pa.createElementNS(Na,e):n?Pa.createElement(e,{is:n}):Pa.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Pa.createTextNode(e),createComment:e=>Pa.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Pa.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),i!==a&&(i=i.nextSibling););else{Fa.innerHTML=ja(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Fa.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},La=Symbol(`_vtc`);function Ra(e,t,n){let r=e[La];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var za=Symbol(`_vod`),Ba=Symbol(`_vsh`),Va=Symbol(``),Ha=/(?:^|;)\s*display\s*:/;function Ua(e,t,n){let r=e.style,i=E(n),a=!1;if(n&&!i){if(t){if(E(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Ga(r,t,``)}else for(let e in t)n[e]??Ga(r,e,``)}for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?Ga(r,i,``):Ya(e,i,!E(t)&&t?t[i]:void 0,o)||Ga(r,i,o)}}else if(i){if(t!==n){let e=r[Va];e&&(n+=`;`+e),r.cssText=n,a=Ha.test(n)}}else t&&e.removeAttribute(`style`);za in e&&((!i||t!==n)&&(e[za]=a?r.display:``),e[Ba]&&(r.display=`none`))}var Wa=/\s*!important$/;function Ga(e,t,n){if(x(n))n.forEach(n=>Ga(e,t,n));else if(n??=``,t.startsWith(`--`))Wa.test(n)?e.setProperty(t,n.replace(Wa,``),`important`):e.setProperty(t,n);else{let r=Ja(e,t);Wa.test(n)?e.setProperty(z(r),n.replace(Wa,``),`important`):e[r]=n}}var Ka=[`Webkit`,`Moz`,`ms`],qa={};function Ja(e,t){let n=qa[t];if(n)return n;let r=R(t);if(r!==`filter`&&r in e)return qa[t]=r;r=B(r);for(let n=0;n<Ka.length;n++){let i=Ka[n]+r;if(i in e)return qa[t]=i}return t}function Ya(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&E(r)&&n===r}var Xa=`http://www.w3.org/1999/xlink`;function Za(e,t,n,r,i,a=de(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(Xa,t.slice(6,t.length)):e.setAttributeNS(Xa,t,n):n==null||a&&!fe(n)?e.removeAttribute(t):e.setAttribute(t,a?``:D(n)?String(n):n)}function Qa(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?ja(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=fe(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function $a(e,t,n,r){e.addEventListener(t,n,r)}function eo(e,t,n,r){e.removeEventListener(t,n,r)}var to=Symbol(`_vei`);function no(e,t,n,r,i=null){let a=e[to]||(e[to]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=ao(t);r?$a(e,n,a[t]=lo(r,i),s):o&&(eo(e,n,o,s),a[t]=void 0)}}var ro=/(Once|Passive|Capture)$/,io=/^on:?(?:Once|Passive|Capture)$/;function ao(e){let t,n;for(;(n=e.match(ro))&&!io.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):z(e.slice(2)),t]}var oo=0,so=Promise.resolve(),co=()=>oo||=(so.then(()=>oo=0),Date.now());function lo(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(x(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&rn(e,t,5,a)}}else rn(r,t,5,[e])};return n.value=e,n.attached=co(),n}var uo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,fo=(e,t,n,r,i,a)=>{let o=i===`svg`;t===`class`?Ra(e,r,o):t===`style`?Ua(e,n,r):h(t)?g(t)||no(e,t,n,r,a):(t[0]===`.`?(t=t.slice(1),1):t[0]===`^`?(t=t.slice(1),0):po(e,t,r,o))?(Qa(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&Za(e,t,r,o,a,t!==`value`)):e._isVueCE&&(mo(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!E(r)))?Qa(e,R(t),r,a,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),Za(e,t,r,o))};function po(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&uo(t)&&T(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return uo(t)&&E(n)?!1:t in e}function mo(e,t){let n=e._def.props;if(!n)return!1;let r=R(t);return Array.isArray(n)?n.some(e=>R(e)===r):Object.keys(n).some(e=>R(e)===r)}var ho=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return x(t)?e=>ne(t,e):t};function go(e){e.target.composing=!0}function _o(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var vo=Symbol(`_assign`),yo=Symbol(`_initialValue`);function bo(e,t,n){return t&&(e=e.trim()),n&&(e=ie(e)),e}var xo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e.parentNode&&(e.type===`text`?e[yo]=e.defaultValue.replace(/[\r\n]/g,``):e.type===`textarea`&&(e[yo]=e.defaultValue.replace(/\r\n?/g,`
`))),e[vo]=ho(i);let a=r||i.props&&i.props.type===`number`;$a(e,t?`change`:`input`,t=>{t.target.composing||e[vo](bo(e.value,n,a))}),(n||a)&&$a(e,`change`,()=>{e.value=bo(e.value,n,a)}),t||($a(e,`compositionstart`,go),$a(e,`compositionend`,_o),$a(e,`change`,_o))},mounted(e,{value:t,modifiers:{trim:n,number:r}}){let i=t??``,a=e[yo];delete e[yo],a!==void 0&&(e.type===`text`||e.type===`textarea`)&&e.value!==a?e[vo](bo(e.value,n,r)):e.value=i},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[vo]=ho(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?ie(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},So={deep:!0,created(e,t,n){e[vo]=ho(n),$a(e,`change`,()=>{let t=e._modelValue,n=Do(e),r=e.checked,i=e[vo];if(x(t)){let e=ve(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(C(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(Oo(e,r))})},mounted:Co,beforeUpdate(e,t,n){e[vo]=ho(n),Co(e,t,n)}};function Co(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(x(t))i=ve(t,r.props.value)>-1;else if(C(t))i=t.has(r.props.value);else{if(t===n)return;i=_e(t,Oo(e,!0))}e.checked!==i&&(e.checked=i)}var wo={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,$a(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?ie(Do(e)):Do(e)),r=e.multiple,i=r?C(e._modelValue)?new Set(t):t:t[0],a=e._pendingValue=[r,r?x(i)?t.slice():t:i];try{e[vo](i)}finally{fn(()=>{e._pendingValue===a&&(e._pendingValue=void 0)})}}),e[vo]=ho(r)},mounted(e,{value:t}){Eo(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[vo]=ho(n)},updated(e,{value:t}){let n=e._pendingValue;e._pendingValue=void 0,(!n||n[0]!==e.multiple||!To(t,n[1],n[0]))&&Eo(e,t)}};function To(e,t,n){if(!n||x(e))return _e(e,t);if(C(e)){if(e.size!==t.length)return!1;for(let n of t)if(!e.has(n))return!1;return!0}return!1}function Eo(e,t){let n=e.multiple,r=x(t);if(!n||r||C(t)){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=Do(a);if(n){if(r){let e=typeof o;a.selected=e===`string`||e===`number`?t.some(e=>String(e)===String(o)):ve(t,o)>-1}else a.selected=t.has(o)}else if(_e(Do(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Do(e){return`_value`in e?e._value:e.value}function Oo(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var ko=[`ctrl`,`shift`,`alt`,`meta`],Ao={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>ko.some(n=>e[`${n}Key`]&&!t.includes(n))},jo=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=Ao[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Mo=_({patchProp:fo},Ia),No;function Po(){return No||=Si(Mo)}var Fo=((...e)=>{let t=Po().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Lo(e);if(!r)return;let i=t._component;!T(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Io(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Io(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Lo(e){return E(e)?document.querySelector(e):e}var Ro=function(e){Bo(e);var t=zo(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function zo(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function Bo(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}var Vo=1e-6,Ho=typeof Float32Array<`u`?Float32Array:Array;function Uo(e){Ho=e}Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function Wo(){var e=new Ho(9);return Ho!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function Go(){var e=new Ho(16);return Ho!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Ko(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function qo(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(i*O-r*k-a*D)*A,e[2]=(h*C-g*S+_*x)*A,e[3]=(f*S-d*C-p*x)*A,e[4]=(c*E-o*k-l*T)*A,e[5]=(n*k-i*E+a*T)*A,e[6]=(g*b-m*C-_*y)*A,e[7]=(u*C-f*b+p*y)*A,e[8]=(o*O-s*E+l*w)*A,e[9]=(r*E-n*O-a*w)*A,e[10]=(m*S-h*b+_*v)*A,e[11]=(d*b-u*S-p*v)*A,e[12]=(s*T-o*D-c*w)*A,e[13]=(n*D-r*T+i*w)*A,e[14]=(h*y-m*x-g*v)*A,e[15]=(u*x-d*y+f*v)*A,e):null}function Jo(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=t[4],c=t[5],l=t[6],u=t[7],d=t[8],f=t[9],p=t[10],m=t[11],h=t[12],g=t[13],_=t[14],v=t[15],y=n[0],b=n[1],x=n[2],S=n[3];return e[0]=y*r+b*s+x*d+S*h,e[1]=y*i+b*c+x*f+S*g,e[2]=y*a+b*l+x*p+S*_,e[3]=y*o+b*u+x*m+S*v,y=n[4],b=n[5],x=n[6],S=n[7],e[4]=y*r+b*s+x*d+S*h,e[5]=y*i+b*c+x*f+S*g,e[6]=y*a+b*l+x*p+S*_,e[7]=y*o+b*u+x*m+S*v,y=n[8],b=n[9],x=n[10],S=n[11],e[8]=y*r+b*s+x*d+S*h,e[9]=y*i+b*c+x*f+S*g,e[10]=y*a+b*l+x*p+S*_,e[11]=y*o+b*u+x*m+S*v,y=n[12],b=n[13],x=n[14],S=n[15],e[12]=y*r+b*s+x*d+S*h,e[13]=y*i+b*c+x*f+S*g,e[14]=y*a+b*l+x*p+S*_,e[15]=y*o+b*u+x*m+S*v,e}function Yo(e,t,n){var r=n[0],i=n[1],a=n[2],o,s,c,l,u,d,f,p,m,h,g,_;return t===e?(e[12]=t[0]*r+t[4]*i+t[8]*a+t[12],e[13]=t[1]*r+t[5]*i+t[9]*a+t[13],e[14]=t[2]*r+t[6]*i+t[10]*a+t[14],e[15]=t[3]*r+t[7]*i+t[11]*a+t[15]):(o=t[0],s=t[1],c=t[2],l=t[3],u=t[4],d=t[5],f=t[6],p=t[7],m=t[8],h=t[9],g=t[10],_=t[11],e[0]=o,e[1]=s,e[2]=c,e[3]=l,e[4]=u,e[5]=d,e[6]=f,e[7]=p,e[8]=m,e[9]=h,e[10]=g,e[11]=_,e[12]=o*r+u*i+m*a+t[12],e[13]=s*r+d*i+h*a+t[13],e[14]=c*r+f*i+g*a+t[14],e[15]=l*r+p*i+_*a+t[15]),e}function Xo(e,t,n){var r=n[0],i=n[1],a=n[2];return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*a,e[9]=t[9]*a,e[10]=t[10]*a,e[11]=t[11]*a,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Zo(e,t,n,r){var i=r[0],a=r[1],o=r[2],s=Math.hypot(i,a,o),c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;return s<Vo?null:(s=1/s,i*=s,a*=s,o*=s,c=Math.sin(n),l=Math.cos(n),u=1-l,d=t[0],f=t[1],p=t[2],m=t[3],h=t[4],g=t[5],_=t[6],v=t[7],y=t[8],b=t[9],x=t[10],S=t[11],C=i*i*u+l,w=a*i*u+o*c,T=o*i*u-a*c,E=i*a*u-o*c,D=a*a*u+l,O=o*a*u+i*c,k=i*o*u+a*c,A=a*o*u-i*c,j=o*o*u+l,e[0]=d*C+h*w+y*T,e[1]=f*C+g*w+b*T,e[2]=p*C+_*w+x*T,e[3]=m*C+v*w+S*T,e[4]=d*E+h*D+y*O,e[5]=f*E+g*D+b*O,e[6]=p*E+_*D+x*O,e[7]=m*E+v*D+S*O,e[8]=d*k+h*A+y*j,e[9]=f*k+g*A+b*j,e[10]=p*k+_*A+x*j,e[11]=m*k+v*A+S*j,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function Qo(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[4],o=t[5],s=t[6],c=t[7],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=a*i+l*r,e[5]=o*i+u*r,e[6]=s*i+d*r,e[7]=c*i+f*r,e[8]=l*i-a*r,e[9]=u*i-o*r,e[10]=d*i-s*r,e[11]=f*i-c*r,e}function $o(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i-l*r,e[1]=o*i-u*r,e[2]=s*i-d*r,e[3]=c*i-f*r,e[8]=a*r+l*i,e[9]=o*r+u*i,e[10]=s*r+d*i,e[11]=c*r+f*i,e}function es(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[4],u=t[5],d=t[6],f=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i+l*r,e[1]=o*i+u*r,e[2]=s*i+d*r,e[3]=c*i+f*r,e[4]=l*i-a*r,e[5]=u*i-o*r,e[6]=d*i-s*r,e[7]=f*i-c*r,e}function ts(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=r+r,c=i+i,l=a+a,u=r*s,d=r*c,f=r*l,p=i*c,m=i*l,h=a*l,g=o*s,_=o*c,v=o*l;return e[0]=1-(p+h),e[1]=d+v,e[2]=f-_,e[3]=0,e[4]=d-v,e[5]=1-(u+h),e[6]=m+g,e[7]=0,e[8]=f+_,e[9]=m-g,e[10]=1-(u+p),e[11]=0,e[12]=n[0],e[13]=n[1],e[14]=n[2],e[15]=1,e}function ns(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function rs(e,t){var n=t[0],r=t[1],i=t[2],a=t[4],o=t[5],s=t[6],c=t[8],l=t[9],u=t[10];return e[0]=Math.hypot(n,r,i),e[1]=Math.hypot(a,o,s),e[2]=Math.hypot(c,l,u),e}function is(e,t){var n=new Ho(3);rs(n,t);var r=1/n[0],i=1/n[1],a=1/n[2],o=t[0]*r,s=t[1]*i,c=t[2]*a,l=t[4]*r,u=t[5]*i,d=t[6]*a,f=t[8]*r,p=t[9]*i,m=t[10]*a,h=o+u+m,g=0;return h>0?(g=Math.sqrt(h+1)*2,e[3]=.25*g,e[0]=(d-p)/g,e[1]=(f-c)/g,e[2]=(s-l)/g):o>u&&o>m?(g=Math.sqrt(1+o-u-m)*2,e[3]=(d-p)/g,e[0]=.25*g,e[1]=(s+l)/g,e[2]=(f+c)/g):u>m?(g=Math.sqrt(1+u-o-m)*2,e[3]=(f-c)/g,e[0]=(s+l)/g,e[1]=.25*g,e[2]=(d+p)/g):(g=Math.sqrt(1+m-o-u)*2,e[3]=(s-l)/g,e[0]=(f+c)/g,e[1]=(d+p)/g,e[2]=.25*g),e}function as(e,t,n,r,i){var a=1/Math.tan(t/2),o;return e[0]=a/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(o=1/(r-i),e[10]=(i+r)*o,e[14]=2*i*r*o):(e[10]=-1,e[14]=-2*r),e}var os=as;function ss(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=r[0],c=r[1],l=r[2],u=i-n[0],d=a-n[1],f=o-n[2],p=u*u+d*d+f*f;p>0&&(p=1/Math.sqrt(p),u*=p,d*=p,f*=p);var m=c*f-l*d,h=l*u-s*f,g=s*d-c*u;return p=m*m+h*h+g*g,p>0&&(p=1/Math.sqrt(p),m*=p,h*=p,g*=p),e[0]=m,e[1]=h,e[2]=g,e[3]=0,e[4]=d*g-f*h,e[5]=f*m-u*g,e[6]=u*h-d*m,e[7]=0,e[8]=u,e[9]=d,e[10]=f,e[11]=0,e[12]=i,e[13]=a,e[14]=o,e[15]=1,e}function cs(){var e=new Ho(3);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function ls(e){var t=e[0],n=e[1],r=e[2];return Math.hypot(t,n,r)}function us(e,t,n){var r=new Ho(3);return r[0]=e,r[1]=t,r[2]=n,r}function ds(e,t,n,r){return e[0]=t,e[1]=n,e[2]=r,e}function fs(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e[2]=t[2]+n[2],e}function ps(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e[2]=t[2]-n[2],e}function ms(e,t,n,r){return e[0]=t[0]+n[0]*r,e[1]=t[1]+n[1]*r,e[2]=t[2]+n[2]*r,e}function hs(e,t){var n=t[0],r=t[1],i=t[2],a=n*n+r*r+i*i;return a>0&&(a=1/Math.sqrt(a)),e[0]=t[0]*a,e[1]=t[1]*a,e[2]=t[2]*a,e}function gs(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function _s(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[0],s=n[1],c=n[2];return e[0]=i*c-a*s,e[1]=a*o-r*c,e[2]=r*s-i*o,e}function vs(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[3]*r+n[7]*i+n[11]*a+n[15];return o||=1,e[0]=(n[0]*r+n[4]*i+n[8]*a+n[12])/o,e[1]=(n[1]*r+n[5]*i+n[9]*a+n[13])/o,e[2]=(n[2]*r+n[6]*i+n[10]*a+n[14])/o,e}function ys(e,t,n){var r=n[0],i=n[1],a=n[2],o=n[3],s=t[0],c=t[1],l=t[2],u=i*l-a*c,d=a*s-r*l,f=r*c-i*s,p=i*f-a*d,m=a*u-r*f,h=r*d-i*u,g=o*2;return u*=g,d*=g,f*=g,p*=2,m*=2,h*=2,e[0]=s+u+p,e[1]=c+d+m,e[2]=l+f+h,e}var bs=ps,xs=ls;(function(){var e=cs();return function(t,n,r,i,a,o){var s,c;for(n||=3,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function Ss(){var e=new Ho(4);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Cs(e,t,n,r,i){return e[0]=t,e[1]=n,e[2]=r,e[3]=i,e}function ws(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=n*n+r*r+i*i+a*a;return o>0&&(o=1/Math.sqrt(o)),e[0]=n*o,e[1]=r*o,e[2]=i*o,e[3]=a*o,e}function Ts(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3];return e[0]=n[0]*r+n[4]*i+n[8]*a+n[12]*o,e[1]=n[1]*r+n[5]*i+n[9]*a+n[13]*o,e[2]=n[2]*r+n[6]*i+n[10]*a+n[14]*o,e[3]=n[3]*r+n[7]*i+n[11]*a+n[15]*o,e}(function(){var e=Ss();return function(t,n,r,i,a,o){var s,c;for(n||=4,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}})();function Es(){var e=new Ho(4);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function Ds(e,t,n){n*=.5;var r=Math.sin(n);return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=Math.cos(n),e}function Os(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=t[3],c=n[0],l=n[1],u=n[2],d=n[3],f,p=i*c+a*l+o*u+s*d,m,h,g;return p<0&&(p=-p,c=-c,l=-l,u=-u,d=-d),1-p>Vo?(f=Math.acos(p),m=Math.sin(f),h=Math.sin((1-r)*f)/m,g=Math.sin(r*f)/m):(h=1-r,g=r),e[0]=h*i+g*c,e[1]=h*a+g*l,e[2]=h*o+g*u,e[3]=h*s+g*d,e}function ks(e,t){var n=t[0]+t[4]+t[8],r;if(n>0)r=Math.sqrt(n+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{var i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);var a=(i+1)%3,o=(i+2)%3;r=Math.sqrt(t[i*3+i]-t[a*3+a]-t[o*3+o]+1),e[i]=.5*r,r=.5/r,e[3]=(t[a*3+o]-t[o*3+a])*r,e[a]=(t[a*3+i]+t[i*3+a])*r,e[o]=(t[o*3+i]+t[i*3+o])*r}return e}var As=Cs,js=ws;(function(){var e=cs(),t=us(1,0,0),n=us(0,1,0);return function(r,i,a){var o=gs(i,a);return o<-.999999?(_s(e,t,i),xs(e)<1e-6&&_s(e,n,i),hs(e,e),Ds(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(_s(e,i,a),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,js(r,r))}})(),(function(){var e=Es(),t=Es();return function(n,r,i,a,o,s){return Os(e,r,o,s),Os(t,i,a,s),Os(n,e,t,2*s*(1-s)),n}})(),(function(){var e=Wo();return function(t,n,r,i){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],js(t,ks(t,e))}})();function Ms(){var e=new Ho(2);return Ho!=Float32Array&&(e[0]=0,e[1]=0),e}(function(){var e=Ms();return function(t,n,r,i,a,o){var s,c;for(n||=2,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],a(e,e,o),t[s]=e[0],t[s+1]=e[1];return t}})();var Ns=class{children;parent;model;worldModel;modelViewProjection;worldTransformNeedsUpdate;modelViewProjectionNeedsUpdate;type;scene;constructor(){this.children=[],this.model=Go(),this.worldModel=Go(),this.modelViewProjection=Go(),this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0,this.type=`Element`,this.scene=null,this.parent=null}appendChild(e,t=!1){e.parent=this,t?this.children.unshift(e):this.children.push(e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}insertChildAfter(e,t){e.parent=this;let n=this.children.indexOf(t);if(n<0)throw Error(`Could not find element to insert after`);this.children.splice(n+1,0,e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}bindScene(e){this.scene=e,this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0}traverse(e,t){e(this);for(var n=0;n<this.children.length;++n)this.children[n].traverse(e,t);t&&t(this)}rotate(e,t){return Zo(this.model,this.model,e,t),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateX(e){return Qo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateY(e){return $o(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateZ(e){return es(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}scale(e){return Xo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}translate(e){return Yo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}removeChild(e){let t=this.children.indexOf(e);t>-1&&(this.children.splice(t,1),e.bindScene(null)),this.scene&&this.scene.renderFrame()}updateWorldTransform(e=!1){(this.worldTransformNeedsUpdate||e)&&(this.parent?Jo(this.worldModel,this.parent.worldModel,this.model):Ko(this.worldModel,this.model),this.modelViewProjectionNeedsUpdate=!0,this.worldTransformNeedsUpdate=!1,e=!0);let t=e;for(var n=this.children,r=0;r<n.length;r++)t=n[r].updateWorldTransform(e)||t;return t}scheduleMVPUpdate(){this.modelViewProjectionNeedsUpdate=!0;let e=this.children;for(var t=0;t<e.length;t++)e[t].scheduleMVPUpdate()}updateModelViewProjection(e,t){this.modelViewProjectionNeedsUpdate&&=(Jo(this.modelViewProjection,e,t),Jo(this.modelViewProjection,this.modelViewProjection,this.worldModel),!1)}draw(e,t){for(var n=0;n<this.children.length;++n){let r=this.children[n];r.updateModelViewProjection(t.projection,t.view.matrix),r.draw(e,t)}}dispose(){for(var e=0;e<this.children.length;++e)this.children[e].dispose()}},Ps={maxSingleTouchTime:300,singleTapDistanceSquared:25};function Fs(e,t,n){var r=Date.now();let i;return e.addEventListener(`click`,c,{passive:!1}),e.addEventListener(`touchend`,o,{passive:!1}),e.addEventListener(`touchstart`,a,{passive:!1}),s;function a(e){e.touches.length===1&&(r=Date.now(),i={x:e.touches[0].pageX,y:e.touches[0].pageY})}function o(e){if(e.touches.length>1||Date.now()-r>Ps.maxSingleTouchTime)return;let t=e.changedTouches[0];var n=t.pageX-i.x,a=t.pageY-i.y;n*n+a*a<Ps.singleTapDistanceSquared&&c(t)}function s(){e.removeEventListener(`click`,c),e.removeEventListener(`touchend`,o),e.removeEventListener(`touchstart`,a)}function c(e){t.call(n,e)}}var Is=[0,0,0],Ls=[1,0,0],Rs=[0,1,0],zs=[0,0,1],Bs=class{matrix;cameraWorld;position;orientation;center;constructor(e){this.matrix=e||Go(),this.cameraWorld=qo(Go(),this.matrix),this.position=[0,0,0],this.orientation=[0,0,0,1],this.center=[0,0,0],this.deconstructPositionRotation()}lookAt(e,t,n){return ss(this.cameraWorld,e,t,n),qo(this.matrix,this.cameraWorld),this.deconstructPositionRotation(),this}update(){return ts(this.cameraWorld,this.orientation,this.position),qo(this.matrix,this.cameraWorld),this}deconstructPositionRotation(){ns(this.position,this.cameraWorld),is(this.orientation,this.cameraWorld)}translateOnAxis(e,t){let n=ys(Is,e,this.orientation);return ms(this.position,this.position,n,t),this}translateX(e){return this.translateOnAxis(Ls,e)}translateY(e){return this.translateOnAxis(Rs,e)}translateZ(e){return this.translateOnAxis(zs,e)}},Vs={exports:{}},Hs=4,Us=.001,Ws=1e-7,Gs=10,Ks=11,qs=1/(Ks-1),Js=typeof Float32Array==`function`;function Ys(e,t){return 1-3*t+3*e}function Xs(e,t){return 3*t-6*e}function Zs(e){return 3*e}function Qs(e,t,n){return((Ys(t,n)*e+Xs(t,n))*e+Zs(t))*e}function $s(e,t,n){return 3*Ys(t,n)*e*e+2*Xs(t,n)*e+Zs(t)}function ec(e,t,n,r,i){var a,o,s=0;do o=t+(n-t)/2,a=Qs(o,r,i)-e,a>0?n=o:t=o;while(Math.abs(a)>Ws&&++s<Gs);return o}function tc(e,t,n,r){for(var i=0;i<Hs;++i){var a=$s(t,n,r);if(a===0)return t;var o=Qs(t,n,r)-e;t-=o/a}return t}function nc(e){return e}var rc=function(e,t,n,r){if(!(0<=e&&e<=1&&0<=n&&n<=1))throw Error(`bezier x values must be in [0, 1] range`);if(e===t&&n===r)return nc;for(var i=Js?new Float32Array(Ks):Array(Ks),a=0;a<Ks;++a)i[a]=Qs(a*qs,e,n);function o(t){for(var r=0,a=1,o=Ks-1;a!==o&&i[a]<=t;++a)r+=qs;--a;var s=(t-i[a])/(i[a+1]-i[a]),c=r+s*qs,l=$s(c,e,n);return l>=Us?tc(t,c,e,n):l===0?c:ec(t,r,r+qs,e,n)}return function(e){return e===0?0:e===1?1:Qs(o(e),t,r)}},ic={ease:rc(.25,.1,.25,1),easeIn:rc(.42,0,1,1),easeOut:rc(0,0,.58,1),easeInOut:rc(.42,0,.58,1),linear:rc(0,0,1,1)};Vs.exports=ac,Vs.exports.makeAggregateRaf=uc,Vs.exports.sharedScheduler=uc();function ac(e,t,n){var r=Object.create(null),i=Object.create(null);n||={};var a=typeof n.easing==`function`?n.easing:ic[n.easing];a||=(n.easing&&console.warn(`Unknown easing function in amator: `+n.easing),ic.ease);var o=typeof n.step==`function`?n.step:oc,s=typeof n.done==`function`?n.done:oc,c=sc(n.scheduler),l=Object.keys(t);l.forEach(function(n){r[n]=e[n],i[n]=t[n]-e[n]});var u=typeof n.duration==`number`?n.duration:400,d=Math.max(1,u*.06),f,p=0;return f=c.next(h),{cancel:m};function m(){c.cancel(f),f=0}function h(){var t=a(p/d);p+=1,g(t),p<=d?(f=c.next(h),o(e)):(f=0,setTimeout(function(){s(e)},0))}function g(t){l.forEach(function(n){e[n]=i[n]*t+r[n]})}}function oc(){}function sc(e){if(!e)return typeof window<`u`&&window.requestAnimationFrame?cc():lc();if(typeof e.next!=`function`)throw Error(`Scheduler is supposed to have next(cb) function`);if(typeof e.cancel!=`function`)throw Error(`Scheduler is supposed to have cancel(handle) function`);return e}function cc(){return{next:window.requestAnimationFrame.bind(window),cancel:window.cancelAnimationFrame.bind(window)}}function lc(){return{next:function(e){return setTimeout(e,1e3/60)},cancel:function(e){return clearTimeout(e)}}}function uc(){var e=new Set,t=new Set,n=0;return{next:i,cancel:i,clearAll:r};function r(){e.clear(),t.clear(),cancelAnimationFrame(n),n=0}function i(e){t.add(e),a()}function a(){n||=requestAnimationFrame(o)}function o(){n=0;var r=t;t=e,e=r,e.forEach(function(e){e()}),e.clear()}}function dc(e,t,n){typeof n!=`object`&&(n={});let r=.001,i=typeof n.minVelocity==`number`?n.minVelocity:r,a=typeof n.amplitude==`number`?n.amplitude:.01,o=typeof n.cancelAnimationFrame==`function`?n.cancelAnimationFrame:fc(),s=typeof n.requestAnimationFrame==`function`?n.requestAnimationFrame:pc(),c,l,u,d,f,p,m,h,g,_;return{start:x,setAmplitude:v,getAmplitude:y,stop:C,impulse:w,cancel:b};function v(e){a=e}function y(){return a}function b(){o(u),o(_)}function x(){c=e(),f=m=d=p=h=0,l=new Date,o(u),o(_),u=s(S)}function S(){var t=Date.now(),n=t-l;l=t;var r=e(),i=r.x-c.x,a=r.y-c.y,o=(r.z||0)-c.z;c=r;var f=1e3/(1+n);d=.8*i*f+.2*d,p=.8*a*f+.2*p,h=.8*o*f+.2*h,u=s(S)}function C(){u&&(o(u),u=0,o(_),_=0,w(d,p,h))}function w(e,t,n){l=Date.now(),(e<-i||e>i)&&(f=a*e),(t<-i||t>i)&&(m=a*t),(n<-i||n>i)&&(g=a*n),_=s(T)}function T(){var n=Date.now()-l,i=!1,a=0,o=0,c=0;let u=Math.exp(-n/342);if(f&&(a=f*u,a>r||a<-.001?i=!0:a=f=0),m&&(o=m*u,o>r||o<-.001?i=!0:o=m=0),g&&(c=g*u,c>r||c<-.001?i=!0:c=g=0),i){let n=e();t(n.x+a,n.y+o,n.z+c),_=s(T)}}}function fc(){return typeof cancelAnimationFrame==`function`?cancelAnimationFrame:clearTimeout}function pc(){return typeof requestAnimationFrame==`function`?requestAnimationFrame:function(e){return setTimeout(e,16)}}var mc=class{x;y;lastX;lastY;id;createdAt;constructor(e){this.x=e.clientX,this.y=e.clientY,this.lastX=this.x,this.lastY=this.y,this.id=e.identifier,this.createdAt=Date.now()}move(e){this.lastX=this.x,this.lastY=this.y,this.x=e.clientX,this.y=e.clientY}},hc=0,gc=1,_c=2,vc=3,yc=class{allowRotation;state;canRotate;canScale;canIncline;first;second;stateChanged;constructor(e){this.allowRotation=e,this.state=hc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0,this.stateChanged=!1}reset(){this.state=hc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0}isUnknown(){return this.state===hc}track(e,t){if(this.stateChanged=!1,this.state!==hc)return;if(!(this.first&&this.second)){this.first={id:e.id,x:e.x,y:e.y},this.second={id:t.id,x:t.x,y:t.y};return}let n=this.first,r=this.second;if(e.id===r.id&&t.id===n.id){let e=n;n=r,r=e}let i=n.y-r.y,a=n.x-r.x,o=e.y-t.y,s=e.x-t.x,c=Math.abs(Math.hypot(i,a)-Math.hypot(o,s)),l=Math.atan2(i,a),u=Math.abs(l-Math.atan2(o,s));if(l=Math.abs(l)*180/Math.PI,(l<60||180-l<60)&&this.allowRotation&&Math.abs(e.createdAt-t.createdAt)<100){let i=e.x-n.x+t.x-r.x,a=e.y-n.y+t.y-r.y;Math.abs(i)<10&&Math.abs(a)>42&&(this.canIncline=!0)}this.canIncline?(this.canRotate=!1,this.canScale=!1,this.canIncline=!0,this.state=vc):u>.1&&this.allowRotation?(this.canRotate=!0,this.canScale=!0,this.canIncline=!1,this.state=_c):c>15&&(this.canRotate=!1,this.canScale=!0,this.canIncline=!1,this.state=gc),this.stateChanged=!0}};function bc(e,t){let n=!1,r=new Map,{allowRotation:i,allowPinchRotation:a,panAnimation:o,rotateAnimation:s}=t,c=new yc(a&&i),l,u=Date.now(),d=u;return p(),{dispose:f};function f(){e.removeEventListener(`touchstart`,m,{passive:!1}),v()}function p(){e.addEventListener(`touchstart`,m,{passive:!1})}function m(e){n||=(_(),!0),o.cancel(),s.cancel(),e.touches.length===1&&o.start();for(let t=0;t<e.touches.length;++t){let n=e.touches[t];r.has(n.identifier)||r.set(n.identifier,new mc(n))}e.stopPropagation(),e.preventDefault()}function h(e){let n=Date.now(),i=0,a=0,l=0,f=0,p,m,h=!1,g=e.touches;for(let e=0;e<g.length;++e){let t=g[e],n=r.get(t.identifier);n&&(n.move(t),l+=n.x,f+=n.y,i+=n.x-n.lastX,a+=n.y-n.lastY,p?m||=n:p=n)}let _=g.length;if(i/=_,a/=_,l/=_,f/=_,m||c.reset(),p&&m){d=n;let r=m.x-p.x,i=m.y-p.y,a=m.lastX-p.lastX,u=m.lastY-p.lastY,g=Math.hypot(r,i)/Math.hypot(a,u)-1,_=Math.atan2(i,r)-Math.atan2(u,a);if(c.track(p,m),c.stateChanged&&(s.start(),o.cancel()),c.canScale&&(t.zoomToClientCoordinates(l,f,g),h=!0),c.canRotate&&(t.rotateByAngle(_,0),h=!0),c.canIncline){let e=m.y-m.lastY+p.y-p.lastY;t.rotateByAbsoluteOffset(0,e),h=!0}e.preventDefault(),e.stopPropagation()}let v=n-u,y=c.canIncline||v<300||e.touches.length>1&&c.isUnknown();(i!==0||a!==0)&&!y&&(t.panByAbsoluteOffset(i,a),h=!0),h&&t.redraw()}function g(e){let i=Date.now(),a=i-u;u=i;let f=e.changedTouches;for(let e=0;e<f.length;++e){let t=f[e];r.delete(t.identifier)}if(e.touches.length<2&&(c.reset(),s.stop(),o.stop()),e.touches.length===0&&r.clear(),r.size===0&&e.changedTouches.length===1){if(n=!1,v(),o.stop(),a<350&&i-d>350){let n=e.changedTouches[0],r=Math.abs(n.clientX-l.clientX),i=Math.abs(n.clientY-l.clientY);Math.hypot(r,i)<30&&t.zoomToClientCoordinates(l.clientX,l.clientY,.5,!0)}l=e.changedTouches[0]}}function _(){document.addEventListener(`touchmove`,h,{passive:!1}),document.addEventListener(`touchend`,g,{passive:!1}),document.addEventListener(`touchcancel `,g,{passive:!1})}function v(){document.removeEventListener(`touchmove`,h),document.removeEventListener(`touchend`,g),document.removeEventListener(`touchcancel `,g)}}function xc(e,t,n){let r=e*Math.cos(t);return[e*Math.sin(t)*Math.cos(n),e*Math.sin(t)*Math.sin(n),r]}function Sc(e,t,n){return e<t&&(e=t),e>n&&(e=n),e}function Cc(e,t){return e===void 0?t:e}function wc(e,t,n){return Math.abs(e)<t?n:e}function Tc(e,t){let n=0,r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;return h(),{dispose:g};function h(){e.getAttribute(`tabindex`)||e.setAttribute(`tabindex`,`0`),e.addEventListener(`keydown`,y),e.addEventListener(`keyup`,b)}function g(){e.removeEventListener(`keydown`,y),e.removeEventListener(`keyup`,b),cancelAnimationFrame(n)}function _(){n=0;let e=.9,h=!1;if(o=wc(o*e+r,.5,0),s=wc(s*e+i,.5,0),c=wc(c*e+a,.5,0),(o||s)&&(t.panByAbsoluteOffset(o,s),h=!0),c&&(t.slideCenterUpDown(c),h=!0),l=wc(l*e+u/2,Math.PI/360,0),p=wc(p*e+m/6,Math.PI/360,0),(l||p)&&(t.rotateByAbsoluteOffset(l,p),h=!0),d=wc(d*.7+f,.5,0),d){let e=Math.sign(d)*.025;t.zoomCenterByScaleFactor(e,0,0),h=!0}h&&(t.redraw(),v())}function v(){n||=requestAnimationFrame(_)}function y(e){x(e,1)}function b(e){x(e,0)}function x(e,t){if(!Ec(e)){switch(e.which){case 81:u=-t;break;case 69:u=t;break;case 187:f=t;break;case 189:f=-t;break;case 82:m=t;break;case 70:m=-t;break;case 37:case 65:r=t;break;case 39:case 68:r=-t;break;case 38:case 87:i=t;break;case 40:case 83:i=-t;break;case 71:a=-t;break;case 84:a=t}v()}}}function Ec(e){return e.altKey||e.ctrlKey||e.metaKey}function Dc(e,t){let n,r,i,{allowRotation:a,panAnimation:o,rotateAnimation:s}=t;return e.addEventListener(`wheel`,p,{passive:!1}),e.addEventListener(`mousedown`,l,{passive:!1}),e.addEventListener(`dblclick`,f,{passive:!1}),{dispose:c};function c(){e.removeEventListener(`wheel`,p,{passive:!1}),e.removeEventListener(`mousedown`,l,{passive:!1}),e.removeEventListener(`dblclick`,f,{passive:!1}),document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d)}function l(e){(e.button===1&&window.event!==null||e.button===0)&&(document.addEventListener(`mousemove`,u),document.addEventListener(`mouseup`,d),n=e.clientX,r=e.clientY,i=e.altKey&&a,o.cancel(),s.cancel(),i?s.start():o.start())}function u(e){let a=e.clientY-r,o=e.clientX-n;i?t.rotateByAbsoluteOffset(o,a):t.panByAbsoluteOffset(o,a),n=e.clientX,r=e.clientY,t.redraw()}function d(){document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d),i?s.stop():o.stop()}function f(e){t.zoomToClientCoordinates(e.clientX,e.clientY,.5,!0),e.preventDefault(),e.stopPropagation()}function p(e){let n=e.deltaMode>0?100:1,r=m(-e.deltaY*n);t.zoomToClientCoordinates(e.clientX,e.clientY,r),e.preventDefault()}function m(e){return Math.sign(e)*Math.min(.25,Math.abs(e/128))}}function Oc(e,t){if(typeof e==`string`){let t=document.querySelector(e);if(!t)throw Error(`Cannot resolve input target element: `+e);return t}return e||t}var kc=class{drawContext;updated;constructor(e){this.drawContext=e.getDrawContext(),this.updated=!1}};function Ac(e){let t=e.getDrawContext(),n=t.view,r=Math.PI*2,i=Math.PI*1.618,a=new kc(e),o=e.getOptions()||{},s=o.allowRotation===void 0||!!o.allowRotation,c=o.allowPinchRotation===void 0?s:!!o.allowPinchRotation,l=Cc(o.minPhi,-1/0),u=Cc(o.maxPhi,1/0),d=Sc(-Math.PI/2,l,u),f=Cc(o.minTheta,0),p=Cc(o.maxTheta,Math.PI),m=Sc(0,f,p),h=Cc(o.minZoom,-1/0),g=Cc(o.maxZoom,1/0),_=Sc(1,h,g),v=n.center,y=n.position,b=dc(L,z),x=dc(R,ee,{minVelocity:1}),S=[0,0,1],C={dispose:k,setViewBox:O,panByAbsoluteOffset:N,slideCenterUpDown:I,rotateByAngle:j,rotateByAbsoluteOffset:M,zoomCenterByScaleFactor:B,zoomToClientCoordinates:P,redraw:V,allowRotation:s,allowPinchRotation:c,rotateAnimation:x,panAnimation:b},w=Oc(o.inputTarget,t.canvas),T=Tc(w,C),E=bc(w,C),D=Dc(w,C);return V(),C;function O(){return y=n.position,_=Math.hypot(y[2]),v[0]=y[0],v[1]=y[1],v[2]=0,m=Sc(0,f,p),d=Sc(-Math.PI/2,l,u),V(),C}function k(){x.cancel(),b.cancel(),E.dispose(),T.dispose(),D.dispose()}function A(t,n){let r=e.getSceneCoordinate(t,n),i=bs(r,r,y);hs(i,i);let a=gs(S,i);if(Math.abs(a)>1e-7){let e=gs(bs([0,0,0],v,y),S)/a;return ms([0,0,0],y,i,e)}}function j(e,t){d=Sc(d+e,l,u),m=Sc(m+t,f,p)}function M(e,n){if(!s)return;let a=t.width/t.height;d-=r*e/t.width,m-=i*n/t.height*a,m=Sc(m,f,p),d=Sc(d,l,u)}function N(e,n){let r=t.width/t.height,i=2*_*Math.tan(t.fov/2);F(r*i*e/(t.width/t.pixelRatio),-(i*n/(t.height/t.pixelRatio)))}function P(e,t,n,r){let i=A(e,t);if(!i)return;let a=i[0]-v[0],o=i[1]-v[1];if(r){let e={r:_,x:v[0],y:v[1]},t={r:Sc(_*(1-n),h,g),x:e.x+a*n,y:e.y+o*n};Vs.exports(e,t,{step(e){_=e.r,v[0]=e.x,v[1]=e.y,V()}})}else B(n,a,o),V()}function F(e,t){let n=Math.cos(d),r=Math.sin(d);v[0]+=n*t+r*e,v[1]+=r*t-n*e}function I(e){v[2]+=e*_*.001}function L(){return{x:v[0],y:v[1],z:v[2]}}function R(){return{x:d,y:m,z:0}}function ee(e,t){m=Sc(t,f,p),d=Sc(e,l,u),V()}function z(e,t,n){ds(v,e,t,n),V()}function B(e,t,n){let r=Sc(_*(1-e),h,g);r!==_&&(_=r,v[0]+=t*e,v[1]+=n*e)}function V(){let t=xc(_,m,d),r=Math.hypot(_,1),i=xc(r,m-Math.acos(_/r),d);bs(i,i,t),ds(y,t[0],t[1],t[2]),fs(y,y,v),ss(n.cameraWorld,y,v,i),is(n.orientation,n.cameraWorld),n.update(),a.updated=!1,e.fire(`transform`,a),a.updated?V():(e.getRoot().scheduleMVPUpdate(),e.renderFrame())}}Uo(Float64Array);function jc(e,t={}){let n,r,i=t.devicePixelRatio||window.devicePixelRatio,a=t.wglContextOptions,o=e.getContext(t.version===2?`webgl2`:`webgl`,a)||e.getContext(`experimental-webgl`,a);o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT);let s=0,c=new Ns,l=!1,u=!1,d=Oc(t.inputTarget,e),f,p=new Bs,m=Go(),h=Go(),g=t.fov===void 0?Math.PI*45/180:t.fov,_=t.near===void 0?.01:t.near,v=t.far===void 0?1/0:t.far,y={width:window.innerWidth,height:window.innerHeight,pixelRatio:i,canvas:e,projection:m,inverseProjection:h,view:p,fov:g};R();let b=Ro({appendChild:ae,getSceneCoordinate:B,getClientCoordinate:V,getTransform:M,getRoot:k,getGL:O,removeChild:H,setViewBox:te,setClearColor:N,getClearColor:P,clear:ie,dispose:I,renderFrame:ne,getPixelRatio:w,setPixelRatio:D,updateCanvasSize:R,getCameraController:j,setCameraController:A,getDrawContext:T,getOptions:E}),x=b.on;b.on=oe,c.bindScene(b);let S=(t.controls||Ac)(b),C;return F(),ne(),b;function w(){return i}function T(){return y}function E(){return t}function D(e){i=e,y.pixelRatio=i,R()}function O(){return o}function k(){return c}function A(e){return S&&S.dispose(),S=e(b,y),S}function j(){return S}function M(){return c.model}function N(e,t,n,r){o.clearColor(e,t,n,r)}function P(){return o.getParameter(o.COLOR_CLEAR_VALUE)}function F(){d.addEventListener(`mousemove`,z),C=Fs(d,ee),window.addEventListener(`resize`,L,!0)}function I(){d.removeEventListener(`mousemove`,z),C&&C(),window.removeEventListener(`resize`,L,!0),S.dispose(),c.dispose(),s&&=(cancelAnimationFrame(s),0)}function L(){R()}function R(){t.size?(n=e.width=t.size.width,r=e.height=t.size.height):(n=e.width=e.offsetWidth*i,r=e.height=e.offsetHeight*i),f=e.getBoundingClientRect(),o.viewport(0,0,n,r),y.width=n,y.height=r,c.worldTransformNeedsUpdate=!0,os(m,g,n/r,_,v),qo(h,m),ne()}function ee(e){if(l){var t=B(e.clientX,e.clientY);t&&b.fire(`click`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function z(e){if(u){var t=B(e.clientX,e.clientY);t&&b.fire(`mousemove`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function B(e,t){e-=f.left,t-=f.top;var i=b.getPixelRatio();let a=vs([0,0,0],[i*e/n*2-1,(1-i*t/r)*2-1,0],h);vs(a,a,p.cameraWorld),bs(a,a,p.position),hs(a,a);var o=(0-p.position[2])/a[2];return a[2],ms(a,p.position,a,o),a}function V(e,t,i=0){var a=Jo(Go(),m,p.matrix);Jo(a,a,c.model);var o=Ts([0,0,0,0],[e,t,i,1],a),s=b.getPixelRatio();return{x:n*(o[0]/o[3]+1)*.5/s,y:r*(1-(o[1]/o[3]+1)*.5)/s}}function te(e){let t=y.pixelRatio*Math.max((e.top-e.bottom)/2,(e.right-e.left)/2),{position:n,orientation:r}=y.view;n[0]=(e.left+e.right)/2,n[1]=(e.top+e.bottom)/2,n[2]=t/Math.tan(y.fov/2),As(r,0,0,0,1),y.view.update(),S.setViewBox&&S.setViewBox(e)}function ne(e=!1){if(e)return re();s||=requestAnimationFrame(re)}function re(){o.clear(o.COLOR_BUFFER_BIT),c.updateWorldTransform(),c.draw(o,y),s=0}function ie(){o.clear(o.COLOR_BUFFER_BIT)}function ae(e,t=!1){c.appendChild(e,t),b.fire(`append-child`,e)}function H(e){c.removeChild(e),b.fire(`remove-child`,e)}function oe(e,t,n){return e===`click`&&(l=!0),e===`mousemove`&&(u=!0),x(e,t,n)}}var Mc={compile:Nc,link:Pc,getLocations:Fc,getAttributes:Ic,getUniforms:Lc,initBuffer:Rc};function Nc(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Failed to create a shared `+n);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)||`Failed to compile shader `+n);return r}function Pc(e,t,n){let r=e.createProgram();if(!r)throw Error(`Failed to link a program`);if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)||`Failed to link a program`);return r}function Fc(e,t){return{attributes:Ic(e,t),uniforms:Lc(e,t)}}function Ic(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES),i=0;i<r;++i){var a=e.getActiveAttrib(t,i);if(a){let r=a.name;n[r]=e.getAttribLocation(t,r)}}return n}function Lc(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS),i=0;i<r;++i){var a=e.getActiveUniform(t,i);if(a){let r=a.name;n[r]=e.getUniformLocation(t,r)}}return n}function Rc(e,t,n,r){var i=e.createBuffer();if(!i)throw Error(`Failed to create a buffer`);e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.vertexAttribPointer(r,n,e.FLOAT,!1,0,0),e.enableVertexAttribArray(r)}function zc(){let e=new Map;return{get:t,set:n,remove:r};function t(t){if(!t)return;let n=e,r;for(let e=0;e<t.length;++e){let i=t[e];if(r=n.get(i),!r)return;n=r}return r}function n(t,n){let r=e;for(let e=0;e<t.length-1;++e){let n=t[e],i=r.get(n);i||(i=new Map,r.set(n,i)),r=i}r.set(t[t.length-1],n)}function r(t){let n=e;for(let e=0;e<t.length-1;++e){let r=t[e],i=n.get(r);if(!i)return;n=i}n.delete(t[t.length-1])}}var Bc=class{r;g;b;a;constructor(e,t,n,r=1){this.r=e,this.g=t,this.b=n,this.a=r===void 0?1:r}},Vc=zc();function Hc(e,t){let n=!!t.allowColors,r=[n,e],i=Vc.get(r);if(!i){let{frag:t,vert:s}=Uc(n);var a=Mc.compile(e,e.VERTEX_SHADER,s),o=Mc.compile(e,e.FRAGMENT_SHADER,t);i=Mc.link(e,a,o),Vc.set(r,i)}let s=Mc.getLocations(e,i),c=e.createBuffer(),l=t.is3D?3:2,u=(l+1)*4,d=l*4;return{draw:p,dispose:f};function f(){e.deleteBuffer(c),e.deleteProgram(i),Vc.remove(r)}function p(r){if(t.count===0)return;let a=t.buffer;e.useProgram(i),e.uniformMatrix4fv(s.uniforms.uModel,!1,t.worldModel),e.uniformMatrix4fv(s.uniforms.projectionMatrix,!1,r.projection),e.uniformMatrix4fv(s.uniforms.uView,!1,r.view.matrix);var o=t.color;e.uniform4f(s.uniforms.uColor,o.r,o.g,o.b,o.a),e.bindBuffer(e.ARRAY_BUFFER,c),t.isDirtyBuffer&&=(e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),!1),e.enableVertexAttribArray(s.attributes.aPosition),n?(e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,u,0),e.enableVertexAttribArray(s.attributes.aColor),e.vertexAttribPointer(s.attributes.aColor,4,e.UNSIGNED_BYTE,!0,u,d)):e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,4*l,0),e.drawArrays(e.LINES,0,t.count*2)}}function Uc(e){return{vert:`attribute vec3 aPosition;
  varying vec4 vColor;
  ${e?`attribute vec4 aColor;`:``}
  uniform vec4 uColor;
  uniform mat4 projectionMatrix;
  uniform mat4 uModel;
  uniform mat4 uView;

void main() {
  gl_Position = projectionMatrix * uView * uModel * vec4(aPosition, 1.0);
  vColor = ${e?`aColor.abgr`:`uColor`};
}`,frag:`precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }`}}var Wc=zc();function Gc(e,t){let n=Number.isFinite(t.width)&&t.width>0&&t.width!==1,r;if(n){if(r=e.getExtension(`ANGLE_instanced_arrays`),!r)return console.error(`ANGLE_instanced_arrays is not supported, thick lines are not possible`),Hc(e,t)}else return Hc(e,t);let i=!!t.allowColors,a=[i,e],o=Wc.get(a);if(!o){let{frag:t,vert:n}=Kc(i);var s=Mc.compile(e,e.VERTEX_SHADER,n),c=Mc.compile(e,e.FRAGMENT_SHADER,t);o=Mc.link(e,s,c),Wc.set(a,o)}let l=Mc.getLocations(e,o),u=e.createBuffer(),d=t.is3D?3:2,f=i?2*(d+1)*4:2*d*4,p=e.createBuffer(),m=new Float32Array([-.5,0,-.5,1,.5,1,-.5,0,.5,1,.5,0]);return{isThickWire:!0,draw:g,dispose:h};function h(){u&&e.deleteBuffer(u),p&&e.deleteBuffer(p),l&&(e.disableVertexAttribArray(l.attributes.aFrom),e.disableVertexAttribArray(l.attributes.aFromColor),e.disableVertexAttribArray(l.attributes.aTo),e.disableVertexAttribArray(l.attributes.aToColor),e.disableVertexAttribArray(l.attributes.aPosition)),e.deleteProgram(o),Wc.remove(a)}function g(n){if(t.count===0)return;let a=t.buffer;e.useProgram(o),e.uniformMatrix4fv(l.uniforms.uModel,!1,t.worldModel),e.uniformMatrix4fv(l.uniforms.projectionMatrix,!1,n.projection),e.uniformMatrix4fv(l.uniforms.uView,!1,n.view.matrix),e.uniform3fv(l.uniforms.uOrigin,n.view.position),e.uniform1f(l.uniforms.uWidth,t.width),e.uniform2f(l.uniforms.uResolution,n.width,n.height);var s=t.color;e.uniform4f(l.uniforms.uColor,s.r,s.g,s.b,s.a),e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,m,e.STATIC_DRAW),e.enableVertexAttribArray(l.attributes.aPosition),e.vertexAttribPointer(l.attributes.aPosition,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,a,e.DYNAMIC_DRAW),e.enableVertexAttribArray(l.attributes.aFrom),e.vertexAttribPointer(l.attributes.aFrom,d,e.FLOAT,!1,f,0),i?(e.enableVertexAttribArray(l.attributes.aFromColor),e.vertexAttribPointer(l.attributes.aFromColor,4,e.UNSIGNED_BYTE,!0,f,d*4),e.enableVertexAttribArray(l.attributes.aTo),e.vertexAttribPointer(l.attributes.aTo,d,e.FLOAT,!1,f,(d+1)*4),e.enableVertexAttribArray(l.attributes.aToColor),e.vertexAttribPointer(l.attributes.aToColor,4,e.UNSIGNED_BYTE,!0,f,(2*d+1)*4)):(e.enableVertexAttribArray(l.attributes.aTo),e.vertexAttribPointer(l.attributes.aTo,d,e.FLOAT,!1,f,d*4)),r.vertexAttribDivisorANGLE(l.attributes.aPosition,0),r.vertexAttribDivisorANGLE(l.attributes.aTo,1),r.vertexAttribDivisorANGLE(l.attributes.aFrom,1),r.vertexAttribDivisorANGLE(l.attributes.aFromColor,1),r.vertexAttribDivisorANGLE(l.attributes.aToColor,1),r.drawArraysInstancedANGLE(e.TRIANGLES,0,6,t.count),r.vertexAttribDivisorANGLE(l.attributes.aFrom,0),r.vertexAttribDivisorANGLE(l.attributes.aTo,0),r.vertexAttribDivisorANGLE(l.attributes.aFromColor,0),r.vertexAttribDivisorANGLE(l.attributes.aToColor,0)}}function Kc(e){return{vert:`attribute vec3 aPosition, aFrom, aTo;
    varying vec4 vColor;
    ${e?`attribute vec4 aFromColor, aToColor;`:``}
    uniform vec4 uColor;
    uniform mat4 projectionMatrix;
    uniform mat4 uModel;
    uniform mat4 uView;
    uniform float uWidth;
    uniform vec2 uResolution;
  
  void main() {
    // let's get the model point to clip space:
    vec4 clip0 = projectionMatrix * uView * uModel * vec4(aFrom, 1.0);
    vec4 clip1 = projectionMatrix * uView * uModel * vec4(aTo, 1.0);

    // And from the clip space move to the screen pixels 
    // (as we set width of the lines in pixels)
    vec2 screen0 = uResolution * (0.5 * clip0.xy/clip0.w + 0.5);
    vec2 screen1 = uResolution * (0.5 * clip1.xy/clip1.w + 0.5);

    // this is direction along the x axis
    vec2 xBasis = normalize(screen1 - screen0);
    // But since we set the width, we get the direction along the Y:
    vec2 yBasis = vec2(-xBasis.y, xBasis.x);

    // Offset the original points:
    vec2 pt0 = screen0 + uWidth * aPosition.x * yBasis;
    vec2 pt1 = screen1 + uWidth * aPosition.x * yBasis;

    // and interpolate along the Y of the instanced geometry 
    // (remember, Y changes from 0 to 1):
    vec2 pt = mix(pt0, pt1, aPosition.y);
    vec4 clip = mix(clip0, clip1, aPosition.y);

    // Finally move back to the clip space:
    gl_Position = vec4(clip.w * (2.0 * pt/uResolution - 1.0), clip.z, clip.w);
    vColor = ${e?`mix(aFromColor.abgr, aToColor.abgr, aPosition.y)`:`uColor`};
  }`,frag:`precision mediump float;
    varying vec4 vColor;
    void main() {
      gl_FragColor = vColor;
    }`}}var qc=class{offset;_wire;update;constructor(e,t){this.offset=t,this._wire=e,this.update=e.is3D?this.update3D:this.update2D}update2D(e,t){this._wire.isDirtyBuffer=!0;var n=this._wire.positions,r=this.offset;n[r+0]=e.x,n[r+1]=e.y,r+=2;var i=this._wire.allowColors;i&&(e.color!==void 0&&(this._wire.colors[r]=e.color),r+=1),n[r+0]=t.x,n[r+1]=t.y,i&&t.color!==void 0&&(this._wire.colors[r+2]=t.color)}update3D(e,t){this._wire.isDirtyBuffer=!0;var n=this._wire.positions,r=this.offset;n[r+0]=e.x,n[r+1]=e.y,n[r+2]=e.z||0,r+=3;var i=this._wire.allowColors;i&&(e.color===void 0?this._wire.colors[r]=Jc(this._wire.color):this._wire.colors[r]=e.color,r+=1),n[r+0]=t.x,n[r+1]=t.y,n[r+2]=t.z||0,i&&(t.color===void 0?this._wire.colors[r+3]=Jc(this._wire.color):this._wire.colors[r+3]=t.color)}};function Jc(e){let t=Math.round(e.r*255),n=Math.round(e.g*255),r=Math.round(e.b*255),i=Math.round(e.a*255);return t<<24|n<<16|r<<8|i}function Yc(e,t,n=.5){let r=Xc(e),i=Xc(t);return[r[0]*n+(1-n)*i[0],r[1]*n+(1-n)*i[1],r[2]*n+(1-n)*i[2],r[3]*n+(1-n)*i[3]]}function Xc(e){return[e>>24&1,e>>16&1,e>>8&1,e&1]}var Zc=class extends Ns{allowColors;is3D;itemsPerLine;capacity;count;color;width;buffer;positions;colors;isDirtyBuffer;_program;constructor(e,t){super(),this.allowColors=!t||t.allowColors===void 0||t.allowColors,this.is3D=!t||t.is3D===void 0||t.is3D,this.itemsPerLine=4,this.is3D&&(this.itemsPerLine+=2),this.allowColors&&(this.itemsPerLine+=2),this.capacity=e,this.count=0,this.color=new Bc(1,1,1,1),this.type=`WireCollection`,this._program=null,this.buffer=new ArrayBuffer(e*this.itemsPerLine*4),this.positions=new Float32Array(this.buffer),this.width=t&&t.width||1,this.colors=this.allowColors?new Uint32Array(this.buffer):null,this.isDirtyBuffer=!0}draw(e,t){this._program||=Qc(this.width)?Gc(e,this):Hc(e,this),this._program.draw(t)}setLineWidth(e){if(e===this.width)return;let t=Qc(e);if(this.width=e,this._program&&this.scene){if(t&&this._program.isThickWire)this.scene.renderFrame();else if(this.parent){let e=this.parent;e.removeChild(this),this.dispose(),e.appendChild(this)}}}add(e){if(!e)throw Error(`Line is required`);this.count>=this.capacity&&this._extendArray();var t=this.count*this.itemsPerLine;let n=new qc(this,t);return n.update(e.from,e.to),this.count+=1,n}getLineColor(e,t){return this.allowColors&&e&&e.color&&t&&t.color?Yc(e.color,t.color):[this.color.r,this.color.g,this.color.b,this.color.a]}forEachLine(e){let{positions:t,count:n,itemsPerLine:r}=this,i=n*r;if(this.is3D)for(let n=0;n<i;n+=r){let r={x:t[n],y:t[n+1],z:t[n+2]},i=n+3;this.colors&&(r.color=this.colors[n+3],i+=1);let a={x:t[i],y:t[i+1],z:t[i+2]};this.colors&&(a.color=this.colors[i+3]),e(r,a)}else for(let n=0;n<i;n+=r){let r={x:t[n],y:t[n+1],z:0},i=n+2;this.colors&&(r.color=this.colors[n+2],i+=1);let a={x:t[i],y:t[i+1],z:0};this.colors&&(a.color=this.colors[i+2]),e(r,a)}}dispose(){this._program&&=null}_extendArray(){var e=new ArrayBuffer(this.buffer.byteLength*2),t=new Float32Array(e);this.positions&&t.set(this.positions),this.buffer=e,this.positions=t,this.allowColors&&(this.colors=new Uint32Array(e)),this.capacity*=2}};function Qc(e){return e!==void 0&&e!==1&&e>0}function $c(e,t={}){e.getCameraController();let n={redraw:Function.prototype,dispose:Function.prototype},r=t.lineColor||196194594,i=t.maxAlpha||255,a=l(r),o=u(t.cursorColor||4294967295);return e.on(`transform`,c),{dispose:s,update:c};function s(){e.off(`transform`,c),a.dispose(),o.dispose()}function c(){a.redraw(),o.redraw()}function l(r){if(t.showGrid===!1)return n;let a=new Zc(130,{width:2.5,is3D:!0,allowColors:!0});a.svgInvisible=!0;let o=new Zc(130,{width:1.5,is3D:!0,allowColors:!0});o.svgInvisible=!0;let s=e.getDrawContext(),c=s.view.center;return d(),e.appendChild(o),e.appendChild(a),{redraw:d,dispose:l};function l(){e.removeChild(o),e.removeChild(a)}function u(e){return 1-(e-Math.floor(e))}function d(){let t=e.getDrawContext().view.position,n=t[0]-c[0],r=t[1]-c[1],l=t[2]-c[2],d=Math.sqrt(n*n+r*r+l*l)*Math.tan(s.fov/2),p=Math.log10(d),m=10**Math.floor(p),h=u(p),g=Math.round(h*i),_=Math.floor(c[0]/m)*m-Math.floor(64*m/2),v=Math.floor(c[1]/m)*m-Math.floor(64*m/2),y=_+m*64,b=v+m*64;f(o,_,v,y,b,m,g),f(a,_,v,y,b,m*10,i-g)}function f(e,t,n,i,a,o,s){e.model[14]=c[2],e.worldTransformNeedsUpdate=!0,e.count=0;let l=r&4294967040|s,u=Math.ceil(n/o)*o;for(let n=u;n<=a;n+=o)e.add({from:{x:t,y:n,color:l},to:{x:i,y:n,color:l}});let d=Math.ceil(t/o)*o;for(let t=d;t<=i;t+=o)e.add({from:{x:t,y:n,color:l},to:{x:t,y:a,color:l}})}}function u(r){if(t.showCursor===!1)return n;let i=e.getDrawContext().view.center,a=e.getDrawContext().view.position,o=new Zc(361,{width:3,is3D:!0,allowColors:!0});o.svgInvisible=!0;let s,c=[];for(let e=0;e<=360;++e)c.push(o.add({from:{x:0,y:0,color:r},to:{x:e,y:e,color:r}}));return e.appendChild(o),u(),{redraw:u,dispose:l};function l(){e.removeChild(o)}function u(){let e=a[0]-i[0],t=a[1]-i[1],n=a[2]-i[2],l=Math.sqrt(e*e+t*t+n*n);l*=.025;for(let e=0;e<=361;++e){let t=e/360*2*Math.PI;if(e===0){s={x:l*Math.cos(t),y:l*Math.sin(t),color:r};continue}let n={x:l*Math.cos(t),y:l*Math.sin(t),color:r};c[e-1].update(s,n),s=n}o.model[12]=i[0],o.model[13]=i[1],o.model[14]=i[2],o.worldTransformNeedsUpdate=!0}}}var el={mat4:`uniformMatrix4fv`,mat3:`uniformMatrix3fv`,mat2:`uniformMatrix2fv`,vec4:`uniform4fv`,vec3:`uniform3fv`,vec2:`uniform2fv`,float:`uniform1f`,bool:`uniform1i`,int:`uniform1i`},tl=class{name;functionName;location;constructor(e,t){let n=el[t];if(!n)throw Error(`Function name for uniform is required`);this.name=e,this.functionName=n,this.location=`${this.name}UniformLocation`}getInitBlockForDraw(){return`let ${this.location} = gl.getUniformLocation(program, '${this.name}');`}getDraw(){return this.functionName.indexOf(`Matrix`)>-1?`gl.${this.functionName}(${this.location}, false, uniforms.${this.name});`:`gl.${this.functionName}(${this.location}, uniforms.${this.name});`}},nl=class{name;offset;variableName;ready;location;isTexture;constructor(e,t=0){this.name=e,this.offset=t,this.variableName=`${e}Texture`,this.ready=`${this.variableName}Ready`,this.location=`${this.name}UniformLocation`,this.isTexture=!0}getInitBlockForDraw(){return`
  let ${this.location} = gl.getUniformLocation(program, '${this.name}');
  let ${this.variableName} = gl.createTexture();
  let ${this.ready} = false;
`}getTextureInitCanvasBlock(){return`
  gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
  gl.bindTexture(gl.TEXTURE_2D, ${this.variableName});
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, textureCanvas);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.bindTexture(gl.TEXTURE_2D, null);
  ${this.ready} = true`}getDraw(){return`
    gl.activeTexture(gl.TEXTURE${this.offset});
    gl.bindTexture(gl.TEXTURE_2D, ${this.variableName});
    gl.uniform1i(${this.location}, ${this.offset});
`}},rl=class{type;debug;bufferViewType;count;name;bytePerElement;constructor(){this.type=`gl.FLOAT`,this.debug=!1,this.bufferViewType=`Float32Array`,this.count=1,this.name=void 0,this.bytePerElement=4}setName(e){this.name=e}getInitBlockForBuffer(e){return this.ensureNameIsSet(),`${e?`let `:``}${this.name}Array = new ${this.bufferViewType}(buffer);`}getInitBlockForDraw(){this.ensureNameIsSet();let{name:e}=this;return`let ${e}AttributeLocation = gl.getAttribLocation(program, '${e}');`}getAddBlock(e,t){throw Error(`Concrete types have to implement this`)}getMoveBlock(e,t){throw Error("Concrete type have to implement `getMoveBlock`")}getGetBlock(e){throw Error("Concrete types have to implement `getGetBlock`")}getDivisor(e){this.ensureNameIsSet();let t=`${this.name}AttributeLocation`;return`if (${t} > -1) gle.vertexAttribDivisorANGLE(${t}, ${e});`}getDraw(e,t){this.ensureNameIsSet();let n=`${this.name}AttributeLocation`;return`
    gl.enableVertexAttribArray(${n});
    gl.vertexAttribPointer(${n}, ${this.count}, ${this.type}, false, ${e}, ${t});`}ensureNameIsSet(){if(!this.name)throw Error(`You have to call setName() before using attributes`)}},il=class extends rl{constructor(e){super(),this.count=e}getAddBlock(e,t=`
`){let n=this.name,r=`${n}Array`,i=[];this.debug&&i.push(`if (item.${n} === undefined) throw new Error('Attribute "${n}" is missing');\n`);for(let t=0;t<this.count;++t){let a=`item.${n}[${t}]`;this.debug&&i.push(`if (${a} === undefined) throw new Error('Attribute "${n}" is missing value at index ${t}');\n`),i.push(`${r}[index + ${e+t}] = ${a};`)}return{code:i.join(t),offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=[];for(let t=0;t<this.count;++t)r.push(`${n}[to + ${e+t}] = ${n}[from + ${e+t}];`);return r.join(t)}getGetBlock(e){let t=`${this.name}Array`,n=[];for(let r=0;r<this.count;++r)n.push(`${t}[index + ${e+r}]`);return`${this.name}: [${n.join(`, `)}]`}},al=class extends rl{getAddBlock(e){let t=this.name,n=`${t}Array`,r=``;return this.debug&&(r=`if (item.${t} === undefined) throw new Error('Attribute "${t}" is missing');`),r+=`${n}[index + ${e}] = item.${t};`,{code:r,offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=``;return r+=`${n}[to + ${e}] = ${n}[from + ${e}];${t}`,r}getGetBlock(e){return`${this.name}: ${this.name}Array[index + ${e}]`}},ol={vec4:()=>new il(4),vec3:()=>new il(3),vec2:()=>new il(2),float:()=>new al};function sl(e,t){let n=[],r=[],i=cl(e.vertex,e.fragment,t);i.attributes.forEach(t=>{let{name:i,type:a}=t,o=e.attributes&&e.attributes[i];if(!o&&typeof ol[a]==`function`&&(o=ol[a]()),!o)throw console.error(`Unknown type ${a} for ${i}`),Error(`Unknown type ${a} for ${i}`);o.debug=e&&e.debug||!1,o.setName(i);let s=e.instanced&&e.instanced[i];s?(s.setTypeDefinition(o),r.push(s)):n.push(o)});let a=[],o=0;i.uniforms.forEach(e=>{let t=e.name;e.type===`sampler2D`?a.push(new nl(t,o++)):a.push(new tl(t,e.type))});let s=0,c=0;if(n.forEach(e=>{c+=e.count,s+=e.count*e.bytePerElement}),e.attributeLayout){let t=new Map;e.attributeLayout.forEach((e,n)=>t.set(e,n)),n.sort((e,n)=>t.get(e.name)-t.get(n.name))}return{bytePerVertex:s,itemPerVertex:c,attributes:n,instanced:r,uniforms:a}}function cl(e,t,n){let r=n?/in\s+(.+);/:/attribute\s+(.+);/,i=/uniform\s+(.+);/,a=[],o=[];return e.split(`
`).forEach(e=>{let t=e.match(r);if(t&&!e.trim().startsWith(`//`)){s(t[1],a);return}let n=e.match(i);n&&!e.trim().startsWith(`//`)&&s(n[1],o)}),t.split(`
`).forEach(e=>{let t=e.match(i);t&&s(t[1],o)}),{attributes:a,uniforms:o};function s(e,t){let n=e.replace(/,/g,` `).split(` `).filter(e=>e),r=n[0];for(let e=1;e<n.length;++e){let i=n[e];t.find(e=>e.name===i)||t.push({type:r,name:i})}}}var ll=class{api;init;bufferInit;implementation;attributesDrawBlock;constructor(){this.api=[],this.init=[],this.implementation=[],this.bufferInit=[]}addToInit(e){e&&this.init.push(e)}addBufferInit(e){e&&this.bufferInit.push(e)}addToAPI(e){e&&this.api.push(e)}addToImplementation(e){e&&this.implementation.push(e)}setAttributesDrawBlock(e){this.attributesDrawBlock=e}link(){let e=[];return this.init.forEach(t),t(`  return {`),this.api.forEach(t),t(`  };`),this.implementation.forEach(t),e.join(`
`);function t(t){Array.isArray(t)?e.push(t.join(`
    `)):e.push(t)}}};function ul(e){let t=e.gl,n=sl(e,typeof WebGL2RenderingContext<`u`&&t instanceof WebGL2RenderingContext),r=v(e.vertex,e.fragment),i=e.preDrawHook||dl,a=e.postDrawHook||dl,o=l(n),s=o.link(),c=Function(`gl`,`program`,s)(t,r);return e.debug&&(console.log(`Compiled code: `),console.log(s)),c.getCode=()=>o,c.dispose=()=>{t.deleteProgram(r)},c;function l(t){let n=new ll;return m(t,n),e.sourceBuffer?u(t,n):(h(t,n),d(t,n)),f(t,n),p(t,n),n}function u(e,t){t.addToInit([`let glBuffer;`,``]),t.addToAPI([`setGLBuffer: (newBuffer) => glBuffer = newBuffer,`])}function d(e,t){t.addToInit([`let glBuffer = gl.createBuffer();`,`if (!glBuffer) throw new Error('failed to create a WebGL buffer');`,``]),t.addToAPI([`getGLBuffer: () => glBuffer,`])}function f(e,t){let{uniforms:n}=e,r=[];if(n.forEach(e=>{e instanceof nl&&r.push(e)}),!r.length)return;t.addToAPI(`setTextureCanvas: setTextureCanvas,`);let i=r.map(e=>`
      case '${e.name}': {
        ${e.getTextureInitCanvasBlock()}
        return;
      }
      `);t.addToImplementation(`
  function setTextureCanvas(textureName, textureCanvas) {
    switch(textureName) {
      ${i.join(`
      `)}
    }
    throw new Error('Unknown texture name: ' + textureName);
  }
`);let a=r.map(e=>`case '${e.name}': return ${e.variableName};`);t.addToAPI(`getTextureByName: getTextureByName,`),t.addToImplementation(`
  function getTextureByName(textureName) {
    switch(textureName) {
      ${a.join(`
      `)}
    }
    throw new Error('Unknown texture name: ' + textureName);
  }
`)}function p(t,n){let{attributes:r,instanced:o,uniforms:s,bytePerVertex:c,itemPerVertex:l}=t,u=e.sourceBuffer&&e.sourceBuffer.getCode();u?(n.addToInit(u.bufferInit),n.addBufferInit(u.bufferInit)):r.forEach(e=>{let t=`  `+e.getInitBlockForDraw();n.addToInit(t),n.addBufferInit(t)});let d=[];s.forEach(e=>{n.addToInit(`  `+e.getInitBlockForDraw()),e instanceof nl&&d.push(e)}),o.length&&(n.addToInit(`  let gle = gl.getExtension('ANGLE_instanced_arrays');
  if (!gle) {
    // Not sure if this is going to be an error, given instancing is widely supported. But
    // If you get this error please ping me so that we can find a fallback solution
    throw new Error('Instanced collection requires instancing support. Please ping @anvaka so that we can add fallback');
  }
`),o.forEach(e=>{n.addToInit(`  `+e.getInitBlock())}));let f=[];if(u)f=u.attributesDrawBlock;else{let e=0;r.forEach(t=>{f.push(t.getDraw(c,e)),e+=t.count*t.bytePerElement})}n.setAttributesDrawBlock(f),n.addToImplementation(p()),n.addToAPI([`draw: draw,`]);function p(){let n=s.map(e=>e.getDraw()),c=[],l=[],u=[];o.forEach(e=>{c.push(e.getDraw()),l.push(e.getDivisor(0)),u.push(e.getDivisor(0))});let p=[];return o.length?(r.forEach(e=>{l.push(e.getDivisor(1)),u.push(e.getDivisor(0))}),p.push(l.join(`
    `)),p.push(`gle.drawArraysInstancedANGLE(gl.TRIANGLES, 0, 6, count)`),p.push(u.join(`
    `))):p.push(`gl.drawArrays(gl.TRIANGLES, 0, count)`),` 
  function draw(uniforms, from, to) {
    ${h()}
    ${g()}
    ${i(t)}

    gl.useProgram(program);
    ${n.join(`
    `)}
    ${c.join(`
    `)}

    gl.bindBuffer(gl.ARRAY_BUFFER, glBuffer);
    ${m()}

    ${f.join(`
    `)}
    ${p.join(`
    `)}

    ${a(t)}
  }`;function m(){return e.sourceBuffer?``:`  if (isDirty) {
          gl.bufferData(gl.ARRAY_BUFFER, buffer, gl.DYNAMIC_DRAW);
          isDirty = false;
        }`}function h(){return`if (count === 0) return;`}function g(){return d.length===0?``:d.map(e=>`if (!${e.ready}) return;`).join(`
    `)}}}function m(e,t){t.addToInit([`  var count = 0;`]),t.addToAPI([`setCount: (newCount) => count = newCount,`,`getCount: () => count,`])}function h(t,n){let{attributes:r,bytePerVertex:i,itemPerVertex:a}=t;n.addToInit([`var bytePerVertex = ${i};`,`var itemPerVertex = ${a};`,`var capacity = ${(e.capacity||1)*i};`,`var buffer = new ArrayBuffer(capacity);`,``,`var isDirty = true;`,`var dirtyOffset = 0;`]),r.forEach(e=>{n.addToInit(e.getInitBlockForBuffer(!0))}),n.addToAPI([`add: add,`,`get: get,`,`update: update,`,`remove: remove,`,`getBuffer: getBuffer,`,`appendBuffer: appendBuffer,`]),n.addToImplementation(o());function o(){let e=[],t=[],n=[],i=[],a=0;return r.forEach(o),`
  function add(item) {
    if (count * bytePerVertex >= capacity) {
      extend();
    }

    var index = count * itemPerVertex;

    ${e.join(``)}

    isDirty = true;
    return count++;
  }

  function update(index, item) {
    ${g()}
    index *= itemPerVertex;
    ${e.join(`
    `)}
    isDirty = true;
  }

  function remove(index) {
    ${_()}
    isDirty = true;
    count -= 1;
    if (count <= 0) {
      count = 0;
      return count; // last element removed
    }
    // move last element to take this element's position
    var from = count * itemPerVertex;
    var to = index * itemPerVertex;
    for (var i = 0; i < itemPerVertex; ++i) {
      ${n.join(`
`)}
    }

    return count;
  }

  function get(index) {
    index *= itemPerVertex; 
    return {
      ${t.join(`,
      `)}
    };
  }

  function extend() {
    var oldBuffer = buffer;
    capacity *= 2;
    buffer = new ArrayBuffer(capacity);
    // Copy old buffer to the new buffer
    new Uint8Array(buffer).set(new Uint8Array(oldBuffer));
    // And re-assign views:
    ${i.join(`
    `)}
  }

  function getBuffer() {
    return buffer.slice(0, count * bytePerVertex);
  }

  function appendBuffer(uint8Collection, byteOffset) {
    var requiredCapacity = byteOffset + uint8Collection.byteLength;
    if (requiredCapacity > capacity) {
      // extend the buffer to fulfill the request:
      let oldBuffer = buffer;
      buffer = new ArrayBuffer(requiredCapacity);
      new Uint8Array(buffer).set(new Uint8Array(oldBuffer));
      capacity = requiredCapacity;
    }

    var view = new Uint8Array(buffer);
    view.set(uint8Collection, byteOffset);
    count = Math.floor(requiredCapacity / bytePerVertex);

    ${i.join(`
    `)}

    isDirty = true;
  }
`;function o(r){let o=r.getInitBlockForBuffer(!1);o&&i.push(o);let s=r.getAddBlock(a,`
    `);e.push(s.code),n.push(r.getMoveBlock(a,`
    `)),t.push(r.getGetBlock(a)),a=s.offset}}}function g(){return e.debug?`
    if (!Number.isFinite(index)) throw new Error('update() requires integer value for "index", got: ' + index);
    if (index < 0 || index >= count) throw new Error('update(' + index + ') is outside of [0..' + count + ') range');
`:``}function _(){return e.debug?`
    if (!Number.isFinite(index)) throw new Error('remove() requires integer value for "index", got: ' + index);
    if (index < 0 || index >= count) throw new Error('remove(' + index + ') is outside of [0..' + count + ') range');
`:``}function v(e,n){let r=y(t.VERTEX_SHADER,e),i=y(t.FRAGMENT_SHADER,n),a=t.createProgram();if(!a)throw Error(`Failed to link a program`);if(t.attachShader(a,r),t.attachShader(a,i),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))throw Error(t.getProgramInfoLog(a)||`Failed to link a program`);return a}function y(e,n){let r=t.createShader(e);if(!r)throw Error(`Failed to create a shared `+n);if(t.shaderSource(r,n),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw console.error(t.getShaderInfoLog(r)),Error(t.getShaderInfoLog(r)||`Failed to compile shader `+n);return r}}function dl(){return``}var fl=class extends rl{constructor(){super(),this.type=`gl.UNSIGNED_BYTE`,this.bufferViewType=`Uint32Array`}getAddBlock(e){let t=`${this.name}Array`,n=``;return this.debug&&(n=`if (item.${this.name} === undefined) throw new Error('Attribute "${this.name}" is missing');\n`),n+=`${t}[index + ${e}] = item.${this.name};`,{code:n,offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=``;return r+=`${n}[to + ${e}] = ${n}[from + ${e}];${t}`,r}getGetBlock(e){return`${this.name}: ${this.name}Array[index + ${e}]`}getDraw(e,t){let n=`${this.name}AttributeLocation`;return`
    if (${n} > -1) {
      gl.enableVertexAttribArray(${n});
      gl.vertexAttribPointer(${n}, 4, ${this.type}, true, ${e}, ${t});
    }`}},pl=class{bufferValues;typeDef;constructor(e){this.bufferValues=e,this.typeDef=void 0}setTypeDefinition(e){this.typeDef=e}getInitBlock(){let{name:e}=this.typeDef;return`
  const ${e}InstancedBuffer = gl.createBuffer();
  if (!${e}InstancedBuffer) throw new Error('failed to create a WebGL buffer');
  const ${e}InstancedBufferValues = new Float32Array([${this.bufferValues.join(`,`)}]);
  let ${e}AttributeLocation = gl.getAttribLocation(program, '${e}');
`}getDivisor(e){return this.typeDef.getDivisor(e)}getDraw(){let{typeDef:e}=this,t=e.name;return`
  gl.bindBuffer(gl.ARRAY_BUFFER, ${t}InstancedBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ${t}InstancedBufferValues, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(${t}AttributeLocation);
  gl.vertexAttribPointer(${t}AttributeLocation, ${e.count}, gl.FLOAT, false, 0, 0);
`}},ml=class extends Ns{uniforms;program;constructor(e){super(),this.program=e,this.uniforms=void 0}getBuffer(){return this.program.getBuffer()}appendBuffer(e,t){this.program.appendBuffer(e,t),this.scene&&this.scene.renderFrame()}add(e){return this.program.add(e)}update(e,t){this.program.update(e,t)}remove(e){return this.program.remove(e)}get(e){return this.program.get(e)}draw(e,t){this.uniforms||={projectionMatrix:t.projection,model:this.worldModel,view:t.view.matrix,modelViewProjection:this.modelViewProjection},this.program.draw(this.uniforms)}dispose(){super.dispose(),this.program&&this.program.dispose()}},hl=class extends ml{constructor(e,t={}){let n=ul({gl:e,vertex:`
    uniform mat4 modelViewProjection;
    uniform float width;
    uniform vec2 resolution;

    attribute vec4 color;
    attribute vec3 from, to;
    attribute vec2 point;

    varying vec4 vColor;
    varying vec2 vPoint;

    void main() {
      vec4 clip0 = modelViewProjection * vec4(from, 1.0);
      vec4 clip1 = modelViewProjection * vec4(to, 1.0);

      vec2 screen0 = resolution * (0.5 * clip0.xy/clip0.w + 0.5);
      vec2 screen1 = resolution * (0.5 * clip1.xy/clip1.w + 0.5);

      vec2 xBasis = normalize(screen1 - screen0);
      vec2 yBasis = vec2(-xBasis.y, xBasis.x);

      // Offset the original points:
      vec2 pt0 = screen0 + width * point.x * yBasis;
      vec2 pt1 = screen1 + width * point.x * yBasis;

      vec2 pt = mix(pt0, pt1, point.y);
      vec4 clip = mix(clip0, clip1, point.y);

      gl_Position = vec4(clip.w * (2.0 * pt/resolution - 1.0), clip.z, clip.w);
      vColor = color.abgr; // mix(.abgr, aToColor.abgr, aPosition.y);
    }`,fragment:`
    precision highp float;
    varying vec4 vColor;

    void main() {
      gl_FragColor = vColor;
    }`,attributes:{color:new fl},instanced:{point:new pl([-.5,0,-.5,1,.5,1,-.5,0,.5,1,.5,0])}});super(n),this.width=t.width||2}draw(e,t){this.uniforms||={modelViewProjection:this.modelViewProjection,width:this.width,resolution:[t.width,t.height]},this.uniforms.resolution[0]=t.width,this.uniforms.resolution[1]=t.height,this.program.draw(this.uniforms)}forEachLine(e){let t=this.program.getCount();for(let n=0;n<t;++n){let t=this.program.get(n);e({x:t.from[0],y:t.from[1],z:t.from[2],color:t.color},{x:t.to[0],y:t.to[1],z:t.to[2],color:t.color})}}getLineColor(e){let t=this.program.getCount(),n=e?e.color:t>0?this.program.get(0).color:4294967295;return[n>>24&1,n>>16&1,n>>8&1,(n|0)&1]}},gl=class extends ml{constructor(e){let t=ul({gl:e,vertex:`
  uniform mat4 modelViewProjection;

  attribute float size;
  attribute vec3 position;
  attribute vec4 color;

  attribute vec2 point; // instanced

  varying vec4 vColor;
  varying vec2 vPoint;
  void main() {
    gl_Position = modelViewProjection * vec4(position + vec3(point * size, 0.), 1.0);
    vColor = color.abgr;
    vPoint = point;
  }`,fragment:`
  precision highp float;
  varying vec4 vColor;
  varying vec2 vPoint;
  void main() {
    float dist = length(vPoint);
    if (dist >= 0.5) {discard;}
    gl_FragColor = vColor;
  }`,attributes:{color:new fl},instanced:{point:new pl([-.5,-.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,-.5])},preDrawHook(){return`gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);`},postDrawHook(){return`gl.disable(gl.DEPTH_TEST);`}});super(t)}};function _l(e){yl(e);let t=vl(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e}function vl(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function yl(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}var bl=_l({}),xl=o(((e,t)=>{t.exports=class e{constructor(e,t){this._rows=e,this._columns=t,this._matrix=new Float64Array(e*t),this._n=e*t}set(e,t,n){let r=e*this._columns+t;if(r>=this._n)throw Error(`Index out of range `+e+`,`+t);this._matrix[r]=n}get(e,t){let n=e*this._columns+t;if(n>=this._n)throw Error(`Index out of range `+e+`,`+t);return this._matrix[n]}centerMatrix(){if(this.isCentered)return this;for(let e=0;e<this._rows;++e){let t=this.getMean(e);this.translateRow(e,-t)}return this.isCentered=!0,this}translateRow(e,t){if(e<0||e>this._rows)throw Error(`Row is out of range `+e);let n=e*this._columns;for(let e=0;e<this._columns;++e)this._matrix[e+n]+=t}getMean(e){let t=0;if(e<0||e>this._rows)throw Error(`Row is out of range `+e);let n=e*this._columns;for(let e=0;e<this._columns;++e)t+=this._matrix[e+n];return t/this._columns}applyVectorToColumn(e,t){let n=0;if(t.length!==this._rows)throw Error(`Invalid vector dimensions`);for(let r=0;r<this._rows;++r)n+=this._matrix[r*this._columns+e]*t[r];return n}print(){let e=[];for(let t=0;t<this._rows;++t){let n=[],r=t*this._columns;for(let e=0;e<this._columns;++e)n.push(this._matrix[r+e].toFixed(2));e.push(n.join(` `))}console.log(e.join(`
`))}toArray(){let e=[];for(let t=0;t<this._rows;++t){let n=[],r=t*this._columns;for(let e=0;e<this._columns;++e)n.push(this._matrix[r+e]);e.push(n)}return e}columnDistance(e,t){let n=0;for(let r=0;r<this._rows;++r){let i=this.get(r,e)-this.get(r,t);n+=i*i}return Math.sqrt(n)}getCovariant(){let t=new e(this._rows,this._rows);for(let e=0;e<this._rows;++e)for(let n=0;n<this._rows;++n){let r=0,i=e*this._columns,a=n*this._columns;for(let e=0;e<this._columns;++e)r+=this._matrix[i+e]*this._matrix[a+e];t.set(n,e,r)}return t}}})),Sl=o(((e,t)=>{t.exports=n,t.exports.random=n,t.exports.randomIterator=l;function n(e){return new r(typeof e==`number`?e:+new Date)}function r(e){this.seed=e}r.prototype.next=c,r.prototype.nextDouble=s,r.prototype.uniform=s,r.prototype.gaussian=i,r.prototype.random=s;function i(){var e,t,n;do t=this.nextDouble()*2-1,n=this.nextDouble()*2-1,e=t*t+n*n;while(e>=1||e===0);return t*Math.sqrt(-2*Math.log(e)/e)}r.prototype.levy=a;function a(){var e=3/2,t=(o(1+e)*Math.sin(Math.PI*e/2)/(o((1+e)/2)*e*2**((e-1)/2)))**(1/e);return this.gaussian()*t/Math.abs(this.gaussian())**(1/e)}function o(e){return Math.sqrt(2*Math.PI/e)*(1/Math.E*(e+1/(12*e-1/(10*e))))**e}function s(){var e=this.seed;return e=e+2127912214+(e<<12)|0,e=e^3345072700^e>>>19,e=e+374761393+(e<<5)|0,e=e+3550635116^e<<9,e=e+4251993797+(e<<3)|0,e=e^3042594569^e>>>16,this.seed=e,(e&268435455)/268435456}function c(e){return Math.floor(this.nextDouble()*e)}function l(e,t){var r=t||n();if(typeof r.next!=`function`)throw Error(`customRandom does not match expected API: next() function is missing`);return{forEach:a,shuffle:i};function i(){for(var t=e.length-1,n,i;t>0;--t)n=r.next(t+1),i=e[n],e[n]=e[t],e[t]=i;return e}function a(t){for(var n=e.length-1,i,a;n>0;--n)i=r.next(n+1),a=e[i],e[i]=e[n],e[n]=a,t(a);e.length&&t(e[0])}}})),Cl=o(((e,t)=>{var n=Sl();t.exports=function(e,t,s=1e-40,c=1e4,l=42){if(t>e.length)throw Error(`Matrix ain't that big`);let u=n(l),d=[],f=(1-s)*(1-s);for(let n=0;n<t;++n){let t=p(e.length);r(t);let s=0,l;for(;s<f;){l=t;for(let e=0;e<n;++e){let t=d[e],n=o(l,t);for(let e=0;e<l.length;++e)l[e]=l[e]-n*t[e]}t=a(e,l);let r=o(t,t);if(r===0&&(t=l,r=o(t,t)),i(t,Math.sqrt(r)),s=o(t,l),s*=s,--c,c<0)break}d.push(t)}return d;function p(e){return Array(e).fill(1).map(()=>u.nextDouble())}};function r(e){let t=Math.sqrt(o(e,e));for(let n=0;n<e.length;++n)e[n]/=t;return e}function i(e,t){for(let n=0;n<e.length;++n)e[n]/=t;return e}function a(e,t){if(e.length!==t.length)throw Error(`Matrix * Vector dimension mismatch`);let n=[];for(let r=0;r<e.length;++r){let i=0;for(let n=0;n<e.length;++n)i+=e[r][n]*t[n];n[r]=i}return n}function o(e,t){let n=0;if(e.length!==t.length)throw Error(`Vector length mismatch`);for(let r=0;r<e.length;++r)n+=e[r]*t[r];return n}}));o(((e,t)=>{var n=xl(),r=Cl();t.exports=function(e,t={}){let i=Number.isFinite(t.pivotCount)&&t.pivotCount>0?t.pivotCount:50,a=Number.isFinite(t.dimensions)&&t.dimensions>0?t.dimensions:2,o=new Map,s=[];e.forEachNode(e=>{let t=s.length;o.set(e.id,t),s.push(e.id)}),i=Math.min(i,s.length),a=Math.min(a,i);let{matrix:c,pivotNodes:l}=m(s[0]),u=h(c,a);return{getNodePosition:d,getPivotNodes:f,getLayoutDimensionsCount:p};function d(e){let t=o.get(e);return u.map(e=>c.applyVectorToColumn(t,e))}function f(){return l}function p(){return a}function m(t){let r=Array(s.length).fill(1/0),a=new n(i,s.length),c=[];for(let e=0;e<i;++e){c.push(t),l(a,e,t);let n=r.reduce((e,t,n,r)=>t>r[e]?n:e,0);t=s[n]}return{matrix:a,pivotNodes:c};function l(t,n,i){let a=[{node:i,d:0}],c=new Set([i]);for(;a.length;){let i=a.shift(),s=o.get(i.node);t.set(n,s,i.d),r[s]=Math.min(r[s],i.d),e.forEachLinkedNode(i.node,e=>{c.has(e.id)||(a.push({node:e.id,d:i.d+1}),c.add(e.id))})}if(c.size!==s.length)throw Error(`Graph has disconnected component. Please use ngraph.hde once per individual component`)}}function h(e,t){return r(e.centerMatrix().getCovariant().toArray(),t)}}}))();var wl=Object.getOwnPropertyNames,Tl=(e,t)=>function(){try{return t||(0,e[wl(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},El=Tl({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}}),Dl=Tl({"lib/codeGenerators/createPatternBuilder.js"(e,t){var n=El();t.exports=function(e){return t;function t(t,r){let i=r&&r.indent||0,a=r&&r.join!==void 0?r.join:`
`,o=Array(i+1).join(` `),s=[];for(let r=0;r<e;++r){let e=n(r),i=r===0?``:o;s.push(i+t.replace(/{var}/g,e))}return s.join(a)}}}}),Ol=Tl({"lib/codeGenerators/generateCreateBody.js"(e,t){var n=Dl();t.exports=r,t.exports.generateCreateBodyFunctionBody=i,t.exports.getVectorCode=o,t.exports.getBodyCode=a;function r(e,t){let n=i(e,t),{Body:r}=Function(n)();return r}function i(e,t){return`
${o(e,t)}
${a(e,t)}
return {Body: Body, Vector: Vector};
`}function a(e){let t=n(e),r=t(`{var}`,{join:`, `});return`
function Body(${r}) {
  this.isPinned = false;
  this.pos = new Vector(${r});
  this.force = new Vector();
  this.velocity = new Vector();
  this.mass = 1;

  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.reset = function() {
  this.force.reset();
  this.springCount = 0;
  this.springLength = 0;
}

Body.prototype.setPosition = function (${r}) {
  ${t(`this.pos.{var} = {var} || 0;`,{indent:2})}
};`}function o(e,t){let r=n(e),i=``;return t&&(i=`${r(`
   var v{var};
Object.defineProperty(this, '{var}', {
  set: function(v) { 
    if (!Number.isFinite(v)) throw new Error('Cannot set non-numbers to {var}');
    v{var} = v; 
  },
  get: function() { return v{var}; }
});`)}`),`function Vector(${r(`{var}`,{join:`, `})}) {
  ${i}
    if (typeof arguments[0] === 'object') {
      // could be another vector
      let v = arguments[0];
      ${r(`if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");`,{indent:4})}
      ${r(`this.{var} = v.{var};`,{indent:4})}
    } else {
      ${r(`this.{var} = typeof {var} === "number" ? {var} : 0;`,{indent:4})}
    }
  }
  
  Vector.prototype.reset = function () {
    ${r(`this.{var} = `,{join:``})}0;
  };`}}}),kl=Tl({"lib/codeGenerators/generateQuadTree.js"(e,t){var n=Dl(),r=El();t.exports=i,t.exports.generateQuadTreeFunctionBody=a,t.exports.getInsertStackCode=u,t.exports.getQuadNodeCode=l,t.exports.isSamePosition=o,t.exports.getChildBodyCode=c,t.exports.setChildBodyCode=s;function i(e){let t=a(e);return Function(t)()}function a(e){let t=n(e),i=2**e;return`
${u()}
${l(e)}
${o(e)}
${c(e)}
${s(e)}

function createQuadTree(options, random) {
  options = options || {};
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  return {
    insertBodies: insertBodies,

    /**
     * Gets root node if it is present
     */
    getRoot: function() {
      return root;
    },

    updateBodyForce: update,

    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
${f(`      node.`)}
      node.body = null;
      node.mass = ${t(`node.mass_{var} = `,{join:``})}0;
      ${t(`node.min_{var} = node.max_{var} = `,{join:``})}0;
    } else {
      node = new QuadNode();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue;
    var v;
    ${t(`var d{var};`,{indent:4})}
    var r; 
    ${t(`var f{var} = 0;`,{indent:4})}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        ${t(`d{var} = body.pos.{var} - sourceBody.pos.{var};`,{indent:8})}
        r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${t(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
        }

        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        ${t(`f{var} += v * d{var};`,{indent:8})}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${t(`d{var} = node.mass_{var} / node.mass - sourceBody.pos.{var};`,{indent:8})}
        r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${t(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
        }
        // If s / r < \u03B8, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${r(0)} - node.min_${r(0)}) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          ${t(`f{var} += v * d{var};`,{indent:10})}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${d()}
        }
      }
    }

    ${t(`sourceBody.force.{var} += f{var};`,{indent:4})}
  }

  function insertBodies(bodies) {
    ${t(`var {var}min = Number.MAX_VALUE;`,{indent:4})}
    ${t(`var {var}max = -Number.MAX_VALUE;`,{indent:4})}
    var i = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      var pos = bodies[i].pos;
      ${t(`if (pos.{var} < {var}min) {var}min = pos.{var};`,{indent:6})}
      ${t(`if (pos.{var} > {var}max) {var}max = pos.{var};`,{indent:6})}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${t(`if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;`,{indent:4})}

    currentInCache = 0;
    root = newNode();
    ${t(`root.min_{var} = {var}min;`,{indent:4})}
    ${t(`root.max_{var} = {var}min + maxSideLength;`,{indent:4})}

    i = bodies.length - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        ${t(`var {var} = body.pos.{var};`,{indent:8})}
        node.mass += body.mass;
        ${t(`node.mass_{var} += body.mass * {var};`,{indent:8})}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${t(`var min_{var} = node.min_{var};`,{indent:8})}
        ${t(`var max_{var} = (min_{var} + node.max_{var}) / 2;`,{indent:8})}

${a(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${t(`child.min_{var} = min_{var};`,{indent:10})}
          ${t(`child.max_{var} = max_{var};`,{indent:10})}
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${t(`var d{var} = (node.max_{var} - node.min_{var}) * offset;`,{indent:12})}

            ${t(`oldBody.pos.{var} = node.min_{var} + d{var};`,{indent:12})}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
}
return createQuadTree;

`;function a(t){let n=[],i=Array(t+1).join(` `);for(let t=0;t<e;++t)n.push(i+`if (${r(t)} > max_${r(t)}) {`),n.push(i+`  quadIdx = quadIdx + ${2**t};`),n.push(i+`  min_${r(t)} = max_${r(t)};`),n.push(i+`  max_${r(t)} = node.max_${r(t)};`),n.push(i+`}`);return n.join(`
`)}function d(){let e=Array(11).join(` `),t=[];for(let n=0;n<i;++n)t.push(e+`if (node.quad${n}) {`),t.push(e+`  queue[pushIdx] = node.quad${n};`),t.push(e+`  queueLength += 1;`),t.push(e+`  pushIdx += 1;`),t.push(e+`}`);return t.join(`
`)}function f(e){let t=[];for(let n=0;n<i;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function o(e){let t=n(e);return`
  function isSamePosition(point1, point2) {
    ${t(`var d{var} = Math.abs(point1.{var} - point2.{var});`,{indent:2})}
  
    return ${t(`d{var} < 1e-8`,{join:` && `})};
  }  
`}function s(e){var t=2**e;return`
function setChild(node, idx, child) {
  ${n()}
}`;function n(){let e=[];for(let n=0;n<t;++n){let t=n===0?`  `:`  else `;e.push(`${t}if (idx === ${n}) node.quad${n} = child;`)}return e.join(`
`)}}function c(e){return`function getChild(node, idx) {
${t()}
  return null;
}`;function t(){let t=[],n=2**e;for(let e=0;e<n;++e)t.push(`  if (idx === ${e}) return node.quad${e};`);return t.join(`
`)}}function l(e){let t=n(e),r=2**e;return`
function QuadNode() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain bodies:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${i(`  this.`)}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${t(`this.mass_{var} = 0;`,{indent:2})}

  // bounding box coordinates
  ${t(`this.min_{var} = 0;`,{indent:2})}
  ${t(`this.max_{var} = 0;`,{indent:2})}
}
`;function i(e){let t=[];for(let n=0;n<r;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function u(){return`
/**
 * Our implementation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressure: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}
`}}}),Al=Tl({"lib/codeGenerators/generateBounds.js"(e,t){t.exports=r,t.exports.generateFunctionBody=i;var n=Dl();function r(e){let t=i(e);return Function(`bodies`,`settings`,`random`,t)}function i(e){let t=n(e);return`
  var boundingBox = {
    ${t(`min_{var}: 0, max_{var}: 0,`,{indent:4})}
  };

  return {
    box: boundingBox,

    update: updateBoundingBox,

    reset: resetBoundingBox,

    getBestNewPosition: function (neighbors) {
      var ${t(`base_{var} = 0`,{join:`, `})};

      if (neighbors.length) {
        for (var i = 0; i < neighbors.length; ++i) {
          let neighborPos = neighbors[i].pos;
          ${t(`base_{var} += neighborPos.{var};`,{indent:10})}
        }

        ${t(`base_{var} /= neighbors.length;`,{indent:8})}
      } else {
        ${t(`base_{var} = (boundingBox.min_{var} + boundingBox.max_{var}) / 2;`,{indent:8})}
      }

      var springLength = settings.springLength;
      return {
        ${t(`{var}: base_{var} + (random.nextDouble() - 0.5) * springLength,`,{indent:8})}
      };
    }
  };

  function updateBoundingBox() {
    var i = bodies.length;
    if (i === 0) return; // No bodies - no borders.

    ${t(`var max_{var} = -Infinity;`,{indent:4})}
    ${t(`var min_{var} = Infinity;`,{indent:4})}

    while(i--) {
      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
      var bodyPos = bodies[i].pos;
      ${t(`if (bodyPos.{var} < min_{var}) min_{var} = bodyPos.{var};`,{indent:6})}
      ${t(`if (bodyPos.{var} > max_{var}) max_{var} = bodyPos.{var};`,{indent:6})}
    }

    ${t(`boundingBox.min_{var} = min_{var};`,{indent:4})}
    ${t(`boundingBox.max_{var} = max_{var};`,{indent:4})}
  }

  function resetBoundingBox() {
    ${t(`boundingBox.min_{var} = boundingBox.max_{var} = 0;`,{indent:4})}
  }
`}}}),jl=Tl({"lib/codeGenerators/generateCreateDragForce.js"(e,t){var n=Dl();t.exports=r,t.exports.generateCreateDragForceFunctionBody=i;function r(e){let t=i(e);return Function(`options`,t)}function i(e){return`
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    update: function(body) {
      ${n(e)(`body.force.{var} -= options.dragCoefficient * body.velocity.{var};`,{indent:6})}
    }
  };
`}}}),Ml=Tl({"lib/codeGenerators/generateCreateSpringForce.js"(e,t){var n=Dl();t.exports=r,t.exports.generateCreateSpringForceFunctionBody=i;function r(e){let t=i(e);return Function(`options`,`random`,t)}function i(e){let t=n(e);return`
  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

  return {
    /**
     * Updates forces acting on a spring
     */
    update: function (spring) {
      var body1 = spring.from;
      var body2 = spring.to;
      var length = spring.length < 0 ? options.springLength : spring.length;
      ${t(`var d{var} = body2.pos.{var} - body1.pos.{var};`,{indent:6})}
      var r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

      if (r === 0) {
        ${t(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:8})}
        r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
      }

      var d = r - length;
      var coefficient = ((spring.coefficient > 0) ? spring.coefficient : options.springCoefficient) * d / r;

      ${t(`body1.force.{var} += coefficient * d{var}`,{indent:6})};
      body1.springCount += 1;
      body1.springLength += r;

      ${t(`body2.force.{var} -= coefficient * d{var}`,{indent:6})};
      body2.springCount += 1;
      body2.springLength += r;
    }
  };
`}}}),Nl=Tl({"lib/codeGenerators/generateIntegrator.js"(e,t){var n=Dl();t.exports=r,t.exports.generateIntegratorFunctionBody=i;function r(e){let t=i(e);return Function(`bodies`,`timeStep`,`adaptiveTimeStepWeight`,`maxVelocity`,t)}function i(e){let t=n(e);return`
  var length = bodies.length;
  if (length === 0) return 0;

  ${t(`var d{var} = 0, t{var} = 0;`,{indent:2})}
  var maxV = maxVelocity > 0 ? maxVelocity : 1;

  for (var i = 0; i < length; ++i) {
    var body = bodies[i];
    if (body.isPinned) continue;

    var dt = timeStep;
    if (adaptiveTimeStepWeight && body.springCount) {
      dt = (adaptiveTimeStepWeight * body.springLength/body.springCount);
    }

    var coeff = dt / body.mass;

    ${t(`body.velocity.{var} += coeff * body.force.{var};`,{indent:4})}
    ${t(`var v{var} = body.velocity.{var};`,{indent:4})}
    var v = Math.sqrt(${t(`v{var} * v{var}`,{join:` + `})});

    if (v > maxV) {
      // We normalize it so that we move within timeStep range.
      // for the case when v <= maxV - we let velocity to fade out.
      ${t(`body.velocity.{var} = maxV * v{var} / v;`,{indent:6})}
    }

    ${t(`d{var} = dt * body.velocity.{var};`,{indent:4})}

    ${t(`body.pos.{var} += d{var};`,{indent:4})}

    ${t(`t{var} += Math.abs(d{var});`,{indent:4})}
  }

  return (${t(`t{var} * t{var}`,{join:` + `})})/length;
`}}}),Pl=Tl({"lib/codeGenerators/generateFireIntegrator.js"(e,t){var n=Dl();t.exports=r,t.exports.generateFireIntegratorFunctionBody=i;function r(e){let t=i(e);return Function(t)}function i(e){let t=n(e);return`
  var ALPHA_START = 0.1;
  var ALPHA_DECAY = 0.99;
  var MIN_POSITIVE_STEPS = 5;

  var alpha = ALPHA_START;
  var positiveSteps = 0;

  return function integrate(bodies, timeStep, adaptiveTimeStepWeight, maxVelocity) {
    var length = bodies.length;
    if (length === 0) return 0;

    var i, body;
    var power = 0, velocityNorm = 0, forceNorm = 0;
    for (i = 0; i < length; ++i) {
      body = bodies[i];
      if (body.isPinned) continue;
      ${t(`var f{var} = body.force.{var}, v{var} = body.velocity.{var};`,{indent:6})}
      power += ${t(`f{var} * v{var}`,{join:` + `})};
      velocityNorm += ${t(`v{var} * v{var}`,{join:` + `})};
      forceNorm += ${t(`f{var} * f{var}`,{join:` + `})};
    }

    if (power > 0) {
      // Going downhill: steer velocities towards forces, and trust momentum more over time.
      var keep = 1 - alpha;
      var mix = forceNorm > 0 ? alpha * Math.sqrt(velocityNorm / forceNorm) : 0;
      for (i = 0; i < length; ++i) {
        body = bodies[i];
        if (body.isPinned) continue;
        ${t(`body.velocity.{var} = keep * body.velocity.{var} + mix * body.force.{var};`,{indent:8})}
      }
      positiveSteps += 1;
      if (positiveSteps > MIN_POSITIVE_STEPS) alpha *= ALPHA_DECAY;
    } else {
      // Going uphill (we overshot): stop everything and start from rest.
      for (i = 0; i < length; ++i) {
        body = bodies[i];
        if (body.isPinned) continue;
        ${t(`body.velocity.{var} = 0;`,{indent:8})}
      }
      positiveSteps = 0;
      alpha = ALPHA_START;
    }

    ${t(`var d{var} = 0, t{var} = 0;`,{indent:4})}
    var maxV = maxVelocity > 0 ? maxVelocity : 1;

    for (i = 0; i < length; ++i) {
      body = bodies[i];
      if (body.isPinned) continue;

      var dt = timeStep;
      if (adaptiveTimeStepWeight && body.springCount) {
        dt = (adaptiveTimeStepWeight * body.springLength/body.springCount);
      }

      var coeff = dt / body.mass;

      ${t(`body.velocity.{var} += coeff * body.force.{var};`,{indent:6})}
      ${t(`var u{var} = body.velocity.{var};`,{indent:6})}
      var v = Math.sqrt(${t(`u{var} * u{var}`,{join:` + `})});

      if (v > maxV) {
        ${t(`body.velocity.{var} = maxV * u{var} / v;`,{indent:8})}
      }

      ${t(`d{var} = dt * body.velocity.{var};`,{indent:6})}

      ${t(`body.pos.{var} += d{var};`,{indent:6})}

      ${t(`t{var} += Math.abs(d{var});`,{indent:6})}
    }

    return (${t(`t{var} * t{var}`,{join:` + `})})/length;
  };
`}}}),Fl=Tl({"lib/codeGenerators/generateDualTree.js"(e,t){var n=El();t.exports=r,t.exports.generateDualTreeFunctionBody=i;function r(e){let t=i(e);return Function(t)()}function i(e){let t=[];for(let n=0;n<e;++n)t.push(n);let r=(e,n)=>t.map(e).join(n===void 0?`
`:n),i=[];for(let t=0;t<e;++t)for(let n=t;n<e;++n)i.push([t,n]);let a=(e,t)=>i.findIndex(([n,r])=>n===e&&r===t||n===t&&r===e),o=(e,n)=>t.map(t=>`j${a(e,t)} * ${n}${t}`).join(` + `),s=e===2?.875:1;return`
var D = ${e};
var JN = ${i.length};
var LEAF_SIZE = 16;
var MAX_DEPTH = 60;
var THETA_SCALE = ${s};

return function createDualTree(settings) {
  var n = 0;
  // Body index of the k-th body in tree order, and the other way around:
  var order, rank;
  // Positions, masses and fields of bodies in tree order:
  var pos, mass, field;
  // Tree topology (grows as needed):
  var nodeCapacity = 0, nodeCount = 0;
  var nodeStart, nodeEnd, nodeSkip;
  // Per node data:
  var dataCapacity = 0;
  var nodeMass, nodeCenter, nodeRadius, localField, localJacobian;

  var cellMin = [], cellSide = new Float64Array(MAX_DEPTH + 2);
  for (var depth = 0; depth < MAX_DEPTH + 2; ++depth) cellMin.push(new Float64Array(D));

  var stack = new Int32Array(1 << 12);

  return {
    computeForces: computeForces
  };

  function computeForces(bodies) {
    if (bodies.length === 0) return;
    buildTree(bodies);
    walk(settings.theta * THETA_SCALE);
    pushDown();

    var gravity = settings.gravity;
    for (var i = 0; i < n; ++i) {
      var body = bodies[i];
      if (body.isPinned) continue;
      body.reset();
      var k = rank[i];
      var g = gravity * mass[k];
      ${r(e=>`body.force.${n(e)} = g * field[k * D + ${e}];`,`
      `)}
    }
  }

  function ensureBodies(count) {
    if (count === n && order) return;
    n = count;
    order = new Int32Array(n);
    rank = new Int32Array(n);
    for (var i = 0; i < n; ++i) order[i] = i;
    pos = new Float64Array(n * D);
    mass = new Float64Array(n);
    field = new Float64Array(n * D);
  }

  function newNode(start, end) {
    if (nodeCount === nodeCapacity) {
      nodeCapacity = Math.max(1024, nodeCapacity * 2);
      nodeStart = grow(Int32Array, nodeStart, nodeCapacity);
      nodeEnd = grow(Int32Array, nodeEnd, nodeCapacity);
      nodeSkip = grow(Int32Array, nodeSkip, nodeCapacity);
    }
    var node = nodeCount++;
    nodeStart[node] = start;
    nodeEnd[node] = end;
    return node;
  }

  function ensureNodeData() {
    if (nodeCount <= dataCapacity) return;
    dataCapacity = nodeCapacity;
    nodeMass = new Float64Array(dataCapacity);
    nodeCenter = new Float64Array(dataCapacity * D);
    nodeRadius = new Float64Array(dataCapacity);
    localField = new Float64Array(dataCapacity * D);
    localJacobian = new Float64Array(dataCapacity * JN);
  }

  function buildTree(bodies) {
    ensureBodies(bodies.length);

    ${r(e=>`var min${e} = Infinity, max${e} = -Infinity;`,`
    `)}
    // Bodies are read in their own order (it is cheaper to jump in typed arrays than in objects):
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    for (var i = 0; i < n; ++i) {
      var body = bodies[i];
      var k = rank[i];
      mass[k] = body.mass;
      ${r(e=>`var p${e} = body.pos.${n(e)}; pos[k * D + ${e}] = p${e};`,`
      `)}
      ${r(e=>`if (p${e} < min${e}) min${e} = p${e}; if (p${e} > max${e}) max${e} = p${e};`,`
      `)}
    }

    var side = 0;
    ${r(e=>`if (max${e} - min${e} > side) side = max${e} - min${e};`,`
    `)}
    ${r(e=>`cellMin[0][${e}] = min${e};`,` `)}
    cellSide[0] = side * (1 + 1e-9) + 1e-9;
    nodeCount = 0;
    buildNode(0, n, 0);
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    ensureNodeData();

    // Children come after parents, so we can aggregate bottom up in reverse order:
    for (var node = nodeCount - 1; node >= 0; --node) {
      var m = 0, r = 0;
      ${r(e=>`var s${e} = 0;`,` `)}
      if (nodeSkip[node] === node + 1) {
        // Leaf: center of mass of its bodies, radius is the farthest body.
        var start = nodeStart[node], end = nodeEnd[node];
        for (var k = start; k < end; ++k) {
          var w = mass[k];
          m += w;
          ${r(e=>`s${e} += w * pos[k * D + ${e}];`,` `)}
        }
        ${r(e=>`var c${e} = s${e} / m;`,` `)}
        var r2 = 0;
        for (var k = start; k < end; ++k) {
          ${r(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          var q2 = ${r(e=>`h${e} * h${e}`,` + `)};
          if (q2 > r2) r2 = q2;
        }
        r = Math.sqrt(r2);
      } else {
        // Internal node: aggregate children, radius bounds every child's sphere.
        var skip = nodeSkip[node];
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          var w = nodeMass[c];
          m += w;
          ${r(e=>`s${e} += w * nodeCenter[c * D + ${e}];`,` `)}
        }
        ${r(e=>`var c${e} = s${e} / m;`,` `)}
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          ${r(e=>`var h${e} = nodeCenter[c * D + ${e}] - c${e};`,` `)}
          var q = Math.sqrt(${r(e=>`h${e} * h${e}`,` + `)}) + nodeRadius[c];
          if (q > r) r = q;
        }
      }
      nodeMass[node] = m;
      nodeRadius[node] = r;
      ${r(e=>`nodeCenter[node * D + ${e}] = c${e}; localField[node * D + ${e}] = 0;`,`
      `)}
      for (var t = 0; t < JN; ++t) localJacobian[node * JN + t] = 0;
    }
    for (var k = 0; k < n * D; ++k) field[k] = 0;
  }

  function buildNode(start, end, depth) {
    var node = newNode(start, end);
    if (end - start > LEAF_SIZE && depth < MAX_DEPTH) splitAxis(start, end, D - 1, 0, depth);
    nodeSkip[node] = nodeCount;
  }

  // Splits bodies of a cell one axis at a time; each non empty orthant becomes a child.
  function splitAxis(start, end, axis, bits, depth) {
    if (axis < 0) {
      var parentMin = cellMin[depth], childMin = cellMin[depth + 1], half = cellSide[depth] / 2;
      ${r(e=>`childMin[${e}] = parentMin[${e}] + ((bits >> ${e}) & 1) * half;`,`
      `)}
      cellSide[depth + 1] = half;
      buildNode(start, end, depth + 1);
      return;
    }
    var mid = partition(start, end, axis, cellMin[depth][axis] + cellSide[depth] / 2);
    if (start < mid) splitAxis(start, mid, axis - 1, bits, depth);
    if (mid < end) splitAxis(mid, end, axis - 1, bits | (1 << axis), depth);
  }

  // Bodies that are already on the correct side cost no swaps, so keeping the
  // order from the previous step makes this cheap.
  function partition(start, end, axis, pivot) {
    var i = start, j = end - 1;
    while (true) {
      while (i <= j && pos[i * D + axis] < pivot) i++;
      while (i <= j && pos[j * D + axis] >= pivot) j--;
      if (i >= j) return i;
      var t = order[i]; order[i] = order[j]; order[j] = t;
      t = mass[i]; mass[i] = mass[j]; mass[j] = t;
      var a = i * D, b = j * D;
      ${r(e=>`t = pos[a + ${e}]; pos[a + ${e}] = pos[b + ${e}]; pos[b + ${e}] = t;`,`
      `)}
      i++; j--;
    }
  }

  function push(a, b, top) {
    if (top + 2 > stack.length) stack = grow(Int32Array, stack, stack.length * 2);
    stack[top] = a;
    stack[top + 1] = b;
    return top + 2;
  }

  function walk(theta) {
    var theta2 = theta * theta;
    var top = push(0, 0, 0);
    while (top) {
      top -= 2;
      var a = stack[top], b = stack[top + 1];
      var skipA = nodeSkip[a];
      if (a === b) {
        // A cell with itself: all pairs of its children, and each child with itself.
        if (skipA === a + 1) {
          direct(nodeStart[a], nodeEnd[a], 0, nodeEnd[a], true);
          continue;
        }
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) {
          top = push(c, c, top);
          for (var u = nodeSkip[c]; u < skipA; u = nodeSkip[u]) top = push(c, u, top);
        }
        continue;
      }

      ${r(e=>`var d${e} = nodeCenter[b * D + ${e}] - nodeCenter[a * D + ${e}];`,` `)}
      var r2 = ${r(e=>`d${e} * d${e}`,` + `)};
      var radiusA = nodeRadius[a], radiusB = nodeRadius[b], radii = radiusA + radiusB;
      if (radii * radii < theta2 * r2) {
        // Far enough: exchange fields of the two cells, both ways.
        var inv2 = 1 / r2, inv3 = Math.sqrt(inv2) * inv2, inv5 = 3 * inv3 * inv2;
        var massA = nodeMass[a], massB = nodeMass[b];
        var fieldA = a * D, fieldB = b * D, jacobianA = a * JN, jacobianB = b * JN;
        ${r(e=>`var k${e} = d${e} * inv3; localField[fieldA + ${e}] += massB * k${e}; localField[fieldB + ${e}] -= massA * k${e};`,`
        `)}
        ${i.map(([e,t],n)=>`var j${n} = d${e} * d${t} * inv5${e===t?` - inv3`:``}; localJacobian[jacobianA + ${n}] += massB * j${n}; localJacobian[jacobianB + ${n}] += massA * j${n};`).join(`
        `)}
        continue;
      }

      var skipB = nodeSkip[b], isLeafA = skipA === a + 1, isLeafB = skipB === b + 1;
      if (isLeafA && isLeafB) {
        direct(nodeStart[a], nodeEnd[a], nodeStart[b], nodeEnd[b], false);
        continue;
      }
      // Too close: open the bigger cell.
      if (!isLeafA && (isLeafB || radiusA >= radiusB)) {
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) top = push(c, b, top);
      } else {
        for (var c = b + 1; c < skipB; c = nodeSkip[c]) top = push(a, c, top);
      }
    }
  }

  // Exact interaction of bodies [startA, endA) with bodies [startB, endB), both ways.
  function direct(startA, endA, startB, endB, sameCell) {
    for (var i = startA; i < endA; ++i) {
      ${r(e=>`var x${e} = pos[i * D + ${e}];`,` `)}
      var massI = mass[i];
      ${r(e=>`var a${e} = 0;`,` `)}
      for (var j = sameCell ? i + 1 : startB; j < endB; ++j) {
        ${r(e=>`var d${e} = pos[j * D + ${e}] - x${e};`,` `)}
        var r2 = ${r(e=>`d${e} * d${e}`,` + `)};
        if (r2 === 0) {
          // Two bodies at the same position: push them apart as if they were a unit
          // distance apart, along an axis picked from their ids (deterministic and bounded).
          var lo = order[i] < order[j] ? order[i] : order[j];
          var hi = order[i] < order[j] ? order[j] : order[i];
          var axis = (((lo * 2654435761) ^ (hi * 40503)) >>> 0) % D;
          var sign = order[i] < order[j] ? 1 : -1;
          ${r(e=>`d${e} = axis === ${e} ? sign : 0;`,` `)}
          r2 = 1;
        }
        var inv3 = 1 / (r2 * Math.sqrt(r2)), massJ = mass[j] * inv3, massII = massI * inv3;
        ${r(e=>`a${e} += massJ * d${e}; field[j * D + ${e}] -= massII * d${e};`,`
        `)}
      }
      ${r(e=>`field[i * D + ${e}] += a${e};`,` `)}
    }
  }

  // Pushes local expansions from parents to children, and from leaves to bodies.
  function pushDown() {
    for (var node = 0; node < nodeCount; ++node) {
      var offset = node * D, jacobian = node * JN, skip = nodeSkip[node];
      ${r(e=>`var c${e} = nodeCenter[offset + ${e}], g${e} = localField[offset + ${e}];`,` `)}
      ${i.map((e,t)=>`var j${t} = localJacobian[jacobian + ${t}];`).join(` `)}
      if (skip === node + 1) {
        for (var k = nodeStart[node], end = nodeEnd[node]; k < end; ++k) {
          ${r(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          ${r(e=>`field[k * D + ${e}] += g${e} + ${o(e,`h`)};`,`
          `)}
        }
        continue;
      }
      for (var c = node + 1; c < skip; c = nodeSkip[c]) {
        var childOffset = c * D, childJacobian = c * JN;
        ${r(e=>`var h${e} = nodeCenter[childOffset + ${e}] - c${e};`,` `)}
        ${r(e=>`localField[childOffset + ${e}] += g${e} + ${o(e,`h`)};`,`
        `)}
        ${i.map((e,t)=>`localJacobian[childJacobian + ${t}] += j${t};`).join(` `)}
      }
    }
  }
};

function grow(ArrayType, array, size) {
  var bigger = new ArrayType(size);
  if (array) bigger.set(array.subarray(0, Math.min(array.length, size)));
  return bigger;
}
`}}}),Il=Tl({"lib/spring.js"(e,t){t.exports=n;function n(e,t,n,r){this.from=e,this.to=t,this.length=n,this.coefficient=r}}}),Ll=Tl({"node_modules/ngraph.merge/index.js"(e,t){t.exports=n;function n(e,t){var r;if(e||={},t){for(r in t)if(t.hasOwnProperty(r)){var i=e.hasOwnProperty(r),a=typeof t[r];!i||typeof e[r]!==a?e[r]=t[r]:a===`object`&&(e[r]=n(e[r],t[r]))}}return e}}}),Rl=Tl({"node_modules/ngraph.events/index.js"(e,t){t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}}}),zl=Tl({"node_modules/ngraph.random/index.js"(e,t){t.exports=n,t.exports.random=n,t.exports.randomIterator=l;function n(e){return new r(typeof e==`number`?e:+new Date)}function r(e){this.seed=e}r.prototype.next=c,r.prototype.nextDouble=s,r.prototype.uniform=s,r.prototype.gaussian=i;function i(){var e,t,n;do t=this.nextDouble()*2-1,n=this.nextDouble()*2-1,e=t*t+n*n;while(e>=1||e===0);return t*Math.sqrt(-2*Math.log(e)/e)}r.prototype.levy=a;function a(){var e=3/2,t=(o(1+e)*Math.sin(Math.PI*e/2)/(o((1+e)/2)*e*2**((e-1)/2)))**(1/e);return this.gaussian()*t/Math.abs(this.gaussian())**(1/e)}function o(e){return Math.sqrt(2*Math.PI/e)*(1/Math.E*(e+1/(12*e-1/(10*e))))**e}function s(){var e=this.seed;return e=e+2127912214+(e<<12)|0,e=e^3345072700^e>>>19,e=e+374761393+(e<<5)|0,e=e+3550635116^e<<9,e=e+4251993797+(e<<3)|0,e=e^3042594569^e>>>16,this.seed=e,(e&268435455)/268435456}function c(e){return Math.floor(this.nextDouble()*e)}function l(e,t){var r=t||n();if(typeof r.next!=`function`)throw Error(`customRandom does not match expected API: next() function is missing`);return{forEach:a,shuffle:i};function i(){for(var t=e.length-1,n,i;t>0;--t)n=r.next(t+1),i=e[n],e[n]=e[t],e[t]=i;return e}function a(t){for(var n=e.length-1,i,a;n>0;--n)i=r.next(n+1),a=e[i],e[i]=e[n],e[n]=a,t(a);e.length&&t(e[0])}}}}),Bl=Tl({"lib/createPhysicsSimulator.js"(e,t){t.exports=d;var n=Ol(),r=kl(),i=Al(),a=jl(),o=Ml(),s=Nl(),c=Pl(),l=Fl(),u={};function d(e){var t=Il(),d=Ll(),p=Rl();if(e){if(e.springCoeff!==void 0)throw Error(`springCoeff was renamed to springCoefficient`);if(e.dragCoeff!==void 0)throw Error(`dragCoeff was renamed to dragCoefficient`)}if(e=d(e,{springLength:10,springCoefficient:.8,gravity:-12,theta:.8,dragCoefficient:.9,timeStep:.5,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,adaptiveTimeStepWeight:0,dimensions:2,debug:!1}),e.integrator!==`euler`&&e.integrator!==`fire`)throw Error(`Unknown integrator: `+e.integrator+". Expected `euler` or `fire`");if(e.nbody!==`quadtree`&&e.nbody!==`dualtree`)throw Error(`Unknown nbody: `+e.nbody+". Expected `quadtree` or `dualtree`");var m=u[e.dimensions];if(!m){var h=e.dimensions;m={Body:n(h,e.debug),createQuadTree:r(h),createBounds:i(h),createDragForce:a(h),createSpringForce:o(h),integrate:s(h),createFireIntegrator:c(h),createDualTree:l(h)},u[h]=m}var g=m.Body,_=m.createQuadTree,v=m.createBounds,y=m.createDragForce,b=m.createSpringForce,x=m.integrate,S,C=e=>new g(e),w=zl().random(42),T=[],E=[],D=_(e,w),O=v(T,e,w),k=b(e,w),A=y(e),j,M=0,N=[],P=new Map,F=0;R(`nbody`,B),R(`spring`,V);var I={bodies:T,quadTree:D,springs:E,settings:e,addForce:R,removeForce:ee,getForces:z,step:function(){for(var t=0;t<N.length;++t)N[t](F);var n=x;e.integrator===`fire`&&(S||=m.createFireIntegrator(),n=S);var r=n(T,e.timeStep,e.adaptiveTimeStepWeight,e.maxVelocity);return F+=1,r},addBody:function(e){if(!e)throw Error(`Body is required`);return T.push(e),e},addBodyAt:function(e){if(!e)throw Error(`Body position is required`);var t=C(e);return T.push(t),t},removeBody:function(e){if(e){var t=T.indexOf(e);if(!(t<0))return T.splice(t,1),T.length===0&&O.reset(),!0}},addSpring:function(e,n,r,i){if(!e||!n)throw Error(`Cannot add null spring to force simulator`);typeof r!=`number`&&(r=-1);var a=new t(e,n,r,i>=0?i:-1);return E.push(a),a},getTotalMovement:function(){return M},removeSpring:function(e){if(e){var t=E.indexOf(e);if(t>-1)return E.splice(t,1),!0}},getBestNewBodyPosition:function(e){return O.getBestNewPosition(e)},getBBox:L,getBoundingBox:L,invalidateBBox:function(){console.warn("invalidateBBox() is deprecated, bounds always recomputed on `getBBox()` call")},gravity:function(t){return t===void 0?e.gravity:(e.gravity=t,D.options({gravity:t}),this)},theta:function(t){return t===void 0?e.theta:(e.theta=t,D.options({theta:t}),this)},random:w};return f(e,I),p(I),I;function L(){return O.update(),O.box}function R(e,t){if(P.has(e))throw Error(`Force `+e+` is already added`);P.set(e,t),N.push(t)}function ee(e){var t=N.indexOf(P.get(e));t<0||(N.splice(t,1),P.delete(e))}function z(){return P}function B(){if(T.length!==0){var t=e.integrator!==`fire`,n=T.length,r;if(e.nbody===`dualtree`){if(j||=m.createDualTree(e),j.computeForces(T),!t)return;for(;n--;)r=T[n],r.isPinned||A.update(r)}else for(D.insertBodies(T);n--;)r=T[n],r.isPinned||(r.reset(),D.updateBodyForce(r),t&&A.update(r))}}function V(){for(var e=E.length;e--;)k.update(E[e])}}function f(e,t){for(var n in e)p(e,t,n)}function p(e,t,n){e.hasOwnProperty(n)&&typeof t[n]!=`function`&&(t[n]=Number.isFinite(e[n])?function(r){if(r!==void 0){if(!Number.isFinite(r))throw Error(`Value of `+n+` should be a valid number.`);return e[n]=r,t}return e[n]}:function(r){return r===void 0?e[n]:(e[n]=r,t)})}}}),Vl=Tl({"index.js"(e,t){t.exports=r,t.exports.simulator=Bl();var n=Rl();function r(e,t){if(!e)throw Error(`Graph structure cannot be undefined`);var r=(t&&t.createSimulator||Bl())(t);if(Array.isArray(t))throw Error(`Physics settings is expected to be an object`);var a=e.version>19?A:k;t&&typeof t.nodeMass==`function`&&(a=t.nodeMass);var o=new Map,s={},c=0,l=r.settings.springTransform||i;b(),_();var u=!1,d={step:function(){if(c===0)return f(!0),!0;var e=r.step();d.lastMove=e,d.fire(`step`);var t=e/c<=.01;return f(t),t},getNodePosition:function(e){return O(e).pos},setNodePosition:function(e){var t=O(e);t.setPosition.apply(t,Array.prototype.slice.call(arguments,1))},getLinkPosition:function(e){var t=s[e];if(t)return{from:t.from.pos,to:t.to.pos}},getGraphRect:function(){return r.getBBox()},forEachBody:p,pinNode:function(e,t){var n=O(e.id);n.isPinned=!!t},isNodePinned:function(e){return O(e.id).isPinned},dispose:function(){e.off(`changed`,y),d.fire(`disposed`)},getBody:g,getSpring:h,getForceVectorLength:m,simulator:r,graph:e,lastMove:0};return n(d),d;function f(e){u!==e&&(u=e,v(e))}function p(e){o.forEach(e)}function m(){var e=0,t=0;return p(function(n){e+=Math.abs(n.force.x),t+=Math.abs(n.force.y)}),Math.sqrt(e*e+t*t)}function h(t,n){var r;if(n===void 0)r=typeof t==`object`?t.id:t;else{var i=e.hasLink(t,n);if(!i)return;r=i.id}return s[r]}function g(e){return o.get(e)}function _(){e.on(`changed`,y)}function v(e){d.fire(`stable`,e)}function y(t){for(var n=0;n<t.length;++n){var r=t[n];r.changeType===`add`?(r.node&&x(r.node.id),r.link&&C(r.link)):r.changeType===`remove`&&(r.node&&S(r.node),r.link&&w(r.link))}c=e.getNodesCount()}function b(){c=0,e.forEachNode(function(e){x(e.id),c+=1}),e.forEachLink(C)}function x(t){var n=o.get(t);if(!n){var i=e.getNode(t);if(!i)throw Error(`initBody() was called with unknown node id`);var a=i.position;if(!a){var s=T(i);a=r.getBestNewBodyPosition(s)}n=r.addBodyAt(a),n.id=t,o.set(t,n),E(t),D(i)&&(n.isPinned=!0)}}function S(e){var t=e.id,n=o.get(t);n&&(o.delete(t),r.removeBody(n))}function C(e){E(e.fromId),E(e.toId);var t=o.get(e.fromId),n=o.get(e.toId),i=r.addSpring(t,n,e.length);l(e,i),s[e.id]=i}function w(t){var n=s[t.id];if(n){var i=e.getNode(t.fromId),a=e.getNode(t.toId);i&&E(i.id),a&&E(a.id),delete s[t.id],r.removeSpring(n)}}function T(e){var t=[];return e.links&&e.links.forEach(function(n){var r=n.fromId===e.id?o.get(n.toId):o.get(n.fromId);r&&r.pos&&t.push(r)}),t}function E(e){var t=o.get(e);if(t.mass=a(e),Number.isNaN(t.mass))throw Error(`Node mass should be a number`)}function D(e){return e&&(e.isPinned||e.data&&e.data.isPinned)}function O(e){var t=o.get(e);return t||=(x(e),o.get(e)),t}function k(t){var n=e.getLinks(t);return n?1+n.length/3:1}function A(t){var n=e.getLinks(t);return n?1+n.size/3:1}}function i(){}}})();function Hl(e,t){return Vl(e,Object.assign({dimensions:2,timeStep:.5,springLength:10,gravity:-12,springCoefficient:.8,dragCoefficient:.9,debug:!1},t))}var Ul=Wl;function Wl(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,n=new Map,r={},i=0,a=e.multigraph?b:y,o=[],s=N,c=N,l=N,u=N,d={version:20,addNode:h,addLink:v,removeLink:w,removeNode:_,getNode:g,getNodeCount:x,getLinkCount:S,getEdgeCount:S,getLinksCount:S,getNodesCount:x,getLinks:C,forEachNode:I,forEachLinkedNode:A,forEachLink:k,beginUpdate:l,endUpdate:u,clear:O,hasLink:E,hasNode:g,getLink:E,getLinkById:D};return _l(d),f(),d;function f(){var e=d.on;d.on=t;function t(){return d.beginUpdate=l=P,d.endUpdate=u=F,s=p,c=m,d.on=e,e.apply(d,arguments)}}function p(e,t){o.push({link:e,changeType:t})}function m(e,t){o.push({node:e,changeType:t})}function h(e,n){if(e===void 0)throw Error(`Invalid node identifier`);l();var r=g(e);return r?(r.data=n,c(r,`update`)):(r=new Gl(e,n),c(r,`add`)),t.set(e,r),u(),r}function g(e){return t.get(e)}function _(e){var n=g(e);if(!n)return!1;l();var r=n.links;return r&&(r.forEach(T),n.links=null),t.delete(e),c(n,`remove`),u(),!0}function v(e,t,r){l();var i=g(e)||h(e),o=g(t)||h(t),c=a(e,t,r),d=n.has(c.id);return n.set(c.id,c),Kl(i,c),e!==t&&Kl(o,c),s(c,d?`update`:`add`),u(),c}function y(e,t,r){var i=Jl(e,t),a=n.get(i);return a?(a.data=r,a):new ql(e,t,r,i)}function b(e,t,n){var i=Jl(e,t),a=r.hasOwnProperty(i);if(a||E(e,t)){a||(r[i]=0);var o=`@`+ ++r[i];i=Jl(e+o,t+o)}return new ql(e,t,n,i)}function x(){return t.size}function S(){return n.size}function C(e){var t=g(e);return t?t.links:null}function w(e,t){return t!==void 0&&(e=E(e,t)),T(e)}function T(e){if(!e||!n.get(e.id))return!1;l(),n.delete(e.id);var t=g(e.fromId),r=g(e.toId);return t&&t.links.delete(e),r&&r.links.delete(e),s(e,`remove`),u(),!0}function E(e,t){if(e!==void 0&&t!==void 0)return n.get(Jl(e,t))}function D(e){if(e!==void 0)return n.get(e)}function O(){l(),I(function(e){_(e.id)}),u()}function k(e){if(typeof e==`function`)for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}function A(e,t,n){var r=g(e);if(r&&r.links&&typeof t==`function`)return n?M(r.links,e,t):j(r.links,e,t)}function j(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===n?s.toId:s.fromId;if(i=r(t.get(c),s),i)return!0;o=a.next()}}function M(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===n&&(i=r(t.get(s.toId),s),i))return!0;o=a.next()}}function N(){}function P(){i+=1}function F(){--i,i===0&&o.length>0&&(d.fire(`changed`,o),o.length=0)}function I(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function Gl(e,t){this.id=e,this.links=null,this.data=t}function Kl(e,t){e.links?e.links.add(t):e.links=new Set([t])}function ql(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function Jl(e,t){return e.toString()+`👉 `+t.toString()}function Yl(e,t,n={}){let r=n.dimensions||2,i=n.unit||10,a=n.jitter===void 0?.1:n.jitter,o=iu(n.seed||42),s=Xl(e);if(s.n===0)return`empty`;let c=Ql(s,r,n.pivots||25,o),l=`pivot MDS`;if(r===2&&s.n>2){let e=tu(s,o);nu(s,e)<nu(s,c)&&(c=e,l=`radial tree`)}let u=Array(r+1);for(let e=0;e<s.n;e++){u[0]=s.ids[e];for(let t=0;t<r;t++)u[t+1]=c[t][e]*i+(o()-.5)*a*i;t.setNodePosition.apply(t,u)}return l}function Xl(e){let t=[];e.forEachNode(e=>{t.push(e.id)});let n=t.length,r=new Map(t.map((e,t)=>[e,t])),i=new Int32Array(n),a=[];e.forEachLink(e=>{let t=r.get(e.fromId),n=r.get(e.toId);t!==n&&(a.push(t,n),i[t]++,i[n]++)});let o=new Int32Array(n+1);for(let e=0;e<n;e++)o[e+1]=o[e]+i[e];let s=o.slice(0,n),c=new Int32Array(o[n]);for(let e=0;e<a.length;e+=2){let t=a[e],n=a[e+1];c[s[t]++]=n,c[s[n]++]=t}return{ids:t,n,offsets:o,neighbors:c,degree:i}}function Zl(e,t,n,r){n.fill(-1),n[t]=0,r[0]=t;let i=0,a=1;for(;i<a;){let t=r[i++],o=n[t]+1;for(let i=e.offsets[t];i<e.offsets[t+1];i++){let t=e.neighbors[i];n[t]<0&&(n[t]=o,r[a++]=t)}}return a}function Ql(e,t,n,r){let i=e.n,a=Math.min(n,i),o=new Int32Array(i),s=new Int32Array(i),c=new Float64Array(i).fill(1/0),l=[],u=0;for(let t=1;t<i;t++)e.degree[t]>e.degree[u]&&(u=t);for(let t=0;t<a;t++){Zl(e,u,o,s);let t=0;for(let e=0;e<i;e++)o[e]>t&&(t=o[e]);let n=new Float64Array(i);for(let e=0;e<i;e++){let r=o[e]<0?t+1:o[e];n[e]=r*r,r<c[e]&&(c[e]=r)}l.push(n);let r=0;for(let e=1;e<i;e++)c[e]>c[r]&&(r=e);u=r}let d=new Float64Array(i),f=0,p=l.map(e=>{let t=0;for(let n=0;n<i;n++)t+=e[n],d[n]+=e[n];return f+=t,t/i});for(let e=0;e<i;e++)d[e]/=a;f/=i*a,l.forEach((e,t)=>{for(let n=0;n<i;n++)e[n]=-.5*(e[n]-d[n]-p[t]+f)});let m=new Float64Array(a*a);for(let e=0;e<a;e++)for(let t=e;t<a;t++){let n=0,r=l[e],o=l[t];for(let e=0;e<i;e++)n+=r[e]*o[e];m[e*a+t]=m[t*a+e]=n}let h=$l(m,a,t,r).map(e=>{let t=new Float64Array(i);return l.forEach((n,r)=>{for(let a=0;a<i;a++)t[a]+=e[r]*n[a]}),t});return eu(e,h,r),h}function $l(e,t,n,r){let i=[];for(let a=0;a<n;a++){let n=new Float64Array(t).map(()=>r()-.5);for(let r=0;r<200;r++){let r=new Float64Array(t);for(let i=0;i<t;i++){let a=0;for(let r=0;r<t;r++)a+=e[i*t+r]*n[r];r[i]=a}i.forEach(e=>{let n=0;for(let i=0;i<t;i++)n+=r[i]*e[i];for(let i=0;i<t;i++)r[i]-=n*e[i]});let a=0;for(let e=0;e<t;e++)a+=r[e]*r[e];a=Math.sqrt(a)||1;let o=0;for(let e=0;e<t;e++){let t=r[e]/a;o+=Math.abs(t-n[e]),n[e]=t}if(o<1e-9)break}i.push(n)}return i}function eu(e,t,n){let r=e.n,i=new Int32Array(r),a=new Int32Array(r),o=0,s=0;for(let c=0;c<Math.min(8,r);c++){let c=Math.floor(n()*r);Zl(e,c,i,a);for(let e=0;e<r;e++){let n=i[e];if(n<=0)continue;let r=ru(t,e,c);o+=r/n,s+=r*r/(n*n)}}let c=s>0?o/s:1;t.forEach(e=>{for(let t=0;t<r;t++)e[t]*=c})}function tu(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n);Zl(e,0,r,i);let a=0;for(let e=0;e<n;e++)r[e]>r[a]&&(a=e);Zl(e,a,r,i);let o=0;for(let e=0;e<n;e++)r[e]>r[o]&&(o=e);let s=r[o]>>1,c=o;for(;r[c]>s;)for(let t=e.offsets[c];t<e.offsets[c+1];t++){let n=e.neighbors[t];if(r[n]===r[c]-1){c=n;break}}let l=Zl(e,c,r,i),u=new Int32Array(n).fill(-1);for(let t=0;t<l;t++){let n=i[t];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let i=e.neighbors[t];r[i]===r[n]+1&&u[i]<0&&(u[i]=n)}}let d=new Float64Array(n).fill(1);for(let e=l-1;e>0;e--)d[u[i[e]]]+=d[i[e]];let f=new Float64Array(n),p=new Float64Array(n),m=new Float64Array(n),h=new Float64Array(n);p[c]=2*Math.PI;for(let t=0;t<l;t++){let n=i[t],a=f[n]+p[n]/2;m[n]=r[n]*Math.cos(a),h[n]=r[n]*Math.sin(a);let o=f[n];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let r=e.neighbors[t];u[r]===n&&(f[r]=o,p[r]=p[n]*d[r]/(d[n]-1),o+=p[r])}}let g=0;for(let e=0;e<n;e++)r[e]>g&&(g=r[e]);for(let e=0;e<n;e++)r[e]>=0||(m[e]=(t()-.5)*2*g,h[e]=(t()-.5)*2*g);return[m,h]}function nu(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n),a=iu(3),o=[];for(let t=0;t<Math.min(12,n);t++){let t=Math.floor(a()*n);Zl(e,t,r,i);for(let e=0;e<n;e++)r[e]>0&&o.push(t,e,r[e])}let s=0,c=0;for(let e=0;e<o.length;e+=3){let n=ru(t,o[e],o[e+1]),r=o[e+2];s+=n/r,c+=n*n/(r*r)}let l=c>0?s/c:1,u=0;for(let e=0;e<o.length;e+=3){let n=l*ru(t,o[e],o[e+1]),r=o[e+2];u+=(n-r)*(n-r)/(r*r)}return u/Math.max(1,o.length/3)}function ru(e,t,n){let r=0;for(let i=0;i<e.length;i++){let a=e[i][t]-e[i][n];r+=a*a}return Math.sqrt(r)}function iu(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var au=256,ou=8,su=64,cu=256,lu=16,uu=1024,du=`
struct Params {
  n: u32, G: u32, K: u32, nCells: u32,
  gravity: f32, springLength: f32, springK: f32, drag: f32,
  dt: f32, maxV: f32, nearCap: u32, integrator: u32,
  springChunk: u32, outlierRank: u32, nChunks: u32, locOff: u32,
};
fn part1by1(v: u32) -> u32 {
  var x = v & 0x0000ffffu;
  x = (x | (x << 8u)) & 0x00FF00FFu;
  x = (x | (x << 4u)) & 0x0F0F0F0Fu;
  x = (x | (x << 2u)) & 0x33333333u;
  x = (x | (x << 1u)) & 0x55555555u;
  return x;
}
fn compact1by1(v: u32) -> u32 {
  var x = v & 0x55555555u;
  x = (x | (x >> 1u)) & 0x33333333u;
  x = (x | (x >> 2u)) & 0x0F0F0F0Fu;
  x = (x | (x >> 4u)) & 0x00FF00FFu;
  x = (x | (x >> 8u)) & 0x0000FFFFu;
  return x;
}
fn morton(x: u32, y: u32) -> u32 { return part1by1(x) | (part1by1(y) << 1u); }
// Direction for two coincident nodes, from their indices: deterministic and antisymmetric,
// jitter(a, b) == -jitter(b, a), so the pair is pushed apart instead of moving together.
fn jitter(a: u32, b: u32) -> vec2f {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}
`,fu={HIST:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> bs: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${2*uu}>;
var<workgroup> wb: array<atomic<u32>, 4>;
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u) {
  for (var b = li; b < ${2*uu}u; b += ${au}u) { atomicStore(&hist[b], 0u); }
  if (li < 2u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < 4u) { atomicStore(&wb[li], 0u); }
  workgroupBarrier();
  let c = vec2f(bitcast<f32>(atomicLoad(&bs[8])), bitcast<f32>(atomicLoad(&bs[9])));
  var mn = vec2f(3e38); var mx = vec2f(-3e38);
  for (var i = gid.x; i < P.n; i += nwg.x * ${au}u) {
    let p = pos[i];
    if (!(all(p == p) && all(abs(p) < vec2f(1e37)))) { continue; } // NaN or inf
    mn = min(mn, p); mx = max(mx, p);
    let d = p - c;
    atomicAdd(&hist[hbin(d.x)], 1u);
    atomicAdd(&hist[${uu}u + hbin(d.y)], 1u);
  }
  atomicMin(&wb[0], fenc(mn.x)); atomicMin(&wb[1], fenc(mn.y));
  atomicMax(&wb[2], fenc(mx.x)); atomicMax(&wb[3], fenc(mx.y));
  workgroupBarrier();
  for (var b = li; b < ${2*uu}u; b += ${au}u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&bs[${lu}u + b], v); }
  }
  if (li == 0u) {
    atomicMin(&bs[0], atomicLoad(&wb[0])); atomicMin(&bs[1], atomicLoad(&wb[1]));
    atomicMax(&bs[2], atomicLoad(&wb[2])); atomicMax(&bs[3], atomicLoad(&wb[3]));
  }
}`,BOX:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> bs: array<u32>;
var<workgroup> scan: array<u32, ${au}>;
var<workgroup> found: array<f32, 6>;
var<workgroup> total: u32;
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(${au})
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < 6u) { found[li] = 0.0; }
  for (var a = 0u; a < 2u; a++) {
    let base = ${lu}u + a * ${uu}u + li * 4u;
    var cs = array<u32, 4>(bs[base], bs[base + 1u], bs[base + 2u], bs[base + 3u]);
    let t = cs[0] + cs[1] + cs[2] + cs[3];
    scan[li] = t;
    workgroupBarrier();
    for (var off = 1u; off < ${au}u; off <<= 1u) {
      var v = scan[li];
      if (li >= off) { v += scan[li - off]; }
      workgroupBarrier();
      scan[li] = v;
      workgroupBarrier();
    }
    let count = scan[255];
    if (li == 0u) { total = count; }
    var cum = scan[li] - t;
    if (count > 0u) {
      let k = min(P.outlierRank, (count - 1u) / 2u);
      let rLo = k; let rHi = count - 1u - k; let rMed = count / 2u;
      for (var j = 0u; j < 4u; j++) {
        let s = li * 4u + j;
        let e = cum + cs[j];
        if (rLo >= cum && rLo < e) { found[a * 3u] = edgeLo(s); }
        if (rHi >= cum && rHi < e) { found[a * 3u + 1u] = edgeHi(s); }
        if (rMed >= cum && rMed < e) { found[a * 3u + 2u] = 0.5 * (edgeLo(s) + edgeHi(s)); }
        cum = e;
      }
    }
    for (var j = 0u; j < 4u; j++) { bs[base + j] = 0u; }
    workgroupBarrier();
  }
  if (li == 0u) {
    if (total > 0u) {
      let bbMin = vec2f(fdec(bs[0]), fdec(bs[1]));
      let bbMax = vec2f(fdec(bs[2]), fdec(bs[3]));
      let c = vec2f(bitcast<f32>(bs[8]), bitcast<f32>(bs[9]));
      let qLo = c + vec2f(found[0], found[3]);
      let qHi = c + vec2f(found[1], found[4]);
      let margin = vec2f(0.25 * max(qHi.x - qLo.x, qHi.y - qLo.y));
      let lo = max(bbMin, qLo - margin);
      let hi = min(bbMax, qHi + margin);
      let side = max(max(hi.x - lo.x, hi.y - lo.y) * 1.0001, 1e-3);
      let o = 0.5 * (lo + hi) - vec2f(0.5 * side);
      bs[4] = bitcast<u32>(o.x); bs[5] = bitcast<u32>(o.y);
      bs[6] = bitcast<u32>(side); bs[7] = bitcast<u32>(f32(P.G) / side);
      bs[8] = bitcast<u32>(c.x + found[2]); bs[9] = bitcast<u32>(c.y + found[5]);
      bs[10] = bitcast<u32>(max(bbMax.x - bbMin.x, bbMax.y - bbMin.y));
    }
    bs[0] = 0xffffffffu; bs[1] = 0xffffffffu; bs[2] = 0u; bs[3] = 0u;
  }
}`,BIN:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> bs: array<u32>;
@group(0) @binding(3) var<storage, read_write> cellCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> nodeCell: array<u32>;
@group(0) @binding(5) var<storage, read_write> nodeSlot: array<u32>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let o = vec2f(bitcast<f32>(bs[4]), bitcast<f32>(bs[5]));
  let q = (pos[i] - o) * bitcast<f32>(bs[7]);
  let gmax = f32(P.G - 1u);
  let g = clamp(floor(q), vec2f(0.0), vec2f(gmax));
  // outside the box (by more than half a cell): clamped into a border cell
  let inside = all(q > vec2f(-0.5)) && all(q < vec2f(gmax + 1.5));
  let c = morton(u32(g.x), u32(g.y));
  nodeCell[i] = c | select(0x80000000u, 0u, inside);
  nodeSlot[i] = atomicAdd(&cellCount[c], 1u);
}`,SCAN_BLOCKS:`
@group(0) @binding(0) var<storage, read_write> cnt: array<u32>;
@group(0) @binding(1) var<storage, read_write> start: array<u32>;
@group(0) @binding(2) var<storage, read_write> blockSums: array<u32>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = cnt[base]; let a1 = cnt[base + 1u]; let a2 = cnt[base + 2u]; let a3 = cnt[base + 3u];
  cnt[base] = 0u; cnt[base + 1u] = 0u; cnt[base + 2u] = 0u; cnt[base + 3u] = 0u;
  let t = a0 + a1 + a2 + a3;
  tmp[li] = t;
  workgroupBarrier();
  for (var off = 1u; off < 256u; off <<= 1u) {
    var v = tmp[li];
    if (li >= off) { v += tmp[li - off]; }
    workgroupBarrier();
    tmp[li] = v;
    workgroupBarrier();
  }
  let ex = tmp[li] - t;
  start[base] = ex; start[base + 1u] = ex + a0; start[base + 2u] = ex + a0 + a1; start[base + 3u] = ex + a0 + a1 + a2;
  if (li == 255u) { blockSums[wid.x] = tmp[255]; }
}`,SCAN_TOP:`
@group(0) @binding(0) var<storage, read_write> blockSums: array<u32>;
@group(0) @binding(1) var<uniform> nb: vec4u;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  let base = li * 4u;
  var a = vec4u(0u);
  for (var k = 0u; k < 4u; k++) { if (base + k < nb.x) { a[k] = blockSums[base + k]; } }
  let t = a.x + a.y + a.z + a.w;
  tmp[li] = t;
  workgroupBarrier();
  for (var off = 1u; off < 256u; off <<= 1u) {
    var v = tmp[li];
    if (li >= off) { v += tmp[li - off]; }
    workgroupBarrier();
    tmp[li] = v;
    workgroupBarrier();
  }
  var ex = tmp[li] - t;
  for (var k = 0u; k < 4u; k++) { if (base + k < nb.x) { blockSums[base + k] = ex; } ex += a[k]; }
}`,SCAN_ADD:`
@group(0) @binding(0) var<storage, read_write> start: array<u32>;
@group(0) @binding(1) var<storage, read> blockSums: array<u32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let e = gid.x;
  if (e >= arrayLength(&start)) { return; }
  start[e] += blockSums[e >> 10u];
}`,PLACE:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(2) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read_write> slotted: array<u32>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  slotted[start[nodeCell[i] & 0x7fffffffu] + nodeSlot[i]] = i;
}`,ORDER:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> mass: array<f32>;
@group(0) @binding(3) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(4) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(5) var<storage, read> start: array<u32>;
@group(0) @binding(6) var<storage, read> slotted: array<u32>;
@group(0) @binding(7) var<storage, read_write> sp: array<vec4f>;
@group(0) @binding(8) var<storage, read_write> perm: array<u32>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let raw = nodeCell[i];
  let c = raw & 0x7fffffffu;
  let s = start[c];
  let e = select(P.n, start[c + 1u], c + 1u < P.nCells);
  var rank = nodeSlot[i];
  if (e - s <= 1024u) { // a pathologically full cell keeps the atomic order
    rank = 0u;
    for (var t = s; t < e; t++) { if (slotted[t] < i) { rank++; } }
  }
  let k = s + rank;
  let w = f32(c) + 0.5;
  sp[k] = vec4f(pos[i], mass[i], select(-w, w, raw == c));
  perm[k] = i;
}`,SPRINGS:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> chunks: array<vec2u>; // (row, first edge)
@group(0) @binding(2) var<storage, read> csr: array<u32>;      // [rowStart (n + 1), neighbors]
@group(0) @binding(3) var<storage, read> pos: array<vec2f>;
@group(0) @binding(4) var<storage, read_write> springF: array<vec2f>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let t = gid.x;
  if (t >= P.nChunks) { return; }
  let ch = chunks[t];
  let i = ch.x;
  let eEnd = min(ch.y + P.springChunk, csr[i + 1u]);
  let p = pos[i];
  var f = vec2f(0.0);
  for (var e = ch.y; e < eEnd; e++) {
    let j = csr[P.n + 1u + e];
    var d = pos[j] - p;
    var r = length(d);
    if (r == 0.0) { d = jitter(i, j); r = length(d); }
    f += (P.springK * (r - P.springLength) / r) * d;
  }
  springF[t] = f;
}`,AGG0:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> start: array<u32>;
@group(0) @binding(2) var<storage, read> sp: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let c = gid.x;
  if (c >= P.nCells) { return; }
  let s = start[c];
  let e = select(P.n, start[c + 1u], c + 1u < P.nCells);
  var m = 0.0; var com = vec2f(0.0);
  for (var t = s; t < e; t++) { let q = sp[t]; m += q.z; com += q.z * q.xy; }
  if (m > 0.0) { com /= m; }
  cells[c] = vec4f(m, com, f32(e - s));
}`,PYR:`
struct L { count: u32, childOff: u32, parentOff: u32, pad: u32 };
@group(0) @binding(0) var<uniform> lv: L;
@group(0) @binding(1) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let q = gid.x;
  if (q >= lv.count) { return; }
  var m = 0.0; var com = vec2f(0.0); var cn = 0.0;
  for (var k = 0u; k < 4u; k++) {
    let c = cells[lv.childOff + 4u * q + k];
    m += c.x; com += c.x * c.yz; cn += c.w;
  }
  if (m > 0.0) { com /= m; }
  cells[lv.parentOff + q] = vec4f(m, com, cn);
}`,LOCAL:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> bs: array<u32>;
@group(0) @binding(2) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let t = gid.x;
  var off = 0u; var Gl = P.G; var l = 0u;
  loop {
    if (l >= P.K) { return; }
    if (t < off + Gl * Gl) { break; }
    off += Gl * Gl; Gl >>= 1u; l++;
  }
  let c = t - off;
  let me = cells[off + c];
  if (me.x == 0.0) { return; }
  let o = vec2f(bitcast<f32>(bs[4]), bitcast<f32>(bs[5]));
  let w = bitcast<f32>(bs[6]) / f32(Gl);
  let xl = i32(compact1by1(c)); let yl = i32(compact1by1(c >> 1u));
  let center = o + (vec2f(f32(xl), f32(yl)) + 0.5) * w;
  let Gi = i32(Gl);
  let px = xl >> 1u; let py = yl >> 1u;
  let x0 = max(2 * px - 2, 0); let x1 = min(2 * px + 3, Gi - 1);
  let y0 = max(2 * py - 2, 0); let y1 = min(2 * py + 3, Gi - 1);
  var F = vec2f(0.0); var jxx = 0.0; var jxy = 0.0; var jyy = 0.0;
  for (var y = y0; y <= y1; y++) {
    for (var x = x0; x <= x1; x++) {
      if (abs(x - xl) <= 1 && abs(y - yl) <= 1) { continue; }
      let cell = cells[off + morton(u32(x), u32(y))];
      if (cell.x > 0.0) {
        let d = cell.yz - center;
        let r2 = dot(d, d);
        let ir2 = 1.0 / r2;
        let g = P.gravity * cell.x * ir2 * sqrt(ir2); // gravity M / r^3
        F += g * d;
        // d/dp of gravity M (q - p) / |q - p|^3 = gravity M (3 d d^T / r^5 - I / r^3)
        jxx += g * (3.0 * d.x * d.x * ir2 - 1.0);
        jxy += g * (3.0 * d.x * d.y * ir2);
        jyy += g * (3.0 * d.y * d.y * ir2 - 1.0);
      }
    }
  }
  cells[P.locOff + 2u * t] = vec4f(F, jxx, jxy);
  cells[P.locOff + 2u * t + 1u] = vec4f(jyy, center, 0.0);
}`,FORCE:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> sp: array<vec4f>;
@group(0) @binding(2) var<storage, read> perm: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read> cells: array<vec4f>;
@group(0) @binding(5) var<storage, read> springF: array<vec2f>;
@group(0) @binding(6) var<storage, read> rowChunk: array<u32>; // first chunk of each row (n + 1)
@group(0) @binding(7) var<storage, read_write> pos: array<vec2f>;
// [0, n): (velocity, 0, pinned); [n, 2n): (force, 0, 0) for FIRE
@group(0) @binding(8) var<storage, read_write> vel: array<vec4f>;

@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let k = gid.x;
  if (k >= P.n) { return; }
  let i = perm[k];
  let me = sp[k];
  let p = me.xy; let mi = me.z;
  let c = u32(abs(me.w));
  let cx = i32(compact1by1(c)); let cy = i32(compact1by1(c >> 1u));
  let Gi = i32(P.G);
  var f = vec2f(0.0);

  // near field: exact pairs in my 3x3 cells (strided with weights in overfull cells)
  for (var dy = -1; dy <= 1; dy++) {
    let y = cy + dy;
    if (y < 0 || y >= Gi) { continue; }
    for (var dx = -1; dx <= 1; dx++) {
      let x = cx + dx;
      if (x < 0 || x >= Gi) { continue; }
      let mc = morton(u32(x), u32(y));
      let s = start[mc];
      let e = select(P.n, start[mc + 1u], mc + 1u < P.nCells);
      let n = e - s;
      var stride = 1u;
      if (n > P.nearCap) { stride = (n + P.nearCap - 1u) / P.nearCap; }
      let w = f32(stride);
      for (var t = s; t < e; t += stride) {
        if (t == k) { continue; }
        let q = sp[t];
        var d = q.xy - p;
        var r2 = dot(d, d);
        if (r2 == 0.0) { d = jitter(i, perm[t]); r2 = dot(d, d); }
        let r = sqrt(r2);
        f += (P.gravity * mi * q.z * w / (r2 * r)) * d;
      }
    }
  }

  var ff = vec2f(0.0);
  if (me.w > 0.0) {
    // far field: local expansions down my chain of parent cells
    var off = 0u; var Gl = P.G; var cc = c;
    for (var l = 0u; l < P.K; l++) {
      let a = cells[P.locOff + 2u * (off + cc)]; let b = cells[P.locOff + 2u * (off + cc) + 1u];
      let dp = p - b.yz;
      ff += a.xy + vec2f(a.z * dp.x + a.w * dp.y, a.w * dp.x + b.x * dp.y);
      off += Gl * Gl; Gl >>= 1u; cc >>= 2u;
    }
  } else {
    // clamped into a border cell: monopoles of the interaction lists at my real position
    var off = 0u; var Gl = Gi;
    for (var l = 0u; l < P.K; l++) {
      let xl = cx >> l; let yl = cy >> l;
      let px = xl >> 1u; let py = yl >> 1u;
      let x0 = max(2 * px - 2, 0); let x1 = min(2 * px + 3, Gl - 1);
      let y0 = max(2 * py - 2, 0); let y1 = min(2 * py + 3, Gl - 1);
      for (var y = y0; y <= y1; y++) {
        for (var x = x0; x <= x1; x++) {
          if (abs(x - xl) <= 1 && abs(y - yl) <= 1) { continue; }
          let cell = cells[off + morton(u32(x), u32(y))];
          if (cell.x > 0.0) {
            let d = cell.yz - p;
            let r2 = dot(d, d);
            if (r2 > 0.0) { ff += (P.gravity * cell.x / (r2 * sqrt(r2))) * d; }
          }
        }
      }
      off += u32(Gl * Gl);
      Gl = Gl >> 1u;
    }
  }
  f += mi * ff;

  for (var t = rowChunk[i]; t < rowChunk[i + 1u]; t++) { f += springF[t]; }

  let v4 = vel[i];
  if (v4.w != 0.0) { return; } // pinned
  if (P.integrator == 1u) { vel[P.n + i] = vec4f(f, 0.0, 0.0); return; }
  var v = v4.xy;
  f -= P.drag * v;
  v += (P.dt / mi) * f;
  let vl = length(v);
  if (vl > P.maxV) { v *= P.maxV / vl; }
  vel[i] = vec4f(v, 0.0, 0.0);
  pos[i] = p + P.dt * v;
}`,FIRE_REDUCE:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> vel: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> fire: array<vec4f>; // [0]: state, [1 + w]: partials
var<workgroup> red: array<vec4f, ${au}>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  var acc = vec4f(0.0);
  for (var i = gid.x; i < P.n; i += nwg.x * ${au}u) {
    let v4 = vel[i];
    if (v4.w != 0.0) { continue; }
    let f = vel[P.n + i].xy;
    acc += vec4f(dot(f, v4.xy), dot(v4.xy, v4.xy), dot(f, f), 0.0);
  }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${au/2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) { fire[1u + wid.x] = red[0]; }
}`,FIRE_STATE:`
struct FireParams { groups: u32, pad0: u32, pad1: u32, pad2: u32 };
@group(0) @binding(0) var<uniform> FP: FireParams;
@group(0) @binding(1) var<storage, read_write> fire: array<vec4f>;
var<workgroup> red: array<vec4f, ${au}>;
@compute @workgroup_size(${au})
fn main(@builtin(local_invocation_index) li: u32) {
  var acc = vec4f(0.0);
  for (var w = li; w < FP.groups; w += ${au}u) { acc += fire[1u + w]; }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${au/2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) {
    let sum = red[0];
    let st = fire[0];
    let a = st.x;
    if (sum.x > 0.0) {
      var cf = 0.0;
      if (sum.z > 0.0) { cf = a * sqrt(sum.y) / sqrt(sum.z); }
      let npos = st.y + 1.0;
      fire[0] = vec4f(select(a, a * 0.99, npos > 5.0), npos, 1.0 - a, cf);
    } else {
      fire[0] = vec4f(0.1, 0.0, 0.0, 0.0);
    }
  }
}`,FIRE_INTEGRATE:du+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>;
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> fire: array<vec4f>;
@compute @workgroup_size(${au})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  let v4 = vel[i];
  if (v4.w != 0.0) { return; }
  let st = fire[0];
  let f = vel[P.n + i].xy;
  var v = st.z * v4.xy + st.w * f;
  v += (P.dt / mass[i]) * f;
  let vl = length(v);
  if (vl > P.maxV) { v *= P.maxV / vl; }
  vel[i] = vec4f(v, 0.0, 0.0);
  pos[i] = pos[i] + P.dt * v;
}`},pu=new WeakMap;function mu(e){let t=pu.get(e);if(!t){t={};for(let[n,r]of Object.entries(fu))t[n]=e.createComputePipeline({layout:`auto`,compute:{module:e.createShaderModule({code:r,label:n}),entryPoint:`main`},label:n});pu.set(e,t)}return t}function hu(e){let t=32;for(;t*t*2<e&&t<1024;)t*=2;return t}function gu(e,{n:t,edges:n,init:r,mass:i}){let a=mu(e),o=hu(t),s=Math.log2(o),c=o*o,l=c/1024,u=new Uint32Array(t);for(let e=0;e<n.length;e+=2)u[n[e]]++,u[n[e+1]]++;let d=new Uint32Array(t+1+2*(n.length/2));for(let e=0;e<t;e++)d[e+1]=d[e]+u[e];let f=d.slice(0,t);for(let e=0;e<n.length;e+=2){let r=n[e],i=n[e+1];d[t+1+f[r]++]=i,d[t+1+f[i]++]=r}let p=0;for(let e=0;e<t;e++)p+=Math.ceil(u[e]/ou);let m=new Uint32Array(Math.max(2,2*p)),h=new Uint32Array(t+1);for(let e=0,n=0;e<t;e++){h[e]=n;for(let t=d[e];t<d[e+1];t+=ou,n++)m[2*n]=e,m[2*n+1]=t}h[t]=p;let g=GPUBufferUsage.STORAGE,_=GPUBufferUsage.COPY_DST,v=GPUBufferUsage.COPY_SRC,y=[],b=(t,n=g)=>{let r=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n});return y.push(r),r},x=(t,n=g|_)=>{let r=b(t.byteLength,n);return e.queue.writeBuffer(r,0,t),r},S=x(r,g|_|v),C=b(t*32,g|_),w=x(i),T=x(d),E=x(m),D=x(h),O=b(Math.max(1,p)*8),k=b(c*4,g|_),A=b(c*4),j=b(Math.max(l,4)*4),M=b(t*4),N=b(t*4),P=b(t*4),F=b(t*4),I=b(t*16),L=0,R=[];for(let e=0,t=o;e<=s;e++,t>>=1)R.push(L),L+=t*t;let ee=b((L+2*R[s])*16),z=b(4112,g|_),B=Math.min(cu,Math.ceil(t/au)),V=new Uint32Array(2064),te=new Float32Array(V.buffer);{let e=1/0,n=1/0,i=-1/0,a=-1/0;for(let o=0;o<t;o++){let t=r[2*o],s=r[2*o+1];t<e&&(e=t),t>i&&(i=t),s<n&&(n=s),s>a&&(a=s)}let s=Math.max(i-e,a-n,.001)*1.0001;te[4]=(e+i-s)/2,te[5]=(n+a-s)/2,te[6]=s,te[7]=o/s,V[0]=V[1]=4294967295}let ne=x(V,g|_|v),re=new ArrayBuffer(64),ie=new Uint32Array(re),ae=new Float32Array(re);ie[0]=t,ie[1]=o,ie[2]=s,ie[3]=c,ie[10]=su,ie[12]=ou,ie[13]=Math.max(1,Math.floor(t/1e3)),ie[14]=p,ie[15]=L;let H=b(64,GPUBufferUsage.UNIFORM|_),oe=x(new Uint32Array([l,0,0,0]),GPUBufferUsage.UNIFORM|_),se=x(new Uint32Array([B,0,0,0]),GPUBufferUsage.UNIFORM|_),U=(t,n)=>e.createBindGroup({layout:t.getBindGroupLayout(0),entries:n.map((e,t)=>({binding:t,resource:{buffer:e}}))}),ce={HIST:U(a.HIST,[H,S,ne]),BOX:U(a.BOX,[H,ne]),BIN:U(a.BIN,[H,S,ne,k,M,N]),SCAN_BLOCKS:U(a.SCAN_BLOCKS,[k,A,j]),SCAN_TOP:U(a.SCAN_TOP,[j,oe]),SCAN_ADD:U(a.SCAN_ADD,[A,j]),PLACE:U(a.PLACE,[H,M,N,A,P]),ORDER:U(a.ORDER,[H,S,w,M,N,A,P,I,F]),SPRINGS:U(a.SPRINGS,[H,E,T,S,O]),AGG0:U(a.AGG0,[H,A,I,ee]),LOCAL:U(a.LOCAL,[H,ne,ee]),FORCE:U(a.FORCE,[H,I,F,A,ee,O,D,S,C]),FIRE_REDUCE:U(a.FIRE_REDUCE,[H,C,z]),FIRE_STATE:U(a.FIRE_STATE,[se,z]),FIRE_INTEGRATE:U(a.FIRE_INTEGRATE,[H,S,C,w,z])},le=[];for(let e=0;e<s;e++){let t=(o>>e+1)**2,n=x(new Uint32Array([t,R[e],R[e+1],0]),GPUBufferUsage.UNIFORM|_);le.push({count:t,group:U(a.PYR,[n,ee])})}let ue=Math.ceil(t/au),de=Math.min(ue,128),fe=!1;function pe(){e.queue.writeBuffer(z,0,new Float32Array([.1,0,0,0]))}pe();function me(e,t,n){e.setPipeline(a[t]),e.setBindGroup(0,ce[t]),e.dispatchWorkgroups(n)}function he(e){me(e,`HIST`,de),me(e,`BOX`,1),me(e,`BIN`,ue),me(e,`SCAN_BLOCKS`,l),me(e,`SCAN_TOP`,1),me(e,`SCAN_ADD`,Math.ceil(c/256)),me(e,`PLACE`,ue),me(e,`ORDER`,ue),p&&me(e,`SPRINGS`,Math.ceil(p/au)),me(e,`AGG0`,Math.ceil(c/au)),e.setPipeline(a.PYR);for(let{count:t,group:n}of le)e.setBindGroup(0,n),e.dispatchWorkgroups(Math.ceil(t/256));me(e,`LOCAL`,Math.ceil(R[s]/au)),me(e,`FORCE`,ue),fe&&(me(e,`FIRE_REDUCE`,B),me(e,`FIRE_STATE`,1),me(e,`FIRE_INTEGRATE`,ue))}return{kind:`grid`,G:o,pos:S,vel:C,setParams(t){ae[4]=t.gravity,ae[5]=t.springLength,ae[6]=t.springCoefficient,ae[7]=t.dragCoefficient,ae[8]=t.timeStep,ae[9]=t.maxVelocity,ie[11]=+(t.integrator===`fire`),fe=ie[11]===1,e.queue.writeBuffer(H,0,re)},resetFire:pe,run(t,n,r){for(let i=0;i<t;){let a=Math.min(64,t-i),o=e.createCommandEncoder(),s=i===0,c=i+a===t,l;n&&(s||c)&&(l={querySet:n.querySet},s&&(l.beginningOfPassWriteIndex=0),c&&(l.endOfPassWriteIndex=1));let u=o.beginComputePass(l?{timestampWrites:l}:void 0);for(let e=0;e<a;e++)he(u);u.end(),c&&r&&r(o),e.queue.submit([o.finish()]),i+=a}},boxBuffer:ne,destroy(){for(let e of y)e.destroy()}}}var _u=`
struct Params {
  n: u32, steps: u32, integrator: u32, pad0: u32,
  gravity: f32, springLength: f32, springK: f32, drag: f32,
  dt: f32, maxV: f32, pad1: f32, pad2: f32,
};
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>; // (velocity, 0, pinned)
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> csr: array<u32>;         // [rowStart (n + 1), neighbors]
@group(0) @binding(5) var<storage, read_write> fire: array<vec4f>; // [0] = (a, npos, 0, 0)

override WGS: u32 = 1024;
var<workgroup> sp: array<vec2f, WGS>;
var<workgroup> sm: array<f32, WGS>;
var<workgroup> red: array<f32, WGS>;

// Same as the grid engine: deterministic, antisymmetric push for coincident nodes.
fn jitter(a: u32, b: u32) -> vec2f {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}

@compute @workgroup_size(WGS)
fn main(@builtin(local_invocation_index) i: u32) {
  let live = i < P.n;
  var p = vec2f(0.0); var v = vec2f(0.0); var mi = 0.0; var pinned = false;
  if (live) { p = pos[i]; let v4 = vel[i]; v = v4.xy; pinned = v4.w != 0.0; mi = mass[i]; }
  let moving = live && !pinned;
  sm[i] = mi;
  var st = fire[0];
  var a = st.x; var npos = st.y;
  for (var s = 0u; s < P.steps; s++) {
    sp[i] = p;
    workgroupBarrier();
    var f = vec2f(0.0);
    if (live) {
      for (var j = 0u; j < P.n; j++) {
        if (j == i) { continue; }
        var d = sp[j] - p;
        var r2 = dot(d, d);
        if (r2 == 0.0) { d = jitter(i, j); r2 = dot(d, d); }
        let r = sqrt(r2);
        f += (P.gravity * mi * sm[j] / (r2 * r)) * d;
      }
      for (var e = csr[i]; e < csr[i + 1u]; e++) {
        let j = csr[P.n + 1u + e];
        var d = sp[j] - p;
        var r = length(d);
        if (r == 0.0) { d = jitter(i, j); r = length(d); }
        f += (P.springK * (r - P.springLength) / r) * d;
      }
    }
    if (P.integrator == 1u) {
      // FIRE: workgroup sums of (F.v, |v|^2) in sp and |F|^2 in red
      workgroupBarrier();
      sp[i] = select(vec2f(0.0), vec2f(dot(f, v), dot(v, v)), moving);
      red[i] = select(0.0, dot(f, f), moving);
      workgroupBarrier();
      for (var k = 512u; k > 0u; k >>= 1u) {
        if (i < k && i + k < WGS) { sp[i] += sp[i + k]; red[i] += red[i + k]; }
        workgroupBarrier();
      }
      let power = sp[0].x; let v2 = sp[0].y; let f2 = red[0];
      var cv = 0.0; var cf = 0.0;
      if (power > 0.0) {
        cv = 1.0 - a;
        if (f2 > 0.0) { cf = a * sqrt(v2) / sqrt(f2); }
        npos += 1.0;
        if (npos > 5.0) { a *= 0.99; }
      } else {
        npos = 0.0; a = 0.1;
      }
      if (moving) {
        v = cv * v + cf * f;
        v += (P.dt / mi) * f;
        let vl = length(v);
        if (vl > P.maxV) { v *= P.maxV / vl; }
        p += P.dt * v;
      }
    } else if (moving) {
      f -= P.drag * v;
      v += (P.dt / mi) * f;
      let vl = length(v);
      if (vl > P.maxV) { v *= P.maxV / vl; }
      p += P.dt * v;
    }
    workgroupBarrier();
  }
  if (live) { pos[i] = p; vel[i] = vec4f(v, 0.0, select(0.0, 1.0, pinned)); }
  if (i == 0u) { fire[0] = vec4f(a, npos, 0.0, 0.0); }
}`,vu=new WeakMap;function yu(e){return Math.max(32,Math.ceil(e/32)*32)}function bu(e,t){let n=yu(t),r=e.limits;return t<=1024&&r.maxComputeInvocationsPerWorkgroup>=n&&r.maxComputeWorkgroupSizeX>=n&&r.maxComputeWorkgroupStorageSize>=16*n}function xu(e,{n:t,edges:n,init:r,mass:i}){let a=new Uint32Array(t);for(let e=0;e<n.length;e+=2)a[n[e]]++,a[n[e+1]]++;let o=new Uint32Array(t+1+n.length);for(let e=0;e<t;e++)o[e+1]=o[e]+a[e];let s=o.slice(0,t);for(let e=0;e<n.length;e+=2){let r=n[e],i=n[e+1];o[t+1+s[r]++]=i,o[t+1+s[i]++]=r}let c=GPUBufferUsage.STORAGE,l=GPUBufferUsage.COPY_DST,u=GPUBufferUsage.COPY_SRC,d=[],f=(t,n)=>{let r=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n});return d.push(r),r},p=(t,n=c|l)=>{let r=f(t.byteLength,n);return e.queue.writeBuffer(r,0,t),r},m=p(r,c|l|u),h=f(t*16,c|l),g=p(i),_=p(o),v=f(16,c|l),y=f(48,GPUBufferUsage.UNIFORM|l),b=yu(t),x=vu.get(e);x||(x=new Map,vu.set(e,x));let S=x.get(b);S||(S=e.createComputePipeline({layout:`auto`,compute:{module:e.createShaderModule({code:_u,label:`small`}),entryPoint:`main`,constants:{WGS:b}},label:`small-${b}`}),x.set(b,S));let C=e.createBindGroup({layout:S.getBindGroupLayout(0),entries:[y,m,h,g,_,v].map((e,t)=>({binding:t,resource:{buffer:e}}))}),w=new ArrayBuffer(48),T=new Uint32Array(w),E=new Float32Array(w);T[0]=t;let D=new Uint32Array(1);function O(){e.queue.writeBuffer(v,0,new Float32Array([.1,0,0,0]))}return O(),{kind:`small`,G:0,pos:m,vel:h,setParams(t){T[2]=+(t.integrator===`fire`),E[4]=t.gravity,E[5]=t.springLength,E[6]=t.springCoefficient,E[7]=t.dragCoefficient,E[8]=t.timeStep,E[9]=t.maxVelocity,e.queue.writeBuffer(y,0,w)},resetFire:O,run(t,n,r){for(let i=0;i<t;){let a=Math.min(64,t-i);D[0]=a,e.queue.writeBuffer(y,4,D);let o=e.createCommandEncoder(),s=i===0,c=i+a===t,l;n&&(s||c)&&(l={querySet:n.querySet},s&&(l.beginningOfPassWriteIndex=0),c&&(l.endOfPassWriteIndex=1));let u=o.beginComputePass(l?{timestampWrites:l}:void 0);u.setPipeline(S),u.setBindGroup(0,C),u.dispatchWorkgroups(1),u.end(),c&&r&&r(o),e.queue.submit([o.finish()]),i+=a}},destroy(){for(let e of d)e.destroy()}}}var Su={timeStep:.5,springLength:10,springCoefficient:.8,dragCoefficient:.9,gravity:-12,maxVelocity:4,integrator:`euler`},Cu=3,wu=30,Tu=4096,Eu=null,Du=new WeakMap;async function Ou(){return Eu||=ku(),Eu}async function ku(){try{if(typeof navigator>`u`||!navigator.gpu)return null;let e=await navigator.gpu.requestAdapter({powerPreference:`high-performance`});if(!e)return null;let t={};for(let n of[`maxStorageBuffersPerShaderStage`,`maxStorageBufferBindingSize`,`maxBufferSize`,`maxComputeInvocationsPerWorkgroup`,`maxComputeWorkgroupSizeX`,`maxComputeWorkgroupStorageSize`])t[n]=e.limits[n];let n=e.features.has(`timestamp-query`)?[`timestamp-query`]:[],r=await e.requestDevice({requiredFeatures:n,requiredLimits:t});return Au(r),r.lost.then(()=>{Eu=null}),r}catch(e){return console.warn(`WebGPU is not available:`,e),null}}function Au(e){let t=Du.get(e);return t||(t={errors:0,lost:!1},Du.set(e,t),e.addEventListener(`uncapturederror`,e=>{t.errors+=1,console.error(`WebGPU error:`,e.error&&e.error.message)}),e.lost.then(e=>{t.lost=!0,e.reason!==`destroyed`&&console.error(`WebGPU device lost:`,e.message)}),t)}function ju(e,t,n={}){let r=Au(e),i=r.errors,a=Object.assign({},Su);Mu(a,n.settings);let o=[];t.forEachNode(e=>{o.push(e.id)});let s=o.length,c=new Map;for(let e=0;e<s;e++)c.set(o[e],e);let l=new Float64Array(s),u=new Float64Array(s),d=Math.sqrt(s)*a.springLength;for(let e=0;e<s;e++){let t=n.getInitialPosition?n.getInitialPosition(o[e]):null;t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?(l[e]=t.x,u[e]=t.y):(l[e]=(Pu(e,1)-.5)*d,u[e]=(Pu(e,2)-.5)*d)}Fu(l,u);let f=Iu(l,u),p=f.x,m=f.y,h=[];t.forEachLink(e=>{if(e.fromId===e.toId)return;let t=c.get(e.fromId),n=c.get(e.toId);t!==void 0&&n!==void 0&&h.push(t,n)});let g=new Float32Array(s);for(let e=0;e<s;e++){let n=t.getLinks?t.getLinks(o[e]):null,r=n?n.size===void 0?n.length:n.size:0;g[e]=1+r/3}let _=s>0&&bu(e,s),v=!_&&s>=Tu?Lu(l,u,f):Nu(s),y=new Float32Array(2*s),b=new Float32Array(s);for(let e=0;e<s;e++){let t=v[e];y[2*t]=l[e]-p,y[2*t+1]=u[e]-m,b[t]=g[e]}let x=new Uint32Array(h.length);for(let e=0;e<h.length;e++)x[e]=v[h[e]];let S=null,C=null;if(s>0){e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`),S=(_?xu:gu)(e,{n:s,edges:x,init:y,mass:b}),S.setParams(a);let t=e=>{e&&(C=e.message,console.error(`WebGPU layout setup failed:`,e.message))};e.popErrorScope().then(t),e.popErrorScope().then(t)}let w=new Float32Array(y),T=Array(s),E=null,D=!!S&&e.features.has(`timestamp-query`),O=s*8,k=Math.max(16,O+(D?16:0)),A=[],j=[];if(S)for(let t=0;t<Cu;t++){let t=e.createBuffer({size:k,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});j.push(t),A.push({buffer:t})}let M=null,N=null;D&&(M=e.createQuerySet({type:`timestamp`,count:2}),N=e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}));let P=!1,F=0,I=0,L=0,R=0,ee=new Map,z=[],B=null,V=[];return{step:te,getNodePosition:ae,setNodePosition:H,pinNode:oe,getGraphRect:se,updateSettings:U,getStats:ce,flush:le,dispose:ue,get settings(){return Object.assign({},a)},_engine:S};function te(e=1){if(P||!S||r.lost||(e=Math.floor(e),!(e>0)))return;let t=A.pop(),n=!!t&&D;S.run(e,n?{querySet:M}:null,t?e=>{e.copyBufferToBuffer(S.pos,0,t.buffer,0,s*8),n&&(e.resolveQuerySet(M,0,2,N,0),e.copyBufferToBuffer(N,0,t.buffer,O,16))}:null),F+=e,t&&ne(t,e,n)}function ne(e,t,n){e.serial=++I,e.steps=F,L=F,e.buffer.mapAsync(GPUMapMode.READ).then(()=>{if(!P){if(re(e,new Float32Array(e.buffer.getMappedRange(0,s*8))),n){let n=new BigUint64Array(e.buffer.getMappedRange(O,16)),r=Number(n[1]-n[0]);n[1]>n[0]&&r<6e10&&ie(r/1e6,t)}else{let t=performance.now();B&&e.steps>B.steps&&ie(t-B.time,e.steps-B.steps),B={time:t,steps:e.steps}}e.buffer.unmap(),A.push(e)}}).catch(()=>{})}function re(e,t){if(e.serial>R){R=e.serial,w.set(t),ee.forEach((t,n)=>{t.serial<=e.serial?ee.delete(n):(w[2*n]=t.x,w[2*n+1]=t.y)});for(let e=0;e<s;e++){let t=T[e];t&&(t.x=w[2*e]+p,t.y=w[2*e+1]+m)}E=null}for(let e=V.length-1;e>=0;e--)V[e].serial<=R&&(V[e].resolve(),V.splice(e,1))}function ie(e,t){z.push({ms:e,steps:t}),z.length>wu&&z.shift()}function ae(e){let t=c.get(e);if(t===void 0)return;let n=v[t],r=T[n];return r||(r={x:w[2*n]+p,y:w[2*n+1]+m},T[n]=r),r}function H(t,n,r){let i=c.get(t);if(i===void 0||P)return;let a=v[i],o=n-p,s=r-m;w[2*a]=o,w[2*a+1]=s;let l=T[a];l&&(l.x=n,l.y=r),E=null,S&&(e.queue.writeBuffer(S.pos,a*8,new Float32Array([o,s])),ee.set(a,{x:o,y:s,serial:I+1}))}function oe(t,n){let r=c.get(t);r!==void 0&&!P&&S&&e.queue.writeBuffer(S.vel,v[r]*16,new Float32Array([0,0,0,+!!n]))}function se(){if(!E){let e=1/0,t=1/0,n=-1/0,r=-1/0;for(let i=0;i<s;i++){let a=w[2*i],o=w[2*i+1];a<e&&(e=a),a>n&&(n=a),o<t&&(t=o),o>r&&(r=o)}E=s?{min_x:e+p,min_y:t+m,max_x:n+p,max_y:r+m}:{min_x:0,min_y:0,max_x:0,max_y:0}}return{min_x:E.min_x,min_y:E.min_y,max_x:E.max_x,max_y:E.max_y}}function U(e){if(P)return;let t=a.integrator===`fire`;Mu(a,e),S&&(S.setParams(a),a.integrator===`fire`&&!t&&S.resetFire())}function ce(){let e=0,t=0;for(let n of z)e+=n.ms,t+=n.steps;return{steps:F,msPerStep:t?e/t:0,source:D?`gpu-timestamps`:`wall-clock`,engine:S?S.kind:`none`,nodes:s,errors:r.errors-i+ +!!C,lost:r.lost}}function le(){if(P||!S||r.lost)return Promise.resolve();if(F>L){let t=e.createBuffer({size:s*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),n=e.createCommandEncoder();n.copyBufferToBuffer(S.pos,0,t,0,s*8),e.queue.submit([n.finish()]);let r={buffer:t,serial:++I};return L=F,t.mapAsync(GPUMapMode.READ).then(()=>{P||re(r,new Float32Array(t.getMappedRange())),t.destroy()}).catch(()=>t.destroy())}if(R>=I)return Promise.resolve();let t=I;return new Promise(e=>V.push({serial:t,resolve:e}))}function ue(){if(!P){P=!0,S&&S.destroy();for(let e of j)e.destroy();M&&M.destroy(),N&&N.destroy(),V.forEach(e=>e.resolve()),V.length=0}}}function Mu(e,t){if(!t)return e;for(let n of Object.keys(Su)){let r=t[n];r!=null&&(n===`integrator`?(r!==`euler`&&r!==`fire`&&console.warn(`Unknown integrator "${r}", using euler`),e.integrator=r===`fire`?`fire`:`euler`):Number.isFinite(+r)&&(e[n]=+r))}return e.maxVelocity>0||(e.maxVelocity=1),e}function Nu(e){let t=new Uint32Array(e);for(let n=0;n<e;n++)t[n]=n;return t}function Pu(e,t){let n=Math.imul(e+1,2654435761)^Math.imul(t,2246822519);return n=Math.imul(n^n>>>16,2146121005),n=Math.imul(n^n>>>15,2221713035),((n^n>>>16)>>>0)/4294967296}function Fu(e,t){let n=e.length;if(n<2)return;let r=1;for(;r<2*n;)r<<=1;let i=new Int32Array(r).fill(-1),a=new Uint32Array(n),o=new Float64Array(2),s=new Uint32Array(o.buffer);for(let c=0;c<n;c++){o[0]=e[c]+0,o[1]=t[c]+0;let n=(Math.imul(s[0]^s[1],2654435761)^Math.imul(s[2]^s[3],2246822519))>>>0;n=(n^n>>>15)&r-1;let l=-1;for(;;){let a=i[n];if(a===-1){i[n]=c;break}if(e[a]===e[c]&&t[a]===t[c]){l=a;break}n=n+1&r-1}if(l>=0){let n=++a[l],r=Math.sqrt(n),i=n*2.399963229728653;e[c]=e[l]+r*Math.cos(i),t[c]=t[l]+r*Math.sin(i)}}}function Iu(e,t){let n=e.length;if(!n)return{x:0,y:0,minX:0,minY:0,side:1};let r=Math.max(1,Math.floor(n/4096)),i=[],a=[];for(let o=0;o<n;o+=r)i.push(e[o]),a.push(t[o]);let o=Float64Array.from(i).sort(),s=Float64Array.from(a).sort(),c=(e,t)=>e[Math.min(e.length-1,Math.max(0,Math.round(t*(e.length-1))))],l=c(o,.001),u=c(o,.999),d=c(s,.001),f=c(s,.999);return{x:c(o,.5),y:c(s,.5),minX:l,minY:d,side:Math.max(u-l,f-d)||1}}function Lu(e,t,n){let r=e.length,i=4096,a=new Float64Array(r);for(let o=0;o<r;o++){let r=Math.min(4095,Math.max(0,Math.floor((e[o]-n.minX)/n.side*i))),s=Math.min(4095,Math.max(0,Math.floor((t[o]-n.minY)/n.side*i))),c=0;for(let e=2048;e>0;e>>=1){let t=+((r&e)>0),n=+((s&e)>0);if(c+=e*e*(3*t^n),n===0){t===1&&(r=e-1-r,s=e-1-s);let n=r;r=s,s=n}}a[o]=c*16777216+o}a.sort();let o=new Uint32Array(r);for(let e=0;e<r;e++)o[a[e]%16777216]=e;return o}var Ru=2432236799,zu=[`timeStep`,`springLength`,`springCoefficient`,`dimensions`,`dragCoefficient`,`gravity`,`theta`,`maxVelocity`,`integrator`,`nbody`];function Bu(e,t={},n={}){let r,i,a,o,s,c=`cpu`,l,u,d=!1,f=!1,p,m=n.stepsPerFrame||1,h=n.placement||`default`,g=``,_=null,v={},y=null,b=Vu();return bl.on(`load-graph`,x),{dispose:te,runLayout:I,updateLayoutSettings:L,setFixedViewBox:R,setStepsPerFrame:k,setPlacement:O,setBackend:A,setPrototype:C,finishPrototype:E,restart:S,getStats:N};function x(e,n){a&&(a.dispose(),M(!1),T(),i.dispose(),a=null,cancelAnimationFrame(p)),a=ee(),r=e,window.graph=r,$c(a,{showGrid:!0,lineColor:4294967056,maxAlpha:16,showCursor:!1}),i=Hl(r,t),D(),w(),c===`webgpu`&&j(),b.reset(),F(),z(),f=!0,p=requestAnimationFrame(B)}function S(){M(!1),T(),i.dispose(),i=Hl(r,t),D(),w(),c===`webgpu`&&j(),b.reset(),F()}function C(e,t){_=e||null,v={...t},r&&S()}function w(){_&&(y=_.attach({layout:i,graph:r,params:{...v},settings:{...t}})||null)}function T(){y&&y.dispose&&y.dispose(),y=null}function E(){y&&y.finish&&y.finish()}function D(){g=``,h===`pivot`&&(g=Yl(r,i,{dimensions:t.dimensions||2,unit:t.springLength||10}))}function O(e){h!==e&&(h=e,r&&S())}function k(e){m=Math.max(1,Math.round(e)||1)}async function A(e){if(e===`webgpu`&&c!==`webgpu`){if((t.dimensions||2)!==2||(l||=await Ou(),!l))return c;c=`webgpu`,r&&j()}else e===`cpu`&&c!==`cpu`&&(c=`cpu`,M(!0));return b.reset(),c}function j(){u=ju(l,r,{settings:t,getInitialPosition:e=>i.getNodePosition(e)})}function M(e){u&&=(e&&r.forEachNode(e=>{let t=u.getNodePosition(e.id);i.setNodePosition(e.id,t.x,t.y)}),u.dispose(),null)}function N(){return{backend:c,nodes:r?r.getNodesCount():0,links:r?r.getLinksCount():0,steps:b.steps,msPerStep:u?u.getStats().msPerStep:b.msPerStep(),placement:g,canFinishPrototype:!!(y&&y.finish)}}function P(){return u||i}function F(){let e=P().getGraphRect(),t=(e.min_x+e.max_x)/2,n=(e.min_y+e.max_y)/2,r=Math.max(e.max_x-e.min_x,e.max_y-e.min_y)*.6;(!Number.isFinite(r)||r<100.8)&&(t=n=0,r=100.8),a.setViewBox({left:t-r,top:n-r,right:t+r,bottom:n+r})}function I(e){f=e}function L(e){let n=zu,a=t&&t.dimensions||2;if(t=n.reduce((t,n)=>(t[n]=e[n],t),{}),i){if(u&&t.dimensions!==2&&(c=`cpu`,M(!0)),t.dimensions!==a){let e=i;T(),i=Hl(r,t),r.forEachNode(n=>{let r=e.getNodePosition(n.id),o=Object.keys(r).map(e=>r[e]);for(let e=a;e<t.dimensions;++e)o.push(Math.random());o.unshift(n.id),i.setNodePosition.apply(i,o)}),e.dispose(),w()}else n.forEach(e=>{i.simulator[e](t[e])}),u&&u.updateSettings(t)}}function R(e){d=e}function ee(){let t=jc(e);return t.setClearColor(12/255,41/255,82/255,1),t}function z(){o=new gl(a.getGL(),{capacity:r.getNodesCount()}),r.forEachNode(e=>{var t=P().getNodePosition(e.id);let n=1;e.data&&e.data.size?n=e.data.size:(e.data||={},e.data.size=n),e.ui={size:n,position:[t.x,t.y,t.z||0],color:Ru},e.uiId=o.add(e.ui)}),s=new hl(a.getGL(),{capacity:r.getLinksCount()}),r.forEachLink(e=>{var t=P().getNodePosition(e.fromId),n=P().getNodePosition(e.toId);e.ui={from:[t.x,t.y,t.z||0],to:[n.x,n.y,n.z||0],color:4294967056},e.uiId=s.add(e.ui)}),a.appendChild(s),a.appendChild(o)}function B(){if(p=requestAnimationFrame(B),u&&u.getStats().lost&&(c=`cpu`,M(!0)),f){let e=performance.now();if(u)u.step(m);else for(let e=0;e<m;++e)i.step();if(b.record(performance.now()-e,m),d){let e=P().getGraphRect();a.setViewBox({left:e.min_x,top:e.min_y,right:e.max_x,bottom:e.max_y})}}V(),a.renderFrame()}function V(){let e=[`x`,`y`,`z`],t=P(),n=!u&&y&&y.nodeColor;r.forEachNode(r=>{let i=t.getNodePosition(r.id),a=r.ui.position;for(let t=0;t<3;++t)a[t]=i[e[t]]||0;r.ui.color=n&&n(r.id)||Ru,o.update(r.uiId,r.ui)}),r.forEachLink(n=>{var r=t.getNodePosition(n.fromId),i=t.getNodePosition(n.toId);let{from:a,to:o}=n.ui;for(let t=0;t<3;++t)a[t]=r[e[t]]||0,o[t]=i[e[t]]||0;s.update(n.uiId,n.ui)})}function te(){cancelAnimationFrame(p),M(!1),T(),a.dispose(),bl.off(`load-graph`,x)}}function Vu(){let e=[],t={steps:0,record(n,r){t.steps+=r,e.push(n/r),e.length>30&&e.shift()},reset(){t.steps=0,e=[]},msPerStep(){return e.length===0?0:e.reduce((e,t)=>e+t,0)/e.length}};return t}function Hu(){return`Miserables.Binary.Grid 100x100 (10k).HB/blckhole.HB/lshp1882.Bai/dw256A.HB/dwt_419.HB/plat1919.Nasa/barth5.Gset/G11.Pothen/sphere3.Cube 20x20x20 (8k).GHS_indef/laser.Bai/olm1000.Binary tree (8k).HB/1138_bus.Bai/qh882.Hamm/add32.Scale-free tree (10k).Barabasi-Albert (20k).Barabasi-Albert (100k).HB/fs_541_1.Meszaros/gams30a.JGD_Homology/cis-n4c6-b15.Rajat/rajat14.HB/west0497.LPnetlib/lp_share2b.LPnetlib/lp_ship12s.Pajek/SmallW.Groups 8x250 (2k).Pajek/CSphd.Bai/tols2000.Barabasi/NotreDame_yeast.JGD_SPG/08blocks.HB/dwt_512.Many pieces (300).Pajek/USpowerGrid.Pajek/USAir97.Pajek/Erdos02.MathWorks/Harvard500.Sandia/oscil_dcop_01.Pajek/dictionary28.Watts-Strogatz (10k).Gset/G43.HB/bcsstk02.Benchmark: starOfStars.Benchmark: megaStars.Benchmark: hubLeaves5k.Benchmark: EVA.Benchmark: paTree3k.Benchmark: yeast.Benchmark: sciMet.Benchmark: erdos992.Benchmark: CSphd.Benchmark: protein.Benchmark: caterpillars.Benchmark: forest5k.Benchmark: gridIsolates.Benchmark: npmMix4.Benchmark: communities.Benchmark: sbm8x50.Benchmark: grid20.Benchmark: binTree8.Benchmark: cliqueCircle.Benchmark: ba500.Benchmark: er1000.Benchmark: rgg1500.Benchmark: powerGrid.Benchmark: java`.split(`.`)}var Uu=o(((e,t)=>{t.exports={nodes:[{name:`Myriel`,group:1},{name:`Napoleon`,group:1},{name:`Mlle.Baptistine`,group:1},{name:`Mme.Magloire`,group:1},{name:`CountessdeLo`,group:1},{name:`Geborand`,group:1},{name:`Champtercier`,group:1},{name:`Cravatte`,group:1},{name:`Count`,group:1},{name:`OldMan`,group:1},{name:`Labarre`,group:2},{name:`Valjean`,group:2},{name:`Marguerite`,group:3},{name:`Mme.deR`,group:2},{name:`Isabeau`,group:2},{name:`Gervais`,group:2},{name:`Tholomyes`,group:3},{name:`Listolier`,group:3},{name:`Fameuil`,group:3},{name:`Blacheville`,group:3},{name:`Favourite`,group:3},{name:`Dahlia`,group:3},{name:`Zephine`,group:3},{name:`Fantine`,group:3},{name:`Mme.Thenardier`,group:4},{name:`Thenardier`,group:4},{name:`Cosette`,group:5},{name:`Javert`,group:4},{name:`Fauchelevent`,group:0},{name:`Bamatabois`,group:2},{name:`Perpetue`,group:3},{name:`Simplice`,group:2},{name:`Scaufflaire`,group:2},{name:`Woman1`,group:2},{name:`Judge`,group:2},{name:`Champmathieu`,group:2},{name:`Brevet`,group:2},{name:`Chenildieu`,group:2},{name:`Cochepaille`,group:2},{name:`Pontmercy`,group:4},{name:`Boulatruelle`,group:6},{name:`Eponine`,group:4},{name:`Anzelma`,group:4},{name:`Woman2`,group:5},{name:`MotherInnocent`,group:0},{name:`Gribier`,group:0},{name:`Jondrette`,group:7},{name:`Mme.Burgon`,group:7},{name:`Gavroche`,group:8},{name:`Gillenormand`,group:5},{name:`Magnon`,group:5},{name:`Mlle.Gillenormand`,group:5},{name:`Mme.Pontmercy`,group:5},{name:`Mlle.Vaubois`,group:5},{name:`Lt.Gillenormand`,group:5},{name:`Marius`,group:8},{name:`BaronessT`,group:5},{name:`Mabeuf`,group:8},{name:`Enjolras`,group:8},{name:`Combeferre`,group:8},{name:`Prouvaire`,group:8},{name:`Feuilly`,group:8},{name:`Courfeyrac`,group:8},{name:`Bahorel`,group:8},{name:`Bossuet`,group:8},{name:`Joly`,group:8},{name:`Grantaire`,group:8},{name:`MotherPlutarch`,group:9},{name:`Gueulemer`,group:4},{name:`Babet`,group:4},{name:`Claquesous`,group:4},{name:`Montparnasse`,group:4},{name:`Toussaint`,group:5},{name:`Child1`,group:10},{name:`Child2`,group:10},{name:`Brujon`,group:4},{name:`Mme.Hucheloup`,group:8}],links:[{source:1,target:0,value:1},{source:2,target:0,value:8},{source:3,target:0,value:10},{source:3,target:2,value:6},{source:4,target:0,value:1},{source:5,target:0,value:1},{source:6,target:0,value:1},{source:7,target:0,value:1},{source:8,target:0,value:2},{source:9,target:0,value:1},{source:11,target:10,value:1},{source:11,target:3,value:3},{source:11,target:2,value:3},{source:11,target:0,value:5},{source:12,target:11,value:1},{source:13,target:11,value:1},{source:14,target:11,value:1},{source:15,target:11,value:1},{source:17,target:16,value:4},{source:18,target:16,value:4},{source:18,target:17,value:4},{source:19,target:16,value:4},{source:19,target:17,value:4},{source:19,target:18,value:4},{source:20,target:16,value:3},{source:20,target:17,value:3},{source:20,target:18,value:3},{source:20,target:19,value:4},{source:21,target:16,value:3},{source:21,target:17,value:3},{source:21,target:18,value:3},{source:21,target:19,value:3},{source:21,target:20,value:5},{source:22,target:16,value:3},{source:22,target:17,value:3},{source:22,target:18,value:3},{source:22,target:19,value:3},{source:22,target:20,value:4},{source:22,target:21,value:4},{source:23,target:16,value:3},{source:23,target:17,value:3},{source:23,target:18,value:3},{source:23,target:19,value:3},{source:23,target:20,value:4},{source:23,target:21,value:4},{source:23,target:22,value:4},{source:23,target:12,value:2},{source:23,target:11,value:9},{source:24,target:23,value:2},{source:24,target:11,value:7},{source:25,target:24,value:13},{source:25,target:23,value:1},{source:25,target:11,value:12},{source:26,target:24,value:4},{source:26,target:11,value:31},{source:26,target:16,value:1},{source:26,target:25,value:1},{source:27,target:11,value:17},{source:27,target:23,value:5},{source:27,target:25,value:5},{source:27,target:24,value:1},{source:27,target:26,value:1},{source:28,target:11,value:8},{source:28,target:27,value:1},{source:29,target:23,value:1},{source:29,target:27,value:1},{source:29,target:11,value:2},{source:30,target:23,value:1},{source:31,target:30,value:2},{source:31,target:11,value:3},{source:31,target:23,value:2},{source:31,target:27,value:1},{source:32,target:11,value:1},{source:33,target:11,value:2},{source:33,target:27,value:1},{source:34,target:11,value:3},{source:34,target:29,value:2},{source:35,target:11,value:3},{source:35,target:34,value:3},{source:35,target:29,value:2},{source:36,target:34,value:2},{source:36,target:35,value:2},{source:36,target:11,value:2},{source:36,target:29,value:1},{source:37,target:34,value:2},{source:37,target:35,value:2},{source:37,target:36,value:2},{source:37,target:11,value:2},{source:37,target:29,value:1},{source:38,target:34,value:2},{source:38,target:35,value:2},{source:38,target:36,value:2},{source:38,target:37,value:2},{source:38,target:11,value:2},{source:38,target:29,value:1},{source:39,target:25,value:1},{source:40,target:25,value:1},{source:41,target:24,value:2},{source:41,target:25,value:3},{source:42,target:41,value:2},{source:42,target:25,value:2},{source:42,target:24,value:1},{source:43,target:11,value:3},{source:43,target:26,value:1},{source:43,target:27,value:1},{source:44,target:28,value:3},{source:44,target:11,value:1},{source:45,target:28,value:2},{source:47,target:46,value:1},{source:48,target:47,value:2},{source:48,target:25,value:1},{source:48,target:27,value:1},{source:48,target:11,value:1},{source:49,target:26,value:3},{source:49,target:11,value:2},{source:50,target:49,value:1},{source:50,target:24,value:1},{source:51,target:49,value:9},{source:51,target:26,value:2},{source:51,target:11,value:2},{source:52,target:51,value:1},{source:52,target:39,value:1},{source:53,target:51,value:1},{source:54,target:51,value:2},{source:54,target:49,value:1},{source:54,target:26,value:1},{source:55,target:51,value:6},{source:55,target:49,value:12},{source:55,target:39,value:1},{source:55,target:54,value:1},{source:55,target:26,value:21},{source:55,target:11,value:19},{source:55,target:16,value:1},{source:55,target:25,value:2},{source:55,target:41,value:5},{source:55,target:48,value:4},{source:56,target:49,value:1},{source:56,target:55,value:1},{source:57,target:55,value:1},{source:57,target:41,value:1},{source:57,target:48,value:1},{source:58,target:55,value:7},{source:58,target:48,value:7},{source:58,target:27,value:6},{source:58,target:57,value:1},{source:58,target:11,value:4},{source:59,target:58,value:15},{source:59,target:55,value:5},{source:59,target:48,value:6},{source:59,target:57,value:2},{source:60,target:48,value:1},{source:60,target:58,value:4},{source:60,target:59,value:2},{source:61,target:48,value:2},{source:61,target:58,value:6},{source:61,target:60,value:2},{source:61,target:59,value:5},{source:61,target:57,value:1},{source:61,target:55,value:1},{source:62,target:55,value:9},{source:62,target:58,value:17},{source:62,target:59,value:13},{source:62,target:48,value:7},{source:62,target:57,value:2},{source:62,target:41,value:1},{source:62,target:61,value:6},{source:62,target:60,value:3},{source:63,target:59,value:5},{source:63,target:48,value:5},{source:63,target:62,value:6},{source:63,target:57,value:2},{source:63,target:58,value:4},{source:63,target:61,value:3},{source:63,target:60,value:2},{source:63,target:55,value:1},{source:64,target:55,value:5},{source:64,target:62,value:12},{source:64,target:48,value:5},{source:64,target:63,value:4},{source:64,target:58,value:10},{source:64,target:61,value:6},{source:64,target:60,value:2},{source:64,target:59,value:9},{source:64,target:57,value:1},{source:64,target:11,value:1},{source:65,target:63,value:5},{source:65,target:64,value:7},{source:65,target:48,value:3},{source:65,target:62,value:5},{source:65,target:58,value:5},{source:65,target:61,value:5},{source:65,target:60,value:2},{source:65,target:59,value:5},{source:65,target:57,value:1},{source:65,target:55,value:2},{source:66,target:64,value:3},{source:66,target:58,value:3},{source:66,target:59,value:1},{source:66,target:62,value:2},{source:66,target:65,value:2},{source:66,target:48,value:1},{source:66,target:63,value:1},{source:66,target:61,value:1},{source:66,target:60,value:1},{source:67,target:57,value:3},{source:68,target:25,value:5},{source:68,target:11,value:1},{source:68,target:24,value:1},{source:68,target:27,value:1},{source:68,target:48,value:1},{source:68,target:41,value:1},{source:69,target:25,value:6},{source:69,target:68,value:6},{source:69,target:11,value:1},{source:69,target:24,value:1},{source:69,target:27,value:2},{source:69,target:48,value:1},{source:69,target:41,value:1},{source:70,target:25,value:4},{source:70,target:69,value:4},{source:70,target:68,value:4},{source:70,target:11,value:1},{source:70,target:24,value:1},{source:70,target:27,value:1},{source:70,target:41,value:1},{source:70,target:58,value:1},{source:71,target:27,value:1},{source:71,target:69,value:2},{source:71,target:68,value:2},{source:71,target:70,value:2},{source:71,target:11,value:1},{source:71,target:48,value:1},{source:71,target:41,value:1},{source:71,target:25,value:1},{source:72,target:26,value:2},{source:72,target:27,value:1},{source:72,target:11,value:1},{source:73,target:48,value:2},{source:74,target:48,value:2},{source:74,target:73,value:3},{source:75,target:69,value:3},{source:75,target:68,value:3},{source:75,target:25,value:3},{source:75,target:48,value:1},{source:75,target:41,value:1},{source:75,target:70,value:1},{source:75,target:71,value:1},{source:76,target:64,value:1},{source:76,target:65,value:1},{source:76,target:66,value:1},{source:76,target:63,value:1},{source:76,target:62,value:1},{source:76,target:48,value:1},{source:76,target:58,value:1}]}})),Wu=o(((e,t)=>{function n(e){i(e);let t=r(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e}function r(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function i(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}t.exports=n})),Gu=o(((e,t)=>{t.exports=r;var n=Wu();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=L,m=L,h=L,g=L,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:z,forEachLinkedNode:P,forEachLink:N,beginUpdate:h,endUpdate:g,clear:M,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=R,_.endUpdate=g=ee,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function M(){h(),z(function(e){C(e.id)}),g()}function N(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function P(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?I(r.links,e,t):F(r.links,e,t)}function F(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function I(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function L(){}function R(){u+=1}function ee(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function z(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),Ku=o(((e,t)=>{var n=Uu(),r=Gu();t.exports=i(),t.exports.create=i;function i(){for(var e=r(),t=0;t<n.nodes.length;++t)e.addNode(t,n.nodes[t]);for(t=0;t<n.links.length;++t){var i=n.links[t];e.addLink(i.source,i.target,i.value)}return e}})),qu=o(((e,t,n)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.createGraph=r())})(n,(function(){function e(e){n(e);let r=t(e);return e.on=r.on,e.off=r.off,e.fire=r.fire,e}function t(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function n(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}function r(t){if(t||={},`uniqueLinkId`in t&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),t.multigraph=t.uniqueLinkId),t.multigraph===void 0&&(t.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var n=new Map,r=new Map,c={},l=0,u=t.multigraph?T:w,d=[],f=R,p=R,m=R,h=R,g={version:20,addNode:b,addLink:C,removeLink:k,removeNode:S,getNode:x,getNodeCount:E,getLinkCount:D,getEdgeCount:D,getLinksCount:D,getNodesCount:E,getLinks:O,forEachNode:B,forEachLinkedNode:F,forEachLink:P,beginUpdate:m,endUpdate:h,clear:N,hasLink:j,hasNode:x,getLink:j,getLinkById:M};return e(g),_(),g;function _(){var e=g.on;g.on=t;function t(){return g.beginUpdate=m=ee,g.endUpdate=h=z,f=v,p=y,g.on=e,e.apply(g,arguments)}}function v(e,t){d.push({link:e,changeType:t})}function y(e,t){d.push({node:e,changeType:t})}function b(e,t){if(e===void 0)throw Error(`Invalid node identifier`);m();var r=x(e);return r?(r.data=t,p(r,`update`)):(r=new i(e,t),p(r,`add`)),n.set(e,r),h(),r}function x(e){return n.get(e)}function S(e){var t=x(e);if(!t)return!1;m();var r=t.links;return r&&(r.forEach(A),t.links=null),n.delete(e),p(t,`remove`),h(),!0}function C(e,t,n){m();var i=x(e)||b(e),o=x(t)||b(t),s=u(e,t,n),c=r.has(s.id);return r.set(s.id,s),a(i,s),e!==t&&a(o,s),f(s,c?`update`:`add`),h(),s}function w(e,t,n){var i=s(e,t),a=r.get(i);return a?(a.data=n,a):new o(e,t,n,i)}function T(e,t,n){var r=s(e,t),i=c.hasOwnProperty(r);if(i||j(e,t)){i||(c[r]=0);var a=`@`+ ++c[r];r=s(e+a,t+a)}return new o(e,t,n,r)}function E(){return n.size}function D(){return r.size}function O(e){var t=x(e);return t?t.links:null}function k(e,t){return t!==void 0&&(e=j(e,t)),A(e)}function A(e){if(!e||!r.get(e.id))return!1;m(),r.delete(e.id);var t=x(e.fromId),n=x(e.toId);return t&&t.links.delete(e),n&&n.links.delete(e),f(e,`remove`),h(),!0}function j(e,t){if(e!==void 0&&t!==void 0)return r.get(s(e,t))}function M(e){if(e!==void 0)return r.get(e)}function N(){m(),B(function(e){S(e.id)}),h()}function P(e){if(typeof e==`function`)for(var t=r.values(),n=t.next();!n.done;){if(e(n.value))return!0;n=t.next()}}function F(e,t,n){var r=x(e);if(r&&r.links&&typeof t==`function`)return n?L(r.links,e,t):I(r.links,e,t)}function I(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===t?s.toId:s.fromId;if(i=r(n.get(c),s),i)return!0;o=a.next()}}function L(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===t&&(i=r(n.get(s.toId),s),i))return!0;o=a.next()}}function R(){}function ee(){l+=1}function z(){--l,l===0&&d.length>0&&(g.fire(`changed`,d),d.length=0)}function B(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}}function i(e,t){this.id=e,this.links=null,this.data=t}function a(e,t){e.links?e.links.add(t):e.links=new Set([t])}function o(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function s(e,t){return e.toString()+`👉 `+t.toString()}return r}))})),Ju=o(((e,t)=>{var n=qu(),r=Ku().create;t.exports=i(n),t.exports.factory=i;function i(e){return{ladder:t,complete:i,completeBipartite:a,balancedBinTree:l,balancedBinaryTree:l,binaryTree:l,binTree:l,path:o,circularLadder:n,grid:s,grid3:c,noLinks:u,wattsStrogatz:f,cliqueCircle:d,miserables:r};function t(t){if(!t||t<0)throw Error(`Invalid number of nodes`);for(var n=e(),r=0;r<t-1;++r)n.addLink(r,r+1),n.addLink(t+r,t+r+1),n.addLink(r,t+r);return n.addLink(t-1,2*t-1),n}function n(e){if(!e||e<0)throw Error(`Invalid number of nodes`);var n=t(e);return n.addLink(0,e-1),n.addLink(e,2*e-1),n}function i(t){if(!t||t<1)throw Error(`At least two nodes are expected for complete graph`);for(var n=e(),r=0,i;r<t;++r)for(i=r+1;i<t;++i)r!==i&&n.addLink(r,i);return n}function a(t,n){if(!t||!n||t<0||n<0)throw Error(`Graph dimensions are invalid. Number of nodes in each partition should be greater than 0`);for(var r=e(),i=0,a;i<t;++i)for(a=t;a<t+n;++a)r.addLink(i,a);return r}function o(t){if(!t||t<0)throw Error(`Invalid number of nodes`);var n=e(),r;for(n.addNode(0),r=1;r<t;++r)n.addLink(r-1,r);return n}function s(t,n){if(t<1||n<1)throw Error(`Invalid number of nodes in grid graph`);var r=e(),i,a;if(t===1&&n===1)return r.addNode(0),r;for(i=0;i<t;++i)for(a=0;a<n;++a){var o=i+a*t;i>0&&r.addLink(o,i-1+a*t),a>0&&r.addLink(o,i+(a-1)*t)}return r}function c(t,n,r){if(t<1||n<1||r<1)throw Error(`Invalid number of nodes in grid3 graph`);var i=e(),a,o,s;if(t===1&&n===1&&r===1)return i.addNode(0),i;for(s=0;s<r;++s)for(a=0;a<t;++a)for(o=0;o<n;++o){var c=s*t*n,l=a+o*t+c;a>0&&i.addLink(l,a-1+o*t+c),o>0&&i.addLink(l,a+(o-1)*t+c),s>0&&i.addLink(l,a+o*t+(s-1)*t*n)}return i}function l(t){if(t===void 0||t<0)throw Error(`Invalid number of levels in balanced tree`);var n=e(),r=2**t,i;for(t===0&&n.addNode(1),i=1;i<r;++i){var a=i,o=a*2,s=a*2+1;n.addLink(a,o),n.addLink(a,s)}return n}function u(t){if(t<0)throw Error(`Number of nodes should be >= 0`);for(var n=e(),r=0;r<t;++r)n.addNode(r);return n}function d(t,n){if(t<1)throw Error(`Invalid number of cliqueCount in cliqueCircle`);if(n<1)throw Error(`Invalid number of cliqueSize in cliqueCircle`);for(var r=e(),i=0;i<t;++i)a(n,i*n),i>0&&r.addLink(i*n,i*n-1);return r.addLink(0,r.getNodesCount()-1),r;function a(e,t){for(var n=0;n<e;++n)r.addNode(n+t);for(var n=0;n<e;++n)for(var i=n+1;i<e;++i)r.addLink(n+t,i+t)}}function f(t,n,r,i){if(n>=t)throw Error("Choose smaller `k`. It cannot be larger than number of nodes `n`");for(var a=Sl().random(i||42),o=e(),s=0,c;s<t;++s)o.addNode(s);for(var l=Math.floor(n/2+1),u=1;u<l;++u)for(s=0;s<t;++s)c=(u+s)%t,o.addLink(s,c);for(u=1;u<l;++u)for(s=0;s<t;++s)if(a.nextDouble()<r){var d=s;c=(u+s)%t;var f=a.next(t),p=f===d||o.hasLink(d,f);if(p&&o.getLinks(d).length===t-1)continue;for(;p;)f=a.next(t),p=f===d||o.hasLink(d,f);var m=o.hasLink(d,c);o.removeLink(m),o.addLink(d,f)}return o}}})),Yu=l(Ku(),1),Xu=l(Ju(),1),Zu=rd(),Qu={"Grid 100x100 (10k)":()=>Xu.default.grid(100,100),"Binary tree (8k)":()=>Xu.default.balancedBinTree(12),"Watts-Strogatz (10k)":()=>Xu.default.wattsStrogatz(1e4,6,.05),"Barabasi-Albert (20k)":()=>id(2e4,2),"Barabasi-Albert (100k)":()=>id(1e5,2),"Scale-free tree (10k)":()=>id(1e4,1),"Cube 20x20x20 (8k)":()=>Xu.default.grid3(20,20,20),"Groups 8x250 (2k)":()=>ad(8,250),"Many pieces (300)":()=>od(300)},$u=`Benchmark: `;function ed(e){if(e===`Miserables`)return Promise.resolve(Yu.default);if(e===`Binary`)return Promise.resolve(Xu.default.balancedBinTree(10));if(Qu[e])return Promise.resolve(Qu[e]());if(e.startsWith($u))return td(e.slice(11));let t=Zu.get(e);return t?Promise.resolve(nd(t.links,t.recordsPerEdge)):fetch(`https://s3.amazonaws.com/yasiv_uf/out/${e}/index.js`,{mode:`cors`}).then(e=>e.json()).then(t=>(Zu.put(e,t),nd(t.links,t.recordsPerEdge)))}function td(e){return fetch(`./graphs/${e}.json`).then(e=>e.json()).then(({n:e,edges:t})=>{let n=Ul();for(let t=0;t<e;t++)n.addNode(t);for(let e=0;e+1<t.length;e+=2)n.addLink(t[e],t[e+1]);return n})}function nd(e,t){let n=Ul();for(var r=0;r<e.length-1;r+=t)n.addLink(e[r],e[r+1]);return n}function rd(){var e=`localStorage`in window;return{get:function(t){if(!e)return null;var n=JSON.parse(window.localStorage.getItem(t));return!n||n.recordsPerEdge===void 0?null:n},put:function(t,n){if(!e)return!1;try{window.localStorage.setItem(t,JSON.stringify(n))}catch{window.localStorage.clear()}}}}function id(e,t){let n=sd(42),r=Ul(),i=[];for(let e=0;e<=t;e++)for(let t=0;t<e;t++)r.addLink(e,t),i.push(e,t);for(let a=t+1;a<e;a++){let e=new Set;for(;e.size<t;)e.add(i[Math.floor(n()*i.length)]);e.forEach(e=>{r.addLink(a,e),i.push(a,e)})}return r}function ad(e,t){let n=sd(7),r=e=>Math.floor(n()*e),i=Ul();for(let a=0;a<e*t;a++){let o=Math.floor(a/t);for(let e=0;e<3;e++){let e=o*t+r(t);e!==a&&i.addLink(a,e)}n()<.12&&i.addLink(a,r(e*t))}return i}function od(e){let t=sd(42),n=e=>Math.floor(t()*e),r=Ul(),i=0;for(let t=0;t<e;t++){let e=2+Math.floor(400/(1+n(60))),t=i;i+=e;for(let i=1;i<e;i++)r.addLink(t+i,t+n(i));for(let i=0;i<e/10;i++){let i=t+n(e),a=t+n(e);i!==a&&r.addLink(i,a)}}return r}function sd(e){return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}var cd=o(((e,t)=>{t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}})),ld=o(((e,t)=>{t.exports=n;function n(e){var t=[],n=e;return{dispose:a,onChanged:o,set:i,get:r};function r(){return n}function i(e){n=e,setTimeout(function(){s(e)},0)}function a(){t=[]}function o(e){if(typeof e!=`function`)throw Error(`changeCallback should be a function`);t.push(e)}function s(e){t.forEach(function(t){t(e)})}}})),ud=o(((e,t)=>{t.exports={parse:r,stringify:n};function n(e){return e?Object.keys(e).map(t).join(`&`):``;function t(t){var n=e[t],r=a(t);return n!==void 0&&(r+=`=`+i(n)),r}}function r(e){var t=Object.create(null);return e&&e.split(`&`).forEach(n),t;function n(e){if(e){var n=e.split(`=`);t[decodeURIComponent(n[0])]=s(n[1])}}}function i(e){return e instanceof Date&&(e=e.toISOString()),a(e)}function a(e){return encodeURIComponent(e).replace(/[()]/g,o)}function o(e){return e===`)`?`%29`:e===`(`?`%28`:e}function s(e){return e=decodeURIComponent(e),e===``?e:isNaN(e)?c(e)?e===`true`:l(e)?new Date(e):e:parseFloat(e)}function c(e){return e===`true`||e===`false`}function l(e){return e&&e.match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)}})),dd=o(((e,t)=>{t.exports=i;var n=ld(),r=ud();function i(e,t){if(typeof window>`u`)return n(e);var i=[],a=t&&t.useSearch,o=a?`?`:`#?`;return t.rewriteHashToSearch&&c(),s(),{onChanged:u,dispose:d,set:l,get:m,rewriteHashToSearch:c};function s(){var t=m(),n=!1;typeof e==`object`&&e&&Object.keys(e).forEach(function(r){r in t||(t[r]=e[r],n=!0)}),n&&l(t)}function c(){var e=Object.create(null),t=window.location.search;t&&(e=Object.assign(e,r.parse(t.substr(1))));var n=window.location.hash;n&&(e=Object.assign(e,r.parse(n.substr(2)))),l(e)}function l(e){var t=o+r.stringify(e);a&&window.location.hash&&(t+=window.location.hash),window.history?window.history.replaceState(void 0,void 0,t):window.location.replace(t)}function u(e){if(typeof e!=`function`)throw Error(`changeCallback needs to be a function`);i.length===0&&window.addEventListener(`hashchange`,f,!1),i.push(e)}function d(){i.length!==0&&(i=[],window.removeEventListener(`hashchange`,f,!1))}function f(){p(m())}function p(e){for(var t=0;t<i.length;++t){var n=i[t];n(e)}}function m(){var e=((a?window.location.search:window.location.hash)||o).substr(o.length);return r.parse(e)}}})),fd=l(o(((e,t)=>{t.exports=a;var n=cd(),r=dd();a.instance=o;var i;function a(e,t){t||={};var i=t.history||r(e,t);s(i),i.onChanged(g);var a=i.get()||Object.create(null),o={get:p,set:m,unset:h,setIfEmpty:_,dispose:f,onChange:l,offChange:u,getHistoryObject:d},c=n({});return o;function l(e,t){c.on(`change`,e,t)}function u(e,t){c.off(`change`,e,t)}function d(){return i}function f(){i.dispose(),c.off()}function p(e){return e===void 0?a:a[e]}function m(e,t){var n=typeof e;return n===`object`?Object.keys(e).forEach(function(t){a[t]=e[t]}):n===`string`&&(a[e]=t),i.set(a),o}function h(e){if(e in a)return delete a[e],i.set(a),o}function g(e){a=e,c.fire(`change`,a)}function _(e,t){if(typeof e==`object`&&Object.keys(e).forEach(function(t){t in a||(a[t]=e[t])}),!(e in a))return a[e]=t,i.set(a),o}}function o(e,t){return i?e&&i.setIfEmpty(e):i=a(e,t),i}function s(e){if(!e)throw Error(`history is required`);if(typeof e.dispose!=`function`)throw Error(`dispose is required`);if(typeof e.onChanged!=`function`)throw Error(`onChanged is required`)}}))()),pd=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},md={emits:[`show`],methods:{show(){this.$emit(`show`)}}};function hd(e,t,n,r,i,a){return Z(),Wi(`a`,{onClick:t[0]||=jo((...e)=>a.show&&a.show(...e),[`prevent`]),class:`help-icon`,href:`#`,title:`Click for more details`},[...t[1]||=[Q(`svg`,{version:`1.1`,xmlns:`http://www.w3.org/2000/svg`,"xmlns:xlink":`http://www.w3.org/1999/xlink`,width:`9`,height:`14`,viewBox:`0 0 9 14`,fill:`#267fcd`},[Q(`path`,{d:`M5.5 9.812v1.875q0 0.125-0.094 0.219t-0.219 0.094h-1.875q-0.125 0-0.219-0.094t-0.094-0.219v-1.875q0-0.125 0.094-0.219t0.219-0.094h1.875q0.125 0 0.219 0.094t0.094 0.219zM7.969 5.125q0 0.422-0.121 0.789t-0.273 0.598-0.43 0.465-0.449 0.34-0.477 0.277q-0.32 0.18-0.535 0.508t-0.215 0.523q0 0.133-0.094 0.254t-0.219 0.121h-1.875q-0.117 0-0.199-0.145t-0.082-0.293v-0.352q0-0.648 0.508-1.223t1.117-0.848q0.461-0.211 0.656-0.438t0.195-0.594q0-0.328-0.363-0.578t-0.84-0.25q-0.508 0-0.844 0.227-0.273 0.195-0.836 0.898-0.102 0.125-0.242 0.125-0.094 0-0.195-0.062l-1.281-0.977q-0.102-0.078-0.121-0.195t0.043-0.219q1.25-2.078 3.625-2.078 0.625 0 1.258 0.242t1.141 0.648 0.828 0.996 0.32 1.238z`})],-1)]])}var gd=pd(md,[[`render`,hd]]),_d={components:{HelpIcon:gd},emits:[`update:modelValue`],props:{label:String,modelValue:Number,step:{default:`0.1`,type:String},disabled:Boolean,note:String},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){e!==parseFloat(this.inputValue)&&(this.inputValue=e)},inputValue(e){this.$emit(`update:modelValue`,parseFloat(e))}}},vd={class:`row`},yd={class:`col`},bd={class:`col`},xd=[`step`,`disabled`],Sd={key:0,class:`row note`},Cd={key:1,class:`row help`};function wd(e,t,n,r,i,a){let o=pr(`help-icon`);return Z(),Wi(`div`,{class:ue([`block`,{inactive:n.disabled}])},[Q(`div`,vd,[Q(`div`,yd,be(n.label),1),Q(`div`,bd,[Dn(Q(`input`,{type:`number`,step:n.step,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled,onFocus:t[1]||=(...e)=>a.selectAll&&a.selectAll(...e),autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`},null,40,xd),[[xo,i.inputValue]])]),Xi(o,{onShow:t[2]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),n.note?(Z(),Wi(`div`,Sd,be(n.note),1)):ea(``,!0),i.helpVisible?(Z(),Wi(`div`,Cd,[vr(e.$slots,`default`)])):ea(``,!0)],2)}var Td=pd(_d,[[`render`,wd]]),Ed={components:{HelpIcon:gd},emits:[`update:modelValue`],props:{label:String,modelValue:Boolean},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{inputValue(e){this.$emit(`update:modelValue`,e)}}},Dd={class:`block`},Od={class:`row`},kd={class:`col`},Ad={class:`col`},jd={key:0,class:`row help`};function Md(e,t,n,r,i,a){let o=pr(`help-icon`);return Z(),Wi(`div`,Dd,[Q(`div`,Od,[Q(`div`,kd,be(n.label),1),Q(`div`,Ad,[Dn(Q(`input`,{type:`checkbox`,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e},null,512),[[So,i.inputValue]])]),Xi(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),i.helpVisible?(Z(),Wi(`div`,jd,[vr(e.$slots,`default`)])):ea(``,!0)])}var Nd=pd(Ed,[[`render`,Md]]),Pd={components:{HelpIcon:gd},emits:[`update:modelValue`],props:{label:String,modelValue:String,disabled:Boolean,note:String,options:Array},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){this.inputValue=e},inputValue(e){this.$emit(`update:modelValue`,e)}}},Fd={class:`row`},Id={class:`col`},Ld={class:`col`},Rd=[`disabled`],zd=[`value`,`disabled`],Bd={key:0,class:`row note`},Vd={key:1,class:`row help`};function Hd(e,t,n,r,i,a){let o=pr(`help-icon`);return Z(),Wi(`div`,{class:ue([`block`,{inactive:n.disabled}])},[Q(`div`,Fd,[Q(`div`,Id,be(n.label),1),Q(`div`,Ld,[Dn(Q(`select`,{"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled},[(Z(!0),Wi(Pi,null,_r(n.options,e=>(Z(),Wi(`option`,{key:e.value,value:e.value,disabled:e.disabled},be(e.label),9,zd))),128))],8,Rd),[[wo,i.inputValue]])]),Xi(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),n.note?(Z(),Wi(`div`,Bd,be(n.note),1)):ea(``,!0),i.helpVisible?(Z(),Wi(`div`,Vd,[vr(e.$slots,`default`)])):ea(``,!0)],2)}var Ud=pd(Pd,[[`render`,Hd]]),Wd=6;function Gd(e,t){let n=e.bodies,r=e.springs,i=e.settings,a=t.reach*i.springLength,o=!!t.fadeAll,s=Wd*a,c=0,l=-1,u,d,f,p,m=0,h=0,g,_,v,y,b,x,S,C,w,T,E,D;return{update:O};function O(){if(n.length===0)return;(n.length!==c||r.length!==l)&&A(),j();let e=i.gravity,t=i.theta,a=i.integrator!==`fire`,m=i.dragCoefficient;for(let r=0;r<c;r++){let i=n[r];if(i.isPinned)continue;i.reset();let c=o||p[r],l=u[r],h=d[r],g=f[r],_=0,O=0,A=0;for(D[A++]=0;A;){let n=D[--A];if(E[n]===r)continue;let i=y[n];if(i===0)continue;let a=b[n]/i-l,o=x[n]/i-h,u=Math.sqrt(a*a+o*o);if(c&&u-1.42*v[n]>s)continue;if(E[n]<0&&v[n]>=t*u){for(let e=4*n;e<4*n+4;e++)T[e]>=0&&(D[A++]=T[e]);continue}if(u===0&&(a=(Math.random()-.5)/50,o=(Math.random()-.5)/50,u=Math.sqrt(a*a+o*o)),c){if(u<s){let t=e*i*g*k(u)/(u*u*u);_+=t*a,O+=t*o}continue}let d=S[n];if(d>0){let t=a,r=o,s=u;d!==i&&(t=C[n]/d-l,r=w[n]/d-h,s=Math.sqrt(t*t+r*r)||u);let c=e*d*g/(s*s*s);_+=c*t,O+=c*r}let f=i-d;if(f>1e-12){let t=a,r=o,i=u;if(d>0&&(t=(b[n]-C[n])/f-l,r=(x[n]-w[n])/f-h,i=Math.sqrt(t*t+r*r)||u),i<s){let n=e*f*g*k(i)/(i*i*i);_+=n*t,O+=n*r}}}i.force.x+=_,i.force.y+=O,a&&(i.force.x-=m*i.velocity.x,i.force.y-=m*i.velocity.y)}}function k(e){let t=e/a;return(1+t)*Math.exp(-t)}function A(){c=n.length,l=r.length,u=new Float64Array(c),d=new Float64Array(c),f=new Float64Array(c),p=new Uint8Array(c);let e=new Map;for(let t=0;t<c;t++)e.set(n[t],t);let t=new Int32Array(c),i=new Int32Array(c);for(let n of r){let r=e.get(n.from),a=e.get(n.to);r!==void 0&&a!==void 0&&(t[r]+=1,t[a]+=1,i[r]=a,i[a]=r)}for(let e=0;e<c;e++)p[e]=+(t[e]===1&&t[i[e]]>1);let a=2*c+16;a>m&&(m=a,g=new Float64Array(m),_=new Float64Array(m),v=new Float64Array(m),y=new Float64Array(m),b=new Float64Array(m),x=new Float64Array(m),S=new Float64Array(m),C=new Float64Array(m),w=new Float64Array(m),T=new Int32Array(4*m),E=new Int32Array(m),D=new Int32Array(m))}function j(){let e=1/0,t=1/0,r=-1/0,i=-1/0;for(let a=0;a<c;a++){let o=n[a],s=u[a]=o.pos.x,c=d[a]=o.pos.y;f[a]=o.mass,s<e&&(e=s),s>r&&(r=s),c<t&&(t=c),c>i&&(i=c)}h=0,M(e,t,Math.max(r-e,i-t)||1);for(let e=0;e<c;e++)L(e)}function M(e,t,n){h>=m&&N();let r=h++;return g[r]=e,_[r]=t,v[r]=n,y[r]=b[r]=x[r]=S[r]=C[r]=w[r]=0,T[4*r]=T[4*r+1]=T[4*r+2]=T[4*r+3]=-1,E[r]=-1,r}function N(){let e=(e,t)=>{let n=new e.constructor(t);return n.set(e),n};m*=2,g=e(g,m),_=e(_,m),v=e(v,m),y=e(y,m),b=e(b,m),x=e(x,m),S=e(S,m),C=e(C,m),w=e(w,m),T=e(T,4*m),E=e(E,m),D=e(D,m)}function P(e,t){let n=f[t];y[e]+=n,b[e]+=n*u[t],x[e]+=n*d[t],p[t]||(S[e]+=n,C[e]+=n*u[t],w[e]+=n*d[t])}function F(e,t,n){let r=v[e]/2;return+(t>=g[e]+r)+(n>=_[e]+r?2:0)}function I(e,t){let n=v[e]/2,r=M(g[e]+(t&1?n:0),_[e]+(t&2?n:0),n);return T[4*e+t]=r,r}function L(e){let t=0,n=0;for(;;){if(y[t]===0&&E[t]<0){E[t]=e,P(t,e);return}if(E[t]>=0){let r=E[t];E[t]=-1,(u[r]===u[e]&&d[r]===d[e]||n>48)&&(u[e]=g[t]+v[t]*Math.random(),d[e]=_[t]+v[t]*Math.random());let i=I(t,F(t,u[r],d[r]));E[i]=r,P(i,r)}P(t,e);let r=F(t,u[e],d[e]),i=T[4*t+r];if(i<0){let n=I(t,r);E[n]=e,P(n,e);return}t=i,n+=1}}}var Kd=s({default:()=>qd}),qd={id:`ru-1-leaf-fade`,title:`Leaf pushes fade (short reach)`,author:`ru-1 (Samarsky & Gulin reader)`,description:`
<p>On graphs made of hubs with many leaves (starOfStars, megaStars), ngraph draws each hub as a
tight little disc far from the others, so most of the picture is empty.</p>
<p>The reason: every node pushes every other node away at any distance. All the leaves of one hub
push the next hub's fan, so the bigger the fans, the wider the gaps.</p>
<p>Here a push that involves a leaf (a node with one link, hanging off a node with more) fades
with distance: three quarters of its strength at one link length, a fifth at three, nothing
beyond six. Pushes between other nodes stay as they were.</p>
<p>Look for fans that open into wide sunbursts and sit next to each other, filling the frame.
Graphs without leaves (grid20) keep the stock layout exactly.</p>
<p>From Samarsky &amp; Gulin, <i>Numerical Methods</i>, Part I §3–4: a nudge travels down a chain
of springs with no decay, unless every node is also held by its own spring to a fixed spot; then
it dies out within a few nodes (a "screened" push).</p>
<p>What gets worse: in leafy trees (paTree3k) the fans of neighbouring branches overlap, and
graphs with many pieces (CSphd, EVA) show their main piece smaller. <i>Fade every push</i> = 1
packs the stars even more tightly, but trees and grids then stop unfolding (try paTree3k,
rgg1500).</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: grid20`],params:[{key:`reach`,label:`Leaf reach`,value:1,step:`0.5`,help:`How far a leaf's push reaches, in link lengths. Smaller packs the hub fans closer together. Larger moves back toward the stock layout. 0 turns the fade off.`},{key:`fadeAll`,label:`Fade every push`,value:0,step:`1`,help:`0: only pushes that involve a leaf fade. 1: every push fades. Stars pack even more tightly, but trees and sheets lose the long-reach push that unfolds them.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let i=Number(n.reach);if(!(i>0))return null;let a=Number(n.fadeAll)>0;if(!a&&!Jd(t))return null;let o=e.simulator,s=Gd(o,{reach:i,fadeAll:a}),c=o.getForces().get(`spring`);return o.removeForce(`nbody`),o.removeForce(`spring`),o.addForce(`ru1-leaf-fade`,s.update),o.addForce(`spring`,c),{}}};function Jd(e){let t=!1;return e.forEachNode(n=>{let r=Yd(e,n.id);if(r.length===1&&Yd(e,r[0].fromId===n.id?r[0].toId:r[0].fromId).length>1)return t=!0,!0}),t}function Yd(e,t){let n=e.getLinks(t);return n?Array.from(n):[]}function Xd(e,t=120){let n=e.length,r=Math.min(t,n),i=new Float64Array(n);for(let t=0;t<n;t++)i[t]=1/Math.sqrt(e[t].length);let a=[],o=new Float64Array(r),s=new Float64Array(r),c=new Float64Array(n),l=12345;for(let e=0;e<n;e++)l=l*1103515245+12345>>>0,c[e]=l/4294967296-.5;let u=new Float64Array(n);for(let e=0;e<n;e++)u[e]=1/i[e];$d(c,[Qd(u)]),Qd(c);let d=0;for(let t=0;t<r;t++){a.push(c);let l=new Float64Array(n);for(let t=0;t<n;t++){let n=0,r=e[t];for(let e=0;e<r.length;e++)n+=i[r[e]]*c[r[e]];l[t]=c[t]-i[t]*n}o[t]=Zd(l,c),$d(l,[u].concat(a)),$d(l,[u].concat(a)),d=t+1;let f=Math.sqrt(Zd(l,l));if(t===r-1||f<1e-10)break;s[t]=f;for(let e=0;e<n;e++)l[e]/=f;c=l}let f=Array.from(o.subarray(0,d));return ef(f,Array.from(s.subarray(0,d))),f.sort((e,t)=>e-t),{values:[0].concat(f),max:f[f.length-1]}}function Zd(e,t){let n=0;for(let r=0;r<e.length;r++)n+=e[r]*t[r];return n}function Qd(e){let t=Math.sqrt(Zd(e,e))||1;for(let n=0;n<e.length;n++)e[n]/=t;return e}function $d(e,t){for(let n of t){let t=Zd(e,n);for(let r=0;r<e.length;r++)e[r]-=t*n[r]}}function ef(e,t){let n=e.length;t[n-1]=0;for(let r=0;r<n;r++){let i=0,a;do{for(a=r;a<n-1;a++){let n=Math.abs(e[a])+Math.abs(e[a+1]);if(Math.abs(t[a])<=1e-15*n)break}if(a!==r){if(i++===60)break;let n=(e[r+1]-e[r])/(2*t[r]),o=Math.hypot(n,1);n=e[a]-e[r]+t[r]/(n+(n>=0?o:-o));let s=1,c=1,l=0,u;for(u=a-1;u>=r;u--){let r=s*t[u],i=c*t[u];if(t[u+1]=o=Math.hypot(r,n),o===0){e[u+1]-=l,t[a]=0;break}s=r/o,c=n/o,n=e[u+1]-l,o=(e[u]-n)*s+2*c*i,e[u+1]=n+(l=s*o),n=c*o-i}if(o===0&&u>=r)continue;e[r]-=l,t[r]=n,t[a]=0}}while(a!==r)}}function tf(e,{minWidth:t=.15,minRatio:n=1.5,lanczosSteps:r=120}={}){let{values:i,max:a}=Xd(e,r),o=null;for(let e=2;e<Math.min(31,i.length);e++){let n=i[e-1],r=i[e];if(n<1e-9||r-n<t)continue;let a=r/n;(!o||a>o.ratio)&&(o={groups:e,below:n,above:r,ratio:a})}return!o||o.ratio<n?null:{groups:o.groups,low:o.above,high:a,gapBelow:o.below}}function nf(e,t,n,r){let i=t.length,a=e.map(e=>new Float64Array(e));for(let o=0;o<i;o++){let i=t[o];if(!(i.length===0||r&&i.length===1))for(let t=0;t<e.length;t++){let r=e[t],s=0;for(let e=0;e<i.length;e++)s+=r[i[e]];a[t][o]=(1-n)*r[o]+n*s/i.length}}if(r)for(let n=0;n<i;n++){if(t[n].length!==1)continue;let r=t[n][0];if(t[r].length!==1)for(let t=0;t<e.length;t++)a[t][n]=e[t][n]+(a[t][r]-e[t][r])}return a}function rf(e,t,n,r){let i=nf(e,t,n,r),a=t.length,o=0,s=0;for(let t=0;t<e.length;t++){let n=0;for(let e=0;e<a;e++)n+=i[t][e];n/=a;for(let r=0;r<a;r++)o+=(e[t][r]-i[t][r])**2,s+=(i[t][r]-n)**2}return Math.sqrt(o/s)}function af(e,t,n,{target:r=.15,maxPasses:i=4,keepLeaves:a=!0,ignoreTarget:o=!1}={}){let s=2/(n.low+n.high),c=rf(e,t,s,a),l=e,u=0;if(o){for(let e=0;e<i;e++)l=nf(l,t,s,a);u=i}else for(;u<i&&!(rf(l,t,s,a)<=r);){let e=nf(l,t,s,a);if(rf(e,t,s,a)>r||u+1>=i){l=e,u+=1;continue}let n=0,o=1,c=e;for(let i=0;i<12;i++){let i=(n+o)/2,u=l.map((t,n)=>t.map((t,r)=>(1-i)*t+i*e[n][r]));rf(u,t,s,a)>r?n=i:(o=i,c=u)}l=c,u+=o;break}return{x:l,passes:u,before:c,after:rf(l,t,s,a),tau:s}}var of=s({default:()=>cf}),sf=30,cf={id:`ru-2-group-smoothing`,title:`Smooth each group at the end`,author:`ru-2 (Samarsky & Gulin reader)`,description:`
<p><b>Problem.</b> On graphs made of groups (many links inside a group, few between groups)
ngraph spreads every node evenly over one disc, so the groups blur together. ForceAtlas2 draws
the same graphs as separate lumps, and blind judges scored it 9 against ngraph's 5.</p>
<p><b>What this does.</b> When you press <i>Smooth groups</i>, every node moves part of the way
toward the average position of its neighbours, a few times. Nodes inside a group share most of
their neighbours, so the group pulls together, while the groups stay where they are (the weighted
centre of each piece does not move). Leaves move with their hub instead of landing on it.</p>
<p><b>Checks.</b> First it tests whether the graph really has groups. It computes the graph's
<i>spectrum</i>, the list of "patterns" a graph can hold, from smooth whole-group ones to
node-against-neighbour ones, and looks for a clear jump between the two kinds. Then it averages only
until the picture's inner scatter is down to the <i>Detail left</i> share. Graphs without groups,
and drawings whose groups are already apart, are left exactly as they are.</p>
<p><b>Where it comes from.</b> Samarsky &amp; Gulin, "Numerical Methods", part II ch. 2. Their
iterative solvers shrink errors with exactly this kind of averaging step, and they show how to pick
the step so that one band of patterns shrinks as much as possible while the smoothest ones survive
(§4-§5). Here the "error" being shrunk is the scatter inside each group.</p>
<p><b>Look for.</b> Let the layout settle (about 1000 steps), then press <i>Smooth groups</i>: on
sbm8x50 or communities the groups become separate lumps around a hollow centre. On grid20 (no
groups) and cliqueCircle (groups already apart) nothing changes. Set <i>Checks</i> to 0 on
cliqueCircle to see what the checks prevent.</p>
<p><b>Gets worse.</b> Nodes inside a lump sit closer together (more overlap), leaves look like long
spokes, and edge-length fidelity (stress) drops by 5-15%. It is a display step: resume the layout
and the forces spread the groups out again.</p>`,tryGraphs:[`Benchmark: sbm8x50`,`Benchmark: communities`,`Benchmark: grid20`,`Benchmark: cliqueCircle`],params:[{key:`target`,label:`Detail left`,value:.15,step:`0.01`,help:`How much scatter inside groups to keep, relative to the spread between groups. Lower pulls groups tighter (more overlap). ForceAtlas2 pictures sit near 0.14-0.17, ngraph's near 0.21-0.28.`},{key:`maxPasses`,label:`Most passes`,value:4,step:`1`,help:`Upper limit on the number of averaging passes. One pass is one sweep over the links.`},{key:`checks`,label:`Checks on (1) / off (0)`,value:1,step:`1`,help:`With 0 the passes run even where the checks refuse: on cliqueCircle each clique collapses into a dot, which is why the checks exist.`}],finishLabel:`Smooth groups`,attach({layout:e,graph:t,params:n}){return{finish(){lf(e,t,{target:Number(n.target)>0?Number(n.target):.15,maxPasses:Math.max(1,Math.round(Number(n.maxPasses)||4)),checks:Number(n.checks)!==0})}}}};function lf(e,t,{target:n,maxPasses:r,checks:i}){let a=[];if(t.forEachNode(e=>{a.push(e.id)}),a.length===0)return;let o=new Map(a.map((e,t)=>[e,t])),s=a.map(()=>[]);t.forEachLink(e=>{let t=o.get(e.fromId),n=o.get(e.toId);t!==void 0&&n!==void 0&&t!==n&&(s[t].push(n),s[n].push(t))});let c=Object.keys(e.getNodePosition(a[0])),l=performance.now(),u=[];for(let t of uf(s)){if(t.length<sf)continue;let o=new Map(t.map((e,t)=>[e,t])),l=t.map(e=>s[e].map(e=>o.get(e))),d=tf(l);if(!d){if(i){u.push({nodes:t.length,result:`no group scale, left alone`});continue}d={low:.3,high:2}}let f=af(c.map(n=>Float64Array.from(t,t=>e.getNodePosition(a[t])[n]||0)),l,d,{target:n,maxPasses:r,ignoreTarget:!i});t.forEach((t,n)=>{let r=a[t];e.setNodePosition(r,...c.map((e,t)=>f.x[t][n]));let i=e.getBody(r);i&&c.forEach(e=>{e in i.velocity&&(i.velocity[e]=0)})}),u.push({nodes:t.length,groups:d.groups,band:[d.low,d.high].map(e=>+e.toFixed(3)),detailBefore:+f.before.toFixed(3),detailAfter:+f.after.toFixed(3),passes:+f.passes.toFixed(2)})}console.info(`Smooth each group:`,(performance.now()-l).toFixed(0)+` ms`,u)}function uf(e){let t=new Uint8Array(e.length),n=[];for(let r=0;r<e.length;r++){if(t[r])continue;let i=[r];t[r]=1;for(let n=0;n<i.length;n++)for(let r of e[i[n]])t[r]||(t[r]=1,i.push(r));n.push(i)}return n}function df(e,{onset:t,power:n}){let r=e.settings,i=e.random,a=n===2;return function(){let o=e.springs,s=r.springLength,c=r.springCoefficient;for(let e=o.length-1;e>=0;--e){let r=o[e],l=r.from,u=r.to,d=r.length<0?s:r.length,f=u.pos.x-l.pos.x,p=u.pos.y-l.pos.y,m=Math.sqrt(f*f+p*p);m===0&&(f=(i.nextDouble()-.5)/50,p=(i.nextDouble()-.5)/50,m=Math.sqrt(f*f+p*p));let h=m-d,g=(r.coefficient>0?r.coefficient:c)*h;if(h>0&&n>0){let e=h/(t*d);g*=1+(a?e*e:e**+n)}let _=g/m;l.force.x+=_*f,l.force.y+=_*p,l.springCount+=1,l.springLength+=m,u.force.x-=_*f,u.force.y-=_*p,u.springCount+=1,u.springLength+=m}}}var ff=s({default:()=>pf}),pf={id:`ru-3-stiff-springs`,title:`Springs stiffen when overstretched`,author:`ru-3 (Samarskii & Gulin, Numerical Methods)`,description:`
<p>In graphs with big hubs, such as starOfStars, ngraph draws each star as a small tight disc and joins
the stars with very long thin links, so most of the screen is empty. Heavy hubs push each other far
apart, a handful of links stretch to 10–18 times their normal length (the "spring length", the length
a link wants to have), and because the view zooms to fit everything, those few links decide how small
everything else looks.</p>
<p>Here a link pulls much harder once it is stretched well past its normal length: at 3 spring lengths
of extra stretch its pull doubles, and it keeps growing fast after that. Links near their normal
length behave exactly as before.</p>
<p>The idea comes from Samarskii &amp; Gulin, <i>Numerical Methods</i>, chapter 3, §5: an ordinary spring
fits link lengths on average (least squares), which lets a few links be very wrong; fitting by the
worst link instead (the uniform norm) keeps every link close to its length.</p>
<p>Look for stars that grow into large bursts that fill the screen, with short links between them.
Compare with <b>none</b>.</p>
<p>What gets worse: where long links carry meaning, like the links between groups in sbm8x50 or
communities, the groups blend more. Leaves piled around a hub (EVA) are not spread out by this.
2D only: in 3D the layout is left unchanged.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: java`,`Benchmark: grid20`],params:[{key:`onset`,label:`Stiffen after (spring lengths)`,value:3,step:`0.5`,help:`Extra stretch, in spring lengths, at which a link pulls twice as hard as a normal spring. Smaller pulls long links in sooner: stars come closer and bigger, but groups in community graphs blend. Larger is closer to the stock springs.`},{key:`power`,label:`Steepness`,value:2,step:`1`,help:`How fast the extra pull grows past that point: 2 grows with the square of the stretch, higher values leave moderate stretches alone and clamp only the extreme ones. 0 turns the extra pull off (stock springs).`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=r.getForces().get(`spring`);if(!i)return null;let a=df(r,{onset:Number.isFinite(t.onset)&&t.onset>0?t.onset:3,power:Number.isFinite(t.power)&&t.power>=0?t.power:2});return r.removeForce(`spring`),r.addForce(`spring`,a),{dispose(){r.getForces().get(`spring`)===a&&(r.removeForce(`spring`),r.addForce(`spring`,i))}}}};function mf(){let e=0,t,n,r;return{apply:i};function i(e,{strength:n,range:r,cellSize:i,maxCells:s}){let c=e.length;if(c===0||!(n>0)||!(r>0))return;let l=1/0,u=1/0,d=-1/0,f=-1/0;for(let t=0;t<c;++t){let n=e[t].pos;n.x<l&&(l=n.x),n.x>d&&(d=n.x),n.y<u&&(u=n.y),n.y>f&&(f=n.y)}let p=3*r;l-=p,u-=p,d+=p,f+=p;let m=Math.max(i,(d-l)/s,(f-u)/s),h=Math.ceil((d-l)/m)+2,g=Math.ceil((f-u)/m)+2;a(h*g,Math.max(h,g)),t.fill(0,0,h*g);let _=1/(m*m);for(let n=0;n<c;++n){let r=e[n].pos,i=(r.x-l)/m,a=(r.y-u)/m,o=Math.floor(i),s=Math.floor(a),c=i-o,d=a-s,f=s*h+o;t[f]+=(1-c)*(1-d)*_,t[f+1]+=c*(1-d)*_,t[f+h]+=(1-c)*d*_,t[f+h+1]+=c*d*_}let v=r*r/(m*m);o(t,h,g,1,h,v),o(t,g,h,h,1,v);for(let r=0;r<c;++r){let i=e[r];if(i.isPinned)continue;let a=i.pos,o=(a.x-l)/m,s=(a.y-u)/m,c=Math.floor(o),d=Math.floor(s),f=o-c,p=s-d,g=d*h+c,_=t[g],v=t[g+1],y=t[g+h],b=t[g+h+1],x=((v-_)*(1-p)+(b-y)*p)/m,S=((y-_)*(1-f)+(b-v)*f)/m;i.force.x-=n*x,i.force.y-=n*S}}function a(i,a){i>e&&(e=Math.max(i,e*2),t=new Float64Array(e)),(!n||n.length<a)&&(n=new Float64Array(a*2),r=new Float64Array(a*2))}function o(e,t,i,a,o,s){let c=-s,l=1+2*s,u=n,d=r;for(let n=0;n<i;++n){let r=n*o;u[0]=c/l,d[0]=e[r]/l;for(let n=1;n<t;++n){let t=l-c*u[n-1];u[n]=c/t,d[n]=(e[r+n*a]-c*d[n-1])/t}e[r+(t-1)*a]=d[t-1];for(let n=t-2;n>=0;--n)e[r+n*a]=d[n]-u[n]*e[r+(n+1)*a]}}}var hf=s({default:()=>yf}),gf=6e4,_f=2,vf=512,yf={id:`ru-4-grid-pressure`,title:`Grid crowding pressure`,author:`ru-4 (Samarskii & Gulin, Numerical Methods)`,description:`
<p><b>Problem.</b> On graphs with big hubs, ngraph draws each hub with its leaves as a small,
dense disc, and the discs float far apart in a mostly empty picture.</p>
<p><b>What this does.</b> In the stock layout every node pushes every other node, from any
distance, and a hub pushes harder the more links it has. This idea replaces most of that push
with a crowding pressure: nodes are counted on a grid, the counts are blurred, and each node is
pushed from crowded spots toward emptier ones. The push only reaches about <i>Range</i> spring
lengths, so each star or piece of the graph gets about the room it needs instead of shoving
everything else away.</p>
<p><b>Where it comes from.</b> The blur is one step of the heat equation, done with the
always-stable implicit scheme from Samarskii &amp; Gulin, <i>Numerical Methods</i>, part III,
ch. 1, §4. Because that scheme is stable for any step size, one big step does the whole blur at
a fixed cost.</p>
<p><b>Look for</b> big, readable star bursts that sit next to each other and fill the frame;
switch to <b>none</b> to compare. On grid20 the flat lattice should stay (at most a little
wavy).</p>
<p><b>What gets worse:</b> separate pieces that touch can tangle together (try caterpillars),
and edges cross more where stars touch. A longer <i>Range</i> helps trees and separate pieces,
but the stars get smaller. 2D only: in 3D the idea does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: erdos992`,`Benchmark: grid20`],params:[{key:`range`,label:`Range (spring lengths)`,value:_f,step:`0.5`,help:`How far the crowding push reaches. Short (1 to 2): big, packed stars and fans. Long (4 or more): trees and separate pieces untangle better, but stars stay smaller.`},{key:`strength`,label:`Crowding strength`,value:1,step:`0.1`,help:`How hard crowded nodes push each other apart. Higher spreads the leaves of hubs wider.`},{key:`farPush`,label:`Far push kept`,value:.3,step:`0.1`,help:`Share of the stock all-pairs push that stays on. 0 drops it (fastest; stars can show spokes and pieces drift into each other). 1 keeps the full stock push and adds the pressure.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=r.getForces(),a=i.get(`nbody`),o=i.get(`spring`);if(!a||!o)return null;let s=xf(t.range,_f),c=xf(t.strength,1),l=Math.max(0,bf(t.farPush,.3)),u=mf();return r.removeForce(`nbody`),r.removeForce(`spring`),r.addForce(`ru4-crowding`,d),r.addForce(`spring`,o),{dispose(){r.removeForce(`ru4-crowding`),r.removeForce(`spring`),r.addForce(`nbody`,a),r.addForce(`spring`,o)}};function d(e){let t=r.settings,n=r.bodies,i=t.integrator===`fire`?0:t.dragCoefficient;if(l>0){if(a(e),l!==1)for(let e=0;e<n.length;++e){let t=n[e];t.isPinned||(t.force.x=l*t.force.x+(l-1)*i*t.velocity.x,t.force.y=l*t.force.y+(l-1)*i*t.velocity.y)}}else for(let e=0;e<n.length;++e){let t=n[e];t.isPinned||(t.reset(),t.force.x=-i*t.velocity.x,t.force.y=-i*t.velocity.y)}let o=t.springLength>0?t.springLength:10,d=t.springCoefficient>0?t.springCoefficient:.8,f=gf*c*(s/_f)**2*(d/.8)*(o/10)**4;u.apply(n,{strength:f,range:s*o,cellSize:o/2,maxCells:vf})}}};function bf(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function xf(e,t){let n=bf(e,t);return n>0?n:t}function Sf(e){if(e&e-1)throw Error(`Grid size must be a power of two`);let t=new Float64Array(e),n=new Float64Array(e),r=new Float64Array(e),i=new Float64Array(e);for(let t=0;t<e;t++)r[t]=Math.cos(Math.PI*t/(2*e)),i[t]=Math.sin(Math.PI*t/(2*e));let a=Math.log2(e),o=new Uint32Array(e);for(let t=0;t<e;t++){let e=0;for(let n=0;n<a;n++)t&1<<n&&(e|=1<<a-1-n);o[t]=e}let s=new Float64Array(e),c=new Float64Array(e);return{forward2D:f,inverse2D:p};function l(r){for(let r=0;r<e;r++){let e=o[r];if(e>r){let i=t[r];t[r]=t[e],t[e]=i,i=n[r],n[r]=n[e],n[e]=i}}for(let i=2;i<=e;i<<=1){let a=i>>1,o=(r?2:-2)*Math.PI/i,s=Math.cos(o),c=Math.sin(o);for(let r=0;r<e;r+=i){let e=1,i=0;for(let o=0;o<a;o++){let l=r+o,u=l+a,d=t[u]*e-n[u]*i,f=t[u]*i+n[u]*e;t[u]=t[l]-d,n[u]=n[l]-f,t[l]+=d,n[l]+=f;let p=e*s-i*c;i=e*c+i*s,e=p}}}}function u(a,o){for(let n=0;n<e/2;n++)t[n]=a[2*n],t[e-1-n]=a[2*n+1];n.fill(0),l(!1);for(let a=0;a<e;a++)o[a]=t[a]*r[a]+n[a]*i[a]}function d(a,o){for(let o=0;o<e;o++){let s=a[o],c=o===0?0:-a[e-o];t[o]=s*r[o]-c*i[o],n[o]=s*i[o]+c*r[o]}l(!0);for(let n=0;n<e/2;n++)o[2*n]=t[n]/e,o[2*n+1]=t[e-1-n]/e}function f(e,t){m(e,t,u)}function p(e,t){m(e,t,d)}function m(t,n,r){for(let i=0;i<e;i++){for(let n=0;n<e;n++)s[n]=t[i*e+n];r(s,c);for(let t=0;t<e;t++)n[i*e+t]=c[t]}for(let t=0;t<e;t++){for(let r=0;r<e;r++)s[r]=n[r*e+t];r(s,c);for(let r=0;r<e;r++)n[r*e+t]=c[r]}}}function Cf(e,t,n={}){let r=n.sea??1,i=n.amount??1,a=n.margin??.15,o=e.length/2,s=wf(o),c=s*s,l=1/0,u=1/0,d=-1/0,f=-1/0;for(let t=0;t<o;t++){let n=e[2*t],r=e[2*t+1];n<l&&(l=n),n>d&&(d=n),r<u&&(u=r),r>f&&(f=r)}let p=Math.max(d-l,f-u,1e-9)*(1+2*a),m=(l+d)/2-p/2,h=(u+f)/2-p/2,g=p/s,_=new Float64Array(o),v=new Float64Array(o);for(let t=0;t<o;t++)_[t]=(e[2*t]-m)/g,v[t]=(e[2*t+1]-h)/g;let y=Sf(s),b=new Float64Array(c),x=new Float64Array(c),S=new Float64Array(s);for(let e=0;e<s;e++)S[e]=4*Math.sin(Math.PI*e/(2*s))**2;let C=new Float64Array(c);z(C),F(C),y.forward2D(C,b);let w=new Float64Array(c),T=new Float64Array(c),E=new Float64Array(c),D=new Float64Array(c),O=new Float64Array(c),k=new Float64Array(c),A=i/S[1],j=0,M=0;return{advance(e=1/0,t=12){let n=performance.now();for(let r=0;r<e&&!N()&&performance.now()-n<t;r++)P();return N()},isDone:N,getSteps:()=>M,gridSize:s};function N(){return j>=A-1e-12||M>=400}function P(){I(j,w);let n=R(w,E,D),r=Math.min(A-j,.25/n,Math.max(.05,j));I(j+r/2,T),R(T,O,k);for(let n=0;n<o;n++){if(t&&!t[n])continue;let i=_[n]+.5*r*ee(E,_[n],v[n]),a=v[n]+.5*r*ee(D,_[n],v[n]);_[n]=V(_[n]+r*ee(O,i,a)),v[n]=V(v[n]+r*ee(k,i,a)),e[2*n]=m+_[n]*g,e[2*n+1]=h+v[n]*g}j+=r,M++}function F(e){y.forward2D(e,b),L(2),y.inverse2D(x,e);let t=.5/(4*Math.PI*2),n=0,i=0;for(let r=0;r<c;r++)e[r]>t&&(n++,i+=e[r]);let a=r*i/Math.max(1,n);for(let n=0;n<c;n++)e[n]<=t&&(e[n]=a)}function I(e,t){L(e),y.inverse2D(x,t)}function L(e){for(let t=0;t<s;t++)for(let n=0;n<s;n++)x[t*s+n]=b[t*s+n]*Math.exp(-(S[n]+S[t])*e)}function R(e,t,n){let r=1e-12;for(let i=0;i<s;i++)for(let a=0;a<s;a++){let o=i*s+a,c=Math.max(e[o],1e-12),l=a>0&&a<s-1?(e[o+1]-e[o-1])/2:0,u=i>0&&i<s-1?(e[o+s]-e[o-s])/2:0;t[o]=-l/c,n[o]=-u/c;let d=Math.max(Math.abs(t[o]),Math.abs(n[o]));d>r&&(r=d)}return r}function ee(e,t,n){t=Math.min(s-1,Math.max(0,t-.5)),n=Math.min(s-1,Math.max(0,n-.5));let r=Math.min(s-2,Math.floor(t)),i=Math.min(s-2,Math.floor(n)),a=t-r,o=n-i,c=i*s+r;return e[c]*(1-a)*(1-o)+e[c+1]*a*(1-o)+e[c+s]*(1-a)*o+e[c+s+1]*a*o}function z(e){for(let t=0;t<o;t++){let n=_[t]-.5,r=v[t]-.5,i=Math.floor(n),a=Math.floor(r),o=n-i,s=r-a;B(e,i,a,(1-o)*(1-s)),B(e,i+1,a,o*(1-s)),B(e,i,a+1,(1-o)*s),B(e,i+1,a+1,o*s)}}function B(e,t,n,r){t=Math.min(s-1,Math.max(0,t)),n=Math.min(s-1,Math.max(0,n)),e[n*s+t]+=r}function V(e){return Math.min(s-1e-6,Math.max(1e-6,e))}}function wf(e){let t=2*Math.sqrt(Math.max(e,1));return Math.min(256,Math.max(64,2**Math.round(Math.log2(t))))}var Tf=s({default:()=>Df}),Ef=2,Df={id:`ru-5-heat-spread`,title:`Heat-like spreading at the end`,author:`ru-5 (Samarsky & Gulin reader)`,description:`
<p>In ngraph's pictures crowded spots sit next to empty space: a hub's leaves pile into a small
solid disc, or the main piece of the graph shrinks to a dot, while most of the frame stays empty.</p>
<p>Let the layout settle, then press the button below. Crowding spreads out the way heat spreads
through a metal plate, and every node is carried along with it. Packed areas grow into the empty
space around them and nearby nodes move together, so the drawing stretches without being shuffled.
Areas that are already evenly filled have nothing to push against and keep their shape.</p>
<p>The spreading is the heat equation, solved with the Fourier method and kept well-behaved by the
"maximum principle" (spreading heat never makes a new hot or cold spot), both from Samarsky &amp;
Gulin's <i>Numerical Methods</i>, the chapters on the maximum principle and on separation of
variables. Carrying nodes along with the spreading is Gastner and Newman's density-equalizing map.</p>
<p>Look at megaStars and starOfStars: solid star discs open into fans of spokes. On yeast the main
piece grows from a dot into a disc. A grid should keep its shape.</p>
<p>What gets worse: bigger fans reach the long edges between stars, so edges cross more (about twice
as many on starOfStars); tightly knit groups blend a little; sharp corners, like a grid's, round off a
bit; "Fill the frame" bends shapes towards a round outline. It changes the current picture once: press Run afterwards and the forces pull it
back. 2D only: in 3D the button doesn't appear.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: yeast`,`Benchmark: grid20`],params:[{key:`fill`,label:`Fill the frame`,value:0,step:`0.1`,help:`0: only crowded spots spread; empty space counts as if it were as full as the drawing on average, so the outline barely moves. 1: empty space counts as nearly empty, so the whole drawing also grows into it until it fills most of the frame. Dense areas open more, but shapes bend towards a round outline. Values in between mix the two.`},{key:`time`,label:`Spreading time`,value:1,step:`0.5`,help:`How long the heat spreads. At 1 the largest density differences fade to about a third. Bigger values make the density more even everywhere; smaller ones are a gentler touch. 0 does nothing.`}],finishLabel:`Spread the crowding like heat`,attach({layout:e,graph:t,params:n,settings:r}){if(r.dimensions&&r.dimensions!==2)return{};let i=0;return{finish(){a();let r=[];t.forEachNode(t=>{r.push(e.getBody(t.id))});let o=r.length;if(o<2)return;let s=new Float64Array(2*o),c=new Uint8Array(o);r.forEach((e,t)=>{s[2*t]=e.pos.x,s[2*t+1]=e.pos.y,c[t]=+!e.isPinned});let l=Cf(s,c,{sea:1-.8*Math.min(1,Math.max(0,n.fill)),amount:Math.max(0,n.time)}),u=Of(s),d=c.includes(0),f=()=>{let e=l.advance(Ef),t=Of(s),n=d?1:Math.min(1,u.width/t.width,u.height/t.height);r.forEach((e,r)=>{c[r]&&(e.pos.x=u.cx+(s[2*r]-t.cx)*n,e.pos.y=u.cy+(s[2*r+1]-t.cy)*n,e.velocity.x=0,e.velocity.y=0)}),i=e?0:requestAnimationFrame(f)};f()},dispose:a};function a(){i&&cancelAnimationFrame(i),i=0}}};function Of(e){let t=1/0,n=1/0,r=-1/0,i=-1/0;for(let a=0;a<e.length;a+=2)e[a]<t&&(t=e[a]),e[a]>r&&(r=e[a]),e[a+1]<n&&(n=e[a+1]),e[a+1]>i&&(i=e[a+1]);return{cx:(t+r)/2,cy:(n+i)/2,width:Math.max(r-t,1e-9),height:Math.max(i-n,1e-9)}}function kf(e,t,n={}){let r=e.length,i=n.crowding>0?n.crowding:2,a=Math.max(0,Math.round(n.passes===void 0?40:n.passes)),o=n.grid||Math.max(16,Math.min(128,Math.round(1.5*Math.sqrt(r)))),s=n.movable||null,c=n.piece||null,l=n.pieceSize||null,u=n.rigidBelow===void 0?30:n.rigidBelow,d=.25,f=1/0,p=1/0,m=-1/0,h=-1/0;for(let n=0;n<r;n++)e[n]<f&&(f=e[n]),e[n]>m&&(m=e[n]),t[n]<p&&(p=t[n]),t[n]>h&&(h=t[n]);let g=Math.max(m-f,h-p,1e-9)*1.0001,_=(f+m)/2-g/2,v=(p+h)/2-g/2,y=g/o,b=r/(o*o),x=new Float64Array(o*o),S=new Float64Array(o);for(let e=0;e<o;e++){S[e]=4*Math.sin(Math.PI*e/(2*o))**2;for(let t=0;t<o;t++)x[e*o+t]=Math.cos(Math.PI*e*(t+.5)/o)}let C=new Float64Array(o*o),w=new Float64Array(o*o),T=new Float64Array(o*o),E=new Float64Array(o*o),D=new Float64Array(o*o),O=new Float64Array(o*o),k=new Float64Array(o),A=new Float64Array(o),j=new Float64Array(o),M=new Float64Array(r),N=new Float64Array(r),P=l?l.length:0,F=new Float64Array(P),I=new Float64Array(P),L=new Float64Array(P),R=-1;for(let e=0;e<P;e++)(R<0||l[e]>l[R])&&(R=e);let ee=0;return{step:z,gridSize:o};function z(){return ee>=a||(B(),V(),V(),te()?(ne(),re(),ee+=1,ee>=a):(ee=a,!0))}function B(){C.fill(0);for(let n=0;n<r;n++){let r=(e[n]-_)/y-.5,i=(t[n]-v)/y-.5,a=Math.floor(r),s=Math.floor(i),c=r-a,l=i-s,u=ae(a),d=ae(a+1),f=ae(s),p=ae(s+1);C[f*o+u]+=(1-c)*(1-l),C[f*o+d]+=c*(1-l),C[p*o+u]+=(1-c)*l,C[p*o+d]+=c*l}}function V(){for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++)w[t+e]=.25*C[t+Math.max(0,e-1)]+.5*C[t+e]+.25*C[t+Math.min(o-1,e+1)]}for(let e=0;e<o;e++){let t=Math.max(0,e-1)*o,n=Math.min(o-1,e+1)*o,r=e*o;for(let e=0;e<o;e++)C[r+e]=.25*w[t+e]+.5*w[r+e]+.25*w[n+e]}}function te(){let e=i*b,t=0;for(let n=0;n<o*o;n++){let r=C[n]>e?C[n]-e:0;w[n]=r,t+=r}if(t<=1e-9*r)return!1;t/=o*o;for(let e=0;e<o*o;e++)w[e]-=t;for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++){let n=e*o,r=0;for(let e=0;e<o;e++)r+=w[t+e]*x[n+e];T[t+e]=r}}for(let e=0;e<o;e++){let t=e===0?1e-6:0;for(let t=0;t<o;t++)j[t]=T[t*o+e];let n=1+S[e]+t;k[0]=1/n,A[0]=-j[0]/n;for(let r=1;r<o;r++){n=(r===o-1?1:2)+S[e]+t;let i=n-k[r-1];k[r]=1/i,A[r]=(A[r-1]-j[r])/i}j[o-1]=A[o-1];for(let e=o-2;e>=0;e--)j[e]=k[e]*j[e+1]+A[e];for(let t=0;t<o;t++)T[t*o+e]=j[t]}for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++){let n=T[t];for(let r=1;r<o;r++)n+=2*T[t+r]*x[r*o+e];E[t+e]=n/o}}return!0}function ne(){for(let e=0;e<o;e++){let t=e*o,n=Math.max(0,e-1)*o,r=Math.min(o-1,e+1)*o;for(let e=0;e<o;e++)D[t+e]=(E[t+Math.min(o-1,e+1)]-E[t+Math.max(0,e-1)])/2,O[t+e]=(E[r+e]-E[n+e])/2}}function re(){for(let n=0;n<r;n++){let r=(e[n]-_)/y-.5,i=(t[n]-v)/y-.5,a=Math.max(ie(C,r,i),.05*b),o=d*ie(D,r,i)/a,s=d*ie(O,r,i)/a,c=Math.hypot(o,s);c>1&&(o*=1/c,s*=1/c),M[n]=o*y,N[n]=s*y}if(c){F.fill(0),I.fill(0),L.fill(0);for(let e=0;e<r;e++){if(s&&!s[e])continue;let t=c[e];F[t]+=M[e],I[t]+=N[e],L[t]+=1}for(let e=0;e<r;e++){let t=c[e];t===R||l[t]>=u||!L[t]||(M[e]=F[t]/L[t],N[e]=I[t]/L[t])}}for(let n=0;n<r;n++)(!s||s[n])&&(e[n]=Math.min(_+g,Math.max(_,e[n]+M[n])),t[n]=Math.min(v+g,Math.max(v,t[n]+N[n])))}function ie(e,t,n){let r=Math.floor(t),i=Math.floor(n),a=t-r,s=n-i,c=ae(r),l=ae(r+1),u=ae(i)*o,d=ae(i+1)*o;return(1-a)*(1-s)*e[u+c]+a*(1-s)*e[u+l]+(1-a)*s*e[d+c]+a*s*e[d+l]}function ae(e){return e<0?0:e>o-1?o-1:e}}var Af=s({default:()=>jf}),jf={id:`ru-6-spread-crowds`,title:`Spread crowded areas at the end`,author:`ru-6 (Samarskii & Gulin, ch. 5 reader)`,description:`
<p>In ngraph's pictures the details are drawn tiny. A star's leaves sit in a small dark disc,
and on graphs with many separate pieces the main part is a small ball in a mostly empty frame.</p>
<p>This final step keeps the frame fixed and lets crowded places spread out, the way a gas moves
from high pressure to low. Only places more than twice as crowded as the average push outward,
so the gaps between groups stay. The picture is stretched smoothly, like a rubber sheet, so no node
changes its neighbours, and small separate pieces move as a whole.</p>
<p>The "pressure" is the solution of Poisson's equation in a rectangle, solved directly with the
sweep method from Samarskii and Gulin, «Численные методы», chapter 5.</p>
<p>Let the layout settle, then press the button below: stars open into fans and the central ball
fills the frame. Community graphs and grids barely change.</p>
<p>What gets worse: edges are no longer of equal length, fans touching the frame get flattened, and
thousands of tiny pieces (EVA) get herded together. Running the layout again pulls the stars back
into discs. 2D only: in 3D there is no button.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: sciMet`,`Benchmark: erdos992`,`Benchmark: communities`],params:[{key:`crowding`,label:`Push above (× average)`,value:2,step:`0.5`,help:`Only places more crowded than this many times the average push outward. 1 evens out the whole picture, which also fills the gaps between communities; 3 or more opens only the worst clumps.`},{key:`passes`,label:`Passes`,value:40,step:`10`,help:`How far the spreading goes. In one pass no node moves more than one grid cell. More passes open the fans further but flatten the ones that reach the frame.`},{key:`rigidBelow`,label:`Rigid pieces under`,value:30,step:`10`,help:`Separate pieces with fewer nodes than this move as a whole and keep their shape. 0 lets every piece stretch: caterpillar legs open more, but tiny pieces get squashed against the frame.`}],finishLabel:`Spread crowded areas`,attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return{};let i=0;return{finish:a,dispose:o};function a(){if(i)return;let r=[],a=new Map;e.forEachBody((e,t)=>{a.set(t,r.length),r.push(e)});let o=r.length;if(o<2)return;let s=new Float64Array(o),c=new Float64Array(o),l=new Uint8Array(o);for(let e=0;e<o;e++)s[e]=r[e].pos.x,c[e]=r[e].pos.y,l[e]=+!r[e].isPinned;let{piece:u,pieceSize:d}=Mf(t,a,o),f=kf(s,c,{crowding:Number(n.crowding),passes:Number(n.passes),rigidBelow:Number(n.rigidBelow),movable:l,piece:u,pieceSize:d});i=requestAnimationFrame(p);function p(){let e=performance.now(),t;do t=f.step();while(!t&&performance.now()-e<12);for(let e=0;e<o;e++){if(!l[e])continue;let t=r[e];t.pos.x=s[e],t.pos.y=c[e],t.velocity.x=0,t.velocity.y=0}i=t?0:requestAnimationFrame(p)}}function o(){i&&cancelAnimationFrame(i),i=0}}};function Mf(e,t,n){let r=new Int32Array(n).fill(-1),i=[],a=Array(n);t.forEach((e,t)=>{a[e]=t});let o=new Int32Array(n);for(let s=0;s<n;s++){if(r[s]>=0)continue;let n=i.length,c=0,l=0;for(o[l++]=s,r[s]=n;c<l;){let i=o[c++];e.forEachLinkedNode(a[i],e=>{let i=t.get(e.id);i!==void 0&&r[i]<0&&(r[i]=n,o[l++]=i)})}i.push(l)}return{piece:r,pieceSize:Int32Array.from(i)}}var Nf=Object.getOwnPropertyNames,Pf=(e,t)=>function(){try{return t||(0,e[Nf(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},Ff=Pf({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}}),If=Pf({"lib/codeGenerators/createPatternBuilder.js"(e,t){var n=Ff();t.exports=function(e){return t;function t(t,r){let i=r&&r.indent||0,a=r&&r.join!==void 0?r.join:`
`,o=Array(i+1).join(` `),s=[];for(let r=0;r<e;++r){let e=n(r),i=r===0?``:o;s.push(i+t.replace(/{var}/g,e))}return s.join(a)}}}}),Lf=Pf({"lib/codeGenerators/generateQuadTree.js"(e,t){var n=If(),r=Ff();t.exports=i,t.exports.generateQuadTreeFunctionBody=a,t.exports.getInsertStackCode=u,t.exports.getQuadNodeCode=l,t.exports.isSamePosition=o,t.exports.getChildBodyCode=c,t.exports.setChildBodyCode=s;function i(e){let t=a(e);return Function(t)()}function a(e){let t=n(e),i=2**e;return`
${u()}
${l(e)}
${o(e)}
${c(e)}
${s(e)}

function createQuadTree(options, random) {
  options = options || {};
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  return {
    insertBodies: insertBodies,

    /**
     * Gets root node if it is present
     */
    getRoot: function() {
      return root;
    },

    updateBodyForce: update,

    options: function(newOptions) {
      if (newOptions) {
        if (typeof newOptions.gravity === 'number') {
          gravity = newOptions.gravity;
        }
        if (typeof newOptions.theta === 'number') {
          theta = newOptions.theta;
        }

        return this;
      }

      return {
        gravity: gravity,
        theta: theta
      };
    }
  };

  function newNode() {
    // To avoid pressure on GC we reuse nodes.
    var node = nodesCache[currentInCache];
    if (node) {
${f(`      node.`)}
      node.body = null;
      node.mass = ${t(`node.mass_{var} = `,{join:``})}0;
      ${t(`node.min_{var} = node.max_{var} = `,{join:``})}0;
    } else {
      node = new QuadNode();
      nodesCache[currentInCache] = node;
    }

    ++currentInCache;
    return node;
  }

  function update(sourceBody) {
    var queue = updateQueue;
    var v;
    ${t(`var d{var};`,{indent:4})}
    var r; 
    ${t(`var f{var} = 0;`,{indent:4})}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        ${t(`d{var} = body.pos.{var} - sourceBody.pos.{var};`,{indent:8})}
        r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${t(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
        }

        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        v = gravity * body.mass * sourceBody.mass / (r * r * r);
        ${t(`f{var} += v * d{var};`,{indent:8})}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${t(`d{var} = node.mass_{var} / node.mass - sourceBody.pos.{var};`,{indent:8})}
        r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${t(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
        }
        // If s / r < \u03B8, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${r(0)} - node.min_${r(0)}) / r < theta) {
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          v = gravity * node.mass * sourceBody.mass / (r * r * r);
          ${t(`f{var} += v * d{var};`,{indent:10})}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${d()}
        }
      }
    }

    ${t(`sourceBody.force.{var} += f{var};`,{indent:4})}
  }

  function insertBodies(bodies) {
    ${t(`var {var}min = Number.MAX_VALUE;`,{indent:4})}
    ${t(`var {var}max = -Number.MAX_VALUE;`,{indent:4})}
    var i = bodies.length;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      var pos = bodies[i].pos;
      ${t(`if (pos.{var} < {var}min) {var}min = pos.{var};`,{indent:6})}
      ${t(`if (pos.{var} > {var}max) {var}max = pos.{var};`,{indent:6})}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${t(`if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;`,{indent:4})}

    currentInCache = 0;
    root = newNode();
    ${t(`root.min_{var} = {var}min;`,{indent:4})}
    ${t(`root.max_{var} = {var}min + maxSideLength;`,{indent:4})}

    i = bodies.length - 1;
    if (i >= 0) {
      root.body = bodies[i];
    }
    while (i--) {
      insert(bodies[i], root);
    }
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (!node.body) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        ${t(`var {var} = body.pos.{var};`,{indent:8})}
        node.mass += body.mass;
        ${t(`node.mass_{var} += body.mass * {var};`,{indent:8})}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${t(`var min_{var} = node.min_{var};`,{indent:8})}
        ${t(`var max_{var} = (min_{var} + node.max_{var}) / 2;`,{indent:8})}

${a(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${t(`child.min_{var} = min_{var};`,{indent:10})}
          ${t(`child.max_{var} = max_{var};`,{indent:10})}
          child.body = body;

          setChild(node, quadIdx, child);
        } else {
          // continue searching in this quadrant.
          insertStack.push(child, body);
        }
      } else {
        // We are trying to add to the leaf node.
        // We have to convert current leaf into internal node
        // and continue adding two nodes.
        var oldBody = node.body;
        node.body = null; // internal nodes do not cary bodies

        if (isSamePosition(oldBody.pos, body.pos)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${t(`var d{var} = (node.max_{var} - node.min_{var}) * offset;`,{indent:12})}

            ${t(`oldBody.pos.{var} = node.min_{var} + d{var};`,{indent:12})}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(oldBody.pos, body.pos));

          if (retriesCount === 0 && isSamePosition(oldBody.pos, body.pos)) {
            // This is very bad, we ran out of precision.
            // if we do not return from the method we'll get into
            // infinite loop here. So we sacrifice correctness of layout, and keep the app running
            // Next layout iteration should get larger bounding box in the first step and fix this
            return;
          }
        }
        // Next iteration should subdivide node further.
        insertStack.push(node, oldBody);
        insertStack.push(node, body);
      }
    }
  }
}
return createQuadTree;

`;function a(t){let n=[],i=Array(t+1).join(` `);for(let t=0;t<e;++t)n.push(i+`if (${r(t)} > max_${r(t)}) {`),n.push(i+`  quadIdx = quadIdx + ${2**t};`),n.push(i+`  min_${r(t)} = max_${r(t)};`),n.push(i+`  max_${r(t)} = node.max_${r(t)};`),n.push(i+`}`);return n.join(`
`)}function d(){let e=Array(11).join(` `),t=[];for(let n=0;n<i;++n)t.push(e+`if (node.quad${n}) {`),t.push(e+`  queue[pushIdx] = node.quad${n};`),t.push(e+`  queueLength += 1;`),t.push(e+`  pushIdx += 1;`),t.push(e+`}`);return t.join(`
`)}function f(e){let t=[];for(let n=0;n<i;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function o(e){let t=n(e);return`
  function isSamePosition(point1, point2) {
    ${t(`var d{var} = Math.abs(point1.{var} - point2.{var});`,{indent:2})}
  
    return ${t(`d{var} < 1e-8`,{join:` && `})};
  }  
`}function s(e){var t=2**e;return`
function setChild(node, idx, child) {
  ${n()}
}`;function n(){let e=[];for(let n=0;n<t;++n){let t=n===0?`  `:`  else `;e.push(`${t}if (idx === ${n}) node.quad${n} = child;`)}return e.join(`
`)}}function c(e){return`function getChild(node, idx) {
${t()}
  return null;
}`;function t(){let t=[],n=2**e;for(let e=0;e<n;++e)t.push(`  if (idx === ${e}) return node.quad${e};`);return t.join(`
`)}}function l(e){let t=n(e),r=2**e;return`
function QuadNode() {
  // body stored inside this node. In quad tree only leaf nodes (by construction)
  // contain bodies:
  this.body = null;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${i(`  this.`)}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${t(`this.mass_{var} = 0;`,{indent:2})}

  // bounding box coordinates
  ${t(`this.min_{var} = 0;`,{indent:2})}
  ${t(`this.max_{var} = 0;`,{indent:2})}
}
`;function i(e){let t=[];for(let n=0;n<r;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function u(){return`
/**
 * Our implementation of QuadTree is non-recursive to avoid GC hit
 * This data structure represent stack of elements
 * which we are trying to insert into quad tree.
 */
function InsertStack () {
    this.stack = [];
    this.popIdx = 0;
}

InsertStack.prototype = {
    isEmpty: function() {
        return this.popIdx === 0;
    },
    push: function (node, body) {
        var item = this.stack[this.popIdx];
        if (!item) {
            // we are trying to avoid memory pressure: create new element
            // only when absolutely necessary
            this.stack[this.popIdx] = new InsertStackElement(node, body);
        } else {
            item.node = node;
            item.body = body;
        }
        ++this.popIdx;
    },
    pop: function () {
        if (this.popIdx > 0) {
            return this.stack[--this.popIdx];
        }
    },
    reset: function () {
        this.popIdx = 0;
    }
};

function InsertStackElement(node, body) {
    this.node = node; // QuadTree node
    this.body = body; // physical body which needs to be inserted to node
}
`}}})(),Rf=`v = gravity * body.mass * sourceBody.mass / (r * r * r);`,zf=`v = gravity * node.mass * sourceBody.mass / (r * r * r);`,Bf=`if ((node.max_x - node.min_x) / r < theta) {`,Vf=`if (screen.range > 0) { var q = r / screen.range; v *= (1 + q) * Math.exp(-q); }`;function Hf(e){let t=Lf.generateQuadTreeFunctionBody(2);for(let e of[Rf,zf,Bf])if(t.indexOf(e)<0)throw Error(`Short-range push: the quad tree code has changed, cannot patch: `+e);return t=t.replace(Rf,Rf+` `+Vf).replace(zf,zf+` `+Vf).replace(Bf,`if (screen.range > 0 && r - (node.max_x - node.min_x) * 1.4143 > screen.cutoff) continue;
`+Bf),Function(`screen`,t)(e)}var Uf=s({default:()=>Wf}),Wf={id:`v1-1-short-range-push`,title:`Push fades fast with distance`,author:`v1-1 (Feynman Vol. I, ch. 1-6)`,description:`
<p><b>The problem.</b> On graphs with big hubs, ngraph draws each hub and its leaves as a small,
dense disc, far from the next one, and most of the picture stays empty. On graphs with many separate
pieces, the main piece shrinks to a blob while the small pieces fly off to a far ring.</p>
<p><b>Why.</b> Every node pushes every other node, however far, and the pushes of a group add up.
Two hubs with 200 leaves each push each other apart with their whole crowd, so they end up far apart,
while the leaves themselves stay about one spring length from their hub.</p>
<p><b>The change.</b> The push between two nodes is the usual one when they are close, but it dies
out beyond about <i>Push range</i> spring lengths. Groups then sit as close as their own leaves
allow, and the picture fills up. This is how ordinary matter behaves: atoms are full of electric
charges, but the plus and minus cancel, so two atoms barely feel each other at a distance and only
push when they come close (Feynman, <i>Lectures on Physics</i>, Vol. I, chapter 2).</p>
<p><b>What to look for.</b> On starOfStars and megaStars the stars grow into large, readable
bursts that nearly touch. On yeast the main piece fills the frame and the small pieces stay next to
it instead of drifting away. On sbm8x50 (eight communities) nothing should change.</p>
<p><b>What gets worse.</b> More edges cross where groups now touch. Without the long push nothing
irons out folds: trees lose their long trunk edges and their top branches press together (try
binTree8), and a grid can keep a crumpled corner (grid20). A larger <i>Push range</i> (4) fixes the
grid and brings part of the trunk back, while keeping part of the gain on the stars. 2D only: in 3D
the idea does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: yeast`,`Benchmark: sbm8x50`],params:[{key:`range`,label:`Push range`,value:2,step:`0.5`,help:`How far the push reaches, in spring lengths. Small (2): stars and pieces pack tightly, trees lose their trunk. Large (4-8): closer to the stock layout. 0 turns the fading off.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return{};let r=e.simulator,i=r.settings,a=r.bodies,o={range:0,cutoff:0},s=Hf(o)({gravity:i.gravity,theta:i.theta},r.random),c=[...r.getForces().entries()];return c.forEach(([e])=>r.removeForce(e)),r.addForce(`short-range-push`,l),c.forEach(([e,t])=>{e!==`nbody`&&r.addForce(e,t)}),{dispose(){[...r.getForces().keys()].forEach(e=>r.removeForce(e)),c.forEach(([e,t])=>r.addForce(e,t))}};function l(){if(a.length===0)return;let e=Math.max(0,Number(t.range)||0)*i.springLength;o.range=e,o.cutoff=6*e,s.options({gravity:i.gravity,theta:i.theta}),s.insertBodies(a);let n=i.integrator===`fire`?0:i.dragCoefficient;for(let e=0;e<a.length;++e){let t=a[e];t.isPinned||(t.reset(),s.updateBodyForce(t),n&&(t.force.x-=n*t.velocity.x,t.force.y-=n*t.velocity.y))}}}},Gf=2048,Kf=8;function qf(){let e=0,t,n,r,i,a,o,s,c,l,u,d,f,p,m,h=0,g=0,_,v,y,b,x,S=new Int32Array(1024),C=new Float64Array(2050);for(let e=0;e<=2049;++e)C[e]=Math.exp(-e*Kf/Gf);return k(1024),{build:w,force:T};function w(e,t){let n=e.length;n>g&&A(n);let r=1/0,i=1/0,a=-1/0,o=-1/0;for(let s=0;s<n;++s){let n=e[s].pos,c=n.x,l=n.y;v[s]=c,y[s]=l,b[s]=e[s].mass,x[s]=t[s],c<r&&(r=c),c>a&&(a=c),l<i&&(i=l),l>o&&(o=l)}if(h=0,n===0)return;let _=Math.max(a-r,o-i,1e-9)*1.0001;O(r,i,_);for(let e=0;e<n;++e)E(e);for(let e=0;e<h;++e){let t=s[e],n=u[e],r=t+n;p[e]=(c[e]+d[e])/r,m[e]=(l[e]+f[e])/r,t>0&&(c[e]/=t,l[e]/=t),n>0&&(d[e]/=n,f[e]/=n)}}function T(e,g,w,T,E,D,O){if(h===0)return;let k=t,A=n,j=r,M=i,N=a,P=o,F=s,I=c,L=l,R=u,ee=d,z=f,B=p,V=m,te=_,ne=v,re=y,ie=b,ae=x,H=C,oe=ne[e],se=re[e],U=g*ie[e],ce=ae[e]===1,le=E*E,ue=Gf/(Kf*T),de=0,fe=0,pe=S,me=0;for(pe[me++]=0;me>0;){let t=pe[--me];if(j[t]===0){for(let n=A[t];n!==-1;n=te[n]){if(n===e)continue;let t=ne[n]-oe,r=re[n]-se,i=t*t+r*r;i===0&&(t=(D.nextDouble()-.5)/50,r=(D.nextDouble()-.5)/50,i=t*t+r*r);let a=Math.sqrt(i),o=U*ie[n]/(i*a);if(ce||ae[n]===1){if(i>le)continue;let e=a*ue,t=e|0;o*=H[t]+(e-t)*(H[t+1]-H[t])}de+=o*t,fe+=o*r}continue}let n=F[t],r=R[t],i=P[t],a=!1;if(ce||r>0){let e=M[t],r=N[t],o=oe<e?e-oe:oe>e+i?oe-e-i:0,s=se<r?r-se:se>r+i?se-r-i:0;if(a=o*o+s*s>le,a&&(ce||n===0))continue}let o=B[t]-oe,s=V[t]-se,c=o*o+s*s,l=Math.sqrt(c);if(l>0&&i<w*l){if(ce){if(c<=le){let e=l*ue,t=e|0,i=U*(n+r)*(H[t]+(e-t)*(H[t+1]-H[t]))/(c*l);de+=i*o,fe+=i*s}continue}if(r===0){let e=U*n/(c*l);de+=e*o,fe+=e*s;continue}if(n>0){let e=I[t]-oe,r=L[t]-se,i=e*e+r*r,a=Math.sqrt(i);if(a>0){let t=U*n/(i*a);de+=t*e,fe+=t*r}}if(!a){let e=ee[t]-oe,n=z[t]-se,i=e*e+n*n,a=Math.sqrt(i);if(a>0&&i<=le){let t=a*ue,o=t|0,s=U*r*(H[o]+(t-o)*(H[o+1]-H[o]))/(i*a);de+=s*e,fe+=s*n}}continue}if(me+4>pe.length){let e=new Int32Array(pe.length*2);e.set(pe),pe=S=e}let u=t*4,d=k[u];d!==-1&&(pe[me++]=d),d=k[u+1],d!==-1&&(pe[me++]=d),d=k[u+2],d!==-1&&(pe[me++]=d),d=k[u+3],d!==-1&&(pe[me++]=d)}O[0]+=de,O[1]+=fe}function E(e){let p=0;for(;;){if(r[p]){D(p,e);let r=o[p]/2,s=+(v[e]>=i[p]+r),c=+(y[e]>=a[p]+r),l=p*4+s+2*c,u=t[l];if(u===-1){let o=O(i[p]+s*r,a[p]+c*r,r);t[l]=o,n[o]=e,_[e]=-1,D(o,e);return}p=u;continue}let m=n[p];if(m===-1){n[p]=e,_[e]=-1,D(p,e);return}if(v[m]===v[e]&&y[m]===y[e]||o[p]<1e-9){_[e]=m,n[p]=e,D(p,e);return}let h=o[p]/2,g=+(v[m]>=i[p]+h),b=+(y[m]>=a[p]+h),x=O(i[p]+g*h,a[p]+b*h,h);n[x]=m,s[x]=s[p],c[x]=c[p],l[x]=l[p],u[x]=u[p],d[x]=d[p],f[x]=f[p],n[p]=-1,r[p]=1,t[p*4+g+2*b]=x}}function D(e,t){let n=b[t];x[t]===1?(u[e]+=n,d[e]+=n*v[t],f[e]+=n*y[t]):(s[e]+=n,c[e]+=n*v[t],l[e]+=n*y[t])}function O(p,m,g){h===e&&k(e*2);let _=h++,v=_*4;return t[v]=t[v+1]=t[v+2]=t[v+3]=-1,n[_]=-1,r[_]=0,i[_]=p,a[_]=m,o[_]=g,s[_]=c[_]=l[_]=0,u[_]=d[_]=f[_]=0,_}function k(h){let g=(e,t,n)=>{let r=new e(h*n);return t&&r.set(t),r};t=g(Int32Array,t,4),n=g(Int32Array,n,1),r=g(Uint8Array,r,1),i=g(Float64Array,i,1),a=g(Float64Array,a,1),o=g(Float64Array,o,1),s=g(Float64Array,s,1),c=g(Float64Array,c,1),l=g(Float64Array,l,1),u=g(Float64Array,u,1),d=g(Float64Array,d,1),f=g(Float64Array,f,1),p=g(Float64Array,p,1),m=g(Float64Array,m,1),e=h}function A(e){g=Math.max(e,g*2),_=new Int32Array(g),v=new Float64Array(g),y=new Float64Array(g),b=new Float64Array(g),x=new Uint8Array(g)}}var Jf=s({default:()=>Yf}),Yf={id:`v1-2-leaf-fade`,title:`Only leaf pushes fade`,author:`v1-2 (Feynman Vol. 1, ch. 12-13)`,description:`
<p>ngraph draws a hub with many leaves (nodes that have only one link) as a small, solid disc.
The discs end up far apart, and most of the screen is empty.</p>
<p>Why: every node pushes every other node away. Seen from far off, a crowd of leaves pushes like
one heavy node that weighs as much as all of them together. Only one link holds that crowd to
the rest of the graph, so the bigger the star, the farther it shoves its neighbours, while the
star itself stays small.</p>
<p>Here, every push that involves a leaf fades with distance, like the short-range force inside
atomic nuclei in the Feynman Lectures (Vol. 1, ch. 12; "a crowd pushes like one node" is the
shell theorem of ch. 13). Up close, leaves still keep apart; from afar, they stop shoving the
drawing around. Pushes between other nodes stay as they are.</p>
<p>Look for stars opening into large sunbursts that fill the screen (starOfStars, megaStars,
EVA), and trees keeping their main branches (paTree3k). grid20 has no leaves and should not
change.</p>
<p>What gets worse: more lines cross inside the sunbursts, and graphs of many small pieces with
legs (caterpillars) pack closer and overlap more. Raising "Fade nodes with at most this many
links" fades more pushes: stars open further, but trees lose the gaps between their branches.</p>
<p>2D only: in 3D it does nothing. It uses its own quad tree, so the Repulsion setting is ignored
while it is on. A step takes about 1.4 to 1.9 times as long as with the stock quad tree on the
3k to 7k node graphs, and about 9 times as long as with the faster dual tree.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: paTree3k`,`Benchmark: grid20`],params:[{key:`fade`,label:`Fade distance`,value:3,step:`0.5`,help:`How far a leaf's push reaches, in ideal spring lengths. Smaller packs the stars closer together; 20 or more is about the same as none.`},{key:`leafLinks`,label:`Fade nodes with at most this many links`,value:1,step:`1`,help:`1 fades only leaves. Raise it to fade more nodes: at 1000 every push fades, the stars open even more, but trees lose the gaps between their branches and turn into an even carpet.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=r.getForces(),a=i.get(`spring`);if(!i.has(`nbody`)||!a)return null;let o=qf(),s=r.random,c=new Float64Array(2),l=Math.max(Number(t.fade)||3,.1),u=Math.max(Number(t.leafLinks)||1,1),d=new Uint8Array,f=-1,p=-1,m=0;return r.removeForce(`nbody`),r.removeForce(`spring`),r.addForce(`nbody`,h),r.addForce(`spring`,a),{};function h(){let e=r.bodies,t=e.length;if(t===0)return;let n=r.settings;g(e),o.build(e,d);let i=l*n.springLength,a=6*i,u=n.integrator===`fire`?0:n.dragCoefficient;for(let r=0;r<t;++r){let t=e[r];t.isPinned||(t.reset(),c[0]=0,c[1]=0,o.force(r,n.gravity,n.theta,i,a,s,c),t.force.x=c[0]-u*t.velocity.x,t.force.y=c[1]-u*t.velocity.y)}}function g(e){let t=r.springs;if(m+=1,e.length===f&&t.length===p&&m<200)return;m=0,f=e.length,p=t.length;let n=new Map;for(let t=0;t<e.length;++t)n.set(e[t],t);let i=new Int32Array(e.length);for(let e of t){let t=n.get(e.from),r=n.get(e.to);t!==void 0&&(i[t]+=1),r!==void 0&&(i[r]+=1)}d=new Uint8Array(e.length);for(let t=0;t<e.length;++t)d[t]=+(i[t]>=1&&i[t]<=u)}}};function Xf(e,{runs:t=8,certainty:n=.75,minGroupFactor:r=1}={}){let i=[],a=new Map;e.forEachNode(e=>{a.set(e.id,i.length),i.push(e.id)});let o=i.length,s=[],c=new Int32Array(o);e.forEachLink(e=>{let t=a.get(e.fromId),n=a.get(e.toId);t!==n&&(s.push({link:e,a:t,b:n}),c[t]+=1,c[n]+=1)});let l=new Int32Array(o+1);for(let e=0;e<o;e++)l[e+1]=l[e]+c[e];let u=new Int32Array(l[o]),d=l.slice(0,o);for(let{a:e,b:t}of s)u[d[e]++]=t,u[d[t]++]=e;let f=[];for(let e=0;e<t;e++)f.push(Zf(o,l,u,7919*(e+1)));let p=f[0],m=new Int32Array(o).fill(-1),h=new Map;for(let e=0;e<o;e++)h.set(p[e],(h.get(p[e])||0)+1);let g=r*Math.sqrt(o),_=new Map;for(let[e,t]of h)t>=g&&_.set(e,_.size);let v=Array.from({length:_.size},()=>[]);for(let e=0;e<o;e++){let t=_.get(p[e]);t!==void 0&&(m[e]=t,v[t].push(i[e]))}let y=new Map;for(let{link:e,a:r,b:i}of s){let a=m[r],o=m[i];if(a<0||o<0||a===o)continue;let s=0;for(let e of f)e[r]!==e[i]&&(s+=1);if(s<n*t)continue;let c=Math.min(a,o)*v.length+Math.max(a,o),l=y.get(c);l||(l={a:Math.min(a,o),b:Math.max(a,o),links:[]},y.set(c,l)),l.links.push(e)}return{groups:v,pairs:[...y.values()]}}function Zf(e,t,n,r){let i=Qf(r),a=new Int32Array(e);for(let t=0;t<e;t++)a[t]=t;let o=new Int32Array(e);for(let t=0;t<e;t++)o[t]=t;let s=new Float64Array(e),c=new Int32Array(e);for(let r=0;r<50;r++){for(let t=e-1;t>0;t--){let e=Math.floor(i()*(t+1)),n=o[t];o[t]=o[e],o[e]=n}let r=0;for(let l=0;l<e;l++){let e=o[l],u=t[e],d=t[e+1];if(u===d)continue;let f=0;for(let e=u;e<d;e++){let t=a[n[e]];s[t]===0&&(c[f++]=t),s[t]+=1}let p=a[e],m=-1,h=0;for(let e=0;e<f;e++){let t=c[e],n=s[t];n>m?(p=t,m=n,h=1):n===m&&i()*++h<1&&(p=t),s[t]=0}p!==a[e]&&(a[e]=p,r+=1)}if(!r)break}return a}function Qf(e){let t=e|0;return function(){t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var $f=s({default:()=>np}),ep=25,tp=.05,np={id:`v1-3-group-bridges`,title:`Tune links between communities`,author:`v1-3 (Feynman Vol 1, Ch. 15-23)`,description:`
<p>On graphs made of communities (groups of nodes linked mostly among themselves),
ngraph draws one evenly spread sheet: the groups show only as faint lobes that touch, and
their edges mix.</p>
<p>This idea finds the groups once, then every 25 steps it loosens only the links that run
between two groups. For each pair of groups it picks how loose those links are, so that the
push between the two whole groups balances their pull when the groups' centres sit
<b>Gap</b> group widths apart. Links inside a group are never changed.</p>
<p>It comes from Feynman, Vol 1, chapters 18&ndash;19. The forces inside a body cancel, so only
outside forces move its centre (the average position of its parts). From far away, a whole
group pushes like one heavy node at that centre.</p>
<p>Look for separate blobs with white space between them and long links across the gaps, as
ForceAtlas2 draws them. Compare with <b>none</b>. On grid20, nothing should change.</p>
<p>What gets worse: links between groups become long, so they no longer match graph
distance, and the gaps leave more of the frame empty. Lower <b>Smallest group</b> to 1 and
weak groups (Miserables) or random clumps (rgg1500) get pulled apart too: the picture turns
lopsided or gets holes.</p>`,tryGraphs:[`Benchmark: sbm8x50`,`Benchmark: communities`,`Groups 8x250 (2k)`,`Benchmark: grid20`],params:[{key:`gap`,label:`Gap`,value:2.5,step:`0.5`,help:`How far apart two linked groups settle: distance between their centres, in group widths (each width is a group's average distance of its nodes from its centre, summed over the two groups). 1.5 is gentle, 2.5 looks like ForceAtlas2, 3.5 gives tight blobs with very long links between them.`},{key:`certainty`,label:`Group certainty`,value:.75,step:`0.05`,help:`Communities are searched 8 times from different random orders. A link counts as running between groups only if it does so in at least this share of the searches. Lower lets links of fuzzier groups loosen too; higher keeps only the clearest ones.`},{key:`minGroup`,label:`Smallest group`,value:2,step:`0.5`,help:`Smallest group that counts, as a multiple of the square root of the number of nodes (400 nodes: 2 means 40). 1 lets smaller groups separate too, but then weak groups (Miserables) and random clumps (rgg1500) get pulled apart as well.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let{groups:i,pairs:a}=Xf(t,{certainty:Number(n.certainty),minGroupFactor:Number(n.minGroup)});if(!a.length)return null;let o=Number(n.gap)>0?Number(n.gap):2.5,s=e.simulator,c=i.map(t=>t.map(t=>e.getBody(t))),l=a.map(t=>({a:t.a,b:t.b,springs:t.links.map(t=>e.getSpring(t.id)).filter(Boolean)})),u=new Map;l.forEach(e=>e.springs.forEach(e=>u.set(e,e.coefficient)));let d=new Float64Array(i.length),f=new Float64Array(i.length),p=0;return h(),e.on(`step`,m),{dispose(){e.off(`step`,m),u.forEach((e,t)=>{t.coefficient=e})}};function m(){p+=1,p%ep===0&&h()}function h(){let e=s.settings,t=e.springCoefficient,n=e.springLength,r=Math.abs(e.gravity),a=new Float64Array(i.length),u=new Float64Array(i.length);c.forEach((e,t)=>{let n=0,r=0,i=0;for(let t of e)n+=t.mass,r+=t.pos.x,i+=t.pos.y;a[t]=r/e.length,u[t]=i/e.length;let o=0;for(let n of e)o+=(n.pos.x-a[t])**2+(n.pos.y-u[t])**2;d[t]=n,f[t]=Math.sqrt(o/e.length)});for(let e of l){if(!e.springs.length)continue;let i=Math.max(o*(f[e.a]+f[e.b]),1.5*n),a=r*d[e.a]*d[e.b]/(t*e.springs.length*i*i*(i-n));a=Math.min(1,Math.max(tp,a));for(let n of e.springs)n.coefficient=a*t}}}},rp=48,ip=1024,ap=13,op=4096/ap,sp=new Float64Array(4098);for(let e=0;e<sp.length;e++)sp[e]=Math.exp(-e/op);function cp(e){if(e>=ap)return 0;let t=e*op,n=t|0;return sp[n]+(sp[n+1]-sp[n])*(t-n)}function lp(){let e=0,t,n,r,i,a,o=0,s=0,c,l,u,d,f,p,m,h,g,_=new Float32Array,v=0,y=0,b=1,x=1,S=0,C=0,w=1,T=new Int32Array(1024),E={interactions:0,skipped:0};return{computeForces:D,stats:E};function D(o,s){if(e=o.length,e===0)return;(!t||t.length<e)&&(t=new Float64Array(e),n=new Float64Array(e),r=new Float64Array(e),i=new Float64Array(e),a=new Int32Array(e));let u=1/0,d=1/0,_=-1/0,v=-1/0;for(let i=0;i<e;i++){let e=o[i],a=e.pos.x,s=e.pos.y;t[i]=a,n[i]=s,r[i]=e.mass,a<u&&(u=a),a>_&&(_=a),s<d&&(d=s),s>v&&(v=s)}O(u,d,_,v,s.cell),A(u,d,Math.max(_-u,v-d));let y=s.gravity,b=s.theta,x=s.crossSection,S=1/s.minReach,C=0,w=0;for(let s=0;s<e;s++){let e=o[s];if(e.isPinned)continue;e.reset();let u=t[s],d=n[s],_=i[s],v=0,E=0,D=0;for(T[D++]=0;D>0;){let e=T[--D],o=l[e];if(o>=0){do{if(o!==s){let e=t[o]-u,a=n[o]-d,c=e*e+a*a;c===0&&(e=up(s,o),a=up(o,s),c=e*e+a*a);let l=Math.sqrt(c),f=Math.min(S,x*(_+i[o])*.5),p=y*r[o]*cp(l*f)/(c*l);v+=p*e,E+=p*a,C++}o=a[o]}while(o>=0);continue}if(p[e]===0)continue;let O=m[e]-u,A=h[e]-d,j=O*O+A*A,M=Math.sqrt(j),N=f[e],P=k(u+O*.5,d+A*.5),F=Math.min(S,x*(_+4*P+g[e])/6),I=M-.71*N;if(I>0&&I*F>ap)w++;else if(M>0&&N/M<b){let t=y*p[e]*cp(M*F)/(j*M);v+=t*O,E+=t*A,C++}else{if(D+4>T.length){let e=new Int32Array(T.length*2);e.set(T),T=e}let t=4*e;c[t]>=0&&(T[D++]=c[t]),c[t+1]>=0&&(T[D++]=c[t+1]),c[t+2]>=0&&(T[D++]=c[t+2]),c[t+3]>=0&&(T[D++]=c[t+3])}}e.force.x+=r[s]*v,e.force.y+=r[s]*E}E.interactions=C,E.skipped=w}function O(r,a,o,s,c){for(b=c>0?c:10;(o-r)/b>=ip||(s-a)/b>=ip;)b*=2;v=r,y=a,x=1/b,S=Math.floor((o-r)/b)+1,C=Math.floor((s-a)/b)+1,_.length<S*C?_=new Float32Array(S*C):_.fill(0,0,S*C),w=1/(b*b);for(let r=0;r<e;r++)_[((n[r]-y)*x|0)*S+((t[r]-v)*x|0)]+=1;for(let r=0;r<e;r++)i[r]=_[((n[r]-y)*x|0)*S+((t[r]-v)*x|0)]*w}function k(e,t){let n=(e-v)*x,r=(t-y)*x;return n<0||r<0||n>=S||r>=C?0:_[(r|0)*S+(n|0)]*w}function A(i,o,f){s=0,I(Math.max(16,2*e)),F(i,o,f*(1+1e-9)+1e-9);for(let t=0;t<e;t++)j(t);for(let e=s-1;e>=0;e--){let i=0,o=0,s=0,f=l[e];if(f>=0)do i+=r[f],o+=r[f]*t[f],s+=r[f]*n[f],f=a[f];while(f>=0);else for(let t=0;t<4;t++){let n=c[4*e+t];n>=0&&(i+=p[n],o+=p[n]*m[n],s+=p[n]*h[n])}p[e]=i,m[e]=i>0?o/i:u[e],h[e]=i>0?s/i:d[e],g[e]=k(m[e],h[e])}}function j(e){a[e]=-1;let r=0,i=0;if(l[0]===-1&&M(0))l[0]=e;else for(;;){let o=l[r];if(o>=0){if(i>=rp){a[e]=a[o],a[o]=e;return}l[r]=-2;let s=N(r,t[o],n[o]),u=P(r,s);c[4*r+s]=u,l[u]=o}let s=N(r,t[e],n[e]),u=c[4*r+s];if(u<0){let t=P(r,s);c[4*r+s]=t,l[t]=e;return}r=u,i++}}function M(e){return c[4*e]<0&&c[4*e+1]<0&&c[4*e+2]<0&&c[4*e+3]<0}function N(e,t,n){let r=f[e]/2;return+(t>u[e]+r)+(n>d[e]+r?2:0)}function P(e,t){let n=f[e]/2;return F(u[e]+(t&1?n:0),d[e]+(t&2?n:0),n)}function F(e,t,n){s===o&&I(o*2);let r=s++;return u[r]=e,d[r]=t,f[r]=n,l[r]=-1,c[4*r]=c[4*r+1]=c[4*r+2]=c[4*r+3]=-1,r}function I(e){if(e<=o)return;let t=(e,t,n)=>{let r=new e(n);return t&&r.set(t.subarray(0,Math.min(t.length,n))),r};c=t(Int32Array,c,4*e),l=t(Int32Array,l,e),u=t(Float64Array,u,e),d=t(Float64Array,d,e),f=t(Float64Array,f,e),p=t(Float64Array,p,e),m=t(Float64Array,m,e),h=t(Float64Array,h,e),g=t(Float64Array,g,e),o=e}}function up(e,t){let n=Math.sin(e*12.9898+t*78.233)*43758.5453;return(n-Math.floor(n)-.5)/50}var dp=s({default:()=>fp}),fp={id:`v1-4-dimming-crowds`,title:`Push dims through crowds`,author:`v1-4 (Feynman Vol. 1, ch. 31–32)`,description:`
<p>On graphs with hubs, every hub's leaves end up in a small, dense disc. The stars hang far
apart on long spokes, so most of the picture is empty and the stars are too small to read.
The reason: every node pushes every other node at full strength, so a whole star pushes its
neighbour star with the weight of all its nodes, and only one link holds them together.</p>
<p>Here a push fades as it passes other nodes, the way sunlight dims passing through a cloud.
Where nodes are sparse (trees, grids) nothing changes. A dense crowd shades whatever lies
behind it, so crowds stop pushing each other away with their full weight and settle close
together. Up close, within a few link lengths, the push stays.</p>
<p>The idea comes from Feynman's Lectures, Vol. 1, chapters 31–32: light crossing matter dims
in proportion to how much matter it crosses.</p>
<p>Look for: big, readable stars that fill the picture instead of tiny rings on long spokes.
Compare with <b>none</b>.</p>
<p>What gets worse: more links cross, because neighbouring stars are now close and spokes pass
over them. Big sparse networks such as powerGrid get more tangled in the middle, and large
values of <i>Cloudiness</i> fold trees. 2D only; it replaces the <i>Repulsion</i> setting
while it is on.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: erdos992`,`Benchmark: grid20`],params:[{key:`cloudiness`,label:`Cloudiness`,value:.05,step:`0.01`,help:`How much each node dims a push passing it. 0 turns the idea off. Higher values also dim sparse parts: stars pack tighter, but trees and grids start to fold.`},{key:`minReach`,label:`Shortest reach`,value:3,step:`0.5`,help:`Even inside the densest crowd, a push keeps at least this reach, in link lengths. Smaller values pack crowds tighter; below about 2, stars can slide into each other.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=r.getForces(),a=i.get(`nbody`),o=i.get(`spring`);if(!a||!o)return null;let s=lp();function c(){let e=r.settings,n=e.springLength;if(s.computeForces(r.bodies,{gravity:e.gravity,theta:e.theta,crossSection:Math.max(0,t.cloudiness)*n,minReach:Math.max(.1,t.minReach)*n,cell:n}),e.integrator===`fire`)return;let i=r.bodies,a=e.dragCoefficient;for(let e=0;e<i.length;e++){let t=i[e];t.isPinned||(t.force.x-=a*t.velocity.x,t.force.y-=a*t.velocity.y)}}return r.removeForce(`nbody`),r.removeForce(`spring`),r.addForce(`nbody`,c),r.addForce(`spring`,o),{dispose(){r.removeForce(`nbody`),r.removeForce(`spring`),r.addForce(`nbody`,a),r.addForce(`spring`,o)}}}};function pp(e,t){let n=0,r,i,a,o,s,c,l,u,d,f;return h(e.length),{apply(t,s,g){if(n=e.length,h(n),f.fill(0,0,n),n<2||!(t>0)||!(s>0))return 0;let _=t,v=_*_*_,y=_/2,b=s*v/14,x=6*b/(y*y*y*y);o.fill(-1);for(let t=0;t<n;++t){let n=e[t].pos;c[t]=n.x,l[t]=n.y,u[t]=0,d[t]=0;let s=Math.floor(n.x/_),f=Math.floor(n.y/_);r[t]=s,i[t]=f;let p=m(s,f);a[t]=o[p],o[p]=t}let S=0;for(let e=0;e<n;++e){let t=r[e],n=i[e];S+=p(e,a[e],t,n,_,v,y,b,x,s,g),S+=p(e,o[m(t+1,n)],t+1,n,_,v,y,b,x,s,g),S+=p(e,o[m(t-1,n+1)],t-1,n+1,_,v,y,b,x,s,g),S+=p(e,o[m(t,n+1)],t,n+1,_,v,y,b,x,s,g),S+=p(e,o[m(t+1,n+1)],t+1,n+1,_,v,y,b,x,s,g)}for(let t=0;t<n;++t){let n=e[t];n.isPinned||(n.force.x+=u[t],n.force.y+=d[t])}return S},get stiffness(){return f}};function p(e,n,o,s,p,m,h,g,_,v,y){let b=c[e],x=l[e],S=t[e],C=0,w=0,T=0,E=0;for(;n>=0;){if(r[n]===o&&i[n]===s&&(!y||t[n]===S)){C+=1;let t=b-c[n],r=x-l[n],i=Math.sqrt(t*t+r*r);if(i<p){if(i>1e-9)t/=i,r/=i;else{let a=(e*7919+n*104729)%360*Math.PI/180;t=Math.cos(a),r=Math.sin(a),i=0}let a,o;if(i>=h){let e=i*i*i;a=2*g*(1/e-1/m),o=6*g/(e*i)}else a=v+_*(h-i),o=_;w+=a*t,T+=a*r,E+=2*o,f[n]+=2*o,u[n]-=a*t,d[n]-=a*r}}n=a[n]}return u[e]+=w,d[e]+=T,f[e]+=E,C}function m(e,t){let n=Math.imul(e|0,73856093)^Math.imul(t|0,19349663);return(n^n>>>16)&s}function h(e){if(r&&r.length>=e)return;let t=Math.max(16,e);r=new Int32Array(t),i=new Int32Array(t),a=new Int32Array(t),c=new Float64Array(t),l=new Float64Array(t),u=new Float64Array(t),d=new Float64Array(t),f=new Float64Array(t);let n=16;for(;n<2*t;)n*=2;o=new Int32Array(n),s=n-1}}var mp=s({default:()=>vp}),hp=`v1-5-personal-space`,gp=100,_p=1.4,vp={id:`v1-5-personal-space`,title:`Personal space within a piece`,author:`v1-5 (from Feynman, Lectures on Physics I, ch. 38)`,description:`
<p>In ngraph's pictures a hub with many leaves turns into a solid ball or a tight rim of dots:
all its leaves crowd onto a few thin rings around it. The only thing that keeps nodes apart is a
long-range push, and next to a hub it loses to the springs as soon as many nodes share a small space.</p>
<p>This idea gives every node a little personal space. Two nodes of the same connected piece that
come closer than <i>Radius</i> spring lengths push each other apart, and the push grows quickly the
closer they get. Crowded nodes also move more slowly while they are crowded, so the strong push
does not make them shake; that changes how fast they settle, not where. Nodes with room to spare
feel nothing extra, so grids, trees and chains stay as they are.</p>
<p>It comes from Feynman's Lectures on Physics, Vol. 1, chapter 38 ("the size of an atom"): matter
has a size only because particles cannot all crowd into one spot; squeezing them into a space of
size r costs energy that grows like 1/r².</p>
<p>What to look for, compared with <b>none</b>: a few hundred steps in, the rings of leaves on
starOfStars and megaStars fill in and become sunbursts with visible spokes, and megaStars stops
trembling. On EVA, zoom into the hubs. grid20 should end up the same as with <b>none</b>.</p>
<p>What gets worse: more crossings around hubs, leaf fans in dense hairballs (erdos992) blur
together, and steps take about 1.1–1.3× as long. Starting the push right away
(<i>Start after</i> 0) can lock small knots into grids and trees that are still unfolding.</p>
`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: grid20`],params:[{key:`radius`,label:`Radius`,value:.8,step:`0.1`,help:`Personal space, in spring lengths: nodes of one piece that are closer push apart. Larger fills the stars more, but spreads leaves into neighbouring fans and adds crossings. 0 turns it off.`},{key:`strength`,label:`Strength`,value:2,step:`0.5`,help:`Push at half the radius, in units of a spring stretched by one spring length. Larger opens dense rings more, but crowded parts settle more slowly.`},{key:`delay`,label:`Start after`,value:400,step:`100`,help:`Steps to wait before the push starts (it then fades in over 100 steps). 0 starts it at once, which can freeze knots into grids and trees that are still unfolding.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return{};let i=e.simulator,a=i.bodies,o=null,s=-1,c=0,l=new Float64Array,u=!1,d=()=>{s=-1};return t.on(`changed`,d),e.on(`step`,p),i.addForce(hp,()=>{c+=1;let e=Math.max(0,Number(n.delay)||0),t=Math.min(1,(c-e)/gp);if(t<=0)return;a.length!==s&&m();let r=i.settings,l=Number(n.radius)*r.springLength,u=t*Number(n.strength)*r.springCoefficient*r.springLength;o.apply(l,u,!0),f(r)}),{dispose(){p(),t.off(`changed`,d),e.off(`step`,p),i.removeForce(hp)}};function f(e){let t=o.stiffness,n=e.timeStep,r=2*e.springCoefficient,i=e.integrator!==`fire`;for(let o=0;o<a.length;++o){let s=a[o],c=(t[o]+r*s.springCount)*n*n/(_p*_p);if(!(c<=l[o])){if(i){let t=e.dragCoefficient*(c/l[o]-1);s.force.x-=t*s.velocity.x,s.force.y-=t*s.velocity.y}s.mass=c,u=!0}}}function p(){if(u){for(let e=0;e<l.length&&e<a.length;++e)a[e].mass=l[e];u=!1}}function m(){let n=new Map,r=0;t.forEachNode(e=>{if(n.has(e.id))return;let i=[e.id];for(n.set(e.id,r);i.length;)t.forEachLinkedNode(i.pop(),e=>{n.has(e.id)||(n.set(e.id,r),i.push(e.id))});r+=1});let i=new Map;t.forEachNode(t=>{let r=e.getBody(t.id);r&&i.set(r,n.get(t.id))});let c=new Int32Array(a.length);for(let e=0;e<a.length;++e){let t=i.get(a[e]);c[e]=t===void 0?-1-e:t}o=pp(a,c),l=Float64Array.from(a,e=>e.mass),s=a.length}}};function yp(e,t={}){let n=e.settings,r=e.bodies,i={cells:0,crowded:0},a=0,o=0,s,c,l,u,d=0,f=0,p=new Int32Array,m=new Float64Array,h=new Float64Array;function g(e){a=e,o=a-1,s=new Int32Array(a),c=new Int32Array(a),l=new Int32Array(a),u=new Float64Array(a),f=0}function _(e,t){let n=(Math.imul(e,73856093)^Math.imul(t,19349663))&o;for(;;){if(l[n]!==f)return l[n]=f,s[n]=e,c[n]=t,u[n]=0,d++,n;if(s[n]===e&&c[n]===t)return n;n=n+1&o}}return{force:v,stats:i};function v(){if(n.dimensions!==2)return;let e=r.length;if(e===0)return;let o=n.springLength,s=(t.radius||1)*o,c=t.temperature*n.springCoefficient*o*o;if(!(c>0)||!(s>0))return;let y=(s/((t.spacing||1)*o))**2;if(a<4*e){let t=1024;for(;t<4*e;)t<<=1;g(t)}p.length<9*e&&(p=new Int32Array(9*e),m=new Float64Array(e),h=new Float64Array(e)),f+=1,f>2e9&&(l.fill(0),f=1),d=0;for(let t=0;t<e;t++){let e=r[t].pos,n=e.x/s,i=e.y/s,o=Math.round(n),c=Math.round(i),l=n-o,f=i-c;m[t]=l,h[t]=f;let y=.5*(.5-l)*(.5-l),b=.75-l*l,x=.5*(.5+l)*(.5+l),S=.5*(.5-f)*(.5-f),C=.75-f*f,w=.5*(.5+f)*(.5+f),T=9*t;for(let e=0;e<3;e++){let t=e===0?S:e===1?C:w;for(let n=0;n<3;n++){let r=n===0?y:n===1?b:x,i=_(o+n-1,c+e-1);u[i]+=r*t,p[T+3*e+n]=i}}if(2*d>a-18){g(2*a),v();return}}i.cells=d;let b=0;for(let t=0;t<e;t++){let e=r[t],n=m[t],i=h[t],a=.5*(.5-n)*(.5-n),o=.75-n*n,l=.5*(.5+n)*(.5+n),d=.5*(.5-i)*(.5-i),f=.75-i*i,g=.5*(.5+i)*(.5+i),_=-(.5-n),v=-2*n,x=.5+n,S=-(.5-i),C=-2*i,w=.5+i,T=0,E=0,D=0,O=9*t;for(let e=0;e<3;e++){let t=e===0?d:e===1?f:g,n=e===0?S:e===1?C:w;for(let r=0;r<3;r++){let i=r===0?a:r===1?o:l,s=r===0?_:r===1?v:x,c=i*t,d=u[p[O+3*e+r]]-c;T+=c*d,E+=s*t*d,D+=i*n*d}}if(T<=y||e.isPinned)continue;b++;let k=T>=2*y?1:(T-y)/y,A=-c*k/((T+.05)*s);e.force.x+=A*E,e.force.y+=A*D}i.crowded=b/e}}var bp=s({default:()=>xp}),xp={id:`v1-6-gas-pressure`,title:`Gas pressure where crowded`,author:`v1-6 (Feynman Vol 1, Ch. 40)`,description:`
<p>In ngraph's pictures of hubs with many leaves (<i>starOfStars</i>, <i>megaStars</i>), each
star is a thin ring of leaves piled on top of each other: every leaf's spring pulls it to the same
distance from its hub.</p>
<p>This idea treats the nodes as a gas. Where nodes are packed closer than about one spring length
apart, they push outward, from the crowded spot towards emptier space. How hard they push is the
"temperature". Where nodes are already that far apart, nothing changes.</p>
<p>It comes from Feynman's Lectures on Physics, Vol. 1, Chapter 40: air spreads up over a height
because its pressure, which grows with density, holds it up against gravity; with no temperature
it would all lie flat on the ground, like the leaves on their ring.</p>
<p>Look for the stars turning from thin rings into filled discs, and for hub blobs in trees
loosening. A grid should not change at all.</p>
<p>What gets worse: more edge crossings around big stars and between tree branches, as leaves
spread into their neighbours' space. Too high a temperature makes crowded parts shake.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: paTree3k`,`Benchmark: grid20`],params:[{key:`temperature`,label:`Temperature`,value:8,step:`1`,help:`How hard crowded nodes push outward. Higher gives fuller, bigger stars but more crossings. Above about 10 the crowded parts start to shake (the fire integrator has no drag, so this prototype halves the value for it). 0 turns the push off.`},{key:`spacing`,label:`Crowding spacing`,value:1,step:`0.1`,help:`Nodes push only where they are, on average, closer than this many spring lengths. Larger values reach more of the graph (trees, sparse parts); smaller values touch only the most crowded spots.`}],attach({layout:e,params:t}){let n=e.simulator,r=yp(n,{temperature:(n.settings.integrator===`fire`?.5:1)*Math.max(0,t.temperature),spacing:Math.max(.05,t.spacing),radius:1});return n.addForce(`v1-6-gas-pressure`,r.force),{dispose(){n.removeForce(`v1-6-gas-pressure`)}}}},Sp=Object.getOwnPropertyNames,Cp=(e,t)=>function(){try{return t||(0,e[Sp(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},wp=Cp({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}}),Tp=Cp({"lib/codeGenerators/generateDualTree.js"(e,t){var n=wp();t.exports=r,t.exports.generateDualTreeFunctionBody=i;function r(e){let t=i(e);return Function(t)()}function i(e){let t=[];for(let n=0;n<e;++n)t.push(n);let r=(e,n)=>t.map(e).join(n===void 0?`
`:n),i=[];for(let t=0;t<e;++t)for(let n=t;n<e;++n)i.push([t,n]);let a=(e,t)=>i.findIndex(([n,r])=>n===e&&r===t||n===t&&r===e),o=(e,n)=>t.map(t=>`j${a(e,t)} * ${n}${t}`).join(` + `),s=e===2?.875:1;return`
var D = ${e};
var JN = ${i.length};
var LEAF_SIZE = 16;
var MAX_DEPTH = 60;
var THETA_SCALE = ${s};

return function createDualTree(settings) {
  var n = 0;
  // Body index of the k-th body in tree order, and the other way around:
  var order, rank;
  // Positions, masses and fields of bodies in tree order:
  var pos, mass, field;
  // Tree topology (grows as needed):
  var nodeCapacity = 0, nodeCount = 0;
  var nodeStart, nodeEnd, nodeSkip;
  // Per node data:
  var dataCapacity = 0;
  var nodeMass, nodeCenter, nodeRadius, localField, localJacobian;

  var cellMin = [], cellSide = new Float64Array(MAX_DEPTH + 2);
  for (var depth = 0; depth < MAX_DEPTH + 2; ++depth) cellMin.push(new Float64Array(D));

  var stack = new Int32Array(1 << 12);

  return {
    computeForces: computeForces
  };

  function computeForces(bodies) {
    if (bodies.length === 0) return;
    buildTree(bodies);
    walk(settings.theta * THETA_SCALE);
    pushDown();

    var gravity = settings.gravity;
    for (var i = 0; i < n; ++i) {
      var body = bodies[i];
      if (body.isPinned) continue;
      body.reset();
      var k = rank[i];
      var g = gravity * mass[k];
      ${r(e=>`body.force.${n(e)} = g * field[k * D + ${e}];`,`
      `)}
    }
  }

  function ensureBodies(count) {
    if (count === n && order) return;
    n = count;
    order = new Int32Array(n);
    rank = new Int32Array(n);
    for (var i = 0; i < n; ++i) order[i] = i;
    pos = new Float64Array(n * D);
    mass = new Float64Array(n);
    field = new Float64Array(n * D);
  }

  function newNode(start, end) {
    if (nodeCount === nodeCapacity) {
      nodeCapacity = Math.max(1024, nodeCapacity * 2);
      nodeStart = grow(Int32Array, nodeStart, nodeCapacity);
      nodeEnd = grow(Int32Array, nodeEnd, nodeCapacity);
      nodeSkip = grow(Int32Array, nodeSkip, nodeCapacity);
    }
    var node = nodeCount++;
    nodeStart[node] = start;
    nodeEnd[node] = end;
    return node;
  }

  function ensureNodeData() {
    if (nodeCount <= dataCapacity) return;
    dataCapacity = nodeCapacity;
    nodeMass = new Float64Array(dataCapacity);
    nodeCenter = new Float64Array(dataCapacity * D);
    nodeRadius = new Float64Array(dataCapacity);
    localField = new Float64Array(dataCapacity * D);
    localJacobian = new Float64Array(dataCapacity * JN);
  }

  function buildTree(bodies) {
    ensureBodies(bodies.length);

    ${r(e=>`var min${e} = Infinity, max${e} = -Infinity;`,`
    `)}
    // Bodies are read in their own order (it is cheaper to jump in typed arrays than in objects):
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    for (var i = 0; i < n; ++i) {
      var body = bodies[i];
      var k = rank[i];
      mass[k] = body.mass;
      ${r(e=>`var p${e} = body.pos.${n(e)}; pos[k * D + ${e}] = p${e};`,`
      `)}
      ${r(e=>`if (p${e} < min${e}) min${e} = p${e}; if (p${e} > max${e}) max${e} = p${e};`,`
      `)}
    }

    var side = 0;
    ${r(e=>`if (max${e} - min${e} > side) side = max${e} - min${e};`,`
    `)}
    ${r(e=>`cellMin[0][${e}] = min${e};`,` `)}
    cellSide[0] = side * (1 + 1e-9) + 1e-9;
    nodeCount = 0;
    buildNode(0, n, 0);
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    ensureNodeData();

    // Children come after parents, so we can aggregate bottom up in reverse order:
    for (var node = nodeCount - 1; node >= 0; --node) {
      var m = 0, r = 0;
      ${r(e=>`var s${e} = 0;`,` `)}
      if (nodeSkip[node] === node + 1) {
        // Leaf: center of mass of its bodies, radius is the farthest body.
        var start = nodeStart[node], end = nodeEnd[node];
        for (var k = start; k < end; ++k) {
          var w = mass[k];
          m += w;
          ${r(e=>`s${e} += w * pos[k * D + ${e}];`,` `)}
        }
        ${r(e=>`var c${e} = s${e} / m;`,` `)}
        var r2 = 0;
        for (var k = start; k < end; ++k) {
          ${r(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          var q2 = ${r(e=>`h${e} * h${e}`,` + `)};
          if (q2 > r2) r2 = q2;
        }
        r = Math.sqrt(r2);
      } else {
        // Internal node: aggregate children, radius bounds every child's sphere.
        var skip = nodeSkip[node];
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          var w = nodeMass[c];
          m += w;
          ${r(e=>`s${e} += w * nodeCenter[c * D + ${e}];`,` `)}
        }
        ${r(e=>`var c${e} = s${e} / m;`,` `)}
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          ${r(e=>`var h${e} = nodeCenter[c * D + ${e}] - c${e};`,` `)}
          var q = Math.sqrt(${r(e=>`h${e} * h${e}`,` + `)}) + nodeRadius[c];
          if (q > r) r = q;
        }
      }
      nodeMass[node] = m;
      nodeRadius[node] = r;
      ${r(e=>`nodeCenter[node * D + ${e}] = c${e}; localField[node * D + ${e}] = 0;`,`
      `)}
      for (var t = 0; t < JN; ++t) localJacobian[node * JN + t] = 0;
    }
    for (var k = 0; k < n * D; ++k) field[k] = 0;
  }

  function buildNode(start, end, depth) {
    var node = newNode(start, end);
    if (end - start > LEAF_SIZE && depth < MAX_DEPTH) splitAxis(start, end, D - 1, 0, depth);
    nodeSkip[node] = nodeCount;
  }

  // Splits bodies of a cell one axis at a time; each non empty orthant becomes a child.
  function splitAxis(start, end, axis, bits, depth) {
    if (axis < 0) {
      var parentMin = cellMin[depth], childMin = cellMin[depth + 1], half = cellSide[depth] / 2;
      ${r(e=>`childMin[${e}] = parentMin[${e}] + ((bits >> ${e}) & 1) * half;`,`
      `)}
      cellSide[depth + 1] = half;
      buildNode(start, end, depth + 1);
      return;
    }
    var mid = partition(start, end, axis, cellMin[depth][axis] + cellSide[depth] / 2);
    if (start < mid) splitAxis(start, mid, axis - 1, bits, depth);
    if (mid < end) splitAxis(mid, end, axis - 1, bits | (1 << axis), depth);
  }

  // Bodies that are already on the correct side cost no swaps, so keeping the
  // order from the previous step makes this cheap.
  function partition(start, end, axis, pivot) {
    var i = start, j = end - 1;
    while (true) {
      while (i <= j && pos[i * D + axis] < pivot) i++;
      while (i <= j && pos[j * D + axis] >= pivot) j--;
      if (i >= j) return i;
      var t = order[i]; order[i] = order[j]; order[j] = t;
      t = mass[i]; mass[i] = mass[j]; mass[j] = t;
      var a = i * D, b = j * D;
      ${r(e=>`t = pos[a + ${e}]; pos[a + ${e}] = pos[b + ${e}]; pos[b + ${e}] = t;`,`
      `)}
      i++; j--;
    }
  }

  function push(a, b, top) {
    if (top + 2 > stack.length) stack = grow(Int32Array, stack, stack.length * 2);
    stack[top] = a;
    stack[top + 1] = b;
    return top + 2;
  }

  function walk(theta) {
    var theta2 = theta * theta;
    var top = push(0, 0, 0);
    while (top) {
      top -= 2;
      var a = stack[top], b = stack[top + 1];
      var skipA = nodeSkip[a];
      if (a === b) {
        // A cell with itself: all pairs of its children, and each child with itself.
        if (skipA === a + 1) {
          direct(nodeStart[a], nodeEnd[a], 0, nodeEnd[a], true);
          continue;
        }
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) {
          top = push(c, c, top);
          for (var u = nodeSkip[c]; u < skipA; u = nodeSkip[u]) top = push(c, u, top);
        }
        continue;
      }

      ${r(e=>`var d${e} = nodeCenter[b * D + ${e}] - nodeCenter[a * D + ${e}];`,` `)}
      var r2 = ${r(e=>`d${e} * d${e}`,` + `)};
      var radiusA = nodeRadius[a], radiusB = nodeRadius[b], radii = radiusA + radiusB;
      if (radii * radii < theta2 * r2) {
        // Far enough: exchange fields of the two cells, both ways.
        var inv2 = 1 / r2, inv3 = Math.sqrt(inv2) * inv2, inv5 = 3 * inv3 * inv2;
        var massA = nodeMass[a], massB = nodeMass[b];
        var fieldA = a * D, fieldB = b * D, jacobianA = a * JN, jacobianB = b * JN;
        ${r(e=>`var k${e} = d${e} * inv3; localField[fieldA + ${e}] += massB * k${e}; localField[fieldB + ${e}] -= massA * k${e};`,`
        `)}
        ${i.map(([e,t],n)=>`var j${n} = d${e} * d${t} * inv5${e===t?` - inv3`:``}; localJacobian[jacobianA + ${n}] += massB * j${n}; localJacobian[jacobianB + ${n}] += massA * j${n};`).join(`
        `)}
        continue;
      }

      var skipB = nodeSkip[b], isLeafA = skipA === a + 1, isLeafB = skipB === b + 1;
      if (isLeafA && isLeafB) {
        direct(nodeStart[a], nodeEnd[a], nodeStart[b], nodeEnd[b], false);
        continue;
      }
      // Too close: open the bigger cell.
      if (!isLeafA && (isLeafB || radiusA >= radiusB)) {
        for (var c = a + 1; c < skipA; c = nodeSkip[c]) top = push(c, b, top);
      } else {
        for (var c = b + 1; c < skipB; c = nodeSkip[c]) top = push(a, c, top);
      }
    }
  }

  // Exact interaction of bodies [startA, endA) with bodies [startB, endB), both ways.
  function direct(startA, endA, startB, endB, sameCell) {
    for (var i = startA; i < endA; ++i) {
      ${r(e=>`var x${e} = pos[i * D + ${e}];`,` `)}
      var massI = mass[i];
      ${r(e=>`var a${e} = 0;`,` `)}
      for (var j = sameCell ? i + 1 : startB; j < endB; ++j) {
        ${r(e=>`var d${e} = pos[j * D + ${e}] - x${e};`,` `)}
        var r2 = ${r(e=>`d${e} * d${e}`,` + `)};
        if (r2 === 0) {
          // Two bodies at the same position: push them apart as if they were a unit
          // distance apart, along an axis picked from their ids (deterministic and bounded).
          var lo = order[i] < order[j] ? order[i] : order[j];
          var hi = order[i] < order[j] ? order[j] : order[i];
          var axis = (((lo * 2654435761) ^ (hi * 40503)) >>> 0) % D;
          var sign = order[i] < order[j] ? 1 : -1;
          ${r(e=>`d${e} = axis === ${e} ? sign : 0;`,` `)}
          r2 = 1;
        }
        var inv3 = 1 / (r2 * Math.sqrt(r2)), massJ = mass[j] * inv3, massII = massI * inv3;
        ${r(e=>`a${e} += massJ * d${e}; field[j * D + ${e}] -= massII * d${e};`,`
        `)}
      }
      ${r(e=>`field[i * D + ${e}] += a${e};`,` `)}
    }
  }

  // Pushes local expansions from parents to children, and from leaves to bodies.
  function pushDown() {
    for (var node = 0; node < nodeCount; ++node) {
      var offset = node * D, jacobian = node * JN, skip = nodeSkip[node];
      ${r(e=>`var c${e} = nodeCenter[offset + ${e}], g${e} = localField[offset + ${e}];`,` `)}
      ${i.map((e,t)=>`var j${t} = localJacobian[jacobian + ${t}];`).join(` `)}
      if (skip === node + 1) {
        for (var k = nodeStart[node], end = nodeEnd[node]; k < end; ++k) {
          ${r(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          ${r(e=>`field[k * D + ${e}] += g${e} + ${o(e,`h`)};`,`
          `)}
        }
        continue;
      }
      for (var c = node + 1; c < skip; c = nodeSkip[c]) {
        var childOffset = c * D, childJacobian = c * JN;
        ${r(e=>`var h${e} = nodeCenter[childOffset + ${e}] - c${e};`,` `)}
        ${r(e=>`localField[childOffset + ${e}] += g${e} + ${o(e,`h`)};`,`
        `)}
        ${i.map((e,t)=>`localJacobian[childJacobian + ${t}] += j${t};`).join(` `)}
      }
    }
  }
};

function grow(ArrayType, array, size) {
  var bigger = new ArrayType(size);
  if (array) bigger.set(array.subarray(0, Math.min(array.length, size)));
  return bigger;
}
`}}})(),Ep=8,Dp=2;function Op(e,t,n){let r=e.bodies,i=e.springs,a=e.settings,o=Math.max(0,Number(t.contact)||0),s=!!Number(t.farPush),c=Math.max(1,Number(t.wallSlack)||1.3),l=-1,u=-1,d=new Int32Array,f=[],p=0,m=[],h=[],g,_,v,y,b,x,S=new Int32Array,C=new Int32Array,w=new Int32Array,T=new Int32Array,E=new Int32Array;if(!s){let t=e.getForces().get(`spring`);e.removeForce(`nbody`),e.removeForce(`spring`),e.addForce(`nbody`,O),t&&e.addForce(`spring`,t)}return e.addForce(`v1-7-contact-and-wall`,A),{dispose(){e.removeForce(`v1-7-contact-and-wall`)}};function D(){if(l===r.length&&u===i.length)return;l=r.length,u=i.length;let e=r.length,t=new Map;r.forEach((e,n)=>t.set(e,n));let n=new Int32Array(e);for(let t=0;t<e;t++)n[t]=t;let a=e=>{for(;n[e]!==e;)n[e]=n[n[e]],e=n[e];return e};for(let e of i){let r=a(t.get(e.from)),i=a(t.get(e.to));r!==i&&(n[r]=i)}let o=new Map;d=new Int32Array(e),f=[];for(let t=0;t<e;t++){let e=a(t),n=o.get(e);n===void 0&&(n=f.length,o.set(e,n),f.push([])),d[t]=n,f[n].push(r[t])}p=f.length,m=Array(p),h=Array(p),g=new Float64Array(p),_=new Float64Array(p),v=new Float64Array(p),y=new Float64Array(p),b=new Float64Array(p),x=new Float64Array(p),S=new Int32Array(e),C=new Int32Array(e),w=new Int32Array(e);let s=1;for(;s<2*e;)s*=2;T=new Int32Array(s),E=new Int32Array(s)}function O(){D();let t=a.nbody===`dualtree`;for(let r=0;r<p;r++){let i=f[r];if(i.length<=Ep)k(i);else if(t)h[r]||(h[r]=n.createDualTree(a)),h[r].computeForces(i);else{m[r]||(m[r]=n.createQuadTree({},e.random));let t=m[r];t.options({gravity:a.gravity,theta:a.theta}),t.insertBodies(i);for(let e of i)e.isPinned||(e.reset(),t.updateBodyForce(e))}}if(a.integrator!==`fire`){let e=a.dragCoefficient;for(let t of r)t.isPinned||(t.force.x-=e*t.velocity.x,t.force.y-=e*t.velocity.y)}}function k(t){for(let e of t)e.isPinned||e.reset();let n=a.gravity;for(let r=0;r<t.length;r++){let i=t[r];for(let a=r+1;a<t.length;a++){let r=t[a],o=r.pos.x-i.pos.x,s=r.pos.y-i.pos.y,c=o*o+s*s;c===0&&(o=(e.random.nextDouble()-.5)/50,s=(e.random.nextDouble()-.5)/50,c=o*o+s*s);let l=n*i.mass*r.mass/(c*Math.sqrt(c));i.isPinned||(i.force.x+=l*o,i.force.y+=l*s),r.isPinned||(r.force.x-=l*o,r.force.y-=l*s)}}}function A(){if(D(),p<2)return;let e=r.length;g.fill(0),_.fill(0),v.fill(0),y.fill(0),b.fill(0),x.fill(0);let t=0,n=0,i=0;for(let a=0;a<e;a++){let e=r[a],o=d[a],s=e.mass;g[o]+=s,_[o]+=s*e.pos.x,v[o]+=s*e.pos.y,t+=s,n+=s*e.pos.x,i+=s*e.pos.y}if(t>0){n/=t,i/=t,!s&&o>0&&j(),M(n,i,t);for(let t=0;t<e;t++){let e=r[t];if(e.isPinned)continue;let n=d[t],i=e.mass/g[n];e.force.x+=i*b[n],e.force.y+=i*x[n]}}}function j(){let e=0;for(let t of i){let n=t.to.pos.x-t.from.pos.x,r=t.to.pos.y-t.from.pos.y;e+=Math.sqrt(n*n+r*r)}e=i.length?e/i.length:a.springLength;let t=o*e;if(!(t>0))return;let n=Dp*a.springCoefficient,s=T.length-1,c=(e,t)=>(Math.imul(e,73856093)^Math.imul(t,19349663))&s;T.fill(-1),E.fill(-1);let l=r.length;for(let e=0;e<l;e++){let n=r[e].pos,i=Math.floor(n.x/t),a=Math.floor(n.y/t);S[e]=i,C[e]=a;let o=c(i,a);w[e]=T[o],T[o]=e,E[o]===-1?E[o]=d[e]:E[o]!==d[e]&&(E[o]=-2)}for(let e=0;e<l;e++){let i=r[e].pos,a=d[e],o=S[e],s=C[e],l=!1;for(let e=-1;e<=1&&!l;e++)for(let t=-1;t<=1;t++){let n=E[c(o+e,s+t)];if(n!==-1&&n!==a){l=!0;break}}if(l)for(let l=-1;l<=1;l++)for(let u=-1;u<=1;u++){let f=o+l,p=s+u;for(let o=T[c(f,p)];o!==-1;o=w[o]){if(o<=e||S[o]!==f||C[o]!==p)continue;let s=d[o];if(s===a)continue;let c=r[o].pos,l=i.x-c.x,u=i.y-c.y,m=Math.sqrt(l*l+u*u);if(m>=t)continue;m===0&&(l=1,u=0,m=1e-9);let h=n*(t-m)/m;b[a]+=h*l,x[a]+=h*u,b[s]-=h*l,x[s]-=h*u}}}}function M(e,t,n){let i=r.length,o=a.springLength;for(let e=0;e<i;e++){let t=r[e],n=d[e],i=t.pos.x-_[n]/g[n],a=t.pos.y-v[n]/g[n];y[n]+=t.mass*(i*i+a*a)}let s=0;for(let e=0;e<p;e++)y[e]=Math.sqrt(2*y[e]/g[e]),s+=(y[e]+o/2)*(y[e]+o/2);let l=c*Math.sqrt(s),u=Math.abs(a.gravity)*(n/i)/(o*o),f=0,m=0,h=[];for(let n=0;n<p;n++){let r=e-_[n]/g[n],i=t-v[n]/g[n],a=Math.sqrt(r*r+i*i),s=a+y[n]-l;if(s<=0||a===0)continue;let c=g[n]*u*Math.min(1,s/o)/a;h.push(n,c*r,c*i),f+=c*r,m+=c*i}for(let e=0;e<h.length;e+=3)b[h[e]]+=h[e+1],x[h[e]]+=h[e+2];for(let e=0;e<p;e++)b[e]-=g[e]*f/n,x[e]-=g[e]*m/n}}var kp=s({default:()=>jp}),Ap=null,jp={id:`v1-7-contact-push`,title:`Pieces push only on contact`,author:`v1-7 (Feynman Lectures, vol. I, ch. 47)`,description:`
<p>When a graph has one big piece and many small ones (yeast, sciMet, erdos992), ngraph shrinks the
big piece to a dark ball and leaves the small ones on a far ring, so most of the picture is empty.</p>
<p>That happens because every node pushes every other node, even across pieces, so each small piece
is pushed away by the thousands of nodes of the big one. Here a piece pushes only its own nodes, two
pieces push each other only when they touch, like stones in a bag, and a wall around all of them
(taken from the v4 prototype) keeps the bag closed.</p>
<p>The idea comes from the chapter on sound in Feynman's Lectures (vol. I, ch. 47): in a gas the push
comes only from right next door, so at rest a gas fills its container evenly, with no empty gaps.</p>
<p>Look for the big piece filling the frame with the small pieces close around it. Set <b>Push from
afar</b> to 1 to keep the same wall with the old push: the ring comes back. (Stock ngraph,
<b>none</b>, has no wall, so there the small pieces keep drifting away.)</p>
<p>What gets worse: pieces that start on top of each other stay crossed, because touching pieces only
slide apart (caterpillars; the fire integrator with a pivot start helps), and on CSphd the big tree
loses a little of its shape. 2D only; in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: erdos992`,`Benchmark: sciMet`,`Benchmark: sbm8x50`],params:[{key:`contact`,label:`Contact distance`,value:1,step:`0.1`,help:`How close two pieces may come, in average edge lengths. Larger leaves more room between pieces and fewer crossings; smaller packs them tighter. 0 turns contact off.`},{key:`farPush`,label:`Push from afar`,value:0,step:`1`,help:`0: pieces push each other only on contact (this idea). 1: every node pushes every node, as in stock ngraph, with the same wall. Compare the two to see what contact alone changes.`},{key:`wallSlack`,label:`Wall size`,value:1.3,step:`0.1`,help:`Size of the wall around all pieces, relative to their total area (1.3 is the v4 setting). Larger gives the pieces more room; with contact only, they then sit looser around the big piece.`}],attach({layout:e,params:t}){let n=e.simulator;return(n.settings.dimensions||2)===2?(Ap||={createQuadTree:Lf(2),createDualTree:Tp(2)},Op(n,t,Ap)):null}},Mp=Object.getOwnPropertyNames,Np=((e,t)=>function(){try{return t||(0,e[Mp(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}})({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}})(),Pp=new Map;function Fp(e){return Pp.has(e)||Pp.set(e,Ip(e)),Pp.get(e)}function Ip(e){let t=Lf.generateQuadTreeFunctionBody(e);return t=Lp(t,`  var theta = options.theta;
`,`  var theta = options.theta;
  var fade = options.fade;
  var farAway = 7 * fade;
`),t=Rp(t,`/ (r * r * r);`,`* Math.exp(-r / fade) / (r * r * r);`,2),t=Lp(t,`        if ((node.max_x - node.min_x) / r < theta) {`,`        if (r - 2 * (node.max_x - node.min_x) > farAway) {
          // too far away: the faded push is negligible
        } else if ((node.max_x - node.min_x) / r < theta) {`),t=Lp(t,`        if (typeof newOptions.theta === 'number') {`,`        if (typeof newOptions.fade === 'number') {
          fade = newOptions.fade;
          farAway = 7 * fade;
        }
        if (typeof newOptions.theta === 'number') {`),Function(t)()}function Lp(e,t,n){return Rp(e,t,n,1)}function Rp(e,t,n,r){let i=e.split(t);if(i.length-1!==r)throw Error(`fading push: the generated quad tree changed, cannot find "`+t.trim()+`"`);return i.join(n)}var zp=s({default:()=>Bp}),Bp={id:`v2-1-fading-push`,title:`Push fades slowly with distance`,author:`v2-1 (Feynman Vol. II reader)`,description:`
<p><b>Problem.</b> On graphs with big hubs or one big piece, ngraph draws each group as a
small dense blob, and leaves huge empty space between groups. Every group pushes on the others
like one big charge, the sum of all its nodes, so the bigger the groups, the farther apart they
end up. Zoom to fit then shrinks them to dots.</p>
<p><b>Change.</b> A node's push now fades away with distance: it is the same as before up close,
and dies out over about ten spring lengths. Far-apart groups stop pushing each other, so the
few links between them pull them together, and the groups get the room on screen.</p>
<p><b>Source.</b> Feynman, Vol. II, chapter 7-4: in salt water, each charged particle gathers a
cloud of opposite charges that cancels its push beyond a short distance (Debye screening).</p>
<p><b>Look for:</b> on starOfStars and megaStars, large stars with readable spokes filling the
frame; on EVA, hubs as spoked suns instead of red clumps; grid20 should look the same.</p>
<p><b>Gets worse:</b> big open loops (powerGrid) fill in, separate pieces (caterpillars) touch,
and trees lose some white space between branches. Smaller <i>Fade distance</i> packs stars
tighter but hurts trees more.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: grid20`],params:[{key:`fade`,label:`Fade distance`,value:10,step:`1`,help:`In spring lengths: how far a push reaches before it fades away (it drops 2.7x per this distance). 3: stars and pieces pack tight, trees and loops lose their open space. 30 and more: close to the library. 0 turns the fade off.`}],attach({layout:e,params:t}){let n=e.simulator,r=n.settings,i=Number(t.fade);if(!(i>0))return null;let a=i*r.springLength,o=Fp(r.dimensions)({gravity:r.gravity,theta:r.theta,fade:a},Vp(42)),s=n.bodies,c=[];for(let e=0;e<r.dimensions;e++)c.push(Np(e));function l(){if(s.length===0)return;o.options({gravity:r.gravity,theta:r.theta,fade:i*r.springLength});let e=r.integrator!==`fire`,t=r.dragCoefficient;o.insertBodies(s);for(let n=0;n<s.length;n++){let r=s[n];if(!r.isPinned&&(r.reset(),o.updateBodyForce(r),e))for(let e=0;e<c.length;e++)r.force[c[e]]-=t*r.velocity[c[e]]}}let u=Array.from(n.getForces().entries());return u.forEach(([e])=>n.removeForce(e)),u.forEach(([e,t])=>n.addForce(e,e===`nbody`?l:t)),null}};function Vp(e){let t=e>>>0;return{nextDouble(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}}var Hp;function Up(){if(Hp)return Hp;let e=Lf.generateQuadTreeFunctionBody(2);return e=Wp(e,`function update(sourceBody) {`,`function update(sourceBody) {
    var slabK = options.slabK;`),e=Wp(e,`v = gravity * body.mass * sourceBody.mass / (r * r * r);`,`v = gravity * body.mass * sourceBody.mass * Math.sqrt(1 + slabK * r * r) / (r * r * r);`),e=Wp(e,`v = gravity * node.mass * sourceBody.mass / (r * r * r);`,`v = gravity * node.mass * sourceBody.mass * Math.sqrt(1 + slabK * r * r) / (r * r * r);`),Hp=Function(e)(),Hp}function Wp(e,t,n){if(e.indexOf(t)<0)throw Error(`slabPush: generated quad tree changed, cannot find: `+t);return e.replace(t,n)}function Gp(e,t){let n=e.settings,r={gravity:n.gravity,theta:n.theta,slabK:0},i=Up()(r,e.random);return function(){let a=e.bodies;if(a.length===0)return;let o=t();r.slabK=o>0?4/(o*o):0,i.options({gravity:n.gravity,theta:n.theta});let s=n.integrator!==`fire`,c=n.dragCoefficient;i.insertBodies(a);for(let e=0;e<a.length;++e){let t=a[e];t.isPinned||(t.reset(),i.updateBodyForce(t),s&&(t.force.x-=c*t.velocity.x,t.force.y-=c*t.velocity.y))}}}var Kp=s({default:()=>qp}),qp={id:`v2-2-balancing-pull`,title:`Balancing pull for graphs in pieces`,author:`v2-2 (Feynman Vol. 2 reader)`,description:`
<p><b>Problem.</b> When a graph comes in several pieces, nothing holds the pieces together: they
drift far away, and zoom-to-fit shrinks the main piece to a small dense ball in a mostly empty
picture. A wall around the layout (tried for v4) only moves the pieces onto a ring at the wall.</p>
<p><b>Change.</b> Instead of a wall, every node gets a gentle pull toward the middle. The pull
grows with distance and is sized to cancel the nodes' push on each other exactly when they are
spread evenly. Then pieces stop right at the edge of the main piece. For the cancelling to work,
the push between far-apart nodes has to weaken more slowly with distance than it does today; up
close it is unchanged. This only switches on for graphs in more than one piece.</p>
<p><b>Where it comes from.</b> Feynman Lectures, Vol. 2, ch. 8–12. Things that push each other
away (like charges) and are kept in by a metal wall all end up pressed against the wall. An even
background of opposite charge holds them evenly spread instead, as in a plasma.</p>
<p><b>Look for.</b> The main piece fills the screen and its inner structure shows. The small
pieces sit just around it, not far away. Compare with <b>none</b>. On grid20 (one piece) nothing
changes.</p>
<p><b>Worse.</b> Small pieces get pressed against the main one, and graphs made mostly of tiny
pieces (try protein) get crowded. A step costs about the same as the stock layout. This always
uses the plain tree for the push, so it is slower than the "dual tree" setting if you picked that.
2D only; in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: sciMet`,`Benchmark: CSphd`,`Benchmark: grid20`],params:[{key:`strength`,label:`Pull strength`,value:1,step:`0.1`,help:`1 = the pull exactly cancels the push, so pieces settle at the edge of the main piece. 0 turns the pull off (pieces drift away, as in none). Above 1 the small pieces get squeezed into the main one.`},{key:`reach`,label:`Long push from`,value:2,step:`0.5`,help:`In spring lengths. Beyond this distance the push weakens as 1/distance instead of today's 1/distance², like in a flat world; the pull stays the same. Smaller: the main piece opens up more. 0 or large (e.g. 100) brings back today's push, and then the pull drags small pieces inside the main one (try CSphd).`},{key:`always`,label:`Also on one-piece graphs`,value:0,step:`1`,help:`1 = use it even when the graph is in one piece (try grid20): the pull squeezes the shape into a disc. That is why it is off there by default.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2||Yp(t)<2&&!(Number(n.always)>0))return{};let i=e.simulator,a=i.settings,o=Math.max(0,Number(n.strength)||0),s=Math.max(0,Number(n.reach)||0),c=()=>s*a.springLength,l=i.getForces().get(`spring`);return i.removeForce(`nbody`),i.removeForce(`spring`),i.addForce(`v2-2-slab-push`,Gp(i,c)),i.addForce(`spring`,l),o>0&&i.addForce(`v2-2-balancing-pull`,()=>Jp(i,o)),{}}};function Jp(e,t){let n=e.bodies,r=n.length;if(r<2)return;let i=e.settings,a=i.springLength,o=0,s=0,c=0;for(let e=0;e<r;++e){let t=n[e];o+=t.mass,s+=t.mass*t.pos.x,c+=t.mass*t.pos.y}s/=o,c/=o;let l=Math.abs(i.gravity)/a,u=r*a*a/Math.PI,d=t*l*o/u;for(let e=0;e<r;++e){let t=n[e];t.isPinned||(t.force.x-=d*t.mass*(t.pos.x-s),t.force.y-=d*t.mass*(t.pos.y-c))}}function Yp(e){let t=new Set,n=0;return e.forEachNode(r=>{if(t.has(r.id))return;n+=1;let i=[r.id];for(t.add(r.id);i.length;){let n=i.pop();e.forEachLinkedNode(n,e=>{t.has(e.id)||(t.add(e.id),i.push(e.id))})}}),n}var Xp=Object.getOwnPropertyNames,Zp=(e,t)=>function(){try{return t||(0,e[Xp(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},Qp=Zp({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}}),$p=Zp({"lib/codeGenerators/createPatternBuilder.js"(e,t){var n=Qp();t.exports=function(e){return t;function t(t,r){let i=r&&r.indent||0,a=r&&r.join!==void 0?r.join:`
`,o=Array(i+1).join(` `),s=[];for(let r=0;r<e;++r){let e=n(r),i=r===0?``:o;s.push(i+t.replace(/{var}/g,e))}return s.join(a)}}}}),em=Zp({"lib/codeGenerators/generateCreateDragForce.js"(e,t){var n=$p();t.exports=r,t.exports.generateCreateDragForceFunctionBody=i;function r(e){let t=i(e);return Function(`options`,t)}function i(e){return`
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    update: function(body) {
      ${n(e)(`body.force.{var} -= options.dragCoefficient * body.velocity.{var};`,{indent:6})}
    }
  };
`}}})(),tm=s({default:()=>rm}),nm={},rm={id:`v2-3-flat-world`,title:`Flat-world push plus balancing pull`,author:`v2-3 (Feynman Vol. II reader)`,description:`
<p><b>Problem.</b> On graphs with one big piece and many small ones (yeast, sciMet, CSphd), the
big piece shrinks to a small dense ball in the middle and the small pieces sit far out on a ring.
Most of the picture is empty.</p>
<p><b>Change.</b> Two things together. Nodes push each other apart with a force that weakens as
1/distance, the way charges push in a flat world, instead of 1/distance², the way they push in
our 3D world. And an even pull toward the middle exactly balances that total push: think of the
nodes as standing on a disc of opposite charge. Where the nodes are spread as evenly as the disc,
push and pull cancel; only crowding or empty space is felt.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, Ch. 18 (Gauss's law in the table of
Maxwell's equations) and Ch. 20 (how a point charge's field follows from the dimension of space).</p>
<p><b>What to look for.</b> Compare with <b>none</b>: the big piece fills most of the frame and
shows its inner structure, and the small pieces sit right next to it. Communities (sbm8x50)
separate a little more. Set <i>Balance</i> to 0 to see the flat-world push alone (stars collapse,
pieces fly far away), or <i>Falloff</i> to 2 to see the pull with today's push (grids fold).</p>
<p><b>What gets worse.</b> Grids bow outward into a pillow shape. Isolated nodes pile up in a band
at the rim (protein, EVA), and touching pieces crowd each other (caterpillars). Star fans are not
helped. 2D only: in 3D the layout is left unchanged.</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: CSphd`,`Benchmark: sciMet`,`Benchmark: sbm8x50`,`Benchmark: starOfStars`],params:[{key:`spacing`,label:`Spacing`,value:1.5,step:`0.1`,help:`Room per node in the balancing disc, in spring lengths. Smaller: tighter, more even fill, but grids bend into a disc (1.0). Larger: flatter grids, but pieces drift further out (2.0+).`},{key:`balance`,label:`Balance`,value:1,step:`0.1`,help:`How much of the total push the pull cancels: 1 = all of it (neutral layout), 0 = no pull at all (flat-world push alone).`},{key:`falloff`,label:`Falloff`,value:1,step:`1`,help:`1 = flat-world push (1/distance), the idea. 2 = the library's push (1/distance²) with the same pull: plain centre gravity, to show why the two halves must match.`}],attach({layout:e,params:t}){let n=e.simulator;if(n.settings.dimensions!==2)return null;let r=Math.max(.1,im(t.spacing,1.5)),i=Math.max(0,im(t.balance,1)),a=im(t.falloff,1)===2?2:1,o=n.bodies;if(a===1){let e=n.getForces().get(`spring`),t=am()({gravity:n.gravity(),theta:n.theta()},n.random),r=em(2)(n.settings);n.removeForce(`nbody`),n.removeForce(`spring`),n.addForce(`nbody`,()=>{let e=n.gravity()/n.springLength();t.options({gravity:e,theta:n.theta()}),t.insertBodies(o);let a=n.integrator()!==`fire`;for(let e=0;e<o.length;++e){let n=o[e];n.isPinned||(n.reset(),t.updateBodyForce(n),a&&r.update(n))}i>0&&s(-e)}),n.addForce(`spring`,e)}else i>0&&n.addForce(`v2-3-pull`,()=>s(-n.gravity()/n.springLength()));function s(e){let t=0,a=0,s=0;for(let e=0;e<o.length;++e){let n=o[e];t+=n.mass,a+=n.mass*n.pos.x,s+=n.mass*n.pos.y}if(!(t>0))return;a/=t,s/=t;let c=r*n.springLength()*Math.sqrt(o.length/Math.PI),l=c*c,u=e*i*t;for(let e=0;e<o.length;++e){let t=o[e];if(t.isPinned)continue;let n=t.pos.x-a,r=t.pos.y-s,i=n*n+r*r,c=-u*t.mass/(i>l?i:l);t.force.x+=c*n,t.force.y+=c*r}}return{}}};function im(e,t){let n=Number(e);return e===void 0||e===``||!Number.isFinite(n)?t:n}function am(){if(nm.flat)return nm.flat;let e=Lf.generateQuadTreeFunctionBody(2),t=e.split(`/ (r * r * r)`).join(`/ (r * r)`);if(t===e)throw Error(`v2-3-flat-world: quad tree kernel not found`);return nm.flat=Function(t)(),nm.flat}var om=1024,sm=9,cm=null;function lm(e,t){cm||=um();let n={mu:0,scale:om/sm,xMax:sm,c:1,cutoff:1/0,table:pm()},r=cm(n)(e,t);return{insertBodies:r.insertBodies,updateBodyForce:r.updateBodyForce,options:r.options,setReach(e,t){e>0?(n.mu=1/e,n.cutoff=sm*e):(n.mu=0,n.cutoff=1/0),n.c=1/(t*mm(n.table,n.mu*t))}}}function um(){let e=Lf.generateQuadTreeFunctionBody(2),t=e=>`
        var x = r * K.mu;
        if (x >= K.xMax) {
          v = 0;
        } else {
          var q = x * K.scale, i = q | 0, t = K.table;
          v = gravity * ${e} * sourceBody.mass * K.c * (t[i] + (t[i + 1] - t[i]) * (q - i)) / (r * r);
        }`;return e=dm(e,`v = gravity * body.mass * sourceBody.mass / (r * r * r);`,t(`body.mass`)),e=dm(e,`v = gravity * node.mass * sourceBody.mass / (r * r * r);`,t(`node.mass`)),e=dm(e,`if ((node.max_x - node.min_x) / r < theta) {`,`if (r - 0.71 * (node.max_x - node.min_x) > K.cutoff) {
        } else if ((node.max_x - node.min_x) / r < theta) {`),Function(`K`,e)}function dm(e,t,n){let r=e.indexOf(t);if(r<0||e.indexOf(t,r+t.length)>=0)throw Error(`Library quad tree code changed, cannot patch: `+t);return e.slice(0,r)+n+e.slice(r+t.length)}var fm=null;function pm(){if(fm)return fm;fm=new Float64Array(1026);for(let e=0;e<fm.length;e++){let t=e/om*sm;fm[e]=t===0?1:t>=sm?0:t*gm(t)}return fm}function mm(e,t){if(t>=sm)return 0;let n=om/sm*t,r=n|0;return e[r]+(e[r+1]-e[r])*(n-r)}function hm(e){let t=e/3.75,n=t*t;return e*(.5+n*(.87890594+n*(.51498869+n*(.15084934+n*(.02658733+n*(.00301532+n*32411e-8))))))}function gm(e){if(e<=2){let t=e*e/4;return Math.log(e/2)*hm(e)+1/e*(1+t*(.15443144+t*(-.67278579+t*(-.18156897+t*(-.01919402+t*(-.00110404+t*-4686e-8))))))}let t=2/e;return Math.exp(-e)/Math.sqrt(e)*(1.25331414+t*(.23498619+t*(-.0365562+t*(.01504268+t*(-.00780353+t*(.00325614+t*-68245e-8))))))}var _m=s({default:()=>vm}),vm={id:`v2-4-limited-reach`,title:`Push with a limited reach`,author:`v2-4 (Feynman Vol. II, ch. 23-29)`,description:`
<p><b>Problem.</b> Nodes push each other apart with a law made for 3-D space, and the push never
stops, however far away two nodes are. In a flat picture that has two bad effects. Up close the
push fades too fast, so crowded cores and the leaves around big hubs are squeezed into small dense
discs. Far away it never stops, so heavy hubs and whole components shove each other across the
screen, and zoom-to-fit leaves the structure small in a lot of empty space.</p>
<p><b>Change.</b> Here the push fades more gently up close (as 1/distance instead of
1/distance<sup>2</sup>) but has a <i>reach</i>: beyond a few spring lengths it dies out
quickly. Nearby nodes still keep their room. Distant stars and pieces stop shoving each other,
and the springs between them pull the picture together.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, ch. 28-6: Yukawa's equation for a
force with a limited range, solved here for a plane instead of 3-D space (its solution there is a
Bessel function, ch. 23).</p>
<p><b>Look for.</b> On megaStars and starOfStars the stars grow into large bursts that fill the
screen. On sciMet and yeast the core opens up and stays large; with <i>none</i> the small
pieces keep flying outward and the core shrinks to a dot. Trees such as binTree8 should look
about the same.</p>
<p><b>Gets worse.</b> Groups in community graphs get denser inside. Thousands of tiny pieces
(EVA) crowd together. A short reach (2 or less) starts to fold trees. <i>Reach 0</i> means
"no limit": the gentler law alone, which blows hub graphs apart. Try it on megaStars to see
why the reach matters.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: sciMet`,`Benchmark: yeast`,`Benchmark: binTree8`],params:[{key:`reach`,label:`Reach (spring lengths)`,value:4,step:`0.5`,help:`How far the push reaches before it fades out, in spring lengths. Smaller: bigger stars and tighter pieces, but trees start to fold below about 2. Larger: closer to the library. 0 means no limit. At one spring length two nodes push exactly as hard as in the library.`}],attach({layout:e,params:t}){let n=e.simulator,r=n.settings;if(r.dimensions!==2)return null;let i=n.getForces(),a=i.get(`nbody`);if(!a)return null;let o=lm({gravity:r.gravity,theta:r.theta},n.random),s=r.springLength,c=Math.max(0,Number(t.reach)||0)*s;o.setReach(c,s);let l=[];i.forEach((e,t)=>{t!==`nbody`&&l.push([t,e])}),l.forEach(([e])=>n.removeForce(e)),n.removeForce(`nbody`),n.addForce(`nbody`,u),l.forEach(([e,t])=>n.addForce(e,t));function u(){let e=n.bodies;if(e.length===0)return;o.options({gravity:r.gravity,theta:r.theta});let t=r.integrator===`fire`?0:r.dragCoefficient;o.insertBodies(e);for(let n=e.length-1;n>=0;--n){let r=e[n];r.isPinned||(r.reset(),o.updateBodyForce(r),t&&(r.force.x-=t*r.velocity.x,r.force.y-=t*r.velocity.y))}}return{dispose(){if(n.getForces().get(`nbody`)!==u)return;let e=[];n.getForces().forEach((t,n)=>{n!==`nbody`&&e.push([n,t])}),e.forEach(([e])=>n.removeForce(e)),n.removeForce(`nbody`),n.addForce(`nbody`,a),e.forEach(([e,t])=>n.addForce(e,t))}}}};function ym(e,t,n={}){let r=n.temperature>0?n.temperature:.3,i=0;for(let n=0;n<e;++n)i+=t[n].length;let a=Math.min(300,Math.max(60,Math.floor(2e8/Math.max(1,4*i)))),o=8,s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),c=new Float64Array(e*4),l=new Float64Array(e*4);for(let e=0;e<c.length;++e)c[e]=.01*(s()-.5);let u=new Float64Array(4),d=new Float64Array(4);for(let n=0;n<a;++n){u.fill(0);for(let t=0;t<e;++t)for(let e=0;e<4;++e)u[e]+=c[t*4+e];for(let t=0;t<4;++t)u[t]/=e;for(let n=0;n<e;++n){let e=t[n],i=e.length;d.fill(0);for(let t=0;t<i;++t){let n=e[t]*4;for(let e=0;e<4;++e)d[e]+=c[n+e]}let a=0;for(let e=0;e<4;++e)d[e]=(i?d[e]/i:0)-1*u[e],a+=d[e]*d[e];a=Math.sqrt(a);let o=a>0?Math.tanh(a/r)/a:0;for(let e=0;e<4;++e)l[n*4+e]=.5*c[n*4+e]+.5*d[e]*o}let n=c;c=l,l=n}return{spins:c,rounds:a}}function bm(e,t,n){let r=new Int32Array(e);for(let t=0;t<e;++t){let e=0,i=-1;for(let r=0;r<4;++r){let a=Math.abs(n[t*4+r]);a>i&&(i=a,e=2*r+(n[t*4+r]>0?0:1))}r[t]=e}let i=0,a=0,o=0,s=new Float64Array(8),c=new Float64Array(8);for(let l=0;l<e;++l){let e=t[l];s[r[l]]+=e.length;for(let t=0;t<e.length;++t){let s=e[t];if(s<=l)continue;i+=1;let u=0;for(let e=0;e<4;++e)u+=n[l*4+e]*n[s*4+e];u<.5&&(a+=1),r[l]===r[s]&&(o+=1,c[r[l]]+=1)}}let l=0;if(i>0)for(let e=0;e<8;++e)l+=c[e]/i-(s[e]/(2*i))**2;let u=new Set(r).size;return{wallShare:i?a/i:0,modularity:l,domainCount:u,links:i}}function xm(e,t,n){let r=e.length,i=n.boost/2,a=n.getTheta,o=n.getGravity,s=new Float64Array(r),c=new Float64Array(r),l=new Float64Array(r),u=new Int32Array(r),d=0,f,p,m,h,g,_,v,y,b,x,S=0;w(Math.max(64,4*r));let C=new Int32Array(168);return{apply:A};function w(e){let t={x0:f,y0:p,size:m,child:h,leaf:g,leafCount:_,nodeMass:v,sumX:y,sumY:b,sumSpin:x};f=new Float64Array(e),p=new Float64Array(e),m=new Float64Array(e),h=new Int32Array(4*e),g=new Int32Array(e),_=new Int32Array(e),v=new Float64Array(e),y=new Float64Array(e),b=new Float64Array(e),x=new Float64Array(4*e),d&&(f.set(t.x0),p.set(t.y0),m.set(t.size),h.set(t.child),g.set(t.leaf),_.set(t.leafCount),v.set(t.nodeMass),y.set(t.sumX),b.set(t.sumY),x.set(t.sumSpin)),d=e}function T(e,t,n){S===d&&w(2*d);let r=S++;return f[r]=e,p[r]=t,m[r]=n,g[r]=-1,_[r]=0,h[4*r]=h[4*r+1]=h[4*r+2]=h[4*r+3]=-1,r}function E(e,t,n){let r=m[e]/2;return+(t>=f[e]+r)+(n>=p[e]+r?2:0)}function D(e,t){let n=h[4*e+t];if(n<0){let r=m[e]/2;n=T(f[e]+(t&1?r:0),p[e]+(t&2?r:0),r),h[4*e+t]=n}return n}function O(){let n=1/0,i=1/0,a=-1/0,o=-1/0;for(let t=0;t<r;++t){let r=e[t].pos;s[t]=r.x,c[t]=r.y,l[t]=e[t].mass,s[t]<n&&(n=s[t]),s[t]>a&&(a=s[t]),c[t]<i&&(i=c[t]),c[t]>o&&(o=c[t])}S=0;let d=T(n,i,Math.max(a-n,o-i,1e-9)*1.000001);for(let e=0;e<r;++e)k(d,e);for(let e=S-1;e>=0;--e){let n=0,r=0,i=0,a=4*e;for(let e=0;e<4;++e)x[a+e]=0;if(g[e]>=0)for(let o=g[e];o>=0;o=u[o]){n+=l[o],r+=l[o]*s[o],i+=l[o]*c[o];for(let e=0;e<4;++e)x[a+e]+=l[o]*t[4*o+e]}else for(let t=0;t<4;++t){let o=h[4*e+t];if(!(o<0)){n+=v[o],r+=y[o],i+=b[o];for(let e=0;e<4;++e)x[a+e]+=x[4*o+e]}}v[e]=n,y[e]=r,b[e]=i}return d}function k(e,t){let n=e,r=0;for(u[t]=-1;;){if(h[4*n]>=0||h[4*n+1]>=0||h[4*n+2]>=0||h[4*n+3]>=0){n=D(n,E(n,s[t],c[t])),r+=1;continue}let e=g[n];if(_[n]<8||r>=40||s[e]===s[t]&&c[e]===c[t]){u[t]=e,g[n]=t,_[n]+=1;return}g[n]=-1,_[n]=0;for(let t=e;t>=0;){let e=u[t],r=D(n,E(n,s[t],c[t]));u[t]=g[r],g[r]=t,_[r]+=1,t=e}n=D(n,E(n,s[t],c[t])),r+=1}}function A(){if(r<2)return;let n=Math.max(1,a()),d=o(),f=O();for(let a=0;a<r;++a){let r=e[a];if(r.isPinned)continue;let o=s[a],p=c[a],_=4*a,S=0,w=0,T=0;for(C[T++]=f;T;){let e=C[--T];if(g[e]>=0){for(let n=g[e];n>=0;n=u[n]){if(n===a)continue;let e=0;for(let r=0;r<4;++r)e+=t[_+r]*t[4*n+r];if(e>.99)continue;let r=s[n]-o,i=c[n]-p,u=r*r+i*i;if(u===0)continue;let d=l[n]*(1-e)/(u*Math.sqrt(u));S+=d*r,w+=d*i}continue}let r=v[e];if(r===0)continue;let i=y[e]/r-o,d=b[e]/r-p,f=i*i+d*d;if(f>0&&m[e]*m[e]<n*n*f){let n=0;for(let r=0;r<4;++r)n+=t[_+r]*x[4*e+r];let a=(r-n)/(f*Math.sqrt(f));S+=a*i,w+=a*d}else for(let t=0;t<4;++t){let n=h[4*e+t];n>=0&&(C[T++]=n)}}let E=i*d*l[a];r.force.x+=E*S,r.force.y+=E*w}}}var Sm=s({default:()=>Cm}),Cm={id:`v2-5-magnetic-domains`,title:`Magnetic domains decide who repels`,author:`reader v2-5 (Feynman Vol. 2, Ch. 35-36)`,description:`
<p>On graphs made of groups, like <i>communities</i> or <i>sbm8x50</i>, ngraph draws one even
blob: the groups touch and you can't tell where one ends.</p>
<p>This idea first lets nodes vote with their neighbors. Every node holds a little arrow, like a
compass needle, and keeps turning it toward the average arrow of its neighbors, while a weak pull
stops the whole graph from agreeing on one direction. After a few hundred rounds the arrows settle
into patches that point the same way, called <b>domains</b>, and on these graphs the domains are the
groups. Then two nodes whose arrows disagree push each other up to 11 times harder than before.</p>
<p>It comes from the physics of magnets (Feynman Lectures, Vol. 2, Ch. 35 and 36): neighboring atoms
in iron line up their tiny magnets, and below a critical temperature the metal splits into domains.</p>
<p>Look for separate clusters with open space between them, where <b>none</b> shows one disc. What gets
worse: edge crossings don't go down, edges between groups get longer, and loosely grouped graphs
like Miserables get stretched. Grids, trees, random and tree-like graphs are recognized and left
unchanged (try <i>grid20</i>) unless you set <i>Auto-off</i> to 0. 2D only: with 3 or more dimensions
it does nothing. The browser console says whether it switched on and why.</p>`,tryGraphs:[`Benchmark: communities`,`Benchmark: sbm8x50`,`Groups 8x250 (2k)`,`Benchmark: grid20`],params:[{key:`boost`,label:`Push between groups`,value:10,step:`1`,help:`How much harder two nodes in different domains push apart: up to 1 + this times the normal push. 0 turns the idea off. 10 is the tested default; more separates groups further but stretches loosely grouped graphs.`},{key:`temperature`,label:`Temperature`,value:.3,step:`0.1`,help:`How firmly nodes settle into domains. Low (0.1-0.5): firm domains. Around 0.8 and above the arrows stay random (the "Curie point" of a magnet), no domains form and nothing changes.`},{key:`autoOff`,label:`Auto-off`,value:1,step:`1`,help:`1: skip graphs without dense groups (grids, meshes, trees, random graphs, graphs with fewer than 1.5 links per node). 0: always apply, to see what it does to a grid (it warps).`}],attach({layout:e,graph:t,params:n,settings:r}){let i=Number(n.boost);if(!(i>0))return{};if((r.dimensions||2)!==2)return console.info(`[magnetic domains] 2D only; doing nothing for dimensions =`,r.dimensions),{};let a=[],o=new Map;if(t.forEachNode(t=>{let n=e.getBody(t.id);n&&(o.set(t.id,a.length),a.push(n))}),a.length<3)return{};let s=a.map(()=>[]);t.forEachLink(e=>{let t=o.get(e.fromId),n=o.get(e.toId);t!==void 0&&n!==void 0&&t!==n&&(s[t].push(n),s[n].push(t))});let c=performance.now(),{spins:l,rounds:u}=ym(a.length,s,{temperature:Number(n.temperature)}),d=bm(a.length,s,l),f=Math.round(performance.now()-c),p=d.wallShare>=.01,m=d.modularity>=.5,h=d.links>=1.5*a.length,g=`${d.domainCount} domains, ${(100*d.wallShare).toFixed(1)}% of links cross a wall, modularity ${d.modularity.toFixed(2)}, ${(d.links/a.length).toFixed(1)} links per node (${u} rounds, ${f} ms)`;if(Number(n.autoOff)!==0&&!(p&&m&&h))return console.info(`[magnetic domains] off: ${p?m?`tree-like graph, nothing dense to separate`:`domains no better than in a random graph`:`no sharp walls between domains (grid, mesh or tree)`}. ${g}`),{};console.info(`[magnetic domains] on: ${g}`);let _=e.simulator,v=xm(a,l,{boost:i,getTheta:()=>_.theta(),getGravity:()=>_.gravity()}),y=`v2-5-domain-repulsion`;return _.addForce(y,v.apply),{dispose(){_.removeForce(y)}}}};function wm(e,t){let n=[],r=new Map;e.forEachNode(e=>{r.set(e.id,n.length),n.push(e.id)});let i=n.length,a=Array.from({length:i},()=>[]);e.forEachLink(e=>{let t=r.get(e.fromId),n=r.get(e.toId);t!==void 0&&n!==void 0&&t!==n&&(a[t].push(n,e.id),a[n].push(t,e.id))});let o=new Int32Array(i).fill(-1),s=new Int32Array(i),c=new Int32Array(i),l=new Int32Array(i).fill(-1),u=Array(i),d=new Int32Array(i),f=[],p=0;for(let e=0;e<i;++e){if(o[e]>=0)continue;let t=f.length,n=0,r=[e],i=[0];for(o[e]=s[e]=p++,c[e]=1,d[e]=t,n+=1;r.length;){let e=r.length-1,f=r[e],m=a[f];if(i[e]<m.length){let a=m[i[e]],h=m[i[e]+1];i[e]+=2,o[a]<0?(l[a]=f,u[a]=h,o[a]=s[a]=p++,c[a]=1,d[a]=t,n+=1,r.push(a),i.push(0)):h!==u[f]&&o[a]<s[f]&&(s[f]=o[a])}else{r.pop(),i.pop();let e=l[f];e>=0&&(s[f]<s[e]&&(s[e]=s[f]),c[e]+=c[f])}}f.push(n)}let m=new Map,h=new Map;for(let e=0;e<i;++e){let r=l[e];if(r<0||s[e]<=o[r])continue;let i=c[e],a=f[d[e]]-i,p,g;if(i<=t&&i<a)p=r,g=i;else if(a<=t&&a<i)p=e,g=a;else continue;let _=n[p];m.set(_,(m.get(_)||0)+g),h.set(u[e],_)}return{load:m,hubOfLink:h}}var Tm=s({default:()=>Om}),Em=7,Dm=7,Om={id:`v2-6-soft-leaf-links`,title:`Longer, softer leaf links`,author:`v2-6 (Feynman Vol. 2 reader)`,description:`
<p>ngraph draws a hub with hundreds of leaves (nodes with a single link) as a small solid disk:
every link has the same length, so the leaves pile up while most of the screen stays empty.</p>
<p>This idea gives a hub's leaves, and any tiny side branches hanging off it by one link, links
long enough for a flat disk to hold them all: about the square root of (count + 1) / 7 times the
usual length, so 3.8 times for 100 leaves. Those links are also made softer by the same factor,
like a longer rubber band, so the leaves spread over the disk instead of lining its rim. They grow
to the new length over the first 800 steps, and every other link stays as it is.</p>
<p>It comes from Feynman's Lectures, Vol. 2, chapter 42, where a bug on a hot plate, whose rulers
stretch with the heat, measures a curved world on a flat plate; the softening is Hooke's law for a
rod (chapter 38).</p>
<p>Look for big, readable stars that fill the screen on starOfStars and megaStars, where
<b>none</b> shows tight disks; ba500 has no leaves, so nothing changes there. Worse: more
crossings, as links between hubs now cut across neighbouring stars, and EVA's main piece gets more
crowded. 2D only: in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: ba500`],params:[{key:`room`,label:`Room per leaf`,value:1,step:`0.25`,help:`How much area each fan node gets, compared with a node in a flat honeycomb. 1 is the tested value; 2 makes stars about 1.4 times wider, 0.5 smaller. 0 turns the idea off.`},{key:`soften`,label:`Softening`,value:1,step:`0.25`,help:`How much softer the longer links get. 1: as soft as a rod that much longer (Hooke). 0: as stiff as before, so leaves line the rim like an umbrella and neighbouring stars overlap.`},{key:`grow`,label:`Steps to grow`,value:800,step:`100`,help:`The fan links grow from their usual length to the new one over this many steps. Growing them at once lets a big star swallow a small neighbour, which then takes thousands of steps to get out. 0: all at once.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let i=Math.max(0,Number(n.room)),a=Math.max(0,Number(n.soften)),o=Math.max(0,Math.round(Number(n.grow)||0));if(!(i>0))return null;let{load:s,hubOfLink:c}=wm(t,Dm),l=[];if(c.forEach((t,n)=>{let r=e.getSpring(n);if(!r)return;let a=Math.max(1,Math.sqrt(i*(s.get(t)+1)/Em));a>1&&l.push({spring:r,factor:a})}),l.length===0)return null;let u=e.simulator,d=0,f,p,m;return g(),e.on(`step`,h),{dispose(){e.off(`step`,h)}};function h(){d+=1,g()}function g(){let e=u.springLength(),t=u.springCoefficient(),n=o>0?Math.min(1,d/o):1;if(e!==f||t!==p||n!==m){f=e,p=t,m=n;for(let r=0;r<l.length;++r){let{spring:i,factor:o}=l[r],s=1+(o-1)*n;i.length=e*s,i.coefficient=t/s**+a}}}}};function km(e,t,n){let r=n.spacing,i=n.rimBonds,a=Am(1,r),o=new Map;e.forEachLink(n=>{let r=n.fromId,i=n.toId;if(r===i)return;let a=jm(e,r)===1;if(a===(jm(e,i)===1))return;let s=a?i:r,c=t.getSpring(n);if(!c)return;let l=o.get(s);l||o.set(s,l=[]),l.push({spring:c,leaf:a?r:i})});let s=new Map,c=new Map,l=[],u=0,d=0,f=1;return o.forEach((e,t)=>{if(e.length<=a)return;let n=1,i=0;for(let a=0;a<e.length;a++){i>=Am(n,r)&&(n+=1,i=0);let o=1+(n-1)*r;l.push({hub:t,leaf:e[a].leaf,radius:o,angle:2*Math.PI*i/Am(n,r)+n}),i+=1,n>1&&(u+=1),s.set(e[a].spring,o)}d+=1,n>f&&(f=n),c.set(t,n*r)}),i&&c.size&&e.forEachLink(n=>{let r=n.fromId,i=n.toId;if(r===i||jm(e,r)===1||jm(e,i)===1)return;let a=(c.get(r)||0)+(c.get(i)||0);if(a===0)return;let o=t.getSpring(n);o&&s.set(o,1+a)}),{lengths:s,seats:l,changedLeaves:u,filledHubs:d,maxRings:f}}function Am(e,t){return Math.floor(2*Math.PI*(1+(e-1)*t)/t)}function jm(e,t){let n=e.getLinks(t);return n?n.size===void 0?n.length:n.size:0}function Mm(e,t,n=1){let r=e.simulator,i=r.settings,a=Lf(2)({gravity:i.gravity,theta:i.theta},r.random),o=-1,s=[],c=[],l=new Uint8Array,u=new Int32Array,d=new Int32Array,f=new Int32Array,p=new Int32Array;return function(){let e=r.bodies;if(e.length===0)return;e.length!==o&&m(e),a.options({gravity:i.gravity,theta:i.theta}),a.insertBodies(s);for(let t=0;t<e.length;t++){let n=e[t];n.isPinned||(n.reset(),a.updateBodyForce(n))}if(h(e,n*i.springLength,i.gravity),i.integrator===`fire`)return;let t=i.dragCoefficient;for(let n=0;n<e.length;n++){let r=e[n];r.isPinned||(r.force.x-=t*r.velocity.x,r.force.y-=t*r.velocity.y)}};function m(e){o=e.length,s=[],c=[],l=new Uint8Array(o);for(let n=0;n<o;n++)t(e[n].id)?(l[n]=1,c.push(e[n])):s.push(e[n]);u=new Int32Array(o),d=new Int32Array(o),f=new Int32Array(o);let n=1;for(;n<2*o;)n*=2;p=new Int32Array(n)}function h(e,t,n){let i=e.length,a=p.length-1;p.fill(-1);for(let n=0;n<i;n++){let r=Math.floor(e[n].pos.x/t),i=Math.floor(e[n].pos.y/t);u[n]=r,d[n]=i;let o=Nm(r,i)&a;f[n]=p[o],p[o]=n}let o=t*t;for(let t=0;t<i;t++){if(!l[t])continue;let i=e[t],s=i.pos.x,c=i.pos.y;for(let m=-1;m<=1;m++)for(let h=-1;h<=1;h++){let g=u[t]+m,_=d[t]+h;for(let m=p[Nm(g,_)&a];m!==-1;m=f[m]){if(u[m]!==g||d[m]!==_||l[m]&&m<=t)continue;let a=e[m],f=a.pos.x-s,p=a.pos.y-c,h=f*f+p*p;if(h>=o||m===t)continue;h===0&&(f=(r.random.nextDouble()-.5)/50,p=(r.random.nextDouble()-.5)/50,h=f*f+p*p);let v=Math.sqrt(h),y=1-h/o,b=n*i.mass*a.mass*y*y/(h*v);l[m]&&(i.force.x+=b*f,i.force.y+=b*p),a.force.x-=b*f,a.force.y-=b*p}}}}}function Nm(e,t){return Math.imul(e,73856093)^Math.imul(t,19349663)}var Pm=s({default:()=>Fm}),Fm={id:`v3-1-fermi-fans`,title:`Leaves fill shells (Fermi fans)`,author:`v3-1 (Feynman Lectures Vol. 3, Ch. 4)`,description:`
<p>When a node has hundreds of <i>leaves</i> (neighbours with no other link), ngraph puts every
leaf at the same distance from it. They pile up on one thin ring, so the whole star shows as a
small solid ball, while the long links between stars leave most of the screen empty (megaStars,
starOfStars, EVA).</p>
<p>Here the leaves of one node take turns filling rings, like seats in a stadium. The first ring,
one link length out, takes as many leaves as fit half a link length apart, the next ring is half a
link farther out and has more seats, and so on. The star becomes an evenly filled disc, and the
node's other links start at the edge of that disc so they don't cut through it. All of this is set
once when the layout starts.</p>
<p>The idea comes from Feynman's Lectures, Vol. 3, Ch. 4 (identical particles). Two electrons can't
share one state, so they fill shells outward instead of crowding at the nucleus. His drawing of
atoms with crowding electrons looks just like ngraph's stars.</p>
<p>Look for solid red balls turning into dandelions, with visible dots and spokes of different
lengths. Turning on "Leaves push only nearby nodes" also lets the stars move close together. With
the default settings, graphs where no node has more than about 12 leaves don't change at all
(caterpillars).</p>
<p>What gets worse: a leaf's link length now says which ring it sits in, not how far it is in the
graph, and lines that pass over a big disc cross more spokes. "Leaves push only nearby nodes" makes
fans lean away from their neighbours, packs trees tighter and adds crossings. 2D only; in 3D this
does nothing.</p>
<p>Close relatives: "leaf shells" (v3-3) uses nearly the same rings but picks the gap from a
stability rule; "soft leaf links" (v2-6) gives all leaves of a node one longer, softer link. What
only this one has is "Leaves push only nearby nodes".</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: caterpillars`],params:[{key:`spacing`,label:`Leaf spacing (link lengths)`,value:.5,step:`0.1`,help:`Distance between neighbouring leaves and between rings. Larger gives bigger stars with longer spokes (starOfStars fills the screen at 1), but trees with many small fans get tangled (paTree3k crosses 4 times more at 1). Smaller packs leaves into tighter discs. A node keeps the normal layout while all its leaves fit in the first ring (about 6.3 / spacing leaves).`},{key:`rimBonds`,label:`Links leave from the rim (1 on, 0 off)`,value:1,step:`1`,help:`With 1, a filled node's links to non-leaves start at the edge of its disc. With 0 they start at the centre and cross many spokes.`},{key:`shortRange`,label:`Leaves push only nearby nodes (1 on, 0 off)`,value:0,step:`1`,help:`With 1, a leaf pushes other nodes only when they are closer than one link length (leaves still get pushed by everything else), so big stars stop shoving each other apart and fill the screen. Fans lean and trees get tighter, with more crossings. Leaves start on their rings. Uses the quad tree whatever the Repulsion setting says.`}],attach({layout:e,graph:t,params:n,settings:r}){if(r.dimensions!==2)return null;let i=km(t,e,{spacing:Math.max(.05,Number(n.spacing)||.5),rimBonds:Number(n.rimBonds)!==0}),a=NaN;if(o(),e.on(`step`,o),Number(n.shortRange)!==0){let n=e.simulator.springLength();i.seats.forEach(({hub:t,leaf:r,radius:i,angle:a})=>{let o=e.getNodePosition(t);e.setNodePosition(r,o.x+i*n*Math.cos(a),o.y+i*n*Math.sin(a))});let r=e.simulator,a=r.getForces().get(`spring`);r.removeForce(`nbody`),r.removeForce(`spring`),r.addForce(`nbody`,Mm(e,e=>Im(t,e))),r.addForce(`spring`,a)}return{dispose(){e.off(`step`,o)}};function o(){let t=e.simulator.springLength();t!==a&&(a=t,i.lengths.forEach((e,n)=>{n.length=e*t}))}}};function Im(e,t){if(Lm(e,t)!==1)return!1;let n=null;return e.forEachLinkedNode(t,e=>{n=e.id}),n!==null&&n!==t&&Lm(e,n)>1}function Lm(e,t){let n=e.getLinks(t);return n?n.size===void 0?n.length:n.size:0}function Rm(e,t){let n=e.bodies,r=e.settings,i=t.bSafe||1.5,a=0,o=0,s=0,c,l,u,d,f,p,m,h,g,_,v,y={pairs:0,steps:0};return{force:b,stats:y};function b(){let e=n.length,i=t.strength,a=t.range*r.springLength;if(!(i>0)||!(a>0)||e<2)return;x(e),w(e,1/a);let o=T(e,i,a);E(e),y.pairs+=o,y.steps+=1}function x(e){if(e<=a)return;a=Math.max(e,a*2,64),c=new Int32Array(a),l=new Int32Array(a),u=new Int32Array(a),d=new Float64Array(a),v=new Int32Array(a),_=new Int32Array(a);let t=1;for(;t<a*2;)t*=2;o=t-1,f=new Int32Array(t),p=new Int32Array(t),m=new Int32Array(t),h=new Int32Array(t),g=new Int32Array(t),s=0}function S(e,t){return(Math.imul(e,2654435761)^Math.imul(t,2246822519))>>>0&o}function C(e,t){let n=S(e,t);for(;m[n]===s;){if(f[n]===e&&p[n]===t)return n;n=n+1&o}return-1}function w(e,t){s+=1;let r=0;for(let i=0;i<e;++i){let e=n[i].pos,a=Math.floor(e.x*t),d=Math.floor(e.y*t);c[i]=a,l[i]=d;let h=S(a,d);for(;m[h]===s&&(f[h]!==a||p[h]!==d);)h=h+1&o;m[h]!==s&&(m[h]=s,f[h]=a,p[h]=d,g[h]=0,_[r++]=h),g[h]+=1,u[i]=h}let i=0;for(let e=0;e<r;++e){let t=_[e];h[t]=i,i+=g[t],g[t]=0}for(let t=0;t<e;++t){let e=u[t];v[h[e]+g[e]]=t,g[e]+=1}}function T(e,t,r){let i=1/r,a=2*i*i,o=0;for(let t=0;t<e;++t)d[t]=0;for(let s=0;s<e;++s){let e=n[s],u=e.pos.x,f=e.pos.y,p=1/e.mass;for(let m=-1;m<=1;++m)for(let _=-1;_<=1;++_){let y=C(c[s]+m,l[s]+_);if(y<0)continue;let b=h[y]+g[y];for(let c=h[y];c<b;++c){let l=v[c];if(l<=s)continue;let m=n[l],h=u-m.pos.x,g=f-m.pos.y,_=Math.sqrt(h*h+g*g);if(_>=r)continue;let y=_;if(_===0){let e=((s*2654435761^l*40503)>>>0)/4294967296*2*Math.PI;h=Math.cos(e),g=Math.sin(e),_=1}let b=t*(p+1/m.mass),x=b*2*(1-y*i)*i/_;e.isPinned||(e.force.x+=x*h,e.force.y+=x*g),m.isPinned||(m.force.x-=x*h,m.force.y-=x*g),d[s]+=b*a,d[l]+=b*a,o+=1}}}return o}function E(e){let t=r.timeStep,a=r.springCoefficient,o=r.integrator===`fire`?0:r.dragCoefficient;for(let r=0;r<e;++r){let e=n[r];if(e.isPinned||d[r]===0)continue;let s=t*t*(d[r]+a*e.springCount)/i;if(s<=e.mass)continue;let c=e.mass/s,l=e.force.x+o*e.velocity.x,u=e.force.y+o*e.velocity.y;e.force.x=c*l-o*e.velocity.x,e.force.y=c*u-o*e.velocity.y}}}var zm=s({default:()=>Vm}),Bm=`v3-2-crowding-costs`,Vm={id:`v3-2-crowding-costs`,title:`Crowding costs energy`,author:`v3-2 (Feynman Vol. 3 reader)`,description:`
<p>In ngraph's pictures, a hub's leaves often collapse into a small solid disc, or into a crowded
ring at one distance with empty spokes inside, and the stars look tiny in a mostly empty frame
(starOfStars, megaStars, EVA).</p>
<p>This idea makes crowding cost energy. Two nodes closer than half a spring length push each other
apart, harder the closer they are, and light nodes (leaves) are pushed much harder than heavy ones
(hubs). Leaves then spread over their hub's disc instead of piling up at one distance. Nodes that
are farther apart feel nothing.</p>
<p>It comes from quantum mechanics (Feynman Lectures on Physics, Vol. 3, Section 10-1): the less
room a particle has, the faster it has to move (the uncertainty principle), so squeezing it costs
energy, and more so for a light particle. That is why an electron spreads out around its atom.</p>
<p>Look for stars that turn into larger discs of spokes with dots at many distances, filling more
of the frame (starOfStars, megaStars; on hubLeaves5k the leaf halo becomes more even; on EVA, zoom
into the main piece). On grid20 no two nodes come that close, so the result should look the same,
apart from a corner the early, crowded steps may bend differently (with <i>Start from: pivot
MDS</i> it is identical).</p>
<p>What gets worse: the bigger fans overlap edges that pass by, so there are more edge crossings.
A range of 1 or more also spreads out sparse graphs and tangles them (try powerGrid). To keep
crowded nodes from shaking, they take smaller steps (they get more inertia); as a side effect
megaStars and hubLeaves5k shake less than with <b>none</b>. It costs about 1.2–1.5&times; the time
per step. 2D only: in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: hubLeaves5k`,`Benchmark: grid20`],params:[{key:`strength`,label:`Strength`,value:100,step:`10`,help:`How hard crowded nodes push apart. More spreads fans wider and fills the frame, and adds edge crossings. 0 turns it off.`},{key:`range`,label:`Range`,value:.5,step:`0.1`,help:`How close two nodes must be, in spring lengths, before they push. 0.5 acts only inside crowded fans; 1 or more also spreads sparse graphs and trees, where it adds crossings.`}],attach({layout:e,params:t,settings:n}){if((n&&n.dimensions||e.simulator.settings.dimensions||2)!==2)return{};let r=e.simulator,i=Rm(r,{strength:Number(t.strength),range:Number(t.range)});return r.addForce(Bm,i.force),{dispose(){r.removeForce(Bm)}}}};function Hm(e,t){let n=t.springLength,r=Math.abs(t.gravity),i=t.springCoefficient,a=t.spacing,o=new Map;if(!(n>0)||!(i>0)||!(r>0))return{lengths:o};let s=new Map;e.forEachLink(e=>{e.fromId!==e.toId&&(s.set(e.fromId,(s.get(e.fromId)||0)+1),s.set(e.toId,(s.get(e.toId)||0)+1))});let c=new Map;e.forEachLink(e=>{if(e.fromId===e.toId)return;let t=e.fromId,n=e.toId,r=s.get(t)===1?t:s.get(n)===1?n:null;if(r===null)return;let i=r===t?n:t;s.get(i)!==1&&(c.has(i)||c.set(i,[]),c.get(i).push({link:e,leaf:r}))});let l=new Map;return c.forEach((e,s)=>{let c=t.leafCharge(e[0].leaf),u=a*Math.cbrt(4.21*r*c*c/i),d=Math.floor(2*Math.PI*n/u);if(e.length<=Math.max(d,t.minLeaves-1))return;let f=0,p=0,m=n;for(let{link:t}of e){m=n+f*u,o.set(t,m);let e=Math.max(1,Math.floor(2*Math.PI*m/u));++p>=e&&(f+=1,p=0)}l.set(s,m)}),t.bondsOutside&&l.size&&e.forEachLink(e=>{if(o.has(e))return;let t=l.get(e.fromId)||0,r=l.get(e.toId)||0;(t||r)&&o.set(e,t+r+n)}),{lengths:o,hubs:l.size}}var Um=s({default:()=>Wm}),Wm={id:`v3-3-leaf-shells`,title:`Leaves fill rings (stability rule)`,author:`v3-3 (Feynman Vol. 3, ch. 13 and 15)`,description:`
<p>On star-like graphs ngraph piles each hub's leaves (nodes with a single link) into a dark ball or a thick rim, so stars look like small blots far apart.</p>
<p>Why: leaves at the same distance from their hub push each other apart. Packed closer than about half a link length, the ring buckles (every other leaf slides in or out) and crumples into a dense disk.</p>
<p>This gives each hub several rings of leaves at growing distances, like the shells of an atom, and puts in each ring only as many leaves as it holds without buckling. The hub's other links start outside its rings, so they don't cut through them. Only link lengths change, once at the start; hubs with up to about 11 leaves are left alone.</p>
<p>From Feynman's Lectures, Vol. 3: ch. 13 and 15 (waves on a ring of atoms; the zigzag wave is the first to give way) and ch. 15-6 (electrons filling shells).</p>
<p>Look for evenly filled sunbursts with visible rays instead of dark balls, and stars that fill the screen. Compare with <b>none</b>. A close sibling, "Fermi fans" (v3-1), uses a fixed gap you set yourself; here the gap follows gravity and spring strength.</p>
<p>Worse: big stars make the drawing larger, so the rest looks smaller, and links between stars can cut across other stars' rays (more crossings on starOfStars). 2D only: in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: caterpillars`],params:[{key:`spacing`,label:`Ring spacing`,value:1.1,step:`0.1`,help:`Gap between neighbouring leaves on a ring, and between rings, as a multiple of the smallest gap that does not buckle (about half a link at default settings). Below 1 the rings buckle again; larger values give bigger, airier stars.`},{key:`minLeaves`,label:`Smallest hub`,value:0,step:`1`,help:`Hubs with fewer leaves than this keep the default link lengths. 0 means automatic: only hubs whose leaves do not fit into the first ring. Raise it to leave trees with small hubs alone and change only big stars.`},{key:`bondsOutside`,label:`Other links outside rings`,value:1,step:`1`,help:`1: a hub's links to non-leaf nodes get long enough to start outside its rings. 0: they keep their length and cut through the rings (many more crossings).`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let i=e.simulator,a=[],o,s,c;return u(),e.on(`step`,l),{dispose(){e.off(`step`,l)}};function l(){(i.springLength()!==o||i.springCoefficient()!==s||i.gravity()!==c)&&u()}function u(){o=i.springLength(),s=i.springCoefficient(),c=i.gravity();for(let e of a)e.length=-1;let r=Hm(t,{springLength:o,springCoefficient:s,gravity:c,leafCharge:t=>e.getBody(t).mass,spacing:Number(n.spacing)>0?Number(n.spacing):1.1,minLeaves:Number(n.minLeaves)||0,bondsOutside:Number(n.bondsOutside)!==0});a=[];for(let[t,n]of r.lengths){let r=e.getSpring(t);r&&(r.length=n,a.push(r))}}}},Gm=[0,.063319,.1267,.1902,.25387,.31779,.38201,.4466,.51161,.57714,.64323,.70998,.77745,.84573,.91491,.98509,1.0564,1.1289,1.2027,1.2779,1.3548,1.4334,1.514,1.5967,1.6817,1.7693,1.8598,1.9534,2.0506,2.1518,2.2574,2.3681,2.4846,2.6076,2.7384,2.8783,3.0291,3.193,3.3736,3.5758,3.8077,4.0848,4.4483,5.0131,5.3481,5.5788,5.7412,5.8516,5.9234,5.9559,5.9517,5.9163,5.8448,5.7355,5.5883,5.392,5.132,4.7706,4.1919,3.8211,3.5422,3.3127,3.1165,2.9448,2.7923,2.6552,2.5309,2.4175,2.3133,2.2173,2.1283,2.0455,1.9684,1.8962,1.8286,1.765,1.7051,1.6486,1.5952,1.5447,1.4967,1.4513,1.408,1.3669,1.3276,1.2902,1.2545,1.2204,1.1877,1.1565,1.1265,1.0978,1.0702,1.0437,1.0183,.99381,.97026,.94758,.92573,.90466,.88435,.86474,.84581,.82752,.80985,.79276,.77623,.76023,.74475,.72975,.71521,.70112,.68746,.67421,.66135,.64887,.63675,.62498,.61354,.60242,.59161,.5811,.57087,.56092,.55123,.5418,.53262,.52367,.51495,.50646,.49818,.4901,.48222,.47454,.46704,.45973,.45258,.44561,.4388,.43215,.42565,.4193,.41309,.40702,.40109,.39529,.38962,.38407,.37863,.37332,.36812,.36303,.35804,.35316,.34838,.3437,.33911,.33462,.33022,.3259,.32167,.31752,.31345,.30946,.30555,.30172,.29795,.29426,.29063,.28708,.28359,.28016,.2768,.27349,.27025,.26706,.26393,.26086,.25784,.25487,.25196,.24909,.24628,.24351,.24079,.23811,.23548,.23289,.23035,.22785,.22539,.22297,.22058,.21824,.21593,.21367,.21143,.20923,.20707,.20494,.20284],Km=Gm.length-1;function qm(e,t){let n=e.simulator,r=n.bodies,i=t.density,a=t.extra,o=Math.max(0,Math.round(t.startStep)),s=0,c=0;return n.addForce(`neutral-background`,l),{getRadius:()=>c};function l(e){if(!(e<o||r.length<8)){var t=n.settings.gravity;if(t<0){for(var l=0,u=0,d=0,f=0,p;f<r.length;++f)p=r[f],l+=p.mass,u+=p.mass*p.pos.x,d+=p.mass*p.pos.y;if(u/=l,d/=l,!s){var m=Ym(r,6);if(!(m>0))return;s=i*m*l/r.length,c=Math.sqrt((1+a)*l/(Math.PI*s))}for(f=0;f<r.length;++f)if(p=r[f],!p.isPinned){var h=p.pos.x-u,g=p.pos.y-d,_=Math.sqrt(h*h+g*g);if(_!==0){var v=t*p.mass*s*Jm(_/c)/_;p.force.x+=v*h,p.force.y+=v*g}}}}}}function Jm(e){if(e>=4)return Gm[Km]*4*4/(e*e);var t=e/4*Km,n=Math.floor(t),r=t-n;return Gm[n]*(1-r)+Gm[n+1]*r}function Ym(e,t){for(var n=e.length,r=1/0,i=1/0,a=-1/0,o=-1/0,s=0;s<n;++s){var c=e[s].pos;c.x<r&&(r=c.x),c.x>a&&(a=c.x),c.y<i&&(i=c.y),c.y>o&&(o=c.y)}for(var l=Math.max(1e-6,Math.sqrt(Math.max((a-r)*(o-i),1e-9)/n)),u,d=0;d<12;++d){for(u=new Map,s=0;s<n;++s){var f=Xm(Math.floor((e[s].pos.x-r)/l),Math.floor((e[s].pos.y-i)/l)),p=u.get(f);p||u.set(f,p=[]),p.push(s)}if(n/u.size<=4)break;l/=2}var m=[],h=Math.max(1,Math.floor(n/1500));for(s=0;s<n;s+=h){for(var g=e[s].pos,_=Math.floor((g.x-r)/l),v=Math.floor((g.y-i)/l),y=[],b=0;b<64;++b){for(var x=_-b;x<=_+b;++x)for(var S=v-b;S<=v+b;++S)if(Math.max(Math.abs(x-_),Math.abs(S-v))===b){var C=u.get(Xm(x,S));if(C){for(var w=0;w<C.length;++w)if(C[w]!==s){var T=e[C[w]].pos;y.push(Math.hypot(T.x-g.x,T.y-g.y))}}}if(y.length>=t&&b>=1&&(y.sort(Zm),y[t-1]<=b*l))break}y.sort(Zm);var E=y[Math.min(t,y.length)-1]||l;m.push(t/(Math.PI*E*E))}return m.sort(Zm),m[m.length>>1]}function Xm(e,t){return e*1048576+t}function Zm(e,t){return e-t}var Qm=s({default:()=>$m}),$m={id:`v3-4-jellium`,title:`Neutral background ("jellium")`,author:`v3-4 (Feynman Vol. III reader)`,description:`
<p>On graphs with many separate pieces (yeast, sciMet, EVA) ngraph draws the main part as a small
dense ball, with the pieces on a ring far away, so most of the screen is empty. Graphs made of big
stars (megaStars, starOfStars) have the same problem: small discs of leaves joined by very long lines.</p>
<p>The cause is that every node pushes every other node away, however far apart they are, and big
hubs push hardest. This idea keeps that push, but lays an even "background" under the drawing: a
disc that pulls each node exactly as hard as an evenly spread crowd of nodes would push it. Where
nodes are spread evenly the two cancel. Crowded places still push apart, empty places now pull
nodes in, and nothing gets flung far away.</p>
<p>It comes from Feynman's <i>Lectures on Physics</i>, Vol. III, chapter 21 (superconductivity).
In a metal, a fixed background of positive ions balances the electrons' push on each other, and
that keeps the electrons' density nearly even. Physicists call such a background "jellium".</p>
<p>The background switches on at step 300. At that moment it measures how closely nodes sit, and it
keeps that value for the rest of the run. Look for the stars or the main part filling the screen,
with the pieces close around it. Compare with <b>none</b>.</p>
<p>What gets worse: more crossing lines where stars now touch. A higher <i>Background density</i>
packs small pieces so close that you can't tell them apart, and trees get more crossings. It does
not help communities (sbm8x50 looks the same), and it changes nothing until step 300. 2D only: in
3D it does nothing.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: yeast`,`Benchmark: sciMet`,`Benchmark: grid20`],params:[{key:`density`,label:`Background density`,value:.25,step:`0.05`,help:`How dense the background is, as a share of how closely nodes sit at the step it switches on. Higher packs stars and pieces tighter (fewer gaps, more crossings, pieces start to mix); lower is gentler. Measured once, then kept: re-measuring would let the drawing shrink without end.`},{key:`extra`,label:`Extra pull`,value:.3,step:`0.1`,help:`Extra background charge, as a share of the nodes' total mass. Pulls back pieces that were pushed far away before the background switched on. 0 means an exactly balanced background.`},{key:`startStep`,label:`Switch on at step`,value:300,step:`50`,help:`The background waits this many steps, so the graph can first unfold, and then measures node density. Earlier gets pieces in sooner but can freeze an unfinished layout.`}],attach({layout:e,params:t,settings:n}){return(n.dimensions||2)===2&&qm(e,{density:Number(t.density)>0?Number(t.density):.25,extra:Number(t.extra)>=0?Number(t.extra):.3,startStep:Number(t.startStep)>=0?Number(t.startStep):300}),null}},eh=Object.values(Object.assign({"./ru-1-leaf-fade/index.js":Kd,"./ru-2-group-smoothing/index.js":of,"./ru-3-stiff-springs/index.js":ff,"./ru-4-grid-pressure/index.js":hf,"./ru-5-heat-spread/index.js":Tf,"./ru-6-spread-crowds/index.js":Af,"./v1-1-short-range-push/index.js":Uf,"./v1-2-leaf-fade/index.js":Jf,"./v1-3-group-bridges/index.js":$f,"./v1-4-dimming-crowds/index.js":dp,"./v1-5-personal-space/index.js":mp,"./v1-6-gas-pressure/index.js":bp,"./v1-7-contact-push/index.js":kp,"./v2-1-fading-push/index.js":zp,"./v2-2-balancing-pull/index.js":Kp,"./v2-3-flat-world/index.js":tm,"./v2-4-limited-reach/index.js":_m,"./v2-5-magnetic-domains/index.js":Sm,"./v2-6-soft-leaf-links/index.js":Tm,"./v3-1-fermi-fans/index.js":Pm,"./v3-2-crowding-costs/index.js":zm,"./v3-3-leaf-shells/index.js":Um,"./v3-4-jellium/index.js":Qm})).map(e=>e.default).filter(Boolean).sort((e,t)=>e.title.localeCompare(t.title)),th={maxVelocity:4,integrator:`euler`,nbody:`quadtree`},nh={maxVelocity:4,integrator:`fire`,nbody:`dualtree`},rh=(0,fd.default)({graph:`Miserables`,timeStep:.5,springLength:10,springCoefficient:.8,dragCoefficient:.9,dimensions:2,theta:.8,gravity:-12,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,placement:`default`,backend:`cpu`,stepsPerFrame:1,prototype:`none`},{useSearch:!0}),ih=`p.`;function ah(e){return eh.find(t=>t.id===e)||null}function oh(e,t){let n={};return e&&(e.params||[]).forEach(e=>{let r=t?rh.get(ih+e.key):void 0;n[e.key]=Number.isFinite(r)?r:e.value}),n}var sh={name:`app`,components:{InputValue:Td,InputFlag:Nd,InputSelect:Ud},computed:{onGpu(){return this.backend===`webgpu`},usesFire(){return this.layoutSettings.integrator===`fire`},integratorOptions(){return[{value:`euler`,label:`euler (default)`},{value:`fire`,label:`fire`}]},nbodyOptions(){return[{value:`quadtree`,label:`quad tree (default)`},{value:`dualtree`,label:`dual tree`}]},placementOptions(){return[{value:`default`,label:`library default`},{value:`pivot`,label:`pivot MDS (add-on)`}]},prototype(){return ah(this.prototypeId)},prototypeOptions(){return[{value:`none`,label:`none`}].concat(eh.map(e=>({value:e.id,label:e.title})))},prototypeConfig(){return{id:this.prototypeId,params:{...this.prototypeParams}}},backendOptions(){return[{value:`cpu`,label:`CPU (library)`},{value:`webgpu`,label:`WebGPU, 2D (add-on)`,disabled:this.layoutSettings.dimensions!==2||this.gpuAvailable===!1}]}},methods:{useSpeedups(e){Object.assign(this.layoutSettings,e?nh:th)},restart(){this.scene.restart()},finishPrototype(){this.isRunning&&this.toggleLayoutRun(),this.scene.finishPrototype()},shortGraphName(e){return e.replace(/^Benchmark: /,``)},formatMs(e){return e<1?e.toFixed(2):e<10?e.toFixed(1):Math.round(e)},updateStats(){this.scene&&(this.stats=this.scene.getStats(),this.stats.backend!==this.backend&&this.backend===`webgpu`&&(this.gpuMessage=`WebGPU device was lost, switched back to CPU.`,this.backend=this.stats.backend))},toggleLayoutRun(){this.isRunning=!this.isRunning,this.scene.runLayout(this.isRunning)},loadNewGraph(e){this.loading=!0,this.stats=null,this.isRunning=!1,ed(e).then(e=>{bl.fire(`load-graph`,e,this.selectedLayout),this.loading=!1})},onGraphLoaded(){this.isRunning=!0}},watch:{layoutSettings:{deep:!0,handler(e){this.scene.updateLayoutSettings(e),rh.set(e)}},fixedViewBox(e){this.scene.setFixedViewBox(e)},"layoutSettings.dimensions"(e){e!==2&&this.backend===`webgpu`&&(this.gpuMessage=`WebGPU layout works only in 2D, switched to CPU.`,this.backend=`cpu`)},placement(e){rh.set(`placement`,e),this.scene.setPlacement(e)},stepsPerFrame(e){rh.set(`stepsPerFrame`,e),this.scene.setStepsPerFrame(e)},backend(e){this.scene.setBackend(e).then(t=>{t===e?e===`webgpu`&&(this.gpuMessage=``):(this.gpuMessage=this.layoutSettings.dimensions===2?`WebGPU is not available in this browser.`:`WebGPU layout works only in 2D.`,this.layoutSettings.dimensions===2&&(this.gpuAvailable=!1),this.backend=t),rh.set(`backend`,this.backend)})},selectedGraph(e){rh.set(`graph`,e),this.loadNewGraph(e)},prototypeId(e,t){let n=ah(t);n&&(n.params||[]).forEach(e=>rh.unset(ih+e.key)),rh.set(`prototype`,e),this.prototypeParams=oh(this.prototype,!1)},prototypeConfig:{deep:!0,handler(e){Object.values(e.params).every(Number.isFinite)&&(Object.entries(e.params).forEach(([e,t])=>rh.set(ih+e,t)),this.scene.setPrototype(this.prototype,e.params))}}},data(){let e=Hu();return{isRunning:!0,fixedViewBox:!1,selectedGraph:rh.get(`graph`),settingsOpen:window.innerWidth>500,loading:!1,layoutSettings:{timeStep:rh.get(`timeStep`),springLength:rh.get(`springLength`),springCoefficient:rh.get(`springCoefficient`),dragCoefficient:rh.get(`dragCoefficient`),dimensions:rh.get(`dimensions`),theta:rh.get(`theta`),gravity:rh.get(`gravity`),maxVelocity:rh.get(`maxVelocity`),integrator:rh.get(`integrator`),nbody:rh.get(`nbody`)},placement:rh.get(`placement`),backend:`cpu`,stepsPerFrame:rh.get(`stepsPerFrame`),prototypes:eh,prototypeId:ah(rh.get(`prototype`))?rh.get(`prototype`):`none`,prototypeParams:oh(ah(rh.get(`prototype`)),!0),gpuAvailable:typeof navigator<`u`&&!!navigator.gpu,gpuMessage:``,stats:null,graphs:e}},mounted(){let e=document.getElementById(`cnv`);this.scene=Bu(e,{...this.layoutSettings},{placement:this.placement,stepsPerFrame:this.stepsPerFrame}),this.prototype&&this.scene.setPrototype(this.prototype,this.prototypeParams),this.loadNewGraph(this.selectedGraph),bl.on(`load-graph`,this.onGraphLoaded),rh.get(`backend`)===`webgpu`&&(this.backend=`webgpu`),this.statsTimer=setInterval(this.updateStats,250)},beforeUnmount(){clearInterval(this.statsTimer),this.scene&&this.scene.dispose()}},ch={class:`layout-box`},lh={class:`buttons`},uh={class:`graph-picker`,title:`Graph`},dh=[`value`],fh={class:`stats`},ph={key:0},mh={key:1},hh={key:0},gh={key:1},_h={class:`number`},vh={key:0,class:`content`},yh={class:`section`},bh=[`innerHTML`],xh={key:0,class:`prototype`},Sh={key:0,class:`try`},Ch=[`onClick`];function wh(e,t,n,r,i,a){let o=pr(`input-value`),s=pr(`input-select`),c=pr(`input-flag`);return Z(),Wi(`div`,null,[t[49]||=Q(`h2`,null,[Q(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout`},`ngraph.forcelayout`),$(` demo`)],-1),Q(`div`,ch,[Q(`div`,lh,[Q(`label`,uh,[Dn(Q(`select`,{"onUpdate:modelValue":t[0]||=e=>i.selectedGraph=e},[(Z(!0),Wi(Pi,null,_r(i.graphs,e=>(Z(),Wi(`option`,{key:e,value:e},be(e),9,dh))),128))],512),[[wo,i.selectedGraph]])]),Q(`a`,{href:`#`,onClick:t[1]||=jo((...e)=>a.toggleLayoutRun&&a.toggleLayoutRun(...e),[`prevent`]),class:`btn`},be(i.isRunning?`Pause`:`Run`),1),Q(`a`,{href:`#`,onClick:t[2]||=jo((...e)=>a.restart&&a.restart(...e),[`prevent`]),class:`btn restart`,title:`Start over from initial positions`},`Reset`)]),Q(`div`,fh,[i.loading?(Z(),Wi(`div`,ph,`Loading graph...`)):i.stats?(Z(),Wi(`div`,mh,[$(be(i.stats.nodes.toLocaleString())+` nodes, `+be(i.stats.links.toLocaleString())+` links`,1),i.stats.placement?(Z(),Wi(`span`,hh,`, `+be(i.stats.placement)+` start`,1)):ea(``,!0),t[24]||=Q(`br`,null,null,-1),$(` `+be(i.stats.steps.toLocaleString())+` steps`,1),i.stats.msPerStep?(Z(),Wi(`span`,gh,[t[22]||=$(`, `,-1),Q(`span`,_h,be(a.formatMs(i.stats.msPerStep)),1),t[23]||=$(` ms/step`,-1)])):ea(``,!0),$(` on `+be(i.stats.backend===`webgpu`?`WebGPU`:`CPU`),1)])):ea(``,!0),Q(`a`,{href:`#`,onClick:t[3]||=jo(e=>i.settingsOpen=!i.settingsOpen,[`prevent`]),class:`toggle-settings`},`Settings `+be(i.settingsOpen?`▴`:`▾`),1)])]),i.settingsOpen?(Z(),Wi(`div`,vh,[Xi(o,{label:`Time step`,modelValue:i.layoutSettings.timeStep,"onUpdate:modelValue":t[4]||=e=>i.layoutSettings.timeStep=e},{default:En(()=>[...t[25]||=[$(` This is integration time step value. The higher it is, the faster nodes will move, but setting it too high can result in lots of jitter and instability. `,-1)]]),_:1},8,[`modelValue`]),Xi(o,{label:`Gravity`,modelValue:i.layoutSettings.gravity,"onUpdate:modelValue":t[5]||=e=>i.layoutSettings.gravity=e},{default:En(()=>[...t[26]||=[$(` This coefficient defines how strongly each node repels each other. `,-1)]]),_:1},8,[`modelValue`]),Xi(o,{label:`Ideal spring length`,modelValue:i.layoutSettings.springLength,"onUpdate:modelValue":t[6]||=e=>i.layoutSettings.springLength=e},{default:En(()=>[...t[27]||=[$(` What is the ideal length of each spring? `,-1)]]),_:1},8,[`modelValue`]),Xi(o,{label:`Spring coefficient`,modelValue:i.layoutSettings.springCoefficient,"onUpdate:modelValue":t[7]||=e=>i.layoutSettings.springCoefficient=e},{default:En(()=>[...t[28]||=[$(` Higher values makes the spring force stronger, pushing edges closer to the ideal spring length. `,-1)]]),_:1},8,[`modelValue`]),Xi(o,{label:`Drag coefficient`,modelValue:i.layoutSettings.dragCoefficient,"onUpdate:modelValue":t[8]||=e=>i.layoutSettings.dragCoefficient=e,disabled:a.usesFire,note:a.usesFire?`Not used by the fire integrator.`:``},{default:En(()=>[...t[29]||=[$(` This coefficient introduces "resistance" from environment. When it is close to 0 the forces will have a lot of freedom, nothing will be stopping them, and that can result in a very unstable simulation. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),Xi(o,{label:`Theta`,modelValue:i.layoutSettings.theta,"onUpdate:modelValue":t[9]||=e=>i.layoutSettings.theta=e,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU.`:``},{default:En(()=>[...t[30]||=[$(` This coefficient influences when we apply long distance forces approximation. When this value is close to 0, the simulation compares forces between every single node (giving O(n^2), slow performance). Recommended value is 0.8. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),Xi(o,{label:`Dimensions`,modelValue:i.layoutSettings.dimensions,"onUpdate:modelValue":t[10]||=e=>i.layoutSettings.dimensions=e,step:`1`},{default:En(()=>[...t[31]||=[$(` Defines number of dimensions of the space where layout is performed. For visualization purpose 2 or 3 dimensions are normally enough. Note: Memory consumptions grows exponentially with number of dimensions. `,-1)]]),_:1},8,[`modelValue`]),Q(`div`,yh,[t[33]||=$(` Speed-ups `,-1),Q(`small`,null,[Q(`a`,{href:`#`,onClick:t[11]||=jo(e=>a.useSpeedups(!0),[`prevent`])},`turn all on`),t[32]||=$(` | `,-1),Q(`a`,{href:`#`,onClick:t[12]||=jo(e=>a.useSpeedups(!1),[`prevent`])},`library defaults`)])]),Xi(o,{label:`Max velocity`,modelValue:i.layoutSettings.maxVelocity,"onUpdate:modelValue":t[13]||=e=>i.layoutSettings.maxVelocity=e},{default:En(()=>[...t[34]||=[$(` Maximum distance a node can travel in one unit of time (each step moves a node by at most time step * max velocity). Library default is 4. Set it to 1 to get the layouts of versions before v3.4, which settle more slowly. `,-1)]]),_:1},8,[`modelValue`]),Xi(s,{label:`Integrator`,modelValue:i.layoutSettings.integrator,"onUpdate:modelValue":t[14]||=e=>i.layoutSettings.integrator=e,options:a.integratorOptions},{default:En(()=>[...t[35]||=[$(` How forces move nodes. `,-1),Q(`b`,null,`euler`,-1),$(` is the classic integration slowed down by drag. `,-1),Q(`b`,null,`fire`,-1),$(` (Fast Inertial Relaxation Engine) ignores drag: the whole system keeps its momentum while it moves "downhill", and stops dead when it overshoots. Usually reaches a good layout in fewer steps, especially on trees and grids. `,-1)]]),_:1},8,[`modelValue`,`options`]),Xi(s,{label:`Repulsion`,modelValue:i.layoutSettings.nbody,"onUpdate:modelValue":t[15]||=e=>i.layoutSettings.nbody=e,options:a.nbodyOptions,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU: it has its own grid pyramid (exact up to 1,024 nodes).`:``},{default:En(()=>[...t[36]||=[$(` How node repulsion is computed. `,-1),Q(`b`,null,`quad tree`,-1),$(` is Barnes-Hut: each node walks the tree. `,-1),Q(`b`,null,`dual tree`,-1),$(` lets pairs of tree cells interact with each other, which is 5-10x faster on large graphs with the same accuracy. Both use theta. `,-1)]]),_:1},8,[`modelValue`,`options`,`disabled`,`note`]),Xi(o,{label:`Steps per frame`,modelValue:i.stepsPerFrame,"onUpdate:modelValue":t[16]||=e=>i.stepsPerFrame=e,step:`1`},{default:En(()=>[...t[37]||=[$(` How many layout steps to run before each frame is rendered. Fast layouts can do many steps per frame. `,-1)]]),_:1},8,[`modelValue`]),Xi(c,{label:`Follow bounding box`,modelValue:i.fixedViewBox,"onUpdate:modelValue":t[17]||=e=>i.fixedViewBox=e,step:`1`},{default:En(()=>[...t[38]||=[$(` Setting this to true will disable pan/zoom but will always keep the graph visible. This is not part of the layout algorithm. Just a view setting of the renderer. `,-1)]]),_:1},8,[`modelValue`]),t[48]||=Q(`div`,{class:`section`},[$(` Add-ons `),Q(`small`,null,[Q(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout/tree/main/modules`},`not part of the library`)])],-1),Xi(s,{label:`Start from`,modelValue:i.placement,"onUpdate:modelValue":t[18]||=e=>i.placement=e,options:a.placementOptions},{default:En(()=>[...t[39]||=[$(` Initial positions of nodes. `,-1),Q(`b`,null,`pivot MDS`,-1),$(` places nodes so that distances follow graph distances (or uses a radial tree when it fits better), so the layout only needs to polish it. Changing this restarts the layout. This is a separate module, `,-1),Q(`code`,null,`modules/pivot`,-1),$(` in this repository; ngraph.forcelayout itself places each node at random near its already placed neighbours. `,-1)]]),_:1},8,[`modelValue`,`options`]),Xi(s,{label:`Run on`,modelValue:i.backend,"onUpdate:modelValue":t[19]||=e=>i.backend=e,options:a.backendOptions,note:i.gpuMessage},{default:En(()=>[...t[40]||=[Q(`b`,null,`WebGPU`,-1),$(` runs the whole simulation on the GPU (2D only). Repulsion uses a grid pyramid instead of a tree, so Theta and Repulsion settings do not apply; graphs up to 1,024 nodes use exact all-pairs repulsion. It is hundreds of times faster on large graphs, so raise Steps per frame (e.g. 20) to see it: with one step per frame, drawing the graph is the bottleneck. This is a separate module, `,-1),Q(`code`,null,`modules/gpu`,-1),$(` in this repository; ngraph.forcelayout itself always runs on the CPU. `,-1)]]),_:1},8,[`modelValue`,`options`,`note`]),i.prototypes.length?(Z(),Wi(Pi,{key:0},[t[47]||=Q(`div`,{class:`section`},[$(` Prototypes `),Q(`small`,null,[Q(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes`},`ideas to try, not part of the library`)])],-1),Xi(s,{label:`Idea`,modelValue:i.prototypeId,"onUpdate:modelValue":t[20]||=e=>i.prototypeId=e,options:a.prototypeOptions,disabled:a.onGpu,note:a.onGpu?`Prototypes run on the CPU only.`:``},{default:En(()=>[a.prototype?(Z(),Wi(`div`,{key:0,class:`about`,innerHTML:a.prototype.description},null,8,bh)):(Z(),Wi(Pi,{key:1},[t[41]||=$(` Experimental changes to the layout, one per folder in `,-1),t[42]||=Q(`code`,null,`demo/src/prototypes`,-1),t[43]||=$(`. Picking an idea restarts the layout from the same start as `,-1),t[44]||=Q(`b`,null,`none`,-1),t[45]||=$(`, so switch between the two to compare. Changing a parameter restarts the layout too. `,-1)],64))]),_:1},8,[`modelValue`,`options`,`disabled`,`note`]),a.prototype&&!a.onGpu?(Z(),Wi(`div`,xh,[a.prototype.tryGraphs?(Z(),Wi(`div`,Sh,[t[46]||=$(` Try on: `,-1),(Z(!0),Wi(Pi,null,_r(a.prototype.tryGraphs,e=>(Z(),Wi(`a`,{href:`#`,key:e,onClick:jo(t=>i.selectedGraph=e,[`prevent`])},be(a.shortGraphName(e)),9,Ch))),128))])):ea(``,!0),(Z(!0),Wi(Pi,null,_r(a.prototype.params||[],e=>(Z(),Gi(o,{key:e.key,label:e.label,step:e.step||`0.1`,modelValue:i.prototypeParams[e.key],"onUpdate:modelValue":t=>i.prototypeParams[e.key]=t},{default:En(()=>[$(be(e.help),1)]),_:2},1032,[`label`,`step`,`modelValue`,`onUpdate:modelValue`]))),128)),i.stats&&i.stats.canFinishPrototype?(Z(),Wi(`a`,{key:1,href:`#`,class:`finish`,onClick:t[21]||=jo((...e)=>a.finishPrototype&&a.finishPrototype(...e),[`prevent`])},be(a.prototype.finishLabel||`Run final step`),1)):ea(``,!0)])):ea(``,!0)],64)):ea(``,!0)])):ea(``,!0)])}var Th=pd(sh,[[`render`,wh]]);function Eh(e,t){return e.addEventListener(`drop`,i,!0),e.addEventListener(`dragover`,a),e.addEventListener(`dragenter`,r),e.addEventListener(`dragleave`,s),e.addEventListener(`dragend`,s),{dispose:n};function n(){e.removeEventListener(`drop`,i),e.removeEventListener(`dragover`,a),e.removeEventListener(`dragenter`,r),e.removeEventListener(`dragleave`,s),e.removeEventListener(`dragend`,s)}function r(e){o(e)&&e.preventDefault()}function i(e){s(),e.preventDefault();var n=e.dataTransfer,r=[],i,a;if(n.items)for(i=0;i<n.items.length;i++)n.items[i].kind==`file`&&(a=n.items[i].getAsFile(),r.push(a));else for(i=0;i<n.files.length;i++)a=n.files[i],r.push(a);t(r)}function a(t){o(t)&&(t.preventDefault(),e.classList.add(`drag-over`))}function o(e){if(!e.dataTransfer)return!1;if(e.dataTransfer.files&&e.dataTransfer.files.length>0)return!0;var t=e.dataTransfer.items;if(!t)return!1;for(var n=0;n<t.length;++n)if(t[n].kind===`file`)return!0;return!1}function s(){e.classList.remove(`drag-over`)}}var Dh=o(((e,t)=>{function n(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}function r(e,t,n,i){this.message=e,this.expected=t,this.found=n,this.location=i,this.name=`SyntaxError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,r)}n(r,Error),r.buildMessage=function(e,t){var n={literal:function(e){return`"`+i(e.text)+`"`},class:function(e){for(var t=``,n=0;n<e.parts.length;n++)t+=e.parts[n]instanceof Array?a(e.parts[n][0])+`-`+a(e.parts[n][1]):a(e.parts[n]);return`[`+(e.inverted?`^`:``)+t+`]`},any:function(e){return`any character`},end:function(e){return`end of input`},other:function(e){return e.description}};function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function i(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function a(e){return e.replace(/\\/g,`\\\\`).replace(/\]/g,`\\]`).replace(/\^/g,`\\^`).replace(/-/g,`\\-`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function o(e){return n[e.type](e)}function s(e){for(var t=Array(e.length),n=0,r;n<e.length;n++)t[n]=o(e[n]);if(t.sort(),t.length>0){for(n=1,r=1;n<t.length;n++)t[n-1]!==t[n]&&(t[r]=t[n],r++);t.length=r}switch(t.length){case 1:return t[0];case 2:return t[0]+` or `+t[1];default:return t.slice(0,-1).join(`, `)+`, or `+t[t.length-1]}}function c(e){return e?`"`+i(e)+`"`:`end of input`}return`Expected `+s(e)+` but `+c(t)+` found.`};function i(e,t){t=t===void 0?{}:t;var n={},i={start:pn},a=pn,o=`strict`,s=J(`strict`,!0),c=`graph`,l=J(`graph`,!0),u=`digraph`,d=J(`digraph`,!0),f=`{`,p=J(`{`,!1),m=`}`,h=J(`}`,!1),g=function(e,t,n,r){r===null&&(r=[]);var i={type:t.toLowerCase(),children:r};return e&&(i.strict=!0),n&&(i.id=n),i},_=`;`,v=J(`;`,!1),y=function(e,t){return t},b=function(e,t){return[e].concat(t)},x=`=`,S=J(`=`,!1),C=function(e,t){return{type:`attr_stmt`,target:`graph`,attr_list:[{type:`attr`,id:e,eq:t}]}},w=`node`,T=J(`node`,!0),E=`edge`,D=J(`edge`,!0),O=function(e,t){return{type:`attr_stmt`,target:e,attr_list:t}},k=`[`,A=J(`[`,!1),j=`]`,M=J(`]`,!1),N=function(e,t){return(e||[]).concat(t||[])},P=function(e,t){return t},F=`,`,I=J(`,`,!1),L=function(e,t,n){return[{type:`attr`,id:e,eq:t}].concat(n||[])},R=function(e,t,n){var r=[e];return r=r.concat(t.map(function(e){return e.id})),{type:`edge_stmt`,edge_list:r,attr_list:n||[]}},ee=`->`,z=J(`->`,!1),B=`--`,V=J(`--`,!1),te=function(e,t,n){return[{type:`edgeRHS`,edgeop:e,id:t}].concat(n||[])},ne=function(e,t){return{type:`node_stmt`,node_id:e,attr_list:t||[]}},re=function(e,t){return t?{type:`node_id`,id:e,port:t}:{type:`node_id`,id:e}},ie=ln(`port`),ae=`:`,H=J(`:`,!1),oe=function(e,t){return t},se=function(e,t){return{type:`port`,id:e,compass_pt:t||null}},U=function(e){return{type:`port`,compass_pt:e||null}},ce=`subgraph`,le=J(`subgraph`,!0),ue=function(e){return e?{type:`subgraph`,id:e}:{type:`subgraph`}},de=function(e,t){return e||={type:`subgraph`},e.children=t||[],e},fe=`n`,pe=J(`n`,!1),me=`ne`,he=J(`ne`,!1),ge=`e`,_e=J(`e`,!1),ve=`se`,ye=J(`se`,!1),be=`s`,xe=J(`s`,!1),Se=`sw`,Ce=J(`sw`,!1),we=`w`,Te=J(`w`,!1),Ee=`nw`,De=J(`nw`,!1),Oe=ln(`UNICODE_STRING`),ke=function(e,t){return e+t.join(``)},Ae=function(e,t){return e+t},je=`$`,Me=J(`$`,!1),Ne=`_`,Pe=J(`_`,!1),Fe=ln(`NUMBER`),Ie=`-`,Le=J(`-`,!1),Re=`.`,ze=J(`.`,!1),Be=/^[0-9]/,Ve=on([[`0`,`9`]],!1,!1),He=function(e){return parseFloat(an())},Ue=function(e){return{type:`id`,value:e.slice(1,e.length-1),html:!0}},We=`<`,Ge=J(`<`,!1),Ke=`>`,qe=J(`>`,!1),Je=function(e){return`<`+e.join(``)+`>`},Ye=sn(),Xe=function(e){return e},Ze=function(e){return e.join(``)},Qe=`"`,$e=J(`"`,!1),et=function(e){return e.join(``)},tt=function(){return an()},nt=`\\`,rt=J(`\\`,!1),it=function(e){return e[1]===`"`?`"`:e[0]+e[1]},at=function(){return``},ot=/^[\n\r\u2028\u2029]/,st=on([`
`,`\r`,`\u2028`,`\u2029`],!1,!1),ct=ln(`end of line`),lt=`
`,ut=J(`
`,!1),dt=`\r
`,ft=J(`\r
`,!1),pt=`\r`,mt=J(`\r`,!1),ht=`\u2028`,gt=J(`\u2028`,!1),_t=`\u2029`,vt=J(`\u2029`,!1),yt=ln(`COMMENT`),bt=ln(`BLOCK_COMMENT`),xt=`/*`,St=J(`/*`,!1),Ct=`*/`,wt=J(`*/`,!1),Tt=function(e){return e},Et=function(e){return e.join(``)},Dt=ln(`C_COMMENT`),Ot=`//`,kt=J(`//`,!1),At=/^[\n]/,jt=on([`
`],!1,!1),Mt=function(e){return e.join(``)},Nt=ln(`MACRO_COMMENT`),Pt=`#`,Ft=J(`#`,!1),It=ln(`WHITESPACE`),Lt=/^[\n\r]/,Rt=on([`
`,`\r`],!1,!1),zt=/^[ \t]/,Bt=on([` `,`	`],!1,!1),Vt=/^[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137-\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148-\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C-\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA-\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9-\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC-\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF-\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F-\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0-\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB-\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE-\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6-\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FC7\u1FD0-\u1FD3\u1FD6-\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6-\u1FF7\u210A\u210E-\u210F\u2113\u212F\u2134\u2139\u213C-\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65-\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73-\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3-\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]/,Ht=on([[`a`,`z`],`µ`,[`ß`,`ö`],[`ø`,`ÿ`],`ā`,`ă`,`ą`,`ć`,`ĉ`,`ċ`,`č`,`ď`,`đ`,`ē`,`ĕ`,`ė`,`ę`,`ě`,`ĝ`,`ğ`,`ġ`,`ģ`,`ĥ`,`ħ`,`ĩ`,`ī`,`ĭ`,`į`,`ı`,`ĳ`,`ĵ`,[`ķ`,`ĸ`],`ĺ`,`ļ`,`ľ`,`ŀ`,`ł`,`ń`,`ņ`,[`ň`,`ŉ`],`ŋ`,`ō`,`ŏ`,`ő`,`œ`,`ŕ`,`ŗ`,`ř`,`ś`,`ŝ`,`ş`,`š`,`ţ`,`ť`,`ŧ`,`ũ`,`ū`,`ŭ`,`ů`,`ű`,`ų`,`ŵ`,`ŷ`,`ź`,`ż`,[`ž`,`ƀ`],`ƃ`,`ƅ`,`ƈ`,[`ƌ`,`ƍ`],`ƒ`,`ƕ`,[`ƙ`,`ƛ`],`ƞ`,`ơ`,`ƣ`,`ƥ`,`ƨ`,[`ƪ`,`ƫ`],`ƭ`,`ư`,`ƴ`,`ƶ`,[`ƹ`,`ƺ`],[`ƽ`,`ƿ`],`ǆ`,`ǉ`,`ǌ`,`ǎ`,`ǐ`,`ǒ`,`ǔ`,`ǖ`,`ǘ`,`ǚ`,[`ǜ`,`ǝ`],`ǟ`,`ǡ`,`ǣ`,`ǥ`,`ǧ`,`ǩ`,`ǫ`,`ǭ`,[`ǯ`,`ǰ`],`ǳ`,`ǵ`,`ǹ`,`ǻ`,`ǽ`,`ǿ`,`ȁ`,`ȃ`,`ȅ`,`ȇ`,`ȉ`,`ȋ`,`ȍ`,`ȏ`,`ȑ`,`ȓ`,`ȕ`,`ȗ`,`ș`,`ț`,`ȝ`,`ȟ`,`ȡ`,`ȣ`,`ȥ`,`ȧ`,`ȩ`,`ȫ`,`ȭ`,`ȯ`,`ȱ`,[`ȳ`,`ȹ`],`ȼ`,[`ȿ`,`ɀ`],`ɂ`,`ɇ`,`ɉ`,`ɋ`,`ɍ`,[`ɏ`,`ʓ`],[`ʕ`,`ʯ`],`ͱ`,`ͳ`,`ͷ`,[`ͻ`,`ͽ`],`ΐ`,[`ά`,`ώ`],[`ϐ`,`ϑ`],[`ϕ`,`ϗ`],`ϙ`,`ϛ`,`ϝ`,`ϟ`,`ϡ`,`ϣ`,`ϥ`,`ϧ`,`ϩ`,`ϫ`,`ϭ`,[`ϯ`,`ϳ`],`ϵ`,`ϸ`,[`ϻ`,`ϼ`],[`а`,`џ`],`ѡ`,`ѣ`,`ѥ`,`ѧ`,`ѩ`,`ѫ`,`ѭ`,`ѯ`,`ѱ`,`ѳ`,`ѵ`,`ѷ`,`ѹ`,`ѻ`,`ѽ`,`ѿ`,`ҁ`,`ҋ`,`ҍ`,`ҏ`,`ґ`,`ғ`,`ҕ`,`җ`,`ҙ`,`қ`,`ҝ`,`ҟ`,`ҡ`,`ң`,`ҥ`,`ҧ`,`ҩ`,`ҫ`,`ҭ`,`ү`,`ұ`,`ҳ`,`ҵ`,`ҷ`,`ҹ`,`һ`,`ҽ`,`ҿ`,`ӂ`,`ӄ`,`ӆ`,`ӈ`,`ӊ`,`ӌ`,[`ӎ`,`ӏ`],`ӑ`,`ӓ`,`ӕ`,`ӗ`,`ә`,`ӛ`,`ӝ`,`ӟ`,`ӡ`,`ӣ`,`ӥ`,`ӧ`,`ө`,`ӫ`,`ӭ`,`ӯ`,`ӱ`,`ӳ`,`ӵ`,`ӷ`,`ӹ`,`ӻ`,`ӽ`,`ӿ`,`ԁ`,`ԃ`,`ԅ`,`ԇ`,`ԉ`,`ԋ`,`ԍ`,`ԏ`,`ԑ`,`ԓ`,`ԕ`,`ԗ`,`ԙ`,`ԛ`,`ԝ`,`ԟ`,`ԡ`,`ԣ`,`ԥ`,`ԧ`,[`ա`,`և`],[`ᴀ`,`ᴫ`],[`ᵫ`,`ᵷ`],[`ᵹ`,`ᶚ`],`ḁ`,`ḃ`,`ḅ`,`ḇ`,`ḉ`,`ḋ`,`ḍ`,`ḏ`,`ḑ`,`ḓ`,`ḕ`,`ḗ`,`ḙ`,`ḛ`,`ḝ`,`ḟ`,`ḡ`,`ḣ`,`ḥ`,`ḧ`,`ḩ`,`ḫ`,`ḭ`,`ḯ`,`ḱ`,`ḳ`,`ḵ`,`ḷ`,`ḹ`,`ḻ`,`ḽ`,`ḿ`,`ṁ`,`ṃ`,`ṅ`,`ṇ`,`ṉ`,`ṋ`,`ṍ`,`ṏ`,`ṑ`,`ṓ`,`ṕ`,`ṗ`,`ṙ`,`ṛ`,`ṝ`,`ṟ`,`ṡ`,`ṣ`,`ṥ`,`ṧ`,`ṩ`,`ṫ`,`ṭ`,`ṯ`,`ṱ`,`ṳ`,`ṵ`,`ṷ`,`ṹ`,`ṻ`,`ṽ`,`ṿ`,`ẁ`,`ẃ`,`ẅ`,`ẇ`,`ẉ`,`ẋ`,`ẍ`,`ẏ`,`ẑ`,`ẓ`,[`ẕ`,`ẝ`],`ẟ`,`ạ`,`ả`,`ấ`,`ầ`,`ẩ`,`ẫ`,`ậ`,`ắ`,`ằ`,`ẳ`,`ẵ`,`ặ`,`ẹ`,`ẻ`,`ẽ`,`ế`,`ề`,`ể`,`ễ`,`ệ`,`ỉ`,`ị`,`ọ`,`ỏ`,`ố`,`ồ`,`ổ`,`ỗ`,`ộ`,`ớ`,`ờ`,`ở`,`ỡ`,`ợ`,`ụ`,`ủ`,`ứ`,`ừ`,`ử`,`ữ`,`ự`,`ỳ`,`ỵ`,`ỷ`,`ỹ`,`ỻ`,`ỽ`,[`ỿ`,`ἇ`],[`ἐ`,`ἕ`],[`ἠ`,`ἧ`],[`ἰ`,`ἷ`],[`ὀ`,`ὅ`],[`ὐ`,`ὗ`],[`ὠ`,`ὧ`],[`ὰ`,`ώ`],[`ᾀ`,`ᾇ`],[`ᾐ`,`ᾗ`],[`ᾠ`,`ᾧ`],[`ᾰ`,`ᾴ`],[`ᾶ`,`ᾷ`],`ι`,[`ῂ`,`ῄ`],[`ῆ`,`ῇ`],[`ῐ`,`ΐ`],[`ῖ`,`ῗ`],[`ῠ`,`ῧ`],[`ῲ`,`ῴ`],[`ῶ`,`ῷ`],`ℊ`,[`ℎ`,`ℏ`],`ℓ`,`ℯ`,`ℴ`,`ℹ`,[`ℼ`,`ℽ`],[`ⅆ`,`ⅉ`],`ⅎ`,`ↄ`,[`ⰰ`,`ⱞ`],`ⱡ`,[`ⱥ`,`ⱦ`],`ⱨ`,`ⱪ`,`ⱬ`,`ⱱ`,[`ⱳ`,`ⱴ`],[`ⱶ`,`ⱻ`],`ⲁ`,`ⲃ`,`ⲅ`,`ⲇ`,`ⲉ`,`ⲋ`,`ⲍ`,`ⲏ`,`ⲑ`,`ⲓ`,`ⲕ`,`ⲗ`,`ⲙ`,`ⲛ`,`ⲝ`,`ⲟ`,`ⲡ`,`ⲣ`,`ⲥ`,`ⲧ`,`ⲩ`,`ⲫ`,`ⲭ`,`ⲯ`,`ⲱ`,`ⲳ`,`ⲵ`,`ⲷ`,`ⲹ`,`ⲻ`,`ⲽ`,`ⲿ`,`ⳁ`,`ⳃ`,`ⳅ`,`ⳇ`,`ⳉ`,`ⳋ`,`ⳍ`,`ⳏ`,`ⳑ`,`ⳓ`,`ⳕ`,`ⳗ`,`ⳙ`,`ⳛ`,`ⳝ`,`ⳟ`,`ⳡ`,[`ⳣ`,`ⳤ`],`ⳬ`,`ⳮ`,`ⳳ`,[`ⴀ`,`ⴥ`],`ⴧ`,`ⴭ`,`ꙁ`,`ꙃ`,`ꙅ`,`ꙇ`,`ꙉ`,`ꙋ`,`ꙍ`,`ꙏ`,`ꙑ`,`ꙓ`,`ꙕ`,`ꙗ`,`ꙙ`,`ꙛ`,`ꙝ`,`ꙟ`,`ꙡ`,`ꙣ`,`ꙥ`,`ꙧ`,`ꙩ`,`ꙫ`,`ꙭ`,`ꚁ`,`ꚃ`,`ꚅ`,`ꚇ`,`ꚉ`,`ꚋ`,`ꚍ`,`ꚏ`,`ꚑ`,`ꚓ`,`ꚕ`,`ꚗ`,`ꜣ`,`ꜥ`,`ꜧ`,`ꜩ`,`ꜫ`,`ꜭ`,[`ꜯ`,`ꜱ`],`ꜳ`,`ꜵ`,`ꜷ`,`ꜹ`,`ꜻ`,`ꜽ`,`ꜿ`,`ꝁ`,`ꝃ`,`ꝅ`,`ꝇ`,`ꝉ`,`ꝋ`,`ꝍ`,`ꝏ`,`ꝑ`,`ꝓ`,`ꝕ`,`ꝗ`,`ꝙ`,`ꝛ`,`ꝝ`,`ꝟ`,`ꝡ`,`ꝣ`,`ꝥ`,`ꝧ`,`ꝩ`,`ꝫ`,`ꝭ`,`ꝯ`,[`ꝱ`,`ꝸ`],`ꝺ`,`ꝼ`,`ꝿ`,`ꞁ`,`ꞃ`,`ꞅ`,`ꞇ`,`ꞌ`,`ꞎ`,`ꞑ`,`ꞓ`,`ꞡ`,`ꞣ`,`ꞥ`,`ꞧ`,`ꞩ`,`ꟺ`,[`ﬀ`,`ﬆ`],[`ﬓ`,`ﬗ`],[`ａ`,`ｚ`]],!1,!1),Ut=/^[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5-\u06E6\u07F4-\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C-\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D-\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8-\uA7F9\uA9CF\uAA70\uAADD\uAAF3-\uAAF4\uFF70\uFF9E-\uFF9F]/,W=on([[`ʰ`,`ˁ`],[`ˆ`,`ˑ`],[`ˠ`,`ˤ`],`ˬ`,`ˮ`,`ʹ`,`ͺ`,`ՙ`,`ـ`,[`ۥ`,`ۦ`],[`ߴ`,`ߵ`],`ߺ`,`ࠚ`,`ࠤ`,`ࠨ`,`ॱ`,`ๆ`,`ໆ`,`ჼ`,`ៗ`,`ᡃ`,`ᪧ`,[`ᱸ`,`ᱽ`],[`ᴬ`,`ᵪ`],`ᵸ`,[`ᶛ`,`ᶿ`],`ⁱ`,`ⁿ`,[`ₐ`,`ₜ`],[`ⱼ`,`ⱽ`],`ⵯ`,`ⸯ`,`々`,[`〱`,`〵`],`〻`,[`ゝ`,`ゞ`],[`ー`,`ヾ`],`ꀕ`,[`ꓸ`,`ꓽ`],`ꘌ`,`ꙿ`,[`ꜗ`,`ꜟ`],`ꝰ`,`ꞈ`,[`ꟸ`,`ꟹ`],`ꧏ`,`ꩰ`,`ꫝ`,[`ꫳ`,`ꫴ`],`ｰ`,[`ﾞ`,`ﾟ`]],!1,!1),Wt=/^[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A-\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,Gt=on([`ª`,`º`,`ƻ`,[`ǀ`,`ǃ`],`ʔ`,[`א`,`ת`],[`װ`,`ײ`],[`ؠ`,`ؿ`],[`ف`,`ي`],[`ٮ`,`ٯ`],[`ٱ`,`ۓ`],`ە`,[`ۮ`,`ۯ`],[`ۺ`,`ۼ`],`ۿ`,`ܐ`,[`ܒ`,`ܯ`],[`ݍ`,`ޥ`],`ޱ`,[`ߊ`,`ߪ`],[`ࠀ`,`ࠕ`],[`ࡀ`,`ࡘ`],`ࢠ`,[`ࢢ`,`ࢬ`],[`ऄ`,`ह`],`ऽ`,`ॐ`,[`क़`,`ॡ`],[`ॲ`,`ॷ`],[`ॹ`,`ॿ`],[`অ`,`ঌ`],[`এ`,`ঐ`],[`ও`,`ন`],[`প`,`র`],`ল`,[`শ`,`হ`],`ঽ`,`ৎ`,[`ড়`,`ঢ়`],[`য়`,`ৡ`],[`ৰ`,`ৱ`],[`ਅ`,`ਊ`],[`ਏ`,`ਐ`],[`ਓ`,`ਨ`],[`ਪ`,`ਰ`],[`ਲ`,`ਲ਼`],[`ਵ`,`ਸ਼`],[`ਸ`,`ਹ`],[`ਖ਼`,`ੜ`],`ਫ਼`,[`ੲ`,`ੴ`],[`અ`,`ઍ`],[`એ`,`ઑ`],[`ઓ`,`ન`],[`પ`,`ર`],[`લ`,`ળ`],[`વ`,`હ`],`ઽ`,`ૐ`,[`ૠ`,`ૡ`],[`ଅ`,`ଌ`],[`ଏ`,`ଐ`],[`ଓ`,`ନ`],[`ପ`,`ର`],[`ଲ`,`ଳ`],[`ଵ`,`ହ`],`ଽ`,[`ଡ଼`,`ଢ଼`],[`ୟ`,`ୡ`],`ୱ`,`ஃ`,[`அ`,`ஊ`],[`எ`,`ஐ`],[`ஒ`,`க`],[`ங`,`ச`],`ஜ`,[`ஞ`,`ட`],[`ண`,`த`],[`ந`,`ப`],[`ம`,`ஹ`],`ௐ`,[`అ`,`ఌ`],[`ఎ`,`ఐ`],[`ఒ`,`న`],[`ప`,`ళ`],[`వ`,`హ`],`ఽ`,[`ౘ`,`ౙ`],[`ౠ`,`ౡ`],[`ಅ`,`ಌ`],[`ಎ`,`ಐ`],[`ಒ`,`ನ`],[`ಪ`,`ಳ`],[`ವ`,`ಹ`],`ಽ`,`ೞ`,[`ೠ`,`ೡ`],[`ೱ`,`ೲ`],[`അ`,`ഌ`],[`എ`,`ഐ`],[`ഒ`,`ഺ`],`ഽ`,`ൎ`,[`ൠ`,`ൡ`],[`ൺ`,`ൿ`],[`අ`,`ඖ`],[`ක`,`න`],[`ඳ`,`ර`],`ල`,[`ව`,`ෆ`],[`ก`,`ะ`],[`า`,`ำ`],[`เ`,`ๅ`],[`ກ`,`ຂ`],`ຄ`,[`ງ`,`ຈ`],`ຊ`,`ຍ`,[`ດ`,`ທ`],[`ນ`,`ຟ`],[`ມ`,`ຣ`],`ລ`,`ວ`,[`ສ`,`ຫ`],[`ອ`,`ະ`],[`າ`,`ຳ`],`ຽ`,[`ເ`,`ໄ`],[`ໜ`,`ໟ`],`ༀ`,[`ཀ`,`ཇ`],[`ཉ`,`ཬ`],[`ྈ`,`ྌ`],[`က`,`ဪ`],`ဿ`,[`ၐ`,`ၕ`],[`ၚ`,`ၝ`],`ၡ`,[`ၥ`,`ၦ`],[`ၮ`,`ၰ`],[`ၵ`,`ႁ`],`ႎ`,[`ა`,`ჺ`],[`ჽ`,`ቈ`],[`ቊ`,`ቍ`],[`ቐ`,`ቖ`],`ቘ`,[`ቚ`,`ቝ`],[`በ`,`ኈ`],[`ኊ`,`ኍ`],[`ነ`,`ኰ`],[`ኲ`,`ኵ`],[`ኸ`,`ኾ`],`ዀ`,[`ዂ`,`ዅ`],[`ወ`,`ዖ`],[`ዘ`,`ጐ`],[`ጒ`,`ጕ`],[`ጘ`,`ፚ`],[`ᎀ`,`ᎏ`],[`Ꭰ`,`Ᏼ`],[`ᐁ`,`ᙬ`],[`ᙯ`,`ᙿ`],[`ᚁ`,`ᚚ`],[`ᚠ`,`ᛪ`],[`ᜀ`,`ᜌ`],[`ᜎ`,`ᜑ`],[`ᜠ`,`ᜱ`],[`ᝀ`,`ᝑ`],[`ᝠ`,`ᝬ`],[`ᝮ`,`ᝰ`],[`ក`,`ឳ`],`ៜ`,[`ᠠ`,`ᡂ`],[`ᡄ`,`ᡷ`],[`ᢀ`,`ᢨ`],`ᢪ`,[`ᢰ`,`ᣵ`],[`ᤀ`,`ᤜ`],[`ᥐ`,`ᥭ`],[`ᥰ`,`ᥴ`],[`ᦀ`,`ᦫ`],[`ᧁ`,`ᧇ`],[`ᨀ`,`ᨖ`],[`ᨠ`,`ᩔ`],[`ᬅ`,`ᬳ`],[`ᭅ`,`ᭋ`],[`ᮃ`,`ᮠ`],[`ᮮ`,`ᮯ`],[`ᮺ`,`ᯥ`],[`ᰀ`,`ᰣ`],[`ᱍ`,`ᱏ`],[`ᱚ`,`ᱷ`],[`ᳩ`,`ᳬ`],[`ᳮ`,`ᳱ`],[`ᳵ`,`ᳶ`],[`ℵ`,`ℸ`],[`ⴰ`,`ⵧ`],[`ⶀ`,`ⶖ`],[`ⶠ`,`ⶦ`],[`ⶨ`,`ⶮ`],[`ⶰ`,`ⶶ`],[`ⶸ`,`ⶾ`],[`ⷀ`,`ⷆ`],[`ⷈ`,`ⷎ`],[`ⷐ`,`ⷖ`],[`ⷘ`,`ⷞ`],`〆`,`〼`,[`ぁ`,`ゖ`],`ゟ`,[`ァ`,`ヺ`],`ヿ`,[`ㄅ`,`ㄭ`],[`ㄱ`,`ㆎ`],[`ㆠ`,`ㆺ`],[`ㇰ`,`ㇿ`],[`㐀`,`䶵`],[`一`,`鿌`],[`ꀀ`,`ꀔ`],[`ꀖ`,`ꒌ`],[`ꓐ`,`ꓷ`],[`ꔀ`,`ꘋ`],[`ꘐ`,`ꘟ`],[`ꘪ`,`ꘫ`],`ꙮ`,[`ꚠ`,`ꛥ`],[`ꟻ`,`ꠁ`],[`ꠃ`,`ꠅ`],[`ꠇ`,`ꠊ`],[`ꠌ`,`ꠢ`],[`ꡀ`,`ꡳ`],[`ꢂ`,`ꢳ`],[`ꣲ`,`ꣷ`],`ꣻ`,[`ꤊ`,`ꤥ`],[`ꤰ`,`ꥆ`],[`ꥠ`,`ꥼ`],[`ꦄ`,`ꦲ`],[`ꨀ`,`ꨨ`],[`ꩀ`,`ꩂ`],[`ꩄ`,`ꩋ`],[`ꩠ`,`ꩯ`],[`ꩱ`,`ꩶ`],`ꩺ`,[`ꪀ`,`ꪯ`],`ꪱ`,[`ꪵ`,`ꪶ`],[`ꪹ`,`ꪽ`],`ꫀ`,`ꫂ`,[`ꫛ`,`ꫜ`],[`ꫠ`,`ꫪ`],`ꫲ`,[`ꬁ`,`ꬆ`],[`ꬉ`,`ꬎ`],[`ꬑ`,`ꬖ`],[`ꬠ`,`ꬦ`],[`ꬨ`,`ꬮ`],[`ꯀ`,`ꯢ`],[`가`,`힣`],[`ힰ`,`ퟆ`],[`ퟋ`,`ퟻ`],[`豈`,`舘`],[`並`,`龎`],`יִ`,[`ײַ`,`ﬨ`],[`שׁ`,`זּ`],[`טּ`,`לּ`],`מּ`,[`נּ`,`סּ`],[`ףּ`,`פּ`],[`צּ`,`ﮱ`],[`ﯓ`,`ﴽ`],[`ﵐ`,`ﶏ`],[`ﶒ`,`ﷇ`],[`ﷰ`,`ﷻ`],[`ﹰ`,`ﹴ`],[`ﹶ`,`ﻼ`],[`ｦ`,`ｯ`],[`ｱ`,`ﾝ`],[`ﾠ`,`ﾾ`],[`ￂ`,`ￇ`],[`ￊ`,`ￏ`],[`ￒ`,`ￗ`],[`ￚ`,`ￜ`]],!1,!1),Kt=/^[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,qt=on([`ǅ`,`ǈ`,`ǋ`,`ǲ`,[`ᾈ`,`ᾏ`],[`ᾘ`,`ᾟ`],[`ᾨ`,`ᾯ`],`ᾼ`,`ῌ`,`ῼ`],!1,!1),Jt=/^[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178-\u0179\u017B\u017D\u0181-\u0182\u0184\u0186-\u0187\u0189-\u018B\u018E-\u0191\u0193-\u0194\u0196-\u0198\u019C-\u019D\u019F-\u01A0\u01A2\u01A4\u01A6-\u01A7\u01A9\u01AC\u01AE-\u01AF\u01B1-\u01B3\u01B5\u01B7-\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A-\u023B\u023D-\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E-\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9-\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0-\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E-\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D-\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A]/,Yt=on([[`A`,`Z`],[`À`,`Ö`],[`Ø`,`Þ`],`Ā`,`Ă`,`Ą`,`Ć`,`Ĉ`,`Ċ`,`Č`,`Ď`,`Đ`,`Ē`,`Ĕ`,`Ė`,`Ę`,`Ě`,`Ĝ`,`Ğ`,`Ġ`,`Ģ`,`Ĥ`,`Ħ`,`Ĩ`,`Ī`,`Ĭ`,`Į`,`İ`,`Ĳ`,`Ĵ`,`Ķ`,`Ĺ`,`Ļ`,`Ľ`,`Ŀ`,`Ł`,`Ń`,`Ņ`,`Ň`,`Ŋ`,`Ō`,`Ŏ`,`Ő`,`Œ`,`Ŕ`,`Ŗ`,`Ř`,`Ś`,`Ŝ`,`Ş`,`Š`,`Ţ`,`Ť`,`Ŧ`,`Ũ`,`Ū`,`Ŭ`,`Ů`,`Ű`,`Ų`,`Ŵ`,`Ŷ`,[`Ÿ`,`Ź`],`Ż`,`Ž`,[`Ɓ`,`Ƃ`],`Ƅ`,[`Ɔ`,`Ƈ`],[`Ɖ`,`Ƌ`],[`Ǝ`,`Ƒ`],[`Ɠ`,`Ɣ`],[`Ɩ`,`Ƙ`],[`Ɯ`,`Ɲ`],[`Ɵ`,`Ơ`],`Ƣ`,`Ƥ`,[`Ʀ`,`Ƨ`],`Ʃ`,`Ƭ`,[`Ʈ`,`Ư`],[`Ʊ`,`Ƴ`],`Ƶ`,[`Ʒ`,`Ƹ`],`Ƽ`,`Ǆ`,`Ǉ`,`Ǌ`,`Ǎ`,`Ǐ`,`Ǒ`,`Ǔ`,`Ǖ`,`Ǘ`,`Ǚ`,`Ǜ`,`Ǟ`,`Ǡ`,`Ǣ`,`Ǥ`,`Ǧ`,`Ǩ`,`Ǫ`,`Ǭ`,`Ǯ`,`Ǳ`,`Ǵ`,[`Ƕ`,`Ǹ`],`Ǻ`,`Ǽ`,`Ǿ`,`Ȁ`,`Ȃ`,`Ȅ`,`Ȇ`,`Ȉ`,`Ȋ`,`Ȍ`,`Ȏ`,`Ȑ`,`Ȓ`,`Ȕ`,`Ȗ`,`Ș`,`Ț`,`Ȝ`,`Ȟ`,`Ƞ`,`Ȣ`,`Ȥ`,`Ȧ`,`Ȩ`,`Ȫ`,`Ȭ`,`Ȯ`,`Ȱ`,`Ȳ`,[`Ⱥ`,`Ȼ`],[`Ƚ`,`Ⱦ`],`Ɂ`,[`Ƀ`,`Ɇ`],`Ɉ`,`Ɋ`,`Ɍ`,`Ɏ`,`Ͱ`,`Ͳ`,`Ͷ`,`Ά`,[`Έ`,`Ί`],`Ό`,[`Ύ`,`Ώ`],[`Α`,`Ρ`],[`Σ`,`Ϋ`],`Ϗ`,[`ϒ`,`ϔ`],`Ϙ`,`Ϛ`,`Ϝ`,`Ϟ`,`Ϡ`,`Ϣ`,`Ϥ`,`Ϧ`,`Ϩ`,`Ϫ`,`Ϭ`,`Ϯ`,`ϴ`,`Ϸ`,[`Ϲ`,`Ϻ`],[`Ͻ`,`Я`],`Ѡ`,`Ѣ`,`Ѥ`,`Ѧ`,`Ѩ`,`Ѫ`,`Ѭ`,`Ѯ`,`Ѱ`,`Ѳ`,`Ѵ`,`Ѷ`,`Ѹ`,`Ѻ`,`Ѽ`,`Ѿ`,`Ҁ`,`Ҋ`,`Ҍ`,`Ҏ`,`Ґ`,`Ғ`,`Ҕ`,`Җ`,`Ҙ`,`Қ`,`Ҝ`,`Ҟ`,`Ҡ`,`Ң`,`Ҥ`,`Ҧ`,`Ҩ`,`Ҫ`,`Ҭ`,`Ү`,`Ұ`,`Ҳ`,`Ҵ`,`Ҷ`,`Ҹ`,`Һ`,`Ҽ`,`Ҿ`,[`Ӏ`,`Ӂ`],`Ӄ`,`Ӆ`,`Ӈ`,`Ӊ`,`Ӌ`,`Ӎ`,`Ӑ`,`Ӓ`,`Ӕ`,`Ӗ`,`Ә`,`Ӛ`,`Ӝ`,`Ӟ`,`Ӡ`,`Ӣ`,`Ӥ`,`Ӧ`,`Ө`,`Ӫ`,`Ӭ`,`Ӯ`,`Ӱ`,`Ӳ`,`Ӵ`,`Ӷ`,`Ӹ`,`Ӻ`,`Ӽ`,`Ӿ`,`Ԁ`,`Ԃ`,`Ԅ`,`Ԇ`,`Ԉ`,`Ԋ`,`Ԍ`,`Ԏ`,`Ԑ`,`Ԓ`,`Ԕ`,`Ԗ`,`Ԙ`,`Ԛ`,`Ԝ`,`Ԟ`,`Ԡ`,`Ԣ`,`Ԥ`,`Ԧ`,[`Ա`,`Ֆ`],[`Ⴀ`,`Ⴥ`],`Ⴧ`,`Ⴭ`,`Ḁ`,`Ḃ`,`Ḅ`,`Ḇ`,`Ḉ`,`Ḋ`,`Ḍ`,`Ḏ`,`Ḑ`,`Ḓ`,`Ḕ`,`Ḗ`,`Ḙ`,`Ḛ`,`Ḝ`,`Ḟ`,`Ḡ`,`Ḣ`,`Ḥ`,`Ḧ`,`Ḩ`,`Ḫ`,`Ḭ`,`Ḯ`,`Ḱ`,`Ḳ`,`Ḵ`,`Ḷ`,`Ḹ`,`Ḻ`,`Ḽ`,`Ḿ`,`Ṁ`,`Ṃ`,`Ṅ`,`Ṇ`,`Ṉ`,`Ṋ`,`Ṍ`,`Ṏ`,`Ṑ`,`Ṓ`,`Ṕ`,`Ṗ`,`Ṙ`,`Ṛ`,`Ṝ`,`Ṟ`,`Ṡ`,`Ṣ`,`Ṥ`,`Ṧ`,`Ṩ`,`Ṫ`,`Ṭ`,`Ṯ`,`Ṱ`,`Ṳ`,`Ṵ`,`Ṷ`,`Ṹ`,`Ṻ`,`Ṽ`,`Ṿ`,`Ẁ`,`Ẃ`,`Ẅ`,`Ẇ`,`Ẉ`,`Ẋ`,`Ẍ`,`Ẏ`,`Ẑ`,`Ẓ`,`Ẕ`,`ẞ`,`Ạ`,`Ả`,`Ấ`,`Ầ`,`Ẩ`,`Ẫ`,`Ậ`,`Ắ`,`Ằ`,`Ẳ`,`Ẵ`,`Ặ`,`Ẹ`,`Ẻ`,`Ẽ`,`Ế`,`Ề`,`Ể`,`Ễ`,`Ệ`,`Ỉ`,`Ị`,`Ọ`,`Ỏ`,`Ố`,`Ồ`,`Ổ`,`Ỗ`,`Ộ`,`Ớ`,`Ờ`,`Ở`,`Ỡ`,`Ợ`,`Ụ`,`Ủ`,`Ứ`,`Ừ`,`Ử`,`Ữ`,`Ự`,`Ỳ`,`Ỵ`,`Ỷ`,`Ỹ`,`Ỻ`,`Ỽ`,`Ỿ`,[`Ἀ`,`Ἇ`],[`Ἐ`,`Ἕ`],[`Ἠ`,`Ἧ`],[`Ἰ`,`Ἷ`],[`Ὀ`,`Ὅ`],`Ὑ`,`Ὓ`,`Ὕ`,`Ὗ`,[`Ὠ`,`Ὧ`],[`Ᾰ`,`Ά`],[`Ὲ`,`Ή`],[`Ῐ`,`Ί`],[`Ῠ`,`Ῥ`],[`Ὸ`,`Ώ`],`ℂ`,`ℇ`,[`ℋ`,`ℍ`],[`ℐ`,`ℒ`],`ℕ`,[`ℙ`,`ℝ`],`ℤ`,`Ω`,`ℨ`,[`K`,`ℭ`],[`ℰ`,`ℳ`],[`ℾ`,`ℿ`],`ⅅ`,`Ↄ`,[`Ⰰ`,`Ⱞ`],`Ⱡ`,[`Ɫ`,`Ɽ`],`Ⱨ`,`Ⱪ`,`Ⱬ`,[`Ɑ`,`Ɒ`],`Ⱳ`,`Ⱶ`,[`Ȿ`,`Ⲁ`],`Ⲃ`,`Ⲅ`,`Ⲇ`,`Ⲉ`,`Ⲋ`,`Ⲍ`,`Ⲏ`,`Ⲑ`,`Ⲓ`,`Ⲕ`,`Ⲗ`,`Ⲙ`,`Ⲛ`,`Ⲝ`,`Ⲟ`,`Ⲡ`,`Ⲣ`,`Ⲥ`,`Ⲧ`,`Ⲩ`,`Ⲫ`,`Ⲭ`,`Ⲯ`,`Ⲱ`,`Ⲳ`,`Ⲵ`,`Ⲷ`,`Ⲹ`,`Ⲻ`,`Ⲽ`,`Ⲿ`,`Ⳁ`,`Ⳃ`,`Ⳅ`,`Ⳇ`,`Ⳉ`,`Ⳋ`,`Ⳍ`,`Ⳏ`,`Ⳑ`,`Ⳓ`,`Ⳕ`,`Ⳗ`,`Ⳙ`,`Ⳛ`,`Ⳝ`,`Ⳟ`,`Ⳡ`,`Ⳣ`,`Ⳬ`,`Ⳮ`,`Ⳳ`,`Ꙁ`,`Ꙃ`,`Ꙅ`,`Ꙇ`,`Ꙉ`,`Ꙋ`,`Ꙍ`,`Ꙏ`,`Ꙑ`,`Ꙓ`,`Ꙕ`,`Ꙗ`,`Ꙙ`,`Ꙛ`,`Ꙝ`,`Ꙟ`,`Ꙡ`,`Ꙣ`,`Ꙥ`,`Ꙧ`,`Ꙩ`,`Ꙫ`,`Ꙭ`,`Ꚁ`,`Ꚃ`,`Ꚅ`,`Ꚇ`,`Ꚉ`,`Ꚋ`,`Ꚍ`,`Ꚏ`,`Ꚑ`,`Ꚓ`,`Ꚕ`,`Ꚗ`,`Ꜣ`,`Ꜥ`,`Ꜧ`,`Ꜩ`,`Ꜫ`,`Ꜭ`,`Ꜯ`,`Ꜳ`,`Ꜵ`,`Ꜷ`,`Ꜹ`,`Ꜻ`,`Ꜽ`,`Ꜿ`,`Ꝁ`,`Ꝃ`,`Ꝅ`,`Ꝇ`,`Ꝉ`,`Ꝋ`,`Ꝍ`,`Ꝏ`,`Ꝑ`,`Ꝓ`,`Ꝕ`,`Ꝗ`,`Ꝙ`,`Ꝛ`,`Ꝝ`,`Ꝟ`,`Ꝡ`,`Ꝣ`,`Ꝥ`,`Ꝧ`,`Ꝩ`,`Ꝫ`,`Ꝭ`,`Ꝯ`,`Ꝺ`,`Ꝼ`,[`Ᵹ`,`Ꝿ`],`Ꞁ`,`Ꞃ`,`Ꞅ`,`Ꞇ`,`Ꞌ`,`Ɥ`,`Ꞑ`,`Ꞓ`,`Ꞡ`,`Ꞣ`,`Ꞥ`,`Ꞧ`,`Ꞩ`,`Ɦ`,[`Ａ`,`Ｚ`]],!1,!1),Xt=/^[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]/,Zt=on([[`ᛮ`,`ᛰ`],[`Ⅰ`,`ↂ`],[`ↅ`,`ↈ`],`〇`,[`〡`,`〩`],[`〸`,`〺`],[`ꛦ`,`ꛯ`]],!1,!1),Qt=/^[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]/,$t=on([[`0`,`9`],[`٠`,`٩`],[`۰`,`۹`],[`߀`,`߉`],[`०`,`९`],[`০`,`৯`],[`੦`,`੯`],[`૦`,`૯`],[`୦`,`୯`],[`௦`,`௯`],[`౦`,`౯`],[`೦`,`೯`],[`൦`,`൯`],[`๐`,`๙`],[`໐`,`໙`],[`༠`,`༩`],[`၀`,`၉`],[`႐`,`႙`],[`០`,`៩`],[`᠐`,`᠙`],[`᥆`,`᥏`],[`᧐`,`᧙`],[`᪀`,`᪉`],[`᪐`,`᪙`],[`᭐`,`᭙`],[`᮰`,`᮹`],[`᱀`,`᱉`],[`᱐`,`᱙`],[`꘠`,`꘩`],[`꣐`,`꣙`],[`꤀`,`꤉`],[`꧐`,`꧙`],[`꩐`,`꩙`],[`꯰`,`꯹`],[`０`,`９`]],!1,!1),G=0,K=0,en=[{line:1,column:1}],tn=0,nn=[],q=0,rn;if(`startRule`in t){if(!(t.startRule in i))throw Error(`Can't start parsing from rule "`+t.startRule+`".`);a=i[t.startRule]}function an(){return e.substring(K,G)}function J(e,t){return{type:`literal`,text:e,ignoreCase:t}}function on(e,t,n){return{type:`class`,parts:e,inverted:t,ignoreCase:n}}function sn(){return{type:`any`}}function cn(){return{type:`end`}}function ln(e){return{type:`other`,description:e}}function un(t){var n=en[t],r;if(n)return n;for(r=t-1;!en[r];)r--;for(n=en[r],n={line:n.line,column:n.column};r<t;)e.charCodeAt(r)===10?(n.line++,n.column=1):n.column++,r++;return en[t]=n,n}function dn(e,t){var n=un(e),r=un(t);return{start:{offset:e,line:n.line,column:n.column},end:{offset:t,line:r.line,column:r.column}}}function Y(e){G<tn||(G>tn&&(tn=G,nn=[]),nn.push(e))}function fn(e,t,n){return new r(r.buildMessage(e,t),e,t,n)}function pn(){var e=[],t=mn();if(t!==n)for(;t!==n;)e.push(t),t=mn();else e=n;return e}function mn(){var t=G,r=X(),i,a,_,v,y,b,x,S,C,w,T;return r===n?(G=t,t=n):(e.substr(G,6).toLowerCase()===o?(i=e.substr(G,6),G+=6):(i=n,q===0&&Y(s)),i===n&&(i=null),i===n?(G=t,t=n):(a=X(),a===n?(G=t,t=n):(e.substr(G,5).toLowerCase()===c?(_=e.substr(G,5),G+=5):(_=n,q===0&&Y(l)),_===n&&(e.substr(G,7).toLowerCase()===u?(_=e.substr(G,7),G+=7):(_=n,q===0&&Y(d))),_===n?(G=t,t=n):(v=X(),v===n?(G=t,t=n):(y=Dn(),y===n&&(y=null),y===n?(G=t,t=n):(b=X(),b===n?(G=t,t=n):(e.charCodeAt(G)===123?(x=f,G++):(x=n,q===0&&Y(p)),x===n?(G=t,t=n):(S=hn(),S===n&&(S=null),S===n?(G=t,t=n):(C=X(),C===n?(G=t,t=n):(e.charCodeAt(G)===125?(w=m,G++):(w=n,q===0&&Y(h)),w===n?(G=t,t=n):(T=X(),T===n?(G=t,t=n):(K=t,r=g(i,_,y,S),t=r)))))))))))),t}function hn(){var t=G,r=X(),i,a,o,s,c,l,u,d,f;if(r!==n){if(i=gn(),i!==n){if(a=X(),a!==n){if(e.charCodeAt(G)===59?(o=_,G++):(o=n,q===0&&Y(v)),o===n&&(o=null),o!==n){for(s=[],c=G,l=X(),l===n?(G=c,c=n):(u=gn(),u===n?(G=c,c=n):(d=X(),d===n?(G=c,c=n):(e.charCodeAt(G)===59?(f=_,G++):(f=n,q===0&&Y(v)),f===n&&(f=null),f===n?(G=c,c=n):(K=c,l=y(i,u),c=l))));c!==n;)s.push(c),c=G,l=X(),l===n?(G=c,c=n):(u=gn(),u===n?(G=c,c=n):(d=X(),d===n?(G=c,c=n):(e.charCodeAt(G)===59?(f=_,G++):(f=n,q===0&&Y(v)),f===n&&(f=null),f===n?(G=c,c=n):(K=c,l=y(i,u),c=l))));s===n?(G=t,t=n):(K=t,r=b(i,s),t=r)}else G=t,t=n}else G=t,t=n}else G=t,t=n}else G=t,t=n;return t}function gn(){var t=G,r=Dn(),i,a,o,s;return r===n?(G=t,t=n):(i=X(),i===n?(G=t,t=n):(e.charCodeAt(G)===61?(a=x,G++):(a=n,q===0&&Y(S)),a===n?(G=t,t=n):(o=X(),o===n?(G=t,t=n):(s=Dn(),s===n?(G=t,t=n):(K=t,r=C(r,s),t=r))))),t===n&&(t=_n(),t===n&&(t=bn(),t===n&&(t=Tn(),t===n&&(t=Sn(),t===n&&(t=G,r=Dn(),r===n?(G=t,t=n):(e.charCodeAt(G)===61?(i=x,G++):(i=n,q===0&&Y(S)),i===n?(G=t,t=n):(a=Dn(),a===n?(G=t,t=n):(r=[r,i,a],t=r)))))))),t}function _n(){var t=G,r,i;return e.substr(G,5).toLowerCase()===c?(r=e.substr(G,5),G+=5):(r=n,q===0&&Y(l)),r===n&&(e.substr(G,4).toLowerCase()===w?(r=e.substr(G,4),G+=4):(r=n,q===0&&Y(T)),r===n&&(e.substr(G,4).toLowerCase()===E?(r=e.substr(G,4),G+=4):(r=n,q===0&&Y(D)))),r===n?(G=t,t=n):(i=vn(),i===n?(G=t,t=n):(K=t,r=O(r,i),t=r)),t}function vn(){var t=G,r=X(),i,a,o,s,c,l,u;return r===n?(G=t,t=n):(e.charCodeAt(G)===91?(i=k,G++):(i=n,q===0&&Y(A)),i===n?(G=t,t=n):(a=X(),a===n?(G=t,t=n):(o=yn(),o===n&&(o=null),o===n?(G=t,t=n):(s=X(),s===n?(G=t,t=n):(e.charCodeAt(G)===93?(c=j,G++):(c=n,q===0&&Y(M)),c===n?(G=t,t=n):(l=X(),l===n?(G=t,t=n):(u=vn(),u===n&&(u=null),u===n?(G=t,t=n):(K=t,r=N(o,u),t=r)))))))),t}function yn(){var t=G,r=X(),i,a,o,s,c,l;return r===n?(G=t,t=n):(i=Dn(),i===n?(G=t,t=n):(a=G,o=X(),o===n?(G=a,a=n):(e.charCodeAt(G)===61?(s=x,G++):(s=n,q===0&&Y(S)),s===n?(G=a,a=n):(c=X(),c===n?(G=a,a=n):(l=Dn(),l===n?(G=a,a=n):(K=a,o=P(i,l),a=o)))),a===n&&(a=null),a===n?(G=t,t=n):(o=X(),o===n?(G=t,t=n):(e.charCodeAt(G)===44?(s=F,G++):(s=n,q===0&&Y(I)),s===n&&(e.charCodeAt(G)===59?(s=_,G++):(s=n,q===0&&Y(v))),s===n&&(s=null),s===n?(G=t,t=n):(c=yn(),c===n&&(c=null),c===n?(G=t,t=n):(K=t,r=L(i,a,c),t=r)))))),t}function bn(){var e=G,t=Tn(),r,i;return t===n&&(t=Cn()),t===n?(G=e,e=n):(r=xn(),r===n?(G=e,e=n):(i=vn(),i===n&&(i=null),i===n?(G=e,e=n):(K=e,t=R(t,r,i),e=t))),e}function xn(){var t=G,r=X(),i,a,o,s,c;return r===n?(G=t,t=n):(e.substr(G,2)===ee?(i=ee,G+=2):(i=n,q===0&&Y(z)),i===n&&(e.substr(G,2)===B?(i=B,G+=2):(i=n,q===0&&Y(V))),i===n?(G=t,t=n):(a=X(),a===n?(G=t,t=n):(o=Tn(),o===n&&(o=Cn()),o===n?(G=t,t=n):(s=X(),s===n?(G=t,t=n):(c=xn(),c===n&&(c=null),c===n?(G=t,t=n):(K=t,r=te(i,o,c),t=r)))))),t}function Sn(){var e=G,t=Cn(),r;return t===n?(G=e,e=n):(r=vn(),r===n&&(r=null),r===n?(G=e,e=n):(K=e,t=ne(t,r),e=t)),e}function Cn(){var e=G,t=Dn(),r;return t===n?(G=e,e=n):(r=wn(),r===n&&(r=null),r===n?(G=e,e=n):(K=e,t=re(t,r),e=t)),e}function wn(){var t,r,i,a,o,s;return q++,t=G,e.charCodeAt(G)===58?(r=ae,G++):(r=n,q===0&&Y(H)),r===n?(G=t,t=n):(i=Dn(),i===n?(G=t,t=n):(a=G,e.charCodeAt(G)===58?(o=ae,G++):(o=n,q===0&&Y(H)),o===n?(G=a,a=n):(s=En(),s===n?(G=a,a=n):(K=a,o=oe(i,s),a=o)),a===n&&(a=null),a===n?(G=t,t=n):(K=t,r=se(i,a),t=r))),t===n&&(t=G,e.charCodeAt(G)===58?(r=ae,G++):(r=n,q===0&&Y(H)),r===n?(G=t,t=n):(i=En(),i===n?(G=t,t=n):(K=t,r=U(i),t=r))),q--,t===n&&(r=n,q===0&&Y(ie)),t}function Tn(){var t=G,r=G,i,a,o,s;return e.substr(G,8).toLowerCase()===ce?(i=e.substr(G,8),G+=8):(i=n,q===0&&Y(le)),i===n?(G=r,r=n):(a=X(),a===n?(G=r,r=n):(o=Dn(),o===n&&(o=null),o===n?(G=r,r=n):(s=X(),s===n?(G=r,r=n):(K=r,i=ue(o),r=i)))),r===n&&(r=null),r===n?(G=t,t=n):(e.charCodeAt(G)===123?(i=f,G++):(i=n,q===0&&Y(p)),i===n?(G=t,t=n):(a=hn(),a===n&&(a=null),a===n?(G=t,t=n):(o=X(),o===n?(G=t,t=n):(e.charCodeAt(G)===125?(s=m,G++):(s=n,q===0&&Y(h)),s===n?(G=t,t=n):(K=t,r=de(r,a),t=r))))),t}function En(){var t;return e.charCodeAt(G)===110?(t=fe,G++):(t=n,q===0&&Y(pe)),t===n&&(e.substr(G,2)===me?(t=me,G+=2):(t=n,q===0&&Y(he)),t===n&&(e.charCodeAt(G)===101?(t=ge,G++):(t=n,q===0&&Y(_e)),t===n&&(e.substr(G,2)===ve?(t=ve,G+=2):(t=n,q===0&&Y(ye)),t===n&&(e.charCodeAt(G)===115?(t=be,G++):(t=n,q===0&&Y(xe)),t===n&&(e.substr(G,2)===Se?(t=Se,G+=2):(t=n,q===0&&Y(Ce)),t===n&&(e.charCodeAt(G)===119?(t=we,G++):(t=n,q===0&&Y(Te)),t===n&&(e.substr(G,2)===Ee?(t=Ee,G+=2):(t=n,q===0&&Y(De))))))))),t}function Dn(){var e=On();return e===n&&(e=kn(),e===n&&(e=Mn(),e===n&&(e=In(),e===n&&(e=Nn())))),e}function On(){var e,t,r,i;if(q++,e=G,t=An(),t!==n){for(r=[],i=jn();i!==n;)r.push(i),i=jn();r===n?(G=e,e=n):(K=e,t=ke(t,r),e=t)}else G=e,e=n;return q--,e===n&&(t=n,q===0&&Y(Oe)),e}function kn(){var e=G,t=Mn(),r;return t===n?(G=e,e=n):(r=On(),r===n?(G=e,e=n):(K=e,t=Ae(t,r),e=t)),e}function An(){var t=Yn();return t===n&&(e.charCodeAt(G)===36?(t=je,G++):(t=n,q===0&&Y(Me)),t===n&&(e.charCodeAt(G)===95?(t=Ne,G++):(t=n,q===0&&Y(Pe)))),t}function jn(){var e=An();return e===n&&(e=nr()),e}function Mn(){var t,r,i,a,o,s,c,l,u;if(q++,t=G,r=G,e.charCodeAt(G)===45?(i=Ie,G++):(i=n,q===0&&Y(Le)),i===n&&(i=null),i!==n){if(a=G,e.charCodeAt(G)===46?(o=Re,G++):(o=n,q===0&&Y(ze)),o!==n){if(s=[],Be.test(e.charAt(G))?(c=e.charAt(G),G++):(c=n,q===0&&Y(Ve)),c!==n)for(;c!==n;)s.push(c),Be.test(e.charAt(G))?(c=e.charAt(G),G++):(c=n,q===0&&Y(Ve));else s=n;s===n?(G=a,a=n):(o=[o,s],a=o)}else G=a,a=n;if(a===n){if(a=G,o=[],Be.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ve)),s!==n)for(;s!==n;)o.push(s),Be.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ve));else o=n;if(o!==n){if(s=G,e.charCodeAt(G)===46?(c=Re,G++):(c=n,q===0&&Y(ze)),c!==n){for(l=[],Be.test(e.charAt(G))?(u=e.charAt(G),G++):(u=n,q===0&&Y(Ve));u!==n;)l.push(u),Be.test(e.charAt(G))?(u=e.charAt(G),G++):(u=n,q===0&&Y(Ve));l===n?(G=s,s=n):(c=[c,l],s=c)}else G=s,s=n;s===n&&(s=null),s===n?(G=a,a=n):(o=[o,s],a=o)}else G=a,a=n}a===n?(G=r,r=n):(i=[i,a],r=i)}else G=r,r=n;return r!==n&&(K=t,r=He(r)),t=r,q--,t===n&&(r=n,q===0&&Y(Fe)),t}function Nn(){var e=G,t=Pn();return t!==n&&(K=e,t=Ue(t)),e=t,e}function Pn(){var t=G,r,i,a;if(e.charCodeAt(G)===60?(r=We,G++):(r=n,q===0&&Y(Ge)),r!==n){for(i=[],a=Fn(),a===n&&(a=Pn());a!==n;)i.push(a),a=Fn(),a===n&&(a=Pn());i===n?(G=t,t=n):(e.charCodeAt(G)===62?(a=Ke,G++):(a=n,q===0&&Y(qe)),a===n?(G=t,t=n):(K=t,r=Je(i),t=r))}else G=t,t=n;return t}function Fn(){var t=G,r=[],i=G,a=G,o;if(q++,e.charCodeAt(G)===62?(o=Ke,G++):(o=n,q===0&&Y(qe)),o===n&&(e.charCodeAt(G)===60?(o=We,G++):(o=n,q===0&&Y(Ge))),q--,o===n?a=void 0:(G=a,a=n),a===n?(G=i,i=n):(e.length>G?(o=e.charAt(G),G++):(o=n,q===0&&Y(Ye)),o===n?(G=i,i=n):(K=i,a=Xe(o),i=a)),i!==n)for(;i!==n;)r.push(i),i=G,a=G,q++,e.charCodeAt(G)===62?(o=Ke,G++):(o=n,q===0&&Y(qe)),o===n&&(e.charCodeAt(G)===60?(o=We,G++):(o=n,q===0&&Y(Ge))),q--,o===n?a=void 0:(G=a,a=n),a===n?(G=i,i=n):(e.length>G?(o=e.charAt(G),G++):(o=n,q===0&&Y(Ye)),o===n?(G=i,i=n):(K=i,a=Xe(o),i=a));else r=n;return r!==n&&(K=t,r=Ze(r)),t=r,t}function In(){var t=G,r,i,a;if(e.charCodeAt(G)===34?(r=Qe,G++):(r=n,q===0&&Y($e)),r!==n){for(i=[],a=Ln();a!==n;)i.push(a),a=Ln();i===n?(G=t,t=n):(e.charCodeAt(G)===34?(a=Qe,G++):(a=n,q===0&&Y($e)),a===n?(G=t,t=n):(K=t,r=et(i),t=r))}else G=t,t=n;return t}function Ln(){var t=Rn(),r,i;return t===n&&(t=G,r=G,q++,e.charCodeAt(G)===34?(i=Qe,G++):(i=n,q===0&&Y($e)),i===n&&(i=Bn()),q--,i===n?r=void 0:(G=r,r=n),r===n?(G=t,t=n):(i=Hn(),i===n?(G=t,t=n):(K=t,r=tt(),t=r)),t===n&&(t=zn())),t}function Rn(){var t=G,r=G,i,a;return e.charCodeAt(G)===92?(i=nt,G++):(i=n,q===0&&Y(rt)),i===n?(G=r,r=n):(e.length>G?(a=e.charAt(G),G++):(a=n,q===0&&Y(Ye)),a===n?(G=r,r=n):(i=[i,a],r=i)),r!==n&&(K=t,r=it(r)),t=r,t}function zn(){var t=G,r,i;return e.charCodeAt(G)===92?(r=nt,G++):(r=n,q===0&&Y(rt)),r===n?(G=t,t=n):(i=Vn(),i===n?(G=t,t=n):(K=t,r=at(),t=r)),t}function Bn(){var t;return ot.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(st)),t}function Vn(){var t;return q++,e.charCodeAt(G)===10?(t=lt,G++):(t=n,q===0&&Y(ut)),t===n&&(e.substr(G,2)===dt?(t=dt,G+=2):(t=n,q===0&&Y(ft)),t===n&&(e.charCodeAt(G)===13?(t=pt,G++):(t=n,q===0&&Y(mt)),t===n&&(e.charCodeAt(G)===8232?(t=ht,G++):(t=n,q===0&&Y(gt)),t===n&&(e.charCodeAt(G)===8233?(t=_t,G++):(t=n,q===0&&Y(vt)))))),q--,t===n&&q===0&&Y(ct),t}function Hn(){var t;return e.length>G?(t=e.charAt(G),G++):(t=n,q===0&&Y(Ye)),t}function Un(){var e;return q++,e=Wn(),e===n&&(e=Gn(),e===n&&(e=Kn())),q--,e===n&&q===0&&Y(yt),e}function Wn(){var t,r,i,a,o,s;if(q++,t=G,e.substr(G,2)===xt?(r=xt,G+=2):(r=n,q===0&&Y(St)),r!==n){for(i=[],a=G,o=G,q++,e.substr(G,2)===Ct?(s=Ct,G+=2):(s=n,q===0&&Y(wt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Tt(s),a=o));a!==n;)i.push(a),a=G,o=G,q++,e.substr(G,2)===Ct?(s=Ct,G+=2):(s=n,q===0&&Y(wt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Tt(s),a=o));i===n?(G=t,t=n):(e.substr(G,2)===Ct?(a=Ct,G+=2):(a=n,q===0&&Y(wt)),a===n?(G=t,t=n):(K=t,r=Et(i),t=r))}else G=t,t=n;return q--,t===n&&(r=n,q===0&&Y(bt)),t}function Gn(){var t,r,i,a,o,s;if(q++,t=G,e.substr(G,2)===Ot?(r=Ot,G+=2):(r=n,q===0&&Y(kt)),r!==n){for(i=[],a=G,o=G,q++,At.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(jt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Xe(s),a=o));a!==n;)i.push(a),a=G,o=G,q++,At.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(jt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Xe(s),a=o));i===n?(G=t,t=n):(At.test(e.charAt(G))?(a=e.charAt(G),G++):(a=n,q===0&&Y(jt)),a===n&&(a=null),a===n?(G=t,t=n):(K=t,r=Mt(i),t=r))}else G=t,t=n;return q--,t===n&&(r=n,q===0&&Y(Dt)),t}function Kn(){var t,r,i,a,o,s;if(q++,t=G,e.charCodeAt(G)===35?(r=Pt,G++):(r=n,q===0&&Y(Ft)),r!==n){for(i=[],a=G,o=G,q++,At.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(jt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Xe(s),a=o));a!==n;)i.push(a),a=G,o=G,q++,At.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,q===0&&Y(jt)),q--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,q===0&&Y(Ye)),s===n?(G=a,a=n):(K=a,o=Xe(s),a=o));i===n?(G=t,t=n):(At.test(e.charAt(G))?(a=e.charAt(G),G++):(a=n,q===0&&Y(jt)),a===n&&(a=null),a===n?(G=t,t=n):(K=t,r=Mt(i),t=r))}else G=t,t=n;return q--,t===n&&(r=n,q===0&&Y(Nt)),t}function X(){var e,t;for(q++,e=[],t=Jn(),t===n&&(t=Un());t!==n;)e.push(t),t=Jn(),t===n&&(t=Un());return q--,e===n&&(t=n,q===0&&Y(It)),e}function qn(){var t=[],r;if(Lt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,q===0&&Y(Rt)),r!==n)for(;r!==n;)t.push(r),Lt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,q===0&&Y(Rt));else t=n;return t}function Jn(){var t=[],r;if(zt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,q===0&&Y(Bt)),r===n&&(r=qn()),r!==n)for(;r!==n;)t.push(r),zt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,q===0&&Y(Bt)),r===n&&(r=qn());else t=n;return t}function Yn(){var e=er();return e===n&&(e=Xn(),e===n&&(e=$n(),e===n&&(e=Zn(),e===n&&(e=Qn(),e===n&&(e=tr()))))),e}function Xn(){var t;return Vt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(Ht)),t}function Zn(){var t;return Ut.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(W)),t}function Qn(){var t;return Wt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(Gt)),t}function $n(){var t;return Kt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(qt)),t}function er(){var t;return Jt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(Yt)),t}function tr(){var t;return Xt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y(Zt)),t}function nr(){var t;return Qt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,q===0&&Y($t)),t}if(rn=a(),rn!==n&&G===e.length)return rn;throw rn!==n&&G<e.length&&Y(cn()),fn(nn,tn<e.length?e.charAt(tn):null,tn<e.length?dn(tn,tn+1):dn(tn,tn))}t.exports={SyntaxError:r,parse:i}})),Oh=o(((e,t)=>{t.exports=Dh().parse})),kh=o(((e,t)=>{t.exports=r;var n=Wu();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=L,m=L,h=L,g=L,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:z,forEachLinkedNode:P,forEachLink:N,beginUpdate:h,endUpdate:g,clear:M,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=R,_.endUpdate=g=ee,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function M(){h(),z(function(e){C(e.id)}),g()}function N(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function P(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?I(r.links,e,t):F(r.links,e,t)}function F(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function I(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function L(){}function R(){u+=1}function ee(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function z(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),Ah=o(((e,t)=>{t.exports=r;var n=Oh();function r(e,t){var r=n(e);if(r.length>1&&t!==void 0)throw Error("Dot file contains multiple graphs. Cannot use `saveTo` in this case");return t||=kh()(),i(t,r[0])}function i(e,t){return a(e,t),e}function a(e,t){var n=t.children;if(!n)return e;for(var r=[],i=0;i<n.length;++i){var l=n[i];l.type===`edge_stmt`?c(r,o(e,l)):l.type===`node_stmt`?c(r,s(e,l)):l.type===`subgraph`&&c(r,a(e,l))}return r}function o(e,t){var n=t.edge_list;if(n.length!==0){var r=n[0],i=[],a=l(e,r);c(i,a);for(var o=d(t.attr_list),s=1;s<n.length;++s){var f=l(e,n[s]);c(i,f),u(e,a,f,o),a=f}return i}}function s(e,t){return l(e,t.node_id,t.attr_list)}function c(e,t){for(var n=0;n<t.length;++n)e.push(t[n]);return e}function l(e,t,n){if(t.type===`node_id`){var r=f(d(n),e.getNode(t.id));return r?e.addNode(t.id,r):e.addNode(t.id),[t.id]}if(t.type===`subgraph`)return a(e,t)}function u(e,t,n,r){for(var i=0;i<t.length;++i)for(var a=0;a<n.length;++a)e.addLink(t[i],n[a],r)}function d(e){if(e&&e.length){for(var t=Object.create(null),n=0;n<e.length;++n){var r=e[n];r.type===`attr`&&r.id!==void 0&&(t[r.id]=r.eq)}return t}}function f(e,t){return!t||!t.data?e:Object.assign(t.data,e)}})),jh=o(((e,t)=>{t.exports=r;var n=qu();function r(e,t,r,a){var o;t||=i,r||=i,o=typeof e==`string`?JSON.parse(e):e;var s=n(a),c;if(o.links===void 0||o.nodes===void 0)throw Error(`Cannot load graph without links and nodes`);for(c=0;c<o.nodes.length;++c){var l=t(o.nodes[c]);if(!l.hasOwnProperty(`id`))throw Error(`Graph node format is invalid: Node id is missing`);s.addNode(l.id,l.data)}for(c=0;c<o.links.length;++c){var u=r(o.links[c]);if(!u.hasOwnProperty(`fromId`)||!u.hasOwnProperty(`toId`))throw Error(`Graph link format is invalid. Both fromId and toId are required`);s.addLink(u.fromId,u.toId,u.data)}return s}function i(e){return e}})),Mh=l(Ah(),1),Nh=l(jh(),1);function Ph(e){let t=e[0];var n=new FileReader;n.readAsText(t,`UTF-8`),n.onload=e=>{let t=e.target.result,n=r(t)||i(t);n&&bl.fire(`load-graph`,n)},n.onerror=e=>{console.log(`error loading dot file: `,e)};function r(e){try{return(0,Mh.default)(e)}catch(e){console.log(`error loading dot file: `,e)}}function i(e){try{return(0,Nh.default)(JSON.parse(e))}catch(e){console.log(`error loading JSON: `,e)}}}Fo(Th).mount(`#app`),Eh(document.body,Ph);