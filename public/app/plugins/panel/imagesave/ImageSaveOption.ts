export interface ImageData {
  image: string; //Image base64_encode
  width: number;
  height: number;
}
export interface ImageSaveOption {
  hasLink: boolean;
  linkType?: 'custom' | 'dashboard'; // 'custom' for custom link, 'dashboard' for dashboard
  hyperlink: string;
  linkTitle: string;
  selectedDashboardId?: string; // UID of selected dashboard
  selectedDashboardName?: string; // Name of selected dashboard
  openInNewTab?: boolean; // Open link in new tab
  hasBackground: boolean;
  backgroundColor: string;
  context: ImageData;
  showIsResponsive: boolean; //與尺寸相同
  showIsRatio: boolean; //維持比例
  selectedFileName?: string; // Store the selected filename for persistence
}
