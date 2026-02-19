import React, { useState, useEffect, useRef, useCallback } from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { FilterInput, Button, ConfirmModal, HorizontalGroup, Icon, Modal } from '@grafana/ui';
import Page from 'app/core/components/Page/Page';
import { getNavModel } from 'app/core/selectors/navModel';
import { StoreState } from 'app/types';

function mapStateToProps(state: StoreState) {
  const fileuploadNav = getNavModel(state.navIndex, 'fileupload', {
    main: {
      text: 'File Upload',
      icon: 'upload',
      id: 'fileupload',
      url: '/file-upload',
    },
    node: {
      text: 'File Upload',
      icon: 'upload',
      id: 'fileupload',
      url: '/file-upload',
    },
  });
  
  return {
    navModel: fileuploadNav,
  };
}

const connector = connect(mapStateToProps);

type Props = ConnectedProps<typeof connector>;

interface UploadedFile {
  name: string;
  url: string;
}

const FileUploadPage = ({ navModel }: Props) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [fileToDelete, setFileToDelete] = useState<UploadedFile | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [fileToView, setFileToView] = useState<UploadedFile | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILES = 200;

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDropZoneClick = () => {
    fileInputRef.current?.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      return;
    }
    if (files.length >= MAX_FILES) {
      alert(`Maximum ${MAX_FILES} files allowed. Please delete some files before uploading.`);
      return;
    }
    setUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await fetch('/api/fileupload/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setSelectedFile(null);
        // Reset the file input
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setShowUploadModal(false);
        fetchFiles();
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
    setUploading(false);
  };

  const fetchFiles = async () => {
    try {
      const response = await fetch('/api/fileupload/list');
      if (!response.ok) {
        console.error('Failed to fetch files:', response.status);
        setFiles([]);
        return;
      }
      const data = await response.json();
      setFiles(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to fetch files:', error);
      setFiles([]);
    }
  };

  const handleDeleteFile = async (file: UploadedFile) => {
    try {
      const response = await fetch(`/api/fileupload/delete?name=${encodeURIComponent(file.name)}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }
    setFileToDelete(null);
  };

  const handleDownloadFile = async (file: UploadedFile) => {
    try {
      if (!file.url) {
        alert('File URL not available');
        return;
      }
      const response = await fetch(file.url);
      if (!response.ok) {
        console.error('Download failed:', response.status);
        alert('Failed to download file');
        return;
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to download file:', error);
      alert('Failed to download file');
    }
  };

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Page navModel={navModel}>
      <Page.Contents>
        <>
          {/* Search Bar and Upload Button - Same Line */}
          <div className="page-action-bar">
            <div className="gf-form gf-form--grow">
              <FilterInput
                value={searchTerm}
                onChange={setSearchTerm}
                placeholder="Search file by name..."
              />
            </div>
            {files.length >= MAX_FILES && (
              <div style={{ color: '#ff6b6b', marginRight: '8px', fontSize: '12px' }}>
                Max {MAX_FILES} files reached
              </div>
            )}
            <Button
              variant="primary"
              onClick={() => setShowUploadModal(true)}
              icon="upload"
              disabled={files.length >= MAX_FILES}
              style={{ marginLeft: '8px' }}
            >
              Upload
            </Button>
          </div>

          {/* Upload Modal */}
          {showUploadModal && (
            <Modal
              title="Upload File"
              isOpen={showUploadModal}
              onDismiss={() => {
                setShowUploadModal(false);
                setSelectedFile(null);
              }}
              contentClassName="upload-modal-content"
            >
              <div style={{ padding: '16px', width: 'auto' }}>
                {/* Drag & Drop Zone - Wide and Short */}
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={handleDropZoneClick}
                  style={{
                    border: isDragging ? '2px dashed #3274d9' : '2px dashed #444',
                    borderRadius: '8px',
                    padding: '0',
                    textAlign: 'center',
                    cursor: 'pointer',
                    marginBottom: '16px',
                    backgroundColor: isDragging ? 'rgba(50, 116, 217, 0.08)' : 'transparent',
                    transition: 'all 0.2s ease',
                    width: '100%',
                    height: '150px',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                >
                  <input
                    ref={fileInputRef}
                    id="file-upload-input"
                    type="file"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                  <Icon name="upload" size="xxl" style={{ color: '#888', marginBottom: '16px' }} />
                  <div style={{ color: '#888', fontSize: '14px', padding: '0 16px' }}>
                    {selectedFile ? (
                      <span style={{ color: '#ddd' }}>Selected: <strong>{selectedFile.name}</strong></span>
                    ) : (
                      <>Drag & drop a file here, or <span style={{ color: '#3274d9' }}>click to browse</span></>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowUploadModal(false);
                      setSelectedFile(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="primary"
                    onClick={handleUpload}
                    disabled={uploading || !selectedFile}
                    icon={uploading ? 'fa fa-spinner' : 'upload'}
                  >
                    {uploading ? 'Uploading...' : 'Upload'}
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {/* Files Table */}
          <table className="filter-table form-inline">
            <thead>
              <tr>
                <th>File Name</th>
                <th style={{ width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.length === 0 ? (
                <tr>
                  <td colSpan={2} className="text-center" style={{ padding: '32px 12px', color: '#888' }}>
                    {files.length === 0 ? 'No files uploaded yet.' : 'No files match your search.'}
                  </td>
                </tr>
              ) : (
                filteredFiles.map((file: UploadedFile, idx: number) => (
                  <tr key={idx}>
                    <td className="max-width-10">
                      <span className="ellipsis" title={file.name}>
                        {file.name}
                      </span>
                    </td>
                    <td>
                      <HorizontalGroup spacing="sm">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => {
                            setFileToView(file);
                            setShowViewModal(true);
                          }}
                          icon="eye"
                          title="View"
                          aria-label="View file"
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => handleDownloadFile(file)}
                          icon="download-alt"
                          title="Download"
                          aria-label="Download file"
                        >
                          Download
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => setFileToDelete(file)}
                          icon="times"
                          aria-label="Delete file"
                        />
                      </HorizontalGroup>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          {/* View Modal */}
          {showViewModal && fileToView && (
            <Modal
              title={`View - ${fileToView.name}`}
              isOpen={showViewModal}
              onDismiss={() => {
                setShowViewModal(false);
                setFileToView(null);
              }}
              contentClassName="view-modal-content"
            >
              <div style={{ padding: '16px', width: 'auto' }}>
                {fileToView.url ? (
                  <>
                    {fileToView.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                      <img
                        src={fileToView.url}
                        alt={fileToView.name}
                        style={{ maxWidth: '100%', maxHeight: '500px', borderRadius: '4px' }}
                      />
                    ) : fileToView.name.match(/\.(txt|json|csv)$/i) ? (
                      <iframe
                        src={fileToView.url}
                        style={{
                          width: '100%',
                          height: '500px',
                          border: '1px solid #444',
                          borderRadius: '4px',
                        }}
                        title={fileToView.name}
                      />
                    ) : (
                      <div style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                        <Icon name="file-alt" size="xxxl" style={{ marginBottom: '16px' }} />
                        <p>Document: {fileToView.name}</p>
                        <p style={{ fontSize: '12px' }}>Preview not available for this file type</p>
                        <Button
                          onClick={() => handleDownloadFile(fileToView)}
                          size="lg"
                          variant="primary"
                          icon="download-alt"
                          style={{ marginTop: '16px' }}
                        >
                          Download
                        </Button>
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{ padding: '32px', textAlign: 'center', color: '#888' }}>
                    File URL not available
                  </div>
                )}
                <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button
                    variant="secondary"
                    onClick={() => {
                      setShowViewModal(false);
                      setFileToView(null);
                    }}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </Modal>
          )}

          {Boolean(fileToDelete) && (
            <ConfirmModal
              body={`Are you sure you want to delete file "${fileToDelete?.name}"?`}
              confirmText="Delete"
              title="Delete"
              onDismiss={() => {
                setFileToDelete(null);
              }}
              isOpen={true}
              onConfirm={() => {
                if (!fileToDelete) {
                  return;
                }
                handleDeleteFile(fileToDelete);
              }}
            />
          )}
        </>
      </Page.Contents>
    </Page>
  );
};

export default connector(FileUploadPage);
