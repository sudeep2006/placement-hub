const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

function signup(){
  const email=document.getElementById('email').value;
  const password=document.getElementById('password').value;
  auth.createUserWithEmailAndPassword(email,password)
    .then((userCredential)=>{
      const user=userCredential.user;
      const startDate=new Date();
      const trialEnd=new Date();
      trialEnd.setDate(startDate.getDate()+3);
      db.collection("users").doc(user.uid).set({
        email:email,
        isPremium:true,
        trialEnd:trialEnd.toISOString()
      });
      alert("Sign up successful! 3-day trial activated.");
      showMainContent();
    })
    .catch(error=>alert(error.message));
}

function login(){
  const email=document.getElementById('email').value;
  const password=document.getElementById('password').value;
  auth.signInWithEmailAndPassword(email,password)
    .then((userCredential)=>{
      const user=userCredential.user;
      checkTrial(user.uid);
    })
    .catch(error=>alert(error.message));
}

function checkTrial(uid){
  db.collection("users").doc(uid).get().then((doc)=>{
    if(doc.exists){
      const data=doc.data();
      const now=new Date();
      const trialEnd=new Date(data.trialEnd);
      if(now <= trialEnd){ unlockPremiumFeatures(); alert("Trial active! Premium unlocked"); }
      else { lockPremiumFeatures(); alert("Trial ended. Only basic features."); }
      showMainContent();
    }
  });
}

function showMainContent(){
  document.getElementById('authModal').style.display="none";
  document.getElementById('mainContent').style.display="block";
}
