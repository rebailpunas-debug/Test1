import React from 'react';
import { css } from '@emotion/react';
import { stylesFactory } from '@grafana/ui';
import { PanelProps } from '@grafana/data';
import { getConfig } from 'app/core/config';
import { ImageSaveOption, ImageData } from './ImageSaveOption';
interface Props extends PanelProps<ImageSaveOption> {}

export const ImageSavePanel: React.FC<Props> = ({ options, width, height }) => {
  // let showData = data.series.length > 0;
  const styles = getStyles(options);
  // console.log('options', options);
  const picWidth = width;
  const picHeight = height;

  let { image: imageContext }: ImageData = options.context;
  const imageAttr: any = {};
  if (options.showIsResponsive) {
    const windowAspectRatio = picWidth / picHeight;
    const imageAspectRatio = options.context.width / options.context.height;

    if (imageAspectRatio > windowAspectRatio) {
      imageAttr.width = picWidth;
    } else {
      imageAttr.width = picHeight * imageAspectRatio;
    }
    if (!options.showIsRatio) {
      imageAttr.width = picWidth;
      imageAttr.height = picHeight;
    }
  }
  
  // Determine the link URL based on link type
  let linkUrl = '';
  let linkTitle = options.linkTitle || '';
  let linkTarget = options.openInNewTab ? '_blank' : '_self';
  
  if (options.hasLink) {
    if (options.linkType === 'dashboard' && options.selectedDashboardId) {
      // Build dashboard URL
      const appSubUrl = getConfig().appSubUrl || '';
      linkUrl = `${appSubUrl}/d/${options.selectedDashboardId}`;
      linkTitle = options.selectedDashboardName || options.selectedDashboardId;
    } else if (options.linkType === 'custom') {
      linkUrl = options.hyperlink;
    }
  }
  
  const imageEle = <img className={styles.mainImage.toString()} src={imageContext} {...imageAttr} />;
  const outputEle = options.hasLink && linkUrl ? (
    <a href={linkUrl} target={linkTarget} className={styles.hyperlink.toString()} title={linkTitle}>
      {imageEle}
    </a>
  ) : (
    <div className={styles.container.toString()}>{imageEle}</div>
  );
  return <div className={styles.wrapper.toString()}>{outputEle}</div>;
};

const getStyles = stylesFactory((options) => {
  return {
    wrapper: css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      overflow: hidden;
    `,
    hyperlink: css`
      display: flex;
      align-items: center;
      justify-content: center;
      width: 100%;
      height: 100%;
      text-decoration: none;
      cursor: pointer;
      padding: 0;
      margin: 0;
      overflow: hidden;
    `,
    container: css`
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0;
      margin: 0;
      overflow: hidden;
    `,
    mainImage: css`
      display: block;
      background-color: ${options.hasBackground ? options.backgroundColor : 'transparent'};
      max-width: 100%;
      max-height: 100%;
      width: auto;
      height: auto;
      object-fit: contain;
    `,
  };
});

