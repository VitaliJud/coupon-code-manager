import React, { useState } from 'react';
import {
  Box,
  Button,
  Modal,
  ModalAction,
  ProgressBar,
  Stepper,
  Text,
  Message,
  Link,
} from '@bigcommerce/big-design';
import { useSession } from '../context/session';

const ImportCodesModal = ({ promotionId, onClose }) => {
  const encodedContext = useSession()?.context;
  const [currentStep, setCurrentStep] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file to upload.');
      return;
    }

    // Implement your CSV parsing and code creation logic here

    // For example, you can use the `PapaParse` library to parse the CSV file
    // and create codes based on the headers.

    // After processing, you can update the `currentStep` accordingly.

    setCurrentStep(1); // Set to the next step after processing

    // You can also use the `postCoupon` function to create codes as needed.
  };

  const renderActions = () => {
    if (currentStep === 0) {
      return [
        { text: 'Cancel', variant: 'subtle', onClick: onClose },
        <label htmlFor="csv-upload" key="upload-label">
          <Button variant="primary">Upload CSV</Button>
          <input
            id="csv-upload"
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
          />
        </label>,
        <Button
          key="upload-button"
          variant="primary"
          onClick={handleUpload}
        >
          Start Import
        </Button>,
      ];
    }

    return [
      { text: 'Close', variant: 'subtle', onClick: onClose },
    ];
  };

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
              {error && <Text color="danger">{error}</Text>}
            </Box>
          </>
        );
      case 2:
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
            {/* Provide a separate message item for the download link */}
            <MessageLinkItem>
              <Link href="https://store-vx1nrciuac.mybigcommerce.com/content/coupon-codes-import-template.csv" download="coupon-codes-import-template.csv">
                Download Codes Template
              </Link>
            </MessageLinkItem>
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
      onClose={onClose}
      closeOnClickOutside={false}
      closeOnEscKey={false}
    >
      <Stepper steps={['Select File', 'Upload', 'Complete']} currentStep={currentStep} />
      {renderContent()}
    </Modal>
  );
};

export default ImportCodesModal;
