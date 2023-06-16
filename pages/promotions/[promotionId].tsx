import { Box, Button, Checkbox, Flex, Panel, Small, Link as StyledLink, Table, Text } from '@bigcommerce/big-design';
import { AddIcon, ArrowDownwardIcon } from '@bigcommerce/big-design-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';
import CodeGeneratorModal from '@components/codeGeneratorModal';
import ExportCodesModal from '@components/exportCodesModal';
import { CouponListItem } from '@types';
import ErrorMessage from '../../components/error';
import Loading from '../../components/loading';
import { useCodes } from '../../lib/hooks';
// import { useSession } from '../context/session'; // Import the useSession hook

const Promotion = () => {
  const router = useRouter();
  const promotionId = Number(router.query?.promotionId);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [generating, setGenerating] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [selectedCodes, setSelectedCodes] = useState([]);
  const { error, isLoading, list = [], meta = {}, mutateList } = useCodes(promotionId, {
    page: String(currentPage),
    limit: String(itemsPerPage),
  });
  const itemsPerPageOptions = [10, 20, 50, 100, 250];
  const tableItems: CouponListItem[] = list.map(({ id, code, max_uses, max_uses_per_customer, current_uses, created }) => ({
    id,
    code,
    max_uses,
    max_uses_per_customer,
    current_uses,
    created,
  }));

  const onItemsPerPageChange = newRange => {
    setCurrentPage(1);
    setItemsPerPage(newRange);
  };

  const renderCode = (code: string): ReactElement => <Text>{code}</Text>;

  const renderCurrentUses = (uses: number): ReactElement => <Small>{uses}</Small>;

  const renderMaxUses = (uses: number): ReactElement => <Small>{uses ? uses : String.fromCharCode(0x221E)}</Small>;

  const renderDate = (date: string): ReactElement => <Text>{date}</Text>; // TODO: Convert to datestring

  const handleCodeCheckboxChange = codeId => {
    setSelectedCodes(prevSelectedCodes => {
      if (prevSelectedCodes.includes(codeId)) {
        return prevSelectedCodes.filter(id => id !== codeId);
      } else {
        return [...prevSelectedCodes, codeId];
      }
    });
  };

//   const handleAllCodesCheckboxChange = () => {
//     if (selectedCodes.length === tableItems.length) {
//       setSelectedCodes([])
//     } else {
//       setSelectedCodes(tableItems.map(item => item.id))
//     }
//   }
  
  const handleDeleteSelected = () => {
    if (window.confirm('Are you sure you want to delete the selected codes?')) {
      const deletionPromises = selectedCodes.map(codeId => {
        return fetch(`/api/promotions/${promotionId}/codes?codeId=${codeId}&context=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb250ZXh0IjoidngxbnJjaXVhYyIsInVzZXIiOnsiaWQiOjkxMTg3NSwiZW1haWwiOiJ2aXRhbGkuanVkaW5AYmlnY29tbWVyY2UuY29tIiwibG9jYWxlIjoiZW4ifSwib3duZXIiOnsiaWQiOjkxMTg3NSwiZW1haWwiOiJ2aXRhbGkuanVkaW5AYmlnY29tbWVyY2UuY29tIn0sImlhdCI6MTY4NjkyMDkwNSwiZXhwIjoxNjg3MDA3MzA1fQ.KL0mgLzVAxd4a8AedspYNazQtdmyxzjQI6sN_OS02KM`,
                     { method: 'DELETE'})
          .then(response => {
            if (!response.ok) {
              throw new Error(`Error deleting code with ID ${codeId}`);
            }
          });
      });

      Promise.all(deletionPromises)
        .then(() => {
          setSelectedCodes([]);
          // Show a success message
          alert('Selected codes deleted successfully!');
        })
        .catch(error => {
          // Handle any errors
          console.error('Error deleting codes:', error);
          // Show an error message
          alert('Error deleting codes. Please try again.');
        });
    }
  };

  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Panel header="Coupon Codes">
      {generating && (
        <CodeGeneratorModal
          promotionId={promotionId}
          onClose={() => {
            setGenerating(false);
            mutateList();
          }}
        />
      )}
      {exporting && <ExportCodesModal promotionId={promotionId} onClose={() => setExporting(false)} />}
      <Flex justifyContent="space-between">
        <Box>
          <Link href="/">
            <StyledLink>{'<- Back to Promotions'}</StyledLink>
          </Link>
        </Box>
        <Box>
          <Button iconLeft={<ArrowDownwardIcon />} onClick={() => setExporting(true)}>
            Export Coupons
          </Button>
          <Button iconLeft={<AddIcon />} onClick={() => setGenerating(true)}>
            Generate Coupons
          </Button>
          <Button onClick={handleDeleteSelected}>Delete Selected</Button>
        </Box>
      </Flex>
      <Table
        columns={[
          {
            header: 'Coupon Code',
            hash: 'code',
            render: ({ code }) => renderCode(code),
          },
          {
            header: 'Created',
            hash: 'created',
            render: ({ created }) => renderDate(created),
          },
          {
            header: 'Current Uses',
            hash: 'current_uses',
            render: ({ current_uses }) => renderCurrentUses(current_uses),
          },
          {
            header: 'Max Uses',
            hash: 'max_uses',
            render: ({ max_uses }) => renderMaxUses(max_uses),
          },
          {
            header: 'Max Uses Per Customer',
            hash: 'max_uses_per_customer',
            render: ({ max_uses_per_customer }) => renderMaxUses(max_uses_per_customer),
          },
          {
            header: 'Delete',
            hash: 'delete',
            render: ({ id }) => (
              <Checkbox
                label=""
                checked={selectedCodes.includes(id)}
                onChange={() => handleCodeCheckboxChange(id)}
              />
            ),
          },
        ]}
        items={tableItems}
        pagination={{
          currentPage,
          totalItems: meta.pagination?.total,
          onPageChange: setCurrentPage,
          itemsPerPageOptions,
          onItemsPerPageChange,
          itemsPerPage,
        }}
        stickyHeader
      ></Table>
    </Panel>
  );
};

export default Promotion;
