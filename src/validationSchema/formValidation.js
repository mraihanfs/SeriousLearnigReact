import * as yup from "yup";

export const loginSchema = yup.object().shape({
  username: yup
    .string()
    .email("Please fill with email format")
    .required("Please fill in the email"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Please fill in the password"),
});

export const registerSchema = yup.object().shape({
  username: yup
    .string()
    .email("Please fill with email format")
    .required("Please fill in the email"),
  full_name: yup.string().required("Please fill in the full name"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .required("Please fill in the password"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords do not match! ❌")
    .required("Please fill in the confirmation password"),
  tnc: yup
    .boolean()
    .oneOf([true], "Please fill this terms and conditions before continue"),
});


export const brandSchema = yup.object().shape({
  brandName: yup.string().required("Nama Brand tidak boleh kosong"),
  websiteUrl: yup
    .string()
    .url("Mohon isi dengan menggunakan format url seperti: https://www.example.com")
    .required("Mohon input website url dari brand tersebut"),
  description: yup.string().optional(),
});

export const productSchema = yup.object().shape({
  product_name: yup.string().required("Nama Produk tidak boleh kosong"),
  product_images: yup
    .string()
    .url("Mohon isi dengan menggunakan format url seperti: https://www.example.com")
    .required("Mohon input url dari gambar produk"),
  product_amount: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Harga produk harus dalam bentuk angka")
    .required("Mohon input harga produk"),
  unit_of_measure: yup
    .string()
    .required("Mohon unit dapat di isi terlebih dahulu"),
  brand_id: yup.string().required("Mohon brand dapat di isi terlebih dahulu"),
  product_description: yup.string().optional(),
  quantity: yup
    .number()
    .transform((value, originalValue) =>
      originalValue === "" ? undefined : value
    )
    .typeError("Jumlah stok harus dalam bentuk angka")
    .required("Mohon input jumlah stok yang dimiliki"),
});
