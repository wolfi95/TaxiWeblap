import { AppBar, createStyles, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemText, makeStyles, Theme, Toolbar, Typography, useTheme } from '@material-ui/core';
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { RootState } from '../../redux/reducers/rootReducer';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import './AccountPageWrapper.scss';
import clsx from 'clsx';
import { Redirect } from 'react-router';

interface IMappedProps {
    token: string
}

interface IOwnProps {
    children: JSX.Element
    header: string;
}

type Props = IMappedProps & IOwnProps;

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    drawerRoot: {
      display: 'flex',
      flexDirection: 'row'
    },
    appBar: {
        height: 'fit-content',
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      marginTop: '-64px'
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    },
    content: {
      maxWidth: '100%',
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
  }),
);

function AccountPageWrapper(props: Props) {
    const classes = useStyles();
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);
    const [content, changeContent] = React.useState("");
    const menuRedirects = [
        'overview',
        'pass',
        'personal',
        'reservations',
        'settings'
    ]

    const handleDrawerOpen = () => {
        setOpen(true);
    }; 

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleMenuClick = (index: number) =>{
        changeContent("/account/" + menuRedirects[index])
    }

    useEffect(() => {
      if(content)
        changeContent("");
      }
    )

    if(!props.token)
        return(<Redirect to="/login"/>)
    else 
    if(content !== "") {
      return(<Redirect to={content}/>)
    }
    else {
        return (
            <div className="acc-nav-root">
                <CssBaseline />
                <AppBar
                  position="relative"
                  className={clsx(classes.appBar, {
                      [classes.appBarShift]: open,
                  })}
                >
                <Toolbar>
                    <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(classes.menuButton, open && classes.hide)}
                    >
                    <MenuIcon />
                    </IconButton>
                    <Typography variant="h6">
                    <span>My Account / </span>
                    <span>{" " + props.header}</span>
                    </Typography>
                </Toolbar>
                </AppBar>
                <div className={classes.drawerRoot}>
                <Drawer
                  className={classes.drawer}
                  variant="persistent"
                  anchor="left"
                  open={open}
                  classes={{
                    paper: classes.drawerPaper,
                  }}
                >
                <div className={classes.drawerHeader}>
                    <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {['Account overview', 'Change password', 'Change personal data', 'My reservations', 'Settings'].map((text, index) => (
                        <div>
                            <ListItem button onClick={() => handleMenuClick(index)} key={text}>
                                <ListItemText primary={text} />
                            </ListItem>
                            <Divider />
                        </div>
                    ))}
                </List>
                </Drawer>
                <main
                className={clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
                >
                    {props.children}
                </main>
            </div>
        </div>
        )
    }
}

const mapStateToProps = (state: RootState): IMappedProps => {
    return{ token: state.user.token }
};
  
const mapDispatchToProps = (dispatch: Dispatch) => {

}

const connector = connect(mapStateToProps);
export default connector(AccountPageWrapper);