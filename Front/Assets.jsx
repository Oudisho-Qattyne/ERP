// ════════════ ASSETS ════════════
function AssetsView() {
  const [sc,sSc]=useState(false);const [toast,sT]=useState(null);const [tick,sTick]=useState(0);
  const bt={infrastructure:{l:"بنية تحتية",i:"🏗️"},equipment:{l:"معدات",i:"⚙️"},vehicle:{l:"مركبات",i:"🚛"}};
  const tv=DB.assets.reduce((s,a)=>s+a.value,0);
  const upSt=(id,st)=>{const a=DB.assets.find(x=>x.id===id);if(a)a.status=st;sTick(t=>t+1);sT({message:"تم التحديث",type:"success"});};
  return (
    <div>
      {toast&&<Ts{...toast}onDone={()=>sT(null)}/>}
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(168px,1fr))",gap:10,marginBottom:18}}>
        <SC icon="🏗️" label="الأصول" value={DB.assets.length} color={C.green} gold/>
        <SC icon="💰" label="القيمة" value={fmtSYP(tv)+" ل.س"} color={C.green}/>
        <SC icon="🔧" label="صيانة" value={DB.assets.filter(a=>a.status==="maintenance").length} color={C.warning}/>
        <SC icon="✅" label="تعمل" value={DB.assets.filter(a=>a.status==="operational").length} color={C.green}/>
      </div>
      <div style={{display:"flex",marginBottom:14}}><div style={{flex:1}}/><button onClick={()=>sSc(true)} style={bG}>+ إضافة أصل</button></div>
      <div style={cd}><Tb h={["الأصل","النوع","الموقع","القيمة","آخر صيانة","القادمة","الحالة","تغيير"]}>
        {DB.assets.map(a => (
          <tr key={a.id} style={{borderBottom:`1px solid ${C.border}`}}>
            <Tc bold>{a.name}</Tc><Tc>{bt[a.type]?.i} {bt[a.type]?.l}</Tc><Tc color={C.muted}>{a.loc}</Tc><Tc bold color={C.success}>{fmtSYP(a.value)}</Tc><Tc color={C.muted}>{a.last_m}</Tc><Tc color={a.next_m<=dt()?C.danger:C.muted} bold={a.next_m<=dt()}>{a.next_m}</Tc><td style={{padding:"10px 9px"}}><Bg map={AS} value={a.status}/></td>
            <Tc><select style={{...inp,width:80,padding:"2px 4px",fontSize:10}} value={a.status} onChange={e=>upSt(a.id,e.target.value)}>{Object.entries(AS).map(([k,v])=><option key={k} value={k}>{v.l}</option>)}</select></Tc>
          </tr>
        ))}
      </Tb></div>
      <Mo isOpen={sc} onClose={()=>sSc(false)} title="🏗️ إضافة أصل جديد"><FIM fields={[{k:"name",l:"اسم الأصل *"},{k:"asset_type",l:"النوع",type:"select",opts:[{v:"infrastructure",l:"بنية تحتية"},{v:"equipment",l:"معدات"},{v:"vehicle",l:"مركبات"}]},{k:"loc",l:"الموقع"},{k:"value",l:"القيمة (ل.س)",type:"number"},{k:"last_m",l:"آخر صيانة",type:"date"},{k:"next_m",l:"الصيانة القادمة",type:"date"},{k:"notes",l:"ملاحظات",type:"textarea",span:2}]} init={{name:"",asset_type:"equipment",loc:"",value:"",last_m:"",next_m:"",notes:""}} req={["name"]} onSave={fm=>{DB.assets.push({...fm,id:DB._n.asset++,type:fm.asset_type,status:"operational",value:Number(fm.value)||0});sSc(false);sTick(t=>t+1);sT({message:"تم الإضافة",type:"success"});}} onClose={()=>sSc(false)}/></Mo>
    </div>
  );
}

