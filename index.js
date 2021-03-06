const express = require("express");
const bcrypt = require("bcrypt");


var app = express();
app.use(express.urlencoded({ extended: false }));
app.set("view engine", "ejs");
app.use( express.static( "./views" ) );




app.get('/', function (req, res) {
  res.render("login",{t:0});
});

app.get('/register', function (req, res) {
    res.render("register",{err:[]});
  });

  let pass_arr={};

  app.post("/register", async (req, res) => {
    let { name,gender,age,email, password, password2 } = req.body;
  
    let phone_no=req.body.phoneno;
    let errors = [];
  
    console.log({
      name,
      gender,
      age,
      phone_no,
      email,
      password,
      password2
    });
  
    if (!name ||!gender|| !age || !phone_no || !email || !password || !password2) {
      errors.push("Please enter all fields" );
    }
  
    if (password.length < 6) {
      errors.push("Password must be a least 6 characters long" );
    }
  
    if (password !== password2) {
      errors.push("Passwords do not match");

    }
    if(pass_arr.hasOwnProperty(email))
    {
      errors.push("User name already exists");          
    }
    
    if (errors.length > 0) {
        console.log("i am in nodeeeey");
        res.render("register", { err:errors});
    } else {
      hashedPassword = await bcrypt.hash(password, 10);
      pass_arr[email]=hashedPassword;
      console.log(pass_arr);
      
      // Validation passed
      res.send("Registered Succesfully !");  
    }
    
  });
  
  app.post(
    "/login",async (req, res) =>{
      e=req.body.email;
      p=req.body.password;
      console.log(e,p);
      if(pass_arr.hasOwnProperty(e))
      {
        bcrypt.compare(p, pass_arr[e], (err, isMatch) => {
            if (err) {
              console.log(err);
            }
            if (isMatch) {
              res.send("Login Successful");
            }
            else{
                // alert("Login Failed");
                res.render("login",{t:1});
                // res.send("Login Failed");
            }
        }
      );

    }
    else{
        // res.send("User does not exists");
        
        res.render("login",{t:1});
    }
    
}
);

app.listen(process.env.PORT || 5000);
