import { useFormik } from "formik";
import Joi from "joi";
import { useState } from "react";
import usersService from "../../services/users";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const Registration = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const form = useFormik({
    validateOnMount: true,
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validate: function (values) {
      const schema = Joi.object({
        username: Joi.string().min(2).max(255).required(),
        email: Joi.string()
          .min(6)
          .max(1024)
          .email({ tlds: { allow: false } })
          .required(),
        password: Joi.string().min(6).max(1024).required(),
        confirmPassword: Joi.string().min(6).max(1024).required(),
      });

      const { error } = schema.validate(values, { abortEarly: false });
      if (!error) {
        return null;
      }

      const errors = {};

      for (const detail of error.details) {
        errors[detail.path[0]] = detail.message;
      }

      return errors;
    },
    async onSubmit(values) {
      const { password, confirmPassword } = values;
      if (password !== confirmPassword) {
        setError("The passwords not match");
        return;
      }
      const user = {
        username: values.username,
        email: values.email,
        password: values.password,
      };
      try {
        const response = await usersService.createUser(user);
        
        // toast(data.message, {
        //   position: "top-center",
        //   autoClose: 5000,
        //   hideProgressBar: false,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   progress: undefined,
        //   theme: "dark",
        // });
        navigate("/login");
      } catch ({ response }) {
        setError(response.data.message);
      }
    },
  });
  return (
    <div className="container pb-5 min-vh-100">
      <div className="d-flex  justify-content-center align-items-center py-4">
        <div className="text-center page-header ">Register</div>
      </div>

      {error ? (
        <div className="alert alert-danger text-center">{error}</div>
      ) : (
        ""
      )}

      <div className="d-flex justify-content-center main-form-page">
        <div className=" container form-container">
          <div className="row">
            <form
              className="p-4 col-md-8"
              noValidate
              onSubmit={form.handleSubmit}
            >
              <h3 className="text-white  mb-4">Account details</h3>

              <label htmlFor="username" className="label mb-2">
                Username (required)
              </label>
              <br />
              <input
                className="input mb-3"
                type="text"
                id="username"
                {...form.getFieldProps("username")}
                error={form.touched.username && form.errors.email}
              />

              <label htmlFor="email" className="label mb-2">
                Email address (required)
              </label>
              <br />
              <input
                className="input mb-3"
                type="email"
                id="email"
                {...form.getFieldProps("email")}
                error={form.touched.email && form.errors.email}
              />

              <label htmlFor="password" className="label mb-2">
                Choose a password (required)
              </label>
              <br />
              <input
                className="input mb-3"
                type="password"
                id="password"
                {...form.getFieldProps("password")}
                error={form.touched.password && form.errors.password}
              />

              <label htmlFor="confirm-password" className="label mb-2">
                Confirm password (required)
              </label>
              <br />
              <input
                className="input mb-3"
                type="password"
                id="confirm-password"
                {...form.getFieldProps("confirmPassword")}
                error={
                  form.touched.confirmPassword && form.errors.confirmPassword
                }
              />

              <button
                className="btn btn-block w-100 btn-danger mt-3"
                type="submit"
              >
                Submit
              </button>
            </form>
            <div className="semi-login col-md-4 d-flex flex-column">
              <h3 className="semi-login-headline text-center my-4">
                Do you have an account already?
              </h3>
              <div className="flex-fill  d-flex justify-content-center align-items-center mb-5">
                <Link
                  to="/login"
                  className=" login-btn col-lg-5  col-md-8 col-sm-10 col-10 text-center  "
                >
                  Login
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
