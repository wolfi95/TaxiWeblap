import DateFnsUtils from '@date-io/date-fns';
import { Container, Input, Select, TextField } from '@material-ui/core';
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

    const getEnumAsOptions = (enumType: any, enumName: string) => {
        var items = [];
        items.push(<option value={-1}>None</option>)
        for (let item in enumType) {
            if(!isNaN(Number(item))) {
                
                
                var fnString = enumName + "String";
                
                // @ts-ignore
                var fn = window[fnString];
                
                items.push(<option value={+item}>{fn(+item)}</option>)
            }
        }
        return items;
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
                        value={searchData.CarType}
                        onChange={val => { setSearchData({...searchData, CarType: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(CarType, "carType") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Reservation type:</span>
                    <Select
                        value={searchData.ReservationType}
                        onChange={val => { setSearchData({...searchData, ReservationType: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(ReservationType, "reservationType") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Reservation status:</span>
                    <Select
                        value={searchData.Status}
                        onChange={val => { setSearchData({...searchData, Status: +(val.target.value as string)})}}
                    >
                        { getEnumAsOptions(ReservationStatus, "reservationStatus") }
                    </Select>
                </div>
                <div className="input-field">
                    <span>Preferences:</span>
                    <Select
                        multiple={true}
                        value={searchData.PrefIds}
                        onChange={val => {setSearchData({...searchData, PrefIds: val.target.value as number[]})}}
                    >
                        {
                            preferences.map(p => {
                                return (
                                    <option value={p.id}>{p.text}</option>
                                )
                            })
                        }
                    </Select>
                </div>
            </Container>
            <div className="reservation-list">
                <div className="pager-controls">
                    <span>Page size:</span>
                    <Select
                        value={searchData.PageSize}
                        onChange={(val) => setSearchData({...searchData, PageSize: +(val.target.value as string)})}
                    >
                        <option value={1}>1</option>
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={50}>50</option>
                    </Select>
                    <span>{"<<"}</span>
                    <span>{"<"}</span>
                    <span>{searchData.PageNumber}</span>
                    <span>{">"}</span>
                    <span>{">>"}</span>
                </div>
            </div>
            <div>
                {reservations?.data.map(r => {
                    return (
                        <div>
                            <span>{r.id}</span>
                        </div>
                    );
                })}
            </div>
        </div>
    ) 
}