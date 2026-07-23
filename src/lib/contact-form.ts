export type ContactFormField = "name" | "email" | "message" | "privacy";

export type ContactFormState = {
  status: "idle" | "success" | "error";
  message: string;
  errors?: Partial<Record<ContactFormField, string>>;
};

export const initialContactFormState: ContactFormState = {
  status: "idle",
  message: "",
};
