// ════════════ INVESTOR PROFILE (Multi-Tab) ════════════
function InvProfile({inv}) {
  const [tab,sTab]=useState("overview");
  const [invDocs,setInvDocs]=useState(inv.documents||[]);
  const ints=DB.interactions.filter(i=>i.inv_id===inv.id).sort((a,b)=>b.date>a.date?1:-1);
  const cons=DB.contracts.filter(c=>c.inv_id===inv.id);
  const invs=DB.invoices.filter(i=>i.inv_id===inv.id);
  const cases=DB.legal.filter(c=>c.inv_id===inv.id);
  const plots=DB.plots.filter(p=>p.inv_id===inv.id);
  const deals=DB.pipeline.filter(p=>p.inv_id===inv.id);
  const reqs=DB.requests.filter(r=>r.inv_id===inv.id);
  const docs=invDocs;
  const paidT=invs.filter(i=>i.status==="paid").reduce((s,i)=>s+i.amount,0);
  const overT=invs.filter(i=>i.status==="overdue").reduce((s,i)=>s+i.amount,0);
  const tabs=[{id:"overview",l:"نظرة عامة",icon:"📋"},{id:"financial",l:"المالية والفواتير",icon:"💰"},{id:"plots",l:"الأراضي والعقود",icon:"🗺️"},{id:"interactions",l:"سجل التواصل",icon:"💬"},{id:"requests",l:"الطلبات",icon:"📨"},{id:"legal",l:"القانونية",icon:"⚖️"},{id:"documents",l:"الوثائق والمرفقات",icon:"📁"}];

  return (
    <div>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${C.greenDark},${C.green})`,borderRadius:10,padding:"20px 24px",marginBottom:18}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6}}><h2 style={{color:"#fff",fontSize:18,fontWeight:800,margin:0}}>{inv.name}</h2><Bg map={VS} value={inv.status}/><Rt r={inv.rating}/></div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:11,lineHeight:1.8}}>{inv.name_en&&<>{inv.name_en} | </>}{inv.sector} — {inv.sub_sector} | سجل: {inv.reg_number}</div>
            <div style={{color:"rgba(255,255,255,0.6)",fontSize:11}}>📍 {inv.address}, {inv.governorate} | 📞 {inv.phone} | ✉️ {inv.email}</div>
          </div>
          <div style={{textAlign:"center",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 18px"}}><div style={{fontSize:28,fontWeight:800,color:C.gold}}>{inv.plots_count}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>قطعة</div><div style={{fontSize:13,fontWeight:700,color:"#fff"}}>{inv.total_area?.toLocaleString()} م²</div></div>
        </div>
      </div>
      <Tabs tabs={tabs} active={tab} onChange={sTab}/>

      {tab==="overview"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:18}}>
          <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>رأس المال</div><div style={{fontSize:15,fontWeight:800,color:C.green}}>{inv.capital?fmtSYP(inv.capital):"—"}</div></div>
          <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>العاملون</div><div style={{fontSize:15,fontWeight:800,color:C.green}}>{inv.employees||"—"}</div></div>
          <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الإيجار السنوي</div><div style={{fontSize:14,fontWeight:800,color:C.green}}>{fmtSYP(inv.annual_rent)} ل.س</div></div>
          <div style={{background:C.greenLight,padding:12,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الانضمام</div><div style={{fontSize:13,fontWeight:700,color:C.green}}>{inv.join_date}</div></div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14,marginBottom:18}}>
          <div style={{...cd,padding:16}}><h5 style={{fontSize:12,fontWeight:700,color:C.text,margin:"0 0 10px",paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>معلومات الاتصال</h5><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,fontSize:11}}><div><span style={{color:C.muted}}>المسؤول:</span> <strong>{inv.contact_person}</strong></div><div><span style={{color:C.muted}}>المنصب:</span> {inv.contact_title}</div><div><span style={{color:C.muted}}>هاتف:</span> {inv.phone}</div><div><span style={{color:C.muted}}>جوال:</span> {inv.mobile}</div><div><span style={{color:C.muted}}>بريد:</span> {inv.email}</div><div><span style={{color:C.muted}}>موقع:</span> {inv.website||"—"}</div></div></div>
          <div style={{...cd,padding:16}}><h5 style={{fontSize:12,fontWeight:700,color:C.text,margin:"0 0 10px",paddingBottom:6,borderBottom:`1px solid ${C.border}`}}>الامتثال والتقييمات</h5><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,fontSize:11}}><div><span style={{color:C.muted}}>الامتثال:</span> {inv.compliance?<Bg map={CMP} value={inv.compliance}/>:"—"}</div><div><span style={{color:C.muted}}>التصنيف:</span> <Rt r={inv.rating}/></div><div><span style={{color:C.muted}}>بيئي:</span> <Rt r={inv.env_rating}/></div><div><span style={{color:C.muted}}>السلامة:</span> <Rt r={inv.safety_rating}/></div><div><span style={{color:C.muted}}>الضريبي:</span> <span style={{fontFamily:"monospace",fontSize:10}}>{inv.tax_number||"—"}</span></div><div><span style={{color:C.muted}}>الترخيص:</span> <span style={{fontFamily:"monospace",fontSize:10}}>{inv.license_number||"—"}</span></div></div></div>
        </div>
        {inv.notes&&<div style={{background:C.goldLight,padding:12,borderRadius:8,borderRight:`4px solid ${C.gold}`,marginBottom:16,fontSize:12,lineHeight:1.7,color:C.text}}>📌 <strong>ملاحظات:</strong> {inv.notes}</div>}
        {deals.length>0&&<div style={{...cd,padding:16}}><h5 style={{fontSize:12,fontWeight:700,color:C.text,margin:"0 0 10px"}}>📈 فرص الاستثمار ({deals.length})</h5>{deals.map(p=><div key={p.id} style={{padding:"7px 0",borderBottom:`1px solid ${C.border}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}><div><div style={{fontSize:12,fontWeight:600}}>{p.title}</div><div style={{fontSize:10,color:C.muted}}>{fmtSYP(p.value)} ل.س • {p.prob}%</div></div><Bg map={PS} value={p.stage}/></div>)}</div>}
      </div>}

      {tab==="financial"&&<div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}><SC icon="✅" label="المحصّل" value={fmtSYP(paidT)+" ل.س"} color={C.green}/><SC icon="⚠️" label="متأخر" value={fmtSYP(overT)+" ل.س"} color={C.danger}/><SC icon="💳" label="الإيجار السنوي" value={fmtSYP(inv.annual_rent)+" ل.س"} color={C.green}/></div>
        <div style={cd}><h5 style={{fontSize:12,fontWeight:700,margin:"0 0 10px"}}>الفواتير</h5>{invs.length===0?<Em t="لا توجد فواتير"/>:<Tb h={["الرقم","النوع","المبلغ","الاستحقاق","الحالة"]}>{invs.map(i=><tr key={i.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc mono bold color={C.green}>{i.num}</Tc><Tc>{ITYP.find(t=>t.v===i.type)?.l}</Tc><Tc bold>{fmtSYP(i.amount)} ل.س</Tc><Tc color={C.muted}>{i.due}</Tc><td style={{padding:"10px 9px"}}><Bg map={IS} value={i.status}/></td></tr>)}</Tb>}</div>
        <div style={{...cd,marginTop:14}}><h5 style={{fontSize:12,fontWeight:700,margin:"0 0 8px"}}>المعلومات البنكية</h5><div style={{fontSize:11}}><span style={{color:C.muted}}>البنك:</span> {inv.bank_name} &nbsp;|&nbsp; <span style={{color:C.muted}}>IBAN:</span> <span style={{fontFamily:"monospace"}}>{inv.iban}</span></div></div>
      </div>}

      {tab==="plots"&&<div>
        {plots.length===0?<Em t="لا توجد قطع"/>:<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))",gap:12,marginBottom:18}}>{plots.map(p=><div key={p.id} style={{...cd,padding:16,borderTop:`3px solid ${C.green}`}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:8}}><span style={{fontSize:16,fontWeight:800,color:C.green,fontFamily:"monospace"}}>{p.num}</span><Bg map={PLS} value={p.status}/></div><div style={{fontSize:11,color:C.muted,lineHeight:1.8}}>📍 المنطقة {p.zone}<br/>📐 {p.area.toLocaleString()} م² — {p.type}<br/>💰 {fmtSYP(p.rent)} ل.س/سنة<br/>⚡ {p.infra}</div></div>)}</div>}
        <div style={cd}><h5 style={{fontSize:12,fontWeight:700,margin:"0 0 10px"}}>العقود</h5>{cons.length===0?<Em t="لا توجد عقود"/>:<Tb h={["الرقم","النوع","القيمة","البداية","النهاية","القطع","الحالة"]}>{cons.map(c=><tr key={c.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc mono bold color={C.green}>{c.num}</Tc><Tc>{CTYP.find(t=>t.v===c.type)?.l||c.type}</Tc><Tc bold color={C.success}>{fmtSYP(c.value)} ل.س</Tc><Tc color={C.muted}>{c.start}</Tc><Tc color={C.muted}>{c.end}</Tc><Tc color={C.muted} style={{fontSize:10}}>{c.plots}</Tc><td style={{padding:"10px 9px"}}><Bg map={CS} value={c.status}/></td></tr>)}</Tb>}</div>
      </div>}

      {tab==="interactions"&&<div>{ints.length===0?<Em t="لا يوجد سجل"/>:ints.map(i=><div key={i.id} style={{padding:"14px 0",borderBottom:`1px solid ${C.border}`,display:"flex",gap:12}}><div style={{width:36,height:36,borderRadius:8,background:`${IT[i.type]?.c}10`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,flexShrink:0}}>{IT[i.type]?.i}</div><div style={{flex:1}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{fontSize:12,fontWeight:700,color:C.text}}>{i.subject}</span><span style={{fontSize:10,color:C.light}}>{i.date}</span></div><div style={{fontSize:11,color:C.text,lineHeight:1.7}}>{i.notes}</div><div style={{fontSize:10,color:C.light,marginTop:3}}>بواسطة: {i.by} {i.outcome&&<span style={{padding:"1px 7px",borderRadius:4,fontSize:9,fontWeight:600,marginRight:6,background:i.outcome==="إيجابي"?C.greenLight:i.outcome==="بانتظار"?"#fffbeb":"#f1f5f9",color:i.outcome==="إيجابي"?C.green:i.outcome==="بانتظار"?C.warning:C.muted}}>{i.outcome}</span>}</div></div></div>)}</div>}

      {tab==="requests"&&<div>{reqs.length===0?<Em t="لا توجد طلبات"/>:<Tb h={["المرجع","العنوان","النوع","الحالة","الأولوية","التاريخ"]}>{reqs.map(r=><tr key={r.id} style={{borderBottom:`1px solid ${C.border}`}}><Tc mono bold color={C.green}>{r.ref}</Tc><Tc>{r.title}</Tc><Tc color={C.muted}>{RTYP.find(t=>t.v===r.type)?.l}</Tc><td style={{padding:"10px 9px"}}><Bg map={ST} value={r.status}/></td><td style={{padding:"10px 9px"}}><Bg map={PR} value={r.priority}/></td><Tc color={C.muted}>{r.at?.slice(0,10)}</Tc></tr>)}</Tb>}</div>}

      {tab==="legal"&&<div>{cases.length===0?<Em t="لا توجد قضايا"/>:cases.map(c=><div key={c.id} style={{...cd,padding:16,marginBottom:10,borderRight:`4px solid ${LS[c.status]?.c||"#ccc"}`}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><span style={{fontSize:12,fontWeight:700}}>{c.title}</span><Bg map={LS} value={c.status}/></div><div style={{fontSize:11,color:C.muted,lineHeight:1.7}}><span style={{fontFamily:"monospace"}}>{c.num}</span> • {LTYP.find(t=>t.v===c.case_type)?.l} • {c.lawyer}{c.court&&<> • {c.court}</>}{c.next_session&&<> • جلسة: <strong>{c.next_session}</strong></>}</div>{c.notes&&<div style={{fontSize:10,color:C.muted,marginTop:3}}>{c.notes}</div>}</div>)}</div>}

      {tab==="documents"&&<div>
        <p style={{fontSize:12,color:C.muted,marginBottom:12}}>جميع المستندات والوثائق المرتبطة بملف المستثمر. يمكنك إرفاق مستندات جديدة وستظهر تلقائياً في الملف.</p>
        <DocUpload docs={invDocs} investorId={inv.id} onChange={(newDocs)=>{inv.documents=newDocs;setInvDocs([...newDocs]);}} />
      </div>}
    </div>
  );
}

// ════════════ INVESTORS LIST ════════════
function InvestorsView() {
  const [sel,sSel]=useState(null);const [sc,sSc]=useState(false);const [toast,sT]=useState(null);const [tick,sTick]=useState(0);const [sf,sSf]=useState("");
  let list=[...DB.investors];if(sf)list=list.filter(i=>i.status===sf);
  return (
    <div>
      {toast&&<Ts{...toast}onDone={()=>sT(null)}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(168px,1fr))",gap:10,marginBottom:18}}>
        <SC icon="🏢" label="نشط" value={DB.investors.filter(i=>i.status==="active").length} color={C.green}/>
        <SC icon="🎯" label="محتمل" value={DB.investors.filter(i=>i.status==="prospect").length} color="#3b82f6"/>
        <SC icon="⚠️" label="موقوف" value={DB.investors.filter(i=>["suspended","inactive"].includes(i.status)).length} color={C.danger}/>
        <SC icon="📐" label="إجمالي المساحة" value={DB.investors.reduce((s,i)=>s+i.total_area,0).toLocaleString()+" م²"} color={C.green}/>
      </div>
      <div style={{display:"flex",gap:10,marginBottom:14,alignItems:"center"}}><select style={{...inp,width:140}} value={sf} onChange={e=>sSf(e.target.value)}><option value="">الكل</option>{Object.entries(VS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><div style={{flex:1}}/><button onClick={()=>sSc(true)} style={bG}>+ تسجيل مستثمر</button></div>
      <div style={cd}><Tb h={["المستثمر","القطاع","المسؤول","التصنيف","القطع","المساحة","الإيجار السنوي","الحالة"]}>{list.map(inv=><tr key={inv.id} onClick={()=>sSel(inv)} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer"}} onMouseEnter={e=>{e.currentTarget.style.background="#f8faf8"}} onMouseLeave={e=>{e.currentTarget.style.background="transparent"}}><Tc bold><div>{inv.name}</div><div style={{fontSize:9,color:C.light}}>{inv.name_en}</div></Tc><Tc color={C.muted}>{inv.sector}</Tc><Tc><div>{inv.contact_person}</div><div style={{fontSize:9,color:C.light}}>{inv.contact_title}</div></Tc><td style={{padding:"10px 9px"}}><Rt r={inv.rating}/></td><Tc bold>{inv.plots_count}</Tc><Tc>{inv.total_area?inv.total_area.toLocaleString()+" م²":"—"}</Tc><Tc bold color={C.success}>{fmtSYP(inv.annual_rent)}</Tc><td style={{padding:"10px 9px"}}><Bg map={VS} value={inv.status}/></td></tr>)}</Tb></div>
      <Mo isOpen={!!sel} onClose={()=>sSel(null)} title={"ملف المستثمر — "+sel?.name} wide>{sel&&<InvProfile inv={sel}/>}</Mo>
      <Mo isOpen={sc} onClose={()=>sSc(false)} title="🏢 تسجيل مستثمر جديد"><FIM fields={[{k:"name",l:"اسم الشركة *"},{k:"name_en",l:"الاسم بالإنجليزية"},{k:"sector",l:"القطاع *"},{k:"sub_sector",l:"القطاع الفرعي"},{k:"contact_person",l:"المسؤول *"},{k:"contact_title",l:"المنصب"},{k:"phone",l:"الهاتف *"},{k:"email",l:"البريد"},{k:"city",l:"المدينة"},{k:"governorate",l:"المحافظة"},{k:"reg_number",l:"السجل التجاري"},{k:"capital",l:"رأس المال (ل.س)",type:"number"},{k:"notes",l:"ملاحظات",type:"textarea",span:2}]} init={{name:"",name_en:"",sector:"",sub_sector:"",contact_person:"",contact_title:"",phone:"",email:"",city:"",governorate:"حمص",reg_number:"",capital:"",notes:""}} req={["name","contact_person","phone","sector"]} onSave={fm=>{DB.investors.push({...fm,id:DB._n.inv++,status:"prospect",rating:"B",plots_count:0,total_area:0,annual_rent:0,join_date:dt(),capital:Number(fm.capital)||0,documents:[]});sSc(false);sTick(t=>t+1);sT({message:"تم تسجيل المستثمر بنجاح",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
    </div>
  );
}

