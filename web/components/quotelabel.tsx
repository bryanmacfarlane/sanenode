import * as React from 'react';
import * as cm from '../../common/contracts';

// export interface QuoteLabel {
//     quote: string;
//     author: string;
// }

export class QuoteLabel extends React.Component<cm.IQuote, undefined> {
    render() {
        return (
            <div>
                <h1>
                    {this.props.quote}
                </h1>
                <h2> 
                    {this.props.author}
                </h2>
            </div>
        );
    }
}