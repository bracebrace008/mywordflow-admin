export const LOCAL_ADMIN_EMAIL = 'admin@mywordflow.app';
export const LOCAL_ADMIN_PASSWORD = 'admin1234';

export function resolveLocalLoginPrefill(isLocal: boolean) {
  if (!isLocal) {
    return undefined;
  }

  return {
    email: LOCAL_ADMIN_EMAIL,
    password: LOCAL_ADMIN_PASSWORD,
  };
}
