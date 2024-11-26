import { ClassComponent } from '../ts-helpers.d';

export type File = {
  _id: string;
  name: string;
  type: string;
  src: string;
  createdAt: string;
};

export interface GalleryPreviewProps {
  files: File[];
}

/**
 * **WangsVue - GalleryPreview**
 *
 * --- ---
 * ![WangsVue](https://ik.imagekit.io/kurniadev/TS-HEAD-BLACK.png)
 *
 * @group Component
 *
 * @experimental
 */
declare class GalleryPreview extends ClassComponent<
  GalleryPreviewProps,
  unknown,
  unknown
> {}

export default GalleryPreview;
