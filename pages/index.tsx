import {
  AlertProps,
  AlertsManager,
  Button,
  createAlertsManager,
  Form,
  FormGroup,
  Input,
  Panel,
  Small,
  Link as StyledLink,
  Table,
  TableSortDirection,
  Text,
} from '@bigcommerce/big-design';
import { SearchIcon } from "@bigcommerce/big-design-icons"
import Link from 'next/link';
import { ReactElement, useState } from 'react';
import { PromotionTableItem } from '@types';
import ErrorMessage from '../components/error';
import Loading from '../components/loading';
import { useSession } from '../context/session'
import { usePromotions } from '../lib/hooks';
import { useCouponSearch } from '../lib/hooks';

const Index = () => {
  const encodedContext = useSession()?.context;
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [columnHash, setColumnHash] = useState('');
  const [direction, setDirection] = useState<TableSortDirection>('ASC');
  const [couponCode, setCouponCode] = useState('');
  const { list, error, isLoading } = useCouponSearch(couponCode);
  const [loading, setLoading] = useState(false);
  const alertsManager = createAlertsManager();
  
  const { error, isLoading, list = [], meta = {} } = usePromotions({
    page: String(currentPage),
    limit: String(itemsPerPage),
    ...(columnHash && { sort: columnHash, direction: direction.toLowerCase() }),
  });

  const itemsPerPageOptions = [10, 20, 50, 100, 250];

  const tableItems: PromotionTableItem[] = list.map(
    ({ id, name, current_uses, max_uses, status, start_date, end_date, currency_code }) => ({
      id,
      name,
      current_uses,
      max_uses,
      status,
      start_date,
      end_date,
      currency_code,
    })
  );

  const onItemsPerPageChange = (newRange) => {
    setCurrentPage(1);
    setItemsPerPage(newRange);
  };

  const onSort = (newColumnHash, newDirection) => {
    setColumnHash(newColumnHash);
    setDirection(newDirection);
  };

  const renderName = (id: string, name: string): ReactElement => (
    <Link href={`/promotions/${id}`}>
      <StyledLink>{name}</StyledLink>
    </Link>
  );

  const renderCurrentUses = (uses: number): ReactElement => <Small>{uses}</Small>;

  const renderMaxUses = (uses: number): ReactElement => (
    <Small>{uses ? uses : String.fromCharCode(0x221E)}</Small>
  );

  const renderStatus = (status: string): ReactElement => <Text>{status}</Text>;

  const renderDate = (date: string): ReactElement => (
    <Text>{date && new Date(date).toLocaleString()}</Text>
  );

  const renderCurrencyCode = (currency_code: string): ReactElement => <Text bold>{currency_code}</Text>;

  const handleSearch = (event) => {
    event.preventDefault();
    // Assuming your input's name is 'code'
    setCouponCode(event.target.code.value);
  }
  
  // const handleSearch = async () => {
  //   setLoading(true);
  //   try {
  //       if (!couponCode.trim()) {
  //           return; // Prevent empty searches
  //       }

  //       const params = new URLSearchParams({
  //           code: couponCode,
  //           context: encodedContext
  //       }).toString();

  //       const url = `/api/promotions?${params}`;
  //       const res = await fetch(url);
  //       const { data } = await res.json();

  //       if (data.length === 0) {
  //           const alert = {
  //               type: 'warning',
  //               header: 'No results',
  //               messages: [{ text: `No results for ${couponCode}` }],
  //               autoDismiss: true,
  //           } as AlertProps;
  //           alertsManager.add(alert);
  //       }

  //       // Update your table data or state with the search results
    
  //     } catch (error) {
  //         console.error(error);
  //         const alert = {
  //             type: 'error',
  //             header: 'Error searching coupon code',
  //             messages: [{ text: error.message }],
  //             autoDismiss: true,
  //         } as AlertProps;
  //         alertsManager.add(alert);
  //     }
  //     setLoading(false);
  // };


  if (isLoading) return <Loading />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <Panel header="Coupon Promotions">
      <Form>
        <FormGroup>
          <Input
            placeholder="Search by coupon code"
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
          />
        </FormGroup>
        <Button variant="secondary" iconLeft={<SearchIcon />} onClick={handleSearch} isLoading={loading}>
          Search
        </Button>
      </Form>

      {/* Handle states and display */}
      {isLoading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      {list && list.map(item => <div key={item.id}>{item.name}</div>)}
      
      <AlertsManager manager={alertsManager} />
      <Table
        columns={[
          { header: 'Promotion name', hash: 'name', render: ({ id, name }) => renderName(id, name), isSortable: true },
          { header: 'Start Date', hash: 'start_date', render: ({ start_date }) => renderDate(start_date), isSortable: true },
          { header: 'End Date', hash: 'end_date', render: ({ end_date }) => renderDate(end_date) },
          { header: 'Current Uses', hash: 'current_uses', render: ({ current_uses }) => renderCurrentUses(current_uses) },
          { header: 'Max Uses', hash: 'max_uses', render: ({ max_uses }) => renderMaxUses(max_uses) },
          { header: 'Currency', hash: 'currency_code', render: ({ currency_code }) => renderCurrencyCode(currency_code) },
          { header: 'Status', hash: 'status', render: ({ status }) => renderStatus(status) },
        ]}
        items={tableItems}
        itemName="Promotions"
        pagination={{
          currentPage,
          totalItems: meta.pagination?.total,
          onPageChange: setCurrentPage,
          itemsPerPageOptions,
          onItemsPerPageChange,
          itemsPerPage,
        }}
        sortable={{
          columnHash,
          direction,
          onSort,
        }}
        stickyHeader
      ></Table>
    </Panel>
  );
};

export default Index;
