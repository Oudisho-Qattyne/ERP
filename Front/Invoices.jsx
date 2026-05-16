// ════════════ INVOICES (Enhanced) ════════════
function InvoicesView() {
  const [sc,sSc]=useState(false);const [toast,sT]=useState(null);const [sf,sSf]=useState("");const [tick,sTick]=useState(0);const [sel,sSel]=useState(null);const [sq,sSq]=useState("");
  let list=[...DB.invoices];if(sf)list=list.filter(i=>i.status===sf);if(sq)list=list.filter(i=>i.company.includes(sq)||i.num.includes(sq));
  const all=DB.invoices;
  const paid=all.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const pend=all.filter(i=>i.status==="pending").reduce((s,i)=>s+i.amount,0);
  const over=all.filter(i=>i.status==="overdue");const overTot=over.reduce((s,i)=>s+i.amount,0);
  const total=all.reduce((s,i)=>s+i.amount,0);
  const collectionRate=total>0?Math.round(paid/total*100):0;
  const daysOverdue=(d)=>{if(!d)return 0;const diff=Math.floor((new Date()-new Date(d))/(1000*60*60*24));return Math.max(0,diff);};

  // Aging buckets
  const aging={current:all.filter(i=>i.status==="pending"&&daysOverdue(i.due)<=0),d30:all.filter(i=>["pending","overdue"].includes(i.status)&&daysOverdue(i.due)>0&&daysOverdue(i.due)<=30),d60:all.filter(i=>["pending","overdue"].includes(i.status)&&daysOverdue(i.due)>30&&daysOverdue(i.due)<=60),d90:all.filter(i=>["pending","overdue"].includes(i.status)&&daysOverdue(i.due)>60)};

  const pay=(id)=>{const i=DB.invoices.find(x=>x.id===id);if(i){i.status="paid";i.paid=dt();i.payment_method="تحويل بنكي";}sTick(t=>t+1);sT({message:"تم تسجيل الدفع بنجاح",type:"success"});};

  return <div>{toast&&<Ts{...toast}onDone={()=>sT(null)}/>}

    {/* KPI Cards — clickable filters */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:18}}>
      <div onClick={()=>sSf("")} style={{...cd,padding:"14px 16px",borderTop:`3px solid ${C.gold}`,cursor:"pointer"}}><div style={{fontSize:10,color:C.muted}}>الإجمالي</div><div style={{fontSize:20,fontWeight:800,color:C.text}}>{fmtSYP(total)} ل.س</div><div style={{fontSize:10,color:C.light}}>{all.length} فاتورة</div></div>
      <div onClick={()=>sSf("paid")} style={{...cd,padding:"14px 16px",cursor:"pointer",background:sf==="paid"?C.greenLight:"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.green}}/><span style={{fontSize:10,color:C.muted}}>المحصّل</span></div><div style={{fontSize:20,fontWeight:800,color:C.green}}>{fmtSYP(paid)} ل.س</div><div style={{fontSize:10,color:C.light}}>{all.filter(i=>i.status==="paid").length} فاتورة</div></div>
      <div onClick={()=>sSf("pending")} style={{...cd,padding:"14px 16px",cursor:"pointer",background:sf==="pending"?"#fffbeb":"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.warning}}/><span style={{fontSize:10,color:C.muted}}>قيد التحصيل</span></div><div style={{fontSize:20,fontWeight:800,color:C.warning}}>{fmtSYP(pend)} ل.س</div><div style={{fontSize:10,color:C.light}}>{all.filter(i=>i.status==="pending").length} فاتورة</div></div>
      <div onClick={()=>sSf("overdue")} style={{...cd,padding:"14px 16px",cursor:"pointer",background:sf==="overdue"?"#fef2f2":"#fff"}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,borderRadius:"50%",background:C.danger}}/><span style={{fontSize:10,color:C.muted}}>متأخرة</span></div><div style={{fontSize:20,fontWeight:800,color:C.danger}}>{fmtSYP(overTot)} ل.س</div><div style={{fontSize:10,color:C.light}}>{over.length} فاتورة</div></div>
      {/* Collection rate gauge */}
      <div style={{...cd,padding:"14px 16px"}}>
        <div style={{fontSize:10,color:C.muted,marginBottom:6}}>نسبة التحصيل</div>
        <div style={{position:"relative",width:56,height:56,margin:"0 auto"}}><svg viewBox="0 0 36 36" style={{width:56,height:56,transform:"rotate(-90deg)"}}><circle cx="18" cy="18" r="14" fill="none" stroke="#e2e8e2" strokeWidth="3"/><circle cx="18" cy="18" r="14" fill="none" stroke={collectionRate>=80?C.green:collectionRate>=50?C.warning:C.danger} strokeWidth="3" strokeDasharray={`${collectionRate*0.88} 88`} strokeLinecap="round"/></svg><div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",fontSize:14,fontWeight:800,color:collectionRate>=80?C.green:collectionRate>=50?C.warning:C.danger}}>{collectionRate}%</div></div>
      </div>
    </div>

    {/* Aging Analysis */}
    <div style={{...cd,padding:"12px 18px",marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>📊 تحليل أعمار الذمم المدينة (Aging)</div>
      <div style={{display:"flex",gap:2,height:12,borderRadius:6,overflow:"hidden",marginBottom:6}}>
        {[{k:"current",c:C.green,d:aging.current},{k:"d30",c:C.warning,d:aging.d30},{k:"d60",c:"#ea580c",d:aging.d60},{k:"d90",c:C.danger,d:aging.d90}].map(b=>{const amt=b.d.reduce((s,i)=>s+i.amount,0);const pct=total>0?amt/total*100:0;return pct>0?<div key={b.k} style={{width:`${pct}%`,background:b.c,minWidth:pct>0?4:0}} title={`${b.k}: ${fmtSYP(amt)}`}/>:null;})}
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        <div style={{textAlign:"center",padding:"6px 0",borderRadius:6,background:C.greenLight}}><div style={{fontSize:9,color:C.muted}}>حالي (لم يستحق)</div><div style={{fontSize:12,fontWeight:700,color:C.green}}>{aging.current.length} — {fmtSYP(aging.current.reduce((s,i)=>s+i.amount,0))}</div></div>
        <div style={{textAlign:"center",padding:"6px 0",borderRadius:6,background:"#fffbeb"}}><div style={{fontSize:9,color:C.muted}}>1-30 يوم متأخر</div><div style={{fontSize:12,fontWeight:700,color:C.warning}}>{aging.d30.length} — {fmtSYP(aging.d30.reduce((s,i)=>s+i.amount,0))}</div></div>
        <div style={{textAlign:"center",padding:"6px 0",borderRadius:6,background:"#fff7ed"}}><div style={{fontSize:9,color:C.muted}}>31-60 يوم متأخر</div><div style={{fontSize:12,fontWeight:700,color:"#ea580c"}}>{aging.d60.length} — {fmtSYP(aging.d60.reduce((s,i)=>s+i.amount,0))}</div></div>
        <div style={{textAlign:"center",padding:"6px 0",borderRadius:6,background:"#fef2f2"}}><div style={{fontSize:9,color:C.muted}}>+60 يوم متأخر</div><div style={{fontSize:12,fontWeight:700,color:C.danger}}>{aging.d90.length} — {fmtSYP(aging.d90.reduce((s,i)=>s+i.amount,0))}</div></div>
      </div>
    </div>

    {/* Overdue Alert */}
    {over.length>0&&<div style={{background:"#fef2f2",border:"1px solid #fca5a5",borderRadius:10,padding:"12px 16px",marginBottom:16,borderRight:`4px solid ${C.danger}`}}>
      <h4 style={{fontSize:12,fontWeight:700,color:C.danger,margin:"0 0 8px"}}>🔴 فواتير متأخرة تحتاج متابعة عاجلة ({over.length})</h4>
      {over.map(i=>{const inv=DB.investors.find(x=>x.id===i.inv_id);const days=daysOverdue(i.due);return(
        <div key={i.id} onClick={()=>sSel(i)} style={{padding:"6px 0",display:"flex",justifyContent:"space-between",alignItems:"center",cursor:"pointer",borderBottom:"1px solid #fecaca"}}>
          <div><span style={{fontFamily:"monospace",color:C.green,fontWeight:700,fontSize:11}}>{i.num}</span> — <span style={{fontSize:11,fontWeight:600}}>{i.company}</span>{inv&&<span style={{fontSize:9,color:C.muted}}> <Rt r={inv.rating}/></span>}</div>
          <div style={{display:"flex",alignItems:"center",gap:10}}><span style={{fontSize:12,fontWeight:700,color:C.danger}}>{fmtSYP(i.amount)} ل.س</span><span style={{fontSize:9,padding:"2px 8px",borderRadius:4,background:"#fecaca",color:C.danger,fontWeight:700}}>متأخر {days} يوم</span></div>
        </div>
      );})}
    </div>}

    {/* Filters + Search */}
    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center",flexWrap:"wrap"}}>
      <input style={{...inp,width:180}} placeholder="بحث بالرقم أو المستثمر..." value={sq} onChange={e=>sSq(e.target.value)}/>
      <select style={{...inp,width:140}} value={sf} onChange={e=>sSf(e.target.value)}><option value="">كل الحالات</option>{Object.entries(IS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select>
      <div style={{flex:1}}/>
      <button onClick={()=>sSc(true)} style={bG}>+ فاتورة جديدة</button>
    </div>

    {/* Table — enhanced */}
    <div style={cd}><Tb h={["الرقم","المستثمر","التصنيف","النوع","المبلغ","الاستحقاق","التأخر","الحالة","إجراء"]}>
      {list.map(inv=>{const investor=DB.investors.find(x=>x.id===inv.inv_id);const days=daysOverdue(inv.due);const isLate=inv.status==="overdue";return(
        <tr key={inv.id} style={{borderBottom:`1px solid ${C.border}`,background:isLate?"#fef8f8":"transparent",cursor:"pointer"}} onClick={()=>sSel(inv)} onMouseEnter={e=>{e.currentTarget.style.background=isLate?"#fef2f2":"#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background=isLate?"#fef8f8":"transparent"}}>
          <Tc mono bold color={C.green}>{inv.num}</Tc>
          <Tc>{inv.company}</Tc>
          <td style={{padding:"10px 9px"}}>{investor?<Rt r={investor.rating}/>:"—"}</td>
          <Tc color={C.muted}>{ITYP.find(t=>t.v===inv.type)?.l}</Tc>
          <Tc bold>{fmtSYP(inv.amount)} ل.س</Tc>
          <Tc color={isLate?C.danger:C.muted} bold={isLate}>{inv.due}</Tc>
          <Tc>{inv.status==="paid"?<span style={{fontSize:10,color:C.green}}>✓ مدفوع {inv.paid}</span>:days>0?<span style={{fontSize:10,fontWeight:700,color:days>60?C.danger:days>30?"#ea580c":C.warning}}>{days} يوم</span>:<span style={{fontSize:10,color:C.green}}>لم يستحق</span>}</Tc>
          <td style={{padding:"10px 9px"}}><Bg map={IS} value={inv.status}/></td>
          <Tc onClick={e=>e.stopPropagation()}>{["pending","overdue"].includes(inv.status)&&<button onClick={e=>{e.stopPropagation();pay(inv.id);}} style={{padding:"4px 12px",borderRadius:5,border:"none",background:C.green,color:"#fff",fontSize:10,fontWeight:600,cursor:"pointer"}}>💳 تسجيل دفع</button>}</Tc>
        </tr>
      );})}
    </Tb></div>

    {/* Invoice Detail Modal */}
    <Mo isOpen={!!sel} onClose={()=>sSel(null)} title={"🏦 تفاصيل الفاتورة — "+(sel?.num||"")} wide>
      {sel&&(()=>{
        const inv=DB.investors.find(x=>x.id===sel.inv_id);
        const con=DB.contracts.find(c=>c.inv_id===sel.inv_id);
        const days=daysOverdue(sel.due);
        const otherInvoices=DB.invoices.filter(i=>i.inv_id===sel.inv_id&&i.id!==sel.id);
        const invPaidTotal=DB.invoices.filter(i=>i.inv_id===sel.inv_id&&i.status==="paid").reduce((s,i)=>s+i.amount,0);
        const invOverTotal=DB.invoices.filter(i=>i.inv_id===sel.inv_id&&i.status==="overdue").reduce((s,i)=>s+i.amount,0);
        return <div>
          {/* Header */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:10,marginBottom:18}}>
            <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>رقم الفاتورة</div><div style={{fontSize:14,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{sel.num}</div></div>
            <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>المبلغ</div><div style={{fontSize:16,fontWeight:800,color:C.green}}>{fmtSYP(sel.amount)} ل.س</div></div>
            <div style={{background:sel.status==="overdue"?"#fef2f2":sel.status==="paid"?C.greenLight:"#fffbeb",padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الحالة</div><div style={{marginTop:4}}><Bg map={IS} value={sel.status}/></div></div>
            <div style={{background:sel.status==="overdue"?"#fef2f2":"#f8faf8",padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>{sel.status==="paid"?"تم الدفع":"التأخر"}</div><div style={{fontSize:14,fontWeight:800,color:sel.status==="paid"?C.green:days>0?C.danger:C.text}}>{sel.status==="paid"?sel.paid:days>0?days+" يوم":"لم يستحق"}</div></div>
          </div>

          {/* Details */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,fontSize:12}}>
            <div><span style={{color:C.muted}}>المستثمر:</span> <strong>{sel.company}</strong></div>
            <div><span style={{color:C.muted}}>النوع:</span> {ITYP.find(t=>t.v===sel.type)?.l}</div>
            <div><span style={{color:C.muted}}>تاريخ الاستحقاق:</span> <strong style={{color:sel.status==="overdue"?C.danger:C.text}}>{sel.due}</strong></div>
            <div><span style={{color:C.muted}}>تاريخ الدفع:</span> {sel.paid||"لم يُدفع بعد"}</div>
            {inv&&<div style={{gridColumn:"span 2"}}><span style={{color:C.muted}}>ملف المستثمر:</span> <strong style={{color:C.green}}>{inv.name}</strong> <Rt r={inv.rating}/> — {inv.sector} — {inv.governorate}</div>}
            {con&&<div style={{gridColumn:"span 2"}}><span style={{color:C.muted}}>العقد المرتبط:</span> <span style={{fontFamily:"monospace",color:C.green,fontWeight:700}}>{con.num}</span> — {CTYP.find(t=>t.v===con.type)?.l} — {fmtSYP(con.value)} ل.س</div>}
          </div>

          {/* Pay button if unpaid */}
          {["pending","overdue"].includes(sel.status)&&<div style={{background:sel.status==="overdue"?"#fef2f2":"#fffbeb",borderRadius:8,padding:16,marginBottom:16,border:`1px solid ${sel.status==="overdue"?"#fca5a5":"#fcd34d"}`,textAlign:"center"}}>
            <div style={{fontSize:12,fontWeight:700,color:sel.status==="overdue"?C.danger:C.warning,marginBottom:8}}>{sel.status==="overdue"?"⚠️ هذه الفاتورة متأخرة "+days+" يوم":"⏳ هذه الفاتورة لم تُحصّل بعد"}</div>
            <button onClick={()=>{pay(sel.id);sSel({...sel,status:"paid",paid:dt()});}} style={{...bG,padding:"10px 32px",fontSize:13}}>💳 تسجيل دفع كامل — {fmtSYP(sel.amount)} ل.س</button>
          </div>}

          {/* Investor Payment History */}
          {inv&&<div style={{...cd,padding:14,marginBottom:16,borderTop:`3px solid ${C.gold}`}}>
            <h5 style={{fontSize:12,fontWeight:700,margin:"0 0 10px"}}>📊 سجل المستثمر المالي — {inv.name}</h5>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:10}}>
              <div style={{textAlign:"center",padding:8,background:C.greenLight,borderRadius:6}}><div style={{fontSize:9,color:C.muted}}>إجمالي المحصّل</div><div style={{fontSize:13,fontWeight:800,color:C.green}}>{fmtSYP(invPaidTotal)} ل.س</div></div>
              <div style={{textAlign:"center",padding:8,background:invOverTotal>0?"#fef2f2":"#f8faf8",borderRadius:6}}><div style={{fontSize:9,color:C.muted}}>إجمالي المتأخر</div><div style={{fontSize:13,fontWeight:800,color:invOverTotal>0?C.danger:C.green}}>{invOverTotal>0?fmtSYP(invOverTotal)+" ل.س":"—"}</div></div>
              <div style={{textAlign:"center",padding:8,background:"#f8faf8",borderRadius:6}}><div style={{fontSize:9,color:C.muted}}>عدد الفواتير</div><div style={{fontSize:13,fontWeight:800}}>{DB.invoices.filter(i=>i.inv_id===sel.inv_id).length}</div></div>
            </div>
            {otherInvoices.length>0&&<><div style={{fontSize:11,fontWeight:600,color:C.muted,marginBottom:6}}>فواتير أخرى للمستثمر:</div><Tb h={["الرقم","المبلغ","الاستحقاق","الحالة"]}>{otherInvoices.map(i=><tr key={i.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc mono bold color={C.green}>{i.num}</Tc><Tc bold>{fmtSYP(i.amount)} ل.س</Tc><Tc color={i.status==="overdue"?C.danger:C.muted}>{i.due}</Tc><td style={{padding:"10px 9px"}}><Bg map={IS} value={i.status}/></td></tr>)}</Tb></>}
          </div>}
        </div>;
      })()}
    </Mo>

    {/* Create Modal */}
    <Mo isOpen={sc} onClose={()=>sSc(false)} title="🏦 فاتورة جديدة"><FIM investorField withDocs fields={[{k:"company",l:"المستثمر *"},{k:"type",l:"النوع",type:"select",opts:ITYP},{k:"amount",l:"المبلغ (ل.س) *",type:"number"},{k:"due",l:"الاستحقاق *",type:"date"},{k:"notes",l:"ملاحظات",type:"textarea",span:2}]} init={{company:"",type:"annual_fee",amount:"",due:"",notes:"",inv_id:""}} req={["company","amount","due"]} onSave={fm=>{DB.invoices.unshift({id:DB._n.i++,num:rid("INV-2025"),inv_id:fm.inv_id?Number(fm.inv_id):null,company:fm.company,type:fm.type,amount:Number(fm.amount),due:fm.due,paid:null,status:"pending"});sSc(false);sTick(t=>t+1);sT({message:"تم الإنشاء",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
  </div>;
}

