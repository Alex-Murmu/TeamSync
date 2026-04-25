import { useState, useCallback } from "react";
import type {
  SignupFormData,
  SignupFormState,
} from "@/types/auth.types";
import { UserRole, validateField, validateSignupForm } from "@/types/auth.types";

/**
 * ============================================
 * CUSTOM HOOK: useSignupForm
 * ============================================
 * 
 * This hook encapsulates all form state and logic
 * Handles:
 *  - Form data state
 *  - Real-time validation
 *  - Field-level errors
 *  - Touched state (shows errors only for fields user has interacted with)
 *  - Form submission
 * 
 * PROFESSIONAL APPROACH:
 * - Separates form logic from component logic (reusable)
 * - Provides consistent state structure
 * - Enables easy testing
 * - Follows React hooks best practices
 */

interface UseSignupFormProps {
  onSubmit?: (data: SignupFormData) => Promise<void>;
}

export const useSignupForm = ({ onSubmit }: UseSignupFormProps = {}) => {
  const [state, setState] = useState<SignupFormState>({
    data: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      role: UserRole.MEMBER,
    },
    errors: {},
    touched: {},
    isSubmitting: false,
  });

  /**
   * Handle individual field changes
   * - Updates state data
   * - Performs real-time validation
   * - Marks field as touched
   */
  const handleChange = useCallback(
    (fieldName: keyof SignupFormData, value: string) => {
      setState((prevState) => {
        const newData = {
          ...prevState.data,
          [fieldName]: value,
        };

        // Real-time validation
        const error = validateField(fieldName, value);

        return {
          ...prevState,
          data: newData,
          errors: {
            ...prevState.errors,
            [fieldName]: error,
          },
        };
      });
    },
    []
  );

  /**
   * Mark field as touched (for showing errors)
   * Only show validation errors for fields user has interacted with
   */
  const handleBlur = useCallback((fieldName: keyof SignupFormData) => {
    setState((prevState) => ({
      ...prevState,
      touched: {
        ...prevState.touched,
        [fieldName]: true,
      },
    }));
  }, []);

  /**
   * Handle form submission
   * - Validate entire form
   * - Call onSubmit callback
   * - Handle errors
   */
  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      // Validate entire form
      const errors = validateSignupForm(state.data);

      if (Object.keys(errors).length > 0) {
        setState((prevState) => ({
          ...prevState,
          errors,
          touched: {
            firstName: true,
            lastName: true,
            email: true,
            password: true,
            role: true,
          },
        }));
        return;
      }

      // Start submission
      setState((prevState) => ({
        ...prevState,
        isSubmitting: true,
      }));

      try {
        if (onSubmit) {
          await onSubmit(state.data);
        }
      } catch (error) {
        console.error("Signup error:", error);
        setState((prevState) => ({
          ...prevState,
          errors: {
            ...prevState.errors,
            submit: error instanceof Error ? error.message : "Signup failed",
          },
          isSubmitting: false,
        }));
      }
    },
    [state.data, onSubmit]
  );

  /**
   * Reset form to initial state
   */
  const resetForm = useCallback(() => {
    setState({
      data: {
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        role: UserRole.MEMBER,
      },
      errors: {},
      touched: {},
      isSubmitting: false,
    });
  }, []);

  /**
   * Get error message for a field
   * Only show if field has been touched
   */
  const getFieldError = (fieldName: keyof SignupFormData): string | undefined => {
    if (state.touched[fieldName]) {
      return state.errors[fieldName];
    }
    return undefined;
  };

  return {
    // Form state
    ...state,
    
    // Form methods
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    
    // Helpers
    getFieldError,
  };
};
