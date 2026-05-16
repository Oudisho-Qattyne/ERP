// ════════════ LOGIN ════════════
function Login({onLogin}) {
  const [u,su]=useState("");const [p,sp]=useState("");const [e,se]=useState("");
  const go=()=>{se("");const user=DB.users.find(x=>x.username===u&&x.password===p&&x.active);if(!user){se("خطأ في اسم المستخدم أو كلمة المرور");return;}onLogin(user);};
  return (
    <div dir="rtl" style={{fontFamily:F,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${C.greenDark} 0%,${C.green} 40%,${C.greenDark} 100%)`,position:"relative"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+Arabic:wght@400;500;600;700;800;900&display=swap');@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@400;500;700;800&display=swap');*{box-sizing:border-box}input:focus{border-color:${C.gold}!important;box-shadow:0 0 0 3px ${C.gold}20!important}`}</style>
      {/* Geometric pattern overlay */}
      <div style={{position:"absolute",inset:0,opacity:0.04,backgroundImage:"repeating-conic-gradient(#fff 0% 25%, transparent 0% 50%)",backgroundSize:"40px 40px"}} />
      <div style={{background:"#fff",borderRadius:14,padding:"40px 38px",width:400,boxShadow:"0 25px 60px rgba(0,0,0,.25)",position:"relative",borderTop:`5px solid ${C.gold}`}}>
        <div style={{textAlign:"center",marginBottom:28}}>
          {/* Eagle emblem placeholder */}
          <div style={{width:60,height:60,borderRadius:12,margin:"0 auto 14px",background:`linear-gradient(135deg,${C.gold},${C.goldDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:26,fontWeight:900,color:C.greenDark,boxShadow:`0 4px 12px ${C.gold}40`}}>🦅</div>
          <h1 style={{fontSize:18,fontWeight:800,color:C.text,margin:0,lineHeight:1.6}}>المدينة الصناعية في حسياء</h1>
          <p style={{fontSize:12,color:C.muted,marginTop:4}}>نظام الإدارة الموحد — ERP + CRM</p>
          <p style={{fontSize:10,color:C.light,marginTop:2}}>الجمهورية العربية السورية — محافظة حمص</p>
        </div>
        <Fl l="اسم المستخدم"><input style={inp} value={u} onChange={x=>su(x.target.value)} placeholder="admin" onKeyDown={x=>x.key==="Enter"&&go()}/></Fl>
        <Fl l="كلمة المرور"><input style={inp} type="password" value={p} onChange={x=>sp(x.target.value)} placeholder="••••••••" onKeyDown={x=>x.key==="Enter"&&go()}/></Fl>
        {e&&<div style={{color:C.danger,fontSize:12,marginBottom:10,fontWeight:600}}>{e}</div>}
        <button onClick={go} style={{...bG,width:"100%",padding:"12px 0",fontSize:15,marginTop:6}}>تسجيل الدخول</button>
        <div style={{marginTop:20,padding:12,background:C.greenLight,borderRadius:8,fontSize:10,color:C.muted,lineHeight:1.9,border:`1px solid ${C.border}`}}>
          <strong style={{color:C.text}}>بيانات تجريبية:</strong> admin / Admin@2025 &nbsp;•&nbsp; invest / Invest@2025
        </div>
      </div>
    </div>
  );
}

