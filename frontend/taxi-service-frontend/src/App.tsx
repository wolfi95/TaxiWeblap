import React from 'react';
import "./App.scss";
import {
  MuiPickersUtilsProvider,
  DateTimePicker,
} from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Container, Grid, Snackbar, Checkbox, Button } from "@material-ui/core";
import { axiosInstance } from "./config/Axiosconfig";
import { Redirect, RouteComponentProps} from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import { connect } from "react-redux";
import { RootState } from "./redux/reducers/rootReducer";
import {  Dispatch } from 'redux';
import { CarType } from './config/Enums/CarType';
import { ReservationType } from './config/Enums/ReservationType';
import { Preference } from './config/Interfaces/Preference';
import ReservationPriceDto from './dtos/Reservation/ReservationPriceDto';
import { apiKey } from './config/Googleconfig';

export interface DispatchedProps {
  mock: any;
}

export interface IRentState {
  date: any;
  selectedType?: CarType;
  email: string;
  name: string;
  origin: string;
  destination: string;
  open: boolean;
  errorMsg: string;
  tab: ReservationType;
  time: number;
  price?: number;
  preferences: Preference[];
  login: boolean;
  summary: boolean;
  typesClosed: boolean;
  longDistance: boolean;
  longTime: boolean;
}

interface IMappedProps{
  token: string;
}

interface OwnProps {
  scrollTo?: string;
}

type Props = DispatchedProps & IMappedProps & RouteComponentProps<OwnProps>;

class App extends React.Component<Props, IRentState> {
  /**
   *
   */
  constructor(props: Props) {
    super(props);             
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

    //When switching tabs set the selected car type to none
    this.setState({selectedType: undefined});

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

  getPrice = (rentType: ReservationType) => {   
    if (rentType === ReservationType.Oneway) {
       //Google Autocomple is not a react Native element
      var origin = (document.getElementById(
        "origin-oneway"
      ) as HTMLInputElement).value;
      var destination = (document.getElementById(
        "destination-oneway"
      ) as HTMLInputElement).value;

      this.setState({origin: origin, destination: destination});
      if(!this.state.selectedType) {
        this.setState({errorMsg: "You must select a car type", open: true});
      }
      var data: ReservationPriceDto = {
        FromAddress: origin,
        ToAddrress: destination,
        ReservationType: ReservationType.Oneway,
        CarType: this.state.selectedType as CarType,
        PreferenceIds: this.state.preferences.map(x => x.Id),
        Duration: undefined
      };

      axiosInstance
        .post<number>("reservation/price", data)
        .then((res) => {
          this.setState({price: res.data});
        })
        .catch((error) => {
          if(error.response?.status === 404){
            this.setState({errorMsg: "Unknown error occured", open: true});
          } else {
            if(error.response?.data !== undefined){
              this.setState({errorMsg: error.response.data, open: true})
            }          
            else{
              this.setState({errorMsg: "Cannot reach server", open: true})
            }
          }
        });
    } else {
      var origin = (document.getElementById(
        "origin-bythehour"
      ) as HTMLInputElement).value;

      var hours = (document.getElementById("duration") as HTMLSelectElement)
        .value;

      this.setState({origin: origin, time: +hours});
      if(!this.state.selectedType) {
        this.setState({errorMsg: "You must select a car type", open: true});
      }

      var data: ReservationPriceDto = {
        FromAddress: origin,
        ToAddrress: "",
        ReservationType: ReservationType.ByTheHour,
        Duration: +hours,
        CarType: this.state.selectedType as CarType,
        PreferenceIds: this.state.preferences.map(x => x.Id)
      };

      axiosInstance
        .post<number>("reservation/price", data )
        .then((res) => {          
          this.setState({price: res.data});
        })
        .catch((error) => {
          if(error.response?.status === 404){
            this.setState({errorMsg: "Unknown error occured", open: true});
          }
          else {
            if(error.response?.data !== undefined){
              this.setState({errorMsg: error.response.data, open: true});
            }          
            else{
              this.setState({errorMsg: "Cannot reach server", open: true});
            }
          }
        });
    }    
  };

  handleDateChange = (date: any) => {    
    this.setState({ date: date });
  };

  onSelectClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
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

    switch (event.currentTarget.id) {
      case "executive":
        var element = document.getElementById("executive-card");
        if (element != null) {
          element.className = "price price-selected";
        }

        var price = +((document.getElementById("execprice") as Element).innerHTML.split(" ")[0]);
        this.setState({ selectedType: CarType.Executive, price: price });
        break;
      case "luxury":
        var element = document.getElementById("luxury-card");
        if (element != null) {
          element.className = "price price-selected";
        }

        var price = +((document.getElementById("luxprice") as Element).innerHTML.split(" ")[0]);
        this.setState({ selectedType: CarType.Luxury, price: price });
        break;
      case "sevenSeater":
        var element = document.getElementById("sevenSeater-card");
        if (element != null) {
          element.className = "price price-selected";
        }

        var price = +((document.getElementById("7seaterprice") as Element).innerHTML.split(" ")[0]);
        this.setState({ selectedType: CarType.SevenSeater, price: price });
        break;
      default:
        this.setState({ selectedType: undefined, price: undefined });
        break;
    }
  };

  handleEmailChange = (val: string) => {
    this.setState({ email: val });
    (document.getElementById("email-input") as HTMLInputElement).className = "col-md-4";
  };

  handleNameChange = (val: string) => {
    this.setState({ name: val });
    (document.getElementById("name-input") as HTMLInputElement).className = "col-md-4";
  };

  getMinDate = (): Date => {
    var now = new Date();
    var min = now.setHours(now.getHours() + 12);
    return new Date(min);
  };

  submit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    var error = false;    
    if(this.state.date < this.getMinDate()){
      var x = document.getElementById("date-picker");
      x?.scrollIntoView({behavior:"smooth", block:"center"})
      error = true;
    }
    if(this.props.token === "")
      if (this.state.email.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Email address cannot be empty.",
        });
        (document.getElementById("email-input") as HTMLInputElement).className +=" error";
        (document.getElementById("email-input") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
      } else {
        if (!this.state.email.includes("@")) {
          error = true;
          this.setState({
            open: true,
            errorMsg: "Email address must contain '@' character.",
          });
          (document.getElementById("email-input") as HTMLInputElement).className +=" error";
          (document.getElementById("email-input") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
        } else {
          var reg = new RegExp("^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$");
          if (!reg.test(this.state.email)) {
            error = true;
            this.setState({ open: true, errorMsg: "Email address not valid." });
            (document.getElementById("email-input") as HTMLInputElement).className +=" error";
            (document.getElementById("email-input") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
          }
        }
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

    if (this.state.tab === ReservationType.Oneway) {
      if ((document.getElementById("destination-oneway") as HTMLInputElement).value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Destination address cannot be empty.",
        });
        (document.getElementById("destination-oneway") as HTMLInputElement).className +=" error";
        (document.getElementById("destination-oneway") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
      }

      if ((document.getElementById("origin-oneway") as HTMLInputElement).value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Origin address cannot be empty.",
        });
        (document.getElementById("origin-oneway") as HTMLInputElement).className +=" error";
        (document.getElementById("origin-oneway") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
      }
    } else {
      if ((document.getElementById("origin-bythehour") as HTMLInputElement).value.length === 0) {
        error = true;
        this.setState({
          open: true,
          errorMsg: "Origin address cannot be empty.",
        });
        (document.getElementById("origin-bythehour") as HTMLInputElement).className +=" error";
        (document.getElementById("origin-bythehour") as HTMLInputElement).scrollIntoView({behavior: "smooth",block: "center"});
      }
    }
    if(!error) {
      this.setState({summary: true});
      this.saveState();
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
    var index = temp.findIndex(pref => pref.Text == e.currentTarget.id);
    temp[index].Value = !temp[index].Value
    this.setState({preferences: temp});
  }

  handleOriginChange =(e: React.ChangeEvent<HTMLInputElement>) => {    
    this.setState({origin: e?.currentTarget.value})    
  }

  handleDestinationChange =(e: React.ChangeEvent<HTMLInputElement>) => {    
    this.setState({destination: e?.currentTarget.value})
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
    switch (this.state.selectedType) {
      case CarType.Executive:
        var element = document.getElementById("executive-card");
        if (element != null) {
          element.className = "price price-selected";
        }
        this.setState({typesClosed: false});
        break;
      case CarType.Luxury:
        var element = document.getElementById("luxury-card");
        if (element != null) {
          element.className = "price price-selected";
        }
        this.setState({typesClosed: false});
        break;
      case CarType.SevenSeater:
        var element = document.getElementById("sevenSeater-card");
        if (element != null) {
          element.className = "price price-selected";
        }
        this.setState({typesClosed: false});
        break;
      default:
        var container = document.getElementById("typeContainer");
        if(container !== null)
          container.style.display = "none";
          this.setState({typesClosed: true});
        break;
    }
  }

  componentDidUpdate(){
    var x = document.getElementById((this.props.location.state as OwnProps)?.scrollTo as string);
    if(x) {
      x?.scrollIntoView({behavior: "smooth", block: "center"})  
      this.props.history.replace(this.props.location.pathname,{});
    }
  }

  render() {
    if(this.state.login)
      return <Redirect to="/login"/>
    else
    if(this.state.summary)
      return <Redirect to="/summary"/>
    else
    if(this.state.longDistance)
      return <Redirect to="/longdistance" />
    else
    if(this.state.longTime)
      return <Redirect to="/longtime" />
    else {
      return (
        <div className="container-width">
          <div className={this.state.typesClosed ? "initial-height" : ""}>
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

            <Container id="oneway" className="tabcontent" maxWidth="xl">
              <div className="row">            
                <input
                  className="col-md-4"
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
                  className="col-md-4"
                />
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                  <DateTimePicker
                    ampm={true}
                    strictCompareDates
                    className="col-md datepicker"
                    minDate={this.getMinDate()}
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
                    strictCompareDates                  
                    className="col-md datepicker"
                    minDate={this.getMinDate().setMinutes(this.getMinDate().getMinutes()-1)}             
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
                    <li className="grey">
                      <div id="execprice"></div>
                    </li>
                    <li>
                      <img
                        src={require("../images/executive/mercedes_e.jpg")}
                        className="car"
                      />
                    </li>
                    <li>Max 4 passengers</li>
                    <li className="grey">
                      <a
                        id="executive"
                        className="button"
                        onClick={(e) => this.onSelectClick(e)}
                      >
                        Select
                      </a>
                    </li>
                  </ul>
                </Grid>

                <Grid item md={4} className="typeCard">
                  <ul className="price" id="luxury-card">
                    <li className="header">Luxury</li>
                    <li className="grey">
                      <div id="luxprice"></div>
                    </li>
                    <li>
                      <img
                        src={require("../images/luxury/mercedes_s.png")}
                        className="car"
                      />
                    </li>
                    <li>Max 4 passengers</li>
                    <li className="grey">
                      <a
                        id="luxury"
                        className="button"
                        onClick={(e) => this.onSelectClick(e)}
                      >
                        Select
                      </a>
                    </li>
                  </ul>
                </Grid>

                <Grid item md={4} className="typeCard">
                  <ul className="price" id="sevenSeater-card">
                    <li className="header">7 seater</li>
                    <li className="grey">
                      <div id="7seaterprice"></div>
                    </li>
                    <li>
                      <img
                        src={require("../images/7seater/mercedes_v.jpg")}
                        className="car"
                      />
                    </li>
                    <li>Max 7 passengers</li>
                    <li className="grey">
                      <a
                        id="sevenSeater"
                        className="button"
                        onClick={(e) => this.onSelectClick(e)}
                      >
                        Select
                      </a>
                    </li>
                  </ul>
                </Grid>
              </Grid>
            </div>  
            {this.state.selectedType !== undefined &&
            <div>
              <Container>
                {this.state.preferences.map(pref => (
                  <div className="pref-row">
                    <Checkbox
                      id={pref.Text}
                      checked={pref.Value}
                      onChange={(e) => this.handlePrefChange(e)}
                      inputProps={{ "aria-label": "Checkbox A" }}
                    />
                    <span>{pref.Text}</span>
                  </div>
                ))}
                <input
                  className="searchButton"
                  id="search-oneway"
                  type="button"
                  value="Get Price"
                  onClick={() => this.getPrice(ReservationType.Oneway)}
                />
              </Container>                 
              <div className="d-md-flex justify-content-md-center mt-3 form-end">                
                <Button
                  className="continueButton"
                  id="continue-button"                  
                  onClick={(e) => this.submit(e)}
                >
                  Continue to summary
                </Button>
              </div>              
            </div>
            }          
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
