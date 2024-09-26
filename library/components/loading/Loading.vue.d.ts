import { DefineComponent } from 'vue';

/**
 * **TSVue - Loading**
 *
 * _Tag Samurai Loading Overlay Animation._
 *
 * #### Example
 *
 * Script:
 * ```ts
 * import { Loading, useLoadingStore } from 'wangsvue';
 *
 * const { setLoading } = useLoadingStore();
 *
 * onMounted(() => {
 *    setLoading(true);
 * });
 * ```
 * ---
 * Template:
 * ```html
 * <Loading />
 * ```
 *
 * --- ---
 * ![TSVue](https://www.wangs.id/wp-content/uploads/2023/12/cropped-Logo_Wangsid-removebg-preview-192x192.png)
 *
 * @group form
 */
declare const Loading: DefineComponent;

export default Loading;
