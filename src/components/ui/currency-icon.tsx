import { type EnumCurrency } from '@prisma/client';
import { DollarSign, Euro } from 'lucide-react';
import type { ComponentProps } from 'react';

const CurrencyIcon = ({
  currency,
  ...props
}: ComponentProps<typeof Euro> & {
  currency: EnumCurrency;
}) => {
  switch (currency) {
    case 'EUR':
      return <Euro strokeWidth={2.5} {...props} />;
    case 'USD':
      return <DollarSign strokeWidth={2.5} {...props} />;
    default:
      return <></>;
  }
};

export default CurrencyIcon;
