import React from 'react';
import clsx from 'clsx';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import { 
  Drawer, CssBaseline, AppBar, Toolbar, List, Typography, Divider,
  IconButton, ListItem, ListItemIcon, ListItemText
} from '@material-ui/core';
import {
  Menu as MenuIcon, ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon,
  Home as HomeIcon, AccountBox as AccountBoxIcon, Settings as SettingsIcon, SportsTennis,
  AccountCircle, Translate as TranslateIcon
} from '@material-ui/icons';

import { AuthUserContext } from '../Session';
import SignOutButton from '../SignOut';
import * as ROUTES from '../../constants/routes';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
    flexGrow: 1
  },
  title: {
    flexGrow: 1
  },
  appBar: {
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
    width: 'auto',
    flexShrink: 0,
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
}));


const HeaderAndDrawer = () => {
  const { t, i18n } = useTranslation(['translation',]);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(false);


  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const changeLanguage = () => {
    if (i18n.language !== 'es') {
      i18n.changeLanguage('es');
    } else {
      i18n.changeLanguage('en');
    }
  };

  const Profile = () => (
    <div style={{position:'left'}}>
      <IconButton
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
      >
        <AccountCircle />
      </IconButton>      
      <IconButton
        aria-controls="menu-appbar"
        aria-haspopup="true"
        color="inherit"
      >
        <SignOutButton />
      </IconButton>
    </div>
  );


  const ListAuth = () => (
    <List>
      <ListItem button component={Link} to={ROUTES.LANDING} onClick={handleDrawerClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Landing" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.HOME} onClick={handleDrawerClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Home" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.MATCH} onClick={handleDrawerClose}>
        <ListItemIcon>
          <SportsTennis />
        </ListItemIcon>
        <ListItemText primary="Match" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.ACCOUNT} onClick={handleDrawerClose}>
        <ListItemIcon>
          <AccountBoxIcon />
        </ListItemIcon>
        <ListItemText primary="Account" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.ADMIN} onClick={handleDrawerClose}>
        <ListItemIcon>
          <SettingsIcon />
        </ListItemIcon>
        <ListItemText primary="Admin" />
      </ListItem>
      <ListItem button onClick={() => { changeLanguage(); handleDrawerClose(); }}>
        <ListItemIcon>
          <TranslateIcon />
        </ListItemIcon>
        <ListItemText primary="Translate" />
      </ListItem>
    </List>
  );

  const ListNonAuth = () => (
    <List>
      <ListItem button component={Link} to={ROUTES.LANDING} onClick={handleDrawerClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Landing" />
      </ListItem>
      <ListItem button component={Link} to={ROUTES.SIGN_IN} onClick={handleDrawerClose}>
        <ListItemIcon>
          <HomeIcon />
        </ListItemIcon>
        <ListItemText primary="Sign In" />
      </ListItem>
    </List>
  );
  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar position="static">
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
          <Typography variant="h6" className={classes.title}>
            {t('app_title')}
          </Typography>
          <AuthUserContext.Consumer>
            {authUser =>
              authUser ? <Profile /> : <span />
            }
          </AuthUserContext.Consumer>
        </Toolbar>
      </AppBar>
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
        <AuthUserContext.Consumer>
          {authUser =>
            authUser ? <ListAuth handleDrawerClose={handleDrawerClose} /> : <ListNonAuth
              handleDrawerClose={handleDrawerClose} />
          }
        </AuthUserContext.Consumer>
      </Drawer>
    </div>
  );
}



export default HeaderAndDrawer;