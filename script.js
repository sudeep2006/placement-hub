// Tabs
function openTab(evt, tabName){
  const tabcontents=document.getElementsByClassName("tabcontent");
  for(let i=0;i<tabcontents.length;i++) tabcontents[i].style.display="none";
  const tablinks=document.getElementsByClassName("tablink");
  for(let i=0;i<tablinks.length;i++) tablinks[i].style.background="#ddd";
  document.getElementById(tabName).style.display="block";
  evt.currentTarget.style.background="#3399cc";
}

// Modal
function openModal(id){ document.getElementById(id).style.display="block"; }
function closeModal(id){ document.getElementById(id).style.display="none"; }

// Company resources
let companyResources={};
fetch('../resources/companyResources.json')
  .then(response=>response.json())
  .then(data=>{ companyResources=data; });
function showResources(){
  const company=document.getElementById('companySelect').value;
  const display=document.getElementById('resourcesDisplay');
  if(company && companyResources[company]){
    let html="<h3>Resources for "+company+"</h3>";
    for(const category in companyResources[company]){
      html+=`<h4>${category}</h4><ul>`;
      companyResources[company][category].forEach(link=>{ html+=`<li><a href="${link}" target="_blank">${link}</a></li>` });
      html+="</ul>";
    }
    display.innerHTML=html;
  } else display.innerHTML="";
}

// DSA tracker
let isPremium=false;
const dsaProblems=["Problem 1","Problem 2","Problem 3","Premium Problem 4"];
const dsaList=document.getElementById('dsaList');
function renderDSA(){
  dsaList.innerHTML="";
  const visibleProblems=isPremium?dsaProblems:dsaProblems.slice(0,3);
  visibleProblems.forEach((p,i)=>{
    let li=document.createElement('li');
    li.innerHTML=`<input type="checkbox" id="p${i}" onchange="updateProgress()"/> ${p}`;
    dsaList.appendChild(li);
  });
}
function updateProgress(){
  const total=dsaList.children.length;
  let done=0;
  for(let i=0;i<total;i++) if(dsaList.children[i].children[0].checked) done++;
  const percent=Math.floor((done/total)*100);
  const progressBar=document.getElementById('progressBar');
  progressBar.style.width=percent+"%";
  progressBar.innerText=percent+"%";
}
renderDSA();

// Premium toggle
function unlockPremiumFeatures(){ isPremium=true; renderDSA(); }
function lockPremiumFeatures(){ isPremium=false; renderDSA(); }

// Razorpay UPI
document.getElementById("payButton").onclick=function(e){
  const options={
    "key":"YOUR_RAZORPAY_KEY",
    "amount":50000,
    "currency":"INR",
    "name":"Placement Hub Premium",
    "description":"Unlock premium features via UPI",
    "handler":function(response){
      alert("Payment successful! ID:"+response.razorpay_payment_id);
      unlockPremiumFeatures();
      logActivity(response.razorpay_payment_id);
    },
    "method":{ "upi":true,"card":false,"netbanking":false,"wallet":false},
    "prefill":{"name":"Student Name","email":"student@example.com"},
    "theme":{"color":"#3399cc"}
  };
  var rzp1=new Razorpay(options); rzp1.open(); e.preventDefault();
}

// Log activity
function logActivity(paymentID){
  fetch('https://your-backend-url.com/log_activity',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({
      email:document.getElementById('email').value,
      isPremium:true,
      paymentID:paymentID,
      featuresUsed:["DSA","Resume","Chatbot"]
    })
  });
}
