import React from "react";
import { useParams } from "react-router";
import './UserReservationsPage.scss';

export default function UserReservationsPage() {
    const userId = useParams<{id: string}>();

    return(
        <div>
            Admin / User reservations {userId.id}
        </div>
    )
}