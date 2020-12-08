import { Email } from '@material-ui/icons';
import React from 'react'
import { connect } from 'react-redux';
import { RootState } from '../../../redux/reducers/rootReducer';
import AccountPageWrapper from '../Wrapper/AccountPageWrapper';
import './OverViewPage.scss';

interface IMappedProps {
    email: string;
    name: string;
    address: string;
}

function OverViewPage(Props: IMappedProps){
    return (
        <AccountPageWrapper>
            <div className="data-row">
                <span>Name:</span>
                <span>{Props.name}</span>
            </div>
        </AccountPageWrapper>
    )
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return {
        name: state.user.name,
        email: state.user.email,
        address: state.user.address
    }
}

const connector = connect(mapStateToProps);
export default connector(OverViewPage);