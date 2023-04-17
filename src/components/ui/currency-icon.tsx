import { type EnumCurrency } from '@prisma/client';
import { DollarSign, Euro, type LucideProps } from 'lucide-react';

const CurrencyIcon = ({
  currency,
  ...props
}: LucideProps & {
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
