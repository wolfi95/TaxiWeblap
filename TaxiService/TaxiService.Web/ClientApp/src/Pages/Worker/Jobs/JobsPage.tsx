import React, { useEffect, useState } from 'react';
import './JobsPage.scss';
import PagedData from '../../../dtos/PagedData';
import ReservationDetailDto from '../../../dtos/Reservation/ReservationDetailDto';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Select, Table, TableBody, TableCell, TableRow } from '@material-ui/core';
import { axiosInstance } from '../../../config/Axiosconfig';
import { MenuItem } from '@material-ui/core';
import ReservationCardComponent from '../../../Components/ReservationCard/ReservationCardComponent'
import getEnumAsOptions from '../../../config/Enums/EnumHelper'
import { ReservationStatus } from '../../../config/Enums/ReservationStatus';
import WorkerReservationStatusUpdateDto from '../../../dtos/Worker/WorkerReservationStatusUpdateDto';
import { WorkerReservationStatus } from '../../../config/Enums/WorkerReservationStatus';
import AppCheckbox from '../../../Components/AppCheckbox/Appcheckbox';
import WorkerJobsFilterDto from "../../../dtos/Worker/WorkerJobsFilterDto"

export default function JobsPage() {
    const [reservations, setReservations] = useState<PagedData<ReservationDetailDto>>();
    const [pager, setPager] = useState<WorkerJobsFilterDto>({PageNumber: 1, PageSize: 1, HideComplete: true});
    const [updateDialogId, setUpdateDialogId] = useState("");
    const [newStatus, setNewStatus] = useState<ReservationStatus | undefined>();

    useEffect(() => {
        axiosInstance.post<PagedData<ReservationDetailDto>>("worker/jobs", pager)
            .then(res => {
                setReservations(res.data)
            })
            .catch(err => {})
    },[pager])

    const updateDialogStatus = () => {
        var data: WorkerReservationStatusUpdateDto = {
            Status: +(newStatus!)
        }
        axiosInstance.post("worker/jobs/" + updateDialogId + "/update", data)
            .then(res => {
                var temp = reservations!.data.map(r => {
                    return r.id === updateDialogId ? {...r, status: +newStatus!} : r
                });
                setReservations({...reservations!, data: temp});
                setUpdateDialogId("");
            })
            .catch(err => {})
    }

    return (
        <Container maxWidth="lg" className="jobs-page-wrapper">
            <div className="pager-controls">
                <div className="pagesize-section">
                    <div>
                        <span className="text">Page size:</span>
                        <Select
                            value={pager.PageSize}
                            onChange={(val) => setPager({...pager, PageSize: +(val.target.value as string), PageNumber: 1})}
                        >
                            <MenuItem value={1}>1</MenuItem>
                            <MenuItem value={5}>5</MenuItem>
                            <MenuItem value={10}>10</MenuItem>
                            <MenuItem value={50}>50</MenuItem>
                        </Select>
                    </div>
                    <div>
                        <AppCheckbox checked={pager.HideComplete} label="Show done jobs." onChange={(e) => setPager({...pager, HideComplete: !pager.HideComplete})} />
                    </div>
                </div>
                <div className="button-section">
                    <Button variant="contained" color="secondary" onClick={() => {setPager({...pager, PageNumber: 1})}} disabled={pager.PageNumber === 1} className="first-button">{"<<"}</Button>
                    <Button variant="contained" color="secondary" onClick={() => {setPager({...pager, PageNumber: pager.PageNumber - 1})}} disabled={pager.PageNumber === 1} className="back-button">{"<"}</Button>
                    <span className="page-button">{pager.PageNumber + "/" + Math.ceil((reservations?.resultCount ?? 1) / pager.PageSize)}</span>
                    <Button variant="contained" color="secondary" onClick={() => {setPager({...pager, PageNumber: pager.PageNumber + 1})}} disabled={pager.PageNumber >= ((reservations?.resultCount ?? 1) / pager.PageSize)} className="next-button">{">"}</Button>
                    <Button variant="contained" color="secondary" onClick={() => {setPager({...pager, PageNumber: Math.ceil((reservations?.resultCount ?? 1) / pager.PageSize)})}} disabled={pager.PageNumber >= ((reservations?.resultCount ?? 1) / pager.PageSize)} className="last-button">{">>"}</Button>
                </div>
                
            </div>
            <div className="results-section">
                {reservations?.data.map(r => {
                    return (
                        <ReservationCardComponent reservation={r} />
                    );
                })}
            </div>
            <Dialog
                open={updateDialogId !== ""}
            >
                <DialogTitle>Update reservation status</DialogTitle>
                <DialogContent>
                    <span>Select the new Status:</span>
                    <Select onChange={val => {setNewStatus(+(val.target.value as string))}}>
                        {getEnumAsOptions(WorkerReservationStatus, "workerReservationStatus")}
                    </Select>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => updateDialogStatus()}>Update</Button>
                    <Button onClick={() => setUpdateDialogId("")}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Container>
    )
}