import React from 'react';
import "./ReservationPage.scss";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Container, Grid, Snackbar, Checkbox, Button, TextField } from "@material-ui/core";
import { axiosInstance } from "../../config/Axiosconfig";
import { Redirect, RouteComponentProps} from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { RootState } from "../../redux/reducers/rootReducer";
import {  Dispatch } from 'redux';
import { CarType } from '../../config/Enums/CarType';
import { ReservationType } from '../../config/Enums/ReservationType';
import { Preference } from '../../config/Interfaces/Preference';
import ReservationPriceDto from '../../dtos/Reservation/ReservationPriceDto';
import { apiKey } from '../../config/Googleconfig';
import 'bootstrap'
import ReservationDto from '../../dtos/Reservation/ReservationDto';
import AppCheckbox from '../../Components/AppCheckbox/Appcheckbox';

export interface DispatchedProps {
  mock: any;
}
export const getMinDate = (): Date => {
  var now = new Date();
  var min = now.setHours(now.getHours() + 12);
  return new Date(min);
};
const getSettableMinDate = (): Date => {
  var now = new Date();
  var min = now.setHours(now.getHours() + 11.8);  
  return new Date(min);
};

export interface IReservationPageState {
  date: Date;
  selectedType?: CarType;
  origin: string;
  destination: string;
  open: boolean;
  errorMsg: string;
  tab: ReservationType;
  time: number;
  price?: number;
  preferences: Preference[];
  comment: string;
  summary: string;
  discount: string;
}
const initialState: IReservationPageState = { 
  date: getMinDate(),
  destination: "",
  errorMsg: "",
  open: false,
  origin: "",
  preferences: [],
  summary: "",
  tab: ReservationType.Oneway,
  time: 0,
  price: undefined,
  selectedType: undefined,
  comment: "",
  discount: ""
}

interface IMappedProps{
  token: string;
}

interface OwnProps {
  scrollTo?: string;
}

type Props = DispatchedProps & IMappedProps & RouteComponentProps<OwnProps>;

class ReservationPage extends React.Component<Props, IReservationPageState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);
    this.state = initialState;
    axiosInstance.defaults.headers["Authorization"] = "Bearer " + props.token;
    axiosInstance.get("preferences")
      .then(res => {
        this.setState({preferences: res.data});
      })
      .catch(err => {});
  }

  autocompleteOrigin?: google.maps.places.Autocomplete;
  autocompleteDestination?: google.maps.places.Autocomplete;
  autocompleteOriginByTheHour?: google.maps.places.Autocomplete;

  //Initializes the autocomplete fields
  initAutocomplete = () => {
    // Create the autocomplete object, restricting the search predictions to
    // geographical location types.
    var element = document.getElementById("origin-oneway") as HTMLInputElement;
    this.autocompleteOrigin = new window.google.maps.places.Autocomplete(element, {    
      componentRestrictions: {
        country: 'hu'
      }
    });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    this.autocompleteOrigin.setFields(["address_component"]);
    this.autocompleteOrigin.addListener("place_changed", this.handleOriginChange);

    this.autocompleteDestination = new window.google.maps.places.Autocomplete(
      document.getElementById("destination-oneway") as HTMLInputElement,
      {
      componentRestrictions: {
        country: 'hu'
      }}
    );

    this.autocompleteDestination.setFields(["address_component"]);
    this.autocompleteDestination.addListener("place_changed", this.handleDestinationChange);

    element = document.getElementById("origin-bythehour") as HTMLInputElement;
    this.autocompleteOriginByTheHour = new window.google.maps.places.Autocomplete(element, {    
      componentRestrictions: {
        country: 'hu'
      }
    });

    // Avoid paying for data that you don't need by restricting the set of
    // place fields that are returned to just the address components.
    this.autocompleteOriginByTheHour.setFields(["address_component"]);
    this.autocompleteOriginByTheHour.addListener("place_changed", this.handleOriginChange);
  }

  //If the user allowed geolocation set the bounds of the search
  geolocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        var geolocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        var circle = new window.google.maps.Circle({
          center: geolocation,
          radius: position.coords.accuracy < 100000 ? position.coords.accuracy : 100000,
        });
        this.autocompleteOrigin?.setBounds(circle.getBounds());        
        this.autocompleteDestination?.setBounds(circle.getBounds()); 
        this.autocompleteOriginByTheHour?.setBounds(circle.getBounds()); 
      });
    }
  }

  //Initializes the tabs, and autocomplete fields
  initialize = () => {
    this.initAutocomplete();
    this.geolocate();
  
    if(this.state.tab === ReservationType.Oneway) {
      var origin = document.getElementById("origin-oneway") as HTMLInputElement;
      origin.disabled = false;
      var dest = document.getElementById("destination-oneway") as HTMLInputElement;
      dest.disabled = false;
    }
    else {
      var origin = document.getElementById("origin-bythehour") as HTMLInputElement;
      origin.disabled = false;
    }
  }

  //Called when the user focuses an autocomplete field
  startAutoSession = (e: React.FocusEvent<HTMLInputElement>) => {
    if(e.currentTarget.id === "origin-oneway") {
      (document.getElementById("origin-oneway") as HTMLInputElement).className = "col-md-4"; 
    }
    if(e.currentTarget.id === "destination-oneway") {
      (document.getElementById("destination-oneway") as HTMLInputElement).className = "col-md-4"; 
    }
    if(e.currentTarget.id === "origin-bythehour") {
      (document.getElementById("origin-bythehour") as HTMLInputElement).className = "col-md-4";
    } 
  }

  //Pure js tab switching instead of routing
  switchTab = (
    evt: React.MouseEvent<HTMLButtonElement, MouseEvent> | null,
    tabName: string,
    init: boolean = false
  ) => {
    // Declare all variables
    var i, tabcontent, tablinks;

    // Get all elements with class="tabcontent" and hide them
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
      (tabcontent[i] as HTMLElement).style.display = "none";
    }

    // Get all elements with class="tablinks" and remove the class "active"
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    // Show the current tab, and add an "active" class to the button that opened the tab
    (document.getElementById(tabName) as HTMLElement).style.display = "block";
    if (evt != null) {
      if (evt.currentTarget !== null)
        (evt.currentTarget as HTMLElement).className += " active";
    } else {
      if(this.state.tab === ReservationType.Oneway)
        tablinks[0].className += " active";
      else
        tablinks[1].className += " active";
    }

    if(!init) {
      if (tabName === "oneway") this.setState({ tab: ReservationType.Oneway });
      else this.setState({ tab: ReservationType.ByTheHour });
    }
  };

  getPrice = () => {   
    if (this.state.tab === ReservationType.Oneway) {
       //Google Autocomple is not a react Native element
      var origin = (document.getElementById(
        "origin-oneway"
      ) as HTMLInputElement).value;
      var destination = (document.getElementById(
        "destination-oneway"
      ) as HTMLInputElement).value;

      this.setState({origin: origin, destination: destination});
      if(this.state.selectedType === undefined) {
        this.setState({errorMsg: "You must select a car type", open: true});
        return;
      }
      var data: ReservationPriceDto = {
        FromAddress: origin,
        ToAddrress: destination,
        ReservationType: ReservationType.Oneway,
        CarType: this.state.selectedType,
        PreferenceIds: this.state.preferences.map(x => x.id),
        Duration: undefined,
        DiscountCode: this.state.discount
      };

      axiosInstance
        .post<number>("reservation/price", data)
        .then((res) => {
          this.setState({price: res.data});
        })
        .catch(err => {})
    } else {
      var origin = (document.getElementById(
        "origin-bythehour"
      ) as HTMLInputElement).value;

      var hours = (document.getElementById("duration") as HTMLSelectElement)
        .value;

      this.setState({origin: origin, time: +hours});
      if(this.state.selectedType === undefined) {
        this.setState({errorMsg: "You must select a car type", open: true});
      }

      var data: ReservationPriceDto = {
        FromAddress: origin,
        ToAddrress: "",
        ReservationType: ReservationType.ByTheHour,
        Duration: +hours,
        CarType: this.state.selectedType as CarType,
        PreferenceIds: this.state.preferences.map(x => x.id),
        DiscountCode: this.state.discount
      };

      axiosInstance
        .post<number>("reservation/price", data )
        .then((res) => {          
          this.setState({price: res.data});
        })
        .catch(err => {})
    }    
  };

  handleDateChange = (date: any) => {    
    this.setState({ date: date });
  };

  onSelectClick = (id: string) => {
    switch (this.state.selectedType) {
      case CarType.Executive:
        var element = document.getElementById("executive-card");
        if (element != null) {
          element.className = "price";
        }
        break;
      case CarType.Luxury:
        var element = document.getElementById("luxury-card");
        if (element != null) {
          element.className = "price";
        }
        break;
      case CarType.SevenSeater:
        var element = document.getElementById("sevenSeater-card");
        if (element != null) {
          element.className = "price";
        }
        break;
      default:
        break;
    }
    
    switch (id) {
      case "executive": {
        var element = document.getElementById("executive-card");
        if (element != null) {
          element.className = "price price-selected";
        }
        this.setState({ selectedType: CarType.Executive});
        break;
      }
      case "luxury": {
        var element = document.getElementById("luxury-card");
        if (element != null) {
          element.className = "price price-selected";
        }

        this.setState({ selectedType: CarType.Luxury });
        break;
      }
      case "sevenSeater": {
        var element = document.getElementById("sevenSeater-card");
        if (element != null) {
          element.className = "price price-selected";
        }

        this.setState({ selectedType: CarType.SevenSeater });
        break;
      }
      default: {
        this.setState({ selectedType: undefined, price: undefined });
        break;
      }
    }
  };  

  submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    var error = false;    
    if(this.state.date < getMinDate()){
      var x = document.getElementById("date-picker");
      x?.scrollIntoView({behavior:"smooth", block:"center"})
      error = true;
      this.setState({open: true, errorMsg: "Yout can only make reservations 12 hours in advance."})
    }

    if(this.state.selectedType === undefined) {
      error = true;
      this.setState({open: true, errorMsg: "Please select car type."})
    }

    if(!this.state.price)
    {
      error = true;
        this.setState({
          open: true,
          errorMsg: "Please search for a valid route",
        });
    }

    var origin;
    var destination;

    if (this.state.tab === ReservationType.Oneway) {
      origin = document.getElementById("origin-oneway") as HTMLInputElement;
      destination = document.getElementById("destination-oneway") as HTMLInputElement;

      if (destination.value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Destination address cannot be empty.",
        });
        destination.className +=" error";
        destination.scrollIntoView({behavior: "smooth",block: "center"});
      }

      if (origin.value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Origin address cannot be empty.",
        });
        origin.className +=" error";
        origin.scrollIntoView({behavior: "smooth",block: "center"});
      }
    } else {
      origin = (document.getElementById("origin-bythehour") as HTMLInputElement);
      if (origin.value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Origin address cannot be empty.",
        });
        origin.className +=" error";
        origin.scrollIntoView({behavior: "smooth",block: "center"});
      }
    }
    var prefs = this.state.preferences.filter(p => p.value).map(p => p.id);
    if(!error) {
      var data = {
        CarType: this.state.selectedType,
        Comment: this.state.comment,
        Date: this.state.date.getFullYear() + "/" + (this.state.date.getMonth() + 1) + "/" + this.state.date.getDate() + " " + (this.state.date.getHours() % 12) + ":" + (this.state.date.getMinutes() < 10 ? ("0"+this.state.date.getMinutes()) : this.state.date.getMinutes()) + (this.state.date.getHours() >= 12 ? ' pm' : ' am'),
        FromAddress: origin.value,
        PreferenceIds: prefs,
        ReservationType: this.state.tab,
        ToAddrress: destination?.value ?? "",
        Duration: this.state.time,
        DiscountCode: this.state.discount
      } as ReservationDto;
      axiosInstance.post("reservation/make", data)
        .then(res => {          
          this.setState({summary: res.data});
          this.saveState();
        })
        .catch(err => {})
    }
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  saveState = (e?: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => { 
    e?.preventDefault();    
  }

  handlePrefChange = (e:React.ChangeEvent<HTMLInputElement>) => {
    var temp = this.state.preferences;
    var index = temp.findIndex(pref => pref.text == e.currentTarget.id);
    temp[index].value = !temp[index].value
    this.setState({preferences: temp});
  }

  handleOriginChange =(e: React.ChangeEvent<HTMLInputElement>) => {    
    this.setState({origin: e?.currentTarget.value})    
  }

  handleDestinationChange =(e: React.ChangeEvent<HTMLInputElement>) => {    
    this.setState({destination: e?.currentTarget.value})
  }

  handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    if(e.currentTarget.value.length <= 500)
      this.setState({comment: e.currentTarget.value})
  }

  componentDidMount() {
    if(this.state.tab === ReservationType.Oneway) {
    var origin = document.getElementById("origin-oneway") as HTMLInputElement;
    origin.disabled = true;

    var dest = document.getElementById(
      "destination-oneway"
    ) as HTMLInputElement;
    dest.disabled = true;
    }
    else {
      var origin = document.getElementById("origin-bythehour") as HTMLInputElement;
      origin.disabled = true;
    }

    var scrpt = document.getElementById("googleScript");
    if(scrpt !== null )
      scrpt.remove();
    const script = document.createElement("script");
    script.id = "googleScript";
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.addEventListener("load", () => {
      this.initialize();
    });
    document.body.appendChild(script);

    this.state.tab === ReservationType.Oneway ?
      this.switchTab(null, "oneway", true)
      : this.switchTab(null, "bythehour", true);    
  }

  componentDidUpdate(){
    var x = document.getElementById((this.props.location.state as OwnProps)?.scrollTo as string);
    if(x) {
      x?.scrollIntoView({behavior: "smooth", block: "center"})  
      this.props.history.replace(this.props.location.pathname,{});
    }
  }

  render() {
    if(this.state.summary !== "")
      return <Redirect to={"/account/" + this.state.summary + "/details"}/>
    else {
      return (
        <div className="container-width">
          <div>
            <div className="tab">
              <button
                className="tablinks"
                onClick={(event) => {
                  this.switchTab(event, "oneway");
                }}
              >
                One-Way
              </button>
              <button
                className="tablinks"
                onClick={(event) => {
                  this.switchTab(event, "bythehour");
                }}
              >
                By The Hour
              </button>
            </div>        

            <Container id="oneway" className="tabcontent" maxWidth="lg">
              <div className="row">            
                <input
                  className="col-sm-4"
                  id="origin-oneway"
                  value={this.state.origin}
                  onChange={(e) => this.handleOriginChange(e)}
                  placeholder="From"
                  onFocus={(e) => this.startAutoSession(e)}              
                  type="text"
                />
                <input
                  id="destination-oneway"
                  placeholder="To"
                  value={this.state.destination}
                  onChange={(e) => this.handleDestinationChange(e)}
                  type="text"
                  onFocus={(e) => this.startAutoSession(e)}
                  className="col-sm-4"
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    ampm={true}
                    inputVariant="filled"
                    strictCompareDates
                    className="col-sm datepicker"
                    minDate={getSettableMinDate()}
                    variant="inline"
                    format="MM/dd/yyyy h:mm a"
                    margin="normal"
                    id="date-picker"
                    label="Date"
                    value={this.state.date}
                    onChange={(v) => this.handleDateChange(v)}
                  />
                </MuiPickersUtilsProvider>                
              </div>
            </Container>

            <Container id="bythehour" className="tabcontent"  maxWidth="xl">
              <div className="row">
                <input
                  className="col-md-4"
                  id="origin-bythehour"
                  value={this.state.origin}
                  onChange={(e) => this.handleOriginChange(e)}
                  placeholder="From"
                  onFocus={(e) => this.startAutoSession(e)}
                  type="text"
                />
                <select
                  name="duration"
                  id="duration"
                  className="hour-select col-md-2"
                >
                  <option value="3">3 hours</option>
                  <option value="4">4 hours</option>
                  <option value="5">5 hours</option>
                  <option value="6">6 hours</option>
                  <option value="7">7 hours</option>
                  <option value="8">8 hours</option>
                </select>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    ampm={true}
                    inputVariant="filled"
                    strictCompareDates                  
                    className="col-md datepicker"
                    minDate={getSettableMinDate()}             
                    variant="inline"
                    format="MM/dd/yyyy hh:mm"
                    margin="normal"
                    id="date-picker"
                    label="Date"
                    value={this.state.date}
                    onChange={this.handleDateChange}
                  />
                </MuiPickersUtilsProvider>
              </div>
            </Container>
          </div>       

          <div id="typeContainer">
            <div className="typeContainer mb-4">
              <Grid container spacing={6}>
                <Grid item md={4} className="typeCard">
                  <ul className="price" id="executive-card">
                    <li className="header">Executive</li>
                    <li>
                      <img
                        src={require('../../resources/images/executive/mercedes_e.png').default}
                        className="car"
                      />
                    </li>
                    <li>Max 4 passengers</li>
                    <li className="grey">
                      <Button
                        id="executive"
                        variant="contained"
                        color={this.state.selectedType === CarType.Executive ? "primary" : "secondary"}
                        onClick={(e) => this.onSelectClick(e.currentTarget.id)}
                      >
                        Select
                      </Button>
                    </li>
                  </ul>
                </Grid>

                <Grid item md={4} className="typeCard">
                  <ul className="price" id="luxury-card">
                    <li className="header">Luxury</li>
                    <li>
                      <img
                        src={require("../../resources/images/luxury/mercedes_s.png").default}
                        className="car"
                      />
                    </li>
                    <li>Max 4 passengers</li>
                    <li className="grey">
                      <Button
                        variant="contained"
                        color={this.state.selectedType === CarType.Luxury ? "primary" : "secondary"}
                        id="luxury"
                        onClick={(e) => this.onSelectClick(e.currentTarget.id)}
                      >
                        Select
                      </Button>
                    </li>
                  </ul>
                </Grid>

                <Grid item md={4} className="typeCard">
                  <ul className="price" id="sevenSeater-card">
                    <li className="header">7 seater</li>
                    <li>
                      <img
                        src={require("../../resources/images/7seater/mercedes_v.png").default}
                        className="car"
                      />
                    </li>
                    <li>Max 7 passengers</li>
                    <li className="grey">
                      <Button
                        id="sevenSeater"
                        variant="contained"
                        color={this.state.selectedType === CarType.SevenSeater ? "primary" : "secondary"}
                        onClick={(e) => this.onSelectClick(e.currentTarget.id)}
                      >
                        Select
                      </Button>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>              
            <div>
              <Container className="reservation-details">
                <h2>Preferences:</h2>
                <div className="prefs">
                  {this.state.preferences.map(pref => {
                    return (
                    <div className="pref-row">
                      <AppCheckbox
                        id={pref.text}
                        checked={pref.value}
                        onChange={(e) => this.handlePrefChange(e)}
                        label={pref.text}
                      />
                    </div>
                    )}
                  )}
                </div>
                <TextField 
                  className="comment-box"
                  label="Comment"
                  variant="filled"
                  value={this.state.comment} 
                  onChange={(e) => this.handleCommentChange(e)}
                  fullWidth={true}
                  multiline={true}
                  rows={15}
                  rowsMax={15}>
                </TextField>
                <div className="price-row">
                  <TextField
                    className="discount-input"
                    variant="filled"
                    label="Discount Code"
                    value={this.state.discount}
                    onChange={(v) => this.setState({discount: v.currentTarget.value})}
                  />
                  <div className="calc">
                  <Button
                    variant="contained"
                    color="primary"
                    className="searchButton"
                    id="search-oneway"
                    onClick={() => this.getPrice()}
                  >
                    Calculate
                  </Button>
                  <span>{this.state.price ?? "xxx"} .-</span>
                  </div>
                </div>
                             
              <div className="d-md-flex justify-content-md-end form-end">                
                <Button
                  variant="contained"
                  color="primary"
                  className="continueButton"
                  id="continue-button"                  
                  onClick={(e) => this.submit(e)}
                >
                  Make Reservation
                </Button>
              </div>     
            </Container>           
            </div>
          </div>
          <Snackbar
            open={this.state.open}
            autoHideDuration={6000}
            onClose={this.handleClose}
          >
            <Alert onClose={this.handleClose} severity="error">
              {this.state.errorMsg}
            </Alert>
          </Snackbar>
        </div>
      );
    }
  }
}

const mapStateToProps = (state: RootState): IMappedProps => {
  return{ token: state.user.token }
};

const mapDispatchToProps = (dispatch: Dispatch) => {
 
}
const connector = connect(mapStateToProps)

export default connector(ReservationPage);
