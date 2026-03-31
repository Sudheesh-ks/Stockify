export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  // min 6 chars, uppercase, lowercase, number, special character
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
  return passwordRegex.test(password);
};

export const isValidUsername = (username: string): boolean => {
  // 4–30 characters (letters, numbers, spaces allowed)
  const usernameRegex = /^[A-Za-z0-9 ]{4,30}$/;
  return usernameRegex.test(username);
};

export const isValidShopname = (shopname: string): boolean => {
  // 4–50 characters (letters, numbers, spaces allowed)
  const shopnameRegex = /^[A-Za-z0-9 ]{4,50}$/;
  return shopnameRegex.test(shopname);
};