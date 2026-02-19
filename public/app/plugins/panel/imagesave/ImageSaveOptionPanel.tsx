import React, { FormEvent, useState, useEffect } from 'react';
import { InlineFieldRow, InlineField, FileUpload, VerticalGroup, stylesFactory, Button, Select } from '@grafana/ui';
import { StandardEditorProps } from '@grafana/data';
import { css } from '@emotion/react';
import { ImageData } from './ImageSaveOption';

interface UploadedFile {
  name: string;
  url: string;
}

export const ImageSaveOptionPanel: React.FC<StandardEditorProps<boolean>> = ({
  context,
  item,
  onChange,
}: StandardEditorProps) => {
  const customOptions: any = context.options[item.id] || {};
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch uploaded files on mount
  useEffect(() => {
    fetchUploadedFiles();
  }, []);

  const fetchUploadedFiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch('/api/fileupload/list');
      if (response.ok) {
        const files = await response.json();
        setUploadedFiles(Array.isArray(files) ? files : []);
      }
    } catch (error) {
      console.error('Failed to fetch uploaded files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onUpdateChange = (name: string, value: any): void => {
    customOptions[name] = value;
    onChange(customOptions);
  };

  const convertToBase64 = (file: File): Promise<ImageData> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const img: HTMLImageElement = new Image();
        img.onload = () => {
          const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
          if (canvas === null) {
            return;
          }
          const ctx = canvas.getContext('2d');
          if (ctx === null) {
            return;
          }
          canvas.width = img.width;
          canvas.height = img.height;
          ctx.drawImage(img, 0, 0);
          const base64 = canvas.toDataURL('image/png');
          resolve({
            image: base64,
            width: img.width,
            height: img.height,
          });
        };
        const result = event.target?.result;
        if (typeof result === 'string') {
          img.src = result;
        }
      };
      reader.onerror = function (event: ProgressEvent<FileReader>) {
        reject(event.target?.error);
      };
      reader.readAsDataURL(file);
    });
  };

  const onFileUpload = (event: FormEvent<HTMLInputElement>) => {
    const files = (event.target as HTMLInputElement).files;
    if (!files || files.length === 0) {
      return;
    }
    const file: File = files[0];
    convertToBase64(file)
      .then((imageData: ImageData) => {
        onUpdateChange('image', imageData.image);
        onUpdateChange('width', imageData.width);
        onUpdateChange('height', imageData.height);
        onUpdateChange('selectedFileName', '');
      })
      .catch((error) => {
        console.error('Error converting to base64:', error);
      });
  };

  const handleSelectUploadedFile = (option: any) => {
    if (!option) {
      onUpdateChange('selectedFileName', '');
      return;
    }
    const file = uploadedFiles.find((f) => f.name === option.value);
    if (file) {
      // Save the selected filename
      onUpdateChange('selectedFileName', file.name);

      // Fetch the image and convert to base64
      fetch(file.url)
        .then((response) => response.blob())
        .then((blob) => {
          const reader = new FileReader();
          reader.onload = (event) => {
            const result = event.target?.result;
            if (typeof result === 'string') {
              const img = new Image();
              img.onload = () => {
                const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
                if (canvas === null) {
                  return;
                }
                const ctx = canvas.getContext('2d');
                if (ctx === null) {
                  return;
                }
                canvas.width = img.width;
                canvas.height = img.height;
                ctx.drawImage(img, 0, 0);
                const base64 = canvas.toDataURL('image/png');
                onUpdateChange('image', base64);
                onUpdateChange('width', img.width);
                onUpdateChange('height', img.height);
              };
              img.src = result;
            }
          };
          reader.readAsDataURL(blob);
        })
        .catch((error) => {
          console.error('Failed to load image:', error);
        });
    }
  };

  const fileOptions = uploadedFiles
    .filter((f) => f.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
    .map((f) => ({
      label: f.name,
      value: f.name,
    }));

  const selectedOption =
    fileOptions.find((opt) => opt.value === customOptions.selectedFileName) || null;

  const handleDownloadImage = () => {
    if (customOptions.image) {
      try {
        // Convert base64 to blob
        const base64Data = customOptions.image.split(',')[1] || customOptions.image;
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: 'image/png' });

        // Create object URL and trigger download
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = customOptions.selectedFileName || 'image.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Clean up the object URL
        setTimeout(() => URL.revokeObjectURL(url), 100);
      } catch (error) {
        console.error('Error downloading image:', error);
      }
    }
  };

  const handleViewImage = () => {
    if (customOptions.image) {
      // Open image in new tab
      const newTab = window.open();
      if (newTab) {
        newTab.document.write(`<img src="${customOptions.image}" style="max-width: 100%; max-height: 100%;">`);
      }
    }
  };

  const styles = getStyles(customOptions);
  return (
    <VerticalGroup spacing="lg">
      <h5 style={{ marginBottom: 0 }}>Image Settings</h5>

      {uploadedFiles.length > 0 && (
        <InlineField
          label="Select from uploaded"
          labelWidth={20}
          grow
        >
          <Select
            options={fileOptions}
            value={selectedOption}
            onChange={handleSelectUploadedFile}
            placeholder="Select from uploaded images"
            isClearable
            isLoading={isLoading}
          />
        </InlineField>
      )}

      <div>
        <h6 style={{ marginBottom: '8px' }}>Upload new image</h6>
        <InlineFieldRow aria-label="Image Upload">
          <FileUpload accept="image/*" onFileUpload={onFileUpload}>
            Upload Image File
          </FileUpload>
        </InlineFieldRow>
      </div>

      <div className="gf-form-group">
        <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', fontWeight: 500 }}>
          Preview
        </label>
        <canvas id="canvas" className={styles.canvas.toString()}></canvas>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <Button variant="secondary" size="sm" onClick={handleViewImage} disabled={!customOptions.image}>
          View
        </Button>
        <Button variant="secondary" size="sm" onClick={handleDownloadImage} disabled={!customOptions.image}>
          Download
        </Button>
        <Button variant="secondary" size="sm" onClick={() => {
          onUpdateChange('image', '');
          onUpdateChange('selectedFileName', '');
        }}>
          Clear Image
        </Button>
      </div>
    </VerticalGroup>
  );
};
const getStyles = stylesFactory((options) => {
  return {
    canvas: css`
      border: 2px dashed #666;
      width: 100%;
      max-width: 400px;
      height: auto;
      background-color: rgba(0, 0, 0, 0.2);
      border-radius: 4px;
    `,
  };
});
