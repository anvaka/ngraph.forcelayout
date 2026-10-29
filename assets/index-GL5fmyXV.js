var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,n)=>{let r={};for(var i in e)t(r,i,{get:e[i],enumerable:!0});return n||t(r,Symbol.toStringTag,{value:`Module`}),r},c=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},l=(n,r,o)=>(o=n==null?{}:e(i(n)),c(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function u(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var d={},f=[],p=()=>{},m=()=>!1,h=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),g=e=>e.startsWith(`onUpdate:`),_=Object.assign,v=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},y=Object.prototype.hasOwnProperty,b=(e,t)=>y.call(e,t),x=Array.isArray,S=e=>j(e)===`[object Map]`,C=e=>j(e)===`[object Set]`,w=e=>j(e)===`[object Date]`,T=e=>typeof e==`function`,E=e=>typeof e==`string`,D=e=>typeof e==`symbol`,O=e=>typeof e==`object`&&!!e,k=e=>(O(e)||T(e))&&T(e.then)&&T(e.catch),A=Object.prototype.toString,j=e=>A.call(e),M=e=>j(e).slice(8,-1),N=e=>j(e)===`[object Object]`,P=e=>E(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,F=u(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),I=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},L=/-\w/g,R=I(e=>e.replace(L,e=>e.slice(1).toUpperCase())),z=/\B([A-Z])/g,ee=I(e=>e.replace(z,`-$1`).toLowerCase()),B=I(e=>e.charAt(0).toUpperCase()+e.slice(1)),te=I(e=>e?`on${B(e)}`:``),ne=(e,t)=>!Object.is(e,t),re=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},ie=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},ae=e=>{let t=parseFloat(e);return isNaN(t)?e:t},V,oe=()=>V||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function se(e){if(x(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=E(r)?le(r):se(r);if(i)for(let e in i)t[e]=i[e]}return t}if(E(e)||O(e))return e}var ce=/;(?![^(]*\))/g,H=/:([^]+)/,U=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function le(e){let t={};return e.replace(U,e=>e.startsWith(`/*`)?``:e).split(ce).forEach(e=>{if(e){let n=e.split(H);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function ue(e){let t=``;if(E(e))t=e;else if(x(e))for(let n=0;n<e.length;n++){let r=ue(e[n]);r&&(t+=r+` `)}else if(O(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var W=u(`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly`);function de(e){return!!e||e===``}function fe(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let i=0;r&&i<e.length;i++)r=ge(e[i],t[i],n);return r}function pe(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),i=new Uint8Array(r.length);for(let t of e){let e=-1;for(let a=0;a<r.length;a++)if(!i[a]&&ge(t,r[a],n)){e=a;break}if(e<0)return!1;i[e]=1}return!0}function me(e,t,n){let r=S(e),i=S(t);if(r||i||(r=C(e),i=C(t),r||i))return r&&i?pe(e,t,n):!1;if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){let i=e.hasOwnProperty(r),a=t.hasOwnProperty(r);if(i&&!a||!i&&a||!ge(e[r],t[r],n))return!1}return String(e)===String(t)}function he(e,t,n,r){n||=[new Map,new Map];let[i,a]=n;if(i.has(e)||a.has(t))return i.get(e)===t&&a.get(t)===e;i.set(e,t),a.set(t,e);let o=r(e,t,n);return i.delete(e),a.delete(t),o}function ge(e,t,n){if(e===t)return!0;let r=w(e),i=w(t);return r||i?r&&i?e.getTime()===t.getTime():!1:(r=D(e),i=D(t),r||i?e===t:(r=x(e),i=x(t),r||i?r&&i?he(e,t,n,fe):!1:(r=O(e),i=O(t),r||i?!r||!i?!1:he(e,t,n,me):String(e)===String(t))))}function _e(e,t){return e.findIndex(e=>ge(e,t))}var ve=e=>!!(e&&e.__v_isRef===!0),ye=e=>E(e)?e:e==null?``:x(e)||O(e)&&(e.toString===A||!T(e.toString))?ve(e)?ye(e.value):JSON.stringify(e,be,2):String(e),be=(e,t)=>ve(t)?be(e,t.value):S(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[xe(t,r)+` =>`]=n,e),{})}:C(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>xe(e))}:D(t)?xe(t):O(t)&&!x(t)&&!N(t)?String(t):t,xe=(e,t=``)=>D(e)?`Symbol(${e.description??t})`:e,Se,Ce=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&Se&&(Se.active?(this.parent=Se,this.index=(Se.scopes||(Se.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=Se;try{return Se=this,e()}finally{Se=t}}}on(){++this._on===1&&(this.prevScope=Se,Se=this)}off(){if(this._on>0&&--this._on===0){if(Se===this)Se=this.prevScope;else{let e=Se;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function we(){return Se}var Te,Ee=new WeakSet,De=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,Se&&(Se.active?Se.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,Ee.has(this)&&(Ee.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||je(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,We(this),Pe(this);let e=Te,t=Be;Te=this,Be=!0;try{return this.fn()}finally{Fe(this),Te=e,Be=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)Re(e);this.deps=this.depsTail=void 0,We(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?Ee.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Ie(this)&&this.run()}get dirty(){return Ie(this)}},Oe=0,ke,Ae;function je(e,t=!1){e.flags|=8,t?(e.next=Ae,Ae=e):(e.next=ke,ke=e)}function Me(){Oe++}function Ne(){if(--Oe>0)return;if(Ae){let e=Ae;for(Ae=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;ke;){let t=ke;for(ke=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Pe(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Fe(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),Re(r),ze(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Ie(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Le(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Le(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ge)||(e.globalVersion=Ge,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Ie(e))))return;e.flags|=2;let t=e.dep,n=Te,r=Be;Te=e,Be=!0;try{Pe(e);let n=e.fn(e._value);(t.version===0||ne(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{Te=n,Be=r,Fe(e),e.flags&=-3}}function Re(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)Re(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function ze(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Be=!0,Ve=[];function He(){Ve.push(Be),Be=!1}function Ue(){let e=Ve.pop();Be=e===void 0||e}function We(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=Te;Te=void 0;try{t()}finally{Te=e}}}var Ge=0,Ke=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},qe=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!Te||!Be||Te===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==Te)t=this.activeLink=new Ke(Te,this),Te.deps?(t.prevDep=Te.depsTail,Te.depsTail.nextDep=t,Te.depsTail=t):Te.deps=Te.depsTail=t,Je(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=Te.depsTail,t.nextDep=void 0,Te.depsTail.nextDep=t,Te.depsTail=t,Te.deps===t&&(Te.deps=e)}return t}trigger(e){this.version++,Ge++,this.notify(e)}notify(e){Me();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Ne()}}};function Je(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Je(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Ye=new WeakMap,Xe=Symbol(``),Ze=Symbol(``),Qe=Symbol(``);function $e(e,t,n){if(Be&&Te){let t=Ye.get(e);t||Ye.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new qe),r.map=t,r.key=n),r.track()}}function et(e,t,n,r,i,a){let o=Ye.get(e);if(!o){Ge++;return}let s=e=>{e&&e.trigger()};if(Me(),t===`clear`)o.forEach(s);else{let i=x(e),a=i&&P(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===Qe||!D(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get(Qe)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(Xe)),S(e)&&s(o.get(Ze)));break;case`delete`:i||(s(o.get(Xe)),S(e)&&s(o.get(Ze)));break;case`set`:S(e)&&s(o.get(Xe))}}Ne()}function tt(e){let t=Ut(e);return t===e||($e(t,`iterate`,Qe),Vt(e))?t:Bt(e)?zt(e)?t.map(e=>Kt(Gt(e))):t.map(Kt):t.map(Gt)}function nt(e){return $e(e=Ut(e),`iterate`,Qe),e}function rt(e,t){return Bt(e)?Kt(zt(e)?Gt(t):t):Gt(t)}var it={__proto__:null,[Symbol.iterator](){return at(this,Symbol.iterator,e=>rt(this,e))},concat(...e){return tt(this).concat(...e.map(e=>x(e)?tt(e):e))},entries(){return at(this,`entries`,e=>(e[1]=rt(this,e[1]),e))},every(e,t){return ct(this,`every`,e,t,void 0,arguments)},filter(e,t){return ct(this,`filter`,e,t,e=>e.map(e=>rt(this,e)),arguments)},find(e,t){return ct(this,`find`,e,t,e=>rt(this,e),arguments)},findIndex(e,t){return ct(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return ct(this,`findLast`,e,t,e=>rt(this,e),arguments)},findLastIndex(e,t){return ct(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return ct(this,`forEach`,e,t,void 0,arguments)},includes(...e){return ut(this,`includes`,e)},indexOf(...e){return ut(this,`indexOf`,e)},join(e){return tt(this).join(e)},lastIndexOf(...e){return ut(this,`lastIndexOf`,e)},map(e,t){return ct(this,`map`,e,t,void 0,arguments)},pop(){return dt(this,`pop`)},push(...e){return dt(this,`push`,e)},reduce(e,...t){return lt(this,`reduce`,e,t)},reduceRight(e,...t){return lt(this,`reduceRight`,e,t)},shift(){return dt(this,`shift`)},some(e,t){return ct(this,`some`,e,t,void 0,arguments)},splice(...e){return dt(this,`splice`,e)},toReversed(){return tt(this).toReversed()},toSorted(e){return tt(this).toSorted(e)},toSpliced(...e){return tt(this).toSpliced(...e)},unshift(...e){return dt(this,`unshift`,e)},values(){return at(this,`values`,e=>rt(this,e))}};function at(e,t,n){let r=nt(e),i=r[t],a=i.call(r);if(r!==e&&!Vt(e)){if(a[Symbol.toStringTag]===`Array Iterator`){let e=Object.create(Object.getPrototypeOf(a));return e.next=()=>ot(a.next(),n),i!==st[t]&&Object.defineProperties(e,{return:{get(){let e=a.return;return typeof e==`function`?e.bind(a):e}},throw:{get(){let e=a.throw;return typeof e==`function`?e.bind(a):e}}}),e}a._next=a.next,a.next=()=>ot(a._next(),n)}return a}function ot(e,t){return e.done||(e.value=t(e.value)),e}var st=Array.prototype;function ct(e,t,n,r,i,a){let o=nt(e),s=o!==e&&!Vt(e),c=o[t];if(c!==st[t]){let t=c.apply(e,a);return s?Gt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,rt(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function lt(e,t,n,r){let i=nt(e),a=i!==e&&!Vt(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=rt(e,t)),n.call(this,t,rt(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?rt(e,c):c}function ut(e,t,n){let r=Ut(e);$e(r,`iterate`,Qe);let i=r[t](...n);return(i===-1||i===!1)&&Ht(n[0])?(n[0]=Ut(n[0]),r[t](...n)):i}function dt(e,t,n=[]){He(),Me();let r=Ut(e)[t].apply(e,n);return Ne(),Ue(),r}var ft=u(`__proto__,__v_isRef,__isVue`),pt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(D));function mt(e){D(e)||(e=String(e));let t=Ut(this);return $e(t,`has`,e),t.hasOwnProperty(e)}var ht=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Nt:Mt:i?jt:At).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=x(e);if(!r){let e;if(a&&(e=it[t]))return e;if(t===`hasOwnProperty`)return mt}let o=Reflect.get(e,t,qt(e)?e:n);if((D(t)?pt.has(t):ft(t))||(r||$e(e,`get`,t),i))return o;if(qt(o)){let e=a&&P(t)?o:o.value;return r&&O(e)?Lt(e):e}return O(o)?r?Lt(o):Ft(o):o}},gt=class extends ht{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=x(e)&&P(t);if(!this._isShallow){let e=Bt(i);if(!Vt(n)&&!Bt(n)&&(i=Ut(i),n=Ut(n)),!a&&qt(i)&&!qt(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:b(e,t),s=Reflect.set(e,t,n,qt(e)?e:r);return e===Ut(r)&&s&&(o?ne(n,i)&&et(e,`set`,t,n,i):et(e,`add`,t,n)),s}deleteProperty(e,t){let n=b(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&et(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!D(t)||!pt.has(t))&&$e(e,`has`,t),n}ownKeys(e){return $e(e,`iterate`,x(e)?`length`:Xe),Reflect.ownKeys(e)}},_t=class extends ht{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},vt=new gt,yt=new _t,bt=new gt(!0),xt=e=>e,St=e=>Reflect.getPrototypeOf(e);function Ct(e,t,n){return function(...r){let i=this.__v_raw,a=Ut(i),o=S(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?xt:t?Kt:Gt;return!t&&$e(a,`iterate`,c?Ze:Xe),_(Object.create(l),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}}})}}function wt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Tt(e,t){let n={get(n){let r=this.__v_raw,i=Ut(r),a=Ut(n);e||(ne(n,a)&&$e(i,`get`,n),$e(i,`get`,a));let{has:o}=St(i),s=t?xt:e?Kt:Gt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&$e(Ut(t),`iterate`,Xe),t.size},has(t){let n=this.__v_raw,r=Ut(n),i=Ut(t);return e||(ne(t,i)&&$e(r,`has`,t),$e(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=Ut(a),s=t?xt:e?Kt:Gt;return!e&&$e(o,`iterate`,Xe),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return _(n,e?{add:wt(`add`),set:wt(`set`),delete:wt(`delete`),clear:wt(`clear`)}:{add(e){let n=Ut(this),r=St(n),i=Ut(e),a=!t&&!Vt(e)&&!Bt(e)?i:e;return r.has.call(n,a)||ne(e,a)&&r.has.call(n,e)||ne(i,a)&&r.has.call(n,i)||(n.add(a),et(n,`add`,a,a)),this},set(e,n){!t&&!Vt(n)&&!Bt(n)&&(n=Ut(n));let r=Ut(this),{has:i,get:a}=St(r),o=i.call(r,e);o||=(e=Ut(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?ne(n,s)&&et(r,`set`,e,n,s):et(r,`add`,e,n),this},delete(e){let t=Ut(this),{has:n,get:r}=St(t),i=n.call(t,e);i||=(e=Ut(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&et(t,`delete`,e,void 0,a),o},clear(){let e=Ut(this),t=e.size!==0,n=e.clear();return t&&et(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=Ct(r,e,t)}),n}function Et(e,t){let n=Tt(e,t);return(r,i,a)=>i===`__v_isReactive`?!e:i===`__v_isReadonly`?e:i===`__v_isShallow`?t:i===`__v_raw`?r:Reflect.get(b(n,i)&&i in r?n:r,i,a)}var Dt={get:Et(!1,!1)},Ot={get:Et(!1,!0)},kt={get:Et(!0,!1)},At=new WeakMap,jt=new WeakMap,Mt=new WeakMap,Nt=new WeakMap;function Pt(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function Ft(e){return Bt(e)?e:Rt(e,!1,vt,Dt,At)}function It(e){return Rt(e,!1,bt,Ot,jt)}function Lt(e){return Rt(e,!0,yt,kt,Mt)}function Rt(e,t,n,r,i){if(!O(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=Pt(M(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function zt(e){return Bt(e)?zt(e.__v_raw):!!(e&&e.__v_isReactive)}function Bt(e){return!!(e&&e.__v_isReadonly)}function Vt(e){return!!(e&&e.__v_isShallow)}function Ht(e){return e?!!e.__v_raw:!1}function Ut(e){let t=e&&e.__v_raw;return t?Ut(t):e}function Wt(e){return!b(e,`__v_skip`)&&Object.isExtensible(e)&&ie(e,`__v_skip`,!0),e}var Gt=e=>O(e)?Ft(e):e,Kt=e=>O(e)?Lt(e):e;function qt(e){return e?e.__v_isRef===!0:!1}function Jt(e){return qt(e)?e.value:e}var Yt={get:(e,t,n)=>t===`__v_raw`?e:Jt(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return qt(i)&&!qt(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Xt(e){return zt(e)?e:new Proxy(e,Yt)}var Zt=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new qe(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ge-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&Te!==this)return je(this,!0),!0}get value(){let e=this.dep.track();return Le(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function Qt(e,t,n=!1){let r,i;return T(e)?r=e:(r=e.get,i=e.set),new Zt(r,i,n)}var $t={},G=new WeakMap,en=void 0;function tn(e,t=!1,n=en){if(n){let t=G.get(n);t||G.set(n,t=[]),t.push(e)}}function nn(e,t,n=d){let{immediate:r,deep:i,once:a,scheduler:o,augmentJob:s,call:c}=n,l=e=>i?e:Vt(e)||i===!1||i===0?rn(e,1):rn(e),u,f,m,h,g=!1,_=!1;if(qt(e)?(f=()=>e.value,g=Vt(e)):zt(e)?(f=()=>l(e),g=!0):x(e)?(_=!0,g=e.some(e=>zt(e)||Vt(e)),f=()=>e.map(e=>{if(qt(e))return e.value;if(zt(e))return l(e);if(T(e))return c?c(e,2):e()})):f=T(e)?t?c?()=>c(e,2):e:()=>{if(m){He();try{m()}finally{Ue()}}let t=en;en=u;try{return c?c(e,3,[h]):e(h)}finally{en=t}}:p,t&&i){let e=f,t=i===!0?1/0:i;f=()=>rn(e(),t)}let y=we(),b=()=>{u.stop(),y&&y.active&&v(y.effects,u)};if(a&&t){let e=t;t=(...t)=>{try{return e(...t)}finally{b()}}}let S=_?Array(e.length).fill($t):$t,C=e=>{if(u.flags&1&&(u.dirty||e)){if(t){let n=u.run();if(e||i||g||(_?n.some((e,t)=>ne(e,S[t])):ne(n,S))){let e=en;He();try{m&&m(),en=u;let e=[n,S===$t?void 0:_&&S[0]===$t?[]:S,h];S=n,c?c(t,3,e):t(...e)}finally{en=e,Ue()}}}else u.run()}};return s&&s(C),u=new De(f),u.scheduler=o?()=>o(C,!1):C,h=e=>tn(e,!1,u),m=u.onStop=()=>{let e=G.get(u);if(e){if(c)c(e,4);else for(let t of e)t();G.delete(u)}},t?r?C(!0):S=u.run():o?o(C.bind(null,!0),!0):u.run(),b.pause=u.pause.bind(u),b.resume=u.resume.bind(u),b.stop=b,b}function rn(e,t=1/0,n){if(t<=0||!O(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,qt(e))rn(e.value,t,n);else if(x(e))for(let r=0;r<e.length;r++)rn(e[r],t,n);else if(C(e)||S(e))e.forEach(e=>{rn(e,t,n)});else if(N(e)){for(let r in e)rn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&rn(e[r],t,n)}return e}function K(e,t,n,r){try{return r?e(...r):e()}catch(e){on(e,t,n)}}function an(e,t,n,r){if(T(e)){let i=K(e,t,n,r);return i&&k(i)&&i.catch(e=>{on(e,t,n)}),i}if(x(e)){let i=[];for(let a=0;a<e.length;a++)i.push(an(e[a],t,n,r));return i}}function on(e,t,n,r=!0){let i=t?t.vnode:null,{errorHandler:a,throwUnhandledErrorInProduction:o}=t&&t.appContext.config||d;if(t){let r=t.parent,i=t.proxy,o=`https://vuejs.org/error-reference/#runtime-${n}`;for(;r;){let t=r.ec;if(t){for(let n=0;n<t.length;n++)if(t[n](e,i,o)===!1)return}r=r.parent}if(a){He(),K(a,null,10,[e,i,o]),Ue();return}}sn(e,n,i,r,o)}function sn(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var cn=[],ln=-1,un=[],dn=null,fn=0,pn=Promise.resolve(),q=null;function mn(e){let t=q||pn;return e?t.then(this?e.bind(this):e):t}function hn(e){let t=ln+1,n=cn.length;for(;t<n;){let r=t+n>>>1,i=cn[r],a=Cn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function gn(e){if(!(e.flags&1)){let t=Cn(e),n=cn[cn.length-1];!n||!(e.flags&2)&&t>=Cn(n)?cn.push(e):cn.splice(hn(t),0,e),e.flags|=1,_n()}}function _n(){q||=pn.then(wn)}function vn(e){if(!x(e))dn&&e.id===-1?dn.splice(fn+1,0,e):e.flags&1||(un.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)un.push(e[t]);_n()}function yn(e,t,n,r=ln+1){for(;r<cn.length;r++){let n=cn[r];if(n&&n.flags&2){if(e&&n.id!==e.uid||t!==void 0&&!(n.id>=t))continue;cn.splice(r,1),r=e?r-1:ln,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function bn(e,t,n=0){if(un.length){let e=un,r=0;if(t){e=[];for(let i=0;i<un.length;i++){let a=un[i];(a.i===void 0?t.has(a):!a.i||a.i.uid<n)?un[r++]=a:e.push(a)}}let i=[...new Set(e)].sort((e,t)=>Cn(e)-Cn(t));if(un.length=r,dn){for(let e=0;e<i.length;e++)dn.push(i[e]);return}for(dn=i,fn=0;fn<dn.length;fn++){let e=dn[fn];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}dn=null,fn=0}}var xn=!1;function Sn(e,t){if(xn){e();return}let n=t===void 0?void 0:new Set(un);e(),xn=!0;try{yn(void 0,t),bn(void 0,n,t)}finally{xn=!1}}var Cn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function wn(e){try{for(ln=0;ln<cn.length;ln++){let e=cn[ln];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),K(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;ln<cn.length;ln++){let e=cn[ln];e&&(e.flags&=-2)}ln=-1,cn.length=0,bn(e),q=null,(cn.length||un.length)&&wn(e)}}var Tn=null,En=null;function Dn(e){let t=Tn;return Tn=e,En=e&&e.type.__scopeId||null,t}function On(e,t=Tn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Ki(-1);let i=Dn(t),a=Vi.length,o;try{o=e(...n)}finally{for(let e=Vi.length;e>a;e--)Wi();Dn(i),r._d&&Ki(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function kn(e,t){if(Tn===null)return e;let n=ka(Tn),r=e.dirs||=[];for(let e=0;e<t.length;e++){let[i,a,o,s=d]=t[e];i&&(T(i)&&(i={mounted:i,updated:i}),i.deep&&rn(a),r.push({dir:i,instance:n,value:a,oldValue:void 0,arg:o,modifiers:s}))}return e}function An(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(He(),an(c,n,8,[e.el,s,e,t]),Ue())}}function jn(e,t){if(ha){let n=ha.provides,r=ha.parent&&ha.parent.provides;r===n&&(n=ha.provides=Object.create(r)),n[e]=t}}function Mn(e,t,n=!1){let r=ga();if(r||Kr){let i=Kr?Kr._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&T(t)?t.call(r&&r.proxy):t}}var Nn=Symbol.for(`v-scx`),Pn=()=>Mn(Nn);function Fn(e,t,n){return In(e,t,n)}function In(e,t,n=d){let{immediate:r,deep:i,flush:a,once:o}=n,s=_({},n),c=t&&r||!t&&a!==`post`,l;if(Sa){if(a===`sync`){let e=Pn();l=e.__watcherHandles||=[]}else if(!c){let e=()=>{};return e.stop=p,e.resume=p,e.pause=p,e}}let u=ha;s.call=(e,t,n)=>an(e,u,t,n);let f=!1;a===`post`?s.scheduler=e=>{e.i=u,wi(e,u&&u.suspense)}:a!==`sync`&&(f=!0,s.scheduler=(e,t)=>{t?e():gn(e)}),s.augmentJob=e=>{t&&(e.flags|=4),f&&(e.flags|=2,u&&(e.id=u.uid,e.i=u))};let m=nn(e,t,s);return Sa&&(l?l.push(m):c&&m()),m}function Ln(e,t,n){let r=this.proxy,i=E(e)?e.includes(`.`)?Rn(r,e):()=>r[e]:e.bind(r,r),a;T(t)?a=t:(a=t.handler,n=t);let o=ya(this),s=In(i,a.bind(r),n);return o(),s}function Rn(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var zn=Symbol(`_vte`),Bn=e=>e.__isTeleport,Vn=Symbol(`_leaveCb`);function Hn(e){let t=e[0];if(e.length>1){for(let n of e)if(n.type!==zi){t=n;break}}return t}function Un(e){if(!Qn(e))return Bn(e.type)&&e.children?Hn(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&T(n.default))return n.default()}}function Wn(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Wn(Bn(n.type)&&Un(n)||n,t)}else if(e.shapeFlag&128)e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback);else if(e.transition=t,e.type===Li&&x(e.children)){let n=$r(e.children,!1);n&&Wn(n,t)}}function Gn(e){if(e.component)return Gn(e.component.subTree);if(e.type===Li){let t=x(e.children)&&$r(e.children,!1);return t?Gn(t):void 0}if(e.type!==zi)return e}function Kn(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function qn(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var Jn=new WeakMap;function Yn(e,t,n,r,i=!1){if(x(e)){e.forEach((e,a)=>Yn(e,t&&(x(t)?t[a]:t),n,r,i));return}if(Zn(r)&&!i){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&Yn(e,t,n,r.component.subTree);return}let a=r.shapeFlag&4?ka(r.component):r.el,o=i?null:a,{i:s,r:c}=e,l=t&&t.r,u=s.refs===d?s.refs={}:s.refs,f=s.setupState,p=Ut(f),h=f===d?m:e=>!qn(u,e)&&b(p,e),g=(e,t)=>!(t&&qn(u,t));if(l!=null&&l!==c){if(Xn(t),E(l))u[l]=null,h(l)&&(f[l]=null);else if(qt(l)){let e=t;g(l,e.k)&&(l.value=null),e.k&&(u[e.k]=null)}}if(T(c))K(c,s,12,[o,u]);else{let t=E(c),r=qt(c);if(t||r){let s=()=>{if(e.f){let n=t?h(c)?f[c]:u[c]:g(c)||!e.k?c.value:u[e.k];if(i)x(n)&&v(n,a);else if(x(n))n.includes(a)||n.push(a);else if(t)u[c]=[a],h(c)&&(f[c]=u[c]);else{let t=[a];g(c,e.k)&&(c.value=t),e.k&&(u[e.k]=t)}}else t?(u[c]=o,h(c)&&(f[c]=o)):r&&(g(c,e.k)&&(c.value=o),e.k&&(u[e.k]=o))};if(o){let t=()=>{s(),Jn.delete(e)};t.id=-1,Jn.set(e,t),wi(t,n)}else Xn(e),s()}}}function Xn(e){let t=Jn.get(e);t&&(t.flags|=8,Jn.delete(e))}oe().requestIdleCallback,oe().cancelIdleCallback;var Zn=e=>!!e.type.__asyncLoader,Qn=e=>e.type.__isKeepAlive;function $n(e,t){tr(e,`a`,t)}function er(e,t){tr(e,`da`,t)}function tr(e,t,n=ha){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(rr(t,r,n),n){let e=n.parent;for(;e&&e.parent;)Qn(e.parent.vnode)&&nr(r,t,n,e),e=e.parent}}function nr(e,t,n,r){let i=rr(t,e,r,!0);ur(()=>{v(r[t],i)},n)}function rr(e,t,n=ha,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{He();let i=ya(n),a=an(t,n,e,r);return i(),Ue(),a};return r?i.unshift(a):i.push(a),a}}var ir=e=>(t,n=ha)=>{(!Sa||e===`sp`)&&rr(e,(...e)=>t(...e),n)},ar=ir(`bm`),or=ir(`m`),sr=ir(`bu`),cr=ir(`u`),lr=ir(`bum`),ur=ir(`um`),dr=ir(`sp`),fr=ir(`rtg`),pr=ir(`rtc`);function mr(e,t=ha){rr(`ec`,e,t)}var hr=`components`;function gr(e,t){return vr(hr,e,!0,t)||e}var _r=Symbol.for(`v-ndc`);function vr(e,t,n=!0,r=!1){let i=Tn||ha;if(i){let n=i.type;if(e===hr){let e=Aa(n,!1);if(e&&(e===t||e===R(t)||e===B(R(t))))return n}let a=yr(i[e]||n[e],t)||yr(i.appContext[e],t);return!a&&r?n:a}}function yr(e,t){return e&&(e[t]||e[R(t)]||e[B(R(t))])}function br(e,t,n,r){let i,a=n&&n[r],o=x(e);if(o||E(e)){let n=o&&zt(e),r=!1,s=!1;n&&(r=!Vt(e),s=Bt(e),e=nt(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Kt(Gt(e[n])):Gt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){if(!Number.isInteger(e)||e<0)i=[];else{i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}}else if(O(e)){if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}}else i=[];return n&&(n[r]=i),i}function xr(e,t,n,r,i,a){if(n??={},Tn.ce||Tn.parent&&Zn(Tn.parent)&&Tn.parent.ce){let e=a!=null&&n.key==null?_({},n,{key:a}):n,i=Object.keys(e).length>0;return t!=="default"&&(e.name=t),Ui(),Yi(Li,null,[ea(`slot`,e,r&&r())],i?-2:64)}let o=e[t];o&&o._c&&(o._d=!1);let s=Vi.length;Ui();let c;try{let i=o&&Sr(o(n)),s=n.key||a||i&&i.key;c=Yi(Li,{key:(s&&!D(s)?s:`_${t}`)+(!i&&r?`_fb`:``)},i||(r?r():[]),i&&e._===1?64:-2)}catch(e){for(let e=Vi.length;e>s;e--)Wi();throw e}finally{o&&o._c&&(o._d=!0)}return!i&&c.scopeId&&(c.slotScopeIds=[c.scopeId+`-s`]),c}function Sr(e){return e.some(e=>!Xi(e)||!(e.type===zi||e.type===Li&&!Sr(e.children)))?e:null}var Cr=e=>e?xa(e)?ka(e):Cr(e.parent):null,wr=_(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>Cr(e.parent),$root:e=>Cr(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Nr(e),$forceUpdate:e=>e.f||=()=>{gn(e.update)},$nextTick:e=>e.n||=mn.bind(e.proxy),$watch:e=>Ln.bind(e)}),Tr=(e,t)=>e!==d&&!e.__isScriptSetup&&b(e,t),Er={get({_:e},t){if(t===`__v_skip`)return!0;let{ctx:n,setupState:r,data:i,props:a,accessCache:o,type:s,appContext:c}=e;if(t[0]!==`$`){let e=o[t];if(e!==void 0)switch(e){case 1:return r[t];case 2:return i[t];case 4:return n[t];case 3:return a[t]}else if(Tr(r,t))return o[t]=1,r[t];else if(i!==d&&b(i,t))return o[t]=2,i[t];else if(b(a,t))return o[t]=3,a[t];else if(n!==d&&b(n,t))return o[t]=4,n[t];else Or&&(o[t]=0)}let l=wr[t],u,f;if(l)return t===`$attrs`&&$e(e.attrs,`get`,``),l(e);if((u=s.__cssModules)&&(u=u[t]))return u;if(n!==d&&b(n,t))return o[t]=4,n[t];if(f=c.config.globalProperties,b(f,t))return f[t]},set({_:e},t,n){let{data:r,setupState:i,ctx:a}=e;return Tr(i,t)?(i[t]=n,!0):r!==d&&b(r,t)?(r[t]=n,!0):b(e.props,t)||t[0]===`$`&&t.slice(1)in e?!1:(a[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:i,props:a,type:o}},s){let c;return!!(n[s]||e!==d&&s[0]!==`$`&&b(e,s)||Tr(t,s)||b(a,s)||b(r,s)||b(wr,s)||b(i.config.globalProperties,s)||(c=o.__cssModules)&&c[s])},defineProperty(e,t,n){return n.get==null?b(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function Dr(e){return x(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Or=!0;function kr(e){let t=Nr(e),n=e.proxy,r=e.ctx;Or=!1,t.beforeCreate&&jr(t.beforeCreate,e,`bc`);let{data:i,computed:a,methods:o,watch:s,provide:c,inject:l,created:u,beforeMount:d,mounted:f,beforeUpdate:m,updated:h,activated:g,deactivated:_,beforeDestroy:v,beforeUnmount:y,destroyed:b,unmounted:S,render:C,renderTracked:w,renderTriggered:E,errorCaptured:D,serverPrefetch:k,expose:A,inheritAttrs:j,components:M,directives:N,filters:P}=t;if(l&&Ar(l,r,null),o)for(let e in o){let t=o[e];T(t)&&(r[e]=t.bind(n))}if(i){let t=i.call(n,n);O(t)&&(e.data=Ft(t))}if(Or=!0,a)for(let e in a){let t=a[e],i=Ma({get:T(t)?t.bind(n,n):T(t.get)?t.get.bind(n,n):p,set:!T(t)&&T(t.set)?t.set.bind(n):p});Object.defineProperty(r,e,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e})}if(s)for(let e in s)Mr(s[e],r,n,e);if(c){let e=T(c)?c.call(n):c;Reflect.ownKeys(e).forEach(t=>{jn(t,e[t])})}u&&jr(u,e,`c`);function F(e,t){x(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(F(ar,d),F(or,f),F(sr,m),F(cr,h),F($n,g),F(er,_),F(mr,D),F(pr,w),F(fr,E),F(lr,y),F(ur,S),F(dr,k),x(A)){if(A.length){let t=e.exposed||={};A.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={}}C&&e.render===p&&(e.render=C),j!=null&&(e.inheritAttrs=j),M&&(e.components=M),N&&(e.directives=N),k&&Kn(e)}function Ar(e,t,n=p){x(e)&&(e=Rr(e));for(let n in e){let r=e[n],i;i=O(r)?`default`in r?Mn(r.from||n,r.default,!0):Mn(r.from||n):Mn(r),qt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function jr(e,t,n){an(x(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function Mr(e,t,n,r){let i=r.includes(`.`)?Rn(n,r):()=>n[r];if(E(e)){let n=t[e];T(n)&&Fn(i,n)}else if(T(e))Fn(i,e.bind(n));else if(O(e)){if(x(e))e.forEach(e=>Mr(e,t,n,r));else{let r=T(e.handler)?e.handler.bind(n):t[e.handler];T(r)&&Fn(i,r,e)}}}function Nr(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>Pr(c,e,o,!0)),Pr(c,t,o)),O(t)&&a.set(t,c),c}function Pr(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&Pr(e,a,n,!0),i&&i.forEach(t=>Pr(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Fr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Fr={data:Ir,props:Vr,emits:Vr,methods:Br,computed:Br,beforeCreate:zr,created:zr,beforeMount:zr,mounted:zr,beforeUpdate:zr,updated:zr,beforeDestroy:zr,beforeUnmount:zr,destroyed:zr,unmounted:zr,activated:zr,deactivated:zr,errorCaptured:zr,serverPrefetch:zr,components:Br,directives:Br,watch:Hr,provide:Ir,inject:Lr};function Ir(e,t){return t?e?function(){return _(T(e)?e.call(this,this):e,T(t)?t.call(this,this):t)}:t:e}function Lr(e,t){return Br(Rr(e),Rr(t))}function Rr(e){if(x(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function zr(e,t){return e?[...new Set([].concat(e,t))]:t}function Br(e,t){return e?_(Object.create(null),e,t):t}function Vr(e,t){return e?x(e)&&x(t)?[...new Set([...e,...t])]:_(Object.create(null),Dr(e),Dr(t??{})):t}function Hr(e,t){if(!e)return t;if(!t)return e;let n=_(Object.create(null),e);for(let r in t)n[r]=zr(e[r],t[r]);return n}function Ur(){return{app:null,config:{isNativeTag:m,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Wr=0;function Gr(e,t){return function(n,r=null){T(n)||(n=_({},n)),r!=null&&!O(r)&&(r=null);let i=Ur(),a=new WeakSet,o=[],s=!1,c=i.app={_uid:Wr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Na,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&T(e.install)?(a.add(e),e.install(c,...t)):T(e)&&(a.add(e),e(c,...t))),c},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),c},component(e,t){return t?(i.components[e]=t,c):i.components[e]},directive(e,t){return t?(i.directives[e]=t,c):i.directives[e]},mount(a,o,l){if(!s){let u=c._ceVNode||ea(n,r);return u.appContext=i,l===!0?l=`svg`:l===!1&&(l=void 0),o&&t?t(u,a):e(u,a,l),s=!0,c._container=a,a.__vue_app__=c,ka(u.component)}},onUnmount(e){o.push(e)},unmount(){s&&(an(o,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(e,t){return i.provides[e]=t,c},runWithContext(e){let t=Kr;Kr=c;try{return e()}finally{Kr=t}}};return c}}var Kr=null,qr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${R(t)}Modifiers`]||e[`${ee(t)}Modifiers`];function Jr(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||d,i=n,a=t.startsWith(`update:`),o=a&&qr(r,t.slice(7));o&&(o.trim&&(i=n.map(e=>E(e)?e.trim():e)),o.number&&(i=i.map(ae)));let s,c=r[s=te(t)]||r[s=te(R(t))];!c&&a&&(c=r[s=te(ee(t))]),c&&an(c,e,6,i);let l=r[s+`Once`];if(l){if(!e.emitted)e.emitted={};else if(e.emitted[s])return;e.emitted[s]=!0,an(l,e,6,i)}}var Yr=new WeakMap;function Xr(e,t,n=!1){let r=n?Yr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},s=!1;if(!T(e)){let r=e=>{let n=Xr(e,t,!0);n&&(s=!0,_(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!s?(O(e)&&r.set(e,null),null):(x(a)?a.forEach(e=>o[e]=null):_(o,a),O(e)&&r.set(e,o),o)}function Zr(e,t){return!e||!h(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),b(e,t[0].toLowerCase()+t.slice(1))||b(e,ee(t))||b(e,t))}function Qr(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:o,attrs:s,emit:c,render:l,renderCache:u,props:d,data:f,setupState:p,ctx:m,inheritAttrs:h}=e,_=Dn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=oa(l.call(t,e,u,d,p,f,m)),y=s}else{let e=t;v=oa(e.length>1?e(d,{attrs:s,slots:o,emit:c}):e(d,null)),y=t.props?s:ei(s)}}catch(t){Vi.length=0,on(t,e,1),v=ea(zi)}let b=v;if(y&&h!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(g)&&(y=ti(y,a)),b=ra(b,y,!1,!0))}return n.dirs&&(b=ra(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Wn(Bn(b.type)&&Un(b)||b,n.transition),v=b,Dn(_),v}function $r(e,t=!0){let n;for(let t=0;t<e.length;t++){let r=e[t];if(Xi(r)){if(r.type!==zi||r.children===`v-if`){if(n)return;n=r}}else return}return n}var ei=e=>{let t;for(let n in e)(n===`class`||n===`style`||h(n))&&((t||={})[n]=e[n]);return t},ti=(e,t)=>{let n={};for(let r in e)(!g(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function ni(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ri(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(ii(o,r,n)&&!Zr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||ri(r,o,l):!!o;return!1}function ri(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(!b(e,a)||ii(t,e,a)&&!Zr(n,a))return!0}return!1}function ii(e,t,n){let r=e[n],i=t[n];return n===`style`&&O(r)&&O(i)?!ge(r,i):r!==i}function ai({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var oi={},si=()=>Object.create(oi),ci=e=>Object.getPrototypeOf(e)===oi;function li(e,t,n,r=!1){let i={},a=si();e.propsDefaults=Object.create(null),di(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);e.props=n?r?i:It(i):e.type.props?i:a,e.attrs=a}function ui(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=Ut(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Zr(e.emitsOptions,o))continue;let u=t[o];if(c){if(b(a,o))u!==a[o]&&(a[o]=u,l=!0);else{let t=R(o);i[t]=fi(c,s,t,u,e,!1)}}else u!==a[o]&&(a[o]=u,l=!0)}}}else{di(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!b(t,a)&&((r=ee(a))===a||!b(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=fi(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!b(t,e))&&(delete a[e],l=!0)}l&&et(e.attrs,`set`,``)}function di(e,t,n,r){let[i,a]=e.propsOptions,o=!1,s;if(t)for(let c in t){if(F(c))continue;let l=t[c],u;i&&b(i,u=R(c))?!a||!a.includes(u)?n[u]=l:(s||={})[u]=l:Zr(e.emitsOptions,c)||(!(c in r)||l!==r[c])&&(r[c]=l,o=!0)}if(a){let t=Ut(n),r=s||d;for(let o=0;o<a.length;o++){let s=a[o];n[s]=fi(i,t,s,r[s],e,!b(r,s))}}return o}function fi(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=b(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&T(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=ya(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===ee(n))&&(r=!0))}return r}var pi=new WeakMap;function mi(e,t,n=!1){let r=n?pi:t.propsCache,i=r.get(e);if(i)return i;let a=e.props,o={},s=[],c=!1;if(!T(e)){let r=e=>{c=!0;let[n,r]=mi(e,t,!0);_(o,n),r&&s.push(...r)};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!a&&!c)return O(e)&&r.set(e,f),f;if(x(a))for(let e=0;e<a.length;e++){let t=R(a[e]);hi(t)&&(o[t]=d)}else if(a)for(let e in a){let t=R(e);if(hi(t)){let n=a[e],r=o[t]=x(n)||T(n)?{type:n}:_({},n),i=r.type,c=!1,l=!0;if(x(i))for(let e=0;e<i.length;++e){let t=i[e],n=T(t)&&t.name;if(n===`Boolean`){c=!0;break}n===`String`&&(l=!1)}else c=T(i)&&i.name===`Boolean`;r[0]=c,r[1]=l,(c||b(r,`default`))&&s.push(t)}}let l=[o,s];return O(e)&&r.set(e,l),l}function hi(e){return e[0]!==`$`&&!F(e)}var gi=e=>e===`_`||e===`_ctx`||e===`$stable`,_i=e=>x(e)?e.map(oa):[oa(e)],vi=(e,t,n)=>{if(t._n)return t;let r=On((...e)=>_i(t(...e)),n);return r._c=!1,r},yi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(gi(n))continue;let i=e[n];if(T(i))t[n]=vi(n,i,r);else if(i!=null){let e=_i(i);t[n]=()=>e}}},bi=(e,t)=>{let n=_i(t);e.slots.default=()=>n},xi=(e,t,n)=>{for(let r in t)(n||!gi(r))&&(e[r]=t[r])},Si=(e,t,n)=>{let r=e.slots=si();if(e.vnode.shapeFlag&32){let e=t._;e?(xi(r,t,n),n&&ie(r,`_`,e,!0)):yi(t,r)}else t&&bi(e,t)},Ci=(e,t,n)=>{let{vnode:r,slots:i}=e,a=!0,o=d;if(r.shapeFlag&32){let e=t._;e?n&&e===1?a=!1:xi(i,t,n):(a=!t.$stable,yi(t,i)),o=t}else t&&(bi(e,t),o={default:1});if(a)for(let e in i)!gi(e)&&o[e]==null&&delete i[e]},wi=Ii;function Ti(e){return Ei(e)}function Ei(e,t){let n=oe();n.__VUE__=!0;let{insert:r,remove:i,patchProp:a,createElement:o,createText:s,createComment:c,setText:l,setElementText:u,parentNode:m,nextSibling:h,setScopeId:g=p,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Zi(e,t)&&(r=se(e),te(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null),t.dynamicChildren&&e&&e.dynamicChildren&&e.dynamicChildren.hasOnce&&(t.dynamicChildren===f&&(t.dynamicChildren=[]),t.dynamicChildren.hasOnce=!0);let{type:l,ref:u,shapeFlag:d}=t;switch(l){case Ri:y(e,t,n,r);break;case zi:b(e,t,n,r);break;case Bi:e??x(t,n,r,o);break;case Li:j(e,t,n,r,i,a,o,s,c);break;default:d&1?w(e,t,n,r,i,a,o,s,c):d&6?M(e,t,n,r,i,a,o,s,c):(d&64||d&128)&&l.process(e,t,n,r,i,a,o,s,c,H)}u!=null&&i?Yn(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&Yn(e.ref,null,a,e,!0)},y=(e,t,n,i)=>{if(e==null)r(t.el=s(t.children),n,i);else{let n=t.el=e.el;t.children!==e.children&&l(n,t.children)}},b=(e,t,n,i)=>{e==null?r(t.el=c(t.children||``),n,i):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},S=({el:e,anchor:t},n,i)=>{let a;for(;e&&e!==t;)a=h(e),r(e,n,i),e=a;r(t,n,i)},C=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),i(e),e=n;i(t)},w=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)T(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),O(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},T=(e,t,n,i,s,c,l,d)=>{let f,p,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(f=e.el=o(e.type,c,m&&m.is,m),h&8?u(f,e.children):h&16&&D(e.children,f,null,i,s,Di(e,c),l,d),_&&An(e,null,i,`created`),E(f,e,e.scopeId,l,i),m){for(let e in m)e!==`value`&&!F(e)&&a(f,e,null,m[e],c,i);`value`in m&&a(f,`value`,null,m.value,c),(p=m.onVnodeBeforeMount)&&ua(p,i,e)}_&&An(e,null,i,`beforeMount`);let v=ki(s,g);v&&g.beforeEnter(f),r(f,t,n),((p=m&&m.onVnodeMounted)||v||_)&&wi(()=>{try{p&&ua(p,i,e),v&&g.enter(f),_&&An(e,null,i,`mounted`)}finally{}},s)},E=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Fi(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;E(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},D=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?sa(e[l]):oa(e[l]);v(null,c,t,n,r,i,a,o,s)}},O=(e,t,n,r,i,o,s)=>{let c=t.el=e.el,{patchFlag:l,dynamicChildren:f,dirs:p}=t;l|=e.patchFlag&16;let m=e.props||d,h=t.props||d,g;if(n&&Oi(n,!1),(g=h.onVnodeBeforeUpdate)&&ua(g,n,t,e),p&&An(t,e,n,`beforeUpdate`),n&&Oi(n,!0),f&&(!e.dynamicChildren||e.dynamicChildren.length!==f.length)&&(l=0,s=!1,f=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&u(c,``),f?k(e.dynamicChildren,f,c,n,r,Di(t,i),o):s||R(e,t,c,null,n,r,Di(t,i),o,!1),l>0){if(l&16)A(c,m,h,n,i);else if(l&2&&m.class!==h.class&&a(c,`class`,null,h.class,i),l&4&&a(c,`style`,m.style,h.style,i),l&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let r=e[t],o=m[r],s=h[r];(s!==o||r===`value`)&&a(c,r,o,s,i,n)}}l&1&&e.children!==t.children&&u(c,t.children)}else!s&&f==null&&A(c,m,h,n,i);((g=h.onVnodeUpdated)||p)&&wi(()=>{g&&ua(g,n,t,e),p&&An(t,e,n,`updated`)},r)},k=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el||Pi(c),d=u&&(c.type===Li||!Zi(c,l)||c.shapeFlag&198)?m(u):n;v(c,l,d,null,r,i,a,o,!0)}},A=(e,t,n,r,i)=>{if(t!==n){if(t!==d)for(let o in t)!F(o)&&!(o in n)&&a(e,o,t[o],null,i,r);for(let o in n){if(F(o))continue;let s=n[o],c=t[o];s!==c&&o!==`value`&&a(e,o,c,s,i,r)}`value`in n&&a(e,`value`,t.value,n.value,i)}},j=(e,t,n,i,a,o,c,l,u)=>{let d=t.el=e?e.el:s(``),f=t.anchor=e?e.anchor:s(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(l=l?l.concat(h):h),e==null?(r(d,n,i),r(f,n,i),D(t.children||[],n,f,a,o,c,l,u)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(k(e.dynamicChildren,m,n,a,o,c,l),(t.key!=null||a&&t===a.subTree)&&Ai(e,t,!0)):R(e,t,n,f,a,o,c,l,u)},M=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):N(t,n,r,i,a,o,c):P(e,t,c)},N=(e,t,n,r,i,a,o)=>{let s=e.component=ma(e,r,i);if(Qn(e)&&(s.ctx.renderer=H),Ca(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,I,o,a),!e.el){let r=s.subTree=ea(zi);b(null,r,t,n),e.placeholder=r.el}}else I(s,e,t,n,i,a,o)},P=(e,t,n)=>{let r=t.component=e.component;if(ni(e,t,n)){if(r.asyncDep&&!r.asyncResolved){t.el=e.el,t.placeholder=e.placeholder,L(r,t,n);return}r.next=t,r.update()}else t.el=e.el,t.placeholder=e.placeholder,r.vnode=t},I=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=Mi(e);if(n){t&&(t.el=c.el,L(e,t,o)),n.asyncDep.then(()=>{wi(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;Oi(e,!1),t?(t.el=c.el,L(e,t,o)):t=c,n&&re(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&ua(d,s,t,c),Oi(e,!0);let f=Qr(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),se(p),e,i,a),t.el=f.el,u===null&&ai(e,f.el),r&&wi(r,i),(d=t.props&&t.props.onVnodeUpdated)&&wi(()=>ua(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Zn(t);if(Oi(e,!1),l&&re(l),!m&&(o=c&&c.onVnodeBeforeMount)&&ua(o,d,t),Oi(e,!0),s&&le){let t=()=>{e.subTree=Qr(e),le(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=Qr(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&wi(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;wi(()=>ua(o,d,e),i)}(t.shapeFlag&256||d&&Zn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&wi(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new De(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>gn(u),Oi(e,!0),l()},L=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,ui(e,t.props,r,n),Ci(e,t.children,n),He(),yn(e),Ue()},R=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,d=e?e.shapeFlag:0,f=t.children,{patchFlag:p,shapeFlag:m}=t;if(p>0){if(p&128){ee(l,f,n,r,i,a,o,s,c);return}if(p&256){z(l,f,n,r,i,a,o,s,c);return}}m&8?(d&16&&V(l,i,a),f!==l&&u(n,f)):d&16?m&16?ee(l,f,n,r,i,a,o,s,c):V(l,i,a,!0):(d&8&&u(n,``),m&16&&D(f,n,r,i,a,o,s,c))},z=(e,t,n,r,i,a,o,s,c)=>{e||=f,t||=f;let l=e.length,u=t.length,d=Math.min(l,u),p=0;for(;p<d;p++){let r=t[p]=c?sa(t[p]):oa(t[p]);v(e[p],r,n,null,i,a,o,s,c)}l>u?V(e,i,a,!0,!1,d):D(t,n,r,i,a,o,s,c,d)},ee=(e,t,n,r,i,a,o,s,c)=>{let l=0,u=t.length,d=e.length-1,p=u-1;for(;l<=d&&l<=p;){let r=e[l],u=t[l]=c?sa(t[l]):oa(t[l]);if(Zi(r,u))v(r,u,n,null,i,a,o,s,c);else break;l++}for(;l<=d&&l<=p;){let r=e[d],l=t[p]=c?sa(t[p]):oa(t[p]);if(Zi(r,l))v(r,l,n,null,i,a,o,s,c);else break;d--,p--}if(l>d){if(l<=p){let e=p+1,d=e<u?t[e].el:r;for(;l<=p;)v(null,t[l]=c?sa(t[l]):oa(t[l]),n,d,i,a,o,s,c),l++}}else if(l>p)for(;l<=d;)te(e[l],i,a,!0),l++;else{let m=l,h=l,g=new Map;for(l=h;l<=p;l++){let e=t[l]=c?sa(t[l]):oa(t[l]);e.key!=null&&g.set(e.key,l)}let _,y=0,b=p-h+1,x=!1,S=0,C=Array(b);for(l=0;l<b;l++)C[l]=0;for(l=m;l<=d;l++){let r=e[l];if(y>=b){te(r,i,a,!0);continue}let u;if(r.key!=null)u=g.get(r.key);else for(_=h;_<=p;_++)if(C[_-h]===0&&Zi(r,t[_])){u=_;break}u===void 0?te(r,i,a,!0):(C[u-h]=l+1,u>=S?S=u:x=!0,v(r,t[u],n,null,i,a,o,s,c),y++)}let w=x?ji(C):f;for(_=w.length-1,l=b-1;l>=0;l--){let e=h+l,d=t[e],f=t[e+1],p=e+1<u?f.el||Pi(f):r;C[l]===0?v(null,d,n,p,i,a,o,s,c):x&&(_<0||l!==w[_]?B(d,n,p,2):_--)}}},B=(e,t,n,a,o=null)=>{let{el:s,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6)B(e.component.subTree,t,n,a);else if(d&128)e.suspense.move(t,n,a);else if(d&64)c.move(e,t,n,H);else if(c===Li){r(s,t,n);for(let e=0;e<u.length;e++)B(u[e],t,n,a);r(e.anchor,t,n)}else if(c===Bi)S(e,t,n);else if(a!==2&&d&1&&l){if(a===0)l.persisted&&!s[Vn]?r(s,t,n):(l.beforeEnter(s),r(s,t,n),wi(()=>l.enter(s),o));else{let{leave:a,delayLeave:o,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?i(s):r(s,t,n)},d=()=>{let e=s._isLeaving||!!s[Vn];s._isLeaving&&s[Vn](!0),l.persisted&&!e?u():a(s,()=>{u(),c&&c()})};o?o(s,u,d):d()}}else r(s,t,n)},te=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if((d===-2||l&&l.hasOnce)&&(i=!1),s!=null&&(He(),Yn(s,null,n,e,!0),Ue()),p!=null&&(!e.ctx||e.ctx===t)&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!Zn(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&ua(_,t,e),u&6)ae(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&An(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,H,r):l&&!l.hasOnce&&(a!==Li||d>0&&d&64)?V(l,t,n,!1,!0):(a===Li&&d&384||!i&&u&16)&&V(c,t,n),r&&ne(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&wi(()=>{_&&ua(_,t,e),h&&An(e,null,t,`unmounted`),v&&(e.el=null)},n)},ne=e=>{let{type:t,el:n,anchor:r,transition:a}=e,o=t===Li;if(o&&!a){ie(n,r);return}if(t===Bi){C(e),a&&!a.persisted&&a.afterLeave&&a.afterLeave();return}let s=o?Gn(e):e,c=()=>{o?m(n)&&ie(n,r):i(n),a&&!a.persisted&&a.afterLeave&&a.afterLeave()};if(s&&s.shapeFlag&1&&a&&!a.persisted){let{leave:e,delayLeave:t}=a,n=s.el,r=()=>e(n,c);t?t(n,c,r):r()}else c()},ie=(e,t)=>{let n;for(;e!==t;)n=h(e),i(e),e=n;i(t)},ae=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Ni(c),Ni(l),r&&re(r),i.stop(),a?(a.flags|=8,te(o,e,t,n)):e.vnode.el&&o&&(o.transition=e.vnode.transition,te(o,e,t,n)),s&&wi(s,t),wi(()=>{e.isUnmounted=!0},t)},V=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)te(e[o],t,n,r,i)},se=e=>{if(e.shapeFlag&6)return se(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[zn];return n?h(n):t},ce=(e,t,n)=>{Sn(()=>{e==null?t._vnode&&te(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e},e&&t._vnode?void 0:e&&e.component?e.component.uid:pa())},H={p:v,um:te,m:B,r:ne,mt:N,mc:D,pc:R,pbc:k,n:se,o:e},U,le;return t&&([U,le]=t(H)),{render:ce,hydrate:U,createApp:Gr(ce,U)}}function Di({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Oi({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function ki(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Ai(e,t,n=!1){let r=e.children,i=t.children;if(x(r)&&x(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=sa(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Ai(t,a)),a.type===Ri&&(a.patchFlag===-1&&(a=i[e]=sa(a)),a.el=t.el),a.type===zi&&!a.el&&(a.el=t.el)}}function ji(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function Mi(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:Mi(t)}function Ni(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function Pi(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?Pi(t.subTree):null}var Fi=e=>e.__isSuspense;function Ii(e,t){t&&t.pendingBranch?x(e)?t.effects.push(...e):t.effects.push(e):vn(e)}var Li=Symbol.for(`v-fgt`),Ri=Symbol.for(`v-txt`),zi=Symbol.for(`v-cmt`),Bi=Symbol.for(`v-stc`),Vi=[],Hi=null;function Ui(e=!1){Vi.push(Hi=e?null:[])}function Wi(){Vi.pop(),Hi=Vi[Vi.length-1]||null}var Gi=1;function Ki(e,t=!1){Gi+=e,e<0&&Hi&&t&&(Hi.hasOnce=!0)}function qi(e){return e.dynamicChildren=Gi>0?Hi||f:null,Wi(),Gi>0&&Hi&&Hi.push(e),e}function Ji(e,t,n,r,i,a){return qi(J(e,t,n,r,i,a,!0))}function Yi(e,t,n,r,i){return qi(ea(e,t,n,r,i,!0))}function Xi(e){return e?e.__v_isVNode===!0:!1}function Zi(e,t){return e.type===t.type&&e.key===t.key}var Qi=({key:e})=>e??null,$i=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:E(e)||qt(e)||T(e)?{i:Tn,r:e,k:t,f:!!n}:e);function J(e,t=null,n=null,r=0,i=null,a=e===Li?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Qi(t),ref:t&&$i(t),scopeId:En,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Tn};return s?(ca(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=E(n)?8:16),Gi>0&&!o&&Hi&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&Hi.push(c),c}var ea=ta;function ta(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===_r)&&(e=zi),Xi(e)){let r=ra(e,t,!0);return n&&ca(r,n),Gi>0&&!a&&Hi&&(r.shapeFlag&6?Hi[Hi.indexOf(e)]=r:Hi.push(r)),r.patchFlag=-2,r}if(ja(e)&&(e=e.__vccOpts),t){t=na(t);let{class:e,style:n}=t;e&&!E(e)&&(t.class=ue(e)),O(n)&&(Ht(n)&&!x(n)&&(n=_({},n)),t.style=se(n))}let o=E(e)?1:Fi(e)?128:Bn(e)?64:O(e)?4:T(e)?2:0;return J(e,t,n,r,i,o,a,!0)}function na(e){return e?Ht(e)||ci(e)?_({},e):e:null}function ra(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?la(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Qi(l),ref:t&&t.ref?n&&a?x(a)?a.concat($i(t)):[a,$i(t)]:$i(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Li?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&ra(e.ssContent),ssFallback:e.ssFallback&&ra(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&Wn(u,c.clone(u)),u}function ia(e=` `,t=0){return ea(Ri,null,e,t)}function aa(e=``,t=!1){return t?(Ui(),Yi(zi,null,e)):ea(zi,null,e)}function oa(e){return e==null||typeof e==`boolean`?ea(zi):x(e)?ea(Li,null,e.slice()):Xi(e)?sa(e):ea(Ri,null,String(e))}function sa(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:ra(e)}function ca(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(x(t))n=16;else if(typeof t==`object`){if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),ca(e,n()),n._c&&(n._d=!0));return}{n=32;let r=t._;!r&&!ci(t)?t._ctx=Tn:r===3&&Tn&&(Tn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}}else if(T(t)){if(r&65){ca(e,{default:t});return}t={default:t,_ctx:Tn},n=32}else t=String(t),r&64?(n=16,t=[ia(t)]):n=8;e.children=t,e.shapeFlag|=n}function la(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=ue([t.class,r.class]));else if(e===`style`)t.style=se([t.style,r.style]);else if(h(e)){let n=t[e],i=r[e];i&&n!==i&&!(x(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!g(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function ua(e,t,n,r=null){an(e,t,7,[n,r])}var da=Ur(),fa=0;function pa(){return fa}function ma(e,t,n){let r=e.type,i=(t?t.appContext:e.appContext)||da,a={uid:fa++,vnode:e,type:r,parent:t,appContext:i,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Ce(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(i.provides),ids:t?t.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:mi(r,i),emitsOptions:Xr(r,i),emit:null,emitted:null,propsDefaults:d,inheritAttrs:r.inheritAttrs,ctx:d,data:d,props:d,attrs:d,slots:d,refs:d,setupState:d,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return a.ctx={_:a},a.root=t?t.root:a,a.emit=Jr.bind(null,a),e.ce&&e.ce(a),a}var ha=null,ga=()=>ha||Tn,_a,va;{let e=oe(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};_a=t(`__VUE_INSTANCE_SETTERS__`,e=>ha=e),va=t(`__VUE_SSR_SETTERS__`,e=>Sa=e)}var ya=e=>{let t=ha;return _a(e),e.scope.on(),()=>{e.scope.off(),_a(t)}},ba=()=>{ha&&ha.scope.off(),_a(null)};function xa(e){return e.vnode.shapeFlag&4}var Sa=!1;function Ca(e,t=!1,n=!1){t&&va(t);let{props:r,children:i}=e.vnode,a=xa(e);li(e,r,a,t),Si(e,i,n||t);let o=a?wa(e,t):void 0;return t&&va(!1),o}function wa(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Er);let{setup:r}=n;if(r){He();let n=e.setupContext=r.length>1?Oa(e):null,i=ya(e),a=K(r,e,0,[e.props,n]),o=k(a);if(Ue(),i(),(o||e.sp)&&!Zn(e)&&Kn(e),o){if(a.then(ba,ba),t)return a.then(n=>{va(!0);try{Ta(e,n,t)}finally{va(!1)}}).catch(t=>{on(t,e,0)});e.asyncDep=a}else Ta(e,a,t)}else Ea(e,t)}function Ta(e,t,n){T(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:O(t)&&(e.setupState=Xt(t)),Ea(e,n)}function Ea(e,t,n){let r=e.type;e.render||=r.render||p;{let t=ya(e);He();try{kr(e)}finally{Ue(),t()}}}var Da={get(e,t){return $e(e,`get`,``),e[t]}};function Oa(e){return{attrs:new Proxy(e.attrs,Da),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function ka(e){return e.exposed?e.exposeProxy||=new Proxy(Xt(Wt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in wr)return wr[n](e)},has(e,t){return t in e||t in wr}}):e.proxy}function Aa(e,t=!0){return T(e)?e.displayName||e.name:e.name||t&&e.__name}function ja(e){return T(e)&&`__vccOpts`in e}var Ma=(e,t)=>Qt(e,t,Sa),Na=`3.5.44`,Pa=void 0,Fa=typeof window<`u`&&window.trustedTypes;if(Fa)try{Pa=Fa.createPolicy(`vue`,{createHTML:e=>e})}catch{}var Ia=Pa?e=>Pa.createHTML(e):e=>e,La=`http://www.w3.org/2000/svg`,Ra=`http://www.w3.org/1998/Math/MathML`,za=typeof document<`u`?document:null,Ba=za&&za.createElement(`template`),Va={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?za.createElementNS(La,e):t===`mathml`?za.createElementNS(Ra,e):n?za.createElement(e,{is:n}):za.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>za.createTextNode(e),createComment:e=>za.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>za.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),i!==a&&(i=i.nextSibling););else{Ba.innerHTML=Ia(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Ba.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},Ha=Symbol(`_vtc`);function Ua(e,t,n){let r=e[Ha];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var Wa=Symbol(`_vod`),Ga=Symbol(`_vsh`),Ka=Symbol(``),qa=/(?:^|;)\s*display\s*:/;function Ja(e,t,n){let r=e.style,i=E(n),a=!1;if(n&&!i){if(t){if(E(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Xa(r,t,``)}else for(let e in t)n[e]??Xa(r,e,``)}for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?Xa(r,i,``):eo(e,i,!E(t)&&t?t[i]:void 0,o)||Xa(r,i,o)}}else if(i){if(t!==n){let e=r[Ka];e&&(n+=`;`+e),r.cssText=n,a=qa.test(n)}}else t&&e.removeAttribute(`style`);Wa in e&&((!i||t!==n)&&(e[Wa]=a?r.display:``),e[Ga]&&(r.display=`none`))}var Ya=/\s*!important$/;function Xa(e,t,n){if(x(n))n.forEach(n=>Xa(e,t,n));else if(n??=``,t.startsWith(`--`))Ya.test(n)?e.setProperty(t,n.replace(Ya,``),`important`):e.setProperty(t,n);else{let r=$a(e,t);Ya.test(n)?e.setProperty(ee(r),n.replace(Ya,``),`important`):e[r]=n}}var Za=[`Webkit`,`Moz`,`ms`],Qa={};function $a(e,t){let n=Qa[t];if(n)return n;let r=R(t);if(r!==`filter`&&r in e)return Qa[t]=r;r=B(r);for(let n=0;n<Za.length;n++){let i=Za[n]+r;if(i in e)return Qa[t]=i}return t}function eo(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&E(r)&&n===r}var to=`http://www.w3.org/1999/xlink`;function no(e,t,n,r,i,a=W(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(to,t.slice(6,t.length)):e.setAttributeNS(to,t,n):n==null||a&&!de(n)?e.removeAttribute(t):e.setAttribute(t,a?``:D(n)?String(n):n)}function ro(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?Ia(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=de(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function io(e,t,n,r){e.addEventListener(t,n,r)}function ao(e,t,n,r){e.removeEventListener(t,n,r)}var oo=Symbol(`_vei`);function so(e,t,n,r,i=null){let a=e[oo]||(e[oo]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=uo(t);r?io(e,n,a[t]=ho(r,i),s):o&&(ao(e,n,o,s),a[t]=void 0)}}var co=/(Once|Passive|Capture)$/,lo=/^on:?(?:Once|Passive|Capture)$/;function uo(e){let t,n;for(;(n=e.match(co))&&!lo.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):ee(e.slice(2)),t]}var fo=0,po=Promise.resolve(),mo=()=>fo||=(po.then(()=>fo=0),Date.now());function ho(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(x(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&an(e,t,5,a)}}else an(r,t,5,[e])};return n.value=e,n.attached=mo(),n}var go=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,_o=(e,t,n,r,i,a)=>{let o=i===`svg`;t===`class`?Ua(e,r,o):t===`style`?Ja(e,n,r):h(t)?g(t)||so(e,t,n,r,a):(t[0]===`.`?(t=t.slice(1),1):t[0]===`^`?(t=t.slice(1),0):vo(e,t,r,o))?(ro(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&no(e,t,r,o,a,t!==`value`)):e._isVueCE&&(yo(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!E(r)))?ro(e,R(t),r,a,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),no(e,t,r,o))};function vo(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&go(t)&&T(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return go(t)&&E(n)?!1:t in e}function yo(e,t){let n=e._def.props;if(!n)return!1;let r=R(t);return Array.isArray(n)?n.some(e=>R(e)===r):Object.keys(n).some(e=>R(e)===r)}var bo=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return x(t)?e=>re(t,e):t};function xo(e){e.target.composing=!0}function So(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var Co=Symbol(`_assign`),wo=Symbol(`_initialValue`);function To(e,t,n){return t&&(e=e.trim()),n&&(e=ae(e)),e}var Eo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e.parentNode&&(e.type===`text`?e[wo]=e.defaultValue.replace(/[\r\n]/g,``):e.type===`textarea`&&(e[wo]=e.defaultValue.replace(/\r\n?/g,`
`))),e[Co]=bo(i);let a=r||i.props&&i.props.type===`number`;io(e,t?`change`:`input`,t=>{t.target.composing||e[Co](To(e.value,n,a))}),(n||a)&&io(e,`change`,()=>{e.value=To(e.value,n,a)}),t||(io(e,`compositionstart`,xo),io(e,`compositionend`,So),io(e,`change`,So))},mounted(e,{value:t,modifiers:{trim:n,number:r}}){let i=t??``,a=e[wo];delete e[wo],a!==void 0&&(e.type===`text`||e.type===`textarea`)&&e.value!==a?e[Co](To(e.value,n,r)):e.value=i},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[Co]=bo(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?ae(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},Do={deep:!0,created(e,t,n){e[Co]=bo(n),io(e,`change`,()=>{let t=e._modelValue,n=Mo(e),r=e.checked,i=e[Co];if(x(t)){let e=_e(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(C(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(No(e,r))})},mounted:Oo,beforeUpdate(e,t,n){e[Co]=bo(n),Oo(e,t,n)}};function Oo(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(x(t))i=_e(t,r.props.value)>-1;else if(C(t))i=t.has(r.props.value);else{if(t===n)return;i=ge(t,No(e,!0))}e.checked!==i&&(e.checked=i)}var ko={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,io(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?ae(Mo(e)):Mo(e)),r=e.multiple,i=r?C(e._modelValue)?new Set(t):t:t[0],a=e._pendingValue=[r,r?x(i)?t.slice():t:i];try{e[Co](i)}finally{mn(()=>{e._pendingValue===a&&(e._pendingValue=void 0)})}}),e[Co]=bo(r)},mounted(e,{value:t}){jo(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[Co]=bo(n)},updated(e,{value:t}){let n=e._pendingValue;e._pendingValue=void 0,(!n||n[0]!==e.multiple||!Ao(t,n[1],n[0]))&&jo(e,t)}};function Ao(e,t,n){if(!n||x(e))return ge(e,t);if(C(e)){if(e.size!==t.length)return!1;for(let n of t)if(!e.has(n))return!1;return!0}return!1}function jo(e,t){let n=e.multiple,r=x(t);if(!n||r||C(t)){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=Mo(a);if(n){if(r){let e=typeof o;a.selected=e===`string`||e===`number`?t.some(e=>String(e)===String(o)):_e(t,o)>-1}else a.selected=t.has(o)}else if(ge(Mo(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Mo(e){return`_value`in e?e._value:e.value}function No(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var Po=[`ctrl`,`shift`,`alt`,`meta`],Fo={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>Po.some(n=>e[`${n}Key`]&&!t.includes(n))},Io=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=Fo[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Lo=_({patchProp:_o},Va),Ro;function zo(){return Ro||=Ti(Lo)}var Bo=((...e)=>{let t=zo().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Ho(e);if(!r)return;let i=t._component;!T(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Vo(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Vo(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Ho(e){return E(e)?document.querySelector(e):e}var Uo=function(e){Go(e);var t=Wo(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function Wo(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function Go(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}var Ko=1e-6,qo=typeof Float32Array<`u`?Float32Array:Array;function Jo(e){qo=e}Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function Yo(){var e=new qo(9);return qo!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function Xo(){var e=new qo(16);return qo!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Zo(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Qo(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(i*O-r*k-a*D)*A,e[2]=(h*C-g*S+_*x)*A,e[3]=(f*S-d*C-p*x)*A,e[4]=(c*E-o*k-l*T)*A,e[5]=(n*k-i*E+a*T)*A,e[6]=(g*b-m*C-_*y)*A,e[7]=(u*C-f*b+p*y)*A,e[8]=(o*O-s*E+l*w)*A,e[9]=(r*E-n*O-a*w)*A,e[10]=(m*S-h*b+_*v)*A,e[11]=(d*b-u*S-p*v)*A,e[12]=(s*T-o*D-c*w)*A,e[13]=(n*D-r*T+i*w)*A,e[14]=(h*y-m*x-g*v)*A,e[15]=(u*x-d*y+f*v)*A,e):null}function $o(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=t[4],c=t[5],l=t[6],u=t[7],d=t[8],f=t[9],p=t[10],m=t[11],h=t[12],g=t[13],_=t[14],v=t[15],y=n[0],b=n[1],x=n[2],S=n[3];return e[0]=y*r+b*s+x*d+S*h,e[1]=y*i+b*c+x*f+S*g,e[2]=y*a+b*l+x*p+S*_,e[3]=y*o+b*u+x*m+S*v,y=n[4],b=n[5],x=n[6],S=n[7],e[4]=y*r+b*s+x*d+S*h,e[5]=y*i+b*c+x*f+S*g,e[6]=y*a+b*l+x*p+S*_,e[7]=y*o+b*u+x*m+S*v,y=n[8],b=n[9],x=n[10],S=n[11],e[8]=y*r+b*s+x*d+S*h,e[9]=y*i+b*c+x*f+S*g,e[10]=y*a+b*l+x*p+S*_,e[11]=y*o+b*u+x*m+S*v,y=n[12],b=n[13],x=n[14],S=n[15],e[12]=y*r+b*s+x*d+S*h,e[13]=y*i+b*c+x*f+S*g,e[14]=y*a+b*l+x*p+S*_,e[15]=y*o+b*u+x*m+S*v,e}function es(e,t,n){var r=n[0],i=n[1],a=n[2],o,s,c,l,u,d,f,p,m,h,g,_;return t===e?(e[12]=t[0]*r+t[4]*i+t[8]*a+t[12],e[13]=t[1]*r+t[5]*i+t[9]*a+t[13],e[14]=t[2]*r+t[6]*i+t[10]*a+t[14],e[15]=t[3]*r+t[7]*i+t[11]*a+t[15]):(o=t[0],s=t[1],c=t[2],l=t[3],u=t[4],d=t[5],f=t[6],p=t[7],m=t[8],h=t[9],g=t[10],_=t[11],e[0]=o,e[1]=s,e[2]=c,e[3]=l,e[4]=u,e[5]=d,e[6]=f,e[7]=p,e[8]=m,e[9]=h,e[10]=g,e[11]=_,e[12]=o*r+u*i+m*a+t[12],e[13]=s*r+d*i+h*a+t[13],e[14]=c*r+f*i+g*a+t[14],e[15]=l*r+p*i+_*a+t[15]),e}function ts(e,t,n){var r=n[0],i=n[1],a=n[2];return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*a,e[9]=t[9]*a,e[10]=t[10]*a,e[11]=t[11]*a,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function ns(e,t,n,r){var i=r[0],a=r[1],o=r[2],s=Math.hypot(i,a,o),c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;return s<Ko?null:(s=1/s,i*=s,a*=s,o*=s,c=Math.sin(n),l=Math.cos(n),u=1-l,d=t[0],f=t[1],p=t[2],m=t[3],h=t[4],g=t[5],_=t[6],v=t[7],y=t[8],b=t[9],x=t[10],S=t[11],C=i*i*u+l,w=a*i*u+o*c,T=o*i*u-a*c,E=i*a*u-o*c,D=a*a*u+l,O=o*a*u+i*c,k=i*o*u+a*c,A=a*o*u-i*c,j=o*o*u+l,e[0]=d*C+h*w+y*T,e[1]=f*C+g*w+b*T,e[2]=p*C+_*w+x*T,e[3]=m*C+v*w+S*T,e[4]=d*E+h*D+y*O,e[5]=f*E+g*D+b*O,e[6]=p*E+_*D+x*O,e[7]=m*E+v*D+S*O,e[8]=d*k+h*A+y*j,e[9]=f*k+g*A+b*j,e[10]=p*k+_*A+x*j,e[11]=m*k+v*A+S*j,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function rs(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[4],o=t[5],s=t[6],c=t[7],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=a*i+l*r,e[5]=o*i+u*r,e[6]=s*i+d*r,e[7]=c*i+f*r,e[8]=l*i-a*r,e[9]=u*i-o*r,e[10]=d*i-s*r,e[11]=f*i-c*r,e}function is(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i-l*r,e[1]=o*i-u*r,e[2]=s*i-d*r,e[3]=c*i-f*r,e[8]=a*r+l*i,e[9]=o*r+u*i,e[10]=s*r+d*i,e[11]=c*r+f*i,e}function as(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[4],u=t[5],d=t[6],f=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i+l*r,e[1]=o*i+u*r,e[2]=s*i+d*r,e[3]=c*i+f*r,e[4]=l*i-a*r,e[5]=u*i-o*r,e[6]=d*i-s*r,e[7]=f*i-c*r,e}function os(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=r+r,c=i+i,l=a+a,u=r*s,d=r*c,f=r*l,p=i*c,m=i*l,h=a*l,g=o*s,_=o*c,v=o*l;return e[0]=1-(p+h),e[1]=d+v,e[2]=f-_,e[3]=0,e[4]=d-v,e[5]=1-(u+h),e[6]=m+g,e[7]=0,e[8]=f+_,e[9]=m-g,e[10]=1-(u+p),e[11]=0,e[12]=n[0],e[13]=n[1],e[14]=n[2],e[15]=1,e}function ss(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function cs(e,t){var n=t[0],r=t[1],i=t[2],a=t[4],o=t[5],s=t[6],c=t[8],l=t[9],u=t[10];return e[0]=Math.hypot(n,r,i),e[1]=Math.hypot(a,o,s),e[2]=Math.hypot(c,l,u),e}function ls(e,t){var n=new qo(3);cs(n,t);var r=1/n[0],i=1/n[1],a=1/n[2],o=t[0]*r,s=t[1]*i,c=t[2]*a,l=t[4]*r,u=t[5]*i,d=t[6]*a,f=t[8]*r,p=t[9]*i,m=t[10]*a,h=o+u+m,g=0;return h>0?(g=Math.sqrt(h+1)*2,e[3]=.25*g,e[0]=(d-p)/g,e[1]=(f-c)/g,e[2]=(s-l)/g):o>u&&o>m?(g=Math.sqrt(1+o-u-m)*2,e[3]=(d-p)/g,e[0]=.25*g,e[1]=(s+l)/g,e[2]=(f+c)/g):u>m?(g=Math.sqrt(1+u-o-m)*2,e[3]=(f-c)/g,e[0]=(s+l)/g,e[1]=.25*g,e[2]=(d+p)/g):(g=Math.sqrt(1+m-o-u)*2,e[3]=(s-l)/g,e[0]=(f+c)/g,e[1]=(d+p)/g,e[2]=.25*g),e}function us(e,t,n,r,i){var a=1/Math.tan(t/2),o;return e[0]=a/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(o=1/(r-i),e[10]=(i+r)*o,e[14]=2*i*r*o):(e[10]=-1,e[14]=-2*r),e}var ds=us;function fs(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=r[0],c=r[1],l=r[2],u=i-n[0],d=a-n[1],f=o-n[2],p=u*u+d*d+f*f;p>0&&(p=1/Math.sqrt(p),u*=p,d*=p,f*=p);var m=c*f-l*d,h=l*u-s*f,g=s*d-c*u;return p=m*m+h*h+g*g,p>0&&(p=1/Math.sqrt(p),m*=p,h*=p,g*=p),e[0]=m,e[1]=h,e[2]=g,e[3]=0,e[4]=d*g-f*h,e[5]=f*m-u*g,e[6]=u*h-d*m,e[7]=0,e[8]=u,e[9]=d,e[10]=f,e[11]=0,e[12]=i,e[13]=a,e[14]=o,e[15]=1,e}function ps(){var e=new qo(3);return qo!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function ms(e){var t=e[0],n=e[1],r=e[2];return Math.hypot(t,n,r)}function hs(e,t,n){var r=new qo(3);return r[0]=e,r[1]=t,r[2]=n,r}function gs(e,t,n,r){return e[0]=t,e[1]=n,e[2]=r,e}function _s(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e[2]=t[2]+n[2],e}function vs(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e[2]=t[2]-n[2],e}function ys(e,t,n,r){return e[0]=t[0]+n[0]*r,e[1]=t[1]+n[1]*r,e[2]=t[2]+n[2]*r,e}function bs(e,t){var n=t[0],r=t[1],i=t[2],a=n*n+r*r+i*i;return a>0&&(a=1/Math.sqrt(a)),e[0]=t[0]*a,e[1]=t[1]*a,e[2]=t[2]*a,e}function xs(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function Ss(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[0],s=n[1],c=n[2];return e[0]=i*c-a*s,e[1]=a*o-r*c,e[2]=r*s-i*o,e}function Cs(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[3]*r+n[7]*i+n[11]*a+n[15];return o||=1,e[0]=(n[0]*r+n[4]*i+n[8]*a+n[12])/o,e[1]=(n[1]*r+n[5]*i+n[9]*a+n[13])/o,e[2]=(n[2]*r+n[6]*i+n[10]*a+n[14])/o,e}function ws(e,t,n){var r=n[0],i=n[1],a=n[2],o=n[3],s=t[0],c=t[1],l=t[2],u=i*l-a*c,d=a*s-r*l,f=r*c-i*s,p=i*f-a*d,m=a*u-r*f,h=r*d-i*u,g=o*2;return u*=g,d*=g,f*=g,p*=2,m*=2,h*=2,e[0]=s+u+p,e[1]=c+d+m,e[2]=l+f+h,e}var Ts=vs,Es=ms;(function(){var e=ps();return function(t,n,r,i,a,o){var s,c;for(n||=3,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function Ds(){var e=new qo(4);return qo!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Os(e,t,n,r,i){return e[0]=t,e[1]=n,e[2]=r,e[3]=i,e}function ks(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=n*n+r*r+i*i+a*a;return o>0&&(o=1/Math.sqrt(o)),e[0]=n*o,e[1]=r*o,e[2]=i*o,e[3]=a*o,e}function As(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3];return e[0]=n[0]*r+n[4]*i+n[8]*a+n[12]*o,e[1]=n[1]*r+n[5]*i+n[9]*a+n[13]*o,e[2]=n[2]*r+n[6]*i+n[10]*a+n[14]*o,e[3]=n[3]*r+n[7]*i+n[11]*a+n[15]*o,e}(function(){var e=Ds();return function(t,n,r,i,a,o){var s,c;for(n||=4,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}})();function js(){var e=new qo(4);return qo!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function Ms(e,t,n){n*=.5;var r=Math.sin(n);return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=Math.cos(n),e}function Ns(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=t[3],c=n[0],l=n[1],u=n[2],d=n[3],f,p=i*c+a*l+o*u+s*d,m,h,g;return p<0&&(p=-p,c=-c,l=-l,u=-u,d=-d),1-p>Ko?(f=Math.acos(p),m=Math.sin(f),h=Math.sin((1-r)*f)/m,g=Math.sin(r*f)/m):(h=1-r,g=r),e[0]=h*i+g*c,e[1]=h*a+g*l,e[2]=h*o+g*u,e[3]=h*s+g*d,e}function Ps(e,t){var n=t[0]+t[4]+t[8],r;if(n>0)r=Math.sqrt(n+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{var i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);var a=(i+1)%3,o=(i+2)%3;r=Math.sqrt(t[i*3+i]-t[a*3+a]-t[o*3+o]+1),e[i]=.5*r,r=.5/r,e[3]=(t[a*3+o]-t[o*3+a])*r,e[a]=(t[a*3+i]+t[i*3+a])*r,e[o]=(t[o*3+i]+t[i*3+o])*r}return e}var Fs=Os,Is=ks;(function(){var e=ps(),t=hs(1,0,0),n=hs(0,1,0);return function(r,i,a){var o=xs(i,a);return o<-.999999?(Ss(e,t,i),Es(e)<1e-6&&Ss(e,n,i),bs(e,e),Ms(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(Ss(e,i,a),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,Is(r,r))}})(),(function(){var e=js(),t=js();return function(n,r,i,a,o,s){return Ns(e,r,o,s),Ns(t,i,a,s),Ns(n,e,t,2*s*(1-s)),n}})(),(function(){var e=Yo();return function(t,n,r,i){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],Is(t,Ps(t,e))}})();function Ls(){var e=new qo(2);return qo!=Float32Array&&(e[0]=0,e[1]=0),e}(function(){var e=Ls();return function(t,n,r,i,a,o){var s,c;for(n||=2,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],a(e,e,o),t[s]=e[0],t[s+1]=e[1];return t}})();var Rs=class{children;parent;model;worldModel;modelViewProjection;worldTransformNeedsUpdate;modelViewProjectionNeedsUpdate;type;scene;constructor(){this.children=[],this.model=Xo(),this.worldModel=Xo(),this.modelViewProjection=Xo(),this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0,this.type=`Element`,this.scene=null,this.parent=null}appendChild(e,t=!1){e.parent=this,t?this.children.unshift(e):this.children.push(e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}insertChildAfter(e,t){e.parent=this;let n=this.children.indexOf(t);if(n<0)throw Error(`Could not find element to insert after`);this.children.splice(n+1,0,e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}bindScene(e){this.scene=e,this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0}traverse(e,t){e(this);for(var n=0;n<this.children.length;++n)this.children[n].traverse(e,t);t&&t(this)}rotate(e,t){return ns(this.model,this.model,e,t),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateX(e){return rs(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateY(e){return is(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateZ(e){return as(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}scale(e){return ts(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}translate(e){return es(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}removeChild(e){let t=this.children.indexOf(e);t>-1&&(this.children.splice(t,1),e.bindScene(null)),this.scene&&this.scene.renderFrame()}updateWorldTransform(e=!1){(this.worldTransformNeedsUpdate||e)&&(this.parent?$o(this.worldModel,this.parent.worldModel,this.model):Zo(this.worldModel,this.model),this.modelViewProjectionNeedsUpdate=!0,this.worldTransformNeedsUpdate=!1,e=!0);let t=e;for(var n=this.children,r=0;r<n.length;r++)t=n[r].updateWorldTransform(e)||t;return t}scheduleMVPUpdate(){this.modelViewProjectionNeedsUpdate=!0;let e=this.children;for(var t=0;t<e.length;t++)e[t].scheduleMVPUpdate()}updateModelViewProjection(e,t){this.modelViewProjectionNeedsUpdate&&=($o(this.modelViewProjection,e,t),$o(this.modelViewProjection,this.modelViewProjection,this.worldModel),!1)}draw(e,t){for(var n=0;n<this.children.length;++n){let r=this.children[n];r.updateModelViewProjection(t.projection,t.view.matrix),r.draw(e,t)}}dispose(){for(var e=0;e<this.children.length;++e)this.children[e].dispose()}},zs={maxSingleTouchTime:300,singleTapDistanceSquared:25};function Bs(e,t,n){var r=Date.now();let i;return e.addEventListener(`click`,c,{passive:!1}),e.addEventListener(`touchend`,o,{passive:!1}),e.addEventListener(`touchstart`,a,{passive:!1}),s;function a(e){e.touches.length===1&&(r=Date.now(),i={x:e.touches[0].pageX,y:e.touches[0].pageY})}function o(e){if(e.touches.length>1||Date.now()-r>zs.maxSingleTouchTime)return;let t=e.changedTouches[0];var n=t.pageX-i.x,a=t.pageY-i.y;n*n+a*a<zs.singleTapDistanceSquared&&c(t)}function s(){e.removeEventListener(`click`,c),e.removeEventListener(`touchend`,o),e.removeEventListener(`touchstart`,a)}function c(e){t.call(n,e)}}var Vs=[0,0,0],Hs=[1,0,0],Us=[0,1,0],Ws=[0,0,1],Gs=class{matrix;cameraWorld;position;orientation;center;constructor(e){this.matrix=e||Xo(),this.cameraWorld=Qo(Xo(),this.matrix),this.position=[0,0,0],this.orientation=[0,0,0,1],this.center=[0,0,0],this.deconstructPositionRotation()}lookAt(e,t,n){return fs(this.cameraWorld,e,t,n),Qo(this.matrix,this.cameraWorld),this.deconstructPositionRotation(),this}update(){return os(this.cameraWorld,this.orientation,this.position),Qo(this.matrix,this.cameraWorld),this}deconstructPositionRotation(){ss(this.position,this.cameraWorld),ls(this.orientation,this.cameraWorld)}translateOnAxis(e,t){let n=ws(Vs,e,this.orientation);return ys(this.position,this.position,n,t),this}translateX(e){return this.translateOnAxis(Hs,e)}translateY(e){return this.translateOnAxis(Us,e)}translateZ(e){return this.translateOnAxis(Ws,e)}},Ks={exports:{}},qs=4,Js=.001,Ys=1e-7,Xs=10,Zs=11,Qs=1/(Zs-1),$s=typeof Float32Array==`function`;function ec(e,t){return 1-3*t+3*e}function tc(e,t){return 3*t-6*e}function nc(e){return 3*e}function rc(e,t,n){return((ec(t,n)*e+tc(t,n))*e+nc(t))*e}function ic(e,t,n){return 3*ec(t,n)*e*e+2*tc(t,n)*e+nc(t)}function ac(e,t,n,r,i){var a,o,s=0;do o=t+(n-t)/2,a=rc(o,r,i)-e,a>0?n=o:t=o;while(Math.abs(a)>Ys&&++s<Xs);return o}function oc(e,t,n,r){for(var i=0;i<qs;++i){var a=ic(t,n,r);if(a===0)return t;var o=rc(t,n,r)-e;t-=o/a}return t}function sc(e){return e}var cc=function(e,t,n,r){if(!(0<=e&&e<=1&&0<=n&&n<=1))throw Error(`bezier x values must be in [0, 1] range`);if(e===t&&n===r)return sc;for(var i=$s?new Float32Array(Zs):Array(Zs),a=0;a<Zs;++a)i[a]=rc(a*Qs,e,n);function o(t){for(var r=0,a=1,o=Zs-1;a!==o&&i[a]<=t;++a)r+=Qs;--a;var s=(t-i[a])/(i[a+1]-i[a]),c=r+s*Qs,l=ic(c,e,n);return l>=Js?oc(t,c,e,n):l===0?c:ac(t,r,r+Qs,e,n)}return function(e){return e===0?0:e===1?1:rc(o(e),t,r)}},lc={ease:cc(.25,.1,.25,1),easeIn:cc(.42,0,1,1),easeOut:cc(0,0,.58,1),easeInOut:cc(.42,0,.58,1),linear:cc(0,0,1,1)};Ks.exports=uc,Ks.exports.makeAggregateRaf=hc,Ks.exports.sharedScheduler=hc();function uc(e,t,n){var r=Object.create(null),i=Object.create(null);n||={};var a=typeof n.easing==`function`?n.easing:lc[n.easing];a||=(n.easing&&console.warn(`Unknown easing function in amator: `+n.easing),lc.ease);var o=typeof n.step==`function`?n.step:dc,s=typeof n.done==`function`?n.done:dc,c=fc(n.scheduler),l=Object.keys(t);l.forEach(function(n){r[n]=e[n],i[n]=t[n]-e[n]});var u=typeof n.duration==`number`?n.duration:400,d=Math.max(1,u*.06),f,p=0;return f=c.next(h),{cancel:m};function m(){c.cancel(f),f=0}function h(){var t=a(p/d);p+=1,g(t),p<=d?(f=c.next(h),o(e)):(f=0,setTimeout(function(){s(e)},0))}function g(t){l.forEach(function(n){e[n]=i[n]*t+r[n]})}}function dc(){}function fc(e){if(!e)return typeof window<`u`&&window.requestAnimationFrame?pc():mc();if(typeof e.next!=`function`)throw Error(`Scheduler is supposed to have next(cb) function`);if(typeof e.cancel!=`function`)throw Error(`Scheduler is supposed to have cancel(handle) function`);return e}function pc(){return{next:window.requestAnimationFrame.bind(window),cancel:window.cancelAnimationFrame.bind(window)}}function mc(){return{next:function(e){return setTimeout(e,1e3/60)},cancel:function(e){return clearTimeout(e)}}}function hc(){var e=new Set,t=new Set,n=0;return{next:i,cancel:i,clearAll:r};function r(){e.clear(),t.clear(),cancelAnimationFrame(n),n=0}function i(e){t.add(e),a()}function a(){n||=requestAnimationFrame(o)}function o(){n=0;var r=t;t=e,e=r,e.forEach(function(e){e()}),e.clear()}}function gc(e,t,n){typeof n!=`object`&&(n={});let r=.001,i=typeof n.minVelocity==`number`?n.minVelocity:r,a=typeof n.amplitude==`number`?n.amplitude:.01,o=typeof n.cancelAnimationFrame==`function`?n.cancelAnimationFrame:_c(),s=typeof n.requestAnimationFrame==`function`?n.requestAnimationFrame:vc(),c,l,u,d,f,p,m,h,g,_;return{start:x,setAmplitude:v,getAmplitude:y,stop:C,impulse:w,cancel:b};function v(e){a=e}function y(){return a}function b(){o(u),o(_)}function x(){c=e(),f=m=d=p=h=0,l=new Date,o(u),o(_),u=s(S)}function S(){var t=Date.now(),n=t-l;l=t;var r=e(),i=r.x-c.x,a=r.y-c.y,o=(r.z||0)-c.z;c=r;var f=1e3/(1+n);d=.8*i*f+.2*d,p=.8*a*f+.2*p,h=.8*o*f+.2*h,u=s(S)}function C(){u&&(o(u),u=0,o(_),_=0,w(d,p,h))}function w(e,t,n){l=Date.now(),(e<-i||e>i)&&(f=a*e),(t<-i||t>i)&&(m=a*t),(n<-i||n>i)&&(g=a*n),_=s(T)}function T(){var n=Date.now()-l,i=!1,a=0,o=0,c=0;let u=Math.exp(-n/342);if(f&&(a=f*u,a>r||a<-.001?i=!0:a=f=0),m&&(o=m*u,o>r||o<-.001?i=!0:o=m=0),g&&(c=g*u,c>r||c<-.001?i=!0:c=g=0),i){let n=e();t(n.x+a,n.y+o,n.z+c),_=s(T)}}}function _c(){return typeof cancelAnimationFrame==`function`?cancelAnimationFrame:clearTimeout}function vc(){return typeof requestAnimationFrame==`function`?requestAnimationFrame:function(e){return setTimeout(e,16)}}var yc=class{x;y;lastX;lastY;id;createdAt;constructor(e){this.x=e.clientX,this.y=e.clientY,this.lastX=this.x,this.lastY=this.y,this.id=e.identifier,this.createdAt=Date.now()}move(e){this.lastX=this.x,this.lastY=this.y,this.x=e.clientX,this.y=e.clientY}},bc=0,xc=1,Sc=2,Cc=3,wc=class{allowRotation;state;canRotate;canScale;canIncline;first;second;stateChanged;constructor(e){this.allowRotation=e,this.state=bc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0,this.stateChanged=!1}reset(){this.state=bc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0}isUnknown(){return this.state===bc}track(e,t){if(this.stateChanged=!1,this.state!==bc)return;if(!(this.first&&this.second)){this.first={id:e.id,x:e.x,y:e.y},this.second={id:t.id,x:t.x,y:t.y};return}let n=this.first,r=this.second;if(e.id===r.id&&t.id===n.id){let e=n;n=r,r=e}let i=n.y-r.y,a=n.x-r.x,o=e.y-t.y,s=e.x-t.x,c=Math.abs(Math.hypot(i,a)-Math.hypot(o,s)),l=Math.atan2(i,a),u=Math.abs(l-Math.atan2(o,s));if(l=Math.abs(l)*180/Math.PI,(l<60||180-l<60)&&this.allowRotation&&Math.abs(e.createdAt-t.createdAt)<100){let i=e.x-n.x+t.x-r.x,a=e.y-n.y+t.y-r.y;Math.abs(i)<10&&Math.abs(a)>42&&(this.canIncline=!0)}this.canIncline?(this.canRotate=!1,this.canScale=!1,this.canIncline=!0,this.state=Cc):u>.1&&this.allowRotation?(this.canRotate=!0,this.canScale=!0,this.canIncline=!1,this.state=Sc):c>15&&(this.canRotate=!1,this.canScale=!0,this.canIncline=!1,this.state=xc),this.stateChanged=!0}};function Tc(e,t){let n=!1,r=new Map,{allowRotation:i,allowPinchRotation:a,panAnimation:o,rotateAnimation:s}=t,c=new wc(a&&i),l,u=Date.now(),d=u;return p(),{dispose:f};function f(){e.removeEventListener(`touchstart`,m,{passive:!1}),v()}function p(){e.addEventListener(`touchstart`,m,{passive:!1})}function m(e){n||=(_(),!0),o.cancel(),s.cancel(),e.touches.length===1&&o.start();for(let t=0;t<e.touches.length;++t){let n=e.touches[t];r.has(n.identifier)||r.set(n.identifier,new yc(n))}e.stopPropagation(),e.preventDefault()}function h(e){let n=Date.now(),i=0,a=0,l=0,f=0,p,m,h=!1,g=e.touches;for(let e=0;e<g.length;++e){let t=g[e],n=r.get(t.identifier);n&&(n.move(t),l+=n.x,f+=n.y,i+=n.x-n.lastX,a+=n.y-n.lastY,p?m||=n:p=n)}let _=g.length;if(i/=_,a/=_,l/=_,f/=_,m||c.reset(),p&&m){d=n;let r=m.x-p.x,i=m.y-p.y,a=m.lastX-p.lastX,u=m.lastY-p.lastY,g=Math.hypot(r,i)/Math.hypot(a,u)-1,_=Math.atan2(i,r)-Math.atan2(u,a);if(c.track(p,m),c.stateChanged&&(s.start(),o.cancel()),c.canScale&&(t.zoomToClientCoordinates(l,f,g),h=!0),c.canRotate&&(t.rotateByAngle(_,0),h=!0),c.canIncline){let e=m.y-m.lastY+p.y-p.lastY;t.rotateByAbsoluteOffset(0,e),h=!0}e.preventDefault(),e.stopPropagation()}let v=n-u,y=c.canIncline||v<300||e.touches.length>1&&c.isUnknown();(i!==0||a!==0)&&!y&&(t.panByAbsoluteOffset(i,a),h=!0),h&&t.redraw()}function g(e){let i=Date.now(),a=i-u;u=i;let f=e.changedTouches;for(let e=0;e<f.length;++e){let t=f[e];r.delete(t.identifier)}if(e.touches.length<2&&(c.reset(),s.stop(),o.stop()),e.touches.length===0&&r.clear(),r.size===0&&e.changedTouches.length===1){if(n=!1,v(),o.stop(),a<350&&i-d>350){let n=e.changedTouches[0],r=Math.abs(n.clientX-l.clientX),i=Math.abs(n.clientY-l.clientY);Math.hypot(r,i)<30&&t.zoomToClientCoordinates(l.clientX,l.clientY,.5,!0)}l=e.changedTouches[0]}}function _(){document.addEventListener(`touchmove`,h,{passive:!1}),document.addEventListener(`touchend`,g,{passive:!1}),document.addEventListener(`touchcancel `,g,{passive:!1})}function v(){document.removeEventListener(`touchmove`,h),document.removeEventListener(`touchend`,g),document.removeEventListener(`touchcancel `,g)}}function Ec(e,t,n){let r=e*Math.cos(t);return[e*Math.sin(t)*Math.cos(n),e*Math.sin(t)*Math.sin(n),r]}function Dc(e,t,n){return e<t&&(e=t),e>n&&(e=n),e}function Oc(e,t){return e===void 0?t:e}function kc(e,t,n){return Math.abs(e)<t?n:e}function Ac(e,t){let n=0,r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;return h(),{dispose:g};function h(){e.getAttribute(`tabindex`)||e.setAttribute(`tabindex`,`0`),e.addEventListener(`keydown`,y),e.addEventListener(`keyup`,b)}function g(){e.removeEventListener(`keydown`,y),e.removeEventListener(`keyup`,b),cancelAnimationFrame(n)}function _(){n=0;let e=.9,h=!1;if(o=kc(o*e+r,.5,0),s=kc(s*e+i,.5,0),c=kc(c*e+a,.5,0),(o||s)&&(t.panByAbsoluteOffset(o,s),h=!0),c&&(t.slideCenterUpDown(c),h=!0),l=kc(l*e+u/2,Math.PI/360,0),p=kc(p*e+m/6,Math.PI/360,0),(l||p)&&(t.rotateByAbsoluteOffset(l,p),h=!0),d=kc(d*.7+f,.5,0),d){let e=Math.sign(d)*.025;t.zoomCenterByScaleFactor(e,0,0),h=!0}h&&(t.redraw(),v())}function v(){n||=requestAnimationFrame(_)}function y(e){x(e,1)}function b(e){x(e,0)}function x(e,t){if(!jc(e)){switch(e.which){case 81:u=-t;break;case 69:u=t;break;case 187:f=t;break;case 189:f=-t;break;case 82:m=t;break;case 70:m=-t;break;case 37:case 65:r=t;break;case 39:case 68:r=-t;break;case 38:case 87:i=t;break;case 40:case 83:i=-t;break;case 71:a=-t;break;case 84:a=t}v()}}}function jc(e){return e.altKey||e.ctrlKey||e.metaKey}function Mc(e,t){let n,r,i,{allowRotation:a,panAnimation:o,rotateAnimation:s}=t;return e.addEventListener(`wheel`,p,{passive:!1}),e.addEventListener(`mousedown`,l,{passive:!1}),e.addEventListener(`dblclick`,f,{passive:!1}),{dispose:c};function c(){e.removeEventListener(`wheel`,p,{passive:!1}),e.removeEventListener(`mousedown`,l,{passive:!1}),e.removeEventListener(`dblclick`,f,{passive:!1}),document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d)}function l(e){(e.button===1&&window.event!==null||e.button===0)&&(document.addEventListener(`mousemove`,u),document.addEventListener(`mouseup`,d),n=e.clientX,r=e.clientY,i=e.altKey&&a,o.cancel(),s.cancel(),i?s.start():o.start())}function u(e){let a=e.clientY-r,o=e.clientX-n;i?t.rotateByAbsoluteOffset(o,a):t.panByAbsoluteOffset(o,a),n=e.clientX,r=e.clientY,t.redraw()}function d(){document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d),i?s.stop():o.stop()}function f(e){t.zoomToClientCoordinates(e.clientX,e.clientY,.5,!0),e.preventDefault(),e.stopPropagation()}function p(e){let n=e.deltaMode>0?100:1,r=m(-e.deltaY*n);t.zoomToClientCoordinates(e.clientX,e.clientY,r),e.preventDefault()}function m(e){return Math.sign(e)*Math.min(.25,Math.abs(e/128))}}function Nc(e,t){if(typeof e==`string`){let t=document.querySelector(e);if(!t)throw Error(`Cannot resolve input target element: `+e);return t}return e||t}var Pc=class{drawContext;updated;constructor(e){this.drawContext=e.getDrawContext(),this.updated=!1}};function Fc(e){let t=e.getDrawContext(),n=t.view,r=Math.PI*2,i=Math.PI*1.618,a=new Pc(e),o=e.getOptions()||{},s=o.allowRotation===void 0||!!o.allowRotation,c=o.allowPinchRotation===void 0?s:!!o.allowPinchRotation,l=Oc(o.minPhi,-1/0),u=Oc(o.maxPhi,1/0),d=Dc(-Math.PI/2,l,u),f=Oc(o.minTheta,0),p=Oc(o.maxTheta,Math.PI),m=Dc(0,f,p),h=Oc(o.minZoom,-1/0),g=Oc(o.maxZoom,1/0),_=Dc(1,h,g),v=n.center,y=n.position,b=gc(L,ee),x=gc(R,z,{minVelocity:1}),S=[0,0,1],C={dispose:k,setViewBox:O,panByAbsoluteOffset:N,slideCenterUpDown:I,rotateByAngle:j,rotateByAbsoluteOffset:M,zoomCenterByScaleFactor:B,zoomToClientCoordinates:P,redraw:te,allowRotation:s,allowPinchRotation:c,rotateAnimation:x,panAnimation:b},w=Nc(o.inputTarget,t.canvas),T=Ac(w,C),E=Tc(w,C),D=Mc(w,C);return te(),C;function O(){return y=n.position,_=Math.hypot(y[2]),v[0]=y[0],v[1]=y[1],v[2]=0,m=Dc(0,f,p),d=Dc(-Math.PI/2,l,u),te(),C}function k(){x.cancel(),b.cancel(),E.dispose(),T.dispose(),D.dispose()}function A(t,n){let r=e.getSceneCoordinate(t,n),i=Ts(r,r,y);bs(i,i);let a=xs(S,i);if(Math.abs(a)>1e-7){let e=xs(Ts([0,0,0],v,y),S)/a;return ys([0,0,0],y,i,e)}}function j(e,t){d=Dc(d+e,l,u),m=Dc(m+t,f,p)}function M(e,n){if(!s)return;let a=t.width/t.height;d-=r*e/t.width,m-=i*n/t.height*a,m=Dc(m,f,p),d=Dc(d,l,u)}function N(e,n){let r=t.width/t.height,i=2*_*Math.tan(t.fov/2);F(r*i*e/(t.width/t.pixelRatio),-(i*n/(t.height/t.pixelRatio)))}function P(e,t,n,r){let i=A(e,t);if(!i)return;let a=i[0]-v[0],o=i[1]-v[1];if(r){let e={r:_,x:v[0],y:v[1]},t={r:Dc(_*(1-n),h,g),x:e.x+a*n,y:e.y+o*n};Ks.exports(e,t,{step(e){_=e.r,v[0]=e.x,v[1]=e.y,te()}})}else B(n,a,o),te()}function F(e,t){let n=Math.cos(d),r=Math.sin(d);v[0]+=n*t+r*e,v[1]+=r*t-n*e}function I(e){v[2]+=e*_*.001}function L(){return{x:v[0],y:v[1],z:v[2]}}function R(){return{x:d,y:m,z:0}}function z(e,t){m=Dc(t,f,p),d=Dc(e,l,u),te()}function ee(e,t,n){gs(v,e,t,n),te()}function B(e,t,n){let r=Dc(_*(1-e),h,g);r!==_&&(_=r,v[0]+=t*e,v[1]+=n*e)}function te(){let t=Ec(_,m,d),r=Math.hypot(_,1),i=Ec(r,m-Math.acos(_/r),d);Ts(i,i,t),gs(y,t[0],t[1],t[2]),_s(y,y,v),fs(n.cameraWorld,y,v,i),ls(n.orientation,n.cameraWorld),n.update(),a.updated=!1,e.fire(`transform`,a),a.updated?te():(e.getRoot().scheduleMVPUpdate(),e.renderFrame())}}Jo(Float64Array);function Ic(e,t={}){let n,r,i=t.devicePixelRatio||window.devicePixelRatio,a=t.wglContextOptions,o=e.getContext(t.version===2?`webgl2`:`webgl`,a)||e.getContext(`experimental-webgl`,a);o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT);let s=0,c=new Rs,l=!1,u=!1,d=Nc(t.inputTarget,e),f,p=new Gs,m=Xo(),h=Xo(),g=t.fov===void 0?Math.PI*45/180:t.fov,_=t.near===void 0?.01:t.near,v=t.far===void 0?1/0:t.far,y={width:window.innerWidth,height:window.innerHeight,pixelRatio:i,canvas:e,projection:m,inverseProjection:h,view:p,fov:g};R();let b=Uo({appendChild:V,getSceneCoordinate:B,getClientCoordinate:te,getTransform:M,getRoot:k,getGL:O,removeChild:oe,setViewBox:ne,setClearColor:N,getClearColor:P,clear:ae,dispose:I,renderFrame:re,getPixelRatio:w,setPixelRatio:D,updateCanvasSize:R,getCameraController:j,setCameraController:A,getDrawContext:T,getOptions:E}),x=b.on;b.on=se,c.bindScene(b);let S=(t.controls||Fc)(b),C;return F(),re(),b;function w(){return i}function T(){return y}function E(){return t}function D(e){i=e,y.pixelRatio=i,R()}function O(){return o}function k(){return c}function A(e){return S&&S.dispose(),S=e(b,y),S}function j(){return S}function M(){return c.model}function N(e,t,n,r){o.clearColor(e,t,n,r)}function P(){return o.getParameter(o.COLOR_CLEAR_VALUE)}function F(){d.addEventListener(`mousemove`,ee),C=Bs(d,z),window.addEventListener(`resize`,L,!0)}function I(){d.removeEventListener(`mousemove`,ee),C&&C(),window.removeEventListener(`resize`,L,!0),S.dispose(),c.dispose(),s&&=(cancelAnimationFrame(s),0)}function L(){R()}function R(){t.size?(n=e.width=t.size.width,r=e.height=t.size.height):(n=e.width=e.offsetWidth*i,r=e.height=e.offsetHeight*i),f=e.getBoundingClientRect(),o.viewport(0,0,n,r),y.width=n,y.height=r,c.worldTransformNeedsUpdate=!0,ds(m,g,n/r,_,v),Qo(h,m),re()}function z(e){if(l){var t=B(e.clientX,e.clientY);t&&b.fire(`click`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function ee(e){if(u){var t=B(e.clientX,e.clientY);t&&b.fire(`mousemove`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function B(e,t){e-=f.left,t-=f.top;var i=b.getPixelRatio();let a=Cs([0,0,0],[i*e/n*2-1,(1-i*t/r)*2-1,0],h);Cs(a,a,p.cameraWorld),Ts(a,a,p.position),bs(a,a);var o=(0-p.position[2])/a[2];return a[2],ys(a,p.position,a,o),a}function te(e,t,i=0){var a=$o(Xo(),m,p.matrix);$o(a,a,c.model);var o=As([0,0,0,0],[e,t,i,1],a),s=b.getPixelRatio();return{x:n*(o[0]/o[3]+1)*.5/s,y:r*(1-(o[1]/o[3]+1)*.5)/s}}function ne(e){let t=y.pixelRatio*Math.max((e.top-e.bottom)/2,(e.right-e.left)/2),{position:n,orientation:r}=y.view;n[0]=(e.left+e.right)/2,n[1]=(e.top+e.bottom)/2,n[2]=t/Math.tan(y.fov/2),Fs(r,0,0,0,1),y.view.update(),S.setViewBox&&S.setViewBox(e)}function re(e=!1){if(e)return ie();s||=requestAnimationFrame(ie)}function ie(){o.clear(o.COLOR_BUFFER_BIT),c.updateWorldTransform(),c.draw(o,y),s=0}function ae(){o.clear(o.COLOR_BUFFER_BIT)}function V(e,t=!1){c.appendChild(e,t),b.fire(`append-child`,e)}function oe(e){c.removeChild(e),b.fire(`remove-child`,e)}function se(e,t,n){return e===`click`&&(l=!0),e===`mousemove`&&(u=!0),x(e,t,n)}}var Lc={compile:Rc,link:zc,getLocations:Bc,getAttributes:Vc,getUniforms:Hc,initBuffer:Uc};function Rc(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Failed to create a shared `+n);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)||`Failed to compile shader `+n);return r}function zc(e,t,n){let r=e.createProgram();if(!r)throw Error(`Failed to link a program`);if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)||`Failed to link a program`);return r}function Bc(e,t){return{attributes:Vc(e,t),uniforms:Hc(e,t)}}function Vc(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES),i=0;i<r;++i){var a=e.getActiveAttrib(t,i);if(a){let r=a.name;n[r]=e.getAttribLocation(t,r)}}return n}function Hc(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS),i=0;i<r;++i){var a=e.getActiveUniform(t,i);if(a){let r=a.name;n[r]=e.getUniformLocation(t,r)}}return n}function Uc(e,t,n,r){var i=e.createBuffer();if(!i)throw Error(`Failed to create a buffer`);e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.vertexAttribPointer(r,n,e.FLOAT,!1,0,0),e.enableVertexAttribArray(r)}function Wc(){let e=new Map;return{get:t,set:n,remove:r};function t(t){if(!t)return;let n=e,r;for(let e=0;e<t.length;++e){let i=t[e];if(r=n.get(i),!r)return;n=r}return r}function n(t,n){let r=e;for(let e=0;e<t.length-1;++e){let n=t[e],i=r.get(n);i||(i=new Map,r.set(n,i)),r=i}r.set(t[t.length-1],n)}function r(t){let n=e;for(let e=0;e<t.length-1;++e){let r=t[e],i=n.get(r);if(!i)return;n=i}n.delete(t[t.length-1])}}var Gc=class{r;g;b;a;constructor(e,t,n,r=1){this.r=e,this.g=t,this.b=n,this.a=r===void 0?1:r}},Kc=Wc();function qc(e,t){let n=!!t.allowColors,r=[n,e],i=Kc.get(r);if(!i){let{frag:t,vert:s}=Jc(n);var a=Lc.compile(e,e.VERTEX_SHADER,s),o=Lc.compile(e,e.FRAGMENT_SHADER,t);i=Lc.link(e,a,o),Kc.set(r,i)}let s=Lc.getLocations(e,i),c=e.createBuffer(),l=t.is3D?3:2,u=(l+1)*4,d=l*4;return{draw:p,dispose:f};function f(){e.deleteBuffer(c),e.deleteProgram(i),Kc.remove(r)}function p(r){if(t.count===0)return;let a=t.buffer;e.useProgram(i),e.uniformMatrix4fv(s.uniforms.uModel,!1,t.worldModel),e.uniformMatrix4fv(s.uniforms.projectionMatrix,!1,r.projection),e.uniformMatrix4fv(s.uniforms.uView,!1,r.view.matrix);var o=t.color;e.uniform4f(s.uniforms.uColor,o.r,o.g,o.b,o.a),e.bindBuffer(e.ARRAY_BUFFER,c),t.isDirtyBuffer&&=(e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),!1),e.enableVertexAttribArray(s.attributes.aPosition),n?(e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,u,0),e.enableVertexAttribArray(s.attributes.aColor),e.vertexAttribPointer(s.attributes.aColor,4,e.UNSIGNED_BYTE,!0,u,d)):e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,4*l,0),e.drawArrays(e.LINES,0,t.count*2)}}function Jc(e){return{vert:`attribute vec3 aPosition;
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
    }`}}var Yc=Wc();function Xc(e,t){let n=Number.isFinite(t.width)&&t.width>0&&t.width!==1,r;if(n){if(r=e.getExtension(`ANGLE_instanced_arrays`),!r)return console.error(`ANGLE_instanced_arrays is not supported, thick lines are not possible`),qc(e,t)}else return qc(e,t);let i=!!t.allowColors,a=[i,e],o=Yc.get(a);if(!o){let{frag:t,vert:n}=Zc(i);var s=Lc.compile(e,e.VERTEX_SHADER,n),c=Lc.compile(e,e.FRAGMENT_SHADER,t);o=Lc.link(e,s,c),Yc.set(a,o)}let l=Lc.getLocations(e,o),u=e.createBuffer(),d=t.is3D?3:2,f=i?2*(d+1)*4:2*d*4,p=e.createBuffer(),m=new Float32Array([-.5,0,-.5,1,.5,1,-.5,0,.5,1,.5,0]);return{isThickWire:!0,draw:g,dispose:h};function h(){u&&e.deleteBuffer(u),p&&e.deleteBuffer(p),l&&(e.disableVertexAttribArray(l.attributes.aFrom),e.disableVertexAttribArray(l.attributes.aFromColor),e.disableVertexAttribArray(l.attributes.aTo),e.disableVertexAttribArray(l.attributes.aToColor),e.disableVertexAttribArray(l.attributes.aPosition)),e.deleteProgram(o),Yc.remove(a)}function g(n){if(t.count===0)return;let a=t.buffer;e.useProgram(o),e.uniformMatrix4fv(l.uniforms.uModel,!1,t.worldModel),e.uniformMatrix4fv(l.uniforms.projectionMatrix,!1,n.projection),e.uniformMatrix4fv(l.uniforms.uView,!1,n.view.matrix),e.uniform3fv(l.uniforms.uOrigin,n.view.position),e.uniform1f(l.uniforms.uWidth,t.width),e.uniform2f(l.uniforms.uResolution,n.width,n.height);var s=t.color;e.uniform4f(l.uniforms.uColor,s.r,s.g,s.b,s.a),e.bindBuffer(e.ARRAY_BUFFER,p),e.bufferData(e.ARRAY_BUFFER,m,e.STATIC_DRAW),e.enableVertexAttribArray(l.attributes.aPosition),e.vertexAttribPointer(l.attributes.aPosition,2,e.FLOAT,!1,0,0),e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,a,e.DYNAMIC_DRAW),e.enableVertexAttribArray(l.attributes.aFrom),e.vertexAttribPointer(l.attributes.aFrom,d,e.FLOAT,!1,f,0),i?(e.enableVertexAttribArray(l.attributes.aFromColor),e.vertexAttribPointer(l.attributes.aFromColor,4,e.UNSIGNED_BYTE,!0,f,d*4),e.enableVertexAttribArray(l.attributes.aTo),e.vertexAttribPointer(l.attributes.aTo,d,e.FLOAT,!1,f,(d+1)*4),e.enableVertexAttribArray(l.attributes.aToColor),e.vertexAttribPointer(l.attributes.aToColor,4,e.UNSIGNED_BYTE,!0,f,(2*d+1)*4)):(e.enableVertexAttribArray(l.attributes.aTo),e.vertexAttribPointer(l.attributes.aTo,d,e.FLOAT,!1,f,d*4)),r.vertexAttribDivisorANGLE(l.attributes.aPosition,0),r.vertexAttribDivisorANGLE(l.attributes.aTo,1),r.vertexAttribDivisorANGLE(l.attributes.aFrom,1),r.vertexAttribDivisorANGLE(l.attributes.aFromColor,1),r.vertexAttribDivisorANGLE(l.attributes.aToColor,1),r.drawArraysInstancedANGLE(e.TRIANGLES,0,6,t.count),r.vertexAttribDivisorANGLE(l.attributes.aFrom,0),r.vertexAttribDivisorANGLE(l.attributes.aTo,0),r.vertexAttribDivisorANGLE(l.attributes.aFromColor,0),r.vertexAttribDivisorANGLE(l.attributes.aToColor,0)}}function Zc(e){return{vert:`attribute vec3 aPosition, aFrom, aTo;
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
    }`}}var Qc=class{offset;_wire;update;constructor(e,t){this.offset=t,this._wire=e,this.update=e.is3D?this.update3D:this.update2D}update2D(e,t){this._wire.isDirtyBuffer=!0;var n=this._wire.positions,r=this.offset;n[r+0]=e.x,n[r+1]=e.y,r+=2;var i=this._wire.allowColors;i&&(e.color!==void 0&&(this._wire.colors[r]=e.color),r+=1),n[r+0]=t.x,n[r+1]=t.y,i&&t.color!==void 0&&(this._wire.colors[r+2]=t.color)}update3D(e,t){this._wire.isDirtyBuffer=!0;var n=this._wire.positions,r=this.offset;n[r+0]=e.x,n[r+1]=e.y,n[r+2]=e.z||0,r+=3;var i=this._wire.allowColors;i&&(e.color===void 0?this._wire.colors[r]=$c(this._wire.color):this._wire.colors[r]=e.color,r+=1),n[r+0]=t.x,n[r+1]=t.y,n[r+2]=t.z||0,i&&(t.color===void 0?this._wire.colors[r+3]=$c(this._wire.color):this._wire.colors[r+3]=t.color)}};function $c(e){let t=Math.round(e.r*255),n=Math.round(e.g*255),r=Math.round(e.b*255),i=Math.round(e.a*255);return t<<24|n<<16|r<<8|i}function el(e,t,n=.5){let r=tl(e),i=tl(t);return[r[0]*n+(1-n)*i[0],r[1]*n+(1-n)*i[1],r[2]*n+(1-n)*i[2],r[3]*n+(1-n)*i[3]]}function tl(e){return[e>>24&1,e>>16&1,e>>8&1,e&1]}var nl=class extends Rs{allowColors;is3D;itemsPerLine;capacity;count;color;width;buffer;positions;colors;isDirtyBuffer;_program;constructor(e,t){super(),this.allowColors=!t||t.allowColors===void 0||t.allowColors,this.is3D=!t||t.is3D===void 0||t.is3D,this.itemsPerLine=4,this.is3D&&(this.itemsPerLine+=2),this.allowColors&&(this.itemsPerLine+=2),this.capacity=e,this.count=0,this.color=new Gc(1,1,1,1),this.type=`WireCollection`,this._program=null,this.buffer=new ArrayBuffer(e*this.itemsPerLine*4),this.positions=new Float32Array(this.buffer),this.width=t&&t.width||1,this.colors=this.allowColors?new Uint32Array(this.buffer):null,this.isDirtyBuffer=!0}draw(e,t){this._program||=rl(this.width)?Xc(e,this):qc(e,this),this._program.draw(t)}setLineWidth(e){if(e===this.width)return;let t=rl(e);if(this.width=e,this._program&&this.scene){if(t&&this._program.isThickWire)this.scene.renderFrame();else if(this.parent){let e=this.parent;e.removeChild(this),this.dispose(),e.appendChild(this)}}}add(e){if(!e)throw Error(`Line is required`);this.count>=this.capacity&&this._extendArray();var t=this.count*this.itemsPerLine;let n=new Qc(this,t);return n.update(e.from,e.to),this.count+=1,n}getLineColor(e,t){return this.allowColors&&e&&e.color&&t&&t.color?el(e.color,t.color):[this.color.r,this.color.g,this.color.b,this.color.a]}forEachLine(e){let{positions:t,count:n,itemsPerLine:r}=this,i=n*r;if(this.is3D)for(let n=0;n<i;n+=r){let r={x:t[n],y:t[n+1],z:t[n+2]},i=n+3;this.colors&&(r.color=this.colors[n+3],i+=1);let a={x:t[i],y:t[i+1],z:t[i+2]};this.colors&&(a.color=this.colors[i+3]),e(r,a)}else for(let n=0;n<i;n+=r){let r={x:t[n],y:t[n+1],z:0},i=n+2;this.colors&&(r.color=this.colors[n+2],i+=1);let a={x:t[i],y:t[i+1],z:0};this.colors&&(a.color=this.colors[i+2]),e(r,a)}}dispose(){this._program&&=null}_extendArray(){var e=new ArrayBuffer(this.buffer.byteLength*2),t=new Float32Array(e);this.positions&&t.set(this.positions),this.buffer=e,this.positions=t,this.allowColors&&(this.colors=new Uint32Array(e)),this.capacity*=2}};function rl(e){return e!==void 0&&e!==1&&e>0}function il(e){try{return window.WebGLRenderingContext?(e||=document.createElement(`canvas`),!!(e.getContext(`webgl`)||e.getContext(`experimental-webgl`))):!1}catch{return!1}}function al(e,t={}){e.getCameraController();let n={redraw:Function.prototype,dispose:Function.prototype},r=t.lineColor||196194594,i=t.maxAlpha||255,a=l(r),o=u(t.cursorColor||4294967295);return e.on(`transform`,c),{dispose:s,update:c};function s(){e.off(`transform`,c),a.dispose(),o.dispose()}function c(){a.redraw(),o.redraw()}function l(r){if(t.showGrid===!1)return n;let a=new nl(130,{width:2.5,is3D:!0,allowColors:!0});a.svgInvisible=!0;let o=new nl(130,{width:1.5,is3D:!0,allowColors:!0});o.svgInvisible=!0;let s=e.getDrawContext(),c=s.view.center;return d(),e.appendChild(o),e.appendChild(a),{redraw:d,dispose:l};function l(){e.removeChild(o),e.removeChild(a)}function u(e){return 1-(e-Math.floor(e))}function d(){let t=e.getDrawContext().view.position,n=t[0]-c[0],r=t[1]-c[1],l=t[2]-c[2],d=Math.sqrt(n*n+r*r+l*l)*Math.tan(s.fov/2),p=Math.log10(d),m=10**Math.floor(p),h=u(p),g=Math.round(h*i),_=Math.floor(c[0]/m)*m-Math.floor(64*m/2),v=Math.floor(c[1]/m)*m-Math.floor(64*m/2),y=_+m*64,b=v+m*64;f(o,_,v,y,b,m,g),f(a,_,v,y,b,m*10,i-g)}function f(e,t,n,i,a,o,s){e.model[14]=c[2],e.worldTransformNeedsUpdate=!0,e.count=0;let l=r&4294967040|s,u=Math.ceil(n/o)*o;for(let n=u;n<=a;n+=o)e.add({from:{x:t,y:n,color:l},to:{x:i,y:n,color:l}});let d=Math.ceil(t/o)*o;for(let t=d;t<=i;t+=o)e.add({from:{x:t,y:n,color:l},to:{x:t,y:a,color:l}})}}function u(r){if(t.showCursor===!1)return n;let i=e.getDrawContext().view.center,a=e.getDrawContext().view.position,o=new nl(361,{width:3,is3D:!0,allowColors:!0});o.svgInvisible=!0;let s,c=[];for(let e=0;e<=360;++e)c.push(o.add({from:{x:0,y:0,color:r},to:{x:e,y:e,color:r}}));return e.appendChild(o),u(),{redraw:u,dispose:l};function l(){e.removeChild(o)}function u(){let e=a[0]-i[0],t=a[1]-i[1],n=a[2]-i[2],l=Math.sqrt(e*e+t*t+n*n);l*=.025;for(let e=0;e<=361;++e){let t=e/360*2*Math.PI;if(e===0){s={x:l*Math.cos(t),y:l*Math.sin(t),color:r};continue}let n={x:l*Math.cos(t),y:l*Math.sin(t),color:r};c[e-1].update(s,n),s=n}o.model[12]=i[0],o.model[13]=i[1],o.model[14]=i[2],o.worldTransformNeedsUpdate=!0}}}var ol={mat4:`uniformMatrix4fv`,mat3:`uniformMatrix3fv`,mat2:`uniformMatrix2fv`,vec4:`uniform4fv`,vec3:`uniform3fv`,vec2:`uniform2fv`,float:`uniform1f`,bool:`uniform1i`,int:`uniform1i`},sl=class{name;functionName;location;constructor(e,t){let n=ol[t];if(!n)throw Error(`Function name for uniform is required`);this.name=e,this.functionName=n,this.location=`${this.name}UniformLocation`}getInitBlockForDraw(){return`let ${this.location} = gl.getUniformLocation(program, '${this.name}');`}getDraw(){return this.functionName.indexOf(`Matrix`)>-1?`gl.${this.functionName}(${this.location}, false, uniforms.${this.name});`:`gl.${this.functionName}(${this.location}, uniforms.${this.name});`}},cl=class{name;offset;variableName;ready;location;isTexture;constructor(e,t=0){this.name=e,this.offset=t,this.variableName=`${e}Texture`,this.ready=`${this.variableName}Ready`,this.location=`${this.name}UniformLocation`,this.isTexture=!0}getInitBlockForDraw(){return`
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
`}},ll=class{type;debug;bufferViewType;count;name;bytePerElement;constructor(){this.type=`gl.FLOAT`,this.debug=!1,this.bufferViewType=`Float32Array`,this.count=1,this.name=void 0,this.bytePerElement=4}setName(e){this.name=e}getInitBlockForBuffer(e){return this.ensureNameIsSet(),`${e?`let `:``}${this.name}Array = new ${this.bufferViewType}(buffer);`}getInitBlockForDraw(){this.ensureNameIsSet();let{name:e}=this;return`let ${e}AttributeLocation = gl.getAttribLocation(program, '${e}');`}getAddBlock(e,t){throw Error(`Concrete types have to implement this`)}getMoveBlock(e,t){throw Error("Concrete type have to implement `getMoveBlock`")}getGetBlock(e){throw Error("Concrete types have to implement `getGetBlock`")}getDivisor(e){this.ensureNameIsSet();let t=`${this.name}AttributeLocation`;return`if (${t} > -1) gle.vertexAttribDivisorANGLE(${t}, ${e});`}getDraw(e,t){this.ensureNameIsSet();let n=`${this.name}AttributeLocation`;return`
    gl.enableVertexAttribArray(${n});
    gl.vertexAttribPointer(${n}, ${this.count}, ${this.type}, false, ${e}, ${t});`}ensureNameIsSet(){if(!this.name)throw Error(`You have to call setName() before using attributes`)}},ul=class extends ll{constructor(e){super(),this.count=e}getAddBlock(e,t=`
`){let n=this.name,r=`${n}Array`,i=[];this.debug&&i.push(`if (item.${n} === undefined) throw new Error('Attribute "${n}" is missing');\n`);for(let t=0;t<this.count;++t){let a=`item.${n}[${t}]`;this.debug&&i.push(`if (${a} === undefined) throw new Error('Attribute "${n}" is missing value at index ${t}');\n`),i.push(`${r}[index + ${e+t}] = ${a};`)}return{code:i.join(t),offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=[];for(let t=0;t<this.count;++t)r.push(`${n}[to + ${e+t}] = ${n}[from + ${e+t}];`);return r.join(t)}getGetBlock(e){let t=`${this.name}Array`,n=[];for(let r=0;r<this.count;++r)n.push(`${t}[index + ${e+r}]`);return`${this.name}: [${n.join(`, `)}]`}},dl=class extends ll{getAddBlock(e){let t=this.name,n=`${t}Array`,r=``;return this.debug&&(r=`if (item.${t} === undefined) throw new Error('Attribute "${t}" is missing');`),r+=`${n}[index + ${e}] = item.${t};`,{code:r,offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=``;return r+=`${n}[to + ${e}] = ${n}[from + ${e}];${t}`,r}getGetBlock(e){return`${this.name}: ${this.name}Array[index + ${e}]`}},fl={vec4:()=>new ul(4),vec3:()=>new ul(3),vec2:()=>new ul(2),float:()=>new dl};function pl(e,t){let n=[],r=[],i=ml(e.vertex,e.fragment,t);i.attributes.forEach(t=>{let{name:i,type:a}=t,o=e.attributes&&e.attributes[i];if(!o&&typeof fl[a]==`function`&&(o=fl[a]()),!o)throw console.error(`Unknown type ${a} for ${i}`),Error(`Unknown type ${a} for ${i}`);o.debug=e&&e.debug||!1,o.setName(i);let s=e.instanced&&e.instanced[i];s?(s.setTypeDefinition(o),r.push(s)):n.push(o)});let a=[],o=0;i.uniforms.forEach(e=>{let t=e.name;e.type===`sampler2D`?a.push(new cl(t,o++)):a.push(new sl(t,e.type))});let s=0,c=0;if(n.forEach(e=>{c+=e.count,s+=e.count*e.bytePerElement}),e.attributeLayout){let t=new Map;e.attributeLayout.forEach((e,n)=>t.set(e,n)),n.sort((e,n)=>t.get(e.name)-t.get(n.name))}return{bytePerVertex:s,itemPerVertex:c,attributes:n,instanced:r,uniforms:a}}function ml(e,t,n){let r=n?/in\s+(.+);/:/attribute\s+(.+);/,i=/uniform\s+(.+);/,a=[],o=[];return e.split(`
`).forEach(e=>{let t=e.match(r);if(t&&!e.trim().startsWith(`//`)){s(t[1],a);return}let n=e.match(i);n&&!e.trim().startsWith(`//`)&&s(n[1],o)}),t.split(`
`).forEach(e=>{let t=e.match(i);t&&s(t[1],o)}),{attributes:a,uniforms:o};function s(e,t){let n=e.replace(/,/g,` `).split(` `).filter(e=>e),r=n[0];for(let e=1;e<n.length;++e){let i=n[e];t.find(e=>e.name===i)||t.push({type:r,name:i})}}}var hl=class{api;init;bufferInit;implementation;attributesDrawBlock;constructor(){this.api=[],this.init=[],this.implementation=[],this.bufferInit=[]}addToInit(e){e&&this.init.push(e)}addBufferInit(e){e&&this.bufferInit.push(e)}addToAPI(e){e&&this.api.push(e)}addToImplementation(e){e&&this.implementation.push(e)}setAttributesDrawBlock(e){this.attributesDrawBlock=e}link(){let e=[];return this.init.forEach(t),t(`  return {`),this.api.forEach(t),t(`  };`),this.implementation.forEach(t),e.join(`
`);function t(t){Array.isArray(t)?e.push(t.join(`
    `)):e.push(t)}}};function gl(e){let t=e.gl,n=pl(e,typeof WebGL2RenderingContext<`u`&&t instanceof WebGL2RenderingContext),r=v(e.vertex,e.fragment),i=e.preDrawHook||_l,a=e.postDrawHook||_l,o=l(n),s=o.link(),c=Function(`gl`,`program`,s)(t,r);return e.debug&&(console.log(`Compiled code: `),console.log(s)),c.getCode=()=>o,c.dispose=()=>{t.deleteProgram(r)},c;function l(t){let n=new hl;return m(t,n),e.sourceBuffer?u(t,n):(h(t,n),d(t,n)),f(t,n),p(t,n),n}function u(e,t){t.addToInit([`let glBuffer;`,``]),t.addToAPI([`setGLBuffer: (newBuffer) => glBuffer = newBuffer,`])}function d(e,t){t.addToInit([`let glBuffer = gl.createBuffer();`,`if (!glBuffer) throw new Error('failed to create a WebGL buffer');`,``]),t.addToAPI([`getGLBuffer: () => glBuffer,`])}function f(e,t){let{uniforms:n}=e,r=[];if(n.forEach(e=>{e instanceof cl&&r.push(e)}),!r.length)return;t.addToAPI(`setTextureCanvas: setTextureCanvas,`);let i=r.map(e=>`
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
`)}function p(t,n){let{attributes:r,instanced:o,uniforms:s,bytePerVertex:c,itemPerVertex:l}=t,u=e.sourceBuffer&&e.sourceBuffer.getCode();u?(n.addToInit(u.bufferInit),n.addBufferInit(u.bufferInit)):r.forEach(e=>{let t=`  `+e.getInitBlockForDraw();n.addToInit(t),n.addBufferInit(t)});let d=[];s.forEach(e=>{n.addToInit(`  `+e.getInitBlockForDraw()),e instanceof cl&&d.push(e)}),o.length&&(n.addToInit(`  let gle = gl.getExtension('ANGLE_instanced_arrays');
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
`:``}function v(e,n){let r=y(t.VERTEX_SHADER,e),i=y(t.FRAGMENT_SHADER,n),a=t.createProgram();if(!a)throw Error(`Failed to link a program`);if(t.attachShader(a,r),t.attachShader(a,i),t.linkProgram(a),!t.getProgramParameter(a,t.LINK_STATUS))throw Error(t.getProgramInfoLog(a)||`Failed to link a program`);return a}function y(e,n){let r=t.createShader(e);if(!r)throw Error(`Failed to create a shared `+n);if(t.shaderSource(r,n),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw console.error(t.getShaderInfoLog(r)),Error(t.getShaderInfoLog(r)||`Failed to compile shader `+n);return r}}function _l(){return``}var vl=class extends ll{constructor(){super(),this.type=`gl.UNSIGNED_BYTE`,this.bufferViewType=`Uint32Array`}getAddBlock(e){let t=`${this.name}Array`,n=``;return this.debug&&(n=`if (item.${this.name} === undefined) throw new Error('Attribute "${this.name}" is missing');\n`),n+=`${t}[index + ${e}] = item.${this.name};`,{code:n,offset:e+this.count}}getMoveBlock(e,t=`
`){let n=`${this.name}Array`,r=``;return r+=`${n}[to + ${e}] = ${n}[from + ${e}];${t}`,r}getGetBlock(e){return`${this.name}: ${this.name}Array[index + ${e}]`}getDraw(e,t){let n=`${this.name}AttributeLocation`;return`
    if (${n} > -1) {
      gl.enableVertexAttribArray(${n});
      gl.vertexAttribPointer(${n}, 4, ${this.type}, true, ${e}, ${t});
    }`}},yl=class{bufferValues;typeDef;constructor(e){this.bufferValues=e,this.typeDef=void 0}setTypeDefinition(e){this.typeDef=e}getInitBlock(){let{name:e}=this.typeDef;return`
  const ${e}InstancedBuffer = gl.createBuffer();
  if (!${e}InstancedBuffer) throw new Error('failed to create a WebGL buffer');
  const ${e}InstancedBufferValues = new Float32Array([${this.bufferValues.join(`,`)}]);
  let ${e}AttributeLocation = gl.getAttribLocation(program, '${e}');
`}getDivisor(e){return this.typeDef.getDivisor(e)}getDraw(){let{typeDef:e}=this,t=e.name;return`
  gl.bindBuffer(gl.ARRAY_BUFFER, ${t}InstancedBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, ${t}InstancedBufferValues, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(${t}AttributeLocation);
  gl.vertexAttribPointer(${t}AttributeLocation, ${e.count}, gl.FLOAT, false, 0, 0);
`}},bl=class extends Rs{uniforms;program;constructor(e){super(),this.program=e,this.uniforms=void 0}getBuffer(){return this.program.getBuffer()}appendBuffer(e,t){this.program.appendBuffer(e,t),this.scene&&this.scene.renderFrame()}add(e){return this.program.add(e)}update(e,t){this.program.update(e,t)}remove(e){return this.program.remove(e)}get(e){return this.program.get(e)}draw(e,t){this.uniforms||={projectionMatrix:t.projection,model:this.worldModel,view:t.view.matrix,modelViewProjection:this.modelViewProjection},this.program.draw(this.uniforms)}dispose(){super.dispose(),this.program&&this.program.dispose()}},xl=class extends bl{constructor(e,t={}){let n=gl({gl:e,vertex:`
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
    }`,attributes:{color:new vl},instanced:{point:new yl([-.5,0,-.5,1,.5,1,-.5,0,.5,1,.5,0])}});super(n),this.width=t.width||2}draw(e,t){this.uniforms||={modelViewProjection:this.modelViewProjection,width:this.width,resolution:[t.width,t.height]},this.uniforms.resolution[0]=t.width,this.uniforms.resolution[1]=t.height,this.program.draw(this.uniforms)}forEachLine(e){let t=this.program.getCount();for(let n=0;n<t;++n){let t=this.program.get(n);e({x:t.from[0],y:t.from[1],z:t.from[2],color:t.color},{x:t.to[0],y:t.to[1],z:t.to[2],color:t.color})}}getLineColor(e){let t=this.program.getCount(),n=e?e.color:t>0?this.program.get(0).color:4294967295;return[n>>24&1,n>>16&1,n>>8&1,(n|0)&1]}},Sl=class extends bl{constructor(e){let t=gl({gl:e,vertex:`
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
  }`,attributes:{color:new vl},instanced:{point:new yl([-.5,-.5,-.5,.5,.5,.5,.5,.5,.5,-.5,-.5,-.5])},preDrawHook(){return`gl.enable(gl.DEPTH_TEST);
        gl.depthFunc(gl.LEQUAL);`},postDrawHook(){return`gl.disable(gl.DEPTH_TEST);`}});super(t)}};function Cl(e){Tl(e);let t=wl(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e}function wl(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function Tl(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}var El=Cl({}),Dl=o(((e,t)=>{t.exports=class e{constructor(e,t){this._rows=e,this._columns=t,this._matrix=new Float64Array(e*t),this._n=e*t}set(e,t,n){let r=e*this._columns+t;if(r>=this._n)throw Error(`Index out of range `+e+`,`+t);this._matrix[r]=n}get(e,t){let n=e*this._columns+t;if(n>=this._n)throw Error(`Index out of range `+e+`,`+t);return this._matrix[n]}centerMatrix(){if(this.isCentered)return this;for(let e=0;e<this._rows;++e){let t=this.getMean(e);this.translateRow(e,-t)}return this.isCentered=!0,this}translateRow(e,t){if(e<0||e>this._rows)throw Error(`Row is out of range `+e);let n=e*this._columns;for(let e=0;e<this._columns;++e)this._matrix[e+n]+=t}getMean(e){let t=0;if(e<0||e>this._rows)throw Error(`Row is out of range `+e);let n=e*this._columns;for(let e=0;e<this._columns;++e)t+=this._matrix[e+n];return t/this._columns}applyVectorToColumn(e,t){let n=0;if(t.length!==this._rows)throw Error(`Invalid vector dimensions`);for(let r=0;r<this._rows;++r)n+=this._matrix[r*this._columns+e]*t[r];return n}print(){let e=[];for(let t=0;t<this._rows;++t){let n=[],r=t*this._columns;for(let e=0;e<this._columns;++e)n.push(this._matrix[r+e].toFixed(2));e.push(n.join(` `))}console.log(e.join(`
`))}toArray(){let e=[];for(let t=0;t<this._rows;++t){let n=[],r=t*this._columns;for(let e=0;e<this._columns;++e)n.push(this._matrix[r+e]);e.push(n)}return e}columnDistance(e,t){let n=0;for(let r=0;r<this._rows;++r){let i=this.get(r,e)-this.get(r,t);n+=i*i}return Math.sqrt(n)}getCovariant(){let t=new e(this._rows,this._rows);for(let e=0;e<this._rows;++e)for(let n=0;n<this._rows;++n){let r=0,i=e*this._columns,a=n*this._columns;for(let e=0;e<this._columns;++e)r+=this._matrix[i+e]*this._matrix[a+e];t.set(n,e,r)}return t}}})),Ol=o(((e,t)=>{t.exports=n,t.exports.random=n,t.exports.randomIterator=l;function n(e){return new r(typeof e==`number`?e:+new Date)}function r(e){this.seed=e}r.prototype.next=c,r.prototype.nextDouble=s,r.prototype.uniform=s,r.prototype.gaussian=i,r.prototype.random=s;function i(){var e,t,n;do t=this.nextDouble()*2-1,n=this.nextDouble()*2-1,e=t*t+n*n;while(e>=1||e===0);return t*Math.sqrt(-2*Math.log(e)/e)}r.prototype.levy=a;function a(){var e=3/2,t=(o(1+e)*Math.sin(Math.PI*e/2)/(o((1+e)/2)*e*2**((e-1)/2)))**(1/e);return this.gaussian()*t/Math.abs(this.gaussian())**(1/e)}function o(e){return Math.sqrt(2*Math.PI/e)*(1/Math.E*(e+1/(12*e-1/(10*e))))**e}function s(){var e=this.seed;return e=e+2127912214+(e<<12)|0,e=e^3345072700^e>>>19,e=e+374761393+(e<<5)|0,e=e+3550635116^e<<9,e=e+4251993797+(e<<3)|0,e=e^3042594569^e>>>16,this.seed=e,(e&268435455)/268435456}function c(e){return Math.floor(this.nextDouble()*e)}function l(e,t){var r=t||n();if(typeof r.next!=`function`)throw Error(`customRandom does not match expected API: next() function is missing`);return{forEach:a,shuffle:i};function i(){for(var t=e.length-1,n,i;t>0;--t)n=r.next(t+1),i=e[n],e[n]=e[t],e[t]=i;return e}function a(t){for(var n=e.length-1,i,a;n>0;--n)i=r.next(n+1),a=e[i],e[i]=e[n],e[n]=a,t(a);e.length&&t(e[0])}}})),kl=o(((e,t)=>{var n=Ol();t.exports=function(e,t,s=1e-40,c=1e4,l=42){if(t>e.length)throw Error(`Matrix ain't that big`);let u=n(l),d=[],f=(1-s)*(1-s);for(let n=0;n<t;++n){let t=p(e.length);r(t);let s=0,l;for(;s<f;){l=t;for(let e=0;e<n;++e){let t=d[e],n=o(l,t);for(let e=0;e<l.length;++e)l[e]=l[e]-n*t[e]}t=a(e,l);let r=o(t,t);if(r===0&&(t=l,r=o(t,t)),i(t,Math.sqrt(r)),s=o(t,l),s*=s,--c,c<0)break}d.push(t)}return d;function p(e){return Array(e).fill(1).map(()=>u.nextDouble())}};function r(e){let t=Math.sqrt(o(e,e));for(let n=0;n<e.length;++n)e[n]/=t;return e}function i(e,t){for(let n=0;n<e.length;++n)e[n]/=t;return e}function a(e,t){if(e.length!==t.length)throw Error(`Matrix * Vector dimension mismatch`);let n=[];for(let r=0;r<e.length;++r){let i=0;for(let n=0;n<e.length;++n)i+=e[r][n]*t[n];n[r]=i}return n}function o(e,t){let n=0;if(e.length!==t.length)throw Error(`Vector length mismatch`);for(let r=0;r<e.length;++r)n+=e[r]*t[r];return n}}));o(((e,t)=>{var n=Dl(),r=kl();t.exports=function(e,t={}){let i=Number.isFinite(t.pivotCount)&&t.pivotCount>0?t.pivotCount:50,a=Number.isFinite(t.dimensions)&&t.dimensions>0?t.dimensions:2,o=new Map,s=[];e.forEachNode(e=>{let t=s.length;o.set(e.id,t),s.push(e.id)}),i=Math.min(i,s.length),a=Math.min(a,i);let{matrix:c,pivotNodes:l}=m(s[0]),u=h(c,a);return{getNodePosition:d,getPivotNodes:f,getLayoutDimensionsCount:p};function d(e){let t=o.get(e);return u.map(e=>c.applyVectorToColumn(t,e))}function f(){return l}function p(){return a}function m(t){let r=Array(s.length).fill(1/0),a=new n(i,s.length),c=[];for(let e=0;e<i;++e){c.push(t),l(a,e,t);let n=r.reduce((e,t,n,r)=>t>r[e]?n:e,0);t=s[n]}return{matrix:a,pivotNodes:c};function l(t,n,i){let a=[{node:i,d:0}],c=new Set([i]);for(;a.length;){let i=a.shift(),s=o.get(i.node);t.set(n,s,i.d),r[s]=Math.min(r[s],i.d),e.forEachLinkedNode(i.node,e=>{c.has(e.id)||(a.push({node:e.id,d:i.d+1}),c.add(e.id))})}if(c.size!==s.length)throw Error(`Graph has disconnected component. Please use ngraph.hde once per individual component`)}}function h(e,t){return r(e.centerMatrix().getCovariant().toArray(),t)}}}))();var Al=Object.getOwnPropertyNames,jl=(e,t)=>function(){try{return t||(0,e[Al(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}},Ml=jl({"lib/codeGenerators/getVariableName.js"(e,t){t.exports=function(e){return e===0?`x`:e===1?`y`:e===2?`z`:`c`+(e+1)}}}),Nl=jl({"lib/codeGenerators/createPatternBuilder.js"(e,t){var n=Ml();t.exports=function(e){return t;function t(t,r){let i=r&&r.indent||0,a=r&&r.join!==void 0?r.join:`
`,o=Array(i+1).join(` `),s=[];for(let r=0;r<e;++r){let e=n(r),i=r===0?``:o;s.push(i+t.replace(/{var}/g,e).replace(/{k}/g,String(r)).replace(/{\+k}/g,r===0?``:` + `+r))}return s.join(a)}}}}),Pl=jl({"lib/initColumnStore.js"(e,t){t.exports=c;function n(){}n.prototype=Object.create(null);function r(){this.any=!1,this.pos=!1,this.velocity=!1,this.mass=!1,this.pinned=!1,this.length=!1,this.coefficient=!1}var i=[`pos`,`velocity`,`mass`,`pinned`,`length`,`coefficient`],a=typeof Symbol==`function`?Symbol(`versions`):`$versions`;function o(){var e=this.writes,t=this[a];if(!e.any)return t;e.any=!1;for(var n=0;n<i.length;++n){var r=i[n];e[r]&&(e[r]=!1,t[r]=++this.versionClock)}return t}var s={Float64Array:`f64`,Float32Array:`f32`,Int32Array:`i32`,Uint32Array:`u32`,Int16Array:`i16`,Uint16Array:`u16`,Int8Array:`i8`,Uint8Array:`u8`,Uint8ClampedArray:`u8`};function c(e,t){var i=[],c=[],l=0,u=0;e.n=0,e.capacity=0,e.add=b,e.removeRows=x,e.define=f,e.has=m,e.get=h,e.remove=g,e.names=_,e.sizeOf=y,e.copyTo=S,e.typeOf=v;var d=e[a]=new n;return e.writes=new r,e.versionClock=0,Object.defineProperty(e,"versions",{get:o,enumerable:!0}),e.columnsVersion=0,e.changed=p,e.lockBuiltIns=function(){u=i.length},e.reserve=function(t){t>e.capacity&&C(t)},e.onResize=null,t&&C(t),e;function f(t,n,r,a){if(m(t))throw Error(`Column `+t+` is already defined`);var o={name:t,ArrayType:n||Float64Array,size:r||1,initial:a||0,array:null};return o.array=new o.ArrayType(e.capacity*o.size),o.initial&&o.array.fill(o.initial),i.push(o),o.initial!==0&&c.push(o),e[t]=o.array,e.columnsVersion+=1,p(t),o.array}function p(t){if(t!==void 0)d[t]=++e.versionClock;else for(var n=0;n<i.length;++n)d[i[n].name]=++e.versionClock}function m(e){return i.some(function(t){return t.name===e})}function h(e){for(var t=0;t<i.length;++t)if(i[t].name===e)return i[t].array}function g(t){for(var n=u;n<i.length;++n)if(i[n].name===t){var r=c.indexOf(i[n]);return r>=0&&c.splice(r,1),i.splice(n,1),e[t]=void 0,p(t),e.columnsVersion+=1,!0}return!1}function _(){return i.map(function(e){return e.name})}function v(e){for(var t=0;t<i.length;++t)if(i[t].name===e)return s[i[t].ArrayType.name]||i[t].ArrayType.name}function y(e){for(var t=0;t<i.length;++t)if(i[t].name===e)return i[t].size}function b(){e.n===e.capacity&&C(Math.max(16,e.capacity*2));var t=e.n++,n=t<l;n||(l=t+1);for(var r=n?i:c,a=0;a<r.length;++a)for(var o=r[a],s=o.size,u=o.array,d=t*s,f=0;f<s;++f)u[d+f]=o.initial;return t}function x(t){var n=t.length;if(n!==0){for(var r=e.n,a=0;a<i.length;++a)for(var o=i[a],s=o.size,c=o.array,l=t[0],u=0;u<n;++u){var d=t[u]+1,f=u+1<n?t[u+1]:r;f>d&&(c.copyWithin(l*s,d*s,f*s),l+=f-d)}e.n=r-n}}function S(e,t,n){for(var r=0;r<i.length;++r){var a=i[r],o=t.get(a.name);if(o)for(var s=a.size,c=0;c<s;++c)o[n*s+c]=a.array[e*s+c]}}function C(t){for(var n=0;n<i.length;++n){var r=i[n],a=new r.ArrayType(t*r.size);a.set(r.array.subarray(0,Math.min(r.array.length,e.n*r.size))),r.initial&&a.fill(r.initial,e.n*r.size),r.array=a,e[r.name]=a}e.capacity=t,e.onResize&&e.onResize()}}}}),Fl=jl({"lib/createBodyStore.js"(e,t){t.exports=i,t.exports.createSingleBodyStore=a,t.exports.copyBody=o,t.exports.builtInColumns=r;var n=Pl();function r(e){return[[`pos`,Float64Array,e],[`velocity`,Float64Array,e],[`force`,Float64Array,e],[`mass`,Float64Array,1,1],[`pinned`,Uint8Array,1],[`springCount`,Float64Array,1],[`springLength`,Float64Array,1],[`degree`,Float64Array,1]]}function i(e,t){var i={D:e,n:0,capacity:0,pos:null,velocity:null,force:null,mass:null,pinned:null,springCount:null,springLength:null,degree:null,add:null,removeRows:null,define:null,has:null,get:null,remove:null,names:null,sizeOf:null,copyTo:null,lockBuiltIns:null,reserve:null,onResize:null,typeOf:null,versionClock:0,writes:null,columnsVersion:0,changed:null};return n(i),r(e).forEach(function(e){i.define(e[0],e[1],e[2],e[3])}),i.lockBuiltIns(),t&&i.reserve(t),i}function a(e){var t={D:e,n:1};return r(e).forEach(function(e){var n=new e[1](e[2]);e[3]&&n.fill(e[3]),t[e[0]]=n}),t}function o(e,t,n,r){for(var i=e.D,a=0;a<i;++a)n.pos[r*i+a]=e.pos[t*i+a],n.velocity[r*i+a]=e.velocity[t*i+a],n.force[r*i+a]=e.force[t*i+a];n.mass[r]=e.mass[t],n.pinned[r]=e.pinned[t],n.springCount[r]=e.springCount[t],n.springLength[r]=e.springLength[t],n.degree[r]=e.degree[t]}}}),Il=jl({"lib/codeGenerators/generateCreateBody.js"(e,t){var n=Nl(),r=Ml(),i=Fl().createSingleBodyStore;t.exports=a,t.exports.generateCreateBodyFunctionBody=o,t.exports.getVectorCode=u,t.exports.getBodyCode=s;function a(e,t){let n=o(e,t),{Body:r}=Function(`createSingleBodyStore`,n)(i);return r}function o(e,t){return`
${u(e,t)}
${s(e,t)}
return {Body: Body, Vector: Vector};
`}function s(e,t){let i=n(e),a=i(`{var}`,{join:`, `}),o=[];for(let t=0;t<e;++t)o.push(t);let s=(e,t)=>o.map(e).join(t===void 0?`
`:t);return`
${l(`PositionView`,`pos`,e,t)}
${l(`ForceView`,`force`,e,t)}
${l(`VelocityView`,`velocity`,e,t)}

function Body(${a}, store, index) {
  if (store === undefined) {
    // Not in a simulator yet: keep the numbers in a store of its own
    store = createSingleBodyStore(${e});
    index = 0;
    if (typeof ${r(0)} === 'object') {
      let v = ${r(0)};
      ${i(`if (!Number.isFinite(v.{var})) throw new Error("Expected value is not a finite number at Vector constructor ({var})");`,{indent:6})}
      ${s(e=>`store.pos[${e}] = v.${r(e)};`,`
      `)}
    } else {
      ${s(e=>`store.pos[${e}] = typeof ${r(e)} === "number" ? ${r(e)} : 0;`,`
      `)}
    }
  }
  this.store = store;
  this.index = index;
  // the store's flags for writes from outside the simulator (see initColumnStore.js)
  this.writes = store.writes || null;
  this.pos = new PositionView(store, index * ${e});
  this.force = new ForceView(store, index * ${e});
  this.velocity = new VelocityView(store, index * ${e});
}

/**
 * Makes a body for slot \`index\` of \`store\`, keeping the numbers that are already there.
 */
Body.inStore = function (store, index) {
  return new Body(${o.map(()=>`undefined`).join(`, `)}, store, index);
};

Object.defineProperties(Body.prototype, {
  mass: {
    get: function () { return this.store.mass[this.index]; },
    set: function (value) {
      this.store.mass[this.index] = value;
      ${c(`this`,`mass`)}
    },
    enumerable: true
  },
  isPinned: {
    get: function () { return this.store.pinned[this.index] === 1; },
    set: function (value) {
      this.store.pinned[this.index] = value ? 1 : 0;
      ${c(`this`,`pinned`)}
    },
    enumerable: true
  },
  springCount: {
    get: function () { return this.store.springCount[this.index]; },
    set: function (value) { this.store.springCount[this.index] = value; },
    enumerable: true
  },
  springLength: {
    get: function () { return this.store.springLength[this.index]; },
    set: function (value) { this.store.springLength[this.index] = value; },
    enumerable: true
  },
  degree: {
    get: function () { return this.store.degree[this.index]; },
    enumerable: true
  }
});

/**
 * Points this body (and its vectors) to slot \`index\` of \`store\`. The numbers are not copied.
 */
Body.prototype.moveTo = function (store, index) {
  var offset = index * ${e};
  this.store = store;
  this.index = index;
  this.writes = this.pos.writes = this.force.writes = this.velocity.writes = store.writes || null;
  this.pos.store = this.force.store = this.velocity.store = store;
  this.pos.offset = this.force.offset = this.velocity.offset = offset;
  this.pos.array = store.pos;
  this.force.array = store.force;
  this.velocity.array = store.velocity;
};

Body.prototype.reset = function() {
  var force = this.store.force, offset = this.index * ${e};
  ${s(e=>`force[offset${e?` + `+e:``}] = 0;`,` `)}
  this.store.springCount[this.index] = 0;
  this.store.springLength[this.index] = 0;
};

Body.prototype.setPosition = function (${a}) {
  var pos = this.store.pos, offset = this.index * ${e};
  ${s(e=>`pos[offset${e?` + `+e:``}] = ${r(e)} || 0;`,`
  `)}
  ${c(`this`,`pos`)}
};

Body.prototype.toJSON = function () {
  return {
    isPinned: this.isPinned,
    pos: this.pos.toJSON(),
    force: this.force.toJSON(),
    velocity: this.velocity.toJSON(),
    mass: this.mass,
    springCount: this.springCount,
    springLength: this.springLength
  };
};
// console.log() in node shows the numbers, not the store behind them
Body.prototype[Symbol.for('nodejs.util.inspect.custom')] = Body.prototype.toJSON;`}function c(e,t){return`var writes = ${e}.writes; if (writes !== null) { writes.${t} = true; writes.any = true; }`}function l(e,t,n,i){let a=[];for(let e=0;e<n;++e)a.push(e);let o=e=>`this.offset${e?` + `+e:``}`,s=e=>i?`if (!Number.isFinite(value)) throw new Error('Cannot set non-numbers to ${e}'); `:``,l=t===`force`?``:` `+c(`this`,t);return`
function ${e}(store, offset) {
  this.store = store;
  this.offset = offset;
  // The store's current array; Body.moveTo() updates it when the store grows
  this.array = store.${t};
  this.writes = store.writes || null;
}
Object.defineProperties(${e}.prototype, {
${a.map(e=>`  ${r(e)}: {
    get: function () { return this.array[${o(e)}]; },
    set: function (value) { ${s(r(e))}this.array[${o(e)}] = value;${l} },
    enumerable: true
  }`).join(`,
`)}
});
${e}.prototype.reset = function () {
  var array = this.array;
  ${a.map(e=>`array[${o(e)}] = 0;`).join(` `)}${l?`
 `+l:``}
};
${e}.prototype.toJSON = function () {
  return { ${a.map(e=>`${r(e)}: this.array[${o(e)}]`).join(`, `)} };
};
${e}.prototype[Symbol.for('nodejs.util.inspect.custom')] = ${e}.prototype.toJSON;`}function u(e,t){let r=n(e),i=``;return t&&(i=`${r(`
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
  };`}}}),Ll=jl({"lib/codeGenerators/generateQuadTree.js"(e,t){var n=Nl(),r=Ml();t.exports=i,t.exports.generateQuadTreeFunctionBody=a,t.exports.getInsertStackCode=f,t.exports.getQuadNodeCode=d,t.exports.isSamePosition=c,t.exports.getChildBodyCode=u,t.exports.setChildBodyCode=l;function i(e,t,n){let r=a(e,t,n);return Function(r)()}function a(e,t,i){let a=n(e),p=2**e,m=[];for(let t=0;t<e;++t)m.push(t);let h=(e,t)=>m.map(e).join(t===void 0?`
`:t),g=Array.isArray(t)&&t.length>1?s(e,t,i):o(t);g.count===1&&(t=g.laws[0]);let _=t&&!t.isDefault,v=_&&t.hasRange,y=(n,r)=>g.count>1?g.push(n===`node.mass`,r):_?`${t.emit(e,`r`,`k1`)}
${r}v = gravity * ${n} * sourceMass * k1;`:`v = gravity * ${n} * sourceMass / (r * r * r);`;return`
${f()}
${d(e,g)}
${c(e)}
${u(e)}
${l(e)}

/**
 * Barnes-Hut tree over a body store (see createBodyStore.js). Bodies are body indexes.
 */
function createQuadTree(options, random, law) {
  options = options || {};
${g.count>1?g.lawValues():`  // Values of the law's parameters, refreshed by the simulator every step:
  var lawValues = law ? law.values : null;
  var lawFunctions = law ? law.functions : null;`}
  options.gravity = typeof options.gravity === 'number' ? options.gravity : -1;
  options.theta = typeof options.theta === 'number' ? options.theta : 0.8;

  var gravity = options.gravity;
  var updateQueue = [];
  var insertStack = new InsertStack();
  var theta = options.theta;

  var nodesCache = [];
  var currentInCache = 0;
  var root = newNode();

  // Arrays of the store from the last insertBodies() call (\`sensitivity\`: how strongly
  // bodies feel the push):
  var pos, mass, sensitivity, force${g.columns()};

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
${S(`      node.`)}
      node.body = -1;
      node.mass = ${a(`node.mass_{var} = `,{join:``})}${g.resetNode()}0;
      ${a(`node.min_{var} = node.max_{var} = `,{join:``})}0;
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
    ${a(`var d{var};`,{indent:4})}
    var r; 
    ${a(`var f{var} = 0;`,{indent:4})}
    var queueLength = 1;
    var shiftIdx = 0;
    var pushIdx = 1;
    var sourceOffset = sourceBody * ${e};
    ${h(e=>`var s${r(e)} = pos[sourceOffset${e?` + `+e:``}];`,`
    `)}
    var sourceMass = sensitivity[sourceBody];${g.sources(`    `)}
    ${g.count>1?g.prologue(`    `):_?`var k1; `+t.prologue(`lawValues`):``}

    queue[0] = root;

    while (queueLength) {
      var node = queue[shiftIdx];
      var body = node.body;

      queueLength -= 1;
      shiftIdx += 1;
      var differentBody = (body !== sourceBody);
      if (body >= 0 && differentBody) {
        // If the current node is a leaf node (and it is not source body),
        // calculate the force exerted by the current node on body, and add this
        // amount to body's net force.
        var bodyOffset = body * ${e};
        ${h(e=>`d${r(e)} = pos[bodyOffset${e?` + `+e:``}] - s${r(e)};`,`
        `)}
        r = Math.sqrt(${a(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Poor man's protection against zero distance.
          ${a(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${a(`d{var} * d{var}`,{join:` + `})});
        }

        ${v&&g.count===1?`if (r > lawRange) continue;`:``}
        // This is standard gravitation force calculation but we divide
        // by r^3 to save two operations when normalizing force vector.
        ${y(`mass[body]`,`        `)}
        ${a(`f{var} += v * d{var};`,{indent:8})}
      } else if (differentBody) {
        // Otherwise, calculate the ratio s / r,  where s is the width of the region
        // represented by the internal node, and r is the distance between the body
        // and the node's center-of-mass
        ${(e=>g.count>1?g.skipCell(e):g.anyRange?`var boxDistance2 = 0, edge;
${e}${h(e=>`edge = node.min_${r(e)} - s${r(e)}; if (edge > 0) boxDistance2 += edge * edge; else { edge = s${r(e)} - node.max_${r(e)}; if (edge > 0) boxDistance2 += edge * edge; }`,`
`+e)}
${e}if (boxDistance2 > lawRange2) continue;
${e}`:``)(`        `)}${g.count>1?g.openCell(`        `):`${a(`d{var} = node.mass_{var} / node.mass - s{var};`,{indent:8})}
        r = Math.sqrt(${a(`d{var} * d{var}`,{join:` + `})});

        if (r === 0) {
          // Sorry about code duplication. I don't want to create many functions
          // right away. Just want to see performance first.
          ${a(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:10})}
          r = Math.sqrt(${a(`d{var} * d{var}`,{join:` + `})});
        }
        // If s / r < \u03B8, treat this internal node as a single body, and calculate the
        // force it exerts on sourceBody, and add this amount to sourceBody's net force.
        if ((node.max_${r(0)} - node.min_${r(0)}) / r < theta) {`}
          // in the if statement above we consider node's width only
          // because the region was made into square during tree creation.
          // Thus there is no difference between using width or height.
          ${y(`node.mass`,`          `)}
          ${a(`f{var} += v * d{var};`,{indent:10})}
        } else {
          // Otherwise, run the procedure recursively on each of the current node's children.

          // I intentionally unfolded this loop, to save several CPU cycles.
${x()}
        }
      }
    }

    ${h(e=>`force[sourceOffset${e?` + `+e:``}] += f${r(e)};`,`
    `)}
  }

${g.count>1?g.insertBodies():`  // \`charge\` is the column of charges (masses by default), \`bodySensitivity\` how strongly
  // bodies feel the push (the charges by default). Bodies without charge push nobody, so they
  // are left out of the tree.
  function insertBodies(store, charge, bodySensitivity) {
    pos = store.pos;
    mass = charge || store.mass;
    sensitivity = bodySensitivity || mass;`}
    force = store.force;
    ${a(`var {var}min = Number.MAX_VALUE;`,{indent:4})}
    ${a(`var {var}max = -Number.MAX_VALUE;`,{indent:4})}
    var i = store.n;

    // To reduce quad tree depth we are looking for exact bounding box of all particles.
    while (i--) {
      if (${g.noCharge(`i`)}) continue;
      var offset = i * ${e};
      ${h(e=>`var ${r(e)} = pos[offset${e?` + `+e:``}];`,`
      `)}
      ${a(`if ({var} < {var}min) {var}min = {var};`,{indent:6})}
      ${a(`if ({var} > {var}max) {var}max = {var};`,{indent:6})}
    }

    // Makes the bounds square.
    var maxSideLength = -Infinity;
    ${a(`if ({var}max - {var}min > maxSideLength) maxSideLength = {var}max - {var}min ;`,{indent:4})}

    currentInCache = 0;
    root = newNode();
    ${a(`root.min_{var} = {var}min;`,{indent:4})}
    ${a(`root.max_{var} = {var}min + maxSideLength;`,{indent:4})}

    i = store.n;
    var rootTaken = false;
    while (i--) {
      if (${g.noCharge(`i`)}) continue;
      if (rootTaken) {
        insert(i, root);
      } else {
        root.body = i;
        rootTaken = true;
      }
    }${g.centres(`    `)}
  }

  function insert(newBody) {
    insertStack.reset();
    insertStack.push(root, newBody);

    while (!insertStack.isEmpty()) {
      var stackItem = insertStack.pop();
      var node = stackItem.node;
      var body = stackItem.body;

      if (node.body < 0) {
        // This is internal node. Update the total mass of the node and center-of-mass.
        var bodyOffset = body * ${e};
        ${h(e=>`var ${r(e)} = pos[bodyOffset${e?` + `+e:``}];`,`
        `)}
        var bodyMass = mass[body];
        node.mass += bodyMass;
        ${a(`node.mass_{var} += bodyMass * {var};`,{indent:8})}${g.addToNode(`        `)}

        // Recursively insert the body in the appropriate quadrant.
        // But first find the appropriate quadrant.
        var quadIdx = 0; // Assume we are in the 0's quad.
        ${a(`var min_{var} = node.min_{var};`,{indent:8})}
        ${a(`var max_{var} = (min_{var} + node.max_{var}) / 2;`,{indent:8})}

${b(8)}

        var child = getChild(node, quadIdx);

        if (!child) {
          // The node is internal but this quadrant is not taken. Add
          // subnode to it.
          child = newNode();
          ${a(`child.min_{var} = min_{var};`,{indent:10})}
          ${a(`child.max_{var} = max_{var};`,{indent:10})}
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
        node.body = -1; // internal nodes do not cary bodies

        if (isSamePosition(pos, oldBody, body)) {
          // Prevent infinite subdivision by bumping one node
          // anywhere in this quadrant
          var retriesCount = 3;
          do {
            var offset = random.nextDouble();
            ${a(`var d{var} = (node.max_{var} - node.min_{var}) * offset;`,{indent:12})}

            ${h(t=>`pos[oldBody * ${e}${t?` + `+t:``}] = node.min_${r(t)} + d${r(t)};`,`
            `)}
            retriesCount -= 1;
            // Make sure we don't bump it out of the box. If we do, next iteration should fix it
          } while (retriesCount > 0 && isSamePosition(pos, oldBody, body));

          if (retriesCount === 0 && isSamePosition(pos, oldBody, body)) {
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

`;function b(t){let n=[],i=Array(t+1).join(` `);for(let t=0;t<e;++t)n.push(i+`if (${r(t)} > max_${r(t)}) {`),n.push(i+`  quadIdx = quadIdx + ${2**t};`),n.push(i+`  min_${r(t)} = max_${r(t)};`),n.push(i+`  max_${r(t)} = node.max_${r(t)};`),n.push(i+`}`);return n.join(`
`)}function x(){let e=Array(11).join(` `),t=[];for(let n=0;n<p;++n)t.push(e+`if (node.quad${n}) {`),t.push(e+`  queue[pushIdx] = node.quad${n};`),t.push(e+`  queueLength += 1;`),t.push(e+`  pushIdx += 1;`),t.push(e+`}`);return t.join(`
`)}function S(e){let t=[];for(let n=0;n<p;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function o(e){let t=Array.isArray(e)?e:[e],n=()=>``;return{count:1,laws:t,anyRange:!!t[0]&&!t[0].isDefault&&!!t[0].hasRange,columns:n,resetNode:n,nodeFields:n,sources:n,centres:n,addToNode:n,noCharge:e=>`mass[${e}] === 0`}}function s(e,t,i){let a=n(e),o=Array.isArray(t)?t:[t],s=o.length,c=i&&i.centroid;(Array.isArray(c)?c:[c]).forEach(e=>{if(s>1&&e!==void 0&&e!==`own`&&e!==`shared`)throw Error(`Unknown centroid: `+e+". Expected `own` or `shared`")});let l=e=>e>0&&(Array.isArray(c)?c[e]:c)===`shared`,u=e=>!!o[e]&&!o[e].isDefault,d=e=>u(e)&&o[e].hasRange,f=[];for(let e=1;e<s;++e)f.push(e);let p=[0].concat(f),m=f.filter(e=>!l(e)),h=[];p.forEach(e=>{let t=h.find(t=>u(e)?t.law===o[e]:!t.custom);t||h.push(t={law:o[e],custom:u(e),first:e,charges:[]}),t.charges.push(e)});let g=e=>e?`charge`+e:`mass`,_=e=>e?`sourceMass`+e:`sourceMass`,v=e=>e?`node.charge`+e:`node.mass`,y=e=>e?`k1c`+e:`k1`,b=e=>h.find(t=>t.charges.indexOf(e)>=0).first,x=(e,t)=>b(t)?e.replace(/\blaw(?=_|H\d|Range|Values|Functions)/g,`law`+b(t)):e;return{count:s,laws:o,anyRange:p.some(d),lawValues:function(){let e=h.filter(e=>e.custom).map(e=>x(`  var lawValues = law[${e.first}].values, lawFunctions = law[${e.first}].functions;`,e.first));return e.length&&e.unshift(`  // Values of the laws' parameters (a law per charge), refreshed by the simulator every step:`),e.join(`
`)},columns:()=>f.map(e=>`, ${g(e)}, sensitivity${e}`).join(``),resetNode:()=>f.map(e=>l(e)?`${v(e)} = `:`${v(e)} = `+a(`${v(e)}_{var} = `,{join:``})).join(``),nodeFields:function(e){return s===1?``:`

${e}// Sums of the other charges${m.length?m.length===f.length?`, and their centres as for the first one`:`, and the centres of those with their own`:``}
${e}`+f.map(t=>`this.charge${t} = 0;`+(l(t)?``:`
${e}`+a(`this.charge${t}_{var} = 0;`,{indent:e.length}))).join(`
${e}`)},sources:function(e){let t=f.map(e=>`var ${_(e)} = sensitivity${e}[sourceBody];`);return s>1&&t.push(`var theta2 = theta * theta, r2, w;`),m.length&&t.push(a(`var e{var};`,{indent:e.length}),`var er;`),t.map(t=>`
`+e+t).join(``)},prologue:e=>h.filter(e=>e.custom).map(e=>`var weight${e.first}, ${e.charges.map(y).join(`, `)}; `+x(e.law.prologue(`lawValues`),e.first)).join(`
`+e),noCharge:e=>p.map(t=>`${g(t)}[${e}] === 0`).join(` && `),addToNode:e=>f.map(t=>`
`+e+(l(t)?`${v(t)} += ${g(t)}[body];`:`var bodyCharge${t} = ${g(t)}[body];
${e}${v(t)} += bodyCharge${t};
${e}`+a(`${v(t)}_{var} += bodyCharge${t} * {var};`,{indent:e.length}))).join(``),insertBodies:()=>(p.some(d)?`  // Squared distance from a point to the nearest point of a cell
  function boxDistance(node, ${a(`s{var}`,{join:`, `})}) {
    var boxDistance2 = 0, edge;
    ${a(`edge = node.min_{var} - s{var}; if (edge > 0) boxDistance2 += edge * edge; else { edge = s{var} - node.max_{var}; if (edge > 0) boxDistance2 += edge * edge; }`,{indent:4})}
    return boxDistance2;
  }

`:``)+`  // \`charges\` are the K columns of charges, \`sensitivities\` how strongly bodies feel each
  // of them (that charge when missing). Bodies without any charge push nobody, so they are left
  // out of the tree.
  function insertBodies(store, charges, sensitivities) {
    pos = store.pos;
    sensitivities = sensitivities || [];
    mass = charges[0];
    sensitivity = sensitivities[0] || mass;
${f.map(e=>`    ${g(e)} = charges[${e}];
    sensitivity${e} = sensitivities[${e}] || ${g(e)};`).join(`
`)}`,skipCell:function(e){if(!p.some(d))return``;let t=p.filter(d).map(e=>`boxDistance2 <= ${x(`lawRange2`,e)}`).filter((e,t,n)=>n.indexOf(e)===t).join(` || `),n=p.filter(e=>!d(e)).map(e=>`${_(e)} !== 0`+(l(e)?``:` && ${v(e)} !== 0`));return n.length?`var boxDistance2 = -1;
${e}if (!(${n.join(` || `)})) {
${e}  boxDistance2 = boxDistance(node, ${a(`s{var}`,{join:`, `})});
${e}  if (!(${t})) continue;
${e}}
${e}`:`var boxDistance2 = boxDistance(node, ${a(`s{var}`,{join:`, `})});
${e}if (!(${t})) continue;
${e}`},openCell:e=>`${a(`d{var} = node.mass_{var} - s{var};`,{indent:e.length})}
${e}r2 = ${a(`d{var} * d{var}`,{join:` + `})};

${e}if (r2 === 0) {
${e}  // Poor man's protection against zero distance.
${e}  ${a(`d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:e.length+2})}
${e}  r2 = ${a(`d{var} * d{var}`,{join:` + `})};
${e}}
${e}// If s / r < \u03B8, treat this internal node as a single body, and calculate the
${e}// force it exerts on sourceBody, and add this amount to sourceBody's net force.
${e}w = node.max_${r(0)} - node.min_${r(0)};
${e}if (w * w < theta2 * r2) {
${e}  r = Math.sqrt(r2);`,centres:e=>s===1?``:`
${e}for (i = 0; i < currentInCache; ++i) {
${e}  var cell = nodesCache[i];
${e}  if (cell.body >= 0) continue;
${e}  if (cell.mass !== 0) {
${e}    ${a(`cell.mass_{var} /= cell.mass;`,{indent:e.length+4})}
${e}  } else {
${e}    // None of the first charge here: the cell's middle stands in for its centre
${e}    ${a(`cell.mass_{var} = (cell.min_{var} + cell.max_{var}) / 2;`,{indent:e.length+4})}
${e}  }${m.map(t=>`
${e}  if (cell.charge${t} !== 0) {
${e}    ${a(`cell.charge${t}_{var} /= cell.charge${t};`,{indent:e.length+4})}
${e}  }`).join(``)}
${e}}`,push:function(e,t){if(!e)return w(h,e=>`${g(e)}[body]`,e=>`r <= ${x(`lawRange`,e)}`).join(`
`+t);let n=[];m.forEach(e=>{n=n.concat(T(e))});let r=h.map(e=>({law:e.law,custom:e.custom,first:e.first,charges:e.charges.filter(e=>e===0||l(e))})).filter(e=>e.charges.length);return n.concat(w(r,v,S)).join(`
`+t)}};function S(e){return(p.some(e=>!d(e))?`(boxDistance2 < 0 ? (boxDistance2 = boxDistance(node, ${a(`s{var}`,{join:`, `})})) : boxDistance2)`:`boxDistance2`)+` <= ${x(`lawRange2`,e)}`}function C(t,n){return x(o[t].emit(e,n,y(t)),t)}function w(e,t,n){let r=e=>e.charges.map(e=>`${t(e)} * ${_(e)}`).join(` + `),i=e.filter(e=>!e.custom),a=e.filter(e=>e.custom);if(a.length===0)return[`v = gravity * (${r(i[0])}) / (r * r * r);`];let o=[i.length?`v = (${r(i[0])}) / (r * r * r);`:`v = 0;`];return a.forEach(e=>{let t=`weight`+e.first,i=[`${t} !== 0`];d(e.first)&&i.push(n(e.first)),o.push(`${t} = ${r(e)};`,`if (${i.join(` && `)}) {`,`  `+C(e.first,`r`),`  v += ${t} * ${y(e.first)};`,`}`)}),o.push(`v *= gravity;`),o}function T(t){let n=[`${_(t)} !== 0`,`${v(t)} !== 0`];d(t)&&n.push(S(t));let i=[`if (${n.join(` && `)}) {`];i.push(`  if (${a(`${v(t)}_{var} === node.mass_{var}`,{join:` && `})}) {`),i.push(`    ${a(`e{var} = d{var}; `,{join:``})}er = r;`),i.push(`  } else {`);for(let n=0;n<e;++n){let e=r(n);i.push(`    e${e} = ${v(t)}_${e} - s${e};`)}return i.push(`    er = Math.sqrt(${a(`e{var} * e{var}`,{join:` + `})});`),i.push(`    // On the source: push along the cell's centre instead`),i.push(`    if (er === 0) { ${a(`e{var} = d{var}; `,{join:``})}er = r; }`),i.push(`  }`),u(t)?i.push(`  `+C(t,`er`),`  v = gravity * ${v(t)} * ${_(t)} * ${y(t)};`):i.push(`  v = gravity * ${v(t)} * ${_(t)} / (er * er * er);`),i.push(`  ${a(`f{var} += v * e{var};`,{join:` `})}`),i.push(`}`),i}}function c(e){let t=n(e),i=[];for(let t=0;t<e;++t)i.push(t);return`
  function isSamePosition(pos, body1, body2) {
    var offset1 = body1 * ${e}, offset2 = body2 * ${e};
    ${i.map(e=>`var d${r(e)} = Math.abs(pos[offset1${e?` + `+e:``}] - pos[offset2${e?` + `+e:``}]);`).join(`
    `)}
  
    return ${t(`d{var} < 1e-8`,{join:` && `})};
  }  
`}function l(e){var t=2**e;return`
function setChild(node, idx, child) {
  ${n()}
}`;function n(){let e=[];for(let n=0;n<t;++n){let t=n===0?`  `:`  else `;e.push(`${t}if (idx === ${n}) node.quad${n} = child;`)}return e.join(`
`)}}function u(e){return`function getChild(node, idx) {
${t()}
  return null;
}`;function t(){let t=[],n=2**e;for(let e=0;e<n;++e)t.push(`  if (idx === ${e}) return node.quad${e};`);return t.join(`
`)}}function d(e,t){let r=n(e),i=2**e;return`
function QuadNode() {
  // index of the body stored inside this node, or -1. In quad tree only leaf nodes
  // (by construction) contain bodies:
  this.body = -1;

  // Child nodes are stored in quads. Each quad is presented by number:
  // 0 | 1
  // -----
  // 2 | 3
${a(`  this.`)}

  // Total mass of current node
  this.mass = 0;

  // Center of mass coordinates
  ${r(`this.mass_{var} = 0;`,{indent:2})}${t?t.nodeFields(`  `):``}

  // bounding box coordinates
  ${r(`this.min_{var} = 0;`,{indent:2})}
  ${r(`this.max_{var} = 0;`,{indent:2})}
}
`;function a(e){let t=[];for(let n=0;n<i;++n)t.push(`${e}quad${n} = null;`);return t.join(`
`)}}function f(){return`
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
    this.body = body; // index of the body which needs to be inserted to node
}
`}}}),Rl=jl({"lib/codeGenerators/generateBounds.js"(e,t){t.exports=r,t.exports.generateFunctionBody=i;var n=Nl();function r(e){let t=i(e);return Function(`store`,`settings`,`random`,t)}function i(e){let t=n(e);return`
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
        var pos = store.pos;
        for (var i = 0; i < neighbors.length; ++i) {
          var offset = neighbors[i].index * ${e};
          ${t(`base_{var} += pos[offset{+k}];`,{indent:10})}
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
    var i = store.n;
    if (i === 0) return; // No bodies - no borders.
    var pos = store.pos;

    ${t(`var max_{var} = -Infinity;`,{indent:4})}
    ${t(`var min_{var} = Infinity;`,{indent:4})}

    while(i--) {
      // this is O(n), it could be done faster with quadtree, if we check the root node bounds
      var offset = i * ${e};
      ${t(`var {var} = pos[offset{+k}];`,{indent:6})}
      ${t(`if ({var} < min_{var}) min_{var} = {var};`,{indent:6})}
      ${t(`if ({var} > max_{var}) max_{var} = {var};`,{indent:6})}
    }

    ${t(`boundingBox.min_{var} = min_{var};`,{indent:4})}
    ${t(`boundingBox.max_{var} = max_{var};`,{indent:4})}
  }

  function resetBoundingBox() {
    ${t(`boundingBox.min_{var} = boundingBox.max_{var} = 0;`,{indent:4})}
  }
`}}}),zl=jl({"lib/codeGenerators/generateCreateDragForce.js"(e,t){var n=Nl();t.exports=r,t.exports.generateCreateDragForceFunctionBody=i;function r(e){let t=i(e);return Function(`options`,t)}function i(e){return`
  if (!Number.isFinite(options.dragCoefficient)) throw new Error('dragCoefficient is not a finite number');

  return {
    /**
     * Slows down every body of the store that is not pinned.
     */
    update: function(store) {
      var force = store.force, velocity = store.velocity, pinned = store.pinned;
      var dragCoefficient = options.dragCoefficient;
      for (var i = 0, n = store.n; i < n; ++i) {
        if (pinned[i]) continue;
        var offset = i * ${e};
        ${n(e)(`force[offset{+k}] -= dragCoefficient * velocity[offset{+k}];`,{indent:8})}
      }
    }
  };
`}}}),Bl=jl({"lib/codeGenerators/generateCreateSpringForce.js"(e,t){var n=Nl();t.exports=r,t.exports.generateCreateSpringForceFunctionBody=i;function r(e){let t=i(e);return Function(`options`,`random`,t)}function i(e){let t=n(e),r=(e,n)=>`var d = r - length;
${e}var coefficient = ((springCoefficient[i] > 0) ? springCoefficient[i] : options.springCoefficient) * d / r;

${e}${t(`force[offset1{+k}] += coefficient * d{var};`,{indent:e.length})}
${e}${t(`force[offset2{+k}] -= coefficient * d{var};`,{indent:e.length})}`+(n?`
${e}springCount[body1] += 1;
${e}springLength[body1] += r;
${e}springCount[body2] += 1;
${e}springLength[body2] += r;`:``),i=t=>`var body1 = from[i];
${t}var body2 = to[i];
${t}var offset1 = body1 * ${e};
${t}var offset2 = body2 * ${e};
${t}var length = restLength[i] < 0 ? options.springLength : restLength[i];`,a=e=>`var from = springs.from, to = springs.to, restLength = springs.length, springCoefficient = springs.coefficient;
${e}var pos = store.pos, force = store.force;
${e}var springCount = store.springCount, springLength = store.springLength;`,o=(e,n)=>`
  function ${e}(springs, store, i) {
    ${a(`    `)}
    while (i--) {
      ${i(`      `)}
      ${t(`var d{var} = pos[offset2{+k}] - pos[offset1{+k}];`,{indent:6})}
      var r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});
      if (r === 0) return i;

      ${r(`      `,n)}
    }
    return -1;
  }`;return`
  if (!Number.isFinite(options.springCoefficient)) throw new Error('Spring coefficient is not a number');
  if (!Number.isFinite(options.springLength)) throw new Error('Spring length is not a number');

  return {
    /**
     * Updates forces of all springs in \`springs\` (a spring store), last spring first.
     * Spring ends are bodies of \`store\`. With \`withStats\` it also counts springs and sums
     * their lengths per body (\`store.springCount\`, \`store.springLength\`), which the adaptive
     * time step needs.
     */
    update: function (springs, store, withStats) {
      var i = springs.n;
      var update = withStats ? updateWithStatsUntilZeroLength : updateUntilZeroLength;
      while ((i = update(springs, store, i)) >= 0) {
        updateZeroLength(springs, store, i, withStats);
      }
    }
  };

  // These update springs i - 1, i - 2, ... 0 and return -1, or stop at the first spring whose
  // ends are at the same point and return its index. The loop has no function calls, which
  // lets it keep the arrays in registers.
${o(`updateUntilZeroLength`,!1)}
${o(`updateWithStatsUntilZeroLength`,!0)}

  // Ends at the same point: push them apart in a random direction.
  function updateZeroLength(springs, store, i, withStats) {
    ${a(`    `)}
    ${i(`    `)}
    ${t(`var d{var} = (random.nextDouble() - 0.5) / 50;`,{indent:4})}
    var r = Math.sqrt(${t(`d{var} * d{var}`,{join:` + `})});

    ${r(`    `,!1)}
    if (withStats) {
      springCount[body1] += 1;
      springLength[body1] += r;
      springCount[body2] += 1;
      springLength[body2] += r;
    }
  }
`}}}),Vl=jl({"lib/codeGenerators/generateIntegrator.js"(e,t){var n=Nl();t.exports=r,t.exports.generateIntegratorFunctionBody=i,t.exports.inertiaColumn=a;function r(e,t){let n=i(e,t);return Function(`store`,`timeStep`,`adaptiveTimeStepWeight`,`maxVelocity`,n)}function i(e,t){let r=n(e);return`
  var length = store.n;
  if (length === 0) return 0;
  var pos = store.pos, velocity = store.velocity, force = store.force, mass = ${a(t)};
  var pinned = store.pinned, springCount = store.springCount, springLength = store.springLength;

  ${r(`var d{var} = 0, t{var} = 0;`,{indent:2})}
  var maxV = maxVelocity > 0 ? maxVelocity : 1;

  for (var i = 0; i < length; ++i) {
    if (pinned[i]) continue;

    var dt = timeStep;
    if (adaptiveTimeStepWeight && springCount[i]) {
      dt = (adaptiveTimeStepWeight * springLength[i]/springCount[i]);
    }

    var coeff = dt / mass[i];
    var offset = i * ${e};

    ${r(`velocity[offset{+k}] += coeff * force[offset{+k}];`,{indent:4})}
    ${r(`var v{var} = velocity[offset{+k}];`,{indent:4})}
    var v = Math.sqrt(${r(`v{var} * v{var}`,{join:` + `})});

    if (v > maxV) {
      // We normalize it so that we move within timeStep range.
      // for the case when v <= maxV - we let velocity to fade out.
      ${r(`velocity[offset{+k}] = maxV * v{var} / v;`,{indent:6})}
    }

    ${r(`d{var} = dt * velocity[offset{+k}];`,{indent:4})}

    ${r(`pos[offset{+k}] += d{var};`,{indent:4})}

    ${r(`t{var} += Math.abs(d{var});`,{indent:4})}
  }

  return (${r(`t{var} * t{var}`,{join:` + `})})/length;
`}function a(e){return!e||e===`mass`?`store.mass`:`store[`+JSON.stringify(e)+`]`}}}),Hl=jl({"lib/codeGenerators/generateClearForces.js"(e,t){var n=Nl();t.exports=r,t.exports.generateClearForcesFunctionBody=i;function r(e){let t=i(e);return Function(`store`,t)}function i(e){return`
  var force = store.force, pinned = store.pinned;
  var springCount = store.springCount, springLength = store.springLength;
  for (var i = 0, n = store.n; i < n; ++i) {
    if (pinned[i]) continue;
    var offset = i * ${e};
    ${n(e)(`force[offset{+k}] = 0;`,{join:` `})}
    springCount[i] = 0;
    springLength[i] = 0;
  }
`}}}),Ul=jl({"lib/createSpringStore.js"(e,t){t.exports=r;var n=Pl();function r(e){var t={n:0,capacity:0,from:null,to:null,length:null,coefficient:null,add:null,removeRows:null,define:null,has:null,get:null,remove:null,names:null,sizeOf:null,copyTo:null,lockBuiltIns:null,reserve:null,onResize:null,typeOf:null,versionClock:0,writes:null,columnsVersion:0,changed:null};return n(t),t.define(`from`,Int32Array,1),t.define(`to`,Int32Array,1),t.define(`length`,Float64Array,1,-1),t.define(`coefficient`,Float64Array,1,-1),t.lockBuiltIns(),e&&t.reserve(e),t}}}),Wl=jl({"lib/formula.js"(e,t){t.exports.parse=_,t.exports.parseProgram=v,t.exports.children=b,t.exports.compile=w,t.exports.createTable=C,t.exports.numberLiteral=S,t.exports.isCondition=x;var n={exp:r(`all`,`Math.exp`,function(e,t,n){return n+` * `+t[0].d}),log:r(`x > 0`,`Math.log`,function(e,t){return t[0].d+` / `+t[0].v}),sqrt:r(`x >= 0`,`Math.sqrt`,function(e,t,n){return t[0].d+` / (`+e.number(2)+` * `+n+`)`}),abs:r(`all`,`Math.abs`,function(e,t){return e.choose(t[0].v+` < `+e.number(0),`-`+t[0].d,t[0].d)}),sign:r(`all`,`Math.sign`,null),floor:r(`all`,`Math.floor`,null),ceil:r(`all`,`Math.ceil`,null),tanh:r(`all`,`Math.tanh`,function(e,t,n){return`(`+e.number(1)+` - `+n+` * `+n+`) * `+t[0].d}),sin:r(`all`,`Math.sin`,function(e,t){return e.call(`cos`,[t[0].v])+` * `+t[0].d}),cos:r(`all`,`Math.cos`,function(e,t){return`-`+e.call(`sin`,[t[0].v])+` * `+t[0].d}),min:i(`min`,` <= `),max:i(`max`,` >= `),pow:{args:[`num`,`num`],result:`num`,domain:`x > 0, or y a whole number`,derivative:null,js:`Math.pow`},select:{args:[`bool`,`any`,`any`],result:`arg`,domain:`all`,derivative:null,js:null},dot:{args:[`vec`,`vec`],result:`num`,domain:`all`,derivative:null,js:null},length:{args:[`vec`],result:`num`,domain:`all`,derivative:null,js:null},axis:{args:[`const`],result:`vec`,domain:`0 <= k < D, whole`,derivative:null,js:null}};function r(e,t,n){return{args:[`num`],result:`num`,domain:e,derivative:n,js:t}}function i(e,t){return{args:[`num`,`num`],result:`num`,domain:`all`,js:`Math.`+e,derivative:function(e,n){return e.choose(n[0].v+t+n[1].v,n[0].d===null?e.number(0):n[0].d,n[1].d===null?e.number(0):n[1].d)}}}var a={};Object.keys(n).forEach(function(e){a[e]=n[e].args.length});var o={name:`js`,number:S,call:function(e,t){return n[e].js+`(`+t.join(`, `)+`)`},choose:function(e,t,n){return`(`+e+` ? `+t+` : `+n+`)`},operator:function(e){return e===`==`?`===`:e===`!=`?`!==`:e},declare:function(e,t){return`var `+e+` = `+t+`;`},result:function(e,t){return e+` = `+t+`;`},assign:function(e,t,n){return e+` `+t+` `+n+`;`},local:function(e){return`$v_`+e},temp:function(e){return`$t`+e}};t.exports.BUILTINS=n,t.exports.JS=o;var s=typeof Symbol==`function`?Symbol.for(`ngraph.forcelayout.settings`):`$settings`;function c(e){var t=e.settings;return t[s]||t}var l={n:function(e){return e.store.n},step:function(e){return e.iteration()},dt:function(e){return c(e).timeStep},unit:function(e){return e.unit()},springLength:u(`springLength`),springCoefficient:u(`springCoefficient`),gravity:u(`gravity`),dragCoefficient:u(`dragCoefficient`),theta:u(`theta`),timeStep:u(`timeStep`),maxVelocity:u(`maxVelocity`)};t.exports.FUNCTIONS=a,t.exports.BUILT_IN_VALUES=l,t.exports.SETTINGS=s,t.exports.liveSettings=c;function u(e){return function(t){return c(t)[e]}}var d={"<":!0,"<=":!0,">":!0,">=":!0,"==":!0,"!=":!0},f={"=":!0,"+=":!0,"-=":!0,"*=":!0,"/=":!0},p=/(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|===|!==|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|\/=|[-+*/^(),;?:[\]<>!=])/y,m=/(?:\s+|\/\/[^\n]*)*/y;function h(e){for(var t=[],n=0;m.lastIndex=n,m.exec(e),n=m.lastIndex,!(n>=e.length);){p.lastIndex=n;var r=p.exec(e);if(!r)throw Error(`Cannot read formula at "`+e.slice(n)+`"`);r[1]===void 0?r[2]===void 0?t.push({type:`op`,value:g[r[3]]||r[3]}):t.push({type:`id`,value:r[2]}):t.push({type:`num`,value:Number(r[1])}),n=p.lastIndex}return t}var g={"**":`^`,"===":`==`,"!==":`!=`};function _(e){var t=v(e);if(t.length!==1||t[0].target!==null)throw Error(`Expected one expression: `+e);return t[0].expr}function v(e){if(typeof e!=`string`)throw Error(`A formula should be a string`);for(var t=h(e),n=0,r=[];n<t.length;)if(o(`;`))n++;else{var i,a=t[n+1];t[n].type===`id`&&a&&a.type===`op`&&f[a.value]?(i={target:t[n].value,op:a.value,expr:null},n+=2,i.expr=l()):i={target:null,op:null,expr:l()},r.push(i),n<t.length&&c(`;`)}if(r.length===0)throw Error(`Formula is empty`);return r;function o(e){return n<t.length&&t[n].type===`op`&&t[n].value===e}function s(){return n<t.length&&t[n].type===`op`?t[n].value:null}function c(r){if(!o(r)){var i=n<t.length?`"`+t[n].value+`"`:`the end`;throw Error(`Expected "`+r+`" but found `+i+` in formula `+e)}n++}function l(){var e=u();if(!o(`?`))return e;n++;var t=l();return c(`:`),{type:`call`,name:`select`,args:[e,t,l()]}}function u(){for(var e=p();o(`||`);)n++,e={type:`bin`,op:`||`,a:e,b:p()};return e}function p(){for(var e=m();o(`&&`);)n++,e={type:`bin`,op:`&&`,a:e,b:m()};return e}function m(){var r=g();if(d[s()]&&(r={type:`bin`,op:t[n++].value,a:r,b:g()},d[s()]))throw Error(`Comparisons cannot be chained (use &&) in formula `+e);return r}function g(){for(var e=_();o(`+`)||o(`-`);)e={type:`bin`,op:t[n++].value,a:e,b:_()};return e}function _(){for(var e=v();o(`*`)||o(`/`);)e={type:`bin`,op:t[n++].value,a:e,b:v()};return e}function v(){return o(`-`)?(n++,{type:`neg`,a:v()}):o(`+`)?(n++,v()):o(`!`)?(n++,{type:`not`,a:v()}):b()}function b(){var e=x();return o(`^`)?(n++,{type:`bin`,op:`^`,a:e,b:v()}):e}function x(){var r=t[n++];if(!r)throw Error(`Formula ends too early: `+e);if(r.type===`num`)return{type:`num`,value:r.value};if(r.type===`id`){if(o(`(`)){n++;var i=[];if(!o(`)`))for(i.push(l());o(`,`);)n++,i.push(l());return c(`)`),y({type:`call`,name:r.value,args:i})}if(o(`[`)){n++;var a=l();return c(`]`),{type:`index`,name:r.value,a}}return{type:`var`,name:r.value}}if(r.value===`(`){var s=l();return c(`)`),s}throw Error(`Unexpected "`+r.value+`" in formula `+e)}}function y(e){var t=e.args;return e.name===`round`&&t.length===1?{type:`call`,name:`floor`,args:[{type:`bin`,op:`+`,a:t[0],b:{type:`num`,value:.5}}]}:e.name===`clamp`&&t.length===3?{type:`call`,name:`min`,args:[{type:`call`,name:`max`,args:[t[0],t[1]]},t[2]]}:e}function b(e){if(e.args)return e.args;var t=[];return e.a&&t.push(e.a),e.b&&t.push(e.b),t}function x(e){return e.type===`not`||e.type===`bin`&&(d[e.op]||e.op===`&&`||e.op===`||`)===!0}function S(e){var t=String(e);return e<0?`(`+t+`)`:t}function C(e,t){if(!t||!(t.values&&t.values.length>=2))throw Error(`Table `+e+` needs at least two values`);if(!(Number.isFinite(t.from)&&Number.isFinite(t.to)&&t.to>t.from))throw Error(`Table `+e+" needs finite `from` < `to`");var n=Float64Array.from(t.values),r=n.length-1,i=t.from,a=r/(t.to-t.from);return{from:i,to:t.to,values:n,value:function(e){var t=(e-i)*a;if(!(t>0))return n[0];if(t>=r)return n[r];var o=t|0;return n[o]+(n[o+1]-n[o])*(t-o)},derivative:function(e){var t=(e-i)*a;if(!(t>0)||t>=r)return 0;var o=t|0;return(n[o+1]-n[o])*a}}}function w(e,t,n){n||=o;var r=v(e),i=t.D,s=[],c=Object.create(null),l=0,u=null;return r.forEach(function(i,a){if(i.target===null){if(a!==r.length-1)throw Error(`Only the last statement of a formula can be a bare expression: `+e);u=t.condition?{type:`bool`,code:_(i.expr)}:g(i.expr,!0)}else{var o=i.target,l=i.op,d=C(i.expr),h=c[o];if(d.type===`bool`&&(l!==`=`||h||t.name(o,!0)))throw Error(`A condition is used as a number in formula `+e+` (use select(condition, 1, 0) to count it)`);if(h)d=p(h,l,d),m(h,d,o),f(h.codes||[h.code],l,d);else{var v=t.name(o,!0);if(v){if(!v.write)throw Error(o+` cannot be assigned in formula `+e);if(v.ops&&v.ops.indexOf(l)<0)throw Error(o+` can only be changed with `+v.ops.join(` or `)+` in formula `+e);d=p(v,l,d),m(v,d,o),v.write(l,d).forEach(function(e){s.push(e)})}else{if(l!==`=`)throw Error(o+` is used with `+l+` before it has a value, in formula `+e);if(o===`D`||o===`pi`)throw Error(o+` cannot be assigned in formula `+e);h={type:d.type,reads:0},d.type===`vec`?h.codes=d.codes.map(function(e,t){var r=n.local(o)+`_`+t;return s.push(n.declare(r,e,`local`)),r}):(h.code=n.local(o),s.push(n.declare(h.code,d.code,`local`))),c[o]=h}}}}),Object.keys(c).forEach(function(t){if(c[t].reads===0)throw Error(t+` is computed but never used in formula `+e)}),{lines:s,result:u};function f(e,t,r){var i=r.codes||[r.code];e.forEach(function(e,r){s.push(n.assign(e,t,i[r]))})}function p(e,t,n){if(e.type!==`vec`||n.type!==`num`||t!==`*=`&&t!==`/=`)return n;var r=h(n.code);return x(function(){return r})}function m(t,n,r){if(t.type!==n.type)throw Error(r+` is a `+T(t.type)+` but gets a `+T(n.type)+` in formula `+e)}function h(e){if(/^[\w$]+$/.test(e)||/^\(-?[\d.e+-]+\)$/.test(e))return e;var t=n.temp(l++);return s.push(n.declare(t,e,`temp`)),t}function g(t,n){var r=C(t);if(r.type===`bool`)throw Error(`A condition is used as a number in formula `+e+` (use select(condition, 1, 0) to count it)`);if(!n&&r.type===`vec`)throw Error(`A vector is used as a number in formula `+e);return r}function _(t){var n=C(t);if(n.type!==`bool`)throw Error(`Expected a condition (such as a < b) in formula `+e);return n.code}function y(e){return{type:`num`,code:e}}function b(e){return{type:`vec`,codes:e}}function x(e){for(var t=[],n=0;n<i;++n)t.push(e(n));return b(t)}function S(e){return e.type===`vec`?b(e.codes.map(h)):y(h(e.code))}function C(e){switch(e.type){case`num`:return y(n.number(e.value));case`var`:return w(e.name);case`index`:return E(e);case`neg`:var t=g(e.a,!0);return t.type===`vec`?b(t.codes.map(function(e){return`(-`+e+`)`})):y(`(-`+t.code+`)`);case`not`:return{type:`bool`,code:`!`+_(e.a)};case`bin`:return D(e);case`call`:return k(e)}throw Error(`Unknown formula node `+e.type)}function w(r){var a=c[r];if(a)return a.reads+=1,a.type===`bool`?{type:`bool`,code:a.code}:a.type===`vec`?b(a.codes):y(a.code);if(r===`D`)return y(n.number(i));if(r===`pi`)return y(n.number(Math.PI));var o=t.name(r);if(!o||o.call||o.index)throw Error((o?r+` cannot be read as a value`:`Unknown name `+r)+` in formula `+e);return o.type===`vec`?b(o.codes):y(o.code)}function E(n){var r=t.name(n.name);if(!r||!r.index)throw Error(n.name+` cannot be indexed in formula `+e);return r.index(h(g(n.a).code))}function D(t){var r=t.op;if(r===`&&`||r===`||`)return{type:`bool`,code:`(`+_(t.a)+` `+n.operator(r)+` `+_(t.b)+`)`};if(d[r])return{type:`bool`,code:`(`+g(t.a).code+` `+n.operator(r)+` `+g(t.b).code+`)`};if(r===`^`)return O(g(t.a),t.b);var i=g(t.a,!0),a=g(t.b,!0);if(r===`+`||r===`-`){if(i.type!==a.type)throw Error(`Cannot `+(r===`+`?`add`:`subtract`)+` a vector and a number in formula `+e);return i.type===`vec`?x(function(e){return`(`+i.codes[e]+` `+r+` `+a.codes[e]+`)`}):y(`(`+i.code+` `+r+` `+a.code+`)`)}if(i.type===`vec`&&a.type===`vec`)throw Error(`Vectors cannot be multiplied or divided (use dot()) in formula `+e);if(i.type===`vec`||a.type===`vec`){if(r===`/`&&a.type===`vec`)throw Error(`Cannot divide by a vector in formula `+e);var o=i.type===`vec`?i:a,s=h(i.type===`vec`?a.code:i.code);return x(function(e){return`(`+o.codes[e]+` `+r+` `+s+`)`})}return y(`(`+i.code+` `+r+` `+a.code+`)`)}function O(e,t){var r=t.type===`num`?t.value:t.type===`neg`&&t.a.type===`num`?-t.a.value:NaN;if(Number.isInteger(r)&&r>=-4&&r<=4){if(r===0)return y(n.number(1));for(var i=h(e.code),a=[],o=0;o<Math.abs(r);++o)a.push(i);return y(r>0?`(`+a.join(` * `)+`)`:`(`+n.number(1)+` / (`+a.join(` * `)+`))`)}return y(n.call(`pow`,[e.code,g(t).code]))}function k(r){var o=r.name,s=r.args,c=a[o];if(c===void 0){var l=t.name(o);if(!l||!l.call)throw Error(`Unknown function `+o+` in formula `+e);if(s.length!==1)throw Error(o+`() expects 1 argument in formula `+e);return y(l.call([g(s[0]).code]))}if(s.length!==c)throw Error(o+`() expects `+c+` argument(s) in formula `+e);if(o===`select`){var u=h(_(s[0])),d=g(s[1],!0),f=g(s[2],!0);if(d.type!==f.type)throw Error(`Both sides of a choice should be numbers, or both vectors, in formula `+e);return d.type===`vec`?x(function(e){return n.choose(u,d.codes[e],f.codes[e])}):y(n.choose(u,d.code,f.code))}if(o===`dot`||o===`length`){var p=S(g(s[0],!0)),m=o===`dot`?S(g(s[1],!0)):p;if(p.type!==`vec`||m.type!==`vec`)throw Error(o+`() expects vectors in formula `+e);var v=p.codes.map(function(e,t){return e+` * `+m.codes[t]}).join(` + `);return y(o===`dot`?`(`+v+`)`:n.call(`sqrt`,[v]))}if(o===`axis`){var b=A(s[0]);if(!(Number.isInteger(b)&&b>=0&&b<i))throw Error(`axis() takes a whole number from 0 to `+(i-1)+` in formula `+e);return x(function(e){return n.number(+(e===b))})}return y(n.call(o,s.map(function(e){return g(e).code})))}function A(e){if(e.type===`num`)return e.value;if(e.type===`var`&&e.name===`D`&&!c.D)return i;if(e.type===`neg`)return-A(e.a);if(e.type===`bin`&&(e.op===`+`||e.op===`-`)){var t=A(e.a),n=A(e.b);return e.op===`+`?t+n:t-n}return NaN}}function T(e){return e===`vec`?`vector`:`number`}}}),Gl=jl({"lib/parsedLaw.js"(e,t){var n=Kl().DEFAULT_KEY,r=null,i=null,a=null,o=null;t.exports=c,t.exports.parse=function(e){return s().parse(e)};function s(){return r||(r=Wl(),i=r.BUILT_IN_VALUES,a={},Object.keys(r.BUILTINS).forEach(function(e){var t=r.BUILTINS[e];t.result===`num`&&t.args.every(function(e){return e===`num`})&&(a[e]=t.args.length)}),o=r.JS,r)}function c(e){s();var t=e.params||{},a=Object.keys(t),c={r:!0,D:!0,pi:!0};a.forEach(function(e){if(!/^[A-Za-z_]\w*$/.test(e)||c[e])throw Error(`Bad law parameter name: `+e);c[e]=!0});var y=Object.keys(e.tables||{}),b=m(e.functions||{},e.tables||{}),x=p(e.force,c);if(h(x,c,b)!==`num`)throw Error(`A law should give a number, not a condition: `+e.force);var S=typeof e.range==`string`?p(e.range,c):null;if(S){if(h(S,c,b)!==`num`)throw Error(`Law range should be a number: `+e.range);if(g(S,`r`))throw Error(`Law range cannot depend on r`)}var w=[];[x,S].forEach(function(e){e&&_(e,function(e){!c[e]&&i[e]&&w.indexOf(e)<0&&w.push(e)})});var T=a.length;a=a.concat(w);var E=typeof e.range==`function`,D=typeof e.range==`number`,O=S!==null||E||D,k=!O&&a.length===0&&f(e.force)===n,A=[];l(x,A);var j=A.map(function(e){return e.key}),M={$range:1/0};a.concat(j).forEach(function(e){M[e]=0});var N=S?Function(`values`,`functions`,`D`,d(a,`values`)+`return `+v(S)+`;`):null,P=A.length&&!k?Function(`values`,`functions`,`D`,d(a,`values`)+A.map(function(e){return`values.`+e.key+` = `+e.code+`;`}).join(` `)):null,F={key:f(e.force)+`|`+a.join(`,`)+`|`+(O?`range`:``)+`|`+Object.keys(b).join(`,`),tableNames:y,isDefault:k,hasRange:O,paramNames:a,functions:b,values:M,spec:e,update:function(n){for(var o=0;o<a.length;++o){var s=a[o],c=o<T?t[s]:i[s];M[s]=typeof c==`function`?c(n):c}var l=r.liveSettings(n).dimensions;D?M.$range=e.range:E?M.$range=e.range(n):N&&(M.$range=N(M,b,l)),P&&P(M,b,l)},describe:function(){return{force:e.force,params:a.slice(0,T).map(function(e){var n=u(t[e]);return n.name=e,n}),builtIns:w.slice(),range:e.range===void 0?null:u(e.range),tables:y.map(function(t){var n=e.tables[t];return{name:t,from:n.from,to:n.to,values:Float64Array.from(n.values)}}),functions:Object.keys(e.functions||{}),isDefault:k,key:F.key}},prologue:function(e){return d(a,e)+A.map(function(t){return` var `+t.variable+` = `+e+`.`+t.key+`;`}).join(``)+(O?` var lawRange = `+e+`.$range, lawRange2 = lawRange * lawRange;`:``)},emit:function(e,t,n,r,i){return typeof e==`number`?C(x,e,t,n,r,o):C(x,t,n,r,i,e)}};return F}function l(e,t){var n=new Map;return i(e)||a(e),t;function i(e){if(n.has(e))return n.get(e);var t=b(e),r=t.map(i),s=e.type===`var`?e.name===`r`:r.some(Boolean);return s&&(t.forEach(function(e,t){r[t]||a(e)}),e.type===`bin`&&e.op===`/`&&!r[1]&&!e.reciprocal&&(e.reciprocal=o(`1 / `+v(e.b)))),n.set(e,s),s}function a(e){e.type===`num`||e.type===`var`||e.hoisted||(r.isCondition(e)?b(e).forEach(a):e.hoisted=o(v(e)))}function o(e){var n=t.length;return t.push({variable:`lawH`+n,key:`$h`+n,code:e}),`lawH`+n}}function u(e){return typeof e==`number`?{kind:`number`,value:e}:typeof e==`string`?{kind:`expression`,text:e}:{kind:`host`}}function d(e,t){return e.map(function(e){return`var law_`+e+` = `+t+`.`+e+`;`}).join(` `)}function f(e){return e.replace(/\s+/g,``)}function p(e,t){var n=r.parseProgram(e),a=Object.create(null),o=Object.create(null),s=null;if(n.forEach(function(r,o){if(r.target===null){if(o!==n.length-1)throw Error(`Only the last part of a law can be its expression: `+e);s=c(r.expr)}else{var l=r.target;if(r.op!==`=`)throw Error(`Law values are set with =, not `+r.op+`: `+e);if(a[l]||t[l]||i[l])throw Error(l+` already has a meaning in law `+e);a[l]=c(r.expr)}}),!s)throw Error(`A law should end with the expression of F(r): `+e);return Object.keys(a).forEach(function(t){if(!o[t])throw Error(t+` is computed but never used in law `+e)}),s;function c(e){if(e.type===`var`&&a[e.name])return o[e.name]=!0,a[e.name];var t={};return Object.keys(e).forEach(function(n){t[n]=e[n]}),e.args&&(t.args=e.args.map(c)),e.a&&(t.a=c(e.a)),e.b&&(t.b=c(e.b)),t}}function m(e,t){var n={};return Object.keys(e).forEach(function(t){n[t]=e[t]}),Object.keys(t).forEach(function(e){if(n[e])throw Error(e+` is both a function and a table`);var i=r.createTable(e,t[e]);n[e]={value:i.value,derivative:i.derivative}}),n}function h(e,t,n){switch(e.type){case`num`:return`num`;case`var`:if(!t[e.name]&&!i[e.name])throw Error(`Unknown name in law expression: `+e.name);return`num`;case`index`:throw Error(`Laws cannot read `+e.name+`[...]`);case`neg`:return c(e.a,`num`);case`not`:return c(e.a,`bool`),`bool`;case`bin`:return e.op===`&&`||e.op===`||`?(c(e.a,`bool`),c(e.b,`bool`),`bool`):(c(e.a,`num`),c(e.b,`num`),r.isCondition(e)?`bool`:`num`);case`call`:if(e.name===`select`){if(e.args.length!==3)throw Error(`select() expects 3 arguments`);return c(e.args[0],`bool`),c(e.args[1],`num`),c(e.args[2],`num`)}var o=a[e.name];if(o===void 0){if(r.FUNCTIONS[e.name])throw Error(`Laws work on numbers; `+e.name+`() is for vectors`);var s=n[e.name];if(!s||typeof s.value!=`function`)throw Error(`Unknown function in law expression: `+e.name);o=1}if(e.args.length!==o)throw Error(e.name+`() expects `+o+` argument(s)`);return e.args.forEach(function(e){c(e,`num`)}),`num`}throw Error(`Unknown law node `+e.type);function c(e,r){var i=h(e,t,n);if(i!==r)throw Error(r===`num`?`A condition is used as a number in a law (use select(condition, 1, 0))`:`Expected a condition (such as a < b) in a law`);return i}}function g(e,t){return e.type===`var`?e.name===t:b(e).some(function(e){return g(e,t)})}function _(e,t){e.type===`var`&&t(e.name),b(e).forEach(function(e){_(e,t)})}function v(e){switch(e.type){case`num`:return x(e.value);case`var`:return e.name===`pi`?x(Math.PI):e.name===`D`?`D`:`law_`+e.name;case`neg`:return`(-`+v(e.a)+`)`;case`not`:return`(!`+v(e.a)+`)`;case`bin`:return e.op===`^`?o.call(`pow`,[v(e.a),v(e.b)]):`(`+v(e.a)+` `+o.operator(e.op)+` `+v(e.b)+`)`;case`call`:var t=e.args.map(v);return e.name===`select`?o.choose(t[0],t[1],t[2]):a[e.name]?o.call(e.name,t):`functions.`+e.name+`.value(`+t.join(`, `)+`)`}}function y(e,t){switch(e.type){case`num`:return e.value;case`var`:return e.name===`D`?t:e.name===`pi`?Math.PI:NaN;case`neg`:return-y(e.a,t);case`bin`:var n=y(e.a,t),r=y(e.b,t);if(e.op===`+`)return n+r;if(e.op===`-`)return n-r;if(e.op===`*`)return n*r;if(e.op===`/`)return n/r;if(e.op===`^`)return n**+r}return NaN}function b(e){return r.children(e)}function x(e){var t=String(e);return e<0?`(`+t+`)`:t}function S(e,t){for(var n=[],r=``,i=e.length-1;i>=0;--i)(!t[i]||RegExp(`\\b`+t[i]+`\\b`).test(r))&&(n.unshift(e[i]),r+=` `+e[i]);return n}function C(e,t,n,i,o,s){var c=[],l=[],u=0,d=i+`_`,f=new Map,p=v(e,o!==void 0);if(p.dividend===void 0?h(s.result(i,p.v+` / `+n)):h(s.result(i,p.dividend+` / (`+p.divisor+` * `+n+`)`)),o!==void 0){var m=p.d===null?s.number(0):p.d;h(s.result(o,`(`+i+` - `+m+`) / (`+n+` * `+n+`)`))}return S(c,l).join(` `);function h(e,t){c.push(e),l.push(t||null)}function g(e){if(/^[\w.]+$/.test(e))return e;var t=d+u++;return h(s.declare(t,e,`temp`),t),t}function _(e){return e.d===null}function v(e,t){var n=f.get(e);return n||(n=b(e,t),f.set(e,n)),n}function b(e,r){if(e.hoisted){var i=y(e,t);return{v:Number.isFinite(i)?s.number(i):e.hoisted,d:null}}switch(e.type){case`num`:return{v:s.number(e.value),d:null};case`var`:return e.name===`r`?{v:n,d:s.number(1)}:e.name===`D`?{v:s.number(t),d:null}:e.name===`pi`?{v:s.number(Math.PI),d:null}:{v:`law_`+e.name,d:null};case`neg`:var a=v(e.a,r);return{v:g(`-`+a.v),d:a.d===null?null:g(`-`+a.d)};case`not`:return{v:g(`!`+v(e.a,r).v),d:null};case`bin`:return x(e,r);case`call`:return T(e,r)}}function x(e,t){if(e.op===`^`)return C(v(e.a,t),e.b,t);var n=v(e.a,t),i=v(e.b,t);if(r.isCondition(e))return{v:g(n.v+` `+s.operator(e.op)+` `+i.v),d:null};if(e.reciprocal){var a=e.reciprocal;return{v:g(n.v+` * `+a),d:t&&!_(n)?g(n.d+` * `+a):null}}var o=g(n.v+` `+e.op+` `+i.v),c=e.op===`/`?{v:o,d:null,dividend:n.v,divisor:i.v}:{v:o,d:null};return!t||_(n)&&_(i)||(c.d=g(e.op===`+`||e.op===`-`?_(n)?e.op===`+`?i.d:`-`+i.d:_(i)?n.d:n.d+` `+e.op+` `+i.d:e.op===`*`?_(n)?n.v+` * `+i.d:_(i)?n.d+` * `+i.v:n.d+` * `+i.v+` + `+n.v+` * `+i.d:_(i)?n.d+` / `+i.v:_(n)?`-`+o+` * `+i.d+` / `+i.v:`(`+n.d+` - `+o+` * `+i.d+`) / `+i.v)),c}function C(e,n,r){var i=v(n,r),a,o=null;if(_(i)){var c=y(n,t);return a=g(Number.isInteger(c)&&c>=-4&&c<=4?w(e.v,c):s.call(`pow`,[e.v,i.v])),r&&!_(e)&&(o=g(i.v+` * `+a+` / `+e.v+` * `+e.d)),{v:a,d:o}}if(a=g(s.call(`pow`,[e.v,i.v])),r){var l=[i.d+` * `+s.call(`log`,[e.v])];_(e)||l.push(i.v+` * `+e.d+` / `+e.v),o=g(a+` * (`+l.join(` + `)+`)`)}return{v:a,d:o}}function w(e,t){if(t===0)return s.number(1);for(var n=[],r=0;r<Math.abs(t);++r)n.push(e);var i=n.join(` * `);return t>0?`(`+i+`)`:s.number(1)+` / (`+i+`)`}function T(e,t){var n=e.args.map(function(e){return v(e,t)}),i=n[0],o=n[1],c,l=null,u=n.every(_);if(e.name===`select`)return c=g(s.choose(i.v,o.v,n[2].v)),t&&!(_(o)&&_(n[2]))&&(l=g(s.choose(i.v,_(o)?s.number(0):o.d,_(n[2])?s.number(0):n[2].d))),{v:c,d:l};if(e.name===`pow`)return C(i,e.args[1],t);var d=a[e.name]?r.BUILTINS[e.name]:null;if(d)return c=g(s.call(e.name,n.map(function(e){return e.v}))),t&&!u&&d.derivative&&(l=g(d.derivative(s,n,c))),{v:c,d:l};if(c=g(`lawFunctions.`+e.name+`.value(`+i.v+`)`),t&&!u){var f=`lawFunctions.`+e.name+`.derivative`;l=g(`(`+f+` ? `+f+`(`+i.v+`) : 0) * `+i.d)}return{v:c,d:l}}}}}),Kl=jl({"lib/repulsionLaw.js"(e,t){var n=null;t.exports=i,t.exports.parse=function(e){return a().parse(e)},t.exports.presets={inverseSquare:function(){return{force:`r^-2`,isInverseSquare:!0}},power:function(e){return{force:`r^-p`,params:{p:e}}},fading:function(e){return{force:`exp(-r / L) / r^2`,params:{L:e}}}};var r=`r^-2`;t.exports.DEFAULT_KEY=r;function i(e){if(e||=t.exports.presets.inverseSquare(),typeof e==`string`&&(e={force:e}),typeof e.force!=`string`)throw Error("A repulsion law needs a `force` expression of r");return o(e)?c(e):a()(e)}function a(){return n||=Gl(),n}function o(e){return e.force.replace(/\s+/g,``)===r&&e.range===void 0&&s(e.params)&&s(e.tables)&&s(e.functions)}function s(e){return!e||Object.keys(e).length===0}function c(e){var t=null;function n(){return t||=a()(e),t}return{key:r+`|||`,tableNames:[],isDefault:!0,hasRange:!1,paramNames:[],functions:{},spec:e,get values(){return n().values},update:function(){},describe:function(){return{force:e.force,params:[],builtIns:[],range:null,tables:[],functions:[],isDefault:!0,key:r+`|||`}},prologue:function(e){return n().prologue(e)},emit:function(e,t,r,i,a){return n().emit(e,t,r,i,a)}}}}}),ql=jl({"lib/spring.js"(e,t){t.exports=n;function n(e,t,n,r,i,a){this.from=e,this.to=t,this.store=i||null,this.index=i?a:-1,this.writes=i&&i.writes||null,this.ownLength=n,this.ownCoefficient=r}Object.defineProperties(n.prototype,{length:{get:function(){return this.store===null?this.ownLength:this.store.length[this.index]},set:function(e){if(this.store===null)this.ownLength=e;else{this.store.length[this.index]=e;var t=this.writes;t!==null&&(t.length=!0,t.any=!0)}},enumerable:!0},coefficient:{get:function(){return this.store===null?this.ownCoefficient:this.store.coefficient[this.index]},set:function(e){if(this.store===null)this.ownCoefficient=e;else{this.store.coefficient[this.index]=e;var t=this.writes;t!==null&&(t.coefficient=!0,t.any=!0)}},enumerable:!0}}),n.prototype.moveTo=function(e,t){this.store=e,this.index=t,this.writes=e.writes||null},n.prototype.detach=function(){this.store!==null&&(this.ownLength=this.store.length[this.index],this.ownCoefficient=this.store.coefficient[this.index],this.store=null,this.index=-1,this.writes=null)},n.prototype.toJSON=function(){return{from:this.from,to:this.to,length:this.length,coefficient:this.coefficient}}}}),Jl=jl({"node_modules/ngraph.merge/index.js"(e,t){t.exports=n;function n(e,t){var r;if(e||={},t){for(r in t)if(t.hasOwnProperty(r)){var i=e.hasOwnProperty(r),a=typeof t[r];!i||typeof e[r]!==a?e[r]=t[r]:a===`object`&&(e[r]=n(e[r],t[r]))}}return e}}}),Yl=jl({"node_modules/ngraph.events/index.js"(e,t){t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}}}),Xl=jl({"node_modules/ngraph.random/index.js"(e,t){t.exports=n,t.exports.random=n,t.exports.randomIterator=l;function n(e){return new r(typeof e==`number`?e:+new Date)}function r(e){this.seed=e}r.prototype.next=c,r.prototype.nextDouble=s,r.prototype.uniform=s,r.prototype.gaussian=i;function i(){var e,t,n;do t=this.nextDouble()*2-1,n=this.nextDouble()*2-1,e=t*t+n*n;while(e>=1||e===0);return t*Math.sqrt(-2*Math.log(e)/e)}r.prototype.levy=a;function a(){var e=3/2,t=(o(1+e)*Math.sin(Math.PI*e/2)/(o((1+e)/2)*e*2**((e-1)/2)))**(1/e);return this.gaussian()*t/Math.abs(this.gaussian())**(1/e)}function o(e){return Math.sqrt(2*Math.PI/e)*(1/Math.E*(e+1/(12*e-1/(10*e))))**e}function s(){var e=this.seed;return e=e+2127912214+(e<<12)|0,e=e^3345072700^e>>>19,e=e+374761393+(e<<5)|0,e=e+3550635116^e<<9,e=e+4251993797+(e<<3)|0,e=e^3042594569^e>>>16,this.seed=e,(e&268435455)/268435456}function c(e){return Math.floor(this.nextDouble()*e)}function l(e,t){var r=t||n();if(typeof r.next!=`function`)throw Error(`customRandom does not match expected API: next() function is missing`);return{forEach:a,shuffle:i};function i(){for(var t=e.length-1,n,i;t>0;--t)n=r.next(t+1),i=e[n],e[n]=e[t],e[t]=i;return e}function a(t){for(var n=e.length-1,i,a;n>0;--n)i=r.next(n+1),a=e[i],e[i]=e[n],e[n]=a,t(a);e.length&&t(e[0])}}}}),Zl=jl({"lib/createNeighborGrid.js"(e,t){t.exports=r;function n(e){for(var t=3**e,n=new Int32Array(t*e),r=0;r<t;++r)for(var i=r,a=0;a<e;++a)n[r*e+a]=i%3-1,i=i/3|0;return n}function r(e){var t=e,r=1,i=0,a=null,o=null,s=new Int32Array,c=new Int32Array,l=new Int32Array,u=new Int32Array(1),d=0,f=new Int32Array,p=new Int32Array(t),m=3**t,h=n(t),g={build:_,forEachPair:C,forEachNeighbor:S,applyPairRule:w,cellSize:function(){return r},internals:function(){return{n:i,cells:s,bucketStart:u,sorted:l,tableMask:d,offsets:h,offsetCount:m}}};return g;function _(e,n){if(!(n>0))throw Error(`Grid cells need a positive size`);o=e,a=e.pos,i=e.n,r=n,s.length<i*t&&(s=new Int32Array(i*t),c=new Int32Array(i),l=new Int32Array(i));for(var p=1;p<2*i;)p*=2;u.length===p+1?u.fill(0):u=new Int32Array(p+1),d=p-1;for(var m=0;m<i;++m){for(var h=0;h<t;++h)s[m*t+h]=Math.floor(a[m*t+h]/n);var _=v(s,m*t);c[m]=_,u[_+1]+=1}for(var y=0;y<p;++y)u[y+1]+=u[y];for(f.length!==p&&(f=new Int32Array(p)),f.set(u.subarray(0,p)),m=0;m<i;++m)l[f[c[m]]++]=m;return g}function v(e,n){for(var r=374761393,i=0;i<t;++i)r=Math.imul(r^e[n+i],668265261),r^=r>>>15;return r&d}function y(e){for(var n=0;n<t;++n)if(s[e*t+n]!==p[n])return!1;return!0}function b(e,n){for(var r=0,i=0;i<t;++i){var o=a[e*t+i]-a[n*t+i];r+=o*o}return Math.sqrt(r)}function x(e,n){for(var r=0;r<t;++r)p[r]=s[e*t+r]+h[n*t+r];return v(p,0)}function S(e,t,n){for(var r=0;r<m;++r)for(var i=x(e,r),a=u[i],o=u[i+1];a<o;++a){var s=l[a];if(s!==e&&y(s)){var c=b(e,s);c<t&&n(s,c)}}}function C(e,t){for(var n=0;n<i;++n)for(var r=0;r<m;++r)for(var a=x(n,r),o=u[a],s=u[a+1];o<s;++o){var c=l[o];if(!(c<=n||!y(c))){var d=b(n,c);d<e&&t(n,c,d)}}}function w(e,n,r){var i=o.force;C(e,function(e,s,c){var l=n(e,s,c,o),u=r?l:n(s,e,c,o);if(l||u){if(c===0){var d=((e*2654435761^s*40503)>>>0)%t;Number.isFinite(l)&&(i[e*t+d]-=l),Number.isFinite(u)&&(i[s*t+d]+=u)}else for(var f=0;f<t;++f){var p=a[e*t+f]-a[s*t+f];i[e*t+f]+=l*p,i[s*t+f]-=u*p}}})}}}}),Ql=jl({"lib/codeGenerators/generateDualTree.js"(e,t){t.exports=n,t.exports.generateDualTreeFunctionBody=r;function n(e,t){let n=r(e,t);return Function(n)()}function r(e,t){let n=t&&!t.isDefault,r=n&&t.hasRange,i=[];for(let t=0;t<e;++t)i.push(t);let a=(e,t)=>i.map(e).join(t===void 0?`
`:t),o=[];for(let t=0;t<e;++t)for(let n=t;n<e;++n)o.push([t,n]);let s=(e,t)=>o.findIndex(([n,r])=>n===e&&r===t||n===t&&r===e),c=(e,t)=>i.map(n=>`j${s(e,n)} * ${t}${n}`).join(` + `),l=e===2?.875:1;return`
var D = ${e};
var JN = ${o.length};
var LEAF_SIZE = 16;
var MAX_DEPTH = 60;
var THETA_SCALE = ${l};

return function createDualTree(settings, law) {
  // Values of the law's parameters, refreshed by the simulator every step:
  var lawValues = law ? law.values : null;
  var lawFunctions = law ? law.functions : null;
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

  // Adds the push to the force of every body that is not pinned. \`charge\` is the column of
  // charges (masses by default): how hard bodies push. \`sensitivity\` is how strongly they
  // feel the push (the charge by default).
  function computeForces(store, charge, sensitivity) {
    if (store.n === 0) return;
    charge = charge || store.mass;
    sensitivity = sensitivity || charge;
    buildTree(store, charge);
    walk(settings.theta * THETA_SCALE);
    pushDown();

    var gravity = settings.gravity;
    var force = store.force, pinned = store.pinned;
    for (var i = 0; i < n; ++i) {
      if (pinned[i]) continue;
      var k = rank[i];
      var g = gravity * sensitivity[i];
      ${a(e=>`force[i * D + ${e}] += g * field[k * D + ${e}];`,`
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

  function buildTree(store, bodyMass) {
    ensureBodies(store.n);

    ${a(e=>`var min${e} = Infinity, max${e} = -Infinity;`,`
    `)}
    // Bodies are read in their own order (it is cheaper to jump in the tree order arrays):
    var bodyPos = store.pos;
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    for (var i = 0; i < n; ++i) {
      var k = rank[i];
      mass[k] = bodyMass[i];
      ${a(e=>`var p${e} = bodyPos[i * D + ${e}]; pos[k * D + ${e}] = p${e};`,`
      `)}
      ${a(e=>`if (p${e} < min${e}) min${e} = p${e}; if (p${e} > max${e}) max${e} = p${e};`,`
      `)}
    }

    var side = 0;
    ${a(e=>`if (max${e} - min${e} > side) side = max${e} - min${e};`,`
    `)}
    ${a(e=>`cellMin[0][${e}] = min${e};`,` `)}
    cellSide[0] = side * (1 + 1e-9) + 1e-9;
    nodeCount = 0;
    buildNode(0, n, 0);
    for (var i = 0; i < n; ++i) rank[order[i]] = i;
    ensureNodeData();

    // Children come after parents, so we can aggregate bottom up in reverse order:
    for (var node = nodeCount - 1; node >= 0; --node) {
      var m = 0, r = 0;
      ${a(e=>`var s${e} = 0;`,` `)}
      if (nodeSkip[node] === node + 1) {
        // Leaf: center of mass of its bodies, radius is the farthest body.
        var start = nodeStart[node], end = nodeEnd[node];
        for (var k = start; k < end; ++k) {
          var w = mass[k];
          m += w;
          ${a(e=>`s${e} += w * pos[k * D + ${e}];`,` `)}
        }
        var weight = m;
        if (m === 0) {
          // No charge here (it pushes nobody): the plain middle of its bodies
          ${a(e=>`s${e} = 0;`,` `)}
          for (var k = start; k < end; ++k) { ${a(e=>`s${e} += pos[k * D + ${e}];`,` `)} }
          weight = end - start;
        }
        ${a(e=>`var c${e} = s${e} / weight;`,` `)}
        var r2 = 0;
        for (var k = start; k < end; ++k) {
          ${a(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          var q2 = ${a(e=>`h${e} * h${e}`,` + `)};
          if (q2 > r2) r2 = q2;
        }
        r = Math.sqrt(r2);
      } else {
        // Internal node: aggregate children, radius bounds every child's sphere.
        var skip = nodeSkip[node];
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          var w = nodeMass[c];
          m += w;
          ${a(e=>`s${e} += w * nodeCenter[c * D + ${e}];`,` `)}
        }
        var weight = m;
        if (m === 0) {
          ${a(e=>`s${e} = 0;`,` `)}
          weight = 0;
          for (var c = node + 1; c < skip; c = nodeSkip[c]) {
            var count = nodeEnd[c] - nodeStart[c];
            weight += count;
            ${a(e=>`s${e} += count * nodeCenter[c * D + ${e}];`,` `)}
          }
        }
        ${a(e=>`var c${e} = s${e} / weight;`,` `)}
        for (var c = node + 1; c < skip; c = nodeSkip[c]) {
          ${a(e=>`var h${e} = nodeCenter[c * D + ${e}] - c${e};`,` `)}
          var q = Math.sqrt(${a(e=>`h${e} * h${e}`,` + `)}) + nodeRadius[c];
          if (q > r) r = q;
        }
      }
      nodeMass[node] = m;
      nodeRadius[node] = r;
      ${a(e=>`nodeCenter[node * D + ${e}] = c${e}; localField[node * D + ${e}] = 0;`,`
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
      ${a(e=>`childMin[${e}] = parentMin[${e}] + ((bits >> ${e}) & 1) * half;`,`
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
      ${a(e=>`t = pos[a + ${e}]; pos[a + ${e}] = pos[b + ${e}]; pos[b + ${e}] = t;`,`
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
    ${n?`var r, k1, k2; `+t.prologue(`lawValues`):``}
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

      ${a(e=>`var d${e} = nodeCenter[b * D + ${e}] - nodeCenter[a * D + ${e}];`,` `)}
      var r2 = ${a(e=>`d${e} * d${e}`,` + `)};
      var radiusA = nodeRadius[a], radiusB = nodeRadius[b], radii = radiusA + radiusB;
      ${r?`r = Math.sqrt(r2);
      // All pairs of these two cells are out of the law's range:
      if (r - radii > lawRange) continue;`:``}
      if (radii * radii < theta2 * r2) {
        // Far enough: exchange fields of the two cells, both ways.
        ${n?`${r?``:`r = Math.sqrt(r2);`}
        ${t.emit(e,`r`,`k1`,`k2`)}
        var inv3 = k1, inv5 = k2;`:`var inv2 = 1 / r2, inv3 = Math.sqrt(inv2) * inv2, inv5 = 3 * inv3 * inv2;`}
        var massA = nodeMass[a], massB = nodeMass[b];
        var fieldA = a * D, fieldB = b * D, jacobianA = a * JN, jacobianB = b * JN;
        ${a(e=>`var k${e} = d${e} * inv3; localField[fieldA + ${e}] += massB * k${e}; localField[fieldB + ${e}] -= massA * k${e};`,`
        `)}
        ${o.map(([e,t],n)=>`var j${n} = d${e} * d${t} * inv5${e===t?` - inv3`:``}; localJacobian[jacobianA + ${n}] += massB * j${n}; localJacobian[jacobianB + ${n}] += massA * j${n};`).join(`
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
    ${n?`var r, k1; `+t.prologue(`lawValues`):``}
    for (var i = startA; i < endA; ++i) {
      ${a(e=>`var x${e} = pos[i * D + ${e}];`,` `)}
      var massI = mass[i];
      ${a(e=>`var a${e} = 0;`,` `)}
      for (var j = sameCell ? i + 1 : startB; j < endB; ++j) {
        ${a(e=>`var d${e} = pos[j * D + ${e}] - x${e};`,` `)}
        var r2 = ${a(e=>`d${e} * d${e}`,` + `)};
        if (r2 === 0) {
          // Two bodies at the same position: push them apart as if they were a unit
          // distance apart, along an axis picked from their ids (deterministic and bounded).
          var lo = order[i] < order[j] ? order[i] : order[j];
          var hi = order[i] < order[j] ? order[j] : order[i];
          var axis = (((lo * 2654435761) ^ (hi * 40503)) >>> 0) % D;
          var sign = order[i] < order[j] ? 1 : -1;
          ${a(e=>`d${e} = axis === ${e} ? sign : 0;`,` `)}
          r2 = 1;
        }
        ${n?`r = Math.sqrt(r2);
        ${r?`if (r > lawRange) continue;`:``}
        ${t.emit(e,`r`,`k1`)}
        var inv3 = k1;`:`var inv3 = 1 / (r2 * Math.sqrt(r2));`}
        var massJ = mass[j] * inv3, massII = massI * inv3;
        ${a(e=>`a${e} += massJ * d${e}; field[j * D + ${e}] -= massII * d${e};`,`
        `)}
      }
      ${a(e=>`field[i * D + ${e}] += a${e};`,` `)}
    }
  }

  // Pushes local expansions from parents to children, and from leaves to bodies.
  function pushDown() {
    for (var node = 0; node < nodeCount; ++node) {
      var offset = node * D, jacobian = node * JN, skip = nodeSkip[node];
      ${a(e=>`var c${e} = nodeCenter[offset + ${e}], g${e} = localField[offset + ${e}];`,` `)}
      ${o.map((e,t)=>`var j${t} = localJacobian[jacobian + ${t}];`).join(` `)}
      if (skip === node + 1) {
        for (var k = nodeStart[node], end = nodeEnd[node]; k < end; ++k) {
          ${a(e=>`var h${e} = pos[k * D + ${e}] - c${e};`,` `)}
          ${a(e=>`field[k * D + ${e}] += g${e} + ${c(e,`h`)};`,`
          `)}
        }
        continue;
      }
      for (var c = node + 1; c < skip; c = nodeSkip[c]) {
        var childOffset = c * D, childJacobian = c * JN;
        ${a(e=>`var h${e} = nodeCenter[childOffset + ${e}] - c${e};`,` `)}
        ${a(e=>`localField[childOffset + ${e}] += g${e} + ${c(e,`h`)};`,`
        `)}
        ${o.map((e,t)=>`localJacobian[childJacobian + ${t}] += j${t};`).join(` `)}
      }
    }
  }
};

function grow(ArrayType, array, size) {
  var bigger = new ArrayType(size);
  if (array) bigger.set(array.subarray(0, Math.min(array.length, size)));
  return bigger;
}
`}}}),$l=jl({"lib/codeGenerators/generateFireIntegrator.js"(e,t){var n=Nl(),r=Vl().inertiaColumn;t.exports=i,t.exports.generateFireIntegratorFunctionBody=a;function i(e,t){let n=a(e,t);return Function(n)}function a(e,t){let i=n(e);return`
  var ALPHA_START = 0.1;
  var ALPHA_DECAY = 0.99;
  var MIN_POSITIVE_STEPS = 5;

  var alpha = ALPHA_START;
  var positiveSteps = 0;

  return function integrate(store, timeStep, adaptiveTimeStepWeight, maxVelocity) {
    var length = store.n;
    if (length === 0) return 0;
    var pos = store.pos, velocity = store.velocity, force = store.force, mass = ${r(t)};
    var pinned = store.pinned, springCount = store.springCount, springLength = store.springLength;

    var i, offset;
    var power = 0, velocityNorm = 0, forceNorm = 0;
    for (i = 0; i < length; ++i) {
      if (pinned[i]) continue;
      offset = i * ${e};
      ${i(`var f{var} = force[offset{+k}], v{var} = velocity[offset{+k}];`,{indent:6})}
      power += ${i(`f{var} * v{var}`,{join:` + `})};
      velocityNorm += ${i(`v{var} * v{var}`,{join:` + `})};
      forceNorm += ${i(`f{var} * f{var}`,{join:` + `})};
    }

    if (power > 0) {
      // Going downhill: steer velocities towards forces, and trust momentum more over time.
      var keep = 1 - alpha;
      var mix = forceNorm > 0 ? alpha * Math.sqrt(velocityNorm / forceNorm) : 0;
      for (i = 0; i < length; ++i) {
        if (pinned[i]) continue;
        offset = i * ${e};
        ${i(`velocity[offset{+k}] = keep * velocity[offset{+k}] + mix * force[offset{+k}];`,{indent:8})}
      }
      positiveSteps += 1;
      if (positiveSteps > MIN_POSITIVE_STEPS) alpha *= ALPHA_DECAY;
    } else {
      // Going uphill (we overshot): stop everything and start from rest.
      for (i = 0; i < length; ++i) {
        if (pinned[i]) continue;
        offset = i * ${e};
        ${i(`velocity[offset{+k}] = 0;`,{indent:8})}
      }
      positiveSteps = 0;
      alpha = ALPHA_START;
    }

    ${i(`var d{var} = 0, t{var} = 0;`,{indent:4})}
    var maxV = maxVelocity > 0 ? maxVelocity : 1;

    for (i = 0; i < length; ++i) {
      if (pinned[i]) continue;

      var dt = timeStep;
      if (adaptiveTimeStepWeight && springCount[i]) {
        dt = (adaptiveTimeStepWeight * springLength[i]/springCount[i]);
      }

      var coeff = dt / mass[i];
      offset = i * ${e};

      ${i(`velocity[offset{+k}] += coeff * force[offset{+k}];`,{indent:6})}
      ${i(`var u{var} = velocity[offset{+k}];`,{indent:6})}
      var v = Math.sqrt(${i(`u{var} * u{var}`,{join:` + `})});

      if (v > maxV) {
        ${i(`velocity[offset{+k}] = maxV * u{var} / v;`,{indent:8})}
      }

      ${i(`d{var} = dt * velocity[offset{+k}];`,{indent:6})}

      ${i(`pos[offset{+k}] += d{var};`,{indent:6})}

      ${i(`t{var} += Math.abs(d{var});`,{indent:6})}
    }

    return (${i(`t{var} * t{var}`,{join:` + `})})/length;
  };
`}}}),eu=jl({"lib/formulaStages.js"(e,t){var n=Wl(),r=n.BUILT_IN_VALUES;t.exports.node=u,t.exports.link=d,t.exports.pair=p,t.exports.sum=m,t.exports.gate=h,t.exports.describeValue=A;var i=Object.create(null),a={from:!0,to:!0,length:!0,coefficient:!0},o={springCount:!0,springLength:!0},s={pos:!0,velocity:!0,force:!0},c={"=":`set`,"+=":`add`,"-=":`add`,"*=":`scale`,"/=":`scale`},l=`$prologue$`;function u(e,t,n){var r=j(e,t,n),i=r.scope(v(r,`$i`,`$o`,`any`)),a=P(n.formula,i,t),o=r.prologue();return o.push(`var $n = $store.n;`),o.push(`for (var $i = 0; $i < $n; ++$i) {`),o.push(`  var $o = $i * `+r.D+`;`),F(a.lines,o),o.push(`}`),r.stage(o,`node`,`nodes`)}function d(e,t,n){var r=j(e,t,n),i=r.D,a=[],o=b(r,a),s=!1,c=!1;o.r.onRead=function(){c=!0};var l=C(`$pull`);o.pull={type:`num`,code:`$pull`,write:function(e,t){return s=!0,l(e,t)}};var u=P(n.formula,r.scope(o),t);r.checkAccumulators(a);var d=r.startAtZero(a),p=n.replace===`springs`,m=s||p;(m||c)&&E(r,`pos`);var h;return m?(h=[],f(h,u.lines,i,p,d.map(function(e){return k(r,e)})),r.wrote({space:`nodes`,column:`force`,mode:`add`,via:`pull`})):(h=r.prologue(),O(r,d,h),h.push(`var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;`),c&&h.push(`var $pos = $store.pos;`),h.push(`var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;`),h.push(`for (var $s = $springs.n - 1; $s >= 0; --$s) {`),h.push(`  var $i = $from[$s], $j = $to[$s];`),h.push(`  var $oi = $i * `+i+`, $oj = $j * `+i+`;`),h.push(`  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];`),c&&(h.push(`  `+I(i,function(e){return`var $d`+e+` = $pos[$oj + `+e+`] - $pos[$oi + `+e+`];`})),h.push(`  var $r = Math.sqrt(`+I(i,function(e){return`$d`+e+` * $d`+e},` + `)+`);`)),h.push(`  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;`),F(u.lines,h),h.push(`}`)),r.stage(h,`link`,`links`,{replace:n.replace===void 0?null:n.replace,counters:!1,startAtZero:d},function(t){p&&e.settings.adaptiveTimeStepWeight!==0&&(t.args.counters=!0,t.writes.push({space:`nodes`,column:`springCount`,mode:`add`},{space:`nodes`,column:`springLength`,mode:`add`}))})}function f(e,t,n,r,i){var a=[l,`var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;`,`var $pos = $store.pos, $force = $store.force;`,`var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;`];r&&a.push(`var $springCount = $store.springCount, $springLength = $store.springLength;`);var o=[`var $i = $from[$s], $j = $to[$s];`,`var $oi = $i * `+n+`, $oj = $j * `+n+`;`,`var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];`],s=[`var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;`,`var $pull = 0;`].concat(t,[`var $k = $pull / $r;`,I(n,function(e){return`$force[$oi + `+e+`] += $k * $d`+e+`;`}),I(n,function(e){return`$force[$oj + `+e+`] -= $k * $d`+e+`;`})]),c=`$springCount[$i] += 1; $springLength[$i] += $r; $springCount[$j] += 1; $springLength[$j] += $r;`,u=`$s, $store, $springs, $values, $sums, $tables`,d=function(t,r){e.push(`function `+t+`(`+u+`) {`),F(a,e),e.push(`  while ($s--) {`),F(o,e,`    `),e.push(`    `+I(n,function(e){return`var $d`+e+` = $pos[$oj + `+e+`] - $pos[$oi + `+e+`];`})),e.push(`    var $r = Math.sqrt(`+I(n,function(e){return`$d`+e+` * $d`+e},` + `)+`);`),e.push(`    if ($r === 0) return $s;`),F(s,e,`    `),r&&e.push(`    `+c),e.push(`  }`),e.push(`  return -1;`),e.push(`}`)};d(`$links`,!1),r&&d(`$linksWithCounters`,!0),e.push(`// ends on the same spot: pull along a random direction`),e.push(`function $sameSpot(`+u+`, $random) {`),F(a,e),F(o,e),e.push(`  `+I(n,function(e){return`var $d`+e+` = ($random.nextDouble() - 0.5) / 50;`})),e.push(`  var $r = Math.sqrt(`+I(n,function(e){return`$d`+e+` * $d`+e},` + `)+`);`),F(s,e),r&&e.push(`  if ($values.$stats) { `+c+` }`),e.push(`}`),e.push(`return function ($store, $springs, $values, $sums, $tables, $random) {`),F(i,e),e.push(`  var $loop = `+(r?`$values.$stats ? $linksWithCounters : $links`:`$links`)+`;`),e.push(`  for (var $s = $springs.n; ($s = $loop(`+u+`)) >= 0;) $sameSpot(`+u+`, $random);`),e.push(`};`)}function p(e,t,n){if(n.radius===void 0)throw Error(`Pair formula `+t+` needs a radius`);var r=j(e,t,n),i=r.D,a=n.symmetric!==!1,o=[],s=x(r,o,a,!1),c=P(n.formula,r.scope(s),t),l=null;a||(l=P(n.formula,r.scope(x(r,[],!1,!0),!0),t)),r.checkAccumulators(o);var u=r.startAtZero(o);E(r,`pos`);var d=r.global(n.radius,`radius`),f=r.prologue();f.push(`var $radius = $values.$radius;`),f.push(`var $reach2 = $radius * $radius * (1 + 1e-12);`),f.push(`if (!($reach2 > 1e-290)) $reach2 = Infinity;`),O(r,u,f),f.push(`if (!($radius > 0)) return;`),f.push(`var $grid = $simulator.neighbors($radius).internals();`),f.push(`var $n = $grid.n, $cells = $grid.cells, $bucketStart = $grid.bucketStart, $sorted = $grid.sorted;`),f.push(`var $tableMask = $grid.tableMask, $offsets = $grid.offsets, $offsetCount = $grid.offsetCount;`),f.push(`var $pos = $store.pos, $force = $store.force;`),f.push(`for (var $i = 0; $i < $n; ++$i) {`),f.push(`  var $oi = $i * `+i+`;`),f.push(`  `+I(i,function(e){return`var $c`+e+` = $cells[$oi + `+e+`];`})),f.push(`  `+I(i,function(e){return`var $x`+e+` = $pos[$oi + `+e+`];`})),f.push(`  for (var $cell = 0; $cell < $offsetCount; ++$cell) {`),f.push(`    `+I(i,function(e){return`var $m`+e+` = $c`+e+` + $offsets[$cell * `+i+` + `+e+`];`})),f.push(`    var $hash = 0x165667b1;`);for(var p=0;p<i;++p)f.push(`    $hash = Math.imul($hash ^ $m`+p+`, 0x27d4eb2d); $hash ^= $hash >>> 15;`);return f.push(`    var $bucket = $hash & $tableMask;`),f.push(`    for (var $at = $bucketStart[$bucket], $end = $bucketStart[$bucket + 1]; $at < $end; ++$at) {`),f.push(`      var $j = $sorted[$at];`),f.push(`      if ($j <= $i) continue;`),f.push(`      var $oj = $j * `+i+`;`),f.push(`      // a bucket can hold bodies of other cells too`),f.push(`      if (`+I(i,function(e){return`$cells[$oj + `+e+`] !== $m`+e},` || `)+`) continue;`),f.push(`      `+I(i,function(e){return`var $d`+e+` = $x`+e+` - $pos[$oj + `+e+`];`})),f.push(`      var $r2 = `+I(i,function(e){return`$d`+e+` * $d`+e},` + `)+`;`),f.push(`      if (!($r2 <= $reach2)) continue;`),f.push(`      var $r = Math.sqrt($r2);`),f.push(`      // bodies on the same spot have no direction to push along`),f.push(`      if (!($r < $radius) || $r === 0) continue;`),f.push(`      var $push = 0;`),f.push(`      {`),F(c.lines,f,`        `),f.push(`      }`),f.push(`      var $pushI = $push;`),l&&(f.push(`      $push = 0;`),f.push(`      {`),F(l.lines,f,`        `),f.push(`      }`)),f.push(`      var $pushJ = $push;`),f.push(`      if (!$pushI && !$pushJ) continue;`),f.push(a?`      var $si = $pushI / $r, $sj = $si;`:`      var $si = $pushI / $r, $sj = $pushJ / $r;`),f.push(`      `+I(i,function(e){return`$force[$oi + `+e+`] += $si * $d`+e+`;`})),f.push(`      `+I(i,function(e){return`$force[$oj + `+e+`] -= $sj * $d`+e+`;`})),f.push(`    }`),f.push(`  }`),f.push(`}`),r.wrote({space:`nodes`,column:`force`,mode:`add`,via:`push`}),r.stage(f,`pair`,`pairs`,{radius:A(d),symmetric:a,startAtZero:u})}function m(e,t,n){var r=j(e,t,n),i=r.D,a=n.over===`links`;if(n.over!==void 0&&n.over!==`nodes`&&!a)throw Error(`Sum `+t+` should be over nodes or links`);var o=n.reduce||`sum`;if(o!==`sum`&&o!==`min`&&o!==`max`)throw Error(`Sum `+t+`: reduce should be sum, min or max`);var s=a?b(r,null):v(r,`$i`,`$o`,null),c=P(n.formula,r.scope(s),t);a&&E(r,`pos`);var l=c.result;if(!l)throw Error(`Sum `+t+` should end with the expression to add up`);var u=l.type===`vec`?i:1,d=l.codes||[l.code],f=o===`sum`?`0`:o===`min`?`Infinity`:`-Infinity`,p=n.group;if(p!==void 0){if(!(a?e.springStore:e.store).has(p))throw Error(`Sum `+t+`: no `+(a?`link`:`body`)+` column named `+p);r.read({space:a?`links`:`nodes`,column:p,rows:`own`})}var m={width:u,grouped:p!==void 0,value:new Float64Array(u),groups:new Float64Array,count:0};m.value.fill(+f);var h=r.prologue();h.push(`var $result = $sums[`+JSON.stringify(t)+`];`),a&&(h.push(`var $from = $springs.from, $to = $springs.to, $restLength = $springs.length, $springCoefficient = $springs.coefficient;`),h.push(`var $pos = $store.pos;`),h.push(`var $defaultLength = $values.$springLength, $defaultCoefficient = $values.$springCoefficient;`));var g=a?`$springs.n`:`$store.n`,_=a?`$s`:`$i`,y=`  `;if(p!==void 0)h.push(`var $group = `+(a?`$springs`:`$store`)+`[`+JSON.stringify(p)+`];`),h.push(`var $count = $result.count, $max = -1, `+_+`;`),h.push(`for (;;) {`),h.push(`  var $acc = $result.resize($count);`),h.push(`  $max = -1;`),y=`    `;else for(var x=0;x<u;++x)h.push(`var $acc`+x+` = `+f+`;`);var S=[];if(S.push(`for (`+_+` = 0; `+_+` < `+g+`; ++`+_+`) {`),p!==void 0&&(S.push(`  var $g = $group[`+_+`];`),S.push(`  if (!($g >= 0)) continue;`),S.push(`  $g = Math.floor($g);`),S.push(`  if ($g >= $count) break;`),S.push(`  if ($g > $max) $max = $g;`),u>1&&S.push(`  $g *= `+u+`;`)),a?(S.push(`  var $i = $from[$s], $j = $to[$s];`),S.push(`  var $oi = $i * `+i+`, $oj = $j * `+i+`;`),S.push(`  var $length = $restLength[$s] < 0 ? $defaultLength : $restLength[$s];`),S.push(`  var $coefficient = $springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient;`),S.push(`  var $r = Math.sqrt(`+I(i,function(e){return`($pos[$oj + `+e+`] - $pos[$oi + `+e+`]) * ($pos[$oj + `+e+`] - $pos[$oi + `+e+`])`},` + `)+`);`)):S.push(`  var $o = $i * `+i+`;`),F(c.lines,S),d.forEach(function(e,t){var n=p===void 0?`$acc`+t:`$acc[$g + `+t+`]`;S.push(`  `+n+` = `+(o===`sum`?n+` + `+e:`Math.`+o+`(`+n+`, `+e+`)`)+`;`)}),S.push(`}`),p===void 0)for(S[0]=S[0].replace(`for (`,`for (var `),S.forEach(function(e){h.push(e)}),x=0;x<u;++x)h.push(`$result.value[`+x+`] = $acc`+x+`;`);else F(S,h,y.slice(2)),h.push(`  if (`+_+` === `+g+`) break;`),h.push(`  $count = 0;`),h.push(`  for (`+_+` = 0; `+_+` < `+g+`; ++`+_+`) if ($group[`+_+`] >= $count) $count = Math.floor($group[`+_+`]) + 1;`),h.push(`}`),h.push(`$result.count = $max + 1;`);m.resize=function(e){return m.groups.length<e*u&&(m.groups=new Float64Array(Math.max(e,2*m.count)*u)),m.count=e,m.groups.fill(+f,0,e*u),m.groups};var C=r.stage(h,`sum`,a?`links`:`nodes`,{over:a?`links`:`nodes`,reduce:o,group:p===void 0?null:p,width:u});return C.result=m,C}function h(e,t,n,r){if(typeof n==`function`)return{test:n,describe:function(){return{kind:`host`}}};var i=j(e,t,{formula:``,params:r}).when(n);return{test:function(e){return i.test(e)},describe:function(){return{kind:`expression`,text:n}}}}var g=new WeakMap;function _(e,t,n,i){var a=g.get(e);if(a||g.set(e,a=Object.create(null)),a[t])return a[t];var o={},s=null,c=-1,l=!1;return a[t]={params:[],builtIns:n,test:function(e,t){var a=e.iteration();if(t===void 0&&e===s&&a===c)return l;for(var u=t||o,d=0;d<n.length;++d)u[`$`+n[d]]=r[n[d]](e);var f=i(u);return t===void 0&&(s=e,c=a,l=f),f}}}function v(e,t,n,r){var i=Object.create(null);return e.store.names().forEach(function(a){if(!o[a]){var s=y(e,a,t,n,r?null:[],null);s&&(i[a]=s)}}),i}function y(e,t,n,r,i,a){var o=D(e.store,t),s=`$c_`+t,c,l;if(o===1)c=s+`[`+n+`]`,l={type:`num`,code:c};else if(o===e.D){c=[];for(var u=0;u<o;++u)c.push(s+`[`+r+` + `+u+`]`);l={type:`vec`,codes:c}}else return null;return l.write=i&&i.length===0?null:w(e,c,{space:`nodes`,column:t,end:a}),i&&(l.ops=i),l.column=t,l.end=a,l}function b(e,t){var n=Object.create(null);return n.r={type:`num`,code:`$r`},n.length={type:`num`,code:`$length`,builtInColumn:`length`},n.coefficient={type:`num`,code:`$coefficient`,builtInColumn:`coefficient`},t&&(n.length.ops=n.coefficient.ops=[`=`],n.length.write=T(e,`length`,`$restLength`,`$length`,`$restLength[$s] < 0 ? $defaultLength : $restLength[$s]`),n.coefficient.write=T(e,`coefficient`,`$springCoefficient`,`$coefficient`,`$springCoefficient[$s] > 0 ? $springCoefficient[$s] : $defaultCoefficient`)),e.springStore.names().forEach(function(r){if(!a[r]){if(n[r])throw Error(`Link column `+r+` has the name of a value link formulas know`);var i=`$l_`+r;n[r]={type:`num`,code:i+`[$s]`,linkColumn:r,write:t?w(e,i+`[$s]`,{space:`links`,column:r,end:null}):null}}}),S(e,n,t,!0,!1),n}function x(e,t,n,r){var i=Object.create(null);return i.r={type:`num`,code:`$r`},i.push={type:`num`,code:`$push`,write:C(`$push`)},S(e,i,t,n,r),i}function S(e,t,n,r,i){var a=i?[[`_i`,`$j`,`$oj`],[`_j`,`$i`,`$oi`]]:[[`_i`,`$i`,`$oi`],[`_j`,`$j`,`$oj`]];e.store.names().forEach(function(i){o[i]||a.forEach(function(a){var o=n&&(a[0]===`_i`||r),s=y(e,i,a[1],a[2],o?[`+=`,`-=`]:[],a[0].slice(1));if(s){if(o){var c=s.write;s.write=function(e,t){return n.indexOf(i)<0&&n.push(i),c(e,t)}}t[i+a[0]]=s}})})}function C(e){var t=Array.isArray(e)?e:[e];return function(e,n){var r=n.codes||[n.code];return t.map(function(t,n){return t+` `+e+` `+r[n]+`;`})}}function w(e,t,n){var r=C(t);return function(t,i){if(n.space===`nodes`&&n.column===`pos`)throw Error(`pos is read only in formulas: only integrate and host steps move bodies`);return e.wrote({space:n.space,column:n.column,mode:c[t],op:t,end:n.end}),r(t,i)}}function T(e,t,n,r,i){return function(a,o){return e.wrote({space:`links`,column:t,mode:c[a],op:a}),[n+`[$s] = `+o.code+`;`,r+` = `+i+`;`]}}function E(e,t){e.read({space:`nodes`,column:t,rows:`other`,end:`i`}),e.read({space:`nodes`,column:t,rows:`other`,end:`j`})}function D(e,t){return e.sizeOf(t)}function O(e,t,n){t.forEach(function(t){n.push(k(e,t))})}function k(e,t){return`$store[`+JSON.stringify(t)+`].fill(0, 0, $store.n * `+D(e.store,t)+`);`}function A(e){return typeof e==`number`?{kind:`number`,value:e}:typeof e==`string`?{kind:`expression`,text:e}:{kind:`host`}}function j(e,t,a){if(!a||typeof a.formula!=`string`)throw Error(`Formula stage `+t+" needs a `formula` string");var o=e.store,c=o.D,u=e.stepContext(),d=a.params||{},f=Object.keys(d),p={};Object.keys(a.tables||{}).forEach(function(e){p[e]=n.createTable(e,a.tables[e])});var m=e.sums();f.forEach(function(e){if(!/^[A-Za-z_]\w*$/.test(e))throw Error(`Bad parameter name `+e+` in `+t);if(o.has(e)||p[e]||m[e]||r[e]||e===`D`||e===`pi`)throw Error(`Parameter `+e+` of `+t+` has the name of a column, table, sum or built in value`)});var h=[],g=Object.create(null),v=[],y=Object.create(null),b=Object.create(null),x=Object.create(null),S=[],C={},w=null,T=[],E=[],D={D:c,store:o,springStore:e.springStore,scope:function(e,t){return{D:c,name:function(n,r){return j(e,n,r||t)}}},global:function(e,n){if(typeof e==`number`||typeof e==`function`)return S.push({key:n,read:e}),e;if(typeof e!=`string`)throw Error(n+` of `+t+` should be a number, a function or an expression`);var r=P(e,{D:c,name:k},t);if(!r.result||r.result.type!==`num`)throw Error(n+` of `+t+` should be an expression giving a number`);var i=r.lines.join(`
`)+`
return `+r.result.code+`;`;return S.push({key:n,read:Function(`$values`,i),compiled:!0}),e},when:function(n){if(typeof n!=`string`)throw Error(`when of `+t+` should be an expression or a function of the step context`);var i=[],a=[],o=P(n,{D:c,condition:!0,name:function(e){if(Object.prototype.hasOwnProperty.call(d,e))return i.indexOf(e)<0&&i.push(e),{type:`num`,code:`$values[`+JSON.stringify(e)+`]`};if(r[e])return a.indexOf(e)<0&&a.push(e),{type:`num`,code:`$values.$`+e}}},t);if(!o.result)throw Error(`when of `+t+` should end with a condition, such as step > 100`);var s=Function(`$values`,o.lines.join(`
`)+`
return `+o.result.code+`;`);if(i.length===0)return _(e,n,a,s);var l={};return{params:i,builtIns:a,test:function(e,t){t||=l;for(var n=0;n<i.length;++n){var o=d[i[n]];t[i[n]]=typeof o==`function`?o(e):o}for(n=0;n<a.length;++n)t[`$`+a[n]]=r[a[n]](e);return s(t)}}},read:function(e){M(T,e)},wrote:function(e){M(E,e)},checkAccumulators:function(e){T.forEach(function(n){if(n.space===`nodes`&&(n.column===`force`||e.indexOf(n.column)>=0))throw Error(t+` reads `+n.column+`_`+n.end+`, which it adds into; a link or pair formula sees no partial sums (read it in a later stage)`)})},startAtZero:function(e){var n=a.startAtZero||[];if(!Array.isArray(n))throw Error(`startAtZero of `+t+` should be a list of column names`);return n.forEach(function(n){if(s[n])throw Error(`startAtZero of `+t+` cannot zero `+n+`: it holds the state of bodies`);if(e.indexOf(n)<0)throw Error(`startAtZero of `+t+` names `+n+`, which the formula does not add into`)}),E.forEach(function(e){e.mode===`add`&&e.space===`nodes`&&n.indexOf(e.column)>=0&&(e.startAtZero=!0)}),n.slice()},prologue:function(){return h},stage:function(e,n,r,o,s){var c=typeof a.when==`function`?a.when:null;a.when!==void 0&&!c&&(w=D.when(a.when));var m=w?w.params:[],g=f.filter(function(e){return m.indexOf(e)<0}),_=v.concat((w?w.builtIns:[]).filter(function(e){return v.indexOf(e)<0})),S=O();Object.keys(b).forEach(function(e){S.push(`var $c_`+e+` = $store[`+JSON.stringify(e)+`];`),S.push(`if (!$c_`+e+`) throw new Error(`+JSON.stringify(t+` reads the body column `+e+`, which is gone`)+`);`)}),Object.keys(x).forEach(function(e){S.push(`var $l_`+e+` = $springs[`+JSON.stringify(e)+`];`),S.push(`if (!$l_`+e+`) throw new Error(`+JSON.stringify(t+` reads the link column `+e+`, which is gone`)+`);`)}),Object.keys(p).forEach(function(e){S.push(`var $T_`+e+` = $tables[`+JSON.stringify(e)+`];`)});var k=e.some(function(e){return e.indexOf(l)>=0}),j;if(k){var M=[];e.forEach(function(e){var t=e.indexOf(l);t<0?M.push(e):S.forEach(function(n){M.push(e.slice(0,t)+n)})}),j=M.join(`
`)}else h.unshift.apply(h,S),j=e.join(`
`);var P=i[j];P||=i[j]=k?Function(j)():Function(`$store`,`$springs`,`$values`,`$sums`,`$tables`,`$random`,`$simulator`,j);var I=c?{kind:`host`}:w?{kind:`expression`,text:a.when}:null,L=c||(w?w.params.length?function(e){return w.test(e,C)}:function(e){return w.test(e)}:null);return{run:function(e,t){(L===null||L(u))&&(F(u,C,g),P(e,t.springStore,C,t.sums(),p,t.random,t))},values:function(e){var t={},n=c?!!c(e):!w||!!w.test(e,t);F(e,t,g);var r={params:{},when:n,builtIns:{}};return f.forEach(function(e){r.params[e]=t[e]}),_.forEach(function(e){r.builtIns[e]=t[`$`+e]}),t.$radius!==void 0&&(r.radius=t.$radius),r},describe:function(){var e={shape:n,builtIn:null,space:r,when:I,formula:a.formula,reads:T.map(N),writes:E.map(N),params:f.map(function(e){var t=A(d[e]);return t.name=e,t}),builtIns:_.slice(),tables:Object.keys(p).map(function(e){return{name:e,from:p[e].from,to:p[e].to,values:p[e].values}}),sums:Object.keys(y),args:Object.assign({},o),code:j};return s&&s(e),e}}}};return D;function O(){var e=[];return Object.keys(g).forEach(function(t){e.push(`var $p_`+t+` = $values[`+JSON.stringify(t)+`];`)}),v.forEach(function(t){e.push(`var $b_`+t+` = $values.$`+t+`;`)}),Object.keys(y).forEach(function(n){e.push(`var $sum_`+n+` = $sums[`+JSON.stringify(n)+`];`),e.push(`if (!$sum_`+n+`) throw new Error(`+JSON.stringify(t+` reads the sum `+n+`, which is gone`)+`);`),m[n].grouped?e.push(`var $g_`+n+` = $sum_`+n+`.groups, $gn_`+n+` = $sum_`+n+`.count;`):e.push(`var $s_`+n+` = $sum_`+n+`.value;`)}),e}function k(e){if(Object.prototype.hasOwnProperty.call(d,e))return{type:`num`,code:`$values[`+JSON.stringify(e)+`]`};if(r[e])return v.indexOf(e)<0&&v.push(e),{type:`num`,code:`$values.$`+e}}function j(e,n,i){var a=e[n];if(a&&(r[n]||n===`D`||n===`pi`))throw Error(t+`: `+n+` is both a column and a built in value; give the column another name`);if(a)return!i&&a.onRead&&a.onRead(),a.column&&(b[a.column]=!0,i||D.read({space:`nodes`,column:a.column,rows:a.end?`other`:`own`,end:a.end})),a.linkColumn&&(x[a.linkColumn]=!0,i||D.read({space:`links`,column:a.linkColumn,rows:`own`})),a.builtInColumn&&!i&&D.read({space:`links`,column:a.builtInColumn,rows:`own`}),a;if(Object.prototype.hasOwnProperty.call(d,n))return g[n]=!0,{type:`num`,code:`$p_`+n};if(p[n])return{call:function(e){return`$T_`+n+`.value(`+e[0]+`)`}};var o=m[n];if(o){y[n]=!0;var s=o.width;if(o.grouped)return{index:function(e){var t=function(t){return`(`+e+` >= 0 && `+e+` < $gn_`+n+` ? $g_`+n+`[Math.floor(`+e+`) * `+s+` + `+t+`] : 0)`};if(s===1)return{type:`num`,code:t(0)};for(var r=[],i=0;i<s;++i)r.push(t(i));return{type:`vec`,codes:r}}};if(s===1)return{type:`num`,code:`$s_`+n+`[0]`};for(var c=[],l=0;l<s;++l)c.push(`$s_`+n+`[`+l+`]`);return{type:`vec`,codes:c}}if(r[n])return v.indexOf(n)<0&&v.push(n),{type:`num`,code:`$b_`+n}}function F(e,t,i){i||=f;for(var a=0;a<i.length;++a){var o=d[i[a]];t[i[a]]=typeof o==`function`?o(e):o}for(a=0;a<v.length;++a)t[`$`+v[a]]=r[v[a]](e);var s=n.liveSettings(e);for(t.$springLength=s.springLength,t.$springCoefficient=s.springCoefficient,t.$stats=s.adaptiveTimeStepWeight!==0,a=0;a<S.length;++a){var c=S[a];t[`$`+c.key]=typeof c.read==`number`?c.read:c.compiled?c.read(t):c.read(e)}}}function M(e,t){for(var n=JSON.stringify(t),r=0;r<e.length;++r)if(JSON.stringify(e[r])===n)return;e.push(t)}function N(e){var t={};return Object.keys(e).forEach(function(n){e[n]!==null&&e[n]!==void 0&&(t[n]=e[n])}),t}function P(e,t,r){try{return n.compile(e,t)}catch(e){throw e.message=r+`: `+e.message,e}}function F(e,t,n){n||=`  `,e.forEach(function(e){t.push(n+e)})}function I(e,t,n){for(var r=[],i=0;i<e;++i)r.push(t(i));return r.join(n===void 0?` `:n)}}}),tu=jl({"lib/describeProgram.js"(e,t){t.exports.clear=n,t.exports.drag=r,t.exports.springs=i,t.exports.integrate=a,t.exports.tree=o,t.exports.stage=f,t.exports.builtInValues=d,t.exports.program=p,t.exports.plan=h;function n(){return{shape:`node`,builtIn:`clear`,space:`nodes`,reads:[s(`pinned`)],writes:[l(`force`),l(`springCount`),l(`springLength`)],formula:`force = pinned != 0 ? force : 0 * force`}}function r(e){return{shape:`node`,builtIn:`drag`,space:`nodes`,reads:[s(`pinned`),s(`velocity`)],writes:[u(`force`)],formula:`force -= pinned == 0 ? dragCoefficient * velocity : 0 * velocity`,builtIns:[`dragCoefficient`],args:{skipped:e.integrator===`fire`}}}function i(e){var t=e.adaptiveTimeStepWeight!==0,n=[u(`force`)];return n[0].via=`pull`,t&&n.push(u(`springCount`),u(`springLength`)),{shape:`link`,builtIn:`springs`,space:`links`,reads:[c(`pos`,`i`),c(`pos`,`j`),{space:`links`,column:`length`,rows:`own`},{space:`links`,column:`coefficient`,rows:`own`}],writes:n,formula:`pull = coefficient * (r - length)`,builtIns:[`springLength`,`springCoefficient`],args:{counters:t}}}function a(e){var t=e.adaptiveTimeStepWeight!==0,n=[s(`pinned`),s(`force`),s(`velocity`),s(`pos`),s(e.inertia)];return t&&n.push(s(`springCount`),s(`springLength`)),{shape:`integrate`,builtIn:`integrate`,space:`nodes`,reads:n,writes:[l(`velocity`),l(`pos`)],builtIns:[`timeStep`,`maxVelocity`],args:{integrator:e.integrator,inertia:e.inertia,maxVelocity:e.maxVelocity,adaptiveTimeStepWeight:e.adaptiveTimeStepWeight}}}function o(e,t,n,r,i){var a=n.charge(),o=n.sensitivity();return{shape:`tree`,builtIn:e,space:`tree`,reads:[s(`pos`),c(`pos`,null),c(a,null),s(o),s(`pinned`)],writes:[u(`force`)],builtIns:[`gravity`,`theta`],args:{channels:[{law:t.describe(),charge:a,sensitivity:o,centroid:n.centroid}],theta:r.theta,nbody:r.nbody,walk:i}}}function s(e){return{space:`nodes`,column:e,rows:`own`}}function c(e,t){var n={space:`nodes`,column:e,rows:`other`};return t&&(n.end=t),n}function l(e){return{space:`nodes`,column:e,mode:`set`}}function u(e){return{space:`nodes`,column:e,mode:`add`}}function d(e,t){e.builtInNames||=f(e).builtIns;var n={};if(e.builtInNames.length===0)return n;var r=Wl().BUILT_IN_VALUES;return e.builtInNames.forEach(function(e){n[e]=r[e](t)}),n}function f(e){var t=e.describe?e.describe():{shape:`js`},n={name:e.name,shape:t.shape,builtIn:t.builtIn||null,when:e.gate?e.gate.describe():t.when||null,space:t.space||(t.shape===`js`||t.shape===`pair rules`?`none`:t.shape),reads:t.reads||[],writes:t.writes||[],formula:t.formula||null,params:t.params||[],builtIns:t.builtIns||[],tables:t.tables||[],sums:t.sums||[],args:t.args||{}};return Object.keys(t).forEach(function(e){!(e in n)&&e!==`code`&&(n[e]=t[e])}),n}function p(e){var t=e.stages.map(f),n=e.dimensions,r={version:e.version,dims:n,spaces:{nodes:e.nodes,links:e.links},settings:{},columns:{nodes:m(e.store,`nodes`,t,n),links:m(e.springStore,`links`,t,n)},tables:[],sums:[],stages:t,hostSteps:[],listeners:{}},i=e.settings;Object.keys(i).forEach(function(e){var t=i[e];(typeof t==`number`||typeof t==`string`||typeof t==`boolean`)&&(r.settings[e]=t)}),t.forEach(function(e){e.tables.forEach(function(t){r.tables.push({stage:e.name,name:t.name,from:t.from,to:t.to,values:t.values})}),e.shape===`sum`&&r.sums.push({name:e.name,over:e.args.over,group:e.args.group,reduce:e.args.reduce,width:e.args.width,when:e.when}),e.shape===`host`&&r.hostSteps.push({name:e.name,when:e.when,reads:e.reads,writes:e.writes})});var a=e.listenerCounts;return Object.keys(a).forEach(function(e){a[e].length&&(r.listeners[e]=a[e].length)}),r}function m(e,t,n,r){return e.names().map(function(i){var a=e.sizeOf(i),o=[],s=null,c=!1;n.forEach(function(e){e.writes.some(function(e){return e.space===t&&e.column===i})&&(o.push(e.name),e.builtIn?c=!0:e.shape!==`host`&&s===null&&(s=e.name))});var l={name:i,width:a===1?1:a===r?`D`:a,type:e.typeOf(i),writer:c?`engine`:s===null?`host`:`stage:`+s,writers:o};return t===`nodes`&&(i===`springCount`||i===`springLength`)&&(l.hidden=!0),l})}function h(e,t,n){var r=[],i=g(e);if(t||(i=i.concat(_(e))),t&&t.checkProgram){var a=t.checkProgram(e,n)||[];Array.isArray(a)&&(a={reasons:a}),r=r.concat(a.reasons||[]),i=i.concat(a.warnings||[])}var o=e.stages.map(function(r){var a=t?t.check(r,e,n):{runs:!0,how:b(r)},o={stage:r.name,shape:r.shape,runs:a.runs};return a.runs?o.how=a.how:o.reason=a.reason,r.shape===`host`&&(o.cost=v(r,e)),(a.warnings||[]).forEach(function(e){i.push(r.name+`: `+e)}),o});return o.forEach(function(e){e.runs||r.push(e.stage+`: `+e.reason)}),{backend:t?t.name:`cpu`,runs:r.length===0,reasons:r,warnings:i,stages:o}}function g(e){var t=[];return e.stages.forEach(function(n,r){n.shape===`host`&&!n.when&&t.push(n.name+": a host step without `when` runs on the host every step"),!(n.shape!==`link`&&n.shape!==`pair`||n.builtIn||n.when)&&n.writes.forEach(function(i){if(!(i.mode!==`add`||i.startAtZero||i.space!==`nodes`||i.via)){var a=e.stages.some(function(e,t){return t!==r&&e.writes.some(function(e){return e.space===`nodes`&&e.column===i.column&&(e.mode===`set`||e.mode===`host`||e.startAtZero)})}),o=i.column+` only grows: `+n.name+` adds into it every step and nothing sets it; list it in startAtZero`;!a&&t.indexOf(o)<0&&t.push(o)}})}),t}function _(e){return e.settings.nbody===`dualtree`?e.stages.filter(function(e){var t=e.args&&e.args.walk;return t&&t.index===0&&t.charges>1}).map(function(e){return`nbody 'dualtree' does not apply to tree passes walked together (`+e.args.walk.stages.join(`, `)+`): they walk one quad tree`}):[]}function v(e,t){var n=0,r=[];e.reads.forEach(function(e){for(var i=t.columns[e.space]||[],a=0;a<i.length;++a)i[a].name===e.column&&(n+=i[a].width===`D`?t.dims:i[a].width,r.push(e.column))});var i=r.length?`reads `+r.join(`, `)+` (`+n+`·n numbers)`:`reads nothing`,a=e.writes.length?`writes `+e.writes.map(function(e){return e.column}).join(`, `):`writes nothing`;return(e.when?"on the steps where `when` holds: ":`every step: `)+i+`, `+a}var y={"built in":`built in`,tree:`tree walk with the law compiled in`,node:`generated loop over bodies`,link:`generated loop over links`,sum:`generated loop`,pair:`generated loop over grid neighbors`,"pair rules":`grid neighbors, a call per pair`,host:`JavaScript function, inline`,js:`JavaScript function`};function b(e){var t=e.args&&e.args.walk;return t&&t.charges>1?t.index===0?`one quad tree walk with `+t.charges+` charges: `+t.stages.join(`, `):`in the walk of `+t.stages[0]:e.builtIn?y[`built in`]:typeof e.how==`string`?e.how:y[e.shape]||`add-on stage (`+e.shape+`)`}}}),nu=jl({"lib/createPhysicsSimulator.js"(e,t){t.exports=x;var n=Il(),r=Ll(),i=Rl(),a=zl(),o=Bl(),s=Vl(),c=Hl(),l=Fl(),u=Ul(),d=Kl(),f,p,m=ql(),h=l.copyBody,g=Ml(),_={},v={},y={},b=.001;function x(e){var t=Jl(),f=Yl();if(e){if(e.springCoeff!==void 0)throw Error(`springCoeff was renamed to springCoefficient`);if(e.dragCoeff!==void 0)throw Error(`dragCoeff was renamed to dragCoefficient`)}if(e=t(e,{springLength:10,springCoefficient:.8,gravity:-12,theta:.8,dragCoefficient:.9,timeStep:.5,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,repulsionCharge:`mass`,repulsionSensitivity:``,inertia:`mass`,adaptiveTimeStepWeight:0,dimensions:2,debug:!1}),e.repulsionLaw===void 0&&(e.repulsionLaw=null),e.integrator!==`euler`&&e.integrator!==`fire`)throw Error(`Unknown integrator: `+e.integrator+". Expected `euler` or `fire`");if(e.nbody!==`quadtree`&&e.nbody!==`dualtree`)throw Error(`Unknown nbody: `+e.nbody+". Expected `quadtree` or `dualtree`");var p=e.dimensions,x=_[p];x||(x={Body:n(p,e.debug),createBounds:i(p),createDragForce:a(p),createSpringForce:o(p),integrate:s(p),createFireIntegrator:null,clearForces:c(p)},_[p]=x);var S=x.Body,w,T=Xl().random(42),O=l(p),I=[];O.onResize=function(){for(var e=0;e<I.length;++e)I[e].moveTo(O,I[e].index)};var L=[],R=u(),z=[],ee=[],B=null,te=[],ne=!1,re=d(e.repulsionLaw),ie,ae,V=x.createBounds(O,e,T),oe=x.createSpringForce(e,T),se=x.createDragForce(e),ce,H=[],U=Object.create(null),le=0,ue=0,W=0,de=null,fe=Object.create(null),pe=De(function(){return ue}),me=[],he=-1,ge=[];ye(`clear`,Ve,null,Se(`clear`));var _e=ye(`repulsion`,He,null,function(){return Ce(`repulsion`,re,_e.tree)});_e.law=function(){return re},_e.tree=Pe(`repulsion`,He,function(){return e.repulsionCharge},function(){return e.repulsionSensitivity||e.repulsionCharge},_e.law,`own`),ye(`drag`,Ge,null,Se(`drag`)),ye(`springs`,Ke,null,Se(`springs`)),ye(`integrate`,qe,null,Se(`integrate`));var ve={bodies:I,store:O,springs:L,springStore:R,settings:e,stages:function(){return ge.map(function(e){return e.name})},addStage:function(e,t,n){var r=n&&n.describe;if(r!==void 0&&typeof r!=`function`){var i=r;r=function(){return i}}var a=ye(e,t,n,r);n&&typeof n.values==`function`&&(a.values=n.values)},replaceStage:function(e,t){var n=ze(e);if(!n)throw Error(`No stage named `+e);var r=n.run;n.first||={run:r,describe:n.describe,law:n.law,values:n.values};var i=t===n.first.run;return n.run=t,n.describe=i?n.first.describe:xe,n.law=i?n.first.law:null,n.values=i?n.first.values:null,n.builtInNames=null,W+=1,r},removeStage:function(e){var t=Be(e);if(t<0)return!1;var n=ge[t];return n.replaced?ge.splice(t,1,n.replaced):ge.splice(t,1),n.dispose&&n.dispose(),W+=1,!0},addHostStep:function(e,t){if(!t||typeof t.run!=`function`)throw Error(`Host step `+e+` needs a run(simulator) function`);var n=t.run;ye(e,function(){n(ve)},t,function(){return{shape:`host`,space:`none`,reads:(t.reads||[]).map(Te),writes:(t.writes||[]).map(function(e){var t=Te(e);return t.mode=`host`,t})}})},addNodeFormula:function(e,t){be(e,A().node(ve,e,t),t)},addLinkFormula:function(e,t){be(e,A().link(ve,e,t),t)},addPairFormula:function(e,t){var n=t;t&&t.before===void 0&&t.after===void 0&&t.replace===void 0&&(n=ze(`springs`)?{after:`springs`}:void 0),be(e,A().pair(ve,e,t),n)},addSum:function(e,t){if(U[e])throw Error(`Sum `+e+` is already added`);var n=Wl().BUILT_IN_VALUES;if(!/^[A-Za-z_]\w*$/.test(e)||n[e]||e===`D`||e===`pi`||O.has(e))throw Error(`Sum `+e+` needs a name that is not a column or a built in value`);var r=A().sum(ve,e,t);r.dispose=function(){delete U[e]},be(e,r,t),U[e]=r.result},sums:function(){return U},addRepulsion:function(e,t){if(t||={},t.centroid!==void 0&&t.centroid!==`own`&&t.centroid!==`shared`)throw Error(e+`: unknown centroid `+t.centroid+". Expected `own` or `shared`");var n=Ne(e,t),r=be(e,n,t);r.law=n.law,r.tree=n.tree},program:function(){return Ee()},stageValues:function(e,t){var n=ze(e);if(!n)throw Error(`No stage named `+e);t||=pe;var r=n.values?n.values(t):{when:!0};if(n.gate&&(r.when=!!n.gate.test(t)),r.builtIns||=j().builtInValues(n,t),n.law){var i=n.law();i.update(t),r.law=i,r.lawValues=Object.assign({},i.values)}return r},programVersion:function(){return W+O.columnsVersion+R.columnsVersion},stepContext:function(e){return e===void 0?pe:De(function(){return e})},plan:function(e){return j().plan(Ee(),e,ve)},inertia:function(t){if(t===void 0)return e.inertia;if(typeof t!=`string`||!O.has(t))throw Error(`No body column named `+t+` for inertia`);if(O.sizeOf(t)!==1)throw Error(`Inertia column `+t+` should have one number per body`);return t!==e.inertia&&(e.inertia=t,W+=1,ve.fire(`settings`,`inertia`,t)),ve},watchListeners:function(e){Me(e)},getStage:function(e){var t=ze(e);return t&&t.run},repulsionLaw:function(t){return t===void 0?re:(re=d(t),e.repulsionLaw=t,ie=ae=null,W+=1,ve.fire(`settings`,`repulsionLaw`,t),ve)},addPairRule:function(e,t){if(!t||typeof t.rule!=`function`)throw Error(`Pair rule needs a rule(i, j, r, store) function`);if(H.some(function(t){return t.name===e}))throw Error(`Pair rule `+e+` is already added`);ze(`pairRules`)||ye(`pairRules`,Ye,ze(`springs`)?{after:`springs`}:void 0,function(){return{shape:`pair rules`,rules:H.map(function(e){return e.name})}}),W+=1,H.push({name:e,radius:t.radius,rule:t.rule,symmetric:t.symmetric!==!1})},removePairRule:function(e){for(var t=0;t<H.length;++t)if(H[t].name===e)return H.splice(t,1),W+=1,H.length===0&&ve.removeStage(`pairRules`),!0;return!1},neighbors:function(e){return ce||=Zl()(p),ce.build(O,e),ce},unit:Ae,iteration:function(e){if(e===void 0)return ue;if(!(Number.isInteger(e)&&e>=0))throw Error(`Step count should be a whole number, not `+e);return ue=e,ve},applyEdits:function(){return tt(),ne&&(ne=!1,O.changed(),R.changed(),ve.fire(`topology`)),ve},step:function(){ve.applyEdits();for(var e=0;e<ge.length;++e)ge[e].run(O,ve);return ue+=1,le},addBody:function(e){if(!e)throw Error(`Body is required`);if(e.store===O)throw Error(`Body is already in this simulator`);var t=O.add();return h(e.store,e.index,O,t),O.degree[t]=0,e.moveTo(O,t),I.push(e),ne=!0,e},addBodyAt:function(e){if(!e)throw Error(`Body position is required`);Xe(e);var t=O.add();Ze(t,e);var n=S.inStore(O,t);return I.push(n),ne=!0,n},removeBody:function(e){if(e&&e.store===O){var t=e.index;O.degree[t]>0&&et(e),B||(B=l(p),B.onResize=nt);var n=B.add();return h(O,t,B,n),z.push(t),I.splice(N(I,t),1),e.moveTo(B,n),te.push(e),ne=!0,I.length===0&&V.reset(),!0}},addSpring:function(e,t,n,r){if(!e||!t)throw Error(`Cannot add null spring to force simulator`);if(e.store!==O||t.store!==O)throw Error(`Spring ends should be bodies of this simulator. Use addBody() first`);typeof n!=`number`&&(n=-1);var i=R.add();R.from[i]=e.index,R.to[i]=t.index,R.length[i]=n,R.coefficient[i]=r>=0?r:-1;var a=new m(e,t,void 0,void 0,R,i);return L.push(a),O.degree[e.index]+=1,O.degree[t.index]+=1,ne=!0,a},getTotalMovement:function(){return le},removeSpring:function(e){if(e&&e.store===R)return $e(e),!0},getBestNewBodyPosition:function(e){return V.getBestNewPosition(e)},getBBox:Qe,getBoundingBox:Qe,random:T};return F(e,ve,je),f(ve),Me(ve),ve;function ye(e,t,n,r){if(typeof t!=`function`)throw Error(`Stage `+e+` needs a function`);if(ze(e))throw Error(`Stage `+e+` is already added`);var i={name:e,run:t,describe:r,replaced:null,dispose:null,first:null,gate:null,law:null,values:null,builtInNames:null},a=n?n.when:void 0;if(a!==void 0&&!(n&&n.formulaGate)){var o=i.gate=A().gate(ve,e,a,n.params),s=t;i.run=function(e,t){o.test(pe)&&s(e,t)}}W+=1;var c=ge.length,l=n?n.before:void 0,u=n?n.after:void 0,d=n?n.replace:void 0;if(d!==void 0){if(c=Be(d),c<0)throw Error(`No stage named `+d);return i.replaced=ge[c],ge[c]=i,i}if(l!==void 0||u!==void 0){if(c=Be(l===void 0?u:l),c<0)throw Error(`No stage named `+(l===void 0?u:l));u!==void 0&&(c+=1)}else{var f=Be(`integrate`);f>=0&&(c=f)}return ge.splice(c,0,i),i}function be(e,t,n){var r=n;n&&n.when!==void 0&&t.values&&(r={before:n.before,after:n.after,replace:n.replace,formulaGate:!0});var i=ye(e,t.run,r,t.describe);return i.dispose=t.dispose||null,i.values=t.values||null,i}function xe(){return{shape:`js`}}function Se(t){return function(){return j()[t](e)}}function Ce(t,n,r){return j().tree(t,n,r,e,we(r))}function we(t){he!==W&&Fe();var n=t.group;return n?{stages:n.members.map(function(e){return e.name}),index:n.members.indexOf(t),charges:n.members.length,tree:`quadtree`}:{stages:[t.name],index:0,charges:1,tree:e.nbody}}function Te(e){return typeof e==`string`?{space:`nodes`,column:e}:{space:e.space||`nodes`,column:e.column}}function Ee(){return j().program({version:ve.programVersion(),dimensions:p,nodes:I.length,links:L.length,settings:e,store:O,springStore:R,stages:ge,listenerCounts:fe})}function De(t){var n=Object.create(E(Object.keys(e)));return n.iteration=t,n.settings=Oe(),n.store=ke(),Object.freeze(n)}function Oe(){var t=new C(e);return Object.keys(e).forEach(function(e){Object.defineProperty(t,e,{get:k(e),enumerable:!0})}),Object.freeze(t)}function ke(){return Object.freeze(new D(O))}function Ae(){var t=e.springLength;return t>b?t:b}function je(e,t,n){(e===`integrator`||e===`nbody`||e===`repulsionCharge`||e===`repulsionSensitivity`||e===`adaptiveTimeStepWeight`&&t===0!=(n===0))&&(W+=1),ve.fire(`settings`,e,n)}function Me(e){var t=e.on,n=e.off;e.on=function(n,r,i){return t(n,r,i),fe[n]||(fe[n]=[]),fe[n].push(r),e},e.off=function(t,r){return n(t,r),Object.keys(fe).forEach(function(e){(t===void 0||e===t)&&(fe[e]=typeof r==`function`?fe[e].filter(function(e){return e!==r}):[])}),e}}function Ne(t,n){var r=d(n.law),i,a,o=Pe(t,s,c,l,function(){return r},n.centroid||`own`);return{law:o.law,tree:o,run:s,describe:function(){return Ce(null,r,o)}};function s(){if(O.n!==0&&!Ie(o)){r.update(pe);var n=O[c()];if(!n)throw Error(t+`: no body column named `+c()+` for charges`);var s=O[l()];if(!s)throw Error(t+`: no body column named `+l()+` for sensitivity`);if(e.nbody===`dualtree`)a||=Ue(r).createDualTree(e,We(r)),a.computeForces(O,n,s);else{i||=Ue(r).createQuadTree(e,T,We(r)),i.options(e),i.insertBodies(O,n,s);for(var u=O.pinned,d=O.n;d--;)!u[d]&&s[d]!==0&&i.updateBodyForce(d)}}}function c(){return n.charge||e.repulsionCharge}function l(){return n.sensitivity||n.charge||e.repulsionCharge}}function Pe(e,t,n,r,i,a){var o={name:e,run:t,charge:n,sensitivity:r,law:i,centroid:a,group:null};return me.push(o),o}function Fe(){if(he=W,me.forEach(function(e){e.group=null}),!r.preGenerated)for(var e=[],t=0;t<=ge.length;++t){var n=ge[t],i=n&&n.tree&&n.run===n.tree.run&&!n.gate?n.tree:null;if(i)e.push(i);else{if(e.length>1){var a={members:e,laws:null,tree:null,charges:[],sensitivities:[]};e.forEach(function(e){e.group=a})}e=[]}}}function Ie(e){he!==W&&Fe();var t=e.group;return t?(t.members[0]===e&&Le(t),!0):!1}function Le(t){var n=t.members,r=n.length;t.tree||=Re(t);for(var i=t.charges,a=t.sensitivities,o=0;o<r;++o){var s=n[o];t.laws[o].update(pe);var c=s.charge(),l=s.sensitivity();if(i[o]=O[c],!i[o])throw Error(s.name+`: no body column named `+c+` for charges`);if(a[o]=O[l],!a[o])throw Error(s.name+`: no body column named `+l+` for sensitivity`)}var u=t.tree;u.options(e),u.insertBodies(O,i,a);for(var d=O.pinned,f=O.n;f--;)if(!d[f]){for(o=0;o<r;++o)if(a[o][f]!==0){u.updateBodyForce(f);break}}}function Re(t){var n=t.laws=t.members.map(function(e){return e.law()}),i=t.members.map(function(e){return e.centroid}),a=p+`|`+n.map(function(e){return e.key+`#`+n.indexOf(e)}).join(`/`)+`|`+i.join(`,`);return(y[a]||(y[a]=r(p,n,{centroid:i})))(e,T,n)}function ze(e){var t=Be(e);return t<0?void 0:ge[t]}function Be(e){for(var t=0;t<ge.length;++t)if(ge[t].name===e)return t;return-1}function Ve(){x.clearForces(O)}function He(){if(O.n!==0&&!Ie(_e.tree)){re.update(pe);var t=O[e.repulsionCharge];if(!t)throw Error(`No body column named `+e.repulsionCharge+` for charges`);var n=e.repulsionSensitivity?O[e.repulsionSensitivity]:t;if(!n)throw Error(`No body column named `+e.repulsionSensitivity+` for sensitivity`);if(e.nbody===`dualtree`)ae||=Ue(re).createDualTree(e,We(re)),ae.computeForces(O,t,n);else{ie||=Ue(re).createQuadTree(e,T,We(re)),ie.options(e),ie.insertBodies(O,t,n);for(var r=O.pinned,i=O.n;i--;)r[i]||ie.updateBodyForce(i)}}}function Ue(e){var t=p+`|`+e.key,n=v[t];return n||=v[t]={createQuadTree:function(t,i,a){return n.createQuadTree=r(p,e),n.createQuadTree(t,i,a)},createDualTree:function(t,r){return n.createDualTree=Ql()(p,e),n.createDualTree(t,r)}},n}function We(e){return e.isDefault?null:e}function Ge(){e.integrator!==`fire`&&se.update(O)}function Ke(){oe.update(R,O,e.adaptiveTimeStepWeight!==0)}function qe(){var t=x.integrate,n=e.inertia;if(e.integrator===`fire`){if(!w||de!==n){var r=$l();n===`mass`&&!x.createFireIntegrator&&(x.createFireIntegrator=r(p)),w=n===`mass`?x.createFireIntegrator():r(p,Je(n))(),de=n}t=w}else n!==`mass`&&(Je(n),x.integrateBy||(x.integrateBy=Object.create(null)),t=x.integrateBy[n]||(x.integrateBy[n]=s(p,n)));le=t(O,e.timeStep,e.adaptiveTimeStepWeight,e.maxVelocity)}function Je(e){if(!O[e])throw Error(`No body column named `+e+` for inertia`);return e}function Ye(){for(var e=H.map(function(e){return typeof e.radius==`function`?e.radius(pe):e.radius}),t=0,n=0;n<e.length;++n)e[n]>t&&(t=e[n]);if(t>0)for(var r=ve.neighbors(t),i=0;i<H.length;++i)r.applyPairRule(e[i],H[i].rule,H[i].symmetric)}function Xe(e){for(var t=0;t<p;++t)if(!Number.isFinite(e[g(t)]))throw Error(`Expected value is not a finite number at Vector constructor (`+g(t)+`)`)}function Ze(e,t){for(var n=e*p,r=0;r<p;++r)O.pos[n+r]=t[g(r)]}function Qe(){return tt(),V.update(),V.box}function $e(e){var t=e.index;--O.degree[R.from[t]],--O.degree[R.to[t]],ee.push(t),L.splice(N(L,t),1),e.detach(),ne=!0}function et(e){for(var t=L.length-1;t>=0;--t){var n=L[t];(n.from===e||n.to===e)&&$e(n)}}function tt(){if(ee.length){ee.sort(M),R.removeRows(ee);for(var e=P(L,ee[0]);e<L.length;++e)L[e].moveTo(R,e);ee.length=0}if(z.length){if(z.sort(M),R.n>0){for(var t=new Int32Array(O.n),n=0,r=0;n<O.n;++n)z[r]===n?r+=1:t[n]=n-r;for(var i=R.from,a=R.to,o=0;o<R.n;++o)i[o]=t[i[o]],a[o]=t[a[o]]}O.removeRows(z);for(var s=P(I,z[0]);s<I.length;++s)I[s].moveTo(O,s);z.length=0,B=null,te=[]}}function nt(){for(var e=0;e<te.length;++e){var t=te[e];t.store===B&&t.moveTo(B,t.index)}}}var S=typeof Symbol==`function`?Symbol.for(`ngraph.forcelayout.settings`):`$settings`;function C(e){Object.defineProperty(this,S,{value:e})}var w=Object.create(null),T={iteration:!0,settings:!0,store:!0,unit:!0};function E(e){var t=e.join(`,`),n=w[t];return n||(n={unit:function(){var e=this.settings[S].springLength;return e>b?e:b}},e.forEach(function(e){T[e]||(n[e]=function(){return this.settings[S][e]})}),w[t]=Object.freeze(n),n)}function D(e){Object.defineProperty(this,S,{value:e}),this.D=e.D}Object.defineProperty(D.prototype,"n",{get:function(){return this[S].n}});var O=Object.create(null);function k(e){var t=O[e];return t||=O[e]=function(){return this[S][e]},t}function A(){return f||=eu(),f}function j(){return p||=tu(),p}function M(e,t){return e-t}function N(e,t){for(var n=0,r=e.length-1;n<=r;){var i=n+r>>1,a=e[i].index;if(a===t)return i;a<t?n=i+1:r=i-1}return-1}function P(e,t){for(var n=0,r=e.length;n<r;){var i=n+r>>1;e[i].index<=t?n=i+1:r=i}return n}function F(e,t,n){for(var r in e)I(e,t,r,n)}function I(e,t,n,r){e.hasOwnProperty(n)&&typeof t[n]!=`function`&&(t[n]=Number.isFinite(e[n])?function(i){if(i!==void 0){if(!Number.isFinite(i))throw Error(`Value of `+n+` should be a valid number.`);var a=e[n];return e[n]=i,a!==i&&r(n,a,i),t}return e[n]}:function(i){if(i!==void 0){var a=e[n];return e[n]=i,a!==i&&r(n,a,i),t}return e[n]})}}}),ru=jl({"index.js"(e,t){t.exports=r,t.exports.simulator=nu();var n=Yl();function r(e,t){if(!e)throw Error(`Graph structure cannot be undefined`);var r=(t&&t.createSimulator||nu())(t);if(Array.isArray(t))throw Error(`Physics settings is expected to be an object`);var a=e.version>19?j:A;t&&typeof t.nodeMass==`function`&&(a=t.nodeMass);var o=t&&typeof t.nodeCharge==`function`?t.nodeCharge:null;o&&(r.store.define(`charge`,Float64Array,1,1),r.repulsionCharge(`charge`));var s=new Map,c={},l=0,u=r.settings.springTransform||i;x(),v();var d=!1,f={step:function(){if(l===0)return p(!0),!0;var e=r.step();f.lastMove=e,f.fire(`step`);var t=e/l<=.01;return p(t),t},getNodePosition:function(e){return k(e).pos},setNodePosition:function(e){var t=k(e);t.setPosition.apply(t,Array.prototype.slice.call(arguments,1))},getLinkPosition:function(e){var t=c[e];if(t)return{from:t.from.pos,to:t.to.pos}},getGraphRect:function(){return r.getBBox()},forEachBody:m,pinNode:function(e,t){var n=k(e.id);n.isPinned=!!t},isNodePinned:function(e){return k(e.id).isPinned},dispose:function(){e.off(`changed`,b),f.fire(`disposed`)},getBody:_,getSpring:g,getForceVectorLength:h,simulator:r,graph:e,lastMove:0};return n(f),r.watchListeners&&r.watchListeners(f),f;function p(e){d!==e&&(d=e,y(e))}function m(e){s.forEach(e)}function h(){var e=0,t=0;return m(function(n){e+=Math.abs(n.force.x),t+=Math.abs(n.force.y)}),Math.sqrt(e*e+t*t)}function g(t,n){var r;if(n===void 0)r=typeof t==`object`?t.id:t;else{var i=e.hasLink(t,n);if(!i)return;r=i.id}return c[r]}function _(e){return s.get(e)}function v(){e.on(`changed`,b)}function y(e){f.fire(`stable`,e)}function b(t){for(var n=0;n<t.length;++n){var r=t[n];r.changeType===`add`?(r.node&&S(r.node.id),r.link&&w(r.link)):r.changeType===`remove`&&(r.node&&C(r.node),r.link&&T(r.link))}l=e.getNodesCount()}function x(){l=0;var t=r.store,n=r.springStore;t&&t.reserve&&e.getNodesCount&&t.reserve(e.getNodesCount()),n&&n.reserve&&e.getLinksCount&&n.reserve(e.getLinksCount()),e.forEachNode(function(e){S(e.id),l+=1}),e.forEachLink(w)}function S(t){var n=s.get(t);if(!n){var i=e.getNode(t);if(!i)throw Error(`initBody() was called with unknown node id`);var a=i.position;if(!a){var o=E(i);a=r.getBestNewBodyPosition(o)}n=r.addBodyAt(a),n.id=t,s.set(t,n),D(t),O(i)&&(n.isPinned=!0)}}function C(e){var t=e.id,n=s.get(t);n&&(s.delete(t),r.removeBody(n))}function w(e){D(e.fromId),D(e.toId);var t=s.get(e.fromId),n=s.get(e.toId),i=r.addSpring(t,n,e.length);u(e,i),c[e.id]=i}function T(t){var n=c[t.id];if(n){var i=e.getNode(t.fromId),a=e.getNode(t.toId);i&&D(i.id),a&&D(a.id),delete c[t.id],r.removeSpring(n)}}function E(e){var t=[];return e.links&&e.links.forEach(function(n){var r=n.fromId===e.id?s.get(n.toId):s.get(n.fromId);r&&r.pos&&t.push(r)}),t}function D(e){var t=s.get(e),n=t.store.mass;if(n[t.index]=a(e),Number.isNaN(n[t.index]))throw Error(`Node mass should be a number`);if(o){var i=o(e);if(typeof i!=`number`||Number.isNaN(i))throw Error(`Node charge should be a number`);r.store.charge[t.index]=i}}function O(e){return e&&(e.isPinned||e.data&&e.data.isPinned)}function k(e){var t=s.get(e);return t||=(S(e),s.get(e)),t}function A(t){var n=e.getLinks(t);return n?1+n.length/3:1}function j(t){var n=e.getLinks(t);return n?1+n.size/3:1}}function i(){}}})();function iu(e,t){return ru(e,Object.assign({dimensions:2,timeStep:.5,springLength:10,gravity:-12,springCoefficient:.8,dragCoefficient:.9,debug:!1},t))}var au=ou;function ou(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,n=new Map,r={},i=0,a=e.multigraph?b:y,o=[],s=N,c=N,l=N,u=N,d={version:20,addNode:h,addLink:v,removeLink:w,removeNode:_,getNode:g,getNodeCount:x,getLinkCount:S,getEdgeCount:S,getLinksCount:S,getNodesCount:x,getLinks:C,forEachNode:I,forEachLinkedNode:A,forEachLink:k,beginUpdate:l,endUpdate:u,clear:O,hasLink:E,hasNode:g,getLink:E,getLinkById:D};return Cl(d),f(),d;function f(){var e=d.on;d.on=t;function t(){return d.beginUpdate=l=P,d.endUpdate=u=F,s=p,c=m,d.on=e,e.apply(d,arguments)}}function p(e,t){o.push({link:e,changeType:t})}function m(e,t){o.push({node:e,changeType:t})}function h(e,n){if(e===void 0)throw Error(`Invalid node identifier`);l();var r=g(e);return r?(r.data=n,c(r,`update`)):(r=new su(e,n),c(r,`add`)),t.set(e,r),u(),r}function g(e){return t.get(e)}function _(e){var n=g(e);if(!n)return!1;l();var r=n.links;return r&&(r.forEach(T),n.links=null),t.delete(e),c(n,`remove`),u(),!0}function v(e,t,r){l();var i=g(e)||h(e),o=g(t)||h(t),c=a(e,t,r),d=n.has(c.id);return n.set(c.id,c),cu(i,c),e!==t&&cu(o,c),s(c,d?`update`:`add`),u(),c}function y(e,t,r){var i=uu(e,t),a=n.get(i);return a?(a.data=r,a):new lu(e,t,r,i)}function b(e,t,n){var i=uu(e,t),a=r.hasOwnProperty(i);if(a||E(e,t)){a||(r[i]=0);var o=`@`+ ++r[i];i=uu(e+o,t+o)}return new lu(e,t,n,i)}function x(){return t.size}function S(){return n.size}function C(e){var t=g(e);return t?t.links:null}function w(e,t){return t!==void 0&&(e=E(e,t)),T(e)}function T(e){if(!e||!n.get(e.id))return!1;l(),n.delete(e.id);var t=g(e.fromId),r=g(e.toId);return t&&t.links.delete(e),r&&r.links.delete(e),s(e,`remove`),u(),!0}function E(e,t){if(e!==void 0&&t!==void 0)return n.get(uu(e,t))}function D(e){if(e!==void 0)return n.get(e)}function O(){l(),I(function(e){_(e.id)}),u()}function k(e){if(typeof e==`function`)for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}function A(e,t,n){var r=g(e);if(r&&r.links&&typeof t==`function`)return n?M(r.links,e,t):j(r.links,e,t)}function j(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===n?s.toId:s.fromId;if(i=r(t.get(c),s),i)return!0;o=a.next()}}function M(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===n&&(i=r(t.get(s.toId),s),i))return!0;o=a.next()}}function N(){}function P(){i+=1}function F(){--i,i===0&&o.length>0&&(d.fire(`changed`,o),o.length=0)}function I(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function su(e,t){this.id=e,this.links=null,this.data=t}function cu(e,t){e.links?e.links.add(t):e.links=new Set([t])}function lu(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function uu(e,t){return e.toString()+`👉 `+t.toString()}function du(e,t,n={}){let r=n.dimensions||2,i=n.unit||10,a=n.jitter===void 0?.1:n.jitter,o=bu(n.seed||42),s=fu(e);if(s.n===0)return`empty`;let c=mu(s,r,n.pivots||25,o),l=`pivot MDS`;if(r===2&&s.n>2){let e=_u(s,o);vu(s,e)<vu(s,c)&&(c=e,l=`radial tree`)}let u=Array(r+1);for(let e=0;e<s.n;e++){u[0]=s.ids[e];for(let t=0;t<r;t++)u[t+1]=c[t][e]*i+(o()-.5)*a*i;t.setNodePosition.apply(t,u)}return l}function fu(e){let t=[];e.forEachNode(e=>{t.push(e.id)});let n=t.length,r=new Map(t.map((e,t)=>[e,t])),i=new Int32Array(n),a=[];e.forEachLink(e=>{let t=r.get(e.fromId),n=r.get(e.toId);t!==n&&(a.push(t,n),i[t]++,i[n]++)});let o=new Int32Array(n+1);for(let e=0;e<n;e++)o[e+1]=o[e]+i[e];let s=o.slice(0,n),c=new Int32Array(o[n]);for(let e=0;e<a.length;e+=2){let t=a[e],n=a[e+1];c[s[t]++]=n,c[s[n]++]=t}return{ids:t,n,offsets:o,neighbors:c,degree:i}}function pu(e,t,n,r){n.fill(-1),n[t]=0,r[0]=t;let i=0,a=1;for(;i<a;){let t=r[i++],o=n[t]+1;for(let i=e.offsets[t];i<e.offsets[t+1];i++){let t=e.neighbors[i];n[t]<0&&(n[t]=o,r[a++]=t)}}return a}function mu(e,t,n,r){let i=e.n,a=Math.min(n,i),o=new Int32Array(i),s=new Int32Array(i),c=new Float64Array(i).fill(1/0),l=[],u=0;for(let t=1;t<i;t++)e.degree[t]>e.degree[u]&&(u=t);for(let t=0;t<a;t++){pu(e,u,o,s);let t=0;for(let e=0;e<i;e++)o[e]>t&&(t=o[e]);let n=new Float64Array(i);for(let e=0;e<i;e++){let r=o[e]<0?t+1:o[e];n[e]=r*r,r<c[e]&&(c[e]=r)}l.push(n);let r=0;for(let e=1;e<i;e++)c[e]>c[r]&&(r=e);u=r}let d=new Float64Array(i),f=0,p=l.map(e=>{let t=0;for(let n=0;n<i;n++)t+=e[n],d[n]+=e[n];return f+=t,t/i});for(let e=0;e<i;e++)d[e]/=a;f/=i*a,l.forEach((e,t)=>{for(let n=0;n<i;n++)e[n]=-.5*(e[n]-d[n]-p[t]+f)});let m=new Float64Array(a*a);for(let e=0;e<a;e++)for(let t=e;t<a;t++){let n=0,r=l[e],o=l[t];for(let e=0;e<i;e++)n+=r[e]*o[e];m[e*a+t]=m[t*a+e]=n}let h=hu(m,a,t,r).map(e=>{let t=new Float64Array(i);return l.forEach((n,r)=>{for(let a=0;a<i;a++)t[a]+=e[r]*n[a]}),t});return gu(e,h,r),h}function hu(e,t,n,r){let i=[];for(let a=0;a<n;a++){let n=new Float64Array(t).map(()=>r()-.5);for(let r=0;r<200;r++){let r=new Float64Array(t);for(let i=0;i<t;i++){let a=0;for(let r=0;r<t;r++)a+=e[i*t+r]*n[r];r[i]=a}i.forEach(e=>{let n=0;for(let i=0;i<t;i++)n+=r[i]*e[i];for(let i=0;i<t;i++)r[i]-=n*e[i]});let a=0;for(let e=0;e<t;e++)a+=r[e]*r[e];a=Math.sqrt(a)||1;let o=0;for(let e=0;e<t;e++){let t=r[e]/a;o+=Math.abs(t-n[e]),n[e]=t}if(o<1e-9)break}i.push(n)}return i}function gu(e,t,n){let r=e.n,i=new Int32Array(r),a=new Int32Array(r),o=0,s=0;for(let c=0;c<Math.min(8,r);c++){let c=Math.floor(n()*r);pu(e,c,i,a);for(let e=0;e<r;e++){let n=i[e];if(n<=0)continue;let r=yu(t,e,c);o+=r/n,s+=r*r/(n*n)}}let c=s>0?o/s:1;t.forEach(e=>{for(let t=0;t<r;t++)e[t]*=c})}function _u(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n);pu(e,0,r,i);let a=0;for(let e=0;e<n;e++)r[e]>r[a]&&(a=e);pu(e,a,r,i);let o=0;for(let e=0;e<n;e++)r[e]>r[o]&&(o=e);let s=r[o]>>1,c=o;for(;r[c]>s;)for(let t=e.offsets[c];t<e.offsets[c+1];t++){let n=e.neighbors[t];if(r[n]===r[c]-1){c=n;break}}let l=pu(e,c,r,i),u=new Int32Array(n).fill(-1);for(let t=0;t<l;t++){let n=i[t];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let i=e.neighbors[t];r[i]===r[n]+1&&u[i]<0&&(u[i]=n)}}let d=new Float64Array(n).fill(1);for(let e=l-1;e>0;e--)d[u[i[e]]]+=d[i[e]];let f=new Float64Array(n),p=new Float64Array(n),m=new Float64Array(n),h=new Float64Array(n);p[c]=2*Math.PI;for(let t=0;t<l;t++){let n=i[t],a=f[n]+p[n]/2;m[n]=r[n]*Math.cos(a),h[n]=r[n]*Math.sin(a);let o=f[n];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let r=e.neighbors[t];u[r]===n&&(f[r]=o,p[r]=p[n]*d[r]/(d[n]-1),o+=p[r])}}let g=0;for(let e=0;e<n;e++)r[e]>g&&(g=r[e]);for(let e=0;e<n;e++)r[e]>=0||(m[e]=(t()-.5)*2*g,h[e]=(t()-.5)*2*g);return[m,h]}function vu(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n),a=bu(3),o=[];for(let t=0;t<Math.min(12,n);t++){let t=Math.floor(a()*n);pu(e,t,r,i);for(let e=0;e<n;e++)r[e]>0&&o.push(t,e,r[e])}let s=0,c=0;for(let e=0;e<o.length;e+=3){let n=yu(t,o[e],o[e+1]),r=o[e+2];s+=n/r,c+=n*n/(r*r)}let l=c>0?s/c:1,u=0;for(let e=0;e<o.length;e+=3){let n=l*yu(t,o[e],o[e+1]),r=o[e+2];u+=(n-r)*(n-r)/(r*r)}return u/Math.max(1,o.length/3)}function yu(e,t,n){let r=0;for(let i=0;i<e.length;i++){let a=e[i][t]-e[i][n];r+=a*a}return Math.sqrt(r)}function bu(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var xu=new WeakMap;async function Su(e){try{if(typeof navigator>`u`||!navigator.gpu)return null;let t=await navigator.gpu.requestAdapter({powerPreference:`high-performance`});if(!t)return null;let n={};for(let r of e)t.limits[r]!==void 0&&(n[r]=t.limits[r]);let r=t.features.has(`timestamp-query`)?[`timestamp-query`]:[];return await t.requestDevice({requiredFeatures:r,requiredLimits:n})}catch(e){return console.warn(`WebGPU is not available:`,e),null}}function Cu(e){let t=xu.get(e);return t||(t={listeners:new Set,lost:null,modules:new Map,pipelines:new Map,layouts:new Map,submitMs:null,slowdown:null},xu.set(e,t),e.addEventListener(`uncapturederror`,e=>{let n=e.error&&e.error.message?e.error.message:String(e.error);t.listeners.forEach(e=>e({message:n}))}),e.lost.then(e=>{t.lost=e,t.listeners.forEach(t=>t({lost:!0,message:e.message||`the device was lost`,reason:e.reason}))}),t)}function wu(e,{code:t,label:n,bindings:r=null,constants:i=null}){let a=Cu(e),o=(r?r.join(`,`):`auto`)+`|`+(i?JSON.stringify(i):``)+`|`+t,s=a.pipelines.get(o);return s||(s=Tu(e,a,{code:t,label:n,bindings:r,constants:i}),a.pipelines.set(o,s),s.catch(()=>{a.pipelines.delete(o)})),s}async function Tu(e,t,{code:n,label:r,bindings:i,constants:a}){let o=t.modules.get(n),s=null;o||(e.pushErrorScope(`validation`),o=e.createShaderModule({code:n,label:r}),s=e.popErrorScope(),t.modules.set(n,o));let c=i?Du(e,t,i):`auto`,l={module:o,entryPoint:`main`};a&&(l.constants=a);try{let[t,n]=await Promise.all([s,e.createComputePipelineAsync({layout:c,compute:l,label:r})]);if(t)throw t;return n}catch(e){t.modules.delete(n);let i=Error(`kernel ${r}: ${e.message}`);throw i.kernel=r,i}}var Eu={uniform:{buffer:{type:`uniform`}},dynamic:{buffer:{type:`uniform`,hasDynamicOffset:!0}},read:{buffer:{type:`read-only-storage`}},storage:{buffer:{type:`storage`}}};function Du(e,t,n){let r=n.join(`,`),i=t.layouts.get(r);if(!i){let a=e.createBindGroupLayout({entries:n.map((e,t)=>Object.assign({binding:t,visibility:GPUShaderStage.COMPUTE},Eu[e]))});i=e.createPipelineLayout({bindGroupLayouts:[a]}),t.layouts.set(r,i)}return i}async function Ou(e){let t=Cu(e);if(t.submitMs!==null)return t.submitMs;await e.queue.onSubmittedWorkDone();let n=performance.now();for(let t=0;t<16;t++)e.queue.submit([e.createCommandEncoder().finish()]);return await e.queue.onSubmittedWorkDone(),t.submitMs=(performance.now()-n)/16,t.submitMs}var ku=65536,Au=1024,ju=1<<22,Mu=128,Nu=1<<20,Pu=32,Fu=`fn mix(x: u32) -> u32 {
  var h = x * 747796405u + 2891336453u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu;
  return (h >> 16u) ^ h;
}`,Iu=[{name:`pairs`,MS:1.06,buffers:[`bodies`,`out`],code:`@group(0) @binding(0) var<storage, read> p: array<vec4f>;
@group(0) @binding(1) var<storage, read_write> out: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let me = p[gid.x % ${Au}u];
  var acc = vec3f(0.0);
  for (var j = 0u; j < ${Au}u; j++) {
    let o = p[j];
    let d = o.xyz - me.xyz;
    let r2 = dot(d, d) + 0.01;
    acc += d * (o.w * inverseSqrt(r2) / r2);
  }
  out[gid.x] = acc.x + acc.y + acc.z;
}`},{name:`gather`,MS:1,buffers:[`words`,`out`],code:`@group(0) @binding(0) var<storage, read> words: array<u32>;
@group(0) @binding(1) var<storage, read_write> out: array<f32>;
${Fu}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  var at = mix(gid.x);
  var acc = 0u;
  for (var k = 0u; k < ${Mu}u; k++) {
    let w = words[at & 4194303u];
    acc += w;
    at = mix(at + w);
  }
  out[gid.x] = f32(acc);
}`},{name:`atomics`,MS:.91,buffers:[`slots`],code:`@group(0) @binding(0) var<storage, read_write> slots: array<atomic<u32>>;
${Fu}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  var at = mix(gid.x);
  for (var k = 0u; k < ${Pu}u; k++) {
    // one add in four lands on 256 shared counters, as bodies piled into a few grid cells do
    let slot = select(at & 1048575u, at & 255u, (k & 3u) == 0u);
    atomicAdd(&slots[slot], 1u);
    at = mix(at);
  }
}`}],Lu=10;async function Ru(e){let t=Cu(e);if(t.slowdown!==null)return t.slowdown;let n=Lu,r=[];try{let i=await Promise.all(Iu.map(t=>wu(e,{code:t.code,label:`SPEED_PROBE_`+t.name}))),a=(t,n)=>{let i=e.createBuffer({size:t,usage:n});return r.push(i),i},o=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST,s=new Float32Array(Au*4);for(let e=0;e<Au;e++)s.set([Math.cos(e),Math.sin(e*1.3),e%37*.1,1+e%5],e*4);let c=a(s.byteLength,o);e.queue.writeBuffer(c,0,s);let l=a(ju*4,o),u=new Uint32Array(65536);for(let e=0;e<u.length;e++)u[e]=e*2654435761>>>0;for(let t=0;t<ju;t+=u.length)e.queue.writeBuffer(l,t*4,u);let d={bodies:c,words:l,slots:a(Nu*4,o),out:a(ku*4,GPUBufferUsage.STORAGE)},f=i.map((t,n)=>e.createBindGroup({layout:t.getBindGroupLayout(0),entries:Iu[n].buffers.map((e,t)=>({binding:t,resource:{buffer:d[e]}}))})),p=e.features.has(`timestamp-query`),m=2*Iu.length,h=p?e.createQuerySet({type:`timestamp`,count:m}):null,g=p?a(m*8,GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC):null,_=p?a(m*8,GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST):null,v=p?0:await Ou(e),y=async()=>{if(p){let t=e.createCommandEncoder();Iu.forEach((e,n)=>{let r=t.beginComputePass({timestampWrites:{querySet:h,beginningOfPassWriteIndex:2*n,endOfPassWriteIndex:2*n+1}});r.setPipeline(i[n]),r.setBindGroup(0,f[n]),r.dispatchWorkgroups(ku/256),r.end()}),t.resolveQuerySet(h,0,m,g,0),t.copyBufferToBuffer(g,0,_,0,m*8),e.queue.submit([t.finish()]),await _.mapAsync(GPUMapMode.READ);let n=new BigUint64Array(_.getMappedRange()),r=Iu.map((e,t)=>Number(n[2*t+1]-n[2*t])/1e6);return _.unmap(),r}let t=[];for(let n=0;n<Iu.length;n++){let r=e.createCommandEncoder(),a=r.beginComputePass();a.setPipeline(i[n]),a.setBindGroup(0,f[n]),a.dispatchWorkgroups(ku/256),a.end();let o=performance.now();e.queue.submit([r.finish()]),await e.queue.onSubmittedWorkDone(),t.push(performance.now()-o-v)}return t};await y();let b=[await y(),await y()],x=Iu.map((e,t)=>Math.max(b[0][t],b[1][t]));t.probeMs=x,x.every(e=>Number.isFinite(e)&&e>0)&&(n=Math.min(100,Math.max(1,...x.map((e,t)=>e/Iu[t].MS)))),h&&h.destroy()}catch{n=Lu}finally{r.forEach(e=>e.destroy())}return t.slowdown=n,n}var zu=Object.getOwnPropertyNames,Bu=((e,t)=>function(){try{return t||(0,e[zu(e)[0]])((t={exports:{}}).exports,t),t.exports}catch(e){throw t=0,e}})({"lib/formula.js"(e,t){t.exports.parse=_,t.exports.parseProgram=v,t.exports.children=b,t.exports.compile=w,t.exports.createTable=C,t.exports.numberLiteral=S,t.exports.isCondition=x;var n={exp:r(`all`,`Math.exp`,function(e,t,n){return n+` * `+t[0].d}),log:r(`x > 0`,`Math.log`,function(e,t){return t[0].d+` / `+t[0].v}),sqrt:r(`x >= 0`,`Math.sqrt`,function(e,t,n){return t[0].d+` / (`+e.number(2)+` * `+n+`)`}),abs:r(`all`,`Math.abs`,function(e,t){return e.choose(t[0].v+` < `+e.number(0),`-`+t[0].d,t[0].d)}),sign:r(`all`,`Math.sign`,null),floor:r(`all`,`Math.floor`,null),ceil:r(`all`,`Math.ceil`,null),tanh:r(`all`,`Math.tanh`,function(e,t,n){return`(`+e.number(1)+` - `+n+` * `+n+`) * `+t[0].d}),sin:r(`all`,`Math.sin`,function(e,t){return e.call(`cos`,[t[0].v])+` * `+t[0].d}),cos:r(`all`,`Math.cos`,function(e,t){return`-`+e.call(`sin`,[t[0].v])+` * `+t[0].d}),min:i(`min`,` <= `),max:i(`max`,` >= `),pow:{args:[`num`,`num`],result:`num`,domain:`x > 0, or y a whole number`,derivative:null,js:`Math.pow`},select:{args:[`bool`,`any`,`any`],result:`arg`,domain:`all`,derivative:null,js:null},dot:{args:[`vec`,`vec`],result:`num`,domain:`all`,derivative:null,js:null},length:{args:[`vec`],result:`num`,domain:`all`,derivative:null,js:null},axis:{args:[`const`],result:`vec`,domain:`0 <= k < D, whole`,derivative:null,js:null}};function r(e,t,n){return{args:[`num`],result:`num`,domain:e,derivative:n,js:t}}function i(e,t){return{args:[`num`,`num`],result:`num`,domain:`all`,js:`Math.`+e,derivative:function(e,n){return e.choose(n[0].v+t+n[1].v,n[0].d===null?e.number(0):n[0].d,n[1].d===null?e.number(0):n[1].d)}}}var a={};Object.keys(n).forEach(function(e){a[e]=n[e].args.length});var o={name:`js`,number:S,call:function(e,t){return n[e].js+`(`+t.join(`, `)+`)`},choose:function(e,t,n){return`(`+e+` ? `+t+` : `+n+`)`},operator:function(e){return e===`==`?`===`:e===`!=`?`!==`:e},declare:function(e,t){return`var `+e+` = `+t+`;`},result:function(e,t){return e+` = `+t+`;`},assign:function(e,t,n){return e+` `+t+` `+n+`;`},local:function(e){return`$v_`+e},temp:function(e){return`$t`+e}};t.exports.BUILTINS=n,t.exports.JS=o;var s=typeof Symbol==`function`?Symbol.for(`ngraph.forcelayout.settings`):`$settings`;function c(e){var t=e.settings;return t[s]||t}var l={n:function(e){return e.store.n},step:function(e){return e.iteration()},dt:function(e){return c(e).timeStep},unit:function(e){return e.unit()},springLength:u(`springLength`),springCoefficient:u(`springCoefficient`),gravity:u(`gravity`),dragCoefficient:u(`dragCoefficient`),theta:u(`theta`),timeStep:u(`timeStep`),maxVelocity:u(`maxVelocity`)};t.exports.FUNCTIONS=a,t.exports.BUILT_IN_VALUES=l,t.exports.SETTINGS=s,t.exports.liveSettings=c;function u(e){return function(t){return c(t)[e]}}var d={"<":!0,"<=":!0,">":!0,">=":!0,"==":!0,"!=":!0},f={"=":!0,"+=":!0,"-=":!0,"*=":!0,"/=":!0},p=/(\d+\.?\d*(?:[eE][+-]?\d+)?|\.\d+(?:[eE][+-]?\d+)?)|([A-Za-z_]\w*)|(\*\*|===|!==|<=|>=|==|!=|&&|\|\||\+=|-=|\*=|\/=|[-+*/^(),;?:[\]<>!=])/y,m=/(?:\s+|\/\/[^\n]*)*/y;function h(e){for(var t=[],n=0;m.lastIndex=n,m.exec(e),n=m.lastIndex,!(n>=e.length);){p.lastIndex=n;var r=p.exec(e);if(!r)throw Error(`Cannot read formula at "`+e.slice(n)+`"`);r[1]===void 0?r[2]===void 0?t.push({type:`op`,value:g[r[3]]||r[3]}):t.push({type:`id`,value:r[2]}):t.push({type:`num`,value:Number(r[1])}),n=p.lastIndex}return t}var g={"**":`^`,"===":`==`,"!==":`!=`};function _(e){var t=v(e);if(t.length!==1||t[0].target!==null)throw Error(`Expected one expression: `+e);return t[0].expr}function v(e){if(typeof e!=`string`)throw Error(`A formula should be a string`);for(var t=h(e),n=0,r=[];n<t.length;)if(o(`;`))n++;else{var i,a=t[n+1];t[n].type===`id`&&a&&a.type===`op`&&f[a.value]?(i={target:t[n].value,op:a.value,expr:null},n+=2,i.expr=l()):i={target:null,op:null,expr:l()},r.push(i),n<t.length&&c(`;`)}if(r.length===0)throw Error(`Formula is empty`);return r;function o(e){return n<t.length&&t[n].type===`op`&&t[n].value===e}function s(){return n<t.length&&t[n].type===`op`?t[n].value:null}function c(r){if(!o(r)){var i=n<t.length?`"`+t[n].value+`"`:`the end`;throw Error(`Expected "`+r+`" but found `+i+` in formula `+e)}n++}function l(){var e=u();if(!o(`?`))return e;n++;var t=l();return c(`:`),{type:`call`,name:`select`,args:[e,t,l()]}}function u(){for(var e=p();o(`||`);)n++,e={type:`bin`,op:`||`,a:e,b:p()};return e}function p(){for(var e=m();o(`&&`);)n++,e={type:`bin`,op:`&&`,a:e,b:m()};return e}function m(){var r=g();if(d[s()]&&(r={type:`bin`,op:t[n++].value,a:r,b:g()},d[s()]))throw Error(`Comparisons cannot be chained (use &&) in formula `+e);return r}function g(){for(var e=_();o(`+`)||o(`-`);)e={type:`bin`,op:t[n++].value,a:e,b:_()};return e}function _(){for(var e=v();o(`*`)||o(`/`);)e={type:`bin`,op:t[n++].value,a:e,b:v()};return e}function v(){return o(`-`)?(n++,{type:`neg`,a:v()}):o(`+`)?(n++,v()):o(`!`)?(n++,{type:`not`,a:v()}):b()}function b(){var e=x();return o(`^`)?(n++,{type:`bin`,op:`^`,a:e,b:v()}):e}function x(){var r=t[n++];if(!r)throw Error(`Formula ends too early: `+e);if(r.type===`num`)return{type:`num`,value:r.value};if(r.type===`id`){if(o(`(`)){n++;var i=[];if(!o(`)`))for(i.push(l());o(`,`);)n++,i.push(l());return c(`)`),y({type:`call`,name:r.value,args:i})}if(o(`[`)){n++;var a=l();return c(`]`),{type:`index`,name:r.value,a}}return{type:`var`,name:r.value}}if(r.value===`(`){var s=l();return c(`)`),s}throw Error(`Unexpected "`+r.value+`" in formula `+e)}}function y(e){var t=e.args;return e.name===`round`&&t.length===1?{type:`call`,name:`floor`,args:[{type:`bin`,op:`+`,a:t[0],b:{type:`num`,value:.5}}]}:e.name===`clamp`&&t.length===3?{type:`call`,name:`min`,args:[{type:`call`,name:`max`,args:[t[0],t[1]]},t[2]]}:e}function b(e){if(e.args)return e.args;var t=[];return e.a&&t.push(e.a),e.b&&t.push(e.b),t}function x(e){return e.type===`not`||e.type===`bin`&&(d[e.op]||e.op===`&&`||e.op===`||`)===!0}function S(e){var t=String(e);return e<0?`(`+t+`)`:t}function C(e,t){if(!t||!(t.values&&t.values.length>=2))throw Error(`Table `+e+` needs at least two values`);if(!(Number.isFinite(t.from)&&Number.isFinite(t.to)&&t.to>t.from))throw Error(`Table `+e+" needs finite `from` < `to`");var n=Float64Array.from(t.values),r=n.length-1,i=t.from,a=r/(t.to-t.from);return{from:i,to:t.to,values:n,value:function(e){var t=(e-i)*a;if(!(t>0))return n[0];if(t>=r)return n[r];var o=t|0;return n[o]+(n[o+1]-n[o])*(t-o)},derivative:function(e){var t=(e-i)*a;if(!(t>0)||t>=r)return 0;var o=t|0;return(n[o+1]-n[o])*a}}}function w(e,t,n){n||=o;var r=v(e),i=t.D,s=[],c=Object.create(null),l=0,u=null;return r.forEach(function(i,a){if(i.target===null){if(a!==r.length-1)throw Error(`Only the last statement of a formula can be a bare expression: `+e);u=t.condition?{type:`bool`,code:_(i.expr)}:g(i.expr,!0)}else{var o=i.target,l=i.op,d=C(i.expr),h=c[o];if(d.type===`bool`&&(l!==`=`||h||t.name(o,!0)))throw Error(`A condition is used as a number in formula `+e+` (use select(condition, 1, 0) to count it)`);if(h)d=p(h,l,d),m(h,d,o),f(h.codes||[h.code],l,d);else{var v=t.name(o,!0);if(v){if(!v.write)throw Error(o+` cannot be assigned in formula `+e);if(v.ops&&v.ops.indexOf(l)<0)throw Error(o+` can only be changed with `+v.ops.join(` or `)+` in formula `+e);d=p(v,l,d),m(v,d,o),v.write(l,d).forEach(function(e){s.push(e)})}else{if(l!==`=`)throw Error(o+` is used with `+l+` before it has a value, in formula `+e);if(o===`D`||o===`pi`)throw Error(o+` cannot be assigned in formula `+e);h={type:d.type,reads:0},d.type===`vec`?h.codes=d.codes.map(function(e,t){var r=n.local(o)+`_`+t;return s.push(n.declare(r,e,`local`)),r}):(h.code=n.local(o),s.push(n.declare(h.code,d.code,`local`))),c[o]=h}}}}),Object.keys(c).forEach(function(t){if(c[t].reads===0)throw Error(t+` is computed but never used in formula `+e)}),{lines:s,result:u};function f(e,t,r){var i=r.codes||[r.code];e.forEach(function(e,r){s.push(n.assign(e,t,i[r]))})}function p(e,t,n){if(e.type!==`vec`||n.type!==`num`||t!==`*=`&&t!==`/=`)return n;var r=h(n.code);return x(function(){return r})}function m(t,n,r){if(t.type!==n.type)throw Error(r+` is a `+T(t.type)+` but gets a `+T(n.type)+` in formula `+e)}function h(e){if(/^[\w$]+$/.test(e)||/^\(-?[\d.e+-]+\)$/.test(e))return e;var t=n.temp(l++);return s.push(n.declare(t,e,`temp`)),t}function g(t,n){var r=C(t);if(r.type===`bool`)throw Error(`A condition is used as a number in formula `+e+` (use select(condition, 1, 0) to count it)`);if(!n&&r.type===`vec`)throw Error(`A vector is used as a number in formula `+e);return r}function _(t){var n=C(t);if(n.type!==`bool`)throw Error(`Expected a condition (such as a < b) in formula `+e);return n.code}function y(e){return{type:`num`,code:e}}function b(e){return{type:`vec`,codes:e}}function x(e){for(var t=[],n=0;n<i;++n)t.push(e(n));return b(t)}function S(e){return e.type===`vec`?b(e.codes.map(h)):y(h(e.code))}function C(e){switch(e.type){case`num`:return y(n.number(e.value));case`var`:return w(e.name);case`index`:return E(e);case`neg`:var t=g(e.a,!0);return t.type===`vec`?b(t.codes.map(function(e){return`(-`+e+`)`})):y(`(-`+t.code+`)`);case`not`:return{type:`bool`,code:`!`+_(e.a)};case`bin`:return D(e);case`call`:return k(e)}throw Error(`Unknown formula node `+e.type)}function w(r){var a=c[r];if(a)return a.reads+=1,a.type===`bool`?{type:`bool`,code:a.code}:a.type===`vec`?b(a.codes):y(a.code);if(r===`D`)return y(n.number(i));if(r===`pi`)return y(n.number(Math.PI));var o=t.name(r);if(!o||o.call||o.index)throw Error((o?r+` cannot be read as a value`:`Unknown name `+r)+` in formula `+e);return o.type===`vec`?b(o.codes):y(o.code)}function E(n){var r=t.name(n.name);if(!r||!r.index)throw Error(n.name+` cannot be indexed in formula `+e);return r.index(h(g(n.a).code))}function D(t){var r=t.op;if(r===`&&`||r===`||`)return{type:`bool`,code:`(`+_(t.a)+` `+n.operator(r)+` `+_(t.b)+`)`};if(d[r])return{type:`bool`,code:`(`+g(t.a).code+` `+n.operator(r)+` `+g(t.b).code+`)`};if(r===`^`)return O(g(t.a),t.b);var i=g(t.a,!0),a=g(t.b,!0);if(r===`+`||r===`-`){if(i.type!==a.type)throw Error(`Cannot `+(r===`+`?`add`:`subtract`)+` a vector and a number in formula `+e);return i.type===`vec`?x(function(e){return`(`+i.codes[e]+` `+r+` `+a.codes[e]+`)`}):y(`(`+i.code+` `+r+` `+a.code+`)`)}if(i.type===`vec`&&a.type===`vec`)throw Error(`Vectors cannot be multiplied or divided (use dot()) in formula `+e);if(i.type===`vec`||a.type===`vec`){if(r===`/`&&a.type===`vec`)throw Error(`Cannot divide by a vector in formula `+e);var o=i.type===`vec`?i:a,s=h(i.type===`vec`?a.code:i.code);return x(function(e){return`(`+o.codes[e]+` `+r+` `+s+`)`})}return y(`(`+i.code+` `+r+` `+a.code+`)`)}function O(e,t){var r=t.type===`num`?t.value:t.type===`neg`&&t.a.type===`num`?-t.a.value:NaN;if(Number.isInteger(r)&&r>=-4&&r<=4){if(r===0)return y(n.number(1));for(var i=h(e.code),a=[],o=0;o<Math.abs(r);++o)a.push(i);return y(r>0?`(`+a.join(` * `)+`)`:`(`+n.number(1)+` / (`+a.join(` * `)+`))`)}return y(n.call(`pow`,[e.code,g(t).code]))}function k(r){var o=r.name,s=r.args,c=a[o];if(c===void 0){var l=t.name(o);if(!l||!l.call)throw Error(`Unknown function `+o+` in formula `+e);if(s.length!==1)throw Error(o+`() expects 1 argument in formula `+e);return y(l.call([g(s[0]).code]))}if(s.length!==c)throw Error(o+`() expects `+c+` argument(s) in formula `+e);if(o===`select`){var u=h(_(s[0])),d=g(s[1],!0),f=g(s[2],!0);if(d.type!==f.type)throw Error(`Both sides of a choice should be numbers, or both vectors, in formula `+e);return d.type===`vec`?x(function(e){return n.choose(u,d.codes[e],f.codes[e])}):y(n.choose(u,d.code,f.code))}if(o===`dot`||o===`length`){var p=S(g(s[0],!0)),m=o===`dot`?S(g(s[1],!0)):p;if(p.type!==`vec`||m.type!==`vec`)throw Error(o+`() expects vectors in formula `+e);var v=p.codes.map(function(e,t){return e+` * `+m.codes[t]}).join(` + `);return y(o===`dot`?`(`+v+`)`:n.call(`sqrt`,[v]))}if(o===`axis`){var b=A(s[0]);if(!(Number.isInteger(b)&&b>=0&&b<i))throw Error(`axis() takes a whole number from 0 to `+(i-1)+` in formula `+e);return x(function(e){return n.number(+(e===b))})}return y(n.call(o,s.map(function(e){return g(e).code})))}function A(e){if(e.type===`num`)return e.value;if(e.type===`var`&&e.name===`D`&&!c.D)return i;if(e.type===`neg`)return-A(e.a);if(e.type===`bin`&&(e.op===`+`||e.op===`-`)){var t=A(e.a),n=A(e.b);return e.op===`+`?t+n:t-n}return NaN}}function T(e){return e===`vec`?`vector`:`number`}}})(),Vu=new Set([`exp`,`log`,`sqrt`,`abs`,`sign`,`floor`,`ceil`,`sin`,`cos`,`min`,`max`,`dot`,`length`]),Hu=8;function Uu(e){return!Number.isFinite(e)||Math.abs(e)>34028234663852886e22?`the number ${e} does not fit a 32-bit float`:e!==0&&Math.fround(e)===0?`the number ${e} is 0 in a 32-bit float`:null}function Wu(e){return e!==0&&Math.abs(e)<11754943508222875e-54}function Gu(e){e||=Ju;let t={name:`wgsl`,number(t){let n=Uu(t);if(n)throw Error(n);Wu(t)&&e(`the number ${t} is below 1.18e-38, which the GPU may treat as 0`);let r=String(t);return/^-?\d+$/.test(r)&&(r+=`.0`),t<0?`(`+r+`)`:r},call(e,n){if(Vu.has(e))return e+`(`+n.join(`, `)+`)`;if(e===`tanh`)return`tanh(clamp(`+n[0]+`, -10.0, 10.0))`;if(e===`pow`)return Yu(n[0],n[1]);if(e===`select`)return t.choose(n[0],n[1],n[2]);throw Error(e===`axis`?`axis() is a constant vector: the formula compiler prints it, not a call`:`${e}() has no WGSL printing`)},choose(e,t,n){return`select(`+n+`, `+t+`, `+e+`)`},operator(e){return e},declare(e,t,n){return(n===`local`?`var `:`let `)+e+` = `+t+`;`},result(e,t){return`let `+e+` = `+t+`;`},assign(e,t,n){return e+` `+t+` `+n+`;`},local(e){return`v_`+e},temp(e){return`t_`+e}};return t}var Ku=Gu(),qu=new Set;function Ju(e){qu.has(e)||(qu.add(e),console.warn(`ngraph.forcelayout.gpu: `+e))}function Yu(e,t){let n=Xu(t);if(n===null)return`pow(`+e+`, `+t+`)`;if(n===0)return`1.0`;let r=Math.abs(n);if(r<=Hu){let t=`(`+Array(r).fill(e).join(` * `)+`)`;return n<0?`(1.0 / `+t+`)`:t}let i=`pow(abs(`+e+`), `+t+`)`;return r%2?`(sign(`+e+`) * `+i+`)`:i}function Xu(e){let t=/^\(?(-?\d+)\.0\)?$/.exec(e);return t?Number(t[1]):null}function Zu(e,t,n,r,i,a=Ku){if(Object.keys(e.functions).some(t=>e.tableNames.indexOf(t)<0))throw Error(`Laws with custom functions cannot run on the GPU`);return e.emit(a,t,n,r,i)}function Qu(e){let t=Object.keys(e.values).filter(e=>/^\$h\d+$/.test(e)).sort((e,t)=>Number(e.slice(2))-Number(t.slice(2)));return e.paramNames.concat(t)}function $u(e){return Qu(e).length+ +!!e.hasRange}function ed(e,t,n,r=e.values){let i=Qu(e);for(let e=0;e<i.length;++e)t[n+e]=r[i[e]];e.hasRange&&(t[n+i.length]=Math.min(r.$range*r.$range,3e38))}function td(e,t){let n=Qu(e).map(e=>e[0]===`$`?`lawH`+e.slice(2):`law_`+e),r=n.map((e,n)=>`let `+e+` = `+t(n)+`;`);return e.hasRange&&r.push(`let lawRange2 = `+t(n.length)+`;`),r.join(` `)}function nd(e,t=e.values){for(let n of Qu(e)){let e=t[n];if(!Number.isFinite(e)||Math.abs(e)>34028234663852886e22)return{name:id(n),value:e,problem:`${e}, which does not fit a 32-bit float`}}return null}function rd(e,t=e.values){let n=[];for(let r of Qu(e)){let e=t[r];e!==0&&Math.fround(e)===0?n.push(`the law's ${id(r)} is ${e}, which is 0 in a 32-bit float`):Wu(e)&&n.push(`the law's ${id(r)} is ${e}, below 1.18e-38: the GPU may treat it as 0`)}return n}function id(e){return e[0]===`$`?`part ${e} (computed from its parameters)`:e}var ad=256,od=8,sd=64,cd=256,ld=16,ud=1024,dd=`
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
`,fd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> bs: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${2*ud}>;
var<workgroup> wb: array<atomic<u32>, 4>;
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(${ad})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u) {
  for (var b = li; b < ${2*ud}u; b += ${ad}u) { atomicStore(&hist[b], 0u); }
  if (li < 2u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < 4u) { atomicStore(&wb[li], 0u); }
  workgroupBarrier();
  let c = vec2f(bitcast<f32>(atomicLoad(&bs[8])), bitcast<f32>(atomicLoad(&bs[9])));
  var mn = vec2f(3e38); var mx = vec2f(-3e38);
  for (var i = gid.x; i < P.n; i += nwg.x * ${ad}u) {
    let p = pos[i];
    if (!(all(p == p) && all(abs(p) < vec2f(1e37)))) { continue; } // NaN or inf
    mn = min(mn, p); mx = max(mx, p);
    let d = p - c;
    atomicAdd(&hist[hbin(d.x)], 1u);
    atomicAdd(&hist[${ud}u + hbin(d.y)], 1u);
  }
  atomicMin(&wb[0], fenc(mn.x)); atomicMin(&wb[1], fenc(mn.y));
  atomicMax(&wb[2], fenc(mx.x)); atomicMax(&wb[3], fenc(mx.y));
  workgroupBarrier();
  for (var b = li; b < ${2*ud}u; b += ${ad}u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&bs[${ld}u + b], v); }
  }
  if (li == 0u) {
    atomicMin(&bs[0], atomicLoad(&wb[0])); atomicMin(&bs[1], atomicLoad(&wb[1]));
    atomicMax(&bs[2], atomicLoad(&wb[2])); atomicMax(&bs[3], atomicLoad(&wb[3]));
  }
}`,pd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> bs: array<u32>;
var<workgroup> scan: array<u32, ${ad}>;
var<workgroup> found: array<f32, 6>;
var<workgroup> total: u32;
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(${ad})
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < 6u) { found[li] = 0.0; }
  for (var a = 0u; a < 2u; a++) {
    let base = ${ld}u + a * ${ud}u + li * 4u;
    var cs = array<u32, 4>(bs[base], bs[base + 1u], bs[base + 2u], bs[base + 3u]);
    let t = cs[0] + cs[1] + cs[2] + cs[3];
    scan[li] = t;
    workgroupBarrier();
    for (var off = 1u; off < ${ad}u; off <<= 1u) {
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
}`,md=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> bs: array<u32>;
@group(0) @binding(3) var<storage, read_write> cellCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> nodeCell: array<u32>;
@group(0) @binding(5) var<storage, read_write> nodeSlot: array<u32>;
@compute @workgroup_size(${ad})
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
}`,hd=`
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
}`,gd=`
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
}`,_d=`
@group(0) @binding(0) var<storage, read_write> start: array<u32>;
@group(0) @binding(1) var<storage, read> blockSums: array<u32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let e = gid.x;
  if (e >= arrayLength(&start)) { return; }
  start[e] += blockSums[e >> 10u];
}`,vd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(2) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read_write> slotted: array<u32>;
@compute @workgroup_size(${ad})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  slotted[start[nodeCell[i] & 0x7fffffffu] + nodeSlot[i]] = i;
}`,yd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> mass: array<f32>;
@group(0) @binding(3) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(4) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(5) var<storage, read> start: array<u32>;
@group(0) @binding(6) var<storage, read> slotted: array<u32>;
@group(0) @binding(7) var<storage, read_write> sp: array<vec4f>;
@group(0) @binding(8) var<storage, read_write> perm: array<u32>;
@compute @workgroup_size(${ad})
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
}`,bd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> chunks: array<vec2u>; // (row, first edge)
@group(0) @binding(2) var<storage, read> csr: array<u32>;      // [rowStart (n + 1), neighbors]
@group(0) @binding(3) var<storage, read> pos: array<vec2f>;
@group(0) @binding(4) var<storage, read_write> springF: array<vec2f>;
@compute @workgroup_size(${ad})
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
}`,xd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> start: array<u32>;
@group(0) @binding(2) var<storage, read> sp: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${ad})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let c = gid.x;
  if (c >= P.nCells) { return; }
  let s = start[c];
  let e = select(P.n, start[c + 1u], c + 1u < P.nCells);
  var m = 0.0; var com = vec2f(0.0);
  for (var t = s; t < e; t++) { let q = sp[t]; m += q.z; com += q.z * q.xy; }
  if (m > 0.0) { com /= m; }
  cells[c] = vec4f(m, com, f32(e - s));
}`,Sd=`
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
}`,Cd=e=>Od(dd,e)+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> bs: array<u32>;
@group(0) @binding(2) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${ad})
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
  if (me.x == 0.0) { return; }${e?`
  `+td(e,kd):``}
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
        let r2 = dot(d, d);${e?`
        if (${Ad(e,`r2`)}) {
          let r = sqrt(r2);
          ${Zu(e,2,`r`,`k1`,`k2`)}
          let g = P.gravity * cell.x;
          F += (g * k1) * d;
          // d/dp of gravity M k1(r) (q - p) = gravity M (k2 d d^T - k1 I)
          jxx += g * (k2 * d.x * d.x - k1);
          jxy += g * (k2 * d.x * d.y);
          jyy += g * (k2 * d.y * d.y - k1);
        }`:`
        let ir2 = 1.0 / r2;
        let g = P.gravity * cell.x * ir2 * sqrt(ir2); // gravity M / r^3
        F += g * d;
        // d/dp of gravity M (q - p) / |q - p|^3 = gravity M (3 d d^T / r^5 - I / r^3)
        jxx += g * (3.0 * d.x * d.x * ir2 - 1.0);
        jxy += g * (3.0 * d.x * d.y * ir2);
        jyy += g * (3.0 * d.y * d.y * ir2 - 1.0);`}
      }
    }
  }
  cells[P.locOff + 2u * t] = vec4f(F, jxx, jxy);
  cells[P.locOff + 2u * t + 1u] = vec4f(jyy, center, 0.0);
}`,wd=e=>Od(dd,e)+`
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

@compute @workgroup_size(${ad})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let k = gid.x;
  if (k >= P.n) { return; }
  let i = perm[k];
  let me = sp[k];
  let p = me.xy; let mi = me.z;
  let c = u32(abs(me.w));
  let cx = i32(compact1by1(c)); let cy = i32(compact1by1(c >> 1u));
  let Gi = i32(P.G);
  var f = vec2f(0.0);${e?`
  `+td(e,kd):``}

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
        ${e?`${e.hasRange?`if (r2 > lawRange2) { continue; }
        `:``}let r = sqrt(r2);
        ${Zu(e,2,`r`,`k1`)}
        f += (P.gravity * mi * q.z * w * k1) * d;`:`let r = sqrt(r2);
        f += (P.gravity * mi * q.z * w / (r2 * r)) * d;`}
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
            ${e?`if (r2 > 0.0 && ${Ad(e,`r2`)}) {
              let r = sqrt(r2);
              ${Zu(e,2,`r`,`m1`)}
              ff += (P.gravity * cell.x * m1) * d;
            }`:`if (r2 > 0.0) { ff += (P.gravity * cell.x / (r2 * sqrt(r2))) * d; }`}
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
}`,Td=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> vel: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> fire: array<vec4f>; // [0]: state, [1 + w]: partials
var<workgroup> red: array<vec4f, ${ad}>;
@compute @workgroup_size(${ad})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  var acc = vec4f(0.0);
  for (var i = gid.x; i < P.n; i += nwg.x * ${ad}u) {
    let v4 = vel[i];
    if (v4.w != 0.0) { continue; }
    let f = vel[P.n + i].xy;
    acc += vec4f(dot(f, v4.xy), dot(v4.xy, v4.xy), dot(f, f), 0.0);
  }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${ad/2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) { fire[1u + wid.x] = red[0]; }
}`,Ed=`
struct FireParams { groups: u32, pad0: u32, pad1: u32, pad2: u32 };
@group(0) @binding(0) var<uniform> FP: FireParams;
@group(0) @binding(1) var<storage, read_write> fire: array<vec4f>;
var<workgroup> red: array<vec4f, ${ad}>;
@compute @workgroup_size(${ad})
fn main(@builtin(local_invocation_index) li: u32) {
  var acc = vec4f(0.0);
  for (var w = li; w < FP.groups; w += ${ad}u) { acc += fire[1u + w]; }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${ad/2}u; s > 0u; s >>= 1u) {
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
}`,Dd=dd+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>;
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> fire: array<vec4f>;
@compute @workgroup_size(${ad})
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
}`;function Od(e,t){if(!t)return e;if($u(t)>16)throw Error(`The GPU takes laws with up to 16 numbers`);return e.replace(`locOff: u32,
};`,`locOff: u32,
  law: array<vec4f, 4>,
};`)}function kd(e){return`P.law[${e>>2}].${`xyzw`[e&3]}`}function Ad(e,t){return e.hasRange?`${t} <= lawRange2`:`true`}var jd={HIST:fd,BOX:pd,BIN:md,SCAN_BLOCKS:hd,SCAN_TOP:gd,SCAN_ADD:_d,PLACE:vd,ORDER:yd,SPRINGS:bd,AGG0:xd,PYR:Sd,FIRE_REDUCE:Td,FIRE_STATE:Ed,FIRE_INTEGRATE:Dd},Md={LOCAL:Cd,FORCE:wd},Nd={LOCAL:[`dynamic`,`read`,`storage`],FORCE:[`dynamic`,`read`,`read`,`read`,`read`,`read`,`read`,`storage`,`storage`]},Pd={HIST:[`repulsion`],BOX:[`repulsion`],BIN:[`repulsion`],SCAN_BLOCKS:[`repulsion`],SCAN_TOP:[`repulsion`],SCAN_ADD:[`repulsion`],PLACE:[`repulsion`],ORDER:[`repulsion`],AGG0:[`repulsion`],PYR:[`repulsion`],LOCAL:[`repulsion`],SPRINGS:[`springs`],FORCE:[`clear`,`repulsion`,`drag`,`springs`,`integrate`],FIRE_REDUCE:[`integrate`],FIRE_STATE:[`integrate`],FIRE_INTEGRATE:[`integrate`]},Fd=256;function Id(e){let t=32;for(;t*t*2<e&&t<1024;)t*=2;return t}function Ld(e,t,n){let r=n===void 0?e+Math.ceil(t/4):n,i=Id(e),a=Math.log2(i),o=i*i,s=0,c=0;for(let e=0,t=i;e<=a;e++,t>>=1)c=s,s+=t*t;let l=e=>Math.max(16,Math.ceil(e/16)*16);return{pos:l(e*8),vel:l(e*32),mass:l(e*4),csr:l((e+1+2*t)*4),chunks:l(Math.max(2,2*r)*4),rowChunk:l((e+1)*4),springF:l(Math.max(1,r)*8),cellCount:l(o*4),start:l(o*4),blockSums:l(Math.max(o/1024,4)*4),nodeCell:l(e*4),nodeSlot:l(e*4),slotted:l(e*4),perm:l(e*4),sp:l(e*16),cells:l((s+2*c)*16),fire:l(4112),box:l(8256)}}async function Rd(e,t,n){let r=[];for(let[t,n]of Object.entries(jd))r.push([t,wu(e,{code:n,label:t})]);for(let[i,a]of Object.entries(Md)){let o=a(t);r.push([i,wu(e,{code:o,label:i})]),n&&r.push([i+`_STEP`,wu(e,{code:o,label:i,bindings:Nd[i]})])}let i=await Promise.all(r.map(e=>e[1])),a={};return r.forEach((e,t)=>{a[e[0]]=i[t]}),a}async function zd(e,{n:t,edges:n,init:r,mass:i,law:a=null,variants:o=!1}){let s=await Rd(e,a,o),c=Id(t),l=Math.log2(c),u=c*c,d=u/1024,f=new Uint32Array(t);for(let e=0;e<n.length;e+=2)f[n[e]]++,f[n[e+1]]++;let p=new Uint32Array(t+1+2*(n.length/2));for(let e=0;e<t;e++)p[e+1]=p[e]+f[e];let m=p.slice(0,t);for(let e=0;e<n.length;e+=2){let r=n[e],i=n[e+1];p[t+1+m[r]++]=i,p[t+1+m[i]++]=r}let h=0;for(let e=0;e<t;e++)h+=Math.ceil(f[e]/od);let g=new Uint32Array(Math.max(2,2*h)),_=new Uint32Array(t+1);for(let e=0,n=0;e<t;e++){_[e]=n;for(let t=p[e];t<p[e+1];t+=od,n++)g[2*n]=e,g[2*n+1]=t}_[t]=h;let v=Ld(t,n.length/2,h),y=GPUBufferUsage.STORAGE,b=GPUBufferUsage.COPY_DST,x=GPUBufferUsage.COPY_SRC,S=[];e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`);let C=(t,n=y)=>{let r=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n});return S.push(r),r},w=(t,n=y|b)=>{let r=C(t.byteLength,n);return e.queue.writeBuffer(r,0,t),r},T=w(r,y|b|x),E=C(v.vel,y|b|x),D=w(i),O=w(p),k=w(g),A=w(_),j=C(v.springF),M=C(v.cellCount,y|b),N=C(v.start),P=C(v.blockSums),F=C(v.nodeCell),I=C(v.nodeSlot),L=C(v.slotted),R=C(v.perm),z=C(v.sp),ee=0,B=[];for(let e=0,t=c;e<=l;e++,t>>=1)B.push(ee),ee+=t*t;let te=C(v.cells),ne=C(v.fire,y|b|x),re=Math.min(cd,Math.ceil(t/ad)),ie=new Uint32Array(2064),ae=new Float32Array(ie.buffer);{let e=1/0,n=1/0,i=-1/0,a=-1/0;for(let o=0;o<t;o++){let t=r[2*o],s=r[2*o+1];t<e&&(e=t),t>i&&(i=t),s<n&&(n=s),s>a&&(a=s)}let o=Math.max(i-e,a-n,.001)*1.0001;ae[4]=(e+i-o)/2,ae[5]=(n+a-o)/2,ae[6]=o,ae[7]=c/o,ie[0]=ie[1]=4294967295}let V=w(ie,y|b|x),oe=a?128:64,se=new ArrayBuffer(oe),ce=new Uint32Array(se),H=new Float32Array(se);ce[0]=t,ce[1]=c,ce[2]=l,ce[3]=u,ce[10]=sd,ce[12]=od,ce[13]=Math.max(1,Math.floor(t/1e3)),ce[14]=h,ce[15]=ee;let U=C(oe,GPUBufferUsage.UNIFORM|b),le=w(new Uint32Array([d,0,0,0]),GPUBufferUsage.UNIFORM|b),ue=w(new Uint32Array([re,0,0,0]),GPUBufferUsage.UNIFORM|b),W=(t,n)=>e.createBindGroup({layout:t.getBindGroupLayout(0),entries:n.map((e,t)=>({binding:t,resource:{buffer:e}}))}),de={HIST:W(s.HIST,[U,T,V]),BOX:W(s.BOX,[U,V]),BIN:W(s.BIN,[U,T,V,M,F,I]),SCAN_BLOCKS:W(s.SCAN_BLOCKS,[M,N,P]),SCAN_TOP:W(s.SCAN_TOP,[P,le]),SCAN_ADD:W(s.SCAN_ADD,[N,P]),PLACE:W(s.PLACE,[U,F,I,N,L]),ORDER:W(s.ORDER,[U,T,D,F,I,N,L,z,R]),SPRINGS:W(s.SPRINGS,[U,k,O,T,j]),AGG0:W(s.AGG0,[U,N,z,te]),LOCAL:W(s.LOCAL,[U,V,te]),FORCE:W(s.FORCE,[U,z,R,N,te,j,A,T,E]),FIRE_REDUCE:W(s.FIRE_REDUCE,[U,E,ne]),FIRE_STATE:W(s.FIRE_STATE,[ue,ne]),FIRE_INTEGRATE:W(s.FIRE_INTEGRATE,[U,T,E,D,ne])},fe=[];for(let e=0;e<l;e++){let t=(c>>e+1)**2,n=w(new Uint32Array([t,B[e],B[e+1],0]),GPUBufferUsage.UNIFORM|b);fe.push({count:t,group:W(s.PYR,[n,te])})}let pe=(await Promise.all([e.popErrorScope(),e.popErrorScope()])).find(Boolean);if(pe)throw S.forEach(e=>e.destroy()),Error(`could not create the GPU buffers: `+pe.message);let me=null,he=null,ge=0,_e=null;function ve(t){me&&me.destroy(),ge=Math.max(64,t),me=e.createBuffer({size:ge*Fd,usage:GPUBufferUsage.UNIFORM|b}),_e=new ArrayBuffer(ge*Fd);let n={buffer:me,size:oe};he={LOCAL:e.createBindGroup({layout:s.LOCAL_STEP.getBindGroupLayout(0),entries:[{binding:0,resource:n},{binding:1,resource:{buffer:V}},{binding:2,resource:{buffer:te}}]}),FORCE:e.createBindGroup({layout:s.FORCE_STEP.getBindGroupLayout(0),entries:[n].concat([z,R,N,te,j,A,T,E].map(e=>({buffer:e}))).map((e,t)=>({binding:t,resource:e}))})}}let ye=Math.ceil(t/ad),be=Math.min(ye,128),xe=!1;function Se(t){e.queue.writeBuffer(ne,0,new Float32Array(t||[.1,0,0,0]))}function Ce(){Se(null)}Ce();function we(e,t,n){e.setPipeline(s[t]),e.setBindGroup(0,de[t]),e.dispatchWorkgroups(n)}function Te(e,t){we(e,`HIST`,be),we(e,`BOX`,1),we(e,`BIN`,ye),we(e,`SCAN_BLOCKS`,d),we(e,`SCAN_TOP`,1),we(e,`SCAN_ADD`,Math.ceil(u/256)),we(e,`PLACE`,ye),we(e,`ORDER`,ye),h&&we(e,`SPRINGS`,Math.ceil(h/ad)),we(e,`AGG0`,Math.ceil(u/ad)),e.setPipeline(s.PYR);for(let{count:t,group:n}of fe)e.setBindGroup(0,n),e.dispatchWorkgroups(Math.ceil(t/256));if(t<0)we(e,`LOCAL`,Math.ceil(B[l]/ad)),we(e,`FORCE`,ye);else{let n=[t*Fd];e.setPipeline(s.LOCAL_STEP),e.setBindGroup(0,he.LOCAL,n),e.dispatchWorkgroups(Math.ceil(B[l]/ad)),e.setPipeline(s.FORCE_STEP),e.setBindGroup(0,he.FORCE,n),e.dispatchWorkgroups(ye)}xe&&(we(e,`FIRE_REDUCE`,re),we(e,`FIRE_STATE`,1),we(e,`FIRE_INTEGRATE`,ye))}return{kind:`grid`,G:c,pos:T,vel:E,mass:D,fire:ne,variants:o,setParams(t){H[4]=t.gravity,H[5]=t.springLength,H[6]=t.springCoefficient,H[7]=t.dragCoefficient,H[8]=t.timeStep,H[9]=t.maxVelocity,ce[11]=+(t.integrator===`fire`),xe=ce[11]===1,e.queue.writeBuffer(U,0,se)},setLawValues(t){H.set(t,16),e.queue.writeBuffer(U,64,se,64)},resetFire:Ce,setFire:Se,run(t,{timestampWrites:n=null,beforeFinish:r=null,perSubmit:i=64,lawSteps:a=null}={}){if(a&&!o)throw Error(`this engine was built without per-step law values`);for(let o=0;o<t;){let s=Math.min(i,t-o);if(a){s>ge&&ve(s);let t=new Uint8Array(se),n=new Uint8Array(_e);for(let e=0;e<s;e++)n.set(t,e*Fd),a(o+e,new Float32Array(_e,e*Fd,oe/4),16);e.queue.writeBuffer(me,0,_e,0,s*Fd)}let c=e.createCommandEncoder(),l=o===0,u=o+s===t,d;n&&(l||u)&&(d={querySet:n.querySet},l&&(d.beginningOfPassWriteIndex=0),u&&(d.endOfPassWriteIndex=1));let f=c.beginComputePass(d?{timestampWrites:d}:void 0);for(let e=0;e<s;e++)Te(f,a?e:-1);f.end(),u&&r&&r(c),e.queue.submit([c.finish()]),o+=s}},boxBuffer:V,destroy(){for(let e of S)e.destroy();me&&me.destroy()}}}function Bd(e=null){let t=Object.assign({},jd);for(let[n,r]of Object.entries(Md))t[n]=r(e);return t}var Vd=64,Hd=2048,Ud=1073741824,Y={MIN:0,MAX:4,K0:8,SIZE:12,CELL:16,UNIT:17,TOTAL:18,FLAG:19,MA:20,RA:24,CELL_LOW:27,VMAX:28,SCALE:29,BLOCKS:35,TAB_LAST:30,TAB_GAMMA:31,TAB_DONE:32,ZERO:33,REFINE:34,STATUS:36,IND:44,TABLE:80},Wd=Y.IND,Gd=Y.IND+3,Kd=Y.IND+6,qd=Y.IND+15,Jd=Y.IND+18,Yd=4294967295;function Xd(e,t,n=` `){let r=[];for(let n=0;n<e;n++)r.push(t(n));return r.join(n)}function Zd(e,t){return e===2&&t===0?`scan`:`lines`}function Qd(e){return e+8}function $d(e,t){return Math.ceil(((t+4)**+e+1)/Hd)*Hd}function ef(e){return 4+4*Math.ceil(e/64)}function tf(e){let{D:t,label:n}=e,r={};if(r[`${n}_MINMAX`]=Cf(e),r[`${n}_PARAMS`]=Ef(e),r[`${n}_BIN`]=Df(e),r[`${n}_SCAN_BLOCKS`]=Of(e),r[`${n}_SCAN_TOP`]=kf(e),r[`${n}_ORDER`]=jf(e),r[`${n}_CROWD`]=Ff(e),r[`${n}_DEPOSIT`]=If(e),e.smooth){for(let i=0;i<t;i++)r[`${n}_SMOOTH${i}`]=zf(e,i);r[`${n}_RESIDUAL`]=Lf(e)}return r[`${n}_GATHER`]=Bf(e),r}function nf(e){return e.weights===`quadratic`}function rf(e){return e.deposit?3:2}function af(e){return e.deposit&&e.D===3?2:1}function of(e){let t=nf(e);return`struct GridU { n: u32, maxCells: u32, capacity: u32, tableSize: u32, zero: u32, unused0: u32, unused1: u32, unused2: u32 };
const GRID_PAD: i32 = ${+!!t};
fn grid_finite(x: f32) -> bool { return (bitcast<u32>(x) & 0x7f800000u) != 0x7f800000u; }
fn grid_enc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn grid_dec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
${t?`// quadratic (triangular-shaped cloud) weights and slopes of the points at offset d of the base
fn grid_w(f: f32, d: i32) -> f32 {
  if (d < 0) { let t = 0.5 - f; return 0.5 * t * t; }
  if (d == 0) { return 0.75 - f * f; }
  let t = 0.5 + f; return 0.5 * t * t;
}
fn grid_s(f: f32, d: i32) -> f32 {
  if (d < 0) { return f - 0.5; }
  if (d == 0) { return -2.0 * f; }
  return 0.5 + f;
}`:`// linear (cloud-in-cell) weights and slopes of the points at offset d of the base
fn grid_w(f: f32, d: i32) -> f32 { return select(1.0 - f, f, d == 1); }
fn grid_s(f: f32, d: i32) -> f32 { return select(-1.0, 1.0, d == 1); }`}
`}function sf(e,t){return t.map((t,n)=>t.kind===`step`?e.values.decl(n):t.kind===`uniform`?`@group(0) @binding(${n}) var<uniform> ${t.name}: ${t.type};`:`@group(0) @binding(${n}) var<storage, ${t.kind===`read`?`read`:`read_write`}> ${t.name}: ${t.type};`).join(`
`)}var cf=`fn grid_opq(x: f32) -> f32 { return bitcast<f32>(bitcast<u32>(x) ^ GU.zero); }
`,lf=`fn grid_opq(x: f32) -> f32 { return x; }
`;function uf(e,t,n){let r=t.some(e=>e.name===`GU`)?e.opaque===!1?lf:cf:``;return{code:of(e)+sf(e,t)+`
`+r+n,bindings:t.map(e=>({name:e.name,kind:e.kind}))}}var df={name:`GU`,kind:`uniform`,type:`GridU`},ff={name:`V`,kind:`step`},pf={name:`gridMeta`,kind:`read`,type:`array<u32>`},mf={name:`gridMeta`,kind:`storage`,type:`array<u32>`},hf=e=>({name:`gridField`,kind:e,type:`array<f32>`}),gf=e=>({name:`gridLo`,kind:e,type:`array<f32>`}),_f=(e,t)=>({name:`gridChunk`,kind:e,type:t});function vf(e,t){let n=[];return e.forEach(e=>{n.indexOf(e.buffer)<0&&n.push(e.buffer)}),n.map(e=>({name:e,kind:t,type:`array<f32>`}))}function yf(e){return`bitcast<f32>(gridMeta[${e}u])`}function bf(e){let t=e.anchor===`box`,n=`  let cell = ${yf(Y.CELL)}; let clo = ${yf(Y.CELL_LOW)}; let total = gridMeta[${Y.TOTAL}u]; let flag = gridMeta[${Y.FLAG}u];\n`;for(let r=0;r<e.D;r++)n+=`  let s${r} = i32(gridMeta[${Y.SIZE+r}u]); let ma${r} = ${yf(Y.MA+r)}; let ra${r} = ${yf(Y.RA+r)};`,n+=t?`
`:` let k${r} = bitcast<i32>(gridMeta[${Y.K0+r}u]);\n`;return n}function xf(e){let t=e.anchor===`box`,n=nf(e),r=``;for(let i=0;i<e.D;i++)r+=`  let x${i} = ${e.pos.at(`i`,i)};\n`,r+=`  let m${i} = floor(x${i} / cell);\n`,r+=`  let t${i} = grid_opq(fma(-m${i}, cell, x${i})) - ra${i} - m${i} * clo${n?` + 0.5 * cell`:``};\n`,r+=`  let q${i} = floor(t${i} / cell);\n`,r+=`  let b${i} = (m${i} - ma${i}) + q${i};\n`,r+=`  let f${i} = t${i} / cell - q${i}${n?` - 0.5`:``};\n`,r+=`  let c${i} = clamp(i32(b${i})${t?``:` - k${i}`}, GRID_PAD, s${i} - 2);\n`;return r+=`  let ok = ${Xd(e.D,e=>`grid_finite(x${e})`,` && `)};\n`,r}function Sf(e){return e===3?`c0 + c1 * s0 + c2 * s0 * s1`:`c0 + c1 * s0`}function Cf(e){let{D:t}=e,n=[df,{name:e.pos.buffer,kind:`read`,type:`array<f32>`},{name:`gridMeta`,kind:`storage`,type:`array<atomic<u32>>`}];e.deposit&&wf(e,n);let r=e.deposit?`
    ${e.deposit.lines.join(`
    `)}
    most = max(most, abs(${e.deposit.code}));`:``;return uf(e,n,`var<workgroup> grid_mn: array<atomic<u32>, ${t}>;
var<workgroup> grid_mx: array<atomic<u32>, ${t}>;
var<workgroup> grid_most: atomic<u32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(num_workgroups) nwg: vec3u) {
  if (li < ${t}u) { atomicStore(&grid_mn[li], 0xffffffffu); atomicStore(&grid_mx[li], 0u); }
  if (li == 0u) { atomicStore(&grid_most, 0u); }
  workgroupBarrier();
  ${Xd(t,e=>`var mn${e} = 3.4e38; var mx${e} = -3.4e38;`)} var most = 0.0;
  for (var i = gid.x; i < GU.n; i += nwg.x * 256u) {
    ${Xd(t,t=>`let x${t} = ${e.pos.at(`i`,t)};`)}
    if (!(${Xd(t,e=>`grid_finite(x${e})`,` && `)})) { continue; }
    ${Xd(t,e=>`mn${e} = min(mn${e}, x${e}); mx${e} = max(mx${e}, x${e});`)}${r}
  }
  ${Xd(t,e=>`atomicMin(&grid_mn[${e}], grid_enc(mn${e})); atomicMax(&grid_mx[${e}], grid_enc(mx${e}));`,`
  `)}
  ${e.deposit?`atomicMax(&grid_most, bitcast<u32>(most));`:``}
  workgroupBarrier();
  if (li == 0u) {
    ${Xd(t,e=>`atomicMin(&gridMeta[${Y.MIN+e}u], atomicLoad(&grid_mn[${e}])); atomicMax(&gridMeta[${Y.MAX+e}u], atomicLoad(&grid_mx[${e}]));`,`
    `)}
    ${e.deposit?`atomicMax(&gridMeta[${Y.VMAX}u], atomicLoad(&grid_most));`:``}
  }
}`)}function wf(e,t){t.push(ff),e.deposit.buffers.forEach(e=>{t.some(t=>t.name===e)||t.push({name:e,kind:`read`,type:`array<f32>`})})}var Tf=`// a + b = s + e exactly (two-sum)
fn grid_sum(a: f32, b: f32) -> vec2f {
  let s = grid_opq(a + b);
  let bb = grid_opq(s - a);
  return vec2f(s, grid_opq(a - grid_opq(s - bb)) + grid_opq(b - bb));
}
fn grid_add(x: vec2f, y: vec2f) -> vec2f {
  let s = grid_sum(x.x, y.x);
  return grid_sum(s.x, s.y + x.y + y.y);
}
// x / k for a whole number k
fn grid_over(x: vec2f, k: f32) -> vec2f {
  let q = x.x / k;
  return grid_sum(q, (grid_opq(fma(-q, k, x.x)) + x.y) / k);
}
// floor((v - A) / cell) and the fraction left, with A = ma cell + ra (as bodyLets computes them)
fn grid_index(v: vec2f, ma: f32, ra: f32, cell: vec2f) -> vec2f {
  let m = floor(v.x / cell.x);
  let t = grid_opq(fma(-m, cell.x, v.x)) + v.y - ra - m * cell.y;
  let q = floor(t / cell.x);
  return vec2f(m - ma + q, t / cell.x - q);
}
`;function Ef(e){let{D:t}=e,n=e.anchor===`box`,r=e.values.at,i=Qd(e.maxCells),a=e=>e.reduce((e,t)=>`max(${e}, ${t})`),o=(e,t)=>`grid_split(${e}, ${t}u);`,s=[];s.push(`  let cellBase = ${r(`cell`)}; let margin = ${r(`margin`)};`),s.push(`  let mg = vec2f(margin, ${r(`marginLow`)});`),s.push(`  var flag = 0u;`),s.push(`  if (!(grid_finite(cellBase) && cellBase > 0.0 && grid_finite(margin) && margin >= 0.0)) { flag = 2u; }`),s.push(`  if (${Xd(t,e=>`gridMeta[${Y.MIN+e}u] > gridMeta[${Y.MAX+e}u]`,` || `)}) { flag = 2u; }`);for(let e=0;e<t;e++)s.push(`  let mn${e} = grid_dec(gridMeta[${Y.MIN+e}u]); let mx${e} = grid_dec(gridMeta[${Y.MAX+e}u]);`),s.push(`  gridMeta[${Y.MIN+e}u] = 0xffffffffu; gridMeta[${Y.MAX+e}u] = 0u;`);s.push(`  var cell = vec2f(cellBase, ${r(`cellLow`)});`),s.push(`  ${Xd(t,e=>`var sz${e} = 0u;`)}`),s.push(`  ${Xd(t,e=>`var ma${e} = 0.0; var ra${e} = 0.0;`)}`);let c=+!!nf(e);if(n){for(let e=0;e<t;e++)s.push(`  let span${e} = grid_add(grid_sum(mx${e}, -mn${e}), 2.0 * mg);`);s.push(`  let most = f32(GU.maxCells);`);for(let e=0;e<t;e++)s.push(`  { let fit = grid_over(span${e}, most); if (fit.x > cell.x || (fit.x == cell.x && fit.y > cell.y)) { cell = fit; } }`);s.push(`  if (!(grid_finite(cell.x) && cell.x > 0.0)) { flag = 2u; }`),s.push(`  if (flag == 0u) {`);for(let e=0;e<t;e++)s.push(`    let corner${e} = grid_add(grid_add(vec2f(mn${e}, 0.0), -mg), ${c?`-cell`:`vec2f(0.0, 0.0)`});`),s.push(`    ma${e} = floor(corner${e}.x / cell.x); ra${e} = grid_opq(fma(-ma${e}, cell.x, corner${e}.x)) + corner${e}.y - ma${e} * cell.y;`),s.push(`    let fit${e} = grid_index(span${e}, 0.0, 0.0, cell);`),s.push(`    sz${e} = min(u32(fit${e}.x) + select(0u, 1u, fit${e}.y > 0.0), GU.maxCells) + ${2+2*c}u;`);s.push(`  }`)}else{s.push(`  var widest = 0.0; var wideAxis = 0u;`),s.push(`  if (flag == 0u) {`);for(let e=0;e<t;e++)s.push(`    let ph${e} = ${r(`phase`+e)};`),s.push(`    ma${e} = floor(-ph${e} / cell.x); ra${e} = grid_opq(fma(-ma${e}, cell.x, -ph${e})) - ma${e} * cell.y;`),s.push(`    let lo${e} = grid_index(grid_add(vec2f(mn${e}, 0.0), -mg), ma${e}, ra${e}, cell).x;`),s.push(`    let hi${e} = grid_index(grid_add(vec2f(mx${e}, 0.0), mg), ma${e}, ra${e}, cell).x;`),s.push(`    let across${e} = hi${e} - lo${e};`),s.push(`    if (!(across${e} <= f32(GU.maxCells)) && !(across${e} <= widest)) { widest = across${e}; wideAxis = ${e}u; }`),s.push(`    sz${e} = u32(max(across${e}, 0.0)) + ${2+2*c}u;`),s.push(`    gridMeta[${Y.K0+e}u] = bitcast<u32>(i32(lo${e}) - GRID_PAD);`);s.push(`  }`),s.push(`  if (flag == 0u && widest > 0.0) { flag = 1u; }`),s.push(`  if (flag == 1u && gridMeta[${Y.STATUS}u] == 0u) {`),s.push(`    gridMeta[${Y.STATUS}u] = 1u; gridMeta[${Y.STATUS+1}u] = bitcast<u32>(widest);`),s.push(`    gridMeta[${Y.STATUS+2}u] = bitcast<u32>(cell.x); gridMeta[${Y.STATUS+3}u] = wideAxis;`),s.push(`  }`)}for(let e=0;e<t;e++)s.push(`  gridMeta[${Y.MA+e}u] = bitcast<u32>(ma${e}); gridMeta[${Y.RA+e}u] = bitcast<u32>(ra${e});`);s.push(`  var total = 0u;`),s.push(`  if (flag == 0u) { total = ${Xd(t,e=>`sz${e}`,` * `)}; }`),s.push(`  if (flag == 0u && total > GU.capacity) {`),s.push(`    if (gridMeta[${Y.STATUS}u] == 0u) { gridMeta[${Y.STATUS}u] = 3u; gridMeta[${Y.STATUS+1}u] = bitcast<u32>(f32(total)); gridMeta[${Y.STATUS+2}u] = bitcast<u32>(cell.x); }`),s.push(`    flag = 3u; total = 0u;`),s.push(`  }`);for(let e=0;e<t;e++)s.push(`  gridMeta[${Y.SIZE+e}u] = sz${e};`);s.push(`  gridMeta[${Y.STATUS+4}u] = total;`),s.push(`  gridMeta[${Y.CELL}u] = bitcast<u32>(cell.x); gridMeta[${Y.CELL_LOW}u] = bitcast<u32>(cell.y);`),s.push(`  gridMeta[${Y.TOTAL}u] = total; gridMeta[${Y.FLAG}u] = flag;`);let l=Xd(t,()=>`cell.x`,` * `);if(s.push(`  gridMeta[${Y.UNIT}u] = bitcast<u32>(${e.deposit?`1.0`:r(`value`)} / (${l}));`),e.deposit?(s.push(`  let vmax = ${yf(Y.VMAX)}; gridMeta[${Y.VMAX}u] = 0u;`),s.push(`  gridMeta[${Y.SCALE}u] = bitcast<u32>(select(0.0, ${Ud}.0 / vmax, vmax > 0.0 && grid_finite(vmax)));`)):s.push(`  gridMeta[${Y.SCALE}u] = bitcast<u32>(f32(${Ud}.0));`),s.push(`  let blocks = (total + ${Hd}u) / ${Hd}u;`),s.push(`  gridMeta[${Y.BLOCKS}u] = blocks;`),s.push(`  gridMeta[${Wd}u] = blocks; gridMeta[${Wd+1}u] = 1u; gridMeta[${Wd+2}u] = 1u;`),s.push(`  ${o(`(total + 255u) / 256u`,Gd)}`),s.push(`  gridChunk[0] = 0u; gridChunk[1] = 1u; gridChunk[2] = 1u; gridChunk[3] = 0u;`),e.smooth){for(let e=0;e<t;e++){let n=`select(0u, total / sz${e}, total > 0u)`;s.push(`  ${o(Zd(t,e)===`scan`?n:`(${n} + 63u) / ${Vd}u`,Kd+3*e)}`)}s.push(`  let diffuse = ${r(`diffuse`)};`),s.push(`  let gam = select(0.0, diffuse / (cell.x * cell.x), diffuse > 0.0);`),s.push(`  let refine = flag == 0u && gam >= 2.0;`),s.push(`  gridMeta[${Y.REFINE}u] = select(0u, 1u, refine);`),s.push(`  ${o(`select(0u, (total + 255u) / 256u, refine)`,qd)}`);for(let e=0;e<t;e++)s.push(`  for (var w = 0u; w < 3u; w++) { gridMeta[${Jd+3*e}u + w] = select(0u, gridMeta[${Kd+3*e}u + w], refine || w == 2u); }`);s.push(`  let need = ${a(Array.from({length:t},(e,t)=>`sz${t}`))};`),s.push(`  let held = gridMeta[${Y.TAB_DONE}u];`),s.push(`  if (flag == 0u && (gridMeta[${Y.TAB_GAMMA}u] != bitcast<u32>(gam) || (held != ${Yd}u && held < need))) {`),s.push(`    let ti = ${Y.TABLE}u; let tu = ${Y.TABLE+i}u;`),s.push(`    var mu = 1.0 + gam; var inv = 1.0 / (gam + mu); var mu1 = -1.0; var inv1 = -1.0;`),s.push(`    gridMeta[ti] = bitcast<u32>(inv); gridMeta[tu] = bitcast<u32>(mu);`),s.push(`    var last = 0u; var done = ${Yd}u;`),s.push(`    loop {`),s.push(`      if (last + 1u >= need) { done = need; break; }`),s.push(`      let mu2 = 1.0 + gam * mu * inv; let inv2 = 1.0 / (gam + mu2);`),s.push(`      last += 1u;`),s.push(`      gridMeta[ti + last] = bitcast<u32>(inv2); gridMeta[tu + last] = bitcast<u32>(mu2);`),s.push(`      if ((mu2 == mu && inv2 == inv) || (mu2 == mu1 && inv2 == inv1)) { break; }`),s.push(`      mu1 = mu; inv1 = inv; mu = mu2; inv = inv2;`),s.push(`    }`),s.push(`    gridMeta[${Y.TAB_LAST}u] = last; gridMeta[${Y.TAB_GAMMA}u] = bitcast<u32>(gam); gridMeta[${Y.TAB_DONE}u] = done;`),s.push(`  }`)}return uf(e,[df,ff,mf,_f(`storage`,`array<u32>`)],`fn grid_split(w: u32, at: u32) { gridMeta[at] = min(w, 65535u); gridMeta[at + 1u] = (w + 65534u) / 65535u; gridMeta[at + 2u] = 1u; }
${Tf}@compute @workgroup_size(1)
fn main() {
${s.join(`
`)}
}`)}function Df(e){let t=rf(e),n=[df,pf,{name:e.pos.buffer,kind:`read`,type:`array<f32>`},{name:`gridCount`,kind:`storage`,type:`array<atomic<u32>>`},{name:`gridKey`,kind:`storage`,type:`array<u32>`}];e.deposit&&wf(e,n);let r=e.deposit?`${e.deposit.lines.map(e=>`  `+e).join(`
`)}
  gridKey[${t}u * i + 2u] = bitcast<u32>(${e.deposit.code});\n`:``;return uf(e,n,`@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${bf(e)}  if (flag != 0u) { return; }
${xf(e)}${r}  if (!ok) { gridKey[${t}u * i] = 0xffffffffu; return; }
  let cid = u32(${Sf(e.D)});
  gridKey[${t}u * i] = cid;
  gridKey[${t}u * i + 1u] = atomicAdd(&gridCount[cid], 1u);
}`)}function Of(e){return uf(e,[{name:`gridCount`,kind:`storage`,type:`array<u32>`},{name:`gridStart`,kind:`storage`,type:`array<u32>`}],`var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * ${Hd}u + li * 8u;
  var a: array<u32, 8>;
  var t = 0u;
  for (var m = 0u; m < 8u; m++) { a[m] = gridCount[base + m]; gridCount[base + m] = 0u; t += a[m]; }
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
  for (var m = 0u; m < 8u; m++) { gridStart[base + m] = ex; ex += a[m]; }
  if (li == 255u) { gridStart[${e.capacity}u + wid.x] = tmp[255]; }
}`)}function kf(e){let t=Math.max(1,Math.ceil(e.capacity/Hd/256));return uf(e,[pf,{name:`gridStart`,kind:`storage`,type:`array<u32>`}],`var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  let nb = gridMeta[${Y.BLOCKS}u];
  let top = ${e.capacity}u;
  let base = li * ${t}u;
  var a: array<u32, ${t}>;
  var t = 0u;
  for (var m = 0u; m < ${t}u; m++) { if (base + m < nb) { a[m] = gridStart[top + base + m]; } else { a[m] = 0u; } t += a[m]; }
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
  for (var m = 0u; m < ${t}u; m++) { if (base + m < nb) { gridStart[top + base + m] = ex; } ex += a[m]; }
}`)}function Af(e){return`fn grid_start(e: u32) -> u32 { return gridStart[e] + gridStart[${e.capacity}u + e / ${Hd}u]; }\n`}function jf(e){let{D:t}=e,n=rf(e),r=af(e),i=e.deposit?`bitcast<f32>(gridKey[${n}u * i + 2u])`:`0.0`,a;return a=t===2?`  gridSp[at] = vec4f(f0, f1, ${i}, f32(c0));`:r===1?`  gridSp[at] = vec4f(f0, f1, f2, f32(c0));`:`  gridSp[${r}u * at] = vec4f(f0, f1, f2, f32(c0));\n  gridSp[${r}u * at + 1u] = vec4f(${i}, 0.0, 0.0, 0.0);`,uf(e,[df,pf,{name:e.pos.buffer,kind:`read`,type:`array<f32>`},{name:`gridKey`,kind:`read`,type:`array<u32>`},{name:`gridStart`,kind:`read`,type:`array<u32>`},{name:`gridSp`,kind:`storage`,type:`array<vec4f>`},_f(`storage`,`array<atomic<u32>>`)],`${Af(e)}@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${bf(e)}  if (flag != 0u) { return; }
  let cid = gridKey[${n}u * i];
  if (cid == 0xffffffffu) { return; }
${xf(e)}  let slot = gridKey[${n}u * i + 1u];
  let start = grid_start(cid);
  let at = start + slot;
${a}
  if (slot % 64u == 0u && grid_start(cid + 1u) - start > 64u) {
    let k = atomicAdd(&gridChunk[3], 1u);
    atomicStore(&gridChunk[4u + 2u * k], at); atomicStore(&gridChunk[5u + 2u * k], cid);
    atomicMax(&gridChunk[0], k / 256u + 1u);
  }
}`)}function Mf(e){let t=nf(e)?[-1,0,1]:[0,1],n=[],r=(i,a)=>{if(i===e.D)n.push(a);else for(let e of t)r(i+1,a.concat(e))};return r(0,[]),n}function Nf(e,t){return e.deposit?`{ let tq = i32(round(w * v)); let sum = ${t}.x + bitcast<u32>(tq); ${t} = vec2u(sum, ${t}.y + bitcast<u32>(tq >> 31u) + select(0u, 1u, sum < ${t}.x)); }`:`{ let tq = u32(max(w, 0.0) * v + 0.5); let sum = ${t}.x + tq; ${t} = vec2u(sum, ${t}.y + select(0u, 1u, sum < ${t}.x)); }`}function Pf(e){let t=af(e),n=e.deposit?e.D===2?`e.z * scale`:`gridSp[${t}u * q + 1u].x * scale`:`scale`;return`let e = gridSp[${t===1?`q`:`${t}u * q`}]; let v = ${n};`}function Ff(e){let{D:t}=e,n=Mf(e),r=e=>e.map(e=>({"-1":`m`,0:`z`,1:`p`})[e]).join(``),i=nf(e)?[-1,0,1]:[0,1],a=[`e.x`,`e.y`,`e.z`],o=Array.from({length:t},(e,t)=>i.map(e=>`let w${t}${r([e])} = grid_w(${a[t]}, ${e});`).join(` `)).join(`
    `),s=[``,` * s0`,` * s0 * s1`];return uf(e,[pf,{name:`gridStart`,kind:`read`,type:`array<u32>`},{name:`gridSp`,kind:`read`,type:`array<vec4f>`},_f(`read`,`array<u32>`),{name:`gridAcc`,kind:`storage`,type:`array<atomic<u32>>`}],`${Af(e)}fn grid_flush(t: u32, a: vec2u) {
  if (a.x == 0u && a.y == 0u) { return; }
  let old = atomicAdd(&gridAcc[2u * t], a.x);
  let high = a.y + select(0u, 1u, old + a.x < old);
  if (high != 0u) { atomicAdd(&gridAcc[2u * t + 1u], high); }
}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let k = gid.x;
  if (k >= gridChunk[3]) { return; }
  let first = gridChunk[4u + 2u * k]; let cid = gridChunk[5u + 2u * k];
  let last = min(first + 64u, grid_start(cid + 1u));
  let scale = ${yf(Y.SCALE)};
  ${Xd(t,e=>`let s${e} = i32(gridMeta[${Y.SIZE+e}u]);`)}
  ${n.map(e=>`var a${r(e)} = vec2u(0u, 0u);`).join(` `)}
  for (var q = first; q < last; q++) {
    ${Pf(e)}
    ${o}
    ${n.map(t=>`{ let w = ${t.map((e,t)=>`w${t}${r([e])}`).join(` * `)}; ${Nf(e,`a`+r(t))} }`).join(`
    `)}
  }
  ${n.map(e=>`grid_flush(u32(i32(cid) + ${e.map((e,t)=>`(${e})${s[t]}`).join(` + `)}), a${r(e)});`).join(`
  `)}
}`)}function If(e){let{D:t}=e,n=nf(e),r=n?[-1,0,1]:[0,1],i=[];t===2?r.forEach(e=>i.push([e])):r.forEach(e=>r.forEach(t=>i.push([t,e])));let a=`grid_w(e.x, j0 - i32(e.w)) * grid_w(e.y, d1)${t===3?` * grid_w(e.z, d2)`:``}`,o=(e,n)=>`acc = grid_run(acc, ${e}, ${n}, j0, ${t===3?`d1, d2`:`d1`}, scale);`,s=(e,n)=>i.map(([r,i])=>{let a=[`cy >= 0 && cy < s1`];return t===3&&a.push(`cz >= 0 && cz < s2`),`{
  let d1 = ${r}; let cy = j1 - d1;${t===3?` let d2 = ${i}; let cz = j2 - d2;`:``}
  if (${a.join(` && `)}) {
    let row = cy * s0${t===3?` + cz * s0 * s1`:``};
    let beg = grid_start(u32(row + lo0));
    let fin = grid_start(u32(row + hi0 + 1));
    ${e}
  }
}`.split(`
`).join(`
`+n)}).join(`
`+n),c=s(o(`beg`,`fin`),`    `),l=s(`if (fin - beg <= 64u) { ${o(`beg`,`fin`)} } else {
      for (var cx = lo0; cx <= hi0; cx++) {
        let s = grid_start(u32(row + cx)); let e = grid_start(u32(row + cx + 1));
        if (e - s <= 64u) { ${o(`s`,`e`)} } else { near = true; }
      }
    }`,`    `),u=[pf,{name:`gridStart`,kind:`read`,type:`array<u32>`},{name:`gridSp`,kind:`read`,type:`array<vec4f>`},_f(`read`,`array<u32>`),{name:`gridAcc`,kind:`storage`,type:`array<u32>`},hf(`storage`)];e.smooth&&u.push(gf(`storage`));let d=yf(Y.UNIT);return uf(e,u,`${Af(e)}// the terms of sorted bodies [beg, fin) at grid point (j0, row offsets d1, d2), added to acc
fn grid_run(sum: vec2u, beg: u32, fin: u32, j0: i32, d1: i32, ${t===3?`d2: i32, `:``}scale: f32) -> vec2u {
  var acc = sum;
  for (var q = beg; q < fin; q++) { ${Pf(e)} let w = ${a}; ${Nf(e,`acc`)} }
  return acc;
}
// a 64-bit sum as f32; a negative one is negated first, or f32(high) * 2^32 and f32(low) would
// cancel (a small negative sum came out 0, or 2.5% off)
fn grid_total(a: vec2u) -> f32 {
  let neg = (a.y & 0x80000000u) != 0u;
  let lo = select(a.x, ~a.x + 1u, neg);
  let hi = select(a.y, ~a.y + select(0u, 1u, a.x == 0u), neg);
  let size = f32(hi) * 4294967296.0 + f32(lo);
  return select(size, -size, neg);
}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let t = gid.x + gid.y * nwg.x * 256u;
${bf(e)}  if (t >= total) { return; }
  let scale = ${yf(Y.SCALE)};
  let j0 = i32(t % u32(s0));
  let r = t / u32(s0);
  ${t===3?`let j1 = i32(r % u32(s1)); let j2 = i32(r / u32(s1));`:`let j1 = i32(r);`}
  let lo0 = max(j0 - 1, 0);
  let hi0 = min(j0${n?` + 1`:``}, s0 - 1);
  var acc = vec2u(0u, 0u);
  if (gridChunk[3] == 0u) {
    ${c}
  } else {
    var near = false;
    ${l}
    if (near) {
      let a = vec2u(gridAcc[2u * t], gridAcc[2u * t + 1u]);
      gridAcc[2u * t] = 0u; gridAcc[2u * t + 1u] = 0u;
      let sum = acc.x + a.x;
      acc = vec2u(sum, acc.y + a.y + select(0u, 1u, sum < acc.x));
    }
  }
  let deposited = select(0.0, grid_total(acc) * (${d} / scale), scale > 0.0);
  gridField[t] = deposited;${e.smooth?`\n  if (gridMeta[${Y.REFINE}u] != 0u) { gridLo[t] = deposited; }`:``}
}`)}function Lf(e){let{D:t}=e,n=[],r=(e,i)=>{if(e===t)n.push(i);else for(let t of[-1,0,1])r(e+1,i.concat(t))};r(0,[]);let i=e=>e.map(e=>({"-1":`m`,0:`z`,1:`p`})[e]).join(``),a=[``,` * s0`,` * s0 * s1`],o=n.map(e=>{let t=e.map((e,t)=>e===0?null:e<0?`j${t} > 0`:`j${t} + 1 < s${t}`).filter(Boolean),n=`gridField[u32(${e.map((e,t)=>`${e===0?`j${t}`:e<0?`max(j${t} - 1, 0)`:`min(j${t} + 1, s${t} - 1)`}${a[t]}`).join(` + `)})]`;return`let x${i(e)} = ${t.length?`select(0.0, ${n}, ${t.join(` && `)})`:n};`}),s=[],c=e=>{let r=new Map;n.filter(t=>t.every((t,n)=>e.indexOf(n)>=0||t===0)).forEach(e=>r.set(i(e),`x${i(e)}`));let a=e.slice();for(;a.length;){let t=a.shift(),n=new Map;r.forEach((a,o)=>{let c=o.split(``).map(e=>({m:-1,z:0,p:1})[e]);if(c[t]!==0)return;let l=e=>r.get(i(c.map((n,r)=>r===t?e:n))),u=`l${e.join(``)}_${t}_${o}`;s.push(`let ${u} = grid_hold(grid_hold(${a} - ${l(-1)}) + grid_hold(${a} - ${l(1)}));`),n.set(o,u)}),r=n}return r.get(i(Array(t).fill(0)))},l=[];for(let e=1;e<1<<t;e++)l.push(Array.from({length:t},(e,t)=>t).filter(t=>e&1<<t));let u=[1,2,3].map(e=>l.filter(t=>t.length===e).map(c)).filter(e=>e.length),d=[`gam`,`gam * gam`,`gam * gam * gam`],f=u.map((e,t)=>`grid_hold(${d[t]} * grid_hold(${e.join(` + `)}))`).join(` + `),p=e.opaque===!1?`x`:`bitcast<f32>(bitcast<u32>(x) ^ gridMeta[${Y.ZERO}u])`;return uf(e,[pf,hf(`read`),gf(`storage`)],`fn grid_hold(x: f32) -> f32 { return ${p}; }
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let t = gid.x + gid.y * nwg.x * 256u;
  let total = gridMeta[${Y.TOTAL}u];
  if (t >= total) { return; }
  let gam = ${yf(Y.TAB_GAMMA)};
  ${Xd(t,e=>`let s${e} = i32(gridMeta[${Y.SIZE+e}u]);`)}
  let j0 = i32(t % u32(s0));
  let r = t / u32(s0);
  ${t===3?`let j1 = i32(r % u32(s1)); let j2 = i32(r / u32(s1));`:`let j1 = i32(r);`}
  ${o.join(`
  `)}
  ${s.join(`
  `)}
  gridLo[t] = grid_hold(gridLo[t] - x${i(Array(t).fill(0))}) - grid_hold(${f});
}`)}function Rf(e){return e===0?`let base = l * u32(s0); let step = 1u; let L = u32(s0);`:e===1?`let base = (l % u32(s0)) + (l / u32(s0)) * u32(s0 * s1); let step = u32(s0); let L = u32(s1);`:`let base = l; let step = u32(s0 * s1); let L = u32(s2);`}function zf(e,t){let{D:n}=e,r=Qd(e.maxCells),i=`let s0 = i32(gridMeta[${Y.SIZE}u]); let s1 = i32(gridMeta[${Y.SIZE+1}u]);${n===3?` let s2 = i32(gridMeta[${Y.SIZE+2}u]);`:``}`,a=`let K = gridMeta[${Y.TAB_LAST}u]; let gam = ${yf(Y.TAB_GAMMA)};
  let ti = ${Y.TABLE}u;`,o=[pf,hf(`storage`)];if(Zd(n,t)===`scan`){let n=Math.ceil(r/256);return uf(e,o,`var<workgroup> sa: array<f32, 256>;
var<workgroup> sb: array<f32, 256>;
var<workgroup> wlines: u32;
// inclusive scan of affine maps (A, B), x -> A x + B, earlier maps applied first
fn grid_scan(li: u32) {
  for (var off = 1u; off < 256u; off <<= 1u) {
    var A = sa[li]; var B = sb[li];
    if (li >= off) { let Ap = sa[li - off]; let Bp = sb[li - off]; B = A * Bp + B; A = A * Ap; }
    workgroupBarrier();
    sa[li] = A; sb[li] = B;
    workgroupBarrier();
  }
}
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  if (li == 0u) { wlines = select(0u, gridMeta[${Y.TOTAL}u] / gridMeta[${Y.SIZE+t}u], gridMeta[${Y.TOTAL}u] > 0u); }
  let lines = workgroupUniformLoad(&wlines);
  ${i}
  let l = wid.x + wid.y * nwg.x;
  if (l >= lines) { return; }
  ${Rf(t)}
  ${a}
  let m0 = li * ${n}u;
  var u: array<f32, ${n}>;
  for (var k = 0u; k < ${n}u; k++) { let m = m0 + k; if (m < L) { u[k] = gridField[base + m * step]; } else { u[k] = 0.0; } }
  // forward: d_m = alpha_m d_{m-1} + u_m inv_m, alpha_m = gamma inv_m (alpha_0 = 0)
  var A = 1.0; var B = 0.0;
  for (var k = 0u; k < ${n}u; k++) {
    let m = m0 + k;
    if (m < L) { let iv = bitcast<f32>(gridMeta[ti + min(m, K)]); let al = select(gam * iv, 0.0, m == 0u); A = al * A; B = al * B + u[k] * iv; }
  }
  sa[li] = A; sb[li] = B;
  workgroupBarrier();
  grid_scan(li);
  var d = select(0.0, sb[max(li, 1u) - 1u], li > 0u);
  workgroupBarrier();
  for (var k = 0u; k < ${n}u; k++) {
    let m = m0 + k;
    if (m < L) { let iv = bitcast<f32>(gridMeta[ti + min(m, K)]); let al = select(gam * iv, 0.0, m == 0u); d = al * d + u[k] * iv; u[k] = d; }
  }
  // backward: x_m = g_m x_{m+1} + d_m, g_m = gamma inv_m (g_{L-1} = 0), scanned from the end
  A = 1.0; B = 0.0;
  for (var k = ${n-1}; k >= 0; k--) {
    let m = m0 + u32(k);
    if (m < L) { let g = select(gam * bitcast<f32>(gridMeta[ti + min(m, K)]), 0.0, m == L - 1u); A = g * A; B = g * B + u[k]; }
  }
  let r = 255u - li;
  sa[r] = A; sb[r] = B;
  workgroupBarrier();
  grid_scan(r);
  var x = select(0.0, sb[max(r, 1u) - 1u], r > 0u);
  for (var k = ${n-1}; k >= 0; k--) {
    let m = m0 + u32(k);
    if (m < L) { let g = select(gam * bitcast<f32>(gridMeta[ti + min(m, K)]), 0.0, m == L - 1u); x = g * x + u[k]; u[k] = x; }
  }
  for (var k = 0u; k < ${n}u; k++) { let m = m0 + k; if (m < L) { gridField[base + m * step] = u[k]; } }
}`)}return uf(e,o,`@compute @workgroup_size(${Vd})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  let l = gid.x + gid.y * nwg.x * ${Vd}u;
  let total = gridMeta[${Y.TOTAL}u];
  ${i}
  if (total == 0u || l >= total / gridMeta[${Y.SIZE+t}u]) { return; }
  ${Rf(t)}
  ${a}
  var d = gridField[base] * bitcast<f32>(gridMeta[ti]);
  gridField[base] = d;
  var u: array<f32, 8>; var cf: array<f32, 8>;
  var m = 1u;
  loop {
    if (m + 8u > L) { break; }
    for (var k = 0u; k < 8u; k++) { u[k] = gridField[base + (m + k) * step]; cf[k] = bitcast<f32>(gridMeta[ti + min(m + k, K)]); }
    for (var k = 0u; k < 8u; k++) { d = (u[k] + gam * d) * cf[k]; u[k] = d; }
    for (var k = 0u; k < 8u; k++) { gridField[base + (m + k) * step] = u[k]; }
    m += 8u;
  }
  for (; m < L; m++) { let idx = base + m * step; d = (gridField[idx] + gam * d) * bitcast<f32>(gridMeta[ti + min(m, K)]); gridField[idx] = d; }
  var x = d;
  var q = i32(L) - 2;
  loop {
    if (q < 7) { break; }
    for (var k = 0; k < 8; k++) { u[k] = gridField[base + u32(q - k) * step]; cf[k] = gam * bitcast<f32>(gridMeta[ti + min(u32(q - k), K)]); }
    for (var k = 0; k < 8; k++) { x = u[k] + cf[k] * x; u[k] = x; }
    for (var k = 0; k < 8; k++) { gridField[base + u32(q - k) * step] = u[k]; }
    q -= 8;
  }
  for (; q >= 0; q--) { let idx = base + u32(q) * step; x = gridField[idx] + gam * bitcast<f32>(gridMeta[ti + min(u32(q), K)]) * x; gridField[idx] = x; }
}`)}function Bf(e){let{D:t}=e,n=nf(e),r=n?[-1,0,1]:[0,1],i=e.self===`exclude`?e.smooth?`smoothed`:`plain`:null,a=e=>({"-1":`m`,0:`z`,1:`p`})[e],o=``;for(let e=0;e<t;e++)for(let t of r)o+=`  let w${e}${a(t)} = grid_w(f${e}, ${t}); let q${e}${a(t)} = grid_s(f${e}, ${t});\n`;let s=[],c=(e,n)=>{if(e===t)s.push(n);else for(let t of r)c(e+1,n.concat(t))};c(0,[]);let l=[``,` * s0`,` * s0 * s1`],u=(e,t)=>t+e.map(a).join(``),d=(e,t)=>s.map(n=>{let r=n.map((e,t)=>`(c${t} + (${e}))${l[t]}`).join(` + `),o=n.map((e,t)=>`w${t}${a(e)}`).join(` * `);return`let ${u(n,e)} = ${t}[u32(${r})]${i===`plain`?` - u * ${o}`:``};`}),f=e=>s.map(t=>`${t.map((e,t)=>`w${t}${a(e)}`).join(` * `)} * ${u(t,e)}`).join(` + `),p=(e,t)=>s.filter(t=>t[e]===0).map(r=>{let i=r.map((t,n)=>n===e?null:`w${n}${a(t)}`).filter(Boolean).join(` * `),o=n=>u(r.map((t,r)=>r===e?n:t),t),s=n?`(q${e}m * grid_opq(${o(-1)} - ${o(0)}) + q${e}p * grid_opq(${o(1)} - ${o(0)}))`:`grid_opq(${o(1)} - ${o(0)})`;return i?`grid_opq(${s} * ${i})`:s}).join(` + `),m=d(`o`,`gridField`).concat([`var v = ${f(`o`)};`],Array.from({length:t},(e,t)=>`var gr${t} = ${p(t,`o`)};`)).join(`
  `);e.smooth&&(m+=`\n  if (gridMeta[${Y.REFINE}u] != 0u) {\n    `+d(`l`,`gridLo`).concat([`v += ${f(`l`)};`],Array.from({length:t},(e,t)=>`gr${t} += ${p(t,`l`)};`)).join(`
    `)+`
  }`);let h=[e.outputs.value,e.outputs.gradient],g=[df,pf,{name:e.pos.buffer,kind:`read`,type:`array<f32>`},hf(`read`)].concat(e.smooth?[gf(`read`)]:[],vf(h,`storage`));i&&e.deposit&&g.push({name:`gridKey`,kind:`read`,type:`array<u32>`});let _=(n,r)=>`${e.outputs.value.at(`i`,0)} = ${n}; ${Xd(t,t=>`${e.outputs.gradient.at(`i`,t)} = ${r(t)};`)}`,v=yf(Y.UNIT);return uf(e,g,`${i===`smoothed`?Vf(e):``}@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= GU.n) { return; }
${bf(e)}  // no grid (a cell of 0, no body at a finite position): the field is 0, as on the CPU
  if (flag == 2u) { ${_(`0.0`,()=>`0.0`)} return; }
  // a lattice too wide (the runner halts at the next readback): the columns keep their numbers
  if (flag != 0u) { return; }
${xf(e)}  if (!ok) { ${_(`0.0`,()=>`0.0`)} return; }
  let u = ${i&&e.deposit?`bitcast<f32>(gridKey[${rf(e)}u * i + 2u]) * ${v}`:v};
${o}  ${m}
${i===`smoothed`?Hf(e):``}  ${_(`v`,e=>`gr${e} / cell`)}
}`)}function Vf(e){let t=Qd(e.maxCells);return`fn grid_mu(p: i32, K: u32) -> f32 { return bitcast<f32>(gridMeta[${Y.TABLE+t}u + min(u32(p), K)]); }
fn grid_keep(p: i32, K: u32, gam: f32) -> f32 { return gam * bitcast<f32>(gridMeta[${Y.TABLE}u + min(u32(p), K)]); }
fn grid_d(p: i32, L: i32, K: u32) -> f32 { return 1.0 / (grid_mu(p, K) + grid_mu(L - 1 - p, K) - 1.0); }
`}function Hf(e){let{D:t}=e,n=nf(e)?3:2,r=nf(e)?[-1,0,1]:[0,1],i=e=>({"-1":`m`,0:`z`,1:`p`})[e],a=[`  let sK = gridMeta[${Y.TAB_LAST}u]; let sg = ${yf(Y.TAB_GAMMA)};`];for(let e=0;e<t;e++){let t=(t,n)=>`G${e}_${Math.min(t,n)}${Math.max(t,n)}`;a.push(`  let st${e} = c${e} - GRID_PAD;`);for(let r=0;r<n;r++)a.push(`  let ${t(r,r)} = grid_d(st${e} + ${r}, s${e}, sK);`);for(let r=0;r+1<n;r++)a.push(`  let ${t(r,r+1)} = grid_keep(st${e} + ${r}, sK, sg) * ${t(r+1,r+1)};`);n===3&&a.push(`  let ${t(0,2)} = grid_keep(st${e}, sK, sg) * ${t(1,2)};`);let o=n=>r.map((r,a)=>`${t(n,a)} * w${e}${i(r)}`).join(` + `);a.push(`  let r${e}_0 = ${o(0)}; let r${e}_1 = ${o(1)};${n===3?` let r${e}_2 = ${o(2)};`:``}`),a.push(`  let tilt${e} = ${n===3?`q${e}m * (r${e}_0 - r${e}_1) + q${e}p * (r${e}_2 - r${e}_1)`:`r${e}_1 - r${e}_0`};`),a.push(`  let read${e} = ${r.map((t,n)=>`w${e}${i(t)} * r${e}_${n}`).join(` + `)};`)}a.push(`  v -= u * ${Xd(t,e=>`read${e}`,` * `)};`);for(let e=0;e<t;e++)a.push(`  gr${e} -= u * ${Xd(t,t=>t===e?`tilt${t}`:`read${t}`,` * `)};`);return a.join(`
`)+`
`}function Uf({opaque:e=!0}={}){let t={anchor:`box`,weights:`linear`,label:`GRID_CANARY`,opaque:e},n=Object.assign({D:2,pos:{buffer:`X`,at:(e,t)=>`X[${e} * 2u + ${t}u]`}},t);return{SUMS:uf(n,[df,pf,{name:`X`,kind:`read`,type:`array<f32>`},{name:`C`,kind:`storage`,type:`array<f32>`}],`${Tf}@compute @workgroup_size(64)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i == 0u) {
    let e = grid_sum(C[0], C[1]);
    C[2] = e.x; C[3] = e.y;
    let q = grid_over(vec2f(C[4], C[5]), C[6]);
    C[7] = q.x; C[8] = q.y;
  }
  if (i >= GU.n) { return; }
${bf(n)}${xf(n)}  C[16u + 4u * i] = b0; C[17u + 4u * i] = f0; C[18u + 4u * i] = b1; C[19u + 4u * i] = f1;
}`),RESIDUAL2:Lf(Object.assign({D:2},t)),RESIDUAL3:Lf(Object.assign({D:3},t))}}var Wf=`xyzw`,Gf=[`cell`,`cellLow`,`margin`,`marginLow`,`diffuse`,`value`],Kf=`pending a one-time check of this GPU's arithmetic (runOnGpu waits for it, and refuses the stage if the GPU fails it)`,qf={2:16,3:8};function Jf(e){return Gf.concat(Array.from({length:e},(e,t)=>`phase`+t))}function Yf({stage:e,D:t,n,limits:r,pos:i,column:a,values:o=null,label:s=`GRID`,warn:c,printer:l}){let u=(e,t={})=>({refusal:e,buffers:t,kernels:{},slotNames:[],dispatches:0}),d=e.args||{};if(t!==2&&t!==3)return u(`grid fields are 2D and 3D; this layout is ${t}D`);let f=d.maxCells;if(!(f>=1)||Math.floor(f)!==f)return u(`the grid's maxCells should be a positive whole number, not ${f}`);for(let e of[`cell`,`margin`,`diffuse`]){let t=d[e];if(t&&t.kind===`number`){let n=Uu(t.value);if(n)return u(`the grid's ${e}: ${n}`)}}let p=r.gridArithmetic,m=!!(p&&p.pending);if(m&&c&&c(`${e.name} runs, ${Kf}`),p&&!p.sums&&d.anchor===`box`&&f>qf[t])return u(`${p.reason}. Without exact arithmetic a ${t}D box grid wider than ${qf[t]} cells per axis is off by more than half the tolerance, and this one may reach ${f}. Set maxCells to ${qf[t]}, use the 'lattice' anchor, or run on the CPU`);if(p&&!(p.sums&&p.residual)&&d.diffuse){let e=Xf(d);if(!(e<2))return u(`${p.reason}. Without exact arithmetic smoothing with diffuse / cell^2 of 2 or more is off by more than half the tolerance, and this grid's ${Number.isFinite(e)?`is ${+e.toPrecision(4)}`:`comes from expressions, known only as it runs`}. Run it on the CPU`)}let h=Jf(t);e.params.forEach(e=>h.push(`param:`+e.name)),(e.builtIns||[]).forEach(e=>h.push(`builtIn:`+e));let g=null;if(!o){let e=Math.max(16,Math.ceil(h.length/4)*4);g={names:h,floats:e},o={decl:t=>`@group(0) @binding(${t}) var<uniform> V: array<vec4f, ${e/4}>;`,at:e=>{let t=h.indexOf(e);if(t<0)throw Error(`the grid reads no number ${e}`);return`V[${t>>2}].${Wf[t&3]}`}}}let _=null;try{_=ip(d.value,e,t,{param:e=>o.at(`param:`+e),builtIn:e=>o.at(`builtIn:`+e),column:a},l||Gu(c))}catch(e){return u(`the deposit value: `+e.message)}let v=$d(t,f),y=Qd(f),b=_?3:2,x=_&&t===3?2:1,S=e=>Math.max(16,Math.ceil(e/16)*16),C={gridMeta:S((Y.TABLE+2*y)*4),gridCount:S(v*4),gridStart:S((v+v/2048)*4),gridKey:S(b*n*4),gridSp:S(x*n*16),gridChunk:S(ef(n)*4),gridAcc:S(2*v*4),gridField:S(v*4)};d.diffuse&&(C.gridLo=S(v*4));let w=Math.min(r.maxStorageBufferBindingSize,r.maxBufferSize),T=Object.keys(C).filter(e=>C[e]>w);if(T.length){let e=T.sort((e,t)=>C[t]-C[e])[0];return u(`a ${t}D grid of up to ${f.toLocaleString(`en-US`)} cells per axis at ${n.toLocaleString(`en-US`)} bodies needs ${ap(C[e])} for ${e}; this device allows ${ap(w)} per buffer`,C)}if(Math.ceil(n/256)>r.maxComputeWorkgroupsPerDimension)return u(`grid fields run up to ${(r.maxComputeWorkgroupsPerDimension*256).toLocaleString(`en-US`)} bodies`);let E=d.into||{},D={D:t,label:s,maxCells:f,capacity:v,anchor:d.anchor,weights:d.weights,self:d.self,smooth:!!d.diffuse,pos:i,outputs:{value:a(E.value),gradient:a(E.gradient)},deposit:_,values:o},O=tf(D);return{refusal:null,D:t,n,label:s,maxCells:f,capacity:v,tableSize:y,anchor:d.anchor,smooth:D.smooth,deposit:!!_,buffers:C,kernels:O,values:o,own:g,pending:m,slotNames:h,dispatches:9+(D.smooth?2*t+1:0)}}function Xf(e){let t=e=>e&&e.kind===`number`?e.value:NaN,n=t(e.diffuse)/(t(e.cell)*t(e.cell));return n>=0?n:1/0}function Zf(e){let t={cell:`grid cell`,margin:`grid margin`,diffuse:`smoothing's diffuse`,value:`deposit value`};for(let n of Object.keys(t)){let r=e[n];if(r!=null&&(!Number.isFinite(r)||Math.abs(r)>34028234663852886e22))return{name:t[n],value:r}}return null}function Qf(e,t,n,r,i){let a=e=>({buffer:e,at:(t,n)=>`${e}[${t} + ${n}u]`}),o=Yf({stage:e,D:t,n,limits:r,printer:i,pos:a(`X`),column:()=>a(`S`)});if(o.refusal)return{runs:!1,reason:o.refusal};let s=e.args;return{runs:!0,how:`a ${s.anchor} grid of up to ${s.maxCells.toLocaleString(`en-US`)} cells per axis, ${s.weights} weights${o.smooth?`, smoothed`:``}${s.self===`exclude`?`, own share left out`:``}: ${o.dispatches} dispatches${o.pending?`; ${Kf}`:``}`}}function $f(e,t,n,r){let i=e=>Number.isFinite(e)&&Math.abs(e)<3e38?e-Math.fround(e):0,a={cell:e.cell,cellLow:i(e.cell),margin:e.margin,marginLow:i(e.margin),diffuse:e.diffuse||0,value:e.value===null||e.value===void 0?1:e.value},o=e.cell;for(let e=0;e<n;e++){let n=t?t[e]:0;a[`phase`+e]=r===`lattice`&&n!==0&&o>0&&o<1/0?n-o*Math.floor(n/o):0}return a}function ep(e){let t=e.args||{};return e.when||[`cell`,`margin`,`diffuse`,`value`].some(e=>t[e]&&t[e].kind===`host`)||e.params.some(e=>e.kind===`host`)?!0:(e.builtIns||[]).indexOf(`step`)>=0}function tp(e){return .1+1.2*e.n/1e6+.3*e.capacity/1e6}function np(e,t){return .02+.25*e.n/1e6+(e.smooth?.15:.03)*t/1e6}function rp(e,t,n){let r=e[0];if(!r)return null;let i=new Float32Array(new Uint32Array([e[1],e[2]]).buffer),a=Number.isFinite(i[0])?Math.round(i[0]):i[0],o=+i[1].toPrecision(6);if(r===1){let e=`Grid field ${n}: the layout spans ${a} cells at cell ${o}`;return t.smooth?`${e}; maxCells is ${t.maxCells}`:`${e}, more than the GPU's maxCells of ${t.maxCells}; the CPU runs this lattice at any width. Raise maxCells, or run on the CPU`}return`Grid field ${n}: the grid needs ${a} cells, more than its buffers hold (${t.capacity})`}function ip(e,t,n,r,i){let a=new Set(t.reads.filter(e=>e.space===`nodes`&&e.column!==`pos`).map(e=>e.column));if(!a.size)return null;if(!e||e.kind!==`expression`)throw Error(`a deposit value that reads columns should be an expression`);let o=new Set(t.params.map(e=>e.name)),s=new Set(t.builtIns||[]),c=[],l=Bu.compile(e.text,{D:n,name(e){if(o.has(e))return{type:`num`,code:r.param(e)};if(a.has(e)){let t=r.column(e);return c.indexOf(t.buffer)<0&&c.push(t.buffer),{type:`num`,code:t.at(`i`,0)}}if(s.has(e))return{type:`num`,code:r.builtIn(e)}}},i);if(!l.result||l.result.type!==`num`)throw Error(`it should give a number`);return{lines:l.lines,code:l.result.code,buffers:c}}function ap(e){return(e/1048576).toFixed(+(e<10485760))+` MiB`}var op=`runsOnGpu`,sp=[`clear`,`repulsion`,`drag`,`springs`,`integrate`];function cp(e){return e.name===`runsOnGpu`&&e.shape===`guard`}function lp(e){return e.stages.filter(e=>!cp(e))}var up=1024,dp=64,fp=64,pp=2047,mp=`xyzw`;function X(e,t,n=` `){let r=[];for(let n=0;n<e;n++)r.push(t(n));return r.join(n)}var hp=e=>1+(e-1)/4;function gp(e){let t=String(Math.fround(e));return/^-?\d+$/.test(t)?t+=`.0`:/e/.test(t)&&!/\./.test(t)&&(t=t.replace(`e`,`.0e`)),e<0?`(`+t+`)`:t}function _p(e,t){return`${e}${t>>2}.${mp[t&3]}`}function vp(e,t,n,r){return X(r,r=>`let ${e}${r} = ${t}[${n}${r?` + ${r}u`:``}];`)}function yp(e){let t=[];for(let n=0;n<e.length;n+=4){let r=[0,1,2,3].map(t=>n+t<e.length?e[n+t]:`0.0`);t.push(`vec4f(${r.join(`, `)})`)}return t}function bp(e,t,n){return yp(n).map((n,r)=>`${e}[${t}${r?` + ${r}u`:``}] = ${n};`).join(` `)}function xp(e,t,n=0){let r=t.length,i=e*(e+1)/2,a=[],o=[],s=0;t.forEach((t,n)=>{a.push(s++),n===0||t.own?(o.push(s),s+=e):o.push(o[0])});let c=s,l=c%4?c:-1,u=e*(e+1)*(e+2)/6,d=[],f=[],p=[];s=e,t.forEach(t=>{d.push(s),f.push(s+e),s+=e+i,t.second?(p.push(s),s+=u):p.push(-1)});let m=s,h=[],g=[];for(let t=0;t<e;t++)for(let n=t;n<e;n++)h.push([t,n]);for(let t=0;t<e;t++)for(let n=t;n<e;n++)for(let r=n;r<e;r++)g.push([t,n,r]);return{D:e,K:r,JN:i,pairs:h,TN:u,triples:g,T:p,SPW:e+r,SP4:Math.ceil((e+r)/4),S:a,C:o,CSW:c,CS4:Math.ceil(c/4),CNT:l,F:d,J:f,LSW:m,LS4:Math.ceil(m/4),TAB4:Math.ceil(n/4),box:Sp(e),bits:Math.floor(31/e)}}function Sp(e){let t={BB_MIN:0,BB_MAX:e,ORIGIN:2*e,SIDE:3*e,INV:3*e+1,CENTRE:3*e+2,DIAG:4*e+2};return t.HEADER=Math.ceil((4*e+3)/4)*4,t.PART=t.HEADER+e*up,t.TOTAL=t.PART+128,t.size=t.TOTAL+1,t}function Cp(e,t){let n=[];for(let e=0;e<t;e++)n.push(e);let r=[];for(let i=Math.floor(Math.log2(Math.max(1,t-1)));i>=0;i--){let a=(1<<i)*(e-1);for(let e=0;e<t;e++)e>>i&1&&(n[e]+=a);let o=0;for(let e of n)o=(o|1<<e)>>>0;r.push([a,o>>>0])}return r}var wp=e=>`0x`+(e>>>0).toString(16)+`u`;function Tp(e,t){let n=Cp(e,t),r=(1<<t)-1>>>0,i=[];for(let e=n.length-1;e>=0;e--)i.push([n[e][0],e?n[e-1][1]:r]);return`
fn tree_spread(v: u32) -> u32 {
  var x = v & ${wp(r)};
  ${n.map(([e,t])=>`x = (x | (x << ${e}u)) & ${wp(t)};`).join(` `)}
  return x;
}
fn tree_compact(v: u32) -> u32 {
  var x = v & ${wp(n[n.length-1][1])};
  ${i.map(([e,t])=>`x = (x | (x >> ${e}u)) & ${wp(t)};`).join(` `)}
  return x;
}`}function Ep(e){let t=`var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;`;return e===2?`
fn tree_jitter(a: u32, b: u32) -> vec2f {
  ${t}
  let angle = f32(h) * (6.2831853 / 4294967296.0);
  return select(-0.01, 0.01, a < b) * vec2f(cos(angle), sin(angle));
}`:`
fn tree_jitter(a: u32, b: u32) -> vec3f {
  ${t}
  let z = f32(h & 0xffffu) * (2.0 / 65536.0) - 1.0;
  let angle = f32(h >> 16u) * (6.2831853 / 65536.0);
  let s = sqrt(max(0.0, 1.0 - z * z));
  return select(-0.01, 0.01, a < b) * vec3f(s * cos(angle), s * sin(angle), z);
}`}function Dp(e,t,n,r=`lo`,i=`hi`){let a=``,o=``;for(let t=e-1;t>=0;t--){let s=n+`  `.repeat(e-1-t);a+=`${s}for (var x${t} = ${r}${t}; x${t} <= ${i}${t}; x${t}++) {\n`,a+=`${s}  let mm${t} = ${t===e-1?``:`mm${t+1} | `}(tree_spread(u32(x${t})) << ${t}u);\n`,o=`${s}}\n`+o}let s=n+`  `.repeat(e);return a+t.trim().split(`
`).map(e=>s+e.trim()).join(`
`)+`
`+o}function Op(e){return e.reduce((e,t)=>e?`max(${e}, ${t})`:t,``)}var kp=`@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u`,Ap=`gid.x + gid.y * nwg.x * 256u`;function jp(e){return`
struct TreeParams {
  n: u32, G: u32, levels: u32, nCells: u32,
  locOff: u32, metaTag: u32, metaRow: u32, metaCount: u32,
  nearCap: u32, outlierRank: u32, gravity: f32, top: u32,
  localGroups: u32, crowdOff: u32, workCap: f32, crowdList: u32,
  occList: u32, hubOff: u32, hubList: u32, pad0: u32,${e?`
  law: array<vec4f, ${Math.ceil(e/4)}>,`:``}
};`}function Mp(e){let{groups:t,L:n}=e,r=Gu(e.warn);return t.map((e,t)=>{if(e.isDefault)return`
fn tree_k1_${t}(r: f32, r2: f32) -> f32 { return 1.0 / (r2 * r); }
fn tree_k12_${t}(r: f32, r2: f32) -> vec2f { let k1 = 1.0 / (r2 * r); return vec2f(k1, 3.0 * k1 / r2); }${e.second?`
fn tree_k123_${t}(r: f32, r2: f32) -> vec3f { let k1 = 1.0 / (r2 * r); let k2 = 3.0 * k1 / r2; return vec3f(k1, k2, 5.0 * k2 / r2); }`:``}`;let i=e.law,a=td(i,t=>e.value(t)),o=(e.tables||[]).map(e=>Pp(t,e)).join(``),s=e=>Np(t,i.emit(r,n.D,`r`,`k1`,e?`k2`:void 0));return`${o}
fn tree_k1_${t}(r: f32, r2: f32) -> f32 { ${a} ${s(!1)} return k1; }
fn tree_k12_${t}(r: f32, r2: f32) -> vec2f { ${a} ${s(!0)} return vec2f(k1, k2); }${e.second?`
// k3 = -k2'(r) / r, from k2 at r (1 +- 1/64)
fn tree_k123_${t}(r: f32, r2: f32) -> vec3f {
  let k = tree_k12_${t}(r, r2);
  let rp = r * 1.015625; let rm = r * 0.984375;
  let kp = tree_k12_${t}(rp, rp * rp).y; let km = tree_k12_${t}(rm, rm * rm).y;
  return vec3f(k.x, k.y, (km - kp) * 32.0 / r2);
}`:``}${i.hasRange?`
fn tree_in_${t}(r2: f32) -> bool { ${a} return r2 <= lawRange2; }`:``}`}).join(`
`)}function Np(e,t){let n=`(\\(?[^()]*\\)?)`;return t.replace(RegExp(`\\(lawFunctions\\.(\\w+)\\.derivative \\? lawFunctions\\.\\w+\\.derivative\\(${n}\\) : 0\\)`,`g`),`tree_slope_${e}_$1($2)`).replace(RegExp(`lawFunctions\\.(\\w+)\\.value\\(${n}\\)`,`g`),`tree_table_${e}_$1($2)`)}function Pp(e,t){let n=t.length-1,r=n/(t.to-t.from),i=e=>`tree_tableWord(${t.base}u + ${e})`;return`
fn tree_table_${e}_${t.name}(x: f32) -> f32 {
  let q = (x - ${gp(t.from)}) * ${gp(r)};
  if (!(q > 0.0)) { return ${i(`0u`)}; }
  if (q >= ${gp(n)}) { return ${i(`${n}u`)}; }
  let k = u32(q);
  let a = ${i(`k`)};
  return a + (${i(`k + 1u`)} - a) * (q - f32(k));
}
fn tree_slope_${e}_${t.name}(x: f32) -> f32 {
  let q = (x - ${gp(t.from)}) * ${gp(r)};
  if (!(q > 0.0) || q >= ${gp(n)}) { return 0.0; }
  let k = u32(q);
  return (${i(`k + 1u`)} - ${i(`k`)}) * ${gp(r)};
}`}function Fp(e){return e.TAB4?`
fn tree_tableWord(w: u32) -> f32 { return treeCells[w >> 2u][w & 3u]; }`:``}function Ip(e,t){return e.map(e=>`${t(e)} != 0.0`).join(` || `)}function Lp(e){let{D:t,L:n}=e,r=n.K,i=n.box,a=up,o=jp(e.lawWords)+Tp(t,n.bits)+Ep(t),s=`@group(0) @binding(0) var<uniform> TP: TreeParams;`,c=e.values?e.values.decl:null,l=e.values&&e.values.gravity?e.values.gravity:`TP.gravity`,u=(e,t)=>{let n=[];e.forEach(e=>{n.indexOf(e.buffer)<0&&n.push(e.buffer)});let r={};return e.forEach(e=>{r[e.buffer]=e.type||`array<f32>`}),{names:n,decl:n.map((e,n)=>`@group(0) @binding(${t+n}) var<storage, read> ${e}: ${r[e]};`).join(`
`)}},d=(t,n)=>e.pos.at(t,n),f=!!e.hubs,p=e.sep||1,m=2*p+1,h=m**t,g=e=>`
fn tree_crowd_work() -> u32 {
  let crowded = ${e(`1u`)};
  let Gi = i32(TP.G);
  var work = 0u;
  for (var l = 0u; l < crowded; l++) {
    let b = ${e(`TP.crowdList + l`)};
    ${X(t,e=>`let x${e} = i32(tree_compact(b >> ${e}u));`,` `)}
    var targets = 0u;
    for (var nu = 0u; nu < ${h}u; nu++) {
      ${X(t,e=>`let y${e} = x${e} + i32((nu / ${m**e}u) % ${m}u) - ${p};`,` `)}
      if (${X(t,e=>`y${e} < 0 || y${e} >= Gi`,` || `)}) { continue; }
      let y = ${X(t,e=>`(tree_spread(u32(y${e})) << ${e}u)`,` | `)};
      targets += select(TP.n, treeMeta[y + 1u], y + 1u < TP.nCells) - treeMeta[y];
    }
    let nb = select(TP.n, treeMeta[b + 1u], b + 1u < TP.nCells) - treeMeta[b];
    work += u32(ceil(f32(nb) * f32(targets) * 1e-6));
  }
  return work;
}
// the cap refuses this step's crowded cells (weighted by the charges, see chargeWeight)
fn tree_refused() -> bool { return f32(tree_crowd_work()) * ${gp(hp(r)*1e6)} > TP.workCap; }`,_=(()=>{let n=u(f?[e.pos].concat(e.charges):[e.pos],1);return o+`
${s}
${n.decl}
@group(0) @binding(${1+n.names.length}) var<storage, read_write> treeBox: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${t*a}>;
var<workgroup> wb: array<atomic<u32>, ${2*t}>;${f?`
var<workgroup> qpart: array<f32, 256>;
var<workgroup> qneed: u32;`:``}
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u, @builtin(workgroup_id) wid: vec3u) {
  for (var b = li; b < ${t*a}u; b += 256u) { atomicStore(&hist[b], 0u); }
  if (li < ${t}u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < ${2*t}u) { atomicStore(&wb[li], 0u); }${f?`
  // the |charge| total comes from the last step's top cell (BOX); the first step sums it here
  if (li == 0u) { qneed = select(0u, 1u, atomicLoad(&treeBox[${i.TOTAL}]) == 0u); }
  let needQ = workgroupUniformLoad(&qneed) != 0u;`:`
  workgroupBarrier();`}
  ${X(t,e=>`let c${e} = bitcast<f32>(atomicLoad(&treeBox[${i.CENTRE+e}]));`)}
  ${X(t,e=>`var mn${e} = 3e38; var mx${e} = -3e38;`)}${f?`
  var qs = 0.0;`:``}
  for (var i = gid.x; i < TP.n; i += nwg.x * 256u) {
    ${X(t,e=>`let p${e} = ${d(`i`,e)};`)}
    if (!(${X(t,e=>`abs(p${e}) < 1e37`,` && `)})) { continue; } // NaN or inf${f?`
    if (needQ) { qs += ${e.charges.map(e=>`abs(${e.at(`i`,0)})`).join(` + `)}; }`:``}
    ${X(t,e=>`mn${e} = min(mn${e}, p${e}); mx${e} = max(mx${e}, p${e});`)}
    ${X(t,e=>`atomicAdd(&hist[${e*a}u + hbin(p${e} - c${e})], 1u);`)}
  }
  ${X(t,e=>`atomicMin(&wb[${e}], fenc(mn${e})); atomicMax(&wb[${t+e}], fenc(mx${e}));`)}
  workgroupBarrier();
  for (var b = li; b < ${t*a}u; b += 256u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&treeBox[${i.HEADER}u + b], v); }
  }
  if (li == 0u) {
    ${X(t,e=>`atomicMin(&treeBox[${i.BB_MIN+e}], atomicLoad(&wb[${e}])); atomicMax(&treeBox[${i.BB_MAX+e}], atomicLoad(&wb[${t+e}]));`,`
    `)}
  }${f?`
  // this workgroup's |charge| sum, in a fixed tree (BOX adds the workgroups' in order)
  if (needQ) {
    qpart[li] = qs;
    for (var h = 128u; h > 0u; h >>= 1u) {
      workgroupBarrier();
      if (li < h) { qpart[li] += qpart[li + h]; }
    }
    if (li == 0u) { atomicStore(&treeBox[${i.PART}u + wid.x], bitcast<u32>(qpart[0])); }
  }`:``}
}`})(),v=!!e.heavyCells,y=o+`
${s}
@group(0) @binding(1) var<storage, read_write> treeBox: array<u32>;
@group(0) @binding(2) var<storage, read_write> treeLists: array<u32>;
var<workgroup> scan: array<u32, 256>;
var<workgroup> found: array<f32, ${3*t}>;
var<workgroup> total: u32;${f?`
var<workgroup> qsum: array<f32, 256>;
var<workgroup> qneed: u32;`:``}
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < ${3*t}u) { found[li] = 0.0; }
  if (li < 8u && li != 2u && li != 3u) { treeLists[li] = 0u; }${f?`
  // The total |charge| (AGG0's measure of a hub): the first step adds HIST's workgroups' sums in
  // a fixed tree; the top cell's writer (tree_block) sets it for the next, so HIST reads no
  // charges then
  if (li == 0u) { qneed = select(0u, 1u, treeBox[${i.TOTAL}] == 0u); }
  if (workgroupUniformLoad(&qneed) != 0u) {
    qsum[li] = select(0.0, bitcast<f32>(treeBox[${i.PART}u + li]), li < min((TP.n + 255u) / 256u, 128u));
    for (var h = 128u; h > 0u; h >>= 1u) {
      workgroupBarrier();
      if (li < h) { qsum[li] += qsum[li + h]; }
    }
    if (li == 0u) { treeBox[${i.TOTAL}] = bitcast<u32>(qsum[0]); }
  }`:``}
  for (var a = 0u; a < ${t}u; a++) {
    let base = ${i.HEADER}u + a * ${a}u + li * 4u;
    var cs = array<u32, 4>(treeBox[base], treeBox[base + 1u], treeBox[base + 2u], treeBox[base + 3u]);
    let t = cs[0] + cs[1] + cs[2] + cs[3];
    scan[li] = t;
    workgroupBarrier();
    for (var off = 1u; off < 256u; off <<= 1u) {
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
      let k = min(TP.outlierRank, (count - 1u) / 2u);
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
    for (var j = 0u; j < 4u; j++) { treeBox[base + j] = 0u; }
    workgroupBarrier();
  }
  if (li == 0u) {
    if (total > 0u) {
      var span = 0.0;
      ${X(t,e=>`let c${e} = bitcast<f32>(treeBox[${i.CENTRE+e}]); let qLo${e} = c${e} + found[${3*e}]; let qHi${e} = c${e} + found[${3*e+1}]; span = max(span, qHi${e} - qLo${e});`,`
      `)}
      let margin = 0.25 * span;
      var side = 0.0; var diag = 0.0;
      ${X(t,e=>`let lo${e} = max(fdec(treeBox[${i.BB_MIN+e}]), qLo${e} - margin); let hi${e} = min(fdec(treeBox[${i.BB_MAX+e}]), qHi${e} + margin); side = max(side, hi${e} - lo${e}); diag = max(diag, fdec(treeBox[${i.BB_MAX+e}]) - fdec(treeBox[${i.BB_MIN+e}]));`,`
      `)}
      side = max(side * 1.0001, 1e-3);
      ${X(t,e=>`treeBox[${i.ORIGIN+e}] = bitcast<u32>(0.5 * (lo${e} + hi${e}) - 0.5 * side); treeBox[${i.CENTRE+e}] = bitcast<u32>(c${e} + found[${3*e+2}]);`,`
      `)}
      treeBox[${i.SIDE}] = bitcast<u32>(side); treeBox[${i.INV}] = bitcast<u32>(f32(TP.G) / side);
      treeBox[${i.DIAG}] = bitcast<u32>(diag);
    }
    ${X(t,e=>`treeBox[${i.BB_MIN+e}] = 0xffffffffu; treeBox[${i.BB_MAX+e}] = 0u;`,`
    `)}
  }
}`,b=(()=>{let n=u([e.pos],1),r=1+n.names.length;return o+`
${s}
${n.decl}
@group(0) @binding(${r}) var<storage, read> treeBox: array<u32>;
@group(0) @binding(${r+1}) var<storage, read_write> treeCount: array<atomic<u32>>;
@group(0) @binding(${r+2}) var<storage, read_write> treeWork: array<u32>;
@compute @workgroup_size(256)
fn main(${kp}) {
  let i = ${Ap};
  if (i >= TP.n) { return; }
  let inv = bitcast<f32>(treeBox[${i.INV}]);
  let gmax = f32(TP.G - 1u);
  ${X(t,e=>`let q${e} = (${d(`i`,e)} - bitcast<f32>(treeBox[${i.ORIGIN+e}])) * inv;`,`
  `)}
  // outside the box (by more than half a cell): clamped into a border cell
  let inside = ${X(t,e=>`q${e} > -0.5 && q${e} < gmax + 1.5`,` && `)};
  let c = ${X(t,e=>`(tree_spread(u32(clamp(floor(q${e}), 0.0, gmax))) << ${e}u)`,` | `)};
  treeWork[2u * i] = c | select(0x80000000u, 0u, inside);
  treeWork[2u * i + 1u] = atomicAdd(&treeCount[c], 1u);
}`})(),x=jp(e.lawWords)+`
@group(0) @binding(0) var<storage, read_write> treeCount: array<u32>;
@group(0) @binding(1) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read_write> blockSums: array<u32>;
@group(0) @binding(3) var<uniform> TP: TreeParams;
@group(0) @binding(4) var<storage, read_write> treeLists: array<atomic<u32>>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = treeCount[base]; let a1 = treeCount[base + 1u]; let a2 = treeCount[base + 2u]; let a3 = treeCount[base + 3u];
  if (max(max(a0, a1), max(a2, a3)) > TP.nearCap) {
    let a = array<u32, 4>(a0, a1, a2, a3);
    for (var k = 0u; k < 4u; k++) {
      if (a[k] > TP.nearCap) { atomicStore(&treeLists[TP.crowdList + atomicAdd(&treeLists[1], 1u)], base + k); }
    }
  }
  treeCount[base] = 0u; treeCount[base + 1u] = 0u; treeCount[base + 2u] = 0u; treeCount[base + 3u] = 0u;
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
  treeMeta[base] = ex; treeMeta[base + 1u] = ex + a0; treeMeta[base + 2u] = ex + a0 + a1; treeMeta[base + 3u] = ex + a0 + a1 + a2;
  if (li == 255u) { blockSums[wid.x] = tmp[255]; }
}`,S=jp(e.lawWords)+`
${s}
@group(0) @binding(1) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read> blockSums: array<u32>;
@compute @workgroup_size(256)
fn main(${kp}) {
  let e = ${Ap};
  if (e >= TP.nCells) { return; }
  treeMeta[e] += blockSums[e >> 10u];
}`,C=jp(e.lawWords)+`
${s}
@group(0) @binding(1) var<storage, read> treeMeta: array<u32>;
@group(0) @binding(2) var<storage, read_write> treeWork: array<u32>;
@compute @workgroup_size(256)
fn main(${kp}) {
  let i = ${Ap};
  if (i >= TP.n) { return; }
  treeWork[2u * TP.n + treeMeta[treeWork[2u * i] & 0x7fffffffu] + treeWork[2u * i + 1u]] = i;
}`,w=(()=>{let r=u([e.pos].concat(e.charges),1),i=1+r.names.length,a=[];for(let e=0;e<t;e++)a.push(`${d(`i`,e)}`);return e.charges.forEach(e=>a.push(e.at(`i`,0))),jp(e.lawWords)+Tp(t,n.bits)+`
${s}
${r.decl}
@group(0) @binding(${i}) var<storage, read> treeWork: array<u32>;
@group(0) @binding(${i+1}) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(${i+2}) var<storage, read_write> treeSp: array<vec4f>;
@group(0) @binding(${i+3}) var<storage, read> treeLists: array<u32>;
${g(e=>`treeLists[${e}]`)}
@compute @workgroup_size(256)
fn main(${kp}) {
  let i = ${Ap};
  if (i >= TP.n) { return; }
  let raw = treeWork[2u * i];
  let c = raw & 0x7fffffffu;
  let s = treeMeta[c];
  let e = select(TP.n, treeMeta[c + 1u], c + 1u < TP.nCells);
  var rank = treeWork[2u * i + 1u];
  // A crowded cell keeps the atomic order on a step the cap refuses (nothing is computed from it),
  // and so does a cell of more than 65,536 bodies (65,536^2 pairs are refused)
  if (e - s <= 65536u && !(e - s > TP.nearCap && tree_refused())) {
    rank = 0u;
    for (var t = s; t < e; t++) { if (treeWork[2u * TP.n + t] < i) { rank++; } }
  }
  let k = s + rank;
  ${bp(`treeSp`,`k * ${n.SP4}u`,a)}
  treeMeta[TP.metaTag + 2u * k] = i;
  treeMeta[TP.metaTag + 2u * k + 1u] = raw;
  treeMeta[TP.metaRow + i] = k;
}`})(),T=[];e.channels.forEach((e,t)=>{(t===0||e.own)&&T.push(t)});let E=(e,i,a)=>{let o=[];for(let a=0;a<r;a++)if(o[n.S[a]]=e(a),T.indexOf(a)>=0)for(let e=0;e<t;e++)o[n.C[a]+e]=i(a,e);return n.CNT>=0&&(o[n.CNT]=`f32(${a})`),o},D=`struct TreeRec { v: array<vec4f, ${n.CS4}>, n: u32 };`,O=(e,t,n)=>`var ${e}: TreeRec; ${yp(t).map((t,n)=>`${e}.v[${n}] = ${t};`).join(` `)} ${e}.n = ${n};`,k=(e,t,r)=>X(n.CS4,r=>`treeCells[${n.TAB4}u + (${e}) * ${n.CS4}u + ${r}u] = ${t}.v[${r}];`)+(n.CNT<0?` treeMeta[${r} + ${e}] = ${t}.n;`:``),A=1<<t,j=e=>`
  ${X(r,e=>`var m${e} = 0.0;`)}
  ${T.map(e=>`var w${e} = 0.0; `+X(t,t=>`var s${e}_${t} = 0.0;`)).join(` `)}
  ${X(t,e=>`var u${e} = 0.0;`)}
  var cnt = 0u;
  for (var ch = 0u; ch < ${A}u; ch++) {
    ${e(`ch`)}
    cnt += n;
    ${X(r,e=>`m${e} += ${_p(`a`,n.S[e])};`)}
    ${T.map(e=>`w${e} += abs(${_p(`a`,n.S[e])}); `+X(t,t=>`s${e}_${t} += abs(${_p(`a`,n.S[e])}) * ${_p(`a`,n.C[e]+t)};`)).join(` `)}
    ${X(t,e=>`u${e} += f32(n) * ${_p(`a`,n.C[0]+e)};`)}
  }
  let mean = select(0.0, 1.0 / f32(cnt), cnt > 0u);
  ${T.map(e=>`let i${e} = select(0.0, 1.0 / w${e}, w${e} != 0.0);`).join(` `)}
  ${X(t,e=>`let c0_${e} = select(u${e} * mean, s0_${e} * i0, w0 != 0.0);`)}
  ${O(`r`,E(e=>`m${e}`,(e,t)=>e===0?`c0_${t}`:`s${e}_${t} * i${e}`,`cnt`),`cnt`)}`,M=e.blockSteps||0,N=M?`
var<workgroup> wRec: array<vec4f, ${256*n.CS4}>;${n.CNT<0?`
var<workgroup> wCnt: array<u32, 256>;`:``}
fn tree_up(first: u32) -> TreeRec {${j(e=>`let child = first + ${e};
    ${n.CNT<0?`let n = wCnt[child];
    if (n == 0u) { continue; }
    ${vp(`a`,`wRec`,`child * ${n.CS4}u`,n.CS4)}`:`${vp(`a`,`wRec`,`child * ${n.CS4}u`,n.CS4)}
    let n = u32(${_p(`a`,n.CNT)});
    if (n == 0u) { continue; }`}`)}
  return r;
}
// r: this thread's record, in a level of \`count\` cells from cell \`off\`; \`at\`: the workgroup's first
// cell there. Writes the cells of up to \`steps\` levels above, as far as the WG cells reach.
fn tree_block(li: u32, at: u32, r: TreeRec, count: u32, off: u32, steps: u32, metaCount: u32) {
  ${X(n.CS4,e=>`wRec[li * ${n.CS4}u + ${e}u] = r.v[${e}];`)}${n.CNT<0?` wCnt[li] = r.n;`:``}
  var cells = count;
  var base = off;
  for (var j = 1u; j <= steps; j++) {
    workgroupBarrier();
    let parents = base + cells;
    cells = cells >> ${t}u;
    let first = at >> (${t}u * j);
    let live = li < (256u >> (${t}u * j)) && first + li < cells;
    var up: TreeRec;
    if (live) {
      up = tree_up(li * ${A}u);
      ${k(`parents + first + li`,`up`,`metaCount`)}${f?`
      // the top cell: the next step's |charge| total (see BOX)
      if (cells == 1u) { treeBox[${i.TOTAL}] = bitcast<u32>(${X(r,e=>`abs(up.v[${n.S[e]>>2}].${mp[n.S[e]&3]})`,` + `)}); }`:``}
    }
    workgroupBarrier();
    if (live) { ${X(n.CS4,e=>`wRec[li * ${n.CS4}u + ${e}u] = up.v[${e}];`)}${n.CNT<0?` wCnt[li] = up.n;`:``} }
    base = parents;
  }
}`:``,P=jp(e.lawWords)+Tp(t,n.bits)+D+`
${s}
@group(0) @binding(1) var<storage, read> treeSp: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> treeMeta: array<u32>;
@group(0) @binding(3) var<storage, read_write> treeCells: array<vec4f>;
@group(0) @binding(4) var<storage, read_write> treeLists: array<atomic<u32>>;${f?`
@group(0) @binding(5) var<storage, read_write> treeBox: array<u32>;`:``}
${g(e=>`atomicLoad(&treeLists[${e}])`)}${e.heads?`
var<workgroup> wgOccupied: atomic<u32>;
var<workgroup> wgBase: u32;`:``}${N}
@compute @workgroup_size(256)
fn main(${kp}, @builtin(local_invocation_index) li: u32) {
  let c = ${Ap};${e.heads?`
  if (li == 0u) { atomicStore(&wgOccupied, 0u); }
  workgroupBarrier();`:``}
  var r: TreeRec;
  if (c < TP.nCells) { r = tree_aggregate(c); }${e.heads?`
  // the occupied finest cells, listed for LOCAL (a workgroup adds its own at once)
  var slot = 0xffffffffu;
  if (c < TP.nCells && r.n != 0u) { slot = atomicAdd(&wgOccupied, 1u); }
  workgroupBarrier();
  if (li == 0u) { wgBase = atomicAdd(&treeLists[4], atomicLoad(&wgOccupied)); }
  let base = workgroupUniformLoad(&wgBase);
  if (slot != 0xffffffffu) { atomicStore(&treeLists[TP.occList + base + slot], c); }`:``}${M?`
  tree_block(li, c - li, r, TP.nCells, 0u, min(${M}u, TP.levels), TP.metaCount);`:``}
}
fn tree_aggregate(c: u32) -> TreeRec {
  let s = treeMeta[c];
  let e = select(TP.n, treeMeta[c + 1u], c + 1u < TP.nCells);
  // a crowded cell (SCAN_BLOCKS listed it): its near pushes are TREE_LOCAL's crowd workgroups'
  // work, and on a step the cap refuses nothing is computed from its sums
  if (e - s > TP.nearCap && tree_refused()) { var none: TreeRec; ${k(`c`,`none`,`TP.metaCount`)} return none; }
  ${X(r,e=>`var m${e} = 0.0;`)}
  ${T.map(e=>`var w${e} = 0.0; `+X(t,t=>`var s${e}_${t} = 0.0;`)).join(` `)}
  ${X(t,e=>`var u${e} = 0.0;`)}
  // only a border cell can hold clamped bodies
  let border = ${X(t,e=>`tree_compact(c >> ${e}u) == 0u || tree_compact(c >> ${e}u) == TP.G - 1u`,` || `)};${f?`
  let heavyQ = ${gp(8)} * bitcast<f32>(treeBox[${i.TOTAL}]) / f32(TP.n);`:``}
  var cnt = 0u;
  for (var t = s; t < e; t++) {
    if (border && treeMeta[TP.metaTag + 2u * t + 1u] >= 0x80000000u) { continue; }
    cnt++;
    ${vp(`b`,`treeSp`,`t * ${n.SP4}u`,n.SP4)}${f?`
    if (${X(r,e=>`abs(${_p(`b`,t+e)})`,` + `)} > heavyQ) {
      let h = atomicAdd(&treeLists[5], 1u);
      if (h < ${pp}u) { atomicStore(&treeLists[TP.hubList + h], t); }
    }`:``}
    ${X(r,e=>`m${e} += ${_p(`b`,t+e)};`)}
    ${T.map(e=>`w${e} += abs(${_p(`b`,t+e)}); `+X(t,n=>`s${e}_${n} += abs(${_p(`b`,t+e)}) * ${_p(`b`,n)};`)).join(` `)}
    ${X(t,e=>`u${e} += ${_p(`b`,e)};`)}
  }
  let mean = select(0.0, 1.0 / f32(cnt), cnt > 0u);
  ${T.map(e=>`let i${e} = select(0.0, 1.0 / w${e}, w${e} != 0.0);`).join(` `)}
  ${X(t,e=>`let c0_${e} = select(u${e} * mean, s0_${e} * i0, w0 != 0.0);`)}
  ${O(`r`,E(e=>`m${e}`,(e,t)=>e===0?`c0_${t}`:`s${e}_${t} * i${e}`,`cnt`),`cnt`)}
  ${k(`c`,`r`,`TP.metaCount`)}
  return r;
}`,F=D+(M?`
struct Level { count: u32, off: u32, steps: u32, metaCount: u32 };
@group(0) @binding(0) var<uniform> lv: Level;
@group(0) @binding(1) var<storage, read_write> treeCells: array<vec4f>;${n.CNT<0?`
@group(0) @binding(2) var<storage, read_write> treeMeta: array<u32>;`:``}${f?`
@group(0) @binding(${n.CNT<0?3:2}) var<storage, read_write> treeBox: array<u32>;`:``}${N}
@compute @workgroup_size(256)
fn main(${kp}, @builtin(local_invocation_index) li: u32) {
  let q = ${Ap};
  var r: TreeRec;
  if (q < lv.count) {
    ${X(n.CS4,e=>`r.v[${e}] = treeCells[${n.TAB4}u + (lv.off + q) * ${n.CS4}u + ${e}u];`)}
    r.n = ${n.CNT<0?`treeMeta[lv.metaCount + lv.off + q]`:`u32(r.v[${n.CNT>>2}].${mp[n.CNT&3]})`};
  }
  tree_block(li, q - li, r, lv.count, lv.off, lv.steps, lv.metaCount);
}`:`
struct Level { count: u32, childOff: u32, parentOff: u32, metaCount: u32 };
@group(0) @binding(0) var<uniform> lv: Level;
@group(0) @binding(1) var<storage, read_write> treeCells: array<vec4f>;${n.CNT<0?`
@group(0) @binding(2) var<storage, read_write> treeMeta: array<u32>;`:``}${f?`
@group(0) @binding(${n.CNT<0?3:2}) var<storage, read_write> treeBox: array<u32>;`:``}
@compute @workgroup_size(256)
fn main(${kp}) {
  let q = ${Ap};
  if (q >= lv.count) { return; }${j(e=>`let child = lv.childOff + ${A}u * q + ${e};
    ${n.CNT<0?`let n = treeMeta[lv.metaCount + child];
    if (n == 0u) { continue; }
    ${vp(`a`,`treeCells`,`${n.TAB4}u + child * ${n.CS4}u`,n.CS4)}`:`${vp(`a`,`treeCells`,`${n.TAB4}u + child * ${n.CS4}u`,n.CS4)}
    let n = u32(${_p(`a`,n.CNT)});
    if (n == 0u) { continue; }`}`)}
  ${k(`lv.parentOff + q`,`r`,`lv.metaCount`)}${f?`
  if (lv.count == 1u) { treeBox[${i.TOTAL}] = bitcast<u32>(${X(r,e=>`abs(r.v[${n.S[e]>>2}].${mp[n.S[e]&3]})`,` + `)}); }`:``}
}`),I=Mp(e)+Fp(n),L=e.groups,R=[{word:n.C[0],channels:[]}];e.channels.forEach((e,t)=>{t===0||!e.own?R[0].channels.push(t):R.push({word:n.C[t],channels:[t]})});let z=(e,r)=>{let i=[`let g${e} = ${r} * k.x; let h${e} = ${r} * k.y;`];return i.push(X(t,t=>`F${e}_${t} += g${e} * d${t};`)),i.push(n.pairs.map(([t,n],r)=>`J${e}_${r} += h${e} * d${t} * d${n}${t===n?` - g${e}`:``};`).join(` `)),n.T[e]>=0&&(i.push(`let u${e} = ${r} * k.z;`),i.push(n.triples.map(([t,n,r],i)=>{let a=[];return t===n&&a.push(`d${r}`),t===r&&a.push(`d${n}`),n===r&&a.push(`d${t}`),`T${e}_${i} += u${e} * d${t} * d${n} * d${r}${a.length?` - h${e} * (${a.join(` + `)})`:``};`}).join(` `))),i.join(`
`)},ee=(r,i)=>R.map(a=>{let o=[];o.push(`{`),o.push(X(t,e=>`let d${e} = ${_p(`a`,a.word+e)} - ${r(e)};`)),o.push(`let r2 = ${X(t,e=>`d${e} * d${e}`,` + `)};`);let s=[];return a.channels.forEach(t=>{let n=e.channels[t].group,r=s.find(e=>e.g===n);r||s.push(r={g:n,channels:[]}),r.channels.push(t)}),o.push(`if (r2 > 0.0) {`),o.push(`let r = sqrt(r2);`),s.forEach(({g:e,channels:r})=>{let a=[];a.push(`(${Ip(r,e=>_p(`a`,n.S[e]))})`),L[e].law&&L[e].law.hasRange&&a.push(`tree_in_${e}(r2)`);let s=a.length?`if (${a.join(` && `)}) {`:`{`;o.push(s),i?(o.push(L[e].second?`let k = tree_k123_${e}(r, r2);`:`let k = tree_k12_${e}(r, r2);`),r.forEach(e=>o.push(z(e,_p(`a`,n.S[e]))))):(o.push(`let k1 = tree_k1_${e}(r, r2);`),r.forEach(e=>{o.push(X(t,t=>`acc${e}_${t} += (${_p(`a`,n.S[e])} * k1) * d${t};`))})),o.push(`}`)}),o.push(`}`),o.push(`}`),o.join(`
`)}).join(`
`),B=e=>n.CNT<0?`treeMeta[TP.metaCount + ${e}]`:`u32(treeCells[${n.TAB4}u + (${e}) * ${n.CS4}u + ${n.CNT>>2}u].${mp[n.CNT&3]})`,te=(e,r)=>`
${r}let poff = off + ${X(t,()=>`Gl`,` * `)};
${r}let Gp = Gi / 2;
${r}${X(t,e=>`let lo${e} = max((xl${e} >> 1u) - ${p}, 0); let hi${e} = min((xl${e} >> 1u) + ${p}, Gp - 1);`)}
${Dp(t,`
if (${B(`poff + mm0`)} == 0u) { continue; }
for (var ch = 0u; ch < ${1<<t}u; ch++) {
  ${X(t,e=>`let y${e} = 2 * x${e} + i32((ch >> ${e}u) & 1u);`)}
  if (${X(t,e=>`abs(y${e} - xl${e}) <= ${p}`,` && `)}) { continue; }
  let src = off + ((mm0 << ${t}u) | ch);
  ${vp(`a`,`treeCells`,`${n.TAB4}u + src * ${n.CS4}u`,n.CS4)}
  ${e}
}`,r)}`,ne=e.heads,re=c?`
`+c(5):``,ie=Math.ceil(t*r/4),ae=(e,n)=>e*t+n,V=(()=>{let e=[];return e.push(vp(`b`,`treeSp`,`j * ${n.SP4}u`,n.SP4)),e.push(X(t,e=>`var d${e} = ${_p(`b`,e)} - p${e};`)),e.push(`var r2 = ${X(t,e=>`d${e} * d${e}`,` + `)};`),e.push(`if (r2 == 0.0) { let jt = tree_jitter(i, treeMeta[TP.metaTag + 2u * j]); ${X(t,e=>`d${e} = jt.${mp[e]};`)} r2 = ${X(t,e=>`d${e} * d${e}`,` + `)}; }`),e.push(`let r = sqrt(r2);`),L.forEach((n,i)=>{let a=[];r>1&&a.push(`(${Ip(n.channels,e=>_p(`b`,t+e))})`),n.law&&n.law.hasRange&&a.push(`tree_in_${i}(r2)`);let o=[`let k1 = tree_k1_${i}(r, r2);`].concat(n.channels.map(e=>X(t,n=>`cr${e}_${n} += (${_p(`b`,t+e)} * k1) * d${n};`))).join(` `);e.push(a.length?`if (${a.join(` && `)}) { ${o} }`:`{ ${o} }`)}),e.join(`
`)})(),oe=`
var<workgroup> crowdPart: array<f32, ${256*t}>;
var<workgroup> crowdHead: vec4u;
var<workgroup> crowdRange: vec4u;
${g(e=>`atomicLoad(&treeLists[${e}])`)}
fn tree_count(b: u32) -> u32 { return select(TP.n, treeMeta[b + 1u], b + 1u < TP.nCells) - treeMeta[b]; }
// cell b's near cell number nu (base SIDE digits, minus SEP per axis), or nCells off the grid
fn tree_near(b: u32, nu: u32) -> u32 {
  let Gi = i32(TP.G);
  ${X(t,e=>`let x${e} = i32(tree_compact(b >> ${e}u)) + i32((nu / ${m**e}u) % ${m}u) - ${p};`)}
  if (${X(t,e=>`x${e} < 0 || x${e} >= Gi`,` || `)}) { return TP.nCells; }
  return ${X(t,e=>`(tree_spread(u32(x${e})) << ${e}u)`,` | `)};
}
fn tree_crowd(w: u32, li: u32) {
  // (a 2D grid of workgroups may pad past CROWD_GROUPS)
  if (w >= 128u) { return; }
  if (li == 0u) {
    let crowded = atomicLoad(&treeLists[1]);
    var biggest = 0u;
    for (var l = 0u; l < crowded; l++) { biggest = max(biggest, tree_count(atomicLoad(&treeLists[TP.crowdList + l]))); }
    // the work ORDER and AGG0 refused by (tree_crowd_work)
    let work = f32(tree_crowd_work()) * 1e6;
    // in evaluations of one charge (chargeWeight)
    let weighted = work * ${gp(hp(r))};
    let over = weighted > TP.workCap;
    crowdHead = vec4u(crowded, select(0u, 1u, over), 0u, 0u);
    if (w == 0u) {
      atomicStore(&treeLists[7], u32(min(weighted * 1e-6, 4e9)));
      if (over && atomicLoad(&treeLists[2]) == 0u) {
        atomicStore(&treeLists[3], u32(min(work * 1e-6, 4e9)));
        atomicStore(&treeLists[2], biggest);
      }
    }
  }
  let head = workgroupUniformLoad(&crowdHead);
  if (head.y != 0u) { return; }
  // A target cell is visited from each crowded cell near it, and done from the first of them in
  // neighbour order: its bodies then take every crowded neighbour's push in that order, so the
  // sums do not depend on the order AGG0 listed the cells in.
  for (var l = 0u; l < head.x; l++) {
    for (var nu = 0u; nu < ${h}u; nu++) {
      workgroupBarrier();
      if (li == 0u) {
        let b = atomicLoad(&treeLists[TP.crowdList + l]);
        let a = tree_near(b, nu);
        crowdRange = vec4u(0u);
        if (a < TP.nCells) {
          var first = TP.nCells;
          for (var m = 0u; m < ${h}u; m++) {
            let x = tree_near(a, m);
            if (x < TP.nCells && tree_count(x) > TP.nearCap) { first = x; break; }
          }
          if (first == b) { crowdRange = vec4u(a, treeMeta[a], treeMeta[a] + tree_count(a), 0u); }
        }
      }
      let tr = workgroupUniformLoad(&crowdRange);
      var t = tr.y + (w + 128u - tr.y % 128u) % 128u;
      loop {
        if (t >= tr.z) { break; }
        let i = treeMeta[TP.metaTag + 2u * t];
        ${vp(`me`,`treeSp`,`t * ${n.SP4}u`,n.SP4)}
        ${X(t,e=>`let p${e} = ${_p(`me`,e)};`)}
        ${X(r,e=>X(t,t=>`var cr${e}_${t} = 0.0;`))}
        for (var m = 0u; m < ${h}u; m++) {
          let x = tree_near(tr.x, m);
          if (x >= TP.nCells) { continue; }
          let xs = treeMeta[x];
          let xe = xs + tree_count(x);
          if (xe - xs <= TP.nearCap) { continue; }
          for (var j = xs + li; j < xe; j += 256u) {
            if (j == t) { continue; }
            ${V}
          }
        }${X(r,e=>`
        ${X(t,n=>`crowdPart[li * ${t}u + ${n}u] = cr${e}_${n};`)}
        workgroupBarrier();
        for (var h = 128u; h > 0u; h >>= 1u) {
          if (li < h) { ${X(t,e=>`crowdPart[li * ${t}u + ${e}u] += crowdPart[(li + h) * ${t}u + ${e}u];`)} }
          workgroupBarrier();
        }
        if (li == 0u) { ${X(t,t=>`treeCells[TP.crowdOff + t * ${ie}u + ${ae(e,t)>>2}u].${mp[ae(e,t)&3]} = crowdPart[${t}u];`)} }
        workgroupBarrier();`,``)}
        t += 128u;
      }
    }
  }
}`,se=p+1,ce=2*se+1,H=ce**t<<t,U=(()=>{let e=[vp(`b`,`treeSp`,`t * ${n.SP4}u`,n.SP4),X(t,e=>`let d${e} = ${_p(`b`,e)} - p${e};`),`let r2 = ${X(t,e=>`d${e} * d${e}`,` + `)};`,`if (r2 > 0.0) {`,`let r = sqrt(r2);`];return L.forEach((n,r)=>{let i=[`(${Ip(n.channels,e=>_p(`b`,t+e))})`];n.law&&n.law.hasRange&&i.push(`tree_in_${r}(r2)`),e.push(`if (${i.join(` && `)}) { let k1 = tree_k1_${r}(r, r2); ${n.channels.map(e=>X(t,n=>`acc${e}_${n} += (${_p(`b`,t+e)} * k1) * d${n};`)).join(` `)} }`)}),e.push(`}`),e.join(` `)})(),le=f?`
var<workgroup> hubHead: u32;
fn tree_hub(w: u32, li: u32) {
  if (w >= 32u) { return; }
  if (li == 0u) { hubHead = min(atomicLoad(&treeLists[5]), ${pp}u); }
  let count = workgroupUniformLoad(&hubHead);
  for (var hb = w; hb < count; hb += 32u) {
    let k = atomicLoad(&treeLists[TP.hubList + hb]);
    let raw = treeMeta[TP.metaTag + 2u * k + 1u];
    let c = raw & 0x7fffffffu;
    ${vp(`me`,`treeSp`,`k * ${n.SP4}u`,n.SP4)}
    ${X(t,e=>`let p${e} = ${_p(`me`,e)};`)}
    ${X(t,e=>`let cx${e} = i32(tree_compact(c >> ${e}u));`)}
    ${X(r,e=>X(t,t=>`var acc${e}_${t} = 0.0;`))}
    var off = 0u; var Gl = TP.G;
    for (var l = 0u; l < TP.levels; l++) {
      let Gi = i32(Gl);
      let Gp = Gi / 2;
      let poff = off + ${X(t,()=>`Gl`,` * `)};
      // the finest level skips my near cells only; the levels above the cells a list has had
      let skip = select(${se}, ${p}, l == 0u);
      // (3D: 1,000 candidates, a few a thread)
      for (var cand = li; cand < ${H}u; cand += 256u) {
        let pi = cand >> ${t}u;
        let ch = cand & ${(1<<t)-1}u;
        ${X(t,e=>`let xl${e} = cx${e} >> l; let x${e} = (xl${e} >> 1u) + i32((pi / ${ce**e}u) % ${ce}u) - ${se};`)}
        if (${X(t,e=>`x${e} >= 0 && x${e} < Gp`,` && `)}) {
          let mm0 = ${X(t,e=>`(tree_spread(u32(x${e})) << ${e}u)`,` | `)};
          ${X(t,e=>`let y${e} = 2 * x${e} + i32((ch >> ${e}u) & 1u);`)}
          if (${B(`poff + mm0`)} != 0u && !(${X(t,e=>`abs(y${e} - xl${e}) <= skip`,` && `)})) {
            let src = off + ((mm0 << ${t}u) | ch);${t===3?`
            // 3D: the ring just past the near cells body by body, as TREE_HEAVY takes it (a hub's
            // leaves sit there; as monopoles, relaxed megaStars in 3D was 2.6 times the CPU tree's error)
            if (l == 0u && ${Op(Array.from({length:t},(e,t)=>`abs(y${t} - xl${t})`))} == ${p+1}) {
              let s0 = treeMeta[src];
              let e0 = select(TP.n, treeMeta[src + 1u], src + 1u < TP.nCells);
              for (var t = s0; t < e0; t++) {
${U}
              }
              continue;
            }`:``}
            ${vp(`a`,`treeCells`,`${n.TAB4}u + src * ${n.CS4}u`,n.CS4)}
${ee(e=>`p${e}`,!1)}
          }
        }
      }
      off += ${X(t,()=>`Gl`,` * `)}; Gl >>= 1u;
    }${X(r,e=>`
    ${X(t,n=>`crowdPart[li * ${t}u + ${n}u] = acc${e}_${n};`)}
    workgroupBarrier();
    for (var h = 128u; h > 0u; h >>= 1u) {
      if (li < h) { ${X(t,e=>`crowdPart[li * ${t}u + ${e}u] += crowdPart[(li + h) * ${t}u + ${e}u];`)} }
      workgroupBarrier();
    }
    if (li == 0u) { ${X(t,t=>`treeCells[TP.hubOff + hb * ${ie}u + ${ae(e,t)>>2}u].${mp[ae(e,t)&3]} = crowdPart[${t}u];`)} }
    workgroupBarrier();`,``)}
    if (li == 0u) { treeMeta[TP.metaTag + 2u * k + 1u] = raw | ((hb + 1u) << 20u); }
  }
}`:``,ue=o+I+`
${s}
@group(0) @binding(1) var<storage, read_write> treeCells: array<vec4f>;
@group(0) @binding(2) var<storage, ${f?`read_write`:`read`}> treeMeta: array<u32>;
@group(0) @binding(3) var<storage, read_write> treeLists: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> treeSp: array<vec4f>;${re}
${oe}${le}
@compute @workgroup_size(256)
fn main(${kp}, @builtin(workgroup_id) wid: vec3u, @builtin(local_invocation_index) li: u32) {
  let wl = wid.x + wid.y * nwg.x;${f?`
  if (wl >= TP.localGroups + 128u) {
    tree_hub(wl - TP.localGroups - 128u, li);
    return;
  }`:``}
  if (wl >= TP.localGroups) {
    tree_crowd(wl - TP.localGroups, li);
    return;
  }
  let t = ${Ap};
  var off = 0u; var Gl = TP.G; var l = 0u; var c = 0u;${ne?`
  if (t < TP.n) {
    if (t >= atomicLoad(&treeLists[4])) { return; }
    c = atomicLoad(&treeLists[TP.occList + t]);
  } else {
    var u = t - TP.n + TP.nCells;`:`
  {
    var u = t;`}
    loop {
      if (l >= TP.levels) { return; }
      let count = ${X(t,()=>`Gl`,` * `)};
      if (u < off + count) { break; }
      off += count; Gl >>= 1u; l++;
    }
    c = u - off;
  }
  ${vp(`m`,`treeCells`,`${n.TAB4}u + (off + c) * ${n.CS4}u`,n.CS4)}
  let cnt = ${n.CNT<0?`treeMeta[TP.metaCount + off + c]`:`u32(${_p(`m`,n.CNT)})`};
  if (cnt == 0u) { return; }${v?`
  // a heavy finest cell (a hub amid its leaves) is done by TREE_HEAVY
  if (off == 0u) {
    ${vp(`top`,`treeCells`,`${n.TAB4}u + TP.top * ${n.CS4}u`,n.CS4)}
    if ((${X(r,e=>`abs(${_p(`m`,n.S[e])})`,` + `)}) * f32(TP.n) > ${gp(8)} * f32(cnt) * (${X(r,e=>`abs(${_p(`top`,n.S[e])})`,` + `)})) {
      atomicStore(&treeLists[8u + atomicAdd(&treeLists[0], 1u)], c);
      return;
    }
  }`:``}
  let Gi = i32(Gl);
  ${X(t,e=>`let xl${e} = i32(tree_compact(c >> ${e}u));`,` `)}
  // the expansion centre: the cell's centre of channel 0's charge (of its bodies when that is
  // 0), where its bodies are, rather than its middle: half the error or less on hub graphs
  ${X(t,e=>`let ce${e} = ${_p(`m`,n.C[0]+e)};`)}
  ${X(r,e=>X(t,t=>`var F${e}_${t} = 0.0;`)+` `+n.pairs.map((t,n)=>`var J${e}_${n} = 0.0;`).join(` `)+` `+(n.T[e]>=0?n.triples.map((t,n)=>`var T${e}_${n} = 0.0;`).join(` `):``),`
  `)}
${te(ee(e=>`ce${e}`,!0),`  `)}
  let o = TP.locOff + (off + c) * ${n.LS4}u;
  ${bp(`treeCells`,`o`,(()=>{let e=[];for(let n=0;n<t;n++)e[n]=`ce${n}`;for(let i=0;i<r;i++){for(let r=0;r<t;r++)e[n.F[i]+r]=`F${i}_${r}`;n.pairs.forEach((t,r)=>{e[n.J[i]+r]=`J${i}_${r}`}),n.T[i]>=0&&n.triples.forEach((t,r)=>{e[n.T[i]+r]=`T${i}_${r}`})}return e})())}
}`,W=r*(t+n.JN)+n.T.filter(e=>e>=0).length*n.TN,de=fp;for(;de>8&&de*W*4>16384;)de>>=1;let fe=3**t<<t,pe=(()=>{let e=[];return e.push(X(t,e=>`let d${e} = ${_p(`b`,e)} - ce${e};`)),e.push(`let r2 = ${X(t,e=>`d${e} * d${e}`,` + `)};`),e.push(`if (r2 > 0.0) {`),e.push(`let r = sqrt(r2);`),L.forEach((n,r)=>{let i=[`(${Ip(n.channels,e=>_p(`b`,t+e))})`];n.law&&n.law.hasRange&&i.push(`tree_in_${r}(r2)`),e.push(`if (${i.join(` && `)}) {`),e.push(n.second?`let k = tree_k123_${r}(r, r2);`:`let k = tree_k12_${r}(r, r2);`),n.channels.forEach(n=>e.push(z(n,_p(`b`,t+n)))),e.push(`}`)}),e.push(`}`),e.join(`
`)})(),me=[];for(let e=0;e<r;e++){for(let n=0;n<t;n++)me.push(`F${e}_${n}`);n.pairs.forEach((t,n)=>me.push(`J${e}_${n}`)),n.T[e]>=0&&n.triples.forEach((t,n)=>me.push(`T${e}_${n}`))}let he=o+I+`
${s}
@group(0) @binding(1) var<storage, read> treeSp: array<vec4f>;
@group(0) @binding(2) var<storage, read> treeMeta: array<u32>;
@group(0) @binding(3) var<storage, read_write> treeCells: array<vec4f>;
@group(0) @binding(4) var<storage, read> treeLists: array<u32>;${c?`
`+c(5):``}
var<workgroup> parts: array<f32, ${de*W}>;
var<workgroup> todo: u32;
@compute @workgroup_size(${de})
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  if (li == 0u) { todo = treeLists[0]; }
  let count = workgroupUniformLoad(&todo);
  let Gi = i32(TP.G);
  let Gp = Gi / 2;
  let poff = ${X(t,()=>`TP.G`,` * `)};
  for (var h = wid.x; h < count; h += nwg.x) {
    let c = treeLists[8u + h];
    ${vp(`m`,`treeCells`,`${n.TAB4}u + c * ${n.CS4}u`,n.CS4)}
    ${X(t,e=>`let ce${e} = ${_p(`m`,n.C[0]+e)};`)}
    ${X(t,e=>`let xl${e} = i32(tree_compact(c >> ${e}u));`)}
    ${me.map(e=>`var ${e} = 0.0;`).join(` `)}
    for (var q = li; q < ${fe}u; q += ${de}u) {
      let pi = q >> ${t}u;
      let ch = q & ${(1<<t)-1}u;
      ${X(t,e=>`let x${e} = (xl${e} >> 1u) + i32((pi / ${3**e}u) % 3u) - 1;`)}
      if (${X(t,e=>`x${e} < 0 || x${e} >= Gp`,` || `)}) { continue; }
      let mm0 = ${X(t,e=>`(tree_spread(u32(x${e})) << ${e}u)`,` | `)};
      if (${B(`poff + mm0`)} == 0u) { continue; }
      ${X(t,e=>`let y${e} = 2 * x${e} + i32((ch >> ${e}u) & 1u);`)}
      let dist = ${Op(Array.from({length:t},(e,t)=>`abs(y${t} - xl${t})`))};
      if (dist <= 1) { continue; }
      let src = (mm0 << ${t}u) | ch;
      ${vp(`a`,`treeCells`,`${n.TAB4}u + src * ${n.CS4}u`,n.CS4)}
      if (!(${Ip(e.channels.map((e,t)=>t),e=>_p(`a`,n.S[e]))})) { continue; }
      if (dist == 2 && ${n.CNT<0?`treeMeta[TP.metaCount + src]`:`u32(${_p(`a`,n.CNT)})`} >= 2u) {
        let s0 = treeMeta[src];
        let e0 = select(TP.n, treeMeta[src + 1u], src + 1u < TP.nCells);
        for (var t = s0; t < e0; t++) {
          ${vp(`b`,`treeSp`,`t * ${n.SP4}u`,n.SP4)}
          ${pe}
        }
      } else {
${ee(e=>`ce${e}`,!0)}
      }
    }
    ${me.map((e,t)=>`parts[li * ${W}u + ${t}u] = ${e};`).join(` `)}
    workgroupBarrier();
    for (var w = ${de/2}u; w > 0u; w >>= 1u) {
      if (li < w) { for (var j = 0u; j < ${W}u; j++) { parts[li * ${W}u + j] += parts[(li + w) * ${W}u + j]; } }
      workgroupBarrier();
    }
    if (li == 0u) {
      ${bp(`treeCells`,`TP.locOff + c * ${n.LS4}u`,(()=>{let e=[];for(let n=0;n<t;n++)e[n]=`ce${n}`;let i=0;for(let a=0;a<r;a++){for(let r=0;r<t;r++)e[n.F[a]+r]=`parts[${i++}]`;n.pairs.forEach((t,r)=>{e[n.J[a]+r]=`parts[${i++}]`}),n.T[a]>=0&&n.triples.forEach((t,r)=>{e[n.T[a]+r]=`parts[${i++}]`})}return e})())}
    }
    workgroupBarrier();
  }
}`,ge=`vec${t}f`,_e=(()=>{let e=[];return e.push(vp(`q`,`treeSp`,`t * ${n.SP4}u`,n.SP4)),e.push(X(t,e=>`var d${e} = ${_p(`q`,e)} - p${e};`)),e.push(`var r2 = ${X(t,e=>`d${e} * d${e}`,` + `)};`),e.push(`if (r2 == 0.0) { let jt = tree_jitter(i, treeMeta[TP.metaTag + 2u * t]); ${X(t,e=>`d${e} = jt.${mp[e]};`)} r2 = ${X(t,e=>`d${e} * d${e}`,` + `)}; }`),e.push(`let r = sqrt(r2);`),e.push(`var g = 0.0;`),L.forEach((n,i)=>{let a=n.channels.map(e=>`s[${e}] * ${_p(`q`,t+e)}`).join(` + `),o=[];r>1&&!n.isDefault&&o.push(`wt${i} != 0.0`),n.law&&n.law.hasRange&&o.push(`tree_in_${i}(r2)`),e.push(`let wt${i} = ${a};`);let s=`g += wt${i} * tree_k1_${i}(r, r2);`;e.push(o.length?`if (${o.join(` && `)}) { ${s} }`:s)}),e.push(X(t,e=>`na${e} += g * d${e};`)),e.join(`
`)})(),ve=`
  // near field: exact pairs in my 3^D cells; a crowded cell's pushes come summed by TREE_LOCAL
  var crowded = false;
  {
    ${X(t,e=>`let lo${e} = max(cx${e} - ${p}, 0); let hi${e} = min(cx${e} + ${p}, Gi - 1);`,` `)}
${Dp(t,`
let s0 = treeMeta[mm0];
let e0 = select(TP.n, treeMeta[mm0 + 1u], mm0 + 1u < TP.nCells);
if (e0 - s0 > TP.nearCap) { crowded = true; continue; }
for (var t = s0; t < e0; t++) {
  if (t == k) { continue; }
  ${_e}
}`,`    `)}
  }
  if (crowded) {
    ${vp(`cw`,`treeCells`,`TP.crowdOff + k * ${ie}u`,ie)}
    ${X(t,e=>`na${e} += ${X(r,n=>`s[${n}] * ${_p(`cw`,n*t+e)}`,` + `)};`)}
  }`,ye=`
    var off = 0u; var Gl = TP.G; var cc = c;
    for (var l = 0u; l < TP.levels; l++) {
      ${vp(`e`,`treeCells`,`TP.locOff + (off + cc) * ${n.LS4}u`,n.LS4)}
      ${X(t,e=>`let h${e} = p${e} - ${_p(`e`,e)};`)}
      ${X(r,e=>X(t,r=>`b${r} += s[${e}] * (${_p(`e`,n.F[e]+r)} + ${X(t,t=>{let i=n.pairs.findIndex(([e,n])=>e===r&&n===t||e===t&&n===r);return`${_p(`e`,n.J[e]+i)} * h${t}`},` + `)}${n.T[e]>=0?` + 0.5 * (`+X(t,i=>X(t,t=>{let a=[r,i,t].sort().join(),o=n.triples.findIndex(e=>e.join()===a);return`${_p(`e`,n.T[e]+o)} * h${i} * h${t}`},` + `),` + `)+`)`:``});`),`
      `)}
      off += ${X(t,()=>`Gl`,` * `)}; Gl >>= 1u; cc >>= ${t}u;
    }`,be=`
    var off = 0u; var Gl = TP.G;
    ${X(r,e=>X(t,t=>`var acc${e}_${t} = 0.0;`))}
    for (var l = 0u; l < TP.levels; l++) {
      let Gi = i32(Gl);
      ${X(t,e=>`let xl${e} = cx${e} >> l;`)}
${te(ee(e=>`p${e}`,!1),`      `)}
      off += ${X(t,()=>`Gl`,` * `)}; Gl >>= 1u;
    }
    ${X(r,e=>X(t,t=>`b${t} += s[${e}] * acc${e}_${t};`),`
    `)}`,xe=`
fn tree_force(k: u32, s: array<f32, ${r}>) -> ${ge} {
  if (${X(r,e=>`s[${e}] == 0.0`,` && `)}) { return ${ge}(0.0); }
  let i = treeMeta[TP.metaTag + 2u * k];
  let raw = treeMeta[TP.metaTag + 2u * k + 1u];
  let c = raw & ${f?`0xfffffu`:`0x7fffffffu`};
  ${vp(`me`,`treeSp`,`k * ${n.SP4}u`,n.SP4)}
  ${X(t,e=>`let p${e} = ${_p(`me`,e)};`)}
  let Gi = i32(TP.G);
  ${X(t,e=>`let cx${e} = i32(tree_compact(c >> ${e}u));`,` `)}
  ${X(t,e=>`var na${e} = 0.0;`)}
  ${X(t,e=>`var b${e} = 0.0;`)}
${ve}
  ${f?`let hub = (raw >> 20u) & 0x7ffu;
  if (hub != 0u) {
    // a hub: its far field from tree_hub
    ${vp(`hw`,`treeCells`,`TP.hubOff + (hub - 1u) * ${ie}u`,ie)}
    ${X(t,e=>`b${e} += ${X(r,t=>`s[${t}] * ${_p(`hw`,ae(t,e))}`,` + `)};`)}
  } else `:``}if (raw == c) {
    // far field: local expansions down my chain of parent cells${ye}
  } else {
    // clamped into a border cell: monopoles of the interaction lists at my real position${be}
  }
  return ${l} * ${ge}(${X(t,e=>`na${e} + b${e}`,`, `)});
}
// The charge of channel c of the body in sorted slot k (its sensitivity when the two are one column)
fn tree_charge(k: u32, c: u32) -> f32 {
  let w = ${t}u + c;
  return treeSp[k * ${n.SP4}u + (w >> 2u)][w & 3u];
}
fn tree_slot(i: u32) -> u32 { return treeMeta[TP.metaRow + i]; }
fn tree_row(k: u32) -> u32 { return treeMeta[TP.metaTag + 2u * k]; }`,Se={bindings:[{name:`treeSp`,access:`read`,type:`array<vec4f>`},{name:`treeMeta`,access:`read`,type:`array<u32>`},{name:`treeCells`,access:`read`,type:`array<vec4f>`}],uniform:{name:`TP`,struct:jp(e.lawWords),decl:e=>`@group(0) @binding(${e}) var<uniform> TP: TreeParams;`},declarations:Tp(t,n.bits)+Ep(t)+I+xe,row:e=>`tree_row(${e})`,code({t:e,i:n,force:i,sensitivity:a}){let o=e??`tree_slot(${n})`,s=[];for(let e=0;e<r;e++){let t=a?a(e):null;s.push(t??`tree_charge(tk, ${e}u)`)}return`{ let tk = ${o}; let tf = tree_force(tk, array<f32, ${r}>(${s.join(`, `)})); ${X(t,e=>`${i[e]} += tf.${mp[e]};`)} }`}};return{kernels:{TREE_HIST:_,TREE_BOX:y,TREE_BIN:b,TREE_SCAN_BLOCKS:x,TREE_SCAN_TOP:`
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
}`,TREE_SCAN_ADD:S,TREE_PLACE:C,TREE_ORDER:w,TREE_AGG0:P,TREE_PYR:F,TREE_LOCAL:ue,...v?{TREE_HEAVY:he}:{}},columns:{TREE_HIST:u(f?[e.pos].concat(e.charges):[e.pos],1).names,TREE_BIN:u([e.pos],1).names,TREE_ORDER:u([e.pos].concat(e.charges),1).names},section:Se,heavyGroups:dp}}var Rp=1024,zp=`xyzw`;function Bp(e,t){if(t===2){let t=32;for(;t*t*2<e&&t<1024;)t*=2;return t<=64?2*t:t}let n=2;for(;(n**t<1024||n**t<2*e)&&(2*n)**t<=1<<20;)n*=2;return n}function Vp({D:e,n:t,limits:n,channels:r,pos:i,values:a=null,grid:o=0,peak:s,heads:c,heavyCells:l,hubs:u,secondOrder:d,separation:f,blocks:p=!0,warn:m}){let h=(e,t={})=>({refusal:e,buffers:t,kernels:{},section:null,dispatches:0});if(e!==2&&e!==3)return h(`the grid pyramid is 2D and 3D; this layout is ${e}D`);if(!r.length)return h(`a tree pass needs at least one charge`);let g=[],_=Gu(m);for(let t=0;t<r.length;t++){let n=r[t].law&&!r[t].law.isDefault?r[t].law:null,i=g.find(e=>n?e.law===n||e.law&&e.law.spec===n.spec:e.isDefault);if(!i){if(n){let i=Gp(n,e,_);if(i)return h(`${r[t].stage||`channel `+t}: ${i}`)}i={law:n,isDefault:!n,channels:[],first:t},g.push(i)}i.channels.push(t)}let v=0,y=0;g.forEach(e=>{e.law&&(e.tables=e.law.describe().tables.map(e=>{let t={name:e.name,from:e.from,to:e.to,length:e.values.length,values:e.values,base:v};return v+=e.values.length,t}),e.base=y,y+=Math.ceil($u(e.law)/4)*4,e.value=a?t=>a.law(e.first,t):t=>`TP.law[${e.base+t>>2}].${zp[e.base+t&3]}`)}),g.forEach(t=>{t.second=d===void 0?!!t.law&&!(t.tables||[]).length&&Wp(t.law,e):!!d&&!(t.tables||[]).length});let b=r.map((e,t)=>{let n=g.findIndex(e=>e.channels.indexOf(t)>=0);return{own:t===0||e.centroid!==`shared`,group:n,second:g[n].second}}),x=xp(e,b,v),S=o||Bp(t,e);if(S**e>1<<20)return h(`the grid pyramid takes up to 2^20 cells; ${S}^${e} is more`);let C=f===void 0?e===2&&g.some(e=>e.second)?2:1:f,w=(l===void 0?e===3:l)&&C===1,T=u===void 0?e===2||!(s<=8):!!u,{sizes:E,buffers:D}=Up(e,t,S,x,r.length,w,T),O=E.nCells,k=E.levels,A=Math.min(n.maxStorageBufferBindingSize,n.maxBufferSize),j=Object.keys(D).filter(e=>D[e]>A);if(j.length){let n=j.sort((e,t)=>D[t]-D[e])[0];return h(`the tree pass with ${r.length} charge${r.length>1?`s`:``} in ${e}D at ${t.toLocaleString(`en-US`)} bodies needs ${Kp(D[n])} for ${n===`treeCells`?`its cells`:n}; this device allows ${Kp(A)} per buffer`,D)}if(Math.ceil(t/256)>n.maxComputeWorkgroupsPerDimension**2)return h(`the grid pyramid runs up to ${(n.maxComputeWorkgroupsPerDimension**2*256).toLocaleString(`en-US`)} bodies`);let M=256*x.CS4*16+(x.CNT<0?1024:0)+16,N=p&&M<=(n.maxComputeWorkgroupStorageSize||16384)?Math.floor(Math.log2(256)/e):0,P={D:e,L:x,groups:g,lawWords:a?0:y,values:a,warn:m,heads:c===void 0?O>t:c,heavyCells:w,hubs:T,sep:C,blockSteps:N,channels:b,pos:i,charges:r.map(e=>e.charge)},F=Lp(P);return{refusal:null,D:e,n:t,K:r.length,layout:x,groups:g,sizes:E,buffers:D,heads:P.heads,heavyCells:P.heavyCells,hubs:T,lawWords:P.lawWords,values:a,channels:r,kernels:F.kernels,columns:F.columns,section:F.section,dispatches:10+Hp(k,N).length+ +!!P.heavyCells,blockSteps:N,heavyGroups:F.heavyGroups}}function Hp(e,t){let n=[];if(!t){for(let t=0;t<e;t++)n.push({from:t,steps:1});return n}for(let r=Math.min(t,e);r<e;r+=t)n.push({from:r,steps:Math.min(t,e-r)});return n}function Up(e,t,n,r,i,a,o=!1){let s=Math.log2(n),c=n**e,l=[],u=0;for(let t=0,r=n;t<=s;t++,r>>=1)l.push(u),u+=r**e;let d=l[s],f=r.TAB4+u*r.CS4,p=f+d*r.LS4,m=Math.floor(t/1025)+1,h=Math.ceil(e*i/4),g=p+t*h,_=8+(a?c:0)+m,v=_+(c>t?Math.min(t,c):0),y=e=>Math.max(16,Math.ceil(e/16)*16);return{sizes:{n:t,G:n,levels:s,nCells:c,levelOff:l,pyrSize:u,localCells:d,locOff:f,crowdOff:p,crowdList:8+(a?c:0),occList:_,hubOff:g,hubList:v,metaTag:c,metaRow:c+2*t,metaCount:c+3*t},buffers:{treeBox:y(Sp(e).size*4),treeCount:y(c*4),treeBlocks:y(Math.max(c/1024,4)*4),treeWork:y(3*t*4),treeMeta:y((c+3*t+u)*4),treeSp:y(t*r.SP4*16),treeCells:y((g+(o?pp*h:0))*16),treeLists:y((v+(o?pp:0))*4)}}}function Wp(e,t){let n=e.prologue(`values`)+` var k1; `+e.emit(t,`r`,`k1`)+` return k1;`,r=Function(`r`,`values`,`lawFunctions`,n),i=null;for(let t=-8;t<=24;t++){let n=Math.abs(r(2**t,e.values,e.functions));if(i!==null&&i>0&&n>0&&Math.log2(n/i)>-2.5)return!0;i=n}return!1}function Gp(e,t,n){if(Object.keys(e.functions).filter(t=>e.tableNames.indexOf(t)<0).length)return`laws with JavaScript functions run on the CPU only`;try{e.emit(n,t,`r`,`k1`,`k2`)}catch(e){return`the law: `+e.message}for(let t of e.describe().tables){let e=Array.from(t.values).find(e=>!Number.isFinite(e)||Math.abs(e)>34028234663852886e22);if(e!==void 0)return`the law's table ${t.name}: ${Uu(e)}`}let r=nd(e);return r?`the law's ${r.name} is ${r.problem}`:null}function Kp(e){return(e/1048576).toFixed(+(e<10485760))+` MiB`}function qp(e,t,n){let r=[];return e.writes.forEach(i=>{if(i.space!==`nodes`||i.mode!==`add`||i.column===`force`||i.via||r.some(e=>e.column===i.column))return;let a=n[i.column],o=a&&a.width===`D`?t:1;r.push({column:i.column,width:o,startAtZero:(e.args.startAtZero||[]).indexOf(i.column)>=0})}),r}function Jp(e){let t=[];return e.reads.forEach(e=>{e.space!==`nodes`||e.column===`pos`||t.indexOf(e.column)>=0||t.push(e.column)}),t}function Yp(e,t){let{D:n,printer:r}=t;if(e.tables&&e.tables.length)throw Error(`WebGPU does not run lookup tables in pair formulas yet`);let i=e.args.symmetric!==!1,a=qp(e,n,t.columns),o=n=>Bu.compile(e.formula,Qp(e,t,n,a),r).lines;return{i:o(`i`),j:i?o(`j`):null,accumulators:a,reads:Jp(e)}}function Xp(e,{D:t,me:n,other:r,r2:i,radius:a,force:o,reach2:s=null,valid:c=null}){let l=e=>e.map(e=>`    `+e),u=e.j?[`if (${n} < ${r}) {`].concat(l(e.i),[`} else {`],l(e.j),[`}`]):[`{`].concat(l(e.i),[`}`]);return[`if (${[`${i} > 0.0`].concat(s?[`${i} <= ${s}`]:[],c?[c]:[]).join(` && `)}) {`,`  let pair_r = sqrt(${i});`,`  if (pair_r < ${a}) {`,`    var pair_push = 0.0;`].concat(u.map(e=>`    `+e),[`    let pair_scale = pair_push / pair_r;`,`    `+Array.from({length:t},(e,t)=>`${o(t)} += pair_scale * d${t};`).join(` `),`  }`,`}`])}function Zp(e,t,n){return n===1?`pair_acc_${e}`:`pair_acc_${e}_${t}`}function Qp(e,t,n,r){let{D:i,columns:a}=t,o=e=>e===n?`me`:`other`;return{D:i,name(n){if(n===`r`)return{type:`num`,code:`pair_r`};if(n===`push`)return{type:`num`,code:`pair_push`,write:(e,t)=>[`pair_push ${e} ${t.code};`]};let r=/^(\w+)_([ij])$/.exec(n);if(r&&(r[1]===`pos`||a[r[1]]&&!a[r[1]].hidden))return s(r[1],r[2]);if(e.params.some(e=>e.name===n))return{type:`num`,code:t.param(n)};if(t.sumWidth&&t.sumWidth(n)){let e=t.sumWidth(n),r=Array.from({length:e},(e,r)=>t.sum(n,r));return e===1?{type:`num`,code:r[0]}:{type:`vec`,codes:r}}if(e.builtIns.indexOf(n)>=0)return{type:`num`,code:t.builtIn(n)}}};function s(e,s){let c=(e===`pos`?{width:`D`}:a[e]).width===`D`?i:1,l=e===`force`,u=l||r.some(t=>t.column===e),d=Array.from({length:c},(n,r)=>u?`pair_unread`:t.read(e,o(s),r)),f=n=>l?t.force?t.force(n):`pair_force_${n}`:Zp(e,n,c),p=u?(e,t)=>{if(s!==n)return[];let r=t.codes||[t.code];return Array.from({length:c},(t,n)=>`${f(n)} ${e} ${r[n]};`)}:null,m=c===1?{type:`num`,code:d[0]}:{type:`vec`,codes:d};return p&&(m.write=p,m.ops=[`+=`,`-=`]),m}}var $p=1024,em=1+1/1024,tm=1073741823,Z={RANK_X:0,RANK_Y:1,RANK_Z:2,EVAL_X:3,EVAL_Y:4,EVAL_Z:5,RANK_TOTAL:6,FLAGS:7,ALLOC:8,OK:9,EVAL_COUNT:10,RANK_COUNT:11,SLICE_EVAL:16,SLICE_RANK:208,WORDS:400},nm=1,rm=2,im={BUCKET:0,SLOT:1,RANK:2,FIRST:3,COUNT:4,RANK_FIRST:5,CELL:6},am=`xyzw`;function om(e,t,n=` `){let r=[];for(let n=0;n<e;n++)r.push(t(n));return r.join(n)}function Q(e){return e+`u`}var sm=`@builtin(global_invocation_id) gid: vec3u, @builtin(num_workgroups) nwg: vec3u`,cm=e=>`gid.x + gid.y * nwg.x * ${Q(e)}`,lm=e=>`struct PairSlice { k: u32, index: u32, pad0: u32, pad1: u32 };
@group(0) @binding(${e}) var<uniform> SL: PairSlice;`,um=`struct PairParams { n: u32, mask: u32, size: u32, blocks: u32, cap: u32, sort: u32, owners: u32, home: u32 };
@group(0) @binding(0) var<uniform> PP: PairParams;`,dm=`fn pair_start(b: u32) -> u32 {
  return pairStart[b] + pairStart[PP.size + 1u + (b >> 10u)];
}`;function fm(e,t){let n=e+t.reduce((e,t)=>e+t.width,0)+1,r=Math.ceil(3**e/32);return{body:im.CELL+e,home:1+e+r,maskWords:r,snap4:Math.ceil(n/4),index:n-1}}function pm(e){return`fn pair_hash(${om(e,e=>`c${e}: i32`,`, `)}) -> u32 {
  var h = 0x165667b1u;
  ${om(e,e=>`h = (h ^ bitcast<u32>(c${e})) * 0x27d4eb2du; h ^= h >> 15u;`,`
  `)}
  return h & PP.mask;
}`}function mm(e,t){return`pair_hash(${om(e,e=>`c${e} + i32((${t} / ${Q(3**e)}) % 3u) - 1`,`, `)})`}function hm(e,t){let n=3**e,r=Math.ceil(n/32),i=[`var candidates = 0u;`];for(let e=0;e<r;e++)i.push(`var mask${e} = 0u;`);if(e<=3)for(let t=0;t<n;t++){i.push(`let pb${t} = ${mm(e,Q(t))};`);let n=[];for(let e=0;e<t;e++)n.push(`pb${t} == pb${e}`);let r=`candidates += pair_start(pb${t} + 1u) - pair_start(pb${t});`;i.push(t?`if (${n.join(` || `)}) { mask${t>>5} |= ${Q(2**(t&31))}; } else { ${r} }`:r)}else i.push(`var seen: array<u32, ${n}>;`,`for (var o = 0u; o < ${Q(n)}; o++) {`,`  let pb = ${mm(e,`o`)};`,`  var repeat = false;`,`  for (var q = 0u; q < o; q++) { repeat = repeat || seen[q] == pb; }`,`  seen[o] = pb;`,`  if (repeat) { ${om(r,e=>`if ((o >> 5u) == ${Q(e)}) { mask${e} |= 1u << (o & 31u); }`)} continue; }`,`  candidates += pair_start(pb + 1u) - pair_start(pb);`,`}`);return i.map(e=>t+e).join(`
`)}function gm(e,t,n){let r=3**e,i=Math.ceil(r/32)===1?`mask0`:`select(select(mask0, mask1, o >= 32u), mask2, o >= 64u)`;return[`for (var o = 0u; o < ${Q(r)}; o++) {`,`  if (((${i} >> (o & 31u)) & 1u) != 0u) { continue; }`,`  let pb = ${mm(e,`o`)};`].concat(t.map(e=>`  `+e),[`}`]).map(e=>n+e).join(`
`)}function _m(e,t,n,r,i){return[`let ${e}W = (${t} + ${Q(n-1)}) / ${Q(n)};`,`pairArgs[${r}] = min(${e}W, ${Q(i)}); pairArgs[${r+1}] = (${e}W + ${Q(i-1)}) / ${Q(i)}; pairArgs[${r+2}] = 1u;`].join(` `)}function vm(e){let{D:t,layout:n,slot:r}=e,i=n.body,a=pm(t),o={};o.BIN={bindings:[`uniform`,`dynamic`,`read`,`storage`,`storage`],code:`${um}
${r.decl(1)}
@group(0) @binding(2) var<storage, read> X: array<f32>;
@group(0) @binding(3) var<storage, read_write> pairCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> pairBody: array<u32>;
${a}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n) { return; }
  let inv = 1.0 / (${r.at(e.radius)} * ${em});
  ${om(t,t=>`let c${t} = i32(clamp(floor(${e.pos.at(`i`,t)} * inv), -1073741823.0, ${tm}.0));`,`
  `)}
  let h = pair_hash(${om(t,e=>`c${e}`,`, `)});
  let record = i * ${Q(i)};
  pairBody[record + ${Q(im.BUCKET)}] = h;
  pairBody[record + ${Q(im.SLOT)}] = atomicAdd(&pairCount[h], 1u);
  pairBody[record + ${Q(im.RANK)}] = 0u;
  ${om(t,e=>`pairBody[record + ${Q(im.CELL+e)}] = bitcast<u32>(c${e});`,` `)}
}
`},o.SCAN_BLOCKS={bindings:[`uniform`,`storage`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairCount: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStart: array<u32>;
var<workgroup> tmp: array<u32, 256>;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {
  let base = wid.x * 1024u + li * 4u;
  let a0 = pairCount[base]; let a1 = pairCount[base + 1u]; let a2 = pairCount[base + 2u]; let a3 = pairCount[base + 3u];
  pairCount[base] = 0u; pairCount[base + 1u] = 0u; pairCount[base + 2u] = 0u; pairCount[base + 3u] = 0u;
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
  pairStart[base] = ex; pairStart[base + 1u] = ex + a0; pairStart[base + 2u] = ex + a0 + a1; pairStart[base + 3u] = ex + a0 + a1 + a2;
  if (li == 255u) { pairStart[PP.size + 1u + wid.x] = tmp[255]; }
}
`},o.SCAN_TOP={bindings:[`uniform`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairStart: array<u32>;
var<workgroup> tmp: array<u32, 256>;
var<workgroup> carry: u32;
@compute @workgroup_size(256)
fn main(@builtin(local_invocation_index) li: u32) {
  if (li == 0u) { carry = 0u; }
  workgroupBarrier();
  let sums = PP.size + 1u;
  for (var done = 0u; done < PP.blocks; done += 1024u) {
    let base = done + li * 4u;
    var a = vec4u(0u);
    for (var k = 0u; k < 4u; k++) { if (base + k < PP.blocks) { a[k] = pairStart[sums + base + k]; } }
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
    var ex = carry + tmp[li] - t;
    for (var k = 0u; k < 4u; k++) { if (base + k < PP.blocks) { pairStart[sums + base + k] = ex; } ex += a[k]; }
    workgroupBarrier();
    if (li == 255u) { carry += tmp[255]; }
    workgroupBarrier();
  }
  if (li == 0u) { pairStart[sums + PP.blocks] = carry; }
}
`},o.PLACE={bindings:[`uniform`,`read`,`storage`,`storage`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read> pairStart: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairArgs: array<atomic<u32>>;
${dm}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n) { return; }
  let record = i * ${Q(i)};
  let h = pairBody[record + ${Q(im.BUCKET)}];
  let s = pair_start(h);
  let k = pair_start(h + 1u) - s;
  pairList[s + pairBody[record + ${Q(im.SLOT)}]] = i;
  if (k > ${Q($p)}) {
    atomicOr(&pairArgs[${Z.FLAGS}], ${Q(rm)});
    let ranks = (k + ${Q(255)}) / ${Q(256)};
    let first = atomicAdd(&pairArgs[${Z.RANK_TOTAL}], ranks);
    pairBody[record + ${Q(im.RANK_FIRST)}] = first;
    // past the cap nothing is written, and ARGS_RANK stops the step
    if (first <= PP.cap && first + ranks <= PP.cap) {
      for (var c = 0u; c < ranks; c++) { pairList[PP.n + first + c] = i; }
    }
  }
}
`};let s=(e,t,n=`PP.cap`)=>`pairArgs[${Z.OK}] = 0u;
    if (pairStatus[0] == 0u) {
      pairStatus[0] = ${Q(t)};
      pairStatus[1] = PP.sort;
      // a total at or under the cap has wrapped past 2^32
      pairStatus[2] = select(0xffffffffu, ${e}, ${e} > ${n});
      pairStatus[3] = ${n};
    }`;o.ARGS_RANK={bindings:[`uniform`,`storage`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
@compute @workgroup_size(1)
fn main() {
  let ranks = pairArgs[${Z.RANK_TOTAL}];
  let crowded = (pairArgs[${Z.FLAGS}] & ${Q(rm)}) != 0u;
  pairArgs[${Z.OK}] = 1u;
  pairArgs[${Z.RANK_X}] = 0u; pairArgs[${Z.RANK_Y}] = 1u; pairArgs[${Z.RANK_Z}] = 1u;
  pairArgs[${Z.RANK_COUNT}] = 0u;
  if (crowded && ranks > PP.cap) {
    ${s(`ranks`,2)}
  } else if (crowded) {
    ${_m(`rank`,`ranks`,64,Z.RANK_X,e.maxGroups)}
    pairArgs[${Z.RANK_COUNT}] = ranks;
  }
  pairArgs[${Z.RANK_TOTAL}] = 0u;
}
`},o.RANK={bindings:[`uniform`,`read`,`read`,`storage`,`read`],indirect:Z.RANK_X,code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
${dm}
@compute @workgroup_size(64)
fn main(${sm}) {
  let t = ${cm(64)};
  if (t >= pairArgs[${Z.RANK_COUNT}]) { return; }
  let i = pairList[PP.n + t];
  let record = i * ${Q(i)};
  let c = t - atomicLoad(&pairBody[record + ${Q(im.RANK_FIRST)}]);
  let h = atomicLoad(&pairBody[record + ${Q(im.BUCKET)}]);
  let lo = pair_start(h) + c * ${Q(256)};
  let hi = min(pair_start(h + 1u), lo + ${Q(256)});
  var lower = 0u;
  for (var at = lo; at < hi; at++) { lower += select(0u, 1u, pairList[at] < i); }
  if (lower > 0u) { atomicAdd(&pairBody[record + ${Q(im.RANK)}], lower); }
}
`};let c=[];for(let n=0;n<t;n++)c.push(`bitcast<u32>(${e.pos.at(`i`,n)})`);for(e.snapshot.forEach(e=>{for(let t=0;t<e.width;t++)c.push(`bitcast<u32>(${e.ref.at(`i`,t)})`)});c.length<n.index;)c.push(`0u`);for(c.push(e.row?e.row.at(`i`):`i`);c.length<n.snap4*4;)c.push(`0u`);let l=[];return e.snapshot.forEach(e=>{l.indexOf(e.ref.buffer)<0&&l.push(e.ref.buffer)}),e.row&&l.indexOf(e.row.buffer)<0&&l.push(e.row.buffer),o.ORDER=bm(e,c,l,!1),o.ORDER_S=bm(e,c,l,!0),o.ARGS={bindings:[`uniform`,`storage`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
@compute @workgroup_size(1)
fn main() {
  let total = pairArgs[${Z.ALLOC}];
  pairStatus[4u + PP.sort] = total;
  pairArgs[${Z.EVAL_X}] = 0u; pairArgs[${Z.EVAL_Y}] = 1u; pairArgs[${Z.EVAL_Z}] = 1u;
  pairArgs[${Z.EVAL_COUNT}] = 0u;
  if ((pairArgs[${Z.FLAGS}] & ${Q(nm)}) != 0u || total > PP.cap) {
    ${s(`total`,1)}
  } else if (pairArgs[${Z.OK}] != 0u) {
    ${_m(`eval`,`total`,64,Z.EVAL_X,e.maxGroups)}
    pairArgs[${Z.EVAL_COUNT}] = total;
  }
  pairArgs[${Z.FLAGS}] = 0u; pairArgs[${Z.ALLOC}] = 0u;
}
`},Object.assign(o,ym(e,s)),o}function ym(e,t){let{layout:n}=e,r=n.body,i={},a=(e,t)=>`let base = SL.index * PP.cap;
  let lo = max(${e}, base);
  let hi = min(${e} + ${t}, base + PP.cap);`,o=(t,n,r)=>`for (var s = 0u; s < SL.k; s++) {
      let count = select(0u, min(PP.cap, ${t} - s * PP.cap), ${t} > s * PP.cap);
      let w = (count + ${Q(n-1)}) / ${Q(n)};
      pairArgs[${Q(r)} + 3u * s] = min(w, ${Q(e.maxGroups)});
      pairArgs[${Q(r)} + 3u * s + 1u] = (w + ${Q(e.maxGroups-1)}) / ${Q(e.maxGroups)};
      pairArgs[${Q(r)} + 3u * s + 2u] = 1u;
    }`,s=e=>`for (var s = 0u; s < SL.k; s++) { pairArgs[${Q(e)} + 3u * s] = 0u; pairArgs[${Q(e)} + 3u * s + 1u] = 1u; pairArgs[${Q(e)} + 3u * s + 2u] = 1u; }`;return i.PLACE_S={bindings:[`uniform`,`read`,`storage`,`storage`,`storage`],code:`${um}
@group(0) @binding(1) var<storage, read> pairStart: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairArgs: array<atomic<u32>>;
${dm}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n) { return; }
  let record = i * ${Q(r)};
  let h = pairBody[record + ${Q(im.BUCKET)}];
  let s = pair_start(h);
  let k = pair_start(h + 1u) - s;
  pairList[s + pairBody[record + ${Q(im.SLOT)}]] = i;
  if (k > ${Q($p)}) {
    atomicOr(&pairArgs[${Z.FLAGS}], ${Q(rm)});
    pairBody[record + ${Q(im.RANK_FIRST)}] = atomicAdd(&pairArgs[${Z.RANK_TOTAL}], (k + ${Q(255)}) / ${Q(256)});
  }
}
`},i.ARGS_RANK_S={bindings:[`uniform`,`storage`,`storage`,`dynamic`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
${lm(3)}
@compute @workgroup_size(1)
fn main() {
  let ranks = pairArgs[${Z.RANK_TOTAL}];
  let crowded = (pairArgs[${Z.FLAGS}] & ${Q(rm)}) != 0u;
  let capacity = SL.k * PP.cap;
  pairArgs[${Z.OK}] = 1u;
  pairArgs[${Z.RANK_COUNT}] = 0u;
  ${s(Z.SLICE_RANK)}
  if (crowded && ranks > capacity) {
    ${t(`ranks`,4,`capacity`)}
  } else if (crowded) {
    ${o(`ranks`,64,Z.SLICE_RANK)}
    pairArgs[${Z.RANK_COUNT}] = ranks;
  }
  pairArgs[${Z.RANK_TOTAL}] = 0u;
}
`},i.RANK_OWNERS_S={bindings:[`uniform`,`read`,`read`,`read`,`storage`,`dynamic`],code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read> pairBody: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairList: array<u32>;
${lm(5)}
${dm}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n || pairArgs[${Z.RANK_COUNT}] == 0u) { return; }
  let record = i * ${Q(r)};
  let h = pairBody[record + ${Q(im.BUCKET)}];
  let k = pair_start(h + 1u) - pair_start(h);
  if (k <= ${Q($p)}) { return; }
  ${a(`pairBody[record + ${Q(im.RANK_FIRST)}]`,`(k + ${Q(255)}) / ${Q(256)}`)}
  for (var c = lo; c < hi; c++) { pairList[PP.n + c - base] = i; }
}
`},i.RANK_S={bindings:[`uniform`,`read`,`read`,`storage`,`read`,`dynamic`],indirect:Z.SLICE_RANK,code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
${lm(5)}
${dm}
@compute @workgroup_size(64)
fn main(${sm}) {
  let t = ${cm(64)};
  let chunk = SL.index * PP.cap + t;
  if (t >= PP.cap || chunk >= pairArgs[${Z.RANK_COUNT}]) { return; }
  let i = pairList[PP.n + t];
  let record = i * ${Q(r)};
  let c = chunk - atomicLoad(&pairBody[record + ${Q(im.RANK_FIRST)}]);
  let h = atomicLoad(&pairBody[record + ${Q(im.BUCKET)}]);
  let lo = pair_start(h) + c * ${Q(256)};
  let hi = min(pair_start(h + 1u), lo + ${Q(256)});
  var lower = 0u;
  for (var at = lo; at < hi; at++) { lower += select(0u, 1u, pairList[at] < i); }
  if (lower > 0u) { atomicAdd(&pairBody[record + ${Q(im.RANK)}], lower); }
}
`},i.ARGS_S={bindings:[`uniform`,`storage`,`storage`,`dynamic`],code:`${um}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read_write> pairStatus: array<u32>;
${lm(3)}
@compute @workgroup_size(1)
fn main() {
  let total = pairArgs[${Z.ALLOC}];
  let capacity = SL.k * PP.cap;
  pairStatus[4u + PP.sort] = total;
  pairArgs[${Z.EVAL_COUNT}] = 0u;
  ${s(Z.SLICE_EVAL)}
  if ((pairArgs[${Z.FLAGS}] & ${Q(nm)}) != 0u || total > capacity) {
    ${t(`total`,3,`capacity`)}
  } else if (pairArgs[${Z.OK}] != 0u) {
    ${o(`total`,64,Z.SLICE_EVAL)}
    pairArgs[${Z.EVAL_COUNT}] = total;
  }
  pairArgs[${Z.FLAGS}] = 0u; pairArgs[${Z.ALLOC}] = 0u;
}
`},i.EVAL_OWNERS_S={bindings:[`uniform`,`read`,`read`,`storage`,`dynamic`],code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairList: array<u32>;
${lm(4)}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n || pairArgs[${Z.EVAL_COUNT}] == 0u) { return; }
  let record = i * ${Q(r)};
  let p = pairList[PP.home + PP.n * ${Q(n.home)} + i];
  ${a(`pairBody[record + ${Q(im.FIRST)}]`,`pairBody[record + ${Q(im.COUNT)}]`)}
  for (var c = lo; c < hi; c++) { pairList[PP.owners + c - base] = p; }
}
`},i}function bm(e,t,n,r){let{D:i,layout:a}=e,o=a.body,s=r?`capacity`:`PP.cap`;return{bindings:[`uniform`,`storage`,`read`,`storage`,`storage`,`storage`,`read`].concat(n.map(()=>`read`),r?[`dynamic`]:[]),columns:n,code:`${um}
@group(0) @binding(1) var<storage, read_write> pairArgs: array<atomic<u32>>;
@group(0) @binding(2) var<storage, read> pairStart: array<u32>;
@group(0) @binding(3) var<storage, read_write> pairBody: array<u32>;
@group(0) @binding(4) var<storage, read_write> pairList: array<u32>;
@group(0) @binding(5) var<storage, read_write> pairSnap: array<vec4u>;
@group(0) @binding(6) var<storage, read> X: array<f32>;
${n.map((e,t)=>`@group(0) @binding(${7+t}) var<storage, read> ${e}: array<f32>;`).join(`
`)}${r?`
`+lm(7+n.length):``}
var<workgroup> claimed: atomic<u32>;
var<workgroup> base: u32;
var<workgroup> fits: u32;
${pm(i)}
${dm}
@compute @workgroup_size(256)
fn main(${sm}, @builtin(local_invocation_index) li: u32) {
  let q = ${cm(256)};
  let live = q < PP.n && atomicLoad(&pairArgs[${Z.OK}]) != 0u;
  var i = 0u; var p = 0u; var chunks = 0u; var mine = 0u;
  ${om(i,e=>`var c${e} = 0;`)}
  ${om(a.maskWords,e=>`var home${e} = 0u;`)}
  if (live) {
    i = pairList[q];
    let record = i * ${Q(o)};
    let h = pairBody[record + ${Q(im.BUCKET)}];
    let s = pair_start(h);
    let e = pair_start(h + 1u);
    var rank = pairBody[record + ${Q(im.RANK)}];
    if (e - s <= ${Q($p)}) {
      rank = 0u;
      for (var t = s; t < e; t++) { rank += select(0u, 1u, pairList[t] < i); }
    }
    p = s + rank;
    ${om(a.snap4,e=>`pairSnap[p * ${Q(a.snap4)} + ${Q(e)}] = vec4u(${t.slice(4*e,4*e+4).join(`, `)});`,`
    `)}
    ${om(i,e=>`c${e} = bitcast<i32>(pairBody[record + ${Q(im.CELL+e)}]);`)}
${hm(i,`    `)}
    ${om(a.maskWords,e=>`home${e} = mask${e};`)}
    // the body's own bucket is among them, so every body has a chunk
    chunks = (candidates + ${Q(255)}) / ${Q(256)};
    mine = atomicAdd(&claimed, chunks);
  }
  // chunks are handed out per workgroup, in bucket order; past the cap nothing is written, and
  // ARGS stops the step
  workgroupBarrier();
  if (li == 0u) {
    let total = atomicLoad(&claimed);
    base = atomicAdd(&pairArgs[${Z.ALLOC}], total);${r?`
    let capacity = SL.k * PP.cap;`:``}
    fits = select(0u, 1u, base <= ${s} && base + total <= ${s});
    if (fits == 0u) { atomicOr(&pairArgs[${Z.FLAGS}], ${Q(nm)}); }
  }
  workgroupBarrier();
  if (live && fits != 0u) {
    let first = base + mine;
    let record = i * ${Q(o)};
    pairBody[record + ${Q(im.FIRST)}] = first;
    pairBody[record + ${Q(im.COUNT)}] = chunks;
    let home = PP.home + p * ${Q(a.home)};
    pairList[home] = first;
    ${om(i,e=>`pairList[home + ${Q(1+e)}] = bitcast<u32>(c${e});`)}
    ${om(a.maskWords,e=>`pairList[home + ${Q(1+i+e)}] = home${e};`)}
    ${r?`pairList[PP.home + PP.n * ${Q(a.home)} + i] = p;`:`for (var c = 0u; c < chunks; c++) { pairList[PP.owners + first + c] = p; }`}
  }
}
`}}function xm(e){let{D:t,layout:n,slot:r}=e,i=n.body,a=(t,n)=>e.snapshot.find(e=>e.column===t).word+n,o=(e,t)=>`${e}${t>>2}.${am[t&3]}`,s=(e,t)=>`bitcast<f32>(${o(e,t)})`,c=Yp(e.stage,{D:t,printer:e.printer,columns:e.columns,read:(t,n,r)=>t===`pos`?`(${s(n,r)} + ${e.origin(r)})`:s(n,a(t,r)),param:e.param,builtIn:e.builtIn,sumWidth:t=>e.sums.width(t),sum:(t,n)=>e.sums.at(t,n)}),l=c.accumulators,u=t+l.reduce((e,t)=>e+t.width,0),d=e.stage.sums.length>0,f=Xp(c,{D:t,me:`me`,other:`other`,r2:`r2`,radius:`radius`,reach2:`reach2`,force:e=>`pair_force_${e}`}),p=[];for(let e=0;e<t;e++)p.push(`pair_force_${e}`);l.forEach(e=>{for(let t=0;t<e.width;t++)p.push(Zp(e.column,t,e.width))});let m=(e,t)=>om(n.snap4,r=>`let ${e}${r} = pairSnap[${t} * ${Q(n.snap4)} + ${Q(r)}];`,` `),h=i=>({bindings:[`uniform`,`dynamic`,`read`,`read`,`read`,`read`,`storage`].concat(d?[`read`]:[],i?[`dynamic`]:[]),indirect:i?Z.SLICE_EVAL:Z.EVAL_X,partialWords:u,code:`${um}
${r.decl(1)}
@group(0) @binding(2) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(3) var<storage, read> pairStart: array<u32>;
@group(0) @binding(4) var<storage, read> pairList: array<u32>;
@group(0) @binding(5) var<storage, read> pairSnap: array<vec4u>;
@group(0) @binding(6) var<storage, read_write> pairPartial: array<f32>;
${d?`@group(0) @binding(7) var<storage, read> ${e.sums.buffer}: array<f32>;`:``}${i?`
`+lm(d?8:7):``}
${pm(t)}
${dm}
@compute @workgroup_size(64)
fn main(${sm}) {
  let t = ${cm(64)};
  ${i?`let chunk = SL.index * PP.cap + t;
  if (t >= PP.cap || chunk >= pairArgs[${Z.EVAL_COUNT}]) { return; }`:`if (t >= pairArgs[${Z.EVAL_COUNT}]) { return; }`}
  let p = pairList[PP.owners + t];
  ${m(`me`,`p`)}
  let me = me${n.index>>2}.${am[n.index&3]};
  let home = PP.home + p * ${Q(n.home)};
  ${om(t,e=>`let c${e} = bitcast<i32>(pairList[home + ${Q(1+e)}]);`)}
  ${om(n.maskWords,e=>`let mask${e} = pairList[home + ${Q(1+t+e)}];`)}
  let radius = ${r.at(e.radius)};
  // most candidates are farther than the radius: the squared test spares them the root, with a
  // margin that drops only pairs the exact test drops
  let reach2 = radius * radius * 1.0001;
  ${p.map(e=>`var ${e} = 0.0;`).join(` `)}
  var skip = (${i?`chunk`:`t`} - pairList[home]) * ${Q(256)};
  var left = ${Q(256)};
${gm(t,[`let s = pair_start(pb);`,`let k = pair_start(pb + 1u) - s;`,`if (skip >= k) { skip -= k; continue; }`,`let lo = s + skip;`,`skip = 0u;`,`let hi = min(s + k, lo + left);`,`left -= hi - lo;`,`for (var at = lo; at < hi; at++) {`,`  ${m(`other`,`at`)}`,`  let other = other${n.index>>2}.${am[n.index&3]};`,`  ${om(t,e=>`let d${e} = ${s(`me`,e)} - ${s(`other`,e)};`)}`,`  let r2 = ${om(t,e=>`d${e} * d${e}`,` + `)};`].concat(f.map(e=>`  `+e),[`}`,`if (left == 0u) { break; }`]),`  `)}
  let out = t * ${Q(u)};
  ${p.map((e,t)=>`pairPartial[out + ${Q(t)}] = ${e};`).join(` `)}
}
`}),g=[],_=[];for(let n=0;n<t;n++)_.push(e.outputs.force.at(`i`,n));l.forEach(t=>{for(let n=0;n<t.width;n++)_.push(e.outputs[t.column].at(`i`,n))}),[e.outputs.force].concat(l.map(t=>e.outputs[t.column])).forEach(e=>{g.indexOf(e.buffer)<0&&g.push(e.buffer)});let v={bindings:[`uniform`,`read`,`read`,`read`].concat(g.map(()=>`storage`)),columns:g,code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read> pairPartial: array<f32>;
${g.map((e,t)=>`@group(0) @binding(${4+t}) var<storage, read_write> ${e}: array<f32>;`).join(`
`)}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n) { return; }
  ${_.map((e,t)=>`var total${t} = 0.0;`).join(` `)}
  if (pairArgs[${Z.EVAL_COUNT}] != 0u) {
    let record = i * ${Q(i)};
    let first = pairBody[record + ${Q(im.FIRST)}];
    let count = pairBody[record + ${Q(im.COUNT)}];
    for (var c = 0u; c < count; c++) {
      let at = (first + c) * ${Q(u)};
      ${_.map((e,t)=>`total${t} += pairPartial[at + ${Q(t)}];`).join(` `)}
    }
  }
  ${_.map((e,t)=>`${e} = total${t};`).join(` `)}
}
`},y={bindings:[`uniform`,`read`,`read`,`read`].concat(g.map(()=>`storage`),[`dynamic`]),columns:g,code:`${um}
@group(0) @binding(1) var<storage, read> pairArgs: array<u32>;
@group(0) @binding(2) var<storage, read> pairBody: array<u32>;
@group(0) @binding(3) var<storage, read> pairPartial: array<f32>;
${g.map((e,t)=>`@group(0) @binding(${4+t}) var<storage, read_write> ${e}: array<f32>;`).join(`
`)}
${lm(4+g.length)}
@compute @workgroup_size(256)
fn main(${sm}) {
  let i = ${cm(256)};
  if (i >= PP.n) { return; }
  let opening = SL.index == 0u;
  ${_.map((e,t)=>`var total${t} = select(${e}, 0.0, opening);`).join(` `)}
  var added = false;
  if (pairArgs[${Z.EVAL_COUNT}] != 0u) {
    let record = i * ${Q(i)};
    let first = pairBody[record + ${Q(im.FIRST)}];
    let base = SL.index * PP.cap;
    let lo = max(first, base);
    let hi = min(first + pairBody[record + ${Q(im.COUNT)}], base + PP.cap);
    for (var c = lo; c < hi; c++) {
      let at = (c - base) * ${Q(u)};
      ${_.map((e,t)=>`total${t} += pairPartial[at + ${Q(t)}];`).join(` `)}
      added = true;
    }
  }
  if (opening || added) { ${_.map((e,t)=>`${e} = total${t};`).join(` `)} }
}
`};return{EVAL:h(!1),GATHER:v,EVAL_S:h(!0),GATHER_S:y,accumulators:l,partialWords:u}}var Sm=1<<28,Cm=16384;function wm(e,t,n){return[{name:`force`,width:t}].concat(qp(e,t,n).map(e=>({name:e.column,width:e.width})))}function Tm({D:e,n:t,limits:n,stages:r,columns:i,sums:a={},sumBuffer:o=`S`,slot:s,pos:c,origin:l,row:u=null,cap:d=Sm,warn:f}){let p=e=>({refusal:e,kernels:{},bindings:{},buffers:{},sorts:[],stages:[]});if(e>=5)return p(t<=16384?`the cell sort runs in 2 to 4 dimensions; ${e}D pair formulas run in the all-pairs loop`:`pair formulas in ${e}D run as exact pairs up to ${Cm.toLocaleString(`en-US`)} bodies; this layout has ${t.toLocaleString(`en-US`)} (more needs a tree search)`);let m=Gu(f),h=[];r.forEach(e=>{let t=e.stage.args.radius,n=t&&t.kind===`number`?`number:`+t.value:`stage:`+e.stage.name,r=h.find(e=>e.key===n);r||(r={key:n,index:h.length,radius:e.radius,stages:[]},h.push(r)),r.stages.push(e)});let g=new Set;for(let t of h){let n=[],r=e;for(let a of t.stages)for(let t of Jp(a.stage)){if(n.some(e=>e.column===t))continue;let o=i[t];if(!o||!o.ref)return p(`${a.stage.name}: WebGPU has no column ${t}`);let s=o.width===`D`?e:o.width;if(s!==1&&s!==e)return p(`${a.stage.name}: WebGPU reads columns of 1 or D numbers per body; ${t} has ${s}`);n.push({column:t,width:s,word:r,ref:o.ref}),r+=s,g.add(t)}t.snapshot=n,t.layout=fm(e,n)}let _=Math.max(1024,2**Math.ceil(Math.log2(2*Math.max(1,t)))),v=Math.min(n.maxStorageBufferBindingSize,n.maxBufferSize),y=e=>Math.max(16,Math.ceil(e/16)*16),b=e;r.forEach(t=>{let n=e+qp(t.stage,e,i).reduce((e,t)=>e+t.width,0);b=Math.max(b,n)});let x=Math.max(1,Math.min(Math.floor(d/256),t*Math.ceil(t/256),Math.floor(v/(4*b)),Math.floor((v/4-t*10)/2))),S=n.maxComputeWorkgroupsPerDimension,C={},w={},T={},E={},D=(e,t,n)=>{C[e]=t.code,w[e]=t.bindings,T[e]=n};for(let n of h){let r=n.stages.map(e=>e.stage.name),i=vm({D:e,layout:n.layout,snapshot:n.snapshot,pos:c,row:u,slot:s,radius:n.radius,maxGroups:S});n.kernels={},n.columns=i.ORDER.columns,Object.keys(i).forEach(e=>{let t=`PAIR_${e}_${n.index}`;n.kernels[e]=t,D(t,i[e],r)});let a=n.index;E[`pairCount`+a]=y(_*4),E[`pairStart`+a]=y((_+2+_/1024)*4),E[`pairBody`+a]=y(t*n.layout.body*4),E[`pairList`+a]=y((t+2*x+t*n.layout.home+t)*4),E[`pairArgs`+a]=y(Z.WORDS*4),E[`pairSnap`+a]=y(t*n.layout.snap4*16)}let O=[];for(let t=0;t<r.length;t++){let n=r[t],c=h.find(e=>e.stages.indexOf(n)>=0),u;try{u=xm({D:e,layout:c.layout,stage:n.stage,snapshot:c.snapshot,columns:i,slot:s,radius:c.radius,param:e=>s.at(n.params[e]),builtIn:e=>s.at(n.builtIns[e]),sums:{width:e=>a[e]?a[e].width:0,at:(e,t)=>a[e].at(t),buffer:o},origin:e=>s.at(l(e)),outputs:n.outputs,printer:m})}catch(e){return p(`${n.stage.name}: ${e.message}`)}let d=[n.stage.name];D(`PAIR_EVAL_${t}`,u.EVAL,d),D(`PAIR_GATHER_${t}`,u.GATHER,d),D(`PAIR_EVAL_S_${t}`,u.EVAL_S,d),D(`PAIR_GATHER_S_${t}`,u.GATHER_S,d),E[`pairPartial`+t]=y(x*u.partialWords*4),O.push({name:n.stage.name,index:t,sort:c.index,gate:n.gate,radius:c.radius,accumulators:u.accumulators,partialWords:u.partialWords,outputs:n.outputs,kernels:{EVAL:`PAIR_EVAL_${t}`,GATHER:`PAIR_GATHER_${t}`,EVAL_S:`PAIR_EVAL_S_${t}`,GATHER_S:`PAIR_GATHER_S_${t}`},gatherColumns:u.GATHER.columns,sumBuffer:n.stage.sums.length?o:null,params:n.params,builtIns:n.builtIns})}E.pairStatus=y((4+h.length)*4);let k=Object.keys(E).filter(e=>E[e]>v);if(k.length){let e=k.sort((e,t)=>E[t]-E[e])[0];return p(`the pair formulas at ${t.toLocaleString(`en-US`)} bodies need ${km(E[e])} for ${e}; this device allows ${km(v)} per buffer`)}return{refusal:null,D:e,n:t,size:_,blocks:_/1024,capChunks:x,cap:x*256,sorts:h,stages:O,kernels:C,bindings:w,kernelStages:T,buffers:E,reads:Array.from(g),dispatches:8*h.length+2*r.length,section:t=>Dm(O.find(e=>e.name===t),e,s)}}function Em(e,t){if(!t||t[0]===0)return null;let n=t[0],r=e.sorts[t[1]],i=r?r.stages.map(e=>e.stage.name):[`a pair stage`],a=t[3]*256,o=n===2||n===4,s=t[2]===4294967295?`more than ${Om(a)}`:`${o?`at least`:`about`} ${Om(t[2]*256)}`,c=o?`pair tests (counting only the work of ordering its crowded cells)`:`pair tests`;return`${i.length>1?`the pair formulas ${i.join(`, `)} needed ${s} ${c} each`:`the pair formula ${i[0]} needed ${s} ${c}`} in one step; ${n>=3?`more than the ${Om(a)} planned for it from the last measurement, in slices that each keep a submit short`:`the GPU runs at most ${Om(a)} in one submit, to keep submits short (the GPU watchdog stops long ones)`}. Bodies crowd into a few cells, or the radius is large for the layout. A layout that starts with its bodies piled up clears in 20 to 40 steps at 100k bodies: start the stage later (when: 'step > 40') or lower its radius`}function Dm(e,t,n){return{stage:e,code({force:r,local:i,row:a=`row`}){let o=[];for(let n=0;n<t;n++)o.push(`${r[n]} += ${e.outputs.force.at(a,n)};`);let s=[];e.accumulators.forEach(t=>{for(let n=0;n<t.width;n++)t.startAtZero&&s.push(`${i(t.column,n)} = 0.0;`),o.push(`${i(t.column,n)} += ${e.outputs[t.column].at(a,n)};`)});let c=s.concat([`if (${n.at(e.radius)} > 0.0) { ${o.join(` `)} }`]);return e.gate===void 0?c:[`if (${n.at(e.gate)} != 0.0) {`].concat(c.map(e=>`  `+e),[`}`])}}}function Om(e){return e>=1e6?e.toExponential(1).replace(`e+`,`e`):e.toLocaleString(`en-US`)}function km(e){return(e/1048576).toFixed(+(e<10485760))+` MiB`}var Am=16384,jm=256;function Mm(e,t,n){let r=new Float64Array(n);if(!t)return r;let i=Math.max(1,Math.floor(t/4096));for(let a=0;a<n;a++){let o=[];for(let r=0;r<t;r+=i)o.push(e[r*n+a]);o.sort((e,t)=>e-t);let s=e=>o[Math.min(o.length-1,Math.max(0,Math.round(e*(o.length-1))))],c=s(.5),l=s(.999)-s(.001);r[a]=Math.abs(c)<=Math.max(l,.001)?0:c}return r}function Nm(e,t,n,r){let i=new Float32Array(t*n);for(let a=0,o=0;a<t;a++)for(let t=0;t<n;t++,o++)i[o]=e[o]-r[t];return i}function Pm(e,t,n,r,i,a){let o=e.store,s=t.length;if(!s)return 0;if(Rm(e,t)){for(let e=0;e<s;e++){let a=t[e];if(a.store===o)for(let t=0;t<r;t++)o.pos[a.index*r+t]=i[t]+n[e*r+t]}return null}let c=o.pos,l=new Float64Array(r),u=s<=Am?1:Math.floor(Am/jm),d=s/u,f=u===1?s:jm;for(let e=0;e<u;e++){let t=Math.floor(e*d)*r,a=t+f*r;for(let e=t;e<a;e+=r)for(let t=0;t<r;t++)l[t]+=Math.abs(i[t]+n[e+t]-c[e+t])}i.every(e=>e===0)?c.set(n.subarray(0,s*r)):Fm(c,n,s,r,i);let p=0,m=s/(u*f)/a;for(let e=0;e<r;e++){let t=l[e]*m;p+=t*t}return p/s}function Fm(e,t,n,r,i){let a=n*r;if(r===2){let n=i[0],r=i[1];for(let i=0;i<a;i+=2)e[i]=n+t[i],e[i+1]=r+t[i+1]}else if(r===3){let n=i[0],r=i[1],o=i[2];for(let i=0;i<a;i+=3)e[i]=n+t[i],e[i+1]=r+t[i+1],e[i+2]=o+t[i+2]}else for(let a=0,o=0;a<n;a++)for(let n=0;n<r;n++,o++)e[o]=i[n]+t[o]}function Im(e,t,n,r,i,a,o,s=2){let c=e.store,l=t.length;if(!l)return 0;let u=Rm(e,t),d=c.pos,f=new Float64Array(s);for(let e=0;e<l;e++){let a=s*r[e];if(u){let r=t[e];if(r.store===c)for(let e=0;e<s;e++)d[s*r.index+e]=i[e]+n[a+e]}else for(let t=0;t<s;t++){let r=n[a+t],c=i[t]+r;f[t]+=Math.abs(c-d[s*e+t]),d[s*e+t]=c,o&&(o[s*e+t]=r)}}let p=0;for(let e=0;e<s;e++){let t=f[e]/a;p+=t*t}return u?null:p/l}function Lm(e,t,n){if(t<4096||t>=16777216||n!==2&&n!==3)return null;if(n===2){let n=new Float64Array(t),r=new Float64Array(t);for(let i=0;i<t;i++)n[i]=e[2*i],r[i]=e[2*i+1];return Gm(n,r,Wm(n,r))}let r=[],i=Math.max(1,Math.floor(t/4096));for(let n=0;n<3;n++){let a=[];for(let r=0;r<t;r+=i)a.push(e[3*r+n]);a.sort((e,t)=>e-t);let o=e=>a[Math.min(a.length-1,Math.max(0,Math.round(e*(a.length-1))))];r.push([o(.001),o(.999)])}let a=Math.max(...r.map(([e,t])=>t-e))||1,o=new Float64Array(t);for(let n=0;n<t;n++){let t=0;for(let i=0;i<3;i++){let o=Math.min(511,Math.max(0,Math.floor((e[3*n+i]-r[i][0])/a*512)));for(let e=0;e<9;e++)o&1<<e&&(t+=2**(3*e+i))}o[n]=t*16777216+n}o.sort();let s=new Uint32Array(t);for(let e=0;e<t;e++)s[o[e]%16777216]=e;return s}function Rm(e,t){let n=e.store,r=t.length,i=t[r-1];return!(r===0||n.n>=r&&i.store===n&&i.index===r-1)}function zm(e,t){let n=e.store,r=e.springStore,i=n.n,a=n.pos,o=new Float64Array(i),s=new Float64Array(i);for(let e=0;e<i;e++)o[e]=a[2*e],s[e]=a[2*e+1];Um(o,s);let c=Wm(o,s),l=Float64Array.of(c.x,c.y),u=t&&i>=4096?Gm(o,s,c):Hm(i),d=new Float32Array(2*i),f=new Float32Array(i),p=new Float32Array(4*i);for(let e=0;e<i;e++){let t=u[e];d[2*t]=o[e]-l[0],d[2*t+1]=s[e]-l[1],f[t]=n.mass[e]}Bm(n,u,p);let m=r.from,h=r.to,g=[];for(let e=0;e<r.n;e++)m[e]!==h[e]&&g.push(u[m[e]],u[h[e]]);return{n:i,edges:Uint32Array.from(g),init:d,mass:f,velocity:p,toInternal:u,permuted:i>=4096&&t,bodies:e.bodies.slice(),origin:l}}function Bm(e,t,n){let r=e.velocity,i=e.pinned;for(let e=0,a=t.length;e<a;e++){let a=4*t[e];n[a]=r[2*e],n[a+1]=r[2*e+1],n[a+2]=0,n[a+3]=+!!i[e]}return n}function Vm(e,t,n){let r=e.mass;for(let e=0,i=t.length;e<i;e++)n[t[e]]=r[e];return n}function Hm(e){let t=new Uint32Array(e);for(let n=0;n<e;n++)t[n]=n;return t}function Um(e,t){let n=e.length;if(n<2)return;let r=1;for(;r<2*n;)r<<=1;let i=new Int32Array(r).fill(-1),a=new Uint32Array(n),o=new Float64Array(2),s=new Uint32Array(o.buffer);for(let c=0;c<n;c++){o[0]=e[c]+0,o[1]=t[c]+0;let n=(Math.imul(s[0]^s[1],2654435761)^Math.imul(s[2]^s[3],2246822519))>>>0;n=(n^n>>>15)&r-1;let l=-1;for(;;){let a=i[n];if(a===-1){i[n]=c;break}if(e[a]===e[c]&&t[a]===t[c]){l=a;break}n=n+1&r-1}if(l>=0){let n=++a[l],r=Math.sqrt(n),i=n*2.399963229728653;e[c]=e[l]+r*Math.cos(i),t[c]=t[l]+r*Math.sin(i)}}}function Wm(e,t){let n=e.length;if(!n)return{x:0,y:0,minX:0,minY:0,side:1};let r=Math.max(1,Math.floor(n/4096)),i=[],a=[];for(let o=0;o<n;o+=r)i.push(e[o]),a.push(t[o]);let o=Float64Array.from(i).sort(),s=Float64Array.from(a).sort(),c=(e,t)=>e[Math.min(e.length-1,Math.max(0,Math.round(t*(e.length-1))))],l=c(o,.001),u=c(o,.999),d=c(s,.001),f=c(s,.999);return{x:c(o,.5),y:c(s,.5),minX:l,minY:d,side:Math.max(u-l,f-d)||1}}function Gm(e,t,n){let r=e.length,i=4096,a=new Float64Array(r);for(let o=0;o<r;o++){let r=Math.min(4095,Math.max(0,Math.floor((e[o]-n.minX)/n.side*i))),s=Math.min(4095,Math.max(0,Math.floor((t[o]-n.minY)/n.side*i))),c=0;for(let e=2048;e>0;e>>=1){let t=+((r&e)>0),n=+((s&e)>0);if(c+=e*e*(3*t^n),n===0){t===1&&(r=e-1-r,s=e-1-s);let n=r;r=s,s=n}}a[o]=c*16777216+o}a.sort();let o=new Uint32Array(r);for(let e=0;e<r;e++)o[a[e]%16777216]=e;return o}var Km=16384,qm=64,Jm=`xyzw`,Ym=64,Xm=[`n`,`gravity`,`timeStep`,`dragCoefficient`,`springLength`,`springCoefficient`,`maxVelocity`];function Zm(e){return`V[${e>>2}].${Jm[e&3]}`}function Qm(e,t,n={}){let r=e.dims,i=e.spaces.nodes,a=e.spaces.links,o=n.data||{linksDefault:!0,groups:{}},s=n.smallGraph||(r===3?2560:1024),c=i>s&&(o.maxDegree===void 0||o.maxDegree>qm),l=lp(e),u=Object.create(null);e.columns.nodes.forEach(e=>{u[e.name]=e});let d=Object.create(null);(e.columns.links||[]).forEach(e=>{d[e.name]=e});let f=Object.create(null);e.sums.forEach(e=>{f[e.name]=e});let p=[],m=[];for(let e=0;e<l.length;e++){let n=l[e],r=n.builtIn||n.shape;if(r===`clear`)p.push({kind:`clear`,stage:n});else if(r===`drag`)n.args.skipped?m.push(n.name):p.push({kind:`drag`,stage:n});else if(r===`springs`)p.push({kind:`springs`,stage:n});else if(r===`repulsion`||r===`tree`){let n=[];for(;e<l.length&&(l[e].builtIn===`repulsion`||!l[e].builtIn&&l[e].shape===`tree`);){let r=l[e],i=r.args.channels[0];n.push({stage:r,charge:i.charge,sensitivity:i.sensitivity,law:t[r.name]||null,centroid:i.centroid||`own`}),e++}e--,p.push({kind:`pairs`,channels:n,stage:n[0].stage})}else if(r===`link`){let e=n.writes.some(e=>e.via===`pull`),t=n.writes.some(e=>e.space===`nodes`&&e.end);p.push({kind:e||t?`gather`:`linkset`,stage:n,pulls:e})}else if(r===`node`)p.push({kind:`formula`,stage:n});else if(r===`grid`)p.push({kind:`grid`,stage:n});else if(r===`host`)p.push({kind:`host`,stage:n});else if(r===`pair`)p.push({kind:`pairformula`,stage:n});else if(r===`sum`){let e=f[n.name];p.push({kind:e.group?`groupsum`:`sum`,stage:n,sum:e})}else r===`integrate`&&p.push({kind:n.args.integrator===`fire`?`fire`:`euler`,stage:n})}if(p.filter(e=>e.kind===`euler`||e.kind===`fire`).length!==1)return{refusal:`WebGPU needs exactly one integrate stage`};let h=p.findIndex(e=>e.kind===`euler`||e.kind===`fire`),g=p.slice(h+1).find(e=>e.kind===`pairs`||e.kind===`gather`||e.kind===`springs`||e.kind===`pairformula`||e.kind===`grid`||e.kind===`linkset`&&ah(e));if(g)return{refusal:`WebGPU runs tree passes, pair formulas, grid fields and link stages that read positions before the integrate stage only (${g.stage.name} comes after it)`};let _=i>s&&r<=4,v=p.filter(e=>e.kind===`pairformula`);if(v.forEach(e=>{e.sort=_}),v.length&&!_&&i>16384)return{refusal:`pair formulas in ${r}D run as exact pairs, for up to ${Km.toLocaleString(`en-US`)} bodies; this layout has ${i.toLocaleString(`en-US`)} (more needs a tree search)`};for(let e=0;e<p.length;e++){if(p[e].kind!==`pairs`||p[e].channels.some(e=>e.centroid===`shared`))continue;let t=e-1;for(;t>=0&&p[t].kind!==`pairs`&&oh(p[t]);)t--;t>=0&&p[t].kind===`pairs`&&(p[t].channels.push(...p[e].channels),p.splice(e,1),e--)}let y=p.filter(e=>e.kind===`pairs`),b=i>s&&r<=3&&y.length?y[0]:null;if(b&&(b.kind=`tree`),i>16384&&p.some(e=>e.kind===`pairs`))return{refusal:r>3?`WebGPU runs repulsion in ${r}D as exact pairs, for up to ${Km.toLocaleString(`en-US`)} bodies (its grid pyramid is 2D and 3D); this layout has ${i.toLocaleString(`en-US`)}`:`WebGPU's grid pyramid takes one group of tree passes per step above ${Km.toLocaleString(`en-US`)} bodies; this step has ${y.length} (passes next to each other walk together)`};let x=new Set,S=new Set,C=new Set,w=[],T=[],E=[];p.forEach(e=>{let t=e.kind===`sum`||e.kind===`groupsum`;t&&!sh(e.stage,x)&&!e.stage.sums.some(e=>S.has(e))?w.push(e):e.kind===`grid`&&!sh(e.stage,x)&&![...ih(e)].some(e=>C.has(e))?T.push(e):E.push(e),ih(e).forEach(e=>{x.add(e),C.add(e)}),nh(e).forEach(e=>C.add(e)),t&&S.add(e.stage.name)});let D=new Set([`pos`,`velocity`,`force`,`pinned`]),O=new Set;p.forEach(e=>{nh(e).forEach(e=>D.add(e)),ih(e).forEach(e=>{D.add(e),O.add(e)})});let k=$m(i),A=$m(a),j=Object.create(null),M=0,N=0,P=(e,t,n)=>{let r=k*n,i=t===`S`?M:N;t===`S`?M+=r:N+=r,j[e]={name:e,width:n,buffer:t,offset:i,type:u[e]?u[e].type:`f64`}};D.forEach(e=>{if(e===`pos`){j.pos={name:`pos`,width:r,buffer:`X`,offset:0,type:`f64`};return}let t=u[e];if(!t||t.hidden)return;let n=t.width===`D`?r:t.width,i=e===`velocity`||e===`force`||O.has(e);P(e,i?`S`:`H`,n)});let F=n.renumber!==!1&&i>=4096&&i<16777216&&(r===2||r===3),I=null;F&&v.some(e=>e.sort)&&(I={buffer:`H`,offset:N},N+=k);let L=new Set,R=new Set;p.forEach(e=>{e.kind===`springs`?o.linksDefault||(L.add(`length`),L.add(`coefficient`)):(e.kind===`gather`||e.kind===`linkset`)&&(e.stage.reads.forEach(e=>{e.space===`links`&&(!o.linksDefault||e.column!==`length`&&e.column!==`coefficient`)&&L.add(e.column)}),e.stage.writes.forEach(e=>{e.space===`links`&&(L.add(e.column),R.add(e.column))}))}),p.forEach(e=>{(e.kind===`gather`||e.kind===`linkset`)&&e.stage.reads.forEach(e=>{e.space===`links`&&R.has(e.column)&&L.add(e.column)})}),p.some(e=>e.kind===`springs`)&&[`length`,`coefficient`].forEach(e=>{R.has(e)&&L.add(e)});let z=Object.create(null);L.forEach(e=>{let t=d[e];R.has(e)||t&&/^stage:/.test(t.writer||``)?(z[e]={name:e,buffer:`S`,order:`link`,offset:M,type:t?t.type:`f64`},M+=A):(z[e]={name:e,buffer:`H`,order:`csr`,offset:N,type:t?t.type:`f64`},N+=2*A)}),p.forEach(e=>{e.kind===`springs`&&(e.own=!!(z.length||z.coefficient))});let ee=[],B=e=>(ee.push({id:ee.length,name:e.name,from:e.from,to:e.to,values:e.values,offset:N}),N+=e.values.length,ee.length-1);p.forEach(e=>{e.kind===`pairs`?e.channels.forEach(e=>{e.law&&(e.tables=Object.create(null),e.law.describe().tables.forEach(t=>{e.tables[t.name]=B(t)}))}):e.stage&&e.stage.tables&&e.stage.tables.length&&(e.tables=Object.create(null),e.stage.tables.forEach(t=>{e.tables[t.name]=B(t)}))});let te=Math.ceil(2*a/8)+i;p.forEach(e=>{if(e.kind!==`springs`&&e.kind!==`gather`||!c)return;let t=[],n=e.kind===`gather`&&e.stage.writes.some(e=>e.space===`nodes`&&e.end&&e.column===`force`);(e.kind===`springs`||e.pulls||n)&&t.push({column:`force`,width:r}),e.kind===`gather`&&e.stage.writes.forEach(e=>{e.space===`nodes`&&e.end&&e.column!==`force`&&!t.some(t=>t.column===e.column)&&t.push({column:e.column,width:j[e.column].width})});let i=t.reduce((e,t)=>e+t.width,0);e.chunks={offset:M,width:i,parts:t},M+=te*i});let ne=Math.max(1,Math.ceil(k/256)),re=Object.create(null),ie=[];p.forEach(e=>{if(e.kind!==`sum`&&e.kind!==`groupsum`)return;let t=e.sum.width===`D`?r:e.sum.width,n=re[e.stage.name]={name:e.stage.name,width:t,offset:M,grouped:e.kind===`groupsum`};n.grouped?(n.column=e.sum.group,n.count=o.groups[n.column]||0,ie.indexOf(n.column)<0&&ie.push(n.column),n.block=ie.indexOf(n.column),M+=Math.max(1,n.count)*t,n.rows=M,M+=k*t,n.runs=M,M+=(Math.ceil(i/256)+n.count+1)*t):M+=t}),v.forEach(e=>{e.sort&&(e.outputs=Object.create(null),wm(e.stage,r,u).forEach(t=>{let n=M;M+=k*t.width,e.outputs[t.name]={buffer:`S`,width:t.width,at:(e,r)=>`S[${n}u + ${e} * ${t.width}u + ${r}u]`}}))});let ae=M;M+=4;let V=M;M+=1024;let oe=M,se=Object.values(re).filter(e=>!e.grouped).reduce((e,t)=>e+t.width,0);M+=Math.max(4,ne*Math.max(1,se));let ce=ch();Xm.forEach(e=>ce.add(`setting`,e));for(let e=0;e<r;e++)ce.add(`setting`,`origin_`+e);p.forEach(e=>{if(e.kind===`pairs`||e.kind===`tree`){e.channels.forEach(e=>{e.stage.when&&(e.gate=ce.add(`gate`,e.stage.name)),e.law&&(e.values=ce.addLaw(e.stage.name,e.law))});return}let t=e.stage;e.kind!==`host`&&(t.when&&(e.gate=ce.add(`gate`,t.name)),e.kind===`pairformula`&&(e.radius=ce.add(`radius`,t.name)),e.params=Object.create(null),t.params.forEach(n=>{e.params[n.name]=ce.add(`param`,t.name,n.name)}),e.builtIns=Object.create(null),t.builtIn||t.builtIns.forEach(n=>{e.builtIns[n]=ce.add(`builtIn`,t.name,n)}),e.kind===`grid`&&(e.numbers=Object.create(null),Jf(r).forEach(n=>{e.numbers[n]=ce.add(`grid`,t.name,n)})))});let H=[],U=null,le=!1,ue=()=>{U={kind:`node`,name:``,sections:[],afterIntegrate:le,sums:[],groupSums:[]},H.push(U)},W=()=>{U&&de(U),U=null},de=e=>{e.sums.length&&H.push({kind:`reduce`,name:e.hoisted?`SUMS_REDUCE`:``,sums:e.sums.slice(),gates:e.sections.filter(e=>e.kind===`sum`).map(e=>e.gate)}),ie.forEach(t=>{let n=e.groupSums.filter(e=>e.column===t);if(!n.length)return;let r=n.map(t=>e.sections.find(e=>e.stage&&e.stage.name===t.name).gate);H.push({kind:`groupRuns`,name:``,column:t,sums:n,gates:r}),H.push({kind:`groupSum`,name:``,column:t,sums:n,gates:r})})};T.forEach(e=>H.push({kind:`grid`,name:``,section:e,gates:[e.gate],hoisted:!0})),w.length&&(U={kind:`node`,name:`SUMS`,sections:w,afterIntegrate:!1,hoisted:!0,sums:w.filter(e=>e.kind===`sum`).map(e=>re[e.stage.name]),groupSums:w.filter(e=>e.kind===`groupsum`).map(e=>re[e.stage.name])},H.push(U),W());for(let e=0;e<E.length;e++){let t=E[e];if(t.kind===`fire`){W(),H.push({kind:`fireReduce`,name:`FIRE_REDUCE`},{kind:`fireState`,name:`FIRE_STATE`}),ue(),U.sections.push(t),le=!0;continue}if(t.kind===`host`){W(),H.push({kind:`host`,name:t.stage.name,section:t});continue}if(t.kind===`grid`){W(),H.push({kind:`grid`,name:``,section:t,gates:[t.gate]});continue}if(t.kind===`linkset`){let e=H[H.length-1];(U||!e||e.kind!==`link`)&&(W(),H.push({kind:`link`,name:``,sections:[]})),H[H.length-1].sections.push(t);continue}U||ue();let n=rh(t);if(n.size){let e=new Set;U.sections.forEach(t=>ih(t).forEach(t=>e.add(t))),([...n].some(t=>e.has(t))||t.kind===`tree`&&U.tree)&&(W(),ue())}if(t.kind===`pairformula`&&t.sort){let e=new Set;U.sections.forEach(t=>ih(t).forEach(t=>e.add(t))),[...nh(t)].some(t=>e.has(t))&&(W(),ue()),U.pairStages=(U.pairStages||[]).concat([t.stage.name])}if(t.chunks){let e=new Set;U.sections.forEach(t=>ih(t).forEach(t=>e.add(t))),[...nh(t)].some(t=>e.has(t))&&(W(),ue()),H.splice(H.indexOf(U),0,{kind:`chunks`,name:``,section:t,gates:[t.gate]})}if(t.kind===`tree`&&(U.tree=t),U.sections.push(t),t.kind===`euler`&&(le=!0),t.kind===`sum`&&U.sums.push(re[t.stage.name]),t.kind===`groupsum`&&U.groupSums.push(re[t.stage.name]),t.kind===`sum`||t.kind===`groupsum`){let n=E.slice(e+1).some(e=>e.stage&&e.stage.sums&&e.stage.sums.indexOf(t.stage.name)>=0),r=e+1<E.length&&(E[e+1].kind===`sum`||E[e+1].kind===`groupsum`);n&&!r&&W()}}W(),H.forEach((e,t)=>{e.name||e.kind===`host`||(e.name={node:`STEP`,reduce:`REDUCE`,link:`LINKS`,groupRuns:`GROUP_RUNS`,groupSum:`GROUP_SUM`,chunks:`LINK_CHUNKS`,grid:`GRID`}[e.kind]+t)});let fe=Object.create(null);H.forEach(e=>{let t=[];(e.sections||[]).forEach(e=>{e.kind===`pairs`||e.kind===`tree`?e.channels.forEach(e=>t.push(e.stage.name)):t.push(e.stage.name)}),(e.kind===`reduce`||e.kind===`groupRuns`||e.kind===`groupSum`)&&e.sums.forEach(e=>t.push(e.name)),(e.kind===`chunks`||e.kind===`grid`)&&t.push(e.section.stage.name),(e.kind===`fireReduce`||e.kind===`fireState`)&&t.push(eh(p)),fe[e.name]=t});let pe=ce.done(),me=null;if(v.some(e=>e.sort)){let t=Object.create(null);e.columns.nodes.forEach(e=>{let n=j[e.name],i=e.width===`D`?r:e.width,a=n&&n.buffer!==`X`?{buffer:n.buffer,at:(e,t)=>`${n.buffer}[${n.offset}u + ${e}${i>1?` * ${i}u + ${t}u`:``}]`}:null;t[e.name]={width:e.width,hidden:e.hidden,ref:a}});let a=Object.create(null);if(Object.values(re).forEach(e=>{e.grouped||(a[e.name]={width:e.width,at:t=>`S[${e.offset+t}u]`})}),me=Tm({D:r,n:i,limits:n.limits,warn:n.warn,stages:v.filter(e=>e.sort).map(e=>({stage:e.stage,radius:e.radius,gate:e.gate,params:e.params,builtIns:e.builtIns,outputs:e.outputs})),columns:t,sums:a,sumBuffer:`S`,slot:{decl:e=>`@group(0) @binding(${e}) var<uniform> V: array<vec4f, ${pe.floats/4}>;`,at:Zm},pos:{buffer:`X`,at:(e,t)=>`X[${e} * ${r}u + ${t}u]`},origin:e=>ce.add(`setting`,`origin_`+e),row:I?{buffer:`H`,at:e=>`u32(H[${I.offset}u + ${e}])`}:null}),me.refusal)return{refusal:me.refusal};Object.keys(me.kernelStages).forEach(e=>{fe[e]=me.kernelStages[e]})}let he=null;if(b){let e=e=>{let t=j[e];return{buffer:t.buffer,at:e=>`${t.buffer}[${t.offset}u + ${e}]`}},t=b.channels.map(e=>e.charge),a=o.peak&&t.every(e=>j[e].buffer===`H`)?o.peak(t):void 0;if(he=Vp({D:r,n:i,limits:n.limits,warn:n.warn,peak:a,channels:b.channels.map((t,n)=>({stage:t.stage.name,law:t.law,centroid:n===0?`own`:t.centroid,charge:e(t.charge)})),pos:{buffer:`X`,at:(e,t)=>`X[${e} * ${r}u + ${t}u]`},values:{decl:e=>`@group(0) @binding(${e}) var<uniform> V: array<vec4f, ${pe.floats/4}>;`,law:(e,t)=>Zm(b.channels[e].values+t),gravity:Zm(ce.add(`setting`,`gravity`))}}),he.refusal)return{refusal:he.refusal};b.pyramid=he,Object.keys(he.kernels).forEach(e=>{fe[e]=b.channels.map(e=>e.stage.name)})}let ge=e=>{let t=j[e];return{buffer:t.buffer,at:(e,n)=>t.width===1?`${t.buffer}[${t.offset}u + ${e}]`:`${t.buffer}[${t.offset}u + ${e} * ${t.width}u + ${n}u]`}};for(let e of H){if(e.kind!==`grid`)continue;let t=e.section;if(t.grid=Yf({stage:t.stage,D:r,n:i,limits:n.limits,warn:n.warn,label:e.name,pos:{buffer:`X`,at:(e,t)=>`X[${e} * ${r}u + ${t}u]`},column:ge,values:{decl:e=>`@group(0) @binding(${e}) var<uniform> V: array<vec4f, ${pe.floats/4}>;`,at:e=>Zm(e.startsWith(`param:`)?t.params[e.slice(6)]:e.startsWith(`builtIn:`)?t.builtIns[e.slice(8)]:t.numbers[e])}}),t.grid.refusal)return{refusal:`${t.stage.name}: ${t.grid.refusal}`};Object.keys(t.grid.kernels).forEach(e=>{fe[e]=[t.stage.name]})}let _e=0;return p.forEach(e=>{e.kind===`pairs`&&(_e=Math.max(_e,r+new Set(e.channels.map(e=>e.charge)).size))}),{template:`generic`,regime:b?`pyramid`:`pairs`,permuted:F,rowColumn:I,pyramid:he,D:r,nodes:i,links:a,cap:k,capL:A,groups:ne,columns:j,linkColumns:z,groupColumns:ie,chunked:c,tables:ee,pairs:me,hostSteps:H.filter(e=>e.kind===`host`).map(e=>e.name),sums:re,sumWidth:se,S:{size:M,fire:ae,firePartials:V,partials:oe},H:{size:N},slot:pe,sections:p,skipped:m,kernelList:H,kernelStages:fe,tileFloats:_e,fire:p.some(e=>e.kind===`fire`),springs:p.some(e=>e.kind===`springs`),inertia:th(p).inertia,dataKey:JSON.stringify(o)}}function $m(e){return Math.max(256,Math.ceil(Math.ceil(e*1.25)/256)*256)}function eh(e){let t=e.find(e=>e.kind===`euler`||e.kind===`fire`);return t?t.stage.name:`integrate`}function th(e){let t=e.find(e=>e.kind===`euler`||e.kind===`fire`);return t?t.stage.args:{inertia:`mass`}}function nh(e){let t=new Set;return e.kind===`pairs`||e.kind===`tree`?(e.channels.forEach(e=>{t.add(e.charge),t.add(e.sensitivity)}),t.add(`pos`),t.add(`pinned`),t):(e.stage.reads.forEach(e=>{e.space===`nodes`&&t.add(e.column)}),(e.kind===`euler`||e.kind===`fire`)&&t.add(e.stage.args.inertia),e.kind===`springs`&&t.add(`pos`),t)}function rh(e){let t=new Set;return e.kind===`pairs`||e.kind===`tree`?(e.channels.forEach(e=>t.add(e.charge)),t.add(`pos`),t):e.kind===`springs`?(t.add(`pos`),t):(e.stage&&e.stage.reads.forEach(e=>{e.space===`nodes`&&(e.rows===`other`||e.end)&&t.add(e.column)}),t)}function ih(e){let t=new Set;return e.kind===`pairs`||e.kind===`tree`||e.kind===`springs`?(t.add(`force`),t):(e.stage.writes.forEach(e=>{e.space===`nodes`&&t.add(e.column)}),t)}function ah(e){return e.stage.reads.some(e=>e.space===`nodes`&&e.column===`pos`)}function oh(e){if(e.kind===`sum`||e.kind===`groupsum`||e.kind===`euler`||e.kind===`fire`||!e.stage)return!1;let t=e.stage;return t.writes.every(e=>e.space===`nodes`&&e.column===`force`&&e.mode===`add`)&&!t.reads.some(e=>e.space===`nodes`&&e.column===`force`)}function sh(e,t){return e.reads.some(e=>e.space===`nodes`&&t.has(e.column))}function ch(){let e=[],t=Object.create(null);return{add(n,r,i){let a=n+`:`+r+(i===void 0?``:`:`+i);return t[a]===void 0&&(t[a]=e.length,e.push({kind:n,stage:r,name:i,index:e.length})),t[a]},addLaw(n,r){let i=`law:`+n;if(t[i]!==void 0)return t[i];let a=e.length;t[i]=a;let o=lh(r);for(let t=0;t<o;t++)e.push({kind:`law`,stage:n,name:t,index:e.length});return a},done(){let t=Math.max(Ym,Math.ceil(e.length/Ym)*Ym);return{entries:e,floats:t,bytes:t*4}}}}function lh(e){let t=Object.keys(e.values).filter(e=>/^\$h\d+$/.test(e)).length;return e.paramNames.length+t+ +!!e.hasRange}var uh=`xyzw`;function dh(e){return`struct Params { n: u32, groups: u32, fireGroups: u32, links: u32 };
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<uniform> V: array<vec4f, ${e.slot.floats/4}>;
@group(0) @binding(2) var<storage, read_write> S: array<f32>;
@group(0) @binding(3) var<storage, read> H: array<f32>;
@group(0) @binding(4) var<storage, read> L: array<u32>;
@group(0) @binding(5) var<storage, read> X: array<f32>;
@group(0) @binding(6) var<storage, read_write> Y: array<f32>;
${(e.tables||[]).map(fh).join(``)}`}function fh(e){let t=e.values.length-1,n=t/(e.to-e.from),r=t=>`H[${$(e.offset)} + ${t}]`,i=`let q = (x - ${ph(e.from)}) * ${ph(n)};`;return`fn table_${e.id}(x: f32) -> f32 {
  ${i}
  if (!(q > 0.0)) { return ${r(`0u`)}; }
  if (q >= ${ph(t)}) { return ${r($(t))}; }
  let k = u32(q);
  let a = ${r(`k`)};
  return a + (${r(`k + 1u`)} - a) * (q - f32(k));
}
fn slope_${e.id}(x: f32) -> f32 {
  ${i}
  if (!(q > 0.0) || q >= ${ph(t)}) { return 0.0; }
  let k = u32(q);
  return (${r(`k + 1u`)} - ${r(`k`)}) * ${ph(n)};
}
`}function ph(e){let t=String(Math.fround(e));return/^-?\d+$/.test(t)?t+=`.0`:/e/.test(t)&&!/\./.test(t)&&(t=t.replace(`e`,`.0e`)),e<0?`(`+t+`)`:t}function mh(e,t){if(!t)return e;let n=`(\\(?[^()]*\\)?)`;return e.replace(RegExp(`\\(lawFunctions\\.(\\w+)\\.derivative \\? lawFunctions\\.\\w+\\.derivative\\(${n}\\) : 0\\)`,`g`),(e,n,r)=>`slope_${t[n]}(${r})`).replace(RegExp(`lawFunctions\\.(\\w+)\\.value\\(${n}\\)`,`g`),(e,n,r)=>`table_${t[n]}(${r})`)}var hh=[`uniform`,`dynamic`,`storage`,`read`,`read`,`read`,`storage`],gh=hh.concat([`uniform`,`read`,`read`,`read`]);function _h(e){return e.tree?gh:hh}var vh=`P.n + 1u`,yh=`P.n + 1u + 2u * P.links`,bh=`P.n + 1u + 4u * P.links`,xh=`P.n + 1u + 5u * P.links`,Sh=`P.n + 1u + 6u * P.links`,Ch=`P.n + 1u + 7u * P.links`;function $(e){return e+`u`}function wh(e,t,n,r){let i=e.columns[t],a=[];for(let e=0;e<i.width;e++){let t=i.width===1?`${$(i.offset)} + ${n}`:`${$(i.offset)} + ${n} * ${$(i.width)} + ${$(e)}`,o=i.buffer===`X`?r?`Y`:`X`:i.buffer;a.push(`${o}[${t}]`)}return a}function Th(e,t,n,r){let i=e.linkColumns[t];return i.order===`csr`?`H[${$(i.offset)} + ${r}]`:`S[${$(i.offset)} + ${n}]`}function Eh(e,t,n){return n===1?`c_${e}`:`c_${e}_${t}`}function Dh(e,t){let n=e.columns[t].width,r=[];for(let e=0;e<n;e++)r.push(Eh(t,e,n));return r}function Oh(e){return e.slot.entries.filter(e=>e.kind===`setting`).map(e=>`  let s_${e.stage} = ${Zm(e.index)};`).join(`
`)}function kh(e,t,n){return e.count?`select(0.0, S[${`${$(e.offset)} + min(u32(max(floor(${t}), 0.0)), ${$(e.count-1)}) * ${$(e.width)} + ${$(n)}`}], ${t} >= 0.0 && ${t} < ${e.count}.0)`:`0.0`}function Ah(e,t,n={space:`node`}){let r=e.D,i=n.space,a=e=>e.length===1?{type:`num`,code:e[0]}:{type:`vec`,codes:e};return{D:r,name(n){if(i!==`node`){let e=o(n);if(e)return e}let r=e.columns[n];if(i===`node`&&n===`pos`)return{type:`vec`,codes:Dh(e,`pos`).map((e,t)=>`(${e} + s_origin_${t})`),write:null};if(i===`node`&&r){let t=Dh(e,n),i=(e,n)=>{let r=n.codes||[n.code];return t.map((t,n)=>`${t} ${e} ${r[n]};`)};return r.width===1?{type:`num`,code:t[0],write:i}:{type:`vec`,codes:t,write:i}}if(t.params&&t.params[n]!==void 0)return{type:`num`,code:Zm(t.params[n])};if(t.tables&&t.tables[n]!==void 0)return{call:e=>`table_${t.tables[n]}(${e[0]})`};let s=e.sums[n];if(s&&s.grouped)return{index:e=>a(Array.from({length:s.width},(t,n)=>kh(s,e,n)))};if(s)return a(Array.from({length:s.width},(e,t)=>`g_${n}_${t}`));if(t.builtIns&&t.builtIns[n]!==void 0)return{type:`num`,code:Zm(t.builtIns[n])}}};function o(t){if(t===`r`)return{type:`num`,code:`lr`};if(t===`pull`&&i===`gather`)return{type:`num`,code:`lpull`,write:(e,t)=>[`lpull ${e} ${t.code};`]};if(t===`length`||t===`coefficient`){let e=t===`length`?`select(lw_length, s_springLength, lw_length < 0.0)`:`select(lw_coefficient, s_springCoefficient, lw_coefficient <= 0.0)`,r=i===`link`?(r,i)=>(n.written.add(t),[`lw_${t} = ${i.code};`,`lk_${t} = ${e};`]):null;return{type:`num`,code:`lk_`+t,write:r}}if(e.linkColumns[t]){let e=i===`link`?(e,r)=>(n.written.add(t),[`lk_${t} ${e} ${r.code};`]):null;return{type:`num`,code:`lk_`+t,write:e}}let o=/^(.+)_([ij])$/.exec(t);if(!o||!e.columns[o[1]])return;let s=o[2]===`i`;if(i===`link`){let t=s?`li`:`lj`,n=o[1]===`pos`?Array.from({length:r},(e,n)=>`(X[${t} * ${$(r)} + ${$(n)}] + s_origin_${n})`):wh(e,o[1],t,!1);return a(n)}let c=o[1]===`pos`?Dh(e,`pos`):Dh(e,o[1]),l=c.map(e=>`o`+e.slice(1)),u=s?`isFrom`:`!isFrom`,d=c.map((e,t)=>`select(${l[t]}, ${e}, ${u})`);o[1]===`pos`&&(d=d.map((e,t)=>`(${e} + s_origin_${t})`));let f=(e,t)=>{let n=t.codes||[t.code];return[`if (${u}) { ${c.map((t,r)=>`${t} ${e} ${n[r]};`).join(` `)} }`]};return d.length===1?{type:`num`,code:d[0],write:f}:{type:`vec`,codes:d,write:f}}}function jh(e){return`fn nudgeAxis(a: u32, b: u32, k: u32) -> f32 {
  var h = min(a, b) * 747796405u + max(a, b) * 2891336453u + k * 1013904223u + 1u;
  h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = ((h >> 16u) ^ h) * 0x45d9f3bu; h = (h >> 16u) ^ h;
  return f32(h) * (2.0 / 4294967296.0) - 1.0;
}
fn nudge(a: u32, b: u32, k: u32) -> f32 {
  var norm = 0.0;
  for (var axis = 0u; axis < ${$(e)}; axis++) { let x = nudgeAxis(a, b, axis); norm += x * x; }
  let x = select(nudgeAxis(a, b, k), select(0.0, 1.0, k == 0u), norm == 0.0);
  return select(-0.01, 0.01, a < b) * x / select(sqrt(norm), 1.0, norm == 0.0);
}`}var Mh=256;function Nh(e,t,n){let r=[];if((t.kind===`springs`?[]:t.stage.args.startAtZero||[]).forEach(t=>Dh(e,t).forEach(e=>r.push(`${e} = 0.0;`))),r.push(`if (live) {`),t.chunks){let{offset:n,width:i,parts:a}=t.chunks,o=[];a.forEach(t=>Dh(e,t.column).forEach(e=>o.push(e))),r.push(`  let cb = L[${Ch}];`),r.push(`  let cFirst = L[cb + 1u + row];`),r.push(`  `+o.map((e,t)=>`var ct${t} = 0.0; var cs${t} = 0.0;`).join(` `)),r.push(`  for (var c = cFirst; c < L[cb + 2u + row]; c++) {`),r.push(`    `+o.map((e,t)=>`cs${t} += S[${$(n)} + c * ${$(i)} + ${$(t)}];`).join(` `)),r.push(`    if (((c - cFirst) & ${$(15)}) == ${$(15)}) { ${o.map((e,t)=>`ct${t} += cs${t}; cs${t} = 0.0;`).join(` `)} }`),r.push(`  }`),r.push(`  `+o.map((e,t)=>`${e} += ct${t} + cs${t};`).join(` `))}else r.push(`  for (var e = L[row]; e < L[row + 1u]; e++) {`),Fh(e,t,n).forEach(e=>r.push(`    `+e)),r.push(`  }`);return r.push(`}`),r}function Ph(e,t,n){let r=t.section,{offset:i,width:a,parts:o}=r.chunks,s=[dh(e),jh(e.D)];s.push(`@compute @workgroup_size(256)`),s.push(`fn main(@builtin(global_invocation_id) gid: vec3u) {`),s.push(`  let cb = L[${Ch}];`),s.push(`  let chunks = L[cb];`),s.push(`  let c = gid.x;`),s.push(`  if (c >= chunks) { return; }`),s.push(`  let row = L[cb + 2u + P.n + c];`),s.push(`  let first = L[cb + 2u + P.n + chunks + c];`),s.push(`  let last = min(first + ${$(8)}, L[row + 1u]);`),s.push(Oh(e)),r.gate!==void 0&&s.push(`  if (${Zm(r.gate)} == 0.0) { return; }`);let c=new Set(o.map(e=>e.column)),l=new Set([`pos`]);r.kind===`gather`&&r.stage.reads.forEach(t=>{t.space===`nodes`&&e.columns[t.column]&&l.add(t.column)}),l.forEach(t=>{if(c.has(t))return;let n=wh(e,t,`row`,!1);Dh(e,t).forEach((e,t)=>s.push(`  let ${e} = ${n[t]};`))}),c.forEach(t=>Dh(e,t).forEach(e=>s.push(`  var ${e} = 0.0;`))),s.push(`  for (var e = first; e < last; e++) {`),Fh(e,r,n).forEach(e=>s.push(`    `+e)),s.push(`  }`);let u=0;return o.forEach(t=>{Dh(e,t.column).forEach(e=>{s.push(`  S[${$(i)} + c * ${$(a)} + ${$(u)}] = ${e};`),u++})}),s.push(`}`),s.join(`
`)+`
`}function Fh(e,t,n){let r=e.D,i=Dh(e,`pos`),a=Dh(e,`force`),o=Array.from({length:r},(e,t)=>t),s=t.kind===`springs`,c=t.stage,l=s||t.pulls,u=[`let j = L[${vh} + e];`],d=!s||t.own;d&&(u.push(`let lrole = L[${yh} + e];`),u.push(`let s = lrole & 0x7fffffffu;`),u.push(`let isFrom = (lrole >> 31u) == 0u;`)),u.push(o.map(e=>`var dm${e} = X[j * ${$(r)} + ${$(e)}] - ${i[e]};`).join(` `)),u.push(`var lr = sqrt(${o.map(e=>`dm${e} * dm${e}`).join(` + `)});`);let f=d?`select(1.0, select(-1.0, 1.0, isFrom), j == row) * `:``;if(l&&u.push(`if (lr == 0.0) { ${o.map(e=>`dm${e} = ${f}nudge(row, j, ${$(e)});`).join(` `)} lr = sqrt(${o.map(e=>`dm${e} * dm${e}`).join(` + `)}); }`),u.push(...Ih(e,c,s,`s`,`e`)),s)u.push(`let lpull = lk_coefficient * (lr - lk_length);`);else{c.reads.forEach(t=>{if(t.space!==`nodes`||!t.end||t.column===`pos`||!e.columns[t.column])return;let n=wh(e,t.column,`j`,!1);Dh(e,t.column).forEach((e,t)=>{let r=`let o${e.slice(1)} = ${n[t]};`;u.indexOf(r)<0&&u.push(r)})}),u.push(o.map(e=>`let o_pos_${e} = X[j * ${$(r)} + ${$(e)}];`).join(` `)),l&&u.push(`var lpull = 0.0;`);let i=Bu.compile(c.formula,Ah(e,t,{space:`gather`}),n);u.push(...i.lines)}return l&&(u.push(d?`let kp = lpull / lr;`:`let kp = select(lpull / lr, 0.0, j == row);`),u.push(o.map(e=>`${a[e]} += kp * dm${e};`).join(` `))),u}function Ih(e,t,n,r,i){let a=[];return[`length`,`coefficient`].forEach(t=>{let n=t===`length`?`s_springLength`:`s_springCoefficient`;e.linkColumns[t]?(a.push(`var lw_${t} = ${Th(e,t,r,i)};`),a.push(`var lk_${t} = select(lw_${t}, ${n}, lw_${t} ${t===`length`?`< 0.0`:`<= 0.0`});`)):a.push(`var lk_${t} = ${n};`)}),n||t.reads.forEach(t=>{if(t.space!==`links`||t.column===`length`||t.column===`coefficient`||!e.linkColumns[t.column])return;let n=`var lk_${t.column} = ${Th(e,t.column,r,i)};`;a.indexOf(n)<0&&a.push(n)}),a}function Lh(e,t,n){let r=e.D,i=t.stage,a=Dh(e,`force`),o=(t,n)=>Dh(e,t)[n];if(t.sort)return e.pairs.section(i.name).code({force:a,local:o,row:`row`});let s=Object.create(null);Object.values(e.columns).forEach(e=>{s[e.name]={width:e.width>1?`D`:1}});let c=Yp(i,{D:r,printer:n,columns:s,force:e=>`pairForce${e}`,read(t,n,i){return t===`pos`?n===`me`?`(${o(`pos`,i)} + s_origin_${i})`:`(X[j * ${$(r)} + ${$(i)}] + s_origin_${i})`:n===`me`?o(t,i):wh(e,t,`j`,!1)[i]},param:e=>Zm(t.params[e]),builtIn:e=>Zm(t.builtIns[e]),sumWidth:t=>e.sums[t]&&!e.sums[t].grouped?e.sums[t].width:0,sum:(e,t)=>`g_${e}_${t}`}),l=[],u=Array.from({length:r},(e,t)=>t);c.accumulators.forEach(t=>{t.startAtZero&&Dh(e,t.column).forEach(e=>l.push(`${e} = 0.0;`))}),l.push(`{ let pairRadius = ${Zm(t.radius)};`),l.push(`if (live && pairRadius > 0.0) {`);let d=[];return c.accumulators.forEach(e=>{for(let t=0;t<e.width;t++)d.push({name:Zp(e.column,t,e.width),local:o(e.column,t)})}),d.forEach(e=>l.push(`  var ${e.name}_total = 0.0;`)),l.push(`  for (var tile = 0u; tile < P.n; tile += ${$(Mh)}) {`),l.push(`    `+u.map(e=>`var pairForce${e} = 0.0;`).concat(d.map(e=>`var ${e.name} = 0.0;`)).join(` `)),l.push(`    let tileEnd = min(tile + ${$(Mh)}, P.n);`),l.push(`    for (var j = tile; j < tileEnd; j++) {`),l.push(`      `+u.map(e=>`let d${e} = ${o(`pos`,e)} - X[j * ${$(r)} + ${$(e)}];`).join(` `)),l.push(`      let pairR2 = ${u.map(e=>`d${e} * d${e}`).join(` + `)};`),Xp(c,{D:r,me:`row`,other:`j`,r2:`pairR2`,radius:`pairRadius`,force:e=>`pairForce${e}`}).forEach(e=>l.push(`      `+e)),l.push(`    }`),l.push(`    `+u.map(e=>`${a[e]} += pairForce${e};`).concat(d.map(e=>`${e.name}_total += ${e.name};`)).join(` `)),l.push(`  }`),d.forEach(e=>l.push(`  ${e.local} += ${e.name}_total;`)),l.push(`} }`),l}function Rh(e,t,n){let r=e.D,i=Array.from({length:r},(e,t)=>t),a=[dh(e)];return a.push(`@compute @workgroup_size(256)`),a.push(`fn main(@builtin(global_invocation_id) gid: vec3u) {`),a.push(`  let s = gid.x;`),a.push(`  let live = s < P.links;`),a.push(`  let sl = select(0u, s, live);`),a.push(`  let li = L[${xh} + sl];`),a.push(`  let lj = L[${Sh} + sl];`),a.push(`  let e = L[${bh} + sl];`),a.push(Oh(e)),t.sections.forEach(t=>{let o=t.stage,s=new Set,c=[];o.reads.some(e=>e.space===`nodes`&&e.column===`pos`)&&(c.push(i.map(e=>`let d${e} = X[lj * ${$(r)} + ${$(e)}] - X[li * ${$(r)} + ${$(e)}];`).join(` `)),c.push(`let lr = sqrt(${i.map(e=>`d${e} * d${e}`).join(` + `)});`)),c.push(...Ih(e,o,!1,`sl`,`e`)),o.writes.forEach(t=>{if(t.space!==`links`||t.column===`length`||t.column===`coefficient`)return;let n=`var lk_${t.column} = ${Th(e,t.column,`sl`,`e`)};`;c.indexOf(n)<0&&c.push(n)});let l=Bu.compile(o.formula,Ah(e,t,{space:`link`,written:s}),n);c.push(...l.lines);let u=[...s].map(t=>`S[${$(e.linkColumns[t].offset)} + s] = ${t===`length`||t===`coefficient`?`lw_`:`lk_`}${t};`);u.length&&c.push(`if (live) { ${u.join(` `)} }`),a.push(`  // ${o.name}`);let d=t.gate===void 0?`true`:Zm(t.gate)+` != 0.0`;a.push(`  if (${d}) {`),c.forEach(e=>a.push(`    `+e)),a.push(`  }`)}),a.push(`}`),a.join(`
`)+`
`}function zh(e,t,n,r){let i=n.stage,a=e.sums[i.name],o=Bu.compile(i.formula,Ah(e,n),r),s=o.result,c=s.codes||[s.code],l=o.lines.slice();return l.push(`if (live) { ${c.map((e,t)=>`S[${$(a.rows)} + row * ${$(a.width)} + ${$(t)}] = ${e};`).join(` `)} }`),[`{`].concat(l.map(e=>`  `+e),[`}`])}function Bh(e){let t=e.sums[0].block;return[`  let base = L[${Ch} + ${$(t+1)}];`,`  let runs = L[base];`,`  let count = L[base + 1u];`,`  let rows = L[base + 2u];`]}function Vh(e,t){let n=[dh(e),`@compute @workgroup_size(256)`,`fn main(@builtin(global_invocation_id) gid: vec3u) {`];return n.push(...Bh(t)),n.push(`  let run = gid.x;`),n.push(`  if (run >= runs) { return; }`),n.push(`  let first = L[base + 3u + rows + run];`),n.push(`  let last = L[base + 3u + rows + run + 1u];`),t.sums.forEach((e,t)=>{for(let r=0;r<e.width;r++)n.push(`  var a${t}_${r} = 0.0;`)}),n.push(`  for (var t = first; t < last; t++) {`),n.push(`    let row = L[base + 3u + t];`),t.sums.forEach((e,t)=>{for(let r=0;r<e.width;r++)n.push(`    a${t}_${r} += S[${$(e.rows)} + row * ${$(e.width)} + ${$(r)}];`)}),n.push(`  }`),t.sums.forEach((e,t)=>{for(let r=0;r<e.width;r++)n.push(`  S[${$(e.runs)} + run * ${$(e.width)} + ${$(r)}] = a${t}_${r};`)}),n.push(`}`),n.join(`
`)+`
`}function Hh(e,t){let n=[dh(e),`@compute @workgroup_size(256)`,`fn main(@builtin(global_invocation_id) gid: vec3u) {`];return n.push(...Bh(t)),n.push(`  let g = gid.x;`),n.push(`  if (g >= count) { return; }`),n.push(`  let first = L[base + 4u + rows + runs + g];`),n.push(`  let last = L[base + 4u + rows + runs + g + 1u];`),t.sums.forEach((e,r)=>{let i=t.gates[r];n.push(`  if (${i===void 0?`true`:Zm(i)+` != 0.0`}) {`);for(let t=0;t<e.width;t++)n.push(`    var a${t} = 0.0;`);n.push(`    for (var run = first; run < last; run++) {`);for(let t=0;t<e.width;t++)n.push(`      a${t} += S[${$(e.runs)} + run * ${$(e.width)} + ${$(t)}];`);n.push(`    }`);for(let t=0;t<e.width;t++)n.push(`    S[${$(e.offset)} + g * ${$(e.width)} + ${$(t)}] = a${t};`);n.push(`  }`)}),n.push(`}`),n.join(`
`)+`
`}function Uh(e,t=Ku){let n={};return e.kernelList.forEach(r=>{r.kind===`node`?n[r.name]=Wh(e,r,t):r.kind===`link`?n[r.name]=Rh(e,r,t):r.kind===`chunks`?n[r.name]=Ph(e,r,t):r.kind===`groupRuns`?n[r.name]=Vh(e,r):r.kind===`groupSum`?n[r.name]=Hh(e,r):r.kind===`reduce`?n[r.name]=eg(e,r):r.kind===`fireReduce`?n[r.name]=tg(e):r.kind===`fireState`&&(n[r.name]=ng(e))}),n}function Wh(e,t,n){let r=e.D,i=new Set,a=new Set,o=!1;t.sections.forEach(t=>{nh(t).forEach(t=>{e.columns[t]&&i.add(t)}),ih(t).forEach(t=>{e.columns[t]&&(i.add(t),a.add(t))}),(t.kind===`euler`||t.kind===`fire`)&&(o=!0)});let s=t.sections.some(e=>e.kind===`pairs`),c=[],l=[dh(e)];if(s)for(let t=0;t<Math.ceil(e.tileFloats/4);t++)l.push(`var<workgroup> tile${t}: array<vec4f, 256>;`);if(t.sums.length&&l.push(`var<workgroup> red: array<vec4f, 256>;`),l.push(jh(r)),t.tree){let e=t.tree.pyramid.section;l.push(e.uniform.struct,e.uniform.decl(hh.length)),e.bindings.forEach((e,t)=>l.push(`@group(0) @binding(${hh.length+1+t}) var<storage, ${e.access}> ${e.name}: ${e.type};`)),l.push(e.declarations)}c.push(`@compute @workgroup_size(256)`),c.push(`fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u) {`),t.tree?(c.push(`  let t = gid.x;`),c.push(`  let live = t < P.n;`),c.push(`  var i = 0u;`),c.push(`  if (live) { i = ${t.tree.pyramid.section.row(`t`)}; }`),c.push(`  let row = i;`)):(c.push(`  let i = gid.x;`),c.push(`  let live = i < P.n;`),c.push(`  let row = select(0u, i, live);`)),c.push(Oh(e)),i.forEach(n=>{let r=wh(e,n,`row`,t.afterIntegrate),i=a.has(n)||n===`pos`?`var`:`let`;Dh(e,n).forEach((e,t)=>c.push(`  ${i} ${e} = ${r[t]};`))});let u=new Set;if(t.sections.forEach(e=>{e.stage&&e.stage.sums&&e.stage.sums.forEach(e=>u.add(e))}),u.forEach(t=>{let n=e.sums[t];if(!n.grouped)for(let e=0;e<n.width;e++)c.push(`  let g_${t}_${e} = S[${$(n.offset+e)}];`)}),t.sums.forEach((e,t)=>{for(let n=0;n<e.width;n++)c.push(`  var sv${t}_${n} = 0.0;`)}),t.sections.forEach((r,i)=>{c.push(`  // ${r.kind}${r.stage?`: `+r.stage.name:``}`),c.push(Gh(e,t,r,i,n).map(e=>`  `+e).join(`
`))}),t.sums.length&&c.push($h(e,t)),c.push(`  if (live) {`),a.forEach(t=>{let n=e.columns[t];if(n.buffer===`H`)return;let r=wh(e,t,`i`,!0);Dh(e,t).forEach((e,t)=>c.push(`    ${n.buffer,r[t]} = ${e};`))}),o&&!a.has(`pos`)){let t=wh(e,`pos`,`i`,!0);Dh(e,`pos`).forEach((e,n)=>c.push(`    ${t[n]} = ${e};`))}return c.push(`  }`),c.push(`}`),l.join(`
`)+`
`+c.join(`
`)+`
`}function Gh(e,t,n,r,i){let a=Kh(e,t,n,r,i);return n.gate===void 0||n.kind===`pairs`||n.kind===`tree`||n.kind===`pairformula`&&n.sort?a:[`if (${Zm(n.gate)} != 0.0) {`].concat(a.map(e=>`  `+e),[`}`])}function Kh(e,t,n,r,i){let a=e.D,o=e=>{let t=[];for(let n=0;n<a;n++)t.push(e(n));return t},s=Dh(e,`pos`),c=Dh(e,`velocity`),l=Dh(e,`force`);switch(n.kind){case`clear`:return[`if (c_pinned == 0.0) { ${l.map(e=>e+` = 0.0;`).join(` `)} }`];case`drag`:return[`if (c_pinned == 0.0) { ${l.map((e,t)=>`${e} -= s_dragCoefficient * ${c[t]};`).join(` `)} }`];case`springs`:case`gather`:return Nh(e,n,i);case`groupsum`:return zh(e,t,n,i);case`pairformula`:return Lh(e,n,i);case`pairs`:return qh(e,n,r,s,l,i);case`tree`:return Jh(n,l);case`formula`:return[`{`].concat(Zh(e,n,r,i).map(e=>`  `+e),[`}`]);case`sum`:return Qh(e,t,n,r,i);case`euler`:case`fire`:{let t=e.columns[n.stage.args.inertia]?Eh(n.stage.args.inertia,0,1):`c_mass`,r=[`if (c_pinned == 0.0) {`];return n.kind===`fire`&&(r.push(`  let fireCv = S[${$(e.S.fire+2)}]; let fireCf = S[${$(e.S.fire+3)}];`),r.push(`  `+o(e=>`${c[e]} = fireCv * ${c[e]} + fireCf * ${l[e]};`).join(` `))),r.push(`  let coeff = s_timeStep / ${t};`),r.push(`  `+o(e=>`${c[e]} += coeff * ${l[e]};`).join(` `)),r.push(`  let speed = sqrt(${c.map(e=>e+` * `+e).join(` + `)});`),r.push(`  if (speed > s_maxVelocity) { ${o(e=>`${c[e]} = s_maxVelocity * ${c[e]} / speed;`).join(` `)} }`),r.push(`  `+o(e=>`${s[e]} += s_timeStep * ${c[e]};`).join(` `)),r.push(`}`),r}}throw Error(`unknown section `+n.kind)}function qh(e,t,n,r,i,a){let o=e.D,s=[];t.channels.forEach(e=>{s.indexOf(e.charge)<0&&s.push(e.charge)});let c=e=>({array:e>>2,axis:uh[e&3]}),l=e=>`b${e>>2}.${uh[e&3]}`,u=Math.ceil((o+s.length)/4),d=Array.from({length:o},(e,t)=>t),f=[`{`];t.channels.forEach((e,t)=>{e.law&&f.push(`  `+Xh(td(e.law,t=>Zm(e.values+t)),t)),d.forEach(e=>f.push(`  var w${t}_${e} = 0.0;`))}),f.push(`  var same = 0u;`),f.push(`  for (var t = 0u; t < P.n; t += ${$(256)}) {`),f.push(`    let j = t + li;`);for(let e=0;e<u;e++)f.push(`    var e${e} = vec4f(0.0);`);f.push(`    if (j < P.n) {`),d.forEach(e=>{let t=c(e);f.push(`      e${t.array}.${t.axis} = X[j * ${$(o)} + ${$(e)}];`)}),s.forEach((t,n)=>{let r=c(o+n);f.push(`      e${r.array}.${r.axis} = ${wh(e,t,`j`,!1)[0]};`)}),f.push(`    }`);for(let e=0;e<u;e++)f.push(`    tile${e}[li] = e${e};`);f.push(`    workgroupBarrier();`),t.channels.forEach((e,t)=>d.forEach(e=>f.push(`    var u${t}_${e} = 0.0;`))),f.push(`    for (var k = 0u; k < ${$(256)}; k++) {`);for(let e=0;e<u;e++)f.push(`      let b${e} = tile${e}[k];`);d.forEach(e=>f.push(`      let d${e} = ${l(e)} - ${r[e]};`)),f.push(`      let r2 = ${d.map(e=>`d${e} * d${e}`).join(` + `)};`),f.push(`      let near = r2 == 0.0;`),f.push(`      same += select(0u, 1u, near);`),Yh(e,t,s,l,`select(r2, 1.0, near)`,a,`u`).forEach(e=>f.push(`      `+e)),f.push(`    }`),t.channels.forEach((e,t)=>f.push(`    `+d.map(e=>`w${t}_${e} += u${t}_${e};`).join(` `))),f.push(`    workgroupBarrier();`),f.push(`  }`),f.push(`  if (live && same > 1u) {`),f.push(`    for (var j = 0u; j < P.n; j++) {`),f.push(`      if (j == i || ${d.map(e=>`X[j * ${$(o)} + ${$(e)}] != ${r[e]}`).join(` || `)}) { continue; }`),d.forEach(e=>f.push(`      let d${e} = nudge(row, j, ${$(e)});`)),f.push(`      let r2 = ${d.map(e=>`d${e} * d${e}`).join(` + `)};`);let p=s.map(t=>wh(e,t,`j`,!1)[0]);return Yh(e,t,s,e=>p[e-o],`r2`,a,`w`).forEach(e=>f.push(`      `+e)),f.push(`    }`),f.push(`  }`),f.push(`  if (c_pinned == 0.0) {`),t.channels.forEach((e,t)=>{let n=Eh(e.sensitivity,0,1);f.push(`    let g${t} = s_gravity * ${n};`),f.push(`    `+d.map(e=>`${i[e]} += g${t} * w${t}_${e};`).join(` `))}),f.push(`  }`),f.push(`}`),f}function Jh(e,t){return[`if (live && c_pinned == 0.0) ${e.pyramid.section.code({t:`t`,i:`row`,force:t,sensitivity:t=>{let n=e.channels[t],r=n.sensitivity===n.charge,i=r?`tree_charge(tk, ${$(t)})`:Eh(n.sensitivity,0,1);return n.gate===void 0?r?null:i:`select(0.0, ${i}, ${Zm(n.gate)} != 0.0)`}})}`]}function Yh(e,t,n,r,i,a,o){let s=e.D,c=[`let rr = ${i};`];return t.channels.some(e=>e.law)&&c.push(`let r = sqrt(rr);`),t.channels.some(e=>!e.law)&&c.push(`let inverseCube = 1.0 / (rr * sqrt(rr));`),t.channels.forEach((e,t)=>{let i=r(s+n.indexOf(e.charge)),l=e=>Array.from({length:s},(n,r)=>`${o}${t}_${r} += (${i} * ${e}) * d${r};`).join(` `),u;if(!e.law)u=l(`inverseCube`);else{let n=mh(Xh(Zu(e.law,s,`r`,`k`+t,void 0,a),t),e.tables);u=e.law.hasRange?`if (rr <= law${t}Range2) { ${n} ${l(`k`+t)} }`:`{ ${n} ${l(`k`+t)} }`}c.push(e.gate===void 0?u:`if (${Zm(e.gate)} != 0.0) { ${u} }`)}),c}function Xh(e,t){return e.replace(/\blaw_(\w+)/g,`law${t}_$1`).replace(/\blawH(\d+)\b/g,`law${t}H$1`).replace(/\blawRange2\b/g,`law${t}Range2`)}function Zh(e,t,n,r){let i=t.stage;return Bu.compile(i.formula,Ah(e,t),r).lines}function Qh(e,t,n,r,i){let a=n.stage,o=Bu.compile(a.formula,Ah(e,n),i),s=o.result,c=s.codes||[s.code],l=t.sums.indexOf(e.sums[a.name]),u=o.lines.slice();return c.forEach((e,t)=>u.push(`sv${l}_${t} = select(0.0, ${e}, live);`)),[`{`].concat(u.map(e=>`  `+e),[`}`])}function $h(e,t){let n=[];t.sums.forEach((e,t)=>{for(let r=0;r<e.width;r++)n.push(`sv${t}_${r}`)});let r=n.length,i=[];for(let t=0;t<r;t+=4){let a=n.slice(t,t+4);for(;a.length<4;)a.push(`0.0`);i.push(`  red[li] = vec4f(${a.join(`, `)});`),i.push(`  workgroupBarrier();`),i.push(`  for (var s = ${$(128)}; s > 0u; s >>= 1u) {`),i.push(`    if (li < s) { red[li] += red[li + s]; }`),i.push(`    workgroupBarrier();`),i.push(`  }`);let o=[];for(let n=0;n<Math.min(4,r-t);n++)o.push(`S[${$(e.S.partials)} + wid.x * ${$(r)} + ${$(t+n)}] = red[0].${uh[n]};`);i.push(`  if (li == 0u) { ${o.join(` `)} }`),i.push(`  workgroupBarrier();`)}return i.join(`
`)}function eg(e,t){let n=[];t.sums.forEach((e,r)=>{for(let i=0;i<e.width;i++)n.push({at:e.offset+i,gate:t.gates[r]})});let r=n.length,i=[dh(e),`var<workgroup> red: array<vec4f, 256>;`];i.push(`@compute @workgroup_size(256)`),i.push(`fn main(@builtin(local_invocation_index) li: u32) {`);for(let t=0;t<r;t+=4){let a=Math.min(4,r-t);i.push(`  {`),i.push(`    var acc = vec4f(0.0);`),i.push(`    for (var w = li; w < P.groups; w += ${$(256)}) {`);for(let n=0;n<a;n++)i.push(`      acc.${uh[n]} += S[${$(e.S.partials)} + w * ${$(r)} + ${$(t+n)}];`);i.push(`    }`),i.push(`    red[li] = acc;`),i.push(`    workgroupBarrier();`),i.push(`    for (var s = ${$(128)}; s > 0u; s >>= 1u) {`),i.push(`      if (li < s) { red[li] += red[li + s]; }`),i.push(`      workgroupBarrier();`),i.push(`    }`);let o=[];for(let e=0;e<a;e++){let r=n[t+e],i=`S[${$(r.at)}] = red[0].${uh[e]};`;o.push(r.gate===void 0?i:`if (${Zm(r.gate)} != 0.0) { ${i} }`)}i.push(`    if (li == 0u) { ${o.join(` `)} }`),i.push(`    workgroupBarrier();`),i.push(`  }`)}return i.push(`}`),i.join(`
`)+`
`}function tg(e){let t=e.D,n=wh(e,`force`,`r`,!1),r=wh(e,`velocity`,`r`,!1),i=wh(e,`pinned`,`r`,!1)[0],a=[dh(e),`var<workgroup> red: array<vec4f, 256>;`];a.push(`@compute @workgroup_size(256)`),a.push(`fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32, @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {`),a.push(`  var acc = vec4f(0.0);`),a.push(`  for (var r = gid.x; r < P.n; r += nwg.x * ${$(256)}) {`),a.push(`    if (${i} != 0.0) { continue; }`);for(let e=0;e<t;e++)a.push(`    let f${e} = ${n[e]}; let v${e} = ${r[e]};`);let o=e=>Array.from({length:t},(t,n)=>e(n)).join(` + `);return a.push(`    acc += vec4f(${o(e=>`f${e} * v${e}`)}, ${o(e=>`v${e} * v${e}`)}, ${o(e=>`f${e} * f${e}`)}, 0.0);`),a.push(`  }`),a.push(`  red[li] = acc;`),a.push(`  workgroupBarrier();`),a.push(`  for (var s = ${$(128)}; s > 0u; s >>= 1u) {`),a.push(`    if (li < s) { red[li] += red[li + s]; }`),a.push(`    workgroupBarrier();`),a.push(`  }`),a.push(`  if (li == 0u) { ${[0,1,2,3].map(t=>`S[${$(e.S.firePartials)} + wid.x * 4u + ${$(t)}] = red[0].${uh[t]};`).join(` `)} }`),a.push(`}`),a.join(`
`)+`
`}function ng(e){let t=e.S.fire,n=[dh(e),`var<workgroup> red: array<vec4f, 256>;`];return n.push(`@compute @workgroup_size(256)`),n.push(`fn main(@builtin(local_invocation_index) li: u32) {`),n.push(`  var acc = vec4f(0.0);`),n.push(`  for (var w = li; w < P.fireGroups; w += ${$(256)}) { acc += vec4f(${[0,1,2,3].map(t=>`S[${$(e.S.firePartials)} + w * 4u + ${$(t)}]`).join(`, `)}); }`),n.push(`  red[li] = acc;`),n.push(`  workgroupBarrier();`),n.push(`  for (var s = ${$(128)}; s > 0u; s >>= 1u) {`),n.push(`    if (li < s) { red[li] += red[li + s]; }`),n.push(`    workgroupBarrier();`),n.push(`  }`),n.push(`  if (li == 0u) {`),n.push(`    let sum = red[0];`),n.push(`    let a = S[${$(t)}];`),n.push(`    if (sum.x > 0.0) {`),n.push(`      var cf = 0.0;`),n.push(`      if (sum.z > 0.0) { cf = a * sqrt(sum.y) / sqrt(sum.z); }`),n.push(`      let steps = S[${$(t+1)}] + 1.0;`),n.push(`      S[${$(t)}] = select(a, a * 0.99, steps > 5.0); S[${$(t+1)}] = steps; S[${$(t+2)}] = 1.0 - a; S[${$(t+3)}] = cf;`),n.push(`    } else {`),n.push(`      S[${$(t)}] = 0.1; S[${$(t+1)}] = 0.0; S[${$(t+2)}] = 0.0; S[${$(t+3)}] = 0.0;`),n.push(`    }`),n.push(`  }`),n.push(`}`),n.join(`
`)+`
`}function rg(e,t,n,r={}){let i=e.spaces.nodes,a=r.data||{linksDefault:!0,groups:{}};if(!r.generic&&i>(r.smallGraph||1024)&&ag(e,t,a))return Object.assign(og(e,t.repulsion||null),{dataKey:JSON.stringify(a)});let o=Qm(e,t,{limits:n,warn:r.warn,smallGraph:r.smallGraph,renumber:r.renumber,data:a});if(o.refusal)return o;let s=o.kernelList.filter(e=>e.kind===`grid`);return o.buffers=Object.assign({S:o.S.size*4,H:o.H.size*4,X:o.cap*o.D*4,Y:o.cap*o.D*4,L:ig(o),V:o.slot.bytes},o.pyramid?o.pyramid.buffers:{}),s.forEach(e=>{let t=e.section.grid;Object.keys(t.buffers).forEach(n=>{o.buffers[`${e.name} ${n}`]=t.buffers[n]})}),o.kernels=e=>{let t=Object.assign(Uh(o,e),o.pyramid?o.pyramid.kernels:{});return s.forEach(e=>Object.entries(e.section.grid.kernels).forEach(([e,n])=>{t[e]=n.code})),t},o.how=sg(o),o.reads=Object.keys(o.columns),o}function ig(e){let t=e.nodes,n=e.links,r=t+1+7*n+1+e.groupColumns.length;return e.chunked&&(r+=2+t+2*(Math.ceil(2*n/8)+t)),e.groupColumns.forEach(n=>{let i=(Object.values(e.sums).find(e=>e.column===n)||{}).count||0,a=Math.ceil(t/256)+i;r+=3+t+a+1+i+1}),r*4}function ag(e,t,n={linksDefault:!0}){if(e.dims!==2||!n.linksDefault)return!1;let r=lp(e);if(r.map(e=>e.builtIn).join()!==sp.join()||r.some(e=>e.when))return!1;let i=r[1].args.channels[0];if(i.charge!==`mass`||i.sensitivity!==`mass`||r[4].args.inertia!==`mass`)return!1;let a=t.repulsion;return!a||$u(a)<=16&&!a.describe().tables.length}function og(e,t){let n=e.settings.integrator===`fire`;return{template:`grid`,law:t,perStep:!!t&&cg(t.describe()),nodes:e.spaces.nodes,links:e.spaces.links,buffers:Ld(e.spaces.nodes,e.spaces.links),kernels:()=>Bd(t),kernelStages:Pd,reads:[`pos`,`velocity`,`mass`,`pinned`],how:{clear:`part of FORCE`,repulsion:`grid pyramid with exact pairs in the 3x3 near cells (theta and nbody do not apply)`,drag:n?`skipped under FIRE`:`part of FORCE`,springs:`chunks of 8 links per thread (SPRINGS), added in FORCE`,integrate:n?`FIRE: FIRE_REDUCE, FIRE_STATE, FIRE_INTEGRATE`:`Euler, part of FORCE`}}}function sg(e){let t=Object.create(null);e.skipped.forEach(e=>{t[e]=`skipped under FIRE`});let n=e.kernelList.filter(e=>e.kind===`node`).length;return e.kernelList.forEach((r,i)=>{if(r.kind===`link`&&r.sections.forEach(e=>{t[e.stage.name]=`a thread per link, in ${r.name}`}),r.kind===`grid`){let e=r.section.grid,n=r.section.stage.args;t[r.section.stage.name]=`a ${n.anchor} grid of up to ${n.maxCells.toLocaleString(`en-US`)} cells per axis, ${n.weights} weights${e.smooth?`, smoothed`:``}: ${e.dispatches} dispatches (${r.name})${r.hoisted?`, at the start of the step`:``}${e.pending?`; ${Kf}`:``}`}if(r.kind!==`node`)return;let a=n===1&&e.kernelList.length===1?`the step kernel (one dispatch)`:r.name,o=e.kernelList.slice(i+1).find(e=>e.kind===`reduce`);r.sections.forEach(n=>{if(n.kind===`pairs`){n.channels.forEach(e=>{t[e.stage.name]=`exact pairs over tiles of 256 bodies, in ${a}`});return}if(n.kind===`gather`){t[n.stage.name]=`both ends of every link, at each body, in ${a}`;return}if(n.kind===`tree`){let e=n.channels.length,r=e>1?` (${e} charges in one walk)`:``;n.channels.forEach(e=>{t[e.stage.name]=`grid pyramid${r}: ${n.pyramid.dispatches} structure dispatches, then exact pairs in the near cells and the far field in ${a}`});return}let s=n.stage.name;if(n.kind===`sum`)t[s]=r.hoisted?`added up at the start of the step (SUMS, SUMS_REDUCE)`:`per body in ${a}, added up in ${o?o.name:`a reduction`}`;else if(n.kind===`fire`)t[s]=`FIRE: FIRE_REDUCE, FIRE_STATE, then ${a}`;else if(n.kind===`groupsum`){let n=e.kernelList.slice(i+1).find(e=>e.kind===`groupRuns`&&e.sums.some(e=>e.name===s));t[s]=`per body in ${a}, then by group in ${n?n.name:`GROUP_RUNS`} and GROUP_SUM`}else t[s]=(n.kind===`formula`?`in `:`part of `)+a})}),t}function cg(e){return e.params.some(e=>e.kind===`host`)||!!(e.range&&e.range.kind===`host`)||e.builtIns.indexOf(`step`)>=0}var lg=[`maxStorageBuffersPerShaderStage`,`maxStorageBufferBindingSize`,`maxBufferSize`,`maxComputeInvocationsPerWorkgroup`,`maxComputeWorkgroupSizeX`,`maxComputeWorkgroupStorageSize`,`maxComputeWorkgroupsPerDimension`,`maxUniformBufferBindingSize`,`minUniformBufferOffsetAlignment`,`maxDynamicUniformBuffersPerPipelineLayout`];Object.freeze({maxStorageBuffersPerShaderStage:8,maxStorageBufferBindingSize:134217728,maxBufferSize:268435456,maxComputeInvocationsPerWorkgroup:256,maxComputeWorkgroupSizeX:256,maxComputeWorkgroupStorageSize:16384,maxComputeWorkgroupsPerDimension:65535,maxUniformBufferBindingSize:65536,minUniformBufferOffsetAlignment:256,maxDynamicUniformBuffersPerPipelineLayout:8});var ug=`the WebGPU device was lost; create a new backend`,dg=256,fg=[`timeStep`,`springLength`,`springCoefficient`,`dragCoefficient`,`gravity`,`maxVelocity`],pg={f64:!0,f32:!0};function mg(e,t={}){let n=new WeakMap,r=(r,i)=>{let a=n.get(r);(!a||a.gridArithmetic!==e.gridArithmetic)&&(a={lowering:hg(r,i,e,t),gridArithmetic:e.gridArithmetic},n.set(r,a));let o=a.lowering;return t.lost&&t.lost()?Object.assign({},o,{runs:!1,reasons:[ug].concat(o.reasons),plan:null}):o};return{name:`webgpu`,limits:e,options:t,checkProgram(e,t){let n=r(e,t);return{reasons:n.reasons,warnings:n.warnings}},check(e,t,n){return r(t,n).stages[e.name]},lower:r}}function hg(e,t,n,r={}){let i=[],a=[],o={},s=e=>{a.indexOf(e)<0&&a.push(e)},c=Gu(s),l=Object.create(null),u=gg(e),d=_g(e,t);e.stages.forEach(r=>{let i=vg(r,e,t,c,l,u,n);o[r.name]=i.runs?{runs:!0,how:i.how}:{runs:!1,reason:i.reason},i.warnings&&i.warnings.length&&(o[r.name].warnings=i.warnings)}),fg.forEach(t=>{let n=Uu(e.settings[t]);n&&i.push(`the setting ${t}: ${n}`)}),e.listeners.step&&a.push(`'step' listeners run once per readback from the GPU, not after every step`);let f=Object.keys(o).every(e=>o[e].runs),p=null;return f&&i.length===0&&(p=rg(e,l,n,Object.assign({},r,{warn:s,data:d})),p.refusal?(i.push(p.refusal),p=null):(Eg(p,n,i,c),lp(e).forEach(e=>{p.how[e.name]&&(o[e.name].how=p.how[e.name])}),i.length&&(p=null))),{runs:f&&i.length===0,reasons:i,warnings:a,stages:o,plan:p}}function gg(e){let t=Object.create(null),n=Object.create(null),r=Object.create(null);return e.columns.nodes.forEach(e=>{t[e.name]=e}),(e.columns.links||[]).forEach(e=>{r[e.name]=e}),e.sums.forEach(e=>{n[e.name]=e}),{columns:t,links:r,sums:n,D:e.dims}}function _g(e,t){let n=t.springStore,r=!0;for(let e=0;e<n.n&&r;e++)(n.length[e]>=0||n.coefficient[e]>0)&&(r=!1);let i=new Uint32Array(t.store.n),a=0;for(let e=0;e<n.n;e++){let t=++i[n.from[e]],r=++i[n.to[e]];t>a&&(a=t),r>a&&(a=r)}let o={};return e.sums.forEach(e=>{if(!e.group||o[e.group]!==void 0||e.over!==`nodes`)return;let n=t.store[e.group],r=-1;for(let e=0;n&&e<t.store.n;e++){let t=n[e];t>=0&&Math.floor(t)>r&&(r=Math.floor(t))}o[e.group]=r+1}),{linksDefault:r,maxDegree:a,groups:o,peak:e=>{let n=t.store.n,r=e.map(e=>t.store[e]);if(r.some(e=>!e))return;let i=0,a=0;for(let e=0;e<n;e++){let t=0;for(let n=0;n<r.length;n++)t+=Math.abs(r[n][e]);i+=t,t>a&&(a=t)}return i>0&&Number.isFinite(i)?a*n/i:void 0}}}function vg(e,t,n,r,i,a,o){if(cp(e))return kg(`stops layout.step() while the GPU runs the layout`);let s=yg(e,a);switch(e.builtIn||e.shape){case`clear`:case`drag`:return kg(`part of the step`);case`springs`:return e.args.counters?Ag(`WebGPU has no adaptive time step`):kg(`part of the step`);case`repulsion`:case`tree`:return s?Ag(s):bg(e,n,r,i);case`integrate`:return xg(e,a);case`node`:return s?Ag(s):Sg(e,a,r);case`sum`:if(e.args.over!==`nodes`)return Ag(`WebGPU does not run sums over links yet`);if(e.args.reduce!==`sum`)return Ag(`WebGPU does not run ${e.args.reduce} over bodies yet`);if(e.args.group){let t=a.columns[e.args.group];if(!t||t.writer!==`host`)return Ag(`WebGPU runs sums per group only with group ids set by the host`)}return s?Ag(s):Sg(e,a,r);case`link`:return s?Ag(s):Cg(e,a,r);case`pair`:return s?Ag(s):wg(e,a,r);case`grid`:return s?Ag(s):Qf(e,t.dims,t.spaces.nodes,o,r);case`host`:return kg(`on the host, on the steps where its \`when\` holds: the step stops there and reads back ${(e.reads||[]).map(e=>e.column).join(`, `)||`nothing`}`);case`js`:return Ag(`JavaScript stages run on the CPU only (formula stages and host steps run on other engines too)`);case`pair rules`:return Ag(`pair rules are JavaScript and run on the CPU only (pair formulas do the same on every engine)`)}return Ag(`WebGPU does not know stages of shape ${e.shape}`)}function yg(e,t){for(let n of e.reads.concat(e.writes)){if(n.space!==`nodes`)continue;let e=t.columns[n.column];if(e&&!e.hidden&&e.width!==1&&e.width!==`D`)return`WebGPU reads columns of 1 or D numbers per body; ${n.column} has ${e.width}`}for(let n of e.writes){let e=n.space===`nodes`&&t.columns[n.column];if(e&&!pg[e.type])return`WebGPU does not run formulas that write the ${e.type} column ${n.column} yet`}return null}function bg(e,t,n,r){let i=e.args.channels[0].law;if(i.functions.length)return Ag(`laws with JavaScript functions run on the CPU only`);let a=Dg(i.tables);if(a)return Ag(`the law's `+a);if(i.isDefault)return r[e.name]=null,kg(`part of the step`);let{law:o,lawValues:s}=t.stageValues(e.name);try{Zu(o,2,`r`,`k1`,`k2`,n)}catch(e){return Ag(`the law: `+e.message)}let c=s||o.values,l=nd(o,c);return l?Ag(`the law's ${l.name} is ${l.problem}`):(r[e.name]=o,Object.assign(kg(`part of the step`),{warnings:rd(o,c)}))}function xg(e,t){let n=e.args;if(n.integrator!==`euler`&&n.integrator!==`fire`)return Ag(`WebGPU does not know the integrator ${n.integrator}`);if(n.adaptiveTimeStepWeight)return Ag(`WebGPU has no adaptive time step`);let r=t.columns[n.inertia];return r&&r.width!==1?Ag(`the inertia column ${n.inertia} should hold one number per body`):kg(`part of the step`)}function Sg(e,t,n){let r=Dg(e.tables);if(r)return Ag(r);try{Tg(e,t,n)}catch(e){return Ag(e.message)}return kg(`part of the step`)}function Cg(e,t,n){if(e.args.counters)return Ag(`WebGPU has no adaptive time step`);let r=Dg(e.tables);if(r)return Ag(r);let i=e.writes.some(e=>e.via===`pull`||e.space===`nodes`&&e.end),a=e.writes.filter(e=>e.space===`links`);if(i&&a.length)return Ag(`WebGPU does not run link formulas that both move bodies and write link columns yet`);for(let e of a){let n=t.links[e.column];if(n&&!pg[n.type])return Ag(`WebGPU does not run formulas that write the ${n.type} link column ${e.column} yet`)}try{Tg(e,t,n,!0)}catch(e){return Ag(e.message)}return kg(`part of the step`)}function wg(e,t,n){if(typeof e.args.radius==`object`&&e.args.radius.kind===`number`){let t=Uu(e.args.radius.value);if(t)return Ag(`the radius: `+t)}try{Yp(e,{D:t.D,printer:n,columns:t.columns,read:(e,t,n)=>`${t}_${e}_${n}`,param:e=>`p_`+e,builtIn:e=>`b_`+e,sumWidth:e=>t.sums[e]&&!t.sums[e].group?t.sums[e].width===`D`?t.D:t.sums[e].width:0,sum:(e,t)=>`g_${e}_${t}`})}catch(e){return Ag(e.message)}return kg(`part of the step`)}function Tg(e,t,n,r){let i=(e,t)=>e.length===1?{type:`num`,code:e[0],write:t}:{type:`vec`,codes:e,write:t},a=(e,n)=>{let r=t.columns[e];if(!r||r.hidden)return;let a=r.width===`D`?t.D:r.width,o=Array.from({length:a},(e,t)=>`c_${n}_${t}`);return i(o,(e,t)=>o.map((n,r)=>`${n} ${e} ${(t.codes||[t.code])[r]};`))},o=e=>(t,n)=>[`${e} ${t} ${n.code};`],s={D:t.D,name(n){if(r){if(n===`r`||n===`length`||n===`coefficient`||n===`pull`||t.links[n])return{type:`num`,code:`l_`+n,write:o(`l_`+n)};let e=/^(.+)_([ij])$/.exec(n);if(e)return a(e[1],n)}else{let e=a(n,n);if(e)return e}if(e.params.some(e=>e.name===n))return{type:`num`,code:`p_`+n};if(e.tables.some(e=>e.name===n))return{call:e=>`t_${n}(${e[0]})`};let s=t.sums[n];if(s){let e=s.width===`D`?t.D:s.width,r=Array.from({length:e},(e,t)=>`g_${n}_${t}`);return s.group?{index:()=>i(r)}:i(r)}if(e.builtIns.indexOf(n)>=0)return{type:`num`,code:`b_`+n}}};return Bu.compile(e.formula,s,n)}function Eg(e,t,n,r){let i=e.kernels(r);if(Object.keys(i).forEach(e=>{let r=(i[e].match(/var<storage\b/g)||[]).length;r>t.maxStorageBuffersPerShaderStage&&n.push(`kernel ${e} needs ${r} storage buffers; this device allows ${t.maxStorageBuffersPerShaderStage}`)}),e.template===`generic`){let r=Math.ceil(e.tileFloats/4)*16*dg+(e.sumWidth?16*dg:0);r>t.maxComputeWorkgroupStorageSize&&n.push(`the repulsion tiles need ${r} bytes of workgroup memory (${e.tileFloats} numbers per body); this device allows ${t.maxComputeWorkgroupStorageSize}`),e.slot.bytes>t.maxUniformBufferBindingSize&&n.push(`a step needs ${e.slot.bytes} bytes of numbers; this device allows ${t.maxUniformBufferBindingSize} per uniform`)}let a=Math.min(t.maxStorageBufferBindingSize,t.maxBufferSize);Object.keys(e.buffers).forEach(t=>{let r=e.buffers[t];r>a&&n.push(`the buffer ${t} needs ${Og(r)}; this device allows ${Og(a)} per buffer`)});let o=t.maxComputeWorkgroupsPerDimension*dg;e.nodes>o&&n.push(`WebGPU runs up to ${o.toLocaleString(`en-US`)} bodies (one thread each); this layout has ${e.nodes.toLocaleString(`en-US`)}`),Object.values(e.sums||{}).forEach(e=>{e.grouped&&e.count>o&&n.push(`${e.name}: WebGPU sums up to ${o.toLocaleString(`en-US`)} groups (one thread each); the largest group id is ${(e.count-1).toLocaleString(`en-US`)}`)})}function Dg(e){for(let t of e||[])for(let e of[t.from,t.to].concat(Array.from(t.values)))if(!Number.isFinite(e)||Math.abs(e)>34028234663852886e22)return`table ${t.name}: ${Uu(e)}`;return null}function Og(e){return(e/1048576).toFixed(+(e<10485760))+` MiB`}function kg(e){return{runs:!0,how:e}}function Ag(e){return{runs:!1,reason:e}}var jg=new WeakMap,Mg=Object.freeze({pending:!0,sums:!0,residual:!0,reason:null});function Ng(e,{opaque:t=!0}={}){return t?(jg.has(e)||jg.set(e,Pg(e,t)),jg.get(e)):Pg(e,t)}async function Pg(e,t){let n=[],r=performance.now();try{let i=Uf({opaque:t}),a={};await Promise.all(Object.entries(i).map(async([t,n])=>{a[t]=await wu(e,{code:n.code,label:t,bindings:n.bindings.map(e=>e.kind)})}));let o=(t,r)=>{let i=e.createBuffer({size:Math.max(16,Math.ceil(t.byteLength/16)*16),usage:r|GPUBufferUsage.COPY_DST});return n.push(i),e.queue.writeBuffer(i,0,t),i},s=performance.now(),c=[Lg(o),Rg(2,o),Rg(3,o)],l=e.createCommandEncoder(),u=l.beginComputePass();for(let t of c)u.setPipeline(a[t.name]),u.setBindGroup(0,e.createBindGroup({layout:a[t.name].getBindGroupLayout(0),entries:t.entries.map((e,t)=>({binding:t,resource:{buffer:e}}))})),u.dispatchWorkgroups(1);u.end();let d=c.map(t=>{let r=e.createBuffer({size:t.out.size,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});return n.push(r),l.copyBufferToBuffer(t.out,0,r,0,t.out.size),r});e.queue.submit([l.finish()]),await Promise.all(d.map(e=>e.mapAsync(GPUMapMode.READ)));let[f,...p]=c.map((e,t)=>e.judge(new Float32Array(d[t].getMappedRange()))),m={compile:+(s-r).toFixed(1),run:+(performance.now()-s).toFixed(1)},h=p.every(e=>e.ok),g=[];return f.ok||g.push(`its two-sums or grid coordinates are not exact`),h||g.push(`the smoothing's residual is not exact`),{sums:f.ok,residual:h,reason:g.length?`this GPU's compiler sees through the grid's exact arithmetic: ${g.join(`, and `)}`:null,numbers:{sumError:f.sumError,quotientError:f.quotientError,offsetError:f.offsetError,residualError:p.map(e=>e.error)},ms:m}}catch(e){return{sums:!1,residual:!1,reason:`the check of the grid's exact arithmetic could not run on this GPU: `+e.message,numbers:null}}finally{n.forEach(e=>e.destroy())}}var Fg=Math.fround,Ig=e=>new Uint32Array(new Float32Array([e]).buffer)[0];function Lg(e){let t=new Float32Array(80);t[0]=1,t[1]=Fg(1.5*2**-26);let n=1000.3,r=1024;t[4]=Fg(n),t[5]=Fg(n-t[4]),t[6]=r;let i=Fg(.7),a=Fg(.7-i),o=i+a,s=[12345.678,-9876.54],c=new Uint32Array(Y.TABLE);c[Y.CELL]=Ig(i),c[Y.CELL_LOW]=Ig(a);let l=[],u=[];for(let e=0;e<2;e++)l.push(Math.floor(s[e]/o)),u.push(Fg(s[e]-l[e]*o)),c[Y.MA+e]=Ig(l[e]),c[Y.RA+e]=Ig(u[e]),c[Y.SIZE+e]=4096;let d=[0,3,40,500,1e3,2047,7,1500,250,64,1999,12,777,1234,333,1800],f=[.25,.5,.71,.13,.9,.37,.61,.07,.83,.44,.19,.66,.31,.58,.12,.95],p=d.length,m=new Float32Array(2*p);for(let e=0;e<p;e++)m[2*e]=Fg(s[0]+(d[e]+f[e])*o),m[2*e+1]=Fg(s[1]+(d[p-1-e]+f[(e+5)%p])*o);let h=new Uint32Array([p,0,0,0,0,0,0,0]),g=e(t,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC);return{name:`SUMS`,entries:[e(h,GPUBufferUsage.UNIFORM),e(c,GPUBufferUsage.STORAGE),e(m,GPUBufferUsage.STORAGE),g],out:g,judge:e=>{let n=Math.abs(e[3]-t[1])/t[1]+(e[2]===t[0]?0:1),i=(t[4]+t[5])/r,a=Math.abs(e[7]+e[8]-i)/i,s=0;for(let t=0;t<p;t++)for(let n=0;n<2;n++){let r=(m[2*t+n]-(l[n]*o+u[n]))/o,i=Math.floor(r),a=16+4*t+2*n;s=Math.max(s,e[a]===i?Math.abs(e[a+1]-(r-i)):1)}return{ok:n===0&&a<1e-12&&s<1e-5,sumError:n,quotientError:a,offsetError:s}}}}function Rg(e,t){let n=e===2?[8,8,1]:[5,5,5],r=n[0]*n[1]*n[2],i=(e,t,r)=>e+n[0]*(t+n[1]*r),a=new Float32Array(r);for(let e=0;e<n[2];e++)for(let t=0;t<n[1];t++)for(let r=0;r<n[0];r++)a[i(r,t,e)]=Fg(1+.001*Math.sin(.05*(r+1.3*t+.7*e)));let o=Float64Array.from(a);for(let t=0;t<e;t++){let e=new Float64Array(r);for(let r=0;r<n[2];r++)for(let a=0;a<n[1];a++)for(let s=0;s<n[0];s++){let c=[s,a,r],l=e=>{let r=c.slice();return r[t]+=e,r[t]<0||r[t]>=n[t]?0:o[i(r[0],r[1],r[2])]},u=o[i(s,a,r)];e[i(s,a,r)]=u+64*(u-l(-1)+(u-l(1)))}o=e}let s=new Float32Array(r);for(let e=0;e<r;e++)s[e]=Fg(o[e]+1e-5*(1+.5*Math.sin(e)));let c=new Uint32Array(Y.TABLE);for(let t=0;t<e;t++)c[Y.SIZE+t]=n[t];c[Y.TOTAL]=r,c[Y.TAB_GAMMA]=Ig(64);let l=t(s,GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC);return{name:`RESIDUAL${e}`,entries:[t(c,GPUBufferUsage.STORAGE),t(a,GPUBufferUsage.STORAGE),l],out:l,judge:t=>{let r=0,a=0;for(let c=0;c<n[2];c++)for(let l=0;l<n[1];l++)for(let u=0;u<n[0];u++){if(![u,l,c].every((t,r)=>r>=e||t>0&&t<n[r]-1))continue;let d=i(u,l,c),f=s[d]-o[d];a=Math.max(a,Math.abs(f)),r=Math.max(r,Math.abs(t[d]-f))}let c=r/a;return{ok:c<.1,error:c}}}}var zg=64,Bg=`@group(0) @binding(0) var<storage, read> rows: array<u32>;
@group(0) @binding(1) var<storage, read> values: array<f32>;
@group(0) @binding(2) var<storage, read_write> into: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let r = gid.x;
  if (r >= rows[0]) { return; }
  let width = rows[2];
  let at = rows[1] + rows[4u + r] * width;
  for (var k = 0u; k < width; k++) { into[at + k] = values[r * width + k]; }
}`;async function Vg(e){let t=await wu(e,{code:Bg,label:`SCATTER`}),n=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST;return function(r,i,a,o,s){if(!o.length)return;if(o.length<=zg){for(let t=0;t<o.length;t++)e.queue.writeBuffer(r,(i+o[t]*a)*4,s,t*a,a);return}let c=new Uint32Array(4+o.length);c[0]=o.length,c[1]=i,c[2]=a,c.set(o,4);let l=e.createBuffer({size:c.byteLength,usage:n,label:`scatter rows`}),u=e.createBuffer({size:o.length*a*4,usage:n,label:`scatter values`});e.queue.writeBuffer(l,0,c),e.queue.writeBuffer(u,0,s,0,o.length*a);let d=e.createBindGroup({layout:t.getBindGroupLayout(0),entries:[l,u,r].map((e,t)=>({binding:t,resource:{buffer:e}}))}),f=e.createCommandEncoder(),p=f.beginComputePass();p.setPipeline(t),p.setBindGroup(0,d),p.dispatchWorkgroups(Math.ceil(o.length/256)),p.end(),e.queue.submit([f.finish()]),l.destroy(),u.destroy()}}function Hg(e,t,n,r,i){let a=new Map;return{mirror:i,written(){let a=e.pos,o=[];for(let e=0;e<t;e++)for(let t=0;t<n;t++)if(Math.fround(a[e*n+t]-r[t])!==i[e*n+t]){o.push(e);break}return o},uploaded(t,o){let s=new Float32Array(t.length*n),c=e.pos;return t.forEach((e,t)=>{for(let a=0;a<n;a++)s[t*n+a]=i[e*n+a]=c[e*n+a]-r[a];a.set(e,{steps:o,values:s.subarray(t*n,t*n+n)})}),s},reset(e){a.clear(),i.set(e)},readBack(t,r,o){let s=r?this.written():[];if(a.forEach((e,n)=>{e.steps>=t?s.push(n):a.delete(n)}),!s.length)return o();let c=e.pos,l=s.map(e=>c.slice(e*n,e*n+n)),u=o();return s.forEach((e,t)=>c.set(l[t],e*n)),a.forEach((e,t)=>i.set(e.values,t*n)),u}}}var Ug=16,Wg=[`gravity`,`springLength`,`springCoefficient`,`dragCoefficient`,`timeStep`,`maxVelocity`,`integrator`],Gg=`repulsion`,Kg=`@group(0) @binding(0) var<uniform> count: vec4u;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> toInternal: array<u32>;
@group(0) @binding(3) var<storage, read_write> out: array<vec2f>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.x;
  if (row >= count.x) { return; }
  out[row] = pos[toInternal[row]];
}`;async function qg(e,{simulator:t,plan:n,fireState:r,warn:i}){let a=t.store,o=n.law,s=o?$u(o):0,c=o?new Float32Array(s):null,l=zm(t,!0),u=l.n,[d,f,p]=await Promise.all([zd(e,{n:u,edges:l.edges,init:l.init,mass:l.mass,law:o,variants:n.perStep}),l.permuted?wu(e,{code:Kg,label:`UNPERMUTE`}):null,Vg(e)]);e.queue.writeBuffer(d.vel,0,l.velocity),r&&d.setFire(r);let m=null,h=null,g=[];if(f){let t=e.createBuffer({size:16,usage:GPUBufferUsage.UNIFORM|GPUBufferUsage.COPY_DST}),n=e.createBuffer({size:u*4,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_DST});m=e.createBuffer({size:u*8,usage:GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC}),e.queue.writeBuffer(t,0,new Uint32Array([u,0,0,0])),e.queue.writeBuffer(n,0,l.toInternal),h=e.createBindGroup({layout:f.getBindGroupLayout(0),entries:[t,d.pos,n,m].map((e,t)=>({binding:t,resource:{buffer:e}}))}),g.push(t,n,m)}let _={};S();let v=Hg(a,u,2,l.origin,Nm(a.pos,u,2,l.origin)),y=Float64Array.from(a.velocity.subarray(0,2*u)),b=Uint8Array.from(a.pinned.subarray(0,u),e=>+!!e),x=D();return{kind:`grid`,n:u,D:2,get fence(){return[d.pos]},positionBytes:u*8,kernelStages:Pd,prepare(t,n){S();let r=D();if(t){let t=Nm(a.pos,u,2,l.origin);v.reset(t),e.queue.writeBuffer(d.pos,0,O(t,2)),e.queue.writeBuffer(d.vel,0,Bm(a,l.toInternal,new Float32Array(4*u))),y=Float64Array.from(a.velocity.subarray(0,2*u)),b=Uint8Array.from(a.pinned.subarray(0,u),e=>+!!e)}else{if(r.pos!==x.pos){let e=v.written(),t=v.uploaded(e,n);p(d.pos,0,2,e.map(e=>l.toInternal[e]),t)}(r.velocity!==x.velocity||r.pinned!==x.pinned)&&A(k())}return r.mass!==x.mass&&e.queue.writeBuffer(d.mass,0,Vm(a,l.toInternal,new Float32Array(u))),x=r,`ok`},run(e,t,r){let i=null,a;if(o){let r=n.perStep?w(e,t):C(t);if(a=r.halt,e=Math.min(e,r.count),e===0)return{ran:0,halt:a};r.perStep&&(i=(e,t,n)=>t.set(r.numbers.subarray(e*s,(e+1)*s),n))}return d.run(e,Object.assign({},r,{lawSteps:i})),{ran:e,halt:a}},copyPositions(e,t,n,r=Ug){if(f&&r>=Ug){let r=e.beginComputePass();return r.setPipeline(f),r.setBindGroup(0,h),r.dispatchWorkgroups(Math.ceil(u/256)),r.end(),e.copyBufferToBuffer(m,0,t,n,u*8),!0}return e.copyBufferToBuffer(d.pos,0,t,n,u*8),!l.permuted},readPositions(e,n,r,i){return Rm(t,l.bodies)?r?Pm(t,l.bodies,e,2,l.origin,n):Im(t,l.bodies,e,l.toInternal,l.origin,n):v.readBack(i,a.versions.pos!==x.pos,()=>{if(!r)return Im(t,l.bodies,e,l.toInternal,l.origin,n,v.mirror);let i=Pm(t,l.bodies,e,2,l.origin,n);return v.mirror.set(e.subarray(0,2*u)),i})},async readDevice(){let n=e.createBuffer({size:u*24+16,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),r=e.createCommandEncoder();this.copyPositions(r,n,0,Ug),r.copyBufferToBuffer(d.vel,0,n,u*8,u*16),r.copyBufferToBuffer(d.fire,0,n,u*24,16),e.queue.submit([r.finish()]);try{await n.mapAsync(GPUMapMode.READ)}catch{return n.destroy(),null}let i=new Float32Array(n.getMappedRange(0,u*8)).slice(),o=new Float32Array(n.getMappedRange(u*8,u*16)).slice(),s=Array.from(new Float32Array(n.getMappedRange(u*24,16)));return n.unmap(),n.destroy(),{positions:i,fireState:s,apply(){if(Rm(t,l.bodies))return;let e=a.versions.velocity===x.velocity?[]:k(),n=e.map(e=>[a.velocity[2*e],a.velocity[2*e+1]]);for(let e=0;e<u;e++){let t=4*l.toInternal[e];a.velocity[2*e]=o[t],a.velocity[2*e+1]=o[t+1]}e.forEach((e,t)=>{a.velocity[2*e]=n[t][0],a.velocity[2*e+1]=n[t][1]}),y=Float64Array.from(a.velocity.subarray(0,2*u))}}},destroy(){d.destroy(),g.forEach(e=>e.destroy())}};function S(){let e=t.settings;if(Wg.every(t=>_[t]===e[t]))return;let n=_.integrator===void 0,r=_.integrator===`fire`;_={},Wg.forEach(t=>{_[t]=e[t]}),d.setParams(Object.assign({},e,{maxVelocity:e.maxVelocity>0?e.maxVelocity:1})),!n&&!r&&e.integrator===`fire`&&d.resetFire()}function C(e){let t=T(e),n=E(t,e);if(n)return{count:0,halt:n};let r=new Float32Array(s);return ed(o,r,0,t),Jg(r,c)||(c=r,d.setLawValues(c)),{count:1/0}}function w(e,t){let n=new Float32Array(e*s),r=!0;for(let i=0;i<e;i++){let e=t+i,a=T(e),l=E(a,e);if(l)return{count:i,numbers:n,perStep:!0,halt:l};ed(o,n,i*s,a),r&&!Jg(n.subarray(i*s,(i+1)*s),c)&&(r=!1)}return r?{count:e,perStep:!1}:(c=n.slice((e-1)*s,e*s),d.setLawValues(c),{count:e,numbers:n,perStep:!0})}function T(e){let n=t.stageValues(Gg,t.stepContext(e));return n.lawValues||Object.assign({},n.law.values)}function E(e,t){let n=nd(o,e);return n?{message:`the law's ${n.name} is ${n.problem} at step ${t}`,stages:[Gg]}:(rd(o,e).forEach(i),null)}function D(){return{pos:a.versions.pos,velocity:a.versions.velocity,mass:a.versions.mass,pinned:a.versions.pinned}}function O(e,t){if(!l.permuted)return e;let n=new Float32Array(e.length);for(let r=0;r<u;r++)for(let i=0;i<t;i++)n[l.toInternal[r]*t+i]=e[r*t+i];return n}function k(){let e=a.velocity,t=a.pinned,n=[];for(let r=0;r<u;r++)(e[2*r]!==y[2*r]||e[2*r+1]!==y[2*r+1]||+!!t[r]!==b[r])&&n.push(r);return n}function A(e){let t=new Float32Array(4*e.length),n=a.velocity,r=a.pinned;e.forEach((e,i)=>{t[4*i]=y[2*e]=n[2*e],t[4*i+1]=y[2*e+1]=n[2*e+1],t[4*i+3]=b[e]=+!!r[e]}),p(d.vel,0,4,e.map(e=>l.toInternal[e]),t)}}function Jg(e,t){if(!t||e.length!==t.length)return!1;for(let n=0;n<e.length;n++)if(!Object.is(e[n],t[n]))return!1;return!0}var Yg=20,Xg=2e9,Zg=65e6,Qg=2e8,$g=30;async function e_(e,t,{buffers:n={},step:r=null,groupLimit:i=0,workCap:a=Xg,slowdown:o=1}={}){if(t.refusal)throw Error(t.refusal);let{D:s,sizes:c,kernels:l,columns:u}=t,d=[].concat(...Object.values(u)).filter(e=>!n[e]);if(d.length)throw Error(`buildPyramid: no buffer for `+d.join(`, `));let f=Object.keys(l).map(n=>{let i={code:l[n],label:n},a=r?[r.dynamic?`dynamic`:`uniform`]:[];return n===`TREE_LOCAL`&&r&&(i.bindings=[`uniform`,`storage`,t.hubs?`storage`:`read`,`storage`,`read`].concat(a)),n===`TREE_HEAVY`&&r&&(i.bindings=[`uniform`,`read`,`read`,`storage`,`read`].concat(a)),wu(e,i).then(e=>[n,e])}),p=Object.fromEntries(await Promise.all(f)),m=GPUBufferUsage.STORAGE,h=GPUBufferUsage.COPY_DST,g=GPUBufferUsage.COPY_SRC,_=GPUBufferUsage.UNIFORM,v=[];e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`);let y=(t,n=m)=>{let r=e.createBuffer({size:t,usage:n});return v.push(r),r},b=t.buffers,x=y(b.treeBox,m|h|g),S=y(b.treeCount,m|h),C=y(b.treeBlocks),w=y(b.treeWork),T=y(b.treeMeta,m|g),E=y(b.treeSp,m|g),D=y(b.treeCells,m|h|g),O=y(b.treeLists,m|g),k=(Yg+t.lawWords)*4,A=y(Math.max(64,Math.ceil(k/16)*16),_|h),j=y(16,_|h);e.queue.writeBuffer(j,0,new Uint32Array([c.nCells/1024,0,0,0]));let M=Sp(s),N=new Uint32Array(M.size);for(let e=0;e<s;e++)N[M.BB_MIN+e]=4294967295;e.queue.writeBuffer(x,0,N),t_(e,D,t);let P=new ArrayBuffer(Math.max(64,Math.ceil(k/16)*16)),F=new Uint32Array(P),I=new Float32Array(P);F[0]=c.n,F[1]=c.G,F[2]=c.levels,F[3]=c.nCells,F[4]=c.locOff,F[5]=c.metaTag,F[6]=c.metaRow,F[7]=c.metaCount,F[8]=Rp,F[9]=Math.max(1,Math.floor(c.n/1e3)),I[10]=-1,F[11]=c.pyrSize-1;let L=t.heads?c.n+c.localCells-c.nCells:c.localCells,R=Math.ceil(L/256);F[12]=R,F[13]=c.crowdOff,I[14]=a,F[15]=c.crowdList,F[16]=c.occList,F[17]=c.hubOff,F[18]=c.hubList;let z=(t,n,r=p[t])=>e.createBindGroup({layout:r.getBindGroupLayout(0),entries:n.map((e,t)=>({binding:t,resource:e.buffer?e:{buffer:e}}))}),ee=(e,t)=>u[e].map(e=>Array.isArray(n[e])?n[e][t]:n[e]),B=e=>u[e].some(e=>Array.isArray(n[e])),te=(e,t)=>B(e)?[0,1].map(n=>z(e,t(n))):z(e,t(0)),ne=r?[{buffer:r.buffer,size:r.size}]:[],re={TREE_HIST:te(`TREE_HIST`,e=>[A].concat(ee(`TREE_HIST`,e),[x])),TREE_BOX:z(`TREE_BOX`,[A,x,O]),TREE_BIN:te(`TREE_BIN`,e=>[A].concat(ee(`TREE_BIN`,e),[x,S,w])),TREE_SCAN_BLOCKS:z(`TREE_SCAN_BLOCKS`,[S,T,C,A,O]),TREE_SCAN_TOP:z(`TREE_SCAN_TOP`,[C,j]),TREE_SCAN_ADD:z(`TREE_SCAN_ADD`,[A,T,C]),TREE_PLACE:z(`TREE_PLACE`,[A,T,w]),TREE_ORDER:te(`TREE_ORDER`,e=>[A].concat(ee(`TREE_ORDER`,e),[w,T,E,O])),TREE_AGG0:z(`TREE_AGG0`,[A,E,T,D,O].concat(t.hubs?[x]:[])),TREE_LOCAL:z(`TREE_LOCAL`,[A,D,T,O,E].concat(ne))};t.heavyCells&&(re.TREE_HEAVY=z(`TREE_HEAVY`,[A,E,T,D,O].concat(ne)));let ie=Hp(c.levels,t.blockSteps).map(({from:n,steps:r})=>{let i=y(16,_|h),a=t.blockSteps?(c.G>>n)**s:(c.G>>n+1)**s;return e.queue.writeBuffer(i,0,new Uint32Array(t.blockSteps?[a,c.levelOff[n],r,c.metaCount]:[a,c.levelOff[n],c.levelOff[n+1],c.metaCount])),{count:a,group:z(`TREE_PYR`,[i,D].concat(t.layout.CNT<0?[T]:[],t.hubs?[x]:[]))}}),ae=(await Promise.all([e.popErrorScope(),e.popErrorScope()])).find(Boolean);if(ae)throw v.forEach(e=>e.destroy()),Error(`could not create the tree buffers: `+ae.message);let V=a,oe=Zg/Math.max(1,o),se=0;function ce(){let t=Math.min(a,Math.max(oe*$g,1.5*se));t!==V&&(V=t,I[14]=V,e.queue.writeBuffer(A,56,new Float32Array([V])))}let H=i||e.limits.maxComputeWorkgroupsPerDimension;function U(e){let t=Math.max(1,Math.ceil(e/256));if(t<=H)return[t,1];let n=H;return[n,Math.ceil(t/n)]}let le=U(c.n),ue=U(c.nCells),W=U((R+128+(t.hubs?32:0))*256),de=Math.min(le[0]*le[1],128),fe=0;function pe(e,t,n){e.setPipeline(p[t]),e.setBindGroup(0,Array.isArray(re[t])?re[t][fe]:re[t]),e.dispatchWorkgroups(n[0],n[1])}return{plan:t,buffers:{treeSp:E,treeMeta:T,treeCells:D,TP:A},nodeGrid:le,setValues(n,r){I[10]=n.gravity,r&&t.lawWords&&t.groups.forEach(e=>{e.law&&ed(r[e.first]||e.law,I,Yg+e.base)}),e.queue.writeBuffer(A,0,P)},encode(e,{stepOffset:n,parity:i=0}={}){fe=i,pe(e,`TREE_HIST`,[de,1]),pe(e,`TREE_BOX`,[1,1]),pe(e,`TREE_BIN`,le),pe(e,`TREE_SCAN_BLOCKS`,[c.nCells/1024,1]),pe(e,`TREE_SCAN_TOP`,[1,1]),pe(e,`TREE_SCAN_ADD`,ue),pe(e,`TREE_PLACE`,le),pe(e,`TREE_ORDER`,le),pe(e,`TREE_AGG0`,ue),e.setPipeline(p.TREE_PYR);for(let{count:t,group:n}of ie){e.setBindGroup(0,n);let r=U(t);e.dispatchWorkgroups(r[0],r[1])}let a=r&&r.dynamic?[n||0]:[];e.setPipeline(p.TREE_LOCAL),e.setBindGroup(0,re.TREE_LOCAL,a),e.dispatchWorkgroups(W[0],W[1]),t.heavyCells&&(e.setPipeline(p.TREE_HEAVY),e.setBindGroup(0,re.TREE_HEAVY,a),e.dispatchWorkgroups(t.heavyGroups))},boxBuffer:x,status:{buffer:O,offset:0,size:32},statusMessage:e=>n_(e,V,t.K),observe(e){se=e[7]*1e6},observeTime(e){!(e>0)||se<Qg||(oe=Math.min(Zg,se/e),ce())},cappedMs:()=>V/oe,destroy(){for(let e of v)e.destroy()}}}function t_(e,t,n){let r=n.layout.TAB4*4;if(!r)return;let i=new Float32Array(r);n.groups.forEach(e=>{(e.tables||[]).forEach(e=>{i.set(e.values,e.base)})}),e.queue.writeBuffer(t,0,i)}function n_(e,t=Xg,n=1){let r=e[2];if(!r)return null;let i=e=>e>=10?e.toFixed(0):e>=1?e.toFixed(1):e.toFixed(2),a=e[3]/1e3,o=hp(n);return`the tree pass: a grid cell holds ${r.toLocaleString(`en-US`)} bodies, and the crowded cells need about ${i(a)} billion pair evaluations a step`+(n>1?` with ${n} charges (the work of ${i(a*o)} billion with one)`:``)+`, more than the GPU takes (${i(t/1e9)} billion); the layout is piled too densely in one place for the grid`}var r_=1073741823;function i_(e,t,n,r,i){let a=i-1,o=1/(r*em),s=new Int32Array(t*n),c=new Uint32Array(i);for(let r=0;r<t;r++){for(let t=0;t<n;t++)s[r*n+t]=Math.max(-1073741823,Math.min(r_,Math.floor(e[r*n+t]*o)));c[a_(s,r*n,n,null)&a]+=1}let l=3**n,u=new Int32Array(n),d=0;for(let e=0;e<t;e++){let t=0;for(let r=0;r<l;r++){let i=r;for(let e=0;e<n;e++)u[e]=i%3-1,i=i/3|0;t+=c[a_(s,e*n,n,u)&a]}d+=Math.ceil(t/256)}let f=0;for(let e=0;e<i;e++)c[e]>1024&&(f+=c[e]*Math.ceil(c[e]/256));return{chunks:d,ranks:f}}function a_(e,t,n,r){let i=374761393;for(let a=0;a<n;a++)i=Math.imul(i^e[t+a]+(r?r[a]:0),668265261),i^=i>>>15;return i>>>0}var o_=1.5,s_=43e6/256,c_=2,l_=25,u_=100,d_=256;async function f_(e,t,{buffers:n,step:r,positions:i=null,estimateScale:a=1}){if(t.refusal)throw Error(t.refusal);let o=Object.fromEntries(await Promise.all(Object.keys(t.kernels).map(n=>wu(e,{code:t.kernels[n],label:n,bindings:t.bindings[n]}).then(e=>[n,e])))),s=GPUBufferUsage.STORAGE,c=GPUBufferUsage.COPY_DST,l=GPUBufferUsage.COPY_SRC,u=[];e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`);let d=(n,r=s)=>{let i=e.createBuffer({size:t.buffers[n],usage:r,label:n});return u.push(i),i},f=d(`pairStatus`,s|l|c),p=t.sorts.map(n=>{let r=n.index,i=e.createBuffer({size:32,usage:GPUBufferUsage.UNIFORM|c,label:`PP`+r});return u.push(i),e.queue.writeBuffer(i,0,new Uint32Array([t.n,t.size-1,t.size,t.blocks,t.capChunks,r,t.n+t.capChunks,t.n+2*t.capChunks])),{sort:n,params:i,count:d(`pairCount`+r),start:d(`pairStart`+r),body:d(`pairBody`+r),list:d(`pairList`+r),args:d(`pairArgs`+r,s|GPUBufferUsage.INDIRECT|l),snap:d(`pairSnap`+r)}}),m=t.stages.map(e=>d(`pairPartial`+e.index)),h=e.createBuffer({size:d_*65,usage:GPUBufferUsage.UNIFORM|c,label:`pairSlices`});u.push(h);let g=new Uint32Array(d_/4*65);for(let e=0;e<64;e++)g[d_/4*(e+1)+1]=e;e.queue.writeBuffer(h,0,g);let _=(await Promise.all([e.popErrorScope(),e.popErrorScope()])).find(Boolean);if(_)throw u.forEach(e=>e.destroy()),Error(`could not create the pair buffers: `+_.message);let v={buffer:r.buffer,size:r.size},y={buffer:h,size:16},b=e=>e.buffer?e:{buffer:e},x=(t,n)=>e.createBindGroup({layout:o[t].getBindGroupLayout(0),entries:n.map((e,t)=>({binding:t,resource:b(e)}))}),S=(e,t)=>e.map(e=>Array.isArray(n[e])?n[e][t]:n[e]),C=e=>Array.isArray(n.X)?n.X[e]:n.X;p.forEach(e=>{let t=e.sort.kernels;e.groups={BIN:[0,1].map(n=>x(t.BIN,[e.params,v,C(n),e.count,e.body])),SCAN_BLOCKS:x(t.SCAN_BLOCKS,[e.params,e.count,e.start]),SCAN_TOP:x(t.SCAN_TOP,[e.params,e.start]),PLACE:x(t.PLACE,[e.params,e.start,e.body,e.list,e.args]),ARGS_RANK:x(t.ARGS_RANK,[e.params,e.args,f]),RANK:x(t.RANK,[e.params,e.args,e.start,e.body,e.list]),ARGS:x(t.ARGS,[e.params,e.args,f]),ORDER:[0,1].map(n=>x(t.ORDER,[e.params,e.args,e.start,e.body,e.list,e.snap,C(n)].concat(S(e.sort.columns,n)))),PLACE_S:x(t.PLACE_S,[e.params,e.start,e.body,e.list,e.args]),ARGS_RANK_S:x(t.ARGS_RANK_S,[e.params,e.args,f,y]),RANK_OWNERS_S:x(t.RANK_OWNERS_S,[e.params,e.args,e.start,e.body,e.list,y]),RANK_S:x(t.RANK_S,[e.params,e.args,e.start,e.body,e.list,y]),ORDER_S:[0,1].map(n=>x(t.ORDER_S,[e.params,e.args,e.start,e.body,e.list,e.snap,C(n)].concat(S(e.sort.columns,n),[y]))),ARGS_S:x(t.ARGS_S,[e.params,e.args,f,y]),EVAL_OWNERS_S:x(t.EVAL_OWNERS_S,[e.params,e.args,e.body,e.list,y])},e.known=null,e.lastRadius=0,e.lastSlices=0,e.lastStages=0});let w=t.stages.map(e=>{let t=p[e.sort];return{stage:e,sort:t,EVAL:x(e.kernels.EVAL,[t.params,v,t.args,t.start,t.list,t.snap,m[e.index]].concat(e.sumBuffer?S([e.sumBuffer],0):[])),GATHER:x(e.kernels.GATHER,[t.params,t.args,t.body,m[e.index]].concat(S(e.gatherColumns,0))),EVAL_S:x(e.kernels.EVAL_S,[t.params,v,t.args,t.start,t.list,t.snap,m[e.index]].concat(e.sumBuffer?S([e.sumBuffer],0):[],[y])),GATHER_S:x(e.kernels.GATHER_S,[t.params,t.args,t.body,m[e.index]].concat(S(e.gatherColumns,0),[y]))}}),T=t.capChunks,E=t.capChunks,D=s_,O=null,k=0;function A(){let t=Math.max(1,Math.min(E,Math.floor(D*l_)));t!==T&&(T=t,p.forEach(t=>e.queue.writeBuffer(t.params,16,new Uint32Array([T]))))}let j=e.limits.maxComputeWorkgroupsPerDimension,M=(e=>{let t=Math.max(1,Math.ceil(e/256));return t<=j?[t,1]:[j,Math.ceil(t/j)]})(t.n),N=(e,t,n,r,i)=>{e.setPipeline(o[t]),i?e.setBindGroup(0,n,i):e.setBindGroup(0,n),e.dispatchWorkgroups(r[0],r[1])},P=(e,t,n,r,i,a)=>{e.setPipeline(o[t]),a?e.setBindGroup(0,n,a):e.setBindGroup(0,n),e.dispatchWorkgroupsIndirect(r,i*4)},F=(e,t)=>e.gate===void 0||t[e.gate]!==0,I=e=>d_*(e+1);function L(e,n){if(!e.known&&i){let r=i_(i,t.n,t.D,n,t.size);e.known={chunks:Math.max(r.chunks,r.ranks)*a,radius:n}}if(!e.known)return 0;let r=e.known.chunks;return n>e.known.radius&&(r*=(n/e.known.radius)**t.D),r}function R(e){let t=e*o_;return t<=T?0:Math.min(64,Math.ceil(t/T))}function z(n,r,i,a,o,s,c){let l=r.sort.kernels,u=r.groups;n=o(),e.queue.writeBuffer(h,0,new Uint32Array([a,0,0,0])),N(n,l.BIN,u.BIN[c],M,s),N(n,l.SCAN_BLOCKS,u.SCAN_BLOCKS,[t.blocks,1]),N(n,l.SCAN_TOP,u.SCAN_TOP,[1,1]),N(n,l.PLACE_S,u.PLACE_S,M),N(n,l.ARGS_RANK_S,u.ARGS_RANK_S,[1,1],[0]);for(let e=0;e<a;e++)n=o(),N(n,l.RANK_OWNERS_S,u.RANK_OWNERS_S,M,[I(e)]),P(n,l.RANK_S,u.RANK_S,r.args,Z.SLICE_RANK+3*e,[I(e)]);n=o(),N(n,l.ORDER_S,u.ORDER_S[c],M,[0]),N(n,l.ARGS_S,u.ARGS_S,[1,1],[0]);for(let e=0;e<a;e++)i.forEach((t,i)=>{n=o(),i===0&&N(n,l.EVAL_OWNERS_S,u.EVAL_OWNERS_S,M,[I(e)]),P(n,t.stage.kernels.EVAL_S,t.EVAL_S,r.args,Z.SLICE_EVAL+3*e,[s[0],I(e)]),N(n,t.stage.kernels.GATHER_S,t.GATHER_S,M,[I(e)])});return o()}return{plan:t,status:{buffer:f,bytes:t.buffers.pairStatus},encode(e,{stepOffset:n=0,parity:r=0,values:i,stages:a=null,split:o=null}){let s=[n];for(let n of p){let c=w.filter(e=>e.sort===n&&F(e.stage,i)&&(!a||a.indexOf(e.stage.name)>=0)),l=i[n.sort.radius];if(!c.length||!(l>0))continue;let u=o?L(n,l):0,d=o?R(u):0;if(n.lastRadius=l,n.lastSlices=d,n.lastStages=c.length,d){e=z(e,n,c,d,o,s,r),O=e,k=0;continue}e!==O&&(O=e,k=0);let f=u*c.length;o&&k>0&&k+f>D*u_&&(e=o(),O=e,k=0),k+=f;let p=n.sort.kernels,m=n.groups;N(e,p.BIN,m.BIN[r],M,s),N(e,p.SCAN_BLOCKS,m.SCAN_BLOCKS,[t.blocks,1]),N(e,p.SCAN_TOP,m.SCAN_TOP,[1,1]),N(e,p.PLACE,m.PLACE,M),N(e,p.ARGS_RANK,m.ARGS_RANK,[1,1]),P(e,p.RANK,m.RANK,n.args,Z.RANK_X),N(e,p.ORDER,m.ORDER[r],M),N(e,p.ARGS,m.ARGS,[1,1]);for(let t of c)P(e,t.stage.kernels.EVAL,t.EVAL,n.args,Z.EVAL_X,s),N(e,t.stage.kernels.GATHER,t.GATHER,M)}return e},observe(e){p.forEach(t=>{let n=e[4+t.sort.index];n>0&&t.lastRadius>0&&(t.known={chunks:n*a,radius:t.lastRadius})})},observeTime(e){let n=0,r=0;p.forEach(e=>{e.known&&e.lastRadius>0&&(n+=e.known.chunks/a*(e.lastStages||1),r+=e.lastStages||1)}),!(!(n>0&&e>0)||n<c_*t.n*r)&&(D=Math.min(s_,n/e),A())},cappedMs(){return T/D},slices(){return p.map(e=>e.lastSlices)},setCap(e){E=Math.max(1,Math.min(t.capChunks,Math.floor(e/256))),A()},statusMessage(e){return Em(t,e)},lastChunks(e){return t.sorts.map(t=>e[4+t.index])},buffers:{status:f,sorts:p,partials:m},destroy(){u.forEach(e=>e.destroy())}}}var p_=1024,m_=100,h_=4;async function g_(e,t,{buffers:n={},step:r=null,slowdown:i=1}={}){if(t.refusal)throw Error(t.refusal);if(!r&&!t.own)throw Error("buildGrid: the plan reads the caller's step values; pass `step`");let a=r&&r.dynamic?`dynamic`:`uniform`,o=Object.keys(t.kernels),s=Object.fromEntries(await Promise.all(o.map(n=>{let r=t.kernels[n],i=r.bindings.map(e=>e.kind===`step`?a:e.kind===`uniform`?`uniform`:e.kind);return wu(e,{code:r.code,label:n,bindings:i}).then(e=>[n,e])}))),c=GPUBufferUsage.STORAGE,l=GPUBufferUsage.COPY_DST,u=GPUBufferUsage.COPY_SRC,d=[];e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`);let f=(t,n)=>{let r=e.createBuffer({size:t,usage:n});return d.push(r),r},p=t.buffers,m={GU:f(32,GPUBufferUsage.UNIFORM|l),gridMeta:f(p.gridMeta,c|l|u|GPUBufferUsage.INDIRECT),gridCount:f(p.gridCount,c),gridStart:f(p.gridStart,c|u),gridKey:f(p.gridKey,c|u),gridSp:f(p.gridSp,c|u),gridChunk:f(p.gridChunk,c|u|GPUBufferUsage.INDIRECT),gridAcc:f(p.gridAcc,c|u),gridField:f(p.gridField,c|u),gridLo:p.gridLo?f(p.gridLo,c|u):null};m.V=t.own?f(t.own.floats*4,GPUBufferUsage.UNIFORM|l):null,e.queue.writeBuffer(m.GU,0,new Uint32Array([t.n,t.maxCells,t.capacity,t.tableSize,0,0,0,0]));let h=new Uint32Array(Y.IND);for(let e=0;e<t.D;e++)h[Y.MIN+e]=4294967295;e.queue.writeBuffer(m.gridMeta,0,h);let g=(await Promise.all([e.popErrorScope(),e.popErrorScope()])).find(Boolean);if(g)throw d.forEach(e=>e.destroy()),Error(`could not create the grid field's buffers: `+g.message);let _=(e,t,i)=>{if(e===`V`)return m.V?{buffer:m.V}:{buffer:r.buffer,size:r.size};if(i&&e===`gridField`)return{buffer:m.gridLo};let a=m[e]||n[e];if(!a)throw Error(`buildGrid: no buffer for `+e);return{buffer:Array.isArray(a)?a[t]:a}},v=o.map(r=>{let{bindings:i}=t.kernels[r],o=i.some(e=>Array.isArray(n[e.name])),c=(t,n)=>e.createBindGroup({layout:s[r].getBindGroupLayout(0),entries:i.map((e,r)=>({binding:r,resource:_(e.name,t,n)}))}),l=o?[c(0),c(1)]:[c(0)],u=/_SMOOTH\d$/.test(r)?c(0,!0):null;return{name:r,pipeline:s[r],groups:l,lowGroup:u,dynamic:a===`dynamic`&&i.some(e=>e.kind===`step`)}}),y=Object.fromEntries(v.map(e=>[e.name,e])),b=Math.max(1,i),x=[],S=b,C=0,w=Math.ceil(t.n/256),T=t.label,E=[[`${T}_MINMAX`,[Math.min(w,p_)]],[`${T}_PARAMS`,[1]],[`${T}_BIN`,[w]],[`${T}_SCAN_BLOCKS`,Wd],[`${T}_SCAN_TOP`,[1]],[`${T}_ORDER`,[w]],[`${T}_CROWD`,`chunks`],[`${T}_DEPOSIT`,Gd]];if(t.smooth){for(let e=0;e<t.D;e++)E.push([`${T}_SMOOTH${e}`,Kd+3*e]);E.push([`${T}_RESIDUAL`,qd]);for(let e=0;e<t.D;e++)E.push([`${T}_SMOOTH${e}`,Jd+3*e,`low`])}E.push([`${T}_GATHER`,[w]]);function D(e,t,n,{stepOffset:r=0,parity:i=0}={},a=null){let o=y[t];e.setPipeline(o.pipeline),e.setBindGroup(0,a?o.lowGroup:o.groups[o.groups.length>1?i:0],o.dynamic?[r]:[]),n===`chunks`?e.dispatchWorkgroupsIndirect(m.gridChunk,0):typeof n==`number`?e.dispatchWorkgroupsIndirect(m.gridMeta,n*4):e.dispatchWorkgroups(n[0])}return{buffers:m,status:{buffer:m.gridMeta,offset:Y.STATUS*4,size:32},observe(e){C=e[4]},observeTime(e,{sliced:n=!1}={}){e>0&&C>0&&!n&&(x.push(e/np(t,C)),x.length>h_&&x.shift(),S=Math.min(m_,Math.max(b,...x)))},cappedMs(){return tp(t)*S},setValues(n){if(!m.V)throw Error(`the grid reads its numbers from the caller's step slot`);let r=new Float32Array(t.own.floats);t.own.names.forEach((e,t)=>{let i=n[e];if(i===void 0)throw Error(`setValues: no number for `+e);r[t]=i}),e.queue.writeBuffer(m.V,0,r)},encode(e,n){if(t.n!==0)for(let[t,r,i]of E)D(e,t,r,n,i)},phases:E.map(([e,t,n])=>({name:n?e+`_LOW`:e,encode:(r,i)=>D(r,e,t,i,n)})),destroy(){d.forEach(e=>e.destroy())}}}var __={gravity:`gravity`,timeStep:`timeStep`,dragCoefficient:`dragCoefficient`,springLength:`springLength`,springCoefficient:`springCoefficient`};function v_(e,t,n,r){let i=t.slot.floats,a=Object.create(null),o=Object.create(null),s=e=>o[e]||(o[e]={name:e,params:[],builtIns:[],grid:[],gate:void 0,radius:void 0,law:null,lawAt:0,dynamic:!1});t.slot.entries.forEach(e=>{if(e.kind===`setting`)a[e.stage]=e.index;else if(e.kind===`gate`){let t=s(e.stage);t.gate=e.index,t.dynamic=!0}else if(e.kind===`radius`)s(e.stage).radius=e.index;else if(e.kind===`param`)s(e.stage).params.push(e);else if(e.kind===`grid`)s(e.stage).grid.push(e);else if(e.kind===`builtIn`){let t=s(e.stage);t.builtIns.push(e),e.name===`step`&&(t.dynamic=!0)}}),t.sections.forEach(e=>{(e.kind===`pairs`||e.kind===`tree`?e.channels:[e]).forEach(e=>{let t=e.stage;if(!o[t.name]&&!e.law)return;let n=s(t.name);t.params.some(e=>e.kind===`host`)&&(n.dynamic=!0);let r=t.args&&t.args.radius;if(n.radius!==void 0&&r&&r.kind!==`number`&&(n.dynamic=!0),e.kind===`grid`&&(n.anchor=t.args.anchor,ep(t)&&(n.dynamic=!0)),e.law){n.law=e.law,n.lawAt=e.values;let t=e.law.describe();(t.params.some(e=>e.kind===`host`)||t.range&&t.range.kind===`host`||t.builtIns.indexOf(`step`)>=0)&&(n.dynamic=!0)}})});let c=Object.values(o),l=c.some(e=>e.dynamic),u=new Float32Array(i*64);return{perStep:l,fill(t,n){let r=l?t:1;u.length<r*i&&(u=new Float32Array(r*i));for(let t=0;t<r;t++){let r=n+t,a=e.stepContext(r),o=u.subarray(t*i,(t+1)*i);t===0?d(o,a):o.set(u.subarray(0,i));for(let e of c){if(t>0&&!e.dynamic)continue;let n=f(o,e,a);if(n)return{count:t,data:u,perStep:l,halt:{message:`${n} at step ${r}`,stages:[e.name]}}}}return{count:t,data:u,perStep:l}}};function d(e,n){let i=n.settings;Object.keys(__).forEach(t=>{a[t]!==void 0&&(e[a[t]]=i[__[t]])}),a.n!==void 0&&(e[a.n]=n.store.n);for(let n=0;n<t.D;n++)e[a[`origin_`+n]]=r[n];a.maxVelocity!==void 0&&(e[a.maxVelocity]=i.maxVelocity>0?i.maxVelocity:1)}function f(i,a,o){let s=e.stageValues(a.name,o);if(a.gate!==void 0&&(i[a.gate]=+!!s.when),a.radius!==void 0){let e=y_(s.radius);if(e)return`the radius of ${a.name} is ${e}`;i[a.radius]=s.radius}for(let e of a.params){let t=s.params[e.name],r=y_(t);if(r)return`the parameter ${e.name} of ${a.name} is ${r}`;(Wu(t)||t!==0&&Math.fround(t)===0)&&n(`the parameter ${e.name} of ${a.name} is ${t}, which a 32-bit float may hold as 0`),i[e.index]=t}for(let e of a.builtIns)i[e.index]=s.builtIns[e.name];if(a.grid.length){let e=Zf(s);if(e)return`the ${e.name} of ${a.name} is ${y_(e.value)}`;let n=$f(s,r,t.D,a.anchor);for(let e of a.grid)i[e.index]=n[e.name]}if(a.law){let e=s.lawValues||s.law.values,t=nd(a.law,e);if(t)return`the law's ${t.name} of ${a.name} is ${t.problem}`;rd(a.law,e).forEach(n),ed(a.law,i,a.lawAt,e)}return null}}function y_(e){return!Number.isFinite(e)||Math.abs(e)>34028234663852886e22?`${e}, which does not fit a 32-bit float`:null}var b_=16777216,x_=1024,S_=16,C_=`@group(0) @binding(0) var<uniform> count: vec4u;
@group(0) @binding(1) var<storage, read> pos: array<f32>;
@group(0) @binding(2) var<storage, read> toDevice: array<u32>;
@group(0) @binding(3) var<storage, read_write> out: array<f32>;
@compute @workgroup_size(256)
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let row = gid.x;
  if (row >= count.x) { return; }
  let D = count.y;
  let src = toDevice[row] * D;
  for (var k = 0u; k < D; k++) { out[row * D + k] = pos[src + k]; }
}`;async function w_(e,{simulator:t,plan:n,fireState:r,warn:i,slowdown:a=1,pairEstimate:o=1}){let s=t.store,c=t.springStore,l=n.D,u=s.n,d=n.cap,f=Uh(n),p={},m=n.kernelList.filter(e=>e.kind!==`host`),[h,g]=await Promise.all([Vg(e),n.permuted?wu(e,{code:C_,label:`UNPERMUTE`}):null].concat(m.filter(e=>e.kind!==`grid`).map(t=>wu(e,{code:f[t.name],label:t.name,bindings:_h(t)}).then(e=>{p[t.name]=e})))),_=Mm(s.pos,u,l),v=n.permuted?Lm(s.pos,u,l):null,y=v?e=>v[e]:e=>e,b=GPUBufferUsage.STORAGE,x=GPUBufferUsage.COPY_DST,S=GPUBufferUsage.COPY_SRC,C=[];e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`);let w=(t,n,r)=>{let i=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n,label:r});return C.push(i),i},T=w(16,GPUBufferUsage.UNIFORM|x,`P`),E=w(n.S.size*4,b|x|S,`S`),D=w(n.H.size*4,b|x,`H`),O=[w(d*l*4,b|x|S,`X`),w(d*l*4,b|x|S,`Y`)],k=k_(c,u,v),A=n.groupColumns.map(e=>N_(s[e],u,v)),j=n.groupColumns.find((e,t)=>A[t].count!==P_(n,e));if(j)throw Error(`the groups of ${j} changed while the plan was made`);let M=n.chunked?j_(k,u):null,N=A_(k,M,A,u,c.n),P=w(N.byteLength,b|x,`L`);e.queue.writeBuffer(P,0,N);let F=Math.max(1,Math.ceil(u/256));e.queue.writeBuffer(T,0,new Uint32Array([u,F,Math.min(256,F),c.n]));let I=new Float32Array(n.S.size),L=new Float32Array(n.H.size),R=null;if(Object.values(n.columns).forEach(e=>{if(e.buffer===`X`)return;let t=e.buffer===`S`?I:L,n=s[e.name],r=u*e.width;if(T_(t,e.offset,n,u,e.width,v),e.type!==`f64`&&e.type!==`f32`){for(let t=0;t<r;t++)if(Math.abs(n[t])>b_){R=e.name;break}}}),Object.values(n.linkColumns).forEach(e=>{M_(e,c[e.name],e.order===`csr`?L:I,k)&&(R=e.name)}),R)throw Error(`the column ${R} holds integers above 2^24, which 32-bit floats cannot hold exactly`);if(n.tables.forEach(e=>L.set(e.values,e.offset)),n.rowColumn)for(let e=0;e<u;e++)L[n.rowColumn.offset+y(e)]=e;let z=t.sums();Object.values(n.sums).forEach(e=>{let t=z[e.name];if(t){if(e.grouped){let n=Math.min(e.count,t.count||0)*e.width;for(let r=0;r<n;r++)I[e.offset+r]=t.groups[r]}else if(t.value)for(let n=0;n<e.width;n++)I[e.offset+n]=t.value[n]}}),I.set(r||[.1,0,0,0],n.S.fire),e.queue.writeBuffer(E,0,I),e.queue.writeBuffer(D,0,L);let ee=Nm(s.pos,u,l,_);e.queue.writeBuffer(O[0],0,v?D_(ee,u,l,v):ee);let B=null,te=null;if(v){let t=w(16,GPUBufferUsage.UNIFORM|x,`unpermute count`),n=w(u*4,b|x,`toDevice`);B=w(u*l*4,b|S,`ordered positions`),e.queue.writeBuffer(t,0,new Uint32Array([u,l,0,0])),e.queue.writeBuffer(n,0,v),te=[0,1].map(r=>e.createBindGroup({layout:g.getBindGroupLayout(0),entries:[t,O[r],n,B].map((e,t)=>({binding:t,resource:{buffer:e}}))}))}let ne=v_(t,n,i,_),re=ne.perStep?x_:1,ie=w(re*n.slot.bytes,GPUBufferUsage.UNIFORM|x,`V`),ae=(await Promise.all([e.popErrorScope(),e.popErrorScope()])).find(Boolean);if(ae)throw C.forEach(e=>e.destroy()),Error(`could not create the GPU buffers: `+ae.message);let V=null;if(n.pyramid){try{V=await e_(e,n.pyramid,{buffers:{X:O,S:E,H:D},step:{buffer:ie,size:n.slot.bytes,dynamic:!0},workCap:Xg/a,slowdown:a})}catch(e){throw C.forEach(e=>e.destroy()),e}V.setValues({gravity:0},null)}let oe=null;if(n.pairs){try{oe=await f_(e,n.pairs,{buffers:{X:O,S:E,H:D},step:{buffer:ie,size:n.slot.bytes},positions:s.pos,estimateScale:o})}catch(e){throw C.forEach(e=>e.destroy()),V&&V.destroy(),e}a>1&&oe.setCap(n.pairs.cap/a)}let se=oe?oe.cappedMs():0,ce=()=>oe.cappedMs()===se?se*a:oe.cappedMs(),H=[];oe&&H.push({buffer:oe.status.buffer,offset:0,size:oe.status.bytes,message:e=>oe.statusMessage(e),observe:e=>oe.observe(e),stages:n.pairs.stages.map(e=>e.name)}),V&&V.status&&H.push(Object.assign({message:V.statusMessage,observe:e=>V.observe(e),stages:n.pyramid.channels.map(e=>e.stage)},V.status));let U=new Map;try{for(let t of m){if(t.kind!==`grid`)continue;let r=await g_(e,t.section.grid,{buffers:{X:O,S:E,H:D},step:{buffer:ie,size:n.slot.bytes,dynamic:!0},slowdown:a});U.set(t,r);let i=t.section.stage.name;H.push(Object.assign({message:e=>rp(e,t.section.grid,i),observe:r.observe?e=>r.observe(e):null,stages:[i]},r.status))}}catch(e){throw C.forEach(e=>e.destroy()),U.forEach(e=>e.destroy()),V&&V.destroy(),oe&&oe.destroy(),e}let le=H.reduce((e,t)=>e+t.size,0),ue=t=>[0,1].map(r=>e.createBindGroup({layout:p[t.name].getBindGroupLayout(0),entries:[T,{buffer:ie,size:n.slot.bytes},E,D,P,O[r],O[1-r]].concat(t.tree?[V.buffers.TP,V.buffers.treeSp,V.buffers.treeMeta,V.buffers.treeCells]:[]).map((e,t)=>({binding:t,resource:e.buffer?e:{buffer:e}}))})),W=0,de=Hg(s,u,l,_,ee),fe=Object.values(n.columns).filter(e=>e.buffer===`S`&&e.name!==`force`&&s[e.name]),pe=De(),me=Ce(),he=t.bodies.slice(),ge=m.map(e=>e.kind===`grid`?{kernel:e,grid:U.get(e),gates:e.gates.every(e=>e!==void 0)?e.gates:null}:{kernel:e,pipeline:p[e.name],bind:ue(e),groups:be(e),gates:ye(e)}),_e=[[]];n.kernelList.forEach(e=>{e.kind===`host`?_e.push([]):_e[_e.length-1].push(ge.find(t=>t.kernel===e))});let ve=null;function ye(e){if(e.kind===`reduce`||e.kind===`groupRuns`||e.kind===`groupSum`||e.kind===`chunks`)return e.gates.every(e=>e!==void 0)?e.gates:null;if(e.kind!==`node`&&e.kind!==`link`)return null;let t=[];for(let n of e.sections)if(n.kind===`pairs`||n.kind===`tree`){if(n.channels.some(e=>e.gate===void 0))return null;n.channels.forEach(e=>t.push(e.gate))}else if(n.gate===void 0)return null;else t.push(n.gate);return t.length?t:null}function be(e){if(e.kind===`reduce`||e.kind===`fireState`)return 1;if(e.kind===`fireReduce`)return Math.min(256,F);if(e.kind===`link`)return Math.max(1,Math.ceil(c.n/256));if(e.kind===`chunks`)return Math.max(1,Math.ceil(M.chunks/256));let t=e.column===void 0?null:A[n.groupColumns.indexOf(e.column)];return e.kind===`groupRuns`?Math.max(1,Math.ceil(t.runs/256)):e.kind===`groupSum`?Math.max(1,Math.ceil(t.count/256)):F}return{kind:n.regime,n:u,D:l,get fence(){return O.slice()},positionBytes:u*l*4,kernelStages:n.kernelStages,prepare(t,r){let i=Ce();if(n.groupColumns.some(e=>i.groups[e]!==me.groups[e]))return`sync`;if(t){let t=Nm(s.pos,u,l,_);de.reset(t),e.queue.writeBuffer(O[W],0,v?D_(t,u,l,v):t),Ee(e=>n.columns[e].buffer!==`X`),pe=De()}else{if(i.pos!==me.pos){let e=de.written(),t=de.uploaded(e,r);h(O[W],0,l,v?e.map(y):e,t)}i.velocity!==me.velocity&&ke(n.columns.velocity,Oe(n.columns.velocity)),fe.forEach(e=>{e.name!==`velocity`&&i.columns[e.name]!==me.columns[e.name]&&ke(e,Oe(e))}),Ee(e=>n.columns[e].buffer===`H`&&i.columns[e]!==me.columns[e])}return Object.keys(n.linkColumns).forEach(e=>{(t||i.links[e]!==me.links[e])&&we(e)}),me=i,R?{halt:R}:`ok`},segments:_e.length,statusBytes:le,copyStatus:xe,statusMessage:Se,run(t,r,{timestampWrites:i=null,beforeFinish:a=null,perSubmit:o=64,segment:s}={}){let c=s===void 0?ge:_e[s],l=s===void 0||s===_e.length-1,u=ne.fill(t,r),d=u.count;if(d===0)return{ran:d,halt:u.halt};let f=n.slot.floats,p=!u.perStep&&O_(u.data,ve,f);!u.perStep&&!p&&(ve=u.data.slice(0,f),e.queue.writeBuffer(ie,0,ve)),u.perStep&&(ve=null);for(let t=0;t<d;){let r=Math.min(o,d-t,u.perStep?re:1/0);u.perStep&&e.queue.writeBuffer(ie,0,u.data,t*f,r*f);let s=e.createCommandEncoder(),p=t===0,m=t+r===d,h;i&&(p||m)&&(h={querySet:i.querySet},p&&(h.beginningOfPassWriteIndex=0),m&&(h.endOfPassWriteIndex=1));let g=s.beginComputePass(h?{timestampWrites:h}:void 0),_=h&&h.endOfPassWriteIndex!==void 0?{timestampWrites:{querySet:h.querySet,endOfPassWriteIndex:1}}:void 0,v=()=>(g.end(),e.queue.submit([s.finish()]),s=e.createCommandEncoder(),g=s.beginComputePass(_),g);for(let e=0;e<r;e++){let r=[(u.perStep?e:0)*n.slot.bytes],i=u.data.subarray((u.perStep?t+e:0)*f);for(let{kernel:e,pipeline:t,bind:n,groups:a,gates:o,grid:s}of c)o&&o.every(e=>i[e]===0)||(s?s.encode(g,{stepOffset:r[0],parity:W}):(e.tree&&V.encode(g,{stepOffset:r[0],parity:W}),e.pairStages&&(g=oe.encode(g,{stepOffset:r[0],parity:W,values:i,stages:e.pairStages,split:v})),g.setPipeline(t),g.setBindGroup(0,n[W],r),g.dispatchWorkgroups(a)));l&&(W^=1)}g.end(),m&&a&&a(s),e.queue.submit([s.finish()]),t+=r}return{ran:d,halt:u.halt}},copyPositions(e,t,n,r=S_){if(v&&r>=S_){let r=e.beginComputePass();return r.setPipeline(g),r.setBindGroup(0,te[W]),r.dispatchWorkgroups(Math.ceil(u/256)),r.end(),e.copyBufferToBuffer(B,0,t,n,u*l*4),!0}return e.copyBufferToBuffer(O[W],0,t,n,u*l*4),!v},readPositions(e,n,r,i){if(!r)return Rm(t,he)?Im(t,he,e,v,_,n,null,l):de.readBack(i,s.versions.pos!==me.pos,()=>Im(t,he,e,v,_,n,de.mirror,l));let a=()=>Pm(t,he,e,l,_,n);return Rm(t,he)?a():de.readBack(i,s.versions.pos!==me.pos,()=>{let t=a();return de.mirror.set(e.subarray(0,u*l)),t})},async readDevice(){let r=Object.values(n.columns).filter(e=>e.buffer===`S`),i=u*l*4,a=Math.ceil(i/8)*8,o=Math.ceil((a+n.S.size*4)/8)*8,d=e.createBuffer({size:Math.max(16,o+le),usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),f=e.createCommandEncoder();this.copyPositions(f,d,0,S_),f.copyBufferToBuffer(E,0,d,a,n.S.size*4),le&&xe(f,d,o),e.queue.submit([f.finish()]);try{await d.mapAsync(GPUMapMode.READ)}catch{return d.destroy(),null}let p=new Float32Array(d.getMappedRange(0,i)).slice(),m=new Float32Array(d.getMappedRange(a,n.S.size*4)).slice(),h=le?Se(new Uint32Array(d.getMappedRange(o,le))):null;return d.unmap(),d.destroy(),{positions:p,status:h,fireState:Array.from(m.subarray(n.S.fire,n.S.fire+4)),apply(){let e=fe.map(e=>{let t=(e.name===`velocity`?s.versions.velocity:s.versions[e.name])===(e.name===`velocity`?me.velocity:me.columns[e.name])?[]:Oe(e),n=e.width;return{column:e,rows:t,values:t.map(t=>Array.from(s[e.name].subarray(t*n,t*n+n)))}});r.forEach(e=>{if(e.name===`force`)return;let t=s[e.name];t&&E_(t,m,e.offset,u,e.width,v)}),pe=De(),e.forEach(({column:e,rows:t,values:n})=>{let r=e.width,i=s[e.name];t.forEach((e,t)=>{for(let a=0;a<r;a++)i[e*r+a]=n[t][a]})}),Object.values(n.linkColumns).forEach(e=>{let t=c[e.name];if(e.order===`link`&&t)for(let n=0;n<c.n;n++)t[n]=m[e.offset+n]});let i=t.sums();Object.values(n.sums).forEach(e=>{let t=i[e.name];if(t){if(e.grouped){let n=t.resize(e.count);for(let t=0;t<e.count*e.width;t++)n[t]=m[e.offset+t]}else if(t.value)for(let n=0;n<e.width;n++)t.value[n]=m[e.offset+n]}})}}},pairs:!!oe,get cappedMs(){let e=[...U].reduce((e,[t,n])=>e+(n.cappedMs?n.cappedMs():tp(t.section.grid)*a),0);return(oe?n.pairs.stages.length*ce():0)+(V?V.cappedMs():0)+e},pairSlices:()=>oe?oe.slices():[],observeTiming(e){oe&&oe.observeTime(e),V&&V.observeTime(e);let t=!!oe&&oe.slices().some(e=>e>0);U.forEach(n=>{n.observeTime&&n.observeTime(e,{sliced:t})})},destroy(){C.forEach(e=>e.destroy()),V&&V.destroy(),oe&&oe.destroy(),U.forEach(e=>e.destroy())}};function xe(e,t,n){let r=n;H.forEach(n=>{e.copyBufferToBuffer(n.buffer,n.offset,t,r,n.size),r+=n.size})}function Se(e){let t=0;for(let n of H){n.observe&&n.observe(e.subarray(t,t+n.size/4));let r=n.message(e.subarray(t,t+n.size/4));if(r)return{message:r,stages:n.stages};t+=n.size/4}return null}function Ce(){let e={pos:s.versions.pos,velocity:s.versions.velocity,columns:Object.create(null),links:Object.create(null),groups:Object.create(null)};return Object.keys(n.columns).forEach(t=>{e.columns[t]=s.versions[t]}),Object.keys(n.linkColumns).forEach(t=>{e.links[t]=c.versions[t]}),n.groupColumns.forEach(t=>{e.groups[t]=s.versions[t]}),e}function we(t){let r=n.linkColumns[t],i=new Float32Array(r.order===`csr`?2*c.n:c.n);M_(Object.assign({},r,{offset:0}),c[t],i,k),e.queue.writeBuffer(r.order===`csr`?D:E,r.offset*4,i)}function Te(t){let r=n.columns[t],i=new Float32Array(u*r.width);T_(i,0,s[t],u,r.width,v),e.queue.writeBuffer(r.buffer===`S`?E:D,r.offset*4,i)}function Ee(e){Object.keys(n.columns).forEach(t=>{e(t)&&Te(t)})}function De(){let e=Object.create(null);return fe.forEach(t=>{e[t.name]=Float64Array.from(s[t.name].subarray(0,u*t.width))}),e}function Oe(e){let t=s[e.name],n=pe[e.name],r=e.width,i=[];for(let e=0;e<u*r;e++){let a=Math.floor(e/r);!Object.is(t[e],n[e])&&i[i.length-1]!==a&&i.push(a)}return i}function ke(e,t){let n=e.width,r=new Float32Array(t.length*n),i=s[e.name],a=pe[e.name];t.forEach((e,t)=>{for(let o=0;o<n;o++)r[t*n+o]=a[e*n+o]=i[e*n+o]}),h(E,e.offset,n,v?t.map(y):t,r)}}function T_(e,t,n,r,i,a){if(a)for(let o=0;o<r;o++){let r=t+a[o]*i;for(let t=0;t<i;t++)e[r+t]=n[o*i+t]}else for(let a=0,o=r*i;a<o;a++)e[t+a]=n[a]}function E_(e,t,n,r,i,a){if(a)for(let o=0;o<r;o++){let r=n+a[o]*i;for(let n=0;n<i;n++)e[o*i+n]=t[r+n]}else for(let a=0,o=r*i;a<o;a++)e[a]=t[n+a]}function D_(e,t,n,r){let i=new Float32Array(e.length);return T_(i,0,e,t,n,r),i}function O_(e,t,n){if(!t)return!1;for(let r=0;r<n;r++)if(!Object.is(e[r],t[r]))return!1;return!0}function k_(e,t,n){let r=e.n,i=e.from,a=e.to;n&&(i=Uint32Array.from(i.subarray(0,r),e=>n[e]),a=Uint32Array.from(a.subarray(0,r),e=>n[e]));let o=new Uint32Array(t+1);for(let e=0;e<r;e++)o[i[e]+1]++,o[a[e]+1]++;for(let e=0;e<t;e++)o[e+1]+=o[e];let s=o.slice(0,t),c=new Uint32Array(2*r),l=new Uint32Array(2*r),u=new Uint32Array(r);for(let e=0;e<r;e++){let t=i[e],n=a[e],r=s[t]++;c[r]=n,l[r]=e,u[e]=r;let o=s[n]++;c[o]=t,l[o]=(e|2147483648)>>>0}return{starts:o,other:c,linkRole:l,fromEntry:u,from:i,to:a,m:r}}function A_(e,t,n,r,i){let a=r+1+7*i,o=a+1+n.length+(t?t.words.length:0);n.forEach(e=>{o+=e.words.length});let s=new Uint32Array(Math.max(4,o));s.set(e.starts,0),s.set(e.other,r+1),s.set(e.linkRole,r+1+2*i),s.set(e.fromEntry,r+1+4*i);for(let t=0;t<i;t++)s[r+1+5*i+t]=e.from[t],s[r+1+6*i+t]=e.to[t];let c=a+1+n.length;return t&&(s[a]=c,s.set(t.words,c),c+=t.words.length),n.forEach((e,t)=>{s[a+1+t]=c,s.set(e.words,c),c+=e.words.length}),s}function j_(e,t){let n=e.starts,r=0;for(let e=0;e<t;e++)r+=Math.ceil((n[e+1]-n[e])/8);let i=new Uint32Array(2+t+2*r);i[0]=r;let a=0;for(let e=0;e<t;e++){i[1+e]=a;for(let o=n[e];o<n[e+1];o+=8,a++)i[2+t+a]=e,i[2+t+r+a]=o}return i[1+t]=a,{words:i,chunks:r}}function M_(e,t,n,r){let i=r.m,a=!1,o=e.type!==`f64`&&e.type!==`f32`;if(e.order===`csr`)for(let a=0;a<2*i;a++)n[e.offset+a]=t[r.linkRole[a]&2147483647];else for(let r=0;r<i;r++)n[e.offset+r]=t[r];if(o){for(let e=0;e<i;e++)if(Math.abs(t[e])>b_){a=!0;break}}return a}function N_(e,t,n){let r=[];for(let n=0;n<t;n++)e[n]>=0&&r.push(n);r.sort((t,n)=>Math.floor(e[t])-Math.floor(e[n])||t-n);let i=r.length?Math.floor(e[r[r.length-1]])+1:0,a=[],o=Array(i+1).fill(-1),s=-1,c=0;r.forEach((t,n)=>{let r=Math.floor(e[t]);if(r!==s||c===256){if(r!==s){for(let e=s+1;e<=r;e++)o[e]=a.length;s=r}a.push(n),c=0}c++});let l=a.length;a.push(r.length);for(let e=s+1;e<=i;e++)o[e]=l;let u=new Uint32Array(3+r.length+l+1+i+1);return u[0]=l,u[1]=i,u[2]=r.length,u.set(n?r.map(e=>n[e]):r,3),u.set(a,3+r.length),u.set(o,3+r.length+l+1),{words:u,runs:l,count:i}}function P_(e,t){let n=Object.values(e.sums).find(e=>e.column===t);return n?n.count:0}var F_=3,I_=30,L_=64,R_=8,z_=1024,B_=100,V_=1e3,H_=4,U_=[`gravity`,`springLength`,`springCoefficient`,`dragCoefficient`,`timeStep`,`maxVelocity`,`integrator`,`theta`,`nbody`,`adaptiveTimeStepWeight`],W_=[`integrator`,`nbody`,`inertia`,`repulsionCharge`,`repulsionSensitivity`],G_=[`from`,`to`,`length`,`coefficient`];async function K_(e,t){if(!e||!e.simulator)throw Error(`runOnGpu() needs a layout made by ngraph.forcelayout`);if(!t||!t.device)throw Error(`runOnGpu() needs a backend from createWebGPUBackend()`);let n=e.simulator;if(n.getStage(`runsOnGpu`))throw Error(`this layout already runs on the GPU`);if(Cu(t.device).lost)throw J_([ug]);let r=n.plan(t);if(!r.runs)throw J_(r.reasons);let i=Y_(e,t);return await i.start(),i.api}function q_(e){return e.reasons.concat(Object.keys(e.stages).filter(t=>!e.stages[t].runs).map(t=>t+`: `+e.stages[t].reason))}function J_(e){let t=Error(`WebGPU cannot run this layout: `+e.join(`; `));return t.reasons=e,t}function Y_(e,t){let n=e.simulator,r=n.store,i=n.springStore,a=t.device,o=Cu(a),s=a.features.has(`timestamp-query`),c={readback:[],error:[]},l=null,u=null,d=n.iteration(),f=0,p=0,m=null,h=null,g=!1,_=!1,v=!1,y=!1,b=!1,x=!1,S=null,C=null,w=null,T=0,E=1,D=null,O=[],k=[],A=null,j=null,M=0,N=0,P=0,F=0,I=new Map,L=[],R=null,z=0,ee=!1,B=()=>{x=!0},te=()=>{b=!0},ne=()=>{g=!0,_e(),n.iteration(d+P)},re=e=>{_||(v=!0,e.lost?be({lost:!0,message:e.message,kernel:null,stages:[]}):be(xe(e.message)))},ie={step:se,sync:pe,stop:ge,on(e,t){if(!c[e])throw Error(`gpu.on(): unknown event ${e}; use 'readback' or 'error'`);return c[e].push(t),ie},off(e,t){return c[e]&&(c[e]=c[e].filter(e=>e!==t)),ie},stats:ke,get lastMove(){return z},get halted(){return h},_debug:{get fence(){return u?u.fence:[]},get engine(){return u}}};return{start:ae,api:ie};async function ae(){n.addStage(op,V,{before:n.stages()[0],describe:{shape:`guard`,how:`stops layout.step() while the GPU runs the layout`}}),n.on(`settings`,B),n.on(`topology`,te),e.on(`disposed`,ne),o.listeners.add(re),s&&(A=a.createQuerySet({type:`timestamp`,count:2}),j=a.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}));try{T=await Ou(a),E=t.slowdown||await Ru(a),await oe()}catch(e){throw _e(),e}}function V(){throw Error(`this layout runs on the GPU; call gpu.step(), or await gpu.stop() first`)}async function oe(){n.applyEdits(),b=!1;let e=n.program();if(t.gridCheck&&e.stages.some(e=>e.shape===`grid`)&&await t.gridCheck,l=t.lower(e,n),!l.runs)throw J_(q_(l));let o=l.plan;S=Ce(e.version),C=G_.map(e=>i.versions[e]),D=Ee(o);let s=o.template===`grid`?qg:w_,c=r.n>0?await s(a,{simulator:n,plan:o,fireState:w,warn:Q_,slowdown:E,pairEstimate:t.pairEstimate}):null;_?c&&c.destroy():(u=c,y=!1,x=!1,F=f,ye())}function se(e=1){e=Math.floor(e),!(!(e>0)||g||h)&&(m?p+=e:ce()?H(e):p+=e)}function ce(){if(n.applyEdits(),b||Te())return he(),!1;if(x=!1,!u)return!0;if(i.versions.from!==C[0]||i.versions.to!==C[1])return he(),!1;if(i.versions.length!==C[2]||i.versions.coefficient!==C[3]){let e=t.lower(n.program(),n);if(!e.runs)return be({message:J_(q_(e)).message,kernel:null,stages:[`springs`]}),!1;if(C=G_.map(e=>i.versions[e]),e.plan.dataKey!==l.plan.dataKey)return he(),!1}let e=u.prepare(y,f);return y=!1,e===`sync`?(he(),!1):e&&e.halt?(be({message:e.halt,kernel:null,stages:[]}),!1):!0}function H(e){if(!u){f+=e;return}let t=l.plan&&l.plan.hostSteps||[];for(let r=0;t.length&&r<e;r++){let i=d+f+r;if(t.some(e=>n.stageValues(e,n.stepContext(i)).when)){if(r>0&&le(r),h)return;p+=e-r-1,m=U(d+f).then(()=>{if(m=null,p&&!h&&!g){let e=p;p=0,se(e)}},e=>{m=null,be({message:e.message,kernel:null,stages:[]})});return}}le(e)}async function U(e){let t=l.plan.hostSteps,r=u;for(let i=0;i<u.segments;i++){if(u.run(1,e,{segment:i}),i===t.length||!n.stageValues(t[i],n.stepContext(e)).when)continue;if(await me(),_||h||r!==u)return;n.iteration(e);try{n.getStage(t[i])(n.store,n)}catch(e){throw Error(`the host step ${t[i]} failed: ${e.message}`)}let a=u.prepare(!1,f);if(a&&a.halt)throw Error(a.halt)}f+=1}function le(e){let t=O.pop(),n=!!t&&s,r=X_(u.positionBytes),i=u.run(e,d+f,{timestampWrites:n?{querySet:A}:null,perSubmit:ue(),beforeFinish:t?i=>{t.ordered=u.copyPositions(i,t.buffer,0,e),n&&(i.resolveQuerySet(A,0,2,j,0),i.copyBufferToBuffer(j,0,t.buffer,r,16)),u.statusBytes&&u.copyStatus(i,t.buffer,r+16)}:null});f+=i.ran,i.ran&&t?W(t,i.ran,n):t&&O.push(t),i.halt&&be({message:i.halt.message,kernel:null,stages:i.halt.stages||[]})}function ue(){let e=De(),t=u&&u.cappedMs?Math.max(1,Math.floor(V_/u.cappedMs)):z_;if(!(e>0))return Math.min(t,u&&u.pairs?R_:L_);let n=Math.floor(B_/e),r=Math.ceil(T/(.1*e));return Math.max(1,Math.min(z_,t,Math.max(n,r)))}function W(e,t,n){e.serial=++M,I.set(e.serial,performance.now()),e.steps=f,e.count=t;let r=u;e.buffer.mapAsync(GPUMapMode.READ).then(()=>{if(_){e.buffer.destroy();return}let i=e.engine.positionBytes,a=I.get(e.serial+1),o=a!==void 0&&a-I.get(e.serial)<H_;I.delete(e.serial);let s=r===u&&u.statusBytes?u.statusMessage(new Uint32Array(e.buffer.getMappedRange(X_(i)+16,u.statusBytes))):null;if(s&&(v=!0),e.serial>N&&r===u&&!o&&!v&&de(e.serial,e.steps,new Float32Array(e.buffer.getMappedRange(0,i)),e.ordered),n){let n=new BigUint64Array(e.buffer.getMappedRange(X_(i),16)),r=Number(n[1]-n[0]);n[1]>n[0]&&r<6e10&&Oe(r/1e6,t)}else{let t=performance.now();R&&e.steps>R.steps&&Oe(t-R.time,e.steps-R.steps),R={time:t,steps:e.steps}}e.buffer.unmap(),e.engine===u?O.push(e):e.buffer.destroy(),s?be({message:`${s.message} (by step ${d+e.steps})`,kernel:null,stages:s.stages||[],status:!0}):fe()},()=>{I.delete(e.serial)}).catch(t=>{e.buffer.mapState===`mapped`&&e.buffer.unmap(),e.engine===u&&O.indexOf(e)<0&&O.push(e),be({message:`reading positions back failed: `+t.message,kernel:null,stages:[]})})}function de(e,t,r,i){N=e;let a=t-P,o=u.readPositions(r,Math.max(1,a),i,t);a>0&&o!==null&&(z=o),P=t,n.iteration(d+t)}function fe(){if(P===F||h||_)return;F=P;let t=D.map(e=>e.read());e.lastMove=z;try{e.fire(`step`)}catch(e){be({message:`a 'step' listener failed: `+e.message,kernel:null,stages:[]});return}let n=D.findIndex((e,n)=>e.read()!==t[n]);if(n>=0){be({message:`a 'step' listener changed ${D[n].name}. On the GPU, 'step' fires once per readback, not after every step, so listeners must not change the physics: use a formula, a sum, a host step, or a 'settings' listener`,kernel:null,stages:[]});return}let i=r.n===0||z/r.n<=.01;i!==ee&&(ee=i,e.fire(`stable`,i));try{Ae(`readback`,{steps:d+P,lastMove:z})}catch(e){be({message:`a 'readback' listener failed: `+e.message,kernel:null,stages:[]})}}async function pe(){for(;m;)await m;if(!_){if(p&&!h){let e=p;for(p=0,se(e);m;)await m}_||!u||v?y=!0:(await me(),y=!0,fe())}}async function me(){let e=++M,t=f,n=u;I.set(e,performance.now());let r=await u.readDevice();I.delete(e),!(!r||_||n!==u||v)&&(r.status?(v=!0,be({message:`${r.status.message} (by step ${d+t})`,kernel:null,stages:r.status.stages||[],status:!0})):(e>N&&de(e,t,r.positions,!0),r.apply(),w=r.fireState))}function he(){m=(async()=>{u&&!v&&await me(),ve(),await oe()})().then(()=>{if(m=null,p&&!h&&!g){let e=p;p=0,se(e)}},e=>{m=null,be({message:e.message,kernel:e.kernel||null,stages:e.kernel?Se(e.kernel):[]})})}async function ge(){if(g)return n.iteration();try{await pe()}catch{}return g=!0,_e(),n.iteration(d+P),n.iteration()}function _e(){_||(_=!0,p=0,n.removeStage(op),n.off(`settings`,B),n.off(`topology`,te),e.off(`disposed`,ne),o.listeners.delete(re),ve(),A&&A.destroy(),j&&j.destroy())}function ve(){u&&u.destroy(),u=null;for(let e of k)O.indexOf(e)>=0&&e.buffer.destroy();k.length=0,O.length=0}function ye(){if(!u)return;let e=Math.max(16,X_(u.positionBytes)+16+(u.statusBytes||0));for(let t=0;t<F_;t++){let t={buffer:a.createBuffer({size:e,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),engine:u};k.push(t),O.push(t)}}function be(e){h||_||(h=e,p=0,Ae(`error`,e))}function xe(e){let t=(u?Object.keys(u.kernelStages):[]).find(t=>e.indexOf(`"`+t+`"`)>=0)||null;return{message:e,kernel:t,stages:t?Se(t):[]}}function Se(e){let t=u&&u.kernelStages[e];return t?t.slice():[]}function Ce(e){let t=n.stages();return{names:t,runs:t.map(e=>n.getStage(e)),columns:r.columnsVersion+i.columnsVersion,version:e,settings:we()}}function we(){let e=n.settings;return W_.map(t=>e[t]).concat(e.adaptiveTimeStepWeight>0)}function Te(){if(we().some((e,t)=>!Object.is(e,S.settings[t])))return!0;if(n.programVersion)return n.programVersion()!==S.version;let e=n.stages();if(e.length!==S.names.length)return!0;for(let t=0;t<e.length;t++)if(e[t]!==S.names[t]||n.getStage(e[t])!==S.runs[t])return!0;return r.columnsVersion+i.columnsVersion!==S.columns||x&&n.program().version!==S.version}function Ee(e){let t=(e.reads||[`pos`,`velocity`,`mass`,`pinned`]).map(e=>({name:`the column `+e,read:()=>r.versions[e]}));return G_.concat(Object.keys(e.linkColumns||{}).filter(e=>G_.indexOf(e)<0)).forEach(e=>t.push({name:`the link column `+e,read:()=>i.versions[e]})),U_.forEach(e=>t.push({name:`the setting `+e,read:()=>n.settings[e]})),t.push({name:`the repulsion law`,read:()=>n.repulsionLaw()}),t.push({name:`the inertia`,read:()=>n.settings.inertia}),t}function De(){let e=0,t=0;for(let n of L)e+=n.ms,t+=n.steps;return t?e/t:0}function Oe(e,t){u&&u.observeTiming&&u.observeTiming(e/t),L.push({ms:e,steps:t}),L.length>I_&&L.shift()}function ke(){return{msPerStep:De(),source:s?`gpu-timestamps`:`wall-clock`,steps:d+f,engine:u?u.kind:`none`,nodes:u?u.n:0,stepsPerSubmit:ue(),slowdown:E,halted:h?h.message:null}}function Ae(e,t){c[e].slice().forEach(e=>e(t))}}function X_(e){return Math.ceil(e/8)*8}var Z_=new Set;function Q_(e){Z_.has(e)||(Z_.add(e),console.warn(`ngraph.forcelayout.gpu: `+e))}async function $_(e={}){let t=e.device||await Su(lg);if(!t)return null;let n=Cu(t),r={};for(let e of lg)r[e]=t.limits[e];let i=e.gridArithmetic;r.gridArithmetic=i&&!i.then?i:Mg;let a=Promise.resolve(i||Ng(t)).then(e=>(r.gridArithmetic=e,e));return Object.assign(mg(r,{generic:!!e.generic,smallGraph:e.smallGraph,renumber:e.renumber,lost:()=>!!n.lost}),{device:t,pairEstimate:e.pairEstimate||1,slowdown:e.slowdown||0,gridCheck:a})}var ev=2432236799,tv=[`timeStep`,`springLength`,`springCoefficient`,`dimensions`,`dragCoefficient`,`gravity`,`theta`,`maxVelocity`,`integrator`,`nbody`];function nv(e,t={},n={}){let r,i,a,o,s,c=`cpu`,l,u=null,d=``,f=``,p=Promise.resolve(),m=!1,h=!1,g=!1,_,v=n.stepsPerFrame||1,y=n.placement||`default`,b=``,x=null,S={},C=null,w=rv();return El.on(`load-graph`,T),{dispose:oe,runLayout:ee,updateLayoutSettings:B,setFixedViewBox:ne,setStepsPerFrame:P,setPlacement:N,setBackend:F,setPrototype:D,setPrototypeParams:O,finishPrototype:j,restart:E,getStats:R};function T(e,n){a&&(a.dispose(),u=null,A(),i.dispose(),a=null,cancelAnimationFrame(_)),a=re(),r=e,window.graph=r,al(a,{showGrid:!0,lineColor:4294967056,maxAlpha:16,showCursor:!1}),i=iu(r,t),M(),k(),I(null),w.reset(),z(),ie(),g=!0,_=requestAnimationFrame(ae)}function E(){u=null,A(),i.dispose(),i=iu(r,t),M(),k(),I(null),w.reset(),z()}function D(e,t){x=e||null,S={...t},r&&E()}function O(e){S={...e},r&&x&&I(()=>te(t.dimensions))}function k(e=0){x&&(C=x.attach({layout:i,graph:r,params:{...S},settings:{...t},steps:e})||null)}function A(){C&&C.dispose&&C.dispose(),C=null}async function j(){C&&C.finish&&(u&&await u.sync(),C.finish())}function M(){b=``,y===`pivot`&&(b=du(r,i,{dimensions:t.dimensions||2,unit:t.springLength||10}))}function N(e){y!==e&&(y=e,r&&E())}function P(e){v=Math.max(1,Math.round(e)||1)}async function F(e){return e===`webgpu`&&c!==`webgpu`&&(l||=await $_(),!l)||e!==c&&(c=e,f=``,w.reset(),await I(null)),c}function I(e){return p=p.then(async()=>{m=!0;try{if(u){let e=u;u=null,await e.stop()}e&&e(),c===`webgpu`&&i&&await L()}catch(e){console.error(`Switching the layout failed:`,e)}finally{m=!1}}),p}async function L(){let e=i,t=e.simulator.plan(l);if(t.runs){d=``;try{let t=await K_(e,l);if(e!==i){await t.stop();return}u=t,u.on(`error`,e=>{f=e.lost?`the WebGPU device was lost`:e.message,e.lost&&(l=null),c=`cpu`,I(null)})}catch(e){d=e.reasons?e.reasons.join(`; `):e.message}}else{let e=t.reasons.filter(e=>!t.stages.some(t=>e.startsWith(t.stage+`: `))).concat(t.stages.filter(e=>!e.runs).map(e=>e.reason));d=Array.from(new Set(e)).join(`; `)}}function R(){return{backend:u?`webgpu`:`cpu`,nodes:r?r.getNodesCount():0,links:r?r.getLinksCount():0,steps:w.steps,msPerStep:u?u.stats().msPerStep:w.msPerStep(),placement:b,canFinishPrototype:!!(C&&C.finish),gpuReasons:c===`webgpu`&&!u&&!m?d:``,gpuError:f}}function z(){let e=i.getGraphRect(),t=(e.min_x+e.max_x)/2,n=(e.min_y+e.max_y)/2,r=Math.max(e.max_x-e.min_x,e.max_y-e.min_y)*.6;(!Number.isFinite(r)||r<100.8)&&(t=n=0,r=100.8),a.setViewBox({left:t-r,top:n-r,right:t+r,bottom:n+r})}function ee(e){g=e}function B(e){let n=tv,r=t&&t.dimensions||2;t=n.reduce((t,n)=>(t[n]=e[n],t),{}),i&&(t.dimensions===r?n.forEach(e=>{i.simulator[e](t[e])}):I(()=>te(r)))}function te(e){let n=i;A(),i=iu(r,t),r.forEachNode(r=>{let a=n.getNodePosition(r.id).toJSON(),o=Object.keys(a).map(e=>a[e]);for(let n=e;n<t.dimensions;++n)o.push(Math.random());o.unshift(r.id),i.setNodePosition.apply(i,o)}),n.dispose(),k(w.steps)}function ne(e){h=e}function re(){let t=Ic(e);return t.setClearColor(12/255,41/255,82/255,1),t}function ie(){o=new Sl(a.getGL(),{capacity:r.getNodesCount()}),r.forEachNode(e=>{var t=i.getNodePosition(e.id);let n=1;e.data&&e.data.size?n=e.data.size:(e.data||={},e.data.size=n),e.ui={size:n,position:[t.x,t.y,t.z||0],color:ev},e.uiId=o.add(e.ui)}),s=new xl(a.getGL(),{capacity:r.getLinksCount()}),r.forEachLink(e=>{var t=i.getNodePosition(e.fromId),n=i.getNodePosition(e.toId);e.ui={from:[t.x,t.y,t.z||0],to:[n.x,n.y,n.z||0],color:4294967056},e.uiId=s.add(e.ui)}),a.appendChild(s),a.appendChild(o)}function ae(){if(_=requestAnimationFrame(ae),g&&!m){let e=performance.now();if(u)u.step(v);else for(let e=0;e<v;++e)i.step();if(w.record(performance.now()-e,v),h){let e=i.getGraphRect();a.setViewBox({left:e.min_x,top:e.min_y,right:e.max_x,bottom:e.max_y})}}V(),a.renderFrame()}function V(){let e=[`x`,`y`,`z`],t=C&&C.nodeColor;r.forEachNode(n=>{let r=i.getNodePosition(n.id),a=n.ui.position;for(let t=0;t<3;++t)a[t]=r[e[t]]||0;n.ui.color=t&&t(n.id)||ev,o.update(n.uiId,n.ui)}),r.forEachLink(t=>{var n=i.getNodePosition(t.fromId),r=i.getNodePosition(t.toId);let{from:a,to:o}=t.ui;for(let t=0;t<3;++t)a[t]=n[e[t]]||0,o[t]=r[e[t]]||0;s.update(t.uiId,t.ui)})}function oe(){cancelAnimationFrame(_),u&&u.stop(),u=null,A(),a.dispose(),El.off(`load-graph`,T)}}function rv(){let e=[],t={steps:0,record(n,r){t.steps+=r,e.push(n/r),e.length>30&&e.shift()},reset(){t.steps=0,e=[]},msPerStep(){return e.length===0?0:e.reduce((e,t)=>e+t,0)/e.length}};return t}function iv(){return`Miserables.Binary.Grid 100x100 (10k).HB/blckhole.HB/lshp1882.Bai/dw256A.HB/dwt_419.HB/plat1919.Nasa/barth5.Gset/G11.Pothen/sphere3.Cube 20x20x20 (8k).GHS_indef/laser.Bai/olm1000.Binary tree (8k).HB/1138_bus.Bai/qh882.Hamm/add32.Scale-free tree (10k).Barabasi-Albert (20k).Barabasi-Albert (100k).HB/fs_541_1.Meszaros/gams30a.JGD_Homology/cis-n4c6-b15.Rajat/rajat14.HB/west0497.LPnetlib/lp_share2b.LPnetlib/lp_ship12s.Pajek/SmallW.Groups 8x250 (2k).Pajek/CSphd.Bai/tols2000.Barabasi/NotreDame_yeast.JGD_SPG/08blocks.HB/dwt_512.Many pieces (300).Pajek/USpowerGrid.Pajek/USAir97.Pajek/Erdos02.MathWorks/Harvard500.Sandia/oscil_dcop_01.Pajek/dictionary28.Watts-Strogatz (10k).Gset/G43.HB/bcsstk02.Benchmark: starOfStars.Benchmark: megaStars.Benchmark: hubLeaves5k.Benchmark: EVA.Benchmark: paTree3k.Benchmark: yeast.Benchmark: sciMet.Benchmark: erdos992.Benchmark: CSphd.Benchmark: protein.Benchmark: caterpillars.Benchmark: forest5k.Benchmark: gridIsolates.Benchmark: npmMix4.Benchmark: communities.Benchmark: sbm8x50.Benchmark: grid20.Benchmark: binTree8.Benchmark: cliqueCircle.Benchmark: ba500.Benchmark: er1000.Benchmark: rgg1500.Benchmark: powerGrid.Benchmark: java`.split(`.`)}var av=o(((e,t)=>{t.exports={nodes:[{name:`Myriel`,group:1},{name:`Napoleon`,group:1},{name:`Mlle.Baptistine`,group:1},{name:`Mme.Magloire`,group:1},{name:`CountessdeLo`,group:1},{name:`Geborand`,group:1},{name:`Champtercier`,group:1},{name:`Cravatte`,group:1},{name:`Count`,group:1},{name:`OldMan`,group:1},{name:`Labarre`,group:2},{name:`Valjean`,group:2},{name:`Marguerite`,group:3},{name:`Mme.deR`,group:2},{name:`Isabeau`,group:2},{name:`Gervais`,group:2},{name:`Tholomyes`,group:3},{name:`Listolier`,group:3},{name:`Fameuil`,group:3},{name:`Blacheville`,group:3},{name:`Favourite`,group:3},{name:`Dahlia`,group:3},{name:`Zephine`,group:3},{name:`Fantine`,group:3},{name:`Mme.Thenardier`,group:4},{name:`Thenardier`,group:4},{name:`Cosette`,group:5},{name:`Javert`,group:4},{name:`Fauchelevent`,group:0},{name:`Bamatabois`,group:2},{name:`Perpetue`,group:3},{name:`Simplice`,group:2},{name:`Scaufflaire`,group:2},{name:`Woman1`,group:2},{name:`Judge`,group:2},{name:`Champmathieu`,group:2},{name:`Brevet`,group:2},{name:`Chenildieu`,group:2},{name:`Cochepaille`,group:2},{name:`Pontmercy`,group:4},{name:`Boulatruelle`,group:6},{name:`Eponine`,group:4},{name:`Anzelma`,group:4},{name:`Woman2`,group:5},{name:`MotherInnocent`,group:0},{name:`Gribier`,group:0},{name:`Jondrette`,group:7},{name:`Mme.Burgon`,group:7},{name:`Gavroche`,group:8},{name:`Gillenormand`,group:5},{name:`Magnon`,group:5},{name:`Mlle.Gillenormand`,group:5},{name:`Mme.Pontmercy`,group:5},{name:`Mlle.Vaubois`,group:5},{name:`Lt.Gillenormand`,group:5},{name:`Marius`,group:8},{name:`BaronessT`,group:5},{name:`Mabeuf`,group:8},{name:`Enjolras`,group:8},{name:`Combeferre`,group:8},{name:`Prouvaire`,group:8},{name:`Feuilly`,group:8},{name:`Courfeyrac`,group:8},{name:`Bahorel`,group:8},{name:`Bossuet`,group:8},{name:`Joly`,group:8},{name:`Grantaire`,group:8},{name:`MotherPlutarch`,group:9},{name:`Gueulemer`,group:4},{name:`Babet`,group:4},{name:`Claquesous`,group:4},{name:`Montparnasse`,group:4},{name:`Toussaint`,group:5},{name:`Child1`,group:10},{name:`Child2`,group:10},{name:`Brujon`,group:4},{name:`Mme.Hucheloup`,group:8}],links:[{source:1,target:0,value:1},{source:2,target:0,value:8},{source:3,target:0,value:10},{source:3,target:2,value:6},{source:4,target:0,value:1},{source:5,target:0,value:1},{source:6,target:0,value:1},{source:7,target:0,value:1},{source:8,target:0,value:2},{source:9,target:0,value:1},{source:11,target:10,value:1},{source:11,target:3,value:3},{source:11,target:2,value:3},{source:11,target:0,value:5},{source:12,target:11,value:1},{source:13,target:11,value:1},{source:14,target:11,value:1},{source:15,target:11,value:1},{source:17,target:16,value:4},{source:18,target:16,value:4},{source:18,target:17,value:4},{source:19,target:16,value:4},{source:19,target:17,value:4},{source:19,target:18,value:4},{source:20,target:16,value:3},{source:20,target:17,value:3},{source:20,target:18,value:3},{source:20,target:19,value:4},{source:21,target:16,value:3},{source:21,target:17,value:3},{source:21,target:18,value:3},{source:21,target:19,value:3},{source:21,target:20,value:5},{source:22,target:16,value:3},{source:22,target:17,value:3},{source:22,target:18,value:3},{source:22,target:19,value:3},{source:22,target:20,value:4},{source:22,target:21,value:4},{source:23,target:16,value:3},{source:23,target:17,value:3},{source:23,target:18,value:3},{source:23,target:19,value:3},{source:23,target:20,value:4},{source:23,target:21,value:4},{source:23,target:22,value:4},{source:23,target:12,value:2},{source:23,target:11,value:9},{source:24,target:23,value:2},{source:24,target:11,value:7},{source:25,target:24,value:13},{source:25,target:23,value:1},{source:25,target:11,value:12},{source:26,target:24,value:4},{source:26,target:11,value:31},{source:26,target:16,value:1},{source:26,target:25,value:1},{source:27,target:11,value:17},{source:27,target:23,value:5},{source:27,target:25,value:5},{source:27,target:24,value:1},{source:27,target:26,value:1},{source:28,target:11,value:8},{source:28,target:27,value:1},{source:29,target:23,value:1},{source:29,target:27,value:1},{source:29,target:11,value:2},{source:30,target:23,value:1},{source:31,target:30,value:2},{source:31,target:11,value:3},{source:31,target:23,value:2},{source:31,target:27,value:1},{source:32,target:11,value:1},{source:33,target:11,value:2},{source:33,target:27,value:1},{source:34,target:11,value:3},{source:34,target:29,value:2},{source:35,target:11,value:3},{source:35,target:34,value:3},{source:35,target:29,value:2},{source:36,target:34,value:2},{source:36,target:35,value:2},{source:36,target:11,value:2},{source:36,target:29,value:1},{source:37,target:34,value:2},{source:37,target:35,value:2},{source:37,target:36,value:2},{source:37,target:11,value:2},{source:37,target:29,value:1},{source:38,target:34,value:2},{source:38,target:35,value:2},{source:38,target:36,value:2},{source:38,target:37,value:2},{source:38,target:11,value:2},{source:38,target:29,value:1},{source:39,target:25,value:1},{source:40,target:25,value:1},{source:41,target:24,value:2},{source:41,target:25,value:3},{source:42,target:41,value:2},{source:42,target:25,value:2},{source:42,target:24,value:1},{source:43,target:11,value:3},{source:43,target:26,value:1},{source:43,target:27,value:1},{source:44,target:28,value:3},{source:44,target:11,value:1},{source:45,target:28,value:2},{source:47,target:46,value:1},{source:48,target:47,value:2},{source:48,target:25,value:1},{source:48,target:27,value:1},{source:48,target:11,value:1},{source:49,target:26,value:3},{source:49,target:11,value:2},{source:50,target:49,value:1},{source:50,target:24,value:1},{source:51,target:49,value:9},{source:51,target:26,value:2},{source:51,target:11,value:2},{source:52,target:51,value:1},{source:52,target:39,value:1},{source:53,target:51,value:1},{source:54,target:51,value:2},{source:54,target:49,value:1},{source:54,target:26,value:1},{source:55,target:51,value:6},{source:55,target:49,value:12},{source:55,target:39,value:1},{source:55,target:54,value:1},{source:55,target:26,value:21},{source:55,target:11,value:19},{source:55,target:16,value:1},{source:55,target:25,value:2},{source:55,target:41,value:5},{source:55,target:48,value:4},{source:56,target:49,value:1},{source:56,target:55,value:1},{source:57,target:55,value:1},{source:57,target:41,value:1},{source:57,target:48,value:1},{source:58,target:55,value:7},{source:58,target:48,value:7},{source:58,target:27,value:6},{source:58,target:57,value:1},{source:58,target:11,value:4},{source:59,target:58,value:15},{source:59,target:55,value:5},{source:59,target:48,value:6},{source:59,target:57,value:2},{source:60,target:48,value:1},{source:60,target:58,value:4},{source:60,target:59,value:2},{source:61,target:48,value:2},{source:61,target:58,value:6},{source:61,target:60,value:2},{source:61,target:59,value:5},{source:61,target:57,value:1},{source:61,target:55,value:1},{source:62,target:55,value:9},{source:62,target:58,value:17},{source:62,target:59,value:13},{source:62,target:48,value:7},{source:62,target:57,value:2},{source:62,target:41,value:1},{source:62,target:61,value:6},{source:62,target:60,value:3},{source:63,target:59,value:5},{source:63,target:48,value:5},{source:63,target:62,value:6},{source:63,target:57,value:2},{source:63,target:58,value:4},{source:63,target:61,value:3},{source:63,target:60,value:2},{source:63,target:55,value:1},{source:64,target:55,value:5},{source:64,target:62,value:12},{source:64,target:48,value:5},{source:64,target:63,value:4},{source:64,target:58,value:10},{source:64,target:61,value:6},{source:64,target:60,value:2},{source:64,target:59,value:9},{source:64,target:57,value:1},{source:64,target:11,value:1},{source:65,target:63,value:5},{source:65,target:64,value:7},{source:65,target:48,value:3},{source:65,target:62,value:5},{source:65,target:58,value:5},{source:65,target:61,value:5},{source:65,target:60,value:2},{source:65,target:59,value:5},{source:65,target:57,value:1},{source:65,target:55,value:2},{source:66,target:64,value:3},{source:66,target:58,value:3},{source:66,target:59,value:1},{source:66,target:62,value:2},{source:66,target:65,value:2},{source:66,target:48,value:1},{source:66,target:63,value:1},{source:66,target:61,value:1},{source:66,target:60,value:1},{source:67,target:57,value:3},{source:68,target:25,value:5},{source:68,target:11,value:1},{source:68,target:24,value:1},{source:68,target:27,value:1},{source:68,target:48,value:1},{source:68,target:41,value:1},{source:69,target:25,value:6},{source:69,target:68,value:6},{source:69,target:11,value:1},{source:69,target:24,value:1},{source:69,target:27,value:2},{source:69,target:48,value:1},{source:69,target:41,value:1},{source:70,target:25,value:4},{source:70,target:69,value:4},{source:70,target:68,value:4},{source:70,target:11,value:1},{source:70,target:24,value:1},{source:70,target:27,value:1},{source:70,target:41,value:1},{source:70,target:58,value:1},{source:71,target:27,value:1},{source:71,target:69,value:2},{source:71,target:68,value:2},{source:71,target:70,value:2},{source:71,target:11,value:1},{source:71,target:48,value:1},{source:71,target:41,value:1},{source:71,target:25,value:1},{source:72,target:26,value:2},{source:72,target:27,value:1},{source:72,target:11,value:1},{source:73,target:48,value:2},{source:74,target:48,value:2},{source:74,target:73,value:3},{source:75,target:69,value:3},{source:75,target:68,value:3},{source:75,target:25,value:3},{source:75,target:48,value:1},{source:75,target:41,value:1},{source:75,target:70,value:1},{source:75,target:71,value:1},{source:76,target:64,value:1},{source:76,target:65,value:1},{source:76,target:66,value:1},{source:76,target:63,value:1},{source:76,target:62,value:1},{source:76,target:48,value:1},{source:76,target:58,value:1}]}})),ov=o(((e,t)=>{function n(e){i(e);let t=r(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e}function r(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function i(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}t.exports=n})),sv=o(((e,t)=>{t.exports=r;var n=ov();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=L,m=L,h=L,g=L,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:ee,forEachLinkedNode:P,forEachLink:N,beginUpdate:h,endUpdate:g,clear:M,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=R,_.endUpdate=g=z,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function M(){h(),ee(function(e){C(e.id)}),g()}function N(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function P(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?I(r.links,e,t):F(r.links,e,t)}function F(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function I(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function L(){}function R(){u+=1}function z(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function ee(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),cv=o(((e,t)=>{var n=av(),r=sv();t.exports=i(),t.exports.create=i;function i(){for(var e=r(),t=0;t<n.nodes.length;++t)e.addNode(t,n.nodes[t]);for(t=0;t<n.links.length;++t){var i=n.links[t];e.addLink(i.source,i.target,i.value)}return e}})),lv=o(((e,t,n)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.createGraph=r())})(n,(function(){function e(e){n(e);let r=t(e);return e.on=r.on,e.off=r.off,e.fire=r.fire,e}function t(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function n(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}function r(t){if(t||={},`uniqueLinkId`in t&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),t.multigraph=t.uniqueLinkId),t.multigraph===void 0&&(t.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var n=new Map,r=new Map,c={},l=0,u=t.multigraph?T:w,d=[],f=R,p=R,m=R,h=R,g={version:20,addNode:b,addLink:C,removeLink:k,removeNode:S,getNode:x,getNodeCount:E,getLinkCount:D,getEdgeCount:D,getLinksCount:D,getNodesCount:E,getLinks:O,forEachNode:B,forEachLinkedNode:F,forEachLink:P,beginUpdate:m,endUpdate:h,clear:N,hasLink:j,hasNode:x,getLink:j,getLinkById:M};return e(g),_(),g;function _(){var e=g.on;g.on=t;function t(){return g.beginUpdate=m=z,g.endUpdate=h=ee,f=v,p=y,g.on=e,e.apply(g,arguments)}}function v(e,t){d.push({link:e,changeType:t})}function y(e,t){d.push({node:e,changeType:t})}function b(e,t){if(e===void 0)throw Error(`Invalid node identifier`);m();var r=x(e);return r?(r.data=t,p(r,`update`)):(r=new i(e,t),p(r,`add`)),n.set(e,r),h(),r}function x(e){return n.get(e)}function S(e){var t=x(e);if(!t)return!1;m();var r=t.links;return r&&(r.forEach(A),t.links=null),n.delete(e),p(t,`remove`),h(),!0}function C(e,t,n){m();var i=x(e)||b(e),o=x(t)||b(t),s=u(e,t,n),c=r.has(s.id);return r.set(s.id,s),a(i,s),e!==t&&a(o,s),f(s,c?`update`:`add`),h(),s}function w(e,t,n){var i=s(e,t),a=r.get(i);return a?(a.data=n,a):new o(e,t,n,i)}function T(e,t,n){var r=s(e,t),i=c.hasOwnProperty(r);if(i||j(e,t)){i||(c[r]=0);var a=`@`+ ++c[r];r=s(e+a,t+a)}return new o(e,t,n,r)}function E(){return n.size}function D(){return r.size}function O(e){var t=x(e);return t?t.links:null}function k(e,t){return t!==void 0&&(e=j(e,t)),A(e)}function A(e){if(!e||!r.get(e.id))return!1;m(),r.delete(e.id);var t=x(e.fromId),n=x(e.toId);return t&&t.links.delete(e),n&&n.links.delete(e),f(e,`remove`),h(),!0}function j(e,t){if(e!==void 0&&t!==void 0)return r.get(s(e,t))}function M(e){if(e!==void 0)return r.get(e)}function N(){m(),B(function(e){S(e.id)}),h()}function P(e){if(typeof e==`function`)for(var t=r.values(),n=t.next();!n.done;){if(e(n.value))return!0;n=t.next()}}function F(e,t,n){var r=x(e);if(r&&r.links&&typeof t==`function`)return n?L(r.links,e,t):I(r.links,e,t)}function I(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===t?s.toId:s.fromId;if(i=r(n.get(c),s),i)return!0;o=a.next()}}function L(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===t&&(i=r(n.get(s.toId),s),i))return!0;o=a.next()}}function R(){}function z(){l+=1}function ee(){--l,l===0&&d.length>0&&(g.fire(`changed`,d),d.length=0)}function B(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}}function i(e,t){this.id=e,this.links=null,this.data=t}function a(e,t){e.links?e.links.add(t):e.links=new Set([t])}function o(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function s(e,t){return e.toString()+`👉 `+t.toString()}return r}))})),uv=o(((e,t)=>{var n=lv(),r=cv().create;t.exports=i(n),t.exports.factory=i;function i(e){return{ladder:t,complete:i,completeBipartite:a,balancedBinTree:l,balancedBinaryTree:l,binaryTree:l,binTree:l,path:o,circularLadder:n,grid:s,grid3:c,noLinks:u,wattsStrogatz:f,cliqueCircle:d,miserables:r};function t(t){if(!t||t<0)throw Error(`Invalid number of nodes`);for(var n=e(),r=0;r<t-1;++r)n.addLink(r,r+1),n.addLink(t+r,t+r+1),n.addLink(r,t+r);return n.addLink(t-1,2*t-1),n}function n(e){if(!e||e<0)throw Error(`Invalid number of nodes`);var n=t(e);return n.addLink(0,e-1),n.addLink(e,2*e-1),n}function i(t){if(!t||t<1)throw Error(`At least two nodes are expected for complete graph`);for(var n=e(),r=0,i;r<t;++r)for(i=r+1;i<t;++i)r!==i&&n.addLink(r,i);return n}function a(t,n){if(!t||!n||t<0||n<0)throw Error(`Graph dimensions are invalid. Number of nodes in each partition should be greater than 0`);for(var r=e(),i=0,a;i<t;++i)for(a=t;a<t+n;++a)r.addLink(i,a);return r}function o(t){if(!t||t<0)throw Error(`Invalid number of nodes`);var n=e(),r;for(n.addNode(0),r=1;r<t;++r)n.addLink(r-1,r);return n}function s(t,n){if(t<1||n<1)throw Error(`Invalid number of nodes in grid graph`);var r=e(),i,a;if(t===1&&n===1)return r.addNode(0),r;for(i=0;i<t;++i)for(a=0;a<n;++a){var o=i+a*t;i>0&&r.addLink(o,i-1+a*t),a>0&&r.addLink(o,i+(a-1)*t)}return r}function c(t,n,r){if(t<1||n<1||r<1)throw Error(`Invalid number of nodes in grid3 graph`);var i=e(),a,o,s;if(t===1&&n===1&&r===1)return i.addNode(0),i;for(s=0;s<r;++s)for(a=0;a<t;++a)for(o=0;o<n;++o){var c=s*t*n,l=a+o*t+c;a>0&&i.addLink(l,a-1+o*t+c),o>0&&i.addLink(l,a+(o-1)*t+c),s>0&&i.addLink(l,a+o*t+(s-1)*t*n)}return i}function l(t){if(t===void 0||t<0)throw Error(`Invalid number of levels in balanced tree`);var n=e(),r=2**t,i;for(t===0&&n.addNode(1),i=1;i<r;++i){var a=i,o=a*2,s=a*2+1;n.addLink(a,o),n.addLink(a,s)}return n}function u(t){if(t<0)throw Error(`Number of nodes should be >= 0`);for(var n=e(),r=0;r<t;++r)n.addNode(r);return n}function d(t,n){if(t<1)throw Error(`Invalid number of cliqueCount in cliqueCircle`);if(n<1)throw Error(`Invalid number of cliqueSize in cliqueCircle`);for(var r=e(),i=0;i<t;++i)a(n,i*n),i>0&&r.addLink(i*n,i*n-1);return r.addLink(0,r.getNodesCount()-1),r;function a(e,t){for(var n=0;n<e;++n)r.addNode(n+t);for(var n=0;n<e;++n)for(var i=n+1;i<e;++i)r.addLink(n+t,i+t)}}function f(t,n,r,i){if(n>=t)throw Error("Choose smaller `k`. It cannot be larger than number of nodes `n`");for(var a=Ol().random(i||42),o=e(),s=0,c;s<t;++s)o.addNode(s);for(var l=Math.floor(n/2+1),u=1;u<l;++u)for(s=0;s<t;++s)c=(u+s)%t,o.addLink(s,c);for(u=1;u<l;++u)for(s=0;s<t;++s)if(a.nextDouble()<r){var d=s;c=(u+s)%t;var f=a.next(t),p=f===d||o.hasLink(d,f);if(p&&o.getLinks(d).length===t-1)continue;for(;p;)f=a.next(t),p=f===d||o.hasLink(d,f);var m=o.hasLink(d,c);o.removeLink(m),o.addLink(d,f)}return o}}})),dv=l(cv(),1),fv=l(uv(),1),pv=yv(),mv={"Grid 100x100 (10k)":()=>fv.default.grid(100,100),"Binary tree (8k)":()=>fv.default.balancedBinTree(12),"Watts-Strogatz (10k)":()=>fv.default.wattsStrogatz(1e4,6,.05),"Barabasi-Albert (20k)":()=>bv(2e4,2),"Barabasi-Albert (100k)":()=>bv(1e5,2),"Scale-free tree (10k)":()=>bv(1e4,1),"Cube 20x20x20 (8k)":()=>fv.default.grid3(20,20,20),"Groups 8x250 (2k)":()=>xv(8,250),"Many pieces (300)":()=>Sv(300)},hv=`Benchmark: `;function gv(e){if(e===`Miserables`)return Promise.resolve(dv.default);if(e===`Binary`)return Promise.resolve(fv.default.balancedBinTree(10));if(mv[e])return Promise.resolve(mv[e]());if(e.startsWith(hv))return _v(e.slice(11));let t=pv.get(e);return t?Promise.resolve(vv(t.links,t.recordsPerEdge)):fetch(`https://s3.amazonaws.com/yasiv_uf/out/${e}/index.js`,{mode:`cors`}).then(e=>e.json()).then(t=>(pv.put(e,t),vv(t.links,t.recordsPerEdge)))}function _v(e){return fetch(`./graphs/${e}.json`).then(e=>e.json()).then(({n:e,edges:t})=>{let n=au();for(let t=0;t<e;t++)n.addNode(t);for(let e=0;e+1<t.length;e+=2)n.addLink(t[e],t[e+1]);return n})}function vv(e,t){let n=au();for(var r=0;r<e.length-1;r+=t)n.addLink(e[r],e[r+1]);return n}function yv(){var e=`localStorage`in window;return{get:function(t){if(!e)return null;var n=JSON.parse(window.localStorage.getItem(t));return!n||n.recordsPerEdge===void 0?null:n},put:function(t,n){if(!e)return!1;try{window.localStorage.setItem(t,JSON.stringify(n))}catch{window.localStorage.clear()}}}}function bv(e,t){let n=Cv(42),r=au(),i=[];for(let e=0;e<=t;e++)for(let t=0;t<e;t++)r.addLink(e,t),i.push(e,t);for(let a=t+1;a<e;a++){let e=new Set;for(;e.size<t;)e.add(i[Math.floor(n()*i.length)]);e.forEach(e=>{r.addLink(a,e),i.push(a,e)})}return r}function xv(e,t){let n=Cv(7),r=e=>Math.floor(n()*e),i=au();for(let a=0;a<e*t;a++){let o=Math.floor(a/t);for(let e=0;e<3;e++){let e=o*t+r(t);e!==a&&i.addLink(a,e)}n()<.12&&i.addLink(a,r(e*t))}return i}function Sv(e){let t=Cv(42),n=e=>Math.floor(t()*e),r=au(),i=0;for(let t=0;t<e;t++){let e=2+Math.floor(400/(1+n(60))),t=i;i+=e;for(let i=1;i<e;i++)r.addLink(t+i,t+n(i));for(let i=0;i<e/10;i++){let i=t+n(e),a=t+n(e);i!==a&&r.addLink(i,a)}}return r}function Cv(e){return()=>(e=e*1664525+1013904223>>>0,e/4294967296)}var wv=o(((e,t)=>{t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}})),Tv=o(((e,t)=>{t.exports=n;function n(e){var t=[],n=e;return{dispose:a,onChanged:o,set:i,get:r};function r(){return n}function i(e){n=e,setTimeout(function(){s(e)},0)}function a(){t=[]}function o(e){if(typeof e!=`function`)throw Error(`changeCallback should be a function`);t.push(e)}function s(e){t.forEach(function(t){t(e)})}}})),Ev=o(((e,t)=>{t.exports={parse:r,stringify:n};function n(e){return e?Object.keys(e).map(t).join(`&`):``;function t(t){var n=e[t],r=a(t);return n!==void 0&&(r+=`=`+i(n)),r}}function r(e){var t=Object.create(null);return e&&e.split(`&`).forEach(n),t;function n(e){if(e){var n=e.split(`=`);t[decodeURIComponent(n[0])]=s(n[1])}}}function i(e){return e instanceof Date&&(e=e.toISOString()),a(e)}function a(e){return encodeURIComponent(e).replace(/[()]/g,o)}function o(e){return e===`)`?`%29`:e===`(`?`%28`:e}function s(e){return e=decodeURIComponent(e),e===``?e:isNaN(e)?c(e)?e===`true`:l(e)?new Date(e):e:parseFloat(e)}function c(e){return e===`true`||e===`false`}function l(e){return e&&e.match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)}})),Dv=o(((e,t)=>{t.exports=i;var n=Tv(),r=Ev();function i(e,t){if(typeof window>`u`)return n(e);var i=[],a=t&&t.useSearch,o=a?`?`:`#?`;return t.rewriteHashToSearch&&c(),s(),{onChanged:u,dispose:d,set:l,get:m,rewriteHashToSearch:c};function s(){var t=m(),n=!1;typeof e==`object`&&e&&Object.keys(e).forEach(function(r){r in t||(t[r]=e[r],n=!0)}),n&&l(t)}function c(){var e=Object.create(null),t=window.location.search;t&&(e=Object.assign(e,r.parse(t.substr(1))));var n=window.location.hash;n&&(e=Object.assign(e,r.parse(n.substr(2)))),l(e)}function l(e){var t=o+r.stringify(e);a&&window.location.hash&&(t+=window.location.hash),window.history?window.history.replaceState(void 0,void 0,t):window.location.replace(t)}function u(e){if(typeof e!=`function`)throw Error(`changeCallback needs to be a function`);i.length===0&&window.addEventListener(`hashchange`,f,!1),i.push(e)}function d(){i.length!==0&&(i=[],window.removeEventListener(`hashchange`,f,!1))}function f(){p(m())}function p(e){for(var t=0;t<i.length;++t){var n=i[t];n(e)}}function m(){var e=((a?window.location.search:window.location.hash)||o).substr(o.length);return r.parse(e)}}})),Ov=l(o(((e,t)=>{t.exports=a;var n=wv(),r=Dv();a.instance=o;var i;function a(e,t){t||={};var i=t.history||r(e,t);s(i),i.onChanged(g);var a=i.get()||Object.create(null),o={get:p,set:m,unset:h,setIfEmpty:_,dispose:f,onChange:l,offChange:u,getHistoryObject:d},c=n({});return o;function l(e,t){c.on(`change`,e,t)}function u(e,t){c.off(`change`,e,t)}function d(){return i}function f(){i.dispose(),c.off()}function p(e){return e===void 0?a:a[e]}function m(e,t){var n=typeof e;return n===`object`?Object.keys(e).forEach(function(t){a[t]=e[t]}):n===`string`&&(a[e]=t),i.set(a),o}function h(e){if(e in a)return delete a[e],i.set(a),o}function g(e){a=e,c.fire(`change`,a)}function _(e,t){if(typeof e==`object`&&Object.keys(e).forEach(function(t){t in a||(a[t]=e[t])}),!(e in a))return a[e]=t,i.set(a),o}}function o(e,t){return i?e&&i.setIfEmpty(e):i=a(e,t),i}function s(e){if(!e)throw Error(`history is required`);if(typeof e.dispose!=`function`)throw Error(`dispose is required`);if(typeof e.onChanged!=`function`)throw Error(`onChanged is required`)}}))()),kv=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},Av={emits:[`show`],methods:{show(){this.$emit(`show`)}}};function jv(e,t,n,r,i,a){return Ui(),Ji(`a`,{onClick:t[0]||=Io((...e)=>a.show&&a.show(...e),[`prevent`]),class:`help-icon`,href:`#`,title:`Click for more details`},[...t[1]||=[J(`svg`,{version:`1.1`,xmlns:`http://www.w3.org/2000/svg`,"xmlns:xlink":`http://www.w3.org/1999/xlink`,width:`9`,height:`14`,viewBox:`0 0 9 14`,fill:`#267fcd`},[J(`path`,{d:`M5.5 9.812v1.875q0 0.125-0.094 0.219t-0.219 0.094h-1.875q-0.125 0-0.219-0.094t-0.094-0.219v-1.875q0-0.125 0.094-0.219t0.219-0.094h1.875q0.125 0 0.219 0.094t0.094 0.219zM7.969 5.125q0 0.422-0.121 0.789t-0.273 0.598-0.43 0.465-0.449 0.34-0.477 0.277q-0.32 0.18-0.535 0.508t-0.215 0.523q0 0.133-0.094 0.254t-0.219 0.121h-1.875q-0.117 0-0.199-0.145t-0.082-0.293v-0.352q0-0.648 0.508-1.223t1.117-0.848q0.461-0.211 0.656-0.438t0.195-0.594q0-0.328-0.363-0.578t-0.84-0.25q-0.508 0-0.844 0.227-0.273 0.195-0.836 0.898-0.102 0.125-0.242 0.125-0.094 0-0.195-0.062l-1.281-0.977q-0.102-0.078-0.121-0.195t0.043-0.219q1.25-2.078 3.625-2.078 0.625 0 1.258 0.242t1.141 0.648 0.828 0.996 0.32 1.238z`})],-1)]])}var Mv=kv(Av,[[`render`,jv]]),Nv={components:{HelpIcon:Mv},emits:[`update:modelValue`],props:{label:String,modelValue:Number,step:{default:`0.1`,type:String},disabled:Boolean,note:String},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){e!==parseFloat(this.inputValue)&&(this.inputValue=e)},inputValue(e){this.$emit(`update:modelValue`,parseFloat(e))}}},Pv={class:`row`},Fv={class:`col`},Iv={class:`col`},Lv=[`step`,`disabled`],Rv={key:0,class:`row note`},zv={key:1,class:`row help`};function Bv(e,t,n,r,i,a){let o=gr(`help-icon`);return Ui(),Ji(`div`,{class:ue([`block`,{inactive:n.disabled}])},[J(`div`,Pv,[J(`div`,Fv,ye(n.label),1),J(`div`,Iv,[kn(J(`input`,{type:`number`,step:n.step,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled,onFocus:t[1]||=(...e)=>a.selectAll&&a.selectAll(...e),autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`},null,40,Lv),[[Eo,i.inputValue]])]),ea(o,{onShow:t[2]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),n.note?(Ui(),Ji(`div`,Rv,ye(n.note),1)):aa(``,!0),i.helpVisible?(Ui(),Ji(`div`,zv,[xr(e.$slots,`default`)])):aa(``,!0)],2)}var Vv=kv(Nv,[[`render`,Bv]]),Hv={components:{HelpIcon:Mv},emits:[`update:modelValue`],props:{label:String,modelValue:Boolean},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{inputValue(e){this.$emit(`update:modelValue`,e)}}},Uv={class:`block`},Wv={class:`row`},Gv={class:`col`},Kv={class:`col`},qv={key:0,class:`row help`};function Jv(e,t,n,r,i,a){let o=gr(`help-icon`);return Ui(),Ji(`div`,Uv,[J(`div`,Wv,[J(`div`,Gv,ye(n.label),1),J(`div`,Kv,[kn(J(`input`,{type:`checkbox`,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e},null,512),[[Do,i.inputValue]])]),ea(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),i.helpVisible?(Ui(),Ji(`div`,qv,[xr(e.$slots,`default`)])):aa(``,!0)])}var Yv=kv(Hv,[[`render`,Jv]]),Xv={components:{HelpIcon:Mv},emits:[`update:modelValue`],props:{label:String,modelValue:String,disabled:Boolean,note:String,options:Array},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){this.inputValue=e},inputValue(e){this.$emit(`update:modelValue`,e)}}},Zv={class:`row`},Qv={class:`col`},$v={class:`col`},ey=[`disabled`],ty=[`value`,`disabled`],ny={key:0,class:`row note`},ry={key:1,class:`row help`};function iy(e,t,n,r,i,a){let o=gr(`help-icon`);return Ui(),Ji(`div`,{class:ue([`block`,{inactive:n.disabled}])},[J(`div`,Zv,[J(`div`,Qv,ye(n.label),1),J(`div`,$v,[kn(J(`select`,{"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled},[(Ui(!0),Ji(Li,null,br(n.options,e=>(Ui(),Ji(`option`,{key:e.value,value:e.value,disabled:e.disabled},ye(e.label),9,ty))),128))],8,ey),[[ko,i.inputValue]])]),ea(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:ue({open:i.helpVisible})},null,8,[`class`])]),n.note?(Ui(),Ji(`div`,ny,ye(n.note),1)):aa(``,!0),i.helpVisible?(Ui(),Ji(`div`,ry,[xr(e.$slots,`default`)])):aa(``,!0)],2)}var ay=kv(Xv,[[`render`,iy]]),oy=s({default:()=>cy}),sy=`pn-1-let-go-springs`,cy={id:`pn-1-let-go-springs`,title:`Springs let go of long links`,author:`pn-1 (panel on natural graphs, after t-SNE)`,description:`
<p>On natural graphs (protein interactions, citations, co-authorship) the stock layout ends as one
ball. Groups show only when nodes are coloured by a clustering: drawn in one colour and blurred to
what a glance takes in, sciMet, yeast and erdos992 read as a single blob at every step.</p>
<p>The reason is the springs. A stock spring pulls harder the longer it gets, and between two groups
there are many stretched links, all pulling. Together they beat the push between nodes and squeeze
the groups into each other.</p>
<p>Here a link pulls like a stock spring while it is short, pulls hardest when it is stretched by
<b>Let go after</b> spring lengths, and then lets go: the pull fades as the link gets longer. It is
the attraction t-SNE uses, applied to links. Groups joined by few links drift apart; groups joined
by many stay together.</p>
<p>What to look for (quick checks, one to three starts, 2000 steps): sciMet and erdos992 break into
separate clumps you can see without colour (4 and 6 in a blurred one-colour test, against 1 with
<b>none</b>). A node's nearest drawn nodes are its graph neighbours about 3 to 6 times as often on
java, yeast, sciMet and erdos992. Randomly rewired copies of these graphs (same degrees, no groups) stay one round blob,
so it is not inventing groups.</p>
<p>What gets worse:</p>
<ul>
<li>Trees and grids: powerGrid and CSphd fall apart into scattered pieces joined by long crossing links.</li>
<li>The drawing keeps spreading for a long time, so the clumps shrink on screen as the view zooms out.</li>
<li>The links between clumps are drawn at full strength and cover the gaps.</li>
<li><b>Let go after</b> is sensitive: at 1.5 graphs tear into small clumps, and at 3 erdos992's hub
fans already pull away from their groups.</li>
</ul>
<p>It replaces the stock springs with one link formula and costs nothing extra per step. Works in
any number of dimensions. On WebGPU the GPU runs the layout without it.</p>`,tryGraphs:[`Benchmark: sciMet`,`Benchmark: erdos992`,`Benchmark: yeast`,`Benchmark: java`,`Benchmark: powerGrid`],params:[{key:`reach`,label:`Let go after (spring lengths)`,value:3,step:`0.5`,help:`Stretch, in spring lengths, at which a link pulls hardest; longer links pull less and less. Smaller lets go sooner and gives more, smaller clumps; at 1.5 graphs tear apart. Larger is closer to the stock springs. Values below 0.1 count as 0.1.`}],attach({layout:e,params:t}){let n=e.simulator,r=Number.isFinite(t.reach)?Math.max(t.reach,.1):3;return n.addLinkFormula(sy,{replace:`springs`,params:{R:e=>r*e.unit()},formula:`s = r - length; pull = coefficient * s / (1 + (s / R)^2)`}),{dispose(){n.removeStage(sy)}}}};function ly(e,{reach:t,fadeAll:n}){let r=e.simulator,i=r.store,a=r.repulsionCharge(),o=r.repulsionSensitivity(),s=r.repulsionLaw().spec;i.define(`leafFadeLeaf`,Uint8Array),i.define(`leafFadeCore`),i.define(`leafFadeLeafCharge`),l(),r.on(`topology`,l),r.addNodeFormula(`leafFadeCharges`,{before:`repulsion`,formula:`leafFadeCore = leafFadeLeaf != 0 ? 0 : ${a}; leafFadeLeafCharge = leafFadeLeaf != 0 ? ${a} : 0`});let c={force:`u = r / L; (1 + u) * exp(-u) / r^2`,params:{L:e=>t*e.springLength()},range:`6 * L`};return r.repulsionLaw(c),r.repulsionSensitivity(`leafFadeLeafCharge`),r.addRepulsion(`leafFadeCore`,{after:`repulsion`,charge:`leafFadeCore`}),r.addRepulsion(`leafFadeLeaves`,{after:`leafFadeCore`,charge:`leafFadeLeafCharge`,sensitivity:`leafFadeCore`,law:c,centroid:`shared`}),function(){r.off(`topology`,l),[`leafFadeLeaves`,`leafFadeCore`,`leafFadeCharges`].forEach(e=>r.removeStage(e)),r.repulsionLaw(s),r.repulsionSensitivity(o),[`leafFadeLeaf`,`leafFadeCore`,`leafFadeLeafCharge`].forEach(e=>i.remove(e))};function l(){let e=i.n,t=i.degree,a=i.leafFadeLeaf,o=new Int32Array(e),s=r.springStore,c=s.from,l=s.to;for(let e=0;e<s.n;e++)o[c[e]]=l[e],o[l[e]]=c[e];for(let r=0;r<e;r++)a[r]=n||t[r]===1&&t[o[r]]>1?1:0;i.changed(`leafFadeLeaf`)}}var uy=s({default:()=>dy}),dy={id:`ru-1-leaf-fade`,title:`Leaf pushes fade (short reach)`,author:`ru-1 (Samarsky & Gulin reader)`,description:`
<p>On graphs made of hubs with many leaves (starOfStars, megaStars), ngraph draws each hub as a
tight little disc far from the others, because every leaf of one hub pushes the next hub away at
any distance.</p>
<p>Here a push that involves a leaf (a node with one link, hanging off a node with more) fades
with distance: three quarters of its strength at one ideal spring length, a fifth at three, and
nothing beyond six; other pushes stay as they were.</p>
<p>Look for fans that open into sunbursts and fill the frame: on starOfStars the share of the frame
holding nodes goes from 0.13 to 0.43, while grid20, which has no leaves, keeps the stock layout
exactly.</p>
<p>From Samarsky &amp; Gulin, <i>Numerical Methods</i>, Part I §3–4: a nudge travels down a chain
of springs with no decay, unless every node is also tied to a fixed spot, and then it dies out
within a few nodes.</p>
<p>What gets worse: links cross about 2.5× more often on the star graphs, neighbouring fans
overlap in leafy trees (paTree3k: 0.07 → 0.30 crossings per link), graphs with many pieces (CSphd)
draw their main piece smaller, and each step costs about 1.75× the stock quad tree. <i>Fade every push</i> = 1
packs the stars tighter, but trees and sheets stop unfolding (paTree3k: 0.85 crossings per link).
It works in 2D only. Its pushes always walk one quad tree, whichever Repulsion method is picked, so
with dual tree a step takes about 10× as long as the stock dual tree.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: grid20`],params:[{key:`reach`,label:`Leaf reach`,value:1,step:`0.5`,help:`How far a leaf's push reaches, in ideal spring lengths. Smaller packs the hub fans closer together; just above 0, leaves push almost nothing. Larger moves back toward the stock layout. 0 turns the fade off (stock layout).`},{key:`fadeAll`,label:`Fade every push`,value:0,step:`1`,help:`0: only pushes that involve a leaf fade. 1: every push fades. Stars pack even more tightly, but trees and sheets lose the long-reach push that unfolds them.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let i=Number(n.reach);if(!(i>0))return null;let a=Number(n.fadeAll)>0;return!a&&!fy(t)?null:{dispose:ly(e,{reach:i,fadeAll:a})}}};function fy(e){let t=!1;return e.forEachNode(n=>{let r=py(e,n.id);if(r.length===1&&py(e,r[0].fromId===n.id?r[0].toId:r[0].fromId).length>1)return t=!0,!0}),t}function py(e,t){let n=e.getLinks(t);return n?Array.from(n):[]}function my(e,t=120){let n=e.length,r=Math.min(t,n),i=new Float64Array(n);for(let t=0;t<n;t++)i[t]=1/Math.sqrt(e[t].length);let a=[],o=new Float64Array(r),s=new Float64Array(r),c=new Float64Array(n),l=12345;for(let e=0;e<n;e++)l=l*1103515245+12345>>>0,c[e]=l/4294967296-.5;let u=new Float64Array(n);for(let e=0;e<n;e++)u[e]=1/i[e];_y(c,[gy(u)]),gy(c);let d=0;for(let t=0;t<r;t++){a.push(c);let l=new Float64Array(n);for(let t=0;t<n;t++){let n=0,r=e[t];for(let e=0;e<r.length;e++)n+=i[r[e]]*c[r[e]];l[t]=c[t]-i[t]*n}o[t]=hy(l,c),_y(l,[u].concat(a)),_y(l,[u].concat(a)),d=t+1;let f=Math.sqrt(hy(l,l));if(t===r-1||f<1e-10)break;s[t]=f;for(let e=0;e<n;e++)l[e]/=f;c=l}let f=Array.from(o.subarray(0,d));return vy(f,Array.from(s.subarray(0,d))),f.sort((e,t)=>e-t),{values:[0].concat(f),max:f[f.length-1]}}function hy(e,t){let n=0;for(let r=0;r<e.length;r++)n+=e[r]*t[r];return n}function gy(e){let t=Math.sqrt(hy(e,e))||1;for(let n=0;n<e.length;n++)e[n]/=t;return e}function _y(e,t){for(let n of t){let t=hy(e,n);for(let r=0;r<e.length;r++)e[r]-=t*n[r]}}function vy(e,t){let n=e.length;t[n-1]=0;for(let r=0;r<n;r++){let i=0,a;do{for(a=r;a<n-1;a++){let n=Math.abs(e[a])+Math.abs(e[a+1]);if(Math.abs(t[a])<=1e-15*n)break}if(a!==r){if(i++===60)break;let n=(e[r+1]-e[r])/(2*t[r]),o=Math.hypot(n,1);n=e[a]-e[r]+t[r]/(n+(n>=0?o:-o));let s=1,c=1,l=0,u;for(u=a-1;u>=r;u--){let r=s*t[u],i=c*t[u];if(t[u+1]=o=Math.hypot(r,n),o===0){e[u+1]-=l,t[a]=0;break}s=r/o,c=n/o,n=e[u+1]-l,o=(e[u]-n)*s+2*c*i,e[u+1]=n+(l=s*o),n=c*o-i}if(o===0&&u>=r)continue;e[r]-=l,t[r]=n,t[a]=0}}while(a!==r)}}function yy(e,{minWidth:t=.15,minRatio:n=1.5,lanczosSteps:r=120}={}){let{values:i,max:a}=my(e,r),o=null;for(let e=2;e<Math.min(31,i.length);e++){let n=i[e-1],r=i[e];if(n<1e-9||r-n<t)continue;let a=r/n;(!o||a>o.ratio)&&(o={groups:e,below:n,above:r,ratio:a})}return!o||o.ratio<n?null:{groups:o.groups,low:o.above,high:a,gapBelow:o.below}}function by(e,t,n,r){let i=t.length,a=e.map(e=>new Float64Array(e));for(let o=0;o<i;o++){let i=t[o];if(!(i.length===0||r&&i.length===1))for(let t=0;t<e.length;t++){let r=e[t],s=0;for(let e=0;e<i.length;e++)s+=r[i[e]];a[t][o]=(1-n)*r[o]+n*s/i.length}}if(r)for(let n=0;n<i;n++){if(t[n].length!==1)continue;let r=t[n][0];if(t[r].length!==1)for(let t=0;t<e.length;t++)a[t][n]=e[t][n]+(a[t][r]-e[t][r])}return a}function xy(e,t,n,r){let i=by(e,t,n,r),a=t.length,o=0,s=0;for(let t=0;t<e.length;t++){let n=0;for(let e=0;e<a;e++)n+=i[t][e];n/=a;for(let r=0;r<a;r++)o+=(e[t][r]-i[t][r])**2,s+=(i[t][r]-n)**2}return Math.sqrt(o/s)}function Sy(e,t,n,{target:r=.15,maxPasses:i=4,keepLeaves:a=!0,ignoreTarget:o=!1}={}){let s=2/(n.low+n.high),c=xy(e,t,s,a),l=e,u=0;if(o){for(let e=0;e<i;e++)l=by(l,t,s,a);u=i}else for(;u<i&&!(xy(l,t,s,a)<=r);){let e=by(l,t,s,a);if(xy(e,t,s,a)>r){l=e,u+=1;continue}let n=0,i=1,o=e;for(let c=0;c<12;c++){let c=(n+i)/2,u=l.map((t,n)=>t.map((t,r)=>(1-c)*t+c*e[n][r]));xy(u,t,s,a)>r?n=c:(i=c,o=u)}l=o,u+=i;break}return{x:l,passes:u,before:c,after:xy(l,t,s,a),tau:s}}var Cy=s({default:()=>Ey}),wy=30,Ty=50,Ey={id:`ru-2-group-smoothing`,title:`Smooth each group at the end`,author:`ru-2 (Samarsky & Gulin reader)`,description:`
<p><b>Problem.</b> On graphs made of groups (many links inside a group, few between groups),
ngraph spreads all nodes evenly over one disc, so the groups blur together.</p>
<p><b>What it does.</b> Press <i>Smooth groups</i> once the layout has settled: every node moves
part of the way to its neighbours' average, a few times, so each group pulls into a lump. Leaves
move with their hub instead, pieces under 30 nodes are skipped, and moved nodes get their speed
reset to zero.</p>
<p><b>Checks.</b> It acts only where the graph's patterns show a clear jump between whole-group
shapes and node-against-neighbour ones, and only until the scatter inside groups is down to
<i>Detail left</i>. Graphs without groups, such as grids and random graphs, fail the first check;
some trees and star-shaped graphs pass it but fail the second, as do drawings whose groups are
already apart, so all of these stay exactly as they are.</p>
<p><b>Where it comes from.</b> Samarsky &amp; Gulin, "Numerical Methods", part II ch. 2 §4: the
best single step of an iterative solver, which shrinks one band of patterns while the smoothest
ones survive, here repeated.</p>
<p><b>Look for.</b> After about 1000 steps, on sbm8x50 and communities the groups become separate
lumps (often one in the middle), grid20 and cliqueCircle don't change, and <i>Checks</i> 0 on
cliqueCircle shows what the checks prevent. It works the same in 3D and with every Repulsion
setting.</p>
<p><b>Gets worse.</b> The whole drawing shrinks (on communities links get about 2.4 times shorter),
45-63% of nodes sit almost on top of another one, leaves stick out as long spokes, and link lengths
follow the graph's distances 7-16% less well. Resume the layout and the forces undo it; on the
100k-node graph the button takes about 3 seconds.</p>`,tryGraphs:[`Benchmark: sbm8x50`,`Benchmark: communities`,`Benchmark: grid20`,`Benchmark: cliqueCircle`],params:[{key:`target`,label:`Detail left`,value:.15,step:`0.01`,help:`How much scatter inside groups to keep, relative to the spread between groups. Lower pulls groups tighter, with more overlap. Settled demo drawings start near 0.22 (sbm8x50) and 0.25 (communities); 0.15 is about where ForceAtlas2's drawings of these graphs sit. Values well below 0.15 may not be reached within Most passes (0.10 stops at 0.12 on sbm8x50 and 0.145 on communities), and each extra pass shrinks the whole drawing, groups included. 0 keeps averaging up to Most passes.`},{key:`maxPasses`,label:`Most passes`,value:4,step:`1`,help:`Upper limit on the number of averaging passes, at most 50. One pass is one sweep over the links. 0 turns the smoothing off.`},{key:`checks`,label:`Checks on (1) / off (0)`,value:1,step:`1`,help:`With 0 both checks are skipped and all Most passes run in full, ignoring Detail left (where the graph shows no jump, a typical one is assumed). On cliqueCircle each clique then collapses into a dot, which is why the checks exist.`}],finishLabel:`Smooth groups`,attach({layout:e,graph:t,params:n}){return{finish(){Oy(e,t,{target:Math.max(0,Dy(n.target,.15)),maxPasses:Math.min(Ty,Math.max(0,Math.round(Dy(n.maxPasses,4)))),checks:Number(n.checks)!==0})}}}};function Dy(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function Oy(e,t,{target:n,maxPasses:r,checks:i}){let a=[];if(t.forEachNode(e=>{a.push(e.id)}),a.length===0)return;let o=new Map(a.map((e,t)=>[e,t])),s=a.map(()=>[]),c=new Set;t.forEachLink(e=>{let t=o.get(e.fromId),n=o.get(e.toId);if(t===void 0||n===void 0||t===n)return;let r=t<n?t*a.length+n:n*a.length+t;c.has(r)||(c.add(r),s[t].push(n),s[n].push(t))});let l=Object.keys(e.getNodePosition(a[0]).toJSON()),u=performance.now(),d=[];for(let t of ky(s)){if(t.length<wy)continue;let o=new Map(t.map((e,t)=>[e,t])),c=t.map(e=>s[e].map(e=>o.get(e))),u=yy(c);if(!u){if(i){d.push({nodes:t.length,result:`no group scale, left alone`});continue}u={low:.3,high:2}}let f=Sy(l.map(n=>Float64Array.from(t,t=>e.getNodePosition(a[t])[n]||0)),c,u,{target:n,maxPasses:r,ignoreTarget:!i});f.passes>0&&t.forEach((t,n)=>{let r=a[t],i=e.getBody(r);i&&i.isPinned||(e.setNodePosition(r,...l.map((e,t)=>f.x[t][n])),i&&l.forEach(e=>{e in i.velocity&&(i.velocity[e]=0)}))}),d.push({nodes:t.length,groups:u.groups,band:[u.low,u.high].map(e=>+e.toFixed(3)),detailBefore:+f.before.toFixed(3),detailAfter:+f.after.toFixed(3),passes:+f.passes.toFixed(2)})}console.info(`Smooth each group:`,(performance.now()-u).toFixed(0)+` ms`,d)}function ky(e){let t=new Uint8Array(e.length),n=[];for(let r=0;r<e.length;r++){if(t[r])continue;let i=[r];t[r]=1;for(let n=0;n<i.length;n++)for(let r of e[i[n]])t[r]||(t[r]=1,i.push(r));n.push(i)}return n}var Ay=s({default:()=>Ny}),jy=`ru-3-stiff-springs`,My=1e9,Ny={id:`ru-3-stiff-springs`,title:`Springs stiffen when overstretched`,author:`ru-3 (Samarskii & Gulin, Numerical Methods)`,description:`
<p>On graphs with big hubs, such as starOfStars, a few links between hubs stretch to about 18 times
a typical link, and since the view zooms to fit everything, the stars are drawn as small discs on a
mostly empty screen.</p>
<p>Here a link pulls harder once it is longer than its spring length (the length a link wants to
have): twice as hard at 3 spring lengths of extra stretch, and growing with the square of the stretch
after that, while shorter links are unchanged.</p>
<p>The idea comes from Samarskii &amp; Gulin, <i>Numerical Methods</i>, chapter 3, §5: fit link lengths
by the worst link (the uniform norm) instead of on average (least squares).</p>
<p>On starOfStars the picture shrinks from about 37 typical links wide to 17 and the stars grow into
big bursts that fill the screen; megaStars changes less (32 to 24), and grid20 not at all. Compare
with <b>none</b>.</p>
<p>What gets worse: at the default time step (0.5) starOfStars never comes to rest, because the center
hub jumps back and forth on every step and the outer stars keep shimmering, and megaStars shakes more
than with <b>none</b>; on starOfStars, time step 0.25 stops it and gives the same picture. On community
graphs (sbm8x50, communities) links cross 5–8% more often, and in sbm8x50 the groups mix more.</p>
<p>Works in any number of dimensions. A safety limit keeps the pull finite at extreme settings;
normal settings never reach it.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: java`,`Benchmark: grid20`],params:[{key:`onset`,label:`Stiffen after (spring lengths)`,value:3,step:`0.5`,help:`Extra stretch, in spring lengths, at which a link pulls twice as hard as a normal spring. Smaller pulls long links in sooner: stars come closer and bigger, but groups in community graphs blend. Larger is closer to the stock springs. Typical links on starOfStars sit near 2 spring lengths, so at 3 they already pull about 15% harder. Values below 0.1 count as 0.1.`},{key:`power`,label:`Steepness`,value:2,step:`1`,help:`How fast the extra pull grows past that point: 2 grows with the square of the stretch, higher values leave moderate stretches alone and clamp only the extreme ones. 0 or less turns the extra pull off (stock springs).`}],attach({layout:e,params:t}){let n=e.simulator,r=Number.isFinite(t.onset)?Math.max(t.onset,.1):3,i=Number.isFinite(t.power)?Math.max(t.power,0):2;return n.addLinkFormula(jy,{replace:`springs`,params:{onset:r,power:i,maxExtra:My},formula:`d = r - length;
        u = d / (onset * length);
        extra = ${i===2?`u^2`:`pow(u, power)`};
        pull = coefficient * d * (d > 0 && power > 0 && length > 0 ? 1 + (extra <= maxExtra ? extra : maxExtra) : 1)`}),{dispose(){n.removeStage(jy)}}}},Py={box:{2:1024,3:128},lattice:{2:2048,3:128}},Fy=[`box`,`lattice`],Iy=[`linear`,`quadratic`],Ly=[`include`,`exclude`],Ry=new Map;function zy(e,t,n){if(!n)throw Error(`Grid field ${t} needs options`);let r=e.store,i=r.D;if(i!==2&&i!==3)throw Error(`Grid field ${t}: grid fields are 2D and 3D; this layout has ${i} dimensions`);let a=P(n.anchor,`box`,Fy,`anchor`),o=n.deposit||{},s=P(o.weights,`linear`,Iy,`deposit.weights`),c=P(n.self,`include`,Ly,`self`),l=n.into||{};if(!l.value||!l.gradient||l.value===l.gradient)throw Error(`Grid field ${t} needs two column names: into: {value, gradient}`);if(n.cell===void 0)throw Error(`Grid field ${t} needs a cell size`);let u=n.maxCells===void 0?Py[a][i]:n.maxCells;if(!(u>=1)||Math.floor(u)!==u)throw Error(`Grid field ${t}: maxCells should be a positive whole number`);let d=n.smooth||null;if(d&&d.diffuse===void 0)throw Error(`Grid field ${t}: smooth needs diffuse`);let f=By(e,t,n.params||{}),p=f.scalar(n.cell,`cell`),m=f.scalar(n.margin===void 0?0:n.margin,`margin`),h=d?f.scalar(d.diffuse,`smooth.diffuse`):null,g=f.perBody(o.value===void 0?`1`:o.value),_=[];N(l.value,1),N(l.gradient,i);let v=Hy(i,s,a,c,!!d,g.code),y=+(s===`quadratic`),b=(s===`quadratic`?3:2)**i,x={field:new Float64Array,cells:0,cell:0,unit:0,origin:new Float64Array(i),size:new Float64Array(i),lo:new Float64Array(i),hi:new Float64Array(i),columns:g.columns.map(()=>null),now:Object.create(null),bricks:null,slots:new Int32Array,inverse:[]};for(let e=0;e<i;++e)x.inverse.push({c:new Float64Array,d:new Float64Array});let S=new Float64Array,C=new Float64Array,w=e.stepContext();return e.addStage(t,T,{before:n.before,after:n.after,replace:n.replace,when:n.when,describe:j,values:M}),{name:t,dispose(){e.getStage(t)&&e.removeStage(t),_.forEach(e=>r.remove(e))}};function T(e){let r=e.n;if(r===0)return;let o=f.read(w,x.now),s=p.read(o),c=m.read(o),u=e[l.value],d=e[l.gradient];if(!u||!d)throw Error(`Grid field ${t}: the column ${u?l.gradient:l.value} is gone`);if(!(s>0&&s<1/0&&c>=0&&c<1/0)||!v.bounds(e,x)){u.fill(0,0,r),d.fill(0,0,r*i);return}a===`box`?D(s,c):O(s,c,!!h);let _=x.cell*x.cell*(i===3?x.cell:1);x.unit=g.scalar?g.read(o)/_:1/_;for(let n=0;n<g.columns.length;++n)if(x.columns[n]=e[g.columns[n]],!x.columns[n])throw Error(`Grid field ${t} reads the body column ${g.columns[n]}, which is gone`);let y=n.denseLimit===void 0?Math.max(4194304,64*r):n.denseLimit;if(a===`lattice`&&!h&&(x.cells>y||!(x.span<1073741824))){E(e,u,d);return}let b=x.cells;if(x.field.length<b?x.field=new Float64Array(Math.max(b,2*x.field.length)):x.field.fill(0,0,b),v.deposit(e,x),h){let e=h.read(o);k(e>0?e/(x.cell*x.cell):0)}v.gather(e,x,u,d)}function E(e,t,n){let r=e.n;for(x.bricks||=nb(i),x.slots.length<b*r&&(x.slots=new Int32Array(b*r)),x.bricks.reset(2*r);!v.depositSparse(e,x);)x.bricks.grow();v.gatherSparse(e,x,t,n)}function D(e,t){let n=e;for(let e=0;e<i;++e)n=Math.max(n,(x.hi[e]+t-(x.lo[e]-t))/u);let r=1;for(let e=0;e<i;++e){let i=x.lo[e]-t,a=x.hi[e]+t;x.size[e]=Math.min(Math.ceil((a-i)/n),u)+2+2*y,x.origin[e]=y?i-n:i,r*=x.size[e]}x.cell=n,x.cells=r}function O(e,n,r){let a=1,o=0;for(let s=0;s<i;++s){let i=Math.floor((x.lo[s]-n)/e),c=Math.floor((x.hi[s]+n)/e)-i;if(r&&!(c<=u))throw Error(`Grid field ${t}: the layout spans ${c} cells at cell ${e}; maxCells is ${u}`);x.origin[s]=i-y,x.size[s]=c+2+2*y,a*=x.size[s],o=Math.max(o,c)}x.cell=e,x.cells=a,x.span=o}function k(e){let t=x.field,n=x.size,r=x.cells,a=-e,o=1+2*e,s=1;for(let l=0;l<i;++l){let i=n[l];S.length<i&&(S=new Float64Array(2*i),C=new Float64Array(2*i));let u=S,d=C;d[0]=o,u[0]=a/o;for(let e=1;e<i;++e)d[e]=o-a*u[e-1],u[e]=a/d[e];if(c===`exclude`&&A(x.inverse[l],i,a,o,u,d),e===0){s*=i;continue}let f=s*i;if(s===1)for(let e=0;e<r;e+=i){t[e]=t[e]/o;for(let n=1;n<i;++n)t[e+n]=(t[e+n]-a*t[e+n-1])/d[n];for(let n=i-2;n>=0;--n)t[e+n]=t[e+n]-u[n]*t[e+n+1]}else for(let e=0;e<r;e+=f){for(let n=e;n<e+s;++n)t[n]=t[n]/o;for(let n=1;n<i;++n){let r=e+n*s,i=d[n];for(let e=r;e<r+s;++e)t[e]=(t[e]-a*t[e-s])/i}for(let n=i-2;n>=0;--n){let r=e+n*s,i=u[n];for(let e=r;e<r+s;++e)t[e]=t[e]-i*t[e+s]}}s*=i}}function A(e,t,n,r,i,a){e.d.length<t&&(e.c=new Float64Array(2*t),e.d=new Float64Array(2*t));let o=r;for(let s=t-1;s>=0;--s)s<t-1&&(o=r-n*n/o),e.d[s]=1/(a[s]+o-r),e.c[s]=i[s]}function j(){return{shape:`grid`,space:`grid`,how:`generated loops: a ${a} grid, ${s} weights${h?`, smoothed`:``}`,reads:[`pos`].concat(g.columns).reduce((e,t)=>e.concat({space:`nodes`,column:t,rows:`own`},{space:`nodes`,column:t,rows:`other`}),[]),writes:[{space:`nodes`,column:l.value,mode:`set`},{space:`nodes`,column:l.gradient,mode:`set`}],params:f.describe(),builtIns:f.builtIns(),args:{anchor:a,weights:s,self:c,maxCells:u,cell:p.describe(),margin:m.describe(),diffuse:h?h.describe():null,value:g.describe(),into:{value:l.value,gradient:l.gradient}}}}function M(e){let t=f.read(e,Object.create(null)),n={};return f.names.forEach(e=>{n[e]=t[e]}),{when:!0,params:n,cell:p.read(t),margin:m.read(t),diffuse:h?h.read(t):0,value:g.scalar?g.read(t):null}}function N(e,n){if(r.has(e)){if(r.sizeOf(e)!==n)throw Error(`Grid field ${t}: column ${e} should have ${n} number(s) per body`)}else r.define(e,Float64Array,n),_.push(e)}function P(e,n,r,i){let a=e===void 0?n:e;if(r.indexOf(a)<0)throw Error(`Grid field ${t}: ${i} should be ${r.map(e=>`'${e}'`).join(` or `)}`);return a}}function By(e,t,n){let r=Object.keys(n),i=Bu.BUILT_IN_VALUES;r.forEach(n=>{if(!/^[A-Za-z_]\w*$/.test(n)||i[n]||n===`D`||n===`pi`||e.store.has(n))throw Error(`Grid field ${t}: parameter ${n} has the name of a column or a built in value`)});let a=[],o=e.store.D;return{names:r,read(e,t){t.$context=e;for(let i=0;i<r.length;++i){let a=n[r[i]];t[r[i]]=typeof a==`function`?a(e):a}for(let n=0;n<a.length;++n)t[`$`+a[n]]=i[a[n]](e);return t},describe(){return r.map(e=>Object.assign({name:e},Vy(n[e])))},builtIns(){return a.slice()},scalar(e,n){if(typeof e==`number`)return{describe:()=>Vy(e),read:()=>e};if(typeof e==`function`)return{describe:()=>Vy(e),read:t=>e(t.$context)};if(typeof e!=`string`)throw Error(`Grid field ${t}: ${n} should be a number, a function or an expression`);let r=s(e,n,null);return{describe:()=>Vy(e),read:Function(`$now`,r.lines.join(`
`)+`
return `+r.result.code+`;`)}},perBody(e){if(typeof e==`number`&&(e=String(e)),typeof e!=`string`)throw Error(`Grid field ${t}: deposit.value should be an expression`);let n=[],r=s(e,`deposit.value`,n),i=()=>Vy(e);if(!n.length)return{describe:i,scalar:!0,columns:n,code:null,read:Function(`$now`,r.lines.join(`
`)+`
return `+r.result.code+`;`)};if(r.lines.length)throw Error(`Grid field ${t}: deposit.value should be one expression`);return{describe:i,scalar:!1,columns:n,code:r.result.code}}};function s(r,s,c){let l;try{l=Bu.compile(r,{D:o,name:u})}catch(e){throw e.message=`Grid field ${t}, ${s}: ${e.message}`,e}if(!l.result||l.result.type!==`num`)throw Error(`Grid field ${t}: ${s} should be an expression giving a number`);return l;function u(t){if(Object.prototype.hasOwnProperty.call(n,t))return{type:`num`,code:`$now[`+JSON.stringify(t)+`]`};if(c&&e.store.has(t)&&e.store.sizeOf(t)===1)return c.indexOf(t)<0&&c.push(t),{type:`num`,code:`$c${c.indexOf(t)}[$i]`};if(i[t])return a.indexOf(t)<0&&a.push(t),{type:`num`,code:`$now.$`+t}}}}function Vy(e){return typeof e==`number`?{kind:`number`,value:e}:typeof e==`string`?{kind:`expression`,text:e}:{kind:`host`}}function Hy(e,t,n,r,i,a){let o=[e,t,n,r,i,a].join(`|`),s=Ry.get(o);if(!s){let c=r===`exclude`?i?`smoothed`:`plain`:null;s={bounds:Function(`$store`,`$grid`,Wy(e)),deposit:Function(`$store`,`$grid`,Qy(e,t,n,a,!1)),gather:Function(`$store`,`$grid`,`$value`,`$gradient`,eb(e,t,n,c,a,!1))},n===`lattice`&&(s.depositSparse=Function(`$store`,`$grid`,Qy(e,t,n,a,!0)),s.gatherSparse=Function(`$store`,`$grid`,`$value`,`$gradient`,eb(e,t,n,c&&`plain`,a,!0))),Ry.set(o,s)}return s}var Uy=e=>Array.from({length:e},(e,t)=>t);function Wy(e){let t=Uy(e);return`
var pos = $store.pos, n = $store.n;
${t.map(e=>`var lo${e} = Infinity, hi${e} = -Infinity;`).join(`
`)}
for (var i = 0; i < n; ++i) {
${t.map(t=>`  var x${t} = pos[${e} * i + ${t}];\n  if (x${t} < lo${t}) lo${t} = x${t};\n  if (x${t} > hi${t}) hi${t} = x${t};`).join(`
`)}
}
if (!(${t.map(e=>`hi${e} - lo${e} < Infinity`).join(` && `)})) {
  // A body far away (at infinity) is left out of the grid
${t.map(e=>`  lo${e} = Infinity; hi${e} = -Infinity;`).join(`
`)}
  for (var j = 0; j < n; ++j) {
${t.map(t=>`    var y${t} = pos[${e} * j + ${t}];`).join(`
`)}
    if (!(${t.map(e=>`Math.abs(y${e}) < Infinity`).join(` && `)})) continue;
${t.map(e=>`    if (y${e} < lo${e}) lo${e} = y${e};\n    if (y${e} > hi${e}) hi${e} = y${e};`).join(`
`)}
  }
  if (!(${t.map(e=>`hi${e} >= lo${e}`).join(` && `)})) return false;
}
${t.map(e=>`$grid.lo[${e}] = lo${e}; $grid.hi[${e}] = hi${e};`).join(`
`)}
return true;`}function Gy(e,t){let n=[],r=t===`linear`?2:3,i=r**+e;for(let t=0;t<i;++t){let i=[],a=t;for(let t=0;t<e;++t)i.push(a%r),a=Math.floor(a/r);n.push(i)}return n}function Ky(e,t,n,r,i){let a=Uy(e),o=[],s=t=>n===`box`?`(pos[${e} * $i + ${t}] - o${t}) / cell`:`pos[${e} * $i + ${t}] / cell`;a.forEach(e=>o.push(`var g${e} = ${s(e)};`)),i&&o.push(`if (!(${a.map(e=>`Math.abs(g${e}) < 1e9`).join(` && `)})) { ${i} continue; }`),t===`linear`?(a.forEach(e=>o.push(`var i${e} = Math.floor(g${e});`)),a.forEach(e=>o.push(`var f${e} = g${e} - i${e};`))):(a.forEach(e=>o.push(`var i${e} = Math.round(g${e});`)),a.forEach(e=>o.push(`var d${e} = g${e} - i${e};`)));let c=e=>(t===`linear`?``:` - 1`)+(n===`lattice`&&r?` - o${e}`:``);return a.forEach(e=>o.push(`var t${e} = i${e}${c(e)};`)),r&&o.push(`var o = ${a.map(e=>e===0?`t0`:`t${e} * W${e===1?`0`:`01`}`).reverse().join(` + `)};`),t===`quadratic`&&a.forEach(e=>o.push(`var w${e}_0 = 0.5 * (0.5 - d${e}) * (0.5 - d${e}), w${e}_1 = 0.75 - d${e} * d${e}, w${e}_2 = 0.5 * (0.5 + d${e}) * (0.5 + d${e});`)),o.map(e=>`  `+e).join(`
`)}function qy(e,t,n){let r=[`var pos = $store.pos, n = $store.n, cell = $grid.cell, $u = $grid.unit;`];if(n?r.push(`var $bricks = $grid.bricks, F = $bricks.value, slots = $grid.slots, $K = $bricks.found;`):(r.push(`var F = $grid.field, W0 = $grid.size[0]`+(e===3?`, W01 = $grid.size[0] * $grid.size[1];`:`;`)),r.push(Uy(e).map(e=>`var o${e} = $grid.origin[${e}];`).join(` `))),t){let e=t.match(/\$c\d+/g)||[];Array.from(new Set(e)).forEach(e=>r.push(`var ${e} = $grid.columns[${e.slice(2)}];`)),t.indexOf(`$now`)>=0&&r.push(`var $now = $grid.now;`),r.push(`var $area = $u;`)}return r.join(`
`)}function Jy(e,t,n){if(n)return`$s${t}`;let r=[];return e[0]&&r.push(String(e[0])),e[1]&&r.push(e[1]===1?`W0`:e[1]+` * W0`),e[2]&&r.push(e[2]===1?`W01`:e[2]+` * W01`),r.length?`o + `+r.reverse().join(` + `):`o`}function Yy(e,t){return e===`linear`?t.map((e,t)=>e?`f${t}`:`(1 - f${t})`).join(` * `):t.map((e,t)=>`w${t}_${e}`).join(` * `)}function Xy(e,t,n){return e===`linear`?n?`f${t}`:`(1 - f${t})`:`w${t}_${n}`}function Zy(e,t,n){return e===`linear`?n?`1`:`-1`:`s${t}_${n}`}function Qy(e,t,n,r,i){let a=Gy(e,t),o=[qy(e,r,i),`for (var $i = 0; $i < n; ++$i) {`,Ky(e,t,n,!i,i?`slots[${a.length} * $i] = -1;`:null)];return r&&o.push(`  $u = (${r}) * $area;`),i&&o.push($y(e,t,a)),a.forEach((e,n)=>o.push(`  F[${Jy(e,n,i)}] += ${Yy(t,e)} * $u;`)),i&&o.push(`  if ($bricks.full(${1<<e})) return false;`),o.push(`}`),i&&o.push(`return true;`),o.join(`
`)}function $y(e,t,n){let r=Uy(e),i=t===`linear`?1:2,a=[];r.forEach(e=>a.push(`var b${e} = t${e} >> 2, z${e} = ((t${e} + ${i}) >> 2) !== b${e} ? ${1<<e} : 0;`)),a.push(`var $cross = ${r.map(e=>`z${e}`).join(` | `)};`);for(let t=0;t<1<<e;++t){let e=`$bricks.brick(${r.map(e=>t&1<<e?`b${e} + 1`:`b${e}`).join(`, `)})`;a.push(t===0?`$K[0] = ${e};`:`$K[${t}] = ($cross & ${t}) === ${t} ? ${e} : $K[$cross & ${t}];`)}return r.forEach(e=>{for(let t=0;t<=i;++t)a.push(`var e${e}_${t} = ((t${e} + ${t}) >> 2) !== b${e} ? ${1<<e} : 0, l${e}_${t} = ((t${e} + ${t}) & 3)${e?` << ${2*e}`:``};`)}),n.forEach((e,t)=>{a.push(`var $s${t} = $K[${r.map(t=>`e${t}_${e[t]}`).join(` | `)}] + ${r.map(t=>`l${t}_${e[t]}`).join(` + `)};`),a.push(`slots[${n.length} * $i + ${t}] = $s${t};`)}),a.map(e=>`  `+e).join(`
`)}function eb(e,t,n,r,i,a){let o=Uy(e),s=Gy(e,t),c=[qy(e,i,a),`for (var $i = 0; $i < n; ++$i) {`];a&&(c.push(`  if (slots[${s.length} * $i] < 0) { $value[$i] = 0; ${o.map(t=>`$gradient[${e} * $i + ${t}] = 0;`).join(` `)} continue; }`),s.forEach((e,t)=>c.push(`  var $s${t} = slots[${s.length} * $i + ${t}];`))),c.push(Ky(e,t,n,!a,null)),i&&c.push(`  $u = (${i}) * $area;`);let l=r===`plain`;t===`quadratic`&&o.forEach(e=>c.push(`  var s${e}_0 = -(0.5 - d${e}), s${e}_1 = -2 * d${e}, s${e}_2 = 0.5 + d${e};`));let u=t=>`$gradient[${e} * $i + ${t}]`;if(t===`linear`){let e=e=>`p`+e.join(``);s.forEach((n,r)=>c.push(`  var ${e(n)} = F[${Jy(n,r,a)}]${l?` - ${Yy(t,n)} * $u`:``};`)),c.push(`  var $v = ${s.map(n=>`${e(n)} * ${Yy(t,n)}`).join(` + `)};`),o.forEach(t=>{let n=s.filter(e=>e[t]===0).map(n=>{let r=n.slice();r[t]=1;let i=n.map((e,n)=>n===t?null:e?`f${n}`:`(1 - f${n})`).filter(Boolean).join(` * `);return`(${e(r)} - ${e(n)}) * ${i}`});c.push(`  var $g${t} = (${n.join(` + `)}) / cell;`)})}else c.push(`  var $v = 0, ${o.map(e=>`$g${e} = 0`).join(`, `)};`),s.forEach((e,n)=>{c.push(`  var $w = ${Yy(t,e)};`),c.push(`  var $q = F[${Jy(e,n,a)}]${l?` - $w * $u`:``};`),c.push(`  $v += $w * $q;`),o.forEach(t=>{let n=e.map((e,n)=>n===t?`s${n}_${e}`:`w${n}_${e}`).join(` * `);c.push(`  $g${t} += ${n} * $q;`)})}),o.forEach(e=>c.push(`  $g${e} /= cell;`));return r===`smoothed`&&c.push(tb(e,t)),c.push(`  $value[$i] = $v;`),o.forEach(e=>c.push(`  ${u(e)} = $g${e};`)),c.push(`}`),c.join(`
`)}function tb(e,t){let n=t===`linear`?2:3,r=[];return Uy(e).forEach(e=>{r.push(`var $ic${e} = $grid.inverse[${e}].c, $id${e} = $grid.inverse[${e}].d;`);let i=(t,n)=>`$G${e}_${Math.min(t,n)}${Math.max(t,n)}`;for(let t=0;t<n;++t)r.push(`var ${i(t,t)} = $id${e}[t${e} + ${t}];`);for(let t=0;t+1<n;++t)r.push(`var ${i(t,t+1)} = -$ic${e}[t${e} + ${t}] * ${i(t+1,t+1)};`);n===3&&r.push(`var ${i(0,2)} = -$ic${e}[t${e}] * ${i(1,2)};`);let a=r=>Uy(n).map(n=>`${i(r,n)} * ${Xy(t,e,n)}`).join(` + `);r.push(`var $read${e} = ${Uy(n).map(n=>`${Xy(t,e,n)} * (${a(n)})`).join(` + `)};`),r.push(`var $tilt${e} = ${Uy(n).map(n=>`${Zy(t,e,n)} * (${a(n)})`).join(` + `)};`)}),r.push(`$v -= $u * ${Uy(e).map(e=>`$read${e}`).join(` * `)};`),Uy(e).forEach(t=>{r.push(`$g${t} -= $u * ${Uy(e).map(e=>e===t?`$tilt${e}`:`$read${e}`).join(` * `)} / cell;`)}),r.map(e=>`  `+e).join(`
`)}function nb(e){let t=1<<2*e,n=0,r=0,i=0,a=0,o=null,s=null,c=null,l=null,u={value:null,found:new Int32Array(1<<e),reset(e){if(n<2*e){let t=1024;for(;t<2*e;)t*=2;d(t)}a+=1,a>2e9&&(s.fill(0),a=1),i=0},grow(){d(2*n),a=1,i=0},full(e){return 2*(i+e)>n},brick:e===2?p:m};return u;function d(i){n=i,r=i-1,o=new Int32Array(e*i),s=new Int32Array(i),c=new Int32Array(i),l=u.value=new Float64Array(i/2*t)}function f(e){s[e]=a;let n=i++*t;c[e]=n;for(let e=n;e<n+t;++e)l[e]=0;return n}function p(e,t){let n=(Math.imul(e,73856093)^Math.imul(t,19349663))&r;for(;;){if(s[n]!==a)return o[2*n]=e,o[2*n+1]=t,f(n);if(o[2*n]===e&&o[2*n+1]===t)return c[n];n=n+1&r}}function m(e,t,n){let i=(Math.imul(e,73856093)^Math.imul(t,19349663)^Math.imul(n,83492791))&r;for(;;){if(s[i]!==a)return o[3*i]=e,o[3*i+1]=t,o[3*i+2]=n,f(i);if(o[3*i]===e&&o[3*i+1]===t&&o[3*i+2]===n)return c[i];i=i+1&r}}}var rb=s({default:()=>sb}),ib=6e4,ab=2,ob=512,sb={id:`ru-4-grid-pressure`,title:`Grid crowding pressure`,author:`ru-4 (Samarskii & Gulin, Numerical Methods)`,description:`
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
but the stars get smaller. 2D only: in 3D the idea does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: erdos992`,`Benchmark: grid20`],params:[{key:`range`,label:`Range (spring lengths)`,value:ab,step:`0.5`,help:`How far the crowding push reaches. Short (1 to 2): big, packed stars and fans. Long (4 or more): trees and separate pieces untangle better, but stars stay smaller.`},{key:`strength`,label:`Crowding strength`,value:1,step:`0.1`,help:`How hard crowded nodes push each other apart. Higher spreads the leaves of hubs wider.`},{key:`farPush`,label:`Far push kept`,value:.3,step:`0.1`,help:`Share of the stock all-pairs push that stays on. 0 drops it (fastest; stars can show spokes and pieces drift into each other). 1 keeps the full stock push and adds the pressure.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=lb(t.range,ab),a=lb(t.strength,1),o=Math.max(0,cb(t.farPush,.3)),s=r.getStage(`repulsion`);o===0?r.removeStage(`repulsion`):o!==1&&r.addNodeFormula(`ru4-far-push`,{after:`repulsion`,params:{farPush:o},formula:`force *= select(pinned == 0, farPush, 1)`});let c=e=>e.settings.springLength>0?e.settings.springLength:10,l=e=>e.settings.springCoefficient>0?e.settings.springCoefficient:.8,u=zy(r,`ru4-pressure`,{anchor:`box`,cell:`L / 2`,margin:`3 * R`,maxCells:ob,deposit:{weights:`linear`},smooth:{diffuse:`R * R`},params:{L:c,R:e=>i*c(e)},into:{value:`ru4Pressure`,gradient:`ru4PressureSlope`}});return r.addNodeFormula(`ru4-crowding`,{after:`ru4-pressure`,params:{k:e=>ib*a*(i/ab)**2*(l(e)/.8)*(c(e)/10)**4},formula:`force -= select(pinned == 0, k * ru4PressureSlope, 0 * pos)`}),{dispose(){[`ru4-far-push`,`ru4-crowding`].forEach(e=>{r.getStage(e)&&r.removeStage(e)}),u.dispose(),r.getStage(`repulsion`)||r.addStage(`repulsion`,s,{after:`clear`})}}}};function cb(e,t){let n=Number(e);return Number.isFinite(n)?n:t}function lb(e,t){let n=cb(e,t);return n>0?n:t}function ub(e){if(e&e-1)throw Error(`Grid size must be a power of two`);let t=new Float64Array(e),n=new Float64Array(e),r=new Float64Array(e),i=new Float64Array(e);for(let t=0;t<e;t++)r[t]=Math.cos(Math.PI*t/(2*e)),i[t]=Math.sin(Math.PI*t/(2*e));let a=Math.log2(e),o=new Uint32Array(e);for(let t=0;t<e;t++){let e=0;for(let n=0;n<a;n++)t&1<<n&&(e|=1<<a-1-n);o[t]=e}let s=new Float64Array(e),c=new Float64Array(e);return{forward2D:f,inverse2D:p};function l(r){for(let r=0;r<e;r++){let e=o[r];if(e>r){let i=t[r];t[r]=t[e],t[e]=i,i=n[r],n[r]=n[e],n[e]=i}}for(let i=2;i<=e;i<<=1){let a=i>>1,o=(r?2:-2)*Math.PI/i,s=Math.cos(o),c=Math.sin(o);for(let r=0;r<e;r+=i){let e=1,i=0;for(let o=0;o<a;o++){let l=r+o,u=l+a,d=t[u]*e-n[u]*i,f=t[u]*i+n[u]*e;t[u]=t[l]-d,n[u]=n[l]-f,t[l]+=d,n[l]+=f;let p=e*s-i*c;i=e*c+i*s,e=p}}}}function u(a,o){for(let n=0;n<e/2;n++)t[n]=a[2*n],t[e-1-n]=a[2*n+1];n.fill(0),l(!1);for(let a=0;a<e;a++)o[a]=t[a]*r[a]+n[a]*i[a]}function d(a,o){for(let o=0;o<e;o++){let s=a[o],c=o===0?0:-a[e-o];t[o]=s*r[o]-c*i[o],n[o]=s*i[o]+c*r[o]}l(!0);for(let n=0;n<e/2;n++)o[2*n]=t[n]/e,o[2*n+1]=t[e-1-n]/e}function f(e,t){m(e,t,u)}function p(e,t){m(e,t,d)}function m(t,n,r){for(let i=0;i<e;i++){for(let n=0;n<e;n++)s[n]=t[i*e+n];r(s,c);for(let t=0;t<e;t++)n[i*e+t]=c[t]}for(let t=0;t<e;t++){for(let r=0;r<e;r++)s[r]=n[r*e+t];r(s,c);for(let r=0;r<e;r++)n[r*e+t]=c[r]}}}function db(e,t,n={}){let r=n.sea??1,i=n.amount??1,a=n.margin??.15,o=e.length/2,s=fb(o),c=s*s,l=1/0,u=1/0,d=-1/0,f=-1/0;for(let t=0;t<o;t++){let n=e[2*t],r=e[2*t+1];n<l&&(l=n),n>d&&(d=n),r<u&&(u=r),r>f&&(f=r)}let p=Math.max(d-l,f-u,1e-9)*(1+2*a),m=(l+d)/2-p/2,h=(u+f)/2-p/2,g=p/s,_=new Float64Array(o),v=new Float64Array(o);for(let t=0;t<o;t++)_[t]=(e[2*t]-m)/g,v[t]=(e[2*t+1]-h)/g;let y=ub(s),b=new Float64Array(c),x=new Float64Array(c),S=new Float64Array(s);for(let e=0;e<s;e++)S[e]=4*Math.sin(Math.PI*e/(2*s))**2;let C=new Float64Array(c);ee(C),F(C),y.forward2D(C,b);let w=new Float64Array(c),T=new Float64Array(c),E=new Float64Array(c),D=new Float64Array(c),O=new Float64Array(c),k=new Float64Array(c),A=i/S[1],j=0,M=0;return{advance(e=1/0,t=12){let n=performance.now();for(let r=0;r<e&&!N()&&performance.now()-n<t;r++)P();return N()},isDone:N,getSteps:()=>M,gridSize:s};function N(){return j>=A-1e-12||M>=400}function P(){I(j,w);let n=R(w,E,D),r=Math.min(A-j,.25/n,Math.max(.05,j));I(j+r/2,T),R(T,O,k);for(let n=0;n<o;n++){if(t&&!t[n])continue;let i=_[n]+.5*r*z(E,_[n],v[n]),a=v[n]+.5*r*z(D,_[n],v[n]);_[n]=te(_[n]+r*z(O,i,a)),v[n]=te(v[n]+r*z(k,i,a)),e[2*n]=m+_[n]*g,e[2*n+1]=h+v[n]*g}j+=r,M++}function F(e){y.forward2D(e,b),L(2),y.inverse2D(x,e);let t=.5/(4*Math.PI*2),n=0,i=0;for(let r=0;r<c;r++)e[r]>t&&(n++,i+=e[r]);let a=r*i/Math.max(1,n);for(let n=0;n<c;n++)e[n]<=t&&(e[n]=a)}function I(e,t){L(e),y.inverse2D(x,t)}function L(e){for(let t=0;t<s;t++)for(let n=0;n<s;n++)x[t*s+n]=b[t*s+n]*Math.exp(-(S[n]+S[t])*e)}function R(e,t,n){let r=1e-12;for(let i=0;i<s;i++)for(let a=0;a<s;a++){let o=i*s+a,c=Math.max(e[o],1e-12),l=a>0&&a<s-1?(e[o+1]-e[o-1])/2:0,u=i>0&&i<s-1?(e[o+s]-e[o-s])/2:0;t[o]=-l/c,n[o]=-u/c;let d=Math.max(Math.abs(t[o]),Math.abs(n[o]));d>r&&(r=d)}return r}function z(e,t,n){t=Math.min(s-1,Math.max(0,t-.5)),n=Math.min(s-1,Math.max(0,n-.5));let r=Math.min(s-2,Math.floor(t)),i=Math.min(s-2,Math.floor(n)),a=t-r,o=n-i,c=i*s+r;return e[c]*(1-a)*(1-o)+e[c+1]*a*(1-o)+e[c+s]*(1-a)*o+e[c+s+1]*a*o}function ee(e){for(let t=0;t<o;t++){let n=_[t]-.5,r=v[t]-.5,i=Math.floor(n),a=Math.floor(r),o=n-i,s=r-a;B(e,i,a,(1-o)*(1-s)),B(e,i+1,a,o*(1-s)),B(e,i,a+1,(1-o)*s),B(e,i+1,a+1,o*s)}}function B(e,t,n,r){t=Math.min(s-1,Math.max(0,t)),n=Math.min(s-1,Math.max(0,n)),e[n*s+t]+=r}function te(e){return Math.min(s-1e-6,Math.max(1e-6,e))}}function fb(e){let t=2*Math.sqrt(Math.max(e,1));return Math.min(256,Math.max(64,2**Math.round(Math.log2(t))))}var pb=s({default:()=>hb}),mb=2,hb={id:`ru-5-heat-spread`,title:`Heat-like spreading at the end`,author:`ru-5 (Samarsky & Gulin reader)`,description:`
<p>In ngraph's pictures crowded spots sit next to empty space: a hub's leaves pile into a small
solid disc, and on yeast the main piece shrinks to a dot in a mostly empty frame.</p>
<p>Let the layout settle, then press the button below (2D only: in 3D it doesn't appear): the crowding
spreads out the way heat spreads through a metal plate and carries the nodes along, so packed areas
grow into empty space while nearby nodes move together and keep their order.</p>
<p>The spreading is the heat equation, solved with the Fourier method so that it never makes a new
crowded or empty spot (Samarsky &amp; Gulin, <i>Numerical Methods</i>, the chapters on the maximum
principle and on separation of variables); carrying the nodes along is Gastner and Newman's
density-equalizing map.</p>
<p>Unlike the round-2 lab version, which added the drawing's average density everywhere, empty space
is set to that average, and the density is first blurred over about two grid cells: a grid keeps its
outline better, but the push is stronger (starOfStars crossings ×1.9 instead of ×1.3). At the end the
whole picture is shrunk evenly back into its old frame, so it stays in view, and the nodes are left
at rest.</p>
<p>Look at megaStars and starOfStars, where the big star discs grow to about twice their size and show
their spokes, and at yeast, whose main piece grows from a tenth to over a quarter of the frame; grid20
barely changes.</p>
<p>What gets worse: edge crossings on starOfStars nearly double, small side pieces (on yeast) shrink and
the smallest stars don't open, groups blend a little, a grid's corners round off, "Fill the frame"
bends shapes towards a round outline, and the change lasts only until you press Run: the forces pull
most of it back within about 200 steps.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: yeast`,`Benchmark: grid20`],params:[{key:`fill`,label:`Fill the frame`,value:0,step:`0.1`,help:`0: only crowded spots spread; empty space counts as if it were as full as the drawing on average, so the outline barely moves. 1: empty space counts as nearly empty, so the whole drawing also grows into it until it fills most of the frame. Dense areas open more, but shapes bend towards a round outline. Values in between mix the two.`},{key:`time`,label:`Spreading time`,value:1,step:`0.5`,help:`How long the heat spreads. At 1 the broadest density differences, across the whole drawing, fade to about a third; smaller ones fade more. Bigger values make the density more even everywhere; smaller ones are a gentler touch. 0 does nothing. The spreading stops after at most 400 flow steps.`}],finishLabel:`Spread the crowding like heat`,attach({layout:e,graph:t,params:n,settings:r}){if(r.dimensions&&r.dimensions!==2)return{};let i=0;return{finish(){a();let r=[];t.forEachNode(t=>{r.push(e.getBody(t.id))});let o=r.length;if(o<2)return;let s=new Float64Array(2*o),c=new Uint8Array(o);r.forEach((e,t)=>{s[2*t]=e.pos.x,s[2*t+1]=e.pos.y,c[t]=+!e.isPinned});let l=db(s,c,{sea:1-.8*Math.min(1,Math.max(0,gb(n.fill,0))),amount:Math.max(0,gb(n.time,1))}),u=_b(s),d=c.includes(0),f=()=>{let e=l.advance(mb),t=d?u:_b(s),n=d?1:Math.min(1,u.width/t.width,u.height/t.height);r.forEach((e,r)=>{c[r]&&(e.pos.x=u.cx+(s[2*r]-t.cx)*n,e.pos.y=u.cy+(s[2*r+1]-t.cy)*n,e.velocity.x=0,e.velocity.y=0)}),i=e?0:requestAnimationFrame(f)};f()},dispose:a};function a(){i&&cancelAnimationFrame(i),i=0}}};function gb(e,t){return typeof e==`number`&&!Number.isNaN(e)?e:t}function _b(e){let t=1/0,n=1/0,r=-1/0,i=-1/0;for(let a=0;a<e.length;a+=2)e[a]<t&&(t=e[a]),e[a]>r&&(r=e[a]),e[a+1]<n&&(n=e[a+1]),e[a+1]>i&&(i=e[a+1]);return{cx:(t+r)/2,cy:(n+i)/2,width:Math.max(r-t,1e-9),height:Math.max(i-n,1e-9)}}function vb(e,t,n={}){let r=e.length,i=bb(n.crowding)?Math.max(0,n.crowding):2,a=Math.min(yb,Math.max(0,Math.round(bb(n.passes)?n.passes:40))),o=n.grid||Math.max(16,Math.min(128,Math.round(1.5*Math.sqrt(r)))),s=n.movable||null,c=n.piece||null,l=n.pieceSize||null,u=bb(n.rigidBelow)?n.rigidBelow:30,d=.25,f=1/0,p=1/0,m=-1/0,h=-1/0;for(let n=0;n<r;n++)e[n]<f&&(f=e[n]),e[n]>m&&(m=e[n]),t[n]<p&&(p=t[n]),t[n]>h&&(h=t[n]);let g=Math.max(m-f,h-p,1e-9)*1.0001,_=(f+m)/2-g/2,v=(p+h)/2-g/2,y=Number.isFinite(_)&&Number.isFinite(v)&&Number.isFinite(g),b=g/o,x=r/(o*o),S=new Float64Array(o*o),C=new Float64Array(o);for(let e=0;e<o;e++){C[e]=4*Math.sin(Math.PI*e/(2*o))**2;for(let t=0;t<o;t++)S[e*o+t]=Math.cos(Math.PI*e*(t+.5)/o)}let w=new Float64Array(o*o),T=new Float64Array(o*o),E=new Float64Array(o*o),D=new Float64Array(o*o),O=new Float64Array(o*o),k=new Float64Array(o*o),A=new Float64Array(o),j=new Float64Array(o),M=new Float64Array(o),N=new Float64Array(r),P=new Float64Array(r),F=l?l.length:0,I=new Float64Array(F),L=new Float64Array(F),R=new Float64Array(F),z=new Float64Array(F),ee=new Float64Array(F),B=new Float64Array(F),te=new Float64Array(F),ne=-1;for(let e=0;e<F;e++)(ne<0||l[e]>l[ne])&&(ne=e);let re=0;return{step:ie,gridSize:o};function ie(){return re>=a||!y||(ae(),V(),V(),oe()?(se(),ce(),re+=1,re>=a):(re=a,!0))}function ae(){w.fill(0);for(let n=0;n<r;n++){let r=(e[n]-_)/b-.5,i=(t[n]-v)/b-.5,a=Math.floor(r),s=Math.floor(i),c=r-a,l=i-s,u=U(a),d=U(a+1),f=U(s),p=U(s+1);w[f*o+u]+=(1-c)*(1-l),w[f*o+d]+=c*(1-l),w[p*o+u]+=(1-c)*l,w[p*o+d]+=c*l}}function V(){for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++)T[t+e]=.25*w[t+Math.max(0,e-1)]+.5*w[t+e]+.25*w[t+Math.min(o-1,e+1)]}for(let e=0;e<o;e++){let t=Math.max(0,e-1)*o,n=Math.min(o-1,e+1)*o,r=e*o;for(let e=0;e<o;e++)w[r+e]=.25*T[t+e]+.5*T[r+e]+.25*T[n+e]}}function oe(){let e=i*x,t=0;for(let n=0;n<o*o;n++){let r=w[n]>e?w[n]-e:0;T[n]=r,t+=r}if(t<=1e-9*r)return!1;t/=o*o;for(let e=0;e<o*o;e++)T[e]-=t;for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++){let n=e*o,r=0;for(let e=0;e<o;e++)r+=T[t+e]*S[n+e];E[t+e]=r}}for(let e=0;e<o;e++){let t=e===0?1e-6:0;for(let t=0;t<o;t++)M[t]=E[t*o+e];let n=1+C[e]+t;A[0]=1/n,j[0]=-M[0]/n;for(let r=1;r<o;r++){n=(r===o-1?1:2)+C[e]+t;let i=n-A[r-1];A[r]=1/i,j[r]=(j[r-1]-M[r])/i}M[o-1]=j[o-1];for(let e=o-2;e>=0;e--)M[e]=A[e]*M[e+1]+j[e];for(let t=0;t<o;t++)E[t*o+e]=M[t]}for(let e=0;e<o;e++){let t=e*o;for(let e=0;e<o;e++){let n=E[t];for(let r=1;r<o;r++)n+=2*E[t+r]*S[r*o+e];D[t+e]=n/o}}return!0}function se(){for(let e=0;e<o;e++){let t=e*o,n=Math.max(0,e-1)*o,r=Math.min(o-1,e+1)*o;for(let e=0;e<o;e++)O[t+e]=(D[t+Math.min(o-1,e+1)]-D[t+Math.max(0,e-1)])/2,k[t+e]=(D[r+e]-D[n+e])/2}}function ce(){for(let n=0;n<r;n++){let r=(e[n]-_)/b-.5,i=(t[n]-v)/b-.5,a=Math.max(H(w,r,i),.05*x),o=d*H(O,r,i)/a,s=d*H(k,r,i)/a,c=Math.hypot(o,s);c>1&&(o*=1/c,s*=1/c),N[n]=o*b,P[n]=s*b}if(c){I.fill(0),L.fill(0),R.fill(0),z.fill(1/0),ee.fill(1/0),B.fill(1/0),te.fill(1/0);for(let n=0;n<r;n++){if(s&&!s[n])continue;let r=c[n];I[r]+=N[n],L[r]+=P[n],R[r]+=1,z[r]=Math.min(z[r],e[n]-_),ee[r]=Math.min(ee[r],_+g-e[n]),B[r]=Math.min(B[r],t[n]-v),te[r]=Math.min(te[r],v+g-t[n])}for(let e=0;e<r;e++){let t=c[e];t===ne||l[t]>=u||!R[t]||(R[t]<l[t]?(N[e]=0,P[e]=0):(N[e]=Math.max(-z[t],Math.min(ee[t],I[t]/R[t])),P[e]=Math.max(-B[t],Math.min(te[t],L[t]/R[t]))))}}for(let n=0;n<r;n++)(!s||s[n])&&(e[n]=Math.min(_+g,Math.max(_,e[n]+N[n])),t[n]=Math.min(v+g,Math.max(v,t[n]+P[n])))}function H(e,t,n){let r=Math.floor(t),i=Math.floor(n),a=t-r,s=n-i,c=U(r),l=U(r+1),u=U(i)*o,d=U(i+1)*o;return(1-a)*(1-s)*e[u+c]+a*(1-s)*e[u+l]+(1-a)*s*e[d+c]+a*s*e[d+l]}function U(e){return e<0?0:e>o-1?o-1:e}}var yb=1e3;function bb(e){return typeof e==`number`&&!Number.isNaN(e)}var xb=s({default:()=>Sb}),Sb={id:`ru-6-spread-crowds`,title:`Spread crowded areas at the end`,author:`ru-6 (Samarskii & Gulin, ch. 5 reader)`,description:`
<p>In ngraph's pictures the details are drawn tiny: a star's leaves sit in a small dark disc, and
on graphs with many separate pieces the main part is a small ball in a mostly empty frame.</p>
<p>This final step keeps the frame fixed and lets crowded places spread out, the way a gas moves from
high pressure to low: places more than twice as crowded as the average push, and the nodes they push
out spread over every emptier part of the frame, the gaps between groups included. The "pressure" is
the solution of Poisson's equation, solved directly with the sweep method from Samarskii and Gulin,
«Численные методы», chapter 5.</p>
<p>Added on top: no node moves more than one grid cell per pass, and on graphs with a small central
ball this speed limit, with Passes, decides how far the ball grows; nodes stop at the frame; separate
pieces under 30 nodes move and stop as a whole; nearly empty places count as 1/20 of the average
crowding, so no node gets an endless speed; and node speeds are reset to zero at the end.</p>
<p>Let the layout settle, then press the button below: stars open into fans, and on sciMet the main
piece grows from about 8% to 86% of the frame, while communities and grids barely move.</p>
<p>What gets worse: edges lose their equal length, fans that reach the frame are flattened, where two
fans meet their tips run into each other and cross, gaps between dense groups shrink (by about 40% on
cliqueCircle), tall or wide drawings become squarer, and EVA's thousands of tiny pieces get herded
together. Running the layout again pulls the stars back into discs; the step ignores the layout
settings (Repulsion and the rest), and in 3D there is no button.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: sciMet`,`Benchmark: erdos992`,`Benchmark: communities`],params:[{key:`crowding`,label:`Push above (× average)`,value:2,step:`0.5`,help:`Only places more crowded than this many times the average push outward; the nodes they push out fill every emptier place, gaps between groups included. 1 evens out the whole picture, which also fills the gaps between communities; 0 or less lets every place with nodes push, which evens it out even more; 3 or more opens only the worst clumps.`},{key:`passes`,label:`Passes`,value:40,step:`10`,help:`How far the spreading goes, at most 1000; 0 does nothing. In one pass no node moves more than one grid cell, and on graphs with a small central ball this limit, not the pressure, sets how far the ball grows. More passes open the fans further but flatten the ones that reach the frame. The step stops early once nothing is crowded.`},{key:`rigidBelow`,label:`Rigid pieces under`,value:30,step:`10`,help:`Separate pieces with fewer nodes than this move as a whole, keep their shape, and stop as a whole at the frame; the main piece always stretches, and a small piece with a pinned node stays put. 0 lets every piece stretch, and pieces pushed into the frame get squashed against it.`}],finishLabel:`Spread crowded areas`,attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return{};let i=0;return{finish:a,dispose:o};function a(){if(i)return;let r=[],a=new Map;e.forEachBody((e,t)=>{a.set(t,r.length),r.push(e)});let o=r.length;if(o<2)return;let s=new Float64Array(o),c=new Float64Array(o),l=new Uint8Array(o);for(let e=0;e<o;e++)s[e]=r[e].pos.x,c[e]=r[e].pos.y,l[e]=r[e].isPinned||!Number.isFinite(s[e])||!Number.isFinite(c[e])?0:1;let{piece:u,pieceSize:d}=Cb(t,a,o),f=vb(s,c,{crowding:Number(n.crowding),passes:Number(n.passes),rigidBelow:Number(n.rigidBelow),movable:l,piece:u,pieceSize:d});i=requestAnimationFrame(p);function p(){let e=performance.now(),t;do t=f.step();while(!t&&performance.now()-e<12);for(let e=0;e<o;e++){if(!l[e])continue;let t=r[e];t.pos.x=s[e],t.pos.y=c[e],t.velocity.x=0,t.velocity.y=0}i=t?0:requestAnimationFrame(p)}}function o(){i&&cancelAnimationFrame(i),i=0}}};function Cb(e,t,n){let r=new Int32Array(n).fill(-1),i=[],a=Array(n);t.forEach((e,t)=>{a[e]=t});let o=new Int32Array(n);for(let s=0;s<n;s++){if(r[s]>=0)continue;let n=i.length,c=0,l=0;for(o[l++]=s,r[s]=n;c<l;){let i=o[c++];e.forEachLinkedNode(a[i],e=>{let i=t.get(e.id);i!==void 0&&r[i]<0&&(r[i]=n,o[l++]=i)})}i.push(l)}return{piece:r,pieceSize:Int32Array.from(i)}}var wb=s({default:()=>Tb}),Tb={id:`v1-1-short-range-push`,title:`Push fades fast with distance`,author:`v1-1 (Feynman Vol. I, ch. 1-6)`,description:`
<p><b>The problem.</b> On graphs with big hubs, ngraph draws each star as a small, dense disc far
from the next one, and on graphs with many pieces the main piece shrinks while the small pieces
drift away.</p>
<p><b>The change.</b> Two nodes still push each other as usual when they are close, but the push
dies out beyond about <i>Push range</i> spring lengths, so a big group no longer shoves everything
away with its whole crowd. Neutral atoms behave this way: their plus and minus charges cancel, so
they barely feel each other until they come close (Feynman, <i>Lectures on Physics</i>, Vol. I,
chapter 2).</p>
<p><b>What to look for.</b> On starOfStars and megaStars the stars grow into large bursts that
nearly touch; on yeast the main piece takes about 40% of the frame instead of 10%, and the small
pieces stay close instead of drifting away; on sbm8x50 almost nothing changes.</p>
<p><b>What gets worse.</b> More edges cross where groups touch, and trees fold up and lose their
long trunk edges (binTree8, forest5k); <i>Push range</i> 4 brings part of the trunk back and clears
the crumpled corner grid20 can keep at 2. On yeast about three times as many nodes keep shaking
(15% to 44% of nodes moving at the speed limit). Each step takes about 1.6 times as long with the
quad tree and 2.5 times with the <i>dual tree</i> (one exp() per pair); it works in 3D too.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: yeast`,`Benchmark: sbm8x50`],params:[{key:`range`,label:`Push range`,value:2,step:`0.5`,help:`How far the push reaches, in spring lengths. Small (2): stars and pieces pack tightly, trees lose their trunk. Large (4-8): closer to the stock layout. 0 or less turns the idea off: the stock push, with whichever Repulsion method is picked.`}],attach({layout:e,params:t}){let n=Math.max(0,Number(t.range)||0);if(!(n>0))return null;let r=e.simulator.repulsionLaw().spec;return e.simulator.repulsionLaw({force:`(1 + r / L) * exp(-r / L) / r^2`,params:{L:e=>{let t=n*e.springLength();return t>0?Math.max(t,1e-300):1/0}}}),{dispose(){e.simulator.repulsionLaw(r)}}}},Eb=2048,Db=8;function Ob(e,{fadeLength:t,leafLinks:n}){let r=e.simulator,i=r.store,a=r.repulsionCharge(),o=r.repulsionSensitivity(),s=r.repulsionLaw().spec;i.define(`leafFadeCore`),i.define(`leafFadeLeafCharge`),r.addNodeFormula(`leafFadeCharges`,{before:`repulsion`,params:{leafLinks:n},formula:`leaf = degree >= 1 && degree <= leafLinks;
      leafFadeCore = leaf ? 0 : ${a}; leafFadeLeafCharge = leaf ? ${a} : 0`});let c=new Float64Array(2049);for(let e=0;e<=Eb;++e)c[e]=Math.exp(-e*Db/Eb);let l={force:`E(r / F) / r^2`,params:{F:e=>e.springLength()>0?t*e.springLength():0},range:`6 * F`,tables:{E:{from:0,to:Db,values:c}}};return r.repulsionLaw(l),r.repulsionSensitivity(`leafFadeLeafCharge`),r.addRepulsion(`leafFadeCore`,{after:`repulsion`,charge:`leafFadeCore`,centroid:`shared`}),r.addRepulsion(`leafFadeLeaves`,{after:`leafFadeCore`,charge:`leafFadeLeafCharge`,sensitivity:`leafFadeCore`,law:l,centroid:`shared`}),function(){[`leafFadeLeaves`,`leafFadeCore`,`leafFadeCharges`].forEach(e=>r.removeStage(e)),r.repulsionLaw(s),r.repulsionSensitivity(o),[`leafFadeCore`,`leafFadeLeafCharge`].forEach(e=>i.remove(e))}}var kb=s({default:()=>Ab}),Ab={id:`v1-2-leaf-fade`,title:`Only leaf pushes fade`,author:`v1-2 (Feynman Vol. 1, ch. 12-13)`,description:`
<p>ngraph draws a hub with many leaves (nodes that have only one link) as a small, solid disc, far
from the other discs on a mostly empty screen: seen from far off, a crowd of leaves pushes like
one heavy node.</p>
<p>Here, every push that involves a leaf fades with distance, like the short-range force inside
atomic nuclei in the Feynman Lectures (Vol. 1, ch. 12; "a crowd pushes like one node" is the
shell theorem of ch. 13), and every other push stays as it is.</p>
<p>Look for stars opening into large sunbursts (starOfStars, megaStars) and trees keeping their
main branches (paTree3k); grid20 has no leaves and looks the same.</p>
<p>What gets worse: more lines cross inside the sunbursts, and small pieces (caterpillars) pack
closer and overlap. On EVA, a piece of two linked nodes counts as two leaves, so it loses all
long-range push and mixes into the main part, which is much of why EVA fills the screen
better.</p>
<p>2D only (it does nothing in 3D). Its pushes always walk one quad tree, whichever Repulsion
setting is picked: a step takes about 1.35 to 1.55 times as long as the stock quad tree, and about 8
times as long as the dual tree.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: paTree3k`,`Benchmark: grid20`],params:[{key:`fade`,label:`Fade distance`,value:3,step:`0.5`,help:`How far a leaf's push reaches, in ideal spring lengths. Smaller packs the stars closer together; 0 means leaves don't push at all and pile up around their hub. Larger moves toward none: on starOfStars 20 is still clearly different, and about 100 looks like none. Faded pushes past 6 fade distances are dropped (they are under 0.25%).`},{key:`leafLinks`,label:`Fade nodes with at most this many links`,value:1,step:`1`,help:`Nodes with 1 up to this many links fade; nodes with no links never do. 0 fades nothing, so it pushes like none. 1 fades only leaves. Raise it to fade more nodes: at 1000 almost every push fades (hubs with more links keep theirs), the stars open even more, but trees lose the gaps between their branches and turn into an even carpet.`}],attach({layout:e,params:t,settings:n}){return(n.dimensions||2)!==2||!e.simulator.getStage(`repulsion`)?null:{dispose:Ob(e,{fadeLength:jb(t.fade,3,0),leafLinks:jb(t.leafLinks,1,0)})}}};function jb(e,t,n){let r=Number(e);return Number.isNaN(r)?t:Math.max(r,n)}function Mb(e,{runs:t=8,certainty:n=.75,minGroupFactor:r=1}={}){let i=[],a=new Map;e.forEachNode(e=>{a.set(e.id,i.length),i.push(e.id)});let o=i.length,s=[],c=new Int32Array(o);e.forEachLink(e=>{let t=a.get(e.fromId),n=a.get(e.toId);t!==n&&(s.push({link:e,a:t,b:n}),c[t]+=1,c[n]+=1)});let l=new Int32Array(o+1);for(let e=0;e<o;e++)l[e+1]=l[e]+c[e];let u=new Int32Array(l[o]),d=l.slice(0,o);for(let{a:e,b:t}of s)u[d[e]++]=t,u[d[t]++]=e;let f=[];for(let e=0;e<t;e++)f.push(Nb(o,l,u,7919*(e+1)));let p=f[0],m=new Int32Array(o).fill(-1),h=new Map;for(let e=0;e<o;e++)h.set(p[e],(h.get(p[e])||0)+1);let g=r*Math.sqrt(o),_=new Map;for(let[e,t]of h)t>=g&&_.set(e,_.size);let v=Array.from({length:_.size},()=>[]);for(let e=0;e<o;e++){let t=_.get(p[e]);t!==void 0&&(m[e]=t,v[t].push(i[e]))}let y=new Map;for(let{link:e,a:r,b:i}of s){let a=m[r],o=m[i];if(a<0||o<0||a===o)continue;let s=0;for(let e of f)e[r]!==e[i]&&(s+=1);if(s<n*t)continue;let c=Math.min(a,o)*v.length+Math.max(a,o),l=y.get(c);l||(l={a:Math.min(a,o),b:Math.max(a,o),links:[]},y.set(c,l)),l.links.push(e)}return{groups:v,pairs:[...y.values()]}}function Nb(e,t,n,r){let i=Pb(r),a=new Int32Array(e);for(let t=0;t<e;t++)a[t]=t;let o=new Int32Array(e);for(let t=0;t<e;t++)o[t]=t;let s=new Float64Array(e),c=new Int32Array(e);for(let r=0;r<50;r++){for(let t=e-1;t>0;t--){let e=Math.floor(i()*(t+1)),n=o[t];o[t]=o[e],o[e]=n}let r=0;for(let l=0;l<e;l++){let e=o[l],u=t[e],d=t[e+1];if(u===d)continue;let f=0;for(let e=u;e<d;e++){let t=a[n[e]];s[t]===0&&(c[f++]=t),s[t]+=1}let p=a[e],m=-1,h=0;for(let e=0;e<f;e++){let t=c[e],n=s[t];n>m?(p=t,m=n,h=1):n===m&&i()*++h<1&&(p=t),s[t]=0}p!==a[e]&&(a[e]=p,r+=1)}if(!r)break}return a}function Pb(e){let t=e|0;return function(){t=t+1831565813|0;let e=Math.imul(t^t>>>15,1|t);return e=e+Math.imul(e^e>>>7,61|e)^e,((e^e>>>14)>>>0)/4294967296}}var Fb=s({default:()=>Bb}),Ib=25,Lb=.05,Rb=[4069403647,3780598271,3989391615,1503743999,4288522239,2960826879,1991750399,4294967295,2624937983,3132140799],zb=[`groupCount`,`groupMass`,`groupPos`,`groupSpread`],Bb={id:`v1-3-group-bridges`,title:`Tune links between communities`,author:`v1-3 (Feynman Vol 1, Ch. 15-23)`,description:`
<p>On graphs made of communities (groups of nodes linked mostly among themselves),
ngraph draws one even sheet in which the groups touch and mix.</p>
<p>This idea finds the groups once and, every 25 steps, loosens only the links between two
groups, so that the push and pull of the two whole groups balance at about <b>Gap</b> group
widths apart (those links never get stiffer, keep at least 5% of their stiffness, and never
aim closer than 1.5 link lengths).</p>
<p>It comes from Feynman, Vol 1, chapters 18&ndash;19: the forces inside a body cancel, so only
outside forces move its centre, and from far away a whole group pushes like one heavy node.</p>
<p>Look for separate colored blobs with long links across white gaps: on sbm8x50 the group
centres move from about 1.8 to 2.6 group widths apart.</p>
<p>If nothing is colored, it found no linked groups and the layout is the same as <b>none</b>
(grid20, or any 3D layout).</p>
<p>What gets worse: stress (how badly drawn distances match the number of hops between nodes)
rises 18% on sbm8x50 and 29% on communities, the gaps leave more of the frame empty, and the
default settings also push apart two or three big groups in sciMet (stress +24%), npmMix4 and
erdos992.</p>
<p>Lower <b>Smallest group</b> to 1 and weak groups (Miserables) and random clumps (rgg1500)
get pulled apart as well.</p>`,tryGraphs:[`Benchmark: sbm8x50`,`Benchmark: communities`,`Groups 8x250 (2k)`,`Benchmark: grid20`],params:[{key:`gap`,label:`Gap`,value:2.5,step:`0.5`,help:`Target distance between the centres of two linked groups, in group widths (a group's width is the root-mean-square distance of its nodes from its centre; the two widths are added). The other groups push too, so real distances come out closer to the middle: on sbm8x50, 1.5 gives about 2.2, 2.5 about 2.6 (like ForceAtlas2), 3.5 about 3.4 (tight blobs, very long links). 0 or less asks for no gap, so the links stay as stiff as before.`},{key:`certainty`,label:`Group certainty`,value:.75,step:`0.05`,help:`Communities are searched 8 times from different random orders. A link counts as running between groups only if it does so in at least this share of the searches, so it moves in steps of 1/8 (0.75 means 6 of 8). Lower lets links of fuzzier groups loosen too (0: every link between two groups); higher keeps only the clearest ones (above 1: none, so nothing changes).`},{key:`minGroup`,label:`Smallest group`,value:2,step:`0.5`,help:`Smallest group that counts, as a multiple of the square root of the number of nodes (400 nodes: 2 means 40; 0 counts every group, however small). 1 lets smaller groups separate too, but then weak groups (Miserables) and random clumps (rgg1500) get pulled apart as well.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let{groups:i,pairs:a}=Mb(t,{certainty:Vb(n.certainty,.75),minGroupFactor:Vb(n.minGroup,2)});if(!a.length)return null;let o=Math.max(0,Vb(n.gap,2.5)),s=e.simulator,c=`step - floor(step / ${Ib}) * ${Ib} == ${s.iteration()%Ib}`,l=s.store,u=s.springStore;l.define(`group`,Int32Array,1,-1),u.define(`groupA`,Int32Array,1,-1),u.define(`groupB`,Int32Array,1,-1),u.define(`bridges`,Int32Array),u.define(`ownCoefficient`,Float64Array,1,-1),u.ownCoefficient.set(u.coefficient.subarray(0,u.n)),i.forEach((t,n)=>t.forEach(t=>{l.group[e.getBody(t).index]=n})),a.forEach(t=>{let n=t.links.map(t=>e.getSpring(t.id)).filter(Boolean);for(let e of n)u.groupA[e.index]=t.a,u.groupB[e.index]=t.b,u.bridges[e.index]=n.length});let d={group:`group`,when:c,before:`clear`};s.addSum(`groupCount`,{...d,formula:`1`}),s.addSum(`groupMass`,{...d,formula:`mass`}),s.addSum(`groupPos`,{...d,formula:`pos`}),s.addSum(`groupSpread`,{...d,formula:`d = pos - groupPos[group] / groupCount[group]; dot(d, d)`}),s.addLinkFormula(`bridgeStiffness`,{when:c,before:`clear`,params:{gap:o,minShare:Lb},formula:`
        wA = sqrt(groupSpread[groupA] / groupCount[groupA]);
        wB = sqrt(groupSpread[groupB] / groupCount[groupB]);
        R = max(gap * (wA + wB), 1.5 * springLength);
        f = R > springLength && springCoefficient > 0 ?
          abs(gravity) * groupMass[groupA] * groupMass[groupB] / (springCoefficient * bridges * R * R * (R - springLength)) : 1;
        coefficient = groupA >= 0 ? min(1, max(minShare, f)) * springCoefficient : ownCoefficient`});let f=new Map;return i.map((e,t)=>t).sort((e,t)=>i[t].length-i[e].length).forEach((e,t)=>{let n=Rb[t%Rb.length];i[e].forEach(e=>f.set(e,n))}),{nodeColor(e){return f.get(e)||0},dispose(){zb.concat(`bridgeStiffness`).forEach(e=>{s.getStage(e)&&s.removeStage(e)});for(let e=0;e<u.n;++e)u.groupA[e]>=0&&(u.coefficient[e]=u.ownCoefficient[e]);u.changed(`coefficient`),l.remove(`group`),[`groupA`,`groupB`,`bridges`,`ownCoefficient`].forEach(e=>u.remove(e))}}}};function Vb(e,t){let n=Number(e);return Number.isNaN(n)?t:n}var Hb=48,Ub=1024,Wb=13,Gb=4096/Wb,Kb=new Float64Array(4098);for(let e=0;e<Kb.length;e++)Kb[e]=Math.exp(-e/Gb);function qb(e){if(e>=Wb)return 0;let t=e*Gb,n=t|0;return Kb[n]+(Kb[n+1]-Kb[n])*(t-n)}function Jb(){let e=0,t,n,r,i,a,o=0,s=0,c,l,u,d,f,p,m,h,g,_=new Float32Array,v=0,y=0,b=1,x=1,S=0,C=0,w=1,T=new Int32Array(1024),E={interactions:0,skipped:0};return{computeForces:D,stats:E};function D(o,s){if(e=o.n,e===0)return;(!t||t.length<e)&&(t=new Float64Array(e),n=new Float64Array(e),r=new Float64Array(e),i=new Float64Array(e),a=new Int32Array(e));let u=o.pos,d=o.mass,_=o.force,v=o.pinned,y=1/0,b=1/0,x=-1/0,S=-1/0;for(let i=0;i<e;i++){let e=u[2*i],a=u[2*i+1];t[i]=e,n[i]=a,r[i]=d[i],e<y&&(y=e),e>x&&(x=e),a<b&&(b=a),a>S&&(S=a)}O(y,b,x,S,s.cell),A(y,b,Math.max(x-y,S-b));let C=s.gravity,w=s.theta,D=s.crossSection,j=1/s.minReach,M=0,N=0;for(let o=0;o<e;o++){if(v[o])continue;let e=t[o],s=n[o],u=i[o],d=0,y=0,b=0;for(T[b++]=0;b>0;){let _=T[--b],v=l[_];if(v>=0){do{if(v!==o){let a=t[v]-e,c=n[v]-s,l=a*a+c*c;l===0&&(a=Yb(o,v),c=Yb(v,o),l=a*a+c*c);let f=Math.sqrt(l),p=Math.min(j,D*(u+i[v])*.5),m=C*r[v]*qb(f*p)/(l*f);d+=m*a,y+=m*c,M++}v=a[v]}while(v>=0);continue}if(p[_]===0)continue;let x=m[_]-e,S=h[_]-s,E=x*x+S*S,O=Math.sqrt(E),A=f[_],P=k(e+x*.5,s+S*.5),F=Math.min(j,D*(u+4*P+g[_])/6),I=O-.71*A;if(I>0&&I*F>Wb)N++;else if(O>0&&A/O<w){let e=C*p[_]*qb(O*F)/(E*O);d+=e*x,y+=e*S,M++}else{if(b+4>T.length){let e=new Int32Array(T.length*2);e.set(T),T=e}let e=4*_;c[e]>=0&&(T[b++]=c[e]),c[e+1]>=0&&(T[b++]=c[e+1]),c[e+2]>=0&&(T[b++]=c[e+2]),c[e+3]>=0&&(T[b++]=c[e+3])}}_[2*o]+=r[o]*d,_[2*o+1]+=r[o]*y}E.interactions=M,E.skipped=N}function O(r,a,o,s,c){for(b=c>0?c:10;(o-r)/b>=Ub||(s-a)/b>=Ub;)b*=2;v=r,y=a,x=1/b,S=Math.floor((o-r)/b)+1,C=Math.floor((s-a)/b)+1,S*C<=Ub*Ub||(S=C=1),_.length<S*C?_=new Float32Array(S*C):_.fill(0,0,S*C),w=1/(b*b);for(let r=0;r<e;r++)_[((n[r]-y)*x|0)*S+((t[r]-v)*x|0)]+=1;for(let r=0;r<e;r++)i[r]=_[((n[r]-y)*x|0)*S+((t[r]-v)*x|0)]*w}function k(e,t){let n=(e-v)*x,r=(t-y)*x;return n<0||r<0||n>=S||r>=C?0:_[(r|0)*S+(n|0)]*w}function A(i,o,f){s=0,I(Math.max(16,2*e)),F(i,o,f*(1+1e-9)+1e-9);for(let t=0;t<e;t++)j(t);for(let e=s-1;e>=0;e--){let i=0,o=0,s=0,f=l[e];if(f>=0)do i+=r[f],o+=r[f]*t[f],s+=r[f]*n[f],f=a[f];while(f>=0);else for(let t=0;t<4;t++){let n=c[4*e+t];n>=0&&(i+=p[n],o+=p[n]*m[n],s+=p[n]*h[n])}p[e]=i,m[e]=i>0?o/i:u[e],h[e]=i>0?s/i:d[e],g[e]=k(m[e],h[e])}}function j(e){a[e]=-1;let r=0,i=0;if(l[0]===-1&&M(0))l[0]=e;else for(;;){let o=l[r];if(o>=0){if(i>=Hb){a[e]=a[o],a[o]=e;return}l[r]=-2;let s=N(r,t[o],n[o]),u=P(r,s);c[4*r+s]=u,l[u]=o}let s=N(r,t[e],n[e]),u=c[4*r+s];if(u<0){let t=P(r,s);c[4*r+s]=t,l[t]=e;return}r=u,i++}}function M(e){return c[4*e]<0&&c[4*e+1]<0&&c[4*e+2]<0&&c[4*e+3]<0}function N(e,t,n){let r=f[e]/2;return+(t>u[e]+r)+(n>d[e]+r?2:0)}function P(e,t){let n=f[e]/2;return F(u[e]+(t&1?n:0),d[e]+(t&2?n:0),n)}function F(e,t,n){s===o&&I(o*2);let r=s++;return u[r]=e,d[r]=t,f[r]=n,l[r]=-1,c[4*r]=c[4*r+1]=c[4*r+2]=c[4*r+3]=-1,r}function I(e){if(e<=o)return;let t=(e,t,n)=>{let r=new e(n);return t&&r.set(t.subarray(0,Math.min(t.length,n))),r};c=t(Int32Array,c,4*e),l=t(Int32Array,l,e),u=t(Float64Array,u,e),d=t(Float64Array,d,e),f=t(Float64Array,f,e),p=t(Float64Array,p,e),m=t(Float64Array,m,e),h=t(Float64Array,h,e),g=t(Float64Array,g,e),o=e}}function Yb(e,t){let n=Math.sin(e*12.9898+t*78.233)*43758.5453;return(n-Math.floor(n)-.5)/50}var Xb=s({default:()=>Qb}),Zb=(e,t)=>Number.isFinite(e)?e:t,Qb={id:`v1-4-dimming-crowds`,title:`Push dims through crowds`,author:`v1-4 (Feynman Vol. 1, ch. 31–32)`,description:`
<p>On graphs with hubs, ngraph draws each star as a small, dense disc on a long spoke, so most
of the picture is empty.</p>
<p>Here a push fades with how many nodes lie between the two nodes, the way sunlight dims in a
cloud (Feynman's Lectures, Vol. 1, ch. 31–32), but never over less than <i>Shortest reach</i>.
Crowds then pack close instead of pushing each other away with their full weight, while trees
and grids barely change.</p>
<p>Look for bigger stars that fill the picture: against <b>none</b>, the share of the frame
holding nodes goes from 0.13 to 0.24 on starOfStars, 0.11 to 0.30 on megaStars and 0.09 to
0.18 on erdos992, and grid20 stays the same.</p>
<p>What gets worse: 1.3 to 3 times as many links cross on hub graphs and on powerGrid, a high
<i>Cloudiness</i> folds trees, and the leaves of packed stars never settle but keep trembling
(a <i>Time step</i> of 0.25 calms them).</p>
<p>To stay fast it checks the crowd at 3 points along each line instead of the 5 its first
tests used, which gives a smaller effect on starOfStars. 2D only (3D runs the stock layout); it
ignores the <i>Repulsion</i> setting.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: erdos992`,`Benchmark: grid20`],params:[{key:`cloudiness`,label:`Cloudiness`,value:.05,step:`0.01`,help:`How much each node dims a push passing it. 0 or less turns the dimming off. Higher values also dim sparse parts: stars pack tighter, but trees and grids start to fold.`},{key:`minReach`,label:`Shortest reach`,value:3,step:`0.5`,help:`Even inside the densest crowd, a push fades no faster than over this distance, in link lengths. Smaller values pack crowds tighter; below about 2, stars can slide into each other. 0 or less removes this floor.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=Math.max(0,Zb(t.cloudiness,.05)),a=Math.max(0,Zb(t.minReach,3)),o=Jb(),s=r.replaceStage(`repulsion`,e=>{let t=r.settings,n=Math.max(0,t.springLength);o.computeForces(e,{gravity:t.gravity,theta:t.theta,crossSection:Math.min(i*n,Number.MAX_VALUE),minReach:a*n,cell:n})});return{dispose(){r.replaceStage(`repulsion`,s)}}}},$b=s({default:()=>ix}),ex=100,tx=400,nx=5,rx=1.4,ix={id:`v1-5-personal-space`,title:`Personal space within a piece`,author:`v1-5 (from Feynman, Lectures on Physics I, ch. 38)`,description:`
<p>In ngraph's pictures a hub with many leaves turns into a solid ball or a thin rim of dots,
because all its leaves crowd onto one ring around it.</p>
<p>This idea gives every node a little personal space: from step 400 on, two nodes of the same
connected piece that are closer than <i>Radius</i> spring lengths push each other apart, harder the
closer they are. It comes from Feynman's Lectures on Physics, Vol. 1, chapter 38: matter has a size
because its particles cannot all crowd into one spot.</p>
<p>That push alone makes crowded nodes shake, so <i>Calm crowded nodes</i> also gives them extra
inertia: they respond more slowly to every force. This extra does a large share of the work. The
calm on megaStars and most of its gain (stars fill more of the frame and sit closer together) come
from it, not from the push; set it to 0 to see the push alone.</p>
<p>What to look for, compared with <b>none</b>: on starOfStars, EVA and megaStars the rings of
leaves open into sunbursts, which is the push itself. grid20 ends up exactly the same.</p>
<p>What gets worse: crossings around hubs go up 1.1–1.9×, small trees such as binTree8 pick up
crossings, and steps take 1.1–1.4× as long. It works in any number of dimensions.</p>
`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: grid20`],params:[{key:`radius`,label:`Radius`,value:.8,step:`0.1`,help:`Personal space, in spring lengths: nodes of one piece that are closer push apart. Larger fills the stars more, but spreads leaves into neighbouring fans and adds crossings. 0 turns it off. At most 5: larger values count as 5, because each step gets much slower.`},{key:`strength`,label:`Strength`,value:2,step:`0.5`,help:`Push at half the radius, in units of a spring stretched by one spring length. Larger opens dense rings more, but crowded parts settle more slowly. 0 turns it off.`},{key:`delay`,label:`Start after`,value:400,step:`100`,help:`Steps to wait before the push starts (it then fades in over 100 steps). 0 starts it at once, which about doubles the gain on starOfStars (the share of the frame the drawing covers), but can freeze knots into grids and trees that are still unfolding (try grid20).`},{key:`calm`,label:`Calm crowded nodes`,value:1,step:`1`,help:`1: while the push runs, crowded nodes get extra inertia (and matching drag), so they respond more slowly to every force and do not shake. It also calms graphs that tremble with none, such as megaStars, and does most of the work there. 0: the push alone; dense stars then shake.`}],attach({layout:e,graph:t,params:n,steps:r}){let i=e.simulator,a=r||0;i.store.define(`piece`,Int32Array),i.store.define(`pushStiffness`,Float64Array);function o(e){let t=Number(n.delay),r=Number.isNaN(t)?tx:Math.max(0,t),i=Math.min(1,(e.iteration()+1+a-r)/ex),o=e.settings,s=Math.min(nx,Number(n.radius))*o.springLength,c=i*Number(n.strength)*o.springCoefficient*o.springLength,l=c*s*s*s/14,u=6*l/(s/2)**4;return{active:i>0&&s>0&&c>0&&l>0&&Number.isFinite(l)&&Number.isFinite(u),radius:s,strength:c,C:l,slope:u}}i.on(`topology`,l),i.addPairFormula(`personalSpace`,{startAtZero:[`pushStiffness`],radius:e=>{let t=o(e);return t.active?t.radius:0},params:{half:e=>o(e).radius/2,inv3:e=>{let t=o(e).radius;return 1/(t*t*t)},strength:e=>o(e).strength,C:e=>o(e).C,slope:e=>o(e).slope},formula:`
        r3 = r * r * r;
        f = r >= half ? 2 * C * (1 / r3 - inv3) : strength + slope * (half - r);
        k = r >= half ? 6 * C / (r3 * r) : slope;
        pushStiffness_i += piece_i == piece_j ? 2 * k : 0;
        pushStiffness_j += piece_i == piece_j ? 2 * k : 0;
        push = piece_i == piece_j ? f : 0`});let s=Number(n.calm),c=Number.isNaN(s)||s>0;return c&&(i.store.define(`calmInertia`,Float64Array),i.addNodeFormula(`calmCrowdedBodies`,{params:{active:e=>+!!o(e).active,springStiffness:e=>2*e.settings.springCoefficient,useDrag:e=>e.settings.integrator===`fire`?0:1,swing2:rx*rx},formula:`
          k = pushStiffness + springStiffness * degree;
          inertia = k * dt * dt / swing2;
          calm = active > 0 && pushStiffness > 0 && inertia > mass ? 1 : 0;
          extra = dragCoefficient * (inertia / mass - 1);
          force = calm > 0 && useDrag > 0 ? force - extra * velocity : force;
          calmInertia = calm > 0 ? inertia : mass`}),i.inertia(`calmInertia`)),{dispose(){i.off(`topology`,l),c&&i.inertia(`mass`),[`personalSpace`,`calmCrowdedBodies`].forEach(e=>{i.getStage(e)&&i.removeStage(e)}),[`piece`,`pushStiffness`,`calmInertia`].forEach(e=>i.store.remove(e))}};function l(){let e=new Map,n=0;t.forEachNode(r=>{if(e.has(r.id))return;let i=[r.id];for(e.set(r.id,n);i.length;)t.forEachLinkedNode(i.pop(),t=>{e.has(t.id)||(e.set(t.id,n),i.push(t.id))});n+=1});let{bodies:r,store:a}=i;for(let t=0;t<r.length;++t){let n=e.get(r[t].id);a.piece[t]=n===void 0?-1-t:n}}}},ax=s({default:()=>ox}),ox={id:`v1-6-gas-pressure`,title:`Gas pressure where crowded`,author:`v1-6 (Feynman Vol 1, Ch. 40)`,description:`
<p>In ngraph's pictures of hubs with many leaves (<i>starOfStars</i>, <i>megaStars</i>), each
star is a ring of leaves with an empty middle, and the stars sit small and far apart.</p>
<p>This idea, from Feynman's Lectures on Physics, Vol. 1, Ch. 40, treats the nodes as a gas: where
they are packed denser than about one node per spring-length square, they push from the crowded
spot towards emptier space, and the "temperature" sets how hard. Crowding is measured on a hidden
square grid with one spring length per cell, and the push fades in between one and two times that
density; the round-2 lab version compared nearby pairs instead, but it shook.</p>
<p>Look for the stars' middles filling in and the stars growing: on <i>starOfStars</i> the drawing
covers about 2.4 times as much of the frame (1.6 times on <i>megaStars</i>), and <i>grid20</i> ends
up the same as with <b>none</b>.</p>
<p>What gets worse: about twice as many edge crossings on <i>starOfStars</i> and nearly four times
as many on <i>paTree3k</i>, and if you zoom into a filled star, its leaves line up in rows and
columns along that hidden grid. A temperature above about 10 makes crowded parts shake, so the fire
integrator, which has no drag, gets half the temperature. With weaker repulsion (gravity -2) or
longer springs (30), ordinary spacing already counts as crowded and grids change too; it works in
2D only and does nothing in 3D.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: paTree3k`,`Benchmark: grid20`],params:[{key:`temperature`,label:`Temperature`,value:8,step:`1`,help:`How hard crowded nodes push outward. Higher gives fuller, bigger stars but more crossings. Above about 10 the crowded parts start to shake (the fire integrator has no drag, so this prototype halves the value for it). 0 turns the push off.`},{key:`spacing`,label:`Crowding spacing`,value:1,step:`0.1`,help:`Nodes push only where they are, on average, closer than this many spring lengths. Larger values reach more of the graph (trees, sparse parts); smaller values touch only the most crowded spots. 0 turns the push off.`}],attach({layout:e,params:t,settings:n}){if((n.dimensions||2)!==2)return null;let r=e.simulator,i=Math.max(0,t.temperature),a=Math.max(0,t.spacing),o=e=>1*e.settings.springLength,s=zy(r,`v1-6-gas-density`,{anchor:`lattice`,cell:`h`,deposit:{weights:`quadratic`},self:`exclude`,params:{h:o},into:{value:`gasDensity`,gradient:`gasSlope`}});return r.addNodeFormula(`v1-6-gas-pressure`,{after:`v1-6-gas-density`,params:{h:o,kT:e=>(e.settings.integrator===`fire`?.5:1)*i*e.settings.springCoefficient*e.settings.springLength*e.settings.springLength,rho0:e=>(o(e)/(a*e.settings.springLength))**2},formula:`
        // density of the other bodies, in bodies per cell (0.05 keeps the push finite where it is 0),
        // and the push down its slope
        rho = gasDensity * h * h;
        ramp = select(rho >= 2 * rho0, 1, (rho - rho0) / rho0);
        push = -kT * ramp / ((rho + 0.05) * h) * (gasSlope * (h * h * h));
        // a huge temperature or spring constant can overflow: never add Infinity or NaN. Checked per
        // axis, as length() would overflow 32-bit floats long before 1e30
        force += select(rho > rho0 && pinned == 0 && abs(dot(push, axis(0))) < 1e30 && abs(dot(push, axis(1))) < 1e30,
          push, 0 * pos)`}),{dispose(){r.removeStage(`v1-6-gas-pressure`),s.dispose()}}}},sx=8,cx=2,lx=100,ux=1.3,dx=`v1-7-contact-and-wall`;function fx(e,t){let n=e.settings,r=n.dimensions,i=e.random,a=Math.min(lx,Math.max(0,Number(t.contact)||0)),o=!!Number(t.farPush),s=Number(t.wallSlack),c=Number.isNaN(s)?ux:s===0?0:Math.max(1,s),l=!1,u=new Int32Array,d=new Int32Array,f=new Int32Array(1),p=0,m=0,h=[],g,_,v,y,b,x=new Float64Array(r),S=new Float64Array(r),C=new Float64Array(r),w=()=>{l=!1};e.on(`topology`,w);let T=o?null:e.replaceStage(`repulsion`,D);return e.addStage(dx,A),{dispose(){e.off(`topology`,w),e.removeStage(dx),T&&e.replaceStage(`repulsion`,T)}};function E({n:t}){if(l)return;l=!0;let n=new Int32Array(t);for(let e=0;e<t;e++)n[e]=e;let i=e=>{for(;n[e]!==e;)n[e]=n[n[e]],e=n[e];return e},{from:a,to:o}=e.springStore;for(let t=0;t<e.springStore.n;t++){let e=i(a[t]),r=i(o[t]);e!==r&&(n[e]=r)}let s=new Map;u=new Int32Array(t);let c=[];for(let e=0;e<t;e++){let t=i(e),n=s.get(t);n===void 0&&(n=c.length,s.set(t,n),c.push(0)),u[e]=n,c[n]+=1}p=c.length,f=new Int32Array(p+1),m=0;for(let e=0;e<p;e++)f[e+1]=f[e]+c[e],c[e]>c[m]&&(m=e);d=new Int32Array(t);let x=f.slice(0,p);for(let e=0;e<t;e++)d[x[u[e]]++]=e;h=Array(p),g=new Float64Array(p),_=new Float64Array(p*r),v=new Float64Array(p),y=new Float64Array(p*r),b=new Uint8Array(p)}function D(e){E(e);let t=e[n.repulsionCharge];for(let n=0;n<p;n++)f[n+1]-f[n]<=sx?k(e,t,n):O(e,t,n)}function O({pos:t,force:i,pinned:a},o,s){let c=f[s],l=f[s+1]-c,u=h[s];if(!u){u=h[s]=ru.simulator({...n,repulsionCharge:`mass`});for(let t=0;t<l;t++)u.addBodyAt(e.bodies[d[c+t]].pos)}u.settings.gravity=n.gravity,u.settings.theta=n.theta,u.settings.nbody=n.nbody;let p=u.store;for(let e=0;e<l;e++){let n=d[c+e];for(let i=0;i<r;i++)p.pos[e*r+i]=t[n*r+i];p.mass[e]=o[n],p.pinned[e]=a[n]}p.force.fill(0,0,l*r),u.getStage(`repulsion`)(p,u);for(let e=0;e<l;e++){let t=d[c+e];if(!a[t])for(let n=0;n<r;n++)i[t*r+n]+=p.force[e*r+n]}}function k({pos:e,force:t,pinned:a},o,s){let c=n.gravity;for(let n=f[s];n<f[s+1];n++){let l=d[n];for(let u=n+1;u<f[s+1];u++){let n=d[u],s=0;for(let t=0;t<r;t++)x[t]=e[n*r+t]-e[l*r+t],s+=x[t]*x[t];if(s===0)for(let e=0;e<r;e++)x[e]=(i.nextDouble()-.5)/50,s+=x[e]*x[e];let f=c*o[l]*o[n]/(s*Math.sqrt(s));if(!a[l])for(let e=0;e<r;e++)t[l*r+e]+=f*x[e];if(!a[n])for(let e=0;e<r;e++)t[n*r+e]-=f*x[e]}}}function A(e){if(E(e),p<2)return;let{n:t,pos:n,force:i,pinned:s}=e;g.fill(0),_.fill(0),v.fill(0),y.fill(0),b.fill(0),S.fill(0);let l=0;for(let i=0;i<t;i++){let t=u[i],a=e.mass[i];g[t]+=a,l+=a;for(let e=0;e<r;e++)_[t*r+e]+=a*n[i*r+e],S[e]+=a*n[i*r+e];s[i]&&(b[t]=1)}if(l>0){for(let e=0;e<r;e++)S[e]/=l;!o&&a>0&&M(e),c>0&&P(e,l);for(let n=0;n<t;n++){let t=u[n];if(s[n]||b[t])continue;let a=e.mass[n]/g[t];for(let e=0;e<r;e++)i[n*r+e]+=a*y[t*r+e]}}}function j({pos:t}){let{n:i,from:a,to:o}=e.springStore,s=0;for(let e=0;e<i;e++){let n=0;for(let i=0;i<r;i++){let s=t[o[e]*r+i]-t[a[e]*r+i];n+=s*s}s+=Math.sqrt(n)}return i?s/i:n.springLength}function M(t){let i=a*j(t);if(!(i>0))return;let o=cx*n.springCoefficient,s=t.pos,c=e.neighbors(i);if(f[m+1]-f[m]<t.n/4){c.forEachPair(i,(e,t,n)=>{let a=u[e],c=u[t];if(a===c)return;if(n===0){N(a,c,i,o);return}let l=o*(i-n)/n;for(let n=0;n<r;n++){let i=s[e*r+n]-s[t*r+n];y[a*r+n]+=l*i,y[c*r+n]-=l*i}});return}let l=0,d=(e,t)=>{let n=u[l],a=u[e];if(a===n||e<=l&&a!==m)return;if(t===0){N(n,a,i,o);return}let c=o*(i-t)/t;for(let t=0;t<r;t++){let i=s[l*r+t]-s[e*r+t];y[n*r+t]+=c*i,y[a*r+t]-=c*i}};for(l=0;l<t.n;l++)u[l]!==m&&c.forEachNeighbor(l,i,d)}function N(e,t,n,a){let o=0;for(let e=0;e<r;e++)x[e]=(i.nextDouble()-.5)/50,o+=x[e]*x[e];let s=Math.sqrt(o),c=a*(n-s)/s;for(let n=0;n<r;n++)y[e*r+n]+=c*x[n],y[t*r+n]-=c*x[n]}function P(e,t){let{n:i,pos:a}=e,o=n.springLength,s=Math.abs(n.gravity)*(t/i)/(o*o);if((!(o>0)||!Number.isFinite(s))&&(o=j(e),s=Math.abs(n.gravity)*(t/i)/(o*o),!(o>0)||!Number.isFinite(s)))return;for(let t=0;t<i;t++){let n=u[t],i=0;for(let e=0;e<r;e++){let o=a[t*r+e]-_[n*r+e]/g[n];i+=o*o}v[n]+=e.mass[t]*i}let l=0;for(let e=0;e<p;e++){v[e]=Math.sqrt((r+2)/r*v[e]/g[e]);let t=1;for(let n=0;n<r;n++)t*=v[e]+o/2;l+=t}let d=c*l**(1/r);C.fill(0);for(let e=0;e<p;e++){let t=0;for(let n=0;n<r;n++){let i=S[n]-_[e*r+n]/g[e];t+=i*i}t=Math.sqrt(t);let n=t+v[e]-d;if(n<=0||t===0||b[e])continue;let i=g[e]*s*Math.min(1,n/o)/t;for(let t=0;t<r;t++){let n=i*(S[t]-_[e*r+t]/g[e]);y[e*r+t]+=n,C[t]+=n}}for(let e=0;e<p;e++)for(let n=0;n<r;n++)y[e*r+n]-=g[e]*C[n]/t}}var px=s({default:()=>mx}),mx={id:`v1-7-contact-push`,title:`Pieces push only on contact`,author:`v1-7 (Feynman Lectures, vol. I, ch. 47)`,description:`
<p>When a graph has one big piece and many small ones (yeast, sciMet, erdos992), ngraph shrinks the
big piece to a dark ball and leaves the small ones on a far ring, so most of the picture is empty.</p>
<p>Here each piece pushes only its own nodes, and two pieces push each other only when they touch,
like stones in a bag. A wall around all pieces (the v4 wall, made so it can't shift the whole
picture) keeps the bag closed; <b>Wall size</b> 0 turns it off, and the touching push alone still
does most of the work.</p>
<p>The idea comes from the chapter on sound in Feynman's Lectures (vol. I, ch. 47): in a gas the push
comes only from right next door, so at rest a gas fills its container evenly, with no empty gaps.</p>
<p>On yeast the big piece grows from a tenth of the picture's area to three quarters, with the small
pieces close around it; <b>Push from afar</b> 1 keeps the wall but brings back the old push, and the
ring returns (stock <b>none</b> has no wall, so there the pieces keep drifting away).</p>
<p>What gets worse: pieces that start on top of each other stay crossed, because touching pieces only
slide apart (caterpillars gets several times more crossings between pieces; the fire integrator
with a pivot start helps), and on graphs of many small pieces the first second runs 2–3× slower,
then faster than stock. The same works in 3D, with a ball for the wall.</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: erdos992`,`Benchmark: sciMet`,`Benchmark: sbm8x50`],params:[{key:`contact`,label:`Contact distance`,value:1,step:`0.1`,help:`How close two pieces may come, in average edge lengths. Larger leaves more room between pieces and fewer crossings; smaller packs them tighter. 0 turns contact off; values above 100 count as 100. Large values are slow on graphs of many small pieces (forest5k: about 90 ms per step at 10).`},{key:`farPush`,label:`Push from afar`,value:0,step:`1`,help:`0: pieces push each other only on contact (this idea). 1: every node pushes every node, as in stock ngraph, with the same wall. Compare the two to see what contact alone changes.`},{key:`wallSlack`,label:`Wall size`,value:1.3,step:`0.1`,help:`Size of the wall around all pieces, relative to their total area (1.3 is the v4 setting). Larger gives the pieces more room; with contact only, they then sit looser around the big piece. 0 turns the wall off; other values below 1 count as 1.`}],attach({layout:e,params:t}){return fx(e.simulator,t)}},hx=s({default:()=>gx}),gx={id:`v2-1-fading-push`,title:`Push fades slowly with distance`,author:`v2-1 (Feynman Vol. II reader)`,description:`
<p><b>Problem.</b> On graphs with big hubs, ngraph draws each group as a small dense blob with
wide empty space between groups: every group pushes the others like one big charge, the sum of
all its nodes, so zoom to fit shrinks the groups to dots.</p>
<p><b>Change.</b> A node's push now fades with distance: it is about 10% weaker at one spring
length, and 2.7 times weaker for every <i>Fade distance</i> (10 spring lengths), so far-apart
groups stop pushing each other and their few links pull them together.</p>
<p><b>Source.</b> Feynman, Vol. II, chapter 7-4: in salt water, a cloud of opposite charges
gathers around each charged particle and cancels its push beyond a short distance (Debye
screening).</p>
<p><b>Look for:</b> starOfStars and megaStars cover about twice as much of the frame, with
readable spokes; on EVA the main piece grows and its hubs become spoked suns; er1000, one random
tangle, should look the same.</p>
<p><b>Gets worse:</b> big open loops fill in (powerGrid: crossings almost double), separate
pieces touch (caterpillars), trees lose white space between branches, and grids can stay folded
(grid20 keeps a folded corner, and from other starts often a big fold).</p>
<p><b>Cost:</b> about 1.5 times the time per step with the quad tree and 2.6 times with the
dual tree (the fade costs one exp() per pair); both trees and any number of dimensions work.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: er1000`],params:[{key:`fade`,label:`Fade distance`,value:10,step:`1`,help:`In spring lengths: how far a push reaches before it fades away (it drops 2.7x per this distance). 3: stars and pieces pack tight, trees and loops lose their open space. 30: closer to the library, but grids can still stay folded. Below about 1 the push is nearly gone and nodes crowd together. 0 turns the fade off, and so does a spring length of 0.`}],attach({layout:e,params:t}){let n=Number(t.fade);if(!(n>0))return null;let r=e.simulator,i=r.repulsionLaw().spec;return r.repulsionLaw({force:`exp(-r / L) / r^2`,params:{L:e=>{let t=n*e.springLength();return t>0?Math.max(t,1e-300):1/0}}}),{dispose(){r.repulsionLaw(i)}}}},_x=s({default:()=>yx}),vx=1e100,yx={id:`v2-2-balancing-pull`,title:`Balancing pull for graphs in pieces`,author:`v2-2 (Feynman Vol. 2 reader)`,description:`
<p><b>Problem.</b> When a graph comes in several pieces, nothing holds them together: they drift
far off, and zoom-to-fit shrinks the main piece to a small ball (on yeast it gets 10% of the
picture).</p>
<p><b>Change.</b> Every node gets a pull toward the middle that grows with distance, sized for all
the nodes spread evenly at one per spring length², like the even background of opposite charge
that holds a plasma together (Feynman Lectures, Vol. 2, ch. 8–12). For that balance to work, the
push between nodes fades as 1/distance far away instead of today's 1/distance²; it is already
1.4× today's at one spring length and stronger farther out, so on dense graphs the main piece
also spreads out wider (yeast: 1.7× as wide).</p>
<p><b>Look for.</b> Compared with <b>none</b>, the main piece fills most of the picture (yeast 10% →
90%, CSphd 23% → 71%), and the small pieces sit 3–6 spring lengths from it instead of 20–55.
Graphs in one piece are left alone, so grid20 doesn't change.</p>
<p><b>Worse.</b> Small pieces get pressed against the main one and lose some of their shape, and
graphs made mostly of tiny pieces (protein) get crowded and overlap. A step costs about the same
as stock, with either Repulsion setting. It does nothing in 3D.</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: sciMet`,`Benchmark: CSphd`,`Benchmark: grid20`],params:[{key:`strength`,label:`Pull strength`,value:1,step:`0.1`,help:`1 = the pull balances the push of all nodes spread evenly at one per spring length², so pieces settle at the edge of that disc, a few spring lengths outside the main piece. 0 turns the pull off (pieces drift away, as in none). Above 1 the small pieces get pressed closer and start to overlap the main one.`},{key:`reach`,label:`Long push scale`,value:2,step:`0.5`,help:`In spring lengths. The push is today's 1/distance² at short range and fades only as 1/distance at long range, like in a flat world; the two parts are equal at half this value. At the default 2 the push is 1.4× today's at one spring length and 2.2× at two. The pull stays the same. Smaller: the main piece opens up more. 0 gives exactly today's push, and large values (e.g. 100) nearly so; then the pull drags small pieces inside the main one (try CSphd).`},{key:`always`,label:`Also on one-piece graphs`,value:0,step:`1`,help:`1 = use it even when the graph is in one piece (try grid20): the pull squeezes the shape into a disc. That is why it is off there by default.`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2||xx(t)<2&&!(Number(n.always)>0))return{};let i=e.simulator,a=Number.isFinite(Number(n.strength))?Math.max(0,Number(n.strength)):0,o=Math.max(0,Number(n.reach)||0),s=i.repulsionLaw().spec;o>0&&i.repulsionLaw({force:`sqrt(1 + K * r * r) / r^2`,params:{K(e){let t=o*e.settings.springLength;return t>0?Math.min(4/(t*t),vx):0}}});let c=a>0?bx(i,a):[];return{dispose(){i.repulsionLaw(s),c.forEach(e=>{i.getStage(e)&&i.removeStage(e)})}}}};function bx(e,t){return e.addSum(`balancingCharge`,{formula:`mass`}),e.addSum(`balancingMoment`,{formula:`mass * pos`}),e.addNodeFormula(`v2-2-balancing-pull`,{params:{strength:t},formula:`
      center = balancingMoment / balancingCharge;
      d = pos - center;
      // the pull balances the push of n bodies spread evenly over a disc, one per springLength^2
      flatG = abs(gravity) / springLength;
      radius2 = n * springLength * springLength / pi;
      kappa = strength * flatG * balancingCharge / radius2;
      // Spring length 0 (the panel passes through it while you type "0.5") and other extreme
      // settings make kappa 0, negative, infinite or NaN: then there is no pull, rather than NaN
      // positions. A body whose pull would be huge (only at absurd strengths) is left alone; 1e30
      // is a limit that 32-bit floats (a GPU) hold too.
      force -= select(n >= 2 && kappa > 0 && kappa < 1e30 && pinned == 0 && kappa * mass * length(d) < 1e30,
        kappa * mass * d, 0 * pos)`}),[`balancingCharge`,`balancingMoment`,`v2-2-balancing-pull`]}function xx(e){let t=new Set,n=0;return e.forEachNode(r=>{if(t.has(r.id))return;n+=1;let i=[r.id];for(t.add(r.id);i.length;){let n=i.pop();e.forEachLinkedNode(n,e=>{t.has(e.id)||(t.add(e.id),i.push(e.id))})}}),n}var Sx=s({default:()=>Cx}),Cx={id:`v2-3-flat-world`,title:`Flat-world push plus balancing pull`,author:`v2-3 (Feynman Vol. II reader)`,description:`
<p><b>Problem.</b> On graphs with one big piece and many small ones (yeast, sciMet, CSphd), the
big piece shrinks to a dense ball in the middle and the small pieces sit far out on a ring, so
most of the picture is empty.</p>
<p><b>Change.</b> Nodes push each other apart with a force that weakens as 1/distance, the way
charges push in a flat world, instead of 1/distance², and an even pull toward the middle (as if
the nodes stood on a disc of opposite charge) cancels that push wherever the nodes are spread as
evenly as the disc. In D dimensions the push weakens as 1/distance^(D-1) and the disc is a ball,
so in 3D the push is the library's own.</p>
<p><b>Where it comes from.</b> Feynman's Lectures, Vol. II, Ch. 18 and 20: Gauss's law, and how
the push of a charge follows from the dimension of space.</p>
<p><b>What to look for.</b> Compare with <b>none</b> after about 1500 steps: the big piece's share
of the picture goes from 0.10 to 0.73 on yeast, 0.06 to 0.49 on sciMet and 0.23 to 0.60 on
CSphd, and the eight communities of sbm8x50 separate.</p>
<p><b>What gets worse.</b> Grids bow outward into a pillow shape, isolated nodes pile up in a band
at the rim (protein), and star fans are not helped. Spacing is tuned for spring length 10 and
gravity -12: with longer springs or weaker gravity the effect fades unless you lower it (see its
help).</p>`,tryGraphs:[`Benchmark: yeast`,`Benchmark: CSphd`,`Benchmark: sciMet`,`Benchmark: sbm8x50`,`Benchmark: starOfStars`],params:[{key:`spacing`,label:`Spacing`,value:1.5,step:`0.1`,help:`Room per node in the balancing disc, in spring lengths. Smaller: tighter, more even fill, but grids bend into a disc (1.0). Larger: flatter grids, but pieces drift further out (2.0+). The default 1.5 is tuned for spring length 10 and gravity -12; for longer springs or weaker gravity, lower it (spring length 30: about 0.5; gravity -2: about 0.6). Values below 0.1 count as 0.1.`},{key:`balance`,label:`Balance`,value:1,step:`0.1`,help:`How much of the total push the pull cancels: 1 = all of it (neutral layout), 0 = no pull at all, the flat-world push alone (stars collapse, pieces fly far away). Negative values count as 0, values above 100 as 100.`},{key:`falloff`,label:`Falloff`,value:1,step:`1`,help:`1 = flat-world push (1/distance), the idea. 2 = the library's push (1/distance²) with the same pull: plain centre gravity, where grids fold, to show why the two halves must match. Any other value counts as 1.`}],attach({layout:e,params:t}){let n=e.simulator,r=Math.max(.1,Tx(t.spacing,1.5)),i=Math.min(100,Math.max(0,Tx(t.balance,1))),a=Tx(t.falloff,1)===2?2:1,o=n.repulsionLaw().spec;a===1&&n.repulsionLaw({force:`r^(1 - D) * L^(D - 3)`,params:{L:e=>e.unit()}});let s=[`flatWorldCharge`,`flatWorldMoment`,`v2-3-pull`],c=()=>{n.repulsionLaw(o),s.forEach(e=>{n.getStage(e)&&n.removeStage(e)})};if(i===0)return{dispose:c};let l=n.repulsionCharge();return n.addSum(`flatWorldCharge`,{formula:l}),n.addSum(`flatWorldMoment`,{formula:`${l} * pos`}),n.addNodeFormula(`v2-3-pull`,{params:{spacing:r,balance:i,falloff:a,ballVolume:wx(n.settings.dimensions)},formula:`
        Q = flatWorldCharge;
        d = pos - flatWorldMoment / Q;
        // The ball holds the n nodes at one node per cube of side spacing * L
        R = spacing * unit * pow(n / ballVolume, 1 / D);
        RD = pow(R, D);
        // Same strength as the push between two nodes: |G| L^(D-3), or |G| with the stock push
        strength = -gravity * (falloff == 1 ? pow(unit, D - 3) : 1 / unit);
        scale = strength * balance * Q;
        rD = pow(dot(d, d), D / 2);
        f = -scale * ${l} / (rD > RD ? rD : RD);
        force += select(Q > 0 && pinned == 0, f * d, 0 * pos)`}),{dispose:c}}};function wx(e){return e===0?1:e===1?2:wx(e-2)*2*Math.PI/e}function Tx(e,t){let n=Number(e);return e===void 0||e===``||!Number.isFinite(n)?t:n}var Ex=1024,Dx=9,Ox=Ex/Dx;function kx(e){let t=Mx(),n=t=>{let n=t.springLength();return e>0&&n>0?1/(e*n):0};return{force:`(springLength > 0 ? c * T(mu * r) : 1 / r) / r`,tables:{T:{from:0,to:Dx,values:t}},params:{mu:n,c:e=>{let r=e.springLength();return r>0?1/(r*Ax(t,n(e)*r)):0}}}}function Ax(e,t){if(t>=Dx)return 0;let n=t*Ox,r=n|0;return e[r]+(e[r+1]-e[r])*(n-r)}var jx=null;function Mx(){if(jx)return jx;jx=new Float64Array(1025);for(let e=0;e<jx.length;e++){let t=e/Ex*Dx;jx[e]=t===0?1:t>=Dx?0:t*Px(t)}return jx}function Nx(e){let t=e/3.75,n=t*t;return e*(.5+n*(.87890594+n*(.51498869+n*(.15084934+n*(.02658733+n*(.00301532+n*32411e-8))))))}function Px(e){if(e<=2){let t=e*e/4;return Math.log(e/2)*Nx(e)+1/e*(1+t*(.15443144+t*(-.67278579+t*(-.18156897+t*(-.01919402+t*(-.00110404+t*-4686e-8))))))}let t=2/e;return Math.exp(-e)/Math.sqrt(e)*(1.25331414+t*(.23498619+t*(-.0365562+t*(.01504268+t*(-.00780353+t*(.00325614+t*-68245e-8))))))}var Fx=s({default:()=>Rx}),Ix=4,Lx=.25,Rx={id:`v2-4-limited-reach`,title:`Push with a limited reach`,author:`v2-4 (Feynman Vol. II, ch. 23-29)`,description:`
<p><b>Problem.</b> Today's push never stops, however far apart two nodes are, so heavy hubs and
whole pieces shove each other across the screen, and zoom-to-fit shows small dense stars or a
tiny core in a lot of empty space.</p>
<p><b>Change.</b> Here the push has a <i>reach</i>, from Yukawa's equation for a force with a
limited range (Feynman's Lectures, Vol. II, ch. 28-6), solved for a flat picture (ch. 23). At the
default reach of 4 it is weaker than today closer than one spring length, up to 2.6 times
stronger from 2 to 12 spring lengths, and nearly gone beyond 30.</p>
<p><b>Look for.</b> On megaStars the stars become bursts that use about twice as much of the
screen as with <i>none</i>; binTree8 looks about the same. On sciMet, with <i>none</i> the pieces
keep flying outward and the core shrinks to a dot; with the reach the core keeps about 9 times
more of the screen after 6000 steps.</p>
<p><b>Gets worse.</b> Community groups and EVA's tiny pieces get denser, a reach of 2 or less
folds trees, and reach 0 ("no limit") blows hub graphs apart, with a reach above about 16 moving
toward it. It works in 2-D only (nothing happens in 3-D) and turns itself off at spring length
0. A step costs about 1.1 times as much with the quad tree and 1.3 times with the dual tree.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: sciMet`,`Benchmark: yeast`,`Benchmark: binTree8`],params:[{key:`reach`,label:`Reach (spring lengths)`,value:Ix,step:`0.5`,help:`Where the push starts to fade, in spring lengths. Smaller: bigger stars and tighter pieces, but at 2 or less trees fold. Larger, up to about 16: a weaker effect, closer to the library; above that it moves toward 0. 0 (or less) means no limit, which blows hub graphs apart. Values between 0 and 0.25 act as 0.25. At one spring length two nodes push exactly as hard as in the library.`}],attach({layout:e,params:t}){let n=e.simulator;if(n.settings.dimensions!==2)return null;let r=Number(t.reach),i=Number.isNaN(r)?Ix:r>0?Math.max(r,Lx):0,a=n.repulsionLaw().spec;return n.repulsionLaw(kx(i)),{dispose(){n.repulsionLaw(a)}}}};function zx(e,t,n={}){let r=Number.isFinite(n.temperature)?Math.max(0,n.temperature):.3,i=0;for(let n=0;n<e;++n)i+=t[n].length;let a=Math.min(300,Math.max(60,Math.floor(2e8/Math.max(1,4*i)))),o=8,s=()=>(o=o*1664525+1013904223>>>0,o/4294967296),c=new Float64Array(e*4),l=new Float64Array(e*4);for(let e=0;e<c.length;++e)c[e]=.01*(s()-.5);let u=new Float64Array(4),d=new Float64Array(4);for(let n=0;n<a;++n){u.fill(0);for(let t=0;t<e;++t)for(let e=0;e<4;++e)u[e]+=c[t*4+e];for(let t=0;t<4;++t)u[t]/=e;for(let n=0;n<e;++n){let e=t[n],i=e.length;d.fill(0);for(let t=0;t<i;++t){let n=e[t]*4;for(let e=0;e<4;++e)d[e]+=c[n+e]}let a=0;for(let e=0;e<4;++e)d[e]=(i?d[e]/i:0)-1*u[e],a+=d[e]*d[e];a=Math.sqrt(a);let o=a>0?Math.tanh(a/r)/a:0;for(let e=0;e<4;++e)l[n*4+e]=.5*c[n*4+e]+.5*d[e]*o}let n=c;c=l,l=n}return{spins:c,rounds:a}}function Bx(e,t,n){let r=new Int32Array(e),i=0;for(let t=0;t<e;++t){let a=0;for(let e=0;e<4;++e)a+=n[t*4+e]*n[t*4+e];i+=Math.sqrt(a)/e;let o=0,s=-1;for(let e=0;e<4;++e){let r=Math.abs(n[t*4+e]);r>s&&(s=r,o=2*e+(n[t*4+e]>0?0:1))}r[t]=o}let a=0,o=0,s=0,c=new Float64Array(8),l=new Float64Array(8);for(let i=0;i<e;++i){let e=t[i];c[r[i]]+=e.length;for(let t=0;t<e.length;++t){let c=e[t];if(c<=i)continue;a+=1;let u=0;for(let e=0;e<4;++e)u+=n[i*4+e]*n[c*4+e];u<.5&&(o+=1),r[i]===r[c]&&(s+=1,l[r[i]]+=1)}}let u=0;if(a>0)for(let e=0;e<8;++e)u+=l[e]/a-(c[e]/(2*a))**2;return{wallShare:a?o/a:0,modularity:u,links:a,magnitude:i}}function Vx(e,t){let n=new Float64Array(e);for(let r=0;r<e;++r){let e=0;for(let n=0;n<4;++n)e+=t[r*4+n]*t[r*4+n];n[r]=Math.sqrt(e)||1e-12}let r=(e,r)=>{let i=0;for(let n=0;n<4;++n)i+=t[e*4+n]*t[r*4+n];return i/(n[e]*n[r])},i=Array.from({length:e},(e,t)=>t).sort((e,t)=>n[t]-n[e]||e-t),a=[],o=[],s=new Int32Array(e);for(let e of i){let t=-1,n=-1,i=-2;for(let o=0;o<a.length&&t<0;++o){let s=r(e,a[o]);s>.9?t=o:s>i&&(i=s,n=o)}t<0&&a.length<64&&(t=a.length,a.push(e),o.push(0)),t<0&&(t=n),s[e]=t,o[t]+=1}let c=a.map((e,t)=>t).filter(t=>o[t]>=.02*e);for(let t=0;t<e;++t){if(o[s[t]]>=.02*e||!c.length)continue;let n=c[0],i=-2;for(let e of c){let o=r(t,a[e]);o>i&&(i=o,n=e)}s[t]=n}return s}function Hx(e,t,n,r){let i=e.simulator,a=i.store,o=i.repulsionCharge(),s=e=>`domainSpin`+e,c=e=>`domainSense`+e,l=e=>`domainCharge`+e,u=[];for(let e=0;e<4;++e)u.push(s(e),l(e),c(e));u.push(`domainSense`),u.forEach(e=>a.define(e)),n.forEach((e,n)=>{for(let r=0;r<4;++r)a[s(r)][e.index]=t[4*n+r]});for(let e=0;e<4;++e)a.changed(s(e));let d=[];for(let e=0;e<4;++e)d.push(s(e));let f=[`domainSense = beta * ${o} * (1 + ${d.join(` + `)})`];for(let e=0;e<4;++e)f.push(`${l(e)} = ${o} * (${s(e)} + 1)`,`${c(e)} = -beta * ${o} * ${s(e)}`);i.addNodeFormula(`domainCharges`,{before:`repulsion`,params:{beta:r/2},formula:f.join(`; `)});let p=[`domainPush`];i.addRepulsion(`domainPush`,{after:`repulsion`,charge:o,sensitivity:`domainSense`,centroid:`shared`});for(let e=0;e<4;++e){let t=`domainPush`+e;i.addRepulsion(t,{after:p[p.length-1],charge:l(e),sensitivity:c(e),centroid:`shared`}),p.push(t)}return function(){p.forEach(e=>i.removeStage(e)),i.removeStage(`domainCharges`),u.forEach(e=>a.remove(e))}}var Ux=s({default:()=>Gx}),Wx=[4069403647,3780598271,3989391615,1503743999,4288522239,2960826879,1991750399,4294967295,2624937983,3132140799],Gx={id:`v2-5-magnetic-domains`,title:`Magnetic domains decide who repels`,author:`reader v2-5 (Feynman Vol. 2, Ch. 35-36)`,description:`
<p>On graphs made of groups, like <i>communities</i> or <i>sbm8x50</i>, ngraph draws one even
disc where the groups touch.</p>
<p>Here every node holds a little arrow, like a compass needle, and keeps turning it toward its
neighbors' average until patches of nodes point the same way: <b>domains</b>, as in a magnet
(Feynman Lectures, Vol. 2, Ch. 35-36). Then nodes in different domains push each other about 7 times
harder than before (at most 11), nodes in one domain about 1.2 times, and the colors show the
domains.</p>
<p>Look for separate clusters with open space between them; on <i>sbm8x50</i> the domains only
partly match the real groups.</p>
<p>What gets worse: edges between groups get longer, crossings rise on <i>communities</i> and
<i>Miserables</i>, and <i>Miserables</i> gets stretched. A step takes about as long as without the
idea: the extra push shares the library's own tree walk. With Repulsion = dual tree that shared walk
uses the quad tree, so a step takes 3 to 4 times as long as the stock dual tree.</p>
<p>Grids, trees, random graphs, and temperatures where no domains form are left unchanged in the
default color (try <i>grid20</i>, or set <i>Auto-off</i> to 0); with 3 or more dimensions it does
nothing, and the browser console says why.</p>`,tryGraphs:[`Benchmark: communities`,`Benchmark: sbm8x50`,`Groups 8x250 (2k)`,`Benchmark: grid20`],params:[{key:`boost`,label:`Push between groups`,value:10,step:`1`,help:`How much harder two nodes in different domains push apart: up to 1 + this times the normal push (about 7 times at 10). 0 or less turns the idea off. 10 is the tested default; more separates groups further but stretches loosely grouped graphs. Values above 1000 count as 1000.`},{key:`temperature`,label:`Temperature`,value:.3,step:`0.1`,help:`How firmly nodes settle into domains. 0 or less: every arrow at full length, the firmest domains. 0.1-0.5: firm domains. Near 0.8 the domains get weak and links get longer. From about 0.9 the arrows shrink to nothing (the "Curie point" of a magnet), no domains form, and Auto-off leaves the layout unchanged.`},{key:`autoOff`,label:`Auto-off`,value:1,step:`1`,help:`1: skip graphs without dense groups (grids, meshes, trees, random graphs, graphs with fewer than 1.5 links per node) and temperatures where no domains form. 0: always apply, to see what it does to a grid (it warps). Any value other than 0 counts as 1.`}],attach({layout:e,graph:t,params:n,settings:r}){let i=Math.min(1e3,Number(n.boost));if(!(i>0))return{};if((r.dimensions||2)!==2)return console.info(`[magnetic domains] 2D only; doing nothing for dimensions =`,r.dimensions),{};let a=[],o=new Map;if(t.forEachNode(t=>{let n=e.getBody(t.id);n&&(o.set(t.id,a.length),a.push(n))}),a.length<3)return{};let s=a.map(()=>[]);t.forEachLink(e=>{let t=o.get(e.fromId),n=o.get(e.toId);t!==void 0&&n!==void 0&&t!==n&&(s[t].push(n),s[n].push(t))});let c=performance.now(),{spins:l,rounds:u}=zx(a.length,s,{temperature:Number(n.temperature)}),d=Bx(a.length,s,l),f=Vx(a.length,l),p=Math.round(performance.now()-c),m=d.wallShare>=.01,h=d.modularity>=.5,g=d.links>=1.5*a.length,_=d.magnitude>=.1,v=`${new Set(f).size} domains, ${(100*d.wallShare).toFixed(1)}% of links cross a wall, modularity ${d.modularity.toFixed(2)}, ${(d.links/a.length).toFixed(1)} links per node (${u} rounds, ${p} ms)`;if(Number(n.autoOff)!==0&&!(_&&m&&h&&g))return console.info(`[magnetic domains] off: ${_?m?h?`tree-like graph, nothing dense to separate`:`domains no better than in a random graph`:`no sharp walls between domains (grid, mesh or tree)`:`no domains formed (temperature above the Curie point)`}. ${v}`),{};console.info(`[magnetic domains] on: ${v}`);let y=Hx(e,l,a,i),b=new Map;for(let e of f)b.set(e,(b.get(e)||0)+1);let x=new Map([...b.keys()].sort((e,t)=>b.get(t)-b.get(e)||e-t).map((e,t)=>[e,Wx[t%Wx.length]])),S=new Map;return o.forEach((e,t)=>S.set(t,x.get(f[e]))),{nodeColor(e){return S.get(e)||0},dispose:y}}};function Kx(e,t){let n=[],r=new Map;e.forEachNode(e=>{r.set(e.id,n.length),n.push(e.id)});let i=n.length,a=Array.from({length:i},()=>[]);e.forEachLink(e=>{let t=r.get(e.fromId),n=r.get(e.toId);t!==void 0&&n!==void 0&&t!==n&&(a[t].push(n,e.id),a[n].push(t,e.id))});let o=new Int32Array(i).fill(-1),s=new Int32Array(i),c=new Int32Array(i),l=new Int32Array(i).fill(-1),u=Array(i),d=new Int32Array(i),f=[],p=0;for(let e=0;e<i;++e){if(o[e]>=0)continue;let t=f.length,n=0,r=[e],i=[0];for(o[e]=s[e]=p++,c[e]=1,d[e]=t,n+=1;r.length;){let e=r.length-1,f=r[e],m=a[f];if(i[e]<m.length){let a=m[i[e]],h=m[i[e]+1];i[e]+=2,o[a]<0?(l[a]=f,u[a]=h,o[a]=s[a]=p++,c[a]=1,d[a]=t,n+=1,r.push(a),i.push(0)):h!==u[f]&&o[a]<s[f]&&(s[f]=o[a])}else{r.pop(),i.pop();let e=l[f];e>=0&&(s[f]<s[e]&&(s[e]=s[f]),c[e]+=c[f])}}f.push(n)}let m=new Map,h=new Map;for(let e=0;e<i;++e){let r=l[e];if(r<0||s[e]<=o[r])continue;let i=c[e],a=f[d[e]]-i,p,g;if(i<=t&&i<a)p=r,g=i;else if(a<=t&&a<i)p=e,g=a;else continue;let _=n[p];m.set(_,(m.get(_)||0)+g),h.set(u[e],_)}return{load:m,hubOfLink:h}}var qx=s({default:()=>$x}),Jx=7,Yx=7,Xx=100,Zx=`v2-6-soft-leaf-links`,Qx=`
  progress = grow > 0 ? min(1, (step + before) / grow) : 1;
  current = 1 + (fanStretch - 1) * progress;
  fanLength = springLength * current;
  fanCoefficient = max(1e-30, springCoefficient / current^soften);
  pull = fanStretch > 1 ?
    (springCoefficient > 0 && fanCoefficient > 0 ? fanCoefficient : springCoefficient) * (r - (fanLength < 0 ? springLength : fanLength)) :
    coefficient * (r - length)`,$x={id:`v2-6-soft-leaf-links`,title:`Longer, softer leaf links`,author:`v2-6 (Feynman Vol. 2 reader)`,description:`
<p>ngraph draws a hub with hundreds of leaves (nodes with a single link) as a small solid disk,
because every link has the same length, so most of the screen stays empty.</p>
<p>This idea makes each link that hangs a leaf, or a side branch of up to 7 nodes, off a hub
longer, by about the square root of (count + 1) / 7 (3.8 times for 100 leaves), and softer by the
same factor, like a longer rubber band. These links grow to their new length over the first 800
steps; every other link stays as it is, and in 3D the idea does nothing.</p>
<p>It comes from Feynman's Lectures, Vol. 2: rulers that stretch on a hot plate (chapter 42), and
Hooke's law for a rod (chapter 38).</p>
<p>On starOfStars and megaStars the tight disks of <b>none</b> become big stars that fill the
screen, with the leaves in a thick ring; on starOfStars the leaves swing to the outer side of each
hub, so the stars look like fans. ba500 has no leaves, so nothing changes there.</p>
<p>Worse: links between hubs now cut across the bigger stars, so crossings per link rise
(starOfStars 0.13 → 0.60, EVA 0.71 → 1.63, paTree3k 0.07 → 0.40), and with springLength 20 or
more, or gravity -2, the bigger stars pile on top of each other.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: ba500`],params:[{key:`room`,label:`Room per leaf`,value:1,step:`0.25`,help:`How much room each fan node gets. 1 is the tested value; 2 makes stars about 1.4 times wider (on starOfStars they then start to overlap), 0.5 smaller. 0 turns the idea off; values above 100 count as 100.`},{key:`soften`,label:`Softening`,value:1,step:`0.25`,help:`How much softer the longer links get. 1: as soft as a rod that much longer (Hooke), which makes the ring of leaves thicker. 0: as stiff as before, so the leaves sit in a thin ring at the rim and the stars fill less of the screen.`},{key:`grow`,label:`Steps to grow`,value:800,step:`100`,help:`The fan links grow from their usual length to the new one over this many steps. Growing them all at once lets big stars swallow small neighbours: on megaStars that left 5.9 crossings per link at step 1500, against 0.05 with 800 steps. 0: all at once.`}],attach({layout:e,graph:t,params:n,settings:r,steps:i}){if((r.dimensions||2)!==2)return null;let a=Math.min(Xx,Math.max(0,Number(n.room))),o=Number(n.soften);o=Number.isFinite(o)?Math.max(0,o):1;let s=Math.max(0,Math.round(Number(n.grow)||0));if(!(a>0))return null;let{load:c,hubOfLink:l}=Kx(t,Yx),u=[];if(l.forEach((t,n)=>{let r=e.getSpring(n);if(!r)return;let i=Math.max(1,Math.sqrt(a*(c.get(t)+1)/Jx));i>1&&u.push({spring:r,factor:i})}),u.length===0)return null;let d=e.simulator,f=d.springStore;return f.define(`fanStretch`,Float64Array,1,1),u.forEach(({spring:e,factor:t})=>{f.fanStretch[e.index]=t}),d.addLinkFormula(Zx,{replace:`springs`,params:{before:i||0,grow:s,soften:o},formula:Qx}),{dispose(){d.removeStage(Zx),f.remove(`fanStretch`)}}}};function eS(e,t,n){let r=n.spacing,i=n.rimBonds,a=tS(1,r),o=new Map;e.forEachLink(n=>{let r=n.fromId,i=n.toId;if(r===i)return;let a=nS(e,r)===1;if(a===(nS(e,i)===1))return;let s=a?i:r,c=t.getSpring(n);if(!c)return;let l=o.get(s);l||o.set(s,l=[]),l.push({spring:c,leaf:a?r:i})});let s=new Map,c=new Map,l=[],u=0,d=0,f=1;return o.forEach((e,t)=>{if(e.length<=a)return;let n=1,i=0;for(let a=0;a<e.length;a++){i>=tS(n,r)&&(n+=1,i=0);let o=1+(n-1)*r;l.push({hub:t,leaf:e[a].leaf,radius:o,angle:2*Math.PI*i/tS(n,r)+n}),i+=1,n>1&&(u+=1),s.set(e[a].spring,o)}d+=1,n>f&&(f=n),c.set(t,n*r)}),i&&c.size&&e.forEachLink(n=>{let r=n.fromId,i=n.toId;if(r===i||nS(e,r)===1||nS(e,i)===1)return;let a=(c.get(r)||0)+(c.get(i)||0);if(a===0)return;let o=t.getSpring(n);o&&s.set(o,1+a)}),{lengths:s,seats:l,changedLeaves:u,filledHubs:d,maxRings:f}}function tS(e,t){return Math.floor(2*Math.PI*(1+(e-1)*t)/t)}function nS(e,t){let n=e.getLinks(t);return n?n.size===void 0?n.length:n.size:0}function rS(e,t,n=1){let r=e.simulator,i=r.store,a=r.repulsionCharge(),o=r.repulsionSensitivity();return i.define(`fanLeaf`,Uint8Array),i.define(`fanCharge`,Float64Array),r.repulsionCharge(`fanCharge`),r.repulsionSensitivity(a),s(),r.on(`topology`,s),r.addNodeFormula(`fanCharges`,{before:`repulsion`,formula:`fanCharge = fanLeaf != 0 ? 0 : ${a}`}),r.addPairFormula(`fanLeaves`,{radius:`range`,symmetric:!1,params:{range:e=>Math.max(0,n*e.springLength())},formula:`fade = 1 - r * r / (range * range);
      push = fanLeaf_j != 0 ? -gravity * ${a}_i * ${a}_j * fade * fade / (r * r) : 0`}),function(){r.off(`topology`,s),r.removeStage(`fanLeaves`),r.removeStage(`fanCharges`),r.repulsionCharge(a),r.repulsionSensitivity(o),i.remove(`fanLeaf`),i.remove(`fanCharge`)};function s(){let e=i.fanLeaf;r.bodies.forEach((n,r)=>{e[r]=+!!t(n.id)})}}var iS=s({default:()=>oS}),aS=`v3-1-shells`,oS={id:`v3-1-fermi-fans`,title:`Leaves fill shells (Fermi fans)`,author:`v3-1 (Feynman Lectures Vol. 3, Ch. 4)`,description:`
<p>When a node has hundreds of <i>leaves</i> (neighbours with no other link), ngraph puts every
leaf one link length from it, so the star shows as a small bright ball and the long links between
stars leave most of the screen empty.</p>
<p>Here the leaves take turns filling rings, like seats in a stadium: the first ring is one link
length out with a seat every half link length, each next ring is half a link farther out, and the
node's other links start just past its outer ring so they don't cut through the disc. This comes
from Feynman's Lectures, Vol. 3, Ch. 4: two electrons can't share one state, so they fill shells
outward instead of crowding at the nucleus.</p>
<p>Look for balls turning into dandelions with spokes of different lengths: after 1500 steps at the
demo's defaults, the share of the picture that holds dots goes from 0.13 to 0.25 on starOfStars,
0.10 to 0.17 on megaStars and 0.27 to 0.29 on EVA, while caterpillars (no node has more than 12
leaves) doesn't change at all.</p>
<p>What gets worse: a leaf's link length shows its ring, not its distance in the graph, and more
links cross (starOfStars 0.13 to 0.21 crossings per link, paTree3k about 20% more, and much more
at a larger spacing); 2D only, in 3D it does nothing.</p>
<p>"Leaves push only nearby nodes" is an optional extra in which a leaf pushes only what is within
one link length (round 2 tried two) and starts on its seat: stars move close together (megaStars
fill 0.29), but fans lean and trees cross more. With the quad tree a step costs about the same as
without it (up to 1.7 times as much in the first hundred steps); the dual tree is no faster here.</p>
<p>Close relatives: "leaf shells" (v3-3) picks the ring gap from a stability rule, and "soft leaf
links" (v2-6) gives a node's leaves one longer, softer link.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: caterpillars`],params:[{key:`spacing`,label:`Leaf spacing (link lengths)`,value:.5,step:`0.1`,help:`Distance between neighbouring leaves and between rings. Larger gives bigger stars with longer spokes (starOfStars fills the screen at 1), but trees with many small fans get tangled (paTree3k crossed 6 times more at 1). Smaller packs leaves into tighter discs. A node keeps the normal layout while all its leaves fit in the first ring (about 6.3 / spacing leaves). 0 turns the rings off. Values above 6.28 count as 6.28, so the first ring always has a seat.`},{key:`rimBonds`,label:`Links leave from the rim (1 on, 0 off)`,value:1,step:`1`,help:`With 1, a filled node's links to non-leaves start at the edge of its disc. With 0 they start at the centre and cross many spokes.`},{key:`shortRange`,label:`Leaves push only nearby nodes (1 on, 0 off)`,value:0,step:`1`,help:`With 1, a leaf pushes other nodes only when they are closer than one link length (round 2 tried two). Every node that is not a leaf still pushes leaves from any distance. Big stars stop shoving each other apart and fill the screen. Fans lean and trees get tighter, with more crossings. Leaves start on their rings. With the quad tree a step costs about the same as without it, up to 1.7 times as much in the first hundred steps; the dual tree is no faster here.`}],attach({layout:e,graph:t,params:n,settings:r}){if(r.dimensions!==2)return null;let i=Number(n.spacing),a=Number.isFinite(i)?Math.min(i,2*Math.PI):.5,o=a>0?eS(t,e,{spacing:a,rimBonds:Number(n.rimBonds)!==0}):{lengths:new Map,seats:[]},s=o.lengths.size?sS(e.simulator,o.lengths):null,c=null;if(Number(n.shortRange)>0){let n=e.simulator.springLength();o.seats.forEach(({hub:t,leaf:r,radius:i,angle:a})=>{if(e.getBody(r).isPinned)return;let o=e.getNodePosition(t);e.setNodePosition(r,o.x+i*n*Math.cos(a),o.y+i*n*Math.sin(a))}),c=rS(e,e=>cS(t,e))}return{dispose(){c&&c(),s&&s()}}}};function sS(e,t){let n=e.springStore;return n.define(`shellLength`,Float64Array),t.forEach((e,t)=>{n.shellLength[t.index]=e}),e.addLinkFormula(aS,{replace:`springs`,formula:`shell = shellLength * springLength;
      pull = coefficient * (r - (shellLength > 0 ? (shell < 0 ? springLength : shell) : length))`}),function(){e.removeStage(aS),n.remove(`shellLength`)}}function cS(e,t){if(lS(e,t)!==1)return!1;let n=null;return e.forEachLinkedNode(t,e=>{n=e.id}),n!==null&&n!==t&&lS(e,n)>1}function lS(e,t){let n=e.getLinks(t);return n?n.size===void 0?n.length:n.size:0}var uS=1e-9,dS=1.5;function fS(e,t,n){e.store.define(`crowdingStiffness`,Float64Array);let r=e=>n.range*e.settings.springLength,i=e=>1/r(e);return e.addPairFormula(t,{startAtZero:[`crowdingStiffness`],radius:e=>{let t=n.strength,i=r(e);return t>0&&i>=uS&&Number.isFinite(t)&&Number.isFinite(i)&&e.store.n>=2?i:0},params:{c:()=>n.strength,inv:i,pairStiffness:e=>2*i(e)*i(e)},formula:`
      weight = c * (1 / mass_i + 1 / mass_j);
      crowdingStiffness_i += weight * pairStiffness;
      crowdingStiffness_j += weight * pairStiffness;
      push = weight * 2 * (1 - r * inv) * inv`}),e.addNodeFormula(t+`-inertia`,{formula:`
      inertia = dt * dt * (crowdingStiffness + springCoefficient * degree) / ${dS};
      force *= pinned == 0 && crowdingStiffness != 0 && inertia > mass ? mass / inertia : 1`}),function(){e.removeStage(t),e.removeStage(t+`-inertia`),e.store.remove(`crowdingStiffness`)}}var pS=s({default:()=>_S}),mS=`v3-2-crowding-costs`,hS=1e6,gS=1.5,_S={id:`v3-2-crowding-costs`,title:`Crowding costs energy`,author:`v3-2 (Feynman Vol. 3 reader)`,description:`
<p>In ngraph's pictures, a hub's leaves often sit on a crowded ring at one distance, with empty
spokes inside (starOfStars, megaStars, EVA).</p>
<p>This idea makes crowding cost energy: two nodes closer than half a spring length push each
other apart, harder the closer they are, and two light leaves push about twice as hard as a leaf
and a heavy hub.</p>
<p>It comes from quantum mechanics (Feynman Lectures on Physics, Vol. 3, Section 10-1): squeezing
a particle into less room costs energy, more so for a light one.</p>
<p>One extra: the push alone makes crowded nodes shake, so they also get more inertia, which makes
their steps smaller but lets a steady pull move them as fast as before. Most of the calm you see
comes from this extra, not from the push (on starOfStars, 9% of nodes reverse direction each step
with <b>none</b>, under 1% here).</p>
<p>Look for discs that fill in toward the hub, with dots at many distances, while the stars stay
about as far apart as with <b>none</b>; grid20 is identical with <i>Start from: pivot MDS</i>.</p>
<p>What gets worse: more edge crossings (about 3&times; on starOfStars), Range 1 tangles sparse
graphs (powerGrid), and it costs about 1.5&ndash;1.7&times; the time per step, much more with a
long spring length.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: grid20`],params:[{key:`strength`,label:`Strength`,value:100,step:`10`,help:`How hard crowded nodes push apart. More fills the discs further and adds edge crossings. 0 turns it off; values above 1,000,000 act as 1,000,000.`},{key:`range`,label:`Range`,value:.5,step:`0.1`,help:`How close two nodes must be, in spring lengths, before they push. 0.5 acts only inside crowded fans; 1 also spreads sparse graphs and trees, where it adds crossings, and costs about 2–2.5× the time per step. 0 turns it off; values above 1.5 act as 1.5 (up to about 3× the time per step).`}],attach({layout:e,params:t}){return{dispose:fS(e.simulator,mS,{strength:Math.min(Number(t.strength),hS),range:Math.min(Number(t.range),gS)})}}};function vS(e,t){let n=t.springLength,r=-t.gravity,i=t.springCoefficient,a=t.spacing,o=new Map;if(!(n>0)||!(i>0)||!(r>0)||!(a>0))return{lengths:o};let s=new Map;e.forEachLink(e=>{e.fromId!==e.toId&&(s.set(e.fromId,(s.get(e.fromId)||0)+1),s.set(e.toId,(s.get(e.toId)||0)+1))});let c=new Map;e.forEachLink(e=>{if(e.fromId===e.toId)return;let t=e.fromId,n=e.toId,r=s.get(t)===1?t:s.get(n)===1?n:null;if(r===null)return;let i=r===t?n:t;s.get(i)!==1&&(c.has(i)||c.set(i,[]),c.get(i).push({link:e,leaf:r}))});let l=new Map;return c.forEach((e,s)=>{let c=t.leafCharge(e[0].leaf),u=a*Math.cbrt(4.21*r*c*c/i);if(!(u>0)||!Number.isFinite(u))return;let d=Math.floor(2*Math.PI*n/u);if(e.length<=Math.max(d,t.minLeaves-1))return;let f=0,p=0,m=n;for(let{link:t}of e){m=n+f*u,o.set(t,m);let e=Math.max(1,Math.floor(2*Math.PI*m/u));++p>=e&&(f+=1,p=0)}l.set(s,m)}),t.bondsOutside&&l.size&&e.forEachLink(e=>{if(o.has(e))return;let t=l.get(e.fromId)||0,r=l.get(e.toId)||0;(t||r)&&o.set(e,t+r+n)}),{lengths:o,hubs:l.size}}var yS=s({default:()=>bS}),bS={id:`v3-3-leaf-shells`,title:`Leaves fill rings (stability rule)`,author:`v3-3 (Feynman Vol. 3, ch. 13 and 15)`,description:`
<p>On star-like graphs ngraph piles each hub's leaves (nodes with a single link) into a dense ball.</p>
<p>Leaves on one ring around their hub push each other apart; closer than about half a link, the ring buckles (every other leaf slides in or out) and crumples into a disk.</p>
<p>Here each hub with more than about 11 leaves gets several rings at growing distances, like the shells of an atom, each holding no more leaves than a lone ring can without buckling. The hub's other links start outside its rings, and only link lengths change.</p>
<p>From Feynman's Lectures, Vol. 3: ch. 13 and 15 (waves on a ring of atoms, where the zigzag gives way first) and ch. 15-6 (electrons filling shells).</p>
<p>Look for sunbursts with visible rays instead of balls: the share of the screen in use doubles on starOfStars and grows 1.7× on megaStars. Compare with <b>none</b>, or with the sibling "Fermi fans" (v3-1), where you set the gap yourself.</p>
<p>Worse: big stars make the drawing larger, so the rest looks smaller (EVA); links between stars cross more (starOfStars 0.13 → 0.20 crossings per link, EVA 8–26% more); hubs that also have many other links (hubLeaves5k) barely change; and in 3D it does nothing.</p>`,tryGraphs:[`Benchmark: starOfStars`,`Benchmark: megaStars`,`Benchmark: EVA`,`Benchmark: caterpillars`],params:[{key:`spacing`,label:`Ring spacing`,value:1.1,step:`0.1`,help:`Gap between neighbouring leaves on a ring, and between rings, as a multiple of the smallest gap a lone ring holds without buckling (about half a link at default settings). The rings settle a bit further out and steady each other, so they stay separate down to about 0.5 and start to blur together below that. Larger values give bigger, airier stars and also reach smaller hubs (from about 1.9 even the 7-leaf hubs of caterpillars change). 0 turns the idea off.`},{key:`minLeaves`,label:`Smallest hub`,value:0,step:`1`,help:`Hubs with fewer leaves than this keep the default link lengths. 0 means automatic: only hubs whose leaves do not fit into the first ring. Raise it to leave trees with small hubs alone and change only big stars.`},{key:`bondsOutside`,label:`Other links outside rings`,value:1,step:`1`,help:`1: a hub's links to non-leaf nodes get long enough to start outside its rings. 0: they keep their length and cut through the rings (many more crossings).`}],attach({layout:e,graph:t,params:n,settings:r}){if((r.dimensions||2)!==2)return null;let i=e.simulator,a=Number(n.spacing),o=new Map,s,c,l;return f(),i.on(`settings`,u),{dispose(){i.off(`settings`,u),d()}};function u(){(i.springLength()!==s||i.springCoefficient()!==c||i.gravity()!==l)&&f()}function d(){o.forEach((e,t)=>{t.length=e}),o.clear()}function f(){s=i.springLength(),c=i.springCoefficient(),l=i.gravity(),d();let r=vS(t,{springLength:s,springCoefficient:c,gravity:l,leafCharge:t=>e.getBody(t).mass,spacing:Number.isFinite(a)?a:1.1,minLeaves:Number(n.minLeaves)||0,bondsOutside:Number(n.bondsOutside)!==0});for(let[t,n]of r.lengths){let r=e.getSpring(t);r&&(o.set(r,r.length),r.length=n)}}}},xS=[0,.063319,.1267,.1902,.25387,.31779,.38201,.4466,.51161,.57714,.64323,.70998,.77745,.84573,.91491,.98509,1.0564,1.1289,1.2027,1.2779,1.3548,1.4334,1.514,1.5967,1.6817,1.7693,1.8598,1.9534,2.0506,2.1518,2.2574,2.3681,2.4846,2.6076,2.7384,2.8783,3.0291,3.193,3.3736,3.5758,3.8077,4.0848,4.4483,5.0131,5.3481,5.5788,5.7412,5.8516,5.9234,5.9559,5.9517,5.9163,5.8448,5.7355,5.5883,5.392,5.132,4.7706,4.1919,3.8211,3.5422,3.3127,3.1165,2.9448,2.7923,2.6552,2.5309,2.4175,2.3133,2.2173,2.1283,2.0455,1.9684,1.8962,1.8286,1.765,1.7051,1.6486,1.5952,1.5447,1.4967,1.4513,1.408,1.3669,1.3276,1.2902,1.2545,1.2204,1.1877,1.1565,1.1265,1.0978,1.0702,1.0437,1.0183,.99381,.97026,.94758,.92573,.90466,.88435,.86474,.84581,.82752,.80985,.79276,.77623,.76023,.74475,.72975,.71521,.70112,.68746,.67421,.66135,.64887,.63675,.62498,.61354,.60242,.59161,.5811,.57087,.56092,.55123,.5418,.53262,.52367,.51495,.50646,.49818,.4901,.48222,.47454,.46704,.45973,.45258,.44561,.4388,.43215,.42565,.4193,.41309,.40702,.40109,.39529,.38962,.38407,.37863,.37332,.36812,.36303,.35804,.35316,.34838,.3437,.33911,.33462,.33022,.3259,.32167,.31752,.31345,.30946,.30555,.30172,.29795,.29426,.29063,.28708,.28359,.28016,.2768,.27349,.27025,.26706,.26393,.26086,.25784,.25487,.25196,.24909,.24628,.24351,.24079,.23811,.23548,.23289,.23035,.22785,.22539,.22297,.22058,.21824,.21593,.21367,.21143,.20923,.20707,.20494,.20284];function SS(e,t){let n=e.simulator,r=t.density,i=t.extra,a=Math.max(0,Math.round(t.startStep)),o=t.stepsBefore||0,s=n.settings.dimensions,c=n.repulsionCharge(),l=0,u=0,d=!1;return n.addSum(`jelliumCharge`,{formula:c}),n.addSum(`jelliumMoment`,{formula:`${c} * pos`}),n.addHostStep(`jelliumMeasure`,{when:e=>l===0&&!d&&e.iteration()+o>=a&&e.store.n>=8&&e.gravity()<0,reads:[`pos`,c],run:f}),n.addNodeFormula(`neutral-background`,{params:{sigma:()=>l,radius:()=>u,start:a,before:o,edge:xS[xS.length-1],maxU:4},tables:{field:{from:0,to:4,values:xS}},formula:`
      d = pos - jelliumMoment / jelliumCharge;
      s = length(d);
      u = s / radius;
      // How hard the background pushes a node of unit charge at distance s from its centre
      push = ${s===2?CS:wS};
      // gravity < 0, so this points toward the centre
      f = gravity * ${c} * sigma * push * (D == 3 ? radius : 1) / s;
      // The background switches on at the start step, once it is measured (sigma > 0), and only
      // when nodes repel each other
      force += select(sigma > 0 && step + before >= start && n >= 8 && gravity < 0 && pinned == 0 && s != 0,
        f * d, 0 * pos)`}),{getRadius:()=>u,dispose(){[`jelliumCharge`,`jelliumMoment`,`jelliumMeasure`,`neutral-background`].forEach(e=>{n.getStage(e)&&n.removeStage(e)})}};function f(e){let t=e.store.n,n=TS(e,6);if(!(n>0))return;let a=e.store[c],o=0;for(let e=0;e<t;++e)o+=a[e];l=r*n*o/t,u=((1+i)*o/(ES(s)*l))**(1/s),l>0&&l<1/0&&u>0||(d=!0,l=0)}}var CS=`u >= maxU ? edge * maxU * maxU / (u * u) : field(u)`,wS=`4 / 3 * pi * (`+[0,1,2,3,4,5,6].map(e=>.85+.05*e).map(e=>`(u < ${e} ? u : ${e} * ${e} * ${e} / (u * u))`).join(` + `)+`) / 7`;function TS(e,t){let n=e.store,r=n.n,i=n.D,a=e.getBBox(),o=1;for(let e=0;e<i;++e){let t=e===0?`x`:e===1?`y`:`z`;o*=Math.max(a[`max_`+t]-a[`min_`+t],1e-9)}let s=Math.max(1e-6,(o/r)**(1/i)),c=Math.max(1,Math.floor(r/1500)),l=[];for(let e=0;e<r;e+=c)l.push(e);let u=[];for(let n=0;n<30&&l.length;++n){let n=e.neighbors(s),r=[];l.forEach(e=>{let a=[];if(n.forEachNeighbor(e,s,(e,t)=>a.push(t)),a.length<t){r.push(e);return}a.sort(DS);let o=a[t-1];u.push(t/(ES(i)*o**+i))}),l=r,s*=2}return u.sort(DS),u[u.length>>1]}function ES(e){return e===0?1:e===1?2:ES(e-2)*2*Math.PI/e}function DS(e,t){return e-t}var OS=s({default:()=>kS}),kS={id:`v3-4-jellium`,title:`Neutral background ("jellium")`,author:`v3-4 (Feynman Vol. III reader)`,description:`
<p>On graphs with many separate pieces (yeast, sciMet, EVA), ngraph pushes the small pieces far out,
and on big-star graphs (megaStars, starOfStars) the stars end up as small discs on long lines.</p>
<p>This idea keeps every node's push, but adds an even "background" disc that pulls each node toward
the centre about as hard as an evenly spread crowd of nodes would push it, so crowded places still
push apart and empty space pulls nodes in. It comes from Feynman's <i>Lectures on Physics</i>,
Vol. III, chapter 21, where a fixed background of positive charge in a metal ("jellium") balances the
electrons' push on each other.</p>
<p>At step 300 it measures how closely the nodes sit and fixes the disc's density from that. On
megaStars the stars become big touching starbursts (the longest hub-to-hub line shrinks from about
240 to 125); on yeast the main part keeps its size, but the pieces stop drifting away, so zoom-to-fit
gives it most of the screen; grid20 and sbm8x50 look the same.</p>
<p>What gets worse: more crossing lines where stars touch (starOfStars: 0.13 to 0.31 per line),
small pieces packed too close to tell apart at a higher <i>Background density</i>, a crushed
drawing if it switches on before about step 50, and a short pause at step 300 while it measures.
It changes nothing before step 300, doesn't help communities, and does nothing in 1D or above 3D,
on graphs under 8 nodes, or when nodes attract each other (gravity 0 or more). In 3D the disc is a
ball, whose pull is exact.</p>`,tryGraphs:[`Benchmark: megaStars`,`Benchmark: starOfStars`,`Benchmark: yeast`,`Benchmark: sciMet`,`Benchmark: grid20`],params:[{key:`density`,label:`Background density`,value:.25,step:`0.05`,help:`How dense the background is, as a share of how closely nodes sit at the step it switches on. 0 (or less) turns the background off. Higher packs stars and pieces tighter: fewer gaps, more crossings, and at 0.5 EVA's small pieces pack so close that you can't tell them apart. Lower is gentler. Measured once, then kept: re-measuring every step gave the same picture in a short test, so measuring once is simply the simpler choice.`},{key:`extra`,label:`Extra pull`,value:.3,step:`0.1`,help:`Extra background charge, as a share of the nodes' total mass, meant to pull back pieces that start far away. 0 means an exactly balanced background; below 0 counts as 0. From the demo's start it isn't needed: at 0, yeast, sciMet and EVA pull their pieces in just as well.`},{key:`startStep`,label:`Switch on at step`,value:300,step:`50`,help:`The background waits this many steps, so the graph can first unfold, and then measures node density. Below about 50 the graph hasn't unfolded yet: the background comes out too small and crushes the whole drawing (at 0, yeast shrinks to a tenth of its width). Below 0 counts as 0.`}],attach({layout:e,params:t,settings:n,steps:r}){let i=n.dimensions||2;if(i!==2&&i!==3)return null;let a=Number.isNaN(Number(t.density))?.25:Number(t.density);if(!(a>0))return null;let o=Number(t.extra),s=Number(t.startStep);return{dispose:SS(e,{density:a,extra:Number.isNaN(o)?.3:Math.max(0,o),startStep:Number.isNaN(s)?300:s,stepsBefore:r||0}).dispose}}},AS=Object.values(Object.assign({"./pn-1-let-go-springs/index.js":oy,"./ru-1-leaf-fade/index.js":uy,"./ru-2-group-smoothing/index.js":Cy,"./ru-3-stiff-springs/index.js":Ay,"./ru-4-grid-pressure/index.js":rb,"./ru-5-heat-spread/index.js":pb,"./ru-6-spread-crowds/index.js":xb,"./v1-1-short-range-push/index.js":wb,"./v1-2-leaf-fade/index.js":kb,"./v1-3-group-bridges/index.js":Fb,"./v1-4-dimming-crowds/index.js":Xb,"./v1-5-personal-space/index.js":$b,"./v1-6-gas-pressure/index.js":ax,"./v1-7-contact-push/index.js":px,"./v2-1-fading-push/index.js":hx,"./v2-2-balancing-pull/index.js":_x,"./v2-3-flat-world/index.js":Sx,"./v2-4-limited-reach/index.js":Fx,"./v2-5-magnetic-domains/index.js":Ux,"./v2-6-soft-leaf-links/index.js":qx,"./v3-1-fermi-fans/index.js":iS,"./v3-2-crowding-costs/index.js":pS,"./v3-3-leaf-shells/index.js":yS,"./v3-4-jellium/index.js":OS})).map(e=>e.default).filter(Boolean).sort((e,t)=>e.title.localeCompare(t.title)),jS={maxVelocity:4,integrator:`euler`,nbody:`quadtree`},MS={maxVelocity:4,integrator:`fire`,nbody:`dualtree`},NS=(0,Ov.default)({graph:`Miserables`,timeStep:.5,springLength:10,springCoefficient:.8,dragCoefficient:.9,dimensions:2,theta:.8,gravity:-12,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,placement:`default`,backend:`cpu`,stepsPerFrame:1,prototype:`none`},{useSearch:!0}),PS=`p.`;function FS(e){return AS.find(t=>t.id===e)||null}function IS(e,t){let n={};return e&&(e.params||[]).forEach(e=>{let r=t?NS.get(PS+e.key):void 0;n[e.key]=Number.isFinite(r)?r:e.value}),n}var LS={name:`app`,components:{InputValue:Vv,InputFlag:Yv,InputSelect:ay,HelpIcon:Mv},computed:{onGpu(){return this.backend===`webgpu`},usesFire(){return this.layoutSettings.integrator===`fire`},integratorOptions(){return[{value:`euler`,label:`euler (default)`},{value:`fire`,label:`fire`}]},nbodyOptions(){return[{value:`quadtree`,label:`quad tree (default)`},{value:`dualtree`,label:`dual tree`}]},placementOptions(){return[{value:`default`,label:`library default`},{value:`pivot`,label:`pivot MDS (add-on)`}]},prototype(){return FS(this.prototypeId)},activePrototype(){return this.prototypeOn?this.prototype:null},prototypeOptions(){return[{value:`none`,label:`none`}].concat(AS.map(e=>({value:e.id,label:e.title})))},prototypeConfig(){return this.activePrototype?{id:this.prototypeId,params:{...this.prototypeParams}}:{id:`none`,params:{}}},backendOptions(){return[{value:`cpu`,label:`CPU (library)`},{value:`webgpu`,label:`WebGPU (add-on)`,disabled:this.gpuAvailable===!1}]}},methods:{useSpeedups(e){Object.assign(this.layoutSettings,e?MS:jS)},restart(){this.scene.restart()},finishPrototype(){this.isRunning&&this.toggleLayoutRun(),this.scene.finishPrototype()},shortGraphName(e){return e.replace(/^Benchmark: /,``)},formatMs(e){return e<1?e.toFixed(2):e<10?e.toFixed(1):Math.round(e)},updateStats(){this.scene&&(this.stats=this.scene.getStats(),this.stats.gpuError&&this.backend===`webgpu`&&(this.gpuMessage=`WebGPU stopped (${this.stats.gpuError}), switched back to CPU.`,this.backend=`cpu`))},toggleLayoutRun(){this.isRunning=!this.isRunning,this.scene.runLayout(this.isRunning)},loadNewGraph(e){this.loading=!0,this.stats=null,this.isRunning=!1,gv(e).then(e=>{El.fire(`load-graph`,e,this.selectedLayout),this.loading=!1})},onGraphLoaded(){this.isRunning=!0}},watch:{layoutSettings:{deep:!0,handler(e){this.scene.updateLayoutSettings(e),NS.set(e)}},fixedViewBox(e){this.scene.setFixedViewBox(e)},placement(e){NS.set(`placement`,e),this.scene.setPlacement(e)},stepsPerFrame(e){NS.set(`stepsPerFrame`,e),this.scene.setStepsPerFrame(e)},backend(e){this.scene.setBackend(e).then(t=>{t===e?e===`webgpu`&&(this.gpuMessage=``):(this.gpuMessage=`WebGPU is not available in this browser.`,this.gpuAvailable=!1,this.backend=t),NS.set(`backend`,this.backend)})},selectedGraph(e){NS.set(`graph`,e),this.loadNewGraph(e)},prototypeId(e,t){let n=FS(t);n&&(n.params||[]).forEach(e=>NS.unset(PS+e.key)),NS.set(`prototype`,e),this.prototypeParams=IS(this.prototype,!1),this.prototypeOn=!0},prototypeOn(e){e?NS.unset(`ideaOff`):NS.set(`ideaOff`,!0)},prototypeParams:{deep:!0,handler(e){Object.entries(e).forEach(([e,t])=>{Number.isFinite(t)&&NS.set(PS+e,t)})}},prototypeConfig:{deep:!0,handler(e,t){clearTimeout(this.paramsTimer),Object.values(e.params).every(Number.isFinite)&&(t&&e.id===t.id?this.paramsTimer=setTimeout(()=>this.scene.setPrototypeParams(e.params),300):this.scene.setPrototype(this.activePrototype,e.params))}}},data(){let e=iv();return{isRunning:!0,fixedViewBox:!1,selectedGraph:NS.get(`graph`),settingsOpen:window.innerWidth>500,loading:!1,layoutSettings:{timeStep:NS.get(`timeStep`),springLength:NS.get(`springLength`),springCoefficient:NS.get(`springCoefficient`),dragCoefficient:NS.get(`dragCoefficient`),dimensions:NS.get(`dimensions`),theta:NS.get(`theta`),gravity:NS.get(`gravity`),maxVelocity:NS.get(`maxVelocity`),integrator:NS.get(`integrator`),nbody:NS.get(`nbody`)},placement:NS.get(`placement`),backend:`cpu`,stepsPerFrame:NS.get(`stepsPerFrame`),prototypes:AS,prototypeId:FS(NS.get(`prototype`))?NS.get(`prototype`):`none`,prototypeParams:IS(FS(NS.get(`prototype`)),!0),prototypeOn:NS.get(`ideaOff`)!==!0,aboutOpen:!1,gpuAvailable:typeof navigator<`u`&&!!navigator.gpu,gpuMessage:``,stats:null,graphs:e}},mounted(){let e=document.getElementById(`cnv`);this.scene=nv(e,{...this.layoutSettings},{placement:this.placement,stepsPerFrame:this.stepsPerFrame}),this.activePrototype&&this.scene.setPrototype(this.activePrototype,this.prototypeParams),this.loadNewGraph(this.selectedGraph),El.on(`load-graph`,this.onGraphLoaded),NS.get(`backend`)===`webgpu`&&(this.backend=`webgpu`),this.statsTimer=setInterval(this.updateStats,250)},beforeUnmount(){clearInterval(this.statsTimer),clearTimeout(this.paramsTimer),this.scene&&this.scene.dispose()}},RS={class:`layout-box`},zS={class:`buttons`},BS={class:`graph-picker`,title:`Graph`},VS=[`value`],HS={key:0,class:`buttons idea-bar`},US={class:`graph-picker`,title:`Layout idea to try`},WS=[`value`],GS=[`disabled`],KS={key:1,class:`about idea-about`},qS=[`innerHTML`],JS={class:`stats`},YS={key:0},XS={key:1},ZS={key:0},QS={key:1},$S={class:`number`},eC={key:2,class:`off-gpu`},tC={key:0,class:`content`},nC={class:`section`},rC={class:`prototype`},iC={key:0,class:`off-note`},aC={key:1,class:`off-note`},oC={key:2,class:`try`},sC=[`onClick`];function cC(e,t,n,r,i,a){let o=gr(`help-icon`),s=gr(`input-value`),c=gr(`input-select`),l=gr(`input-flag`);return Ui(),Ji(`div`,null,[t[54]||=J(`h2`,null,[J(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout`},`ngraph.forcelayout`),ia(` demo`)],-1),J(`div`,RS,[J(`div`,zS,[J(`label`,BS,[kn(J(`select`,{"onUpdate:modelValue":t[0]||=e=>i.selectedGraph=e},[(Ui(!0),Ji(Li,null,br(i.graphs,e=>(Ui(),Ji(`option`,{key:e,value:e},ye(e),9,VS))),128))],512),[[ko,i.selectedGraph]])]),J(`a`,{href:`#`,onClick:t[1]||=Io((...e)=>a.toggleLayoutRun&&a.toggleLayoutRun(...e),[`prevent`]),class:`btn`},ye(i.isRunning?`Pause`:`Run`),1),J(`a`,{href:`#`,onClick:t[2]||=Io((...e)=>a.restart&&a.restart(...e),[`prevent`]),class:`btn restart`,title:`Start over from initial positions`},`Reset`)]),i.prototypes.length?(Ui(),Ji(`div`,HS,[J(`label`,US,[kn(J(`select`,{"onUpdate:modelValue":t[3]||=e=>i.prototypeId=e},[(Ui(!0),Ji(Li,null,br(a.prototypeOptions,e=>(Ui(),Ji(`option`,{key:e.value,value:e.value},ye(e.label),9,WS))),128))],512),[[ko,i.prototypeId]])]),J(`label`,{class:ue([`idea-toggle`,{inactive:!a.prototype}]),title:`Turn the idea off and on: the layout restarts from the same start, so you can compare`},[kn(J(`input`,{type:`checkbox`,"onUpdate:modelValue":t[4]||=e=>i.prototypeOn=e,disabled:!a.prototype},null,8,GS),[[Do,i.prototypeOn]]),t[24]||=ia(` on `,-1)],2),ea(o,{onShow:t[5]||=e=>i.aboutOpen=!i.aboutOpen,class:ue({open:i.aboutOpen})},null,8,[`class`])])):aa(``,!0),i.aboutOpen&&i.prototypes.length?(Ui(),Ji(`div`,KS,[a.prototype?(Ui(),Ji(`div`,{key:0,innerHTML:a.prototype.description},null,8,qS)):(Ui(),Ji(Li,{key:1},[t[25]||=ia(` Experimental changes to the layout, one per folder in `,-1),t[26]||=J(`code`,null,`demo/src/prototypes`,-1),t[27]||=ia(`. Picking an idea restarts the layout from the same start as `,-1),t[28]||=J(`b`,null,`none`,-1),t[29]||=ia(`; the `,-1),t[30]||=J(`b`,null,`on`,-1),t[31]||=ia(` box turns it off and on again, so you can compare the two. Its parameters are under Settings; changing one carries on from the current drawing, and Reset starts over. `,-1)],64))])):aa(``,!0),J(`div`,JS,[i.loading?(Ui(),Ji(`div`,YS,`Loading graph...`)):i.stats?(Ui(),Ji(`div`,XS,[ia(ye(i.stats.nodes.toLocaleString())+` nodes, `+ye(i.stats.links.toLocaleString())+` links`,1),i.stats.placement?(Ui(),Ji(`span`,ZS,`, `+ye(i.stats.placement)+` start`,1)):aa(``,!0),t[34]||=J(`br`,null,null,-1),ia(` `+ye(i.stats.steps.toLocaleString())+` steps`,1),i.stats.msPerStep?(Ui(),Ji(`span`,QS,[t[32]||=ia(`, `,-1),J(`span`,$S,ye(a.formatMs(i.stats.msPerStep)),1),t[33]||=ia(` ms/step`,-1)])):aa(``,!0),ia(` on `+ye(i.stats.backend===`webgpu`?`WebGPU`:`CPU`)+` `,1),i.stats.gpuReasons?(Ui(),Ji(`div`,eC,`Runs on the CPU: `+ye(i.stats.gpuReasons)+`.`,1)):aa(``,!0)])):aa(``,!0),J(`a`,{href:`#`,onClick:t[6]||=Io(e=>i.settingsOpen=!i.settingsOpen,[`prevent`]),class:`toggle-settings`},`Settings `+ye(i.settingsOpen?`▴`:`▾`),1)])]),i.settingsOpen?(Ui(),Ji(`div`,tC,[ea(s,{label:`Time step`,modelValue:i.layoutSettings.timeStep,"onUpdate:modelValue":t[7]||=e=>i.layoutSettings.timeStep=e},{default:On(()=>[...t[35]||=[ia(` This is integration time step value. The higher it is, the faster nodes will move, but setting it too high can result in lots of jitter and instability. `,-1)]]),_:1},8,[`modelValue`]),ea(s,{label:`Gravity`,modelValue:i.layoutSettings.gravity,"onUpdate:modelValue":t[8]||=e=>i.layoutSettings.gravity=e},{default:On(()=>[...t[36]||=[ia(` This coefficient defines how strongly each node repels each other. `,-1)]]),_:1},8,[`modelValue`]),ea(s,{label:`Ideal spring length`,modelValue:i.layoutSettings.springLength,"onUpdate:modelValue":t[9]||=e=>i.layoutSettings.springLength=e},{default:On(()=>[...t[37]||=[ia(` What is the ideal length of each spring? `,-1)]]),_:1},8,[`modelValue`]),ea(s,{label:`Spring coefficient`,modelValue:i.layoutSettings.springCoefficient,"onUpdate:modelValue":t[10]||=e=>i.layoutSettings.springCoefficient=e},{default:On(()=>[...t[38]||=[ia(` Higher values makes the spring force stronger, pushing edges closer to the ideal spring length. `,-1)]]),_:1},8,[`modelValue`]),ea(s,{label:`Drag coefficient`,modelValue:i.layoutSettings.dragCoefficient,"onUpdate:modelValue":t[11]||=e=>i.layoutSettings.dragCoefficient=e,disabled:a.usesFire,note:a.usesFire?`Not used by the fire integrator.`:``},{default:On(()=>[...t[39]||=[ia(` This coefficient introduces "resistance" from environment. When it is close to 0 the forces will have a lot of freedom, nothing will be stopping them, and that can result in a very unstable simulation. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),ea(s,{label:`Theta`,modelValue:i.layoutSettings.theta,"onUpdate:modelValue":t[12]||=e=>i.layoutSettings.theta=e,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU.`:``},{default:On(()=>[...t[40]||=[ia(` This coefficient influences when we apply long distance forces approximation. When this value is close to 0, the simulation compares forces between every single node (giving O(n^2), slow performance). Recommended value is 0.8. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),ea(s,{label:`Dimensions`,modelValue:i.layoutSettings.dimensions,"onUpdate:modelValue":t[13]||=e=>i.layoutSettings.dimensions=e,step:`1`},{default:On(()=>[...t[41]||=[ia(` Defines number of dimensions of the space where layout is performed. For visualization purpose 2 or 3 dimensions are normally enough. Note: Memory consumptions grows exponentially with number of dimensions. `,-1)]]),_:1},8,[`modelValue`]),J(`div`,nC,[t[43]||=ia(` Speed-ups `,-1),J(`small`,null,[J(`a`,{href:`#`,onClick:t[14]||=Io(e=>a.useSpeedups(!0),[`prevent`])},`turn all on`),t[42]||=ia(` | `,-1),J(`a`,{href:`#`,onClick:t[15]||=Io(e=>a.useSpeedups(!1),[`prevent`])},`library defaults`)])]),ea(s,{label:`Max velocity`,modelValue:i.layoutSettings.maxVelocity,"onUpdate:modelValue":t[16]||=e=>i.layoutSettings.maxVelocity=e},{default:On(()=>[...t[44]||=[ia(` Maximum distance a node can travel in one unit of time (each step moves a node by at most time step * max velocity). Library default is 4. Set it to 1 to get the layouts of versions before v3.4, which settle more slowly. `,-1)]]),_:1},8,[`modelValue`]),ea(c,{label:`Integrator`,modelValue:i.layoutSettings.integrator,"onUpdate:modelValue":t[17]||=e=>i.layoutSettings.integrator=e,options:a.integratorOptions},{default:On(()=>[...t[45]||=[ia(` How forces move nodes. `,-1),J(`b`,null,`euler`,-1),ia(` is the classic integration slowed down by drag. `,-1),J(`b`,null,`fire`,-1),ia(` (Fast Inertial Relaxation Engine) ignores drag: the whole system keeps its momentum while it moves "downhill", and stops dead when it overshoots. Usually reaches a good layout in fewer steps, especially on trees and grids. `,-1)]]),_:1},8,[`modelValue`,`options`]),ea(c,{label:`Repulsion`,modelValue:i.layoutSettings.nbody,"onUpdate:modelValue":t[18]||=e=>i.layoutSettings.nbody=e,options:a.nbodyOptions,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU: exact pairs up to 1,024 nodes, a grid pyramid beyond.`:``},{default:On(()=>[...t[46]||=[ia(` How node repulsion is computed. `,-1),J(`b`,null,`quad tree`,-1),ia(` is Barnes-Hut: each node walks the tree. `,-1),J(`b`,null,`dual tree`,-1),ia(` lets pairs of tree cells interact with each other, which is 5-10x faster on large graphs with the same accuracy. Both use theta. `,-1)]]),_:1},8,[`modelValue`,`options`,`disabled`,`note`]),ea(s,{label:`Steps per frame`,modelValue:i.stepsPerFrame,"onUpdate:modelValue":t[19]||=e=>i.stepsPerFrame=e,step:`1`},{default:On(()=>[...t[47]||=[ia(` How many layout steps to run before each frame is rendered. Fast layouts can do many steps per frame. `,-1)]]),_:1},8,[`modelValue`]),ea(l,{label:`Follow bounding box`,modelValue:i.fixedViewBox,"onUpdate:modelValue":t[20]||=e=>i.fixedViewBox=e,step:`1`},{default:On(()=>[...t[48]||=[ia(` Setting this to true will disable pan/zoom but will always keep the graph visible. This is not part of the layout algorithm. Just a view setting of the renderer. `,-1)]]),_:1},8,[`modelValue`]),t[53]||=J(`div`,{class:`section`},[ia(` Add-ons `),J(`small`,null,[J(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout/tree/main/modules`},`not part of the library`)])],-1),ea(c,{label:`Start from`,modelValue:i.placement,"onUpdate:modelValue":t[21]||=e=>i.placement=e,options:a.placementOptions},{default:On(()=>[...t[49]||=[ia(` Initial positions of nodes. `,-1),J(`b`,null,`pivot MDS`,-1),ia(` places nodes so that distances follow graph distances (or uses a radial tree when it fits better), so the layout only needs to polish it. Changing this restarts the layout. This is a separate module, `,-1),J(`code`,null,`modules/pivot`,-1),ia(` in this repository; ngraph.forcelayout itself places each node at random near its already placed neighbours. `,-1)]]),_:1},8,[`modelValue`,`options`]),ea(c,{label:`Run on`,modelValue:i.backend,"onUpdate:modelValue":t[22]||=e=>i.backend=e,options:a.backendOptions,note:i.gpuMessage},{default:On(()=>[...t[50]||=[J(`b`,null,`WebGPU`,-1),ia(` runs the layout's own simulation on the GPU when it can run all of it (for now the built in physics with any repulsion law, node formulas and sums, in any number of dimensions); otherwise the layout stays on the CPU and the note under the stats says why. Repulsion is exact over all pairs up to 1,024 nodes; larger layouts use a grid pyramid instead of a tree (in 2D and 3D), so Theta and Repulsion settings do not apply. It is hundreds of times faster on large graphs, so raise Steps per frame (e.g. 20) to see it: with one step per frame, drawing the graph is the bottleneck. This is a separate module, `,-1),J(`code`,null,`modules/gpu`,-1),ia(` in this repository; ngraph.forcelayout itself always runs on the CPU. `,-1)]]),_:1},8,[`modelValue`,`options`,`note`]),a.prototype?(Ui(),Ji(Li,{key:0},[t[52]||=J(`div`,{class:`section`},[ia(` Idea settings `),J(`small`,null,[J(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout/tree/main/demo/src/prototypes`},`ideas to try, not part of the library`)])],-1),J(`div`,rC,[i.prototypeOn?i.stats&&i.stats.gpuReasons?(Ui(),Ji(`div`,aC,`Runs on the CPU: `+ye(i.stats.gpuReasons)+`.`,1)):aa(``,!0):(Ui(),Ji(`div`,iC,`The idea is off: turn it on at the top to use these.`)),a.prototype.tryGraphs?(Ui(),Ji(`div`,oC,[t[51]||=ia(` Try on: `,-1),(Ui(!0),Ji(Li,null,br(a.prototype.tryGraphs,e=>(Ui(),Ji(`a`,{href:`#`,key:e,onClick:Io(t=>i.selectedGraph=e,[`prevent`])},ye(a.shortGraphName(e)),9,sC))),128))])):aa(``,!0),(Ui(!0),Ji(Li,null,br(a.prototype.params||[],e=>(Ui(),Yi(s,{key:e.key,label:e.label,step:e.step||`0.1`,modelValue:i.prototypeParams[e.key],"onUpdate:modelValue":t=>i.prototypeParams[e.key]=t},{default:On(()=>[ia(ye(e.help),1)]),_:2},1032,[`label`,`step`,`modelValue`,`onUpdate:modelValue`]))),128)),i.stats&&i.stats.canFinishPrototype?(Ui(),Ji(`a`,{key:3,href:`#`,class:`finish`,onClick:t[23]||=Io((...e)=>a.finishPrototype&&a.finishPrototype(...e),[`prevent`])},ye(a.prototype.finishLabel||`Run final step`),1)):aa(``,!0)])],64)):aa(``,!0)])):aa(``,!0)])}var lC=kv(LS,[[`render`,cC]]);function uC(e,t){return e.addEventListener(`drop`,i,!0),e.addEventListener(`dragover`,a),e.addEventListener(`dragenter`,r),e.addEventListener(`dragleave`,s),e.addEventListener(`dragend`,s),{dispose:n};function n(){e.removeEventListener(`drop`,i),e.removeEventListener(`dragover`,a),e.removeEventListener(`dragenter`,r),e.removeEventListener(`dragleave`,s),e.removeEventListener(`dragend`,s)}function r(e){o(e)&&e.preventDefault()}function i(e){s(),e.preventDefault();var n=e.dataTransfer,r=[],i,a;if(n.items)for(i=0;i<n.items.length;i++)n.items[i].kind==`file`&&(a=n.items[i].getAsFile(),r.push(a));else for(i=0;i<n.files.length;i++)a=n.files[i],r.push(a);t(r)}function a(t){o(t)&&(t.preventDefault(),e.classList.add(`drag-over`))}function o(e){if(!e.dataTransfer)return!1;if(e.dataTransfer.files&&e.dataTransfer.files.length>0)return!0;var t=e.dataTransfer.items;if(!t)return!1;for(var n=0;n<t.length;++n)if(t[n].kind===`file`)return!0;return!1}function s(){e.classList.remove(`drag-over`)}}var dC=o(((e,t)=>{function n(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}function r(e,t,n,i){this.message=e,this.expected=t,this.found=n,this.location=i,this.name=`SyntaxError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,r)}n(r,Error),r.buildMessage=function(e,t){var n={literal:function(e){return`"`+i(e.text)+`"`},class:function(e){for(var t=``,n=0;n<e.parts.length;n++)t+=e.parts[n]instanceof Array?a(e.parts[n][0])+`-`+a(e.parts[n][1]):a(e.parts[n]);return`[`+(e.inverted?`^`:``)+t+`]`},any:function(e){return`any character`},end:function(e){return`end of input`},other:function(e){return e.description}};function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function i(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function a(e){return e.replace(/\\/g,`\\\\`).replace(/\]/g,`\\]`).replace(/\^/g,`\\^`).replace(/-/g,`\\-`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function o(e){return n[e.type](e)}function s(e){for(var t=Array(e.length),n=0,r;n<e.length;n++)t[n]=o(e[n]);if(t.sort(),t.length>0){for(n=1,r=1;n<t.length;n++)t[n-1]!==t[n]&&(t[r]=t[n],r++);t.length=r}switch(t.length){case 1:return t[0];case 2:return t[0]+` or `+t[1];default:return t.slice(0,-1).join(`, `)+`, or `+t[t.length-1]}}function c(e){return e?`"`+i(e)+`"`:`end of input`}return`Expected `+s(e)+` but `+c(t)+` found.`};function i(e,t){t=t===void 0?{}:t;var n={},i={start:hn},a=hn,o=`strict`,s=sn(`strict`,!0),c=`graph`,l=sn(`graph`,!0),u=`digraph`,d=sn(`digraph`,!0),f=`{`,p=sn(`{`,!1),m=`}`,h=sn(`}`,!1),g=function(e,t,n,r){r===null&&(r=[]);var i={type:t.toLowerCase(),children:r};return e&&(i.strict=!0),n&&(i.id=n),i},_=`;`,v=sn(`;`,!1),y=function(e,t){return t},b=function(e,t){return[e].concat(t)},x=`=`,S=sn(`=`,!1),C=function(e,t){return{type:`attr_stmt`,target:`graph`,attr_list:[{type:`attr`,id:e,eq:t}]}},w=`node`,T=sn(`node`,!0),E=`edge`,D=sn(`edge`,!0),O=function(e,t){return{type:`attr_stmt`,target:e,attr_list:t}},k=`[`,A=sn(`[`,!1),j=`]`,M=sn(`]`,!1),N=function(e,t){return(e||[]).concat(t||[])},P=function(e,t){return t},F=`,`,I=sn(`,`,!1),L=function(e,t,n){return[{type:`attr`,id:e,eq:t}].concat(n||[])},R=function(e,t,n){var r=[e];return r=r.concat(t.map(function(e){return e.id})),{type:`edge_stmt`,edge_list:r,attr_list:n||[]}},z=`->`,ee=sn(`->`,!1),B=`--`,te=sn(`--`,!1),ne=function(e,t,n){return[{type:`edgeRHS`,edgeop:e,id:t}].concat(n||[])},re=function(e,t){return{type:`node_stmt`,node_id:e,attr_list:t||[]}},ie=function(e,t){return t?{type:`node_id`,id:e,port:t}:{type:`node_id`,id:e}},ae=dn(`port`),V=`:`,oe=sn(`:`,!1),se=function(e,t){return t},ce=function(e,t){return{type:`port`,id:e,compass_pt:t||null}},H=function(e){return{type:`port`,compass_pt:e||null}},U=`subgraph`,le=sn(`subgraph`,!0),ue=function(e){return e?{type:`subgraph`,id:e}:{type:`subgraph`}},W=function(e,t){return e||={type:`subgraph`},e.children=t||[],e},de=`n`,fe=sn(`n`,!1),pe=`ne`,me=sn(`ne`,!1),he=`e`,ge=sn(`e`,!1),_e=`se`,ve=sn(`se`,!1),ye=`s`,be=sn(`s`,!1),xe=`sw`,Se=sn(`sw`,!1),Ce=`w`,we=sn(`w`,!1),Te=`nw`,Ee=sn(`nw`,!1),De=dn(`UNICODE_STRING`),Oe=function(e,t){return e+t.join(``)},ke=function(e,t){return e+t},Ae=`$`,je=sn(`$`,!1),Me=`_`,Ne=sn(`_`,!1),Pe=dn(`NUMBER`),Fe=`-`,Ie=sn(`-`,!1),Le=`.`,Re=sn(`.`,!1),ze=/^[0-9]/,Be=cn([[`0`,`9`]],!1,!1),Ve=function(e){return parseFloat(on())},He=function(e){return{type:`id`,value:e.slice(1,e.length-1),html:!0}},Ue=`<`,We=sn(`<`,!1),Ge=`>`,Ke=sn(`>`,!1),qe=function(e){return`<`+e.join(``)+`>`},Je=ln(),Ye=function(e){return e},Xe=function(e){return e.join(``)},Ze=`"`,Qe=sn(`"`,!1),$e=function(e){return e.join(``)},et=function(){return on()},tt=`\\`,nt=sn(`\\`,!1),rt=function(e){return e[1]===`"`?`"`:e[0]+e[1]},it=function(){return``},at=/^[\n\r\u2028\u2029]/,ot=cn([`
`,`\r`,`\u2028`,`\u2029`],!1,!1),st=dn(`end of line`),ct=`
`,lt=sn(`
`,!1),ut=`\r
`,dt=sn(`\r
`,!1),ft=`\r`,pt=sn(`\r`,!1),mt=`\u2028`,ht=sn(`\u2028`,!1),gt=`\u2029`,_t=sn(`\u2029`,!1),vt=dn(`COMMENT`),yt=dn(`BLOCK_COMMENT`),bt=`/*`,xt=sn(`/*`,!1),St=`*/`,Ct=sn(`*/`,!1),wt=function(e){return e},Tt=function(e){return e.join(``)},Et=dn(`C_COMMENT`),Dt=`//`,Ot=sn(`//`,!1),kt=/^[\n]/,At=cn([`
`],!1,!1),jt=function(e){return e.join(``)},Mt=dn(`MACRO_COMMENT`),Nt=`#`,Pt=sn(`#`,!1),Ft=dn(`WHITESPACE`),It=/^[\n\r]/,Lt=cn([`
`,`\r`],!1,!1),Rt=/^[ \t]/,zt=cn([` `,`	`],!1,!1),Bt=/^[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137-\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148-\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C-\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA-\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9-\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC-\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF-\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F-\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0-\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB-\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE-\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6-\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FC7\u1FD0-\u1FD3\u1FD6-\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6-\u1FF7\u210A\u210E-\u210F\u2113\u212F\u2134\u2139\u213C-\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65-\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73-\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3-\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]/,Vt=cn([[`a`,`z`],`µ`,[`ß`,`ö`],[`ø`,`ÿ`],`ā`,`ă`,`ą`,`ć`,`ĉ`,`ċ`,`č`,`ď`,`đ`,`ē`,`ĕ`,`ė`,`ę`,`ě`,`ĝ`,`ğ`,`ġ`,`ģ`,`ĥ`,`ħ`,`ĩ`,`ī`,`ĭ`,`į`,`ı`,`ĳ`,`ĵ`,[`ķ`,`ĸ`],`ĺ`,`ļ`,`ľ`,`ŀ`,`ł`,`ń`,`ņ`,[`ň`,`ŉ`],`ŋ`,`ō`,`ŏ`,`ő`,`œ`,`ŕ`,`ŗ`,`ř`,`ś`,`ŝ`,`ş`,`š`,`ţ`,`ť`,`ŧ`,`ũ`,`ū`,`ŭ`,`ů`,`ű`,`ų`,`ŵ`,`ŷ`,`ź`,`ż`,[`ž`,`ƀ`],`ƃ`,`ƅ`,`ƈ`,[`ƌ`,`ƍ`],`ƒ`,`ƕ`,[`ƙ`,`ƛ`],`ƞ`,`ơ`,`ƣ`,`ƥ`,`ƨ`,[`ƪ`,`ƫ`],`ƭ`,`ư`,`ƴ`,`ƶ`,[`ƹ`,`ƺ`],[`ƽ`,`ƿ`],`ǆ`,`ǉ`,`ǌ`,`ǎ`,`ǐ`,`ǒ`,`ǔ`,`ǖ`,`ǘ`,`ǚ`,[`ǜ`,`ǝ`],`ǟ`,`ǡ`,`ǣ`,`ǥ`,`ǧ`,`ǩ`,`ǫ`,`ǭ`,[`ǯ`,`ǰ`],`ǳ`,`ǵ`,`ǹ`,`ǻ`,`ǽ`,`ǿ`,`ȁ`,`ȃ`,`ȅ`,`ȇ`,`ȉ`,`ȋ`,`ȍ`,`ȏ`,`ȑ`,`ȓ`,`ȕ`,`ȗ`,`ș`,`ț`,`ȝ`,`ȟ`,`ȡ`,`ȣ`,`ȥ`,`ȧ`,`ȩ`,`ȫ`,`ȭ`,`ȯ`,`ȱ`,[`ȳ`,`ȹ`],`ȼ`,[`ȿ`,`ɀ`],`ɂ`,`ɇ`,`ɉ`,`ɋ`,`ɍ`,[`ɏ`,`ʓ`],[`ʕ`,`ʯ`],`ͱ`,`ͳ`,`ͷ`,[`ͻ`,`ͽ`],`ΐ`,[`ά`,`ώ`],[`ϐ`,`ϑ`],[`ϕ`,`ϗ`],`ϙ`,`ϛ`,`ϝ`,`ϟ`,`ϡ`,`ϣ`,`ϥ`,`ϧ`,`ϩ`,`ϫ`,`ϭ`,[`ϯ`,`ϳ`],`ϵ`,`ϸ`,[`ϻ`,`ϼ`],[`а`,`џ`],`ѡ`,`ѣ`,`ѥ`,`ѧ`,`ѩ`,`ѫ`,`ѭ`,`ѯ`,`ѱ`,`ѳ`,`ѵ`,`ѷ`,`ѹ`,`ѻ`,`ѽ`,`ѿ`,`ҁ`,`ҋ`,`ҍ`,`ҏ`,`ґ`,`ғ`,`ҕ`,`җ`,`ҙ`,`қ`,`ҝ`,`ҟ`,`ҡ`,`ң`,`ҥ`,`ҧ`,`ҩ`,`ҫ`,`ҭ`,`ү`,`ұ`,`ҳ`,`ҵ`,`ҷ`,`ҹ`,`һ`,`ҽ`,`ҿ`,`ӂ`,`ӄ`,`ӆ`,`ӈ`,`ӊ`,`ӌ`,[`ӎ`,`ӏ`],`ӑ`,`ӓ`,`ӕ`,`ӗ`,`ә`,`ӛ`,`ӝ`,`ӟ`,`ӡ`,`ӣ`,`ӥ`,`ӧ`,`ө`,`ӫ`,`ӭ`,`ӯ`,`ӱ`,`ӳ`,`ӵ`,`ӷ`,`ӹ`,`ӻ`,`ӽ`,`ӿ`,`ԁ`,`ԃ`,`ԅ`,`ԇ`,`ԉ`,`ԋ`,`ԍ`,`ԏ`,`ԑ`,`ԓ`,`ԕ`,`ԗ`,`ԙ`,`ԛ`,`ԝ`,`ԟ`,`ԡ`,`ԣ`,`ԥ`,`ԧ`,[`ա`,`և`],[`ᴀ`,`ᴫ`],[`ᵫ`,`ᵷ`],[`ᵹ`,`ᶚ`],`ḁ`,`ḃ`,`ḅ`,`ḇ`,`ḉ`,`ḋ`,`ḍ`,`ḏ`,`ḑ`,`ḓ`,`ḕ`,`ḗ`,`ḙ`,`ḛ`,`ḝ`,`ḟ`,`ḡ`,`ḣ`,`ḥ`,`ḧ`,`ḩ`,`ḫ`,`ḭ`,`ḯ`,`ḱ`,`ḳ`,`ḵ`,`ḷ`,`ḹ`,`ḻ`,`ḽ`,`ḿ`,`ṁ`,`ṃ`,`ṅ`,`ṇ`,`ṉ`,`ṋ`,`ṍ`,`ṏ`,`ṑ`,`ṓ`,`ṕ`,`ṗ`,`ṙ`,`ṛ`,`ṝ`,`ṟ`,`ṡ`,`ṣ`,`ṥ`,`ṧ`,`ṩ`,`ṫ`,`ṭ`,`ṯ`,`ṱ`,`ṳ`,`ṵ`,`ṷ`,`ṹ`,`ṻ`,`ṽ`,`ṿ`,`ẁ`,`ẃ`,`ẅ`,`ẇ`,`ẉ`,`ẋ`,`ẍ`,`ẏ`,`ẑ`,`ẓ`,[`ẕ`,`ẝ`],`ẟ`,`ạ`,`ả`,`ấ`,`ầ`,`ẩ`,`ẫ`,`ậ`,`ắ`,`ằ`,`ẳ`,`ẵ`,`ặ`,`ẹ`,`ẻ`,`ẽ`,`ế`,`ề`,`ể`,`ễ`,`ệ`,`ỉ`,`ị`,`ọ`,`ỏ`,`ố`,`ồ`,`ổ`,`ỗ`,`ộ`,`ớ`,`ờ`,`ở`,`ỡ`,`ợ`,`ụ`,`ủ`,`ứ`,`ừ`,`ử`,`ữ`,`ự`,`ỳ`,`ỵ`,`ỷ`,`ỹ`,`ỻ`,`ỽ`,[`ỿ`,`ἇ`],[`ἐ`,`ἕ`],[`ἠ`,`ἧ`],[`ἰ`,`ἷ`],[`ὀ`,`ὅ`],[`ὐ`,`ὗ`],[`ὠ`,`ὧ`],[`ὰ`,`ώ`],[`ᾀ`,`ᾇ`],[`ᾐ`,`ᾗ`],[`ᾠ`,`ᾧ`],[`ᾰ`,`ᾴ`],[`ᾶ`,`ᾷ`],`ι`,[`ῂ`,`ῄ`],[`ῆ`,`ῇ`],[`ῐ`,`ΐ`],[`ῖ`,`ῗ`],[`ῠ`,`ῧ`],[`ῲ`,`ῴ`],[`ῶ`,`ῷ`],`ℊ`,[`ℎ`,`ℏ`],`ℓ`,`ℯ`,`ℴ`,`ℹ`,[`ℼ`,`ℽ`],[`ⅆ`,`ⅉ`],`ⅎ`,`ↄ`,[`ⰰ`,`ⱞ`],`ⱡ`,[`ⱥ`,`ⱦ`],`ⱨ`,`ⱪ`,`ⱬ`,`ⱱ`,[`ⱳ`,`ⱴ`],[`ⱶ`,`ⱻ`],`ⲁ`,`ⲃ`,`ⲅ`,`ⲇ`,`ⲉ`,`ⲋ`,`ⲍ`,`ⲏ`,`ⲑ`,`ⲓ`,`ⲕ`,`ⲗ`,`ⲙ`,`ⲛ`,`ⲝ`,`ⲟ`,`ⲡ`,`ⲣ`,`ⲥ`,`ⲧ`,`ⲩ`,`ⲫ`,`ⲭ`,`ⲯ`,`ⲱ`,`ⲳ`,`ⲵ`,`ⲷ`,`ⲹ`,`ⲻ`,`ⲽ`,`ⲿ`,`ⳁ`,`ⳃ`,`ⳅ`,`ⳇ`,`ⳉ`,`ⳋ`,`ⳍ`,`ⳏ`,`ⳑ`,`ⳓ`,`ⳕ`,`ⳗ`,`ⳙ`,`ⳛ`,`ⳝ`,`ⳟ`,`ⳡ`,[`ⳣ`,`ⳤ`],`ⳬ`,`ⳮ`,`ⳳ`,[`ⴀ`,`ⴥ`],`ⴧ`,`ⴭ`,`ꙁ`,`ꙃ`,`ꙅ`,`ꙇ`,`ꙉ`,`ꙋ`,`ꙍ`,`ꙏ`,`ꙑ`,`ꙓ`,`ꙕ`,`ꙗ`,`ꙙ`,`ꙛ`,`ꙝ`,`ꙟ`,`ꙡ`,`ꙣ`,`ꙥ`,`ꙧ`,`ꙩ`,`ꙫ`,`ꙭ`,`ꚁ`,`ꚃ`,`ꚅ`,`ꚇ`,`ꚉ`,`ꚋ`,`ꚍ`,`ꚏ`,`ꚑ`,`ꚓ`,`ꚕ`,`ꚗ`,`ꜣ`,`ꜥ`,`ꜧ`,`ꜩ`,`ꜫ`,`ꜭ`,[`ꜯ`,`ꜱ`],`ꜳ`,`ꜵ`,`ꜷ`,`ꜹ`,`ꜻ`,`ꜽ`,`ꜿ`,`ꝁ`,`ꝃ`,`ꝅ`,`ꝇ`,`ꝉ`,`ꝋ`,`ꝍ`,`ꝏ`,`ꝑ`,`ꝓ`,`ꝕ`,`ꝗ`,`ꝙ`,`ꝛ`,`ꝝ`,`ꝟ`,`ꝡ`,`ꝣ`,`ꝥ`,`ꝧ`,`ꝩ`,`ꝫ`,`ꝭ`,`ꝯ`,[`ꝱ`,`ꝸ`],`ꝺ`,`ꝼ`,`ꝿ`,`ꞁ`,`ꞃ`,`ꞅ`,`ꞇ`,`ꞌ`,`ꞎ`,`ꞑ`,`ꞓ`,`ꞡ`,`ꞣ`,`ꞥ`,`ꞧ`,`ꞩ`,`ꟺ`,[`ﬀ`,`ﬆ`],[`ﬓ`,`ﬗ`],[`ａ`,`ｚ`]],!1,!1),Ht=/^[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5-\u06E6\u07F4-\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C-\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D-\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8-\uA7F9\uA9CF\uAA70\uAADD\uAAF3-\uAAF4\uFF70\uFF9E-\uFF9F]/,Ut=cn([[`ʰ`,`ˁ`],[`ˆ`,`ˑ`],[`ˠ`,`ˤ`],`ˬ`,`ˮ`,`ʹ`,`ͺ`,`ՙ`,`ـ`,[`ۥ`,`ۦ`],[`ߴ`,`ߵ`],`ߺ`,`ࠚ`,`ࠤ`,`ࠨ`,`ॱ`,`ๆ`,`ໆ`,`ჼ`,`ៗ`,`ᡃ`,`ᪧ`,[`ᱸ`,`ᱽ`],[`ᴬ`,`ᵪ`],`ᵸ`,[`ᶛ`,`ᶿ`],`ⁱ`,`ⁿ`,[`ₐ`,`ₜ`],[`ⱼ`,`ⱽ`],`ⵯ`,`ⸯ`,`々`,[`〱`,`〵`],`〻`,[`ゝ`,`ゞ`],[`ー`,`ヾ`],`ꀕ`,[`ꓸ`,`ꓽ`],`ꘌ`,`ꙿ`,[`ꜗ`,`ꜟ`],`ꝰ`,`ꞈ`,[`ꟸ`,`ꟹ`],`ꧏ`,`ꩰ`,`ꫝ`,[`ꫳ`,`ꫴ`],`ｰ`,[`ﾞ`,`ﾟ`]],!1,!1),Wt=/^[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A-\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,Gt=cn([`ª`,`º`,`ƻ`,[`ǀ`,`ǃ`],`ʔ`,[`א`,`ת`],[`װ`,`ײ`],[`ؠ`,`ؿ`],[`ف`,`ي`],[`ٮ`,`ٯ`],[`ٱ`,`ۓ`],`ە`,[`ۮ`,`ۯ`],[`ۺ`,`ۼ`],`ۿ`,`ܐ`,[`ܒ`,`ܯ`],[`ݍ`,`ޥ`],`ޱ`,[`ߊ`,`ߪ`],[`ࠀ`,`ࠕ`],[`ࡀ`,`ࡘ`],`ࢠ`,[`ࢢ`,`ࢬ`],[`ऄ`,`ह`],`ऽ`,`ॐ`,[`क़`,`ॡ`],[`ॲ`,`ॷ`],[`ॹ`,`ॿ`],[`অ`,`ঌ`],[`এ`,`ঐ`],[`ও`,`ন`],[`প`,`র`],`ল`,[`শ`,`হ`],`ঽ`,`ৎ`,[`ড়`,`ঢ়`],[`য়`,`ৡ`],[`ৰ`,`ৱ`],[`ਅ`,`ਊ`],[`ਏ`,`ਐ`],[`ਓ`,`ਨ`],[`ਪ`,`ਰ`],[`ਲ`,`ਲ਼`],[`ਵ`,`ਸ਼`],[`ਸ`,`ਹ`],[`ਖ਼`,`ੜ`],`ਫ਼`,[`ੲ`,`ੴ`],[`અ`,`ઍ`],[`એ`,`ઑ`],[`ઓ`,`ન`],[`પ`,`ર`],[`લ`,`ળ`],[`વ`,`હ`],`ઽ`,`ૐ`,[`ૠ`,`ૡ`],[`ଅ`,`ଌ`],[`ଏ`,`ଐ`],[`ଓ`,`ନ`],[`ପ`,`ର`],[`ଲ`,`ଳ`],[`ଵ`,`ହ`],`ଽ`,[`ଡ଼`,`ଢ଼`],[`ୟ`,`ୡ`],`ୱ`,`ஃ`,[`அ`,`ஊ`],[`எ`,`ஐ`],[`ஒ`,`க`],[`ங`,`ச`],`ஜ`,[`ஞ`,`ட`],[`ண`,`த`],[`ந`,`ப`],[`ம`,`ஹ`],`ௐ`,[`అ`,`ఌ`],[`ఎ`,`ఐ`],[`ఒ`,`న`],[`ప`,`ళ`],[`వ`,`హ`],`ఽ`,[`ౘ`,`ౙ`],[`ౠ`,`ౡ`],[`ಅ`,`ಌ`],[`ಎ`,`ಐ`],[`ಒ`,`ನ`],[`ಪ`,`ಳ`],[`ವ`,`ಹ`],`ಽ`,`ೞ`,[`ೠ`,`ೡ`],[`ೱ`,`ೲ`],[`അ`,`ഌ`],[`എ`,`ഐ`],[`ഒ`,`ഺ`],`ഽ`,`ൎ`,[`ൠ`,`ൡ`],[`ൺ`,`ൿ`],[`අ`,`ඖ`],[`ක`,`න`],[`ඳ`,`ර`],`ල`,[`ව`,`ෆ`],[`ก`,`ะ`],[`า`,`ำ`],[`เ`,`ๅ`],[`ກ`,`ຂ`],`ຄ`,[`ງ`,`ຈ`],`ຊ`,`ຍ`,[`ດ`,`ທ`],[`ນ`,`ຟ`],[`ມ`,`ຣ`],`ລ`,`ວ`,[`ສ`,`ຫ`],[`ອ`,`ະ`],[`າ`,`ຳ`],`ຽ`,[`ເ`,`ໄ`],[`ໜ`,`ໟ`],`ༀ`,[`ཀ`,`ཇ`],[`ཉ`,`ཬ`],[`ྈ`,`ྌ`],[`က`,`ဪ`],`ဿ`,[`ၐ`,`ၕ`],[`ၚ`,`ၝ`],`ၡ`,[`ၥ`,`ၦ`],[`ၮ`,`ၰ`],[`ၵ`,`ႁ`],`ႎ`,[`ა`,`ჺ`],[`ჽ`,`ቈ`],[`ቊ`,`ቍ`],[`ቐ`,`ቖ`],`ቘ`,[`ቚ`,`ቝ`],[`በ`,`ኈ`],[`ኊ`,`ኍ`],[`ነ`,`ኰ`],[`ኲ`,`ኵ`],[`ኸ`,`ኾ`],`ዀ`,[`ዂ`,`ዅ`],[`ወ`,`ዖ`],[`ዘ`,`ጐ`],[`ጒ`,`ጕ`],[`ጘ`,`ፚ`],[`ᎀ`,`ᎏ`],[`Ꭰ`,`Ᏼ`],[`ᐁ`,`ᙬ`],[`ᙯ`,`ᙿ`],[`ᚁ`,`ᚚ`],[`ᚠ`,`ᛪ`],[`ᜀ`,`ᜌ`],[`ᜎ`,`ᜑ`],[`ᜠ`,`ᜱ`],[`ᝀ`,`ᝑ`],[`ᝠ`,`ᝬ`],[`ᝮ`,`ᝰ`],[`ក`,`ឳ`],`ៜ`,[`ᠠ`,`ᡂ`],[`ᡄ`,`ᡷ`],[`ᢀ`,`ᢨ`],`ᢪ`,[`ᢰ`,`ᣵ`],[`ᤀ`,`ᤜ`],[`ᥐ`,`ᥭ`],[`ᥰ`,`ᥴ`],[`ᦀ`,`ᦫ`],[`ᧁ`,`ᧇ`],[`ᨀ`,`ᨖ`],[`ᨠ`,`ᩔ`],[`ᬅ`,`ᬳ`],[`ᭅ`,`ᭋ`],[`ᮃ`,`ᮠ`],[`ᮮ`,`ᮯ`],[`ᮺ`,`ᯥ`],[`ᰀ`,`ᰣ`],[`ᱍ`,`ᱏ`],[`ᱚ`,`ᱷ`],[`ᳩ`,`ᳬ`],[`ᳮ`,`ᳱ`],[`ᳵ`,`ᳶ`],[`ℵ`,`ℸ`],[`ⴰ`,`ⵧ`],[`ⶀ`,`ⶖ`],[`ⶠ`,`ⶦ`],[`ⶨ`,`ⶮ`],[`ⶰ`,`ⶶ`],[`ⶸ`,`ⶾ`],[`ⷀ`,`ⷆ`],[`ⷈ`,`ⷎ`],[`ⷐ`,`ⷖ`],[`ⷘ`,`ⷞ`],`〆`,`〼`,[`ぁ`,`ゖ`],`ゟ`,[`ァ`,`ヺ`],`ヿ`,[`ㄅ`,`ㄭ`],[`ㄱ`,`ㆎ`],[`ㆠ`,`ㆺ`],[`ㇰ`,`ㇿ`],[`㐀`,`䶵`],[`一`,`鿌`],[`ꀀ`,`ꀔ`],[`ꀖ`,`ꒌ`],[`ꓐ`,`ꓷ`],[`ꔀ`,`ꘋ`],[`ꘐ`,`ꘟ`],[`ꘪ`,`ꘫ`],`ꙮ`,[`ꚠ`,`ꛥ`],[`ꟻ`,`ꠁ`],[`ꠃ`,`ꠅ`],[`ꠇ`,`ꠊ`],[`ꠌ`,`ꠢ`],[`ꡀ`,`ꡳ`],[`ꢂ`,`ꢳ`],[`ꣲ`,`ꣷ`],`ꣻ`,[`ꤊ`,`ꤥ`],[`ꤰ`,`ꥆ`],[`ꥠ`,`ꥼ`],[`ꦄ`,`ꦲ`],[`ꨀ`,`ꨨ`],[`ꩀ`,`ꩂ`],[`ꩄ`,`ꩋ`],[`ꩠ`,`ꩯ`],[`ꩱ`,`ꩶ`],`ꩺ`,[`ꪀ`,`ꪯ`],`ꪱ`,[`ꪵ`,`ꪶ`],[`ꪹ`,`ꪽ`],`ꫀ`,`ꫂ`,[`ꫛ`,`ꫜ`],[`ꫠ`,`ꫪ`],`ꫲ`,[`ꬁ`,`ꬆ`],[`ꬉ`,`ꬎ`],[`ꬑ`,`ꬖ`],[`ꬠ`,`ꬦ`],[`ꬨ`,`ꬮ`],[`ꯀ`,`ꯢ`],[`가`,`힣`],[`ힰ`,`ퟆ`],[`ퟋ`,`ퟻ`],[`豈`,`舘`],[`並`,`龎`],`יִ`,[`ײַ`,`ﬨ`],[`שׁ`,`זּ`],[`טּ`,`לּ`],`מּ`,[`נּ`,`סּ`],[`ףּ`,`פּ`],[`צּ`,`ﮱ`],[`ﯓ`,`ﴽ`],[`ﵐ`,`ﶏ`],[`ﶒ`,`ﷇ`],[`ﷰ`,`ﷻ`],[`ﹰ`,`ﹴ`],[`ﹶ`,`ﻼ`],[`ｦ`,`ｯ`],[`ｱ`,`ﾝ`],[`ﾠ`,`ﾾ`],[`ￂ`,`ￇ`],[`ￊ`,`ￏ`],[`ￒ`,`ￗ`],[`ￚ`,`ￜ`]],!1,!1),Kt=/^[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,qt=cn([`ǅ`,`ǈ`,`ǋ`,`ǲ`,[`ᾈ`,`ᾏ`],[`ᾘ`,`ᾟ`],[`ᾨ`,`ᾯ`],`ᾼ`,`ῌ`,`ῼ`],!1,!1),Jt=/^[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178-\u0179\u017B\u017D\u0181-\u0182\u0184\u0186-\u0187\u0189-\u018B\u018E-\u0191\u0193-\u0194\u0196-\u0198\u019C-\u019D\u019F-\u01A0\u01A2\u01A4\u01A6-\u01A7\u01A9\u01AC\u01AE-\u01AF\u01B1-\u01B3\u01B5\u01B7-\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A-\u023B\u023D-\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E-\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9-\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0-\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E-\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D-\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A]/,Yt=cn([[`A`,`Z`],[`À`,`Ö`],[`Ø`,`Þ`],`Ā`,`Ă`,`Ą`,`Ć`,`Ĉ`,`Ċ`,`Č`,`Ď`,`Đ`,`Ē`,`Ĕ`,`Ė`,`Ę`,`Ě`,`Ĝ`,`Ğ`,`Ġ`,`Ģ`,`Ĥ`,`Ħ`,`Ĩ`,`Ī`,`Ĭ`,`Į`,`İ`,`Ĳ`,`Ĵ`,`Ķ`,`Ĺ`,`Ļ`,`Ľ`,`Ŀ`,`Ł`,`Ń`,`Ņ`,`Ň`,`Ŋ`,`Ō`,`Ŏ`,`Ő`,`Œ`,`Ŕ`,`Ŗ`,`Ř`,`Ś`,`Ŝ`,`Ş`,`Š`,`Ţ`,`Ť`,`Ŧ`,`Ũ`,`Ū`,`Ŭ`,`Ů`,`Ű`,`Ų`,`Ŵ`,`Ŷ`,[`Ÿ`,`Ź`],`Ż`,`Ž`,[`Ɓ`,`Ƃ`],`Ƅ`,[`Ɔ`,`Ƈ`],[`Ɖ`,`Ƌ`],[`Ǝ`,`Ƒ`],[`Ɠ`,`Ɣ`],[`Ɩ`,`Ƙ`],[`Ɯ`,`Ɲ`],[`Ɵ`,`Ơ`],`Ƣ`,`Ƥ`,[`Ʀ`,`Ƨ`],`Ʃ`,`Ƭ`,[`Ʈ`,`Ư`],[`Ʊ`,`Ƴ`],`Ƶ`,[`Ʒ`,`Ƹ`],`Ƽ`,`Ǆ`,`Ǉ`,`Ǌ`,`Ǎ`,`Ǐ`,`Ǒ`,`Ǔ`,`Ǖ`,`Ǘ`,`Ǚ`,`Ǜ`,`Ǟ`,`Ǡ`,`Ǣ`,`Ǥ`,`Ǧ`,`Ǩ`,`Ǫ`,`Ǭ`,`Ǯ`,`Ǳ`,`Ǵ`,[`Ƕ`,`Ǹ`],`Ǻ`,`Ǽ`,`Ǿ`,`Ȁ`,`Ȃ`,`Ȅ`,`Ȇ`,`Ȉ`,`Ȋ`,`Ȍ`,`Ȏ`,`Ȑ`,`Ȓ`,`Ȕ`,`Ȗ`,`Ș`,`Ț`,`Ȝ`,`Ȟ`,`Ƞ`,`Ȣ`,`Ȥ`,`Ȧ`,`Ȩ`,`Ȫ`,`Ȭ`,`Ȯ`,`Ȱ`,`Ȳ`,[`Ⱥ`,`Ȼ`],[`Ƚ`,`Ⱦ`],`Ɂ`,[`Ƀ`,`Ɇ`],`Ɉ`,`Ɋ`,`Ɍ`,`Ɏ`,`Ͱ`,`Ͳ`,`Ͷ`,`Ά`,[`Έ`,`Ί`],`Ό`,[`Ύ`,`Ώ`],[`Α`,`Ρ`],[`Σ`,`Ϋ`],`Ϗ`,[`ϒ`,`ϔ`],`Ϙ`,`Ϛ`,`Ϝ`,`Ϟ`,`Ϡ`,`Ϣ`,`Ϥ`,`Ϧ`,`Ϩ`,`Ϫ`,`Ϭ`,`Ϯ`,`ϴ`,`Ϸ`,[`Ϲ`,`Ϻ`],[`Ͻ`,`Я`],`Ѡ`,`Ѣ`,`Ѥ`,`Ѧ`,`Ѩ`,`Ѫ`,`Ѭ`,`Ѯ`,`Ѱ`,`Ѳ`,`Ѵ`,`Ѷ`,`Ѹ`,`Ѻ`,`Ѽ`,`Ѿ`,`Ҁ`,`Ҋ`,`Ҍ`,`Ҏ`,`Ґ`,`Ғ`,`Ҕ`,`Җ`,`Ҙ`,`Қ`,`Ҝ`,`Ҟ`,`Ҡ`,`Ң`,`Ҥ`,`Ҧ`,`Ҩ`,`Ҫ`,`Ҭ`,`Ү`,`Ұ`,`Ҳ`,`Ҵ`,`Ҷ`,`Ҹ`,`Һ`,`Ҽ`,`Ҿ`,[`Ӏ`,`Ӂ`],`Ӄ`,`Ӆ`,`Ӈ`,`Ӊ`,`Ӌ`,`Ӎ`,`Ӑ`,`Ӓ`,`Ӕ`,`Ӗ`,`Ә`,`Ӛ`,`Ӝ`,`Ӟ`,`Ӡ`,`Ӣ`,`Ӥ`,`Ӧ`,`Ө`,`Ӫ`,`Ӭ`,`Ӯ`,`Ӱ`,`Ӳ`,`Ӵ`,`Ӷ`,`Ӹ`,`Ӻ`,`Ӽ`,`Ӿ`,`Ԁ`,`Ԃ`,`Ԅ`,`Ԇ`,`Ԉ`,`Ԋ`,`Ԍ`,`Ԏ`,`Ԑ`,`Ԓ`,`Ԕ`,`Ԗ`,`Ԙ`,`Ԛ`,`Ԝ`,`Ԟ`,`Ԡ`,`Ԣ`,`Ԥ`,`Ԧ`,[`Ա`,`Ֆ`],[`Ⴀ`,`Ⴥ`],`Ⴧ`,`Ⴭ`,`Ḁ`,`Ḃ`,`Ḅ`,`Ḇ`,`Ḉ`,`Ḋ`,`Ḍ`,`Ḏ`,`Ḑ`,`Ḓ`,`Ḕ`,`Ḗ`,`Ḙ`,`Ḛ`,`Ḝ`,`Ḟ`,`Ḡ`,`Ḣ`,`Ḥ`,`Ḧ`,`Ḩ`,`Ḫ`,`Ḭ`,`Ḯ`,`Ḱ`,`Ḳ`,`Ḵ`,`Ḷ`,`Ḹ`,`Ḻ`,`Ḽ`,`Ḿ`,`Ṁ`,`Ṃ`,`Ṅ`,`Ṇ`,`Ṉ`,`Ṋ`,`Ṍ`,`Ṏ`,`Ṑ`,`Ṓ`,`Ṕ`,`Ṗ`,`Ṙ`,`Ṛ`,`Ṝ`,`Ṟ`,`Ṡ`,`Ṣ`,`Ṥ`,`Ṧ`,`Ṩ`,`Ṫ`,`Ṭ`,`Ṯ`,`Ṱ`,`Ṳ`,`Ṵ`,`Ṷ`,`Ṹ`,`Ṻ`,`Ṽ`,`Ṿ`,`Ẁ`,`Ẃ`,`Ẅ`,`Ẇ`,`Ẉ`,`Ẋ`,`Ẍ`,`Ẏ`,`Ẑ`,`Ẓ`,`Ẕ`,`ẞ`,`Ạ`,`Ả`,`Ấ`,`Ầ`,`Ẩ`,`Ẫ`,`Ậ`,`Ắ`,`Ằ`,`Ẳ`,`Ẵ`,`Ặ`,`Ẹ`,`Ẻ`,`Ẽ`,`Ế`,`Ề`,`Ể`,`Ễ`,`Ệ`,`Ỉ`,`Ị`,`Ọ`,`Ỏ`,`Ố`,`Ồ`,`Ổ`,`Ỗ`,`Ộ`,`Ớ`,`Ờ`,`Ở`,`Ỡ`,`Ợ`,`Ụ`,`Ủ`,`Ứ`,`Ừ`,`Ử`,`Ữ`,`Ự`,`Ỳ`,`Ỵ`,`Ỷ`,`Ỹ`,`Ỻ`,`Ỽ`,`Ỿ`,[`Ἀ`,`Ἇ`],[`Ἐ`,`Ἕ`],[`Ἠ`,`Ἧ`],[`Ἰ`,`Ἷ`],[`Ὀ`,`Ὅ`],`Ὑ`,`Ὓ`,`Ὕ`,`Ὗ`,[`Ὠ`,`Ὧ`],[`Ᾰ`,`Ά`],[`Ὲ`,`Ή`],[`Ῐ`,`Ί`],[`Ῠ`,`Ῥ`],[`Ὸ`,`Ώ`],`ℂ`,`ℇ`,[`ℋ`,`ℍ`],[`ℐ`,`ℒ`],`ℕ`,[`ℙ`,`ℝ`],`ℤ`,`Ω`,`ℨ`,[`K`,`ℭ`],[`ℰ`,`ℳ`],[`ℾ`,`ℿ`],`ⅅ`,`Ↄ`,[`Ⰰ`,`Ⱞ`],`Ⱡ`,[`Ɫ`,`Ɽ`],`Ⱨ`,`Ⱪ`,`Ⱬ`,[`Ɑ`,`Ɒ`],`Ⱳ`,`Ⱶ`,[`Ȿ`,`Ⲁ`],`Ⲃ`,`Ⲅ`,`Ⲇ`,`Ⲉ`,`Ⲋ`,`Ⲍ`,`Ⲏ`,`Ⲑ`,`Ⲓ`,`Ⲕ`,`Ⲗ`,`Ⲙ`,`Ⲛ`,`Ⲝ`,`Ⲟ`,`Ⲡ`,`Ⲣ`,`Ⲥ`,`Ⲧ`,`Ⲩ`,`Ⲫ`,`Ⲭ`,`Ⲯ`,`Ⲱ`,`Ⲳ`,`Ⲵ`,`Ⲷ`,`Ⲹ`,`Ⲻ`,`Ⲽ`,`Ⲿ`,`Ⳁ`,`Ⳃ`,`Ⳅ`,`Ⳇ`,`Ⳉ`,`Ⳋ`,`Ⳍ`,`Ⳏ`,`Ⳑ`,`Ⳓ`,`Ⳕ`,`Ⳗ`,`Ⳙ`,`Ⳛ`,`Ⳝ`,`Ⳟ`,`Ⳡ`,`Ⳣ`,`Ⳬ`,`Ⳮ`,`Ⳳ`,`Ꙁ`,`Ꙃ`,`Ꙅ`,`Ꙇ`,`Ꙉ`,`Ꙋ`,`Ꙍ`,`Ꙏ`,`Ꙑ`,`Ꙓ`,`Ꙕ`,`Ꙗ`,`Ꙙ`,`Ꙛ`,`Ꙝ`,`Ꙟ`,`Ꙡ`,`Ꙣ`,`Ꙥ`,`Ꙧ`,`Ꙩ`,`Ꙫ`,`Ꙭ`,`Ꚁ`,`Ꚃ`,`Ꚅ`,`Ꚇ`,`Ꚉ`,`Ꚋ`,`Ꚍ`,`Ꚏ`,`Ꚑ`,`Ꚓ`,`Ꚕ`,`Ꚗ`,`Ꜣ`,`Ꜥ`,`Ꜧ`,`Ꜩ`,`Ꜫ`,`Ꜭ`,`Ꜯ`,`Ꜳ`,`Ꜵ`,`Ꜷ`,`Ꜹ`,`Ꜻ`,`Ꜽ`,`Ꜿ`,`Ꝁ`,`Ꝃ`,`Ꝅ`,`Ꝇ`,`Ꝉ`,`Ꝋ`,`Ꝍ`,`Ꝏ`,`Ꝑ`,`Ꝓ`,`Ꝕ`,`Ꝗ`,`Ꝙ`,`Ꝛ`,`Ꝝ`,`Ꝟ`,`Ꝡ`,`Ꝣ`,`Ꝥ`,`Ꝧ`,`Ꝩ`,`Ꝫ`,`Ꝭ`,`Ꝯ`,`Ꝺ`,`Ꝼ`,[`Ᵹ`,`Ꝿ`],`Ꞁ`,`Ꞃ`,`Ꞅ`,`Ꞇ`,`Ꞌ`,`Ɥ`,`Ꞑ`,`Ꞓ`,`Ꞡ`,`Ꞣ`,`Ꞥ`,`Ꞧ`,`Ꞩ`,`Ɦ`,[`Ａ`,`Ｚ`]],!1,!1),Xt=/^[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]/,Zt=cn([[`ᛮ`,`ᛰ`],[`Ⅰ`,`ↂ`],[`ↅ`,`ↈ`],`〇`,[`〡`,`〩`],[`〸`,`〺`],[`ꛦ`,`ꛯ`]],!1,!1),Qt=/^[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]/,$t=cn([[`0`,`9`],[`٠`,`٩`],[`۰`,`۹`],[`߀`,`߉`],[`०`,`९`],[`০`,`৯`],[`੦`,`੯`],[`૦`,`૯`],[`୦`,`୯`],[`௦`,`௯`],[`౦`,`౯`],[`೦`,`೯`],[`൦`,`൯`],[`๐`,`๙`],[`໐`,`໙`],[`༠`,`༩`],[`၀`,`၉`],[`႐`,`႙`],[`០`,`៩`],[`᠐`,`᠙`],[`᥆`,`᥏`],[`᧐`,`᧙`],[`᪀`,`᪉`],[`᪐`,`᪙`],[`᭐`,`᭙`],[`᮰`,`᮹`],[`᱀`,`᱉`],[`᱐`,`᱙`],[`꘠`,`꘩`],[`꣐`,`꣙`],[`꤀`,`꤉`],[`꧐`,`꧙`],[`꩐`,`꩙`],[`꯰`,`꯹`],[`０`,`９`]],!1,!1),G=0,en=0,tn=[{line:1,column:1}],nn=0,rn=[],K=0,an;if(`startRule`in t){if(!(t.startRule in i))throw Error(`Can't start parsing from rule "`+t.startRule+`".`);a=i[t.startRule]}function on(){return e.substring(en,G)}function sn(e,t){return{type:`literal`,text:e,ignoreCase:t}}function cn(e,t,n){return{type:`class`,parts:e,inverted:t,ignoreCase:n}}function ln(){return{type:`any`}}function un(){return{type:`end`}}function dn(e){return{type:`other`,description:e}}function fn(t){var n=tn[t],r;if(n)return n;for(r=t-1;!tn[r];)r--;for(n=tn[r],n={line:n.line,column:n.column};r<t;)e.charCodeAt(r)===10?(n.line++,n.column=1):n.column++,r++;return tn[t]=n,n}function pn(e,t){var n=fn(e),r=fn(t);return{start:{offset:e,line:n.line,column:n.column},end:{offset:t,line:r.line,column:r.column}}}function q(e){G<nn||(G>nn&&(nn=G,rn=[]),rn.push(e))}function mn(e,t,n){return new r(r.buildMessage(e,t),e,t,n)}function hn(){var e=[],t=gn();if(t!==n)for(;t!==n;)e.push(t),t=gn();else e=n;return e}function gn(){var t=G,r=Yn(),i,a,_,v,y,b,x,S,C,w,T;return r===n?(G=t,t=n):(e.substr(G,6).toLowerCase()===o?(i=e.substr(G,6),G+=6):(i=n,K===0&&q(s)),i===n&&(i=null),i===n?(G=t,t=n):(a=Yn(),a===n?(G=t,t=n):(e.substr(G,5).toLowerCase()===c?(_=e.substr(G,5),G+=5):(_=n,K===0&&q(l)),_===n&&(e.substr(G,7).toLowerCase()===u?(_=e.substr(G,7),G+=7):(_=n,K===0&&q(d))),_===n?(G=t,t=n):(v=Yn(),v===n?(G=t,t=n):(y=kn(),y===n&&(y=null),y===n?(G=t,t=n):(b=Yn(),b===n?(G=t,t=n):(e.charCodeAt(G)===123?(x=f,G++):(x=n,K===0&&q(p)),x===n?(G=t,t=n):(S=_n(),S===n&&(S=null),S===n?(G=t,t=n):(C=Yn(),C===n?(G=t,t=n):(e.charCodeAt(G)===125?(w=m,G++):(w=n,K===0&&q(h)),w===n?(G=t,t=n):(T=Yn(),T===n?(G=t,t=n):(en=t,r=g(i,_,y,S),t=r)))))))))))),t}function _n(){var t=G,r=Yn(),i,a,o,s,c,l,u,d,f;if(r!==n){if(i=vn(),i!==n){if(a=Yn(),a!==n){if(e.charCodeAt(G)===59?(o=_,G++):(o=n,K===0&&q(v)),o===n&&(o=null),o!==n){for(s=[],c=G,l=Yn(),l===n?(G=c,c=n):(u=vn(),u===n?(G=c,c=n):(d=Yn(),d===n?(G=c,c=n):(e.charCodeAt(G)===59?(f=_,G++):(f=n,K===0&&q(v)),f===n&&(f=null),f===n?(G=c,c=n):(en=c,l=y(i,u),c=l))));c!==n;)s.push(c),c=G,l=Yn(),l===n?(G=c,c=n):(u=vn(),u===n?(G=c,c=n):(d=Yn(),d===n?(G=c,c=n):(e.charCodeAt(G)===59?(f=_,G++):(f=n,K===0&&q(v)),f===n&&(f=null),f===n?(G=c,c=n):(en=c,l=y(i,u),c=l))));s===n?(G=t,t=n):(en=t,r=b(i,s),t=r)}else G=t,t=n}else G=t,t=n}else G=t,t=n}else G=t,t=n;return t}function vn(){var t=G,r=kn(),i,a,o,s;return r===n?(G=t,t=n):(i=Yn(),i===n?(G=t,t=n):(e.charCodeAt(G)===61?(a=x,G++):(a=n,K===0&&q(S)),a===n?(G=t,t=n):(o=Yn(),o===n?(G=t,t=n):(s=kn(),s===n?(G=t,t=n):(en=t,r=C(r,s),t=r))))),t===n&&(t=yn(),t===n&&(t=Sn(),t===n&&(t=Dn(),t===n&&(t=wn(),t===n&&(t=G,r=kn(),r===n?(G=t,t=n):(e.charCodeAt(G)===61?(i=x,G++):(i=n,K===0&&q(S)),i===n?(G=t,t=n):(a=kn(),a===n?(G=t,t=n):(r=[r,i,a],t=r)))))))),t}function yn(){var t=G,r,i;return e.substr(G,5).toLowerCase()===c?(r=e.substr(G,5),G+=5):(r=n,K===0&&q(l)),r===n&&(e.substr(G,4).toLowerCase()===w?(r=e.substr(G,4),G+=4):(r=n,K===0&&q(T)),r===n&&(e.substr(G,4).toLowerCase()===E?(r=e.substr(G,4),G+=4):(r=n,K===0&&q(D)))),r===n?(G=t,t=n):(i=bn(),i===n?(G=t,t=n):(en=t,r=O(r,i),t=r)),t}function bn(){var t=G,r=Yn(),i,a,o,s,c,l,u;return r===n?(G=t,t=n):(e.charCodeAt(G)===91?(i=k,G++):(i=n,K===0&&q(A)),i===n?(G=t,t=n):(a=Yn(),a===n?(G=t,t=n):(o=xn(),o===n&&(o=null),o===n?(G=t,t=n):(s=Yn(),s===n?(G=t,t=n):(e.charCodeAt(G)===93?(c=j,G++):(c=n,K===0&&q(M)),c===n?(G=t,t=n):(l=Yn(),l===n?(G=t,t=n):(u=bn(),u===n&&(u=null),u===n?(G=t,t=n):(en=t,r=N(o,u),t=r)))))))),t}function xn(){var t=G,r=Yn(),i,a,o,s,c,l;return r===n?(G=t,t=n):(i=kn(),i===n?(G=t,t=n):(a=G,o=Yn(),o===n?(G=a,a=n):(e.charCodeAt(G)===61?(s=x,G++):(s=n,K===0&&q(S)),s===n?(G=a,a=n):(c=Yn(),c===n?(G=a,a=n):(l=kn(),l===n?(G=a,a=n):(en=a,o=P(i,l),a=o)))),a===n&&(a=null),a===n?(G=t,t=n):(o=Yn(),o===n?(G=t,t=n):(e.charCodeAt(G)===44?(s=F,G++):(s=n,K===0&&q(I)),s===n&&(e.charCodeAt(G)===59?(s=_,G++):(s=n,K===0&&q(v))),s===n&&(s=null),s===n?(G=t,t=n):(c=xn(),c===n&&(c=null),c===n?(G=t,t=n):(en=t,r=L(i,a,c),t=r)))))),t}function Sn(){var e=G,t=Dn(),r,i;return t===n&&(t=Tn()),t===n?(G=e,e=n):(r=Cn(),r===n?(G=e,e=n):(i=bn(),i===n&&(i=null),i===n?(G=e,e=n):(en=e,t=R(t,r,i),e=t))),e}function Cn(){var t=G,r=Yn(),i,a,o,s,c;return r===n?(G=t,t=n):(e.substr(G,2)===z?(i=z,G+=2):(i=n,K===0&&q(ee)),i===n&&(e.substr(G,2)===B?(i=B,G+=2):(i=n,K===0&&q(te))),i===n?(G=t,t=n):(a=Yn(),a===n?(G=t,t=n):(o=Dn(),o===n&&(o=Tn()),o===n?(G=t,t=n):(s=Yn(),s===n?(G=t,t=n):(c=Cn(),c===n&&(c=null),c===n?(G=t,t=n):(en=t,r=ne(i,o,c),t=r)))))),t}function wn(){var e=G,t=Tn(),r;return t===n?(G=e,e=n):(r=bn(),r===n&&(r=null),r===n?(G=e,e=n):(en=e,t=re(t,r),e=t)),e}function Tn(){var e=G,t=kn(),r;return t===n?(G=e,e=n):(r=En(),r===n&&(r=null),r===n?(G=e,e=n):(en=e,t=ie(t,r),e=t)),e}function En(){var t,r,i,a,o,s;return K++,t=G,e.charCodeAt(G)===58?(r=V,G++):(r=n,K===0&&q(oe)),r===n?(G=t,t=n):(i=kn(),i===n?(G=t,t=n):(a=G,e.charCodeAt(G)===58?(o=V,G++):(o=n,K===0&&q(oe)),o===n?(G=a,a=n):(s=On(),s===n?(G=a,a=n):(en=a,o=se(i,s),a=o)),a===n&&(a=null),a===n?(G=t,t=n):(en=t,r=ce(i,a),t=r))),t===n&&(t=G,e.charCodeAt(G)===58?(r=V,G++):(r=n,K===0&&q(oe)),r===n?(G=t,t=n):(i=On(),i===n?(G=t,t=n):(en=t,r=H(i),t=r))),K--,t===n&&(r=n,K===0&&q(ae)),t}function Dn(){var t=G,r=G,i,a,o,s;return e.substr(G,8).toLowerCase()===U?(i=e.substr(G,8),G+=8):(i=n,K===0&&q(le)),i===n?(G=r,r=n):(a=Yn(),a===n?(G=r,r=n):(o=kn(),o===n&&(o=null),o===n?(G=r,r=n):(s=Yn(),s===n?(G=r,r=n):(en=r,i=ue(o),r=i)))),r===n&&(r=null),r===n?(G=t,t=n):(e.charCodeAt(G)===123?(i=f,G++):(i=n,K===0&&q(p)),i===n?(G=t,t=n):(a=_n(),a===n&&(a=null),a===n?(G=t,t=n):(o=Yn(),o===n?(G=t,t=n):(e.charCodeAt(G)===125?(s=m,G++):(s=n,K===0&&q(h)),s===n?(G=t,t=n):(en=t,r=W(r,a),t=r))))),t}function On(){var t;return e.charCodeAt(G)===110?(t=de,G++):(t=n,K===0&&q(fe)),t===n&&(e.substr(G,2)===pe?(t=pe,G+=2):(t=n,K===0&&q(me)),t===n&&(e.charCodeAt(G)===101?(t=he,G++):(t=n,K===0&&q(ge)),t===n&&(e.substr(G,2)===_e?(t=_e,G+=2):(t=n,K===0&&q(ve)),t===n&&(e.charCodeAt(G)===115?(t=ye,G++):(t=n,K===0&&q(be)),t===n&&(e.substr(G,2)===xe?(t=xe,G+=2):(t=n,K===0&&q(Se)),t===n&&(e.charCodeAt(G)===119?(t=Ce,G++):(t=n,K===0&&q(we)),t===n&&(e.substr(G,2)===Te?(t=Te,G+=2):(t=n,K===0&&q(Ee))))))))),t}function kn(){var e=An();return e===n&&(e=jn(),e===n&&(e=Pn(),e===n&&(e=Rn(),e===n&&(e=Fn())))),e}function An(){var e,t,r,i;if(K++,e=G,t=Mn(),t!==n){for(r=[],i=Nn();i!==n;)r.push(i),i=Nn();r===n?(G=e,e=n):(en=e,t=Oe(t,r),e=t)}else G=e,e=n;return K--,e===n&&(t=n,K===0&&q(De)),e}function jn(){var e=G,t=Pn(),r;return t===n?(G=e,e=n):(r=An(),r===n?(G=e,e=n):(en=e,t=ke(t,r),e=t)),e}function Mn(){var t=Qn();return t===n&&(e.charCodeAt(G)===36?(t=Ae,G++):(t=n,K===0&&q(je)),t===n&&(e.charCodeAt(G)===95?(t=Me,G++):(t=n,K===0&&q(Ne)))),t}function Nn(){var e=Mn();return e===n&&(e=ar()),e}function Pn(){var t,r,i,a,o,s,c,l,u;if(K++,t=G,r=G,e.charCodeAt(G)===45?(i=Fe,G++):(i=n,K===0&&q(Ie)),i===n&&(i=null),i!==n){if(a=G,e.charCodeAt(G)===46?(o=Le,G++):(o=n,K===0&&q(Re)),o!==n){if(s=[],ze.test(e.charAt(G))?(c=e.charAt(G),G++):(c=n,K===0&&q(Be)),c!==n)for(;c!==n;)s.push(c),ze.test(e.charAt(G))?(c=e.charAt(G),G++):(c=n,K===0&&q(Be));else s=n;s===n?(G=a,a=n):(o=[o,s],a=o)}else G=a,a=n;if(a===n){if(a=G,o=[],ze.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(Be)),s!==n)for(;s!==n;)o.push(s),ze.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(Be));else o=n;if(o!==n){if(s=G,e.charCodeAt(G)===46?(c=Le,G++):(c=n,K===0&&q(Re)),c!==n){for(l=[],ze.test(e.charAt(G))?(u=e.charAt(G),G++):(u=n,K===0&&q(Be));u!==n;)l.push(u),ze.test(e.charAt(G))?(u=e.charAt(G),G++):(u=n,K===0&&q(Be));l===n?(G=s,s=n):(c=[c,l],s=c)}else G=s,s=n;s===n&&(s=null),s===n?(G=a,a=n):(o=[o,s],a=o)}else G=a,a=n}a===n?(G=r,r=n):(i=[i,a],r=i)}else G=r,r=n;return r!==n&&(en=t,r=Ve(r)),t=r,K--,t===n&&(r=n,K===0&&q(Pe)),t}function Fn(){var e=G,t=In();return t!==n&&(en=e,t=He(t)),e=t,e}function In(){var t=G,r,i,a;if(e.charCodeAt(G)===60?(r=Ue,G++):(r=n,K===0&&q(We)),r!==n){for(i=[],a=Ln(),a===n&&(a=In());a!==n;)i.push(a),a=Ln(),a===n&&(a=In());i===n?(G=t,t=n):(e.charCodeAt(G)===62?(a=Ge,G++):(a=n,K===0&&q(Ke)),a===n?(G=t,t=n):(en=t,r=qe(i),t=r))}else G=t,t=n;return t}function Ln(){var t=G,r=[],i=G,a=G,o;if(K++,e.charCodeAt(G)===62?(o=Ge,G++):(o=n,K===0&&q(Ke)),o===n&&(e.charCodeAt(G)===60?(o=Ue,G++):(o=n,K===0&&q(We))),K--,o===n?a=void 0:(G=a,a=n),a===n?(G=i,i=n):(e.length>G?(o=e.charAt(G),G++):(o=n,K===0&&q(Je)),o===n?(G=i,i=n):(en=i,a=Ye(o),i=a)),i!==n)for(;i!==n;)r.push(i),i=G,a=G,K++,e.charCodeAt(G)===62?(o=Ge,G++):(o=n,K===0&&q(Ke)),o===n&&(e.charCodeAt(G)===60?(o=Ue,G++):(o=n,K===0&&q(We))),K--,o===n?a=void 0:(G=a,a=n),a===n?(G=i,i=n):(e.length>G?(o=e.charAt(G),G++):(o=n,K===0&&q(Je)),o===n?(G=i,i=n):(en=i,a=Ye(o),i=a));else r=n;return r!==n&&(en=t,r=Xe(r)),t=r,t}function Rn(){var t=G,r,i,a;if(e.charCodeAt(G)===34?(r=Ze,G++):(r=n,K===0&&q(Qe)),r!==n){for(i=[],a=zn();a!==n;)i.push(a),a=zn();i===n?(G=t,t=n):(e.charCodeAt(G)===34?(a=Ze,G++):(a=n,K===0&&q(Qe)),a===n?(G=t,t=n):(en=t,r=$e(i),t=r))}else G=t,t=n;return t}function zn(){var t=Bn(),r,i;return t===n&&(t=G,r=G,K++,e.charCodeAt(G)===34?(i=Ze,G++):(i=n,K===0&&q(Qe)),i===n&&(i=Hn()),K--,i===n?r=void 0:(G=r,r=n),r===n?(G=t,t=n):(i=Wn(),i===n?(G=t,t=n):(en=t,r=et(),t=r)),t===n&&(t=Vn())),t}function Bn(){var t=G,r=G,i,a;return e.charCodeAt(G)===92?(i=tt,G++):(i=n,K===0&&q(nt)),i===n?(G=r,r=n):(e.length>G?(a=e.charAt(G),G++):(a=n,K===0&&q(Je)),a===n?(G=r,r=n):(i=[i,a],r=i)),r!==n&&(en=t,r=rt(r)),t=r,t}function Vn(){var t=G,r,i;return e.charCodeAt(G)===92?(r=tt,G++):(r=n,K===0&&q(nt)),r===n?(G=t,t=n):(i=Un(),i===n?(G=t,t=n):(en=t,r=it(),t=r)),t}function Hn(){var t;return at.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(ot)),t}function Un(){var t;return K++,e.charCodeAt(G)===10?(t=ct,G++):(t=n,K===0&&q(lt)),t===n&&(e.substr(G,2)===ut?(t=ut,G+=2):(t=n,K===0&&q(dt)),t===n&&(e.charCodeAt(G)===13?(t=ft,G++):(t=n,K===0&&q(pt)),t===n&&(e.charCodeAt(G)===8232?(t=mt,G++):(t=n,K===0&&q(ht)),t===n&&(e.charCodeAt(G)===8233?(t=gt,G++):(t=n,K===0&&q(_t)))))),K--,t===n&&K===0&&q(st),t}function Wn(){var t;return e.length>G?(t=e.charAt(G),G++):(t=n,K===0&&q(Je)),t}function Gn(){var e;return K++,e=Kn(),e===n&&(e=qn(),e===n&&(e=Jn())),K--,e===n&&K===0&&q(vt),e}function Kn(){var t,r,i,a,o,s;if(K++,t=G,e.substr(G,2)===bt?(r=bt,G+=2):(r=n,K===0&&q(xt)),r!==n){for(i=[],a=G,o=G,K++,e.substr(G,2)===St?(s=St,G+=2):(s=n,K===0&&q(Ct)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=wt(s),a=o));a!==n;)i.push(a),a=G,o=G,K++,e.substr(G,2)===St?(s=St,G+=2):(s=n,K===0&&q(Ct)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=wt(s),a=o));i===n?(G=t,t=n):(e.substr(G,2)===St?(a=St,G+=2):(a=n,K===0&&q(Ct)),a===n?(G=t,t=n):(en=t,r=Tt(i),t=r))}else G=t,t=n;return K--,t===n&&(r=n,K===0&&q(yt)),t}function qn(){var t,r,i,a,o,s;if(K++,t=G,e.substr(G,2)===Dt?(r=Dt,G+=2):(r=n,K===0&&q(Ot)),r!==n){for(i=[],a=G,o=G,K++,kt.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(At)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=Ye(s),a=o));a!==n;)i.push(a),a=G,o=G,K++,kt.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(At)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=Ye(s),a=o));i===n?(G=t,t=n):(kt.test(e.charAt(G))?(a=e.charAt(G),G++):(a=n,K===0&&q(At)),a===n&&(a=null),a===n?(G=t,t=n):(en=t,r=jt(i),t=r))}else G=t,t=n;return K--,t===n&&(r=n,K===0&&q(Et)),t}function Jn(){var t,r,i,a,o,s;if(K++,t=G,e.charCodeAt(G)===35?(r=Nt,G++):(r=n,K===0&&q(Pt)),r!==n){for(i=[],a=G,o=G,K++,kt.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(At)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=Ye(s),a=o));a!==n;)i.push(a),a=G,o=G,K++,kt.test(e.charAt(G))?(s=e.charAt(G),G++):(s=n,K===0&&q(At)),K--,s===n?o=void 0:(G=o,o=n),o===n?(G=a,a=n):(e.length>G?(s=e.charAt(G),G++):(s=n,K===0&&q(Je)),s===n?(G=a,a=n):(en=a,o=Ye(s),a=o));i===n?(G=t,t=n):(kt.test(e.charAt(G))?(a=e.charAt(G),G++):(a=n,K===0&&q(At)),a===n&&(a=null),a===n?(G=t,t=n):(en=t,r=jt(i),t=r))}else G=t,t=n;return K--,t===n&&(r=n,K===0&&q(Mt)),t}function Yn(){var e,t;for(K++,e=[],t=Zn(),t===n&&(t=Gn());t!==n;)e.push(t),t=Zn(),t===n&&(t=Gn());return K--,e===n&&(t=n,K===0&&q(Ft)),e}function Xn(){var t=[],r;if(It.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,K===0&&q(Lt)),r!==n)for(;r!==n;)t.push(r),It.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,K===0&&q(Lt));else t=n;return t}function Zn(){var t=[],r;if(Rt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,K===0&&q(zt)),r===n&&(r=Xn()),r!==n)for(;r!==n;)t.push(r),Rt.test(e.charAt(G))?(r=e.charAt(G),G++):(r=n,K===0&&q(zt)),r===n&&(r=Xn());else t=n;return t}function Qn(){var e=rr();return e===n&&(e=$n(),e===n&&(e=nr(),e===n&&(e=er(),e===n&&(e=tr(),e===n&&(e=ir()))))),e}function $n(){var t;return Bt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(Vt)),t}function er(){var t;return Ht.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(Ut)),t}function tr(){var t;return Wt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(Gt)),t}function nr(){var t;return Kt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(qt)),t}function rr(){var t;return Jt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(Yt)),t}function ir(){var t;return Xt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q(Zt)),t}function ar(){var t;return Qt.test(e.charAt(G))?(t=e.charAt(G),G++):(t=n,K===0&&q($t)),t}if(an=a(),an!==n&&G===e.length)return an;throw an!==n&&G<e.length&&q(un()),mn(rn,nn<e.length?e.charAt(nn):null,nn<e.length?pn(nn,nn+1):pn(nn,nn))}t.exports={SyntaxError:r,parse:i}})),fC=o(((e,t)=>{t.exports=dC().parse})),pC=o(((e,t)=>{t.exports=r;var n=ov();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=L,m=L,h=L,g=L,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:ee,forEachLinkedNode:P,forEachLink:N,beginUpdate:h,endUpdate:g,clear:M,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=R,_.endUpdate=g=z,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function M(){h(),ee(function(e){C(e.id)}),g()}function N(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function P(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?I(r.links,e,t):F(r.links,e,t)}function F(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function I(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function L(){}function R(){u+=1}function z(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function ee(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),mC=o(((e,t)=>{t.exports=r;var n=fC();function r(e,t){var r=n(e);if(r.length>1&&t!==void 0)throw Error("Dot file contains multiple graphs. Cannot use `saveTo` in this case");return t||=pC()(),i(t,r[0])}function i(e,t){return a(e,t),e}function a(e,t){var n=t.children;if(!n)return e;for(var r=[],i=0;i<n.length;++i){var l=n[i];l.type===`edge_stmt`?c(r,o(e,l)):l.type===`node_stmt`?c(r,s(e,l)):l.type===`subgraph`&&c(r,a(e,l))}return r}function o(e,t){var n=t.edge_list;if(n.length!==0){var r=n[0],i=[],a=l(e,r);c(i,a);for(var o=d(t.attr_list),s=1;s<n.length;++s){var f=l(e,n[s]);c(i,f),u(e,a,f,o),a=f}return i}}function s(e,t){return l(e,t.node_id,t.attr_list)}function c(e,t){for(var n=0;n<t.length;++n)e.push(t[n]);return e}function l(e,t,n){if(t.type===`node_id`){var r=f(d(n),e.getNode(t.id));return r?e.addNode(t.id,r):e.addNode(t.id),[t.id]}if(t.type===`subgraph`)return a(e,t)}function u(e,t,n,r){for(var i=0;i<t.length;++i)for(var a=0;a<n.length;++a)e.addLink(t[i],n[a],r)}function d(e){if(e&&e.length){for(var t=Object.create(null),n=0;n<e.length;++n){var r=e[n];r.type===`attr`&&r.id!==void 0&&(t[r.id]=r.eq)}return t}}function f(e,t){return!t||!t.data?e:Object.assign(t.data,e)}})),hC=o(((e,t)=>{t.exports=r;var n=lv();function r(e,t,r,a){var o;t||=i,r||=i,o=typeof e==`string`?JSON.parse(e):e;var s=n(a),c;if(o.links===void 0||o.nodes===void 0)throw Error(`Cannot load graph without links and nodes`);for(c=0;c<o.nodes.length;++c){var l=t(o.nodes[c]);if(!l.hasOwnProperty(`id`))throw Error(`Graph node format is invalid: Node id is missing`);s.addNode(l.id,l.data)}for(c=0;c<o.links.length;++c){var u=r(o.links[c]);if(!u.hasOwnProperty(`fromId`)||!u.hasOwnProperty(`toId`))throw Error(`Graph link format is invalid. Both fromId and toId are required`);s.addLink(u.fromId,u.toId,u.data)}return s}function i(e){return e}})),gC=l(mC(),1),_C=l(hC(),1);function vC(e){let t=e[0];var n=new FileReader;n.readAsText(t,`UTF-8`),n.onload=e=>{let t=e.target.result,n=r(t)||i(t);n&&El.fire(`load-graph`,n)},n.onerror=e=>{console.log(`error loading dot file: `,e)};function r(e){try{return(0,gC.default)(e)}catch(e){console.log(`error loading dot file: `,e)}}function i(e){try{return(0,_C.default)(JSON.parse(e))}catch(e){console.log(`error loading JSON: `,e)}}}il(document.getElementById(`cnv`))?(Bo(lC).mount(`#app`),uC(document.body,vC)):document.body.classList.add(`no-webgl`);