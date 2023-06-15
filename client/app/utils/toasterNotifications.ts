import toast from 'react-hot-toast';

export const successToaster = (message: string) => toast.success(message);
export const errorToaster = (message: string) => toast.error(message);
export const goodJobToaster = (message: string) =>
  toast(message, {
    icon: '👏',
  });
export const promiseToaster = (
  promise: any,
  loadingMessage: string,
  successMessage: string,
  errorMessage: string
) =>
  toast.promise(promise, {
    loading: loadingMessage,
    success: successMessage,
    error: errorMessage,
  });
