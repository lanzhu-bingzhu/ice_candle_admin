// src/shims-vue-cropper.d.ts
declare module 'vue-cropper' {
  import type { DefineComponent } from 'vue'
  const VueCropper: DefineComponent<any, any, any>
  export { VueCropper }
  export default VueCropper
}