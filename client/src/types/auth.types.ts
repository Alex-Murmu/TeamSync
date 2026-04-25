export const UserRole = {
  ADMIN: "Admin",
  USER: "User",
  MANAGER: "Manager",
  MEMBER: "User",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

export interface SignupFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole | string;
}

export interface SignupFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  role?: string;
  submit?: string;
}

export interface SignupFormTouched {
  firstName?: boolean;
  lastName?: boolean;
  email?: boolean;
  password?: boolean;
  role?: boolean;
}

export interface SignupFormState {
  data: SignupFormData;
  errors: SignupFormErrors;
  touched: SignupFormTouched;
  isSubmitting: boolean;
}

export const validateField = (
  fieldName: keyof SignupFormData,
  value: string
): string | undefined => {
  if (fieldName === "firstName" && value.trim().length < 2) {
    return "First name must be at least 2 characters";
  }

  if (fieldName === "lastName" && value.trim().length < 2) {
    return "Last name must be at least 2 characters";
  }

  if (fieldName === "email") {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Please enter a valid email address";
    }
  }

  if (fieldName === "password" && value.length < 8) {
    return "Password must be at least 8 characters";
  }

  if (fieldName === "role" && !value) {
    return "Please select a role";
  }

  return undefined;
};

export const validateSignupForm = (
  data: SignupFormData
): SignupFormErrors => {
  const errors: SignupFormErrors = {};

  const firstNameError = validateField("firstName", data.firstName);
  const lastNameError = validateField("lastName", data.lastName);
  const emailError = validateField("email", data.email);
  const passwordError = validateField("password", data.password);
  const roleError = validateField("role", String(data.role));

  if (firstNameError) {
    errors.firstName = firstNameError;
  }
  if (lastNameError) {
    errors.lastName = lastNameError;
  }
  if (emailError) {
    errors.email = emailError;
  }
  if (passwordError) {
    errors.password = passwordError;
  }
  if (roleError) {
    errors.role = roleError;
  }

  return errors;
};