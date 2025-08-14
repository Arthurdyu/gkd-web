// ? Element 常用表单校验规则

/**
 *  @rule 手机号
 */
export function checkPhoneNumber(rule: any, value: any, callback: any) {
  const regexp = /^(((13[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(17[3-8]{1})|(18[0-9]{1})|(19[0-9]{1})|(14[5-7]{1}))+\d{8})$/;
  if (!value) callback("请输入手机号");
  if (!regexp.test(value)) {
    callback(new Error("请输入正确的手机号"));
  } else {
    return callback();
  }
}
/**
 *  @rule 邮箱
 */
export const checkEmail = (rule: any, value: any, callback: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!value) callback("请输入邮箱");
  if (!emailRegex.test(value)) {
    callback(new Error("请输入正确的邮箱格式"));
  } else {
    return callback();
  }
};

export const checkEduEmail = (rule: any, value: any, callback: any) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[^.]+\.(edu\.cn)$/;
  if (!value) callback("请输入邮箱");
  if (!emailRegex.test(value)) {
    callback(new Error("请输入以.edu.cn结尾的邮箱"));
  } else {
    return callback();
  }
};

/**
 *  @rule 判断时间晚于当前时间
 */
export function checkAfterNow(rule: any, value: any, callback: any) {
  const selectedDate = new Date(value);
  const currentDate = new Date();

  if (selectedDate <= currentDate) {
    callback(new Error("选择的时间必须晚于当前时间"));
  } else {
    callback();
  }
}
/**
 *  @rule 判断时间早于当前时间
 */
export function checkBeforeNow(rule: any, value: any, callback: any) {
  const selectedDate = new Date(value);
  const currentDate = new Date();

  if (selectedDate >= currentDate) {
    callback(new Error("选择的时间必须早于当前时间"));
  } else {
    callback();
  }
}

/**
 *  @rule 非负数
 */
export function isNonNegativeNumber(value: any) {
  return typeof value === "number" && value > 0;
}

export const ruleLeast =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()-=_+[\]{};':"\\|,.<>?])[A-Za-z\d!@#$%^&*()-=_+[\]{};':"\\|,.<>?]{8,16}$/;

/**
 *  @rule 密码
 */
export function checkPassword(rule: any, value: string, callback: any) {
  if (value === "") callback("请输入密码");
  if (!ruleLeast.test(value)) {
    callback(new Error("密码长度为8-16位，包含数字、字母和符号。"));
  } else {
    return callback();
  }
}
