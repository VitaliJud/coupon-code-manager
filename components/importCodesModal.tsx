import { Box, Form, FormGroup, Input, Modal, Text } from '@bigcommerce/big-design';
import { ReactElement } from 'react';

interface CouponModalProps {
    onClose: () => void;
}

const CouponModal = ({ onClose }: CouponModalProps): ReactElement => {
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
                        <Input type="file" onChange={handleUpload} />
                    </FormGroup>
                </Form>
            </Box>
        </Modal>
    );
}

export default CouponModal;
