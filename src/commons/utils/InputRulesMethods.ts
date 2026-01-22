export function verifyPasswordRules(pw: string): boolean {
  if (typeof pw != 'string') return false;
  if (pw.length < 8 || pw.length > 16) return false;
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*-_]).{8,}$/;
  return regex.test(pw);
}
