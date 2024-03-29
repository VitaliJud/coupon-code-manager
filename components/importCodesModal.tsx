import { Box, Button, Message, Modal, ModalAction, Stepper, Text, } from '@bigcommerce/big-design';
import React, { useState } from 'react';
// import { useSession } from '../context/session';    //Enable when encodedContext is required

interface ImportCodesModalProps {
    // promotionId: number,
    onClose: () => void
}

const ImportCodesModal = ({ onClose }: ImportCodesModalProps) => {
    // const encodedContext = useSession()?.context;    // Will need to be used when parsing is happening and codes need to be created
    const [currentStep, setCurrentStep] = useState(0);
    // const [uploading, setUploading] = useState(false);    // Need to include CSV Parse such as PapaParse
    const [abortController, setAbortController] = useState(null)
    const [file, setFile] = useState(null);
    const [error, setError] = useState(null);
    
    const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
    };
    
    // const handleUpload = async () => {
    // if (!file) {
    //   setError('Please select a CSV file to upload.');
    //   return;
    // }
    
    // Implement your CSV parsing and code creation logic here
    
    // For example, you can use the `PapaParse` library to parse the CSV file
    // and create codes based on the headers.
    
    // After processing, you can update the `currentStep` accordingly.
    
    setCurrentStep(1); // Set to the next step after processing
    
    // You can also use the `postCoupon` function to create codes as needed.
    };

    // ==== SAMPLE FROM THE EXPORT ====
    // if (currentStep === 0 && !abortController) {        
    //     try {
    //         const ac = new AbortController()
    //         setAbortController(ac)
    //         fetchCoupons(ac.signal)
    //     } catch (error) {
    //         if (error.message != "The user aborted a request." ) {
    //             console.error(error)
    //             setCurrentStep(1)
    //         }
    //     }
    // }
    
    const handleClose = () => {
      AbortController.abort()
      onClose()
    }
    
    const handleStop = () => {
      abortController.abort()
      setCurrentStep(1)
    }
    
    const renderActions = (): ModalAction[] => {
    if (currentStep === 0) {
      return [
                {text: 'Stop Import and Close', variant: 'subtle', onClick: handleClose},
                {text: 'Stop Import and Download Codes', variant: 'primary', onClick: handleStop}
            ]
        }
    
        if (currentStep == 1) {
            return [
                { text: 'Close', variant: 'subtle', onClick: handleClose}
            ]
        }
    }
    
    const renderOnModalClose = () => {
        if (currentStep == 0) {
            return handleClose
        }
    
        if (currentStep == 1) {
            return onClose
        }
    }

      
      
  //     return [
  //       { text: 'Cancel', variant: 'subtle', onClick: onClose },
  //       <label htmlFor="csv-upload" key="upload-label">
  //         <Button variant="primary">Upload CSV</Button>
  //         <input
  //           id="csv-upload"
  //           type="file"
  //           accept=".csv"
  //           onChange={handleFileChange}
  //           style={{ display: 'none' }}
  //         />
  //       </label>,
  //       <Button
  //         key="upload-button"
  //         variant="primary"
  //         onClick={handleUpload}
  //       >
  //         Start Import
  //       </Button>,
  //     ];
  //   }

  //   return [
  //     { text: 'Close', variant: 'subtle', onClick: onClose },
  //   ];
  // };

  const renderContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <>
            <Box marginVertical="large">
              <Text>Select a CSV file to import coupon codes.</Text>
              <input
                id="csv-upload"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />
              <Button
                variant="primary"
                onClick={() => {
                  window.open('https://store-vx1nrciuac.mybigcommerce.com/content/coupon-codes-import-template.csv');
                }}
              >
                Download Codes Template
              </Button>
              {error && <Text color="danger">{error}</Text>}
            </Box>
          </>
        );
      case 1:
        return (
          <>
            <Message
              header="Import Complete"
              messages={[
                {
                  text: 'Coupon codes have been imported successfully.',
                },
              ]}
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      isOpen={true}
      actions={renderActions()}
      header="Import Coupons"
      onClose={renderOnModalClose()}
      closeOnClickOutside={false}
      closeOnEscKey={false}
    >
      <Stepper steps={['Select File', 'Complete']} currentStep={currentStep} />
      {renderContent()}
    </Modal>
  );
};

export default ImportCodesModal;
