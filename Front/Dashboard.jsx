// ════════════ DASHBOARD ════════════
function Dashboard({onNav,onOpenRequest,onOpenInvestor}) {
  const r=DB.requests,inv=DB.investors,pipe=DB.pipeline,pl=DB.plots;
  const actInv=inv.filter(x=>x.status==="active").length;const prosInv=inv.filter(x=>x.status==="prospect").length;
  const pipeAct=pipe.filter(p=>!["won","lost"].includes(p.stage));
  const pipeVal=pipeAct.reduce((s,p)=>s+p.value*p.prob/100,0);
  const plotAvail=pl.filter(p=>p.status==="available").length;
  const totArea=pl.reduce((s,p)=>s+p.area,0);const allArea=pl.filter(p=>["allocated","reserved"].includes(p.status)).reduce((s,p)=>s+p.area,0);
  const overdue=DB.invoices.filter(i=>i.status==="overdue");const overTot=overdue.reduce((s,i)=>s+i.amount,0);
  const needAction=r.filter(x=>["new","in_review"].includes(x.status));
  const secData=useMemo(()=>{const s={};inv.filter(i=>i.status==="active").forEach(i=>{s[i.sector]=(s[i.sector]||0)+1});return Object.entries(s).map(([k,v],i)=>({name:k,value:v,fill:CC[i%CC.length]}));},[]);
  const deptData=useMemo(()=>{const s={};r.forEach(q=>{if(!["completed","rejected"].includes(q.status)){s[q.dept]=(s[q.dept]||0)+1;}});return Object.entries(DEPT).map(([k,v])=>({dept:k,label:v.l,icon:v.i,count:s[k]||0,color:v.c}));},[]);
  const occPct=totArea?Math.round(allArea/totArea*100):0;
  const kpiCard=(icon,label,value,sub,color,onClick,gold)=>(
    <div onClick={onClick} style={{...cd,padding:"16px 18px",borderTop:gold?`3px solid ${C.gold}`:"none",cursor:onClick?"pointer":"default",transition:"transform 0.15s, box-shadow 0.15s"}} onMouseEnter={e=>{if(onClick){e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.1)";}}} onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="0 1px 4px rgba(0,0,0,0.06)";}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><span style={{fontSize:20}}>{icon}</span><span style={{fontSize:11,color:C.muted,fontWeight:500}}>{label}</span></div>
      <div style={{fontSize:24,fontWeight:800,color:color||C.text}}>{value}</div>
      {sub&&<div style={{fontSize:10,color:C.light,marginTop:3}}>{sub}</div>}
      {onClick&&<div style={{fontSize:9,color:C.gold,marginTop:4,fontWeight:600}}>اضغط للتفاصيل ←</div>}
    </div>
  );
  return (
    <div>
      {/* Welcome Banner */}
      <div style={{background:`linear-gradient(135deg,${C.greenDark},${C.green})`,borderRadius:12,padding:"22px 28px",marginBottom:22,display:"flex",alignItems:"center",justifyContent:"space-between",position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",top:0,right:0,width:200,height:"100%",background:`${C.gold}08`,borderRadius:"0 12px 12px 0"}}/>
        <div style={{position:"absolute",bottom:-20,left:-20,width:80,height:80,borderRadius:"50%",background:"rgba(255,255,255,0.03)"}}/>
        <div>
          <h2 style={{color:"#fff",fontSize:19,fontWeight:800,margin:0}}>لوحة التحكم</h2>
          <p style={{color:C.gold,fontSize:13,margin:"4px 0 0",fontWeight:600}}>المدينة الصناعية في حسياء — محافظة حمص</p>
          <p style={{color:"rgba(255,255,255,0.5)",fontSize:11,margin:"2px 0 0"}}>{new Date().toLocaleDateString("ar-SY",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}</p>
        </div>
        <div style={{display:"flex",gap:20,position:"relative"}}>
          <div style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:800,color:C.gold}}>{actInv}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>مستثمر نشط</div></div>
          <div style={{width:1,height:44,background:"rgba(255,255,255,0.1)"}}/>
          <div style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:800,color:"#fff"}}>{occPct}%</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>إشغال</div></div>
          <div style={{width:1,height:44,background:"rgba(255,255,255,0.1)"}}/>
          <div style={{textAlign:"center"}}><div style={{fontSize:30,fontWeight:800,color:overdue.length>0?"#fca5a5":"#86efac"}}>{overdue.length}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>فاتورة متأخرة</div></div>
        </div>
      </div>

      {/* KPI Cards — all clickable */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(175px,1fr))",gap:12,marginBottom:22}}>
        {kpiCard("📨","الطلبات",r.length,needAction.length+" تحتاج إجراء",C.green,()=>onNav("requests"),true)}
        {kpiCard("🏢","المستثمرون",actInv+"+"+prosInv,actInv+" نشط، "+prosInv+" محتمل",C.green,()=>onNav("investors"))}
        {kpiCard("📈","فرص الاستثمار",pipeAct.length,fmtSYP(pipeVal)+" ل.س متوقع","#7c3aed",()=>onNav("pipeline"))}
        {kpiCard("🗺️","الأراضي",plotAvail+"/"+pl.length+" متاح",allArea.toLocaleString()+" م² مشغولة",C.green,()=>onNav("plots"))}
        {kpiCard("⚠️","فواتير متأخرة",overdue.length,fmtSYP(overTot)+" ل.س",C.danger,()=>onNav("invoices"))}
        {kpiCard("💰","المحصّل",fmtSYP(DB.invoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0))+" ل.س","من "+DB.invoices.filter(i=>i.status==="paid").length+" فاتورة",C.green,()=>onNav("invoices"),true)}
      </div>

      {/* Department workload + Sector breakdown */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:22}}>
        {/* Department Active Requests */}
        <div style={cd}>
          <h4 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px",display:"flex",alignItems:"center",gap:6}}>📊 حمولة العمل حسب القسم</h4>
          {deptData.map(d=>(
            <div key={d.dept} onClick={()=>onNav("requests")} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:12,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.background="#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
              <span style={{fontSize:18}}>{d.icon}</span>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}><span style={{fontSize:12,fontWeight:600}}>{d.label}</span><span style={{fontSize:13,fontWeight:800,color:d.count>0?d.color:C.light}}>{d.count}</span></div>
                <div style={{height:5,borderRadius:5,background:"#e8f0e8",overflow:"hidden"}}><div style={{height:"100%",borderRadius:5,background:d.color,width:`${Math.min(d.count*15,100)}%`,transition:"width 0.5s"}}/></div>
              </div>
            </div>
          ))}
        </div>
        {/* Sector Pie */}
        <div style={cd}>
          <h4 style={{fontSize:13,fontWeight:700,color:C.text,margin:"0 0 14px"}}>🏭 المستثمرون حسب القطاع</h4>
          {secData.map((s,i)=>{const pct=Math.round(s.value/actInv*100);return(
            <div key={i} onClick={()=>onNav("investors")} style={{padding:"8px 0",borderBottom:`1px solid ${C.border}`,display:"flex",alignItems:"center",gap:10,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.background="#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
              <div style={{width:10,height:10,borderRadius:3,background:s.fill,flexShrink:0}}/>
              <div style={{flex:1}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:600}}>{s.name}</span><span style={{fontSize:11,fontWeight:700,color:s.fill}}>{s.value} ({pct}%)</span></div>
                <div style={{height:4,borderRadius:4,background:"#e8f0e8",overflow:"hidden"}}><div style={{height:"100%",borderRadius:4,background:s.fill,width:`${pct}%`,opacity:0.7}}/></div>
              </div>
            </div>
          );})}
        </div>
      </div>

      {/* Overdue invoices alert */}
      {overdue.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"14px 18px",marginBottom:22,borderRight:`4px solid ${C.danger}`}}>
        <h4 style={{fontSize:13,fontWeight:700,color:C.danger,margin:"0 0 8px"}}>⚠️ فواتير متأخرة تحتاج متابعة ({overdue.length})</h4>
        {overdue.map(i=>(
          <div key={i.id} onClick={()=>onNav("invoices")} style={{padding:"6px 0",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:"1px solid #fecaca"}}>
            <div><span style={{fontSize:12,fontWeight:600,color:C.text}}>{i.company}</span><span style={{fontSize:10,color:C.muted,marginRight:8}}> • {i.num}</span></div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:12,fontWeight:700,color:C.danger}}>{fmtSYP(i.amount)} ل.س</span><span style={{fontSize:9,color:C.muted}}>منذ {i.due}</span></div>
          </div>
        ))}
      </div>}

      {/* Recent activity — two columns */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
        {/* Recent Requests — clickable */}
        <div style={cd}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h4 style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>📨 آخر الطلبات</h4><button onClick={()=>onNav("requests")} style={{fontSize:10,color:C.green,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:F}}>عرض الكل ←</button></div>
          {r.slice(0,5).map(q=>(
            <div key={q.id} onClick={()=>onOpenRequest?.(q.id)} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",transition:"background 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.background="#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.text}}>{q.title}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{q.company} • <span style={{fontFamily:"monospace",color:C.green,fontWeight:600}}>{q.ref}</span></div>
              </div>
              <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:3}}>
                <Bg map={ST} value={q.status}/>
                <Bg map={PR} value={q.priority}/>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Interactions — clickable */}
        <div style={cd}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}><h4 style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>💬 آخر التواصل</h4><button onClick={()=>onNav("interactions")} style={{fontSize:10,color:C.green,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:F}}>عرض الكل ←</button></div>
          {DB.interactions.slice(0,5).map(i=>{const invObj=DB.investors.find(x=>x.id===i.inv_id);return (
            <div key={i.id} onClick={()=>invObj&&onOpenInvestor?.(invObj)} style={{padding:"10px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:10,cursor:invObj?"pointer":"default",transition:"background 0.15s"}} onMouseEnter={e=>{if(invObj)e.currentTarget.style.background="#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}>
              <div style={{width:34,height:34,borderRadius:8,background:`${IT[i.type]?.c}12`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,flexShrink:0}}>{IT[i.type]?.i}</div>
              <div style={{flex:1}}>
                <div style={{fontSize:12,fontWeight:600,color:C.text}}>{i.subject}</div>
                <div style={{fontSize:10,color:C.muted,marginTop:2}}>{invObj?.name||"—"} • {i.by} • {i.date}</div>
              </div>
              {i.outcome&&<span style={{padding:"2px 8px",borderRadius:4,fontSize:9,fontWeight:600,alignSelf:"center",background:i.outcome==="إيجابي"?C.greenLight:i.outcome==="بانتظار"?"#fffbeb":"#f1f5f9",color:i.outcome==="إيجابي"?C.green:i.outcome==="بانتظار"?C.warning:C.muted}}>{i.outcome}</span>}
            </div>
          );})}
        </div>
      </div>

      {/* Land occupancy visual */}
      <div style={{...cd,marginTop:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}><h4 style={{fontSize:13,fontWeight:700,color:C.text,margin:0}}>🗺️ إشغال الأراضي حسب المنطقة</h4><button onClick={()=>onNav("plots")} style={{fontSize:10,color:C.green,fontWeight:600,background:"none",border:"none",cursor:"pointer",fontFamily:F}}>إدارة الأراضي ←</button></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))",gap:12}}>
          {[...new Set(pl.map(p=>p.zone))].map(z=>{const zp=pl.filter(p=>p.zone===z);const al=zp.filter(p=>["allocated","reserved"].includes(p.status)).length;const pct=Math.round(al/zp.length*100);return(
            <div key={z} onClick={()=>onNav("plots")} style={{padding:14,borderRadius:8,background:C.greenLight,border:`1px solid ${C.border}`,cursor:"pointer",textAlign:"center",transition:"transform 0.15s"}} onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)"}} onMouseLeave={e=>{e.currentTarget.style.transform="none"}}>
              <div style={{fontSize:11,fontWeight:700,color:C.text,marginBottom:6}}>المنطقة {z}</div>
              <div style={{position:"relative",width:60,height:60,margin:"0 auto 8px"}}>
                <svg viewBox="0 0 36 36" style={{width:60,height:60,transform:"rotate(-90deg)"}}>
                  <circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8e2" strokeWidth="3"/>
                  <circle cx="18" cy="18" r="14" fill="none" stroke={C.green} strokeWidth="3" strokeDasharray={`${pct*0.88} 88`} strokeLinecap="round"/>
                </svg>
                <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,fontWeight:800,color:C.green}}>{pct}%</div>
              </div>
              <div style={{fontSize:10,color:C.muted}}>{al}/{zp.length} قطعة</div>
            </div>
          );})}
        </div>
      </div>
    </div>
  );
}

