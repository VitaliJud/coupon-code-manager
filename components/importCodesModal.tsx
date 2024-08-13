import { Box, Button, Message, Modal, ModalAction, Stepper, Text, } from '@bigcommerce/big-design';
import React, { useState } from 'react';

interface ImportCodesModalProps {
    onClose: () => void
}

const ImportCodesModal = ({ onClose }: ImportCodesModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [abortController] = useState(new AbortController());
    
    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        // Handle file change logic here
    };
    
    const handleClose = () => {
        abortController.abort();
        onClose();
    }
    
    const handleStop = () => {
        abortController.abort();
        setCurrentStep(1);
    }
    
    const renderActions = (): ModalAction[] => {
        if (currentStep === 0) {
            return [
                { text: 'Stop Import and Close', variant: 'subtle', onClick: handleClose },
                { text: 'Stop Import and Download Codes', variant: 'primary', onClick: handleStop }
            ];
        }
    
        if (currentStep == 1) {
            return [
                { text: 'Close', variant: 'subtle', onClick: handleClose }
            ];
        }
    }
    
    const renderOnModalClose = () => {
        if (currentStep == 0) {
            return handleClose;
        }
    
        if (currentStep == 1) {
            return onClose;
        }
    }
    
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
            header="Import Codes"
            onClose={renderOnModalClose()}
            closeOnClickOutside={false}
            closeOnEscKey={false}
        >
            <Stepper steps={["Select File", "Import Complete"]} currentStep={currentStep} />
            {renderContent()}
        </Modal>
    );
};

export default ImportCodesModal;