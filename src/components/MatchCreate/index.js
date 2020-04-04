import React, { Component } from 'react';
import 'date-fns';
import { Link } from 'react-router-dom';
import {TextField, Button, Typography, 
    RadioGroup, Radio, FormControlLabel, FormLabel, FormControl} from '@material-ui/core';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardDatePicker,
} from '@material-ui/pickers';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withAuthUser } from '../Session';
import * as ROUTES from '../../constants/routes';
import { withTranslation } from 'react-i18next';

class MatchCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            users: [],
            match: {
                host: '',
                host_uid: '',
                opponent: '',
                opponent_uid: '',
                status: 'pending',
                match_date: '',
                players: '1vs1',
                match_type: 'friendly'
            },
        };
        console.log(this.props)
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
        const match = this.state.match
        this.setState({
            match: {
                host: this.state.currentUser.username,
                host_uid: this.state.currentUser.uid,
                opponent: value.username,
                opponent_uid: value.uid,
                match_date: match.match_date,
                players: match.players,
                match_type: match.match_type
            }
        }
        );
    };

    onChangeMatchDate = (e, value) => {
        const match = this.state.match
        this.setState({
            match: {                
                host: match.host,
                host_uid: match.host_uid,
                opponent: match.opponent,
                opponent_uid: match.opponent_uid,
                match_date: value,
                players: match.players,
                match_type: match.match_type            
            }
        }
        );
    };
    onChangePlayers = (e, value) => {
        const match = this.state.match
        this.setState({
            match: {                
                host: match.host,
                host_uid: match.host_uid,
                opponent: match.opponent,
                opponent_uid: match.opponent_uid,
                match_date: match.match_date,
                players: value,
                match_type: match.match_type            
            }
        }
        );
    };
    onChangeMatchType = (e, value) => {
        const match = this.state.match
        this.setState({
            match: {                
                host: match.host,
                host_uid: match.host_uid,
                opponent: match.opponent,
                opponent_uid: match.opponent_uid,
                match_date: match.match_date,
                players: match.players,
                match_type: value            
            }
        }
        );
    };

    render() {
        const { users, loading} = this.state;
        const { t } = this.props;
        let match_date, match_type, players;

        console.log(this.props)
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
                        renderInput={(params) => <TextField {...params} label="Opponent" variant="outlined" />}
                    />
                    <FormLabel component="legend">{t('match_type')}</FormLabel>
                    <RadioGroup defaultValue="friendly" aria-label="match_type" name="match_type1" value={match_type} onChange={this.onChangeMatchType}>
                        <FormControlLabel value="ranked" control={<Radio />} label={t('ranked')} />
                        <FormControlLabel value="friendly" control={<Radio />} label={t('friendly')} />
                    </RadioGroup>
                    <FormLabel component="legend">{t('players')}</FormLabel>
                    <RadioGroup defaultValue="1vs1" aria-label="players" name="players1" value={players} onChange={this.onChangePlayers}>
                        <FormControlLabel value="1vs1" control={<Radio />} label="1vs1" />
                        <FormControlLabel value="2vs2" control={<Radio />} label="2vs2" />
                    </RadioGroup>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                            margin="normal"
                            id="date-picker-dialog"
                            label={t('match_date')}
                            format="dd/MM/yyyy"
                            value={match_date}
                            onChange={this.onChangeMatchDate}
                        />
                    </MuiPickersUtilsProvider>
                    <Button type="submit" variant="contained" onClick={e => this.onSubmit(e)}>{t('create')}</Button>
                </FormControl>
            </div>
        );
    }
}

const NewMatchLink = () => (
    <p>
        <Link to={ROUTES.MATCH_CREATE} style={{ color: '#FFF' }}>New Match!</Link>
    </p>
);

export default withAuthUser(withTranslation()(MatchCreatePage));
export { NewMatchLink };