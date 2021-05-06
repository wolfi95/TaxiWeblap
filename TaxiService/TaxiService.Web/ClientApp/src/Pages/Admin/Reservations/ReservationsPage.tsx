import DateFnsUtils from '@date-io/date-fns';
import { Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Input, Modal, Select, Table, TableBody, TableCell, TableRow, TextField } from '@material-ui/core';
import { DateTimePicker, MuiPickersUtilsProvider } from '@material-ui/pickers';
import React, { useEffect, useState } from 'react';
import ReservationDetailDto from '../../../dtos/Reservation/ReservationDetailDto';
import PagedData from '../../../dtos/PagedData';
import './ReservationsPage.scss';
import { axiosInstance } from '../../../config/Axiosconfig';
import SearchReservationsDto from '../../../dtos/Reservation/SearchReservationsDto';
import { CarType } from '../../../config/Enums/CarType';
import { ReservationType } from '../../../config/Enums/ReservationType';
import { ReservationStatus } from '../../../config/Enums/ReservationStatus';
import { Preference } from '../../../config/Interfaces/Preference';
import ReservationCardComponent from '../../../Components/ReservationCard/ReservationCardComponent'
import WorkerDto from '../../../dtos/User/WorkerDto';
import AssigWorkerDto from '../../../dtos/Worker/AssignWorkerDto'
import { MenuItem } from '@material-ui/core';
import getEnumAsOptions from '../../../config/Enums/EnumHelper'

export default function ReservationsPage() {
    const [reservations, setReservations] = useState<PagedData<ReservationDetailDto>>();
    const [minPrice, setMinPrice] = useState<number | undefined>();
    const [maxPrice, setMaxPrice] = useState<number | undefined>();
    const [preferences, setPreferences] = useState<Preference[]>([]);
    const [searchData, setSearchData] = useState<SearchReservationsDto>({
        PageNumber: 1,
        PageSize: 1,
        PrefIds: [],
        FromDate: null,
        ToDate: null,
        CarType: -1,
        Status: -1,
        ReservationType: -1
    });
    const [timeout, setTimeOutVar] = useState<NodeJS.Timeout | undefined>(undefined);
    const [assignDialogOpen, setAssignDialogOpen] = useState("");
    const [workers, setWorkers] = useState<WorkerDto[]>([])

    useEffect(() => {
        if(preferences.length === 0) {
            axiosInstance.get("preferences")
            .then(res => {
                setPreferences(res.data)
            })
            .catch(err => {});
        }
        var data = {...searchData};
        Object.keys(searchData).forEach(function(key,index) {
            // key: the name of the object key
            // index: the ordinal position of the key within the object 
            if(Reflect.get(searchData, key) === -1) {
                Reflect.set(data, key, undefined);
            }
        });
        
        axiosInstance.post("reservation", data)
            .then(res => {
                setReservations(res.data)
            })
            .catch(() => {})
    },[searchData])

    const openAssignModal = (id: string): void => {
        axiosInstance.get("admin/workers")
            .then(res => {
                setWorkers(res.data);
                setAssignDialogOpen(id);
            })
            .catch(err => {})
    }

    const assignWorkerToReservation = (workerId: string) => {
        var data: AssigWorkerDto = {
            ReservationId: assignDialogOpen,
            WorkerId: workerId
        }
        axiosInstance.post("admin/assign", data)
            .then(res => {
                var temp = reservations!.data.map(r => {
                    return r.id === assignDialogOpen ? {...r, status: ReservationStatus.Assigned} : r
                });
                setReservations({...reservations!, data: temp});
                setAssignDialogOpen("");
            })
    }    

    return (
        <div className="admin-reservations-wrapper">
            <Container maxWidth="lg" className="search-component">
                <div className="input-field">
                    <span>From Date:</span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker value={searchData.FromDate} onChange={(v) => {setSearchData({...searchData, FromDate: v as Date})}} />
                        {searchData.FromDate && <span onClick={() => setSearchData({...searchData, FromDate: null})} className="clear-button">x</span>}
                    </MuiPickersUtilsProvider>
                </div>
                <div className="input-field">
                    <span>To Date:</span>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <DateTimePicker value={searchData.ToDate} onChange={(v) => {setSearchData({...searchData, ToDate: v as Date})}} />
                        {searchData.ToDate && <span onClick={() => setSearchData({...searchData, ToDate: null})} className="clear-button">x</span>}
                    </MuiPickersUtilsProvider>
                </div>
                <div className="input-field">
                    <span>Min. Price:</span>
                    <TextField
                        value={minPrice}
                        type="number"
                        onChange={val => {
                            setMinPrice(val.target.value === "" ? undefined : +val.target.value);
                            if(timeout) {
                                clearTimeout(timeout);
                                setTimeOutVar(undefined);
                            }
                            setTimeOutVar(setTimeout(() => setSearchData({...searchData, MinPrice: val.target.value === "" ? undefined : +val.target.value}), 1000));
                        }}
                    />
                </div>
                <div className="input-field">
                    <span>Max. Price:</span>
                    <TextField
                        value={maxPrice}
                        type="number"
                        onChange={val => {
                            setMaxPrice(val.target.value === "" ? undefined : +val.target.value);
                            if(timeout) {
                                clearTimeout(timeout);
                                setTimeOutVar(undefined);
                            }
                            setTimeOutVar(setTimeout(() => setSearchData({...searchData, MaxPrice: val.target.value === "" ? undefined : +val.target.value}), 1000));
                        }}
                    />
                </div>
                <div className="input-field">
                    <span>Car type:</span>
                    <Select
                        className="admin-select-list"
                        value={searchData.CarType}
                        onChange={val => { setSearchData({...searchData, CarType: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(CarType, "carType") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Reservation type:</span>
                    <Select
                        className="admin-select-list"
                        value={searchData.ReservationType}
                        onChange={val => { setSearchData({...searchData, ReservationType: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(ReservationType, "reservationType") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Reservation status:</span>
                    <Select
                        className="admin-select-list"
                        value={searchData.Status}
                        onChange={val => { setSearchData({...searchData, Status: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(ReservationStatus, "reservationStatus") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Preferences:</span>
                    <Select
                        className="admin-select-list"
                        multiple={true}
                        value={searchData.PrefIds}
                        onChange={val => {setSearchData({...searchData, PrefIds: val.target.value as number[]})}}
                    >
                        {
                            preferences.map(p => {
                                return (
                                    <MenuItem value={p.id}>{p.text}</MenuItem>
                                )
                            })
                        }
                    </Select>
                </div>
            </Container>
            <div className="pager-controls">
                <div className="pagesize-section">
                    <span className="text">Page size:</span>
                    <Select
                        value={searchData.PageSize}
                        onChange={(val) => setSearchData({...searchData, PageSize: +(val.target.value as string), PageNumber: 1})}
                    >
                        <MenuItem value={1}>1</MenuItem>
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={50}>50</MenuItem>
                    </Select>
                </div>
                <div className="button-section">
                    <Button variant="contained" color="secondary" onClick={() => {setSearchData({...searchData, PageNumber: 1})}} disabled={searchData.PageNumber === 1} className="first-button">{"<<"}</Button>
                    <Button variant="contained" color="secondary" onClick={() => {setSearchData({...searchData, PageNumber: searchData.PageNumber - 1})}} disabled={searchData.PageNumber === 1} className="back-button">{"<"}</Button>
                    <span className="page-button">{searchData.PageNumber + "/" + Math.ceil((reservations?.resultCount ?? 1) / searchData.PageSize)}</span>
                    <Button variant="contained" color="secondary" onClick={() => {setSearchData({...searchData, PageNumber: searchData.PageNumber + 1})}} disabled={searchData.PageNumber >= ((reservations?.resultCount ?? 1) / searchData.PageSize)} className="next-button">{">"}</Button>
                    <Button variant="contained" color="secondary"  onClick={() => {setSearchData({...searchData, PageNumber: Math.ceil((reservations?.resultCount ?? 1) / searchData.PageSize)})}} disabled={searchData.PageNumber >= ((reservations?.resultCount ?? 1) / searchData.PageSize)} className="last-button">{">>"}</Button>
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
                open={assignDialogOpen !== ""}
            >
                <DialogTitle>Assign Worker</DialogTitle>
                <DialogContent>
                    <span>Select from available:</span>
                    <Table>
                        <TableBody>
                            <TableRow>
                                {workers.map(w => {
                                    return (
                                        <TableCell onClick={() => assignWorkerToReservation(w.id)}>
                                            <span>{w.name}</span>
                                        </TableCell>
                                    )
                                })}
                            </TableRow>
                        </TableBody>
                    </Table>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setAssignDialogOpen("")}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </div>
    ) 
}