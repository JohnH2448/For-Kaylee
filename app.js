// Password matching ignores case and outer spaces.
const VAULT_PASSWORD = 'prettygirl';
const INNER_PASSWORD = 'india';
const SECRET_WORD = 'doe eyes';

const stages = [
  {name:'Oodbilav',title:'Pehle, oodbilav.',text:'Tumhare liye ek chhota sa tohfa banaya hai. Yahin se shuru karo.',task:'',location:'Nadi ke kinaare oodbilav',caption:''},
  {name:'Gaayein',title:'Aur kuch gaayein.',text:'Bas apne maidaan mein aaraam kar rahi hain.',task:'',location:'Maidaan mein gaayein',caption:''},
  {name:'Golden retriever',title:'Yeh pyaara sa kutta.',text:'Ise tumse kuch kehna hai.',task:'',location:'Bageeche mein ek golden retriever',caption:''},
  {name:'Buddhi ke baal',title:'Kuch meetha.',text:'Mere liye is uljhan ko suljhao.',task:'',location:'Buddhi ke baal jaise baadal',caption:''},
  {name:'Vault',title:'Almost there, Kaylee.',text:'I left something in here for you.',task:'',location:'Two nested vaults',caption:''}
];
const puzzles = [
  {answer:'current', code:'FXUUHQW', note:'Angrezi varnamaala ka har akshar dhaara ke saath teen jagah aage beh gaya. Dhaara ke ulte padho.'},
  {answer:'clover', code:'00011 01100 01111 10110 00101 10010', note:'Baad par chhe nishaan, har ek par paanch battiyan. 16 · 8 · 4 · 2 · 1. Jalti batti = 1. A = 1, Z = 26.'},
  {answer:'fetch', code:'..-. / . / - / -.-. / ....', note:'Uske gale ki takhti par: chhoti bhaunk = bindu (.), lambi bhaunk = lakeer (-). Har / se naya akshar shuru hota hai. Kya hukm hai?'},
  {answer:'sweetness', code:`S E T E S
 W E N S`, note:'Mithaai ki do pattiyan. Baayin taraf se shuru karo: ek upar se, ek neeche se.'}
];
function devilSentences(text){
 return text.replace(/[^.!?…]+[.!?…]+(?=\s|$)/g,sentence=>{
  let hash=0;for(const char of sentence.trim())hash=(hash+char.codePointAt(0))%4;
  return sentence+(hash?' '+ '😈'.repeat(hash):'');
 });
}
function decorateSentences(root){
 const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
 const nodes=[];while(walker.nextNode())nodes.push(walker.currentNode);
 for(const node of nodes){
  if(node.parentElement.closest('script,style,pre,input,textarea,#vault-word'))continue;
  // Mark original strings so rerenders and observer callbacks never duplicate emojis.
  if(node._devilOutput===node.nodeValue)continue;
  const output=devilSentences(node.nodeValue);
  node._devilOutput=output;
  if(output!==node.nodeValue)node.nodeValue=output;
 }
}
const fresh=()=>({stage:0,done:[false,false,false,false],found:[[],[],[],[]],vault:0});
let progress=fresh();
let opening=false;
let openingTimer;
try{const saved=JSON.parse(sessionStorage.getItem('long-way-home-v2'));if(saved&&Array.isArray(saved.done)&&saved.done.length===4){const unlocked=saved.done.findIndex(x=>x!==true);progress={...fresh(),stage:Math.max(0,Math.min(Math.floor(Number(saved.stage)||0),unlocked<0?4:unlocked)),done:saved.done.map(x=>x===true),vault:unlocked<0&&[0,1,2].includes(saved.vault)?saved.vault:0};}}catch{}
const $=id=>document.getElementById(id);
const save=()=>{try{sessionStorage.setItem('long-way-home-v2',JSON.stringify(progress));}catch{}};
const svg=(body)=>`<svg viewBox="0 0 600 440" xmlns="http://www.w3.org/2000/svg" aria-label="${stages[progress.stage].location}" role="group"><defs><pattern id="grain" width="9" height="9" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".6" fill="#253d36" opacity=".10"/></pattern></defs>${body}<rect width="600" height="440" fill="url(#grain)" pointer-events="none"/></svg>`;
const plant=(x,y)=>`<g transform="translate(${x} ${y})" stroke="#5a7151" fill="none" stroke-width="3"><path d="M0 0Q-12-45-28-62M0 0Q3-60 16-84M0 0Q20-35 35-43"/><path d="M-16-39q-30 4-24-22q26 1 24 22M10-55q24-3 19-24q-20 4-19 24" fill="#738963"/></g>`;
const hit=(id,label,body)=>`<g>${body}</g>`;
const otter=(x,y,angle)=>`<g transform="translate(${x} ${y}) rotate(${angle})"><path d="M0 52q-70 48-84 8q36 15 60-30" fill="#755944"/><ellipse cy="20" rx="36" ry="67" fill="#82644c"/><ellipse cy="20" rx="23" ry="44" fill="#b49a76"/><circle cx="-24" cy="-42" r="11" fill="#71543f"/><circle cx="24" cy="-42" r="11" fill="#71543f"/><ellipse cy="-35" rx="34" ry="29" fill="#8e7055"/><ellipse cy="-26" rx="22" ry="15" fill="#d8c3a0"/><circle cx="-12" cy="-40" r="3" fill="#29382f"/><circle cx="12" cy="-40" r="3" fill="#29382f"/><path d="M-5-29L5-29L0-23Z" fill="#29382f"/><path d="M-19-24l-23-5m23 11l-24 3m62-9l23-5m-23 11l24 3" stroke="#e6d7b8"/><ellipse cx="-29" cy="16" rx="11" ry="22" fill="#755944" transform="rotate(-25)"/><ellipse cx="29" cy="16" rx="11" ry="22" fill="#755944" transform="rotate(25)"/></g>`;
const cow=(x,y,s)=>`<g transform="translate(${x} ${y}) scale(${s})"><path d="M-45 12v53m26-43v45m57-49v47m18-52v50" stroke="#eee9d6" stroke-width="13"/><path d="M-49-8q-30 0-24 40" fill="none" stroke="#3b463a" stroke-width="5"/><rect x="-58" y="-28" width="116" height="67" rx="29" fill="#f6f0dd"/><path d="M-43-25q48-10 37 31q-16 27-40 6M20-22q32-9 34 23q-30 13-34-23" fill="#39473b"/><path d="M42-23l-13-15m46 15l14-15" stroke="#b09b71" stroke-width="5"/><ellipse cx="59" cy="-2" rx="24" ry="32" fill="#f6f0dd"/><ellipse cx="37" cy="-20" rx="14" ry="7" fill="#39473b"/><ellipse cx="81" cy="-20" rx="14" ry="7" fill="#39473b"/><ellipse cx="60" cy="15" rx="22" ry="12" fill="#c8a998"/><circle cx="50" cy="-5" r="3" fill="#29372c"/><circle cx="68" cy="-5" r="3" fill="#29372c"/></g>`;
function scene(){switch(progress.stage){case 0:return svg(`<circle cx="464" cy="79" r="43" fill="#f1e8c9"/><path d="M0 120Q140 62 277 126T600 99V440H0Z" fill="#9aa990"/><path d="M0 192Q150 110 298 180T600 146V440H0Z" fill="#b8cbc0"/><path d="M0 260Q159 162 312 231T600 193V440H0Z" fill="#87ada5"/><g fill="none" stroke="#d9e5d4" stroke-width="2" opacity=".65"><path d="M86 277h78m-14 55h110m92-137h94M324 361h130M27 378h95M468 294h92"/></g><path d="M0 316Q90 277 126 440H0M600 270Q508 332 490 440H600" fill="#728b67"/>${plant(40,390)}${plant(555,390)}${otter(247,259,-28)}${otter(382,271,22)}${hit('stone1','Collect the stone by the reeds','<ellipse cx="89" cy="350" rx="23" ry="13" fill="#e5dfc7"/><path d="M77 346l18 3" stroke="#b7b49c"/>')}${hit('stone2','Collect the stone near the otters','<ellipse cx="302" cy="370" rx="24" ry="13" fill="#e5dfc7"/><path d="M293 366l17 3" stroke="#b7b49c"/>')}${hit('stone3','Collect the stone on the right bank','<ellipse cx="530" cy="315" rx="22" ry="13" fill="#e5dfc7"/><path d="M520 311l18 4" stroke="#b7b49c"/>')}`);
case 1:return svg(`<rect width="600" height="440" fill="#dce5d8"/><circle cx="440" cy="75" r="38" fill="#f6ebc9"/><path d="M0 197Q155 35 356 172T600 138V440H0" fill="#a4b18a"/><path d="M0 241Q229 120 600 218V440H0" fill="#839970"/><path d="M0 330Q291 219 600 290V440H0" fill="#6b845c"/><path d="M0 191l600 80M0 214l600 80" stroke="#d6cfad" stroke-width="5"/>${[30,110,190,270,350,430,510,590].map(x=>`<path d="M${x} ${175+x*.133}v65" stroke="#d6cfad" stroke-width="6"/>`).join('')}${cow(359,168,.54)}${cow(157,300,1.05)}${cow(423,337,1.12)}${plant(39,419)}<g fill="#e9dbad">${[70,280,330,540,250,490,90].map((x,i)=>`<circle cx="${x}" cy="${380+i%3*17}" r="3"/>`).join('')}</g>`);
case 2:return svg(`<circle cx="133" cy="88" r="49" fill="#e9dbab"/><path d="M0 224Q240 122 600 218V440H0" fill="#9ca97d"/><path d="M0 320Q300 202 600 319V440H0" fill="#809368"/><path d="M140 440Q330 302 600 376" fill="none" stroke="#c5bf95" stroke-width="63"/>${plant(65,338)}${plant(531,297)}<g transform="translate(305 265)"><path d="M46 50q100-10 87-75q-17 33-81 38" fill="#bc8946"/><ellipse cy="50" rx="63" ry="71" fill="#c99750"/><path d="M-30 34l-7 92m67-92l9 92" stroke="#e2b76f" stroke-width="25" stroke-linecap="round"/><path d="M-22 15Q0 100 29 15" fill="#efcf91"/><ellipse cy="-32" rx="54" ry="57" fill="#dfb36d"/><ellipse cx="-49" cy="-20" rx="18" ry="43" fill="#b77f3d" transform="rotate(12)"/><ellipse cx="49" cy="-20" rx="18" ry="43" fill="#b77f3d" transform="rotate(-12)"/><ellipse cy="-10" rx="30" ry="25" fill="#efcf91"/><circle cx="-21" cy="-39" r="5" fill="#3f3a2b"/><circle cx="21" cy="-39" r="5" fill="#3f3a2b"/><path d="M-10-20q10-7 20 0L0-8Z" fill="#3f3a2b"/><path d="M-13 1q13 14 26 0" stroke="#775331" fill="none" stroke-width="3"/><path d="M-6 7q0 26 12 0" fill="#c78175"/><path d="M-37 22q37 17 74 0" fill="none" stroke="#697e71" stroke-width="9"/><circle cy="33" r="8" fill="#e7d49a"/></g>${plant(492,423)}<g fill="#e5ddc0"><circle cx="462" cy="361" r="10"/><circle cx="508" cy="351" r="9"/><circle cx="532" cy="387" r="10"/></g>${hit('ball','Pick up the tennis ball','<circle cx="456" cy="399" r="19" fill="#d3db77"/><path d="M444 385q23 13 7 31" stroke="#f8f1c9" stroke-width="3" fill="none"/>')}`);
case 3:return svg(`<circle cx="300" cy="170" r="134" fill="#f3e9e5" opacity=".75"/><path d="M0 374Q100 317 220 374T600 346V440H0" fill="#cab8d1"/><path d="M0 409Q140 361 297 405T600 390V440H0" fill="#b4a8c6"/><g stroke="#f7eef2" stroke-width="2"><path d="M80 116v14m-7-7h14M506 99v14m-7-7h14M338 51v14m-7-7h14M360 304v14m-7-7h14"/></g>${[[157,198,'#dba8bd'],[333,124,'#b6cbdc'],[443,260,'#e4bdcd']].map(([x,y,c],i)=>hit('cloud'+i,['Gather the pink cotton candy','Gather the blue cotton candy','Gather the rose cotton candy'][i],`<g class="float" style="animation-delay:-${i}s" transform="translate(0 0)"><path d="M${x-22} ${y+23}l22 87l22-87" fill="#f2e2bd"/><path d="M${x-13} ${y+49}l28 7m-22 14l17 4" stroke="#c7b38b"/><g fill="${c}"><circle cx="${x}" cy="${y-10}" r="48"/><circle cx="${x-35}" cy="${y+4}" r="31"/><circle cx="${x+35}" cy="${y+4}" r="31"/><circle cx="${x}" cy="${y+25}" r="35"/></g><path d="M${x-27} ${y-25}q19-22 39-8" fill="none" stroke="#fff" opacity=".4" stroke-width="4" stroke-linecap="round"/></g>`)).join('')}`);
default:return vaultScene();}}
function door(size){return `<div class="vault-door ${size}-door" aria-hidden="true"><div class="door-rim"><div class="wheel"><i></i><i></i><i></i><span></span></div><span class="door-plate">${size==='outer'?'FOR KAYLEE':'JUST FOR YOU'}</span></div></div>`;}
function vaultScene(){return `<div class="vault-stage ${progress.vault>=1?'outer-open':''} ${progress.vault===2?'inner-open':''}" id="vault-stage"><div class="vault-case"><div class="vault-cavity"><div class="inner-case"><div id="vault-word" class="vault-word" role="status"></div>${door('inner')}</div></div>${door('outer')}</div></div>`;}
function revealVaultContents(){
 const word=document.createElement('span');word.textContent=SECRET_WORD;
 const link=document.createElement('a');link.href='https://litedevtools.com/vigenere-cipher/';link.textContent='Vigenère cipher';link.target='_blank';link.rel='noopener noreferrer';
 $('vault-word').replaceChildren(word,link);
}
function vaultControls(){
 if(progress.vault===2){$('controls').replaceChildren();$('instruction').textContent='';$('caption').textContent='';return;}
 $('instruction').textContent=progress.vault===1?'One more password.':stages[4].task;
 $('controls').innerHTML=`<form id="vault-form"><label for="password">${progress.vault===1?'Inner':'Outer'} vault password</label><input id="password" type="password" autocomplete="off" required aria-describedby="feedback" placeholder="Password"><button class="primary" type="submit">Unlock ${progress.vault===1?'inner':'outer'} vault <span>↗</span></button></form>`;
}
function puzzleControls(){const p=puzzles[progress.stage];return `<div class="cipher-note"><p>${p.note}</p><pre aria-label="Gupt sandesh" lang="en">${p.code}</pre></div><form id="puzzle-form"><label for="answer">Tumhara jawaab (Angrezi mein)</label><input id="answer" autocomplete="off" spellcheck="false" required aria-describedby="feedback" ${progress.done[progress.stage]?'disabled':''}><button class="primary" type="submit" ${progress.done[progress.stage]?'disabled':''}>Jaancho <span>↗</span></button></form>`;}
function setPageLanguage(){
 const vault=progress.stage===4;
 document.documentElement.lang=vault?'en':'hi-Latn';
 document.title=vault?'For Kaylee':'Kaylee ke liye';
 $('letter-greeting').textContent=vault?'Dear Kaylee,':'Pyaari Kaylee,';
 $('letter-signoff').textContent=vault?'for you.':'tumhare liye.';
 $('trail').setAttribute('aria-label',vault?'Pages of your letter':'Tumhari chitthi ke panne');
 $('restart').textContent=vault?'Start over ↺':'Phir se shuru karo ↺';
 $('reset-title').textContent=vault?'Start again?':'Phir se shuru karein?';
 $('reset-copy').textContent=vault?'This clears your answers and closes both vaults.':'Isse tumhare jawaab mit jaayenge aur dono tijoriyaan band ho jaayengi.';
 $('cancel-reset').textContent=vault?'Stay here':'Yahin raho';
 $('confirm-reset').textContent=vault?'Start again':'Phir se shuru karo';
}
function render(focus=false){const s=stages[progress.stage];setPageLanguage();document.body.className=progress.stage===4?'vault':progress.stage===3?'candy':'';$('eyebrow').textContent='';$('title').innerHTML=s.title;$('description').textContent=s.text;$('instruction').textContent=s.task;$('location').textContent=s.location;$('scene-number').textContent=`0${progress.stage+1}`;$('caption').textContent=s.caption;$('scene').innerHTML=scene();$('feedback').textContent='';$('next').hidden=!progress.done[progress.stage];$('controls').innerHTML=progress.stage<4?puzzleControls():'';if(progress.stage===4){vaultControls();if(progress.vault===2)revealVaultContents();}
 $('trail').innerHTML=stages.map((s,i)=>`<button data-stage="${i}" ${i>0&&!progress.done.slice(0,i).every(Boolean)?'disabled':''} ${i===progress.stage?'aria-current="step"':''}><span class="step-number">${progress.done[i]?'✓':String(i+1).padStart(2,'0')}</span><span class="step-label">${progress.stage===4?['Otters','Cows','Golden retriever','Cotton candy','Vault'][i]:(i===4?'Tijori':s.name)}</span></button>`).join('');
 if(progress.done[progress.stage])$('feedback').textContent='Bilkul sahi.';

 $('scene').classList.remove('appear');void $('scene').offsetWidth;$('scene').classList.add('appear');save();if(focus)$('title').focus();}
function complete(){progress.done[progress.stage]=true;save();$('next').hidden=false;$('feedback').textContent='Bilkul sahi.';$('answer').disabled=true;$('puzzle-form').querySelector('button').disabled=true;}
document.addEventListener('click',e=>{const nav=e.target.closest('[data-stage]');if(nav&&!nav.disabled&&!opening){const target=Number(nav.dataset.stage);if(progress.done.slice(0,target).every(Boolean)){progress.stage=target;render(true);}}});
$('next').addEventListener('click',()=>{if(progress.done[progress.stage]&&progress.stage<4){progress.stage++;render(true);}});

function unlockVault(){
 const level=progress.vault;
 if(opening||level>=2||progress.stage!==4||!progress.done.every(Boolean))return;
 if($('password').value.trim().toLowerCase()!==(level===0?VAULT_PASSWORD:INNER_PASSWORD)){$('feedback').textContent='Not quite. Try again.';$('password').setAttribute('aria-invalid','true');$('password').focus();return;}
 opening=true;$('password').disabled=true;$('vault-form').querySelector('button').disabled=true;$('feedback').textContent='Opening…';
 const stage=$('vault-stage');stage.classList.add(level===0?'outer-opening':'inner-opening');
 if(level===1)revealVaultContents();
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 openingTimer=setTimeout(()=>{
  progress.vault=level+1;save();stage.classList.add(level===0?'outer-open':'inner-open');stage.classList.remove(level===0?'outer-opening':'inner-opening');opening=false;vaultControls();
  $('feedback').textContent=level===0?'A little one inside.':'';
  if(level===0)$('password').focus();
 },reduced?0:1800);
}
document.addEventListener('submit',e=>{if(e.target.id==='puzzle-form'){e.preventDefault();if(progress.stage>=4)return;const answer=$('answer');if(answer.value.trim().toLowerCase()===puzzles[progress.stage].answer){answer.removeAttribute('aria-invalid');complete();}else{$('feedback').textContent='Abhi sahi nahin. Ek baar phir dekho.';answer.setAttribute('aria-invalid','true');answer.focus();}}else if(e.target.id==='vault-form'){e.preventDefault();unlockVault();}});
$('restart').addEventListener('click',()=>$('reset-dialog').showModal());$('cancel-reset').addEventListener('click',()=>$('reset-dialog').close());$('confirm-reset').addEventListener('click',()=>{clearTimeout(openingTimer);opening=false;progress=fresh();$('reset-dialog').close();render(true);});render();

// Observe dynamic feedback, stage changes, and dialog copy as well as initial text.
decorateSentences(document.body);
new MutationObserver(()=>decorateSentences(document.body)).observe(document.body,{subtree:true,childList:true,characterData:true});
