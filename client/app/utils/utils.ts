import type { ZodError, ZodSchema } from 'zod';

type ActionErrors<T> = Partial<Record<keyof T, string>>;

export async function validationAction<ActionInput>({
  request,
  schema,
}: {
  request: Request;
  schema: ZodSchema;
}) {
  const body = Object.fromEntries(await request.formData());
  try {
    const formData = schema.parse(body) as ActionInput;
    return { formData, errors: null };
  } catch (err) {
    const errors = err as ZodError<ActionInput>;
    return {
      formData: body,
      errors: errors.issues.reduce((acc: ActionErrors<ActionInput>, curr) => {
        const key = curr.path[0] as keyof ActionInput;
        acc[key] = curr.message;
        return acc;
      }, {}),
    };
  }
}

// Generate a unique identifier for the temporary wishlist
export const generateTempWishlistId = () => {
  // Here we're using a simple method to generate a unique identifier
  // You may want to use a different method depending on your requirements
  return 'temp-wishlist-' + Math.random().toString(36).substr(2, 9);
};

// Retrieve the temporary wishlist from the user's browser
export const getTempWishlistFromBrowser = () => {
  if (typeof localStorage !== 'undefined') {
    const tempWishlistStr = localStorage.getItem('tempWishlist');
    if (tempWishlistStr) {
      return JSON.parse(tempWishlistStr);
    }
  }
  return null;
};

// Store the temporary wishlist in the user's browser
export const saveTempWishlistToBrowser = (tempWishlist: any) => {
  // Here we're using localStorage to store the temporary wishlist
  // You can use a different method depending on your requirements
  localStorage.setItem('tempWishlist', JSON.stringify(tempWishlist));
};

// Clear the temporary wishlist from the user's browser
export const clearTempWishlistFromBrowser = () => {
  // Here we're using localStorage to store the temporary wishlist
  // You can use a different method depending on your requirements
  localStorage.removeItem('tempWishlist');
};
