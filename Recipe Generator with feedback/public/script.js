//handling user login and signup
var userCount = 0;
function validateUser() {
  const firstName = document.getElementById("fname").value;
  const lastName = document.getElementById("lname").value;
  const email = document.getElementById("signup-user-email").value;
  const username = document.getElementById("user_name").value;
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmpassword").value;
  const nameRegex = /^([a-zA-Z]){1,10}$/;
  if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
    alert(
      `name can contain 1 to 10 characters only, no special characters or numbers are allowed`
    );
    return false;
  }
  const emailRegex = /^([a-zA-Z0-9\.]+)@([a-zA-Z]+).com/;
  if (!emailRegex.test(email)) {
    alert(`email is invalid`);
    return false;
  }
  const userRegex = /([a-zA-Z0-9]+)/;
  if (!userRegex.test(username)) {
    alert("username can contain alphabets and numbers only");
    return false;
  }
  const passwordRegex = /^[A-Za-z]\w{7,14}$/;
  if (!passwordRegex.test(password)) {
    alert(
      "password between 6 to 20 characters which contain at least one numeric digit, one uppercase and one lowercase letter"
    );
    return false;
  }
  if (password !== confirmPassword) {
    alert(`passwords to not match`);
    return false;
  }
  if(localStorage.getItem(username)!==null){
    alert("user exist");
    return false;
  }
  if(localStorage.getItem(email)!==null){
    alert("Email exist");
    return false;
  }
  return true;
}
function createAccount() {
  //if (!validateUser()) return;
  const userObject = {
    firstName: document.getElementById("fname").value,
    lastName: document.getElementById("lname").value,
    email : document.getElementById("signup-user-email").value,
    isadmin: false,
    username: document.getElementById("user_name").value,
    password: document.getElementById("password").value,
    login_count:0,
  };
  if(document.getElementById("admin").checked == true){
      userObject.isadmin = true;
  }
  else if(document.getElementById("user").checked == true){
    userObject.isadmin = false;
  }
  console.log(userObject);
  fetch("http://localhost:8081/Signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userObject),
    })
 
   location.href = "http://localhost:8081/login";
}

function loginUser() {
  const login = {
     username : document.getElementById("login-user").value,
     password : document.getElementById("login-password").value,
  };  
  fetch("http://localhost:8081/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(login),
    }).then((res)=>{
      if(res.status==200){
        location.href = "http://localhost:8081/home";
      }
      
      else{
        alert(res.status);
      }
    })
  

}