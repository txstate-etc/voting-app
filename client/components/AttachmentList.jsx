import React from 'react';
import {getAttachmentIcon} from '../util';

class AttachmentList extends React.Component {
    render(){
        return(
            <div className="row">
                {this.props.attachments.map(attachment => {
                    return (
                        <div key={attachment.id} className="col-xs-6 col-sm-4 col-md-3">
                            <a href={"/files/" + attachment.id}>
                                <i className={"attachment-icon fa " + getAttachmentIcon(attachment.filename)}></i>
                                {attachment.filename}
                            </a>
                        </div>
                    )
                })}
            </div>
        );
    }
}

export default AttachmentList;