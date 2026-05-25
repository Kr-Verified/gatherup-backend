const THEMES = new Set(['midnight', 'forest', 'rose', 'daylight']);
const HEX_COLOR_PATTERN = /^#[0-9a-fA-F]{6}$/;
const MAX_PROFILE_IMAGE_CHARS = 950_000;
const PROFILE_IMAGE_PATTERN = /^data:image\/(?:png|jpe?g|webp|gif);base64,[A-Za-z0-9+/=]+$/;

export function cleanText(value: string, fieldName: string, maxLength: number): string {
  const cleaned = value.replace(/[\u0000-\u001f\u007f]/g, '').trim();
  if (!cleaned) {
    throw new Error(`${fieldName}을 입력해주세요.`);
  }
  if (cleaned.length > maxLength) {
    throw new Error(`${fieldName}은 ${maxLength}자 이하로 입력해주세요.`);
  }
  return cleaned;
}

export function validateLoginId(loginId: string): string {
  const cleaned = loginId.trim();
  if (!/^[a-zA-Z0-9._-]{4,32}$/.test(cleaned)) {
    throw new Error('아이디는 영문, 숫자, ., _, - 조합 4~32자로 입력해주세요.');
  }
  return cleaned;
}

export function validatePassword(password: string): string {
  if (password.length < 8 || password.length > 128) {
    throw new Error('비밀번호는 8자 이상 128자 이하로 입력해주세요.');
  }
  return password;
}

export function validateTheme(theme: string): string {
  if (!THEMES.has(theme)) {
    throw new Error('지원하지 않는 테마입니다.');
  }
  return theme;
}

export function validateHexColor(color: string): string {
  if (!HEX_COLOR_PATTERN.test(color)) {
    throw new Error('색상 값이 올바르지 않습니다.');
  }
  return color.toLowerCase();
}

export function validateProfileImageUrl(profileImageUrl: string | null): string | null {
  if (!profileImageUrl) return null;
  if (profileImageUrl.length > MAX_PROFILE_IMAGE_CHARS) {
    throw new Error('프로필 사진이 너무 큽니다.');
  }
  if (!PROFILE_IMAGE_PATTERN.test(profileImageUrl)) {
    throw new Error('지원하지 않는 프로필 사진 형식입니다.');
  }
  return profileImageUrl;
}

export function validateOptionalAge(age?: number): number | undefined {
  if (age === undefined) return undefined;
  if (!Number.isInteger(age) || age < 1 || age > 120) {
    throw new Error('나이는 1~120 사이의 숫자로 입력해주세요.');
  }
  return age;
}

export function validateOptionalGender(gender?: string): string | undefined {
  if (!gender) return undefined;
  if (!['male', 'female'].includes(gender)) {
    throw new Error('성별 값이 올바르지 않습니다.');
  }
  return gender;
}
