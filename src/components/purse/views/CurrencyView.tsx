import { FC, useMemo } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { CreateLinkEvent, LocalizeFormattedNumber, LocalizeShortNumber } from '../../../api';
import { Button, LayoutCurrencyIcon, Text } from '../../../common';

interface CurrencyViewProps
{
    type: number;
    amount: number;
    short: boolean;
}

export const CurrencyView: FC<CurrencyViewProps> = props =>
{
    const { type = -1, amount = -1, short = false } = props;

    const element = useMemo(() =>
    {
		return <Button gap={ 1 } className={`nitro-purse-button rounded allcurrencypurse nitro-purse-button currency-${type}`} variant="f-grey" onClick={ () => CreateLinkEvent('catalog/open/currency-' + type) }>
            <Text truncate bold textEnd variant="white" grow>{ short ? LocalizeShortNumber(amount) : LocalizeFormattedNumber(amount) }</Text>
            <LayoutCurrencyIcon type={ type } />
        </Button>
    }, [ amount, short, type ]);
	
	

    if(!short) return element;
    
    return (
        <OverlayTrigger placement="top" overlay={ <Tooltip id={ `tooltip-${ type }` }> { LocalizeFormattedNumber(amount) } </Tooltip> }>
            { element }
        </OverlayTrigger>
    );
}
