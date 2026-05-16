// ════════════ CONTRACTS (Enhanced) ════════════
function ContractsView() {
  const [sc,sSc]=useState(false);const [toast,sT]=useState(null);const [sf,sSf]=useState("");const [tick,sTick]=useState(0);const [sel,sSel]=useState(null);
  const upSt=(id,st)=>{const c=DB.contracts.find(x=>x.id===id);if(c){c.status=st;if(st==="active"&&!c.activated_at)c.activated_at=dt();}sTick(t=>t+1);sT({message:"تم تحديث حالة العقد",type:"success"});};
  let list=[...DB.contracts];if(sf)list=list.filter(c=>c.status===sf);

  // KPIs
  const all=DB.contracts;
  const totalVal=all.reduce((s,c)=>s+c.value,0);
  const activeVal=all.filter(c=>c.status==="active").reduce((s,c)=>s+c.value,0);
  const expiringSoon=all.filter(c=>{if(!c.end||c.status!=="active")return false;const diff=Math.floor((new Date(c.end)-new Date())/(1000*60*60*24));return diff>=0&&diff<=90;});
  const expired=all.filter(c=>c.end&&c.end<dt()&&c.status==="active");
  const daysLeft=(d)=>{if(!d)return null;const diff=Math.floor((new Date(d)-new Date())/(1000*60*60*24));return diff;};
  const daysToText=(d)=>{const dl=daysLeft(d);if(dl===null)return"—";if(dl<0)return <span style={{color:C.danger,fontWeight:700}}>منتهي منذ {Math.abs(dl)} يوم</span>;if(dl===0)return <span style={{color:C.danger,fontWeight:700}}>ينتهي اليوم!</span>;if(dl<=30)return <span style={{color:C.danger,fontWeight:600}}>{dl} يوم</span>;if(dl<=90)return <span style={{color:C.warning,fontWeight:600}}>{dl} يوم</span>;return <span style={{color:C.green}}>{dl} يوم</span>;};

  return (
    <div>
      {toast&&<Ts{...toast}onDone={()=>sT(null)}/>}

      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:10,marginBottom:18}}>
        <SC icon="📄" label="إجمالي العقود" value={all.length} color={C.green} gold sub={fmtSYP(totalVal)+" ل.س"}/>
        <SC icon="✅" label="نشط" value={all.filter(c=>c.status==="active").length} color={C.green} sub={fmtSYP(activeVal)+" ل.س"}/>
        <SC icon="📝" label="مسودة" value={all.filter(c=>c.status==="draft").length} color="#6b7280"/>
        <SC icon="🔄" label="تجديد" value={all.filter(c=>c.status==="renewal").length} color="#2563eb"/>
        {expiringSoon.length>0&&<div style={{...cd,padding:"14px 16px",background:"#fffbeb",border:`1px solid #fcd34d`}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:16}}>⏰</span><span style={{fontSize:10,color:C.warning,fontWeight:700}}>قارب الانتهاء (90 يوم)</span></div><div style={{fontSize:22,fontWeight:800,color:C.warning}}>{expiringSoon.length}</div></div>}
        {expired.length>0&&<div style={{...cd,padding:"14px 16px",background:"#fef2f2",border:`1px solid #fca5a5`}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:16}}>🔴</span><span style={{fontSize:10,color:C.danger,fontWeight:700}}>منتهي!</span></div><div style={{fontSize:22,fontWeight:800,color:C.danger}}>{expired.length}</div></div>}
      </div>

      {/* Expiry Alert Banner */}
      {expiringSoon.length>0&&<div style={{background:"#fffbeb",border:"1px solid #fcd34d",borderRadius:10,padding:"12px 16px",marginBottom:16,borderRight:`4px solid ${C.warning}`}}>
        <h4 style={{fontSize:12,fontWeight:700,color:C.warning,margin:"0 0 8px"}}>⏰ عقود تقارب الانتهاء — يجب المتابعة</h4>
        {expiringSoon.map(c=>{const inv=DB.investors.find(x=>x.id===c.inv_id);return(
          <div key={c.id} onClick={()=>sSel(c)} style={{padding:"6px 0",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:"1px solid #fde68a"}}>
            <div><span style={{fontFamily:"monospace",color:C.green,fontWeight:700,fontSize:11}}>{c.num}</span> — <span style={{fontSize:11,fontWeight:600}}>{c.company}</span>{inv&&<span style={{fontSize:9,color:C.muted}}> ({inv.rating})</span>}</div>
            <div style={{display:"flex",alignItems:"center",gap:8}}><span style={{fontSize:11,fontWeight:600}}>{fmtSYP(c.value)} ل.س</span><span style={{fontSize:10,fontWeight:700,color:daysLeft(c.end)<=30?C.danger:C.warning}}>⏰ {daysLeft(c.end)} يوم متبقي</span></div>
          </div>
        );})}
      </div>}

      {/* Filters */}
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}><select style={{...inp,width:140}} value={sf} onChange={e=>sSf(e.target.value)}><option value="">الكل</option>{Object.entries(CS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><div style={{flex:1}}/><button onClick={()=>sSc(true)} style={bG}>+ عقد جديد</button></div>

      {/* Table — enhanced with remaining days and investor rating */}
      <div style={cd}><Tb h={["الرقم","الشركة","التصنيف","النوع","القيمة","البداية","النهاية","المتبقي","القطع","الحالة","تغيير"]}>
        {list.map(c=>{
          const inv=DB.investors.find(x=>x.id===c.inv_id);
          const dl=daysLeft(c.end);
          const isExpiring=dl!==null&&dl<=90&&dl>=0&&c.status==="active";
          const isExpired=dl!==null&&dl<0&&c.status==="active";
          return (
          <tr key={c.id} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:isExpired?"#fef8f8":isExpiring?"#fffef5":"transparent"}} onClick={()=>sSel(c)} onMouseEnter={e=>{e.currentTarget.style.background=isExpired?"#fef2f2":isExpiring?"#fffbeb":"#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background=isExpired?"#fef8f8":isExpiring?"#fffef5":"transparent"}}>
            <Tc mono bold color={C.green}>{c.num}</Tc>
            <Tc>{c.company}</Tc>
            <td style={{padding:"10px 9px"}}>{inv?<Rt r={inv.rating}/>:"—"}</td>
            <Tc color={C.muted}>{CTYP.find(t=>t.v===c.type)?.l||c.type}</Tc>
            <Tc bold color={C.success}>{fmtSYP(c.value)} ل.س</Tc>
            <Tc color={C.muted}>{c.start}</Tc>
            <Tc color={isExpired?C.danger:isExpiring?C.warning:C.muted} bold={isExpired||isExpiring}>{c.end||"—"}</Tc>
            <Tc>{daysToText(c.end)}</Tc>
            <Tc color={C.muted} style={{fontSize:10}}>{c.plots||"—"}</Tc>
            <td style={{padding:"10px 9px"}}><Bg map={CS} value={c.status}/></td>
            <Tc><select style={{...inp,width:80,padding:"2px 4px",fontSize:10}} value={c.status} onClick={e=>e.stopPropagation()} onChange={e=>{e.stopPropagation();upSt(c.id,e.target.value);}}>{Object.entries(CS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></Tc>
          </tr>
        );})}
      </Tb></div>

      {/* Contract Detail Modal — Enhanced */}
      <Mo isOpen={!!sel} onClose={()=>sSel(null)} title={"📄 تفاصيل العقد — "+(sel?.num||"")} wide>
        {sel && (()=>{
          const inv=DB.investors.find(x=>x.id===sel.inv_id);
          const linkedInvoices=DB.invoices.filter(i=>i.inv_id===sel.inv_id);
          const paidInv=linkedInvoices.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
          const overdueInv=linkedInvoices.filter(i=>i.status==="overdue");
          const linkedRequests=DB.requests.filter(r=>r.inv_id===sel.inv_id&&["contract","subscription"].includes(r.type));
          const dl=daysLeft(sel.end);
          const duration=sel.start&&sel.end?Math.floor((new Date(sel.end)-new Date(sel.start))/(1000*60*60*24)):null;
          const elapsed=sel.start?Math.floor((new Date()-new Date(sel.start))/(1000*60*60*24)):null;
          const pct=duration&&elapsed?Math.min(Math.round(elapsed/duration*100),100):null;
          return <div>
            {/* Header KPIs */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
              <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>رقم العقد</div><div style={{fontSize:14,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{sel.num}</div></div>
              <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>القيمة الإجمالية</div><div style={{fontSize:14,fontWeight:800,color:C.green}}>{fmtSYP(sel.value)} ل.س</div></div>
              <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الحالة</div><div style={{marginTop:4}}><Bg map={CS} value={sel.status}/></div></div>
              <div style={{background:dl!==null&&dl<=90?"#fffbeb":C.greenLight,padding:12,borderRadius:8,textAlign:"center",border:dl!==null&&dl<=30?`1px solid ${C.danger}20`:"none"}}><div style={{fontSize:10,color:C.muted}}>المتبقي</div><div style={{fontSize:14,fontWeight:800,color:dl!==null&&dl<=30?C.danger:dl<=90?C.warning:C.green}}>{daysToText(sel.end)}</div></div>
            </div>

            {/* Contract timeline bar */}
            {pct!==null&&<div style={{marginBottom:18}}>
              <div style={{display:"flex",justifyContent:"space-between",fontSize:10,color:C.muted,marginBottom:4}}><span>بداية: {sel.start}</span><span>{pct}% مضى</span><span>نهاية: {sel.end}</span></div>
              <div style={{height:8,borderRadius:8,background:"#e8f0e8",overflow:"hidden"}}><div style={{height:"100%",borderRadius:8,background:pct>=90?C.danger:pct>=75?C.warning:`linear-gradient(90deg,${C.green},${C.gold})`,width:`${pct}%`,transition:"width 0.5s"}}/></div>
            </div>}

            {/* Details grid */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,fontSize:12}}>
              <div><span style={{color:C.muted}}>الشركة:</span> <strong>{sel.company}</strong></div>
              <div><span style={{color:C.muted}}>النوع:</span> {CTYP.find(t=>t.v===sel.type)?.l||sel.type}</div>
              <div><span style={{color:C.muted}}>البداية:</span> {sel.start||"—"}</div>
              <div><span style={{color:C.muted}}>النهاية:</span> <span style={{color:dl!==null&&dl<0?C.danger:C.text,fontWeight:dl!==null&&dl<0?700:400}}>{sel.end||"—"}</span></div>
              <div><span style={{color:C.muted}}>القطع:</span> {sel.plots||"—"}</div>
              <div><span style={{color:C.muted}}>المدة:</span> {duration?Math.round(duration/365)+" سنة":"—"}</div>
              {inv&&<div style={{gridColumn:"span 2"}}><span style={{color:C.muted}}>المستثمر:</span> <strong style={{color:C.green}}>{inv.name}</strong> <Rt r={inv.rating}/> <span style={{fontSize:10,color:C.muted}}>— {inv.sector} — {inv.governorate}</span></div>}
              {sel.notes&&<div style={{gridColumn:"span 2"}}><span style={{color:C.muted}}>ملاحظات:</span> {sel.notes}</div>}
            </div>

            {/* Financial Summary */}
            {linkedInvoices.length>0&&<div style={{...cd,padding:14,marginBottom:16,borderTop:`3px solid ${C.gold}`}}>
              <h5 style={{fontSize:12,fontWeight:700,margin:"0 0 10px"}}>💰 الملخص المالي</h5>
              <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
                <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>محصّل</div><div style={{fontSize:14,fontWeight:800,color:C.green}}>{fmtSYP(paidInv)} ل.س</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>فواتير</div><div style={{fontSize:14,fontWeight:800}}>{linkedInvoices.length}</div></div>
                <div style={{textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>متأخر</div><div style={{fontSize:14,fontWeight:800,color:overdueInv.length>0?C.danger:C.green}}>{overdueInv.length>0?fmtSYP(overdueInv.reduce((s,i)=>s+i.amount,0))+" ل.س":"—"}</div></div>
              </div>
              <Tb h={["الرقم","النوع","المبلغ","الاستحقاق","الحالة"]}>{linkedInvoices.map(i=><tr key={i.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc mono bold color={C.green}>{i.num}</Tc><Tc color={C.muted}>{ITYP.find(t=>t.v===i.type)?.l}</Tc><Tc bold>{fmtSYP(i.amount)} ل.س</Tc><Tc color={i.status==="overdue"?C.danger:C.muted}>{i.due}</Tc><td style={{padding:"10px 9px"}}><Bg map={IS} value={i.status}/></td></tr>)}</Tb>
            </div>}

            {/* Linked Requests */}
            {linkedRequests.length>0&&<div style={{marginBottom:16}}>
              <h5 style={{fontSize:12,fontWeight:700,marginBottom:8}}>📨 الطلبات المرتبطة</h5>
              {linkedRequests.map(r=><div key={r.id} style={{padding:"6px 10px",background:"#f8faf8",borderRadius:6,marginBottom:4,display:"flex",justifyContent:"space-between",alignItems:"center",border:`1px solid ${C.border}`}}>
                <div><span style={{fontFamily:"monospace",color:C.green,fontWeight:700,fontSize:11}}>{r.ref}</span> — <span style={{fontSize:11}}>{r.title}</span></div>
                <Bg map={ST} value={r.status}/>
              </div>)}
            </div>}

            {/* Documents */}
            <DocUpload docs={sel.docs||[]} onChange={(newDocs)=>{sel.docs=newDocs;sTick(t=>t+1);}} investorId={sel.inv_id} label="📎 مرفقات العقد" />
          </div>;
        })()}
      </Mo>

      {/* Create Modal */}
      <Mo isOpen={sc} onClose={()=>sSc(false)} title="📄 عقد جديد"><FIM investorField withDocs fields={[{k:"company",l:"الشركة *"},{k:"type",l:"النوع",type:"select",opts:CTYP},{k:"value",l:"القيمة (ل.س)",type:"number"},{k:"plots",l:"القطع"},{k:"start",l:"البداية",type:"date"},{k:"end",l:"النهاية",type:"date"},{k:"notes",l:"ملاحظات",type:"textarea",span:2}]} init={{company:"",type:"land_lease",value:"",start:"",end:"",plots:"",notes:"",inv_id:""}} req={["company"]} onSave={fm=>{DB.contracts.unshift({...fm,id:DB._n.c++,num:rid("CON-2025"),inv_id:fm.inv_id?Number(fm.inv_id):null,status:"draft",value:Number(fm.value)||0,docs:fm._docs||[]});sSc(false);sTick(t=>t+1);sT({message:"تم الإنشاء",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
    </div>
  );
}

