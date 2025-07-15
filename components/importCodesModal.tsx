import { Box, Button, Message, Modal, ModalAction, ProgressBar, Stepper, Text } from '@bigcommerce/big-design';
import React, { useState } from 'react';
import { useSession } from '../context/session';

interface ImportCodesModalProps {
    promotionId: number;
    onClose: () => void;
}

const ImportCodesModal = ({ promotionId, onClose }: ImportCodesModalProps) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [abortController] = useState(new AbortController());
    const [totalCodes, setTotalCodes] = useState(0);
    const [imported, setImported] = useState(0);
    const encodedContext = useSession()?.context;
    
    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) {
            return;
        }

        const text = await file.text();
        const lines = text.split(/\r?\n/).filter(Boolean);

        if (lines.length <= 1) {
            return;
        }

        const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
        const codeIdx = headers.indexOf('code');
        const maxUsesIdx = headers.indexOf('max_uses');
        const maxPerIdx = headers.indexOf('max_uses_per_customer');

        const records = lines.slice(1).map(line => {
            const cols = line.split(',');
            return {
                code: cols[codeIdx]?.trim(),
                max_uses: Number(cols[maxUsesIdx]) || 0,
                max_uses_per_customer: Number(cols[maxPerIdx]) || 0,
            };
        }).filter(r => r.code);

        setTotalCodes(records.length);
        setCurrentStep(0);

        for (const record of records) {
            if (abortController.signal.aborted) break;
            await fetch(`/api/promotions/${promotionId}/codes?context=${encodedContext}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(record),
                signal: abortController.signal,
            });
            setImported(prev => prev + 1);
        }

        setCurrentStep(1);
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
                            />
                            <Button
                                marginTop="medium"
                                variant="primary"
                                onClick={() => {
                                    window.open('/coupon-codes-import-template.csv');
                                }}
                            >
                                Download Codes Template
                            </Button>
                        </Box>
                        {totalCodes > 0 && (
                            <Box marginVertical="medium">
                                <Text>Imported {imported} of {totalCodes} codes</Text>
                                <ProgressBar percent={(imported / totalCodes) * 100} />
                            </Box>
                        )}
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
