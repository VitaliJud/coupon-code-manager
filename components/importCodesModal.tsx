import React, { useState } from 'react';
import { Box, Form, Modal, ModalAction, Text } from '@bigcommerce/big-design';

export const CouponModal = () => {
  const [isOpen, setIsOpen] = useState(true);

  const handleDownload = () => {
    window.open('https://store-vx1nrciuac.mybigcommerce.com/content/coupon-codes-import-template.csv', '_blank');
  };

  const handleUpload = () => {
    // Upload logic here
  };

  const handleImport = () => {
    // Import logic here
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      header="Upload and Import Coupon Codes from CSV file"
      actions={[
        { text: 'Close', variant: 'subtle', onClick: handleClose },
        { text: 'Start Import', onClick: handleImport }
      ]}
    >
      <Box>
        <Text>To get started -</Text>
        <Box marginVertical="large" display="flex" justifyContent="center">
          <Form.Link onClick={handleDownload}>Download Template</Form.Link>
        </Box>
        <Box marginVertical="large" display="flex" justifyContent="center">
          <Form.Link onClick={handleUpload}>Upload CSV</Form.Link>
        </Box>
      </Box>
    </Modal>
  );
};

export default CouponModal;
