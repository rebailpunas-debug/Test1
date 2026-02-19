"use strict";
(self["webpackChunkgrafana"] = self["webpackChunkgrafana"] || []).push([["FileUploadPage"],{

/***/ "./public/app/features/fileupload/FileUploadPage.tsx":
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__("./.yarn/cache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/index.js");
/* harmony import */ var react_redux__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__("./.yarn/__virtual__/react-redux-virtual-7ad20a440e/0/cache/react-redux-npm-7.2.6-134f5ed64d-0bf142ce0d.zip/node_modules/react-redux/es/index.js");
/* harmony import */ var _grafana_ui__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__("./packages/grafana-ui/src/index.ts");
/* harmony import */ var app_core_components_Page_Page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__("./public/app/core/components/Page/Page.tsx");
/* harmony import */ var app_core_selectors_navModel__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__("./public/app/core/selectors/navModel.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__("./.yarn/cache/react-npm-17.0.2-99ba37d931-b254cc17ce.zip/node_modules/react/jsx-runtime.js");
var _th;










function mapStateToProps(state) {
  const fileuploadNav = (0,app_core_selectors_navModel__WEBPACK_IMPORTED_MODULE_4__.getNavModel)(state.navIndex, 'fileupload', {
    main: {
      text: 'File Upload',
      icon: 'upload',
      id: 'fileupload',
      url: '/file-upload'
    },
    node: {
      text: 'File Upload',
      icon: 'upload',
      id: 'fileupload',
      url: '/file-upload'
    }
  });
  return {
    navModel: fileuploadNav
  };
}

const connector = (0,react_redux__WEBPACK_IMPORTED_MODULE_1__.connect)(mapStateToProps);

const FileUploadPage = ({
  navModel
}) => {
  const [selectedFile, setSelectedFile] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [uploading, setUploading] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [files, setFiles] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [searchTerm, setSearchTerm] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  const [fileToDelete, setFileToDelete] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [isDragging, setIsDragging] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showUploadModal, setShowUploadModal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [showViewModal, setShowViewModal] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const [fileToView, setFileToView] = (0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const fileInputRef = (0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const MAX_FILES = 200;
  (0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    fetchFiles();
  }, []);

  const handleFileChange = e => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDragOver = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);
  const handleDragLeave = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);
  const handleDrop = (0,react__WEBPACK_IMPORTED_MODULE_0__.useCallback)(e => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  }, []);

  const handleDropZoneClick = () => {
    var _fileInputRef$current;

    (_fileInputRef$current = fileInputRef.current) === null || _fileInputRef$current === void 0 ? void 0 : _fileInputRef$current.click();
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
        body: formData
      });

      if (response.ok) {
        setSelectedFile(null); // Reset the file input

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

  const handleDeleteFile = async file => {
    try {
      const response = await fetch(`/api/fileupload/delete?name=${encodeURIComponent(file.name)}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error('Failed to delete file:', error);
    }

    setFileToDelete(null);
  };

  const handleDownloadFile = async file => {
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

  const filteredFiles = files.filter(file => file.name.toLowerCase().includes(searchTerm.toLowerCase()));
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(app_core_components_Page_Page__WEBPACK_IMPORTED_MODULE_3__["default"], {
    navModel: navModel,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(app_core_components_Page_Page__WEBPACK_IMPORTED_MODULE_3__["default"].Contents, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
          className: "page-action-bar",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
            className: "gf-form gf-form--grow",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.FilterInput, {
              value: searchTerm,
              onChange: setSearchTerm,
              placeholder: "Search file by name..."
            })
          }), files.length >= MAX_FILES && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              color: '#ff6b6b',
              marginRight: '8px',
              fontSize: '12px'
            },
            children: ["Max ", MAX_FILES, " files reached"]
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
            variant: "primary",
            onClick: () => setShowUploadModal(true),
            icon: "upload",
            disabled: files.length >= MAX_FILES,
            style: {
              marginLeft: '8px'
            },
            children: "Upload"
          })]
        }), showUploadModal && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
          title: "Upload File",
          isOpen: showUploadModal,
          onDismiss: () => {
            setShowUploadModal(false);
            setSelectedFile(null);
          },
          contentClassName: "upload-modal-content",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              padding: '16px',
              width: 'auto'
            },
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop,
              onClick: handleDropZoneClick,
              style: {
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
                alignItems: 'center'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("input", {
                ref: fileInputRef,
                id: "file-upload-input",
                type: "file",
                onChange: handleFileChange,
                style: {
                  display: 'none'
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Icon, {
                name: "upload",
                size: "xxl",
                style: {
                  color: '#888',
                  marginBottom: '16px'
                }
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
                style: {
                  color: '#888',
                  fontSize: '14px',
                  padding: '0 16px'
                },
                children: selectedFile ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("span", {
                  style: {
                    color: '#ddd'
                  },
                  children: ["Selected: ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("strong", {
                    children: selectedFile.name
                  })]
                }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
                  children: ["Drag & drop a file here, or ", /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                    style: {
                      color: '#3274d9'
                    },
                    children: "click to browse"
                  })]
                })
              })]
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
              style: {
                display: 'flex',
                justifyContent: 'flex-end',
                gap: '8px'
              },
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "secondary",
                onClick: () => {
                  setShowUploadModal(false);
                  setSelectedFile(null);
                },
                children: "Cancel"
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "primary",
                onClick: handleUpload,
                disabled: uploading || !selectedFile,
                icon: uploading ? 'fa fa-spinner' : 'upload',
                children: uploading ? 'Uploading...' : 'Upload'
              })]
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("table", {
          className: "filter-table form-inline",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("thead", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
              children: [_th || (_th = /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                children: "File Name"
              })), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
                style: {
                  width: '120px'
                },
                children: "Actions"
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tbody", {
            children: filteredFiles.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tr", {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                colSpan: 2,
                className: "text-center",
                style: {
                  padding: '32px 12px',
                  color: '#888'
                },
                children: files.length === 0 ? 'No files uploaded yet.' : 'No files match your search.'
              })
            }) : filteredFiles.map((file, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                className: "max-width-10",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("span", {
                  className: "ellipsis",
                  title: file.name,
                  children: file.name
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.HorizontalGroup, {
                  spacing: "sm",
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                    size: "sm",
                    variant: "secondary",
                    onClick: () => {
                      setFileToView(file);
                      setShowViewModal(true);
                    },
                    icon: "eye",
                    title: "View",
                    "aria-label": "View file",
                    children: "View"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                    size: "sm",
                    variant: "secondary",
                    onClick: () => handleDownloadFile(file),
                    icon: "download-alt",
                    title: "Download",
                    "aria-label": "Download file",
                    children: "Download"
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                    size: "sm",
                    variant: "destructive",
                    onClick: () => setFileToDelete(file),
                    icon: "times",
                    "aria-label": "Delete file"
                  })]
                })
              })]
            }, idx))
          })]
        }), showViewModal && fileToView && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Modal, {
          title: `View - ${fileToView.name}`,
          isOpen: showViewModal,
          onDismiss: () => {
            setShowViewModal(false);
            setFileToView(null);
          },
          contentClassName: "view-modal-content",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
            style: {
              padding: '16px',
              width: 'auto'
            },
            children: [fileToView.url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.Fragment, {
              children: fileToView.name.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("img", {
                src: fileToView.url,
                alt: fileToView.name,
                style: {
                  maxWidth: '100%',
                  maxHeight: '500px',
                  borderRadius: '4px'
                }
              }) : fileToView.name.match(/\.(txt|json|csv)$/i) ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("iframe", {
                src: fileToView.url,
                style: {
                  width: '100%',
                  height: '500px',
                  border: '1px solid #444',
                  borderRadius: '4px'
                },
                title: fileToView.name
              }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
                style: {
                  padding: '32px',
                  textAlign: 'center',
                  color: '#888'
                },
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Icon, {
                  name: "file-alt",
                  size: "xxxl",
                  style: {
                    marginBottom: '16px'
                  }
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("p", {
                  children: ["Document: ", fileToView.name]
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
                  style: {
                    fontSize: '12px'
                  },
                  children: "Preview not available for this file type"
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                  onClick: () => handleDownloadFile(fileToView),
                  size: "lg",
                  variant: "primary",
                  icon: "download-alt",
                  style: {
                    marginTop: '16px'
                  },
                  children: "Download"
                })]
              })
            }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              style: {
                padding: '32px',
                textAlign: 'center',
                color: '#888'
              },
              children: "File URL not available"
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
              style: {
                marginTop: '24px',
                display: 'flex',
                justifyContent: 'flex-end'
              },
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.Button, {
                variant: "secondary",
                onClick: () => {
                  setShowViewModal(false);
                  setFileToView(null);
                },
                children: "Close"
              })
            })]
          })
        }), Boolean(fileToDelete) && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_grafana_ui__WEBPACK_IMPORTED_MODULE_2__.ConfirmModal, {
          body: `Are you sure you want to delete file "${fileToDelete === null || fileToDelete === void 0 ? void 0 : fileToDelete.name}"?`,
          confirmText: "Delete",
          title: "Delete",
          onDismiss: () => {
            setFileToDelete(null);
          },
          isOpen: true,
          onConfirm: () => {
            if (!fileToDelete) {
              return;
            }

            handleDeleteFile(fileToDelete);
          }
        })]
      })
    })
  });
};

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (connector(FileUploadPage));

/***/ })

}]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,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O0FBQUEscUNBQ0UsdURBQUMsK0NBQUQ7QUFDRSx1QkFBTyxFQUFDLFdBRFY7QUFFRSx1QkFBTyxFQUFFLE1BQU07QUFDYjFFLGtCQUFBQSxnQkFBZ0IsQ0FBQyxLQUFELENBQWhCO0FBQ0FFLGtCQUFBQSxhQUFhLENBQUMsSUFBRCxDQUFiO0FBQ0QsaUJBTEg7QUFBQTtBQUFBO0FBREYsY0ExQ0Y7QUFBQTtBQVRGLFVBdktKLEVBeU9HaUYsT0FBTyxDQUFDMUYsWUFBRCxDQUFQLGlCQUNDLHVEQUFDLHFEQUFEO0FBQ0UsY0FBSSxFQUFHLHlDQUF3Q0EsWUFBekMsYUFBeUNBLFlBQXpDLHVCQUF5Q0EsWUFBWSxDQUFFK0MsSUFBSyxJQURwRTtBQUVFLHFCQUFXLEVBQUMsUUFGZDtBQUdFLGVBQUssRUFBQyxRQUhSO0FBSUUsbUJBQVMsRUFBRSxNQUFNO0FBQ2Y5QyxZQUFBQSxlQUFlLENBQUMsSUFBRCxDQUFmO0FBQ0QsV0FOSDtBQU9FLGdCQUFNLEVBQUUsSUFQVjtBQVFFLG1CQUFTLEVBQUUsTUFBTTtBQUNmLGdCQUFJLENBQUNELFlBQUwsRUFBbUI7QUFDakI7QUFDRDs7QUFDRDRDLFlBQUFBLGdCQUFnQixDQUFDNUMsWUFBRCxDQUFoQjtBQUNEO0FBYkgsVUExT0o7QUFBQTtBQURGO0FBREYsSUFERjtBQWlRRCxDQS9ZRDs7QUFpWkEsaUVBQWVWLFNBQVMsQ0FBQ0MsY0FBRCxDQUF4QiIsInNvdXJjZXMiOlsid2VicGFjazovL2dyYWZhbmEvLi9wdWJsaWMvYXBwL2ZlYXR1cmVzL2ZpbGV1cGxvYWQvRmlsZVVwbG9hZFBhZ2UudHN4Il0sInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBSZWFjdCwgeyB1c2VTdGF0ZSwgdXNlRWZmZWN0LCB1c2VSZWYsIHVzZUNhbGxiYWNrIH0gZnJvbSAncmVhY3QnO1xuaW1wb3J0IHsgY29ubmVjdCwgQ29ubmVjdGVkUHJvcHMgfSBmcm9tICdyZWFjdC1yZWR1eCc7XG5pbXBvcnQgeyBGaWx0ZXJJbnB1dCwgQnV0dG9uLCBDb25maXJtTW9kYWwsIEhvcml6b250YWxHcm91cCwgSWNvbiwgTW9kYWwgfSBmcm9tICdAZ3JhZmFuYS91aSc7XG5pbXBvcnQgUGFnZSBmcm9tICdhcHAvY29yZS9jb21wb25lbnRzL1BhZ2UvUGFnZSc7XG5pbXBvcnQgeyBnZXROYXZNb2RlbCB9IGZyb20gJ2FwcC9jb3JlL3NlbGVjdG9ycy9uYXZNb2RlbCc7XG5pbXBvcnQgeyBTdG9yZVN0YXRlIH0gZnJvbSAnYXBwL3R5cGVzJztcblxuZnVuY3Rpb24gbWFwU3RhdGVUb1Byb3BzKHN0YXRlOiBTdG9yZVN0YXRlKSB7XG4gIGNvbnN0IGZpbGV1cGxvYWROYXYgPSBnZXROYXZNb2RlbChzdGF0ZS5uYXZJbmRleCwgJ2ZpbGV1cGxvYWQnLCB7XG4gICAgbWFpbjoge1xuICAgICAgdGV4dDogJ0ZpbGUgVXBsb2FkJyxcbiAgICAgIGljb246ICd1cGxvYWQnLFxuICAgICAgaWQ6ICdmaWxldXBsb2FkJyxcbiAgICAgIHVybDogJy9maWxlLXVwbG9hZCcsXG4gICAgfSxcbiAgICBub2RlOiB7XG4gICAgICB0ZXh0OiAnRmlsZSBVcGxvYWQnLFxuICAgICAgaWNvbjogJ3VwbG9hZCcsXG4gICAgICBpZDogJ2ZpbGV1cGxvYWQnLFxuICAgICAgdXJsOiAnL2ZpbGUtdXBsb2FkJyxcbiAgICB9LFxuICB9KTtcbiAgXG4gIHJldHVybiB7XG4gICAgbmF2TW9kZWw6IGZpbGV1cGxvYWROYXYsXG4gIH07XG59XG5cbmNvbnN0IGNvbm5lY3RvciA9IGNvbm5lY3QobWFwU3RhdGVUb1Byb3BzKTtcblxudHlwZSBQcm9wcyA9IENvbm5lY3RlZFByb3BzPHR5cGVvZiBjb25uZWN0b3I+O1xuXG5pbnRlcmZhY2UgVXBsb2FkZWRGaWxlIHtcbiAgbmFtZTogc3RyaW5nO1xuICB1cmw6IHN0cmluZztcbn1cblxuY29uc3QgRmlsZVVwbG9hZFBhZ2UgPSAoeyBuYXZNb2RlbCB9OiBQcm9wcykgPT4ge1xuICBjb25zdCBbc2VsZWN0ZWRGaWxlLCBzZXRTZWxlY3RlZEZpbGVdID0gdXNlU3RhdGU8RmlsZSB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbdXBsb2FkaW5nLCBzZXRVcGxvYWRpbmddID0gdXNlU3RhdGUoZmFsc2UpO1xuICBjb25zdCBbZmlsZXMsIHNldEZpbGVzXSA9IHVzZVN0YXRlPFVwbG9hZGVkRmlsZVtdPihbXSk7XG4gIGNvbnN0IFtzZWFyY2hUZXJtLCBzZXRTZWFyY2hUZXJtXSA9IHVzZVN0YXRlKCcnKTtcbiAgY29uc3QgW2ZpbGVUb0RlbGV0ZSwgc2V0RmlsZVRvRGVsZXRlXSA9IHVzZVN0YXRlPFVwbG9hZGVkRmlsZSB8IG51bGw+KG51bGwpO1xuICBjb25zdCBbaXNEcmFnZ2luZywgc2V0SXNEcmFnZ2luZ10gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93VXBsb2FkTW9kYWwsIHNldFNob3dVcGxvYWRNb2RhbF0gPSB1c2VTdGF0ZShmYWxzZSk7XG4gIGNvbnN0IFtzaG93Vmlld01vZGFsLCBzZXRTaG93Vmlld01vZGFsXSA9IHVzZVN0YXRlKGZhbHNlKTtcbiAgY29uc3QgW2ZpbGVUb1ZpZXcsIHNldEZpbGVUb1ZpZXddID0gdXNlU3RhdGU8VXBsb2FkZWRGaWxlIHwgbnVsbD4obnVsbCk7XG4gIGNvbnN0IGZpbGVJbnB1dFJlZiA9IHVzZVJlZjxIVE1MSW5wdXRFbGVtZW50PihudWxsKTtcbiAgY29uc3QgTUFYX0ZJTEVTID0gMjAwO1xuXG4gIHVzZUVmZmVjdCgoKSA9PiB7XG4gICAgZmV0Y2hGaWxlcygpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlRmlsZUNoYW5nZSA9IChlOiBSZWFjdC5DaGFuZ2VFdmVudDxIVE1MSW5wdXRFbGVtZW50PikgPT4ge1xuICAgIGlmIChlLnRhcmdldC5maWxlcyAmJiBlLnRhcmdldC5maWxlc1swXSkge1xuICAgICAgc2V0U2VsZWN0ZWRGaWxlKGUudGFyZ2V0LmZpbGVzWzBdKTtcbiAgICB9XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlRHJhZ092ZXIgPSB1c2VDYWxsYmFjaygoZTogUmVhY3QuRHJhZ0V2ZW50PEhUTUxEaXZFbGVtZW50PikgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHNldElzRHJhZ2dpbmcodHJ1ZSk7XG4gIH0sIFtdKTtcblxuICBjb25zdCBoYW5kbGVEcmFnTGVhdmUgPSB1c2VDYWxsYmFjaygoZTogUmVhY3QuRHJhZ0V2ZW50PEhUTUxEaXZFbGVtZW50PikgPT4ge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIHNldElzRHJhZ2dpbmcoZmFsc2UpO1xuICB9LCBbXSk7XG5cbiAgY29uc3QgaGFuZGxlRHJvcCA9IHVzZUNhbGxiYWNrKChlOiBSZWFjdC5EcmFnRXZlbnQ8SFRNTERpdkVsZW1lbnQ+KSA9PiB7XG4gICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgc2V0SXNEcmFnZ2luZyhmYWxzZSk7XG4gICAgaWYgKGUuZGF0YVRyYW5zZmVyLmZpbGVzICYmIGUuZGF0YVRyYW5zZmVyLmZpbGVzWzBdKSB7XG4gICAgICBzZXRTZWxlY3RlZEZpbGUoZS5kYXRhVHJhbnNmZXIuZmlsZXNbMF0pO1xuICAgIH1cbiAgfSwgW10pO1xuXG4gIGNvbnN0IGhhbmRsZURyb3Bab25lQ2xpY2sgPSAoKSA9PiB7XG4gICAgZmlsZUlucHV0UmVmLmN1cnJlbnQ/LmNsaWNrKCk7XG4gIH07XG5cbiAgY29uc3QgaGFuZGxlVXBsb2FkID0gYXN5bmMgKCkgPT4ge1xuICAgIGlmICghc2VsZWN0ZWRGaWxlKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChmaWxlcy5sZW5ndGggPj0gTUFYX0ZJTEVTKSB7XG4gICAgICBhbGVydChgTWF4aW11bSAke01BWF9GSUxFU30gZmlsZXMgYWxsb3dlZC4gUGxlYXNlIGRlbGV0ZSBzb21lIGZpbGVzIGJlZm9yZSB1cGxvYWRpbmcuYCk7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIHNldFVwbG9hZGluZyh0cnVlKTtcbiAgICBjb25zdCBmb3JtRGF0YSA9IG5ldyBGb3JtRGF0YSgpO1xuICAgIGZvcm1EYXRhLmFwcGVuZCgnZmlsZScsIHNlbGVjdGVkRmlsZSk7XG5cbiAgICB0cnkge1xuICAgICAgY29uc3QgcmVzcG9uc2UgPSBhd2FpdCBmZXRjaCgnL2FwaS9maWxldXBsb2FkL3VwbG9hZCcsIHtcbiAgICAgICAgbWV0aG9kOiAnUE9TVCcsXG4gICAgICAgIGJvZHk6IGZvcm1EYXRhLFxuICAgICAgfSk7XG5cbiAgICAgIGlmIChyZXNwb25zZS5vaykge1xuICAgICAgICBzZXRTZWxlY3RlZEZpbGUobnVsbCk7XG4gICAgICAgIC8vIFJlc2V0IHRoZSBmaWxlIGlucHV0XG4gICAgICAgIGlmIChmaWxlSW5wdXRSZWYuY3VycmVudCkge1xuICAgICAgICAgIGZpbGVJbnB1dFJlZi5jdXJyZW50LnZhbHVlID0gJyc7XG4gICAgICAgIH1cbiAgICAgICAgc2V0U2hvd1VwbG9hZE1vZGFsKGZhbHNlKTtcbiAgICAgICAgZmV0Y2hGaWxlcygpO1xuICAgICAgfVxuICAgIH0gY2F0Y2ggKGVycm9yKSB7XG4gICAgICBjb25zb2xlLmVycm9yKCdVcGxvYWQgZmFpbGVkOicsIGVycm9yKTtcbiAgICB9XG4gICAgc2V0VXBsb2FkaW5nKGZhbHNlKTtcbiAgfTtcblxuICBjb25zdCBmZXRjaEZpbGVzID0gYXN5bmMgKCkgPT4ge1xuICAgIHRyeSB7XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKCcvYXBpL2ZpbGV1cGxvYWQvbGlzdCcpO1xuICAgICAgaWYgKCFyZXNwb25zZS5vaykge1xuICAgICAgICBjb25zb2xlLmVycm9yKCdGYWlsZWQgdG8gZmV0Y2ggZmlsZXM6JywgcmVzcG9uc2Uuc3RhdHVzKTtcbiAgICAgICAgc2V0RmlsZXMoW10pO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBkYXRhID0gYXdhaXQgcmVzcG9uc2UuanNvbigpO1xuICAgICAgc2V0RmlsZXMoQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEgOiBbXSk7XG4gICAgfSBjYXRjaCAoZXJyb3IpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ0ZhaWxlZCB0byBmZXRjaCBmaWxlczonLCBlcnJvcik7XG4gICAgICBzZXRGaWxlcyhbXSk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURlbGV0ZUZpbGUgPSBhc3luYyAoZmlsZTogVXBsb2FkZWRGaWxlKSA9PiB7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHJlc3BvbnNlID0gYXdhaXQgZmV0Y2goYC9hcGkvZmlsZXVwbG9hZC9kZWxldGU/bmFtZT0ke2VuY29kZVVSSUNvbXBvbmVudChmaWxlLm5hbWUpfWAsIHtcbiAgICAgICAgbWV0aG9kOiAnREVMRVRFJyxcbiAgICAgIH0pO1xuICAgICAgaWYgKHJlc3BvbnNlLm9rKSB7XG4gICAgICAgIGZldGNoRmlsZXMoKTtcbiAgICAgIH1cbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRlbGV0ZSBmaWxlOicsIGVycm9yKTtcbiAgICB9XG4gICAgc2V0RmlsZVRvRGVsZXRlKG51bGwpO1xuICB9O1xuXG4gIGNvbnN0IGhhbmRsZURvd25sb2FkRmlsZSA9IGFzeW5jIChmaWxlOiBVcGxvYWRlZEZpbGUpID0+IHtcbiAgICB0cnkge1xuICAgICAgaWYgKCFmaWxlLnVybCkge1xuICAgICAgICBhbGVydCgnRmlsZSBVUkwgbm90IGF2YWlsYWJsZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCByZXNwb25zZSA9IGF3YWl0IGZldGNoKGZpbGUudXJsKTtcbiAgICAgIGlmICghcmVzcG9uc2Uub2spIHtcbiAgICAgICAgY29uc29sZS5lcnJvcignRG93bmxvYWQgZmFpbGVkOicsIHJlc3BvbnNlLnN0YXR1cyk7XG4gICAgICAgIGFsZXJ0KCdGYWlsZWQgdG8gZG93bmxvYWQgZmlsZScpO1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBjb25zdCBibG9iID0gYXdhaXQgcmVzcG9uc2UuYmxvYigpO1xuICAgICAgY29uc3QgdXJsID0gd2luZG93LlVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG4gICAgICBjb25zdCBsaW5rID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnYScpO1xuICAgICAgbGluay5ocmVmID0gdXJsO1xuICAgICAgbGluay5kb3dubG9hZCA9IGZpbGUubmFtZTtcbiAgICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQobGluayk7XG4gICAgICBsaW5rLmNsaWNrKCk7XG4gICAgICBkb2N1bWVudC5ib2R5LnJlbW92ZUNoaWxkKGxpbmspO1xuICAgICAgd2luZG93LlVSTC5yZXZva2VPYmplY3RVUkwodXJsKTtcbiAgICB9IGNhdGNoIChlcnJvcikge1xuICAgICAgY29uc29sZS5lcnJvcignRmFpbGVkIHRvIGRvd25sb2FkIGZpbGU6JywgZXJyb3IpO1xuICAgICAgYWxlcnQoJ0ZhaWxlZCB0byBkb3dubG9hZCBmaWxlJyk7XG4gICAgfVxuICB9O1xuXG4gIGNvbnN0IGZpbHRlcmVkRmlsZXMgPSBmaWxlcy5maWx0ZXIoKGZpbGUpID0+XG4gICAgZmlsZS5uYW1lLnRvTG93ZXJDYXNlKCkuaW5jbHVkZXMoc2VhcmNoVGVybS50b0xvd2VyQ2FzZSgpKVxuICApO1xuXG4gIHJldHVybiAoXG4gICAgPFBhZ2UgbmF2TW9kZWw9e25hdk1vZGVsfT5cbiAgICAgIDxQYWdlLkNvbnRlbnRzPlxuICAgICAgICA8PlxuICAgICAgICAgIHsvKiBTZWFyY2ggQmFyIGFuZCBVcGxvYWQgQnV0dG9uIC0gU2FtZSBMaW5lICovfVxuICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFnZS1hY3Rpb24tYmFyXCI+XG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImdmLWZvcm0gZ2YtZm9ybS0tZ3Jvd1wiPlxuICAgICAgICAgICAgICA8RmlsdGVySW5wdXRcbiAgICAgICAgICAgICAgICB2YWx1ZT17c2VhcmNoVGVybX1cbiAgICAgICAgICAgICAgICBvbkNoYW5nZT17c2V0U2VhcmNoVGVybX1cbiAgICAgICAgICAgICAgICBwbGFjZWhvbGRlcj1cIlNlYXJjaCBmaWxlIGJ5IG5hbWUuLi5cIlxuICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICB7ZmlsZXMubGVuZ3RoID49IE1BWF9GSUxFUyAmJiAoXG4gICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICcjZmY2YjZiJywgbWFyZ2luUmlnaHQ6ICc4cHgnLCBmb250U2l6ZTogJzEycHgnIH19PlxuICAgICAgICAgICAgICAgIE1heCB7TUFYX0ZJTEVTfSBmaWxlcyByZWFjaGVkXG4gICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgKX1cbiAgICAgICAgICAgIDxCdXR0b25cbiAgICAgICAgICAgICAgdmFyaWFudD1cInByaW1hcnlcIlxuICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRTaG93VXBsb2FkTW9kYWwodHJ1ZSl9XG4gICAgICAgICAgICAgIGljb249XCJ1cGxvYWRcIlxuICAgICAgICAgICAgICBkaXNhYmxlZD17ZmlsZXMubGVuZ3RoID49IE1BWF9GSUxFU31cbiAgICAgICAgICAgICAgc3R5bGU9e3sgbWFyZ2luTGVmdDogJzhweCcgfX1cbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgVXBsb2FkXG4gICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICA8L2Rpdj5cblxuICAgICAgICAgIHsvKiBVcGxvYWQgTW9kYWwgKi99XG4gICAgICAgICAge3Nob3dVcGxvYWRNb2RhbCAmJiAoXG4gICAgICAgICAgICA8TW9kYWxcbiAgICAgICAgICAgICAgdGl0bGU9XCJVcGxvYWQgRmlsZVwiXG4gICAgICAgICAgICAgIGlzT3Blbj17c2hvd1VwbG9hZE1vZGFsfVxuICAgICAgICAgICAgICBvbkRpc21pc3M9eygpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRTaG93VXBsb2FkTW9kYWwoZmFsc2UpO1xuICAgICAgICAgICAgICAgIHNldFNlbGVjdGVkRmlsZShudWxsKTtcbiAgICAgICAgICAgICAgfX1cbiAgICAgICAgICAgICAgY29udGVudENsYXNzTmFtZT1cInVwbG9hZC1tb2RhbC1jb250ZW50XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTZweCcsIHdpZHRoOiAnYXV0bycgfX0+XG4gICAgICAgICAgICAgICAgey8qIERyYWcgJiBEcm9wIFpvbmUgLSBXaWRlIGFuZCBTaG9ydCAqL31cbiAgICAgICAgICAgICAgICA8ZGl2XG4gICAgICAgICAgICAgICAgICBvbkRyYWdPdmVyPXtoYW5kbGVEcmFnT3Zlcn1cbiAgICAgICAgICAgICAgICAgIG9uRHJhZ0xlYXZlPXtoYW5kbGVEcmFnTGVhdmV9XG4gICAgICAgICAgICAgICAgICBvbkRyb3A9e2hhbmRsZURyb3B9XG4gICAgICAgICAgICAgICAgICBvbkNsaWNrPXtoYW5kbGVEcm9wWm9uZUNsaWNrfVxuICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyOiBpc0RyYWdnaW5nID8gJzJweCBkYXNoZWQgIzMyNzRkOScgOiAnMnB4IGRhc2hlZCAjNDQ0JyxcbiAgICAgICAgICAgICAgICAgICAgYm9yZGVyUmFkaXVzOiAnOHB4JyxcbiAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAnLFxuICAgICAgICAgICAgICAgICAgICB0ZXh0QWxpZ246ICdjZW50ZXInLFxuICAgICAgICAgICAgICAgICAgICBjdXJzb3I6ICdwb2ludGVyJyxcbiAgICAgICAgICAgICAgICAgICAgbWFyZ2luQm90dG9tOiAnMTZweCcsXG4gICAgICAgICAgICAgICAgICAgIGJhY2tncm91bmRDb2xvcjogaXNEcmFnZ2luZyA/ICdyZ2JhKDUwLCAxMTYsIDIxNywgMC4wOCknIDogJ3RyYW5zcGFyZW50JyxcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogJ2FsbCAwLjJzIGVhc2UnLFxuICAgICAgICAgICAgICAgICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgICAgICAgICAgICAgICBoZWlnaHQ6ICcxNTBweCcsXG4gICAgICAgICAgICAgICAgICAgIGRpc3BsYXk6ICdmbGV4JyxcbiAgICAgICAgICAgICAgICAgICAgZmxleERpcmVjdGlvbjogJ2NvbHVtbicsXG4gICAgICAgICAgICAgICAgICAgIGp1c3RpZnlDb250ZW50OiAnY2VudGVyJyxcbiAgICAgICAgICAgICAgICAgICAgYWxpZ25JdGVtczogJ2NlbnRlcicsXG4gICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgIDxpbnB1dFxuICAgICAgICAgICAgICAgICAgICByZWY9e2ZpbGVJbnB1dFJlZn1cbiAgICAgICAgICAgICAgICAgICAgaWQ9XCJmaWxlLXVwbG9hZC1pbnB1dFwiXG4gICAgICAgICAgICAgICAgICAgIHR5cGU9XCJmaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2hhbmRsZUZpbGVDaGFuZ2V9XG4gICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IGRpc3BsYXk6ICdub25lJyB9fVxuICAgICAgICAgICAgICAgICAgLz5cbiAgICAgICAgICAgICAgICAgIDxJY29uIG5hbWU9XCJ1cGxvYWRcIiBzaXplPVwieHhsXCIgc3R5bGU9e3sgY29sb3I6ICcjODg4JywgbWFyZ2luQm90dG9tOiAnMTZweCcgfX0gLz5cbiAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgY29sb3I6ICcjODg4JywgZm9udFNpemU6ICcxNHB4JywgcGFkZGluZzogJzAgMTZweCcgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtzZWxlY3RlZEZpbGUgPyAoXG4gICAgICAgICAgICAgICAgICAgICAgPHNwYW4gc3R5bGU9e3sgY29sb3I6ICcjZGRkJyB9fT5TZWxlY3RlZDogPHN0cm9uZz57c2VsZWN0ZWRGaWxlLm5hbWV9PC9zdHJvbmc+PC9zcGFuPlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgIDw+RHJhZyAmIGRyb3AgYSBmaWxlIGhlcmUsIG9yIDxzcGFuIHN0eWxlPXt7IGNvbG9yOiAnIzMyNzRkOScgfX0+Y2xpY2sgdG8gYnJvd3NlPC9zcGFuPjwvPlxuICAgICAgICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgPC9kaXY+XG5cbiAgICAgICAgICAgICAgICB7LyogVXBsb2FkIEJ1dHRvbiAqL31cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywganVzdGlmeUNvbnRlbnQ6ICdmbGV4LWVuZCcsIGdhcDogJzhweCcgfX0+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgc2V0U2hvd1VwbG9hZE1vZGFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgICAgICAgICBzZXRTZWxlY3RlZEZpbGUobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIENhbmNlbFxuICAgICAgICAgICAgICAgICAgPC9CdXR0b24+XG4gICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17aGFuZGxlVXBsb2FkfVxuICAgICAgICAgICAgICAgICAgICBkaXNhYmxlZD17dXBsb2FkaW5nIHx8ICFzZWxlY3RlZEZpbGV9XG4gICAgICAgICAgICAgICAgICAgIGljb249e3VwbG9hZGluZyA/ICdmYSBmYS1zcGlubmVyJyA6ICd1cGxvYWQnfVxuICAgICAgICAgICAgICAgICAgPlxuICAgICAgICAgICAgICAgICAgICB7dXBsb2FkaW5nID8gJ1VwbG9hZGluZy4uLicgOiAnVXBsb2FkJ31cbiAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvTW9kYWw+XG4gICAgICAgICAgKX1cblxuICAgICAgICAgIHsvKiBGaWxlcyBUYWJsZSAqL31cbiAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwiZmlsdGVyLXRhYmxlIGZvcm0taW5saW5lXCI+XG4gICAgICAgICAgICA8dGhlYWQ+XG4gICAgICAgICAgICAgIDx0cj5cbiAgICAgICAgICAgICAgICA8dGg+RmlsZSBOYW1lPC90aD5cbiAgICAgICAgICAgICAgICA8dGggc3R5bGU9e3sgd2lkdGg6ICcxMjBweCcgfX0+QWN0aW9uczwvdGg+XG4gICAgICAgICAgICAgIDwvdHI+XG4gICAgICAgICAgICA8L3RoZWFkPlxuICAgICAgICAgICAgPHRib2R5PlxuICAgICAgICAgICAgICB7ZmlsdGVyZWRGaWxlcy5sZW5ndGggPT09IDAgPyAoXG4gICAgICAgICAgICAgICAgPHRyPlxuICAgICAgICAgICAgICAgICAgPHRkIGNvbFNwYW49ezJ9IGNsYXNzTmFtZT1cInRleHQtY2VudGVyXCIgc3R5bGU9e3sgcGFkZGluZzogJzMycHggMTJweCcsIGNvbG9yOiAnIzg4OCcgfX0+XG4gICAgICAgICAgICAgICAgICAgIHtmaWxlcy5sZW5ndGggPT09IDAgPyAnTm8gZmlsZXMgdXBsb2FkZWQgeWV0LicgOiAnTm8gZmlsZXMgbWF0Y2ggeW91ciBzZWFyY2guJ31cbiAgICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgKSA6IChcbiAgICAgICAgICAgICAgICBmaWx0ZXJlZEZpbGVzLm1hcCgoZmlsZTogVXBsb2FkZWRGaWxlLCBpZHg6IG51bWJlcikgPT4gKFxuICAgICAgICAgICAgICAgICAgPHRyIGtleT17aWR4fT5cbiAgICAgICAgICAgICAgICAgICAgPHRkIGNsYXNzTmFtZT1cIm1heC13aWR0aC0xMFwiPlxuICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImVsbGlwc2lzXCIgdGl0bGU9e2ZpbGUubmFtZX0+XG4gICAgICAgICAgICAgICAgICAgICAgICB7ZmlsZS5uYW1lfVxuICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cbiAgICAgICAgICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgICAgICAgIDxIb3Jpem9udGFsR3JvdXAgc3BhY2luZz1cInNtXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8QnV0dG9uXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJzbVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJzZWNvbmRhcnlcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2V0RmlsZVRvVmlldyhmaWxlKTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZXRTaG93Vmlld01vZGFsKHRydWUpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uPVwiZXllXCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJWaWV3XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgYXJpYS1sYWJlbD1cIlZpZXcgZmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIFZpZXdcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4gaGFuZGxlRG93bmxvYWRGaWxlKGZpbGUpfVxuICAgICAgICAgICAgICAgICAgICAgICAgICBpY29uPVwiZG93bmxvYWQtYWx0XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJEb3dubG9hZFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJEb3dubG9hZCBmaWxlXCJcbiAgICAgICAgICAgICAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgRG93bmxvYWRcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvQnV0dG9uPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaXplPVwic21cIlxuICAgICAgICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwiZGVzdHJ1Y3RpdmVcIlxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBzZXRGaWxlVG9EZWxldGUoZmlsZSl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIGljb249XCJ0aW1lc1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGFyaWEtbGFiZWw9XCJEZWxldGUgZmlsZVwiXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICAgIDwvSG9yaXpvbnRhbEdyb3VwPlxuICAgICAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgICAgPC90cj5cbiAgICAgICAgICAgICAgICApKVxuICAgICAgICAgICAgICApfVxuICAgICAgICAgICAgPC90Ym9keT5cbiAgICAgICAgICA8L3RhYmxlPlxuXG4gICAgICAgICAgey8qIFZpZXcgTW9kYWwgKi99XG4gICAgICAgICAge3Nob3dWaWV3TW9kYWwgJiYgZmlsZVRvVmlldyAmJiAoXG4gICAgICAgICAgICA8TW9kYWxcbiAgICAgICAgICAgICAgdGl0bGU9e2BWaWV3IC0gJHtmaWxlVG9WaWV3Lm5hbWV9YH1cbiAgICAgICAgICAgICAgaXNPcGVuPXtzaG93Vmlld01vZGFsfVxuICAgICAgICAgICAgICBvbkRpc21pc3M9eygpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRTaG93Vmlld01vZGFsKGZhbHNlKTtcbiAgICAgICAgICAgICAgICBzZXRGaWxlVG9WaWV3KG51bGwpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICBjb250ZW50Q2xhc3NOYW1lPVwidmlldy1tb2RhbC1jb250ZW50XCJcbiAgICAgICAgICAgID5cbiAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBwYWRkaW5nOiAnMTZweCcsIHdpZHRoOiAnYXV0bycgfX0+XG4gICAgICAgICAgICAgICAge2ZpbGVUb1ZpZXcudXJsID8gKFxuICAgICAgICAgICAgICAgICAgPD5cbiAgICAgICAgICAgICAgICAgICAge2ZpbGVUb1ZpZXcubmFtZS5tYXRjaCgvXFwuKGpwZ3xqcGVnfHBuZ3xnaWZ8d2VicCkkL2kpID8gKFxuICAgICAgICAgICAgICAgICAgICAgIDxpbWdcbiAgICAgICAgICAgICAgICAgICAgICAgIHNyYz17ZmlsZVRvVmlldy51cmx9XG4gICAgICAgICAgICAgICAgICAgICAgICBhbHQ9e2ZpbGVUb1ZpZXcubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1heFdpZHRoOiAnMTAwJScsIG1heEhlaWdodDogJzUwMHB4JywgYm9yZGVyUmFkaXVzOiAnNHB4JyB9fVxuICAgICAgICAgICAgICAgICAgICAgIC8+XG4gICAgICAgICAgICAgICAgICAgICkgOiBmaWxlVG9WaWV3Lm5hbWUubWF0Y2goL1xcLih0eHR8anNvbnxjc3YpJC9pKSA/IChcbiAgICAgICAgICAgICAgICAgICAgICA8aWZyYW1lXG4gICAgICAgICAgICAgICAgICAgICAgICBzcmM9e2ZpbGVUb1ZpZXcudXJsfVxuICAgICAgICAgICAgICAgICAgICAgICAgc3R5bGU9e3tcbiAgICAgICAgICAgICAgICAgICAgICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaGVpZ2h0OiAnNTAwcHgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXI6ICcxcHggc29saWQgIzQ0NCcsXG4gICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlclJhZGl1czogJzRweCcsXG4gICAgICAgICAgICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9e2ZpbGVUb1ZpZXcubmFtZX1cbiAgICAgICAgICAgICAgICAgICAgICAvPlxuICAgICAgICAgICAgICAgICAgICApIDogKFxuICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzMycHgnLCB0ZXh0QWxpZ246ICdjZW50ZXInLCBjb2xvcjogJyM4ODgnIH19PlxuICAgICAgICAgICAgICAgICAgICAgICAgPEljb24gbmFtZT1cImZpbGUtYWx0XCIgc2l6ZT1cInh4eGxcIiBzdHlsZT17eyBtYXJnaW5Cb3R0b206ICcxNnB4JyB9fSAvPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHA+RG9jdW1lbnQ6IHtmaWxlVG9WaWV3Lm5hbWV9PC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPHAgc3R5bGU9e3sgZm9udFNpemU6ICcxMnB4JyB9fT5QcmV2aWV3IG5vdCBhdmFpbGFibGUgZm9yIHRoaXMgZmlsZSB0eXBlPC9wPlxuICAgICAgICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXsoKSA9PiBoYW5kbGVEb3dubG9hZEZpbGUoZmlsZVRvVmlldyl9XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHNpemU9XCJsZ1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHZhcmlhbnQ9XCJwcmltYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgaWNvbj1cImRvd25sb2FkLWFsdFwiXG4gICAgICAgICAgICAgICAgICAgICAgICAgIHN0eWxlPXt7IG1hcmdpblRvcDogJzE2cHgnIH19XG4gICAgICAgICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgICAgICAgIERvd25sb2FkXG4gICAgICAgICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICAgIDwvPlxuICAgICAgICAgICAgICAgICkgOiAoXG4gICAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICczMnB4JywgdGV4dEFsaWduOiAnY2VudGVyJywgY29sb3I6ICcjODg4JyB9fT5cbiAgICAgICAgICAgICAgICAgICAgRmlsZSBVUkwgbm90IGF2YWlsYWJsZVxuICAgICAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICAgICAgKX1cbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IG1hcmdpblRvcDogJzI0cHgnLCBkaXNwbGF5OiAnZmxleCcsIGp1c3RpZnlDb250ZW50OiAnZmxleC1lbmQnIH19PlxuICAgICAgICAgICAgICAgICAgPEJ1dHRvblxuICAgICAgICAgICAgICAgICAgICB2YXJpYW50PVwic2Vjb25kYXJ5XCJcbiAgICAgICAgICAgICAgICAgICAgb25DbGljaz17KCkgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgIHNldFNob3dWaWV3TW9kYWwoZmFsc2UpO1xuICAgICAgICAgICAgICAgICAgICAgIHNldEZpbGVUb1ZpZXcobnVsbCk7XG4gICAgICAgICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgICAgICA+XG4gICAgICAgICAgICAgICAgICAgIENsb3NlXG4gICAgICAgICAgICAgICAgICA8L0J1dHRvbj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICAgICA8L01vZGFsPlxuICAgICAgICAgICl9XG5cbiAgICAgICAgICB7Qm9vbGVhbihmaWxlVG9EZWxldGUpICYmIChcbiAgICAgICAgICAgIDxDb25maXJtTW9kYWxcbiAgICAgICAgICAgICAgYm9keT17YEFyZSB5b3Ugc3VyZSB5b3Ugd2FudCB0byBkZWxldGUgZmlsZSBcIiR7ZmlsZVRvRGVsZXRlPy5uYW1lfVwiP2B9XG4gICAgICAgICAgICAgIGNvbmZpcm1UZXh0PVwiRGVsZXRlXCJcbiAgICAgICAgICAgICAgdGl0bGU9XCJEZWxldGVcIlxuICAgICAgICAgICAgICBvbkRpc21pc3M9eygpID0+IHtcbiAgICAgICAgICAgICAgICBzZXRGaWxlVG9EZWxldGUobnVsbCk7XG4gICAgICAgICAgICAgIH19XG4gICAgICAgICAgICAgIGlzT3Blbj17dHJ1ZX1cbiAgICAgICAgICAgICAgb25Db25maXJtPXsoKSA9PiB7XG4gICAgICAgICAgICAgICAgaWYgKCFmaWxlVG9EZWxldGUpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgaGFuZGxlRGVsZXRlRmlsZShmaWxlVG9EZWxldGUpO1xuICAgICAgICAgICAgICB9fVxuICAgICAgICAgICAgLz5cbiAgICAgICAgICApfVxuICAgICAgICA8Lz5cbiAgICAgIDwvUGFnZS5Db250ZW50cz5cbiAgICA8L1BhZ2U+XG4gICk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBjb25uZWN0b3IoRmlsZVVwbG9hZFBhZ2UpO1xuIl0sIm5hbWVzIjpbIlJlYWN0IiwidXNlU3RhdGUiLCJ1c2VFZmZlY3QiLCJ1c2VSZWYiLCJ1c2VDYWxsYmFjayIsImNvbm5lY3QiLCJGaWx0ZXJJbnB1dCIsIkJ1dHRvbiIsIkNvbmZpcm1Nb2RhbCIsIkhvcml6b250YWxHcm91cCIsIkljb24iLCJNb2RhbCIsIlBhZ2UiLCJnZXROYXZNb2RlbCIsIm1hcFN0YXRlVG9Qcm9wcyIsInN0YXRlIiwiZmlsZXVwbG9hZE5hdiIsIm5hdkluZGV4IiwibWFpbiIsInRleHQiLCJpY29uIiwiaWQiLCJ1cmwiLCJub2RlIiwibmF2TW9kZWwiLCJjb25uZWN0b3IiLCJGaWxlVXBsb2FkUGFnZSIsInNlbGVjdGVkRmlsZSIsInNldFNlbGVjdGVkRmlsZSIsInVwbG9hZGluZyIsInNldFVwbG9hZGluZyIsImZpbGVzIiwic2V0RmlsZXMiLCJzZWFyY2hUZXJtIiwic2V0U2VhcmNoVGVybSIsImZpbGVUb0RlbGV0ZSIsInNldEZpbGVUb0RlbGV0ZSIsImlzRHJhZ2dpbmciLCJzZXRJc0RyYWdnaW5nIiwic2hvd1VwbG9hZE1vZGFsIiwic2V0U2hvd1VwbG9hZE1vZGFsIiwic2hvd1ZpZXdNb2RhbCIsInNldFNob3dWaWV3TW9kYWwiLCJmaWxlVG9WaWV3Iiwic2V0RmlsZVRvVmlldyIsImZpbGVJbnB1dFJlZiIsIk1BWF9GSUxFUyIsImZldGNoRmlsZXMiLCJoYW5kbGVGaWxlQ2hhbmdlIiwiZSIsInRhcmdldCIsImhhbmRsZURyYWdPdmVyIiwicHJldmVudERlZmF1bHQiLCJzdG9wUHJvcGFnYXRpb24iLCJoYW5kbGVEcmFnTGVhdmUiLCJoYW5kbGVEcm9wIiwiZGF0YVRyYW5zZmVyIiwiaGFuZGxlRHJvcFpvbmVDbGljayIsImN1cnJlbnQiLCJjbGljayIsImhhbmRsZVVwbG9hZCIsImxlbmd0aCIsImFsZXJ0IiwiZm9ybURhdGEiLCJGb3JtRGF0YSIsImFwcGVuZCIsInJlc3BvbnNlIiwiZmV0Y2giLCJtZXRob2QiLCJib2R5Iiwib2siLCJ2YWx1ZSIsImVycm9yIiwiY29uc29sZSIsInN0YXR1cyIsImRhdGEiLCJqc29uIiwiQXJyYXkiLCJpc0FycmF5IiwiaGFuZGxlRGVsZXRlRmlsZSIsImZpbGUiLCJlbmNvZGVVUklDb21wb25lbnQiLCJuYW1lIiwiaGFuZGxlRG93bmxvYWRGaWxlIiwiYmxvYiIsIndpbmRvdyIsIlVSTCIsImNyZWF0ZU9iamVjdFVSTCIsImxpbmsiLCJkb2N1bWVudCIsImNyZWF0ZUVsZW1lbnQiLCJocmVmIiwiZG93bmxvYWQiLCJhcHBlbmRDaGlsZCIsInJlbW92ZUNoaWxkIiwicmV2b2tlT2JqZWN0VVJMIiwiZmlsdGVyZWRGaWxlcyIsImZpbHRlciIsInRvTG93ZXJDYXNlIiwiaW5jbHVkZXMiLCJjb2xvciIsIm1hcmdpblJpZ2h0IiwiZm9udFNpemUiLCJtYXJnaW5MZWZ0IiwicGFkZGluZyIsIndpZHRoIiwiYm9yZGVyIiwiYm9yZGVyUmFkaXVzIiwidGV4dEFsaWduIiwiY3Vyc29yIiwibWFyZ2luQm90dG9tIiwiYmFja2dyb3VuZENvbG9yIiwidHJhbnNpdGlvbiIsImhlaWdodCIsImRpc3BsYXkiLCJmbGV4RGlyZWN0aW9uIiwianVzdGlmeUNvbnRlbnQiLCJhbGlnbkl0ZW1zIiwiZ2FwIiwibWFwIiwiaWR4IiwibWF0Y2giLCJtYXhXaWR0aCIsIm1heEhlaWdodCIsIm1hcmdpblRvcCIsIkJvb2xlYW4iXSwic291cmNlUm9vdCI6IiJ9