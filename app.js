var names=['Surveyor A','Surveyor B','Surveyor C','Surveyor D','Surveyor E'];
var seed=11;function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
var today=new Date();today.setHours(0,0,0,0);
var files=[],n=0;
for(var i=0;i<190;i++){var d=new Date(today);d.setDate(d.getDate()-i);var w=d.getDay();if(w===0||w===6)continue;
 for(var s=0;s<names.length;s++){var c=Math.floor(rnd()*(s===4?2:3.4));for(var k=0;k<c;k++){n++;files.push({d:d,s:s,name:'Job_'+String(n).padStart(3,'0')+'.jxl'})}}}
var MON=['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
var period='day',who='all';
function day0(x){var y=new Date(x);y.setHours(0,0,0,0);return y}
function mon(x){var y=day0(x);y.setDate(y.getDate()-((y.getDay()+6)%7));return y}
function list(){return files.filter(function(f){return who==='all'||f.s===+who})}
function buckets(){var out=[],L=list(),i,b,start,end;
 if(period==='day'){for(i=13;i>=0;i--){start=new Date(today);start.setDate(start.getDate()-i);end=new Date(start);end.setDate(end.getDate()+1);out.push({l:start.getDate()+' '+MON[start.getMonth()],a:start,b:end})}}
 else if(period==='week'){var m=mon(today);for(i=11;i>=0;i--){start=new Date(m);start.setDate(start.getDate()-7*i);end=new Date(start);end.setDate(end.getDate()+7);out.push({l:'Wk '+start.getDate()+' '+MON[start.getMonth()],a:start,b:end})}}
 else{for(i=5;i>=0;i--){start=new Date(today.getFullYear(),today.getMonth()-i,1);end=new Date(today.getFullYear(),today.getMonth()-i+1,1);out.push({l:MON[start.getMonth()]+' '+start.getFullYear(),a:start,b:end})}}
 out.forEach(function(o){o.v=L.filter(function(f){return f.d>=o.a&&f.d<o.b}).length});return out}
function draw(){var b=buckets(),mx=Math.max(1,Math.max.apply(null,b.map(function(o){return o.v})));
 document.getElementById('chart').innerHTML=b.map(function(o){return '<div class="col"><em>'+o.v+'</em><i data-h="'+Math.round(o.v/mx*100)+'"></i></div>'}).join('');
 [].forEach.call(document.querySelectorAll('#chart i'),function(el){el.style.height=el.getAttribute('data-h')+'%'});
 document.getElementById('labels').innerHTML=b.map(function(o){return '<div><span>'+o.l+'</span></div>'}).join('');
 document.getElementById('cap').textContent={day:'Last 14 days',week:'Last 12 weeks',month:'Last 6 months'}[period]+' · '+(who==='all'?'all surveyors':names[+who]);}
function since(days,s){var a=new Date(today);a.setDate(a.getDate()-days+1);return files.filter(function(f){return f.d>=a&&(s===undefined||f.s===s)}).length}
function stats(){
 document.getElementById('kToday').textContent=since(1);document.getElementById('kWeek').textContent=since(7);document.getElementById('kMonth').textContent=since(30);
 var act=names.filter(function(_,s){return since(30,s)>0}).length;document.getElementById('kActive').textContent=act;
 document.getElementById('tbody').innerHTML=names.map(function(nm,s){return '<tr><td>'+nm+'</td><td>'+since(1,s)+'</td><td>'+since(7,s)+'</td><td>'+since(30,s)+'</td></tr>'}).join('')+'<tr><td><b>Total</b></td><td><b>'+since(1)+'</b></td><td><b>'+since(7)+'</b></td><td><b>'+since(30)+'</b></td></tr>';
 document.getElementById('recent').innerHTML=files.slice(0,6).map(function(f){return '<li><span>'+f.name+' <small>· '+names[f.s]+'</small></span><small>'+f.d.getDate()+' '+MON[f.d.getMonth()]+'</small></li>'}).join('');
 document.getElementById('mail').textContent='Today’s summary: '+since(1)+' job file'+(since(1)===1?'':'s')+' uploaded by '+names.filter(function(_,s){return since(1,s)>0}).length+' surveyor(s), sent to the manager list with a dashboard link.';}
var sel=document.getElementById('sel');sel.innerHTML='<option value="all">All surveyors</option>'+names.map(function(x,i){return '<option value="'+i+'">'+x+'</option>'}).join('');
sel.onchange=function(){who=sel.value;draw()};
document.getElementById('seg').onclick=function(e){var p=e.target.getAttribute('data-p');if(!p)return;period=p;[].forEach.call(this.children,function(b){b.className=b.getAttribute('data-p')===p?'on':''});draw()};
stats();draw();

/* Trimble Connect project extension: runs only when embedded inside Trimble Connect */
(function(){
  if(window.parent===window||!window.TrimbleConnectWorkspace)return;
  TrimbleConnectWorkspace.connect(window.parent,function(){},30000).then(function(API){
    API.ui.setMenu({title:'Upload Monitor',icon:new URL('icon.png',location.href).href,command:'sbd_home'});
    API.ui.setActiveMenuItem('sbd_home');
  }).catch(function(e){console.error('Trimble Connect link failed',e)});
})();
