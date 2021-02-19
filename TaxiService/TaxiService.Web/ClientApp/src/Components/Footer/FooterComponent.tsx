import React from 'react';
import { mainEmail, lostAndFoundEmail, phoneNumber } from '../../config/Constants/contacts';
import './FooterComponent.scss'

export default function FooterComponent() {
    return(
        <div id="contact" className="d-flex flex-row footer">
            <div className="d-flex flex-column">
                <span className="header">CONTACT US</span>
                <span>{ mainEmail }</span>
                <span>{ phoneNumber }</span>
                <a>Terms and Conditions</a>
            </div>
            <div className="d-flex flex-column">
                <span className="header">Lost & Found</span>
                <span>{ lostAndFoundEmail }</span>
            </div>
        </div>
    )
}