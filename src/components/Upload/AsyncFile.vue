<template>
  <div style="width: 100%">
    <el-upload
      v-model:file-list="_fileList"
      action="#"
      :class="['upload', self_disabled ? 'disabled' : '']"
      :multiple="true"
      :disabled="self_disabled"
      :limit="limit"
      :http-request="handleHttpUpload"
      :before-upload="beforeUpload"
      :on-exceed="handleExceed"
      :on-success="uploadSuccess"
      :on-error="uploadError"
      :on-change="onChange"
      :drag="drag"
      :accept="fileType.join(',')"
      :auto-upload="false"
      ref="uploadRef"
    >
      <slot name="empty">
        <el-icon class="el-icon--upload"><Document /></el-icon>
        <div class="el-upload__text">
          <div>点击或将文件拖拽到这里上传</div>
          <div class="extension">支持扩展名 .xlsx .xls</div>
        </div>
      </slot>

      <template #file="{ file }">
        <div class="flx-align-center" style="padding: 0 4px">
          <div :class="[file.url?.includes('https') ? 'handle-link sle' : 'sle']" @click="openLink(file.url)">
            {{ file?.name }}
          </div>
          <span class="handle-icon" v-show="!self_disabled" @click="handleRemove(file)"> 删除 </span>
        </div>
      </template>
    </el-upload>
    <div class="el-upload__tip">
      <slot name="tip"></slot>
    </div>
  </div>
</template>

<script setup lang="ts" name="AsyncFile">
import { ref, computed, inject, watch } from "vue";
import { uploadFile } from "@/api/modules/upload";
import type { UploadProps, UploadFile, UploadUserFile, UploadRequestOptions, UploadFiles } from "element-plus";
import { ElNotification, formContextKey, formItemContextKey } from "element-plus";

interface UploadFileProps {
  fileList: UploadUserFile[];
  api?: (params: any) => Promise<any>; // 上传的 api 方法，一般项目上传都是同一个 api 方法，在组件里直接引入即可 ==> 非必传
  drag?: boolean; // 是否支持拖拽上传 ==> 非必传（默认为 true）
  disabled?: boolean; // 是否禁用上传组件 ==> 非必传（默认为 false）
  limit?: number; // 最大图片上传数 ==> 非必传（默认为 5张）
  width?: string; // 组件宽度 ==> 非必传（默认为 100%）
  fileSize?: number; // 文件大小限制 ==> 非必传（默认为 5M）
  fileType?: File.ExcelMimeType[] | File.PdfMimeType[]; // 文件类型限制 ==> 非必传（默认为 excel）
  successCallback: () => void; // 上传成功后的回调函数 ==> 必传
}

const props = withDefaults(defineProps<UploadFileProps>(), {
  fileList: () => [],
  drag: true,
  disabled: false,
  limit: 5,
  fileSize: 5,
  width: "100%",
  fileType: () => ["application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"]
});

const errUpload = defineModel<boolean>("errUpload", { required: true });
const uploading = defineModel<boolean>("uploading", { required: true });
// 获取 el-form 组件上下文
const formContext = inject(formContextKey, void 0);
// 获取 el-form-item 组件上下文
const formItemContext = inject(formItemContextKey, void 0);
// 判断是否禁用上传和删除
const self_disabled = computed(() => {
  return props.disabled || formContext?.disabled;
});

const _fileList = ref<UploadUserFile[]>(props.fileList);

// 监听 props.fileList 列表默认值改变
watch(
  () => props.fileList,
  (n: UploadUserFile[]) => {
    _fileList.value = n;
  }
);

/**
 * @description 文件上传之前判断
 * @param rawFile 选择的文件
 * */
const beforeUpload: UploadProps["beforeUpload"] = async rawFile => {
  const fileSize = rawFile.size / 1024 / 1024 < props.fileSize;
  const fileType = (props.fileType as string[]).includes(rawFile.type);
  if (!fileType)
    ElNotification({
      title: "温馨提示",
      message: "上传文件不符合所需的格式！",
      type: "warning"
    });
  if (!fileSize)
    setTimeout(() => {
      ElNotification({
        title: "温馨提示",
        message: `上传文件不能超过 ${props.fileSize}M！`,
        type: "warning"
      });
    }, 0);
  !errUpload.value && (errUpload.value = !fileType || !fileSize);
  return fileType && fileSize;
};

/**
 * @description 上传
 * @param options upload 所有配置项
 * */

const handleHttpUpload = async (options: UploadRequestOptions) => {
  if (errUpload.value) return;
  const formData = new FormData();
  if (options.file.size > 20 * 1024 * 1024)
    ElNotification({
      title: "温馨提示",
      message: `《${options.file.name}》文件为 ${(options.file.size / 1024 / 1024).toFixed(2)}M，数据量大可能导致上传缓慢，请您耐心等待！`,
      type: "info",
      duration: 3000
    });
  formData.append("file", options.file);
  try {
    uploading.value = true;
    const api = props.api ?? uploadFile;
    const { data } = await api(formData);
    options.onSuccess(data);
  } catch (error) {
    errUpload.value = true;
    uploading.value = false;
    options.onError(error as any);
  } finally {
  }
};

/**
 * @description 上传成功
 * @param response 上传响应结果
 * @param uploadFile 上传的文件
 * */
const emit = defineEmits<{
  "update:fileList": [value: UploadUserFile[]];
}>();
const uploadSuccess = (response: { url: string } | undefined, uploadFile: UploadFile) => {
  if (!response) return;
  const index = _fileList.value.findIndex(item => item.uid == uploadFile.uid);
  index > -1 && (_fileList.value[index].url = response.url);
  emit("update:fileList", _fileList.value);
  // 调用 el-form 内部的校验方法（可自动校验）
  formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  props.successCallback?.();
};
const onChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
  if (uploadFiles.find(item => (!item.url && item.raw) || item.url?.includes("blob:"))) {
    _fileList.value = uploadFiles;
    emit("update:fileList", _fileList.value);
    formItemContext?.prop && formContext?.validateField([formItemContext.prop as string]);
  }
};
/**
 * @param file 删除的文件
 * */
const handleRemove = (file: UploadFile) => {
  _fileList.value = _fileList.value.filter(item => item.url !== file.url || item.uid !== file.uid);
  emit("update:fileList", _fileList.value);
};

/**
 * @description 上传错误
 * */
const uploadError = () => {
  ElNotification({
    title: "温馨提示",
    message: "上传失败，请您重新上传！",
    type: "error"
  });
};
/**
 * @description 文件数超出
 * */
const handleExceed = () => {
  ElNotification({
    title: "温馨提示",
    message: `当前最多只能上传 ${props.limit} 个文件，请移除后上传！`,
    type: "warning"
  });
};

function openLink(link) {
  if (link) window.open(link);
  else
    ElNotification({
      title: "温馨提示",
      message: "上传成功后才能预览！",
      type: "warning"
    });
}
const uploadRef = ref();
const submitUpload = async () => {
  if (!props.fileList.find(item => (!item.url && item.raw) || item.url?.includes("blob:"))) return props.successCallback?.();
  await uploadRef.value!.submit();
};

defineExpose({
  submitUpload
});
</script>

<style scoped lang="scss">
.is-error {
  .upload {
    :deep(.el-upload-dragger) {
      border: 1px dashed var(--el-color-danger) !important;
      &:hover {
        border-color: var(--el-color-primary) !important;
      }
    }
  }
}
.upload {
  width: v-bind(width);
}
:deep(.disabled) {
  .el-upload-dragger {
    cursor: not-allowed;
    background: var(--el-disabled-bg-color) !important;
    border: 1px dashed var(--el-border-color-darker);
    &:hover {
      border-color: var(--el-border-color-darker) !important;
    }
  }
}
.el-upload__tip {
  width: v-bind(width);
  line-height: 18px;
  text-align: center;
}
.handle-link {
  cursor: pointer;
  &:hover {
    color: var(--el-color-primary);
  }
}
.handle-icon {
  min-width: fit-content;
  margin-left: auto;
  cursor: pointer;
  &:hover {
    color: red;
  }
}
</style>
