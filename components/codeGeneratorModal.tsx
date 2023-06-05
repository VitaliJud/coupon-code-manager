import { Box, Counter, Form, FormGroup, Input, InputProps, Message, Modal, ModalAction, ProgressBar, Stepper, Text } from '@bigcommerce/big-design'
import { ReactElement, useState } from 'react';
import { makeDataUrl } from '@lib/util';
import { useSession } from '../context/session'
import { generateCodes } from '../lib/coupons' // TODO: Duplicate code handling with makeCode

interface codeGeneratorModalProps {
    promotionId: number,
    onClose: () => void,
}

const CodeGeneratorModal = ({ promotionId, onClose }: codeGeneratorModalProps): ReactElement => {
    const encodedContext = useSession()?.context;
    const steps = ["Configure Codes", "Generate Codes", "Download Results"]
    const [quantity, setQuantity] = useState(1000);
    const [prefix, setPrefix] = useState("");
    const [length, setLength] = useState(12);
    const [maxUses, setMaxUses] = useState(0);
    const [maxUsesPerCustomer, setMaxUsesPerCustomer] = useState(0);
    const [abortController] = useState(new AbortController());
    const [coupons, setCoupons] = useState([]);
    const [currentStep, setCurrentStep] = useState(0);
    const [timestamp, setTimestamp] = useState(Date.now());
    const maxCouponCodeLength = 50

    const handlePrefixChange: InputProps['onChange'] = (event) => {
        setPrefix(event.target.value)
    }

    const handleClose = () => {
        abortController.abort()
        onClose()
    }

    const handleCancel = () => {
        if (confirm('Stop generating coupons?')) { // TODO: REIMPLEMENT
            abortController.abort()
            setCurrentStep(2)     
        }
    }

    const postCoupon = async (code, signal) => {
        const response = await fetch(`/api/promotions/${promotionId}/codes?context=${encodedContext}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                code,
                max_uses: maxUses,
                max_uses_per_customer: maxUsesPerCustomer
            }),
            signal
        })
    
        if (response.ok) {
            const body = await response.json()

            return body.data
        }
    }
 
    const handleStart = async () => {
        try {
            setTimestamp(Date.now())
            setCurrentStep(1)
            const signal = abortController.signal

            const codes = generateCodes(quantity, length, prefix)

            for (const code of codes) {
                if(signal.aborted)
                    {
                        return
                    }
                const coupon = await postCoupon(code, signal)
                setCoupons(prevCoupons => prevCoupons.concat(coupon))
            }
            
            setCurrentStep(2)

        } catch(error) {
            if (error.message != "The user aborted a request." ) {
                console.error(error)
            }
          
            setCurrentStep(2)
        }     
    }

    const renderActions = (): ModalAction[] => {
        switch (currentStep) {
            case 0:
                return [
                    {text: 'Close', variant: 'subtle', onClick: handleClose},
                    {text: 'Generate Coupons', variant: 'primary', onClick: handleStart}
                ]
            case 1:
                return [
                    {text: 'Cancel', variant: 'subtle', onClick: handleCancel}
                ]
            case 2:
                return [
                    { text: 'Close ', variant: 'subtle', onClick: handleClose}
                ]
        }
    }

    const renderOnModalClose = () => {
        if (currentStep === 0 || currentStep === 2) {
            return handleClose
        }

        if (currentStep === 1) {
            return handleCancel
        }
    }

    const renderContent = () => {
        switch (currentStep) {
            case 0:
                return <Form>
                    <Box marginBottom='medium'>
                        <FormGroup>
                            <Input
                                description={`A string to prefix all coupon codes. Max length of codes + prefix is ${maxCouponCodeLength}`}
                                label="Prefix"
                                onChange={handlePrefixChange}
                                type="text"
                                value={prefix}
                                maxLength={maxCouponCodeLength - length}
                            />
                        </FormGroup>
                    </Box>
                    <Box marginBottom='medium'>
                        <FormGroup>
                            <Counter 
                                min={1}
                                max={100000}
                                value={quantity}
                                    onCountChange={setQuantity}
                                label="Quantity"
                                description="The number of coupons to generate"
                                required={true}
                            />
                            <Counter
                                min={6}
                                max={maxCouponCodeLength - prefix.length}
                                value={length}
                                onCountChange={setLength}
                                label="Length"
                                description="The number of characters in the code after the prefix."
                                required={true}
                            />
                        </FormGroup>
                    </Box>
                    <Box marginBottom="medium">
                        <FormGroup>
                            <Counter
                                min={0}
                                max={2147483647}
                                value={maxUses}
                                onCountChange={setMaxUses}
                                label="Maximum uses"
                                description="Max total uses; 0 is unlimited."
                                required={true}
                            />
                            <Counter
                                min={0}
                                max={2147483647}
                                value={maxUsesPerCustomer}
                                onCountChange={setMaxUsesPerCustomer}
                                label="Maximum uses per customer"
                                description="0 inherits this value from the promotion."
                                required={true}
                            />
                        </FormGroup>
                    </Box>
                </Form>
            case 1:
                return <Box marginVertical={"large"}>
                    <Text>Created {coupons.length} of {quantity} coupons</Text>
                    <ProgressBar percent={(coupons.length / quantity) * 100} />
                    <Message type="warning" messages={[{ text: 'Navigating away from this page will stop this process' }]} marginVertical="medium" />
                </Box>
            case 2:
                return <>
                    <Message 
                        header="Complete"
                        messages={[
                            {
                                text: `Generated ${coupons.length} coupons.`,
                                link: {
                                    text: 'Download coupon codes',
                                    href: makeDataUrl(coupons),
                                    // @ts-ignore
                                    download: `coupon-codes-${timestamp}.csv` 
                                }
                            }  
                        ]}
                    />
                </>
        }
    }

    return (
        <Modal
            isOpen={true}
            actions={renderActions()}
            header="Generate Coupons"
            onClose={renderOnModalClose()}
            closeOnClickOutside={false}
            closeOnEscKey={false}
        >
            <Stepper steps={steps} currentStep={currentStep} />
            { renderContent() }
        </Modal>
    )
}

export default CodeGeneratorModal
