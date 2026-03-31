import * as Yup from "yup";

export const validationSchema = Yup.object({
  username: Yup.string()
    .min(4, "Name must be at least 4 characters")
    .max(30, "Name must not exceed 30 characters")
    .required("Name is required"),

  shopname: Yup.string()
    .min(4, "Shop name must be at least 4 characters")
    .max(50, "Shop name must not exceed 50 characters")
    .required("Shop name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  password: Yup.string()
    .min(6, "Password must be at least 6 characters")
    .matches(/[A-Z]/, "At least one uppercase required")
    .matches(/[a-z]/, "At least one lowercase required")
    .matches(/[0-9]/, "At least one number required")
    .matches(/[@$!%*?&]/, "At least one special character required")
});