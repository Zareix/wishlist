import { type EnumCurrency } from '@prisma/client';
import { DollarSign, Euro } from 'lucide-react';

const CurrencyIcon = ({
  currency,
  ...props
}: React.SVGAttributes<HTMLOrSVGElement> & {
  currency: EnumCurrency;
}) => {
  switch (currency) {
    case 'EUR':
      return <Euro {...props} />;
    case 'USD':
      return <DollarSign {...props} />;
    default:
      return <></>;
  }
};

export default CurrencyIcon;
