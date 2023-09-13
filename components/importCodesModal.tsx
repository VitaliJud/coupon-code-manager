import { Box, Form, FormGroup, Input, Modal, Text } from '@bigcommerce/big-design';
import { ReactElement } from 'react';

interface importCodesModalProps {
    promotionId: number;
    onClose: () => void;
}

const ImportCodesModal = ({ promotionId, onClose }: importCodesModalProps): ReactElement => {
    const handleDownload = () => {
        window.open("https://store-vx1nrciuac.mybigcommerce.com/content/coupon-codes-import-template.csv", "_blank");
    }

    const handleUpload = () => {
        // Upload handling logic goes here
    }
    const handleImport = () => {
        alert('Import Started!');
    }

    return (
        <Modal
            isOpen={true}
            actions={[
                { text: 'Close', variant: 'subtle', onClick: onClose },
                { text: 'Start Import', onClick: handleImport }
            ]}
            header="Upload and Import Coupon Codes from CSV file"
            onClose={onClose}
        >
            <Box marginBottom='medium'>
                <Text>To get started -</Text>
            </Box>
            <Box marginBottom='medium'>
                <Text onClick={handleDownload} style={{ cursor: 'pointer', color: '#0076de' }}>
                    Download Template
                </Text>
            </Box>
            <Box marginBottom='medium'>
                <Form>
                    <FormGroup>
                        <Text>Add more codes for Promotion Coupon {promotionId}:</Text>
                        <Input type="file" accept=".csv" onChange={handleUpload} />
                    </FormGroup>
                </Form>
            </Box>
        </Modal>
    );
}

export default ImportCodesModal;
