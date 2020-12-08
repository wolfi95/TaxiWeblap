import { Email } from '@material-ui/icons';
import React from 'react'
import { connect } from 'react-redux';
import AccountPageWrapper from '../../../Components/AccountPageWrapper/AccountPageWrapper';
import { RootState } from '../../../redux/reducers/rootReducer';
import './OverViewPage.scss';

interface IMappedProps {
    email: string;
    name: string;
    address: string;
}

function OverViewPage(Props: IMappedProps){
    return (
        <AccountPageWrapper header="Overview">
            <div>
                <div className="data-row">
                    <span>Name:</span>
                    <span>{Props.name}</span>
                </div>
                <div className="data-row">
                    <span>Email:</span>
                    <span>{Props.email}</span>
                </div>
                <div className="data-row">
                    <span>Address:</span>
                    <span>{Props.address}</span>
                </div>
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