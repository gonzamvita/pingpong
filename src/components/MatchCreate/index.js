import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import { FormHelperText, TextField, Button } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

import { withAuthUser } from '../Session';
import * as ROUTES from '../../constants/routes';

class MatchCreatePage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            users: [],
            match: {},
        };
    }

    componentDidMount() {
        this.setState({ loading: true });

        this.props.firebase.getUsers()
            // .where('uid', '!=', this.props.authUser.uid)
            .then(querySnapshot => {
                const usersList = querySnapshot.docs.map(doc => doc.data())
                this.setState({
                    users: usersList,
                    loading: false,
                    currentUser: 'currentUser',
                });
            });
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

    onChange = (e, value) => {
        this.setState({
            match: {
                opponent: value.uid,
                host: this.state.currentUser
            }
        }
        );
    };

    render() {
        const { users, loading } = this.state;

        console.log(this.props)
        return (
            <div>
                <h1>Match</h1>
                <form>
                    <FormHelperText>Select a player to play the match with:</FormHelperText>
                    <Autocomplete
                        id="opponent"
                        loading={loading}
                        autoComplete={true}
                        options={users}
                        onChange={this.onChange}
                        style={{ width: 300 }}
                        getOptionLabel={(user) => user.username}
                        renderInput={(params) => <TextField {...params} label="Opponent" variant="outlined" />}
                    />
                    <Button type="submit" variant="contained" onClick={e => this.onSubmit(e)}>Create</Button>
                </form>
            </div>
        );
    }
}

const NewMatchLink = () => (
    <p>
        <Link to={ROUTES.MATCH_CREATE}>New Match!</Link>
    </p>
);

export default withAuthUser(MatchCreatePage);
export { NewMatchLink };