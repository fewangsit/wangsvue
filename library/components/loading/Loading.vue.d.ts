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
 * ![TSVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group form
 */
declare const Loading: DefineComponent;

export default Loading;
