import React, { Component } from 'react';
import 'date-fns';
import {TextField, Button, Typography, 
    RadioGroup, Radio, FormControlLabel, FormLabel, FormControl,
    CssBaseline, Paper} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withAuthUser } from '../Session';
import * as ROUTES from '../../constants/routes';
import { withTranslation } from 'react-i18next';
import { makeStyles } from '@material-ui/core/styles';

class MatchCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDisabled: true,
            loading: true,
            users: [],
            match: {
                host: '',
                host_uid: '',
                opponent: '',
                opponent_uid: '',
                status: 'pending',
                match_date: new Date(),
                players: '1vs1',
                match_type: 'friendly'
            },
        };
        this.onChange = this.onChange.bind(this);
        this.onChangeMatchDate = this.onChangeMatchDate.bind(this);
    }


    
    onSubmit = (e) => {
        const { match } = this.state;
        this.props.firebase
            .addMatch(match)
            .then(() => {
                this.props.history.push(ROUTES.MATCH);
            })
            .catch(error => {
                this.setState({ error });
            });
        e.preventDefault()
    }

    onOpen = (e) => {
        if (this.state.loading) {
            this.props.firebase.getUsers()
                .then(querySnapshot => {
                    const usersList = querySnapshot.docs.map(doc => doc.data())
                    this.setState({
                        users: usersList.filter((u) => u.uid !== this.props.authUser.uid),
                        loading: false,
                        currentUser: usersList.find((u) => u.uid === this.props.authUser.uid),
                    });
                });
        }
        e.preventDefault()

    }

    onChange = (e, value) => {
        const { match, currentUser } = this.state
        const user = value || {}
        this.setState({
            match: {
                ...match,
                host: currentUser.username,
                host_uid: currentUser.uid,
                opponent: user.username || '',
                opponent_uid: user.uid || '',
            }
        });
    };

    onChangeMatchDate = (date) => {
        const { match } = this.state;
        this.setState({
            match: {
                ...match,
                match_date: date
            }
        });
    };

    onChangeMatchDetails = (e, value) => {
        const { match } = this.state;
        this.setState({
            match: {
                ...match,
                [e.target.name]: value
            }
        });
    };

    render() {
        const { users, loading, match } = this.state;
        const isEmpty = (element) => element === '';
        const isDisabled = () => {
            return Object.values(match).some(isEmpty)
        };
        const { t } = this.props;

        return (
            <div>
                <FormControl>
                    <Typography variant="h5" gutterBottom>
                        {t('new_match')}
                    </Typography>
                    <FormLabel component="legend">{t('create_match')}</FormLabel>
                    <Autocomplete
                        id="opponent"
                        loading={loading}
                        autoComplete={true}
                        options={users}
                        onChange={this.onChange}
                        onOpen={this.onOpen}
                        style={{ width: 300 }}
                        getOptionLabel={(user) => user.username}
                        renderInput={(params) => <TextField {...params} label="Opponent" variant="outlined" name="opponent" />}
                    />
                    <FormLabel component="legend">{t('match_type')}</FormLabel>
                    <RadioGroup defaultValue="friendly" aria-label="match_type" name="match_type" value={match.match_type} onChange={this.onChangeMatchDetails}>
                        <FormControlLabel value="ranked" control={<Radio />} label={t('ranked')} />
                        <FormControlLabel value="friendly" control={<Radio />} label={t('friendly')} />
                    </RadioGroup>
                    <FormLabel component="legend">{t('players')}</FormLabel>
                    <RadioGroup defaultValue="1vs1" aria-label="players" name="players" value={match.players} onChange={this.onChangeMatchDetails}>
                        <FormControlLabel value="1vs1" control={<Radio />} label="1vs1" />
                        <FormControlLabel value="2vs2" control={<Radio />} label="2vs2" />
                    </RadioGroup>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            variant="inline"
                            id="date-picker-dialog"
                            label={t('match_date')}
                            format="dd/MM/yyyy"
                            value={match.match_date}
                            onChange={this.onChangeMatchDate}
                        />
                    </MuiPickersUtilsProvider>
                    <Button disabled={isDisabled()} type="submit" variant="contained" onClick={e => this.onSubmit(e)}>{t('create')}</Button>
                </FormControl>
            </div>
        );
    }
}

export default withAuthUser(withTranslation()(MatchCreatePage));