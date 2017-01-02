import * as React from 'react';
import * as cm from '../../common/contracts';

export class QuoteLabel extends React.Component<cm.IQuote, undefined> {
    render() {
        return (
            <div>
                <h3>
                    "{this.props.quote}"
                </h3>
                <h4> 
                    - {this.props.author}
                </h4>
            </div>
        );
    }
}