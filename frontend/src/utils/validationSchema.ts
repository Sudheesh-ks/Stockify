import * as Yup from 'yup';

// ── Auth schemas ──────────────────────────────────────────────────────────────

export const loginSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

export const registerSchema = Yup.object({
  email: Yup.string().email('Invalid email format').required('Email is required'),
  username: Yup.string()
    .min(4, 'Name must be at least 4 characters')
    .max(30, 'Name must not exceed 30 characters')
    .required('Name is required'),
  shopname: Yup.string()
    .min(4, 'Shop name must be at least 4 characters')
    .max(50, 'Shop name must not exceed 50 characters')
    .required('Shop name is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .matches(/[A-Z]/, 'At least one uppercase required')
    .matches(/[a-z]/, 'At least one lowercase required')
    .matches(/[0-9]/, 'At least one number required')
    .matches(/[@$!%*?&]/, 'At least one special character required')
    .required('Password is required'),
});

// Legacy alias — kept so other files importing validationSchema still work
export const validationSchema = registerSchema;

export const validateEmail = (value: string) => {
  if (!value) return 'Email is required';
  if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
  return '';
};

export const SaleSchema = Yup.object().shape({
  items: Yup.array()
    .of(
      Yup.object().shape({
        productId: Yup.string().required('Product is required'),
        quantity: Yup.number().min(1, 'Min 1').required('Req'),
      }),
    )
    .min(1, 'Add at least one product'),
  customerName: Yup.string().optional(),
  date: Yup.date().required('Date is required'),
});

export const ProductSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too short!').required('Required'),
  description: Yup.string().min(5, 'Too short!').required('Required'),
  quantity: Yup.number().min(0).required('Required'),
  price: Yup.number().min(0).required('Required'),
});

export const CustomerSchema = Yup.object().shape({
  name: Yup.string().min(2, 'Too short!').required('Required'),
  address: Yup.string().min(5, 'Too short!').required('Required'),
  mobile: Yup.string()
    .matches(/^[0-9]+$/, 'Must be only digits')
    .min(10, 'Invalid mobile number')
    .required('Required'),
});
