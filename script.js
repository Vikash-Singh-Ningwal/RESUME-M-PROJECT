

document.addEventListener("DOMContentLoaded", function () {
    emailjs.init("Dcib2pvjZ0_SF0Byi"); // Replace with your EmailJS Public Key
    let email_status ;
    const signupForm = document.getElementById("signupForm");
    const sendOtpBtn = document.getElementById("sendOtpBtn");
    let generatedOTP = "";
    async function validateEmail2(email) {
        const errorDiv = document.getElementById('emailError');
        const emailExists = await findEmail(email);
        if (!emailExists) {
          errorDiv.innerText = "🚫 Email doesn't exist";
          return true;
        } else {
          errorDiv.innerText = "✅ Email found!";
          return false;
        }
      }
      async function findEmail(email) {
        const apiKey = ''; // 🔑 Replace with your actual API key
        const url = `https://emailvalidation.abstractapi.com/v1/?api_key=${apiKey}&email=${email}`;
  
        try {
          const response = await fetch(url, { method: 'GET' });
          if (!response.ok) throw new Error(`❌ HTTP error! Status: ${response.status}`);
  
          const data = await response.json();
          if (data.deliverability === 'DELIVERABLE') {
            email_status = true;
            // alert("Email exist");
            return true; // ✅ Email is valid
  
          } else {
            email_status = false;
            // alert("🚫 Email doesn't exist");
            return false; // 🚫 Invalid email
          }
        } catch (err) {
          console.error('❌ Fetch error:', err);
          return false; // Consider invalid if there's an error
        }
      }
    function validateForm() {
        let isValid = true;

          // Username validation
    const username = document.getElementById("username").value.trim();
    const usernamePattern = /^(?=.*[\d_])[a-zA-Z\d_]{3,}$/; // At least one number or underscore and 3+ characters

    if (!usernamePattern.test(username)) {
        document.getElementById("usernameError").innerText = 
            "Username must be at least 3 characters & contain a number or '_'.";
        isValid = false;
    } else {
        document.getElementById("usernameError").innerText = "";
    }
        // Email validation
        const email = document.getElementById("email").value.trim();
        const emailPattern = validateEmail2(email);


        // Password validation
        const password = document.getElementById("password").value;
        const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
        if (!passwordPattern.test(password)) {
            document.getElementById("passwordError").innerText = "Password must be at least 6 characters, contain a number, an uppercase letter, and a special character.";
            isValid = false;
        } else {
            document.getElementById("passwordError").innerText = "";
        }

        
        // Confirm Password validation
        const confirmPassword = document.getElementById("confirmPassword").value;
        if (password !== confirmPassword) {
            document.getElementById("confirmPasswordError").innerText = "Passwords do not match.";
            isValid = false;
        } else {
            document.getElementById("confirmPasswordError").innerText = "";
        }

        return isValid;
    }

    // ✅ Send OTP via Email
    sendOtpBtn.addEventListener("click", function () {
        const email = document.getElementById("email").value.trim();
        if (!email || !email_status) {
            document.getElementById("emailError").innerText = "Enter a valid email.";
            return;
        }

        generatedOTP = Math.floor(100000 + Math.random() * 900000).toString();
        sessionStorage.setItem("otp", generatedOTP); // Store OTP temporarily

        emailjs.send("service_5dh5fz8", "template_sd957xt", {
            to_email: email,
            otp_code: generatedOTP
        }).then(() => {
            alert("OTP sent successfully!");
        }).catch((err) => {
            console.error("Error sending OTP:", err);
            alert("Failed to send OTP. Try again.");
        });
    });

    // ✅ Form Submission with Validation
    signupForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if (!validateForm()) return;

        const enteredOTP = document.getElementById("otp").value;
        const storedOTP = sessionStorage.getItem("otp");

        if (enteredOTP !== storedOTP || !enteredOTP) {
            document.getElementById("otpError").innerText = "Invalid OTP.";
            return;
        }

        alert("Signup successful!");
        sessionStorage.removeItem("otp"); // Clear OTP after successful signup
        const name = document.getElementById("username").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value;
        fetch('http://localhost:3000/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
          })
            .then(res => res.text())
            .then(data => {
              alert(data);
              if (data.includes('✅ Signup successful!')) {
                  // ✅ Redirect to form.html
                  window.location.href = './Templates.html';
              }
            })
  
            .catch(err => console.error('❌ Error:', err));
       

      
      
    });

    // ✅ Real-time Validation
    document.getElementById("username").addEventListener("input", validateForm);
    document.getElementById("email").addEventListener("input", validateForm);
    document.getElementById("password").addEventListener("input", validateForm);
    document.getElementById("confirm_password").addEventListener("input", validateForm);

});
// document.getElementById("confirm_password").addEventListener("input", validateForm);
