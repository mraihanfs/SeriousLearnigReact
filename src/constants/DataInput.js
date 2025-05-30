export const SEMBAKO_UNITS = [
  "kg",
  "g",
  "sack",
  "L",
  "mL",
  "bottle",
  "piece",
  "tray",
  "pack",
  "box",
  "cylinder",
  "bag",
  "pack",
  "jar",
];

export const CUSTOMER_TYPES = [
  "Restoran",
  "Kafe",
  "Hotel",
  "Warung Makan",
  "Penginapan",
];

export const FORM_VALIDATION = (transaction) => ({
  title: `${transaction} Failed`,
  description: `${transaction} failed. Check your credentials and try again.`,
});

export const VALIDATION_ERROR = (transaction) => ({
  title: `${transaction} Failed"`,
  description: `${transaction} failed. Please try again later.`,
});

export const VALIDATION_SUCCESS_LOGIN = {
  title: "Login Success",
  description: "Login success. Please click Ok to Continue",
};

export const VALIDATION_ERROR_ADD = {
  title: "Menambahkan data gagal",
  description: "Mohon isi kembali form yang masih kosong atau kurang sesuai",
};

export const VALIDATION_ERROR_UPDATE = {
  title: "Mengubah data gagal",
  description: "Mohon isi kembali form yang masih kosong atau kurang sesuai",
};

export const VALIDATION_ERROR_LOGOUT = {
  title: "Logout Failed",
  description: "Logout failed. Please try again later",
};

export const VALIDATION_ERROR_REGIST = {
  title: "Register Failed",
  description: "Register failed. Please try again later",
};
