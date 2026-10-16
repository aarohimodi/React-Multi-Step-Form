import React, { useRef, useState } from "react";

// import "./App.css";

function App() {
  const [image, setImage] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [touched, setTouched] = useState({});
  const imgRef = useRef(null);
  const [ans, setAns] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    pass: "",
    cpass: "",
    mobile: "",
    msg: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    pass: "",
    cpass: "",
    mobile: "",
    msg: "",
    image: "",
    captcha: "",
  });
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const captachGenerate = () => {
    let num1 = Math.floor(Math.random() * 10);
    let num2 = Math.floor(Math.random() * 10);
    setNum1(num1);
    setNum2(num2);
  };

  const formstep1 = () => {
    const nameErr = formLogic("name", form.name);
    const emailErr = formLogic("email", form.email);
    if (nameErr) {
      setErrors((prev) => ({ ...prev, name: nameErr }));
      setTouched((prev) => ({ ...prev, name: true }));
    }
    if (emailErr) {
      setErrors((prev) => ({ ...prev, email: emailErr }));
      setTouched((prev) => ({ ...prev, email: true }));
    }
    if (nameErr || emailErr) {
      return false;
    } else {
      setTouched({});
      return true;
    }
  };
  const formstep2 = () => {
    let passerr = formLogic("pass", form.pass);
    let cpasserr = formLogic("cpass", form.cpass);
    let mobileerr = formLogic("mobile", form.mobile);
    if (passerr) {
      setErrors((prev) => ({ ...prev, pass: passerr }));
      setTouched((prev) => ({ ...prev, pass: true }));
    }

    if (cpasserr) {
      setErrors((prev) => ({ ...prev, cpass: cpasserr }));
      setTouched((prev) => ({ ...prev, cpass: true }));
    }
    if (mobileerr) {
      setErrors((prev) => ({ ...prev, mobile: mobileerr }));
      setTouched((prev) => ({ ...prev, mobile: true }));
    }

    if (passerr || cpasserr || mobileerr) {
      return false;
    } else {
      setTouched({});
      return true;
    }
  };

  const maxSize = 2 * 1024 * 1024;

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) {
      setErrors((prev) => ({ ...prev, image: "Please Upload The image" }));
      return;
    }
    if (file.size > maxSize) {
      setErrors((prev) => ({ ...prev, image: "Image size should be 2MB" }));
      setImage(null);
      return;
    }
    if (!file.type.startsWith("image")) {
      setErrors((prev) => ({ ...prev, image: "file should be image" }));
      setImage(null);
      return;
    }

    setErrors((prev) => ({ ...prev, image: "" }));
    setImage(file);
  };
  const handleChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setTouched({ ...touched, [name]: true });
    setForm({ ...form, [name]: value });
    let err = formLogic(name, value);
    setErrors({ ...errors, [name]: err });

    if (name === "pass" && form.cpass) {
      const checkPass =
        value !== form.cpass
          ? "Password and Confirm Password Doen't Matched"
          : "";
      setErrors((prev) => ({ ...prev, cpass: checkPass }));
    }
  };
  const handleBlur = (e) => {
    const name = e.target.name;
    const value = e.target.value;

    const err = formLogic(name, value);
    setErrors({ ...errors, [name]: err });
  };
  const formLogic = (name, value) => {
    let err = "";
    let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === "name") {
      if (!value.trim()) {
        err = "Name is Required";
      }
    }
    if (name === "email") {
      if (!value.trim()) {
        err = "Email is Required";
      } else if (!emailRegex.test(value)) {
        err = "Email Format is Incorrect";
      }
    }
    if (name === "pass") {
      if (!value.trim()) {
        err = "Password is Required";
      } else if (value.length < 8) {
        err = "Password length must be 8 or above";
      } else if (!/[A-Z]/.test(value)) {
        err = "Password must contain at least one capital letter ";
      } else if (!/\d/.test(value)) {
        err = "Password must contain at least one number";
      } else if (!/[^A-Za-z0-9]/.test(value)) {
        err = "Password must contain at least one Special character ";
      }
    }
    if (name === "cpass") {
      if (!value.trim()) {
        err = "Confirm Password is Required";
      }
      if (value !== form.pass) {
        err = "password and confirm password should be matched";
      }
    }
    if (name === "mobile") {
      if (!value.trim()) {
        err = "Mobile Required";
      } else if (!/^\d{10}$/.test(value)) {
        err = "Mobile number should 10 digits only";
      }
    }
    return err;
  };
  const submitLogic = () => {
    let newError = {};
    let Alltouched = {};

    Object.keys(form).forEach((t) => {
      Alltouched[t] = true;
    });
    setTouched(Alltouched);

    Object.keys(form).forEach((data) => {
      let err = formLogic(data, form[data]);
      if (err) {
        newError[data] = err;
      }
    });
    if (!image) {
      newError.image = "Image is Required";
    }
    if (ans) {
      if (num1 + num2 !== Number(ans)) {
        newError.captcha = "Captcha is Incorrect";
      }
    }
    return newError;
  };
  const handleSubmitForm = (e) => {
    e.preventDefault();

    let err = submitLogic();
    setErrors(err);
    if (Object.keys(err).length > 0) {
      return;
    } else {
      alert("Form Submitted Successfully");
      setForm({
        name: "",
        email: "",
        pass: "",
        cpass: "",
        mobile: "",
        msg: "",
      });
      setErrors({
        name: "",
        email: "",
        pass: "",
        cpass: "",
        mobile: "",
        msg: "",
        image: "",
      });
      setTouched({});
      setImage(null);
      imgRef.current.value = "";
    }
  };

  return (
    <>
      <div
        className="w-[50%] px-2 md:px-10 flex flex-col mt-10 mx-auto justify-center 
  bg-white/10 
  backdrop-blur-xl 
  border border-white/20 
  shadow-2xl 
  rounded-2xl 
  py-30"
      >
        <form onSubmit={handleSubmitForm}>
          {currentStep === 1 && (
            <>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Name</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                {touched.name && errors.name && (
                  <p className="text-red-500">{errors.name}</p>
                )}
              </div>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Email</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                {touched.email && errors.email && (
                  <p className="text-red-500">{errors.email}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div></div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      formstep1() && setCurrentStep((prev) => prev + 1);
                    }}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:scale-105 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Password</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="password"
                  name="pass"
                  value={form.pass}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                {touched.pass && errors.pass && (
                  <p className="text-red-500">{errors.pass}</p>
                )}
              </div>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Confirm Password</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="password"
                  name="cpass"
                  value={form.cpass}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                {touched.cpass && errors.cpass && (
                  <p className="text-red-500">{errors.cpass}</p>
                )}
              </div>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Mobile</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="tel"
                  name="mobile"
                  value={form.mobile}
                  onChange={(e) => handleChange(e)}
                  onBlur={(e) => handleBlur(e)}
                />
                {touched.mobile && errors.mobile && (
                  <p className="text-red-500">{errors.mobile}</p>
                )}
              </div>
              <div className="flex justify-between items-center">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) {
                        setCurrentStep((prev) => prev - 1);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-300 text-black"
                  >
                    Back
                  </button>
                </div>
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (formstep2()) {
                        setCurrentStep((prev) => prev + 1);
                        captachGenerate();
                      }
                    }}
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:scale-105 transition"
                  >
                    Next
                  </button>
                </div>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Image</label>
                <input
                  ref={imgRef}
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={(e) => handleFile(e)}
                />
              </div>
              {errors.image && <p className="text-red-500">{errors.image}</p>}
              {image && (
                <>
                  <div className="relative">
                    <img src={URL.createObjectURL(image)} className="w-30" />
                    <button
                      type="button"
                      onClick={() => {
                        setImage(null);
                        imgRef.current.value = "";
                      }}
                      className="text-[13px] flex items-center justify-center w-5 h-5 bg-red-500 text-white rounded-full absolute left-0 top-0"
                    >
                      X
                    </button>
                  </div>
                </>
              )}
              <div className="flex flex-col text-left mb-3">
                <label className="text-white font-bold">Message</label>
                <input
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  type="text"
                  name="msg"
                  value={form.msg}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="flex gap-4 w-[40%] mb-10">
                <div className="bg-white text-black p-4 w-[300px]">
                  {num1} + {num2}
                </div>
                <input
                  type="text"
                  className="w-full bg-white/10 border border-white/30 rounded-lg py-3 px-3 mt-2 text-white outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30"
                  value={ans}
                  onChange={(e) => setAns(e.target.value)}
                />
              </div>
              {errors.captcha && (
                <p className="text-red-500">{errors.captcha}</p>
              )}
              <div className="flex justify-between items-center">
                <div>
                  <button
                    type="button"
                    onClick={() => {
                      if (currentStep > 1) {
                        setCurrentStep((prev) => prev - 1);
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-gray-300 text-black"
                  >
                    Back
                  </button>
                </div>
                <div>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg hover:scale-105 transition"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </>
          )}
        </form>
      </div>
    </>
  );
}

export default App;
