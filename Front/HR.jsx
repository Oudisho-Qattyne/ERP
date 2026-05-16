// ════════════ HR (الموارد البشرية) ════════════
function HRView() {
  const [sc,sSc]=useState(false);const [toast,sT]=useState(null);const [tick,sTick]=useState(0);const [sel,sSel]=useState(null);const [sf,sSf]=useState("");const [sd,sSd]=useState("");
  const upSt=(id,st)=>{const e=DB.hr.find(x=>x.id===id);if(e)e.status=st;sTick(t=>t+1);sT({message:"تم تحديث حالة الموظف",type:"success"});};
  const all=DB.hr;
  let list=[...all];if(sf)list=list.filter(e=>e.status===sf);if(sd)list=list.filter(e=>e.department===sd);
  const activeEmps=all.filter(e=>e.status==="active");
  const totalSalary=activeEmps.reduce((s,e)=>s+e.salary,0);
  const deptCounts=useMemo(()=>{const d={};activeEmps.forEach(e=>{d[e.department]=(d[e.department]||0)+1;});return Object.entries(DEPT).map(([k,v])=>({dept:k,label:v.l,icon:v.i,count:d[k]||0,color:v.c}));},[tick]);
  const yearsOfService=(d)=>{if(!d)return"—";return((new Date()-new Date(d))/(1000*60*60*24*365)).toFixed(1);};

  return <div>{toast&&<Ts{...toast}onDone={()=>sT(null)}/>}
    {/* KPI Cards */}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))",gap:10,marginBottom:18}}>
      <SC icon="🧑‍💼" label="إجمالي الموظفين" value={all.length} color={C.green} gold sub={activeEmps.length+" على رأس العمل"}/>
      <SC icon="💰" label="إجمالي الرواتب/شهر" value={fmtSYP(totalSalary)+" ل.س"} color={C.green}/>
      <SC icon="📋" label="دائم" value={all.filter(e=>e.emp_type==="permanent").length} color="#2563eb"/>
      <SC icon="📝" label="عقد مؤقت" value={all.filter(e=>e.emp_type==="contract").length} color={C.warning}/>
      {all.filter(e=>e.status==="on_leave").length>0&&<div style={{...cd,padding:"14px 16px",background:"#fffbeb",border:`1px solid #fcd34d`}}><div style={{display:"flex",alignItems:"center",gap:4}}><span style={{fontSize:14}}>🏖️</span><span style={{fontSize:10,color:C.warning,fontWeight:700}}>في إجازة</span></div><div style={{fontSize:22,fontWeight:800,color:C.warning}}>{all.filter(e=>e.status==="on_leave").length}</div></div>}
    </div>

    {/* Department Breakdown */}
    <div style={{...cd,padding:"12px 18px",marginBottom:16}}>
      <div style={{fontSize:11,fontWeight:700,color:C.muted,marginBottom:8}}>📊 توزيع الموظفين حسب القسم</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(110px,1fr))",gap:8}}>
        {deptCounts.map(d=>(
          <div key={d.dept} onClick={()=>sSd(sd===d.dept?"":d.dept)} style={{textAlign:"center",padding:"10px 8px",borderRadius:8,background:sd===d.dept?`${d.color}10`:"#f8faf8",border:`1px solid ${sd===d.dept?d.color:C.border}`,cursor:"pointer",transition:"all 0.15s"}}>
            <div style={{fontSize:18,marginBottom:2}}>{d.icon}</div>
            <div style={{fontSize:18,fontWeight:800,color:d.color}}>{d.count}</div>
            <div style={{fontSize:9,color:C.muted}}>{d.label}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Filters */}
    <div style={{display:"flex",gap:8,marginBottom:14,alignItems:"center"}}><select style={{...inp,width:140}} value={sf} onChange={e=>sSf(e.target.value)}><option value="">كل الحالات</option>{Object.entries(HRS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><select style={{...inp,width:140}} value={sd} onChange={e=>sSd(e.target.value)}><option value="">كل الأقسام</option>{Object.entries(DEPT).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select><div style={{flex:1}}/><button onClick={()=>sSc(true)} style={bG}>+ موظف جديد</button></div>

    {/* Employee Table */}
    <div style={cd}><Tb h={["الرقم","الاسم","المنصب","القسم","نوع العقد","تاريخ التعيين","الخبرة","الراتب","الحالة","تغيير"]}>
      {list.map(e=>{const onLeave=e.status==="on_leave";return(
        <tr key={e.id} onClick={()=>sSel(e)} style={{borderBottom:`1px solid ${C.border}`,cursor:"pointer",background:onLeave?"#fffef5":"transparent"}} onMouseEnter={ev=>{ev.currentTarget.style.background=onLeave?"#fffbeb":"#f8faf8"}} onMouseLeave={ev=>{ev.currentTarget.style.background=onLeave?"#fffef5":"transparent"}}>
          <Tc mono bold color={C.green}>{e.num}</Tc>
          <Tc bold>{e.name}</Tc>
          <Tc color={C.muted}>{e.position}</Tc>
          <Tc>{DEPT[e.department]?.i} {DEPT[e.department]?.l}</Tc>
          <Tc color={C.muted}>{ETYP.find(t=>t.v===e.emp_type)?.l}</Tc>
          <Tc color={C.muted}>{e.hire_date}</Tc>
          <Tc color={C.green} bold>{yearsOfService(e.hire_date)} سنة</Tc>
          <Tc bold color={C.success}>{fmtSYP(e.salary)} ل.س</Tc>
          <td style={{padding:"10px 9px"}}><Bg map={HRS} value={e.status}/></td>
          <Tc><select style={{...inp,width:90,padding:"2px 4px",fontSize:10}} value={e.status} onClick={ev=>ev.stopPropagation()} onChange={ev=>{ev.stopPropagation();upSt(e.id,ev.target.value);}}>{Object.entries(HRS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></Tc>
        </tr>
      );})}
    </Tb></div>

    {/* Employee Detail Modal */}
    <Mo isOpen={!!sel} onClose={()=>sSel(null)} title={"🧑‍💼 ملف الموظف — "+(sel?.name||"")} wide>
      {sel&&<div>
        <div style={{background:`linear-gradient(135deg,${C.greenDark},${C.green})`,borderRadius:10,padding:"20px 24px",marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
            <div><h3 style={{color:"#fff",fontSize:18,fontWeight:800,margin:0}}>{sel.name}</h3><div style={{color:"rgba(255,255,255,0.6)",fontSize:12,marginTop:4}}>{sel.position} — {DEPT[sel.department]?.i} {DEPT[sel.department]?.l}</div><div style={{color:"rgba(255,255,255,0.4)",fontSize:11,marginTop:2}}><span style={{fontFamily:"monospace"}}>{sel.num}</span> • {ETYP.find(t=>t.v===sel.emp_type)?.l}</div></div>
            <div style={{textAlign:"center",background:"rgba(255,255,255,0.08)",borderRadius:8,padding:"10px 18px"}}><div style={{fontSize:28,fontWeight:800,color:C.gold}}>{yearsOfService(sel.hire_date)}</div><div style={{fontSize:10,color:"rgba(255,255,255,0.5)"}}>سنة خبرة</div></div>
          </div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10,marginBottom:18}}>
          <div style={{background:C.greenLight,padding:14,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الراتب الشهري</div><div style={{fontSize:16,fontWeight:800,color:C.green}}>{fmtSYP(sel.salary)} ل.س</div></div>
          <div style={{background:C.greenLight,padding:14,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الراتب السنوي</div><div style={{fontSize:16,fontWeight:800,color:C.green}}>{fmtSYP(sel.salary*12)} ل.س</div></div>
          <div style={{background:sel.status==="active"?C.greenLight:sel.status==="on_leave"?"#fffbeb":"#fef2f2",padding:14,borderRadius:8,textAlign:"center"}}><div style={{fontSize:10,color:C.muted}}>الحالة</div><div style={{marginTop:4}}><Bg map={HRS} value={sel.status}/></div></div>
        </div>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16,fontSize:12}}>
          <div><span style={{color:C.muted}}>📞 الهاتف:</span> <strong style={{fontFamily:"monospace"}}>{sel.phone}</strong></div>
          <div><span style={{color:C.muted}}>✉️ البريد:</span> <strong>{sel.email}</strong></div>
          <div><span style={{color:C.muted}}>📅 تاريخ التعيين:</span> <strong>{sel.hire_date}</strong></div>
          <div><span style={{color:C.muted}}>📋 نوع العقد:</span> <strong>{ETYP.find(t=>t.v===sel.emp_type)?.l}</strong></div>
          {sel.notes&&<div style={{gridColumn:"span 2",background:C.goldLight,padding:10,borderRadius:6,borderRight:`3px solid ${C.gold}`}}>📌 <strong>ملاحظات:</strong> {sel.notes}</div>}
        </div>
      </div>}
    </Mo>

    {/* Create Employee Modal */}
    <Mo isOpen={sc} onClose={()=>sSc(false)} title="🧑‍💼 إضافة موظف جديد"><FIM withDocs fields={[{k:"name",l:"اسم الموظف *"},{k:"position",l:"المنصب *"},{k:"department",l:"القسم",type:"select",opts:Object.entries(DEPT).map(([k,v])=>({v:k,l:v.l}))},{k:"emp_type",l:"نوع العقد",type:"select",opts:ETYP},{k:"hire_date",l:"تاريخ التعيين",type:"date"},{k:"salary",l:"الراتب (ل.س)",type:"number"},{k:"phone",l:"الهاتف"},{k:"email",l:"البريد"},{k:"notes",l:"ملاحظات",type:"textarea",span:2}]} init={{name:"",position:"",department:"admin",emp_type:"permanent",hire_date:dt(),salary:"",phone:"",email:"",notes:""}} req={["name","position"]} onSave={fm=>{DB.hr.push({...fm,id:DB._n.hr++,num:rid("HR"),status:"active",salary:Number(fm.salary)||0});sSc(false);sTick(t=>t+1);sT({message:"تم إضافة الموظف بنجاح",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
  </div>;
}

