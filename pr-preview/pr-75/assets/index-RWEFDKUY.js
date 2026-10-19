var e=Object.create,t=Object.defineProperty,n=Object.getOwnPropertyDescriptor,r=Object.getOwnPropertyNames,i=Object.getPrototypeOf,a=Object.prototype.hasOwnProperty,o=(e,t)=>()=>(t||(e((t={exports:{}}).exports,t,t.exports),e=null),t.exports),s=(e,i,o,s)=>{if(i&&typeof i==`object`||typeof i==`function`)for(var c=r(i),l=0,u=c.length,d;l<u;l++)d=c[l],!a.call(e,d)&&d!==o&&t(e,d,{get:(e=>i[e]).bind(null,d),enumerable:!(s=n(i,d))||s.enumerable});return e},c=(n,r,o)=>(o=n==null?{}:e(i(n)),s(r||!n||!n.__esModule||!a.call(n,`default`)?t(o,`default`,{value:n,enumerable:!0}):o,n));(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();function l(e){let t=Object.create(null);for(let n of e.split(`,`))t[n]=1;return e=>e in t}var u={},d=[],f=()=>{},p=()=>!1,m=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&(e.charCodeAt(2)>122||e.charCodeAt(2)<97),h=e=>e.startsWith(`onUpdate:`),g=Object.assign,_=(e,t)=>{let n=e.indexOf(t);n>-1&&e.splice(n,1)},v=Object.prototype.hasOwnProperty,y=(e,t)=>v.call(e,t),b=Array.isArray,x=e=>A(e)===`[object Map]`,S=e=>A(e)===`[object Set]`,C=e=>A(e)===`[object Date]`,w=e=>typeof e==`function`,T=e=>typeof e==`string`,E=e=>typeof e==`symbol`,D=e=>typeof e==`object`&&!!e,O=e=>(D(e)||w(e))&&w(e.then)&&w(e.catch),k=Object.prototype.toString,A=e=>k.call(e),j=e=>A(e).slice(8,-1),ee=e=>A(e)===`[object Object]`,M=e=>T(e)&&e!==`NaN`&&e[0]!==`-`&&``+parseInt(e,10)===e,N=l(`,key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted`),P=e=>{let t=Object.create(null);return(n=>t[n]||(t[n]=e(n)))},te=/-\w/g,F=P(e=>e.replace(te,e=>e.slice(1).toUpperCase())),I=/\B([A-Z])/g,ne=P(e=>e.replace(I,`-$1`).toLowerCase()),L=P(e=>e.charAt(0).toUpperCase()+e.slice(1)),R=P(e=>e?`on${L(e)}`:``),z=(e,t)=>!Object.is(e,t),re=(e,...t)=>{for(let n=0;n<e.length;n++)e[n](...t)},ie=(e,t,n,r=!1)=>{Object.defineProperty(e,t,{configurable:!0,enumerable:!1,writable:r,value:n})},ae=e=>{let t=parseFloat(e);return isNaN(t)?e:t},oe,se=()=>oe||=typeof globalThis<`u`?globalThis:typeof self<`u`?self:typeof window<`u`?window:typeof global<`u`?global:{};function B(e){if(b(e)){let t={};for(let n=0;n<e.length;n++){let r=e[n],i=T(r)?ue(r):B(r);if(i)for(let e in i)t[e]=i[e]}return t}if(T(e)||D(e))return e}var ce=/;(?![^(]*\))/g,le=/:([^]+)/,V=/"(?:[^"\\]|\\[^])*"|'(?:[^'\\]|\\[^])*'|\\[^]|\/\*[^]*?\*\//g;function ue(e){let t={};return e.replace(V,e=>e.startsWith(`/*`)?``:e).split(ce).forEach(e=>{if(e){let n=e.split(le);n.length>1&&(t[n[0].trim()]=n[1].trim())}}),t}function de(e){let t=``;if(T(e))t=e;else if(b(e))for(let n=0;n<e.length;n++){let r=de(e[n]);r&&(t+=r+` `)}else if(D(e))for(let n in e)e[n]&&(t+=n+` `);return t.trim()}var fe=l(`itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,playsinline,readonly`);function pe(e){return!!e||e===``}function me(e,t,n){if(e.length!==t.length)return!1;let r=!0;for(let i=0;r&&i<e.length;i++)r=ve(e[i],t[i],n);return r}function he(e,t,n){if(e.size!==t.size)return!1;let r=Array.from(t),i=new Uint8Array(r.length);for(let t of e){let e=-1;for(let a=0;a<r.length;a++)if(!i[a]&&ve(t,r[a],n)){e=a;break}if(e<0)return!1;i[e]=1}return!0}function ge(e,t,n){let r=x(e),i=x(t);if(r||i||(r=S(e),i=S(t),r||i))return r&&i?he(e,t,n):!1;if(Object.keys(e).length!==Object.keys(t).length)return!1;for(let r in e){let i=e.hasOwnProperty(r),a=t.hasOwnProperty(r);if(i&&!a||!i&&a||!ve(e[r],t[r],n))return!1}return String(e)===String(t)}function _e(e,t,n,r){n||=[new Map,new Map];let[i,a]=n;if(i.has(e)||a.has(t))return i.get(e)===t&&a.get(t)===e;i.set(e,t),a.set(t,e);let o=r(e,t,n);return i.delete(e),a.delete(t),o}function ve(e,t,n){if(e===t)return!0;let r=C(e),i=C(t);return r||i?r&&i?e.getTime()===t.getTime():!1:(r=E(e),i=E(t),r||i?e===t:(r=b(e),i=b(t),r||i?r&&i?_e(e,t,n,me):!1:(r=D(e),i=D(t),r||i?!r||!i?!1:_e(e,t,n,ge):String(e)===String(t))))}function ye(e,t){return e.findIndex(e=>ve(e,t))}var be=e=>!!(e&&e.__v_isRef===!0),xe=e=>T(e)?e:e==null?``:b(e)||D(e)&&(e.toString===k||!w(e.toString))?be(e)?xe(e.value):JSON.stringify(e,Se,2):String(e),Se=(e,t)=>be(t)?Se(e,t.value):x(t)?{[`Map(${t.size})`]:[...t.entries()].reduce((e,[t,n],r)=>(e[Ce(t,r)+` =>`]=n,e),{})}:S(t)?{[`Set(${t.size})`]:[...t.values()].map(e=>Ce(e))}:E(t)?Ce(t):D(t)&&!b(t)&&!ee(t)?String(t):t,Ce=(e,t=``)=>E(e)?`Symbol(${e.description??t})`:e,we,Te=class{constructor(e=!1){this.detached=e,this._active=!0,this._on=0,this.effects=[],this.cleanups=[],this._isPaused=!1,this._warnOnRun=!0,this.__v_skip=!0,!e&&we&&(we.active?(this.parent=we,this.index=(we.scopes||(we.scopes=[])).push(this)-1):(this._active=!1,this._warnOnRun=!1))}get active(){return this._active}pause(){if(this._active){this._isPaused=!0;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].pause()}for(e=0,t=this.effects.length;e<t;e++)this.effects[e].pause()}}resume(){if(this._active&&this._isPaused){this._isPaused=!1;let e,t;if(this.scopes){let n=this.scopes.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}let n=this.effects.slice();for(e=0,t=n.length;e<t;e++)n[e].resume()}}run(e){if(this._active){let t=we;try{return we=this,e()}finally{we=t}}}on(){++this._on===1&&(this.prevScope=we,we=this)}off(){if(this._on>0&&--this._on===0){if(we===this)we=this.prevScope;else{let e=we;for(;e;){if(e.prevScope===this){e.prevScope=this.prevScope;break}e=e.prevScope}}this.prevScope=void 0}}stop(e){if(this._active){this._active=!1;let t,n;for(t=0,n=this.effects.length;t<n;t++)this.effects[t].stop();for(this.effects.length=0,t=0,n=this.cleanups.length;t<n;t++)this.cleanups[t]();if(this.cleanups.length=0,this.scopes){let e=this.scopes.slice();for(t=0,n=e.length;t<n;t++)e[t].stop(!0);this.scopes.length=0}if(!this.detached&&this.parent&&!e){let e=this.parent.scopes.pop();e&&e!==this&&(this.parent.scopes[this.index]=e,e.index=this.index)}this.parent=void 0}}};function Ee(){return we}var H,De=new WeakSet,Oe=class{constructor(e){this.fn=e,this.deps=void 0,this.depsTail=void 0,this.flags=5,this.next=void 0,this.cleanup=void 0,this.scheduler=void 0,we&&(we.active?we.effects.push(this):this.flags&=-2)}pause(){this.flags|=64}resume(){this.flags&64&&(this.flags&=-65,De.has(this)&&(De.delete(this),this.trigger()))}notify(){this.flags&2&&!(this.flags&32)||this.flags&8||Me(this)}run(){if(!(this.flags&1))return this.fn();this.flags|=2,Ge(this),Fe(this);let e=H,t=Ve;H=this,Ve=!0;try{return this.fn()}finally{Ie(this),H=e,Ve=t,this.flags&=-3}}stop(){if(this.flags&1){for(let e=this.deps;e;e=e.nextDep)ze(e);this.deps=this.depsTail=void 0,Ge(this),this.onStop&&this.onStop(),this.flags&=-2}}trigger(){this.flags&64?De.add(this):this.scheduler?this.scheduler():this.runIfDirty()}runIfDirty(){Le(this)&&this.run()}get dirty(){return Le(this)}},ke=0,Ae,je;function Me(e,t=!1){e.flags|=8,t?(e.next=je,je=e):(e.next=Ae,Ae=e)}function Ne(){ke++}function Pe(){if(--ke>0)return;if(je){let e=je;for(je=void 0;e;){let t=e.next;e.next=void 0,e.flags&=-9,e=t}}let e;for(;Ae;){let t=Ae;for(Ae=void 0;t;){let n=t.next;if(t.next=void 0,t.flags&=-9,t.flags&1)try{t.trigger()}catch(t){e||=t}t=n}}if(e)throw e}function Fe(e){for(let t=e.deps;t;t=t.nextDep)t.version=-1,t.prevActiveLink=t.dep.activeLink,t.dep.activeLink=t}function Ie(e){let t,n=e.depsTail,r=n;for(;r;){let e=r.prevDep;r.version===-1?(r===n&&(n=e),ze(r),Be(r)):t=r,r.dep.activeLink=r.prevActiveLink,r.prevActiveLink=void 0,r=e}e.deps=t,e.depsTail=n}function Le(e){for(let t=e.deps;t;t=t.nextDep)if(t.dep.version!==t.version||t.dep.computed&&(Re(t.dep.computed)||t.dep.version!==t.version))return!0;return!!e._dirty}function Re(e){if(e.flags&4&&!(e.flags&16)||(e.flags&=-17,e.globalVersion===Ke)||(e.globalVersion=Ke,!e.isSSR&&e.flags&128&&(!e.deps&&!e._dirty||!Le(e))))return;e.flags|=2;let t=e.dep,n=H,r=Ve;H=e,Ve=!0;try{Fe(e);let n=e.fn(e._value);(t.version===0||z(n,e._value))&&(e.flags|=128,e._value=n,t.version++)}catch(e){throw t.version++,e}finally{H=n,Ve=r,Ie(e),e.flags&=-3}}function ze(e,t=!1){let{dep:n,prevSub:r,nextSub:i}=e;if(r&&(r.nextSub=i,e.prevSub=void 0),i&&(i.prevSub=r,e.nextSub=void 0),n.subs===e&&(n.subs=r,!r&&n.computed)){n.computed.flags&=-5;for(let e=n.computed.deps;e;e=e.nextDep)ze(e,!0)}!t&&!--n.sc&&n.map&&n.map.delete(n.key)}function Be(e){let{prevDep:t,nextDep:n}=e;t&&(t.nextDep=n,e.prevDep=void 0),n&&(n.prevDep=t,e.nextDep=void 0)}var Ve=!0,He=[];function Ue(){He.push(Ve),Ve=!1}function We(){let e=He.pop();Ve=e===void 0||e}function Ge(e){let{cleanup:t}=e;if(e.cleanup=void 0,t){let e=H;H=void 0;try{t()}finally{H=e}}}var Ke=0,qe=class{constructor(e,t){this.sub=e,this.dep=t,this.version=t.version,this.nextDep=this.prevDep=this.nextSub=this.prevSub=this.prevActiveLink=void 0}},Je=class{constructor(e){this.computed=e,this.version=0,this.activeLink=void 0,this.subs=void 0,this.map=void 0,this.key=void 0,this.sc=0,this.__v_skip=!0}track(e){if(!H||!Ve||H===this.computed)return;let t=this.activeLink;if(t===void 0||t.sub!==H)t=this.activeLink=new qe(H,this),H.deps?(t.prevDep=H.depsTail,H.depsTail.nextDep=t,H.depsTail=t):H.deps=H.depsTail=t,Ye(t);else if(t.version===-1&&(t.version=this.version,t.nextDep)){let e=t.nextDep;e.prevDep=t.prevDep,t.prevDep&&(t.prevDep.nextDep=e),t.prevDep=H.depsTail,t.nextDep=void 0,H.depsTail.nextDep=t,H.depsTail=t,H.deps===t&&(H.deps=e)}return t}trigger(e){this.version++,Ke++,this.notify(e)}notify(e){Ne();try{for(let e=this.subs;e;e=e.prevSub)e.sub.notify()&&e.sub.dep.notify()}finally{Pe()}}};function Ye(e){if(e.dep.sc++,e.sub.flags&4){let t=e.dep.computed;if(t&&!e.dep.subs){t.flags|=20;for(let e=t.deps;e;e=e.nextDep)Ye(e)}let n=e.dep.subs;n!==e&&(e.prevSub=n,n&&(n.nextSub=e)),e.dep.subs=e}}var Xe=new WeakMap,Ze=Symbol(``),Qe=Symbol(``),$e=Symbol(``);function et(e,t,n){if(Ve&&H){let t=Xe.get(e);t||Xe.set(e,t=new Map);let r=t.get(n);r||(t.set(n,r=new Je),r.map=t,r.key=n),r.track()}}function tt(e,t,n,r,i,a){let o=Xe.get(e);if(!o){Ke++;return}let s=e=>{e&&e.trigger()};if(Ne(),t===`clear`)o.forEach(s);else{let i=b(e),a=i&&M(n);if(i&&n===`length`){let e=Number(r);o.forEach((t,n)=>{(n===`length`||n===$e||!E(n)&&n>=e)&&s(t)})}else switch((n!==void 0||o.has(void 0))&&s(o.get(n)),a&&s(o.get($e)),t){case`add`:i?a&&s(o.get(`length`)):(s(o.get(Ze)),x(e)&&s(o.get(Qe)));break;case`delete`:i||(s(o.get(Ze)),x(e)&&s(o.get(Qe)));break;case`set`:x(e)&&s(o.get(Ze))}}Pe()}function nt(e){let t=U(e);return t===e||(et(t,`iterate`,$e),Ht(e))?t:Vt(e)?Bt(e)?t.map(e=>Kt(Gt(e))):t.map(Kt):t.map(Gt)}function rt(e){return et(e=U(e),`iterate`,$e),e}function it(e,t){return Vt(e)?Kt(Bt(e)?Gt(t):t):Gt(t)}var at={__proto__:null,[Symbol.iterator](){return ot(this,Symbol.iterator,e=>it(this,e))},concat(...e){return nt(this).concat(...e.map(e=>b(e)?nt(e):e))},entries(){return ot(this,`entries`,e=>(e[1]=it(this,e[1]),e))},every(e,t){return lt(this,`every`,e,t,void 0,arguments)},filter(e,t){return lt(this,`filter`,e,t,e=>e.map(e=>it(this,e)),arguments)},find(e,t){return lt(this,`find`,e,t,e=>it(this,e),arguments)},findIndex(e,t){return lt(this,`findIndex`,e,t,void 0,arguments)},findLast(e,t){return lt(this,`findLast`,e,t,e=>it(this,e),arguments)},findLastIndex(e,t){return lt(this,`findLastIndex`,e,t,void 0,arguments)},forEach(e,t){return lt(this,`forEach`,e,t,void 0,arguments)},includes(...e){return dt(this,`includes`,e)},indexOf(...e){return dt(this,`indexOf`,e)},join(e){return nt(this).join(e)},lastIndexOf(...e){return dt(this,`lastIndexOf`,e)},map(e,t){return lt(this,`map`,e,t,void 0,arguments)},pop(){return ft(this,`pop`)},push(...e){return ft(this,`push`,e)},reduce(e,...t){return ut(this,`reduce`,e,t)},reduceRight(e,...t){return ut(this,`reduceRight`,e,t)},shift(){return ft(this,`shift`)},some(e,t){return lt(this,`some`,e,t,void 0,arguments)},splice(...e){return ft(this,`splice`,e)},toReversed(){return nt(this).toReversed()},toSorted(e){return nt(this).toSorted(e)},toSpliced(...e){return nt(this).toSpliced(...e)},unshift(...e){return ft(this,`unshift`,e)},values(){return ot(this,`values`,e=>it(this,e))}};function ot(e,t,n){let r=rt(e),i=r[t],a=i.call(r);if(r!==e&&!Ht(e)){if(a[Symbol.toStringTag]===`Array Iterator`){let e=Object.create(Object.getPrototypeOf(a));return e.next=()=>st(a.next(),n),i!==ct[t]&&Object.defineProperties(e,{return:{get(){let e=a.return;return typeof e==`function`?e.bind(a):e}},throw:{get(){let e=a.throw;return typeof e==`function`?e.bind(a):e}}}),e}a._next=a.next,a.next=()=>st(a._next(),n)}return a}function st(e,t){return e.done||(e.value=t(e.value)),e}var ct=Array.prototype;function lt(e,t,n,r,i,a){let o=rt(e),s=o!==e&&!Ht(e),c=o[t];if(c!==ct[t]){let t=c.apply(e,a);return s?Gt(t):t}let l=n;o!==e&&(s?l=function(t,r){return n.call(this,it(e,t),r,e)}:n.length>2&&(l=function(t,r){return n.call(this,t,r,e)}));let u=c.call(o,l,r);return s&&i?i(u):u}function ut(e,t,n,r){let i=rt(e),a=i!==e&&!Ht(e),o=n,s=!1;i!==e&&(a?(s=r.length===0,o=function(t,r,i){return s&&(s=!1,t=it(e,t)),n.call(this,t,it(e,r),i,e)}):n.length>3&&(o=function(t,r,i){return n.call(this,t,r,i,e)}));let c=i[t](o,...r);return s?it(e,c):c}function dt(e,t,n){let r=U(e);et(r,`iterate`,$e);let i=r[t](...n);return(i===-1||i===!1)&&Ut(n[0])?(n[0]=U(n[0]),r[t](...n)):i}function ft(e,t,n=[]){Ue(),Ne();let r=U(e)[t].apply(e,n);return Pe(),We(),r}var pt=l(`__proto__,__v_isRef,__isVue`),mt=new Set(Object.getOwnPropertyNames(Symbol).filter(e=>e!==`arguments`&&e!==`caller`).map(e=>Symbol[e]).filter(E));function ht(e){E(e)||(e=String(e));let t=U(this);return et(t,`has`,e),t.hasOwnProperty(e)}var gt=class{constructor(e=!1,t=!1){this._isReadonly=e,this._isShallow=t}get(e,t,n){if(t===`__v_skip`)return e.__v_skip;let r=this._isReadonly,i=this._isShallow;if(t===`__v_isReactive`)return!r;if(t===`__v_isReadonly`)return r;if(t===`__v_isShallow`)return i;if(t===`__v_raw`)return n===(r?i?Pt:Nt:i?Mt:jt).get(e)||Object.getPrototypeOf(e)===Object.getPrototypeOf(n)?e:void 0;let a=b(e);if(!r){let e;if(a&&(e=at[t]))return e;if(t===`hasOwnProperty`)return ht}let o=Reflect.get(e,t,qt(e)?e:n);if((E(t)?mt.has(t):pt(t))||(r||et(e,`get`,t),i))return o;if(qt(o)){let e=a&&M(t)?o:o.value;return r&&D(e)?Rt(e):e}return D(o)?r?Rt(o):It(o):o}},_t=class extends gt{constructor(e=!1){super(!1,e)}set(e,t,n,r){let i=e[t],a=b(e)&&M(t);if(!this._isShallow){let e=Vt(i);if(!Ht(n)&&!Vt(n)&&(i=U(i),n=U(n)),!a&&qt(i)&&!qt(n))return e||(i.value=n),!0}let o=a?Number(t)<e.length:y(e,t),s=Reflect.set(e,t,n,qt(e)?e:r);return e===U(r)&&s&&(o?z(n,i)&&tt(e,`set`,t,n,i):tt(e,`add`,t,n)),s}deleteProperty(e,t){let n=y(e,t),r=e[t],i=Reflect.deleteProperty(e,t);return i&&n&&tt(e,`delete`,t,void 0,r),i}has(e,t){let n=Reflect.has(e,t);return(!E(t)||!mt.has(t))&&et(e,`has`,t),n}ownKeys(e){return et(e,`iterate`,b(e)?`length`:Ze),Reflect.ownKeys(e)}},vt=class extends gt{constructor(e=!1){super(!0,e)}set(e,t){return!0}deleteProperty(e,t){return!0}},yt=new _t,bt=new vt,xt=new _t(!0),St=e=>e,Ct=e=>Reflect.getPrototypeOf(e);function wt(e,t,n){return function(...r){let i=this.__v_raw,a=U(i),o=x(a),s=e===`entries`||e===Symbol.iterator&&o,c=e===`keys`&&o,l=i[e](...r),u=n?St:t?Kt:Gt;return!t&&et(a,`iterate`,c?Qe:Ze),g(Object.create(l),{next(){let{value:e,done:t}=l.next();return t?{value:e,done:t}:{value:s?[u(e[0]),u(e[1])]:u(e),done:t}}})}}function Tt(e){return function(...t){return e===`delete`?!1:e===`clear`?void 0:this}}function Et(e,t){let n={get(n){let r=this.__v_raw,i=U(r),a=U(n);e||(z(n,a)&&et(i,`get`,n),et(i,`get`,a));let{has:o}=Ct(i),s=t?St:e?Kt:Gt;if(o.call(i,n))return s(r.get(n));if(o.call(i,a))return s(r.get(a));r!==i&&r.get(n)},get size(){let t=this.__v_raw;return!e&&et(U(t),`iterate`,Ze),t.size},has(t){let n=this.__v_raw,r=U(n),i=U(t);return e||(z(t,i)&&et(r,`has`,t),et(r,`has`,i)),t===i?n.has(t):n.has(t)||n.has(i)},forEach(n,r){let i=this,a=i.__v_raw,o=U(a),s=t?St:e?Kt:Gt;return!e&&et(o,`iterate`,Ze),a.forEach((e,t)=>n.call(r,s(e),s(t),i))}};return g(n,e?{add:Tt(`add`),set:Tt(`set`),delete:Tt(`delete`),clear:Tt(`clear`)}:{add(e){let n=U(this),r=Ct(n),i=U(e),a=!t&&!Ht(e)&&!Vt(e)?i:e;return r.has.call(n,a)||z(e,a)&&r.has.call(n,e)||z(i,a)&&r.has.call(n,i)||(n.add(a),tt(n,`add`,a,a)),this},set(e,n){!t&&!Ht(n)&&!Vt(n)&&(n=U(n));let r=U(this),{has:i,get:a}=Ct(r),o=i.call(r,e);o||=(e=U(e),i.call(r,e));let s=a.call(r,e);return r.set(e,n),o?z(n,s)&&tt(r,`set`,e,n,s):tt(r,`add`,e,n),this},delete(e){let t=U(this),{has:n,get:r}=Ct(t),i=n.call(t,e);i||=(e=U(e),n.call(t,e));let a=r?r.call(t,e):void 0,o=t.delete(e);return i&&tt(t,`delete`,e,void 0,a),o},clear(){let e=U(this),t=e.size!==0,n=e.clear();return t&&tt(e,`clear`,void 0,void 0,void 0),n}}),[`keys`,`values`,`entries`,Symbol.iterator].forEach(r=>{n[r]=wt(r,e,t)}),n}function Dt(e,t){let n=Et(e,t);return(r,i,a)=>i===`__v_isReactive`?!e:i===`__v_isReadonly`?e:i===`__v_isShallow`?t:i===`__v_raw`?r:Reflect.get(y(n,i)&&i in r?n:r,i,a)}var Ot={get:Dt(!1,!1)},kt={get:Dt(!1,!0)},At={get:Dt(!0,!1)},jt=new WeakMap,Mt=new WeakMap,Nt=new WeakMap,Pt=new WeakMap;function Ft(e){switch(e){case`Object`:case`Array`:return 1;case`Map`:case`Set`:case`WeakMap`:case`WeakSet`:return 2;default:return 0}}function It(e){return Vt(e)?e:zt(e,!1,yt,Ot,jt)}function Lt(e){return zt(e,!1,xt,kt,Mt)}function Rt(e){return zt(e,!0,bt,At,Nt)}function zt(e,t,n,r,i){if(!D(e)||e.__v_raw&&!(t&&e.__v_isReactive)||e.__v_skip||!Object.isExtensible(e))return e;let a=i.get(e);if(a)return a;let o=Ft(j(e));if(o===0)return e;let s=new Proxy(e,o===2?r:n);return i.set(e,s),s}function Bt(e){return Vt(e)?Bt(e.__v_raw):!!(e&&e.__v_isReactive)}function Vt(e){return!!(e&&e.__v_isReadonly)}function Ht(e){return!!(e&&e.__v_isShallow)}function Ut(e){return e?!!e.__v_raw:!1}function U(e){let t=e&&e.__v_raw;return t?U(t):e}function Wt(e){return!y(e,`__v_skip`)&&Object.isExtensible(e)&&ie(e,`__v_skip`,!0),e}var Gt=e=>D(e)?It(e):e,Kt=e=>D(e)?Rt(e):e;function qt(e){return e?e.__v_isRef===!0:!1}function Jt(e){return qt(e)?e.value:e}var Yt={get:(e,t,n)=>t===`__v_raw`?e:Jt(Reflect.get(e,t,n)),set:(e,t,n,r)=>{let i=e[t];return qt(i)&&!qt(n)?(i.value=n,!0):Reflect.set(e,t,n,r)}};function Xt(e){return Bt(e)?e:new Proxy(e,Yt)}var Zt=class{constructor(e,t,n){this.fn=e,this.setter=t,this._value=void 0,this.dep=new Je(this),this.__v_isRef=!0,this.deps=void 0,this.depsTail=void 0,this.flags=16,this.globalVersion=Ke-1,this.next=void 0,this.effect=this,this.__v_isReadonly=!t,this.isSSR=n}notify(){if(this.flags|=16,!(this.flags&8)&&H!==this)return Me(this,!0),!0}get value(){let e=this.dep.track();return Re(this),e&&(e.version=this.dep.version),this._value}set value(e){this.setter&&this.setter(e)}};function Qt(e,t,n=!1){let r,i;return w(e)?r=e:(r=e.get,i=e.set),new Zt(r,i,n)}var $t={},en=new WeakMap,W=void 0;function G(e,t=!1,n=W){if(n){let t=en.get(n);t||en.set(n,t=[]),t.push(e)}}function tn(e,t,n=u){let{immediate:r,deep:i,once:a,scheduler:o,augmentJob:s,call:c}=n,l=e=>i?e:Ht(e)||i===!1||i===0?nn(e,1):nn(e),d,p,m,h,g=!1,v=!1;if(qt(e)?(p=()=>e.value,g=Ht(e)):Bt(e)?(p=()=>l(e),g=!0):b(e)?(v=!0,g=e.some(e=>Bt(e)||Ht(e)),p=()=>e.map(e=>{if(qt(e))return e.value;if(Bt(e))return l(e);if(w(e))return c?c(e,2):e()})):p=w(e)?t?c?()=>c(e,2):e:()=>{if(m){Ue();try{m()}finally{We()}}let t=W;W=d;try{return c?c(e,3,[h]):e(h)}finally{W=t}}:f,t&&i){let e=p,t=i===!0?1/0:i;p=()=>nn(e(),t)}let y=Ee(),x=()=>{d.stop(),y&&y.active&&_(y.effects,d)};if(a&&t){let e=t;t=(...t)=>{try{return e(...t)}finally{x()}}}let S=v?Array(e.length).fill($t):$t,C=e=>{if(d.flags&1&&(d.dirty||e)){if(t){let n=d.run();if(e||i||g||(v?n.some((e,t)=>z(e,S[t])):z(n,S))){let e=W;Ue();try{m&&m(),W=d;let e=[n,S===$t?void 0:v&&S[0]===$t?[]:S,h];S=n,c?c(t,3,e):t(...e)}finally{W=e,We()}}}else d.run()}};return s&&s(C),d=new Oe(p),d.scheduler=o?()=>o(C,!1):C,h=e=>G(e,!1,d),m=d.onStop=()=>{let e=en.get(d);if(e){if(c)c(e,4);else for(let t of e)t();en.delete(d)}},t?r?C(!0):S=d.run():o?o(C.bind(null,!0),!0):d.run(),x.pause=d.pause.bind(d),x.resume=d.resume.bind(d),x.stop=x,x}function nn(e,t=1/0,n){if(t<=0||!D(e)||e.__v_skip||(n||=new Map,(n.get(e)||0)>=t))return e;if(n.set(e,t),t--,qt(e))nn(e.value,t,n);else if(b(e))for(let r=0;r<e.length;r++)nn(e[r],t,n);else if(S(e)||x(e))e.forEach(e=>{nn(e,t,n)});else if(ee(e)){for(let r in e)nn(e[r],t,n);for(let r of Object.getOwnPropertySymbols(e))Object.prototype.propertyIsEnumerable.call(e,r)&&nn(e[r],t,n)}return e}function rn(e,t,n,r){try{return r?e(...r):e()}catch(e){an(e,t,n)}}function K(e,t,n,r){if(w(e)){let i=rn(e,t,n,r);return i&&O(i)&&i.catch(e=>{an(e,t,n)}),i}if(b(e)){let i=[];for(let a=0;a<e.length;a++)i.push(K(e[a],t,n,r));return i}}function an(e,t,n,r=!0){let i=t?t.vnode:null,{errorHandler:a,throwUnhandledErrorInProduction:o}=t&&t.appContext.config||u;if(t){let r=t.parent,i=t.proxy,o=`https://vuejs.org/error-reference/#runtime-${n}`;for(;r;){let t=r.ec;if(t){for(let n=0;n<t.length;n++)if(t[n](e,i,o)===!1)return}r=r.parent}if(a){Ue(),rn(a,null,10,[e,i,o]),We();return}}on(e,n,i,r,o)}function on(e,t,n,r=!0,i=!1){if(i)throw e;console.error(e)}var q=[],sn=-1,cn=[],ln=null,un=0,dn=Promise.resolve(),fn=null;function J(e){let t=fn||dn;return e?t.then(this?e.bind(this):e):t}function pn(e){let t=sn+1,n=q.length;for(;t<n;){let r=t+n>>>1,i=q[r],a=xn(i);a<e||a===e&&i.flags&2?t=r+1:n=r}return t}function mn(e){if(!(e.flags&1)){let t=xn(e),n=q[q.length-1];!n||!(e.flags&2)&&t>=xn(n)?q.push(e):q.splice(pn(t),0,e),e.flags|=1,hn()}}function hn(){fn||=dn.then(Sn)}function gn(e){if(!b(e))ln&&e.id===-1?ln.splice(un+1,0,e):e.flags&1||(cn.push(e),e.flags|=1);else for(let t=0;t<e.length;t++)cn.push(e[t]);hn()}function _n(e,t,n,r=sn+1){for(;r<q.length;r++){let n=q[r];if(n&&n.flags&2){if(e&&n.id!==e.uid||t!==void 0&&!(n.id>=t))continue;q.splice(r,1),r=e?r-1:sn,n.flags&4&&(n.flags&=-2),n(),n.flags&4||(n.flags&=-2)}}}function vn(e,t,n=0){if(cn.length){let e=cn,r=0;if(t){e=[];for(let i=0;i<cn.length;i++){let a=cn[i];(a.i===void 0?t.has(a):!a.i||a.i.uid<n)?cn[r++]=a:e.push(a)}}let i=[...new Set(e)].sort((e,t)=>xn(e)-xn(t));if(cn.length=r,ln){for(let e=0;e<i.length;e++)ln.push(i[e]);return}for(ln=i,un=0;un<ln.length;un++){let e=ln[un];e.flags&4&&(e.flags&=-2),e.flags&8||e(),e.flags&=-2}ln=null,un=0}}var yn=!1;function bn(e,t){if(yn){e();return}let n=t===void 0?void 0:new Set(cn);e(),yn=!0;try{_n(void 0,t),vn(void 0,n,t)}finally{yn=!1}}var xn=e=>e.id==null?e.flags&2?-1:1/0:e.id;function Sn(e){try{for(sn=0;sn<q.length;sn++){let e=q[sn];e&&!(e.flags&8)&&(e.flags&4&&(e.flags&=-2),rn(e,e.i,e.i?15:14),e.flags&4||(e.flags&=-2))}}finally{for(;sn<q.length;sn++){let e=q[sn];e&&(e.flags&=-2)}sn=-1,q.length=0,vn(e),fn=null,(q.length||cn.length)&&Sn(e)}}var Cn=null,wn=null;function Tn(e){let t=Cn;return Cn=e,wn=e&&e.type.__scopeId||null,t}function En(e,t=Cn,n){if(!t||e._n)return e;let r=(...n)=>{r._d&&Ui(-1);let i=Tn(t),a=Ri.length,o;try{o=e(...n)}finally{for(let e=Ri.length;e>a;e--)Vi();Tn(i),r._d&&Ui(1)}return o};return r._n=!0,r._c=!0,r._d=!0,r}function Dn(e,t){if(Cn===null)return e;let n=wa(Cn),r=e.dirs||=[];for(let e=0;e<t.length;e++){let[i,a,o,s=u]=t[e];i&&(w(i)&&(i={mounted:i,updated:i}),i.deep&&nn(a),r.push({dir:i,instance:n,value:a,oldValue:void 0,arg:o,modifiers:s}))}return e}function On(e,t,n,r){let i=e.dirs,a=t&&t.dirs;for(let o=0;o<i.length;o++){let s=i[o];a&&(s.oldValue=a[o].value);let c=s.dir[r];c&&(Ue(),K(c,n,8,[e.el,s,e,t]),We())}}function kn(e,t){if(ua){let n=ua.provides,r=ua.parent&&ua.parent.provides;r===n&&(n=ua.provides=Object.create(r)),n[e]=t}}function An(e,t,n=!1){let r=da();if(r||Ur){let i=Ur?Ur._context.provides:r?r.parent==null||r.ce?r.vnode.appContext&&r.vnode.appContext.provides:r.parent.provides:void 0;if(i&&e in i)return i[e];if(arguments.length>1)return n&&w(t)?t.call(r&&r.proxy):t}}var jn=Symbol.for(`v-scx`),Mn=()=>An(jn);function Nn(e,t,n){return Pn(e,t,n)}function Pn(e,t,n=u){let{immediate:r,deep:i,flush:a,once:o}=n,s=g({},n),c=t&&r||!t&&a!==`post`,l;if(_a){if(a===`sync`){let e=Mn();l=e.__watcherHandles||=[]}else if(!c){let e=()=>{};return e.stop=f,e.resume=f,e.pause=f,e}}let d=ua;s.call=(e,t,n)=>K(e,d,t,n);let p=!1;a===`post`?s.scheduler=e=>{e.i=d,xi(e,d&&d.suspense)}:a!==`sync`&&(p=!0,s.scheduler=(e,t)=>{t?e():mn(e)}),s.augmentJob=e=>{t&&(e.flags|=4),p&&(e.flags|=2,d&&(e.id=d.uid,e.i=d))};let m=tn(e,t,s);return _a&&(l?l.push(m):c&&m()),m}function Fn(e,t,n){let r=this.proxy,i=T(e)?e.includes(`.`)?In(r,e):()=>r[e]:e.bind(r,r),a;w(t)?a=t:(a=t.handler,n=t);let o=ma(this),s=Pn(i,a.bind(r),n);return o(),s}function In(e,t){let n=t.split(`.`);return()=>{let t=e;for(let e=0;e<n.length&&t;e++)t=t[n[e]];return t}}var Ln=Symbol(`_vte`),Rn=e=>e.__isTeleport,zn=Symbol(`_leaveCb`);function Bn(e){let t=e[0];if(e.length>1){for(let n of e)if(n.type!==Ii){t=n;break}}return t}function Vn(e){if(!Yn(e))return Rn(e.type)&&e.children?Bn(e.children):e;if(e.component)return e.component.subTree;let{shapeFlag:t,children:n}=e;if(n){if(t&16)return n[0];if(t&32&&w(n.default))return n.default()}}function Hn(e,t){if(e.shapeFlag&6&&e.component){e.transition=t;let n=e.component.subTree;Hn(Rn(n.type)&&Vn(n)||n,t)}else if(e.shapeFlag&128)e.ssContent.transition=t.clone(e.ssContent),e.ssFallback.transition=t.clone(e.ssFallback);else if(e.transition=t,e.type===Pi&&b(e.children)){let n=Xr(e.children,!1);n&&Hn(n,t)}}function Un(e){if(e.component)return Un(e.component.subTree);if(e.type===Pi){let t=b(e.children)&&Xr(e.children,!1);return t?Un(t):void 0}if(e.type!==Ii)return e}function Wn(e){e.ids=[e.ids[0]+e.ids[2]+++`-`,0,0]}function Gn(e,t){let n;return!!((n=Object.getOwnPropertyDescriptor(e,t))&&!n.configurable)}var Kn=new WeakMap;function qn(e,t,n,r,i=!1){if(b(e)){e.forEach((e,a)=>qn(e,t&&(b(t)?t[a]:t),n,r,i));return}if(Jn(r)&&!i){r.shapeFlag&512&&r.type.__asyncResolved&&r.component.subTree.component&&qn(e,t,n,r.component.subTree);return}let a=r.shapeFlag&4?wa(r.component):r.el,o=i?null:a,{i:s,r:c}=e,l=t&&t.r,d=s.refs===u?s.refs={}:s.refs,f=s.setupState,m=U(f),h=f===u?p:e=>!Gn(d,e)&&y(m,e),g=(e,t)=>!(t&&Gn(d,t));if(l!=null&&l!==c){if(Y(t),T(l))d[l]=null,h(l)&&(f[l]=null);else if(qt(l)){let e=t;g(l,e.k)&&(l.value=null),e.k&&(d[e.k]=null)}}if(w(c))rn(c,s,12,[o,d]);else{let t=T(c),r=qt(c);if(t||r){let s=()=>{if(e.f){let n=t?h(c)?f[c]:d[c]:g(c)||!e.k?c.value:d[e.k];if(i)b(n)&&_(n,a);else if(b(n))n.includes(a)||n.push(a);else if(t)d[c]=[a],h(c)&&(f[c]=d[c]);else{let t=[a];g(c,e.k)&&(c.value=t),e.k&&(d[e.k]=t)}}else t?(d[c]=o,h(c)&&(f[c]=o)):r&&(g(c,e.k)&&(c.value=o),e.k&&(d[e.k]=o))};if(o){let t=()=>{s(),Kn.delete(e)};t.id=-1,Kn.set(e,t),xi(t,n)}else Y(e),s()}}}function Y(e){let t=Kn.get(e);t&&(t.flags|=8,Kn.delete(e))}se().requestIdleCallback,se().cancelIdleCallback;var Jn=e=>!!e.type.__asyncLoader,Yn=e=>e.type.__isKeepAlive;function Xn(e,t){Qn(e,`a`,t)}function Zn(e,t){Qn(e,`da`,t)}function Qn(e,t,n=ua){let r=e.__wdc||=()=>{let t=n;for(;t;){if(t.isDeactivated)return;t=t.parent}return e()};if(er(t,r,n),n){let e=n.parent;for(;e&&e.parent;)Yn(e.parent.vnode)&&$n(r,t,n,e),e=e.parent}}function $n(e,t,n,r){let i=er(t,e,r,!0);sr(()=>{_(r[t],i)},n)}function er(e,t,n=ua,r=!1){if(n){let i=n[e]||(n[e]=[]),a=t.__weh||=(...r)=>{Ue();let i=ma(n),a=K(t,n,e,r);return i(),We(),a};return r?i.unshift(a):i.push(a),a}}var tr=e=>(t,n=ua)=>{(!_a||e===`sp`)&&er(e,(...e)=>t(...e),n)},nr=tr(`bm`),rr=tr(`m`),ir=tr(`bu`),ar=tr(`u`),or=tr(`bum`),sr=tr(`um`),cr=tr(`sp`),lr=tr(`rtg`),ur=tr(`rtc`);function dr(e,t=ua){er(`ec`,e,t)}var fr=`components`;function pr(e,t){return hr(fr,e,!0,t)||e}var mr=Symbol.for(`v-ndc`);function hr(e,t,n=!0,r=!1){let i=Cn||ua;if(i){let n=i.type;if(e===fr){let e=Ta(n,!1);if(e&&(e===t||e===F(t)||e===L(F(t))))return n}let a=gr(i[e]||n[e],t)||gr(i.appContext[e],t);return!a&&r?n:a}}function gr(e,t){return e&&(e[t]||e[F(t)]||e[L(F(t))])}function _r(e,t,n,r){let i,a=n&&n[r],o=b(e);if(o||T(e)){let n=o&&Bt(e),r=!1,s=!1;n&&(r=!Ht(e),s=Vt(e),e=rt(e)),i=Array(e.length);for(let n=0,o=e.length;n<o;n++)i[n]=t(r?s?Kt(Gt(e[n])):Gt(e[n]):e[n],n,void 0,a&&a[n])}else if(typeof e==`number`){if(!Number.isInteger(e)||e<0)i=[];else{i=Array(e);for(let n=0;n<e;n++)i[n]=t(n+1,n,void 0,a&&a[n])}}else if(D(e)){if(e[Symbol.iterator])i=Array.from(e,(e,n)=>t(e,n,void 0,a&&a[n]));else{let n=Object.keys(e);i=Array(n.length);for(let r=0,o=n.length;r<o;r++){let o=n[r];i[r]=t(e[o],o,r,a&&a[r])}}}else i=[];return n&&(n[r]=i),i}function vr(e,t,n,r,i,a){if(n??={},Cn.ce||Cn.parent&&Jn(Cn.parent)&&Cn.parent.ce){let e=a!=null&&n.key==null?g({},n,{key:a}):n,i=Object.keys(e).length>0;return t!=="default"&&(e.name=t),Bi(),Ki(Pi,null,[Z(`slot`,e,r&&r())],i?-2:64)}let o=e[t];o&&o._c&&(o._d=!1);let s=Ri.length;Bi();let c;try{let i=o&&yr(o(n)),s=n.key||a||i&&i.key;c=Ki(Pi,{key:(s&&!E(s)?s:`_${t}`)+(!i&&r?`_fb`:``)},i||(r?r():[]),i&&e._===1?64:-2)}catch(e){for(let e=Ri.length;e>s;e--)Vi();throw e}finally{o&&o._c&&(o._d=!0)}return!i&&c.scopeId&&(c.slotScopeIds=[c.scopeId+`-s`]),c}function yr(e){return e.some(e=>!qi(e)||!(e.type===Ii||e.type===Pi&&!yr(e.children)))?e:null}var br=e=>e?ga(e)?wa(e):br(e.parent):null,xr=g(Object.create(null),{$:e=>e,$el:e=>e.vnode.el,$data:e=>e.data,$props:e=>e.props,$attrs:e=>e.attrs,$slots:e=>e.slots,$refs:e=>e.refs,$parent:e=>br(e.parent),$root:e=>br(e.root),$host:e=>e.ce,$emit:e=>e.emit,$options:e=>Ar(e),$forceUpdate:e=>e.f||=()=>{mn(e.update)},$nextTick:e=>e.n||=J.bind(e.proxy),$watch:e=>Fn.bind(e)}),Sr=(e,t)=>e!==u&&!e.__isScriptSetup&&y(e,t),Cr={get({_:e},t){if(t===`__v_skip`)return!0;let{ctx:n,setupState:r,data:i,props:a,accessCache:o,type:s,appContext:c}=e;if(t[0]!==`$`){let e=o[t];if(e!==void 0)switch(e){case 1:return r[t];case 2:return i[t];case 4:return n[t];case 3:return a[t]}else if(Sr(r,t))return o[t]=1,r[t];else if(i!==u&&y(i,t))return o[t]=2,i[t];else if(y(a,t))return o[t]=3,a[t];else if(n!==u&&y(n,t))return o[t]=4,n[t];else Tr&&(o[t]=0)}let l=xr[t],d,f;if(l)return t===`$attrs`&&et(e.attrs,`get`,``),l(e);if((d=s.__cssModules)&&(d=d[t]))return d;if(n!==u&&y(n,t))return o[t]=4,n[t];if(f=c.config.globalProperties,y(f,t))return f[t]},set({_:e},t,n){let{data:r,setupState:i,ctx:a}=e;return Sr(i,t)?(i[t]=n,!0):r!==u&&y(r,t)?(r[t]=n,!0):y(e.props,t)||t[0]===`$`&&t.slice(1)in e?!1:(a[t]=n,!0)},has({_:{data:e,setupState:t,accessCache:n,ctx:r,appContext:i,props:a,type:o}},s){let c;return!!(n[s]||e!==u&&s[0]!==`$`&&y(e,s)||Sr(t,s)||y(a,s)||y(r,s)||y(xr,s)||y(i.config.globalProperties,s)||(c=o.__cssModules)&&c[s])},defineProperty(e,t,n){return n.get==null?y(n,`value`)&&this.set(e,t,n.value,null):e._.accessCache[t]=0,Reflect.defineProperty(e,t,n)}};function wr(e){return b(e)?e.reduce((e,t)=>(e[t]=null,e),{}):e}var Tr=!0;function Er(e){let t=Ar(e),n=e.proxy,r=e.ctx;Tr=!1,t.beforeCreate&&Or(t.beforeCreate,e,`bc`);let{data:i,computed:a,methods:o,watch:s,provide:c,inject:l,created:u,beforeMount:d,mounted:p,beforeUpdate:m,updated:h,activated:g,deactivated:_,beforeDestroy:v,beforeUnmount:y,destroyed:x,unmounted:S,render:C,renderTracked:T,renderTriggered:E,errorCaptured:O,serverPrefetch:k,expose:A,inheritAttrs:j,components:ee,directives:M,filters:N}=t;if(l&&Dr(l,r,null),o)for(let e in o){let t=o[e];w(t)&&(r[e]=t.bind(n))}if(i){let t=i.call(n,n);D(t)&&(e.data=It(t))}if(Tr=!0,a)for(let e in a){let t=a[e],i=Da({get:w(t)?t.bind(n,n):w(t.get)?t.get.bind(n,n):f,set:!w(t)&&w(t.set)?t.set.bind(n):f});Object.defineProperty(r,e,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e})}if(s)for(let e in s)kr(s[e],r,n,e);if(c){let e=w(c)?c.call(n):c;Reflect.ownKeys(e).forEach(t=>{kn(t,e[t])})}u&&Or(u,e,`c`);function P(e,t){b(t)?t.forEach(t=>e(t.bind(n))):t&&e(t.bind(n))}if(P(nr,d),P(rr,p),P(ir,m),P(ar,h),P(Xn,g),P(Zn,_),P(dr,O),P(ur,T),P(lr,E),P(or,y),P(sr,S),P(cr,k),b(A)){if(A.length){let t=e.exposed||={};A.forEach(e=>{Object.defineProperty(t,e,{get:()=>n[e],set:t=>n[e]=t,enumerable:!0})})}else e.exposed||={}}C&&e.render===f&&(e.render=C),j!=null&&(e.inheritAttrs=j),ee&&(e.components=ee),M&&(e.directives=M),k&&Wn(e)}function Dr(e,t,n=f){b(e)&&(e=Fr(e));for(let n in e){let r=e[n],i;i=D(r)?`default`in r?An(r.from||n,r.default,!0):An(r.from||n):An(r),qt(i)?Object.defineProperty(t,n,{enumerable:!0,configurable:!0,get:()=>i.value,set:e=>i.value=e}):t[n]=i}}function Or(e,t,n){K(b(e)?e.map(e=>e.bind(t.proxy)):e.bind(t.proxy),t,n)}function kr(e,t,n,r){let i=r.includes(`.`)?In(n,r):()=>n[r];if(T(e)){let n=t[e];w(n)&&Nn(i,n)}else if(w(e))Nn(i,e.bind(n));else if(D(e)){if(b(e))e.forEach(e=>kr(e,t,n,r));else{let r=w(e.handler)?e.handler.bind(n):t[e.handler];w(r)&&Nn(i,r,e)}}}function Ar(e){let t=e.type,{mixins:n,extends:r}=t,{mixins:i,optionsCache:a,config:{optionMergeStrategies:o}}=e.appContext,s=a.get(t),c;return s?c=s:!i.length&&!n&&!r?c=t:(c={},i.length&&i.forEach(e=>jr(c,e,o,!0)),jr(c,t,o)),D(t)&&a.set(t,c),c}function jr(e,t,n,r=!1){let{mixins:i,extends:a}=t;a&&jr(e,a,n,!0),i&&i.forEach(t=>jr(e,t,n,!0));for(let i in t)if(!(r&&i===`expose`)){let r=Mr[i]||n&&n[i];e[i]=r?r(e[i],t[i]):t[i]}return e}var Mr={data:Nr,props:Rr,emits:Rr,methods:Lr,computed:Lr,beforeCreate:Ir,created:Ir,beforeMount:Ir,mounted:Ir,beforeUpdate:Ir,updated:Ir,beforeDestroy:Ir,beforeUnmount:Ir,destroyed:Ir,unmounted:Ir,activated:Ir,deactivated:Ir,errorCaptured:Ir,serverPrefetch:Ir,components:Lr,directives:Lr,watch:zr,provide:Nr,inject:Pr};function Nr(e,t){return t?e?function(){return g(w(e)?e.call(this,this):e,w(t)?t.call(this,this):t)}:t:e}function Pr(e,t){return Lr(Fr(e),Fr(t))}function Fr(e){if(b(e)){let t={};for(let n=0;n<e.length;n++)t[e[n]]=e[n];return t}return e}function Ir(e,t){return e?[...new Set([].concat(e,t))]:t}function Lr(e,t){return e?g(Object.create(null),e,t):t}function Rr(e,t){return e?b(e)&&b(t)?[...new Set([...e,...t])]:g(Object.create(null),wr(e),wr(t??{})):t}function zr(e,t){if(!e)return t;if(!t)return e;let n=g(Object.create(null),e);for(let r in t)n[r]=Ir(e[r],t[r]);return n}function Br(){return{app:null,config:{isNativeTag:p,performance:!1,globalProperties:{},optionMergeStrategies:{},errorHandler:void 0,warnHandler:void 0,compilerOptions:{}},mixins:[],components:{},directives:{},provides:Object.create(null),optionsCache:new WeakMap,propsCache:new WeakMap,emitsCache:new WeakMap}}var Vr=0;function Hr(e,t){return function(n,r=null){w(n)||(n=g({},n)),r!=null&&!D(r)&&(r=null);let i=Br(),a=new WeakSet,o=[],s=!1,c=i.app={_uid:Vr++,_component:n,_props:r,_container:null,_context:i,_instance:null,version:Oa,get config(){return i.config},set config(e){},use(e,...t){return a.has(e)||(e&&w(e.install)?(a.add(e),e.install(c,...t)):w(e)&&(a.add(e),e(c,...t))),c},mixin(e){return i.mixins.includes(e)||i.mixins.push(e),c},component(e,t){return t?(i.components[e]=t,c):i.components[e]},directive(e,t){return t?(i.directives[e]=t,c):i.directives[e]},mount(a,o,l){if(!s){let u=c._ceVNode||Z(n,r);return u.appContext=i,l===!0?l=`svg`:l===!1&&(l=void 0),o&&t?t(u,a):e(u,a,l),s=!0,c._container=a,a.__vue_app__=c,wa(u.component)}},onUnmount(e){o.push(e)},unmount(){s&&(K(o,c._instance,16),e(null,c._container),delete c._container.__vue_app__)},provide(e,t){return i.provides[e]=t,c},runWithContext(e){let t=Ur;Ur=c;try{return e()}finally{Ur=t}}};return c}}var Ur=null,Wr=(e,t)=>t===`modelValue`||t===`model-value`?e.modelModifiers:e[`${t}Modifiers`]||e[`${F(t)}Modifiers`]||e[`${ne(t)}Modifiers`];function Gr(e,t,...n){if(e.isUnmounted)return;let r=e.vnode.props||u,i=n,a=t.startsWith(`update:`),o=a&&Wr(r,t.slice(7));o&&(o.trim&&(i=n.map(e=>T(e)?e.trim():e)),o.number&&(i=i.map(ae)));let s,c=r[s=R(t)]||r[s=R(F(t))];!c&&a&&(c=r[s=R(ne(t))]),c&&K(c,e,6,i);let l=r[s+`Once`];if(l){if(!e.emitted)e.emitted={};else if(e.emitted[s])return;e.emitted[s]=!0,K(l,e,6,i)}}var Kr=new WeakMap;function qr(e,t,n=!1){let r=n?Kr:t.emitsCache,i=r.get(e);if(i!==void 0)return i;let a=e.emits,o={},s=!1;if(!w(e)){let r=e=>{let n=qr(e,t,!0);n&&(s=!0,g(o,n))};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}return!a&&!s?(D(e)&&r.set(e,null),null):(b(a)?a.forEach(e=>o[e]=null):g(o,a),D(e)&&r.set(e,o),o)}function Jr(e,t){return!e||!m(t)?!1:(t=t.slice(2),t=t===`Once`?t:t.replace(/Once$/,``),y(e,t[0].toLowerCase()+t.slice(1))||y(e,ne(t))||y(e,t))}function Yr(e){let{type:t,vnode:n,proxy:r,withProxy:i,propsOptions:[a],slots:o,attrs:s,emit:c,render:l,renderCache:u,props:d,data:f,setupState:p,ctx:m,inheritAttrs:g}=e,_=Tn(e),v,y;try{if(n.shapeFlag&4){let e=i||r,t=e;v=ta(l.call(t,e,u,d,p,f,m)),y=s}else{let e=t;v=ta(e.length>1?e(d,{attrs:s,slots:o,emit:c}):e(d,null)),y=t.props?s:Zr(s)}}catch(t){Ri.length=0,an(t,e,1),v=Z(Ii)}let b=v;if(y&&g!==!1){let e=Object.keys(y),{shapeFlag:t}=b;e.length&&t&7&&(a&&e.some(h)&&(y=Qr(y,a)),b=$i(b,y,!1,!0))}return n.dirs&&(b=$i(b,null,!1,!0),b.dirs=b.dirs?b.dirs.concat(n.dirs):n.dirs),n.transition&&Hn(Rn(b.type)&&Vn(b)||b,n.transition),v=b,Tn(_),v}function Xr(e,t=!0){let n;for(let t=0;t<e.length;t++){let r=e[t];if(qi(r)){if(r.type!==Ii||r.children===`v-if`){if(n)return;n=r}}else return}return n}var Zr=e=>{let t;for(let n in e)(n===`class`||n===`style`||m(n))&&((t||={})[n]=e[n]);return t},Qr=(e,t)=>{let n={};for(let r in e)(!h(r)||!(r.slice(9)in t))&&(n[r]=e[r]);return n};function $r(e,t,n){let{props:r,children:i,component:a}=e,{props:o,children:s,patchFlag:c}=t,l=a.emitsOptions;if(t.dirs||t.transition)return!0;if(n&&c>=0){if(c&1024)return!0;if(c&16)return r?ei(r,o,l):!!o;if(c&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let n=e[t];if(ti(o,r,n)&&!Jr(l,n))return!0}}}else return(i||s)&&(!s||!s.$stable)?!0:r===o?!1:r?!o||ei(r,o,l):!!o;return!1}function ei(e,t,n){let r=Object.keys(t);if(r.length!==Object.keys(e).length)return!0;for(let i=0;i<r.length;i++){let a=r[i];if(!y(e,a)||ti(t,e,a)&&!Jr(n,a))return!0}return!1}function ti(e,t,n){let r=e[n],i=t[n];return n===`style`&&D(r)&&D(i)?!ve(r,i):r!==i}function ni({vnode:e,parent:t,suspense:n},r){for(;t;){let n=t.subTree;if(n.suspense&&n.suspense.activeBranch===e&&(n.suspense.vnode.el=n.el=r,e=n),n===e)(e=t.vnode).el=r,t=t.parent;else break}n&&n.activeBranch===e&&(n.vnode.el=r)}var ri={},ii=()=>Object.create(ri),ai=e=>Object.getPrototypeOf(e)===ri;function oi(e,t,n,r=!1){let i={},a=ii();e.propsDefaults=Object.create(null),ci(e,t,i,a);for(let t in e.propsOptions[0])t in i||(i[t]=void 0);e.props=n?r?i:Lt(i):e.type.props?i:a,e.attrs=a}function si(e,t,n,r){let{props:i,attrs:a,vnode:{patchFlag:o}}=e,s=U(i),[c]=e.propsOptions,l=!1;if((r||o>0)&&!(o&16)){if(o&8){let n=e.vnode.dynamicProps;for(let r=0;r<n.length;r++){let o=n[r];if(Jr(e.emitsOptions,o))continue;let u=t[o];if(c){if(y(a,o))u!==a[o]&&(a[o]=u,l=!0);else{let t=F(o);i[t]=li(c,s,t,u,e,!1)}}else u!==a[o]&&(a[o]=u,l=!0)}}}else{ci(e,t,i,a)&&(l=!0);let r;for(let a in s)(!t||!y(t,a)&&((r=ne(a))===a||!y(t,r)))&&(c?n&&(n[a]!==void 0||n[r]!==void 0)&&(i[a]=li(c,s,a,void 0,e,!0)):delete i[a]);if(a!==s)for(let e in a)(!t||!y(t,e))&&(delete a[e],l=!0)}l&&tt(e.attrs,`set`,``)}function ci(e,t,n,r){let[i,a]=e.propsOptions,o=!1,s;if(t)for(let c in t){if(N(c))continue;let l=t[c],u;i&&y(i,u=F(c))?!a||!a.includes(u)?n[u]=l:(s||={})[u]=l:Jr(e.emitsOptions,c)||(!(c in r)||l!==r[c])&&(r[c]=l,o=!0)}if(a){let t=U(n),r=s||u;for(let o=0;o<a.length;o++){let s=a[o];n[s]=li(i,t,s,r[s],e,!y(r,s))}}return o}function li(e,t,n,r,i,a){let o=e[n];if(o!=null){let e=y(o,`default`);if(e&&r===void 0){let e=o.default;if(o.type!==Function&&!o.skipFactory&&w(e)){let{propsDefaults:a}=i;if(n in a)r=a[n];else{let o=ma(i);r=a[n]=e.call(null,t),o()}}else r=e;i.ce&&i.ce._setProp(n,r)}o[0]&&(a&&!e?r=!1:o[1]&&(r===``||r===ne(n))&&(r=!0))}return r}var ui=new WeakMap;function di(e,t,n=!1){let r=n?ui:t.propsCache,i=r.get(e);if(i)return i;let a=e.props,o={},s=[],c=!1;if(!w(e)){let r=e=>{c=!0;let[n,r]=di(e,t,!0);g(o,n),r&&s.push(...r)};!n&&t.mixins.length&&t.mixins.forEach(r),e.extends&&r(e.extends),e.mixins&&e.mixins.forEach(r)}if(!a&&!c)return D(e)&&r.set(e,d),d;if(b(a))for(let e=0;e<a.length;e++){let t=F(a[e]);fi(t)&&(o[t]=u)}else if(a)for(let e in a){let t=F(e);if(fi(t)){let n=a[e],r=o[t]=b(n)||w(n)?{type:n}:g({},n),i=r.type,c=!1,l=!0;if(b(i))for(let e=0;e<i.length;++e){let t=i[e],n=w(t)&&t.name;if(n===`Boolean`){c=!0;break}n===`String`&&(l=!1)}else c=w(i)&&i.name===`Boolean`;r[0]=c,r[1]=l,(c||y(r,`default`))&&s.push(t)}}let l=[o,s];return D(e)&&r.set(e,l),l}function fi(e){return e[0]!==`$`&&!N(e)}var pi=e=>e===`_`||e===`_ctx`||e===`$stable`,mi=e=>b(e)?e.map(ta):[ta(e)],hi=(e,t,n)=>{if(t._n)return t;let r=En((...e)=>mi(t(...e)),n);return r._c=!1,r},gi=(e,t,n)=>{let r=e._ctx;for(let n in e){if(pi(n))continue;let i=e[n];if(w(i))t[n]=hi(n,i,r);else if(i!=null){let e=mi(i);t[n]=()=>e}}},_i=(e,t)=>{let n=mi(t);e.slots.default=()=>n},vi=(e,t,n)=>{for(let r in t)(n||!pi(r))&&(e[r]=t[r])},yi=(e,t,n)=>{let r=e.slots=ii();if(e.vnode.shapeFlag&32){let e=t._;e?(vi(r,t,n),n&&ie(r,`_`,e,!0)):gi(t,r)}else t&&_i(e,t)},bi=(e,t,n)=>{let{vnode:r,slots:i}=e,a=!0,o=u;if(r.shapeFlag&32){let e=t._;e?n&&e===1?a=!1:vi(i,t,n):(a=!t.$stable,gi(t,i)),o=t}else t&&(_i(e,t),o={default:1});if(a)for(let e in i)!pi(e)&&o[e]==null&&delete i[e]},xi=Ni;function Si(e){return Ci(e)}function Ci(e,t){let n=se();n.__VUE__=!0;let{insert:r,remove:i,patchProp:a,createElement:o,createText:s,createComment:c,setText:l,setElementText:p,parentNode:m,nextSibling:h,setScopeId:g=f,insertStaticContent:_}=e,v=(e,t,n,r=null,i=null,a=null,o=void 0,s=null,c=!!t.dynamicChildren)=>{if(e===t)return;e&&!Ji(e,t)&&(r=ce(e),z(e,i,a,!0),e=null),t.patchFlag===-2&&(c=!1,t.dynamicChildren=null),t.dynamicChildren&&e&&e.dynamicChildren&&e.dynamicChildren.hasOnce&&(t.dynamicChildren===d&&(t.dynamicChildren=[]),t.dynamicChildren.hasOnce=!0);let{type:l,ref:u,shapeFlag:f}=t;switch(l){case Fi:y(e,t,n,r);break;case Ii:b(e,t,n,r);break;case Li:e??x(t,n,r,o);break;case Pi:j(e,t,n,r,i,a,o,s,c);break;default:f&1?w(e,t,n,r,i,a,o,s,c):f&6?ee(e,t,n,r,i,a,o,s,c):(f&64||f&128)&&l.process(e,t,n,r,i,a,o,s,c,V)}u!=null&&i?qn(u,e&&e.ref,a,t||e,!t):u==null&&e&&e.ref!=null&&qn(e.ref,null,a,e,!0)},y=(e,t,n,i)=>{if(e==null)r(t.el=s(t.children),n,i);else{let n=t.el=e.el;t.children!==e.children&&l(n,t.children)}},b=(e,t,n,i)=>{e==null?r(t.el=c(t.children||``),n,i):t.el=e.el},x=(e,t,n,r)=>{[e.el,e.anchor]=_(e.children,t,n,r,e.el,e.anchor)},S=({el:e,anchor:t},n,i)=>{let a;for(;e&&e!==t;)a=h(e),r(e,n,i),e=a;r(t,n,i)},C=({el:e,anchor:t})=>{let n;for(;e&&e!==t;)n=h(e),i(e),e=n;i(t)},w=(e,t,n,r,i,a,o,s,c)=>{if(t.type===`svg`?o=`svg`:t.type===`math`&&(o=`mathml`),e==null)T(t,n,r,i,a,o,s,c);else{let n=e.el&&e.el._isVueCE?e.el:null;try{n&&n._beginPatch(),O(e,t,i,a,o,s,c)}finally{n&&n._endPatch()}}},T=(e,t,n,i,s,c,l,u)=>{let d,f,{props:m,shapeFlag:h,transition:g,dirs:_}=e;if(d=e.el=o(e.type,c,m&&m.is,m),h&8?p(d,e.children):h&16&&D(e.children,d,null,i,s,wi(e,c),l,u),_&&On(e,null,i,`created`),E(d,e,e.scopeId,l,i),m){for(let e in m)e!==`value`&&!N(e)&&a(d,e,null,m[e],c,i);`value`in m&&a(d,`value`,null,m.value,c),(f=m.onVnodeBeforeMount)&&aa(f,i,e)}_&&On(e,null,i,`beforeMount`);let v=Ei(s,g);v&&g.beforeEnter(d),r(d,t,n),((f=m&&m.onVnodeMounted)||v||_)&&xi(()=>{try{f&&aa(f,i,e),v&&g.enter(d),_&&On(e,null,i,`mounted`)}finally{}},s)},E=(e,t,n,r,i)=>{if(n&&g(e,n),r)for(let t=0;t<r.length;t++)g(e,r[t]);if(i){let n=i.subTree;if(t===n||Mi(n.type)&&(n.ssContent===t||n.ssFallback===t)){let t=i.vnode;E(e,t,t.scopeId,t.slotScopeIds,i.parent)}}},D=(e,t,n,r,i,a,o,s,c=0)=>{for(let l=c;l<e.length;l++){let c=e[l]=s?na(e[l]):ta(e[l]);v(null,c,t,n,r,i,a,o,s)}},O=(e,t,n,r,i,o,s)=>{let c=t.el=e.el,{patchFlag:l,dynamicChildren:d,dirs:f}=t;l|=e.patchFlag&16;let m=e.props||u,h=t.props||u,g;if(n&&Ti(n,!1),(g=h.onVnodeBeforeUpdate)&&aa(g,n,t,e),f&&On(t,e,n,`beforeUpdate`),n&&Ti(n,!0),d&&(!e.dynamicChildren||e.dynamicChildren.length!==d.length)&&(l=0,s=!1,d=null),(m.innerHTML&&h.innerHTML==null||m.textContent&&h.textContent==null)&&p(c,``),d?k(e.dynamicChildren,d,c,n,r,wi(t,i),o):s||I(e,t,c,null,n,r,wi(t,i),o,!1),l>0){if(l&16)A(c,m,h,n,i);else if(l&2&&m.class!==h.class&&a(c,`class`,null,h.class,i),l&4&&a(c,`style`,m.style,h.style,i),l&8){let e=t.dynamicProps;for(let t=0;t<e.length;t++){let r=e[t],o=m[r],s=h[r];(s!==o||r===`value`)&&a(c,r,o,s,i,n)}}l&1&&e.children!==t.children&&p(c,t.children)}else!s&&d==null&&A(c,m,h,n,i);((g=h.onVnodeUpdated)||f)&&xi(()=>{g&&aa(g,n,t,e),f&&On(t,e,n,`updated`)},r)},k=(e,t,n,r,i,a,o)=>{for(let s=0;s<t.length;s++){let c=e[s],l=t[s],u=c.el||ji(c),d=u&&(c.type===Pi||!Ji(c,l)||c.shapeFlag&198)?m(u):n;v(c,l,d,null,r,i,a,o,!0)}},A=(e,t,n,r,i)=>{if(t!==n){if(t!==u)for(let o in t)!N(o)&&!(o in n)&&a(e,o,t[o],null,i,r);for(let o in n){if(N(o))continue;let s=n[o],c=t[o];s!==c&&o!==`value`&&a(e,o,c,s,i,r)}`value`in n&&a(e,`value`,t.value,n.value,i)}},j=(e,t,n,i,a,o,c,l,u)=>{let d=t.el=e?e.el:s(``),f=t.anchor=e?e.anchor:s(``),{patchFlag:p,dynamicChildren:m,slotScopeIds:h}=t;h&&(l=l?l.concat(h):h),e==null?(r(d,n,i),r(f,n,i),D(t.children||[],n,f,a,o,c,l,u)):p>0&&p&64&&m&&e.dynamicChildren&&e.dynamicChildren.length===m.length?(k(e.dynamicChildren,m,n,a,o,c,l),(t.key!=null||a&&t===a.subTree)&&Di(e,t,!0)):I(e,t,n,f,a,o,c,l,u)},ee=(e,t,n,r,i,a,o,s,c)=>{t.slotScopeIds=s,e==null?t.shapeFlag&512?i.ctx.activate(t,n,r,o,c):M(t,n,r,i,a,o,c):P(e,t,c)},M=(e,t,n,r,i,a,o)=>{let s=e.component=la(e,r,i);if(Yn(e)&&(s.ctx.renderer=V),va(s,!1,o),s.asyncDep){if(i&&i.registerDep(s,te,o,a),!e.el){let r=s.subTree=Z(Ii);b(null,r,t,n),e.placeholder=r.el}}else te(s,e,t,n,i,a,o)},P=(e,t,n)=>{let r=t.component=e.component;if($r(e,t,n)){if(r.asyncDep&&!r.asyncResolved){t.el=e.el,t.placeholder=e.placeholder,F(r,t,n);return}r.next=t,r.update()}else t.el=e.el,t.placeholder=e.placeholder,r.vnode=t},te=(e,t,n,r,i,a,o)=>{let s=()=>{if(e.isMounted){let{next:t,bu:n,u:r,parent:s,vnode:c}=e;{let n=ki(e);if(n){t&&(t.el=c.el,F(e,t,o)),n.asyncDep.then(()=>{xi(()=>{e.isUnmounted||l()},i)});return}}let u=t,d;Ti(e,!1),t?(t.el=c.el,F(e,t,o)):t=c,n&&re(n),(d=t.props&&t.props.onVnodeBeforeUpdate)&&aa(d,s,t,c),Ti(e,!0);let f=Yr(e),p=e.subTree;e.subTree=f,v(p,f,m(p.el),ce(p),e,i,a),t.el=f.el,u===null&&ni(e,f.el),r&&xi(r,i),(d=t.props&&t.props.onVnodeUpdated)&&xi(()=>aa(d,s,t,c),i)}else{let o,{el:s,props:c}=t,{bm:l,m:u,parent:d,root:f,type:p}=e,m=Jn(t);if(Ti(e,!1),l&&re(l),!m&&(o=c&&c.onVnodeBeforeMount)&&aa(o,d,t),Ti(e,!0),s&&de){let t=()=>{e.subTree=Yr(e),de(s,e.subTree,e,i,null)};m&&p.__asyncHydrate?p.__asyncHydrate(s,e,t):t()}else{f.ce&&f.ce._hasShadowRoot()&&f.ce._injectChildStyle(p,e.parent?e.parent.type:void 0);let o=e.subTree=Yr(e);v(null,o,n,r,e,i,a),t.el=o.el}if(u&&xi(u,i),!m&&(o=c&&c.onVnodeMounted)){let e=t;xi(()=>aa(o,d,e),i)}(t.shapeFlag&256||d&&Jn(d.vnode)&&d.vnode.shapeFlag&256)&&e.a&&xi(e.a,i),e.isMounted=!0,t=n=r=null}};e.scope.on();let c=e.effect=new Oe(s);e.scope.off();let l=e.update=c.run.bind(c),u=e.job=c.runIfDirty.bind(c);u.i=e,u.id=e.uid,c.scheduler=()=>mn(u),Ti(e,!0),l()},F=(e,t,n)=>{t.component=e;let r=e.vnode.props;e.vnode=t,e.next=null,si(e,t.props,r,n),bi(e,t.children,n),Ue(),_n(e),We()},I=(e,t,n,r,i,a,o,s,c=!1)=>{let l=e&&e.children,u=e?e.shapeFlag:0,d=t.children,{patchFlag:f,shapeFlag:m}=t;if(f>0){if(f&128){L(l,d,n,r,i,a,o,s,c);return}if(f&256){ne(l,d,n,r,i,a,o,s,c);return}}m&8?(u&16&&B(l,i,a),d!==l&&p(n,d)):u&16?m&16?L(l,d,n,r,i,a,o,s,c):B(l,i,a,!0):(u&8&&p(n,``),m&16&&D(d,n,r,i,a,o,s,c))},ne=(e,t,n,r,i,a,o,s,c)=>{e||=d,t||=d;let l=e.length,u=t.length,f=Math.min(l,u),p=0;for(;p<f;p++){let r=t[p]=c?na(t[p]):ta(t[p]);v(e[p],r,n,null,i,a,o,s,c)}l>u?B(e,i,a,!0,!1,f):D(t,n,r,i,a,o,s,c,f)},L=(e,t,n,r,i,a,o,s,c)=>{let l=0,u=t.length,f=e.length-1,p=u-1;for(;l<=f&&l<=p;){let r=e[l],u=t[l]=c?na(t[l]):ta(t[l]);if(Ji(r,u))v(r,u,n,null,i,a,o,s,c);else break;l++}for(;l<=f&&l<=p;){let r=e[f],l=t[p]=c?na(t[p]):ta(t[p]);if(Ji(r,l))v(r,l,n,null,i,a,o,s,c);else break;f--,p--}if(l>f){if(l<=p){let e=p+1,d=e<u?t[e].el:r;for(;l<=p;)v(null,t[l]=c?na(t[l]):ta(t[l]),n,d,i,a,o,s,c),l++}}else if(l>p)for(;l<=f;)z(e[l],i,a,!0),l++;else{let m=l,h=l,g=new Map;for(l=h;l<=p;l++){let e=t[l]=c?na(t[l]):ta(t[l]);e.key!=null&&g.set(e.key,l)}let _,y=0,b=p-h+1,x=!1,S=0,C=Array(b);for(l=0;l<b;l++)C[l]=0;for(l=m;l<=f;l++){let r=e[l];if(y>=b){z(r,i,a,!0);continue}let u;if(r.key!=null)u=g.get(r.key);else for(_=h;_<=p;_++)if(C[_-h]===0&&Ji(r,t[_])){u=_;break}u===void 0?z(r,i,a,!0):(C[u-h]=l+1,u>=S?S=u:x=!0,v(r,t[u],n,null,i,a,o,s,c),y++)}let w=x?Oi(C):d;for(_=w.length-1,l=b-1;l>=0;l--){let e=h+l,d=t[e],f=t[e+1],p=e+1<u?f.el||ji(f):r;C[l]===0?v(null,d,n,p,i,a,o,s,c):x&&(_<0||l!==w[_]?R(d,n,p,2):_--)}}},R=(e,t,n,a,o=null)=>{let{el:s,type:c,transition:l,children:u,shapeFlag:d}=e;if(d&6)R(e.component.subTree,t,n,a);else if(d&128)e.suspense.move(t,n,a);else if(d&64)c.move(e,t,n,V);else if(c===Pi){r(s,t,n);for(let e=0;e<u.length;e++)R(u[e],t,n,a);r(e.anchor,t,n)}else if(c===Li)S(e,t,n);else if(a!==2&&d&1&&l){if(a===0)l.persisted&&!s[zn]?r(s,t,n):(l.beforeEnter(s),r(s,t,n),xi(()=>l.enter(s),o));else{let{leave:a,delayLeave:o,afterLeave:c}=l,u=()=>{e.ctx.isUnmounted?i(s):r(s,t,n)},d=()=>{let e=s._isLeaving||!!s[zn];s._isLeaving&&s[zn](!0),l.persisted&&!e?u():a(s,()=>{u(),c&&c()})};o?o(s,u,d):d()}}else r(s,t,n)},z=(e,t,n,r=!1,i=!1)=>{let{type:a,props:o,ref:s,children:c,dynamicChildren:l,shapeFlag:u,patchFlag:d,dirs:f,cacheIndex:p,memo:m}=e;if((d===-2||l&&l.hasOnce)&&(i=!1),s!=null&&(Ue(),qn(s,null,n,e,!0),We()),p!=null&&(!e.ctx||e.ctx===t)&&(t.renderCache[p]=void 0),u&256){t.ctx.deactivate(e);return}let h=u&1&&f,g=!Jn(e),_;if(g&&(_=o&&o.onVnodeBeforeUnmount)&&aa(_,t,e),u&6)oe(e.component,n,r);else{if(u&128){e.suspense.unmount(n,r);return}h&&On(e,null,t,`beforeUnmount`),u&64?e.type.remove(e,t,n,V,r):l&&!l.hasOnce&&(a!==Pi||d>0&&d&64)?B(l,t,n,!1,!0):(a===Pi&&d&384||!i&&u&16)&&B(c,t,n),r&&ie(e)}let v=m!=null&&p==null;(g&&(_=o&&o.onVnodeUnmounted)||h||v)&&xi(()=>{_&&aa(_,t,e),h&&On(e,null,t,`unmounted`),v&&(e.el=null)},n)},ie=e=>{let{type:t,el:n,anchor:r,transition:a}=e,o=t===Pi;if(o&&!a){ae(n,r);return}if(t===Li){C(e),a&&!a.persisted&&a.afterLeave&&a.afterLeave();return}let s=o?Un(e):e,c=()=>{o?m(n)&&ae(n,r):i(n),a&&!a.persisted&&a.afterLeave&&a.afterLeave()};if(s&&s.shapeFlag&1&&a&&!a.persisted){let{leave:e,delayLeave:t}=a,n=s.el,r=()=>e(n,c);t?t(n,c,r):r()}else c()},ae=(e,t)=>{let n;for(;e!==t;)n=h(e),i(e),e=n;i(t)},oe=(e,t,n)=>{let{bum:r,scope:i,job:a,subTree:o,um:s,m:c,a:l}=e;Ai(c),Ai(l),r&&re(r),i.stop(),a?(a.flags|=8,z(o,e,t,n)):e.vnode.el&&o&&(o.transition=e.vnode.transition,z(o,e,t,n)),s&&xi(s,t),xi(()=>{e.isUnmounted=!0},t)},B=(e,t,n,r=!1,i=!1,a=0)=>{for(let o=a;o<e.length;o++)z(e[o],t,n,r,i)},ce=e=>{if(e.shapeFlag&6)return ce(e.component.subTree);if(e.shapeFlag&128)return e.suspense.next();let t=h(e.anchor||e.el),n=t&&t[Ln];return n?h(n):t},le=(e,t,n)=>{bn(()=>{e==null?t._vnode&&z(t._vnode,null,null,!0):v(t._vnode||null,e,t,null,null,null,n),t._vnode=e},e&&t._vnode?void 0:e&&e.component?e.component.uid:ca())},V={p:v,um:z,m:R,r:ie,mt:M,mc:D,pc:I,pbc:k,n:ce,o:e},ue,de;return t&&([ue,de]=t(V)),{render:le,hydrate:ue,createApp:Hr(le,ue)}}function wi({type:e,props:t},n){return n===`svg`&&e===`foreignObject`||n===`mathml`&&e===`annotation-xml`&&t&&t.encoding&&t.encoding.includes(`html`)?void 0:n}function Ti({effect:e,job:t},n){n?(e.flags|=32,t.flags|=4):(e.flags&=-33,t.flags&=-5)}function Ei(e,t){return(!e||e&&!e.pendingBranch)&&t&&!t.persisted}function Di(e,t,n=!1){let r=e.children,i=t.children;if(b(r)&&b(i))for(let e=0;e<r.length;e++){let t=r[e],a=i[e];a.shapeFlag&1&&!a.dynamicChildren&&((a.patchFlag<=0||a.patchFlag===32)&&(a=i[e]=na(i[e]),a.el=t.el),!n&&a.patchFlag!==-2&&Di(t,a)),a.type===Fi&&(a.patchFlag===-1&&(a=i[e]=na(a)),a.el=t.el),a.type===Ii&&!a.el&&(a.el=t.el)}}function Oi(e){let t=e.slice(),n=[0],r,i,a,o,s,c=e.length;for(r=0;r<c;r++){let c=e[r];if(c!==0){if(i=n[n.length-1],e[i]<c){t[r]=i,n.push(r);continue}for(a=0,o=n.length-1;a<o;)s=a+o>>1,e[n[s]]<c?a=s+1:o=s;c<e[n[a]]&&(a>0&&(t[r]=n[a-1]),n[a]=r)}}for(a=n.length,o=n[a-1];a-->0;)n[a]=o,o=t[o];return n}function ki(e){let t=e.subTree.component;if(t)return t.asyncDep&&!t.asyncResolved?t:ki(t)}function Ai(e){if(e)for(let t=0;t<e.length;t++)e[t].flags|=8}function ji(e){if(e.placeholder)return e.placeholder;let t=e.component;return t?ji(t.subTree):null}var Mi=e=>e.__isSuspense;function Ni(e,t){t&&t.pendingBranch?b(e)?t.effects.push(...e):t.effects.push(e):gn(e)}var Pi=Symbol.for(`v-fgt`),Fi=Symbol.for(`v-txt`),Ii=Symbol.for(`v-cmt`),Li=Symbol.for(`v-stc`),Ri=[],zi=null;function Bi(e=!1){Ri.push(zi=e?null:[])}function Vi(){Ri.pop(),zi=Ri[Ri.length-1]||null}var Hi=1;function Ui(e,t=!1){Hi+=e,e<0&&zi&&t&&(zi.hasOnce=!0)}function Wi(e){return e.dynamicChildren=Hi>0?zi||d:null,Vi(),Hi>0&&zi&&zi.push(e),e}function Gi(e,t,n,r,i,a){return Wi(X(e,t,n,r,i,a,!0))}function Ki(e,t,n,r,i){return Wi(Z(e,t,n,r,i,!0))}function qi(e){return e?e.__v_isVNode===!0:!1}function Ji(e,t){return e.type===t.type&&e.key===t.key}var Yi=({key:e})=>e??null,Xi=({ref:e,ref_key:t,ref_for:n})=>(typeof e==`number`&&(e=``+e),e==null?null:T(e)||qt(e)||w(e)?{i:Cn,r:e,k:t,f:!!n}:e);function X(e,t=null,n=null,r=0,i=null,a=e===Pi?0:1,o=!1,s=!1){let c={__v_isVNode:!0,__v_skip:!0,type:e,props:t,key:t&&Yi(t),ref:t&&Xi(t),scopeId:wn,slotScopeIds:null,children:n,component:null,suspense:null,ssContent:null,ssFallback:null,dirs:null,transition:null,el:null,anchor:null,target:null,targetStart:null,targetAnchor:null,staticCount:0,shapeFlag:a,patchFlag:r,dynamicProps:i,dynamicChildren:null,appContext:null,ctx:Cn};return s?(ra(c,n),a&128&&e.normalize(c)):n&&(c.shapeFlag|=T(n)?8:16),Hi>0&&!o&&zi&&(c.patchFlag>0||a&6)&&c.patchFlag!==32&&zi.push(c),c}var Z=Zi;function Zi(e,t=null,n=null,r=0,i=null,a=!1){if((!e||e===mr)&&(e=Ii),qi(e)){let r=$i(e,t,!0);return n&&ra(r,n),Hi>0&&!a&&zi&&(r.shapeFlag&6?zi[zi.indexOf(e)]=r:zi.push(r)),r.patchFlag=-2,r}if(Ea(e)&&(e=e.__vccOpts),t){t=Qi(t);let{class:e,style:n}=t;e&&!T(e)&&(t.class=de(e)),D(n)&&(Ut(n)&&!b(n)&&(n=g({},n)),t.style=B(n))}let o=T(e)?1:Mi(e)?128:Rn(e)?64:D(e)?4:w(e)?2:0;return X(e,t,n,r,i,o,a,!0)}function Qi(e){return e?Ut(e)||ai(e)?g({},e):e:null}function $i(e,t,n=!1,r=!1){let{props:i,ref:a,patchFlag:o,children:s,transition:c}=e,l=t?ia(i||{},t):i,u={__v_isVNode:!0,__v_skip:!0,type:e.type,props:l,key:l&&Yi(l),ref:t&&t.ref?n&&a?b(a)?a.concat(Xi(t)):[a,Xi(t)]:Xi(t):a,scopeId:e.scopeId,slotScopeIds:e.slotScopeIds,children:s,target:e.target,targetStart:e.targetStart,targetAnchor:e.targetAnchor,staticCount:e.staticCount,shapeFlag:e.shapeFlag,patchFlag:t&&e.type!==Pi?o===-1?16:o|16:o,dynamicProps:e.dynamicProps,dynamicChildren:e.dynamicChildren,appContext:e.appContext,dirs:e.dirs,transition:c,component:e.component,suspense:e.suspense,ssContent:e.ssContent&&$i(e.ssContent),ssFallback:e.ssFallback&&$i(e.ssFallback),placeholder:e.placeholder,el:e.el,anchor:e.anchor,ctx:e.ctx,ce:e.ce,cacheIndex:e.cacheIndex};return c&&r&&Hn(u,c.clone(u)),u}function Q(e=` `,t=0){return Z(Fi,null,e,t)}function ea(e=``,t=!1){return t?(Bi(),Ki(Ii,null,e)):Z(Ii,null,e)}function ta(e){return e==null||typeof e==`boolean`?Z(Ii):b(e)?Z(Pi,null,e.slice()):qi(e)?na(e):Z(Fi,null,String(e))}function na(e){return e.el===null&&e.patchFlag!==-1||e.memo?e:$i(e)}function ra(e,t){let n=0,{shapeFlag:r}=e;if(t==null)t=null;else if(b(t))n=16;else if(typeof t==`object`){if(r&65){let n=t.default;n&&(n._c&&(n._d=!1),ra(e,n()),n._c&&(n._d=!0));return}{n=32;let r=t._;!r&&!ai(t)?t._ctx=Cn:r===3&&Cn&&(Cn.slots._===1?t._=1:(t._=2,e.patchFlag|=1024))}}else if(w(t)){if(r&65){ra(e,{default:t});return}t={default:t,_ctx:Cn},n=32}else t=String(t),r&64?(n=16,t=[Q(t)]):n=8;e.children=t,e.shapeFlag|=n}function ia(...e){let t={};for(let n=0;n<e.length;n++){let r=e[n];for(let e in r)if(e===`class`)t.class!==r.class&&(t.class=de([t.class,r.class]));else if(e===`style`)t.style=B([t.style,r.style]);else if(m(e)){let n=t[e],i=r[e];i&&n!==i&&!(b(n)&&n.includes(i))?t[e]=n?[].concat(n,i):i:i==null&&n==null&&!h(e)&&(t[e]=i)}else e!==``&&(t[e]=r[e])}return t}function aa(e,t,n,r=null){K(e,t,7,[n,r])}var oa=Br(),sa=0;function ca(){return sa}function la(e,t,n){let r=e.type,i=(t?t.appContext:e.appContext)||oa,a={uid:sa++,vnode:e,type:r,parent:t,appContext:i,root:null,next:null,subTree:null,effect:null,update:null,job:null,scope:new Te(!0),render:null,proxy:null,exposed:null,exposeProxy:null,withProxy:null,provides:t?t.provides:Object.create(i.provides),ids:t?t.ids:[``,0,0],accessCache:null,renderCache:[],components:null,directives:null,propsOptions:di(r,i),emitsOptions:qr(r,i),emit:null,emitted:null,propsDefaults:u,inheritAttrs:r.inheritAttrs,ctx:u,data:u,props:u,attrs:u,slots:u,refs:u,setupState:u,setupContext:null,suspense:n,suspenseId:n?n.pendingId:0,asyncDep:null,asyncResolved:!1,isMounted:!1,isUnmounted:!1,isDeactivated:!1,bc:null,c:null,bm:null,m:null,bu:null,u:null,um:null,bum:null,da:null,a:null,rtg:null,rtc:null,ec:null,sp:null};return a.ctx={_:a},a.root=t?t.root:a,a.emit=Gr.bind(null,a),e.ce&&e.ce(a),a}var ua=null,da=()=>ua||Cn,fa,pa;{let e=se(),t=(t,n)=>{let r;return(r=e[t])||(r=e[t]=[]),r.push(n),e=>{r.length>1?r.forEach(t=>t(e)):r[0](e)}};fa=t(`__VUE_INSTANCE_SETTERS__`,e=>ua=e),pa=t(`__VUE_SSR_SETTERS__`,e=>_a=e)}var ma=e=>{let t=ua;return fa(e),e.scope.on(),()=>{e.scope.off(),fa(t)}},ha=()=>{ua&&ua.scope.off(),fa(null)};function ga(e){return e.vnode.shapeFlag&4}var _a=!1;function va(e,t=!1,n=!1){t&&pa(t);let{props:r,children:i}=e.vnode,a=ga(e);oi(e,r,a,t),yi(e,i,n||t);let o=a?ya(e,t):void 0;return t&&pa(!1),o}function ya(e,t){let n=e.type;e.accessCache=Object.create(null),e.proxy=new Proxy(e.ctx,Cr);let{setup:r}=n;if(r){Ue();let n=e.setupContext=r.length>1?Ca(e):null,i=ma(e),a=rn(r,e,0,[e.props,n]),o=O(a);if(We(),i(),(o||e.sp)&&!Jn(e)&&Wn(e),o){if(a.then(ha,ha),t)return a.then(n=>{pa(!0);try{ba(e,n,t)}finally{pa(!1)}}).catch(t=>{an(t,e,0)});e.asyncDep=a}else ba(e,a,t)}else xa(e,t)}function ba(e,t,n){w(t)?e.type.__ssrInlineRender?e.ssrRender=t:e.render=t:D(t)&&(e.setupState=Xt(t)),xa(e,n)}function xa(e,t,n){let r=e.type;e.render||=r.render||f;{let t=ma(e);Ue();try{Er(e)}finally{We(),t()}}}var Sa={get(e,t){return et(e,`get`,``),e[t]}};function Ca(e){return{attrs:new Proxy(e.attrs,Sa),slots:e.slots,emit:e.emit,expose:t=>{e.exposed=t||{}}}}function wa(e){return e.exposed?e.exposeProxy||=new Proxy(Xt(Wt(e.exposed)),{get(t,n){if(n in t)return t[n];if(n in xr)return xr[n](e)},has(e,t){return t in e||t in xr}}):e.proxy}function Ta(e,t=!0){return w(e)?e.displayName||e.name:e.name||t&&e.__name}function Ea(e){return w(e)&&`__vccOpts`in e}var Da=(e,t)=>Qt(e,t,_a),Oa=`3.5.44`,ka=void 0,Aa=typeof window<`u`&&window.trustedTypes;if(Aa)try{ka=Aa.createPolicy(`vue`,{createHTML:e=>e})}catch{}var ja=ka?e=>ka.createHTML(e):e=>e,Ma=`http://www.w3.org/2000/svg`,Na=`http://www.w3.org/1998/Math/MathML`,Pa=typeof document<`u`?document:null,Fa=Pa&&Pa.createElement(`template`),Ia={insert:(e,t,n)=>{t.insertBefore(e,n||null)},remove:e=>{let t=e.parentNode;t&&t.removeChild(e)},createElement:(e,t,n,r)=>{let i=t===`svg`?Pa.createElementNS(Ma,e):t===`mathml`?Pa.createElementNS(Na,e):n?Pa.createElement(e,{is:n}):Pa.createElement(e);return e===`select`&&r&&r.multiple!=null&&i.setAttribute(`multiple`,r.multiple),i},createText:e=>Pa.createTextNode(e),createComment:e=>Pa.createComment(e),setText:(e,t)=>{e.nodeValue=t},setElementText:(e,t)=>{e.textContent=t},parentNode:e=>e.parentNode,nextSibling:e=>e.nextSibling,querySelector:e=>Pa.querySelector(e),setScopeId(e,t){e.setAttribute(t,``)},insertStaticContent(e,t,n,r,i,a){let o=n?n.previousSibling:t.lastChild;if(i&&(i===a||i.nextSibling))for(;t.insertBefore(i.cloneNode(!0),n),i!==a&&(i=i.nextSibling););else{Fa.innerHTML=ja(r===`svg`?`<svg>${e}</svg>`:r===`mathml`?`<math>${e}</math>`:e);let i=Fa.content;if(r===`svg`||r===`mathml`){let e=i.firstChild;for(;e.firstChild;)i.appendChild(e.firstChild);i.removeChild(e)}t.insertBefore(i,n)}return[o?o.nextSibling:t.firstChild,n?n.previousSibling:t.lastChild]}},La=Symbol(`_vtc`);function Ra(e,t,n){let r=e[La];r&&(t=(t?[t,...r]:[...r]).join(` `)),t==null?e.removeAttribute(`class`):n?e.setAttribute(`class`,t):e.className=t}var za=Symbol(`_vod`),Ba=Symbol(`_vsh`),Va=Symbol(``),Ha=/(?:^|;)\s*display\s*:/;function Ua(e,t,n){let r=e.style,i=T(n),a=!1;if(n&&!i){if(t){if(T(t))for(let e of t.split(`;`)){let t=e.slice(0,e.indexOf(`:`)).trim();n[t]??Ga(r,t,``)}else for(let e in t)n[e]??Ga(r,e,``)}for(let i in n){i===`display`&&(a=!0);let o=n[i];o==null?Ga(r,i,``):Ya(e,i,!T(t)&&t?t[i]:void 0,o)||Ga(r,i,o)}}else if(i){if(t!==n){let e=r[Va];e&&(n+=`;`+e),r.cssText=n,a=Ha.test(n)}}else t&&e.removeAttribute(`style`);za in e&&((!i||t!==n)&&(e[za]=a?r.display:``),e[Ba]&&(r.display=`none`))}var Wa=/\s*!important$/;function Ga(e,t,n){if(b(n))n.forEach(n=>Ga(e,t,n));else if(n??=``,t.startsWith(`--`))Wa.test(n)?e.setProperty(t,n.replace(Wa,``),`important`):e.setProperty(t,n);else{let r=Ja(e,t);Wa.test(n)?e.setProperty(ne(r),n.replace(Wa,``),`important`):e[r]=n}}var Ka=[`Webkit`,`Moz`,`ms`],qa={};function Ja(e,t){let n=qa[t];if(n)return n;let r=F(t);if(r!==`filter`&&r in e)return qa[t]=r;r=L(r);for(let n=0;n<Ka.length;n++){let i=Ka[n]+r;if(i in e)return qa[t]=i}return t}function Ya(e,t,n,r){return e.tagName===`TEXTAREA`&&(t===`width`||t===`height`)&&T(r)&&n===r}var Xa=`http://www.w3.org/1999/xlink`;function Za(e,t,n,r,i,a=fe(t)){r&&t.startsWith(`xlink:`)?n==null?e.removeAttributeNS(Xa,t.slice(6,t.length)):e.setAttributeNS(Xa,t,n):n==null||a&&!pe(n)?e.removeAttribute(t):e.setAttribute(t,a?``:E(n)?String(n):n)}function Qa(e,t,n,r,i){if(t===`innerHTML`||t===`textContent`){n!=null&&(e[t]=t===`innerHTML`?ja(n):n);return}let a=e.tagName;if(t===`value`&&a!==`PROGRESS`&&!a.includes(`-`)){let r=a===`OPTION`?e.getAttribute(`value`)||``:e.value,i=n==null?e.type===`checkbox`?`on`:``:String(n);(r!==i||!(`_value`in e))&&(e.value=i),n??e.removeAttribute(t),e._value=n;return}let o=!1;if(n===``||n==null){let r=typeof e[t];r===`boolean`?n=pe(n):n==null&&r===`string`?(n=``,o=!0):r===`number`&&(n=0,o=!0)}try{e[t]=n}catch{}o&&e.removeAttribute(i||t)}function $a(e,t,n,r){e.addEventListener(t,n,r)}function eo(e,t,n,r){e.removeEventListener(t,n,r)}var to=Symbol(`_vei`);function no(e,t,n,r,i=null){let a=e[to]||(e[to]={}),o=a[t];if(r&&o)o.value=r;else{let[n,s]=ao(t);r?$a(e,n,a[t]=lo(r,i),s):o&&(eo(e,n,o,s),a[t]=void 0)}}var ro=/(Once|Passive|Capture)$/,io=/^on:?(?:Once|Passive|Capture)$/;function ao(e){let t,n;for(;(n=e.match(ro))&&!io.test(e);)t||={},e=e.slice(0,e.length-n[1].length),t[n[1].toLowerCase()]=!0;return[e[2]===`:`?e.slice(3):ne(e.slice(2)),t]}var oo=0,so=Promise.resolve(),co=()=>oo||=(so.then(()=>oo=0),Date.now());function lo(e,t){let n=e=>{if(!e._vts)e._vts=Date.now();else if(e._vts<=n.attached)return;let r=n.value;if(b(r)){let n=e.stopImmediatePropagation;e.stopImmediatePropagation=()=>{n.call(e),e._stopped=!0};let i=r.slice(),a=[e];for(let n=0;n<i.length&&!e._stopped;n++){let e=i[n];e&&K(e,t,5,a)}}else K(r,t,5,[e])};return n.value=e,n.attached=co(),n}var uo=e=>e.charCodeAt(0)===111&&e.charCodeAt(1)===110&&e.charCodeAt(2)>96&&e.charCodeAt(2)<123,fo=(e,t,n,r,i,a)=>{let o=i===`svg`;t===`class`?Ra(e,r,o):t===`style`?Ua(e,n,r):m(t)?h(t)||no(e,t,n,r,a):(t[0]===`.`?(t=t.slice(1),1):t[0]===`^`?(t=t.slice(1),0):po(e,t,r,o))?(Qa(e,t,r),!e.tagName.includes(`-`)&&(t===`value`||t===`checked`||t===`selected`)&&Za(e,t,r,o,a,t!==`value`)):e._isVueCE&&(mo(e,t)||e._def.__asyncLoader&&(/[A-Z]/.test(t)||!T(r)))?Qa(e,F(t),r,a,t):(t===`true-value`?e._trueValue=r:t===`false-value`&&(e._falseValue=r),Za(e,t,r,o))};function po(e,t,n,r){if(r)return!!(t===`innerHTML`||t===`textContent`||t in e&&uo(t)&&w(n));if(t===`spellcheck`||t===`draggable`||t===`translate`||t===`autocorrect`||t===`sandbox`&&e.tagName===`IFRAME`||t===`form`||t===`list`&&e.tagName===`INPUT`||t===`type`&&e.tagName===`TEXTAREA`)return!1;if(t===`width`||t===`height`){let t=e.tagName;if(t===`IMG`||t===`VIDEO`||t===`CANVAS`||t===`SOURCE`)return!1}return uo(t)&&T(n)?!1:t in e}function mo(e,t){let n=e._def.props;if(!n)return!1;let r=F(t);return Array.isArray(n)?n.some(e=>F(e)===r):Object.keys(n).some(e=>F(e)===r)}var ho=e=>{let t=e.props[`onUpdate:modelValue`]||!1;return b(t)?e=>re(t,e):t};function go(e){e.target.composing=!0}function _o(e){let t=e.target;t.composing&&(t.composing=!1,t.dispatchEvent(new Event(`input`)))}var vo=Symbol(`_assign`),yo=Symbol(`_initialValue`);function bo(e,t,n){return t&&(e=e.trim()),n&&(e=ae(e)),e}var xo={created(e,{modifiers:{lazy:t,trim:n,number:r}},i){e.parentNode&&(e.type===`text`?e[yo]=e.defaultValue.replace(/[\r\n]/g,``):e.type===`textarea`&&(e[yo]=e.defaultValue.replace(/\r\n?/g,`
`))),e[vo]=ho(i);let a=r||i.props&&i.props.type===`number`;$a(e,t?`change`:`input`,t=>{t.target.composing||e[vo](bo(e.value,n,a))}),(n||a)&&$a(e,`change`,()=>{e.value=bo(e.value,n,a)}),t||($a(e,`compositionstart`,go),$a(e,`compositionend`,_o),$a(e,`change`,_o))},mounted(e,{value:t,modifiers:{trim:n,number:r}}){let i=t??``,a=e[yo];delete e[yo],a!==void 0&&(e.type===`text`||e.type===`textarea`)&&e.value!==a?e[vo](bo(e.value,n,r)):e.value=i},beforeUpdate(e,{value:t,oldValue:n,modifiers:{lazy:r,trim:i,number:a}},o){if(e[vo]=ho(o),e.composing)return;let s=(a||e.type===`number`)&&!/^0\d/.test(e.value)?ae(e.value):e.value,c=t??``;if(s===c)return;let l=e.getRootNode();(l instanceof Document||l instanceof ShadowRoot)&&l.activeElement===e&&e.type!==`range`&&(r&&t===n||i&&e.value.trim()===c)||(e.value=c)}},So={deep:!0,created(e,t,n){e[vo]=ho(n),$a(e,`change`,()=>{let t=e._modelValue,n=Do(e),r=e.checked,i=e[vo];if(b(t)){let e=ye(t,n),a=e!==-1;if(r&&!a)i(t.concat(n));else if(!r&&a){let n=[...t];n.splice(e,1),i(n)}}else if(S(t)){let e=new Set(t);r?e.add(n):e.delete(n),i(e)}else i(Oo(e,r))})},mounted:Co,beforeUpdate(e,t,n){e[vo]=ho(n),Co(e,t,n)}};function Co(e,{value:t,oldValue:n},r){e._modelValue=t;let i;if(b(t))i=ye(t,r.props.value)>-1;else if(S(t))i=t.has(r.props.value);else{if(t===n)return;i=ve(t,Oo(e,!0))}e.checked!==i&&(e.checked=i)}var wo={deep:!0,created(e,{value:t,modifiers:{number:n}},r){e._modelValue=t,$a(e,`change`,()=>{let t=Array.prototype.filter.call(e.options,e=>e.selected).map(e=>n?ae(Do(e)):Do(e)),r=e.multiple,i=r?S(e._modelValue)?new Set(t):t:t[0],a=e._pendingValue=[r,r?b(i)?t.slice():t:i];try{e[vo](i)}finally{J(()=>{e._pendingValue===a&&(e._pendingValue=void 0)})}}),e[vo]=ho(r)},mounted(e,{value:t}){Eo(e,t)},beforeUpdate(e,{value:t},n){e._modelValue=t,e[vo]=ho(n)},updated(e,{value:t}){let n=e._pendingValue;e._pendingValue=void 0,(!n||n[0]!==e.multiple||!To(t,n[1],n[0]))&&Eo(e,t)}};function To(e,t,n){if(!n||b(e))return ve(e,t);if(S(e)){if(e.size!==t.length)return!1;for(let n of t)if(!e.has(n))return!1;return!0}return!1}function Eo(e,t){let n=e.multiple,r=b(t);if(!n||r||S(t)){for(let i=0,a=e.options.length;i<a;i++){let a=e.options[i],o=Do(a);if(n){if(r){let e=typeof o;a.selected=e===`string`||e===`number`?t.some(e=>String(e)===String(o)):ye(t,o)>-1}else a.selected=t.has(o)}else if(ve(Do(a),t)){e.selectedIndex!==i&&(e.selectedIndex=i);return}}!n&&e.selectedIndex!==-1&&(e.selectedIndex=-1)}}function Do(e){return`_value`in e?e._value:e.value}function Oo(e,t){let n=t?`_trueValue`:`_falseValue`;return n in e?e[n]:t}var ko=[`ctrl`,`shift`,`alt`,`meta`],Ao={stop:e=>e.stopPropagation(),prevent:e=>e.preventDefault(),self:e=>e.target!==e.currentTarget,ctrl:e=>!e.ctrlKey,shift:e=>!e.shiftKey,alt:e=>!e.altKey,meta:e=>!e.metaKey,left:e=>`button`in e&&e.button!==0,middle:e=>`button`in e&&e.button!==1,right:e=>`button`in e&&e.button!==2,exact:(e,t)=>ko.some(n=>e[`${n}Key`]&&!t.includes(n))},jo=(e,t)=>{if(!e)return e;let n=e._withMods||={},r=t.join(`.`);return n[r]||(n[r]=((n,...r)=>{for(let e=0;e<t.length;e++){let r=Ao[t[e]];if(r&&r(n,t))return}return e(n,...r)}))},Mo=g({patchProp:fo},Ia),No;function Po(){return No||=Si(Mo)}var Fo=((...e)=>{let t=Po().createApp(...e),{mount:n}=t;return t.mount=e=>{let r=Lo(e);if(!r)return;let i=t._component;!w(i)&&!i.render&&!i.template&&(i.template=r.innerHTML),r.nodeType===1&&(r.textContent=``);let a=n(r,!1,Io(r));return r instanceof Element&&(r.removeAttribute(`v-cloak`),r.setAttribute(`data-v-app`,``)),a},t});function Io(e){if(e instanceof SVGElement)return`svg`;if(typeof MathMLElement==`function`&&e instanceof MathMLElement)return`mathml`}function Lo(e){return T(e)?document.querySelector(e):e}var Ro=function(e){Bo(e);var t=zo(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function zo(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function Bo(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}var Vo=1e-6,Ho=typeof Float32Array<`u`?Float32Array:Array;function Uo(e){Ho=e}Math.hypot||(Math.hypot=function(){for(var e=0,t=arguments.length;t--;)e+=arguments[t]*arguments[t];return Math.sqrt(e)});function Wo(){var e=new Ho(9);return Ho!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[5]=0,e[6]=0,e[7]=0),e[0]=1,e[4]=1,e[8]=1,e}function Go(){var e=new Ho(16);return Ho!=Float32Array&&(e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0),e[0]=1,e[5]=1,e[10]=1,e[15]=1,e}function Ko(e,t){return e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function qo(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=t[4],s=t[5],c=t[6],l=t[7],u=t[8],d=t[9],f=t[10],p=t[11],m=t[12],h=t[13],g=t[14],_=t[15],v=n*s-r*o,y=n*c-i*o,b=n*l-a*o,x=r*c-i*s,S=r*l-a*s,C=i*l-a*c,w=u*h-d*m,T=u*g-f*m,E=u*_-p*m,D=d*g-f*h,O=d*_-p*h,k=f*_-p*g,A=v*k-y*O+b*D+x*E-S*T+C*w;return A?(A=1/A,e[0]=(s*k-c*O+l*D)*A,e[1]=(i*O-r*k-a*D)*A,e[2]=(h*C-g*S+_*x)*A,e[3]=(f*S-d*C-p*x)*A,e[4]=(c*E-o*k-l*T)*A,e[5]=(n*k-i*E+a*T)*A,e[6]=(g*b-m*C-_*y)*A,e[7]=(u*C-f*b+p*y)*A,e[8]=(o*O-s*E+l*w)*A,e[9]=(r*E-n*O-a*w)*A,e[10]=(m*S-h*b+_*v)*A,e[11]=(d*b-u*S-p*v)*A,e[12]=(s*T-o*D-c*w)*A,e[13]=(n*D-r*T+i*w)*A,e[14]=(h*y-m*x-g*v)*A,e[15]=(u*x-d*y+f*v)*A,e):null}function Jo(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=t[4],c=t[5],l=t[6],u=t[7],d=t[8],f=t[9],p=t[10],m=t[11],h=t[12],g=t[13],_=t[14],v=t[15],y=n[0],b=n[1],x=n[2],S=n[3];return e[0]=y*r+b*s+x*d+S*h,e[1]=y*i+b*c+x*f+S*g,e[2]=y*a+b*l+x*p+S*_,e[3]=y*o+b*u+x*m+S*v,y=n[4],b=n[5],x=n[6],S=n[7],e[4]=y*r+b*s+x*d+S*h,e[5]=y*i+b*c+x*f+S*g,e[6]=y*a+b*l+x*p+S*_,e[7]=y*o+b*u+x*m+S*v,y=n[8],b=n[9],x=n[10],S=n[11],e[8]=y*r+b*s+x*d+S*h,e[9]=y*i+b*c+x*f+S*g,e[10]=y*a+b*l+x*p+S*_,e[11]=y*o+b*u+x*m+S*v,y=n[12],b=n[13],x=n[14],S=n[15],e[12]=y*r+b*s+x*d+S*h,e[13]=y*i+b*c+x*f+S*g,e[14]=y*a+b*l+x*p+S*_,e[15]=y*o+b*u+x*m+S*v,e}function Yo(e,t,n){var r=n[0],i=n[1],a=n[2],o,s,c,l,u,d,f,p,m,h,g,_;return t===e?(e[12]=t[0]*r+t[4]*i+t[8]*a+t[12],e[13]=t[1]*r+t[5]*i+t[9]*a+t[13],e[14]=t[2]*r+t[6]*i+t[10]*a+t[14],e[15]=t[3]*r+t[7]*i+t[11]*a+t[15]):(o=t[0],s=t[1],c=t[2],l=t[3],u=t[4],d=t[5],f=t[6],p=t[7],m=t[8],h=t[9],g=t[10],_=t[11],e[0]=o,e[1]=s,e[2]=c,e[3]=l,e[4]=u,e[5]=d,e[6]=f,e[7]=p,e[8]=m,e[9]=h,e[10]=g,e[11]=_,e[12]=o*r+u*i+m*a+t[12],e[13]=s*r+d*i+h*a+t[13],e[14]=c*r+f*i+g*a+t[14],e[15]=l*r+p*i+_*a+t[15]),e}function Xo(e,t,n){var r=n[0],i=n[1],a=n[2];return e[0]=t[0]*r,e[1]=t[1]*r,e[2]=t[2]*r,e[3]=t[3]*r,e[4]=t[4]*i,e[5]=t[5]*i,e[6]=t[6]*i,e[7]=t[7]*i,e[8]=t[8]*a,e[9]=t[9]*a,e[10]=t[10]*a,e[11]=t[11]*a,e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15],e}function Zo(e,t,n,r){var i=r[0],a=r[1],o=r[2],s=Math.hypot(i,a,o),c,l,u,d,f,p,m,h,g,_,v,y,b,x,S,C,w,T,E,D,O,k,A,j;return s<Vo?null:(s=1/s,i*=s,a*=s,o*=s,c=Math.sin(n),l=Math.cos(n),u=1-l,d=t[0],f=t[1],p=t[2],m=t[3],h=t[4],g=t[5],_=t[6],v=t[7],y=t[8],b=t[9],x=t[10],S=t[11],C=i*i*u+l,w=a*i*u+o*c,T=o*i*u-a*c,E=i*a*u-o*c,D=a*a*u+l,O=o*a*u+i*c,k=i*o*u+a*c,A=a*o*u-i*c,j=o*o*u+l,e[0]=d*C+h*w+y*T,e[1]=f*C+g*w+b*T,e[2]=p*C+_*w+x*T,e[3]=m*C+v*w+S*T,e[4]=d*E+h*D+y*O,e[5]=f*E+g*D+b*O,e[6]=p*E+_*D+x*O,e[7]=m*E+v*D+S*O,e[8]=d*k+h*A+y*j,e[9]=f*k+g*A+b*j,e[10]=p*k+_*A+x*j,e[11]=m*k+v*A+S*j,t!==e&&(e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e)}function Qo(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[4],o=t[5],s=t[6],c=t[7],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[0]=t[0],e[1]=t[1],e[2]=t[2],e[3]=t[3],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[4]=a*i+l*r,e[5]=o*i+u*r,e[6]=s*i+d*r,e[7]=c*i+f*r,e[8]=l*i-a*r,e[9]=u*i-o*r,e[10]=d*i-s*r,e[11]=f*i-c*r,e}function $o(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[8],u=t[9],d=t[10],f=t[11];return t!==e&&(e[4]=t[4],e[5]=t[5],e[6]=t[6],e[7]=t[7],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i-l*r,e[1]=o*i-u*r,e[2]=s*i-d*r,e[3]=c*i-f*r,e[8]=a*r+l*i,e[9]=o*r+u*i,e[10]=s*r+d*i,e[11]=c*r+f*i,e}function es(e,t,n){var r=Math.sin(n),i=Math.cos(n),a=t[0],o=t[1],s=t[2],c=t[3],l=t[4],u=t[5],d=t[6],f=t[7];return t!==e&&(e[8]=t[8],e[9]=t[9],e[10]=t[10],e[11]=t[11],e[12]=t[12],e[13]=t[13],e[14]=t[14],e[15]=t[15]),e[0]=a*i+l*r,e[1]=o*i+u*r,e[2]=s*i+d*r,e[3]=c*i+f*r,e[4]=l*i-a*r,e[5]=u*i-o*r,e[6]=d*i-s*r,e[7]=f*i-c*r,e}function ts(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3],s=r+r,c=i+i,l=a+a,u=r*s,d=r*c,f=r*l,p=i*c,m=i*l,h=a*l,g=o*s,_=o*c,v=o*l;return e[0]=1-(p+h),e[1]=d+v,e[2]=f-_,e[3]=0,e[4]=d-v,e[5]=1-(u+h),e[6]=m+g,e[7]=0,e[8]=f+_,e[9]=m-g,e[10]=1-(u+p),e[11]=0,e[12]=n[0],e[13]=n[1],e[14]=n[2],e[15]=1,e}function ns(e,t){return e[0]=t[12],e[1]=t[13],e[2]=t[14],e}function rs(e,t){var n=t[0],r=t[1],i=t[2],a=t[4],o=t[5],s=t[6],c=t[8],l=t[9],u=t[10];return e[0]=Math.hypot(n,r,i),e[1]=Math.hypot(a,o,s),e[2]=Math.hypot(c,l,u),e}function is(e,t){var n=new Ho(3);rs(n,t);var r=1/n[0],i=1/n[1],a=1/n[2],o=t[0]*r,s=t[1]*i,c=t[2]*a,l=t[4]*r,u=t[5]*i,d=t[6]*a,f=t[8]*r,p=t[9]*i,m=t[10]*a,h=o+u+m,g=0;return h>0?(g=Math.sqrt(h+1)*2,e[3]=.25*g,e[0]=(d-p)/g,e[1]=(f-c)/g,e[2]=(s-l)/g):o>u&&o>m?(g=Math.sqrt(1+o-u-m)*2,e[3]=(d-p)/g,e[0]=.25*g,e[1]=(s+l)/g,e[2]=(f+c)/g):u>m?(g=Math.sqrt(1+u-o-m)*2,e[3]=(f-c)/g,e[0]=(s+l)/g,e[1]=.25*g,e[2]=(d+p)/g):(g=Math.sqrt(1+m-o-u)*2,e[3]=(s-l)/g,e[0]=(f+c)/g,e[1]=(d+p)/g,e[2]=.25*g),e}function as(e,t,n,r,i){var a=1/Math.tan(t/2),o;return e[0]=a/n,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=a,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,i!=null&&i!==1/0?(o=1/(r-i),e[10]=(i+r)*o,e[14]=2*i*r*o):(e[10]=-1,e[14]=-2*r),e}var os=as;function ss(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=r[0],c=r[1],l=r[2],u=i-n[0],d=a-n[1],f=o-n[2],p=u*u+d*d+f*f;p>0&&(p=1/Math.sqrt(p),u*=p,d*=p,f*=p);var m=c*f-l*d,h=l*u-s*f,g=s*d-c*u;return p=m*m+h*h+g*g,p>0&&(p=1/Math.sqrt(p),m*=p,h*=p,g*=p),e[0]=m,e[1]=h,e[2]=g,e[3]=0,e[4]=d*g-f*h,e[5]=f*m-u*g,e[6]=u*h-d*m,e[7]=0,e[8]=u,e[9]=d,e[10]=f,e[11]=0,e[12]=i,e[13]=a,e[14]=o,e[15]=1,e}function cs(){var e=new Ho(3);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e}function ls(e){var t=e[0],n=e[1],r=e[2];return Math.hypot(t,n,r)}function us(e,t,n){var r=new Ho(3);return r[0]=e,r[1]=t,r[2]=n,r}function ds(e,t,n,r){return e[0]=t,e[1]=n,e[2]=r,e}function fs(e,t,n){return e[0]=t[0]+n[0],e[1]=t[1]+n[1],e[2]=t[2]+n[2],e}function ps(e,t,n){return e[0]=t[0]-n[0],e[1]=t[1]-n[1],e[2]=t[2]-n[2],e}function ms(e,t,n,r){return e[0]=t[0]+n[0]*r,e[1]=t[1]+n[1]*r,e[2]=t[2]+n[2]*r,e}function hs(e,t){var n=t[0],r=t[1],i=t[2],a=n*n+r*r+i*i;return a>0&&(a=1/Math.sqrt(a)),e[0]=t[0]*a,e[1]=t[1]*a,e[2]=t[2]*a,e}function gs(e,t){return e[0]*t[0]+e[1]*t[1]+e[2]*t[2]}function _s(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[0],s=n[1],c=n[2];return e[0]=i*c-a*s,e[1]=a*o-r*c,e[2]=r*s-i*o,e}function vs(e,t,n){var r=t[0],i=t[1],a=t[2],o=n[3]*r+n[7]*i+n[11]*a+n[15];return o||=1,e[0]=(n[0]*r+n[4]*i+n[8]*a+n[12])/o,e[1]=(n[1]*r+n[5]*i+n[9]*a+n[13])/o,e[2]=(n[2]*r+n[6]*i+n[10]*a+n[14])/o,e}function ys(e,t,n){var r=n[0],i=n[1],a=n[2],o=n[3],s=t[0],c=t[1],l=t[2],u=i*l-a*c,d=a*s-r*l,f=r*c-i*s,p=i*f-a*d,m=a*u-r*f,h=r*d-i*u,g=o*2;return u*=g,d*=g,f*=g,p*=2,m*=2,h*=2,e[0]=s+u+p,e[1]=c+d+m,e[2]=l+f+h,e}var bs=ps,xs=ls;(function(){var e=cs();return function(t,n,r,i,a,o){var s,c;for(n||=3,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2];return t}})();function Ss(){var e=new Ho(4);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0,e[3]=0),e}function Cs(e,t,n,r,i){return e[0]=t,e[1]=n,e[2]=r,e[3]=i,e}function ws(e,t){var n=t[0],r=t[1],i=t[2],a=t[3],o=n*n+r*r+i*i+a*a;return o>0&&(o=1/Math.sqrt(o)),e[0]=n*o,e[1]=r*o,e[2]=i*o,e[3]=a*o,e}function Ts(e,t,n){var r=t[0],i=t[1],a=t[2],o=t[3];return e[0]=n[0]*r+n[4]*i+n[8]*a+n[12]*o,e[1]=n[1]*r+n[5]*i+n[9]*a+n[13]*o,e[2]=n[2]*r+n[6]*i+n[10]*a+n[14]*o,e[3]=n[3]*r+n[7]*i+n[11]*a+n[15]*o,e}(function(){var e=Ss();return function(t,n,r,i,a,o){var s,c;for(n||=4,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],e[2]=t[s+2],e[3]=t[s+3],a(e,e,o),t[s]=e[0],t[s+1]=e[1],t[s+2]=e[2],t[s+3]=e[3];return t}})();function Es(){var e=new Ho(4);return Ho!=Float32Array&&(e[0]=0,e[1]=0,e[2]=0),e[3]=1,e}function Ds(e,t,n){n*=.5;var r=Math.sin(n);return e[0]=r*t[0],e[1]=r*t[1],e[2]=r*t[2],e[3]=Math.cos(n),e}function Os(e,t,n,r){var i=t[0],a=t[1],o=t[2],s=t[3],c=n[0],l=n[1],u=n[2],d=n[3],f,p=i*c+a*l+o*u+s*d,m,h,g;return p<0&&(p=-p,c=-c,l=-l,u=-u,d=-d),1-p>Vo?(f=Math.acos(p),m=Math.sin(f),h=Math.sin((1-r)*f)/m,g=Math.sin(r*f)/m):(h=1-r,g=r),e[0]=h*i+g*c,e[1]=h*a+g*l,e[2]=h*o+g*u,e[3]=h*s+g*d,e}function ks(e,t){var n=t[0]+t[4]+t[8],r;if(n>0)r=Math.sqrt(n+1),e[3]=.5*r,r=.5/r,e[0]=(t[5]-t[7])*r,e[1]=(t[6]-t[2])*r,e[2]=(t[1]-t[3])*r;else{var i=0;t[4]>t[0]&&(i=1),t[8]>t[i*3+i]&&(i=2);var a=(i+1)%3,o=(i+2)%3;r=Math.sqrt(t[i*3+i]-t[a*3+a]-t[o*3+o]+1),e[i]=.5*r,r=.5/r,e[3]=(t[a*3+o]-t[o*3+a])*r,e[a]=(t[a*3+i]+t[i*3+a])*r,e[o]=(t[o*3+i]+t[i*3+o])*r}return e}var As=Cs,js=ws;(function(){var e=cs(),t=us(1,0,0),n=us(0,1,0);return function(r,i,a){var o=gs(i,a);return o<-.999999?(_s(e,t,i),xs(e)<1e-6&&_s(e,n,i),hs(e,e),Ds(r,e,Math.PI),r):o>.999999?(r[0]=0,r[1]=0,r[2]=0,r[3]=1,r):(_s(e,i,a),r[0]=e[0],r[1]=e[1],r[2]=e[2],r[3]=1+o,js(r,r))}})(),(function(){var e=Es(),t=Es();return function(n,r,i,a,o,s){return Os(e,r,o,s),Os(t,i,a,s),Os(n,e,t,2*s*(1-s)),n}})(),(function(){var e=Wo();return function(t,n,r,i){return e[0]=r[0],e[3]=r[1],e[6]=r[2],e[1]=i[0],e[4]=i[1],e[7]=i[2],e[2]=-n[0],e[5]=-n[1],e[8]=-n[2],js(t,ks(t,e))}})();function Ms(){var e=new Ho(2);return Ho!=Float32Array&&(e[0]=0,e[1]=0),e}(function(){var e=Ms();return function(t,n,r,i,a,o){var s,c;for(n||=2,r||=0,c=i?Math.min(i*n+r,t.length):t.length,s=r;s<c;s+=n)e[0]=t[s],e[1]=t[s+1],a(e,e,o),t[s]=e[0],t[s+1]=e[1];return t}})();var Ns=class{children;parent;model;worldModel;modelViewProjection;worldTransformNeedsUpdate;modelViewProjectionNeedsUpdate;type;scene;constructor(){this.children=[],this.model=Go(),this.worldModel=Go(),this.modelViewProjection=Go(),this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0,this.type=`Element`,this.scene=null,this.parent=null}appendChild(e,t=!1){e.parent=this,t?this.children.unshift(e):this.children.push(e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}insertChildAfter(e,t){e.parent=this;let n=this.children.indexOf(t);if(n<0)throw Error(`Could not find element to insert after`);this.children.splice(n+1,0,e),e.bindScene&&e.bindScene(this.scene),this.scene&&this.scene.renderFrame()}bindScene(e){this.scene=e,this.worldTransformNeedsUpdate=!0,this.modelViewProjectionNeedsUpdate=!0}traverse(e,t){e(this);for(var n=0;n<this.children.length;++n)this.children[n].traverse(e,t);t&&t(this)}rotate(e,t){return Zo(this.model,this.model,e,t),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateX(e){return Qo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateY(e){return $o(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}rotateZ(e){return es(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}scale(e){return Xo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}translate(e){return Yo(this.model,this.model,e),this.worldTransformNeedsUpdate=!0,this.scene&&this.scene.renderFrame(),this}removeChild(e){let t=this.children.indexOf(e);t>-1&&(this.children.splice(t,1),e.bindScene(null)),this.scene&&this.scene.renderFrame()}updateWorldTransform(e=!1){(this.worldTransformNeedsUpdate||e)&&(this.parent?Jo(this.worldModel,this.parent.worldModel,this.model):Ko(this.worldModel,this.model),this.modelViewProjectionNeedsUpdate=!0,this.worldTransformNeedsUpdate=!1,e=!0);let t=e;for(var n=this.children,r=0;r<n.length;r++)t=n[r].updateWorldTransform(e)||t;return t}scheduleMVPUpdate(){this.modelViewProjectionNeedsUpdate=!0;let e=this.children;for(var t=0;t<e.length;t++)e[t].scheduleMVPUpdate()}updateModelViewProjection(e,t){this.modelViewProjectionNeedsUpdate&&=(Jo(this.modelViewProjection,e,t),Jo(this.modelViewProjection,this.modelViewProjection,this.worldModel),!1)}draw(e,t){for(var n=0;n<this.children.length;++n){let r=this.children[n];r.updateModelViewProjection(t.projection,t.view.matrix),r.draw(e,t)}}dispose(){for(var e=0;e<this.children.length;++e)this.children[e].dispose()}},Ps={maxSingleTouchTime:300,singleTapDistanceSquared:25};function Fs(e,t,n){var r=Date.now();let i;return e.addEventListener(`click`,c,{passive:!1}),e.addEventListener(`touchend`,o,{passive:!1}),e.addEventListener(`touchstart`,a,{passive:!1}),s;function a(e){e.touches.length===1&&(r=Date.now(),i={x:e.touches[0].pageX,y:e.touches[0].pageY})}function o(e){if(e.touches.length>1||Date.now()-r>Ps.maxSingleTouchTime)return;let t=e.changedTouches[0];var n=t.pageX-i.x,a=t.pageY-i.y;n*n+a*a<Ps.singleTapDistanceSquared&&c(t)}function s(){e.removeEventListener(`click`,c),e.removeEventListener(`touchend`,o),e.removeEventListener(`touchstart`,a)}function c(e){t.call(n,e)}}var Is=[0,0,0],Ls=[1,0,0],Rs=[0,1,0],zs=[0,0,1],Bs=class{matrix;cameraWorld;position;orientation;center;constructor(e){this.matrix=e||Go(),this.cameraWorld=qo(Go(),this.matrix),this.position=[0,0,0],this.orientation=[0,0,0,1],this.center=[0,0,0],this.deconstructPositionRotation()}lookAt(e,t,n){return ss(this.cameraWorld,e,t,n),qo(this.matrix,this.cameraWorld),this.deconstructPositionRotation(),this}update(){return ts(this.cameraWorld,this.orientation,this.position),qo(this.matrix,this.cameraWorld),this}deconstructPositionRotation(){ns(this.position,this.cameraWorld),is(this.orientation,this.cameraWorld)}translateOnAxis(e,t){let n=ys(Is,e,this.orientation);return ms(this.position,this.position,n,t),this}translateX(e){return this.translateOnAxis(Ls,e)}translateY(e){return this.translateOnAxis(Rs,e)}translateZ(e){return this.translateOnAxis(zs,e)}},Vs={exports:{}},Hs=4,Us=.001,Ws=1e-7,Gs=10,Ks=11,qs=1/(Ks-1),Js=typeof Float32Array==`function`;function Ys(e,t){return 1-3*t+3*e}function Xs(e,t){return 3*t-6*e}function Zs(e){return 3*e}function Qs(e,t,n){return((Ys(t,n)*e+Xs(t,n))*e+Zs(t))*e}function $s(e,t,n){return 3*Ys(t,n)*e*e+2*Xs(t,n)*e+Zs(t)}function ec(e,t,n,r,i){var a,o,s=0;do o=t+(n-t)/2,a=Qs(o,r,i)-e,a>0?n=o:t=o;while(Math.abs(a)>Ws&&++s<Gs);return o}function tc(e,t,n,r){for(var i=0;i<Hs;++i){var a=$s(t,n,r);if(a===0)return t;var o=Qs(t,n,r)-e;t-=o/a}return t}function nc(e){return e}var rc=function(e,t,n,r){if(!(0<=e&&e<=1&&0<=n&&n<=1))throw Error(`bezier x values must be in [0, 1] range`);if(e===t&&n===r)return nc;for(var i=Js?new Float32Array(Ks):Array(Ks),a=0;a<Ks;++a)i[a]=Qs(a*qs,e,n);function o(t){for(var r=0,a=1,o=Ks-1;a!==o&&i[a]<=t;++a)r+=qs;--a;var s=(t-i[a])/(i[a+1]-i[a]),c=r+s*qs,l=$s(c,e,n);return l>=Us?tc(t,c,e,n):l===0?c:ec(t,r,r+qs,e,n)}return function(e){return e===0?0:e===1?1:Qs(o(e),t,r)}},ic={ease:rc(.25,.1,.25,1),easeIn:rc(.42,0,1,1),easeOut:rc(0,0,.58,1),easeInOut:rc(.42,0,.58,1),linear:rc(0,0,1,1)};Vs.exports=ac,Vs.exports.makeAggregateRaf=uc,Vs.exports.sharedScheduler=uc();function ac(e,t,n){var r=Object.create(null),i=Object.create(null);n||={};var a=typeof n.easing==`function`?n.easing:ic[n.easing];a||=(n.easing&&console.warn(`Unknown easing function in amator: `+n.easing),ic.ease);var o=typeof n.step==`function`?n.step:oc,s=typeof n.done==`function`?n.done:oc,c=sc(n.scheduler),l=Object.keys(t);l.forEach(function(n){r[n]=e[n],i[n]=t[n]-e[n]});var u=typeof n.duration==`number`?n.duration:400,d=Math.max(1,u*.06),f,p=0;return f=c.next(h),{cancel:m};function m(){c.cancel(f),f=0}function h(){var t=a(p/d);p+=1,g(t),p<=d?(f=c.next(h),o(e)):(f=0,setTimeout(function(){s(e)},0))}function g(t){l.forEach(function(n){e[n]=i[n]*t+r[n]})}}function oc(){}function sc(e){if(!e)return typeof window<`u`&&window.requestAnimationFrame?cc():lc();if(typeof e.next!=`function`)throw Error(`Scheduler is supposed to have next(cb) function`);if(typeof e.cancel!=`function`)throw Error(`Scheduler is supposed to have cancel(handle) function`);return e}function cc(){return{next:window.requestAnimationFrame.bind(window),cancel:window.cancelAnimationFrame.bind(window)}}function lc(){return{next:function(e){return setTimeout(e,1e3/60)},cancel:function(e){return clearTimeout(e)}}}function uc(){var e=new Set,t=new Set,n=0;return{next:i,cancel:i,clearAll:r};function r(){e.clear(),t.clear(),cancelAnimationFrame(n),n=0}function i(e){t.add(e),a()}function a(){n||=requestAnimationFrame(o)}function o(){n=0;var r=t;t=e,e=r,e.forEach(function(e){e()}),e.clear()}}function dc(e,t,n){typeof n!=`object`&&(n={});let r=.001,i=typeof n.minVelocity==`number`?n.minVelocity:r,a=typeof n.amplitude==`number`?n.amplitude:.01,o=typeof n.cancelAnimationFrame==`function`?n.cancelAnimationFrame:fc(),s=typeof n.requestAnimationFrame==`function`?n.requestAnimationFrame:pc(),c,l,u,d,f,p,m,h,g,_;return{start:x,setAmplitude:v,getAmplitude:y,stop:C,impulse:w,cancel:b};function v(e){a=e}function y(){return a}function b(){o(u),o(_)}function x(){c=e(),f=m=d=p=h=0,l=new Date,o(u),o(_),u=s(S)}function S(){var t=Date.now(),n=t-l;l=t;var r=e(),i=r.x-c.x,a=r.y-c.y,o=(r.z||0)-c.z;c=r;var f=1e3/(1+n);d=.8*i*f+.2*d,p=.8*a*f+.2*p,h=.8*o*f+.2*h,u=s(S)}function C(){u&&(o(u),u=0,o(_),_=0,w(d,p,h))}function w(e,t,n){l=Date.now(),(e<-i||e>i)&&(f=a*e),(t<-i||t>i)&&(m=a*t),(n<-i||n>i)&&(g=a*n),_=s(T)}function T(){var n=Date.now()-l,i=!1,a=0,o=0,c=0;let u=Math.exp(-n/342);if(f&&(a=f*u,a>r||a<-.001?i=!0:a=f=0),m&&(o=m*u,o>r||o<-.001?i=!0:o=m=0),g&&(c=g*u,c>r||c<-.001?i=!0:c=g=0),i){let n=e();t(n.x+a,n.y+o,n.z+c),_=s(T)}}}function fc(){return typeof cancelAnimationFrame==`function`?cancelAnimationFrame:clearTimeout}function pc(){return typeof requestAnimationFrame==`function`?requestAnimationFrame:function(e){return setTimeout(e,16)}}var mc=class{x;y;lastX;lastY;id;createdAt;constructor(e){this.x=e.clientX,this.y=e.clientY,this.lastX=this.x,this.lastY=this.y,this.id=e.identifier,this.createdAt=Date.now()}move(e){this.lastX=this.x,this.lastY=this.y,this.x=e.clientX,this.y=e.clientY}},hc=0,gc=1,_c=2,vc=3,yc=class{allowRotation;state;canRotate;canScale;canIncline;first;second;stateChanged;constructor(e){this.allowRotation=e,this.state=hc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0,this.stateChanged=!1}reset(){this.state=hc,this.canRotate=!1,this.canScale=!1,this.canIncline=!1,this.first=void 0,this.second=void 0}isUnknown(){return this.state===hc}track(e,t){if(this.stateChanged=!1,this.state!==hc)return;if(!(this.first&&this.second)){this.first={id:e.id,x:e.x,y:e.y},this.second={id:t.id,x:t.x,y:t.y};return}let n=this.first,r=this.second;if(e.id===r.id&&t.id===n.id){let e=n;n=r,r=e}let i=n.y-r.y,a=n.x-r.x,o=e.y-t.y,s=e.x-t.x,c=Math.abs(Math.hypot(i,a)-Math.hypot(o,s)),l=Math.atan2(i,a),u=Math.abs(l-Math.atan2(o,s));if(l=Math.abs(l)*180/Math.PI,(l<60||180-l<60)&&this.allowRotation&&Math.abs(e.createdAt-t.createdAt)<100){let i=e.x-n.x+t.x-r.x,a=e.y-n.y+t.y-r.y;Math.abs(i)<10&&Math.abs(a)>42&&(this.canIncline=!0)}this.canIncline?(this.canRotate=!1,this.canScale=!1,this.canIncline=!0,this.state=vc):u>.1&&this.allowRotation?(this.canRotate=!0,this.canScale=!0,this.canIncline=!1,this.state=_c):c>15&&(this.canRotate=!1,this.canScale=!0,this.canIncline=!1,this.state=gc),this.stateChanged=!0}};function bc(e,t){let n=!1,r=new Map,{allowRotation:i,allowPinchRotation:a,panAnimation:o,rotateAnimation:s}=t,c=new yc(a&&i),l,u=Date.now(),d=u;return p(),{dispose:f};function f(){e.removeEventListener(`touchstart`,m,{passive:!1}),v()}function p(){e.addEventListener(`touchstart`,m,{passive:!1})}function m(e){n||=(_(),!0),o.cancel(),s.cancel(),e.touches.length===1&&o.start();for(let t=0;t<e.touches.length;++t){let n=e.touches[t];r.has(n.identifier)||r.set(n.identifier,new mc(n))}e.stopPropagation(),e.preventDefault()}function h(e){let n=Date.now(),i=0,a=0,l=0,f=0,p,m,h=!1,g=e.touches;for(let e=0;e<g.length;++e){let t=g[e],n=r.get(t.identifier);n&&(n.move(t),l+=n.x,f+=n.y,i+=n.x-n.lastX,a+=n.y-n.lastY,p?m||=n:p=n)}let _=g.length;if(i/=_,a/=_,l/=_,f/=_,m||c.reset(),p&&m){d=n;let r=m.x-p.x,i=m.y-p.y,a=m.lastX-p.lastX,u=m.lastY-p.lastY,g=Math.hypot(r,i)/Math.hypot(a,u)-1,_=Math.atan2(i,r)-Math.atan2(u,a);if(c.track(p,m),c.stateChanged&&(s.start(),o.cancel()),c.canScale&&(t.zoomToClientCoordinates(l,f,g),h=!0),c.canRotate&&(t.rotateByAngle(_,0),h=!0),c.canIncline){let e=m.y-m.lastY+p.y-p.lastY;t.rotateByAbsoluteOffset(0,e),h=!0}e.preventDefault(),e.stopPropagation()}let v=n-u,y=c.canIncline||v<300||e.touches.length>1&&c.isUnknown();(i!==0||a!==0)&&!y&&(t.panByAbsoluteOffset(i,a),h=!0),h&&t.redraw()}function g(e){let i=Date.now(),a=i-u;u=i;let f=e.changedTouches;for(let e=0;e<f.length;++e){let t=f[e];r.delete(t.identifier)}if(e.touches.length<2&&(c.reset(),s.stop(),o.stop()),e.touches.length===0&&r.clear(),r.size===0&&e.changedTouches.length===1){if(n=!1,v(),o.stop(),a<350&&i-d>350){let n=e.changedTouches[0],r=Math.abs(n.clientX-l.clientX),i=Math.abs(n.clientY-l.clientY);Math.hypot(r,i)<30&&t.zoomToClientCoordinates(l.clientX,l.clientY,.5,!0)}l=e.changedTouches[0]}}function _(){document.addEventListener(`touchmove`,h,{passive:!1}),document.addEventListener(`touchend`,g,{passive:!1}),document.addEventListener(`touchcancel `,g,{passive:!1})}function v(){document.removeEventListener(`touchmove`,h),document.removeEventListener(`touchend`,g),document.removeEventListener(`touchcancel `,g)}}function xc(e,t,n){let r=e*Math.cos(t);return[e*Math.sin(t)*Math.cos(n),e*Math.sin(t)*Math.sin(n),r]}function Sc(e,t,n){return e<t&&(e=t),e>n&&(e=n),e}function Cc(e,t){return e===void 0?t:e}function wc(e,t,n){return Math.abs(e)<t?n:e}function Tc(e,t){let n=0,r=0,i=0,a=0,o=0,s=0,c=0,l=0,u=0,d=0,f=0,p=0,m=0;return h(),{dispose:g};function h(){e.getAttribute(`tabindex`)||e.setAttribute(`tabindex`,`0`),e.addEventListener(`keydown`,y),e.addEventListener(`keyup`,b)}function g(){e.removeEventListener(`keydown`,y),e.removeEventListener(`keyup`,b),cancelAnimationFrame(n)}function _(){n=0;let e=.9,h=!1;if(o=wc(o*e+r,.5,0),s=wc(s*e+i,.5,0),c=wc(c*e+a,.5,0),(o||s)&&(t.panByAbsoluteOffset(o,s),h=!0),c&&(t.slideCenterUpDown(c),h=!0),l=wc(l*e+u/2,Math.PI/360,0),p=wc(p*e+m/6,Math.PI/360,0),(l||p)&&(t.rotateByAbsoluteOffset(l,p),h=!0),d=wc(d*.7+f,.5,0),d){let e=Math.sign(d)*.025;t.zoomCenterByScaleFactor(e,0,0),h=!0}h&&(t.redraw(),v())}function v(){n||=requestAnimationFrame(_)}function y(e){x(e,1)}function b(e){x(e,0)}function x(e,t){if(!Ec(e)){switch(e.which){case 81:u=-t;break;case 69:u=t;break;case 187:f=t;break;case 189:f=-t;break;case 82:m=t;break;case 70:m=-t;break;case 37:case 65:r=t;break;case 39:case 68:r=-t;break;case 38:case 87:i=t;break;case 40:case 83:i=-t;break;case 71:a=-t;break;case 84:a=t}v()}}}function Ec(e){return e.altKey||e.ctrlKey||e.metaKey}function Dc(e,t){let n,r,i,{allowRotation:a,panAnimation:o,rotateAnimation:s}=t;return e.addEventListener(`wheel`,p,{passive:!1}),e.addEventListener(`mousedown`,l,{passive:!1}),e.addEventListener(`dblclick`,f,{passive:!1}),{dispose:c};function c(){e.removeEventListener(`wheel`,p,{passive:!1}),e.removeEventListener(`mousedown`,l,{passive:!1}),e.removeEventListener(`dblclick`,f,{passive:!1}),document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d)}function l(e){(e.button===1&&window.event!==null||e.button===0)&&(document.addEventListener(`mousemove`,u),document.addEventListener(`mouseup`,d),n=e.clientX,r=e.clientY,i=e.altKey&&a,o.cancel(),s.cancel(),i?s.start():o.start())}function u(e){let a=e.clientY-r,o=e.clientX-n;i?t.rotateByAbsoluteOffset(o,a):t.panByAbsoluteOffset(o,a),n=e.clientX,r=e.clientY,t.redraw()}function d(){document.removeEventListener(`mousemove`,u),document.removeEventListener(`mouseup`,d),i?s.stop():o.stop()}function f(e){t.zoomToClientCoordinates(e.clientX,e.clientY,.5,!0),e.preventDefault(),e.stopPropagation()}function p(e){let n=e.deltaMode>0?100:1,r=m(-e.deltaY*n);t.zoomToClientCoordinates(e.clientX,e.clientY,r),e.preventDefault()}function m(e){return Math.sign(e)*Math.min(.25,Math.abs(e/128))}}function Oc(e,t){if(typeof e==`string`){let t=document.querySelector(e);if(!t)throw Error(`Cannot resolve input target element: `+e);return t}return e||t}var kc=class{drawContext;updated;constructor(e){this.drawContext=e.getDrawContext(),this.updated=!1}};function Ac(e){let t=e.getDrawContext(),n=t.view,r=Math.PI*2,i=Math.PI*1.618,a=new kc(e),o=e.getOptions()||{},s=o.allowRotation===void 0||!!o.allowRotation,c=o.allowPinchRotation===void 0?s:!!o.allowPinchRotation,l=Cc(o.minPhi,-1/0),u=Cc(o.maxPhi,1/0),d=Sc(-Math.PI/2,l,u),f=Cc(o.minTheta,0),p=Cc(o.maxTheta,Math.PI),m=Sc(0,f,p),h=Cc(o.minZoom,-1/0),g=Cc(o.maxZoom,1/0),_=Sc(1,h,g),v=n.center,y=n.position,b=dc(F,L),x=dc(I,ne,{minVelocity:1}),S=[0,0,1],C={dispose:k,setViewBox:O,panByAbsoluteOffset:M,slideCenterUpDown:te,rotateByAngle:j,rotateByAbsoluteOffset:ee,zoomCenterByScaleFactor:R,zoomToClientCoordinates:N,redraw:z,allowRotation:s,allowPinchRotation:c,rotateAnimation:x,panAnimation:b},w=Oc(o.inputTarget,t.canvas),T=Tc(w,C),E=bc(w,C),D=Dc(w,C);return z(),C;function O(){return y=n.position,_=Math.hypot(y[2]),v[0]=y[0],v[1]=y[1],v[2]=0,m=Sc(0,f,p),d=Sc(-Math.PI/2,l,u),z(),C}function k(){x.cancel(),b.cancel(),E.dispose(),T.dispose(),D.dispose()}function A(t,n){let r=e.getSceneCoordinate(t,n),i=bs(r,r,y);hs(i,i);let a=gs(S,i);if(Math.abs(a)>1e-7){let e=gs(bs([0,0,0],v,y),S)/a;return ms([0,0,0],y,i,e)}}function j(e,t){d=Sc(d+e,l,u),m=Sc(m+t,f,p)}function ee(e,n){if(!s)return;let a=t.width/t.height;d-=r*e/t.width,m-=i*n/t.height*a,m=Sc(m,f,p),d=Sc(d,l,u)}function M(e,n){let r=t.width/t.height,i=2*_*Math.tan(t.fov/2);P(r*i*e/(t.width/t.pixelRatio),-(i*n/(t.height/t.pixelRatio)))}function N(e,t,n,r){let i=A(e,t);if(!i)return;let a=i[0]-v[0],o=i[1]-v[1];if(r){let e={r:_,x:v[0],y:v[1]},t={r:Sc(_*(1-n),h,g),x:e.x+a*n,y:e.y+o*n};Vs.exports(e,t,{step(e){_=e.r,v[0]=e.x,v[1]=e.y,z()}})}else R(n,a,o),z()}function P(e,t){let n=Math.cos(d),r=Math.sin(d);v[0]+=n*t+r*e,v[1]+=r*t-n*e}function te(e){v[2]+=e*_*.001}function F(){return{x:v[0],y:v[1],z:v[2]}}function I(){return{x:d,y:m,z:0}}function ne(e,t){m=Sc(t,f,p),d=Sc(e,l,u),z()}function L(e,t,n){ds(v,e,t,n),z()}function R(e,t,n){let r=Sc(_*(1-e),h,g);r!==_&&(_=r,v[0]+=t*e,v[1]+=n*e)}function z(){let t=xc(_,m,d),r=Math.hypot(_,1),i=xc(r,m-Math.acos(_/r),d);bs(i,i,t),ds(y,t[0],t[1],t[2]),fs(y,y,v),ss(n.cameraWorld,y,v,i),is(n.orientation,n.cameraWorld),n.update(),a.updated=!1,e.fire(`transform`,a),a.updated?z():(e.getRoot().scheduleMVPUpdate(),e.renderFrame())}}Uo(Float64Array);function jc(e,t={}){let n,r,i=t.devicePixelRatio||window.devicePixelRatio,a=t.wglContextOptions,o=e.getContext(t.version===2?`webgl2`:`webgl`,a)||e.getContext(`experimental-webgl`,a);o.enable(o.BLEND),o.blendFuncSeparate(o.SRC_ALPHA,o.ONE_MINUS_SRC_ALPHA,o.ONE,o.ONE_MINUS_SRC_ALPHA),o.clearColor(0,0,0,1),o.clear(o.COLOR_BUFFER_BIT|o.DEPTH_BUFFER_BIT);let s=0,c=new Ns,l=!1,u=!1,d=Oc(t.inputTarget,e),f,p=new Bs,m=Go(),h=Go(),g=t.fov===void 0?Math.PI*45/180:t.fov,_=t.near===void 0?.01:t.near,v=t.far===void 0?1/0:t.far,y={width:window.innerWidth,height:window.innerHeight,pixelRatio:i,canvas:e,projection:m,inverseProjection:h,view:p,fov:g};I();let b=Ro({appendChild:se,getSceneCoordinate:R,getClientCoordinate:z,getTransform:ee,getRoot:k,getGL:O,removeChild:B,setViewBox:re,setClearColor:M,getClearColor:N,clear:oe,dispose:te,renderFrame:ie,getPixelRatio:w,setPixelRatio:D,updateCanvasSize:I,getCameraController:j,setCameraController:A,getDrawContext:T,getOptions:E}),x=b.on;b.on=ce,c.bindScene(b);let S=(t.controls||Ac)(b),C;return P(),ie(),b;function w(){return i}function T(){return y}function E(){return t}function D(e){i=e,y.pixelRatio=i,I()}function O(){return o}function k(){return c}function A(e){return S&&S.dispose(),S=e(b,y),S}function j(){return S}function ee(){return c.model}function M(e,t,n,r){o.clearColor(e,t,n,r)}function N(){return o.getParameter(o.COLOR_CLEAR_VALUE)}function P(){d.addEventListener(`mousemove`,L),C=Fs(d,ne),window.addEventListener(`resize`,F,!0)}function te(){d.removeEventListener(`mousemove`,L),C&&C(),window.removeEventListener(`resize`,F,!0),S.dispose(),c.dispose(),s&&=(cancelAnimationFrame(s),0)}function F(){I()}function I(){t.size?(n=e.width=t.size.width,r=e.height=t.size.height):(n=e.width=e.offsetWidth*i,r=e.height=e.offsetHeight*i),f=e.getBoundingClientRect(),o.viewport(0,0,n,r),y.width=n,y.height=r,c.worldTransformNeedsUpdate=!0,os(m,g,n/r,_,v),qo(h,m),ie()}function ne(e){if(l){var t=R(e.clientX,e.clientY);t&&b.fire(`click`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function L(e){if(u){var t=R(e.clientX,e.clientY);t&&b.fire(`mousemove`,{originalEvent:e,x:t[0],y:t[1],z:t[2]})}}function R(e,t){e-=f.left,t-=f.top;var i=b.getPixelRatio();let a=vs([0,0,0],[i*e/n*2-1,(1-i*t/r)*2-1,0],h);vs(a,a,p.cameraWorld),bs(a,a,p.position),hs(a,a);var o=(0-p.position[2])/a[2];return a[2],ms(a,p.position,a,o),a}function z(e,t,i=0){var a=Jo(Go(),m,p.matrix);Jo(a,a,c.model);var o=Ts([0,0,0,0],[e,t,i,1],a),s=b.getPixelRatio();return{x:n*(o[0]/o[3]+1)*.5/s,y:r*(1-(o[1]/o[3]+1)*.5)/s}}function re(e){let t=y.pixelRatio*Math.max((e.top-e.bottom)/2,(e.right-e.left)/2),{position:n,orientation:r}=y.view;n[0]=(e.left+e.right)/2,n[1]=(e.top+e.bottom)/2,n[2]=t/Math.tan(y.fov/2),As(r,0,0,0,1),y.view.update(),S.setViewBox&&S.setViewBox(e)}function ie(e=!1){if(e)return ae();s||=requestAnimationFrame(ae)}function ae(){o.clear(o.COLOR_BUFFER_BIT),c.updateWorldTransform(),c.draw(o,y),s=0}function oe(){o.clear(o.COLOR_BUFFER_BIT)}function se(e,t=!1){c.appendChild(e,t),b.fire(`append-child`,e)}function B(e){c.removeChild(e),b.fire(`remove-child`,e)}function ce(e,t,n){return e===`click`&&(l=!0),e===`mousemove`&&(u=!0),x(e,t,n)}}var Mc={compile:Nc,link:Pc,getLocations:Fc,getAttributes:Ic,getUniforms:Lc,initBuffer:Rc};function Nc(e,t,n){let r=e.createShader(t);if(!r)throw Error(`Failed to create a shared `+n);if(e.shaderSource(r,n),e.compileShader(r),!e.getShaderParameter(r,e.COMPILE_STATUS))throw Error(e.getShaderInfoLog(r)||`Failed to compile shader `+n);return r}function Pc(e,t,n){let r=e.createProgram();if(!r)throw Error(`Failed to link a program`);if(e.attachShader(r,t),e.attachShader(r,n),e.linkProgram(r),!e.getProgramParameter(r,e.LINK_STATUS))throw Error(e.getProgramInfoLog(r)||`Failed to link a program`);return r}function Fc(e,t){return{attributes:Ic(e,t),uniforms:Lc(e,t)}}function Ic(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_ATTRIBUTES),i=0;i<r;++i){var a=e.getActiveAttrib(t,i);if(a){let r=a.name;n[r]=e.getAttribLocation(t,r)}}return n}function Lc(e,t){for(var n=Object.create(null),r=e.getProgramParameter(t,e.ACTIVE_UNIFORMS),i=0;i<r;++i){var a=e.getActiveUniform(t,i);if(a){let r=a.name;n[r]=e.getUniformLocation(t,r)}}return n}function Rc(e,t,n,r){var i=e.createBuffer();if(!i)throw Error(`Failed to create a buffer`);e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW),e.vertexAttribPointer(r,n,e.FLOAT,!1,0,0),e.enableVertexAttribArray(r)}function zc(){let e=new Map;return{get:t,set:n,remove:r};function t(t){if(!t)return;let n=e,r;for(let e=0;e<t.length;++e){let i=t[e];if(r=n.get(i),!r)return;n=r}return r}function n(t,n){let r=e;for(let e=0;e<t.length-1;++e){let n=t[e],i=r.get(n);i||(i=new Map,r.set(n,i)),r=i}r.set(t[t.length-1],n)}function r(t){let n=e;for(let e=0;e<t.length-1;++e){let r=t[e],i=n.get(r);if(!i)return;n=i}n.delete(t[t.length-1])}}var Bc=class{r;g;b;a;constructor(e,t,n,r=1){this.r=e,this.g=t,this.b=n,this.a=r===void 0?1:r}},Vc=zc();function Hc(e,t){let n=!!t.allowColors,r=[n,e],i=Vc.get(r);if(!i){let{frag:t,vert:s}=Uc(n);var a=Mc.compile(e,e.VERTEX_SHADER,s),o=Mc.compile(e,e.FRAGMENT_SHADER,t);i=Mc.link(e,a,o),Vc.set(r,i)}let s=Mc.getLocations(e,i),c=e.createBuffer(),l=t.is3D?3:2,u=(l+1)*4,d=l*4;return{draw:p,dispose:f};function f(){e.deleteBuffer(c),e.deleteProgram(i),Vc.remove(r)}function p(r){if(t.count===0)return;let a=t.buffer;e.useProgram(i),e.uniformMatrix4fv(s.uniforms.uModel,!1,t.worldModel),e.uniformMatrix4fv(s.uniforms.projectionMatrix,!1,r.projection),e.uniformMatrix4fv(s.uniforms.uView,!1,r.view.matrix);var o=t.color;e.uniform4f(s.uniforms.uColor,o.r,o.g,o.b,o.a),e.bindBuffer(e.ARRAY_BUFFER,c),t.isDirtyBuffer&&=(e.bufferData(e.ARRAY_BUFFER,a,e.STATIC_DRAW),!1),e.enableVertexAttribArray(s.attributes.aPosition),n?(e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,u,0),e.enableVertexAttribArray(s.attributes.aColor),e.vertexAttribPointer(s.attributes.aColor,4,e.UNSIGNED_BYTE,!0,u,d)):e.vertexAttribPointer(s.attributes.aPosition,l,e.FLOAT,!1,4*l,0),e.drawArrays(e.LINES,0,t.count*2)}}function Uc(e){return{vert:`attribute vec3 aPosition;
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
`}}}),Il=Tl({"lib/spring.js"(e,t){t.exports=n;function n(e,t,n,r){this.from=e,this.to=t,this.length=n,this.coefficient=r}}}),Ll=Tl({"node_modules/ngraph.merge/index.js"(e,t){t.exports=n;function n(e,t){var r;if(e||={},t){for(r in t)if(t.hasOwnProperty(r)){var i=e.hasOwnProperty(r),a=typeof t[r];!i||typeof e[r]!==a?e[r]=t[r]:a===`object`&&(e[r]=n(e[r],t[r]))}}return e}}}),Rl=Tl({"node_modules/ngraph.events/index.js"(e,t){t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}}}),zl=Tl({"node_modules/ngraph.random/index.js"(e,t){t.exports=n,t.exports.random=n,t.exports.randomIterator=l;function n(e){return new r(typeof e==`number`?e:+new Date)}function r(e){this.seed=e}r.prototype.next=c,r.prototype.nextDouble=s,r.prototype.uniform=s,r.prototype.gaussian=i;function i(){var e,t,n;do t=this.nextDouble()*2-1,n=this.nextDouble()*2-1,e=t*t+n*n;while(e>=1||e===0);return t*Math.sqrt(-2*Math.log(e)/e)}r.prototype.levy=a;function a(){var e=3/2,t=(o(1+e)*Math.sin(Math.PI*e/2)/(o((1+e)/2)*e*2**((e-1)/2)))**(1/e);return this.gaussian()*t/Math.abs(this.gaussian())**(1/e)}function o(e){return Math.sqrt(2*Math.PI/e)*(1/Math.E*(e+1/(12*e-1/(10*e))))**e}function s(){var e=this.seed;return e=e+2127912214+(e<<12)|0,e=e^3345072700^e>>>19,e=e+374761393+(e<<5)|0,e=e+3550635116^e<<9,e=e+4251993797+(e<<3)|0,e=e^3042594569^e>>>16,this.seed=e,(e&268435455)/268435456}function c(e){return Math.floor(this.nextDouble()*e)}function l(e,t){var r=t||n();if(typeof r.next!=`function`)throw Error(`customRandom does not match expected API: next() function is missing`);return{forEach:a,shuffle:i};function i(){for(var t=e.length-1,n,i;t>0;--t)n=r.next(t+1),i=e[n],e[n]=e[t],e[t]=i;return e}function a(t){for(var n=e.length-1,i,a;n>0;--n)i=r.next(n+1),a=e[i],e[i]=e[n],e[n]=a,t(a);e.length&&t(e[0])}}}}),Bl=Tl({"lib/createPhysicsSimulator.js"(e,t){t.exports=d;var n=Ol(),r=kl(),i=Al(),a=jl(),o=Ml(),s=Nl(),c=Pl(),l=Fl(),u={};function d(e){var t=Il(),d=Ll(),p=Rl();if(e){if(e.springCoeff!==void 0)throw Error(`springCoeff was renamed to springCoefficient`);if(e.dragCoeff!==void 0)throw Error(`dragCoeff was renamed to dragCoefficient`)}if(e=d(e,{springLength:10,springCoefficient:.8,gravity:-12,theta:.8,dragCoefficient:.9,timeStep:.5,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,adaptiveTimeStepWeight:0,dimensions:2,debug:!1}),e.integrator!==`euler`&&e.integrator!==`fire`)throw Error(`Unknown integrator: `+e.integrator+". Expected `euler` or `fire`");if(e.nbody!==`quadtree`&&e.nbody!==`dualtree`)throw Error(`Unknown nbody: `+e.nbody+". Expected `quadtree` or `dualtree`");var m=u[e.dimensions];if(!m){var h=e.dimensions;m={Body:n(h,e.debug),createQuadTree:r(h),createBounds:i(h),createDragForce:a(h),createSpringForce:o(h),integrate:s(h),createFireIntegrator:c(h),createDualTree:l(h)},u[h]=m}var g=m.Body,_=m.createQuadTree,v=m.createBounds,y=m.createDragForce,b=m.createSpringForce,x=m.integrate,S,C=e=>new g(e),w=zl().random(42),T=[],E=[],D=_(e,w),O=v(T,e,w),k=b(e,w),A=y(e),j,ee=0,M=[],N=new Map,P=0;I(`nbody`,R),I(`spring`,z);var te={bodies:T,quadTree:D,springs:E,settings:e,addForce:I,removeForce:ne,getForces:L,step:function(){for(var t=0;t<M.length;++t)M[t](P);var n=x;e.integrator===`fire`&&(S||=m.createFireIntegrator(),n=S);var r=n(T,e.timeStep,e.adaptiveTimeStepWeight,e.maxVelocity);return P+=1,r},addBody:function(e){if(!e)throw Error(`Body is required`);return T.push(e),e},addBodyAt:function(e){if(!e)throw Error(`Body position is required`);var t=C(e);return T.push(t),t},removeBody:function(e){if(e){var t=T.indexOf(e);if(!(t<0))return T.splice(t,1),T.length===0&&O.reset(),!0}},addSpring:function(e,n,r,i){if(!e||!n)throw Error(`Cannot add null spring to force simulator`);typeof r!=`number`&&(r=-1);var a=new t(e,n,r,i>=0?i:-1);return E.push(a),a},getTotalMovement:function(){return ee},removeSpring:function(e){if(e){var t=E.indexOf(e);if(t>-1)return E.splice(t,1),!0}},getBestNewBodyPosition:function(e){return O.getBestNewPosition(e)},getBBox:F,getBoundingBox:F,invalidateBBox:function(){console.warn("invalidateBBox() is deprecated, bounds always recomputed on `getBBox()` call")},gravity:function(t){return t===void 0?e.gravity:(e.gravity=t,D.options({gravity:t}),this)},theta:function(t){return t===void 0?e.theta:(e.theta=t,D.options({theta:t}),this)},random:w};return f(e,te),p(te),te;function F(){return O.update(),O.box}function I(e,t){if(N.has(e))throw Error(`Force `+e+` is already added`);N.set(e,t),M.push(t)}function ne(e){var t=M.indexOf(N.get(e));t<0||(M.splice(t,1),N.delete(e))}function L(){return N}function R(){if(T.length!==0){var t=e.integrator!==`fire`,n=T.length,r;if(e.nbody===`dualtree`){if(j||=m.createDualTree(e),j.computeForces(T),!t)return;for(;n--;)r=T[n],r.isPinned||A.update(r)}else for(D.insertBodies(T);n--;)r=T[n],r.isPinned||(r.reset(),D.updateBodyForce(r),t&&A.update(r))}}function z(){for(var e=E.length;e--;)k.update(E[e])}}function f(e,t){for(var n in e)p(e,t,n)}function p(e,t,n){e.hasOwnProperty(n)&&typeof t[n]!=`function`&&(t[n]=Number.isFinite(e[n])?function(r){if(r!==void 0){if(!Number.isFinite(r))throw Error(`Value of `+n+` should be a valid number.`);return e[n]=r,t}return e[n]}:function(r){return r===void 0?e[n]:(e[n]=r,t)})}}}),Vl=Tl({"index.js"(e,t){t.exports=r,t.exports.simulator=Bl();var n=Rl();function r(e,t){if(!e)throw Error(`Graph structure cannot be undefined`);var r=(t&&t.createSimulator||Bl())(t);if(Array.isArray(t))throw Error(`Physics settings is expected to be an object`);var a=e.version>19?A:k;t&&typeof t.nodeMass==`function`&&(a=t.nodeMass);var o=new Map,s={},c=0,l=r.settings.springTransform||i;b(),_();var u=!1,d={step:function(){if(c===0)return f(!0),!0;var e=r.step();d.lastMove=e,d.fire(`step`);var t=e/c<=.01;return f(t),t},getNodePosition:function(e){return O(e).pos},setNodePosition:function(e){var t=O(e);t.setPosition.apply(t,Array.prototype.slice.call(arguments,1))},getLinkPosition:function(e){var t=s[e];if(t)return{from:t.from.pos,to:t.to.pos}},getGraphRect:function(){return r.getBBox()},forEachBody:p,pinNode:function(e,t){var n=O(e.id);n.isPinned=!!t},isNodePinned:function(e){return O(e.id).isPinned},dispose:function(){e.off(`changed`,y),d.fire(`disposed`)},getBody:g,getSpring:h,getForceVectorLength:m,simulator:r,graph:e,lastMove:0};return n(d),d;function f(e){u!==e&&(u=e,v(e))}function p(e){o.forEach(e)}function m(){var e=0,t=0;return p(function(n){e+=Math.abs(n.force.x),t+=Math.abs(n.force.y)}),Math.sqrt(e*e+t*t)}function h(t,n){var r;if(n===void 0)r=typeof t==`object`?t.id:t;else{var i=e.hasLink(t,n);if(!i)return;r=i.id}return s[r]}function g(e){return o.get(e)}function _(){e.on(`changed`,y)}function v(e){d.fire(`stable`,e)}function y(t){for(var n=0;n<t.length;++n){var r=t[n];r.changeType===`add`?(r.node&&x(r.node.id),r.link&&C(r.link)):r.changeType===`remove`&&(r.node&&S(r.node),r.link&&w(r.link))}c=e.getNodesCount()}function b(){c=0,e.forEachNode(function(e){x(e.id),c+=1}),e.forEachLink(C)}function x(t){var n=o.get(t);if(!n){var i=e.getNode(t);if(!i)throw Error(`initBody() was called with unknown node id`);var a=i.position;if(!a){var s=T(i);a=r.getBestNewBodyPosition(s)}n=r.addBodyAt(a),n.id=t,o.set(t,n),E(t),D(i)&&(n.isPinned=!0)}}function S(e){var t=e.id,n=o.get(t);n&&(o.delete(t),r.removeBody(n))}function C(e){E(e.fromId),E(e.toId);var t=o.get(e.fromId),n=o.get(e.toId),i=r.addSpring(t,n,e.length);l(e,i),s[e.id]=i}function w(t){var n=s[t.id];if(n){var i=e.getNode(t.fromId),a=e.getNode(t.toId);i&&E(i.id),a&&E(a.id),delete s[t.id],r.removeSpring(n)}}function T(e){var t=[];return e.links&&e.links.forEach(function(n){var r=n.fromId===e.id?o.get(n.toId):o.get(n.fromId);r&&r.pos&&t.push(r)}),t}function E(e){var t=o.get(e);if(t.mass=a(e),Number.isNaN(t.mass))throw Error(`Node mass should be a number`)}function D(e){return e&&(e.isPinned||e.data&&e.data.isPinned)}function O(e){var t=o.get(e);return t||=(x(e),o.get(e)),t}function k(t){var n=e.getLinks(t);return n?1+n.length/3:1}function A(t){var n=e.getLinks(t);return n?1+n.size/3:1}}function i(){}}})();function Hl(e,t){return Vl(e,Object.assign({dimensions:2,timeStep:.5,springLength:10,gravity:-12,springCoefficient:.8,dragCoefficient:.9,debug:!1},t))}var Ul=Wl;function Wl(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,n=new Map,r={},i=0,a=e.multigraph?b:y,o=[],s=M,c=M,l=M,u=M,d={version:20,addNode:h,addLink:v,removeLink:w,removeNode:_,getNode:g,getNodeCount:x,getLinkCount:S,getEdgeCount:S,getLinksCount:S,getNodesCount:x,getLinks:C,forEachNode:te,forEachLinkedNode:A,forEachLink:k,beginUpdate:l,endUpdate:u,clear:O,hasLink:E,hasNode:g,getLink:E,getLinkById:D};return _l(d),f(),d;function f(){var e=d.on;d.on=t;function t(){return d.beginUpdate=l=N,d.endUpdate=u=P,s=p,c=m,d.on=e,e.apply(d,arguments)}}function p(e,t){o.push({link:e,changeType:t})}function m(e,t){o.push({node:e,changeType:t})}function h(e,n){if(e===void 0)throw Error(`Invalid node identifier`);l();var r=g(e);return r?(r.data=n,c(r,`update`)):(r=new Gl(e,n),c(r,`add`)),t.set(e,r),u(),r}function g(e){return t.get(e)}function _(e){var n=g(e);if(!n)return!1;l();var r=n.links;return r&&(r.forEach(T),n.links=null),t.delete(e),c(n,`remove`),u(),!0}function v(e,t,r){l();var i=g(e)||h(e),o=g(t)||h(t),c=a(e,t,r),d=n.has(c.id);return n.set(c.id,c),Kl(i,c),e!==t&&Kl(o,c),s(c,d?`update`:`add`),u(),c}function y(e,t,r){var i=Jl(e,t),a=n.get(i);return a?(a.data=r,a):new ql(e,t,r,i)}function b(e,t,n){var i=Jl(e,t),a=r.hasOwnProperty(i);if(a||E(e,t)){a||(r[i]=0);var o=`@`+ ++r[i];i=Jl(e+o,t+o)}return new ql(e,t,n,i)}function x(){return t.size}function S(){return n.size}function C(e){var t=g(e);return t?t.links:null}function w(e,t){return t!==void 0&&(e=E(e,t)),T(e)}function T(e){if(!e||!n.get(e.id))return!1;l(),n.delete(e.id);var t=g(e.fromId),r=g(e.toId);return t&&t.links.delete(e),r&&r.links.delete(e),s(e,`remove`),u(),!0}function E(e,t){if(e!==void 0&&t!==void 0)return n.get(Jl(e,t))}function D(e){if(e!==void 0)return n.get(e)}function O(){l(),te(function(e){_(e.id)}),u()}function k(e){if(typeof e==`function`)for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}function A(e,t,n){var r=g(e);if(r&&r.links&&typeof t==`function`)return n?ee(r.links,e,t):j(r.links,e,t)}function j(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===n?s.toId:s.fromId;if(i=r(t.get(c),s),i)return!0;o=a.next()}}function ee(e,n,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===n&&(i=r(t.get(s.toId),s),i))return!0;o=a.next()}}function M(){}function N(){i+=1}function P(){--i,i===0&&o.length>0&&(d.fire(`changed`,o),o.length=0)}function te(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function Gl(e,t){this.id=e,this.links=null,this.data=t}function Kl(e,t){e.links?e.links.add(t):e.links=new Set([t])}function ql(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function Jl(e,t){return e.toString()+`👉 `+t.toString()}function Yl(e,t,n={}){let r=n.dimensions||2,i=n.unit||10,a=n.jitter===void 0?.1:n.jitter,o=iu(n.seed||42),s=Xl(e);if(s.n===0)return`empty`;let c=Ql(s,r,n.pivots||25,o),l=`pivot MDS`;if(r===2&&s.n>2){let e=tu(s,o);nu(s,e)<nu(s,c)&&(c=e,l=`radial tree`)}let u=Array(r+1);for(let e=0;e<s.n;e++){u[0]=s.ids[e];for(let t=0;t<r;t++)u[t+1]=c[t][e]*i+(o()-.5)*a*i;t.setNodePosition.apply(t,u)}return l}function Xl(e){let t=[];e.forEachNode(e=>{t.push(e.id)});let n=t.length,r=new Map(t.map((e,t)=>[e,t])),i=new Int32Array(n),a=[];e.forEachLink(e=>{let t=r.get(e.fromId),n=r.get(e.toId);t!==n&&(a.push(t,n),i[t]++,i[n]++)});let o=new Int32Array(n+1);for(let e=0;e<n;e++)o[e+1]=o[e]+i[e];let s=o.slice(0,n),c=new Int32Array(o[n]);for(let e=0;e<a.length;e+=2){let t=a[e],n=a[e+1];c[s[t]++]=n,c[s[n]++]=t}return{ids:t,n,offsets:o,neighbors:c,degree:i}}function Zl(e,t,n,r){n.fill(-1),n[t]=0,r[0]=t;let i=0,a=1;for(;i<a;){let t=r[i++],o=n[t]+1;for(let i=e.offsets[t];i<e.offsets[t+1];i++){let t=e.neighbors[i];n[t]<0&&(n[t]=o,r[a++]=t)}}return a}function Ql(e,t,n,r){let i=e.n,a=Math.min(n,i),o=new Int32Array(i),s=new Int32Array(i),c=new Float64Array(i).fill(1/0),l=[],u=0;for(let t=1;t<i;t++)e.degree[t]>e.degree[u]&&(u=t);for(let t=0;t<a;t++){Zl(e,u,o,s);let t=0;for(let e=0;e<i;e++)o[e]>t&&(t=o[e]);let n=new Float64Array(i);for(let e=0;e<i;e++){let r=o[e]<0?t+1:o[e];n[e]=r*r,r<c[e]&&(c[e]=r)}l.push(n);let r=0;for(let e=1;e<i;e++)c[e]>c[r]&&(r=e);u=r}let d=new Float64Array(i),f=0,p=l.map(e=>{let t=0;for(let n=0;n<i;n++)t+=e[n],d[n]+=e[n];return f+=t,t/i});for(let e=0;e<i;e++)d[e]/=a;f/=i*a,l.forEach((e,t)=>{for(let n=0;n<i;n++)e[n]=-.5*(e[n]-d[n]-p[t]+f)});let m=new Float64Array(a*a);for(let e=0;e<a;e++)for(let t=e;t<a;t++){let n=0,r=l[e],o=l[t];for(let e=0;e<i;e++)n+=r[e]*o[e];m[e*a+t]=m[t*a+e]=n}let h=$l(m,a,t,r).map(e=>{let t=new Float64Array(i);return l.forEach((n,r)=>{for(let a=0;a<i;a++)t[a]+=e[r]*n[a]}),t});return eu(e,h,r),h}function $l(e,t,n,r){let i=[];for(let a=0;a<n;a++){let n=new Float64Array(t).map(()=>r()-.5);for(let r=0;r<200;r++){let r=new Float64Array(t);for(let i=0;i<t;i++){let a=0;for(let r=0;r<t;r++)a+=e[i*t+r]*n[r];r[i]=a}i.forEach(e=>{let n=0;for(let i=0;i<t;i++)n+=r[i]*e[i];for(let i=0;i<t;i++)r[i]-=n*e[i]});let a=0;for(let e=0;e<t;e++)a+=r[e]*r[e];a=Math.sqrt(a)||1;let o=0;for(let e=0;e<t;e++){let t=r[e]/a;o+=Math.abs(t-n[e]),n[e]=t}if(o<1e-9)break}i.push(n)}return i}function eu(e,t,n){let r=e.n,i=new Int32Array(r),a=new Int32Array(r),o=0,s=0;for(let c=0;c<Math.min(8,r);c++){let c=Math.floor(n()*r);Zl(e,c,i,a);for(let e=0;e<r;e++){let n=i[e];if(n<=0)continue;let r=ru(t,e,c);o+=r/n,s+=r*r/(n*n)}}let c=s>0?o/s:1;t.forEach(e=>{for(let t=0;t<r;t++)e[t]*=c})}function tu(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n);Zl(e,0,r,i);let a=0;for(let e=0;e<n;e++)r[e]>r[a]&&(a=e);Zl(e,a,r,i);let o=0;for(let e=0;e<n;e++)r[e]>r[o]&&(o=e);let s=r[o]>>1,c=o;for(;r[c]>s;)for(let t=e.offsets[c];t<e.offsets[c+1];t++){let n=e.neighbors[t];if(r[n]===r[c]-1){c=n;break}}let l=Zl(e,c,r,i),u=new Int32Array(n).fill(-1);for(let t=0;t<l;t++){let n=i[t];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let i=e.neighbors[t];r[i]===r[n]+1&&u[i]<0&&(u[i]=n)}}let d=new Float64Array(n).fill(1);for(let e=l-1;e>0;e--)d[u[i[e]]]+=d[i[e]];let f=new Float64Array(n),p=new Float64Array(n),m=new Float64Array(n),h=new Float64Array(n);p[c]=2*Math.PI;for(let t=0;t<l;t++){let n=i[t],a=f[n]+p[n]/2;m[n]=r[n]*Math.cos(a),h[n]=r[n]*Math.sin(a);let o=f[n];for(let t=e.offsets[n];t<e.offsets[n+1];t++){let r=e.neighbors[t];u[r]===n&&(f[r]=o,p[r]=p[n]*d[r]/(d[n]-1),o+=p[r])}}let g=0;for(let e=0;e<n;e++)r[e]>g&&(g=r[e]);for(let e=0;e<n;e++)r[e]>=0||(m[e]=(t()-.5)*2*g,h[e]=(t()-.5)*2*g);return[m,h]}function nu(e,t){let n=e.n,r=new Int32Array(n),i=new Int32Array(n),a=iu(3),o=[];for(let t=0;t<Math.min(12,n);t++){let t=Math.floor(a()*n);Zl(e,t,r,i);for(let e=0;e<n;e++)r[e]>0&&o.push(t,e,r[e])}let s=0,c=0;for(let e=0;e<o.length;e+=3){let n=ru(t,o[e],o[e+1]),r=o[e+2];s+=n/r,c+=n*n/(r*r)}let l=c>0?s/c:1,u=0;for(let e=0;e<o.length;e+=3){let n=l*ru(t,o[e],o[e+1]),r=o[e+2];u+=(n-r)*(n-r)/(r*r)}return u/Math.max(1,o.length/3)}function ru(e,t,n){let r=0;for(let i=0;i<e.length;i++){let a=e[i][t]-e[i][n];r+=a*a}return Math.sqrt(r)}function iu(e){let t=e>>>0;return function(){t=t+1831565813>>>0;let e=t;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}}var $=256,au=8,ou=64,su=256,cu=16,lu=1024,uu=`
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
`,du={HIST:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> bs: array<atomic<u32>>;
var<workgroup> hist: array<atomic<u32>, ${2*lu}>;
var<workgroup> wb: array<atomic<u32>, 4>;
fn fenc(v: f32) -> u32 { let u = bitcast<u32>(v); return select(u | 0x80000000u, ~u, (u & 0x80000000u) != 0u); }
fn hbin(d: f32) -> u32 {
  let key = u32(clamp(i32(bitcast<u32>(abs(d)) >> 20u) - 824, 0, 511));
  return select(512u + key, 511u - key, d < 0.0);
}
@compute @workgroup_size(${$})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(num_workgroups) nwg: vec3u) {
  for (var b = li; b < ${2*lu}u; b += ${$}u) { atomicStore(&hist[b], 0u); }
  if (li < 2u) { atomicStore(&wb[li], 0xffffffffu); } else if (li < 4u) { atomicStore(&wb[li], 0u); }
  workgroupBarrier();
  let c = vec2f(bitcast<f32>(atomicLoad(&bs[8])), bitcast<f32>(atomicLoad(&bs[9])));
  var mn = vec2f(3e38); var mx = vec2f(-3e38);
  for (var i = gid.x; i < P.n; i += nwg.x * ${$}u) {
    let p = pos[i];
    if (!(all(p == p) && all(abs(p) < vec2f(1e37)))) { continue; } // NaN or inf
    mn = min(mn, p); mx = max(mx, p);
    let d = p - c;
    atomicAdd(&hist[hbin(d.x)], 1u);
    atomicAdd(&hist[${lu}u + hbin(d.y)], 1u);
  }
  atomicMin(&wb[0], fenc(mn.x)); atomicMin(&wb[1], fenc(mn.y));
  atomicMax(&wb[2], fenc(mx.x)); atomicMax(&wb[3], fenc(mx.y));
  workgroupBarrier();
  for (var b = li; b < ${2*lu}u; b += ${$}u) {
    let v = atomicLoad(&hist[b]);
    if (v != 0u) { atomicAdd(&bs[${cu}u + b], v); }
  }
  if (li == 0u) {
    atomicMin(&bs[0], atomicLoad(&wb[0])); atomicMin(&bs[1], atomicLoad(&wb[1]));
    atomicMax(&bs[2], atomicLoad(&wb[2])); atomicMax(&bs[3], atomicLoad(&wb[3]));
  }
}`,BOX:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> bs: array<u32>;
var<workgroup> scan: array<u32, ${$}>;
var<workgroup> found: array<f32, 6>;
var<workgroup> total: u32;
fn fdec(u: u32) -> f32 { return bitcast<f32>(select(~u, u & 0x7fffffffu, (u & 0x80000000u) != 0u)); }
fn keyLo(key: u32) -> f32 { return select(bitcast<f32>((key + 824u) << 20u), 0.0, key == 0u); }
fn keyHi(key: u32) -> f32 { return bitcast<f32>((key + 825u) << 20u); }
fn edgeLo(s: u32) -> f32 { return select(-keyHi(511u - s), keyLo(s - 512u), s >= 512u); }
fn edgeHi(s: u32) -> f32 { return select(-keyLo(511u - s), keyHi(s - 512u), s >= 512u); }
@compute @workgroup_size(${$})
fn main(@builtin(local_invocation_index) li: u32) {
  if (li < 6u) { found[li] = 0.0; }
  for (var a = 0u; a < 2u; a++) {
    let base = ${cu}u + a * ${lu}u + li * 4u;
    var cs = array<u32, 4>(bs[base], bs[base + 1u], bs[base + 2u], bs[base + 3u]);
    let t = cs[0] + cs[1] + cs[2] + cs[3];
    scan[li] = t;
    workgroupBarrier();
    for (var off = 1u; off < ${$}u; off <<= 1u) {
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
}`,BIN:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> bs: array<u32>;
@group(0) @binding(3) var<storage, read_write> cellCount: array<atomic<u32>>;
@group(0) @binding(4) var<storage, read_write> nodeCell: array<u32>;
@group(0) @binding(5) var<storage, read_write> nodeSlot: array<u32>;
@compute @workgroup_size(${$})
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
}`,PLACE:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(2) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(3) var<storage, read> start: array<u32>;
@group(0) @binding(4) var<storage, read_write> slotted: array<u32>;
@compute @workgroup_size(${$})
fn main(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  if (i >= P.n) { return; }
  slotted[start[nodeCell[i] & 0x7fffffffu] + nodeSlot[i]] = i;
}`,ORDER:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read> mass: array<f32>;
@group(0) @binding(3) var<storage, read> nodeCell: array<u32>;
@group(0) @binding(4) var<storage, read> nodeSlot: array<u32>;
@group(0) @binding(5) var<storage, read> start: array<u32>;
@group(0) @binding(6) var<storage, read> slotted: array<u32>;
@group(0) @binding(7) var<storage, read_write> sp: array<vec4f>;
@group(0) @binding(8) var<storage, read_write> perm: array<u32>;
@compute @workgroup_size(${$})
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
}`,SPRINGS:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> chunks: array<vec2u>; // (row, first edge)
@group(0) @binding(2) var<storage, read> csr: array<u32>;      // [rowStart (n + 1), neighbors]
@group(0) @binding(3) var<storage, read> pos: array<vec2f>;
@group(0) @binding(4) var<storage, read_write> springF: array<vec2f>;
@compute @workgroup_size(${$})
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
}`,AGG0:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> start: array<u32>;
@group(0) @binding(2) var<storage, read> sp: array<vec4f>;
@group(0) @binding(3) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${$})
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
}`,LOCAL:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> bs: array<u32>;
@group(0) @binding(2) var<storage, read_write> cells: array<vec4f>;
@compute @workgroup_size(${$})
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
}`,FORCE:uu+`
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

@compute @workgroup_size(${$})
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
}`,FIRE_REDUCE:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read> vel: array<vec4f>;
@group(0) @binding(2) var<storage, read_write> fire: array<vec4f>; // [0]: state, [1 + w]: partials
var<workgroup> red: array<vec4f, ${$}>;
@compute @workgroup_size(${$})
fn main(@builtin(global_invocation_id) gid: vec3u, @builtin(local_invocation_index) li: u32,
        @builtin(workgroup_id) wid: vec3u, @builtin(num_workgroups) nwg: vec3u) {
  var acc = vec4f(0.0);
  for (var i = gid.x; i < P.n; i += nwg.x * ${$}u) {
    let v4 = vel[i];
    if (v4.w != 0.0) { continue; }
    let f = vel[P.n + i].xy;
    acc += vec4f(dot(f, v4.xy), dot(v4.xy, v4.xy), dot(f, f), 0.0);
  }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${$/2}u; s > 0u; s >>= 1u) {
    if (li < s) { red[li] += red[li + s]; }
    workgroupBarrier();
  }
  if (li == 0u) { fire[1u + wid.x] = red[0]; }
}`,FIRE_STATE:`
struct FireParams { groups: u32, pad0: u32, pad1: u32, pad2: u32 };
@group(0) @binding(0) var<uniform> FP: FireParams;
@group(0) @binding(1) var<storage, read_write> fire: array<vec4f>;
var<workgroup> red: array<vec4f, ${$}>;
@compute @workgroup_size(${$})
fn main(@builtin(local_invocation_index) li: u32) {
  var acc = vec4f(0.0);
  for (var w = li; w < FP.groups; w += ${$}u) { acc += fire[1u + w]; }
  red[li] = acc;
  workgroupBarrier();
  for (var s = ${$/2}u; s > 0u; s >>= 1u) {
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
}`,FIRE_INTEGRATE:uu+`
@group(0) @binding(0) var<uniform> P: Params;
@group(0) @binding(1) var<storage, read_write> pos: array<vec2f>;
@group(0) @binding(2) var<storage, read_write> vel: array<vec4f>;
@group(0) @binding(3) var<storage, read> mass: array<f32>;
@group(0) @binding(4) var<storage, read> fire: array<vec4f>;
@compute @workgroup_size(${$})
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
}`},fu=new WeakMap;function pu(e){let t=fu.get(e);if(!t){t={};for(let[n,r]of Object.entries(du))t[n]=e.createComputePipeline({layout:`auto`,compute:{module:e.createShaderModule({code:r,label:n}),entryPoint:`main`},label:n});fu.set(e,t)}return t}function mu(e){let t=32;for(;t*t*2<e&&t<1024;)t*=2;return t}function hu(e,{n:t,edges:n,init:r,mass:i}){let a=pu(e),o=mu(t),s=Math.log2(o),c=o*o,l=c/1024,u=new Uint32Array(t);for(let e=0;e<n.length;e+=2)u[n[e]]++,u[n[e+1]]++;let d=new Uint32Array(t+1+2*(n.length/2));for(let e=0;e<t;e++)d[e+1]=d[e]+u[e];let f=d.slice(0,t);for(let e=0;e<n.length;e+=2){let r=n[e],i=n[e+1];d[t+1+f[r]++]=i,d[t+1+f[i]++]=r}let p=0;for(let e=0;e<t;e++)p+=Math.ceil(u[e]/au);let m=new Uint32Array(Math.max(2,2*p)),h=new Uint32Array(t+1);for(let e=0,n=0;e<t;e++){h[e]=n;for(let t=d[e];t<d[e+1];t+=au,n++)m[2*n]=e,m[2*n+1]=t}h[t]=p;let g=GPUBufferUsage.STORAGE,_=GPUBufferUsage.COPY_DST,v=GPUBufferUsage.COPY_SRC,y=[],b=(t,n=g)=>{let r=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n});return y.push(r),r},x=(t,n=g|_)=>{let r=b(t.byteLength,n);return e.queue.writeBuffer(r,0,t),r},S=x(r,g|_|v),C=b(t*32,g|_),w=x(i),T=x(d),E=x(m),D=x(h),O=b(Math.max(1,p)*8),k=b(c*4,g|_),A=b(c*4),j=b(Math.max(l,4)*4),ee=b(t*4),M=b(t*4),N=b(t*4),P=b(t*4),te=b(t*16),F=0,I=[];for(let e=0,t=o;e<=s;e++,t>>=1)I.push(F),F+=t*t;let ne=b((F+2*I[s])*16),L=b(4112,g|_),R=Math.min(su,Math.ceil(t/$)),z=new Uint32Array(2064),re=new Float32Array(z.buffer);{let e=1/0,n=1/0,i=-1/0,a=-1/0;for(let o=0;o<t;o++){let t=r[2*o],s=r[2*o+1];t<e&&(e=t),t>i&&(i=t),s<n&&(n=s),s>a&&(a=s)}let s=Math.max(i-e,a-n,.001)*1.0001;re[4]=(e+i-s)/2,re[5]=(n+a-s)/2,re[6]=s,re[7]=o/s,z[0]=z[1]=4294967295}let ie=x(z,g|_|v),ae=new ArrayBuffer(64),oe=new Uint32Array(ae),se=new Float32Array(ae);oe[0]=t,oe[1]=o,oe[2]=s,oe[3]=c,oe[10]=ou,oe[12]=au,oe[13]=Math.max(1,Math.floor(t/1e3)),oe[14]=p,oe[15]=F;let B=b(64,GPUBufferUsage.UNIFORM|_),ce=x(new Uint32Array([l,0,0,0]),GPUBufferUsage.UNIFORM|_),le=x(new Uint32Array([R,0,0,0]),GPUBufferUsage.UNIFORM|_),V=(t,n)=>e.createBindGroup({layout:t.getBindGroupLayout(0),entries:n.map((e,t)=>({binding:t,resource:{buffer:e}}))}),ue={HIST:V(a.HIST,[B,S,ie]),BOX:V(a.BOX,[B,ie]),BIN:V(a.BIN,[B,S,ie,k,ee,M]),SCAN_BLOCKS:V(a.SCAN_BLOCKS,[k,A,j]),SCAN_TOP:V(a.SCAN_TOP,[j,ce]),SCAN_ADD:V(a.SCAN_ADD,[A,j]),PLACE:V(a.PLACE,[B,ee,M,A,N]),ORDER:V(a.ORDER,[B,S,w,ee,M,A,N,te,P]),SPRINGS:V(a.SPRINGS,[B,E,T,S,O]),AGG0:V(a.AGG0,[B,A,te,ne]),LOCAL:V(a.LOCAL,[B,ie,ne]),FORCE:V(a.FORCE,[B,te,P,A,ne,O,D,S,C]),FIRE_REDUCE:V(a.FIRE_REDUCE,[B,C,L]),FIRE_STATE:V(a.FIRE_STATE,[le,L]),FIRE_INTEGRATE:V(a.FIRE_INTEGRATE,[B,S,C,w,L])},de=[];for(let e=0;e<s;e++){let t=(o>>e+1)**2,n=x(new Uint32Array([t,I[e],I[e+1],0]),GPUBufferUsage.UNIFORM|_);de.push({count:t,group:V(a.PYR,[n,ne])})}let fe=Math.ceil(t/$),pe=Math.min(fe,128),me=!1;function he(){e.queue.writeBuffer(L,0,new Float32Array([.1,0,0,0]))}he();function ge(e,t,n){e.setPipeline(a[t]),e.setBindGroup(0,ue[t]),e.dispatchWorkgroups(n)}function _e(e){ge(e,`HIST`,pe),ge(e,`BOX`,1),ge(e,`BIN`,fe),ge(e,`SCAN_BLOCKS`,l),ge(e,`SCAN_TOP`,1),ge(e,`SCAN_ADD`,Math.ceil(c/256)),ge(e,`PLACE`,fe),ge(e,`ORDER`,fe),p&&ge(e,`SPRINGS`,Math.ceil(p/$)),ge(e,`AGG0`,Math.ceil(c/$)),e.setPipeline(a.PYR);for(let{count:t,group:n}of de)e.setBindGroup(0,n),e.dispatchWorkgroups(Math.ceil(t/256));ge(e,`LOCAL`,Math.ceil(I[s]/$)),ge(e,`FORCE`,fe),me&&(ge(e,`FIRE_REDUCE`,R),ge(e,`FIRE_STATE`,1),ge(e,`FIRE_INTEGRATE`,fe))}return{kind:`grid`,G:o,pos:S,vel:C,setParams(t){se[4]=t.gravity,se[5]=t.springLength,se[6]=t.springCoefficient,se[7]=t.dragCoefficient,se[8]=t.timeStep,se[9]=t.maxVelocity,oe[11]=+(t.integrator===`fire`),me=oe[11]===1,e.queue.writeBuffer(B,0,ae)},resetFire:he,run(t,n,r){for(let i=0;i<t;){let a=Math.min(64,t-i),o=e.createCommandEncoder(),s=i===0,c=i+a===t,l;n&&(s||c)&&(l={querySet:n.querySet},s&&(l.beginningOfPassWriteIndex=0),c&&(l.endOfPassWriteIndex=1));let u=o.beginComputePass(l?{timestampWrites:l}:void 0);for(let e=0;e<a;e++)_e(u);u.end(),c&&r&&r(o),e.queue.submit([o.finish()]),i+=a}},boxBuffer:ie,destroy(){for(let e of y)e.destroy()}}}var gu=`
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
}`,_u=new WeakMap;function vu(e){return Math.max(32,Math.ceil(e/32)*32)}function yu(e,t){let n=vu(t),r=e.limits;return t<=1024&&r.maxComputeInvocationsPerWorkgroup>=n&&r.maxComputeWorkgroupSizeX>=n&&r.maxComputeWorkgroupStorageSize>=16*n}function bu(e,{n:t,edges:n,init:r,mass:i}){let a=new Uint32Array(t);for(let e=0;e<n.length;e+=2)a[n[e]]++,a[n[e+1]]++;let o=new Uint32Array(t+1+n.length);for(let e=0;e<t;e++)o[e+1]=o[e]+a[e];let s=o.slice(0,t);for(let e=0;e<n.length;e+=2){let r=n[e],i=n[e+1];o[t+1+s[r]++]=i,o[t+1+s[i]++]=r}let c=GPUBufferUsage.STORAGE,l=GPUBufferUsage.COPY_DST,u=GPUBufferUsage.COPY_SRC,d=[],f=(t,n)=>{let r=e.createBuffer({size:Math.max(16,Math.ceil(t/16)*16),usage:n});return d.push(r),r},p=(t,n=c|l)=>{let r=f(t.byteLength,n);return e.queue.writeBuffer(r,0,t),r},m=p(r,c|l|u),h=f(t*16,c|l),g=p(i),_=p(o),v=f(16,c|l),y=f(48,GPUBufferUsage.UNIFORM|l),b=vu(t),x=_u.get(e);x||(x=new Map,_u.set(e,x));let S=x.get(b);S||(S=e.createComputePipeline({layout:`auto`,compute:{module:e.createShaderModule({code:gu,label:`small`}),entryPoint:`main`,constants:{WGS:b}},label:`small-${b}`}),x.set(b,S));let C=e.createBindGroup({layout:S.getBindGroupLayout(0),entries:[y,m,h,g,_,v].map((e,t)=>({binding:t,resource:{buffer:e}}))}),w=new ArrayBuffer(48),T=new Uint32Array(w),E=new Float32Array(w);T[0]=t;let D=new Uint32Array(1);function O(){e.queue.writeBuffer(v,0,new Float32Array([.1,0,0,0]))}return O(),{kind:`small`,G:0,pos:m,vel:h,setParams(t){T[2]=+(t.integrator===`fire`),E[4]=t.gravity,E[5]=t.springLength,E[6]=t.springCoefficient,E[7]=t.dragCoefficient,E[8]=t.timeStep,E[9]=t.maxVelocity,e.queue.writeBuffer(y,0,w)},resetFire:O,run(t,n,r){for(let i=0;i<t;){let a=Math.min(64,t-i);D[0]=a,e.queue.writeBuffer(y,4,D);let o=e.createCommandEncoder(),s=i===0,c=i+a===t,l;n&&(s||c)&&(l={querySet:n.querySet},s&&(l.beginningOfPassWriteIndex=0),c&&(l.endOfPassWriteIndex=1));let u=o.beginComputePass(l?{timestampWrites:l}:void 0);u.setPipeline(S),u.setBindGroup(0,C),u.dispatchWorkgroups(1),u.end(),c&&r&&r(o),e.queue.submit([o.finish()]),i+=a}},destroy(){for(let e of d)e.destroy()}}}var xu={timeStep:.5,springLength:10,springCoefficient:.8,dragCoefficient:.9,gravity:-12,maxVelocity:4,integrator:`euler`},Su=3,Cu=30,wu=4096,Tu=null,Eu=new WeakMap;async function Du(){return Tu||=Ou(),Tu}async function Ou(){try{if(typeof navigator>`u`||!navigator.gpu)return null;let e=await navigator.gpu.requestAdapter({powerPreference:`high-performance`});if(!e)return null;let t={};for(let n of[`maxStorageBuffersPerShaderStage`,`maxStorageBufferBindingSize`,`maxBufferSize`,`maxComputeInvocationsPerWorkgroup`,`maxComputeWorkgroupSizeX`,`maxComputeWorkgroupStorageSize`])t[n]=e.limits[n];let n=e.features.has(`timestamp-query`)?[`timestamp-query`]:[],r=await e.requestDevice({requiredFeatures:n,requiredLimits:t});return ku(r),r.lost.then(()=>{Tu=null}),r}catch(e){return console.warn(`WebGPU is not available:`,e),null}}function ku(e){let t=Eu.get(e);return t||(t={errors:0,lost:!1},Eu.set(e,t),e.addEventListener(`uncapturederror`,e=>{t.errors+=1,console.error(`WebGPU error:`,e.error&&e.error.message)}),e.lost.then(e=>{t.lost=!0,e.reason!==`destroyed`&&console.error(`WebGPU device lost:`,e.message)}),t)}function Au(e,t,n={}){let r=ku(e),i=r.errors,a=Object.assign({},xu);ju(a,n.settings);let o=[];t.forEachNode(e=>{o.push(e.id)});let s=o.length,c=new Map;for(let e=0;e<s;e++)c.set(o[e],e);let l=new Float64Array(s),u=new Float64Array(s),d=Math.sqrt(s)*a.springLength;for(let e=0;e<s;e++){let t=n.getInitialPosition?n.getInitialPosition(o[e]):null;t&&Number.isFinite(t.x)&&Number.isFinite(t.y)?(l[e]=t.x,u[e]=t.y):(l[e]=(Nu(e,1)-.5)*d,u[e]=(Nu(e,2)-.5)*d)}Pu(l,u);let f=Fu(l,u),p=f.x,m=f.y,h=[];t.forEachLink(e=>{if(e.fromId===e.toId)return;let t=c.get(e.fromId),n=c.get(e.toId);t!==void 0&&n!==void 0&&h.push(t,n)});let g=new Float32Array(s);for(let e=0;e<s;e++){let n=t.getLinks?t.getLinks(o[e]):null,r=n?n.size===void 0?n.length:n.size:0;g[e]=1+r/3}let _=s>0&&yu(e,s),v=!_&&s>=wu?Iu(l,u,f):Mu(s),y=new Float32Array(2*s),b=new Float32Array(s);for(let e=0;e<s;e++){let t=v[e];y[2*t]=l[e]-p,y[2*t+1]=u[e]-m,b[t]=g[e]}let x=new Uint32Array(h.length);for(let e=0;e<h.length;e++)x[e]=v[h[e]];let S=null,C=null;if(s>0){e.pushErrorScope(`validation`),e.pushErrorScope(`out-of-memory`),S=(_?bu:hu)(e,{n:s,edges:x,init:y,mass:b}),S.setParams(a);let t=e=>{e&&(C=e.message,console.error(`WebGPU layout setup failed:`,e.message))};e.popErrorScope().then(t),e.popErrorScope().then(t)}let w=new Float32Array(y),T=Array(s),E=null,D=!!S&&e.features.has(`timestamp-query`),O=s*8,k=Math.max(16,O+(D?16:0)),A=[],j=[];if(S)for(let t=0;t<Su;t++){let t=e.createBuffer({size:k,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST});j.push(t),A.push({buffer:t})}let ee=null,M=null;D&&(ee=e.createQuerySet({type:`timestamp`,count:2}),M=e.createBuffer({size:16,usage:GPUBufferUsage.QUERY_RESOLVE|GPUBufferUsage.COPY_SRC}));let N=!1,P=0,te=0,F=0,I=0,ne=new Map,L=[],R=null,z=[];return{step:re,getNodePosition:se,setNodePosition:B,pinNode:ce,getGraphRect:le,updateSettings:V,getStats:ue,flush:de,dispose:fe,get settings(){return Object.assign({},a)},_engine:S};function re(e=1){if(N||!S||r.lost||(e=Math.floor(e),!(e>0)))return;let t=A.pop(),n=!!t&&D;S.run(e,n?{querySet:ee}:null,t?e=>{e.copyBufferToBuffer(S.pos,0,t.buffer,0,s*8),n&&(e.resolveQuerySet(ee,0,2,M,0),e.copyBufferToBuffer(M,0,t.buffer,O,16))}:null),P+=e,t&&ie(t,e,n)}function ie(e,t,n){e.serial=++te,e.steps=P,F=P,e.buffer.mapAsync(GPUMapMode.READ).then(()=>{if(!N){if(ae(e,new Float32Array(e.buffer.getMappedRange(0,s*8))),n){let n=new BigUint64Array(e.buffer.getMappedRange(O,16)),r=Number(n[1]-n[0]);n[1]>n[0]&&r<6e10&&oe(r/1e6,t)}else{let t=performance.now();R&&e.steps>R.steps&&oe(t-R.time,e.steps-R.steps),R={time:t,steps:e.steps}}e.buffer.unmap(),A.push(e)}}).catch(()=>{})}function ae(e,t){if(e.serial>I){I=e.serial,w.set(t),ne.forEach((t,n)=>{t.serial<=e.serial?ne.delete(n):(w[2*n]=t.x,w[2*n+1]=t.y)});for(let e=0;e<s;e++){let t=T[e];t&&(t.x=w[2*e]+p,t.y=w[2*e+1]+m)}E=null}for(let e=z.length-1;e>=0;e--)z[e].serial<=I&&(z[e].resolve(),z.splice(e,1))}function oe(e,t){L.push({ms:e,steps:t}),L.length>Cu&&L.shift()}function se(e){let t=c.get(e);if(t===void 0)return;let n=v[t],r=T[n];return r||(r={x:w[2*n]+p,y:w[2*n+1]+m},T[n]=r),r}function B(t,n,r){let i=c.get(t);if(i===void 0||N)return;let a=v[i],o=n-p,s=r-m;w[2*a]=o,w[2*a+1]=s;let l=T[a];l&&(l.x=n,l.y=r),E=null,S&&(e.queue.writeBuffer(S.pos,a*8,new Float32Array([o,s])),ne.set(a,{x:o,y:s,serial:te+1}))}function ce(t,n){let r=c.get(t);r!==void 0&&!N&&S&&e.queue.writeBuffer(S.vel,v[r]*16,new Float32Array([0,0,0,+!!n]))}function le(){if(!E){let e=1/0,t=1/0,n=-1/0,r=-1/0;for(let i=0;i<s;i++){let a=w[2*i],o=w[2*i+1];a<e&&(e=a),a>n&&(n=a),o<t&&(t=o),o>r&&(r=o)}E=s?{min_x:e+p,min_y:t+m,max_x:n+p,max_y:r+m}:{min_x:0,min_y:0,max_x:0,max_y:0}}return{min_x:E.min_x,min_y:E.min_y,max_x:E.max_x,max_y:E.max_y}}function V(e){if(N)return;let t=a.integrator===`fire`;ju(a,e),S&&(S.setParams(a),a.integrator===`fire`&&!t&&S.resetFire())}function ue(){let e=0,t=0;for(let n of L)e+=n.ms,t+=n.steps;return{steps:P,msPerStep:t?e/t:0,source:D?`gpu-timestamps`:`wall-clock`,engine:S?S.kind:`none`,nodes:s,errors:r.errors-i+ +!!C,lost:r.lost}}function de(){if(N||!S||r.lost)return Promise.resolve();if(P>F){let t=e.createBuffer({size:s*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),n=e.createCommandEncoder();n.copyBufferToBuffer(S.pos,0,t,0,s*8),e.queue.submit([n.finish()]);let r={buffer:t,serial:++te};return F=P,t.mapAsync(GPUMapMode.READ).then(()=>{N||ae(r,new Float32Array(t.getMappedRange())),t.destroy()}).catch(()=>t.destroy())}if(I>=te)return Promise.resolve();let t=te;return new Promise(e=>z.push({serial:t,resolve:e}))}function fe(){if(!N){N=!0,S&&S.destroy();for(let e of j)e.destroy();ee&&ee.destroy(),M&&M.destroy(),z.forEach(e=>e.resolve()),z.length=0}}}function ju(e,t){if(!t)return e;for(let n of Object.keys(xu)){let r=t[n];r!=null&&(n===`integrator`?(r!==`euler`&&r!==`fire`&&console.warn(`Unknown integrator "${r}", using euler`),e.integrator=r===`fire`?`fire`:`euler`):Number.isFinite(+r)&&(e[n]=+r))}return e.maxVelocity>0||(e.maxVelocity=1),e}function Mu(e){let t=new Uint32Array(e);for(let n=0;n<e;n++)t[n]=n;return t}function Nu(e,t){let n=Math.imul(e+1,2654435761)^Math.imul(t,2246822519);return n=Math.imul(n^n>>>16,2146121005),n=Math.imul(n^n>>>15,2221713035),((n^n>>>16)>>>0)/4294967296}function Pu(e,t){let n=e.length;if(n<2)return;let r=1;for(;r<2*n;)r<<=1;let i=new Int32Array(r).fill(-1),a=new Uint32Array(n),o=new Float64Array(2),s=new Uint32Array(o.buffer);for(let c=0;c<n;c++){o[0]=e[c]+0,o[1]=t[c]+0;let n=(Math.imul(s[0]^s[1],2654435761)^Math.imul(s[2]^s[3],2246822519))>>>0;n=(n^n>>>15)&r-1;let l=-1;for(;;){let a=i[n];if(a===-1){i[n]=c;break}if(e[a]===e[c]&&t[a]===t[c]){l=a;break}n=n+1&r-1}if(l>=0){let n=++a[l],r=Math.sqrt(n),i=n*2.399963229728653;e[c]=e[l]+r*Math.cos(i),t[c]=t[l]+r*Math.sin(i)}}}function Fu(e,t){let n=e.length;if(!n)return{x:0,y:0,minX:0,minY:0,side:1};let r=Math.max(1,Math.floor(n/4096)),i=[],a=[];for(let o=0;o<n;o+=r)i.push(e[o]),a.push(t[o]);let o=Float64Array.from(i).sort(),s=Float64Array.from(a).sort(),c=(e,t)=>e[Math.min(e.length-1,Math.max(0,Math.round(t*(e.length-1))))],l=c(o,.001),u=c(o,.999),d=c(s,.001),f=c(s,.999);return{x:c(o,.5),y:c(s,.5),minX:l,minY:d,side:Math.max(u-l,f-d)||1}}function Iu(e,t,n){let r=e.length,i=4096,a=new Float64Array(r);for(let o=0;o<r;o++){let r=Math.min(4095,Math.max(0,Math.floor((e[o]-n.minX)/n.side*i))),s=Math.min(4095,Math.max(0,Math.floor((t[o]-n.minY)/n.side*i))),c=0;for(let e=2048;e>0;e>>=1){let t=+((r&e)>0),n=+((s&e)>0);if(c+=e*e*(3*t^n),n===0){t===1&&(r=e-1-r,s=e-1-s);let n=r;r=s,s=n}}a[o]=c*16777216+o}a.sort();let o=new Uint32Array(r);for(let e=0;e<r;e++)o[a[e]%16777216]=e;return o}var Lu=[`timeStep`,`springLength`,`springCoefficient`,`dimensions`,`dragCoefficient`,`gravity`,`theta`,`maxVelocity`,`integrator`,`nbody`];function Ru(e,t={},n={}){let r,i,a,o,s,c=`cpu`,l,u,d=!1,f=!1,p,m=n.stepsPerFrame||1,h=n.placement||`default`,g=``,_=zu();return bl.on(`load-graph`,v),{dispose:te,runLayout:k,updateLayoutSettings:A,setFixedViewBox:j,setStepsPerFrame:S,setPlacement:x,setBackend:C,restart:y,getStats:E};function v(e,n){a&&(a.dispose(),T(!1),i.dispose(),a=null,cancelAnimationFrame(p)),a=ee(),r=e,window.graph=r,$c(a,{showGrid:!0,lineColor:4294967056,maxAlpha:16,showCursor:!1}),i=Hl(r,t),b(),c===`webgpu`&&w(),_.reset(),O(),M(),f=!0,p=requestAnimationFrame(N)}function y(){T(!1),i.dispose(),i=Hl(r,t),b(),c===`webgpu`&&w(),_.reset(),O()}function b(){g=``,h===`pivot`&&(g=Yl(r,i,{dimensions:t.dimensions||2,unit:t.springLength||10}))}function x(e){h!==e&&(h=e,r&&y())}function S(e){m=Math.max(1,Math.round(e)||1)}async function C(e){if(e===`webgpu`&&c!==`webgpu`){if((t.dimensions||2)!==2||(l||=await Du(),!l))return c;c=`webgpu`,r&&w()}else e===`cpu`&&c!==`cpu`&&(c=`cpu`,T(!0));return _.reset(),c}function w(){u=Au(l,r,{settings:t,getInitialPosition:e=>i.getNodePosition(e)})}function T(e){u&&=(e&&r.forEachNode(e=>{let t=u.getNodePosition(e.id);i.setNodePosition(e.id,t.x,t.y)}),u.dispose(),null)}function E(){return{backend:c,nodes:r?r.getNodesCount():0,links:r?r.getLinksCount():0,steps:_.steps,msPerStep:u?u.getStats().msPerStep:_.msPerStep(),placement:g}}function D(){return u||i}function O(){let e=D().getGraphRect(),t=(e.min_x+e.max_x)/2,n=(e.min_y+e.max_y)/2,r=Math.max(e.max_x-e.min_x,e.max_y-e.min_y)*.6;(!Number.isFinite(r)||r<100.8)&&(t=n=0,r=100.8),a.setViewBox({left:t-r,top:n-r,right:t+r,bottom:n+r})}function k(e){f=e}function A(e){let n=Lu,a=t&&t.dimensions||2;if(t=n.reduce((t,n)=>(t[n]=e[n],t),{}),i){if(u&&t.dimensions!==2&&(c=`cpu`,T(!0)),t.dimensions!==a){let e=i;i=Hl(r,t),r.forEachNode(n=>{let r=e.getNodePosition(n.id),o=Object.keys(r).map(e=>r[e]);for(let e=a;e<t.dimensions;++e)o.push(Math.random());o.unshift(n.id),i.setNodePosition.apply(i,o)}),e.dispose()}else n.forEach(e=>{i.simulator[e](t[e])}),u&&u.updateSettings(t)}}function j(e){d=e}function ee(){let t=jc(e);return t.setClearColor(12/255,41/255,82/255,1),t}function M(){o=new gl(a.getGL(),{capacity:r.getNodesCount()}),r.forEachNode(e=>{var t=D().getNodePosition(e.id);let n=1;e.data&&e.data.size?n=e.data.size:(e.data||={},e.data.size=n),e.ui={size:n,position:[t.x,t.y,t.z||0],color:2432236799},e.uiId=o.add(e.ui)}),s=new hl(a.getGL(),{capacity:r.getLinksCount()}),r.forEachLink(e=>{var t=D().getNodePosition(e.fromId),n=D().getNodePosition(e.toId);e.ui={from:[t.x,t.y,t.z||0],to:[n.x,n.y,n.z||0],color:4294967056},e.uiId=s.add(e.ui)}),a.appendChild(s),a.appendChild(o)}function N(){if(p=requestAnimationFrame(N),u&&u.getStats().lost&&(c=`cpu`,T(!0)),f){let e=performance.now();if(u)u.step(m);else for(let e=0;e<m;++e)i.step();if(_.record(performance.now()-e,m),d){let e=D().getGraphRect();a.setViewBox({left:e.min_x,top:e.min_y,right:e.max_x,bottom:e.max_y})}}P(),a.renderFrame()}function P(){let e=[`x`,`y`,`z`],t=D();r.forEachNode(n=>{let r=t.getNodePosition(n.id),i=n.ui.position;for(let t=0;t<3;++t)i[t]=r[e[t]]||0;o.update(n.uiId,n.ui)}),r.forEachLink(n=>{var r=t.getNodePosition(n.fromId),i=t.getNodePosition(n.toId);let{from:a,to:o}=n.ui;for(let t=0;t<3;++t)a[t]=r[e[t]]||0,o[t]=i[e[t]]||0;s.update(n.uiId,n.ui)})}function te(){cancelAnimationFrame(p),T(!1),a.dispose(),bl.off(`load-graph`,v)}}function zu(){let e=[],t={steps:0,record(n,r){t.steps+=r,e.push(n/r),e.length>30&&e.shift()},reset(){t.steps=0,e=[]},msPerStep(){return e.length===0?0:e.reduce((e,t)=>e+t,0)/e.length}};return t}function Bu(){return`Miserables.Binary.Grid 100x100 (10k).Binary tree (8k).Watts-Strogatz (10k).Barabasi-Albert (20k).Barabasi-Albert (100k).HB/blckhole.Bai/rw5151.HB/bcsstm13.HB/lshp1882.HB/plat1919.HB/bcsstk26.Bai/dw256A.Bai/tols2000.Bai/dw1024.Bai/rdb2048.Pajek/CSphd.GHS_indef/laser.Bai/bfwa398.Bai/bfwa62.Bai/bfwb398.Bai/bfwb62.Bai/bfwb782.Bai/bwm200.Bai/cdde1.Bai/cdde2.Bai/cdde3.Bai/cdde4.Bai/cdde5.Bai/cdde6.Bai/ck104.Bai/ck400.Bai/ck656.Bai/dw256B.Bai/dwa512.Bai/dwb512.Bai/dwg961a.Bai/lop163.Bai/mhdb416.Bai/odepa400.Bai/olm100.Bai/olm1000.Bai/olm500.Bai/pde225.Bai/pde900.Bai/qh1484.Bai/qh768.Bai/qh882.Bai/rdb1250.Bai/rdb1250l.Bai/rdb200.Bai/rdb200l.Bai/rdb450.Bai/rdb450l.Bai/rdb800l.Bai/rdb968.Bai/rw136.Bai/rw496.Bai/tols1090.Bai/tols340.Bai/tols90.Bai/tub100.Bai/tub1000.Barabasi/NotreDame_yeast.Bates/Chem97ZtZ.FEMLAB/poisson2D.FEMLAB/problem1.FIDAP/ex1.FIDAP/ex5.Grund/b1_ss.Grund/d_ss.Grund/poli.Gset/G11.Gset/G12.Gset/G13.Gset/G14.Gset/G15.Gset/G16.Gset/G17.Gset/G18.Gset/G19.Gset/G20.Gset/G21.Gset/G32.Gset/G33.Gset/G34.Gset/G35.Gset/G36.Gset/G37.Gset/G38.Gset/G39.Gset/G40.Gset/G41.Gset/G42.Gset/G43.Gset/G44.Gset/G45.Gset/G46.Gset/G47.Gset/G48.Gset/G49.Gset/G50.Gset/G51.Gset/G52.Gset/G53.Gset/G54.Gset/G55.Gset/G57.Hamrle/Hamrle1.HB/1138_bus.HB/494_bus.HB/662_bus.HB/685_bus.HB/abb313.HB/arc130.HB/ash219.HB/ash292.HB/ash331.HB/ash608.HB/ash85.HB/ash958.HB/bcspwr01.HB/bcspwr02.HB/bcspwr03.HB/bcspwr04.HB/bcspwr05.HB/bcspwr06.HB/bcspwr07.HB/bcspwr08.HB/bcspwr09.HB/bcsstk01.HB/bcsstk02.HB/bcsstk03.HB/bcsstk04.HB/bcsstk05.HB/bcsstk06.HB/bcsstk07.HB/bcsstk19.HB/bcsstk20.HB/bcsstk22.HB/bcsstm01.HB/bcsstm02.HB/bcsstm03.HB/bcsstm04.HB/bcsstm05.HB/bcsstm06.HB/bcsstm07.HB/bcsstm08.HB/bcsstm09.HB/bcsstm11.HB/bcsstm19.HB/bcsstm20.HB/bcsstm21.HB/bcsstm22.HB/bcsstm23.HB/bcsstm24.HB/bcsstm26.HB/bp_0.HB/bp_1000.HB/bp_1200.HB/bp_1400.HB/bp_1600.HB/bp_200.HB/bp_400.HB/bp_600.HB/bp_800.HB/can_1054.HB/can_1072.HB/can_144.HB/can_161.HB/can_187.HB/can_229.HB/can_24.HB/can_256.HB/can_268.HB/can_292.HB/can_445.HB/can_61.HB/can_62.HB/can_634.HB/can_715.HB/can_73.HB/can_838.HB/can_96.HB/curtis54.HB/dwt_1005.HB/dwt_1007.HB/dwt_1242.HB/dwt_162.HB/dwt_193.HB/dwt_198.HB/dwt_209.HB/dwt_221.HB/dwt_234.HB/dwt_245.HB/dwt_2680.HB/dwt_307.HB/dwt_310.HB/dwt_346.HB/dwt_361.HB/dwt_419.HB/dwt_492.HB/dwt_503.HB/dwt_512.HB/dwt_59.HB/dwt_592.HB/dwt_607.HB/dwt_66.HB/dwt_72.HB/dwt_758.HB/dwt_869.HB/dwt_87.HB/dwt_878.HB/dwt_918.HB/dwt_992.HB/eris1176.HB/fs_183_1.HB/fs_183_3.HB/fs_183_4.HB/fs_183_6.HB/fs_541_1.HB/fs_541_2.HB/fs_541_3.HB/fs_541_4.HB/fs_680_1.HB/fs_680_2.HB/fs_680_3.HB/gent113.HB/gr_30_30.HB/gre_1107.HB/gre_115.HB/gre_185.HB/gre_216a.HB/gre_216b.HB/gre_343.HB/gre_512.HB/hor_131.HB/ibm32.HB/illc1033.HB/impcol_a.HB/impcol_b.HB/impcol_c.HB/impcol_d.HB/impcol_e.HB/jagmesh1.HB/jagmesh2.HB/jagmesh3.HB/jagmesh4.HB/jagmesh5.HB/jagmesh7.HB/jagmesh8.HB/jagmesh9.HB/jgl009.HB/jgl011.HB/jpwh_991.HB/lap_25.HB/lns_131.HB/lns_511.HB/lnsp_131.HB/lnsp_511.HB/lock_700.HB/lshp1009.HB/lshp1270.HB/lshp1561.HB/lshp2233.HB/lshp2614.HB/lshp3025.HB/lshp3466.HB/lshp_265.HB/lshp_406.HB/lshp_577.HB/lshp_778.HB/lund_a.HB/lund_b.HB/mcca.HB/nnc261.HB/nnc666.HB/nos1.HB/nos2.HB/nos4.HB/nos5.HB/nos6.HB/nos7.HB/orsirr_1.HB/orsirr_2.HB/plat362.HB/plskz362.HB/pores_1.HB/pores_3.HB/rgg010.HB/saylr1.HB/saylr3.HB/sherman1.HB/sherman4.HB/shl_0.HB/shl_200.HB/shl_400.HB/sstmodel.HB/steam1.HB/steam3.HB/str_0.HB/str_200.HB/str_400.HB/str_600.HB/well1033.HB/west0067.HB/west0132.HB/west0156.HB/west0167.HB/west0381.HB/west0479.HB/west0497.HB/west0655.HB/west0989.HB/west1505.HB/west2021.HB/will199.HB/will57.HB/wm1.HB/wm2.HB/wm3.HB/young1c.HB/young2c.HB/young3c.HB/young4c.JGD_BIBD/bibd_11_5.JGD_BIBD/bibd_12_4.JGD_BIBD/bibd_12_5.JGD_BIBD/bibd_15_3.JGD_BIBD/bibd_17_3.JGD_BIBD/bibd_17_4.JGD_BIBD/bibd_17_4b.JGD_BIBD/bibd_81_2.JGD_BIBD/bibd_9_3.JGD_BIBD/bibd_9_5.JGD_CAG/CAG_mat364.JGD_CAG/CAG_mat72.JGD_Forest/TF10.JGD_Forest/TF11.JGD_Forest/TF12.JGD_Forest/TF13.JGD_Franz/Franz1.JGD_Franz/Franz3.JGD_G5/IG5-10.JGD_G5/IG5-6.JGD_G5/IG5-7.JGD_G5/IG5-8.JGD_G5/IG5-9.JGD_GL6/GL6_D_10.JGD_GL6/GL6_D_6.JGD_GL6/GL6_D_7.JGD_GL6/GL6_D_8.JGD_GL6/GL6_D_9.JGD_GL7d/GL7d10.JGD_GL7d/GL7d11.JGD_GL7d/GL7d26.JGD_Homology/ch3-3-b1.JGD_Homology/ch3-3-b2.JGD_Homology/ch4-4-b1.JGD_Homology/ch4-4-b2.JGD_Homology/ch4-4-b3.JGD_Homology/ch5-5-b1.JGD_Homology/ch5-5-b2.JGD_Homology/ch5-5-b3.JGD_Homology/ch5-5-b4.JGD_Homology/ch6-6-b1.JGD_Homology/ch6-6-b2.JGD_Homology/ch6-6-b5.JGD_Homology/ch7-6-b1.JGD_Homology/ch7-7-b1.JGD_Homology/ch7-8-b1.JGD_Homology/ch7-9-b1.JGD_Homology/ch8-8-b1.JGD_Homology/cis-n4c6-b1.JGD_Homology/cis-n4c6-b15.JGD_Homology/cis-n4c6-b2.JGD_Homology/klein-b1.JGD_Homology/klein-b2.JGD_Homology/mk10-b1.JGD_Homology/mk10-b2.JGD_Homology/mk10-b4.JGD_Homology/mk11-b1.JGD_Homology/mk12-b1.JGD_Homology/mk9-b1.JGD_Homology/mk9-b2.JGD_Homology/mk9-b3.JGD_Homology/n2c6-b1.JGD_Homology/n2c6-b10.JGD_Homology/n2c6-b2.JGD_Homology/n2c6-b3.JGD_Homology/n2c6-b9.JGD_Homology/n3c4-b1.JGD_Homology/n3c4-b2.JGD_Homology/n3c4-b3.JGD_Homology/n3c4-b4.JGD_Homology/n3c5-b1.JGD_Homology/n3c5-b2.JGD_Homology/n3c5-b3.JGD_Homology/n3c5-b4.JGD_Homology/n3c5-b5.JGD_Homology/n3c5-b6.JGD_Homology/n3c5-b7.JGD_Homology/n3c6-b1.JGD_Homology/n3c6-b10.JGD_Homology/n3c6-b11.JGD_Homology/n3c6-b2.JGD_Homology/n3c6-b3.JGD_Homology/n4c5-b1.JGD_Homology/n4c5-b10.JGD_Homology/n4c5-b11.JGD_Homology/n4c5-b2.JGD_Homology/n4c5-b3.JGD_Homology/n4c5-b9.JGD_Homology/n4c6-b1.JGD_Homology/n4c6-b15.JGD_Homology/n4c6-b2.JGD_Kocay/Trec10.JGD_Kocay/Trec3.JGD_Kocay/Trec4.JGD_Kocay/Trec5.JGD_Kocay/Trec6.JGD_Kocay/Trec7.JGD_Kocay/Trec8.JGD_Kocay/Trec9.JGD_Margulies/cat_ears_2_1.JGD_Margulies/cat_ears_2_4.JGD_Margulies/cat_ears_3_1.JGD_Margulies/cat_ears_4_1.JGD_Margulies/flower_4_1.JGD_Margulies/flower_5_1.JGD_Margulies/flower_7_1.JGD_Margulies/flower_8_1.JGD_Margulies/kneser_6_2_1.JGD_Margulies/wheel_3_1.JGD_Margulies/wheel_4_1.JGD_Margulies/wheel_5_1.JGD_Margulies/wheel_6_1.JGD_Margulies/wheel_7_1.JGD_Relat/rel3.JGD_Relat/rel4.JGD_Relat/rel5.JGD_Relat/rel6.JGD_Relat/relat3.JGD_Relat/relat4.JGD_Relat/relat5.JGD_Relat/relat6.JGD_SL6/D_10.JGD_SL6/D_11.JGD_SL6/D_5.JGD_SL6/D_6.JGD_SPG/08blocks.JGD_SPG/EX1.JGD_SPG/EX2.JGD_Trefethen/Trefethen_150.JGD_Trefethen/Trefethen_20.JGD_Trefethen/Trefethen_200.JGD_Trefethen/Trefethen_200b.JGD_Trefethen/Trefethen_20b.JGD_Trefethen/Trefethen_300.JGD_Trefethen/Trefethen_500.JGD_Trefethen/Trefethen_700.LPnetlib/lp_adlittle.LPnetlib/lp_afiro.LPnetlib/lp_agg.LPnetlib/lp_agg2.LPnetlib/lp_agg3.LPnetlib/lp_bandm.LPnetlib/lp_beaconfd.LPnetlib/lp_blend.LPnetlib/lp_bnl1.LPnetlib/lp_bore3d.LPnetlib/lp_brandy.LPnetlib/lp_capri.LPnetlib/lp_czprob.LPnetlib/lp_degen2.LPnetlib/lp_e226.LPnetlib/lp_etamacro.LPnetlib/lp_fffff800.LPnetlib/lp_finnis.LPnetlib/lp_fit1p.LPnetlib/lp_ganges.LPnetlib/lp_gfrd_pnc.LPnetlib/lp_grow15.LPnetlib/lp_grow7.LPnetlib/lp_israel.LPnetlib/lp_kb2.LPnetlib/lp_ken_07.LPnetlib/lp_lotfi.LPnetlib/lp_modszk1.LPnetlib/lp_perold.LPnetlib/lp_pilot4.LPnetlib/lp_qap8.LPnetlib/lp_recipe.LPnetlib/lp_sc105.LPnetlib/lp_sc205.LPnetlib/lp_sc50a.LPnetlib/lp_sc50b.LPnetlib/lp_scagr25.LPnetlib/lp_scagr7.LPnetlib/lp_scfxm1.LPnetlib/lp_scfxm2.LPnetlib/lp_scfxm3.LPnetlib/lp_scorpion.LPnetlib/lp_scrs8.LPnetlib/lp_scsd1.LPnetlib/lp_scsd6.LPnetlib/lp_sctap1.LPnetlib/lp_sctap2.LPnetlib/lp_sctap3.LPnetlib/lp_share1b.LPnetlib/lp_share2b.LPnetlib/lp_shell.LPnetlib/lp_ship04l.LPnetlib/lp_ship04s.LPnetlib/lp_ship08s.LPnetlib/lp_ship12s.LPnetlib/lp_sierra.LPnetlib/lp_stair.LPnetlib/lp_standata.LPnetlib/lp_standgub.LPnetlib/lp_standmps.LPnetlib/lp_stocfor1.LPnetlib/lp_tuff.LPnetlib/lp_vtp_base.LPnetlib/lpi_bgdbg1.LPnetlib/lpi_bgetam.LPnetlib/lpi_bgprtr.LPnetlib/lpi_box1.LPnetlib/lpi_chemcom.LPnetlib/lpi_cplex2.LPnetlib/lpi_ex72a.LPnetlib/lpi_ex73a.LPnetlib/lpi_forest6.LPnetlib/lpi_galenet.LPnetlib/lpi_itest2.LPnetlib/lpi_itest6.LPnetlib/lpi_klein1.LPnetlib/lpi_klein2.LPnetlib/lpi_mondou2.LPnetlib/lpi_pang.LPnetlib/lpi_pilot4i.LPnetlib/lpi_qual.LPnetlib/lpi_reactor.LPnetlib/lpi_refinery.LPnetlib/lpi_vol1.LPnetlib/lpi_woodinfe.MathWorks/Harvard500.MathWorks/Pd_rhs.MathWorks/pivtol.MathWorks/QRpivot.Meszaros/cep1.Meszaros/cr42.Meszaros/farm.Meszaros/gams10a.Meszaros/gams10am.Meszaros/gams30a.Meszaros/gams30am.Meszaros/gams60am.Meszaros/gas11.Meszaros/iiasa.Meszaros/iprob.Meszaros/kleemin.Meszaros/l9.Meszaros/model1.Meszaros/model2.Meszaros/nemsafm.Meszaros/nemscem.Meszaros/nsic.Meszaros/p0033.Meszaros/p0040.Meszaros/p0201.Meszaros/p0282.Meszaros/p0291.Meszaros/p0548.Meszaros/p2756.Meszaros/problem.Meszaros/qiulp.Meszaros/refine.Meszaros/rosen7.Meszaros/scagr7-2c.Meszaros/scrs8-2b.Meszaros/scrs8-2c.Meszaros/small.Meszaros/zed.Morandini/robot.Morandini/rotor1.Muite/Chebyshev1.NYPA/Maragal_1.NYPA/Maragal_2.Oberwolfach/LF10.Oberwolfach/LFAT5.Pajek/Cities.Pajek/divorce.Pajek/EPA.Pajek/Erdos02.Pajek/Erdos971.Pajek/Erdos972.Pajek/Erdos981.Pajek/Erdos982.Pajek/Erdos991.Pajek/Erdos992.Pajek/EVA.Pajek/football.Pajek/GD00_a.Pajek/GD00_c.Pajek/GD01_a.Pajek/GD01_A.Pajek/GD01_b.Pajek/GD01_c.Pajek/GD02_a.Pajek/GD02_b.Pajek/GD06_Java.Pajek/GD06_theory.Pajek/GD95_a.Pajek/GD95_b.Pajek/GD95_c.Pajek/GD96_a.Pajek/GD96_b.Pajek/GD96_c.Pajek/GD96_d.Pajek/GD97_a.Pajek/GD97_b.Pajek/GD97_c.Pajek/GD98_a.Pajek/GD98_b.Pajek/GD98_c.Pajek/GD99_b.Pajek/GD99_c.Pajek/GlossGT.Pajek/Journals.Pajek/Kohonen.Pajek/Ragusa16.Pajek/Ragusa18.Pajek/Roget.Pajek/Sandi_authors.Pajek/Sandi_sandi.Pajek/SciMet.Pajek/SmaGri.Pajek/SmallW.Pajek/Stranke94.Pajek/Tina_AskCal.Pajek/Tina_AskCog.Pajek/Tina_DisCal.Pajek/Tina_DisCog.Pajek/USAir97.Pajek/USpowerGrid.Pajek/WorldCities.Pajek/yeast.Pothen/mesh1e1.Pothen/mesh1em1.Pothen/mesh1em6.Pothen/mesh2e1.Pothen/mesh2em5.Pothen/mesh3e1.Pothen/mesh3em5.Pothen/sphere2.Pothen/sphere3.Qaplib/lp_nug05.Qaplib/lp_nug06.Qaplib/lp_nug07.Qaplib/lp_nug08.Rajat/rajat02.Rajat/rajat05.Rajat/rajat11.Rajat/rajat14.Rajat/rajat19.Sandia/oscil_dcop_01.Sandia/oscil_dcop_02.Sandia/oscil_dcop_03.Sandia/oscil_dcop_04.Sandia/oscil_dcop_05.Sandia/oscil_dcop_06.Sandia/oscil_dcop_07.Sandia/oscil_dcop_08.Sandia/oscil_dcop_09.Sandia/oscil_dcop_10.Sandia/oscil_dcop_11.Sandia/oscil_dcop_12.Sandia/oscil_dcop_13.Sandia/oscil_dcop_14.Sandia/oscil_dcop_15.Sandia/oscil_dcop_16.Sandia/oscil_dcop_17.Sandia/oscil_dcop_18.Sandia/oscil_dcop_19.Sandia/oscil_dcop_20.Sandia/oscil_dcop_21.Sandia/oscil_dcop_22.Sandia/oscil_dcop_23.Sandia/oscil_dcop_24.Sandia/oscil_dcop_25.Sandia/oscil_dcop_26.Sandia/oscil_dcop_27.Sandia/oscil_dcop_28.Sandia/oscil_dcop_29.Sandia/oscil_dcop_30.Sandia/oscil_dcop_31.Sandia/oscil_dcop_32.Sandia/oscil_dcop_33.Sandia/oscil_dcop_34.Sandia/oscil_dcop_35.Sandia/oscil_dcop_36.Sandia/oscil_dcop_37.Sandia/oscil_dcop_38.Sandia/oscil_dcop_39.Sandia/oscil_dcop_40.Sandia/oscil_dcop_41.Sandia/oscil_dcop_42.Sandia/oscil_dcop_43.Sandia/oscil_dcop_44.Sandia/oscil_dcop_45.Sandia/oscil_dcop_46.Sandia/oscil_dcop_47.Sandia/oscil_dcop_48.Sandia/oscil_dcop_49.Sandia/oscil_dcop_50.Sandia/oscil_dcop_51.Sandia/oscil_dcop_52.Sandia/oscil_dcop_53.Sandia/oscil_dcop_54.Sandia/oscil_dcop_55.Sandia/oscil_dcop_56.Sandia/oscil_dcop_57.Sandia/oscil_trans_01.TOKAMAK/utm300.vanHeukelum/cage3.vanHeukelum/cage4.vanHeukelum/cage5.vanHeukelum/cage6.vanHeukelum/cage7.YZhou/circuit204`.split(`.`)}var Vu=o(((e,t)=>{t.exports={nodes:[{name:`Myriel`,group:1},{name:`Napoleon`,group:1},{name:`Mlle.Baptistine`,group:1},{name:`Mme.Magloire`,group:1},{name:`CountessdeLo`,group:1},{name:`Geborand`,group:1},{name:`Champtercier`,group:1},{name:`Cravatte`,group:1},{name:`Count`,group:1},{name:`OldMan`,group:1},{name:`Labarre`,group:2},{name:`Valjean`,group:2},{name:`Marguerite`,group:3},{name:`Mme.deR`,group:2},{name:`Isabeau`,group:2},{name:`Gervais`,group:2},{name:`Tholomyes`,group:3},{name:`Listolier`,group:3},{name:`Fameuil`,group:3},{name:`Blacheville`,group:3},{name:`Favourite`,group:3},{name:`Dahlia`,group:3},{name:`Zephine`,group:3},{name:`Fantine`,group:3},{name:`Mme.Thenardier`,group:4},{name:`Thenardier`,group:4},{name:`Cosette`,group:5},{name:`Javert`,group:4},{name:`Fauchelevent`,group:0},{name:`Bamatabois`,group:2},{name:`Perpetue`,group:3},{name:`Simplice`,group:2},{name:`Scaufflaire`,group:2},{name:`Woman1`,group:2},{name:`Judge`,group:2},{name:`Champmathieu`,group:2},{name:`Brevet`,group:2},{name:`Chenildieu`,group:2},{name:`Cochepaille`,group:2},{name:`Pontmercy`,group:4},{name:`Boulatruelle`,group:6},{name:`Eponine`,group:4},{name:`Anzelma`,group:4},{name:`Woman2`,group:5},{name:`MotherInnocent`,group:0},{name:`Gribier`,group:0},{name:`Jondrette`,group:7},{name:`Mme.Burgon`,group:7},{name:`Gavroche`,group:8},{name:`Gillenormand`,group:5},{name:`Magnon`,group:5},{name:`Mlle.Gillenormand`,group:5},{name:`Mme.Pontmercy`,group:5},{name:`Mlle.Vaubois`,group:5},{name:`Lt.Gillenormand`,group:5},{name:`Marius`,group:8},{name:`BaronessT`,group:5},{name:`Mabeuf`,group:8},{name:`Enjolras`,group:8},{name:`Combeferre`,group:8},{name:`Prouvaire`,group:8},{name:`Feuilly`,group:8},{name:`Courfeyrac`,group:8},{name:`Bahorel`,group:8},{name:`Bossuet`,group:8},{name:`Joly`,group:8},{name:`Grantaire`,group:8},{name:`MotherPlutarch`,group:9},{name:`Gueulemer`,group:4},{name:`Babet`,group:4},{name:`Claquesous`,group:4},{name:`Montparnasse`,group:4},{name:`Toussaint`,group:5},{name:`Child1`,group:10},{name:`Child2`,group:10},{name:`Brujon`,group:4},{name:`Mme.Hucheloup`,group:8}],links:[{source:1,target:0,value:1},{source:2,target:0,value:8},{source:3,target:0,value:10},{source:3,target:2,value:6},{source:4,target:0,value:1},{source:5,target:0,value:1},{source:6,target:0,value:1},{source:7,target:0,value:1},{source:8,target:0,value:2},{source:9,target:0,value:1},{source:11,target:10,value:1},{source:11,target:3,value:3},{source:11,target:2,value:3},{source:11,target:0,value:5},{source:12,target:11,value:1},{source:13,target:11,value:1},{source:14,target:11,value:1},{source:15,target:11,value:1},{source:17,target:16,value:4},{source:18,target:16,value:4},{source:18,target:17,value:4},{source:19,target:16,value:4},{source:19,target:17,value:4},{source:19,target:18,value:4},{source:20,target:16,value:3},{source:20,target:17,value:3},{source:20,target:18,value:3},{source:20,target:19,value:4},{source:21,target:16,value:3},{source:21,target:17,value:3},{source:21,target:18,value:3},{source:21,target:19,value:3},{source:21,target:20,value:5},{source:22,target:16,value:3},{source:22,target:17,value:3},{source:22,target:18,value:3},{source:22,target:19,value:3},{source:22,target:20,value:4},{source:22,target:21,value:4},{source:23,target:16,value:3},{source:23,target:17,value:3},{source:23,target:18,value:3},{source:23,target:19,value:3},{source:23,target:20,value:4},{source:23,target:21,value:4},{source:23,target:22,value:4},{source:23,target:12,value:2},{source:23,target:11,value:9},{source:24,target:23,value:2},{source:24,target:11,value:7},{source:25,target:24,value:13},{source:25,target:23,value:1},{source:25,target:11,value:12},{source:26,target:24,value:4},{source:26,target:11,value:31},{source:26,target:16,value:1},{source:26,target:25,value:1},{source:27,target:11,value:17},{source:27,target:23,value:5},{source:27,target:25,value:5},{source:27,target:24,value:1},{source:27,target:26,value:1},{source:28,target:11,value:8},{source:28,target:27,value:1},{source:29,target:23,value:1},{source:29,target:27,value:1},{source:29,target:11,value:2},{source:30,target:23,value:1},{source:31,target:30,value:2},{source:31,target:11,value:3},{source:31,target:23,value:2},{source:31,target:27,value:1},{source:32,target:11,value:1},{source:33,target:11,value:2},{source:33,target:27,value:1},{source:34,target:11,value:3},{source:34,target:29,value:2},{source:35,target:11,value:3},{source:35,target:34,value:3},{source:35,target:29,value:2},{source:36,target:34,value:2},{source:36,target:35,value:2},{source:36,target:11,value:2},{source:36,target:29,value:1},{source:37,target:34,value:2},{source:37,target:35,value:2},{source:37,target:36,value:2},{source:37,target:11,value:2},{source:37,target:29,value:1},{source:38,target:34,value:2},{source:38,target:35,value:2},{source:38,target:36,value:2},{source:38,target:37,value:2},{source:38,target:11,value:2},{source:38,target:29,value:1},{source:39,target:25,value:1},{source:40,target:25,value:1},{source:41,target:24,value:2},{source:41,target:25,value:3},{source:42,target:41,value:2},{source:42,target:25,value:2},{source:42,target:24,value:1},{source:43,target:11,value:3},{source:43,target:26,value:1},{source:43,target:27,value:1},{source:44,target:28,value:3},{source:44,target:11,value:1},{source:45,target:28,value:2},{source:47,target:46,value:1},{source:48,target:47,value:2},{source:48,target:25,value:1},{source:48,target:27,value:1},{source:48,target:11,value:1},{source:49,target:26,value:3},{source:49,target:11,value:2},{source:50,target:49,value:1},{source:50,target:24,value:1},{source:51,target:49,value:9},{source:51,target:26,value:2},{source:51,target:11,value:2},{source:52,target:51,value:1},{source:52,target:39,value:1},{source:53,target:51,value:1},{source:54,target:51,value:2},{source:54,target:49,value:1},{source:54,target:26,value:1},{source:55,target:51,value:6},{source:55,target:49,value:12},{source:55,target:39,value:1},{source:55,target:54,value:1},{source:55,target:26,value:21},{source:55,target:11,value:19},{source:55,target:16,value:1},{source:55,target:25,value:2},{source:55,target:41,value:5},{source:55,target:48,value:4},{source:56,target:49,value:1},{source:56,target:55,value:1},{source:57,target:55,value:1},{source:57,target:41,value:1},{source:57,target:48,value:1},{source:58,target:55,value:7},{source:58,target:48,value:7},{source:58,target:27,value:6},{source:58,target:57,value:1},{source:58,target:11,value:4},{source:59,target:58,value:15},{source:59,target:55,value:5},{source:59,target:48,value:6},{source:59,target:57,value:2},{source:60,target:48,value:1},{source:60,target:58,value:4},{source:60,target:59,value:2},{source:61,target:48,value:2},{source:61,target:58,value:6},{source:61,target:60,value:2},{source:61,target:59,value:5},{source:61,target:57,value:1},{source:61,target:55,value:1},{source:62,target:55,value:9},{source:62,target:58,value:17},{source:62,target:59,value:13},{source:62,target:48,value:7},{source:62,target:57,value:2},{source:62,target:41,value:1},{source:62,target:61,value:6},{source:62,target:60,value:3},{source:63,target:59,value:5},{source:63,target:48,value:5},{source:63,target:62,value:6},{source:63,target:57,value:2},{source:63,target:58,value:4},{source:63,target:61,value:3},{source:63,target:60,value:2},{source:63,target:55,value:1},{source:64,target:55,value:5},{source:64,target:62,value:12},{source:64,target:48,value:5},{source:64,target:63,value:4},{source:64,target:58,value:10},{source:64,target:61,value:6},{source:64,target:60,value:2},{source:64,target:59,value:9},{source:64,target:57,value:1},{source:64,target:11,value:1},{source:65,target:63,value:5},{source:65,target:64,value:7},{source:65,target:48,value:3},{source:65,target:62,value:5},{source:65,target:58,value:5},{source:65,target:61,value:5},{source:65,target:60,value:2},{source:65,target:59,value:5},{source:65,target:57,value:1},{source:65,target:55,value:2},{source:66,target:64,value:3},{source:66,target:58,value:3},{source:66,target:59,value:1},{source:66,target:62,value:2},{source:66,target:65,value:2},{source:66,target:48,value:1},{source:66,target:63,value:1},{source:66,target:61,value:1},{source:66,target:60,value:1},{source:67,target:57,value:3},{source:68,target:25,value:5},{source:68,target:11,value:1},{source:68,target:24,value:1},{source:68,target:27,value:1},{source:68,target:48,value:1},{source:68,target:41,value:1},{source:69,target:25,value:6},{source:69,target:68,value:6},{source:69,target:11,value:1},{source:69,target:24,value:1},{source:69,target:27,value:2},{source:69,target:48,value:1},{source:69,target:41,value:1},{source:70,target:25,value:4},{source:70,target:69,value:4},{source:70,target:68,value:4},{source:70,target:11,value:1},{source:70,target:24,value:1},{source:70,target:27,value:1},{source:70,target:41,value:1},{source:70,target:58,value:1},{source:71,target:27,value:1},{source:71,target:69,value:2},{source:71,target:68,value:2},{source:71,target:70,value:2},{source:71,target:11,value:1},{source:71,target:48,value:1},{source:71,target:41,value:1},{source:71,target:25,value:1},{source:72,target:26,value:2},{source:72,target:27,value:1},{source:72,target:11,value:1},{source:73,target:48,value:2},{source:74,target:48,value:2},{source:74,target:73,value:3},{source:75,target:69,value:3},{source:75,target:68,value:3},{source:75,target:25,value:3},{source:75,target:48,value:1},{source:75,target:41,value:1},{source:75,target:70,value:1},{source:75,target:71,value:1},{source:76,target:64,value:1},{source:76,target:65,value:1},{source:76,target:66,value:1},{source:76,target:63,value:1},{source:76,target:62,value:1},{source:76,target:48,value:1},{source:76,target:58,value:1}]}})),Hu=o(((e,t)=>{function n(e){i(e);let t=r(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e}function r(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function i(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}t.exports=n})),Uu=o(((e,t)=>{t.exports=r;var n=Hu();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=F,m=F,h=F,g=F,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:L,forEachLinkedNode:N,forEachLink:M,beginUpdate:h,endUpdate:g,clear:ee,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=I,_.endUpdate=g=ne,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function ee(){h(),L(function(e){C(e.id)}),g()}function M(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function N(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?te(r.links,e,t):P(r.links,e,t)}function P(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function te(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function F(){}function I(){u+=1}function ne(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function L(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),Wu=o(((e,t)=>{var n=Vu(),r=Uu();t.exports=i(),t.exports.create=i;function i(){for(var e=r(),t=0;t<n.nodes.length;++t)e.addNode(t,n.nodes[t]);for(t=0;t<n.links.length;++t){var i=n.links[t];e.addLink(i.source,i.target,i.value)}return e}})),Gu=o(((e,t,n)=>{(function(n,r){typeof e==`object`&&typeof t<`u`?t.exports=r():typeof define==`function`&&define.amd?define(r):(n=typeof globalThis<`u`?globalThis:n||self,n.createGraph=r())})(n,(function(){function e(e){n(e);let r=t(e);return e.on=r.on,e.off=r.off,e.fire=r.fire,e}function t(e){let t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);let a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(typeof n>`u`)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else{let e=t[n];for(let t=0;t<e.length;++t)e[t].callback===r&&e.splice(t,1)}}return e},fire:function(n){let r=t[n];if(!r)return e;let i;arguments.length>1&&(i=Array.prototype.slice.call(arguments,1));for(let e=0;e<r.length;++e){let t=r[e];t.callback.apply(t.ctx,i)}return e}}}function n(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);let t=[`on`,`fire`,`off`];for(let n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}function r(t){if(t||={},`uniqueLinkId`in t&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),t.multigraph=t.uniqueLinkId),t.multigraph===void 0&&(t.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var n=new Map,r=new Map,c={},l=0,u=t.multigraph?T:w,d=[],f=I,p=I,m=I,h=I,g={version:20,addNode:b,addLink:C,removeLink:k,removeNode:S,getNode:x,getNodeCount:E,getLinkCount:D,getEdgeCount:D,getLinksCount:D,getNodesCount:E,getLinks:O,forEachNode:R,forEachLinkedNode:P,forEachLink:N,beginUpdate:m,endUpdate:h,clear:M,hasLink:j,hasNode:x,getLink:j,getLinkById:ee};return e(g),_(),g;function _(){var e=g.on;g.on=t;function t(){return g.beginUpdate=m=ne,g.endUpdate=h=L,f=v,p=y,g.on=e,e.apply(g,arguments)}}function v(e,t){d.push({link:e,changeType:t})}function y(e,t){d.push({node:e,changeType:t})}function b(e,t){if(e===void 0)throw Error(`Invalid node identifier`);m();var r=x(e);return r?(r.data=t,p(r,`update`)):(r=new i(e,t),p(r,`add`)),n.set(e,r),h(),r}function x(e){return n.get(e)}function S(e){var t=x(e);if(!t)return!1;m();var r=t.links;return r&&(r.forEach(A),t.links=null),n.delete(e),p(t,`remove`),h(),!0}function C(e,t,n){m();var i=x(e)||b(e),o=x(t)||b(t),s=u(e,t,n),c=r.has(s.id);return r.set(s.id,s),a(i,s),e!==t&&a(o,s),f(s,c?`update`:`add`),h(),s}function w(e,t,n){var i=s(e,t),a=r.get(i);return a?(a.data=n,a):new o(e,t,n,i)}function T(e,t,n){var r=s(e,t),i=c.hasOwnProperty(r);if(i||j(e,t)){i||(c[r]=0);var a=`@`+ ++c[r];r=s(e+a,t+a)}return new o(e,t,n,r)}function E(){return n.size}function D(){return r.size}function O(e){var t=x(e);return t?t.links:null}function k(e,t){return t!==void 0&&(e=j(e,t)),A(e)}function A(e){if(!e||!r.get(e.id))return!1;m(),r.delete(e.id);var t=x(e.fromId),n=x(e.toId);return t&&t.links.delete(e),n&&n.links.delete(e),f(e,`remove`),h(),!0}function j(e,t){if(e!==void 0&&t!==void 0)return r.get(s(e,t))}function ee(e){if(e!==void 0)return r.get(e)}function M(){m(),R(function(e){S(e.id)}),h()}function N(e){if(typeof e==`function`)for(var t=r.values(),n=t.next();!n.done;){if(e(n.value))return!0;n=t.next()}}function P(e,t,n){var r=x(e);if(r&&r.links&&typeof t==`function`)return n?F(r.links,e,t):te(r.links,e,t)}function te(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value,c=s.fromId===t?s.toId:s.fromId;if(i=r(n.get(c),s),i)return!0;o=a.next()}}function F(e,t,r){for(var i,a=e.values(),o=a.next();!o.done;){var s=o.value;if(s.fromId===t&&(i=r(n.get(s.toId),s),i))return!0;o=a.next()}}function I(){}function ne(){l+=1}function L(){--l,l===0&&d.length>0&&(g.fire(`changed`,d),d.length=0)}function R(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var t=n.values(),r=t.next();!r.done;){if(e(r.value))return!0;r=t.next()}}}function i(e,t){this.id=e,this.links=null,this.data=t}function a(e,t){e.links?e.links.add(t):e.links=new Set([t])}function o(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function s(e,t){return e.toString()+`👉 `+t.toString()}return r}))})),Ku=o(((e,t)=>{var n=Gu(),r=Wu().create;t.exports=i(n),t.exports.factory=i;function i(e){return{ladder:t,complete:i,completeBipartite:a,balancedBinTree:l,balancedBinaryTree:l,binaryTree:l,binTree:l,path:o,circularLadder:n,grid:s,grid3:c,noLinks:u,wattsStrogatz:f,cliqueCircle:d,miserables:r};function t(t){if(!t||t<0)throw Error(`Invalid number of nodes`);for(var n=e(),r=0;r<t-1;++r)n.addLink(r,r+1),n.addLink(t+r,t+r+1),n.addLink(r,t+r);return n.addLink(t-1,2*t-1),n}function n(e){if(!e||e<0)throw Error(`Invalid number of nodes`);var n=t(e);return n.addLink(0,e-1),n.addLink(e,2*e-1),n}function i(t){if(!t||t<1)throw Error(`At least two nodes are expected for complete graph`);for(var n=e(),r=0,i;r<t;++r)for(i=r+1;i<t;++i)r!==i&&n.addLink(r,i);return n}function a(t,n){if(!t||!n||t<0||n<0)throw Error(`Graph dimensions are invalid. Number of nodes in each partition should be greater than 0`);for(var r=e(),i=0,a;i<t;++i)for(a=t;a<t+n;++a)r.addLink(i,a);return r}function o(t){if(!t||t<0)throw Error(`Invalid number of nodes`);var n=e(),r;for(n.addNode(0),r=1;r<t;++r)n.addLink(r-1,r);return n}function s(t,n){if(t<1||n<1)throw Error(`Invalid number of nodes in grid graph`);var r=e(),i,a;if(t===1&&n===1)return r.addNode(0),r;for(i=0;i<t;++i)for(a=0;a<n;++a){var o=i+a*t;i>0&&r.addLink(o,i-1+a*t),a>0&&r.addLink(o,i+(a-1)*t)}return r}function c(t,n,r){if(t<1||n<1||r<1)throw Error(`Invalid number of nodes in grid3 graph`);var i=e(),a,o,s;if(t===1&&n===1&&r===1)return i.addNode(0),i;for(s=0;s<r;++s)for(a=0;a<t;++a)for(o=0;o<n;++o){var c=s*t*n,l=a+o*t+c;a>0&&i.addLink(l,a-1+o*t+c),o>0&&i.addLink(l,a+(o-1)*t+c),s>0&&i.addLink(l,a+o*t+(s-1)*t*n)}return i}function l(t){if(t===void 0||t<0)throw Error(`Invalid number of levels in balanced tree`);var n=e(),r=2**t,i;for(t===0&&n.addNode(1),i=1;i<r;++i){var a=i,o=a*2,s=a*2+1;n.addLink(a,o),n.addLink(a,s)}return n}function u(t){if(t<0)throw Error(`Number of nodes should be >= 0`);for(var n=e(),r=0;r<t;++r)n.addNode(r);return n}function d(t,n){if(t<1)throw Error(`Invalid number of cliqueCount in cliqueCircle`);if(n<1)throw Error(`Invalid number of cliqueSize in cliqueCircle`);for(var r=e(),i=0;i<t;++i)a(n,i*n),i>0&&r.addLink(i*n,i*n-1);return r.addLink(0,r.getNodesCount()-1),r;function a(e,t){for(var n=0;n<e;++n)r.addNode(n+t);for(var n=0;n<e;++n)for(var i=n+1;i<e;++i)r.addLink(n+t,i+t)}}function f(t,n,r,i){if(n>=t)throw Error("Choose smaller `k`. It cannot be larger than number of nodes `n`");for(var a=Sl().random(i||42),o=e(),s=0,c;s<t;++s)o.addNode(s);for(var l=Math.floor(n/2+1),u=1;u<l;++u)for(s=0;s<t;++s)c=(u+s)%t,o.addLink(s,c);for(u=1;u<l;++u)for(s=0;s<t;++s)if(a.nextDouble()<r){var d=s;c=(u+s)%t;var f=a.next(t),p=f===d||o.hasLink(d,f);if(p&&o.getLinks(d).length===t-1)continue;for(;p;)f=a.next(t),p=f===d||o.hasLink(d,f);var m=o.hasLink(d,c);o.removeLink(m),o.addLink(d,f)}return o}}})),qu=c(Wu(),1),Ju=c(Ku(),1),Yu=$u(),Xu={"Grid 100x100 (10k)":()=>Ju.default.grid(100,100),"Binary tree (8k)":()=>Ju.default.balancedBinTree(13),"Watts-Strogatz (10k)":()=>Ju.default.wattsStrogatz(1e4,6,.05),"Barabasi-Albert (20k)":()=>ed(2e4,2),"Barabasi-Albert (100k)":()=>ed(1e5,2)};function Zu(e){if(e===`Miserables`)return Promise.resolve(qu.default);if(e===`Binary`)return Promise.resolve(Ju.default.balancedBinTree(10));if(Xu[e])return Promise.resolve(Xu[e]());let t=Yu.get(e);return t?Promise.resolve(Qu(t.links,t.recordsPerEdge)):fetch(`https://s3.amazonaws.com/yasiv_uf/out/${e}/index.js`,{mode:`cors`}).then(e=>e.json()).then(t=>(Yu.put(e,t),Qu(t.links,t.recordsPerEdge)))}function Qu(e,t){let n=Ul();for(var r=0;r<e.length-1;r+=t)n.addLink(e[r],e[r+1]);return n}function $u(){var e=`localStorage`in window;return{get:function(t){if(!e)return null;var n=JSON.parse(window.localStorage.getItem(t));return!n||n.recordsPerEdge===void 0?null:n},put:function(t,n){if(!e)return!1;try{window.localStorage.setItem(t,JSON.stringify(n))}catch{window.localStorage.clear()}}}}function ed(e,t){let n=42,r=()=>(n=n*1664525+1013904223>>>0,n/4294967296),i=Ul(),a=[];for(let e=0;e<=t;e++)for(let t=0;t<e;t++)i.addLink(e,t),a.push(e,t);for(let n=t+1;n<e;n++){let e=new Set;for(;e.size<t;)e.add(a[Math.floor(r()*a.length)]);e.forEach(e=>{i.addLink(n,e),a.push(n,e)})}return i}var td=o(((e,t)=>{t.exports=function(e){r(e);var t=n(e);return e.on=t.on,e.off=t.off,e.fire=t.fire,e};function n(e){var t=Object.create(null);return{on:function(n,r,i){if(typeof r!=`function`)throw Error(`callback is expected to be a function`);var a=t[n];return a||=t[n]=[],a.push({callback:r,ctx:i}),e},off:function(n,r){if(n===void 0)return t=Object.create(null),e;if(t[n]){if(typeof r!=`function`)delete t[n];else for(var i=t[n],a=0;a<i.length;++a)i[a].callback===r&&i.splice(a,1)}return e},fire:function(n){var r=t[n];if(!r)return e;var i;arguments.length>1&&(i=Array.prototype.splice.call(arguments,1));for(var a=0;a<r.length;++a){var o=r[a];o.callback.apply(o.ctx,i)}return e}}}function r(e){if(!e)throw Error(`Eventify cannot use falsy object as events subject`);for(var t=[`on`,`fire`,`off`],n=0;n<t.length;++n)if(e.hasOwnProperty(t[n]))throw Error(`Subject cannot be eventified, since it already has property '`+t[n]+`'`)}})),nd=o(((e,t)=>{t.exports=n;function n(e){var t=[],n=e;return{dispose:a,onChanged:o,set:i,get:r};function r(){return n}function i(e){n=e,setTimeout(function(){s(e)},0)}function a(){t=[]}function o(e){if(typeof e!=`function`)throw Error(`changeCallback should be a function`);t.push(e)}function s(e){t.forEach(function(t){t(e)})}}})),rd=o(((e,t)=>{t.exports={parse:r,stringify:n};function n(e){return e?Object.keys(e).map(t).join(`&`):``;function t(t){var n=e[t],r=a(t);return n!==void 0&&(r+=`=`+i(n)),r}}function r(e){var t=Object.create(null);return e&&e.split(`&`).forEach(n),t;function n(e){if(e){var n=e.split(`=`);t[decodeURIComponent(n[0])]=s(n[1])}}}function i(e){return e instanceof Date&&(e=e.toISOString()),a(e)}function a(e){return encodeURIComponent(e).replace(/[()]/g,o)}function o(e){return e===`)`?`%29`:e===`(`?`%28`:e}function s(e){return e=decodeURIComponent(e),e===``?e:isNaN(e)?c(e)?e===`true`:l(e)?new Date(e):e:parseFloat(e)}function c(e){return e===`true`||e===`false`}function l(e){return e&&e.match(/(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/)}})),id=o(((e,t)=>{t.exports=i;var n=nd(),r=rd();function i(e,t){if(typeof window>`u`)return n(e);var i=[],a=t&&t.useSearch,o=a?`?`:`#?`;return t.rewriteHashToSearch&&c(),s(),{onChanged:u,dispose:d,set:l,get:m,rewriteHashToSearch:c};function s(){var t=m(),n=!1;typeof e==`object`&&e&&Object.keys(e).forEach(function(r){r in t||(t[r]=e[r],n=!0)}),n&&l(t)}function c(){var e=Object.create(null),t=window.location.search;t&&(e=Object.assign(e,r.parse(t.substr(1))));var n=window.location.hash;n&&(e=Object.assign(e,r.parse(n.substr(2)))),l(e)}function l(e){var t=o+r.stringify(e);a&&window.location.hash&&(t+=window.location.hash),window.history?window.history.replaceState(void 0,void 0,t):window.location.replace(t)}function u(e){if(typeof e!=`function`)throw Error(`changeCallback needs to be a function`);i.length===0&&window.addEventListener(`hashchange`,f,!1),i.push(e)}function d(){i.length!==0&&(i=[],window.removeEventListener(`hashchange`,f,!1))}function f(){p(m())}function p(e){for(var t=0;t<i.length;++t){var n=i[t];n(e)}}function m(){var e=((a?window.location.search:window.location.hash)||o).substr(o.length);return r.parse(e)}}})),ad=c(o(((e,t)=>{t.exports=a;var n=td(),r=id();a.instance=o;var i;function a(e,t){t||={};var i=t.history||r(e,t);s(i),i.onChanged(g);var a=i.get()||Object.create(null),o={get:p,set:m,unset:h,setIfEmpty:_,dispose:f,onChange:l,offChange:u,getHistoryObject:d},c=n({});return o;function l(e,t){c.on(`change`,e,t)}function u(e,t){c.off(`change`,e,t)}function d(){return i}function f(){i.dispose(),c.off()}function p(e){return e===void 0?a:a[e]}function m(e,t){var n=typeof e;return n===`object`?Object.keys(e).forEach(function(t){a[t]=e[t]}):n===`string`&&(a[e]=t),i.set(a),o}function h(e){if(e in a)return delete a[e],i.set(a),o}function g(e){a=e,c.fire(`change`,a)}function _(e,t){if(typeof e==`object`&&Object.keys(e).forEach(function(t){t in a||(a[t]=e[t])}),!(e in a))return a[e]=t,i.set(a),o}}function o(e,t){return i?e&&i.setIfEmpty(e):i=a(e,t),i}function s(e){if(!e)throw Error(`history is required`);if(typeof e.dispose!=`function`)throw Error(`dispose is required`);if(typeof e.onChanged!=`function`)throw Error(`onChanged is required`)}}))()),od=(e,t)=>{let n=e.__vccOpts||e;for(let[e,r]of t)n[e]=r;return n},sd={emits:[`show`],methods:{show(){this.$emit(`show`)}}};function cd(e,t,n,r,i,a){return Bi(),Gi(`a`,{onClick:t[0]||=jo((...e)=>a.show&&a.show(...e),[`prevent`]),class:`help-icon`,href:`#`,title:`Click for more details`},[...t[1]||=[X(`svg`,{version:`1.1`,xmlns:`http://www.w3.org/2000/svg`,"xmlns:xlink":`http://www.w3.org/1999/xlink`,width:`9`,height:`14`,viewBox:`0 0 9 14`,fill:`#267fcd`},[X(`path`,{d:`M5.5 9.812v1.875q0 0.125-0.094 0.219t-0.219 0.094h-1.875q-0.125 0-0.219-0.094t-0.094-0.219v-1.875q0-0.125 0.094-0.219t0.219-0.094h1.875q0.125 0 0.219 0.094t0.094 0.219zM7.969 5.125q0 0.422-0.121 0.789t-0.273 0.598-0.43 0.465-0.449 0.34-0.477 0.277q-0.32 0.18-0.535 0.508t-0.215 0.523q0 0.133-0.094 0.254t-0.219 0.121h-1.875q-0.117 0-0.199-0.145t-0.082-0.293v-0.352q0-0.648 0.508-1.223t1.117-0.848q0.461-0.211 0.656-0.438t0.195-0.594q0-0.328-0.363-0.578t-0.84-0.25q-0.508 0-0.844 0.227-0.273 0.195-0.836 0.898-0.102 0.125-0.242 0.125-0.094 0-0.195-0.062l-1.281-0.977q-0.102-0.078-0.121-0.195t0.043-0.219q1.25-2.078 3.625-2.078 0.625 0 1.258 0.242t1.141 0.648 0.828 0.996 0.32 1.238z`})],-1)]])}var ld=od(sd,[[`render`,cd]]),ud={components:{HelpIcon:ld},emits:[`update:modelValue`],props:{label:String,modelValue:Number,step:{default:`0.1`,type:String},disabled:Boolean,note:String},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){e!==parseFloat(this.inputValue)&&(this.inputValue=e)},inputValue(e){this.$emit(`update:modelValue`,parseFloat(e))}}},dd={class:`row`},fd={class:`col`},pd={class:`col`},md=[`step`,`disabled`],hd={key:0,class:`row note`},gd={key:1,class:`row help`};function _d(e,t,n,r,i,a){let o=pr(`help-icon`);return Bi(),Gi(`div`,{class:de([`block`,{inactive:n.disabled}])},[X(`div`,dd,[X(`div`,fd,xe(n.label),1),X(`div`,pd,[Dn(X(`input`,{type:`number`,step:n.step,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled,onFocus:t[1]||=(...e)=>a.selectAll&&a.selectAll(...e),autocomplete:`off`,autocorrect:`off`,autocapitalize:`off`,spellcheck:`false`},null,40,md),[[xo,i.inputValue]])]),Z(o,{onShow:t[2]||=e=>i.helpVisible=!i.helpVisible,class:de({open:i.helpVisible})},null,8,[`class`])]),n.note?(Bi(),Gi(`div`,hd,xe(n.note),1)):ea(``,!0),i.helpVisible?(Bi(),Gi(`div`,gd,[vr(e.$slots,`default`)])):ea(``,!0)],2)}var vd=od(ud,[[`render`,_d]]),yd={components:{HelpIcon:ld},emits:[`update:modelValue`],props:{label:String,modelValue:Boolean},methods:{selectAll(e){e.target.select()}},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{inputValue(e){this.$emit(`update:modelValue`,e)}}},bd={class:`block`},xd={class:`row`},Sd={class:`col`},Cd={class:`col`},wd={key:0,class:`row help`};function Td(e,t,n,r,i,a){let o=pr(`help-icon`);return Bi(),Gi(`div`,bd,[X(`div`,xd,[X(`div`,Sd,xe(n.label),1),X(`div`,Cd,[Dn(X(`input`,{type:`checkbox`,"onUpdate:modelValue":t[0]||=e=>i.inputValue=e},null,512),[[So,i.inputValue]])]),Z(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:de({open:i.helpVisible})},null,8,[`class`])]),i.helpVisible?(Bi(),Gi(`div`,wd,[vr(e.$slots,`default`)])):ea(``,!0)])}var Ed=od(yd,[[`render`,Td]]),Dd={components:{HelpIcon:ld},emits:[`update:modelValue`],props:{label:String,modelValue:String,disabled:Boolean,note:String,options:Array},data(){return{helpVisible:!1,inputValue:this.modelValue}},watch:{modelValue(e){this.inputValue=e},inputValue(e){this.$emit(`update:modelValue`,e)}}},Od={class:`row`},kd={class:`col`},Ad={class:`col`},jd=[`disabled`],Md=[`value`,`disabled`],Nd={key:0,class:`row note`},Pd={key:1,class:`row help`};function Fd(e,t,n,r,i,a){let o=pr(`help-icon`);return Bi(),Gi(`div`,{class:de([`block`,{inactive:n.disabled}])},[X(`div`,Od,[X(`div`,kd,xe(n.label),1),X(`div`,Ad,[Dn(X(`select`,{"onUpdate:modelValue":t[0]||=e=>i.inputValue=e,disabled:n.disabled},[(Bi(!0),Gi(Pi,null,_r(n.options,e=>(Bi(),Gi(`option`,{key:e.value,value:e.value,disabled:e.disabled},xe(e.label),9,Md))),128))],8,jd),[[wo,i.inputValue]])]),Z(o,{onShow:t[1]||=e=>i.helpVisible=!i.helpVisible,class:de({open:i.helpVisible})},null,8,[`class`])]),n.note?(Bi(),Gi(`div`,Nd,xe(n.note),1)):ea(``,!0),i.helpVisible?(Bi(),Gi(`div`,Pd,[vr(e.$slots,`default`)])):ea(``,!0)],2)}var Id=od(Dd,[[`render`,Fd]]),Ld={maxVelocity:4,integrator:`euler`,nbody:`quadtree`},Rd={maxVelocity:4,integrator:`fire`,nbody:`dualtree`},zd=(0,ad.default)({graph:`Miserables`,timeStep:.5,springLength:10,springCoefficient:.8,dragCoefficient:.9,dimensions:2,theta:.8,gravity:-12,maxVelocity:4,integrator:`euler`,nbody:`quadtree`,placement:`default`,backend:`cpu`,stepsPerFrame:1},{useSearch:!0}),Bd={name:`app`,components:{InputValue:vd,InputFlag:Ed,InputSelect:Id},computed:{onGpu(){return this.backend===`webgpu`},usesFire(){return this.layoutSettings.integrator===`fire`},integratorOptions(){return[{value:`euler`,label:`euler (default)`},{value:`fire`,label:`fire`}]},nbodyOptions(){return[{value:`quadtree`,label:`quad tree (default)`},{value:`dualtree`,label:`dual tree`}]},placementOptions(){return[{value:`default`,label:`library default`},{value:`pivot`,label:`pivot MDS (add-on)`}]},backendOptions(){return[{value:`cpu`,label:`CPU (library)`},{value:`webgpu`,label:`WebGPU, 2D (add-on)`,disabled:this.layoutSettings.dimensions!==2||this.gpuAvailable===!1}]}},methods:{useSpeedups(e){Object.assign(this.layoutSettings,e?Rd:Ld)},restart(){this.scene.restart()},formatMs(e){return e<1?e.toFixed(2):e<10?e.toFixed(1):Math.round(e)},updateStats(){this.scene&&(this.stats=this.scene.getStats(),this.stats.backend!==this.backend&&this.backend===`webgpu`&&(this.gpuMessage=`WebGPU device was lost, switched back to CPU.`,this.backend=this.stats.backend))},toggleLayoutRun(){this.isRunning=!this.isRunning,this.scene.runLayout(this.isRunning)},loadNewGraph(e){this.loading=!0,this.stats=null,this.isRunning=!1,Zu(e).then(e=>{bl.fire(`load-graph`,e,this.selectedLayout),this.loading=!1})},onGraphLoaded(){this.isRunning=!0}},watch:{layoutSettings:{deep:!0,handler(e){this.scene.updateLayoutSettings(e),zd.set(e)}},fixedViewBox(e){this.scene.setFixedViewBox(e)},"layoutSettings.dimensions"(e){e!==2&&this.backend===`webgpu`&&(this.gpuMessage=`WebGPU layout works only in 2D, switched to CPU.`,this.backend=`cpu`)},placement(e){zd.set(`placement`,e),this.scene.setPlacement(e)},stepsPerFrame(e){zd.set(`stepsPerFrame`,e),this.scene.setStepsPerFrame(e)},backend(e){this.scene.setBackend(e).then(t=>{t===e?e===`webgpu`&&(this.gpuMessage=``):(this.gpuMessage=this.layoutSettings.dimensions===2?`WebGPU is not available in this browser.`:`WebGPU layout works only in 2D.`,this.layoutSettings.dimensions===2&&(this.gpuAvailable=!1),this.backend=t),zd.set(`backend`,this.backend)})},selectedGraph(e){zd.set(`graph`,e),this.loadNewGraph(e)}},data(){let e=Bu();return{isRunning:!0,fixedViewBox:!1,selectedGraph:zd.get(`graph`),settingsOpen:window.innerWidth>500,loading:!1,layoutSettings:{timeStep:zd.get(`timeStep`),springLength:zd.get(`springLength`),springCoefficient:zd.get(`springCoefficient`),dragCoefficient:zd.get(`dragCoefficient`),dimensions:zd.get(`dimensions`),theta:zd.get(`theta`),gravity:zd.get(`gravity`),maxVelocity:zd.get(`maxVelocity`),integrator:zd.get(`integrator`),nbody:zd.get(`nbody`)},placement:zd.get(`placement`),backend:`cpu`,stepsPerFrame:zd.get(`stepsPerFrame`),gpuAvailable:typeof navigator<`u`&&!!navigator.gpu,gpuMessage:``,stats:null,graphs:e}},mounted(){let e=document.getElementById(`cnv`);this.scene=Ru(e,{...this.layoutSettings},{placement:this.placement,stepsPerFrame:this.stepsPerFrame}),this.loadNewGraph(this.selectedGraph),bl.on(`load-graph`,this.onGraphLoaded),zd.get(`backend`)===`webgpu`&&(this.backend=`webgpu`),this.statsTimer=setInterval(this.updateStats,250)},beforeUnmount(){clearInterval(this.statsTimer),this.scene&&this.scene.dispose()}},Vd={class:`toggle-settings`},Hd={key:0,class:`content`},Ud={class:`row`},Wd=[`disable`],Gd=[`value`],Kd={class:`section`},qd={key:0},Jd={key:1,class:`layout-box`},Yd={class:`buttons`},Xd={key:0,class:`stats`},Zd={key:0},Qd={key:1},$d={class:`number`};function ef(e,t,n,r,i,a){let o=pr(`input-value`),s=pr(`input-select`),c=pr(`input-flag`);return Bi(),Gi(`div`,null,[X(`h2`,null,[t[20]||=X(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout`},`ngraph.forcelayout`,-1),t[21]||=Q(` demo `,-1),X(`small`,Vd,[X(`a`,{href:`#`,onClick:t[0]||=jo(e=>i.settingsOpen=!i.settingsOpen,[`prevent`])},xe(i.settingsOpen?`hide settings`:`show settings`),1)])]),i.settingsOpen?(Bi(),Gi(`div`,Hd,[X(`div`,Ud,[t[22]||=X(`div`,{class:`label`},`Graph `,-1),Dn(X(`select`,{"onUpdate:modelValue":t[1]||=e=>i.selectedGraph=e,disable:i.loading,class:`value`},[(Bi(!0),Gi(Pi,null,_r(i.graphs,e=>(Bi(),Gi(`option`,{key:e,value:e},xe(e),9,Gd))),128))],8,Wd),[[wo,i.selectedGraph]])]),Z(o,{label:`Time step`,modelValue:i.layoutSettings.timeStep,"onUpdate:modelValue":t[2]||=e=>i.layoutSettings.timeStep=e},{default:En(()=>[...t[23]||=[Q(` This is integration time step value. The higher it is, the faster nodes will move, but setting it too high can result in lots of jitter and instability. `,-1)]]),_:1},8,[`modelValue`]),Z(o,{label:`Gravity`,modelValue:i.layoutSettings.gravity,"onUpdate:modelValue":t[3]||=e=>i.layoutSettings.gravity=e},{default:En(()=>[...t[24]||=[Q(` This coefficient defines how strongly each node repels each other. `,-1)]]),_:1},8,[`modelValue`]),Z(o,{label:`Ideal spring length`,modelValue:i.layoutSettings.springLength,"onUpdate:modelValue":t[4]||=e=>i.layoutSettings.springLength=e},{default:En(()=>[...t[25]||=[Q(` What is the ideal length of each spring? `,-1)]]),_:1},8,[`modelValue`]),Z(o,{label:`Spring coefficient`,modelValue:i.layoutSettings.springCoefficient,"onUpdate:modelValue":t[5]||=e=>i.layoutSettings.springCoefficient=e},{default:En(()=>[...t[26]||=[Q(` Higher values makes the spring force stronger, pushing edges closer to the ideal spring length. `,-1)]]),_:1},8,[`modelValue`]),Z(o,{label:`Drag coefficient`,modelValue:i.layoutSettings.dragCoefficient,"onUpdate:modelValue":t[6]||=e=>i.layoutSettings.dragCoefficient=e,disabled:a.usesFire,note:a.usesFire?`Not used by the fire integrator.`:``},{default:En(()=>[...t[27]||=[Q(` This coefficient introduces "resistance" from environment. When it is close to 0 the forces will have a lot of freedom, nothing will be stopping them, and that can result in a very unstable simulation. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),Z(o,{label:`Theta`,modelValue:i.layoutSettings.theta,"onUpdate:modelValue":t[7]||=e=>i.layoutSettings.theta=e,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU.`:``},{default:En(()=>[...t[28]||=[Q(` This coefficient influences when we apply long distance forces approximation. When this value is close to 0, the simulation compares forces between every single node (giving O(n^2), slow performance). Recommended value is 0.8. `,-1)]]),_:1},8,[`modelValue`,`disabled`,`note`]),Z(o,{label:`Dimensions`,modelValue:i.layoutSettings.dimensions,"onUpdate:modelValue":t[8]||=e=>i.layoutSettings.dimensions=e,step:`1`},{default:En(()=>[...t[29]||=[Q(` Defines number of dimensions of the space where layout is performed. For visualization purpose 2 or 3 dimensions are normally enough. Note: Memory consumptions grows exponentially with number of dimensions. `,-1)]]),_:1},8,[`modelValue`]),X(`div`,Kd,[t[31]||=Q(` Speed-ups `,-1),X(`small`,null,[X(`a`,{href:`#`,onClick:t[9]||=jo(e=>a.useSpeedups(!0),[`prevent`])},`turn all on`),t[30]||=Q(` | `,-1),X(`a`,{href:`#`,onClick:t[10]||=jo(e=>a.useSpeedups(!1),[`prevent`])},`library defaults`)])]),Z(o,{label:`Max velocity`,modelValue:i.layoutSettings.maxVelocity,"onUpdate:modelValue":t[11]||=e=>i.layoutSettings.maxVelocity=e},{default:En(()=>[...t[32]||=[Q(` Maximum distance a node can travel in one unit of time (each step moves a node by at most time step * max velocity). Library default is 4. Set it to 1 to get the layouts of versions before v3.4, which settle more slowly. `,-1)]]),_:1},8,[`modelValue`]),Z(s,{label:`Integrator`,modelValue:i.layoutSettings.integrator,"onUpdate:modelValue":t[12]||=e=>i.layoutSettings.integrator=e,options:a.integratorOptions},{default:En(()=>[...t[33]||=[Q(` How forces move nodes. `,-1),X(`b`,null,`euler`,-1),Q(` is the classic integration slowed down by drag. `,-1),X(`b`,null,`fire`,-1),Q(` (Fast Inertial Relaxation Engine) ignores drag: the whole system keeps its momentum while it moves "downhill", and stops dead when it overshoots. Usually reaches a good layout in fewer steps, especially on trees and grids. `,-1)]]),_:1},8,[`modelValue`,`options`]),Z(s,{label:`Repulsion`,modelValue:i.layoutSettings.nbody,"onUpdate:modelValue":t[13]||=e=>i.layoutSettings.nbody=e,options:a.nbodyOptions,disabled:a.onGpu,note:a.onGpu?`Not used on WebGPU: it has its own grid pyramid (exact up to 1,024 nodes).`:``},{default:En(()=>[...t[34]||=[Q(` How node repulsion is computed. `,-1),X(`b`,null,`quad tree`,-1),Q(` is Barnes-Hut: each node walks the tree. `,-1),X(`b`,null,`dual tree`,-1),Q(` lets pairs of tree cells interact with each other, which is 5-10x faster on large graphs with the same accuracy. Both use theta. `,-1)]]),_:1},8,[`modelValue`,`options`,`disabled`,`note`]),Z(o,{label:`Steps per frame`,modelValue:i.stepsPerFrame,"onUpdate:modelValue":t[14]||=e=>i.stepsPerFrame=e,step:`1`},{default:En(()=>[...t[35]||=[Q(` How many layout steps to run before each frame is rendered. Fast layouts can do many steps per frame. `,-1)]]),_:1},8,[`modelValue`]),Z(c,{label:`Follow bounding box`,modelValue:i.fixedViewBox,"onUpdate:modelValue":t[15]||=e=>i.fixedViewBox=e,step:`1`},{default:En(()=>[...t[36]||=[Q(` Setting this to true will disable pan/zoom but will always keep the graph visible. This is not part of the layout algorithm. Just a view setting of the renderer. `,-1)]]),_:1},8,[`modelValue`]),t[39]||=X(`div`,{class:`section`},[Q(` Add-ons `),X(`small`,null,[X(`a`,{href:`https://github.com/anvaka/ngraph.forcelayout/tree/main/modules`},`not part of the library`)])],-1),Z(s,{label:`Start from`,modelValue:i.placement,"onUpdate:modelValue":t[16]||=e=>i.placement=e,options:a.placementOptions},{default:En(()=>[...t[37]||=[Q(` Initial positions of nodes. `,-1),X(`b`,null,`pivot MDS`,-1),Q(` places nodes so that distances follow graph distances (or uses a radial tree when it fits better), so the layout only needs to polish it. Changing this restarts the layout. This is a separate module, `,-1),X(`code`,null,`modules/pivot`,-1),Q(` in this repository; ngraph.forcelayout itself places each node at random near its already placed neighbours. `,-1)]]),_:1},8,[`modelValue`,`options`]),Z(s,{label:`Run on`,modelValue:i.backend,"onUpdate:modelValue":t[17]||=e=>i.backend=e,options:a.backendOptions,note:i.gpuMessage},{default:En(()=>[...t[38]||=[X(`b`,null,`WebGPU`,-1),Q(` runs the whole simulation on the GPU (2D only). Repulsion uses a grid pyramid instead of a tree, so Theta and Repulsion settings do not apply; graphs up to 1,024 nodes use exact all-pairs repulsion. It is hundreds of times faster on large graphs, so raise Steps per frame (e.g. 20) to see it: with one step per frame, drawing the graph is the bottleneck. This is a separate module, `,-1),X(`code`,null,`modules/gpu`,-1),Q(` in this repository; ngraph.forcelayout itself always runs on the CPU. `,-1)]]),_:1},8,[`modelValue`,`options`,`note`]),i.loading?(Bi(),Gi(`div`,qd,`Loading graph...`)):ea(``,!0)])):ea(``,!0),i.loading?ea(``,!0):(Bi(),Gi(`div`,Jd,[X(`div`,Yd,[X(`a`,{href:`#`,onClick:t[18]||=jo((...e)=>a.toggleLayoutRun&&a.toggleLayoutRun(...e),[`prevent`]),class:`btn`},xe(i.isRunning?`Pause`:`Run`),1),X(`a`,{href:`#`,onClick:t[19]||=jo((...e)=>a.restart&&a.restart(...e),[`prevent`]),class:`btn restart`,title:`Start over from initial positions`},`Reset`)]),i.stats?(Bi(),Gi(`div`,Xd,[Q(xe(i.stats.nodes.toLocaleString())+` nodes, `+xe(i.stats.links.toLocaleString())+` links`,1),i.stats.placement?(Bi(),Gi(`span`,Zd,`, `+xe(i.stats.placement)+` start`,1)):ea(``,!0),t[42]||=X(`br`,null,null,-1),Q(` `+xe(i.stats.steps.toLocaleString())+` steps`,1),i.stats.msPerStep?(Bi(),Gi(`span`,Qd,[t[40]||=Q(`, `,-1),X(`span`,$d,xe(a.formatMs(i.stats.msPerStep)),1),t[41]||=Q(` ms/step`,-1)])):ea(``,!0),Q(` on `+xe(i.stats.backend===`webgpu`?`WebGPU`:`CPU`),1)])):ea(``,!0)]))])}var tf=od(Bd,[[`render`,ef]]);function nf(e,t){return e.addEventListener(`drop`,i,!0),e.addEventListener(`dragover`,a),e.addEventListener(`dragenter`,r),e.addEventListener(`dragleave`,s),e.addEventListener(`dragend`,s),{dispose:n};function n(){e.removeEventListener(`drop`,i),e.removeEventListener(`dragover`,a),e.removeEventListener(`dragenter`,r),e.removeEventListener(`dragleave`,s),e.removeEventListener(`dragend`,s)}function r(e){o(e)&&e.preventDefault()}function i(e){s(),e.preventDefault();var n=e.dataTransfer,r=[],i,a;if(n.items)for(i=0;i<n.items.length;i++)n.items[i].kind==`file`&&(a=n.items[i].getAsFile(),r.push(a));else for(i=0;i<n.files.length;i++)a=n.files[i],r.push(a);t(r)}function a(t){o(t)&&(t.preventDefault(),e.classList.add(`drag-over`))}function o(e){if(!e.dataTransfer)return!1;if(e.dataTransfer.files&&e.dataTransfer.files.length>0)return!0;var t=e.dataTransfer.items;if(!t)return!1;for(var n=0;n<t.length;++n)if(t[n].kind===`file`)return!0;return!1}function s(){e.classList.remove(`drag-over`)}}var rf=o(((e,t)=>{function n(e,t){function n(){this.constructor=e}n.prototype=t.prototype,e.prototype=new n}function r(e,t,n,i){this.message=e,this.expected=t,this.found=n,this.location=i,this.name=`SyntaxError`,typeof Error.captureStackTrace==`function`&&Error.captureStackTrace(this,r)}n(r,Error),r.buildMessage=function(e,t){var n={literal:function(e){return`"`+i(e.text)+`"`},class:function(e){for(var t=``,n=0;n<e.parts.length;n++)t+=e.parts[n]instanceof Array?a(e.parts[n][0])+`-`+a(e.parts[n][1]):a(e.parts[n]);return`[`+(e.inverted?`^`:``)+t+`]`},any:function(e){return`any character`},end:function(e){return`end of input`},other:function(e){return e.description}};function r(e){return e.charCodeAt(0).toString(16).toUpperCase()}function i(e){return e.replace(/\\/g,`\\\\`).replace(/"/g,`\\"`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function a(e){return e.replace(/\\/g,`\\\\`).replace(/\]/g,`\\]`).replace(/\^/g,`\\^`).replace(/-/g,`\\-`).replace(/\0/g,`\\0`).replace(/\t/g,`\\t`).replace(/\n/g,`\\n`).replace(/\r/g,`\\r`).replace(/[\x00-\x0F]/g,function(e){return`\\x0`+r(e)}).replace(/[\x10-\x1F\x7F-\x9F]/g,function(e){return`\\x`+r(e)})}function o(e){return n[e.type](e)}function s(e){for(var t=Array(e.length),n=0,r;n<e.length;n++)t[n]=o(e[n]);if(t.sort(),t.length>0){for(n=1,r=1;n<t.length;n++)t[n-1]!==t[n]&&(t[r]=t[n],r++);t.length=r}switch(t.length){case 1:return t[0];case 2:return t[0]+` or `+t[1];default:return t.slice(0,-1).join(`, `)+`, or `+t[t.length-1]}}function c(e){return e?`"`+i(e)+`"`:`end of input`}return`Expected `+s(e)+` but `+c(t)+` found.`};function i(e,t){t=t===void 0?{}:t;var n={},i={start:mn},a=mn,o=`strict`,s=q(`strict`,!0),c=`graph`,l=q(`graph`,!0),u=`digraph`,d=q(`digraph`,!0),f=`{`,p=q(`{`,!1),m=`}`,h=q(`}`,!1),g=function(e,t,n,r){r===null&&(r=[]);var i={type:t.toLowerCase(),children:r};return e&&(i.strict=!0),n&&(i.id=n),i},_=`;`,v=q(`;`,!1),y=function(e,t){return t},b=function(e,t){return[e].concat(t)},x=`=`,S=q(`=`,!1),C=function(e,t){return{type:`attr_stmt`,target:`graph`,attr_list:[{type:`attr`,id:e,eq:t}]}},w=`node`,T=q(`node`,!0),E=`edge`,D=q(`edge`,!0),O=function(e,t){return{type:`attr_stmt`,target:e,attr_list:t}},k=`[`,A=q(`[`,!1),j=`]`,ee=q(`]`,!1),M=function(e,t){return(e||[]).concat(t||[])},N=function(e,t){return t},P=`,`,te=q(`,`,!1),F=function(e,t,n){return[{type:`attr`,id:e,eq:t}].concat(n||[])},I=function(e,t,n){var r=[e];return r=r.concat(t.map(function(e){return e.id})),{type:`edge_stmt`,edge_list:r,attr_list:n||[]}},ne=`->`,L=q(`->`,!1),R=`--`,z=q(`--`,!1),re=function(e,t,n){return[{type:`edgeRHS`,edgeop:e,id:t}].concat(n||[])},ie=function(e,t){return{type:`node_stmt`,node_id:e,attr_list:t||[]}},ae=function(e,t){return t?{type:`node_id`,id:e,port:t}:{type:`node_id`,id:e}},oe=un(`port`),se=`:`,B=q(`:`,!1),ce=function(e,t){return t},le=function(e,t){return{type:`port`,id:e,compass_pt:t||null}},V=function(e){return{type:`port`,compass_pt:e||null}},ue=`subgraph`,de=q(`subgraph`,!0),fe=function(e){return e?{type:`subgraph`,id:e}:{type:`subgraph`}},pe=function(e,t){return e||={type:`subgraph`},e.children=t||[],e},me=`n`,he=q(`n`,!1),ge=`ne`,_e=q(`ne`,!1),ve=`e`,ye=q(`e`,!1),be=`se`,xe=q(`se`,!1),Se=`s`,Ce=q(`s`,!1),we=`sw`,Te=q(`sw`,!1),Ee=`w`,H=q(`w`,!1),De=`nw`,Oe=q(`nw`,!1),ke=un(`UNICODE_STRING`),Ae=function(e,t){return e+t.join(``)},je=function(e,t){return e+t},Me=`$`,Ne=q(`$`,!1),Pe=`_`,Fe=q(`_`,!1),Ie=un(`NUMBER`),Le=`-`,Re=q(`-`,!1),ze=`.`,Be=q(`.`,!1),Ve=/^[0-9]/,He=sn([[`0`,`9`]],!1,!1),Ue=function(e){return parseFloat(on())},We=function(e){return{type:`id`,value:e.slice(1,e.length-1),html:!0}},Ge=`<`,Ke=q(`<`,!1),qe=`>`,Je=q(`>`,!1),Ye=function(e){return`<`+e.join(``)+`>`},Xe=cn(),Ze=function(e){return e},Qe=function(e){return e.join(``)},$e=`"`,et=q(`"`,!1),tt=function(e){return e.join(``)},nt=function(){return on()},rt=`\\`,it=q(`\\`,!1),at=function(e){return e[1]===`"`?`"`:e[0]+e[1]},ot=function(){return``},st=/^[\n\r\u2028\u2029]/,ct=sn([`
`,`\r`,`\u2028`,`\u2029`],!1,!1),lt=un(`end of line`),ut=`
`,dt=q(`
`,!1),ft=`\r
`,pt=q(`\r
`,!1),mt=`\r`,ht=q(`\r`,!1),gt=`\u2028`,_t=q(`\u2028`,!1),vt=`\u2029`,yt=q(`\u2029`,!1),bt=un(`COMMENT`),xt=un(`BLOCK_COMMENT`),St=`/*`,Ct=q(`/*`,!1),wt=`*/`,Tt=q(`*/`,!1),Et=function(e){return e},Dt=function(e){return e.join(``)},Ot=un(`C_COMMENT`),kt=`//`,At=q(`//`,!1),jt=/^[\n]/,Mt=sn([`
`],!1,!1),Nt=function(e){return e.join(``)},Pt=un(`MACRO_COMMENT`),Ft=`#`,It=q(`#`,!1),Lt=un(`WHITESPACE`),Rt=/^[\n\r]/,zt=sn([`
`,`\r`],!1,!1),Bt=/^[ \t]/,Vt=sn([` `,`	`],!1,!1),Ht=/^[a-z\xB5\xDF-\xF6\xF8-\xFF\u0101\u0103\u0105\u0107\u0109\u010B\u010D\u010F\u0111\u0113\u0115\u0117\u0119\u011B\u011D\u011F\u0121\u0123\u0125\u0127\u0129\u012B\u012D\u012F\u0131\u0133\u0135\u0137-\u0138\u013A\u013C\u013E\u0140\u0142\u0144\u0146\u0148-\u0149\u014B\u014D\u014F\u0151\u0153\u0155\u0157\u0159\u015B\u015D\u015F\u0161\u0163\u0165\u0167\u0169\u016B\u016D\u016F\u0171\u0173\u0175\u0177\u017A\u017C\u017E-\u0180\u0183\u0185\u0188\u018C-\u018D\u0192\u0195\u0199-\u019B\u019E\u01A1\u01A3\u01A5\u01A8\u01AA-\u01AB\u01AD\u01B0\u01B4\u01B6\u01B9-\u01BA\u01BD-\u01BF\u01C6\u01C9\u01CC\u01CE\u01D0\u01D2\u01D4\u01D6\u01D8\u01DA\u01DC-\u01DD\u01DF\u01E1\u01E3\u01E5\u01E7\u01E9\u01EB\u01ED\u01EF-\u01F0\u01F3\u01F5\u01F9\u01FB\u01FD\u01FF\u0201\u0203\u0205\u0207\u0209\u020B\u020D\u020F\u0211\u0213\u0215\u0217\u0219\u021B\u021D\u021F\u0221\u0223\u0225\u0227\u0229\u022B\u022D\u022F\u0231\u0233-\u0239\u023C\u023F-\u0240\u0242\u0247\u0249\u024B\u024D\u024F-\u0293\u0295-\u02AF\u0371\u0373\u0377\u037B-\u037D\u0390\u03AC-\u03CE\u03D0-\u03D1\u03D5-\u03D7\u03D9\u03DB\u03DD\u03DF\u03E1\u03E3\u03E5\u03E7\u03E9\u03EB\u03ED\u03EF-\u03F3\u03F5\u03F8\u03FB-\u03FC\u0430-\u045F\u0461\u0463\u0465\u0467\u0469\u046B\u046D\u046F\u0471\u0473\u0475\u0477\u0479\u047B\u047D\u047F\u0481\u048B\u048D\u048F\u0491\u0493\u0495\u0497\u0499\u049B\u049D\u049F\u04A1\u04A3\u04A5\u04A7\u04A9\u04AB\u04AD\u04AF\u04B1\u04B3\u04B5\u04B7\u04B9\u04BB\u04BD\u04BF\u04C2\u04C4\u04C6\u04C8\u04CA\u04CC\u04CE-\u04CF\u04D1\u04D3\u04D5\u04D7\u04D9\u04DB\u04DD\u04DF\u04E1\u04E3\u04E5\u04E7\u04E9\u04EB\u04ED\u04EF\u04F1\u04F3\u04F5\u04F7\u04F9\u04FB\u04FD\u04FF\u0501\u0503\u0505\u0507\u0509\u050B\u050D\u050F\u0511\u0513\u0515\u0517\u0519\u051B\u051D\u051F\u0521\u0523\u0525\u0527\u0561-\u0587\u1D00-\u1D2B\u1D6B-\u1D77\u1D79-\u1D9A\u1E01\u1E03\u1E05\u1E07\u1E09\u1E0B\u1E0D\u1E0F\u1E11\u1E13\u1E15\u1E17\u1E19\u1E1B\u1E1D\u1E1F\u1E21\u1E23\u1E25\u1E27\u1E29\u1E2B\u1E2D\u1E2F\u1E31\u1E33\u1E35\u1E37\u1E39\u1E3B\u1E3D\u1E3F\u1E41\u1E43\u1E45\u1E47\u1E49\u1E4B\u1E4D\u1E4F\u1E51\u1E53\u1E55\u1E57\u1E59\u1E5B\u1E5D\u1E5F\u1E61\u1E63\u1E65\u1E67\u1E69\u1E6B\u1E6D\u1E6F\u1E71\u1E73\u1E75\u1E77\u1E79\u1E7B\u1E7D\u1E7F\u1E81\u1E83\u1E85\u1E87\u1E89\u1E8B\u1E8D\u1E8F\u1E91\u1E93\u1E95-\u1E9D\u1E9F\u1EA1\u1EA3\u1EA5\u1EA7\u1EA9\u1EAB\u1EAD\u1EAF\u1EB1\u1EB3\u1EB5\u1EB7\u1EB9\u1EBB\u1EBD\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1EC9\u1ECB\u1ECD\u1ECF\u1ED1\u1ED3\u1ED5\u1ED7\u1ED9\u1EDB\u1EDD\u1EDF\u1EE1\u1EE3\u1EE5\u1EE7\u1EE9\u1EEB\u1EED\u1EEF\u1EF1\u1EF3\u1EF5\u1EF7\u1EF9\u1EFB\u1EFD\u1EFF-\u1F07\u1F10-\u1F15\u1F20-\u1F27\u1F30-\u1F37\u1F40-\u1F45\u1F50-\u1F57\u1F60-\u1F67\u1F70-\u1F7D\u1F80-\u1F87\u1F90-\u1F97\u1FA0-\u1FA7\u1FB0-\u1FB4\u1FB6-\u1FB7\u1FBE\u1FC2-\u1FC4\u1FC6-\u1FC7\u1FD0-\u1FD3\u1FD6-\u1FD7\u1FE0-\u1FE7\u1FF2-\u1FF4\u1FF6-\u1FF7\u210A\u210E-\u210F\u2113\u212F\u2134\u2139\u213C-\u213D\u2146-\u2149\u214E\u2184\u2C30-\u2C5E\u2C61\u2C65-\u2C66\u2C68\u2C6A\u2C6C\u2C71\u2C73-\u2C74\u2C76-\u2C7B\u2C81\u2C83\u2C85\u2C87\u2C89\u2C8B\u2C8D\u2C8F\u2C91\u2C93\u2C95\u2C97\u2C99\u2C9B\u2C9D\u2C9F\u2CA1\u2CA3\u2CA5\u2CA7\u2CA9\u2CAB\u2CAD\u2CAF\u2CB1\u2CB3\u2CB5\u2CB7\u2CB9\u2CBB\u2CBD\u2CBF\u2CC1\u2CC3\u2CC5\u2CC7\u2CC9\u2CCB\u2CCD\u2CCF\u2CD1\u2CD3\u2CD5\u2CD7\u2CD9\u2CDB\u2CDD\u2CDF\u2CE1\u2CE3-\u2CE4\u2CEC\u2CEE\u2CF3\u2D00-\u2D25\u2D27\u2D2D\uA641\uA643\uA645\uA647\uA649\uA64B\uA64D\uA64F\uA651\uA653\uA655\uA657\uA659\uA65B\uA65D\uA65F\uA661\uA663\uA665\uA667\uA669\uA66B\uA66D\uA681\uA683\uA685\uA687\uA689\uA68B\uA68D\uA68F\uA691\uA693\uA695\uA697\uA723\uA725\uA727\uA729\uA72B\uA72D\uA72F-\uA731\uA733\uA735\uA737\uA739\uA73B\uA73D\uA73F\uA741\uA743\uA745\uA747\uA749\uA74B\uA74D\uA74F\uA751\uA753\uA755\uA757\uA759\uA75B\uA75D\uA75F\uA761\uA763\uA765\uA767\uA769\uA76B\uA76D\uA76F\uA771-\uA778\uA77A\uA77C\uA77F\uA781\uA783\uA785\uA787\uA78C\uA78E\uA791\uA793\uA7A1\uA7A3\uA7A5\uA7A7\uA7A9\uA7FA\uFB00-\uFB06\uFB13-\uFB17\uFF41-\uFF5A]/,Ut=sn([[`a`,`z`],`µ`,[`ß`,`ö`],[`ø`,`ÿ`],`ā`,`ă`,`ą`,`ć`,`ĉ`,`ċ`,`č`,`ď`,`đ`,`ē`,`ĕ`,`ė`,`ę`,`ě`,`ĝ`,`ğ`,`ġ`,`ģ`,`ĥ`,`ħ`,`ĩ`,`ī`,`ĭ`,`į`,`ı`,`ĳ`,`ĵ`,[`ķ`,`ĸ`],`ĺ`,`ļ`,`ľ`,`ŀ`,`ł`,`ń`,`ņ`,[`ň`,`ŉ`],`ŋ`,`ō`,`ŏ`,`ő`,`œ`,`ŕ`,`ŗ`,`ř`,`ś`,`ŝ`,`ş`,`š`,`ţ`,`ť`,`ŧ`,`ũ`,`ū`,`ŭ`,`ů`,`ű`,`ų`,`ŵ`,`ŷ`,`ź`,`ż`,[`ž`,`ƀ`],`ƃ`,`ƅ`,`ƈ`,[`ƌ`,`ƍ`],`ƒ`,`ƕ`,[`ƙ`,`ƛ`],`ƞ`,`ơ`,`ƣ`,`ƥ`,`ƨ`,[`ƪ`,`ƫ`],`ƭ`,`ư`,`ƴ`,`ƶ`,[`ƹ`,`ƺ`],[`ƽ`,`ƿ`],`ǆ`,`ǉ`,`ǌ`,`ǎ`,`ǐ`,`ǒ`,`ǔ`,`ǖ`,`ǘ`,`ǚ`,[`ǜ`,`ǝ`],`ǟ`,`ǡ`,`ǣ`,`ǥ`,`ǧ`,`ǩ`,`ǫ`,`ǭ`,[`ǯ`,`ǰ`],`ǳ`,`ǵ`,`ǹ`,`ǻ`,`ǽ`,`ǿ`,`ȁ`,`ȃ`,`ȅ`,`ȇ`,`ȉ`,`ȋ`,`ȍ`,`ȏ`,`ȑ`,`ȓ`,`ȕ`,`ȗ`,`ș`,`ț`,`ȝ`,`ȟ`,`ȡ`,`ȣ`,`ȥ`,`ȧ`,`ȩ`,`ȫ`,`ȭ`,`ȯ`,`ȱ`,[`ȳ`,`ȹ`],`ȼ`,[`ȿ`,`ɀ`],`ɂ`,`ɇ`,`ɉ`,`ɋ`,`ɍ`,[`ɏ`,`ʓ`],[`ʕ`,`ʯ`],`ͱ`,`ͳ`,`ͷ`,[`ͻ`,`ͽ`],`ΐ`,[`ά`,`ώ`],[`ϐ`,`ϑ`],[`ϕ`,`ϗ`],`ϙ`,`ϛ`,`ϝ`,`ϟ`,`ϡ`,`ϣ`,`ϥ`,`ϧ`,`ϩ`,`ϫ`,`ϭ`,[`ϯ`,`ϳ`],`ϵ`,`ϸ`,[`ϻ`,`ϼ`],[`а`,`џ`],`ѡ`,`ѣ`,`ѥ`,`ѧ`,`ѩ`,`ѫ`,`ѭ`,`ѯ`,`ѱ`,`ѳ`,`ѵ`,`ѷ`,`ѹ`,`ѻ`,`ѽ`,`ѿ`,`ҁ`,`ҋ`,`ҍ`,`ҏ`,`ґ`,`ғ`,`ҕ`,`җ`,`ҙ`,`қ`,`ҝ`,`ҟ`,`ҡ`,`ң`,`ҥ`,`ҧ`,`ҩ`,`ҫ`,`ҭ`,`ү`,`ұ`,`ҳ`,`ҵ`,`ҷ`,`ҹ`,`һ`,`ҽ`,`ҿ`,`ӂ`,`ӄ`,`ӆ`,`ӈ`,`ӊ`,`ӌ`,[`ӎ`,`ӏ`],`ӑ`,`ӓ`,`ӕ`,`ӗ`,`ә`,`ӛ`,`ӝ`,`ӟ`,`ӡ`,`ӣ`,`ӥ`,`ӧ`,`ө`,`ӫ`,`ӭ`,`ӯ`,`ӱ`,`ӳ`,`ӵ`,`ӷ`,`ӹ`,`ӻ`,`ӽ`,`ӿ`,`ԁ`,`ԃ`,`ԅ`,`ԇ`,`ԉ`,`ԋ`,`ԍ`,`ԏ`,`ԑ`,`ԓ`,`ԕ`,`ԗ`,`ԙ`,`ԛ`,`ԝ`,`ԟ`,`ԡ`,`ԣ`,`ԥ`,`ԧ`,[`ա`,`և`],[`ᴀ`,`ᴫ`],[`ᵫ`,`ᵷ`],[`ᵹ`,`ᶚ`],`ḁ`,`ḃ`,`ḅ`,`ḇ`,`ḉ`,`ḋ`,`ḍ`,`ḏ`,`ḑ`,`ḓ`,`ḕ`,`ḗ`,`ḙ`,`ḛ`,`ḝ`,`ḟ`,`ḡ`,`ḣ`,`ḥ`,`ḧ`,`ḩ`,`ḫ`,`ḭ`,`ḯ`,`ḱ`,`ḳ`,`ḵ`,`ḷ`,`ḹ`,`ḻ`,`ḽ`,`ḿ`,`ṁ`,`ṃ`,`ṅ`,`ṇ`,`ṉ`,`ṋ`,`ṍ`,`ṏ`,`ṑ`,`ṓ`,`ṕ`,`ṗ`,`ṙ`,`ṛ`,`ṝ`,`ṟ`,`ṡ`,`ṣ`,`ṥ`,`ṧ`,`ṩ`,`ṫ`,`ṭ`,`ṯ`,`ṱ`,`ṳ`,`ṵ`,`ṷ`,`ṹ`,`ṻ`,`ṽ`,`ṿ`,`ẁ`,`ẃ`,`ẅ`,`ẇ`,`ẉ`,`ẋ`,`ẍ`,`ẏ`,`ẑ`,`ẓ`,[`ẕ`,`ẝ`],`ẟ`,`ạ`,`ả`,`ấ`,`ầ`,`ẩ`,`ẫ`,`ậ`,`ắ`,`ằ`,`ẳ`,`ẵ`,`ặ`,`ẹ`,`ẻ`,`ẽ`,`ế`,`ề`,`ể`,`ễ`,`ệ`,`ỉ`,`ị`,`ọ`,`ỏ`,`ố`,`ồ`,`ổ`,`ỗ`,`ộ`,`ớ`,`ờ`,`ở`,`ỡ`,`ợ`,`ụ`,`ủ`,`ứ`,`ừ`,`ử`,`ữ`,`ự`,`ỳ`,`ỵ`,`ỷ`,`ỹ`,`ỻ`,`ỽ`,[`ỿ`,`ἇ`],[`ἐ`,`ἕ`],[`ἠ`,`ἧ`],[`ἰ`,`ἷ`],[`ὀ`,`ὅ`],[`ὐ`,`ὗ`],[`ὠ`,`ὧ`],[`ὰ`,`ώ`],[`ᾀ`,`ᾇ`],[`ᾐ`,`ᾗ`],[`ᾠ`,`ᾧ`],[`ᾰ`,`ᾴ`],[`ᾶ`,`ᾷ`],`ι`,[`ῂ`,`ῄ`],[`ῆ`,`ῇ`],[`ῐ`,`ΐ`],[`ῖ`,`ῗ`],[`ῠ`,`ῧ`],[`ῲ`,`ῴ`],[`ῶ`,`ῷ`],`ℊ`,[`ℎ`,`ℏ`],`ℓ`,`ℯ`,`ℴ`,`ℹ`,[`ℼ`,`ℽ`],[`ⅆ`,`ⅉ`],`ⅎ`,`ↄ`,[`ⰰ`,`ⱞ`],`ⱡ`,[`ⱥ`,`ⱦ`],`ⱨ`,`ⱪ`,`ⱬ`,`ⱱ`,[`ⱳ`,`ⱴ`],[`ⱶ`,`ⱻ`],`ⲁ`,`ⲃ`,`ⲅ`,`ⲇ`,`ⲉ`,`ⲋ`,`ⲍ`,`ⲏ`,`ⲑ`,`ⲓ`,`ⲕ`,`ⲗ`,`ⲙ`,`ⲛ`,`ⲝ`,`ⲟ`,`ⲡ`,`ⲣ`,`ⲥ`,`ⲧ`,`ⲩ`,`ⲫ`,`ⲭ`,`ⲯ`,`ⲱ`,`ⲳ`,`ⲵ`,`ⲷ`,`ⲹ`,`ⲻ`,`ⲽ`,`ⲿ`,`ⳁ`,`ⳃ`,`ⳅ`,`ⳇ`,`ⳉ`,`ⳋ`,`ⳍ`,`ⳏ`,`ⳑ`,`ⳓ`,`ⳕ`,`ⳗ`,`ⳙ`,`ⳛ`,`ⳝ`,`ⳟ`,`ⳡ`,[`ⳣ`,`ⳤ`],`ⳬ`,`ⳮ`,`ⳳ`,[`ⴀ`,`ⴥ`],`ⴧ`,`ⴭ`,`ꙁ`,`ꙃ`,`ꙅ`,`ꙇ`,`ꙉ`,`ꙋ`,`ꙍ`,`ꙏ`,`ꙑ`,`ꙓ`,`ꙕ`,`ꙗ`,`ꙙ`,`ꙛ`,`ꙝ`,`ꙟ`,`ꙡ`,`ꙣ`,`ꙥ`,`ꙧ`,`ꙩ`,`ꙫ`,`ꙭ`,`ꚁ`,`ꚃ`,`ꚅ`,`ꚇ`,`ꚉ`,`ꚋ`,`ꚍ`,`ꚏ`,`ꚑ`,`ꚓ`,`ꚕ`,`ꚗ`,`ꜣ`,`ꜥ`,`ꜧ`,`ꜩ`,`ꜫ`,`ꜭ`,[`ꜯ`,`ꜱ`],`ꜳ`,`ꜵ`,`ꜷ`,`ꜹ`,`ꜻ`,`ꜽ`,`ꜿ`,`ꝁ`,`ꝃ`,`ꝅ`,`ꝇ`,`ꝉ`,`ꝋ`,`ꝍ`,`ꝏ`,`ꝑ`,`ꝓ`,`ꝕ`,`ꝗ`,`ꝙ`,`ꝛ`,`ꝝ`,`ꝟ`,`ꝡ`,`ꝣ`,`ꝥ`,`ꝧ`,`ꝩ`,`ꝫ`,`ꝭ`,`ꝯ`,[`ꝱ`,`ꝸ`],`ꝺ`,`ꝼ`,`ꝿ`,`ꞁ`,`ꞃ`,`ꞅ`,`ꞇ`,`ꞌ`,`ꞎ`,`ꞑ`,`ꞓ`,`ꞡ`,`ꞣ`,`ꞥ`,`ꞧ`,`ꞩ`,`ꟺ`,[`ﬀ`,`ﬆ`],[`ﬓ`,`ﬗ`],[`ａ`,`ｚ`]],!1,!1),U=/^[\u02B0-\u02C1\u02C6-\u02D1\u02E0-\u02E4\u02EC\u02EE\u0374\u037A\u0559\u0640\u06E5-\u06E6\u07F4-\u07F5\u07FA\u081A\u0824\u0828\u0971\u0E46\u0EC6\u10FC\u17D7\u1843\u1AA7\u1C78-\u1C7D\u1D2C-\u1D6A\u1D78\u1D9B-\u1DBF\u2071\u207F\u2090-\u209C\u2C7C-\u2C7D\u2D6F\u2E2F\u3005\u3031-\u3035\u303B\u309D-\u309E\u30FC-\u30FE\uA015\uA4F8-\uA4FD\uA60C\uA67F\uA717-\uA71F\uA770\uA788\uA7F8-\uA7F9\uA9CF\uAA70\uAADD\uAAF3-\uAAF4\uFF70\uFF9E-\uFF9F]/,Wt=sn([[`ʰ`,`ˁ`],[`ˆ`,`ˑ`],[`ˠ`,`ˤ`],`ˬ`,`ˮ`,`ʹ`,`ͺ`,`ՙ`,`ـ`,[`ۥ`,`ۦ`],[`ߴ`,`ߵ`],`ߺ`,`ࠚ`,`ࠤ`,`ࠨ`,`ॱ`,`ๆ`,`ໆ`,`ჼ`,`ៗ`,`ᡃ`,`ᪧ`,[`ᱸ`,`ᱽ`],[`ᴬ`,`ᵪ`],`ᵸ`,[`ᶛ`,`ᶿ`],`ⁱ`,`ⁿ`,[`ₐ`,`ₜ`],[`ⱼ`,`ⱽ`],`ⵯ`,`ⸯ`,`々`,[`〱`,`〵`],`〻`,[`ゝ`,`ゞ`],[`ー`,`ヾ`],`ꀕ`,[`ꓸ`,`ꓽ`],`ꘌ`,`ꙿ`,[`ꜗ`,`ꜟ`],`ꝰ`,`ꞈ`,[`ꟸ`,`ꟹ`],`ꧏ`,`ꩰ`,`ꫝ`,[`ꫳ`,`ꫴ`],`ｰ`,[`ﾞ`,`ﾟ`]],!1,!1),Gt=/^[\xAA\xBA\u01BB\u01C0-\u01C3\u0294\u05D0-\u05EA\u05F0-\u05F2\u0620-\u063F\u0641-\u064A\u066E-\u066F\u0671-\u06D3\u06D5\u06EE-\u06EF\u06FA-\u06FC\u06FF\u0710\u0712-\u072F\u074D-\u07A5\u07B1\u07CA-\u07EA\u0800-\u0815\u0840-\u0858\u08A0\u08A2-\u08AC\u0904-\u0939\u093D\u0950\u0958-\u0961\u0972-\u0977\u0979-\u097F\u0985-\u098C\u098F-\u0990\u0993-\u09A8\u09AA-\u09B0\u09B2\u09B6-\u09B9\u09BD\u09CE\u09DC-\u09DD\u09DF-\u09E1\u09F0-\u09F1\u0A05-\u0A0A\u0A0F-\u0A10\u0A13-\u0A28\u0A2A-\u0A30\u0A32-\u0A33\u0A35-\u0A36\u0A38-\u0A39\u0A59-\u0A5C\u0A5E\u0A72-\u0A74\u0A85-\u0A8D\u0A8F-\u0A91\u0A93-\u0AA8\u0AAA-\u0AB0\u0AB2-\u0AB3\u0AB5-\u0AB9\u0ABD\u0AD0\u0AE0-\u0AE1\u0B05-\u0B0C\u0B0F-\u0B10\u0B13-\u0B28\u0B2A-\u0B30\u0B32-\u0B33\u0B35-\u0B39\u0B3D\u0B5C-\u0B5D\u0B5F-\u0B61\u0B71\u0B83\u0B85-\u0B8A\u0B8E-\u0B90\u0B92-\u0B95\u0B99-\u0B9A\u0B9C\u0B9E-\u0B9F\u0BA3-\u0BA4\u0BA8-\u0BAA\u0BAE-\u0BB9\u0BD0\u0C05-\u0C0C\u0C0E-\u0C10\u0C12-\u0C28\u0C2A-\u0C33\u0C35-\u0C39\u0C3D\u0C58-\u0C59\u0C60-\u0C61\u0C85-\u0C8C\u0C8E-\u0C90\u0C92-\u0CA8\u0CAA-\u0CB3\u0CB5-\u0CB9\u0CBD\u0CDE\u0CE0-\u0CE1\u0CF1-\u0CF2\u0D05-\u0D0C\u0D0E-\u0D10\u0D12-\u0D3A\u0D3D\u0D4E\u0D60-\u0D61\u0D7A-\u0D7F\u0D85-\u0D96\u0D9A-\u0DB1\u0DB3-\u0DBB\u0DBD\u0DC0-\u0DC6\u0E01-\u0E30\u0E32-\u0E33\u0E40-\u0E45\u0E81-\u0E82\u0E84\u0E87-\u0E88\u0E8A\u0E8D\u0E94-\u0E97\u0E99-\u0E9F\u0EA1-\u0EA3\u0EA5\u0EA7\u0EAA-\u0EAB\u0EAD-\u0EB0\u0EB2-\u0EB3\u0EBD\u0EC0-\u0EC4\u0EDC-\u0EDF\u0F00\u0F40-\u0F47\u0F49-\u0F6C\u0F88-\u0F8C\u1000-\u102A\u103F\u1050-\u1055\u105A-\u105D\u1061\u1065-\u1066\u106E-\u1070\u1075-\u1081\u108E\u10D0-\u10FA\u10FD-\u1248\u124A-\u124D\u1250-\u1256\u1258\u125A-\u125D\u1260-\u1288\u128A-\u128D\u1290-\u12B0\u12B2-\u12B5\u12B8-\u12BE\u12C0\u12C2-\u12C5\u12C8-\u12D6\u12D8-\u1310\u1312-\u1315\u1318-\u135A\u1380-\u138F\u13A0-\u13F4\u1401-\u166C\u166F-\u167F\u1681-\u169A\u16A0-\u16EA\u1700-\u170C\u170E-\u1711\u1720-\u1731\u1740-\u1751\u1760-\u176C\u176E-\u1770\u1780-\u17B3\u17DC\u1820-\u1842\u1844-\u1877\u1880-\u18A8\u18AA\u18B0-\u18F5\u1900-\u191C\u1950-\u196D\u1970-\u1974\u1980-\u19AB\u19C1-\u19C7\u1A00-\u1A16\u1A20-\u1A54\u1B05-\u1B33\u1B45-\u1B4B\u1B83-\u1BA0\u1BAE-\u1BAF\u1BBA-\u1BE5\u1C00-\u1C23\u1C4D-\u1C4F\u1C5A-\u1C77\u1CE9-\u1CEC\u1CEE-\u1CF1\u1CF5-\u1CF6\u2135-\u2138\u2D30-\u2D67\u2D80-\u2D96\u2DA0-\u2DA6\u2DA8-\u2DAE\u2DB0-\u2DB6\u2DB8-\u2DBE\u2DC0-\u2DC6\u2DC8-\u2DCE\u2DD0-\u2DD6\u2DD8-\u2DDE\u3006\u303C\u3041-\u3096\u309F\u30A1-\u30FA\u30FF\u3105-\u312D\u3131-\u318E\u31A0-\u31BA\u31F0-\u31FF\u3400-\u4DB5\u4E00-\u9FCC\uA000-\uA014\uA016-\uA48C\uA4D0-\uA4F7\uA500-\uA60B\uA610-\uA61F\uA62A-\uA62B\uA66E\uA6A0-\uA6E5\uA7FB-\uA801\uA803-\uA805\uA807-\uA80A\uA80C-\uA822\uA840-\uA873\uA882-\uA8B3\uA8F2-\uA8F7\uA8FB\uA90A-\uA925\uA930-\uA946\uA960-\uA97C\uA984-\uA9B2\uAA00-\uAA28\uAA40-\uAA42\uAA44-\uAA4B\uAA60-\uAA6F\uAA71-\uAA76\uAA7A\uAA80-\uAAAF\uAAB1\uAAB5-\uAAB6\uAAB9-\uAABD\uAAC0\uAAC2\uAADB-\uAADC\uAAE0-\uAAEA\uAAF2\uAB01-\uAB06\uAB09-\uAB0E\uAB11-\uAB16\uAB20-\uAB26\uAB28-\uAB2E\uABC0-\uABE2\uAC00-\uD7A3\uD7B0-\uD7C6\uD7CB-\uD7FB\uF900-\uFA6D\uFA70-\uFAD9\uFB1D\uFB1F-\uFB28\uFB2A-\uFB36\uFB38-\uFB3C\uFB3E\uFB40-\uFB41\uFB43-\uFB44\uFB46-\uFBB1\uFBD3-\uFD3D\uFD50-\uFD8F\uFD92-\uFDC7\uFDF0-\uFDFB\uFE70-\uFE74\uFE76-\uFEFC\uFF66-\uFF6F\uFF71-\uFF9D\uFFA0-\uFFBE\uFFC2-\uFFC7\uFFCA-\uFFCF\uFFD2-\uFFD7\uFFDA-\uFFDC]/,Kt=sn([`ª`,`º`,`ƻ`,[`ǀ`,`ǃ`],`ʔ`,[`א`,`ת`],[`װ`,`ײ`],[`ؠ`,`ؿ`],[`ف`,`ي`],[`ٮ`,`ٯ`],[`ٱ`,`ۓ`],`ە`,[`ۮ`,`ۯ`],[`ۺ`,`ۼ`],`ۿ`,`ܐ`,[`ܒ`,`ܯ`],[`ݍ`,`ޥ`],`ޱ`,[`ߊ`,`ߪ`],[`ࠀ`,`ࠕ`],[`ࡀ`,`ࡘ`],`ࢠ`,[`ࢢ`,`ࢬ`],[`ऄ`,`ह`],`ऽ`,`ॐ`,[`क़`,`ॡ`],[`ॲ`,`ॷ`],[`ॹ`,`ॿ`],[`অ`,`ঌ`],[`এ`,`ঐ`],[`ও`,`ন`],[`প`,`র`],`ল`,[`শ`,`হ`],`ঽ`,`ৎ`,[`ড়`,`ঢ়`],[`য়`,`ৡ`],[`ৰ`,`ৱ`],[`ਅ`,`ਊ`],[`ਏ`,`ਐ`],[`ਓ`,`ਨ`],[`ਪ`,`ਰ`],[`ਲ`,`ਲ਼`],[`ਵ`,`ਸ਼`],[`ਸ`,`ਹ`],[`ਖ਼`,`ੜ`],`ਫ਼`,[`ੲ`,`ੴ`],[`અ`,`ઍ`],[`એ`,`ઑ`],[`ઓ`,`ન`],[`પ`,`ર`],[`લ`,`ળ`],[`વ`,`હ`],`ઽ`,`ૐ`,[`ૠ`,`ૡ`],[`ଅ`,`ଌ`],[`ଏ`,`ଐ`],[`ଓ`,`ନ`],[`ପ`,`ର`],[`ଲ`,`ଳ`],[`ଵ`,`ହ`],`ଽ`,[`ଡ଼`,`ଢ଼`],[`ୟ`,`ୡ`],`ୱ`,`ஃ`,[`அ`,`ஊ`],[`எ`,`ஐ`],[`ஒ`,`க`],[`ங`,`ச`],`ஜ`,[`ஞ`,`ட`],[`ண`,`த`],[`ந`,`ப`],[`ம`,`ஹ`],`ௐ`,[`అ`,`ఌ`],[`ఎ`,`ఐ`],[`ఒ`,`న`],[`ప`,`ళ`],[`వ`,`హ`],`ఽ`,[`ౘ`,`ౙ`],[`ౠ`,`ౡ`],[`ಅ`,`ಌ`],[`ಎ`,`ಐ`],[`ಒ`,`ನ`],[`ಪ`,`ಳ`],[`ವ`,`ಹ`],`ಽ`,`ೞ`,[`ೠ`,`ೡ`],[`ೱ`,`ೲ`],[`അ`,`ഌ`],[`എ`,`ഐ`],[`ഒ`,`ഺ`],`ഽ`,`ൎ`,[`ൠ`,`ൡ`],[`ൺ`,`ൿ`],[`අ`,`ඖ`],[`ක`,`න`],[`ඳ`,`ර`],`ල`,[`ව`,`ෆ`],[`ก`,`ะ`],[`า`,`ำ`],[`เ`,`ๅ`],[`ກ`,`ຂ`],`ຄ`,[`ງ`,`ຈ`],`ຊ`,`ຍ`,[`ດ`,`ທ`],[`ນ`,`ຟ`],[`ມ`,`ຣ`],`ລ`,`ວ`,[`ສ`,`ຫ`],[`ອ`,`ະ`],[`າ`,`ຳ`],`ຽ`,[`ເ`,`ໄ`],[`ໜ`,`ໟ`],`ༀ`,[`ཀ`,`ཇ`],[`ཉ`,`ཬ`],[`ྈ`,`ྌ`],[`က`,`ဪ`],`ဿ`,[`ၐ`,`ၕ`],[`ၚ`,`ၝ`],`ၡ`,[`ၥ`,`ၦ`],[`ၮ`,`ၰ`],[`ၵ`,`ႁ`],`ႎ`,[`ა`,`ჺ`],[`ჽ`,`ቈ`],[`ቊ`,`ቍ`],[`ቐ`,`ቖ`],`ቘ`,[`ቚ`,`ቝ`],[`በ`,`ኈ`],[`ኊ`,`ኍ`],[`ነ`,`ኰ`],[`ኲ`,`ኵ`],[`ኸ`,`ኾ`],`ዀ`,[`ዂ`,`ዅ`],[`ወ`,`ዖ`],[`ዘ`,`ጐ`],[`ጒ`,`ጕ`],[`ጘ`,`ፚ`],[`ᎀ`,`ᎏ`],[`Ꭰ`,`Ᏼ`],[`ᐁ`,`ᙬ`],[`ᙯ`,`ᙿ`],[`ᚁ`,`ᚚ`],[`ᚠ`,`ᛪ`],[`ᜀ`,`ᜌ`],[`ᜎ`,`ᜑ`],[`ᜠ`,`ᜱ`],[`ᝀ`,`ᝑ`],[`ᝠ`,`ᝬ`],[`ᝮ`,`ᝰ`],[`ក`,`ឳ`],`ៜ`,[`ᠠ`,`ᡂ`],[`ᡄ`,`ᡷ`],[`ᢀ`,`ᢨ`],`ᢪ`,[`ᢰ`,`ᣵ`],[`ᤀ`,`ᤜ`],[`ᥐ`,`ᥭ`],[`ᥰ`,`ᥴ`],[`ᦀ`,`ᦫ`],[`ᧁ`,`ᧇ`],[`ᨀ`,`ᨖ`],[`ᨠ`,`ᩔ`],[`ᬅ`,`ᬳ`],[`ᭅ`,`ᭋ`],[`ᮃ`,`ᮠ`],[`ᮮ`,`ᮯ`],[`ᮺ`,`ᯥ`],[`ᰀ`,`ᰣ`],[`ᱍ`,`ᱏ`],[`ᱚ`,`ᱷ`],[`ᳩ`,`ᳬ`],[`ᳮ`,`ᳱ`],[`ᳵ`,`ᳶ`],[`ℵ`,`ℸ`],[`ⴰ`,`ⵧ`],[`ⶀ`,`ⶖ`],[`ⶠ`,`ⶦ`],[`ⶨ`,`ⶮ`],[`ⶰ`,`ⶶ`],[`ⶸ`,`ⶾ`],[`ⷀ`,`ⷆ`],[`ⷈ`,`ⷎ`],[`ⷐ`,`ⷖ`],[`ⷘ`,`ⷞ`],`〆`,`〼`,[`ぁ`,`ゖ`],`ゟ`,[`ァ`,`ヺ`],`ヿ`,[`ㄅ`,`ㄭ`],[`ㄱ`,`ㆎ`],[`ㆠ`,`ㆺ`],[`ㇰ`,`ㇿ`],[`㐀`,`䶵`],[`一`,`鿌`],[`ꀀ`,`ꀔ`],[`ꀖ`,`ꒌ`],[`ꓐ`,`ꓷ`],[`ꔀ`,`ꘋ`],[`ꘐ`,`ꘟ`],[`ꘪ`,`ꘫ`],`ꙮ`,[`ꚠ`,`ꛥ`],[`ꟻ`,`ꠁ`],[`ꠃ`,`ꠅ`],[`ꠇ`,`ꠊ`],[`ꠌ`,`ꠢ`],[`ꡀ`,`ꡳ`],[`ꢂ`,`ꢳ`],[`ꣲ`,`ꣷ`],`ꣻ`,[`ꤊ`,`ꤥ`],[`ꤰ`,`ꥆ`],[`ꥠ`,`ꥼ`],[`ꦄ`,`ꦲ`],[`ꨀ`,`ꨨ`],[`ꩀ`,`ꩂ`],[`ꩄ`,`ꩋ`],[`ꩠ`,`ꩯ`],[`ꩱ`,`ꩶ`],`ꩺ`,[`ꪀ`,`ꪯ`],`ꪱ`,[`ꪵ`,`ꪶ`],[`ꪹ`,`ꪽ`],`ꫀ`,`ꫂ`,[`ꫛ`,`ꫜ`],[`ꫠ`,`ꫪ`],`ꫲ`,[`ꬁ`,`ꬆ`],[`ꬉ`,`ꬎ`],[`ꬑ`,`ꬖ`],[`ꬠ`,`ꬦ`],[`ꬨ`,`ꬮ`],[`ꯀ`,`ꯢ`],[`가`,`힣`],[`ힰ`,`ퟆ`],[`ퟋ`,`ퟻ`],[`豈`,`舘`],[`並`,`龎`],`יִ`,[`ײַ`,`ﬨ`],[`שׁ`,`זּ`],[`טּ`,`לּ`],`מּ`,[`נּ`,`סּ`],[`ףּ`,`פּ`],[`צּ`,`ﮱ`],[`ﯓ`,`ﴽ`],[`ﵐ`,`ﶏ`],[`ﶒ`,`ﷇ`],[`ﷰ`,`ﷻ`],[`ﹰ`,`ﹴ`],[`ﹶ`,`ﻼ`],[`ｦ`,`ｯ`],[`ｱ`,`ﾝ`],[`ﾠ`,`ﾾ`],[`ￂ`,`ￇ`],[`ￊ`,`ￏ`],[`ￒ`,`ￗ`],[`ￚ`,`ￜ`]],!1,!1),qt=/^[\u01C5\u01C8\u01CB\u01F2\u1F88-\u1F8F\u1F98-\u1F9F\u1FA8-\u1FAF\u1FBC\u1FCC\u1FFC]/,Jt=sn([`ǅ`,`ǈ`,`ǋ`,`ǲ`,[`ᾈ`,`ᾏ`],[`ᾘ`,`ᾟ`],[`ᾨ`,`ᾯ`],`ᾼ`,`ῌ`,`ῼ`],!1,!1),Yt=/^[A-Z\xC0-\xD6\xD8-\xDE\u0100\u0102\u0104\u0106\u0108\u010A\u010C\u010E\u0110\u0112\u0114\u0116\u0118\u011A\u011C\u011E\u0120\u0122\u0124\u0126\u0128\u012A\u012C\u012E\u0130\u0132\u0134\u0136\u0139\u013B\u013D\u013F\u0141\u0143\u0145\u0147\u014A\u014C\u014E\u0150\u0152\u0154\u0156\u0158\u015A\u015C\u015E\u0160\u0162\u0164\u0166\u0168\u016A\u016C\u016E\u0170\u0172\u0174\u0176\u0178-\u0179\u017B\u017D\u0181-\u0182\u0184\u0186-\u0187\u0189-\u018B\u018E-\u0191\u0193-\u0194\u0196-\u0198\u019C-\u019D\u019F-\u01A0\u01A2\u01A4\u01A6-\u01A7\u01A9\u01AC\u01AE-\u01AF\u01B1-\u01B3\u01B5\u01B7-\u01B8\u01BC\u01C4\u01C7\u01CA\u01CD\u01CF\u01D1\u01D3\u01D5\u01D7\u01D9\u01DB\u01DE\u01E0\u01E2\u01E4\u01E6\u01E8\u01EA\u01EC\u01EE\u01F1\u01F4\u01F6-\u01F8\u01FA\u01FC\u01FE\u0200\u0202\u0204\u0206\u0208\u020A\u020C\u020E\u0210\u0212\u0214\u0216\u0218\u021A\u021C\u021E\u0220\u0222\u0224\u0226\u0228\u022A\u022C\u022E\u0230\u0232\u023A-\u023B\u023D-\u023E\u0241\u0243-\u0246\u0248\u024A\u024C\u024E\u0370\u0372\u0376\u0386\u0388-\u038A\u038C\u038E-\u038F\u0391-\u03A1\u03A3-\u03AB\u03CF\u03D2-\u03D4\u03D8\u03DA\u03DC\u03DE\u03E0\u03E2\u03E4\u03E6\u03E8\u03EA\u03EC\u03EE\u03F4\u03F7\u03F9-\u03FA\u03FD-\u042F\u0460\u0462\u0464\u0466\u0468\u046A\u046C\u046E\u0470\u0472\u0474\u0476\u0478\u047A\u047C\u047E\u0480\u048A\u048C\u048E\u0490\u0492\u0494\u0496\u0498\u049A\u049C\u049E\u04A0\u04A2\u04A4\u04A6\u04A8\u04AA\u04AC\u04AE\u04B0\u04B2\u04B4\u04B6\u04B8\u04BA\u04BC\u04BE\u04C0-\u04C1\u04C3\u04C5\u04C7\u04C9\u04CB\u04CD\u04D0\u04D2\u04D4\u04D6\u04D8\u04DA\u04DC\u04DE\u04E0\u04E2\u04E4\u04E6\u04E8\u04EA\u04EC\u04EE\u04F0\u04F2\u04F4\u04F6\u04F8\u04FA\u04FC\u04FE\u0500\u0502\u0504\u0506\u0508\u050A\u050C\u050E\u0510\u0512\u0514\u0516\u0518\u051A\u051C\u051E\u0520\u0522\u0524\u0526\u0531-\u0556\u10A0-\u10C5\u10C7\u10CD\u1E00\u1E02\u1E04\u1E06\u1E08\u1E0A\u1E0C\u1E0E\u1E10\u1E12\u1E14\u1E16\u1E18\u1E1A\u1E1C\u1E1E\u1E20\u1E22\u1E24\u1E26\u1E28\u1E2A\u1E2C\u1E2E\u1E30\u1E32\u1E34\u1E36\u1E38\u1E3A\u1E3C\u1E3E\u1E40\u1E42\u1E44\u1E46\u1E48\u1E4A\u1E4C\u1E4E\u1E50\u1E52\u1E54\u1E56\u1E58\u1E5A\u1E5C\u1E5E\u1E60\u1E62\u1E64\u1E66\u1E68\u1E6A\u1E6C\u1E6E\u1E70\u1E72\u1E74\u1E76\u1E78\u1E7A\u1E7C\u1E7E\u1E80\u1E82\u1E84\u1E86\u1E88\u1E8A\u1E8C\u1E8E\u1E90\u1E92\u1E94\u1E9E\u1EA0\u1EA2\u1EA4\u1EA6\u1EA8\u1EAA\u1EAC\u1EAE\u1EB0\u1EB2\u1EB4\u1EB6\u1EB8\u1EBA\u1EBC\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1EC8\u1ECA\u1ECC\u1ECE\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EDA\u1EDC\u1EDE\u1EE0\u1EE2\u1EE4\u1EE6\u1EE8\u1EEA\u1EEC\u1EEE\u1EF0\u1EF2\u1EF4\u1EF6\u1EF8\u1EFA\u1EFC\u1EFE\u1F08-\u1F0F\u1F18-\u1F1D\u1F28-\u1F2F\u1F38-\u1F3F\u1F48-\u1F4D\u1F59\u1F5B\u1F5D\u1F5F\u1F68-\u1F6F\u1FB8-\u1FBB\u1FC8-\u1FCB\u1FD8-\u1FDB\u1FE8-\u1FEC\u1FF8-\u1FFB\u2102\u2107\u210B-\u210D\u2110-\u2112\u2115\u2119-\u211D\u2124\u2126\u2128\u212A-\u212D\u2130-\u2133\u213E-\u213F\u2145\u2183\u2C00-\u2C2E\u2C60\u2C62-\u2C64\u2C67\u2C69\u2C6B\u2C6D-\u2C70\u2C72\u2C75\u2C7E-\u2C80\u2C82\u2C84\u2C86\u2C88\u2C8A\u2C8C\u2C8E\u2C90\u2C92\u2C94\u2C96\u2C98\u2C9A\u2C9C\u2C9E\u2CA0\u2CA2\u2CA4\u2CA6\u2CA8\u2CAA\u2CAC\u2CAE\u2CB0\u2CB2\u2CB4\u2CB6\u2CB8\u2CBA\u2CBC\u2CBE\u2CC0\u2CC2\u2CC4\u2CC6\u2CC8\u2CCA\u2CCC\u2CCE\u2CD0\u2CD2\u2CD4\u2CD6\u2CD8\u2CDA\u2CDC\u2CDE\u2CE0\u2CE2\u2CEB\u2CED\u2CF2\uA640\uA642\uA644\uA646\uA648\uA64A\uA64C\uA64E\uA650\uA652\uA654\uA656\uA658\uA65A\uA65C\uA65E\uA660\uA662\uA664\uA666\uA668\uA66A\uA66C\uA680\uA682\uA684\uA686\uA688\uA68A\uA68C\uA68E\uA690\uA692\uA694\uA696\uA722\uA724\uA726\uA728\uA72A\uA72C\uA72E\uA732\uA734\uA736\uA738\uA73A\uA73C\uA73E\uA740\uA742\uA744\uA746\uA748\uA74A\uA74C\uA74E\uA750\uA752\uA754\uA756\uA758\uA75A\uA75C\uA75E\uA760\uA762\uA764\uA766\uA768\uA76A\uA76C\uA76E\uA779\uA77B\uA77D-\uA77E\uA780\uA782\uA784\uA786\uA78B\uA78D\uA790\uA792\uA7A0\uA7A2\uA7A4\uA7A6\uA7A8\uA7AA\uFF21-\uFF3A]/,Xt=sn([[`A`,`Z`],[`À`,`Ö`],[`Ø`,`Þ`],`Ā`,`Ă`,`Ą`,`Ć`,`Ĉ`,`Ċ`,`Č`,`Ď`,`Đ`,`Ē`,`Ĕ`,`Ė`,`Ę`,`Ě`,`Ĝ`,`Ğ`,`Ġ`,`Ģ`,`Ĥ`,`Ħ`,`Ĩ`,`Ī`,`Ĭ`,`Į`,`İ`,`Ĳ`,`Ĵ`,`Ķ`,`Ĺ`,`Ļ`,`Ľ`,`Ŀ`,`Ł`,`Ń`,`Ņ`,`Ň`,`Ŋ`,`Ō`,`Ŏ`,`Ő`,`Œ`,`Ŕ`,`Ŗ`,`Ř`,`Ś`,`Ŝ`,`Ş`,`Š`,`Ţ`,`Ť`,`Ŧ`,`Ũ`,`Ū`,`Ŭ`,`Ů`,`Ű`,`Ų`,`Ŵ`,`Ŷ`,[`Ÿ`,`Ź`],`Ż`,`Ž`,[`Ɓ`,`Ƃ`],`Ƅ`,[`Ɔ`,`Ƈ`],[`Ɖ`,`Ƌ`],[`Ǝ`,`Ƒ`],[`Ɠ`,`Ɣ`],[`Ɩ`,`Ƙ`],[`Ɯ`,`Ɲ`],[`Ɵ`,`Ơ`],`Ƣ`,`Ƥ`,[`Ʀ`,`Ƨ`],`Ʃ`,`Ƭ`,[`Ʈ`,`Ư`],[`Ʊ`,`Ƴ`],`Ƶ`,[`Ʒ`,`Ƹ`],`Ƽ`,`Ǆ`,`Ǉ`,`Ǌ`,`Ǎ`,`Ǐ`,`Ǒ`,`Ǔ`,`Ǖ`,`Ǘ`,`Ǚ`,`Ǜ`,`Ǟ`,`Ǡ`,`Ǣ`,`Ǥ`,`Ǧ`,`Ǩ`,`Ǫ`,`Ǭ`,`Ǯ`,`Ǳ`,`Ǵ`,[`Ƕ`,`Ǹ`],`Ǻ`,`Ǽ`,`Ǿ`,`Ȁ`,`Ȃ`,`Ȅ`,`Ȇ`,`Ȉ`,`Ȋ`,`Ȍ`,`Ȏ`,`Ȑ`,`Ȓ`,`Ȕ`,`Ȗ`,`Ș`,`Ț`,`Ȝ`,`Ȟ`,`Ƞ`,`Ȣ`,`Ȥ`,`Ȧ`,`Ȩ`,`Ȫ`,`Ȭ`,`Ȯ`,`Ȱ`,`Ȳ`,[`Ⱥ`,`Ȼ`],[`Ƚ`,`Ⱦ`],`Ɂ`,[`Ƀ`,`Ɇ`],`Ɉ`,`Ɋ`,`Ɍ`,`Ɏ`,`Ͱ`,`Ͳ`,`Ͷ`,`Ά`,[`Έ`,`Ί`],`Ό`,[`Ύ`,`Ώ`],[`Α`,`Ρ`],[`Σ`,`Ϋ`],`Ϗ`,[`ϒ`,`ϔ`],`Ϙ`,`Ϛ`,`Ϝ`,`Ϟ`,`Ϡ`,`Ϣ`,`Ϥ`,`Ϧ`,`Ϩ`,`Ϫ`,`Ϭ`,`Ϯ`,`ϴ`,`Ϸ`,[`Ϲ`,`Ϻ`],[`Ͻ`,`Я`],`Ѡ`,`Ѣ`,`Ѥ`,`Ѧ`,`Ѩ`,`Ѫ`,`Ѭ`,`Ѯ`,`Ѱ`,`Ѳ`,`Ѵ`,`Ѷ`,`Ѹ`,`Ѻ`,`Ѽ`,`Ѿ`,`Ҁ`,`Ҋ`,`Ҍ`,`Ҏ`,`Ґ`,`Ғ`,`Ҕ`,`Җ`,`Ҙ`,`Қ`,`Ҝ`,`Ҟ`,`Ҡ`,`Ң`,`Ҥ`,`Ҧ`,`Ҩ`,`Ҫ`,`Ҭ`,`Ү`,`Ұ`,`Ҳ`,`Ҵ`,`Ҷ`,`Ҹ`,`Һ`,`Ҽ`,`Ҿ`,[`Ӏ`,`Ӂ`],`Ӄ`,`Ӆ`,`Ӈ`,`Ӊ`,`Ӌ`,`Ӎ`,`Ӑ`,`Ӓ`,`Ӕ`,`Ӗ`,`Ә`,`Ӛ`,`Ӝ`,`Ӟ`,`Ӡ`,`Ӣ`,`Ӥ`,`Ӧ`,`Ө`,`Ӫ`,`Ӭ`,`Ӯ`,`Ӱ`,`Ӳ`,`Ӵ`,`Ӷ`,`Ӹ`,`Ӻ`,`Ӽ`,`Ӿ`,`Ԁ`,`Ԃ`,`Ԅ`,`Ԇ`,`Ԉ`,`Ԋ`,`Ԍ`,`Ԏ`,`Ԑ`,`Ԓ`,`Ԕ`,`Ԗ`,`Ԙ`,`Ԛ`,`Ԝ`,`Ԟ`,`Ԡ`,`Ԣ`,`Ԥ`,`Ԧ`,[`Ա`,`Ֆ`],[`Ⴀ`,`Ⴥ`],`Ⴧ`,`Ⴭ`,`Ḁ`,`Ḃ`,`Ḅ`,`Ḇ`,`Ḉ`,`Ḋ`,`Ḍ`,`Ḏ`,`Ḑ`,`Ḓ`,`Ḕ`,`Ḗ`,`Ḙ`,`Ḛ`,`Ḝ`,`Ḟ`,`Ḡ`,`Ḣ`,`Ḥ`,`Ḧ`,`Ḩ`,`Ḫ`,`Ḭ`,`Ḯ`,`Ḱ`,`Ḳ`,`Ḵ`,`Ḷ`,`Ḹ`,`Ḻ`,`Ḽ`,`Ḿ`,`Ṁ`,`Ṃ`,`Ṅ`,`Ṇ`,`Ṉ`,`Ṋ`,`Ṍ`,`Ṏ`,`Ṑ`,`Ṓ`,`Ṕ`,`Ṗ`,`Ṙ`,`Ṛ`,`Ṝ`,`Ṟ`,`Ṡ`,`Ṣ`,`Ṥ`,`Ṧ`,`Ṩ`,`Ṫ`,`Ṭ`,`Ṯ`,`Ṱ`,`Ṳ`,`Ṵ`,`Ṷ`,`Ṹ`,`Ṻ`,`Ṽ`,`Ṿ`,`Ẁ`,`Ẃ`,`Ẅ`,`Ẇ`,`Ẉ`,`Ẋ`,`Ẍ`,`Ẏ`,`Ẑ`,`Ẓ`,`Ẕ`,`ẞ`,`Ạ`,`Ả`,`Ấ`,`Ầ`,`Ẩ`,`Ẫ`,`Ậ`,`Ắ`,`Ằ`,`Ẳ`,`Ẵ`,`Ặ`,`Ẹ`,`Ẻ`,`Ẽ`,`Ế`,`Ề`,`Ể`,`Ễ`,`Ệ`,`Ỉ`,`Ị`,`Ọ`,`Ỏ`,`Ố`,`Ồ`,`Ổ`,`Ỗ`,`Ộ`,`Ớ`,`Ờ`,`Ở`,`Ỡ`,`Ợ`,`Ụ`,`Ủ`,`Ứ`,`Ừ`,`Ử`,`Ữ`,`Ự`,`Ỳ`,`Ỵ`,`Ỷ`,`Ỹ`,`Ỻ`,`Ỽ`,`Ỿ`,[`Ἀ`,`Ἇ`],[`Ἐ`,`Ἕ`],[`Ἠ`,`Ἧ`],[`Ἰ`,`Ἷ`],[`Ὀ`,`Ὅ`],`Ὑ`,`Ὓ`,`Ὕ`,`Ὗ`,[`Ὠ`,`Ὧ`],[`Ᾰ`,`Ά`],[`Ὲ`,`Ή`],[`Ῐ`,`Ί`],[`Ῠ`,`Ῥ`],[`Ὸ`,`Ώ`],`ℂ`,`ℇ`,[`ℋ`,`ℍ`],[`ℐ`,`ℒ`],`ℕ`,[`ℙ`,`ℝ`],`ℤ`,`Ω`,`ℨ`,[`K`,`ℭ`],[`ℰ`,`ℳ`],[`ℾ`,`ℿ`],`ⅅ`,`Ↄ`,[`Ⰰ`,`Ⱞ`],`Ⱡ`,[`Ɫ`,`Ɽ`],`Ⱨ`,`Ⱪ`,`Ⱬ`,[`Ɑ`,`Ɒ`],`Ⱳ`,`Ⱶ`,[`Ȿ`,`Ⲁ`],`Ⲃ`,`Ⲅ`,`Ⲇ`,`Ⲉ`,`Ⲋ`,`Ⲍ`,`Ⲏ`,`Ⲑ`,`Ⲓ`,`Ⲕ`,`Ⲗ`,`Ⲙ`,`Ⲛ`,`Ⲝ`,`Ⲟ`,`Ⲡ`,`Ⲣ`,`Ⲥ`,`Ⲧ`,`Ⲩ`,`Ⲫ`,`Ⲭ`,`Ⲯ`,`Ⲱ`,`Ⲳ`,`Ⲵ`,`Ⲷ`,`Ⲹ`,`Ⲻ`,`Ⲽ`,`Ⲿ`,`Ⳁ`,`Ⳃ`,`Ⳅ`,`Ⳇ`,`Ⳉ`,`Ⳋ`,`Ⳍ`,`Ⳏ`,`Ⳑ`,`Ⳓ`,`Ⳕ`,`Ⳗ`,`Ⳙ`,`Ⳛ`,`Ⳝ`,`Ⳟ`,`Ⳡ`,`Ⳣ`,`Ⳬ`,`Ⳮ`,`Ⳳ`,`Ꙁ`,`Ꙃ`,`Ꙅ`,`Ꙇ`,`Ꙉ`,`Ꙋ`,`Ꙍ`,`Ꙏ`,`Ꙑ`,`Ꙓ`,`Ꙕ`,`Ꙗ`,`Ꙙ`,`Ꙛ`,`Ꙝ`,`Ꙟ`,`Ꙡ`,`Ꙣ`,`Ꙥ`,`Ꙧ`,`Ꙩ`,`Ꙫ`,`Ꙭ`,`Ꚁ`,`Ꚃ`,`Ꚅ`,`Ꚇ`,`Ꚉ`,`Ꚋ`,`Ꚍ`,`Ꚏ`,`Ꚑ`,`Ꚓ`,`Ꚕ`,`Ꚗ`,`Ꜣ`,`Ꜥ`,`Ꜧ`,`Ꜩ`,`Ꜫ`,`Ꜭ`,`Ꜯ`,`Ꜳ`,`Ꜵ`,`Ꜷ`,`Ꜹ`,`Ꜻ`,`Ꜽ`,`Ꜿ`,`Ꝁ`,`Ꝃ`,`Ꝅ`,`Ꝇ`,`Ꝉ`,`Ꝋ`,`Ꝍ`,`Ꝏ`,`Ꝑ`,`Ꝓ`,`Ꝕ`,`Ꝗ`,`Ꝙ`,`Ꝛ`,`Ꝝ`,`Ꝟ`,`Ꝡ`,`Ꝣ`,`Ꝥ`,`Ꝧ`,`Ꝩ`,`Ꝫ`,`Ꝭ`,`Ꝯ`,`Ꝺ`,`Ꝼ`,[`Ᵹ`,`Ꝿ`],`Ꞁ`,`Ꞃ`,`Ꞅ`,`Ꞇ`,`Ꞌ`,`Ɥ`,`Ꞑ`,`Ꞓ`,`Ꞡ`,`Ꞣ`,`Ꞥ`,`Ꞧ`,`Ꞩ`,`Ɦ`,[`Ａ`,`Ｚ`]],!1,!1),Zt=/^[\u16EE-\u16F0\u2160-\u2182\u2185-\u2188\u3007\u3021-\u3029\u3038-\u303A\uA6E6-\uA6EF]/,Qt=sn([[`ᛮ`,`ᛰ`],[`Ⅰ`,`ↂ`],[`ↅ`,`ↈ`],`〇`,[`〡`,`〩`],[`〸`,`〺`],[`ꛦ`,`ꛯ`]],!1,!1),$t=/^[0-9\u0660-\u0669\u06F0-\u06F9\u07C0-\u07C9\u0966-\u096F\u09E6-\u09EF\u0A66-\u0A6F\u0AE6-\u0AEF\u0B66-\u0B6F\u0BE6-\u0BEF\u0C66-\u0C6F\u0CE6-\u0CEF\u0D66-\u0D6F\u0E50-\u0E59\u0ED0-\u0ED9\u0F20-\u0F29\u1040-\u1049\u1090-\u1099\u17E0-\u17E9\u1810-\u1819\u1946-\u194F\u19D0-\u19D9\u1A80-\u1A89\u1A90-\u1A99\u1B50-\u1B59\u1BB0-\u1BB9\u1C40-\u1C49\u1C50-\u1C59\uA620-\uA629\uA8D0-\uA8D9\uA900-\uA909\uA9D0-\uA9D9\uAA50-\uAA59\uABF0-\uABF9\uFF10-\uFF19]/,en=sn([[`0`,`9`],[`٠`,`٩`],[`۰`,`۹`],[`߀`,`߉`],[`०`,`९`],[`০`,`৯`],[`੦`,`੯`],[`૦`,`૯`],[`୦`,`୯`],[`௦`,`௯`],[`౦`,`౯`],[`೦`,`೯`],[`൦`,`൯`],[`๐`,`๙`],[`໐`,`໙`],[`༠`,`༩`],[`၀`,`၉`],[`႐`,`႙`],[`០`,`៩`],[`᠐`,`᠙`],[`᥆`,`᥏`],[`᧐`,`᧙`],[`᪀`,`᪉`],[`᪐`,`᪙`],[`᭐`,`᭙`],[`᮰`,`᮹`],[`᱀`,`᱉`],[`᱐`,`᱙`],[`꘠`,`꘩`],[`꣐`,`꣙`],[`꤀`,`꤉`],[`꧐`,`꧙`],[`꩐`,`꩙`],[`꯰`,`꯹`],[`０`,`９`]],!1,!1),W=0,G=0,tn=[{line:1,column:1}],nn=0,rn=[],K=0,an;if(`startRule`in t){if(!(t.startRule in i))throw Error(`Can't start parsing from rule "`+t.startRule+`".`);a=i[t.startRule]}function on(){return e.substring(G,W)}function q(e,t){return{type:`literal`,text:e,ignoreCase:t}}function sn(e,t,n){return{type:`class`,parts:e,inverted:t,ignoreCase:n}}function cn(){return{type:`any`}}function ln(){return{type:`end`}}function un(e){return{type:`other`,description:e}}function dn(t){var n=tn[t],r;if(n)return n;for(r=t-1;!tn[r];)r--;for(n=tn[r],n={line:n.line,column:n.column};r<t;)e.charCodeAt(r)===10?(n.line++,n.column=1):n.column++,r++;return tn[t]=n,n}function fn(e,t){var n=dn(e),r=dn(t);return{start:{offset:e,line:n.line,column:n.column},end:{offset:t,line:r.line,column:r.column}}}function J(e){W<nn||(W>nn&&(nn=W,rn=[]),rn.push(e))}function pn(e,t,n){return new r(r.buildMessage(e,t),e,t,n)}function mn(){var e=[],t=hn();if(t!==n)for(;t!==n;)e.push(t),t=hn();else e=n;return e}function hn(){var t=W,r=Y(),i,a,_,v,y,b,x,S,C,w,T;return r===n?(W=t,t=n):(e.substr(W,6).toLowerCase()===o?(i=e.substr(W,6),W+=6):(i=n,K===0&&J(s)),i===n&&(i=null),i===n?(W=t,t=n):(a=Y(),a===n?(W=t,t=n):(e.substr(W,5).toLowerCase()===c?(_=e.substr(W,5),W+=5):(_=n,K===0&&J(l)),_===n&&(e.substr(W,7).toLowerCase()===u?(_=e.substr(W,7),W+=7):(_=n,K===0&&J(d))),_===n?(W=t,t=n):(v=Y(),v===n?(W=t,t=n):(y=On(),y===n&&(y=null),y===n?(W=t,t=n):(b=Y(),b===n?(W=t,t=n):(e.charCodeAt(W)===123?(x=f,W++):(x=n,K===0&&J(p)),x===n?(W=t,t=n):(S=gn(),S===n&&(S=null),S===n?(W=t,t=n):(C=Y(),C===n?(W=t,t=n):(e.charCodeAt(W)===125?(w=m,W++):(w=n,K===0&&J(h)),w===n?(W=t,t=n):(T=Y(),T===n?(W=t,t=n):(G=t,r=g(i,_,y,S),t=r)))))))))))),t}function gn(){var t=W,r=Y(),i,a,o,s,c,l,u,d,f;if(r!==n){if(i=_n(),i!==n){if(a=Y(),a!==n){if(e.charCodeAt(W)===59?(o=_,W++):(o=n,K===0&&J(v)),o===n&&(o=null),o!==n){for(s=[],c=W,l=Y(),l===n?(W=c,c=n):(u=_n(),u===n?(W=c,c=n):(d=Y(),d===n?(W=c,c=n):(e.charCodeAt(W)===59?(f=_,W++):(f=n,K===0&&J(v)),f===n&&(f=null),f===n?(W=c,c=n):(G=c,l=y(i,u),c=l))));c!==n;)s.push(c),c=W,l=Y(),l===n?(W=c,c=n):(u=_n(),u===n?(W=c,c=n):(d=Y(),d===n?(W=c,c=n):(e.charCodeAt(W)===59?(f=_,W++):(f=n,K===0&&J(v)),f===n&&(f=null),f===n?(W=c,c=n):(G=c,l=y(i,u),c=l))));s===n?(W=t,t=n):(G=t,r=b(i,s),t=r)}else W=t,t=n}else W=t,t=n}else W=t,t=n}else W=t,t=n;return t}function _n(){var t=W,r=On(),i,a,o,s;return r===n?(W=t,t=n):(i=Y(),i===n?(W=t,t=n):(e.charCodeAt(W)===61?(a=x,W++):(a=n,K===0&&J(S)),a===n?(W=t,t=n):(o=Y(),o===n?(W=t,t=n):(s=On(),s===n?(W=t,t=n):(G=t,r=C(r,s),t=r))))),t===n&&(t=vn(),t===n&&(t=xn(),t===n&&(t=En(),t===n&&(t=Cn(),t===n&&(t=W,r=On(),r===n?(W=t,t=n):(e.charCodeAt(W)===61?(i=x,W++):(i=n,K===0&&J(S)),i===n?(W=t,t=n):(a=On(),a===n?(W=t,t=n):(r=[r,i,a],t=r)))))))),t}function vn(){var t=W,r,i;return e.substr(W,5).toLowerCase()===c?(r=e.substr(W,5),W+=5):(r=n,K===0&&J(l)),r===n&&(e.substr(W,4).toLowerCase()===w?(r=e.substr(W,4),W+=4):(r=n,K===0&&J(T)),r===n&&(e.substr(W,4).toLowerCase()===E?(r=e.substr(W,4),W+=4):(r=n,K===0&&J(D)))),r===n?(W=t,t=n):(i=yn(),i===n?(W=t,t=n):(G=t,r=O(r,i),t=r)),t}function yn(){var t=W,r=Y(),i,a,o,s,c,l,u;return r===n?(W=t,t=n):(e.charCodeAt(W)===91?(i=k,W++):(i=n,K===0&&J(A)),i===n?(W=t,t=n):(a=Y(),a===n?(W=t,t=n):(o=bn(),o===n&&(o=null),o===n?(W=t,t=n):(s=Y(),s===n?(W=t,t=n):(e.charCodeAt(W)===93?(c=j,W++):(c=n,K===0&&J(ee)),c===n?(W=t,t=n):(l=Y(),l===n?(W=t,t=n):(u=yn(),u===n&&(u=null),u===n?(W=t,t=n):(G=t,r=M(o,u),t=r)))))))),t}function bn(){var t=W,r=Y(),i,a,o,s,c,l;return r===n?(W=t,t=n):(i=On(),i===n?(W=t,t=n):(a=W,o=Y(),o===n?(W=a,a=n):(e.charCodeAt(W)===61?(s=x,W++):(s=n,K===0&&J(S)),s===n?(W=a,a=n):(c=Y(),c===n?(W=a,a=n):(l=On(),l===n?(W=a,a=n):(G=a,o=N(i,l),a=o)))),a===n&&(a=null),a===n?(W=t,t=n):(o=Y(),o===n?(W=t,t=n):(e.charCodeAt(W)===44?(s=P,W++):(s=n,K===0&&J(te)),s===n&&(e.charCodeAt(W)===59?(s=_,W++):(s=n,K===0&&J(v))),s===n&&(s=null),s===n?(W=t,t=n):(c=bn(),c===n&&(c=null),c===n?(W=t,t=n):(G=t,r=F(i,a,c),t=r)))))),t}function xn(){var e=W,t=En(),r,i;return t===n&&(t=wn()),t===n?(W=e,e=n):(r=Sn(),r===n?(W=e,e=n):(i=yn(),i===n&&(i=null),i===n?(W=e,e=n):(G=e,t=I(t,r,i),e=t))),e}function Sn(){var t=W,r=Y(),i,a,o,s,c;return r===n?(W=t,t=n):(e.substr(W,2)===ne?(i=ne,W+=2):(i=n,K===0&&J(L)),i===n&&(e.substr(W,2)===R?(i=R,W+=2):(i=n,K===0&&J(z))),i===n?(W=t,t=n):(a=Y(),a===n?(W=t,t=n):(o=En(),o===n&&(o=wn()),o===n?(W=t,t=n):(s=Y(),s===n?(W=t,t=n):(c=Sn(),c===n&&(c=null),c===n?(W=t,t=n):(G=t,r=re(i,o,c),t=r)))))),t}function Cn(){var e=W,t=wn(),r;return t===n?(W=e,e=n):(r=yn(),r===n&&(r=null),r===n?(W=e,e=n):(G=e,t=ie(t,r),e=t)),e}function wn(){var e=W,t=On(),r;return t===n?(W=e,e=n):(r=Tn(),r===n&&(r=null),r===n?(W=e,e=n):(G=e,t=ae(t,r),e=t)),e}function Tn(){var t,r,i,a,o,s;return K++,t=W,e.charCodeAt(W)===58?(r=se,W++):(r=n,K===0&&J(B)),r===n?(W=t,t=n):(i=On(),i===n?(W=t,t=n):(a=W,e.charCodeAt(W)===58?(o=se,W++):(o=n,K===0&&J(B)),o===n?(W=a,a=n):(s=Dn(),s===n?(W=a,a=n):(G=a,o=ce(i,s),a=o)),a===n&&(a=null),a===n?(W=t,t=n):(G=t,r=le(i,a),t=r))),t===n&&(t=W,e.charCodeAt(W)===58?(r=se,W++):(r=n,K===0&&J(B)),r===n?(W=t,t=n):(i=Dn(),i===n?(W=t,t=n):(G=t,r=V(i),t=r))),K--,t===n&&(r=n,K===0&&J(oe)),t}function En(){var t=W,r=W,i,a,o,s;return e.substr(W,8).toLowerCase()===ue?(i=e.substr(W,8),W+=8):(i=n,K===0&&J(de)),i===n?(W=r,r=n):(a=Y(),a===n?(W=r,r=n):(o=On(),o===n&&(o=null),o===n?(W=r,r=n):(s=Y(),s===n?(W=r,r=n):(G=r,i=fe(o),r=i)))),r===n&&(r=null),r===n?(W=t,t=n):(e.charCodeAt(W)===123?(i=f,W++):(i=n,K===0&&J(p)),i===n?(W=t,t=n):(a=gn(),a===n&&(a=null),a===n?(W=t,t=n):(o=Y(),o===n?(W=t,t=n):(e.charCodeAt(W)===125?(s=m,W++):(s=n,K===0&&J(h)),s===n?(W=t,t=n):(G=t,r=pe(r,a),t=r))))),t}function Dn(){var t;return e.charCodeAt(W)===110?(t=me,W++):(t=n,K===0&&J(he)),t===n&&(e.substr(W,2)===ge?(t=ge,W+=2):(t=n,K===0&&J(_e)),t===n&&(e.charCodeAt(W)===101?(t=ve,W++):(t=n,K===0&&J(ye)),t===n&&(e.substr(W,2)===be?(t=be,W+=2):(t=n,K===0&&J(xe)),t===n&&(e.charCodeAt(W)===115?(t=Se,W++):(t=n,K===0&&J(Ce)),t===n&&(e.substr(W,2)===we?(t=we,W+=2):(t=n,K===0&&J(Te)),t===n&&(e.charCodeAt(W)===119?(t=Ee,W++):(t=n,K===0&&J(H)),t===n&&(e.substr(W,2)===De?(t=De,W+=2):(t=n,K===0&&J(Oe))))))))),t}function On(){var e=kn();return e===n&&(e=An(),e===n&&(e=Nn(),e===n&&(e=Ln(),e===n&&(e=Pn())))),e}function kn(){var e,t,r,i;if(K++,e=W,t=jn(),t!==n){for(r=[],i=Mn();i!==n;)r.push(i),i=Mn();r===n?(W=e,e=n):(G=e,t=Ae(t,r),e=t)}else W=e,e=n;return K--,e===n&&(t=n,K===0&&J(ke)),e}function An(){var e=W,t=Nn(),r;return t===n?(W=e,e=n):(r=kn(),r===n?(W=e,e=n):(G=e,t=je(t,r),e=t)),e}function jn(){var t=Xn();return t===n&&(e.charCodeAt(W)===36?(t=Me,W++):(t=n,K===0&&J(Ne)),t===n&&(e.charCodeAt(W)===95?(t=Pe,W++):(t=n,K===0&&J(Fe)))),t}function Mn(){var e=jn();return e===n&&(e=rr()),e}function Nn(){var t,r,i,a,o,s,c,l,u;if(K++,t=W,r=W,e.charCodeAt(W)===45?(i=Le,W++):(i=n,K===0&&J(Re)),i===n&&(i=null),i!==n){if(a=W,e.charCodeAt(W)===46?(o=ze,W++):(o=n,K===0&&J(Be)),o!==n){if(s=[],Ve.test(e.charAt(W))?(c=e.charAt(W),W++):(c=n,K===0&&J(He)),c!==n)for(;c!==n;)s.push(c),Ve.test(e.charAt(W))?(c=e.charAt(W),W++):(c=n,K===0&&J(He));else s=n;s===n?(W=a,a=n):(o=[o,s],a=o)}else W=a,a=n;if(a===n){if(a=W,o=[],Ve.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(He)),s!==n)for(;s!==n;)o.push(s),Ve.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(He));else o=n;if(o!==n){if(s=W,e.charCodeAt(W)===46?(c=ze,W++):(c=n,K===0&&J(Be)),c!==n){for(l=[],Ve.test(e.charAt(W))?(u=e.charAt(W),W++):(u=n,K===0&&J(He));u!==n;)l.push(u),Ve.test(e.charAt(W))?(u=e.charAt(W),W++):(u=n,K===0&&J(He));l===n?(W=s,s=n):(c=[c,l],s=c)}else W=s,s=n;s===n&&(s=null),s===n?(W=a,a=n):(o=[o,s],a=o)}else W=a,a=n}a===n?(W=r,r=n):(i=[i,a],r=i)}else W=r,r=n;return r!==n&&(G=t,r=Ue(r)),t=r,K--,t===n&&(r=n,K===0&&J(Ie)),t}function Pn(){var e=W,t=Fn();return t!==n&&(G=e,t=We(t)),e=t,e}function Fn(){var t=W,r,i,a;if(e.charCodeAt(W)===60?(r=Ge,W++):(r=n,K===0&&J(Ke)),r!==n){for(i=[],a=In(),a===n&&(a=Fn());a!==n;)i.push(a),a=In(),a===n&&(a=Fn());i===n?(W=t,t=n):(e.charCodeAt(W)===62?(a=qe,W++):(a=n,K===0&&J(Je)),a===n?(W=t,t=n):(G=t,r=Ye(i),t=r))}else W=t,t=n;return t}function In(){var t=W,r=[],i=W,a=W,o;if(K++,e.charCodeAt(W)===62?(o=qe,W++):(o=n,K===0&&J(Je)),o===n&&(e.charCodeAt(W)===60?(o=Ge,W++):(o=n,K===0&&J(Ke))),K--,o===n?a=void 0:(W=a,a=n),a===n?(W=i,i=n):(e.length>W?(o=e.charAt(W),W++):(o=n,K===0&&J(Xe)),o===n?(W=i,i=n):(G=i,a=Ze(o),i=a)),i!==n)for(;i!==n;)r.push(i),i=W,a=W,K++,e.charCodeAt(W)===62?(o=qe,W++):(o=n,K===0&&J(Je)),o===n&&(e.charCodeAt(W)===60?(o=Ge,W++):(o=n,K===0&&J(Ke))),K--,o===n?a=void 0:(W=a,a=n),a===n?(W=i,i=n):(e.length>W?(o=e.charAt(W),W++):(o=n,K===0&&J(Xe)),o===n?(W=i,i=n):(G=i,a=Ze(o),i=a));else r=n;return r!==n&&(G=t,r=Qe(r)),t=r,t}function Ln(){var t=W,r,i,a;if(e.charCodeAt(W)===34?(r=$e,W++):(r=n,K===0&&J(et)),r!==n){for(i=[],a=Rn();a!==n;)i.push(a),a=Rn();i===n?(W=t,t=n):(e.charCodeAt(W)===34?(a=$e,W++):(a=n,K===0&&J(et)),a===n?(W=t,t=n):(G=t,r=tt(i),t=r))}else W=t,t=n;return t}function Rn(){var t=zn(),r,i;return t===n&&(t=W,r=W,K++,e.charCodeAt(W)===34?(i=$e,W++):(i=n,K===0&&J(et)),i===n&&(i=Vn()),K--,i===n?r=void 0:(W=r,r=n),r===n?(W=t,t=n):(i=Un(),i===n?(W=t,t=n):(G=t,r=nt(),t=r)),t===n&&(t=Bn())),t}function zn(){var t=W,r=W,i,a;return e.charCodeAt(W)===92?(i=rt,W++):(i=n,K===0&&J(it)),i===n?(W=r,r=n):(e.length>W?(a=e.charAt(W),W++):(a=n,K===0&&J(Xe)),a===n?(W=r,r=n):(i=[i,a],r=i)),r!==n&&(G=t,r=at(r)),t=r,t}function Bn(){var t=W,r,i;return e.charCodeAt(W)===92?(r=rt,W++):(r=n,K===0&&J(it)),r===n?(W=t,t=n):(i=Hn(),i===n?(W=t,t=n):(G=t,r=ot(),t=r)),t}function Vn(){var t;return st.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(ct)),t}function Hn(){var t;return K++,e.charCodeAt(W)===10?(t=ut,W++):(t=n,K===0&&J(dt)),t===n&&(e.substr(W,2)===ft?(t=ft,W+=2):(t=n,K===0&&J(pt)),t===n&&(e.charCodeAt(W)===13?(t=mt,W++):(t=n,K===0&&J(ht)),t===n&&(e.charCodeAt(W)===8232?(t=gt,W++):(t=n,K===0&&J(_t)),t===n&&(e.charCodeAt(W)===8233?(t=vt,W++):(t=n,K===0&&J(yt)))))),K--,t===n&&K===0&&J(lt),t}function Un(){var t;return e.length>W?(t=e.charAt(W),W++):(t=n,K===0&&J(Xe)),t}function Wn(){var e;return K++,e=Gn(),e===n&&(e=Kn(),e===n&&(e=qn())),K--,e===n&&K===0&&J(bt),e}function Gn(){var t,r,i,a,o,s;if(K++,t=W,e.substr(W,2)===St?(r=St,W+=2):(r=n,K===0&&J(Ct)),r!==n){for(i=[],a=W,o=W,K++,e.substr(W,2)===wt?(s=wt,W+=2):(s=n,K===0&&J(Tt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Et(s),a=o));a!==n;)i.push(a),a=W,o=W,K++,e.substr(W,2)===wt?(s=wt,W+=2):(s=n,K===0&&J(Tt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Et(s),a=o));i===n?(W=t,t=n):(e.substr(W,2)===wt?(a=wt,W+=2):(a=n,K===0&&J(Tt)),a===n?(W=t,t=n):(G=t,r=Dt(i),t=r))}else W=t,t=n;return K--,t===n&&(r=n,K===0&&J(xt)),t}function Kn(){var t,r,i,a,o,s;if(K++,t=W,e.substr(W,2)===kt?(r=kt,W+=2):(r=n,K===0&&J(At)),r!==n){for(i=[],a=W,o=W,K++,jt.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(Mt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Ze(s),a=o));a!==n;)i.push(a),a=W,o=W,K++,jt.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(Mt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Ze(s),a=o));i===n?(W=t,t=n):(jt.test(e.charAt(W))?(a=e.charAt(W),W++):(a=n,K===0&&J(Mt)),a===n&&(a=null),a===n?(W=t,t=n):(G=t,r=Nt(i),t=r))}else W=t,t=n;return K--,t===n&&(r=n,K===0&&J(Ot)),t}function qn(){var t,r,i,a,o,s;if(K++,t=W,e.charCodeAt(W)===35?(r=Ft,W++):(r=n,K===0&&J(It)),r!==n){for(i=[],a=W,o=W,K++,jt.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(Mt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Ze(s),a=o));a!==n;)i.push(a),a=W,o=W,K++,jt.test(e.charAt(W))?(s=e.charAt(W),W++):(s=n,K===0&&J(Mt)),K--,s===n?o=void 0:(W=o,o=n),o===n?(W=a,a=n):(e.length>W?(s=e.charAt(W),W++):(s=n,K===0&&J(Xe)),s===n?(W=a,a=n):(G=a,o=Ze(s),a=o));i===n?(W=t,t=n):(jt.test(e.charAt(W))?(a=e.charAt(W),W++):(a=n,K===0&&J(Mt)),a===n&&(a=null),a===n?(W=t,t=n):(G=t,r=Nt(i),t=r))}else W=t,t=n;return K--,t===n&&(r=n,K===0&&J(Pt)),t}function Y(){var e,t;for(K++,e=[],t=Yn(),t===n&&(t=Wn());t!==n;)e.push(t),t=Yn(),t===n&&(t=Wn());return K--,e===n&&(t=n,K===0&&J(Lt)),e}function Jn(){var t=[],r;if(Rt.test(e.charAt(W))?(r=e.charAt(W),W++):(r=n,K===0&&J(zt)),r!==n)for(;r!==n;)t.push(r),Rt.test(e.charAt(W))?(r=e.charAt(W),W++):(r=n,K===0&&J(zt));else t=n;return t}function Yn(){var t=[],r;if(Bt.test(e.charAt(W))?(r=e.charAt(W),W++):(r=n,K===0&&J(Vt)),r===n&&(r=Jn()),r!==n)for(;r!==n;)t.push(r),Bt.test(e.charAt(W))?(r=e.charAt(W),W++):(r=n,K===0&&J(Vt)),r===n&&(r=Jn());else t=n;return t}function Xn(){var e=tr();return e===n&&(e=Zn(),e===n&&(e=er(),e===n&&(e=Qn(),e===n&&(e=$n(),e===n&&(e=nr()))))),e}function Zn(){var t;return Ht.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Ut)),t}function Qn(){var t;return U.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Wt)),t}function $n(){var t;return Gt.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Kt)),t}function er(){var t;return qt.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Jt)),t}function tr(){var t;return Yt.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Xt)),t}function nr(){var t;return Zt.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(Qt)),t}function rr(){var t;return $t.test(e.charAt(W))?(t=e.charAt(W),W++):(t=n,K===0&&J(en)),t}if(an=a(),an!==n&&W===e.length)return an;throw an!==n&&W<e.length&&J(ln()),pn(rn,nn<e.length?e.charAt(nn):null,nn<e.length?fn(nn,nn+1):fn(nn,nn))}t.exports={SyntaxError:r,parse:i}})),af=o(((e,t)=>{t.exports=rf().parse})),of=o(((e,t)=>{t.exports=r;var n=Hu();function r(e){if(e||={},`uniqueLinkId`in e&&(console.warn("ngraph.graph: Starting from version 0.14 `uniqueLinkId` is deprecated.\nUse `multigraph` option instead\n",`
`,`Note: there is also change in default behavior: From now on each graph
is considered to be not a multigraph by default (each edge is unique).`),e.multigraph=e.uniqueLinkId),e.multigraph===void 0&&(e.multigraph=!1),typeof Map!=`function`)throw Error("ngraph.graph requires `Map` to be defined. Please polyfill it before using ngraph");var t=new Map,r=[],l={},u=0,d=e.multigraph?E:T,f=[],p=F,m=F,h=F,g=F,_={addNode:x,addLink:w,removeLink:A,removeNode:C,getNode:S,getNodeCount:D,getLinkCount:O,getLinksCount:O,getNodesCount:D,getLinks:k,forEachNode:L,forEachLinkedNode:N,forEachLink:M,beginUpdate:h,endUpdate:g,clear:ee,hasLink:j,hasNode:S,getLink:j};return n(_),v(),_;function v(){var e=_.on;_.on=t;function t(){return _.beginUpdate=h=I,_.endUpdate=g=ne,p=y,m=b,_.on=e,e.apply(_,arguments)}}function y(e,t){f.push({link:e,changeType:t})}function b(e,t){f.push({node:e,changeType:t})}function x(e,n){if(e===void 0)throw Error(`Invalid node identifier`);h();var r=S(e);return r?(r.data=n,m(r,`update`)):(r=new a(e,n),m(r,`add`)),t.set(e,r),g(),r}function S(e){return t.get(e)}function C(e){var n=S(e);if(!n)return!1;h();var r=n.links;if(r){n.links=null;for(var i=0;i<r.length;++i)A(r[i])}return t.delete(e),m(n,`remove`),g(),!0}function w(e,t,n){h();var i=S(e)||x(e),a=S(t)||x(t),s=d(e,t,n);return r.push(s),o(i,s),e!==t&&o(a,s),p(s,`add`),g(),s}function T(e,t,n){return new s(e,t,n,c(e,t))}function E(e,t,n){var r=c(e,t),i=l.hasOwnProperty(r);if(i||j(e,t)){i||(l[r]=0);var a=`@`+ ++l[r];r=c(e+a,t+a)}return new s(e,t,n,r)}function D(){return t.size}function O(){return r.length}function k(e){var t=S(e);return t?t.links:null}function A(e){if(!e)return!1;var t=i(e,r);if(t<0)return!1;h(),r.splice(t,1);var n=S(e.fromId),a=S(e.toId);return n&&(t=i(e,n.links),t>=0&&n.links.splice(t,1)),a&&(t=i(e,a.links),t>=0&&a.links.splice(t,1)),p(e,`remove`),g(),!0}function j(e,t){var n=S(e),r;if(!n||!n.links)return null;for(r=0;r<n.links.length;++r){var i=n.links[r];if(i.fromId===e&&i.toId===t)return i}return null}function ee(){h(),L(function(e){C(e.id)}),g()}function M(e){var t,n;if(typeof e==`function`)for(t=0,n=r.length;t<n;++t)e(r[t])}function N(e,t,n){var r=S(e);if(r&&r.links&&typeof t==`function`)return n?te(r.links,e,t):P(r.links,e,t)}function P(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a],s=o.fromId===n?o.toId:o.fromId;if(i=r(t.get(s),o),i)return!0}}function te(e,n,r){for(var i,a=0;a<e.length;++a){var o=e[a];if(o.fromId===n&&(i=r(t.get(o.toId),o),i))return!0}}function F(){}function I(){u+=1}function ne(){--u,u===0&&f.length>0&&(_.fire(`changed`,f),f.length=0)}function L(e){if(typeof e!=`function`)throw Error(`Function is expected to iterate over graph nodes. You passed `+e);for(var n=t.values(),r=n.next();!r.done;){if(e(r.value))return!0;r=n.next()}}}function i(e,t){if(!t)return-1;if(t.indexOf)return t.indexOf(e);for(var n=t.length,r=0;r<n;r+=1)if(t[r]===e)return r;return-1}function a(e,t){this.id=e,this.links=null,this.data=t}function o(e,t){e.links?e.links.push(t):e.links=[t]}function s(e,t,n,r){this.fromId=e,this.toId=t,this.data=n,this.id=r}function c(e,t){return e.toString()+`👉 `+t.toString()}})),sf=o(((e,t)=>{t.exports=r;var n=af();function r(e,t){var r=n(e);if(r.length>1&&t!==void 0)throw Error("Dot file contains multiple graphs. Cannot use `saveTo` in this case");return t||=of()(),i(t,r[0])}function i(e,t){return a(e,t),e}function a(e,t){var n=t.children;if(!n)return e;for(var r=[],i=0;i<n.length;++i){var l=n[i];l.type===`edge_stmt`?c(r,o(e,l)):l.type===`node_stmt`?c(r,s(e,l)):l.type===`subgraph`&&c(r,a(e,l))}return r}function o(e,t){var n=t.edge_list;if(n.length!==0){var r=n[0],i=[],a=l(e,r);c(i,a);for(var o=d(t.attr_list),s=1;s<n.length;++s){var f=l(e,n[s]);c(i,f),u(e,a,f,o),a=f}return i}}function s(e,t){return l(e,t.node_id,t.attr_list)}function c(e,t){for(var n=0;n<t.length;++n)e.push(t[n]);return e}function l(e,t,n){if(t.type===`node_id`){var r=f(d(n),e.getNode(t.id));return r?e.addNode(t.id,r):e.addNode(t.id),[t.id]}if(t.type===`subgraph`)return a(e,t)}function u(e,t,n,r){for(var i=0;i<t.length;++i)for(var a=0;a<n.length;++a)e.addLink(t[i],n[a],r)}function d(e){if(e&&e.length){for(var t=Object.create(null),n=0;n<e.length;++n){var r=e[n];r.type===`attr`&&r.id!==void 0&&(t[r.id]=r.eq)}return t}}function f(e,t){return!t||!t.data?e:Object.assign(t.data,e)}})),cf=o(((e,t)=>{t.exports=r;var n=Gu();function r(e,t,r,a){var o;t||=i,r||=i,o=typeof e==`string`?JSON.parse(e):e;var s=n(a),c;if(o.links===void 0||o.nodes===void 0)throw Error(`Cannot load graph without links and nodes`);for(c=0;c<o.nodes.length;++c){var l=t(o.nodes[c]);if(!l.hasOwnProperty(`id`))throw Error(`Graph node format is invalid: Node id is missing`);s.addNode(l.id,l.data)}for(c=0;c<o.links.length;++c){var u=r(o.links[c]);if(!u.hasOwnProperty(`fromId`)||!u.hasOwnProperty(`toId`))throw Error(`Graph link format is invalid. Both fromId and toId are required`);s.addLink(u.fromId,u.toId,u.data)}return s}function i(e){return e}})),lf=c(sf(),1),uf=c(cf(),1);function df(e){let t=e[0];var n=new FileReader;n.readAsText(t,`UTF-8`),n.onload=e=>{let t=e.target.result,n=r(t)||i(t);n&&bl.fire(`load-graph`,n)},n.onerror=e=>{console.log(`error loading dot file: `,e)};function r(e){try{return(0,lf.default)(e)}catch(e){console.log(`error loading dot file: `,e)}}function i(e){try{return(0,uf.default)(JSON.parse(e))}catch(e){console.log(`error loading JSON: `,e)}}}Fo(tf).mount(`#app`),nf(document.body,df);