import { ElMessageBox } from "element-plus";
/**
 * @description 操作单条数据信息 (二次确认【删除、禁用、启用、重置密码】)
 * @param {Function} api 操作数据接口的api方法 (必传)
 * @param {Object} params 携带的操作数据参数 {id,params} (必传)
 * @param {String} message 提示信息 (必传)
 * @param {String} title 提示信息 (非必传)
 * @returns {Promise}
 */
export const useHandleData = (api: (params: any) => Promise<any>, params: any = {}, message: string, title?: string) => {
  return new Promise((resolve, reject) => {
    ElMessageBox.alert(message, title ?? "温馨提示", {
      closeOnClickModal: false,
      confirmButtonText: "确定",
      showCancelButton: false,
      type: "",
      beforeClose: async (action, instance, done) => {
        if (action === "confirm") {
          instance.confirmButtonLoading = true;
          try {
            await api(params);
            done();
            resolve(true);
          } catch (error) {
            reject(error);
          } finally {
            instance.confirmButtonLoading = false;
          }
        } else {
          done();
        }
      }
    }).catch(() => {
      return;
    });
  });
};
